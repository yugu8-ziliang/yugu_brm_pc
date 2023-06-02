<template>
  <!-- 选择商品 -->
  <PageNoScroll @hanleRefresh="hanleRefresh">
    <div class="addCommoditymodel">
      <el-scrollbar
        ref="scrollDiv"
        :style="{
          height: $store.getters.screenHeight - 160 + 'px',
        }"
      >
        <div
          style="
            padding: 5px 0px;
            color: rgba(1, 6, 33, 0.9);
            font-size: 16px;
            font-weight: 700;
          "
        >
          已添加商品{{ tableDataNum.length }}个，可选商品剩余{{
            20 - tableDataNum.length
          }}个
        </div>
        <div
          style="
            padding: 10px 10px;
            margin: 10px 0px;
            background: rgba(245, 245, 247, 1);
          "
        >
          <div class="flex_dom flex_item_mid">
            <div
              style="color: rgba(1, 6, 33, 0.55); font-size: 15px; width: 70px"
            >
              {{ ficationData[0] == undefined ? "分类" : "全部结果" }}
            </div>
            <div
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 14px;
                width: calc(100% - 70px);
              "
            >
              <span v-if="ficationData[0] == undefined">
                <el-tag
                  type="info"
                  class="fication1"
                  v-for="(item, index) in classificationOptions"
                  :key="index"
                  @click="handleFication(item, index, 0)"
                  style="border: none; cursor: pointer; font-size: 14px"
                >
                  {{ item.name }}
                </el-tag>
              </span>

              <el-tag
                type="info"
                v-if="ficationData[0] != undefined"
                closable
                style="border: none; cursor: pointer; font-size: 14px"
                @close="handleFicationClose(0)"
              >
                {{ ficationData[0].name }}
              </el-tag>

              <el-tag
                type="info"
                v-if="ficationData[1] != undefined"
                closable
                style="border: none; cursor: pointer; font-size: 14px"
                @close="handleFicationClose(1)"
              >
                {{ ficationData[1].name }}
              </el-tag>

              <el-tag
                type="info"
                v-if="ficationData[2] != undefined"
                closable
                style="border: none; cursor: pointer; font-size: 14px"
                @close="handleFicationClose(2)"
              >
                {{ ficationData[2].name }}
              </el-tag>
            </div>
          </div>

          <div
            class="flex_dom flex_item_mid"
            style="margin-top: 8px"
            v-if="
              (ficationData[0] != undefined ? true : false) &&
              (ficationData[2] != undefined ? false : true)
            "
          >
            <div
              style="color: rgba(1, 6, 33, 0.55); font-size: 15px; width: 70px"
            >
              分类
            </div>
            <div
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 14px;
                width: calc(100% - 70px);
              "
            >
              <span v-if="ficationData[1] != undefined ? false : true">
                <el-tag
                  type="info"
                  class="fication1"
                  v-for="(item, index) in ficationData[0].childList"
                  :key="index"
                  @click="handleFication(item, index, 1)"
                  style="border: none; cursor: pointer; font-size: 14px"
                >
                  {{ item.name }}
                </el-tag>
              </span>

              <span v-if="ficationData[1] != undefined ? true : false">
                <el-tag
                  type="info"
                  class="fication1"
                  v-for="(item1, index1) in ficationData[1].childList"
                  :key="index1"
                  @click="handleFication(item1, index1, 2)"
                  style="border: none; cursor: pointer; font-size: 14px"
                >
                  {{ item1.name }}
                </el-tag>
              </span>
            </div>
          </div>
        </div>

        <div class="addCommoditytable">
          <u-table
            ref="plTable"
            class="utable"
            :border="false"
            :height="$store.getters.screenHeight - 415 + 'px'"
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
            :data="
              tableData.slice(
                (pagination.page - 1) * pagination.limit,
                pagination.page * pagination.limit
              )
            "
            @selection-change="handleSelectionChange"
            :row-key="getRowKey"
          >
            <template slot="empty">没有查询到符合条件的记录</template>
            <u-table-column
              type="selection"
              width="55"
              align="center"
              name="选择"
              :reserve-selection="true"
              :selectable="selectable"
            >
            </u-table-column>

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
                  {{ scope.row.productName + "|" + scope.row.variety }}
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
                        scope.row.subunit,
                        scope.row.subUnit2,
                        scope.row.subUnit3,
                        scope.row.pieceunit,
                        scope.row.subUnit2Weight,
                        scope.row.subUnit3Weight,
                        scope.row.batchcount,
                        scope.row.basketcount,
                        scope.row.piececount
                      )
                    "
                  ></span>
                </span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
            </u-table-column>
          </u-table>
          <div class="paging">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[10, 20, 50, 100]"
              :total="tableData.length"
              :page-size="pagination.limit"
              :current-page.sync="pagination.page"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            ></el-pagination>
          </div>
        </div>
      </el-scrollbar>

      <div class="btnBottom">
        <div class="flex_row_reverse flex_item_mid">
          <div style="margin-right: 10px">
            <el-button
              :disabled="
                multipleSelectionList.length > 20 - tableDataNum.length
                  ? true
                  : false
              "
              type="primary"
              size="mini"
              @click="handleJumpDetail('addSalesTicket', '')"
              >确认选择
            </el-button>
          </div>
          <div style="margin-right: 10px">
            <span
              style="font-size: 16px; color: #0ba198; cursor: pointer"
              @click="
                handleEditComm(
                  'selectedCommodity',
                  { multipleSelectionList, tableDataNum },
                  '查看已选'
                )
              "
              >查看已选(<span
                :style="{
                  color:
                    multipleSelectionList.length + tableDataNum.length > 20
                      ? '#DD4C4D'
                      : '#0BA198',
                }"
                >{{ multipleSelectionList.length + tableDataNum.length }}/{{
                  20
                }}</span
              >
              )</span
            >
          </div>
        </div>
      </div>
    </div>
    <selectedCommodity
      ref="selectedCommodity"
      @selectedCommodityChange="selectedCommodityChange"
    >
    </selectedCommodity>
  </PageNoScroll>
