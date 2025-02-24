import dayjs from 'dayjs'
import advancedFormat from 'dayjs/plugin/advancedFormat'
import arraySupport from 'dayjs/plugin/arraySupport'
import localeData from 'dayjs/plugin/localeData'
import localizedFormat from 'dayjs/plugin/LocalizedFormat'
import relativeTime from 'dayjs/plugin/relativeTime'
import toArray from 'dayjs/plugin/toArray'

import 'dayjs/locale/zh-cn'

// 插件组
const plugins = [advancedFormat, localizedFormat, localeData, arraySupport, relativeTime, toArray]

// 默认语言中文
dayjs.locale('zh-cn')

// 插件列表加载
plugins.forEach((plugin) => {
  dayjs.extend(plugin)
})

export const Day = dayjs

/**
 * 将给定值转换为 Unix 时间戳。
 * @param {any} v - 要转换的值.
 * @param {'s'|'ms'} [unit='ms'] - 时间戳的单位。默认值为 'ms'.
 * @return {number}.
 */
export function toUnix(v, unit = 'ms') {
  const len = String(v).length

  if (typeof v === 'string') {
    if (String(Number(v)) === v) {
      v = len > 10 ? Number(v) : Number(v) * 1000
    }
  }

  // 验证是否为有效日期
  const result = Day(v).format(unit === 'ms' ? 'x' : 'X')
  return Number(result)
}
