import useUserStore from '@/store/modules/user'

const userStore = useUserStore()

export const isHasButton = (app: any) => {
  app.directive('has', {
    mounted(el: any, binding: any) {
      if (!userStore.buttons.includes(binding.value)) {
        // 移除当前结点
        el.parentNode.removeChild(el)
      }
    },
  })
}
