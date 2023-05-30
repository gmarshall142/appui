<template>
  <div :class="containerClass" @click="onWrapperClick">
    <AppTopBar @menu-toggle="onMenuToggle" />
    <div class="layout-sidebar" @click="onSidebarClick">
      <AppMenu :model="menu" @menuitem-click="onMenuItemClick" />
    </div>

    <div class="layout-main-container">
      <div class="layout-main">
        <router-view />
      </div>
      <AppFooter />
    </div>

    <AppConfig :layoutMode="state.layoutMode" @layout-change="onLayoutChange" />
    <transition name="layout-mask">
      <div class="layout-mask p-component-overlay" v-if="state.mobileMenuActive"></div>
    </transition>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { computed, inject, watch, onBeforeUpdate, onMounted, reactive } from "vue";
import AppTopBar from './AppTopbar.vue';
import AppMenu from './AppMenu.vue';
import AppConfig from './AppConfig.vue';
import AppFooter from './AppFooter.vue';
import { useAuth0 } from '@auth0/auth0-vue';
import { useUserStore } from '@/stores/user';
import AxiosHelper from './modules/axiosHelper';

const route = useRoute();
const userStore = useUserStore();
const auth0 = useAuth0();
const user = auth0.user;
userStore.init();

const emit = defineEmits(['change-theme'])
const globalProps = inject('globalProperties');
const appState = globalProps.$appState;
const axios = inject('axios');

const axiosHelper = new AxiosHelper();

let state = reactive({
  layoutMode: 'static',
  staticMenuInactive: false,
  overlayMenuActive: false,
  mobileMenuActive: false
});

let menuClick;
let menuActive = true;
const menu = [
  {
    label: 'Home',
    items: [{
      label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/'
    }]
  },
  {
    label: 'Bikes',
    items: [
      { label: 'Bike Gearing', icon: 'fa-solid fa-person-biking', to: '/bikegearing' },
    ]
  },
  {
    label: 'Media',
    items: [
      { label: 'Video Maintenance', icon: 'fa-solid fa-video', to: '/videomaint' },
      { label: 'Video List', icon: 'fa-solid fa-film', to: '/videolist' }
    ]
  },
  {
    label: 'UI Components', icon: 'pi pi-fw pi-sitemap',
    items: [
      {label: 'Form Layout', icon: 'pi pi-fw pi-id-card', to: '/formlayout'},
      {label: 'Input', icon: 'pi pi-fw pi-check-square', to: '/input'},
      {label: "Float Label", icon: "pi pi-fw pi-bookmark", to: "/floatlabel"},
      {label: "Invalid State", icon: "pi pi-fw pi-exclamation-circle", to: "/invalidstate"},
      {label: 'Button', icon: 'pi pi-fw pi-mobile', to: '/button'},
      {label: 'Table', icon: 'pi pi-fw pi-table', to: '/table'},
      {label: 'List', icon: 'pi pi-fw pi-list', to: '/list'},
      {label: 'Tree', icon: 'pi pi-fw pi-share-alt', to: '/tree'},
      {label: 'Panel', icon: 'pi pi-fw pi-tablet', to: '/panel'},
      {label: 'Overlay', icon: 'pi pi-fw pi-clone', to: '/overlay'},
      {label: "Media", icon: "pi pi-fw pi-image", to: "/media"},
      {label: 'Menu', icon: 'pi pi-fw pi-bars', to: '/menu'},
      {label: 'Message', icon: 'pi pi-fw pi-comment', to: '/messages'},
      {label: 'File', icon: 'pi pi-fw pi-file', to: '/file'},
      {label: 'Chart', icon: 'pi pi-fw pi-chart-bar', to: '/chart'},
      {label: 'Misc', icon: 'pi pi-fw pi-circle-off', to: '/misc'},
    ]
  },
  {
    label: 'PrimeBlocks',
    items: [
      {label: 'Free Blocks', icon: 'pi pi-fw pi-eye', to: '/blocks', badge: "NEW"},
      {label: 'All Blocks', icon: 'pi pi-fw pi-globe', url: 'https://www.primefaces.org/primeblocks-vue', target: '_blank'}
    ]
  },
  {
    label: 'Utilities',
    items: [
      {label: 'PrimeIcons', icon: 'pi pi-fw pi-prime', to: '/icons'},
      {label: 'PrimeFlex', icon: 'pi pi-fw pi-desktop', url: 'https://www.primefaces.org/primeflex/', target: '_blank'},
    ]
  },
  {
    label: 'Pages', icon: 'pi pi-fw pi-clone',
    items: [
      {label: 'Crud', icon: 'pi pi-fw pi-user-edit', to: '/crud'},
      {label: 'Timeline', icon: 'pi pi-fw pi-calendar', to: '/timeline'},
      {label: 'Landing', icon: 'pi pi-fw pi-globe', to: '/landing'},
      {label: 'Login', icon: 'pi pi-fw pi-sign-in', to: '/login'},
      {label: 'Error', icon: 'pi pi-fw pi-times-circle', to: '/error'},
      {label: 'Not Found', icon: 'pi pi-fw pi-exclamation-circle', to: '/notfound'},
      {label: 'Access Denied', icon: 'pi pi-fw pi-lock', to: '/access'},
      {label: 'Empty', icon: 'pi pi-fw pi-circle-off', to: '/empty'},
    ]
  },
  {
    label: 'Menu Hierarchy', icon: 'pi pi-fw pi-search',
    items: [
      {
        label: 'Submenu 1', icon: 'pi pi-fw pi-bookmark',
        items: [
          {
            label: 'Submenu 1.1', icon: 'pi pi-fw pi-bookmark',
            items: [
              {label: 'Submenu 1.1.1', icon: 'pi pi-fw pi-bookmark'},
              {label: 'Submenu 1.1.2', icon: 'pi pi-fw pi-bookmark'},
              {label: 'Submenu 1.1.3', icon: 'pi pi-fw pi-bookmark'},
            ]
          },
          {
            label: 'Submenu 1.2', icon: 'pi pi-fw pi-bookmark',
            items: [
              {label: 'Submenu 1.2.1', icon: 'pi pi-fw pi-bookmark'},
              {label: 'Submenu 1.2.2', icon: 'pi pi-fw pi-bookmark'}
            ]
          },
        ]
      },
      {
        label: 'Submenu 2', icon: 'pi pi-fw pi-bookmark',
        items: [
          {
            label: 'Submenu 2.1', icon: 'pi pi-fw pi-bookmark',
            items: [
              {label: 'Submenu 2.1.1', icon: 'pi pi-fw pi-bookmark'},
              {label: 'Submenu 2.1.2', icon: 'pi pi-fw pi-bookmark'},
              {label: 'Submenu 2.1.3', icon: 'pi pi-fw pi-bookmark'},
            ]
          },
          {
            label: 'Submenu 2.2', icon: 'pi pi-fw pi-bookmark',
            items: [
              {label: 'Submenu 2.2.1', icon: 'pi pi-fw pi-bookmark'},
              {label: 'Submenu 2.2.2', icon: 'pi pi-fw pi-bookmark'}
            ]
          }
        ]
      }
    ]
  },
  {
    label: 'Get Started',
    items: [
      {label: 'Documentation', icon: 'pi pi-fw pi-question', command: () => {window.location = "#/documentation"}},
      {label: 'View Source', icon: 'pi pi-fw pi-search', command: () => {window.location = "https://github.com/primefaces/sakai-vue"}}
    ]
  }
];

