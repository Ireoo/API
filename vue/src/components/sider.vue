<template>
	<el-row>
		<el-col>
			<el-menu
				:default-active="$route.path"
				:class="['sider', {collapse}]"
				background-color="#545c64"
				text-color="#fff"
				active-text-color="#ffd04b"
				:router="true"
				:collapse="collapse"
				menu-trigger="click"
			>
				<el-menu-item-group v-for="(route, index) in routes" :key="index" :index="route.path">
					<template slot="title">{{collapse ? "" : route.meta.title}}</template>
					<el-menu-item :index="route.path">
						<i :class="route.meta.icon"></i>
						<span slot="title">{{route.meta.title}}</span>
					</el-menu-item>
					<el-menu-item v-for="(router, i) in route.child" :key="i" :index="router.path">
						<!-- <el-menu-item> -->
						<i :class="router.meta.icon"></i>
						<span slot="title">{{router.meta.title}}</span>
						<!-- </el-menu-item> -->
					</el-menu-item>
				</el-menu-item-group>
			</el-menu>
		</el-col>
	</el-row>
</template>

<script>
export default {
	name: "Sider",
	props: ["collapse"],
	data() {
		return {
			show: ["App", "Account"]
		};
	},
	methods: {
		logout() {
			this.$store.commit("account.REMOVE");
		}
	},
	computed: {
		routes() {
			let routes = this.$router.options.routes
				.filter(route => this.show.indexOf(route.name) > -1)
				.sort((a, b) => a.meta.index - b.meta.index)
				.map(route => {
					let r = JSON.parse(JSON.stringify(route));
					r.child = this.$router.options.routes
						.filter(t => new RegExp(`^${r.path}/`).test(t.path))
						.sort((a, b) => a.meta.index - b.meta.index);
					// console.log(r);
					return r;
				});
			// console.log(routes);
			return routes;
		}
	},
	mounted() {
		// console.log(this.$router.options.routes);
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
ul.sider {
	height: 100%;
	border-right: none;
}

i {
	margin-right: 10px;
}

ul.sider.collapse i {
	margin-right: 0;
	font-size: 24px;
}
</style>
