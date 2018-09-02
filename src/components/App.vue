<template>
  <div id="app">
    <div id="app-content">

      <nav v-if="isLoggedIn" class="navbar has-shadow">
        <div class="container has-background-black-ter">
          <div class="navbar-start">
            <a class="navbar-item" href="https://kodi.tv/">
              <img title="Kodi Community Forum" src="../../kodi_logo.png" alt="Kodi Logo">
            </a>
            <router-link :to="{name: 'submit-local'}" class="navbar-item has-text-white">Local</router-link>
            <router-link :to="{name: 'repo-list'}" class="navbar-item has-text-white">Repositories</router-link>
          </div>
          <div class="navbar-end">
            <div class="navbar-item has-text-white">
              {{username}}
            </div>
            <div class="navbar-item">
              <button class="button is-primary" @click="logout">Log out</button>
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

    <footer class="footer has-background-black-ter has-text-white">
      <div class="content has-text-centered">
        <img title="Kodi Community Forum" src="../../kodi_logo.png" alt="Kodi Logo" style="height: 50px;">
        <p class="footer-links has-text-white">
          <a href="https://kodi.tv/about/" title="About Us">About Us</a> |
          <a href="https://kodi.tv/contact-kodi-team/" title="Contact Us">Contact Us</a> |
          <a href="https://kodi.tv/kodi-privacy-policy/" title="Privacy">Privacy</a>

        <div class="icons">
          <a href="https://www.facebook.com/XBMC/" title="Like Our Page on Facebook"><b-icon icon="facebook"/></a>
          <a href="https://twitter.com/KodiTV" title="Follow us on Twitter"><b-icon icon="twitter"/></a>
          <a href="https://plus.google.com/+Kodi-TV" title="Follow us on Google Plus"><b-icon icon="google-plus"/></a>
          <a href="https://github.com/xbmc/xbmc" title="Source code"><b-icon icon="github-face"/></a>
          <a href="https://forum.kodi.tv/syndication.php"  title="Subscribe to Our Feed"><b-icon icon="rss"/></a>
          <a href="https://kodi.tv/contribute/donate" title="Donate">Donate</a>
        </div>
      Copyright © 2017 XBMC Foundation
      </p>
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
