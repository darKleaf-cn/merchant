<template>
  <div>
    <div class="filter-search">
      <el-input placeholder="书名" size="medium" v-model.trim="searchParam.name" clearable @keyup.native.enter="search">
      </el-input>
      <el-input placeholder="类型" size="medium" v-model.trim="searchParam.type" clearable @keyup.native.enter="search">
      </el-input>
    </div>
    <div class="option-button">
      <el-button type="primary" size="medium" icon="el-icon-search" @click.native="search">搜索
      </el-button>
      <el-button type="danger" size="medium" @click.native="resetSearch">重置
      </el-button>
      <el-button type="danger" size="medium" @click.native="deleteBook">删除
      </el-button>
      <el-button type="success" size="medium" @click.native="changeBookSaleStatus(true)">上架
      </el-button>
      <el-button type="danger" size="medium" @click.native="changeBookSaleStatus(false)">下架
      </el-button>
      <el-button type="danger" size="medium" @click.native="deleteBook">添加图书
      </el-button>
    </div>
    <div class="table-container">
      <el-table size="mini" v-loading="loading" :data="bookList" :header-cell-style="{ background: '#fdfdfd' }"
        :height="460" @selection-change="handleSelectionChange" border>
        <el-table-column type="selection" align="center"></el-table-column>
        <!-- <template v-for="item in tableItem"> -->
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
        <el-table-column align="center" label="描述图集">
          <template slot-scope="scope">
            <el-button v-if="scope.row.imageSmall" type="text" size="mini"
              @click.native="showImgDialogFun(scope.row.imageSmall)">查看图片
            </el-button>
            <span v-else>---</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="详细信息">
          <template slot-scope="scope">
            <el-button v-if="scope.row.detail" type="text" size="mini"
              @click.native="showImgDialogFun(scope.row.detail)">查看图片
            </el-button>
            <span v-else>---</span>
          </template>
        </el-table-column>
        <!-- </template> -->
        <el-table-column fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click.native="updateBookFun(scope.row)">编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="searchParam.page" :page-sizes="[15, 30, 50]" :page-size="searchParam.size"
        layout="total, sizes, prev, pager, next, jumper" :total="total"></el-pagination>
    </div>
    <el-dialog title="编辑图书" top="50px" width="1000px" :close-on-click-modal="false" :close-on-press-escape="false"
      :visible.sync="showEditFormDialog" @close="closeDialog">
      <el-form ref="updateBookForm" :model="updateBook" :rules="updateBookValidate" :hide-required-asterisk="false">
        <el-form-item label="书名" prop="name" label-width="80px">
          <el-input v-model.trim="updateBook.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="类型" label-width="80px">
          <el-select v-model="updateBook.type" placeholder="请选择">
            <el-option v-for="item in bookType" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="描述信息" prop="describe" label-width="80px">
          <el-input v-model.trim="updateBook.describe" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="price" label-width="80px">
          <el-input v-model.trim="updateBook.price" type="number" step="1" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="是否在售" label-width="80px">
          <el-switch v-model="updateBook.isSale"></el-switch>
        </el-form-item>
        <el-form-item label="主图" label-width="80px">
          <ImageList :image="updateBook.image" @updateImage="updateImage1" :limit="1"> </ImageList>
        </el-form-item>
        <el-form-item label="描述图集" label-width="80px">
          <ImageList :image="updateBook.imageSmall" @updateImage="updateImage2" :limit="4"> </ImageList>
        </el-form-item>
        <el-form-item label="详细信息" label-width="80px">
          <ImageList :image="updateBook.detail" @updateImage="updateImage3" :limit="1"> </ImageList>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="showEditFormDialog = false">取 消
        </el-button>
        <el-button type="primary" size="small" @click="submitEditBook">确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog top="50px" :visible.sync="showImgDialog">
      <div class="dialog-img">
        <img v-for="(item, i) in showImageUrl" :key="i" :src="item" alt="图片详情" style="margin: 10px" />
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import * as bookApi from "./../../api/bookList";
  import {
    handleError,
  } from "./../../util/util";
  import ImageList from "../image/index.vue";
  import {
    mapState
  } from "vuex";

  export default {
    data() {
      return {
        userId: "",
        // 列表数据总数
        total: 0,
        // 时间选择框
        dataPicker: [],
        // 列表数据
        bookList: [],
        // 编辑数据
        updateBook: {},
        // 编辑表格弹窗
        editTableDialog: false,
        // 临时编辑表格数据
        editTableItem: [],
        // 编辑表格要显示的
        selectEditTable: [],
        // 提交校验规则
        updateBookValidate: {
          name: [{
            required: true,
            message: "请输入书名",
            trigger: "blur",
          }],
          price: [{
            required: true,
            message: "请输入价格",
            trigger: "blur",
          }],
          describe: [{
            required: true,
            message: "请输入描述信息",
            trigger: "blur",
          }]
        },
        // 加载中
        loading: false,
        // 编辑弹框
        showEditFormDialog: false,
        // 选择的值
        multipleSelection: [],
        // 分类
        bookType: [],
        // 图片预览base64
        previewBase64: "",
        // file文件
        uploadFile: "",
        // 展示查看大图
        showImgDialog: false,
        // 大图Url
        showImageUrl: [],
        // 搜索参数
        searchParam: {
          page: 1,
          size: 15,
          name: "",
          type: "",
        }
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
    created() {
      this.userId = this.userInfo.userId;
      this.getBookList();
      this.getBookType();
    },
    methods: {
      // 执行搜索
      search() {
        this.searchParam.page = 1;
        this.getBookList();
      },
      // 获取表格数据
      async getBookList() {
        try {
          this.loading = true;
          const param = {
            ...this.searchParam,
            useId: this.userId,
          };
          let res = await bookApi.getBookList(param);
          this.loading = false;
          if (res.code === 200) {
            this.bookList = res.result.data;
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
          if (res.code === 200) {
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
          type: "",
        };
        this.getBookList();
      },
      // 编辑图书
      updateBookFun(row) {
        this.updateBook = Object.assign({}, row);
        this.showEditFormDialog = true;
      },
      // 提交更改
      async submitEditBook() {
        try {
          if(!this.updateBook.image || !this.updateBook.imageSmall || !this.updateBook.detail){
            this.$message.error({
              message:"请至少选择一张图片"
            })
            return;
          }
          const param = {
            userId:this.userId,
            ...this.updateBook
          }
          let res = await bookApi.updateBook(param);
          if (res.code === 200) {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.showEditFormDialog = false;
            this.getBookList();
          } else {
            this.$message({
              message: res.message,
              type: "error",
            });
          }
        } catch (error) {
          handleError(error);
        }
      },
      //上下架
      async changeBookSaleStatus(isSale) {
        let params = {
          userId: this.userId,
          booksId: this.multipleSelection.map((val) => val.bookId),
        };
        if (params.booksId.length === 0) {
          this.$message({
            message: "请选择要更改的图书",
            type: "warning",
          });
          return false;
        }
        try {
          if (isSale) {
            let res = await bookApi.onShelf(params);
            if (res.code === 200) {
              this.$message({
                message: "上架成功",
                type: "success",
              });
              this.getBookList();
            } else {
              this.$message({
                message: res.message,
                type: "error",
              });
            }
          } else {
            let res = await bookApi.offShelf(params);
            if (res.code === 200) {
              this.$message({
                message: "下架成功",
                type: "success",
              });
              this.getBookList();
            } else {
              this.$message({
                message: res.message,
                type: "error",
              });
            }
          }
        } catch (error) {
          handleError(error);
        }
      },
      //删除书籍
      async deleteBook() {
        let params = {
          userId: this.userId,
          booksId: this.multipleSelection.map((val) => val.bookId),
        };
        if (params.booksId.length === 0) {
          this.$message({
            message: "请选择要删除的图书",
            type: "warning",
          });
          return false;
        }
        try {
          let res = await bookApi.delBook(params);
          if (res.code === 200) {
            this.$message({
              message: "删除成功",
              type: "success",
            });
            this.getBookList();
          } else {
            this.$message({
              message: res.message,
              type: "error",
            });
          }
        } catch (error) {
          handleError(error);
        }
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
      // 图书选择变化
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      // 每页页数变化
      handleSizeChange(val) {
        this.searchParam.size = val;
        this.getBookList();
      },
      // 页码变化
      handleCurrentChange(val) {
        this.searchParam.page = val;
        this.getBookList();
      },
      // 关闭弹框
      closeDialog() {
        this.$refs["updateBookForm"].clearValidate();
      },
      // url加上时间参数
      getTimeUrl() {
        return `?t=${new Date().getTime()}`;
      },
      updateImage1(image) {
        this.updateBook.image = image;
      },
      updateImage2(image) {
        this.updateBook.imageSmall = image;
      },
      updateImage3(image) {
        this.updateBook.detail = image;
      },
    },
    components: {
      ImageList,
    }
  };
</script>

<style lang="stylus" scoped>
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

    .el-input {
      max-width: 140px;
      margin-right: 10px;
      margin-bottom: 10px;
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
</style>