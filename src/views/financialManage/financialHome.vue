<template>
  <!-- 财务首页 -->
  <Container
    @refresh="hanleRefresh"
    v-loading="loading"
    class="financialHomeModel"
  >
    <div>
      <div
        class="flex_dom flex_item_mid flex_item_between"
        style="border-bottom: 1px solid #e9e9e9; padding-bottom: 10px"
      >
        <div class="flex_dom flex_item_mid">
          <span
            style="
              margin-right: 10px;
              color: rgba(1, 6, 33, 0.9);
              font-size: 16px;
              font-weight: 700;
            "
            >交易</span
          >
          <el-date-picker
            @change="checkedtime"
            size="small"
            style="width: 280px"
            v-model="form.datep"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
          >
          </el-date-picker>
        </div>
        <div class="flex_dom flex_item_mid">
          <div class="flex_dom flex_item_mid">
            <span class="borR1"></span>
            <span
              style="
                margin-right: 10px;
                color: rgba(1, 6, 33, 0.9);
                font-size: 14px;
              "
              >销售额</span
            >
            <span
              style="
                margin-right: 5px;
                color: rgba(1, 6, 33, 0.9);
                font-size: 14px;
              "
              >{{ currencyFormat(topMsg.salesAmount) }}元</span
            >
            <el-tooltip placement="bottom">
              <div slot="content">
                <div style="font-size: 14px; margin-bottom: 5px">
                  商品销售金额
                  <span style="margin-left: 16px"
                    >{{ currencyFormat(topMsg.goodsSell) }}元</span
                  >
                </div>
                <div style="font-size: 14px; margin-bottom: 5px">
                  记账-未收货款
                  <span style="margin-left: 16px"
                    >{{ currencyFormat(topMsg.goodsSellNote) }}元</span
                  >
                </div>
                <div style="font-size: 14px; margin-bottom: 5px">
                  筐子销售金额
                  <span style="margin-left: 16px"
                    >{{ currencyFormat(topMsg.basketSell) }}元</span
                  >
                </div>
                <div style="font-size: 14px; margin-bottom: 5px">
                  记账-未收筐子款
                  <span style="margin-left: 16px"
                    >{{ currencyFormat(topMsg.basketSellNote) }}元</span
                  >
                </div>
              </div>
              <i
                class="el-icon-warning-outline"
                style="font-size: 18px; color: var(--color-primary)"
              ></i>
            </el-tooltip>
          </div>
          <div class="lineH"></div>
          <div class="flex_dom flex_item_mid">
            <span class="borR2"></span
            ><span
              style="
                margin-right: 10px;
                color: rgba(1, 6, 33, 0.9);
                font-size: 14px;
              "
              >采购额</span
            >
            <span
              style="
                margin-right: 5px;
                color: rgba(1, 6, 33, 0.9);
                font-size: 14px;
              "
              >{{ currencyFormat(topMsg.purchaseAmount) }}元</span
            >
            <el-tooltip placement="bottom">
              <div slot="content">
                <div style="font-size: 14px; margin-bottom: 5px">
                  商品采购金额
                  <span style="margin-left: 16px"
                    >{{ currencyFormat(topMsg.goodsBuy) }}元</span
                  >
                </div>
                <div style="font-size: 14px; margin-bottom: 5px">
                  记账-未付货款
                  <span style="margin-left: 16px"
                    >{{ currencyFormat(topMsg.goodsBuyNote) }}元</span
                  >
                </div>
                <div style="font-size: 14px; margin-bottom: 5px">
                  筐子采购款金额
                  <span style="margin-left: 16px"
                    >{{ currencyFormat(topMsg.basketBuy) }}元</span
                  >
                </div>
                <div style="font-size: 14px; margin-bottom: 5px">
                  记账-未付筐子款
                  <span style="margin-left: 16px"
                    >{{ currencyFormat(topMsg.basketBuyNote) }}元</span
                  >
                </div>
              </div>
              <i
                class="el-icon-warning-outline"
                style="font-size: 18px; color: var(--color-primary)"
              ></i>
            </el-tooltip>
          </div>
        </div>
      </div>
      <div style="padding: 10px 0px">
        <div id="deal" style="width: 100%; height: 200px"></div>
      </div>
    </div>
    <div
      class="padbg15"
      style="width: 33%; height: 300px; margin-top: 15px; float: left"
    >
      <el-row>
        <el-col :span="20">利润</el-col>
        <el-col :span="4"><el-button type="text">查看更多></el-button></el-col>
      </el-row>
      <el-row>
        <el-col :span="20">
          <div style="height: 240px">
            <div style="margin: 40px 0px 20px 30px">
              <i
                class="el-icon-remove"
                style="
                  background-color: #60a669;
                  color: #60a669;
                  border-radius: 50%;
                "
              ></i>
              商品利润&nbsp;&nbsp;{{
                currencyFormat(bottomMsg.commodityProfit)
              }}
            </div>
            <div style="margin: 20px 0px 20px 30px">
              <i
                class="el-icon-remove"
                style="
                  background-color: #bae637;
                  color: #bae637;
                  border-radius: 50%;
                "
              ></i>
              实际经营利润&nbsp;&nbsp;{{
                currencyFormat(bottomMsg.operatingProfit)
              }}
            </div>
            <div
              :style="
                'height:25px;background-color:#60A669;margin:30px;width:' +
                jisuan.nums1 +
                '%;'
              "
            ></div>
            <div
              :style="
                'height:25px;background-color:#BAE637;margin:30px;width:' +
                jisuan.nums2 +
                '%;'
              "
            ></div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div
      class="padbg15"
      style="width: 66%; height: 300px; margin-top: 15px; float: right"
    >
      <el-row>
        <el-col :span="20">资金收支</el-col>
        <el-col :span="4"><el-button type="text">查看更多></el-button></el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="11">
          <div style="height: 240px">
            <div style="margin: 40px 0px 20px 30px">
              <i
                class="el-icon-remove"
                style="
                  background-color: #eb7975;
                  color: #eb7975;
                  border-radius: 50%;
                "
              ></i>
              资金收入(近1年)&nbsp;&nbsp;{{
                currencyFormat(bottomMsg.income)
              }}元
            </div>
            <div style="margin: 20px 0px 20px 30px">
              <i
                class="el-icon-remove"
                style="
                  background-color: #409ee6;
                  color: #409ee6;
                  border-radius: 50%;
                "
              ></i>
              资金支出(近1年)&nbsp;&nbsp;{{
                currencyFormat(bottomMsg.expenditure)
              }}元
            </div>
            <div
              :style="
                'height:25px;background-color:#EB7975;margin:30px;width:' +
                jisuan.nums3 +
                '%;'
              "
            ></div>
            <div
              :style="
                'height:25px;background-color:#409EE6;margin:30px;width:' +
                jisuan.nums4 +
                '%;'
              "
            ></div>
          </div>
        </el-col>
        <el-col :span="11">
          <div style="height: 240px">
            <div style="margin: 40px 0px 20px 30px">
              <i
                class="el-icon-remove"
                style="
                  background-color: #eb7975;
                  color: #eb7975;
                  border-radius: 50%;
                "
              ></i>
              今日收入&nbsp;&nbsp;{{ currencyFormat(bottomMsg.incomeToday) }}元
            </div>
            <div style="margin: 20px 0px 20px 30px">
              <i
                class="el-icon-remove"
                style="
                  background-color: #409ee6;
                  color: #409ee6;
                  border-radius: 50%;
                "
              ></i>
              今日支出&nbsp;&nbsp;{{
                currencyFormat(bottomMsg.expenditureToday)
              }}元
            </div>
            <div
              :style="
                'height:25px;background-color:#EB7975;margin:30px;width:' +
                jisuan.nums5 +
                '%;'
              "
            ></div>
            <div
              :style="
                'height:25px;background-color:#409EE6;margin:30px;width:' +
                jisuan.nums6 +
                '%;'
              "
            ></div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div
      class="padbg15"
      style="width: 100%; height: 100px; margin-top: 15px; float: left"
    >
      <el-row>
        <el-col :span="6">
          <p>待收款金额</p>
          <el-button @click="toPage(1)" style="border: none; padding-left: 0px"
            ><p style="font-size: 30px">
              {{ currencyFormat(bottomMsg.toBeReceived) }}元>
            </p></el-button
          >
        </el-col>
        <el-col :span="6" style="color: #dd4c4d">
          <p>订单未付</p>
          <el-button
            @click="toPage(2)"
            style="border: none; padding-left: 0px; color: #dd4c4d"
            ><p style="font-size: 30px">
              {{ currencyFormat(bottomMsg.unpaid) }}元>
            </p></el-button
          >
        </el-col>
        <el-col :span="6" style="color: #1a7fd9">
          <p>订单未收</p>
          <el-button
            @click="toPage(1)"
            style="border: none; padding-left: 0px; color: #1a7fd9"
            ><p style="font-size: 30px">
              {{ currencyFormat(bottomMsg.uncollection) }}元>
            </p></el-button
          >
        </el-col>
      </el-row>
    </div>
  </Container>
