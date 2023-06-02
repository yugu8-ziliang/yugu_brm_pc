<template>
  <!-- 选择商品 -->
  <PageNoScroll @hanleRefresh="hanleRefresh">
    <div
      class="viewDraftsmodel"
      :style="{ '--screenHeight': $store.getters.screenHeight - 305 + 'px' }"
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
      <div class="flex_dom">
        <div class="salesDraft-left">
          <div
            style="
              padding: 10px 10px;
              border-bottom: 1px solid rgba(1, 6, 33, 0.06);
            "
          >
            <div style="font-size: 14px; color: rgba(1, 6, 33, 0.9)">
              {{ form.factoryName }} - {{ form.factoryPhone }}
            </div>
          </div>
          <el-scrollbar>
            <!-- tableData -->
            <ul class="salesDraft-left-ul">
              <li
                v-for="(item, index) in tableData"
                :key="index"
                class="salesDraft-left-li flex_dom flex_item_mid"
                :style="{ background: tableIndex == index ? '#CEF2ED' : '' }"
                @click="handleTable(index)"
              >
                <div>
                  <el-checkbox
                    v-model="checkedList[index]"
                    @change.self="handelChecked(index)"
                  >
                  </el-checkbox>
                </div>
                <div style="padding: 0px 10px; cursor: pointer">
                  <div style="font-size: 14px; color: rgba(1, 6, 33, 0.9)">
                    {{ item.timestamp | parseTime() }}
                  </div>
                </div>
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <div class="viewDraftstable" style="padding: 10px">
          <div
            class="flex_dom flex_item_between"
            style="
              color: rgba(1, 6, 33, 0.9);
              font-size: 14px;
              padding-bottom: 10px;
            "
          >
            <div>需求商品：20种</div>
            <div>操作人：{{ userInfo.personname }}</div>
          </div>
          <u-table
            ref="plTable"
            class="utable"
            :border="false"
            :height="$store.getters.screenHeight - 480 + 'px'"
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
            :data="tableData[tableIndex].productInfo"
            @selection-change="handleSelectionChange"
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
                <span v-if="item.prop == 'categoryName'" style="color: #1a7fd9">
                  {{ scope.row.categoryfirstName }}-{{
                    scope.row.categorysecondName
                  }}-{{ scope.row.productName }}
                </span>
                <span
                  v-else-if="item.prop == 'productName'"
                  style="color: #1a7fd9"
                >
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
                        scope.row.subUnit,
                        scope.row.subUnit2,
                        scope.row.subUnit3,
                        scope.row.pieceUnit,
                        scope.row.subUnit2Weight,
                        scope.row.subUnit3Weight,
                        scope.row.count,
                        0,
                        scope.row.pieceCount
                      )
                    "
                  ></span>
                </span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
            </u-table-column>
          </u-table>
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

            <div style="padding: 0px 0px">
              <span
                style="
                  color: rgba(1, 6, 33, 0.55);
                  font-size: 14px;
                  width: 250px;
                  display: inline-block;
                "
                >商品种类：<span
                  style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                  >{{ tableData[tableIndex].productInfo.length }}种</span
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
            <div style="padding: 0px 0px; font-size: 14px">
              {{ tableData[tableIndex].remark }}
            </div>
          </div>
        </div>
      </div>

      <div class="btnBottom">
        <div class="flex_row_reverse flex_item_mid">
          <div style="margin-right: 10px">
            <el-button
              :disabled="
                multipleSelection.length > 20 - tableDataNum.length
                  ? true
                  : false
              "
              type="primary"
              size="mini"
              @click="handleJumpDetail('addNewrequest', '')"
              >使用草稿
            </el-button>
          </div>
          <div style="margin-right: 10px">
            <el-button size="mini" @click="handleDelete()">删除 </el-button>
          </div>
          <div style="margin-right: 10px">
            <span
              style="
                font-size: 16px;
                color: rgba(1, 6, 33, 0.9);
                cursor: pointer;
              "
              >已选 需求单：5单，商品：(<span
                :style="{
                  color:
                    checkedListNum > 20 - tableDataNum.length
                      ? '#DD4C4D'
                      : '#0BA198',
                }"
                >{{ checkedListNum }}/{{ 20 - tableDataNum.length }}</span
              >
              种)</span
            >
          </div>
        </div>
      </div>
    </div>
  </PageNoScroll>
</template>

<script>
import { Base64 } from "js-base64";

import { draftList, deleteDrafts } from "@/request/api/demandManage/index.js";
import { mapGetters } from "vuex";

