<template>
  <!-- 报废单详情 -->
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
              tableData.orderNo
            }}</el-descriptions-item>
            <el-descriptions-item label="订单状态">
              <font color="#E8541E">
                {{ tableData.status == 4 ? "未结清" : "已结清" }}
              </font>
            </el-descriptions-item>
            <el-descriptions-item label="出库库存">{{
              tableData.orderType == 1
                ? "进入当前库存数量(我的筐子报失)"
                : tableData.orderType == 2
                ? "进入历史库存数量(我的筐子报失)"
                : tableData.orderType == 3
                ? "客户筐子(当前库存报失)"
                : tableData.orderType == 4
                ? "我的自购筐子-进当前库存(当前库存报失)"
                : ""
            }}</el-descriptions-item>
            <el-descriptions-item label="订单金额"
              >{{
                moneyFormatTwo(tableData.orderTotalPrice)
              }}元</el-descriptions-item
            >
            <!-- 未结清（添加过收款） -->
            <el-descriptions-item
              v-if="tableData.actualPayPrice > 0 && tableData.status == 4"
              label="已收金额"
            >
              {{
                moneyFormatTwo(tableData.actualPayPrice)
              }}元</el-descriptions-item
            >
            <!-- 未结清（添加过收款）-->
            <el-descriptions-item
              v-if="tableData.actualPayPrice > 0 && tableData.status == 4"
              label="剩余未收"
            >
              {{ moneyFormatTwo(tableData.receive) }}元</el-descriptions-item
            >
            <el-descriptions-item label="成交时间">{{
              tableData.confirmTimestamp | parseTime
            }}</el-descriptions-item>
          </el-descriptions>

          <!-- 按钮 -->
          <!-- 未结清（未添加收款） -->
          <div
            class="type1-button"
            v-if="tableData.actualPayPrice == 0 && tableData.status == 4"
          >
            <el-button size="small" type="primary">添加收款</el-button>
          </div>
          <!-- 未结清（添加过收款） -->
          <div
            class="type-button"
            v-if="tableData.actualPayPrice > 0 && tableData.status == 4"
          >
            <div>
              <span class="type-button-left">收款记录</span>
            </div>
            <div>
              <el-button size="small" type="primary">添加收款</el-button>
            </div>
          </div>
          <!-- 已结清 -->
          <div class="type-button" v-if="tableData.status == 5">
            <div>
              <span class="type-button-left">收款记录</span>
            </div>
          </div>
        </div>

        <div
          style="
            border-top: 1px solid #e9e9e9;
            padding: 10px 0px 0px;
            margin-top: 20px;
          "
        >
          <el-descriptions title="客户信息" style="margin-top: 12px">
            <el-descriptions-item label="客户姓名">
              {{ tableData.fromUserName }}
              <el-image :src="urlfei" class="img-icon"></el-image>
            </el-descriptions-item>
            <el-descriptions-item label="联系电话">{{
              tableData.fromUserPhone
            }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div style="margin-top: 18px">
          <!-- <div
            style="
            font-size: 16px;
            color: rgba(1, 6, 33, 0.9);
            font-weight: 600;
            margin-bottom: 16px;
          "
          >筐子信息</div>-->
          <el-descriptions title="筐子信息">
            <el-descriptions-item label="筐子种类"
              >【{{ modelList.name }}】{{ modelList.basketName }}
            </el-descriptions-item>
          </el-descriptions>
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
                  <span v-if="item.prop == 'basketTotalPrice'">{{
                    moneyFormatTwo(scope.row[item.prop])
                  }}</span>
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
          <div v-if="remark.length == 0">无</div>
          <div
            v-for="(remarkitem, remarkindex) in remark"
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
import { orderBasketScrapDetails } from "@/request/api/frameManage/basketInOut";
export default {
  name: "scrapOrder",
  data() {
    return {
      modelList: {},
      remark: [],
      urlfei: require("@/assets/image/imgs/fei-icon.png"),
      typeView: "", // 判断当前是哪种筐子类型
      orderId: this.$route.query.orderId,
      tableDataList: [],
      tableData: {},
      columns: [
        {
          // width: 200,
          prop: "basketColor",
          label: "报废颜色",
        },
        {
          // width: 200,
          prop: "basketCount",
          label: "报废数量(个)",
        },
        {
          // width: 200,
          prop: "basketTotalPrice",
          label: "残余价值(元)",
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
      orderBasketScrapDetails({
        orderId: this.orderId,
      }).then((res) => {
        if (res.status == 200) {
          this.tableData = res.data[0];
          this.modelList = this.tableData.modelList[0];
          if (res.data[0].modelList.length > 0) {
            let tableData = [];
            let data1 = res.data[0].modelList;
            for (let i = 0; i < data1.length; i++) {
              const el = data1[i];
              if (el.basketCount.length > 0) {
                let data2 = el.basketCount;
                for (let j = 0; j < data2.length; j++) {
                  const el1 = data2[j];
                  tableData.push({
                    isCol: j == 0 ? el.basketCount.length : null,
                    ...el,
                    basketCount: el1.basketCount, // 报废数量
                    basketColor: el1.basketColor, // 报废颜色
                    basketTotalPrice: el1.basketTotalPrice, // 残余价值
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
            "总计" +
            "</span>";
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