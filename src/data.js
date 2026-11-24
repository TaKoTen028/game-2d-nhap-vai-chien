// Game Data: 10 Resource Tiers (Lv 1-50), 4 Gathering Tools, 5 Equipment Slots, Sandship Factory Recipes & 10 Skills

export const RESOURCE_LEVELS = [1, 5, 12, 18, 22, 28, 34, 40, 45, 50];

// --- 10 TIERS OF RAW RESOURCES ---
export const RAW_RESOURCES = {
  // 1. GỖ (WOOD)
  wood_1: { id: 'wood_1', name: 'Gỗ Thường', reqLv: 1, type: 'wood', color: '#8d5524', exp: 10, hardness: 20 },
  wood_5: { id: 'wood_5', name: 'Gỗ Bạch Dương', reqLv: 5, type: 'wood', color: '#d7ccc8', exp: 25, hardness: 35 },
  wood_12: { id: 'wood_12', name: 'Gỗ Sồi Già', reqLv: 12, type: 'wood', color: '#5d4037', exp: 50, hardness: 65 },
  wood_18: { id: 'wood_18', name: 'Gỗ Thiết Mộc', reqLv: 18, type: 'wood', color: '#37474f', exp: 90, hardness: 110 },
  wood_22: { id: 'wood_22', name: 'Gỗ Huyết Đỏ', reqLv: 22, type: 'wood', color: '#b71c1c', exp: 140, hardness: 160 },
  wood_28: { id: 'wood_28', name: 'Gỗ Cổ Thụ', reqLv: 28, type: 'wood', color: '#4e342e', exp: 210, hardness: 230 },
  wood_34: { id: 'wood_34', name: 'Gỗ Tinh Linh', reqLv: 34, type: 'wood', color: '#00e676', exp: 300, hardness: 320 },
  wood_40: { id: 'wood_40', name: 'Gỗ Hư Không', reqLv: 40, type: 'wood', color: '#4a148c', exp: 420, hardness: 440 },
  wood_45: { id: 'wood_45', name: 'Gỗ Long Thần', reqLv: 45, type: 'wood', color: '#ff6f00', exp: 580, hardness: 600 },
  wood_50: { id: 'wood_50', name: 'Gỗ Thái Cổ', reqLv: 50, type: 'wood', color: '#ffd700', exp: 800, hardness: 800 },

  // 2. QUẶNG / ĐÁ (ORE / STONE)
  ore_1: { id: 'ore_1', name: 'Đá Thô', reqLv: 1, type: 'ore', color: '#9e9e9e', exp: 12, hardness: 25 },
  ore_5: { id: 'ore_5', name: 'Quặng Đồng', reqLv: 5, type: 'ore', color: '#b87333', exp: 30, hardness: 45 },
  ore_12: { id: 'ore_12', name: 'Quặng Sắt', reqLv: 12, type: 'ore', color: '#b0bec5', exp: 60, hardness: 85 },
  ore_18: { id: 'ore_18', name: 'Quặng Bạc', reqLv: 18, type: 'ore', color: '#e0e0e0', exp: 105, hardness: 130 },
  ore_22: { id: 'ore_22', name: 'Quặng Vàng', reqLv: 22, type: 'ore', color: '#ffd700', exp: 160, hardness: 190 },
  ore_28: { id: 'ore_28', name: 'Quặng Bạch Kim', reqLv: 28, type: 'ore', color: '#cfd8dc', exp: 240, hardness: 270 },
  ore_34: { id: 'ore_34', name: 'Quặng Kim Cương', reqLv: 34, type: 'ore', color: '#00e5ff', exp: 350, hardness: 380 },
  ore_40: { id: 'ore_40', name: 'Quặng Titan', reqLv: 40, type: 'ore', color: '#78909c', exp: 500, hardness: 520 },
  ore_45: { id: 'ore_45', name: 'Hắc Diện Thạch (Obsidian)', reqLv: 45, type: 'ore', color: '#311b92', exp: 700, hardness: 700 },
  ore_50: { id: 'ore_50', name: 'Tinh Thể Thái Cổ (Mythril)', reqLv: 50, type: 'ore', color: '#e040fb', exp: 1000, hardness: 950 },

  // 3. BÔNG / THẢO DƯỢC (COTTON / FLORA)
  flora_1: { id: 'flora_1', name: 'Bông Cỏ Dại', reqLv: 1, type: 'flora', color: '#f5f5f5', exp: 10, hardness: 15 },
  flora_5: { id: 'flora_5', name: 'Bông Trắng Thô', reqLv: 5, type: 'flora', color: '#eceff1', exp: 25, hardness: 30 },
  flora_12: { id: 'flora_12', name: 'Bông Gai Đồng', reqLv: 12, type: 'flora', color: '#ffcc80', exp: 50, hardness: 55 },
  flora_18: { id: 'flora_18', name: 'Thảo Dược Bạc', reqLv: 18, type: 'flora', color: '#b2dfdb', exp: 90, hardness: 90 },
  flora_22: { id: 'flora_22', name: 'Hoàng Liên Hoa', reqLv: 22, type: 'flora', color: '#fff59d', exp: 140, hardness: 140 },
  flora_28: { id: 'flora_28', name: 'Nguyệt Thảo', reqLv: 28, type: 'flora', color: '#80deea', exp: 210, hardness: 200 },
  flora_34: { id: 'flora_34', name: 'Băng Tinh Hoa', reqLv: 34, type: 'flora', color: '#80d8ff', exp: 300, hardness: 280 },
  flora_40: { id: 'flora_40', name: 'Dạ Quang Thảo', reqLv: 40, type: 'flora', color: '#b388ff', exp: 420, hardness: 380 },
  flora_45: { id: 'flora_45', name: 'Huyết Long Hoa', reqLv: 45, type: 'flora', color: '#ff8a80', exp: 580, hardness: 500 },
  flora_50: { id: 'flora_50', name: 'Thái Cổ Thần Liên', reqLv: 50, type: 'flora', color: '#ea80fc', exp: 800, hardness: 700 },

  // 4. DA THÚ (LEATHER / PELT)
  pelt_1: { id: 'pelt_1', name: 'Da Thỏ Nhỏ', reqLv: 1, type: 'pelt', color: '#d7ccc8', exp: 15 },
  pelt_5: { id: 'pelt_5', name: 'Da Sói Xám', reqLv: 5, type: 'pelt', color: '#90a4ae', exp: 35 },
  pelt_12: { id: 'pelt_12', name: 'Da Lợn Rừng', reqLv: 12, type: 'pelt', color: '#8d6e63', exp: 70 },
  pelt_18: { id: 'pelt_18', name: 'Da Báo Bạc', reqLv: 18, type: 'pelt', color: '#cfd8dc', exp: 120 },
  pelt_22: { id: 'pelt_22', name: 'Da Gấu Vàng', reqLv: 22, type: 'pelt', color: '#ffe082', exp: 180 },
  pelt_28: { id: 'pelt_28', name: 'Da Tê Giác', reqLv: 28, type: 'pelt', color: '#78909c', exp: 260 },
  pelt_34: { id: 'pelt_34', name: 'Da Thằn Lằn Băng', reqLv: 34, type: 'pelt', color: '#80deea', exp: 370 },
  pelt_40: { id: 'pelt_40', name: 'Da Thú Titan', reqLv: 40, type: 'pelt', color: '#546e7a', exp: 520 },
  pelt_45: { id: 'pelt_45', name: 'Da Hắc Long', reqLv: 45, type: 'pelt', color: '#37474f', exp: 720 },
  pelt_50: { id: 'pelt_50', name: 'Da Thái Cổ Cự Thú', reqLv: 50, type: 'pelt', color: '#fbc02d', exp: 1000 }
};

