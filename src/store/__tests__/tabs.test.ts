import { describe, it, expect, beforeEach, vi } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTabsStore } from '../tabs';

describe('tabs store', () => {
    beforeEach(() => {
        setActivePinia(createPinia());
    });

    describe('初始状态', () => {
        it('初始 list 应该为空数组', () => {
            const store = useTabsStore();
            expect(store.list).toEqual([]);
        });
    });

    describe('show getter', () => {
        it('当 list 为空时应该返回 false', () => {
            const store = useTabsStore();
            expect(store.show).toBe(false);
        });

        it('当 list 有元素时应该返回 true', () => {
            const store = useTabsStore();
            store.setTabsItem({ name: 'Dashboard', path: '/dashboard', title: '仪表盘' });
            expect(store.show).toBe(true);
        });
    });

    describe('nameList getter', () => {
        it('应该返回所有 tab 的 name 列表', () => {
            const store = useTabsStore();
            store.setTabsItem({ name: 'Dashboard', path: '/dashboard', title: '仪表盘' });
            store.setTabsItem({ name: 'User', path: '/user', title: '用户管理' });
            store.setTabsItem({ name: 'Table', path: '/table', title: '表格' });

            expect(store.nameList).toEqual(['Dashboard', 'User', 'Table']);
        });

        it('当 list 为空时应该返回空数组', () => {
            const store = useTabsStore();
            expect(store.nameList).toEqual([]);
        });
    });

    describe('setTabsItem', () => {
        it('应该向 list 添加一个 tab 项', () => {
            const store = useTabsStore();
            store.setTabsItem({ name: 'Dashboard', path: '/dashboard', title: '仪表盘' });

            expect(store.list).toHaveLength(1);
            expect(store.list[0]).toEqual({
                name: 'Dashboard',
                path: '/dashboard',
                title: '仪表盘'
            });
        });

        it('应该能够添加多个 tab 项', () => {
            const store = useTabsStore();
            store.setTabsItem({ name: 'Dashboard', path: '/dashboard', title: '仪表盘' });
            store.setTabsItem({ name: 'User', path: '/user', title: '用户管理' });

            expect(store.list).toHaveLength(2);
        });
    });

    describe('delTabsItem', () => {
        it('应该删除指定索引的 tab 项', () => {
            const store = useTabsStore();
            store.setTabsItem({ name: 'Dashboard', path: '/dashboard', title: '仪表盘' });
            store.setTabsItem({ name: 'User', path: '/user', title: '用户管理' });
            store.setTabsItem({ name: 'Table', path: '/table', title: '表格' });

            store.delTabsItem(1);

            expect(store.list).toHaveLength(2);
            expect(store.nameList).toEqual(['Dashboard', 'Table']);
        });

        it('删除第一个 tab 项', () => {
            const store = useTabsStore();
            store.setTabsItem({ name: 'Dashboard', path: '/dashboard', title: '仪表盘' });
            store.setTabsItem({ name: 'User', path: '/user', title: '用户管理' });

            store.delTabsItem(0);

            expect(store.nameList).toEqual(['User']);
        });

        it('删除最后一个 tab 项', () => {
            const store = useTabsStore();
            store.setTabsItem({ name: 'Dashboard', path: '/dashboard', title: '仪表盘' });
            store.setTabsItem({ name: 'User', path: '/user', title: '用户管理' });

            store.delTabsItem(1);

            expect(store.nameList).toEqual(['Dashboard']);
        });
    });

    describe('clearTabs', () => {
        it('应该清空所有 tab 项', () => {
            const store = useTabsStore();
            store.setTabsItem({ name: 'Dashboard', path: '/dashboard', title: '仪表盘' });
            store.setTabsItem({ name: 'User', path: '/user', title: '用户管理' });

            store.clearTabs();

            expect(store.list).toEqual([]);
            expect(store.show).toBe(false);
        });
    });

    describe('closeTabsOther', () => {
        it('应该将 list 替换为传入的数据', () => {
            const store = useTabsStore();
            store.setTabsItem({ name: 'Dashboard', path: '/dashboard', title: '仪表盘' });
            store.setTabsItem({ name: 'User', path: '/user', title: '用户管理' });
            store.setTabsItem({ name: 'Table', path: '/table', title: '表格' });

            const newData = [
                { name: 'Dashboard', path: '/dashboard', title: '仪表盘' }
            ];
            store.closeTabsOther(newData);

            expect(store.list).toEqual(newData);
        });

        it('应该能够替换为空数组', () => {
            const store = useTabsStore();
            store.setTabsItem({ name: 'Dashboard', path: '/dashboard', title: '仪表盘' });

            store.closeTabsOther([]);

            expect(store.list).toEqual([]);
        });
    });

    describe('closeCurrentTag', () => {
        it('删除当前 tag 后应该跳转到下一个 tab', () => {
            const store = useTabsStore();
            store.setTabsItem({ name: 'Dashboard', path: '/dashboard', title: '仪表盘' });
            store.setTabsItem({ name: 'User', path: '/user', title: '用户管理' });
            store.setTabsItem({ name: 'Table', path: '/table', title: '表格' });

            const mockRouter = { push: vi.fn() };
            const mockRoute = { fullPath: '/user' };

            store.closeCurrentTag({
                $route: mockRoute,
                $router: mockRouter
            });

            expect(mockRouter.push).toHaveBeenCalledWith('/table');
            expect(store.nameList).toEqual(['Dashboard', 'Table']);
        });

        it('删除最后一个 tag 后应该跳转到上一个 tab', () => {
            const store = useTabsStore();
            store.setTabsItem({ name: 'Dashboard', path: '/dashboard', title: '仪表盘' });
            store.setTabsItem({ name: 'User', path: '/user', title: '用户管理' });

            const mockRouter = { push: vi.fn() };
            const mockRoute = { fullPath: '/user' };

            store.closeCurrentTag({
                $route: mockRoute,
                $router: mockRouter
            });

            expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
            expect(store.nameList).toEqual(['Dashboard']);
        });

        it('只有一个 tag 时删除后应该跳转到 /', () => {
            const store = useTabsStore();
            store.setTabsItem({ name: 'Dashboard', path: '/dashboard', title: '仪表盘' });

            const mockRouter = { push: vi.fn() };
            const mockRoute = { fullPath: '/dashboard' };

            store.closeCurrentTag({
                $route: mockRoute,
                $router: mockRouter
            });

            expect(mockRouter.push).toHaveBeenCalledWith('/');
            expect(store.list).toEqual([]);
        });

        it('删除中间位置的 tag 应该跳转到下一个', () => {
            const store = useTabsStore();
            store.setTabsItem({ name: 'Dashboard', path: '/dashboard', title: '仪表盘' });
            store.setTabsItem({ name: 'User', path: '/user', title: '用户管理' });
            store.setTabsItem({ name: 'Table', path: '/table', title: '表格' });
            store.setTabsItem({ name: 'Form', path: '/form', title: '表单' });

            const mockRouter = { push: vi.fn() };
            const mockRoute = { fullPath: '/user' };

            store.closeCurrentTag({
                $route: mockRoute,
                $router: mockRouter
            });

            expect(mockRouter.push).toHaveBeenCalledWith('/table');
            expect(store.nameList).toEqual(['Dashboard', 'Table', 'Form']);
        });

        it('当前路径不存在于 list 中时不应该执行任何操作', () => {
            const store = useTabsStore();
            store.setTabsItem({ name: 'Dashboard', path: '/dashboard', title: '仪表盘' });
            store.setTabsItem({ name: 'User', path: '/user', title: '用户管理' });

            const mockRouter = { push: vi.fn() };
            const mockRoute = { fullPath: '/not-exist' };

            store.closeCurrentTag({
                $route: mockRoute,
                $router: mockRouter
            });

            expect(mockRouter.push).not.toHaveBeenCalled();
            expect(store.nameList).toEqual(['Dashboard', 'User']);
        });
    });
});
