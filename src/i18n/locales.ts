export interface LocaleOption {
  value: string
  label: string
}
/**
 * 语言注册表：新增一种语言的步骤
 * 1. 在 `./locales/` 下新增 `<lang>.json`（结构与 schema.ts 一致）
 * 2. 在 `MESSAGES` 注册消息懒加载函数
 * 3. 在 `ANTD_LOCALES` 注册 ant-design-vue 语言包懒加载函数
 * 4. 在 `DAYJS_LOCALES` 注册 dayjs 语言标识
 * 5. 在 `SUPPORTED` 添加展示项即可
 */
export const MESSAGES: Record<string, () => Promise<{ default: unknown }>> = {
  "zh-CN": () => import("./locales/zh-CN.json"),
  "en-US": () => import("./locales/en-US.json"),
}

export const ANTD_LOCALES: Record<string, () => Promise<{ default: unknown }>> = {
  "zh-CN": () => import("ant-design-vue/es/locale/zh_CN"),
  "en-US": () => import("ant-design-vue/es/locale/en_US"),
}

export const DAYJS_LOCALES: Record<string, string> = {
  "zh-CN": "zh-cn",
  "en-US": "en",
}

export const SUPPORTED: LocaleOption[] = [
  { value: "zh-CN", label: "简体中文" },
  { value: "en-US", label: "English" },
]

export const DEFAULT_LOCALE = "zh-CN"
