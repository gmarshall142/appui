<template>
  <div id="layout-config" ref="root" :class="containerClass">
    <a href="#" class="layout-config-button" id="layout-config-button" @click="toggleConfigurator">
      <i class="pi pi-cog"></i>
    </a>
    <Button class="p-button-danger layout-config-close p-button-rounded p-button-text" icon="pi pi-times" @click="hideConfigurator" :style="{'z-index': 1}"></Button>

    <div class="layout-config-content">
      <h5 class="mt-0">Component Scale</h5>
      <div class="config-scale">
        <Button icon="pi pi-minus" @click="decrementScale()" class="p-button-text" :disabled="scale === scales[0]"/>
        <i class="pi pi-circle-on" v-for="s of scales" :class="{'scale-active': s === scale}" :key="s"/>
        <Button icon="pi pi-plus"  @click="incrementScale()" class="p-button-text" :disabled="scale === scales[scales.length - 1]" />
      </div>

      <h5>Input Style</h5>
      <div class="p-formgroup-inline">
        <div class="field-radiobutton">
          <RadioButton id="input_outlined" name="inputstyle" value="outlined" :modelValue="$primevue.config.inputStyle" @change="changeInputStyle('outlined')" />
          <label for="input_outlined">Outlined</label>
        </div>
        <div class="field-radiobutton">
          <RadioButton id="input_filled" name="inputstyle" value="filled" :modelValue="$primevue.config.inputStyle" @change="changeInputStyle('filled')" />
          <label for="input_filled">Filled</label>
        </div>
      </div>

      <h5>Ripple Effect</h5>
      <InputSwitch :modelValue="rippleActive" @update:modelValue="changeRipple" />

      <h5>Menu Type</h5>
      <div class="p-formgroup-inline">
        <div class="field-radiobutton">
          <RadioButton id="static" name="layoutMode" value="static" v-model="d_layoutMode" @change="changeLayout($event, 'static')" />
          <label for="static">Static</label>
        </div>
        <div class="field-radiobutton">
          <RadioButton id="overlay" name="layoutMode" value="overlay" v-model="d_layoutMode" @change="changeLayout($event, 'overlay')" />
          <label for="overlay">Overlay</label>
        </div>
      </div>

      <h5>Themes</h5>
      <h6 class="mt-0">Bootstrap</h6>
      <div class="grid free-themes">
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'bootstrap4-light-blue', false)">
            <img class="block" src="/images/themes/bootstrap4-light-blue.svg" alt="Bootstrap Light Blue" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'bootstrap4-light-purple', false)">
            <img class="block" src="/images/themes/bootstrap4-light-purple.svg" alt="Bootstrap Light Blue" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'bootstrap4-dark-blue', true)">
            <img class="block" src="/images/themes/bootstrap4-dark-blue.svg" alt="Bootstrap Dark Blue" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'bootstrap4-dark-purple', true)">
            <img class="block" src="/images/themes/bootstrap4-dark-purple.svg" alt="Bootstrap Dark Blue" />
          </button>
        </div>
      </div>

      <h6>Material Design</h6>
      <div class="grid free-themes">
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'md-light-indigo', false)">
            <img class="block" src="/images/themes/md-light-indigo.svg" alt="Material Light Indigo" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'md-light-deeppurple', false)">
            <img class="block" src="/images/themes/md-light-deeppurple.svg" alt="Material Light Deep Purple" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'md-dark-indigo', true)">
            <img class="block" src="/images/themes/md-dark-indigo.svg" alt="Material Dark Indigo" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'md-dark-deeppurple', true)">
            <img class="block" src="/images/themes/md-dark-deeppurple.svg" alt="Material Dark Deep Purple" />
          </button>
        </div>
      </div>

      <h6>Material Design Compact</h6>
      <div class="grid free-themes">
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'mdc-light-indigo', false)">
            <img class="block" src="/images/themes/md-light-indigo.svg" alt="Material Compact Light Indigo"/>
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'mdc-light-deeppurple', false)">
            <img class="block" src="/images/themes/md-light-deeppurple.svg" alt="Material Compact Deep Purple" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'mdc-dark-indigo', true)">
            <img class="block" src="/images/themes/md-dark-indigo.svg" alt="Material Compact Dark Indigo" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'mdc-dark-deeppurple', true)">
            <img class="block" src="/images/themes/md-dark-deeppurple.svg" alt="Material Compact Dark Deep Purple" />
          </button>
        </div>
      </div>

      <h6>Tailwind</h6>
      <div class="grid free-themes">
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'tailwind-light', false)">
            <img class="block" src="/images/themes/tailwind-light.png" alt="Tailwind Light"/>
          </button>
        </div>
      </div>

      <h6>Fluent UI</h6>
      <div class="grid free-themes">
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'fluent-light', false)">
            <img class="block" src="/images/themes/fluent-light.png" alt="Fluent Light"/>
          </button>
        </div>
      </div>

      <h6>PrimeOne Design - 2022</h6>
      <div class="grid free-themes">
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'lara-light-indigo', false)">
            <img class="block" src="/images/themes/lara-light-indigo.png" alt="Lara Light Indigo" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'lara-light-blue', false)">
            <img class="block" src="/images/themes/lara-light-blue.png" alt="Lara Light Blue" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'lara-light-purple', false)">
            <img class="block" src="/images/themes/lara-light-purple.png" alt="Lara Light Purple" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'lara-light-teal', false)">
            <img class="block" src="/images/themes/lara-light-teal.png" alt="Lara Light Teal" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'lara-dark-indigo', true)">
            <img class="block" src="/images/themes/lara-dark-indigo.png" alt="Lara Dark Indigo" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'lara-dark-blue', true)">
            <img class="block" src="/images/themes/lara-dark-blue.png" alt="Lara Dark Blue" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'lara-dark-purple', true)">
            <img class="block" src="/images/themes/lara-dark-purple.png" alt="Lara Dark Purple" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'lara-dark-teal', true)">
            <img class="block" src="/images/themes/lara-dark-teal.png" alt="Lara Dark Teal" />
          </button>
        </div>
      </div>

      <h6>PrimeOne Design - 2021</h6>
      <div class="grid free-themes">
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'saga-blue', false)">
            <img class="block" src="/images/themes/saga-blue.png" alt="Saga Blue" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'saga-green', false)">
            <img class="block" src="/images/themes/saga-green.png" alt="Saga Green" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'saga-orange', false)">
            <img class="block" src="/images/themes/saga-orange.png" alt="Saga Orange" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'saga-purple', false)">
            <img class="block" src="/images/themes/saga-purple.png" alt="Saga Purple" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'vela-blue', true)">
            <img class="block" src="/images/themes/vela-blue.png" alt="Vela Blue" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'vela-green', true)">
            <img class="block" src="/images/themes/vela-green.png" alt="Vela Green" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'vela-orange', true)">
            <img class="block" src="/images/themes/vela-orange.png" alt="Vela Orange" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'vela-purple', true)">
            <img class="block" src="/images/themes/vela-purple.png" alt="Vela Purple" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'arya-blue', true)">
            <img class="block" src="/images/themes/arya-blue.png" alt="Arya Blue" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'arya-green', true)">
            <img class="block" src="/images/themes/arya-green.png" alt="Arya Green" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'arya-orange', true)">
            <img class="block" src="/images/themes/arya-orange.png" alt="Arya Orange" />
          </button>
        </div>
        <div class="col-3 text-center">
          <button class="p-link" type="button" @click="changeTheme($event, 'arya-purple', true)">
            <img class="block" src="/images/themes/arya-purple.png" alt="Arya Purple" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import EventBus from './AppEventBus';
