<template>
  <el-container class="layout-container">
    <el-aside width="auto" class="aside" backgroundColor="red">
      <app-aside class="aside-menu" :is-collapse="isCollapse"/>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div>
          <i
            :class="{
              'el-icon-s-unfold': isCollapse,
              'el-icon-s-fold': !isCollapse
            }"
            @click="isCollapse = !isCollapse"></i>
          <span>来木语，足不出户知天下</span>
        </div>
        <el-dropdown>
          <div class="avatar-wrap">
            <img class="avatar" :src="user.photo" alt="">
            <!-- <img class="avatar" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fb-ssl.duitang.com%2Fuploads%2Fitem%2F201412%2F07%2F20141207195641_z3Ces.jpeg&refer=http%3A%2F%2Fb-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1616397965&t=bafedff169910269708d97eeaa6af07d" alt=""> -->
            <span>{{ user.name }}</span>
            <i class="el-icon-arrow-down el-icon--right"></i>
          </div>
          <!-- <span class="el-dropdown-link">下拉菜单
          </span> -->
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>设置</el-dropdown-item>
            <!-- 组件默认是不识别原生事件的，除非内部做了处理 -->
            <el-dropdown-item @click.native="onLogOut">退出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-header>
      <el-main class="main">
        <!-- 子路由出口 -->
        <router-view/>

      </el-main>
    </el-container>
  </el-container>

</template>

<script>
import AppAside from './components/aside'
// import { getUserProfile } from '@/api/user'
import avatar from './avatar.jpg'
export default {
  name: 'LayoutIndex',
  components: {
    AppAside
  },
  props: {},
  data () {
    return {
      // 当前登录用户信息
      user: {},
      // 侧边菜单栏的展示状态
      isCollapse: false
    }
  },
  computed: {},
  watch: {},
  created () {
    // 组件初始化好，请求获取用户资料
    this.loadUserProfile()
  },
  mounted () {},
  methods: {
    // 除了登录接口，其他所有接口都需要授权才能请求使用
    // 或者说，除了登录接口，其他接口都需要提供身份令牌才能获取数据
    loadUserProfile () {
      // getUserProfile().then(res => {
      //   this.user = res.data.data
      // })
      this.user = {
        name: '水晶泪',
        photo: avatar
      }
    },

    onLogOut () {
      this.$confirm('确认退出吗?', '退出提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 把用户的登录状态清除
        window.localStorage.removeItem('user')
        // 跳转到登录界面
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消退出'
        })
      })
    }
  }
}
</script>
<style scoped lang='less'>
.layout-container {
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
.aside {
  background-color: #c3d9f1;
  .aside-menu {
    height: 100%;
  }
}

.header {
  background-color: #fbfcf8;
  height: 60px;
  border-bottom: 1px solid #ccc;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main {
  background-color: #e9eef3;
}

.avatar-wrap {
  display: flex;
  align-items: center;
  .avatar {
    width: 50px;
    height: 50px;
    border-radius: 50%;
  }
}
</style>
