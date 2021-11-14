<template>
  <div class="stockList">
    <div class="filter-search">
      <el-input placeholder="书名" size="medium" v-model.trim="searchParam.name" clearable @keyup.native.enter="search">
      </el-input>
      <el-button type="primary" size="medium" icon="el-icon-search" @click.native="search">搜索
      </el-button>
      <el-button type="danger" size="medium" @click.native="resetSearch">重置
      </el-button>
    </div>
    <div class="table-container">
      <el-table size="mini" v-loading="loading" :data="stockList" :header-cell-style="{ background: '#fdfdfd' }"
        :height="460" border>
        <el-table-column prop="name" align="center" label="书名"></el-table-column>
        <el-table-column align="center" label="是否在售">
          <template slot-scope="scope">
            <span v-if="scope.row.isSale === true" class="status-success">是</span>
            <span v-else class="status-failed">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" align="center" label="类型">
        </el-table-column>
        <el-table-column prop="describe" align="center" label="描述信息">
        </el-table-column>
        <el-table-column prop="price" align="center" label="价格">
        </el-table-column>
        <el-table-column align="center" label="主图">
          <template slot-scope="scope">
            <el-button v-if="scope.row.image" type="text" size="mini" @click.native="showImgDialogFun(scope.row.image)">
              查看图片
            </el-button>
            <span v-else>---</span>
          </template>
        </el-table-column>
        <el-table-column prop="stockTotal" align="center" label="总库存">
        </el-table-column>
        <el-table-column prop="stockSale" align="center" label="销售量">
        </el-table-column>
        <el-table-column prop="stockNum" align="center" label="剩余量">
        </el-table-column>

        <!-- </template> -->
        <el-table-column fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click.native="addStock(scope.row)">添加库存
            </el-button>
            <el-button type="text" size="mini" @click.native="cutStock(scope.row)">减少库存
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="searchParam.page" :page-sizes="[15, 30, 50]" :page-size="searchParam.size"
        layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <el-dialog top="50px" :visible.sync="showImgDialog">
      <div class="dialog-img">
        <img v-for="(item, i) in showImageUrl" :key="i" :src="item" alt="图片详情" style="margin: 10px" />
      </div>
    </el-dialog>
    <el-dialog title="添加库存" :visible.sync="addStockShow" width="300px" center>
      <el-input-number v-model="updateStockNum" :min="0" width="300px"></el-input-number>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addStockShow = false">取 消</el-button>
        <el-button type="primary" @click="updateStockFun(true)">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="减少库存" :visible.sync="cutStockShow" width="300px" center>
      <el-input-number v-model="updateStockNum" :min="0" width="300px"></el-input-number>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cutStockShow = false">取 消</el-button>
        <el-button type="primary" @click="updateStockFun(false)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import * as bookApi from "./../../api/bookList";
  import {
    handleError,
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
        stockList: [],
        // 加载中
        loading: false,
        // 展示查看大图
        showImgDialog: false,
        // 大图Url
        showImageUrl: [],
        // 搜索参数
        searchParam: {
          page: 1,
          size: 15,
          name: "",
        },
        addStockShow: false,
        cutStockShow: false,
        updateStock: {},
        updateStockNum: 0,
        userId:""
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
      this.getStockList();
      this.getBookType();
    },
    methods: {
      // 执行搜索
      search() {
        this.searchParam.page = 1;
        this.getStockList();
      },
      // 获取表格数据
      async getStockList() {
        try {
          this.loading = true;
          const param = {
            ...this.searchParam,
            userId: this.userId,
          };
          let res = await bookApi.getStockList(param);
          this.loading = false;
          if (res.rtnCode === "200") {
            this.stockList = res.result.data;
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
      // 获取全部分类
      async getBookType() {
        try {
          this.loading = true;
          const param = {
            userId: this.userId,
          };
          let res = await bookApi.getBookType(param);
          this.loading = false;
          if (res.rtnCode === "200") {
            this.bookType = res.result.data;
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
          name: "",
        };
        this.getStockList();
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
        this.getStockList();
      },
      // 页码变化
      handleCurrentChange(val) {
        this.searchParam.page = val;
        this.getStockList();
      },
      addStock(data) {
        this.updateStock = data;
        this.addStockShow = true;
      },
      cutStock(data) {
        this.updateStock = data;
        this.cutStockShow = true;
      },
      async updateStockFun(key) {
        if (key) {
          const param = {
            userId: this.userId,
            bookId: this.updateStock.bookId,
            stockAddNum: this.updateStockNum
          }
          const res = await bookApi.addStock(param)
          if (res.rtnCode === "200") {
            this.$message({
              message: "添加库存成功",
              type: "success",
            });
          } else {
            this.$message({
              message: res.message,
              type: "error",
            });
          }
          this.addStockShow = false;
          this.getStockList();
        } else {
          const param = {
            userId: this.userId,
            bookId: this.updateStock.bookId,
            stockCutNum: this.updateStockNum
          }
          const res = await bookApi.cutStock(param)
          if (res.rtnCode === "200") {
            this.$message({
              message: "减少库存成功",
              type: "success",
            });
          } else {
            this.$message({
              message: res.message,
              type: "error",
            });
          }
          this.cutStockShow = false;
          this.getStockList();

        }
        this.updateStockNum = 0;
      }
    },
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
    .el-form {
      height: 400px;
      padding: 10px;
      overflow-y: scroll;

      .el-select {
        width: 100%;
      }
    }

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