<template>
  <a-breadcrumb class="app-breadcrumb px-3">
    <a-breadcrumb-item v-for="item in items" :key="item.path">
      <RouterLink v-if="item.path !== route.path" :to="item.path">
        {{ t(item.titleKey) }}
      </RouterLink>
      <template v-else>{{ t(item.titleKey) }}</template>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"
import { t } from "@/i18n"

interface CrumbItem {
  path: string
  titleKey: string
}

const route = useRoute()

const items = computed<CrumbItem[]>(() =>
  route.matched
    .slice(1)
    .filter(r => r.meta?.titleKey || r.meta?.title)
    .map(r => ({
      path: r.path,
      titleKey: String(r.meta?.titleKey ?? r.meta?.title),
    }))
)
</script>

<style lang="scss" scoped>
.app-breadcrumb {
  white-space: nowrap;
}
</style>
