<template>
  <a-card title="JSON 格式化">
    <a-typography-paragraph type="secondary">
      计数器测试 KeepAlive 缓存：{{ visits }}
      <a-button size="small" class="ml-2" @click="visits++">+1</a-button>
    </a-typography-paragraph>
    <a-textarea v-model:value="input" :rows="8" placeholder="输入 JSON 字符串" />
    <a-button type="primary" class="mt-3" :disabled="!input" @click="format">格式化</a-button>
    <a-alert v-if="error" class="mt-3" type="error" :message="error" show-banner />
    <pre v-if="output" class="output p-3 mt-3 rounded">{{ output }}</pre>
  </a-card>
</template>

<script setup lang="ts">
import { ref } from "vue"

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
