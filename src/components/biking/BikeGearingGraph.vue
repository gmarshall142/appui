<template>
  <div class="card">
    <div  class="grid p-fluid mt-3">
      <div class="field col-12 md:col-3" >
        <label for="cadence" style="margin-right: 20px">Cadence</label>
        <InputText type="text" id="cadence" v-model="config.cadence" style="width: 80px; height: 16px;" @change="calcChartData" />
      </div>
      <div class="field col-12 md:col-6" />
      <div class="field col-12 md:col-1">
        <span class="field-radiobutton">
          <RadioButton id="miles" inputId="miles" name="measure" value="Miles" v-model="config.measure" @change="calcChartData" />
          <label for="miles">Miles</label>
        </span>
      </div>
      <div class="field col-12 md:col-1">
        <span class="field-radiobutton">
          <RadioButton id="kilos" inputId="kilometers" name="measure" value="Kilos" v-model="config.measure" @change="calcChartData" />
          <label for="kilos">Kilos</label>
        </span>
      </div>
    </div>
    <Chart type="line" :data="chartData" :options="chartOptions" :plugins="[verticalLine]" />
  </div>
</template>

<script setup>
import {watch, reactive, ref} from "vue";
import { verticalLine } from './VerticalLine';
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
const chartOptions = ref(
    {
      indexAxis: 'y',
      plugins: {
        title: {
          display: true,
          text: 'Gearing Combinations'
        },
        legend: {
          labels: {
            color: '#495057'
          }
        },
        verticalLine: {
          dash: [2, 2],
          color: 'ltgray',
          width: 1
        }
      },
      scales: {
        x: {
          title: {
            text: 'Speed',
            display: true
          },
          ticks: {
            color: '#495057',
            stepSize: 5
          },
          grid: {
            color: '#ebedef'
          }
        },
        y: {
          title: {
            text: 'Cogs',
            display: true
          },
          ticks: {
            color: '#495057',
          },
          grid: {
            color: '#ebedef'
          }
        }
      },
    }
);
const chartData = ref(null);
const colors = ['#42A5F5', '#FFA726'];

const state = reactive(props.gearingState);

watch(() => state.bikeVal, () => {
  calcChartData();
});

const calcChartData = () => {
  chartData.value = [];
  if(state.bikeVal !== null && state.bikeVal !== NEW_ID) {
    const r = state.rim.diameter;
    const t = state.record.tirewidth;
    const d = 3.13772 * (2 * t + r);
    const circumMeters = Math.round(d / 1000);
    const gears = state.record.chainrings;
    const cogs = state.record.cogs;
    const datasets = [];
    // vals.push({ x: cog, y: speedKilos });
    _.forEach(gears, (gear, idx) => {
      const vals = [];
      _.forEach(cogs, cog => {
        const speedMeters = circumMeters * (gear / cog) * config.cadence * 60;
        const speedKilos = speedMeters / 1000;
        let speed = speedKilos;
        if(config.measure === 'Miles') {
          speed = speedKilos * 0.621371;
        }
        vals.push({ x: speed.toFixed(2), y: cog });
      })
      datasets.push({
        label: `${gear} Teeth`,
        fill: false,
        borderColor: colors[idx],
        tension: .4,
        data: vals.reverse()
      });
    })

    const min = _.minBy(datasets[0].data, it => it.x).x;
    const max = _.maxBy(datasets[datasets.length - 1].data, it => Math.round(it.x)).x;
    let count = min - min % 5;
    const labels = [String(count)];
    while(count < max) {
      labels.push(String(count += 5));
    }
    chartOptions.value.scales.x.count = cogs.length;
    chartOptions.value.scales.y.labels = cogs;
    chartData.value = {
      datasets: datasets
    }
  }
}
</script>
