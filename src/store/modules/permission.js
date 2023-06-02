import { constantRoutes } from "@/router";

import Layout from "@/layout";
import ParentView from "@/components/ParentView";
import { handleTree } from "@/utils/common";

// import {
//     getRouters
// } from '@/request/api/menu'

const state = {
  routes: [],
  addRoutes: [],
  sidebarRouters: [],
};
const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  },
  SET_SIDEBAR_ROUTERS: (state, routers) => {
    state.sidebarRouters = constantRoutes.concat(routers);
  },
  EMPTY: (state) => {
    state.routes = [];
    state.addRoutes = [];
    state.sidebarRouters = [];
  },
};
const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise((resolve) => {
      // getRouters().then(res => {
      //     const data = handleTree(res.data, "id");
      //     const sdata = JSON.parse(JSON.stringify(data));
      //     const rdata = JSON.parse(JSON.stringify(data));
      //     const sidebarRoutes = filterAsyncRouter(sdata);
      //     const rewriteRoutes = filterAsyncRouter(rdata, false, true);
      //     rewriteRoutes.push({
      //         path: "*",
      //         redirect: "/404",
      //         hidden: true
      //     });
      //     commit("SET_ROUTES", rewriteRoutes);
      //     commit("SET_SIDEBAR_ROUTERS", sidebarRoutes);
      //     resolve(rewriteRoutes);
      // })
      commit("SET_ROUTES", []);
      commit("SET_SIDEBAR_ROUTERS", []);
      resolve([]);
    });
  },
  clearRouter({ commit }) {
    commit("EMPTY");
  },
};

// 遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap, lastRouter = false, type = false) {
  return asyncRouterMap.filter((route) => {
    if (type && route.children) {
      route.children = filterChildren(route.children);
    }
    if (route.component) {
      // Layout ParentView 组件特殊处理
      if (route.component === "Layout") {
        route.component = Layout;
      } else if (route.component === "ParentView") {
        route.component = ParentView;
      } else if (
        typeof route.component === "string" &&
        route.component === "Layout/index" &&
        !route.children
      ) {
        // 首页定制
        route.meta.affix = true;
        route.children = [
          {
            path: "index",
            component: "index",
            name: route.name,
            meta: route.meta,
          },
        ];
        route.path = "";
        route.name = "";
        route.redirect = "/index";
        route.alwaysShow = false;
        route.component = Layout;
      } else {
        route.component = loadView(route.component);
      }
    }
    if (route.children !== null && route.children && route.children.length) {
      route.children = filterAsyncRouter(route.children, route, type);
      if (route.children.length === 1 && route.children[0].path === "index") {
        route.alwaysShow = false;
      } else {
        route.alwaysShow = true;
      }
    } else {
      delete route["children"];
      delete route["redirect"];
    }
    return true;
  });
}

function filterChildren(childrenMap, lastRouter = false) {
  var children = [];
  childrenMap.forEach((el, index) => {
    if (el.children && el.children.length) {
      if (el.component === "ParentView") {
        el.children.forEach((c) => {
          c.path = el.path + "/" + c.path;
          if (c.children && c.children.length) {
            children = children.concat(filterChildren(c.children, c));
            return;
          }
          children.push(c);
        });
        return;
      }
    }
    if (lastRouter) {
      el.path = lastRouter.path + "/" + el.path;
    }
    children = children.concat(el);
  });
  return children;
}

export const loadView = (view) => {
  // 路由懒加载
  return (resolve) => require([`@/views/${view}`], resolve);
};
export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
