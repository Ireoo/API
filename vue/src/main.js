import Vue from "vue";
import App from "./App.vue";

// 加载主要组件
import store from "./store";
import router from "./router";

// 登陆拦截
router.beforeEach((to, from, next) => {
	if (/^\/[app|account]/.test(to.path)) {
		to.meta.show = true;
		// 判断该路由是否需要登录权限
		if (store.state.user.info) {
			// 通过vuex state获取当前的token是否存在
			next();
		} else {
			next({
				path: "/login",
				query: {
					redirect: to.fullPath
				} // 将跳转的路由path作为参数，登录成功后跳转到该路由
			});
		}
	} else {
		next();
	}
});

// 加载插件
const files = require.context("./plugins", false, /\.js$/);
files.keys().forEach(key => {
	require(`./plugins/${key.replace(/(\.\/|\.js)/g, "")}`);
});
Vue.config.productionTip = false;

new Vue({
	router,
	store,
	render: h => h(App)
}).$mount("#app");