// --- SANDSHIP FACTORY PROCESSED MATERIALS ---
export const FACTORY_PRODUCTS = {
  // Thỏi kim loại (Smelted Ingots)
  ingot_copper: { id: 'ingot_copper', name: 'Thỏi Đồng', tier: 1, color: '#b87333', from: 'ore_5', ratio: 2 },
  ingot_iron: { id: 'ingot_iron', name: 'Thỏi Sắt', tier: 2, color: '#b0bec5', from: 'ore_12', ratio: 2 },
  ingot_silver: { id: 'ingot_silver', name: 'Thỏi Bạc', tier: 3, color: '#e0e0e0', from: 'ore_18', ratio: 2 },
  ingot_gold: { id: 'ingot_gold', name: 'Thỏi Vàng', tier: 4, color: '#ffd700', from: 'ore_22', ratio: 3 },
  ingot_titan: { id: 'ingot_titan', name: 'Thỏi Titan', tier: 5, color: '#78909c', from: 'ore_40', ratio: 3 },
  ingot_mythril: { id: 'ingot_mythril', name: 'Thỏi Thái Cổ (Mythril)', tier: 6, color: '#e040fb', from: 'ore_50', ratio: 3 },

  // Tấm kim loại ép (Pressed Plates)
  plate_iron: { id: 'plate_iron', name: 'Tấm Thép Sắt', tier: 2, color: '#90a4ae', fromIngot: 'ingot_iron', ratio: 1 },
  plate_silver: { id: 'plate_silver', name: 'Tấm Bạc Kiên Cố', tier: 3, color: '#eceff1', fromIngot: 'ingot_silver', ratio: 1 },
  plate_gold: { id: 'plate_gold', name: 'Tấm Vàng Tinh Chế', tier: 4, color: '#ffe57f', fromIngot: 'ingot_gold', ratio: 1 },
  plate_titan: { id: 'plate_titan', name: 'Tấm Titan Giáp Hộ', tier: 5, color: '#607d8b', fromIngot: 'ingot_titan', ratio: 1 },
  plate_mythril: { id: 'plate_mythril', name: 'Tấm Thép Thái Cổ', tier: 6, color: '#ea80fc', fromIngot: 'ingot_mythril', ratio: 1 },

  // Ống kim loại / ống thép (Extruded Pipes & Tubes)
  pipe_copper: { id: 'pipe_copper', name: 'Ống Đồng Cơ Khí', tier: 1, color: '#d7ccc8', fromIngot: 'ingot_copper', ratio: 1 },
  pipe_steel: { id: 'pipe_steel', name: 'Ống Thép Chịu Áp', tier: 2, color: '#78909c', fromIngot: 'ingot_iron', ratio: 1 },
  pipe_titan: { id: 'pipe_titan', name: 'Ống Titan Khí Nén', tier: 5, color: '#455a64', fromIngot: 'ingot_titan', ratio: 1 },
  pipe_mythril: { id: 'pipe_mythril', name: 'Ống Dẫn Năng Lượng Thái Cổ', tier: 6, color: '#ba68c8', fromIngot: 'ingot_mythril', ratio: 1 },

  // Vải dệt bông (Loomed Fabric / Cloth)
  fabric_rough: { id: 'fabric_rough', name: 'Cuộn Vải Thô', tier: 1, color: '#d7ccc8', fromFlora: 'flora_1', ratio: 2 },
  fabric_fine: { id: 'fabric_fine', name: 'Cuộn Vải Bông Trắng', tier: 2, color: '#ffffff', fromFlora: 'flora_5', ratio: 2 },
  fabric_silver: { id: 'fabric_silver', name: 'Cuộn Vải Ngân Sợi', tier: 3, color: '#b0bec5', fromFlora: 'flora_18', ratio: 2 },
  fabric_mythic: { id: 'fabric_mythic', name: 'Cuộn Vải Thần Liên', tier: 6, color: '#ea80fc', fromFlora: 'flora_50', ratio: 2 }
};

