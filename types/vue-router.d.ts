declare module 'vue-router' {
  interface RouteMeta extends Record<string | number | symbol, any> {
    [key: string]: any

    /** 页面标题 */
    title?: string

    /** 页面 keep-alive 缓存 */
    alive?: boolean

    /** 组件缓存的清除,布尔类型 true 时默认清除 from 路由组件 */
    removeAlive?: boolean | string | string[]

    /** 需要登录认证 */
    auth?: boolean

    /** 角色信息 */
    roles?: string[]
  }

  export type RouteRecordItem = RouteRecordRaw & {
    path: string
    name?: string
    meta?: RouteMeta
    children?: RouteRecordItem[]
    component?: RouteComponent | Lazy<RouteComponent> | string
  }
}

export {}
