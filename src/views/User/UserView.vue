<template>
  <div class="user-container">
    <!-- 用户基本信息面板 -->
    <div class="user-card">
      <!-- 用户头像、姓名 -->
      <van-cell>
        <!-- 使用 title 插槽来自定义标题 -->
        <template #icon>
          <img src="" alt="" class="avatar" />
        </template>
        <template #title>
          <span class="username">{{ userStore.userInfo.name }}</span>
        </template>
        <template #label>
          <van-tag color="#fff" text-color="#007bff">申请认证</van-tag>
        </template>
      </van-cell>
      <!-- 动态、关注、粉丝 -->
      <div class="user-data">
        <div class="user-data-item">
          <span>{{ userStore.userInfo.art_count }}</span>
          <span>动态</span>
        </div>
        <div class="user-data-item">
          <span>{{ userStore.userInfo.follow_count }}</span>
          <span>关注</span>
        </div>
        <div class="user-data-item">
          <span>{{ userStore.userInfo.fans_count }}</span>
          <span>粉丝</span>
        </div>
      </div>
    </div>

    <!-- 操作面板 -->
    <van-cell-group class="action-card">
      <van-cell icon="edit" title="编辑资料" is-link @click="router.push({ name: 'user-edit' })" />
      <van-cell icon="chat-o" title="小思同学" is-link to="/chat" />
      <van-cell icon="warning-o" title="退出登录" is-link @click="logout" />
    </van-cell-group>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, onActivated } from 'vue'
  import { useRouter } from 'vue-router'
  import { useUserStore } from '@/store/useUserStore'
  import { Dialog } from 'vant'
  const router = useRouter()
  let userStore: any = null
  onMounted(() => {
    userStore = useUserStore()
    userStore.initUserInfo()
  })
  onActivated(() => {
    userStore.initUserInfo()
  })
  // 点击了退出登录
  const logout = async () => {
    // 展示确认的提示框
    const confirmResult = await Dialog.confirm({
      title: '提示',
      message: '确认退出登录吗？'
    }).catch((err) => err)

    // 如果点击了取消，则不执行后续的操作
    if (confirmResult === 'cancel') return

    // TODO：实现退出的登录操作：
    // 1. 清空 vuex 中的数据
    // 2. 清空本地的数据
    userStore.cleanState()
    // 3. 跳转到登录页
    router.push('/login')
  }
</script>
<style lang="less" scoped>
  .user-container {
    .user-card {
      background-color: #007bff;
      color: white;
      padding-top: 20px;
      .van-cell {
        background: #007bff;
        color: white;
        &::after {
          display: none;
        }
        .avatar {
          width: 60px;
          height: 60px;
          background-color: #fff;
          border-radius: 50%;
          margin-right: 10px;
        }
        .username {
          font-size: 14px;
          font-weight: bold;
        }
      }
    }
    .user-data {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      font-size: 14px;
      padding: 30px 0;
      .user-data-item {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 33.33%;
      }
    }
  }
</style>
