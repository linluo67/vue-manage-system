/**
 * 颜色混合函数
 * @param color1 第一个颜色 (hex格式)
 * @param color2 第二个颜色 (hex格式)
 * @param weight 混合权重 (0-1)，默认 0.5
 * @returns 混合后的颜色 (hex格式)
 */
export const mix = (color1: string, color2: string, weight: number = 0.5): string => {
	// 确保 weight 在 0-1 之间
	weight = Math.max(0, Math.min(1, weight));

	// 移除 # 前缀
	const hex1 = color1.replace('#', '');
	const hex2 = color2.replace('#', '');

	// 解析 RGB
	const r1 = parseInt(hex1.substring(0, 2), 16);
	const g1 = parseInt(hex1.substring(2, 4), 16);
	const b1 = parseInt(hex1.substring(4, 6), 16);

	const r2 = parseInt(hex2.substring(0, 2), 16);
	const g2 = parseInt(hex2.substring(2, 4), 16);
	const b2 = parseInt(hex2.substring(4, 6), 16);

	// 混合计算
	const r = Math.round(r1 * (1 - weight) + r2 * weight);
	const g = Math.round(g1 * (1 - weight) + g2 * weight);
	const b = Math.round(b1 * (1 - weight) + b2 * weight);

	// 转回 hex
	const toHex = (n: number): string => n.toString(16).padStart(2, '0');

	return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * 设置 CSS 自定义属性
 * @param key 属性名
 * @param value 属性值
 * @param dom 目标 DOM 元素，默认 document.documentElement
 */
export const setProperty = (
	key: string,
	value: string,
	dom: HTMLElement = document.documentElement
): void => {
	dom.style.setProperty(key, value);
};
