<template>
  <div id="app">
    <section id="app-content" class="section">
      <div class="container">
        <pr></pr>
      </div>
    </section>
    <footer class="footer">
      <div class="content has-text-centered">
        This website is licensed <a href="https://www.gnu.org/licenses/agpl-3.0.en.html">GNU Affero General Public License</a>.
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
import PRComponent from './components/PR.vue';

export default Vue.extend({
  components: {
    'pr': PRComponent,
  },
});
</script>
