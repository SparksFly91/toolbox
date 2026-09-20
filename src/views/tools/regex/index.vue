<template>
  <a-card :title="t('menu.tools_regex')">
    <a-typography-paragraph type="secondary">
      {{ t("tools.keepalive_hint") }}：{{ count }}
      <a-button size="small" class="ml-2" @click="count++">+1</a-button>
    </a-typography-paragraph>
    <a-form layout="vertical">
      <a-form-item :label="t('tools.regex_pattern')">
        <a-input v-model:value="pattern" placeholder="\\d+" />
      </a-form-item>
      <a-form-item :label="t('tools.regex_text')">
        <a-textarea v-model:value="text" :rows="4" />
      </a-form-item>
      <a-button type="primary" :disabled="!pattern" @click="test">
        {{ t("tools.regex_execute") }}
      </a-button>
    </a-form>
    <a-alert v-if="error" class="mt-3" type="error" :message="error" show-banner />
    <a-tag v-for="(m, i) in matches" :key="i" class="mt-3">{{ m }}</a-tag>
  </a-card>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { t } from "@/i18n"

defineOptions({ name: "regex" })

const pattern = ref("")
const text = ref("")
const matches = ref<string[]>([])
const error = ref("")
const count = ref(0)

function test() {
  try {
    const re = new RegExp(pattern.value, "g")
    matches.value = text.value.match(re) ?? []
    error.value = ""
  } catch (e: any) {
    error.value = e.message
    matches.value = []
  }
}
</script>
