<template>
  <header class="app-header flex-between" :class="{ 'is-top': top }">
    <div class="header-left flex-center">
      <AppLogo v-if="top" class="header-logo" />
      <MenuUnfoldOutlined v-if="!top" class="trigger text-lg px-3 cursor-pointer"
        :class="{ 'rotate-180': appStore.siderCollapsed }" @click="appStore.toggleSider()" />
      <AppBreadcrumb v-if="!top && appStore.showBreadcrumb" />
      <AppMenu v-if="top" mode="horizontal" class="f-1" />
    </div>
    <div class="header-right flex-center gap-1">
      <AppSearch />
      <AppThemeToggle />
      <a-tooltip :title="t('menu.settings')">
        <span class="header-action flex-center" @click="router.push('/settings')">
          <SettingOutlined class="text-base" />
        </span>
      </a-tooltip>
      <AppLanguage />
    </div>
  </header>
</template>

<script setup lang="ts">
import { MenuUnfoldOutlined, SettingOutlined } from "@ant-design/icons-vue"
import { useRouter } from "vue-router"
import { useAppStore } from "@/stores/app"
import { t } from "@/i18n"
import AppLogo from "./AppLogo.vue"
import AppMenu from "./AppMenu.vue"
import AppBreadcrumb from "./AppBreadcrumb.vue"
import AppLanguage from "./AppLanguage.vue"
import AppThemeToggle from "./AppThemeToggle.vue"
import AppSearch from "./AppSearch.vue"

withDefaults(defineProps<{ top?: boolean }>(), { top: false })

const appStore = useAppStore()
const router = useRouter()
</script>

<style lang="scss" scoped>
@use "@/assets/theme/_variables.scss" as *;

.app-header {
  height: $header-height;
  padding-inline: 0 12px;
  background-color: var(--bg-container);

  &.is-top {
    border-bottom: 1px solid var(--split-color);
    padding-inline: 16px;
  }

  .header-logo {
    width: $sider-width;
  }

  .f-1 {
    flex: 1;
    min-width: 0;
    margin-inline-start: 24px;
    border-block-end: none;
  }

  .trigger:hover {
    color: var(--primary-color);
  }

  .header-action {
    width: 32px;
    height: 32px;
    border-radius: 6px;
    color: var(--text-color);
    cursor: pointer;
    transition: background-color 0.2s ease, color 0.2s ease;

    &:hover {
      color: var(--primary-color);
      background-color: var(--hover-bg);
    }
  }
}
</style>
