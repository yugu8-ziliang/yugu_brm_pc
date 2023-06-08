<template>
  <div class="container">
    <div class="container-header">
      <div class="container-header__title">
        {{ title || activeRouteName }}
      </div>
      <div class="container-header__actions">
        <!-- 刷新 -->
        <div class="actions-item">
          <el-button v-show="refreshVisible" size="mini" icon="el-icon-refresh-right"
            @click="handleRefresh">刷新</el-button>
        </div>
        <!-- 返回 -->
        <div class="actions-item">
          <el-button v-show="backVisible" size="mini" icon="el-icon-arrow-left" @click="handleBack">返回</el-button>
        </div>
      </div>
    </div>
    <div class="container-main" :class="{ 'with-footer': footer }">
      <slot name="default"></slot>
    </div>
    <div v-if="footer" class="container-footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "Container",
  props: {
    title: {
      type: String,
      required: false,
    },
    footer: {
      type: Boolean,
      required: false,
    },
    refreshVisible: {
      type: Boolean,
      required: false,
    },
    backVisible: {
      type: Boolean,
      required: false,
    },
  },
  computed: {
    // 路由标题 对应菜单名
    activeRouteName() {
      return this.$route.meta.title;
    },
  },
  methods: {
    handleRefresh() {
      this.$emit("refresh");
    },
    handleBack() {
      this.$emit("back");
    },
  },
};
</script>

<style lang="scss" scoped>
$headerTop: 112px;
$headerHeight: 56px;
$footerHieght: 52px;

// @include DEBUG();
.container {
  margin: 0 24px 0 5px;

  .container-header {
    display: flex;
    justify-content: space-between;
    margin: 18px 0 10px;

    .container-header__title {
      font-size: 20px;
      font-family: PingFangSC-, PingFang SC;
      font-weight: 500;
      color: rgba(1, 6, 33, 0.9);
      line-height: 28px;
    }

    .container-header__actions {
      display: flex;
      justify-content: flex-start;

      .actions-item:not(:last-of-type) {
        margin-right: 16px;
      }
    }
  }

  .container-main {
    background-color: #fff;
    height: calc(100vh - #{$headerTop} - #{$headerHeight});
    overflow-x: hidden;
    overflow-y: scroll;
    padding: 16px 24px 0;
    box-sizing: border-box;
  }

  .container-main.with-footer {
    height: calc(100vh - #{$headerTop} - #{$footerHieght} - #{$headerHeight});
  }

  .container-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 52px;
    background-color: #fff;
    border-top: 1px solid #e9e9e9;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 24px;
    box-sizing: border-box;
    z-index: 9;
  }
}
</style>