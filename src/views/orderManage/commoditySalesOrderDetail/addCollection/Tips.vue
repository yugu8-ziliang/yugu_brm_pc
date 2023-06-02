<template>
  <el-dialog
    title="说明"
    :visible.sync="modelVisible"
    :close-on-click-modal="false"
    custom-class="add-collection-tips-dialog"
    top="15vh"
    width="640px"
  >
    <section style="margin-bottom: 20px">
      <p class="medium red font-18">经营往来款抵充：</p>
      <p class="medium red font-16">
        是指双方在经营过程中的未收款、未付款相互抵充后显示的金额，通过勾选且经双方确认后将该部分未收款、未付款的单子作为抵充平账处理，说明如下：
      </p>
    </section>
    <section style="line-height: 26px" class="red regular font-14">
      <p>1、在途未确认订单使用经营往来款抵充时，按钮不可勾选</p>
      <p>
        2、双方订单已全部结清，经营往来款抵充显示金额为0元或正值时，按钮不可勾选
      </p>
      <p>3、双方订单已全部结清，经营往来款抵充显示金额为负值时，按钮可勾选</p>
      <p>
        4、双方有未收款、未付款订单经抵充后显示金额为0元、正值、负值时，按钮可勾选
      </p>
      <p>5、未收款（商品/筐子）：销售款、退款、记账未收款、已付超付款</p>
      <p>6、未付款（商品/筐子）：采购款、退款、记账未付款、已收超收款</p>
      <p>7、正值（例0.01元）：客户欠我的金额</p>
      <p>8、负值（例-0.01元）：我欠客户的金额</p>
    </section>
    <section style="margin-bottom: 20px; margin-top: 10px">
      <p class="medium black font-18">借款、预付款、转账其他款项抵扣：</p>
      <p class="medium black font-16">
        是指双方在经营过程中的借款、预付款、转账其他经抵扣使用后显示的剩余可用金额，说明如下：
      </p>
    </section>
    <section class="regular black font-14">
      <p>1、已收抵扣款项有可用金额的，可勾选抵扣</p>
      <p>2、在途未确认订单使用已收抵扣款项时，该抵扣款项显示剩余可抵扣金额</p>
      <p>3、抵扣款项按勾选顺序抵扣，先勾选的款项类型先抵扣</p>
    </section>
    <template #footer>
      <el-button type="primary" @click="ok">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, inject } from "vue";

const $baseMessage = inject("$baseMessage");

console.log("inject key=>", key);

const modelVisible = ref(false);

/**
 * @description: 打开弹框
 */
const show = () => (modelVisible.value = true);
/**
 * @description: 确认
 */
const ok = () => $baseMessage("测试", "success", "hey-success"); // (modelVisible.value = false);

defineExpose({
  show,
});
</script>

<style lang="scss">
.add-collection-tips-dialog {
  .el-dialog__body {
    padding-top: 16px;
    line-height: 26px;
  }
  .font-18 {
    font-size: 18px;
  }
  .font-16 {
    font-size: 16px;
  }
  .font-14 {
    font-size: 14px;
  }
  .medium {
    font-family: PingFang SC-Medium;
  }
  .regular {
    font-family: PingFang SC-Regular;
  }
  .red {
    color: #dd4c4d;
  }
  .black {
    color: rgba(1, 6, 33, 0.75);
  }
}
</style>