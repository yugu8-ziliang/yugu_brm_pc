<template>
  <PageNoScroll @hanleRefresh="hanleRefresh">
    <div class="customer-outer flex_dom flex_item_mid flex_item_between">
      <div class="flex_dom flex_item_mid">
        <el-image
          style="width: 60px; height: 60px; border-radius: 50%"
          :src="customerData.customerUserImage || imgurl"
          fit="fill"
        ></el-image>
        <div class="customer-list">
          <div class="flex_dom flex_item_mid">
            <div
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 14px;
                margin-right: 25px;
              "
            >
              <el-popover
                v-if="customerData.customerUserName.length > 10"
                placement="top"
                trigger="hover"
                :content="customerData.customerUserName"
              >
                <span class="ellipsisCell" slot="reference"
                  >{{ customerData.customerUserName.slice(0, 10) }}...</span
                >
              </el-popover>
              <span v-else>{{ customerData.customerUserName }}</span>
            </div>
            <div
              class="flex_dom"
              v-if="[1, 2, 3, 4].includes(customerData.merchantTypeCode)"
            >
              <i
                class="el-icon-star-on"
                :style="{
                  width: '13px',
                  height: '13px',
                  color:
                    customerData.iscommonlyused == 1
                      ? '#df971a'
                      : 'rgba(1, 6, 33, 0.35)',
                  'margin-right': '4px',
                  cursor: 'pointer',
                }"
              ></i>
              <span
                :style="{
                  color:
                    customerData.iscommonlyused == 1
                      ? '#df971a'
                      : 'rgba(1, 6, 33, 0.35)',
                  'font-size': '12px',
                  cursor: 'pointer',
                }"
                >常用</span
              >
            </div>

            <div
              class="lineH"
              v-if="[1, 2, 3, 4].includes(customerData.merchantTypeCode)"
            ></div>
            <el-tag
              size="small"
              :class="'elTagbg' + customerData.merchantTypeCode"
              v-if="[1, 2, 3, 4].includes(customerData.merchantTypeCode)"
              >{{ customerData.merchantTypeCode | isCustomerType }}</el-tag
            >

            <div
              class="lineH"
              v-if="
                [1, 2, 3].includes(customerData.merchantTypeCode) &&
                customerData.merchantBusinessScopel.length > 0
              "
            ></div>
            <div
              v-if="[1, 2, 3].includes(customerData.merchantTypeCode)"
              class="flex_dom flex_item_mid"
            >
              <el-popover
                v-if="customerData.merchantBusinessScopel.length > 8"
                placement="top"
                trigger="hover"
              >
                <el-tag
                  v-for="(item, index) in customerData.merchantBusinessScopel"
                  :key="index"
                  size="small"
                  class="elTagbglist"
                  style="margin-right: 12px"
                  >{{ item }}</el-tag
                >

                <span class="ellipsisCell" slot="reference">
                  <el-tag
                    v-for="(item, index) in 8"
                    :key="index"
                    size="small"
                    class="elTagbglist"
                    style="margin-right: 12px"
                    >{{ customerData.merchantBusinessScopel[item] }}</el-tag
                  >...
                </span>
              </el-popover>
              <el-tag
                v-else
                v-for="(item, index) in customerData.merchantBusinessScopel"
                :key="index"
                size="small"
                class="elTagbglist"
                style="margin-right: 12px"
                >{{ item }}</el-tag
              >
            </div>
          </div>
          <div class="customer-middle flex_dom flex_item_mid">
            <div
              class="customer-md-name"
              v-if="[1, 2, 3].includes(customerData.merchantTypeCode)"
            >
              联系电话：{{ customerData.phoneNumber || "无" }}
            </div>
            <div
              class="lineH"
              v-if="[1, 2, 3].includes(customerData.merchantTypeCode)"
            ></div>
            <div
              class="customer-md-name"
              v-if="[1, 2, 3].includes(customerData.merchantTypeCode)"
            >
              企业名称：{{ customerData.customeraCompanyName || "无" }}
            </div>
            <div
              class="lineH"
              v-if="[1, 2, 3].includes(customerData.merchantTypeCode)"
            ></div>
            <div class="customer-md-name">
              最近交易时间：{{ customerData.lastlyDate | datefilter }}
            </div>
          </div>
          <div>
            <!-- <span class="fs14" style="cursor: pointer; color: var(--color-primary)">查看常交易商品</span> -->
            <span
              class="fs14"
              style="cursor: pointer; color: var(--color-primary)"
              @click="
                handleEdit(
                  'productList',
                  '常交易商品',
                  customerData.productList
                )
              "
              >查看常交易商品</span
            >
          </div>
        </div>
      </div>
      <div>
        <el-button-group>
          <el-button
            @click="
              handleEdit('makeNote', '记一笔', { customerId: customerId })
            "
            >记一笔</el-button
          >
          <el-button>发消息</el-button>
          <el-button style="padding: 0px">
            <el-dropdown style="padding: 10px 0px" trigger="click">
              <span style="padding: 10px 18px">...</span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>取消常用</el-dropdown-item>
                <el-dropdown-item>加入黑名单</el-dropdown-item>
              </el-dropdown-menu>
              <el-dropdown-menu slot="dropdown" class="cusbuttongroup">
                <el-dropdown-item>
                  <span @click="handleIsused">
                    {{
                      customerData.iscommonlyused == 1 ? "取消常用" : "设为常用"
                    }}
                  </span>
                </el-dropdown-item>
                <el-dropdown-item>
                  <span @click="handleShield">
                    {{
                      customerData.isForbidden == 1
                        ? "取消黑名单"
                        : "加入黑名单"
                    }}
                  </span>
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-button>
        </el-button-group>

        <!-- <el-button type="primary" style="margin-left: 8px">新建</el-button> -->

        <el-dropdown style="margin-left: 8px" trigger="click">
          <el-button type="primary">
            新建
            <i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>销售单</el-dropdown-item>
            <el-dropdown-item>筐子售出</el-dropdown-item>
            <el-dropdown-item>需求单</el-dropdown-item>
            <el-dropdown-item>申请退款</el-dropdown-item>
            <el-dropdown-item>转账</el-dropdown-item>
            <el-dropdown-item>记账</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>

    <div class="container-page">
      <el-menu
        ref="menulist"
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        menu-trigger="click"
        unique-opened
      >
        <span
          v-for="(item, index) in menuList"
          :key="index"
          style="float: left; margin-top: 1px"
        >
          <el-menu-item
            v-if="menuJudgeLength(item.list)"
            :index="item.currentView"
            @click="handlemenuRouter(item)"
            >{{ item.name }}</el-menu-item
          >

          <el-submenu v-else :index="item.currentView" class="customerSubmenu">
            <template slot="title">
              <span style="padding: 15px 20px">{{ item.name }}</span>
            </template>
            <el-menu-item :index="item.currentView" class="customerTabItem">
              <div
                class="tab-list"
                @mouseover="handleOver(item.name)"
                @mouseleave="handleLeave(item.name)"
              >
                <ul v-if="item.listHidden">
                  <li
                    v-for="(itemO, indexO) in item.list"
                    :key="indexO"
                    @click="handlemenuRouter(itemO)"
                  >
                    {{ itemO.name }}
                  </li>
                </ul>
                <span v-if="!item.listHidden" class="flex_dom flex_item_around">
                  <ul v-for="(itemO, indexO) in item.list" :key="indexO">
                    <li class="tab-li-title">{{ itemO.name }}</li>
                    <li
                      v-for="(itemT, indexT) in itemO.list"
                      :key="indexT"
                      @click="handlemenuRouter(itemT)"
                    >
                      {{ itemT.name }}
                    </li>
                  </ul>
                </span>
              </div>
            </el-menu-item>
          </el-submenu>
        </span>
      </el-menu>

      <div
        class="container-content"
        :style="{
          height: $store.getters.screenHeight - 345 + 'px',
          overflow: 'hidden',
        }"
      >
        <!-- 动态组件由 vm 实例的 `currentView` property 控制 -->
        <!-- <component :is="currentView"></component> -->
        <keep-alive :include="currentView">
          <component
            ref="component"
            :is="currentView"
            :currentView="currentView"
            :toUserId="customerId"
            :customerId="customerId"
            :merchantTypeCode="customerData.merchantTypeCode"
          ></component>
        </keep-alive>
      </div>
    </div>

    <productList ref="productList"></productList>
    <makeNote ref="makeNote"></makeNote>
  </PageNoScroll>
