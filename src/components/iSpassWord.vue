<template>
  <!-- 更改前记录 已付款-->
  <div class="iSpassWordDialog">
    <el-dialog
      :title="title"
      :visible.sync="isVisiable"
      :close-on-click-modal="false"
      :before-close="close"
      top="30vh"
      width="400px"
    >
      <div class="marginform">
        <div style="font-size:16px">
            未设置支付密码，<span style="cursor: pointer;;color: var(--default-color)" @click="handleJump"
          >前往设置</span
        >
        </div>
      </div>
      <div class="iSpassWordBottom">
        <!-- <el-button style="margin-right: 10px" @click="close">取 消</el-button> -->
        <el-button type="primary" style="margin-right: 10px" @click="close"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "iSpassWord",
  data() {
    return {
      loading: false,
      title: "提示",
      isVisiable: false,
      disableSubmit: false,
    };
  },
  methods: {
    add() {
      this.loading = true;
      this.isVisiable = true;
      this.disableSubmit = true;
    },
    edit(record) {
      this.loading = true;
      this.isVisiable = true;
      this.disableSubmit = true;
    },
    // 提交数据
    handleAdd() {},
    // 前往设置
    handleJump(){},
    // 关闭事件
    close(val) {
      if (!val) {
        this.$emit("close");
      }

      this.loading = false;
      this.isVisiable = false;
      this.disableSubmit = false;
    },
  },
};
</script>

<style scoped lang="scss">
.iSpassWordDialog {
  .marginform {
    padding: 20px;
  }

  .iSpassWordBottom {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid rgba(1, 6, 33, 0.06);
    padding: 10px;
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
.iSpassWordDialog {
  .el-dialog__body {
    padding: 0px 0px;
  }

  .el-form-item__label {
    line-height: 0px;
  }
}
</style>