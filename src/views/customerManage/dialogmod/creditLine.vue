<template>
  <!-- 赊账授信 -->
  <div class="creditLineDialog">
    <el-dialog :title="title" :visible.sync="isVisiable" :close-on-click-modal="false" :before-close="close" top="50px"
      width="450px">
      <div class="marginform">
        <div class="creditLinMainC">
          <el-form ref="form" label-position="top" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="赊账授信总金额(元)" prop="creditTotalAmount" :required="true">
              <el-input v-model="form.creditTotalAmount"></el-input>
            </el-form-item>
            <el-form-item label="单授信金额(元)" prop="creditOneAmount" :required="true">
              <el-input v-model="form.creditOneAmount"></el-input>
            </el-form-item>
            <el-form-item label="单笔授信账期(天)" prop="creditOneLimit">
              <el-input v-model="form.creditOneLimit"></el-input>
            </el-form-item>
            <el-form-item label="">
              <el-button @click="handleSteDate(15)">15天</el-button>
              <el-button style="margin-left:20px;" @click="handleSteDate(30)">30天</el-button>
              <el-button style="margin-left:20px;" @click="handleSteDate(90)">90天</el-button>
            </el-form-item>

          </el-form>
        </div>

      </div>
      <div class="creditLineBottom">
        <el-button style="margin-right: 10px" @click="close">取消</el-button>
        <el-button type="primary" style="margin-right: 10px" @click="handleAdd">保 存</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {
    userCreditSet
  } from "@/request/api/customerManage/customer"

  export default {
    name: "creditLine",
    data() {
      var validateCreditTotalAmount = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入赊账总金额'));
        }

        if (this.form.creditOneAmount) {
          this.$refs.form.validateField('creditOneAmount', Error => {
            if (Error) {
              return false;
            }
          });
        }
        callback();
      };

      var validateCreditOneAmount = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入单授信金额'));
        }

        if (Number(value) >= Number(this.form.creditTotalAmount)) {
          return callback(new Error('单授信金额不可大于赊账授信总金额'));
        }
        callback();
      };
      return {
        loading: false,
        title: "赊账授信",
        isVisiable: false,
        disableSubmit: false,
        model: {},
        form: {
          "customerId": "", // 客户id
          "creditTotalAmount": null, //  赊账总额度, 传0时为取消授信
          "creditOneAmount": null, //  单笔赊账额度
          "creditOneLimit": null // 单笔账期
        },
        rules: {
          creditTotalAmount: [{
            validator: validateCreditTotalAmount,
            trigger: ["blur", "change"]
          }],
          creditOneAmount: [{
            validator: validateCreditOneAmount,
            trigger: ["blur", "change"]
          }],
          creditOneLimit: [{
            required: true,
            message: '请输入单笔授信账期',
            trigger: 'change'
          }, ],
        }
      };
    },

    methods: {
      add() {},
      edit(record) {
        this.loading = true;
        this.model = Object.assign({}, this.model, record);
      },
      handleSteDate(val) {
        this.form.creditOneLimit = val
      },
      // 提交数据
      handleAdd() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.form.customerId = this.model.custmorId
            userCreditSet(this.form).then(res => {
              if(res.status==200){
                this.$message.success(res.msg)
                this.close()
              }
            })
          }
        });

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
        this.form = {
          "customerId": "", // 客户id
          "creditTotalAmount": null, //  赊账总额度, 传0时为取消授信
          "creditOneAmount": null, //  单笔赊账额度
          "creditOneLimit": null // 单笔账期
        }
      },
    },
  };
</script>

<style scoped lang="scss">
  .creditLineDialog {
    .marginform {
      padding: 10px;

      .creditLinMainC {
        width: 60%;
        margin: auto;
      }
    }

    .creditLineBottom {
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
  .creditLineDialog {
    .el-dialog__body {
      padding: 0px 0px;
    }

    .el-form-item__label {
      line-height: 0px;
    }
  }
</style>