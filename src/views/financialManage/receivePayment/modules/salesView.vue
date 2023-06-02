<template>
  <!--销售款  -->
  <div class="salesView-model">
    <div class="salesView-search">
      <div>
        <el-input
          style="width: 270px"
          placeholder="请输入客户姓名/联系电话/企业名称"
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

    <div class="salesView-amount">
      <i class="el-icon-warning" style="color: rgba(26, 127, 217, 1)"></i>
      <span
        style="
          color: rgba(0, 0, 0, 0.65);
          font-size: 14px;
          margin-right: 32px;
          margin-left: 10px;
        "
        >待收销售款：<span style="color: rgba(1, 6, 33, 0.9); font-size: 20px">
          {{ tableData.collectionAmount | intervalFormat(false) }}</span
        ></span
      >
    </div>

    <div class="salesView-table">
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
            <span v-if="item.prop == 'customerName'">
              {{ scope.row[item.prop] }}
              <span v-html="handleMerchantType(scope.row.customerType)"></span>
            </span>
            <span v-else-if="item.prop == 'collectionAmount'">
              {{ scope.row[item.prop] | intervalFormat(true) }}
            </span>
            <span v-else-if="item.prop == 'relationOrders'">
              {{ scope.row[item.prop] }}张
            </span>

            <span v-else-if="item.prop == 'timestamp'">
              {{ scope.row[item.prop] | parseTime() }}
            </span>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </u-table-column>
        <u-table-column label="操作" :width="100" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="handlePaid('confirmedPaid', '确认收款', scope.row)"
              >确认</el-button
            >
            <el-button
              type="text"
              @click="handleJumpDetail('paymentDetail', scope.row)"
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
    <confirmedPaid ref="confirmedPaid" />
  </div>
</template>
<script>
import { userCollectionList } from "@/request/api/financialManage/index";
import { Base64 } from "js-base64";

export default {
  name: "salesView",
  components: {
    confirmedPaid: () => import("../dialogmod/confirmedPaid.vue"), // 确认收款
  },
  data() {
    return {
      queryData: { search: "" },
      tableData: {},
      tableDataList: [],
      columns: [
        {
          minWidth: 180,
          prop: "customerName",
          label: "客户姓名",
          align: "left",
        },
        {
          minWidth: 180,
          prop: "customerPhone",
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
          prop: "collectionAmount",
          label: "待收金额(元)",
          align: "left",
        },
        {
          minWidth: 180,
          prop: "timestamp",
          label: "付款时间",
          align: "left",
        },
        {
          minWidth: 180,
          prop: "relationOrders",
          label: "关联订单",
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
        orderType: 1, // 订单类型，1：销售款，2：退货退款，3：筐子售出，4：退筐退筐，5：转账
        pageindex: this.pagination.page, // 页码
        pagesize: this.pagination.limit, // 每页的数据
        search: this.queryData.search, // 模糊搜索  选填
      };

      userCollectionList(param).then((res) => {
        if (res.status == 200) {
          this.tableData = res.data[0];
          this.tableDataList = res.data[0].modelList;
          this.pagination.total = res.data[0].sumCount;
        }
      });
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
    handlePaid(form, title, row) {
      this.$refs[form].edit(row);
      this.$refs[form].title = title;
      this.$refs[form].disableSubmit = false;
      this.$refs[form].isVisiable = true;
    },
    // 跳转页面
    handleJumpDetail: function (form, record) {
      this.$router.push({
        path: form,
        query: {
          data: Base64.encode(
            JSON.stringify({ typeIs: 0, ...record })
          ),
        }, //加密
      });
      // Base64.decode(this.pwd);//解密
    },
  },
  created() {
    this.getList(1);
  },
};
</script>
<style scoped lang="scss">
.salesView-model {
  .salesView-search {
    padding-bottom: 15px;
    border-bottom: 1px solid #e9e9e9;
  }
  .salesView-amount {
    margin-top: 15px;
    background: rgba(230, 247, 255, 1);
    border: 1px solid rgba(26, 127, 217, 0.5);
    border-radius: 5px;
    padding: 5px 10px;
  }

  .salesView-table {
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