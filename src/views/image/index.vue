<template>
  <div class="imageList">
    <div class="imageList-item" v-for="(item, i) in imageList" :key="i" style="width: 200px; height: 200px">
      <el-image
        style="width: 150px; height: 150px"
        :src="item"
        fit="contain"
      ></el-image>
      <div class="imageList-button">
        <el-button type="primary" plain>修改</el-button>
        <el-button type="danger" plain>删除</el-button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imageList: [],
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="stylus" scoped>
.imageList
	display flex

.imageList-item
	display flex
	
	.el-image
		display flex
	.imageList-button
		display none
	&:hover
		.el-image
			display none
		.imageList-button
			display flex
			align-items center
</style>