import store from '@/store';
import $http from '@/config/requestConfig'
import base from '@/config/baseUrl';
// #ifdef H5
import { h5Login } from '@/config/html5Utils';
// #endif
let code = "";
let loginStart = true;
let userInfo = {
	token: ""
};
let lastPageUrl = "";
// 微信小程序登录
function onLogin(type = "judge",callback) {
	//判断登录状态
	if (loginStart) {
		loginStart = false;
		const _this = this;
		let platform;
		// #ifdef MP-WEIXIN
		platform = 'weixin';
		// #endif
		// #ifdef MP-ALIPAY
		platform = 'alipay';
		// #endif
		// #ifdef MP-BAIDU
		platform = 'baidu';
		// #endif
		uni.login({
			provider: platform,
			success: function(loginRes) {
				if (loginRes.errMsg == 'login:ok') {
					// 获取用户信息
					uni.getUserInfo({
						provider: platform,
						success: function(infoRes) {
							let httpData = {
								wxSmallCode: loginRes.code, //小程序code
								iv: infoRes.iv, //小程序加密算法的初始向量
								encryptedData: infoRes.encryptedData //包括敏感数据在内的完整用户信息的加密数据
							};
							// store.state.chatScenesInfo里面是小程序二维码附带的信息
							if(store.state.chatScenesInfo && store.state.chatScenesInfo.invite){
								// 推荐码
								httpData.invite = store.state.chatScenesInfo.invite;
							}
							$http.post('api/open/v1/login', httpData).then(res => {
									loginStart = true;
									store.commit('setUserInfo', res);
									callback && callback();
									if (res.nullUserInfo) {
										// 没有绑定过微信的头像或者昵称弹出授权获取头像昵称的弹窗
										store.commit('setBindUserInfoShow', true);
									} else {
										uni.showToast({
											title: "登录成功"
										});
									}
								}, err => {
									loginStart = true;
								});
						}
					});
				}
			}
		});
	}
}
//判断是否登录（所有端）
function judgeLogin(callback, type = "judge"){
    if(store.state.chatScenesInfo.scene == 1154){
        uni.showToast({
        	title: '请前往小程序使用完整服务',
            icon: "none"
        });
    } else {
        let storeUserInfo = store.state.userInfo;
        if(!storeUserInfo.token){ // nvue页面读取不到vuex里面数据，将取缓存
            storeUserInfo = uni.getStorageSync("userInfo");
        }
        if (type != "force" && storeUserInfo.token) {
            callback();
        } else if (storeUserInfo.token && !storeUserInfo.phone) {
            if (type == "force") {
                uni.navigateTo({
                    url: '/pages/user/bindPhone'
                });
            } else {
                uni.showModal({
                    title: "提示",
                    content: "您还未绑定手机号，请先绑定~",
                    confirmText: "去绑定",
                    cancelText: "再逛会",
                    success: (res) => {
                        if (res.confirm) {
                            uni.navigateTo({
                                url: '/pages/user/bindPhone'
                            });
                        }
                    }
                });
            }
        } else {
            // #ifdef MP
            onLogin(type, callback);
            // #endif
            // #ifdef APP-PLUS
            uni.showModal({
                title: "登录提示",
                content: "此时此刻需要您登录喔~",
                confirmText: "去登录",
                cancelText: "再逛会",
                success: (res) => {
                    if (res.confirm) {
                        uni.navigateTo({
                            url: "/pages/user/login"
                        });
                    }
                }
            });
            // #endif
            // #ifdef H5
            h5Login(type, () => {
                callback();
            });
            // #endif
        }
    }
}
export {
	onLogin,
	judgeLogin
}
