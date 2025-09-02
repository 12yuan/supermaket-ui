import store from '@/store';

/**
 * 角色指令
 * 用法：v-role="'admin'" 或 v-role="['admin', 'editor']"
 */
export default {
  inserted(el, binding) {
    const { value } = binding;
    const roles = store.getters && store.getters['auth/roles'];

    if (value && value instanceof Array && value.length > 0) {
      const roleValues = value;

      const hasRole = roles.some((role) => roleValues.includes(role));

      if (!hasRole) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    } else {
      throw new Error('需要角色！例如 v-role="[\'admin\',\'editor\']"');
    }
  },
};
