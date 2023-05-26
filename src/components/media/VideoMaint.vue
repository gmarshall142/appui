<template>
	<div class="card">
		<h5>Video Maintenance</h5>

    <transition-group name="p-message" tag="div">
      <Message v-for="msg of messages" :severity="msg.severity" :key="msg.id"
               :sticky="msg.sticky" :life="3000">{{msg.content}}</Message>
    </transition-group>
    <ConfirmDialog></ConfirmDialog>
    <Dialog v-model:visible="state.listDlg.visible" modal header="Multiple Records" :style="{ width: '50vw' }">
      <Listbox v-model="state.listDlg.selected" :options="state.listDlg.records" optionLabel="title"
               class="p-invalid" aria-describedby="text-error"/>
      <div v-if="state.listDlg.error" style="text-align: center">
        <small id="text-error" class="p-error">{{ listErrorMessage || '&nbsp;' }}</small>
      </div>
      <div style="text-align: center; margin-top: 20px">
        <Button type="button" label="Edit" @click="editHandler"/>
      </div>
    </Dialog>
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
          <Button type="button" label="Search" class="p-button-sm p-button-secondary" @click="searchHandler"/>
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
            <Chips id="directors" v-model="state.record.directors" />
            <label for="directors">Directors</label>
          </span>
        </div>
        <!-- Genres -->
        <div class="field col-12 md:col-6">
          <span class="p-float-label">
            <Chips id="genres" v-model="state.record.genres" />
            <label for="genres">Genres</label>
          </span>
        </div>
      </div>
      <div class="field col-12 md:col-6" />
      <!-- Save / Delete / Clear -->
      <Button type="submit" label="Submit" class="button-bar p-button-sm"/>
      <Button type="button" label="Clear" class="button-bar p-button-sm p-button-secondary" @click="clear"/>
      <Button type="button" label="Delete" :disabled="state.record.id === null" class="button-bar p-button-sm p-button-danger" @click="confirmDeleteDlg"/>
    </form>
  </div>
  <div class="card" v-if="displayImage">
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
             :height="imageHeight" alt="" />
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
const listErrorMessage = "Select record to edit."
const submitted = ref(false);
const emptyListDlg = {
  visible: false,
  selected: null,
  records: [],
  error: false
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
  directors: [],
  videoformatid: null
};
const { confirmDelete } = useDeleteConfirm();
const { messages, clearMessages, showMessage } = useMessages();
const toast = useToast();

const state = reactive({
  record: _.cloneDeep(emptyRecord),
  videoformats: [],
  listDlg: _.cloneDeep(emptyListDlg),
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
});

function clear() {
  clearMessages();
  state.record = _.cloneDeep(emptyRecord);
  state.listDlg = _.cloneDeep(emptyListDlg);
}

const imageWidth = computed(() => {
  return state.record.imagewidth * getImageMod();
})

const imageHeight = computed(() => {
  return state.record.imageheight * getImageMod();
})

const displayImage = computed(() => {
  return state.record.imageurl != null;
})

function getImageMod() {
  return 600 / state.record.imageheight;
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

function imdbHandler() {
  axiosHelper.get(`/video/moviesdb/${state.record.imdbid}`)
    .then((response) => {
      loadRecord(response.data, "imdb");
    })
    .catch((err) => {
      showMessage('error', `IMDB fetch ${err.message}`);
    });
}

function searchHandler() {
  axiosHelper.get(`/video/title/${state.record.title}`)
      .then((response) => {
        if(response.data && response.data.length === 1) {
          loadRecord(response.data[0])
        } else if(response.data.length > 1) {
          state.listDlg.records = response.data;
          state.listDlg.visible = true;
        }
      })
      .catch((err) => {
        showMessage('error', `Search ${err.message}`);
      });
}

function editHandler() {
  if(!state.listDlg.selected) {
    state.listDlg.error = true;
  } else {
    loadRecord(state.listDlg.selected);
    state.listDlg = _.cloneDeep(emptyListDlg);
  }
}

function loadRecord(data, from) {
  const rec = state.record;
  rec.imageurl = data.imageurl;
  rec.imagewidth = data.imagewidth;
  rec.imageheight = data.imageheight;
  rec.runtime = data.runtime;
  rec.actors = data.actors;
  rec.genres = data.genres;
  rec.directors = data.directors;
  rec.plot = data.plot;
  if(from === 'imdb') {
    rec.title = data.title;
  } else {
    rec.id = data.id;
    rec.title = data.title.replaceAll('&#39;', '\'');
    rec.videoformatid = data.videoformatid;
    rec.imdbid = data.imdbid;
  }
}

const handleSubmit = (isFormValid) => {
  submitted.value = true;

  if (!isFormValid) {
    return;
  }

  clearMessages();

  const newRec = state.record.id === null;
  axiosHelper.save('/video', state.record)
    .then((response) => {
      state.record = response.data;
      clear();
      if(newRec) {
        showMessage('success', 'Video created.', false);
        // fetchBikes(state.record.id);
      } else {
        showMessage('success', 'Video updated.', false);
        // refreshDisplay();
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

  axiosHelper.delete(`/video/${state.record.id}`)
      .then((response) => {
        state.record = response.data;
        clear();
        showMessage('success', 'Video deleted.', false)
      })
      .catch(() => {
        showMessage('error', 'Delete failed.')
      });

}

const handleReject = () => {
  toast.add({severity:'error', summary:'Cancel', detail:'Delete canceled.', life: 3000});
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
