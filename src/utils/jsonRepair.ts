/**
 * 非严格 JSON 输入的自动修复。
 * 处理常见错误：
 * 1. 对象/数组末尾的尾随逗号（如 {"a": 1,} / [1, 2,]）
 * 2. JS 风格注释（// 与多行块注释）
 * 3. JS 单引号字符串（转换为 JSON 要求的双引号）
 *
 * 修复过程会跳过字符串字面量内容本身，避免把用户数据里的逗号、引号误伤。
 */

export type JsonRepairKey = "trailing" | "comment" | "single"

export interface JsonRepairResult {
  /** 修复后的 JSON 文本 */
  code: string
  /** 本次实际做过的修复类型，用于界面提示 */
  repairs: JsonRepairKey[]
}

export function repairJson(input: string): JsonRepairResult {
  const repairs: JsonRepairKey[] = []
  const mark = (key: JsonRepairKey) => {
    if (!repairs.includes(key)) repairs.push(key)
  }
  const n = input.length

  /** 从 from 开始扫描空白与注释；silent 为 true 时仅探查、不记录修复 */
  function scan(from: number, silent: boolean): number {
    let j = from
    while (j < n) {
      const c = input[j]
      if (c === " " || c === "\t" || c === "\r" || c === "\n") {
        j++
        continue
      }
      if (c === "/" && input[j + 1] === "/") {
        if (!silent) mark("comment")
        j += 2
        while (j < n && input[j] !== "\n") j++
        continue
      }
      if (c === "/" && input[j + 1] === "*") {
        if (!silent) mark("comment")
        j += 2
        while (j < n && !(input[j] === "*" && input[j + 1] === "/")) j++
        j = Math.min(n, j + 2)
        continue
      }
      break
    }
    return j
  }

  /** 读取字符串字面量并统一为双引号；未闭合时返回余下原文 */
  function readString(from: number): { text: string; next: number } {
    const quote = input[from]
    const single = quote === "'"
    if (single) mark("single")
    let j = from + 1
    let value = ""
    let closed = false
    while (j < n) {
      const ch = input[j]
      if (ch === "\\" && j + 1 < n) {
        const next = input[j + 1]
        if (single) {
          if (next === "'") {
            // JS 中 \' 即 '，写入 JSON 时保留纯字符
            value += "'"
          } else if (next === '"') {
            value += '"'
          } else {
            value += ch + next
          }
          j += 2
          continue
        }
        value += ch + next
        j += 2
        continue
      }
      if (ch === quote) {
        closed = true
        j++
        break
      }
      if (single && ch === '"') {
        value += '\\"'
        j++
        continue
      }
      value += ch
      j++
    }
    if (!closed) {
      // 字符串未闭合，交由解析器报错
      return { text: '"' + value, next: n }
    }
    return { text: `"${value}"`, next: j }
  }

  let out = ""
  let i = 0
  while (i < n) {
    i = scan(i, false)
    if (i >= n) break

    const c = input[i]
    if (c === '"' || c === "'") {
      const str = readString(i)
      out += str.text
      i = str.next
      continue
    }

    if (c === ",") {
      // 逗号后面（跳过空白和注释）如果是 } 或 ]，说明是尾随逗号，丢弃
      const target = scan(i + 1, true)
      if (target < n && (input[target] === "}" || input[target] === "]")) {
        mark("trailing")
        i = target
        continue
      }
      out += c
      i++
      continue
    }

    out += c
    i++
  }

  return { code: out, repairs }
}
