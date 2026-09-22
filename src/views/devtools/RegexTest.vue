<template>
  <a-card :title="t('menu.tools_regex')">
    <a-tabs v-model:activeKey="activeTab">
      <!-- ==================== 正则测试 ==================== -->
      <a-tab-pane key="test" :tab="t('tools.regex_tab_test')">
        <a-form layout="vertical">
          <a-form-item :label="t('tools.regex_pattern')">
            <a-input v-model:value="pattern" class="mono" placeholder="\\d+" allow-clear />
          </a-form-item>
          <a-form-item :label="t('tools.regex_flags')">
            <a-checkbox-group v-model:value="flags" :options="flagOptions" />
          </a-form-item>
          <a-form-item :label="t('tools.regex_text')">
            <a-textarea v-model:value="text" :rows="5" class="mono" allow-clear />
          </a-form-item>
        </a-form>

        <a-alert v-if="error" type="error" :message="error" show-banner />

        <template v-if="!error && pattern">
          <div class="flex items-center gap-2 mt-3 flex-wrap">
            <a-tag color="blue">{{ t("tools.regex_match_count") }}：{{ matches.length }}</a-tag>
            <a-button size="small" @click="copy(pattern)">{{ t("tools.regex_copy") }}</a-button>
          </div>

          <template v-if="matches.length">
            <div class="label mt-4 mb-1">{{ t("tools.regex_highlight") }}</div>
            <pre class="preview mono"><span v-html="highlighted"></span></pre>

            <div class="label mt-4 mb-1">{{ t("tools.regex_match_list") }}</div>
            <div class="rounded overflow-hidden">
              <div v-for="(m, i) in matches" :key="i" class="match-row flex items-center gap-2 px-3 py-2">
                <a-tag class="shrink-0">#{{ i + 1 }}</a-tag>
                <span class="mono flex-1 break-all">{{ m.value }}</span>
                <span v-if="m.groups.length" class="match-groups mono shrink-0">
                  {{ t("tools.regex_match_groups") }}：{{ formatGroups(m.groups) }}
                </span>
                <span class="match-index shrink-0">[{{ m.index }}]</span>
              </div>
            </div>
          </template>

          <a-empty v-else class="mt-4" :description="t('tools.regex_no_match')" />
        </template>
      </a-tab-pane>

      <!-- ==================== 常用正则 ==================== -->
      <a-tab-pane key="library" :tab="t('tools.regex_tab_library')">
        <a-input v-model:value="presetKeyword" :placeholder="t('tools.regex_search_preset')" allow-clear class="mb-4" />

        <template v-for="cat in filteredCategories" :key="cat.key">
          <div v-if="cat.presets.length" class="mb-4">
            <div class="label mb-2">{{ t(cat.labelKey) }}</div>
            <div class="preset-grid">
              <div v-for="preset in cat.presets" :key="preset.key" class="preset-card">
                <div class="flex items-center justify-between gap-2">
                  <span class="font-medium">{{ t(`tools.regex_preset_${preset.key}`) }}</span>
                  <a-space :size="4" class="shrink-0">
                    <a-button size="small" type="link" @click="usePreset(preset)">
                      {{ t("tools.regex_use") }}
                    </a-button>
                    <a-button size="small" type="link" @click="copy(preset.pattern)">
                      {{ t("tools.regex_copy") }}
                    </a-button>
                  </a-space>
                </div>
                <code class="preset-pattern mono">{{ preset.pattern }}</code>
              </div>
            </div>
          </div>
        </template>

        <a-empty v-if="!hasPresetResult" :description="t('tools.regex_no_preset')" />
      </a-tab-pane>

      <!-- ==================== 正则生成器 ==================== -->
      <a-tab-pane key="builder" :tab="t('tools.regex_tab_builder')">
        <div class="flex items-center gap-4 flex-wrap mb-3">
          <a-checkbox v-model:checked="startAnchor">{{ t("tools.regex_builder_anchor_start") }}</a-checkbox>
          <a-checkbox v-model:checked="endAnchor">{{ t("tools.regex_builder_anchor_end") }}</a-checkbox>
        </div>

        <div class="label mb-2">{{ t("tools.regex_builder_rules") }}</div>
        <div class="flex flex-col gap-2">
          <div v-for="(rule, index) in rules" :key="rule.id"
            class="rule-row flex items-center gap-2 flex-wrap p-2 rounded">
            <a-select v-model:value="rule.type" :options="typeOptions" class="rule-select" />
            <a-input v-if="rule.type === 'custom'" v-model:value="rule.value" class="rule-input mono"
              :placeholder="t('tools.regex_builder_custom_placeholder')" allow-clear />
            <a-input v-else-if="rule.type === 'literal'" v-model:value="rule.value" class="rule-input mono"
              :placeholder="t('tools.regex_builder_literal_placeholder')" allow-clear />
            <a-select v-model:value="rule.quantifier" :options="quantifierOptions" class="rule-select" />
            <template v-if="needMin(rule)">
              <a-input-number v-model:value="rule.min" :min="0" :max="999" class="rule-number" />
            </template>
            <template v-if="rule.quantifier === 'between'">
              <span class="text-secondary">~</span>
              <a-input-number v-model:value="rule.max" :min="0" :max="999" class="rule-number" />
            </template>
            <a-button type="text" danger class="ml-auto" @click="removeRule(index)">
              {{ t("tools.regex_builder_remove") }}
            </a-button>
          </div>
        </div>

        <a-button type="dashed" block class="mt-3" @click="addRule">
          + {{ t("tools.regex_builder_add") }}
        </a-button>

        <div class="label mt-4 mb-1">{{ t("tools.regex_builder_result") }}</div>
        <div class="result-box flex items-center gap-2 p-3 rounded">
          <code v-if="generated" class="mono flex-1 break-all">{{ generated }}</code>
          <span v-else class="text-secondary flex-1">{{ t("tools.regex_builder_empty") }}</span>
          <a-button size="small" :disabled="!generated" @click="copy(generated)">
            {{ t("tools.regex_copy") }}
          </a-button>
          <a-button size="small" type="primary" :disabled="!generated" @click="useGenerated">
            {{ t("tools.regex_builder_to_test") }}
          </a-button>
        </div>
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { watchDebounced } from "@vueuse/core"
import { message } from "ant-design-vue"
import { t } from "@/i18n"
import { REGEX_PRESETS, PRESET_CATEGORIES, type RegexPreset } from "./regex/presets"
import {
  buildRegex,
  type BuilderRule,
  type BuilderType,
  type QuantifierMode,
} from "./regex/builder"

