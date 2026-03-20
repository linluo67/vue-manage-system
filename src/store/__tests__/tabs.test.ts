import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTabsStore } from '../tabs';

describe('useTabsStore', () => {
	beforeEach(() => {
		// 创建一个新的 pinia 实例用于每个测试
		setActivePinia(createPinia());
	});

	describe('初始状态', () => {
		it('应该有空的 tabs 数组', () => {
			const store = useTabsStore();
			expect(store.tabs).toEqual([]);
		});

		it('currentTab 应该是空字符串', () => {
			const store = useTabsStore();
			expect(store.currentTab).toBe('');
		});
	});

	describe('show getter', () => {
		it('当 tabs 为空时应该返回 false', () => {
			const store = useTabsStore();
			expect(store.show).toBe(false);
		});

		it('当 tabs 有数据时应该返回 true', () => {
			const store = useTabsStore();
			store.setTabsItem({ name: 'home', title: '首页', path: '/home' });
			expect(store.show).toBe(true);
		});
	});

	describe('nameList getter', () => {
		it('当 tabs 为空时应该返回空数组', () => {
			const store = useTabsStore();
			expect(store.nameList).toEqual([]);
		});

		it('应该返回所有 tab 的 name 数组', () => {
			const store = useTabsStore();
			store.setTabsItem({ name: 'home', title: '首页', path: '/home' });
			store.setTabsItem({ name: 'about', title: '关于', path: '/about' });
			store.setTabsItem({ name: 'contact', title: '联系', path: '/contact' });

			expect(store.nameList).toEqual(['home', 'about', 'contact']);
		});
	});

	describe('setTabsItem', () => {
		it('应该添加新的 tab 到 tabs 数组', () => {
			const store = useTabsStore();
			store.setTabsItem({ name: 'home', title: '首页', path: '/home' });

			expect(store.tabs).toHaveLength(1);
			expect(store.tabs[0]).toEqual({ name: 'home', title: '首页', path: '/home' });
			expect(store.currentTab).toBe('home');
		});

		it('应该添加多个不同的 tab', () => {
			const store = useTabsStore();
			store.setTabsItem({ name: 'home', title: '首页', path: '/home' });
			store.setTabsItem({ name: 'about', title: '关于', path: '/about' });

			expect(store.tabs).toHaveLength(2);
			expect(store.currentTab).toBe('about');
		});

		it('当添加已存在的 tab 时应该更新而不是添加', () => {
			const store = useTabsStore();
			store.setTabsItem({ name: 'home', title: '首页', path: '/home' });
			store.setTabsItem({ name: 'home', title: '首页（更新）', path: '/home/new' });

			expect(store.tabs).toHaveLength(1);
			expect(store.tabs[0]).toEqual({ name: 'home', title: '首页（更新）', path: '/home/new' });
		});
	});

	describe('delTabsItem', () => {
		it('应该删除指定 name 的 tab', () => {
			const store = useTabsStore();
			store.setTabsItem({ name: 'home', title: '首页', path: '/home' });
			store.setTabsItem({ name: 'about', title: '关于', path: '/about' });

			store.delTabsItem('home');

			expect(store.tabs).toHaveLength(1);
			expect(store.tabs[0].name).toBe('about');
		});

		it('删除不存在的 tab 时不应该报错', () => {
			const store = useTabsStore();
			store.setTabsItem({ name: 'home', title: '首页', path: '/home' });

			store.delTabsItem('nonexistent');

			expect(store.tabs).toHaveLength(1);
		});
	});

	describe('clearTabs', () => {
		it('应该清空所有 tabs', () => {
			const store = useTabsStore();
			store.setTabsItem({ name: 'home', title: '首页', path: '/home' });
			store.setTabsItem({ name: 'about', title: '关于', path: '/about' });

			store.clearTabs();

			expect(store.tabs).toEqual([]);
			expect(store.currentTab).toBe('');
		});
	});

	describe('closeTabsOther', () => {
		it('应该只保留指定 name 的 tab', () => {
			const store = useTabsStore();
			store.setTabsItem({ name: 'home', title: '首页', path: '/home' });
			store.setTabsItem({ name: 'about', title: '关于', path: '/about' });
			store.setTabsItem({ name: 'contact', title: '联系', path: '/contact' });

			store.closeTabsOther('about');

			expect(store.tabs).toHaveLength(1);
			expect(store.tabs[0].name).toBe('about');
			expect(store.currentTab).toBe('about');
		});

		it('当指定 tab 不存在时应该清空所有 tabs', () => {
			const store = useTabsStore();
			store.setTabsItem({ name: 'home', title: '首页', path: '/home' });
			store.setTabsItem({ name: 'about', title: '关于', path: '/about' });

			store.closeTabsOther('nonexistent');

			expect(store.tabs).toEqual([]);
		});
	});

	describe('closeCurrentTag', () => {
		it('删除当前 tag 后应该跳转到下一个', () => {
			const store = useTabsStore();
			const mockPush = vi.fn();
			const mockRouter = { push: mockPush };

			store.setTabsItem({ name: 'home', title: '首页', path: '/home' });
			store.setTabsItem({ name: 'about', title: '关于', path: '/about' });
			store.setTabsItem({ name: 'contact', title: '联系', path: '/contact' });

			const mockRoute = { name: 'about' };
			store.closeCurrentTag(mockRouter, mockRoute);

			expect(store.tabs).toHaveLength(2);
			expect(mockPush).toHaveBeenCalledWith('/contact');
			expect(store.currentTab).toBe('contact');
		});

		it('删除最后一个 tag 后应该跳转到上一个', () => {
			const store = useTabsStore();
			const mockPush = vi.fn();
			const mockRouter = { push: mockPush };

			store.setTabsItem({ name: 'home', title: '首页', path: '/home' });
			store.setTabsItem({ name: 'about', title: '关于', path: '/about' });
			store.setTabsItem({ name: 'contact', title: '联系', path: '/contact' });

			const mockRoute = { name: 'contact' };
			store.closeCurrentTag(mockRouter, mockRoute);

			expect(store.tabs).toHaveLength(2);
			expect(mockPush).toHaveBeenCalledWith('/about');
			expect(store.currentTab).toBe('about');
		});

		it('只有一个 tag 时删除后应该跳转到首页 /', () => {
			const store = useTabsStore();
			const mockPush = vi.fn();
			const mockRouter = { push: mockPush };

			store.setTabsItem({ name: 'home', title: '首页', path: '/home' });

			const mockRoute = { name: 'home' };
			store.closeCurrentTag(mockRouter, mockRoute);

			expect(store.tabs).toHaveLength(0);
			expect(mockPush).toHaveBeenCalledWith('/');
			expect(store.currentTab).toBe('');
		});

		it('当当前路由不在 tabs 中时不应该执行任何操作', () => {
			const store = useTabsStore();
			const mockPush = vi.fn();
			const mockRouter = { push: mockPush };

			store.setTabsItem({ name: 'home', title: '首页', path: '/home' });
			store.setTabsItem({ name: 'about', title: '关于', path: '/about' });

			const mockRoute = { name: 'nonexistent' };
			store.closeCurrentTag(mockRouter, mockRoute);

			expect(store.tabs).toHaveLength(2);
			expect(mockPush).not.toHaveBeenCalled();
		});
	});
});
