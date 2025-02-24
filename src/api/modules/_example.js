import { Get, Post } from '@/api/service'

/**
 * otherApi 接口
 */
export const ApiOther = {
  /** 获取列表数据 */
  list: (data) => Get(`/list`, data),
}
