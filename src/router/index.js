import { createRouter, createWebHashHistory } from 'vue-router'
import { useGuard } from './guard'

/** 默认 layout */
const DefaultLayout = () => import('./layouts/Default.vue')

/** 基础路由 @type {import('vue-router').RouteRecordItem[]} */
const routes = [
  // * --------------------------------------------------------- 预设路由组 开始 ------------------------------------------------------------
  {
    // 中转路由 - 配合全局函数 refreshPage() 实现页面的刷新
    path: '/redirect/:name(.*)?',
    name: 'Redirect',
    meta: { auth: false, alive: false },
    component: () => import('./layouts/Redirect.vue'),
  },
  // * --------------------------------------------------------- 预设路由组 结束 ------------------------------------------------------------
  {
    path: '/login',
    name: 'Login',
    meta: { auth: false, alive: false },
    component: () => import('@/views/login.vue'),
  },
  {
    // 首页
    path: '/',
    name: 'Home',
    meta: {},
    component: () => import('@/views/home.vue'),
  },
]

/** 动态导入 modules 目录下的路由, 合并到 routes */
;(function () {
  const modulesRoutes = import.meta.glob(['./modules/**/*.js', '!**/*example.js'], { import: 'default', eager: true })
  Object.values(modulesRoutes).forEach((moduleRoutes) => {
    routes.push(...moduleRoutes)
  })
  // 递归处理路由
  function handleRoutes(routeRecords) {
    // routeRecords.forEach((route) => {
    //   if (route.children && !route.component) {
    //     route.component = DefaultLayout
    //     handleRoutes(route.children)
    //   }
    // })
  }
  // handleRoutes(routes)
})()

// 创建路由
export const router = createRouter({
  routes,
  strict: false,
  history: createWebHashHistory(),
  scrollBehavior: (_to, _from, savedPosition) => {
    return savedPosition || { top: 0, left: 0 }
  },
})

// 加载路由守卫
useGuard(router)

export function setupRouter(app) {
  app.use(router)
}
