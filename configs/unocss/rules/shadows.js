import { colorResolver, colorableShadows, hasParseableColor, handler } from '@unocss/preset-mini/utils'
import { numberWithUnitRE } from '../utils/constant.js'

/** @type {import('unocss').Rule[]} */
export default [
  // box-shadow 盒阴影
  [
    /^bs(?:-(.+))?$/,
    (match, context) => {
      let [, d] = match
      const { theme } = context
      const v = theme.boxShadow?.[d || 'DEFAULT']

      if (d && !Number.isNaN(parseInt(d))) {
        d = '[' + d + ']'
      }
      let c = d ? handler.bracket.cssvar(d) : undefined

      if ((v != null || c != null) && !hasParseableColor(c, theme, 'shadowColor')) {
        let cList
        if (c && c.length) {
          cList = c.includes(',') ? c.split(',').map((v) => v.split(' ')) : [c.split(' ')]
        }

        if (cList && cList.length) {
          for (let i = 0; i < cList.length; i++) {
            const cNumList = []
            const cStrList = []
            for (let k = 0; k < cList[i].length; k++) {
              let v = cList[i][k]
              if (numberWithUnitRE.test(v)) {
                v = handler.bracketOfLength.rem(v)
                cNumList.push(v)
              } else {
                cStrList.push(v)
              }
            }
            if (cNumList.length === 1) {
              cNumList.unshift('0')
              cNumList.unshift('0')
            } else if (cNumList.length === 2) {
              cNumList.push('0')
            }
            cList[i] = [].concat(cNumList, cStrList).join(' ')
            cList[i] = colorableShadows(cList[i], '--un-shadow-color') + 'var(--un-shadow-inset)'
          }
          c = cList.join(',')
        }
        return {
          '--un-shadow': v ? colorableShadows(v, '--un-shadow-color').join(',') : c,
          'box-shadow': 'var(--un-ring-offset-shadow), var(--un-ring-shadow), var(--un-shadow)',
        }
      }
      return colorResolver('--un-shadow-color', 'shadow', 'shadowColor')(match, context)
    },
    { autocomplete: ['bs-$colors', 'bs-$boxShadow'] },
  ],
  ['bs-inset', { '--un-shadow-inset': 'inset' }],
  // text-shadow 文字阴影
  [
    /^ts(?:-(.+))?$/,
    (match, context) => {
      let [, d] = match
      const { theme } = context
      const v = theme.textShadow?.[d || 'DEFAULT']

      // 若包含数值,用 "[]" 包裹
      if (d && !Number.isNaN(parseInt(d))) {
        d = '[' + d + ']'
      }
      let c = d ? handler.bracket.cssvar(d) : undefined

      if ((v != null || c != null) && !hasParseableColor(c, theme, 'shadowColor')) {
        let cList
        if (c && c.length) {
          cList = c.includes(',') ? c.split(',').map((v) => v.split(' ')) : [c.split(' ')]
        }

        if (cList && cList.length) {
          for (let i = 0; i < cList.length; i++) {
            const cNumList = []
            const cStrList = []
            for (let k = 0; k < cList[i].length; k++) {
              let v = cList[i][k]
              if (numberWithUnitRE.test(v)) {
                v = handler.bracketOfLength.rem(v)
                cNumList.push(v)
              } else {
                cStrList.push(v)
              }
            }
            if (cNumList.length === 1) {
              cNumList.unshift('0')
              cNumList.unshift('0')
            } else if (cNumList.length === 2) {
              cNumList.push('0')
            }
            cList[i] = [].concat(cNumList, cStrList).join(' ')
            cList[i] = colorableShadows(cList[i], '--un-text-shadow-color')
          }
          c = cList.join(',')
        }
        return {
          '--un-text-shadow': v ? colorableShadows(v, '--un-text-shadow-color').join(',') : c,
          'text-shadow': 'var(--un-text-shadow)',
        }
      }
      return colorResolver('--un-text-shadow-color', 'shadow', 'shadowColor')(match, context)
    },
    { autocomplete: ['ts-$colors', 'ts-$textShadow'] },
  ],
]
