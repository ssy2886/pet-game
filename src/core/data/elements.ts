import type { ElementType } from '../types';

/** 属性克制表 1.0 = 普通 2.0 = 克制 0.5 = 被克 0 = 无效 */
export const EFFECTIVENESS: Record<ElementType, Record<ElementType, number>> = {
  fire:   { fire: 1, wind: 0.5, earth: 0.5, water: 2, light: 1.2 },
  wind:   { fire: 2, wind: 1, earth: 0.5, water: 0.5, light: 1.2 },
  earth:  { fire: 0.5, wind: 2, earth: 1, water: 0.5, light: 1.2 },
  water:  { fire: 0.5, wind: 0.5, earth: 2, water: 1, light: 1.2 },
  light:  { fire: 1.2, wind: 1.2, earth: 1.2, water: 1.2, light: 1 },
};

/** 字符串表示的克制倍率 */
export function getEffectivenessString(atk: ElementType, def: ElementType): string {
  const v = EFFECTIVENESS[atk][def];
  if (v >= 2) return '💥 效果拔群';
  if (v <= 0.5) return '🔽 效果不佳';
  if (v === 0) return '🚫 无效';
  return '⚖️ 效果普通';
}

/** 伤害倍率 */
export function getEffectiveness(atk: ElementType, def: ElementType): number {
  return EFFECTIVENESS[atk][def];
}
