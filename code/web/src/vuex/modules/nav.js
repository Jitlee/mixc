import {
	SET_NAV_TARGET
} from '../types'

const state = {
	target: '',
}

const mutations = {
	// 设置客户信息
	[SET_NAV_TARGET] (state, target) {
		if(target) {
			state.target = target
		} else {
			state.target = ''
		}
	}
}

export default {
	state,
	mutations
}
