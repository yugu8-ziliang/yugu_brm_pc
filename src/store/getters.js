const getters = {
  sidebar: (state) => state.app.sidebar,
  size: (state) => state.app.size,
  device: (state) => state.app.device,
  visitedViews: (state) => state.tagsView.visitedViews,
  cachedViews: (state) => state.tagsView.cachedViews,
  token: (state) => state.user.token,
  userInfo: (state) => state.user.userInfo,
  roles: (state) => state.user.roles,
  permissions: (state) => state.user.permissions,
  permission_routes: (state) => state.permission.routes,
  sidebarRouters: (state) => state.permission.sidebarRouters,
  screenHeight: (state) => state.settings.screenHeight, // 动态获取浏览器高度
  editCommodityData: (state) => state.common.editCommodityData, //
  addNewrequestData: (state) => state.common.addNewrequestData, //
  addSalesCommodityData: (state) => state.common.addSalesCommodityData, //
  tableHeight: (state) => state.settings.screenHeight - 500 + "px",
};
export default getters;
