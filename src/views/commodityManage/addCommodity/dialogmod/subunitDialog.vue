<template>
  <!-- 计算单位 -->
    <el-dialog
    class="subunitDialogDialog"
      :title="title"
      :visible.sync="isVisiable"
      :close-on-click-modal="false"
      :before-close="close"
      append-to-body
      top="100px"
      width="600px"
    >
      <div class="marginform">
        <div
          style="font-size: 16px; color: rgba(1, 6, 33, 0.75); font-weight: 700"
        >
          商品分类：{{ model.pathProductName }}
        </div>

        <div
          style="
            padding: 16px 0px 10px;
            font-size: 16px;
            color: rgba(1, 6, 33, 0.75);
          "
        >
          选择计算单位
        </div>

        <div style="padding-bottom: 0px">
          <div style="padding: 0px 0px 10px">
            <el-tag
              style="
                margin: 0px 15px 8px 0px;
                display: inline-block;
                border: 1px solid #d0d0d2;
                color: rgba(1, 6, 33, 0.75);
                cursor: pointer;
              "
              :class="varietyIndex == index ? 'varietyActive' : ''"
              v-for="(tag, index) in varietyCommon.subUnitTree"
              :key="index"
              @click="varietyChange(tag, index)"
              type="info"
              effect="plain"
            >
              {{ tag.subUnit }}
            </el-tag>
          </div>
        </div>

        <div
          style="
            padding: 0px 0px 10px;
            font-size: 16px;
            color: rgba(1, 6, 33, 0.75);
          "
        >
          单位比率
        </div>

        <div>
          <el-form
            :model="form"
            :rules="rules"
            ref="ruleForm"
            label-width="55px"
            class="demo-ruleForm"
            label-position="left"
            size="mini"
          >
            <!-- :required="varietyData.nextUnitIsMust == 1 ? true : false" -->
            <el-form-item
              :label="varietyData.subUnit + ' ='"
              prop="subUnit2Weight"
              v-if="varietyData.childList.length > 0"
            >
              <el-input
                style="width: 150px"
                v-model="form.subUnit2Weight"
                placeholder="请输入"
                clearable
              ></el-input>

              <el-select
                style="width: 150px; margin-left: 8px"
                v-model="form.subUnit2List"
                @change="subUnit2Change"
                value-key="subUnit"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in varietyData.childList"
                  :key="item.subUnit"
                  :label="item.subUnit"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <!-- :required="varietyData2.nextUnitIsMust == 1 ? true : false" -->
            <el-form-item
              :label="varietyData2.subUnit + ' ='"
              prop="subUnit3Weight"
              v-if="varietyData2.childList.length > 0"
            >
              <el-input
                style="width: 150px"
                v-model="form.subUnit3Weight"
                placeholder="请输入"
                clearable
              ></el-input>

              <el-select
                style="width: 150px; margin-left: 8px"
                v-model="form.subUnit3"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in varietyData2.childList"
                  :key="item.subUnit"
                  :label="item.subUnit"
                  :value="item.subUnit"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>

        <div
          style="
            color: rgba(221, 76, 77, 1);
            font-size: 12px;
            padding: 10px 0px;
          "
          v-if="pingjie()"
        >
          计算单位样式：{{ pingjie() }}
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
import { subunitList } from "@/request/api/commodityManage/commodityList";

export default {
  name: "subunitDialog",
  data() {
    var subUnit2WeightCjeck = (rule, value, callback) => {
      if (
        !(this.form.subUnit2Weight && this.form.subUnit2) &&
        this.varietyData.nextUnitIsMust == 1
      ) {
        return callback(new Error("单位不能为空"));
      } else {
        callback();
      }
    };
    var subUnit3WeightCjeck = (rule, value, callback) => {
      if (
        !(this.form.subUnit3Weight && this.form.subUnit3) &&
        this.varietyData2.nextUnitIsMust == 1
      ) {
        return callback(new Error("单位不能为空"));
      } else {
        callback();
      }
    };
    return {
      loading: false,
      title: "",
      isVisiable: false,
      disableSubmit: false,
      model: {},
      form: {
        subunit: "",
        subUnit2Weight: "",
        subUnit2: "",
        subUnit2List: {},
        subUnit3Weight: "",
        subUnit3: "",
      },
      varietyCommon: {},
      varietyIndex: null,
      varietyData: { childList: [] },
      varietyData2: { childList: [] },

      rules: {
        subUnit2Weight: [
          {
            required: true,
            validator: subUnit2WeightCjeck,
            trigger: "change",
          },
        ],
        subUnit3Weight: [
          { required: true, validator: subUnit3WeightCjeck, trigger: "change" },
        ],
      },
    };
  },

  methods: {
    add() {},
    edit(record) {
      this.loading = true;
      this.model = Object.assign({}, this.model, record);
      this.getVarietyList();
    },
    // 获取数据
    getVarietyList() {
      subunitList({ categoryId: this.model.productid }).then((res) => {
        if (res.status == 200) {
          this.varietyCommon = res.data[0];
        }
      });
    },
    varietyChange(val, idnex) {
      this.varietyIndex = idnex;
      this.form.subunit = val.subUnit;
      this.form.subUnit2Weight = "";
      this.form.subUnit2 = "";
      this.form.subUnit2List = {};
      this.form.subUnit3 = "";
      this.form.subUnit3Weight = "";
      this.varietyData = val;
      this.varietyData2 = { childList: [] };

      setTimeout(() => {
        this.$refs.ruleForm.clearValidate();
      }, 5);
    },
    subUnit2Change(val) {
      this.varietyData2 = val;
      this.form.subUnit2 = val.subUnit;
      this.form.subUnit3 = "";
      this.form.subUnit3Weight = "";
    },
    handleAdd() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          this.$emit("subunitChange", this.form);
          this.close();
        }
      });
    },
    // 计算单位
    pingjie() {
      // 箱(20ml*20听/箱)

      let data = this.form.subunit;

      if (this.form.subUnit2) {
        data =
          this.form.subunit +
          "(" +
          this.form.subUnit2Weight +
          this.form.subUnit2 +
          "/" +
          this.form.subunit +
          ")";
      }

      if (this.form.subUnit3) {
        data =
          this.form.subunit +
          "(" +
          this.form.subUnit3Weight +
          this.form.subUnit3 +
          " *" +
          this.form.subUnit2Weight +
          this.form.subUnit2 +
          "/" +
          this.form.subunit +
          ")";
      }

      return data;
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
      this.form = {
        subunit: "",
        subUnit2Weight: 0,
        subUnit2: "",
        subUnit2List: {},
        subUnit3Weight: 0,
        subUnit3: "",
      };
      this.varietyCommon = {};
      this.varietyIndex = null;
      this.varietyData = { childList: [] };
      this.varietyData2 = { childList: [] };
      this.$refs.ruleForm.clearValidate();
    },
  },
};
</script>

<style scoped lang="scss">
.subunitDialogDialog {
  .marginform {
    padding-bottom: 13px;
    overflow: hidden;
    .varietyActive {
      background: rgba(11, 161, 152, 1) !important;
      color: #fff !important;
    }
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
.subunitDialogDialog {
  .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>