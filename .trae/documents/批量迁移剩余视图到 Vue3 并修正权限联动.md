## 改造范围与原则
- 遍历视图与通用组件，统一到 Vue 3/Element Plus 语法
- 不改变业务行为；逐文件小步修改并可运行验证

## 语法统一（事件/双向绑定/插槽）
- 替换 `.sync` 为 `v-model`/`v-model:prop`
  - 对话框：`:visible.sync` → `v-model="..."`
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
- 事件修正：移除 `@keyup.enter.native` → `@keyup.enter`
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

## Element Plus API 对齐
- `el-popover`：`v-model` 改为 `v-model:visible`
  - src/components/AddressSelector/index.vue:7
- 对话框/树/上传等组件保持 Element Plus 当前属性名与行为

## 移除 Vue 2 filters
- 将 `{{ row.createdAt | parseTime }}` → `{{ parseTime(row.createdAt) }}` 并在 `methods` 实现
  - src/views/product/category.vue:52-56,116-120
  - src/views/inventory/check.vue（存在 `filters:`，同步迁移）

## 认证/授权联动修复
- 路由守卫依赖的 getters 补齐
  - 在 src/store/modules/auth.js 增加：
    - `roles: (state) => state.user ? [state.user.role] : []`（src/store/modules/auth.js:179-185 附近）
    - `permissions: (state) => state.user?.permissions || []`
  - 使 src/router/index.js:238 与 src/utils/permission.js:14,30 能正确取值
- 请求层命名空间修正
  - src/utils/request.js:16 从 `store.getters.token` 改为 `store.getters['auth/token']`
- 错误页跳转策略统一
  - 当前仅注册 401/404（src/router/index.js:171-184），但请求层跳转 403/500（src/utils/request.js:81-92）
  - 方案 A（优先）：403/500 改为消息提示并停留当前页；保留现有路由

## 会话与刷新令牌
- 保持 `login/register/logout/refreshToken` 流程（src/store/modules/auth.js）
- 刷新定时器提前 5 分钟刷新（src/store/modules/auth.js:125-133），验证到期边界

## 验证与回归
- 启动后逐页验证：商品/分类、库存（列表/盘点/记录）、地址选择、用户（列表/角色/权限）、登录页
- 路由守卫与 RBAC：管理员显示“用户管理”菜单并可访问；普通用户隐藏与拦截
- 交互：分页切换、对话框开合、上传预览、消息/确认提示

## 交付节奏
- 批次 1：事件与 `v-model` 语法改造（分页/对话框/输入事件）
- 批次 2：插槽语法与 filters 迁移
- 批次 3：权限 getters/请求层修正与错误提示策略
- 批次 4：运行验证与问题修复摘要