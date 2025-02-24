/**
 * 获取 object 的 path 路径的值, 如果解析值为 undefined，则返回 defaultValue
 * @param {Object} object 原对象
 * @param {Array|string} path 属性路径
 * @param {*} defaultValue - 默认值
 * @example```js
 * const object = { 'a': [{ 'b': { 'c': 3 } }] }
 * get(object, 'a[0].b.c') // => 3
 * get(object, ['a', '0', 'b', 'c']) // => 3
 * get(object, 'a.b.c', 'default') // => 'default'
 * ```
 */
export const get = (object, path, defaultValue = undefined) => {
  if (!object || !path || typeof object !== 'object') return defaultValue

  const paths = path.replace(/\[(\d+)\]/g, '.$1').split('.')
  let result = object
  for (const p of paths) {
    result = Object(result)[p]
    if (result === undefined) {
      return defaultValue
    }
  }
  return result
}
