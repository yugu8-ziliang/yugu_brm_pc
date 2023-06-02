<template>
  <!-- 确认收款 -->
  <div class="confirmedPaidDialog">
    <el-dialog
      :title="title"
      :visible.sync="isVisiable"
      :close-on-click-modal="false"
      :before-close="close"
      top="30vh"
      width="450px"
    >
      <div class="marginform">
        <div id="payPwd">
          <input
            ref="pwd"
            maxlength="6"
            v-model="msg"
            style="position: absolute; z-index: -1; left: -100%; opacity: 0"
          />
          <ul class="pwd-wrap" @click="handleFocus()">
            <li
              v-for="item in 6"
              :key="item"
              :class="[tableIndex == item ? 'isActive' : '']"
            >
              <i v-if="msgLength > item - 1"></i>
            </li>
          </ul>
        </div>
      </div>
      <div class="confirmedPaidBottom">
        <el-button style="margin-right: 10px" @click="close">取 消</el-button>
        <el-button type="primary" style="margin-right: 10px" @click="handleAdd"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { checkoutPayPassword } from "@/request/api/login";
import { agreeCollection } from "@/request/api/financialManage/index";

export default {
  name: "confirmedPaid",
  data() {
    return {
      loading: false,
      title: "",
      isVisiable: false,
      disableSubmit: false,
      msg: "",
      msgLength: 0,
      model: {},
      form: {},
      tableIndex: 1,
    };
  },
  watch: {
    msg(curVal) {
      // if (/[^\d]/g.test(curVal)) {
      //   this.msg = this.msg.replace(/[^\d]/g, "");
      // } else {
      this.msgLength = curVal.length;
      if (curVal.length == 0) {
        this.tableIndex = 1;
      } else {
        this.tableIndex = curVal.length;
      }

      // }
    },
  },
  methods: {
    add() {},
    edit(record) {
      this.loading = true;
      this.model = Object.assign({}, this.model, record);
      setTimeout(() => {
        this.$refs.pwd.focus();
      }, 100);
    },
    handleFocus() {
      this.$refs.pwd.focus();
    },
    // 提交数据
    handleAdd() {
      if (this.msg.length == 6) {
        // 验证密码
        let param = {
          passWord: this.msg,
          useType: 3,
        };
        checkoutPayPassword(param).then((res) => {
          if (res.status == 200) {
            if (res.data[0].isSuccess == 1) {
              agreeCollection({
                orderPayId: this.model.orderNo,
                securityCode: res.data[0].securityCode,
              }).then((res1) => {
                if (res1.status == 200) {
                  this.$success("收款成功");
                }
              });
            } else {
              this.$warning("密码错误");
              this.msg = "";
              this.tableIndex = 1;
              this.$refs.pwd.focus();
            }
          }
        });
      } else {
        this.$warning("请输入密码");
      }
    },
    // 关闭事件
    close(val) {
      if (!val) {
        this.$emit("close");
      }

      this.loading = false;
      this.isVisiable = false;
      this.disableSubmit = false;
      this.model = {};
      this.form = {};
    },
  },
};
</script>

<style scoped lang="scss">
.confirmedPaidDialog {
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

  .confirmedPaidBottom {
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
.confirmedPaidDialog {
  .el-dialog__body {
    padding: 0px 0px;
  }

  .el-form-item__label {
    line-height: 0px;
  }
}
</style>