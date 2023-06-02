<template>
  <!-- 收款详情 待收款-->
  <PageNoScroll @hanleRefresh="hanleRefresh" class="paymentDetailModel">
    <div
      style="
        color: rgba(1, 6, 33, 0.9);
        font-size: 24px;
        border-bottom: 1px solid #e9e9e9;
        padding-bottom: 20px;
      "
    >
      待收款
    </div>
    <el-scrollbar :style="{ height: $store.getters.screenHeight - 280 + 'px' }">
      <div
        style="
          padding: 15px 0px;
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
          总金额：{{ tableDataList.totalPrice | intervalFormat(false) }}元
        </div>
        <div
          style="
            color: rgba(1, 6, 33, 0.75);
            font-size: 14px;
            margin-bottom: 20px;
          "
          v-if="tableDataList.payPrice"
        >
          线下收款：{{ tableDataList.payPrice | intervalFormat(false) }}元
          （<span v-if="tableDataList.payInfo.cash"
            >现金：{{
              tableDataList.payInfo.cash | intervalFormat(false)
            }}元，</span
          ><span v-if="tableDataList.payInfo.weChat"
            >微信：{{
              tableDataList.payInfo.weChat | intervalFormat(false)
            }}元，</span
          ><span v-if="tableDataList.payInfo.aliPay"
            >支付宝：{{
              tableDataList.payInfo.aliPay | intervalFormat(false)
            }}元，</span
          ><span v-if="tableDataList.payInfo.bank"
            >银行卡：{{
              tableDataList.payInfo.bank | intervalFormat(false)
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
          收款凭证：
          <div v-if="tableDataList.imageList.length > 0">
            <el-image
              v-for="(item, index) in tableDataList.imageList"
              :key="index"
              :style="{
                width: '100px',
                height: '100px',
                border: '1px dashed #d9d9d9',
                'margin-left': index == 0 ? '' : '20px',
              }"
              class="flex_dom flex_item_center flex_item_mid"
              :src="item"
              :preview-src-list="tableDataList.imageList"
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
          v-if="tableDataList.comeInPrice"
        >
          经营往来款抵充：{{
            tableDataList.comeInPrice | intervalFormat(false)
          }}元
        </div>
        <div
          style="
            color: rgba(1, 6, 33, 0.75);
            font-size: 14px;
            margin-bottom: 20px;
          "
          v-if="tableDataList.confirmPrice"
        >
          抵扣金额：{{ tableDataList.confirmPrice | intervalFormat(false) }}元
          （<span v-if="tableDataList.borrowPrice"
            >借款抵扣：{{
              tableDataList.borrowPrice | intervalFormat(false)
            }}元，</span
          ><span v-if="tableDataList.advancePrice"
            >预付款抵扣：{{
              tableDataList.advancePrice | intervalFormat(false)
            }}元，</span
          ><span v-if="tableDataList.transferOtherPrice"
            >转账其他抵扣：{{
              tableDataList.transferOtherPrice | intervalFormat(false)
            }}元</span
          >）
        </div>

        <div
          style="
            color: rgba(1, 6, 33, 0.75);
            font-size: 14px;
            margin-bottom: 20px;
          "
        >
          支付时间：{{ tableDataList.timestamp | parseTime() }}
        </div>
        <div></div>
      </div>
      <div
        style="
          padding: 15px 0px 32px;
          border-bottom: 1px solid rgba(233, 233, 233, 1);
        "
        class="flex_dom"
        v-for="(item, index) in tableDataList.modelList"
        :key="index"
      >
        <div style="width: 300px">
          <div
            style="
              color: rgba(1, 6, 33, 0.75);
              font-size: 14px;
              margin-bottom: 24px;
            "
          >
            {{ handleName(item) }}编号：<span
              style="color: rgba(26, 127, 217, 1)"
              >{{ item.orderMainId }}</span
            >
          </div>
          <div style="color: rgba(1, 6, 33, 0.75); font-size: 14px">
            {{ handleName(item) }}金额：{{
              item.orderTotalPrice | intervalFormat(false)
            }}元
          </div>
        </div>
        <div>
          <div
            style="
              color: rgba(1, 6, 33, 0.75);
              font-size: 14px;
              margin-bottom: 24px;
            "
          >
            {{ handleName(item) }}时间：{{ item.timestamp | parseTime() }}
          </div>
          <div
            style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
            v-if="handleName1(item)"
          >
            {{ handleName1(item) }}：<span
              style="color: rgba(26, 127, 217, 1)"
              >{{ item.relationId }}</span
            >
          </div>
        </div>
      </div>

      <div style="padding: 15px 0px">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          class="login-form"
          :inline="true"
        >
          <div class="flex_dom flex_item_mid">
            收款密码：
            <el-form-item prop="password">
              <el-input
                v-model="form.password"
                placeholder="请输入支付密码"
                clearable
                show-password
                maxlength="6"
                autocomplete="off"
                @blur="passwordBlur"
                @focus="handleSetPayWord"
              >
              </el-input>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-scrollbar>
    <div class="flex_dom flex_row_reverse">
      <el-button type="primary" size="small" @click="handleConfirm"
        >确认</el-button
      >
      <el-button
        style="border: #0ba198 solid 1px; color: #0ba198; margin-right: 10px"
        size="small"
        @click="handleReject"
        >拒绝</el-button
      >
    </div>
    <paymentDetaildia ref="paymentDetaildia"></paymentDetaildia>
    <iSpassWord ref="iSpassWord"></iSpassWord>
  </PageNoScroll>
</template>

<script>
import { checkoutPayPassword } from "@/request/api/login";
import {
  userCollectionDetail,
  agreeCollection,
} from "@/request/api/financialManage/index";
import { Base64 } from "js-base64";
export default {
  components: {
    paymentDetaildia: () => import("./paymentDetaildia.vue"), // 拒绝收款弹框
    iSpassWord: () => import("@/components/iSpassWord.vue"), // 未设置支付密码
  },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入支付密码"));
      } else {
        if (this.form.password.length < 6) {
          callback(new Error("请输入6位密码"));
        }
        callback();
      }
    };
    return {
      form: {
        password: "",
        securityCode: "",
        passwordIs: false,
      },
      rules: {
        password: [{ validator: validatePass, trigger: "blur" }],
      },
      tableData: {},
      tableDataList: {
        imageList: [],
        payInfo: { cash: 0 },
      },
      iSpassWord: false, // 判断是否设置密码
    };
  },
  methods: {
    initData() {
      let { data: data } = this.$route.query;
      // 判断url是否为空
      if (data) {
        // 解析数据
        try {
          let param = JSON.parse(Base64.decode(data));
          console.log(param);
          if (!param.orderNo) {
            this.handleRouter();
            return;
          }
          this.tableData = param;
          this.getList();
        } catch (error) {
          this.handleRouter();
        }
        return;
      }
      this.handleRouter();
    },
    // 跳转
    handleRouter() {
      setTimeout(() => {
        this.$store
          .dispatch("tagsView/delView", {
            path: this.$route.path,
          })
          .then(({ visitedViews }) => {
            this.$router.push({ path: "/financialManage/receivePayment" });
          });
      }, 0);
    },
    getList(arg) {
      let param = {
        orderPayId: this.tableData.orderNo,
        type: 0,
      };
      userCollectionDetail(param).then((res) => {
        if (res.status == 200) {
          this.tableDataList = res.data[0];
        }
      });
    },
    handleName(val) {
      let name = "";
      if (val.type == 1) {
        name = "销售单";
      } else if (val.type == 2) {
        name = "退货退款单";
      } else if (val.type == 3) {
        name = "筐子售出单";
      } else if (val.type == 4) {
        name = "退筐退筐单";
      }
      return name;
    },
    handleName1(val) {
      let name = "";
      if (val.type == 1) {
        name = "";
      } else if (val.type == 2) {
        name = "关联采购单";
      } else if (val.type == 3) {
        name = "";
      } else if (val.type == 4) {
        name = "关联筐子购入单";
      }
      return name;
    },
    // 确认
    handleConfirm() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.passwordIs) {
            this.Confirm();
          } else {
            this.$warning("密码错误");
          }
        }
      });
    },
    // 拒绝
    handleReject() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.passwordIs) {
            this.Reject();
          } else {
            this.$warning("密码错误");
          }
        }
      });
    },
    // 判断是否设置密码
    handleSetPayWord() {
      let paramIs = this.$store.getters.userInfo;
      if (paramIs.isSetPayWord == 0) {
        this.iSpassWord = true;
        this.$refs.iSpassWord.edit();
      }
    },
    passwordBlur() {
      if (this.form.password.length == 6) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let param = {
              passWord: this.form.password,
              useType: 3,
            };
            checkoutPayPassword(param).then((res) => {
              if (res.status == 200) {
                if (res.data[0].isSuccess == 1) {
                  this.form.passwordIs = true;
                  this.form.securityCode = res.data[0].securityCode;
                } else {
                  this.form.passwordIs = false;
                  this.$warning("密码错误");
                }
              }
            });
          }
        });
      } else {
        this.form.passwordIs = false;
      }
    },
    Confirm() {
      agreeCollection({
        orderPayId: this.tableData.orderNo,
        securityCode: this.form.securityCode,
      }).then((res1) => {
        if (res1.status == 200) {
          this.$msgbox({
            type: "success",
            title: "提示",
            message: "收款成功，等待跳转",
            showClose: false,
            showCancelButton: false,
            showConfirmButton: false,
          }).then((action) => {});
          setTimeout(() => {
            this.$store
              .dispatch("tagsView/delView", {
                path: this.$route.path,
              })
              .then(({ visitedViews }) => {
                this.$msgbox.close();
                this.$router.push({
                  path: "/financialManage/receivePayment",
                });
              });
          }, 3000);
        }
      });
    },
    Reject() {
      this.$refs.paymentDetaildia.edit({
        orderPayId: this.tableDataList.orderPayId,
        type: this.tableData.typeIs,
      });
      this.$refs.paymentDetaildia.title = "拒绝收款";
      this.$refs.paymentDetaildia.disableSubmit = false;
      this.$refs.paymentDetaildia.isVisiable = true;
    },
    // 刷新
    hanleRefresh() {
      this.getList(1);
    },
  },
  created() {
    this.initData();
  },
};
</script>

<style scoped lang="scss">
.paymentDetailModel {
  .el-form-item {
    margin-bottom: 0px !important;
  }

  ::v-deep .el-scrollbar {
    .el-scrollbar__wrap {
      overflow-x: hidden;
      .el-scrollbar__view {
        min-height: 100%;
        position: relative;
        padding: 0px;
      }
    }
    &.padding-none {
      .el-scrollbar__view {
        padding: 0px;
      }
    }
  }
}
</style>