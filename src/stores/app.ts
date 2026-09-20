import { defineStore } from "pinia"
import type { AppSettingState } from "@/types"

export const DEFAULT_SETTINGS: AppSettingState = {
  layoutMode: "side",
  themeMode: "light",
  primaryColor: "#1677ff",
  showBreadcrumb: true,
  showTabs: true,
  tabStyle: "card",
  siderCollapsed: false,
}

export const defaultSettings = (): AppSettingState => ({ ...DEFAULT_SETTINGS })

export const useAppStore = defineStore("app", {
  state: (): AppSettingState => defaultSettings(),
  actions: {
    update(partial: Partial<AppSettingState>) {
      Object.assign(this, partial)
    },
    toggleSider() {
      this.siderCollapsed = !this.siderCollapsed
    },
    reset() {
      Object.assign(this, defaultSettings())
    },
  },
  persist: true,
})
