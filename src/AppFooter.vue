<template>
  <div class="layout-footer">
    <img alt="Logo" :src="footerImage()" height="20" class="mr-2" />
    by
    <span class="font-medium ml-2">PrimeVue</span>
  </div>
</template>

<script setup>
import {computed, inject} from "vue";

const globalProps = inject('globalProperties');
const appState = globalProps.$appState;
const name = "AppFooter";

const darkTheme = computed(() =>  {
  return appState.darkTheme;
})

function footerImage() {
  return appState.darkTheme ? 'images/logo-white.svg' : 'images/logo-dark.svg';
}
</script>
