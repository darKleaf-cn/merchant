<template>
  <div>
    <el-upload
    action="sdsdasd"
      list-type="picture-card"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :auto-upload="false"
      :http-request="a"
      :limit="limit"
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
    limit: Number
  },
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
    };
  },
  computed:{
    fileList(){
      const a = [];
      if(Array.isArray(this.image)){
        for(let item of this.image){
          a.push({
            url:item
          })
        }
      }else{
        a.push({
          url:this.image
        })
      }
      return a;
    }
  },
  methods: {
    handlePictureCardPreview() {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleRemove() {
      console.log( this.fileList);
    },
    a(){
      console.log(1)
    }
  },
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