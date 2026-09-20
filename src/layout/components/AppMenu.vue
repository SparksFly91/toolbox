<template>
  <a-menu v-model:selectedKeys="selectedKeys" v-model:openKeys="openKeys" :mode="mode" :items="menuItems"
    :inline-collapsed="mode === 'inline' && appStore.siderCollapsed" @click="onMenuClick" />
</template>

<script setup lang="ts">
import { computed, h, ref, watch } from "vue"
import { useRoute, useRouter } from "vue-router"
import * as Icons from "@ant-design/icons-vue"
import type { ItemType } from "ant-design-vue"
import { useAppStore } from "@/stores/app"
import { t } from "@/i18n"

const props = withDefaults(
  defineProps<{ mode?: "inline" | "horizontal" }>(),
  { mode: "inline" }
)

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

function icon(name?: string) {
  if (!name || !(name in Icons)) return undefined
  return () => h(Icons[name as keyof typeof Icons])
}

function toItems(routes: any[]): ItemType[] {
  return routes
    .filter(r => !r.meta?.hidden && (r.children?.length || r.component))
    .filter(r => !(r.children?.filter((c: any) => !c.meta?.hidden).length === 0 && !r.component))
    .map(r => {
      const children = r.children?.filter((c: any) => !c.meta?.hidden) ?? []
      return {
        key: r.redirect ? (children[0]?.path ?? r.path) : r.path,
        icon: icon(r.meta?.icon) ?? undefined,
        label: t(String(r.meta?.titleKey ?? r.meta?.title ?? r.name)),
        children: children.length ? toItems(children) : undefined,
      } as ItemType
    })
}

const menuItems = computed<ItemType[]>(() =>
  toItems(router.options.routes.find(r => r.name === "layout")?.children ?? [])
)

const selectedKeys = ref<string[]>([])
const openKeys = ref<string[]>([])

function syncMenuState() {
  selectedKeys.value = [route.path]
  openKeys.value = route.path
    .split("/")
    .slice(1, -1)
    .filter(Boolean)
    .map((_: string, i: number, arr: string[]) => "/" + arr.slice(0, i + 1).join("/"))
}

watch(() => route.path, syncMenuState, { immediate: true })

function onMenuClick({ key }: { key: string }) {
  router.push(String(key))
}
</script>

<style lang="scss" scoped>
.sider-menu {
  width: 100%;
}
</style>
