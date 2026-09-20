# 布局系统设计规划（toolbox）

> 状态：已确认，待实施
> 技术栈：Vue 3.5 + Vite + Tauri + ant-design-vue 4.x + Pinia（persistedstate）+ UnoCSS + Sass

## 1. 总体结构

```
src/
├── layout/
│   ├── index.vue                 # 布局入口，按 layoutMode 动态渲染
│   ├── LayoutContainer.vue       # (重构) 通用骨架：header/tabs/content
│   ├── components/
│   │   ├── AppLogo.vue           # Logo + 标题
│   │   ├── AppMenu.vue           # 菜单渲染（侧边/顶部共用）
│   │   ├── AppHeader.vue         # 顶栏（面包屑/折叠按钮/工具区）
│   │   ├── AppBreadcrumb.vue     # 面包屑（路由自动生成）
│   │   ├── AppTabs.vue           # 标签页导航（卡片/圆角两种样式）
│   │   └── SettingDrawer.vue     # 悬浮按钮 + 设置抽屉
├── stores/
│   ├── app.ts                    # 布局/主题设置（persistedstate 持久化 localStorage）
│   └── tab.ts                    # 标签页状态 + keep-alive 缓存列表
```

## 2. 两种菜单布局

| | 侧边菜单（side） | 顶部菜单（top） |
|---|---|---|
| 结构 | 左侧 Sider（可折叠、支持深/浅色）+ 右侧内容区 | Logo+菜单+工具区全部在顶栏一行 |
| 切换 | 设置抽屉实时切换，无需刷新 | 同左 |

- 菜单数据由路由 meta（`title` / `icon` / `hidden`）自动生成，侧边/顶部共用一套 `AppMenu`。
- 侧边栏支持折叠（汉堡按钮 + 收起态 Tooltip）。

## 3. 面包屑

- `AppBreadcrumb`：基于 `route.matched` 自动生成，读取 meta.title，可点击跳转；设置抽屉可控制显隐。
- 顶部菜单模式下显示在内容区上方（Header 下方），侧边模式下显示在 Header 中。

## 4. 悬浮设置按钮 + 抽屉

- 右侧中部方形悬浮按钮（UnoCSS 定位，固定 `right-0 top-50%`），点击展开抽屉，包含：
  1. **主题**：亮色 / 暗色 / 跟随系统（ant-design-vue `theme.darkAlgorithm`）
  2. **菜单布局**：侧边菜单 / 顶部菜单
  3. **主题色**：经典色板 10 色（拂晓蓝、薄暮红、青柠绿、极光绿、日暮橙、金盏黄、酱紫、明青、极客蓝、品红）+ ColorPicker 自定义
  4. **是否展示面包屑**：Switch
  5. **是否展示标签页**：Switch
  6. **标签页样式**：卡片（card）/ 圆角（chip）
  7. 恢复默认设置按钮
- 全部配置通过 Pinia + `pinia-plugin-persistedstate` 持久化，刷新保留。
- 主题色/暗色通过 `a-config-provider` 的 theme token 动态下发（`App.vue` 中改造）。

## 5. 标签页（多页签导航，完整版）

- 打开路由自动添加标签，支持：点击切换、关闭单个、右键菜单（关闭其他、关闭全部）。
- 结合 `router-view` + `KeepAlive`，按标签 `name` 缓存组件。
- 标签样式：`a-tabs` card 风格 / 圆角 chip 风格（自定义渲染）。

## 6. UnoCSS & Sass

- 新建 `uno.config.ts`：presetUno + presetIcons（图标）+ shortcuts（如 `flex-center`）；vite.config.ts 注册 UnoCSS 插件。
- 布局样式用 `.scss` 模块化书写，抽出 `src/assets/theme/_variables.scss`（侧边栏宽度、header 高度等变量），通过 `css.preprocessorOptions.scss.additionalData` 全局注入。
- `main.ts` 补充注册 Pinia、全局样式。

## 7. 主题变量约定

- 布局尺寸：侧边栏 220px（折叠 64px）、Header 48px、Tabs 36px
- 暗色模式下侧边栏/头部背景跟随 antd token（`useToken` 取色），避免硬编码

## 8. 涉及文件清单

| 文件 | 说明 |
|---|---|
| `uno.config.ts` | presetUno + presetIcons + shortcuts，vite.config.ts 注册插件 |
| `src/assets/theme/_variables.scss` | 布局尺寸变量，vite additionalData 全局注入 |
| `src/stores/app.ts` | 布局设置 store：`layoutMode(side/top)`、`theme(light/dark/auto)`、`primaryColor`、`showBreadcrumb`、`showTabs`、`tabStyle(card/chip)`、`siderCollapsed`，persistedstate 持久化 |
| `src/stores/tab.ts` | 标签页 store：tabs 列表、cachedViews（keep-alive）、add/remove/closeOther/closeAll |
| `src/layout/index.vue` | 布局入口，`layoutMode` 条件渲染侧边/顶部结构 |
| `src/layout/LayoutContainer.vue` | 重构为通用内容骨架（header + tabs + main） |
| `src/layout/components/AppLogo.vue` | Logo + 标题（顶部/侧边两种模式复用） |
| `src/layout/components/AppMenu.vue` | 菜单组件，由路由 meta（`title`/`icon`/`hidden`）自动生成，水平/垂直两种模式 |
| `src/layout/components/AppHeader.vue` | 顶栏：折叠按钮、面包屑、右侧工具区（占位） |
| `src/layout/components/AppBreadcrumb.vue` | 基于 `route.matched` 自动生成，可点击跳转 |
| `src/layout/components/AppTabs.vue` | 完整版标签页：切换/关闭/右键菜单（关闭其他、关闭全部），KeepAlive 缓存，card/chip 两种样式 |
| `src/layout/components/SettingDrawer.vue` | 右侧方形悬浮按钮（`right-0 top-50%` UnoCSS 定位）+ 抽屉：主题（亮/暗/跟随系统）、菜单布局、经典色板 10 色 + ColorPicker 自定义、面包屑开关、标签页开关、标签页样式、恢复默认 |
| `src/App.vue` | 改造：动态下发主题色与暗色模式（darkAlgorithm） |
| `src/main.ts` | 注册 Pinia、全局样式 |
| `src/router/index.ts` | 路由补充 meta 与示例多级路由 |

## 9. 已确认的决策

- 标签页：**完整版**（切换、关闭、关闭其他/全部，KeepAlive 缓存，右键菜单）
- 暗色主题：**需要**（亮/暗/跟随系统三选一）
- 主题色：**经典色板**（10 预设色 + 自定义取色器）

## 10. 开发顺序

1. 配置 UnoCSS（uno.config.ts + vite 注册）+ sass 全局变量注入
2. app store（布局设置）+ tab store
3. 布局骨架 index.vue / LayoutContainer / AppHeader / AppMenu / AppBreadcrumb
4. AppTabs + KeepAlive
5. SettingDrawer + 悬浮按钮 + App.vue 主题下发
6. 路由 meta 完善 + 演示页面，跑通验证（`vue-tsc` 类型检查）
