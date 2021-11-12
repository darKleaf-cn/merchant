import {
  get,
  post
} from "./../util/http";

// 查询订单
export const getOrderList = params => post("/order/queryList", params);
//删除订单
export const delOrder = params => post("/order/delOrder", params);
//修改订单
export const updateOrder = params => post("/order/updateOrder", params);
