const state = {
  screenHeight: 0, // 动态获取浏览器高度
};

const mutations = {
  // 动态获取浏览器高度
  screenHeight_SETTING: (state, screenHeight) => {
    state.screenHeight = screenHeight;
  },
};

const actions = {
  // 动态获取浏览器高度
  screenHeightSetting({
    commit
  }, data) {
    commit("screenHeight_SETTING", data)
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};

