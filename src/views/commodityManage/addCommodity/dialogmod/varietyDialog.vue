<template>
  <!-- 品种/品牌 -->
  <el-dialog
    :title="title"
    :visible.sync="isVisiable"
    :close-on-click-modal="false"
    :before-close="close"
    append-to-body
    top="100px"
    width="600px"
    class="varietyDialogDialog"
  >
    <div class="marginform">
      <div
        style="font-size: 16px; color: rgba(0, 0, 0, 0.85); font-weight: 700"
      >
        {{ model.pathProductName }}
      </div>

      <div style="padding: 25px 0px">
        <el-form
          :model="form"
          ref="ruleForm"
          label-width="90px"
          class="demo-ruleForm"
          label-position="left"
          size="mini"
        >
          <el-form-item label="品种/品牌：" prop="variety">
            <el-input
              style="width: 300px"
              v-model="form.variety"
              placeholder="请输入内容"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
      </div>

      <div style="padding-bottom: 8px">
        <div
          style="color: rgba(0, 0, 0, 0.85); font-size: 14px; font-weight: 700"
        >
          经常使用
        </div>
        <div style="padding: 10px 0px">
          <el-tag
            style="
              margin: 0px 15px 8px 0px;
              display: inline-block;
              border: 1px solid #d0d0d2;
              color: rgba(1, 6, 33, 0.75);
              cursor: pointer;
            "
            v-for="(tag, index) in varietyCommon"
            :key="index"
            @click="varietyChange(tag)"
            closable
            @close="varietyClose(index)"
            type="info"
            effect="plain"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>

      <div style="padding-bottom: 8px">
        <div
          style="color: rgba(0, 0, 0, 0.85); font-size: 14px; font-weight: 700"
        >
          通用
        </div>
        <div style="padding: 10px 0px">
          <el-tag
            style="
              margin: 0px 15px 8px 0px;
              display: inline-block;
              border: 1px solid #d0d0d2;
              color: rgba(1, 6, 33, 0.75);
              cursor: pointer;
            "
            v-for="(tag, index) in varList"
            :key="index"
            @click="varietyChange(tag)"
            type="info"
            effect="plain"
          >
            {{ tag }}
          </el-tag>
        </div>
      </div>
    </div>

    <div class="creditLineBottom">
      <el-button size="mini" style="margin-right: 10px" @click="close"
        >取消</el-button
      >
      <el-button
        size="mini"
        type="primary"
        style="margin-right: 10px"
        @click="handleAdd"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { varietyList } from "@/request/api/commodityManage/commodityList";

export default {
  name: "varietyDialog",
  data() {
    return {
      loading: false,
      title: "品种/品牌",
      isVisiable: false,
      disableSubmit: false,
      model: {},
      form: { variety: "" },
      varList: [],
      varietyCommon: [],
    };
  },

  methods: {
    add() {},
    edit(record) {
      this.loading = true;
      this.model = Object.assign({}, this.model, record);
      // 获取常用
      this.varietyCommon = JSON.parse(localStorage.getItem("varietyCommon"));
      this.getVarietyList();
    },
    // 获取品牌
    getVarietyList() {
      varietyList({ categoryId: this.model.productid }).then((res) => {
        if (res.status == 200) {
          this.varList = res.data;
        }
      });
    },
    varietyChange(val) {
      this.form.variety = val;
    },
    // 删除常用
    varietyClose(index) {
      this.varietyCommon.splice(index, 1);
      localStorage.setItem("varietyCommon", JSON.stringify(this.varietyCommon));
    },
    handleAdd() {
      if (!this.form.variety) {
        this.$warning("请输入品种/品牌");
      } else {
        let varloc = JSON.parse(localStorage.getItem("varietyCommon"));
        if (
          varloc == null ||
          varloc == undefined ||
          varloc.length == 0 ||
          varloc == ""
        ) {
          localStorage.setItem(
            "varietyCommon",
            JSON.stringify([this.form.variety])
          );
        } else {
          if (varloc.indexOf(this.form.variety) == -1) {
            varloc.push(this.form.variety);
            localStorage.setItem("varietyCommon", JSON.stringify(varloc));
          }
        }
        this.$emit("varietyChange", this.form);
        this.close();
      }
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
      this.loading = false;
      this.isVisiable = false;
      this.disableSubmit = false;
      this.model = {};
      this.form = { variety: "" };
      this.varList = [];
      this.varietyCommon = [];
    },
  },
};
</script>

<style scoped lang="scss">
.varietyDialogDialog {
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
.varietyDialogDialog {

  .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>