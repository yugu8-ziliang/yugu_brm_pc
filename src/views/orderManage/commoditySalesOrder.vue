<template>
  <!-- 商品销售单首页 -->
  <TableContainer
    :page-size="queryData.page_size"
    :total="queryData.total"
    :page-num="queryData.page_index"
    @pagination="handlePagination"
  >
    <div style="height: 240px">
      <el-row :gutter="55">
        <el-col :span="3">
          <h5 style="color: rgba(1, 6, 33, 0.55)">销售单金额(元)</h5>
          <p style="font-size: 24px">
            {{ currencyFormat(allOrderTotalPrice) }}
          </p>
        </el-col>
        <el-col :span="16">
          <h5 style="color: rgba(1, 6, 33, 0.55)">未收金额(元)</h5>
          <p style="font-size: 24px">{{ currencyFormat(allUnpaidPrice) }}</p>
        </el-col>
      </el-row>
      <el-divider class="der_styl"></el-divider>
      <div>
        <div class="search-form-border">
          <span class="search-form-title">客户类型</span>
          <el-select
            @change="usertypeModel"
            v-model="queryData.user_type"
            size="small"
            :style="{
              width: '110px',
            }"
            clearable
          >
            <el-option
              v-for="(item, index) in options1"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="search-form-border">
          <span class="search-form-title">订单状态</span>
          <el-select
            @change="statusModel"
            v-model="queryData.status"
            size="small"
            :style="{
              width: '140px',
            }"
            clearable
          >
            <el-option
              v-for="(item, index) in options2"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="search-form-border">
          <span class="search-form-title">订单时间</span>
          <el-date-picker
            v-model="queryData.order_time"
            size="small"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="timestamp"
            clearable
            prefix-icon
            style="width: 230px"
          >
          </el-date-picker>
          <i class="el-icon-date" style="vertical-align: middle"></i>
        </div>
      </div>
      <div style="margin-bottom: 15px">
        <el-input
          style="width: 280px"
          placeholder="请输入客户姓名/联系电话/企业名称"
          prefix-icon="el-icon-search"
          v-model="queryData.search"
          size="small"
        >
        </el-input>
        <el-button
          style="border: #0ba198 solid 1px; color: #0ba198; margin-left: 20px"
          size="small"
          @click="Reset"
          >重置</el-button
        >
        <el-button type="primary" size="small" @click="Query">查询</el-button>
      </div>
      <el-divider></el-divider>
      <el-button
        type="primary"
        size="small"
        icon="el-icon-plus"
        @click="handleJumpDetail('addSalesTicket', {})"
      >
        新建销售单</el-button
      >
    </div>
    <u-table
      ref="plTable"
      class="utable"
      :height="$store.getters.screenHeight - 480 + 'px'"
      :border="false"
      :header-row-style="{ height: '46px' }"
      :row-style="{ height: '46px' }"
      use-virtual
      :row-height="46"
      showBodyOverflow="tooltip"
      showHeaderOverflow="title"
      tooltip-placement="bottom"
      :data="tableData"
      @sort-change="sortChange"
    >
      <template slot="empty">没有查询到符合条件的记录</template>
      <u-table-column
        v-for="(item, index) in columns"
        :key="index"
        :resizable="item.resizable"
        :show-overflow-tooltip="true"
        :prop="item.prop"
        :label="item.label"
        :fixed="item.fixed"
        :width="item.width"
        :min-width="item.minWidth"
        :align="item.align"
        :header-align="item.align"
        :sortable="item.sortable ? 'custom' : false"
      >
        <template slot-scope="scope">
          <span v-if="scope.row[item.prop] == ''">--</span>
          <span v-else-if="item.prop == 'userName'">
            <font class="table_name_styl">{{ scope.row[item.prop] }}</font>
            <el-tag
              type="info"
              v-if="scope.row.typeId == 0"
              class="tag_styl"
              :class="{ table_tag_styl: scope.row[item.prop].length >= 10 }"
              >非</el-tag
            >
            <el-tag
              v-if="scope.row.typeId == 11 || scope.row.typeId == 10"
              class="tag_styl"
              :class="{ table_tag_styl: scope.row[item.prop].length >= 10 }"
              >供</el-tag
            >
            <el-tag
              type="danger"
              v-if="scope.row.typeId == 6 || scope.row.typeId == 7"
              class="tag_styl"
              :class="{ table_tag_styl: scope.row[item.prop].length >= 10 }"
              >经</el-tag
            >
            <el-tag
              type="warning"
              v-if="scope.row.typeId == 3 || scope.row.typeId == 4"
              class="tag_styl"
              :class="{ table_tag_styl: scope.row[item.prop].length >= 10 }"
              >采</el-tag
            >
          </span>
          <span v-else-if="item.prop == 'productTypeCount'">
            {{ scope.row[item.prop] }}种</span
          >
          <span
            v-else-if="
              item.prop == 'orderTotalPrice' ||
              item.prop == 'actualPayPrice' ||
              item.prop == 'unpaidPrice'
            "
            >{{ currencyFormat(scope.row[item.prop]) }}</span
          >
          <span v-else-if="item.prop == 'status'">
            <span
              class="dot_styl"
              style="color: #df971a"
              v-if="
                scope.row.status == 1 ||
                scope.row.status == 2 ||
                scope.row.status == 3
              "
              >●</span
            >
            <span
              class="dot_styl"
              style="color: #dd4c4d"
              v-if="scope.row.status == 4"
              >●</span
            >
            <span
              class="dot_styl"
              style="color: #248b39"
              v-if="scope.row.status == 5"
              >●</span
            >
            <span
              class="dot_styl"
              style="color: #d0d0d2"
              v-if="scope.row.status == 6"
              >●</span
            >
            {{
              scope.row.status == 1
                ? "待对方付款"
                : scope.row.status == 2
                ? "待修改"
                : scope.row.status == 3
                ? "待收款"
                : scope.row.status == 4
                ? "未结清"
                : scope.row.status == 5
                ? "已结清"
                : "未成交"
            }}
          </span>
          <span v-else-if="item.prop == 'timestamp'">
            {{ toDate(scope.row[item.prop]) }}
          </span>
          <span v-else>{{ scope.row[item.prop] }}</span>
        </template>
      </u-table-column>
      <u-table-column label="操作" width="65">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="check(scope.row.orderId, scope.row.typeId)"
            >查看</el-button
          >
        </template>
      </u-table-column>
    </u-table>
  </TableContainer>
