import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTabsStore } from '../tabs';

describe('useTabsStore', () => {
	beforeEach(() => {
		setActivePinia(createPinia());
	});

	describe('initial state', () => {
		it('should have empty list as initial state', () => {
			const store = useTabsStore();
			expect(store.list).toEqual([]);
		});
	});

	describe('show getter', () => {
		it('should return false when list is empty', () => {
			const store = useTabsStore();
			expect(store.show).toBe(false);
		});

		it('should return true when list has items', () => {
			const store = useTabsStore();
			store.setTabsItem({ name: 'test', path: '/test', title: 'Test' });
			expect(store.show).toBe(true);
		});
	});

	describe('nameList getter', () => {
		it('should return empty array when list is empty', () => {
			const store = useTabsStore();
			expect(store.nameList).toEqual([]);
		});

		it('should return array of names when list has items', () => {
			const store = useTabsStore();
			store.setTabsItem({ name: 'home', path: '/home', title: 'Home' });
			store.setTabsItem({ name: 'about', path: '/about', title: 'About' });
			expect(store.nameList).toEqual(['home', 'about']);
		});
	});

	describe('setTabsItem', () => {
		it('should add item to list', () => {
			const store = useTabsStore();
			const item = { name: 'test', path: '/test', title: 'Test' };
			store.setTabsItem(item);
			expect(store.list).toHaveLength(1);
			expect(store.list[0]).toEqual(item);
		});

		it('should add multiple items to list', () => {
			const store = useTabsStore();
			store.setTabsItem({ name: 'item1', path: '/item1', title: 'Item 1' });
			store.setTabsItem({ name: 'item2', path: '/item2', title: 'Item 2' });
			expect(store.list).toHaveLength(2);
		});
	});

	describe('delTabsItem', () => {
		it('should remove item at specified index', () => {
			const store = useTabsStore();
			store.setTabsItem({ name: 'item1', path: '/item1', title: 'Item 1' });
			store.setTabsItem({ name: 'item2', path: '/item2', title: 'Item 2' });
			store.setTabsItem({ name: 'item3', path: '/item3', title: 'Item 3' });

			store.delTabsItem(1);

			expect(store.list).toHaveLength(2);
			expect(store.list[0].name).toBe('item1');
			expect(store.list[1].name).toBe('item3');
		});

		it('should remove first item when index is 0', () => {
			const store = useTabsStore();
			store.setTabsItem({ name: 'item1', path: '/item1', title: 'Item 1' });
			store.setTabsItem({ name: 'item2', path: '/item2', title: 'Item 2' });

			store.delTabsItem(0);

			expect(store.list).toHaveLength(1);
			expect(store.list[0].name).toBe('item2');
		});

		it('should remove last item when index is last', () => {
			const store = useTabsStore();
			store.setTabsItem({ name: 'item1', path: '/item1', title: 'Item 1' });
			store.setTabsItem({ name: 'item2', path: '/item2', title: 'Item 2' });

			store.delTabsItem(1);

			expect(store.list).toHaveLength(1);
			expect(store.list[0].name).toBe('item1');
		});
	});

	describe('clearTabs', () => {
		it('should clear all items from list', () => {
			const store = useTabsStore();
			store.setTabsItem({ name: 'item1', path: '/item1', title: 'Item 1' });
			store.setTabsItem({ name: 'item2', path: '/item2', title: 'Item 2' });

			store.clearTabs();

			expect(store.list).toEqual([]);
			expect(store.list).toHaveLength(0);
		});

		it('should work on empty list', () => {
			const store = useTabsStore();
			store.clearTabs();
			expect(store.list).toEqual([]);
		});
	});

	describe('closeTabsOther', () => {
		it('should replace list with provided data', () => {
			const store = useTabsStore();
			store.setTabsItem({ name: 'item1', path: '/item1', title: 'Item 1' });
			store.setTabsItem({ name: 'item2', path: '/item2', title: 'Item 2' });
			store.setTabsItem({ name: 'item3', path: '/item3', title: 'Item 3' });

			const newData = [{ name: 'keep', path: '/keep', title: 'Keep' }];
			store.closeTabsOther(newData);

			expect(store.list).toEqual(newData);
			expect(store.list).toHaveLength(1);
		});
	});

	describe('closeCurrentTag', () => {
		it('should navigate to next tag when deleting current tag (not last)', () => {
			const store = useTabsStore();
			const mockPush = vi.fn();

			store.setTabsItem({ name: 'item1', path: '/item1', title: 'Item 1' });
			store.setTabsItem({ name: 'item2', path: '/item2', title: 'Item 2' });
			store.setTabsItem({ name: 'item3', path: '/item3', title: 'Item 3' });

			const data = {
				$route: { fullPath: '/item2' },
				$router: { push: mockPush },
			};

			store.closeCurrentTag(data);

			expect(mockPush).toHaveBeenCalledWith('/item3');
			expect(store.list).toHaveLength(2);
			expect(store.list.map(i => i.name)).toEqual(['item1', 'item3']);
		});

		it('should navigate to previous tag when deleting last tag', () => {
			const store = useTabsStore();
			const mockPush = vi.fn();

			store.setTabsItem({ name: 'item1', path: '/item1', title: 'Item 1' });
			store.setTabsItem({ name: 'item2', path: '/item2', title: 'Item 2' });
			store.setTabsItem({ name: 'item3', path: '/item3', title: 'Item 3' });

			const data = {
				$route: { fullPath: '/item3' },
				$router: { push: mockPush },
			};

			store.closeCurrentTag(data);

			expect(mockPush).toHaveBeenCalledWith('/item2');
			expect(store.list).toHaveLength(2);
			expect(store.list.map(i => i.name)).toEqual(['item1', 'item2']);
		});

		it('should navigate to root when deleting the only tag', () => {
			const store = useTabsStore();
			const mockPush = vi.fn();

			store.setTabsItem({ name: 'item1', path: '/item1', title: 'Item 1' });

			const data = {
				$route: { fullPath: '/item1' },
				$router: { push: mockPush },
			};

			store.closeCurrentTag(data);

			expect(mockPush).toHaveBeenCalledWith('/');
			expect(store.list).toHaveLength(0);
		});

		it('should not do anything when route path is not found in list', () => {
			const store = useTabsStore();
			const mockPush = vi.fn();

			store.setTabsItem({ name: 'item1', path: '/item1', title: 'Item 1' });
			store.setTabsItem({ name: 'item2', path: '/item2', title: 'Item 2' });

			const data = {
				$route: { fullPath: '/nonexistent' },
				$router: { push: mockPush },
			};

			store.closeCurrentTag(data);

			expect(mockPush).not.toHaveBeenCalled();
			expect(store.list).toHaveLength(2);
		});
	});
});
