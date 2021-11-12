import {
  get,
  post
} from "./../util/http";

// 获取登录用户信息
export const getUserInfo = () => post("/getUserInfo");