</template>

<script>
import moment from "moment";
import { mapGetters } from "vuex";

// 数据引入
import { isUserToCustomerFilter } from "@/utils/common";
import { Base64 } from "js-base64";
import {
  custmorinfoTitle,
  commonlyuse,
  custmorShield,
} from "@/request/api/customerManage/customerDetail";
export default {
  name: "customerDetail",
  components: {
    businessTransaction: () => import("./modules/businessTransaction.vue"), // 经营交易
    comegoMoney: () => import("./modules/comegoMoney.vue"), // 往来款
    operatingCurrent: () => import("./modules/operatingCurrent.vue"), // 经营往来款
    crediCredit: () => import("./modules/crediCredit.vue"), // 赊账授信
    commoditySalesorder: () =>
      import("./modules/tradeOrder/commoditySalesorder.vue"), // 商品销售单
    basketSaleorder: () => import("./modules/tradeOrder/basketSaleorder.vue"), // 筐子售出单
    basketScrapsheet: () => import("./modules/tradeOrder/basketScrapsheet.vue"), // 筐子报废单
    purchaseOrder: () => import("./modules/tradeOrder/purchaseOrder.vue"), // 商品采购单
    basketPurchaseorder: () =>
      import("./modules/tradeOrder/basketPurchaseorder.vue"), // 筐子购入单
    basketMypurchaseorder: () =>
      import("./modules/tradeOrder/basketMypurchaseorder.vue"), // 筐子自购单
    receivedReturnsrefunded: () =>
      import("./modules/tradeOrder/receivedReturnsrefunded.vue"), // 收到的退货退款
    issueRefundreturns: () =>
      import("./modules/tradeOrder/issueRefundreturns.vue"), // 发出的退货退款
    receivedRefundreturnedbasket: () =>
      import("./modules/tradeOrder/receivedRefundreturnedbasket.vue"), // 收到的退筐退款
    issueRefundbasket: () =>
      import("./modules/tradeOrder/issueRefundbasket.vue"), // 发出的退筐退款
    accountUnpaidgoods: () =>
      import("./modules/tradeOrder/accountUnpaidgoods.vue"), // 记账未付货款
    chargeUnpaidbasket: () =>
      import("./modules/tradeOrder/chargeUnpaidbasket.vue"), // 记账未付筐子款
    bookedGoodsunpaid: () =>
      import("./modules/tradeOrder/bookedGoodsunpaid.vue"), // 记账未收货款
    chargenotCollectedbasket: () =>
      import("./modules/tradeOrder/chargenotCollectedbasket.vue"), // 记账未收筐子款
    productList: () => import("./dialogmod/productList.vue"), // 常交易商品
    makeNote: () => import("./dialogmod/makeNote.vue"), // 记一笔
    // 转/记账单发出的
    advancePayment: () =>
      import("./modules/transferandBill/advancePayment.vue"), //发出的预付款
    isBorrowing: () => import("./modules/transferandBill/isBorrowing.vue"), //借款
    isOther: () => import("./modules/transferandBill/isOther.vue"), //其他
    returnadvancePayment: () =>
      import("./modules/transferandBill/returnadvancePayment.vue"), //归还预付款
    returnBorrowing: () =>
      import("./modules/transferandBill/returnBorrowing.vue"), //归还借款
    returnAccountpayments: () =>
      import("./modules/transferandBill/returnAccountpayments.vue"), //归还记账货款
    returnChargebasket: () =>
      import("./modules/transferandBill/returnChargebasket.vue"), //归还记账筐子款
    // 转/记账单收到的
    receivedadvancePayment: () =>
      import("./modules/transferandBill/receivedadvancePayment.vue"), //预付款
    receivedBorrowing: () =>
      import("./modules/transferandBill/receivedBorrowing.vue"), //借款
    receivedOther: () => import("./modules/transferandBill/receivedOther.vue"), //其他
    receivedreturnadvancePayment: () =>
      import("./modules/transferandBill/receivedreturnadvancePayment.vue"), //归还预付款
    receivedreturnBorrowing: () =>
      import("./modules/transferandBill/receivedreturnBorrowing.vue"), //归还借款
    receivedreturnAccountpayments: () =>
      import("./modules/transferandBill/receivedreturnAccountpayments.vue"), //归还记账货款
    receivedreturnChargebasket: () =>
      import("./modules/transferandBill/receivedreturnChargebasket.vue"), //归还记账筐子款

    salesDraft: () => import("./modules/draftBox/salesDraft.vue"), //草稿箱 销售草稿
    demandDraft: () => import("./modules/draftBox/demandDraft.vue"), //草稿箱 需求草稿

    issuedDemandsingle: () =>
      import("./modules/demandSingle/issuedDemandsingle.vue"), //需求单 发出的需求单
    requestsheetReceived: () =>
      import("./modules/demandSingle/requestsheetReceived.vue"), //需求单 收到的需求单
  },
  data() {
    return {
      imgurl: require("@/assets/image/imgs/portrait.png"),
      menuList: "",
      activeIndex: null,
      currentView: null,
      customerId: "",
      customerDataReturn: {},
      customerData: { customerUserName: "" },
    };
  },
  filters: {
    datefilter(value) {
      if (value) return moment(value * 1000).format("YYYY-MM-DD HH:mm:ss");
      else return "";
    },
  },
  computed: {
    ...mapGetters(["userInfo"]),
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
          if (!param.customerId) {
            this.handleRouter();
            return;
          }
          this.customerId = param.customerId;
          this.customerDataReturn = param;
          this.handleInfoData();
        } catch (error) {
          this.handleRouter();
        }
        return;
      }
      this.handleRouter();
    },
    // 跳转
    handleRouter() {
      setTimeout(() => {
        this.$store
          .dispatch("tagsView/delView", {
            path: this.$route.path,
          })
          .then(({ visitedViews }) => {
            this.$router.push({ path: "/customerManage/customerList" });
          });
      }, 0);
    },
    //获取表头数据
    handleInfoData() {
      custmorinfoTitle({ custmorUserId: this.customerId }).then((res) => {
        if (res.status == 200) {
          this.customerData = res.data[0];
          // 非平台
          if (this.customerData.isPlatform == 0) {
            this.customerData.merchantTypeCode = 4;
          }
          // 散户
          if (
            this.customerData.isPlatform == 0 &&
            this.customerData.customerUserName == "散户"
          ) {
            this.customerData.merchantTypeCode = 5;
          }

          let CustomerTageList = isUserToCustomerFilter(
            this.userInfo.usertype,
            this.customerData.merchantTypeCode
          );
          // let CustomerTageList = isUserToCustomerFilter(
          //   7,1
          // );

          this.menuList = CustomerTageList;

          if (this.customerDataReturn.currentView) {
            this.activeIndex = this.customerDataReturn.currentView;
            this.currentView = this.customerDataReturn.currentView;
          } else {
            if (!this.currentView && !this.activeIndex) {
              this.activeIndex = CustomerTageList[0].currentView;
              this.currentView = CustomerTageList[0].currentView;
            } else {
              this.$refs.component.getList();
            }
          }
          try {
            this.customerData.merchantBusinessScopel =
              this.customerData.merchantBusinessScopel.split(",");
          } catch (error) {
            this.customerData.merchantBusinessScopel = [];
          }
          // console.log(this.customerData);
        } else {
          this.handleRouter();
        }
      });
    },
    handlemenuRouter(val, state) {
      if (val.currentView != this.currentView) {
        // if (val.currentView == "commoditySalesorder") {

        // }
        this.currentView = val.currentView;
      }
    },
    // 设置取消常用
    handleIsused() {
      // 是否常用   1-常用   0-不常用
      let param = {
        linkUserId: this.customerId, //客户ID
        type: this.customerData.iscommonlyused == 1 ? 2 : 1, // 1-设置常用  2-取消常用
      };
      commonlyuse(param).then((res) => {
        if (res.status == 200) {
          this.$message.success(res.msg);
          this.handleInfoData();
        }
      });
    },
    // 设置屏蔽/取消屏蔽
    handleShield() {
      let param = {
        linkUserId: this.customerId, // 客户ID
        type: this.customerData.isForbidden == 1 ? 2 : 1, // 1-设置屏蔽  2-取消屏蔽
      };

      custmorShield(param).then((res) => {
        if (res.status == 200) {
          this.$message.success(res.msg);
          this.handleInfoData();
        }
      });
    },
    handleLeave(val) {
      // this.$refs.menulist.close(val);
    },
    handleOver(val) {
      // console.log(123123);
    },
    // 判断长度
    menuJudgeLength(val) {
      if (val) {
        return false;
      } else {
        return true;
      }
    },
    // 触发子组件编辑按钮
    handleEdit(form, title, record) {
      this.$refs[form].edit(record);
      this.$refs[form].title = title;
      this.$refs[form].disableSubmit = false;
      this.$refs[form].isVisiable = true;
    },
    // 刷新
    hanleRefresh() {
      this.handleInfoData();
    },
  },
  created() {
    this.initData();
  },
};
</script>

