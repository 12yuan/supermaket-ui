import axios from 'axios';

const state = {
  products: [],
  product: null,
  categories: [],
  loading: false,
  error: null,
  pagination: {
    total: 0,
    current: 1,
    pageSize: 10,
  },
};

const mutations = {
  SET_PRODUCTS(state, products) {
    state.products = products;
  },
  SET_PRODUCT(state, product) {
    state.product = product;
  },
  SET_CATEGORIES(state, categories) {
    state.categories = categories;
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
  ADD_PRODUCT(state, product) {
    state.products.unshift(product);
  },
  UPDATE_PRODUCT(state, updatedProduct) {
    const index = state.products.findIndex((p) => p.id === updatedProduct.id);
    if (index !== -1) {
      state.products.splice(index, 1, updatedProduct);
    }
  },
  REMOVE_PRODUCT(state, productId) {
    state.products = state.products.filter((p) => p.id !== productId);
  },
};

const actions = {
  // 获取商品列表
  async fetchProducts({ commit, state }, {
    page = 1, limit = 10, search = '', category = '',
  } = {}) {
    commit('SET_LOADING', true);
    try {
      const response = await axios.get('/api/products', {
        params: {
          page,
          limit,
          search,
          category,
        },
      });

      commit('SET_PRODUCTS', response.data.items);
      commit('SET_PAGINATION', {
        total: response.data.total,
        current: page,
        pageSize: limit,
      });
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message || '获取商品列表失败');
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // 获取单个商品详情
  async fetchProduct({ commit }, productId) {
    commit('SET_LOADING', true);
    try {
      const response = await axios.get(`/api/products/${productId}`);
      commit('SET_PRODUCT', response.data);
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message || '获取商品详情失败');
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // 获取商品分类
  async fetchCategories({ commit }) {
    commit('SET_LOADING', true);
    try {
      const response = await axios.get('/api/categories');
      commit('SET_CATEGORIES', response.data);
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message || '获取商品分类失败');
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // 创建商品
  async createProduct({ commit }, productData) {
    commit('SET_LOADING', true);
    try {
      const response = await axios.post('/api/products', productData);
      commit('ADD_PRODUCT', response.data);
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message || '创建商品失败');
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // 更新商品
  async updateProduct({ commit }, { id, data }) {
    commit('SET_LOADING', true);
    try {
      const response = await axios.put(`/api/products/${id}`, data);
      commit('UPDATE_PRODUCT', response.data);
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message || '更新商品失败');
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // 删除商品
  async deleteProduct({ commit }, productId) {
    commit('SET_LOADING', true);
    try {
      await axios.delete(`/api/products/${productId}`);
      commit('REMOVE_PRODUCT', productId);
      commit('SET_LOADING', false);
      return true;
    } catch (error) {
      commit('SET_ERROR', error.message || '删除商品失败');
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // 更新商品状态（上架/下架）
  async updateProductStatus({ commit }, { id, status }) {
    commit('SET_LOADING', true);
    try {
      const response = await axios.patch(`/api/products/${id}/status`, { status });
      commit('UPDATE_PRODUCT', response.data);
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message || '更新商品状态失败');
      commit('SET_LOADING', false);
      throw error;
    }
  },
};

const getters = {
  allProducts: (state) => state.products,
  productById: (state) => (id) => state.products.find((p) => p.id === id),
  currentProduct: (state) => state.product,
  productCategories: (state) => state.categories,
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
