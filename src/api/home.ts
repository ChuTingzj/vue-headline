import { channels } from '@/types/home'
// 导入请求数据的 request 模块
import request from '@/utils/request'
import mock from '@/utils/mockRequest'
// 请求用户频道列表数据的 API
export const getUserChannelAPI = () => request.get('/v1_0/user/channels')
// 根据频道 Id 请求频道下的文章列表数据
export const getArtListAPI = (id: number, time: number) =>
  request.get('/v1_0/articles', {
    params: {
      channel_id: id, // 频道的 Id
      timestamp: time // 时间戳
    }
  })
//获取举报文章的内容
export const getReportAPI = () => mock({ url: '/reports', method: 'get' })
// 将文章设置为不感兴趣（形参 id 是文章的 id）
export const dislikeArticleAPI = (id: number) =>
  request.post('/v1_0/article/dislikes', {
    target: id
  })
// 举报文章的 API
export const reportArticleAPI = (target: string, type: number) =>
  request.post('/v1_0/article/reports', {
    target, // 文章的 Id
    type // 举报的类型
  })
// 获取所有频道数据的 API
export const getAllChannelAPI = () => request.get('/v1_0/channels')
// 更新用户频道列表数据的 API
// 注意：形参 channels 是一个数组，格式： [ {id, seq} ]
export const updateUserChannelAPI = (channels: channels[]) =>
  request.put('/v1_0/user/channels', {
    channels
  })
