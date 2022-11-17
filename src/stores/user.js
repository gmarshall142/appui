import { useAuth0 } from '@auth0/auth0-vue';
import { defineStore } from "pinia/dist/pinia";

let auth0 = {};

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {}
  }),
  getters: {
    currentUser: (state) => state.user,
    userName: (state) => state.user ? state.user.name : '',
    isAuthenticated: () => auth0.isAuthenticated.value,
    isLoading: () => auth0.isLoading.value,
    userToken: async () => {
      return await auth0.getAccessTokenSilently();
    }
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
    init() {
      auth0 = useAuth0();
      this.user = auth0.user;
    }
  }
})
