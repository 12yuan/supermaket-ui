## 目标

* 全仓库统一为 Vue 3 写法：启动方式、路由(v4)、状态管理(v4)、指令钩子、移除过滤器、组件改造为 Composition API，UI 库统一为 Element Plus。

* 解决版本错配：当前源码混用 Vue 2/3 风格与依赖（例如 `Vue.use`、`vue-router v3`、`element-ui` 与 `Element Plus` 并存）。

## 现状与关键问题

* 启动：`src/main.js:1` 已用 `createApp`（Vue 3）。

* 路由：`src/router/index.js:5,207,213` 使用 `Vue.use(VueRouter)` 与 `new VueRouter(...)`（v3）。

* 状态：`src/store/index.js` 使用 `Vue.use(Vuex)` 与 `new Vuex.Store(...)`（v3）。

* UI：`src/utils/request.js` 引 `element-ui` 的 `Message/MessageBox`；同时 `src/main.js` 有 `Element Plus` 用法；`babel.config.js` 与 `vue.config.js` 针对 `element-ui` 按需加载与分包。

* 指令：`src/directive/permission/*` 使用 Vue 2 指令钩子（如 `inserted`）。

* 过滤器：多个组件使用 `filters: {}`；Vue 3 已移除过滤器。

* 组件：全部为 Options API（33 个 `.vue` 文件）；无 Composition API。

## 依赖与构建统一

* `package.json`：

  * 移除 `element-ui` 与其相关按需加载依赖（`babel-plugin-component`）。

  * 保留 `vue@^3`、`vue-router@^4`、`vuex@^4`；新增/统一为 `element-plus@^2`。

* 构建：保留 Vue CLI/Webpack（`vue.config.js`）以降低迁移成本；同步清理针对 `element-ui` 的分包配置（如 `chunk-elementUI`）。

## 启动入口改造（src/main.js）

* 使用 `createApp(App)`，移除任何 `Vue.use(...)` 写法。

* 注册 `router`（v4）与 `store`（v4）。

* 全局注册 Element Plus（含样式）。

## 路由迁移到 vue-router v4（src/router/index.js）

* 替换为 `createRouter` + `createWebHistory`（或 `createWebHashHistory`，沿用当前 `history` 模式）。

* 将 `new VueRouter(...)`、`router.addRoutes(...)` 迁移为 v4 的 `addRoute`；对动态路由，新增 `resetRouter()` 使用 `removeRoute(name)` 清理登录态注销后的动态路由。

* 导航守卫改为 v4 语法（`router.beforeEach` 等保持兼容）。

* 组件侧替换 `$route/$router` 访问为 `useRoute()/useRouter()`。

## 状态管理迁移到 Vuex v4（src/store/\*）

* 用 `createStore` 初始化；移除 `Vue.use(Vuex)`。

* 模块结构保持不变，保留 `mapState/mapGetters/mapActions`，在 Composition API 中通过 `useStore()` + `computed` 封装。

* 组件侧将 `$store` 访问统一为 `useStore()`。

## 指令迁移（src/directive/permission/\*）

* 将 Vue 2 指令钩子映射到 Vue 3：`inserted`→`mounted`、`update`→`updated`、`unbind`→`unmounted`。

* 保持现有权限逻辑不变，兼容 v4 路由和 v4 状态。

## 过滤器移除与替代

* 移除所有 `filters: {}` 声明。

* 按用途替换为：

  * 展示格式：组件内方法或 `computed`。

  * 复用格式化：抽取到 `src/utils/format.js` 并在组件中按需导入。

## 组件全面迁移为 Composition API

* 策略：采用 `setup()` 迁移（必要处使用 `<script setup>`），保持模板结构与样式不变。

* 通用替换：

  * `data()` → `ref/ reactive`。

  * `computed: {}` → `computed`。

  * `methods: {}` → 函数定义于 `setup()`。

  * 生命周期：`mounted`→`onMounted`、`beforeDestroy`→`onBeforeUnmount` 等。

  * 路由：`this.$route/$router` → `useRoute()/useRouter()`。

  * 状态：`this.$store` → `useStore()`；`map*` → 在 `setup()` 中手动 `computed + store`。

* 范围：覆盖 `src/views/*`、`src/components/*`、`src/layout/*`、`src/App.vue` 等 33 个文件。

## UI 库统一为 Element Plus

* 组件调用与样式：替换 `element-ui` API（如 `Message/MessageBox`）为 `ElMessage/ElMessageBox`；统一引入样式 `element-plus/dist/index.css`。

* 针对表单、对话框、表格等常用组件，按 Element Plus 兼容属性核对并微调。

## 请求层与全局交互（src/utils/request.js）

* 替换通知与确认弹窗为 Element Plus API。

* 保留 axios 拦截器逻辑与错误处理；如果使用过滤器格式化错误文案，移至工具方法。

## 配置清理

* `babel.config.js`：移除 `babel-plugin-component` 的 `element-ui` 配置。

* `vue.config.js`：移除 `chunk-elementUI` 分包与相关别名；保留其余构建优化。

## 验证与交付

* 逐模块迁移并运行开发环境，确保路由、登录态、权限指令、请求层与主要页面可用。

* 完成后提供：改动概览、关键文件差异、运行与构建说明；演示环境预览链接。

## 后续可选

* 视需要将 Vuex v4 迁移为 Pinia（更贴近 Vue 3），作为后续优化阶段。

* 评估迁移到 Vite 以获得更快的构建与 HMR。

