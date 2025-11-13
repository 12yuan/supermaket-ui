## 语法与交互迁移
- 替换 `.sync` 为 `v-model`/`v-model:prop`
  - 对话框：`el-dialog :visible.sync` → `el-dialog v-model="..."`
    - src/components/AddressSelector/index.vue:66
    - src/views/product/category.vue:78
    - src/views/product/index.vue:114
    - src/views/user/role.vue:86,115
    - src/views/user/permission.vue:95
    - src/views/address/index.vue:88
    - src/views/inventory/index.vue:105,145,183
    - src/views/inventory/check.vue:254,294
  - 分页：`:page.sync/:limit.sync` → `v-model:page/v-model:limit`
    - src/views/product/category.vue:73-75
    - src/views/product/index.vue:108-111
    - src/views/user/index.vue:110-111
    - src/views/inventory/index.vue:99-100,252-253
    - src/views/inventory/check.vue:125-126,247-248
- 事件修正：移除 `@keyup.enter.native` 改为 `@keyup.enter`
  - src/views/product/category.vue:9
  - src/views/product/index.vue:9
  - src/views/login/index.vue:43、src/views/Login.vue:12
  - src/views/user/permission.vue:9
  - src/views/user/index.vue:9
  - src/views/inventory/index.vue:9
  - src/views/inventory/check.vue:22,159
- 插槽语法：`slot-scope` → `template #default/#[name]`
  - 示例：src/views/product/index.vue:31-33,37-44,47-76,79-83,85-102
  - 示例：src/views/product/category.vue:35-56,59-66
- 过滤器迁移：移除 Vue 2 `filters`
  - 将 `{{ row.createdAt | parseTime }}` → `{{ parseTime(row.createdAt) }}`，在 `methods` 中实现
    - src/views/product/category.vue:52-56,116-120
    - src/views/inventory/check.vue（存在 `filters:`，同步迁移）

## Element Plus API 对齐
- `el-popover` 绑定方式：`v-model` 改为 `v-model:visible`
  - src/components/AddressSelector/index.vue:3-8
- 全局消息/确认/通知保持一致（已在 src/main.js:16-18 挂载）

## 认证/授权联动修复
- 补齐 `auth` 模块的 `roles/permissions` getters
  - 在 src/store/modules/auth.js 增加：
    - `roles: (state) => state.user ? [state.user.role] : []`
    - `permissions: (state) => state.user?.permissions || []`
  - 让 src/router/index.js:238 和 src/utils/permission.js:14,30 能正常取值
- 请求层命名空间修正
  - src/utils/request.js:16 从 `store.getters.token` 改为 `store.getters['auth/token']`
- 错误页跳转策略统一
  - 当前仅注册了 401/404（src/router/index.js:171-184），但请求层会跳转 403/500（src/utils/request.js:81-92）
  - 方案 A：将 403/500 改为消息提示并停留当前页
  - 方案 B：补充 403/500 路由页（如需单独页面）

## 验证与回归
- 启动后逐页验证：商品/分类、库存列表与盘点、地址选择、用户列表/角色/权限、登录页
- 验证 JWT 登录/刷新/登出流程与路由守卫（含 RBAC 菜单显示与访问控制）
- 组件交互：分页切换、对话框开合、上传、选择、消息提示

## 交付节奏与风险
- 分批提交：先改语法与请求层，再修复权限与路由守卫，最后回归测试
- 风险提示：大规模模板改动易遗漏，按 grep 清单逐一覆盖并复测