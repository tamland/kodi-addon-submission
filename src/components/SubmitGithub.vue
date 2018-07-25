<template>
  <div>
    <submit v-if="files != null" :files="files"></submit>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import Submit from './Submit.vue';
import {pushAddon, readAddonInfo, loadDirectory, LocalFile} from '../shared/utils';
import { MUTATIONS, ACTIONS, Branch } from "@/shared/store";

export default Vue.extend({
  components: {
    'submit': Submit,
  },
  props: {
    repo: String,
  },
  data() {
    return {
      files: null as null | LocalFile[],
    }
  },
  created() {
    this.files = null;
    this.$store.dispatch(ACTIONS.FETCH_REPO_INFO, this.repo).then((files) => {
      this.files = files;
    });
  },
});
</script>
