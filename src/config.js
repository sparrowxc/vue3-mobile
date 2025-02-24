import { name as pkgName, version as pkgVersion } from '../package.json'

export const configKey = '__SPARROW_CONF__'

export const appConfig = {
  title: '应用标题',
  name: 'appName',
  version: '1.0.0',
  apiGroup: {
    // 默认的接口请求
    api: {
      name: 'api',
      url: 'http://localhost:3000/api',
      devUrl: '',
      assetPrefix: '',
      enableProxy: false,
      origin: '',
    },
    otherApi: {
      name: 'otherApi',
      url: 'http://localhost:4000/api',
    },
  },
}

export function getAppConfig() {
  return appConfig
  // return import.meta.env.DEV ? appConfig : window[configKey]
}

export function configItem(key) {
  return getAppConfig()[key]
}

export function apiItem(apiKey, key) {
  const item = getAppConfig().apiGroup[apiKey]
  if (!item) return
  return key === 'url' ? (import.meta.env.PROD ? item.url : item.devUrl || item.url) : item[key]
}

export function getBaseURL(apiKey) {
  return apiItem(apiKey, 'url')
}

export function appPrefix(val) {
  const name = configItem('name') || pkgName
  const version = configItem('version') || pkgVersion
  return `${name}_${version}-${val}`
}
