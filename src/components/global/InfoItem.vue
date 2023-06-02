<template>
  <div class="info-item">
    <div class="info-item__title">{{ title }}</div>
    <div class="info-item__content">{{ content }}</div>
  </div>
</template>

<script>
export default {
  name: "InfoItem",
  props: {
    title: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.info-item {
  text-align: left;
  .info-item__title {
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(1, 6, 33, 0.9);
    line-height: 22px;
    margin-bottom: 2px;
  }
  .info-item__content {
    font-size: 24px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: rgba(1, 6, 33, 0.9);
    line-height: 32px;
  }
}
</style>