defineOptions({ name: "regex" })

type TabKey = "test" | "library" | "builder"

interface MatchItem {
  value: string
  index: number
  groups: string[]
}

const activeTab = ref<TabKey>("test")

/* ------------------------------ 正则测试 ------------------------------ */
const pattern = ref("")
const text = ref("")
const flags = ref<string[]>(["g"])
const matches = ref<MatchItem[]>([])
const highlighted = ref("")
const error = ref("")

const flagOptions = computed(() =>
  ["g", "i", "m", "s", "u"].map((value) => ({ value, label: t(`tools.regex_flag_${value}`) }))
)

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
}

function formatGroups(groups: string[]): string {
  return groups.map((g) => (g === "" ? t("tools.regex_group_empty") : g)).join(" | ")
}

function runTest() {
  matches.value = []
  highlighted.value = ""
  error.value = ""
  if (!pattern.value) return

  let re: RegExp
  try {
    re = new RegExp(pattern.value, flags.value.join(""))
  } catch (e: any) {
    error.value = e.message
    return
  }

  const source = text.value
  const ranges: MatchItem[] = []

  if (re.global) {
    let m: RegExpExecArray | null
    let guard = 0
    while ((m = re.exec(source)) !== null) {
      // 空匹配时手动推进，避免死循环
      if (m[0] === "") {
        re.lastIndex++
        if (re.lastIndex > source.length) break
        continue
      }
      ranges.push({ value: m[0], index: m.index, groups: m.slice(1).map((g) => g ?? "") })
      if (++guard > 10000) break
    }
  } else {
    const m = re.exec(source)
    if (m) ranges.push({ value: m[0], index: m.index, groups: m.slice(1).map((g) => g ?? "") })
  }

  matches.value = ranges

  // 构造高亮片段
  const parts: string[] = []
  let cursor = 0
  for (const r of ranges) {
    parts.push(escapeHtml(source.slice(cursor, r.index)))
    parts.push(`<mark>${escapeHtml(r.value)}</mark>`)
    cursor = r.index + r.value.length
  }
  parts.push(escapeHtml(source.slice(cursor)))
  highlighted.value = parts.join("")
}

watchDebounced([pattern, text, flags], runTest, { debounce: 200, immediate: true })

/* ------------------------------ 常用正则 ------------------------------ */
const presetKeyword = ref("")

const filteredCategories = computed(() => {
  const keyword = presetKeyword.value.trim().toLowerCase()
  return PRESET_CATEGORIES.map((cat) => ({
    ...cat,
    presets: REGEX_PRESETS.filter((preset) => {
      if (preset.category !== cat.key) return false
      if (!keyword) return true
      const name = t(`tools.regex_preset_${preset.key}`).toLowerCase()
      return name.includes(keyword) || preset.pattern.toLowerCase().includes(keyword)
    }),
  }))
})

