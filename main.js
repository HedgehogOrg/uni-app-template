import { createApp } from "vue"
import App from "./App"
// 数据管理中心
import store from '@/store'
// 工具
import '@/plugins/utils.js';
// 权限配置中心
import base from '@/config/baseUrl'
// 挂载全局http请求
import $http from '@/config/requestConfig'
// 判断是否登录
import { judgeLogin } from '@/config/login';

const app = createApp(App)
app.use(store)
app.config.globalProperties.$base = base;
app.config.globalProperties.$http = $http;
app.config.globalProperties.judgeLogin = judgeLogin;

// #ifdef MP-WEIXIN
// 挂载全局微信分享
import { wxShare } from '@/config/utils'
app.config.globalProperties.wxShare = wxShare;
// #endif

// #ifdef H5
// 微信SDK
import '@/plugins/wxJsSDK.js';
// #endif

app.mount('#app')