import { useConfirm } from "primevue/useconfirm";

export function useDeleteConfirm() {
  const confirm = useConfirm();

  const confirmDelete = (msg, hdr, handleDelete, handleReject) => {
    confirm.require({
      message: msg,
      header: hdr,
      icon: 'pi pi-info-circle',
      acceptClass: 'p-button-danger',
      accept: () => {
        handleDelete();
      },
      reject: () => {
        handleReject();
      }
    });
  }

  return {
    confirmDelete
  }
}
