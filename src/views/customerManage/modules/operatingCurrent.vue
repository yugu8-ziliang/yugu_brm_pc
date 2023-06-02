<template>
  <!-- 经营往来款 -->
  <el-scrollbar style="height: 100%" v-loading="loading">
    <div class="cardBox" style="background-color: rgba(0, 0, 0, 0.04);padding:24px;">
      <div style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 20px;
                font-weight:600;
                margin:16px 0px;
                width: 14%
              ">经营往来款</div>
      <div class="card-box" style="margin-right:60px;">
        <span class="card-title">经营往来款余额</span>
        <div class="card-price">
          {{moneyFormat(priceSum.balance) }}
        </div>
      </div>

      <div style="margin-right:60px;">
        <div style="margin-bottom:8px">
          <el-link style="color: rgba(221, 76, 77, 1);" :underline="false">
            <span class="collTitle">未付采购款</span>
            <span class="collTitle" style="margin-left:16px;margin-right:6px;">{{ moneyFormat(priceSum.unPay) }}</span>
            <i class="el-icon-arrow-right"></i>
          </el-link>
        </div>
        <div>
          <span class="collTitle">已付货款</span>
          <span class="collTitle" style="margin-left:15px;">{{ moneyFormat(priceSum.payAmount) }}</span>
        </div>
      </div>
      <div>
        <div style="margin-bottom:8px">
          <el-link style="color: rgba(26, 127, 217, 1);" :underline="false">
            <span class="collTitle">未收销售款</span>
            <span style="margin-left:16px;margin-right:6px;">{{ moneyFormat(priceSum.unReceive) }}</span>
            <i class="el-icon-arrow-right"></i>
          </el-link>
        </div>
        <div>
          <span class="collTitle">已收货款</span>
          <span class="collTitle" style="margin-left:15px;">{{ moneyFormat(priceSum.receivedAmount) }}</span>
        </div>
      </div>
    </div>
    <!-- 搜索框 -->
    <el-form inline ref="search-form" style="width: 100%;margin-top:18px;">
      <el-form-item>
        <el-cascader :options="options" :show-all-levels="false" v-model="queryData.transType" size="small">
          <template slot="prefix">
            <div class="label-title">收/付款类型</div>
          </template>
        </el-cascader>
      </el-form-item>
      <el-form-item class="custom-form-item">
        <div class="custom-date-picker">
          <span>创建日期</span>
          <el-date-picker size="small" type="daterange" v-model="queryData.timestampList" value-format="timestamp"
            start-placeholder="开始日期" end-placeholder="结束日期" prefix-icon></el-date-picker>
          <i class="el-icon-date"></i>
        </div>
      </el-form-item>
      <div>
        <div style="margin-bottom: 15px">
          <el-button size="small" @click="handleReset">重 置</el-button>
          <el-button type="primary" size="small" @click="handleSearch">查 询</el-button>
        </div>
      </div>
    </el-form>
    <!-- 表格 -->
    <div style="margin-top: 20px" class="currentInventory-table">
      <u-table ref="plTable" class="utable" :height="$store.getters.screenHeight - 430 + 'px'" :border="false"
        :header-row-style="{ height: '46px' }" :header-cell-style="{
            padding: '0px 0px',
            'font-size': '14px',
            color: 'rgba(1, 6, 33, 0.65)',
            background: 'rgba(0, 0, 0, 0.02)',
          }" :row-style="{ height: '46px' }" :cell-style="{
            padding: '0px 0px',
            'font-size': '14px',
            color: 'rgba(1, 6, 33, 0.7)',
            height: '46px',
          }" use-virtual :row-height="46" showBodyOverflow="tooltip" showHeaderOverflow="title" :data="tableData">
        <u-table-column v-for="(item, index) in columns" :key="index" :resizable="item.resizable"
          :show-overflow-tooltip="true" :prop="item.prop" :label="item.label" :fixed="item.fixed" :width="item.width"
          :min-width="item.minWidth" :align="item.align" :header-align="item.align">
          <template slot-scope="scope">
            <span v-if="item.prop=='timestamp' ">{{scope.row[item.prop]|parseTime}}</span>
            <span v-else-if="item.prop=='totalPrice'|| item.prop=='actPrice'|| item.prop=='balance'">
              {{
              moneyFormatTwo(scope.row[item.prop])
              }}
            </span>
            <span v-else-if="item.prop=='payName' && scope.row[item.prop] == '组合收款'">
              <el-tooltip placement="top-start">
                <div slot="content" style="padding:8px 40px 14px 12px;">
                  <div>
                    <span>组合收款</span>
                    <div style="margin:10px 0px 10px 18px">
                      <span>实际收款</span>
                      <div style="margin:10px 0px 10px 18px">
                        <div>
                          <span style="margin-right:12px">微信：</span>
                          <span>{{payInfo.actualPay.weChat|| 0}}元</span>
                        </div>
                        <div style="margin:10px 0px">
                          <span style="margin-right:12px">现金：</span>
                          <span>{{payInfo.actualPay.cash|| 0}}元</span>
                        </div>
                        <div>
                          <span style="margin-right:12px">支付宝：</span>
                          <span>{{payInfo.actualPay.aliPay|| 0}}元</span>
                        </div>
                        <div style="margin:10px 0px">
                          <span style="margin-right:12px">银行卡：</span>
                          <span>{{payInfo.actualPay.bank|| 0}}元</span>
                        </div>
                        <div>
                          <span style="margin-right:12px">线上收款：</span>
                          <span>{{payInfo.actualPay.lakalaCollection|| 0}}元</span>
                        </div>
                      </div>
                    </div>
                    <div style="margin-left:18px">
                      <span>双方抵充支付</span>
                      <div style="margin-left:18px">
                        <div style="margin:10px 0px">
                          <span style="margin-right:12px">减少未付：</span>
                          <span>{{payInfo.offsetPay.notReceived || 0}}元</span>
                        </div>
                        <div>
                          <span style="margin-right:12px">减少已收：</span>
                          <span>{{payInfo.offsetPay.paid || 0}}元</span>
                        </div>
                      </div>
                    </div>
                    <div style="margin:10px 0px 0px 18px">
                      <span>双方抵扣支付</span>
                      <div style="margin-left:18px">
                        <div style="margin:10px 0px">
                          <span style="margin-right:12px">减少借入款：</span>
                          <span>{{payInfo.deductionPay.borrowPrice || 0}}元</span>
                        </div>
                        <div>
                          <span style="margin-right:12px">减少已收预付款：</span>
                          <span>{{payInfo.deductionPay.advancePrice || 0}}元</span>
                        </div>
                        <div style="margin-top:10px">
                          <span style="margin-right:12px">减少已收转载其他：</span>
                          <span>{{payInfo.deductionPay.transferOtherPrice || 0}}元</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <el-button style="border:none;background-color: #ffffff;padding:0px;text-align:left;">
                  <span class="card-title" style="font-size:14px;color:#606266">{{scope.row[item.prop]}}</span>
                </el-button>
              </el-tooltip>
            </span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </u-table-column>
      </u-table>
      <div class="paging">
        <el-pagination background layout="total, sizes, prev, pager, next, jumper" :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total" :page-size="pagination.limit" :current-page.sync="pagination.page"
          @size-change="handleSizeChange" @current-change="handleCurrentChange"></el-pagination>
      </div>
    </div>
  </el-scrollbar>
