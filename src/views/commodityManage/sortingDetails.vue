<template>
  <!-- 分拣单详情 -->
  <PageNoScroll class="sortingDetails">
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
          <el-descriptions-item label="分拣单编号">{{
            goodsDetail.productSortId
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
              <div style="color: rgba(1, 6, 33, 0.9); font-size: 17px">
                {{ goodsDetail.categoryName }}|{{ goodsDetail.variety }}
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
                :data="batchSortInfo"
                style="border-top: 1px solid #e9e9e9"
              >
                <el-table-column label="编号" type="index" width="80">
                </el-table-column>
                <el-table-column label="入库时间" prop="productIdBatchName">
                  <template slot-scope="scope">
                    {{ scope.row.productIdBatchName | parseTime }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="入库类型"
                  prop="productIdBatchType"
                  style="color: #1a7fd9"
                >
                </el-table-column>
                <el-table-column label="分拣前库存" prop="beforeProductCount">
                  <template slot-scope="scope">
                    {{ scope.row.beforeProductCount + goodsDetail.subUnit }}
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
                            scope.row.beforeUnitCount +
                            goodsDetail.pieceUnit +
                            ")"
                          : "(" + scope.row.beforeUnitCount + "筐)"
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
                <el-table-column label="分拣后库存" prop="afterProductCount">
                  <template slot-scope="scope">
                    {{ scope.row.afterProductCount + goodsDetail.subUnit }}
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
                            scope.row.afterUnitCount +
                            goodsDetail.pieceUnit +
                            ")"
                          : "(" + scope.row.afterUnitCount + "筐)"
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
                      >筐
                    </font>
                  </template>
                </el-table-column>
                <el-table-column label="分拣数量" prop="sortProductCount">
                  <template slot-scope="scope">
                    {{ scope.row.sortProductCount }}{{ goodsDetail.subUnit }}
                  </template>
                </el-table-column>
                <el-table-column label="入库成本单价" prop="sortProductCost">
                  <template slot-scope="scope">
                    {{ moneyFormatTwo(scope.row.sortProductCost) }}元/斤
                  </template>
                </el-table-column>
                <el-table-column label="分拣成本" prop="sortProductTotalCost">
                  <template slot-scope="scope">
                    {{ moneyFormatTwo(scope.row.sortProductTotalCost) }}元
                  </template>
                </el-table-column>
                <el-table-column label="腾空筐子" prop="sortBasketCount">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      style="color: #1a7fd9"
                      v-if="scope.row.sortBasketCount"
                      @click="useBasket()"
                    >
                      {{ scope.row.sortBasketCount }}个
                    </el-button>
                    <span v-else>--</span>
                  </template>
                </el-table-column>
              </el-table>
              <div class="table_count_styl">
                <span style="margin-right: 32px">合计</span>
                <span style="margin-right: 32px"
                  >批次数量:{{ goodsDetail.productBatchCount }}个</span
                >
                <span style="margin-right: 32px">
                  分拣总量:{{ goodsDetail.productTotalCount
                  }}{{ goodsDetail.subUnit }}
                </span>
                <span style="margin-right: 32px"
                  >分拣成本总额:{{
                    moneyFormatTwo(goodsDetail.sortProductCost)
                  }}元</span
                >
                <span>腾空筐子:{{ goodsDetail.emptyBasketCount }}个</span>
              </div>
            </div>
          </div>

          <div
            style="
              font-size: 18px;
              color: rgba(1, 6, 33, 0.9);
              font-weight: 600;
              margin: 20px 0px 10px;
            "
          >
            新商品信息
          </div>
          <div style="padding: 10px">
            <div class="flex_dom flex_item_between flex_item_mid">
              <div style="color: rgba(1, 6, 33, 0.9); font-size: 17px">
                {{ goodsDetail.newCategoryName }}|{{ goodsDetail.newVariety }}
              </div>
            </div>
            <div style="padding: 16px 0px 12px">
              <el-row>
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.55)">产地：</span
                  ><span style="color: rgba(1, 6, 33, 0.9)">
                    {{ goodsDetail.newRegionName }}</span
                  >
                </el-col>
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.55)">级别/规格：</span
                  ><span style="color: rgba(1, 6, 33, 0.9)">
                    {{ goodsDetail.newSpec }}</span
                  >
                </el-col>
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.55)">计算单位：</span
                  ><span style="color: rgba(1, 6, 33, 0.9)">
                    {{ goodsDetail.newSubUnit }}</span
                  >
                </el-col>
              </el-row>
              <el-row style="margin: 16px 0px">
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.9)"
                    >入库成本总额：
                    <img
                      style="width: 14px; height: 14px"
                      src="@/assets/image/imgs/question-circle@2x.png"
                      alt=""
                    />
                    {{ goodsDetail.newProductTotalCost }}元</span
                  >
                </el-col>
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.9)"
                    >入库数量：
                    {{ goodsDetail.newProductCount + goodsDetail.newSubUnit }}
                  </span>
                </el-col>
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.9)"
                    >入库成本单价：{{ goodsDetail.newProductCost }}元/斤</span
                  >
                </el-col>
              </el-row>
              <el-row>
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.55)"
                    >使用自家筐子：</span
                  >
                  <el-button
                    style="color: #1a7fd9"
                    type="text"
                    @click="usemyBasket()"
                  >
                    {{ goodsDetail.newProductBasketCount }}个</el-button
                  >
                </el-col>
              </el-row>
            </div>
          </div>

          <div style="border-top: 1px solid #e9e9e9">
            <div
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 18px;
                font-weight: 700;
                padding-right: 15px;
                margin: 16px 0px;
              "
            >
              分拣原因
            </div>
            <div style="padding: 10px 0px">
              {{ goodsDetail.remark }}
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>

    <!-- 使用自家筐子弹窗 -->
    <el-dialog
      title="使用自家筐子"
      :visible.sync="usemybasketDialog"
      width="30%"
      :before-close="handleClose"
    >
      <div>
        <div style="color: rgba(1, 6, 33, 0.9); font-size: 17px">
          {{ goodsDetail.newProductName }}|{{ goodsDetail.newVariety }}
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
                {{ goodsDetail.newRegionName }}</span
              >
            </el-col>
            <el-col :span="9"
              ><span style="color: rgba(1, 6, 33, 0.55)">级别/规格：</span
              ><span style="color: rgba(1, 6, 33, 0.9)">
                {{ goodsDetail.newSpec }}</span
              >
            </el-col>
          </el-row>
          <el-row style="margin-bottom: 16px">
            <el-col :span="12"
              ><span style="color: rgba(1, 6, 33, 0.55)">入库时间：</span
              ><span style="color: rgba(1, 6, 33, 0.9)">
                {{ goodsDetail.productIdBatchName | parseTime }}</span
              >
            </el-col>
            <el-col :span="12"
              ><span style="color: rgba(1, 6, 33, 0.55)">入库类型：</span
              ><span style="color: #1a7fd9"> </span>
            </el-col>
          </el-row>
        </div>
        <div
          style="border-bottom: 1px solid #e9e9e9; padding: 14px 0px"
          v-if="goodsDetail.selfBasketCount > 0"
        >
          <div style="color: rgba(1, 6, 33, 0.9)">
            使用自家筐子{{ goodsDetail.floatTypeCount }}种 &nbsp; 数量{{
              goodsDetail.floatBasketCount
            }}个
          </div>
          <div
            v-for="(basketitem, index) in conProduct.basketInfo"
            :key="index"
          >
            <div style="color: rgba(1, 6, 33, 0.9); margin: 14px 0px">
              【{{ basketitem.basketType }}】{{ basketitem.basketName }}
            </div>
            <span style="margin-right: 80px"
              >[{{ basketitem.basketColor }}] 数量：{{
                basketitem.useCount
              }}个</span
            >
          </div>
        </div>
      </div>
    </el-dialog>

    <!-- 腾空筐子弹窗 -->
    <el-dialog
      title="腾空筐子"
      :visible.sync="usebasketDialog"
      width="30%"
      :before-close="handleClose"
    >
      <div>
        <div style="color: rgba(1, 6, 33, 0.9); font-size: 17px">
          {{ goodsDetail.classifyName }}|{{ goodsDetail.variety }}
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
                {{ sortBasketInfoList.productIdBatchName | parseTime }}</span
              >
            </el-col>
            <el-col :span="12"
              ><span style="color: rgba(1, 6, 33, 0.55)">入库类型：</span
              ><span style="color: #1a7fd9">
                {{ sortBasketInfoList.sourceName }}</span
              >
            </el-col>
          </el-row>
        </div>
        <div style="padding: 14px 0px">
          <div style="color: rgba(1, 6, 33, 0.9)">
            腾空筐子{{ sortBasketInfo.length }}种 &nbsp; 数量{{
              sortBasketInfoList.vacateNums
            }}个
          </div>
          <div v-for="(basketitem, index) in basketInfo" :key="index">
            <div style="color: rgba(1, 6, 33, 0.9); margin: 14px 0px">
              【{{ basketitem.basketType }}】{{ basketitem.basketName }}
            </div>
            <span style="margin-right: 80px"
              >[{{ basketitem.basket }}] 数量：{{
                basketitem.vacateNums
              }}个</span
            >
          </div>
        </div>
      </div>
    </el-dialog>
  </PageNoScroll>
</template>

<script>
import { productSortDetail } from "@/request/api/commodityDetail/index";
export default {
  name: "sortingDetails",
  data() {
    return {
      productSortId: this.$route.query.id,
      goodsDetail: {}, //新商品信息
      sortBasketInfoList: {},
      sortBasketInfo: [],
      // batchSortInfo: [], //批次列表
      conProduct: 0,
      usebasketDialog: false,
      usemybasketDialog: false,
    };
  },
  methods: {
    productSortDetail() {
      productSortDetail({
        productSortId: this.$route.query.id,
      }).then((res) => {
        // this.conProduct=res.data[0].conProductInfo;
        this.goodsDetail = res.data[0];
        // this.batchSortInfo = res.data[0].batchSortInfo; //批次列表
        this.sortBasketInfo = res.data[0].batchSortInfo[0].sortBasketInfo;
        this.sortBasketInfoList =
          res.data[0].batchSortInfo[0].sortBasketInfo[0]; //批次信息
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
    usemyBasket() {
      this.usemybasketDialog = true;
    },
    handleClose() {
      this.usebasketDialog = false;
      this.usemybasketDialog = false;
    },
  },
  created() {
    this.productSortDetail();
  },
};
</script>

<style lang="scss">
.sortingDetails {
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