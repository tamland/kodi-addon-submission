<template>
  <v-app id="app">
    <v-content>
      <v-container grid-list-xl>
        <v-layout row wrap>
          <v-flex xs10 offset-xs1>
              <pr></pr>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    <v-footer app></v-footer>
  </v-app>
</template>
<style></style>
<script lang="ts">
import Vue from 'vue';
import PRComponent from './components/PR.vue';

export default Vue.extend({
  name: 'app',
  components: {
    'pr': PRComponent,
  },
  data() {
    return {
    }
  },
  created() {
  },
  methods: {
  },
});
</script>
