<template>
  <el-container class="app-container">
    <el-aside width="auto">
      <sidebar :collapse="isCollapse" />
    </el-aside>
    <el-container>
      <el-header>
        <navbar @toggle-sidebar="toggleSidebar" />
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Sidebar from './components/Sidebar.vue';

export default {
  name: 'Layout',
  components: {
    Navbar,
    Sidebar,
  },
  data() {
    return {
      isCollapse: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.isCollapse = !this.isCollapse;
    },
  },
};
</script>

<style scoped>
.app-container {
  height: 100%;
}

.el-header {
  background-color: #fff;
  color: #333;
  line-height: 60px;
  padding: 0;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  position: relative;
  z-index: 10;
}

.el-aside {
  background-color: #304156;
  color: #fff;
  transition: width 0.3s;
  overflow: hidden;
}

.el-main {
  background-color: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}
</style>