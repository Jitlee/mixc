import {
	SET_CLIENT,
	REMOVE_CLIENT
} from '../types'

const state = {
	clientId: 0, // 客户id
	clientName: '', // 客户名称
	clientLogo: '/static/img/client.png', // 客户logo
	defaultBuildId: 0,
	defaultBuildName: '',
	defaultSceneId: 0,
	defaultSceneName: ''
}

const mutations = {
	// 设置客户信息
	[SET_CLIENT] (state, data) {
		if(data) {
			state.clientId = data.clientId
			state.clientName = data.clientName
			state.clientLogo = data.clientLogo
			state.defaultBuildId = data.defaultBuildId || 0
			state.defaultBuildName = data.defaultBuildName || ''
			state.defaultSceneId = data.defaultSceneId || 0
			state.defaultSceneName = data.defaultSceneName || ''
		} else {
			state.clientId = 0
			state.clientName = ''
			state.clientLogo = '/static/img/client.png'
			state.defaultBuildId = 0
			state.defaultBuildName = ''
			state.defaultSceneId = 0
			state.defaultSceneName = ''
		}
	},
	[REMOVE_CLIENT] (state) {
		state.clientId = 0
		state.clientName = ''
		state.clientLogo = '/static/img/client.png'
		state.defaultBuildId = 0
		state.defaultBuildName = ''
		state.defaultSceneId = 0
		state.defaultSceneName = ''
	}
}

export default {
	state,
	mutations
}
