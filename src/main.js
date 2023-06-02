import Vue from "vue";
import Cookies from "js-cookie";

import App from "./App.vue";

import setupVue from "@/plugins/setupVue";

//ELEMENT-UI组件库
import ElementUI from "element-ui";
import "./assets/style/element-variables.scss";

Vue.use(ElementUI, {
  size: Cookies.get("size") || "medium",
});

// 引入样式
import "./assets/style/index.scss";
// 引入路由
import router from "./router";
// 引入路由守卫
import "./router/interceptor";
// 引入vuex
import store from "./store";
// 引入 注入的方法/属性
import provide from "./plugins/provide";

// 引入注册模块
setupVue(Vue);

Vue.config.productionTip = false;

export default new Vue({
  render: (h) => h(App),
  router,
  store,
  provide,
}).$mount("#app");
