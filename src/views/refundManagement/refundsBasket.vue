<template>
  <!-- 退筐退款 -->
  <PageNoScroll @hanleRefresh="hanleRefresh" style="height: 100%">
    <el-tabs v-model="queryData.queryType" @tab-click="handleActiveClick">
      <el-tab-pane label="收到的退筐退款单" name="1"></el-tab-pane>
      <el-tab-pane label="发出的退筐退款单" name="2"></el-tab-pane>
    </el-tabs>
    <div class="currentInventory-model">
      <div class="currentInventory-search">
        <div>
          <div class="search-form-border">
            <span class="search-form-title">客户类型</span>
            <el-select v-model="queryData.userType" size="small">
              <el-option label="全部" value="0"></el-option>
              <el-option label="平台用户" value="1"></el-option>
              <el-option label="非平台用户" value="2"></el-option>
            </el-select>
          </div>

          <div class="search-form-border">
            <span class="search-form-title">订单状态</span>
            <el-select
              v-if="queryData.queryType == 1"
              v-model="queryData.status"
              size="small"
            >
              <el-option label="全部" value="0"></el-option>
              <el-option label="待确认" value="1"></el-option>
              <el-option label="待对方收款" value="3"></el-option>
              <el-option label="未结清" value="4"></el-option>
              <el-option label="已结清" value="5"></el-option>
              <el-option label="未成交" value="7"></el-option>
            </el-select>
            <el-select v-else v-model="queryData.status" size="small">
              <el-option label="全部" value="0"></el-option>
              <el-option label="待对方付款" value="1"></el-option>
              <el-option label="待修改" value="2"></el-option>
              <el-option label="待收款" value="3"></el-option>
              <el-option label="未结清" value="4"></el-option>
              <el-option label="已结清" value="5"></el-option>
              <el-option label="未成交" value="7"></el-option>
            </el-select>
          </div>

          <div class="search-form-border">
            <span class="search-form-title">创建日期</span>
            <el-date-picker
              v-model="queryData.timestampList"
              size="small"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp"
              prefix-icon
              style="width: 220px"
            >
            </el-date-picker>
            <i class="el-icon-date"></i>
          </div>

          <div class="search-form-border">
            <span class="search-form-title">成交日期</span>
            <el-date-picker
              v-model="queryData.confirmTimestampList"
              size="small"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp"
              prefix-icon
              style="width: 220px"
            >
            </el-date-picker>
            <i class="el-icon-date"></i>
          </div>

          <div class="search-form-border-input">
            <!-- <span class="search-form-title">客户名称</span> -->
            <el-input
              v-model="queryData.search"
              size="small"
              placeholder="请输入客户名称/手机号"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="handleSearch"
              ></el-button>
            </el-input>
          </div>

          <div class="search-form-border-input">
            <el-button size="small" @click="handleReset">重 置</el-button>
            <el-button type="primary" size="small" @click="handleSearch"
              >查 询</el-button
            >
          </div>
        </div>
      </div>

      <div class="currentInventory-table">
        <div
          style="
            margin: 12px 0px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
          "
        >
          <el-button
            v-if="queryData.queryType == 2"
            size="small"
            type="primary"
            @click="handleJumpDetail('createrefundBasket')"
            >退还筐子</el-button
          >
        </div>
        <u-table
          ref="plTable"
          class="utable"
          :height="$store.getters.screenHeight - 435 + 'px'"
          :border="false"
          :header-row-style="{ height: '46px' }"
          :header-cell-style="{
            padding: '0px 0px',
            'font-size': '14px',
            color: 'rgba(1, 6, 33, 0.65)',
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
            align="left"
            header-align="left"
            :sortable="item.sortable ? 'custom' : false"
          >
            <template slot-scope="scope">
              <span v-if="scope.row[item.prop] == ''">--</span>
              <span
                v-else-if="
                  item.prop == 'timestamp' || item.prop == 'confirmTimestamp'
                "
                >{{ scope.row[item.prop] | parseTime }}</span
              >
              <span v-else-if="item.prop == 'orderTotalPrice'">{{
                scope.row[item.prop] | intervalFormat(true)
              }}</span>
              <span v-else-if="item.prop == 'productTotalCount'"
                >{{ scope.row[item.prop] }}种</span
              >
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </u-table-column>
          <u-table-column label="操作" :width="90" align="left">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleJumpDetail1('path', scope.row)"
                >查看</el-button
              >
            </template>
          </u-table-column>
        </u-table>
        <div class="paging">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            :page-size="pagination.limit"
            :current-page.sync="pagination.page"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>
    </div>
  </PageNoScroll>
</template>

<script>
import { basketreturnList } from "@/request/api/frameManage/basketInOut";

