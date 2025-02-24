import { customAlphabet, urlAlphabet } from 'nanoid'

// 字典组
const alphabetMap = {
  // 默认字典(带符号)
  default: urlAlphabet,
  // 纯数字
  number: '2619834075',
  // 纯英文字母
  letter: 'useandomTPXpxJACKVERYMINDBUSHWOLFGQZbfghjklqvwyzrict',
}

/**
 * 生成指定个数的随机字符串.
 *
 * @param {number} n - 字符串长度. 默认值 6.
 * @param {'string'|'number'|'letter'} dict - 字典类型.
 * @return {string}
 */
export function random(n = 6, dict) {
  // 取整数
  n = parseInt(n) || 6

  const alphabet = alphabetMap[dict] || dict

  const nanoid = customAlphabet(alphabet)

  return nanoid(n)
}
