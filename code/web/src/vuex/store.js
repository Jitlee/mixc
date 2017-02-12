import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import client from './modules/client'
import nav from './modules/nav'
import { setPassport, restorePassport, setNavTarget } from './actions/passport'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'
export default new Vuex.Store({
  modules: {
    user,
    client,
    nav
  },
  actions: {
  		setPassport,
  		restorePassport,
  		setNavTarget
  },
  strict: debug,
  middlewares: debug ? [] : []
})
