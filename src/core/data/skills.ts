import type { Skill } from '../types';

export const ALL_SKILLS: Record<string, Skill> = {
  // === 通用 ===
  tackle: { id: 'tackle', name: '撞击', element: 'earth', power: 40, accuracy: 100, description: '用身体撞向对手。', pp: 35 },
  scratch: { id: 'scratch', name: '抓击', element: 'fire', power: 40, accuracy: 100, description: '用利爪撕扯对手。', pp: 35 },
  gust: { id: 'gust', name: '烈风', element: 'wind', power: 40, accuracy: 100, description: '掀起一阵狂风攻击对手。', pp: 35 },
  water_gun: { id: 'water_gun', name: '水枪', element: 'water', power: 40, accuracy: 100, description: '喷射强力水流攻击对手。', pp: 25 },
  light_beam: { id: 'light_beam', name: '光束', element: 'light', power: 40, accuracy: 100, description: '发射一道纯能量光束。', pp: 25 },
  headbutt: { id: 'headbutt', name: '头槌', element: 'earth', power: 60, accuracy: 100, description: '用头部猛撞对手。', pp: 25 },
  tail_slap: { id: 'tail_slap', name: '尾击', element: 'wind', power: 45, accuracy: 100, description: '用尾巴抽打对手。', pp: 30 },
  peck: { id: 'peck', name: '啄击', element: 'wind', power: 35, accuracy: 100, description: '用尖喙啄击对手。', pp: 35 },
  claw: { id: 'claw', name: '钳击', element: 'water', power: 50, accuracy: 95, description: '用钳子夹击对手。', pp: 25 },
  tentacle: { id: 'tentacle', name: '触手鞭', element: 'water', power: 60, accuracy: 90, description: '用触手鞭打对手。', pp: 20 },
  vine_whip: { id: 'vine_whip', name: '藤鞭', element: 'earth', power: 45, accuracy: 100, description: '用藤蔓抽打对手。', pp: 25 },
  dig: { id: 'dig', name: '挖洞', element: 'earth', power: 55, accuracy: 100, description: '挖洞从地下攻击对手。', pp: 20 },
  confusion: { id: 'confusion', name: '念力', element: 'light', power: 50, accuracy: 100, description: '用念力攻击对手。', pp: 25 },

  // === 中级 ===
  ember: { id: 'ember', name: '火花', element: 'fire', power: 60, accuracy: 100, description: '喷射细小的火焰攻击对手。', pp: 25 },
  flame_slash: { id: 'flame_slash', name: '火焰斩', element: 'fire', power: 80, accuracy: 100, description: '用烈焰包裹的利刃斩击对手。', pp: 20 },
  fire_breath: { id: 'fire_breath', name: '烈焰吐息', element: 'fire', power: 100, accuracy: 90, description: '喷出灼热的火焰吞噬对手。', pp: 15 },
  inferno: { id: 'inferno', name: '炼狱之火', element: 'fire', power: 130, accuracy: 85, description: '释放来自炼狱的极致火焰。', pp: 10 },
  will_o_wisp: { id: 'will_o_wisp', name: '鬼火', element: 'fire', power: 0, accuracy: 85, description: '释放鬼火使对手灼伤。', pp: 15, effect: { type: 'dot', target: 'enemy', amount: 15, chance: 0.8, duration: 3, stat: 'hp' } },
  flame_dance: { id: 'flame_dance', name: '火焰之舞', element: 'fire', power: 70, accuracy: 100, description: '跳起火焰之舞攻击对手，同时提升特攻。', pp: 20 },
  hellfire: { id: 'hellfire', name: '地狱火', element: 'fire', power: 140, accuracy: 80, description: '召唤地狱之火焚尽一切。', pp: 8, effect: { type: 'recoil', target: 'self', amount: 30, chance: 1, duration: 0, stat: 'hp' } },
  solar_flare: { id: 'solar_flare', name: '太阳耀斑', element: 'fire', power: 150, accuracy: 85, description: '凝聚太阳之力释放毁灭性打击。', pp: 5 },
  judgment_fire: { id: 'judgment_fire', name: '烬灭审判', element: 'fire', power: 160, accuracy: 90, description: '终极火焰审判，焚尽万物。', pp: 5 },
  cataclysm: { id: 'cataclysm', name: '天崩地裂', element: 'fire', power: 170, accuracy: 80, description: '引发火山爆发级别的毁灭力量。', pp: 3 },
  rebirth: { id: 'rebirth', name: '涅槃重生', element: 'fire', power: 0, accuracy: 100, description: '从火焰中重生，回复大量生命。', pp: 5, effect: { type: 'heal', target: 'self', amount: 50, chance: 1, duration: 0, stat: 'hp' } },
  eternal_phoenix: { id: 'eternal_phoenix', name: '永恒涅槃', element: 'fire', power: 180, accuracy: 85, description: '凤凰之终极力量，毁灭与重生并存。', pp: 3 },

  // === 风系中级 ===
  wing_attack: { id: 'wing_attack', name: '翼击', element: 'wind', power: 75, accuracy: 100, description: '用翅膀猛击对手。', pp: 25 },
  thunder_feather: { id: 'thunder_feather', name: '雷羽', element: 'wind', power: 85, accuracy: 95, description: '发射带电的羽毛攻击对手。', pp: 20 },
  storm_call: { id: 'storm_call', name: '呼唤风暴', element: 'wind', power: 100, accuracy: 90, description: '召唤风暴攻击敌人。', pp: 15 },
  typhoon: { id: 'typhoon', name: '台风', element: 'wind', power: 130, accuracy: 85, description: '召唤毁灭性的台风。', pp: 10 },
  whirlwind: { id: 'whirlwind', name: '龙卷风', element: 'wind', power: 80, accuracy: 95, description: '制造龙卷风卷走对手。', pp: 20 },
  lightning_strike: { id: 'lightning_strike', name: '雷击', element: 'wind', power: 140, accuracy: 80, description: '召唤雷霆直接轰击对手。', pp: 8 },
  thunder_god: { id: 'thunder_god', name: '雷神降临', element: 'wind', power: 170, accuracy: 85, description: '召唤雷神之力降下天罚。', pp: 5 },
  tempest_judgment: { id: 'tempest_judgment', name: '风暴审判', element: 'wind', power: 165, accuracy: 90, description: '风暴之终极力量。', pp: 5 },
  celestial_wind: { id: 'celestial_wind', name: '天国之风', element: 'wind', power: 155, accuracy: 95, description: '来自天国的净化之风。', pp: 5 },
  dragon_breath: { id: 'dragon_breath', name: '龙息', element: 'wind', power: 90, accuracy: 100, description: '喷出龙之吐息。', pp: 15 },
  magic_breeze: { id: 'magic_breeze', name: '魔法微风', element: 'wind', power: 60, accuracy: 100, description: '带有魔法力量的微风。', pp: 15, effect: { type: 'debuff', target: 'enemy', amount: -10, chance: 0.3, duration: 3, stat: 'spAttack' } },
  world_eater: { id: 'world_eater', name: '吞天噬地', element: 'wind', power: 180, accuracy: 80, description: '化作飓风吞噬天地。', pp: 3 },
  genesis_wind: { id: 'genesis_wind', name: '创世之风', element: 'wind', power: 200, accuracy: 85, description: '世界诞生时的第一缕风。', pp: 2 },

  // === 大地系中级 ===
  rock_slide: { id: 'rock_slide', name: '落石', element: 'earth', power: 75, accuracy: 95, description: '召唤落石砸向对手。', pp: 20 },
  iron_defense: { id: 'iron_defense', name: '铁壁', element: 'earth', power: 0, accuracy: 100, description: '硬化身体大幅提升防御。', pp: 20, effect: { type: 'buff', target: 'self', amount: 30, chance: 1, duration: 4, stat: 'defense' } },
  earthquake: { id: 'earthquake', name: '地震', element: 'earth', power: 100, accuracy: 100, description: '引发地震攻击所有敌人。', pp: 15 },
  mountain_crash: { id: 'mountain_crash', name: '山崩', element: 'earth', power: 130, accuracy: 85, description: '召唤整座山的力量砸向对手。', pp: 10 },
  diamond_storm: { id: 'diamond_storm', name: '钻石风暴', element: 'earth', power: 120, accuracy: 90, description: '释放水晶碎片风暴攻击对手。', pp: 10 },
  crystal_shield: { id: 'crystal_shield', name: '水晶之盾', element: 'earth', power: 0, accuracy: 100, description: '用水晶护盾保护自己。', pp: 15, effect: { type: 'buff', target: 'self', amount: 50, chance: 1, duration: 3, stat: 'spDefense' } },
  nature_blessing: { id: 'nature_blessing', name: '自然祝福', element: 'earth', power: 0, accuracy: 100, description: '接受大自然的祝福回复生命。', pp: 10, effect: { type: 'heal', target: 'self', amount: 30, chance: 1, duration: 0, stat: 'hp' } },
  forest_domain: { id: 'forest_domain', name: '森罗领域', element: 'earth', power: 110, accuracy: 95, description: '展开森林领域困住对手。', pp: 10 },
  gaia_bash: { id: 'gaia_bash', name: '盖亚冲撞', element: 'earth', power: 140, accuracy: 90, description: '借大地之力发动冲撞。', pp: 8 },
  eden_guardian: { id: 'eden_guardian', name: '伊甸守护', element: 'earth', power: 0, accuracy: 100, description: '伊甸园之力全队回复。', pp: 5, effect: { type: 'heal', target: 'self', amount: 70, chance: 1, duration: 0, stat: 'hp' } },
  stellar_prism: { id: 'stellar_prism', name: '星辉棱镜', element: 'earth', power: 150, accuracy: 90, description: '折射星辉之力攻击对手。', pp: 5 },
  core_breaker: { id: 'core_breaker', name: '地核破碎', element: 'earth', power: 175, accuracy: 85, description: '引发地核碎裂的终极力量。', pp: 3 },
  continental_split: { id: 'continental_split', name: '大陆分崩', element: 'earth', power: 190, accuracy: 80, description: '分裂大陆的恐怖力量。', pp: 2 },

  // === 流水系中级 ===
  tidal_wave: { id: 'tidal_wave', name: '巨浪', element: 'water', power: 75, accuracy: 100, description: '掀起巨浪攻击对手。', pp: 20 },
  ice_beam: { id: 'ice_beam', name: '冰冻光束', element: 'water', power: 90, accuracy: 100, description: '发射冰冻光线冻结对手。', pp: 15 },
  tsunami: { id: 'tsunami', name: '海啸', element: 'water', power: 120, accuracy: 85, description: '召唤毁灭性海啸。', pp: 10 },
  frost_breath: { id: 'frost_breath', name: '冰霜吐息', element: 'water', power: 70, accuracy: 100, description: '喷出冰霜冻结敌人。', pp: 20 },
  blizzard: { id: 'blizzard', name: '暴风雪', element: 'water', power: 110, accuracy: 80, description: '召唤暴风雪吞噬一切。', pp: 10 },
  absolute_zero: { id: 'absolute_zero', name: '绝对零度', element: 'water', power: 150, accuracy: 70, description: '达到绝对零度的极致冰冻。', pp: 5 },
  abyss_grip: { id: 'abyss_grip', name: '深渊之握', element: 'water', power: 100, accuracy: 90, description: '从深渊伸出触手紧握对手。', pp: 10 },
  eternal_winter: { id: 'eternal_winter', name: '永冬领域', element: 'water', power: 140, accuracy: 85, description: '降临永恒的寒冬。', pp: 5 },
  rainbow_beam: { id: 'rainbow_beam', name: '彩虹射线', element: 'water', power: 85, accuracy: 95, description: '发射七彩的虹光射线。', pp: 15 },
  galaxy_splash: { id: 'galaxy_splash', name: '星河飞溅', element: 'water', power: 160, accuracy: 90, description: '引来星河之水洗涤一切。', pp: 5 },
  abyss_judgment: { id: 'abyss_judgment', name: '深渊审判', element: 'water', power: 170, accuracy: 85, description: '来自深渊最底层的审判。', pp: 3 },
  crushing_claw: { id: 'crushing_claw', name: '粉碎钳', element: 'water', power: 130, accuracy: 90, description: '用巨钳粉碎一切。', pp: 10 },
  elder_horror: { id: 'elder_horror', name: '远古恐惧', element: 'water', power: 185, accuracy: 80, description: '唤醒沉睡在深海中的远古恐惧。', pp: 2 },

  // === 光辉系中级 ===
  holy_breath: { id: 'holy_breath', name: '圣息', element: 'light', power: 80, accuracy: 100, description: '喷出神圣的气息。', pp: 20 },
  divine_shield: { id: 'divine_shield', name: '神圣之盾', element: 'light', power: 0, accuracy: 100, description: '用神圣能量保护自己。', pp: 15, effect: { type: 'buff', target: 'self', amount: 40, chance: 1, duration: 4, stat: 'defense' } },
  judgment: { id: 'judgment', name: '审判', element: 'light', power: 120, accuracy: 100, description: '对敌人施以神圣的审判。', pp: 10 },
  heal_wind: { id: 'heal_wind', name: '治愈之风', element: 'light', power: 0, accuracy: 100, description: '召唤治愈之风回复生命。', pp: 15, effect: { type: 'heal', target: 'self', amount: 25, chance: 1, duration: 0, stat: 'hp' } },
  starlight: { id: 'starlight', name: '星光', element: 'light', power: 65, accuracy: 100, description: '释放柔和的星光攻击。', pp: 25 },
  divine_punishment: { id: 'divine_punishment', name: '天罚', element: 'light', power: 140, accuracy: 90, description: '降下神之惩罚。', pp: 8 },
  galaxy_blessing: { id: 'galaxy_blessing', name: '银河祝福', element: 'light', power: 0, accuracy: 100, description: '接受银河的祝福全回复。', pp: 3, effect: { type: 'heal', target: 'self', amount: 100, chance: 1, duration: 0, stat: 'hp' } },
  mirage: { id: 'mirage', name: '幻境', element: 'light', power: 90, accuracy: 95, description: '制造幻境迷惑对手。', pp: 15, effect: { type: 'debuff', target: 'enemy', amount: -15, chance: 0.5, duration: 3, stat: 'accuracy' } },
  dimension_tear: { id: 'dimension_tear', name: '次元撕裂', element: 'light', power: 135, accuracy: 85, description: '撕裂次元空间攻击对手。', pp: 8 },
  reality_breaker: { id: 'reality_breaker', name: '现实崩坏', element: 'light', power: 170, accuracy: 90, description: '彻底崩坏现实结构。', pp: 4 },
  last_judgment: { id: 'last_judgment', name: '最终审判', element: 'light', power: 190, accuracy: 90, description: '对一切存在施以最终审判。', pp: 3 },
  big_bang: { id: 'big_bang', name: '宇宙大爆炸', element: 'light', power: 220, accuracy: 85, description: '模拟宇宙诞生的禁忌之力。', pp: 1 },
};

export function getSkill(id: string): Skill | undefined {
  return ALL_SKILLS[id];
}
