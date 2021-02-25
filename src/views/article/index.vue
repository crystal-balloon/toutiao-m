<template>
  <div class='article-container'>
    <el-card class="filter-card">
      <div slot="header" class="clearfix">
        <!-- 面包屑路径导航 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
          <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>内容管理</el-breadcrumb-item>
        </el-breadcrumb>
      </div>

      <!--数据筛选表单 -->
      <el-form ref="form" :model="form" label-width="40px" size='mini'>

        <el-form-item label="状态">
          <el-radio-group v-model="status">
            <!-- el-radio 默认把 label 作为文本和选中之后的 value 值 -->
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
            <el-radio :label="4">已删除</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="频道">
          <el-select v-model="form.region" placeholder="请选择频道">
            <el-option
             label="全部"
             :value="null"
          ></el-option>
            <el-option
             :label="channel.name"
             :value="channel.id"
             v-for="(channel, index) in channels"
             :key="index"
          ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="日期">
          <el-date-picker
            v-model="rangeDate"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <!-- button 按钮的 click 事件有个默认参数，当没有指定参数的时候，会默认传递一个没用的数据 -->
          <el-button type="primary" @click="loadArticles(1)" :disabled='loading'>查询</el-button>
        </el-form-item>
      </el-form>

    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        根据筛选条件共查询到{{ totalCount }}条结果
      </div>
      <!-- 数据列表 -->

      <!--
        table 表格组件
        1. 把需要展示的数组列表数据绑定给 table 组件的 data 属性，你不用去 v-for 遍历，它自己会遍历
        2. 设计表格列 el-table-column
          width 可以设定表格列的宽度
          label 可以设定列的标题
          prop 用来设定要渲染的列表项数据字段，只能展示文本
       -->
      <el-table
        :data="articles"
        stripe
        style="width: 100%"
        class='list-table'
        size='mini'
        v-loading='loading'
      >
        <el-table-column
          prop="date"
          label="封面"
        >
          <template slot-scope="scope">
            <img :src="scope.row.cover.images[0]" alt="" class="article-cover">
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          label="标题"
        >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态">
          <!-- 如果需要在自定义模板中获取当前遍历项数据，那么在 template 上声明 slot-scope="scope" -->
          <template slot-scope="scope">
            <el-tag :type="articleStatus[scope.row.status].type">{{ articleStatus[scope.row.status].text }}</el-tag>
            <!-- 未优化的写法 -->
            <!-- <el-tag v-if="scope.row.status === 0" type="primary">草稿</el-tag>
            <el-tag v-if="scope.row.status === 1" type="info">待审核</el-tag>
            <el-tag v-if="scope.row.status === 2" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.status === 3" type="warning">审核失败</el-tag>
            <el-tag v-if="scope.row.status === 4" type="danger">已删除</el-tag> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="pubdate"
          label="发布时间"
        >
        </el-table-column>
        <el-table-column
          label="操作"
        >
        <!-- 如果需要自定义表格列模板，则把需要自定义的内容放到 template 中，加上slot-scope="scope" -->
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              icon="el-icon-edit"
              circle
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              circle
              @click='onDeleteArticle(scope.row.id)'
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 列表分页 -->
      <!-- total 用来设置总数据的条数，默认按照 10 条每页计算总页码
        page-size每页显示条目个数，支持 .sync 修饰符,默认每页 10 条 -->
      <el-pagination
        layout="prev, pager, next"
        :total="totalCount"
        @current-change="loadArticles"
        :page-size="pageSize"
        :disabled='loading'
        :current-page.sync="page"
      >
      </el-pagination>

    </el-card>

  </div>
</template>

