<template>
  <div>
    <div class="filter-search">
      <el-date-picker
        v-model="dataPicker"
        size="medium"
        type="datetimerange"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        format="yyyy-MM-dd HH:mm:ss"
        value-format="yyyy-MM-dd HH:mm:ss"
        :editable="false"
        :clearable="false"
        :default-time="['00:00:00', '23:59:59']"
      ></el-date-picker>
      <el-input
        placeholder="书名"
        size="medium"
        v-model.trim="searchParam.name"
        clearable
        @keyup.native.enter="search"
      >
      </el-input>
      <el-input
        placeholder="作者"
        size="medium"
        v-model.trim="searchParam.author"
        clearable
        @keyup.native.enter="search"
      >
      </el-input>
      <el-input
        placeholder="出版社"
        size="medium"
        v-model.trim="searchParam.press"
        clearable
        @keyup.native.enter="search"
      >
      </el-input>
    </div>
    <div class="option-button">
      <el-button
        type="primary"
        size="medium"
        icon="el-icon-search"
        @click.native="search"
        >搜索
      </el-button>
      <el-button type="danger" size="medium" @click.native="resetSearch"
        >重置
      </el-button>
      <el-button
        type="success"
        size="medium"
        @click.native="changeBookSaleStatus(1)"
        >上架
      </el-button>
      <el-button
        type="danger"
        size="medium"
        @click.native="changeBookSaleStatus(0)"
        >下架
      </el-button>
    </div>
    <div class="table-container">
      <el-table
        size="mini"
        v-loading="loading"
        :data="bookList"
        :header-cell-style="{ background: '#fdfdfd' }"
        :height="460"
        @selection-change="handleSelectionChange"
        border
      >
        <el-table-column type="selection" align="center"></el-table-column>
        <!-- <template v-for="item in tableItem"> -->
        <el-table-column
          prop="name"
          align="center"
          label="书名"
        ></el-table-column>
        <el-table-column align="center" label="是否在售">
          <template slot-scope="scope">
            <span v-if="scope.row.isSale === true" class="status-success">是</span>
            <span v-else class="status-failed">否</span>
          </template>
        </el-table-column>
        <el-table-column prop="type" align="center" label="类型">
        </el-table-column>
        <el-table-column prop="price" align="center" label="价格">
        </el-table-column>
        <el-table-column align="center" label="主图">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.image"
              type="text"
              size="mini"
              @click.native="showImgDialogFun(scope.row.image)"
              >查看图片
            </el-button>
            <span v-else>---</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="描述图集">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.imageSmall"
              type="text"
              size="mini"
              @click.native="showImgDialogFun(scope.row.imageSmall)"
              >查看图片
            </el-button>
            <span v-else>---</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="详细信息">
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.detail"
              type="text"
              size="mini"
              @click.native="showImgDialogFun(scope.row.detail)"
              >查看图片
            </el-button>
            <span v-else>---</span>
          </template>
        </el-table-column>
        <!-- </template> -->
        <el-table-column fixed="right" align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click.native="updateBookFun(scope.row)"
              >编辑
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="searchParam.pageNumber"
        :page-sizes="[15, 30, 50]"
        :page-size="searchParam.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
    </div>
    <el-dialog
      title="编辑图书"
      top="50px"
      width="500px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :visible.sync="showEditFormDialog"
      @close="closeDialog"
    >
      <el-form
        ref="updateBookForm"
        :model="updateBook"
        :rules="updateBookValidate"
        :hide-required-asterisk="false"
      >
        <el-form-item label="书名" prop="name" label-width="80px">
          <el-input
            v-model.trim="updateBook.name"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="类型" label-width="80px">
          <el-select v-model="updateBook.type" placeholder="请选择">
            <el-option
              v-for="item in bookType"
              :key="item"
              :label="item"
              :value="item"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="价格" prop="price" label-width="80px">
          <el-input
            v-model.trim="updateBook.price"
            type="number"
            step="1"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="是否在售" label-width="80px">
          <el-switch v-model="updateBook.isSale"></el-switch>
        </el-form-item>
        <el-form-item label="主图" label-width="80px">
          <ImageList :image="updateBook.image"> </ImageList>
        </el-form-item>
        <el-form-item label="描述图集" label-width="80px">
          <ImageList :image="updateBook.imageSmall"> </ImageList>
        </el-form-item>
        <el-form-item label="详细信息" label-width="80px">
          <ImageList :image="updateBook.detail"> </ImageList>
        </el-form-item>
        <!-- <el-form-item label="主图" label-width="80px">
          <el-button
            v-if="updateBook.image"
            type="text"
            size="small"
            @click.native="showImgDialogFun(updateBook.image)"
            >查看图片
          </el-button>
          <el-upload
            class="form-upload"
            ref="upload"
            action="#"
            name="bookImg"
            accept=".png, .jpg"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleFileChange"
          >
            <el-button slot="trigger" size="small" type="primary"
              >{{ updateBook.image ? "更换" : "上传" }}图片
            </el-button>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过2M
            </div>
            <div
              class="preview"
              @click="showImgDialogFun(previewBase64, true)"
              v-if="previewBase64"
            >
              <img :src="previewBase64" title="点击查看大图" />
            </div>
          </el-upload>
        </el-form-item> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" @click="showEditFormDialog = false"
          >取 消
        </el-button>
        <el-button
          type="primary"
          size="small"
          @click="submitEditBook('updateBookForm')"
          >确 定
        </el-button>
      </div>
    </el-dialog>
    <el-dialog top="50px" :visible.sync="showImgDialog">
      <div class="dialog-img">
        <img
          v-for="(item, i) in showImageUrl"
          :key="i"
          :src="item"
          alt="图片详情"
          style="margin:10px"
        />
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as bookApi from "./../../api/bookList";
import {
  timeFormat,
  getDatePickerTime,
  handleError,
  decimalReg,
} from "./../../util/util";
import ImageList from "../image/index.vue";

