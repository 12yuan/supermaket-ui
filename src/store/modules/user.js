import {
  getUserList, getUserDetail, createUser, updateUser, deleteUser, updateUserStatus, updateUserRoles,
} from '@/api/user';

const state = {
  users: [],
  user: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    current: 1,
    pageSize: 10,
  },
};

const mutations = {
  SET_USERS(state, users) {
    state.users = users;
  },
  SET_USER(state, user) {
    state.user = user;
  },
  SET_LOADING(state, loading) {
    state.loading = loading;
  },
  SET_ERROR(state, error) {
    state.error = error;
  },
  SET_PAGINATION(state, pagination) {
    state.pagination = { ...state.pagination, ...pagination };
  },
  ADD_USER(state, user) {
    state.users.unshift(user);
  },
  UPDATE_USER(state, updatedUser) {
    const index = state.users.findIndex((u) => u.id === updatedUser.id);
    if (index !== -1) {
      state.users.splice(index, 1, updatedUser);
    }
  },
  REMOVE_USER(state, userId) {
    state.users = state.users.filter((u) => u.id !== userId);
  },
};

const actions = {
  // 获取用户列表
  async fetchUsers({ commit }, { page = 1, limit = 10, keyword = '' } = {}) {
    commit('SET_LOADING', true);
    try {
      const params = {
        page,
        limit,
        keyword,
      };
      const response = await getUserList(params);

      commit('SET_USERS', response.data);
      commit('SET_PAGINATION', {
        total: response.total,
        current: page,
        pageSize: limit,
      });
      commit('SET_LOADING', false);
      return {
        data: response.data,
        total: response.total,
      };
    } catch (error) {
      commit('SET_ERROR', error.message || '获取用户列表失败');
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // 获取单个用户详情
  async fetchUser({ commit }, userId) {
    commit('SET_LOADING', true);
    try {
      const response = await getUserDetail(userId);
      commit('SET_USER', response.data);
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message || '获取用户详情失败');
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // 创建用户
  async createUser({ commit }, userData) {
    commit('SET_LOADING', true);
    try {
      const response = await createUser(userData);
      commit('ADD_USER', response.data);
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message || '创建用户失败');
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // 更新用户
  async updateUser({ commit }, userData) {
    commit('SET_LOADING', true);
    try {
      const { id, ...data } = userData;
      const response = await updateUser(id, data);
      commit('UPDATE_USER', response.data);
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message || '更新用户失败');
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // 删除用户
  async deleteUser({ commit }, userId) {
    commit('SET_LOADING', true);
    try {
      await deleteUser(userId);
      commit('REMOVE_USER', userId);
      commit('SET_LOADING', false);
      return true;
    } catch (error) {
      commit('SET_ERROR', error.message || '删除用户失败');
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // 更新用户状态
  async updateUserStatus({ commit }, { id, status }) {
    commit('SET_LOADING', true);
    try {
      const response = await updateUserStatus(id, { status });
      commit('UPDATE_USER', response.data);
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message || '更新用户状态失败');
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // 更新用户角色
  async updateUserRoles({ commit }, { id, roleIds }) {
    commit('SET_LOADING', true);
    try {
      const response = await updateUserRoles(id, { roleIds });
      commit('UPDATE_USER', response.data);
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message || '更新用户角色失败');
      commit('SET_LOADING', false);
      throw error;
    }
  },
};

const getters = {
  allUsers: (state) => state.users,
  userById: (state) => (id) => state.users.find((u) => u.id === id),
  currentUser: (state) => state.user,
  isLoading: (state) => state.loading,
  error: (state) => state.error,
  pagination: (state) => state.pagination,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
