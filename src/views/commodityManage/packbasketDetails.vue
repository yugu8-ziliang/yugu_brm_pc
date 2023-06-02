<template>
  <!-- 装筐单详情 -->
  <PageNoScroll class="packbasketDetails">
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
          <el-descriptions-item label="装筐单编号">{{
            goodsDetail.orderNo
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
                {{ goodsDetail.productName }}|{{ goodsDetail.variety }}
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
                    {{ goodsDetailList1.productCount + goodsDetail.subUnit }}
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
                            goodsDetailList1.productPieceCount +
                            goodsDetail.pieceUnit +
                            ")"
                          : "(" + goodsDetailList1.productPieceCount + "筐)"
                      }}{{
                        goodsDetailList1.loadBasketCount != 0
                          ? "|" + goodsDetailList1.loadBasketCount
                          : ""
                      }}
                      <font
                        v-if="goodsDetailList1.loadBasketCount != 0"
                        style="color: #df971a"
                        >筐
                      </font>
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
                <el-table-column label="编号" type="index" width="100">
                </el-table-column>
                <el-table-column label="入库时间" prop="batchName">
                  <template slot-scope="scope">
                    {{ scope.row.batchName | parseTime }}
                  </template>
                </el-table-column>
                <el-table-column label="入库类型" prop="batchTypeName">
                  <template slot-scope="scope">
                    <span style="color: #1a7fd9">
                      {{ scope.row.batchTypeName }}
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="装筐前库存" prop="productCount">
                  <template slot-scope="scope">
                    {{ scope.row.productCount + goodsDetail.subUnit }}
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
                            scope.row.productPieceCount +
                            goodsDetail.pieceUnit +
                            ")"
                          : "(" + scope.row.productPieceCount + "筐)"
                      }}{{
                        scope.row.beforeBasketCount != 0
                          ? "|" + scope.row.beforeBasketCount
                          : ""
                      }}
                      <font
                        v-if="scope.row.beforeBasketCount != 0"
                        style="color: #df971a"
                        >筐
                      </font>
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="装筐后库存" prop="productCount">
                  <template slot-scope="scope">
                    {{ scope.row.productCount + goodsDetail.subUnit }}
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
                            scope.row.productPieceCount +
                            goodsDetail.pieceUnit +
                            ")"
                          : "(" + scope.row.productPieceCount + "筐)"
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
                <el-table-column label="装筐数量" prop="loadBasketCount">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      style="color: #1a7fd9"
                      v-if="scope.row.loadBasketCount"
                      @click="useBasket()"
                    >
                      {{ scope.row.loadBasketCount }}个
                    </el-button>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table_count_styl">
                <span style="margin-right: 32px">合计</span>
                <span style="margin-right: 32px"
                  >批次数量:{{ goodsDetail.batchLoadCount }}个</span
                >
                <span style="margin-right: 32px"
                  >装筐数量:{{ goodsDetail.basketTotalCount }}个</span
                >
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
              装筐原因
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
      title="装筐数量详情"
      :visible.sync="usebasketDialog"
      width="30%"
      :before-close="handleClose"
    >
      <div>
        <div style="color: rgba(1, 6, 33, 0.9); font-size: 18px">
          {{ goodsDetail.productName }}|{{ goodsDetail.variety }}
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
                {{ goodsDetailList1.batchName | parseTime }}</span
              >
            </el-col>
            <el-col :span="12"
              ><span style="color: rgba(1, 6, 33, 0.55)">入库类型：</span
              ><span style="color: #1a7fd9">
                {{ goodsDetailList1.batchTypeName }}</span
              >
            </el-col>
          </el-row>
        </div>
        <div
          style="border-bottom: 1px solid #e9e9e9; padding: 14px 0px"
          v-if="goodsDetailList1.basketTotalCount > 0"
        >
          <div style="color: rgba(1, 6, 33, 0.55)">
            装筐种类{{ goodsDetail.basketTypeCount }}种 &nbsp; 数量{{
              goodsDetailList1.basketTotalCount
            }}个
          </div>
          <div v-for="(basketitem, index) in basketInfo" :key="index">
            <div style="color: rgba(1, 6, 33, 0.9); margin: 14px 0px">
              【{{ basketitem.basketType }}】{{ basketitem.userBasketName }}
            </div>
            <span style="margin-right: 80px"
              >[{{ basketitem.basketColor }}] 数量：{{
                basketitem.loadBasketCount
              }}个</span
            >
          </div>
        </div>
      </div>
    </el-dialog>
  </PageNoScroll>
</template>

<script>
import { productLoadDetail } from "@/request/api/commodityDetail/index";
export default {
  name: "packbasketDetails",
  data() {
    return {
      orderId: this.$route.query.id,
      goodsDetail: {},
      goodsDetailList: [],
      goodsDetailList1: {},
      basketInfo: {},
      usebasketDialog: false,
    };
  },
  methods: {
    productLoadDetail() {
      productLoadDetail({
        orderId: this.$route.query.id,
      }).then((res) => {
        this.goodsDetail = res.data[0];
        this.goodsDetailList = res.data[0].modelList;
        this.goodsDetailList1 = res.data[0].modelList[0];
        this.basketInfo = res.data[0].modelList[0].basketInfo;
      });
    },
    useBasket() {
      this.usebasketDialog = true;
    },
    handleClose() {
      this.usebasketDialog = false;
    },
  },
  created() {
    this.productLoadDetail();
  },
};
</script>

<style lang="scss">
.packbasketDetails {
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