<template>
  <div class="search-result-container">
    <!-- 点击实现后退效果 -->
    <van-nav-bar title="搜索结果" left-arrow @click-left="$router.back()" fixed />
    <!-- 上拉加载更多 -->
    <van-list
      v-model="searchStore.loading"
      :finished="searchStore.finished"
      finished-text="没有更多数据了"
      @load="onLoad"
      :immediate-check="false"
    >
      <!-- 文章的 Item 项 -->
      <art-item
        v-for="item in searchStore.searchList"
        :key="item.art_id.toString()"
        :article="item"
        :closable="false"
      ></art-item>
    </van-list>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, watch } from 'vue'
  import { useRoute, onBeforeRouteLeave } from 'vue-router'
  import { useSearchStore } from '@/store/useSearchStore'
  // 导入文章的 Item 项组件
  import ArtItem from '@/components/ArticleItem/ArticleItem.vue'
  onBeforeRouteLeave((to, from, next) => {
    from.meta.top = window.scrollY
    setTimeout(() => {
      next()
    }, 0)
  })
  const $route = useRoute()
  const searchStore = useSearchStore()
  const onLoad = () => {
    searchStore.initSearchList($route.params.kw as string)
  }
  onMounted(() => {
    searchStore.initSearchList($route.params.kw as string)
  })
</script>
<style lang="less" scoped>
  .search-result-container {
    padding-top: 46px;
  }
</style>
