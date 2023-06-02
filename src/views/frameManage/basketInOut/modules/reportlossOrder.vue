<template>
  <!-- 报失单详情 -->
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
              <div class="ordermsg">
                <span class="ordersize">操作人：</span>
                <span class="ordersize">{{ tableData.addByUserName }}</span>
              </div>
            </template>
            <el-descriptions-item label="订单编号">{{
              tableData.orderNo
            }}</el-descriptions-item>
            <el-descriptions-item label="报失时间">{{
              tableData.timestamp | parseTime
            }}</el-descriptions-item>
          </el-descriptions>
        </div>
        <div>
          <el-descriptions title="报失库存">
            <el-descriptions-item label="出库库存">
              {{
                tableData.orderType == 1
                  ? "进入当前库存数量(我的筐子报失)"
                  : tableData.orderType == 2
                  ? "进入历史库存数量(我的筐子报失)"
                  : tableData.orderType == 3
                  ? "客户筐子(当前库存报失)"
                  : tableData.orderType == 4
                  ? "我的自购筐子-进当前库存(当前库存报失)"
                  : ""
              }}
            </el-descriptions-item>
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
              >【{{ modelList.name }}】{{
                modelList.basketName
              }}</el-descriptions-item
            >
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
                :min-width="item.minWidth"
                :align="item.align"
                :header-align="item.align"
              ></u-table-column>
            </u-table>
          </div>
        </div>
        <div style="margin-top: 20px">
          <el-descriptions
            title="备注"
            :column="1"
            :colon="false"
            v-if="tableData.remark != ''"
          >
            <el-descriptions-item label="">{{
              tableData.timestamp | parseTime
            }}</el-descriptions-item>
            <el-descriptions-item label="">{{
              tableData.addByUserName + ":" + tableData.remark
            }}</el-descriptions-item>
          </el-descriptions>
          <el-descriptions
            title="备注"
            :column="1"
            :colon="false"
            v-if="tableData.remark == ''"
          >
            <el-descriptions-item label="">无</el-descriptions-item>
          </el-descriptions>
        </div>
      </el-scrollbar>
    </div>
  </PageNoScroll>
</template>

<script>
import { overflowDetails } from "@/request/api/frameManage/basketInOut";
export default {
  name: "reportlossOrder",
  data() {
    return {
      modelList: {},
      typeView: "", // 判断当前是哪种筐子类型
      orderId: "",
      tableDataList: [],
      tableData: {},
      type: 1,
      typeViews: Object.freeze({
        reportlossOrder: 1,
        overflowOrder: 2,
      }),
      columns: [
        {
          prop: "basketColor",
          label: "报失颜色",
          align: "left",
        },
        {
          prop: "basketCount",
          label: "报失数量(个)",
          align: "left",
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
      overflowDetails({
        orderId: this.orderId,
        type: 1,
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
                    basketCount: el1.basketCount, // 报失数量
                    basketColor: el1.basketColor, // 报失颜色
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
        if (column.property == "basketCount") {
          const values = data.map((item) => Number(item[column.property]));
          // 合计
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return (
                  '<span style="color: rgba(1, 6, 33, 0.9);font-size:18px;font-weight: 600;">' +
                  (prev + curr) +
                  "</span>"
                );
                +"</span>";
              } else {
                return (
                  '<span style="color: rgba(1, 6, 33, 0.9);font-size:18px;font-weight: 600;">' +
                  prev +
                  "</span>"
                );
              }
            }, 0);
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
  .note-size {
    font-size: 14px;
    color: rgba(1, 6, 33, 0.75);
    margin-top: 12px;
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