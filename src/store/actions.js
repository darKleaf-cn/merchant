import * as types from "./mutations-types";
import { userInfo } from "./../api/user";
import { getStore } from "../util/storage";

const actions = {
  getUserInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      const token = state.userInfo.token || JSON.parse(getStore('userInfo')).token;
      userInfo({token}).then(res => {
        if (res.rtnCode === "200") {
          commit(types.SET_USERINFO, res.result);
          resolve(res);
        } else {
          reject(res);
        }
      }).catch(error => {
        reject(error);
      });
    });
  }
};

export default actions;