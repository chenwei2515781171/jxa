<style lang="less">
    @import './login.less';
</style>

<template>
    <div class="login" @keydown.enter="handleSubmit">
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="userName">
                            <Input v-model="form.username" placeholder="请输入用户名">
                                <span slot="prepend">
                                    <Icon :size="16" type="person"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                                <span slot="prepend">
                                    <Icon :size="14" type="locked"></Icon>
                                </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">{{ show }}</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import { linkLogin } from '@/api/login.js';
import md5 from '../libs/md5.min.js';
import Cookies from 'js-cookie';
export default {
    data () {
        return {
            show:'请输入用户名和密码',
            form: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
      handleSubmit() {
        this.$refs.loginForm.validate((valid) => {
          if(valid) {
            //清空标签页
            this.$store.commit('clearAllTags');
            let userInfo = {};
            userInfo.rmobile = this.form.username;
            userInfo.rpassmd5 = md5(this.form.password);
            //获取登录链接及token
            linkLogin(userInfo).then(res => {
              let data=res.data;
              if(data.ret){
                //保存服务器ip以及端口
                let remoteip=data.remoteip;
                let remoteport=data.remoteport;
                sessionStorage.setItem('remoteip',remoteip);
                sessionStorage.setItem('remoteport',remoteport);
                //获取token以及rhashmd5
                let token=data.token;
                let rhashmd5=userInfo.rpassmd5+token;
                var router=this.$router;
                //登录服务器
                let url='http://'+remoteip+':'+remoteport;
                var axios = require('axios');
                axios({
                  method: 'post',
                  url: '/app/index/post_md5hash_info',
                  data: {rmobile:userInfo.rmobile,rhashmd5:rhashmd5},
                  baseURL: url,
                }).then(function (res) {
                  //保存登录状态
                  var isCorrect=res.data.isCorrect;
                  let driverinfo=res.data.driverinfo;
                  //是否登录
                  sessionStorage.setItem('isCorrect',isCorrect);
                  //用户id
                  sessionStorage.setItem('driver_id',driverinfo[0].driver_id);
                  //用户姓名
                  sessionStorage.setItem('driver_name',driverinfo[0].driver_name);
                  //用户手机
                  sessionStorage.setItem('driver_mobile',driverinfo[0].driver_mobile);
                  //学校名称
                  sessionStorage.setItem('school_name',driverinfo[0].school_name);
                  //用户类型
                  sessionStorage.setItem('type_name',driverinfo[0].type_name);
                  //获取用户详细信息
                  let mdriver_id = driverinfo[0].driver_id;
                  axios({
                    method: 'get',
                    url: '/app/sndnotice/pcindex?mdriver_id='+mdriver_id,
                    baseURL: url,
                  }).then(function (res) {
                    //学校id
                    sessionStorage.setItem('school_id',res.data.school_id);
                    //科目id
                    sessionStorage.setItem('subject_id',res.data.subject_id);
                    //科目名称
                    sessionStorage.setItem('subject_name',res.data.subject_name);
                    //班级列表
                    let class_list = JSON.stringify(res.data.class_list);
                    sessionStorage.setItem('class_list',class_list);
                    //班主任班级
                    if(res.data.class_list[0].is_header){
                      let header_class = res.data.class_list[0].class_id;
                      sessionStorage.setItem('header_class',header_class);
                    }
                    //通知类型列表
                    let infotype_list = JSON.stringify(res.data.infotype_list);
                    sessionStorage.setItem('infotype_list',infotype_list);
                  }).catch(function (errmsg) {
                    console.log(errmsg);
                  });
                  //根据用户类型设置权限cookies
                  let type_name=driverinfo[0].type_name;
                  if(type_name=='学校管理员'){
                    Cookies.set('access', 1);
                  };
                  if(type_name=='班主任教师'){
                    Cookies.set('access', 2);
                  };
                  //跳转页面
                  router.push({
                      name:'home_index'
                    });
                })
              }
            })
          }
        })
      }
    }
};
</script>

<style>

</style>
