import Vue from 'vue'
import Buefy from 'buefy'
import App from './components/App.vue'
import store from '@/shared/store';

Vue.use(Buefy);

new Vue({
  el: '#app',
  store,
  render: h => h(App)
});
