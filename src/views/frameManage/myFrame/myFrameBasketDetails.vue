<template>
  <PageNoScroll @hanleRefresh="hanleRefresh">
    <div class="currentBasketDetails-model">
      <div class="header-page">
        <div
          style="color: rgba(1, 6, 33, 0.9); font-size: 24px; font-weight: 700"
        >
          {{ basketData.basketName }}
        </div>

        <div class="flex_dom" style="margin: 10px 0px 15px">
          <div style="min-width: 250px">
            <div
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 20px;
                margin-bottom: 10px;
              "
            >
              颜色：{{ basketData.color }}
            </div>
            <div style="color: rgba(1, 6, 33, 0.9); font-size: 20px">
              剩余数量：{{ basketData.remainingCount | intervalFormat(true) }}个
            </div>
          </div>
          <div style="min-width: 250px; margin-left: 50px">
            <div
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 20px;
                margin-bottom: 10px;
              "
            >
              自购数量：{{ basketData.basketCount1 | intervalFormat(true) }}
            </div>
            <div style="color: rgba(1, 6, 33, 0.9); font-size: 20px">
              进入当前库存数量：{{
                basketData.basketStock | intervalFormat(true)
              }}个
            </div>
          </div>
          <div style="min-width: 250px; margin-left: 50px">
            <div
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 20px;
                margin-bottom: 10px;
              "
            >
              总价：{{ basketData.basketTotalPrice | intervalFormat(false) }}元
            </div>
            <div style="color: rgba(1, 6, 33, 0.9); font-size: 20px">
              进入历史库存数量：{{
                basketData.basketMyStock | intervalFormat(true)
              }}个
            </div>
          </div>
          <div style="min-width: 250px; margin-left: 50px">
            <div
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 20px;
                margin-bottom: 10px;
              "
            >
              &nbsp;
            </div>
            <div style="color: rgba(1, 6, 33, 0.9); font-size: 20px">
              剩余价值：{{ basketData.remainingMoney | intervalFormat(true) }}元
            </div>
          </div>
        </div>
      </div>
      <div class="currentBasketDetails-search">
        <div>
          <div class="search-form-border">
            <span class="search-form-title">订单类型</span>
            <el-select
              v-model="queryData.searchType"
              size="small"
              :style="{
                width: '110px',
              }"
            >
              <el-option
                v-for="(item, index) in typeViewOptin"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="search-form-border">
            <span class="search-form-title">出入库方式</span>
            <el-select
              v-model="queryData.status"
              size="small"
              :style="{
                width: '110px',
              }"
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
              <span v-if="item.prop == 'actionCode'">
                {{
                  scope.row[item.prop]
                    | basketActionCode(scope.row[item.prop])[0].typeName
                }}
              </span>

              <span
                v-else-if="item.prop == 'cusName' || item.prop == 'phoneNumber'"
              >
                {{ scope.row[item.prop] || "-" }}
              </span>
              <span v-else-if="item.prop == 'basketTotalPrice'">
                {{ scope.row[item.prop] | intervalFormat(false) }}
              </span>

              <span v-else-if="item.prop == 'floatNumber'">
                <span
                  :style="{
                    color:
                      Number(scope.row[item.prop]) >= 0
                        ? 'rgba(11, 161, 152, 0.9)'
                        : 'rgba(232, 84, 30, 0.9)',
                  }"
                >
                  {{ scope.row[item.prop] || "-" }}</span
                >
              </span>
              <span v-else-if="item.prop == 'basketType'">
                {{ scope.row[item.prop] == 0 ? "进当前库存" : "进历史库存" }}
              </span>

              <span v-else-if="item.prop == 'basketExplain'">
                <div
                  v-html="$options.filters.basketActionCodeType(scope.row)"
                ></div>
              </span>
              <span v-else-if="item.prop == 'status'">
                <div class="flex_dom flex_item_mid">
                  <span
                    :style="{
                      width: '8px',
                      height: '8px',
                      background: setColorName(scope.row.status).color,
                      display: 'inline-block',
                      'border-radius': '50%',
                      'margin-right': '5px',
                    }"
                  ></span>

                  <span> {{ setColorName(scope.row[item.prop]).name }}</span>
                </div>
              </span>
              <span v-else-if="item.prop == 'timestamp'">
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
                    orderId: scope.row.realationModelId,
                    actionCode: scope.row.actionCode,
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
import { buyMySelfBasketInandOutDetails } from "@/request/api/frameManage/index";
import { parseTime } from "@/utils/common";

