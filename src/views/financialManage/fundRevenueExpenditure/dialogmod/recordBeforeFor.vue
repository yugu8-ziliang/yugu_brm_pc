<template>
  <!-- 更改前记录 已收款-->
  <div class="recordBeforeForDialog">
    <el-dialog
      :title="title"
      :visible.sync="isVisiable"
      :close-on-click-modal="false"
      :before-close="close"
      top="50px"
      width="600px"
    >
      <div class="marginform">
        <el-scrollbar
          :style="{ height: $store.getters.screenHeight - 500 + 'px' }"
        >
          <div
            v-for="(item, index) in tableDataList"
            :key="index"
            style="
              padding: 15px 20px;
              border-bottom: 1px solid rgba(233, 233, 233, 1);
            "
          >
            <div
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 16px;
                font-weight: 700;
                margin-bottom: 20px;
              "
            >
              总金额：{{ item.totalPrice | intervalFormat(false) }}元
            </div>

            <div
              style="
                color: rgba(1, 6, 33, 0.75);
                font-size: 14px;
                margin-bottom: 20px;
              "
              v-if="item.payPrice"
            >
              线下支付：{{ item.payPrice | intervalFormat(false) }}元 （<span
                v-if="item.payInfo.cash"
                >现金：{{ item.payInfo.cash | intervalFormat(false) }}元，</span
              ><span v-if="item.payInfo.weChat"
                >微信：{{
                  item.payInfo.weChat | intervalFormat(false)
                }}元，</span
              ><span v-if="item.payInfo.aliPay"
                >支付宝：{{
                  item.payInfo.aliPay | intervalFormat(false)
                }}元，</span
              ><span v-if="item.payInfo.bank"
                >银行卡：{{ item.payInfo.bank | intervalFormat(false) }}元</span
              >）
            </div>
            <div
              style="
                color: rgba(1, 6, 33, 0.75);
                font-size: 14px;
                margin-bottom: 20px;
              "
              class="flex_dom"
            >
              收款凭证：
              <div v-if="item.imageList.length > 0">
                <el-image
                  v-for="(item, index) in item.imageList"
                  :key="index"
                  :style="{
                    width: '100px',
                    height: '100px',
                    border: '1px dashed #d9d9d9',
                    'margin-left': index == 0 ? '' : '20px',
                  }"
                  class="flex_dom flex_item_center flex_item_mid"
                  :src="item"
                  :preview-src-list="item.imageList"
                  fit="fill"
                >
                  <div slot="error">
                    <i
                      class="el-icon-picture-outline"
                      style="font-size: 35px; color: #909399"
                    ></i></div
                ></el-image>
              </div>
              <div v-else>
                <el-image
                  :style="{
                    width: '100px',
                    height: '100px',
                    border: '1px dashed #d9d9d9',
                  }"
                  class="flex_dom flex_item_center flex_item_mid"
                  src=" "
                  fit="fill"
                >
                  <div slot="error">
                    <i
                      class="el-icon-picture-outline"
                      style="font-size: 35px; color: #909399"
                    ></i></div
                ></el-image>
              </div>
            </div>
            <div
              style="
                color: rgba(1, 6, 33, 0.75);
                font-size: 14px;
                margin-bottom: 20px;
              "
              v-if="item.comeInPrice"
            >
              经营往来款抵充：{{ item.comeInPrice | intervalFormat(false) }}元
            </div>
            <div
              style="
                color: rgba(1, 6, 33, 0.75);
                font-size: 14px;
                margin-bottom: 20px;
              "
              v-if="item.confirmPrice"
            >
              抵扣金额：{{ item.confirmPrice | intervalFormat(false) }}元
              （<span v-if="item.borrowPrice"
                >借款抵扣：{{
                  item.borrowPrice | intervalFormat(false)
                }}元，</span
              ><span v-if="item.advancePrice"
                >预付款抵扣：{{
                  item.advancePrice | intervalFormat(false)
                }}元，</span
              ><span v-if="item.transferOtherPrice"
                >转账其他抵扣：{{
                  item.transferOtherPrice | intervalFormat(false)
                }}元</span
              >）
            </div>
            <div
              style="
                color: rgba(1, 6, 33, 0.75);
                font-size: 14px;
                margin-bottom: 20px;
              "
              class="flex_dom"
            >
              <div style="width: 300px">
                支付时间：{{ item.timestamp | parseTime() }}
              </div>
              <div>操作人：{{ item.addByUserName }}</div>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "recordBeforeForFor",
  data() {
    return {
      loading: false,
      title: "",
      isVisiable: false,
      disableSubmit: false,
      tableDataList: [],
    };
  },
  methods: {
    add() {},
    edit(record) {
      this.loading = true;
      this.tableDataList = record;
    },
    // 提交数据
    handleAdd() {},
    // 关闭事件
    close(val) {
      if (!val) {
        this.$emit("close");
      }

      this.loading = false;
      this.isVisiable = false;
      this.disableSubmit = false;
      this.tableDataList = [];
    },
  },
};
</script>

<style scoped lang="scss">
.recordBeforeForDialog {
  .marginform {
    padding: 10px;
    #payPwd .pwd-wrap {
      width: 90%;
      height: 44px;
      padding-bottom: 1px;
      margin: 0 auto;
      background: #fff;
      display: flex;
      display: -webkit-box;
      display: -webkit-flex;
      cursor: pointer;
    }
    .pwd-wrap li {
      list-style-type: none;
      text-align: center;
      line-height: 44px;
      -webkit-box-flex: 1;
      flex: 1;
      -webkit-flex: 1;
      margin: 0px 10px;
      border: 1px solid rgba(217, 217, 217, 1);
      border-radius: 4px;

      &.isActive {
        border: 1px solid var(--color-primary);
      }
    }

    .pwd-wrap li i {
      height: 10px;
      width: 10px;
      border-radius: 50%;
      background: #000;
      display: inline-block;
    }
  }

  .recordBeforeForBottom {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid rgba(1, 6, 33, 0.06);
    padding: 10px;
  }
}

.drawer-bootom-button {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>

<style lang="scss">
.recordBeforeForDialog {
  .el-dialog__body {
    padding: 0px 0px;
  }

  .el-form-item__label {
    line-height: 0px;
  }
}
</style>