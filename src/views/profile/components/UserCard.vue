<template>
  <el-card style="margin-bottom:20px;">
    <div slot="header" class="clearfix">
      <span>关于我</span>
    </div>

    <div class="user-profile">
      <div class="box-center">
        <div class="avatar-wrapper">
          <img :src="user.avatar || defaultAvatar" class="user-avatar">
        </div>
        <div class="box-center">
          <div class="user-name text-center">{{ user.name }}</div>
          <div class="user-role text-center text-muted">
            {{ roleNames[user.role] || user.role }}
          </div>
        </div>
      </div>

      <div class="box-center">
        <table class="user-info">
          <tr>
            <td><span class="user-info-label">用户ID:</span></td>
            <td>{{ user.id }}</td>
          </tr>
          <tr>
            <td><span class="user-info-label">账号:</span></td>
            <td>{{ user.username }}</td>
          </tr>
          <tr>
            <td><span class="user-info-label">邮箱:</span></td>
            <td>{{ user.email }}</td>
          </tr>
          <tr>
            <td><span class="user-info-label">手机:</span></td>
            <td>{{ user.phone || '未设置' }}</td>
          </tr>
          <tr>
            <td><span class="user-info-label">注册时间:</span></td>
            <td>{{ formatDate(user.createdAt) }}</td>
          </tr>
        </table>
      </div>
    </div>
  </el-card>
</template>

<script>
import defaultAvatar from '@/assets/avatar/default.jpg';

export default {
  props: {
    user: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      defaultAvatar,
      roleNames: {
        admin: '管理员',
        customer: '客户'
      }
    };
  },
  methods: {
    formatDate(date) {
      if (!date) return '未知';
      return new Date(date).toLocaleString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.box-center {
  margin: 0 auto;
  display: table;
}

.text-muted {
  color: #777;
}

.user-profile {
  .user-name {
    font-weight: bold;
    font-size: 18px;
    margin: 10px 0;
  }

  .box-center {
    padding-top: 10px;
  }

  .user-role {
    padding-top: 10px;
    font-weight: 400;
  }

  .avatar-wrapper {
    text-align: center;
    margin-bottom: 20px;

    .user-avatar {
      width: 100px;
      height: 100px;
      border-radius: 50%;
    }
  }

  .user-info {
    margin: 15px 0;
    color: rgba(0, 0, 0, 0.65);
    font-size: 14px;
    
    .user-info-label {
      margin-right: 8px;
      font-weight: 500;
    }
    
    td {
      padding: 8px 0;
    }
  }
}
</style>