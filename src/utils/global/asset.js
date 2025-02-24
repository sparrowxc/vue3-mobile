import { configItem } from '../../config'
import { isUrl, isBoolean } from '../helper/is'

/** 资源组集合 */
export const assetsMap = {
  img: import.meta.glob('/src/assets/img/**/*.(gif|png|jpg|jpeg|webp|svg|bmp|tif)', { eager: true, import: 'default' }),
  video: import.meta.glob('/src/assets/video/**/*.(swf|avi|flv|mpg|mov|wav|mkv|rmvb|mp4)', { eager: true, import: 'default' }),
  file: import.meta.glob('/src/assets/file/**/*.(pdf|doc|docx|xls|xlsx|txt)', { eager: true, import: 'default' }),
}

/**
 * 资源完整地址拼接
 * @param {string|string[]} value - 待处理的地址.
 * @param {boolean|string} prefix - 如果为 true, 使用 默认的 api 接口配置, 如果是地址字符串,则直接拼接.
 * @param {boolean} proxy - 是否使用代理地址, 默认不使用
 */
export function fullPath(value, prefix = true, proxy = false) {
  if (!value || !value.length || !prefix) return value

  const isValueArray = Array.isArray(value)
  const list = isValueArray ? value : [value]

  const apiGroup = configItem('apiGroup')
  const groupKeys = Object.keys(apiGroup)
  const firstKey = groupKeys[0]

  // 前缀地址处理
  if (isBoolean(prefix)) {
    prefix = firstKey
  }
  if (!isUrl(prefix) && apiGroup[prefix]) {
    prefix = apiItemPrefix(apiGroup[prefix], prefix, proxy)
  }
  prefix = prefix.endsWith('/') ? prefix : prefix + '/'

  // 资源地址处理
  for (let i = 0; i < list.length; i++) {
    let val = list[i]
    // 已经是完整地址就不处理
    if (isUrl(val)) {
      continue
    }
    val = String(val)
    val = val.startsWith('/') ? val.slice(1) : val
    const result = prefix + val
    list[i] = result
  }
  return isValueArray ? list : list[0]
}

/**
 * 本地资源路径
 * @param {string} val - 资源路径
 * @param {string} [dir='img'] - 资源模块目录
 */
export function assetURL(val, dir = 'img') {
  const modules = assetsMap[dir]
  if (!modules || !Object.keys(modules).length) return val

  let path = val
  // 移除 / 或 @
  if (path.startsWith('/') || path.startsWith('@')) {
    path = path.slice(1)
  }
  // 移除 dir
  if (path.startsWith(dir)) {
    path = path.slice(dir.length + 1)
  }
  // 添加 /
  path = path.startsWith('/') ? path : `/${path}`
  const pathKey = `/src/assets/${dir}${path}`

  if (Object.prototype.hasOwnProperty.call(modules, pathKey)) {
    return modules[pathKey]
  }
  return val
}

/** 图片地址 - [assets/img] */
export function imgURL(val, prefix, useProxy) {
  return prefix ? fullPath(val, prefix, useProxy) : assetURL(val, 'img')
}

/** 视频地址 - [assets/video] */
export function videoURL(val, prefix, useProxy) {
  return prefix ? fullPath(val, prefix, useProxy) : assetURL(val, 'video')
}

/** 其它文件地址 - [assets/file] */
export function fileURL(val, prefix, useProxy) {
  return prefix ? fullPath(val, prefix, useProxy) : assetURL(val, 'file')
}

/**
 * 获取 API 的资源前缀地址
 * @param {Object} apiItem
 */
function apiItemPrefix(apiItem, groupName, useProxy) {
  if (apiItem.assetPrefix) {
    return apiItem.assetPrefix
  }

  let { url, key, devUrl, enableProxy = true } = apiItem || {}
  if (import.meta.env.DEV) {
    url = useProxy && enableProxy ? `/${key || groupName}` : devUrl || url
  }

  return url
}
