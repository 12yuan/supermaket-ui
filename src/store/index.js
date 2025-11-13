import { createStore } from 'vuex';
import VuexPersistence from 'vuex-persist';
import auth from './modules/auth';
import product from './modules/product';
import inventory from './modules/inventory';
import user from './modules/user';
import tagsView from './modules/tagsView';
import settings from './modules/settings';
import permission from './modules/permission';

// 配置Vuex持久化
const vuexLocal = new VuexPersistence({
  storage: window.localStorage,
  key: 'supermarket-ui',
  reducer: (state) => ({
    // 只持久化auth模块，避免存储大量数据
    auth: state.auth,
  }),
});

const store = createStore({
  state: {
    loading: false,
    error: null,
  },
  mutations: {
    SET_LOADING(state, loading) {
      state.loading = loading;
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    CLEAR_ERROR(state) {
      state.error = null;
    },
  },
  actions: {
    setLoading({ commit }, loading) {
      commit('SET_LOADING', loading);
    },
    setError({ commit }, error) {
      commit('SET_ERROR', error);
    },
    clearError({ commit }) {
      commit('CLEAR_ERROR');
    },
  },
  modules: {
    auth,
    product,
    inventory,
    user,
    tagsView,
    settings,
    permission,
  },
  plugins: [vuexLocal.plugin],
});

export default store;
