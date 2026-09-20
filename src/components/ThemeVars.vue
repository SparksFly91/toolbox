<template>
  <span class="hidden"></span>
</template>

<script setup lang="ts">
import { watchEffect } from "vue"
import { theme } from "ant-design-vue"
import { useAppStore } from "@/stores/app"

const appStore = useAppStore()
const { token } = theme.useToken()

watchEffect(() => {
  const style = document.documentElement.style
  style.setProperty("--bg-layout", token.value.colorBgLayout)
  style.setProperty("--bg-container", token.value.colorBgContainer)
  style.setProperty("--text-color", token.value.colorText)
  style.setProperty("--text-secondary", token.value.colorTextSecondary)
  style.setProperty("--split-color", token.value.colorSplit)
  style.setProperty("--hover-bg", token.value.controlItemBgHover)
  style.setProperty("--primary-color", appStore.primaryColor)
})
</script>
