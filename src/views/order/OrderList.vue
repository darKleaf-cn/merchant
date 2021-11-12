<template>
  <div class="orderList">
    <div class="filter-search">
      <el-input placeholder="订单号" size="medium" v-model.trim="searchParam.orderId" clearable
        @keyup.native.enter="search">
      </el-input>
      <el-button type="primary" size="medium" icon="el-icon-search" @click.native="search">搜索
      </el-button>
      <el-button type="danger" size="medium" @click.native="resetSearch">重置
      </el-button>
    </div>
    <div class="table-container">
      <el-table size="mini" v-loading="loading" :data="orderList" :header-cell-style="{ background: '#fdfdfd' }"
        :height="460" border>
        <el-table-column prop="orderId" align="center" label="订单号"></el-table-column>
        <el-table-column align="center" label="订单状态">
          <template slot-scope="scope">
            <span v-if="scope.row.orderState === 0">未付款</span>
            <span v-else-if="scope.row.orderState === 1">运输中</span>
            <span v-else>已完成</span>
          </template>
        </el-table-column>
        <el-table-column prop="orderDate" align="center" label="时间">
        </el-table-column>
        <el-table-column prop="orderPrice" align="center" label="价格">
        </el-table-column>
        <el-table-column align="center" label="收货信息">
          <template slot-scope="scope">
            <el-button v-if="scope.row.receiverId" type="text" size="mini" @click.native="showReceiverFun(scope.row)">
              查看详情
            </el-button>
            <span v-else>---</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="物品信息">
          <template slot-scope="scope">
            <el-button v-if="scope.row.bookList" type="text" size="mini"
              @click.native="showBookListFun(scope.row.bookList)">
              查看详情
            </el-button>
            <span v-else>---</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click.native="updateOrder(scope.row)">修改收货信息
            </el-button>
            <el-button type="text" size="mini" style='color:red;' @click.native="delOrder(scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="searchParam.page" :page-sizes="[15, 30, 50]" :page-size="searchParam.size"
        layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <el-dialog title="收货信息" :visible.sync="receiverShow" center>
      <el-descriptions>
        <el-descriptions-item label="收货人">{{receiverDetail.receiverName}}</el-descriptions-item>
        <el-descriptions-item label="手机号">{{receiverDetail.receiverPhone}}</el-descriptions-item>
        <el-descriptions-item label="收货地址">{{receiverDetail.receiverAddress}}</el-descriptions-item>
      </el-descriptions>
    </el-dialog>
    <el-dialog title="物品信息" :visible.sync="bookListShow" width="500px" center>
      <el-table :data="bookListDetail">
        <el-table-column prop="name" label="书名">
        </el-table-column>
        <el-table-column prop="price" label="价格">
        </el-table-column>
        <el-table-column prop="bookNum" label="数量">
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog title="修改收货信息" :visible.sync="updateOrderShow" width="500px" center>
      <el-form ref="form" :model="updateReceiver" label-width="80px">
        <el-form-item label="收货人">
          <el-input v-model="updateReceiver.receiverName"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="updateReceiver.receiverPhone"></el-input>
        </el-form-item>
        <el-form-item label="收货地址">
          <el-input v-model="updateReceiver.receiverAddress"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="updateOrderShow = false">取 消</el-button>
        <el-button type="primary" @click="updateOrderFun">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as orderApi from "./../../api/order";
  import {
    handleError
  } from "./../../util/util";
  import {
    mapState
  } from "vuex";

  export default {
    data() {
      return {
        // 列表数据总数
        total: 0,
        // 列表数据
        orderList: [],
        // 加载中
        loading: false,
        // 搜索参数
        searchParam: {
          page: 1,
          size: 15,
          orderId: ""
        },
        addStockShow: false,
        cutStockShow: false,
        updateStock: {},
        updateStockNum: 0,
        userId: "",
        updateOrderShow: false,
        updateReceiver: {},
        receiverShow: false,
        receiverDetail: {},
        bookListShow: false,
        bookListDetail: []
      };
    },
    computed: {
      ...mapState(["userInfo"]),
      // 分类转换为 map
      bookTypeMap() {
        let obj = {};
        for (let i = 0, len = this.bookType.length; i < len; i++) {
          obj[this.bookType[i].id] = this.bookType[i].name;
        }
        return obj;
      },
    },
    mounted() {
      this.userId = this.userInfo.userId;
      this.getOrderList();
    },
    methods: {
      // 执行搜索
      search() {
        this.searchParam.page = 1;
        this.getOrderList();
      },
      // 获取表格数据
      async getOrderList() {
        try {
          this.loading = true;
          const param = {
            ...this.searchParam,
            useId: this.userId,
          };
          let res = await orderApi.getOrderList(param);
          this.loading = false;
          if (res.code === 200) {
            this.orderList = res.result.data;
            this.total = res.result.total;
          } else {
            this.$message({
              message: res.message,
              type: "error",
            });
          }
        } catch (error) {
          this.loading = false;
          handleError(error);
        }
      },
      // 重置搜索条件
      resetSearch() {
        this.searchParam = {
          page: 1,
          size: 15,
          orderId: ""
        };
        this.getOrderList();
      },
      // 查看图片
      showImgDialogFun(imageUrl) {
        if (Array.isArray(imageUrl)) {
          this.showImageUrl = imageUrl;
        } else {
          this.showImageUrl = [imageUrl];
        }
        this.showImgDialog = true;
      },
      // 每页页数变化
      handleSizeChange(val) {
        this.searchParam.size = val;
        this.getOrderList();
      },
      // 页码变化
      handleCurrentChange(val) {
        this.searchParam.page = val;
        this.getOrderList();
      },
      async delOrder(data) {
        if (data.orderState !== 2) {
          this.$message.error({
            message: "订单未完成，无法删除"
          })
          return;
        }
        const param = {
          userId: this.userId,
          orderId: data.orderId
        }
        const res = await orderApi.delOrder(param);
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: "删除成功"
          })
        } else {
          this.$message.error({
            message: res.message
          })
        }
        this.getOrderList();
      },
      updateOrder(data) {
        this.updateReceiver = data;
        this.updateOrderShow = true;
      },
      async updateOrderFun() {
        const param = {
          userId: this.userId,
          orderId: this.updateReceiver.orderId,
          receiverId: this.updateReceiver.receiverId,
          receiverName: this.updateReceiver.receiverName,
          receiverPhone: this.updateReceiver.receiverPhone,
          receiverAddress: this.updateReceiver.receiverAddress,
        }
        const res = await orderApi.updateOrder(param);
        if (res.code === 200) {
          this.$message({
            type: 'success',
            message: "修改成功"
          })
        } else {
          this.$message.error({
            message: res.message
          })
        }
        this.getOrderList();
      },
      showReceiverFun(data) {
        this.receiverDetail = data;
        this.receiverShow = true;
      },
      showBookListFun(data) {
        this.bookListDetail = data;
        this.bookListShow = true;
      }
    }
  };
