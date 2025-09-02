<template>
  <el-form
    ref="form"
    :model="userForm"
    :rules="rules"
    label-width="80px"
    class="user-form"
  >
    <el-form-item label="用户名" prop="username">
      <el-input v-model="userForm.username" disabled />
    </el-form-item>
    <el-form-item label="姓名" prop="name">
      <el-input v-model="userForm.name" />
    </el-form-item>
    <el-form-item label="邮箱" prop="email">
      <el-input v-model="userForm.email" />
    </el-form-item>
    <el-form-item label="手机" prop="phone">
      <el-input v-model="userForm.phone" />
    </el-form-item>
    <el-form-item label="头像">
      <el-upload
        class="avatar-uploader"
        action="/api/user/avatar"
        :headers="uploadHeaders"
        :show-file-list="false"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
      >
        <img v-if="userForm.avatar" :src="userForm.avatar" class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="submitForm">保存</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { mapGetters } from 'vuex';
import { isEmail, isPhone } from '@/utils/validate';

export default {
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    // 验证邮箱
    const validateEmail = (rule, value, callback) => {
      if (value && !isEmail(value)) {
        callback(new Error('请输入正确的邮箱地址'));
      } else {
        callback();
      }
    };
    
    // 验证手机号
    const validatePhone = (rule, value, callback) => {
      if (value && !isPhone(value)) {
        callback(new Error('请输入正确的手机号'));
      } else {
        callback();
      }
    };
    
    return {
      userForm: {
        id: '',
        username: '',
        name: '',
        email: '',
        phone: '',
        avatar: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        phone: [
          { validator: validatePhone, trigger: 'blur' }
        ]
      }
    };
  },
  computed: {
    ...mapGetters([
      'token'
    ]),
    uploadHeaders() {
      return {
        Authorization: `Bearer ${this.token}`
      };
    }
  },
  created() {
    if (this.user) {
      this.userForm = { ...this.user };
    }
  },
  methods: {
    submitForm() {
      this.$refs.form.validate(async valid => {
        if (valid) {
          try {
            this.$store.dispatch('setLoading', true);
            await this.$store.dispatch('user/updateProfile', this.userForm);
            this.$message.success('个人信息更新成功');
          } catch (error) {
            console.error('更新个人信息失败:', error);
            this.$message.error('更新个人信息失败，请重试');
          } finally {
            this.$store.dispatch('setLoading', false);
          }
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.userForm = { ...this.user };
    },
    handleAvatarSuccess(res, file) {
      if (res.code === 200) {
        this.userForm.avatar = res.data.url;
        this.$message.success('头像上传成功');
      } else {
        this.$message.error(res.message || '头像上传失败');
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

<style lang="scss" scoped>
.user-form {
  max-width: 600px;
  margin: 0 auto;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  width: 178px;
  height: 178px;
  display: inline-block;
  
  &:hover {
    border-color: #409EFF;
  }
  
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
}
</style>