import {inject, onMounted, onBeforeUnmount, watch, ref, reactive, computed} from "vue";
import {useRoute} from "vue-router/dist/vue-router";

const props = defineProps({
  layoutMode: {
    type: String,
    default: null
  }
});
const root = ref(null);
const state = reactive({
  active: false
})

const route = useRoute();
const emit = defineEmits(['layout-change', 'theme-change']);
const globalProps = inject('globalProperties');
const appState = globalProps.$appState;
const primevue = globalProps.$primevue;

let d_layoutMode = props.layoutMode;
let scale = 14;
const scales = [12,13,14,15,16];
let outsideClickListener = null;
let themeChangeListener = null;
let el = null;

onMounted(() => {
  themeChangeListener = () => {
    applyScale();
  };

  el = root.value.children[0];
  EventBus.on('theme-change', themeChangeListener);
});
onBeforeUnmount(() => {
  EventBus.off('theme-change', themeChangeListener);
});

watch(() => route.name, () => {
  if(state.active) {
    state.active = false;
    unbindOutsideClickListener();
  }
});
watch(() => __props.layoutMode, (newValue) => {
  d_layoutMode = newValue;
});

const containerClass = computed(() => {
  return ['layout-config', {'layout-config-active': state.active}];
});
const rippleActive = computed(() => {
  return primevue.config.ripple;
});
const inputStyle = computed(() => {
  return appState.inputStyle;
});

function toggleConfigurator(event) {
  state.active = !state.active;
  event.preventDefault();

  if(state.active)
    bindOutsideClickListener();
  else
    unbindOutsideClickListener();
}
function hideConfigurator(event) {
  state.active = false;
  unbindOutsideClickListener();
  event.preventDefault();
}
function changeInputStyle(value) {
  primevue.config.inputStyle = value;
}
function changeRipple(value) {
  primevue.config.ripple = value;
}

function changeLayout(event, mode) {
  emit('layout-change', mode);
  event.preventDefault();
}

function bindOutsideClickListener() {
  if(!outsideClickListener) {
    outsideClickListener = (event) => {
      if(state.active && isOutsideClicked(event)) {
        state.active = false;
      }
    };
    document.addEventListener('click', outsideClickListener);
  }
}
function unbindOutsideClickListener() {
  if(outsideClickListener) {
    document.removeEventListener('click', outsideClickListener);
    outsideClickListener = null;
  }
}
function isOutsideClicked(event) {
  return !(el.isSameNode(event.target) || el.contains(event.target));
}
function decrementScale() {
  scale--;
  applyScale();
}
function incrementScale() {
  scale++;
  applyScale();
}
function applyScale() {
  document.documentElement.style.fontSize = scale + 'px';
}
function changeTheme(event, theme, dark) {
  EventBus.emit('theme-change', { theme: theme, dark: dark });
  event.preventDefault();
}
</script>
