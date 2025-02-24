import axios from 'axios'
import { requestInterceptor, responseInterceptor } from './interceptor'

/**
 * @param {requestConfig} config
 * @return {import('axios').AxiosInstance}
 */
export const createRequest = (config) => {
  const request = axios.create(config)

  // 请求拦截
  request.interceptors.request.use(requestInterceptor[0], requestInterceptor[1] || ((error) => Promise.reject(error)))
  // 响应拦截
  request.interceptors.response.use(responseInterceptor[0], responseInterceptor[1] || ((error) => Promise.reject(error)))

  return request
}

/**
 * @param {requestConfig} config
 */
export const useService = (config = {}) => {
  const service = createRequest(config)

  const sendRequest = (url, data, config) => {
    const mergedConfig = { url, ...data, ...config }
    return service(mergedConfig)
  }

  /**
   * Get 请求
   * @param {string} url
   * @param {object} [data={}]
   * @param {requestConfig} [config={}]
   * @return {requestPromise}
   */
  const Get = (url, data, config) => sendRequest(url, { params: data }, { ...config, method: 'get' })

  /**
   * Post 请求
   * @param {string} url
   * @param {object} [data={}]
   * @param {requestConfig} [config={}]
   * @return {requestPromise}
   */
  const Post = (url, data, config) => sendRequest(url, { data }, { ...config, method: 'post' })

  /**
   * Post params 请求
   * @param {string} url
   * @param {object} [data={}]
   * @param {requestConfig} [config={}]
   * @return {requestPromise}
   */
  const PostByParams = (url, data, config) => sendRequest(url, { params: data }, { ...config, method: 'post' })

  /**
   * Put 请求
   * @param {string} url
   * @param {object} [data={}]
   * @param {requestConfig} [config={}]
   * @return {requestPromise}
   */
  const Put = (url, data, config) => sendRequest(url, { data }, { ...config, method: 'put' })

  /**
   * Delete 请求
   * @param {string} url
   * @param {object} [data={}]
   * @param {requestConfig} [config={}]
   * @return {requestPromise}
   */
  const Del = (url, data, config) => sendRequest(url, { params: data }, { ...config, method: 'delete' })

  /**
   * 文件上传请求
   * @param {string} url
   * @param {import('axios').UploadFileParams} params
   * @param {requestConfig} [config={}]
   * @return {requestPromise}
   */
  const UploadFile = (url, params, config = {}) => {
    if (!params.file) {
      return Promise.reject(new Error('Missing file'))
    }

    const formData = new FormData()
    let { fileKey = 'file', file, filename, data = {} } = params
    if (typeof filename === 'function') {
      filename = filename(params.file)
    }
    formData.append(fileKey, file, typeof filename === 'string' ? filename : undefined)
    if (typeof data === 'object') {
      for (const key of Object.keys(data)) {
        const value = data[key]
        if (value) {
          const dataKey = Array.isArray(value) ? `${key}[]` : key
          formData.append(dataKey, value)
        }
      }
    }

    config.transformRequest = (data) => data
    if (!config.headers) {
      config.headers = {}
    }
    config.headers['Content-Type'] = 'multipart/form-data;charset=UTF-8'

    return sendRequest(url, { data: formData }, { ...config, method: 'post' })
  }

  return { service, Get, Post, PostByParams, Put, Del, UploadFile }
}

/**
 * @typedef requestConfig
 * @type {import('axios').AxiosRequestConfig}
 */

/**
 * @typedef requestPromise
 * @type {Promise<import('axios').IResponseType>}
 */
