<template>
  <div class="map-container" ref="mapRef"></div>
</template>

<script setup lang="ts">
  /** API */
  import { ref, onMounted } from 'vue'
  /** EChart */
  import * as ECharts from 'echarts'
  /** 引入所需数据 */
  import chinaJSON from './resource/china.json'

  // 地图注册
  ECharts.registerMap('china', chinaJSON as any)

  onMounted(() => {
    let mapOption: ECharts.EChartsOption = {
      geo: [
        {
          show: true,
          map: 'china',
          roam: true, // 鼠标缩放
          left: '20%',
          top: '25%',
          zoom: 1.4,
          label: {
            show: true,
            color: 'white',
            fontSize: 14,
          },
          itemStyle: {
            opacity: 0.8,
            color: {
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              type: 'linear',
              colorStops: [
                {
                  offset: 0,
                  color: '#11144E',
                },
                {
                  offset: 1,
                  color: '#3671E5',
                },
              ],
            },
          },
          // 高亮
          emphasis: {
            itemStyle: {
              color: 'red',
            },
            label: {
              fontSize: 18,
              color: 'white',
            },
          },
        },
      ],
      series: [
        {
          // 航线类型
          type: 'lines',
          effect: {
            show: true,
            symbol: 'diamond',
            symbolSize: 10,
            color: 'red',
          },
          data: [
            {
              coords: [
                [104.065735, 30.659462],
                [91.132212, 29.660361],
              ],
              lineStyle: {
                width: 2,
                color: '#fff',
                type: 'dashed',
                curveness: 0.2,
              },
            },
            {
              coords: [
                [104.065735, 30.659462],
                [102.712251, 25.040609],
              ],
              lineStyle: {
                width: 2,
                color: '#fff',
                type: 'dashed',
                curveness: 0.2,
              },
            },
            {
              coords: [
                [104.065735, 30.659462],
                [106.713478, 26.578343],
              ],
              lineStyle: {
                width: 2,
                color: '#fff',
                type: 'dashed',
                curveness: 0.2,
              },
            },
            {
              coords: [
                [104.065735, 30.659462],
                [106.504962, 29.533155],
              ],
              lineStyle: {
                width: 2,
                color: '#fff',
                type: 'dashed',
                curveness: 0.2,
              },
            },
            {
              coords: [
                [104.065735, 30.659462],
                [114.298572, 30.584355],
              ],
              lineStyle: {
                width: 2,
                color: '#fff',
                type: 'dashed',
                curveness: 0.2,
              },
            },
            {
              coords: [
                [104.065735, 30.659462],
                [108.948024, 34.263161],
              ],
              lineStyle: {
                width: 2,
                color: '#fff',
                type: 'dashed',
                curveness: 0.2,
              },
            },
          ],
        },
      ],
    }
    ECharts.init(mapRef.value).setOption(mapOption)
  })

  /** 地图 box 实例 */
  const mapRef = ref<HTMLDivElement>()
</script>

<style scoped lang="scss"></style>
