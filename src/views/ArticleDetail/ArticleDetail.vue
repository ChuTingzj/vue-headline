<template>
  <div>
    <!-- Header 区域 -->
    <van-nav-bar fixed title="文章详情" left-arrow @click-left="$router.back()" />

    <!-- 文章信息区域 -->
    <div class="article-container" v-if="articleStore.article">
      <!-- 文章标题 -->
      <h1 class="art-title">{{ articleStore.article.title }}</h1>

      <!-- 用户信息 -->
      <van-cell center :title="articleStore.article.aut_name" :label="dateFormat">
        <template #icon>
          <!-- 头像 -->
          <img :src="articleStore.article.aut_photo" alt="" class="avatar" />
        </template>
        <template #default>
          <div>
            <!-- 是否关注了作者 -->
            <van-button
              type="default"
              size="mini"
              v-if="articleStore.article.is_followed"
              @click="articleStore.setUnfollow"
              >已关注</van-button
            >
            <van-button
              icon="plus"
              type="default"
              size="mini"
              plain
              v-else
              @click="articleStore.setFollow"
              >关注</van-button
            >
          </div>
        </template>
      </van-cell>

      <!-- 分割线 -->
      <van-divider></van-divider>

      <!-- 文章内容 -->
      <div class="art-content" v-html="articleStore.article.content"></div>

      <!-- 分割线 -->
      <van-divider>End</van-divider>

      <!-- 点赞 -->
      <div class="like-box">
        <van-button
          icon="good-job"
          type="danger"
          size="small"
          v-if="articleStore.article.attitude === 1"
          @click="articleStore.setDislike(props.id)"
          >已点赞</van-button
        >
        <van-button
          icon="good-job-o"
          type="danger"
          plain
          size="small"
          v-else
          @click="articleStore.setLike(props.id)"
          >点赞</van-button
        >
      </div>
    </div>
    <ArticleComment :art-id="props.id"></ArticleComment>
  </div>
</template>
<script lang="ts" setup>
  import { defineProps, onMounted, computed, watch, onUpdated } from 'vue'
  import { useArticleStore } from '@/store/useArticleStore'
  import ArticleComment from '@/components/ArticleComment/ArticleComment.vue'
  import dayjs from 'dayjs'
  import { onBeforeRouteLeave } from 'vue-router'
  // 导入 highlight.js 模块
  import hljs from 'highlight.js'
  onBeforeRouteLeave((to, from, next) => {
    from.meta.top = window.scrollY
    console.log(from.meta.top)
    setTimeout(() => {
      next()
    }, 0)
  })
  const props = defineProps({
    id: {
      type: String,
      required: true
    }
  })

  onMounted(() => {
    articleStore.initArticle(props.id)
  })
  const dateFormat = computed(() => dayjs().to(articleStore.article.pubdate))
  const articleStore = useArticleStore()
  onUpdated(() => {
    // 2. 判断是否有文章的内容
    if (articleStore.article) {
      // 3. 对文章的内容进行高亮处理
      hljs.highlightAll()
    }
  })
  watch(
    () => props.id,
    () => {
      // 只要 id 值发生了变化，就清空旧的文章信息
      articleStore.article = null
      // 并重新获取文章的详情数据
      articleStore.initArticleInfo()
    }
  )
</script>
<style lang="less" scoped>
  .article-container {
    padding: 10px;
    margin-top: 46px;
  }
  .art-title {
    font-size: 16px;
    font-weight: bold;
    margin: 10px 0;
  }

  .art-content {
    font-size: 12px;
    line-height: 24px;
    width: 100%;
    overflow-x: scroll;
    word-break: break-all;
  }

  .van-cell {
    padding: 5px 0;
    &::after {
      display: none;
    }
  }

  .avatar {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #f8f8f8;
    margin-right: 5px;
    border: none;
  }

  .like-box {
    display: flex;
    justify-content: center;
  }
</style>