<style lang="scss" scoped>
.customer-outer {
  // padding: 10px;
  .customer-list {
    margin-left: 10px;
  }

  .cusbuttongroup {
    ::v-deep .el-dropdown-menu__item {
      padding: 0px 0px !important;
    }
  }

  .customer-middle {
    margin: 10px 0px;
    .customer-md-name {
      color: rgba(1, 6, 33, 0.55);
      font-size: 12px;
    }
  }
}

.lineH {
  width: 1px;
  height: 16px;
  border-right: 1px solid rgba(1, 6, 33, 0.35);
  overflow: hidden;
  box-shadow: none;
  margin: 0px 12px;
}

.container-page {
  margin-top: 5px;

  ::v-deep .el-submenu,
  .el-menu-item {
    &:hover {
      background-color: #fff !important;
      color: var(--default-color) !important;
    }

    &.is-active {
      background-color: #fff !important;
      color: var(--color-primary) !important;
      border-bottom: 2px solid var(--color-primary) !important;

      .el-submenu__title {
        color: var(--color-primary) !important;
      }
    }
  }

  ::v-deep .el-submenu__title {
    padding: 0px;
    &:hover {
      background: #fff !important;
      color: var(--default-color) !important;
    }

    .el-submenu__icon-arrow {
      right: 0;
    }
  }
}

