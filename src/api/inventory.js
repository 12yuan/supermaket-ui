import request from '@/utils/request';

/**
 * 获取库存列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getInventoryList(params) {
  return request({
    url: '/inventory',
    method: 'get',
    params,
  });
}

/**
 * 获取库存详情
 * @param {number|string} id - 库存ID
 * @returns {Promise}
 */
export function getInventoryDetail(id) {
  return request({
    url: `/inventory/${id}`,
    method: 'get',
  });
}

/**
 * 更新库存数量
 * @param {number|string} id - 库存ID
 * @param {Object} data - 库存数据
 * @param {number} data.quantity - 库存数量
 * @param {string} data.remark - 备注
 * @returns {Promise}
 */
export function updateInventoryQuantity(id, data) {
  return request({
    url: `/inventory/${id}/quantity`,
    method: 'patch',
    data,
  });
}

/**
 * 批量更新库存
 * @param {Array} data - 批量更新数据
 * @returns {Promise}
 */
export function batchUpdateInventory(data) {
  return request({
    url: '/inventory/batch-update',
    method: 'post',
    data,
  });
}

/**
 * 获取库存变更历史
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getInventoryHistory(params) {
  return request({
    url: '/inventory/history',
    method: 'get',
    params,
  });
}

/**
 * 获取指定商品的库存变更历史
 * @param {number|string} productId - 商品ID
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getProductInventoryHistory(productId, params) {
  return request({
    url: `/inventory/history/product/${productId}`,
    method: 'get',
    params,
  });
}

/**
 * 获取低库存商品列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getLowStockProducts(params) {
  return request({
    url: '/inventory/low-stock',
    method: 'get',
    params,
  });
}

/**
 * 导入库存数据
 * @param {FormData} data - 包含Excel文件的FormData
 * @returns {Promise}
 */
export function importInventory(data) {
  return request({
    url: '/inventory/import',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * 导出库存数据
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function exportInventory(params) {
  return request({
    url: '/inventory/export',
    method: 'get',
    params,
    responseType: 'blob',
  });
}

/**
 * 库存盘点
 * @param {Object} data - 盘点数据
 * @returns {Promise}
 */
export function checkInventory(data) {
  return request({
    url: '/inventory/check',
    method: 'post',
    data,
  });
}

/**
 * 获取库存盘点记录
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getInventoryCheckRecords(params) {
  return request({
    url: '/inventory/check-records',
    method: 'get',
    params,
  });
}

/**
 * 获取库存盘点详情
 * @param {number|string} id - 盘点记录ID
 * @returns {Promise}
 */
export function getInventoryCheckDetail(id) {
  return request({
    url: `/inventory/check-records/${id}`,
    method: 'get',
  });
}

/**
 * 获取库存盘点详情列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getInventoryCheckDetails(params) {
  return request({
    url: '/inventory/check-details',
    method: 'get',
    params,
  });
}

/**
 * 更新库存盘点详情
 * @param {Object} data - 盘点详情数据
 * @returns {Promise}
 */
export function updateInventoryCheckDetail(data) {
  return request({
    url: '/inventory/check-details',
    method: 'put',
    data,
  });
}

/**
 * 提交库存盘点
 * @param {number|string} id - 盘点记录ID
 * @returns {Promise}
 */
export function submitInventoryCheck(id) {
  return request({
    url: `/inventory/check-records/${id}/submit`,
    method: 'post',
  });
}

/**
 * 导出库存变更历史
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function exportInventoryHistory(params) {
  return request({
    url: '/inventory/history/export',
    method: 'get',
    params,
    responseType: 'blob',
  });
}
