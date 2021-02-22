<template>
<el-menu
  class="nav-menu"
  default-active="/"
  background-color="rgb(97 97 100)"
  text-color="#fff"
  active-text-color="#ffd04b"
  router
  :collapse="isCollapse"
>
  <img src="../logo4.png" alt="" class="aside-logo">
  <!-- el-menu-item 的 index 不要一致，保持唯一性 -->
  <el-menu-item index="/">
    <i class="el-icon-menu"></i>
    <span slot="title">首页</span>
  </el-menu-item>
  <el-menu-item index="/article">
    <i class="iconfont iconarticle1"></i>
    <span slot="title">内容管理</span>
  </el-menu-item>
  <el-menu-item index="/image">
    <i class="iconfont icontupian2"></i>
    <span slot="title">素材管理</span>
  </el-menu-item>
  <el-menu-item index="/publish">
    <i class="iconfont iconpublish"></i>
    <span slot="title">发布文章</span>
  </el-menu-item>
  <el-menu-item index="/comment">
    <i class="iconfont iconcomment"></i>
    <span slot="title">评论管理</span>
  </el-menu-item>
  <el-menu-item index="/fans" >
    <i class="iconfont iconfans"></i>
    <span slot="title">粉丝管理</span>
  </el-menu-item>
  <el-menu-item index="/settings">
    <i class="iconfont iconSettingscontroloptions"></i>
    <span slot="title">个人设置</span>
  </el-menu-item>
</el-menu>
</template>

<script>
export default {
  components: {},
  name: 'AppAside',
  props: ['is-collapse'],
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  mounted () {},
  methods: {}
}
</script>
<style scoped lang='less'>
  .aside-logo {
    width: 100px;
    // height: 13%;
    // background-size: cover;
    // display: inline-block;
    // background:  url("../logo2.jpg") no-repeat;
    // background-size: 100% 100%;
    margin: 0 30px;
  }
  .nav-menu {
    .iconfont {
      margin-right: 10px;
      padding-left: 5px;
    }
  }

  .el-menu--collapse {
    .aside-logo {
      width: 50px;
      margin: 0 7px;
    }
  }
</style>
