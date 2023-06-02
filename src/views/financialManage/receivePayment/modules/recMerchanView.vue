<template>
  <!--商品销售  -->
  <div class="recMerchanView-model">
    <div class="recMerchanView-search">
      <div>
        <el-input
          style="width: 300px"
          placeholder="请输入客户姓名/联系电话/企业名称/单号"
          prefix-icon="el-icon-search"
          v-model="queryData.search"
          size="small"
        >
        </el-input>

        <el-button
          style="border: #0ba198 solid 1px; color: #0ba198; margin-left: 10px"
          size="small"
          @click="handleReset"
          >重置</el-button
        >
        <el-button type="primary" size="small" @click="handleSearch"
          >查询</el-button
        >
      </div>
    </div>

    <div class="recMerchanView-amount">
      <i class="el-icon-warning" style="color: rgba(26, 127, 217, 1)"></i>
      <span
        style="
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
          margin-right: 32px;
          margin-left: 10px;
        "
        >未收销售款：<span style="color: rgba(1, 6, 33, 0.9); font-size: 20px">
          {{ tableData.uncollectedOrder | intervalFormat(false) }}</span
        ></span
      >
    </div>

    <div class="recMerchanView-table">
      <u-table
        ref="plTable"
        class="utable"
        :height="parseInt($store.getters.screenHeight - 410) + 'px'"
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
          :sortable="item.sortable"
        >
          <template slot-scope="scope">
            <span v-if="item.prop == 'fromUserName'">
              {{ scope.row[item.prop] }}
              <span v-html="handleMerchantType(scope.row.typeId)"></span>
            </span>
            <span
              v-else-if="
                item.prop == 'orderTotalPrice' || item.prop == 'actualPayPrice'
              "
            >
              {{ scope.row[item.prop] | intervalFormat(false) }}
            </span>
            <span v-else-if="item.prop == 'companyName'">
              {{ scope.row[item.prop] || "-" }}
            </span>
            <span
              v-else-if="
                item.prop == 'timestamp' || item.prop == 'confirmTimestamp'
              "
            >
              <span v-if="scope.row[item.prop] != 0">{{
                scope.row[item.prop] | parseTime()
              }}</span>
              <span v-else>-</span>
            </span>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </u-table-column>
        <u-table-column label="操作" :width="100" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handleJumpDetail1('currentBasketDetails', scope.row)"
              >查看</el-button
            >
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
        ></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { uncollectedOrder } from "@/request/api/financialManage/index";
export default {
  name: "recMerchanView",
  components: {},
  data() {
    return {
      queryData: { search: "" },
      tableData: {},
      tableDataList: [],
      columns: [
        {
          minWidth: 180,
          prop: "orderNo",
          label: "单号",
          align: "left",
        },
        {
          minWidth: 180,
          prop: "fromUserName",
          label: "客户姓名",
          align: "left",
        },
        {
          minWidth: 180,
          prop: "fromUserPhone",
          label: "联系电话",
          align: "left",
        },
        {
          minWidth: 180,
          prop: "companyName",
          label: "企业名称",
          align: "left",
        },
        {
          minWidth: 180,
          prop: "orderTotalPrice",
          label: "订单金额(元)",
          align: "left",
        },
        {
          minWidth: 180,
          prop: "actualPayPrice",
          label: "未收金额(元)",
          align: "left",
        },
        {
          minWidth: 180,
          prop: "timestamp",
          label: "创建时间",
          align: "left",
        },
        {
          minWidth: 180,
          prop: "confirmTimestamp",
          label: "成交时间",
          align: "left",
        },
      ],
      pagination: {
        page: 1, // 页码
        limit: 50, // 分页大小
        total: 0,
      },
    };
  },
  methods: {
    getList(arg) {
      if (arg === 1) {
        this.pagination.page = 1;
      }

      let param = {
        orderType: 1, // 订单类型，1 商品销售 2 筐子售出 3 退货退款 4 退筐退款 5 商品配送 6 记账 必传
        pageindex: this.pagination.page, // 页码
        pagesize: this.pagination.limit, // 每页的数据
        search: this.queryData.search, // 模糊搜索  选填
      };

      uncollectedOrder(param).then((res) => {
        if (res.status == 200) {
          this.tableData = res.data[0];
          this.tableDataList = res.data[0].modelList;
          this.pagination.total = res.data[0].modelListCount;
        }
      });
    },
    handleMerchantType(val) {
      let elTage = "";
      if (val == 0) {
        elTage =
          "<span class='elTagbg4 el-tag el-tag--mini el-tag--light' style='margin: 0px 4px;'>非</span>";
      } else if (val == 3 || val == 4) {
        elTage =
          "<span class='elTagbg2 el-tag el-tag--mini el-tag--light' style='margin: 0px 4px;'>采</span>";
      } else if (val == 6 || val == 7) {
        elTage =
          "<span class='elTagbg1 el-tag el-tag--mini el-tag--light' style='margin: 0px 4px;'>经</span>";
      } else if (val == 10 || val == 11) {
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
    //重置
    handleReset() {
      this.queryData = this.$options.data().queryData;
      this.pagination = this.$options.data().pagination;
      this.getList(1);
    },
    //查询
    handleSearch() {
      this.getList(1);
    },
  },
  created() {
    this.getList(1);
  },
};
</script>
<style scoped lang="scss">
.recMerchanView-model {
  .recMerchanView-search {
    padding-bottom: 15px;
    border-bottom: 1px solid #e9e9e9;
  }
  .recMerchanView-amount {
    margin-top: 15px;
    background: rgba(230, 247, 255, 1);
    border: 1px solid rgba(26, 127, 217, 0.5);
    border-radius: 5px;
    padding: 5px 10px;
  }

  .recMerchanView-table {
    padding-top: 15px;
    .utable {
      width: 100%;
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