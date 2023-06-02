<template>
  <!-- 向上开需求单 -->
  <div class="creditLineDialog">
    <el-dialog :title="title" :visible.sync="isVisiable" :close-on-click-modal="false" :before-close="close" top="50px"
      width="450px">
      <div class="marginform">
        <div class="creditLinMainC">
          <el-form ref="form" label-position="top" :model="form" :rules="rules" label-width="80px">
            <el-form-item label="客户姓名" prop="creditTotalAmount" >
              <el-input v-model="form.creditTotalAmount"></el-input>
            </el-form-item>
            <el-form-item label="客户电话" prop="creditOneAmount" >
              <el-input v-model="form.creditOneAmount"></el-input>
            </el-form-item>

          </el-form>
        </div>

      </div>
      <div class="creditLineBottom">
        <el-button style="margin-right: 10px" @click="close">取消</el-button>
        <el-button type="primary" style="margin-right: 10px" @click="handleAdd">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

  export default {
    name: "creditLine",
    data() {
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