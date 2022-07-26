<template>
  <div class="user-edit-container">
    <!-- Header 区域 -->
    <van-nav-bar title="编辑资料" left-arrow @click-left="$router.back()" fixed />

    <!-- 用户资料 -->
    <van-cell-group class="action-card">
      <van-cell title="头像" is-link center>
        <template #default>
          <van-image
            round
            class="avatar"
            :src="useUserStore.userProfile.photo"
            @click="fileRef?.click()"
          />
          <!-- 文件选择框 -->
          <input type="file" accept="image/*" @change="onFileChange" v-show="false" ref="fileRef" />
        </template>
      </van-cell>
      <van-cell title="名称" is-link :value="userStore.userProfile.name" @click="onNameCellClick" />
      <van-cell
        title="生日"
        is-link
        :value="userStore.userProfile.birthday"
        @click="onBirthCellClick"
      />
    </van-cell-group>
    <!-- 修改用户名称的对话框 -->
    <van-dialog
      v-model="showNameDialog"
      title="修改名称"
      show-cancel-button
      :before-close="beforeClose"
    >
      <!-- input-align 文本横向的对其方式 -->
      <van-field
        v-model.trim="name"
        placeholder="请输入用户名"
        input-align="center"
        maxlength="7"
        ref="nameRef"
      />
    </van-dialog>
    <!-- 修改生日的动作面板 -->
    <van-action-sheet v-model="showBirthSheet">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择出生日期"
        :min-date="minDate"
        :max-date="maxDate"
        @cancel="showBirthSheet = false"
        @confirm="updateBirthday"
      />
    </van-action-sheet>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, nextTick } from 'vue'
  import { useUserStore } from '@/store/useUserStore'
  import { FieldInstance, Notify } from 'vant'
  import { updateUserProfileAPI, updateUserAvatarAPI } from '@/api/user'
  import dayjs from 'dayjs'
  const userStore = useUserStore()
  onMounted(() => {
    userStore.initUserProfile()
  })
  const showNameDialog = ref(false)
  const name = ref('')
  const nameRef = ref<FieldInstance | null>(null)
  const fileRef = ref<HTMLInputElement | null>(null)
  const showBirthSheet = ref(false)
  // 最小可选日期（0 表示 1月份）
  const minDate = ref(new Date(1900, 0, 1))
  // 最大可选日期（11 表示 12月份）
  const maxDate = ref(new Date(2050, 11, 31))
  // 当前日期
  const currentDate = ref(new Date())
  // 点击了修改名称的 cell
  const onNameCellClick = () => {
    // 把用户的名称赋值给 data 中的 name
    name.value = userStore.userProfile.name
    showNameDialog.value = true
    // DOM 更新完毕之后，让文本框自动获得焦点
    nextTick(() => {
      nameRef?.value?.focus()
    })
  }
  // 选中的文件发生了变化
  const onFileChange = async (e: Event) => {
    // 获取到用户选择的文件列表
    const files = e?.currentTarget?.files
    // 如果没有选择任何文件，则不执行后续的业务逻辑
    if (files?.length === 0) return
    // 1.1 创建 FormData 的对象
    const fd = new FormData()
    // 1.2 向 fd 中追加数据项
    fd.append('photo', files?.[0])
    // 2. 调用 API 接口，更新头像
    const { data: res } = await updateUserAvatarAPI(fd)
    if (res.message === 'OK') {
      // 2.1 更新用户的简介信息
      userStore.initUserProfile()
      // 2.2 提示用户更新成功
      Notify({ type: 'success', message: '更新头像成功！', duration: 2000 })
    }
  }
  // 更新用户的生日
  const updateBirthday = async (value: Date) => {
    // 关闭动作面板
    showBirthSheet.value = false
    // 调用 .format() 方法对时间进行格式化
    const dateStr = dayjs(value).format('YYYY-MM-DD')
    // 调用 API 接口，修改用户的生日
    const { data: res } = await updateUserProfileAPI({ birthday: dateStr })
    if (res.message === 'OK') {
      // 重新获取用户的简介信息
      userStore.initUserProfile()
      // 提示用户更新成功
      Notify({ type: 'success', message: '生日修改成功！', duration: 2000 })
    }
  }
  // 点击了修改生日的 cell
  const onBirthCellClick = () => {
    // 如果用户生日的值存在，则初始值为用户的生日；否则为当前日期
    currentDate.value = userStore.userProfile.birthday
      ? new Date(userStore.userProfile.birthday)
      : new Date()
    showBirthSheet.value = true
  }
  // Dialog 关闭前的处理函数
  const beforeClose = (action: string, done: (param?: boolean) => void) => {
    // 点击了“取消”按钮
    if (action === 'cancel') return done()
    // 判断名称的长度是否不合法
    if (name.value === '' || name.value.length > 7) {
      // 1. 提示用户“名称的长度为1-7个字符”
      Notify({ type: 'warning', message: '名称的长度为1-7个字符', duration: 2000 })
      // 2. 让文本框持续获得焦点
      nameRef?.value?.focus()
      // 3. 阻止对话框关闭
      return done(false)
    }
    // TODO：发起修改名称的请求：
    // A. 如果请求成功，则调用 done() 关闭对话框
    // B. 如果请求失败，则提示用户失败的信息，并调用 done(false) 阻止对话框关闭
    updateName(done)
  }
  // 更新用户的简介信息
  const updateName = async (done: (param?: boolean) => void) => {
    try {
      const { data: res } = await updateUserProfileAPI({ name: name.value })
      if (res.message === 'OK') {
        // 1. 关闭对话框
        done()
        // 2. 重新请求用户的简介信息
        userStore.initUserProfile()
        // 3. 提示用户更新成功
        Notify({ type: 'success', message: '名称更新成功！', duration: 2000 })
      }
    } catch (error: any) {
      if (error.response.status === 409) {
        // 提示用户名称被占用
        Notify({ type: 'warning', message: '名称被占用，请更换后重试！', duration: 2000 })
        // 阻止关闭对话框
        done(false)
        // 让文本框持续获得焦点
        nameRef?.value?.focus()
      } else {
        // 关闭对话框
        done()
        // 提示用户名称被占用
        Notify({ type: 'danger', message: '名称更新失败！', duration: 2000 })
      }
    }
  }
</script>
<style lang="less" scoped>
  .user-edit-container {
    padding-top: 46px;
  }

  .user-edit-container {
    padding-top: 46px;
    .avatar {
      width: 50px;
      height: 50px;
    }
  }
</style>
