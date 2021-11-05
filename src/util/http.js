// 引入 axios
import axios from "axios";
import router from "@/router";

axios.defaults.baseURL = process.env.VUE_APP_URL
// 超时时间
axios.defaults.timeout = 10000;
axios.defaults.withCredentials = true;


export function get(url, params, config) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params: params
      }, config)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}

export function post(url, params, config) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params, config)
      .then(res => {
        resolve(res.data);
      })
      .catch(err => {
        reject(err.data);
      });
  });
}
