<template>
  <div class="columns">
    <div class="column is-6 is-offset-3">
      <div class="section">
        <div class="content">
          <h1 class="title has-text-weight-light">Sign in to continue…</h1>
          <p>To use this application sign in with GitHub.</p>
        </div>
        <button type="button" :class="['button','is-primary', 'is-outlined', {'is-loading': loading}]"
            @click="requestToken">
          Sign in with GitHub
        </button>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import Authenticator from "netlify-auth-providers";
import { MUTATIONS, ACTIONS } from "@/shared/store";

export default Vue.extend({
  data() {
    return {
      loading: false,
    }
  },
  created() {
    this.login();
  },
  methods: {
    requestToken() {
      this.$store.dispatch(ACTIONS.REQUEST_TOKEN)
        .then(() => {
          this.login();
        })
    },
    login() {
      this.$store.commit(MUTATIONS.CLEAR_ERROR);
      this.loading = true;
      this.$store.dispatch(ACTIONS.LOGIN)
        .catch(() => {})
        .then(() => {
          this.loading = false;
        })
    },
  }
});
</script>