.customerTabItem {
  &.el-menu-item {
    height: auto !important;
    padding: 0px;
  }

  .tab-list {
    // padding: 5px 10px;
    .tab-li-title {
      min-width: 116px;
      // padding: 10px;
      background: rgba(1, 6, 33, 0.04);
      color: rgba(1, 6, 33, 0.9);
      font-size: 14px;
      &:hover {
        background: rgba(1, 6, 33, 0.04);
        color: rgba(1, 6, 33, 0.9);
      }
    }

    ul > li {
      text-align: center;
      padding: 4px 14px;
      color: rgba(1, 6, 33, 0.55);
      font-size: 13px;
      cursor: pointer;
      &:hover {
        color: rgba(1, 6, 33, 0.55);
        background: #cef2ed;
      }
    }
  }
}

.container-content {
  margin-top: 10px;

  ::v-deep .el-scrollbar {
    .el-scrollbar__wrap {
      overflow-x: hidden;
      .el-scrollbar__view {
        min-height: 100%;
        min-width: 1370px;
        position: relative;
        padding: 5px;
      }
    }
  }
}
</style>

<style lang="scss">
.cusbuttongroup {
  .el-dropdown-menu__item {
    padding: 0px 0px !important;
    span {
      padding: 10px 17px;
    }
  }
}
</style>