<template>
	<div class="card">
		<h5>Bike Gearing</h5>
    <form @submit.prevent="handleSubmit(!v$.$invalid)" class="grid p-fluid mt-3">
      <!-- Bike / ID -->
      <div class="field col-12 md:col-4">
        <span class="p-float-label">
          <Dropdown id="bikes" :options="state.bikeOptions" v-model="v$.bikeVal.$model" show-clear
                    optionLabel="name" optionValue="id" @change="bikeHandler"
                    :class="{'p-invalid':v$.bikeVal.$invalid && submitted}"></Dropdown>
          <label for="bikes" :class="{'p-error':v$.bikeVal.$invalid && submitted}">Bikes*</label>
        </span>
      </div>
      <div v-if="state.bikeVal === NEW_ID" class="field col-12 md:col-4">
        <span class="p-float-label">
          <InputText type="text" id="bikename" v-model="state.record.name"
                     :class="{'p-invalid':v$.record.name.$invalid && submitted}"/>
          <label for="bikename" :class="{'p-error':v$.record.name.$invalid && submitted}">Bike Name*</label>
        </span>
      </div>
      <div :class="bikeClass" />
      <div class="field col-12 md:col-1">ID:&nbsp;&nbsp;{{ state.record.id }}</div>
      <!-- Bike Rim / Tire Size -->
      <div class="field col-12 md:col-1">Rim Size</div>
      <div class="field col-12 md:col-3">
        <span class="p-float-label">
          <Dropdown id="bikerims" :options="state.bikeRimOptions" v-model="state.record.bikerimid" show-clear
                    optionLabel="name" optionValue="id" @change="rimHandler"></Dropdown>
          <label for="bikerims">Bike Rims*</label>
        </span>
      </div>
      <div class="field col-12 md:col-1" />
      <div class="field col-12 md:col-1">Rim Diameter:&nbsp;&nbsp;{{ state.rim.diameter }}</div>
      <div class="field col-12 md:col-2" />
      <div class="field col-12 md:col-4">
        <span class="p-float-label">
          <InputNumber id="tiresize" v-model="value6"></InputNumber>
          <label for="tiresize">Tire Size (mm)*</label>
        </span>
      </div>
      <!-- Chainrings / Cogs -->
      <div class="field col-12 md:col-4">
        <span class="p-float-label">
          <InputText type="text" id="chainrings" v-model="state.record.chainrings" />
          <label for="chainrings">Chain Rings*</label>
        </span>
      </div>
      <div class="field col-12 md:col-8">
        <span class="p-float-label">
          <InputText type="text" id="cogs" v-model="state.record.cogs" />
          <label for="cogs">Cogs*</label>
        </span>
      </div>
      <!-- Save / Clear -->
      <div class="field col-12 md:col-2">
        <Button type="submit" label="Submit" class="mt-2 p-button-sm" />
      </div>
      <div class="field col-12 md:col-2">
        <Button type="button" label="Clear" class="mt-2 p-button-sm" />
      </div>
    </form>
  </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import AxiosHelper from '../../modules/axiosHelper';
import _ from 'lodash';

const axiosHelper = new AxiosHelper();
const NEW_ID = 0;
const emptyRim = {
  id: null,
  name: '',
  description: '',
  diameter: null
}
const emptyRecord = {
  id: null,
  chainrings: [],
  cogs: [],
  bikerimid: null,
  tirewidth: null,
  BikeRim: _.cloneDeep(emptyRim)
};

const state = reactive({
  bikes: [],
  bikeOptions: [],
  bikeVal: null,
  bikeRimOptions: [],
  record: _.cloneDeep(emptyRecord),
  rim: _.cloneDeep(emptyRim)
});

const rules = {
  bikeVal: { required },
  bikeRimOptions: {},
  record: {
    name: { required },
  }
};
const v$ = useVuelidate(rules, state);
const submitted = ref(false);
const showMessage = ref(false);

const cities = [
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' },
];


const value6 = null;

onMounted(() => {
  fetchBikeRims();
  fetchBikes();
});

// const record = computed(() =>  {
//   return currRecord.value;
// })

// const rim = computed(() =>  {
//   return currRim.value;
// })

const bikeClass = computed(() => {
  const numCols = state.bikeVal === NEW_ID ? 3 : 7;
  return `field col-12 md:col-${numCols}`;
})

function fetchBikeRims() {
  state.bikeRimOptions = [];
  axiosHelper.get('/bikerims')
    .then((response) => {
      state.bikeRimOptions = response.data;
    })
    .catch((err) => {
      // TODO: replace with alert
      // console.log(err.response.data);
    });
}

function fetchBikes() {
  state.bikes = [];
  const options = [{ id: 0, name: 'New' }];
  axiosHelper.get('/bikes')
    .then((response) => {
      state.bikes = response.data;
      _.forEach(state.bikes, it => {
        const itm = { name: it.name, id: it.id };
        options.push(itm);
      })
      state.bikeOptions = options;
    })
    .catch((err) => {
      // TODO: replace with alert
      // console.log(err.response.data);
    });
}

function rimHandler(e) {
  if(e.value !== state.bikeRimOptions.id) {
    console.log(`rimHandler: ${JSON.stringify(e)}`);
    state.rim = _.cloneDeep(emptyRim);
    const fnd = _.find(state.bikeRimOptions, it => it.id === e.value);
    if(fnd) {
      state.rim = fnd;
    }
  }
}

function bikeHandler(e) {
  const val = e.value;
  if(val === null || val === NEW_ID) {
    state.record = _.cloneDeep(emptyRecord);
  } else if(val !== state.record.id) {
    const fnd = _.find(state.bikes, it => it.id === val);
    if(fnd) {
      state.record = fnd;
    }
  }
  rimHandler({ value: state.record.bikerimid });
}

const handleSubmit = (isFormValid) => {
  submitted.value = true;

  if (!isFormValid) {
    return;
  }

  toggleDialog();
}
const toggleDialog = () => {
  showMessage.value = !showMessage.value;

  if(!showMessage.value) {
    resetForm();
  }
}

const resetForm = () => {

}

</script>
