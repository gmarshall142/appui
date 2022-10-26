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
<!--    <li>-->
<!--      <button class="p-link layout-topbar-button">-->
<!--        <i class="pi pi-user"></i>-->
<!--        <span>Profile</span>-->
<!--      </button>-->
<!--      <button id="qsLoginBtn" class="p-link layout-topbar-button" @click="login">Log in</button>-->
<!--    </li>-->
  </ul>
    <ul class="navbar-nav d-none d-md-block">
      <li v-if="!isAuthenticated && !isLoading" class="nav-item">
        <button
            id="qsLoginBtn"
            class="btn btn-primary btn-margin"
            @click.prevent="login"
        >Login</button>
      </li>

      <li class="nav-item dropdown" v-if="isAuthenticated">
        <a
            class="nav-link dropdown-toggle"
            href="#"
            id="profileDropDown"
            data-toggle="dropdown"
        >
          <img
              :src="user.picture"
              alt="User's profile picture"
              class="nav-user-profile rounded-circle"
              width="50"
          />
        </a>
        <div class="dropdown-menu dropdown-menu-right">
          <div class="dropdown-header">{{ user.name }}</div>
          <router-link to="/profile" class="dropdown-item dropdown-profile">
            <font-awesome-icon class="mr-3" icon="user" />Profile
          </router-link>
          <a id="qsLogoutBtn" href="#" class="dropdown-item" @click.prevent="logout">
            <font-awesome-icon class="mr-3" icon="power-off" />Log out
          </a>
        </div>
      </li>
    </ul>

  </div>
</template>

<script setup>
import { computed, inject } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';

const auth0 = useAuth0();

const emit = defineEmits(['menu-toggle', 'topbar-menu-toggle']);
const globalProps = inject('globalProperties');
const appState = globalProps.$appState;
const isAuthenticated = auth0.isAuthenticated;
const isLoading = auth0.isLoading;
const user = auth0.user;

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
</style>