// import showTags from "./../../components/ShowTags";
import {HandleDirective } from "vue-slicksort";

const STORAGE_NAME = "bookListTable";

export default {
  data() {
    return {
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
        name: [
          {
            required: true,
            message: "请输入书名",
            trigger: "blur",
          },
        ],
        author: [
          {
            required: true,
            message: "请输入作者",
            trigger: "blur",
          },
        ],
        press: [
          {
            required: true,
            message: "请输入出版社",
            trigger: "blur",
          },
        ],
        title: [
          {
            required: true,
            message: "请输入标题",
            trigger: "blur",
          },
        ],
        description: [
          {
            required: true,
            message: "请输入描述",
            trigger: "blur",
          },
        ],
        price: [
          {
            required: true,
            validator: this.decimalRegFun,
            trigger: "blur",
          },
        ],
        salePrice: [
          {
            required: true,
            validator: this.decimalRegFun,
            trigger: "blur",
          },
        ],
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
        pageNumber: 1,
        pageSize: 15,
        startTime: "",
        endTime: "",
        name: "",
        author: "",
        press: "",
      },
      tableItem: [
        {
          name: "name",
          title: "书名",
          isShow: true,
        },
        {
          name: "author",
          title: "作者",
          isShow: true,
        },
        {
          name: "press",
          title: "出版社",
          isShow: true,
        },
        {
          name: "isSale",
          title: "是否在售",
          isShow: true,
        },
        {
          name: "bookType",
          title: "分类",
          isShow: true,
        },
        {
          name: "title",
          title: "标题",
          isShow: true,
        },
        {
          name: "description",
          title: "描述",
          isShow: true,
        },
        {
          name: "stock",
          title: "库存",
          isShow: true,
        },
        {
          name: "price",
          title: "价格",
          isShow: true,
        },
        {
          name: "salePrice",
          title: "折后价",
          isShow: true,
        },
        {
          name: "imageUrl",
          title: "图片",
          isShow: true,
        },
        {
          name: "createdAt",
          title: "创建时间",
          isShow: true,
        },
        {
          name: "updatedAt",
          title: "修改时间",
          isShow: true,
        },
      ],
    };
  },
  computed: {
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
    // 默认查一个月的
    this.dataPicker = getDatePickerTime(90);
    this.getBookList();
    this.getBookType();
    let tableItemStorage = localStorage.getItem(STORAGE_NAME);
    if (tableItemStorage) {
      this.tableItem = JSON.parse(tableItemStorage);
    }
    this.initSelectEditTable();
  },
  methods: {
    // 执行搜索
    search() {
      this.searchParam.pageNumber = 1;
      this.getBookList();
    },
    // 获取表格数据
    async getBookList() {
      this.searchParam.startTime = this.dataPicker[0];
      this.searchParam.endTime = this.dataPicker[1];
      try {
        this.loading = true;
        let res = await bookApi.getBookList(this.searchParam);
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
        let res = await bookApi.getBookType();
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
    // 编辑表格
    editTable() {
      this.editTableDialog = true;
      this.editTableItem = this.tableItem.concat();
    },
    // 编辑表格确认修改
    submitEditTable() {
      for (let i = 0, iLen = this.editTableItem.length; i < iLen; i++) {
        for (var j = 0, jLen = this.selectEditTable.length; j < jLen; j++) {
          if (this.editTableItem[i].name === this.selectEditTable[j]) {
            this.editTableItem[i].isShow = true;
            break;
          }
        }
        if (j === jLen) {
          this.editTableItem[i].isShow = false;
        }
      }
      this.editTableDialog = false;
      this.tableItem = this.editTableItem;
      this.initSelectEditTable();
      localStorage.setItem(STORAGE_NAME, JSON.stringify(this.tableItem));
      this.$emit("reload");
    },
    // 初始化编辑表格select
    initSelectEditTable() {
      this.selectEditTable = [];
      this.tableItem.forEach((item) => {
        if (item.isShow) {
          this.selectEditTable.push(item.name);
        }
      });
    },
    // 重置编辑表格
    resetEditTable() {
      localStorage.removeItem(STORAGE_NAME);
      this.$emit("reload");
    },
    // 重置搜索条件
    resetSearch() {
      this.dataPicker = getDatePickerTime(90);
      this.searchParam = {
        pageNumber: 1,
        pageSize: 15,
        startTime: "",
        endTime: "",
        name: "",
        author: "",
        press: "",
      };
      this.getBookList();
    },
    // 编辑图书
    updateBookFun(row) {
      this.updateBook = Object.assign({}, row);
      this.showEditFormDialog = true;
    },
    // 提交更改
    submitEditBook(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          let formData = new FormData();
          for (let key in this.updateBook) {
            switch (key) {
              case "bookType":
                formData.append(key, this.updateBook[key].join(","));
                break;
              case "isSale":
                formData.append(key, this.updateBook[key] ? 1 : 0);
                break;
              case "imageUrl":
                formData.append(key, this.uploadFile);
                break;
              case "createdAt":
              case "updatedAt":
              case "stock":
              case "stockPrice":
                break;
              default:
                formData.append(key, this.updateBook[key]);
            }
          }
          let config = {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          };
          try {
            let res = await bookApi.updateBook(formData, config);
            if (res.code === 200) {
              this.$message({
                message: "提交成功",
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
        }
      });
    },
    async changeBookSaleStatus(isSale) {
      let params = this.multipleSelection.map((val) => val.id);
      let obj = {};
      obj.isSale = isSale;
      obj.ids = params.join(",");
      if (params.length === 0) {
        this.$message({
          message: "请选择要更改的图书",
          type: "warning",
        });
        return false;
      }
      try {
        let res = await bookApi.changeBookSaleStatus(obj);
        if (res.code === 200) {
          this.$message({
            message: "更改成功",
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
    // 选择图片
    handleFileChange(file) {
      if (file.raw.type !== "image/jpeg" && file.raw.type !== "image/png") {
        this.$message({
          message: "格式不支持",
          type: "error",
        });
        return false;
      }
      if (file.raw.size > 1024 * 1024 * 2) {
        this.$message({
          message: "大小不能超过2M",
          type: "error",
        });
        return false;
      }
      let reader = new FileReader();
      reader.readAsDataURL(file.raw);
      reader.onload = (e) => {
        this.previewBase64 = e.currentTarget.result;
        this.uploadFile = file.raw;
      };
    },
    // 查看大图
    showImgDialogFun(imageUrl, isBase64) {
      // if (isBase64) {
      //   this.showImageUrl = imageUrl;
      // } else {
      //   this.showImageUrl = imageUrl + this.getTimeUrl();
      // }
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
      this.searchParam.pageSize = val;
      this.getBookList();
    },
    // 页码变化
    handleCurrentChange(val) {
      this.searchParam.pageNumber = val;
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
    // 小数校验
    decimalRegFun(rule, value, callback) {
      if (!decimalReg.test(value)) {
        callback(new Error("请输入正确的数字,最多两位小数"));
      } else {
        callback();
      }
    },
  },
  components: {
    ImageList,
  },
  directives: {
    handle: HandleDirective,
  },
};
</script>

<style lang="stylus" scoped>
@import './../../styl/variables.styl'
@import './../../styl/common.styl'
.filter-search
  display flex
  flex-wrap wrap
  .el-date-editor
    max-width 360px
    margin-right 10px
    margin-bottom 10px
  .el-input
    max-width 140px
    margin-right 10px
    margin-bottom 10px
.option-button
  position relative
  padding-right 50px
  .edit-btn
    position absolute
    right 4px
.form-upload-excel
  display inline-block
  margin-left 10px
.table-container
  margin-top 20px
  .el-pagination
    margin-top 20px
.el-dialog__body
  .el-form
    height 400px
    padding 10px
    overflow-y scroll
    .el-select
      width 100%
  .el-input-number
    margin-left 10px
  .preview
    display flex
    justify-content center
    align-items center
    padding 10px
    margin-top 6px
    border 1px dashed #999
    border-radius 6px
    img
      cursor pointer
      max-width 300px
.dialog-img
  display flex
  justify-content center
  align-items center
  flex-wrap wrap
  padding 10px
  img
    max-width 200px
</style>