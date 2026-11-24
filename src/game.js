import { SKILLS, RESOURCE_TYPES, RECIPES, MONSTER_TYPES } from './data.js';
import { Player, ResourceNode, Monster, Particle, FloatingText } from './entities.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.worldWidth = 3200;
    this.worldHeight = 3200;

    this.camera = { x: 0, y: 0, width: canvas.width, height: canvas.height };

    this.player = new Player(1600, 1600);
    this.nodes = [];
    this.monsters = [];
    this.particles = [];
    this.floatingTexts = [];

    this.input = {
      up: false,
      down: false,
      left: false,
      right: false,
      joyX: 0,
      joyY: 0,
      action: false
    };

    this.lastTime = performance.now();
    this.spawnTimer = 0;
    this.bossTimer = 60; // Boss spawns or wanders

    this.initWorld();
    this.loadSave();
    this.setupControls();
  }

  initWorld() {
    this.nodes = [];
    this.monsters = [];

    // Distribute resources by zones
    // 1. Forest Zone (Center & North)
    for (let i = 0; i < 90; i++) {
      const x = 1000 + Math.random() * 1200;
      const y = 800 + Math.random() * 1200;
      this.nodes.push(new ResourceNode(x, y, 'wood'));
    }
    for (let i = 0; i < 60; i++) {
      const x = 800 + Math.random() * 1600;
      const y = 800 + Math.random() * 1600;
      this.nodes.push(new ResourceNode(x, y, 'stone'));
    }

    // 2. Iron Hills (West)
    for (let i = 0; i < 55; i++) {
      const x = 200 + Math.random() * 900;
      const y = 500 + Math.random() * 1800;
      this.nodes.push(new ResourceNode(x, y, Math.random() < 0.7 ? 'iron' : 'stone'));
    }

    // 3. Gold Dunes (East)
    for (let i = 0; i < 45; i++) {
      const x = 2100 + Math.random() * 900;
      const y = 500 + Math.random() * 1800;
      this.nodes.push(new ResourceNode(x, y, Math.random() < 0.65 ? 'gold' : 'iron'));
    }

    // 4. Diamond Caverns (North-East)
    for (let i = 0; i < 35; i++) {
      const x = 1800 + Math.random() * 1200;
      const y = 200 + Math.random() * 800;
      this.nodes.push(new ResourceNode(x, y, 'diamond'));
    }

    // 5. Obsidian Crater (South-West)
    for (let i = 0; i < 30; i++) {
      const x = 300 + Math.random() * 1100;
      const y = 2000 + Math.random() * 1000;
      this.nodes.push(new ResourceNode(x, y, 'obsidian'));
    }

    // 6. Mythril Celestial Field (South-East)
    for (let i = 0; i < 25; i++) {
      const x = 1800 + Math.random() * 1200;
      const y = 2000 + Math.random() * 1000;
      this.nodes.push(new ResourceNode(x, y, 'mythril'));
    }

    // Monsters spawn
    for (let i = 0; i < 22; i++) {
      const x = 800 + Math.random() * 1600;
      const y = 800 + Math.random() * 1600;
      this.monsters.push(new Monster(x, y, 'slime'));
    }
    for (let i = 0; i < 16; i++) {
      const x = 300 + Math.random() * 1200;
      const y = 500 + Math.random() * 1800;
      this.monsters.push(new Monster(x, y, 'spider'));
    }
    for (let i = 0; i < 14; i++) {
      const x = 1800 + Math.random() * 1200;
      const y = 600 + Math.random() * 1600;
      this.monsters.push(new Monster(x, y, 'golem'));
    }
    for (let i = 0; i < 10; i++) {
      const x = 1000 + Math.random() * 1500;
      const y = 2000 + Math.random() * 1000;
      this.monsters.push(new Monster(x, y, 'wraith'));
    }

    // Boss Titan at south border
    this.monsters.push(new Monster(1600, 2700, 'boss_titan'));
  }

  setupControls() {
    window.addEventListener('keydown', e => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') this.input.up = true;
      if (k === 's' || k === 'arrowdown') this.input.down = true;
      if (k === 'a' || k === 'arrowleft') this.input.left = true;
      if (k === 'd' || k === 'arrowright') this.input.right = true;
      if (k === ' ' || k === 'e') {
        this.performAction();
      }
      if (k === '1') this.useSkill('skill_20');
      if (k === '2') this.useSkill('skill_40');
      if (k === '3') this.useSkill('skill_60');
      if (k === '4') this.useSkill('skill_80');
      if (k === '5') this.useSkill('skill_100');
    });

    window.addEventListener('keyup', e => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') this.input.up = false;
      if (k === 's' || k === 'arrowdown') this.input.down = false;
      if (k === 'a' || k === 'arrowleft') this.input.left = false;
      if (k === 'd' || k === 'arrowright') this.input.right = false;
    });

    // Mouse click on canvas for action / mining
    this.canvas.addEventListener('pointerdown', e => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left + this.camera.x;
      const clickY = e.clientY - rect.top + this.camera.y;

      const dist = Math.hypot(clickX - this.player.x, clickY - this.player.y);
      if (dist < 140) {
        this.performAction();
      } else {
        // Move towards click or interact
        const angle = Math.atan2(clickY - this.player.y, clickX - this.player.x);
        this.player.facing = Math.cos(angle) > 0 ? 1 : -1;
        this.performAction();
      }
    });
  }

  performAction() {
    this.player.triggerSwing();

    let acted = false;
    const reach = 65;

    // Check closest monster to attack
    for (const m of this.monsters) {
      if (m.dead) continue;
      const dist = Math.hypot(m.x - this.player.x, m.y - this.player.y);
      if (dist < reach + m.radius) {
        acted = true;
        let isCrit = Math.random() < this.player.stats.crit;
        let dmg = Math.floor(this.player.stats.atk * (isCrit ? 1.8 : 1.0));

        // Berserk lifesteal
        if (this.player.activeBuffs.berserk > 0) {
          this.player.hp = Math.min(this.player.maxHp, this.player.hp + Math.floor(this.player.maxHp * 0.04));
        }

        const isDead = m.takeDamage(dmg);
        window.soundEngine.playMonsterHurt();

        // Particles
        for (let i = 0; i < 6; i++) {
          this.particles.push(new Particle(m.x, m.y, '#ff1744', 3, 3));
        }

        // Floating text
        this.floatingTexts.push(
          new FloatingText(m.x, m.y - 10, `${isCrit ? 'CHÍ MẠNG! ' : ''}-${dmg}`, isCrit ? '#ffeb3b' : '#ff5252', isCrit ? 18 : 14, true)
        );

        if (isDead) {
          // Drops
          m.meta.drops.forEach(d => {
            if (Math.random() <= d.chance) {
              this.player.inventory[d.id] = (this.player.inventory[d.id] || 0) + d.count;
              const resMeta = RESOURCE_TYPES[d.id];
              this.floatingTexts.push(
                new FloatingText(m.x, m.y - 25, `+${d.count} ${resMeta ? resMeta.name : d.id}`, '#ffd54f')
              );
            }
          });
          this.player.addExp(m.meta.exp, (lvl) => this.onPlayerLevelUp(lvl));
          this.floatingTexts.push(new FloatingText(m.x, m.y - 45, `+${m.meta.exp} EXP`, '#00e5ff', 16, true));
        }
        break;
      }
    }

    // Check closest resource node
    if (!acted) {
      for (const node of this.nodes) {
        if (!node.active) continue;
        const dist = Math.hypot(node.x - this.player.x, node.y - this.player.y);
        if (dist < reach + node.radius) {
          acted = true;
          if (node.type === 'wood') {
            window.soundEngine.playChop();
          } else {
            window.soundEngine.playMine();
          }

          let minePwr = this.player.stats.minePower;
          if (this.player.activeBuffs.titan > 0) minePwr = 9999;

          const isBroken = node.hit(minePwr);

          // Particles
          for (let i = 0; i < 5; i++) {
            this.particles.push(new Particle(node.x, node.y, node.meta.color, 2.5, 3));
          }

          if (isBroken) {
            this.harvestNode(node);
          }
          break;
        }
      }
    }

    if (!acted) {
      window.soundEngine.playSwing();
    }
  }

  harvestNode(node) {
    let dropType = node.type;

    // Lv 50 Passive: Bàn Tay Luyện Kim (Transmutation)
    if (this.player.miningLevel >= 50 && Math.random() < 0.2) {
      if (dropType === 'stone') dropType = 'iron';
      else if (dropType === 'iron') dropType = 'gold';
      else if (dropType === 'gold') dropType = 'diamond';
      else if (dropType === 'diamond') dropType = 'obsidian';
    }

    let dropCount = 1;
    // Lv 10 Passive: Mắt Tinh Anh (25% double drop)
    if (this.player.miningLevel >= 10 && Math.random() < 0.25) {
      dropCount = 2;
    }
    if (this.player.activeBuffs.titan > 0) {
      dropCount *= 3;
    }

    this.player.inventory[dropType] = (this.player.inventory[dropType] || 0) + dropCount;
    const expGained = node.meta.exp;
    this.player.addExp(expGained, (lvl) => this.onPlayerLevelUp(lvl));

    const meta = RESOURCE_TYPES[dropType] || node.meta;
    this.floatingTexts.push(
      new FloatingText(node.x, node.y - 10, `+${dropCount} ${meta.name}`, meta.color, 15, true)
    );
    this.floatingTexts.push(
      new FloatingText(node.x, node.y - 28, `+${expGained} EXP`, '#00e5ff')
    );

    // Save game
    this.saveGame();
  }

  useSkill(skillId) {
    const skill = SKILLS.find(s => s.id === skillId);
    if (!skill || skill.type !== 'active') return;

    if (this.player.miningLevel < skill.reqLevel) {
      this.floatingTexts.push(new FloatingText(this.player.x, this.player.y - 30, `Yêu cầu cấp ${skill.reqLevel}!`, '#ff5252', 14));
      return;
    }

    if (this.player.skillCooldowns[skillId] > 0) {
      this.floatingTexts.push(
        new FloatingText(this.player.x, this.player.y - 30, `Hồi chiêu: ${Math.ceil(this.player.skillCooldowns[skillId])}s`, '#ffa726', 13)
      );
      return;
    }

    // Trigger skill
    this.player.skillCooldowns[skillId] = skill.cooldown;

    if (skillId === 'skill_20') {
      // Cú Nện Chấn Động
      window.soundEngine.playSkill('smash');
      this.floatingTexts.push(new FloatingText(this.player.x, this.player.y - 40, '⚡ CÚ NỆN CHẤN ĐỘNG!', '#ffeb3b', 18, true));
      // Radius effect
      const radius = skill.effect.radius;
      // AoE damage to monsters
      for (const m of this.monsters) {
        if (m.dead) continue;
        if (Math.hypot(m.x - this.player.x, m.y - this.player.y) <= radius) {
          m.takeDamage(skill.effect.damage);
          this.floatingTexts.push(new FloatingText(m.x, m.y, `-${skill.effect.damage}`, '#ff1744', 16, true));
        }
      }
      // AoE mining
      for (const node of this.nodes) {
        if (!node.active) continue;
        if (Math.hypot(node.x - this.player.x, node.y - this.player.y) <= radius) {
          node.hit(999);
          this.harvestNode(node);
        }
      }
      // Visual ground wave
      for (let i = 0; i < 20; i++) {
        this.particles.push(new Particle(this.player.x, this.player.y, '#ffd54f', 4, 5, 0.8));
      }
    } else if (skillId === 'skill_40') {
      // Cuồng Nộ Địa Mẫu
      window.soundEngine.playSkill('buff');
      this.player.activeBuffs.berserk = skill.duration;
      this.player.recalculateStats();
      this.floatingTexts.push(new FloatingText(this.player.x, this.player.y - 40, '🔥 CUỒNG NỘ ĐỊA MẪU!', '#ff3d00', 18, true));
      for (let i = 0; i < 15; i++) {
        this.particles.push(new Particle(this.player.x, this.player.y, '#ff3d00', 3, 4, 0.7));
      }
    } else if (skillId === 'skill_60') {
      // Vòng Xoáy Thần Tốc
      window.soundEngine.playSkill('quake');
      this.player.activeBuffs.whirlwind = skill.duration;
      this.floatingTexts.push(new FloatingText(this.player.x, this.player.y - 40, '🌪️ VÒNG XOÁY THẦN TỐC!', '#00e5ff', 18, true));
    } else if (skillId === 'skill_80') {
      // Khai Mỏ Thần Quang
      window.soundEngine.playSkill('titan');
      this.floatingTexts.push(new FloatingText(this.player.x, this.player.y - 50, '☄️ KHAI MỎ THẦN QUANG!', '#e040fb', 20, true));
      // Mine visible nodes
      this.nodes.forEach(node => {
        if (!node.active) return;
        const dist = Math.hypot(node.x - this.player.x, node.y - this.player.y);
        if (dist < 600) {
          node.hit(999);
          this.harvestNode(node);
          for (let i = 0; i < 8; i++) {
            this.particles.push(new Particle(node.x, node.y, '#e040fb', 4, 4, 0.6));
          }
        }
      });
      // Damage monsters
      this.monsters.forEach(m => {
        if (m.dead) return;
        const dist = Math.hypot(m.x - this.player.x, m.y - this.player.y);
        if (dist < 600) {
          m.takeDamage(skill.effect.damage);
          this.floatingTexts.push(new FloatingText(m.x, m.y, `-${skill.effect.damage}`, '#e040fb', 18, true));
        }
      });
    } else if (skillId === 'skill_100') {
      // Thần Khai Mỏ Tối Thượng
      window.soundEngine.playSkill('titan');
      this.player.activeBuffs.titan = skill.duration;
      this.player.hp = this.player.maxHp;
      this.player.recalculateStats();
      this.floatingTexts.push(new FloatingText(this.player.x, this.player.y - 60, '👑 THẦN KHAI MỎ TỐI THƯỢNG (TITAN)!', '#ffd700', 22, true));
      for (let i = 0; i < 30; i++) {
        this.particles.push(new Particle(this.player.x, this.player.y, '#ffd700', 6, 6, 1.2));
      }
    }
  }

  onPlayerLevelUp(newLevel) {
    window.soundEngine.playLevelUp();
    this.floatingTexts.push(
      new FloatingText(this.player.x, this.player.y - 50, `⭐ LÊN CẤP KHAI THÁC ${newLevel}!`, '#00e676', 22, true)
    );

    // Check if new skill unlocked at 10, 20, 30 ... 100
    const unlockedSkill = SKILLS.find(s => s.reqLevel === newLevel);
    if (unlockedSkill) {
      setTimeout(() => {
        this.floatingTexts.push(
          new FloatingText(this.player.x, this.player.y - 75, `✨ MỞ KHÓA KỸ NĂNG: [${unlockedSkill.name}]!`, '#ffd700', 18, true)
        );
      }, 500);
    }

    this.saveGame();
    if (this.onLevelUpCallback) this.onLevelUpCallback(newLevel);
  }

  craft(recipeId) {
    const recipe = RECIPES.find(r => r.id === recipeId);
    if (!recipe) return { success: false, msg: 'Không tìm thấy công thức!' };

    // Check cost (Lv 70 passive reduces 25% cost)
    let costMult = 1.0;
    if (this.player.miningLevel >= 70) costMult = 0.75;

    for (const res in recipe.cost) {
      const required = Math.max(1, Math.floor(recipe.cost[res] * costMult));
      if ((this.player.inventory[res] || 0) < required) {
        const meta = RESOURCE_TYPES[res];
        return { success: false, msg: `Thiếu ${meta ? meta.name : res}! (${this.player.inventory[res] || 0}/${required})` };
      }
    }

    // Deduct cost
    for (const res in recipe.cost) {
      const required = Math.max(1, Math.floor(recipe.cost[res] * costMult));
      this.player.inventory[res] -= required;
    }

    // Equip
    this.player.equipment[recipe.category] = recipe.id;
    this.player.recalculateStats();

    window.soundEngine.playCraft();
    this.floatingTexts.push(
      new FloatingText(this.player.x, this.player.y - 30, `ĐÃ CHẾ TẠO: ${recipe.name}!`, '#00e676', 16, true)
    );

    this.saveGame();
    return { success: true, msg: `Đã chế tạo và trang bị thành công: ${recipe.name}!` };
  }

  saveGame() {
    const data = {
      miningLevel: this.player.miningLevel,
      miningExp: this.player.miningExp,
      inventory: this.player.inventory,
      equipment: this.player.equipment
    };
    try {
      localStorage.setItem('antigravity_craft_rpg_save', JSON.stringify(data));
    } catch (e) {
      console.warn('Cannot save to localStorage', e);
    }
  }

  loadSave() {
    try {
      const raw = localStorage.getItem('antigravity_craft_rpg_save');
      if (raw) {
        const data = JSON.parse(raw);
        if (data.miningLevel) this.player.miningLevel = data.miningLevel;
        if (data.miningExp) this.player.miningExp = data.miningExp;
        if (data.inventory) this.player.inventory = { ...this.player.inventory, ...data.inventory };
        if (data.equipment) this.player.equipment = { ...this.player.equipment, ...data.equipment };
        this.player.miningExpNeeded = this.player.calcExpNeeded(this.player.miningLevel);
        this.player.recalculateStats();
      }
    } catch (e) {
      console.warn('Cannot load save', e);
    }
  }

  resetSave() {
    localStorage.removeItem('antigravity_craft_rpg_save');
    window.location.reload();
  }

  update(dt) {
    // Player
    this.player.update(dt, this.input);

    // Keep player in bounds
    this.player.x = Math.max(20, Math.min(this.worldWidth - 20, this.player.x));
    this.player.y = Math.max(20, Math.min(this.worldHeight - 20, this.player.y));

    // Whirlwind skill continuous attack (Lv 60)
    if (this.player.activeBuffs.whirlwind > 0) {
      for (const m of this.monsters) {
        if (m.dead) continue;
        if (Math.hypot(m.x - this.player.x, m.y - this.player.y) < 120) {
          m.takeDamage(60 * dt);
        }
      }
      for (const node of this.nodes) {
        if (!node.active) continue;
        if (Math.hypot(node.x - this.player.x, node.y - this.player.y) < 120) {
          if (node.hit(120 * dt)) {
            this.harvestNode(node);
          }
        }
      }
    }

    // Camera follow smoothly
    this.camera.width = this.canvas.width;
    this.camera.height = this.canvas.height;
    this.camera.x += (this.player.x - this.canvas.width / 2 - this.camera.x) * 0.1;
    this.camera.y += (this.player.y - this.canvas.height / 2 - this.camera.y) * 0.1;
    this.camera.x = Math.max(0, Math.min(this.worldWidth - this.canvas.width, this.camera.x));
    this.camera.y = Math.max(0, Math.min(this.worldHeight - this.canvas.height, this.camera.y));

    // Nodes update
    for (const node of this.nodes) {
      node.update(dt);
    }

    // Monsters update
    for (const m of this.monsters) {
      m.update(dt, this.player);
    }

    // Respawn slain regular monsters occasionally
    this.spawnTimer += dt;
    if (this.spawnTimer > 10) {
      this.spawnTimer = 0;
      const deadIdx = this.monsters.findIndex(m => m.dead && !m.isBoss);
      if (deadIdx !== -1) {
        const m = this.monsters[deadIdx];
        m.dead = false;
        m.hp = m.maxHp;
        m.x = m.spawnX;
        m.y = m.spawnY;
      }
    }

    // Particles & Floating texts
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].life <= 0) this.particles.splice(i, 1);
    }

    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      this.floatingTexts[i].update();
      if (this.floatingTexts[i].life <= 0) this.floatingTexts.splice(i, 1);
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw Grid / Ground Terrain
    this.drawTerrain();

    // Draw Resource Nodes
    for (const node of this.nodes) {
      // Culling
      if (
        node.x > this.camera.x - 50 &&
        node.x < this.camera.x + this.canvas.width + 50 &&
        node.y > this.camera.y - 50 &&
        node.y < this.camera.y + this.canvas.height + 50
      ) {
        node.draw(this.ctx, this.camera);
      }
    }

    // Draw Monsters
    for (const m of this.monsters) {
      if (
        m.x > this.camera.x - 50 &&
        m.x < this.camera.x + this.canvas.width + 50 &&
        m.y > this.camera.y - 50 &&
        m.y < this.camera.y + this.canvas.height + 50
      ) {
        m.draw(this.ctx, this.camera);
      }
    }

    // Draw Player
    this.player.draw(this.ctx, this.camera);

    // Draw Particles
    for (const p of this.particles) {
      p.draw(this.ctx, this.camera);
    }

    // Draw Floating Texts
    for (const ft of this.floatingTexts) {
      ft.draw(this.ctx, this.camera);
    }

    // Draw Minimap
    this.drawMinimap();
  }

  drawTerrain() {
    const startCol = Math.floor(this.camera.x / 100);
    const endCol = Math.ceil((this.camera.x + this.canvas.width) / 100);
    const startRow = Math.floor(this.camera.y / 100);
    const endRow = Math.ceil((this.camera.y + this.canvas.height) / 100);

    for (let c = startCol; c <= endCol; c++) {
      for (let r = startRow; r <= endRow; r++) {
        const wx = c * 100;
        const wy = r * 100;
        const sx = wx - this.camera.x;
        const sy = wy - this.camera.y;

        // Subtle biome shading based on coordinates
        if (wy > 2000) {
          this.ctx.fillStyle = wx > 1600 ? '#261b2b' : '#2b1b17'; // Mythril / Obsidian zone
        } else if (wx > 2000) {
          this.ctx.fillStyle = '#2d2a1b'; // Desert Gold
        } else if (wx < 1000) {
          this.ctx.fillStyle = '#1e2427'; // Iron Quarry
        } else {
          this.ctx.fillStyle = '#1b281d'; // Forest / Grassland
        }

        this.ctx.fillRect(sx, sy, 100, 100);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
        this.ctx.strokeRect(sx, sy, 100, 100);
      }
    }
  }

  drawMinimap() {
    const mapSize = 110;
    const margin = 12;
    const mx = this.canvas.width - mapSize - margin;
    const my = margin;

    this.ctx.save();
    // Background
    this.ctx.fillStyle = 'rgba(10, 15, 20, 0.85)';
    this.ctx.fillRect(mx, my, mapSize, mapSize);
    this.ctx.strokeStyle = '#ffd700';
    this.ctx.lineWidth = 1.5;
    this.ctx.strokeRect(mx, my, mapSize, mapSize);

    const scale = mapSize / this.worldWidth;

    // Draw Nodes
    for (const node of this.nodes) {
      if (!node.active) continue;
      this.ctx.fillStyle = node.meta.color;
      this.ctx.fillRect(mx + node.x * scale, my + node.y * scale, 2, 2);
    }

    // Draw Monsters
    for (const m of this.monsters) {
      if (m.dead) continue;
      this.ctx.fillStyle = m.isBoss ? '#ffd700' : '#ff1744';
      this.ctx.fillRect(mx + m.x * scale, my + m.y * scale, m.isBoss ? 4 : 2, m.isBoss ? 4 : 2);
    }

    // Draw Player
    this.ctx.fillStyle = '#00e5ff';
    this.ctx.beginPath();
    this.ctx.arc(mx + this.player.x * scale, my + this.player.y * scale, 3.5, 0, Math.PI * 2);
    this.ctx.fill();

    this.ctx.restore();
  }

  start() {
    const loop = (timestamp) => {
      const dt = Math.min(0.1, (timestamp - this.lastTime) / 1000);
      this.lastTime = timestamp;

      this.update(dt);
      this.draw();

      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}
