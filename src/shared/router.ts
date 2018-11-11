import VueRouter from 'vue-router'
import RepoList from '@/components/RepoList.vue';
import SubmitLocal from '@/components/SubmitLocal.vue';
import SubmitGithub from '@/components/SubmitGithub.vue';

const routes = [
  {
    path: '/',
    name: 'repo-list',
    component: RepoList
  },
  {
    path: '/repos/:repo',
    name: 'submit-github',
    component: SubmitGithub,
    props: true,
  },
  {
    path: '/upload',
    name: 'upload',
    component: SubmitLocal
  },
]

export default new VueRouter({
  mode: 'history',
  linkActiveClass: '',
  linkExactActiveClass: 'is-active',
  routes: routes,
})