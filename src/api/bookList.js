import {
  get,
  post
} from "./../util/http";

// 获取图书列表
export const getBookList = params => post("/book/queryList", params);
// 删除列表中的图书
export const delBook = params => post("/book/delBook", params);
// 获取所有图书分类
export const getBookType = (params) => post("/book/bookType",params);
// // 删除分类
// export const deleteClassify = params => post("/book/deleteClassify", params);
// 更新图书
export const updateBook = (params) => post("/book/updateBook", params);
// 上架
export const onShelf = (params) => post("/book/onShelf", params);
// 下架
export const offShelf = (params) => post("/book/offShelf", params);



// 添加图书
export const addBook = (params) => post("/book/addBook", params);
// 添加分类
export const addClassify = params => post("/book/addClassify", params);
// 批量上传Excel
export const uploadExcel = (params, config) => post("/book/uploadExcel", params, config);
// 下载批量上传模板
export const downloadBookTemplate = (params, config) => post("/book/downloadBookTemplate", params, config);
// 更改图书售卖状态
export const changeBookSellStatus = params => post("/book/changeBookSellStatus", params);
// 更新图书库存
export const updateBookStock = params => post("/book/updateBookStock", params);
// 分页查询进货记录
export const getStockRecordList = params => post("/book/getStockRecordList", params);
