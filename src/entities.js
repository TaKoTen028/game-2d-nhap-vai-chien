import { RESOURCE_TYPES, MONSTER_TYPES, SKILLS, RECIPES } from './data.js';

export class FloatingText {
  constructor(x, y, text, color = '#ffffff', fontSize = 14, bold = false) {
    this.x = x + (Math.random() * 20 - 10);
    this.y = y;
    this.text = text;
    this.color = color;
    this.fontSize = fontSize;
    this.bold = bold;
    this.life = 1.0;
    this.decay = 0.02;
    this.vy = -1.2;
  }

  update() {
    this.y += this.vy;
    this.life -= this.decay;
  }

  draw(ctx, camera) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.color;
    ctx.font = `${this.bold ? 'bold ' : ''}${this.fontSize}px 'Segoe UI', Tahoma, sans-serif`;
    ctx.textAlign = 'center';
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 4;
    ctx.fillText(this.text, this.x - camera.x, this.y - camera.y);
    ctx.restore();
  }
}

export class Particle {
  constructor(x, y, color, speed = 2, size = 3, life = 0.6) {
    this.x = x;
    this.y = y;
    this.color = color;
    const angle = Math.random() * Math.PI * 2;
    const spd = Math.random() * speed + 0.5;
    this.vx = Math.cos(angle) * spd;
    this.vy = Math.sin(angle) * spd;
    this.size = Math.random() * size + 2;
    this.life = life;
    this.maxLife = life;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= 0.025;
  }

  draw(ctx, camera) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x - camera.x, this.y - camera.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

export class ResourceNode {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.meta = RESOURCE_TYPES[type] || RESOURCE_TYPES.wood;
    this.radius = type === 'wood' ? 18 : 16;
    this.maxHp = this.meta.hardness || 30;
    this.hp = this.maxHp;
    this.shake = 0;
    this.respawnTimer = 0;
    this.active = true;
  }

  hit(damage) {
    if (!this.active) return false;
    this.hp -= damage;
    this.shake = 6;
    if (this.hp <= 0) {
      this.active = false;
      this.respawnTimer = 18; // Respawns after 18 seconds
      return true; // Node broken
    }
    return false;
  }

  update(dt) {
    if (this.shake > 0) this.shake -= 0.5;
    if (!this.active) {
      this.respawnTimer -= dt;
      if (this.respawnTimer <= 0) {
        this.active = true;
        this.hp = this.maxHp;
      }
    }
  }

