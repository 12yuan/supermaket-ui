<template>
  <el-form
    ref="passwordForm"
    :model="passwordForm"
    :rules="passwordRules"
    label-width="120px"
    class="password-form"
  >
    <el-form-item label="当前密码" prop="oldPassword">
      <el-input
        v-model="passwordForm.oldPassword"
        type="password"
        placeholder="请输入当前密码"
        show-password
      />
    </el-form-item>
    <el-form-item label="新密码" prop="newPassword">
      <el-input
        v-model="passwordForm.newPassword"
        type="password"
        placeholder="请输入新密码"
        show-password
      />
    </el-form-item>
    <el-form-item label="确认新密码" prop="confirmPassword">
      <el-input
        v-model="passwordForm.confirmPassword"
        type="password"
        placeholder="请再次输入新密码"
        show-password
      />
    </el-form-item>
    <el-form-item>
      <el-button :loading="loading" type="primary" @click="submitForm">修改密码</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { isPassword } from '@/utils/validate';

export default {
  data() {
    // 验证密码强度
    const validatePassword = (rule, value, callback) => {
      if (value && !isPassword(value)) {
        callback(new Error('密码必须包含字母、数字和特殊字符，长度8-20位'));
      } else {
        callback();
      }
    };
    
    // 验证两次密码是否一致
    const validateConfirmPassword = (rule, value, callback) => {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入的密码不一致'));
      } else {
        callback();
      }
    };
    
    return {
      loading: false,
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入当前密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { validator: validatePassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    };
  },
  methods: {
    submitForm() {
      this.$refs.passwordForm.validate(async valid => {
        if (valid) {
          try {
            this.loading = true;
            await this.$store.dispatch('user/changePassword', {
              oldPassword: this.passwordForm.oldPassword,
              newPassword: this.passwordForm.newPassword
            });
            this.$message.success('密码修改成功，请重新登录');
            setTimeout(() => {
              this.$store.dispatch('user/logout');
              this.$router.push('/login');
            }, 1500);
          } catch (error) {
            console.error('修改密码失败:', error);
            this.$message.error(error.message || '修改密码失败，请重试');
          } finally {
            this.loading = false;
          }
        } else {
          return false;
        }
      });
    },
    resetForm() {
      this.$refs.passwordForm.resetFields();
    }
  }
};
</script>

<style lang="scss" scoped>
.password-form {
  max-width: 500px;
  margin: 0 auto;
}
</style>