import {ref} from "vue";

export function useMessages() {
  const messages = ref([]);

  const clearMessages = () => {
    messages.value = [];
  }

  // const addMessage = () => {
  //   const msgId = messages.value.length + 1;
  //   const msg = `Bike Rims ${err.message}`;
  //   messages.value.push({ severity: 'error', content: msg, id: msgId });
  // }

  const showMessage = (level, msg, sticky=true) => {
    messages.value.push({ severity: level, content: msg, id: messages.value.length + 1, sticky: sticky });
  }

  return {
    messages,
    clearMessages,
    showMessage
  }
}
