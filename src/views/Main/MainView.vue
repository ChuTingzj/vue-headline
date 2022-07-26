<template>
  <div class="home-container">
    <!-- 头部区域 -->
    <van-nav-bar fixed>
      <!-- 左侧的插槽 -->
      <template #left>
        <img src="@/assets/logo.png" alt="logo" class="logo" />
      </template>
      <!-- 右侧的插槽 -->
      <template #right>
        <van-icon name="search" color="white" size="18" @click="$router.push('/search')" />
      </template>
    </van-nav-bar>
    <!-- 频道列表的标签页 -->
    <van-tabs
      v-model="active"
      sticky
      offset-top="1.22666667rem"
      :before-change="beforeTabsChange"
      @change="onTabsChange"
    >
      <!-- 循环渲染用户的频道 -->
      <van-tab v-for="item in homeStore.userChannel" :key="item.id" :title="item.name">
        <article-list :channel-id="item.id"></article-list>
      </van-tab>
    </van-tabs>

    <!-- 频道管理的小图标 -->
    <van-icon name="plus" size="16" class="plus" @click="show = true" />
    <!-- 频道管理的弹出层 -->
    <van-popup v-model:show="show" :close-on-click-overlay="false" @closed="isDel = false">
      <div class="popup-container">
        <!-- 弹出层的头部区域 -->
        <van-nav-bar title="频道管理">
          <template #right>
            <van-icon name="cross" size="14" color="white" @click="show = false" />
          </template>
        </van-nav-bar>
        <!-- 弹出层的主体区域 -->
        <div class="pop-body">
          <!-- 我的频道 -->
          <div class="my-channel-box">
            <div class="channel-title">
              <div>
                <span class="title-bold">已添加频道：</span>
                <!-- 提示的文本 -->
                <span class="title-gray">{{ isDel ? '点击移除频道' : '点击进入频道' }}</span>
              </div>
              <!-- 按钮的文本 -->
              <span class="btn-edit" @click="isDel = !isDel">{{ isDel ? '完成' : '编辑' }}</span>
            </div>
            <!-- 我的频道列表 -->
            <van-row type="flex">
              <van-col span="6" v-for="(item, index) in homeStore.userChannel" :key="item.id">
                <!-- 用户的频道 Item 项 -->
                <div
                  class="channel-item van-hairline--surround"
                  @click="onUserChannelClick(item, index)"
                  >{{ item.name }}
                  <!-- 删除的图标 -->
                  <van-badge
                    color="transparent"
                    class="cross-badge"
                    v-if="isDel && item.name !== '推荐' && homeStore.userChannel.length > 2"
                  >
                    <template #content>
                      <van-icon name="cross" class="badge-icon" color="#cfcfcf" size="20" />
                    </template>
                  </van-badge>
                </div>
              </van-col>
            </van-row>
          </div>
          <!-- 分隔线 -->
          <div class="van-hairline--top sp-line"></div>
          <!-- 更多频道 -->
          <div class="more-channel-box">
            <div class="channel-title">
              <div>
                <span class="title-bold">可添加频道：</span>
                <span class="title-gray">点击添加频道</span>
              </div>
            </div>
            <!-- 更多频道列表 -->
            <van-row type="flex">
              <van-col span="6" v-for="item in moreChannels" :key="item.id">
                <div class="channel-item van-hairline--surround" @click="addChannel(item)">{{
                  item.name
                }}</div>
              </van-col>
            </van-row>
          </div>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed, reactive, nextTick } from 'vue'
  import { useHomeStore } from '@/store/useHomeStore'
  import ArticleList from '@/components/ArticleLIst/ArticleList.vue'
  import { channelItem } from '@/types/home'
  import { onBeforeRouteLeave } from 'vue-router'
  let active = ref(0)
  let show = ref(false)
  let isDel = ref(false)
  const nameToTop = reactive<{ [index: string]: number }>({})

  const homeStore = useHomeStore()
  // tabs 发生切换之前，触发此方法
  const beforeTabsChange = () => {
    // 把当前"频道名称"对应的"滚动条位置"记录到 nameToTop 对象中
    const name: string = homeStore.channels[active.value].name
    nameToTop[name] = window.scrollY

    // return true 表示允许进行标签页的切换
    return true
  }
  // 当 tabs 切换完毕之后，触发此方法
  const onTabsChange = () => {
    // 等 DOM 更新完毕之后，根据记录的"滚动条位置"，调用 window.scrollTo() 方法进行滚动
    nextTick(() => {
      const name = homeStore.channels[active.value].name
      window.scrollTo(0, nameToTop[name] || 0)
    })
  }
  // 更多频道的数据
  const moreChannels = computed(() => {
    // 1. 对数组进行 filter 过滤，返回的是符合条件的新数组
    return homeStore.allChannel.filter((item: channelItem) => {
      // 判断当前循环项，是否在 “我的频道” 列表之中
      const index = homeStore.userChannel.findIndex((x) => x.id === item.id)
      // 如果不在，则 return true，表示需要把这一项存储到返回的新数组之中
      if (index === -1) return true
    })
  })
  // 新增频道（形参 item 就是当前用户点击的频道信息对象）
  // 格式：{ id, name }
  const addChannel = (item: channelItem) => {
    // 将用户点击的频道，添加到“用户频道”列表中
    homeStore.userChannel.push(item)

    // TODO：调用 API 接口，将最新的用户频道，存储到后台数据库中
    homeStore.updateChannel()
  }
  // 从用户频道列表中，移除指定 id 的频道
  const onUserChannelClick = (channel: channelItem, index: number) => {
    if (isDel.value) {
      // 处于删除状态
      // 判断用户点击的是否为“推荐”
      if (channel.name === '推荐' || homeStore.userChannel.length === 2) return

      // 移除频道
      homeStore.userChannel = homeStore.userChannel.filter(
        (item: channelItem) => item.id !== channel.id
      )
      homeStore.updateChannel()
    } else {
      // 不处于删除状态
      // 1. 修改 Tabs 的激活项的索引值
      active.value = index
      // 2. 关闭 popup 弹出层
      show.value = false
    }
  }
  onMounted(() => {
    homeStore.initUserChannel()
    homeStore.initAllChannel()
  })
  onBeforeRouteLeave((to, from, next) => {
    from.meta.top = window.scrollY
    next()
  })
