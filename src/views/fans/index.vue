<template>
  <div class='fans-container'>
    <!-- 1.为 ECharts 准备一个具备大小（宽高）的画布容器 DOM -->
    <div ref="main" style="width: 600px;height:400px;"></div>
  </div>
</template>

<script>
// 2.加载 echarts

import * as echarts from 'echarts'

export default {
  name: 'FansIndex',
  components: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  watch: {},
  created () {},
  // 注意：初始化操作 DOM 一定要写到 mounted 钩子函数中
  mounted () {
    // 3.基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(this.$refs.main)

    // 指定图表的配置项和数据
    var option = {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data: ['销量']
      },
      xAxis: {
        data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'bar',
        data: [5, 20, 36, 10, 10, 20]
      }]
    }

    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  },
  methods: {}
}
</script>
<style scoped lang='less'></style>
