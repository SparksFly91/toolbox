import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router"

export interface AppRouteMeta {
  title?: string
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
        meta: { title: "首页", icon: "HomeOutlined", affix: true },
      },
      {
        path: "/tools",
        name: "tools",
        redirect: "/tools/json",
        meta: { title: "工具箱", icon: "ToolOutlined" },
        children: [
          {
            path: "/tools/json",
            name: "json",
            component: () => import("@/views/tools/json/index.vue"),
            meta: { title: "JSON 格式化", icon: "CodeOutlined" },
          },
          {
            path: "/tools/regex",
            name: "regex",
            component: () => import("@/views/tools/regex/index.vue"),
            meta: { title: "正则测试", icon: "SearchOutlined" },
          },
        ],
      },
      {
        path: "/settings",
        name: "settings",
        component: () => import("@/views/settings/index.vue"),
        meta: { title: "系统设置", icon: "SettingOutlined" },
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
