// Game Database: Skills (10 to 100), Resources, Recipes, Monsters

export const SKILLS = [
  {
    id: 'skill_10',
    reqLevel: 10,
    name: 'Mắt Tinh Anh',
    type: 'passive',
    icon: '👁️',
    description: 'Thụ động: Tăng 25% cơ hội rớt gấp đôi tài nguyên khi khai thác bất kỳ mỏ quặng nào.',
    effect: { doubleDropChance: 0.25 }
  },
  {
    id: 'skill_20',
    reqLevel: 20,
    name: 'Cú Nện Chấn Động',
    type: 'active',
    icon: '🔨',
    cooldown: 12,
    hotkey: '1',
    description: 'Kích hoạt: Dộng cuốc cực mạnh tạo sóng chấn động gây 200 sát thương diện rộng và lập tức khai thác toàn bộ tài nguyên trong phạm vi 180px.',
    effect: { damage: 200, radius: 180 }
  },
  {
    id: 'skill_30',
    reqLevel: 30,
    name: 'Thể Lực Thợ Mỏ',
    type: 'passive',
    icon: '⚡',
    description: 'Thụ động: Tăng vĩnh viễn 25% tốc độ di chuyển và tăng 100 Máu tối đa của thợ mỏ.',
    effect: { speedBonus: 0.25, maxHpBonus: 100 }
  },
  {
    id: 'skill_40',
    reqLevel: 40,
    name: 'Cuồng Nộ Địa Mẫu',
    type: 'active',
    icon: '🔥',
    cooldown: 18,
    duration: 8,
    hotkey: '2',
    description: 'Kích hoạt: Vào trạng thái Cuồng Nộ trong 8s: Tăng 150% tốc độ khai thác và hồi 5% HP mỗi lần cuốc trúng mỏ.',
    effect: { speedMult: 2.5, healPercent: 0.05 }
  },
  {
    id: 'skill_50',
    reqLevel: 50,
    name: 'Bàn Tay Luyện Kim',
    type: 'passive',
    icon: '✨',
    description: 'Thụ động: 20% tỉ lệ chuyển hoá quặng thường thành quặng quý hiếm cấp cao hơn ngay khi khai thác.',
    effect: { transmuteChance: 0.2 }
  },
  {
    id: 'skill_60',
    reqLevel: 60,
    name: 'Vòng Xoáy Thần Tốc',
    type: 'active',
    icon: '🌪️',
    cooldown: 20,
    duration: 5,
    hotkey: '3',
    description: 'Kích hoạt: Biến thành lốc xoáy mũi khoan trong 5s: Gây 60 sát thương/giây xung quanh và tự động hút sạch tài nguyên trên đường di chuyển.',
    effect: { dps: 60, suckRadius: 220 }
  },
  {
    id: 'skill_70',
    reqLevel: 70,
    name: 'Bậc Thầy Rèn Đúc',
    type: 'passive',
    icon: '🛡️',
    description: 'Thụ động: Giảm 25% nguyên liệu khi chế tạo trang bị, và tăng 20% chỉ số tất cả trang bị rèn ra.',
    effect: { craftCostReduction: 0.25, statBonus: 0.2 }
  },
  {
    id: 'skill_80',
    reqLevel: 80,
    name: 'Khai Mỏ Thần Quang',
    type: 'active',
    icon: '☄️',
    cooldown: 25,
    hotkey: '4',
    description: 'Kích hoạt: Triệu hồi mưa thiên thạch năng lượng khai thác lập tức tất cả mỏ tài nguyên trên màn hình và gây 350 sát thương lên quái vật.',
    effect: { globalMining: true, damage: 350 }
  },
  {
    id: 'skill_90',
    reqLevel: 90,
    name: 'Hắc Giáp Kim Cang',
    type: 'passive',
    icon: '💎',
    description: 'Thụ động: Giảm 35% sát thương nhận vào, kháng hiệu ứng và phản lại 30% sát thương cho kẻ tấn công cận chiến.',
    effect: { damageReduction: 0.35, reflect: 0.3 }
  },
  {
    id: 'skill_100',
    reqLevel: 100,
    name: 'Thần Khai Mỏ Tối Thượng',
    type: 'active',
    icon: '👑',
    cooldown: 40,
    duration: 12,
    hotkey: '5',
    description: 'Kích hoạt: Hóa thân Thần Titan Khai Sáng trong 12s: Bất tử, tăng 100% kích thước, đòn đánh tạo sóng chấn thiên quét sạch quái vật và phá vỡ mọi mỏ đá lập tức!',
    effect: { invulnerable: true, instantMine: true, aoeDamage: 500 }
  }
];

