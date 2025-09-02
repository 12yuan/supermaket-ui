import { asyncRoutes, constantRoutes } from '@/router';
import { filterAccessibleRoutes } from '@/utils/permission';

const state = {
  routes: [],
  addRoutes: []
};

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes;
    state.routes = constantRoutes.concat(routes);
  }
};

const actions = {
  generateRoutes({ commit }, roles) {
    return new Promise(resolve => {
      let accessedRoutes;
      if (roles.includes('admin')) {
        // 管理员可以访问所有路由
        accessedRoutes = asyncRoutes || [];
      } else {
        // 根据角色过滤路由
        accessedRoutes = filterAccessibleRoutes(asyncRoutes, roles);
      }
      commit('SET_ROUTES', accessedRoutes);
      resolve(accessedRoutes);
    });
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};