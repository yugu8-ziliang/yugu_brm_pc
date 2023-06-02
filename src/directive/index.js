import hasRole from "./hasRole";
import hasPermi from "./hasPermi";

// 引入
import Clickoutside from "element-ui/src/utils/clickoutside";

const install = function (Vue) {
  Vue.directive("hasRole", hasRole);
  Vue.directive("hasPermi", hasPermi);
  Vue.directive("Clickoutside", Clickoutside);
};

if (window.Vue) {
  window["hasRole"] = hasRole;
  window["hasPermi"] = hasPermi;
  Vue.use(install); // eslint-disable-line
}

export default install;
