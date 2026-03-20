import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mix, setProperty } from '../index';

describe('mix 函数', () => {
    it('默认 weight=0.5 时应该返回两个颜色的中间值', () => {
        const result = mix('#ff0000', '#0000ff');
        expect(result).toBe('#800080');
    });

    it('weight=1 时应该返回第一个颜色', () => {
        const result = mix('#ff0000', '#0000ff', 1);
        expect(result).toBe('#ff0000');
    });

    it('weight=0 时应该返回第二个颜色', () => {
        const result = mix('#ff0000', '#0000ff', 0);
        expect(result).toBe('#0000ff');
    });

    it('weight=0.25 时应该返回偏向第二个颜色的混合值', () => {
        const result = mix('#ffffff', '#000000', 0.25);
        expect(result).toBe('#404040');
    });

    it('weight=0.75 时应该返回偏向第一个颜色的混合值', () => {
        const result = mix('#ffffff', '#000000', 0.75);
        expect(result).toBe('#bfbfbf');
    });

    it('应该正确处理相同颜色', () => {
        const result = mix('#aabbcc', '#aabbcc', 0.5);
        expect(result).toBe('#aabbcc');
    });

    it('应该正确处理边界 weight 值', () => {
        const result1 = mix('#123456', '#654321', 0.001);
        expect(result1).toMatch(/^#[0-9a-f]{6}$/);

        const result2 = mix('#123456', '#654321', 0.999);
        expect(result2).toMatch(/^#[0-9a-f]{6}$/);
    });
});

describe('setProperty 函数', () => {
    let mockSetProperty: ReturnType<typeof vi.fn>;

    beforeEach(() => {
        mockSetProperty = vi.fn();
    });

    it('应该调用 document.documentElement.style.setProperty', () => {
        const originalSetProperty = document.documentElement.style.setProperty;
        document.documentElement.style.setProperty = mockSetProperty;

        setProperty('--primary-color', '#409eff');

        expect(mockSetProperty).toHaveBeenCalledWith('--primary-color', '#409eff');

        document.documentElement.style.setProperty = originalSetProperty;
    });

    it('应该调用指定 DOM 元素的 style.setProperty', () => {
        const mockElement = {
            style: {
                setProperty: mockSetProperty
            }
        } as unknown as HTMLElement;

        setProperty('--test-var', 'test-value', mockElement);

        expect(mockSetProperty).toHaveBeenCalledWith('--test-var', 'test-value');
    });

    it('应该支持各种类型的值', () => {
        const mockElement = {
            style: {
                setProperty: mockSetProperty
            }
        } as unknown as HTMLElement;

        setProperty('--number-value', 123, mockElement);
        expect(mockSetProperty).toHaveBeenCalledWith('--number-value', 123);

        setProperty('--string-value', 'hello', mockElement);
        expect(mockSetProperty).toHaveBeenCalledWith('--string-value', 'hello');

        setProperty('--boolean-value', true, mockElement);
        expect(mockSetProperty).toHaveBeenCalledWith('--boolean-value', true);
    });
});
