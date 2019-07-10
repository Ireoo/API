<template>
  <el-row>
    <el-col>
      <el-tree
        :props="database"
        :load="loadNode"
        lazy
        show-checkbox
        @check-change="handleCheckChange"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button type="text" size="mini" @click="() => append(data)">Append</el-button>
            <el-button type="text" size="mini" @click="() => remove(node, data)">Delete</el-button>
          </span>
        </span>
      </el-tree>
    </el-col>
  </el-row>
</template>

<script>
export default {
  name: "info",
  title: "数据库管理",
  icon: "iconfont icon-database1",
  index: 1,
  data() {
    return {
      database: []
    };
  },
  methods: {
    loadNode(node, resolve) {
      this.console(node);
      resolve([]);
    },
    handleCheckChange() { }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
