<template>
  <!-- 常交易商品 -->
  <div class="productListelDialog">
    <el-dialog
      :title="title"
      :visible.sync="isVisiable"
      :close-on-click-modal="false"
      :before-close="close"
      top="50px"
      width="400px"
    >
      <div class="marginform" >
        <el-scrollbar :style="{ '--screenHeight': $store.getters.screenHeight<650?$store.getters.screenHeight-200+'px':'450px' }">
          <div v-if="this.model.length > 0">
            <div
              v-for="(item, index) in this.model"
              :key="index"
              style="margin-bottom: 16px"
            >
              <div
                style="
                  color: rgba(1, 6, 33, 0.9);
                  font-size: 14px;
                  margin-bottom: 4px;
                "
              >
                {{item.productName}}
              </div>
              <!-- <div style="color: rgba(1, 6, 33, 0.55); font-size: 14px">
                黄心土豆 荷兰35号 东北牛肉13号 东北牛肉13号 东北牛肉13号
                东北牛肉13号 东北牛肉13号
              </div> -->
            </div>
          </div>
          <div v-else>无</div>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "productList",
  data() {
    return {
      loading: false,
      title: "常交易商品",
      isVisiable: false,
      disableSubmit: false,
      model: [],
    };
  },

  methods: {
    add() {},
    edit(record) {
      this.loading = true;
      this.model = record;
    },
    // 清空数据
    clearTree() {},
    // 提交数据
    confirmEdit() {},
    // 关闭事件
    close(val) {
      if (!val) {
        this.$emit("close");
      }
      this.isVisiable = false;
      this.disableSubmit = false;
      this.model = [];
      this.loading = false;
    },
  },
};
</script>

<style scoped lang="scss">
.productListelDialog {
  .marginform {
    margin-bottom: 5px;
    overflow: hidden;

    ::v-deep .el-scrollbar {
      .el-scrollbar__wrap {
        margin-bottom: 0px !important;
        overflow-x: hidden;
        .el-scrollbar__view {
          max-height: var(--screenHeight);
          position: relative;
          padding: 5px;
        }
      }
    }
  }
}

.drawer-bootom-button {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>

<style lang="scss">
.productListelDialog {
  .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>