import { Game } from './game.js';
import { SKILLS, RECIPES, RESOURCE_TYPES } from './data.js';

window.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  const game = new Game(canvas);
  game.start();

  // DOM Elements
  const levelBadge = document.getElementById('level-badge');
  const hpFill = document.getElementById('hp-fill');
  const hpLabel = document.getElementById('hp-label');
  const expFill = document.getElementById('exp-fill');
  const expLabel = document.getElementById('exp-label');

  // Modals
  const modalSkills = document.getElementById('modal-skills');
  const modalCraft = document.getElementById('modal-craft');
  const modalInv = document.getElementById('modal-inv');
  const skillsList = document.getElementById('skills-list');
  const craftList = document.getElementById('craft-list');
  const invGrid = document.getElementById('inv-grid');

  // Quick skill buttons
  const skillBtns = {
    skill_20: document.getElementById('btn-skill-20'),
    skill_40: document.getElementById('btn-skill-40'),
    skill_60: document.getElementById('btn-skill-60'),
    skill_80: document.getElementById('btn-skill-80'),
    skill_100: document.getElementById('btn-skill-100')
  };

  // Sound toggle
  const btnToggleSound = document.getElementById('btn-toggle-sound');
  btnToggleSound.addEventListener('click', () => {
    window.soundEngine.ensureContext();
    window.soundEngine.enabled = !window.soundEngine.enabled;
    btnToggleSound.textContent = window.soundEngine.enabled ? '🔊 Âm Thanh' : '🔇 Đã Tắt Âm';
  });

  // Action Button
  const btnAction = document.getElementById('btn-action');
  const triggerAction = (e) => {
    if (e) e.preventDefault();
    window.soundEngine.ensureContext();
    game.performAction();
  };
  btnAction.addEventListener('pointerdown', triggerAction);

  // Skill buttons click
  for (const skillId in skillBtns) {
    const btn = skillBtns[skillId];
    if (btn) {
      btn.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        window.soundEngine.ensureContext();
        game.useSkill(skillId);
      });
    }
  }

  // Virtual Joystick
  const joyZone = document.getElementById('joystick-zone');
  const joyKnob = document.getElementById('joystick-knob');
  let joyActive = false;
  let joyTouchId = null;
  let joyCenter = { x: 0, y: 0 };
  const maxJoyDist = 45;

  joyZone.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    window.soundEngine.ensureContext();
    joyActive = true;
    joyTouchId = e.pointerId;
    const rect = joyZone.getBoundingClientRect();
    joyCenter = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    updateJoystick(e.clientX, e.clientY);
  });

  window.addEventListener('pointermove', (e) => {
    if (!joyActive || e.pointerId !== joyTouchId) return;
    updateJoystick(e.clientX, e.clientY);
  });

  const endJoy = (e) => {
    if (e.pointerId === joyTouchId) {
      joyActive = false;
      joyTouchId = null;
      joyKnob.style.transform = `translate(0px, 0px)`;
      game.input.joyX = 0;
      game.input.joyY = 0;
    }
  };
  window.addEventListener('pointerup', endJoy);
  window.addEventListener('pointercancel', endJoy);

  function updateJoystick(clientX, clientY) {
    const dx = clientX - joyCenter.x;
    const dy = clientY - joyCenter.y;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const clampedDist = Math.min(dist, maxJoyDist);

    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;
    joyKnob.style.transform = `translate(${knobX}px, ${knobY}px)`;

    game.input.joyX = knobX / maxJoyDist;
    game.input.joyY = knobY / maxJoyDist;
  }

  // Modal open buttons
  document.getElementById('btn-open-skills').addEventListener('click', () => {
    renderSkillsModal();
    modalSkills.classList.add('active');
  });

  document.getElementById('btn-open-craft').addEventListener('click', () => {
    renderCraftModal('all');
    modalCraft.classList.add('active');
  });

  document.getElementById('btn-open-inv').addEventListener('click', () => {
    renderInventoryModal();
    modalInv.classList.add('active');
  });

  // Modal close buttons
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      document.getElementById(modalId).classList.remove('active');
    });
  });

  // Close modal when tapping outside content
  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', (e) => {
      if (e.target === m) m.classList.remove('active');
    });
  });

  // Crafting tabs
  let currentCraftCat = 'all';
  document.querySelectorAll('.craft-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.craft-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      currentCraftCat = tab.getAttribute('data-cat');
      renderCraftModal(currentCraftCat);
    });
  });

  // Reset Game Button
  document.getElementById('btn-reset-game').addEventListener('click', () => {
    if (confirm('Bạn có chắc muốn xóa tiến trình và chơi lại từ đầu không?')) {
      game.resetSave();
    }
  });

  // Render Skills Modal
  function renderSkillsModal() {
    skillsList.innerHTML = '';
    SKILLS.forEach(skill => {
      const isUnlocked = game.player.miningLevel >= skill.reqLevel;
      const card = document.createElement('div');
      card.className = `skill-card ${isUnlocked ? 'unlocked' : 'locked'}`;

      card.innerHTML = `
        <div class="skill-card-icon">${skill.icon}</div>
        <div class="skill-card-info">
          <div class="skill-card-title">
            <span>${skill.name} (Lv ${skill.reqLevel})</span>
            <span class="${skill.type === 'active' ? 'badge-active' : 'badge-passive'}">
              ${skill.type === 'active' ? 'KÍCH HOẠT' : 'THỤ ĐỘNG'}
            </span>
            ${isUnlocked 
              ? '<span style="color: #00e676; font-size: 11px; margin-left: auto;">✔ Đã mở</span>' 
              : `<span style="color: #ff5252; font-size: 11px; margin-left: auto;">🔒 Cần Lv ${skill.reqLevel}</span>`}
          </div>
          <div class="skill-card-desc">${skill.description}</div>
        </div>
      `;
      skillsList.appendChild(card);
    });
  }

  // Render Crafting Modal
  function renderCraftModal(cat = 'all') {
    craftList.innerHTML = '';
    const filtered = RECIPES.filter(r => cat === 'all' || r.category === cat);

    filtered.forEach(recipe => {
      const card = document.createElement('div');
      card.className = 'craft-card';

      let canCraft = true;
      let costMult = game.player.miningLevel >= 70 ? 0.75 : 1.0;

      let costHtml = '';
      for (const res in recipe.cost) {
        const required = Math.max(1, Math.floor(recipe.cost[res] * costMult));
        const owned = game.player.inventory[res] || 0;
        const hasEnough = owned >= required;
        if (!hasEnough) canCraft = false;

        const meta = RESOURCE_TYPES[res];
        costHtml += `
          <div class="cost-item ${hasEnough ? 'has-enough' : 'not-enough'}">
            ${meta ? meta.name : res}: ${owned}/${required}
          </div>
        `;
      }

      const isEquipped = game.player.equipment[recipe.category] === recipe.id;

      card.innerHTML = `
        <div class="craft-card-top">
          <div class="craft-card-title">${recipe.name}</div>
          <span class="craft-tier tier-${recipe.tier}">Bậc ${recipe.tier}</span>
        </div>
        <div style="font-size: 12px; color: #8b949e;">${recipe.desc}</div>
        <div class="craft-cost">${costHtml}</div>
        <button class="craft-action-btn" ${!canCraft || isEquipped ? 'disabled' : ''}>
          ${isEquipped ? 'Đang trang bị' : (canCraft ? 'Chế tạo & Trang bị' : 'Thiếu nguyên liệu')}
        </button>
      `;

      const btn = card.querySelector('.craft-action-btn');
      if (canCraft && !isEquipped) {
        btn.addEventListener('click', () => {
          const res = game.craft(recipe.id);
          renderCraftModal(currentCraftCat);
        });
      }

      craftList.appendChild(card);
    });
  }

  // Render Inventory Modal
  function renderInventoryModal() {
    const p = game.player;
    document.getElementById('stat-level').textContent = `${p.miningLevel} / 100`;
    document.getElementById('stat-hp').textContent = `${Math.floor(p.hp)} / ${p.maxHp}`;
    document.getElementById('stat-atk').textContent = `${p.stats.atk}`;
    document.getElementById('stat-def').textContent = `${p.stats.def}`;
    document.getElementById('stat-mine').textContent = `${p.stats.minePower}`;
    document.getElementById('stat-speed').textContent = `${p.stats.mineSpeed.toFixed(1)}x`;
    document.getElementById('stat-crit').textContent = `${Math.floor(p.stats.crit * 100)}%`;

    const wpn = RECIPES.find(r => r.id === p.equipment.weapon);
    document.getElementById('stat-weapon').textContent = wpn ? wpn.name : 'Rìu Thô Sơ';

    invGrid.innerHTML = '';
    for (const key in RESOURCE_TYPES) {
      const meta = RESOURCE_TYPES[key];
      const count = p.inventory[key] || 0;
      const item = document.createElement('div');
      item.className = 'inv-item';
      item.innerHTML = `
        <div style="color: ${meta.color}; font-weight: bold;">${meta.name}</div>
        <div class="inv-item-count">${count}</div>
      `;
      invGrid.appendChild(item);
    }
  }

  // UI Tick loop (HUD & Cooldown updates)
  function uiLoop() {
    const p = game.player;

    // Level badge
    levelBadge.textContent = `CẤP ${p.miningLevel} ${p.miningLevel >= 100 ? '👑 MAX' : ''}`;

    // HP Bar
    const hpPct = Math.max(0, Math.min(100, (p.hp / p.maxHp) * 100));
    hpFill.style.width = `${hpPct}%`;
    hpLabel.textContent = `${Math.floor(p.hp)} / ${p.maxHp} HP`;

    // EXP Bar
    const expPct = Math.max(0, Math.min(100, (p.miningExp / p.miningExpNeeded) * 100));
    expFill.style.width = `${p.miningLevel >= 100 ? 100 : expPct}%`;
    expLabel.textContent = p.miningLevel >= 100 ? 'MAX LV 100' : `EXP: ${p.miningExp} / ${p.miningExpNeeded}`;

    // Skill Quick Buttons
    for (const skillId in skillBtns) {
      const btn = skillBtns[skillId];
      if (!btn) continue;
      const skill = SKILLS.find(s => s.id === skillId);
      if (!skill) continue;

      const isUnlocked = p.miningLevel >= skill.reqLevel;
      const cd = p.skillCooldowns[skillId] || 0;
      const overlay = btn.querySelector('.skill-cd-overlay');

      if (isUnlocked) {
        btn.classList.remove('locked');
        btn.classList.add('unlocked');
        if (cd > 0) {
          overlay.style.display = 'flex';
          overlay.textContent = Math.ceil(cd);
        } else {
          overlay.style.display = 'none';
        }
      } else {
        btn.classList.add('locked');
        btn.classList.remove('unlocked');
        overlay.style.display = 'none';
      }
    }

    requestAnimationFrame(uiLoop);
  }
  uiLoop();
});
