<template>
  <div class="title-outer">
    <div class="title-btn" v-if="titleShow">
      <div class="title-name">
        <span>{{ title || routeName }}</span>
      </div>
      <div v-if="titleBtn">
        <el-button
          v-if="titleRefresh"
          size="mini"
          icon="el-icon-refresh-right"
          @click="hanleRefresh"
          >刷新</el-button
        >
        <el-button
          v-if="titleBreak"
          size="mini"
          icon="el-icon-arrow-left"
          @click="handleBreak"
          >返回</el-button
        >
      </div>
    </div>

    <div
      class="container-main"
      :style="{
        height: titleShow == false ? '100%' : '',
        background: background,
        padding: paddingNone ? '0px' : padding,
      }"
    >
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "PageNoScroll",
  props: {
    paddingNone: {
      type: Boolean,
      default: false,
    },
    background: {
      type: String,
      default: "#fff",
    },
    padding: {
      type: String,
      default: "15px",
    },
    title: {
      type: String,
      default: "",
    },
    titleShow: {
      type: Boolean,
      default: true,
    },
    titleBtn: {
      type: Boolean,
      default: true,
    },
    titleRefresh: {
      type: Boolean,
      default: true,
    },
    titleBreak: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      routeName: this.$route.meta.title,
    };
  },
  methods: {
    // 刷新
    hanleRefresh() {
      this.$emit("hanleRefresh");
    },
    // 返回上一页面
    handleBreak() {
      this.$emit("handleBreak");
    },
  },
};
</script>

<style lang="scss" scoped>
.title-outer {
  display: flex;
  flex-direction: column;
  height: 100%;
  .title-btn {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0px 0px 10px;
    .title-name {
      font-size: 20px;
      font-family: PingFangSC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(1, 6, 33, 0.9);
      vertical-align: middle;
    }
  }

  .container-main {
    position: relative;
    height: 95%;
  }
}
</style>
