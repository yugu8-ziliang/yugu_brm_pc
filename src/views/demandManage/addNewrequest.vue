<template>
  <PageNoScroll class="addNewrequestModel">
    <div>
      <div
        style="color: rgba(1, 6, 33, 0.9); font-size: 16px; font-weight: 700"
      >
        客户信息
      </div>
      <div style="padding: 10px 0px 0px 0px">
        <el-form
          :model="form"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          label-position="top"
          size="small"
        >
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="客户姓名：" prop="factoryName">
                <el-select
                  ref="factorySelect"
                  style="width: 100%"
                  v-model="form.factoryName"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="(item, index) in factoryOptions"
                    :key="index"
                    :label="item.personName"
                    :value="item.personName"
                    class="clickOptionChange"
                  >
                    <div
                      style="padding: 0px 20px"
                      @click="clickChange(item, index)"
                    >
                      <span>{{ item.personName }} </span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系电话：" prop="factoryPhone">
                <el-select
                  ref="factorySelect"
                  style="width: 100%"
                  v-model="form.factoryPhone"
                  placeholder="请输入或选择"
                >
                  <el-option
                    v-for="(item, index) in factoryOptions"
                    :key="index"
                    :label="item.phoneNumber"
                    :value="item.phoneNumber"
                    class="clickOptionChange"
                  >
                    <div
                      style="padding: 0px 20px"
                      @click="clickChange(item, index)"
                    >
                      <span>{{ item.phoneNumber }} </span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <div class="lineW"></div>

    <div style="padding: 10px 5px 10px 5px">
      <div
        style="
          color: rgba(1, 6, 33, 0.9);
          font-size: 16px;
          font-weight: 700;
          padding-right: 15px;
        "
      >
        商品信息
      </div>
      <div style="padding: 10px 0px 0px 0px">
        <el-button
          size="mini"
          :disabled="
            form.factoryName ? (tableData.length == 20 ? true : false) : true
          "
          @click="handleJumpDetail('viewDrafts', { form, tableData })"
          >查看草稿箱</el-button
        >
        <el-button
          size="mini"
          :disabled="
            form.factoryName ? (tableData.length == 20 ? true : false) : true
          "
          @click="handleJumpDetail('historicalSending', { form, tableData })"
          >历史发送需求</el-button
        >
        <el-button
          size="mini"
          icon="el-icon-plus"
          :disabled="
            form.factoryName ? (tableData.length == 20 ? true : false) : true
          "
          @click="handleJumpDetail('addCommodity', tableData)"
          >选择商品</el-button
        >
        <el-button
          type="primary"
          size="mini"
          @click="handleJumpDetail('summaryReceived', { form, tableData })"
          >收到的需求汇总</el-button
        >
      </div>
    </div>
    <el-scrollbar
      ref="scrollDiv"
      :style="{
        height: parseInt($store.getters.screenHeight - 440) + 'px',
      }"
    >
      <u-table
        ref="plTable"
        class="utable"
        :border="false"
        :height="$store.getters.screenHeight - 600 + 'px'"
        :header-row-style="{ height: '46px' }"
        :header-cell-style="{
          padding: '0px 0px',
          'font-size': '14px',
          color: 'rgba(1, 6, 33, 0.65)',
        }"
        :row-style="{ height: '46px' }"
        :cell-style="{
          padding: '0px 0px',
          'font-size': '14px',
          color: 'rgba(1, 6, 33, 0.7)',
          height: '46px',
        }"
        use-virtual
        :row-height="46"
        showBodyOverflow="tooltip"
        showHeaderOverflow="title"
        :data="tableData"
      >
        <template slot="empty">没有查询到符合条件的记录</template>
        <u-table-column
          v-for="(item, index) in columns"
          :key="index"
          :resizable="item.resizable"
          :show-overflow-tooltip="true"
          :prop="item.prop"
          :label="item.label"
          :fixed="item.fixed"
          align="left"
          header-align="left"
        >
          <template slot-scope="scope">
            <span v-if="item.prop == 'productName'" style="color: #1a7fd9">
              {{
                scope.row.productName == "其他"
                  ? scope.row.other
                  : scope.row.productName + "|" + scope.row.variety
              }}
            </span>
            <span v-else-if="item.prop == 'subUnit'">
              {{ scope.row.subUnit }}{{ scope.row.subUnit2 != "" ? "(" : ""
              }}{{
                scope.row.subUnit3Weight == 0
                  ? ""
                  : scope.row.subUnit3Weight + scope.row.subUnit3
              }}{{ scope.row.subUnit3 != "" ? "*" : ""
              }}{{
                scope.row.subUnit2Weight == 0
                  ? ""
                  : scope.row.subUnit2Weight + scope.row.subUnit2
              }}{{ scope.row.subUnit2 != "" ? "/" + scope.row.subUnit : ""
              }}{{ scope.row.subUnit2 != "" ? ")" : "" }}
            </span>
            <span v-else-if="item.prop == 'batchCount'">
              <span
                v-html="
                  getStock(
                    scope.row.subUnit,
                    scope.row.subUnit2,
                    scope.row.subUnit3,
                    scope.row.pieceUnit,
                    scope.row.subUnit2Weight,
                    scope.row.subUnit3Weight,
                    scope.row.batchCount,
                    scope.row.basketCount,
                    scope.row.pieceCount
                  )
                "
              ></span>
            </span>

            <span v-else-if="item.prop == 'demandCount'">
              <span v-if="scope.row.demandCount">
                {{ scope.row.demandCount }}
                {{ scope.row.subUnit }}{{ scope.row.subUnit2 != "" ? "(" : ""
                }}{{
                  scope.row.subUnit3Weight == 0
                    ? ""
                    : scope.row.subUnit3Weight + scope.row.subUnit3
                }}{{ scope.row.subUnit3 != "" ? "*" : ""
                }}{{
                  scope.row.subUnit2Weight == 0
                    ? ""
                    : scope.row.subUnit2Weight + scope.row.subUnit2
                }}{{ scope.row.subUnit2 != "" ? "/" + scope.row.subUnit : ""
                }}{{ scope.row.subUnit2 != "" ? ")" : "" }}</span
              >
              <span v-else>--</span>
            </span>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </u-table-column>
        <u-table-column label="操作" :width="100" align="left">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="text"
              style="margin-right: 15px"
              @click="handleRemove(scope)"
            >
              移除</el-button
            >
            <el-button
              size="mini"
              type="text"
              @click="
                handleEditComm(
                  'editCommodity',
                  scope.row,
                  '编辑商品',
                  scope.$index
                )
              "
            >
              编辑</el-button
            >
          </template>
        </u-table-column>
      </u-table>

      <div class="lineW"></div>

      <div style="padding: 15px 0px">
        <div
          style="
            color: rgba(1, 6, 33, 0.9);
            font-size: 16px;
            font-weight: 700;
            padding-right: 15px;
          "
        >
          合计
        </div>

        <div style="padding: 5px 0px">
          <span
            style="
              color: rgba(1, 6, 33, 0.55);
              font-size: 14px;
              width: 250px;
              display: inline-block;
            "
            >商品种类：<span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
              >{{ tableData.length }}种</span
            ></span
          >
        </div>
      </div>

      <div style="padding: 0px 0px">
        <div
          style="
            color: rgba(1, 6, 33, 0.9);
            font-size: 16px;
            font-weight: 700;
            padding-right: 15px;
          "
        >
          备注
        </div>
        <div style="padding: 10px 0px">
          <el-input
            style="width: 450px"
            type="textarea"
            :rows="3"
            placeholder="请输入内容"
            v-model="form.remark"
          />
        </div>
      </div>
    </el-scrollbar>

    <div class="btnBottom">
      <div class="flex_row_reverse flex_item_mid">
        <div style="margin-right: 10px">
          <el-button type="primary" size="mini" @click="handleAdd"
            >确认发送</el-button
          >
        </div>
        <div style="margin-right: 10px">
          <el-button
            size="mini"
            :disabled="
              form.factoryName ? (tableData.length == 20 ? true : false) : true
            "
            @click="handleDraftadd"
            >保存至草稿箱({{ draftaddNum }}/20)
          </el-button>
        </div>
        <div style="margin-right: 10px">
          <span style="font-size: 16px; color: rgba(1, 6, 33, 0.9)"
            >已添加商品</span
          ><span style="font-size: 16px; color: rgba(1, 6, 33, 0.9)">
            ({{ tableData.length }}/20)
          </span>
        </div>
      </div>
    </div>
    <editCommodity
      ref="editCommodity"
      @editCommodityChange="editCommodityChange"
    ></editCommodity>
  </PageNoScroll>
