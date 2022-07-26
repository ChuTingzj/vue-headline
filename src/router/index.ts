import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import { useUserStore } from '@/store/useUserStore'
const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/HomeView.vue'),
    children: [
      // path 为"空字符串"的子路由规则，叫做"默认子路由"
      {
        path: 'home',
        component: () => import('@/views/Main/MainView.vue'),
        meta: { isRecord: true, top: 0 }
      },
      { path: 'user', component: () => import('@/views/User/UserView.vue'), name: 'user' }
    ],
    redirect: '/home'
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/LoginView.vue')
  },
  // 搜索组件的路由规则
  { path: '/search', component: () => import('@/views/Search/SearchView.vue'), name: 'search' },
  // 搜索结果页
  {
    path: '/search/:kw',
    component: () => import('@/views/SearchResult/SearchResult.vue'),
    name: 'search-result',
    props: true,
    meta: { isRecord: true, top: 0 }
  },
  // 文章详情的路由规则
  {
    path: '/article/:id',
    component: () => import('@/views/ArticleDetail/ArticleDetail.vue'),
    name: 'art-detail',
    props: true,
    meta: { isRecord: true, top: 0 }
  },
  // 编辑用户资料的路由规则
  {
    path: '/user/edit',
    component: () => import('@/views/UserEdit/UserEdit.vue'),
    name: 'user-edit'
  },
  // 小思聊天的路由规则
  { path: '/chat', component: () => import('@/views/Chat/ChatView.vue'), name: 'chat' }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})
// 所有有权限页面的路径，都在这个数组之中
const pagePathArr = ['/user', '/user/edit']

// 为路由的实例对象挂载全局前置守卫
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  if (pagePathArr.indexOf(to.path) !== -1) {
    // 1. 从 store 中获取 token 的值
    //    注意：store.state.tokenInfo 要么是 {} 空对象，要么是包含 {token, refresh_token} 的对象
    const tokenStr = userStore.tokenInfo.token
    if (tokenStr) {
      // 1.1 token 有值，已登录过（操作：直接放行）
      next()
    } else {
      // 1.2 token 不存在，没有登录（操作：强制跳转到登录页）
      next(`/login?pre=${to.fullPath}`)
    }
  } else {
    // 访问的是没有权限的页面
    next()
  }
})
router.afterEach((to) => {
  // 如果当前的路由的元信息中，isRecord 的值为 true
  if (to.meta.isRecord) {
    setTimeout(() => {
      // 则把元信息中的 top 值设为滚动条纵向滚动的位置
      window.scrollTo(0, to.meta.top as number)
    }, 0)
  }
})
export default router
