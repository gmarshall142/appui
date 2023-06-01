<template>
	<div class="card">
		<h5>Video List</h5>

    <transition-group name="p-message" tag="div">
      <Message v-for="msg of messages" :severity="msg.severity" :key="msg.id"
               :sticky="msg.sticky" :life="3000">{{msg.content}}</Message>
    </transition-group>
    <Toast />

    <DataTable :value="state.videos" class="p-datatable-small p-datatable-gridlines" tableStyle="min-width: 50rem"
               :paginator="true" :rows="20" dataKey="id" :rowHover="true" removableSort editMode="row"
               v-model:filters="filters" filterDisplay="menu"
               :globalFilterFields="['title', 'VideoFormat.name', 'directors', 'genres', 'actors']"
               v-model:expandedRows="expandedRows" @rowExpand="onRowExpand" @rowCollapse="onRowCollapse"
    >
      <template #header>
        <div class="flex justify-content-between flex-column sm:flex-row">
          <Button type="button" icon="pi pi-filter-slash" label="Clear" class="p-button-outlined mb-2"
                  @click="clearFilter"/>
          <span class="p-input-icon-left mb-2">
            <i class="pi pi-search"/>
            <InputText v-model="filters['global'].value" placeholder="Keyword Search" style="width: 100%"/>
          </span>
        </div>
      </template>
      <Column expander style="width: 2rem" />
      <Column field="id" header="ID" sortable/>
      <Column field="title" header="Title" sortable>
        <template #body="{ data }">
          {{ data.title }}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by title" />
        </template>
      </Column>
      <Column field="VideoFormat.name" header="Format"
              :filterMenuStyle="{ width: '14rem' }" style="min-width: 12rem" sortable>
        <template #body="{ data }">
          {{ data.VideoFormat.name }}
        </template>
        <template #filter="{ filterModel }">
          <Dropdown v-model="filterModel.value" :options="state.videoformats" optionLabel="name" optionValue="name"
                    placeholder="Select One" class="p-column-filter" showClear>
          </Dropdown>
        </template>
      </Column>
      <Column field="directors" header="Directors">
        <template #body="{data}">
          {{makeStr(data.directors)}}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by genre" />
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
      <Column field="actors" header="Actors">
        <template #body="{data}">
          {{makeStr(data.actors)}}
        </template>
        <template #filter="{ filterModel, filterCallback }">
          <InputText v-model="filterModel.value" type="text" @input="filterCallback()" class="p-column-filter" placeholder="Search by genre" />
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

const EDIT_PATH = '/videomaint';
const editRecordStore = useEditRecordStore();

const axiosHelper = new AxiosHelper();
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
const { messages, clearMessages, showMessage } = useMessages();
const toast = useToast();
const filters = ref();
const expandedRows = ref([]);

const state = reactive({
  record: _.cloneDeep(emptyRecord),
  videoformats: [],
  listDlg: _.cloneDeep(emptyListDlg),
  videos: [],
  router: useRouter(),
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
  fetchVideos();
});

const clear = () => {
  clearMessages();
  state.record = _.cloneDeep(emptyRecord);
  state.listDlg = _.cloneDeep(emptyListDlg);
  state.videos = [];
}
const onRowExpand = (e) => {
  _.remove(expandedRows.value, it => it.id !== e.data.id );
}
const onRowCollapse = () => {}

const makeStr = (arr) => {
  return arr ? arr.toString() : null;
}

const fetchVideoFormats = () => {
  state.videoformats = [];
  axiosHelper.get('/video/formats')
      .then((response) => {
        state.videoformats = response.data;
      })
      .catch((err) => {
        showMessage('error', `Video Formats ${err.message}`);
      });
}

const fetchVideos = () => {
  state.videos = [];
  axiosHelper.get('/video')
    .then((response) => {
      state.videos = response.data;
      _.forEach(state.videos, it => it.title = it.title.replaceAll('&#39;', '\'').trim());
      state.videos = _.sortBy(state.videos, ['title']);
    })
    .catch((err) => {
      showMessage('error', `Videos ${err.message}`);
    });
}

const handleEdit = (itm) => {
  editRecordStore.create(EDIT_PATH, itm);
  state.router.push('/videomaint');
}

const saveRecord = () => {
  clearMessages();

  const newRec = state.record.id === null;
  axiosHelper.save('/video', state.record)
      .then((response) => {
        state.record = response.data;
        clear();
        if(newRec) {
          showMessage('success', 'Video created.', false);
        } else {
          showMessage('success', 'Video updated.', false);
        }
      })
      .catch(() => {
        showMessage('error', 'Save failed.')
      });
}

const initFilters = () => {
  filters.value = {
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    title: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    'VideoFormat.name': { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    directors: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
    genres: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    actors: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] }
  };
  expandedRows.value = [];
};

initFilters();

const clearFilter = () => {
  initFilters();
};

</script>

<style scoped lang="css">
</style>
