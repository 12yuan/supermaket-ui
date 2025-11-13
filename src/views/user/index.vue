<template>
  <div class="user-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="请输入用户名/邮箱"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter="handleFilter"
      />
      <el-select v-model="listQuery.role" placeholder="用户角色" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.status" placeholder="用户状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">添加用户</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column align="center" label="ID" width="80">
        <template #default="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="100" align="center" label="头像">
        <template #default="{ row }">
          <el-avatar :src="row.avatar || defaultAvatar" :size="40"></el-avatar>
        </template>
      </el-table-column>
      
      <el-table-column width="150" label="用户名">
        <template #default="{ row }">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="150" label="姓名">
        <template #default="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="200" label="邮箱">
        <template #default="{ row }">
          <span>{{ row.email }}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="120" align="center" label="角色">
        <template #default="{ row }">
          <el-tag :type="row.role === 'admin' ? 'danger' : 'primary'">
            {{ row.role === 'admin' ? '管理员' : '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column width="100" align="center" label="状态">
        <template #default="{ row }">
          <el-tag :type="row.status === 1 ? 'success' : 'info'">
            {{ row.status === 1 ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column width="180" align="center" label="创建时间">
        <template #default="{ row }">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="200" align="center" label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button 
            v-if="row.status === 0" 
            size="mini" 
            type="success" 
            @click="handleModifyStatus(row, 1)"
          >启用</el-button>
          <el-button 
            v-else 
            size="mini" 
            type="info" 
            @click="handleModifyStatus(row, 0)"
          >禁用</el-button>
          <el-button 
            v-if="row.id !== currentUserId" 
            size="mini" 
            type="danger" 
            @click="handleDelete(row)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="listQuery.page"
      v-model:limit="listQuery.limit"
      @pagination="getList"
    />

    <!-- 添加或修改用户对话框 -->
    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 90%; margin-left: 50px;"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" :disabled="dialogStatus === 'update'" placeholder="请输入用户名" />
        </el-form-item>
        
        <el-form-item label="姓名" prop="name">
          <el-input v-model="temp.name" placeholder="请输入姓名" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="temp.email" placeholder="请输入邮箱" />
        </el-form-item>
        
        <el-form-item label="密码" prop="password" v-if="dialogStatus === 'create'">
          <el-input v-model="temp.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword" v-if="dialogStatus === 'create'">
          <el-input v-model="temp.confirmPassword" type="password" placeholder="请确认密码" />
        </el-form-item>
        
        <el-form-item label="角色" prop="role">
          <el-select v-model="temp.role" placeholder="请选择角色">
            <el-option
              v-for="item in roleOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        
        <el-form-item label="头像">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="temp.avatar" :src="temp.avatar" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="temp.status">
            <el-radio :label="1">启用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Pagination from '@/components/Pagination';

export default {
  name: 'UserList',
  components: { Pagination },
  data() {
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码长度不能小于6位'));
      } else {
        callback();
      }
    };
    
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.temp.password) {
        callback(new Error('两次输入密码不一致'));
      } else {
        callback();
      }
    };
    
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: '',
        role: undefined,
        status: undefined
      },
      roleOptions: [
        { label: '管理员', value: 'admin' },
        { label: '普通用户', value: 'user' }
      ],
      statusOptions: [
        { label: '启用', value: 1 },
        { label: '禁用', value: 0 }
      ],
      temp: {
        id: undefined,
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        avatar: '',
        status: 1
      },
      defaultAvatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑用户',
        create: '添加用户'
      },
      rules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        email: [
          { required: true, message: '邮箱不能为空', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ],
        role: [{ required: true, message: '请选择角色', trigger: 'change' }]
      }
    };
  },
  computed: {
    ...mapGetters('auth', ['currentUser']),
    currentUserId() {
      return this.currentUser ? this.currentUser.id : null;
    }
  },
  created() {
    this.getList();
  },
  methods: {
    ...mapActions('user', [
      'fetchUsers',
      'createUser',
      'updateUser',
      'deleteUser',
      'updateUserStatus'
    ]),
    async getList() {
      this.listLoading = true;
      try {
        const { data, total } = await this.fetchUsers(this.listQuery);
        this.list = data;
        this.total = total;
      } catch (error) {
        this.$message.error('获取用户列表失败');
      } finally {
        this.listLoading = false;
      }
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        username: '',
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        avatar: '',
        status: 1
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
    handleUpdate(row) {
      this.temp = Object.assign({}, row);
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    async createData() {
      this.$refs['dataForm'].validate(async valid => {
        if (valid) {
          const { confirmPassword, ...userData } = this.temp;
          try {
            await this.createUser(userData);
            this.dialogFormVisible = false;
            this.$message.success('创建成功');
            this.getList();
          } catch (error) {
            this.$message.error('创建失败');
          }
        }
      });
    },
    async updateData() {
      this.$refs['dataForm'].validate(async valid => {
        if (valid) {
          const { confirmPassword, ...userData } = this.temp;
          try {
            await this.updateUser(userData);
            this.dialogFormVisible = false;
            this.$message.success('更新成功');
            this.getList();
          } catch (error) {
            this.$message.error('更新失败');
          }
        }
      });
    },
    async handleDelete(row) {
      this.$confirm('确认删除该用户吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await this.deleteUser(row.id);
          this.$message.success('删除成功');
          this.getList();
        } catch (error) {
          this.$message.error('删除失败');
        }
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    async handleModifyStatus(row, status) {
      try {
        await this.updateUserStatus({
          id: row.id,
          status
        });
        this.$message.success(`用户已${status === 1 ? '启用' : '禁用'}`);
        this.getList();
      } catch (error) {
        this.$message.error(`${status === 1 ? '启用' : '禁用'}失败`);
      }
    },
    handleAvatarSuccess(res, file) {
      if (res.code === 200) {
        this.temp.avatar = res.data;
      } else {
        this.$message.error('上传失败');
      }
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style scoped>
.user-container {
  padding: 20px;
}

.filter-container {
  padding-bottom: 10px;
}

.filter-item {
  margin-right: 10px;
  margin-bottom: 10px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
