<template>
  <a-layout class="layout" :class="{ 'is-top': isTop }">
    <template v-if="!isTop">
      <div
        class="layout-sider"
        :class="{ 'is-collapsed': appStore.siderCollapsed }"
        :style="{ backgroundColor: token.colorBgContainer }"
      >
        <AppLogo :collapsed="appStore.siderCollapsed" />
        <AppMenu mode="inline" class="sider-menu" />
      </div>      <div class="layout-main" :class="{ 'is-collapsed': appStore.siderCollapsed }">
        <AppHeader />
        <AppTabs v-if="appStore.showTabs" />
        <main class="layout-content">
          <RouterView v-slot="{ Component }">
            <Transition name="fade-slide" mode="out-in">
              <KeepAlive :include="tabStore.cachedViews">
                <component :is="Component" />
              </KeepAlive>
            </Transition>
          </RouterView>
        </main>
      </div>
    </template>

    <template v-else>
      <AppHeader top />
      <div class="layout-main">
        <div v-if="appStore.showBreadcrumb" class="breadcrumb-bar">
          <AppBreadcrumb />
        </div>
        <AppTabs v-if="appStore.showTabs" />
        <main class="layout-content">
          <RouterView v-slot="{ Component }">
            <Transition name="fade-slide" mode="out-in">
              <KeepAlive :include="tabStore.cachedViews">
                <component :is="Component" />
              </KeepAlive>
            </Transition>
          </RouterView>
        </main>
      </div>
    </template>

    <SettingDrawer />
  </a-layout>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { theme } from "ant-design-vue"
import { useAppStore } from "@/stores/app"
import { useTabStore } from "@/stores/tab"
import AppLogo from "./components/AppLogo.vue"
import AppMenu from "./components/AppMenu.vue"
import AppHeader from "./components/AppHeader.vue"
import AppBreadcrumb from "./components/AppBreadcrumb.vue"
import AppTabs from "./components/AppTabs.vue"
import SettingDrawer from "./components/SettingDrawer.vue"
import "./index.scss"

const appStore = useAppStore()
const tabStore = useTabStore()
const { token } = theme.useToken()

const isTop = computed(() => appStore.layoutMode === "top")

</script>

<style lang="scss" scoped>
/* 主内容区是唯一滚动容器（父级 .layout / .layout-main 已锁定视口高度） */
.layout-content {
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 12px;
  background-color: var(--bg-layout);
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(12px);
}
</style>
