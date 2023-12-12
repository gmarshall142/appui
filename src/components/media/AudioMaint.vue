<template>
	<div class="card">
		<h5>Audio Maintenance</h5>

    <transition-group name="p-message" tag="div">
      <Message v-for="msg of messages" :severity="msg.severity" :key="msg.id"
               :sticky="msg.sticky" :life="3000">{{msg.content}}</Message>
    </transition-group>
    <ConfirmDialog></ConfirmDialog>
    <Dialog v-model:visible="state.listDlg.visible" modal :header="state.listDlg.header" :style="{ width: '50vw' }">
      <Listbox v-model="state.listDlg.selected" :options="state.listDlg.records" optionLabel="title"
               class="p-invalid" aria-describedby="text-error"/>
      <div v-if="state.listDlg.error" style="text-align: center">
        <small id="text-error" class="p-error">{{ listErrorMessage || '&nbsp;' }}</small>
      </div>
      <div style="text-align: center; margin-top: 20px">
        <Button type="button" :label="state.listDlg.button" @click="handleBtnClick"/>
      </div>
    </Dialog>
    <Toast />

    <form @submit.prevent="handleSubmit(!v$.$invalid)">
      <div  class="grid p-fluid mt-3">
        <!-- Title / Search Button / Format / ID -->
        <div class="field col-12 md:col-6">
          <span class="p-float-label">
            <InputText type="text" id="title" v-model="state.record.title"
                       :class="{'p-invalid':v$.record.title.$invalid && submitted}" />
            <label for="title" :class="{'p-error':v$.record.title.$invalid && submitted}">Title*</label>
          </span>
        </div>
        <div class="field col-12 md:col-1">
          <Button type="button" label="Search" class="p-button-sm p-button-secondary" @click="handleSearch"/>
        </div>
        <div class="field col-12 md:col-1" />
        <div class="field col-12 md:col-2">
          <span class="p-float-label">
            <Dropdown id="format" :options="state.audioformats" v-model="state.record.audioformatid" show-clear
                      optionLabel="name" optionValue="id" @change=""
                      :class="{'p-invalid':v$.record.audioformatid.$invalid && submitted}" />
            <label for="format" :class="{'p-error':v$.record.audioformatid.$invalid && submitted}">Format*</label>
          </span>
        </div>
        <div class="field col-12 md:col-1" />
        <div class="field col-12 md:col-1">ID:&nbsp;&nbsp;{{ state.record.id }}</div>
        <!-- Discogs Query: Catalog no. / Refresh Button / Bar code -->
        <div class="field col-12 md:col-1"><b>Discogs</b></div>
        <div class="field col-12 md:col-2">
          <span class="p-float-label">
            <InputText type="text" id="catno" v-model="state.record.catno"
                       :class="{'p-invalid':v$.record.catno.$invalid && submitted}" />
            <label for="catno" :class="{'p-error':v$.record.catno.$invalid && submitted}">Catalog Number</label>
          </span>
        </div>
        <div class="field col-12 md:col-2">
          <span class="p-float-label">
            <InputText type="text" id="barcode" v-model="state.record.barcode"
                       :class="{'p-invalid':v$.record.barcode.$invalid && submitted}" />
            <label for="barcode" :class="{'p-error':v$.record.barcode.$invalid && submitted}">Bar Code</label>
          </span>
        </div>
        <div class="field col-12 md:col-2">
          <span class="p-float-label">
            <InputText type="text" id="searchArtist" v-model="state.searchArtist"/>
            <label for="searchArtist">Artist</label>
          </span>
        </div>
        <div class="field col-12 md:col-2">
          <span class="p-float-label">
            <InputText type="text" id="searchTitle" v-model="state.searchTitle"/>
            <label for="searchTitle">Title</label>
          </span>
        </div>
        <div class="field col-12 md:col-1">
          <Button type="button" label="Refresh" :disabled="refreshDisabled"
                  class="p-button-sm p-button-secondary" @click="handleDiscogs"/>
        </div>
        <div class="field col-12 md:col-1" />
        <div class="field col-12 md:col-1">ID:&nbsp;&nbsp;{{ state.record.discogsid }}</div>
        <!-- Notes -->
        <div class="field col-12 md:col-10">
          <span class="p-float-label">
            <Textarea id="notes" rows="2" v-model="state.record.notes" style="width: 100%"></Textarea>
            <label for="notes">Notes</label>
          </span>
        </div>
        <div class="field col-12 md:col-2">
          <span class="p-float-label">
            <InputText type="text" id="year" v-model="state.record.year"
                       :class="{'p-invalid':v$.record.year.$invalid && submitted}" />
            <label for="year" :class="{'p-error':v$.record.year.$invalid && submitted}">Year</label>
          </span>
        </div>
        <!-- Artists / Genres / Sort Name -->
        <div class="field col-12 md:col-6">
          <div class="field col-12 md:col-12">
            <span class="p-float-label">
              <Chips id="artists" v-model="state.record.artists" />
              <label for="artists">Artists</label>
            </span>
          </div>
          <div class="field col-12 md:col-12">
            <span class="p-float-label">
              <Chips id="genres" v-model="state.record.genres" />
              <label for="genres">Genres</label>
            </span>
          </div>

            <div class="field col-12 md:col-12">
              <span class="p-float-label p-input-icon-right">
                <i class="pi pi-refresh" @click="handleSort"/>
                <InputText type="text" id="sortname" v-model="state.record.sortname"
                           :class="{'p-invalid':v$.record.sortname.$invalid && submitted}" />
                <label for="sortname" :class="{'p-error':v$.record.sortname.$invalid && submitted}">Sort Name</label>
              </span>
              </div>
        </div>
        <!-- Thumbnail -->
        <div class="field col-12 md:col-6">
          <img style="display: block;-webkit-user-select: none;margin: auto;background-color: hsl(0, 0%, 90%);transition: background-color 300ms;"
               :src="state.record.imageurl" alt="" />
        </div>
      </div>
      <div class="field col-12 md:col-6" />
      <!-- Save / Delete / Clear -->
      <Button type="submit" label="Submit" class="button-bar p-button-sm"/>
      <Button type="button" label="Clear" class="button-bar p-button-sm p-button-secondary" @click="clear"/>
      <Button type="button" label="Delete" :disabled="state.record.id === null" class="button-bar p-button-sm p-button-danger" @click="confirmDeleteDlg"/>
    </form>
  </div>
  <div class="card" v-if="displayTracks">
    <h5>Tracks</h5>
    <DataTable ref="dt" :value="state.audioTracks" class="p-datatable-small p-datatable-gridlines"
               :rows="20" dataKey="id" :rowHover="true" removableSort
    >
      <Column field="position" header="Position" />
      <Column field="title" header="Title" />
      <Column field="duration" header="Duration">
        <template #body="{ data }">
          {{ durationDisplay(data.duration) }}
        </template>
      </Column>
    </DataTable>
  </div>
