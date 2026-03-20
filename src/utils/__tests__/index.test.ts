import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setProperty, mix } from '../index';

describe('utils/index.ts', () => {
  describe('mix function', () => {
    it('should mix two colors with default weight (0.5)', () => {
      const color1 = '#ffffff';
      const color2 = '#000000';
      const result = mix(color1, color2);
      expect(result).toBe('#808080');
    });

    it('should mix two colors with custom weight', () => {
      const color1 = '#ffffff';
      const color2 = '#000000';
      const result = mix(color1, color2, 0.25);
      expect(result).toBe('#404040');
    });

    it('should mix two colors with weight 0 (should return color2)', () => {
      const color1 = '#ffffff';
      const color2 = '#000000';
      const result = mix(color1, color2, 0);
      expect(result).toBe('#000000');
    });

    it('should mix two colors with weight 1 (should return color1)', () => {
      const color1 = '#ffffff';
      const color2 = '#000000';
      const result = mix(color1, color2, 1);
      expect(result).toBe('#ffffff');
    });

    it('should mix red and blue colors', () => {
      const color1 = '#ff0000';
      const color2 = '#0000ff';
      const result = mix(color1, color2, 0.5);
      expect(result).toBe('#800080');
    });

    it('should mix colors and pad with zeros when needed', () => {
      const color1 = '#010101';
      const color2 = '#000000';
      const result = mix(color1, color2, 0.5);
      expect(result).toBe('#010101');
    });

    it('should mix green and yellow correctly', () => {
      const color1 = '#00ff00';
      const color2 = '#ffff00';
      const result = mix(color1, color2, 0.5);
      expect(result).toBe('#80ff00');
    });
  });

  describe('setProperty function', () => {
    let mockElement: HTMLElement;

    beforeEach(() => {
      mockElement = {
        style: {
          setProperty: vi.fn()
        }
      } as unknown as HTMLElement;
    });

    it('should call style.setProperty with correct arguments', () => {
      const prop = '--test-color';
      const val = '#ffffff';
      
      setProperty(prop, val, mockElement);
      
      expect(mockElement.style.setProperty).toHaveBeenCalledTimes(1);
      expect(mockElement.style.setProperty).toHaveBeenCalledWith(prop, val);
    });

    it('should use document.documentElement by default', () => {
      const originalDocumentElement = document.documentElement;
      const mockSetProperty = vi.fn();
      
      Object.defineProperty(document, 'documentElement', {
        value: {
          style: {
            setProperty: mockSetProperty
          }
        },
        writable: true
      });

      const prop = '--test-prop';
      const val = 'test-value';
      
      setProperty(prop, val);
      
      expect(mockSetProperty).toHaveBeenCalledTimes(1);
      expect(mockSetProperty).toHaveBeenCalledWith(prop, val);
      
      Object.defineProperty(document, 'documentElement', {
        value: originalDocumentElement,
        writable: true
      });
    });

    it('should handle string values', () => {
      const prop = '--font-size';
      const val = '16px';
      
      setProperty(prop, val, mockElement);
      
      expect(mockElement.style.setProperty).toHaveBeenCalledWith(prop, val);
    });

    it('should handle numeric values', () => {
      const prop = '--opacity';
      const val = 0.5;
      
      setProperty(prop, val, mockElement);
      
      expect(mockElement.style.setProperty).toHaveBeenCalledWith(prop, val);
    });
  });
});