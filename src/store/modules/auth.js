import axios from 'axios';
import jwtDecode from 'jwt-decode';

const state = {
  token: null,
  user: null,
  isAuthenticated: false,
  refreshTokenTimeout: null,
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_USER(state, user) {
    state.user = user;
  },
  SET_AUTH_STATUS(state, status) {
    state.isAuthenticated = status;
  },
  SET_REFRESH_TIMEOUT(state, timeout) {
    // 清除之前的定时器
    if (state.refreshTokenTimeout) {
      clearTimeout(state.refreshTokenTimeout);
    }
    state.refreshTokenTimeout = timeout;
  },
  CLEAR_AUTH(state) {
    state.token = null;
    state.user = null;
    state.isAuthenticated = false;
    if (state.refreshTokenTimeout) {
      clearTimeout(state.refreshTokenTimeout);
      state.refreshTokenTimeout = null;
    }
  },
};

const actions = {
  // 登录
  async login({ commit, dispatch }, credentials) {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      const { token, refreshToken } = response.data;

      // 保存token
      commit('SET_TOKEN', token);

      // 解析token获取用户信息
      const decodedToken = jwtDecode(token);
      commit('SET_USER', {
        id: decodedToken.sub,
        name: decodedToken.name,
        email: decodedToken.email,
        role: decodedToken.role,
      });

      commit('SET_AUTH_STATUS', true);

      // 设置axios默认请求头
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      // 设置token刷新定时器
      dispatch('setTokenRefreshTimeout', token);

      return response.data;
    } catch (error) {
      commit('SET_AUTH_STATUS', false);
      throw error;
    }
  },

  // 注册
  async register({ commit }, userData) {
    try {
      const response = await axios.post('/api/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // 登出
  logout({ commit }) {
    // 清除认证状态
    commit('CLEAR_AUTH');

    // 清除axios默认请求头
    delete axios.defaults.headers.common.Authorization;

    // 重定向到登录页
    if (router) router.push('/login');
  },

  // 刷新token
  async refreshToken({ commit, dispatch }) {
    try {
      const response = await axios.post('/api/auth/refresh-token');
      const { token } = response.data;

      // 保存新token
      commit('SET_TOKEN', token);

      // 更新axios默认请求头
      axios.defaults.headers.common.Authorization = `Bearer ${token}`;

      // 设置新的token刷新定时器
      dispatch('setTokenRefreshTimeout', token);

      return token;
    } catch (error) {
      // 如果刷新token失败，登出用户
      dispatch('logout');
      throw error;
    }
  },

  // 设置token刷新定时器
  setTokenRefreshTimeout({ commit, dispatch }, token) {
    // 解析token获取过期时间
    const decodedToken = jwtDecode(token);
    const expiresAt = decodedToken.exp * 1000; // 转换为毫秒
    const now = Date.now();

    // 计算过期前的时间（提前5分钟刷新）
    const timeoutDuration = expiresAt - now - (5 * 60 * 1000);

    // 设置定时器
    const timeout = setTimeout(() => {
      dispatch('refreshToken');
    }, timeoutDuration);

    commit('SET_REFRESH_TIMEOUT', timeout);
  },

  // 初始化认证状态
  initAuth({ commit, dispatch, state }) {
    const { token } = state;

    if (token) {
      try {
        // 解析token
        const decodedToken = jwtDecode(token);
        const expiresAt = decodedToken.exp * 1000;
        const now = Date.now();

        // 检查token是否已过期
        if (expiresAt <= now) {
          // token已过期，尝试刷新
          dispatch('refreshToken').catch(() => {
            // 刷新失败，清除认证状态
            dispatch('logout');
          });
        } else {
          // token有效，设置用户信息
          commit('SET_USER', {
            id: decodedToken.sub,
            name: decodedToken.name,
            email: decodedToken.email,
            role: decodedToken.role,
          });

          commit('SET_AUTH_STATUS', true);

          // 设置axios默认请求头
          axios.defaults.headers.common.Authorization = `Bearer ${token}`;

          // 设置token刷新定时器
          dispatch('setTokenRefreshTimeout', token);
        }
      } catch (error) {
        // token解析失败，清除认证状态
        dispatch('logout');
      }
    }
  },
};

const getters = {
  isAuthenticated: (state) => state.isAuthenticated,
  currentUser: (state) => state.user,
  userRole: (state) => (state.user ? state.user.role : null),
  isAdmin: (state) => (state.user && state.user.role === 'admin'),
  token: (state) => state.token,
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
