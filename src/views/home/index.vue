<template>
  <a-card :title="t('menu.home')">
    <p class="flex items-center gap-2">
      <a-typography-text>KeepAlive</a-typography-text>
      <a-button size="small" @click="count++">+1</a-button>
      <span class="text-primary font-bold">{{ count }}</span>
    </p>
    <a-typography-paragraph type="secondary">
      {{ t("app.description") }}
    </a-typography-paragraph>
  </a-card>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { t } from "@/i18n"

defineOptions({ name: "home" })

const count = ref(0)
</script>