</template>

<script setup>
import { useEditRecordStore } from '@/stores/editRecord';
import {computed, onMounted, reactive, ref} from "vue";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { useDeleteConfirm } from "../../modules/common/ConfirmDialogs";
import { useMessages } from "../../modules/common/Messages";
import AxiosHelper from '../../modules/axiosHelper';
import _ from 'lodash';

const PATH = '/audiomaint';
const editRecordStore = useEditRecordStore();

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
  title: '',
  discogsid: null,
  sortname: '',
  catno: '',
  barcode: '',
  imageurl: null,
  genres: [],
  notes: '',
  artists: [],
  audioformatid: null
};
const { confirmDelete } = useDeleteConfirm();
const { messages, clearMessages, showMessage } = useMessages();
const toast = useToast();

const state = reactive({
  record: _.cloneDeep(emptyRecord),
  audioformats: [],
  listDlg: _.cloneDeep(emptyListDlg),
  audioTracks: [],
  searchArtist: '',
  searchTitle: '',
  lastFormat: null
});

const rules = {
  record: {
    catno: { },
    barcode: { },
    year: { },
    title: { required },
    sortname: { },
    audioformatid: { required }
  }
};
const v$ = useVuelidate(rules, state);

onMounted(() => {
  fetchAudioFormats();
  const editRecords = editRecordStore.records;
  const editRec = editRecords[PATH];
  editRecordStore.clear(PATH);
  if(editRec) {
    loadRecord(editRec);
  }
});

const clear = () => {
  clearMessages();
  state.record = _.cloneDeep(emptyRecord);
  state.listDlg = _.cloneDeep(emptyListDlg);
  state.audioTracks = [];
  state.searchArtist = '';
  state.searchTitle = ''
  state.record.audioformatid = state.lastFormat;
}

const refreshDisabled = computed(() => {
  return state.record.catno === ''
      && state.record.barcode === ''
      && state.searchArtist === ''
      && state.searchTitle === '';
})

const displayTracks = computed(() => {
  return state.audioTracks != null && state.audioTracks.length > 0;
})

const durationDisplay = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

const fetchAudioFormats = () => {
  state.audioformats = [];
  axiosHelper.get('/audio/formats')
    .then((response) => {
      state.audioformats = response.data;
    })
    .catch((err) => {
      showMessage('error', `Audio Formats ${err.message}`);
    });
}

const fetchAudioTracks = () => {
  state.audioTracks = [];
  axiosHelper.get(`/audio/tracks/${state.record.id}`)
      .then((response) => {
        state.audioTracks = response.data;
      })
      .catch((err) => {
        showMessage('error', `Audio Tracks ${err.message}`);
      });
}

