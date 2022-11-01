import { useAuth0 } from '@auth0/auth0-vue';
import { defineStore } from "pinia/dist/pinia";

console.log('--- user.js');
let auth0 = {};
// const user = auth0.user;

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {}
  }),
  getters: {
    currentUser: (state) => state.user,
    userName: (state) => state.user ? state.user.name : '',
    isAuthenticated: () => auth0.isAuthenticated.value,
    isLoading: () => auth0.isLoading.value
  },
  actions: {
    login() {
      auth0.loginWithRedirect();
    },
    logout(returnTo) {
      auth0.logout({
        returnTo: returnTo
      });
    },
    // setAuth0(a) {
    //   console.log(`setAuth0: ${JSON.stringify(a.user)}`);
    //   auth0 = a;
    //   this.user = a.user;
    // },
    init() {
      auth0 = useAuth0();
      console.log(`user init  isAuthenticated: ${auth0.isAuthenticated.value}`)
      this.user = auth0.user;
    }
  }
})
