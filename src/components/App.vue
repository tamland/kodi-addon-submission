<template>
  <div id="app">
    <div id="app-content">
      <nav v-if="isLoggedIn" class="navbar has-shadow">
        <div class="container">
          <div class="navbar-start">
            <router-link :to="{name: 'submit-local'}" class="navbar-item">Local</router-link>
            <router-link :to="{name: 'repo-list'}" class="navbar-item">Repositories</router-link>
          </div>
          <div class="navbar-end">
            <div class="navbar-item">
              {{username}}
            </div>
            <div class="navbar-item">
              <button class="button" @click="logout">Log out</button>
            </div>
          </div>
        </div>
      </nav>
      <div class="container">
        <section class="section">
          <b-message v-if="error != null" type="is-danger">
            <p><strong>Error</strong></p>
            <p v-if="error.message">{{error.message}}<br>{{error.stack}}</p>
            <p v-else>{{error}}</p>
          </b-message>
          <login v-if="!isLoggedIn"/>
          <router-view v-else/>
        </section>
      </div>
    </div>
    <footer class="footer">
      <div class="content has-text-centered">
        This website is licensed <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">GNU Affero General Public License</a>.
      </div>
    </footer>
  </div>
</template>
<style lang="scss">
  @import '~material-design-icons/iconfont/material-icons.css';
  @import '~buefy/dist/buefy.css';

  #app {
    display: flex;
    min-height: 100vh;
    flex-direction: column;
  }
  #app-content {
    flex: 1;
  }
</style>
<script lang="ts">
import Vue from 'vue';
import Login from './Login.vue';
import { MUTATIONS } from "@/shared/store";
import { mapGetters, mapState, mapMutations } from 'vuex';

export default Vue.extend({
  components: {
    Login,
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
    ...mapState(["username", "error"]),
  },
  methods: {
    ...mapMutations({
      logout: MUTATIONS.LOGOUT
    })
  }
});
</script>
