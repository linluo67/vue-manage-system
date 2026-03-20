import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useTabsStore } from '../tabs';

describe('store/tabs.ts', () => {
  beforeEach(() => {
    const pinia = createPinia();
    setActivePinia(pinia);
  });

  describe('initial state', () => {
    it('should have empty list initially', () => {
      const store = useTabsStore();
      expect(store.list).toEqual([]);
    });
  });

  describe('getters', () => {
    describe('show', () => {
      it('should return false when list is empty', () => {
        const store = useTabsStore();
        expect(store.show).toBe(false);
      });

      it('should return true when list has items', () => {
        const store = useTabsStore();
        store.setTabsItem({ name: 'Home', path: '/home', title: '首页' });
        expect(store.show).toBe(true);
      });
    });

    describe('nameList', () => {
      it('should return empty array when list is empty', () => {
        const store = useTabsStore();
        expect(store.nameList).toEqual([]);
      });

      it('should return array of names from list items', () => {
        const store = useTabsStore();
        store.setTabsItem({ name: 'Home', path: '/home', title: '首页' });
        store.setTabsItem({ name: 'About', path: '/about', title: '关于' });
        expect(store.nameList).toEqual(['Home', 'About']);
      });
    });
  });

  describe('actions', () => {
    describe('setTabsItem', () => {
      it('should add item to list', () => {
        const store = useTabsStore();
        const item = { name: 'Home', path: '/home', title: '首页' };
        
        store.setTabsItem(item);
        
        expect(store.list).toHaveLength(1);
        expect(store.list[0]).toEqual(item);
      });

      it('should add multiple items to list', () => {
        const store = useTabsStore();
        const item1 = { name: 'Home', path: '/home', title: '首页' };
        const item2 = { name: 'About', path: '/about', title: '关于' };
        
        store.setTabsItem(item1);
        store.setTabsItem(item2);
        
        expect(store.list).toHaveLength(2);
        expect(store.list).toEqual([item1, item2]);
      });
    });

    describe('delTabsItem', () => {
      it('should remove item at specified index', () => {
        const store = useTabsStore();
        store.setTabsItem({ name: 'Home', path: '/home', title: '首页' });
        store.setTabsItem({ name: 'About', path: '/about', title: '关于' });
        store.setTabsItem({ name: 'Contact', path: '/contact', title: '联系' });
        
        store.delTabsItem(1);
        
        expect(store.list).toHaveLength(2);
        expect(store.list[0].name).toBe('Home');
        expect(store.list[1].name).toBe('Contact');
      });

      it('should handle removing from empty list', () => {
        const store = useTabsStore();
        
        store.delTabsItem(0);
        
        expect(store.list).toEqual([]);
      });
    });

    describe('clearTabs', () => {
      it('should clear all items from list', () => {
        const store = useTabsStore();
        store.setTabsItem({ name: 'Home', path: '/home', title: '首页' });
        store.setTabsItem({ name: 'About', path: '/about', title: '关于' });
        
        store.clearTabs();
        
        expect(store.list).toEqual([]);
      });

      it('should handle clearing empty list', () => {
        const store = useTabsStore();
        
        store.clearTabs();
        
        expect(store.list).toEqual([]);
      });
    });

    describe('closeTabsOther', () => {
      it('should replace list with provided data', () => {
        const store = useTabsStore();
        store.setTabsItem({ name: 'Home', path: '/home', title: '首页' });
        store.setTabsItem({ name: 'About', path: '/about', title: '关于' });
        store.setTabsItem({ name: 'Contact', path: '/contact', title: '联系' });
        
        const newList = [{ name: 'Home', path: '/home', title: '首页' }];
        store.closeTabsOther(newList);
        
        expect(store.list).toEqual(newList);
      });

      it('should handle empty data array', () => {
        const store = useTabsStore();
        store.setTabsItem({ name: 'Home', path: '/home', title: '首页' });
        
        store.closeTabsOther([]);
        
        expect(store.list).toEqual([]);
      });
    });

    describe('closeCurrentTag', () => {
      it('should navigate to next item when deleting middle item', () => {
        const store = useTabsStore();
        store.setTabsItem({ name: 'Home', path: '/home', title: '首页' });
        store.setTabsItem({ name: 'About', path: '/about', title: '关于' });
        store.setTabsItem({ name: 'Contact', path: '/contact', title: '联系' });
        
        const mockRouter = { push: vi.fn() };
        const mockRoute = { fullPath: '/about' };
        
        store.closeCurrentTag({ $router: mockRouter, $route: mockRoute });
        
        expect(mockRouter.push).toHaveBeenCalledWith('/contact');
        expect(store.list).toHaveLength(2);
        expect(store.list.map(item => item.name)).toEqual(['Home', 'Contact']);
      });

      it('should navigate to previous item when deleting last item', () => {
        const store = useTabsStore();
        store.setTabsItem({ name: 'Home', path: '/home', title: '首页' });
        store.setTabsItem({ name: 'About', path: '/about', title: '关于' });
        store.setTabsItem({ name: 'Contact', path: '/contact', title: '联系' });
        
        const mockRouter = { push: vi.fn() };
        const mockRoute = { fullPath: '/contact' };
        
        store.closeCurrentTag({ $router: mockRouter, $route: mockRoute });
        
        expect(mockRouter.push).toHaveBeenCalledWith('/about');
        expect(store.list).toHaveLength(2);
        expect(store.list.map(item => item.name)).toEqual(['Home', 'About']);
      });

      it('should navigate to "/" when deleting the only item', () => {
        const store = useTabsStore();
        store.setTabsItem({ name: 'Home', path: '/home', title: '首页' });
        
        const mockRouter = { push: vi.fn() };
        const mockRoute = { fullPath: '/home' };
        
        store.closeCurrentTag({ $router: mockRouter, $route: mockRoute });
        
        expect(mockRouter.push).toHaveBeenCalledWith('/');
        expect(store.list).toEqual([]);
      });

      it('should navigate to next item when deleting first item (not only one)', () => {
        const store = useTabsStore();
        store.setTabsItem({ name: 'Home', path: '/home', title: '首页' });
        store.setTabsItem({ name: 'About', path: '/about', title: '关于' });
        
        const mockRouter = { push: vi.fn() };
        const mockRoute = { fullPath: '/home' };
        
        store.closeCurrentTag({ $router: mockRouter, $route: mockRoute });
        
        expect(mockRouter.push).toHaveBeenCalledWith('/about');
        expect(store.list).toHaveLength(1);
        expect(store.list[0].name).toBe('About');
      });

      it('should do nothing when path not found', () => {
        const store = useTabsStore();
        store.setTabsItem({ name: 'Home', path: '/home', title: '首页' });
        
        const mockRouter = { push: vi.fn() };
        const mockRoute = { fullPath: '/not-found' };
        
        store.closeCurrentTag({ $router: mockRouter, $route: mockRoute });
        
        expect(mockRouter.push).not.toHaveBeenCalled();
        expect(store.list).toHaveLength(1);
      });
    });
  });
});