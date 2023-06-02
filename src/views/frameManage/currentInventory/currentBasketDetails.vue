<template>
  <PageNoScroll @hanleRefresh="hanleRefresh">
    <div class="currentBasketDetails-model">
      <div class="header-page">
        <div
          style="color: rgba(1, 6, 33, 0.9); font-size: 24px; font-weight: 700"
        >
          {{ basketData.basketName }}
        </div>
        <div
          style="color: rgba(1, 6, 33, 0.9); font-size: 20px; margin-left: 40px"
        >
          颜色：{{ basketData.color }}
        </div>
        <div
          style="color: rgba(1, 6, 33, 0.9); font-size: 20px; margin-left: 40px"
        >
          库存数量：{{ basketData.count1 | intervalFormat(true) }}个
        </div>
        <div
          style="color: rgba(1, 6, 33, 0.9); font-size: 20px; margin-left: 40px"
        >
          空置数量：{{ basketData.vacantCount | intervalFormat(true) }}个
        </div>
        <div
          style="color: rgba(1, 6, 33, 0.9); font-size: 20px; margin-left: 40px"
        >
          载货数量：{{ basketData.cargoCount | intervalFormat(true) }}个
        </div>
      </div>
      <div class="currentBasketDetails-search">
        <div>
          <div class="search-form-border">
            <span class="search-form-title">订单类型</span>
            <el-select
              v-model="queryData.typeView"
              size="small"
              :style="{
                'min-width': '150px',
                width: queryData.typeView.length * 72 + 'px',
              }"
              clearable
              multiple
            >
              <el-option
                v-for="(item, index) in typeViewOptin"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="search-form-border">
            <span class="search-form-title">订单状态</span>
            <el-select
              v-model="queryData.status"
              size="small"
              :style="{
                'min-width': '150px',
                width: queryData.status.length * 72 + 'px',
              }"
              clearable
              multiple
            >
              <el-option
                v-for="(item, index) in statusOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="search-form-border">
            <span class="search-form-title">创建时间</span>
            <el-date-picker
              v-model="queryData.time"
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
          <div class="search-form-border">
            <span class="search-form-title">成交时间</span>
            <el-date-picker
              v-model="queryData.confirmTimestamp"
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

        <div class="search-form-border">
          <span class="search-form-title">客户搜索</span>
          <el-input
            style="width: 230px"
            size="small"
            v-model="queryData.search"
            clearable
            placeholder="请输入客户名称/手机号"
          ></el-input>
          <span
            style="
              display: inline-block;
              border-left: 1px solid #d0d0d2;
              height: 30px;
              width: 1px;
              vertical-align: middle;
            "
          ></span>
          <i
            class="el-icon-search"
            style="padding: 0px 2px 0px; vertical-align: middle"
          ></i>
        </div>

        <el-button
          size="small"
          style="
            color: var(--color-primary);
            border: 1px solid var(--color-primary);
          "
          @click="handleReset"
          >重置</el-button
        >
        <el-button size="small" type="primary" @click="handleSearch"
          >查询</el-button
        >
      </div>

      <div class="currentBasketDetails-table" ref="currentBasketDetailsTable">
        <u-table
          ref="plTable"
          class="utable"
          :height="
            parseInt($store.getters.screenHeight - SetHeight - 70) + 'px'
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
              <span v-if="item.prop == 'type'">
                {{ basketCurrentTypefil(scope.row[item.prop]) }}
              </span>
              <span v-else-if="item.prop == 'basketTotalPrice'">
                {{ scope.row[item.prop] | intervalFormat(false) }}
              </span>
              <span
                v-else-if="
                  item.prop == 'fromUserName' || item.prop == 'fromUserPhone'
                "
              >
                {{ scope.row[item.prop] || "-" }}
              </span>
              <span
                v-else-if="item.prop == 'basketExplain'"
                :style="fontColor(scope.row.floatType, scope.row.type)"
              >
                {{ outAndPut(scope.row.type) }}
              </span>
              <span v-else-if="item.prop == 'statusName'">
                <div class="flex_dom flex_item_mid">
                  <span
                    :style="{
                      width: '8px',
                      height: '8px',
                      background: setColor(scope.row.status),
                      display: 'inline-block',
                      'border-radius': '50%',
                      'margin-right': '5px',
                    }"
                  ></span>

                  <span> {{ scope.row[item.prop] }}</span>
                </div>
              </span>
              <span
                v-else-if="
                  item.prop == 'timestamp' || item.prop == 'confirmTimestamp'
                "
              >
                {{ parseTime(scope.row[item.prop]) || "-" }}
              </span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </u-table-column>
          <u-table-column label="操作" :width="100" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="
                  handleJumpDetail1('path', {
                    orderId: scope.row.orderId,
                    typeView: scope.row.typeView,
                  })
                "
                >详情</el-button
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
  </PageNoScroll>
