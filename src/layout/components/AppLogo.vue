<template>
  <div class="app-logo flex-center" :class="{ 'is-collapsed': collapsed }">
    <svg class="logo-icon" viewBox="0 0 24 24" fill="none">
      <rect x="2" y="2" width="9" height="9" rx="2" fill="currentColor" />
      <rect x="13" y="2" width="9" height="9" rx="2" fill="currentColor" opacity="0.55" />
      <rect x="2" y="13" width="9" height="9" rx="2" fill="currentColor" opacity="0.55" />
      <rect x="13" y="13" width="9" height="9" rx="2" fill="currentColor" opacity="0.75" />
    </svg>
    <span class="logo-title">万能工具箱</span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ collapsed?: boolean }>()
</script>

<style lang="scss" scoped>
@use "@/assets/theme/_variables.scss" as *;

.app-logo {
  height: $header-height;
  gap: 8px;
  padding-inline: 12px;
  color: var(--primary-color);
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;

  .logo-icon {
    width: 24px;
    height: 24px;
    flex-shrink: 0;
  }

  &.is-collapsed {
    justify-content: center;
    padding-inline: 0;
  }
}
</style>
