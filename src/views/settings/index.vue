<template>
  <div class='settings-container'>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
          <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item to='/'>首页</el-breadcrumb-item>
            <el-breadcrumb-item>个人设置</el-breadcrumb-item>
          </el-breadcrumb>
      </div>
      <el-row>
        <el-col :span='15'>
          <el-form ref="form" :model="user" label-width="80px">
            <el-form-item label="编号">
              {{ user.id }}
            </el-form-item>

            <el-form-item label="手机">
              {{ user.mobile }}
            </el-form-item>

            <el-form-item label="媒体名称">
              <el-input v-model="user.name"></el-input>
            </el-form-item>

            <el-form-item label="媒体介绍">
              <el-input type="textarea" v-model="user.intro"></el-input>
            </el-form-item>

            <el-form-item label="邮箱">
              <el-input v-model="user.email"></el-input>
            </el-form-item>

            <el-form-item>
              <el-button
                type="primary"
                @click="onUpdateUser"
                :loading='updateProfileLoading'
              >保存</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span='4' :offset='2'>
          <el-avatar
            shape="square"
            :size="150"
            fit="cover"
            :src="user.photo"
          ></el-avatar>
          <!-- 法一 -->
          <p @click='$refs.file.click()'>点击修改头像</p>
          <input
            type="file"
            hidden
            ref='file'
            @change='onFileChange'
          >
          <!-- 法二 -->
          <!-- <label for="file">点击修改头像</label>
          <input
            type="file"
            id='file'
            hidden
          > -->
        </el-col>
      </el-row>
    </el-card>

    <el-dialog
      title="修改头像"
      :visible.sync="dialogVisible"
      append-to-body
      @opened='onDialogOpened'
      @closed='onDialogClosed'
    >
      <div class='preview-image-wrap'>
        <img
          :src="previewImage"
          alt=""
          class='preview-image'
          ref='preview-image'
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button
          type="primary"
          @click="onUpdatePhoto"
          :loading='updatePhotoLoading'
        >确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import {
  getUserProfile,
  updateUserPhoto,
  updateUserProfile
} from '@/api/user'
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import globalBus from '@/utils/global-bus'

export default {
  name: 'SettingsIndex',
  components: {},
  props: {},
  data () {
    return {
      user: {
        email: '',
        id: null,
        intro: '',
        mobile: '',
        name: '',
        photo: ''

      }, // 用户资料
      dialogVisible: false, // 控制上传图片裁切预览的显示状态
      previewImage: '',
      cropper: null, // 裁切器实例
      updatePhotoLoading: false, // 更新用户头像 loading 状态
      updateProfileLoading: false // 更新基本信息的 loading 状态
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadUser()
  },
  mounted () {},
  methods: {
    onUpdateUser () {
      // 表单验证
      // 验证通过，提交表单
      // 开启 loading 状态
      this.updateProfileLoading = true
      const { name, intro, email } = this.user
      updateUserProfile({
        name,
        intro,
        email
      }).then(res => {
        // this.user = res.data.data
        this.$message({
          type: 'success',
          message: '保存成功'
        })
        // 关闭 loading 状态
        this.updateProfileLoading = false

        // 更新头部当前登录用户的信息
        // 发布通知，用户信息已修改
        globalBus.$emit('update-user', this.user)
      })
    },
    loadUser () {
      getUserProfile().then(res => {
        this.user = res.data.data
      })
    },

    onFileChange () {
      // 处理图片预览
      const file = this.$refs.file
      const blobData = window.URL.createObjectURL(file.files[0])
      this.previewImage = blobData
      // 展示弹出层，预览用户选择的图片
      this.dialogVisible = true
      // 解决选择相同文件不触发 change 事件问题
      this.$refs.file.value = ''
    },

    onDialogOpened () {
      // 图片裁切器必须基于 image 进行初始化
      // 注意： image 必须是可见状态才能完成初始化
      // 因为这里要在对话框里面初始化裁切器，所以务必要在对话框完全打开的状态下进行初始化
      // 获取图片 DOM 节点
      const image = this.$refs['preview-image']
      // 第一次初始化好以后，如果预览裁切的图片发生了变化，裁切器默认不会更新
      // 如果需要预览图片发生变化更新裁切器：
      // 方式一：裁切器.replace(url) 方法
      // 方式二： 销毁裁切器，重新初始化

      // 初始化裁切器
      // 方式一
      // if (this.cropper) {
      //   this.cropper.replace(this.previewImage)
      //   return
      // }
      this.cropper = new Cropper(image, {
        aspectRatio: 16 / 9,
        viewMode: 1,
        dragMode: 'none',
        cropBoxResizable: false
        // crop (event) {
        //   console.log(event.detail.x)
        //   console.log(event.detail.y)
        //   console.log(event.detail.width)
        //   console.log(event.detail.height)
        //   console.log(event.detail.rotate)
        //   console.log(event.detail.scaleX)
        //   console.log(event.detail.scaleY)
        // }
      })
    },

    onDialogClosed () {
      // 对话框关闭，销毁裁切器(方式二)
      this.cropper.destroy()
    },

    onUpdatePhoto () {
      // 点确定按钮开始 loading
      this.updatePhotoLoading = true
      // 获取裁切的图片对象
      this.cropper.getCroppedCanvas().toBlob(file => {
        const fd = new FormData()
        fd.append('photo', file)
        // 请求更新用户头像 // 请求提交 fd
        updateUserPhoto(fd).then(res => {
          // 关闭对话框
          this.dialogVisible = false
          // 更新视图展示

          // 直接把裁切结果的文件对象转为 blob 数据本地预览
          this.user.photo = window.URL.createObjectURL(file)

          // 关闭确定按钮的 loading
          this.updatePhotoLoading = false

          this.$message({
            type: 'success',
            message: '更新头像成功'
          })
          // 同步更新页面导航栏的用户头像
          globalBus.$emit('update-user', this.user)

          // 把服务端返回的图片进行展示有点慢
          // this.user.photo = res.data.data.photo
        })
      })
    }
  }
}
</script>
<style scoped lang='less'>
  .preview-image-wrap {
    .preview-image {
      display: block;
      max-width: 100%;
      height: 200px;
    }
  }
</style>
