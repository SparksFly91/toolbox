/**
 * 常用正则表达式预设。
 * 名称通过 i18n key（tools.regex_preset_<key>）提供，分类通过 tools.regex_cat_<category> 提供。
 */
export interface RegexPreset {
  /** 唯一标识，同时作为 preset 名称的 i18n key 后缀 */
  key: string
  /** 分类标识：validate / char / dev / datetime */
  category: RegexCategoryKey
  /** 正则表达式（JS 语法） */
  pattern: string
  /** 默认修饰符 */
  flags?: string
  /** 点击「使用」时填入测试文本的示例 */
  sample?: string
}

export type RegexCategoryKey = "validate" | "char" | "dev" | "datetime"

export const PRESET_CATEGORIES: { key: RegexCategoryKey; labelKey: string }[] = [
  { key: "validate", labelKey: "tools.regex_cat_validate" },
  { key: "char", labelKey: "tools.regex_cat_char" },
  { key: "dev", labelKey: "tools.regex_cat_dev" },
  { key: "datetime", labelKey: "tools.regex_cat_datetime" },
]

export const REGEX_PRESETS: RegexPreset[] = [
  // ---- 校验类 ----
  { key: "email", category: "validate", pattern: String.raw`^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$`, sample: "contact@example.com" },
  { key: "mobile_cn", category: "validate", pattern: String.raw`^1[3-9]\d{9}$`, sample: "13800138000" },
  { key: "phone_cn", category: "validate", pattern: String.raw`^0\d{2,3}-?\d{7,8}$`, sample: "010-88886666" },
  { key: "id_card_cn", category: "validate", pattern: String.raw`^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$`, sample: "11010519491231002X" },
  { key: "bank_card", category: "validate", pattern: String.raw`^\d{16,19}$`, sample: "6222021234567890123" },
  { key: "postal_cn", category: "validate", pattern: String.raw`^[1-9]\d{5}$`, sample: "100000" },
  { key: "user_name", category: "validate", pattern: String.raw`^[A-Za-z][A-Za-z0-9_]{3,15}$`, sample: "john_doe" },
  { key: "password", category: "validate", pattern: String.raw`^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d\W_]{8,20}$`, sample: "Abc12345!" },
  { key: "qq", category: "validate", pattern: String.raw`^[1-9]\d{4,10}$`, sample: "10001" },
  { key: "wechat", category: "validate", pattern: String.raw`^[A-Za-z][-_A-Za-z0-9]{5,19}$`, sample: "weixin_123" },
  { key: "url", category: "validate", pattern: String.raw`^https?:\/\/[\w.-]+(:\d+)?(\/[\w./?%&=#-]*)?$`, sample: "https://www.example.com/path?q=1" },
  { key: "domain", category: "validate", pattern: String.raw`^(?=.{1,253}$)([A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$`, sample: "www.example.com" },
  { key: "ipv4", category: "validate", pattern: String.raw`^((25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)\.){3}(25[0-5]|2[0-4]\d|1\d{2}|[1-9]?\d)$`, sample: "192.168.1.1" },
  { key: "ipv6", category: "validate", pattern: String.raw`^([\da-fA-F]{1,4}:){7}[\da-fA-F]{1,4}$`, sample: "2001:0db8:85a3:0000:0000:8a2e:0370:7334" },
  { key: "mac", category: "validate", pattern: String.raw`^([0-9A-Fa-f]{2}[:-]){5}[0-9A-Fa-f]{2}$`, sample: "00:1A:2B:3C:4D:5E" },
  { key: "port", category: "validate", pattern: String.raw`^([1-9]\d{0,3}|[1-5]\d{4}|6[0-4]\d{3}|65[0-4]\d{2}|655[0-2]\d|6553[0-5])$`, sample: "8080" },

  // ---- 字符类 ----
  { key: "chinese", category: "char", pattern: String.raw`^[\u4e00-\u9fa5]+$`, sample: "你好世界" },
  { key: "letter", category: "char", pattern: String.raw`^[A-Za-z]+$`, sample: "HelloWorld" },
  { key: "number", category: "char", pattern: String.raw`^\d+$`, sample: "123456" },
  { key: "alphanumeric", category: "char", pattern: String.raw`^[A-Za-z0-9]+$`, sample: "abc123" },
  { key: "whitespace", category: "char", pattern: String.raw`\s+`, sample: "a b\tc" },
  { key: "hex_color", category: "char", pattern: String.raw`^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$`, sample: "#1a2b3c" },
  { key: "uuid", category: "char", pattern: String.raw`^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$`, sample: "550e8400-e29b-41d4-a716-446655440000" },
  { key: "base64", category: "char", pattern: String.raw`^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$`, sample: "SGVsbG8=" },

  // ---- 开发类 ----
  { key: "html_tag", category: "dev", pattern: String.raw`<\/?[a-zA-Z][^>]*>`, flags: "g", sample: '<div class="box">hello</div>' },
  { key: "integer", category: "dev", pattern: String.raw`^-?\d+$`, sample: "-42" },
  { key: "decimal", category: "dev", pattern: String.raw`^-?\d+(\.\d+)?$`, sample: "3.14" },
  { key: "percent", category: "dev", pattern: String.raw`^-?\d+(\.\d+)?%$`, sample: "99.5%" },

  // ---- 日期时间 ----
  { key: "date", category: "datetime", pattern: String.raw`^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$`, sample: "2026-09-22" },
  { key: "time", category: "datetime", pattern: String.raw`^([01]\d|2[0-3]):[0-5]\d:[0-5]\d$`, sample: "14:30:05" },
  { key: "datetime", category: "datetime", pattern: String.raw`^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$`, sample: "2026-09-22 14:30:05" },
]
