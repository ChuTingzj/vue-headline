// 自定义主题的文件路径
const path = require('path')
const coverPath = path.join(__dirname, './src/cover.less')
const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            // 通过 less 文件覆盖（文件路径为绝对路径）
            hack: `true; @import "${coverPath}";`
          }
        }
      }
    }
  },
  // 增强 vue-cli 的 webpack 配置项
  configureWebpack: {
    // 打包优化
    externals: {
      // import 时的包名称: window 全局的成员名称
      'highlight.js': 'hljs',
      vue: 'Vue',
      'vue-router': 'VueRouter',
      axios: 'axios',
      vant: 'vant',
      dayjs: 'dayjs',
      'socket.io-client': 'io',
      popmotion: 'popmotion'
    }
  }
})
