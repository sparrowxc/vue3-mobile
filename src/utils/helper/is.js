const toString = Object.prototype.toString
const is = (val, type) => {
  return toString.call(val) === `[object ${type}]`
}

// 特殊类型
export const isNull = (val) => val === null
export const isUndefined = (val) => val === undefined
export const isNil = (val) => isNull(val) || isUndefined(val)

// 基本类型
export const isNumber = (val) => is(val, 'Number')
export const isString = (val) => is(val, 'String')
export const isBoolean = (val) => is(val, 'Boolean')

// 复杂类型
export const isObject = (val) => val !== null && typeof val === 'object'
export const isPlainObject = (val) => is(val, 'Object')
export const isArray = (val) => Array.isArray(val)
export const isArrayBuffer = (val) => is(val, 'ArrayBuffer')
export const isMap = (val) => is(val, 'Map')
export const isSet = (val) => is(val, 'Set')

// 函数类型
export const isFunction = (fn) => fn instanceof Function
export const isPromise = (fn) => isObject(fn) && isFunction(fn.then) && isFunction(fn.catch)

// Dom 元素节点
export const isElement = (val) => isObject(val) && val.nodeType === 1

// 设备类型
const ua = window.navigator.userAgent
/** 安卓设备 */
export const isAndroid = /android/i.test(ua)
/** 苹果设备 */
export const isIos = /iP(ad|hone|od)/i.test(ua)
/** 微信端 */
export const isWechat = /micromessenger/i.test(ua)
/** 浙政钉 */
export const isZzd = /taurusapp/i.test(ua)

// 状态
export const isDev = import.meta.env.DEV
export const isProd = import.meta.env.PROD
export const isOnline = () => window.navigator?.onLine ?? true
export const isDocumentVisible = () => window.document?.visibilityState === 'visible' ?? true

export const isEmpty = (val) => {
  if (!val) return !val
  if (isString(val) || isArray(val)) {
    return val.length === 0
  }
  if (isObject(val)) {
    return Object.keys(val).length === 0
  }
  if (isMap(val) || isSet(val)) {
    return val.size === 0
  }
  return false
}

// 扩展判断
const urlReg = /^(https?:)?\/\/[\w-]+(\.[\w-]+)*(\/[\w- ./?%&=]*)?/
const strictUrlReg = /^http(s)?:\/\/[\w-]+(\.[\w-]+)*(\/[\w- ./?%&=]*)?/
export const isUrl = (path, strict = false) => {
  if (!path) return false
  const reg = strict ? strictUrlReg : urlReg
  return reg.test(path)
}
