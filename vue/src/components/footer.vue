<template>
	<el-row>
		<el-col v-if="DEBUG">{{$route.meta}}</el-col>
		<el-col>&copy; {{new Date().getFullYear()}} qiyi.io</el-col>
	</el-row>
</template>

<script>
export default {
	name: "Footer",
	props: ["width"],
	data() {
		return {};
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.el-col {
	font-size: 12px;
	text-align: center;
	color: #999;
}
</style>
