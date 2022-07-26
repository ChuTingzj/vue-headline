import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'
import { Toast } from 'vant'
const mockInstance = axios.create({
  baseURL: '/mock',
  timeout: 5000
})
mockInstance.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 展示 loading 效果
    Toast.loading({
      message: '加载中...', // 文本内容
      duration: 0 // 展示时长(ms)，值为 0 时，toast 不会消失
    })
    return config
  },
  (err) => {
    Promise.reject(err)
  }
)
mockInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    // 隐藏 loading 效果
    Toast.clear()
    return response
  },
  (err) => {
    return Promise.reject(err)
  }
)
export default mockInstance
