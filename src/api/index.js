import { Get, Post, UploadFile } from '@/api/service'

export const ApiBase = {
  login: (data) => Post(`/login`, data),
  list: (data) => Get('/list', data),
}

/**
 * 文件上传
 * @param {import('axios').UploadFileParams} params
 * @param {import('axios').AxiosRequestConfig} config
 */
export const $upload = (params, config) => UploadFile(`/common/upload`, params, { ...config, loading: false })

// download: (url) => Get(`${url}?v=${+new Date()}`, null, { responseType: 'blob', native: true }),