onBeforeUpdate(() => {
  if (state.mobileMenuActive)
    addClass(document.body, 'body-overflow-hidden');
  else
    removeClass(document.body, 'body-overflow-hidden');
});

onMounted(() => {
  axiosHelper.init(axios);
});

watch(() => route.name, () => {
  const toast = globalProps.$toast;
  menuActive = false;
  toast.removeAllGroups();
});

const containerClass = computed(() => {
  const primevue = globalProps.$primevue;
  return ['layout-wrapper', {
    'layout-overlay': state.layoutMode === 'overlay',
    'layout-static': state.layoutMode === 'static',
    'layout-static-sidebar-inactive': state.staticMenuInactive && state.layoutMode === 'static',
    'layout-overlay-sidebar-active': state.overlayMenuActive && state.layoutMode === 'overlay',
    'layout-mobile-sidebar-active': state.mobileMenuActive,
    'p-input-filled': primevue.config.inputStyle === 'filled',
    'p-ripple-disabled': primevue.config.ripple === false
  }];

});
const logo = computed(() => {
  return (appState.darkTheme) ? "images/logo-white.svg" : "images/logo.svg";
});

function onWrapperClick() {
  if (!menuClick) {
    state.overlayMenuActive = false;
    state.mobileMenuActive = false;
  }

  menuClick = false;
}

function onMenuToggle() {
  menuClick = true;

  if (isDesktop()) {
    if (state.layoutMode === 'overlay') {
      if (state.mobileMenuActive === true) {
        state.overlayMenuActive = true;
      }

      state.overlayMenuActive = !state.overlayMenuActive;
      state.mobileMenuActive = false;
    } else if (state.layoutMode === 'static') {
      state.staticMenuInactive = !state.staticMenuInactive;
    }
  } else {
    state.mobileMenuActive = !state.mobileMenuActive;
  }

  event.preventDefault();
}

function onSidebarClick() {
  menuClick = true;
}

function onMenuItemClick(event) {
  if (event.item && !event.item.items) {
    state.overlayMenuActive = false;
    state.mobileMenuActive = false;
  }
}

function onLayoutChange(mode) {
  state.layoutMode = mode;
}

function addClass(element, className) {
  if (element.classList) {
    element.classList.add(className);
  } else {
    element.className += ' ' + className;
  }
}

function removeClass(element, className) {
  if (element.classList) {
    element.classList.remove(className);
  } else {
    element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  }
}

function isDesktop() {
  return window.innerWidth >= 992;
}

function isSidebarVisible() {
  if (isDesktop()) {
    if (state.layoutMode === 'static')
      return !state.staticMenuInactive;
    else if (state.layoutMode === 'overlay')
      return state.overlayMenuActive;
  }
  return true;
}
</script>

<style lang="scss">
@import './App.scss';
</style>
