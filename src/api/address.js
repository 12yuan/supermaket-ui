import request from '@/utils/request';

/**
 * 获取地址列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getAddressList(params) {
  return request({
    url: '/addresses',
    method: 'get',
    params,
  });
}

/**
 * 获取地址详情
 * @param {number|string} id - 地址ID
 * @returns {Promise}
 */
export function getAddressDetail(id) {
  return request({
    url: `/addresses/${id}`,
    method: 'get',
  });
}

/**
 * 创建地址
 * @param {Object} data - 地址数据
 * @returns {Promise}
 */
export function createAddress(data) {
  return request({
    url: '/addresses',
    method: 'post',
    data,
  });
}

/**
 * 更新地址
 * @param {number|string} id - 地址ID
 * @param {Object} data - 地址数据
 * @returns {Promise}
 */
export function updateAddress(id, data) {
  return request({
    url: `/addresses/${id}`,
    method: 'put',
    data,
  });
}

/**
 * 删除地址
 * @param {number|string} id - 地址ID
 * @returns {Promise}
 */
export function deleteAddress(id) {
  return request({
    url: `/addresses/${id}`,
    method: 'delete',
  });
}

/**
 * 设置默认地址
 * @param {number|string} id - 地址ID
 * @returns {Promise}
 */
export function setDefaultAddress(id) {
  return request({
    url: `/addresses/${id}/default`,
    method: 'patch',
  });
}

/**
 * 获取省市区数据
 * @returns {Promise}
 */
export function getRegionData() {
  return request({
    url: '/regions',
    method: 'get',
  });
}

/**
 * 根据省份获取城市列表
 * @param {string} province - 省份名称或代码
 * @returns {Promise}
 */
export function getCitiesByProvince(province) {
  return request({
    url: '/regions/cities',
    method: 'get',
    params: { province },
  });
}

/**
 * 根据城市获取区县列表
 * @param {string} province - 省份名称或代码
 * @param {string} city - 城市名称或代码
 * @returns {Promise}
 */
export function getDistrictsByCity(province, city) {
  return request({
    url: '/regions/districts',
    method: 'get',
    params: { province, city },
  });
}
