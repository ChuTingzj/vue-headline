<template>
  <div @click="$router.push('/article/' + artId)">
    <van-cell>
      <!-- 标题区域的插槽 -->
      <template #title>
        <div class="title-box">
          <!-- 标题 -->
          <span>文章的标题噢</span>
          <!-- 单张图片 -->
          <img
            v-lazy="article.cover.images[0]"
            alt=""
            class="thumb"
            v-if="article.cover.type === 1"
          />
        </div>
        <!-- 三张图片 -->
        <div class="thumb-box" v-if="article.cover.type === 3">
          <img
            alt=""
            class="thumb"
            v-for="(item, index) in article.cover.images"
            :key="index"
            v-lazy="item"
          />
        </div>
      </template>
      <!-- label 区域的插槽 -->
      <template #label>
        <div class="label-box">
          <span
            >{{ article.aut_name }} &nbsp;&nbsp; {{ article.comm_count }}评论 &nbsp;&nbsp;
            {{ dateFormat }}</span
          >
          <!-- 关闭按钮 -->
          <!-- 通过 .stop 事件修饰符，阻止点击事件的冒泡 -->
          <van-icon name="cross" @click.stop="show = true" v-if="closable" />
        </div>
      </template>
    </van-cell>
    <!-- 反馈的动作面板 -->
    <van-action-sheet
      get-container="body"
      v-model:show="show"
      cancel-text="取消"
      :closeable="false"
      @closed="isFirst = true"
    >
      <!-- 第一级反馈面板 -->
      <div v-if="isFirst">
        <!-- 一级选项 -->
        <van-cell
          :title="item.name"
          clickable
          class="center-title"
          v-for="item in actions"
          :key="item.name"
          @click="onCellClick(item.name)"
        />
      </div>
      <!-- 第二级反馈面板 -->
      <div v-else>
        <van-cell title="返回" clickable title-class="center-title" @click="isFirst = true" />
        <van-cell
          :title="item.label"
          clickable
          title-class="center-title"
          v-for="item in homeStore.reportList"
          :key="item.type"
          @click="reportArticle(item.type)"
        />
      </div>
    </van-action-sheet>
  </div>
</template>
<script setup lang="ts">
  import { defineProps, computed, ref, reactive, onMounted, defineEmits } from 'vue'
  import dayjs from 'dayjs'
  import { useHomeStore } from '@/store/useHomeStore'
  import { dislikeArticleAPI, reportArticleAPI } from '@/api/home'
  const homeStore = useHomeStore()
  const show = ref(false)
  const isFirst = ref(true)
  const actions = reactive([{ name: '不感兴趣' }, { name: '反馈垃圾内容' }, { name: '拉黑作者' }])
  const props = defineProps({
    // 文章的信息对象
    article: {
      type: Object, // 数据类型
      required: true // 必填项
    },
    // 是否展示关闭按钮
    closable: {
      type: Boolean,
      // 默认值为 true，表示展示关闭按钮
      default: true
    }
  })
  const $emits = defineEmits(['remove-article'])
  const artId = computed(() => props.article.art_id.toString())
  const onCellClick = async (name: string) => {
    if (name === '不感兴趣') {
      // 调用 API 接口，将文章设置为不感兴趣
      const { data: res } = await dislikeArticleAPI(artId.value)
      console.log(res)
      if (res.message === 'OK') {
        // TODO：炸楼的操作，触发自定义的事件，将文章 id 发送给父组件
        $emits('remove-article', artId.value)
      }
      show.value = false
    } else if (name === '拉黑作者') {
      console.log('拉黑作者')
      show.value = false
    } else if (name === '反馈垃圾内容') {
      // TODO：展示二级反馈面板
      isFirst.value = false
    }
  }
  // 举报文章（形参 type 是举报的类型值）
  const reportArticle = async (type: number) => {
    // 1. 发起举报文章的请求
    const { data: res } = await reportArticleAPI(artId.value, type)
    if (res.message === 'OK') {
      // 2. 炸楼操作，触发自定义事件，把文章 Id 发送给父组件
      $emits('remove-article', artId.value)
    }
    // 3. 关闭动作面板
    show.value = false
  }
  const dateFormat = computed(() => dayjs().to(props.article.pubdate))
  onMounted(() => {
    homeStore.initReportList()
  })
</script>
<style lang="less" scoped>
  .center-title {
    text-align: center;
  }
  .label-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .thumb {
    // 矩形黄金比例：0.618
    width: 113px;
    height: 70px;
    background-color: #f8f8f8;
    object-fit: cover;
  }

  .title-box {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }

  .thumb-box {
    display: flex;
    justify-content: space-between;
  }
</style>
