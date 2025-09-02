import request from '@/utils/request';

/**
 * 获取用户列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getUserList(params) {
  return request({
    url: '/users',
    method: 'get',
    params
  });
}

/**
 * 获取用户详情
 * @param {number|string} id - 用户ID
 * @returns {Promise}
 */
export function getUserDetail(id) {
  return request({
    url: `/users/${id}`,
    method: 'get'
  });
}

/**
 * 创建用户
 * @param {Object} data - 用户数据
 * @returns {Promise}
 */
export function createUser(data) {
  return request({
    url: '/users',
    method: 'post',
    data
  });
}

/**
 * 更新用户
 * @param {number|string} id - 用户ID
 * @param {Object} data - 用户数据
 * @returns {Promise}
 */
export function updateUser(id, data) {
  return request({
    url: `/users/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除用户
 * @param {number|string} id - 用户ID
 * @returns {Promise}
 */
export function deleteUser(id) {
  return request({
    url: `/users/${id}`,
    method: 'delete'
  });
}

/**
 * 更新用户状态（启用/禁用）
 * @param {number|string} id - 用户ID
 * @param {Object} data - 状态数据
 * @param {number} data.status - 用户状态：0-禁用，1-启用
 * @returns {Promise}
 */
export function updateUserStatus(id, data) {
  return request({
    url: `/users/${id}/status`,
    method: 'patch',
    data
  });
}

/**
 * 更新用户角色
 * @param {number|string} id - 用户ID
 * @param {Object} data - 角色数据
 * @param {Array} data.roleIds - 角色ID数组
 * @returns {Promise}
 */
export function updateUserRoles(id, data) {
  return request({
    url: `/users/${id}/roles`,
    method: 'put',
    data
  });
}

/**
 * 获取角色列表
 * @param {Object} params - 查询参数
 * @returns {Promise}
 */
export function getRoleList(params) {
  return request({
    url: '/roles',
    method: 'get',
    params
  });
}

/**
 * 获取角色详情
 * @param {number|string} id - 角色ID
 * @returns {Promise}
 */
export function getRoleDetail(id) {
  return request({
    url: `/roles/${id}`,
    method: 'get'
  });
}

/**
 * 创建角色
 * @param {Object} data - 角色数据
 * @returns {Promise}
 */
export function createRole(data) {
  return request({
    url: '/roles',
    method: 'post',
    data
  });
}

/**
 * 更新角色
 * @param {number|string} id - 角色ID
 * @param {Object} data - 角色数据
 * @returns {Promise}
 */
export function updateRole(id, data) {
  return request({
    url: `/roles/${id}`,
    method: 'put',
    data
  });
}

/**
 * 删除角色
 * @param {number|string} id - 角色ID
 * @returns {Promise}
 */
export function deleteRole(id) {
  return request({
    url: `/roles/${id}`,
    method: 'delete'
  });
}

/**
 * 获取权限列表
 * @returns {Promise}
 */
export function getPermissionList() {
  return request({
    url: '/permissions',
    method: 'get'
  });
}

/**
 * 上传用户头像
 * @param {FormData} data - 包含头像的FormData
 * @returns {Promise}
 */
export function uploadAvatar(data) {
  return request({
    url: '/upload/avatar',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}