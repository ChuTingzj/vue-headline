import { defineStore } from 'pinia'
import {
  getArticleDetailAPI,
  followUserAPI,
  unfollowUserAPI,
  addLikeAPI,
  delLikeAPI,
  getCmtListAPI,
  addLikeCmtAPI,
  delLikeCmtAPI
} from '@/api/article'
import { articleInfo, commentItem } from '@/types/article'
import { Toast } from 'vant'
export const useArticleStore = defineStore('article', {
  state: () => {
    return {
      // 文章的信息对象
      article: {} as articleInfo,
      // 文章的评论列表数据
      cmtlist: [] as commentItem[],
      // 偏移量
      offset: '' as string
    }
  },
  actions: {
    // 初始化文章的数据
    async initArticle(id: string) {
      // 1. 调用 API 接口
      const { data: res } = await getArticleDetailAPI(id)
      if (res.message === 'OK') {
        // 2. 转存数据
        this.article = res.data
      }
    },
    // 关注作者
    async setFollow() {
      // 调用关注作者的 API 接口
      const { data: res } = await followUserAPI(this.article.aut_id.toString())
      if (res.message === 'OK') {
        // 提示用户成功
        Toast.success('关注成功！')
        // 手动更改关注的状态
        this.article.is_followed = true
      }
    },
    // 取关作者
    async setUnfollow() {
      // 1. 调用 API 接口
      const res = await unfollowUserAPI(this.article.aut_id.toString())

      // 2. 判断响应的状态码
      if (res.status === 204) {
        // 2.1 提示用户
        Toast.success('取关成功！')
        // 2.2 手动更改关注的状态
        this.article.is_followed = false
      }
    },
    // 文章点赞
    async setLike(id: string) {
      // 调用 API 接口
      const { data: res } = await addLikeAPI(id)
      if (res.message === 'OK') {
        // 提示用户
        Toast.success('点赞成功！')
        // 手动变更点赞的状态
        this.article.attitude = 1
      }
    },
    // 取消点赞
    async setDislike(id: string) {
      // 调用 API 接口
      const res = await delLikeAPI(id)
      if (res.status === 204) {
        // 提示用户
        Toast.success('取消点赞成功！')
        // 手动变更点赞的状态
        this.article.attitude = -1
      }
    },
    // 初始化评论列表的数据
    async initCmtList(
      artId: string | number,
      loading: boolean,
      finished: boolean,
      cmtCount: number
    ) {
      // 调用 API 接口
      const { data: res } = await getCmtListAPI(artId, this.offset)
      if (res.message === 'OK') {
        // 为总评论数赋值
        cmtCount = res.data.total_count
        // 为偏移量赋值
        this.offset = res.data.last_id

        // 1. 数据拼接：“旧数据”在前，“新数据”在后
        this.cmtlist = [...this.cmtlist, ...res.data.results]
        // 2. 将 loading 重置为 false
        loading = false

        // 3. 判断所有数据是否加载完毕
        if (res.data.results.length === 0) {
          finished = true
        }
      }
    },
    // 评论点赞
    async addLike(cmt: commentItem) {
      // 1. 调用 API 接口
      const { data: res } = await addLikeCmtAPI(cmt.com_id.toString())

      if (res.message === 'OK') {
        // 2. 在客户端，将点赞的状态设置为 true
        cmt.is_liking = true
      }
    },
    // 评论取消点赞
    async delLike(cmt: commentItem) {
      // 1. 调用 API 接口（注意：由于取消点赞的 API 没有响应体，不需要进行解构赋值）
      const res = await delLikeCmtAPI(cmt.com_id.toString())

      if (res.status === 204) {
        // 2. 在客户端，将点赞的状态设置为 false
        cmt.is_liking = false
      }
    }
  }
})
