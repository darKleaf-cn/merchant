<template>
  <div>
    <el-upload
      action="#"
      :http-request="a"
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
      fileList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      hideUploadEdit: false,
    };
  },
  methods: {
    init() {
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
    a() {
      // this.$emit('updateImage',this.fileFilter(this.fileList))
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file,fileList) {
      for(let i=0;i<this.fileList.length;i++) {
        if(file.uid == this.fileList[i].uid){
          this.fileList.splice(i,1)
        }
      }
      if (this.fileList.length >= this.limit) {
        this.hideUploadEdit = true;
      } else {
        this.hideUploadEdit = false;
      }
      this.$emit('updateImage',this.fileFilter(this.fileList))
    },
    beforeAvatarUpload(file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      const that = this;
      reader.onload = function () {
        that.fileList.push({
          uid:file.uid,
          url:reader.result
        })
        that.$emit('updateImage',that.fileFilter(that.fileList))
      };
    },
    handleEditChange(file, fileList) {
      if (fileList.length >= this.limit) {
        this.hideUploadEdit = true;
      } else {
        this.hideUploadEdit = false;
      }
    },
    fileFilter(data){
      const result=[];
      if(data.length === 1){
        return data[0].url;
      }else if(data.length === 0){
        return "";
      }else{
        for(let item of data){
          result.push(item.url)
        }
        return result;
      }
    }
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