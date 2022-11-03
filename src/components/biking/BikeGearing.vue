<template>
	<div class="card">
		<h5>Bike Gearing</h5>
		<div class="grid p-fluid mt-3">
      <div class="field col-12 md:col-4">
				<span class="p-float-label">
					<Dropdown id="bikes" :options="bikeOptions" v-model="bikeVal" optionLabel="name" optionValue="id"></Dropdown>
					<label for="bikes">Bikes</label>
				</span>
      </div>
			<div class="field col-12 md:col-4">
				<span class="p-float-label">
					<InputText type="text" id="inputtext" v-model="value1" />
					<label for="inputtext">InputText</label>
				</span>
			</div>
			<div class="field col-12 md:col-4">
				<span class="p-float-label">
					<AutoComplete id="autocomplete" v-model="value2" :suggestions="filteredCountries" @complete="searchCountry($event)" field="name"></AutoComplete>
					<label for="autocomplete">AutoComplete</label>
				</span>
			</div>
			<div class="field col-12 md:col-4">
				<span class="p-float-label">
					<Calendar inputId="calendar" v-model="value3"></Calendar>
					<label for="calendar">Calendar</label>
				</span>
			</div>
			<div class="field col-12 md:col-4">
				<span class="p-float-label">
					<Chips inputId="chips" v-model="value4"></Chips>
					<label for="chips">Chips</label>
				</span>
			</div>
			<div class="field col-12 md:col-4">
				<span class="p-float-label">
					<InputMask id="inputmask" mask="99/99/9999" v-model="value5"></InputMask>
					<label for="inputmask">InputMask</label>
				</span>
			</div>
			<div class="field col-12 md:col-4">
				<span class="p-float-label">
					<InputNumber id="inputnumber" v-model="value6"></InputNumber>
					<label for="inputnumber">InputNumber</label>
				</span>
			</div>
			<div class="field col-12 md:col-4">
				<div class="p-inputgroup">
					<span class="p-inputgroup-addon">
						<i class="pi pi-user"></i>
					</span>
					<span class="p-float-label">
						<InputText type="text" id="inputgroup" v-model="value7" />
						<label for="inputgroup">InputGroup</label>
					</span>
				</div>
			</div>
			<div class="field col-12 md:col-4">
				<span class="p-float-label">
					<MultiSelect id="multiselect" :options="cities" v-model="value9" optionLabel="name" :filter="false"></MultiSelect>
					<label for="multiselect">MultiSelect</label>
				</span>
			</div>
			<div class="field col-12 md:col-4">
				<span class="p-float-label">
					<Textarea inputId="textarea" rows="3" cols="30" v-model="value10"></Textarea>
					<label for="textarea">Textarea</label>
				</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import AxiosHelper from '../../modules/axiosHelper';
import _ from 'lodash';

const axiosHelper = new AxiosHelper();
const countries = [];
const filteredCountries = null;
let bikes = ref(null);
const bikeOptions = ref(null);
const bikeVal = ref(null);

const cities = [
  { name: 'New York', code: 'NY' },
  { name: 'Rome', code: 'RM' },
  { name: 'London', code: 'LDN' },
  { name: 'Istanbul', code: 'IST' },
  { name: 'Paris', code: 'PRS' },
];


const value1 = null;
const value2 = null;
const value3 = null;
const value4 = null;
const value5 = null;
const value6 = null;
const value7 = null;
const value9 = null;
const value10 = null;
const value8 = ref(null);

onMounted(() => {
  fetchBikes();
});

function fetchBikes() {
  bikes = [];
  const options = [];
  axiosHelper.get('/bikes')
    .then((response) => {
      bikes = response.data;
      _.forEach(bikes, it => {
        const itm = { name: it.name, id: it.id };
        options.push(itm);
      })
      console.log(`bikeOptions: ${JSON.stringify(options)}`);
      bikeOptions.value = options;
    })
    .catch((err) => {
      // TODO: replace with alert
      // console.log(err.response.data);
    });
}
</script>
