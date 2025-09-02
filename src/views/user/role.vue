<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="角色名称/标识"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
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
    >
      <el-table-column label="ID" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色名称" min-width="120px">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>

      <el-table-column label="角色标识" min-width="120px">
        <template slot-scope="{row}">
          <el-tag>{{ row.code }}</el-tag>
        </template>
      </el-table-column>

      <el-table-column label="描述" min-width="200px">
        <template slot-scope="{row}">
          <span>{{ row.description || '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="创建时间" width="180" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createdAt | parseTime }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="info" size="mini" @click="handlePermission(row)">
            权限设置
          </el-button>
          <el-button v-if="row.code !== 'admin'" size="mini" type="danger" @click="handleDelete(row)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="80px"
        style="width: 400px; margin-left:50px;"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="temp.name" />
        </el-form-item>
        <el-form-item label="角色标识" prop="code">
          <el-input v-model="temp.code" :disabled="dialogStatus === 'update'" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input v-model="temp.description" type="textarea" :rows="2" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">
          确认
        </el-button>
      </div>
    </el-dialog>

    <el-dialog title="权限设置" :visible.sync="permissionDialogVisible" width="600px">
      <div v-if="currentRole" class="permission-container">
        <div class="role-info">
          <h3>{{ currentRole.name }}</h3>
          <p>{{ currentRole.description }}</p>
        </div>
        
        <el-tree
          ref="permissionTree"
          :data="permissionTree"
          :props="defaultProps"
          show-checkbox
          node-key="id"
          :default-checked-keys="checkedPermissions"
          :check-strictly="false"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="permissionDialogVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="updatePermissions">
          保存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getRoles, createRole, updateRole, deleteRole, getRolePermissions, updateRolePermissions } from '@/api/user';
import { getPermissions } from '@/api/user';
import Pagination from '@/components/Pagination';

export default {
  name: 'Role',
  components: { Pagination },
  filters: {
    parseTime(time) {
      return time ? new Date(time).toLocaleString() : '';
    }
  },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: undefined
      },
      temp: {
        id: undefined,
        name: '',
        code: '',
        description: ''
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑角色',
        create: '添加角色'
      },
      rules: {
        name: [{ required: true, message: '角色名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '角色标识不能为空', trigger: 'blur' }]
      },
      // 权限相关
      permissionDialogVisible: false,
      currentRole: null,
      permissionTree: [],
      checkedPermissions: [],
      defaultProps: {
        children: 'children',
        label: 'name'
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      getRoles(this.listQuery).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      }).catch(() => {
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        code: '',
        description: ''
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createRole(this.temp).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: '成功',
              message: '创建角色成功',
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
          updateRole(tempData).then(() => {
            this.dialogFormVisible = false;
            this.$notify({
              title: '成功',
              message: '更新角色成功',
              type: 'success',
              duration: 2000
            });
            this.getList();
          });
        }
      });
    },
    handleDelete(row) {
      this.$confirm('确认删除该角色吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteRole(row.id).then(() => {
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
    },
    // 权限相关方法
    handlePermission(row) {
      this.currentRole = row;
      this.permissionDialogVisible = true;
      this.loadPermissionData();
    },
    loadPermissionData() {
      if (!this.currentRole) return;
      
      // 加载权限树
      getPermissions().then(response => {
        this.permissionTree = this.formatPermissionTree(response.data);
      });
      
      // 加载角色已有权限
      getRolePermissions(this.currentRole.id).then(response => {
        this.checkedPermissions = response.data.map(item => item.id);
      });
    },
    formatPermissionTree(permissions) {
      // 这里假设后端返回的权限数据已经是树形结构
      // 如果不是，需要自行处理成树形结构
      return permissions;
    },
    updatePermissions() {
      if (!this.currentRole) return;
      
      const checkedKeys = this.$refs.permissionTree.getCheckedKeys();
      const halfCheckedKeys = this.$refs.permissionTree.getHalfCheckedKeys();
      const permissionIds = [...checkedKeys, ...halfCheckedKeys];
      
      updateRolePermissions({
        roleId: this.currentRole.id,
        permissionIds: permissionIds
      }).then(() => {
        this.permissionDialogVisible = false;
        this.$notify({
          title: '成功',
          message: '权限设置成功',
          type: 'success',
          duration: 2000
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

.permission-container {
  .role-info {
    margin-bottom: 20px;
    padding-bottom: 10px;
    border-bottom: 1px solid #ebeef5;
    
    h3 {
      margin-top: 0;
      margin-bottom: 10px;
    }
    
    p {
      color: #606266;
      margin: 0;
    }
  }
}
</style>