import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export interface TabItem {
	name: string;
	title: string;
	path: string;
}

export const useTabsStore = defineStore('tabs', () => {
	// State
	const tabs = ref<TabItem[]>([]);
	const currentTab = ref<string>('');

	// Getters
	const show = computed(() => tabs.value.length > 0);

	const nameList = computed(() => tabs.value.map((tab) => tab.name));

	// Actions
	const setTabsItem = (tab: TabItem) => {
		// 如果已存在则更新，否则添加
		const index = tabs.value.findIndex((item) => item.name === tab.name);
		if (index === -1) {
			tabs.value.push(tab);
		} else {
			tabs.value[index] = tab;
		}
		currentTab.value = tab.name;
	};

	const delTabsItem = (name: string) => {
		const index = tabs.value.findIndex((item) => item.name === name);
		if (index > -1) {
			tabs.value.splice(index, 1);
		}
	};

	const clearTabs = () => {
		tabs.value = [];
		currentTab.value = '';
	};

	const closeTabsOther = (name: string) => {
		tabs.value = tabs.value.filter((item) => item.name === name);
		currentTab.value = name;
	};

	const closeCurrentTag = (router: any, route: any) => {
		const currentName = route.name as string;
		const currentIndex = tabs.value.findIndex((item) => item.name === currentName);

		if (currentIndex === -1) return;

		// 删除当前 tag
		tabs.value.splice(currentIndex, 1);

		// 决定跳转目标
		if (tabs.value.length === 0) {
			// 没有 tag 了，跳转到首页
			router.push('/');
			currentTab.value = '';
		} else if (currentIndex < tabs.value.length) {
			// 跳转到下一个
			const nextTab = tabs.value[currentIndex];
			router.push(nextTab.path);
			currentTab.value = nextTab.name;
		} else {
			// 删除的是最后一个，跳转到上一个
			const prevTab = tabs.value[tabs.value.length - 1];
			router.push(prevTab.path);
			currentTab.value = prevTab.name;
		}
	};

	return {
		tabs,
		currentTab,
		show,
		nameList,
		setTabsItem,
		delTabsItem,
		clearTabs,
		closeTabsOther,
		closeCurrentTag,
	};
});
