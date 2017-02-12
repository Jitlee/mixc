import Vue from 'vue'

//import { SET_USER, SET_CLIENT, REMOVE_USER, REMOVE_CLIENT } from '../types'
import * as types from '../types'

const storage = window.sessionStorage

const saveStorage = (data) => {
	storage.setItem('token', JSON.stringify(data))
}

const removeStorage = (data) =>{
	storage.removeItem('token')
}

const getStorage = () => {
	let json = storage.getItem('token')
	if(json) {
		return JSON.parse(json)
	}
	return null
}



export const setPassport = ({ commit }, data) => {
	if(data) {
		saveStorage(data)
		commit(types.SET_USER, data.user)
		commit(types.SET_CLIENT, data.client)
	} else {
		commit(types.REMOVE_USER)
		commit(types.REMOVE_CLIENT)
		removeStorage()
	}
}

export const restorePassport = ({ commit }, callback) => {
	let data = getStorage()
	if(data) {
		commit(types.SET_USER, data.user)
		commit(types.SET_CLIENT, data.client)
		callback.call(this, false);
	} else {
		commit(types.REMOVE_USER)
		commit(types.REMOVE_CLIENT)
		callback.call(this, true);
	}
}

export const setNavTarget = ({ commit }, target) => {
	commit(types.SET_NAV_TARGET, target)
}

export const getClientId = () => {
	let data = getStorage()
	if(data) {
		return data.client.clientId;
	}
	return 1;
}
