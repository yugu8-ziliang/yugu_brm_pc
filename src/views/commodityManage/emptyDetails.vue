<template>
  <!-- 腾空单详情 -->
  <PageNoScroll class="emptyDetails">
    <el-scrollbar
      ref="scrollDiv"
      :style="{
        height: $store.getters.screenHeight - 220 + 'px',
      }"
    >
      <div
        style="
          border-bottom: 1px solid rgba(233, 233, 233, 1);
          padding-bottom: 20px;
        "
      >
        <el-descriptions title="订单信息">
          <template slot="extra">
            <div style="margin-right: 16px">
              <span>操作人：</span>
              <span>{{ goodsDetail.addByUserName }}</span>
            </div>
          </template>
          <el-descriptions-item label="腾空单编号">{{
            goodsDetail.productEmptyId
          }}</el-descriptions-item>
          <el-descriptions-item label="订单时间">{{
            goodsDetail.timestamp | parseTime
          }}</el-descriptions-item>
        </el-descriptions>
        <!-- 按钮 -->
        <div class="flex_dom flex_row_reverse flex_item_mid">
          <el-button size="small">打印</el-button>
        </div>
      </div>

      <div style="margin-top: 18px">
        <div
          style="
            font-size: 18px;
            color: rgba(1, 6, 33, 0.9);
            font-weight: 600;
            margin-bottom: 12px;
          "
        >
          商品信息
        </div>
        <div ref="currentBasketDetailsTable">
          <div
            style="
              padding: 10px 10px 15px;
              border-bottom: 1px solid rgba(233, 233, 233, 1);
            "
          >
            <div class="flex_dom flex_item_between flex_item_mid">
              <div style="color: rgba(1, 6, 33, 0.9); font-size: 18px">
                {{ goodsDetail.firstName }}-{{ goodsDetail.secondName }}-{{
                  goodsDetail.productName
                }}|{{ goodsDetail.variety }}
              </div>
            </div>
            <div style="padding: 16px 0px 12px">
              <el-row>
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.55)">产地：</span
                  ><span style="color: rgba(1, 6, 33, 0.9)">
                    {{ goodsDetail.regionName }}</span
                  >
                </el-col>
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.55)">级别/规格：</span
                  ><span style="color: rgba(1, 6, 33, 0.9)">
                    {{ goodsDetail.spec }}</span
                  >
                </el-col>
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.55)">当前库存：</span
                  ><span style="color: rgba(1, 6, 33, 0.9)">
                    {{ goodsDetail.batchNumber + goodsDetail.subunit }}
                    {{ goodsDetail.subUnit2 != "" ? "(" : ""
                    }}{{
                      goodsDetail.subUnit3Weight == 0
                        ? ""
                        : goodsDetail.subUnit3Weight + goodsDetail.subUnit3
                    }}{{ goodsDetail.subUnit3 != "" ? "*" : ""
                    }}{{
                      goodsDetail.subUnit2Weight == 0
                        ? ""
                        : goodsDetail.subUnit2Weight + goodsDetail.subUnit2
                    }}{{
                      goodsDetail.subUnit2 != ""
                        ? "/" + goodsDetail.subunit
                        : ""
                    }}{{ goodsDetail.subUnit2 != "" ? ")" : "" }}
                    <span v-if="goodsDetail.pieceUnit != ''">
                      {{
                        goodsDetail.pieceUnit != "" &&
                        goodsDetail.pieceUnit != "筐(一次性)"
                          ? "(" +
                            goodsDetail.pieceNumber +
                            goodsDetail.pieceUnit +
                            ")"
                          : "(" + goodsDetail.pieceNumber + "筐)"
                      }}{{
                        goodsDetail.basketNumber != 0
                          ? "|" + goodsDetail.basketNumber
                          : ""
                      }}
                      <font
                        v-if="goodsDetail.basketNumber != 0"
                        style="color: #df971a"
                        >筐</font
                      >
                    </span></span
                  >
                </el-col>
              </el-row>
            </div>
          </div>
          <div style="margin-top: 18px">
            <div
              style="
                font-size: 18px;
                color: rgba(1, 6, 33, 0.9);
                font-weight: 600;
                margin-bottom: 16px;
              "
            >
              批次列表
            </div>
            <div style="height: 100%">
              <el-table
                :data="goodsDetailList"
                style="border-top: 1px solid #e9e9e9"
              >
                <el-table-column label="编号" type="index" width="80">
                </el-table-column>
                <el-table-column label="入库时间" prop="productIdBatchName">
                  <template slot-scope="scope">
                    {{ scope.row.productIdBatchName | parseTime }}
                  </template>
                </el-table-column>
                <el-table-column label="入库类型" prop="productIdBatchType">
                  <template slot-scope="scope">
                    <span style="color: #1a7fd9">
                      {{ scope.row.productIdBatchType }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="腾空前库存" prop="productIdBatchCount">
                  <template slot-scope="scope">
                    {{ scope.row.productIdBatchCount + goodsDetail.subunit }}
                    {{ goodsDetail.subUnit2 != "" ? "(" : "" }}
                    {{
                      goodsDetail.subUnit3Weight == 0
                        ? ""
                        : goodsDetail.subUnit3Weight + goodsDetail.subUnit3
                    }}
                    {{ goodsDetail.subUnit3 != "" ? "*" : "" }}
                    {{
                      goodsDetail.subUnit2Weight == 0
                        ? ""
                        : goodsDetail.subUnit2Weight + goodsDetail.subUnit2
                    }}
                    {{
                      goodsDetail.subUnit2 != ""
                        ? "/" + goodsDetail.subunit
                        : ""
                    }}
                    {{ goodsDetail.subUnit2 != "" ? ")" : "" }}
                    <span v-if="goodsDetail.pieceUnit != ''">
                      {{
                        goodsDetail.pieceUnit != "" &&
                        goodsDetail.pieceUnit != "筐(一次性)"
                          ? "(" +
                            scope.row.beforePieceCount +
                            goodsDetail.pieceUnit +
                            ")"
                          : "(" + scope.row.beforePieceCount + "筐)"
                      }}
                    </span>
                    {{
                      scope.row.beforeBasketCount != 0
                        ? "|" + scope.row.beforeBasketCount
                        : ""
                    }}
                    <font
                      v-if="scope.row.beforeBasketCount != 0"
                      style="color: #df971a"
                      >筐</font
                    >
                  </template>
                </el-table-column>
                <el-table-column label="腾空后库存" prop="productIdBatchCount">
                  <template slot-scope="scope">
                    {{ scope.row.productIdBatchCount + goodsDetail.subunit }}
                    {{ goodsDetail.subUnit2 != "" ? "(" : "" }}
                    {{
                      goodsDetail.subUnit3Weight == 0
                        ? ""
                        : goodsDetail.subUnit3Weight + goodsDetail.subUnit3
                    }}
                    {{ goodsDetail.subUnit3 != "" ? "*" : "" }}
                    {{
                      goodsDetail.subUnit2Weight == 0
                        ? ""
                        : goodsDetail.subUnit2Weight + goodsDetail.subUnit2
                    }}
                    {{
                      goodsDetail.subUnit2 != ""
                        ? "/" + goodsDetail.subunit
                        : ""
                    }}
                    {{ goodsDetail.subUnit2 != "" ? ")" : "" }}
                    <span v-if="goodsDetail.pieceUnit != ''">
                      {{
                        goodsDetail.pieceUnit != "" &&
                        goodsDetail.pieceUnit != "筐(一次性)"
                          ? "(" +
                            scope.row.afterPieceCount +
                            goodsDetail.pieceUnit +
                            ")"
                          : "(" + scope.row.afterPieceCount + "筐)"
                      }}
                    </span>
                    {{
                      scope.row.afterBasketCount != 0
                        ? "|" + scope.row.afterBasketCount
                        : ""
                    }}
                    <font
                      v-if="scope.row.afterBasketCount != 0"
                      style="color: #df971a"
                      >筐</font
                    >
                  </template>
                </el-table-column>
                <el-table-column label="腾空装载物" prop="emptyPieceCount">
                  <template slot-scope="scope"
                    >{{ scope.row.emptyPieceCount
                    }}{{ scope.row.pieceUnit }}</template
                  >
                </el-table-column>
                <el-table-column label="腾空筐子" prop="emptyBasketCount">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      style="color: #1a7fd9"
                      v-if="scope.row.emptyBasketCount"
                      @click="useBasket()"
                    >
                      {{ scope.row.emptyBasketCount }}个
                    </el-button>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table_count_styl">
                <span>合计</span>
                <span>批次数量:{{ goodsDetail.productBatchCount }}个</span>
                <span>
                  腾空装载物:{{ goodsDetail.emptyPieceCount
                  }}{{ goodsDetail.pieceUnit }}
                </span>
                <span>腾空筐子:{{ goodsDetail.basketTotalCount }}个</span>
              </div>
            </div>
          </div>
          <div style="border-top: 1px solid #e9e9e9; margin-top: 24px">
            <div
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 18px;
                font-weight: 700;
                padding-right: 15px;
                margin: 16px 0px;
              "
            >
              腾空原因
            </div>
            <div style="padding: 10px 0px">
              {{ goodsDetail.remark }}
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>

    <!-- 弹窗 -->
    <el-dialog
      title="腾空筐子"
      :visible.sync="usebasketDialog"
      width="30%"
      :before-close="handleClose"
    >
      <div>
        <div style="color: rgba(1, 6, 33, 0.9); font-size: 18px">
          {{ goodsDetail.firstName }}-{{ goodsDetail.secondName }}-{{
            goodsDetail.productName
          }}|{{ goodsDetail.variety }}
        </div>
        <div style="border-bottom: 1px solid #e9e9e9">
          <el-row
            style="
              margin-top: 16px;
              margin-bottom: 12px;
              border-bottom: 1px solid #e9e9e9;
              padding-bottom: 12px;
            "
          >
            <el-col :span="9"
              ><span style="color: rgba(1, 6, 33, 0.55)">产地：</span
              ><span style="color: rgba(1, 6, 33, 0.9)">
                {{ goodsDetail.regionName }}</span
              >
            </el-col>
            <el-col :span="9"
              ><span style="color: rgba(1, 6, 33, 0.55)">级别/规格：</span
              ><span style="color: rgba(1, 6, 33, 0.9)">
                {{ goodsDetail.spec }}</span
              >
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 16px">
            <el-col :span="12"
              ><span style="color: rgba(1, 6, 33, 0.55)">入库时间：</span
              ><span style="color: rgba(1, 6, 33, 0.9)">
                {{ goodsDetailList1.productIdBatchName | parseTime }}</span
              >
            </el-col>
            <el-col :span="12"
              ><span style="color: rgba(1, 6, 33, 0.55)">入库类型：</span
              ><span style="color: #1a7fd9">
                {{ goodsDetailList1.productIdBatchType }}</span
              >
            </el-col>
          </el-row>
        </div>
        <div
          style="border-bottom: 1px solid #e9e9e9; padding: 14px 0px"
          v-if="goodsDetailList1.emptyBasketCount > 0"
        >
          <div style="color: rgba(1, 6, 33, 0.55)">
            腾空筐子{{ goodsDetail.basketTypeCount }}种 &nbsp; 数量{{
              goodsDetailList1.emptyBasketCount
            }}个
          </div>
          <div v-for="(basketitem, index) in basketList" :key="index">
            <div style="color: rgba(1, 6, 33, 0.9); margin: 14px 0px">
              【{{ basketitem.name }}】{{ basketitem.basketName }}
            </div>
            <span style="margin-right: 80px"
              >[{{ basketitem.basketColor }}] 数量：{{
                basketitem.emptyBasketCount
              }}个</span
            >
          </div>
        </div>
      </div>
    </el-dialog>
  </PageNoScroll>
</template>

<script>
import { emptyDetails } from "@/request/api/commodityDetail/index";
export default {
  name: "emptyDetails",
  data() {
    return {
      productEmptyId: this.$route.query.id,
      goodsDetail: {},
      goodsDetailList: [],
      goodsDetailList1: {},
      basketList: {},
      usebasketDialog: false,
    };
  },
  methods: {
    emptyDetails() {
      emptyDetails({
        productEmptyId: this.$route.query.id,
      }).then((res) => {
        this.goodsDetail = res.data[0];
        this.goodsDetailList = res.data[0].modelList;
        this.goodsDetailList1 = res.data[0].modelList[0];
        this.basketList = res.data[0].modelList[0].basketList;
      });
    },
    //处理保留小数点后两位
    moneyFormatTwo(moneyStr) {
      // 先将数值取两位小数
      let money = Number(moneyStr)
        .toFixed(2)
        .toString()
        .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      return money;
    },
    useBasket() {
      this.usebasketDialog = true;
    },
    handleClose() {
      this.usebasketDialog = false;
    },
  },
  created() {
    this.emptyDetails();
  },
};
</script>

<style lang="scss">
.emptyDetails {
  .table_count_styl {
    padding: 12px;
    color: rgba(1, 6, 33, 0.75);
    background-color: rgba(1, 6, 33, 0.02);
    border: 1px solid #e9e9e9;
    border-top: 0px;

    .table_count_styl span {
      margin-right: 32px;
    }
  }

  .el-scrollbar {
    .el-scrollbar__wrap {
      margin-bottom: 0px !important;
      overflow-x: hidden;

      .el-scrollbar__view {
        position: relative;
        padding: 0px !important;
      }
    }
  }
}
</style>