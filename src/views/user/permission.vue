<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="权限名称/标识"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter="handleFilter"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
      >
        添加
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      border
      fit
      highlight-current-row
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column label="ID" align="center" width="80">
        <template #default="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="权限名称" min-width="120px">
        <template #default="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="权限标识" min-width="120px">
        <template #default="{ row }">
          <el-tag>{{ row.code }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="类型" width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="row.type === 'menu' ? 'primary' : row.type === 'button' ? 'success' : 'info'">
            {{ row.type === 'menu' ? '菜单' : row.type === 'button' ? '按钮' : '接口' }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="路径" min-width="150px">
        <template #default="{ row }">
          <span>{{ row.path || '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="图标" width="80" align="center">
        <template #default="{ row }">
          <i v-if="row.icon" :class="row.icon"></i>
          <span v-else>-</span>
        </template>
      </el-table-column>

      <el-table-column label="排序" width="80" align="center">
        <template #default="{ row }">
          <span>{{ row.sort }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template #default="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="success" size="mini" @click="handleAddChild(row)">
            添加子项
          </el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item v-if="temp.parentId !== null" label="父级">
          <el-input v-model="parentName" disabled />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="标识" prop="code">
          <el-input v-model="temp.code" />
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" class="filter-item" style="width: 100%">
            <el-option label="菜单" value="menu" />
            <el-option label="按钮" value="button" />
            <el-option label="接口" value="api" />
          </el-select>
        </el-form-item>
        <el-form-item v-if="temp.type === 'menu'" label="路径" prop="path">
          <el-input v-model="temp.path" placeholder="/example/list" />
        </el-form-item>
        <el-form-item v-if="temp.type === 'menu'" label="组件" prop="component">
          <el-input v-model="temp.component" placeholder="example/index" />
        </el-form-item>
        <el-form-item v-if="temp.type === 'menu'" label="图标">
          <el-input v-model="temp.icon" placeholder="el-icon-user" />
        </el-form-item>
        <el-form-item label="排序">
          <el-input-number v-model="temp.sort" :min="0" :max="999" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          确认
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getPermissions, createPermission, updatePermission, deletePermission } from '@/api/user';

export default {
  name: 'Permission',
  data() {
    return {
      list: [],
      listLoading: true,
      listQuery: {
        keyword: undefined
      },
      temp: {
        id: undefined,
        name: '',
        code: '',
        type: 'menu',
        path: '',
        component: '',
        icon: '',
        parentId: null,
        sort: 0
      },
      parentName: '',
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑权限',
        create: '添加权限',
        createChild: '添加子权限'
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }],
        type: [{ required: true, message: '权限类型不能为空', trigger: 'change' }],
        path: [{ required: true, message: '路径不能为空', trigger: 'blur' }],
        component: [{ required: true, message: '组件不能为空', trigger: 'blur' }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getPermissions(this.listQuery).then(response => {
        this.list = this.formatPermissionTree(response.data);
        this.listLoading = false;
      }).catch(() => {
        this.listLoading = false;
      });
    },
    formatPermissionTree(permissions) {
      // 这里假设后端返回的权限数据已经是树形结构
      // 如果不是，需要自行处理成树形结构
      return permissions;
    },
    handleFilter() {
      this.getList();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        code: '',
        type: 'menu',
        path: '',
        component: '',
        icon: '',
        parentId: null,
        sort: 0
      };
      this.parentName = '';
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    handleAddChild(row) {
      this.resetTemp();
      this.temp.parentId = row.id;
      this.parentName = row.name;
      this.dialogStatus = 'createChild';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createPermission(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: '成功',
              message: '创建权限成功',
              type: 'success',
              duration: 2000
            });
            this.getList();
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row);
      if (row.parentId) {
        // 查找父级名称
        const findParent = (list, parentId) => {
          for (const item of list) {
            if (item.id === parentId) {
              return item.name;
            }
            if (item.children && item.children.length > 0) {
              const name = findParent(item.children, parentId);
              if (name) return name;
            }
          }
          return '';
        };
        this.parentName = findParent(this.list, row.parentId);
      }
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          updatePermission(tempData).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: '成功',
              message: '更新权限成功',
              type: 'success',
              duration: 2000
            });
            this.getList();
          });
        }
      });
    },
    handleDelete(row) {
      // 检查是否有子权限
      if (row.children && row.children.length > 0) {
        this.$message({
          message: '该权限下有子权限，无法直接删除',
          type: 'warning'
        });
        return;
      }
      
      this.$confirm('确认删除该权限吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deletePermission(row.id).then(() => {
          this.$notify({
            title: '成功',
            message: '删除成功',
            type: 'success',
            duration: 2000
          });
          this.getList();
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}
</style>
