import { defineStore } from "pinia"
import type { TabItem } from "@/types"

export const HOME_PATH = "/"

export const useTabStore = defineStore("tab", {
  state: () => ({
    tabs: [
      // { path: HOME_PATH, name: "home", title: "首页", affix: true },
    ] as TabItem[],
    cachedViews: [] as string[],
  }),
  actions: {
    addTab(tab: TabItem) {
      if (!tab.path) return
      if (this.tabs.some(t => t.path === tab.path)) return
      this.tabs.push(tab)
      if (tab.name && !this.cachedViews.includes(tab.name)) {
        this.cachedViews.push(tab.name)
      }
    },
    removeTab(path: string): TabItem | null {
      const index = this.tabs.findIndex(t => t.path === path)
      if (index === -1) return null
      const tab = this.tabs[index]
      if (tab.affix) return null
      this.tabs.splice(index, 1)
      this.cachedViews = this.cachedViews.filter(n => n !== tab.name)
      return tab
    },
    closeOther(path: string) {
      this.tabs = this.tabs.filter(t => t.affix || t.path === path)
      this.syncCachedViews()
    },
    closeAll(): string {
      this.tabs = this.tabs.filter(t => t.affix)
      this.syncCachedViews()
      return this.tabs[0]?.path ?? HOME_PATH
    },
    syncCachedViews() {
      this.cachedViews = this.tabs.map(t => t.name).filter(Boolean)
    },
  },
  persist: true,
})
