import type { WatchSource, ShallowReactive } from 'vue'
import type { UseRequestOptions, UseRequestReturn, OnBeforeCtx, ServiceConfig } from '../types'

export interface PluginReturn {
  /** 请求前拦截 */
  onBefore?: (ctx: OnBeforeCtx) => Promise<ServiceConfig | void> | ServiceConfig | void
  /** 请求取消后触发 */
  onCancel?: () => void
  /** 请求中断后触发 */
  onAborted?: () => void
  /** 请求成功后触发 */
  onSuccess?: (data: any) => void
  /** 请求失败后触发 */
  onError?: (error: any) => void
  /** 请求结束后触发 */
  onAfter?: () => void
}

export interface PluginObject<T> {
  name: string
  setup: (ctx: UseRequestReturn, options: UseRequestOptions) => PluginReturn | void
}

/** 防抖插件配置项 */
export type DebounceConfig =
  | boolean
  | number
  | {
      /** 防抖间隔 */
      wait?: number
      /** 是否在延迟前调用 */
      leading?: boolean
      /** 允许被延迟的最大值 */
      maxWait?: number
      trailing?: boolean
    }

/** 轮询插件配置项 */
export type PollingConfig =
  | boolean
  | number
  | {
      /** 间隔时间 */
      interval?: number
      /** 页面隐藏时保持轮询 */
      keepWhenHidden?: boolean
      /** 断网时保持轮询 */
      keepWhenOffline?: boolean
      /** 是否停止 */
      stop?: boolean | Ref<boolean> | (() => boolean)
    }

/** 依赖某个响应式数据的改变开启请求 */
export type Ready = boolean | WatchSource | (() => any)

/** 分页插件配置项 */
export type PageConfig =
  | boolean
  | {
      /**
       * 是否使用数据追加模式 (列表下拉加载场景)
       * - 默认 false
       */
      append?: boolean
      /**
       * 当前页
       * - 默认 1
       */
      num?: number
      /**
       * 每页条数
       * - 默认 20
       */
      size?: number
      /**
       * 当前页的属性名
       * - 默认值 'pageNum'
       */
      numKey?: string
      /**
       * 每页条数的属性名
       * - 默认值 'pageSize'
       */
      sizeKey?: string
      /**
       * 数组数据属性名
       * - 默认值 'rows'
       */
      dataKey?: string | null
      /**
       * 总条数属性名
       * - 默认值 'total'
       */
      totalKey?: string
      /**
       * 总页数属性名
       * - 默认值 'totalPage'
       */
      totalPageKey?: string
      /**
       * 防抖间隔
       * - 默认 200ms
       */
      wait?: number
      /**
       * 列表项数据转换处理函数
       */
      format?: (item: any, index: number) => any
    }

/** 分页插件返回值 */
export type PageReturn =
  | undefined
  | null
  | ShallowReactive<{
      /** 当前页码 */
      num: number
      /** 每页条数 */
      size: number
      /** 总条数 */
      total: number
      /** 总页数 */
      totalPage: number
      /** 是否有上一页 */
      hasPrev: boolean
      /** 是否有下一页 */
      hasNext: boolean
      /** 数据是否全部加载 */
      finished: boolean
      /** 上一页 */
      prev: () => void
      /** 下一页 */
      next: () => void
      /** 清空数据并重新请求 */
      reload: () => void
      /** 改变当前页码 */
      changeNum: (num: number) => void
      /** 改变每页条数 */
      changeSize: (size: number) => void
      /** 同时修改当前页码和每页条数 */
      change: (num: number, size: number) => void
    }>
