<template>
  <div class="editCommodityDialog">
    <el-dialog :title="title" :visible.sync="isVisiable" :close-on-click-modal="false" :before-close="close" top="100px"
      width="600px">
      <div class="marginform">
        <div>
          <span style="
              color: rgba(1, 6, 33, 0.9);
              font-size: 14px;
              font-weight: 700;
              padding-right: 50px;
            ">
            {{ model.categoryName }}-
            <el-input v-if="model.productName == '其他'" v-model="form.other" :placeholder="model.productName" size="mini"
              style="width: 80px"></el-input>
            <span v-else>{{ model.productName }}</span>
          </span>

          <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px" v-if="model.batchCount != 0">当前库存：<span v-html="
                getStock(
                  model.subUnit,
                  model.subUnit2,
                  model.subUnit3,
                  model.pieceUnit,
                  model.subUnit2Weight,
                  model.subUnit3Weight,
                  model.batchCount,
                  model.basketCount,
                  model.pieceCount
                )
              "></span></span>
          <span v-else style="color: rgba(1, 6, 33, 0.55); font-size: 14px">暂无库存</span>
        </div>

        <el-form style="margin-top: 15px" :model="form" :rules="rules" ref="ruleForm" label-width="100px"
          class="demo-ruleForm" label-position="top" size="small">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="品种/品牌：" prop="variety">
                <el-input v-model="form.variety" placeholder="请选择品种" @focus="varietyFocus" readonly></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="计算单位：" prop="subunit">
                <el-input v-model="form.subunitFocus" @focus="subunitFocus" readonly placeholder="请输入">
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="产地：" prop="regionid">
                <el-cascader ref="myCascader1" placeholder="请选择种类" style="width: 100%" v-model="form.regionid"
                  :options="regList" @focus="regionFocus" @change="regionChange" :props="{
                    value: 'rid',
                    label: 'name',
                    children: 'childList',
                    emitPath: false,
                  }"></el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="级别/规格：" prop="spec">
                <el-select v-model="form.spec" filterable placeholder="请选择或输入" style="width: 100%" remote
                  :remote-method="specRemoteMethod">
                  <el-option v-for="item in specOptions" :key="item.specname" :label="item.specname"
                    :value="item.specname">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20" style="padding: 10px 0px; border-top: 1px solid #e9e9e9">
            <el-col :span="12">
              <el-form-item label="需求数量" prop="demandCount">
                <el-input-number style="width: 100%" v-model="form.demandCount" controls-position="right" :min="1"
                  :precision="2">
                </el-input-number>

                <span style="
                    position: absolute;
                    right: 10px;
                    font-size: 14px;
                    color: rgba(1, 6, 33, 0.75);
                  ">{{ purSubunit() }}</span>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="选择计件单位：" prop="pieceunit">
                <el-select v-model="form.pieceunit" placeholder="请选择" style="width: 100%">
                  <el-option v-for="item in pieceOptions" :key="item" :label="item" :value="item">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-if="form.pieceunit != '无' && form.pieceunit != ''">
              <el-form-item label="添加件数：" prop="piecenumber">
                <div class="flex_dom flex_item_mid">
                  <el-input-number style="width: 100%" v-model="form.piecenumber" controls-position="right" :min="1"
                    :precision="0"></el-input-number>
                  <span style="
                      position: absolute;
                      right: 10px;
                      font-size: 14px;
                      color: rgba(1, 6, 33, 0.75);
                    " v-html="pieceunitHt()"></span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>

        <div class="creditLineBottom">
          <el-button size="mini" style="margin-right: 10px" @click="close">取消</el-button>
          <el-button size="mini" type="primary" style="margin-right: 10px" @click="handleAdd">确 定</el-button>
        </div>
      </div>
      <varietyDialog ref="varietyDialog" @varietyChange="varietyChange"></varietyDialog>
      <subunitDialog ref="subunitDialog" @subunitChange="subunitChange"></subunitDialog>
    </el-dialog>
  </div>
