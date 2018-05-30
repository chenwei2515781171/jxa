<style lang="less">
    @import "../notice/notice.less";
    @import '../../styles/loading.less';
</style>
<template>
  <div class="content">
        <h2>作业编辑</h2>
        <Row>
            <Col span="8">
                <div class="left">
                    <h3>作业标题</h3>
                    <Input v-model="mtitle" placeholder="请输入标题" style="width: 300px"></Input>
                    <h3 style="margin-top:30px">所属科目</h3>
                    <h3>{{subject_name}}</h3>
                    <br>
                    <Button type="primary" shape="circle" icon="android-cloud-done" @click="save">保存</Button>
                    <Button type="success" shape="circle" icon="android-send"  @click="send">发送</Button>
                </div>
            </Col>
            <Col span="13" offset="1">
                <div class="right">
                    <script id="editor" type="text/plain"></script>
                </div>
            </Col>
        </Row>
  </div>
</template>
<style type="text/css">
  #editor{min-height:440px;width: 100%;}
</style>
<script>
import $ from 'jquery'
import ready from 'jquery'
import $notify from '../../../static/js/jquery-1.10.2.min.js'
import '../../../static/UE/ueditor.config.js'
import '../../../static/UE/ueditor.all.js'
import '../../../static/UE/lang/zh-cn/zh-cn.js'
import { saveNotice , getNotice , sendNotice} from '@/api/task.js';
export default {
    data(){
        return {
            subject_name:'',
            mstu_type:'',
            spinShow: true,
            mtitle:'',
            editor_content:'',
            mnotice_id:'',
            class_list:[],
            subject_name:'',

        }
    },
    created:function(){
        //获取班级列表
        this.class_list=JSON.parse(sessionStorage.getItem('class_list'));
        this.subject_name=sessionStorage.getItem('subject_name');
    },
    mounted () {
        //判断是否为新通知
        if(this.$route.params.notice_id){
            let mnotice_id=this.$route.params.notice_id;
            this.mnotice_id=mnotice_id;
            getNotice(mnotice_id).then(res=>{
                this.mtitle=res.queryinfo[0].notice_title;
                this.mstu_type=res.queryinfo[0].type_name;
                this.editor_content= res.queryinfo[0].content_html;
                this.init();
            })
        }else{
            this.init();
        };
    },
    methods: {
        //加载文本编辑器
        init () {
            const _this = this;
            this.editor = UE.getEditor('editor', this.config); // 初始化UE
            this.editor.addListener("ready", function () {
                if(_this.editor_content!==''){
                     _this.editor.setContent(_this.editor_content); // 确保UE加载完成后，放入内容。
                }
            });
        },
        //保存
        save(){
            let noticeInfo={};
            noticeInfo.mschool_id=sessionStorage.getItem('school_id');
            noticeInfo.mdriver_id=sessionStorage.getItem('driver_id');
            noticeInfo.mtype_id=3;
            noticeInfo.msubject_id=3;
            noticeInfo.mtitle=this.mtitle;
            noticeInfo.mcontent=this.editor.getContent().replace(/<[^>]+>/g,"");
            noticeInfo.mhtmlcontent=this.editor.getContent();
            noticeInfo.mnotice_id=this.mnotice_id;
            saveNotice(noticeInfo).then(res=>{
                if(res.issave==1){
                    this.success();
                    this.$router.push({
                        name:"task-list"
                    });
                }else{
                    console.log("保存失败！");
                    this.$Message.error('保存失败！');
                }
                
            })
        },
        send(){
            //保存
            let noticeInfo={};
            noticeInfo.mschool_id=sessionStorage.getItem('school_id');
            noticeInfo.mdriver_id=sessionStorage.getItem('driver_id');
            noticeInfo.mtype_id=3;
            noticeInfo.msubject_id=3;
            noticeInfo.mtitle=this.mtitle;
            noticeInfo.mcontent=this.editor.getContent().replace(/<[^>]+>/g,"");
            noticeInfo.mhtmlcontent=this.editor.getContent();
            noticeInfo.mnotice_id=this.mnotice_id;
            saveNotice(noticeInfo).then(res=>{
                if(res.issave==1){
                    //发送
                    let sendinfo={};
                    sendinfo.mnotice_id=res.notice_id;
                    sendinfo.mschool_id=sessionStorage.getItem('school_id');
                    sendinfo.mclass_list=sessionStorage.getItem('header_class');
                    sendNotice(sendinfo).then(res=>{
                        if(res.is_pub_state.is_pub==1){
                            this.$Message.success({
                                content:'发送成功！',
                                duration:5
                            });
                            this.$router.push({
                                name:"task-list"
                            });
                        }else{
                            this.$Message.error('发送失败！');
                        }
                    })
                }else{
                    this.$Message.error('保存失败！');
                }
                
            })
        },
        //保存成功
        success () {
            this.$Message.success({
                content:'保存成功！',
                duration:5
            });
        },
        //保存失败
        error () {
            this.$Message.success({
                content:'保存失败！',
                duration: 3
            });
        }
    },
    destroyed () {
        this.editor.destroy();
    }
}
</script>

