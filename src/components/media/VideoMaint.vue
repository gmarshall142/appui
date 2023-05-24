<template>
	<div class="card">
		<h5>Video Maintenance</h5>

    <transition-group name="p-message" tag="div">
      <Message v-for="msg of messages" :severity="msg.severity" :key="msg.id"
               :sticky="msg.sticky" :life="3000">{{msg.content}}</Message>
    </transition-group>
    <ConfirmDialog></ConfirmDialog>
    <Toast />

    <form @submit.prevent="handleSubmit(!v$.$invalid)">
      <div  class="grid p-fluid mt-3">
        <!-- Title / Find Button / Format / ID -->
        <div class="field col-12 md:col-6">
          <span class="p-float-label">
            <InputText type="text" id="title" v-model="state.record.title"
                       :class="{'p-invalid':v$.record.title.$invalid && submitted}" />
            <label for="title" :class="{'p-error':v$.record.title.$invalid && submitted}">Title*</label>
          </span>
        </div>
        <div class="field col-12 md:col-1">
          <Button type="button" label="Search" class="p-button-sm p-button-secondary" @click=""/>
        </div>
        <div class="field col-12 md:col-1" />
        <div class="field col-12 md:col-2">
          <span class="p-float-label">
            <Dropdown id="format" :options="state.videoformats" v-model="state.record.videoformatid" show-clear
                      optionLabel="name" optionValue="id" @change=""
                      :class="{'p-invalid':v$.record.videoformatid.$invalid && submitted}" />
            <label for="format" :class="{'p-error':v$.record.videoformatid.$invalid && submitted}">Format*</label>
          </span>
        </div>
        <div class="field col-12 md:col-1" />
        <div class="field col-12 md:col-1">ID:&nbsp;&nbsp;{{ state.record.id }}</div>
        <!-- IMDB / Refresh Button / Runtime -->
        <div class="field col-12 md:col-2">
          <span class="p-float-label">
            <InputText type="text" id="imdb" v-model="state.record.imdbid"
                       :class="{'p-invalid':v$.record.imdbid.$invalid && submitted}" />
            <label for="imdb" :class="{'p-error':v$.record.imdbid.$invalid && submitted}">IMDB ID</label>
          </span>
        </div>
        <div class="field col-12 md:col-1">
          <Button type="button" label="Refresh" class="p-button-sm p-button-secondary" @click="imdbHandler"/>
        </div>
        <div class="field col-12 md:col-4" />
        <div class="field col-12 md:col-1">Runtime</div>
        <div class="field col-12 md:col-2">
          <span class="p-float-label">
            <InputNumber id="runtime" v-model="state.record.runtime"
                         :class="{'p-invalid':v$.record.runtime.$invalid && submitted}" />
            <label for="runtime" :class="{'p-error':v$.record.runtime.$invalid && submitted}">(sec)</label>
          </span>
        </div>
        <div class="field col-12 md:col-1">Minutes:&nbsp;&nbsp;{{ state.record.runtime / 60 }}</div>
        <div class="field col-12 md:col-1" />
        <!-- Plot -->
        <div class="field col-12 md:col-12">
          <span class="p-float-label">
            <Textarea id="plot" rows="3" v-model="state.record.plot" style="width: 100%"></Textarea>
            <label for="plot">Plot</label>
          </span>
        </div>
        <!-- Actors / Genres -->
        <div class="field col-12 md:col-6">
          <span class="p-float-label">
            <Chips id="actors" v-model="state.record.actors" />
            <label for="actors">Actors</label>
          </span>
        </div>
        <div class="field col-12 md:col-6">
          <span class="p-float-label">
            <Chips id="genres" v-model="state.record.genres" />
            <label for="genres">Genres</label>
          </span>
        </div>
      </div>
      <!-- Save / Delete / Clear -->
      <Button type="submit" label="Submit" class="button-bar p-button-sm"/>
      <Button type="button" label="Clear" class="button-bar p-button-sm p-button-secondary" @click="clear"/>
      <Button type="button" label="Delete" :disabled="state.record.id === null" class="button-bar p-button-sm p-button-danger" @click="confirmDeleteDlg"/>
      <div class="radio-buttons-div">
      </div>
    </form>
  </div>
  <div class="card">
    <h5>IMDB Image</h5>
    <div class="grid p-fluid mt-3">
      <div class="field col-12 md:col-6">
        <div class="field col-12 md:col-1">URL:&nbsp;&nbsp;{{ state.record.imageurl }}</div>
        <div class="field col-12 md:col-1">Width:&nbsp;&nbsp;{{ state.record.imagewidth }}</div>
        <div class="field col-12 md:col-1">Height:&nbsp;&nbsp;{{ state.record.imageheight }}</div>
      </div>
      <div class="field col-12 md:col-6">
        <img style="display: block;-webkit-user-select: none;margin: auto;background-color: hsl(0, 0%, 90%);transition: background-color 300ms;"
             :src="state.record.imageurl"
             :width="imageWidth"
             :height="imageHeight">

      </div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, reactive, ref} from "vue";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { useDeleteConfirm } from "../../modules/common/ConfirmDialogs";
