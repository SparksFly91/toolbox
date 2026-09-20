/**
 * i18n 消息 Schema（以 zh-CN 为准）。
 * 新增语言文件应与本结构保持一致，配合 vue-i18n 获得完整类型检查与补全。
 */
export interface Schema {
  common: {
    confirm: string
    cancel: string
    close: string
    closeOther: string
    closeAll: string
    closeCurrent: string
    refresh: string
  }
  app: {
    title: string
    description: string
    search_placeholder: string
    theme_toggle_dark: string
    theme_toggle_light: string
  }
  menu: {
    home: string
    tools: string
    tools_json: string
    tools_regex: string
    settings: string
  }
  layout: {
    collapse: string
    expand: string
  }
  setting: {
    title: string
    theme: string
    theme_light: string
    theme_dark: string
    theme_auto: string
    layout: string
    layout_side: string
    layout_top: string
    primaryColor: string
    switches: string
    showBreadcrumb: string
    showTabs: string
    tabStyle: string
    tabStyle_card: string
    tabStyle_chip: string
    reset: string
    language: string
  }
  error: {
    "404_title": string
    "404_desc": string
    backHome: string
  }
  tools: {
    json_input_placeholder: string
    json_format_btn: string
    json_output: string
    regex_pattern: string
    regex_text: string
    regex_execute: string
    keepalive_hint: string
  }
}
