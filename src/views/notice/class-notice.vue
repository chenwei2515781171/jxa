<style lang="less">
    @import "./notice.less";
</style>
<template>
  <div class="content">
      <h2>班级通知</h2>
      <Button type="primary" shape="circle" @click="add_notice">+&nbsp;添加通知</Button>
      <div class="list">
            <Table border :columns="columns1" :loading="loading" :data="table_data"></Table>
            <div style="margin: 10px;overflow: hidden">
                <div style="float: right;">
                    <Page :total="datacount" :current="1" :pageSize="pageSize" show-total show-elevator @on-change="changePage"></Page>
                </div>
            </div>
      </div>
  </div>
</template>
<script>
import { noticeData } from '@/api/notice.js';
export default {
    data () {
        return {
            loading: true,
            notice_data: [],
            table_data:[],
            datacount:0,
            pageSize:10,
            page:1,
            columns1: [
                {
                    title: '通知ID',
                    key: 'notice_id',
                    width: 120,
                    align: 'center',
                },
                {
                    title: '标题',
                    key: 'notice_title',
                    align: 'center',
                },
                {
                    title: '发布状态',
                    key: 'is_pub',
                    width: 230,
                    align: 'center',
                    render:(h,params)=>{
                        if(this.notice_data[params.index].is_pub){
                            return h('div', [
                                h('span',{
                                    style:{
                                        color:'#32CD32'
                                    },
                                },'已发送'),
                            ]);
                        }else{
                            return h('div', [
                                h('span',{
                                    style:{
                                        color:'#F08080'
                                    },
                                },'未发送'),
                            ]);
                        }
                    }
                },
                {
                    title: '发布时间',
                    key: 'pub_date',
                    width: 230,
                    align: 'center',
                },
                {
                    title: '操作',
                    width: 230,
                    align: 'center',
                    render: (h, params) => {
                        return h('div', [
                            h('Button', {
                                props: {
                                    type: 'primary',
                                    size: 'small'
                                },
                                style: {
                                    marginRight: '5px'
                                },
                                on: {
                                    click: () => {
                                        let argu = { notice_id: params.row.notice_id };
                                        this.$router.push({
                                            name: 'edit_notice',
                                            params: argu
                                        });
                                    }
                                }
                            }, '详情'),
                            h('Button', {
                                props: {
                                    type: 'error',
                                    size: 'small'
                                },
                                on: {
                                    click: () => {
                                        this.remove(params.index)
                                    }
                                }
                            }, '删除')
                        ]);
                    }
                },
            ],
            
        }
    },
    created(){
        let sdate='2017-01-01';
        let date=new Date();            
        let edate=date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
        let params={};
        params.mschool_id=sessionStorage.getItem('school_id');
        params.mdriver_id=sessionStorage.getItem('driver_id');
        params.mtype_id=2;
        params.sdate=sdate;
        params.edate=edate;
        //获取通知历史数据
        noticeData(params).then(res=>{
            this.loading=false;
            this.notice_data=res.querylist;
            this.datacount=res.querylist.length;
            //分页
            if(this.datacount<this.pageSize){
                this.table_data=res.querylist;
            }else{
                this.table_data=res.querylist.slice(0,this.pageSize)
            } 
            if(sessionStorage.getItem('notice_page')){
                this.page=parseInt(sessionStorage.getItem('notice_page'));
            }
            let start=(this.page-1)*this.pageSize;
            let end=this.page*this.pageSize;
            this.table_data=res.querylist.slice(start,end);  
        })  
    },
    methods:{
        //页面切换
        changePage (page) {
            let start=(page-1)*this.pageSize;
            let end=page*this.pageSize;
            this.table_data=this.notice_data.slice(start,end);
        },
        //添加班级通知
        add_notice () {
            this.$router.push({
                name:"edit_notice"
            })
        },
        //跳转到消息详情页
        show(){

        }


    }

}
</script>

