import { isArray, isObject, isPlainObject } from '../is'

function baseMerge(origin, target) {
  for (const key in target) {
    if (target[key] === undefined) {
      continue
    }
    if (!isObject(target[key]) || !isObject(origin[key]) || !(key in origin)) {
      origin[key] = target[key]
      continue
    }
    if (isPlainObject(target[key]) || isArray(target[key])) {
      baseMerge(origin[key], target[key])
    }
  }
}

/**
 * 对象递归合并 - 改变原对象
 * @param {Object} object 原对象
 * @param {...Object} [sources] 待合并的目标对象
 * @returns {Object} 返回原对象
 * @example```js
 * const object = { a: [{ b: 2 }, { d: 4 }] }
 * const other = { a: [{ c: 3 }, { e: 5 }] }
 * merge(object, other) // => { a: [{ b: 2, c: 3 }, { d: 4, e: 5 }] }
 * ```
 */
export function merge(origin, ...others) {
  const result = Object.assign({}, origin)
  if (!others.length) return result
  for (const item of others) {
    baseMerge(result, item)
  }
  return result
}
