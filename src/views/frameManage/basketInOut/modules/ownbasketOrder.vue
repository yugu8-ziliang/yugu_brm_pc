<template>
  <!-- 自有筐子详情 -->
  <PageNoScroll class="orderDetailsModel">
    <div>
      <el-scrollbar
        ref="scrollDiv"
        :style="{
          height: $store.getters.screenHeight - 220 + 'px',
        }"
      >
        <div>
          <el-descriptions title="订单信息">
            <template slot="extra">
              <div class="ordermsg" style="margin-right: 16px">
                <span class="ordersize">操作人：</span>
                <span class="ordersize">{{ tableData.addByUserName }}</span>
              </div>
            </template>
            <el-descriptions-item label="订单编号">{{
              tableData.basketBuyMyselfId
            }}</el-descriptions-item>
            <el-descriptions-item label="添加类型" style="color: "
              >自家已有</el-descriptions-item
            >
            <el-descriptions-item label="订单时间">{{
              tableData.confirmTimestamp | parseTime
            }}</el-descriptions-item>
            <el-descriptions-item label="订单金额"
              >{{
                moneyFormatTwo(tableData.totalPrice)
              }}元</el-descriptions-item
            >
          </el-descriptions>
        </div>

        <div style="border-top: 1px solid #e9e9e9; margin-top: 18px">
          <div
            style="
              font-size: 16px;
              color: rgba(1, 6, 33, 0.9);
              font-weight: 600;
              margin-bottom: 16px;
              margin-top: 16px;
            "
          >
            筐子信息
          </div>
          <div class="currentInventory-table">
            <u-table
              ref="plTable"
              class="utable"
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
              :span-method="objectSpanMethod"
              show-summary
              :summary-method="getSummaries"
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
                :align="item.align"
                header-align="left"
              >
                <template slot-scope="scope">
                  <span
                    v-if="
                      item.prop == 'basketPrice' ||
                      item.prop == 'basketTotalPrice'
                    "
                    >{{ moneyFormatTwo(scope.row[item.prop]) }}</span
                  >
                  <span v-else-if="item.prop == 'basketName'"
                    >【{{ scope.row.name }}】{{ scope.row.basketName }}</span
                  >
                  <span v-else>{{ scope.row[item.prop] }}</span>
                </template>
              </u-table-column>
            </u-table>
          </div>
        </div>
        <div style="margin-top: 20px">
          <div
            style="
              font-size: 16px;
              color: rgba(1, 6, 33, 0.9);
              font-weight: 600;
              margin-bottom: 10px;
            "
          >
            备注
          </div>
          <div
            v-for="(remarkitem, remarkindex) in remarks"
            :key="'remark' + remarkindex"
          >
            <span class="note-size" style="margin-right: 30px">{{
              remarkitem.createtime | parseTime
            }}</span>
            <span class="note-size">{{ remarkitem.type }}</span>
            <div class="note-size" style="margin-bottom: 30px">
              备注内容：<span
                v-for="(remark2item, remark2index) in remarkitem.remark"
                :key="'remark2index' + remark2index"
                >{{ remark2item }}</span
              >
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </PageNoScroll>
</template>