</template>

<script>
  import {
    businessTransactionDetail
  } from "@/request/api/customerManage/customer.js";
  import {
    isCascader
  } from "@/utils/cascader.js";
  const columns = [{
      prop: "orderTypeName",
      label: "收/付款类型",
      align: "left"
    },
    {
      prop: "orderNo",
      label: "单号",
      align: "left"
    },
    {
      prop: "totalPrice",
      label: "订单金额(元)",
      align: "left"
    },
    {
      prop: "actPrice",
      label: "本次收款/支付金额(元)",
      align: "left"
    },
    {
      prop: "payName",
      label: "支付方式",
      align: "left"
    },
    {
      prop: "balance",
      label: "当前余额(元)",
      align: "left"
    },
    {
      prop: "timestamp",
      label: "创建时间",
      align: "left"
    }
  ];
  export default {
    name: "operatingCurrent",
    data() {
      return {
        loading: true,
        options: [],
        columns: columns,
        priceSum: {
          balance: 0, //经营往来款金额
          unPay: 0, // 未付采购款
          unReceive: 0, // 未收销售款
          payAmount: 0, // 已付货款
          receivedAmount: 0 // 已收货款
        },
        pagination: {
          page: 1, // 页码
          limit: 10, // 分页大小
          total: 0
        },
        payInfo: {
          actualPay: {
            aliPay: 0, //支付宝
            bank: 0, //银行卡
            cash: 0, //现金
            weChat: 0, //微信
            lakalaCollection: 0 //线上收款
          },
          offsetPay: {
            //抵充支付
            notReceived: 0, //未收
            paid: 0 //已付
          },
          deductionPay: {
            //抵扣支付
            borrowPrice: 0, //减少借出款
            advancePrice: 0, //减少已预付款
            transferOtherPrice: 0 //减少已付转账其他
          }
        },
        queryData: {
          customerId: "",
          transType: "0", //收付款类型
          timestampList: [] //创建日期
        },
        tableData: []
      };
    },
    props: {
      customerId: {
        type: String
      },
      merchantTypeCode: {
        type: String
      }
    },
    created() {
      let userType = JSON.parse(localStorage.getItem("userInfo"))?.usertype || "";
      this.options = isCascader(userType, this.merchantTypeCode) || [];
      this.getList(1);
    },
    methods: {
      getList(arg) {
        //若传入参数1则加载第一页的内容
        if (arg === 1) {
          this.pagination.page = 1;
        }
        //查询条件
        let param = {
          merchantTypeCode: this.merchantTypeCode,
          customerId: this.customerId,
          transType: this.queryData.transType,
          pageindex: this.pagination.page, // 分页，第几页
          pagesize: this.pagination.limit // 分页，每页几条
        };
        if (this.queryData.timestampList.length > 0) {
          param.startTime = this.queryData.timestampList[0] / 1000; // 成交开始时间
          param.endTime = this.queryData.timestampList[1] / 1000; // 成交结束时间
        }
        businessTransactionDetail(param)
          .then(res => {
            if (res.status == 200) {
              this.tableData = res.data[0].modelList;
              this.pagination.total = res.data[0].allCount; //数据总条数
              this.loading = false;
              this.priceSum = {
                balance: res.data[0].balance, //经营往来款金额
                unPay: res.data[0].unPay, // 未付采购款
                unReceive: res.data[0].unReceive, // 未收销售款
                payAmount: res.data[0].payAmount, // 已付货款
                receivedAmount: res.data[0].receivedAmount // 已收货款
              };
            }
          });
      },
      // 数值取两位小数
      moneyFormat(moneyStr) {
        if (moneyStr > 10000|| moneyStr < -10000) {
          let a = Number(moneyStr / 10000).toFixed(2).toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g,
            "$1,")
          return a + '万'
        } else {
          let a = Number(moneyStr).toFixed(2).toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
          return a + '元'
        }
      },
      moneyFormatTwo(moneyStr) {
        // 先将数值取两位小数
        let money = Number(moneyStr).toFixed(2).toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
        return money
      },
      // 分页方法
      handleSizeChange(val) {
        this.pagination.limit = val;
        this.getList(1);
      },
      handleCurrentChange(val) {
        this.loading = true;
        this.pagination.page = val;
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
    }
  };
