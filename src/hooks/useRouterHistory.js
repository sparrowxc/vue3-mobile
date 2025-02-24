import { reactive, toRefs } from 'vue'
import { useRouter } from 'vue-router'

const routerHistoryState = reactive({
  isInit: false,
  historyStack: [],
  transitionName: 'push',
})

export const useRouterHistory = (options = {}) => {
  const initHistoryStack = () => {
    let currentPath = window.location.hash || '/'
    if (currentPath.startsWith('#')) {
      currentPath = currentPath.slice(1)
    }

    const storedHistory = sessionStorage.getItem('historyStack')

    if (storedHistory) {
      routerHistoryState.historyStack = JSON.parse(storedHistory)
    }

    sessionStorage.setItem('historyStack', JSON.stringify(routerHistoryState.historyStack))
  }

  const updateHistoryStack = (to, from) => {
    const toPath = to.fullPath
    const fromPath = from.fullPath
    const stachLength = routerHistoryState.historyStack.length
    const lastPath = routerHistoryState.historyStack[stachLength - 1]

    if (routerHistoryState.isInit) {
      const toPathDepth = toPath.split('/').length
      const fromPathDepth = fromPath.split('/').length
      if (lastPath === toPath || toPath === '/' || toPathDepth < fromPathDepth) {
        options?.onBack?.(to, from)
        routerHistoryState.transitionName = 'back'
        routerHistoryState.historyStack.pop()
      } else if (!routerHistoryState.historyStack.includes(toPath)) {
        options?.onPush?.()
        routerHistoryState.transitionName = 'push'
        routerHistoryState.historyStack.push(fromPath)
      }
    } else {
      routerHistoryState.transitionName = 'none'
    }
    routerHistoryState.isInit = true

    sessionStorage.setItem('historyStack', JSON.stringify(routerHistoryState.historyStack))
  }

  if (!routerHistoryState.isInit) {
    initHistoryStack()
    const router = useRouter()
    router.beforeEach((to, from) => {
      updateHistoryStack(to, from)
    })
  }

  return { ...toRefs(routerHistoryState) }
}