</template>

<script>
import { Base64 } from "js-base64";

import { getUser } from "@/request/api/basketBuy/index";
import { demandadd, draftadd } from "@/request/api/demandManage/index";

export default {
  name: "addNewrequest",
  components: {
    editCommodity: () => import("./dialog/editCommodity.vue"), // 编辑商品
  },
  data() {
    return {
      columns: [
        {
          prop: "categoryName",
          label: "商品分类",
        },
        {
          prop: "productName",
          label: "品种/品牌",
        },
        {
          prop: "subUnit",
          label: "计算单位",
        },
        {
          prop: "regionName",
          label: "产地",
        },
        {
          prop: "spec",
          label: "级别/规格",
        },

        {
          prop: "batchCount",
          label: "当前库存",
        },
        {
          prop: "demandCount",
          label: "需求数量",
        },
      ],
      tableData: [],
      tableIndex: null,
      form: {
        touserId: "",
        factoryName: "",
        factoryPhone: "",
        remark: "",
      },

      rules: {
        factoryName: [
          {
            required: true,
            message: "请选择客户姓名",
            trigger: ["blur", "change"],
          },
        ],
        factoryPhone: [
          {
            required: true,
            message: "请选择联系电话",
            trigger: ["blur", "change"],
          },
        ],
      },
      factoryOptions: [],
      draftaddNum: 0,
    };
  },
  methods: {
    initData() {
      let { data: data } = this.$route.query;
      // 判断url是否为空

      // let param = JSON.parse(Base64.decode(data));
      let param = this.$store.getters.addNewrequestData;
      // console.log(param);
      if (param.isStatus == "add") {
        this.tableData = JSON.parse(JSON.stringify(param.tableDataList));
      }
      this.$store.dispatch("common/addNewrequestData", {});
    },
    getUser() {
      //获取客户
      let param1 = {
        search: "",
        modelType: 0,
      };
      getUser(param1).then((res) => {
        if (res.status == 200) {
          this.factoryOptions = res.data;
        }
      });
    },
    clickChange(item, index) {
      this.form.factoryName = item.personName;
      this.form.factoryPhone = item.phoneNumber;
      this.form.touserId = item.customerId;
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
        basket == 0
          ? ""
          : "|" + basket + '<font style="color:#DF971A;">筐</font>';
      let kuohao1 = subunit2 == "" ? "" : "(";
      let kuohao2 = subunit2 == "" ? "" : ")";
      return first + kuohao1 + next3 + next2 + kuohao2 + next4 + last;
    },
    editCommodityChange(val) {
      this.$set(
        this.tableData[this.tableIndex],
        "demandCount",
        val.demandCount
      );
      this.$set(this.tableData[this.tableIndex], "other", val.other);
      this.$set(this.tableData[this.tableIndex], "variety", val.variety);
      this.$set(
        this.tableData[this.tableIndex],
        "subunitFocus",
        val.subunitFocus
      );
      this.$set(this.tableData[this.tableIndex], "subUnit", val.subunit);
      this.$set(this.tableData[this.tableIndex], "subUnit2", val.subUnit2);
      this.$set(
        this.tableData[this.tableIndex],
        "subUnit2Weight",
        val.subUnit2Weight
      );
      this.$set(this.tableData[this.tableIndex], "subUnit3", val.subUnit3);
      this.$set(
        this.tableData[this.tableIndex],
        "subUnit3Weight",
        val.subUnit3Weight
      );
      this.$set(this.tableData[this.tableIndex], "regionId", val.regionid);
      this.$set(this.tableData[this.tableIndex], "regionName", val.regionname);
      this.$set(
        this.tableData[this.tableIndex],
        "pathRegionname",
        val.pathRegionname
      );
      this.$set(this.tableData[this.tableIndex], "spec", val.spec);
      this.$set(this.tableData[this.tableIndex], "pieceUnit", val.pieceunit);
      this.$set(
        this.tableData[this.tableIndex],
        "piecenumber",
        val.piecenumber
      );
    },
    // 添加
    handleAdd() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.tableData.length == 0) {
            return this.$warning("请先添加商品");
          }

          let param = {
            touserId: this.form.touserId, // 客户Id
            productKindNum: this.tableData.length, // 商品种类个数
            remark: this.form.remark, // 备注
            addInfo: [], //# 添加信息
          };

          for (let i = 0; i < this.tableData.length; i++) {
            const el = this.tableData[i];
            param.addInfo.push({
              categoryFirst: el.classifyId1, //商品一级分类Id
              categorySecond: el.classifyId2, //商品二级分类Id
              categorySecondName: el.classifyName2, // 商品二级分类名称
              productId: el.classifyId, // 三级分类Id
              productName: el.productName, // 商品名称
              other: el.other, // 其他分类
              variety: el.variety, // 品牌
              subUnit: el.subUnit, // 计算单位
              pieceUnit: el.pieceUnit, // 计件单位
              //"subWeight": 10, // 单位重量--弃用
              subUnit2: el.subUnit2, //二级计算单位  没有为 ""
              subUnit2Weight: el.subUnit2Weight, //二级单位重量 没有为 0
              subUnit3: el.subUnit3, //三级计算单位  没有为 ""
              subUnit3Weight: el.subUnit3Weight, //三级单位重量 没有为 0
              regionId: el.regionId, // 产地Id
              regionName: el.regionName, // 产地名称
              spec: el.spec, // 规格
              demandCount: el.demandCount, // 需求数量
              demandpieceCount: el.piecenumber, // 添加件数
              currentCount: el.batchCount, // 当前库存
              currentpieceCount: el.pieceCount, // 当前库存(计件)
            });
          }

          this.$confirm("确认发送?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              demandadd(param).then((res) => {
                if (res.status == 200) {
                  this.$success("添加成功");
                  this.$closePage("issuedReceived", {});
                }
              });
            })
            .catch(() => {});
        }
      });
    },
    // 添加草稿箱
    handleDraftadd() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          if (this.tableData.length == 0) {
            return this.$warning("请先添加商品");
          }

          let param = {
            touserId: this.form.touserId, // 客户Id
            productKindNum: this.tableData.length, // 商品种类个数
            remark: this.form.remark, // 备注
            orderdraftId: "", // 订单Id
            addInfo: [], //# 添加信息
          };

          for (let i = 0; i < this.tableData.length; i++) {
            const el = this.tableData[i];
            param.addInfo.push({
              categoryFirst: el.classifyId1, //商品一级分类Id
              categorySecond: el.classifyId2, //商品二级分类Id
              categorySecondName: el.classifyName2, // 商品二级分类名称
              productId: el.classifyId, // 三级分类Id
              productName: el.productName, // 商品名称
              other: el.other, // 其他分类
              variety: el.variety, // 品牌
              subUnit: el.subUnit, // 计算单位
              pieceUnit: el.pieceUnit, // 计件单位
              //"subWeight": 10, // 单位重量--弃用
              subUnit2: el.subUnit2, //二级计算单位  没有为 ""
              subUnit2Weight: el.subUnit2Weight, //二级单位重量 没有为 0
              subUnit3: el.subUnit3, //三级计算单位  没有为 ""
              subUnit3Weight: el.subUnit3Weight, //三级单位重量 没有为 0
              regionId: el.regionId, // 产地Id
              regionName: el.regionName, // 产地名称
              spec: el.spec, // 规格
              demandCount: el.demandCount, // 需求数量
              demandpieceCount: el.piecenumber, // 添加件数
              currentCount: el.batchCount, // 当前库存
              currentpieceCount: el.pieceCount, // 当前库存(计件)
            });
          }

          this.$confirm("确认保存吗?", "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              draftadd(param).then((res) => {
                if (res.status == 200) {
                  this.$success("保存成功");

                  let num = this.tableData.length - this.draftaddNum;
                  this.draftaddNum += num;
                }
              });
            })
            .catch(() => {});
        }
      });
    },
    // 移除
    handleRemove(row) {
      this.$confirm("确认删除此商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tableData.splice(row.$index, 1);
        })
        .catch(() => {});
    },
    handleEditComm(form, record, title, index) {
      this.tableIndex = index;
      this.$refs[form].edit(record);
      this.$refs[form].title = title;
      this.$refs[form].disableSubmit = false;
      this.$refs[form].isVisiable = true;
    },
    // 跳转页面
    handleJumpDetail: function (form, record) {
      this.$router.push({
        path: form,
        query: {
          data: Base64.encode(JSON.stringify(record)),
        }, //加密
      });
      // Base64.decode(this.pwd);//解密
    },
  },
  //进入页面触发
  beforeRouteEnter(to, form, next) {
    next((vm) => {
      vm.initData();
      vm.getUser();
    });
  },
};
</script>

<style lang="scss" scoped>
.addNewrequestModel {
  .lineW {
    width: 100%;
    height: 1px;
    background: rgba(233, 233, 233, 1);
  }

  .btnBottom {
    border-top: 1px solid rgba(233, 233, 233, 1);
    padding-top: 10px;
    width: 100%;
    position: absolute;
    bottom: 10px;
    left: 0px;
    right: 10px;
  }
}
</style>

<style lang="scss">
.addNewrequestModel {
  .el-scrollbar {
    .el-scrollbar__wrap {
      margin-bottom: 0px !important;
      overflow-x: hidden;

      .el-scrollbar__view {
        // height: var(--screenHeight) !important;
        position: relative;
        padding: 0px !important;
      }
    }
  }
}
</style>