// --- 4 GATHERING TOOLS (LV 1 - 50) ---
export const TOOLS = {
  // 1. RÌU (AXE)
  axe_1: { id: 'axe_1', name: 'Rìu Đá Sơ Khai', type: 'axe', reqLv: 1, power: 25, speed: 1.0, cost: { wood_1: 5, ore_1: 8 } },
  axe_5: { id: 'axe_5', name: 'Rìu Đồng Rèn', type: 'axe', reqLv: 5, power: 45, speed: 1.2, cost: { wood_5: 10, ingot_copper: 5 } },
  axe_12: { id: 'axe_12', name: 'Rìu Sắt Tinh Luyện', type: 'axe', reqLv: 12, power: 75, speed: 1.4, cost: { wood_12: 15, plate_iron: 4 } },
  axe_18: { id: 'axe_18', name: 'Rìu Bạc Sắc Bén', type: 'axe', reqLv: 18, power: 120, speed: 1.7, cost: { wood_18: 20, plate_silver: 5 } },
  axe_22: { id: 'axe_22', name: 'Rìu Vàng Hoàng Gia', type: 'axe', reqLv: 22, power: 180, speed: 2.0, cost: { wood_22: 25, plate_gold: 6 } },
  axe_28: { id: 'axe_28', name: 'Rìu Bạch Kim Cổ', type: 'axe', reqLv: 28, power: 260, speed: 2.3, cost: { wood_28: 30, plate_gold: 8 } },
  axe_34: { id: 'axe_34', name: 'Rìu Kim Cương', type: 'axe', reqLv: 34, power: 360, speed: 2.7, cost: { wood_34: 35, ore_34: 12 } },
  axe_40: { id: 'axe_40', name: 'Rìu Titan Chiến Thần', type: 'axe', reqLv: 40, power: 500, speed: 3.2, cost: { wood_40: 40, plate_titan: 8 } },
  axe_45: { id: 'axe_45', name: 'Rìu Obsidian Diệt Thế', type: 'axe', reqLv: 45, power: 700, speed: 3.8, cost: { wood_45: 45, ore_45: 20 } },
  axe_50: { id: 'axe_50', name: 'Thần Rìu Thái Cổ', type: 'axe', reqLv: 50, power: 1000, speed: 4.5, cost: { wood_50: 50, plate_mythril: 10 } },

  // 2. CUỐC (PICKAXE)
  pickaxe_1: { id: 'pickaxe_1', name: 'Cuốc Đá Thô', type: 'pickaxe', reqLv: 1, power: 25, speed: 1.0, cost: { wood_1: 8, ore_1: 8 } },
  pickaxe_5: { id: 'pickaxe_5', name: 'Cuốc Đồng Đúc', type: 'pickaxe', reqLv: 5, power: 50, speed: 1.2, cost: { wood_5: 10, ingot_copper: 6 } },
  pickaxe_12: { id: 'pickaxe_12', name: 'Cuốc Sắt Thợ Rèn', type: 'pickaxe', reqLv: 12, power: 85, speed: 1.4, cost: { wood_12: 15, pipe_steel: 4 } },
  pickaxe_18: { id: 'pickaxe_18', name: 'Cuốc Bạc Thợ Mỏ', type: 'pickaxe', reqLv: 18, power: 135, speed: 1.7, cost: { wood_18: 20, plate_silver: 6 } },
  pickaxe_22: { id: 'pickaxe_22', name: 'Cuốc Vàng Tài Lộc', type: 'pickaxe', reqLv: 22, power: 200, speed: 2.0, cost: { wood_22: 25, plate_gold: 6 } },
  pickaxe_28: { id: 'pickaxe_28', name: 'Cuốc Bạch Kim', type: 'pickaxe', reqLv: 28, power: 290, speed: 2.3, cost: { wood_28: 30, plate_gold: 8 } },
  pickaxe_34: { id: 'pickaxe_34', name: 'Cuốc Kim Cương Sắc', type: 'pickaxe', reqLv: 34, power: 400, speed: 2.8, cost: { wood_34: 35, ore_34: 15 } },
  pickaxe_40: { id: 'pickaxe_40', name: 'Cuốc Titan Phá Núi', type: 'pickaxe', reqLv: 40, power: 550, speed: 3.3, cost: { wood_40: 40, pipe_titan: 8 } },
  pickaxe_45: { id: 'pickaxe_45', name: 'Cuốc Obsidian Nham Thạch', type: 'pickaxe', reqLv: 45, power: 750, speed: 4.0, cost: { wood_45: 45, ore_45: 25 } },
  pickaxe_50: { id: 'pickaxe_50', name: 'Thần Cuốc Thái Cổ', type: 'pickaxe', reqLv: 50, power: 1200, speed: 5.0, cost: { wood_50: 50, pipe_mythril: 10 } },

  // 3. DAO LỘT DA (SKINNING KNIFE)
  knife_1: { id: 'knife_1', name: 'Dao Đá Nhỏ', type: 'knife', reqLv: 1, power: 20, cost: { wood_1: 4, ore_1: 4 } },
  knife_5: { id: 'knife_5', name: 'Dao Đồng Lột Da', type: 'knife', reqLv: 5, power: 40, cost: { wood_5: 8, ingot_copper: 4 } },
  knife_12: { id: 'knife_12', name: 'Dao Sắt Săn Thú', type: 'knife', reqLv: 12, power: 70, cost: { wood_12: 12, plate_iron: 3 } },
  knife_18: { id: 'knife_18', name: 'Dao Bạc Tinh Xảo', type: 'knife', reqLv: 18, power: 110, cost: { wood_18: 15, plate_silver: 4 } },
  knife_22: { id: 'knife_22', name: 'Dao Vàng Thợ Săn', type: 'knife', reqLv: 22, power: 160, cost: { wood_22: 20, plate_gold: 5 } },
  knife_28: { id: 'knife_28', name: 'Dao Bạch Kim Sắc', type: 'knife', reqLv: 28, power: 230, cost: { wood_28: 25, plate_gold: 6 } },
  knife_34: { id: 'knife_34', name: 'Dao Kim Cương', type: 'knife', reqLv: 34, power: 320, cost: { wood_34: 30, ore_34: 10 } },
  knife_40: { id: 'knife_40', name: 'Dao Titan Sát Thủ', type: 'knife', reqLv: 40, power: 450, cost: { wood_40: 35, plate_titan: 6 } },
  knife_45: { id: 'knife_45', name: 'Dao Obsidian Hắc Ám', type: 'knife', reqLv: 45, power: 620, cost: { wood_45: 40, ore_45: 16 } },
  knife_50: { id: 'knife_50', name: 'Thần Dao Thái Cổ', type: 'knife', reqLv: 50, power: 900, cost: { wood_50: 50, plate_mythril: 8 } },

  // 4. LIỀM HÁI (SICKLE)
  sickle_1: { id: 'sickle_1', name: 'Liềm Gỗ Thô', type: 'sickle', reqLv: 1, power: 20, cost: { wood_1: 6, ore_1: 2 } },
  sickle_5: { id: 'sickle_5', name: 'Liềm Đồng Nông Dân', type: 'sickle', reqLv: 5, power: 40, cost: { wood_5: 8, ingot_copper: 4 } },
  sickle_12: { id: 'sickle_12', name: 'Liềm Sắt Thu Hoạch', type: 'sickle', reqLv: 12, power: 70, cost: { wood_12: 12, pipe_steel: 3 } },
  sickle_18: { id: 'sickle_18', name: 'Liềm Bạc Dược Thảo', type: 'sickle', reqLv: 18, power: 110, cost: { wood_18: 15, plate_silver: 4 } },
  sickle_22: { id: 'sickle_22', name: 'Liềm Vàng Dược Sư', type: 'sickle', reqLv: 22, power: 160, cost: { wood_22: 20, plate_gold: 5 } },
  sickle_28: { id: 'sickle_28', name: 'Liềm Bạch Kim Tinh', type: 'sickle', reqLv: 28, power: 230, cost: { wood_28: 25, plate_gold: 6 } },
  sickle_34: { id: 'sickle_34', name: 'Liềm Kim Cương', type: 'sickle', reqLv: 34, power: 320, cost: { wood_34: 30, ore_34: 10 } },
  sickle_40: { id: 'sickle_40', name: 'Liềm Titan Sinh Mệnh', type: 'sickle', reqLv: 40, power: 450, cost: { wood_40: 35, pipe_titan: 6 } },
  sickle_45: { id: 'sickle_45', name: 'Liềm Obsidian Hút Hồn', type: 'sickle', reqLv: 45, power: 620, cost: { wood_45: 40, ore_45: 16 } },
  sickle_50: { id: 'sickle_50', name: 'Thần Liềm Thái Cổ', type: 'sickle', reqLv: 50, power: 900, cost: { wood_50: 50, pipe_mythril: 8 } }
};

