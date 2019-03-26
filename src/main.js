import Vue from 'vue'
import App from './App.vue'

import BootstrapVue from 'bootstrap-vue'
Vue.use(BootstrapVue)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

import VuePrism from 'vue-prism'
Vue.use(VuePrism)
import 'prismjs/themes/prism.css'

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
