<template>
  <!-- 修改前收款记录 -->
  <div class="collectionModificationDialog">
    <el-dialog
      :title="title"
      :visible.sync="isVisiable"
      :close-on-click-modal="false"
      :before-close="close"
      top="100px"
      width="822px"
    >
    <el-scrollbar
          ref="scrollDiv"
          :style="{
            height:500+ 'px',
          }"
        >
      <div style="padding: 8px 0px 10px;border-bottom: 1px solid rgba(233, 233, 233, 1);" v-for="(item,index) in tableData" :key="index">
        <el-row :span="24" style="margin-bottom: 5px">
          <el-col :span="16">
            <div>
              <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                >收款时间：</span
              ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                {{ item.timestamp|parseTime }}
              </span>
            </div>
          </el-col>
          <el-col :span="4">
            <div>
              <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                >操作人：</span
              ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                {{ item.addByUserName }}
              </span>
            </div>
          </el-col>
        </el-row>
        <el-row :span="24" style="margin-bottom: 5px">
          <el-col :span="16">
            <div>
              <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                >已确认金额：</span
              ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                {{ item.getPrice }}
              </span>
            </div>
          </el-col>
        </el-row>
        <el-row :span="24" style="margin-bottom: 5px">
          <el-col :span="8">
            <div>
              <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                >实际收款：</span
              ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                {{ item.payInfo.lakalaCollection }}
              </span>
            </div>
          </el-col>
          <el-col :span="4">
            <div>
              <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                >线下收款：</span
              ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                {{ payInfoLoc(item.payInfo) }}元
              </span>
            </div>
          </el-col>
        </el-row>
      </div>
      </el-scrollbar>
    </el-dialog>
  </div>
</template>

<script>
import { paymentRecordHistory } from "@/request/api/collectionRecord/index";
export default {
  name: "collectionModificationDialog",
  data() {
    return {
      title: "",
      isVisiable: false,
      model: {},
      tableData: [],
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
        editById: this.model.editById,
      };
      paymentRecordHistory(param).then((res) => {
        this.tableData = res.data;
      });
    },
    payInfoLoc(item) {
      let param = [];
      if (item.cash) {
        param.push("现金：" + item.cash);
      } else if (item.bank) {
        param.push("银行卡：" + item.bank);
      } else if (item.aliPay) {
        param.push("支付宝：" + item.aliPay);
      } else if (item.weChat) {
        param.push("微信：" + item.weChat);
      }
      return param.toString();
    },
    // 关闭事件
    close(val) {
      this.loading = false;
      this.isVisiable = false;
      this.model = {};
      this.tableData=[]
    },
  },
};
</script>

<style scoped lang="scss">
.collectionModificationDialog {
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
.collectionModificationDialog {
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

  .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>