<template>
    <a-card :title="t('menu.tools_base_converter')">
        <!-- 输入区 -->
    <div class="selectors flex items-start gap-3 mb-3">
      <div class="flex-1 min-w-0">
        <div class="label mb-1">{{ t("tools.base_from") }}</div>
        <a-radio-group v-model:value="fromBase" size="small" :options="commonRadioOptions" />
        <a-select v-model:value="fromBase" :options="baseOptions" class="w-full mt-2" />
      </div>
      <a-button class="swap-btn" :title="t('tools.base_swap')" @click="swap">⇄</a-button>
      <div class="flex-1 min-w-0">
        <div class="label mb-1">{{ t("tools.base_to") }}</div>
        <a-radio-group v-model:value="toBase" size="small" :options="commonRadioOptions" />
        <a-select v-model:value="toBase" :options="baseOptions" class="w-full mt-2" />
      </div>
    </div>

        <a-textarea v-model:value="value" :rows="3" allow-clear class="mono" :placeholder="inputPlaceholder" />

        <a-alert v-if="error" class="mt-3" type="error" :message="error" show-banner />

        <!-- 转换结果 -->
        <template v-if="result">
            <div class="label mt-4 mb-1">{{ t("tools.base_result") }}（{{ baseName(toBase) }}）</div>
            <div class="result-box flex items-start gap-2 p-3 mt-1 rounded">
                <span class="mono result-text flex-1 break-all">{{ result }}</span>
                <a-button size="small" @click="copy(result)">{{ t("tools.base_copy") }}</a-button>
            </div>
        </template>

        <!-- 常用进制一览 -->
        <template v-if="value.trim() && !error">
            <div class="label mt-4 mb-1">{{ t("tools.base_all") }}</div>
            <div class="rounded overflow-hidden">
                <div v-for="base in panelBases" :key="base" class="panel-row flex items-center gap-2 px-3 py-2">
                    <span class="panel-label shrink-0">{{ baseName(base) }}</span>
                    <span class="mono flex-1 break-all">{{ panelResults[base] ?? "--" }}</span>
                    <a-button size="small" type="text" class="panel-copy" @click="copy(panelResults[base])">
                        {{ t("tools.base_copy") }}
                    </a-button>
                </div>
            </div>
        </template>
    </a-card>
</template>

<script setup lang="ts">
import { watchDebounced } from "@vueuse/core"
import { message } from "ant-design-vue"
import { t } from "@/i18n"
import DevToolsApi from "@/api/devTools"

defineOptions({ name: "base-converter" })

/** 常用进制一览面板展示的进制 */
const panelBases = [2, 8, 10, 16, 32, 36]

const fromBase = ref(2)
const toBase = ref(10)
const value = ref("")
const result = ref("")
const error = ref("")
const panelResults = ref<Record<number, string>>({})
const converting = ref(false)

/** 2-36 全部进制选项 */
const baseOptions = computed(() =>
  Array.from({ length: 35 }, (_, i) => {
    const base = i + 2
    return { value: base, label: baseName(base, true) }
  })
)

/** 常见进制单选（2/8/10/16），与下拉列表绑定同一模型 */
const commonRadioOptions = computed(() =>
  [2, 8, 10, 16].map(base => ({ value: base, label: baseName(base, true) }))
)

/** 进制名称（2/8/10/16 有固定名称，其余按 N 进制显示） */
function baseName(base: number, withNumber = false): string {
    const named = [2, 8, 10, 16, 32, 36]
    if (named.includes(base)) return t(`tools.base_name_${base}`)
    return withNumber ? `${base} ${t("tools.base_other")}` : `Base ${base}`
}

const inputPlaceholder = computed(() =>
    t("tools.base_input_placeholder", { base: fromBase.value })
)

function swap() {
  ;[fromBase.value, toBase.value] = [toBase.value, fromBase.value]
}

/** N 进制（2-36）允许的字符说明，如 16 → "0-9, a-f" */
function validCharsOf(base: number): string {
  if (base <= 10) return `0-${base - 1}`
  return `0-9, a-${String.fromCharCode(87 + base)}` // 'a' + (base - 11)
}

