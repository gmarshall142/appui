<template>
  <div class="layout-menu-container">
    <AppSubmenu
        :items="model"
        class="layout-menu"
        :root="true"
        @menuitem-click="onMenuItemClick"
        @keydown="onKeyDown"
    />
    <a href="https://www.primefaces.org/primeblocks-vue" class="block mt-3">
      <img alt="primeblocks" :src="bannerImage()" class="w-full" />
    </a>
  </div>
</template>

<script setup>
import AppSubmenu from './AppSubmenu.vue'
import {computed, inject} from "vue";

const props = defineProps({
  model: Array
});
const emit = defineEmits(['menuitem-click']);
const globalProps = inject('globalProperties');
const appState = globalProps.$appState;

const darkTheme = computed(() =>  {
  return appState.darkTheme;
})

function onMenuItemClick(event) {
  emit('menuitem-click', event)
}

function onKeyDown(event) {
  const nodeElement = event.target
  if (event.code === 'Enter' || event.code === 'Space') {
    nodeElement.click()
    event.preventDefault()
  }
}

function bannerImage() {
  return appState.darkTheme
      ? 'images/banner-primeblocks-dark.png'
      : 'images/banner-primeblocks.png'
}
</script>
