<template>
  <div>
    <!-- Header 头部区域 -->
    <div class="search-header">
      <!-- 后退图标 -->
      <van-icon name="arrow-left" color="white" size="18" class="goback" @click="$router.back()" />
      <!-- 搜索组件 -->
      <van-search
        v-model.trim="kw"
        placeholder="请输入搜索关键词"
        background="#007BFF"
        shape="round"
        @input="onInput"
      />
    </div>
    <!-- 搜索建议 -->
    <div class="sugg-list" v-if="kw.length != 0">
      <div
        @click="gotoSearchResult($event)"
        class="sugg-item"
        v-for="(item, i) in searchStore.suggestList"
        :key="i"
        v-html="item"
      ></div>
    </div>

    <!-- 搜索历史 -->
    <div class="search-history" v-else>
      <!-- 标题 -->
      <van-cell title="搜索历史">
        <!-- 使用 right-icon 插槽来自定义右侧图标 -->
        <template #right-icon>
          <van-icon name="delete" class="search-icon" @click="searchStore.history = []" />
        </template>
      </van-cell>

      <!-- 历史列表 -->
      <div class="history-list">
        <span
          class="history-item"
          v-for="(tag, i) in searchStore.history"
          :key="i"
          @click="gotoSearchResult($event)"
          >{{ tag }}</span
        >
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, onMounted, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import debounce from '@/utils/debounce'
  import { useSearchStore } from '@/store/useSearchStore'
  const searchStore = useSearchStore()
  const $router = useRouter()
  onMounted(() => {
    const ipt: HTMLInputElement | null = document.querySelector('input[type=search]')
    ipt?.focus()
  })
  watch(searchStore.history, (newVal) => {
    // 持久化存储到本地
    localStorage.setItem('history', JSON.stringify(newVal))
  })
  const kw = ref('')
  // 搜索组件的输入事件
  const onInput = debounce(() => {
    // 输入的搜索关键词为空
    if (kw.value.length === 0) {
      // 清空搜索建议的列表数据
      searchStore.suggestList = []
      return
    }
    searchStore.initSuggestList(kw.value)
  })
  // 跳转到搜索结果页
  const gotoSearchResult = (e: MouseEvent) => {
    // 1. 获取用户当前点击的搜索建议项的内容
    const kw = e?.target?.innerText
    // 2. 通过编程式导航 API，跳转到搜索结果页
    $router.push('/search/' + kw)
  }
  watch(kw, () => {
    // 1. 重置关键数据
    searchStore.page = 1
    searchStore.artList = []
    searchStore.loading = false
    searchStore.finished = false

    // 2. 请求数据
    searchStore.initSearchResult()
  })
</script>
<style lang="less" scoped>
  .search-header {
    height: 46px;
    display: flex;
    align-items: center;
    background-color: #007bff;
    overflow: hidden;
    // 后退按钮
    .goback {
      padding-left: 14px;
    }
    // 搜索组件
    .van-search {
      flex: 1;
    }
  }
  .sugg-list {
    .sugg-item {
      padding: 0 15px;
      border-bottom: 1px solid #f8f8f8;
      font-size: 14px;
      line-height: 50px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  .search-icon {
    font-size: 16px;
    line-height: inherit;
  }

  .history-list {
    padding: 0 10px;
    .history-item {
      display: inline-block;
      font-size: 12px;
      padding: 8px 14px;
      background-color: #efefef;
      margin: 10px 8px 0px 8px;
      border-radius: 10px;
    }
  }
</style>
