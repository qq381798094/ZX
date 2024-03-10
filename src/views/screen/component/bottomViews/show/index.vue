<template>
  <div class="show-container">
    <div class="title">
      <p class="title-p">年度游客量对比</p>
      <p class="line-img"></p>
    </div>

    <div ref="scaleRefs" class="charts"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  import * as ECharts from 'echarts'

  onMounted(() => {
    let options: ECharts.EChartsOption = {
      // 标题
      title: {
        text: '散点图',
        left: '40%',
        textStyle: { color: 'white' },
      },
      // 坐标轴
      xAxis: { type: 'category' },
      yAxis: { show: false, splitLine: { show: false } },
      // 布局
      grid: { left: 30, right: 0, top: 20, bottom: 30 },
      // 系列
      series: {
        type: 'scatter',
        data: [10, 32, 63, 36, 85, 23, 132],
        symbol: 'pin',
        symbolSize: 15,
        label: { show: true, position: 'top', fontSize: 15, color: 'white', fontStyle: 'oblique' },
      },
    }
    ECharts.init(scaleRefs.value).setOption(options)
  })

  const scaleRefs = ref<HTMLDivElement>()
</script>

<style scoped lang="scss">
  .show-container {
    width: 100%;
    height: 100%;
    background: url(../../../images/dataScreen-main-lb.png) no-repeat;
    background-size: 100% 100%;
    margin: 25px 0;

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

    .charts {
      height: calc(100% - 30px);
    }
  }
</style>
