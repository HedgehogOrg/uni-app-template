import { createStore } from 'vuex'
import user from './modules/user.js'
import order from './modules/order.js'
import video from './modules/video.js'

//缓存浏览器的数据名称(子模块如：user.userInfo)
const cacheNameList = ["user.userInfo", "webViewUrl"];
let clearTime;

const store = createStore({
	state: () => ({
		//webView地址
		webViewUrl: "",
		loadingShow: false,
		//微信场景参数
		chatScenesInfo: {},
		//绑定微信头像昵称弹窗状态
		bindUserInfoShow: false,
		//当前位置
		currentAddress: {
			areaName: "请选择",
			areaId: ''
		},
	}),
	getters: {},
	mutations: {
	  //取出缓存数据（打开APP就取出）
	  setCacheData(state) {
	  	for (let name of cacheNameList) {
				let data;
				let modules = name.split('.');
				[name] = modules.splice(-1);
	  		// #ifndef H5
	  		data = uni.getStorageSync(name);
	  		// #endif
	  		// #ifdef H5
	  		data = sessionStorage.getItem(name) || localStorage.getItem(name);
	  		// #endif
	  		if (data) {
	  			// #ifdef H5
	  			try {
	  				data = JSON.parse(data);
	  			} catch (e) {
	  			}
	  			// #endif
					let tmpState = state
					modules.forEach(module => {
						tmpState = tmpState[module]
					})
	  			tmpState[name] = data;
	  		}
	  	}
	  },
	  //WebView地址
	  setWebViewUrl(state, data) {
	  	if (data) {
	  		state.webViewUrl = data;
	  		// #ifdef H5
	  		window.sessionStorage.setItem('webViewUrl', data);
	  		// #endif
	  	}
	  },
	  //数据加载状态
	  setLoadingShow(state, data) {
	  	if(state.loadingShow){
	  		if(data){
	  			clearTime && clearTimeout(clearTime);
	  			clearTime = setTimeout(function(){
	  				state.loadingShow = false;
	  			},5000);
	  		} else {
	  			clearTime && clearTimeout(clearTime);
	  			clearTime = setTimeout(function(){
	  				state.loadingShow = false;
	  			},50);
	  		}
	  	} else {
	  		state.loadingShow = data;
	  	}
	  },
	  //微信场景参数
	  setChatScenesInfo(state, data) {
	  	if (data) {
	  		state.chatScenesInfo = Object.assign({}, state.chatScenesInfo, data);
	  	}
	  },
	  //绑定微信头像昵称弹窗状态
	  setBindUserInfoShow(state, data) {
	  	state.bindUserInfoShow = data;
	  },
	  //当前地址
	  setCurrentAddress(state, data) {
	  	if (data) {
	  		state.currentAddress = Object.assign(state.currentAddress, data);
	  		let addressInfo = {
	  			"provinceId": state.currentAddress.provinceId,
	  			"provinceName": state.currentAddress.provinceName,
	  			"cityId": state.currentAddress.cityId,
	  			"cityName": state.currentAddress.cityName,
	  			"areaId": state.currentAddress.areaId,
	  			"areaName": state.currentAddress.areaName,
	  		};
	  		uni.setStorageSync('currentAddress', addressInfo);
	  	}
	  }
	},
	actions: {},
	modules: {
		user,
		order,
		video
	}
})
export default store;

