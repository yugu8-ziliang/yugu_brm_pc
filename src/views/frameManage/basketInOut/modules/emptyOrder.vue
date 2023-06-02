<template>
  <!-- 腾空单详情 -->
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
            <el-descriptions-item label="腾空时间">{{
              tableData.timestamp | parseTime
            }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div style="margin-top: 16px">
          <div
            style="
              font-size: 16px;
              color: rgba(1, 6, 33, 0.9);
              font-weight: 600;
              margin-bottom: 16px;
            "
          >
            【{{ tableData.name }}】{{ tableData.basketName }}
          </div>
          <el-descriptions style="margin-top: 12px">
            <el-descriptions-item label="载货商品">{{
              tableData.productName
            }}</el-descriptions-item>
            <el-descriptions-item label="商品产地">{{
              tableData.regionName
            }}</el-descriptions-item>
            <el-descriptions-item label="商品规格">{{
              tableData.spec
            }}</el-descriptions-item>
          </el-descriptions>
        </div>

        <div style="margin-top: 18px">
          <div
            style="
              font-size: 16px;
              color: rgba(1, 6, 33, 0.9);
              font-weight: 600;
              margin-bottom: 16px;
            "
          >
            腾空筐子信息
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
                  <span v-if="item.prop == 'timestamp'">{{
                    scope.row[item.prop] | parseTime
                  }}</span>
                  <span v-else>{{ scope.row[item.prop] }}</span>
                </template>
              </u-table-column>
            </u-table>
          </div>
        </div>

        <div style="display: flex; margin-top: 16px; margin-right: 4px">
          <el-descriptions title="合计" :column="5">
            <el-descriptions-item label="腾空筐子批次数量">{{
              tableDataList.length + "种"
            }}</el-descriptions-item>
            <el-descriptions-item label="腾空筐子">{{
              sumNums + "个"
            }}</el-descriptions-item>
          </el-descriptions>
          <!-- <span
            style="color: rgba(1, 6, 33, 0.9);margin-right:16px;font-weight: 500;">共腾空筐 子{{tableData.basketCount}}个</span>
          <span style="color: rgba(1, 6, 33, 0.65);margin-right:16px;">白色：{{tableData.whitetCount}}个</span>
          <span style="color: rgba(1, 6, 33, 0.65);">彩色：{{tableData.basketCount}}个</span> -->
        </div>

        <div style="margin-top: 24px; border-top: 1px solid #e9e9e9">
          <div class="note-size" style="margin: 16px 0px 15px 0px">
            腾空原因:
          </div>
          <div
            v-for="(item, index) in tableData.remark"
            :key="'remark' + index"
          >
            <div>{{ toDate(item.timestamp) }}</div>
            <div>{{ item.remark }}</div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </PageNoScroll>
</template>

<script>
import moment from "moment";
import { emptyBasketPcDetails } from "@/request/api/frameManage/basketInOut";
export default {
  name: "emptyOrder",
  data() {
    return {
      sumNums: 0,
      // title: "",
      typeView: "", // 判断当前是哪种筐子类型
      orderId: "",
      tableDataList: [],
      tableData: {},
      columns: [
        {
          width: 250,
          prop: "bathName",
          label: "供货方",
        },
        {
          // width: 200,
          prop: "timestamp",
          label: "批次",
        },
        {
          // width: 200,
          prop: "basketColor",
          label: "颜色",
        },
        {
          // width: 200,
          prop: "emptyNumber",
          label: "腾空数量(个)",
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
    toDate(val) {
      return moment(val * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
    getList() {
      emptyBasketPcDetails({
        orderId: this.orderId,
      }).then((res) => {
        if (res.status == 200) {
          this.tableData = res.data[0];
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
                    emptyNumber: el1.emptyNumber, // 腾空数量
                    basketColor: el1.basketColor, // 筐子颜色
                    bathName: el1.bathName, // 入库批次姓名
                    timestamp: el1.timestamp, // 入库时间
                  });
                }
              } else {
                tableData.push(el);
                tableData.push(el);
              }
            }
            this.tableDataList = tableData;
            this.sumNums = 0;
            // this.sumNums += this.tableDataList.map((item)=>{
            //   return Number(item.emptyNumber)
            // })
            for (let i = 0; i < this.tableDataList.length; i++) {
              this.sumNums += this.tableDataList[i].emptyNumber;
            }
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
        if (column.property == "emptyNumber") {
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
            if (column.property == "emptyNumber") {
              sums[index] =
                '<span style="color: #E8541E;font-size:18px;font-weight: 700;">' +
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