export default {
  name: "addCommodity",
  data() {
    return {
      columns: [
        {
          prop: "categoryName",
          label: "商品分类",
        },
        {
          prop: "productName",
          label: "品种|品牌",
        },

        {
          prop: "regionName",
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
          label: "需求数量",
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
      form: {},
      tableData: [
        {
          productInfo: [],
        },
      ],
      tableDataNum: [],
      checkedList: [],

      multipleSelection: [],
      tableIndex: 0,
    };
  },
  computed: {
    ...mapGetters(["sidebar", "userInfo", "device"]),
    checkedListNum() {
      let Nums = 0;
      for (let i = 0; i < this.checkedList.length; i++) {
        const el = this.checkedList[i];
        if (el) {
          Nums += this.tableData[i].productInfo.length;
        }
      }

      return Nums;
    },
  },
  methods: {
    initData() {
      let { data: data } = this.$route.query;
      // 判断url是否为空
      if (data) {
        // 解析数据
        try {
          let param = JSON.parse(Base64.decode(data));
          // console.log(param);
          this.form = JSON.parse(JSON.stringify(param.form));
          this.tableDataNum = JSON.parse(JSON.stringify(param.tableData));
          this.getList();
        } catch (error) {
          this.handleRouter();
        }
        return;
      }
      this.handleRouter();
    },
    handleRouter() {
      let path = this.tableData.fullPath || "/commodityManage/addCommodity";
      this.$closePage(path);
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
    getList(arg) {
      //查询条件
      let param = {
        touserId: this.form.touserId,
      };

      draftList(param).then((res) => {
        this.tableData = res.data[0].modelList;
        let param = [];
        if (this.tableData.length > 0) {
          this.tableData.forEach(() => {
            param.push(false);
          });
        }
        this.checkedList = param;
      });
    },
    // 跳转页面
    handleJumpDetail: function (form, record) {
      let tableDataList = [];
      for (let i = 0; i < this.tableDataNum.length; i++) {
        const el = this.tableDataNum[i];
        tableDataList.push(el);
      }

      for (let i = 0; i < this.checkedList.length; i++) {
        const el = this.checkedList[i];
        if (el) {
          for (let j = 0; j < this.tableData[i].productInfo.length; j++) {
            const ele = this.tableData[i].productInfo[j];
            ele.categoryName =
              ele.categoryfirstName +
              " - " +
              ele.categorysecondName +
              " - " +
              ele.productName;
            ele.batchCount = ele.count;
            ele.pieceCount = ele.pieceCount;
            ele.basketCount = 0;
          }
          tableDataList.push(...this.tableData[i].productInfo);
        }
      }

      if (tableDataList.length == 0) {
        return this.$warning("请先选择数据");
      }

      let path = form;
      this.$store.dispatch("common/addNewrequestData", {
        isStatus: "add",
        tableDataList,
      });
      this.$closePage(path, {});
    },
    // 刷新
    hanleRefresh() {
      this.getList(1);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleTable(val) {
      this.tableIndex = val;
    },
    handelChecked(index) {},
    // 删除
    handleDelete() {
      let Nums = [];
      for (let i = 0; i < this.checkedList.length; i++) {
        const el = this.checkedList[i];
        if (el) {
          Nums.push(this.tableData[i].drafId);
        }
      }

      if (Nums.length == 0) {
        return this.$warning("请先选择");
      }
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteDrafts({
            DraftIds: Nums,
          }).then((res) => {
            if (res.status == 200) {
              this.$message({
                type: "success",
                message: "删除成功!",
              });
              this.getList();
            }
          });
        })
        .catch(() => {});
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
.viewDraftsmodel {
  .salesDraft-left {
    width: 300px;

    .salesDraft-left-ul {
      margin-right: 7px;

      .salesDraft-left-li {
        // padding: 10px 15px 10px 10px;
        padding: 10px;
        background: #fff;
        border-bottom: 1px solid rgba(1, 6, 33, 0.06);
      }
    }
  }

  .viewDraftstable {
    width: calc(100% - 300px);

    .utable {
      width: 100%;
      border-top: 1px solid #e9e9e9;
      border-left: 1px solid #e9e9e9;
      border-right: 1px solid #e9e9e9;
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
.viewDraftsmodel {
  .salesDraft-left {
    .el-scrollbar {
      .el-scrollbar__wrap {
        background: #f5f5f5 !important;
        margin-bottom: 0px !important;
        overflow-x: hidden;

        .el-scrollbar__view {
          min-width: 0px !important;
          height: var(--screenHeight) !important;
          position: relative;
          padding: 0px !important;
        }
      }

      .el-scrollbar__bar {
        right: 0px;
      }
    }
  }
}
</style>