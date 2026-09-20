<template>
  <div class="flex-center h-full flex-col gap-4">
    <div class="text-6xl font-bold text-slate-400">{{ t("error.404_title") }}</div>
    <div>{{ t("error.404_desc") }}</div>
    <a-button type="primary" @click="router.push('/')">{{ t("error.backHome") }}</a-button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router"
import { t } from "@/i18n"

defineOptions({ name: "not-found" })

const router = useRouter()
</script>
