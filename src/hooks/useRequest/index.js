import { ref, shallowRef, watchEffect, toValue, isRef, unref } from 'vue'

const baseOptions = {
  method: 'GET',
  params: null,
  manual: false,
  pagination: false,
  debounce: 300,
  onBefore: null,
  onSuccess: null,
  onError: null,
  onFinally: null,
}

const basePaginationConfig = {
  pageNum: 1,
  pageSize: 10,
  append: true,
  numKey: 'pageNum',
  sizeKey: 'pageSize',
  dataKey: 'rows',
  totalKey: 'total',
  totalPageKey: 'totalPages',
  format: null,
}

export const useRequest = (request, options = {}) => {
  if (!urlOrRequest) {
    throw new Error('request is required')
  }

  /** 合并配置项 */
  const mergedOptions = { ...baseOptions, ...options }

  const data = ref(null)
  const response = shallowRef(null)
  const error = shallowRef(null)

  /** 分页相关数据 */
  const list = ref(null)
  const pageNum = ref(1)
  const pageSize = ref(10)
  const total = ref(0)
  const totalPages = ref(0)

  /** 请求状态 */
  const loading = shallowRef(null)
  const finished = shallowRef(null)

  const params = isRef(mergedOptions.params)
  // let params = {}
  if (mergedOptions.params) {
    params = toValue(mergedOptions.params)
  }

  /** 分页 */
  let pagination = mergedOptions.pagination
  if (pagination) {
    pagination = typeof pagination === 'object' ? { ...basePaginationConfig, ...pagination } : basePaginationConfig
    pageNum.value = pagination.pageNum
    pageSize.value = pagination.pageSize
    params = { ...params, [pagination.numKey]: pagination.pageNum, [pagination.sizeKey]: pagination.pageSize }
  }

  const calculateTotalPages = () => {
    totalPages.value = Math.ceil(total.value / pageSize.value)
  }

  const run = async () => {
    if (mergedOptions.onBefore) {
      mergedOptions.onBefore(params)
    }
  }
}

/** vue 的 toValue 方法 */
const toValue = (val) => {
  return val instanceof Function ? val() : unref(val)
}
