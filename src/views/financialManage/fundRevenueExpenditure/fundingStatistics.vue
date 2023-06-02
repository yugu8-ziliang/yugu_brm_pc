<template>
  <!-- 资金统计 -->
  <PageNoScroll @hanleRefresh="hanleRefresh" class="fundingStatisticsModel">
    <el-scrollbar
      :style="{
        height: $store.getters.screenHeight - 190 + 'px',
      }"
    >
      <div class="fundingStatistics-border">
        <div class="fundingStatistics-top flex_dom flex_item_mid">
          <div class="fundingStatistics-left">收入</div>
          <div class="fundingStatistics-title">
            <div class="fundingStatistics-title1">总收入</div>
            <div class="fundingStatistics-title2">
              {{ tableData1.allIncome | intervalFormat(true)
              }}<span class="fundingStatistics-title3">万</span>
            </div>
          </div>
          <div class="fundingStatistics-right">
            <div class="fundingStatistics-title4">
              经营收入
              <span class="fundingStatistics-title5"
                >{{ tableData1.modelList[0].manageIncome | intervalFormat(true)
                }}<span class="fundingStatistics-title6">万</span></span
              >
            </div>
            <div class="fundingStatistics-title4">
              其他收入
              <span class="fundingStatistics-title5"
                >{{ tableData1.modelList[1].manageIncome | intervalFormat(true)
                }}<span class="fundingStatistics-title6">万</span></span
              >
            </div>
          </div>
        </div>
        <div
          class="fundingStatistics-middle flex_dom flex_item_mid"
          style="border-bottom: 1px solid rgba(233, 233, 233, 1)"
        >
          <div class="fundingStatistics-middle-back"></div>
          <div class="fundingStatistics-middle-left">
            {{ tableData1.modelList[0].title }}
          </div>

          <div
            class="flex_dom flex_item_mid"
            v-for="(item, index) in tableData1.modelList[0].modelList"
            :key="index"
          >
            <div class="lineH" v-if="index != 0"></div>
            <div class="fundingStatistics-middle-right">
              <div class="fundingStatistics-middle-right-title">
                {{ item.title }}
              </div>
              <div class="fundingStatistics-middle-right-title1">
                {{ item.orderIncome | intervalFormat(true)
                }}<span class="fundingStatistics-middle-right-title2">万</span>
              </div>
            </div>
          </div>
        </div>

        <div class="fundingStatistics-middle flex_dom flex_item_mid">
          <div class="fundingStatistics-middle-back"></div>
          <div class="fundingStatistics-middle-left">
            {{ tableData1.modelList[1].title }}
          </div>

          <div
            class="flex_dom flex_item_mid"
            v-for="(item, index) in tableData1.modelList[1].modelList"
            :key="index"
          >
            <div class="lineH" v-if="index != 0"></div>
            <div class="fundingStatistics-middle-right">
              <div class="fundingStatistics-middle-right-title">
                {{ item.title }}
              </div>
              <div class="fundingStatistics-middle-right-title1">
                {{ item.orderIncome | intervalFormat(true)
                }}<span class="fundingStatistics-middle-right-title2">万</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="fundingStatistics-border" style="margin-top: 50px">
        <div class="fundingStatistics-top flex_dom flex_item_mid">
          <div class="fundingStatistics-left">支出</div>
          <div class="fundingStatistics-title">
            <div class="fundingStatistics-title1">总支出</div>
            <div class="fundingStatistics-title2">
              {{ tableData2.allDisburse | intervalFormat(true)
              }}<span class="fundingStatistics-title3">万</span>
            </div>
          </div>
          <div class="fundingStatistics-right">
            <div class="fundingStatistics-title4">
              经营支出
              <span class="fundingStatistics-title5"
                >{{
                  tableData2.modelList[0].manageDisburse | intervalFormat(true)
                }}<span class="fundingStatistics-title6">万</span></span
              >
            </div>
            <div class="fundingStatistics-title4">
              其他支出
              <span class="fundingStatistics-title5"
                >{{
                  tableData2.modelList[1].manageDisburse | intervalFormat(true)
                }}<span class="fundingStatistics-title6">万</span></span
              >
            </div>
          </div>
        </div>
        <div
          class="fundingStatistics-middle flex_dom flex_item_mid"
          style="border-bottom: 1px solid rgba(233, 233, 233, 1)"
        >
          <div class="fundingStatistics-middle-back"></div>
          <div class="fundingStatistics-middle-left">
            {{ tableData2.modelList[0].title }}
          </div>

          <div
            class="flex_dom flex_item_mid"
            v-for="(item, index) in tableData2.modelList[0].modelList"
            :key="index"
          >
            <div class="lineH" v-if="index != 0"></div>
            <div class="fundingStatistics-middle-right">
              <div class="fundingStatistics-middle-right-title">
                {{ item.title }}
              </div>
              <div class="fundingStatistics-middle-right-title1">
                {{ item.orderDisburse | intervalFormat(true)
                }}<span class="fundingStatistics-middle-right-title2">万</span>
              </div>
            </div>
          </div>
        </div>

        <div class="fundingStatistics-middle flex_dom flex_item_mid">
          <div class="fundingStatistics-middle-back"></div>
          <div class="fundingStatistics-middle-left">
            {{ tableData2.modelList[1].title }}
          </div>

          <div
            class="flex_dom flex_item_mid"
            v-for="(item, index) in tableData2.modelList[1].modelList"
            :key="index"
          >
            <div class="lineH" v-if="index != 0"></div>
            <div class="fundingStatistics-middle-right">
              <div class="fundingStatistics-middle-right-title">
                {{ item.title }}
              </div>
              <div class="fundingStatistics-middle-right-title1">
                {{ item.orderDisburse | intervalFormat(true)
                }}<span class="fundingStatistics-middle-right-title2">万</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </el-scrollbar>
  </PageNoScroll>
