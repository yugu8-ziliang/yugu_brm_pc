<template>
  <!-- 资金收支明细 -->
  <Container @refresh="hanleRefresh">
    <div class="fundRevenueExpenditure-model">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="实际收支" name="1">
          <div class="header-page">
            <div class="header-left">
              <div class="header-left-content">
                <div class="header-lf-title">
                  <div class="header-lf-word">总收入(元)</div>
                  <div class="header-lf-num flex_dom flex_item_mid">
                    {{ tableData.allIncome | intervalFormat(false) }}
                    <el-button
                      type="text"
                      icon="el-icon-arrow-right"
                      style="padding: 5px 10px; font-size: 18px"
                      @click="handleJumpDetail('fundingStatistics')"
                    ></el-button>
                  </div>
                </div>
                <!-- <div class="lineH"></div> -->
                <div class="header-lf-title">
                  <div class="header-lf-word">总支出(元)</div>
                  <div class="header-lf-num flex_dom flex_item_mid">
                    {{ tableData.allDisburse | intervalFormat(false)
                    }}<el-button
                      type="text"
                      icon="el-icon-arrow-right"
                      style="padding: 5px 10px; font-size: 18px"
                      @click="handleJumpDetail('fundingStatistics')"
                    ></el-button>
                  </div>
                </div>
                <!-- <div class="lineH"></div> -->
                <div class="header-lf-title">
                  <div class="header-lf-word">资金收支余额(元)</div>
                  <div class="header-lf-num">
                    {{ tableData.remainingSum | intervalFormat(false) }}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="fundRevenueExpenditure-search">
            <div>
              <el-cascader
                ref="cascaderNodes"
                :style="{
                  'margin-right': '10px',
                  'margin-bottom': '10px',
                  'min-width': '250px',
                  width: queryData.typeArray.length * 120 + 'px',
                }"
                :show-all-levels="false"
                placeholder="收支类型"
                v-model="queryData.typeArray"
                :options="typeOptions"
                @change="handleChange"
                :props="{ multiple: true }"
                size="small"
                clearable
              ></el-cascader>

              <el-date-picker
                style="margin-right: 10px; width: 230px"
                v-model="queryData.Times"
                size="small"
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                value-format="timestamp"
                prefix-icon
              >
              </el-date-picker>

              <el-input
                style="width: 270px"
                placeholder="请输入客户姓名/联系电话/企业名称"
                prefix-icon="el-icon-search"
                v-model="queryData.custmorFilter"
                size="small"
              >
              </el-input>

              <el-button
                style="
                  border: #0ba198 solid 1px;
                  color: #0ba198;
                  margin-left: 10px;
                "
                size="small"
                @click="handleReset"
                >重置</el-button
              >
              <el-button type="primary" size="small" @click="handleSearch"
                >查询</el-button
              >
            </div>
          </div>

          <div class="fundRevenueExpenditure-amount">
            <i class="el-icon-warning" style="color: rgba(26, 127, 217, 1)"></i>
            <span
              style="
                color: rgba(0, 0, 0, 0.65);
                font-size: 14px;
                margin-right: 32px;
                margin-left: 10px;
              "
              >收入：<span style="color: rgba(1, 6, 33, 0.9); font-size: 20px">
                {{ tableData.income | intervalFormat(false) }}</span
              ></span
            >

            <span style="color: rgba(0, 0, 0, 0.65); font-size: 14px"
              >支出：<span style="color: rgba(1, 6, 33, 0.9); font-size: 20px">
                {{ tableData.disburse | intervalFormat(false) }}</span
              ></span
            >
          </div>

          <div
            class="fundRevenueExpenditure-table"
            ref="currentBasketDetailsTable"
          >
            <u-table
              ref="plTable"
              class="utable"
              :height="$store.getters.screenHeight - 500 + 'px'"
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
                  <span v-if="item.prop == 'userName'">
                    {{ scope.row[item.prop] }}
                    <span
                      v-if="scope.row.merchantType != 4"
                      v-html="handleMerchantType(scope.row.merchantType)"
                    ></span>
                  </span>
                  <span v-else-if="item.prop == 'financialType1'">
                    <span
                      v-if="scope.row.financialType == 1"
                      style="color: rgba(11, 161, 152, 1)"
                    >
                      {{ scope.row.payPrice | intervalFormat(true) }}</span
                    >
                    <span v-else style="color: rgba(11, 161, 152, 1)"> --</span>
                  </span>
                  <span v-else-if="item.prop == 'financialType2'">
                    <span
                      v-if="scope.row.financialType == 2"
                      style="color: rgba(221, 76, 77, 1)"
                    >
                      {{ scope.row.payPrice | intervalFormat(true) }}</span
                    >
                    <span v-else style="color: rgba(221, 76, 77, 1)"> --</span>
                  </span>
                  <span v-else-if="item.prop == 'financialType'">
                    <span v-if="scope.row[item.prop] == 1">已付款</span>
                    <span v-else-if="scope.row[item.prop] == 2">已收款</span>
                  </span>
                  <span v-else-if="item.prop == 'timestamp'">
                    {{ scope.row[item.prop] | parseTime() }}
                  </span>
                  <span v-else>{{ scope.row[item.prop] }}</span>
                </template>
              </u-table-column>
              <u-table-column label="操作" :width="100" align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click="handleJumpDetail1(scope.row)"
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
            </div></div
        ></el-tab-pane>
        <el-tab-pane label="待对方收款" name="2">
          <div class="fundRevenueExpenditure-amount">
            <i class="el-icon-warning" style="color: rgba(26, 127, 217, 1)"></i>
            <span
              style="
                color: rgba(0, 0, 0, 0.65);
                font-size: 14px;
                margin-right: 32px;
                margin-left: 10px;
              "
              >待对方收款总额：<span
                style="color: rgba(1, 6, 33, 0.9); font-size: 20px"
              >
                {{ tableData.allforcollection | intervalFormat(false) }}</span
              ></span
            >
          </div>

          <div class="fundRevenueExpenditure-table">
            <u-table
              ref="plTable"
              class="utable"
              :height="parseInt($store.getters.screenHeight - 350) + 'px'"
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
                v-for="(item, index) in columns1"
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
                  <span v-if="item.prop == 'userName'">
                    {{ scope.row[item.prop] }}
                    <span
                      v-if="scope.row.merchantType != 4"
                      v-html="handleMerchantType(scope.row.merchantType)"
                    ></span>
                  </span>
                  <span v-else-if="item.prop == 'payPrice'">
                    {{ scope.row.payPrice | intervalFormat(true) }}
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
                    @click="handleJumpDetail2('fundPaymentDetail', scope.row)"
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
        </el-tab-pane>
      </el-tabs>
    </div>
  </Container>
