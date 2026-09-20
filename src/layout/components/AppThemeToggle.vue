<template>
  <a-tooltip :title="tooltipTitle">
    <span class="header-action flex-center" @click="toggle">
      <Transition name="theme-swap" mode="out-in">
        <BulbFilled v-if="isDark" key="dark" class="text-base" />
        <BulbOutlined v-else key="light" class="text-base" />
      </Transition>
    </span>
  </a-tooltip>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { BulbOutlined, BulbFilled } from "@ant-design/icons-vue"
import { usePreferredDark } from "@vueuse/core"
import { useAppStore } from "@/stores/app"
import { t } from "@/i18n"

const appStore = useAppStore()
const preferredDark = usePreferredDark()

const isDark = computed(
  () => appStore.themeMode === "dark" || (appStore.themeMode === "auto" && preferredDark.value)
)

const tooltipTitle = computed(() =>
  t(isDark.value ? "app.theme_toggle_light" : "app.theme_toggle_dark")
)

function toggle() {
  appStore.update({ themeMode: isDark.value ? "light" : "dark" })
}
</script>

<style scoped>
.header-action {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  color: var(--text-color);
  cursor: pointer;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.header-action:hover {
  color: var(--primary-color);
  background-color: var(--hover-bg);
}

.theme-swap-enter-active,
.theme-swap-leave-active {
  transition: transform 0.25s ease, opacity 0.2s ease;
}
.theme-swap-enter-from {
  transform: rotate(-90deg) scale(0.6);
}
.theme-swap-leave-to {
  transform: rotate(90deg) scale(0.6);
  opacity: 0;
}
</style>
