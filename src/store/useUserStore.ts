import { defineStore } from 'pinia'
import { getUserInfoAPI, getUserProfileAPI } from '@/api/user'
export const useUserStore = defineStore('user', {
  state: () => ({
    // 用来存储 token 信息的对象，将来这个对象中会包含两个属性 { token, refresh_token }
    tokenInfo: JSON.parse(localStorage.getItem('state') ?? '{}'),
    // 用户的基本信息
    userInfo: {} as any,
    // 用户的简介信息
    userProfile: {}
  }),
  getters: {
    // 用户头像的计算属性
    userAvatar(state) {
      // 默认的头像地址
      let imgSrc = 'https://img.yzcdn.cn/vant/cat.jpeg'

      // 如果用户信息对象中包含 photo 属性的值，则为 imgSrc 重新赋值
      if (state.userInfo.photo) {
        imgSrc = state.userInfo.photo
      }

      return imgSrc
    }
  },
  actions: {
    // 更新 tokenInfo 数据的方法
    updateTokenInfo(payload: any) {
      // 把提交过来的 payload 对象，作为 tokenInfo 的值
      this.tokenInfo = payload
      this.saveStateToStorage()
    },
    // 将 state 持久化存储到本地
    saveStateToStorage() {
      localStorage.setItem('state', JSON.stringify(this.$state))
    },
    // 初始化用户的基本信息
    async initUserInfo() {
      // 调用 API 接口
      const { data: res } = await getUserInfoAPI()
      console.log(res)
      if (res.message === 'OK') {
        // TODO：把数据转交给 Mutation 方法   ctx.commit('Mutation方法名')
        // 1. 把用户信息转存到 state 中
        this.userInfo = res.data
        // 2. 将最新的 state 对象持久化存储到本地
        this.saveStateToStorage()
      }
    },
    // 清空 vuex 和本地的数据
    cleanState() {
      // 1. 清空 vuex 中的数据
      this.tokenInfo = {}
      this.userInfo = {}
      this.userProfile = {}
      // 2. 将清空后的 state 存储到本地
      this.saveStateToStorage()
    },
    // 初始化用户的简介信息
    async initUserProfile() {
      // 调用 API 接口
      const { data: res } = await getUserProfileAPI()
      if (res.message === 'OK') {
        // TODO：把请求到的数据转交给 Mutation 方法   ctx.commit('Mutation方法名')
        this.userProfile = res.data
        this.saveStateToStorage()
      }
    }
  }
})
