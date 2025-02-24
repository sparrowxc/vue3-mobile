import type { WatchSource, Ref, ShallowRef } from 'vue'
import type { AxiosRequestConfig, AxiosResponse, IResponseType } from 'axios'
import type { Ready, DebounceConfig, PollingConfig, PageConfig, PageReturn } from './plugins/types'

/** 请求服务的配置项 */
export type ServiceConfig = AxiosRequestConfig

export interface OnBeforeCtx {
  /** 请求服务配置 */
  config: ServiceConfig
  cancel: () => void
}

export interface OnErrorCtx {
  data: any
  error: any
}

/** useRequest 的配置项  */
export type UseRequestOptions = {
  /** 请求参数 */
  params?: Record<any, any> | (() => Record<any, any>)
  /** 监听请求参数变化 */
  watchParams?: boolean | ((params: any) => any)
  /** 过滤空字符串请求参数 - 默认 true */
  filterEmptyParams?: boolean
  /** 请求服务的配置项 */
  serviceConfig?: ServiceConfig
  /** 请求完成前的初始数据 */
  data?: any
  /**
   * 响应结果数据的 key
   * - 默认 'data'
   */
  dataKey?: string
  /** 是否立即执行请求 */
  immediate?: boolean
  /** 依赖某个响应式数据的改变开启请求 - 默认 true */
  ready?: Ready
  /** 请求失败是否抛出 */
  throwOnFailed?: boolean
  /** 在组件卸载时是否自动取消请求 */
  autoAbort?: boolean
  /** 是否使用浅层代理 - 默认 false */
  shallow?: boolean
  /** 全局的防抖间隔时长 - 默认 200ms */
  debounceWait?: number
  /**
   * 监听数据变化并自动执行请求
   * - 单个或多个(数组形式) ref 对象
   */
  watch?: WatchSource | WatchSource[]
  /** 监听数据变化后触发 */
  onWatch?: (run: UseRequestReturn['run']) => void
  /** 请求前的拦截, ctx.cancel() 可取消请求 */
  onBefore?: (ctx: OnBeforeCtx) => Promise<ServiceConfig | void> | ServiceConfig | void
  /** 请求取消后触发 */
  onCancel?: () => void
  /** 请求中断后触发 */
  onAbort?: () => void
  /** 请求成功后触发 */
  onSuccess?: (data: any, params: any, response: any) => Promise<any> | any
  /** 请求失败后触发 */
  onError?: (ctx: OnErrorCtx) => Promise<Partial<OnErrorCtx> | void> | Partial<OnErrorCtx> | void
  /** 请求结束后触发 */
  onAfter?: () => void
  // * ----------------------------------------- 插件配置 开始 -----------------------------------------
  /**
   * 防抖
   * - true: 使用默认配置
   * - 300: 间隔 300ms
   * - { wait: number, leading: boolean } 完整配置项 https://www.lodashjs.com/docs/lodash.debounce
   */
  debounce?: DebounceConfig
  /**
   * 轮询
   * - true: 使用默认配置
   * - 1000: 间隔 1000ms
   * - { interval: number, keepWhenHidden: boolean, keepWhenOffline: boolean, stop: boolean | Ref<boolean> | (() => boolean) } 完整配置项
   */
  polling?: PollingConfig
  /**
   * 分页配置 - 属性名的配置
   * - append - 是否使用数据追加模式 (列表下拉加载场景) - 默认 false
   * - num - 当前页 - 默认 1
   * - size - 每页条数 - 默认 20
   * - numKey - 当前页 key - 'pageNum'
   * - sizeKey - 每页条数 key - 'pageSize'
   * - dataKey - 数组数据 key - 'rows'
   * - totalKey - 总条数 key - 'total'
   * - totalPageKey - 总页数 key - 'totalPage'
   * - wait - 防抖间隔 - 默认 300ms
   * - transform(item) - 列表项数据转换函数
   */
  page?: PageConfig
  // * ----------------------------------------- 插件配置 结束 -----------------------------------------
}

/** useRequest 的返回值 */
export interface UseRequestReturn {
  /** 请求参数 */
  params: ShallowRef<any>
  /** 响应结果 */
  response: AxiosResponse<IResponseType>
  /** 错误 */
  error: ShallowRef<any>
  /** 数据 */
  data: Ref<any>
  /** 分页数据 */
  list: Ref<any[]>
  /** 请求是否还在进行中 */
  isLoading: Ref<boolean>
  /** 请求是否结束 */
  isFinished: Ref<boolean>
  /** 请求是否被中断 */
  isAborted: Ref<boolean>
  /** 取消当前的请求 */
  cancel: () => void
  /** 中断当前的请求 */
  abort: () => void
  /** 手动发起请求, 默认不会 throw error */
  run: () => Promise<any>
  /**
   * 分页
   * - num - 当前页
   * - size - 每页条数
   * - total - 总条数
   * - totalPage - 总页数
   * - hasPrev - 是否有上一页
   * - hasNext - 是否有下一页
   * - finished - 数据是否全部加载
   * - prev() - 上一页
   * - next() - 下一页
   * - reload() - 清空数据重新请求
   * - refresh(num) - 更新指定页 (默认当前页) 数据
   * - changeNum(num) - 改变当前页
   * - changSize(size) - 改变每页条数
   * - changePage(num, size) - 同时改变当前页和每页条数
   */
  page?: PageReturn
}