export const RESOURCE_TYPES = {
  wood: { name: 'Gỗ Rừng', color: '#8d5524', exp: 12, rarity: 'common', hardness: 20 },
  stone: { name: 'Đá Thô', color: '#9e9e9e', exp: 20, rarity: 'common', hardness: 40 },
  iron: { name: 'Quặng Sắt', color: '#b0bec5', exp: 45, rarity: 'uncommon', hardness: 80 },
  gold: { name: 'Quặng Vàng', color: '#ffd700', exp: 90, rarity: 'rare', hardness: 140 },
  diamond: { name: 'Kim Cương', color: '#00e5ff', exp: 200, rarity: 'epic', hardness: 240 },
  obsidian: { name: 'Hắc Diện Thạch', color: '#311b92', exp: 450, rarity: 'epic', hardness: 400 },
  mythril: { name: 'Tinh Thể Mythril', color: '#e040fb', exp: 900, rarity: 'legendary', hardness: 650 },
  monster_leather: { name: 'Da Thú Quái', color: '#a1887f', exp: 0, rarity: 'uncommon' },
  golem_core: { name: 'Lõi Golem', color: '#ff7043', exp: 0, rarity: 'rare' },
  titan_shard: { name: 'Mảnh Titan', color: '#ff1744', exp: 0, rarity: 'legendary' }
};

