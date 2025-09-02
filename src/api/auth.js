import request from '@/utils/request';

/**
 * 用户登录
 * @param {Object} data - 登录信息
 * @param {string} data.username - 用户名
 * @param {string} data.password - 密码
 * @returns {Promise}
 */
export function login(data) {
  return request({
    url: '/auth/login',
    method: 'post',
    data
  });
}

/**
 * 用户注册
 * @param {Object} data - 注册信息
 * @returns {Promise}
 */
export function register(data) {
  return request({
    url: '/auth/register',
    method: 'post',
    data
  });
}

/**
 * 获取用户信息
 * @returns {Promise}
 */
export function getUserInfo() {
  return request({
    url: '/auth/user-info',
    method: 'get'
  });
}

/**
 * 登出
 * @returns {Promise}
 */
export function logout() {
  return request({
    url: '/auth/logout',
    method: 'post'
  });
}

/**
 * 刷新Token
 * @param {Object} data - 刷新Token的数据
 * @param {string} data.refreshToken - 刷新Token
 * @returns {Promise}
 */
export function refreshToken(data) {
  return request({
    url: '/auth/refresh-token',
    method: 'post',
    data
  });
}

/**
 * 修改密码
 * @param {Object} data - 修改密码的数据
 * @param {string} data.oldPassword - 旧密码
 * @param {string} data.newPassword - 新密码
 * @returns {Promise}
 */
export function changePassword(data) {
  return request({
    url: '/auth/change-password',
    method: 'post',
    data
  });
}

/**
 * 发送密码重置邮件
 * @param {Object} data - 包含邮箱的数据
 * @param {string} data.email - 邮箱
 * @returns {Promise}
 */
export function forgotPassword(data) {
  return request({
    url: '/auth/forgot-password',
    method: 'post',
    data
  });
}

/**
 * 重置密码
 * @param {Object} data - 重置密码的数据
 * @param {string} data.token - 重置密码的token
 * @param {string} data.newPassword - 新密码
 * @returns {Promise}
 */
export function resetPassword(data) {
  return request({
    url: '/auth/reset-password',
    method: 'post',
    data
  });
}