</template>

<script>
import { Base64 } from "js-base64";

import { productchecklist, reminAddScope } from "@/request/api/commodity/index";

import { getBussinessScope } from "@/request/api/customerManage/customer.js";
import jsCookie from "js-cookie";

export default {
  name: "addCommodity",
  components: {
    selectedCommodity: () => import("./dialog/selectedCommodity.vue"), // 编辑商品
  },
  data() {
    return {
      columns: [
        {
          prop: "categoryName",
          label: "商品分类",
        },
        {
          prop: "variety",
          label: "品种/品牌",
        },

        {
          prop: "regionname",
          label: "产地",
        },
        {
          prop: "spec",
          label: "级别/规格",
        },
        // {
        //     prop: "subUnit",
        //     label: "计算单位",
        // },
        {
          prop: "batchCount",
          label: "当前库存",
        },
      ],
      queryData: {
        isStock: "0", // 0: 全部,1:有库存,2:无库存,默认传0
        regionId: "", // 产地id, 第三级产地id,默认 ""
        classifyId: "", //三级分类id,默认 ""
        calssifyVariety: "", //三级分类下品牌,默认 ""
        variety: "", // 品牌,默认 ""
        spec: "", //规格,默认 ""
        classificationList: [],
        addressList: [],
      },
      pagination: {
        page: 1, // 页码
        limit: 10, // 分页大小
        total: 0,
      },
      tableData: [],
      tableDataNum: [],
      tableDataLink: {},
      classificationOptions: [],
      ficationData: [],
      ficationIndex: [],
      multipleSelectionList: [],
      tableDataEdit: { tableDataLink: {} },
    };
  },
  methods: {
    selectable(row, index) {
      let Sta = true;
      for (let i = 0; i < this.tableDataNum.length; i++) {
        const el = this.tableDataNum[i];
        if (el.productid == row.productid) {
          Sta = false;
        }
      }
      return Sta;
    },
    initData() {
      let { data: data } = this.$route.query;
      // 判断url是否为空
      if (data) {
        let param = JSON.parse(data);
        if (param.isStatus == "add") {
          this.tableDataLink = JSON.parse(data);
          this.tableDataNum = JSON.parse(
            JSON.stringify(this.tableDataLink.commodityData)
          );
          this.getBussiness();
        } else {
          this.tableDataEdit = param;
          // console.log(this.tableDataEdit);
          this.getBussiness();
        }
      }
    },
    handleRouter() {
      let path = this.tableDataLink.fullPath || "/commodityManage/addCommodity";
      this.$closePage(path);
    },
    getRowKey(row) {
      return row.productid;
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
    getBussiness() {
      let param = {
        userId: this.tableDataLink.customerId,
      };
      getBussinessScope(param).then((res) => {
        this.bussinessList = res.data;
        this.productCate();
        this.tableDataNum.forEach((element) => {
          this.$refs.plTable.toggleRowSelection([
            {
              row: element,
              selected: true,
            },
          ]);
        });
      });
    },
    productCate() {
      let param = {
        ifStock: 0, // 是否包含库外，0：否，1：是
        modelType: 1, // 调用模块，0：盘点，1：销售单--新增字段
        type: 0, // 0：全部，1：有库存，2：无库存
        productInfo: {
          // 商品信息，需求单添加至销售单/历史销售单添加至销售单选择商品时需传
          variety: this.tableDataEdit
            ? this.tableDataEdit.tableDataLink.variety
            : "", // 商品品牌，可传空
          spec: "", // 商品规格，可传空
          subUnit: "", // 计算单位
          subUnit2: "", // 商品二级计算单位，可传空
          subUnit2Weight: 0, // 商品二级计算单位重量，没有传0
          subUnit3: "", // 商品三级计算单位，可传空
          subUnit3Weight: 0, //  商品三级计算单位重量，没有传0
          pieceUnit: "", // 计件单位，可传空
          regionId: this.tableDataEdit
            ? this.tableDataEdit.tableDataLink.regionid
            : "", // 产地id
          thirdCategory: this.tableDataEdit
            ? this.tableDataEdit.tableDataLink.classifyid
            : "", // 商品三级分类
        },
      };

      productchecklist(param).then((res) => {
        this.classificationOptions = res.data[0].modelList;

        for (let i = 0; i < this.classificationOptions.length; i++) {
          const el = this.classificationOptions[i];
          for (let j = 0; j < this.bussinessList.length; j++) {
            const el1 = this.bussinessList[j];
            if (el.categoryid == el1.categoryId) {
              this.classificationOptions[i].isNo = true;
            }
          }
          if (this.classificationOptions[i].isNo != true) {
            this.classificationOptions[i].isNo = false;
          }
        }

        this.tableData = [];
        for (let i = 0; i < this.classificationOptions.length; i++) {
          const el = this.classificationOptions[i];
          for (let j = 0; j < el.childList.length; j++) {
            const el1 = el.childList[j];
            for (let k = 0; k < el1.childList.length; k++) {
              const el2 = el1.childList[k];
              for (let l = 0; l < el2.childList.length; l++) {
                const el3 = el2.childList[l];
                this.tableData.push({
                  ...el3,
                  categoryName: el.name + "-" + el1.name + "-" + el2.name,
                });
              }
            }
          }
        }
      });
    },

    // 跳转页面
    handleJumpDetail: function (form, record) {
      let tableDataList = [];
      for (let i = 0; i < this.multipleSelectionList.length; i++) {
        const el = this.multipleSelectionList[i];
        tableDataList.push(el);
      }

      for (let i = 0; i < this.tableDataNum.length; i++) {
        const el = this.tableDataNum[i];
        tableDataList.push(el);
      }

      if (tableDataList.length == 0) {
        return this.$warning("请先选择数据");
      }
      let path = form;

      if (this.tableDataEdit.isStatus == "edit") {
        this.$closePage("editSalesCommodity", { tableDataList });
      } else {
        this.$store.dispatch("common/addNewrequestData", {
          isStatus: "add",
          tableDataList,
        });
        this.$closePage(path, {});
      }
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.page = 1;
      this.pagination.limit = val;
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
    },
    // 刷新
    hanleRefresh() {
      this.getList(1);
    },
    handleFication(item, index, val) {
      let that = this;

      if (!item.isNo && val == 0) {
        this.$message({
          dangerouslyUseHTMLString: true,
          message:
            "对方暂无该经营范围内的商品，<span id='ErrorMsg' style='color:#0BA198;cursor: pointer;'>提醒对方添加</span>",
          type: "warning",
          showClose: true,
        });
        document
          .getElementById("ErrorMsg")
          .addEventListener("click", function () {
            let param = {
              custmorId: that.tableDataLink.form.customerId, // 客户Id
              categoryId: item.categoryid, // 分类Id
              remindType: 1, // 1-销售单   2-需求单
            };
            reminAddScope(param).then((res) => {
              if (res.status == 200) {
                that.$message({
                  message: "提醒对方添加经营范围成功！",
                  type: "success",
                  showClose: true,
                });
              }
            });
          });

        return;
      }
      this.$set(this.ficationData, val, item);
      this.$set(this.ficationIndex, val, index);

      this.tableData = [];
      if (val == 0) {
        const el1 = this.ficationData[val];
        for (let k = 0; k < el1.childList.length; k++) {
          const el2 = el1.childList[k];
          for (let l = 0; l < el2.childList.length; l++) {
            const el3 = el2.childList[l];
            for (let p = 0; p < el3.childList.length; p++) {
              const el4 = el3.childList[p];
              this.tableData.push({
                ...el4,
                categoryName: el1.name + "-" + el2.name + "-" + el3.name,
              });
            }
          }
        }
      }

      if (val == 1) {
        const el2 = this.ficationData[val];
        for (let l = 0; l < el2.childList.length; l++) {
          const el3 = el2.childList[l];
          for (let p = 0; p < el3.childList.length; p++) {
            const el4 = el3.childList[p];
            this.tableData.push({
              ...el4,
              categoryName:
                this.ficationData[0].name +
                "-" +
                this.ficationData[1].name +
                "-" +
                el3.name,
            });
          }
        }
      }

      if (val == 2) {
        const el3 = this.ficationData[val];
        for (let p = 0; p < el3.childList.length; p++) {
          const el4 = el3.childList[p];
          this.tableData.push({
            ...el4,
            categoryName:
              this.ficationData[0].name +
              "-" +
              this.ficationData[1].name +
              "-" +
              el3.name,
          });
        }
      }
    },
    handleFicationClose(val) {
      this.$set(this.ficationData, val, undefined);
      this.$set(this.ficationIndex, val, undefined);

      this.tableData = [];
      if (val - 1 == 0) {
        const el1 = this.ficationData[val - 1];
        for (let k = 0; k < el1.childList.length; k++) {
          const el2 = el1.childList[k];
          for (let l = 0; l < el2.childList.length; l++) {
            const el3 = el2.childList[l];
            for (let p = 0; p < el3.childList.length; p++) {
              const el4 = el3.childList[p];
              this.tableData.push({
                ...el4,
                categoryName: el1.name + "-" + el2.name + "-" + el3.name,
              });
            }
          }
        }
      }

      if (val - 1 == 1) {
        const el2 = this.ficationData[val - 1];
        for (let l = 0; l < el2.childList.length; l++) {
          const el3 = el2.childList[l];
          for (let p = 0; p < el3.childList.length; p++) {
            const el4 = el3.childList[p];
            this.tableData.push({
              ...el4,
              categoryName:
                this.ficationData[0].name + "-" + el2.name + "-" + el3.name,
            });
          }
        }
      }

      if (val - 1 == 2) {
        const el3 = this.ficationData[val - 1];
        for (let p = 0; p < el3.childList.length; p++) {
          const el4 = el3.childList[p];
          this.tableData.push({
            ...el4,
            categoryName:
              this.ficationData[0].name +
              "-" +
              this.ficationData[1].name +
              "-" +
              el3.name,
          });
        }
      }

      if (val - 1 == -1) {
        for (let i = 0; i < this.classificationOptions.length; i++) {
          const el = this.classificationOptions[i];
          for (let j = 0; j < el.childList.length; j++) {
            const el1 = el.childList[j];
            for (let k = 0; k < el1.childList.length; k++) {
              const el2 = el1.childList[k];
              for (let l = 0; l < el2.childList.length; l++) {
                const el3 = el2.childList[l];
                this.tableData.push({
                  ...el3,
                  categoryName: el.name + "-" + el1.name + "-" + el2.name,
                });
              }
            }
          }
        }
      }
    },
    handleSelectionChange(val) {
      this.multipleSelectionList = JSON.parse(JSON.stringify(val));
      this.tableDataNum.forEach((res) => {
        this.multipleSelectionList.forEach((res1, index1) => {
          if (res.productid == res1.productid) {
            this.multipleSelectionList.splice(index1, 1);
          }
        });
      });
    },
    handleEditComm(form, record, title) {
      this.$refs[form].edit(record);
      this.$refs[form].title = title;
      this.$refs[form].disableSubmit = false;
      this.$refs[form].isVisiable = true;
    },
    selectedCommodityChange(val) {
      this.tableDataNum = val.tableDataList;
      this.$refs.plTable.clearSelection();
      this.tableDataNum.forEach((element) => {
        this.$refs.plTable.toggleRowSelection([
          {
            row: element,
            selected: true,
          },
        ]);
      });
      this.multipleSelectionList.forEach((element) => {
        this.$refs.plTable.toggleRowSelection([
          {
            row: element,
            selected: true,
          },
        ]);
      });
    },
  },
  //进入页面触发
  beforeRouteEnter(to, form, next) {
    next((vm) => {
      vm.initData();
    });
  },
};
</script>


<style lang="scss" scoped>
.addCommoditymodel {
  .fication1:hover {
    color: var(--default-color);
  }

  .header-page {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    .header-left {
      .header-left-content {
        display: flex;
        align-items: center;

        .header-lf-title {
          margin-right: 60px;

          .header-lf-word {
            display: flex;
            align-items: center;
            font-size: 16px;
            color: rgba(1, 6, 33, 0.9);
            margin-bottom: 5px;

            .header-icon {
              margin-left: 6px;
              border: none;

              &::after {
                content: "";
                display: block;
                width: 16px;
                height: 16px;
                background: url("../../assets/image/imgs/question-circle@2x.png")
                  no-repeat center / 100%;
              }
            }
          }

          .header-lf-num {
            font-size: 24px;
            color: rgba(1, 6, 33, 0.9);
          }
        }
      }
    }
  }

  .addCommoditysearch {
    padding: 16px 0px 26px 0px;
    border-bottom: 1px solid #e9e9e9;

    .search-form-border {
      display: inline-block;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      margin-right: 24px;

      .search-form-title {
        padding: 0px 8px;
        font-size: 14px;
        color: rgba(1, 6, 33, 0.35);
      }

      i {
        color: #c0c4cc;
        margin: 0px 6px;
      }

      ::v-deep .el-input {
        line-height: 25px;
      }

      ::v-deep .el-input__inner {
        border: none;
        padding: 0px 5px;
        height: 30px;
        line-height: 30px;
      }

      ::v-deep .el-range__icon {
        display: none;
      }
    }
  }

  .addCommoditytable {
    ::v-deep .el-tabs__header {
      margin: 0px;
    }

    .utable {
      width: 100%;
      border-left: 1px solid #e9e9e9;
      border-right: 1px solid #e9e9e9;
    }

    .paging {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-top: 10px;
      padding-bottom: 5px;
    }
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
</style>