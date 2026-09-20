<template>
  <a-card title="系统设置" class="max-w-200">
    <a-form label-width="120px" layout="horizontal">
      <a-form-item label="菜单布局">
        <a-segmented
          :value="appStore.layoutMode"
          :options="layoutOptions"
          @change="(v: any) => appStore.update({ layoutMode: v })"
        />
      </a-form-item>
      <a-form-item label="主题">
        <a-segmented
          :value="appStore.themeMode"
          :options="themeOptions"
          @change="(v: any) => appStore.update({ themeMode: v })"
        />
      </a-form-item>
      <a-form-item label="主色">
        <div class="flex gap-2">
          <div
            v-for="c in COLOR_PRESETS"
            :key="c.value"
            class="w-6 h-6 rounded cursor-pointer flex-center transition-transform hover:scale-110"
            :style="{ backgroundColor: c.value }"
            @click="appStore.update({ primaryColor: c.value })"
          >
            <CheckOutlined v-if="appStore.primaryColor === c.value" class="text-white" />
          </div>
        </div>
      </a-form-item>
    </a-form>
  </a-card>
</template>

<script setup lang="ts">
import { CheckOutlined } from "@ant-design/icons-vue"
import { useAppStore } from "@/stores/app"
import { COLOR_PRESETS } from "@/types"

defineOptions({ name: "settings" })

const appStore = useAppStore()

const themeOptions = [
  { label: "亮色", value: "light" },
  { label: "暗色", value: "dark" },
  { label: "跟随系统", value: "auto" },
]

const layoutOptions = [
  { label: "侧边菜单", value: "side" },
  { label: "顶部菜单", value: "top" },
]
</script>
