<template>
  <div>
    <el-upload
    action=''
      :http-request='a'
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleEditChange"
      :before-upload="beforeAvatarUpload"
      :file-list="fileList"
      :class="{ hide: hideUploadEdit }"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible" :append-to-body="true">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    image: [String, Array],
    limit: Number,
  },
  data() {
    return {
      fileList:[],
      dialogImageUrl: "",
      dialogVisible: false,
      hideUploadEdit: false,
    };
  },
  methods: {
    init(){
      const a = [];
      if (Array.isArray(this.image)) {
        for (let item of this.image) {
          a.push({
            url: item,
          });
        }
      } else {
        a.push({
          url: this.image,
        });
      }
      this.fileList = a;
    },
    a(){

    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.fileList = fileList;
      if (this.fileList.length >= this.limit) {
        this.hideUploadEdit = true;
      } else {
        this.hideUploadEdit = false;
      }
    },
    beforeAvatarUpload(file) {
      console.log(file);
    },
    handleEditChange(file, fileList) {
      if (fileList.length >= this.limit) {
        this.hideUploadEdit = true;
      } else {
        this.hideUploadEdit = false;
      }
    },
  },
  created() {
    this.init();
    if (this.fileList.length >= this.limit) {
      this.hideUploadEdit = true;
    } else {
      this.hideUploadEdit = false;
    }
  },
};
</script>

<style>
.hide .el-upload--picture-card {
  display: none;
}
</style>