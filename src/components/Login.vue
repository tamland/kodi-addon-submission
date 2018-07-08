<template>
  <div class="columns">
    <div class="column is-6 is-offset-3">
      <div class="box">
        <div class="section">
          <h1 class="title">Create Github API token </h1>
          <form  @submit.prevent="login">
            <b-field>
              <p>To use this application you need to
                <a href="https://blog.github.com/2013-05-16-personal-api-tokens/">create a personal API token</a> with the <span class="is-italic">public_repo</span> scope.
              </p>
            </b-field>
            <b-field label="Access token"
                  :type="invalid ? 'is-danger' : ''"
                  :message="invalid ? 'Invalid token' : ''">
              <b-input type="password" password-reveal :value="token"
                  @change.native="onTokenChanged($event.target.value)"></b-input>
            </b-field>
            <button type="submit" :class="['button','is-primary', {'is-loading': loading}]">Ok</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from "vue";
import { MUTATIONS, ACTIONS } from "@/shared/store";

export default Vue.extend({
  data() {
    return {
      invalid: false,
      loading: false,
    }
  },
  created() {
    if (this.$store.state.token) {
      this.login();
    }
  },
  computed: {
    token(): string {
      return this.$store.state.token
    }
  },
  methods: {
    onTokenChanged(token: string) {
      this.invalid = false;
      this.$store.commit(MUTATIONS.SET_TOKEN, token);
    },
    login() {
      this.loading = true;
      this.$store.dispatch(ACTIONS.LOGIN, this.token)
        .catch((error: Error) => {
          this.invalid = true;
          console.log(error)
        })
        .then(() => {
          this.loading = false;
        })
    },
  }
});
</script>
