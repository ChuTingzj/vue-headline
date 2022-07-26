import request from '@/utils/request'
// 获取搜索建议列表数据的 API
export const getSuggestListAPI = (kw: string) =>
  request.get('/v1_0/suggestion', {
    // 注意：GET 请求的参数，要通过 params 提供
    params: {
      q: kw
    }
  })
// 封装搜索文章数据的 API
export const getSearchResultAPI = (kw: string, page: number) =>
  request.get('/v1_0/search', {
    params: {
      q: kw, // 搜索关键词
      page // 页码值
    }
  })
