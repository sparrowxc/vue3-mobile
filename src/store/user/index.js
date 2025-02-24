import { defineStore } from 'pinia'
import { isBoolean, isString } from '@/utils/helper/is'
import { toUnix } from '@/utils/vendor/dayjs'

/**
 * 用户信息 store
 */
export const useUserStore = defineStore('user', {
  state: () => ({
    token: '',
    expire: 0,
    // 其它接口地址的 token - 如果需要存储的话
    tokenMap: {
      otherApi: { token: '', expire: 0 },
    },
    /** 用户信息 */
    info: {},
  }),
  getters: {},
  actions: {
    /** 清除 token */
    removeToken(removeKey = true) {
      this.token = ''
      this.expire = 0
      if (isString(removeKey)) {
        removeKey = removeKey.split(',')
      }
      removeKey = isBoolean(removeKey) && removeKey ? Object.keys(this.tokenMap) : removeKey
      if (removeKey) {
        removeKey.forEach((key) => {
          this.tokenMap[key] = { token: '', expire: 0 }
        })
      }
    },
    /** 判断 token 是否过期 */
    checkTokenExpire() {
      if (this.expire === 0) return
      const expireTime = toUnix(this.expire)
      const now = Date.now()
      /** 过期 */
      if (now > expireTime) {
        this.removeToken()
      }
    },
  },
  persist: true,
})
