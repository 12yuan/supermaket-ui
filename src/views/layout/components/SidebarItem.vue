<template>
  <div v-if="!item.meta || !item.meta.hidden">
    <!-- 没有子菜单的情况 -->
    <template v-if="!hasChildren(item)">
      <el-menu-item :index="resolvePath(item.path)">
        <i v-if="item.meta && item.meta.icon" :class="item.meta.icon"></i>
        <span slot="title">{{ item.meta.title }}</span>
      </el-menu-item>
    </template>
    
    <!-- 有子菜单的情况 -->
    <el-submenu v-else :index="resolvePath(item.path)">
      <template slot="title">
        <i v-if="item.meta && item.meta.icon" :class="item.meta.icon"></i>
        <span>{{ item.meta.title }}</span>
      </template>
      
      <template v-for="child in item.children">
        <!-- 递归调用自身 -->
        <sidebar-item
          v-if="hasChildren(child)"
          :key="child.path"
          :item="child"
          :base-path="resolvePath(child.path)"
        />
        
        <!-- 没有子菜单的子项 -->
        <el-menu-item v-else :key="child.path" :index="resolvePath(child.path)">
          <i v-if="child.meta && child.meta.icon" :class="child.meta.icon"></i>
          <span slot="title">{{ child.meta.title }}</span>
        </el-menu-item>
      </template>
    </el-submenu>
  </div>
</template>

<script>
import path from 'path';

export default {
  name: 'SidebarItem',
  props: {
    item: {
      type: Object,
      required: true,
    },
    basePath: {
      type: String,
      default: '',
    },
  },
  methods: {
    hasChildren(item) {
      return item.children && item.children.length > 0 && !item.meta.hideChildren;
    },
    resolvePath(routePath) {
      if (this.isExternal(routePath)) {
        return routePath;
      }
      return path.resolve(this.basePath, routePath);
    },
    isExternal(path) {
      return /^(https?:|mailto:|tel:)/.test(path);
    },
  },
};
</script>