</template>

<script>
import { Base64 } from "js-base64";
import { financialDetails } from "@/request/api/financialManage/index";
import elementResizeDetectorMaker from "element-resize-detector";

export default {
  name: "fundRevenueExpenditure",
  components: {},
  data() {
    return {
      activeName: "1",
      queryData: {
        typeArray: [],
        custmorFilter: "",
        Times: [],
        paymentType: 0,
        transactionType: "0",
        transferType: "0",
      },
      pagination: {
        page: 1, // 页码
        limit: 50, // 分页大小
        total: 0,
      },
      columns: [
        {
          minWidth: 180,
          prop: "title",
          label: "收支类型",
          align: "left",
        },
        {
          minWidth: 200,
          prop: "userName",
          label: "客户姓名",
          align: "left",
        },
        {
          minWidth: 140,
          prop: "userPhone",
          label: "联系电话", // edit
          align: "left",
        },
        {
          minWidth: 150,
          prop: "companyName",
          label: "企业名称",
          align: "left",
        },
        {
          minWidth: 150,
          prop: "financialType1",
          label: "收入金额(元)",
          align: "left",
        },
        {
          minWidth: 150,
          prop: "financialType2",
          label: "支出金额(元)",
          align: "left",
        },
        {
          minWidth: 150,
          prop: "financialType",
          label: "收支状态",
          align: "left",
        },
        {
          minWidth: 180,
          prop: "timestamp",
          label: "成交时间",
          align: "left",
        },
      ],
      columns1: [
        {
          minWidth: 180,
          prop: "title",
          label: "收支类型",
          align: "left",
        },
        {
          minWidth: 200,
          prop: "userName",
          label: "客户姓名",
          align: "left",
        },
        {
          minWidth: 140,
          prop: "userPhone",
          label: "联系电话", // edit
          align: "left",
        },
        {
          minWidth: 150,
          prop: "companyName",
          label: "企业名称",
          align: "left",
        },
        {
          minWidth: 150,
          prop: "payPrice",
          label: "支付金额(元)",
          align: "left",
        },
        {
          minWidth: 180,
          prop: "timestamp",
          label: "付款时间",
          align: "left",
        },
      ],
      tableData: {},
      tableDataList: [],
      SetHeight: 0,
    };
  },
  watch: {
    "queryData.typeArray": {
      handler(val, oval) {
        this.handlerSetHeight("currentBasketDetailsTable");
      },
      deep: true,
    },
  },
  computed: {
    typeOptions() {
      // 经营户 1  供货商 2    生鲜超市  3    农贸市场  4   食堂饭店   5
      let dataList = [
        {
          value: "1-2",
          label: "交易支出",
          children: [
            { value: "1-1", label: "采购付款", role: [1, 2, 4, 5, 3] },
            { value: "1-2", label: "退货退款付款", role: [1, 2] },
            { value: "1-3", label: "购入筐子付款", role: [1, 2, 4, 5, 3] },
            { value: "1-4", label: "自购筐子付款", role: [1, 2, 4, 5, 3] },
            { value: "1-5", label: "退筐退款付款", role: [1, 2, 4, 5, 3] },
            { value: "1-6", label: "配送退货付款", role: [3] },
            { value: "1-7", label: "配送退筐付款", role: [3] },
            { value: "1-8", label: "修改记录退款", role: [1, 2, 4, 5, 3] },
          ],
        },
        {
          value: "2-1",
          label: "交易收款",
          children: [
            { value: "2-1", label: "销售收款", role: [1, 2, 4, 3] },
            { value: "2-2", label: "退货退款收款", role: [1, 2, 4, 5, 3] },
            { value: "2-3", label: "售出筐子收款", role: [1, 2, 4, 5, 3] },
            { value: "2-4", label: "报废筐子收款", role: [1, 2, 4, 5, 3] },
            { value: "2-5", label: "退筐退款收款", role: [1, 2, 4, 5, 3] },
            { value: "2-6", label: "配送收款", role: [3] },
            { value: "2-7", label: "销售记账", role: [] },
            { value: "2-8", label: "菜品销售收款", role: [5] },
            { value: "2-9", label: "修改记录收款", role: [1, 2, 4, 5, 3] },
          ],
        },
        {
          value: "3-2",
          label: "转账支出",
          children: [
            { value: "3-1", label: "归还预付款付款", role: [1, 2] },
            { value: "3-2", label: "借款付款", role: [1, 2, 4, 5, 3] },
            { value: "3-3", label: "归还借款付款", role: [1, 2, 4, 5, 3] },
            { value: "3-4", label: "预付款付款", role: [1, 4, 5, 3] },
            { value: "3-5", label: "其他付款", role: [1, 2, 4, 5, 3] },
            { value: "3-6", label: "归还记账货款付款", role: [1, 2, 4, 5, 3] },
            {
              value: "3-7",
              label: "归还记账筐子款付款",
              role: [1, 2, 4, 5, 3],
            },
          ],
        },
        {
          value: "4-1",
          label: "转账收款",
          children: [
            { value: "4-1", label: "预付款收款", role: [1, 2] },
            { value: "4-2", label: "归还预付款收款", role: [1, 4, 5, 3] },
            { value: "4-3", label: "借款收款", role: [1, 2, 4, 5, 3] },
            { value: "4-4", label: "归还借款收款", role: [1, 2, 4, 5, 3] },
            { value: "4-5", label: "其他收款", role: [1, 2, 4, 5, 3] },
            { value: "4-6", label: "归还记账货款收款", role: [1, 2] },
            {
              value: "4-7",
              label: "归还记账筐子款收款",
              role: [1, 2, 4, 5, 3],
            },
          ],
        },
      ];

      let param = this.$store.getters.userInfo;
      let menuId = null;
      let menuList = [];

      // 经营户 1
      if (param.usertype == 6 || param.usertype == 7) {
        menuId = 1;
      }
      // 供货商 2
      if (param.usertype == 10 || param.usertype == 11) {
        menuId = 2;
      }
      // 采购商
      if (param.usertype == 3 || param.usertype == 4) {
        // 生鲜超市 3
        if (param.purchaseType == 2) {
          menuId = 3;
        }
        // 农贸市场 4
        if (param.purchaseType == 3) {
          menuId = 4;
        }
        // 食堂饭店 5
        if (param.purchaseType == 1) {
          menuId = 5;
        }
      }
      for (let i = 0; i < dataList.length; i++) {
        const el = dataList[i];
        menuList.push({
          value: el.value,
          label: el.label,
          children: [],
        });
        for (let j = 0; j < el.children.length; j++) {
          const ele = el.children[j];
          if (ele.role.indexOf(menuId) != -1) {
            menuList[i].children.push({ value: ele.value, label: ele.label });
          }
        }
      }
      return menuList;
    },
  },
  methods: {
    getList(arg) {
      if (arg === 1) {
        this.pagination.page = 1;
      }

      let param = {};
      if (this.activeName == 1) {
        param = {
          custmorFilter: this.queryData.custmorFilter, // 客户搜索
          paymentType: this.queryData.paymentType, // 收支类型  0---收入、支出   1---收入   2---支出
          transactionType: this.queryData.transactionType, // 交易收入、支出     多个"1,2,3,4"
          transferType: this.queryData.transferType, // 转账收入、支出    多个"1,2,3,4"
          detailsType: this.activeName, // 1--实际收支    2--待对方收款
          pagesize: this.pagination.page, // 页码
          pagenum: this.pagination.limit, // 分页大小
          startTime: this.queryData.Times[0] / 1000 || "", // 开始时间戳
          endTime: this.queryData.Times[1] / 1000 || "", // 截止时间戳
        };
      } else {
        param = {
          custmorFilter: "", // 客户搜索
          paymentType: 0, // 收支类型  0---收入、支出   1---收入   2---支出
          transactionType: "0", // 交易收入、支出     多个"1,2,3,4"
          transferType: "0", // 转账收入、支出    多个"1,2,3,4"
          detailsType: this.activeName, // 1--实际收支    2--待对方收款
          pagesize: this.pagination.page, // 页码
          pagenum: this.pagination.limit, // 分页大小
          startTime: "", // 开始时间戳
          endTime: "", // 截止时间戳
        };
      }

      financialDetails(param).then((res) => {
        if (res.status == 200) {
          this.tableData = res.data[0];
          this.tableDataList = res.data[0].modelList;
          this.pagination.total = res.data[0].allNum;
        }
      });
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
    // 刷新
    hanleRefresh() {
      this.getList(1);
    },
    handleClick(val) {
      this.getList(1);
    },
    handleChange(val) {
      if (val.length > 0) {
        let valdata = val[0][0].split("-");
        this.queryData.paymentType = valdata[1];
        let typeArray = [];
        for (let i = 0; i < val.length; i++) {
          const el = val[i][1];
          typeArray.push(el.split("-")[1]);
        }

        if (valdata[0] == "1" || valdata[0] == "2") {
          this.queryData.transactionType = typeArray.toString();
          this.queryData.transferType = "0";
        }
        if (valdata[0] == "3" || valdata[0] == "4") {
          this.queryData.transactionType = "0";
          this.queryData.transferType = typeArray.toString();
        }
      } else {
        this.queryData.paymentType = 0; // 收支类型  0---收入、支出   1---收入   2---支出
        this.queryData.transactionType = "0"; // 交易收入、支出     多个"1,2,3,4"
        this.queryData.transferType = "0"; // 转账收入、支出    多个"1,2,3,4"
      }
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
    // 跳转页面
    handleJumpDetail: function (form, record) {
      this.$router.push({
        path: form,
      });
      // Base64.decode(this.pwd);//解密
    },
    // 跳转页面
    handleJumpDetail1: function (record) {
      if (record.orderType == 17) {
      } else if (record.orderType == 18) {
      } else {
        let formName = "";
        // 1--收入 已付款  2--支出 已收款
        if (record.financialType == 1) {
          formName = "fundPaidDetail";
        } else {
          formName = "fundPaidForDetail";
        }
        this.$router.push({
          path: formName,
          query: {
            data: Base64.encode(
              JSON.stringify({
                payId: record.payId,
                merchantType: record.merchantType,
              })
            ), // payId 用户类型 0-非平台  1-经营户  2-采购户  3-供货商  4-不显示
          }, //加密
        });
      }
    },
    // 跳转页面1
    handleJumpDetail2: function (form, record) {
      this.$router.push({
        path: form,
        query: {
          data: Base64.encode(JSON.stringify({ payId: record.payId })),
        }, //加密
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
  },
  created() {
    this.getList(1);
  },
  mounted() {
    this.handlerSetHeight("currentBasketDetailsTable");
  },
};
</script>

<style lang="scss" scoped>
.fundRevenueExpenditure-model {
  .header-page {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
    .header-left {
      .header-left-content {
        display: flex;
        align-items: center;
        .header-lf-title {
          margin-right: 60px;
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
  }

  .fundRevenueExpenditure-search {
    padding: 16px 0px 10px 0px;
    border-top: 1px solid #e9e9e9;
    border-bottom: 1px solid #e9e9e9;

    .search-form-border {
      display: inline-block;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      margin-right: 15px;

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
  .fundRevenueExpenditure-amount {
    margin-top: 15px;
    background: rgba(230, 247, 255, 1);
    border: 1px solid rgba(26, 127, 217, 0.5);
    border-radius: 5px;
    padding: 5px 10px;
  }
  .fundRevenueExpenditure-table {
    padding-top: 10px;
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
