<template>
  <el-row>
    <el-col :class="{collapse}">
      <!-- <el-menu
				:class="{collapse}"
				:default-active="$route.path"
				mode="horizontal"
				text-color="#ccc"
				:router="true"
				active-text-color="#333"
				menu-trigger="click"
			>
				<el-row>
					<el-col :span="16">
						<el-menu-item class="logo" index="/home">
							<i class="iconfont icon-api logo"></i>
							<span slot="title">{{collapse ? '' : '琦益数据管理中心'}}</span>
						</el-menu-item>
						<el-submenu v-for="(route, index) in routes" :key="index" :index="route.path">
							<template slot="title">
								<span slot="title">{{route.meta.title}}</span>
							</template>
							<el-menu-item :index="route.path">
								<span slot="title">{{route.meta.title}}</span>
							</el-menu-item>
							<el-menu-item v-for="(router, i) in route.child" :key="i" :index="router.path">
								<span slot="title">{{router.meta.title}}</span>
							</el-menu-item>
						</el-submenu>
					</el-col>
					<el-col class="right" :span="8">
						<el-menu-item v-if="!$store.state.user.info" index="/login">
							<i class="iconfont icon-denglu"></i>
							<span slot="title">{{collapse ? '' : "登陆"}}</span>
						</el-menu-item>
						<el-menu-item v-if="!$store.state.user.info" index="/reg">
							<i class="iconfont icon-zhuceyaoqing" v-if="collapse"></i>
							<span slot="title">{{collapse ? '' : "注册"}}</span>
						</el-menu-item>
						<el-menu-item v-if="$store.state.user.info" index="/account">
							<i class="iconfont icon-yonghu4"></i>
							<span slot="title">{{collapse ? '' : $store.state.user.info.username}}</span>
						</el-menu-item>
						<el-menu-item v-if="$store.state.user.info" index="/logout" @click="logout">
							<i class="iconfont icon-tuichu1" v-if="collapse"></i>
							<span slot="title">{{collapse ? '' : "退出"}}</span>
						</el-menu-item>
					</el-col>
				</el-row>
      </el-menu>-->
      <ul class="left">
        <li v-if="!$store.state.user.info">
          <router-link to="/home">
            <i class="iconfont icon-shouquanjiekou logo"></i>
            <span>{{collapse ? '' : '爱数据'}}</span>
          </router-link>
        </li>
        <li v-if="$store.state.user.info">
          <router-link to="/apps">
            <i class="iconfont icon-shouquanjiekou logo"></i>
            <span>{{collapse ? '' : '爱数据'}}</span>
          </router-link>
        </li>
      </ul>
      <ul class="right no" v-if="!$store.state.user.info">
        <li>
          <router-link to="/login">
            <span>登陆</span>
          </router-link>
        </li>
        <li>
          <router-link to="/reg">
            <span>注册</span>
          </router-link>
        </li>
      </ul>
      <ul class="right" v-if="$store.state.user.info">
        <li>
          <router-link to="/info">
            <i class="iconfont icon-icon" v-if="infos === 0"></i>
            <el-badge is-dot class="item" v-if="infos > 0">
              <i class="iconfont icon-icon"></i>
            </el-badge>
          </router-link>
        </li>
        <li>
          <!-- <router-link to="/">
						<i class="iconfont icon-yonghu4"></i>
						<span>{{collapse ? '' : $store.state.user.info.username}}</span>
          </router-link>-->
          <el-dropdown trigger="click" @command="routerGo">
            <span class="el-dropdown-link">
              <i class="iconfont icon-yingyong1"></i>
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="/app/add">创建一个应用</el-dropdown-item>
              <el-dropdown-item command="/apps">管理所有应用</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <li>
          <!-- <router-link to="/">
						<i class="iconfont icon-yonghu4"></i>
						<span>{{collapse ? '' : $store.state.user.info.username}}</span>
          </router-link>-->
          <el-dropdown trigger="click" @command="routerGo">
            <span class="el-dropdown-link">
              <img src="https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png" />
              <i class="el-icon-arrow-down el-icon--right"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="/account">信息</el-dropdown-item>
              <el-dropdown-item command="/account/setting">设置</el-dropdown-item>
              <el-dropdown-item command="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </li>
        <!-- <li>
					<router-link to="/">
						<i class="iconfont icon-tuichu1"></i>
						<span>{{collapse ? '' : '退出'}}</span>
					</router-link>
        </li>-->
      </ul>
      <br />
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "Header",
  props: ["collapse"],
  methods: {
    routerGo(path) {
      if (path === "logout") {
        this.$store.commit("account.REMOVE");
        location.href = "/";
      } else {
        this.$router.push({ path });
      }
    }
  },
  data() {
    return {
      isCollapse: false,
      show: ["App"],
      infos: 0
    };
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
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
br {
  clear: both;
}

.el-row {
  max-width: 1220px;
  margin: auto;
  padding: 0 10px;
}

a {
  line-height: 40px;
  height: 40px;
  padding: 10px 0;
  text-decoration: none;
  display: block;
}

a span {
  color: #ccc;
  font-size: 16px;
  display: table-cell;
  vertical-align: middle;
  font-weight: bold;
}

a i {
  color: #ccc;
  font-size: 32px;
  display: table-cell;
  vertical-align: middle;
  line-height: 40px;
}

.el-icon--right {
  padding-left: 5px;
  margin: 0;
}

.el-dropdown-link {
  display: block;
  cursor: pointer;
}

.el-dropdown-link img {
  float: left;
  background: #ccc;
  width: 23px;
  height: 23px;
  border-radius: 5px;
  margin: 8px 0 5px 0;
  overflow: hidden;
  display: table-cell;
  vertical-align: middle;
}

.el-dropdown-link i {
  float: left;
  line-height: 40px;
  display: table-cell;
  vertical-align: middle;
}

.el-dropdown-link:hover i.iconfont {
  color: #333;
}

a:hover span,
a:hover i,
a.router-link-active span,
a.router-link-active i {
  color: #333;
}

i.iconfont {
  font-size: 24px;
}

.el-badge {
  height: 40px;
  width: 24px;
}

.el-badge i {
  position: absolute;
  top: -2px;
}

ul {
  list-style: none;
  /* height: 60px; */
}

a:hover i.logo,
i.logo,
a.router-link-active i.logo {
  color: #4898f8;
  font-size: 30px;
  padding-right: 10px;
}

.iconfont {
  color: #c0c4cc;
}

ul.left {
  float: left;
  height: 60px;
}

ul.left li {
  margin-right: 10px;
  height: 60px;
}

ul.right {
  float: right;
}

/* ul.right li:nth-child(2) {
  padding-left: 30px;
} */

ul.right li {
  padding-left: 10px;
}

ul.right.no li {
  padding-left: 10px;
}

ul.left li,
ul.right li {
  display: inline-block;
  /* line-height: 60px; */
  display: table-cell;
  vertical-align: middle;
}

ul.right li:nth-child(1) a {
  position: relative;
  width: 24px;
}

ul.right li:nth-child(1) a > i {
  position: absolute;
  top: 8px;
}

ul.right li:nth-child(1) a > div > i {
  position: absolute;
  top: -4px;
}

menu__item:focus,
.el-dropdown-menu__item:not(.is-disabled):hover {
  background: #333;
  color: #fff;
}
</style>
