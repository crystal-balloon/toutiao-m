<template>
  <div class='publish-container'>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>{{ $route.query.id ? '修改文章' : '发布文章'}}</el-breadcrumb-item>
        </el-breadcrumb>

      </div>
      <el-form
        ref="publish-form"
        :model="article"
        label-width="80px"
        :rules='formRules'>
        <el-form-item label="标题" prop='title'>
          <el-input v-model="article.title"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop='content'>
          <el-tiptap
            v-model="article.content"
            :extensions="extensions"
            placeholder="请输入文章内容"
            height='360'
          ></el-tiptap>
        </el-form-item>
        <el-form-item label="封面">
          <el-radio-group v-model="article.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="频道" prop='channel_id'>
          <el-select v-model="article.channel_id" placeholder="请选择频道">
            <el-option
             :label="channel.name"
             :value="channel.id"
             v-for="(channel, index) in channels"
             :key="index"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onPublish(false)">发表</el-button>
          <el-button @click="onPublish(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>

  </div>
</template>

<script>
import { getArticlesChannels, addArticle, getArticle, updateArticle } from '@/api/article'
import {
  ElementTiptap,
  Doc,
  Text,
  Paragraph,
  Heading,
  Bold,
  Underline,
  Italic,
  CodeBlock,
  Link,
  Image,
  Strike,
  ListItem,
  BulletList,
  OrderedList,
  Preview,
  Fullscreen
} from 'element-tiptap'
import 'element-tiptap/lib/index.css'
import { uploadImage } from '@/api/image'

export default {
  name: 'PublishIndex',
  components: {
    'el-tiptap': ElementTiptap
  },
  props: {},
  data () {
    return {
      // 文章频道列表
      channels: [],
      article: {
        // 文章标题
        title: '',
        // 文章内容
        content: '',
        // 文章封面
        cover: {
          // 封面类型 -1：自动；0：无图；1:1张；3:3张
          type: 0,
          // 封面图片的地址
          images: []
        },
        channel_id: null
      },
      // 编辑器的 extensions
      // 它们将会按照你声明的顺序被添加到菜单栏和气泡菜单中
      extensions: [
        new Doc(),
        new Text(),
        new Paragraph(),
        new Heading({ level: 5 }),
        new Bold({ bubble: true }), // 在气泡菜单中渲染菜单按钮
        new Link(),
        new Image({
          // 默认会把图片生成 base64 字符串和内容存储在一起，如果需要自定义图片上传
          uploadRequest (file) {
            // 如果接口要求 Content-Type 是 multipart/form-data ,则请求体必须使用 FormData
            const fd = new FormData()
            fd.append('image', file)
            // 第一个 return 是返回 Promise 对象
            // 为什么？因为 axios 本身就是返回 Promise 对象
            return uploadImage(fd).then(res => {
              // 这个 return 是返回最后的结果
              return res.data.data.url
            })
          } // 图片的上传方法，返回一个 Promise<url>
        }),
        new CodeBlock(),
        new Underline({ bubble: true, menubar: false }), // 在气泡菜单而不在菜单栏中渲染菜单按钮
        new Italic(),
        new Strike(),
        new ListItem(),
        new BulletList(),
        new OrderedList(),
        new Preview(),
        new Fullscreen()
      ],
      formRules: {
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, max: 30, message: '长度在 5 到 30 个字符', trigger: 'blur' }
        ],
        content: [
          // 自定义校验规则
          {
            validator (rule, value, callback) {
              if (value === '<p></p>') {
                // 验证失败
                callback(new Error('请输入文章内容'))
              } else {
                // 验证通过
                callback()
              }
            }
          },
          { required: true, message: '请输入文章内容', trigger: 'blur' }
        ],
        channel_id: [
          { required: true, message: '请选择文章频道' }
        ]
      }
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()
    // 由于我们让发布和修改使用的是同一个组件，所以这里要判断：如果路由路径中有id，则请求展示文章内容
    if (this.$route.query.id) {
      this.loadArticle()
    }
  },
  mounted () {},
  methods: {
    onPublish (draft = false) {
      this.$refs['publish-form'].validate(valid => {
        // 验证失败，停止提交表单
        if (!valid) {
          return
        }
        // 验证通过，提交表单
        // 找到数据接口
        // 封装请求方法
        // 请求提交表单
        // 如果是修改文章，则执行修改操作，否则执行添加操作
        const articleId = this.$route.query.id
        if (articleId) {
          // 执行修改操作
          updateArticle(articleId, this.article, draft).then(res => {
            this.$message({
              message: `${draft ? '存入草稿' : '发布'}成功`,
              type: 'success'
            })
          })
        } else {
          addArticle(this.article, draft).then(res => {
          // 处理响应结果
          // console.log('res')
            this.$message({
              message: `${draft ? '存入草稿' : '发布'}成功`,
              type: 'success'
            })
            // 跳转到内容管理页面
            this.$router.push('/article')
          })
        }
      })
    },
    loadChannels () {
      getArticlesChannels().then(({ data }) => {
        this.channels = data.data.channels
      })
    },

    loadArticle () {
      // 找到数据接口
      // 封装请求方法
      // 请求获取数据

      getArticle(this.$route.query.id).then(res => {
      // 模板绑定展示
        this.article = res.data.data
      })
    }
  }
}
</script>
<style scoped lang='less'></style>
