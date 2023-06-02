<template>
  <TableContainer
    title="售出筐子管理"
    :page-size="queryData.pagesize"
    :total="queryData.total"
    :page-num="queryData.pageindex"
    @pagination="handlePagination"
  >
    <!-- INFO -->
    <div class="main-info">
      <div class="main-info__item">
        <info-item
          title="筐子售出总数量(个)"
          :content="currencyFormat(backetcount)"
        >
        </info-item>
      </div>
      <el-divider direction="vertical"></el-divider>
      <div class="main-info__item">
        <info-item
          title="筐子售出总金额(元)"
          :content="currencyFormat(backetmoney)"
        >
        </info-item>
      </div>
      <el-button class="main-info__btn" type="primary" plain @click="toAdd"
        >新建筐子购入</el-button
      >
    </div>
    <el-divider class="der_styl"></el-divider>
    <el-row type="flex" :gutter="15">
      <el-col :span="4">
        <el-select v-model="queryData.userType" size="small" clearable>
          <template slot="prefix">
            <div class="label-title">客户类型</div>
          </template>
          <el-option label="全部" :value="0"></el-option>
          <el-option label="平台用户" :value="1"></el-option>
          <el-option label="非平台用户" :value="2"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="queryData.orderType" size="small" clearable>
          <template slot="prefix">
            <div class="label-title">订单类型</div>
          </template>
          <el-option label="全部" :value="0"></el-option>
          <el-option label="筐子报废单" :value="2"></el-option>
          <el-option label="筐子售出单" :value="1"></el-option>
        </el-select>
      </el-col>
      <el-col :span="4">
        <el-select v-model="queryData.type" size="small">
          <template slot="prefix">
            <div class="label-title">订单状态</div>
          </template>
          <el-option label="全部" :value="0"></el-option>
          <el-option label="待修改" :value="1"></el-option>
          <el-option label="待对方付款" :value="3"></el-option>
          <el-option label="未结清" :value="5"></el-option>
          <el-option label="代收款" :value="4"></el-option>
          <el-option label="已结清" :value="6"></el-option>
          <el-option label="未成交" :value="7"></el-option>
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
        <span class="date_header_text">订单时间</span>
      </el-col>
    </el-row>
    <el-row style="margin-top: 15px; margin-bottom: 15px">
      <el-col :span="4">
        <el-input
          v-model="queryData.search"
          size="small"
          placeholder="请输入客户姓名/联系电话/企业名称/编号"
        >
          <template slot="prefix">
            <div class="label-title">搜索</div>
          </template>
        </el-input>
      </el-col>
      <el-col :span="8">
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
    <el-table
      :data="tableData"
      :loading="loading"
      :height="$store.getters.screenHeight - 500 + 'px'"
      style="border-left: 1px solid #e9e9e9; border-right: 1px solid #e9e9e9"
    >
      <el-table-column label="订单类型" prop="type"
        >、
        <template slot-scope="scope">
          {{ scope.row.type == 0 ? "筐子售出单" : "筐子报废单" }}
        </template>
      </el-table-column>
      <el-table-column
        label="售出单编号"
        prop="orderbasketId"
      ></el-table-column>
      <el-table-column label="客户姓名">
        <template slot-scope="scope">
          {{ scope.row.fromUserName }}
          <el-tag type="info" v-if="scope.row.typeId == 0" class="tag_styl"
            >非</el-tag
          >
          <el-tag
            v-if="scope.row.typeId == 11 || scope.row.typeId == 10"
            class="tag_styl"
            >供</el-tag
          >
          <el-tag
            type="danger"
            v-if="scope.row.typeId == 11 || scope.row.typeId == 7"
            class="tag_styl"
            >经</el-tag
          >
          <el-tag
            type="warning"
            v-if="scope.row.typeId == 3 || scope.row.typeId == 4"
            class="tag_styl"
            >采</el-tag
          > </template
        >6
      </el-table-column>
      <el-table-column label="联系电话" prop="fromUserPhone"></el-table-column>
      <el-table-column label="企业名称">
        <template slot-scope="scope">
          {{ scope.row.companyName == "" ? "-" : scope.row.companyName }}
        </template>
      </el-table-column>
      <el-table-column
        label="筐子数量(个)"
        prop="basketCount"
      ></el-table-column>
      <el-table-column label="订单金额(元)">
        <template slot-scope="scope">
          {{ currencyFormat(scope.row.orderTotalPrice) }}
        </template>
      </el-table-column>
      <el-table-column label="已收金额(元)">
        <template slot-scope="scope">
          {{ currencyFormat(scope.row.actualPayPrice) }}
        </template>
      </el-table-column>
      <el-table-column label="剩余未收(元)">
        <template slot-scope="scope">
          {{ currencyFormat(scope.row.remainingActualPayPrice) }}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <span
            class="dot_styl"
            style="color: #d0d0d2"
            v-if="scope.row.orderStatus == 1"
            >●</span
          >
          <span
            class="dot_styl"
            style="color: #df971a"
            v-if="scope.row.orderStatus == 3"
            >●</span
          >
          <span
            class="dot_styl"
            style="color: #dd4c4d"
            v-if="scope.row.orderStatus == 4"
            >●</span
          >
          <span
            class="dot_styl"
            style="color: #1a7fd9"
            v-if="scope.row.orderStatus == 5"
            >●</span
          >
          <span
            class="dot_styl"
            style="color: #248b39"
            v-if="scope.row.orderStatus == 6"
            >●</span
          >
          <span
            class="dot_styl"
            style="color: #dd4c4d"
            v-if="scope.row.orderStatus == 7"
            >●</span
          >
          {{
            scope.row.orderStatus == 3
              ? "待对方付款"
              : scope.row.orderStatus == 4
              ? "代收款"
              : scope.row.orderStatus == 5
              ? "未结清"
              : scope.row.orderStatus == 6
              ? "已结清"
              : scope.row.orderStatus == 7
              ? "未成交"
              : "待修改"
          }}
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
            scope.row.confirmTimestamp
              ? toDate(scope.row.confirmTimestamp)
              : "--"
          }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="text"
            @click="check(scope.row.orderId, scope.row.typeId, scope.row.type)"
            >查看</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </TableContainer>
