<template>
  <a-card title="正则测试">
    <a-typography-paragraph type="secondary">
      KeepAlive 计数：{{ count }} <a-button size="small" class="ml-2" @click="count++">+1</a-button>
    </a-typography-paragraph>
    <a-form layout="vertical">
      <a-form-item label="正则表达式">
        <a-input v-model:value="pattern" placeholder="例如：\\d+" />
      </a-form-item>
      <a-form-item label="测试文本">
        <a-textarea v-model:value="text" :rows="4" />
      </a-form-item>
      <a-button type="primary" :disabled="!pattern" @click="test">执行匹配</a-button>
    </a-form>
    <a-alert v-if="error" class="mt-3" type="error" :message="error" show-banner />
    <a-tag v-for="(m, i) in matches" :key="i" class="mt-3">{{ m }}</a-tag>
  </a-card>
</template>

<script setup lang="ts">
import { ref } from "vue"

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
