export { toValue } from 'vue'
export { isUndefined, isBoolean, isObject, isFunction, isPromise, isNumber, isOnline, isDocumentVisible } from '@/utils/helper/is'
export { debounce } from '@/utils/helper/debounce'
export { throttle } from '@/utils/helper/throttle'
export { get } from '@/utils/helper/object/get'
export { useEventListener } from '@/utils/vue/eventListener'

/** 检查是否支持取消请求 */
export const supportsAbort = typeof AbortController === 'function'

/** 通过比较两个对象的值来检查它们是否相等 */
export const isObjectEqual = (obj1, obj2) => {
  if (obj1 === obj2) return true

  if (typeof obj1 !== 'object' || typeof obj2 !== 'object' || obj1 === null || obj2 === null) {
    return false
  }

  const keys1 = Object.keys(obj1)
  const keys2 = Object.keys(obj2)

  if (keys1.length !== keys2.length) return false

  for (let key of keys1) {
    if (!keys2.includes(key) || !isObjectEqual(obj1[key], obj2[key])) {
      return false
    }
  }

  return true
}

/** 过滤空值 */
export const filterEmptyValues = (obj) => {
  if (typeof obj === 'object') {
    Object.keys(obj).forEach((key) => {
      const value = obj[key]
      if (value === null || value === undefined || (typeof value === 'string' && value.trim() === '')) {
        Reflect.deleteProperty(obj, key)
      }
    })
  }
}