export const RECIPES = [
  // --- VŨ KHÍ (WEAPONS) ---
  {
    id: 'wpn_wood_axe',
    name: 'Rìu Gỗ Sơ Khai',
    category: 'weapon',
    tier: 1,
    desc: 'Vũ khí thô sơ tự vệ ban đầu.',
    stats: { atk: 12, crit: 0.02 },
    cost: { wood: 15, stone: 5 }
  },
  {
    id: 'wpn_iron_sword',
    name: 'Kiếm Sắt Tinh Luyện',
    category: 'weapon',
    tier: 2,
    desc: 'Lưỡi kiếm sắt rèn bén ngọt.',
    stats: { atk: 28, crit: 0.05 },
    cost: { wood: 20, iron: 25 }
  },
  {
    id: 'wpn_gold_blade',
    name: 'Song Đao Hoàng Kim',
    category: 'weapon',
    tier: 3,
    desc: 'Được dát bằng vàng ròng, tốc độ chém nhanh.',
    stats: { atk: 60, crit: 0.12, speed: 0.1 },
    cost: { iron: 30, gold: 35, monster_leather: 8 }
  },
  {
    id: 'wpn_diamond_claymore',
    name: 'Đại Kiếm Kim Cương',
    category: 'weapon',
    tier: 4,
    desc: 'Lưỡi kiếm sắc bén cắt đứt mọi loại giáp.',
    stats: { atk: 120, crit: 0.2 },
    cost: { gold: 30, diamond: 25, golem_core: 5 }
  },
  {
    id: 'wpn_obsidian_reaper',
    name: 'Hắc Kiếm Obsidian',
    category: 'weapon',
    tier: 5,
    desc: 'Vũ khí rèn từ đá nham thạch cổ, hút máu kẻ thù.',
    stats: { atk: 230, crit: 0.25, lifesteal: 0.1 },
    cost: { diamond: 20, obsidian: 30, golem_core: 10 }
  },
  {
    id: 'wpn_mythril_saber',
    name: 'Thánh Kiếm Mythril Thần Thoại',
    category: 'weapon',
    tier: 6,
    desc: 'Thánh kiếm tỏa ra luồng năng lượng thần thánh quét sạch quái vật.',
    stats: { atk: 450, crit: 0.35, beamWave: true },
    cost: { obsidian: 35, mythril: 25, titan_shard: 5 }
  },

  // --- GIÁP TRANG BỊ (ARMOR) ---
  {
    id: 'arm_leather',
    name: 'Áo Da Thú Săn',
    category: 'armor',
    tier: 1,
    desc: 'Giáp nhẹ từ da thú, giúp di chuyển linh hoạt.',
    stats: { def: 8, hp: 40, spd: 0.05 },
    cost: { wood: 10, monster_leather: 5 }
  },
  {
    id: 'arm_iron',
    name: 'Giáp Sắt Chiến Binh',
    category: 'armor',
    tier: 2,
    desc: 'Bộ giáp sắt vững chãi của hiệp sĩ.',
    stats: { def: 25, hp: 120 },
    cost: { iron: 30, monster_leather: 10 }
  },
  {
    id: 'arm_gold',
    name: 'Hoàng Kim Thánh Giáp',
    category: 'armor',
    tier: 3,
    desc: 'Hào quang vàng liên tục hồi phục thể lực.',
    stats: { def: 55, hp: 260, hpRegen: 4 },
    cost: { iron: 25, gold: 40, monster_leather: 15 }
  },
  {
    id: 'arm_diamond',
    name: 'Giáp Kim Cương Vĩnh Cửu',
    category: 'armor',
    tier: 4,
    desc: 'Lớp giáp kết tinh từ kim cương cứng cáp không gì xuyên thủng.',
    stats: { def: 110, hp: 550 },
    cost: { gold: 30, diamond: 30, golem_core: 8 }
  },
  {
    id: 'arm_obsidian',
    name: 'Hắc Giáp Hư Không',
    category: 'armor',
    tier: 5,
    desc: 'Hấp thụ 20% sát thương ma thuật và giảm chấn động va đập.',
    stats: { def: 200, hp: 950, damageReduction: 0.15 },
    cost: { diamond: 25, obsidian: 40, golem_core: 15 }
  },
  {
    id: 'arm_mythril',
    name: 'Thần Long Chiến Giáp Mythril',
    category: 'armor',
    tier: 6,
    desc: 'Bộ chiến giáp tối thượng của Vua Khai Mỏ, tăng máu cực đại.',
    stats: { def: 380, hp: 2000, auraDmg: 30 },
    cost: { obsidian: 40, mythril: 30, titan_shard: 6 }
  },

  // --- KHIÊN PHÒNG THỦ (SHIELD) ---
  {
    id: 'sld_wood',
    name: 'Khiên Gỗ Cổ',
    category: 'shield',
    tier: 1,
    desc: 'Khiên gỗ thô sơ đỡ đòn.',
    stats: { def: 6, blockChance: 0.1 },
    cost: { wood: 20, stone: 10 }
  },
  {
    id: 'sld_iron',
    name: 'Khiên Thép Gai',
    category: 'shield',
    tier: 2,
    desc: 'Gai sắt phản lại sát thương khi bị đánh lén.',
    stats: { def: 18, blockChance: 0.15, reflectDmg: 10 },
    cost: { iron: 25, monster_leather: 8 }
  },
  {
    id: 'sld_diamond',
    name: 'Khiên Kim Cương Hào Quang',
    category: 'shield',
    tier: 4,
    desc: 'Khiên phản xạ tia năng lượng và tăng khả năng chặn đòn.',
    stats: { def: 75, blockChance: 0.25, hp: 200 },
    cost: { diamond: 25, gold: 20, golem_core: 5 }
  },
  {
    id: 'sld_mythril',
    name: 'Thái Cổ Khiên Thần',
    category: 'shield',
    tier: 6,
    desc: 'Khiên chắn bất hoại giúp bảo vệ người mang tuyệt đối.',
    stats: { def: 180, blockChance: 0.4, hp: 600 },
    cost: { mythril: 25, obsidian: 20, titan_shard: 5 }
  },

  // --- CUỐC KHAI THÁC (PICKAXE) ---
  {
    id: 'tool_stone_pick',
    name: 'Cuốc Đá Cơ Bản',
    category: 'tool',
    tier: 1,
    desc: 'Dụng cụ đào quặng căn bản.',
    stats: { minePower: 15, mineSpeed: 1.0 },
    cost: { wood: 10, stone: 15 }
  },
  {
    id: 'tool_iron_pick',
    name: 'Cuốc Sắt Thợ Rèn',
    category: 'tool',
    tier: 2,
    desc: 'Đào quặng nhanh hơn gấp đôi cuốc đá.',
    stats: { minePower: 35, mineSpeed: 1.3 },
    cost: { wood: 15, iron: 25 }
  },
  {
    id: 'tool_gold_pick',
    name: 'Cuốc Vàng Tài Lộc',
    category: 'tool',
    tier: 3,
    desc: 'Tăng 20% lượng EXP nhận được khi khai thác.',
    stats: { minePower: 70, mineSpeed: 1.6, bonusExp: 0.2 },
    cost: { iron: 20, gold: 35 }
  },
  {
    id: 'tool_diamond_pick',
    name: 'Cuốc Kim Cương Sắc Lẹm',
    category: 'tool',
    tier: 4,
    desc: 'Phá hủy quặng đá nhanh như chớp.',
    stats: { minePower: 140, mineSpeed: 2.0 },
    cost: { gold: 25, diamond: 30 }
  },
  {
    id: 'tool_obsidian_pick',
    name: 'Cuốc Hắc Diện Thạch',
    category: 'tool',
    tier: 5,
    desc: 'Sức mạnh nham thạch phá tan mọi chướng ngại vật.',
    stats: { minePower: 260, mineSpeed: 2.5 },
    cost: { diamond: 25, obsidian: 35, golem_core: 8 }
  },
  {
    id: 'tool_mythril_pick',
    name: 'Thần Cuốc Tinh Vân',
    category: 'tool',
    tier: 6,
    desc: 'Cuốc truyền thuyết đào 1 nhát nổ tung cả mạch quặng!',
    stats: { minePower: 500, mineSpeed: 3.2, multiMine: true },
    cost: { obsidian: 30, mythril: 30, titan_shard: 6 }
  }
];

