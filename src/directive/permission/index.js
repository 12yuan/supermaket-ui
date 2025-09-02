import store from '@/store'

/**
 * 权限指令
 * 用法：v-permission="'user:add'" 或 v-permission="['user:add', 'user:edit']"
 */
export default {
  inserted(el, binding) {
    const { value } = binding
    const permissions = store.getters && store.getters['auth/permissions']

    if (value && value instanceof Array && value.length > 0) {
      const permissionValues = value

      const hasPermission = permissions.some(permission => {
        return permissionValues.includes(permission)
      })

      if (!hasPermission) {
        el.parentNode && el.parentNode.removeChild(el)
      }
    } else {
      throw new Error(`需要权限！例如 v-permission="['user:add','user:edit']"`);
    }
  }
}