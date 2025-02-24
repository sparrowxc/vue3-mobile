import { handler } from '@unocss/preset-mini/utils'
import { camelCase } from '../utils/index.js'
import { SAFE_MAP } from '../utils/constant.js'

/** @type {import('unocss').Rule[]} */
export default [
  // 宽高 wh-
  [
    /^(min-|max-)?wh-(.+)$/,
    ([, minmax, prop], { theme }) => {
      const widthProperty = `${minmax || ''}width`
      const heightProperty = `${minmax || ''}height`

      const width = theme[camelCase(widthProperty)]?.[prop]
      const height = theme[camelCase(heightProperty)]?.[prop]

      if (width != null && height != null) {
        return {
          [widthProperty]: width,
          [heightProperty]: height,
        }
      }
      const value = handler.bracket.cssvar.auto.fraction.px(prop)

      return {
        [widthProperty]: value,
        [heightProperty]: value,
      }
    },
    {
      autocomplete: ['wh-$width|height|maxWidth|maxHeight|minWidth|minHeight', '(max|min)-wh-$width|height|maxWidth|maxHeight|minWidth|minHeight'],
    },
  ],

  // 匹配数字包括小数 => flex-1 flex-2.5
  [/^flex-(\d+\.?\d*)/, ([_, d]) => ({ flex: d })],

  // 全面屏设备的安全区域
  [/p(t|r|b|l|x|y)?-safe/, ([, d]) => SAFE_MAP[d], { autocomplete: ['p(t|r|b|l|x|y)?-safe'] }],

  // 自定义百分比单位 (p) percent
  [
    /^(\w+)-(\d+\.?\d*)p$/,
    ([_, property, d]) => {
      let cssPropertyName = property.replace(/_/g, '-')
      if (cssPropertyName === 'w') cssPropertyName = 'width'
      if (cssPropertyName === 'h') cssPropertyName = 'height'
      return { [cssPropertyName]: `${d}%` }
    },
  ],
]
