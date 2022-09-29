<template>
  <div class="layout-topbar">
  <router-link to="/" class="layout-topbar-logo">
    <img alt="Logo" :src="topbarImage()" />
    <span>SAKAI</span>
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
      <button class="p-link layout-topbar-button">
        <i class="pi pi-user"></i>
        <span>Profile</span>
      </button>
    </li>
  </ul>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';

const emit = defineEmits(['menu-toggle', 'topbar-menu-toggle']);
const globalProps = inject('globalProperties');

const darkTheme = computed(() =>  {
  return $appState.darkTheme;
})

function onMenuToggle(event) {
  emit('menu-toggle', event);
}

function onTopbarMenuToggle(event) {
  emit('topbar-menu-toggle', event);
}

function topbarImage() {
  const appState = this.globalProps.$appState;
  return appState.darkTheme ? 'images/logo-white.svg' : 'images/logo-dark.svg';
}
</script>