const hasPresetResult = computed(() => filteredCategories.value.some((cat) => cat.presets.length))

function usePreset(preset: RegexPreset) {
  pattern.value = preset.pattern
  flags.value = (preset.flags ?? "g").split("")
  text.value = preset.sample ?? ""
  activeTab.value = "test"
}

/* ------------------------------ 正则生成器 ------------------------------ */
const startAnchor = ref(true)
const endAnchor = ref(true)

let ruleSeed = 0
function createRule(partial: Partial<BuilderRule> = {}): BuilderRule {
  return {
    id: ++ruleSeed,
    type: "digit",
    value: "",
    quantifier: "oneMore",
    min: 1,
    max: 10,
    ...partial,
  }
}

const rules = ref<BuilderRule[]>([createRule()])

const typeOptions = computed<{ value: BuilderType; label: string }[]>(() => [
  { value: "digit", label: t("tools.regex_type_digit") },
  { value: "letter", label: t("tools.regex_type_letter") },
  { value: "letterUpper", label: t("tools.regex_type_letter_upper") },
  { value: "letterLower", label: t("tools.regex_type_letter_lower") },
  { value: "chinese", label: t("tools.regex_type_chinese") },
  { value: "word", label: t("tools.regex_type_word") },
  { value: "any", label: t("tools.regex_type_any") },
  { value: "space", label: t("tools.regex_type_space") },
  { value: "custom", label: t("tools.regex_type_custom") },
  { value: "literal", label: t("tools.regex_type_literal") },
])

const quantifierOptions = computed<{ value: QuantifierMode; label: string }[]>(() => [
  { value: "one", label: t("tools.regex_quant_one") },
  { value: "optional", label: t("tools.regex_quant_optional") },
  { value: "zeroMore", label: t("tools.regex_quant_zero_more") },
  { value: "oneMore", label: t("tools.regex_quant_one_more") },
  { value: "exactly", label: t("tools.regex_quant_exactly") },
  { value: "between", label: t("tools.regex_quant_between") },
  { value: "atLeast", label: t("tools.regex_quant_at_least") },
])

const generated = computed(() =>
  buildRegex(rules.value, { startAnchor: startAnchor.value, endAnchor: endAnchor.value })
)

function needMin(rule: BuilderRule): boolean {
  return rule.quantifier === "exactly" || rule.quantifier === "between" || rule.quantifier === "atLeast"
}

function addRule() {
  rules.value.push(createRule({ type: "digit", quantifier: "oneMore" }))
}

function removeRule(index: number) {
  rules.value.splice(index, 1)
}

function useGenerated() {
  pattern.value = generated.value
  text.value = ""
  activeTab.value = "test"
}

/* ------------------------------ 通用 ------------------------------ */
async function copy(content?: string) {
  if (!content) return
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(content)
    } else {
      const textarea = document.createElement("textarea")
      textarea.value = content
      textarea.style.position = "fixed"
      textarea.style.opacity = "0"
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
    }
    message.success(t("tools.regex_copied"))
  } catch {
    message.error(t("tools.regex_copy_failed"))
  }
}
</script>

<style scoped>
.label {
  color: var(--text-secondary, rgba(0, 0, 0, 0.45));
  font-size: 13px;
}

.mono {
  font-family: "JetBrains Mono", "Cascadia Code", Consolas, monospace;
}

.text-secondary {
  color: var(--text-secondary, rgba(0, 0, 0, 0.45));
}

.preview {
  margin: 0;
  padding: 12px;
  border-radius: 6px;
  background-color: var(--hover-bg);
  white-space: pre-wrap;
  word-break: break-all;
  font-size: 13px;
  line-height: 1.7;
}

.preview :deep(mark) {
  padding: 0 1px;
  border-radius: 2px;
  color: #fff;
  background-color: var(--primary-color, #1677ff);
}

.match-row {
  background-color: var(--hover-bg);
}

.match-row+.match-row {
  border-top: 1px solid rgba(128, 128, 128, 0.15);
}

.match-groups,
.match-index {
  font-size: 12px;
  color: var(--text-secondary, rgba(0, 0, 0, 0.45));
}

.preset-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 8px;
}

.preset-card {
  padding: 10px 12px;
  border-radius: 6px;
  background-color: var(--hover-bg);
}

.preset-pattern {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  word-break: break-all;
  color: var(--text-secondary, rgba(0, 0, 0, 0.45));
}

.rule-row {
  background-color: var(--hover-bg);
}

.rule-select {
  width: 160px;
}

.rule-input {
  width: 240px;
  flex: 1;
  min-width: 180px;
}

.rule-number {
  width: 88px;
}

.result-box {
  background-color: var(--hover-bg);
}
</style>
