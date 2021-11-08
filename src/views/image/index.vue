<template>
  <div>
    <el-upload
      action="sdsdasd"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :on-change="handleEditChange"
      :before-upload="beforeAvatarUpload"
      :file-list="fileList"
      :auto-upload="false"
      :http-request="a"
      :limit="limit"
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
      dialogImageUrl: "",
      dialogVisible: false,
      hideUploadEdit: false,
    };
  },
  computed: {
    fileList() {
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
      return a;
    },
  },
  methods: {
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    a() {
      console.log(1);
    },
    beforeAvatarUpload(file) {
      console.log(file);
    },
    handleEditChange(file, fileList) {
      let vm = this;
      vm.hideUploadEdit = fileList.length >= limit;
    },
  },
};
</script>

<style lang="stylus" scoped>
.disabled {
  .el-upload--picture-card{
    display: none
  }
}
</style>