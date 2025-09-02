<template>
  <div class="errPage-container">
    <el-row>
      <el-col :span="12">
        <h1 class="text-jumbo text-ginormous">401</h1>
        <h2>您没有权限访问该页面</h2>
        <h6>抱歉，您没有访问权限</h6>
        <ul class="list-unstyled">
          <li>或者您可以去:</li>
          <li class="link-type">
            <router-link to="/dashboard">
              回到首页
            </router-link>
          </li>
          <li class="link-type">
            <a href="javascript:void(0)" @click="back">返回上一页</a>
          </li>
        </ul>
      </el-col>
      <el-col :span="12">
        <img :src="errGif" width="313" height="428" alt="Girl has dropped her ice cream.">
      </el-col>
    </el-row>
  </div>
</template>

<script>
import errGif from '@/assets/401_images/401.gif';

export default {
  name: 'Page401',
  data() {
    return {
      errGif: errGif + '?' + +new Date()
    };
  },
  methods: {
    back() {
      if (this.$route.query.noGoBack) {
        this.$router.push({ path: '/dashboard' });
      } else {
        this.$router.go(-1);
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.errPage-container {
  width: 800px;
  max-width: 100%;
  margin: 100px auto;
  .text-jumbo {
    font-size: 60px;
    font-weight: 700;
    color: #484848;
  }
  .text-ginormous {
    font-size: 100px;
    line-height: 1;
  }
  .list-unstyled {
    font-size: 14px;
    li {
      padding-bottom: 5px;
    }
    a {
      color: #008489;
      text-decoration: none;
      &:hover {
        text-decoration: underline;
      }
    }
  }
  .link-type {
    color: #337ab7;
    cursor: pointer;
    &:hover {
      color: rgb(32, 160, 255);
    }
  }
}
</style>