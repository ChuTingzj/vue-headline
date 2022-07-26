<template>
  <div>
    <!-- 下拉刷新 -->
    <van-pull-refresh
      v-model="homeStore.isLoading"
      @refresh="onRefresh"
      :disabled="homeStore.finished"
    >
      <van-list
        :immediate-check="false"
        v-model="homeStore.loading"
        :finished="homeStore.finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <!-- 循环渲染文章的列表 -->

        <ArticleItem
          :article="item"
          v-for="item in homeStore.articleList"
          :key="item.art_id"
          @remove-article="removeArticle"
        ></ArticleItem>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<script setup lang="ts">
  import { defineProps, onMounted } from 'vue'
  import { useHomeStore } from '@/store/useHomeStore'
  import ArticleItem from '@/components/ArticleItem/ArticleItem.vue'
  import throttle from '@/utils/throttle'
  const homeStore = useHomeStore()
  const props = defineProps({
    // 频道 Id（小驼峰命名法：第一个单词全部小写，后面的单词首字母大写）
    channelId: {
      type: Number, // 数值类型
      required: true // 必填项
    }
  })
  // 加载更多的数据
  const onLoad = throttle(() => {
    homeStore.initArtList(props.channelId, homeStore.timeStamp)
  })
  // 下拉刷新
  const onRefresh = throttle(() => {
    homeStore.initArtList(props.channelId, homeStore.timeStamp, true)
  })
  // 从文章列表中移除指定 id 的文章
  const removeArticle = (id: string) => {
    // 对原数组进行 filter 方法的过滤
    homeStore.articleList = homeStore.articleList.filter((item) => item.art_id.toString() !== id)
    // 2. 判断剩余数据的文章数量是否小于 10
    if (homeStore.articleList.length < 10) {
      // 主动请求下一页的数据
      homeStore.initArtList(props.channelId, homeStore.timeStamp)
    }
  }

  onMounted(() => {
    homeStore.initArtList(props.channelId, homeStore.timeStamp)
  })
</script>
