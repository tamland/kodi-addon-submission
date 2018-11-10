import Vue from 'vue'

declare module '*.vue' {
  export default Vue
}

declare global {
  interface File {
    webkitRelativePath: string;
  }
}
