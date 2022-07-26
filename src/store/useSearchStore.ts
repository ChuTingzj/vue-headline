import { defineStore } from 'pinia'
import { searchItem } from '@/types/search'
// 按需导入 API 接口
import { getSuggestListAPI, getSearchResultAPI } from '@/api/search'
export const useSearchStore = defineStore('search', {
  state: () => {
    return {
      suggestList: [] as string[],
      history: JSON.parse(localStorage.getItem('history') || '[]') as string[],
      // 搜索的结果
      searchList: [] as searchItem[],
      loading: false,
      finished: false,
      page: 1
    }
  },
  actions: {
    // 请求搜索建议列表数据的方法
    async initSuggestList(kw: string) {
      // 调用 API 接口
      const { data: res } = await getSuggestListAPI(kw)
      if (res.message === 'OK') {
        // 高亮搜索建议中的搜索关键词
        this.hightKeywords(res.data.options, kw)
        // 为 suggestList 数据赋值
        this.suggestList = res.data.options
        // 把搜索关键词加入到搜索历史中
        const newHistory = this.history.filter((item) => item !== kw)
        newHistory.unshift(kw)
        this.history = newHistory
      }
    },
    // 获取搜索的结果
    async initSearchList(kw: string) {
      // 调用 API 接口
      const { data: res } = await getSearchResultAPI(kw, this.page)
      if (res.message === 'OK') {
        // 1. 拼接数据：“旧数据”在前，“新数据”在后
        this.searchList = [...this.searchList, ...res.data.results]
        // 2. 将 loading 设置为 false
        this.loading = false
        // 3. 判断数据是否加载完毕
        if (res.data.results.length === 0) {
          this.finished = true
        }
        this.page++
      }
    }
  },
  getters: {
    // 高亮搜索关键词的方法，形参中的 arr 是搜索建议的数组
    hightKeywords: () => {
      return (arr: string[], kw: string) => {
        // 1. 根据用户输入的 kw，动态创建正则表达式
        const reg = new RegExp(kw, 'ig')
        // 循环数组中的每一项
        arr.forEach((item, index) => {
          // 2. 调用字符串的 replace 方法进行关键字的高亮处理
          arr[index] = item.replace(reg, (val) => {
            return `<span style="color: red; font-weight: bold;">${val}</span>`
          })
        })
      }
    }
  }
})
