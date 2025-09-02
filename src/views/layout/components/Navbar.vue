<template>
  <div class="navbar">
    <div class="left-menu">
      <i class="el-icon-s-fold toggle-button" @click="toggleSidebar"></i>
    </div>
    
    <breadcrumb class="breadcrumb-container" />
    
    <div class="right-menu">
      <el-dropdown trigger="click" @command="handleCommand">
        <div class="avatar-wrapper">
          <span>{{ username }}</span>
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="profile">个人信息</el-dropdown-item>
          <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import Breadcrumb from './Breadcrumb.vue';

export default {
  name: 'Navbar',
  components: {
    Breadcrumb,
  },
  computed: {
    ...mapGetters('auth', ['currentUser']),
    username() {
      return this.currentUser ? this.currentUser.name : '用户';
    },
  },
  methods: {
    ...mapActions('auth', ['logout']),
    toggleSidebar() {
      this.$emit('toggle-sidebar');
    },
    async handleCommand(command) {
      if (command === 'logout') {
        try {
          await this.logout();
          this.$router.push('/login');
          this.$message.success('已退出登录');
        } catch (error) {
          this.$message.error('退出登录失败');
        }
      } else if (command === 'profile') {
        // 跳转到个人信息页面
        this.$router.push('/profile');
      }
    },
  },
};
</script>

<style scoped>
.navbar {
  height: 60px;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  padding: 0 20px;
}

.left-menu {
  float: left;
}

.toggle-button {
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s;
  padding: 10px;
}

.toggle-button:hover {
  color: #409EFF;
}

.breadcrumb-container {
  float: left;
  margin-left: 20px;
}

.right-menu {
  float: right;
  margin-left: auto;
}

.avatar-wrapper {
  cursor: pointer;
  display: flex;
  align-items: center;
}

.avatar-wrapper span {
  margin-right: 5px;
}
</style>