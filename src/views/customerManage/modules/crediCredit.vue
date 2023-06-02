<template>
  <!-- 赊账授信 -->
  <el-scrollbar style="height: 100%" class="crediCreditModel">
    <div>
      <el-collapse
        v-model="activeName"
        @change="handleCollapse"
        :accordion="false"
      >
        <el-collapse-item name="1">
          <template slot="title">
            <div class="flex_dom flex_item_mid">
              <div class="collTitle">
                赊账授信
                <i
                  @click.stop="handleShow"
                  class="el-icon-s-operation"
                  style="color: #00a499; font-size: 17px"
                ></i>
              </div>

              <div class="collTitleLeft1 ml76">
                <div>
                  <span class="collTitle4 collColorR">已用授信</span
                  ><span class="collTitle4 collColorR" style="margin-left: 15px"
                    >{{
                      tableData.creditUseAmount | intervalFormat(true)
                    }}万</span
                  >
                </div>
              </div>

              <div class="collTitleLeft1 ml64">
                <div>
                  <span class="collTitle4 collColorR">授信逾期金额</span
                  ><span class="collTitle4 collColorR" style="margin-left: 15px"
                    >{{
                      tableData.overdueAmount | intervalFormat(true)
                    }}万</span
                  >
                </div>
              </div>
            </div>
          </template>
          <div class="collContent flex_dom flex_item_mid">
            <div class="collContentWidth">
              <div class="collContentTitle2">赊账授信</div>
              <div class="collContentTitle3">
                {{ tableData.creditTotalAmount | intervalFormat(true)
                }}<span class="collContentTitle4">元</span>
              </div>
            </div>

            <div class="lineH"></div>

            <div class="collContentWidth">
              <div class="collContentTitle2">已用授信</div>
              <div class="collContentTitle3">
                {{ tableData.creditUseAmount | intervalFormat(true)
                }}<span class="collContentTitle4">元</span>
              </div>
            </div>
            <div class="lineH"></div>
            <div class="collContentWidth">
              <div class="collContentTitle2">剩余授信</div>
              <div class="collContentTitle3">
                {{ tableData.creditRemainAmount | intervalFormat(true)
                }}<span class="collContentTitle4">元</span>
              </div>
            </div>
            <div class="lineH"></div>
            <div class="collContentWidth">
              <div class="collContentTitle2">单笔授信</div>
              <div class="collContentTitle3">
                {{ tableData.creditOneAmount | intervalFormat(true)
                }}<span class="collContentTitle4">元</span>
              </div>
            </div>
            <div class="lineH"></div>
            <div class="collContentWidth">
              <div class="collContentTitle2">单笔授信账期</div>
              <div class="collContentTitle3">
                {{ tableData.creditOneLimit || 0
                }}<span class="collContentTitle4">天</span>
              </div>
            </div>
            <div class="lineH"></div>
            <div class="collContentWidth">
              <div class="collContentTitle2">3天内授信到期金额</div>
              <div class="collContentTitle3">
                {{ tableData.expiringAmount | intervalFormat(true)
                }}<span class="collContentTitle4">元</span>
              </div>
            </div>
            <div class="lineH"></div>
            <div class="">
              <div class="collContentTitle2 collContentTitleColorR">
                逾期授信金额
              </div>
              <div class="collContentTitle3 collContentTitleColorR">
                {{ tableData.overdueAmount | intervalFormat(true)
                }}<span class="collContentTitle4 collContentTitleColorR"
                  >元</span
                ><span
                  ><i class="el-icon-arrow-right" style="font-size: 16px"></i
                ></span>
              </div>
            </div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
    <div>
      <div class="flex_dom">
        <div class="search-form-border">
          <span class="search-form-title">类型</span>
          <el-select
            v-model="queryData.orderType"
            size="small"
            style="width: 160px"
          >
            <el-option label="全部" value="0"></el-option>
            <el-option label="商品销售单" value="1"></el-option>
            <el-option label="发出的商品退货退款" value="2"></el-option>
            <el-option label="发出的筐子退筐退款" value="3"></el-option>
            <el-option label="筐子售出单" value="4"></el-option>
          </el-select>
        </div>

        <div class="search-form-border">
          <span class="search-form-title">是否逾期</span>
          <el-select
            v-model="queryData.creditStatus"
            size="small"
            style="width: 90px"
          >
            <el-option label="全部" value="0"></el-option>
            <el-option label="已逾期" value="1"></el-option>
            <el-option label="未逾期" value="2"></el-option>
          </el-select>
        </div>

        <div class="search-form-border">
          <span class="search-form-title">成交日期</span>
          <el-date-picker
            v-model="queryData.confirmTimeStampArray"
            size="small"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            prefix-icon
            style="width: 230px"
          >
          </el-date-picker>
          <i class="el-icon-date"></i>
        </div>
      </div>
      <div>
        <div style="margin-top: 10px">
          <el-button size="small" @click="handleReset">重 置</el-button>
          <el-button type="primary" size="small" @click="handleQuery"
            >查 询</el-button
          >
        </div>
      </div>

      <div style="margin-top: 10px">
        <u-table
          ref="plTable"
          class="utable"
          :height="
            activeStatus
              ? $store.getters.screenHeight - 657 + 'px'
              : $store.getters.screenHeight - 568 + 'px'
          "
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
          :data="tableDataList"
        >
          <template slot="empty"> 没有查询到符合条件的记录 </template>
          <u-table-column
            v-for="(item, index) in columns"
            :key="index"
            :resizable="item.resizable"
            :show-overflow-tooltip="true"
            :prop="item.prop"
            :label="item.label"
            :fixed="item.fixed"
            :width="item.width"
            :align="item.align"
            header-align="left"
            :sortable="item.sortable"
          >
            <template slot-scope="scope">
              <span v-if="item.prop == 'orderType'">
                {{ scope.row[item.prop] | isOrderType(scope.row[item.prop]) }}
              </span>
              <span
                v-else-if="
                  item.prop == 'orderTotalAmount' ||
                  item.prop == 'receivedAmount' ||
                  item.prop == 'useCreditAmount'
                "
              >
                {{ scope.row[item.prop] | intervalFormat(false) }}
              </span>
              <span v-else-if="item.prop == 'overdueAmount'">
                <span
                  :style="{
                    color: Number(scope.row[item.prop]) == 0 ? '' : '#DD4C4D',
                  }"
                  >{{ scope.row[item.prop] | intervalFormat(false) }}</span
                >
              </span>
              <span v-else-if="item.prop == 'overdueDays'">
                <span
                  :style="{
                    color: scope.row[item.prop] == '未逾期' ? '' : '#DD4C4D',
                  }"
                  >{{ scope.row[item.prop] }}</span
                >
              </span>
              <span
                v-else-if="
                  item.prop == 'confirmTimeStamp' ||
                  item.prop == 'expireTimeStamp'
                "
              >
                {{ parseTime(scope.row[item.prop]) }}
              </span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </u-table-column>
          <u-table-column label="操作" :width="100" align="center">
            <template slot-scope="scope">
              <el-button type="text" @click="toPage(scope)">查看</el-button>
            </template>
          </u-table-column>
        </u-table>
        <div class="paging">
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
        </div>
      </div>
      <creditLine ref="creditLine"></creditLine>
    </div>
  </el-scrollbar>
