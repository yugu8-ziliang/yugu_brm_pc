<template>
  <!-- 批量过磅 -->
  <div class="weighingDialogDialog">
    <el-dialog
      :title="title"
      :visible.sync="isVisiable"
      :close-on-click-modal="false"
      :before-close="close"
      top="100px"
      width="600px"
    >
      <div class="marginform">
        <div
          style="font-size: 16px; color: rgba(0, 0, 0, 0.85); font-weight: 700"
        >
          {{ model.pathProductName }} | {{ model.variety }}
        </div>

        <div
          style="
            padding: 10px 0px;
            font-size: 14px;
            color: rgba(1, 6, 33, 0.75);
          "
        >
          {{ model.pathRegionname
          }}<span style="margin-left: 30px">{{ model.spec }}</span>
        </div>

        <div style="padding: 10px 0px 15px">
          <el-form
            :model="varietyCommon"
            ref="ruleForm"
            label-width="0px"
            label-position="left"
            size="mini"
            style="padding: 0px 0px 8px"
          >
            <el-row
              class="flex_dom flex_item_mid"
              v-for="(item, index) in varietyCommon.domains"
              :key="index"
            >
              <span style="white-space: nowrap; padding: 0px 0px 10px"
                >计数{{ index + 1 }}：</span
              >
              <el-col :span="8" style="margin-right: 10px">
                <el-form-item
                  label=""
                  :prop="'domains.' + index + '.purchasenums'"
                  :rules="{
                    required: true,
                    message: '请输入数量',
                    trigger: 'blur',
                  }"
                >
                  <el-input-number
                    style="width: 100%"
                    v-model="item.purchasenums"
                    controls-position="right"
                    :min="1"
                    :precision="precisionSun()"
                  ></el-input-number>
                  <span
                    style="
                      position: absolute;
                      right: 10px;
                      font-size: 14px;
                      color: rgba(1, 6, 33, 0.75);
                    "
                    >{{ model.subunit }}</span
                  >
                </el-form-item>
              </el-col>
              <el-col :span="8" v-if="model.pieceunit != '无'">
                <el-form-item
                  label=""
                  :prop="'domains.' + index + '.piecenumber'"
                  :rules="{
                    required: true,
                    message: '请输入件数',
                    trigger: 'blur',
                  }"
                >
                  <el-input-number
                    style="width: 100%"
                    v-model="item.piecenumber"
                    controls-position="right"
                    :min="1"
                    :precision="0"
                  ></el-input-number>
                  <span
                    style="
                      position: absolute;
                      right: 10px;
                      font-size: 14px;
                      color: rgba(1, 6, 33, 0.75);
                    "
                    v-html="pieceunitHt()"
                  ></span>
                </el-form-item>
              </el-col>
              <el-button
                type="text"
                size="mini"
                @click="varietyClose(index)"
                style="
                  color: rgba(221, 76, 77, 1);
                  font-size: 14px;
                  padding: 0px 0px 10px 10px;
                "
                >移除</el-button
              >
            </el-row>
          </el-form>

          <el-button size="mini" @click="varietyAdd">添加计数</el-button>
        </div>
      </div>

      <div class="creditLineBottom">
        <span
          style="
            color: rgba(1, 6, 33, 0.9);
            font-size: 14px;
            font-weight: 700;
            margin-right: 15px;
          "
        >
          {{ precisionSun2() }} {{ subComent }} {{ model.subunit }}</span
        >
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
  </div>
</template>

<script>
export default {
  name: "weighingDialog",
  data() {
    return {
      loading: false,
      title: "批量过磅",
      isVisiable: false,
      disableSubmit: false,
      model: {},
      varietyCommon: {
        domains: [],
      },
    };
  },
  computed: {
    subComent() {
      let data = 0;
      for (let i = 0; i < this.varietyCommon.domains.length; i++) {
        const ele = this.varietyCommon.domains[i];
        if (ele.purchasenums != undefined) {
          data += ele.purchasenums;
        }
      }
      return data;
    },
  },
  methods: {
    add() {},
    edit(record) {
      this.loading = true;
      this.model = Object.assign({}, this.model, record);
      let datas = this.model.pathRegionname.split("-");
      let len = this.model.pathRegionname.split("-").length;
      this.model.pathRegionname = datas[len - 2] + "-" + datas[len - 1];
      this.varietyAdd(true);
    },
    // 添加
    varietyAdd(val) {
      this.varietyCommon.domains.push({
        purchasenums: val==true?this.model.purchasenums:undefined, //undefined,
        piecenumber: val==true?this.model.piecenumber:undefined, //undefined,
      });
    },
    // 移除
    varietyClose(index) {
      this.varietyCommon.domains.splice(index, 1);
    },
    // 小数点判断
    precisionSun() {
      if (
        this.model.subunit == "斤" ||
        this.model.subunit == "公斤" ||
        this.model.subunit == "g"
      ) {
        return 2;
      } else {
        return 0;
      }
    },
    // 判断
    precisionSun2() {
      if (
        this.model.subunit == "斤" ||
        this.model.subunit == "公斤" ||
        this.model.subunit == "g"
      ) {
        return "过磅总数：";
      } else {
        return "计件总数：";
      }
    },
    pieceunitHt() {
      if (this.model.pieceunit == "筐(一次性)") {
        return "筐";
      } else if (this.model.pieceunit == "筐(周转筐)") {
        return "<span style='color:#DF971A'>筐</span>";
      } else {
        return this.model.pieceunit;
      }
    },
    handleAdd() {
      let data = { purchasenums: 0, piecenumber: 0 };
      for (let i = 0; i < this.varietyCommon.domains.length; i++) {
        const ele = this.varietyCommon.domains[i];
        if (ele.purchasenums != undefined) {
          data.purchasenums += ele.purchasenums;
        }

        if (ele.piecenumber != undefined) {
          data.piecenumber += ele.piecenumber;
        }
      }

      this.$emit("weighingChange", data);
      this.close();
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
      this.varietyCommon = {
        domains: [],
      };
    },
  },
};
</script>

<style scoped lang="scss">
.weighingDialogDialog {
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
    align-items: center;
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
.weighingDialogDialog {
  .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>