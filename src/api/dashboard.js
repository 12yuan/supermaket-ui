import request from '@/utils/request';

/**
 * 获取仪表盘统计数据
 * @param {Object} params - 查询参数
 * @param {Date} params.startDate - 开始日期
 * @param {Date} params.endDate - 结束日期
 * @returns {Promise}
 */
export function getDashboardStatistics(params) {
  return request({
    url: '/dashboard/statistics',
    method: 'get',
    params,
  });
}

/**
 * 获取销售趋势数据
 * @param {Object} params - 查询参数
 * @param {Date} params.startDate - 开始日期
 * @param {Date} params.endDate - 结束日期
 * @param {String} params.type - 趋势类型：daily(日)、weekly(周)、monthly(月)
 * @returns {Promise}
 */
export function getSalesTrend(params) {
  return request({
    url: '/dashboard/sales-trend',
    method: 'get',
    params,
  });
}

/**
 * 获取热销商品数据
 * @param {Object} params - 查询参数
 * @param {Date} params.startDate - 开始日期
 * @param {Date} params.endDate - 结束日期
 * @param {Number} params.limit - 返回数量限制
 * @returns {Promise}
 */
export function getHotProducts(params) {
  return request({
    url: '/dashboard/hot-products',
    method: 'get',
    params,
  });
}

/**
 * 获取用户地区分布数据
 * @returns {Promise}
 */
export function getUserRegionDistribution() {
  return request({
    url: '/dashboard/user-region',
    method: 'get',
  });
}

/**
 * 获取库存不足商品列表
 * @returns {Promise}
 */
export function getLowStockProducts() {
  return request({
    url: '/dashboard/low-stock',
    method: 'get',
  });
}

/**
 * 获取最近订单列表
 * @param {Object} params - 查询参数
 * @param {Number} params.limit - 返回数量限制
 * @returns {Promise}
 */
export function getRecentOrders(params) {
  return request({
    url: '/dashboard/recent-orders',
    method: 'get',
    params,
  });
}

/**
 * 获取销售额排名前列的商品类别
 * @param {Object} params - 查询参数
 * @param {Date} params.startDate - 开始日期
 * @param {Date} params.endDate - 结束日期
 * @param {Number} params.limit - 返回数量限制
 * @returns {Promise}
 */
export function getTopCategories(params) {
  return request({
    url: '/dashboard/top-categories',
    method: 'get',
    params,
  });
}

/**
 * 获取用户增长趋势
 * @param {Object} params - 查询参数
 * @param {Date} params.startDate - 开始日期
 * @param {Date} params.endDate - 结束日期
 * @param {String} params.type - 趋势类型：daily(日)、weekly(周)、monthly(月)
 * @returns {Promise}
 */
export function getUserGrowth(params) {
  return request({
    url: '/dashboard/user-growth',
    method: 'get',
    params,
  });
}
