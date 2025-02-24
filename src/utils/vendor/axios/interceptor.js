/** @type {import('axios').AxiosRequestConfig['responseKeyMap']} */
const defResponseKeyMap = {
  code: ['code', 'status'],
  msg: ['msg', 'message'],
  data: ['data', 'rows'],
  succeedMethods: ['post', 'put', 'delete'],
  succeedScopes: ['0', '200-299'],
}

/**
 * @type {import('axios').IRequestInterceptorTuple} - 请求拦截
 */
export const requestInterceptor = [
  (config) => {
    let { onStart, withToken, authScheme = 'Bearer ', getAuthToken, addPayload, extraData, timestamp, version } = config

    // 请求开始
    isFunction(onStart) && onStart(config)

    // 请求头添加认证token
    if (withToken && isFunction(getAuthToken)) {
      const token = getAuthToken()
      if (token) {
        config.headers.Authorization = (authScheme || '') + token
      }
    }

    // 添加额外请求参数
    addPayload = addPayload || extraData
    if (isFunction(addPayload)) {
      const extraPayload = addPayload(config)
      if (isObject(extraPayload)) {
        const type = config.data ? 'data' : 'params'
        config[type] = { ...extraPayload, ...config[type] }
      }
    }

    // 添加版本
    if (version) {
      config.params = { ...config.params, _v_: version }
    }

    // 添加时间戳
    if (timestamp) {
      const t = Date.now()
      config.params = { ...config.params, _t_: t }
    }

    return config
  },
]

// 错误码映射
const errorCodeMap = {
  // noAuth: [401, 403],
  noAuth: [401],
}

/**
 * @type {import('axios').IResponseInterceptorTuple} - 响应拦截
 */
export const responseInterceptor = [
  (response) => {
    let {
      method,
      responseKeyMap,
      native,
      onSuccess,
      showSucceed,
      onError,
      showFailure,
      authFailedCode = errorCodeMap.noAuth,
      onAuthFailed,
      onFinish,
    } = response.config

    // 请求结束
    isFunction(onFinish) && onFinish()

    // 是否返回原始数据
    if (native || Array.isArray(response.data) || !isObject(response.data)) {
      isFunction(onSuccess) && onSuccess(response, response.config)
      return response.data
    }

    const responseData = { ...response.data }
    responseKeyMap = isObject(responseKeyMap) ? { ...defResponseKeyMap, ...responseKeyMap } : { ...defResponseKeyMap }

    const resCode = findKeys(responseData, responseKeyMap.code) || response.status
    const resMessage = findKeys(responseData, responseKeyMap.msg)
    const ApiData = {
      code: resCode ? Number(resCode) : 0,
      message: resMessage ? String(resMessage) : '',
      data: findKeys(responseData, responseKeyMap.data, false),
    }
    // 补充其它属性
    const extraData = {}
    Object.keys(responseData).forEach((key) => {
      ApiData[key] = responseData[key]
      extraData[key] = responseData[key]
    })
    if (!ApiData.data) {
      ApiData.data = extraData
    }

    // 成功
    if (inScope(ApiData.code, responseKeyMap.succeedScopes)) {
      if (showSucceed !== false && !showSucceed) {
        response.config.showSucceed = Array.isArray(responseKeyMap.succeedMethods) && responseKeyMap.succeedMethods.includes(method)
      }
      isFunction(onSuccess) && onSuccess(ApiData, response.config)
      return ApiData
    }
    // 认证失败
    if (isFunction(onAuthFailed) && Array.isArray(authFailedCode) && authFailedCode.includes(ApiData.code)) {
      onAuthFailed()
    }
    const errorMsg = isString(showFailure) ? showFailure : ApiData.message
    // 失败
    isFunction(onError) && onError(response, ApiData.code, errorMsg)
    return Promise.reject(response)
  },
  (error) => {
    return new Promise((_resolve, reject) => {
      let { onError, showFailure = true, responseKeyMap, authFailedCode = errorCodeMap.noAuth, onAuthFailed, onFinish } = error?.config || {}
      isFunction(onFinish) && onFinish()
      // 认证失败
      const responseStatus = error?.response?.status
      if (isFunction(onAuthFailed) && responseStatus && Array.isArray(authFailedCode) && authFailedCode.includes(responseStatus)) {
        onAuthFailed()
      }

      let errorMessage
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        errorMessage = '接口请求超时,请刷新页面重试!'
      }
      if (String(error).includes('Network Error')) {
        errorMessage = '网络异常,请检查您的网络连接是否正常!'
      }
      if (error.code === 'ERR_CANCELED') {
        errorMessage = '请求已被取消'
        error.config.showFailure = false
      }
      if (!errorMessage && error.config.showFailure) {
        if (isString(showFailure)) {
          errorMessage = showFailure
        } else {
          if (error?.response) {
            responseKeyMap = isObject(responseKeyMap) ? { ...defResponseKeyMap, ...responseKeyMap } : { ...defResponseKeyMap }
            errorMessage = findKeys(error?.response?.data, responseKeyMap.msg) || error.response.statusText
          }
          errorMessage = errorMessage || error.message || error.name
        }
      }

      isFunction(onError) && onError(error, responseStatus, errorMessage)
      reject(error)
    })
  },
]

function isFunction(fn) {
  return fn instanceof Function
}

function isObject(val) {
  return val !== null && typeof val === 'object'
}

function isString(val) {
  return typeof val === 'string'
}

function findKeys(obj, keys, del = true) {
  if (!obj || !keys) return null
  keys = Array.isArray(keys) ? keys : [keys]
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i]
    const value = obj[key]
    if (value) {
      del && delete obj[key]
      return value
    }
  }
}

function inScope(value, scopes, splitStr = '-') {
  const comparison = Number(value)
  // 定义返回结果
  let result = false
  // 判断数值是否在范围组闭区间内
  result = scopes.some((scope) => {
    const scopeArr = scope ? scope.split(splitStr).map((item) => Number(item)) : []
    // 如果长度大于1,则比较两端,否则判断是否相等
    if (scopeArr.length > 1) {
      return comparison >= scopeArr[0] && comparison <= scopeArr[scopeArr.length - 1]
    }
    return comparison === scopeArr[0]
  })
  return result
}
