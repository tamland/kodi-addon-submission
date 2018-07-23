import Vue from 'vue'
import VueRouter from 'vue-router'
import Buefy from 'buefy'
import App from './components/App.vue'
import router from '@/shared/router';
import store from '@/shared/store';

Vue.use(Buefy);
Vue.use(VueRouter)
Vue.config.productionTip = false

new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
});
