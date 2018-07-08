<template>
  <div id="app">
    <div id="app-content">
      <nav v-if="isLoggedIn" class="navbar is-transparent has-shadow">
        <div class="container">
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
          <dashboard v-if="isLoggedIn"/>
          <login v-else/>
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
  @import '~buefy/lib/buefy.css';

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
import Dashboard from './Dashboard.vue';
import { MUTATIONS } from "@/shared/store";
import { mapGetters, mapState, mapMutations } from 'vuex';

export default Vue.extend({
  components: {
    Login,
    Dashboard,
  },
  computed: {
    ...mapGetters(["isLoggedIn"]),
    ...mapState(["username"]),
  },
  methods: {
    ...mapMutations({
      logout: MUTATIONS.LOGOUT
    })
  }
});
</script>
