<template>
  <!-- 筐子进出库订单详情 -->
  <PageNoScroll :title="title" class="orderDetailsModel">
    <div>
      <el-scrollbar
        ref="scrollDiv"
        :style="{
          height: $store.getters.screenHeight - 220 + 'px',
        }"
      >
        <div>
          <el-descriptions title="订单信息">
            <template slot="extra">
              <div class="ordermsg" style="margin-right: 16px">
                <span class="ordersize">操作人：</span>
                <span class="ordersize">{{ tableData.addByUserName }}</span>
              </div>
              <div class="ordermsg">
                <el-button size="small">打印</el-button>
              </div>
            </template>
            <el-descriptions-item label="订单编号">{{
              tableData.orderBasketId
            }}</el-descriptions-item>
            <el-descriptions-item label="订单状态">{{
              tableData.orderStatus
            }}</el-descriptions-item>
            <el-descriptions-item label="购入时间">{{
              tableData.buyTimestamp
            }}</el-descriptions-item>
            <el-descriptions-item label="订单金额">{{
              tableData.totalPrice
            }}</el-descriptions-item>
            <el-descriptions-item label="待确认金额">{{
              tableData.waitGetPrice
            }}</el-descriptions-item>
            <el-descriptions-item label="创建时间">{{
              tableData.timestamp
            }}</el-descriptions-item>
          </el-descriptions>
          <div class="flex_dom flex_row_reverse flex_item_mid">
            <el-button size="small" type="primary">确认付款</el-button>
            <el-button
              size="small"
              style="
                color: var(--color-primary);
                border: 1px solid var(--color-primary);
                margin-right: 16px;
              "
              >退回修改</el-button
            >
          </div>
        </div>

        <div
          style="
            border-top: 1px solid #e9e9e9;
            padding: 10px 0px 0px;
            margin-top: 20px;
          "
        >
          <el-descriptions title="客户信息" style="margin-top: 12px">
            <el-descriptions-item label="客户姓名">{{
              tableData.userName
            }}</el-descriptions-item>
            <el-descriptions-item label="联系电话">{{
              tableData.phoneNumber
            }}</el-descriptions-item>
            <el-descriptions-item label="企业名称">{{
              tableData.companyName
            }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div style="margin-top: 18px">
          <div
            style="
              font-size: 16px;
              color: rgba(1, 6, 33, 0.9);
              font-weight: 600;
              margin-bottom: 10px;
            "
          >
            筐子信息
          </div>
        </div>
      </el-scrollbar>
    </div>
  </PageNoScroll>
</template>

<script>
import {
  buyBasketOrderDetail,
  sellBasketOrderDetail,
} from "@/request/api/frameManage/basketInOut";

export default {
  name: "orderDetails",
  data() {
    return {
      title: "",
      typeView: "", // 判断当前是哪种筐子类型
      orderId: "",
      tableData: {
        payInfo: {
          //付款信息
          aliPay: 0, //3.支付宝
          bank: 0, //4.银行卡
          cash: 0, //1.现金
          lakalaCollection: 0, //5.拉卡拉线上付款
          qrCode: 0, //7.二维码收款
          sellerCash: 0, //6.卖家现金收款
          weChat: 0, //2.微信
        },
      },
    };
  },
  //   watch: {
  //     $route: {
  //       handler: function(val, oldVal) {
  //         let { basketInOutTypeView, orderId } = val.query;
  //         if (basketInOutTypeView && orderId) {
  //           this.typeView = basketInOutTypeView;
  //           this.orderId = orderId;
  //           this.title = this.$options.filters["basketOrderType"](
  //             basketInOutTypeView
  //           );
  //           this.$editPageName(this.title);
  //         }
  //       },
  //       // 深度观察监听
  //       // deep: true,
  //       immediate: true
  //     }
  //   },
  methods: {
    // getList() {
    //   orderInterface(this.typeView, this.orderId).then(res => {
    //     this.tableData = res;
    //   });
    // }
  },
  created() {
    // this.getList();
  },
};
</script>

<style lang="scss" scoped>
.orderDetailsModel {
  .ordermsg {
    display: inline-block;
    .ordersize {
      font-size: 13px;
      color: rgba(1, 6, 33, 0.75);
    }
  }
}
</style>

<style lang="scss">
.orderDetailsModel {
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
