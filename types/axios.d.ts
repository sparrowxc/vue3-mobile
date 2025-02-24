import type { AxiosError, AxiosResponse, Method } from 'axios'

declare module 'axios' {
  /** 错误拦截器 */
  export type IErrorInterceptor = (error: AxiosError<IResponseType>) => Promise<AxiosError<IResponseType>>

  /** 请求拦截器 */
  export type IRequestInterceptor = (config: AxiosRequestConfig) => AxiosRequestConfig | Promise<AxiosRequestConfig> | any
  /** 请求拦截器组 */
  export type IRequestInterceptorTuple = [IRequestInterceptor, IErrorInterceptor] | [IRequestInterceptor] | IRequestInterceptor

  /** 响应拦截器 */
  export type IResponseInterceptor = (response: AxiosResponse<IResponseType>) => AxiosResponse<IResponseType> | any
  /** 响应拦截器组 */
  export type IResponseInterceptorTuple = [IResponseInterceptor, IErrorInterceptor] | [IResponseInterceptor] | IResponseInterceptor

  export interface AxiosRequestConfig {
    /** 不经过处理的原始响应 */
    native?: boolean
    /** 在地址后面添加版本号 */
    version?: string | number
    /** 是否在地址后面添加当前时间戳 */
    timestamp?: boolean
    /** 请求头中添加 token */
    withToken?: boolean
    /** 认证方案 default: Bearer */
    authScheme?: string
    /** 是否显示 Loading 或 Loading 文本 */
    loading?: boolean | string
    /** 是否显示请求成功 Message */
    showSucceed?: boolean | string
    /** 是否显示请求失败 Message */
    showFailure?: boolean | string
    /** 响应数据格式化配置 */
    responseKeyMap?: responseKeyMap

    /** 请求开始 */
    onStart?: (config?: AxiosResponse['config']) => void
    /** 请求成功响应 */
    onSuccess?: (response: IResponseType<any>, config?: AxiosResponse['config']) => void
    /** 请求失败响应 */
    onError?: <T = IResponseType>(errorOrResponse?: AxiosResponse<T> | AxiosError<T>, code?: number, msg?: string) => void
    /** 请求结束 - 不管是成功还是失败 */
    onFinish?: () => void

    /** 额外的请求参数 */
    addPayload?: (config?: AxiosRequestConfig) => any
    extraData?: (config?: AxiosRequestConfig) => any

    /** 添加认证头 token */
    getAuthToken?: (config?: AxiosRequestConfig) => any
    /** 登录认证失败码组 */
    authFailedCode: number[]
    /** 登录认证失败回调 */
    onAuthFailed?: () => void

    /** 扩展属性 */
    [key: string]: unknown
  }

  /** 自定义接口返回的数据类型 */
  export type IResponseType<T = any> =
    | T
    | {
        /** 状态码 */
        code: number
        /** 信息文本 */
        message: string
        /** 数据 */
        data: T
        /** 扩展属性 */
        [key: string]: unknown
      }

  export interface AxiosInstance {
    <T = any>(config: AxiosRequestConfig): Promise<T>
    request<T = any>(config: AxiosRequestConfig): Promise<T>
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    head<T = any>(url: string, config?: AxiosRequestConfig): Promise<T>
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T>
  }

  // multipart/form-data: upload file
  export type UploadFileParams = {
    /** 文件 */
    file: File | Blob
    /** 属性名 */
    fileKey: string
    /** 文件名 */
    filename?: string | ((file: File | Blob) => string)
    /** 其他参数 */
    data?: Record<any, any>
  }

  /** 响应数据格式化配置 */
  export type responseKeyMap = {
    /** 状态码 */
    code: string[]
    /** 提示信息 */
    msg: string[]
    /** 数据 */
    data: string[]
    /** 默认显示 message 的请求方法类型组 */
    succeedMethods: string[]
    /** 成功请求的状态码范围 */
    succeedScopes?: string[]
  }
}

export {}
