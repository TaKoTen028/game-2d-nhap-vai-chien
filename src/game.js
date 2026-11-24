import { RAW_RESOURCES, TOOLS, EQUIPMENT_RECIPES, FACTORY_PRODUCTS, MONSTER_TYPES, SKILLS } from './data.js';
import { Player, ResourceNode, Monster, Particle, FloatingText } from './entities.js';

export class Game {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    this.worldWidth = 3600;
    this.worldHeight = 3600;

    this.camera = { x: 0, y: 0, width: canvas.width, height: canvas.height };

    this.player = new Player(1800, 1800);
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

    // Sandship Factory Automation state
    this.factoryRunning = false;
    this.factoryTimer = 0;
    this.conveyorItems = []; // Visual items riding on conveyor belt

    this.lastTime = performance.now();
    this.initWorld();
    this.loadSave();
    this.setupControls();
  }

  initWorld() {
    this.nodes = [];
    this.monsters = [];

    // Distribute 10 tiers of resources across zones
    const levels = [1, 5, 12, 18, 22, 28, 34, 40, 45, 50];

    levels.forEach(lv => {
      const woodKey = `wood_${lv}`;
      const oreKey = `ore_${lv}`;
      const floraKey = `flora_${lv}`;

      // Calculate radius/distance from center (1800, 1800)
      const distFromCenter = (lv / 50) * 1400;

      // Spawn trees
      for (let i = 0; i < 15; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = distFromCenter + (Math.random() * 300 - 150);
        const x = Math.max(100, Math.min(this.worldWidth - 100, 1800 + Math.cos(angle) * dist));
        const y = Math.max(100, Math.min(this.worldHeight - 100, 1800 + Math.sin(angle) * dist));
        this.nodes.push(new ResourceNode(x, y, woodKey));
      }

      // Spawn ores
      for (let i = 0; i < 14; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = distFromCenter + (Math.random() * 300 - 150);
        const x = Math.max(100, Math.min(this.worldWidth - 100, 1800 + Math.cos(angle) * dist));
        const y = Math.max(100, Math.min(this.worldHeight - 100, 1800 + Math.sin(angle) * dist));
        this.nodes.push(new ResourceNode(x, y, oreKey));
      }

      // Spawn cotton & flora
      for (let i = 0; i < 10; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = distFromCenter + (Math.random() * 300 - 150);
        const x = Math.max(100, Math.min(this.worldWidth - 100, 1800 + Math.cos(angle) * dist));
        const y = Math.max(100, Math.min(this.worldHeight - 100, 1800 + Math.sin(angle) * dist));
        this.nodes.push(new ResourceNode(x, y, floraKey));
      }
    });

    // Spawn monsters
    for (let i = 0; i < 20; i++) {
      this.monsters.push(new Monster(1400 + Math.random() * 800, 1400 + Math.random() * 800, 'rabbit'));
    }
    for (let i = 0; i < 16; i++) {
      this.monsters.push(new Monster(800 + Math.random() * 2000, 800 + Math.random() * 2000, 'wolf'));
    }
    for (let i = 0; i < 14; i++) {
      this.monsters.push(new Monster(600 + Math.random() * 2400, 600 + Math.random() * 2400, 'boar'));
    }
    for (let i = 0; i < 12; i++) {
      this.monsters.push(new Monster(400 + Math.random() * 2800, 400 + Math.random() * 2800, 'leopard'));
    }
    for (let i = 0; i < 8; i++) {
      this.monsters.push(new Monster(300 + Math.random() * 3000, 300 + Math.random() * 3000, 'bear'));
    }

    // Boss Titan in deepest south
    this.monsters.push(new Monster(1800, 3200, 'boss_titan'));
  }

  setupControls() {
    window.addEventListener('keydown', e => {
      const k = e.key.toLowerCase();
      if (k === 'w' || k === 'arrowup') this.input.up = true;
      if (k === 's' || k === 'arrowdown') this.input.down = true;
      if (k === 'a' || k === 'arrowleft') this.input.left = true;
      if (k === 'd' || k === 'arrowright') this.input.right = true;
      if (k === ' ' || k === 'e') this.performAction();
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

    this.canvas.addEventListener('pointerdown', e => {
      const rect = this.canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left + this.camera.x;
      const clickY = e.clientY - rect.top + this.camera.y;

      const angle = Math.atan2(clickY - this.player.y, clickX - this.player.x);
      this.player.facing = Math.cos(angle) > 0 ? 1 : -1;
      this.performAction();
    });
  }

  performAction() {
    this.player.triggerSwing();

    let acted = false;
    const reach = 70;

    // Check monster attack & skinning
    for (const m of this.monsters) {
      if (m.dead) continue;
      const dist = Math.hypot(m.x - this.player.x, m.y - this.player.y);
      if (dist < reach + m.radius) {
        acted = true;
        let isCrit = Math.random() < this.player.stats.crit;
        let dmg = Math.floor(this.player.stats.atk * (isCrit ? 1.8 : 1.0));

        if (this.player.activeBuffs.berserk > 0) {
          this.player.hp = Math.min(this.player.maxHp, this.player.hp + Math.floor(this.player.maxHp * 0.05));
        }

        const isDead = m.takeDamage(dmg);
        window.soundEngine.playMonsterHurt();

        for (let i = 0; i < 5; i++) {
          this.particles.push(new Particle(m.x, m.y, '#ff1744', 3, 3));
        }

        this.floatingTexts.push(
          new FloatingText(m.x, m.y - 10, `${isCrit ? 'CHÍ MẠNG! ' : ''}-${dmg}`, isCrit ? '#ffeb3b' : '#ff5252', isCrit ? 18 : 14, true)
        );

        if (isDead) {
          // Check knife level for skinning pelt
          const peltId = m.meta.peltId;
          const peltMeta = RAW_RESOURCES[peltId];
          const knifeLv = this.player.getToolLevel('knife');

          if (peltMeta && knifeLv >= peltMeta.reqLv) {
            window.soundEngine.playSkinning();
            const count = Math.random() < 0.3 ? 2 : 1;
            this.player.inventory[peltId] = (this.player.inventory[peltId] || 0) + count;
            this.floatingTexts.push(new FloatingText(m.x, m.y - 25, `+${count} ${peltMeta.name}`, '#ffd54f', 15, true));
          } else if (peltMeta) {
            this.floatingTexts.push(new FloatingText(m.x, m.y - 25, `Cần Dao Lv ${peltMeta.reqLv} để lột da!`, '#ffa726', 12));
          }

          this.player.addExp(m.meta.exp, (lvl) => this.onPlayerLevelUp(lvl));
          this.floatingTexts.push(new FloatingText(m.x, m.y - 45, `+${m.meta.exp} EXP`, '#00e5ff', 16, true));
        }
        break;
      }
    }

    // Check Resource Node (Wood / Ore / Flora)
    if (!acted) {
      for (const node of this.nodes) {
        if (!node.active) continue;
        const dist = Math.hypot(node.x - this.player.x, node.y - this.player.y);
        if (dist < reach + node.radius) {
          acted = true;

          // Check required tool category and level
          let toolCategory = 'pickaxe';
          let toolName = 'Cuốc';
          if (node.category === 'wood') {
            toolCategory = 'axe';
            toolName = 'Rìu';
          } else if (node.category === 'flora') {
            toolCategory = 'sickle';
            toolName = 'Liềm';
          }

          const currentToolLv = this.player.getToolLevel(toolCategory);
          const reqLv = node.meta.reqLv;

          if (currentToolLv < reqLv) {
            this.floatingTexts.push(
              new FloatingText(node.x, node.y - 20, `Cần ${toolName} Cấp ${reqLv}!`, '#ff5252', 14, true)
            );
            break;
          }

          // Damage node using appropriate tool power
          if (node.category === 'wood') {
            window.soundEngine.playChop();
          } else if (node.category === 'flora') {
            window.soundEngine.playSickle();
          } else {
            window.soundEngine.playMine();
          }

          let power = this.player.getToolPower(toolCategory);
          if (this.player.activeBuffs.titan > 0) power = 9999;

          const isBroken = node.hit(power);

          for (let i = 0; i < 4; i++) {
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
    let dropKey = node.resId;

    // Lv 10 Passive: Mắt Tinh Anh (25% double drop)
    let dropCount = 1;
    if (this.player.miningLevel >= 10 && Math.random() < 0.25) {
      dropCount = 2;
    }
    if (this.player.activeBuffs.titan > 0) {
      dropCount *= 3;
    }

    this.player.inventory[dropKey] = (this.player.inventory[dropKey] || 0) + dropCount;
    const expGained = node.meta.exp;
    this.player.addExp(expGained, (lvl) => this.onPlayerLevelUp(lvl));

    this.floatingTexts.push(
      new FloatingText(node.x, node.y - 10, `+${dropCount} ${node.meta.name}`, node.meta.color, 15, true)
    );
    this.floatingTexts.push(
      new FloatingText(node.x, node.y - 28, `+${expGained} EXP`, '#00e5ff')
    );

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
        new FloatingText(this.player.x, this.player.y - 30, `Hồi: ${Math.ceil(this.player.skillCooldowns[skillId])}s`, '#ffa726', 13)
      );
      return;
    }

    this.player.skillCooldowns[skillId] = skill.cooldown;

    if (skillId === 'skill_20') {
      window.soundEngine.playSkill('smash');
      this.floatingTexts.push(new FloatingText(this.player.x, this.player.y - 40, '⚡ CÚ NỆN CHẤN ĐỘNG!', '#ffeb3b', 18, true));
      const radius = skill.effect.radius;
      for (const m of this.monsters) {
        if (!m.dead && Math.hypot(m.x - this.player.x, m.y - this.player.y) <= radius) {
          m.takeDamage(skill.effect.damage);
          this.floatingTexts.push(new FloatingText(m.x, m.y, `-${skill.effect.damage}`, '#ff1744', 16, true));
        }
      }
      for (const node of this.nodes) {
        if (node.active && Math.hypot(node.x - this.player.x, node.y - this.player.y) <= radius) {
          node.hit(999);
          this.harvestNode(node);
        }
      }
    } else if (skillId === 'skill_40') {
      window.soundEngine.playSkill('buff');
      this.player.activeBuffs.berserk = skill.duration;
      this.player.recalculateStats();
      this.floatingTexts.push(new FloatingText(this.player.x, this.player.y - 40, '🔥 CUỒNG NỘ ĐỊA MẪU!', '#ff3d00', 18, true));
    } else if (skillId === 'skill_60') {
      window.soundEngine.playSkill('quake');
      this.player.activeBuffs.whirlwind = skill.duration;
      this.floatingTexts.push(new FloatingText(this.player.x, this.player.y - 40, '🌪️ VÒNG XOÁY THẦN TỐC!', '#00e5ff', 18, true));
    } else if (skillId === 'skill_80') {
      window.soundEngine.playSkill('titan');
      this.floatingTexts.push(new FloatingText(this.player.x, this.player.y - 50, '☄️ KHAI MỎ THẦN QUANG!', '#e040fb', 20, true));
      this.nodes.forEach(node => {
        if (node.active && Math.hypot(node.x - this.player.x, node.y - this.player.y) < 650) {
          node.hit(999);
          this.harvestNode(node);
        }
      });
      this.monsters.forEach(m => {
        if (!m.dead && Math.hypot(m.x - this.player.x, m.y - this.player.y) < 650) {
          m.takeDamage(skill.effect.damage);
        }
      });
    } else if (skillId === 'skill_100') {
      window.soundEngine.playSkill('titan');
      this.player.activeBuffs.titan = skill.duration;
      this.player.hp = this.player.maxHp;
      this.player.recalculateStats();
      this.floatingTexts.push(new FloatingText(this.player.x, this.player.y - 60, '👑 THẦN KHAI MỎ TITAN!', '#ffd700', 22, true));
    }
  }

  // --- SANDSHIP FACTORY PRODUCTION ---
  runFactorySmelt(oreKey) {
    // Find matching ingot
    const prod = Object.values(FACTORY_PRODUCTS).find(p => p.from === oreKey);
    if (!prod) return { success: false, msg: 'Không có công thức nung quặng này!' };

    const needed = prod.ratio;
    if ((this.player.inventory[oreKey] || 0) < needed) {
      return { success: false, msg: `Cần ${needed} ${RAW_RESOURCES[oreKey].name} để nung!` };
    }

    this.player.inventory[oreKey] -= needed;
    this.player.inventory[prod.id] = (this.player.inventory[prod.id] || 0) + 1;
    window.soundEngine.playSmelter();

    return { success: true, msg: `Đã nung nóng thành công: 1 ${prod.name}!` };
  }

  runFactoryPress(ingotKey) {
    const prod = Object.values(FACTORY_PRODUCTS).find(p => p.fromIngot === ingotKey && p.id.startsWith('plate_'));
    if (!prod) return { success: false, msg: 'Không có khuôn dập tấm kim loại này!' };

    if ((this.player.inventory[ingotKey] || 0) < prod.ratio) {
      return { success: false, msg: `Cần ${prod.ratio} ${FACTORY_PRODUCTS[ingotKey].name} để ép tấm!` };
    }

    this.player.inventory[ingotKey] -= prod.ratio;
    this.player.inventory[prod.id] = (this.player.inventory[prod.id] || 0) + 1;
    window.soundEngine.playPress();

    return { success: true, msg: `Máy ép thủy lực đã tạo: 1 ${prod.name}!` };
  }

  runFactoryExtrude(ingotKey) {
    const prod = Object.values(FACTORY_PRODUCTS).find(p => p.fromIngot === ingotKey && p.id.startsWith('pipe_'));
    if (!prod) return { success: false, msg: 'Không có khuôn cán ống kim loại này!' };

    if ((this.player.inventory[ingotKey] || 0) < prod.ratio) {
      return { success: false, msg: `Cần ${prod.ratio} ${FACTORY_PRODUCTS[ingotKey].name} để đùn ống!` };
    }

    this.player.inventory[ingotKey] -= prod.ratio;
    this.player.inventory[prod.id] = (this.player.inventory[prod.id] || 0) + 1;
    window.soundEngine.playPress();

    return { success: true, msg: `Máy cán đùn đã chế tạo: 1 ${prod.name}!` };
  }

  runFactoryWeave(floraKey) {
    const prod = Object.values(FACTORY_PRODUCTS).find(p => p.fromFlora === floraKey);
    if (!prod) return { success: false, msg: 'Không có chỉ dẫn dệt bông này!' };

    if ((this.player.inventory[floraKey] || 0) < prod.ratio) {
      return { success: false, msg: `Cần ${prod.ratio} ${RAW_RESOURCES[floraKey].name} để dệt vải!` };
    }

    this.player.inventory[floraKey] -= prod.ratio;
    this.player.inventory[prod.id] = (this.player.inventory[prod.id] || 0) + 1;
    window.soundEngine.playSickle();

    return { success: true, msg: `Máy dệt đã tạo: 1 ${prod.name}!` };
  }

  // Craft 5 Equipment Slots
  craftEquipment(recipeId) {
    const recipe = EQUIPMENT_RECIPES.find(r => r.id === recipeId);
    if (!recipe) return { success: false, msg: 'Không tìm thấy trang bị!' };

    let costMult = this.player.miningLevel >= 70 ? 0.75 : 1.0;
    for (const res in recipe.cost) {
      const required = Math.max(1, Math.floor(recipe.cost[res] * costMult));
      if ((this.player.inventory[res] || 0) < required) {
        return { success: false, msg: `Thiếu nguyên liệu!` };
      }
    }

    for (const res in recipe.cost) {
      const required = Math.max(1, Math.floor(recipe.cost[res] * costMult));
      this.player.inventory[res] -= required;
    }

    this.player.equipment[recipe.slot] = recipe.id;
    this.player.recalculateStats();
    window.soundEngine.playCraft();
    this.saveGame();

    return { success: true, msg: `Đã trang bị: ${recipe.name}!` };
  }

  // Upgrade 4 Tools
  upgradeTool(toolId) {
    const tool = TOOLS[toolId];
    if (!tool) return { success: false, msg: 'Không tìm thấy công cụ!' };

    for (const res in tool.cost) {
      if ((this.player.inventory[res] || 0) < tool.cost[res]) {
        return { success: false, msg: `Chưa đủ nguyên liệu nâng cấp!` };
      }
    }

    for (const res in tool.cost) {
      this.player.inventory[res] -= tool.cost[res];
    }

    this.player.tools[tool.type] = tool.id;
    window.soundEngine.playCraft();
    this.saveGame();

    return { success: true, msg: `Đã nâng cấp thành công: ${tool.name} (Lv ${tool.reqLv})!` };
  }

  onPlayerLevelUp(newLevel) {
    window.soundEngine.playLevelUp();
    this.floatingTexts.push(
      new FloatingText(this.player.x, this.player.y - 50, `⭐ LÊN CẤP ${newLevel}!`, '#00e676', 22, true)
    );
    this.saveGame();
  }

  saveGame() {
    const data = {
      miningLevel: this.player.miningLevel,
      miningExp: this.player.miningExp,
      inventory: this.player.inventory,
      equipment: this.player.equipment,
      tools: this.player.tools
    };
    try {
      localStorage.setItem('antigravity_craft_rpg_save_v2', JSON.stringify(data));
    } catch (e) {
      console.warn('Cannot save', e);
    }
  }

  loadSave() {
    try {
      const raw = localStorage.getItem('antigravity_craft_rpg_save_v2');
      if (raw) {
        const data = JSON.parse(raw);
        if (data.miningLevel) this.player.miningLevel = data.miningLevel;
        if (data.miningExp) this.player.miningExp = data.miningExp;
        if (data.inventory) this.player.inventory = { ...this.player.inventory, ...data.inventory };
        if (data.equipment) this.player.equipment = { ...this.player.equipment, ...data.equipment };
        if (data.tools) this.player.tools = { ...this.player.tools, ...data.tools };
        this.player.miningExpNeeded = this.player.calcExpNeeded(this.player.miningLevel);
        this.player.recalculateStats();
      }
    } catch (e) {
      console.warn('Cannot load save', e);
    }
  }

  exportSaveCode() {
    const data = {
      miningLevel: this.player.miningLevel,
      miningExp: this.player.miningExp,
      inventory: this.player.inventory,
      equipment: this.player.equipment,
      tools: this.player.tools
    };
    return btoa(JSON.stringify(data));
  }

  importSaveCode(base64Str) {
    try {
      const data = JSON.parse(atob(base64Str));
      if (data.miningLevel) this.player.miningLevel = data.miningLevel;
      if (data.miningExp) this.player.miningExp = data.miningExp;
      if (data.inventory) this.player.inventory = { ...this.player.inventory, ...data.inventory };
      if (data.equipment) this.player.equipment = { ...this.player.equipment, ...data.equipment };
      if (data.tools) this.player.tools = { ...this.player.tools, ...data.tools };
      this.player.recalculateStats();
      this.saveGame();
      return true;
    } catch (e) {
      return false;
    }
  }

  resetSave() {
    localStorage.removeItem('antigravity_craft_rpg_save_v2');
    window.location.reload();
  }

  update(dt) {
    this.player.update(dt, this.input);

    this.player.x = Math.max(20, Math.min(this.worldWidth - 20, this.player.x));
    this.player.y = Math.max(20, Math.min(this.worldHeight - 20, this.player.y));

    // Camera follow
    this.camera.width = this.canvas.width;
    this.camera.height = this.canvas.height;
    this.camera.x += (this.player.x - this.canvas.width / 2 - this.camera.x) * 0.1;
    this.camera.y += (this.player.y - this.canvas.height / 2 - this.camera.y) * 0.1;
    this.camera.x = Math.max(0, Math.min(this.worldWidth - this.canvas.width, this.camera.x));
    this.camera.y = Math.max(0, Math.min(this.worldHeight - this.canvas.height, this.camera.y));

    for (const node of this.nodes) node.update(dt);
    for (const m of this.monsters) m.update(dt, this.player);

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

    // Warspear / Heartwood style stone & cobblestone terrain
    this.drawTerrain();

    // Nodes
    for (const node of this.nodes) {
      if (
        node.x > this.camera.x - 50 &&
        node.x < this.camera.x + this.canvas.width + 50 &&
        node.y > this.camera.y - 50 &&
        node.y < this.camera.y + this.canvas.height + 50
      ) {
        node.draw(this.ctx, this.camera);
      }
    }

    // Monsters
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

    // Player
    this.player.draw(this.ctx, this.camera);

    // Particles & Floating texts
    for (const p of this.particles) p.draw(this.ctx, this.camera);
    for (const ft of this.floatingTexts) ft.draw(this.ctx, this.camera);

    // Minimap
    this.drawMinimap();
  }

  drawTerrain() {
    const startCol = Math.floor(this.camera.x / 120);
    const endCol = Math.ceil((this.camera.x + this.canvas.width) / 120);
    const startRow = Math.floor(this.camera.y / 120);
    const endRow = Math.ceil((this.camera.y + this.canvas.height) / 120);

    for (let c = startCol; c <= endCol; c++) {
      for (let r = startRow; r <= endRow; r++) {
        const wx = c * 120;
        const wy = r * 120;
        const sx = wx - this.camera.x;
        const sy = wy - this.camera.y;

        // Medieval MMORPG palette (Warspear & Heartwood)
        const distCenter = Math.hypot(wx - 1800, wy - 1800);
        if (distCenter < 600) {
          this.ctx.fillStyle = (c + r) % 2 === 0 ? '#1b2a1e' : '#1e2e21'; // Village forest
        } else if (distCenter < 1200) {
          this.ctx.fillStyle = (c + r) % 2 === 0 ? '#26221c' : '#2c2720'; // Mud & Ore hills
        } else {
          this.ctx.fillStyle = (c + r) % 2 === 0 ? '#1a1926' : '#201f2e'; // Mythic ancient ruins
        }

        this.ctx.fillRect(sx, sy, 120, 120);
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
        this.ctx.strokeRect(sx, sy, 120, 120);
      }
    }
  }

  drawMinimap() {
    const mapSize = 110;
    const margin = 12;
    const mx = this.canvas.width - mapSize - margin;
    const my = margin;

    this.ctx.save();
    this.ctx.fillStyle = 'rgba(10, 15, 20, 0.88)';
    this.ctx.fillRect(mx, my, mapSize, mapSize);
    this.ctx.strokeStyle = '#ffd700';
    this.ctx.lineWidth = 1.5;
    this.ctx.strokeRect(mx, my, mapSize, mapSize);

    const scale = mapSize / this.worldWidth;
    for (const node of this.nodes) {
      if (!node.active) continue;
      this.ctx.fillStyle = node.meta.color;
      this.ctx.fillRect(mx + node.x * scale, my + node.y * scale, 2, 2);
    }
    for (const m of this.monsters) {
      if (m.dead) continue;
      this.ctx.fillStyle = m.isBoss ? '#ffd700' : '#ff1744';
      this.ctx.fillRect(mx + m.x * scale, my + m.y * scale, m.isBoss ? 4 : 2, m.isBoss ? 4 : 2);
    }
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
