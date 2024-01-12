/** 统一注册全局组件的地方 */
import SvgIcon from '@/components/icons/SvgIcon.vue';

// 存放全部组件
const allGlobalComponent = { SvgIcon };

export default {
  install(app) {
    Object.keys(allGlobalComponent).forEach((key) => {
      app.component(key, allGlobalComponent[key]);
    });
  },
};
