<template>
  <div class="title-outer">
    <div class="title-btn" v-if="titleShow">
      <div class="title-name">
        <span>{{ title || routeName }}</span>
      </div>
      <div v-if="titleBtn">
        <el-button
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
      }"
    >
      <el-scrollbar
        style="height: 100%"
        :class="{ 'padding-none': paddingNone }"
      >
        <slot></slot>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
export default {
  name: "Page",
  props: {
    paddingNone: {
      type: Boolean,
      default: false,
    },
    background: {
      type: String,
      default: "#fff",
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
      color: #010621;
      vertical-align: middle;
    }
  }

  .container-main {
    height: 95%;
    ::v-deep .el-scrollbar {
      .el-scrollbar__wrap {
        overflow-x: hidden;
        .el-scrollbar__view {
          min-height: 100%;
          position: relative;
          padding: 15px;
          background-color: #fff;
        }
      }
      &.padding-none {
        .el-scrollbar__view {
          padding: 0px;
        }
      }
    }
  }
}
</style>
