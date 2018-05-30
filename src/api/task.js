import fetch from '../libs/fetch.js';

//获取作业列表数据
export function noticeData (params) {
  return fetch({
    url: '/app/sndnotice/queryhistory_notice?'+'mschool_id='+params.mschool_id+'&mdriver_id='+params.mdriver_id+'&mtype_id='+params.mtype_id+'&sdate='+params.sdate+'&edate='+params.edate,
    method: 'get',
  });
}

//保存作业消息
export function saveNotice (noticeInfo) {
  return fetch({
    url:'/app/sndnotice/add_notice',
    method:'post',
    data:noticeInfo
  })
}

//发送作业消息
export function sendNotice (sendinfo) {
  return fetch({
    url:'/app/sndnotice/sndwx_notice',
    method:'post',
    data:sendinfo
  })
}

//获取作业详情
export function getNotice (mnotice_id) {
  return fetch({
    url:'/app/sndnotice/query_school_notice?mnotice_id='+mnotice_id,
    method:'get',
  })
}






