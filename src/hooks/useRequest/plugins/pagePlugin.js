import { computed, shallowReactive, watch } from 'vue'
import { debounce, get, isFunction, isNumber, isObject } from '../utils'

const pluginName = 'page'

/** @type {import('./types').PageConfig} config - 默认配置项 */
const baseConfig = {
  append: false,
  num: 0,
  size: 20,
  numKey: 'pageNum',
  sizeKey: 'pageSize',
  dataKey: 'rows',
  totalKey: 'total',
  totalPageKey: 'totalPage',
  wait: 200,
  format: null,
}

const emptyFunc = () => {}

/**
 * 分页插件
 * @type {import('./types').PluginObject}
 */
export default {
  name: pluginName,
  setup(ctx, options) {
    const pageConfig = options[pluginName]

    /** @type {import('./types').PageConfig} */
    const config = { ...baseConfig, ...pageConfig }

    if (typeof pageConfig !== 'boolean') {
      if (isNumber(pageConfig)) {
        config.size = pageConfig
      } else if (isObject(pageConfig)) {
        Object.assign(config, pageConfig)
      }
    }

    /** @type {import('./types').PageReturn} 分页插件上下文 */
    const pageContext = shallowReactive({
      num: config.num,
      size: config.size,
      total: 0,
      totalPage: 1,
      hasPrev: true,
      hasNext: true,
      finished: false,
      prev: emptyFunc,
      next: emptyFunc,
      reload: emptyFunc,
      changeNum: emptyFunc,
      changeSize: emptyFunc,
      changePage: emptyFunc,
    })

    watch(
      () => pageContext.num,
      (newV, oldV) => {
        if (newV !== oldV) {
          pageContext.changeNum(newV)
        }
      }
    )

    watch(
      () => pageContext.size,
      (newV, oldV) => {
        if (newV !== oldV) {
          pageContext.changeSize(newV)
        }
      }
    )

    // 初始请求参数
    let pageParams = {
      num: config.num,
      size: config.size,
    }

    const setCtxParams = (params = pageParams) => {
      ctx.params.value = { ...ctx.params.value, [config.numKey]: params.num, [config.sizeKey]: params.size }
    }

    setCtxParams()

    /** 分页请求 */
    const paging = debounce(
      (params) => {
        pageParams = { ...pageParams, ...params }
        setCtxParams()
        ctx.run()
      },
      config.wait,
      { leading: true, trailing: false }
    )

    // 上一页
    pageContext.prev = () => {
      pageContext.hasPrev = !(config.append || pageContext.num <= 1)

      if (!pageContext.hasPrev) return

      pageContext.num -= 1
    }

    // 是否没有更多
    const noMore = computed(() => (pageContext.totalPage ? pageContext.num >= pageContext.totalPage : ctx.list.value.length >= pageContext.total))

    // 下一页
    pageContext.next = () => {
      pageContext.hasNext = !noMore.value

      if (!pageContext.hasNext) return

      pageContext.num += 1
    }

    // 改变当前页码
    pageContext.changeNum = (num) => {
      if (num < 1 || num > pageContext.totalPage) return
      paging({ num })
    }

    // 改变 size 每页条数
    pageContext.changeSize = (size) => {
      paging({ size })
    }

    // 同时改变 num 和 size
    pageContext.changePage = (num, size) => {
      paging({ num, size })
    }

    /** 清空数据重新请求 */
    pageContext.reload = () => {
      pageContext.totalPage = 1
      pageContext.num = 0
      setTimeout(() => {
        pageContext.num = 1
      }, 0)
    }

    ctx.page = pageContext

    /** 数据处理 */
    const handleDataList = () => {
      pageContext.total = get(ctx.response.value, config.totalKey, 0)
      pageContext.totalPage = get(ctx.response.value, config.totalPageKey, Math.ceil(pageContext.total / pageContext.size))
      pageContext.finished = noMore.value

      if (pageContext.num === 1 || !config.append) {
        ctx.list.value = []
      }
      const dataList = get(ctx.response.value, config.dataKey, ctx.response.value)
      const items = Array.isArray(dataList) ? dataList : [dataList]
      items.forEach((item, index) => {
        if (isFunction(config.format)) {
          const res = config.format(item, index)
          item = res ?? item
        }
        ctx.list.value.push(item)
      })
    }

    return {
      onSuccess() {
        handleDataList()
      },
    }
  },
}
