<template>
  <el-container id="app" ref="app" :class="['wrapper', {ios}]">
    <el-main>
      <el-scrollbar>
        <!-- <el-header> -->
        <Header :collapse="collapse"></Header>
        <!-- </el-header> -->
        <!-- <el-container> -->
        <!-- <el-aside :class="{collapse: mini}" v-if="$route.meta.show">
				<el-scrollbar>
					<Sider :collapse="mini"></Sider>
				</el-scrollbar>
        </el-aside>-->
        <!-- <el-container> -->
        <!-- <el-main>
        <el-scrollbar>-->
        <router-view
          :class="['content', {collapse}, {body: !$route.meta.show}]"
          :collapse="collapse"
        />
        <el-footer>
          <Footer :width="width"></Footer>
        </el-footer>
        <!-- </el-scrollbar>
        </el-main>-->
        <!-- <el-footer>Width: {{width}}</el-footer>
        </el-container>-->
        <!-- </el-container> -->
      </el-scrollbar>
    </el-main>
  </el-container>
</template>

<script>
import Header from "./components/header.vue";
import Sider from "./components/sider.vue";
import Footer from "./components/footer.vue";

export default {
  name: "App",
  data() {
    return {
      uri: "",
      width: document.documentElement.clientWidth,
      mini: document.documentElement.clientWidth < 900,
      collapse: document.documentElement.clientWidth < 700,
      ios: !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)
    };
  },
  components: {
    Header,
    Sider,
    Footer
  },
  watch: {
    "$route.meta": {
      handler: val => {
        this.console(val);
        if (val.title) document.title = val.title;
      },
      deep: true
    }
  },
  mounted() {
    if (this.$route.meta.title) document.title = this.$route.meta.title;
    window.onresize = () => {
      this.collapse = document.documentElement.clientWidth < 700;
      this.mini = document.documentElement.clientWidth < 900;
      this.width = document.documentElement.clientWidth;
    };
  }
};
</script>

<style>
@import url("//at.alicdn.com/t/font_860942_fe2o0d3x3rg.css");

* {
  margin: 0;
  padding: 0;
  font-size: 14px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen",
    "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue",
    sans-serif;
  outline: none;
}

.el-scrollbar {
  height: 100%;
}

.el-scrollbar__wrap {
  overflow-x: hidden !important;
}

#app.ios .el-input__inner {
  font-size: 16px !important;
}

.text-right {
  text-align: right;
}

.el-form {
  min-width: 500px;
  max-width: 700px;
}

.content.collapse .el-col-12 {
  width: 100%;
}

.content.collapse .el-form {
  min-width: auto;
  max-width: auto;
  width: 100%;
}

.content.collapse .el-form-item__label {
  float: none;
}

.content.collapse .el-form-item__content {
  float: none;
  margin-left: 0 !important;
}
</style>


<style scoped>
.el-scrollbar__wrap {
  margin: 0;
}

.wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

header {
  /* background: #515961; */
  padding: 0;
}

aside {
  width: 190px !important;
  background: #545c64;
}

aside.collapse {
  width: 64px !important;
  background: #545c64;
}

main {
  padding: 0 !important;
}

.content {
  padding: 50px 20px 20px 20px;
  margin: 0 auto;
  max-width: 1200px;
}

/* .content.body {
	margin: auto;
	max-width: 800px;
} */
</style>