import { useMessages } from "../../modules/common/Messages";
import AxiosHelper from '../../modules/axiosHelper';
import _ from 'lodash';

const axiosHelper = new AxiosHelper();
const NEW_ID = 9999;
const gearingGraph = ref(null);
const gearingTable = ref(null);
const submitted = ref(false);
const emptyRim = {
  id: null,
  name: '',
  description: '',
  diameter: null
}
const emptyRecord = {
  id: null,
  imdbid: '',
  title: '',
  imageurl: null,
  imagewidth: null,
  imageheight: null,
  runtime: null,
  genres: [],
  plot: '',
  actors: [],
  videoformatid: 0
};
const { confirmDelete } = useDeleteConfirm();
const { messages, clearMessages, showMessage } = useMessages();
const toast = useToast();

const state = reactive({
  record: _.cloneDeep(emptyRecord),
  videoformats: []
  // displayImage: state.record.imageurl != null
});

const rules = {
  record: {
    imdbid: { },
    title: { required },
    runtime: { },
    videoformatid: { required }
  }
};
const v$ = useVuelidate(rules, state);

onMounted(() => {
  fetchVideoFormats();
  // fetchBikes();
});

function clear() {
  clearMessages();
  state.record = _.cloneDeep(emptyRecord);
  // state.bikeVal = null;
  // bikeHandler({ value: null });
}

const imageWidth = computed(() => {
  return modImageSize ? state.record.imagewidth * .4 : state.record.imagewidth;
})

const imageHeight = computed(() => {
  return modImageSize ? state.record.imageheight * .4 : state.record.imageheight;
})

function modImageSize() {
  return state.record.imagewidth > 400 || state.record.imageheight > 600;
}


function fetchVideoFormats() {
  state.videoformats = [];
  axiosHelper.get('/video/formats')
    .then((response) => {
      state.videoformats = response.data;
    })
    .catch((err) => {
      showMessage('error', `Video Formats ${err.message}`);
    });
}

// function fetchBikes(selectedId = null) {
//   state.bikes = [];
//   const options = [];
//   axiosHelper.get('/bikes')
//     .then((response) => {
//       state.bikes = response.data;
//       _.forEach(state.bikes, it => {
//         const itm = { name: it.name, id: it.id };
//         options.push(itm);
//       })
//       state.bikeOptions = [ { name: 'New', id: NEW_ID }].concat(_.sortBy(options, 'name'));
//       if(selectedId) {
//         state.bikeVal = selectedId;
//       }
//     })
//     .catch((err) => {
//       showMessage('error', `Bikes ${err.message}`);
//     });
// }

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
}

function imdbHandler() {
  axiosHelper.get(`/video/moviesdb/${state.record.imdbid}`)
    .then((response) => {
      console.log(JSON.stringify(response.data));
      const rec = state.record;
      const data = response.data;
      rec.title = data.name;
      rec.imageurl = data.imageurl;
      rec.imagewidth = data.imagewidth;
      rec.imageheight = data.imageheight;
      rec.runtime = data.runtime;
      rec.actors = data.actors;
      rec.genres = data.genres;
      rec.plot = data.plot;
    })
    .catch((err) => {
      showMessage('error', `IMDB fetch ${err.message}`);
    });
}

const handleSubmit = (isFormValid) => {
  submitted.value = true;

  if (!isFormValid) {
    return;
  }

  clearMessages();

  const newRec = state.record.id === null;
  axiosHelper.save('/bikes', state.record)
    .then((response) => {
      state.record = response.data;
      showMessage('success', 'Bike saved.', false)
      if(newRec) {
        // fetchBikes(state.record.id);
      } else {
        refreshDisplay();
      }
    })
    .catch(() => {
      showMessage('error', 'Save failed.')
    });
}

const confirmDeleteDlg = () => {
  confirmDelete('Do you want to delete this record?', 'Delete Confirmation', handleDelete, handleReject);
}

const handleDelete = () => {
  clearMessages();

  axiosHelper.delete(`/bikes/${state.record.id}`)
      .then((response) => {
        state.record = response.data;
        clear();
        showMessage('success', 'Bike deleted.', false)
        // fetchBikes(state.record.id);
      })
      .catch(() => {
        showMessage('error', 'Delete failed.')
      });

}

const handleReject = () => {
  toast.add({severity:'error', summary:'Cancel', detail:'Delete canceled.', life: 3000});
}

const createArray = (str) => {
  const arr = _.split(str, ',');
  const newArr = [];
  _.forEach(arr, it => newArr.push(Number(it)));
  return newArr;
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
