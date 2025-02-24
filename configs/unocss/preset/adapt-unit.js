import { pxRE, remRE } from '../utils/constant.js'

/**
 * 单位适配 默认单位是 px
 * @param {Option} [option={}]
 * @returns {import('unocss').Preset}
 */
export default function adaptUnit(option) {
  const { baseFontSize = 4, unit = 'px' } = option || {}

  return {
    name: 'unocss-adapt-applet-unit',
    postprocess: (util) => {
      util.entries.forEach((i) => {
        let multiplier = unit === 'rpx' ? 2 : 1
        const value = i[1]
        if (value && typeof value === 'string') {
          let reg = pxRE

          if (remRE.test(value)) {
            multiplier = baseFontSize * multiplier
            reg = remRE
          }
          i[1] = value.replace(reg, (_, p1) => `${p1 * multiplier + unit}`)
        }
      })
    },
  }
}

/**
 * @typedef {Object} Option
 * @property {number} [baseFontSize=4] - base font-size
 * @property {string} [unit='px'] - unit
 * @property {number} [deviceRatio=1] - deviceRatio
 */
