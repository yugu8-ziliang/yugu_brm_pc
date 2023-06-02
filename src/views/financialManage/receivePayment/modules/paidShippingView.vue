<template>
  <!-- 配送退货 -->
  <div
    class="paidShippingViewModel"
    :style="{ '--screenHeight': $store.getters.screenHeight - 250 + 'px' }"
  >
    <div class="flex_dom">
      <div class="paidShippingView-left">
        <el-scrollbar>
          <ul class="paidShippingView-left-ul">
            <li
              v-for="(item, index) in tableDataList"
              :key="index"
              class="paidShippingView-left-li flex_dom flex_item_mid flex_item_between"
              :style="{
                background: tableIndex == index ? '#CEF2ED' : '',
                cursor: 'pointer',
              }"
              @click="handleTable(index)"
            >
              <div style="padding: 0px 10px">
                <div class="flex_dom flex_item_mid" style="margin-bottom: 8px">
                  <div style="font-size: 14px; color: rgba(1, 6, 33, 0.9)">
                    {{ item.custmorName }}
                  </div>
                  <div v-html="handleMerchantType(item.merchantType)"></div>
                  <div
                    style="
                      font-size: 14px;
                      color: rgba(1, 6, 33, 0.9);
                      margin-left: 8px;
                    "
                  >
                    {{ item.custmorPhone }}
                  </div>
                </div>
                <div
                  style="
                    margin-bottom: 8px;
                    font-size: 14px;
                    color: rgba(1, 6, 33, 0.55);
                  "
                >
                  {{ item.companyName }}
                </div>
                <div
                  style="font-size: 12px; color: rgba(221, 76, 77, 1)"
                  v-if="item.isHaveCollection == 1 ? true : false"
                >
                  有待对方确认款项
                </div>
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </div>

      <div class="paidShippingView-right">
        <div class="paidShippingView-amount">
          <i class="el-icon-warning" style="color: rgba(26, 127, 217, 1)"></i>
          <span
            style="
              color: rgba(0, 0, 0, 0.65);
              font-size: 14px;
              margin-right: 32px;
              margin-left: 10px;
            "
            >未付商品采购款：
            <span
              style="color: rgba(1, 6, 33, 0.9); font-size: 20px"
              v-if="tableDataList[tableIndex]"
            >
              {{
                tableDataList[tableIndex].unpaidPrice | intervalFormat(false)
              }}</span
            >

            <span
              v-if="tableData.orderId"
              style="
                color: rgba(1, 6, 33, 0.75);
                font-size: 14px;
                margin-left: 10px;
              "
              >{{ tableDataorder[1]
              }}<span
                @click="handleOrder()"
                style="color: #0ba198; margin-left: 20px; cursor: pointer"
                >{{ tableDataorder[2] }} ></span
              ></span
            >
          </span>
        </div>
        <u-table
          style="width: 100%"
          ref="plTable"
          class="utable"
          id="utable"
          :height="$store.getters.screenHeight - 305 + 'px'"
          :border="false"
          :header-row-style="{ height: '46px' }"
          :header-cell-style="{
            padding: '0px 0px',
            'font-size': '14px',
            color: 'rgba(1, 6, 33, 0.65)',
            background: 'rgba(0, 0, 0, 0.02)',
          }"
          :row-style="{ height: '46px' }"
          :cell-style="{
            padding: '0px 0px',
            'font-size': '14px',
            color: 'rgba(1, 6, 33, 0.7)',
            height: '46px',
          }"
          use-virtual
          :row-height="46"
          showBodyOverflow="tooltip"
          showHeaderOverflow="title"
          :data="tableDataListu"
          :show-summary="tableDataList[tableIndex].merchantType != 0"
          :summary-method="summaryMethod"
          @select-all="(val) => handleSelectionChange(val, 'selectall')"
          @select="(val) => handleSelectionChange(val, 'select')"
        >
          <template slot="empty"> 没有查询到符合条件的记录 </template>
          <u-table-column
            type="selection"
            width="50"
            align="center"
            v-if="tableDataList[tableIndex].merchantType != 0"
          />
          <u-table-column
            v-for="(item, index) in columns"
            :key="index"
            :resizable="item.resizable"
            :show-overflow-tooltip="true"
            :prop="item.prop"
            :label="item.label"
            :fixed="item.fixed"
            :min-width="item.minWidth"
            :width="item.width"
            :align="item.align"
            header-align="left"
            :sortable="item.sortable"
          >
            <template slot-scope="scope">
              <span
                v-if="
                  item.prop == 'orderTotalPrice' || item.prop == 'shouldPay'
                "
              >
                {{ scope.row[item.prop] | intervalFormat(false) }}
              </span>
              <span v-else-if="item.prop == 'statusName'"
                ><span
                  v-if="scope.row.isCollection"
                  style="
                    width: 8px;
                    height: 8px;
                    background: #dd4c4d;
                    display: inline-block;
                    border-radius: 50%;
                  "
                ></span>
                <span
                  v-else
                  style="
                    width: 8px;
                    height: 8px;
                    background: #1a7fd9;
                    display: inline-block;
                    border-radius: 50%;
                  "
                ></span>
                {{ scope.row[item.prop] }}
              </span>
              <span v-else-if="item.prop == 'timestamp'">
                <span v-if="scope.row[item.prop] != 0">{{
                  scope.row[item.prop] | parseTime()
                }}</span>
                <span v-else>-</span>
              </span>

              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </u-table-column>

          <u-table-column label="操作" :width="150" align="center">
            <template slot-scope="scope">
              <el-button
                v-if="
                  tableDataList[tableIndex].merchantType != 0 &&
                  scope.row.isCollection == 1
                "
                type="text"
                @click="handleOrder2(scope.row)"
                >提醒对方收款</el-button
              >
              <el-button
                v-else-if="
                  tableDataList[tableIndex].merchantType != 0 &&
                  scope.row.isCollection != 1
                "
                :disabled="tableDataList[tableIndex].isHaveCollection == 1"
                type="text"
                @click="handlePayment(scope.row)"
                >付款</el-button
              >
              <el-button
                v-else-if="tableDataList[tableIndex].merchantType == 0"
                type="text"
                @click="handleJumpDetail1('currentBasketDetails', scope.row)"
                >添加付款记录</el-button
              >
              <el-button
                type="text"
                @click="handleJumpDetail1('currentBasketDetails', scope.row)"
                >查看</el-button
              >
            </template>
          </u-table-column>
        </u-table>
        <!-- <div class="paging">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[50, 100, 200, 300]"
            :total="pagination.total"
            :page-size="pagination.limit"
            :current-page.sync="pagination.page"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { parseTime } from "@/utils/common";
