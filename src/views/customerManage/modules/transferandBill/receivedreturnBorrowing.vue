<template>
  <!-- 收到的归还借款 -->
  <el-scrollbar style="height: 100%" class="receivedreturnBorrowingModel">
    <div class="adv-header-title">收到的-归还借款</div>
    <div>
      <div class="flex_dom">
        <div class="search-form-border">
          <span class="search-form-title">类型</span>
          <el-select
            v-model="queryData.orderKindsType"
            @change="changeOrderKindsType"
            size="small"
            style="width: 90px"
          >
            <el-option label="全部" value="0"></el-option>
            <el-option label="记账" value="1"></el-option>
            <el-option label="转账" value="2"></el-option>
          </el-select>
        </div>

        <div class="search-form-border">
          <span class="search-form-title">状态</span>
          <el-select
            v-model="queryData.statusType"
            size="small"
            style="width: 160px"
          >
            <el-option label="全部" value="0"></el-option>
            <el-option
              v-for="(item, index) in statusTypeList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>

        <div class="search-form-border">
          <span class="search-form-title">创建日期</span>
          <el-date-picker
            v-model="queryData.createdTime"
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

        <div class="search-form-border">
          <span class="search-form-title">成交日期</span>
          <el-date-picker
            v-model="queryData.makeTime"
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
          :height="$store.getters.screenHeight - 485 + 'px'"
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
                {{
                  scope.row[item.prop]
                    | isAdvanceOrderType(scope.row[item.prop])
                }}
              </span>
              <span v-else-if="item.prop == 'orderPrice'">
                {{ scope.row[item.prop] | intervalFormat(false) }}
              </span>
              <span v-else-if="item.prop == 'orderStatus'">
                {{
                  scope.row[item.prop]
                    | isAdvanceOrderStatus(scope.row[item.prop])
                }}
              </span>

              <span v-else-if="item.prop == 'timestamp'">
                {{ parseTime(scope.row[item.prop]) }}
              </span>
              <span v-else-if="item.prop == 'confirmTimestamp'">
                <span
                  :style="{
                    color: scope.row[item.prop] == '未成交' ? '#DD4C4D' : '',
                  }"
                  >{{
                    scope.row[item.prop] == "未成交"
                      ? scope.row[item.prop]
                      : parseTime(scope.row[item.prop])
                  }}</span
                >
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
  </el-scrollbar>
</template>

<script>
import { parseTime } from "@/utils/common";
import { custmorTransfer } from "@/request/api/customerManage/customer";

export default {
  name: "receivedreturnBorrowing",
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
      queryData: {
        orderType: "10", //  类型
        orderKindsType: "0", // 账单类型筛选 0--全部  1--记账  2--转账
        statusType: "0", // 状态筛选 0--全部  1--待对方确认/待确认  2--待对方收款/待收款  3--已确认  4--已收款/已付款
        createdTime: [],
        makeTime: [],
      },
      pagination: {
        page: 1, // 页码
        limit: 50, // 分页大小
        total: 0,
      },
      statusTypeList: [
        { value: "1", label: "待确认" },
        { value: "2", label: "待收款" },
        { value: "3", label: "已确认" },
        { value: "4", label: "已收款" },
      ],
      tableDataList: [
        //  {
        //     "orderType": 2,// 订单类型   1-转账单  2-记账单
        //     "orderId": "164491444470",    //  业务单据Id
        //     "orderPrice": 105.0,         // 单据金额
        //     "orderStatus": 3,            // 单据状态
        //     "timestamp": 1644914444,        // 创建日期
        //     "confirmTimestamp": "未成交"  // 成交日期
        // },
        // {
        //     "orderType": 2,
        //     "orderId": "164491452298",
        //     "orderPrice": 105.0,
        //     "orderStatus": 3,
        //     "timestamp": 1644914522,
        //     "confirmTimestamp": 1644914589
        // }
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
          prop: "orderId",
          label: "编号",
          align: "left",
        },
        {
          // width: 160,
          prop: "orderPrice",
          label: "金额(元)",
          align: "left",
        },
        {
          // width: 160,
          prop: "orderStatus",
          label: "状态",
          align: "left",
        },
        {
          // width: 160,
          prop: "timestamp",
          label: "创建时间",
          align: "left",
        },
        {
          // width: 160,
          prop: "confirmTimestamp",
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
  methods: {
    getList(arg) {
      if (arg === 1) {
        this.pagination.page = 1;
      }
      let param = {
        custmorId: this.toUserId,
        createdStartTime: this.queryData.createdTime[0] || "", // 创建开始日期筛选，没有传0或不传值
        createdEndTime: this.queryData.createdTime[1] || "", // 创建结束日期筛选，没有传0或不传值
        makeStartTime: this.queryData.makeTime[0] || "", // 成交开始日期筛选，没有传0或不传值
        makeEndTime: this.queryData.makeTime[1] || "", // 成交结束日期筛选，没有传0或不传值
        // pageindex: this.pagination.page, // 页码
        // pagesize: this.pagination.limit, // 分页大小
        ...this.queryData,
      };
      delete param.createdTime;
      delete param.makeTime;

      // console.log(param);
      custmorTransfer(param).then((res) => {
        if (res.status == 200) {
          let data = res.data;
          this.tableDataList = data;
          //     this.pagination.total = data.sumCount;
        }
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
    changeOrderKindsType(val) {
      if (val == 0) {
        this.statusTypeList = [
          { value: "1", label: "待确认" },
          { value: "2", label: "待收款" },
          { value: "3", label: "已确认" },
          { value: "4", label: "已收款" },
        ];
      }
      if (val == 1) {
        this.statusTypeList = [
          { value: "1", label: "待确认" },
          { value: "3", label: "已确认" },
        ];
      }
      if (val == 2) {
        this.statusTypeList = [
          { value: "2", label: "待收款" },
          { value: "4", label: "已收款" },
        ];
      }
      this.queryData.statusType = "0";
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
  },
};
</script>

<style lang="scss" scoped>
.receivedreturnBorrowingModel {
  .adv-header-title {
    font-size: 20px;
    color: rgba(1, 6, 33, 0.9);
    margin-bottom: 10px;
  }
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
</style>

<style lang="scss">
// .crediCreditModel {
//   .el-scrollbar__view {
//     min-width: 1580px !important;
//   }
// }
</style>