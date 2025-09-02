<template>
  <div class="app-wrapper">
    <!-- 侧边栏 -->
    <sidebar :collapse="isCollapse" class="sidebar-container" />
    
    <div class="main-container">
      <!-- 顶部导航栏 -->
      <navbar @toggle-sidebar="toggleSidebar" />
      
      <!-- 标签导航栏 -->
      <tags-view v-if="showTagsView" />
      
      <!-- 主内容区域 -->
      <app-main />
    </div>
  </div>
</template>

<script>
import { Sidebar, Navbar, TagsView, AppMain } from './components';
import { mapState } from 'vuex';

export default {
  name: 'Layout',
  components: {
    Sidebar,
    Navbar,
    TagsView,
    AppMain
  },
  data() {
    return {
      isCollapse: false
    };
  },
  computed: {
    ...mapState({
      showTagsView: state => state.settings?.tagsView
    })
  },
  methods: {
    toggleSidebar() {
      this.isCollapse = !this.isCollapse;
    }
  }
};
</script>

<style lang="scss" scoped>
.app-wrapper {
  position: relative;
  height: 100%;
  width: 100%;
  
  &:after {
    content: '';
    display: table;
    clear: both;
  }
}

.sidebar-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  width: 210px;
  overflow: hidden;
  transition: width 0.28s;
}

.main-container {
  min-height: 100%;
  margin-left: 210px;
  position: relative;
  transition: margin-left 0.28s;
}

.hideSidebar {
  .sidebar-container {
    width: 54px !important;
  }
  
  .main-container {
    margin-left: 54px;
  }
}
</style>