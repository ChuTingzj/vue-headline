<template>
  <div :class="isShowBox1 ? 'art-cmt-container-1' : 'art-cmt-container-2'">
    <!-- 评论列表 -->
    <van-list
      class="cmt-list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多评论了"
      :immediate-check="false"
      @load="onLoad"
    >
      <!-- 评论的 Item 项 -->
      <div class="cmt-item" v-for="item in articleStore.cmtlist" :key="item.com_id.toString()">
        <!-- 头部区域 -->
        <div class="cmt-header">
          <!-- 头部左侧 -->
          <div class="cmt-header-left">
            <img :src="item.aut_photo" alt="" class="avatar" />
            <span class="uname">{{ item.aut_name }}</span>
          </div>
          <!-- 头部右侧 -->
          <div class="cmt-header-right">
            <van-icon
              name="like"
              size="16"
              color="red"
              v-if="item.is_liking"
              @click="articleStore.delLike(item)"
            />
            <van-icon
              name="like-o"
              size="16"
              color="gray"
              v-else
              @click="articleStore.addLike(item)"
            />
          </div>
        </div>
        <!-- 主体区域 -->
        <div class="cmt-body">{{ item.content }}</div>
        <!-- 尾部区域 -->
        <div class="cmt-footer">{{ dateFormat }}</div>
      </div>
    </van-list>
    <!-- 底部添加评论区域 - 1 -->
    <div class="add-cmt-box van-hairline--top" v-if="isShowBox1">
      <van-icon name="arrow-left" size="18" @click="$router.back()" />
      <div class="ipt-cmt-div" @click="showBox2">发表评论</div>
      <div class="icon-box">
        <van-badge :content="cmtCount" :max="99">
          <van-icon name="comment-o" size="20" @click="scrollToCmtList" />
        </van-badge>
        <van-icon name="star-o" size="20" />
        <van-icon name="share-o" size="20" />
      </div>
    </div>

    <!-- 底部添加评论区域 - 2 -->
    <div class="cmt-box van-hairline--top" v-else>
      <textarea
        v-model.trim="cmt"
        ref="iptCmt"
        placeholder="友善评论、理性发言、阳光心灵"
        @blur="hideBox2"
      ></textarea>
      <van-button @click="pubCmt" :disabled="cmt.length === 0" type="default">发布</van-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { defineProps, onMounted, computed, ref, nextTick } from 'vue'
  import { useArticleStore } from '@/store/useArticleStore'
  import dayjs from 'dayjs'
  import { pubCommentAPI } from '@/api/article'
  import { Toast } from 'vant'
  // 从 popmotion 中按需导入 animate 动画函数
  import { animate } from 'popmotion'
  const articleStore = useArticleStore()
  onMounted(() => {
    articleStore.initCmtList(props.artId, loading.value, finished, cmtCount.value)
  })
  const props = defineProps({
    // 文章的 Id（小驼峰命名法）
    artId: {
      type: [String, Number],
      required: true
    }
  })
  const loading = ref(false)
  const finished = ref(false)
  const isShowBox1 = ref(true)
  const iptCmt = ref<HTMLTextAreaElement | null>(null)
  const cmtCount = ref(0)
  const cmt = ref('')
  // 展示第二个评论区域
  const showBox2 = () => {
    isShowBox1.value = false
    // 1. 将回调函数延迟到下次 DOM 更新完毕之后执行
    nextTick(() => {
      // 2. 通过 ref 获取到 textarea 的引用
      iptCmt?.value?.focus()
    })
  }
  // 滚动到评论的列表区域
  const scrollToCmtList = () => {
    // 1. 当前滚动条的位置
    const now = window.scrollY
    // 2. 目标位置（文章信息区域的高度）
    const dist = document.querySelector('.article-container')?.offsetHeight

    // 3. 实现滚动动画
    animate({
      from: now, // 当前的位置
      to: dist, // 目标位置
      onUpdate: (latest: number) => window.scrollTo(0, latest)
    })
  }
  // 点击了发布评论的按钮
  const pubCmt = async () => {
    // 调用 API 接口
    const { data: res } = await pubCommentAPI(props.artId, cmt.value)
    if (res.message === 'OK') {
      // 评论数自增 +1
      cmtCount.value += 1
      // 动态给响应回来的数据添加 is_liking 属性
      res.data.new_obj.is_liking = false
      // 将接口返回的、最新的评论内容，unshift 追加到 cmtlist 中
      articleStore.cmtlist.unshift(res.data.new_obj)
      // 提示用户发表评论成功
      Toast.success('发表评论成功')
    }
  }
  // 隐藏第二个评论区域
  const hideBox2 = () => {
    // 当文本框失去焦点时，延迟 100ms 再隐藏第二个评论区域
    // 目的：让发布评论的按钮能正常响应用户的点击事件
    setTimeout(() => {
      // 隐藏第二个评论区域
      isShowBox1.value = true
      // 清空用户输入的评论内容
      cmt.value = ''
    }, 100)
  }
  // 上拉加载
  const onLoad = () => {
    articleStore.initCmtList(props.artId, loading.value, finished, cmtCount.value)
  }
  const dateFormat = computed(() => dayjs().to(articleStore.article.pubdate))
</script>
<style lang="less" scoped>
  .cmt-list {
    padding: 10px;
    .cmt-item {
      padding: 15px 0;
      + .cmt-item {
        border-top: 1px solid #f8f8f8;
      }
      .cmt-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        .cmt-header-left {
          display: flex;
          align-items: center;
          .avatar {
            width: 40px;
            height: 40px;
            background-color: #f8f8f8;
            border-radius: 50%;
            margin-right: 15px;
          }
          .uname {
            font-size: 12px;
          }
        }
      }
      .cmt-body {
        font-size: 14px;
        line-height: 28px;
        text-indent: 2em;
        margin-top: 6px;
        word-break: break-all;
      }
      .cmt-footer {
        font-size: 12px;
        color: gray;
        margin-top: 10px;
      }
    }
  }
  // 外层容器
  .art-cmt-container-1 {
    padding-bottom: 46px;
  }
  .art-cmt-container-2 {
    padding-bottom: 80px;
  }

  // 发布评论的盒子 - 1
  .add-cmt-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    box-sizing: border-box;
    background-color: white;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 46px;
    line-height: 46px;
    padding-left: 10px;
    .ipt-cmt-div {
      flex: 1;
      border: 1px solid #efefef;
      border-radius: 15px;
      height: 30px;
      font-size: 12px;
      line-height: 30px;
      padding-left: 15px;
      margin-left: 10px;
      background-color: #f8f8f8;
    }
    .icon-box {
      width: 40%;
      display: flex;
      justify-content: space-evenly;
      line-height: 0;
    }
  }

  .child {
    width: 20px;
    height: 20px;
    background: #f2f3f5;
  }

  // 发布评论的盒子 - 2
  .cmt-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    padding-left: 10px;
    box-sizing: border-box;
    background-color: white;
    textarea {
      flex: 1;
      height: 66%;
      border: 1px solid #efefef;
      background-color: #f8f8f8;
      resize: none;
      border-radius: 6px;
      padding: 5px;
    }
    .van-button {
      height: 100%;
      border: none;
    }
  }
</style>
