import Vue from 'vue'
import VueRouter from 'vue-router'
// 在VueCLI创建的项目中，@表示src目录，是src目录的路径别名
// 好处：不受当前文件路径影响
// 注意：@就是src路径，别忘记'/'
// 建议：加载的资源在当前目录下时，正常写；
// 如果需要进行父级路径查找都使用@
import Login from '@/views/login'

Vue.use(VueRouter)
// 路由配置表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  }
  // 默认path
  // {
  //   path: '/',
  //   name: 'login',
  //   component: Login
  // }
]

const router = new VueRouter({
  routes
})

export default router
