import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mix, setProperty } from '../index';

describe('mix', () => {
	it('应该正确混合两种颜色（默认权重 0.5）', () => {
		// 纯红和纯蓝混合，权重 0.5，应该得到紫色
		const result = mix('#ff0000', '#0000ff');
		expect(result).toBe('#800080');
	});

	it('应该支持自定义权重', () => {
		// 纯红和纯蓝混合，权重 0.25，结果应该更偏向红色
		const result = mix('#ff0000', '#0000ff', 0.25);
		expect(result).toBe('#bf0040');
	});

	it('权重为 0 时应该完全返回第一种颜色', () => {
		const result = mix('#ff0000', '#0000ff', 0);
		expect(result).toBe('#ff0000');
	});

	it('权重为 1 时应该完全返回第二种颜色', () => {
		const result = mix('#ff0000', '#0000ff', 1);
		expect(result).toBe('#0000ff');
	});

	it('应该处理边界权重（小于 0 应该按 0 处理）', () => {
		const result = mix('#ff0000', '#0000ff', -0.5);
		expect(result).toBe('#ff0000');
	});

	it('应该处理边界权重（大于 1 应该按 1 处理）', () => {
		const result = mix('#ff0000', '#0000ff', 1.5);
		expect(result).toBe('#0000ff');
	});

	it('应该处理相同颜色的混合', () => {
		const result = mix('#ffffff', '#ffffff', 0.5);
		expect(result).toBe('#ffffff');
	});

	it('应该处理黑白混合', () => {
		const result = mix('#000000', '#ffffff', 0.5);
		expect(result).toBe('#808080');
	});

	it('应该正确混合绿色和黄色', () => {
		const result = mix('#00ff00', '#ffff00', 0.5);
		expect(result).toBe('#80ff00');
	});
});

describe('setProperty', () => {
	let mockSetProperty: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockSetProperty = vi.fn();
		// Mock document.documentElement
		Object.defineProperty(document, 'documentElement', {
			value: {
				style: {
					setProperty: mockSetProperty,
				},
			},
			configurable: true,
		});
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('应该调用 DOM 的 style.setProperty 方法', () => {
		setProperty('--primary-color', '#1890ff');
		expect(mockSetProperty).toHaveBeenCalledTimes(1);
		expect(mockSetProperty).toHaveBeenCalledWith('--primary-color', '#1890ff');
	});

	it('应该支持自定义 DOM 元素', () => {
		const customMockSetProperty = vi.fn();
		const customDom = {
			style: {
				setProperty: customMockSetProperty,
			},
		} as unknown as HTMLElement;

		setProperty('--theme-color', '#ff4d4f', customDom);
		expect(customMockSetProperty).toHaveBeenCalledTimes(1);
		expect(customMockSetProperty).toHaveBeenCalledWith('--theme-color', '#ff4d4f');
	});

	it('应该支持多个 CSS 变量设置', () => {
		setProperty('--color-primary', '#1890ff');
		setProperty('--color-success', '#52c41a');
		setProperty('--color-warning', '#faad14');

		expect(mockSetProperty).toHaveBeenCalledTimes(3);
		expect(mockSetProperty).toHaveBeenNthCalledWith(1, '--color-primary', '#1890ff');
		expect(mockSetProperty).toHaveBeenNthCalledWith(2, '--color-success', '#52c41a');
		expect(mockSetProperty).toHaveBeenNthCalledWith(3, '--color-warning', '#faad14');
	});
});
