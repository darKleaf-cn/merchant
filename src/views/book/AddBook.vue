<template>
	<el-form ref="bookFormForm" :model="bookForm" :rules="bookFormValidate" :hide-required-asterisk="false">
		<el-form-item label="书名" prop="name" label-width="80px">
			<el-input v-model.trim="bookForm.name" autocomplete="off"></el-input>
		</el-form-item>
		<el-form-item label="类型" label-width="80px">
			<el-select v-model="bookForm.type" placeholder="请选择">
				<el-option v-for="item in bookType" :key="item" :label="item" :value="item"></el-option>
			</el-select>
		</el-form-item>
		<el-form-item label="描述信息" prop="describe" label-width="80px">
			<el-input v-model.trim="bookForm.describe" autocomplete="off"></el-input>
		</el-form-item>
		<el-form-item label="价格" prop="price" label-width="80px">
			<el-input v-model.trim="bookForm.price" type="number" step="1" autocomplete="off"></el-input>
		</el-form-item>
		<el-form-item label="主图" label-width="80px">
			<ImageList :image="bookForm.image" @updateImage="updateImage1" :limit="1"> </ImageList>
		</el-form-item>
		<el-form-item label="描述图集" label-width="80px">
			<ImageList :image="bookForm.imageSmall" @updateImage="updateImage2" :limit="4"> </ImageList>
		</el-form-item>
		<el-form-item label="详细信息" label-width="80px">
			<ImageList :image="bookForm.detail" @updateImage="updateImage3" :limit="1"> </ImageList>
		</el-form-item>
		<el-form-item>
			<el-button type="primary" size="small" @click="submitBook">创建</el-button>
		</el-form-item>
	</el-form>
</template>

<script>
	import * as bookApi from "./../../api/bookList";
	import ImageList from "../image/index.vue";
	import {
		mapState
	} from "vuex";
	export default {
		data() {
			return {
				userId: "",
				bookForm: {
					name: "",
					image: [],
					price: 0,
					describe: "",
					type: null,
					imageSmall: [],
					detail: []
				},
				bookType: [

				],
				bookFormValidate: {
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
			}
		},
		computed: {
			...mapState(["userInfo"]),
		},
		created() {
			this.userId = this.userInfo.userId;
			this.getBookType();
		},
		methods: {
			// 获取全部分类
			async getBookType() {
				try {
					const param = {
						userId: this.userId,
					};
					let res = await bookApi.getBookType(param);
					if (res.code === 200) {
						this.bookType = res.result.data;
					} else {
						this.$message({
							message: res.message,
							type: "error",
						});
					}
				} catch (error) {}
			},
			updateImage1(image) {
				this.bookForm.image = image;
			},
			updateImage2(image) {
				this.bookForm.imageSmall = image;
			},
			updateImage3(image) {
				this.bookForm.detail = image;
			},
			async submitBook() {
				try {
					if (!this.bookForm.name) {
						this.$message.error({
							message: "书名不能为空"
						})
						return;
					}
					if (!this.bookForm.type) {
						this.$message.error({
							message: "类型不能为空"
						})
						return;
					}
					if (!this.bookForm.describe) {
						this.$message.error({
							message: "描述不能为空"
						})
						return;
					}
					if (!this.bookForm.image || !this.bookForm.imageSmall || !this.bookForm.detail || this.bookForm.image
						.length === 0 || this.bookForm.imageSmall.length === 0 || !this.bookForm.detail.length === 0) {
						this.$message.error({
							message: "请至少选择一张图片"
						})
						return;
					}
					const param = {
						userId: this.userId,
						...this.bookForm
					}
					let res = await bookApi.addBook(param);
					if (res.code === 200) {
						this.$message({
							message: "添加成功",
							type: "success",
						});
						this.$router.go(0)
					} else {
						this.$message({
							message: res.message,
							type: "error",
						});
					}
				} catch (error) {
					this.$message({
						message: "系统错误",
						type: "error",
					});
				}
			}
		},
		components: {
			ImageList
		}
	}
</script>

<style>

</style>