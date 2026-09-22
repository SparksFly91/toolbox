<template>
  <a-card :title="t('menu.tools_json')">
    <a-textarea v-model:value="input" :rows="8" :placeholder="t('tools.json_input_placeholder')" />
    <a-button type="primary" class="mt-3" :disabled="!input" @click="format">
      {{ t("tools.json_format_btn") }}
    </a-button>
    <a-alert v-if="repairs.length" class="mt-3" type="warning" :message="t('tools.json_repair_title')">
      <template #description>
        <ul class="repair-list pl-4 my-0">
          <li v-for="key in repairs" :key="key">{{ t(`tools.json_repair_${key}`) }}</li>
        </ul>
      </template>
    </a-alert>
    <a-alert v-if="error" class="mt-3" type="error" :message="error" show-banner />
    <pre v-if="output" class="output p-3 mt-3 rounded">{{ output }}</pre>
  </a-card>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { t } from "@/i18n"
import { repairJson, type JsonRepairKey } from "@/utils/jsonRepair"

defineOptions({ name: "json" })

const input = ref("")
const output = ref("")
const error = ref("")
const repairs = ref<JsonRepairKey[]>([])

function format() {
  const raw = input.value
  let parsed: unknown

  try {
    parsed = JSON.parse(raw)
    repairs.value = []
  } catch {
    // 非严格 JSON：先修复一类常见错误再解析（尾随逗号、注释、单引号字符串）
    const repaired = repairJson(raw)
    try {
      parsed = JSON.parse(repaired.code)
      repairs.value = repaired.repairs
    } catch (e: any) {
      error.value = e?.message ?? String(e)
      output.value = ""
      repairs.value = []
      return
    }
  }

  output.value = JSON.stringify(parsed, null, 2)
  error.value = ""
}
</script>

<style scoped>
.output {
  background-color: var(--hover-bg);
  white-space: pre-wrap;
  word-break: break-all;
}

.repair-list {
  margin: 0;
}
</style>
