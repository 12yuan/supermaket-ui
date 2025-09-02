<template>
  <div class="sidebar-container">
    <div class="logo-container">
      <router-link to="/">
        <h1 class="logo-title" v-if="!collapse">超市管理系统</h1>
        <h1 class="logo-title" v-else>超市</h1>
      </router-link>
    </div>
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        :default-active="activeMenu"
        :collapse="collapse"
        :unique-opened="true"
        :collapse-transition="false"
        mode="vertical"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <sidebar-item v-for="route in routes" :key="route.path" :item="route" :base-path="route.path" />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SidebarItem from './SidebarItem.vue';

export default {
  name: 'Sidebar',
  components: { SidebarItem },
  props: {
    collapse: {
      type: Boolean,
      required: true,
    },
  },
  computed: {
    ...mapGetters('auth', ['userRole']),
    routes() {
      // 过滤路由，只显示有meta信息且不隐藏的路由
      return this.$router.options.routes
        .find((route) => route.path === '/')
        .children.filter((route) => {
          // 检查路由是否有meta信息
          if (!route.meta) return false;
          
          // 检查路由是否隐藏
          if (route.meta.hidden) return false;
          
          // 检查用户角色权限
          if (route.meta.roles && route.meta.roles.length > 0) {
            return route.meta.roles.includes(this.userRole);
          }
          
          return true;
        });
    },
    activeMenu() {
      const { meta, path } = this.$route;
      // 如果设置了activeMenu属性，则使用它
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
  },
};
</script>

<style scoped>
.sidebar-container {
  height: 100%;
  background-color: #304156;
}

.logo-container {
  height: 60px;
  line-height: 60px;
  background-color: #2b2f3a;
  text-align: center;
  overflow: hidden;
}

.logo-title {
  display: inline-block;
  margin: 0;
  color: #fff;
  font-weight: 600;
  font-size: 18px;
  vertical-align: middle;
}

.scrollbar-wrapper {
  overflow-x: hidden !important;
}
</style>