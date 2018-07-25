<template>
  <div>
    <b-loading :active="loading" :is-full-page="false"></b-loading>
    <form novalidate @submit.prevent v-if="addonId">
      <b-field label="Add-on ID">
        {{addonId || "-"}}
      </b-field>

      <b-field label="Version">
        {{addonVersion || "-"}}
      </b-field>

      <b-table striped paginated :per-page="10" default-sort="path" :data="files"
          :columns="[{ field: 'path', label: 'File', sortable: true}]"></b-table>

      <b-field label="Repository">
        <b-select v-model="repo" @input="onRepoSelected">
          <option v-for="item in destinationRepos" :key="item" :value="item">{{item}}</option>
        </b-select>
      </b-field>

      <b-field label="Branch">
        <b-select :disabled="!repo" v-model="branch">
          <option v-for="item in branches" :key="item.name" :value="item">{{item.name}}</option>
        </b-select>
      </b-field>

      <b-field v-if="progressMessage" class="has-text-grey">
        {{progressMessage}}
        <progress class="progress is-info" :value="progress" :max="files.length + 1"></progress>
      </b-field>

      <div class="buttons">
        <button :class="['button', 'is-primary', {'is-loading': uploadState === 'uploading'}]"
            :disabled="!canPush" @click="push">
          Push
        </button>
        <button class="button is-success" :disabled="!(uploadState == 'done')" @click="openPR">
          Create pull request
        </button>
      </div>
    </form>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import {pushAddon, readAddonInfo, loadDirectory, LocalFile} from '../shared/utils';
import { MUTATIONS, ACTIONS, Branch } from "@/shared/store";

export default Vue.extend({
  props: ['files'],
  data() {
    return {
      branches: [] as Branch[],
      repo: "" as string,
      branch: null as null | Branch,
      addonId: "" as string,
      addonVersion: "" as string,
      loading: true as boolean,
      uploadState: "",
      progress: 0 as number,
      progressMessage: "" as string,
    }
  },
  watch: {
    files: {
      immediate: true,
      handler(newValue: any, oldValue: any) {
        console.log("Reading addon.xml");
        this.loading = true;
        readAddonInfo(newValue)
          .then((info) => {
            this.addonId = info.id;
            this.addonVersion = info.version;
          })
          .catch((err) => {
            this.$store.commit(MUTATIONS.SET_ERROR, err);
          })
          .then(() => {
            this.loading = false;
          });
      }
    }
  },
  computed: {
    ...mapState(['destinationRepos']),
    username(): string {
      return this.$store.state.username;
    },
    canPush(): boolean {
      return !!this.repo && !!this.branch && !!this.addonId && this.uploadState !== 'uploading';
    }
  },
  methods: {
    onRepoSelected(repo: string) {
      this.branch = null;
      this.branches = []
      this.$store.dispatch(ACTIONS.FETCH_BRANCH_INFO, repo).then((branches: Branch[]) => {
        this.branches = branches
      })
    },
    openPR() {
      if (!this.branch) {
        return;
      }
      const url = `https://github.com/xbmc/${this.repo}/compare/${this.branch.name}...${this.username}:${this.addonId}`
      window.open(url, "_blank");
    },
    push() {
      if (!this.branch) {
        return;
      }
      const commitMessage = `[${this.addonId}] ${this.addonVersion}`
      const progressCallback = (message: string) => {
        this.progress += 1.
        this.progressMessage = message;
      };

      this.$store.commit(MUTATIONS.CLEAR_ERROR);
      this.uploadState = 'uploading'
      const payload = {
        destRepo: this.repo,
        destBranch: this.branch,
        addonId: this.addonId,
        files: this.files,
        commitMessage,
        progressCallback,
      }
      this.$store.dispatch(ACTIONS.PUSH, payload)
        .then((result: any) => {
          this.uploadState = 'done';
        })
        .catch((err: any) => {
          this.uploadState = "";
        })
        .then(() => {
          this.progress = 0;
          this.progressMessage = "";
        });
    }
  },
});
</script>
