<template>
  <div class="line-container">
    <!-- 标题 -->
    <div class="title">
      <p class="title-p">未来7天游客量趋势图</p>
      <p class="line-img"></p>
    </div>
    <!-- 折线图 -->
    <div ref="tradeLineRefs" class="charts-box"></div>
  </div>
</template>

<script setup lang="ts">
  /** API */
  import { ref, onMounted } from 'vue'
  /** eCharts */
  import * as ECharts from 'echarts'

  /*** 函数挂载 */
  onMounted(() => {
    let lineOption: ECharts.EChartsOption = {
      title: {
        text: '游客访问量趋势',
        textStyle: {
          color: 'white',
        },
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['周一', '周二', '周三', '周四', '周五', '周六', '周天'],
        splitLine: { show: false },
        axisLine: { show: true },
        axisTick: { show: true },
        axisLabel: { color: 'white' },
      },
      yAxis: {
        splitLine: { show: false },
        axisLine: { show: true },
        axisTick: { show: true },
        axisLabel: { color: 'white' },
      },
      grid: {
        left: 50,
        top: 10,
        bottom: 20,
        right: 50,
      },
      series: [
        {
          type: 'line',
          data: [0, 240, 100, 260, 230, 340, 310, 360],
          smooth: true,
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0.8,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'yellow' },
                { offset: 1, color: 'green' },
              ],
              global: false,
            },
          },
        },
      ],
    }
    // 挂载 e-charts
    ECharts.init(tradeLineRefs.value).setOption(lineOption)
  })

  // 折线图 refs
  const tradeLineRefs = ref<HTMLDivElement>()
</script>

<style scoped lang="scss">
  .line-container {
    margin: 0 0 10px 15px;
    width: 96%;
    height: 100%;
    background: url(../../../images/dataScreen-main-cb.png) no-repeat;
    background-size: 100% 100%;

    .title {
      .title-p {
        color: white;
        font-size: 20px;
        margin-left: 20px;
      }
      .line-img {
        width: 68px;
        height: 7px;
        background: url(../../../images/dataScreen-title.png) no-repeat;
        background-size: 100% 100%;
        margin-left: 20px;
        margin-top: 10px;
      }
    }

    .charts-box {
      height: calc(100% - 40px);
    }
  }
</style>
