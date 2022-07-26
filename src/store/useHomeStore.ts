import { defineStore } from 'pinia'
import {
  getUserChannelAPI,
  getArtListAPI,
  getReportAPI,
  getAllChannelAPI,
  updateUserChannelAPI
} from '@/api/home'
import { channelItem, articleItem, reportItem } from '@/types/home'
import { Notify } from 'vant'
export const useHomeStore = defineStore('home', {
  state: () => {
    return {
      userChannel: [] as channelItem[],
      articleList: [] as articleItem[],
      timeStamp: Date.now(),
      loading: true,
      finished: false,
      isLoading: false,
      reportList: [] as reportItem[],
      allChannel: [] as channelItem[]
    }
  },
  actions: {
    async initUserChannel() {
      // 1. 调用 API 接口
      const { data: res } = await getUserChannelAPI()
      // 2. 判断请求是否成功
      if (res.message === 'OK') {
        // 3. 为用户的频道列表赋值
        this.userChannel = res.data.channels
      }
    },
    // 初始化文章的列表数据
    async initArtList(channelId: number, timeStamp: number, isPull?: boolean) {
      // 请求 API 接口
      const { data: res } = await getArtListAPI(channelId, timeStamp)
      if (res.message === 'OK') {
        // 为时间戳重新赋值
        this.timeStamp = res.data.pre_timestamp
        if (isPull) {
          this.articleList = [...res.data.results, ...this.articleList]
        } else {
          // 1. 上拉加载更多时，应该是“旧数据”在前，“新数据”在后
          this.articleList = [...this.articleList, ...res.data.results]
        }
        // 2. 重置 loading 为 false
        this.loading = false
        // 3. 判断所有的数据是否已加载完毕
        if (res.data.pre_timestamp === null) {
          this.finished = true
        }
      }
    },
    //获取文章举报内容
    async initReportList() {
      const { data: res } = await getReportAPI()
      if (res.code === 200) {
        this.reportList = res.data
      }
    },
    // 获取所有频道的列表数据
    async initAllChannel() {
      const { data: res } = await getAllChannelAPI()
      if (res.message === 'OK') {
        // 将请求到的数据，转存到 allChannel 中
        this.allChannel = res.data.channels
      }
    },
    // 把用户的频道列表数据提交到后端保存
    async updateChannel() {
      // 1. 准备要提交到服务器的数据
      const channels = this.userChannel
        .filter((item) => item.name !== '推荐') // 将“推荐”从频道列表中过滤出去
        .map((item, index) => {
          // 调用数组的 map 循环，最终返回一个处理好的新数组
          return {
            id: item.id,
            seq: index + 1
          }
        })

      // 2. 调用 API 接口
      const { data: res } = await updateUserChannelAPI(channels)
      if (res.message === 'OK') {
        // 3. 通过 notify 弹框提示用户更新成功
        Notify({ type: 'success', message: '更新成功', duration: 1000 })
      }
    }
  }
})
