import { useServicesStore } from '@/stores/services';
import { useUserStore } from "../stores/user";
import { inject } from 'vue';
import _ from 'lodash';

// const servicesStore = useServicesStore();
let servicesStore;
let userStore;

export default class AxiosHelper {
  static defaultHeaders = {};
  static serverUrl = '';

  //static axiosInstance;

  init = (axiosInst) => {
    servicesStore = useServicesStore();
    userStore = useUserStore();

    AxiosHelper.axiosInstance = axiosInst;
    // AxiosHelper.appContext = context;
    AxiosHelper.defaultHeaders = servicesStore.serviceHeaders;
    AxiosHelper.serverUrl = servicesStore.serverUrl;
  };

  request = (config) => {
    // const axios = inject('axios');
    const axios = AxiosHelper.axiosInstance;

    return new Promise(async (resolve, reject) => {
      config.withCredentials = true;
      // Get the access token from the auth wrapper
      try {
        const token = await userStore.userToken;
        config.headers['Authorization'] = `Bearer ${token}`;
      } catch(e) {
        console.log(JSON.stringify(e));
      }

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

  post = (url, data, headers = AxiosHelper.defaultHeaders) => {
    const fullUrl = `${AxiosHelper.serverUrl}${url}`;
    return this.request({
      method: 'post',
      url: fullUrl,
      data: data,
      withCredentials: true,
      headers: headers
    });
  };

  put = (url, data, headers = AxiosHelper.defaultHeaders) => {
    const fullUrl = `${AxiosHelper.serverUrl}${url}`;
    return this.request({
      method: 'put',
      url: fullUrl,
      data: data,
      withCredentials: true,
      headers: headers
    });
  };

  save = (url, data) => {
    if(data.id) {
      return this.put(`${url}/${data.id}`, data);
    } else {
      return this.post(url, data);
    }
    // const recordUrl = data.id ? `/${data.id}` : '';
    // const fullUrl = `${AxiosHelper.serverUrl}${url}${recordUrl}`;
    // return this.request({
    //   method: (data.id ? 'put' : 'post'),
    //   url: fullUrl,
    //   data: data,
    //   withCredentials: true,
    //   headers: headers
    // });
  };
}
