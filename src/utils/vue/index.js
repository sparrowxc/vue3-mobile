import { getCurrentInstance, onScopeDispose, unref, toValue } from 'vue'

/** 获取元素或 Vue 组件实例 */
export function unrefElement(elRef) {
  const plain = toValue(elRef)
  return plain?.$el ?? plain
}

/** 如果在生命周期内, 则执行 onScopeDispose() */
export function tryOnScopeDispose(fn) {
  if (getCurrentInstance()) {
    onScopeDispose(fn)
    return true
  }
  return false
}
