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

    <AppConfig :layoutMode="layoutMode" @layout-change="onLayoutChange" />
    <transition name="layout-mask">
      <div class="layout-mask p-component-overlay" v-if="mobileMenuActive"></div>
    </transition>
  </div>
</template>

<script setup>
// import { RouterLink, RouterView } from 'vue-router'
// import HelloWorld from "./components/HelloWorld.vue";
import { useRoute } from 'vue-router';
import { computed, watch, onBeforeUpdate } from "vue";
import AppTopBar from './AppTopbar.vue';
import AppMenu from './AppMenu.vue';
import AppConfig from './AppConfig.vue';
import AppFooter from './AppFooter.vue';

const route = useRoute();
const emit = defineEmits(['change-theme'])
let layoutMode = 'static';
let staticMenuInactive = false;
let overlayMenuActive = false;
let mobileMenuActive = false;
let menuClick = false;
let menuActive = false;
const menu = [
  {
    label: 'Home',
    items: [{
      label: 'Dashboard', icon: 'pi pi-fw pi-home', to: '/'
    }]
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
  if (mobileMenuActive)
    addClass(document.body, 'body-overflow-hidden');
  else
    removeClass(document.body, 'body-overflow-hidden');
});
watch(() => route.name, () => {
  menuActive = false;
  // $toast.removeAllGroups();
});

const containerClass = computed(() => {
  return ['layout-wrapper', {
    'layout-overlay': layoutMode === 'overlay',
    'layout-static': layoutMode === 'static',
    'layout-static-sidebar-inactive': staticMenuInactive && layoutMode === 'static',
    'layout-overlay-sidebar-active': overlayMenuActive && layoutMode === 'overlay',
    'layout-mobile-sidebar-active': mobileMenuActive,
  }];
  // 'p-input-filled': this.$primevue.config.inputStyle === 'filled',
  //     'p-ripple-disabled': this.$primevue.config.ripple === false

});
const logo = computed(() => {
  return ($appState.darkTheme) ? "images/logo-white.svg" : "images/logo.svg";
});

function onWrapperClick() {
  if (!menuClick) {
    overlayMenuActive = false;
    mobileMenuActive = false;
  }

  menuClick = false;
}

function onMenuToggle() {
  menuClick = true;

  if (isDesktop()) {
    if (layoutMode === 'overlay') {
      if (mobileMenuActive === true) {
        overlayMenuActive = true;
      }

      overlayMenuActive = !this.overlayMenuActive;
      mobileMenuActive = false;
    } else if (layoutMode === 'static') {
      staticMenuInactive = !staticMenuInactive;
    }
  } else {
    mobileMenuActive = !mobileMenuActive;
  }

  event.preventDefault();
}

function onSidebarClick() {
  menuClick = true;
}

function onMenuItemClick(event) {
  if (event.item && !event.item.items) {
    overlayMenuActive = false;
    mobileMenuActive = false;
  }
}

function onLayoutChange(mode) {
  layoutMode = mode;
}

function addClass(element, className) {
  if (element.classList)
    element.classList.add(className);
  else
    element.className += ' ' + className;
}

function removeClass(element, className) {
  if (element.classList)
    element.classList.remove(className);
  else
    element.className = element.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
}

function isDesktop() {
  return window.innerWidth >= 992;
}

function isSidebarVisible() {
  if (isDesktop()) {
    if (layoutMode === 'static')
      return !staticMenuInactive;
    else if (layoutMode === 'overlay')
      return overlayMenuActive;
  }
  return true;
}
</script>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
  }
}
</style>
