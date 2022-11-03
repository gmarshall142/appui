import { useServicesStore } from '@/stores/services';
import { inject } from 'vue';
import _ from 'lodash';

// const servicesStore = useServicesStore();
let servicesStore;

export default class AxiosHelper {
  static defaultHeaders = {};
  static serverUrl = '';

  //static axiosInstance;

  init = (axiosInst) => {
    servicesStore = useServicesStore();

    //AxiosHelper.axiosInstance = axiosInst;
    // AxiosHelper.appContext = context;
    AxiosHelper.defaultHeaders = servicesStore.serviceHeaders;
    AxiosHelper.serverUrl = servicesStore.serverUrl;
  };

  request = (config) => {
    const axios = inject('axios');

    return new Promise(async (resolve, reject) => {
      config.withCredentials = true;
      // Get the access token from the auth wrapper
      try {
        const token = '';
        // const token = await AxiosHelper.appContext.$auth.getTokenSilently();
//    const token = await Auth0Plugin.getTokenSilently()
//         config.headers['Authorization'] = `Bearer ${token}`;
      } catch(e) {}

      axios(config)
        .then((response) => {
          resolve(response);
        })
        .catch((err) => {
          // console.error(err);
          // if(err.response && err.response.status === 401) {
          //   setTimeout(() => {
          //     AxiosHelper.appContext.login();
          //   }, 10);
          // }
          // AxiosHelper.appContext.$store.dispatch('log', { level: 'error', data: err });
          reject(err);
        });
    });
  };

  get = (url, headers = AxiosHelper.defaultHeaders) => {
    const fullUrl = `${AxiosHelper.serverUrl}${url}`;
    return this.request({
      method: 'get',
      url: fullUrl,
      withCredentials: true,
      headers: headers
    });
  };

}