export const MONSTER_TYPES = {
  slime: {
    name: 'Slime Rừng Xanh',
    color: '#4caf50',
    radius: 14,
    hp: 45,
    atk: 8,
    speed: 1.2,
    exp: 25,
    drops: [{ id: 'monster_leather', chance: 0.6, count: 1 }, { id: 'wood', chance: 0.8, count: 3 }]
  },
  spider: {
    name: 'Nhện Độc Hang Động',
    color: '#8e24aa',
    radius: 16,
    hp: 90,
    atk: 16,
    speed: 1.8,
    exp: 45,
    drops: [{ id: 'monster_leather', chance: 0.8, count: 2 }, { id: 'stone', chance: 0.7, count: 4 }]
  },
  golem: {
    name: 'Người Đá Cổ Thạch',
    color: '#795548',
    radius: 22,
    hp: 240,
    atk: 32,
    speed: 0.8,
    exp: 110,
    drops: [{ id: 'golem_core', chance: 0.8, count: 1 }, { id: 'iron', chance: 0.9, count: 5 }]
  },
  wraith: {
    name: 'Bóng Ma Hư Không',
    color: '#3949ab',
    radius: 18,
    hp: 350,
    atk: 50,
    speed: 1.5,
    exp: 220,
    drops: [{ id: 'gold', chance: 0.8, count: 4 }, { id: 'diamond', chance: 0.5, count: 2 }]
  },
  boss_titan: {
    name: 'Chúa Tể Mỏ Quặng TITAN',
    color: '#d50000',
    radius: 36,
    hp: 2500,
    atk: 85,
    speed: 1.0,
    exp: 1500,
    isBoss: true,
    drops: [
      { id: 'titan_shard', chance: 1.0, count: 2 },
      { id: 'mythril', chance: 1.0, count: 8 },
      { id: 'obsidian', chance: 1.0, count: 12 }
    ]
  }
};
