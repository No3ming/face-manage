import Vue from 'vue'
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'
import { createProvider } from './apollo'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import Tips from './util/tips'

Vue.config.productionTip = false
// use
Vue.use(Tips)
Vue.use(mavonEditor)

// @ts-ignore
new Vue({
  router,
  store,
  vuetify,
  apolloProvider: createProvider({}),
  render: h => h(App)
}).$mount('#app')
