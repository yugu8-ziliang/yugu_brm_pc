<template>
  <!-- 商品销售单 -->
  <el-scrollbar style="height: 100%">
    <div class="cardBox" style="background-color: rgba(0, 0, 0, 0.04);padding:24px;">
      <div style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 20px;
                font-weight:600;
                margin:16px 0px;
                width: 14%
              ">商品销售单</div>
      <div class="card-box">
        <span class="card-title">总金额</span>
        <div class="card-price">
          {{  moneyFormat(priceSum.orderTotalPrice) }}
        </div>
      </div>
      <div class="lineH"></div>
      <div class="card-box">
        <span class="card-title">商品销售金额</span>
        <div class="card-price">
          {{  moneyFormat(priceSum.productTotalPrice) }}
        </div>
      </div>
      <div class="lineH"></div>
      <div class="card-box">
        <span class="card-title">商品成本</span>
        <div class="card-price">
          {{  moneyFormat(priceSum.cost) }}
        </div>
      </div>
      <div class="lineH"></div>
      <div class="card-box">
        <span class="card-title">商品利润</span>
        <div class="card-price">
          {{  moneyFormat(priceSum.profits) }}
        </div>
      </div>
      <div class="lineH"></div>
      <div class="card-box">
        <span class="card-title">载货筐子销售金额</span>
        <div class="card-price">
          {{  moneyFormat(priceSum.basketTotalPrice) }}
        </div>
      </div>
    </div>
    <!-- 搜索框 -->
    <el-form inline ref="search-form" style="width: 100%;margin-top:18px;">
      <el-form-item>
        <el-select v-model="queryData.status" size="small">
          <template slot="prefix">
            <div class="label-title">订单状态</div>
          </template>
          <el-option label="全部" value="0"></el-option>
          <el-option label="待对方确认" value="1"></el-option>
          <el-option label="待修改" value="2"></el-option>
          <el-option label="待收款" value="3"></el-option>
          <el-option label="未结清" value="4"></el-option>
          <el-option label="已结清" value="5"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="custom-form-item">
        <div class="custom-date-picker">
          <span>创建日期</span>
          <el-date-picker size="small" type="daterange" v-model="queryData.timestampList" value-format="timestamp"
            start-placeholder="开始日期" end-placeholder="结束日期" prefix-icon></el-date-picker>
          <i class="el-icon-date"></i>
        </div>
      </el-form-item>
      <el-form-item class="custom-form-item">
        <div class="custom-date-picker">
          <span>成交日期</span>
          <el-date-picker size="small" type="daterange" v-model="queryData.confirmTimestampList"
            value-format="timestamp" start-placeholder="开始日期" end-placeholder="结束日期" prefix-icon></el-date-picker>
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
      <u-table ref="plTable" class="utable" :height="$store.getters.screenHeight - 440 + 'px'" :border="false"
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
            <span v-else-if="item.prop=='confirmTimestamp'">
              <span v-if="scope.row[item.prop] == 0" style="color: #e02020">未成交</span>
              <span v-else>{{scope.row[item.prop]|parseTime}}</span>
            </span>
            <span v-else-if="item.prop == 'status'">
              {{
              scope.row[item.prop] | isOrderStatus1(scope.row[item.prop])
              }}
            </span>
            <span
              v-else-if="item.prop=='orderTotalPrice'|| item.prop=='actualPayPrice'|| item.prop=='receivePrice'|| item.prop=='productTotalPrice'|| item.prop=='basketTotalPrice'">
              {{
               moneyFormatTwo(scope.row[item.prop])
              }}
            </span>
            <span v-else>{{scope.row[item.prop]}}</span>
          </template>
        </u-table-column>
        <u-table-column label="操作" align="left">
          <!-- <template slot-scope="scope">
            <el-button
              type="text"
              @click="
                handleJumpDetail('', {
                  userId: scope.row.userId,
                })
              "
            >查看</el-button>
          </template>-->
          <template>
            <el-button type="text">查看</el-button>
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
    getSellOrder
  } from "@/request/api/customerManage/customer.js";
  const columns = [{
      prop: "orderSellId",
      label: "销售单编号",
      align: "left"
    },
    {
      prop: "orderTotalPrice",
      label: "订单金额(元)",
      align: "left"
    },
    {
      prop: "actualPayPrice",
      label: "已收金额(元)",
      align: "left"
    },
    {
      prop: "receivePrice",
      label: "未收金额(元)",
      align: "left"
    },
    {
      prop: "productTotalPrice",
      label: "商品金额(元)",
      align: "left"
    },
    {
      prop: "basketTotalPrice",
      label: "筐子金额(元)",
      align: "left"
    },
    {
      prop: "status",
      label: "订单状态",
      align: "left"
    },
    {
      prop: "timestamp",
      label: "创建时间",
      width: "170",
      align: "left"
    },
    {
      prop: "confirmTimestamp",
      label: "成交时间",
      width: "170",
      align: "left"
    }
  ];
  export default {
    name: "commoditySalesorder",
    data() {
      return {
        columns: columns,
        priceSum: {
          orderTotalPrice: 0, //头部总金额
          productTotalPrice: 0, // 头部商品总金额
          basketTotalPrice: 0, // 头部载货筐子销售金额
          cost: 0, // 头部商品成本
          profits: 0 //  头部商品利润
        },
        queryData: {
          status: "0", //商品销售单 0 全部 1 待对方确认 2 待修改 3 代收款 4 未结清 5 已结清
          timestampList: [], //创建日期
          confirmTimestampList: [], //成交日期
          typeView: 1 //1 商品销售单 2 商品采购单
        },
        typeViews: Object.freeze({
          commoditySalesorder: 1,
          purchaseOrder: 2
        }),
        pagination: {
          page: 1, // 页码
          limit: 10, // 分页大小
          total: 0
        },
        tableData: []
      };
    },
    props: {
      toUserId: {
        type: String
      },
      currentView: {
        type: String
      }
    },
    created() {
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
          toUserId: this.toUserId,
          typeView: this.typeViews[this.currentView],
          ...this.queryData,
          pageindex: this.pagination.page, // 分页，第几页
          pagesize: this.pagination.limit // 分页，每页几条
        };
        if (this.queryData.timestampList != null && this.queryData.timestampList.length > 0) {
          param.startTime = this.queryData.timestampList[0].toString().substring(0, 10);
          param.endTime = this.queryData.timestampList[1].toString().substring(0, 10);
        }
        if (
          this.queryData.confirmTimestampList != null &&
          this.queryData.confirmTimestampList.length > 0
        ) {
          param.startConfirmTimestamp = this.queryData.confirmTimestampList[0]
            .toString()
            .substring(0, 10);
          param.endConfirmTimestamp = this.queryData.confirmTimestampList[1]
            .toString()
            .substring(0, 10);
        }
        getSellOrder(param)
          .then(res => {
            if (res.status == 200) {
              this.tableData = res.data[0].modelList;
              this.pagination.total = res.data[0].modelListCount; //分页前数据条数
              this.priceSum = {
                orderTotalPrice: res.data[0].orderTotalPrice, //头部总金额
                productTotalPrice: res.data[0].productTotalPrice, // 头部商品总金额
                basketTotalPrice: res.data[0].basketTotalPrice, // 头部载货筐子销售
                cost: res.data[0].cost, // 头部商品成本
                profits: res.data[0].profits //  头部商品利润
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
        let a = Number(moneyStr).toFixed(2).toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
        return a
      },
      // 分页方法
      handleSizeChange(val) {
        this.pagination.limit = val;
        this.getList(1);
      },
      handleCurrentChange(val) {
        this.pagination.page = val;
        this.getList();
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
    padding-left: 70px;
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

  .card-box .card-price {
    font-size: 24px;
    color: rgba(1, 6, 33, 0.9);
  }

  .card-price-title {
    font-size: 16px;
  }

  .lineH {
    width: 1px;
    height: 34px;
    border-right: 1px solid rgba(1, 6, 33, 0.35);
    overflow: hidden;
    box-shadow: none;
    margin: 16px 30px;
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