</template>
<script>
import moment from "moment";
import { getList } from "@/request/api/basketSold/index.js";
export default {
  data() {
    return {
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
    toAdd() {
      this.$router.push({ path: "BasketSoldAdd" });
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
    check(id, type, type2) {
      if (type2 == 0) {
        this.$router.push({
          path: "/frameManage/saleOrder",
          query: { orderId: id, basketInOutTypeView: type },
        });
      } else {
        this.$router.push({
          path: "/frameManage/scrapOrder",
          query: { orderId: id, basketInOutTypeView: type },
        });
      }
    },
    toDate(val) {
      return moment(val * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
    Query() {
      this.getList();
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
      console.log(obj);
      getList(obj).then((resp) => {
        console.log(resp.data);
        this.backetcount = resp.data[0].backetcount;
        this.backetmoney = resp.data[0].backetmoney;
        this.queryData.total = resp.data[0].modelListCount;
        this.tableData = resp.data[0].modelList;
        this.loading = false;
      });
    },
    handlePagination(e) {
      this.queryData.pageindex = e.pageNum;
      this.queryData.pagesize = e.pageSize;
      this.getList();
    },
  },
  mounted() {
    document.getElementsByClassName("el-range__close-icon")[0].className +=
      " el-icon-date"; //在原来的后面加这个
  },
  created() {
    this.getList();
  },
};
</script>
<style lang="scss" scoped>
.dot_styl {
  font-size: 20px;
  padding-right: 5px;
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
  padding-left: 70px;
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

.main-info {
  display: flex;
  align-items: flex-start;
  align-items: center;
  margin-bottom: 24px;

  /deep/ .el-divider {
    margin: 0 45px;
    height: 34px;
  }

  .main-info__btn {
    margin-left: auto;
  }
}
</style>