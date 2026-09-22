/**
 * 「根据配置生成正则表达式」的核心逻辑。
 * 将若干条「匹配规则」（字符类型 + 数量）拼接成一条正则，可选首尾锚点。
 */

export type BuilderType =
  | "digit"
  | "letter"
  | "letterUpper"
  | "letterLower"
  | "chinese"
  | "word"
  | "any"
  | "space"
  | "custom"
  | "literal"

export type QuantifierMode =
  | "one"
  | "optional"
  | "zeroMore"
  | "oneMore"
  | "exactly"
  | "between"
  | "atLeast"

export interface BuilderRule {
  id: number
  type: BuilderType
  /** type 为 custom（字符集内容）或 literal（固定文本）时使用 */
  value: string
  quantifier: QuantifierMode
  /** 数量下限 */
  min: number
  /** 数量上限（between 时使用） */
  max: number
}

/** 字符类型 -> 正则片段 */
const TYPE_FRAGMENT: Record<Exclude<BuilderType, "custom" | "literal">, string> = {
  digit: "\\d",
  letter: "[A-Za-z]",
  letterUpper: "[A-Z]",
  letterLower: "[a-z]",
  chinese: "[\\u4e00-\\u9fa5]",
  word: "\\w",
  any: ".",
  space: "\\s",
}

/** 转义正则元字符，用于固定文本 */
export function escapeLiteral(text: string): string {
  return text.replace(/[\\^$.*+?()[\]{}|/]/g, "\\$&")
}

/** 转义字符集内容，保留 `-` 以便用户书写范围（如 a-z），仅处理必要的 `\` `]` 与开头的 `^` */
export function escapeCharset(text: string): string {
  let out = text.replace(/\\/g, "\\\\").replace(/\]/g, "\\]")
  if (out.startsWith("^")) out = `\\${out}`
  return out
}

/** 单条规则对应的正则片段 */
export function ruleFragment(rule: BuilderRule): string {
  let fragment: string
  if (rule.type === "custom") {
    fragment = `[${escapeCharset(rule.value)}]`
  } else if (rule.type === "literal") {
    fragment = escapeLiteral(rule.value)
  } else {
    fragment = TYPE_FRAGMENT[rule.type]
  }

  const suffix = quantifierSuffix(rule)
  if (!suffix) return fragment
  // 多字符的固定文本需要分组，保证量词作用于整体
  if (rule.type === "literal" && fragment.length > 1) return `(?:${fragment})${suffix}`
  return `${fragment}${suffix}`
}

/** 规则量词对应的后缀 */
export function quantifierSuffix(rule: BuilderRule): string {
  const min = Math.max(0, Math.floor(rule.min || 0))
  switch (rule.quantifier) {
    case "one":
      return ""
    case "optional":
      return "?"
    case "zeroMore":
      return "*"
    case "oneMore":
      return "+"
    case "exactly":
      return `{${min}}`
    case "between": {
      const max = Math.max(min, Math.floor(rule.max || 0))
      return `{${min},${max}}`
    }
    case "atLeast":
      return `{${min},}`
    default:
      return ""
  }
}

/** 根据配置生成正则表达式；无有效规则时返回空串 */
export function buildRegex(
  rules: BuilderRule[],
  options: { startAnchor: boolean; endAnchor: boolean }
): string {
  const body = rules
    .map((rule) => {
      // 自定义字符集 / 固定文本内容为空时跳过该条规则
      if ((rule.type === "custom" || rule.type === "literal") && !rule.value) return ""
      return ruleFragment(rule)
    })
    .join("")

  if (!body) return ""
  return `${options.startAnchor ? "^" : ""}${body}${options.endAnchor ? "$" : ""}`
}