</template>
<script>
import { topdata, bottomdata } from "@/request/api/financialManage/fistPage.js";
import * as echarts from "echarts";
import {
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
} from "echarts/components";
import { LineChart } from "echarts/charts";
import { UniversalTransition } from "echarts/features";
import { CanvasRenderer } from "echarts/renderers";
echarts.use([
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition,
]);
export default {
  name: "financialHome",
  data() {
    return {
      jisuan: {
        nums1: "",
        nums2: "",
        nums3: "",
        nums4: "",
        nums5: "",
        nums6: "",
      },
      echartsData1: [],
      echartsData2: [],
      echarsTime: [],
      loading: true,
      form: {
        datep: [],
        startConfirmTimestamp: "",
        endConfirmTimestamp: "",
      },
      topMsg: {},
      bottomMsg: {},
    };
  },
  methods: {
    toPage(type) {
      let param = this.$store.getters.userInfo;
      if (type == 1) {
        if (
          param.usertype == 6 ||
          param.usertype == 7 ||
          param.usertype == 10 ||
          param.usertype == 11
        ) {
          this.$router.push({ path: "/orderManagement/commoditySalesOrder" });
        } else {
          this.$router.push({ path: "/orderManagement/basketBuy" });
        }
      } else if (type == 2) {
        this.$router.push({
          path: "receivePayment",
          query: { data: "paidCommodityView" },
        });
      }
    },
    dealechars(val1, val2, val3) {
      var chartDom = document.getElementById("deal");
      var myChart = echarts.init(chartDom);
      var option;
      option = {
        tooltip: {
          trigger: "axis",
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "category",
          boundaryGap: false,
          data: val1,
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            name: "销售额",
            type: "line",
            stack: "Total",
            data: val2,
          },
          {
            name: "采购额",
            type: "line",
            stack: "Total",
            data: val3,
          },
        ],
      };
      option && myChart.setOption(option);
    },
    currencyFormat(num) {
      let a = Number(num)
        .toFixed(2)
        .toString()
        .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      return a;
    },
    checkedtime(value) {
      this.form.startConfirmTimestamp = value[0] / 1000;
      this.form.endConfirmTimestamp = value[1] / 1000;
      this.getList();
    },
    getList(arg) {
      let res = {
        startConfirmTimestamp: this.form.startConfirmTimestamp,
        endConfirmTimestamp: this.form.endConfirmTimestamp,
      };
      topdata(res).then((resp) => {
        // console.log(resp.data[0])
        this.topMsg = resp.data[0];
        this.echarsTime = this.topMsg.chart.map((item) => {
          return item.datatime;
        });
        this.echartsData1 = this.topMsg.chart.map((item) => {
          return item.salesAmount;
        });
        this.echartsData2 = this.topMsg.chart.map((item) => {
          return item.purchaseAmount;
        });
        this.dealechars(this.echarsTime, this.echartsData1, this.echartsData2);
      });
      bottomdata().then((resp) => {
        this.bottomMsg = resp.data[0];
        // console.log(this.bottomMsg)
        let obj = this.bottomMsg;
        this.getRatio(obj);
        this.loading = false;
      });
    },
    getRatio(val) {
      if (val.commodityProfit <= 0) {
        this.jisuan.nums1 = 1;
        if (val.operatingProfit <= 0) {
          this.jisuan.nums2 = 1;
        } else {
          this.jisuan.nums2 = 100;
        }
      } else {
        if (val.operatingProfit <= 0) {
          this.jisuan.nums1 = 100;
          this.jisuan.nums2 = 1;
        } else {
          if (val.commodityProfit == val.operatingProfit) {
            this.jisuan.nums1 = 50;
            this.jisuan.nums2 = 50;
          } else {
            if (val.commodityProfit > val.operatingProfit) {
              this.jisuan.nums1 = 100;
              this.jisuan.nums2 =
                (val.operatingProfit /
                  (val.operatingProfit + val.commodityProfit)) *
                  100 >
                1
                  ? (val.operatingProfit /
                      (val.operatingProfit + val.commodityProfit)) *
                    100
                  : 1;
            } else {
              this.jisuan.nums2 = 100;
              this.jisuan.nums1 =
                (val.commodityProfit /
                  (val.operatingProfit + val.commodityProfit)) *
                  100 >
                1
                  ? (val.commodityProfit /
                      (val.operatingProfit + val.commodityProfit)) *
                    100
                  : 1;
            }
          }
        }
      }
      if (val.income == 0) {
        this.jisuan.nums3 = 1;
        if (val.expenditure == 0) {
          this.jisuan.nums4 = 1;
        } else {
          this.jisuan.nums4 = 100;
        }
      } else {
        if (val.expenditure == 0) {
          this.jisuan.nums4 = 1;
          this.jisuan.nums3 = 100;
        } else {
          if (val.income == val.expenditure) {
            this.jisuan.nums3 = 50;
            this.jisuan.nums4 = 50;
          } else {
            if (val.income > val.expenditure) {
              this.jisuan.nums3 = 100;
              this.jisuan.nums4 =
                (val.expenditure / (val.income + val.expenditure)) * 100 > 1
                  ? (val.expenditure / (val.income + val.expenditure)) * 100
                  : 1;
            } else {
              this.jisuan.nums4 = 100;
              this.jisuan.nums3 =
                (val.income / (val.income + val.expenditure)) * 100 > 1
                  ? (val.income / (val.income + val.expenditure)) * 100
                  : 1;
            }
          }
        }
      }
      if (val.incomeToday == 0) {
        this.jisuan.nums5 = 1;
        if (val.expenditureToday == 0) {
          this.jisuan.nums6 = 1;
        } else {
          this.jisuan.nums6 = 100;
        }
      } else {
        if (val.expenditureToday == 0) {
          this.jisuan.nums6 = 1;
          this.jisuan.nums5 = 100;
        } else {
          if (val.incomeToday == val.expenditureToday) {
            this.jisuan.nums5 = 50;
            this.jisuan.nums6 = 50;
          } else {
            if (val.incomeToday > val.expenditureToday) {
              this.jisuan.nums5 = 100;
              this.jisuan.nums6 =
                (val.expenditureToday /
                  (val.incomeToday + val.expenditureToday)) *
                  100 >
                1
                  ? (val.expenditureToday /
                      (val.incomeToday + val.expenditureToday)) *
                    100
                  : 1;
            } else {
              this.jisuan.nums6 = 100;
              this.jisuan.nums5 =
                (val.incomeToday / (val.incomeToday + val.expenditureToday)) *
                  100 >
                1
                  ? (val.income / (val.incomeToday + val.expenditureToday)) *
                    100
                  : 1;
            }
          }
        }
      }
      console.log(this.jisuan);
    },
    //刷新
    hanleRefresh() {
      this.getList(1);
    },
  },
  mounted() {
    this.getList(1);
  },
};
</script>

<style lang="scss" scoped>
.financialHomeModel {
  .padbg15 {
    background: #fff;
    padding: 15px;
  }
  .borR1 {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #409ee6;
    margin-right: 8px;
  }
  .borR2 {
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #bae637;
    margin-right: 8px;
  }

  .lineH {
    width: 1px;
    height: 23px;
    background: rgba(1, 6, 33, 0.35);
    margin: 0px 20px;
  }

  ::v-deep .el-date-editor .el-range-separator {
    padding: 0 0px !important;
    width: 10% !important;
  }
}
</style>
