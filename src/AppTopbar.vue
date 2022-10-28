<template>
  <div class="layout-topbar">
  <router-link to="/" class="layout-topbar-logo">
    <img alt="Logo" :src="topbarImage()" />
    <span>Applications</span>
  </router-link>
  <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle">
    <i class="pi pi-bars"></i>
  </button>

  <button class="p-link layout-topbar-menu-button layout-topbar-button"
          v-styleclass="{ selector: '@next', enterClass: 'hidden', enterActiveClass: 'scalein',
        leaveToClass: 'hidden', leaveActiveClass: 'fadeout', hideOnOutsideClick: true}">
    <i class="pi pi-ellipsis-v"></i>
  </button>
  <ul class="layout-topbar-menu hidden lg:flex origin-top">
    <li>
      <button class="p-link layout-topbar-button">
        <i class="pi pi-calendar"></i>
        <span>Events</span>
      </button>
    </li>
    <li>
      <button class="p-link layout-topbar-button">
        <i class="pi pi-cog"></i>
        <span>Settings</span>
      </button>
    </li>
    <li>
      <button v-if="!isAuthenticated && !isLoading" id="qsLoginBtn" class="p-link layout-topbar-button" @click="login">Log in</button>
      <SplitButton v-if="isAuthenticated"
                   :model="userProfileItems"
                   type="button"
                   class="p-button-text p-button-sm mb-2"
                   style="margin-bottom: 0 !important;"
      >
        <img
            :src="user.picture"
            alt="User's profile picture"
            class="nav-user-profile rounded-circle"
            width="40"
        />
      </SplitButton>
      <Menu ref="profileMenu" :model="userProfileItems" :popup="true" />
    </li>
  </ul>

  </div>


</template>

<script setup>
import { computed, inject, watch, ref } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';

const auth0 = useAuth0();

const emit = defineEmits(['menu-toggle', 'topbar-menu-toggle']);
const globalProps = inject('globalProperties');
const appState = globalProps.$appState;
// const profileMenu = ref(null);
const isAuthenticated = auth0.isAuthenticated;
const isLoading = auth0.isLoading;
const user = auth0.user;
const userName = ref(user);
const userProfileItems = [
  {
    label: ''
  },
  {
    label: 'Profile',
    icon: 'pi pi-user',
    to: '/profile'
  },
  {
    label: 'Logout',
    icon: 'pi pi-power-off',
    command: () => { logout() }
  }
];

const darkTheme = computed(() =>  {
  return appState.darkTheme;
})

function login() {
  auth0.loginWithRedirect();
}

function logout() {
  auth0.logout({
    returnTo: window.location.origin
  });
}

watch(() => userName.value, () => {
  userProfileItems[0].label = user._rawValue.name;
});

function onMenuToggle(event) {
  emit('menu-toggle', event);
}

function onTopbarMenuToggle(event) {
  emit('topbar-menu-toggle', event);
}

function topbarImage() {
  return appState.darkTheme ? 'images/logo-white.svg' : 'images/logo-dark.svg';
}
</script>

<style>
#mobileAuthNavBar {
  min-height: 125px;
  justify-content: space-between;
}
button.layout-topbar-button {
  width: unset !important;
}
.p-splitbutton {
  margin: 2px 0 -10px 20px;
}
button.p-button.p-component.p-button-icon-only.p-splitbutton-menubutton {
  padding-left: 0;
  border: none;
  color: black;
}
.p-tieredmenu {
  width: unset;
}
</style>