// --- 5 CHARACTER EQUIPMENT SLOTS (WEAPON, HELMET, ARMOR, PANTS, BOOTS) ---
export const EQUIPMENT_RECIPES = [
  // 1. VŨ KHÍ (WEAPONS)
  {
    id: 'wpn_iron_sword',
    name: 'Kiếm Thép Sắt Sắc Lẹm',
    slot: 'weapon',
    tier: 1,
    desc: 'Lưỡi kiếm rèn từ thép tấm và ống dẫn cán phẳng.',
    stats: { atk: 35, crit: 0.08 },
    cost: { plate_iron: 4, pipe_steel: 2, wood_12: 10 }
  },
  {
    id: 'wpn_gold_scimitar',
    name: 'Hoàng Kim Đại Đao',
    slot: 'weapon',
    tier: 2,
    desc: 'Vũ khí vàng ròng rèn công phu.',
    stats: { atk: 85, crit: 0.15 },
    cost: { plate_gold: 6, pipe_steel: 4, pelt_22: 4 }
  },
  {
    id: 'wpn_titan_blade',
    name: 'Titan Chiến Kiếm Cổ',
    slot: 'weapon',
    tier: 3,
    desc: 'Cực nặng và đanh thép, chém đứt mọi loại giáp.',
    stats: { atk: 190, crit: 0.22 },
    cost: { plate_titan: 8, pipe_titan: 5, pelt_40: 6 }
  },
  {
    id: 'wpn_mythril_saber',
    name: 'Thánh Kiếm Thái Cổ (Mythril)',
    slot: 'weapon',
    tier: 4,
    desc: 'Thánh kiếm tối thượng phóng sóng hào quang quét sạch quái vật.',
    stats: { atk: 450, crit: 0.35, beamWave: true },
    cost: { plate_mythril: 10, pipe_mythril: 8, pelt_50: 5 }
  },

  // 2. NÓN (HELMET)
  {
    id: 'helm_leather',
    name: 'Mũ Da Săn Rừng',
    slot: 'helmet',
    tier: 1,
    desc: 'Nón may từ da thỏ và da sói lót bông ấm.',
    stats: { def: 12, hp: 60 },
    cost: { pelt_5: 4, fabric_rough: 3 }
  },
  {
    id: 'helm_iron',
    name: 'Nón Sắt Hiệp Sĩ',
    slot: 'helmet',
    tier: 2,
    desc: 'Mũ sắt có kính che mặt bảo hộ đầu.',
    stats: { def: 35, hp: 160 },
    cost: { plate_iron: 5, fabric_fine: 4 }
  },
  {
    id: 'helm_titan',
    name: 'Chiến Mão Titan',
    slot: 'helmet',
    tier: 3,
    desc: 'Vương miện chiến binh đúc bằng hợp kim Titan siêu nhẹ.',
    stats: { def: 95, hp: 450 },
    cost: { plate_titan: 6, pipe_titan: 4, fabric_silver: 5 }
  },
  {
    id: 'helm_mythril',
    name: 'Thái Cổ Thần Mão',
    slot: 'helmet',
    tier: 4,
    desc: 'Mũ thần thoại hào quang chói lòa tăng cường trí tuệ và HP.',
    stats: { def: 220, hp: 1200 },
    cost: { plate_mythril: 8, fabric_mythic: 6 }
  },

  // 3. ÁO GIÁP (CHEST ARMOR)
  {
    id: 'arm_leather',
    name: 'Áo Giáp Da Báo',
    slot: 'armor',
    tier: 1,
    desc: 'Giáp nhẹ từ da thú săn giúp di chuyển nhanh nhẹn.',
    stats: { def: 20, hp: 100, spd: 0.05 },
    cost: { pelt_18: 5, fabric_fine: 4 }
  },
  {
    id: 'arm_iron_plate',
    name: 'Trọng Giáp Thép Tấm',
    slot: 'armor',
    tier: 2,
    desc: 'Tấm thép nung ép vững chắc chống tên và đao búa.',
    stats: { def: 60, hp: 280 },
    cost: { plate_iron: 8, pipe_steel: 4, fabric_fine: 6 }
  },
  {
    id: 'arm_gold_radiant',
    name: 'Hoàng Kim Thánh Giáp',
    slot: 'armor',
    tier: 3,
    desc: 'Giáp vàng tự hồi 5 HP mỗi giây.',
    stats: { def: 140, hp: 650, hpRegen: 5 },
    cost: { plate_gold: 10, plate_silver: 6, pelt_28: 8 }
  },
  {
    id: 'arm_mythril_titan',
    name: 'Thần Long Chiến Giáp Thái Cổ',
    slot: 'armor',
    tier: 4,
    desc: 'Chiến giáp tối thượng của Vua Khai Mỏ, giảm 25% mọi sát thương nhận vào.',
    stats: { def: 380, hp: 2200, damageReduction: 0.25 },
    cost: { plate_mythril: 12, pipe_mythril: 8, fabric_mythic: 8, pelt_50: 8 }
  },

  // 4. QUẦN (PANTS)
  {
    id: 'pants_leather',
    name: 'Quần Da Dã Chiến',
    slot: 'pants',
    tier: 1,
    desc: 'Quần da thú co giãn bền chắc.',
    stats: { def: 10, hp: 50 },
    cost: { pelt_12: 5, fabric_rough: 4 }
  },
  {
    id: 'pants_iron',
    name: 'Thiết Khố Bọc Thép',
    slot: 'pants',
    tier: 2,
    desc: 'Bảo vệ đùi và đầu gối khỏi va chạm.',
    stats: { def: 30, hp: 150 },
    cost: { plate_iron: 4, pipe_steel: 3, fabric_fine: 4 }
  },
  {
    id: 'pants_titan',
    name: 'Quần Chiến Binh Titan',
    slot: 'pants',
    tier: 3,
    desc: 'Quần kim loại siêu bền của quân đoàn cổ.',
    stats: { def: 85, hp: 400 },
    cost: { plate_titan: 6, pipe_titan: 4, fabric_silver: 5 }
  },
  {
    id: 'pants_mythril',
    name: 'Thái Cổ Thần Khố',
    slot: 'pants',
    tier: 4,
    desc: 'Quần chiến thần phủ lớp tinh thể Thái Cổ bất hoại.',
    stats: { def: 190, hp: 1000 },
    cost: { plate_mythril: 8, fabric_mythic: 6 }
  },

  // 5. GIÀY (BOOTS)
  {
    id: 'boots_leather',
    name: 'Giày Da Sói Săn',
    slot: 'boots',
    tier: 1,
    desc: 'Tăng tốc độ di chuyển trên địa hình gồ ghề.',
    stats: { def: 8, hp: 40, spd: 0.1 },
    cost: { pelt_5: 4, fabric_rough: 2 }
  },
  {
    id: 'boots_iron',
    name: 'Chiến Ngoa Sắt Hiệp Sĩ',
    slot: 'boots',
    tier: 2,
    desc: 'Giày bọc thép nặng chắc, tăng phòng thủ.',
    stats: { def: 25, hp: 120, spd: 0.05 },
    cost: { plate_iron: 4, fabric_fine: 3 }
  },
  {
    id: 'boots_silver_wind',
    name: 'Phong Hành Giày Bạc',
    slot: 'boots',
    tier: 3,
    desc: 'Tăng vọt 20% tốc độ chạy như cơn gió.',
    stats: { def: 65, hp: 300, spd: 0.2 },
    cost: { plate_silver: 6, pipe_copper: 5, fabric_silver: 4 }
  },
  {
    id: 'boots_mythril',
    name: 'Thần Hành Hài Thái Cổ',
    slot: 'boots',
    tier: 4,
    desc: 'Bước đi không dấu vết, tăng 35% tốc độ và tăng HP cực đại.',
    stats: { def: 150, hp: 800, spd: 0.35 },
    cost: { plate_mythril: 6, fabric_mythic: 6, pelt_50: 4 }
  }
];