export default {
  name: "refundsBasket",
  data() {
    return {
      queryData: {
        queryType: "1", //int，1为我收到的，2为我发出的
        status: "0", //int，0:全部 1: 待确认(待对方付款), 2: 待修改, 3: 待收款（待对方收款）, 4: 未结清, 5: 已结清，7：未成交
        userType: "0", //0全部  1 平台 2 非平台
        search: "",
        timestampList: [], //创建日期
        confirmTimestampList: [], //成交日期
      },
      pagination: {
        page: 1, // 页码
        limit: 10, // 分页大小
        total: 0,
      },
      columns: [
        {
          prop: "orderBasketReturnId",
          label: "编号",
          minWidth: 140,
        },
        {
          prop: "name",
          label: "客户姓名",
          minWidth: 90,
        },
        {
          prop: "phoneNumber",
          label: "联系电话",
          minWidth: 110,
        },
        {
          prop: "companyName",
          label: "企业名称",
          minWidth: 180,
        },
        {
          minWidth: 90,
          prop: "productTotalCount",
          label: "筐子种类",
        },
        {
          minWidth: 120,
          prop: "orderTotalPrice",
          label: "订单金额(元)",
          sortable: true,
        },
        {
          minWidth: 120,
          prop: "statusName",
          label: "订单状态",
        },
        {
          minWidth: 160,
          prop: "timestamp",
          label: "创建时间",
        },
        {
          minWidth: 160,
          prop: "confirmTimestamp",
          label: "成交时间",
        },
      ],
      tableData: [],
    };
  },
  computed: {},
  created() {
    this.getList(1);
    this.changePage();
  },
  methods: {
    changePage() {
      let changes = this.$route.query.name ? this.$route.query.name : "";
      if (changes == "") {
        this.queryData.queryType = "1";
      } else {
        this.queryData.queryType = "2";
      }
    },
    handleActiveClick(val) {
      this.queryData = {
        status: "0", //int，0:全部 1: 待确认(待对方付款), 2: 待修改, 3: 待收款（待对方收款）, 4: 未结清, 5: 已结清，7：未成交
        userType: "0", //0全部  1 平台 2 非平台
        search: "",
        timestampList: [], //创建日期
        confirmTimestampList: [], //成交日期
        queryType: val.name, //int，1为我收到的，2为我发出的
      };
      this.getList(1);
    },
    getList(arg) {
      if (arg === 1) {
        this.pagination.page = 1;
      }
      let param = {
        ...this.queryData,
        pageindex: this.pagination.page, // 页码
        pagesize: this.pagination.limit, // 分页大小
      };
      if (param.timestampList != null && param.timestampList.length > 0) {
        param.startTime = param.timestampList[0].toString().substring(0, 10);
        param.endTime = param.timestampList[1].toString().substring(0, 10);
      }
      if (
        param.confirmTimestampList != null &&
        param.confirmTimestampList.length > 0
      ) {
        param.startConfirmTimestamp = param.confirmTimestampList[0]
          .toString()
          .substring(0, 10);
        param.endConfirmTimestamp = param.confirmTimestampList[1]
          .toString()
          .substring(0, 10);
      }
      delete param.timestampList;
      delete param.confirmTimestampList;
      this.tableData = [];
      basketreturnList(param).then((res) => {
        this.tableData = res.data.modelList;
        this.pagination.total = res.data.modelListCount;
      });
    },
    sortChange(column) {
      // ascending 由小到大 descending 由大到小
      // console.log("排序", column.prop, column.order);
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
    //查询
    handleSearch() {
      this.getList(1);
    },
    //重置
    handleReset() {
      this.queryData = this.$options.data().queryData;
      this.pagination = this.$options.data().pagination;
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
    // 跳转页面
    handleJumpDetail1(path, record) {
      if (record.queryType == 1) {
        //收到的跳退入
        path = "/frameManage/backintorefundOrder";
      } else if (record.queryType == 2) {
        //发出的跳退还
        path = "/frameManage/baskrefundOrder";
      }
      this.$router.push({
        path: path,
        query: {
          orderId: record.pk,
        },
      });
    },
    handleJumpDetail: function (form, record) {
      this.$router.push({
        path: form,
      });
    },
    // 刷新
    hanleRefresh() {
      this.getList(1);
    },
  },
};
</script>

<style lang="scss" scoped>
.currentInventory-model {
  .currentInventory-search {
    border-bottom: 0.5px solid #e9e9e9;

    .search-form-border {
      display: inline-block;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      margin-right: 15px;
      margin-bottom: 18px;
      background-color: #ffffff;

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

    .search-form-border-input {
      display: inline-block;
      margin-right: 15px;
      margin-bottom: 15px;
    }
  }

  .currentInventory-table {
    .utable {
      border: 1px solid #e9e9e9;
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