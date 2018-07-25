<template>
  <div>
    <b-field label="Upload add-on files">
      <div class="file">
        <label class="file-label">
          <input type="file" class="file-input" 
              @change="onDirectorySelected($event)"
              multiple directory webkitdirectory mozdirectory>
          <span class="file-cta">
            <span class="file-icon">
              <b-icon icon="upload"/>
            </span>
            <span class="file-label">
              Select directory…
            </span>
          </span>
        </label>
      </div>
    </b-field>

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
    sourceRepo: String,
  },
  data() {
    return {
      files: null as null | LocalFile[],
    }
  },
  methods: {
    onDirectorySelected(event: any) {
      this.$store.commit(MUTATIONS.CLEAR_ERROR);
      try {
        this.files = loadDirectory(event.target.files);
      } catch (err) {
        this.$store.commit(MUTATIONS.SET_ERROR, err);
      }
    },
  },
});
</script>
