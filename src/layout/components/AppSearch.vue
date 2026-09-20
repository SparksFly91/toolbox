<template>
  <a-popover
    v-model:open="open"
    trigger="click"
    placement="bottomRight"
    :arrow="false"
    overlay-class-name="app-search-overlay"
  >
    <template #content>
      <div class="search-panel">
        <a-input
          ref="inputRef"
          v-model:value="keyword"
          :placeholder="t('app.search_placeholder')"
          allow-clear
          @keydown.esc="open = false"
        >
          <template #prefix><SearchOutlined /></template>
        </a-input>
        <div class="result-list">
          <template v-if="results.length">
            <div
              v-for="item in results"
              :key="item.path"
              class="result-item flex-between"
              :class="{ 'is-active': route.path === item.path }"
              @click="go(item.path)"
            >
              <span class="flex items-center gap-2">
                <component :is="iconComp(item.icon)" />
                <span>{{ t(item.titleKey) }}</span>
              </span>
              <span class="result-path">{{ item.path }}</span>
            </div>
          </template>
          <div v-else class="result-empty text-center text-secondary py-4">No results / 暂无结果</div>
        </div>
      </div>
    </template>
    <a-tooltip :title="t('app.search_placeholder')">
      <span class="header-action flex-center">
        <SearchOutlined class="text-base" />
      </span>
    </a-tooltip>
  </a-popover>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import type { Component } from "vue"
import { useRoute, useRouter } from "vue-router"
import { SearchOutlined } from "@ant-design/icons-vue"
import * as Icons from "@ant-design/icons-vue"
import { t } from "@/i18n"

interface SearchItem {
  path: string
  titleKey: string
  icon?: string
}

const router = useRouter()
const route = useRoute()
const open = ref(false)
const keyword = ref("")

interface RouteNode {
  path?: string
  meta?: { hidden?: boolean; titleKey?: string; icon?: string }
  children?: readonly RouteNode[]
}

/** 收集所有可见叶子路由（含 component） */
const menuItems = computed<SearchItem[]>(() => {
  const list: SearchItem[] = []
  const walk = (routes: readonly RouteNode[]) =>
    routes.forEach(r => {
      if (r.meta?.hidden) return
      if (r.children?.length) {
        walk(r.children)
      } else if (r.path && r.meta?.titleKey) {
        list.push({ path: r.path, titleKey: r.meta.titleKey, icon: r.meta.icon })
      }
    })
  walk(router.options.routes as readonly RouteNode[])
  return list
})

const results = computed(() => {
  const kw = keyword.value.trim().toLowerCase()
  if (!kw) return menuItems.value
  return menuItems.value.filter(
    item => t(item.titleKey).toLowerCase().includes(kw) || item.path.toLowerCase().includes(kw)
  )
})

function iconComp(name?: string): Component | undefined {
  if (!name || !(name in Icons)) return undefined
  return Icons[name as keyof typeof Icons] as Component
}

function go(path: string) {
  open.value = false
  keyword.value = ""
  if (path !== route.path) router.push(path)
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

.search-panel {
  width: 320px;
}

.result-list {
  max-height: 300px;
  margin-top: 8px;
  overflow-y: auto;
}

.result-item {
  display: flex;
  padding: 7px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.15s ease;

  &:hover,
  &.is-active {
    background-color: var(--hover-bg);
    color: var(--primary-color);
  }

  .result-path {
    font-size: 12px;
    color: var(--text-secondary);
  }
}

.result-empty {
  color: var(--text-secondary);
  font-size: 13px;
}
</style>
