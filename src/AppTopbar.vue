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
            :src="user?.picture"
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
import { computed, inject, watch, ref, onMounted } from 'vue';
// import { useAuth0 } from '@auth0/auth0-vue';
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
// const auth0 = useAuth0();
// const user = auth0.user;
// let user;
// const userName = ref(user);
console.log('AppTopbar auth0 set');

const emit = defineEmits(['menu-toggle', 'topbar-menu-toggle']);
const globalProps = inject('globalProperties');
const appState = globalProps.$appState;
// const profileMenu = ref(null);
// const isAuthenticated = auth0.isAuthenticated;
// const isLoading = auth0.isLoading;
const userProfileItems = computed(() => [
  {
    label: `${userName.value}`
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
]);

// onMounted(() => {
//   console.log(`xx AppTopbar onMounted  userName: ${userName}`);
//   userProfileItems[0].label = userName;
// });

const darkTheme = computed(() =>  {
  return appState.darkTheme;
})

const user = computed(() =>  {
  const u = userStore.currentUser;
  console.log(`computed user: ${JSON.stringify(u)}`)
  return u ? u : {};
})

const userName = computed(() => {
  const u = userStore.currentUser;
  const name = u ? u.name : '';
  // userProfileItems[0].label = String(name);
  console.log(`computed user name: ${name}`)
  return name;
})

const isAuthenticated = computed(() =>  {
  return userStore.isAuthenticated;
})

const isLoading = computed(() =>  {
  return userStore.isLoading;
})

function login() {
  // auth0.loginWithRedirect();
  userStore.login()
}

function logout() {
  // auth0.logout({
  //   returnTo: window.location.origin
  // });
  userStore.logout(window.location.origin);
}

// watch(() => userName.value, () => {
//   userProfileItems[0].label = user._rawValue.name;
// });

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
