<template>
  <!-- 经营往来款抵充 -->
  <div class="creditFundsDialog">
    <el-dialog
      :title="title"
      :visible.sync="isVisiable"
      :close-on-click-modal="false"
      :before-close="close"
      top="100px"
      width="822px"
    >
      <div style="padding: 8px 0px 10px">
        <el-row :span="24" style="margin-bottom: 5px">
          <el-col :span="6">
            <div>
              <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                >经营往来款抵充：</span
              ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                {{ tableData.comeInPrice }}元
              </span>
            </div>
          </el-col>
          <el-col :span="8">
            <div>
              <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                >最后抵充时间：</span
              ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                {{ tableData.confirmTimestamp | parseTime }}
              </span>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                >操作人：</span
              ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                {{ tableData.addByUserName }}
              </span>
            </div>
          </el-col>
        </el-row>

        <div
          style="padding-top: 5px; border-top: 1px solid rgba(1, 6, 33, 0.06)"
        >
          <el-row :span="24">
            <el-col :span="24">
              <div>
                <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >抵充订单：</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                  {{ tableData.all }}笔 (商品：{{
                    tableData.commodity
                  }}笔，筐子：{{ tableData.basket }}笔，记账：{{
                    tableData.note
                  }}笔)
                </span>
              </div>
            </el-col>
          </el-row>
        </div>

        <div style="padding-top: 5px">
          <u-table
            ref="plTable"
            class="utable"
            :height="$store.getters.screenHeight - 390 + 'px'"
            :border="false"
            :header-row-style="{ height: '46px' }"
            :header-cell-style="{
              padding: '0px 0px',
              'font-size': '14px',
              color: 'rgba(1, 6, 33, 0.65)',
              background: 'rgba(0, 0, 0, 0.02)',
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
            :data="tableData.details"
          >
            <template slot="empty"> 没有查询到符合条件的记录 </template>

            <u-table-column
              v-for="(item, index) in columns"
              :key="index"
              :resizable="item.resizable"
              :show-overflow-tooltip="true"
              :prop="item.prop"
              :label="item.label"
              :fixed="item.fixed"
              :width="item.width"
              :align="item.align"
              header-align="left"
              :sortable="item.sortable"
            >
              <template slot-scope="scope">
                <span v-if="item.prop == 'orderType'">
                  {{ orderTypeF(scope.row.orderType) }}
                </span>
                <span v-else-if="item.prop == 'timestamp'">
                  {{ scope.row.timestamp | parseTime }}
                </span>
                <span v-else-if="item.prop == 'comeInPrice'">
                  {{ scope.row.comeInPrice }}元
                </span>

                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
            </u-table-column>

            <u-table-column label="操作" :width="80" align="left">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  style="margin-right: 15px"
                  @click="handleShow(scope)"
                >
                  查看</el-button
                >
              </template>
            </u-table-column>
          </u-table>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { comeInPriceRecordInfo } from "@/request/api/collectionRecord/index";
export default {
  name: "creditFundsDialog",
  data() {
    return {
      title: "",
      isVisiable: false,
      model: {},
      tableData: {},
      columns: [
        {
          width: 120,
          prop: "orderType",
          label: "订单类型",
          align: "left",
        },
        {
          width: 140,
          prop: "no",
          label: "订单编号",
          align: "left",
        },
        {
          width: 140,
          prop: "statusName",
          label: "订单状态",
          align: "left",
        },
        {
          width: 160,
          prop: "timestamp",
          label: "订单时间",
          align: "left",
        },
        {
          width: 140,
          prop: "comeInPrice",
          label: "抵充金额",
          align: "left",
        },
      ],
    };
  },
  methods: {
    add() {},
    edit(record) {
      this.loading = true;
      this.model = Object.assign({}, this.model, record);
      this.getList();
    },
    getList() {
      let param = {
        orderPayDetailId: this.model.orderPayDetailId,
      };
      comeInPriceRecordInfo(param).then((res) => {
        this.tableData = res.data[0];
      });
    },
    orderTypeF(val) {
      let param = "";
      if (val == "OrderBasket") {
        param = "筐子购入单";
      } else if (val == "OrderSell") {
        param = "商品采购单";
      } else if (val == "OrderReturn") {
        param = "退货退款单";
      } else if (val == "OrderAddReport") {
        param = "添加商品";
      } else if (val == "BasketBuyMyself") {
        param = "筐子自购单";
      } else if (val == "OrderBasketReturn") {
        param = "退筐退款单";
      } else if (val == "TransferNote") {
        param = "记账";
      } else if (val == "ScrapBasket") {
        param = "筐子报废单";
      }

      return param;
    },
    handleShow(val) {
      let type = val.row.orderType;
      if (type == "OrderBasket") {
        // OrderBasket(筐子订单) 筐子购入单
        this.$router.push({
          path: "/frameManage/purchaseOrder",
          query: {
            orderId: val.row.uid,
            basketInOutTypeView: this.model.basketInOutTypeView == "2" ? 0 : 1,
          },
        });
        // orderId=1028&basketInOutTypeView=4
      } else if (type == "OrderSell") {
        //OrderSell(商品订单) 商品采购单
        this.$router.push({
          path: "/orderManagement/purchaseOrdersDetail",
          query: {
            id: val.row.uid,
            type: this.model.basketInOutTypeView == "2" ? 1 : 0,
          },
        });
      } else if (type == "OrderReturn") {
        //OrderReturn(退货退款单)
      } else if (type == "OrderAddReport") {
        //OrderAddReport(添加商品，添加入库)，
        this.$router.push({
          path: "/commodityManage/addcommodityDetails",
          query: {
            id: val.row.uid,
          },
        });
      } else if (type == "BasketBuyMyself") {
        // BasketBuyMyself(筐子自购单),
        this.$router.push({
          path: "/frameManage/purchasemyOrder",
          query: {
            orderId: val.row.uid,
            basketInOutTypeView: this.model.basketInOutTypeView == "2" ? 0 : 1,
          },
        });
      } else if (type == "OrderBasketReturn") {
        // OrderBasketReturn(退筐退款单), 
        this.$router.push({
          path: "/frameManage/baskrefundOrder",
          query: {
            orderId: val.row.uid,
            basketInOutTypeView: this.model.basketInOutTypeView == "2" ? 0 : 1,
          },
        });
      } else if (type == "TransferNote") {
        // TransferNote(记账)，
        this.$router.push({
          path: "/financialManage/accountingDetail",
          query: {
            id: val.row.uid
          },
        });
      } else if (type == "ScrapBasket") {
        // ScrapBasket(筐子报废单)
        this.$router.push({
          path: "/frameManage/scrapOrder",
          query: {
            orderId: val.row.uid,
            basketInOutTypeView: this.model.basketInOutTypeView == "2" ? 0 : 1,
          },
        });
      }
    },
    // 关闭事件
    close(val) {
      this.loading = false;
      this.isVisiable = false;
      this.model = {};
    },
  },
};
</script>

<style scoped lang="scss">
.creditFundsDialog {
  .utable {
    width: 100%;
    // border: 1px solid #E9E9E9;
    border-top: 1px solid #e9e9e9;
    border-left: 1px solid #e9e9e9;
    border-right: 1px solid #e9e9e9;
  }
}
</style>

<style lang="scss">
.creditFundsDialog {
  .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>