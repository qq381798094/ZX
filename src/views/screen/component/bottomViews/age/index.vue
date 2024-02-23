<template>
  <div class="age-container">
    <!-- 标题 -->
    <div class="title">
      <p class="title-p">年龄比例</p>
      <p class="line-img"></p>
    </div>
    <!-- 饼图容器 -->
    <div class="chart-box" ref="pieChartsRef"></div>
  </div>
</template>

<script setup lang="ts">
  /** API */
  import { ref, onMounted } from 'vue'
  /** eCharts */
  import * as ECharts from 'echarts'

  onMounted(() => {
    let pieOption: ECharts.EChartsOption = {
      tooltip: {
        trigger: 'item',
      },
      legend: {
        top: '20%',
        right: 100,
        orient: 'vertical',
        textStyle: { color: 'white', fontSize: 15, lineHeight: 25 },
      },
      series: [
        {
          name: '年龄比例',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          right: 150,
          itemStyle: {
            borderRadius: 10,
            borderColor: 'gray',
            borderWidth: 1,
          },
          label: {
            show: true,
            position: 'inside',
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 16,
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            { value: 1048, name: '军事' },
            { value: 735, name: '新闻' },
            { value: 580, name: '直播' },
            { value: 484, name: '娱乐' },
            { value: 300, name: '财经' },
          ],
        },
      ],
    }
    ECharts.init(pieChartsRef.value).setOption(pieOption)
  })

  const pieChartsRef = ref<HTMLDivElement>()
</script>

<style scoped lang="scss">
  .age-container {
    margin: 25px 0;
    width: 100%;
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

    .chart-box {
      width: 100%;
      height: 300px;
    }
  }
</style>
