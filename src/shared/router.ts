import VueRouter from 'vue-router'
import Dashboard from '@/components/Dashboard.vue';

const routes = [
  { path: '/', component: Dashboard },
]

export default new VueRouter({
  mode: 'history',
  routes: routes,
})