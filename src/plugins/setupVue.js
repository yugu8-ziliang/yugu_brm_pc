// import { UTable, UTableColumn } from "umy-ui";

import router from "@/router";
import * as filters from "@/filters";
import SvgIcon from "@/components/SvgIcon";
import globalMethodsPlugin from "@/utils/global";
import globalDirectivePlugin from "@/directive";

// //表格组件
import UmyUi from "umy-ui";
import "umy-ui/lib/theme-chalk/index.css"; // 引入样式

export default function setup(Vue) {
  // 1.注册全局组件
  const componentsContext = require.context(
    "@/components/global",
    true,
    /.vue$/
  );

  componentsContext.keys().forEach((component) => {
    const componentConfig = componentsContext(component).default;
    Vue.component(componentConfig.name, componentConfig);
  });

  // 2.注册全局自定义指令
  Vue.use(globalDirectivePlugin);

  // 3.注册全局svgicon
  Vue.component("svg-icon", SvgIcon);

  const req = require.context("@/icons/svg", false, /\.svg$/);
  const requireAll = (requireContext) =>
    requireContext.keys().map(requireContext);
  requireAll(req);

  // 4.注册全局过滤器
  Object.keys(filters).forEach((key) => {
    Vue.filter(key, filters[key]);
  });

  // 5.注册全局方法
  Vue.use(globalMethodsPlugin);

  // 6.注册 umy-ui 表格组件
  // Vue.component(UTable.name, UTable);
  // Vue.component(UTableColumn.name, UTableColumn);

  Vue.use(UmyUi);
}
