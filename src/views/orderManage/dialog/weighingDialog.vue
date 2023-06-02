<template>
  <!-- 批量过磅 -->
  <div class="weighingDialogDialog">
    <el-dialog
      :title="title"
      :visible.sync="isVisiable"
      :close-on-click-modal="false"
      :before-close="close"
      top="100px"
      width="800px"
    >
      <div class="marginform">
        <div
          style="font-size: 16px; color: rgba(0, 0, 0, 0.85); font-weight: 700"
        >
          {{ model.tableDataLink.categoryName }} |
          {{ model.tableDataLink.variety }}
        </div>

        <div style="padding: 5px 0px 5px">
          <el-row>
            <el-col :span="8"
              ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                >产地：</span
              ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                model.tableDataLink.regionname
              }}</span></el-col
            >
            <el-col :span="8"
              ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                >级别/规格：</span
              ><span
                style="
                  color: rgba(1, 6, 33, 0.9);
                  font-size: 14px;
                  padding-right: 10px;
                "
                >{{ model.tableDataLink.spec }}</span
              ></el-col
            >
            <el-col :span="8"
              ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                >计算单位：</span
              ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                model.tableDataLink.subunit
              }}</span></el-col
            >
          </el-row>
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
                    >{{ model.tableDataLink.subunit }}</span
                  >
                </el-form-item>
              </el-col>

              <el-col
                :span="8"
                v-if="model.form.pieceUnit != '无'"
                style="margin-right: 10px"
              >
                <el-form-item
                  label=""
                  :prop="'domains.' + index + '.piecenumber'"
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
                    >{{
                      model.form.pieceUnit == "筐(一次性)"
                        ? "筐"
                        : model.form.pieceUnit
                    }}</span
                  >
                </el-form-item>
              </el-col>

              <el-col :span="8" v-if="model.form.isLoad == 1">
                <el-form-item
                  label=""
                  :prop="'domains.' + index + '.piecenumber1'"
                >
                  <el-input-number
                    style="width: 100%"
                    v-model="item.piecenumber1"
                    controls-position="right"
                    :min="1"
                    :precision="0"
                  ></el-input-number>

                  <span
                    style="
                      position: absolute;
                      right: 10px;
                      color: rgba(223, 151, 26, 1);
                      font-size: 14px;
                    "
                    >筐</span
                  >
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
          {{ precisionSun2() }} {{ subComent }} {{ model.tableDataLink.subunit
          }}<span v-if="model.form.pieceUnit != '无'"
            >({{ subComent1 }}{{ model.form.pieceUnit }})</span
          ><span
            slot="suffix"
            style="color: rgba(223, 151, 26, 1); font-size: 13px"
            v-if="model.form.isLoad == 1"
            >{{ subComent2 }}|筐</span
          ></span
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
      model: {
        tableDataLink: {},
        form: {},
      },
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
    subComent1() {
      let data = 0;
      for (let i = 0; i < this.varietyCommon.domains.length; i++) {
        const ele = this.varietyCommon.domains[i];
        if (ele.piecenumber != undefined) {
          data += ele.piecenumber;
        }
      }
      return data;
    },
    subComent2() {
      let data = 0;
      for (let i = 0; i < this.varietyCommon.domains.length; i++) {
        const ele = this.varietyCommon.domains[i];
        if (ele.piecenumber1 != undefined) {
          data += ele.piecenumber1;
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
      console.log(this.model);
    },
    // 添加
    varietyAdd(val) {
      this.varietyCommon.domains.push({
        purchasenums: val == true ? this.model.purchasenums : undefined, //undefined,
        piecenumber: val == true ? this.model.piecenumber : undefined, //undefined,
        piecenumber1: val == true ? this.model.piecenumber1 : undefined, //undefined,
      });
    },
    // 移除
    varietyClose(index) {
      this.varietyCommon.domains.splice(index, 1);
    },
    // 小数点判断
    precisionSun() {
      if (
        this.model.tableDataLink.subunit == "斤" ||
        this.model.tableDataLink.subunit == "公斤" ||
        this.model.tableDataLink.subunit == "g"
      ) {
        return 2;
      } else {
        return 0;
      }
    },
    // 判断
    precisionSun2() {
      if (
        this.model.tableDataLink.subunit == "斤" ||
        this.model.tableDataLink.subunit == "公斤" ||
        this.model.tableDataLink.subunit == "g"
      ) {
        return "过磅总数：";
      } else {
        return "计件总数：";
      }
    },
    handleAdd() {
      let data = { purchasenums: 0, piecenumber: 0,piecenumber1:0 };
      for (let i = 0; i < this.varietyCommon.domains.length; i++) {
        const ele = this.varietyCommon.domains[i];
        if (ele.purchasenums != undefined) {
          data.purchasenums += ele.purchasenums;
        }

        if (ele.piecenumber != undefined) {
          data.piecenumber += ele.piecenumber;
        }
        if (ele.piecenumber1 != undefined) {
          data.piecenumber1 += ele.piecenumber1;
        }
      }

      this.$emit("weighingChange", data);
      this.close();
    },
    getStock() {
      // return first + kuohao1 + next3 + next2 + kuohao2 + next4 + last;
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
      this.model = {
        tableDataLink: {},
        form: {},
      };
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