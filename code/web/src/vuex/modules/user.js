import {
	SET_USER,
	REMOVE_USER
} from '../types'

const state = {
	uid: 0, // 用户id
	displayName: '', // 显示名称
	username: '', // 用户名
	role: 0 // 角色
}

const mutations = {
	// 设置用户信息
	[SET_USER] (state, data) {
		if(data) {
			state.uid = data.uid
			state.displayName = data.displayName
			state.username = data.username
			state.role= data.role
		} else {
			state.uid = 0
			state.displayName = ''
			state.username = ''
			state.role = 0
		}
	},
	// 删除用户信息
	[REMOVE_USER] (state) {
		state.uid = 0
		state.displayName = ''
		state.username = ''
		state.role = 0
	}
}

export default {
	state,
	mutations
}