  draw(ctx, camera) {
    if (!this.active) return;
    const sx = this.x - camera.x + (this.shake > 0 ? (Math.random() - 0.5) * this.shake : 0);
    const sy = this.y - camera.y;

    ctx.save();
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
    ctx.beginPath();
    ctx.ellipse(sx, sy + this.radius * 0.7, this.radius * 0.9, this.radius * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    if (this.type === 'wood') {
      // Tree trunk & leafy crown
      ctx.fillStyle = '#6d4c41';
      ctx.fillRect(sx - 4, sy - 2, 8, 14);

      // Leaves
      ctx.fillStyle = '#2e7d32';
      ctx.beginPath();
      ctx.arc(sx, sy - 8, this.radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#388e3c';
      ctx.beginPath();
      ctx.arc(sx - 3, sy - 11, this.radius * 0.7, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Mineral Rock
      ctx.fillStyle = this.meta.color;
      ctx.beginPath();
      ctx.moveTo(sx - this.radius, sy + this.radius * 0.5);
      ctx.lineTo(sx - this.radius * 0.7, sy - this.radius * 0.6);
      ctx.lineTo(sx, sy - this.radius * 0.9);
      ctx.lineTo(sx + this.radius * 0.8, sy - this.radius * 0.5);
      ctx.lineTo(sx + this.radius, sy + this.radius * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ffffff22';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Gem/mineral sparkle facets
      ctx.fillStyle = '#ffffffaa';
      ctx.beginPath();
      ctx.arc(sx - 2, sy - 4, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Health bar if damaged
    if (this.hp < this.maxHp) {
      const barW = 28;
      const barH = 4;
      const pct = Math.max(0, this.hp / this.maxHp);
      ctx.fillStyle = '#222222';
      ctx.fillRect(sx - barW / 2, sy - this.radius - 10, barW, barH);
      ctx.fillStyle = '#00e676';
      ctx.fillRect(sx - barW / 2, sy - this.radius - 10, barW * pct, barH);
    }

    ctx.restore();
  }
}

export class Monster {
  constructor(x, y, typeId) {
    this.x = x;
    this.y = y;
    this.spawnX = x;
    this.spawnY = y;
    this.typeId = typeId;
    this.meta = MONSTER_TYPES[typeId] || MONSTER_TYPES.slime;
    this.hp = this.meta.hp;
    this.maxHp = this.meta.hp;
    this.atk = this.meta.atk;
    this.speed = this.meta.speed;
    this.radius = this.meta.radius;
    this.color = this.meta.color;
    this.isBoss = this.meta.isBoss || false;
    this.attackCooldown = 0;
    this.vx = 0;
    this.vy = 0;
    this.patrolAngle = Math.random() * Math.PI * 2;
    this.patrolTimer = 0;
    this.dead = false;
  }

  update(dt, player) {
    if (this.dead) return;
    if (this.attackCooldown > 0) this.attackCooldown -= dt;

    const dx = player.x - this.x;
    const dy = player.y - this.y;
    const dist = Math.hypot(dx, dy);

    // Aggro distance
    const aggroRange = this.isBoss ? 450 : 250;

    if (dist < aggroRange) {
      // Chase player
      const angle = Math.atan2(dy, dx);
      this.vx = Math.cos(angle) * this.speed * 60 * dt;
      this.vy = Math.sin(angle) * this.speed * 60 * dt;

      // Attack if in contact
      if (dist < this.radius + player.radius) {
        if (this.attackCooldown <= 0) {
          player.takeDamage(this.atk);
          this.attackCooldown = 1.0;
        }
      }
    } else {
      // Wandering patrol
      this.patrolTimer -= dt;
      if (this.patrolTimer <= 0) {
        this.patrolAngle = Math.random() * Math.PI * 2;
        this.patrolTimer = Math.random() * 3 + 2;
      }
      this.vx = Math.cos(this.patrolAngle) * (this.speed * 0.4) * 60 * dt;
      this.vy = Math.sin(this.patrolAngle) * (this.speed * 0.4) * 60 * dt;
    }

    this.x += this.vx;
    this.y += this.vy;
  }

  takeDamage(amt) {
    this.hp -= amt;
    if (this.hp <= 0) {
      this.dead = true;
      return true;
    }
    return false;
  }

  draw(ctx, camera) {
    if (this.dead) return;
    const sx = this.x - camera.x;
    const sy = this.y - camera.y;

    ctx.save();
    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(sx, sy + this.radius * 0.8, this.radius * 0.9, this.radius * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(sx, sy, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(sx - this.radius * 0.3, sy - this.radius * 0.2, this.radius * 0.25, 0, Math.PI * 2);
    ctx.arc(sx + this.radius * 0.3, sy - this.radius * 0.2, this.radius * 0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(sx - this.radius * 0.25, sy - this.radius * 0.2, this.radius * 0.12, 0, Math.PI * 2);
    ctx.arc(sx + this.radius * 0.35, sy - this.radius * 0.2, this.radius * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Boss Crown / Aura
    if (this.isBoss) {
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(sx, sy, this.radius + 6, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#ffd700';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('👑 TITAN BOSS', sx, sy - this.radius - 12);
    }

    // HP Bar
    const barW = this.radius * 2.2;
    const barH = 5;
    const pct = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = '#222222';
    ctx.fillRect(sx - barW / 2, sy - this.radius - 8, barW, barH);
    ctx.fillStyle = this.isBoss ? '#d50000' : '#ff5252';
    ctx.fillRect(sx - barW / 2, sy - this.radius - 8, barW * pct, barH);

    ctx.restore();
  }
}

export class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 16;
    this.baseSpeed = 3.2;
    this.speed = this.baseSpeed;

    this.baseHp = 200;
    this.maxHp = this.baseHp;
    this.hp = this.maxHp;

    // Mining Level & EXP (Level 1 to 100)
    this.miningLevel = 1;
    this.miningExp = 0;
    this.miningExpNeeded = this.calcExpNeeded(1);

    // Inventory & Equipment
    this.inventory = {
      wood: 20,
      stone: 15,
      iron: 0,
      gold: 0,
      diamond: 0,
      obsidian: 0,
      mythril: 0,
      monster_leather: 2,
      golem_core: 0,
      titan_shard: 0
    };

    this.equipment = {
      weapon: null,
      armor: null,
      shield: null,
      tool: 'tool_stone_pick' // Start with basic pickaxe
    };

    // Skill cooldowns & active buffs
    this.skillCooldowns = {};
    SKILLS.forEach(s => {
      if (s.type === 'active') this.skillCooldowns[s.id] = 0;
    });

    this.activeBuffs = {
      berserk: 0, // Level 40 skill
      whirlwind: 0, // Level 60 skill
      titan: 0 // Level 100 skill
    };

    this.swingAngle = 0;
    this.isSwinging = false;
    this.swingTimer = 0;
    this.facing = 1; // 1 for right, -1 for left

    this.stats = {
      atk: 10,
      def: 0,
      minePower: 15,
      mineSpeed: 1.0,
      crit: 0.05
    };

    this.recalculateStats();
  }

  calcExpNeeded(lvl) {
    // Formula: Scales smoothly up to level 100
    return Math.floor(60 * Math.pow(lvl, 1.45));
  }

  recalculateStats() {
    let bonusHp = 0;
    let bonusDef = 0;
    let bonusAtk = 10;
    let bonusMinePower = 10;
    let bonusMineSpeed = 1.0;
    let bonusSpeed = 0;
    let bonusCrit = 0.05;

    // Lv 30 Passive: Thể Lực Thợ Mỏ
    if (this.miningLevel >= 30) {
      bonusHp += 100;
      bonusSpeed += 0.25;
    }

    // Equipment bonuses
    for (const slot of ['weapon', 'armor', 'shield', 'tool']) {
      const eqId = this.equipment[slot];
      if (!eqId) continue;
      const recipe = RECIPES.find(r => r.id === eqId);
      if (!recipe) continue;

      let mult = 1.0;
      // Lv 70 Passive: Bậc Thầy Rèn Đúc
      if (this.miningLevel >= 70) mult += 0.2;

      if (recipe.stats.hp) bonusHp += recipe.stats.hp * mult;
      if (recipe.stats.def) bonusDef += recipe.stats.def * mult;
      if (recipe.stats.atk) bonusAtk += recipe.stats.atk * mult;
      if (recipe.stats.crit) bonusCrit += recipe.stats.crit;
      if (recipe.stats.minePower) bonusMinePower += recipe.stats.minePower * mult;
      if (recipe.stats.mineSpeed) bonusMineSpeed *= recipe.stats.mineSpeed;
    }

    // Titan buff
    if (this.activeBuffs.titan > 0) {
      bonusAtk *= 3;
      bonusMinePower *= 5;
    }

    // Berserk buff
    if (this.activeBuffs.berserk > 0) {
      bonusMineSpeed *= 2.5;
    }

    this.maxHp = Math.floor(this.baseHp + bonusHp);
    this.hp = Math.min(this.hp, this.maxHp);
    this.speed = this.baseSpeed * (1 + bonusSpeed);
    this.stats = {
      atk: Math.floor(bonusAtk),
      def: Math.floor(bonusDef),
      minePower: Math.floor(bonusMinePower),
      mineSpeed: bonusMineSpeed,
      crit: bonusCrit
    };
  }

  addExp(amount, onLevelUp) {
    if (this.miningLevel >= 100) return;

    // Lv 3 Cuốc Vàng bonus
    const pickRecipe = RECIPES.find(r => r.id === this.equipment.tool);
    if (pickRecipe && pickRecipe.stats.bonusExp) {
      amount = Math.floor(amount * (1 + pickRecipe.stats.bonusExp));
    }

    this.miningExp += amount;
    while (this.miningLevel < 100 && this.miningExp >= this.miningExpNeeded) {
      this.miningExp -= this.miningExpNeeded;
      this.miningLevel++;
      this.miningExpNeeded = this.calcExpNeeded(this.miningLevel);
      this.hp = this.maxHp; // Heal to full on level up
      this.recalculateStats();
      if (onLevelUp) onLevelUp(this.miningLevel);
    }
  }

  takeDamage(incomingDmg) {
    // Level 100 Titan is invulnerable!
    if (this.activeBuffs.titan > 0) return 0;

    let def = this.stats.def;
    let actualDmg = Math.max(1, incomingDmg - Math.floor(def * 0.5));

    // Level 90 Passive: Hắc Giáp Kim Cang (-35% dmg)
    if (this.miningLevel >= 90) {
      actualDmg = Math.floor(actualDmg * 0.65);
    }

    this.hp = Math.max(0, this.hp - actualDmg);
    return actualDmg;
  }

  update(dt, input) {
    // Update cooldowns
    for (const key in this.skillCooldowns) {
      if (this.skillCooldowns[key] > 0) {
        this.skillCooldowns[key] = Math.max(0, this.skillCooldowns[key] - dt);
      }
    }

    // Update buffs
    for (const b in this.activeBuffs) {
      if (this.activeBuffs[b] > 0) {
        this.activeBuffs[b] = Math.max(0, this.activeBuffs[b] - dt);
        if (this.activeBuffs[b] <= 0) {
          this.recalculateStats();
        }
      }
    }

    // Natural regen or armor regen
    const armorRecipe = RECIPES.find(r => r.id === this.equipment.armor);
    if (armorRecipe && armorRecipe.stats.hpRegen) {
      this.hp = Math.min(this.maxHp, this.hp + armorRecipe.stats.hpRegen * dt);
    }

    // Movement
    let dx = 0;
    let dy = 0;
    if (input.up) dy -= 1;
    if (input.down) dy += 1;
    if (input.left) dx -= 1;
    if (input.right) dx += 1;

    // Joystick input
    if (input.joyX !== 0 || input.joyY !== 0) {
      dx = input.joyX;
      dy = input.joyY;
    }

    const len = Math.hypot(dx, dy);
    if (len > 0) {
      const spd = this.speed * (this.activeBuffs.titan > 0 ? 1.4 : 1.0);
      this.x += (dx / len) * spd * 60 * dt;
      this.y += (dy / len) * spd * 60 * dt;
      if (dx !== 0) this.facing = dx > 0 ? 1 : -1;
    }

    // Swing animation
    if (this.isSwinging) {
      this.swingTimer += dt * 10 * this.stats.mineSpeed;
      this.swingAngle = Math.sin(this.swingTimer) * 1.4;
      if (this.swingTimer >= Math.PI) {
        this.isSwinging = false;
        this.swingTimer = 0;
        this.swingAngle = 0;
      }
    }
  }

  triggerSwing() {
    if (!this.isSwinging) {
      this.isSwinging = true;
      this.swingTimer = 0;
    }
  }

  draw(ctx, camera) {
    const sx = this.x - camera.x;
    const sy = this.y - camera.y;
    const isTitan = this.activeBuffs.titan > 0;
    const r = isTitan ? this.radius * 1.8 : this.radius;

    ctx.save();

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(sx, sy + r * 0.85, r * 0.95, r * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    // Whirlwind Skill Visual (Lv 60)
    if (this.activeBuffs.whirlwind > 0) {
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(sx, sy, r + 24, Date.now() * 0.01, Date.now() * 0.01 + Math.PI * 1.5);
      ctx.stroke();
    }

    // Titan Glowing Aura (Lv 100)
    if (isTitan) {
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 6;
      ctx.shadowColor = '#ffea00';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(sx, sy, r + 10, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Body (Hero character with armor tint)
    let bodyColor = '#1e88e5'; // Default blue adventurer
    if (this.equipment.armor) {
      const arm = RECIPES.find(r => r.id === this.equipment.armor);
      if (arm) {
        if (arm.tier === 1) bodyColor = '#8d6e63';
        if (arm.tier === 2) bodyColor = '#78909c';
        if (arm.tier === 3) bodyColor = '#ffd54f';
        if (arm.tier === 4) bodyColor = '#26c6da';
        if (arm.tier === 5) bodyColor = '#303f9f';
        if (arm.tier === 6) bodyColor = '#ab47bc';
      }
    }
    if (isTitan) bodyColor = '#d50000';

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.arc(sx, sy, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff44';
    ctx.stroke();

    // Eyes / Helmet visor
    ctx.fillStyle = '#ffffff';
    const eyeOffset = this.facing * (r * 0.35);
    ctx.beginPath();
    ctx.arc(sx + eyeOffset, sy - r * 0.2, r * 0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(sx + eyeOffset + this.facing * 2, sy - r * 0.2, r * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Weapon / Pickaxe in hand
    ctx.save();
    ctx.translate(sx + this.facing * (r * 0.8), sy);
    ctx.rotate((this.facing * this.swingAngle) + (this.facing > 0 ? 0.3 : -0.3));

    // Draw tool/weapon
    const pickId = this.equipment.tool;
    const pickRecipe = RECIPES.find(r => r.id === pickId);
    let toolColor = '#8d6e63';
    if (pickRecipe) {
      if (pickRecipe.tier === 2) toolColor = '#b0bec5';
      if (pickRecipe.tier === 3) toolColor = '#ffd700';
      if (pickRecipe.tier === 4) toolColor = '#00e5ff';
      if (pickRecipe.tier === 5) toolColor = '#673ab7';
      if (pickRecipe.tier === 6) toolColor = '#e040fb';
    }

    // Handle
    ctx.fillStyle = '#5d4037';
    ctx.fillRect(-2, -r * 0.6, 4, r * 1.5);
    // Pick Head
    ctx.fillStyle = toolColor;
    ctx.beginPath();
    ctx.arc(0, -r * 0.6, r * 0.6, Math.PI, 0, false);
    ctx.lineTo(r * 0.8, -r * 0.6);
    ctx.lineTo(0, -r * 0.9);
    ctx.lineTo(-r * 0.8, -r * 0.6);
    ctx.closePath();
    ctx.fill();

    ctx.restore();

    // HP Bar over player
    const barW = r * 2.4;
    const barH = 5;
    const pct = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = '#222222';
    ctx.fillRect(sx - barW / 2, sy - r - 12, barW, barH);
    ctx.fillStyle = '#00e676';
    ctx.fillRect(sx - barW / 2, sy - r - 12, barW * pct, barH);

    ctx.restore();
  }
}
