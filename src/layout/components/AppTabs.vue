<template>
  <div class="app-tabs" :class="[`style-${appStore.tabStyle}`]">
    <div class="tabs-scroll flex items-center">
      <div v-for="tab in tabStore.tabs" :key="tab.path" class="tab-item flex-center gap-1 cursor-pointer select-none"
        :class="{ 'is-active': tab.path === route.path }" @click="router.push(tab.path)"
        @contextmenu.prevent="openContextMenu($event, tab)">
        <span>{{ tabLabel(tab) }}</span>
        <CloseOutlined v-if="!tab.affix" class="tab-close text-xs" @click.stop="closeTab(tab.path)" />
      </div>
    </div>

    <Teleport to="body">
      <div v-if="ctxMenu.visible" class="ctx-menu" :style="{ left: `${ctxMenu.x}px`, top: `${ctxMenu.y}px` }"
        @click.stop>
        <div class="ctx-item" @click="ctxAction('close')">{{ t("common.closeCurrent") }}</div>
        <div class="ctx-item" @click="ctxAction('closeOther')">{{ t("common.closeOther") }}</div>
        <div class="ctx-item" @click="ctxAction('closeAll')">{{ t("common.closeAll") }}</div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { reactive, computed, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import { CloseOutlined } from "@ant-design/icons-vue"
import { useAppStore } from "@/stores/app"
import { useTabStore, HOME_PATH } from "@/stores/tab"
import { t } from "@/i18n"
import type { TabItem } from "@/types"

const route = useRoute()
const router = useRouter()
const appStore = useAppStore()
const tabStore = useTabStore()

watch(
  () => route.path,
  path => {
    const meta = route.meta as { titleKey?: string; affix?: boolean }
    if (!meta?.titleKey || route.name === "not-found") return
    tabStore.addTab({
      path,
      name: String(route.name),
      titleKey: meta.titleKey,
      affix: meta.affix ?? path === HOME_PATH,
    })
  },
  { immediate: true }
)

/** 路由 name → titleKey 映射（兼容旧持久化数据中无 titleKey 的标签） */
const titleKeyMap = computed<Record<string, string>>(() => {
  const map: Record<string, string> = {}
  const walk = (routes: readonly any[]) =>
    routes.forEach(r => {
      if (r.meta?.titleKey && r.name) map[String(r.name)] = String(r.meta.titleKey)
      if (r.children?.length) walk(r.children)
    })
  walk(router.options.routes)
  return map
})

function tabLabel(tab: TabItem): string {
  return t(tab.titleKey ?? titleKeyMap.value[tab.name] ?? tab.name)
}

function closeTab(path: string) {
  const index = tabStore.tabs.findIndex(t => t.path === path)
  const removed = tabStore.removeTab(path)
  if (removed && path === route.path) {
    router.push(tabStore.tabs[index - 1]?.path ?? tabStore.tabs[index]?.path ?? HOME_PATH)
  }
}

const ctxMenu = reactive({
  visible: false,
  x: 0,
  y: 0,
  target: null as TabItem | null,
})

function openContextMenu(e: MouseEvent, tab: TabItem) {
  ctxMenu.visible = true
  ctxMenu.x = e.clientX
  ctxMenu.y = e.clientY
  ctxMenu.target = tab
}

function ctxAction(action: "close" | "closeOther" | "closeAll") {
  const tab = ctxMenu.target
  ctxMenu.visible = false
  if (!tab) return
  if (action === "close") {
    closeTab(tab.path)
  } else if (action === "closeOther") {
    tabStore.closeOther(tab.path)
    if (route.path !== tab.path) router.push(tab.path)
  } else {
    const target = tabStore.closeAll()
    if (route.path !== target) router.push(target)
  }
}

function closeContextMenu() {
  ctxMenu.visible = false
}

window.addEventListener("click", closeContextMenu)
</script>

<style lang="scss" scoped>
@use "@/assets/theme/_variables.scss" as *;

.app-tabs {
  height: $tabs-height;
  background-color: var(--bg-container);
  border-block: 1px solid var(--split-color);
}

.tabs-scroll {
  height: 100%;
  padding-inline: 8px;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
}

.tab-item {
  padding: 0 12px;
  height: 24px;
  margin-block: auto;
  white-space: nowrap;
  border-radius: 3px;
  color: var(--text-color);
  transition: all 0.2s ease;

  &:hover {
    background-color: var(--hover-bg);
  }

  &.is-active {
    color: var(--primary-color);
    background-color: var(--hover-bg);
  }

  .tab-close {
    margin-inline-end: 2px;
    border-radius: 2px;

    &:hover {
      color: var(--bg-container);
      background-color: var(--primary-color);
    }
  }
}

/* chip 圆角样式 */
.style-chip {
  .tab-item {
    height: 26px;
    border-radius: 13px;
    padding-inline: 14px;

    &.is-active {
      background-color: var(--primary-color);
      color: var(--bg-container);
    }
  }
}

/* card 卡片样式 */
.style-card {
  .tab-item {
    height: $tabs-height - 1px;
    border-radius: 0;
    position: relative;

    &.is-active {
      background-color: var(--bg-layout);

      &::after {
        content: "";
        position: absolute;
        inset-block-end: 0;
        inset-inline: 0;
        height: 2px;
        background-color: var(--primary-color);
      }
    }
  }
}

.ctx-menu {
  position: fixed;
  z-index: 1000;
  min-width: 110px;
  padding: 4px;
  background-color: var(--bg-container);
  border: 1px solid var(--split-color);
  border-radius: 6px;
  box-shadow: 0 3px 8px rgb(0 0 0 / 12%);

  .ctx-item {
    padding: 5px 12px;
    border-radius: 4px;
    color: var(--text-color);

    &:hover {
      background-color: var(--hover-bg);
    }
  }
}
</style>
