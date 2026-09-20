<template>
  <header class="app-header flex-between" :class="{ 'is-top': top }">
    <div class="header-left flex-center">
      <AppLogo v-if="top" class="header-logo" />
      <MenuUnfoldOutlined
        v-if="!top"
        class="trigger text-lg px-3 cursor-pointer"
        :class="{ 'rotate-180': appStore.siderCollapsed }"
        @click="appStore.toggleSider()"
      />
      <AppBreadcrumb v-if="!top && appStore.showBreadcrumb" />
      <AppMenu v-if="top" mode="horizontal" class="f-1" />
    </div>
    <div class="header-right flex-center">
      <AppLanguage />
    </div>
  </header>
</template>

<script setup lang="ts">
import { MenuUnfoldOutlined } from "@ant-design/icons-vue"
import { useAppStore } from "@/stores/app"
import AppLogo from "./AppLogo.vue"
import AppMenu from "./AppMenu.vue"
import AppBreadcrumb from "./AppBreadcrumb.vue"
import AppLanguage from "./AppLanguage.vue"

withDefaults(defineProps<{ top?: boolean }>(), { top: false })

const appStore = useAppStore()
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
}
</style>
