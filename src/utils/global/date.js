import { Day, toUnix } from '../vendor/dayjs'

/**
 * 根据指定的格式设置日期的格式 - https://dayjs.gitee.io/zh-CN/
 * @param {any} v - 要格式化的值
 * @param {string} format - 格式化占位符 - 默认值为“YYYY-MM-DD”. https://dayjs.gitee.io/docs/zh-CN/display/format
 * @param {string} locale - 语言 - 默认值为“zh-cn”
 */
export function dateFormat(v, format = 'YYYY-MM-DD', locale = 'zh-cn') {
  if (v === 0 || typeof v === 'undefined') {
    v = void 0
  } else {
    v = toUnix(v)
  }
  return Day(v).locale(locale).format(format)
}
