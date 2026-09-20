<template>
  <a-breadcrumb class="app-breadcrumb px-3">
    <a-breadcrumb-item v-for="item in items" :key="item.path">
      <RouterLink v-if="item.path !== route.path" :to="item.path">
        {{ item.title }}
      </RouterLink>
      <template v-else>{{ item.title }}</template>
    </a-breadcrumb-item>
  </a-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from "vue"
import { useRoute } from "vue-router"

interface CrumbItem {
  path: string
  title: string
}

const route = useRoute()

const items = computed<CrumbItem[]>(() =>
  route.matched
    .slice(1)
    .filter(r => r.meta?.title)
    .map(r => ({ path: r.path === route.path ? route.path : r.path, title: r.meta.title as string }))
)
</script>

<style lang="scss" scoped>
.app-breadcrumb {
  white-space: nowrap;
}
</style>
