import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"

export interface AppRouteMeta {
  /** i18n key（menu.*），用于菜单 / 面包屑 / 标签页展示 */
  titleKey?: string
  icon?: string
  hidden?: boolean
  affix?: boolean
}

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "layout",
    component: () => import("@/layout/index.vue"),
    redirect: "/home",
    children: [
      {
        path: "/home",
        name: "home",
        component: () => import("@/views/home/index.vue"),
        meta: { titleKey: "menu.home", icon: "HomeOutlined", affix: true },
      },
      {
        path: "/tools",
        name: "tools",
        redirect: "/tools/json",
        meta: { titleKey: "menu.tools", icon: "ToolOutlined" },
        children: [
          {
            path: "/tools/json",
            name: "json",
            component: () => import("@/views/tools/json/index.vue"),
            meta: { titleKey: "menu.tools_json", icon: "CodeOutlined" },
          },
          {
            path: "/tools/regex",
            name: "regex",
            component: () => import("@/views/tools/regex/index.vue"),
            meta: { titleKey: "menu.tools_regex", icon: "SearchOutlined" },
          },
        ],
      },
      {
        path: "/imgtools",
        name: "ImgTools",
        redirect: "/imgtools/format",
        meta: { titleKey: "menu.imgtools", icon: "PictureOutlined" },
        children: [
          {
            path: "/imgtools/format",
            name: "format",
            component: () => import("@/views/imgtools/Format.vue"),
            meta: { titleKey: "menu.imgtools_format", icon: "FileJpgOutlined" },
          },
        ],
      },
      {
        path: "/settings",
        name: "settings",
        component: () => import("@/views/settings/index.vue"),
        meta: { titleKey: "menu.settings", icon: "SettingOutlined", hidden: true },
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    name: "not-found",
    component: () => import("@/views/error/404.vue"),
    meta: { hidden: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