<script>
import { userBuyMySelfDetail } from "@/request/api/frameManage/basketInOut";
export default {
  name: "ownbasketOrder",
  data() {
    return {
      remarks: [],
      basketDetails: {},
      typeView: "", // 判断当前是哪种筐子类型
      orderId: "",
      tableDataList: [],
      tableData: {},
      columns: [
        {
          prop: "basketName",
          label: "筐子种类",
        },
        {
          prop: "color",
          label: "颜色",
        },
        {
          prop: "basketPrice",
          label: "单价(元)",
        },
        {
          prop: "basketCount",
          label: "数量(个)",
        },
        {
          // width: 200,
          prop: "basketTotalPrice",
          label: "金额(元)",
        },
      ],
    };
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        let { basketInOutTypeView, orderId } = val.query;
        if (basketInOutTypeView && orderId) {
          this.typeView = basketInOutTypeView;
          this.orderId = orderId;
        }
        this.getList();
      },
      // 深度观察监听
      // deep: true,
      immediate: true,
    },
  },
  methods: {
    getList() {
      userBuyMySelfDetail({
        orderId: this.orderId,
      }).then((res) => {
        if (res.status == 200) {
          this.tableData = res.data[0];
          this.remarks = this.tableData.remarks;
          this.basketDetails = this.tableData.basketDetails[0];
          if (res.data[0].basketDetails.length > 0) {
            let tableData = [];
            let data1 = res.data[0].basketDetails;
            for (let i = 0; i < data1.length; i++) {
              const el = data1[i];
              if (el.basketList.length > 0) {
                let data2 = el.basketList;
                for (let j = 0; j < data2.length; j++) {
                  const el1 = data2[j];
                  tableData.push({
                    isCol: j == 0 ? el.basketList.length : null,
                    ...el,
                    basketCount: el1.basketCount, // 筐子数量
                    basketPrice: el1.basketPrice, // 单价
                    basketTotalPrice: el1.basketTotalPrice, // 金额
                    color: el1.color, // 白色/彩色
                    basketWeight: el1.basketWeight, // 重量
                    basketLength: el1.basketLength, // 长
                  });
                }
              } else {
                tableData.push(el);
              }
            }
            this.tableDataList = tableData;
          }
        }
      });
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex == 0 || row.isCol) {
          return {
            rowspan: row.isCol,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
      if (columnIndex === 1) {
        if (rowIndex == 0 || row.isCol) {
          return {
            rowspan: row.isCol,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
      if (columnIndex === 2) {
        if (rowIndex == 0 || row.isCol) {
          return {
            rowspan: row.isCol,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
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
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] =
            '<span style="color: rgba(1, 6, 33, 0.9);font-size:18px;font-weight: 600;">' +
            "总计： " +
            this.basketDetails.basketNum +
            " 种</span>";
          return;
        }
        if (
          column.property == "basketCount" ||
          column.property == "basketTotalPrice"
        ) {
          const values = data.map((item) => Number(item[column.property]));
          // 合计
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            if (column.property == "basketTotalPrice") {
              sums[index] =
                '<span style="color: #E8541E;font-size:18px;font-weight: 700;">' +
                this.moneyFormatTwo(sums[index]) +
                "</span>";
            }
            if (column.property == "basketCount") {
              sums[index] =
                '<span style="color:rgba(1, 6, 33, 0.9);font-size:18px;font-weight: 700;">' +
                sums[index] +
                "</span>";
            }
          }
        } else {
          sums[index] = "";
        }
      });
      return [sums];
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.orderDetailsModel {
  .ordermsg {
    display: inline-block;

    .ordersize {
      font-size: 13px;
      color: rgba(1, 6, 33, 0.75);
    }
  }

  .img-icon {
    height: 14px;
  }

  .note-size {
    font-size: 14px;
    color: rgba(1, 6, 33, 0.75);
    margin-top: 12px;
  }

  .type-button {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 16px;

    .type-button-left {
      color: var(--color-primary);
      font-size: 14px;
    }

    .type-button-left1 {
      margin-right: 16px;
    }

    .type-button-right {
      color: var(--color-primary);
      border: 1px solid var(--color-primary);
      margin-right: 8px;
    }
  }

  .type1-button {
    display: flex;
    flex-direction: row;
    justify-content: right;

    .type1-button-right {
      color: var(--color-primary);
      border: 1px solid var(--color-primary);
      margin-right: 8px;
    }
  }
}
</style>

<style lang="scss">
.orderDetailsModel {
  .el-scrollbar {
    .el-scrollbar__wrap {
      margin-bottom: 0px !important;
      overflow-x: hidden;

      .el-scrollbar__view {
        // height: var(--screenHeight) !important;
        position: relative;
        padding: 0px !important;
      }
    }
  }
}
</style>