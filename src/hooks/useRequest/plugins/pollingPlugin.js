import { isNumber, isObject, isOnline, isDocumentVisible, useEventListener, toValue } from '../utils'

const pluginName = 'polling'

const baseConfig = {
  interval: 1000,
  keepWhenHidden: false,
  keepWhenOffline: false,
  stop: false,
}

/**
 * 轮询请求
 * @type {import('./types').PluginObject}
 */
export default {
  name: pluginName,
  setup(ctx, options) {
    const pollingConfig = options[pluginName]

    const config = { ...baseConfig, ...pollingConfig }

    if (isNumber(pollingConfig)) {
      config.interval = pollingConfig
    } else if (isObject(pollingConfig)) {
      Object.assign(config, pollingConfig)
    }

    let stopWhenHiddenOrOffline = false

    /** 是否保持轮询 */
    const isKeepPolling = () => {
      return (config.keepWhenHidden || isDocumentVisible()) && (config.keepWhenOffline || isOnline())
    }

    const createPolling = (func) => {
      if (ctx.error.value) return

      let timerId
      if (config.interval) {
        if (isKeepPolling()) {
          timerId = setTimeout(func, config.interval)
        } else {
          // 停止轮询
          stopWhenHiddenOrOffline = true
          return
        }
      }

      return () => timerId && clearTimeout(timerId)
    }

    let pollingFunc

    /** 清除一次轮询 */
    const stopPolling = () => {
      pollingFunc && pollingFunc()
    }

    /** 更新轮询 */
    const updatePolling = () => {
      pollingFunc = createPolling(() => ctx.run())
    }

    // * --------------------------- 事件监听 开始 ---------------------------
    const cleanups = []
    const cleanup = () => {
      cleanups.forEach((fn) => fn())
      cleanups.length = 0
    }

    /** 页面恢复显示和断网恢复后继续轮询 */
    const continuePolling = () => {
      if (stopWhenHiddenOrOffline && isKeepPolling()) {
        stopWhenHiddenOrOffline = false
        updatePolling()
      }
    }

    // visibilitychange
    if (!config.keepWhenHidden) {
      const cleanVisible = useEventListener(
        'visibilitychange',
        () => {
          if (isDocumentVisible()) continuePolling()
        },
        false
      )
      cleanups.push(cleanVisible)
    }

    // online
    if (!config.keepWhenOffline) {
      const cleanOnline = useEventListener('online', continuePolling, false)
      cleanups.push(cleanOnline)
    }
    // * --------------------------- 事件监听 结束 ---------------------------

    onUnmounted(() => {
      stopPolling()
      cleanup()
    })

    return {
      onBefore({ cancel }) {
        stopPolling()
        if (toValue(config.stop)) {
          cancel()
        }
      },
      onCancel: stopPolling,
      onAfter() {
        if (!toValue(config.stop)) {
          updatePolling()
        }
      },
    }
  },
}
