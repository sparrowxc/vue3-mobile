/**
 * 节流
 * @see https://www.lodashjs.com/docs/lodash.throttle
 */
import { isObject } from './is'
import { debounce } from './debounce'

export function throttle(func, wait, options) {
  let leading = true
  let trailing = true

  if (typeof func !== 'function') {
    throw new TypeError('Expected a function')
  }
  if (isObject(options)) {
    leading = 'leading' in options ? !!options.leading : leading
    trailing = 'trailing' in options ? !!options.trailing : trailing
  }
  return debounce(func, wait, {
    leading,
    trailing,
    maxWait: wait,
  })
}
