/**
 * 基于axios封装的请求模块
 */
import axios from 'axios'
// 创建一个axios实例，说白了就是复制一个axios
// 通过这个实例去发请求，把需要的配置配置给这个实例来处理
const request = axios.create({
// 请求的基础路径
  baseURL: 'http://ttapi.research.itcast.cn/'
})
// 请求拦截器
axios.interceptors.request.use(
  // 所有任何请求会经过这里
  // config 是当前请求相关的配置信息对象
  // config 是可以修改的
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    // 在允许请求发出之前定制统一业务功能处理
    // 如果有登录用户信息，则统一设置 token
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    // Do something before request is sent
    // 当这里 return config 之后请求才会真正发出去
    return config
  },
  // 请求失败，会经过这里
  function (error) {
  // Do something with request error
    return Promise.reject(error)
  }
)
// 响应拦截器

// 导出请求方法
export default request

// 谁要用谁就加载request模块
// import request from 'request.js'
// request.xxx
// request({
// method: ,
// url: ''
// })
