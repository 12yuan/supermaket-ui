import axios from 'axios';
import { Message, MessageBox } from 'element-ui';
import store from '@/store';
import router from '@/router';

// 创建axios实例
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || '/api', // url = base url + request url
  timeout: 15000 // 请求超时时间
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    if (store.getters.token) {
      // 让每个请求携带token
      config.headers['Authorization'] = `Bearer ${store.getters.token}`;
    }
    return config;
  },
  error => {
    // 处理请求错误
    console.log(error); // for debug
    return Promise.reject(error);
  }
);

// 响应拦截器
service.interceptors.response.use(
  /**
   * 如果您想获取http信息，如头信息或状态信息
   * 请返回 response => response
  */

  /**
   * 通过自定义代码确定请求状态
   * 这里只是一个例子
   * 您也可以通过HTTP状态码来判断状态
   */
  response => {
    const res = response.data;

    // 如果自定义代码不是200，则判断为错误
    if (res.code !== 200) {
      Message({
        message: res.message || '错误',
        type: 'error',
        duration: 5 * 1000
      });

      // 401: 未登录或token过期
      // 403: 权限不足
      if (res.code === 401 || res.code === 403) {
        // 重新登录
        MessageBox.confirm('您已登出，您可以取消以停留在此页面，或重新登录', '确认登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('auth/resetToken').then(() => {
            // 为了重新实例化vue-router对象，避免bug
            location.reload();
          });
        });
      }
      return Promise.reject(new Error(res.message || '错误'));
    } else {
      return res;
    }
  },
  error => {
    console.log('err' + error); // for debug
    const { response } = error;
    if (response && response.status) {
      switch (response.status) {
        case 401:
          // 未授权，登录过期，需要重新登录
          store.dispatch('auth/resetToken');
          router.push('/login');
          break;
        case 403:
          // 权限不足
          router.push('/403');
          break;
        case 404:
          // 请求不存在
          router.push('/404');
          break;
        case 500:
          // 服务器错误
          router.push('/500');
          break;
        default:
          Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
          });
      }
    } else {
      Message({
        message: '网络错误，请检查您的网络连接',
        type: 'error',
        duration: 5 * 1000
      });
    }
    return Promise.reject(error);
  }
);

export default service;