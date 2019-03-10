<template>
  <el-row>
    <el-col style="text-align: right; margin-bottom: 20px;">
      <el-button-group>
        <el-button
          :type="!list ? 'primary' : ''"
          size="mini"
          icon="iconfont icon-list1"
          @click="list=false"
        ></el-button>
        <el-button
          :type="list ? 'primary' : ''"
          size="mini"
          icon="iconfont icon-list"
          @click="list=true"
        ></el-button>
      </el-button-group>
    </el-col>
    <el-col v-if="list">
      <el-row>
        <el-col>
          <el-table :data="appsShow" border v-loading="loading" style="width: 100%">
            <el-table-column prop="title" label="名称">
              <template slot-scope="scope">
                <router-link :to="`/app/info/${scope.row._id}`">{{scope.row.title}}</router-link>
              </template>
            </el-table-column>
            <el-table-column prop="_id" label="APP id"></el-table-column>
            <el-table-column prop="secret" label="APP secret"></el-table-column>
            <el-table-column label="创建时间">
              <template slot-scope="scope">
                <i class="el-icon-time"></i>
                <span
                  style="margin-left: 10px"
                >{{ $time(scope.row.createTime).format("YYYY-MM-DD") }}</span>
              </template>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="80">
              <template slot-scope="scope">
                <el-button
                  @click="secret(scope.row)"
                  :loading="scope.row.update"
                  :disabled="scope.row.del"
                  type="primary"
                  size="mini"
                >编辑</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
    </el-col>
    <el-col v-if="!list">
      <el-row :gutter="20" v-loading="loading">
        <el-col
          v-for="app in appsShow"
          :key="app._id"
          style="margin-bottom: 20px;"
          :span="!collapse ? 12 : 24"
        >
          <el-card shadow="hover">
            <div slot="header" class="clearfix">
              <span>
                <router-link :to="`/app/info/${app._id}`">{{app.title}}</router-link>
              </span>
              <span class="desc m5">( ID: {{app._id}} )</span>
              <el-button
                style="float: right; padding: 5px 10px;"
                type
                size="mini"
                @click="secret(app)"
                :loading="app.update"
                :disabled="app.del"
              >编辑</el-button>
            </div>
            <div class="desc item">{{app.desc}}</div>
            <div class="text item">密钥: {{app.secret}}</div>
            <div class="text item">创建于: {{$time(app.createTime).format("YYYY-MM-DD")}}</div>
          </el-card>
        </el-col>
      </el-row>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "admin",
  title: "应用管理",
  icon: "iconfont icon-gaikuang",
  index: 0,
  show: true,
  props: ["collapse"],
  components: {},
  data() {
    return {
      apps: [],
      loading: true,
      list: false
    };
  },
  methods: {
    secret(app) {
      this.console(app);
      this.$router.push({ path: `/app/edit/${app._id}` });
    },
    del(app) {
      this.console(app);
      app.del = true;
      this.$http("apps/remove", { where: { _id: app._id } })
        .then(() => {
          this.$message.success("删除成功!");
          // this.apps.splice(app.$index,1);
          app.show = false;
          app.del = false;
        })
        .catch(e => {
          this.$message.error(e);
        });
    }
  },
  computed: {
    appsShow() {
      return this.apps.filter(app => app.show);
    }
  },
  mounted() {
    this.$http("apps/find", {
      where: { uuid: this.$store.state.user.info._id }
    })
      .then(data => {
        this.loading = false;
        this.apps = data.map(app => {
          app.del = false;
          app.update = false;
          app.show = true;
          return app;
        });
      })
      .catch(e => {
        this.loading = false;
        this.$message.error(e);
      });
  }
};
</script>

<style scoped>
button span {
  font-size: 12px !important;
}

a {
  text-decoration: none;
  color: #4898f8;
  font-weight: bold;
}

.m5 {
  margin-left: 5px;
}

.desc {
  color: #ccc;
}

.item {
  margin-bottom: 5px;
}

.desc.item {
  margin-bottom: 20px;
  font-size: 18px;
}
</style>
