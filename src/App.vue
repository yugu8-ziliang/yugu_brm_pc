<template>
  <div id="app">
    <div class="disBu">
      <el-dropdown placement="top" @command="handleCommand">
        <el-button type="primary" circle size="mini">
          <svg-icon
            icon-class="horizontalbar"
            class="el-input__icon input-icon"
          />
        </el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item
            command="a"
            style="display: flex; align-items: center"
          >
            <el-image
              style="
                width: 16px;
                height: 16px;
                border-radius: 17%;
                margin-right: 5px;
              "
              :src="src1"
              fit="fit"
            ></el-image
            >快捷操作</el-dropdown-item
          >
          <el-dropdown-item
            command="b"
            style="display: flex; align-items: center"
          >
            <el-image
              style="
                width: 16px;
                height: 16px;
                border-radius: 17%;
                margin-right: 5px;
              "
              :src="src2"
              fit="fit"
            ></el-image
            >更多</el-dropdown-item
          >
          <el-dropdown-item
            command="c"
            style="display: flex; align-items: center"
          >
            <el-image
              style="
                width: 16px;
                height: 16px;
                border-radius: 17%;
                margin-right: 5px;
              "
              :src="src3"
              fit="fit"
            ></el-image
            >客服</el-dropdown-item
          >
          <el-dropdown-item
            command="d"
            style="display: flex; align-items: center"
          >
            <el-image
              style="
                width: 16px;
                height: 16px;
                border-radius: 17%;
                margin-right: 5px;
              "
              :src="src4"
              fit="fit"
            ></el-image
            >帮助</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>

      <el-drawer
        :size="750"
        title="快捷操作"
        :visible.sync="drawer"
        direction="rtl"
        :before-close="handleClose"
      >
        <div style="padding: 15px">
          <div v-for="(item, index) in tableList1" :key="index">
            <p>{{ item.name }}</p>
            <div style="padding: 15px 0px; display: flex">
              <div
                v-for="(item1, index1) in item.data"
                :key="index1"
                style="
                  width: 90px;
                  display: flex;
                  flex-direction: column;
                  justify-content: center;
                  align-items: center;
                  cursor: pointer;
                "
                @click="handleRouter(item1.router)"
              >
                <el-image
                  style="width: 36px; height: 36px; border-radius: 17%"
                  :src="item1.url"
                  fit="fit"
                ></el-image>
                <p
                  style="font-size: 13px; margin-top: 4px; text-align: center"
                  v-html="item1.name"
                ></p>
              </div>
            </div>
          </div>
        </div>
      </el-drawer>
    </div>

    <div class="disBu1" v-show="scrollTopCount > 100">
      <el-button icon="el-icon-arrow-up" circle size="mini" @click="toTop()">
      </el-button>
    </div>
    <router-view ref="scrollBarRef"> </router-view>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      drawer: false,
      scrollTopCount: 0,
      tableList1: [],
      tableList: [
        {
          isStatus: [1, 2, 3, 4, 5],
          name: "商品交易",
          data: [
            {
              isStatus: [1, 2],
              name: "新建销售单",
              url: require("@/assets/image/kuaijie/1.png"),
              router: "/orderManagement/addSalesTicket",
            },
            {
              isStatus: [3, 4, 5],
              name: "新建需求单",
              url: require("@/assets/image/kuaijie/28.png"),
              router: "/demandManage/addNewrequest",
            },
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "发起退货退款",
              url: require("@/assets/image/kuaijie/2.png"),
              router: "/refundManagement/applicationForDrawback",
            },
            {
              isStatus: [1, 2],
              name: "处理退货退款",
              url: require("@/assets/image/kuaijie/3.png"),
              router: "/refundManagement/applicationForDrawback",
            },
            {
              isStatus: [3, 4],
              name: "新建销售记账",
              url: require("@/assets/image/kuaijie/3.png"),
              router: "/salesBookkeeping/salesBookkeeping",
            },
          ],
        },
        {
          isStatus: [3],
          name: "配送交易",
          data: [
            {
              isStatus: [3],
              name: "新建配送单",
              url: require("@/assets/image/kuaijie/29.png"),
              router: "",
            },
            {
              isStatus: [3],
              name: "处理<br/>配送退货退款",
              url: require("@/assets/image/kuaijie/30.png"),
              router: "",
            },
            {
              isStatus: [3],
              name: "处理<br/>配送退筐退款",
              url: require("@/assets/image/kuaijie/31.png"),
              router: "",
            },
          ],
        },
        {
          isStatus: [5],
          name: "菜品销售",
          data: [
            {
              isStatus: [5],
              name: "新建菜品 销售记账",
              url: require("@/assets/image/kuaijie/32.png"),
              router: "/foodSalesBookkeeping/foodBookkeeping",
            },
          ],
        },
        {
          isStatus: [1, 2, 3, 4, 5],
          name: "筐子交易",
          data: [
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "售出筐子",
              url: require("@/assets/image/kuaijie/4.png"),
              router: "/orderManagement/basketSold",
            },
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "购入筐子",
              url: require("@/assets/image/kuaijie/5.png"),
              router: "/orderManagement/BasketBuyAdd",
            },
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "发起退筐退款",
              url: require("@/assets/image/kuaijie/6.png"),
              router: "/refundManagement/refundsBasket",
            },
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "处理退筐退款",
              url: require("@/assets/image/kuaijie/7.png"),
              router: "/refundManagement/refundsBasket",
            },
          ],
        },
        {
          isStatus: [1, 2, 3, 4, 5],
          name: "商品库存相关",
          data: [
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "添加商品",
              url: require("@/assets/image/kuaijie/8.png"),
              router: "/commodityManage/addCommodity",
            },
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "添加入库",
              url: require("@/assets/image/kuaijie/9.png"),
              router: "/commodityManage/commodityList",
            },
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "新建盘点单",
              url: require("@/assets/image/kuaijie/10.png"),
              router: "/commodityManage/takeStock",
            },
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "商品报损",
              url: require("@/assets/image/kuaijie/11.png"),
              router: "/commodityManage/commodityList",
            },
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "商品报溢",
              url: require("@/assets/image/kuaijie/12.png"),
              router: "/commodityManage/commodityList",
            },
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "单位转换",
              url: require("@/assets/image/kuaijie/13.png"),
              router: "/commodityManage/commodityList",
            },
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "分拣",
              url: require("@/assets/image/kuaijie/14.png"),
              router: "/commodityManage/commodityList",
            },
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "装筐",
              url: require("@/assets/image/kuaijie/15.png"),
              router: "/commodityManage/commodityList",
            },
          ],
        },
        {
          isStatus: [1, 2, 3, 4, 5],
          name: "筐子库存相关",
          data: [
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "添加自有筐子",
              url: require("@/assets/image/kuaijie/16.png"),
              router: "/frameManage/addOwnBasket",
            },
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "添加自购筐子",
              url: require("@/assets/image/kuaijie/17.png"),
              router: "/frameManage/addSelfPurchaseBasket",
            },
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "筐子报损",
              url: require("@/assets/image/kuaijie/18.png"),
              router: "/frameManage/currentInventory",
            },
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "筐子报失",
              url: require("@/assets/image/kuaijie/19.png"),
              router: "/frameManage/currentInventory",
            },
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "筐子报溢",
              url: require("@/assets/image/kuaijie/20.png"),
              router: "/frameManage/currentInventory",
            },
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "腾空筐子",
              url: require("@/assets/image/kuaijie/21.png"),
              router: "/frameManage/currentInventory",
            },
          ],
        },
        {
          isStatus: [1, 2, 3, 4, 5],
          name: "财务相关",
          data: [
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "收付款",
              url: require("@/assets/image/kuaijie/22.png"),
              router: "/financialManage/receivePayment",
            },
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "发起转账",
              url: require("@/assets/image/kuaijie/23.png"),
              router: "/financialManage/Atransfer",
            },
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "新建记账",
              url: require("@/assets/image/kuaijie/24.png"),
              router: "/financialManage/accounting",
            },
            {
              isStatus: [1, 2],
              name: "赊账授信",
              url: require("@/assets/image/kuaijie/25.png"),
              router: "/financialManage/creditLine",
            },
          ],
        },
        {
          isStatus: [1, 2, 3, 4, 5],
          name: "客户相关",
          data: [
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "添加好友",
              url: require("@/assets/image/kuaijie/26.png"),
              router: "/customerManage/customerList",
            },
            {
              isStatus: [1, 2, 3, 4, 5],
              name: "批量添加客户",
              url: require("@/assets/image/kuaijie/27.png"),
              router: "/customerManage/customerList",
            },
          ],
        },
      ],
      src1: require("@/assets/image/kuaijie/33.png"),
      src2: require("@/assets/image/kuaijie/34.png"),
      src3: require("@/assets/image/kuaijie/35.png"),
      src4: require("@/assets/image/kuaijie/36.png"),
    };
  },
  methods: {
    handleCommand(val) {
      if (val == "a") {
        this.drawer = true;
      }
    },
    toTop() {
      document
        .getElementById("app")
        .getElementsByClassName("app-main")[0]
        .getElementsByClassName("el-scrollbar")[0]
        .getElementsByClassName("el-scrollbar__wrap")[0].scrollTop = 0;
    },
    // 跳转
    handleRouter(path) {
      if (path != "" && path) {
        this.$router.push({ path: path });
        this.handleClose();
      } else {
        this.$message({
          message: "当前页面还在更新",
          type: "warning",
          customClass: "war-message",
        });
      }
    },
    handleClose(done) {
      this.drawer = false;
    },
    handleFi() {
      let param = "";
      param = JSON.parse(localStorage.getItem("userInfo"));
      let useri = 0;
      // 经营户 1
      if (param.usertype == 6 || param.usertype == 7) {
        useri = 1;
      } // 供货商 2
      if (param.usertype == 10 || param.usertype == 11) {
        useri = 2;
      }
      // 采购商
      if (param.usertype == 3 || param.usertype == 4) {
        // 生鲜超市 3
        if (param.purchaseType == 2) {
          useri = 3;
        }
        // 农贸市场 4
        if (param.purchaseType == 3) {
          useri = 4;
        }
        // 食堂饭店 5
        if (param.purchaseType == 1) {
          useri = 5;
        }
      }

      this.tableList1 = [];
      for (let i = 0; i < this.tableList.length; i++) {
        const el = this.tableList[i];
        if (el.isStatus.indexOf(useri) != -1) {
          let data1 = [];
          for (let j = 0; j < el.data.length; j++) {
            const el1 = el.data[j];
            if (el1.isStatus.indexOf(useri) != -1) {
              data1.push(el1);
            }
          }

          this.tableList1.push({
            isStatus: el.isStatus,
            name: el.name,
            data: data1,
          });
        }
      }
    },
  },
  mounted() {
    // 动态获取浏览器高度
    this.$store.dispatch(
      "settings/screenHeightSetting",
      document.documentElement.clientHeight
    );
    window.addEventListener(
      "resize",
      () => {
        this.$store.dispatch(
          "settings/screenHeightSetting",
          document.documentElement.clientHeight
        );
      },
      false
    );
    // 监听元素滚动
    var that = this;
    setTimeout(() => {
      const box = document
        .getElementById("app")
        .getElementsByClassName("app-main")[0]
        .getElementsByClassName("el-scrollbar")[0]
        .getElementsByClassName("el-scrollbar__wrap")[0];

      box.addEventListener("scroll", (e) => {
        var scrollTop = e.target.scrollTop;
        that.scrollTopCount = scrollTop;
      });
    }, 500);

    this.handleFi();
  },
};
</script>
<style>
#nprogress .bar {
  background: var(--default-color) !important;
}
.disBu {
  position: fixed !important;
  right: 29px !important;
  top: 70%;
  z-index: 3000;
}
.disBu1 {
  position: fixed !important;
  right: 29px !important;
  top: 90%;
  z-index: 3000;
}
.war-message {
  z-index: 4000 !important;
}
</style>
<style lang="scss">
// @include DEBUG();
</style>