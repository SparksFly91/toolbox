<template>
  <div class="p-4">
    <a-card title="首页">
      <p class="flex items-center gap-2">
        <a-typography-text>KeepAlive 测试计数：</a-typography-text>
        <a-button size="small" @click="count++">+1</a-button>
        <span class="text-primary font-bold">{{ count }}</span>
      </p>
      <a-typography-paragraph type="secondary">
        顶部悬浮按钮打开设置抽屉，可切换菜单布局 / 暗色主题 / 主题色 / 面包屑 / 标签页。
      </a-typography-paragraph>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue"

defineOptions({ name: "home" })

const count = ref(0)
</script>
