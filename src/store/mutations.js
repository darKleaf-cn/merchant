import * as types from "./mutations-types";
import { setStore } from "../util/storage";

const mutations = {
  [types.SET_USERINFO](state, payload) {
    state.userInfo = payload;
    setStore('userInfo',payload);
  }
};

export default mutations;