</template>

<script>
  import {
    productCate,
    varietyList,
    getRegion,
    specList,
  } from "@/request/api/commodityManage/commodityList";
  export default {
    name: "editCommodity",
    components: {
      varietyDialog: () =>
        import(
          "@/views/commodityManage/addCommodity/dialogmod/varietyDialog.vue"
        ), // 品种/品牌
      subunitDialog: () =>
        import(
          "@/views/commodityManage/addCommodity/dialogmod/subunitDialog.vue"
        ), // 计算单位
    },
    data() {
      return {
        loading: false,
        title: "批量过磅",
        isVisiable: false,
        disableSubmit: false,
        model: {},
        form: {
          other: "", // 其他分类名称
          variety: "", // 品牌
          subunitFocus: "", //计算单位拼接
          subunit: "", // 计算单位
          subUnit2: "", // 二级计算单位，2021-11-15需求优化新增
          subUnit2Weight: 0, // 二级计算单位重量，2021-11-15需求优化新增
          subUnit3: "", // 三级计算单位，2021-11-15需求优化新增
          subUnit3Weight: 0, // 三级计算单位，2021-11-15需求优化新增

          regionid: "", //产地id
          regionname: "", //产地
          pathRegionname: "", // 产地全部名称
          spec: "", // 规格

          demandCount: undefined, //需求数量
          pieceunit: "", // 计件单位
          piecenumber: undefined, // 添加件数
        },
        rules: {
          variety: [{
            required: true,
            message: "请选择品种/品牌",
            trigger: ["blur", "change"],
          }, ],
          subunit: [{
            required: true,
            message: "请选择计算单位",
            trigger: ["blur", "change"],
          }, ],
          demandCount: [{
            required: true,
            message: "请输入需求数量",
            trigger: "blur",
          }, ],
        },

        regList: [],
        specOptions: [],
        pieceOptions: ["无", "箱", "袋", "盒", "件", "筐(一次性)", "筐(周转筐)"],
      };
    },
    methods: {
      add() {},
      edit(record) {
        this.loading = true;
        this.model = Object.assign({}, this.model, record);

        this.form.other = this.model.other; // 其他分类名称
        this.form.variety = this.model.variety; // 品牌

        this.form.subunit = this.model.subUnit; // 计算单位
        this.form.subUnit2 = this.model.subUnit2; // 二级计算单位，2021-11-15需求优化新增
        this.form.subUnit2Weight = this.model.subUnit2Weight; // 二级计算单位重量，2021-11-15需求优化新增
        this.form.subUnit3 = this.model.subUnit3; // 三级计算单位，2021-11-15需求优化新增
        this.form.subUnit3Weight = this.model.subUnit3Weight; // 三级计算单位，2021-11-15需求优化新增
        this.form.regionid = parseFloat(this.model.regionId); //产地id
        this.form.regionname = this.model.regionName; //产地
        this.form.pathRegionname = this.model.pathRegionname; // 产地全部名称
        this.form.spec = this.model.spec; // 规格
        this.form.demandCount = this.model.demandCount==0 ? undefined : this.model.demandCount; //需求数量
        this.form.pieceunit = this.model.pieceUnit; // 计件单位
        this.form.piecenumber = this.model.piecenumber == 0 ? undefined : this.model.piecenumber; // 添加件数

        let paramS = this.form.subunit;
        paramS += this.form.subUnit2 != "" ? "(" : "";
        paramS +=
          this.form.subUnit3Weight == 0 ?
          "" :
          this.form.subUnit3Weight + this.form.subUnit3;
        paramS += this.form.subUnit3 != "" ? "*" : "";
        paramS +=
          this.form.subUnit2Weight == 0 ?
          "" :
          this.form.subUnit2Weight + this.form.subUnit2;
        paramS += this.form.subUnit2 != "" ? "/" + this.form.subunit : "";
        paramS += this.form.subUnit2 != "" ? ")" : "";
        this.form.subunitFocus = paramS; //计算单位拼接

        this.getRegionList();
        this.getSpecList();

        // console.log(this.model);
        // console.log(this.form);
      },
      getStock(
        subunit,
        subunit2,
        subunit3,
        pieceunit,
        subunit2weight,
        subunit3weight,
        stock,
        basket,
        piececount
      ) {
        let first = stock + subunit;
        let next2 =
          subunit2 == "" ? "" : subunit2weight + subunit2 + "/" + subunit;
        let next3 = subunit3 == "" ? "" : subunit3weight + subunit3 + "*";
        let next4 = pieceunit == "" ? "" : "(" + piececount + pieceunit + ")";
        let last =
          basket == 0 ?
          "" :
          "|" + basket + '<font style="color:#DF971A;">筐</font>';
        let kuohao1 = subunit2 == "" ? "" : "(";
        let kuohao2 = subunit2 == "" ? "" : ")";
        return first + kuohao1 + next3 + next2 + kuohao2 + next4 + last;
      },
      //品牌
      varietyFocus() {
        this.handleEdit("varietyDialog", "品种/品牌", {
          pathProductName: this.model.categoryName + "-" + this.model.productName,
          productid: this.model.classifyId,
          ...this.model,
        });
      },
      // 计算单位
      subunitFocus() {
        this.handleEdit("subunitDialog", "计算单位", {
          productid: this.model.classifyId,
          ...this.model,
        });
      },
      varietyChange(val) {
        this.form.variety = val.variety;
        this.form.regionid = ""; //产地id
        this.form.regionname = ""; //产地
        this.form.pathRegionname = ""; // 产地全部名称
        this.getRegionList();
      },
      subunitChange(val) {
        this.form.subunit = val.subunit; // 计算单位
        this.form.subUnit2 = val.subUnit2; // 二级计算单位，2021-11-15需求优化新增
        this.form.subUnit2Weight = val.subUnit2Weight || 0; // 二级计算单位重量，2021-11-15需求优化新增
        this.form.subUnit3 = val.subUnit3; // 三级计算单位，2021-11-15需求优化新增
        this.form.subUnit3Weight = val.subUnit3Weight || 0; // 三级计算单位，2021-11-15需求优化新增

        let paramS = this.form.subunit;
        paramS += this.form.subUnit2 != "" ? "(" : "";
        paramS +=
          this.form.subUnit3Weight == 0 ?
          "" :
          this.form.subUnit3Weight + this.form.subUnit3;
        paramS += this.form.subUnit3 != "" ? "*" : "";
        paramS +=
          this.form.subUnit2Weight == 0 ?
          "" :
          this.form.subUnit2Weight + this.form.subUnit2;
        paramS += this.form.subUnit2 != "" ? "/" + this.form.subunit : "";
        paramS += this.form.subUnit2 != "" ? ")" : "";
        this.form.subunitFocus = paramS;
      },
      // 产地
      getRegionList() {
        getRegion({
          classifyId: this.model.classifyId,
          variety: this.form.variety,
        }).then((res) => {
          if (res.status == 200) {
            let resData = res.data[0];
            // 常用产地 actlRegion
            // 国内 regions
            // 国外 foreignRegions
            let redData = [];
            if (resData.actlRegion.length > 0) {
              redData.push({
                rid: 1,
                name: "常用产地",
                childList: resData.actlRegion,
              });
            }
            if (resData.regions.length > 0) {
              redData.push({
                rid: 2,
                name: "国内",
                childList: resData.regions,
              });
            }
            if (resData.foreignRegions.length > 0) {
              redData.push({
                rid: 3,
                name: "国外",
                childList: resData.foreignRegions,
              });
            }
            this.regList = redData;
            setTimeout(() => {
              this.regionChange();
            }, 100);
          }
        });
      },
      // 产地
      regionFocus() {
        if (!this.model.classifyId) {
          this.$warning("请先选择种类");
          return;
        }
        if (!this.form.variety) {
          this.$warning("请先选择品牌");
          return;
        }
      },
      regionChange() {
        this.form.regionname = this.$refs.myCascader1.getCheckedNodes()[0].label;
        this.form.regionname = this.setpathRegionname(
          this.$refs.myCascader1.getCheckedNodes()[0].pathLabels
        );
        this.form.pathRegionname = this.$refs.myCascader1
          .getCheckedNodes()[0]
          .pathLabels.join("-"); // 产地全部名称

        // console.log(123123);
        // console.log(this.form);
      },
      setpathRegionname(val) {
        if (val[0] == "国内") {
          return val[2] + "-" + val[3];
        } else {
          return val[1];
        }
      },
      // 级别/规格
      getSpecList() {
        specList({
          categoryId: this.model.classifyId,
        }).then((res) => {
          if (res.status == 200) {
            this.specOptions = res.data;
          }
        });
      },
      specRemoteMethod(query) {
        if (query !== "") {
          setTimeout(() => {
            this.specOptions = this.specOptions.filter((item) => {
              return item.specname.indexOf(query) > -1;
            });
            if (this.specOptions.length == 0) {
              this.getSpecList();
            }
          }, 200);
        } else {
          this.getSpecList();
        }
        this.$set(this.form, "spec", query);
      },
      // 数量单位
      purSubunit() {
        if (!this.form.subunit) {
          return "";
        } else {
          return this.form.subunit;
        }
      },
      pieceunitHt() {
        if (this.form.pieceunit == "筐(一次性)") {
          return "筐";
        } else if (this.form.pieceunit == "筐(周转筐)") {
          return "<span style='color:#DF971A'>筐</span>";
        } else {
          return this.form.pieceunit;
        }
      },
      // 触发子组件编辑按钮
      handleEdit(form, title, record) {
        this.$refs[form].edit(record);
        this.$refs[form].title = title;
        this.$refs[form].disableSubmit = false;
        this.$refs[form].isVisiable = true;
      },
      handleAdd() {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.$emit("editCommodityChange", this.form);
            this.close();
          }
        });
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
          other: "", // 其他分类名称
          variety: "", // 品牌
          subunitFocus: "", //计算单位拼接
          subunit: "", // 计算单位
          subUnit2: "", // 二级计算单位，2021-11-15需求优化新增
          subUnit2Weight: 0, // 二级计算单位重量，2021-11-15需求优化新增
          subUnit3: "", // 三级计算单位，2021-11-15需求优化新增
          subUnit3Weight: 0, // 三级计算单位，2021-11-15需求优化新增

          regionid: "", //产地id
          regionname: "", //产地
          pathRegionname: "", // 产地全部名称
          spec: "", // 规格

          demandCount: undefined, //需求数量
          pieceunit: "", // 计件单位
          piecenumber: undefined, // 添加件数
        };
        setTimeout(() => {
          this.regList = [];
          this.specOptions = [];
        }, 200);

        this.$refs.ruleForm.resetFields();
      },
    },
  };
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
  .editCommodityDialog {
    .creditLineBottom {
      display: flex;
      justify-content: flex-end;
      border-top: 1px solid rgba(1, 6, 33, 0.06);
      padding: 5px;
    }

    .lineW {
      width: 100%;
      height: 1px;
      background: rgba(233, 233, 233, 1);
    }

    .el-input-number__decrease {
      display: none !important;
    }

    .el-input-number__increase {
      display: none !important;
    }

    .el-input-number.is-controls-right .el-input__inner {
      padding-right: 15px !important;
      text-align: left !important;
    }

    .demo-ruleForm {
      .el-form-item__label {
        line-height: 0px !important;
      }
    }

    .el-dialog__body {
      padding: 10px 20px;
    }
  }
</style>