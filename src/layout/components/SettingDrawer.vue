<template>
  <div
    class="setting-trigger flex-center"
    :style="{ backgroundColor: appStore.primaryColor }"
    @click="open = true"
  >
    <SettingOutlined class="text-lg" />
  </div>

  <a-drawer v-model:open="open" :title="t('setting.title')" placement="right" :width="320">
    <div class="setting-group">
      <div class="group-title">{{ t("setting.theme") }}</div>
      <a-segmented
        :value="appStore.themeMode"
        block
        :options="themeOptions"
        @change="(v: any) => appStore.update({ themeMode: v })"
      />
    </div>

    <div class="setting-group">
      <div class="group-title">{{ t("setting.layout") }}</div>
      <a-segmented
        :value="appStore.layoutMode"
        block
        :options="layoutOptions"
        @change="(v: any) => appStore.update({ layoutMode: v })"
      />
    </div>

    <div class="setting-group">
      <div class="group-title">{{ t("setting.primaryColor") }}</div>
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
        <input
          class="color-picker-cell"
          type="color"
          :value="appStore.primaryColor"
          :title="t('setting.primaryColor')"
          @input="(e: any) => onCustomColor(e.target.value)"
        />
      </div>
    </div>

    <div class="setting-group">
      <div class="group-title">{{ t("setting.switches") }}</div>
      <div class="switch-row flex-between">
        <span>{{ t("setting.showBreadcrumb") }}</span>
        <a-switch
          :checked="appStore.showBreadcrumb"
          size="small"
          @change="(v: any) => appStore.update({ showBreadcrumb: v })"
        />
      </div>
      <div class="switch-row flex-between">
        <span>{{ t("setting.showTabs") }}</span>
        <a-switch
          :checked="appStore.showTabs"
          size="small"
          @change="(v: any) => appStore.update({ showTabs: v })"
        />
      </div>
    </div>

    <div class="setting-group">
      <div class="group-title">{{ t("setting.tabStyle") }}</div>
      <a-radio-group
        :value="appStore.tabStyle"
        block
        button-style="solid"
        @change="(e: any) => appStore.update({ tabStyle: e.target.value as TabStyle })"
      >
        <a-radio-button value="card">{{ t("setting.tabStyle_card") }}</a-radio-button>
        <a-radio-button value="chip">{{ t("setting.tabStyle_chip") }}</a-radio-button>
      </a-radio-group>
    </div>

    <div class="setting-group">
      <div class="group-title">{{ t("setting.language") }}</div>
      <a-segmented
        :value="appStore.locale"
        block
        :options="localeOptions"
        @change="(v: any) => appStore.setLocale(v)"
      />
    </div>

    <a-button class="mt-6" block @click="appStore.reset">
      <RedoOutlined /> {{ t("setting.reset") }}
    </a-button>
  </a-drawer>
</template>

<script setup lang="ts">
import { computed, ref } from "vue"
import { SettingOutlined, CheckOutlined, RedoOutlined } from "@ant-design/icons-vue"
import { useAppStore } from "@/stores/app"
import { COLOR_PRESETS } from "@/types"
import type { TabStyle } from "@/types"
import { t } from "@/i18n"
import { SUPPORTED } from "@/i18n/locales"

const appStore = useAppStore()
const open = ref(false)

const themeOptions = computed(() => [
  { label: t("setting.theme_light"), value: "light" },
  { label: t("setting.theme_dark"), value: "dark" },
  { label: t("setting.theme_auto"), value: "auto" },
])

const layoutOptions = computed(() => [
  { label: t("setting.layout_side"), value: "side" },
  { label: t("setting.layout_top"), value: "top" },
])

const localeOptions = computed(() =>
  SUPPORTED.map(o => ({ label: o.label, value: o.value }))
)

function onCustomColor(hex: string) {
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
  height: 100%;
  padding: 0;
  border: none;
  background: var(--hover-bg);
  border-radius: 6px;
  cursor: pointer;
}

.switch-row {
  padding-block: 6px;
  color: var(--text-color);
}
</style>
