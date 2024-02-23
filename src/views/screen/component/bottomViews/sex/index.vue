<template>
  <div class="sex-container">
    <!-- 标题 -->
    <div class="title">
      <p class="title-p">男女比例</p>
      <p class="line-img"></p>
    </div>
    <!-- 内容 -->
    <div class="content">
      <div class="gender male">
        <img src="../../../images/man.png" alt="" />
      </div>
      <div class="gender female">
        <img src="../../../images/woman.png" alt="" />
      </div>
    </div>
    <!-- 比例 -->
    <div class="rate">
      <p>男士 58%</p>
      <p>女士 42%</p>
    </div>
    <!-- 图形图标 -->
    <div class="charts" ref="chartRef"></div>
  </div>
</template>

<script setup lang="ts">
  /** API */
  import { ref, onMounted } from 'vue'
  /** eCharts */
  import * as ECharts from 'echarts'

  onMounted(() => {
    // 将 charts -> 盒子实例化为 e-charts 组件
    let option: ECharts.EChartsOption = {
      xAxis: { show: false },
      yAxis: { type: 'category', show: false },
      grid: {
        left: 80,
        right: 80,
        top: 0,
        bottom: 50,
      },
      series: [
        {
          type: 'bar',
          data: [58],
          barWidth: 22,
          z: 100,
          itemStyle: { color: 'blue', borderRadius: 20 },
        },
        {
          type: 'bar',
          data: [100],
          barWidth: 22,
          barGap: '-100%',
          itemStyle: { color: 'red', borderRadius: 20 },
        },
      ],
    }
    ECharts.init(chartRef.value).setOption(option)
  })

  // e-charts 实例
  const chartRef = ref<HTMLDivElement>()
</script>

<style scoped lang="scss">
  .sex-container {
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

    .content {
      display: flex;
      justify-content: center;

      .gender {
        margin: 20px;
        width: 111px;
        height: 115px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-size: 100% 100%;
      }
      .male {
        background: url(../../../images/man-bg.png) no-repeat;
      }
      .female {
        background: url(../../../images/woman-bg.png) no-repeat;
      }
    }
    .rate {
      width: 300px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      color: #fff;
    }
    .charts {
      height: 60px;
      margin-top: 10px;
    }
  }
</style>
