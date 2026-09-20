<template>
  <a-app>
    <a-config-provider :locale="antdLocale" :theme="themeConfig">
      <ThemeVars />
      <router-view></router-view>
    </a-config-provider>
  </a-app>
</template>

<script setup lang="ts">
import { computed, watchEffect, watch } from "vue"
import { theme } from "ant-design-vue"
import { usePreferredDark } from "@vueuse/core"
import { antdLocale, setLocale } from "@/i18n"
import { useAppStore } from "@/stores/app"
import ThemeVars from "@/components/ThemeVars.vue"

const appStore = useAppStore()
const preferredDark = usePreferredDark()

// 语言初始化与切换（持久化恢复 / 运行时切换均生效）
watch(
  () => appStore.locale,
  v => setLocale(v),
  { immediate: true }
)

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
