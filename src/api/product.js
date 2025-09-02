import request from '@/utils/request';

/**
 * 获取商品列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getProducts(params) {
  return request({
    url: '/products',
    method: 'get',
    params
  });
}

/**
 * 获取商品详情
 * @param {number|string} id - 商品ID
 * @returns {Promise}
 */
export function getProduct(id) {
  return request({
    url: `/products/${id}`,
    method: 'get'
  });
}

/**
 * 创建商品
 * @param {Object} data - 商品数据
 * @returns {Promise}
 */
export function createProduct(data) {
  return request({
    url: '/products',
    method: 'post',
    data
  });
}

/**
 * 更新商品
 * @param {number|string} id - 商品ID
 * @param {Object} data - 商品数据
 * @returns {Promise}
 */
export function updateProduct(id, data) {
  return request({
    url: `/products/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除商品
 * @param {number|string} id - 商品ID
 * @returns {Promise}
 */
export function deleteProduct(id) {
  return request({
    url: `/products/${id}`,
    method: 'delete'
  });
}

/**
 * 获取商品分类列表
 * @returns {Promise}
 */
export function getCategories() {
  return request({
    url: '/product/categories',
    method: 'get'
  });
}

/**
 * 创建商品分类
 * @param {Object} data - 分类数据
 * @returns {Promise}
 */
export function createCategory(data) {
  return request({
    url: '/product/categories',
    method: 'post',
    data
  });
}

/**
 * 更新商品分类
 * @param {number|string} id - 分类ID
 * @param {Object} data - 分类数据
 * @returns {Promise}
 */
export function updateCategory(id, data) {
  return request({
    url: `/product/categories/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除商品分类
 * @param {number|string} id - 分类ID
 * @returns {Promise}
 */
export function deleteCategory(id) {
  return request({
    url: `/product/categories/${id}`,
    method: 'delete'
  });
}

/**
 * 更新分类状态
 * @param {number|string} id - 分类ID
 * @param {number} status - 状态值
 * @returns {Promise}
 */
export function updateCategoryStatus(id, status) {
  return request({
    url: `/product/categories/${id}/status`,
    method: 'put',
    data: { status }
  });
}

/**
 * 更新商品状态（上架/下架）
 * @param {number|string} id - 商品ID
 * @param {Object} data - 状态数据
 * @param {number} data.status - 商品状态：0-下架，1-上架
 * @returns {Promise}
 */
export function updateProductStatus(id, data) {
  return request({
    url: `/products/${id}/status`,
    method: 'patch',
    data
  });
}

/**
 * 批量更新商品状态
 * @param {Object} data - 批量更新数据
 * @param {Array} data.ids - 商品ID数组
 * @param {number} data.status - 商品状态：0-下架，1-上架
 * @returns {Promise}
 */
export function batchUpdateProductStatus(data) {
  return request({
    url: '/products/batch-status',
    method: 'patch',
    data
  });
}

/**
 * 获取商品分类列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getCategoryList(params) {
  return request({
    url: '/categories',
    method: 'get',
    params
  });
}

/**
 * 获取商品分类详情
 * @param {number|string} id - 分类ID
 * @returns {Promise}
 */
export function getCategoryDetail(id) {
  return request({
    url: `/categories/${id}`,
    method: 'get'
  });
}

/**
 * 创建商品分类
 * @param {Object} data - 分类数据
 * @returns {Promise}
 */
export function createCategory(data) {
  return request({
    url: '/categories',
    method: 'post',
    data
  });
}

/**
 * 更新商品分类
 * @param {number|string} id - 分类ID
 * @param {Object} data - 分类数据
 * @returns {Promise}
 */
export function updateCategory(id, data) {
  return request({
    url: `/categories/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除商品分类
 * @param {number|string} id - 分类ID
 * @returns {Promise}
 */
export function deleteCategory(id) {
  return request({
    url: `/categories/${id}`,
    method: 'delete'
  });
}

/**
 * 上传商品图片
 * @param {FormData} data - 包含图片的FormData
 * @returns {Promise}
 */
export function uploadProductImage(data) {
  return request({
    url: '/upload/product-image',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}