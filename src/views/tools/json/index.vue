<template>
  <a-card :title="t('menu.tools_json')">
    <a-typography-paragraph type="secondary">
      {{ t("tools.keepalive_hint") }}：{{ visits }}
      <a-button size="small" class="ml-2" @click="visits++">+1</a-button>
    </a-typography-paragraph>
    <a-textarea v-model:value="input" :rows="8" :placeholder="t('tools.json_input_placeholder')" />
    <a-button type="primary" class="mt-3" :disabled="!input" @click="format">
      {{ t("tools.json_format_btn") }}
    </a-button>
    <a-alert v-if="error" class="mt-3" type="error" :message="error" show-banner />
    <pre v-if="output" class="output p-3 mt-3 rounded">{{ output }}</pre>
  </a-card>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { t } from "@/i18n"

defineOptions({ name: "json" })

const input = ref("")
const output = ref("")
const error = ref("")
const visits = ref(0)

function format() {
  try {
    output.value = JSON.stringify(JSON.parse(input.value), null, 2)
    error.value = ""
  } catch (e: any) {
    error.value = e.message
    output.value = ""
  }
}
</script>

<style scoped>
.output {
  background-color: var(--hover-bg);
  white-space: pre-wrap;
  word-break: break-all;
}
</style>
