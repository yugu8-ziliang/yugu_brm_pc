<template>
  <!-- 筐子进出明细 -->
  <Container>
    <div class="currentInventory-model">
      <div class="currentInventory-search">
        <div>
          <div class="search-form-border">
            <span class="search-form-title">订单类型</span>
            <el-select
              v-model="queryData.typeViewArray"
              size="small"
              :style="{
                'min-width': '150px',
                width: queryData.typeViewArray.length * 39.5 + 'px',
              }"
              clearable
              multiple
            >
              <el-option
                v-for="(item, index) in typeOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
          <div class="search-form-border">
            <span class="search-form-title">订单状态</span>
            <el-select
              v-model="queryData.statusArray"
              size="small"
              :style="{
                'min-width': '150px',
                width: queryData.statusArray.length * 39.5 + 'px',
              }"
              clearable
              multiple
            >
              <el-option
                v-for="(item, index) in statusOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
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
            <el-input
              v-model="queryData.search"
              size="small"
              placeholder="请输入客户名称/手机号"
            >
              <template slot="prefix">
                <div class="label-title">客户名称</div>
              </template>
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
      <div class="header-page">
        <div class="header-left-content">
          <div class="header-lf-title">
            <div class="header-lf-word">筐子入库数量(个)</div>
            <div class="header-lf-num">{{ numberSum.Intobasketcount }}</div>
          </div>
          <div class="lineH"></div>
          <div class="header-lf-title">
            <div class="header-lf-word">筐子入库金额(元)</div>
            <div class="header-lf-num">
              {{ moneyFormatTwo(numberSum.Intobasketprice) }}
            </div>
          </div>
          <div class="lineH"></div>
          <div class="header-lf-title">
            <div class="header-lf-word">筐子出库数量(个)</div>
            <div class="header-lf-num">{{ numberSum.Outbasketcount }}</div>
          </div>
          <div class="lineH"></div>
          <div class="header-lf-title">
            <div class="header-lf-word">筐子出库金额(元)</div>
            <div class="header-lf-num">
              {{ moneyFormatTwo(numberSum.Outbasketprice) }}
            </div>
          </div>
        </div>
      </div>

      <div class="currentInventory-table">
        <u-table
          ref="plTable"
          class="utable"
          :height="
            queryData.typeViewArray.length > 2
              ? $store.getters.screenHeight - 505 + 'px'
              : $store.getters.screenHeight - 420 + 'px'
          "
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
            :sortable="item.sortable"
          >
            <template slot-scope="scope">
              <span v-if="scope.row[item.prop] == ''">--</span>
              <span
                v-else-if="
                  item.prop == 'timestamp' || item.prop == 'confirmTimestamp'
                "
                >{{ scope.row[item.prop] | parseTime }}</span
              >
              <span v-else-if="item.prop == 'basketTotalPrice'">
                {{ moneyFormatTwo(scope.row[item.prop]) }}
              </span>
              <span v-else-if="item.prop == 'type'">
                {{
                  scope.row[item.prop] | basketOrderType(scope.row[item.prop])
                }}
              </span>
              <!-- 出入库方式 -->
              <span
                v-else-if="item.prop == 'countedit'"
                :style="fontColor(scope.row.floatType, scope.row.type)"
              >
                {{ outAndPut(scope.row.type) }}
              </span>

              <span v-else-if="item.prop == 'statusName'">
                <span v-if="scope.row[item.prop] == '待对方收款'">
                  <div
                    class="tag"
                    :style="{ background: tagColor(scope.row.status) }"
                  ></div>
                  <el-tooltip placement="bottom-start">
                    <div slot="content" style="padding: 8px 30px 8px 5px">
                      <div>
                        <span style="margin-right: 12px">待收金额</span>
                        <span>{{ tableData.waitGetPrice || 0 }}元</span>
                      </div>
                    </div>
                    <el-button
                      style="
                        border: none;
                        background-color: #f5f5f5;
                        padding: 0px;
                        text-align: left;
                      "
                    >
                      <span class="card-title">{{ scope.row[item.prop] }}</span>
                    </el-button>
                  </el-tooltip>
                </span>
                <span v-else>
                  <div
                    class="tag"
                    :style="{ background: tagColor(scope.row.status) }"
                  ></div>
                  {{ scope.row[item.prop] }}
                </span>
              </span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </u-table-column>
          <u-table-column label="操作" :width="90" align="left">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="
                  handleJumpDetail('path', {
                    orderId: scope.row.orderId,
                    type: scope.row.type,
                  })
                "
                >详情
              </el-button>
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
import { basketenteredDetail } from "@/request/api/frameManage/basketInOut";
import { isbasketInOut } from "@/utils/basketInOut.js";