import {
  orderUnpaidCustmorList,
  orderUnpaidOrderList,
  payVerify,
  remindCollect,
} from "@/request/api/financialManage/index";
export default {
  name: "paidShippingView",
  data() {
    return {
      parseTime,
      pagination: {
        page: 1, // 页码
        limit: 50, // 分页大小
        total: 0,
      },
      tableDataList: [{ unpaidPrice: 0 }],
      tableDataListu: [],
      tableData: {},
      tableDataorder: [],
      tableIndex: 0,
      selectionCountList: [],
      columns: [
        {
          width: 180,
          prop: "orderSellId",
          label: "单号",
          align: "left",
        },
        {
          minWidth: 170,
          prop: "statusName",
          label: "订单状态",
          align: "left",
        },
        {
          minWidth: 160,
          prop: "orderTotalPrice",
          label: "订单金额(元)",
          align: "left",
        },
        {
          minWidth: 160,
          prop: "shouldPay",
          label: "未付金额(元)",
          align: "left",
        },
        {
          minWidth: 180,
          prop: "timestamp",
          label: "成交时间",
          align: "left",
        },
      ],
    };
  },
  created() {
    this.getList(1);
  },
  computed: {},
  watch: {
    tableDataListu: {
      immediate: true,
      async handler() {
        if (this.tableDataList[this.tableIndex].merchantType != 0) {
          await this.$nextTick(); // 根据实际选择延迟调用
          const tds = document.querySelectorAll(
            "#utable .el-table__footer-wrapper tr>td"
          );
          tds[0].colSpan = 3;
          tds[0].style.textAlign = "left";
          tds[1].style.display = "none";
          tds[2].style.display = "none";
        }
      },
    },
  },
  methods: {
    getList(arg) {
      if (arg === 1) {
        this.pagination.page = 1;
      }
      let param = {
        unpaidType: 5, // 未付类型    1-商品采购 2-筐子购入 3-退货退款 4-退筐退款 5-配送退货 6-配送退筐 7-记账
        pagesize: 0, // 当前第几页
        pagenum: 0, // 一页显示多少条
      };

      orderUnpaidCustmorList(param).then((res) => {
        if (res.status == 200) {
          this.tableDataList = res.data;
          this.getList3();
          this.getList2();
        }
      });
    },
    getList2() {
      let param = {
        custmorId: this.tableDataList[this.tableIndex].linkUserId, // 客户Id   非平台传参---'鑫仔,17633076599'
        unpaidType: 5, // 未付类型     1-商品采购 2-筐子购入 3-退货退款 4-退筐退款 5-配送退货 6-配送退筐 7-记账
        pagesize: 0, //当前第几页
        pagenum: 0, // 一页显示多少条
      };
      orderUnpaidOrderList(param).then((res) => {
        if (res.status == 200) {
          this.tableDataListu = res.data;
        }
      });
    },
    getList3() {
      let param = {
        toUserId: this.tableDataList[this.tableIndex].linkUserId,
      };
      payVerify(param).then((res) => {
        if (res.status == 100001) {
          this.tableData = res.data[0];
          this.tableDataOrder(this.tableData);
        } else {
          this.tableData = {};
          this.tableDataorder = [];
        }
      });
    },
    handleOrder() {
      if ([0, 1, 2].indexOf(this.tableDataorder[0]) != -1) {
        let orderType = null;
        if ([5].indexOf(this.tableData.orderType) != -1) {
          orderType = 1;
        } else if ([7].indexOf(this.tableData.orderType) != -1) {
          orderType = 4;
        } else if ([6].indexOf(this.tableData.orderType) != -1) {
          orderType = 2;
        } else if ([8].indexOf(this.tableData.orderType) != -1) {
          orderType = 3;
        }

        let param = {
          returnUserId: this.tableDataList[this.tableIndex].linkUserId, // 客户Id
          orderID: this.tableData.orderId, // 订单ID
          orderType: orderType, // 订单类型  // 1-销售单  2-退货退款  3-退筐退款  4--筐子订单 0--支付表 5--退货退款-提醒卖家退款
        };

        remindCollect(param).then((res) => {
          if (res.status == 200) {
            this.$success("消息已发送");
          }
        });
      } else {
      }
    },
    handleOrder2(row) {
      //  ordertype 1-商品采购 2-筐子购入 3-退货退款 4-退筐退款 5-配送退货 6-配送退筐 7-记账  8-添加商品  9-筐子自购
      let orderType = null;
      if ([1, 8].indexOf(row.orderType) != -1) {
        // 销售单 采购
        orderType = 1;
      } else if ([2, 9].indexOf(row.orderType) != -1) {
        // 筐子订单
        orderType = 4;
      } else if ([3, 5].indexOf(row.orderType) != -1) {
        // 退货退款
        orderType = 2;
      } else if ([4, 6].indexOf(row.orderType) != -1) {
        // 退筐退款
        orderType = 3;
      }

      let param = {
        returnUserId: this.tableDataList[this.tableIndex].linkUserId, // 客户Id
        orderID: row.uid, // 订单ID
        orderType: orderType, // 订单类型  // 1-销售单  2-退货退款  3-退筐退款  4--筐子订单 0--支付表 5--退货退款-提醒卖家退款
      };
      remindCollect(param).then((res) => {
        if (res.status == 200) {
          this.$success("消息已发送");
        }
      });
    },
    handleTable(val) {
      this.tableIndex = val;
      this.getList3();
      this.getList2();
    },
    handleSelectionChange(val, status) {
      if (this.tableDataList[this.tableIndex].isHaveCollection == 1) {
        this.$refs.plTable.clearSelection();
      } else {
        this.selectionCountList = val;
      }
    },
    handleMerchantType(val) {
      let elTage = "";
      if (val == 0) {
        elTage =
          "<span class='elTagbg4 el-tag el-tag--mini el-tag--light' style='margin: 0px 4px;'>非</span>";
      } else if (val == 2) {
        elTage =
          "<span class='elTagbg2 el-tag el-tag--mini el-tag--light' style='margin: 0px 4px;'>采</span>";
      } else if (val == 1) {
        elTage =
          "<span class='elTagbg1 el-tag el-tag--mini el-tag--light' style='margin: 0px 4px;'>经</span>";
      } else if (val == 3) {
        elTage =
          "<span class='elTagbg3 el-tag el-tag--mini el-tag--light' style='margin: 0px 4px;'>供</span>";
      }

      return elTage;
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.limit = val;
      this.getList(1);
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.getList();
    },
    tableDataOrder(val) {
      let nameis = [];
      if ([5, 7, 6, 8].indexOf(val.orderType) != -1 && val.promptType == 2) {
        // 5 采购单、7 筐子购入单、6 收到的退货退款(含退款)单、8 收到的退筐退款单，promptType 2待对方收款
        nameis = [
          0,
          "您已支付给该客户一笔款项,对方收款后,方可继续付款,",
          "提醒对方收款",
        ];
      } else if ([13, 14].indexOf(val.orderType) != -1 && val.promptType == 2) {
        // 记账单待对方确认/收款
        nameis = [
          1,
          "您已给该客户发送一笔记账账单,对方确认后，方可继续付款，",
          "提醒对方确认",
        ];
      } else if ([11, 12].indexOf(val.orderType) != -1 && val.promptType == 2) {
        // 转账单待对方收款
        nameis = [
          2,
          "您已给该客户发送一笔转账账单,对方收款后，方可继续付款，",
          "提醒对方收款",
        ];
      } else if (
        [1, 7, 2, 4].indexOf(val.orderType) != -1 &&
        val.promptType == 1
      ) {
        // 1 销售单、7筐子售出单、2 发出的退货退款(含退款)单、4 发出的退筐退款单，1 待收款
        nameis = [3, "收到该客户一笔订单款项,", "请先前往收款"];
      } else if (
        [5, 7, 13, 14, 6, 8].indexOf(val.orderType) != -1 &&
        val.promptType == 3
      ) {
        // 5 采购单、7筐子购入单、13 14记账单、6 收到的退货退款(含退款)单、8 收到的退筐退款单，3 待确认
        nameis = [4, "收到该客户一笔订单,", "请先前往确认"];
      } else if (
        [1, 3, 2, 4].indexOf(val.orderType) != -1 &&
        val.promptType == 0
      ) {
        // 1 销售单、3 筐子售出单、2 发出的退货退款(含退款)单、4发出的退筐退款单，0待对方付款
        nameis = [
          5,
          "您已给该客户开了一笔订单，对方付款后，方可继续付款,",
          "查看订单",
        ];
      }
      this.tableDataorder = nameis;
    },
    // 合计
    summaryMethod({ columns, data }) {
      const means = []; // 合计
      columns.forEach((column, columnIndex) => {
        if (columnIndex == 0) {
          let num = 0;
          this.selectionCountList.forEach((res) => {
            num += res.shouldPay;
          });
          means.push(
            '<span style="color: rgba(1, 6, 33, 0.9);font-size:14px;">' +
              "已选" +
              this.selectionCountList.length +
              "单，总未付金额：</span>" +
              '<span style="color: rgba(1, 6, 33, 0.9);font-size:20px;">' +
              this.$options.filters["intervalFormat"](num) +
              "</span>" +
              "<span style=color: rgba(1, 6, 33, 0.9);font-size:14px;>元</span>"
          );
        } else {
          if (column.label == "操作") {
            let disabledIs =
              this.tableDataList[this.tableIndex].isHaveCollection == 1
                ? true
                : false;
            let col = disabledIs ? "#c0c4cc" : "rgba(11, 161, 152, 1)";
            let cur = disabledIs ? "not-allowed" : "pointer";
            let Strin = "color:" + col + ";cursor:" + cur;

            means[columnIndex] =
              '<span style="font-size:14px;' +
              Strin +
              '" onclick="onSubmit()">' +
              "批量付款" +
              "</span>";
          } else {
            means[columnIndex] = "";
          }
        }
      });
      // 返回一个二维数组的表尾合计(不要平均值，你就不要在数组中添加)
      return [means];
    },
    // 付款
    handlePayment() {},
    // 批量付款
    handlePayment2() {
      if (this.tableDataList[this.tableIndex].isHaveCollection != 1) {
        console.log("批量付款");
      }
    },
  },
  mounted() {
    let that = this;
    window.onSubmit = function () {
      that.handlePayment2();
    };
  },
};
</script>

