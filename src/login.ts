import Vue from 'vue'
import Login from './Login.vue'
import store from './store'
import vuetify from './plugins/vuetify'
import { createProvider } from './apollo'

Vue.config.productionTip = false

new Vue({
  store,
  vuetify,
  apolloProvider: createProvider({}),
  render: h => h(Login)
}).$mount('#app')
