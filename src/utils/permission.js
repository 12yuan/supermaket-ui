/**
 * 权限检查工具
 * 用于检查当前用户是否有权限访问某个资源或执行某个操作
 */

import store from '@/store';

/**
 * 检查用户是否有指定角色
 * @param {String|Array} roles - 角色或角色数组
 * @returns {Boolean}
 */
export function hasRole(roles) {
  const userRoles = store.getters['auth/roles'];
  if (!userRoles || userRoles.length === 0) return false;
  
  if (Array.isArray(roles)) {
    return userRoles.some(role => roles.includes(role));
  }
  
  return userRoles.includes(roles);
}

/**
 * 检查用户是否有指定权限
 * @param {String|Array} permissions - 权限或权限数组
 * @returns {Boolean}
 */
export function hasPermission(permissions) {
  const userPermissions = store.getters['auth/permissions'];
  if (!userPermissions || userPermissions.length === 0) return false;
  
  if (Array.isArray(permissions)) {
    return permissions.some(permission => userPermissions.includes(permission));
  }
  
  return userPermissions.includes(permissions);
}

/**
 * 检查用户是否是管理员
 * @returns {Boolean}
 */
export function isAdmin() {
  return hasRole('admin');
}

/**
 * 检查用户是否有权限访问路由
 * @param {Object} route - 路由对象
 * @returns {Boolean}
 */
export function canAccessRoute(route) {
  if (!route.meta) return true;
  if (!route.meta.roles && !route.meta.permissions) return true;
  
  let hasAccess = false;
  
  // 检查角色
  if (route.meta.roles) {
    hasAccess = hasRole(route.meta.roles);
  }
  
  // 检查权限
  if (!hasAccess && route.meta.permissions) {
    hasAccess = hasPermission(route.meta.permissions);
  }
  
  return hasAccess;
}

/**
 * 过滤用户有权限访问的路由
 * @param {Array} routes - 路由数组
 * @returns {Array} - 过滤后的路由数组
 */
export function filterAccessibleRoutes(routes) {
  const accessibleRoutes = [];
  
  routes.forEach(route => {
    const tmpRoute = { ...route };
    
    if (canAccessRoute(tmpRoute)) {
      if (tmpRoute.children) {
        tmpRoute.children = filterAccessibleRoutes(tmpRoute.children);
      }
      accessibleRoutes.push(tmpRoute);
    }
  });
  
  return accessibleRoutes;
}