export default {
  name: "basketInOut",
  data() {
    return {
      typeOptions: [],
      statusOptions: [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "未结清",
        },
        {
          value: 2,
          label: "已结清",
        },
        {
          value: 3,
          label: "待对方收款",
        },
        {
          value: 4,
          label: "待收款",
        },
        {
          value: 5,
          label: "已完成",
        },
      ],
      queryData: {
        typeViewArray: [],
        statusArray: [], //单据状态：0 全部 1 未结清 2 已结清 3 待对方收款 4 代收款 5 已完成 多选逗号隔开
        search: "",
        timestampList: [],
        confirmTimestampList: [],
      },
      pagination: {
        page: 1, // 页码
        limit: 10, // 分页大小
        total: 0,
      },
      columns: [
        {
          prop: "orderNo",
          label: "编号",
          minWidth: 120,
        },
        {
          prop: "type",
          label: "订单类型",
          minWidth: 160,
        },
        {
          prop: "countedit",
          label: "出入库方式",
          minWidth: 180,
        },
        {
          minWidth: 140,
          prop: "fromUserName",
          label: "客户姓名",
        },
        {
          minWidth: 100,
          prop: "fromUserPhone",
          label: "联系电话",
        },
        {
          minWidth: 90,
          prop: "basketTotalPrice",
          label: "订单金额(元)",
        },
        {
          minWidth: 90,
          prop: "basketCount",
          label: "筐子数量(个)",
        },
        {
          minWidth: 80,
          prop: "statusName",
          label: "状态",
        },
        {
          minWidth: 150,
          prop: "timestamp",
          label: "创建时间",
        },
        {
          minWidth: 150,
          prop: "confirmTimestamp",
          label: "成交时间",
        },
      ],
      numberSum: {
        Intobasketcount: 0,
        Intobasketprice: 0,
        Outbasketcount: 0,
        Outbasketprice: 0,
      },
      tableData: [],
      urljing: require("@/assets/image/imgs/jing-icon.png"),
      urlcai: require("@/assets/image/imgs/cai-icon.png"),
      urlgong: require("@/assets/image/imgs/gong-icon.png"),
      urlfei: require("@/assets/image/imgs/fei-icon.png"),
    };
  },
  computed: {},
  created() {
    let userType = JSON.parse(localStorage.getItem("userInfo"))?.usertype || "";
    let purchaseType =
      JSON.parse(localStorage.getItem("userInfo"))?.purchaseType || "";
    this.typeOptions = isbasketInOut(userType, purchaseType) || [];
    this.getList(1);
  },
  methods: {
    fontColor(val, val2) {
      if (val2 == 24 && val2 == 29 && val2 == 10) {
        return "color:rgba(1, 6, 33, 0.7);";
      } else {
        if (val == 1) {
          return "color:#0BA198;";
        } else if (val == 2) {
          return "color:red;";
        }
      }
    },
    outAndPut(val) {
      let type = val;
      // 商品采购单#4--载货购入   商品销售单#6--载货售出   筐子购入单#3--空筐购入   筐子售出单#5--空筐售出   发起退货退款单(出库)#7--退货退筐出库   发起退货退款单(售出)#28--载货售出
      //处理退货退款单(入库)#11--退货退筐入库   处理退货退款单(购入)#27--载货购入  发起退筐退款单#14--退筐出库  处理退筐退款单#13--退筐入库  自家已有单#18--自家已有  筐子自购单(进当前库存)#2--自购购入
      //筐子报溢单#9--报溢入库    商品报溢单#16--报溢入库  筐子报废单(客户筐子，当前库存)#0--报废出库  筐子报失单(客户筐子，当前库存)#1--报失出库  装筐单#24--装筐   商品腾空单#29--腾空
      //筐子腾空单#10--腾空   销售记账单#23--销售记账售出  配送单#22--配送出库  配送退货单#21--配送退货退筐入库  配送退筐单#20--配送退筐入库
      switch (type) {
        case 4:
          return "载货购入";
        case 6:
          return "载货售出";
        case 3:
          return "空筐购入";
        case 5:
          return "空筐售出";
        case 7:
          return "退货退筐出库";
        case 28:
          return "载货售出";
        case 11:
          return "退货退筐入库";
        case 27:
          return "载货购入";
        case 14:
          return "退筐出库";
        case 13:
          return "退筐入库";
        case 18:
          return "自家已有";
        case 2:
          return "自购购入";
        case 9:
          return "报溢入库";
        case 16:
          return "报溢入库";
        case 0:
          return "报废出库";
        case 1:
          return "报失出库";
        case 24:
          return "装筐";
        case 29:
          return "腾空";
        case 10:
          return "腾空";
        case 23:
          return "销售记账售出";
        case 22:
          return "配送出库";
        case 21:
          return "配送退货退筐入库";
        case 20:
          return "配送退筐入库";
      }
    },
    getList(arg) {
      if (arg === 1) {
        this.pagination.page = 1;
      }
      let param = {
        typeView: this.queryData.typeViewArray.toString() || "0",
        status: this.queryData.statusArray.toString() || "0",
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
      basketenteredDetail(param).then((res) => {
        if (res.status == 200) {
          this.tableData = res.data[0].modellist;
          this.numberSum = {
            Intobasketcount: res.data[0].Intobasketcount,
            Intobasketprice: res.data[0].Intobasketprice,
            Outbasketcount: res.data[0].Outbasketcount,
            Outbasketprice: res.data[0].Outbasketprice,
          };
          this.pagination.total = res.data[0].modellistcount;
        }
      });
    },
    tagColor(val) {
      if (val == 3) {
        return "#E8541E";
      } else if (val == 4) {
        return "#0091FF";
      } else if (val == 5) {
        return "#0BA198";
      } else if (val == 6) {
        return "#0BA198";
      }
    },
    moneyFormatTwo(moneyStr) {
      // 先将数值取两位小数
      let money = Number(moneyStr)
        .toFixed(2)
        .toString()
        .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      return money;
    },
    // 跳转页面
    handleJumpDetail: function (path, record) {
      //   this.$router.push(
      //     `orderDetails?basketInOutTypeView=${record.type}&orderId=${record.orderId}`
      //   );
      // 2 筐子自购单 5 筐子售出单 3 筐子购入单 0 筐子报废单 1 筐子报失单 9筐子报溢单 10 筐子腾空单 18 自有筐子单 13 处理的退筐退款单 14 发起的退筐退款单
      if (record.type == 2) {
        path = "purchasemyOrder";
      } else if (record.type == 5) {
        path = "saleOrder";
      } else if (record.type == 3) {
        path = "purchaseOrder";
      } else if (record.type == 0) {
        path = "scrapOrder";
      } else if (record.type == 1) {
        path = "reportlossOrder";
      } else if (record.type == 9) {
        path = "overflowOrder";
      } else if (record.type == 10) {
        path = "emptyOrder";
      } else if (record.type == 13) {
        path = "baskrefundOrder";
      } else if (record.type == 14) {
        path = "backintorefundOrder";
      } else if (record.type == 18) {
        path = "ownbasketOrder";
      }
      this.$router.push({
        path: path,
        query: {
          basketInOutTypeView: record.type,
          orderId: record.orderId,
        },
      });
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
    // 刷新
    hanleRefresh() {
      this.getList(1);
    },
  },
};
</script>

<style lang="scss" scoped>
.currentInventory-model {
  .header-page {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    margin-top: 15px;

    .header-left-content {
      display: flex;
      align-items: center;

      .header-lf-title {
        // margin-right: 40px;
        .header-lf-word {
          font-size: 16px;
          color: rgba(1, 6, 33, 0.9);
          margin-bottom: 5px;
        }

        .header-lf-num {
          font-size: 24px;
          color: rgba(1, 6, 33, 0.9);
        }
      }
    }

    .lineH {
      width: 1px;
      height: 35px;
      border-right: 1px solid rgba(1, 6, 33, 0.35);
      overflow: hidden;
      box-shadow: none;
      margin: 0px 25px 0px 60px;
    }
  }

  .currentInventory-search {
    // padding: 0px 0px 20px 0px;
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

      .label-title {
        padding: 0 6px;
        font-size: 14px;
        height: 95%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(1, 6, 33, 0.35);
      }

      ::v-deep .el-input--prefix .el-input__inner {
        padding-left: 72px;
      }
    }
  }

  .currentInventory-table {
    .utable {
      text-align: center;
      border: 1px solid #e9e9e9;

      .tag {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 4px;
      }

      .img-icon {
        height: 14px;
        margin-right: 2px;
      }
    }

    .paging {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-top: 5px;
      padding-bottom: 5px;
    }
  }
}
</style>