</template>
<script>
import moment from "moment";
import { sellInfo } from "@/request/api/salesOrder/salesOrder.js";
export default {
  name: "commoditySalesOrder",
  data() {
    return {
      //  用户类型 0.全部 1.平台 2.非平台
      options1: [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "平台",
        },
        {
          value: 2,
          label: "非平台",
        },
      ],
      //  订单状态 0.全部 1.待对方付款 2.待修改 3.待收款 4.未结清 5.已结清 6.未成交
      options2: [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "待对方付款",
        },
        {
          value: 2,
          label: "待修改",
        },
        {
          value: 3,
          label: "待收款",
        },
        {
          value: 4,
          label: "未结清",
        },
        {
          value: 5,
          label: "已结清",
        },
        {
          value: 6,
          label: "未成交",
        },
      ],
      allOrderTotalPrice: "",
      allUnpaidPrice: "",
      loading: false,
      tableData: [],
      columns: [
        {
          minWidth: 90,
          prop: "orderSellId",
          label: "销售单编号",
          align: "left",
        },
        {
          minWidth: 130,
          prop: "userName",
          label: "客户姓名",
          align: "left",
        },
        {
          minWidth: 90,
          prop: "userPhone",
          label: "联系电话",
          align: "left",
        },
        {
          minWidth: 110,
          prop: "companyName",
          label: "企业名称",
          align: "left",
        },
        {
          minWidth: 70,
          prop: "productTypeCount",
          label: "商品种类",
          align: "left",
        },
        {
          minWidth: 140,
          prop: "productDescription",
          label: "商品信息",
          align: "left",
        },
        {
          minWidth: 90,
          prop: "orderTotalPrice",
          label: "订单金额(元)",
          align: "left",
        },
        {
          minWidth: 90,
          prop: "actualPayPrice",
          label: "已收金额(元)",
          align: "left",
        },
        {
          minWidth: 90,
          prop: "unpaidPrice",
          label: "剩余未收(元)",
          sortable: true,
          align: "left",
        },
        {
          minWidth: 80,
          prop: "status",
          label: "状态",
          align: "left",
        },
        {
          minWidth: 120,
          prop: "timestamp",
          label: "订单时间",
          sortable: true,
          align: "left",
        },
      ],
      queryData: {
        page_index: 1,
        page_size: 10,
        total: 0,
      },
    };
  },
  methods: {
    //查询联动的change事件
    usertypeModel(val) {
      if (val == 0) {
        this.options2 = [
          {
            value: 0,
            label: "全部",
          },
          {
            value: 1,
            label: "待对方付款",
          },
          {
            value: 2,
            label: "待修改",
          },
          {
            value: 3,
            label: "待收款",
          },
          {
            value: 4,
            label: "未结清",
          },
          {
            value: 5,
            label: "已结清",
          },
          {
            value: 6,
            label: "未成交",
          },
        ];
      } else if (val == 1) {
        this.options2 = [
          {
            value: 1,
            label: "待对方付款",
          },
          {
            value: 2,
            label: "待修改",
          },
          {
            value: 3,
            label: "待收款",
          },
          {
            value: 4,
            label: "未结清",
          },
          {
            value: 5,
            label: "已结清",
          },
        ];
      } else {
        this.options2 = [
          {
            value: 4,
            label: "未结清",
          },
          {
            value: 5,
            label: "已结清",
          },
          {
            value: 6,
            label: "未成交",
          },
        ];
      }
    },
    statusModel(val) {
      console.log(val);
      if (val == 0 || val == 4 || val == 5) {
        this.options1 = [
          {
            value: 0,
            label: "全部",
          },
          {
            value: 1,
            label: "平台",
          },
          {
            value: 2,
            label: "非平台",
          },
        ];
      } else if (val == 1 || val == 2 || val == 3) {
        this.options1 = [
          {
            value: 1,
            label: "平台",
          },
        ];
      } else {
        this.options1 = [
          {
            value: 2,
            label: "非平台",
          },
        ];
      }
    },
    Reset() {
      (this.queryData = {
        page_index: 1,
        page_size: 10,
      }),
        this.sellInfo();
      this.options1 = [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "平台",
        },
        {
          value: 2,
          label: "非平台",
        },
      ];
      this.options2 = [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "待对方付款",
        },
        {
          value: 2,
          label: "待修改",
        },
        {
          value: 3,
          label: "待收款",
        },
        {
          value: 4,
          label: "未结清",
        },
        {
          value: 5,
          label: "已结清",
        },
        {
          value: 6,
          label: "未成交",
        },
      ];
    },
    currencyFormat(num) {
      let a = Number(num)
        .toFixed(2)
        .toString()
        .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      return a;
    },
    check(id, type) {
      this.$router.push({
        path: "commoditySalesOrderDetail",
        query: { id: id, isP: Number(type !== 0) }, //isP 是否平台用户
      });
    },
    sortChange(column) {
      // ascending 由小到大 descending 由大到小
      let resData = JSON.parse(JSON.stringify(this.tableData));
      if (resData.length > 0) {
        if (column.order == "ascending") {
          resData.sort((a, b) => {
            return a[column.prop] - b[column.prop];
          }); //升序
        }
        if (column.order == "descending") {
          resData.sort((a, b) => {
            return b[column.prop] - a[column.prop];
          }); //降序
        }
        this.tableData = resData;
      }
    },
    toDate(val) {
      return moment(val * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
    Query() {
      this.sellInfo();
    },
    sellInfo() {
      this.loading = true;
      let obj = {};
      if (this.queryData.user_type != undefined) {
        if (this.queryData.user_type == "") {
          delete this.queryData.user_type;
        }
      }
      if (this.queryData.status != undefined) {
        if (this.queryData.status == "") {
          delete this.queryData.status;
        }
      }
      obj = this.queryData;
      if (this.queryData.order_time) {
        //格式化查询条件#订单时间
        obj.start_time = this.queryData.order_time[0] / 1000;
        obj.end_time = this.queryData.order_time[1] / 1000;
      }
      sellInfo(obj).then((resp) => {
        console.log(resp.data);
        this.allOrderTotalPrice = resp.data.allOrderTotalPrice;
        this.allUnpaidPrice = resp.data.allUnpaidPrice;
        this.queryData.total = resp.data.modelListCount;
        this.tableData = resp.data.modelList;
        this.loading = false;
      });
    },
    handlePagination(e) {
      this.queryData.page_index = e.pageNum;
      this.queryData.page_size = e.pageSize;
      this.sellInfo();
    },
    // 跳转页面
    handleJumpDetail: function (form, record) {
      this.$router.push({
        path: form,
        query: {
          data: JSON.stringify(record),
        }, //加密
      });
    },
  },
  mounted() {},
  created() {
    this.sellInfo();
  },
};
</script>
<style lang="scss" scoped>
.search-form-border {
  display: inline-block;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  margin-right: 15px;
  margin-bottom: 15px;

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

.dot_styl {
  font-size: 20px;
  padding-right: 5px;
}

::v-deep .el-range-editor--small.el-input__inner {
  border-radius: 2px;
}
::v-deep .el-divider--horizontal {
  margin: 0px 0px 18px 0px;
}
.label-title {
  padding: 0 6px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(1, 6, 33, 0.35);
}
::v-deep .el-select .el-input--prefix .el-input__inner {
  padding-left: 70px;
  border-radius: 2px;
}
::v-deep .el-input--prefix .el-input__inner {
  padding-left: 40px;
  border-radius: 2px;
}
::v-deep .el-range-input {
  width: 41%;
}
.date_header_styl {
  position: relative;
}
.der_styl {
  margin-top: 10px;
}
.date_header_text {
  position: absolute;
  left: 16px;
  top: 4px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(1, 6, 33, 0.35);
}
.el-tag {
  padding: 0px 2px !important;
}
.el-tag--medium {
  height: 17px !important;
  line-height: 17px !important;
}
::v-deep .table-page {
  padding: 0px !important;
}
.table_name_styl {
  position: relative;
}
.table_tag_styl {
  position: absolute;
  right: 0px;
  top: 13px;
}
</style>