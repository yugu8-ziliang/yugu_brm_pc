<template>
  <!-- 拒绝收款弹框 -->
  <div class="paymentDetaildiaDialog">
    <el-dialog
      :title="title"
      :visible.sync="isVisiable"
      :close-on-click-modal="false"
      :before-close="close"
      top="30vh"
      width="450px"
    >
      <div class="marginform">
        <el-form
          ref="form"
          :model="form"
          :rules="rules"
          label-width="100px"
          label-position="right"
        >
          <el-form-item
            label="拒绝原因："
            prop="typeName"
            v-if="this.model.type == 0"
          >
            <el-select
              v-model="form.typeName"
              placeholder="请选择拒绝原因"
              style="width: 100%"
            >
              <el-option label="未收到款项" value="未收到款项" />
              <el-option label="金额填写有误" value="金额填写有误" />
              <el-option label="支付凭证上传错误" value="支付凭证上传错误" />
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" prop="remark">
            <el-input
              v-model="form.remark"
              placeholder="请输入备注"
              type="textarea"
              :rows="2"
            >
            </el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="paymentDetaildiaBottom">
        <el-button style="margin-right: 10px" @click="close">取 消</el-button>
        <el-button type="primary" style="margin-right: 10px" @click="handleAdd"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { refusedOrder } from "@/request/api/financialManage/index";
export default {
  name: "paymentDetaildia",
  data() {
    return {
      loading: false,
      title: "",
      isVisiable: false,
      disableSubmit: false,
      model: {},
      form: {},
      rules: {
        typeName: [
          { required: true, message: "请选择拒绝原因", trigger: "change" },
        ],
        remark: [{ required: true, message: "请输入备注", trigger: "change" }],
      },
    };
  },
  methods: {
    add() {},
    edit(record) {
      this.loading = true;
      this.model = Object.assign({}, this.model, record);
    },
    // 提交数据
    handleAdd() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          let param = {
            orderPayId: this.model.orderPayId,
            type: this.model.type,
            remark: {
              typeName: this.form.typeName,
              remark: this.form.remark,
            },
          };
          refusedOrder(param).then((res) => {
            if (res.status == 200) {
              this.$msgbox({
                type: "success",
                title: "提示",
                message: "操作成功，等待跳转",
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
      this.form = {};
    },
  },
};
</script>

<style scoped lang="scss">
.paymentDetaildiaDialog {
  .marginform {
    padding: 10px;
  }

  .paymentDetaildiaBottom {
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
.paymentDetaildiaDialog {
  .el-dialog__body {
    padding: 0px 0px;
  }
}
</style>