
<template>
  <el-tag type="info" v-if="type === 0" size="mini">非</el-tag>
  <el-tag v-else-if="type === 11 || type === 10" size="mini">供 </el-tag>
  <el-tag type="danger" v-else-if="type == 6 || type == 7" size="mini"
    >经
  </el-tag>
  <el-tag type="warning" v-else-if="type == 3 || type == 4" size="mini"
    >采
  </el-tag>
</template>
<!-- 0.非平台 3.企业采购户 4.个人采购户 6.企业经营户 7.个人经营户 10.个人供应商 11.企业供应商 -->
<script>
export default {
  name: "UserType",
  props: {
    type: {
      type: Number,
      default: 0,
    },
  },
};
</script>

<style lang="scss" scoped>
.el-tag {
  font-size: 10px;
  transform: scale(0.83);
  margin: 0 2px;
}
</style>