import { defineStore } from "pinia"
import type { AppSettingState } from "@/types"
import { setLocale as applyLocale } from "@/i18n"

export const DEFAULT_SETTINGS: AppSettingState = {
  layoutMode: "side",
  themeMode: "light",
  primaryColor: "#1677ff",
  showBreadcrumb: true,
  showTabs: true,
  tabStyle: "card",
  siderCollapsed: false,
  locale: "zh-CN",
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
    async setLocale(locale: string) {
      await applyLocale(locale)
      this.locale = locale
    },
    reset() {
      Object.assign(this, defaultSettings())
    },
  },
  persist: true,
})
