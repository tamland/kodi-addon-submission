import VueRouter from 'vue-router'
import RepoList from '@/components/RepoList.vue';
import SubmitLocal from '@/components/SubmitLocal.vue';
import SubmitGithub from '@/components/SubmitGithub.vue';

const routes = [
  {
    path: '/',
    name: 'submit-local',
    component: SubmitLocal
  },
  {
    path: '/repos/:repo',
    name: 'submit-github',
    component: SubmitGithub,
    props: true,
  },
  {
    path: '/repos',
    name: 'repo-list',
    component: RepoList
  },
]

export default new VueRouter({
  mode: 'history',
  linkActiveClass: '',
  linkExactActiveClass: 'is-active',
  routes: routes,
})