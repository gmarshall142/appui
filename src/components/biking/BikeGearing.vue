<template>
	<div class="card">
		<h5>Bike Gearing</h5>

    <transition-group name="p-message" tag="div">
      <Message v-for="msg of messages" :severity="msg.severity" :key="msg.id">{{msg.content}}</Message>
    </transition-group>

    <form @submit.prevent="handleSubmit(!v$.$invalid)">
      <div  class="grid p-fluid mt-3">
        <!-- Bike / ID -->
        <div class="field col-12 md:col-4">
          <span class="p-float-label">
            <Dropdown id="bikes" :options="state.bikeOptions" v-model="v$.bikeVal.$model" show-clear
                      optionLabel="name" optionValue="id" @change="bikeHandler"
                      :class="{'p-invalid':v$.bikeVal.$invalid && submitted}" />
            <label for="bikes" :class="{'p-error':v$.bikeVal.$invalid && submitted}">Bikes*</label>
          </span>
        </div>
        <div v-if="state.bikeVal === NEW_ID" class="field col-12 md:col-4">
          <span class="p-float-label">
            <InputText type="text" id="bikename" v-model="state.record.name"
                       :class="{'p-invalid':v$.record.name.$invalid && submitted}" />
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
                      optionLabel="name" optionValue="id" @change="rimHandler"
                      :class="{'p-invalid':v$.record.bikerimid.$invalid && submitted}" />
            <label for="bikerims" :class="{'p-error':v$.record.bikerimid.$invalid && submitted}">Bike Rims*</label>
          </span>
        </div>
        <div class="field col-12 md:col-1" />
        <div class="field col-12 md:col-1">Rim Diameter:&nbsp;&nbsp;{{ state.rim.diameter }}</div>
        <div class="field col-12 md:col-2" />
        <div class="field col-12 md:col-2">
          <span class="p-float-label">
            <InputNumber id="tiresize" v-model="state.record.tirewidth"
                         :class="{'p-invalid':v$.record.tirewidth.$invalid && submitted}" />
            <label for="tiresize" :class="{'p-error':v$.record.tirewidth.$invalid && submitted}">Tire Width (mm)*</label>
          </span>
        </div>
        <!-- Chainrings / Cogs -->
        <div class="field col-12 md:col-4">
          <span class="p-float-label">
            <InputText type="text" id="chainrings" v-model="state.record.chainrings"
                       :class="{'p-invalid':v$.record.chainrings.$invalid && submitted}" />
            <label for="chainrings" :class="{'p-error':v$.record.chainrings.$invalid && submitted}">Chain Rings*</label>
          </span>
        </div>
        <div class="field col-12 md:col-8">
          <span class="p-float-label">
            <InputText type="text" id="cogs" v-model="state.record.cogs"
                       :class="{'p-invalid':v$.record.cogs.$invalid && submitted}" />
            <label for="cogs" :class="{'p-error':v$.record.cogs.$invalid && submitted}">Cogs*</label>
          </span>
        </div>
      </div>
      <!-- Save / Clear -->
      <Button type="submit" label="Submit" class="button-bar p-button-sm" />
      <Button type="button" label="Clear" class="button-bar p-button-sm p-button-secondary" @click="clear" />
      <div class="radio-buttons-div">
        <span class="field-radiobutton radio-buttons">
          <RadioButton id="graph" inputId="graph" name="display" value="Graph"
                       v-model="state.display" @change="refreshDisplay" />
          <label for="graph">Graph</label>
        </span>
          <span class="field-radiobutton radio-buttons">
          <RadioButton id="table" inputId="table" name="display" value="Table"
                       v-model="state.display" @change="refreshDisplay" />
          <label for="table">Table</label>
        </span>
      </div>
    </form>
  </div>
  <bike-gearing-graph ref="gearingGraph" v-if="state.display === 'Graph'" :gearingState="state" :newID="NEW_ID" />
  <bike-gearing-table ref="gearingTable" v-if="state.display === 'Table'"  :gearingState="state" :newID="NEW_ID" />
