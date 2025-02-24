import { random } from '../vendor/nanoid'

export { random }

/**
 * 随机英文字符
 * @param {number} n - 长度 默认 6
 * @return {string}
 */
export function randomStr(n) {
  return random(n, 'letter')
}

/**
 * 随机整数
 * @param {number} n - 长度 默认 6
 * @return {number}
 */
export function randomInt(n) {
  return Number(random(n, 'number'))
}
