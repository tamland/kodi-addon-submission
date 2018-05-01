<template>
  <v-card>
    <v-alert v-if="error != null" :value="true" type="error">
        {{error.stack}}
      </v-alert>
    <v-card-text>
      <v-form>
        <v-text-field label="Access token" :type="showToken ? 'text' : 'password'"
            :append-icon="showToken ? 'visibility' : 'visibility_off'"
            :append-icon-cb="() => (showToken = !showToken)"
            v-model="token"
            @change="onTokenChanged"></v-text-field>
        <p v-if="username">Currently logged in as {{username}}</p>

        <v-select label="Repository" :items="availableRepos" v-model="repo" @change="updateHeads"></v-select>

        <v-select label="Branch" :disabled="!repo" :items="availableHeads" item-text="branch" v-model="head"></v-select>
        
        <v-text-field v-model="addonId" label="Add-on ID"></v-text-field>

        <div class="pb-4">
          <label class="btn" >
            <div class="btn__content">
            <input type="file" style="display: none;"
                @change="directorySelected($event)"
                multiple directory webkitdirectory mozdirectory>
              Select files
            </div>
          </label>
        </div>
        <div>
          <v-data-table
              :headers="[{ text: 'File', align: 'left', sortable: true, value: 'path'}]"
              :items="files" :must-sort="true" class="elevation-1">
            <template slot="items" slot-scope="data">
              <td class="text-xs-left">{{ data.item.path }}</td>
            </template>
          </v-data-table>
        </div>
      </v-form>
    </v-card-text>
    <v-card-actions>
      <v-btn color="primary" @click="push" :loading="uploadState === 'uploading'"
          :disabled="uploadState === 'uploading' || !repo || !head">Push</v-btn>

      <v-btn :disabled="!(uploadState == 'done')" @click=openPR>
        Create pull request
      </v-btn>

    </v-card-actions>
  </v-card>
</template>
<style></style>
<script lang="ts">
import Vue from 'vue';
import * as Octokat from 'octokat'
import {pushAddon, readFileContent} from '../shared/utils';

export default Vue.extend({
  data() {
    return {
      token: "",
      showToken: false,
      availableRepos: [] as string[],
      availableHeads: [] as null | any[],
      username: "" as string,
      repo: "" as string,
      head: null as any,
      addonId: "",
      files: [] as {path: string, blob: Blob}[],
      octo: Octokat,        
      uploadState: "",
      error: null as any,
    }
  },
  created() {
    this.token = localStorage.getItem("token") || ""
    this.onTokenChanged(this.token)

    this.availableRepos = [
      "repo-plugins",
      "repo-resources",
      "repo-scrapers",
      "repo-scripts",
      "repo-skins",
      "repo-webinterfaces",
    ]
  },
  methods: {
    clearErrors() {
      this.error = null;
    },
    onTokenChanged(token: string) {
      localStorage.setItem("token", token);
      this.error = null;
      this.username = "";
      this.octo = new Octokat({token: token})
      if (!token) {
        return;
      }
      this.octo.user.fetch()
        .then((result: any) => {
          this.username = result.login;
        })
        .catch((error: Error) => {
          this.error = error;
        })
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
