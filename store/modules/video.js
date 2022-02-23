export default {
	state: () => ({
		videoPlayId: ""
	}),
	mutations: {
	  setVideoPlayId(state, data){
			state.videoPlayId = data;
	  }
	}
}