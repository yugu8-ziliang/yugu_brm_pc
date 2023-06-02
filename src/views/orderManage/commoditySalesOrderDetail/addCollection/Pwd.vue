<template>
  <el-dialog
    title="请输入密码"
    top="30vh"
    width="450px"
    custom-class="pwd-input-dialog"
    :visible.sync="modelVisible"
    :close-on-click-modal="false"
    :before-close="close"
  >
    <div id="pwd-input--hidden">
      <input
        ref="pwdInput"
        v-model="pwd"
        v-clickoutside="focus"
        maxlength="6"
        style="position: absolute; z-index: -1; left: -100%; opacity: 0"
      />
      <div class="pwd-box">
        <div
          v-for="item in 6"
          :key="item"
          class="pwd-box__item"
          :class="{
            active: tabIndex === item,
          }"
        >
          <i v-if="pwd.length > item - 1"></i>
        </div>
      </div>
      <div v-show="errorVisible" class="pwd-error">密码错误</div>
    </div>
    <template #footer>
      <el-button style="margin-right: 10px" @click="close">取 消</el-button>
      <el-button
        type="primary"
        style="margin-right: 10px"
        @click="handleOk"
        :disabled="pwd.length < 6"
        >确 定</el-button
      >
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
import { checkoutPayPassword } from "@/request/api/login";

const emit = defineEmits(["succes"]);

const modelVisible = ref(false);
const errorVisible = ref(false);

const pwd = ref("");
const pwdInputRef = ref(null);

const tabIndex = computed(() => {
  const pwdLen = pwd.value.length;
  return pwdLen === 0 ? 1 : pwdLen;
});

const focus = () => {
  nextTick(() => {
    pwdInputRef.value.focus();
  });
};

const show = () => {
  modelVisible.value = true;
  focus();
};

const close = () => {
  pwd.value = "";
  modelVisible.value = false;
};

const handleOk = async () => {
  // 校验密码长度
  // if (this.pwd.length < 6) {
  //   // 提示输入完整密码
  //   this.$warning("请输入完整的六位密码");
  // } else {
  // 验证密码
  const body = {
    passWord: this.pwd,
    useType: 3,
  };
  // 校验密码
  const { status, data } = await checkoutPayPassword(body);
  if (status === 200 && data[0]?.isSuccess === 1) {
    // 发起成功
    emit("succes");
  } else {
    // 提示密码错误
    // this.$warning("密码错误");
    // 展示错误信息
    errorVisible.value = true;
    // 重置
    pwd.value = "";
    // 聚焦
    focus();
    // }
  }
};

defineExpose({
  show,
});
</script>
<style lang="scss">
.pwd-input-dialog {
  .pwd-box {
    width: 90%;
    height: 44px;
    padding-bottom: 1px;
    margin: 0 auto 10px;
    background: #fff;
    display: flex;
    cursor: pointer;

    &__item {
      list-style-type: none;
      text-align: center;
      line-height: 44px;
      -webkit-box-flex: 1;
      flex: 1;
      -webkit-flex: 1;
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

  .pwd-error {
    color: #dd4c4d;
    margin-left: 30.5px;
  }
}
</style>
