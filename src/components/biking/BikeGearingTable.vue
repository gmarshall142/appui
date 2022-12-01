<template>
  <div class="card">
    <div  class="grid p-fluid mt-3">
      <div class="field col-12 md:col-3" >
        <label for="cadence" style="margin-right: 20px">Cadence</label>
        <InputText type="text" id="cadence" v-model="config.cadence" style="width: 80px; height: 16px;" @change="calcData" />
      </div>
      <div class="field col-12 md:col-6" />
      <div class="field col-12 md:col-1">
        <span class="field-radiobutton">
          <RadioButton id="miles" inputId="miles" name="measure" value="Miles" v-model="config.measure" @change="calcData" />
          <label for="miles">Miles</label>
        </span>
      </div>
      <div class="field col-12 md:col-1">
        <span class="field-radiobutton">
          <RadioButton id="kilos" inputId="kilometers" name="measure" value="Kilos" v-model="config.measure" @change="calcData" />
          <label for="kilos">Kilos</label>
        </span>
      </div>
    </div>
<!--    <Chart type="line" :data="chartData" :options="chartOptions" :plugins="[verticalLine]" />-->
  </div>
</template>

<script setup>
import {watch, reactive, ref} from "vue";
import _ from "lodash";

const NEW_ID = 9999;
const props = defineProps({
  gearingState: {
    type: Object,
    default: () => {}
  }
});
const config = reactive({
  cadence: 70,
  measure: 'Miles'
});

const state = reactive(props.gearingState);

watch(() => state.bikeVal, () => {
  calcData();
});

const calcData = () => {
  console.log('calcData');
}

defineExpose({
  calcData
});
</script>
