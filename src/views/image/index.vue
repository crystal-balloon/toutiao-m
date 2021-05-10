<template>
  <div class='image-container'>
    <el-card class="box-card">
      <div slot="header" class="clearfix">

        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item to='/'>首页</el-breadcrumb-item>
          <el-breadcrumb-item>素材管理</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- <el-button style="float: right; padding: 3px 0" type="text">Operation button</el-button> -->
      </div>
      <div class='action-head'>
        <el-radio-group v-model="collect" size='mini' @change="loadImages(1)">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button
          size='mini'
          type='success'
          @click='dialogUploadVisible = true'
          >上传素材</el-button>
      </div>
      <el-row :gutter='10'>
        <el-col
          :xs='12'
          :sm='6'
          :md='6'
          :lg='4'
          v-for='(img, index) in images'
          :key='index'
          class='image-item'
        >
          <el-image
            style=" height: 100px；"
            src="https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg"
            fit="cover">
          </el-image>
          <!-- 收藏删除小图标 -->
          <div class="image-action">
            <el-button
              type="warning"
              :icon="img.is_collected ? 'el-icon-star-on' : 'el-icon-star-off'"
              circle
              size='small'
              @click='onCollect(img)'
              :loading="img.loading"
            ></el-button>
            <!--
              class 样式绑定
              {
                true时的作用类名：布尔值为true，
                false时的作用类名： 布尔值为false
              }
             -->
            <!-- <i
              :class="{
                'el-icon-star-on': img.is_collected,
                'el-icon-star-off': !img.is_collected
              }"
              @click='onCollect(img)'
             ></i> -->
            <el-button
              size='small'
              type='danger'
              icon='el-icon-delete-solid'
              circle
              @click='onDelete(img)'
              :loading='img.loading '
            ></el-button>
            <i class='el-icon-delete-solid'></i>
          </div>
        </el-col>
      </el-row>
      <!-- 分页处理 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :total="totalCount"
        :page-size="pageSize"
        :current-page.sync="page"
        @current-change='onPageChange'>
      </el-pagination>
    </el-card>
    <el-dialog title="上传素材"
      :visible.sync="dialogUploadVisible"
      :append-to-body='true'
    >
    <!-- upload 组件本身就支持请求提交上传操作，说白了就是使用它不用自己去发请求，它会自己发 -->
      <el-upload
      v-if='dialogUploadVisible'
        class="upload-demo"
        drag
        action="https://ttapi.research.itcast.cn/mp/v1_0/user/images"
        :headers = 'uploadHeaders'
        name = 'image'
        multiple
        :on-success = 'onUploadSuccess'
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
      </el-upload>
    </el-dialog>
  </div>
</template>

<script>
import {
  getImages,
  collectImage,
  deleteImage
} from '@/api/image'

export default {
  name: 'ImageIndex',
  components: {},
  props: {},
  data () {
    // 73 78-80行 关于请求头，因为这里的upload会自己发请求，故不用utils里面的request请求，所以要获取用户名，token等，但是，显示
    // 解析错误，显示如下：
    // (property) uploadHeaders: {
    //     Authorization: string;
    // }
    // ',' expected.Vetur(1005)

    // const user = JSON.parse(window.localStorage.getItem('user'))
    return {
      collect: 'false', // 默认查询全部素材列表
      images: [],
      dialogUploadVisible: false, // 图片素材列表
      totalCount: 0, // 总数据条数
      pageSize: 20, // 每页大小
      page: 1
      // uploadHeaders: {
      //   Authorization: `Bearer ${user.token}`
      // }
    }
  },
  computed: {},
  watch: {},
  created () {
    // 页面初始化加载第一页数据
    this.loadImages(1)
  },
  mounted () {},
  methods: {
    loadImages (page = 1) {
      // 重置高亮页码，防止数据和页码不对应
      this.page = page
      getImages({
        collect: this.collect,
        page,
        per_page: this.pageSize
      }).then(res => {
        const results = res.data.data.results
        results.forEach(img => {
          // img 对象本来没有 loading 数据，我们这里收到的往里面添加该数据是用来控制每个收藏按钮的 loading 状态
          img.loading = false
        })
        this.images = results
        this.totalCount = res.data.data.total_count
      })
    },

    // onCollectChange () {
    //   this.loadImages(1)
    // },

    onUploadSuccess () {
      // 关闭对话框
      this.dialogUploadVisible = false
      // 更新素材列表
      this.loadImages(this.page)
      this.$message({
        type: 'success',
        message: '上传成功'
      })
    },

    onCollect (img) {
      // 展示 loading
      img.loading = true
      collectImage(img.id, !img.is_collected).then(res => {
        // 更新视图状态
        img.is_collected = !img.is_collected
        // 关闭 loading
        img.loading = false
      })
      // if (img.is_collected) {
      //   // 已收藏，取消收藏
      //   collectImage(img.id, false)
      // } else {
      //   // 没有收藏，添加收藏
      //   collectImage(img.id, true)
      // }
    },

    onDelete (img) {
      deleteImage(img.id).then(res => {
        // 重新加载数据列表
        this.loadImages(this.page)
      })
    }
  }
}
</script>
<style scoped lang='less'>
  .action-head {
    padding-bottom: 20px;
    // padding: 5px 0;
    display:flex;
    justify-content:space-between;
  }
  .image-item {
    position: relative
  }
  .image-action {
    font-size: 25px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    color: #fff;
    height: 40px;
    background-color: rgba(204, 204, 204, 0.5);
    position: absolute;
    bottom: 4px;
    left: 5px;
    right: 5px;
  }
</style>