const handleDiscogs = () => {
  let searchStr = '';
  let isFirst = true;
  if(state.record.catno !== '') {
    searchStr += `catno=${state.record.catno}`;
    isFirst = false;
  }
  if(state.record.barcode !== '') {
    if(!isFirst) searchStr += '&';
    searchStr += `barcode=${state.record.barcode}`;
    isFirst = false;
  }
  if(state.searchArtist !== '') {
    if(!isFirst) searchStr += '&';
    searchStr += `artist=${state.searchArtist}`;
    isFirst = false;
  }
  if(state.searchTitle !== '') {
    if(!isFirst) searchStr += '&';
    searchStr += `title=${state.searchTitle}`;
  }
  axiosHelper.get(`/audio/discogs?${searchStr}`)
    .then((response) => {
      loadRecord(response.data, "discogs");
    })
    .catch((err) => {
      showMessage('error', `Discogs fetch ${err.message}`);
    });
}

const handleSearch = () => {
  axiosHelper.get(`/audio/title/${state.record.title}`)
      .then((response) => {
        if(response.data.length === 1) {
          loadRecord(response.data[0])
        } else if(response.data.length > 1) {
          state.listDlg.records = response.data;
          state.listDlg.header = "Multiple Records";
          state.listDlg.button = "Edit"
          state.listDlg.visible = true;
        } else {
          showMessage('warn', 'No results found.', false);
        }
      })
      .catch((err) => {
        showMessage('error', `Search ${err.message}`);
      });
}

const handleBtnClick = () => {
  if(state.listDlg.button === "Create New") {
    return saveRecord();
  }

  if(!state.listDlg.selected) {
    state.listDlg.error = true;
  } else {
    loadRecord(state.listDlg.selected);
    state.listDlg = _.cloneDeep(emptyListDlg);
  }
}

const handleSort = () => {
  if(state.record.sortname === '') return;

  let arr = state.record.sortname.split(":");
  if(arr[0].includes(",")) {
    const arr2 = arr[0].split(',');
    if(arr2.length > 1) {
      const arr3 = arr2[1].split(' ');
      arr[0] = `${arr3[1].trim()} ${arr2[0]} ${_.join(_.slice(arr3, 2), ' ')}`;
    }
  } else {
    const arr2 = arr[0].split(' ');
    if(arr2.length > 1) {
      arr[0] = `${arr2[1]}, ${arr2[0]} ${_.join(_.slice(arr2, 2), ' ')}`;
    }
  }
  state.record.sortname = _.join(arr, ':');
}

const handleSubmit = (isFormValid) => {
  submitted.value = true;

  if (!isFormValid) {
    return;
  }

  if(state.record.id === null) {
    console.log('before submit');
    axiosHelper.get(`/audio/title/${state.record.title}`)
        .then((response) => {
          if(response.data.length > 0) {
            state.listDlg.records = response.data;
            state.listDlg.header = "Records with Title Exist";
            state.listDlg.button = "Create New"
            state.listDlg.visible = true;
          } else {
            saveRecord();
          }
        })
        .catch((err) => {
          showMessage('error', `Search ${err.message}`);
        });
  } else {
    saveRecord();
  }
}

const saveRecord = () => {
  clearMessages();

  const newRec = state.record.id === null;
  state.record.AudioTracks = state.audioTracks;
  state.lastFormat = state.record.audioformatid;
  axiosHelper.save('/audio', state.record)
      .then((response) => {
        state.record = response.data;
        clear();
        if(newRec) {
          showMessage('success', 'Audio created.', false);
        } else {
          showMessage('success', 'Audio updated.', false);
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

  axiosHelper.delete(`/audio/${state.record.id}`)
      .then((response) => {
        state.record = response.data;
        clear();
        showMessage('success', 'Audio deleted.', false)
      })
      .catch(() => {
        showMessage('error', 'Delete failed.')
      });

}

const handleReject = () => {
  toast.add({severity:'error', summary:'Cancel', detail:'Delete canceled.', life: 3000});
}

const loadRecord = (data, from) => {
  const rec = state.record;
  rec.imageurl = data.imageurl;
  rec.runtime = data.runtime;
  rec.artists = data.artists;
  rec.genres = data.genres;
  rec.notes = data.notes;
  rec.catno = data.catno;
  rec.barcode = data.barcode;
  rec.discogsid = data.discogsid;
  rec.year = data.year;
  if(from === 'discogs') {
    rec.title = data.title;
    const hasArtist = rec.artists.length > 0;
    if(hasArtist) {
      rec.sortname = `${rec.artists[0]} : ${rec.title}`;
    } else {
      rec.sortname = rec.title;
    }
    state.audioTracks = data.AudioTracks;
  } else {
    rec.id = data.id;
    rec.title = data.title.replaceAll('&#39;', '\'');
    rec.sortname = data.sortname;
    rec.audioformatid = data.audioformatid;
    fetchAudioTracks();
  }
}

</script>


<style scoped lang="css">
  .button-bar {
    width: 86px;
    margin-top: 20px;
    margin-right: 20px;
    text-align: center;
  }
  .radio-buttons label {
    margin-right: 20px;
  }
</style>