// --- 10 MINING SKILLS (LV 10 - 100) ---
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

export const MONSTER_TYPES = {
  rabbit: {
    name: 'Thỏ Rừng',
    color: '#d7ccc8',
    radius: 12,
    hp: 30,
    atk: 4,
    speed: 1.4,
    exp: 15,
    peltId: 'pelt_1'
  },
  wolf: {
    name: 'Sói Hoang Xám',
    color: '#78909c',
    radius: 15,
    hp: 80,
    atk: 14,
    speed: 1.6,
    exp: 40,
    peltId: 'pelt_5'
  },
  boar: {
    name: 'Lợn Rừng Bọc Nham',
    color: '#5d4037',
    radius: 18,
    hp: 180,
    atk: 25,
    speed: 1.1,
    exp: 80,
    peltId: 'pelt_12'
  },
  leopard: {
    name: 'Báo Bạc Tuyết Sơn',
    color: '#cfd8dc',
    radius: 17,
    hp: 320,
    atk: 45,
    speed: 2.0,
    exp: 150,
    peltId: 'pelt_18'
  },
  bear: {
    name: 'Hoàng Kim Hùng Thú',
    color: '#ffd54f',
    radius: 24,
    hp: 550,
    atk: 70,
    speed: 0.9,
    exp: 280,
    peltId: 'pelt_22'
  },
  boss_titan: {
    name: 'Chúa Tể Mỏ Quặng TITAN (Cổ Đại)',
    color: '#d50000',
    radius: 38,
    hp: 3500,
    atk: 95,
    speed: 1.0,
    exp: 2000,
    isBoss: true,
    peltId: 'pelt_50'
  }
};
