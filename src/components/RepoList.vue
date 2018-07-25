<template>
  <div>
    <b-table hoverable default-sort="pushedAt" default-sort-direction="desc" :loading="loading" :data="repos">
      <template slot-scope="props">
        <b-table-column label="Name" field="fullName" sortable>
          {{ props.row.fullName }}
        </b-table-column>
        <b-table-column label="Last updated" field="pushedAt" sortable>
          {{ props.row.pushedAt | formatDate}} ago
        </b-table-column>
        <b-table-column label="Actions">
          <router-link :to="{name: 'submit-github', params: {repo: props.row.fullName}}"
              class="button is-success">Submit</router-link>
        </b-table-column>
      </template>
    </b-table>
    <template v-if="!loading && repos.length === 0">
      <section class="section">
        <div class="content has-text-grey has-text-centered">
          <p>
            <b-icon icon="emoticon-sad" size="is-large"></b-icon>
          </p>
          <p>Nothing here.</p>
        </div>
      </section>
    </template>
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import { mapState } from 'vuex';
import * as dateFns from 'date-fns'
import {pushAddon} from '../shared/utils';
import { MUTATIONS, ACTIONS, Branch } from "@/shared/store";

export default Vue.extend({
  data() {
    return {
      repos: [] as any[],
      loading: false as boolean,
    }
  },
  created() {
    this.loading = true;
    this.$store.dispatch(ACTIONS.FETCH_MY_REPOS).then(repos => {
      this.loading = false;
      this.repos = repos;
    })
  },
  filters: {
    formatDate(value: string): string {
      return dateFns.distanceInWordsToNow(dateFns.parse(value));
    }
  },
  computed: {
    columns(): any[] {
      return [
        { label: 'Name', field: 'fullName', sortable: true},
        { label: 'Last pushed', field: 'pushedAt'},
        { label: 'Last updated', field: 'updatedAt'},
      ]
    }
  },
  methods: {

  },
});
</script>
