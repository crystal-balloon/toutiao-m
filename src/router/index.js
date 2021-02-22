import Vue from 'vue'
import VueRouter from 'vue-router'
// 在VueCLI创建的项目中，@表示src目录，是src目录的路径别名
// 好处：不受当前文件路径影响
// 注意：@就是src路径，别忘记'/'
// 建议：加载的资源在当前目录下时，正常写；
// 如果需要进行父级路径查找都使用@
import Login from '@/views/login/'
import Home from '@/views/home/'
import Layout from '@/views/layout/'
import Article from '@/views/article'

Vue.use(VueRouter)
// 路由配置表
const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // 命名路由有一个子路由，这个路由名字没有意义，所以只是警告
    // 正确做法：如果有默认子路由，不要给父路由起名字
    // name: 'layout',
    component: Layout,
    children: [
      {
        // path 为空，会作为默认子路由渲染;通常会把根路径 / 设置为网站的首页，因为我们在手动输入网址访问页面时，可以忽略/
        path: '',
        // 路由的名字是干啥的？
        name: 'home',
        component: Home
      },
      {
        path: '/article',
        name: 'article',
        component: Article
      }
    ]
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
// 路由导航守卫，就是所有页面的导航都会经过这里
// 守卫页面的导航
// to: 要去的路由信息
// from：来自哪里的路由信息
// next：放行方法
// router.beforeEach((to, from, next) => {
//   const user = JSON.parse(window.localStorage.getItem('user'))
//   // 校验非登录页面的登录状态
//   // 如果要访问的页面不是 /login，校验登陆状态
//   if (to.path !== '/login') {
//     if (user) {
//     // 如果登录了，则允许通过
//       next()
//     } else {
//     // 如果没有登录，则跳转到登录界面
//       next('/login')
//     }
//   } else {
//     // 登录页面，正常允许通过
//     next()
//   }
// })
export default router