import elementResizeDetectorMaker from "element-resize-detector";

export default {
  name: "currentBasketDetails",
  data() {
    return {
      parseTime,
      queryData: {
        searchType: 0, //  0:全部, 1:从厂商购入, 2:报废出库, 3:报失出库
        status: 1, // 订单状态筛选 0 全部 1 已完成 4 未结清 5 已结清
        confirmTimestamp: [], // 成交时间
      },
      pagination: {
        page: 1, // 页码
        limit: 50, // 分页大小
        total: 0,
      },
      typeViewOptin: [
        {
          value: 0,
          label: "全部",
        },
        {
          value: 1,
          label: "筐子自购单",
        },
        {
          value: 2,
          label: "筐子报废单",
        },
        {
          value: 3,
          label: "筐子报失单",
        },
      ],
      statusOptions: [
        {
          value: 2,
          label: "报废出库",
        },
        {
          value: 3,
          label: "报失出库",
        },
        {
          value: 1,
          label: "自购入库",
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
          prop: "actionCode",
          label: "订单类型",
          align: "left",
        },
        {
          minWidth: 200,
          prop: "basketExplain",
          label: "订单说明",
          align: "left",
        },
        {
          width: 150,
          prop: "cusName",
          label: "客户",
          align: "left",
        },
        {
          width: 150,
          prop: "phoneNumber",
          label: "联系电话",
          align: "left",
        },
        {
          width: 150,
          prop: "basketTotalPrice",
          label: "金额（元）",
          align: "left",
        },
        {
          width: 150,
          prop: "floatNumber",
          label: "筐子数量（个）",
          align: "left",
        },
        {
          width: 150,
          prop: "basketType",
          label: "进入库存",
          align: "left",
        },
        {
          width: 100,
          prop: "status",
          label: "状态",
          align: "left",
        },
        {
          width: 180,
          prop: "timestamp",
          label: "成交时间",
          align: "left",
        },
      ],
      basketData: "",
      tableDataList: [],
      SetHeight: 0,
    };
  },
  watch: {},
  computed: {},
  methods: {
    initData() {
      let { data: data } = this.$route.query;
      //   判断url是否为空
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
            this.$router.push({ path: "/frameManage/myFrame" });
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
        searchType: this.queryData.searchType, // 订单类型筛选 见下方  不筛选传 "0" 多选逗号隔开
        status: this.queryData.status, // 单据状态：0 全部 1 未结清 2 已结清 3 待对方收款 4 代收款 5 已完成 多选逗号隔开
        pageindex: this.pagination.page, // 页码
        pagesize: this.pagination.limit, // 分页大小
      };

      if (this.queryData.confirmTimestamp.length > 0) {
        param.startConfirmTimestamp = this.queryData.confirmTimestamp[0] / 1000; // 成交开始时间 不筛选 不传该字段
        param.endConfirmTimestamp = this.queryData.confirmTimestamp[1] / 1000; // 成交结束时间 不筛选 不传该字段
      }
      buyMySelfBasketInandOutDetails(param).then((res) => {
        if (res.status == 200) {
          this.tableDataList = res.data[0].modelList;
          this.pagination.total = res.data[0].sumCount; //数据总条数
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
    }, // 跳转页面
    handleJumpDetail1: function (path, record) {
      // 1:自购入库, 2:报废出库, 3:报失出库
      // 1 筐子自购单 4 筐子售出单 5 筐子购入单 6 筐子报废单 7 筐子报失单 8 筐子报溢单 10 筐子腾空单 25 自有筐子单 13 退筐退款单 14 退入退款单

      let typeView = null;
      if (record.actionCode == 1) {
        path = "purchasemyOrder";
        typeView = 1;
      } else if (record.actionCode == 2) {
        path = "scrapOrder";
        typeView = 6;
      } else if (record.actionCode == 3) {
        path = "reportlossOrder";
        typeView = 7;
      }

      this.$router.push({
        path: path,
        query: {
          basketInOutTypeView: typeView,
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
    setColorName(val) {
      if (val == 1) {
        return { color: "#0BA198", name: "已完成" };
      } else if (val == 4) {
        return { color: "#0091FF", name: "未结清" };
      } else if (val == 5) {
        return { color: "#0BA198", name: "已结清" };
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
    // display: flex;
    // align-items: center;
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
