<template>
  <a-dropdown placement="bottomRight">
    <span class="lang-trigger flex-center px-2 cursor-pointer" :title="t('setting.language')">
      <GlobalOutlined class="text-base" />
    </span>
    <template #overlay>
      <a-menu :selected-keys="[appStore.locale]">
        <a-menu-item v-for="opt in SUPPORTED" :key="opt.value" @click="switchLocale(opt.value)">
          <span class="flex items-center justify-between min-w-120px">
            <span>{{ opt.label }}</span>
            <CheckOutlined v-if="appStore.locale === opt.value" />
          </span>
        </a-menu-item>
      </a-menu>
    </template>
  </a-dropdown>
</template>

<script setup lang="ts">
import { GlobalOutlined, CheckOutlined } from "@ant-design/icons-vue"
import { useAppStore } from "@/stores/app"
import { SUPPORTED } from "@/i18n/locales"
import { t } from "@/i18n"

const appStore = useAppStore()

function switchLocale(locale: string) {
  appStore.setLocale(locale)
}
</script>

<style scoped>
.lang-trigger {
  height: 32px;
  border-radius: 6px;
  color: var(--text-color);
  transition: background-color 0.2s ease;
}
</style>