<script>
import { getArticles, getArticlesChannels, deleteArticle } from '@/api/article'
import pic1 from '@/views/article/1.jpg'
import pic2 from '@/views/article/2.jpg'
const articles = [
  {
    cover: { images: [pic2, pic2], type: '1' },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 234,
    title: '第2季',
    status: 1,
    pubdate: '2020-1-3'
  },
  {
    cover: { images: [pic1, pic2], type: 3 },
    id: 231,
    title: '第3季',
    status: 3,
    pubdate: '2020-1-4'
  },
  {
    cover: { images: [pic1, pic2], type: 4 },
    id: 123,
    title: '第4季',
    status: 4,
    pubdate: '2020-1-5'
  },
  {
    cover: { images: [pic1, pic2], type: 0 },
    id: 123,
    title: '第1季',
    status: 0,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic2, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic2, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic2, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 1 },
    id: 123,
    title: '第1季',
    status: 1,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic1, pic2], type: 4 },
    id: 123,
    title: '第1季',
    status: 4,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic2, pic2], type: 4 },
    id: 123,
    title: '第1季',
    status: 4,
    pubdate: '2020-1-2'
  },
  {
    cover: { images: [pic2, pic2], type: 4 },
    id: 123,
    title: '第1季',
    status: 4,
    pubdate: '2020-1-2'
  }
]
export default {
  name: 'ArticleIndex',
  components: {},
  props: {},
  data () {
    return {
      form: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      tableData: [{
        date: '2016-05-02',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1518 弄'
      }, {
        date: '2016-05-04',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1517 弄'
      }, {
        date: '2016-05-01',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1519 弄'
      }, {
        date: '2016-05-03',
        name: '王小虎',
        address: '上海市普陀区金沙江路 1516 弄'
      }],
      // 文章数据列表
      articles: articles.slice(0, 10),
      // 文章状态列表（优化时会用到）
      articleStatus: [
        { status: 0, text: '草稿', type: 'primary' },
        { status: 1, text: '待审核', type: 'info' },
        { status: 2, text: '审核通过', type: 'success' },
        { status: 3, text: '审核失败', type: 'warning' },
        { status: 4, text: '已删除', type: 'danger' }
      ],
      // 总数据条数
      totalCount: 0,
      // 每页大小
      pageSize: 10,
      // 查询文章的状态，不传就是全部
      status: null,
      // 文章频道列表
      channels: [],
      // 查询文章的频道
      channelId: null,
      // 筛选的范围日期
      rangeDate: null,
      // 表格数据加载中
      loading: true

    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadChannels()
    this.loadArticles(1)
  },
  mounted () {},
  methods: {
    loadArticles (page = 1) {
      this.loading = true
      getArticles({
        page,
        per_page: this.pageSize,
        status: this.status,
        channel_id: this.channelId,
        // 开始日期
        begin_pubdate: this.rangeDate ? this.rangeDate[0] : null,
        // 截止日期
        end_pubdate: this.rangeDate ? this.rangeDate[1] : null
      }).then(res => {
        const { results, total_count: totalCount } = res.data.data
        this.articles = results
        this.totalCount = totalCount
        // 关闭加载中
        this.loading = false
      }).catch(() => {
        // 关闭加载中
        this.loading = false
        let filteredArticles = articles
        if (this.status !== null) {
          filteredArticles = articles.filter(i => i.status === this.status)
        }
        if (page) {
          this.articles = filteredArticles.slice(10 * (page - 1), 10 * page)
        }
        this.totalCount = filteredArticles.length
      })
    },

    onSubmit () {
      console.log('submit!')
    },

    onCurrentChange (page) {
      console.log(page)
      this.loadArticles(page)
    },

    loadChannels () {
      getArticlesChannels().then(res => {
        this.channels = res.data.data.channels
      })
    },
    // 找到数据接口
    // 封装请求方法
    // 删除请求调用
    // 处理响应结果
    onDeleteArticle (articleId) {
      this.$confirm('确认删除吗?', '删除提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 确认执行这里
        deleteArticle(articleId.toString()).then(res => {
          // 删除成功，更新当前页的文章数据列表
          this.loadArticles(this.page)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  }
}
</script>
<style scoped lang='less'>
  .filter-card {
    margin-bottom: 30px;
  }
  .list-table {
    margin-bottom: 20px;
  }
  .article-cover {
    width: 100px;
    background-size: cover;
  }
</style>
