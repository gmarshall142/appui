<template>
	<div class="card">
		<h5>Audio List</h5>

    <transition-group name="p-message" tag="div">
      <Message v-for="msg of messages" :severity="msg.severity" :key="msg.id"
               :sticky="msg.sticky" :life="3000">{{msg.content}}</Message>
    </transition-group>
    <Toast />

    <DataTable ref="dt" :value="state.audios" class="p-datatable-small p-datatable-gridlines" tableStyle="min-width: 50rem"
               :paginator="true" :rows="20" dataKey="id" :rowHover="true" removableSort editMode="row"
               v-model:filters="filters" filterDisplay="menu"
               :globalFilterFields="['title', 'AudioFormat.name', 'directors', 'genres', 'actors']"
               v-model:expandedRows="expandedRows" @rowExpand="onRowExpand" @rowCollapse="onRowCollapse"
    >
      <template #header>
        <div class="flex justify-content-between flex-column sm:flex-row">
          <Button type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2"
                  @click="clearFilter"/>
          <Button icon="pi pi-external-link" label="Export" class="p-button-outlined mb-2" @click="exportCSV($event)" />
          <span class="p-input-icon-left mb-2">
            <i class="pi pi-search"/>
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" style="width: 100%"/>
          </span>
        </div>
      </template>
      <Column expander style="width: 2rem" />
      <Column field="id" header="ID" sortable/>
      <Column field="sortname" header="Sort Name" sortable>
        <template #body="{ data }">
          {{ data.sortname }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by sort name" />
        </template>
      </Column>
      <Column field="title" header="Title" sortable>
        <template #body="{ data }">
          {{ data.title }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by title" />
        </template>
      </Column>
      <Column field="AudioFormat.name" header="Format"
              :filterMenuStyle="{ width: '4rem' }" style="min-width: 4rem" sortable>
        <template #body="{ data }">
          {{ data.AudioFormat.name }}
        </template>
        <template #filter="{ filterModel }">
          <Dropdown v-model="filterModel.value" :options="state.audioformats" optionLabel="name" optionValue="name"
                    placeholder="Select One" class="p-column-filter" showClear>
          </Dropdown>
        </template>
      </Column>
      <Column field="genres" header="Genres">
        <template #body="{data}">
          {{makeStr(data.genres)}}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by genre" />
        </template>
      </Column>
      <Column field="artists" header="Artists">
        <template #body="{data}">
          {{makeStr(data.artists)}}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by Artist" />
        </template>
      </Column>
      <Column headerStyle="min-width:2rem;" bodyStyle="text-align:center">
        <template #body="slotProps">
          <Button icon="pi pi-pencil" class="p-button-rounded p-button-text mr-2 mb-2"
                  @click="handleEdit(slotProps.data)" aria-label="Edit" />
        </template>
      </Column>
      <template #expansion="slotProps">
        <div class="p-3">
          <span><b>Runtime:</b>&nbsp;&nbsp;<span>{{ slotProps.data.runtime / 60}}</span>&nbsp;&nbsp;Minutes</span>
          <span style="margin-left: 40px;"><b>Plot:&nbsp;&nbsp;</b>{{ slotProps.data.plot }}</span>
        </div>
      </template>
    </DataTable>
  </div>
</template>

<script setup>
import { useEditRecordStore } from '@/stores/editRecord';
import { useRouter } from 'vue-router';
import { FilterMatchMode, FilterOperator } from 'primevue/api';
import {onMounted, reactive, ref} from "vue";
import { required } from "@vuelidate/validators";
import { useVuelidate } from "@vuelidate/core";
import { useToast } from "primevue/usetoast";
import { useMessages } from "../../modules/common/Messages";
import AxiosHelper from '../../modules/axiosHelper';
import _ from 'lodash';

const EDIT_PATH = '/audiomaint';
const editRecordStore = useEditRecordStore();

const axiosHelper = new AxiosHelper();
const { messages, clearMessages, showMessage } = useMessages();
const toast = useToast();
const filters = ref();
const expandedRows = ref([]);
const dt = ref();

const state = reactive({
  audioformats: [],
  audios: [],
  router: useRouter(),
});

const rules = {
  record: {
    imdbid: { },
    title: { required },
    runtime: { },
    audioformatid: { required }
  }
};
const v$ = useVuelidate(rules, state);

onMounted(() => {
  fetchAudioFormats();
  fetchAudios();
});

const clear = () => {
  clearMessages();
  state.audios = [];
}
const onRowExpand = (e) => {
  _.remove(expandedRows.value, it => it.id !== e.data.id );
}
const onRowCollapse = () => {}

const makeStr = (arr) => {
  return arr ? arr.toString() : null;
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

const fetchAudios = () => {
  state.audios = [];
  axiosHelper.get('/audio')
    .then((response) => {
      state.audios = response.data;
      _.forEach(state.audios, it => it.title = it.title.replaceAll('&#39;', '\'').trim());
      state.audios = _.sortBy(state.audios, ['sortname']);
    })
    .catch((err) => {
      showMessage('error', `Audios ${err.message}`);
    });
}

const handleEdit = (itm) => {
  editRecordStore.create(EDIT_PATH, itm);
  state.router.push(EDIT_PATH);
}

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    sortname: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    title: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    'AudioFormat.name': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    genres: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    artists: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
  };
  expandedRows.value = [];
};

initFilters();

const clearFilter = () => {
  initFilters();
};

const exportCSV = () => {
  dt.value.exportCSV();
};

</script>

<style scoped lang="css">
</style>
