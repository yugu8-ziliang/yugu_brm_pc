<template>
  <!-- 退货退款 -->
  <TableContainer
    :total="queryData.total"
    :page-size="queryData.pageSize"
    :page-num="queryData.pageNum"
    @pagination="handlePagination"
  >
    <div class="pageTitle">
      <el-row>
        <el-col :span="8">
          <p class="font_styl_1">我发出的</p>
          <div style="margin-top: 15px">
            <el-col :span="8" class="title_layout_1">退款单金额(元)</el-col>
            <el-col :span="16" class="title_layout_2">
              {{ currencyFormat(pageData.allActualPayPrice) }}
              <el-tooltip class="item" effect="dark" placement="right">
                <i
                  class="el-icon-warning-outline"
                  style="color: #00a499; font-size: 16px"
                ></i>
                <div slot="content">
                  <div>
                    应收退货退款:{{
                      currencyFormat(pageData.productActualPayPrice)
                    }}元
                  </div>
                  <div style="padding: 15px 0px">
                    应收退款:{{
                      currencyFormat(pageData.refundActualPayPrice)
                    }}元
                  </div>
                  <div>
                    应收退筐退款:{{
                      currencyFormat(pageData.basketActualPayPrice)
                    }}元
                  </div>
                </div>
              </el-tooltip>
            </el-col>
          </div>
          <div style="margin-top: 15px">
            <el-col :span="8" class="title_layout_1">未收退款金额(元)</el-col>
            <el-col :span="16" class="title_layout_2">
              {{ currencyFormat(pageData.allUncollectedPrice) }}
              <el-tooltip class="item" effect="dark" placement="right">
                <i
                  class="el-icon-warning-outline"
                  style="color: #00a499; font-size: 16px"
                ></i>
                <div slot="content">
                  <div>
                    未收退货退款:{{
                      currencyFormat(pageData.productUncollectedPrice)
                    }}元
                  </div>
                  <div style="padding: 15px 0px">
                    未收退款:{{
                      currencyFormat(pageData.refundUncollectedPrice)
                    }}元
                  </div>
                  <div>
                    未收退筐退款:{{
                      currencyFormat(pageData.basketUncollectedPrice)
                    }}元
                  </div>
                </div>
              </el-tooltip>
            </el-col>
          </div>
        </el-col>
        <el-col :span="1">
          <el-divider direction="vertical" class="titledivider"></el-divider>
        </el-col>
        <el-col :span="8">
          <p class="font_styl_1">我收到的</p>
          <div style="margin-top: 15px">
            <el-col :span="8" class="title_layout_1">退款单金额(元)</el-col>
            <el-col :span="16" class="title_layout_2">
              {{ currencyFormat(pageData.allPayablePrice) }}
              <el-tooltip class="item" effect="dark" placement="right">
                <i
                  class="el-icon-warning-outline"
                  style="color: #00a499; font-size: 16px"
                ></i>
                <div slot="content">
                  <div>
                    应付退货退款:{{
                      currencyFormat(pageData.productPayablePrice)
                    }}元
                  </div>
                  <div style="padding: 15px 0px">
                    应付退款:{{ currencyFormat(pageData.refundPayablePrice) }}元
                  </div>
                  <div>
                    应付退筐退款:{{
                      currencyFormat(pageData.basketPayablePrice)
                    }}元
                  </div>
                </div>
              </el-tooltip>
            </el-col>
          </div>
          <div style="margin-top: 15px">
            <el-col :span="8" class="title_layout_1">未付退款金额(元)</el-col>
            <el-col :span="16" class="title_layout_2">
              {{ currencyFormat(pageData.allUnpaidPrice) }}
              <el-tooltip class="item" effect="dark" placement="right">
                <i
                  class="el-icon-warning-outline"
                  style="color: #00a499; font-size: 16px"
                ></i>
                <div slot="content">
                  <div>
                    未付退货退款:{{
                      currencyFormat(pageData.productUnpaidPrice)
                    }}元
                  </div>
                  <div style="padding: 15px 0px">
                    未付退款:{{ currencyFormat(pageData.refundUnpaidPrice) }}元
                  </div>
                  <div>
                    未付退筐退款:{{
                      currencyFormat(pageData.basketUnpaidPrice)
                    }}元
                  </div>
                </div>
              </el-tooltip>
            </el-col>
          </div>
        </el-col>
      </el-row>
    </div>
    <el-divider></el-divider>
    <div style="min-width: 1400px">
      <div class="pageQuery">
        <el-button
          type="primary"
          size="mini"
          style="position: absolute; right: -100px"
          @click="toPage"
          >申请退款</el-button
        >
        <div class="queryitem_layout_2">
          <el-cascader
            size="mini"
            :show-all-levels="false"
            v-model="queryData.moduleAndOrder"
            :options="orderTypeOptions"
          >
          </el-cascader>
          <div class="queryitem_layout">退款单据</div>
        </div>
        <div style="position: relative; margin: 0px 20px 20px 0px">
          <el-date-picker
            class="timestitle_change"
            size="mini"
            prefix-icon="timestitles"
            v-model="queryData.times"
            type="datetimerange"
            value-format="timestamp"
            range-separator="-"
            :clearable="false"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <div style="position: absolute; left: 7px; top: 3px; font-size: 14px">
            订单时间
          </div>
        </div>
        <div style="position: relative; margin: 0px 20px 20px 0px">
          <el-select
            v-model="queryData.user_type"
            placeholder="请选择"
            size="mini"
          >
            <el-option
              v-for="item in usertypeoptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <div style="position: absolute; left: 7px; top: 3px; font-size: 14px">
            用户类型
          </div>
        </div>
        <div style="position: relative; margin: 0px 20px 20px 0px">
          <el-select
            v-model="queryData.status"
            placeholder="请选择"
            size="mini"
          >
            <el-option
              v-for="item in orderStatusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
          <div style="position: absolute; left: 7px; top: 3px; font-size: 14px">
            订单状态
          </div>
        </div>
        <div style="margin: 0px 20px 20px 0px">
          <el-input
            size="mini"
            style="width: 300px"
            placeholder="请输入客户姓名/联系电话/企业名称"
            v-model="queryData.search"
          >
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
          </el-input>
        </div>
        <div style="margin: 0px 20px 20px 0px">
          <el-button size="mini" @click="reset">重置</el-button>
        </div>
        <div style="margin: 0px 20px 20px 0px">
          <el-button type="primary" size="mini" @click="getList"
            >查询</el-button
          >
        </div>
      </div>
      <el-divider></el-divider>
      <el-table
        :data="tableData"
        style="border: 1px solid #e9e9e9"
        max-height="450"
        height="450"
        @sort-change="tableOrder"
      >
        <el-table-column
          label="订单编号"
          prop="orderReturnId"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="客户姓名">
          <template slot-scope="scope">
            {{ scope.row.userName }}
            <el-tag type="info" v-if="scope.row.typeId == 0">非</el-tag>
            <el-tag v-if="scope.row.typeId == 11 || scope.row.typeId == 10"
              >供</el-tag
            >
            <el-tag
              type="danger"
              v-if="scope.row.typeId == 6 || scope.row.typeId == 7"
              >经</el-tag
            >
            <el-tag
              type="warning"
              v-if="scope.row.typeId == 3 || scope.row.typeId == 4"
              >采</el-tag
            >
          </template>
        </el-table-column>
        <el-table-column
          label="联系电话"
          prop="userPhone"
          min-width="100"
          :formatter="frommartterJine"
        ></el-table-column>
        <el-table-column
          label="企业名称"
          prop="companyName"
          min-width="100"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="商品种类"
          prop="productTypeCount"
          :formatter="frommartterJine"
        ></el-table-column>
        <el-table-column
          label="商品信息"
          prop="productDescription"
          width="200"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <font style="color: #0ba198">{{
              scope.row.productDescription
            }}</font>
          </template>
        </el-table-column>
        <el-table-column
          label="订单金额(元)"
          prop="orderTotalPrice"
          :formatter="frommartterJine"
        ></el-table-column>
        <el-table-column
          :label="shouAndFu1"
          prop="actualPayPrice"
          :formatter="frommartterJine"
        ></el-table-column>
        <el-table-column
          :label="shouAndFu2"
          prop="unpaidPrice"
          :formatter="frommartterJine"
          sortable="custom"
          width="130"
        ></el-table-column>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">
            <font :style="statusColor(scope.row.status)">●</font>
            {{ statusText(scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column
          label="订单时间"
          prop="timestamp"
          :formatter="frommartterJine"
          width="150"
          sortable="custom"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="check(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right">
        <!-- <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryData.pageNum"
          :page-sizes="[1, 5, 10, 20]"
          :page-size="queryData.page_size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="queryData.total"
        >
        </el-pagination> -->
      </div>
    </div>
  </TableContainer>
</template>

<script>
import moment from "moment";
import { getList } from "@/request/api/refundsGoods/index";
export default {
  name: "refundsGoods",
  data() {
    return {
      pageData: {},
      shouAndFu1: "", //表头文本
      shouAndFu2: "", //表头文本
      tableData: [],
      usertypeoptions: [],
      orderTypeOptions: [],
      queryData: {
        times: [],
        moduleAndOrder: [1, 1],
        module_type: 1,
        order_type: 1,
        user_type: 0,
        status: 0,
        sort_type: 0,
        search: "",
        pageNum: 1,
        page_size: 10,
        total: 0,
      },
    };
  },
  methods: {
    check(row) {
      // this.$router.push({path:'iSubmitRARDetails',query:{id:row.id}})
      if (row.module_type == 1) {
        //我发出的
        if (row.order_type == 1) {
          //退货退款
          this.$router.push({
            path: "iSubmitRARDetails",
            query: { id: row.id },
          });
        } else if (row.order_type == 2) {
          //仅退款
          this.$router.push({
            path: "iSubmitRARDetailsOR",
            query: { id: row.id },
          });
        } else {
          //退筐退款
          this.$router.push({
            path: "/frameManage/backintorefundOrder",
            query: { orderId: row.id },
          });
        }
      } else {
        //我收到的
        if (row.order_type == 1) {
          //退货退款
          this.$router.push({
            path: "iReceiveRARDetails",
            query: { id: row.id },
          });
        } else if (row.order_type == 2) {
          //仅退款
          this.$router.push({
            path: "iReceiveRARDetailsOR",
            query: { id: row.id },
          });
        } else {
          //退筐退款
          this.$router.push({
            path: "/frameManage/baskrefundOrder",
            query: { orderId: row.id },
          });
        }
      }
    },
    toPage() {
      //跳转申请退款
      this.$router.push({ path: "applicationForDrawback" });
    },
    tableOrder(val) {
      // console.log(val)
      if (val.prop == "timestamp") {
        if (val.order == "ascending") {
          this.queryData.sort_type = 1;
        } else {
          this.queryData.sort_type = 0;
        }
      } else {
        if (val.order == "ascending") {
          this.queryData.sort_type = 2;
        } else {
          this.queryData.sort_type = 3;
        }
      }
      this.getList();
    },
    handleSizeChange(val) {
      //分页
      this.queryData.page_size = val;
      this.getList();
    },
    handleCurrentChange(val) {
      //分页
      this.queryData.pageNum = val;
      this.getList();
    },
    statusText(val) {
      if (this.shouAndFu1 == "已收金额(元)") {
        //我发出的
        if (val == 1) {
          return "待对方付款";
        }
        if (val == 2) {
          return "待修改 ";
        }
        if (val == 3) {
          return "待收款";
        }
        if (val == 4) {
          return "未结清 ";
        }
        if (val == 5) {
          return "已结清 ";
        }
        if (val == 6) {
          return "未成交 ";
        }
      } else {
        if (val == 1) {
          return "待确认";
        }
        if (val == 2) {
          return "待修改 ";
        }
        if (val == 3) {
          return "待对方收款";
        }
        if (val == 4) {
          return "未结清 ";
        }
        if (val == 5) {
          return "已结清 ";
        }
        if (val == 6) {
          return "未成交 ";
        }
      }
    },
    statusColor(val) {
      if (val == 1) {
        return "color:#DF971A;";
      } else if (val == 2) {
        return "color:#DF971A;";
      } else if (val == 3) {
        return "color:#DF971A;";
      } else if (val == 4) {
        return "color:#DD4C4D;";
      } else if (val == 5) {
        return "color:#248B39;";
      } else if (val == 6) {
        return "color:##D0D0D2;";
      }
    },
    frommartterJine(row, column, cellValue, index) {
      // console.log(row,column)
      if (column.property == "orderTotalPrice") {
        return this.currencyFormat(row.orderTotalPrice);
      } else if (column.property == "actualPayPrice") {
        return this.currencyFormat(row.actualPayPrice);
      } else if (column.property == "unpaidPrice") {
        return this.currencyFormat(row.unpaidPrice);
      } else if (column.property == "productTypeCount") {
        return row.productTypeCount + "种";
      } else if (column.property == "userPhone") {
        if (row.userName == "散户") {
          return "--";
        } else {
          return row.userPhone;
        }
      } else {
        return this.toDate(row.timestamp);
      }
    },
    shouAndFu(val) {
      if (val[0] == 1) {
        this.shouAndFu1 = "已收金额(元)";
        this.shouAndFu2 = "剩余未收(元)";
      } else {
        this.shouAndFu1 = "已付金额(元)";
        this.shouAndFu2 = "剩余未付(元)";
      }
    },
    getList() {
      let res = this.queryData;
      if (res.times.length > 0) {
        res.start_time = res.times[0] / 1000;
        res.end_time = res.times[1] / 1000;
      }
      res.module_type = res.moduleAndOrder[0];
      res.order_type = res.moduleAndOrder[1];
      getList(res).then((resp) => {
        this.pageData = resp.data;
        this.tableData = resp.data.modelList;
        this.queryData.total = resp.data.modelListCount; //TOFIX:未返回该字段
        this.shouAndFu(res.moduleAndOrder);
      });
    },
    reset() {
      //重置
      this.queryData = {
        times: [],
        moduleAndOrder: [1, 1],
        module_type: 1,
        order_type: 1,
        user_type: 0,
        status: 0,
        search: "",
        pageNum: 1,
        page_size: 10,
        total: 0,
      };
      this.getList();
    },
    getOrderType() {
      this.orderStatusOptions = [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "待确认",
        },
        {
          value: 2,
          label: "待修改",
        },
        {
          value: 3,
          label: "待对方收款",
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
      (this.usertypeoptions = [
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
      ]),
        (this.orderTypeOptions = [
          {
            value: 1,
            label: "我发出的",
            children: [
              {
                value: 1,
                label: "退货退款单",
              },
              {
                value: 2,
                label: "退款单",
              },
              {
                value: 3,
                label: "退筐退款单",
              },
            ],
          },
          {
            value: 2,
            label: "我收到的",
            children: [
              {
                value: 1,
                label: "退货退款单",
              },
              {
                value: 2,
                label: "退款单",
              },
              {
                value: 3,
                label: "退筐退款单",
              },
            ],
          },
        ]);
    },
    toDate(val) {
      //时间戳格式化
      return moment(val * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
    currencyFormat(num) {
      //科学记数 保留两位小数
      let a = Number(num)
        .toFixed(2)
        .toString()
        .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      return a;
    },
    getStock(
      subunit,
      subunit2,
      subunit3,
      pieceunit,
      subunit2weight,
      subunit3weight,
      stock,
      basket,
      piececount
    ) {
      let first = stock + subunit;
      let next2 =
        subunit2 == "" ? "" : subunit2weight + subunit2 + "/" + subunit;
      let next3 = subunit3 == "" ? "" : subunit3weight + subunit3 + "*";
      let next4 = pieceunit == "" ? "" : "(" + piececount + pieceunit + ")";
      let last =
        basket == 0
          ? ""
          : "|" + basket + '<font style="color:#DF971A;">筐</font>';
      let kuohao1 = subunit2 == "" ? "" : "(";
      let kuohao2 = subunit2 == "" ? "" : ")";
      return first + kuohao1 + next3 + next2 + kuohao2 + next4 + last;
    },
    handlePagination(value) {
      this.queryData.pageNum = value.pageNum;
      this.queryData.pageSize = value.pageSize;
      this.getList();
    },
  },
  created() {
    this.getList();
    this.getOrderType();
  },
  mounted() {
    document.getElementsByClassName("el-range__close-icon")[0].className +=
      " el-icon-date"; //时间段选项后加图标
  },
};
</script>

<style lang="scss" scoped>
.el-tag {
  padding: 0px 1px !important;
}
.el-tag--medium {
  height: 17px !important;
  line-height: 17px !important;
}
.timestitle_change {
  padding-left: 80px !important;
  padding-right: 0px;
}
.queryitem_layout {
  position: absolute;
  left: 7px;
  top: 3px;
  font-size: 14px;
}
.queryitem_layout_2 {
  margin: 0px 20px 20px 0px;
  position: relative;
}
.pageQuery {
  position: relative;
  width: 85%;
  display: flex;
  flex-wrap: wrap;
  /deep/.el-input__inner {
    border-radius: 2px;
  }
  /deep/ .el-input--suffix .el-input__inner {
    padding-left: 70px;
    padding-right: 0px;
  }
}
.el-divider--horizontal {
  margin: 10px 0px;
}
.el-divider--vertical {
  height: 75px;
  margin: 20px 24px;
}
.pageTitle {
  font-family: PingFangSC-Regular, PingFang SC;
  min-width: 1400px;
}
.font_styl_1 {
  color: #0ba198;
  font-size: 20px;
}
.title_layout_1 {
  text-align: left;
  color: #010621;
  font-size: 16px;
}
.title_layout_2 {
  text-align: right;
  font-size: 20px;
  color: #010621;
}
</style>
