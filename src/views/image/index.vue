<template>
  <div>
    <el-upload
      action="https://jsonplaceholder.typicode.com/posts/"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      file-list="image"
    >
      <i class="el-icon-plus"></i>
    </el-upload>
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="" />
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    image: [String, Array],
  },
  data() {
    return {
      dialogImageUrl:'',
      dialogVisible: false
    };
  },
  methods: {},
};
</script>

<style lang="stylus" scoped>
.imageList {
  display: flex;
  flex-wrap: wrap;

  .imageList-item {
    display: flex;
    align-items: center;
    width: 150px;
    height: 150px;
    margin: 2px;

    .el-image {
      display: flex;
      width: 150px;
      height: 150px;
    }

    .imageList-button {
      display: none;
    }

    &:hover {
      .el-image {
        display: none;
      }

      .imageList-button {
        display: flex;
        justify-content: center;
      }
    }
  }
}
</style>