import type { ExpeditionMap, MapNode, MapTheme } from './types';
import { v4 as uuid } from 'uuid';

const THEME_LABELS: Record<MapTheme, string> = {
  volcano: '🔥 烈焰火山',
  forest: '🌲 幽暗森林',
  cave: '🕳️ 水晶洞穴',
  ocean: '🌊 深海秘境',
  ruins: '🏛️ 远古遗迹',
};

export function getThemeLabel(theme: MapTheme): string {
  return THEME_LABELS[theme];
}

export function getRandomTheme(): MapTheme {
  const themes: MapTheme[] = ['volcano', 'forest', 'cave', 'ocean', 'ruins'];
  return themes[Math.floor(Math.random() * themes.length)];
}

/** 生成一张随机探险地图 */
export function generateMap(theme?: MapTheme): ExpeditionMap {
  const t = theme || getRandomTheme();
  const nodeCount = 10 + Math.floor(Math.random() * 6); // 10-15 个节点

  // 生成节点链（线性 + 分支）
  const nodes: MapNode[] = [];
  for (let i = 0; i < nodeCount; i++) {
    const isLast = i === nodeCount - 1;
    const type = isLast ? 'boss'
      : Math.random() < 0.6 ? 'battle'
      : Math.random() < 0.75 ? 'chest'
      : 'heal';

    nodes.push({
      id: `node_${i}`,
      type,
      completed: false,
      connections: [],
    });
  }

  // 连接节点（默认线性 + 偶尔分支）
  for (let i = 0; i < nodes.length; i++) {
    if (i < nodes.length - 1) {
      nodes[i].connections.push(nodes[i + 1].id);

      // 20% 概率增加一个分支节点（跳过下一个）
      if (i + 2 < nodes.length && Math.random() < 0.2) {
        nodes[i].connections.push(nodes[i + 2].id);
      }
    }
  }

  return {
    id: uuid(),
    theme: t,
    nodes,
    currentPosition: nodes[0].id,
    completed: false,
  };
}

/** 获取当前节点 */
export function getCurrentNode(map: ExpeditionMap): MapNode | undefined {
  return map.nodes.find(n => n.id === map.currentPosition);
}

/** 可到达的下一个节点 */
export function getReachableNodes(map: ExpeditionMap): MapNode[] {
  const current = getCurrentNode(map);
  if (!current) return [];
  return map.nodes.filter(n =>
    current.connections.includes(n.id) && !n.completed
  );
}

/** 移动到下一个节点 */
export function advanceNode(map: ExpeditionMap, targetNodeId: string): ExpeditionMap {
  // 标记当前节点完成
  const updatedNodes = map.nodes.map(n =>
    n.id === map.currentPosition ? { ...n, completed: true } : n
  );

  // 检查是否所有节点都完成了
  const allDone = updatedNodes.every(n => n.completed);

  return {
    ...map,
    nodes: updatedNodes,
    currentPosition: targetNodeId,
    completed: allDone,
  };
}
