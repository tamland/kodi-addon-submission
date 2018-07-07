import Vue from 'vue'
import Buefy from 'buefy'
import App from './components/App.vue'

Vue.use(Buefy);

new Vue({
  el: '#app',
  render: h => h(App)
});
