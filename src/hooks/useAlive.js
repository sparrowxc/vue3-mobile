import { nextTick, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

// 缓存 Set 集合
const aliveSet = ref(new Set())

/** 路由组件缓存 */
export function useAlive(init = false) {
  const route = useRoute()

  // 是否执行了收集
  let collect = false
  // 组件和路径映射
  const componentNames = {}

  /** 缓存名称组 */
  const aliveList = computed(() => {
    return Array.from(aliveSet.value)
  })

  const handleCollect = async () => {
    await nextTick()
    route.matched.forEach((routeMatch) => {
      const { alive } = routeMatch.meta
      if (typeof alive === 'undefined') {
        return
      }
      const { name, __file, __name } = routeMatch.components?.default
      const pageName = name || __name

      if (!pageName) {
        console.warn(`${routeMatch.path} Component name is not defined`)
        return
      }

      // 检查缓存中的组件名称是否重名
      if (componentNames[pageName]) {
        if (componentNames[pageName] !== __file) {
          console.warn(`${__file} 和 ${componentNames[pageName]} Duplicate component name: ${pageName}`)
          return
        }
      } else {
        componentNames[pageName] = __file
      }

      // 添加或移除缓存
      alive === false ? aliveRemove(pageName) : aliveAdd(pageName)
    })
  }

  /** 收集缓存 */
  const collectAlive = () => {
    if (collect) return
    collect = true
    watch(() => route.path, handleCollect, { immediate: true })
  }
  // 初始化执行
  init && collectAlive()

  return { aliveList, collectAlive }
}

/**
 * 添加缓存路由
 * @param {string} name - route name
 * ```js
 * aliveAdd('Detail')
 * ```
 */
export function aliveAdd(name) {
  if (!name || aliveSet.value.has(name)) return
  aliveSet.value.add(name)
}

/**
 * 移除缓存路由
 * @param {string|string[]} name - route name
 * ```js
 * aliveRemove('Detail') // 移除单个
 * aliveRemove(['Form', 'List']) // 移除多个
 * ```
 */
export function aliveRemove(name) {
  const nameList = Array.isArray(name) ? name : [name]
  nameList.forEach((name) => {
    if (name && aliveSet.value.has(name)) {
      aliveSet.value.delete(name)
    }
  })
}

/**
 * 清空缓存路由
 */
export function aliveClear() {
  aliveSet.value.clear()
}
