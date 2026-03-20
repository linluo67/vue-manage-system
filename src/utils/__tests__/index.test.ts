import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mix, setProperty } from '../index';

describe('mix', () => {
	it('should mix two colors with default weight (0.5)', () => {
		const result = mix('#FF0000', '#0000FF');
		expect(result).toBe('#800080');
	});

	it('should mix two colors with custom weight (0.25)', () => {
		const result = mix('#FF0000', '#0000FF', 0.25);
		expect(result).toBe('#4000bf');
	});

	it('should mix two colors with weight 0 (fully color2)', () => {
		const result = mix('#FF0000', '#0000FF', 0);
		expect(result).toBe('#0000ff');
	});

	it('should mix two colors with weight 1 (fully color1)', () => {
		const result = mix('#FF0000', '#0000FF', 1);
		expect(result).toBe('#ff0000');
	});

	it('should handle black and white mixing', () => {
		const result = mix('#000000', '#FFFFFF', 0.5);
		expect(result).toBe('#808080');
	});

	it('should handle same color mixing', () => {
		const result = mix('#FF5733', '#FF5733', 0.5);
		expect(result).toBe('#ff5733');
	});

	it('should handle boundary weight values', () => {
		expect(mix('#FF0000', '#00FF00', 0)).toBe('#00ff00');
		expect(mix('#FF0000', '#00FF00', 1)).toBe('#ff0000');
	});

	it('should correctly pad hex values with leading zeros', () => {
		const result = mix('#010101', '#000000', 0.5);
		expect(result).toBe('#010101');
	});
});

describe('setProperty', () => {
	let mockSetProperty: ReturnType<typeof vi.fn>;

	beforeEach(() => {
		mockSetProperty = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should call style.setProperty on document.documentElement by default', () => {
		const mockDom = {
			style: {
				setProperty: mockSetProperty,
			},
		} as unknown as HTMLElement;

		setProperty('--primary-color', '#FF0000', mockDom);

		expect(mockSetProperty).toHaveBeenCalledTimes(1);
		expect(mockSetProperty).toHaveBeenCalledWith('--primary-color', '#FF0000');
	});

	it('should call style.setProperty with correct arguments', () => {
		const mockDom = {
			style: {
				setProperty: mockSetProperty,
			},
		} as unknown as HTMLElement;

		setProperty('--test-var', 'test-value', mockDom);

		expect(mockSetProperty).toHaveBeenCalledWith('--test-var', 'test-value');
	});

	it('should handle numeric values', () => {
		const mockDom = {
			style: {
				setProperty: mockSetProperty,
			},
		} as unknown as HTMLElement;

		setProperty('--spacing', 16, mockDom);

		expect(mockSetProperty).toHaveBeenCalledWith('--spacing', 16);
	});

	it('should handle custom DOM element', () => {
		const mockDom = {
			style: {
				setProperty: mockSetProperty,
			},
		} as unknown as HTMLElement;

		setProperty('--custom', 'value', mockDom);

		expect(mockSetProperty).toHaveBeenCalledWith('--custom', 'value');
	});
});