/** 前端预校验：是否是合法的 from_base 进制数字 */
function validate(val: string, base: number): boolean {
  const digits = val.startsWith("-") ? val.slice(1) : val
  if (!digits) return false
  const re = new RegExp(`^[0-9a-z]+$`, "i")
  if (!re.test(digits)) return false
  const maxChar = base - 1 <= 9 ? String(base - 1) : String.fromCharCode(87 + base)
  return !Array.from(digits.toLowerCase()).some(c => c > maxChar)
}

/** 并发序号，防止乱序响应覆盖新结果 */
let seq = 0

/** 调用后端完成主转换，并刷新常用进制一览 */
async function convert() {
    const mySeq = ++seq
    error.value = ""

    const val = value.value.trim()
    if (!val) {
        result.value = ""
        panelResults.value = {}
        return
    }

  converting.value = true
  if (!validate(val, fromBase.value)) {
    error.value = t("tools.base_invalid", {
      base: baseName(fromBase.value),
      chars: validCharsOf(fromBase.value)
    })
    result.value = ""
    panelResults.value = {}
    converting.value = false
    return
  }
  try {
        const res = await DevToolsApi.baseConverter(fromBase.value, toBase.value, val)
        if (mySeq !== seq) return
        if (res.success) {
            result.value = res.data
        } else {
            error.value = res.msg
            result.value = ""
            return
        }
    } catch (e: any) {
        if (mySeq !== seq) return
        error.value = typeof e === "string" ? e : e?.message ?? String(e)
        result.value = ""
        panelResults.value = {}
        return
    } finally {
        if (mySeq === seq) converting.value = false
    }

    // 常用进制一览：并行请求除目标进制之外的进制
    const entries = await Promise.all(
        panelBases
            .filter((base) => base !== toBase.value)
            .map(async (base) => {
                try {
                    const r = await DevToolsApi.baseConverter(fromBase.value, base, val)
                    return [base, r.success ? r.data : null] as const
                } catch {
                    return [base, null] as const
                }
            })
    )
    if (mySeq !== seq) return
    const next: Record<number, string> = {}
    for (const [base, val2] of entries) {
        if (val2 !== null) next[base] = val2
    }
    next[toBase.value] = result.value
    panelResults.value = next
}

watchDebounced([fromBase, toBase, value], convert, { debounce: 200, immediate: true })

/** 复制到剪贴板（优先 Clipboard API，失败降级 execCommand） */
async function copy(text?: string) {
    if (!text) return
    try {
        if (navigator.clipboard?.writeText) {
            await navigator.clipboard.writeText(text)
        } else {
            const textarea = document.createElement("textarea")
            textarea.value = text
            textarea.style.position = "fixed"
            textarea.style.opacity = "0"
            document.body.appendChild(textarea)
            textarea.select()
            document.execCommand("copy")
            document.body.removeChild(textarea)
        }
        message.success(t("tools.base_copied"))
    } catch {
        message.error(t("tools.base_copy_failed"))
    }
}
</script>

<style scoped>
.label {
    color: var(--text-secondary-color, rgba(0, 0, 0, 0.45));
    font-size: 13px;
}

.mono {
    font-family: "JetBrains Mono", "Cascadia Code", Consolas, monospace;
}

.result-box {
    background-color: var(--hover-bg);
}

.result-text {
    font-size: 15px;
    line-height: 1.6;
}

.panel-row {
    background-color: var(--hover-bg);
}

.panel-row+.panel-row {
    border-top: 1px solid rgba(128, 128, 128, 0.15);
}

.panel-label {
    width: 88px;
    font-size: 13px;
    color: var(--text-secondary-color, rgba(0, 0, 0, 0.45));
}

.panel-copy {
    opacity: 0;
    transition: opacity 0.2s;
}

.panel-row:hover .panel-copy {
    opacity: 1;
}

.swap-btn {
  margin-top: 56px;
}
</style>
