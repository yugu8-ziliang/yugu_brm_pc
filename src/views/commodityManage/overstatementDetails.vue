<template>
  <!-- 报溢单详情 -->
  <PageNoScroll class="overstatementDetails">
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
          <el-descriptions-item label="报溢单编号">{{
            goodsDetail.changeNo
          }}</el-descriptions-item>
          <el-descriptions-item label="订单时间">{{
            goodsDetail.timestamp | parseTime
          }}</el-descriptions-item>
          <el-descriptions-item
            :label="
              goodsDetail.orderType == 1
                ? '关联盘点单'
                : goodsDetail.orderType == 2
                ? '关联销售单'
                : goodsDetail.orderType == 3
                ? '关联退货退款单'
                : goodsDetail.orderType == 4
                ? '关联配送单'
                : ''
            "
          >
            <font style="color: #1a7fd9">{{
              goodsDetail.relationModelNo
            }}</font>
          </el-descriptions-item>
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
                {{ goodsDetail.classifyName }}-{{ goodsDetail.productName }}|{{
                  goodsDetail.variety
                }}
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
                    {{ goodsDetail.productCount + goodsDetail.subUnit }}
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
                        ? "/" + goodsDetail.subUnit
                        : ""
                    }}{{ goodsDetail.subUnit2 != "" ? ")" : "" }}
                    <span v-if="goodsDetail.pieceUnit != ''">
                      {{
                        goodsDetail.pieceUnit != "" &&
                        goodsDetail.pieceUnit != "筐(一次性)"
                          ? "(" +
                            goodsDetail.pieceCount +
                            goodsDetail.pieceUnit +
                            ")"
                          : "(" + goodsDetail.pieceCount + "筐)"
                      }}{{
                        goodsDetail.basketCount != 0
                          ? "|" + goodsDetail.basketCount
                          : ""
                      }}
                      <font
                        v-if="goodsDetail.basketCount != 0"
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
              批次信息
            </div>
            <div style="height: 100%">
              <el-table
                :data="goodsDetailList"
                style="border-top: 1px solid #e9e9e9"
              >
                <el-table-column label="编号" type="index" width="80">
                </el-table-column>
                <el-table-column label="入库时间" prop="inTimeStamp">
                  <template slot-scope="scope">
                    {{ scope.row.inTimeStamp | parseTime }}
                  </template>
                </el-table-column>
                <el-table-column label="入库类型" prop="batchSource">
                </el-table-column>
                <el-table-column label="报溢前库存" prop="beforeCount">
                  <template slot-scope="scope">
                    {{ scope.row.beforeCount + goodsDetail.subUnit }}
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
                        ? "/" + goodsDetail.subUnit
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
                <el-table-column label="报溢后库存" prop="afterCount">
                  <template slot-scope="scope">
                    {{ scope.row.afterCount + goodsDetail.subUnit }}
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
                        ? "/" + goodsDetail.subUnit
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
                <el-table-column label="报溢数量" prop="floatCount">
                  <template slot-scope="scope">
                    {{ scope.row.floatCount + goodsDetail.subUnit }}
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
                        ? "/" + goodsDetail.subUnit
                        : ""
                    }}
                    {{ goodsDetail.subUnit2 != "" ? ")" : "" }}
                    {{
                      goodsDetail.pieceUnit != "" &&
                      goodsDetail.pieceUnit != "筐(一次性)"
                        ? "(" +
                          scope.row.floatPieceCount +
                          goodsDetail.pieceUnit +
                          ")"
                        : "(" + scope.row.floatPieceCount + "筐)"
                    }}
                    {{
                      scope.row.floatBasketCount != 0
                        ? "|" + scope.row.floatBasketCount
                        : ""
                    }}<font
                      v-if="scope.row.floatBasketCount != 0"
                      style="color: #df971a"
                      >筐</font
                    >
                  </template>
                </el-table-column>
                <el-table-column label="报溢筐子" prop="floatBasketCount">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      style="color: #1a7fd9"
                      v-if="scope.row.floatBasketCount"
                      @click="useBasket()"
                    >
                      {{ scope.row.floatBasketCount }}个
                    </el-button>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
                <el-table-column label="使用自家筐子" prop="useEmptyBasket">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      style="color: #1a7fd9"
                      v-if="scope.row.useEmptyBasket"
                      @click="useBasket()"
                    >
                      {{ scope.row.useEmptyBasket }}个
                    </el-button>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table_count_styl">
                <span style="margin-right: 32px">合计</span>
                <span style="margin-right: 32px"
                  >批次数量:{{ goodsDetail.batchCount }}个</span
                >
                <span style="margin-right: 32px">
                  报溢总量:{{ goodsDetail.floatCount + goodsDetail.subUnit }}
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
                    goodsDetail.subUnit2 != "" ? "/" + goodsDetail.subUnit : ""
                  }}
                  {{ goodsDetail.subUnit2 != "" ? ")" : "" }}
                  {{
                    goodsDetail.pieceUnit != "" &&
                    goodsDetail.pieceUnit != "筐(一次性)"
                      ? "(" +
                        goodsDetail.floatPieceCount +
                        goodsDetail.pieceUnit +
                        ")"
                      : "(" + goodsDetail.floatPieceCount + "筐)"
                  }}
                  {{
                    goodsDetail.floatBasketCount != 0
                      ? "|" + goodsDetail.floatBasketCount
                      : ""
                  }}<font
                    v-if="goodsDetail.floatBasketCount != 0"
                    style="color: #df971a"
                    >筐</font
                  >
                </span>
                <span style="margin-right: 32px"
                  >报溢筐子:{{ goodsDetail.floatBasketCount }}个</span
                >
                <span>使用自家筐子:{{ goodsDetail.useEmptyBasket }}个</span>
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
              报溢原因
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
      title="使用筐子"
      :visible.sync="usebasketDialog"
      width="30%"
      :before-close="handleClose"
    >
      <div>
        <div style="color: rgba(1, 6, 33, 0.9); font-size: 18px">
          {{ goodsDetail.classifyName }}-{{ goodsDetail.productName }}|{{
            goodsDetail.variety
          }}
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
                {{ goodsDetailList1.inTimeStamp | parseTime }}</span
              >
            </el-col>
            <el-col :span="12"
              ><span style="color: rgba(1, 6, 33, 0.55)">入库类型：</span
              ><span style="color: #1a7fd9">
                {{ goodsDetailList1.batchSource }}</span
              >
            </el-col>
          </el-row>
        </div>
        <div
          style="color: rgba(1, 6, 33, 0.9); font-size: 18px; margin-top: 16px"
        >
          去皮 &nbsp; 筐子总数{{
            goodsDetailList1.floatBasketCount + goodsDetailList1.useEmptyBasket
          }}个
        </div>
        <!-- 报溢筐子 -->
        <div
          style="border-bottom: 1px solid #e9e9e9; padding: 14px 0px"
          v-if="goodsDetailList1.floatBasketCount > 0"
        >
          <div style="color: rgba(1, 6, 33, 0.55)">
            报溢筐子{{ goodsDetailList1.floatTypeCount }}种 &nbsp; 数量{{
              goodsDetailList1.floatBasketCount
            }}个
          </div>
          <div v-for="(basketitem, index) in basketInfo" :key="index">
            <div style="color: rgba(1, 6, 33, 0.9); margin: 14px 0px">
              【{{ basketitem.name }}】{{ basketitem.basketName }}
            </div>
            <span
              style="margin-bottom: 16px"
              v-for="(basketitem1, index1) in basketitem.modelList"
              :key="index1"
            >
              <span style="margin-right: 80px"
                >[{{ basketitem1.basketColor }}] 数量：{{
                  basketitem1.count
                }}个</span
              >
            </span>
          </div>
        </div>
        <!-- 使用自家筐子 -->
        <div
          style="margin: 14px 0px"
          v-if="goodsDetailList1.useEmptyBasket > 0"
        >
          <div style="color: rgba(1, 6, 33, 0.55); margin: 14px 0px">
            使用自家筐子{{ goodsDetailList1.useEmptyTypeBasket }}种 &nbsp;
            数量{{ goodsDetailList1.useEmptyBasket }}个
          </div>
          <div v-for="(basketitem, index) in basketInfo" :key="index">
            <div style="color: rgba(1, 6, 33, 0.9); margin-bottom: 16px">
              【{{ basketitem.name }}】{{ basketitem.basketName }}
            </div>
            <span
              style="margin-bottom: 16px"
              v-for="(basketitem1, index1) in basketitem.modelList"
              :key="index1"
            >
              <span style="margin-right: 80px"
                >[{{ basketitem1.basketColor }}] 数量：{{
                  basketitem1.useCount
                }}个</span
              >
            </span>
          </div>
        </div>
      </div>
    </el-dialog>
  </PageNoScroll>
</template>

<script>
import { productOverOrLossDetails } from "@/request/api/commodityDetail/index";
export default {
  name: "overstatementDetails",
  data() {
    return {
      mainId: this.$route.query.id,
      goodsDetail: {},
      goodsDetailList: [],
      goodsDetailList1: {},
      basketInfo: {},
      usebasketDialog: false,
    };
  },
  methods: {
    productOverOrLossDetails() {
      productOverOrLossDetails({
        mainId: this.$route.query.id,
      }).then((res) => {
        console.log(res);
        this.goodsDetail = res.data[0];
        this.goodsDetailList = res.data[0].modelList;
        this.goodsDetailList1 = res.data[0].modelList[0];
        this.basketInfo = res.data[0].modelList[0].basketInfo;
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
    this.productOverOrLossDetails();
  },
};
</script>

<style lang="scss">
.overstatementDetails {
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