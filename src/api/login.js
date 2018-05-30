import fetch from '../libs/loginfetch.js';
//获取token
export function linkLogin (userInfo) {
  return fetch({
    url: '/home/index/login_app_user',
    method: 'post',
    data: userInfo
  });
}




