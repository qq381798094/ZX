<template>
  <div>
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" v-if="flag" />
      </transition>
    </router-view>
  </div>
</template>

<script setup lang="ts">
  /** API 引入 */
  import { watch, ref, nextTick } from 'vue'
  /** 引入仓库 */
  import useLayoutStore from '@/store/modules/layout'

  /** 实例化仓库 */
  let layoutStore = useLayoutStore()

  // 监听仓库的 refresh 数据，从而达成每一次 refresh 改变都会刷新当前 router-view 的页面
  const flag = ref(true)
  watch(
    () => layoutStore.refresh,
    async () => {
      // 1. 销毁组件
      flag.value = false
      // 2. 重新安装组件
      await nextTick()
      // 3. 生成组件
      flag.value = true
    },
  )
</script>
<script lang="ts">
  export default {
    name: 'MainView',
  }
</script>

<style scoped lang="scss">
  .fade-enter-from {
    opacity: 0;
    transform: scale(0);
  }

  .fade-enter-to {
    opacity: 1;
    transform: scale(1);
  }

  .fade-enter-active {
    transition: all 0.3s;
  }
</style>
