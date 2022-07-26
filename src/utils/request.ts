import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { addPending, removePending } from './cancelRequest'
import { Toast } from 'vant'
import { useUserStore } from '@/store/useUserStore'
import { exchangeTokenAPI } from '@/api/user'
import { useRouter } from 'vue-router'
const router = useRouter()
const instance = axios.create({
  baseURL: 'http://www.liulongbin.top:8000',
  timeout: 5000
})
instance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    removePending(config) // 在请求开始前，对之前的请求做检查取消操作
    addPending(config) // 将当前请求添加到 pending 中
    // 展示 loading 效果
    Toast.loading({
      message: '加载中...', // 文本内容
      duration: 1000 // 展示时长(ms)，值为 0 时，toast 不会消失
    })
    const userStore = useUserStore()
    // 1. 获取 token 值
    const tokenStr = userStore.tokenInfo.token
    // 2. 判断 tokenStr 的值是否为空
    if (tokenStr) {
      // 3. 添加身份认证字段
      config.headers!.Authorization = `Bearer ${tokenStr}`
    }
    return config
  },
  (err) => {
    Promise.reject(err)
  }
)
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    removePending(response) // 在请求结束后，移除本次请求
    // 隐藏 loading 效果
    Toast.clear()
    return response
  },
  async (err) => {
    const userStore = useUserStore()
    const tokenInfo = userStore.tokenInfo
    try {
      // 2. 判断是否为 token 过期
      if (err.response && err.response.status === 401 && tokenInfo.refresh_token) {
        // token 过期
        console.log('token过期啦')

        // 3.1 TODO: 发起请求，根据 refresh_token 重新请求一个有效的新 token
        const { data: res } = await exchangeTokenAPI(tokenInfo.refresh_token)
        console.log(res)

        // 3.2 TODO: 更新 Store 中的 Token
        userStore.updateTokenInfo({ token: res.data.token, refresh_token: tokenInfo.refresh_token })
        // 3.3 重新调用刚才“请求未遂”的接口
        // 3.3.1 如果在响应拦截器中 return 一个新的 Promise 异步请求，则会把这次请求的结果，当作上次请求的返回值
        return instance(err.config)
      }
    } catch (error) {
      //  token 和 refresh_token 都失效了

      // 4.1 清空 vuex 和 localStorage
      userStore.cleanState()
      // 4.2 强制跳转到登录页
      router.replace('/login?pre=' + (router.currentRoute as any).fullPath)
    }

    if (axios.isCancel(err)) {
      console.log('repeated request: ' + err.message)
    }
    return Promise.reject(err)
  }
)
export default instance