</template>

<script setup>
import BikeGearingGraph from './BikeGearingGraph.vue';
import BikeGearingTable from './BikeGearingTable.vue';
import {computed, onMounted, reactive, ref} from "vue";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import AxiosHelper from '../../modules/axiosHelper';
import _ from 'lodash';

const axiosHelper = new AxiosHelper();
const NEW_ID = 9999;
const gearingGraph = ref(null);
const gearingTable = ref(null);
const messages = ref([]);
const submitted = ref(false);
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
  rim: _.cloneDeep(emptyRim),
  display: 'Graph'
});

const rules = {
  bikeVal: { required },
  bikeRimOptions: {},
  record: {
    name: { required },
    chainrings: { required },
    cogs: { required },
    bikerimid: { required },
    tirewidth: { required }
  }
};
const v$ = useVuelidate(rules, state);
// const chartOptions = ref(
//     {
//       indexAxis: 'y',
//       plugins: {
//         title: {
//           display: true,
//           text: 'Gearing Combinations'
//         },
//         legend: {
//           labels: {
//             color: '#495057'
//           }
//         },
//         verticalLine: {
//           dash: [2, 2],
//           color: 'ltgray',
//           width: 1
//         }
//       },
//       scales: {
//         x: {
//           title: {
//             text: 'Speed',
//             display: true
//           },
//           ticks: {
//             color: '#495057',
//             stepSize: 5
//           },
//           grid: {
//             color: '#ebedef'
//           }
//         },
//         y: {
//           title: {
//             text: 'Cogs',
//             display: true
//           },
//           ticks: {
//             color: '#495057',
//           },
//           grid: {
//             color: '#ebedef'
//           }
//         }
//       },
//     }
// );
// const chartData = ref(null);

onMounted(() => {
  fetchBikeRims();
  fetchBikes();
});

const bikeClass = computed(() => {
  const numCols = state.bikeVal === NEW_ID ? 3 : 7;
  return `field col-12 md:col-${numCols}`;
})

function clear() {
  messages.value = [];
  state.bikeVal = null;
  bikeHandler({ value: null });
}

function fetchBikeRims() {
  state.bikeRimOptions = [];
  axiosHelper.get('/bikerims')
    .then((response) => {
      state.bikeRimOptions = response.data;
    })
    .catch((err) => {
      const msgId = messages.value.length + 1;
      const msg = `Bike Rims ${err.message}`;
      messages.value.push({ severity: 'error', content: msg, id: msgId });
    });
}

function fetchBikes() {
  state.bikes = [];
  const options = [];
  axiosHelper.get('/bikes')
    .then((response) => {
      state.bikes = response.data;
      _.forEach(state.bikes, it => {
        const itm = { name: it.name, id: it.id };
        options.push(itm);
      })
      state.bikeOptions = [ { name: 'New', id: NEW_ID }].concat(_.sortBy(options, 'name'));
    })
    .catch((err) => {
      const msgId = messages.value.length + 1;
      const msg = `Bikes ${err.message}`;
      messages.value.push({ severity: 'error', content: msg, id: msgId });
    });
}

function rimHandler(e) {
  if(e.value !== state.bikeRimOptions.id) {
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

  console.log("****** handleSubmit");
}

const refreshDisplay = () => {
  setTimeout(() => {
    if(state.display === 'Graph') {
      gearingGraph.value.calcChartData();
    } else if(state.display === 'Table') {
      gearingTable.value.calcData();
    }
  }, 200);
}
</script>

<style scoped lang="css">
  .button-bar {
    width: 86px;
    margin-top: 20px;
    margin-right: 20px;
    text-align: center;
  }
  .radio-buttons-div {
    float: right;
    margin: 34px 0 0 0;
  }
  .radio-buttons {
    display: inline;
    margin-top: 20px;
  }
  .radio-buttons label {
    margin-right: 20px;
  }
</style>
