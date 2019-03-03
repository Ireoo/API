<template>
  <el-row v-loading.fullscreen.lock="fullscreenLoading">
    <el-col v-if="!fullscreenLoading">
      <h1>{{app.title}}</h1>
      <div class="desc">创建于: {{$time(app.createTime).format("YYYY-MM-DD")}}</div>
      <div class="desc">密钥: {{app.secret}}</div>
      <el-card class="box-card main">
        <h2>数据库管理</h2>
        <div class="desc" v-if="collections.length === 0">暂时没有添加任务数据表,请使用接口创建自己的数据吧!</div>
        <el-card class="box-card" shadow="never" v-if="collections.length !== 0">
          <ul>
            <li v-for="c in collections" :key="c.info.uuid">{{c.name}}</li>
          </ul>
        </el-card>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "id",
  data() {
    return {
      app: {},
      collections: [],
      fullscreenLoading: false
    };
  },
  created() {
    this.fullscreenLoading = true
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
        this.fullscreenLoading = false
      })
      .catch(error => {
        this.$message.error(error);
      });

    this.$http(`all/listCollections`, { app: this.$route.params.id }) //, { app: this.$route.params.id }
      .then(data => {
        this.console(data)
        this.collections = data
      })
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
  font-size: 24px;
  margin-bottom: 5px;
}

h2 {
  text-align: center;
  font-size: 20px;
  margin-bottom: 5px;
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
