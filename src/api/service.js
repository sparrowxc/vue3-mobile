import { getBaseURL, configItem } from '../config'
import { useService } from '@/utils/vendor/axios'
import { useUserStore } from '@/store/user'

/** 网络请求配置的部分配置的默认值 @type {import('axios').AxiosRequestConfig} */
const defaultConfig = {
  timeout: 30 * 1000,
  onStart(config) {
    const { loading = false } = config
    if (loading) {
    }
  },
  onFinish() {
    // loadingInstance && loadingInstance.close()
  },
  onSuccess(res, config) {
    const { showSucceed } = config
    if (showSucceed) {
    }
  },
  onError(errOrRes, code, msg) {
    const { showFailure } = errOrRes?.config || {}
    if (showFailure) {
    }
  },
}

// * ------------------------------- 默认请求创建 开始 -------------------------------
export const { Get, Post, PostByParams, Put, Del, UploadFile } = useService({
  ...defaultConfig,
  baseURL: getBaseURL('api'),
  withToken: true,
  getAuthToken() {
    const userStore = useUserStore()
    return userStore.token
  },
  onAuthFailed() {
    // 认证失败, 没有 user 或 user 过期了
    const userStore = useUserStore()
    userStore.logout()
  },
})
// * ------------------------------- 默认请求创建 结束 -------------------------------

// $ ------------------ 其它请求创建示例 开始 ------------------
export const otherRequest = useService({
  ...defaultConfig,
  baseURL: getBaseURL(),
  withToken: false,
})
// $ ------------------ 其它请求创建示例 结束 ------------------

/** 本地 json 请求 */
export const { Get: LocalGet } = useService({
  baseURL: location.origin + location.pathname,
  native: true,
  timestamp: true,
  version: configItem('version'),
})
