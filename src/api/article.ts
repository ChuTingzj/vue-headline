import request from '@/utils/request'

// 获取文章详情的 API（形参中的 id 是文章的 id）
export const getArticleDetailAPI = (id: string) => request.get(`/v1_0/articles/${id}`)
// 关注用户的 API（形参中的 userId 是文字作者的 id）
export const followUserAPI = (userId: string) =>
  request.post('/v1_0/user/followings', {
    target: userId
  })
// 取消关注用户的 API
export const unfollowUserAPI = (userId: string) => request.delete(`/v1_0/user/followings/${userId}`)
// 点赞的 API（形参中的 artId 是文章的 Id）
export const addLikeAPI = (artId: string) =>
  request.post('/v1_0/article/likings', {
    target: artId
  })
// 取消点赞的 API（形参中的 artId 是文章的 Id）
export const delLikeAPI = (artId: string) => request.delete(`/v1_0/article/likings/${artId}`)
// 获取文章下评论数据的 API
export const getCmtListAPI = (artId: string | number, offset: string) =>
  request.get('/v1_0/comments', {
    params: {
      // a 表示获取文章下的评论
      type: 'a',
      // 文章的 Id
      source: artId,
      // 获取评论数据的偏移量，值为评论的 id。表示从此 id 的数据向后取，不传表示从第一页开始读取数据
      offset
    }
  })
// 评论点赞的 API
export const addLikeCmtAPI = (cmtId: string) =>
  request.post('/v1_0/comment/likings', {
    target: cmtId
  })
// 评论取消点赞的 API
export const delLikeCmtAPI = (cmtId: string) => request.delete(`/v1_0/comment/likings/${cmtId}`)
// 发表评论的 API（形参中的 artId 是文章的 id；content 是评论的内容）
export const pubCommentAPI = (artId: string, content: string) =>
  request.post('/v1_0/comments', {
    target: artId,
    content
  })
