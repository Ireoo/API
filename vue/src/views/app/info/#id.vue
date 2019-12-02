<template>
  <el-row v-loading="fullscreenLoading">
    <el-col>
      <h1>{{ app.title }}</h1>
      <div class="desc">
        创建于: {{ $time(app.createTime).format("YYYY-MM-DD") }} 最后更新:
        {{ $time(app.updateTime).format("YYYY-MM-DD") }}
      </div>
      <div class="desc">
        密钥:
        <b>{{ app.secret }}</b>
      </div>
    </el-col>
    <el-col>
      <el-tabs tab-position="top">
        <!-- <el-tabs :tab-position="collapse ? 'top' : 'left'"> -->
        <!-- <el-tab-pane label="基础信息"></el-tab-pane> -->
        <el-tab-pane label="数据表">
          <div class="desc" v-if="collections.data.length === 0">
            暂时没有添加任务数据表,请使用接口创建自己的数据吧!
          </div>
          <ul v-if="collections.data.length !== 0">
            <li v-for="c in collections.data" :key="c.info.uuid">
              {{ c.name }}
            </li>
          </ul>
        </el-tab-pane>

        <el-tab-pane label="监控"> </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "id",
  title: "应用信息",
  props: ["collapse"],
  data() {
    return {
      app: {},
      collections: { loading: false, data: [] },
      fullscreenLoading: false
    };
  },
  created() {
    this.fullscreenLoading = true;
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
          document.title = this.app.title;
        } else {
          this.$message.error(`应用不存在!`);
          this.$router.push({ path: "/app" });
        }
        this.fullscreenLoading = false;
      })
      .catch(error => {
        this.$message.error(error);
      });

    this.collections = { loading: true, data: [] };
    this.$http(`all/listCollections`, { app: this.$route.params.id }) //, { app: this.$route.params.id }
      .then(data => {
        this.console(data);
        this.collections = { loading: false, data };
      });
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 20px;
}

h2 {
  text-align: center;
  font-size: 20px;
  margin-bottom: 5px;
}

b {
  color: #4898f8;
}

.el-col {
  margin-bottom: 20px;
}

.desc {
  text-align: center;
  color: #ccc;
  font-size: 12px;
  margin-bottom: 5px;
}

.item {
  margin-bottom: 5px;
}

.main {
  margin-top: 30px;
}

ul {
  list-style: none;
}
</style>
