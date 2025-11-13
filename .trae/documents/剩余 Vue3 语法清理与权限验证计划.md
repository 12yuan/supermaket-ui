## 待清理的 Vue3 语法
- 全量替换残留的 `slot-scope` 为 `template #default`（重点：`src/views/inventory/index.vue` 主表与记录表剩余片段）
- 统一 `el-dialog` 为 `v-model` 绑定并使用 `template #footer`（逐页核对库存与用户模块）
- 统一 `el-upload` 提示插槽为 `template #tip`（已改库存批量上传，其余视图如有同类用法一并检查）

## 认证与授权对齐
- 路由守卫使用 `auth/roles` 与 `auth/permissions`（已补充 getters），回归管理员与普通用户的访问行为
- 统一请求层错误处理：403/500 改为消息提示并停留当前页；仅 401 跳登录（调整 `src/utils/request.js`）

## 依赖与构建核对
- `package.json` 已切换到 `element-plus`，清理 `babel-plugin-component`；锁文件已同步
- 再次检查 `vue.config.js` 的 `splitChunks` 指向 `element-plus`（当前已正确）

## 验证与回归
- 启动应用，覆盖以下场景：
  - 登录/登出与刷新令牌；路由守卫与 RBAC 菜单显示与访问控制
  - 列表、分页、对话框、上传、消息/确认等交互可用
  - 商品/分类、库存（列表/记录/盘点）、地址、用户（列表/角色/权限）、仪表盘

## 交付
- 提交剩余语法清理的变更集（带文件清单）
- 输出验证结果与问题清单，必要时追加修复