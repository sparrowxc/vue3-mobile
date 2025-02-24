import { router } from '../../router'
import { isNumber, isObject, isUrl } from '../helper/is'

/** 当前标签页 */
const TARGET_SELF = '_self'
/** 新标签页 */
const TARGET_BLANK = '_blank'

/**
 * @example 普通跳转 第一个参数接受 name 或 path, 若包含 '/' 则为 path
 * ```js
 * linkTo('Home') or linkTo(`/example/detail?id=1`)
 * ```
 *
 * @example 参数传递 { params: {}, query: {} }
 * ```js
 * linkTo('Details', { params: {id: 1} })
 * ```
 *
 * @example 外链跳转 target 属性控制是否在新窗口打开 '_blank' | '_self'
 * ```js
 * linkTo('https://....', { target: '_blank' })
 * ```
 *
 * @param {string|number|LinkToOption} pathOrName
 * @param {LinkToOption} option
 */
export function linkTo(pathOrName, option = {}) {
  if (!pathOrName) return

  if (isNumber(pathOrName)) {
    router.go(pathOrName)
    return
  }

  option = isObject(option) ? option : {}
  const { type = 'push', target = TARGET_SELF, reload } = option

  if (isUrl(pathOrName)) {
    if (pathOrName.endsWith(`+${TARGET_BLANK}`)) {
      pathOrName = pathOrName.split(`+${TARGET_BLANK}`)[0]
      target = TARGET_BLANK
    }
    if (target === TARGET_SELF) {
      openSelf(pathOrName, type === 'replace', reload)
    } else {
      window.open(pathOrName)
    }
  } else {
    if (isObject(pathOrName)) {
      option = pathOrName
    } else {
      option[pathOrName.includes('/') ? 'path' : 'name'] = pathOrName
    }
    router[type](option)
  }
}

/**
 * @param {string|LinkToOption} pathOrName
 * @param {LinkToOption} option
 */
linkTo.replace = (pathOrName, option) => {
  linkTo(pathOrName, { ...option, type: 'replace' })
}

/**
 * 页面刷新
 * @param {RefreshPageOption | boolean} option - 路由参数配置项
 */
linkTo.refresh = (option = true) => {
  let { name, params, query } = router.currentRoute.value
  // 非空对象
  if (isObject(option) && Object.keys(option)) {
    const merge = option.merge || false
    if (option.params) {
      params = merge ? { ...params, ...option.params } : option.params
    }
    if (option.query) {
      query = merge ? { ...query, ...option.query } : option.query
    }
  } else {
    params = option ? params : {}
    query = option ? query : {}
  }
  params['name'] = name
  const replace = option.replace || true
  linkTo('Redirect', { type: replace ? 'replace' : 'push', params, query })
}

/**
 * 刷新当前页面
 * @param {RefreshPageOption|boolean} option - 路由参数配置项
 * ```js
 * refreshPage() // 刷新当前页面
 * refreshPage(false) // 刷新但不保留路由参数
 * refreshPage({ params: {}, query: {} }) // 刷新并[替换]路由参数
 * refreshPage({ params: {}, query: {}, merge: true }) // 刷新并[合并]路由参数
 * ```
 */
export function refreshPage(option = true) {
  linkTo.refresh(option)
}

function openSelf(url, replace = false, reload = false) {
  if (replace) {
    window.location.replace(url)
    return
  }
  if (reload) {
    window.onpageshow = null
    window.onpageshow = () => {
      window.location.reload()
    }
  }
  window.location.href = url
}

/**
 * @typedef {object} LinkToOption
 * @property {string} [name] - route name
 * @property {string} [path] - route path
 * @property {object} [params] - route params
 * @property {object} [query] - route query
 * @property {'push'|'replace'} [type='push'] - router 的跳转方式, 默认 push, 可选 replace
 * @property {'_self'|'_blank'} [target='_self'] - 外链的打开方式, _self(默认值) 当前标签页, _blank 新标签页
 * @property {boolean} [reload=false] - 从外链返回时是否刷新应用页面, 默认 false
 */

/**
 * @typedef {object} RefreshPageOption
 * @property {object} [params] - route params
 * @property {object} [query] - route query
 * @property {boolean} [merge=false] - 是否合并当前 route 的旧参数, 默认不合并
 * @property {boolean} [replace=true] - router.replace
 * @property {boolean} [reload=false] - location.reload - 该配置项会导致其它配置项失效
 */
