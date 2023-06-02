<template>
  <!-- 收付款 -->
  <Container @refresh="hanleRefresh" class="receivePaymentModel">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
      menu-trigger="click"
      unique-opened
    >
      <el-submenu index="1">
        <template slot="title">待收款</template>
        <el-menu-item
          v-for="(item, index) in menuList[0]"
          :key="index"
          class="menu-item-tot"
          :index="item.currentView"
        >
          {{ item.name }}</el-menu-item
        >
      </el-submenu>
      <el-submenu index="2">
        <template slot="title">
          <el-badge is-dot class="badgeItem" :hidden="isNameDeg"
            >订单未付</el-badge
          >
        </template>
        <el-menu-item
          v-for="(item, index) in menuList[1]"
          :key="index"
          class="menu-item-tot"
          :index="item.currentView"
        >
          <el-badge
            is-dot
            class="badgeItem"
            :hidden="tableData[item.nameDeg] == 0 ? true : false"
            >{{ item.name }}
          </el-badge>
        </el-menu-item>
      </el-submenu>
      <el-submenu index="3">
        <template slot="title">订单未收</template>
        <el-menu-item
          v-for="(item, index) in menuList[2]"
          :key="index"
          class="menu-item-tot"
          :index="item.currentView"
        >
          {{ item.name }}</el-menu-item
        >
      </el-submenu>
    </el-menu>
    <div class="container-content">
      <!-- 动态组件由 vm 实例的 `currentView` property 控制 -->
      <!-- <component :is="currentView"></component> -->
      <keep-alive :include="currentView">
        <component
          ref="component"
          :is="currentView"
          :currentView="currentView"
        ></component>
      </keep-alive>
    </div>
  </Container>
