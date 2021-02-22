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
          <el-radio-group v-model="form.resource">
            <el-radio label="全部"></el-radio>
            <el-radio label="草稿"></el-radio>
            <el-radio label="待审核"></el-radio>
            <el-radio label="审核通过"></el-radio>
            <el-radio label="审核失败"></el-radio>
            <el-radio label="已删除"></el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="频道">
          <el-select v-model="form.region" placeholder="请选择频道">
            <el-option label="区域一" value="shanghai"></el-option>
            <el-option label="区域二" value="beijing"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="日期">
          <el-date-picker
            v-model="form.data1"
            type="datetimerange"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['12:00:00']">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="onSubmit">筛选</el-button>
        </el-form-item>
      </el-form>

    </el-card>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        根据筛选条件共查询到300条结果
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
        size='mini'>
        <el-table-column
          prop="date"
          label="封面"
        >
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
            <el-tag v-if="scope.row.status === 0" type="primary">草稿</el-tag>
            <el-tag v-if="scope.row.status === 1" type="info">待审核</el-tag>
            <el-tag v-if="scope.row.status === 2" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.status === 3" type="warning">审核失败</el-tag>
            <el-tag v-if="scope.row.status === 4" type="danger">已删除</el-tag>
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
          <template>
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
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 列表分页 -->
      <el-pagination
      layout="prev, pager, next"
      :total="1000">
      </el-pagination>

    </el-card>

  </div>
</template>

<script>
import { getArticles } from '@/api/article'

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
      articles: [
        {
          id: 123,
          title: '第1季',
          status: 1,
          pubdate: '2020-1-2'
        },
        {
          id: 234,
          title: '第2季',
          status: 1,
          pubdate: '2020-1-3'
        },
        {
          id: 231,
          title: '第3季',
          status: 2,
          pubdate: '2020-1-4'
        },
        {
          id: 123,
          title: '第4季',
          status: 2,
          pubdate: '2020-1-5'
        }

      ]
    }
  },
  computed: {},
  watch: {},
  created () {
    this.loadArticles()
  },
  mounted () {},
  methods: {
    loadArticles () {
      getArticles().then(res => {
        this.articles = res.data.data.results
      })
    },

    onSubmit () {
      console.log('submit!')
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
</style>
