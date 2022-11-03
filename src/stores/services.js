import { defineStore } from "pinia/dist/pinia";

// if(process.env.VUE_APP_REST_HOST || process.env.VUE_APP_REST_PORT) {
//   this.$store.dispatch('setRestUrl', { host: process.env.VUE_APP_REST_HOST, port: process.env.VUE_APP_REST_PORT });
// }
// state.serverUrl = `${window.location.protocol}//${payload.host}${port}`;
// console.log(`rest host: ${VUE_APP_REST_HOST}`);
// console.log(`rest port: ${VUE_APP_REST_PORT}`);
console.log(`rest host: ${import.meta.env.VITE_REST_HOST}`);
console.log(`rest port: ${import.meta.env.VITE_REST_PORT}`);
const port = !import.meta.env.VITE_REST_PORT || import.meta.env.VITE_REST_PORT === ''
  ? '' : `:${import.meta.env.VITE_REST_PORT}`;

export const useServicesStore = defineStore('services', {
  state: () => ({
    url: `${window.location.protocol}//${import.meta.env.VITE_REST_HOST}${port}`,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
  }),
  getters: {
    serverUrl: state => state.url,
    serviceHeaders: state => state.headers,
  },
  actions: {
  }
})
