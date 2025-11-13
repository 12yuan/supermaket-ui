## 目标与范围
- 将项目全部统一到 Vue 3 写法与依赖栈，替换所有 Vue 2 语法与 Element UI 用法
- 完成认证/授权、路由守卫、会话管理等按“Supermarket UI 用户规则”落地
- 保持现有业务行为不变，确保可运行并通过基本验证

## 现状核查与依赖梳理
- 确认 `package.json` 中 `vue`、`vue-router`、`vuex`、`element-plus`、`axios` 版本与脚本
- 移除 `element-ui` 及其相关构建插件；新增并锁定 `element-plus` 稳定版本
- 统一 Node 版本约束与包管理锁文件（`yarn.lock` 或 `package-lock.json`）

## 路由体系（v4）完善
- 使用 `createRouter/createWebHistory` 统一路由入口（`src/router/index.js`）
- 404 通配为 `/:pathMatch(.*)*`，父级占位用 `ParentView` 组件
- 动态路由使用 `router.addRoute` 与 `removeRoute` 完成重置逻辑
- 实现导航守卫：登录态校验、角色校验、白名单与重定向策略

## 状态管理（Vuex v4）完善
- 入口统一为 `createStore`（`src/store/index.js`），保留持久化插件（如使用）
- `user` 模块存储 `id/name/email/role/token/isAuthenticated`
- 提供 `login/logout/refreshToken` actions 与过期处理

## UI 组件迁移至 Element Plus
- 全局注册 `Element Plus` 与消息 API（`ElMessage/ElMessageBox/ElNotification`）
- 替换所有 `element-ui` 组件标签与属性，统一主题与样式导入
- 分包策略从 `element-ui` 迁移到 `element-plus`

## 指令与事件语法统一
- 自定义指令钩子改为 `mounted/updated/unmounted`
- 移除 `.sync`，统一为 `v-model` 与 `v-model:prop`
- 移除 `@keyup.enter.native`，统一为 `@keyup.enter`
- 插槽语法 `slot-scope` 迁移为 `template #default/#[name]`

## 视图/组件全面适配
- 移除 Vue 2 `filters`，用方法/计算属性替代
- 分页组件 `Pagination` 统一 `v-model:current-page/v-model:page-size`
- 逐页排查并替换：商品、库存、地址、用户与权限、仪表盘、错误页、布局等视图

## 认证与授权（符合用户规则）
- 登录后保存 JWT；支持刷新令牌机制与登出清理
- RBAC：在前端隐藏/禁用无权限的 UI；后端接口按角色校验
- 路由守卫：未认证跳登录、无权限跳 403/首页
- 会话持久化与超时退出；可选 `vuex-persist` 且注意安全

## 请求层与错误处理
- `axios` 拦截器读取 `token` 注入 `Authorization`
- 统一错误提示与异常重试策略；401 触发登出或刷新令牌
- 基于响应码的用户友好错误消息

## 构建与工程化清理
- 清理 `babel.config.js` 中 `element-ui` 按需插件
- 更新 `vue.config.js` 的 `splitChunks` 指向 `element-plus`
- 校验 ESLint/TS 配置，确保 Vue 3 语法检查通过

## 验证与测试
- 本地启动与关键路径手测：登录、商品浏览/购物车/下单、管理端权限视图
- 路由与权限用例：不同角色访问控制与导航守卫行为
- 组件交互回归（表格、表单、分页、弹窗、消息）

## 交付与回滚策略
- 提供变更摘要与关键文件清单，标注风险点与验证结果
- 如遇依赖或构建问题，支持快速回滚依赖或逐步迁移策略

请确认以上计划；确认后我将按此分阶段执行并在每阶段完成后进行可运行验证。