</script>

<style lang="scss" scoped>
  .label-title {
    padding: 0 6px;
    height: 100%;
    display: flex;
    color: rgba(1, 6, 33, 0.35);
  }

  ::v-deep .el-select .el-input--prefix .el-input__inner {
    padding-left: 85px;
  }

  ::v-deep .el-input--suffix .el-input__inner {
    padding-right: 0px;
  }

  .cardBox {
    display: flex;
  }

  .card-title {
    font-size: 16px;
    color: rgba(1, 6, 33, 0.55);
  }

  .card-box {
    margin-right: 30px;
  }

  .card-box .card-price {
    font-size: 24px;
    color: rgba(1, 6, 33, 0.9);
  }

  .collTitle {
    font-size: 13px;
  }

  .paging {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-top: 10px;
    padding-bottom: 5px;
  }

  // 日期选择器样式
  ::v-deep .custom-form-item {
    .el-form-item__content {
      height: 36.5px;
      display: flex;
      align-items: center;
    }

    .custom-date-picker {
      height: 32px;
      display: flex;
      align-items: center;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      width: 340px;

      &:hover {
        border-color: #c0c4cc;
      }

      span {
        color: rgba(1, 6, 33, 0.35);
        margin: 0px 6px 0 11px;
      }

      .el-range__icon {
        display: none;
      }

      .el-input__inner {
        border: none;
        padding: 0;
        height: 30px;
        flex: 1;
      }

      i {
        color: #c0c4cc;
        margin: 0px 6px;
      }
    }
  }
</style>