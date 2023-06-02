<template>
  <el-dialog
    title="提示"
    top="30vh"
    width="450px"
    custom-class="code-input-dialog"
    :visible.sync="modelVisible"
    :close-on-click-modal="false"
    :before-close="close"
  >
    <div class="code-title">
      收款码已通过app内消息发送至买家账户 请正确填写收款码（买家提供）
    </div>
    <div id="code-input--hidden">
      <input
        ref="codeInputRef"
        v-model="code"
        v-clickoutside="focus"
        maxlength="4"
        style="position: absolute; z-index: -1; left: -100%; opacity: 0"
      />
      <div class="code-box">
        <div
          v-for="item in 4"
          :key="item"
          class="code-box__item"
          :class="{
            active: tabIndex === item,
          }"
        >
          <i v-if="code.length > item - 1"></i>
        </div>
      </div>
    </div>
    <template #footer>
      <el-button
        type="primary"
        style="margin-right: 10px"
        @click="handleOk"
        :disabled="code.length < 4"
        >确 定</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";

const emit = defineEmits(["success"]);

const modelVisible = ref(false);

const code = ref("");
const codeInputRef = ref(null);

const tabIndex = computed(() => {
  const codeLen = code.value.length;
  return codeLen === 0 ? 1 : codeLen;
});

const focus = () => {
  nextTick(() => {
    codeInputRef.value.focus();
  });
};

const show = () => {
  modelVisible.value = true;
  focus();
};

const close = () => {
  code.value = "";
  modelVisible.value = false;
};

const handleOk = async () => {
  // 发起成功
  emit("success", { code: code.value });
};

defineExpose({
  show,
});
</script>
<style lang="scss">
.code-input-dialog {
  .el-dialog__body {
    padding-top: 0;
  }
  .code-title {
    font-size: 16px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: normal;
    color: rgba(1, 6, 33, 0.9);
    margin-bottom: 20px;
  }
  .code-box {
    width: 80%;
    height: 44px;
    padding-bottom: 1px;
    background: #fff;
    display: flex;
    justify-content: center;
    cursor: pointer;
    margin: 0 auto;

    &__item {
      width: 44px;
      height: 44px;
      list-style-type: none;
      text-align: center;
      line-height: 44px;
      -webkit-box-flex: 1;
      flex: 1;
      margin: 0px 10px;
      border: 1px solid rgba(217, 217, 217, 1);
      border-radius: 4px;

      i {
        height: 10px;
        width: 10px;
        border-radius: 50%;
        background: #000;
        display: inline-block;
      }
    }
    &__item.active {
      border: 1px solid var(--color-primary);
    }
  }
}
</style>
