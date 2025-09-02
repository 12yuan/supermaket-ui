import Vue from 'vue';
import VueRouter from 'vue-router';
import store from '../store';

Vue.use(VueRouter);

// 路由懒加载
const Login = () => import('../views/login/index.vue');
const Layout = () => import('../views/layout/index.vue');
const Dashboard = () => import('../views/dashboard/index.vue');
const ProductList = () => import('../views/product/ProductList.vue');
const ProductForm = () => import('../views/product/ProductForm.vue');
const ProductCategory = () => import('../views/product/category.vue');
const InventoryList = () => import('../views/inventory/InventoryList.vue');
const InventoryHistory = () => import('../views/inventory/history.vue');
const InventoryCheck = () => import('../views/inventory/check.vue');
const UserList = () => import('../views/user/UserList.vue');
const UserForm = () => import('../views/user/UserForm.vue');
const UserRole = () => import('../views/user/role.vue');
const UserPermission = () => import('../views/user/permission.vue');
const AddressList = () => import('../views/address/AddressList.vue');
const Profile = () => import('../views/profile/index.vue');
const Page401 = () => import('../views/error-page/401.vue');
const Page404 = () => import('../views/error-page/404.vue');

/* 重定向组件 */
const Redirect = () => import('../views/redirect/index.vue');

/* 基础路由 */
export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { title: '仪表盘', icon: 'el-icon-s-data' },
      },
      {
        path: 'product',
        name: 'Product',
        component: { render: (h) => h('router-view') },
        meta: { title: '商品管理', icon: 'el-icon-goods' },
        children: [
          {
            path: 'list',
            name: 'ProductList',
            component: ProductList,
            meta: { title: '商品列表' },
          },
          {
            path: 'category',
            name: 'ProductCategory',
            component: ProductCategory,
            meta: { title: '商品分类' },
          },
          {
            path: 'add',
            name: 'AddProduct',
            component: ProductForm,
            meta: { title: '添加商品' },
          },
          {
            path: 'edit/:id',
            name: 'EditProduct',
            component: ProductForm,
            meta: { title: '编辑商品', hidden: true },
          },
        ],
      },
      {
        path: 'inventory',
        name: 'Inventory',
        component: { render: (h) => h('router-view') },
        meta: { title: '库存管理', icon: 'el-icon-s-shop' },
        children: [
          {
            path: 'list',
            name: 'InventoryList',
            component: InventoryList,
            meta: { title: '库存列表' },
          },
          {
            path: 'history',
            name: 'InventoryHistory',
            component: InventoryHistory,
            meta: { title: '出入库记录' },
          },
          {
            path: 'check',
            name: 'InventoryCheck',
            component: InventoryCheck,
            meta: { title: '库存盘点' },
          },
        ],
      },
      {
        path: 'user',
        name: 'User',
        component: { render: (h) => h('router-view') },
        meta: { title: '用户管理', icon: 'el-icon-user', roles: ['admin'] },
        children: [
          {
            path: 'list',
            name: 'UserList',
            component: UserList,
            meta: { title: '用户列表' },
          },
          {
            path: 'role',
            name: 'UserRole',
            component: UserRole,
            meta: { title: '角色管理' },
          },
          {
            path: 'permission',
            name: 'UserPermission',
            component: UserPermission,
            meta: { title: '权限管理' },
          },
          {
            path: 'add',
            name: 'AddUser',
            component: UserForm,
            meta: { title: '添加用户' },
          },
          {
            path: 'edit/:id',
            name: 'EditUser',
            component: UserForm,
            meta: { title: '编辑用户', hidden: true },
          },
        ],
      },
      {
        path: 'address',
        name: 'Address',
        component: { render: (h) => h('router-view') },
        meta: { title: '地址管理', icon: 'el-icon-location' },
        children: [
          {
            path: 'list',
            name: 'AddressList',
            component: AddressList,
            meta: { title: '地址列表' },
          },
        ],
      },
    ],
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: Redirect
      }
    ]
  },
  {
    path: '/401',
    component: Page401,
    hidden: true
  },
  {
    path: '/404',
    component: Page404,
    hidden: true
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
];

/* 异步路由 - 根据用户角色动态加载 */
export const asyncRoutes = [  
  // 个人中心
  {
    path: '/profile',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        component: Profile,
        name: 'Profile',
        meta: { title: '个人中心', icon: 'el-icon-user' }
      }
    ]
  }
];

const createRouter = () => new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: constantRoutes
});

const router = createRouter();

// 重置路由
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher;
}

// 全局前置守卫
router.beforeEach(async(to, from, next) => {
  // 获取token
  const hasToken = store.getters['auth/token'];
  
  if (hasToken) {
    if (to.path === '/login') {
      // 如果已登录，重定向到首页
      next({ path: '/' });
    } else {
      // 确定用户是否已获取角色信息
      const hasRoles = store.getters['auth/roles'] && store.getters['auth/roles'].length > 0;
      
      if (hasRoles) {
        next();
      } else {
        try {
          // 获取用户信息
          const { roles } = await store.dispatch('auth/getInfo');
          
          // 根据角色生成可访问路由
          const accessRoutes = await store.dispatch('permission/generateRoutes', roles);
          
          // 动态添加可访问路由
          router.addRoutes(accessRoutes);
          
          // 确保addRoutes完成
          next({ ...to, replace: true });
        } catch (error) {
          // 移除token并跳转到登录页
          await store.dispatch('auth/resetToken');
          next(`/login?redirect=${to.path}`);
        }
      }
    }
  } else {
    // 没有token
    if (to.meta.requiresAuth === false) {
      // 白名单，直接通过
      next();
    } else {
      // 重定向到登录页
      next(`/login?redirect=${to.path}`);
    }
  }
});

// 全局后置钩子
router.afterEach(() => {
  // 结束进度条
  // NProgress.done();
});

export default router;