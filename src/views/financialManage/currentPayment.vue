<template>
  <!-- 往来款 -->
  <Container v-loading="loading" @refresh="hanleRefresh">
    <div class="currentInventory-model">
      <div class="header-page">
        <div class="header-left">
          <div class="header-left-content">
            <div class="collTitleLeft">
              <div class="collTitle1">总收入(元)</div>
              <div class="collTitle2">
                {{ moneyFormat(tableData.totalInAmount) }}
              </div>
            </div>
            <div class="collTitleLeft1 ml15">
              <div class="collTitleLeft1-left">
                <span class="collTitle4">总应收(销售款)</span>
                <span class="collTitle4" style="margin-left: 15px">{{
                  moneyFormat(tableData.sales)
                }}</span>
              </div>
              <div>
                <span class="collTitle4">其他收入</span>
                <span class="collTitle4" style="margin-left: 15px">{{
                  moneyFormat(tableData.otherIncome)
                }}</span>
              </div>
            </div>
            <div class="lineH"></div>
            <div class="collTitleLeft">
              <div class="collTitle1">总支出(元)</div>
              <div class="collTitle2">
                {{ moneyFormat(tableData.totalOutAmount) }}
              </div>
            </div>
            <div class="collTitleLeft1 ml15">
              <div class="collTitleLeft1-left">
                <span class="collTitle4">总应付(采购款)</span
                ><span class="collTitle4" style="margin-left: 15px">{{
                  moneyFormat(tableData.totalPayable)
                }}</span>
              </div>
              <div>
                <span class="collTitle4">其他支出</span
                ><span class="collTitle4" style="margin-left: 15px">{{
                  moneyFormat(tableData.otherExpenses)
                }}</span>
              </div>
            </div>
            <div class="lineH"></div>
            <div class="collTitleLeft">
              <div class="collTitle1">往来款余额(元)</div>
              <div class="collTitle2">
                {{ moneyFormat(tableData.businessPayments) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <el-divider></el-divider>
      <el-input
        v-model="queryData.search"
        size="small"
        style="width: 18%; margin-right: 20px"
        placeholder="请输入客户姓名/联系电话/企业名称"
        prefix-icon="el-icon-search"
      >
      </el-input>
      <div class="search-form-border">
        <span class="search-form-title">往来款余额</span>
        <el-select v-model="queryData.type" size="small">
          <el-option label="全部" value="0"></el-option>
          <el-option label="我欠对方" value="1"></el-option>
          <el-option label="对方欠我" value="2"></el-option>
          <el-option label="未欠款" value="3"></el-option>
        </el-select>
      </div>
      <el-button size="small" @click="handleReset">重置</el-button>
      <el-button size="small" type="primary" @click="handleSearch"
        >查询</el-button
      >
      <el-divider></el-divider>
      <!-- 表格主体 -->
      <div class="currentInventory-table">
        <u-table
          ref="plTable"
          class="utable"
          :height="$store.getters.screenHeight - 450 + 'px'"
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
          :data="tableDataList"
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
              <span v-else-if="item.prop == 'fromUserName'"
                >{{ scope.row.fromUserName }}
                <el-image
                  v-if="scope.row.type == 1"
                  :src="urlfei"
                  class="img-icon"
                ></el-image>
                <el-image
                  v-else-if="scope.row.type == 3 || scope.row.type == 4"
                  :src="urlcai"
                  class="img-icon"
                >
                </el-image>
                <el-image
                  v-else-if="scope.row.type == 10 || scope.row.type == 11"
                  :src="urlgong"
                  class="img-icon"
                ></el-image>
                <el-image
                  v-else-if="scope.row.type == 6 || scope.row.type == 7"
                  :src="urljing"
                  class="img-icon"
                >
                </el-image>
              </span>
              <span v-else-if="item.prop == 'payMents'">
                <span v-if="scope.row.isPositive == 0" style="color: #248b39">
                  {{ scope.row[item.prop] }}
                </span>
                <span v-else style="color: #dd4c4d">
                  {{ scope.row[item.prop] }}
                </span>
              </span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </u-table-column>
          <u-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleJumpDetail('path', scope.row)"
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
  </Container>
</template>

<script>
import { Base64 } from "js-base64";
import { businessPayments } from "@/request/api/financialManage/index";
export default {
  name: "currentPayment",
  data() {
    return {
      loading: true,
      queryData: {
        search: "",
        type: "0", // 0 全部 1 我欠对方的 2 对方欠我的 3 未欠款
      },
      pagination: {
        page: 1, // 页码
        limit: 10, // 分页大小
        total: 0,
      },
      columns: [
        {
          minWidth: 110,
          prop: "fromUserName",
          label: "客户姓名",
          align: "left",
        },
        {
          minWidth: 110,
          prop: "fromUserPhone",
          label: "联系电话",
          align: "left",
        },
        {
          minWidth: 200,
          prop: "companyName",
          label: "企业名称",
          align: "left",
        },
        {
          minWidth: 140,
          prop: "payMents",
          label: "往来款余额(元)",
          sortable: true,
          align: "left",
        },
      ],
      tableData: {},
      tableDataList: [],
      urljing: require("@/assets/image/imgs/jing-icon.png"),
      urlcai: require("@/assets/image/imgs/cai-icon.png"),
      urlgong: require("@/assets/image/imgs/gong-icon.png"),
      urlfei: require("@/assets/image/imgs/fei-icon.png"),
    };
  },
  methods: {
    getList(arg) {
      if (arg === 1) {
        this.pagination.page = 1;
      }
      let param = {
        ...this.queryData,
        pageindex: this.pagination.page, // 页码
        pagesize: this.pagination.limit, // 分页大小
      };
      businessPayments(param).then((res) => {
        this.tableData = res.data[0];
        this.tableDataList = res.data[0].modelList;
        this.pagination.total = res.data[0].modelListCount;
        this.loading = false;
      });
    },
    sortChange(column) {
      // ascending 由小到大 descending 由大到小
      let resData = JSON.parse(JSON.stringify(this.tableDataList));
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
        this.tableDataList = resData;
      }
    },
    // 数值取两位小数
    moneyFormat(moneyStr) {
      if (moneyStr > 10000) {
        let a = Number(moneyStr / 10000)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
        return a + "万";
      } else {
        let a = Number(moneyStr)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
        return a + "元";
      }
    },
    // 跳转页面
    handleJumpDetail(path, record) {
      let query = {};
      if (record.type == 1) {
        query = {
          customerId: record.fromUserName + "," + record.fromUserPhone, //用户姓名
          currentView: "comegoMoney",
        };
      } else {
        query = {
          customerId: record.toUserId, //客户userid 非平台为 ""}
          currentView: "comegoMoney",
        };
      }
      this.$router.push({
        path: "/customerManage/customerDetail",
        // query:query
        query: {
          data: Base64.encode(JSON.stringify(query)),
        }, //加密
        //用户类型id 1 非平台 3 企业采购户 4 个人采购户 6 企业经营户 7 个人经营户 10 个人供应商 11 企业供应商
      });
    },
    // 刷新
    hanleRefresh() {
      this.loading = true;
      this.getList();
    },
    //查询
    handleSearch() {
      this.loading = true;
      this.getList(1);
    },
    //重置
    handleReset() {
      this.loading = true;
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
      this.loading = true;
      this.pagination.page = val;
      this.getList();
    },
  },
  created() {
    this.getList(1);
  },
};
</script>

<style lang="scss" scoped>
.currentInventory-model {
  .header-page {
    display: flex;
    height: 100px;
    width: 100%;
    background: rgba(0, 0, 0, 0.04);
    border: 1px solid rgba(0, 0, 0, 0.04);
    padding: 20px 24px;

    .header-left {
      .header-left-content {
        display: flex;
        align-items: center;

        .collTitleLeft {
          min-width: 110px;

          .collTitle1 {
            margin-bottom: 4px;
            font-size: 16px;
            color: rgba(1, 6, 33, 0.55);
          }

          .collTitle2 {
            font-size: 24px;
            color: rgba(1, 6, 33, 0.9);
          }
        }

        .collTitleLeft1 {
          min-width: 110px;

          .collTitleLeft1-left {
            margin-bottom: 12px;
          }

          .collTitle4 {
            font-size: 14px;
            color: rgba(1, 6, 33, 0.55);
          }
        }

        .ml15 {
          margin-left: 15px;
        }

        .lineH {
          width: 1px;
          height: 34px;
          border-right: 1px solid rgba(1, 6, 33, 0.35);
          overflow: hidden;
          box-shadow: none;
          margin: 12px 24px;
        }
      }
    }
  }

  .search-form-border {
    display: inline-block;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin-right: 15px;
    background-color: #ffffff;

    .search-form-title {
      padding: 0px 8px;
      font-size: 14px;
      color: rgba(1, 6, 33, 0.35);
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

  .el-divider--horizontal {
    margin: 17px 0px;
  }

  .img-icon {
    height: 14px;
    margin-right: 2px;
  }

  .paging {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-top: 5px;
    padding-bottom: 5px;
  }
}
</style>