<style lang="scss" scoped>
.paidShippingViewModel {
  .adv-header-title {
    font-size: 20px;
    color: rgba(1, 6, 33, 0.9);
    margin-bottom: 10px;
  }

  .paidShippingView-left {
    width: 300px;

    .paidShippingView-left-ul {
      margin-right: 7px;
      .paidShippingView-left-li {
        // padding: 10px 15px 10px 10px;
        padding: 10px;
        background: #fff;
        border-bottom: 1px solid rgba(1, 6, 33, 0.06);
      }
    }
  }

  .paidShippingView-right {
    width: calc(100% - 300px);
    .paidShippingView-amount {
      margin-bottom: 10px;
      background: rgba(230, 247, 255, 1);
      border: 1px solid rgba(26, 127, 217, 0.5);
      border-radius: 5px;
      padding: 5px 10px;
    }
    .utable {
      width: 100%;
      // border: 1px solid #E9E9E9;
      border-top: 1px solid #e9e9e9;
      border-left: 1px solid #e9e9e9;
      border-right: 1px solid #e9e9e9;
    }

    .paging {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-top: 10px;
      padding-bottom: 5px;
    }
  }
}
</style>

<style lang="scss">
.paidShippingView-left {
  .el-scrollbar {
    .el-scrollbar__wrap {
      background: #f5f5f5 !important;
      margin-bottom: 0px !important;
      overflow-x: hidden;

      .el-scrollbar__view {
        min-width: 0px !important;
        height: var(--screenHeight) !important;
        position: relative;
        padding: 0px !important;
      }
    }
    .el-scrollbar__bar {
      right: 0px;
    }
  }
}
</style>