</template>

<script>
import { Base64 } from "js-base64";
import { currentInventoryDetails } from "@/request/api/frameManage/index";
import { parseTime } from "@/utils/common";
import { isCurrentBasketTypeFilter } from "@/utils/common";

import elementResizeDetectorMaker from "element-resize-detector";

export default {
  name: "currentBasketDetails",
  data() {
    return {
      parseTime,
      queryData: {
        typeView: [], // 订单类型
        status: [], // 单据状态
        time: [], //创建时间
        confirmTimestamp: [], // 成交时间
        search: "", // 搜索
      },
      pagination: {
        page: 1, // 页码
        limit: 50, // 分页大小
        total: 0,
      },
      typeViewOptin: isCurrentBasketTypeFilter(this.$store.getters.userInfo),
      statusOptions: [
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
          label: "代收款",
        },
        {
          value: 5,
          label: "已完成",
        },
      ],
      columns: [
        {
          width: 160,
          prop: "orderNo",
          label: "编号",
          align: "left",
        },
        {
          width: 180,
          prop: "type",
          label: "订单类型",
          align: "left",
        },
        {
          minWidth: 200,
          prop: "basketExplain",
          label: "出入库方式",
          align: "left",
        },
        {
          width: 150,
          prop: "fromUserName",
          label: "客户姓名",
          align: "left",
        },
        {
          width: 150,
          prop: "fromUserPhone",
          label: "联系电话",
          align: "left",
        },
        {
          width: 150,
          prop: "basketTotalPrice",
          label: "筐子金额（元）",
          align: "left",
        },
        {
          width: 150,
          prop: "basketCount",
          label: "筐子数量（个）",
          align: "left",
        },
        {
          width: 100,
          prop: "statusName",
          label: "状态",
          align: "left",
        },
        {
          width: 180,
          prop: "timestamp",
          label: "创建时间",
          align: "left",
        },
        {
          width: 180,
          prop: "confirmTimestamp",
          label: "成交时间",
          align: "left",
        },
      ],
      basketData: "",
      tableDataList: [],
      SetHeight: 0,
    };
  },
  watch: {
    "queryData.typeView": {
      handler(val, oval) {
        this.handlerSetHeight("currentBasketDetailsTable");
      },
      deep: true,
    },
    "queryData.status": {
      handler(val, oval) {
        this.handlerSetHeight("currentBasketDetailsTable");
      },
      deep: true,
    },
  },
  computed: {},
  methods: {
    basketCurrentTypefil(val) {
      if (this.$options.filters["basketCurrentType"](val)[0]) {
        return this.$options.filters["basketCurrentType"](val)[0].typeName;
      } else {
        return "";
      }
    },
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
    initData() {
      let { data: data } = this.$route.query;
      // 判断url是否为空
      if (data) {
        // 解析数据
        try {
          let param = JSON.parse(Base64.decode(data));
          if (!param.basketId) {
            this.handleRouter();
            return;
          }
          this.basketData = param;
          this.getList(1);
        } catch (error) {
          this.handleRouter();
        }
        return;
      }
      this.handleRouter();
    },
    // 跳转
    handleRouter() {
      setTimeout(() => {
        this.$store
          .dispatch("tagsView/delView", {
            path: this.$route.path,
          })
          .then(({ visitedViews }) => {
            this.$router.push({ path: "/frameManage/currentInventory" });
          });
      }, 0);
    },
    getList(arg) {
      if (arg === 1) {
        this.pagination.page = 1;
      }
      let param = {
        basketId: this.basketData.basketId, // 筐子主键id   必填
        basketColor: this.basketData.color, // 筐子颜色 必填
        typeView: this.queryData.typeView.toString() || "0", // 订单类型筛选 见下方  不筛选传 "0" 多选逗号隔开
        status: this.queryData.status.toString() || "0", // 单据状态：0 全部 1 未结清 2 已结清 3 待对方收款 4 代收款 5 已完成 多选逗号隔开
        search: this.queryData.search, // 搜索
        pageindex: this.pagination.page, // 页码
        pagesize: this.pagination.limit, // 分页大小
      };

      if (this.queryData.confirmTimestamp.length > 0) {
        param.startConfirmTimestamp = this.queryData.confirmTimestamp[0] / 1000; // 成交开始时间 不筛选 不传该字段
        param.endConfirmTimestamp = this.queryData.confirmTimestamp[1] / 1000; // 成交结束时间 不筛选 不传该字段
      }
      if (this.queryData.time.length > 0) {
        param.startTime = this.queryData.time[0] / 1000; // 创建开始时间 不筛选 不传该字段
        param.endTime = this.queryData.time[1] / 1000; // 创建结束时间 不筛选 不传该字段
      }

      currentInventoryDetails(param).then((res) => {
        if (res.status == 200) {
          this.tableDataList = res.data[0].modellist;
          this.pagination.total = res.data[0].modellistcount; //数据总条数
        }
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
    // 跳转页面
    handleJumpDetail: function (form, record) {
      this.$router.push({
        path: form,
        // query: { data: Base64.encode(JSON.stringify(record)) }, //加密
      });
      // Base64.decode(this.pwd);//解密
    },
    // 跳转页面
    handleJumpDetail1: function (path, record) {
      //   console.log(record.typeView);
      //   this.$router.push(
      //     `orderDetails?basketInOutTypeView=${record.typeView}&orderId=${record.orderId}`
      //   );
      // 1 筐子自购单 4 筐子售出单 5 筐子购入单 6 筐子报废单 7 筐子报失单 8 筐子报溢单 10 筐子腾空单 25 自有筐子单 13 退筐退款单 14 退入退款单
      if (record.typeView == 1) {
        path = "purchasemyOrder";
      } else if (record.typeView == 4) {
        path = "saleOrder";
      } else if (record.typeView == 5) {
        path = "purchaseOrder";
      } else if (record.typeView == 6) {
        path = "scrapOrder";
      } else if (record.typeView == 7) {
        path = "reportlossOrder";
      } else if (record.typeView == 8) {
        path = "overflowOrder";
      } else if (record.typeView == 10) {
        path = "emptyOrder";
      } else if (record.typeView == 13) {
        path = "baskrefundOrder";
      } else if (record.typeView == 14) {
        path = "backintorefundOrder";
      } else if (record.typeView == 25) {
        path = "ownbasketOrder";
      }
      this.$router.push({
        path: path,
        query: {
          basketInOutTypeView: record.typeView,
          orderId: record.orderId,
        },
      });
    },
    handlerSetHeight(val) {
      const erdm = elementResizeDetectorMaker();
      erdm.listenTo(this.$refs[val], (element) => {
        setTimeout(() => {
          this.SetHeight = element.getBoundingClientRect().top;
        }, 20);
      });
    },
    setColor(val) {
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
  },
  created() {
    this.initData(1); // 滚动条的获取
  },
  mounted() {
    this.handlerSetHeight("currentBasketDetailsTable");
  },
};
</script>

<style lang="scss" scoped>
.currentBasketDetails-model {
  .header-page {
    display: flex;
    align-items: center;
    margin-bottom: 15px;
  }

  .currentBasketDetails-search {
    padding: 15px 0px 0px 0px;
    border-top: 1px solid #e9e9e9;

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
  }
  .currentBasketDetails-table {
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

<style lang="scss">
</style>
