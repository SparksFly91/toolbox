<template>
  <a-app>
    <a-config-provider :locale="zhCN" :theme="themeConfig">
      <ThemeVars />
      <router-view></router-view>
    </a-config-provider>
  </a-app>
</template>

<script setup lang="ts">
import { computed, watchEffect } from "vue"
import { theme } from "ant-design-vue"
import { usePreferredDark } from "@vueuse/core"
import zhCN from "ant-design-vue/es/locale/zh_CN"
import { useAppStore } from "@/stores/app"
import ThemeVars from "@/components/ThemeVars.vue"

const appStore = useAppStore()
const preferredDark = usePreferredDark()

const isDark = computed(
  () => appStore.themeMode === "dark" || (appStore.themeMode === "auto" && preferredDark.value)
)

watchEffect(() => {
  document.documentElement.classList.toggle("dark", isDark.value)
})

const themeConfig = computed(() => ({
  token: { colorPrimary: appStore.primaryColor },
  algorithm: isDark.value ? theme.darkAlgorithm : theme.defaultAlgorithm,
}))
</script>

<style scoped></style>
