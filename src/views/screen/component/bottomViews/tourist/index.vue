<template>
  <div class="tourist-container">
    <!-- 顶部文字 -->
    <div class="top">
      <p class="title">实时游客统计</p>
      <p class="underline-bg"></p>
      <p class="info-right">
        可预约总量
        <span>{{ prePeople }}</span>
        人
      </p>
    </div>
    <!-- 总人数 -->
    <div class="total-people">
      <span v-for="(item, index) in totalPeople" :key="index">{{ item }}</span>
    </div>
    <!-- 图标数据 -->
    <div class="e-chart-data" ref="chartRef"></div>
  </div>
</template>

<script setup lang="ts">
  /** API */
  import { ref, onMounted } from 'vue'
  /** eCharts */
  import * as ECharts from 'echarts'
  import 'echarts-liquidfill'

  onMounted(() => {
    ECharts.init(chartRef.value).setOption({
      series: [
        {
          type: 'liquidFill',
          data: [0.6, 0.5, 0.4, 0.3],
          radius: '75%',
          animationDuration: 3,
          animationDurationUpdate: 0,
          outline: {
            show: true,
            borderDistance: 8,
            itemStyle: {
              color: 'none',
              borderColor: '#30539A',
              borderWidth: 4,
              shadowBlur: 10,
              shadowColor: 'rgba(0, 0, 0, 0.25)',
            },
          },
        },
      ],
    })
  })

  // e-charts 水球图容器
  const chartRef = ref<HTMLDivElement>()

  // 可预约人数
  const prePeople = ref<number>(99999)
  // 总人数
  const totalPeople = ref<string>('215903人')
</script>

<style scoped lang="scss">
  .tourist-container {
    background: url(../../../images/dataScreen-main-lb.png) no-repeat;
    background-size: 100% 100%;
    margin-top: 15px;

    .top {
      position: relative;
      .title {
        color: white;
        font-size: 20px;
        margin-left: 20px;
      }
      .underline-bg {
        width: 68px;
        height: 7px;
        background: url(../../../images/dataScreen-title.png) no-repeat;
        margin-left: 20px;
        margin-top: 10px;
      }
      .info-right {
        position: absolute;
        right: 10px;
        color: white;
        font-size: 15px;
        > span {
          color: orange;
        }
      }
    }

    .total-people {
      margin-top: 50px;
      display: flex;
      padding: 0 20px;

      > span {
        flex: 1;
        height: 60px;
        line-height: 60px;
        text-align: center;
        background: url(../../../images/total.png) no-repeat;
        background-size: 100% 100%;
        color: #29fcff;
        font-weight: bold;
        font-size: 24px;
      }
    }

    .e-chart-data {
      width: 100%;
      height: 200px;
    }
  }
</style>
