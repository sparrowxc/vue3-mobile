import { toValue } from 'vue'
import { tryOnScopeDispose, unrefElement } from './index'
import { isObject } from '../helper/is'

export function useEventListener(...args) {
  let target
  let events
  let listeners
  let options

  if (typeof args[0] === 'string' || Array.isArray(args[0])) {
    ;[events, listeners, options] = args
    target = window
  } else {
    ;[target, events, listeners, options] = args
  }

  if (!target) {
    return () => {}
  }

  if (!Array.isArray(events)) {
    events = [events]
  }
  if (!Array.isArray(listeners)) {
    listeners = [listeners]
  }

  const cleanups = []
  const cleanup = () => {
    cleanups.forEach((fn) => fn())
    cleanups.length = 0
  }

  const register = (el, event, listener, options) => {
    el.addEventListener(event, listener, options)
    return () => el.removeEventListener(event, listener, options)
  }

  const stopWatch = watch(
    () => [unrefElement(target), toValue(options)],
    ([el, options]) => {
      cleanup()
      if (!el) return

      const optionsClone = isObject(options) ? { ...options } : options
      cleanups.push(...events.flatMap((event) => listeners.map((listener) => register(el, event, listener, optionsClone))))
    },
    { immediate: true, flush: 'post' }
  )

  const stop = () => {
    stopWatch()
    cleanup()
  }

  tryOnScopeDispose(stop)

  return stop
}
