import { debounce, isNumber, isObject } from '../utils'

const pluginName = 'debounce'

const baseConfig = {
  wait: 3000,
  leading: false,
  trailing: true,
}

/**
 * 防抖插件
 * @type {import('./types').PluginObject}
 */
export default {
  name: pluginName,
  setup(ctx, options) {
    const debounceConfig = options[pluginName]

    /** @type {import('./types').DebounceConfig} */
    const config = { ...baseConfig, ...debounceConfig }

    if (isNumber(debounceConfig)) {
      config.wait = debounceConfig
    } else if (isObject(debounceConfig)) {
      Object.assign(config, debounceConfig)
    }

    let runImmediate = options.immediate === true
    const serviceFn = ctx.run
    const interval = isNumber(config.wait) ? config.wait : 3000
    const debounceFn = debounce((cb) => cb(), interval, config)

    const cancelDebounce = () => {
      debounceFn && debounceFn.cancel()
    }

    ctx.run = () =>
      new Promise((resolve, reject) => {
        if (runImmediate) {
          runImmediate = false
          serviceFn().then(resolve).catch(reject)
        } else {
          debounceFn(() => {
            serviceFn().then(resolve).catch(reject)
          })
        }
      })

    return {
      onCancel: cancelDebounce,
      onAbort: cancelDebounce,
    }
  },
}
