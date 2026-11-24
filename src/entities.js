import { RAW_RESOURCES, MONSTER_TYPES, SKILLS, EQUIPMENT_RECIPES, TOOLS, FACTORY_PRODUCTS } from './data.js';

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
  constructor(x, y, resId) {
    this.x = x;
    this.y = y;
    this.resId = resId;
    this.meta = RAW_RESOURCES[resId] || RAW_RESOURCES.ore_1;
    this.category = this.meta.type; // 'wood', 'ore', 'flora'
    this.radius = this.category === 'wood' ? 20 : (this.category === 'flora' ? 14 : 17);
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
      this.respawnTimer = 16;
      return true;
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
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.beginPath();
    ctx.ellipse(sx, sy + this.radius * 0.75, this.radius * 0.9, this.radius * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    if (this.category === 'wood') {
      // Warspear / Heartwood style tree
      ctx.fillStyle = '#4e342e';
      ctx.fillRect(sx - 5, sy - 2, 10, 16);

      // Leaves crown
      ctx.fillStyle = this.meta.color;
      ctx.beginPath();
      ctx.arc(sx, sy - 10, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#00000044';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Highlight inner leaf
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.arc(sx - 3, sy - 13, this.radius * 0.6, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.category === 'flora') {
      // Cotton / Flower shrub
      ctx.fillStyle = '#2e7d32';
      ctx.beginPath();
      ctx.arc(sx, sy, this.radius * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Flower petals / Cotton puffs
      ctx.fillStyle = this.meta.color;
      ctx.beginPath();
      ctx.arc(sx, sy - 5, this.radius * 0.5, 0, Math.PI * 2);
      ctx.arc(sx - 6, sy - 2, this.radius * 0.4, 0, Math.PI * 2);
      ctx.arc(sx + 6, sy - 2, this.radius * 0.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff66';
      ctx.stroke();
    } else {
      // Ore / Mineral Rock
      ctx.fillStyle = this.meta.color;
      ctx.beginPath();
      ctx.moveTo(sx - this.radius, sy + this.radius * 0.6);
      ctx.lineTo(sx - this.radius * 0.8, sy - this.radius * 0.5);
      ctx.lineTo(sx, sy - this.radius * 0.9);
      ctx.lineTo(sx + this.radius * 0.8, sy - this.radius * 0.4);
      ctx.lineTo(sx + this.radius, sy + this.radius * 0.6);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ffffff33';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Shiny facet
      ctx.fillStyle = '#ffffffaa';
      ctx.beginPath();
      ctx.arc(sx - 3, sy - 4, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Level tag over node (Warspear/Heartwood MMO style)
    ctx.fillStyle = 'rgba(10, 15, 20, 0.85)';
    ctx.fillRect(sx - 24, sy - this.radius - 22, 48, 14);
    ctx.strokeStyle = '#ffd700';
    ctx.lineWidth = 1;
    ctx.strokeRect(sx - 24, sy - this.radius - 22, 48, 14);

    ctx.fillStyle = '#ffd700';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`Lv ${this.meta.reqLv}`, sx, sy - this.radius - 12);

    // Health bar if damaged
    if (this.hp < this.maxHp) {
      const barW = 30;
      const barH = 4;
      const pct = Math.max(0, this.hp / this.maxHp);
      ctx.fillStyle = '#222222';
      ctx.fillRect(sx - barW / 2, sy - this.radius - 7, barW, barH);
      ctx.fillStyle = '#00e676';
      ctx.fillRect(sx - barW / 2, sy - this.radius - 7, barW * pct, barH);
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
    this.meta = MONSTER_TYPES[typeId] || MONSTER_TYPES.wolf;
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

    const aggroRange = this.isBoss ? 500 : 260;

    if (dist < aggroRange) {
      const angle = Math.atan2(dy, dx);
      this.vx = Math.cos(angle) * this.speed * 60 * dt;
      this.vy = Math.sin(angle) * this.speed * 60 * dt;

      if (dist < this.radius + player.radius) {
        if (this.attackCooldown <= 0) {
          player.takeDamage(this.atk);
          this.attackCooldown = 1.0;
        }
      }
    } else {
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
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.beginPath();
    ctx.ellipse(sx, sy + this.radius * 0.8, this.radius * 0.9, this.radius * 0.4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Body
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(sx, sy, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Eyes
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(sx - this.radius * 0.3, sy - this.radius * 0.2, this.radius * 0.25, 0, Math.PI * 2);
    ctx.arc(sx + this.radius * 0.3, sy - this.radius * 0.2, this.radius * 0.25, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#b71c1c';
    ctx.beginPath();
    ctx.arc(sx - this.radius * 0.25, sy - this.radius * 0.2, this.radius * 0.12, 0, Math.PI * 2);
    ctx.arc(sx + this.radius * 0.35, sy - this.radius * 0.2, this.radius * 0.12, 0, Math.PI * 2);
    ctx.fill();

    // Name tag & Boss Crown
    ctx.fillStyle = this.isBoss ? '#ffd700' : '#ffffff';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.meta.name, sx, sy - this.radius - 12);

    // HP Bar
    const barW = this.radius * 2.2;
    const barH = 5;
    const pct = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = '#222222';
    ctx.fillRect(sx - barW / 2, sy - this.radius - 8, barW, barH);
    ctx.fillStyle = this.isBoss ? '#ffd700' : '#ff5252';
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

    // Inventory of raw & factory processed items
    this.inventory = {
      wood_1: 25,
      ore_1: 20,
      flora_1: 15,
      pelt_1: 6,
      ingot_copper: 5,
      ingot_iron: 4,
      plate_iron: 2,
      pipe_steel: 2,
      fabric_rough: 4
    };

    // 5 Character Equipment Slots (Warspear / Heartwood style)
    this.equipment = {
      weapon: null,
      helmet: null,
      armor: null,
      pants: null,
      boots: null
    };

    // 4 Specialized Gathering Tools (with Level Requirements)
    this.tools = {
      axe: 'axe_1',       // Lv 1
      pickaxe: 'pickaxe_1', // Lv 1
      knife: 'knife_1',   // Lv 1
      sickle: 'sickle_1'  // Lv 1
    };

    // Skill cooldowns & active buffs
    this.skillCooldowns = {};
    SKILLS.forEach(s => {
      if (s.type === 'active') this.skillCooldowns[s.id] = 0;
    });

    this.activeBuffs = {
      berserk: 0,
      whirlwind: 0,
      titan: 0
    };

    this.swingAngle = 0;
    this.isSwinging = false;
    this.swingTimer = 0;
    this.facing = 1;

    this.stats = {
      atk: 10,
      def: 0,
      crit: 0.05
    };

    this.recalculateStats();
  }

  calcExpNeeded(lvl) {
    return Math.floor(60 * Math.pow(lvl, 1.45));
  }

  getToolLevel(toolCategory) {
    const toolId = this.tools[toolCategory];
    if (!toolId) return 1;
    const tool = TOOLS[toolId];
    return tool ? tool.reqLv : 1;
  }

  getToolPower(toolCategory) {
    const toolId = this.tools[toolCategory];
    if (!toolId) return 15;
    const tool = TOOLS[toolId];
    return tool ? tool.power : 15;
  }

  recalculateStats() {
    let bonusHp = 0;
    let bonusDef = 0;
    let bonusAtk = 10;
    let bonusSpeed = 0;
    let bonusCrit = 0.05;

    // Lv 30 Passive: Thể Lực Thợ Mỏ
    if (this.miningLevel >= 30) {
      bonusHp += 100;
      bonusSpeed += 0.25;
    }

    // Equipment bonuses across all 5 slots
    for (const slot of ['weapon', 'helmet', 'armor', 'pants', 'boots']) {
      const eqId = this.equipment[slot];
      if (!eqId) continue;
      const recipe = EQUIPMENT_RECIPES.find(r => r.id === eqId);
      if (!recipe) continue;

      let mult = 1.0;
      // Lv 70 Passive: Bậc Thầy Rèn Đúc
      if (this.miningLevel >= 70) mult += 0.2;

      if (recipe.stats.hp) bonusHp += recipe.stats.hp * mult;
      if (recipe.stats.def) bonusDef += recipe.stats.def * mult;
      if (recipe.stats.atk) bonusAtk += recipe.stats.atk * mult;
      if (recipe.stats.crit) bonusCrit += recipe.stats.crit;
      if (recipe.stats.spd) bonusSpeed += recipe.stats.spd;
    }

    // Titan buff
    if (this.activeBuffs.titan > 0) {
      bonusAtk *= 3;
    }

    this.maxHp = Math.floor(this.baseHp + bonusHp);
    this.hp = Math.min(this.hp, this.maxHp);
    this.speed = this.baseSpeed * (1 + bonusSpeed);
    this.stats = {
      atk: Math.floor(bonusAtk),
      def: Math.floor(bonusDef),
      crit: bonusCrit
    };
  }

  addExp(amount, onLevelUp) {
    if (this.miningLevel >= 100) return;
    this.miningExp += amount;
    while (this.miningLevel < 100 && this.miningExp >= this.miningExpNeeded) {
      this.miningExp -= this.miningExpNeeded;
      this.miningLevel++;
      this.miningExpNeeded = this.calcExpNeeded(this.miningLevel);
      this.hp = this.maxHp;
      this.recalculateStats();
      if (onLevelUp) onLevelUp(this.miningLevel);
    }
  }

  takeDamage(incomingDmg) {
    if (this.activeBuffs.titan > 0) return 0;
    let def = this.stats.def;
    let actualDmg = Math.max(1, incomingDmg - Math.floor(def * 0.5));

    // Lv 90 Passive: Hắc Giáp Kim Cang (-35% dmg)
    if (this.miningLevel >= 90) {
      actualDmg = Math.floor(actualDmg * 0.65);
    }

    this.hp = Math.max(0, this.hp - actualDmg);
    return actualDmg;
  }

  update(dt, input) {
    for (const key in this.skillCooldowns) {
      if (this.skillCooldowns[key] > 0) {
        this.skillCooldowns[key] = Math.max(0, this.skillCooldowns[key] - dt);
      }
    }

    for (const b in this.activeBuffs) {
      if (this.activeBuffs[b] > 0) {
        this.activeBuffs[b] = Math.max(0, this.activeBuffs[b] - dt);
        if (this.activeBuffs[b] <= 0) this.recalculateStats();
      }
    }

    const armorRecipe = EQUIPMENT_RECIPES.find(r => r.id === this.equipment.armor);
    if (armorRecipe && armorRecipe.stats.hpRegen) {
      this.hp = Math.min(this.maxHp, this.hp + armorRecipe.stats.hpRegen * dt);
    }

    let dx = 0;
    let dy = 0;
    if (input.up) dy -= 1;
    if (input.down) dy += 1;
    if (input.left) dx -= 1;
    if (input.right) dx += 1;

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

    if (this.isSwinging) {
      this.swingTimer += dt * 10;
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

    // Titan Aura (Lv 100)
    if (isTitan) {
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 6;
      ctx.shadowColor = '#ffea00';
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.arc(sx, sy, r + 10, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Boots (Feet)
    ctx.fillStyle = this.equipment.boots ? '#b0bec5' : '#5d4037';
    ctx.fillRect(sx - r * 0.5, sy + r * 0.5, r * 0.4, r * 0.4);
    ctx.fillRect(sx + r * 0.1, sy + r * 0.5, r * 0.4, r * 0.4);

    // Pants (Legs)
    ctx.fillStyle = this.equipment.pants ? '#37474f' : '#1e3c72';
    ctx.fillRect(sx - r * 0.6, sy + r * 0.2, r * 1.2, r * 0.4);

    // Chest Armor (Body)
    let bodyColor = '#2a5298';
    if (this.equipment.armor) {
      if (this.equipment.armor.includes('leather')) bodyColor = '#8d6e63';
      else if (this.equipment.armor.includes('iron')) bodyColor = '#78909c';
      else if (this.equipment.armor.includes('gold')) bodyColor = '#ffd54f';
      else if (this.equipment.armor.includes('mythril')) bodyColor = '#ba68c8';
    }
    if (isTitan) bodyColor = '#d50000';

    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.arc(sx, sy, r * 0.75, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Helmet / Head
    ctx.fillStyle = '#ffcc80'; // Face skin
    ctx.beginPath();
    ctx.arc(sx, sy - r * 0.45, r * 0.45, 0, Math.PI * 2);
    ctx.fill();

    // If Helmet is equipped
    if (this.equipment.helmet) {
      ctx.fillStyle = this.equipment.helmet.includes('iron') ? '#b0bec5' : (this.equipment.helmet.includes('titan') ? '#607d8b' : '#ffb300');
      ctx.beginPath();
      ctx.arc(sx, sy - r * 0.6, r * 0.5, Math.PI, 0, false);
      ctx.fill();
      ctx.stroke();
    }

    // Eyes
    ctx.fillStyle = '#000000';
    const eyeOffset = this.facing * (r * 0.2);
    ctx.beginPath();
    ctx.arc(sx + eyeOffset, sy - r * 0.45, 2, 0, Math.PI * 2);
    ctx.fill();

    // Weapon / Tool in hand
    ctx.save();
    ctx.translate(sx + this.facing * (r * 0.7), sy);
    ctx.rotate((this.facing * this.swingAngle) + (this.facing > 0 ? 0.3 : -0.3));

    // Draw weapon blade
    ctx.fillStyle = '#b0bec5';
    ctx.fillRect(-2, -r * 0.7, 4, r * 1.4);
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(-4, -r * 0.1, 8, 3);

    ctx.restore();

    // HP Bar
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
