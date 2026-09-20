<template>
  <div
    class="setting-trigger flex-center"
    :style="{ backgroundColor: appStore.primaryColor }"
    @click="open = true"
  >
    <SettingOutlined class="text-lg" />
  </div>

  <a-drawer v-model:open="open" title="主题设置" placement="right" :width="320">
    <div class="setting-group">
      <div class="group-title">主题</div>
      <a-segmented
        :value="appStore.themeMode"
        block
        :options="themeOptions"
        @change="(v: any) => appStore.update({ themeMode: v })"
      />
    </div>

    <div class="setting-group">
      <div class="group-title">菜单布局</div>
      <a-segmented
        :value="appStore.layoutMode"
        block
        :options="layoutOptions"
        @change="(v: any) => appStore.update({ layoutMode: v })"
      />
    </div>

    <div class="setting-group">
      <div class="group-title">主题色</div>
      <div class="color-grid">
        <template v-for="preset in COLOR_PRESETS" :key="preset.value">
          <div
            class="color-cell flex-center"
            :title="preset.label"
            :style="{ backgroundColor: preset.value }"
            @click="appStore.update({ primaryColor: preset.value })"
          >
            <CheckOutlined v-if="appStore.primaryColor === preset.value" class="text-white" />
          </div>
        </template>
        <a-color-picker
          class="color-picker-cell"
          :value="appStore.primaryColor"
          :allow-clear="false"
          show-text
          size="small"
          @change="onCustomColor"
        />
      </div>
    </div>

    <div class="setting-group">
      <div class="group-title">功能开关</div>
      <div class="switch-row flex-between">
        <span>展示面包屑</span>
        <a-switch
          :checked="appStore.showBreadcrumb"
          size="small"
          @change="(v: any) => appStore.update({ showBreadcrumb: v })"
        />
      </div>
      <div class="switch-row flex-between">
        <span>展示标签页</span>
        <a-switch
          :checked="appStore.showTabs"
          size="small"
          @change="(v: any) => appStore.update({ showTabs: v })"
        />
      </div>
    </div>

    <div class="setting-group">
      <div class="group-title">标签页样式</div>
      <a-radio-group
        :value="appStore.tabStyle"
        block
        button-style="solid"
        @change="(e: any) => appStore.update({ tabStyle: e.target.value as TabStyle })"
      >
        <a-radio-button value="card">卡片</a-radio-button>
        <a-radio-button value="chip">圆角</a-radio-button>
      </a-radio-group>
    </div>

    <a-button class="mt-6" block @click="appStore.reset">
      <RedoOutlined /> 恢复默认设置
    </a-button>
  </a-drawer>
</template>

<script setup lang="ts">
import { ref } from "vue"
import { SettingOutlined, CheckOutlined, RedoOutlined } from "@ant-design/icons-vue"
import { useAppStore } from "@/stores/app"
import { COLOR_PRESETS } from "@/types"
import type { TabStyle } from "@/types"

const appStore = useAppStore()
const open = ref(false)

const themeOptions = [
  { label: "亮色", value: "light" },
  { label: "暗色", value: "dark" },
  { label: "跟随系统", value: "auto" },
]

const layoutOptions = [
  { label: "侧边菜单", value: "side" },
  { label: "顶部菜单", value: "top" },
]

function onCustomColor(v: any) {
  const hex = typeof v === "string" ? v : v?.toHexString?.() ?? appStore.primaryColor
  appStore.update({ primaryColor: hex })
}
</script>

<style lang="scss" scoped>
.setting-trigger {
  position: fixed;
  inset-block-start: 50%;
  inset-inline-end: 0;
  z-index: 20;
  width: 40px;
  height: 40px;
  color: #fff;
  border-start-start-radius: 6px;
  border-end-start-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    width: 46px;
  }
}

.setting-group {
  margin-block-end: 20px;

  .group-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-color);
    margin-block-end: 10px;
  }
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 10px;
}

.color-cell {
  aspect-ratio: 1;
  border-radius: 6px;
  cursor: pointer;
  transition: transform 0.15s ease;

  &:hover {
    transform: scale(1.08);
  }
}

.color-picker-cell {
  width: 100%;
  justify-content: center;
}

.switch-row {
  padding-block: 6px;
  color: var(--text-color);
}
</style>
