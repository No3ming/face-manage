import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tips: {
      show: false,
      ms: ''
    },
    loginModal: {
      show: false
    }
  },
  mutations: {
    TIPS (state: any, ms) {
      state.tips.ms = ms
      state.tips.show = true
    },
    HIDE_TIPS (state: any) {
      state.tips.show = false
    },
    LOGIN (state: any) {
      state.loginModal.show = true
    },
    HIDE_LOGIN (state: any) {
      state.loginModal.show = false
    }
  },
  actions: {
    tips ({ commit }, ms) {
      commit('TIPS', ms)
    },
    tipsHide ({ commit }) {
      commit('HIDE_TIPS')
    },
    login ({ commit }) {
      commit('LOGIN')
    },
    hideLogin ({ commit }) {
      commit('HIDE_LOGIN')
    }
  },
  modules: {
  }
})
