<template>
  <a-card :title="t('menu.settings')" class="max-w-200">
    <a-form layout="horizontal">
      <a-form-item :label="t('setting.layout')">
        <a-segmented
          :value="appStore.layoutMode"
          :options="layoutOptions"
          @change="(v: any) => appStore.update({ layoutMode: v })"
        />
      </a-form-item>
      <a-form-item :label="t('setting.theme')">
        <a-segmented
          :value="appStore.themeMode"
          :options="themeOptions"
          @change="(v: any) => appStore.update({ themeMode: v })"
        />
      </a-form-item>
      <a-form-item :label="t('setting.language')">
        <a-segmented
          :value="appStore.locale"
          :options="localeOptions"
          @change="(v: any) => appStore.setLocale(v)"
        />
      </a-form-item>
      <a-form-item :label="t('setting.primaryColor')">
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
import { computed } from "vue"
import { CheckOutlined } from "@ant-design/icons-vue"
import { useAppStore } from "@/stores/app"
import { COLOR_PRESETS } from "@/types"
import { t } from "@/i18n"
import { SUPPORTED } from "@/i18n/locales"

defineOptions({ name: "settings" })

const appStore = useAppStore()

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
</script>
