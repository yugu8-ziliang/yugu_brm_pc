<template>
  <!-- 参考照片 -->
  <div class="referencePhotoDialog">
    <el-dialog
      :title="title"
      :visible.sync="isVisiable"
      :close-on-click-modal="false"
      :before-close="close"
      top="50px"
      width="600px"
    >
      <div class="marginform" style="margin:10px auto;width:400px;">
       <div   v-for="(item, index) in srcList"
          :key="index" style="margin-top:10px;">
         <el-image
        
          style="width: 400px; height: 224px"
          :src="item"
          :preview-src-list="srcList"
        >
        </el-image>
       </div>
      </div>

      <div class="creditLineBottom">
        <el-button
          size="mini"
          type="primary"
          style="margin-right: 10px"
          @click="close"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "referencePhoto",
  data() {
    return {
      loading: false,
      title: "参考照片",
      isVisiable: false,
      disableSubmit: false,
      model: {},
      srcList: [
        require("@/assets/image/imgs/carPhoto1.png"),
        require("@/assets/image/imgs/carPhoto2.png"),
        require("@/assets/image/imgs/carPhoto3.png"),
      ],
    };
  },

  methods: {
    add() {},
    edit(record) {},
    handleAdd() {},
    // 清空数据
    clearTree() {},
    // 提交数据
    confirmEdit() {},
    // 关闭事件
    close(val) {
      if (!val) {
        this.$emit("close");
      }
      this.loading = false;
      this.isVisiable = false;
      this.disableSubmit = false;
      this.model = {};
    },
  },
};
</script>

<style scoped lang="scss">
.referencePhotoDialog {
  .marginform {
  }
  .creditLineBottom {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid rgba(1, 6, 33, 0.06);
    padding: 5px;
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
.referencePhotoDialog {
  .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>