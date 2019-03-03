<template>
	<el-row>
		<el-col></el-col>
	</el-row>
</template>

<script>
export default {
	name: "id",
	data() {
		return {
			app: {}
		};
	},
	created() {
		this.console(this.$route.params.id);
		this.$http("apps/once", {
			where: {
				_id: this.$route.params.id,
				uuid: this.$store.state.user.info._id
			},
			other: {
				show: {
					_id: 0,
					uuid: 0
				}
			}
		})
			.then(data => {
				if (data) {
					this.app = data;
				} else {
					this.$message.error(`应用不存在!`);
					this.$router.push({ path: "/app" });
				}
			})
			.catch(error => {
				this.$message.error(error);
			});
	}
};
</script>

<style scoped>
</style>
