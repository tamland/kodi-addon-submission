<template>
  <div>
    <b-message v-if="error != null" type="is-danger">
      <p><strong>Error</strong></p>
      <p>{{error.stack}}</p>
    </b-message>

    <div>
      <form novalidate @submit.prevent>
        <b-field label="Repository">
          <b-select v-model="repo" @input="updateHeads">
            <option v-for="item in availableRepos" :key="item" :value="item">{{item}}</option>
          </b-select>
        </b-field>

        <b-field label="Branch">
          <b-select :disabled="!repo" v-model="head">
            <option v-for="item in availableHeads" :key="item.sha" :value="item">{{item.branch}}</option>
          </b-select>
        </b-field>

        <b-field label="Add-on ID">
          <b-input type="text" v-model="addonId"></b-input>
        </b-field>

        <div class="file">
          <label class="file-label">
            <input type="file" class="file-input" 
                @change="directorySelected($event)"
                multiple directory webkitdirectory mozdirectory>
            <span class="file-cta">
              <span class="file-icon">
                 <b-icon icon="upload"/>
              </span>
              <span class="file-label">
                Select files…
              </span>
            </span>
          </label>
        </div>

        <div>
          <b-table striped paginated :per-page="10" default-sort="path" :data="files" 
                   :columns="[{ field: 'path', label: 'File', sortable: true}]"></b-table>
        </div>
      </form>
    </div>
    <div class="buttons">
      <button class="button is-primary" @click="push"
          :class="{'is-loading': uploadState === 'uploading'}"
          :disabled="uploadState === 'uploading' || !repo || !head">Push</button>

      <button class="button is-success" :disabled="!(uploadState == 'done')" @click="openPR">
        Create pull request
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import {pushAddon, readFileContent} from '../shared/utils';

export default Vue.extend({
  data() {
    return {
      availableRepos: [] as string[],
      availableHeads: [] as null | any[],
      repo: "" as string,
      head: null as any,
      addonId: "",
      files: [] as {path: string, blob: Blob}[],
      uploadState: "",
      error: null as any,
    }
  },
  created() {
    this.availableRepos = [
      "repo-plugins",
      "repo-resources",
      "repo-scrapers",
      "repo-scripts",
      "repo-skins",
      "repo-webinterfaces",
    ]
  },
  computed: {
    octo(): any {
      return this.$store.state.octo;
    },
    username(): string {
      return this.$store.state.username;
    },
  },
  methods: {
    clearErrors() {
      this.error = null;
    },
    updateHeads(repo: string) {
      this.error = null;
      this.head = null;
      this.availableHeads = []
      this.octo.repos('xbmc', repo).git.refs.heads.fetch()
        .then((result: any) => {
          this.availableHeads = result.items.map((ref: any) => {
            const branch = ref.ref.split("/").reverse()[0];
            return {branch: branch, sha: ref.object.sha}
          });
        })
        .catch((error: Error) => { this.error = error} )
    },
    async directorySelected(event: any) {
      console.log(event.target.files)

      const files: File[] = Array.from(event.target.files)
      this.files = files.map((file: File) => {
        return {
          path: file.webkitRelativePath.substring(file.webkitRelativePath.indexOf("/") + 1),
          blob: file
        }})
        .filter(x => !x.path.startsWith(".git/"))
    },
    openPR() {
      const url = `https://github.com/xbmc/${this.repo}/compare/${this.head.branch}...${this.username}:${this.addonId}`
      window.open(url, "_blank");
    },
    push() {
      const commitMessage = `[${this.addonId}] update`
      const repo = this.octo.repos(this.username, this.repo);

      this.error = null;
      this.uploadState = 'uploading'
      pushAddon(repo, this.head.sha, this.addonId, this.files, commitMessage)
        .then((result: any) => {
          this.uploadState = 'done'
        })
        .catch((err: any) => {
          this.error = err
          this.uploadState = ""
        });
    }
  },
});
</script>
