<template>
  <!-- 筐子信息 -->
  <div class="basketInformDialog">
    <el-dialog
      :title="title"
      :visible.sync="isVisiable"
      :close-on-click-modal="false"
      :before-close="close"
      top="23vh"
      width="500px"
    >
      <div class="marginform flex_dom flex_item_mid">
        <div style="margin: 20px 10px 20px 24px">
          <el-image
            style="width: 100px; height: 100px"
            :src="model.basketImage || url"
            fit="fill"
          ></el-image>
        </div>
        <div style="margin: 20px 10px 20px 20px">
          <div
            style="
              color: rgba(1, 6, 33, 0.9);
              font-size: 14px;
              margin-bottom: 8px;
              letter-spacing: 1px;
            "
          >
            {{ model.basketName }}
          </div>
          <div style="margin-bottom: 8px">
            <span
              style="
                color: rgba(1, 6, 33, 0.55);
                font-size: 14px;
                letter-spacing: 1px;
              "
              >筐子重量：</span
            ><span
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 14px;
                letter-spacing: 1px;
              "
              >{{ model.basketWeight }}斤</span
            >
          </div>
          <div
            style="
              color: rgba(1, 6, 33, 0.9);
              font-size: 14px;
              margin-bottom: 8px;
              letter-spacing: 1px;
            "
          >
            适用范围：
          </div>
          <div
            v-for="(item, index) in model.applyTo"
            :key="index"
            style="
              color: rgba(1, 6, 33, 0.9);
              font-size: 14px;
              margin-bottom: 8px;
              letter-spacing: 1px;
            "
          >
            <div class="flex_dom">
              <div style="word-break: keep-all">
                {{ item.split("：")[0] }}：
              </div>
              <div>{{ item.split("：")[1] }}</div>
            </div>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import basket from "@/assets/image/imgs/basket.png";
export default {
  name: "basketInform",
  data() {
    return {
      loading: false,
      title: "筐子信息",
      isVisiable: false,
      disableSubmit: false,
      url: basket,
      model: {},
    };
  },

  methods: {
    add() {},
    edit(record) {
      this.loading = true;
      this.model = Object.assign({}, this.model, record);
    },
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
.basketInformDialog {
  .marginform {
    padding: 25px 20px;
  }
}
</style>

<style lang="scss">
.basketInformDialog {
  .el-dialog__body {
    padding: 0px 0px;
  }

  .el-form-item__label {
    line-height: 0px;
  }
}
</style>