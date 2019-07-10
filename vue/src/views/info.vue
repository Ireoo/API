<template>
  <el-row>
    <el-col>
      <el-table :data="infos" border v-loading="loading" style="width: 100%">
        <el-table-column prop="content" label="内容"></el-table-column>
        <el-table-column prop="from" label="来源"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 10px">{{ $time(scope.row.createTime).format("YYYY-MM-DD") }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              @click="secret(scope.row)"
              :loading="scope.row.update"
              :disabled="scope.row.del"
              type="primary"
              size="mini"
            >重置密钥</el-button>
            <el-button
              @click="del(scope)"
              :loading="scope.row.del"
              :disabled="scope.row.update"
              type="danger"
              size="mini"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "info",
  title: "通知",
  components: {},
  data() {
    return {
      infos: [],
      loading: false
    };
  },
  mounted() { }
};
</script>

<style scoped>
</style>
