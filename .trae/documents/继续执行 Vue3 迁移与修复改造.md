## 关键修复与迁移项
- 统一事件与双向绑定
  - 将所有 `.sync` 改为 `v-model`/`v-model:prop`
    - `src/components/AddressSelector/index.vue:66` → `el-dialog v-model="dialogVisible"`
    - `src/views/product/category.vue:73-75`、`src/views/product/index.vue:108-111`、`src/views/user/index.vue:110-116`、`src/views/user/role.vue:86,115`、`src/views/user/permission.vue:95`、`src/views/address/index.vue:88`、`src/views/inventory/index.vue:99-105,145,183,252-253`、`src/views/inventory/check.vue:125-126,247-248,254,294`
  - 移除 `@keyup.enter.native` 改为 `@keyup.enter`
    - `src/views/product/category.vue:9`、`src/views/product/index.vue:9`、`src/views/login/index.vue:43`、`src/views/Login.vue:12`、`src/views/user/permission.vue:9`、`src/views/user/index.vue:9`、`src/views/inventory/index.vue:9`、`src/views/inventory/check.vue:22,159`
  - 插槽语法从 `slot-scope` 迁移为 `template #default`
    - 例如 `src/views/product/index.vue:31-33,37-44,...`、`src/views/product/category.vue:35-56,59-66`
- 移除 Vue 2 filters
  - 将 `{{ row.createdAt | parseTime }}` 改为 `{{ parseTime(row.createdAt) }}` 并在 `methods` 中实现
    - `src/views/product/category.vue:52-56,116-120`
    - `src/views/inventory/check.vue` 中的 `filters:` 同步改造（通过 `methods.parseTime`）

## 认证/授权联动修正
- 修复路由守卫中的角色与权限来源
  - 当前使用 `store.getters['auth/roles']`/`['auth/permissions']`，而 `src/store/modules/auth.js` 仅提供 `userRole/token`
  - 计划：在 `auth.js` 添加 `roles`（例如 `roles: (state) => state.user ? [state.user.role] : []`）与 `permissions`（若后端未返回，则默认 `[]`），保证 `router` 与 `utils/permission.js` 可用
  - 参考：`src/router/index.js:238`、`src/utils/permission.js:14,30`
- 请求层命名空间修正
  - 将 `src/utils/request.js:16` 的 `store.getters.token` 改为 `store.getters['auth/token']`
- 错误页路由一致化
  - 目前存在 `'/401'`、`'/404'`（`src/router/index.js:171-184`），但请求层会跳转 `'/403'`、`'/500'`（`src/utils/request.js:81-92`）
  - 计划：短期内将 403/500 的跳转改为消息提示并保留当前页；后续如需引入对应错误页再补充路由

## 依赖与构建一致性校验
- 依赖现状
  - `package.json` 已为 Vue3 栈：`vue:^3.5.20`、`vue-router:^4.5.1`、`vuex:^4.1.0`、`@vue/cli-service:~4.5.0`
  - 计划：移除 `element-ui`，新增并锁定 `element-plus:^2.8.6`；清理 `babel-plugin-component`
- 构建配置
  - `babel.config.js`：保持简洁（`plugins: []`）
  - `vue.config.js`：`splitChunks` 已指向 `element-plus`（`src/vue.config.js:92-96`），保持现状

## 验证路径
- 本地运行并回归以下场景
  - 登录/登出、刷新令牌（JWT）、路由守卫与 RBAC（管理员可访问用户管理菜单）
  - 列表/表单/弹窗交互（分页、上传、选择，消息/确认提示）
  - 关键视图：商品（`ProductList`/分类）、库存（列表/盘点）、用户（列表/角色/权限）、地址、仪表盘

## 交付方式
- 按模块逐步提交改动：
  1) 依赖与请求层命名空间修正；
  2) 视图层事件与插槽、filters 迁移；
  3) 路由守卫与权限工具对齐；
  4) 运行验证与问题回收。
- 每阶段输出变更文件清单与关键验证结果。