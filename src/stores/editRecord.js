import { defineStore } from "pinia/dist/pinia";

export const useEditRecordStore = defineStore('editRecord', {
  state: () => ({
    editRecords: {}
  }),
  getters: {
    records: (state) => state.editRecords
  },
  actions: {
    create(path, data) {
      this.editRecords[path] = data;
    },
    clear(path) {
      delete this.editRecords[path];
    }
  }
})
