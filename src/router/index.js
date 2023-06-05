import Vue from "vue";
import Router from "vue-router";

Vue.use(Router);

/* Layout */
import Layout from "@/layout";

export const constantRoutes = [
  {
    path: "/redirect",
    component: Layout,
    hidden: true,
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/redirect/index"),
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/login"),
    hidden: true,
  },
  {
    path: "/",
    component: Layout,
    redirect: "/index",
    meta: {
      breadcrumb: false,
    },
    children: [
      {
        path: "index",
        name: "index",
        component: () => import("@/views/home/index"),
        meta: {
          title: "首页",
          icon: "homePage",
          affix: true,
        },
      },
    ],
  },
  {
    path: "/demandManage",
    component: Layout,
    redirect: "/demandReceived",
    meta: {
      icon: "transactionManage",
      title: "需求管理",
    },
    children: [
      {
        path: "demandReceived",
        name: "demandReceived",
        component: () => import("@/views/demandManage/demandReceived.vue"),
        meta: {
          title: "收到的需求",
          icon: " ",
        },
      },
      {
        path: "issuedReceived",
        name: "issuedReceived",
        component: () => import("@/views/demandManage/issuedReceived.vue"),
        meta: {
          title: "发出的需求",
          icon: " ",
        },
      },
      {
        path: "addNewrequest",
        name: "addNewrequest",
        hidden: true,
        component: () => import("@/views/demandManage/addNewrequest.vue"),
        meta: {
          title: "新建需求单",
          icon: " ",
          noCache: false,
        },
      },
      {
        path: "addCommodity",
        name: "addCommodity",
        hidden: true,
        component: () => import("@/views/demandManage/addCommodity.vue"),
        meta: {
          title: "选择商品",
          icon: " ",
          noCache: false,
        },
      },
      {
        path: "viewDrafts",
        name: "viewDrafts",
        hidden: true,
        component: () => import("@/views/demandManage/viewDrafts.vue"),
        meta: {
          title: "查看草稿箱",
          icon: " ",
          noCache: false,
        },
      },
      {
        path: "historicalSending",
        name: "historicalSending",
        hidden: true,
        component: () => import("@/views/demandManage/historicalSending.vue"),
        meta: {
          title: "历史发送需求",
          icon: " ",
          noCache: false,
        },
      },
      {
        path: "summaryReceived",
        name: "summaryReceived",
        hidden: true,
        component: () => import("@/views/demandManage/summaryReceived.vue"),
        meta: {
          title: "收到的需求汇总",
          icon: " ",
          noCache: false,
        },
      },
      {
        path: "saveDraft",
        name: "saveDraft",
        component: () => import("@/views/demandManage/saveDraft.vue"),
        meta: {
          title: "保存的草稿",
          icon: " ",
        },
      },
    ],
  },
  // {
  //     path: '/transactionManage',
  //     component: Layout,
  //     redirect: "/orderSummary",
  //     meta: {
  //         icon: 'transactionManage',
  //         title: '交易管理'
  //     },
  //     children: [{
  //         path: 'orderSummary',
  //         name: "orderSummary",
  //         component: () => import('@/views/transactionManage/orderSummary.vue'),
  //         meta: {
  //             title: '订单汇总',
  //             icon: ' ',
  //         }
  //     }, {
  //         path: 'needSummary',
  //         name: "needSummary",
  //         component: () => import('@/views/transactionManage/needSummary.vue'),
  //         meta: {
  //             title: '需求汇总',
  //             icon: ' ',
  //         }
  //     }, {
  //         path: 'saleAccount',
  //         name: "saleAccount",
  //         component: () => import('@/views/transactionManage/saleAccount.vue'),
  //         meta: {
  //             title: '销售记账',
  //             icon: ' ',
  //         }
  //     },
  //     {
  //         path: 'returnRefund',
  //         name: "returnRefund",
  //         component: () => import('@/views/transactionManage/returnRefund.vue'),
  //         meta: {
  //             title: '退货退款',
  //             icon: ' ',
  //         }
  //     },

  //     ]
  // },

  // {
  // path: '/orderManage',
  // component: Layout,
  // redirect: "/commoditySalesOrder",
  // meta: {
  //     icon: 'transactionManage',
  //     title: '订单管理'
  // },
  // children: [{
  //     path: 'commoditySalesOrder',
  //     name: "commoditySalesOrder",
  //     component: () => import('@/views/orderManage/commoditySalesOrder.vue'),
  //     meta: {
  //         title: '商品销售单',
  //         icon: ' ',
  //     }
  // }, {
  //     path: 'commodityPurchaseOrder',
  //     name: "commodityPurchaseOrder",
  //     component: () => import('@/views/orderManage/commodityPurchaseOrder.vue'),
  //     meta: {
  //         title: '商品采购单',
  //         icon: ' ',
  //     }
  // }, {
  //     path: 'basketSalesOrder',
  //     name: "basketSalesOrder",
  //     component: () => import('@/views/orderManage/basketSalesOrder.vue'),
  //     meta: {
  //         title: '筐子售出单',
  //         icon: ' ',
  //     }
  // }, {
  //     path: 'basketPurchaseOrder',
  //     name: "basketPurchaseOrder",
  //     component: () => import('@/views/orderManage/basketPurchaseOrder.vue'),
  //     meta: {
  //         title: '筐子购入单',
  //         icon: ' ',
  //     }
  // }, ]
  // },
  {
    path: "/orderManagement",
    component: Layout,
    redirect: "/refundsGoods",
    meta: {
      icon: "el-icon-menu",
      title: "订单管理",
    },
    children: [
      {
        path: "commodity-sale",
        name: "CommoditySaleList",
        component: () => import("@/views/orderManage/commodity-sale"),
        meta: {
          title: "商品销售单",
          icon: " ",
          noCache: true,
        },
      },
      {
        path: "commodity-detail",
        name: "CommoditySaleDetail",
        hidden: true,
        component: () => import("@/views/orderManage/commodity-sale/detail"),
        meta: {
          title: "销售单详情",
          icon: " ",
          activeMenu: "/orderManagement/commodity-sale",
        },
      },
      {
        path: "add-collection",
        name: "AddCommoditySale",
        hidden: true,
        component: () => import("@/views/orderManage/commodity-sale/add"),
        meta: {
          title: "填写收款信息",
          icon: " ",
        },
      },
      {
        path: "purchase-list",
        name: "CommondityPurchaseList",
        component: () =>
          import("@/views/orderManage/commodity-purchase/index.vue"),
        meta: {
          title: "商品采购单",
          icon: " ",
        },
      },
      {
        path: "purchase-detail",
        name: "CommondityPurchaseDeatail",
        hidden: true,
        component: () =>
          import("@/views/orderManage/commodity-purchase/detail.vue"),
        meta: {
          title: "采购单详情",
          icon: " ",
          activeMenu: "/orderManagement/purchase-list",
        },
      },

      {
        path: "add-purchase",
        name: "AddCommodityPurchase",
        hidden: true,
        component: () => import("@/views/orderManage/commodity-purchase/add"),
        meta: {
          title: "支付采购款",
          icon: " ",
          activeMenu: "/orderManagement/purchase-list",
        },
      },
      {
        path: "basketBuy",
        name: "basketBuy",
        component: () => import("@/views/frameManage/basketBuy/index.vue"),
        meta: {
          title: "筐子购入单",
          icon: " ",
        },
      },
      {
        path: "BasketBuyAdd",
        name: "BasketBuyAdd",
        hidden: true,
        component: () => import("@/views/frameManage/basketBuy/add.vue"),
        meta: {
          title: "新建筐子购入单",
          icom: "",
          noCache: true,
        },
      },
      {
        path: "BasketBuyDetail",
        name: "BasketBuyDetail",
        hidden: true,
        component: () => import("@/views/frameManage/basketBuy/detail.vue"),
        meta: {
          title: "购入筐子详情",
          icom: "",
          activeMenu: "/orderManagement/basketBuy",
        },
      },
      {
        path: "commodityCollectionRecord",
        name: "commodityCollectionRecord",
        hidden: true,
        component: () =>
          import(
            "@/views/orderManage/commoditySalesOrderDetail/collectionRecord/index.vue"
          ),
        meta: {
          title: "收款记录",
          icon: " ",
          noCache: true,
        },
      },

      {
        path: "paymentRecord",
        name: "paymentRecord",
        hidden: true,
        component: () =>
          import(
            "@/views/orderManage/commoditySalesOrderDetail/paymentRecord/index.vue"
          ),
        meta: {
          title: "付款记录",
          icon: " ",
          noCache: true,
        },
      },

      {
        path: "payforPurchase",
        name: "payforPurchase",
        hidden: true,
        component: () =>
          import(
            "@/views/orderManage/commoditySalesOrderDetail/payforPurchase.vue"
          ),
        meta: {
          title: "支付采购款",
          icon: " ",
        },
      },
      {
        path: "demandOrder",
        name: "demandOrder",
        hidden: true,
        component: () => import("@/views/orderManage/demandOrder.vue"),
        meta: {
          title: "查看需求单",
          icom: "",
        },
      },
      {
        path: "drafts",
        name: "drafts",
        hidden: true,
        component: () => import("@/views/orderManage/drafts.vue"),
        meta: {
          title: "查看草稿箱",
          icom: "",
        },
      },
      {
        path: "historySellOrder",
        name: "historySellOrder",
        hidden: true,
        component: () => import("@/views/orderManage/historySellOrder.vue"),
        meta: {
          title: "查看历史销售单",
          icom: "",
        },
      },
      {
        path: "addSalesTicket",
        name: "addSalesTicket",
        hidden: true,
        component: () => import("@/views/orderManage/addSalesTicket.vue"),
        meta: {
          title: "新建销售单",
          icon: " ",
          noCache: false,
        },
      },
      {
        path: "addSalesCommodity",
        name: "addSalesCommodity",
        hidden: true,
        component: () => import("@/views/orderManage/addSalesCommodity.vue"),
        meta: {
          title: "选择商品",
          icon: " ",
          noCache: false,
        },
      },
      {
        path: "editSalesCommodity",
        name: "editSalesCommodity",
        hidden: true,
        component: () => import("@/views/orderManage/editSalesCommodity.vue"),
        meta: {
          title: "编辑销售商品",
          icon: " ",
          noCache: false,
        },
      },
      {
        path: "editSalesCommodityDetail",
        name: "editSalesCommodityDetail",
        hidden: true,
        component: () =>
          import("@/views/orderManage/editSalesCommodityDetail.vue"),
        meta: {
          title: "商品详情",
          icon: " ",
          noCache: false,
        },
      },
      {
        path: "basketSold",
        name: "basketSold",
        component: () => import("@/views/frameManage/basketSold/index.vue"),
        meta: {
          title: "筐子售出单",
          icon: " ",
        },
      },
      {
        path: "BasketSoldDetail",
        name: "BasketSoldDetail",
        hidden: true,
        component: () => import("@/views/frameManage/basketSold/detail.vue"),
        meta: {
          title: "售出筐子详情",
          icom: " ",
        },
      },
      {
        path: "BasketSoldAdd",
        name: "BasketSoldAdd",
        hidden: true,
        component: () => import("@/views/frameManage/basketSold/add.vue"),
        meta: {
          title: "新建筐子售出单",
          icom: " ",
          noCache: true,
        },
      },
    ],
  },

  {
    path: "/commodityManage",
    component: Layout,
    redirect: "/commodityList",
    meta: {
      icon: "commodityManage",
      title: "商品管理",
    },
    children: [
      {
        path: "commodityList",
        name: "commodityList",
        component: () => import("@/views/commodityManage/commodityList.vue"),
        meta: {
          title: "商品列表",
          icon: " ",
        },
      },
      {
        path: "addCommodity",
        name: "addCommodity",
        hidden: true,
        component: () =>
          import("@/views/commodityManage/addCommodity/index.vue"),
        meta: {
          title: "添加商品",
          icon: " ",
        },
      },
      {
        path: "editCommodity",
        name: "editCommodity",
        hidden: true,
        component: () =>
          import("@/views/commodityManage/addCommodity/editCommodity.vue"),
        meta: {
          title: "编辑商品",
          icon: " ",
        },
      },
      {
        path: "addStock",
        name: "addStock",
        hidden: true,
        component: () => import("@/views/commodityManage/addStock/index.vue"),
        meta: {
          title: "添加入库",
          icon: " ",
        },
      },
      {
        path: "commodityInOutDetails",
        name: "commodityInOutDetails",
        component: () =>
          import("@/views/commodityManage/commodityInOutDetails.vue"),
        meta: {
          title: "商品出入库明细",
          icon: " ",
        },
      },
      // {
      //     path: 'commodityPutIn',
      //     name: "commodityPutIn",
      //     component: () => import('@/views/commodityManage/commodityPutIn.vue'),
      //     meta: {
      //         title: '添加入库',
      //         icon: ' ',
      //     }
      // },
      {
        path: "commodityDetail",
        name: "commodityDetail",
        hidden: true,
        component: () => import("@/views/commodityManage/commodityDetail.vue"),
        meta: {
          title: "商品详情",
          icon: " ",
        },
      },
      {
        path: "batchDetail",
        name: "batchDetail",
        hidden: true,
        component: () => import("@/views/commodityManage/batchDetail.vue"),
        meta: {
          title: "批次明细详情",
          icon: " ",
        },
      },
      {
        path: "addcommodityDetails",
        name: "addcommodityDetails",
        hidden: true,
        component: () =>
          import(
            "@/views/commodityManage/addCommodity/addcommodityDetails.vue"
          ),
        meta: {
          title: "添加商品详情",
          icon: " ",
        },
      },
      {
        path: "addrepositoryDetails",
        name: "addrepositoryDetails",
        hidden: true,
        component: () =>
          import(
            "@/views/commodityManage/addCommodity/addrepositoryDetails.vue"
          ),
        meta: {
          title: "添加入库详情",
          icon: " ",
        },
      },
      {
        path: "theOverflow",
        name: "theOverflow",
        hidden: true,
        component: () => import("@/views/commodityManage/theOverflow.vue"),
        meta: {
          title: "商品报溢",
          icon: " ",
        },
      },
      {
        path: "overstatementDetails",
        name: "overstatementDetails",
        hidden: true,
        component: () =>
          import("@/views/commodityManage/overstatementDetails.vue"),
        meta: {
          title: "报溢单详情",
          icon: " ",
        },
      },
      {
        path: "reportLoss",
        name: "reportLoss",
        hidden: true,
        component: () =>
          import(
            "@/views/commodityManage/commodityReportedloss/reportLoss.vue"
          ),
        meta: {
          title: "报损商品",
          icon: " ",
        },
      },
      {
        path: "reportlossDetails",
        name: "reportlossDetails",
        hidden: true,
        component: () =>
          import(
            "@/views/commodityManage/commodityReportedloss/reportlossDetails.vue"
          ),
        meta: {
          title: "报损单详情",
          icon: " ",
        },
      },
      {
        path: "unitConversion",
        name: "unitConversion",
        hidden: true,
        component: () => import("@/views/commodityManage/unitConversion.vue"),
        meta: {
          title: "单位转换",
          icon: " ",
        },
      },
      {
        path: "unitConversionDetail",
        name: "unitConversionDetail",
        hidden: true,
        component: () =>
          import("@/views/commodityManage/unitConversionDetail.vue"),
        meta: {
          title: "单位转换单详情",
          icon: " ",
        },
      },
      {
        path: "soar",
        name: "soar",
        hidden: true,
        component: () => import("@/views/commodityManage/soar.vue"),
        meta: {
          title: "腾空",
          icon: " ",
        },
      },
      {
        path: "emptyDetails",
        name: "emptyDetails",
        hidden: true,
        component: () => import("@/views/commodityManage/emptyDetails.vue"),
        meta: {
          title: "腾空单详情",
          icon: " ",
        },
      },
      {
        path: "packbasket",
        name: "packbasket",
        hidden: true,
        component: () => import("@/views/commodityManage/packbasket.vue"),
        meta: {
          title: "装筐",
          icon: " ",
        },
      },
      {
        path: "packbasketDetails",
        name: "packbasketDetails",
        hidden: true,
        component: () =>
          import("@/views/commodityManage/packbasketDetails.vue"),
        meta: {
          title: "装筐单详情",
          icon: " ",
        },
      },
      {
        path: "sortingDetails",
        name: "sortingDetails",
        hidden: true,
        component: () => import("@/views/commodityManage/sortingDetails.vue"),
        meta: {
          title: "分拣单详情",
          icon: " ",
        },
      },
      {
        path: "checkList",
        name: "checkList",
        component: () => import("@/views/commodityManage/checkList.vue"),
        meta: {
          title: "商品盘点",
          icon: " ",
        },
      },
      {
        path: "inventoryDetails",
        name: "inventoryDetails",
        hidden: true,
        component: () => import("@/views/commodityManage/inventoryDetails.vue"),
        meta: {
          title: "盘点单详情",
          icon: " ",
        },
      },
      {
        path: "sorting",
        name: "sorting",
        hidden: true,
        component: () => import("@/views/commodityManage/sorting.vue"),
        meta: {
          title: "分拣",
          icon: " ",
        },
      },
      {
        path: "takeStock",
        name: "takeStock",
        // hidden: true,
        component: () => import("@/views/commodityManage/takeStock.vue"),
        meta: {
          title: "新建盘点",
          icon: " ",
        },
      },
    ],
  },
  {
    path: "/refundManagement",
    component: Layout,
    redirect: "/refundsGoods",
    meta: {
      icon: "el-icon-menu",
      title: "退款管理",
    },
    children: [
      {
        path: "refundsGoods",
        name: "refundsGoods",
        component: () => import("@/views/refundManagement/refundsGoods.vue"),
        meta: {
          title: "退货退款",
          icon: " ",
        },
      },
      {
        path: "refundsBasket",
        name: "refundsBasket",
        component: () => import("@/views/refundManagement/refundsBasket.vue"),
        meta: {
          title: "退筐退款",
          icon: " ",
        },
      },
      {
        path: "applicationForDrawback",
        name: "applicationForDrawback",
        hidden: true,
        component: () =>
          import("@/views/refundManagement/applicationForDrawback.vue"),
        meta: {
          title: "申请退款",
          icon: " ",
        },
      },
      {
        path: "iSubmitRARDetails",
        name: "iSubmitRARDetails",
        hidden: true,
        component: () =>
          import("@/views/refundManagement/details/iSubmitRARDetails.vue"),
        meta: {
          title: "我提交的退货单详情",
          icon: " ",
        },
      },
      {
        path: "iReceiveRARDetails",
        name: "iReceiveRARDetails",
        hidden: true,
        component: () =>
          import("@/views/refundManagement/details/iReceiveRARDetails.vue"),
        meta: {
          title: "处理的退货单详情",
          icon: " ",
        },
      },
      {
        path: "iSubmitRARDetailsOR",
        name: "iSubmitRARDetailsOR",
        hidden: true,
        component: () =>
          import("@/views/refundManagement/details/iSubmitRARDetailsOR.vue"),
        meta: {
          title: "我提交的退款单详情",
          icon: " ",
        },
      },
      {
        path: "iReceiveRARDetailsOR",
        name: "iReceiveRARDetailsOR",
        hidden: true,
        component: () =>
          import("@/views/refundManagement/details/iReceiveRARDetailsOR.vue"),
        meta: {
          title: "处理的退货单详情",
          icon: " ",
        },
      },
      {
        path: "createrefundBasket",
        name: "createrefundBasket",
        hidden: true,
        component: () =>
          import("@/views/refundManagement/createrefundBasket.vue"),
        meta: {
          title: "新建退还筐子单",
          icon: " ",
        },
      },
      {
        path: "changerefundBasket",
        name: "changerefundBasket",
        hidden: true, // 是否在左侧菜单中显示
        component: () =>
          import("@/views/refundManagement/changerefundBasket.vue"),
        meta: {
          title: "修改退还筐子单",
          icon: " ",
        },
      },
      {
        path: "backBasketsheet",
        name: "backBasketsheet",
        hidden: true,
        component: () => import("@/views/refundManagement/backBasketsheet.vue"),
        meta: {
          title: "新建退入筐子单",
          icon: " ",
        },
      },
      {
        path: "changebackBasket",
        name: "changebackBasket",
        hidden: true, // 是否在左侧菜单中显示
        component: () =>
          import("@/views/refundManagement/changebackBasket.vue"),
        meta: {
          title: "修改退入筐子单",
          icon: " ",
        },
      },
      {
        path: "refundInformation",
        name: "refundInformation",
        hidden: true, // 是否在左侧菜单中显示
        component: () =>
          import("@/views/refundManagement/refundInformation.vue"),
        meta: {
          title: "退款信息",
          icon: " ",
        },
      },
      {
        path: "goodsReturnInformation/:id",
        name: "goodsReturnInformation",
        hidden: true, // 是否在左侧菜单中显示
        component: () =>
          import("@/views/refundManagement/goodsReturnInformation.vue"),
        meta: {
          title: "退货信息",
          icon: " ",
        },
      },
      {
        path: "editrefundInformation",
        name: "editrefundInformation",
        hidden: true, // 是否在左侧菜单中显示
        component: () =>
          import("@/views/refundManagement/editrefundInformation.vue"),
        meta: {
          title: "编辑退货信息",
          icon: " ",
        },
      },
      {
        path: "refundsGoodCollectionRecord",
        name: "refundsGoodCollectionRecord",
        hidden: true,
        component: () =>
          import("@/views/refundManagement/details/collectionRecord/index.vue"),
        meta: {
          title: "收款记录",
          icom: " ",
          noCache: true,
        },
      },
      {
        path: "refundsGoodCollectionRecordOR",
        name: "refundsGoodCollectionRecordOR",
        hidden: true,
        component: () =>
          import(
            "@/views/refundManagement/details/collectionRecordOR/index.vue"
          ),
        meta: {
          title: "收款记录",
          icom: " ",
          noCache: true,
        },
      },
      {
        path: "refundsGoodPaymentRecord",
        name: "refundsGoodPaymentRecord",
        hidden: true,
        component: () =>
          import("@/views/refundManagement/details/paymentRecord/index.vue"),
        meta: {
          title: "付款记录",
          icom: " ",
          noCache: true,
        },
      },
      {
        path: "refundsGoodPaymentRecordOR",
        name: "refundsGoodPaymentRecordOR",
        hidden: true,
        component: () =>
          import("@/views/refundManagement/details/paymentRecordOR/index.vue"),
        meta: {
          title: "付款记录",
          icom: " ",
          noCache: true,
        },
      },
    ],
  },
  {
    path: "/frameManage",
    component: Layout,
    meta: {
      icon: "frameManage",
      title: "筐子管理",
    },
    children: [
      {
        path: "currentInventory",
        name: "currentInventory",
        component: () =>
          import("@/views/frameManage/currentInventory/index.vue"),
        meta: {
          title: "当前库存",
          icon: " ",
          noCache: true,
        },
      },
      {
        path: "addOwnBasket",
        name: "addOwnBasket",
        hidden: true, // 是否在左侧菜单中显示
        component: () =>
          import("@/views/frameManage/currentInventory/addOwnBasket.vue"),
        meta: {
          title: "添加自有筐子",
          icon: " ",
        },
      },
      {
        path: "currentBasketDetails",
        name: "currentBasketDetails",
        hidden: true, // 是否在左侧菜单中显示
        component: () =>
          import(
            "@/views/frameManage/currentInventory/currentBasketDetails.vue"
          ),
        meta: {
          title: "筐子详情",
          icon: " ",
          noCache: true, // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
        },
      },
      {
        path: "basketOverflow",
        name: "basketOverflow",
        hidden: true, // 是否在左侧菜单中显示
        component: () =>
          import("@/views/frameManage/currentInventory/basketOverflow.vue"),
        meta: {
          title: "报溢筐子",
          icon: " ",
          noCache: true, // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
        },
      },
      {
        path: "basketLost",
        name: "basketLost",
        hidden: true, // 是否在左侧菜单中显示
        component: () =>
          import("@/views/frameManage/currentInventory/basketLost.vue"),
        meta: {
          title: "报失筐子",
          icon: " ",
          noCache: true, // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
        },
      },
      {
        path: "scrapBasket",
        name: "scrapBasket",
        hidden: true, // 是否在左侧菜单中显示
        component: () =>
          import("@/views/frameManage/currentInventory/scrapBasket.vue"),
        meta: {
          title: "报废筐子",
          icon: " ",
          noCache: true, // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
        },
      },
      {
        path: "emptyBasket",
        name: "emptyBasket",
        hidden: true, // 是否在左侧菜单中显示
        component: () =>
          import("@/views/frameManage/currentInventory/emptyBasket.vue"),
        meta: {
          title: "腾空筐子",
          icon: " ",
          noCache: true, // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
        },
      },
      {
        path: "myFrame",
        name: "myFrame",
        component: () => import("@/views/frameManage/myFrame/index.vue"),
        meta: {
          title: "我的筐子",
          icon: " ",
          noCache: true,
        },
      },
      {
        path: "addSelfPurchaseBasket",
        name: "addSelfPurchaseBasket",
        hidden: true, // 是否在左侧菜单中显示
        component: () =>
          import("@/views/frameManage/myFrame/addSelfPurchaseBasket.vue"),
        meta: {
          title: "添加自购筐子",
          icon: " ",
        },
      },
      {
        path: "myFrameBasketDetails",
        name: "myFrameBasketDetails",
        hidden: true, // 是否在左侧菜单中显示
        component: () =>
          import("@/views/frameManage/myFrame/myFrameBasketDetails.vue"),
        meta: {
          title: "自购筐子明细",
          icon: " ",
          noCache: true, // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
        },
      },
      {
        path: "myFrameBasketLost",
        name: "myFrameBasketLost",
        hidden: true, // 是否在左侧菜单中显示
        component: () =>
          import("@/views/frameManage/myFrame/myFrameBasketLost.vue"),
        meta: {
          title: "报失筐子",
          icon: " ",
          noCache: true, // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
        },
      },
      {
        path: "myFrameScrapBasket",
        name: "myFrameScrapBasket",
        hidden: true, // 是否在左侧菜单中显示
        component: () =>
          import("@/views/frameManage/myFrame/myFrameScrapBasket.vue"),
        meta: {
          title: "报废筐子",
          icon: " ",
          noCache: true, // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
        },
      },
      {
        path: "basketInOut",
        name: "basketInOut",
        component: () => import("@/views/frameManage/basketInOut/index.vue"),
        meta: {
          title: "筐子进出明细",
          icon: " ",
        },
      },
      {
        path: "saleOrder",
        name: "saleOrder",
        hidden: true,
        component: () =>
          import("@/views/frameManage/basketInOut/modules/saleOrder.vue"),
        meta: {
          title: "售出单详情",
          icom: " ",
        },
      },
      {
        path: "saleOrderCollectionRecord",
        name: "saleOrderCollectionRecord",
        hidden: true,
        component: () =>
          import(
            "@/views/frameManage/basketInOut/modules/collectionRecord/index.vue"
          ),
        meta: {
          title: "收款记录",
          icom: " ",
          noCache: true,
        },
      },
      {
        path: "purchaseOrder",
        name: "purchaseOrder",
        hidden: true,
        component: () =>
          import("@/views/frameManage/basketInOut/modules/purchaseOrder.vue"),
        meta: {
          title: "购入单详情",
          icom: " ",
        },
      },
      {
        path: "purchaseOrderpaymentRecord",
        name: "purchaseOrderpaymentRecord",
        hidden: true,
        component: () =>
          import(
            "@/views/frameManage/basketInOut/modules/paymentRecord/index.vue"
          ),
        meta: {
          title: "付款记录",
          icom: " ",
          noCache: true,
        },
      },
      {
        path: "purchasemyOrder",
        name: "purchasemyOrder",
        hidden: true,
        component: () =>
          import("@/views/frameManage/basketInOut/modules/purchasemyOrder.vue"),
        meta: {
          title: "自购单详情",
          icom: " ",
        },
      },
      {
        path: "scrapOrder",
        name: "scrapOrder",
        hidden: true,
        component: () =>
          import("@/views/frameManage/basketInOut/modules/scrapOrder.vue"),
        meta: {
          title: "报废单详情",
          icom: " ",
        },
      },
      {
        path: "reportlossOrder",
        name: "reportlossOrder",
        hidden: true,
        component: () =>
          import("@/views/frameManage/basketInOut/modules/reportlossOrder.vue"),
        meta: {
          title: "报失单详情",
          icom: " ",
        },
      },
      {
        path: "overflowOrder",
        name: "overflowOrder",
        hidden: true,
        component: () =>
          import("@/views/frameManage/basketInOut/modules/overflowOrder.vue"),
        meta: {
          title: "报溢单详情",
          icom: " ",
        },
      },
      {
        path: "emptyOrder",
        name: "emptyOrder",
        hidden: true,
        component: () =>
          import("@/views/frameManage/basketInOut/modules/emptyOrder.vue"),
        meta: {
          title: "腾空单详情",
          icom: " ",
        },
      },
      {
        path: "ownbasketOrder",
        name: "ownbasketOrder",
        hidden: true,
        component: () =>
          import("@/views/frameManage/basketInOut/modules/ownbasketOrder.vue"),
        meta: {
          title: "自家已有入库单详情",
          icom: " ",
        },
      },
      {
        path: "baskrefundOrder",
        name: "baskrefundOrder",
        hidden: true,
        component: () =>
          import("@/views/frameManage/basketInOut/modules/baskrefundOrder.vue"),
        meta: {
          title: "退还筐子详情",
          icom: " ",
        },
      },
      {
        path: "baskrefundOrderCollectionRecord",
        name: "baskrefundOrderCollectionRecord",
        hidden: true,
        component: () =>
          import(
            "@/views/frameManage/basketInOut/modules/baskrefundOrderCollectionRecord/index.vue"
          ),
        meta: {
          title: "收款记录",
          icom: " ",
          noCache: true,
        },
      },
      {
        path: "backintorefundOrder",
        name: "backintorefundOrder",
        hidden: true,
        component: () =>
          import(
            "@/views/frameManage/basketInOut/modules/backintorefundOrder.vue"
          ),
        meta: {
          title: "处理的退款单详情",
          icom: " ",
        },
      },
      {
        path: "BasketBuyDetail",
        name: "BasketBuyDetail",
        hidden: true,
        component: () => import("@/views/frameManage/basketBuy/detail.vue"),
        meta: {
          title: "购入筐子详情",
          icom: " ",
        },
      },
      {
        path: "BasketSoldDetail",
        name: "BasketSoldDetail",
        hidden: true,
        component: () => import("@/views/frameManage/basketSold/detail.vue"),
        meta: {
          title: "售出筐子详情",
          icom: " ",
        },
      },
    ],
  },
  // {
  //     path: '/orderManagement',
  //     component: Layout,
  //     redirect: "/refundsGoods",
  //     meta: {
  //         icon: 'el-icon-menu',
  //         title: '订单管理'
  //     },
  //     children: [{
  //             path: 'basketBuy',
  //             name: 'basketBuy',
  //             component: () => import('@/views/frameManage/basketBuy/index.vue'),
  //             meta: {
  //                 title: '筐子购入单管理',
  //                 icom: ' '
  //             }
  //         }, {
  //             path: 'BasketBuyAdd',
  //             name: 'BasketBuyAdd',
  //             hidden: true,
  //             component: () => import('@/views/frameManage/basketBuy/add.vue'),
  //             meta: {
  //                 title: '新建筐子购入单',
  //                 icom: ' '
  //             }
  //         }, {
  //             path: 'BasketBuyDetail',
  //             name: 'BasketBuyDetail',
  //             hidden: true,
  //             component: () => import('@/views/frameManage/basketBuy/detail.vue'),
  //             meta: {
  //                 title: '购入筐子详情',
  //                 icom: ' '
  //             }
  //         }, {
  //             path: 'basketSold',
  //             name: 'basketSold',
  //             component: () => import('@/views/frameManage/basketSold/index.vue'),
  //             meta: {
  //                 title: '筐子售出单管理',
  //                 icom: ' '
  //             }
  //         },
  //         {
  //             path: 'BasketSoldDetail',
  //             name: 'BasketSoldDetail',
  //             hidden: true,
  //             component: () => import('@/views/frameManage/basketSold/detail.vue'),
  //             meta: {
  //                 title: '售出筐子详情',
  //                 icom: ' '
  //             }
  //         },
  //         {
  //             path: 'BasketSoldAdd',
  //             name: 'BasketSoldAdd',
  //             hidden: true,
  //             component: () => import('@/views/frameManage/basketSold/add.vue'),
  //             meta: {
  //                 title: '新建筐子售出单',
  //                 icom: ' '
  //             }
  //         }
  //     ]
  // },
  {
    path: "/customerManage",
    component: Layout,
    alwaysShow: true,
    redirect: "/customerList",
    meta: {
      icon: "customerManage",
      title: "客户管理",
    },
    children: [
      {
        path: "customerList",
        name: "customerList",
        component: () => import("@/views/customerManage/customerList.vue"),
        meta: {
          title: "客户列表",
          icon: " ",
        },
      },
      {
        path: "customerDetail",
        name: "customerDetail",
        hidden: true,
        component: () => import("@/views/customerManage/customerDetail.vue"),
        meta: {
          title: "客户详情",
          noCache: true, // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
          icon: " ",
        },
      },
    ],
  },
  {
    path: "/financialManage",
    component: Layout,
    redirect: "/financialHome",
    meta: {
      icon: "financialManage",
      title: "财务管理",
    },
    children: [
      {
        path: "financialHome",
        name: "financialHome",
        component: () => import("@/views/financialManage/financialHome.vue"),
        meta: {
          title: "财务首页",
          icon: " ",
        },
      },
      {
        path: "receivePayment",
        name: "receivePayment",
        component: () =>
          import("@/views/financialManage/receivePayment/receivePayment.vue"),
        meta: {
          title: "收付款",
          icon: " ",
        },
      },
      {
        path: "paymentDetail",
        name: "paymentDetail",
        hidden: true,
        component: () =>
          import(
            "@/views/financialManage/receivePayment/modules/details/paymentDetail.vue"
          ),
        meta: {
          title: "收款详情", // 代收款
          icon: " ",
          noCache: true,
        },
      },
      {
        path: "transferManage",
        name: "transferManage",
        component: () => import("@/views/financialManage/transferManage.vue"),
        meta: {
          title: "转账管理",
          icon: " ",
        },
      },
      {
        path: "Atransfer",
        name: "Atransfer",
        hidden: true,
        component: () =>
          import("@/views/financialManage/compoent/transfer.vue"),
        meta: {
          title: "发起转账",
          icon: " ",
          noCache: false,
        },
      },
      {
        path: "transferDetail",
        name: "transferDetail",
        hidden: true,
        component: () =>
          import("@/views/financialManage/compoent/transferDetail.vue"),
        meta: {
          title: "转账详情",
          icon: " ",
        },
      },
      {
        path: "accountingManage",
        name: "accountingManage",
        component: () => import("@/views/financialManage/accountingManage.vue"),
        meta: {
          title: "记账管理",
          icon: " ",
        },
      },
      {
        path: "accounting",
        name: "accounting",
        hidden: true,
        component: () =>
          import("@/views/financialManage/compoent/accounting.vue"),
        meta: {
          title: "新建记账",
          icon: " ",
          noCache: false,
        },
      },
      {
        path: "accountingDetail",
        name: "accountingDetail",
        hidden: true,
        component: () =>
          import("@/views/financialManage/compoent/accountingDetail.vue"),
        meta: {
          title: "记账详情",
          icon: " ",
        },
      },
      {
        path: "creditLine",
        name: "creditLine",
        component: () => import("@/views/financialManage/creditLine.vue"),
        meta: {
          title: "赊账授信",
          icon: " ",
        },
      },
      {
        path: "fundRevenueExpenditure",
        name: "fundRevenueExpenditure",
        component: () =>
          import(
            "@/views/financialManage/fundRevenueExpenditure/fundRevenueExpenditure.vue"
          ),
        meta: {
          title: "资金收支",
          icon: " ",
        },
      },
      {
        path: "fundPaymentDetail",
        name: "fundPaymentDetail",
        hidden: true,
        component: () =>
          import(
            "@/views/financialManage/fundRevenueExpenditure/fundPaymentDetail.vue"
          ),
        meta: {
          title: "付款详情", // 待对方收款
          icon: " ",
          noCache: true,
        },
      },
      {
        path: "fundPaidDetail",
        name: "fundPaidDetail",
        hidden: true,
        component: () =>
          import(
            "@/views/financialManage/fundRevenueExpenditure/fundPaidDetail.vue"
          ),
        meta: {
          title: "收款详情", // 已付款
          icon: " ",
          noCache: true,
        },
      },
      {
        path: "fundPaidForDetail",
        name: "fundPaidForDetail",
        hidden: true,
        component: () =>
          import(
            "@/views/financialManage/fundRevenueExpenditure/fundPaidForDetail.vue"
          ),
        meta: {
          title: "收款详情", // 已收款
          icon: " ",
          noCache: true,
        },
      },
      {
        path: "fundingStatistics",
        name: "fundingStatistics",
        hidden: true,
        component: () =>
          import(
            "@/views/financialManage/fundRevenueExpenditure/fundingStatistics.vue"
          ),
        meta: {
          title: "资金统计",
          icon: " ",
          noCache: true,
        },
      },
      {
        path: "currentPayment",
        name: "currentPayment",
        component: () => import("@/views/financialManage/currentPayment.vue"),
        meta: {
          title: "往来款",
          icon: " ",
        },
      },
    ],
  },
  {
    path: "/costsetting",
    component: Layout,
    redirect: "/fixedCost",
    meta: {
      icon: "fixedCost",
      title: "成本设置",
    },
    children: [
      {
        path: "fixedCost",
        name: "fixedCost",
        component: () => import("@/views/costsetting/fixedCost.vue"),
        meta: {
          title: "固定成本",
          icon: " ",
        },
      },
      // {
      //     path: 'zhaoxiyaotest',
      //     name: "zhaoxiyaotest",
      //     component: () => import('@/views/costsetting/zhaoxiyaotest.vue'),
      //     meta: {
      //         title: '临时入口',
      //         icon: ' ',
      //     }
      // },
      {
        path: "historyDateil",
        name: "historyDateil",
        hidden: true,
        component: () => import("@/views/costsetting/historyDateil.vue"),
        meta: {
          icon: "el-icon-menu",
          title: "订单管理",
        },
        children: [
          {
            path: "commoditySalesOrder",
            name: "commoditySalesOrder",
            component: () => import("@/views/orderManage/commodity-sale"),
            meta: {
              title: "商品销售单",
              icon: " ",
            },
          },
          {
            path: "commoditySalesOrderDetail",
            name: "commoditySalesOrderDetail",
            hidden: true,
            component: () =>
              import("@/views/orderManage/commodity-sale/detail"),
            meta: {
              title: "销售单详情",
              icon: " ",
              activeMenu: "/",
            },
          },
          // {
          //     path: 'commoditySalesAddcollections',
          //     name: "commoditySalesAddcollections",
          //     hidden: true,
          //     component: () => import('@/views/orderManage/commoditySalesOrderDetail/commoditySalesAddcollections.vue'),
          //     meta: {
          //         title: '添加收款',
          //         icon: ' ',
          //     }
          // },
          {
            path: "purchaseOrdersDetail",
            name: "purchaseOrdersDetail",
            hidden: true,
            component: () =>
              import("@/views/orderManage/commodity-purchase/detail.vue"),
            meta: {
              title: "采购单详情",
              icon: " ",
              activeMenu: "/",
            },
          },
          {
            path: "demandOrder",
            name: "demandOrder",
            hidden: true,
            component: () => import("@/views/orderManage/demandOrder.vue"),
            meta: {
              title: "查看需求单",
              icom: "",
            },
          },
          {
            path: "drafts",
            name: "drafts",
            hidden: true,
            component: () => import("@/views/orderManage/drafts.vue"),
            meta: {
              title: "查看草稿箱",
              icom: "",
            },
          },
          {
            path: "historySellOrder",
            name: "historySellOrder",
            hidden: true,
            component: () => import("@/views/orderManage/historySellOrder.vue"),
            meta: {
              title: "查看历史销售单",
              icom: "",
            },
          },
          {
            path: "addSalesTicket",
            name: "addSalesTicket",
            hidden: true,
            component: () => import("@/views/orderManage/addSalesTicket.vue"),
            meta: {
              title: "新建销售单",
              icon: " ",
              noCache: false,
            },
          },
          {
            path: "addSalesCommodity",
            name: "addSalesCommodity",
            hidden: true,
            component: () =>
              import("@/views/orderManage/addSalesCommodity.vue"),
            meta: {
              title: "选择商品",
              icon: " ",
              noCache: false,
            },
          },
          {
            path: "editSalesCommodity",
            name: "editSalesCommodity",
            hidden: true,
            component: () =>
              import("@/views/orderManage/editSalesCommodity.vue"),
            meta: {
              title: "编辑销售商品",
              icon: " ",
              noCache: false,
            },
          },
          {
            path: "commodityPurchaseOrder",
            name: "commodityPurchaseOrder",
            component: () =>
              import("@/views/orderManage/commodity-purchase/index.vue"),
            meta: {
              title: "商品采购单",
              icon: " ",
            },
          },
          {
            path: "basketBuy",
            name: "basketBuy",
            component: () => import("@/views/frameManage/basketBuy/index.vue"),
            meta: {
              title: "筐子购入单",
              icon: " ",
            },
          },
          {
            path: "BasketBuyAdd",
            name: "BasketBuyAdd",
            hidden: true,
            component: () => import("@/views/frameManage/basketBuy/add.vue"),
            meta: {
              title: "新建筐子购入单",
              icom: "",
              noCache: true,
            },
          },
          {
            path: "BasketBuyDetail",
            name: "BasketBuyDetail",
            hidden: true,
            component: () => import("@/views/frameManage/basketBuy/detail.vue"),
            meta: {
              title: "购入筐子详情",
              icom: "",
            },
          },
          {
            path: "basketSold",
            name: "basketSold",
            component: () => import("@/views/frameManage/basketSold/index.vue"),
            meta: {
              title: "筐子售出单",
              icon: " ",
            },
          },
          {
            path: "BasketSoldDetail",
            name: "BasketSoldDetail",
            hidden: true,
            component: () =>
              import("@/views/frameManage/basketSold/detail.vue"),
            meta: {
              title: "售出筐子详情",
              icom: " ",
            },
          },
          {
            path: "BasketSoldAdd",
            name: "BasketSoldAdd",
            hidden: true,
            component: () => import("@/views/frameManage/basketSold/add.vue"),
            meta: {
              title: "新建筐子售出单",
              icom: " ",
              noCache: true,
            },
          },
        ],
      },
      {
        path: "purchaseStatistics",
        name: "purchaseStatistics",
        component: () =>
          import("@/views/statisticalReport/purchaseStatistics.vue"),
        meta: {
          title: "采购统计",
          icon: " ",
        },
      },
      {
        path: "salesAccountingStatistics",
        name: "saleStatistics",
        component: () =>
          import("@/views/statisticalReport/salesAccountingStatistics.vue"),
        meta: {
          title: "销售记账统计",
          icon: " ",
        },
      },
      {
        path: "foodSalesStatistics",
        name: "foodSalesStatistics",
        component: () =>
          import("@/views/statisticalReport/foodSalesStatistics.vue"),
        meta: {
          title: "菜品销售统计",
          icon: " ",
        },
      },
      {
        path: "operationCapitalStatistics",
        name: "operationCapitalStatistics",
        component: () =>
          import("@/views/statisticalReport/operationCapitalStatistics.vue"),
        meta: {
          title: "经营与资金往来统计",
          icon: " ",
        },
      },
      {
        path: "deliveryStatistics",
        name: "deliveryStatistics",
        component: () =>
          import("@/views/statisticalReport/deliveryStatistics.vue"),
        meta: {
          title: "配送统计",
          icon: " ",
        },
      },
      {
        path: "operationProfitStatistics",
        name: "operationProfitStatistics",
        component: () =>
          import("@/views/statisticalReport/operationProfitStatistics.vue"),
        meta: {
          title: "经营与利润统计",
          icon: " ",
        },
      },
      {
        path: "costProfitStatistics",
        name: "costProfitStatistics",
        component: () =>
          import("@/views/statisticalReport/costProfitStatistics.vue"),
        meta: {
          title: "成本与利润统计",
          icon: " ",
        },
      },
    ],
  },

  {
    path: "/personalCenter",
    component: Layout,
    alwaysShow: true,
    redirect: "/personalCenter",
    meta: {
      icon: "personalCenter",
      title: "我的",
    },
    children: [
      {
        path: "personalCenter",
        name: "personalCenter",
        component: () => import("@/views/personalCenter/index.vue"),
        meta: {
          title: "个人信息",
          icon: " ",
        },
      },
      {
        path: "passwordSettings",
        name: "passwordSettings",
        component: () => import("@/views/personalCenter/passwordSettings.vue"),
        meta: {
          title: "密码设置",
          icon: " ",
        },
      },
      {
        path: "wantFeedback",
        name: "wantFeedback",
        component: () => import("@/views/personalCenter/wantFeedback.vue"),
        meta: {
          title: "我要反馈",
          icon: " ",
        },
      },
    ],
  },
  {
    path: "/distriBution",
    component: Layout,
    alwaysShow: true,
    redirect: "/distriBution",
    meta: {
      icon: "personalCenter",
      title: "配送",
    },
    children: [
      {
        path: "deliveryOrder",
        name: "deliveryOrder",
        component: () => import("@/views/distriBution/deliveryOrder.vue"),
        meta: {
          title: "配送单",
          icon: " ",
        },
      },
      {
        path: "deliveryRefund",
        name: "deliveryRefund",
        component: () => import("@/views/distriBution/deliveryRefund.vue"),
        meta: {
          title: "配送退款单",
          icon: " ",
        },
      },
      {
        path: "deliveryReturnNote",
        name: "deliveryReturnNote",
        component: () => import("@/views/distriBution/deliveryReturnNote.vue"),
        meta: {
          title: "配送退货单",
          icon: " ",
        },
      },
      {
        path: "distributionPointManage",
        name: "distributionPointManage",
        component: () =>
          import("@/views/distriBution/distributionPointManage.vue"),
        meta: {
          title: "配送点管理",
          icon: " ",
        },
      },
    ],
  },
  {
    path: "/salesBookkeeping",
    component: Layout,
    alwaysShow: true,
    redirect: "/salesBookkeeping",
    meta: {
      icon: "personalCenter",
      title: "销售记账",
    },
    children: [
      {
        path: "salesBookkeeping",
        name: "salesBookkeeping",
        component: () =>
          import("@/views/salesBookkeeping/salesBookkeeping.vue"),
        meta: {
          title: "销售记账单",
          icon: " ",
        },
      },
    ],
  },
  {
    path: "/foodSalesBookkeeping",
    component: Layout,
    alwaysShow: true,
    redirect: "/foodSalesBookkeeping",
    meta: {
      icon: "personalCenter",
      title: "菜品销售记账",
    },
    children: [
      {
        path: "foodSalesBookkeeping",
        name: "foodSalesBookkeeping",
        component: () =>
          import("@/views/foodSalesBookkeeping/foodSalesBookkeeping.vue"),
        meta: {
          title: "菜品管理",
          icon: " ",
        },
      },
      {
        path: "foodBookkeeping",
        name: "foodBookkeeping",
        component: () =>
          import("@/views/foodSalesBookkeeping/foodBookkeeping.vue"),
        meta: {
          title: "菜品记账",
          icon: " ",
        },
      },
    ],
  },
  {
    path: "/componetns",
    component: Layout,
    redirect: "/editor",
    meta: {
      icon: "el-icon-menu",
      title: "组件",
    },
    children: [
      {
        path: "editor",
        name: "editor",
        component: () => import("@/views/component/editor.vue"),
        meta: {
          title: "富文本",
          icon: "el-icon-edit",
        },
      },
      {
        path: "icon",
        name: "icon",
        component: () => import("@/views/component/icon.vue"),
        meta: {
          title: "图标",
          icon: "el-icon-eleme",
        },
      },
      {
        path: "img-upload",
        name: "img-upload",
        component: () => import("@/views/component/imgUpload.vue"),
        meta: {
          title: "上传图片",
          icon: "el-icon-upload",
        },
      },
      {
        path: "label",
        name: "label",
        component: () => import("@/views/component/label.vue"),
        meta: {
          title: "标签页",
          icon: "el-icon-menu",
        },
      },
      {
        path: "verify",
        name: "verify",
        component: () => import("@/views/component/verify.vue"),
        meta: {
          title: "验证工具",
          icon: "el-icon-menu",
        },
      },
      {
        path: "select",
        name: "select",
        component: () => import("@/views/component/select.vue"),
        meta: {
          title: "下拉选择",
          icon: "el-icon-menu",
        },
      },
      {
        path: "table",
        name: "table",
        component: () => import("@/views/layout/table.vue"),
        meta: {
          title: "表格",
          icon: "el-icon-menu",
        },
      },
      {
        path: "form",
        name: "form",
        component: () => import("@/views/layout/form.vue"),
        meta: {
          title: "表单",
          icon: "el-icon-menu",
        },
      },
      {
        path: "page",
        name: "page",
        component: () => import("@/views/layout/main.vue"),
        meta: {
          title: "普通页面",
          icon: "el-icon-menu",
        },
      },
      {
        path: "other",
        name: "other",
        component: () => import("@/views/component/other.vue"),
        meta: {
          title: "其他",
          icon: "el-icon-menu",
        },
      },
    ],
  },
  {
    path: "/table",
    component: Layout,
    hidden: true,
    meta: {
      title: "表格",
    },
    redirect: "/componetns/table",
    children: [
      {
        path: "add",
        component: (resolve) => require(["@/views/layout/add"], resolve),
        name: "Add",
        meta: {
          icon: "",
          activeMenu: "/layout/table",
        },
        beforeEnter: (to, from, next) => {
          switch (to.query.type) {
            case "add":
              to.meta.title = "新增";
              break;
            case "edit":
              to.meta.title = "编辑";
              break;
            case "view":
              to.meta.title = "查看";
              break;
          }
          next();
        },
      },
    ],
  },
  {
    path: "/error",
    component: Layout,
    redirect: "/404",
    meta: {
      icon: "el-icon-menu",
      title: "错误页面",
    },
    children: [
      {
        path: "404",
        name: "404",
        component: () => import("@/views/error-page/404.vue"),
        meta: {
          title: "404",
          icon: "el-icon-warning",
        },
      },
      {
        path: "401",
        name: "401",
        component: () => import("@/views/error-page/401.vue"),
        meta: {
          title: "401",
          icon: "el-icon-warning",
        },
      },
    ],
  },
];

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({
      y: 0,
    }),
    routes: constantRoutes,
  });

const router = createRouter();

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher; // reset router
}

const originalPush = Router.prototype.push;

Router.prototype.push = function push(location, onResolve, onReject) {
  if (onResolve || onReject)
    return originalPush.call(this, location, onResolve, onReject);
  return originalPush.call(this, location).catch((err) => err);
};

export default router;