</template>

<script>
import { parseTime } from "@/utils/common";
import creditLine from "../dialogmod/creditLine.vue";
import { userCreditList } from "@/request/api/customerManage/customer";
export default {
  name: "crediCredit",
  components: {
    creditLine,
  },
  props: {
    toUserId: {
      type: String,
    },
    currentView: {
      type: String,
    },
  },
  data() {
    return {
      parseTime,
      activeName: "1",
      activeStatus: true,
      queryData: {
        orderType: "0", // 订单类型，0:全部, 1-商品销售单  2-发出的商品退货退款  3-发出的筐子退筐退款  4--筐子售出单
        creditStatus: "0", // 赊账订单状态, 0:全部, 1:已逾期, 2:未逾期
        confirmTimeStamp: "", // 成交日期 1645372800,1645372800
        confirmTimeStampArray: [], // 成交日期 1645372800,1645372800
      },
      pagination: {
        page: 1, // 页码
        limit: 50, // 分页大小
        total: 0,
      },
      tableData: {},
      tableDataList: [
        // {
        //   orderType: 4, // # 类型,1-商品销售单  2-发出的商品退货退款  3-发出的筐子退筐退款  4--筐子售出单
        //   orderNo: "16454322776001", // 订单编号
        //   orderTotalAmount: "99,999,999.00", // 订单金额
        //   receivedAmount: "99,999,999.00", // 已收金额
        //   useCreditAmount: "99,999,999.00", // 已用授信
        //   overdueAmount: "0.00", // 逾期金额
        //   confirmTimeStamp: 1645432342, // 成交时间
        //   expireTimeStamp: 1653208323, // 到期时间
        //   overdueDays: "未逾期", // 逾期时间
        // },
        // {
        //   orderType: 2, // # 类型,1-商品销售单  2-发出的商品退货退款  3-发出的筐子退筐退款  4--筐子售出单
        //   orderNo: "16454322776001", // 订单编号
        //   orderTotalAmount: "99,999,999.00", // 订单金额
        //   receivedAmount: "99,999,999.00", // 已收金额
        //   useCreditAmount: "99,999,999.00", // 已用授信
        //   overdueAmount: "99,999,999.00", // 逾期金额
        //   confirmTimeStamp: 1645432342, // 成交时间
        //   expireTimeStamp: 1653208323, // 到期时间
        //   overdueDays: "3天", // 逾期时间
        // },
        // {
        //   orderType: 3, // # 类型,1-商品销售单  2-发出的商品退货退款  3-发出的筐子退筐退款  4--筐子售出单
        //   orderNo: "16454322776001", // 订单编号
        //   orderTotalAmount: "99,999,999.00", // 订单金额
        //   receivedAmount: "99,999,999.00", // 已收金额
        //   useCreditAmount: "99,999,999.00", // 已用授信
        //   overdueAmount: "99,999,999.00", // 逾期金额
        //   confirmTimeStamp: 1645432342, // 成交时间
        //   expireTimeStamp: 1653208323, // 到期时间
        //   overdueDays: "1000天", // 逾期时间
        // },
        // {
        //   orderType: 1, // # 类型,1-商品销售单  2-发出的商品退货退款  3-发出的筐子退筐退款  4--筐子售出单
        //   orderNo: "16454322776001", // 订单编号
        //   orderTotalAmount: "99,999,999.00", // 订单金额
        //   receivedAmount: "99,999,999.00", // 已收金额
        //   useCreditAmount: "99,999,999.00", // 已用授信
        //   overdueAmount: "99,999,999.00", // 逾期金额
        //   confirmTimeStamp: 1645432342, // 成交时间
        //   expireTimeStamp: 1653208323, // 到期时间
        //   overdueDays: "1000天", // 逾期时间
        // },
        // {
        //   orderType: 1, // # 类型,1-商品销售单  2-发出的商品退货退款  3-发出的筐子退筐退款  4--筐子售出单
        //   orderNo: "16454322776001", // 订单编号
        //   orderTotalAmount: "99,999,999.00", // 订单金额
        //   receivedAmount: "99,999,999.00", // 已收金额
        //   useCreditAmount: "99,999,999.00", // 已用授信
        //   overdueAmount: "99,999,999.00", // 逾期金额
        //   confirmTimeStamp: 1645432342, // 成交时间
        //   expireTimeStamp: 1653208323, // 到期时间
        //   overdueDays: "1000天", // 逾期时间
        // },
        // {
        //   orderType: 1, // # 类型,1-商品销售单  2-发出的商品退货退款  3-发出的筐子退筐退款  4--筐子售出单
        //   orderNo: "16454322776001", // 订单编号
        //   orderTotalAmount: "99,999,999.00", // 订单金额
        //   receivedAmount: "99,999,999.00", // 已收金额
        //   useCreditAmount: "99,999,999.00", // 已用授信
        //   overdueAmount: "99,999,999.00", // 逾期金额
        //   confirmTimeStamp: 1645432342, // 成交时间
        //   expireTimeStamp: 1653208323, // 到期时间
        //   overdueDays: "1000天", // 逾期时间
        // },
        // {
        //   orderType: 1, // # 类型,1-商品销售单  2-发出的商品退货退款  3-发出的筐子退筐退款  4--筐子售出单
        //   orderNo: "16454322776001", // 订单编号
        //   orderTotalAmount: "99,999,999.00", // 订单金额
        //   receivedAmount: "99,999,999.00", // 已收金额
        //   useCreditAmount: "99,999,999.00", // 已用授信
        //   overdueAmount: "99,999,999.00", // 逾期金额
        //   confirmTimeStamp: 1645432342, // 成交时间
        //   expireTimeStamp: 1653208323, // 到期时间
        //   overdueDays: "1000天", // 逾期时间
        // },
        // {
        //   orderType: 1, // # 类型,1-商品销售单  2-发出的商品退货退款  3-发出的筐子退筐退款  4--筐子售出单
        //   orderNo: "16454322776001", // 订单编号
        //   orderTotalAmount: "99,999,999.00", // 订单金额
        //   receivedAmount: "99,999,999.00", // 已收金额
        //   useCreditAmount: "99,999,999.00", // 已用授信
        //   overdueAmount: "99,999,999.00", // 逾期金额
        //   confirmTimeStamp: 1645432342, // 成交时间
        //   expireTimeStamp: 1653208323, // 到期时间
        //   overdueDays: "1000天", // 逾期时间
        // },
      ],
      columns: [
        {
          // width: 180,
          prop: "orderType",
          label: "类型",
          align: "left",
        },
        {
          // width: 170,
          prop: "orderNo",
          label: "订单编号",
          align: "left",
        },
        {
          // width: 160,
          prop: "orderTotalAmount",
          label: "订单金额(元)",
          align: "left",
        },
        {
          // width: 160,
          prop: "receivedAmount",
          label: "已收金额(元)",
          align: "left",
        },
        {
          // width: 160,
          prop: "useCreditAmount",
          label: "已用授信(元)",
          align: "left",
        },
        {
          // width: 160,
          prop: "overdueAmount",
          label: "逾期金额(元)",
          align: "left",
        },
        {
          // width: 180,
          prop: "confirmTimeStamp",
          label: "成交时间",
          align: "left",
        },
        {
          // width: 180,
          prop: "expireTimeStamp",
          label: "到期时间",
          align: "left",
        },
        {
          // width: 100,
          prop: "overdueDays",
          label: "逾期时间",
          align: "left",
        },
      ],
    };
  },
  created() {
    this.getList(1);
  },
  computed: {},
  methods: {
    getList(arg) {
      if (arg === 1) {
        this.pagination.page = 1;
      }
      let param = {
        customerId: this.toUserId,
        pageindex: this.pagination.page, // 页码
        pagesize: this.pagination.limit, // 分页大小
        ...this.queryData,
      };
      param.confirmTimeStamp = this.queryData.confirmTimeStampArray.toString();
      delete param.confirmTimeStampArray;
      // console.log(param);
      userCreditList(param).then((res) => {
        if (res.status == 200) {
          let data = res.data[0];
          this.tableData = data;
          this.tableDataList = data.modelList;
          this.pagination.total = data.sumCount;

          // delete this.tableData.modelList;
          // console.log(this.tableData);
          // console.log(this.tableDataList);
        }
      });
    },
    handleCollapse(val) {
      this.$nextTick(() => {
        this.activeStatus = val.length == 1 ? true : false;
      });
    },
    // 重置
    handleReset() {
      this.queryData = this.$options.data().queryData;
      this.pagination = this.$options.data().pagination;
      this.getList(1);
    },
    //查询
    handleQuery() {
      this.getList(1);
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
    handleShow() {
      this.$refs.creditLine.edit({ custmorId: this.toUserId });
      this.$refs.creditLine.title = "赊账授信";
      this.$refs.creditLine.disableSubmit = false;
      this.$refs.creditLine.isVisiable = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.crediCreditModel {
  .search-form-border {
    display: inline-block;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin-right: 15px;

    .search-form-title {
      padding: 0px 8px;
      font-size: 14px;
      color: rgba(1, 6, 33, 0.35);
    }

    i {
      color: #c0c4cc;
      margin: 0px 6px;
    }

    ::v-deep .el-input {
      line-height: 25px;
    }

    ::v-deep .el-input__inner {
      border: none;
      padding: 0px 5px;
      height: 30px;
      line-height: 30px;
    }

    ::v-deep .el-range__icon {
      display: none;
    }
  }

  .collTitle {
    font-size: 20px;
    color: rgba(1, 6, 33, 0.9);
  }

  .ml100 {
    margin-left: 100px;
  }

  .ml96 {
    margin-left: 96px;
  }

  .ml76 {
    margin-left: 76px;
  }

  .ml64 {
    margin-left: 64px;
  }

  .ml60 {
    margin-left: 60px;
  }

  .ml15 {
    margin-left: 15px;
  }

  .ml10 {
    margin-left: 10px;
  }

  .mr20 {
    margin-right: 20px;
  }

  .collTitleLeft {
    // min-width: 150px;
    // margin-left: 76px;
    .collTitle1 {
      font-size: 16px;
      color: rgba(1, 6, 33, 0.55);
    }

    .collTitle2 {
      font-size: 24px;
      color: rgba(1, 6, 33, 0.9);
    }

    .collTitle3 {
      font-size: 16px;
      color: rgba(1, 6, 33, 0.9);
    }
  }

  .collTitleLeft1 {
    .collTitle4 {
      font-size: 15px;
    }

    .collColorR {
      color: rgba(221, 76, 77, 1);
    }

    .collColorB {
      color: rgba(26, 127, 217, 1);
    }
  }

  ::v-deep .el-collapse-item__header {
    background: rgba(0, 0, 0, 0.04) !important;
    border: 1px solid rgba(0, 0, 0, 0.04);
    height: 70px;
    line-height: 30px;
    padding: 5px 0px 5px 24px;
  }

  ::v-deep .el-collapse-item {
    margin-bottom: 10px;
  }

  ::v-deep .el-collapse {
    // padding-right: 5px;
    border: none;
  }

  ::v-deep .el-collapse-item__wrap {
    // border: none;
    border-left: 1px solid rgba(0, 0, 0, 0.04);
    border-right: 1px solid rgba(0, 0, 0, 0.04);
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  }

  ::v-deep .el-collapse-item__content {
    padding-bottom: 0px;
  }

  .collContent {
    padding: 10px 24px 10px 24px;
    border-bottom: 1px solid rgba(0, 0, 0, 0.04);

    .collContentWidth {
      min-width: 150px;
    }

    .collContentRadio {
      width: 8px;
      height: 8px;
      background: rgba(0, 164, 153, 1);
      border-radius: 50%;
    }

    .collContentTitle1 {
      margin-left: 8px;
      font-size: 20px;
      color: rgba(1, 6, 33, 0.9);
    }

    .collContentTitle2 {
      font-size: 14px;
      color: rgba(1, 6, 33, 0.55);
    }

    .collContentTitle3 {
      font-size: 24px;
      color: rgba(1, 6, 33, 0.9);
    }

    .collContentTitle4 {
      font-size: 16px;
      color: rgba(1, 6, 33, 0.9);
    }

    .collContentTitleColorR {
      color: rgba(221, 76, 77, 1);
    }
  }

  .lineH {
    width: 1px;
    height: 32px;
    border-right: 1px solid rgba(1, 6, 33, 0.35);
    overflow: hidden;
    box-shadow: none;
    margin: 0px 20px;
  }

  .utable {
    width: 100%;
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
</style>

<style lang="scss">
.crediCreditModel {
  .el-scrollbar__view {
    min-width: 1580px !important;
  }
}
</style>