import { createI18n } from "vue-i18n"
import type { Composer } from "vue-i18n"
import { ref } from "vue"
import dayjs from "dayjs"
import type { Schema } from "./schema"
import { DEFAULT_LOCALE, MESSAGES, ANTD_LOCALES, DAYJS_LOCALES } from "./locales"

const i18n = createI18n({
  legacy: false,
  locale: DEFAULT_LOCALE,
  fallbackLocale: DEFAULT_LOCALE,
  messages: {
    [DEFAULT_LOCALE]: {},
  },
  missingWarn: import.meta.env.DEV,
  fallbackWarn: false,
})

const composer = i18n.global as unknown as Composer<{
  // 语言消息 Schema（以 zh-CN 为准），用于提供翻译的行内类型提示
  "zh-CN": Schema
  "en-US": Schema
}>

/** 当前生效的 ant-design-vue 语言包（App.vue 中下发给 ConfigProvider） */
export const antdLocale = ref((await ANTD_LOCALES[DEFAULT_LOCALE]()).default)

/** 已完成懒加载缓存的语言 */
const loaded = new Set<string>([DEFAULT_LOCALE])

export async function setLocale(locale: string) {
  if (locale === composer.locale.value || !MESSAGES[locale]) return

  if (!loaded.has(locale)) {
    const messages = (await MESSAGES[locale]()).default as Schema
    composer.setLocaleMessage(locale as "zh-CN", messages)
    loaded.add(locale)
  }

  antdLocale.value = (await ANTD_LOCALES[locale]()).default
  if (DAYJS_LOCALES[locale]) {
    dayjs.locale(DAYJS_LOCALES[locale])
  }
  composer.locale.value = locale as "zh-CN"
  document.documentElement.lang = locale
}

/** 快捷翻译函数（key 为 i18n key，如 "menu.home"） */
export function t(key: string, ...args: any[]): string {
  return (composer.t as any)(key, ...args)
}

export default i18n
