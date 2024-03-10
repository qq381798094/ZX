<template>
  <div class="statistic-container">
    <div class="title">
      <p class="title-p">预约渠道数据统计</p>
      <p class="line-img"></p>
    </div>
    <div ref="pieChartRefs" class="pie-chart"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import * as ECharts from 'echarts'

  const pieChartRefs = ref<HTMLDivElement>()

  const dataList = [
    { value: 40, name: '智慧文案平台' },
    { value: 10, name: '携程' },
    { value: 20, name: '飞猪' },
    { value: 30, name: '其他渠道' },
  ]

  onMounted(() => {
    let options: ECharts.EChartsOption = {
      // 图例
      legend: {
        orient: 'vertical',
        textStyle: { color: 'white', lineHeight: 25 },
        formatter(name) {
          let res = dataList.find((item) => item.name === name)
          return `${name} --- ${res?.value}$`
        },
        left: 20,
        top: 30,
      },
      // 系列
      series: {
        type: 'pie',
        radius: ['65%', '80%'],
        padAngle: 5,
        label: { show: false },
        left: 180,
        data: dataList,
        itemStyle: {
          color(params) {
            let colors = ['#0478E8', 'orange', '#EE84DC', '#FF5D6E']
            return colors[params.dataIndex]
          },
        },
      },
    }
    ECharts.init(pieChartRefs.value).setOption(options)
  })
</script>

<style scoped lang="scss">
  .statistic-container {
    width: 100%;
    height: 100%;
    margin: 25px 0;
    background: url(../../../images/dataScreen-main-lb.png) no-repeat;
    background-size: 100% 100%;

    .title {
      .title-p {
        color: white;
        font-size: 20px;
      }

      .line-img {
        width: 68px;
        height: 7px;
        background: url(../../../images/dataScreen-title.png) no-repeat;
        background-size: 100% 100%;
        margin-top: 10px;
      }
    }

    .pie-chart {
      height: calc(100% - 40px);
    }
  }
</style>
