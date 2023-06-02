<template>
  <!-- 退货信息-商品详情 -->
  <div>
    <div class="returngoodsDetailDialog">
      <el-dialog
        title="商品详情"
        :visible.sync="isVisiable"
        :close-on-click-modal="false"
        :before-close="close"
      >
      </el-dialog>
    </div>
  </div>
</template>

<script>
export default {
  name: "returngoodsDetail",
  data() {
    return {
      isVisiable: false,
    };
  },
  methods: {
    getForm() {
      this.$emit("handleDet");
    },
    // 关闭事件
    close(val) {
      if (!val) {
        this.$emit("close");
      }
      this.isVisiable = false;
    },
  },
  created() {},
};
</script>

<style lang="scss" scoped>
</style>
