export interface TabItem {
  path: string
  name: string
  title: string
  /** affix 标签不可关闭 */
  affix?: boolean
}

export type LayoutMode = "side" | "top"
export type ThemeMode = "light" | "dark" | "auto"
export type TabStyle = "card" | "chip"

export interface AppSettingState {
  layoutMode: LayoutMode
  themeMode: ThemeMode
  primaryColor: string
  showBreadcrumb: boolean
  showTabs: boolean
  tabStyle: TabStyle
  siderCollapsed: boolean
}

/** 经典色板 */
export const COLOR_PRESETS: { label: string; value: string }[] = [
  { label: "拂晓蓝", value: "#1677ff" },
  { label: "极客蓝", value: "#2f54eb" },
  { label: "酱紫", value: "#722ed1" },
  { label: "薄暮红", value: "#f5222d" },
  { label: "日暮橙", value: "#fa8c16" },
  { label: "金盏黄", value: "#fadb14" },
  { label: "青柠绿", value: "#a0d911" },
  { label: "极光绿", value: "#52c41a" },
  { label: "明青", value: "#13c2c2" },
  { label: "品红", value: "#eb2f96" },
]
