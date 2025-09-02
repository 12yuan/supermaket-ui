/**
 * 系统设置状态管理
 */

const state = {
  tagsView: true, // 是否显示标签导航栏
  fixedHeader: true, // 是否固定头部
  sidebarLogo: true, // 是否显示侧边栏Logo
  theme: '#409EFF', // 主题色
  showSettings: false, // 是否显示设置面板
};

const mutations = {
  CHANGE_SETTING: (state, { key, value }) => {
    // 确保key存在于state中
    if (Object.prototype.hasOwnProperty.call(state, key)) {
      state[key] = value;
    }
  },
};

const actions = {
  changeSetting({ commit }, data) {
    commit('CHANGE_SETTING', data);
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
};