</template>
<script>
import { orderUnpaid } from "@/request/api/financialManage/index";
export default {
  name: "receivePayment",
  components: {
    salesView: () => import("./modules/salesView.vue"), // 销售款
    refundsView: () => import("./modules/refundsView.vue"), // 退货退款
    basketView: () => import("./modules/basketView.vue"), // 筐子售出
    refundView: () => import("./modules/refundView.vue"), // 退筐退款
    transferView: () => import("./modules/transferView.vue"), // 转账

    recMerchanView: () => import("./modules/recMerchanView.vue"), // 商品销售
    recBasketView: () => import("./modules/recBasketView.vue"), // 筐子售出
    recRefundsView: () => import("./modules/recRefundsView.vue"), // 退货退款
    recRefundView: () => import("./modules/recRefundView.vue"), // 退筐退款
    recBookkeeView: () => import("./modules/recBookkeeView.vue"), // 记账
    recProductView: () => import("./modules/recProductView.vue"), // 商品配送
    paidCommodityView: () => import("./modules/paidCommodityView.vue"), // 商品采购
    paidBasketView: () => import("./modules/paidBasketView.vue"), // 筐子购入
    paidRefundsView: () => import("./modules/paidRefundsView.vue"), // 退货退款
    paidRefundView: () => import("./modules/paidRefundView.vue"), // 退筐退款
    paidBookkeeView: () => import("./modules/paidBookkeeView.vue"), // 记账
    paidShippingView: () => import("./modules/paidShippingView.vue"), // 配送退货
    paidDeliveryView: () => import("./modules/paidDeliveryView.vue"), // 配送退筐
  },
  data() {
    return {
      menuList: [],
      activeIndex: null,
      currentView: null,
      tableData: {},
    };
  },
  computed: {
    isNameDeg() {
      let arr = [];
      for (let key in this.tableData) {
        arr.push(this.tableData[key]);
      }
      var result = false;
      result = arr.some(function (item) {
        if (item == 1) {
          return true;
        }
      });
      return !result;
    },
  },
  methods: {
    getList() {
      this.handleMenuList();
      let param = {
        timestamp: "",
      };
      orderUnpaid(param).then((res) => {
        if (res.status == 200) {
          this.tableData = res.data[0];
          let { data: data } = this.$route.query;
          if (data) {
            this.handleSelect(data);
          }
        }
      });
    },
    handleSelect(val) {
      this.activeIndex = val;
      this.currentView = val;
    },
    handleMenuList() {
      this.menuList.push(this.pendingList());
      this.menuList.push(this.orderPaid());
      this.menuList.push(this.orderReceived());
      this.activeIndex = this.menuList[0][0].currentView;
      this.currentView = this.menuList[0][0].currentView;
    },
    pendingList() {
      let param = this.$store.getters.userInfo;
      // 经营户 1
      if (param.usertype == 6 || param.usertype == 7) {
        return [
          {
            name: "销售款",
            currentView: "salesView",
          },
          {
            name: "退货退款",
            currentView: "refundsView",
          },
          {
            name: "筐子售出",
            currentView: "basketView",
          },
          {
            name: "退筐退款",
            currentView: "refundView",
          },
          {
            name: "转账",
            currentView: "transferView",
          },
        ];
      }
      // 供货商 2
      if (param.usertype == 10 || param.usertype == 11) {
        return [
          {
            name: "销售款",
            currentView: "salesView",
          },
          {
            name: "筐子售出",
            currentView: "basketView",
          },
          {
            name: "退筐退款",
            currentView: "refundView",
          },
          {
            name: "转账",
            currentView: "transferView",
          },
        ];
      }
      // 采购商
      if (param.usertype == 3 || param.usertype == 4) {
        return [
          {
            name: "退货退款",
            currentView: "refundsView",
          },
          {
            name: "筐子售出",
            currentView: "basketView",
          },
          {
            name: "退筐退款",
            currentView: "refundView",
          },
          {
            name: "转账",
            currentView: "transferView",
          },
        ];
      }
    },
    orderPaid() {
      let param = this.$store.getters.userInfo;
      // 经营户 1
      if (
        param.usertype == 6 ||
        param.usertype == 7 ||
        param.usertype == 10 ||
        param.usertype == 11
      ) {
        return [
          {
            name: "商品采购",
            currentView: "paidCommodityView",
            nameDeg: "orderSell",
          },
          {
            name: "筐子购入",
            currentView: "paidBasketView",
            nameDeg: "orderBasket",
          },
          {
            name: "退货退款",
            currentView: "paidRefundsView",
            nameDeg: "orderReturn",
          },
          {
            name: "退筐退款",
            currentView: "paidRefundView",
            nameDeg: "orderBasketReturn",
          },
          {
            name: "记账",
            currentView: "paidBookkeeView",
            nameDeg: "transferNote",
          },
        ];
      }
      // 采购商
      if (param.usertype == 3 || param.usertype == 4) {
        // 生鲜超市 3
        if (param.purchaseType == 2) {
          return [
            {
              name: "商品采购",
              currentView: "paidCommodityView",
              nameDeg: "orderSell",
            },
            {
              name: "筐子购入",
              currentView: "paidBasketView",
              nameDeg: "orderBasket",
            },
            {
              name: "退筐退款",
              currentView: "paidRefundView",
              nameDeg: "orderBasketReturn",
            },
            {
              name: "配送退货",
              currentView: "paidShippingView",
              nameDeg: "orderUserDeliveryReturn",
            },
            {
              name: "配送退筐",
              currentView: "paidDeliveryView",
              nameDeg: "orderDeliveryBasketReturn",
            },
            {
              name: "记账",
              currentView: "paidBookkeeView",
              nameDeg: "transferNote",
            },
          ];
        }
        // 农贸市场 4 // 食堂饭店 5
        if (param.purchaseType == 3 || param.purchaseType == 1) {
          return [
            {
              name: "商品采购",
              currentView: "paidCommodityView",
              nameDeg: "orderSell",
            },
            {
              name: "筐子购入",
              currentView: "paidBasketView",
              nameDeg: "orderBasket",
            },
            {
              name: "退筐退款",
              currentView: "paidRefundView",
              nameDeg: "orderBasketReturn",
            },
            {
              name: "记账",
              currentView: "paidBookkeeView",
              nameDeg: "transferNote",
            },
          ];
        }
      }
    },
    orderReceived() {
      let param = this.$store.getters.userInfo;
      // 经营户 1
      if (
        param.usertype == 6 ||
        param.usertype == 7 ||
        param.usertype == 10 ||
        param.usertype == 11
      ) {
        return [
          {
            name: "商品销售",
            currentView: "recMerchanView",
          },
          {
            name: "筐子售出",
            currentView: "recBasketView",
          },
          {
            name: "退货退款",
            currentView: "recRefundsView",
          },
          {
            name: "退筐退款",
            currentView: "recRefundView",
          },
          {
            name: "记账",
            currentView: "recBookkeeView",
          },
        ];
      }

      // 采购商
      if (param.usertype == 3 || param.usertype == 4) {
        // 生鲜超市 3
        if (param.purchaseType == 2) {
          return [
            {
              name: "筐子售出",
              currentView: "recBasketView",
            },
            {
              name: "退货退款",
              currentView: "recRefundsView",
            },
            {
              name: "退筐退款",
              currentView: "recRefundView",
            },
            {
              name: "商品配送",
              currentView: "recProductView",
            },
            {
              name: "记账",
              currentView: "recBookkeeView",
            },
          ];
        }
        // 农贸市场 4 // 食堂饭店 5
        if (param.purchaseType == 3 || param.purchaseType == 1) {
          return [
            {
              name: "筐子售出",
              currentView: "recBasketView",
            },
            {
              name: "退货退款",
              currentView: "recRefundsView",
            },
            {
              name: "退筐退款",
              currentView: "recRefundView",
            },
            {
              name: "记账",
              currentView: "recBookkeeView",
            },
          ];
        }
      }
    },
    // 刷新
    hanleRefresh() {
      this.$refs.component.getList();
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style scoped lang="scss">
.receivePaymentModel {
  .container-content {
    margin-top: 10px;
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
.receivePaymentModel {
  .el-menu-item {
    color: rgba(1, 6, 33, 0.75) !important;

    &:hover {
      color: var(--default-color) !important;
    }

    &.is-active {
      color: var(--default-color) !important;
    }
  }

  .el-submenu > .el-submenu__title {
    color: rgba(1, 6, 33, 0.75) !important;

    &:hover {
      color: var(--default-color) !important;
    }
  }

  .el-submenu.is-active .el-submenu__title {
    color: var(--default-color) !important;
  }

  .badgeItem {
    .el-badge__content.is-dot {
      right: 0px;
      top: 6px;
    }
  }
}

.menu-item-tot {
  color: rgba(1, 6, 33, 0.75) !important;

  &:hover {
    color: var(--default-color) !important;
  }

  &.is-active {
    color: var(--default-color) !important;
  }

  .badgeItem {
    .el-badge__content.is-dot {
      right: 0px;
      top: 6px;
    }
  }
}
</style>