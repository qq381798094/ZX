<template>
  <div class="container">
    <!-- 内容展示区域 -->
    <div class="screen" ref="screenRef">
      <!-- 顶部 -->
      <div class="top">
        <Top />
      </div>
      <!-- 底部 -->
      <div class="bottom">
        <div class="left">
          <Tourist class="component-tourist" />
          <Sex class="component-sex" />
          <Age class="component-age" />
        </div>
        <div class="center">
          <Map class="component-map" />
          <Line class="component-line" />
        </div>
        <div class="right">
          <Order class="component-order" />
          <Show class="component-show" />
          <Statistic class="component-statistic" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  /** API 引入 */
  import { ref, onMounted } from 'vue'
  /** 组件引入 */
  import Top from './component/topView/index.vue'
  // 左侧
  import Tourist from './component/bottomViews/tourist/index.vue'
  import Sex from './component/bottomViews/sex/index.vue'
  import Age from './component/bottomViews/age/index.vue'
  // 中间
  import Map from './component/centerViews/map/index.vue'
  import Line from './component/centerViews/line/index.vue'
  // 右侧
  import Order from './component/bottomViews/order/index.vue'
  import Show from './component/bottomViews/show/index.vue'
  import Statistic from './component/bottomViews/statistic/index.vue'

  onMounted(() => {
    changeScale()
  })

  // 获取 screen 内容盒子的 DOM 元素
  const screenRef = ref<HTMLDivElement>()
  // 监听浏览器视口变化
  window.onresize = () => {
    changeScale()
  }

  // 获取大屏的缩放比例
  function getScale(w = 1920, h = 1080) {
    let ww = window.innerWidth / w
    let hh = window.innerHeight / h
    return ww < hh ? ww : hh
  }
  // 根据视口调整内容盒子大小
  function changeScale() {
    return (screenRef.value!.style.transform = `scale(${getScale()}) translate(-50%, -50%)`)
  }
</script>

<style scoped lang="scss">
  .container {
    width: 100vw;
    height: 100vh;
    background: url(./images/bg.png) no-repeat;
    background-size: cover;

    .screen {
      width: 1920px;
      height: 1080px;
      position: fixed;
      left: 50%;
      top: 50%;
      transform-origin: left top;

      .top {
        width: 100%;
        height: 40px;
      }

      .bottom {
        display: flex;

        .left {
          flex: 1;
          height: 1040px;
          display: flex;
          flex-direction: column;

          .component-tourist {
            flex: 1.2;
          }

          .component-sex {
            flex: 1;
          }

          .component-age {
            flex: 1;
          }
        }

        .center {
          flex: 2;
          display: flex;
          flex-direction: column;

          .component-map {
            flex: 4;
          }

          .component-line {
            flex: 1;
          }
        }

        .right {
          flex: 1;
          display: flex;
          flex-direction: column;

          .component-order {
            flex: 1.5;
          }
          .component-show {
            flex: 1;
          }
          .component-statistic {
            flex: 1;
          }
        }
      }
    }
  }
</style>
