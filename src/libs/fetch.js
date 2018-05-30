import axios from 'axios';
import qs from 'qs';
import Vue from 'vue';

//获取服务器IP地址端口
let remoteip=sessionStorage.getItem('remoteip');
let remoteport=sessionStorage.getItem('remoteport');
let baseurl='http://'+remoteip+':'+remoteport;
let service = axios.create({ 
  // 已经是一个promise 了
  baseURL: baseurl,
  timeout: 30000
});

// POST传参序列化(添加请求拦截器)
service.interceptors.request.use(
  config => {
    // 在发送请求之前做某件事
    if (
      config.method === 'get' || 'post' || 'put' || 'delete'
    ) {
      // 序列化
      config.data = qs.stringify(config.data);
    }
    // 若是有做鉴权token , 就给头部带上token
    if (localStorage.token) {
      config.headers.Authorization = localStorage.token;
    }
    return config;
  },
  error => {
    return Promise.reject(error.data.error.message);
  }
);

service.interceptors.response.use(function (response) {
  return response.data;
}, function (error) {
  return Promise.reject(error);
});

Vue.prototype.ajax = service;
export default service;