</script>
<style lang="less" scoped>
  // 组件外层容器的样式
  .home-container {
    padding-top: 46px;
    padding-bottom: 50px;
  }
  // logo 样式
  .logo {
    height: 80%;
  }
  // 为 tabs 容器设置右 padding
  :deep(.van-tabs__wrap) {
    padding-right: 36px;
    background-color: white;
  }
  // 频道管理小图标的定位
  .plus {
    position: fixed;
    top: 58px;
    right: 10px;
    z-index: 999;
  }
  .van-popup,
  .popup-container {
    background-color: transparent;
    height: 100%;
    width: 100%;
  }

  .popup-container {
    display: flex;
    flex-direction: column;
  }

  .pop-body {
    width: 50vh;
    overflow: scroll;
    padding: 8px;
    background-color: white;
  }

  .my-channel-box,
  .more-channel-box {
    .channel-title {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      line-height: 28px;
      padding: 0 6px;
      .title-bold {
        font-weight: bold;
      }
      .title-gray {
        color: gray;
        font-size: 12px;
      }
    }
  }

  .btn-edit {
    border: 1px solid #a3a2a2;
    padding: 0 10px;
    line-height: 20px;
    height: 20px;
    border-radius: 6px;
    font-size: 12px;
  }

  .channel-item {
    font-size: 12px;
    text-align: center;
    line-height: 36px;
    background-color: #fafafa;
    margin: 6px;
  }

  .cross-badge {
    position: absolute;
    right: -3px;
    top: 0;
    border: none;
  }

  .sp-line {
    margin: 10px 0 20px 0;
  }
</style>
