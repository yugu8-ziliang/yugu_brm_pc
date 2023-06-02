<template>
  <TableContainer
    title="转账管理"
    :page-size="queryData.pagesize"
    :total="queryData.total"
    :page-num="queryData.pageindex"
    @pagination="handlePagination"
  >
    <el-header style="height: 200px">
      <el-row :gutter="55">
        <el-col :span="24">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="我发出的" name="1"></el-tab-pane>
            <el-tab-pane label="我收到的" name="2"></el-tab-pane>
          </el-tabs>
        </el-col>
      </el-row>
      <el-row type="flex" :gutter="15">
        <el-col :span="4">
          <el-select v-model="queryData.transferType" size="small" clearable>
            <template slot="prefix">
              <div class="label-title">转账类型</div>
            </template>
            <el-option label="归还预付款" value="1"></el-option>
            <el-option label="归还借款" value="2"></el-option>
            <el-option label="借款" value="3"></el-option>
            <el-option label="其他" value="4"></el-option>
            <el-option label="预付款" value="5"></el-option>
            <el-option label="支付记账货款" value="6"></el-option>
            <el-option label="支付记账筐子款" value="7"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-select v-model="queryData.status" size="small">
            <template slot="prefix">
              <div class="label-title">转账单状态</div>
            </template>
            <el-option
              :label="activeName == '1' ? '待对方收款' : '待收款'"
              value="2"
            ></el-option>
            <el-option
              :label="activeName == '1' ? '已付款' : '已收款'"
              value="3"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="date_header_styl">
          <el-date-picker
            value-format="timestamp"
            size="small"
            prefix-icon="0"
            v-model="queryData.created_time"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <span class="date_header_text">创建日期</span>
        </el-col>
        <el-col :span="6" class="date_header_styl">
          <el-date-picker
            value-format="timestamp"
            size="small"
            prefix-icon="0"
            v-model="queryData.deal_time"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <span class="date_header_text">成交日期</span>
        </el-col>
      </el-row>
      <el-row style="margin-top: 15px; margin-bottom: 15px">
        <el-col :span="4">
          <el-input
            v-model="queryData.search"
            size="small"
            placeholder="请输入客户姓名/联系电话/企业名称/单号"
          >
            <template slot="prefix">
              <div class="label-title">搜索</div>
            </template>
          </el-input>
        </el-col>
        <el-col :span="18">
          <el-button
            style="border: #0ba198 solid 1px; color: #0ba198; margin-left: 20px"
            size="small"
            @click="Reset"
            >重置</el-button
          >
          <el-button type="primary" size="small" @click="Query">查询</el-button>
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-button
        type="primary"
        style="margin-bottom: 20px"
        size="small"
        @click="toAdd"
        >发起转账</el-button
      >
    </el-header>
    <el-main>
      <el-table
        :data="tableData"
        :loading="loading"
        :height="$store.getters.screenHeight - 480 + 'px'"
        style="border: 1px solid #e9e9e9"
      >
        <el-table-column label="单号" prop="transferNo"></el-table-column>
        <el-table-column label="客户姓名">
          <template slot-scope="scope">
            {{ scope.row.userName }}
            <el-tag type="info" v-if="scope.row.userType == 0">非</el-tag>
            <el-tag v-if="scope.row.userType == 11 || scope.row.userType == 10"
              >供</el-tag
            >
            <el-tag
              type="danger"
              v-if="scope.row.userType == 6 || scope.row.userType == 7"
              >经</el-tag
            >
            <el-tag
              type="warning"
              v-if="scope.row.userType == 3 || scope.row.userType == 4"
              >采</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column label="联系电话" prop="userPhone"></el-table-column>
        <el-table-column label="企业名称">
          <template slot-scope="scope">
            {{ scope.row.companyName == "" ? "-" : scope.row.companyName }}
          </template>
        </el-table-column>
        <el-table-column label="金额(元)">
          <template slot-scope="scope">
            {{ currencyFormat(scope.row.transferPrice) }}
          </template>
        </el-table-column>
        <el-table-column label="转账类型">
          <template slot-scope="scope">
            {{
              scope.row.transferType == 1
                ? "归还预付款"
                : scope.row.transferType == 2
                ? "归还借款"
                : scope.row.transferType == 3
                ? "借款"
                : scope.row.transferType == 4
                ? "其他"
                : scope.row.transferType == 5
                ? "预付款"
                : scope.row.transferType == 6
                ? "支付记账货款"
                : "支付记账筐子款"
            }}
          </template>
        </el-table-column>
        <el-table-column label="转账单状态">
          <template slot-scope="scope">
            <span
              class="dot_styl"
              style="color: #d0d0d2"
              v-if="scope.row.status == 0"
              >●</span
            >
            <span
              class="dot_styl"
              style="color: #df971a"
              v-if="scope.row.status == 1"
              >●</span
            >
            <span
              class="dot_styl"
              style="color: #1a7fd9"
              v-if="scope.row.status == 2"
              >●</span
            >
            <span
              class="dot_styl"
              style="color: #248b39"
              v-if="scope.row.status == 3"
              >●</span
            >
            <span v-if="activeName == '1'">{{
              scope.row.status == 0
                ? "失效"
                : scope.row.status == 1
                ? "待修改 "
                : scope.row.status == 2
                ? "待对方收款 "
                : "已付款"
            }}</span>
            <span v-if="activeName == '2'">{{
              scope.row.status == 0
                ? "失效"
                : scope.row.status == 1
                ? "待修改 "
                : scope.row.status == 2
                ? "待收款 "
                : "已收款"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{ toDate(scope.row.timestamp) }}
          </template>
        </el-table-column>
        <el-table-column label="成交时间">
          <template slot-scope="scope">
            {{
              scope.row.confirmTimestamp != null
                ? toDate(scope.row.confirmTimestamp)
                : "--"
            }}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="check(scope.row.transferNo)"
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </TableContainer>
</template>
<script>
import moment from "moment";
import { getList } from "@/request/api/transferManage/index.js";
export default {
  data() {
    return {
      activeName: "1",
      backetcount: "",
      backetmoney: "",
      loading: false,
      tableData: [],
      queryData: {
        pageindex: 1,
        pagesize: 10,
        total: 0,
      },
    };
  },
  methods: {
    handleClick() {
      (this.queryData = {
        pageindex: 1,
        pagesize: 10,
      }),
        this.getList();
    },
    toAdd() {
      this.$router.push({ path: "Atransfer" });
    },
    Query() {
      this.getList();
    },
    Reset() {
      (this.queryData = {
        pageindex: 1,
        pagesize: 10,
      }),
        this.getList();
    },
    currencyFormat(num) {
      let a = Number(num)
        .toFixed(2)
        .toString()
        .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      return a;
    },
    check(id) {
      // console.log(id)
      this.$router.push({ path: "transferDetail", query: { id: id } });
    },
    toDate(val) {
      return moment(val * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
    getList() {
      this.loading = true;
      let obj = {};
      // console.log(this.queryData);
      obj = this.queryData;
      if (this.queryData.created_time) {
        //格式化查询条件#创建时间
        obj.startTime = this.queryData.created_time[0] / 1000;
        obj.endTime = this.queryData.created_time[1] / 1000;
      }
      if (this.queryData.deal_time) {
        obj.startConfirmTimestamp = this.queryData.deal_time[0] / 1000;
        obj.endConfirmTimestamp = this.queryData.deal_time[1] / 1000;
      }
      obj.tip = this.activeName == "1" ? 0 : 1;
      getList(obj).then((resp) => {
        // console.log(resp)
        this.queryData.total = resp.all;
        this.tableData = resp.data;
        this.loading = false;
      });
    },
    handlePagination(e) {
      this.queryData.pageindex = e.pageNum;
      this.queryData.pagesize = e.pageSize;
      this.getList();
    },
  },
  created() {
    this.getList();
  },
  mounted() {
    document.getElementsByClassName("el-range__close-icon")[0].className +=
      " el-icon-date"; //在原来的后面加这个
    document.getElementsByClassName("el-range__close-icon")[1].className +=
      " el-icon-date";
  },
};
</script>
<style scoped lang="scss">
.main_styl {
  overflow-x: hidden !important;
}
.dot_styl {
  font-size: 20px;
  padding-right: 5px;
}
::v-deep .table-main {
  margin: 0px !important;
}
::v-deep .table-page {
  padding: 0px !important;
}
::v-deep .el-range-editor--small.el-input__inner {
  border-radius: 2px;
}
::v-deep .el-divider--horizontal {
  margin: 0px 0px 24px 0px;
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
  padding-left: 80px;
  border-radius: 2px;
}
::v-deep .el-input--prefix .el-input__inner {
  padding-left: 40px;
  border-radius: 2px;
}
.date_header_styl {
  position: relative;
}
.date_header_text {
  position: absolute;
  left: 17px;
  top: 6px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(1, 6, 33, 0.35);
}
.el-tag {
  padding: 0px 1px !important;
}
.el-tag--medium {
  height: 17px !important;
  line-height: 17px !important;
}
</style>