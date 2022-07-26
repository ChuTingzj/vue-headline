<template>
  <div class="login-container">
    <!-- NavBar 组件：只需提供 title 标题 -->
    <van-nav-bar title="文章头条" fixed />
    <!-- 登录的表单 -->
    <van-form @submit="login">
      <!-- 手机号的表单项 -->
      <van-field
        type="tel"
        v-model="form.mobile"
        label="手机号码"
        placeholder="请输入手机号码"
        :rules="rules.mobile"
      >
      </van-field>

      <!-- 登录密码的表单项 -->
      <van-field
        type="password"
        v-model="form.code"
        label="登录密码"
        placeholder="请输入登录密码"
        :rules="rules.code"
      >
      </van-field>
      <div style="margin: 16px">
        <van-button round block type="default" native-type="submit">提交</van-button>
      </div>
    </van-form>
  </div>
</template>
<script lang="ts" setup>
  import { useRouter, useRoute } from 'vue-router'
  import { reactive } from 'vue'
  import { loginAPI } from '@/api/user'
  import { useUserStore } from '@/store/useUserStore'
  // 表单的校验规则对象
  const rules = reactive({
    // 手机号的校验规则
    mobile: [
      { required: true, message: '请填写您的手机号', trigger: 'onBlur' },
      { pattern: /^1\d{10}$/, message: '请填写正确的手机号', trigger: 'onBlur' }
    ],
    // 密码的校验规则
    code: [{ required: true, message: '请填写您的密码', trigger: 'onBlur' }]
  })
  // 登录表单的数据，最终要双向绑定到 form 这个数据对象上
  const form = reactive({
    // 用户的手机号
    mobile: '',
    // 登录的密码
    code: ''
  })
  const userStore = useUserStore()
  const router = useRouter()
  const route = useRoute()
  const login = async () => {
    // 只有当表单数据校验通过之后，才会调用此 login 函数
    const { data: res } = await loginAPI(form)
    // 当数据请求成功之后，res.data 中存储的就是服务器响应回来的数据
    // 判断是否登录成功了
    if (res.message === 'OK') {
      // 3. 把登录成功的结果，存储到 vuex 中
      userStore.updateTokenInfo(res.data)
      // 4. 登录成功后，跳转到主页
      const navPath = (route.query.pre as string) || '/'
      router.replace(navPath)
    }
  }
</script>
<style lang="less">
  .login-container {
    padding-top: 46px;
  }
</style>
