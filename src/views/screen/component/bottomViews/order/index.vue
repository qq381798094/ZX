<template>
  <div class="order-container">
    <div class="title">
      <p class="title-p">热门景区排行</p>
      <p class="line-img"></p>
    </div>
    <!-- 图表 -->
    <div ref="scenicRefs" class="e-charts-box"></div>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue'
  /** eCharts */
  import * as ECharts from 'echarts'

  onMounted(() => {
    let option: ECharts.EChartsOption = {
      //   标题组件
      title: {
        text: '景区排行',
        link: 'http://www.baidu.com',
        subtext: '各大景区排行',
        sublink: 'http://www.juejin.cn',
        left: '50%',
        textStyle: { color: 'white', fontSize: 20 },
        subtextStyle: { color: 'white', fontSize: 16 },
      },
      //   坐标轴
      xAxis: {
        type: 'category',
      },
      yAxis: {},
      //   布局
      grid: {
        left: 20,
        right: 20,
        bottom: 20,
        top: 80,
      },
      //   系列
      series: [
        {
          type: 'bar',
          data: [10, 20, 30, 40, 50, 60, 110],
          label: { show: true, position: 'insideTop' },
          showBackground: true,
          tooltip: { backgroundColor: 'rgba(50,50,50,0.7)', textStyle: { color: 'white' } },
          itemStyle: {
            borderRadius: [15, 15, 0, 0],
            color: function (data: any) {
              let colors = ['yellow', 'orange', 'hotpink', 'skyblue', 'red', 'green', 'purple']
              return colors[data.dataIndex]
            },
          },
          backgroundStyle: {
            borderRadius: [15, 15, 0, 0],
            color: {
              type: 'linear',
              x: 0,
              x2: 0,
              y: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: 'white' },
                { offset: 1, color: 'gray' },
              ],
              global: false,
            },
          },
        },
        {
          type: 'line',
          data: [20, 35, 40, 65, 80, 105, 156],
          smooth: true,
        },
      ],
    }
    ECharts.init(scenicRefs.value).setOption(option)
  })

  const scenicRefs = ref<HTMLDivElement>()
</script>

<style scoped lang="scss">
  .order-container {
    margin: 25px 0;
    width: 100%;
    height: 100%;
    background: url(../../../images/dataScreen-main-cb.png) no-repeat;
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

    .e-charts-box {
      height: calc(100% - 60px);
    }
  }
</style>
