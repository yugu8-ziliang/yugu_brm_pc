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
                  {{ item.categoryName }}
                </el-tag>
              </span>

              <el-tag
                type="info"
                v-if="ficationData[0] != undefined"
                closable
                style="border: none; cursor: pointer; font-size: 14px"
                @close="handleFicationClose(0)"
              >
                {{ ficationData[0].categoryName }}
              </el-tag>

              <el-tag
                type="info"
                v-if="ficationData[1] != undefined"
                closable
                style="border: none; cursor: pointer; font-size: 14px"
                @close="handleFicationClose(1)"
              >
                {{ ficationData[1].categoryName }}
              </el-tag>
              <el-tag
                type="info"
                v-if="ficationData[2] != undefined"
                closable
                style="border: none; cursor: pointer; font-size: 14px"
                @close="handleFicationClose(2)"
              >
                {{ ficationData[2].categoryName }}
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
                  {{ item.categoryName }}
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
                  {{ item1.categoryName }}
                </el-tag>
              </span>
            </div>
          </div>
        </div>

        <div class="addCommoditytable">
          <u-table
            ref="plTable"
            class="utable"
            :height="$store.getters.screenHeight - 415 + 'px'"
            :border="false"
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
            @selection-change="handleSelectionChange"
          >
            <template slot="empty">没有查询到符合条件的记录</template>
            <u-table-column
              type="selection"
              width="55"
              align="center"
              name="选择"
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
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
            </u-table-column>
          </u-table>
          <div class="paging">
            <el-pagination
              background
              layout="total, sizes, prev, pager, next, jumper"
              :page-sizes="[10, 20, 50, 100]"
              :total="pagination.total"
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
                multipleSelection.length > 20 - tableDataNum.length
                  ? true
                  : false
              "
              type="primary"
              size="mini"
              @click="handleJumpDetail('addNewrequest', '')"
              >确认选择
            </el-button>
          </div>
          <div style="margin-right: 10px">
            <span
              style="font-size: 16px; color: #0ba198; cursor: pointer"
              @click="
                handleEditComm(
                  'selectedCommodity',
                  { multipleSelection, tableDataNum },
                  '查看已选'
                )
              "
              >查看已选(<span
                :style="{
                  color:
                    multipleSelection.length > 20 - tableDataNum.length
                      ? '#DD4C4D'
                      : '#0BA198',
                }"
                >{{ multipleSelection.length }}/{{
                  20 - tableDataNum.length
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
import {
  productList,
  productCate,
} from "@/request/api/commodityManage/commodityList";

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
      classificationOptions: [],
      ficationData: [],
      ficationIndex: [],
      multipleSelection: [],
    };
  },
  methods: {
    initData() {
      let { data: data } = this.$route.query;
      // 判断url是否为空
      if (data) {
        // 解析数据
        try {
          let param = JSON.parse(Base64.decode(data));
          this.tableDataNum = JSON.parse(JSON.stringify(param));
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
        ...this.queryData,
        pageindex: this.pagination.page, // 分页，第几页
        pagesize: this.pagination.limit, // 分页，每页几条
      };

      productList(param).then((res) => {
        this.tableData = res.data[0].modelList;
        this.pagination.total = res.data[0].sumCount; //分页前数据条数
      });
    },

    productCate() {
      productCate({
        modelType: "0",
      }).then((res) => {
        this.classificationOptions = res.data;
      });
    },
    // 跳转页面
    handleJumpDetail: function (form, record) {
      let tableDataList = [];
      for (let i = 0; i < this.multipleSelection.length; i++) {
        const el = this.multipleSelection[i];
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
      // this.$closePage(path,{data: Base64.encode(JSON.stringify(tableDataList))});
      this.$store.dispatch("common/addNewrequestData", {
        isStatus: "add",
        tableDataList,
      });
      this.$closePage(path, {});
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.getList();
    },
    // 刷新
    hanleRefresh() {
      this.getList(1);
    },
    handleFication(item, index, val) {
      this.$set(this.ficationData, val, item);
      this.$set(this.ficationIndex, val, index);
      if (val == 2) {
        this.queryData.classifyId = item.categoryId;
        this.getList();
      }
    },
    handleFicationClose(val) {
      this.$set(this.ficationData, val, undefined);
      this.$set(this.ficationIndex, val, undefined);
      if (val == 2) {
        this.queryData.classifyId = "";
        this.getList();
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleEditComm(form, record, title) {
      this.$refs[form].edit(record);
      this.$refs[form].title = title;
      this.$refs[form].disableSubmit = false;
      this.$refs[form].isVisiable = true;
    },
    selectedCommodityChange(val) {
      this.tableDataNum = JSON.parse(JSON.stringify(val));
    },
  },
  // created() {
  //     this.getList();
  //     this.productCate();
  // },
  //进入页面触发
  beforeRouteEnter(to, form, next) {
    next((vm) => {
      vm.initData();
      vm.getList();
      vm.productCate();
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