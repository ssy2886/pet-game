# 渐进式宠物 PNG 渲染设计

## 目标

让已存在的 dragon、beast、spirit 身体 PNG 立即参与渲染；元素 PNG 尚未制作完成时，继续使用现有 SVG 元素特效，而不是回退整只宠物到 SVG。

## 资源兼容

- dragon 继续读取英文阶段文件：`baby`、`adult`、`perfect`、`ultimate`、`superUltimate`。
- beast 与 spirit 兼容用户当前的中文文件：`幼年`、`成年`、`完全`、`究极`、`终极`。
- 后续若 beast/spirit 改为英文阶段文件，英文文件优先，不需要修改组件。

## 渲染规则

1. 身体图加载成功时，显示身体 PNG。
2. 对应元素图也成功时，在身体 PNG 下方显示元素 PNG。
3. 身体图成功、元素图缺失时，显示身体 PNG，并使用当前 SVG `ElementEffects` 作为元素效果。
4. 身体图缺失时，保留现有完整 SVG 降级渲染。

## 边界与验收

- dragon 火系五阶段仍显示现有完整 PNG 合成。
- beast/spirit 的五个中文文件名可被请求和显示。
- 缺失任何元素 PNG 不会阻止对应身体 PNG 显示。
- 不重命名或移动用户已生成的图片。