</script>

<style lang="stylus">
  @import './../../styl/variables.styl';
  @import './../../styl/common.styl';

  .filter-search {
    display: flex;
    flex-wrap: wrap;

    .el-date-editor {
      max-width: 360px;
      margin-right: 10px;
      margin-bottom: 10px;
    }

    .el-button {
      height: 36px;
    }

    .el-input {
      max-width: 140px;
      margin-right: 10px;
      margin-bottom: 10px;
    }

    .edit-btn {
      position: absolute;
      right: 4px;
    }
  }

  .option-button {
    position: relative;
    padding-right: 50px;

    .edit-btn {
      position: absolute;
      right: 4px;
    }
  }

  .form-upload-excel {
    display: inline-block;
    margin-left: 10px;
  }

  .table-container {
    margin-top: 20px;

    .el-pagination {
      margin-top: 20px;
    }
  }

  .el-dialog__body {

    .el-input-number {
      margin-left: 10px;
    }

    .preview {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
      margin-top: 6px;
      border: 1px dashed #999;
      border-radius: 6px;

      img {
        cursor: pointer;
        max-width: 300px;
      }
    }
  }

  .dialog-img {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    padding: 10px;

    img {
      max-width: 200px;
    }
  }

  .el-dialog {
    div.el-dialog__body {
      text-align: center;
    }
  }
</style>