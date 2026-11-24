import { Game } from './game.js';
import { SKILLS, TOOLS, EQUIPMENT_RECIPES, FACTORY_PRODUCTS, RAW_RESOURCES } from './data.js';

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
  const hpFill = document.getElementById('hp-fill');
  const hpLabel = document.getElementById('hp-label');
  const expFill = document.getElementById('exp-fill');
  const expLabel = document.getElementById('exp-label');

  // Modals
  const modalFactory = document.getElementById('modal-factory');
  const modalChar = document.getElementById('modal-char');
  const modalCraft = document.getElementById('modal-craft');
  const modalSkills = document.getElementById('modal-skills');
  const modalBackup = document.getElementById('modal-backup');

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
  btnAction.addEventListener('pointerdown', (e) => {
    e.preventDefault();
    window.soundEngine.ensureContext();
    game.performAction();
  });

  // Skill hotkeys / touches
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
  const maxJoyDist = 42;

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

  // Modal Open Buttons
  document.getElementById('btn-open-factory').addEventListener('click', () => {
    renderFactoryOperations();
    modalFactory.classList.add('active');
  });

  document.getElementById('btn-open-char').addEventListener('click', () => {
    renderCharacterModal();
    modalChar.classList.add('active');
  });

  document.getElementById('btn-open-craft').addEventListener('click', () => {
    renderCraftingModal(currentCraftTab);
    modalCraft.classList.add('active');
  });

  document.getElementById('btn-open-skills').addEventListener('click', () => {
    renderSkillsModal();
    modalSkills.classList.add('active');
  });

  document.getElementById('btn-open-backup').addEventListener('click', () => {
    document.getElementById('save-code-box').value = game.exportSaveCode();
    modalBackup.classList.add('active');
  });

  // Modal Close Buttons
  document.querySelectorAll('[data-close]').forEach(btn => {
    btn.addEventListener('click', () => {
      const modalId = btn.getAttribute('data-close');
      document.getElementById(modalId).classList.remove('active');
    });
  });

  document.querySelectorAll('.modal').forEach(m => {
    m.addEventListener('click', (e) => {
      if (e.target === m) m.classList.remove('active');
    });
  });

  // --- RENDER SANDSHIP FACTORY OPERATIONS ---
  function renderFactoryOperations() {
    const container = document.getElementById('factory-operations');
    container.innerHTML = `
      <!-- Station 1: Smelting Furnace -->
      <div class="factory-action-box">
        <b style="color: #ff9800;">🔥 LÒ NUNG QUẶNG (Smelter)</b>
        <div style="font-size: 11px; color: #8b949e;">Nung nóng quặng thô thành Thỏi Kim Loại đúc sẵn:</div>
        <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 4px;">
          <button class="factory-btn" id="btn-smelt-copper">Nung Thỏi Đồng (Cần 2 Quặng Đồng: ${game.player.inventory['ore_5'] || 0})</button>
          <button class="factory-btn" id="btn-smelt-iron">Nung Thỏi Sắt (Cần 2 Quặng Sắt: ${game.player.inventory['ore_12'] || 0})</button>
          <button class="factory-btn" id="btn-smelt-gold">Nung Thỏi Vàng (Cần 3 Quặng Vàng: ${game.player.inventory['ore_22'] || 0})</button>
          <button class="factory-btn" id="btn-smelt-titan">Nung Thỏi Titan (Cần 3 Quặng Titan: ${game.player.inventory['ore_40'] || 0})</button>
          <button class="factory-btn" id="btn-smelt-mythril">Nung Thỏi Thái Cổ (Cần 3 Quặng Thái Cổ: ${game.player.inventory['ore_50'] || 0})</button>
        </div>
      </div>

      <!-- Station 2: Hydraulic Press -->
      <div class="factory-action-box">
        <b style="color: #00e5ff;">🔨 MÁY ÉP TẤM (Hydraulic Press)</b>
        <div style="font-size: 11px; color: #8b949e;">Dập thỏi kim loại thành Tấm Thép bọc giáp:</div>
        <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 4px;">
          <button class="factory-btn" id="btn-press-iron">Ép Tấm Thép Sắt (Cần 1 Thỏi Sắt: ${game.player.inventory['ingot_iron'] || 0})</button>
          <button class="factory-btn" id="btn-press-silver">Ép Tấm Bạc (Cần 1 Thỏi Bạc: ${game.player.inventory['ingot_silver'] || 0})</button>
          <button class="factory-btn" id="btn-press-gold">Ép Tấm Vàng (Cần 1 Thỏi Vàng: ${game.player.inventory['ingot_gold'] || 0})</button>
          <button class="factory-btn" id="btn-press-titan">Ép Tấm Titan (Cần 1 Thỏi Titan: ${game.player.inventory['ingot_titan'] || 0})</button>
          <button class="factory-btn" id="btn-press-mythril">Ép Tấm Thái Cổ (Cần 1 Thỏi Thái Cổ: ${game.player.inventory['ingot_mythril'] || 0})</button>
        </div>
      </div>

      <!-- Station 3: Extruder Pipe Former -->
      <div class="factory-action-box">
        <b style="color: #e040fb;">⚙️ MÁY CÁN ĐÙN ỐNG (Pipe Extruder)</b>
        <div style="font-size: 11px; color: #8b949e;">Cán thỏi thành Ống Thép & Khung cơ khí:</div>
        <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 4px;">
          <button class="factory-btn" id="btn-extrude-copper">Cán Ống Đồng (Cần 1 Thỏi Đồng: ${game.player.inventory['ingot_copper'] || 0})</button>
          <button class="factory-btn" id="btn-extrude-steel">Cán Ống Thép Sắt (Cần 1 Thỏi Sắt: ${game.player.inventory['ingot_iron'] || 0})</button>
          <button class="factory-btn" id="btn-extrude-titan">Cán Ống Titan (Cần 1 Thỏi Titan: ${game.player.inventory['ingot_titan'] || 0})</button>
          <button class="factory-btn" id="btn-extrude-mythril">Cán Ống Thái Cổ (Cần 1 Thỏi Thái Cổ: ${game.player.inventory['ingot_mythril'] || 0})</button>
        </div>
      </div>

      <!-- Station 4: Loom Weaver -->
      <div class="factory-action-box">
        <b style="color: #69f0ae;">🧶 MÁY DỆT SỢI BÔNG (Weaving Loom)</b>
        <div style="font-size: 11px; color: #8b949e;">Kéo sợi bông dại thành Cuộn Vải may mặc:</div>
        <div style="display: flex; flex-direction: column; gap: 4px; margin-top: 4px;">
          <button class="factory-btn" id="btn-weave-rough">Dệt Vải Thô (Cần 2 Bông Cỏ Dại: ${game.player.inventory['flora_1'] || 0})</button>
          <button class="factory-btn" id="btn-weave-fine">Dệt Vải Bông Trắng (Cần 2 Bông Trắng: ${game.player.inventory['flora_5'] || 0})</button>
          <button class="factory-btn" id="btn-weave-silver">Dệt Ngân Sợi (Cần 2 Thảo Dược Bạc: ${game.player.inventory['flora_18'] || 0})</button>
          <button class="factory-btn" id="btn-weave-mythic">Dệt Vải Thần Liên (Cần 2 Thần Liên: ${game.player.inventory['flora_50'] || 0})</button>
        </div>
      </div>
    `;

    // Connect Smelter buttons
    document.getElementById('btn-smelt-copper')?.addEventListener('click', () => { game.runFactorySmelt('ore_5'); renderFactoryOperations(); });
    document.getElementById('btn-smelt-iron')?.addEventListener('click', () => { game.runFactorySmelt('ore_12'); renderFactoryOperations(); });
    document.getElementById('btn-smelt-gold')?.addEventListener('click', () => { game.runFactorySmelt('ore_22'); renderFactoryOperations(); });
    document.getElementById('btn-smelt-titan')?.addEventListener('click', () => { game.runFactorySmelt('ore_40'); renderFactoryOperations(); });
    document.getElementById('btn-smelt-mythril')?.addEventListener('click', () => { game.runFactorySmelt('ore_50'); renderFactoryOperations(); });

    // Connect Press buttons
    document.getElementById('btn-press-iron')?.addEventListener('click', () => { game.runFactoryPress('ingot_iron'); renderFactoryOperations(); });
    document.getElementById('btn-press-silver')?.addEventListener('click', () => { game.runFactoryPress('ingot_silver'); renderFactoryOperations(); });
    document.getElementById('btn-press-gold')?.addEventListener('click', () => { game.runFactoryPress('ingot_gold'); renderFactoryOperations(); });
    document.getElementById('btn-press-titan')?.addEventListener('click', () => { game.runFactoryPress('ingot_titan'); renderFactoryOperations(); });
    document.getElementById('btn-press-mythril')?.addEventListener('click', () => { game.runFactoryPress('ingot_mythril'); renderFactoryOperations(); });

    // Connect Extruder buttons
    document.getElementById('btn-extrude-copper')?.addEventListener('click', () => { game.runFactoryExtrude('ingot_copper'); renderFactoryOperations(); });
    document.getElementById('btn-extrude-steel')?.addEventListener('click', () => { game.runFactoryExtrude('ingot_iron'); renderFactoryOperations(); });
    document.getElementById('btn-extrude-titan')?.addEventListener('click', () => { game.runFactoryExtrude('ingot_titan'); renderFactoryOperations(); });
    document.getElementById('btn-extrude-mythril')?.addEventListener('click', () => { game.runFactoryExtrude('ingot_mythril'); renderFactoryOperations(); });

    // Connect Weaver buttons
    document.getElementById('btn-weave-rough')?.addEventListener('click', () => { game.runFactoryWeave('flora_1'); renderFactoryOperations(); });
    document.getElementById('btn-weave-fine')?.addEventListener('click', () => { game.runFactoryWeave('flora_5'); renderFactoryOperations(); });
    document.getElementById('btn-weave-silver')?.addEventListener('click', () => { game.runFactoryWeave('flora_18'); renderFactoryOperations(); });
    document.getElementById('btn-weave-mythic')?.addEventListener('click', () => { game.runFactoryWeave('flora_50'); renderFactoryOperations(); });
  }

  // --- RENDER CHARACTER PAPERDOLL (5 SLOTS & 4 TOOLS) ---
  function renderCharacterModal() {
    const p = game.player;
    document.getElementById('char-lvl-display').textContent = `Cấp ${p.miningLevel} Thợ Mỏ`;

    // 5 Equipment Slots
    const wpn = EQUIPMENT_RECIPES.find(r => r.id === p.equipment.weapon);
    const helm = EQUIPMENT_RECIPES.find(r => r.id === p.equipment.helmet);
    const arm = EQUIPMENT_RECIPES.find(r => r.id === p.equipment.armor);
    const pants = EQUIPMENT_RECIPES.find(r => r.id === p.equipment.pants);
    const boots = EQUIPMENT_RECIPES.find(r => r.id === p.equipment.boots);

    document.getElementById('slot-wpn-name').textContent = wpn ? wpn.name : 'Tay không';
    document.getElementById('slot-helm-name').textContent = helm ? helm.name : 'Chưa có';
    document.getElementById('slot-arm-name').textContent = arm ? arm.name : 'Áo vải';
    document.getElementById('slot-pants-name').textContent = pants ? pants.name : 'Quần vải';
    document.getElementById('slot-boots-name').textContent = boots ? boots.name : 'Chưa có';

    // 4 Gathering Tools Badges
    const axe = TOOLS[p.tools.axe];
    const pick = TOOLS[p.tools.pickaxe];
    const knife = TOOLS[p.tools.knife];
    const sickle = TOOLS[p.tools.sickle];

    document.getElementById('tool-axe-badge').textContent = axe ? `Lv ${axe.reqLv} - ${axe.name}` : 'Lv 1';
    document.getElementById('tool-pick-badge').textContent = pick ? `Lv ${pick.reqLv} - ${pick.name}` : 'Lv 1';
    document.getElementById('tool-knife-badge').textContent = knife ? `Lv ${knife.reqLv} - ${knife.name}` : 'Lv 1';
    document.getElementById('tool-sickle-badge').textContent = sickle ? `Lv ${sickle.reqLv} - ${sickle.name}` : 'Lv 1';

    // Stats
    document.getElementById('stat-atk').textContent = `${p.stats.atk}`;
    document.getElementById('stat-def').textContent = `${p.stats.def}`;
    document.getElementById('stat-crit').textContent = `${Math.floor(p.stats.crit * 100)}%`;
  }

  // --- RENDER CRAFTING & TOOL UPGRADE MODAL ---
  let currentCraftTab = 'equip';
  document.getElementById('tab-craft-equip').addEventListener('click', () => {
    currentCraftTab = 'equip';
    document.getElementById('tab-craft-equip').style.background = '#ffd700';
    document.getElementById('tab-craft-equip').style.color = '#17130e';
    document.getElementById('tab-craft-tools').style.background = 'linear-gradient(180deg, #2d261e 0%, #17130e 100%)';
    document.getElementById('tab-craft-tools').style.color = '#fce8a6';
    renderCraftingModal('equip');
  });

  document.getElementById('tab-craft-tools').addEventListener('click', () => {
    currentCraftTab = 'tools';
    document.getElementById('tab-craft-tools').style.background = '#ffd700';
    document.getElementById('tab-craft-tools').style.color = '#17130e';
    document.getElementById('tab-craft-equip').style.background = 'linear-gradient(180deg, #2d261e 0%, #17130e 100%)';
    document.getElementById('tab-craft-equip').style.color = '#fce8a6';
    renderCraftingModal('tools');
  });

  function renderCraftingModal(tab = 'equip') {
    const container = document.getElementById('crafting-items-container');
    container.innerHTML = '';

    if (tab === 'equip') {
      EQUIPMENT_RECIPES.forEach(recipe => {
        const card = document.createElement('div');
        card.className = 'recipe-card';

        let canCraft = true;
        let costHtml = '';
        for (const res in recipe.cost) {
          const required = recipe.cost[res];
          const owned = game.player.inventory[res] || 0;
          const hasEnough = owned >= required;
          if (!hasEnough) canCraft = false;

          const meta = RAW_RESOURCES[res] || FACTORY_PRODUCTS[res];
          const name = meta ? meta.name : res;
          costHtml += `<span class="cost-tag ${hasEnough ? 'ready' : 'lack'}">${name}: ${owned}/${required}</span>`;
        }

        const isEquipped = game.player.equipment[recipe.slot] === recipe.id;

        card.innerHTML = `
          <div class="recipe-header">
            <span class="recipe-name">${recipe.name} (${recipe.slot.toUpperCase()})</span>
            <span style="font-size: 11px; color: #ffd700;">Bậc ${recipe.tier}</span>
          </div>
          <div style="font-size: 11px; color: #8b949e;">${recipe.desc}</div>
          <div class="recipe-costs">${costHtml}</div>
          <button class="mmo-btn" style="align-self: flex-end;" ${!canCraft || isEquipped ? 'disabled' : ''}>
            ${isEquipped ? 'Đang mặc' : (canCraft ? 'Chế tạo & Mặc' : 'Thiếu vật liệu')}
          </button>
        `;

        const btn = card.querySelector('button');
        if (canCraft && !isEquipped) {
          btn.addEventListener('click', () => {
            game.craftEquipment(recipe.id);
            renderCraftingModal('equip');
          });
        }
        container.appendChild(card);
      });
    } else {
      // 4 Gathering Tools Upgrades
      Object.values(TOOLS).forEach(tool => {
        const card = document.createElement('div');
        card.className = 'recipe-card';

        let canCraft = true;
        let costHtml = '';
        for (const res in tool.cost) {
          const required = tool.cost[res];
          const owned = game.player.inventory[res] || 0;
          const hasEnough = owned >= required;
          if (!hasEnough) canCraft = false;

          const meta = RAW_RESOURCES[res] || FACTORY_PRODUCTS[res];
          const name = meta ? meta.name : res;
          costHtml += `<span class="cost-tag ${hasEnough ? 'ready' : 'lack'}">${name}: ${owned}/${required}</span>`;
        }

        const currentToolId = game.player.tools[tool.type];
        const isEquipped = currentToolId === tool.id;

        card.innerHTML = `
          <div class="recipe-header">
            <span class="recipe-name">${tool.name} (Cấp ${tool.reqLv})</span>
            <span style="font-size: 11px; color: #00e676;">Sức mạnh: ${tool.power}</span>
          </div>
          <div class="recipe-costs">${costHtml}</div>
          <button class="mmo-btn" style="align-self: flex-end;" ${!canCraft || isEquipped ? 'disabled' : ''}>
            ${isEquipped ? 'Đang dùng' : (canCraft ? 'Nâng cấp công cụ' : 'Thiếu vật liệu')}
          </button>
        `;

        const btn = card.querySelector('button');
        if (canCraft && !isEquipped) {
          btn.addEventListener('click', () => {
            game.upgradeTool(tool.id);
            renderCraftingModal('tools');
          });
        }
        container.appendChild(card);
      });
    }
  }

  // --- RENDER 10 SKILLS MODAL ---
  function renderSkillsModal() {
    const list = document.getElementById('skills-list');
    list.innerHTML = '';
    SKILLS.forEach(skill => {
      const isUnlocked = game.player.miningLevel >= skill.reqLevel;
      const card = document.createElement('div');
      card.className = 'recipe-card';
      card.style.borderColor = isUnlocked ? '#00e676' : '#443725';

      card.innerHTML = `
        <div class="recipe-header">
          <span style="font-size: 13px; font-weight: bold; color: ${isUnlocked ? '#ffd700' : '#8b949e'};">
            ${skill.icon} ${skill.name} (Mốc Lv ${skill.reqLevel})
          </span>
          <span style="font-size: 11px; color: ${skill.type === 'active' ? '#ff7043' : '#42a5f5'};">
            ${skill.type === 'active' ? 'KÍCH HOẠT (Phím ' + (skill.hotkey || '') + ')' : 'THỤ ĐỘNG'}
          </span>
        </div>
        <div style="font-size: 11px; color: #8b949e;">${skill.description}</div>
        <div style="font-size: 11px; font-weight: bold; color: ${isUnlocked ? '#00e676' : '#ff5252'}; align-self: flex-end;">
          ${isUnlocked ? '✔ ĐÃ MỞ KHÓA' : '🔒 CẦN LV ' + skill.reqLevel}
        </div>
      `;
      list.appendChild(card);
    });
  }

  // --- BACKUP & SAVE CODE HANDLERS ---
  document.getElementById('btn-copy-save').addEventListener('click', () => {
    const box = document.getElementById('save-code-box');
    box.select();
    navigator.clipboard.writeText(box.value).then(() => {
      alert('Đã sao chép chuỗi mã lưu thành công! Hãy dán vào Ghi Chú để lưu giữ nhé.');
    }).catch(() => {
      alert('Hãy bôi đen và sao chép thủ công chuỗi mã trong ô.');
    });
  });

  document.getElementById('btn-import-save').addEventListener('click', () => {
    const str = prompt('Dán chuỗi mã lưu (Save Code) của bạn vào đây:');
    if (str) {
      const success = game.importSaveCode(str.trim());
      if (success) {
        alert('Đã khôi phục thành công tiến trình game!');
        window.location.reload();
      } else {
        alert('Mã lưu không hợp lệ, vui lòng kiểm tra lại!');
      }
    }
  });

  document.getElementById('btn-reset-game').addEventListener('click', () => {
    if (confirm('Bạn có chắc muốn xóa toàn bộ dữ liệu chơi lại từ đầu không?')) {
      game.resetSave();
    }
  });

  // UI Tick Loop
  function uiLoop() {
    const p = game.player;

    const hpPct = Math.max(0, Math.min(100, (p.hp / p.maxHp) * 100));
    hpFill.style.width = `${hpPct}%`;
    hpLabel.textContent = `${Math.floor(p.hp)} / ${p.maxHp} HP`;

    const expPct = Math.max(0, Math.min(100, (p.miningExp / p.miningExpNeeded) * 100));
    expFill.style.width = `${p.miningLevel >= 100 ? 100 : expPct}%`;
    expLabel.textContent = p.miningLevel >= 100 ? 'CẤP 100 (MAX)' : `CẤP ${p.miningLevel} - EXP: ${p.miningExp}/${p.miningExpNeeded}`;

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
