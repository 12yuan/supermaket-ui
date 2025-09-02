import axios from 'axios';

const state = {
  inventoryItems: [],
  inventoryItem: null,
  loading: false,
  error: null,
  pagination: {
    total: 0,
    current: 1,
    pageSize: 10,
  },
};

const mutations = {
  SET_INVENTORY_ITEMS(state, items) {
    state.inventoryItems = items;
  },
  SET_INVENTORY_ITEM(state, item) {
    state.inventoryItem = item;
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
  UPDATE_INVENTORY_ITEM(state, updatedItem) {
    const index = state.inventoryItems.findIndex((item) => item.id === updatedItem.id);
    if (index !== -1) {
      state.inventoryItems.splice(index, 1, updatedItem);
    }
  },
};

const actions = {
  // 获取库存列表
  async fetchInventory({ commit }, {
    page = 1, limit = 10, search = '', lowStock = false,
  } = {}) {
    commit('SET_LOADING', true);
    try {
      const response = await axios.get('/api/inventory', {
        params: {
          page,
          limit,
          search,
          lowStock,
        },
      });

      commit('SET_INVENTORY_ITEMS', response.data.items);
      commit('SET_PAGINATION', {
        total: response.data.total,
        current: page,
        pageSize: limit,
      });
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message || '获取库存列表失败');
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // 获取单个库存项详情
  async fetchInventoryItem({ commit }, itemId) {
    commit('SET_LOADING', true);
    try {
      const response = await axios.get(`/api/inventory/${itemId}`);
      commit('SET_INVENTORY_ITEM', response.data);
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message || '获取库存详情失败');
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // 更新库存数量
  async updateInventoryQuantity({ commit }, { id, quantity, reason }) {
    commit('SET_LOADING', true);
    try {
      const response = await axios.patch(`/api/inventory/${id}/quantity`, { quantity, reason });
      commit('UPDATE_INVENTORY_ITEM', response.data);
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message || '更新库存数量失败');
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // 库存盘点
  async performInventoryCheck({ commit }, { id, actualQuantity, notes }) {
    commit('SET_LOADING', true);
    try {
      const response = await axios.post(`/api/inventory/${id}/check`, { actualQuantity, notes });
      commit('UPDATE_INVENTORY_ITEM', response.data);
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message || '库存盘点失败');
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // 获取库存预警列表
  async fetchLowStockItems({ commit }) {
    commit('SET_LOADING', true);
    try {
      const response = await axios.get('/api/inventory/low-stock');
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message || '获取库存预警列表失败');
      commit('SET_LOADING', false);
      throw error;
    }
  },

  // 获取库存历史记录
  async fetchInventoryHistory({ commit }, itemId) {
    commit('SET_LOADING', true);
    try {
      const response = await axios.get(`/api/inventory/${itemId}/history`);
      commit('SET_LOADING', false);
      return response.data;
    } catch (error) {
      commit('SET_ERROR', error.message || '获取库存历史记录失败');
      commit('SET_LOADING', false);
      throw error;
    }
  },
};

const getters = {
  allInventoryItems: (state) => state.inventoryItems,
  inventoryItemById: (state) => (id) => state.inventoryItems.find((item) => item.id === id),
  currentInventoryItem: (state) => state.inventoryItem,
  isLoading: (state) => state.loading,
  error: (state) => state.error,
  pagination: (state) => state.pagination,
  lowStockItems: (state) => state.inventoryItems.filter((item) => item.quantity <= item.lowStockThreshold),
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
