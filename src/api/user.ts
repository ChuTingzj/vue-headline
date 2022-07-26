import request from '@/utils/request'
import { form } from '@/types/user'
import axios from 'axios'
// 登录的 API 接口
export const loginAPI = (data: form) => request.post('/v1_0/authorizations', data)
// 请求用户基本信息的 API
export const getUserInfoAPI = () => request.get('/v1_0/user')
// 请求用户简介信息的 API
export const getUserProfileAPI = () => request.get('/v1_0/user/profile')
// 修改用户简介信息的 API（形参中的 obj 是对象格式的简介信息）
// 可能的格式有以下两种：
// { name: 'xxx' } 或 { birthday: '2012-12-12' }
export const updateUserProfileAPI = (obj: { name: string } | { birthday: string }) =>
  request.patch('/v1_0/user/profile', obj)
// 修改头像的 API（形参中的 fd 表示 FormData 格式的表单数据）
export const updateUserAvatarAPI = (fd: FormData) => request.patch('/v1_0/user/photo', fd)
// 换取 Token 的 API（形参中的 refreshToken 用来换取新 token）
export const exchangeTokenAPI = (refreshToken: string) =>
  axios({
    method: 'PUT',
    // 这里必须填写完整的请求 URL 地址
    url: 'http://www.liulongbin.top:8000/v1_0/authorizations',
    headers: {
      // 在请求头中携带 Authorization 身份认证字段
      Authorization: 'Bearer ' + refreshToken
    }
  })