</template>
  <script>
import { moneyStatistics } from "@/request/api/financialManage/index";
export default {
  name: "fundingStatistics",
  components: {},
  data() {
    return {
      tableData1: {
        modelList: [{ manageIncome: 0 }, { manageIncome: 0 }],
      },
      tableData2: { modelList: [{ manageIncome: 0 }, { manageIncome: 0 }] },
    };
  },
  computed: {
    operatingIncome() {
      let param = this.$store.getters.userInfo;
      // 经营户 1
      if (param.usertype == 6 || param.usertype == 7) {
        return [
          { name: "已收商品销售款" },
          // { name: "筐子售出款" },
          { name: "已收筐子售出款" },
          { name: "已收商品退款" },
          { name: "已收筐子退款" },
          { name: "已收往来款" },
        ];
      }
      // 供货商 2
      if (param.usertype == 10 || param.usertype == 11) {
        return [
          { name: "已收商品销售款" },
          // { name: "筐子售出款" },
          { name: "已收筐子售出款" },
          { name: "已收商品退款" },
          { name: "已收筐子退款" },
          { name: "已收往来款" },
        ];
      }
      // 采购商
      if (param.usertype == 3 || param.usertype == 4) {
        // 生鲜超市 3
        if (param.purchaseType == 2) {
          return [
            { name: "已收销售记账" },
            { name: "已收配送收入" },
            { name: "已收筐子售出款" },
            { name: "已收商品退款" },
            { name: "已收筐子退款" },
            { name: "已收往来款" },
          ];
        }
        // 农贸市场 4
        if (param.purchaseType == 3) {
          return [
            { name: "已收销售记账" },
            // { name: "筐子售出款" },
            { name: "已收筐子售出款" },
            { name: "已收商品退款" },
            { name: "已收筐子退款" },
            { name: "已收往来款" },
          ];
        }
        // 食堂饭店 5
        if (param.purchaseType == 1) {
          return [
            { name: "已收菜品记账" },
            // { name: "筐子售出款" },
            { name: "已收筐子售出款" },
            { name: "已收商品退款" },
            { name: "已收筐子退款" },
            { name: "已收往来款" },
          ];
        }
      }
    },
    otherIncome() {
      let param = this.$store.getters.userInfo;
      // 经营户 1
      if (param.usertype == 6 || param.usertype == 7) {
        return [
          { name: "已收预收款" },
          { name: "已收借款" },
          { name: "已收其他" },
          { name: "已收归还预付款" },
          { name: "已收归还借款" },
        ];
      }
      // 供货商 2
      if (param.usertype == 10 || param.usertype == 11) {
        return [
          { name: "已收预收款" },
          { name: "已收借款" },
          { name: "已收其他" },
          // { name: "归还预付款" },
          { name: "已收归还借款" },
        ];
      }
      // 采购商
      if (param.usertype == 3 || param.usertype == 4) {
        // 生鲜超市 3
        if (param.purchaseType == 2) {
          return [
            // { name: "借款" },
            { name: "已收借款" },
            { name: "已收其他" },
            { name: "已收归还预付款" },
            { name: "已收归还借款" },
          ];
        }
        // 农贸市场 4
        if (param.purchaseType == 3) {
          return [
            // { name: "借款" },
            { name: "已收借款" },
            { name: "已收其他" },
            { name: "已收归还预付款" },
            { name: "已收归还借款" },
          ];
        }
        // 食堂饭店 5
        if (param.purchaseType == 1) {
          return [
            // { name: "借款" },
            { name: "已收借款" },
            { name: "已收其他" },
            { name: "已收归还预付款" },
            { name: "已收归还借款" },
          ];
        }
      }
    },
    operatingExpenses() {
      let param = this.$store.getters.userInfo;
      // 经营户 1
      if (param.usertype == 6 || param.usertype == 7) {
        return [
          { name: "已付商品采购款" },
          { name: "已付筐子购入款" },
          { name: "已付商品退款" },
          { name: "已付筐子退款" },
          { name: "已付往来款" },
        ];
      }
      // 供货商 2
      if (param.usertype == 10 || param.usertype == 11) {
        return [
          { name: "已付商品采购款" },
          { name: "已付筐子购入款" },
          { name: "已付商品退款" },
          { name: "已付筐子退款" },
          { name: "已付往来款" },
        ];
      }
      // 采购商
      if (param.usertype == 3 || param.usertype == 4) {
        // 生鲜超市 3
        if (param.purchaseType == 2) {
          return [
            { name: "已付商品采购款" },
            { name: "已付筐子购入款" },
            { name: "已付商品退款" },
            { name: "已付筐子退款" },
            { name: "已付往来款" },
          ];
        }
        // 农贸市场 4
        if (param.purchaseType == 3) {
          return [
            { name: "已付商品采购款" },
            { name: "已付筐子购入款" },
            // { name: "筐子退款" },
            { name: "已付筐子退款" },
            { name: "已付往来款" },
          ];
        }
        // 食堂饭店 5
        if (param.purchaseType == 1) {
          return [
            { name: "已付商品采购款" },
            { name: "已付筐子购入款" },
            // { name: "筐子退款" },
            { name: "已付筐子退款" },
            { name: "已付往来款" },
          ];
        }
      }
    },
    otherExpenses() {
      let param = this.$store.getters.userInfo;
      // 经营户 1
      if (param.usertype == 6 || param.usertype == 7) {
        return [
          { name: "已付预收款" },
          { name: "已付借款" },
          { name: "已付其他" },
          { name: "已付归还预付款" },
          { name: "已付归还借款" },
        ];
      }
      // 供货商 2
      if (param.usertype == 10 || param.usertype == 11) {
        return [
          // { name: "预付款" },
          { name: "已付借款" },
          { name: "已付其他" },
          { name: "已付归还预付款" },
          { name: "已付归还借款" },
        ];
      }
      // 采购商
      if (param.usertype == 3 || param.usertype == 4) {
        // 生鲜超市 3
        if (param.purchaseType == 2) {
          return [
            { name: "已付预收款" },
            { name: "已付借款" },
            { name: "已付其他" },
            // { name: "归还预付款" },
            { name: "已付归还借款" },
          ];
        }
        // 农贸市场 4
        if (param.purchaseType == 3) {
          return [
            { name: "已付预收款" },
            { name: "已付借款" },
            { name: "已付其他" },
            // { name: "归还预付款" },
            { name: "已付归还借款" },
          ];
        }
        // 食堂饭店 5
        if (param.purchaseType == 1) {
          return [
            { name: "已付预收款" },
            { name: "已付借款" },
            { name: "已付其他" },
            // { name: "归还预付款" },
            { name: "已付归还借款" },
          ];
        }
      }
    },
  },
  methods: {
    getList() {
      let param = {
        timestamp: "",
      };
      moneyStatistics(param).then((res) => {
        if (res.status == 200) {
          this.tableData1 = res.data[0];
          this.tableData2 = res.data[1];
        }
      });
    },
    // 刷新
    hanleRefresh() {
      this.getList();
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style scoped lang="scss">
.fundingStatisticsModel {
  .fundingStatistics-border {
    border: 1px solid rgba(233, 233, 233, 1);

    .fundingStatistics-top {
      background: rgba(0, 0, 0, 0.04);
      padding: 10px;
      height: 80px;
      .fundingStatistics-left {
        margin-left: 10px;
        font-size: 20px;
        color: rgba(1, 6, 33, 0.9);
        width: 140px;
      }
      .fundingStatistics-title {
        width: 145px;
        .fundingStatistics-title1 {
          color: rgba(1, 6, 33, 0.55);
          font-size: 16px;
        }
        .fundingStatistics-title2 {
          font-size: 24px;
          color: rgba(1, 6, 33, 0.9);
        }
        .fundingStatistics-title3 {
          font-size: 16px;
          color: rgba(1, 6, 33, 0.9);
        }
      }

      .fundingStatistics-right {
        padding-left: 20px;
        .fundingStatistics-title4 {
          font-size: 14px;
          color: rgba(26, 127, 217, 1);
          line-height: 30px;
          .fundingStatistics-title5 {
            padding-left: 30px;
          }
        }
      }
    }

    .fundingStatistics-middle {
      background: rgba(255, 255, 255, 1);
      padding: 10px;
      height: 80px;

      .fundingStatistics-middle-back {
        margin-left: 10px;
        width: 8px;
        height: 8px;
        background: rgba(0, 164, 153, 1);
        border-radius: 50%;
      }
      .fundingStatistics-middle-left {
        margin-left: 10px;
        font-size: 20px;
        color: rgba(1, 6, 33, 0.9);
        width: 120px;
      }

      .fundingStatistics-middle-right {
        width: 150px;
        .fundingStatistics-middle-right-title {
          font-size: 14px;
          color: rgba(1, 6, 33, 0.55);
        }
        .fundingStatistics-middle-right-title1 {
          font-size: 24px;
          color: rgba(1, 6, 33, 0.9);
        }
        .fundingStatistics-middle-right-title2 {
          font-size: 16px;
          color: rgba(1, 6, 33, 0.9);
        }
      }

      .lineH {
        margin: 0px 20px 0px 10px;
        width: 1px;
        height: 34px;
        background: rgba(1, 6, 33, 0.35);
      }
    }
  }

  ::v-deep .el-scrollbar {
    .el-scrollbar__wrap {
      overflow-x: hidden;
      .el-scrollbar__view {
        position: relative;
        padding: 0px !important;
      }
    }
  }
}
</style>

<style lang="scss">
.fundingStatisticsModel {
  .el-scrollbar__view {
    min-width: 1280px !important;
  }
}
</style>