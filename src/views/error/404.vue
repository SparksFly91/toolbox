<template>
  <div class="flex-center h-full flex-col gap-4">
    <div class="text-6xl font-bold text-slate-400">404</div>
    <div>页面不存在</div>
    <a-button type="primary" @click="router.push('/')">回到首页</a-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"

defineOptions({ name: "not-found" })

const router = useRouter()
</script>
