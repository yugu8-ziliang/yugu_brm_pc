<template>
  <div class="container">
    <div class="container-header">
      <div class="container-header__title">
        {{ title || activeRouteName }}
      </div>
      <div class="container-header__actions">
        <!-- 刷新 -->
        <div class="actions-item">
          <el-button
            v-show="refreshVisible"
            size="mini"
            icon="el-icon-refresh-right"
            @click="handleRefresh"
            >刷新</el-button
          >
        </div>
        <!-- 返回 -->
        <div class="actions-item">
          <el-button
            v-show="backVisible"
            size="mini"
            icon="el-icon-arrow-left"
            @click="handleBack"
            >返回</el-button
          >
        </div>
      </div>
    </div>
    <div class="container-main">
      <!-- <div class="container-main__table">
        <slot></slot>
      </div> -->
      <slot></slot>
      <div class="container-main__pagination" v-if="total > 0">
        <el-pagination
          :page-sizes="[10, 20, 50, 100]"
          :page-size="limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          background
          :current-page.sync="currentPage"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        ></el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "TableContainer",
  data() {
    return { routeName: this.$route.meta.title };
  },
  props: {
    pageSize: {
      type: Number,
      default: 20,
    },
    total: {
      type: Number,
      default: 0,
    },
    pageNum: {
      type: Number,
      default: 1,
    },
    background: {
      type: String,
      default: "#fff",
    },
    paddingNone: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: "",
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
    currentPage: {
      get() {
        return this.pageNum;
      },
      set(val) {
        this.$emit("update:pageNum", val);
      },
    },
    limit: {
      get() {
        return this.pageSize;
      },
      set(val) {
        this.$emit("update:pageSize", val);
      },
    },
  },
  methods: {
    handleSizeChange(val) {
      this.$emit("pagination", {
        pageNum: this.currentPage,
        pageSize: val,
      });
    },
    handleCurrentChange(val) {
      this.$emit("pagination", { pageNum: val, pageSize: this.limit });
    },
    // 刷新
    hanleRefresh() {
      this.$emit("hanleRefresh");
    },
    // 返回上一页面
    handleBreak() {
      this.$router.go(-1);
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
      font-family: PingFangSC-Medium, PingFang SC;
      font-size: 20px;
      color: #010621;
      vertical-align: middle;
    }
  }

  .table-page {
    height: 95%;
    padding: 15px;
    display: flex;
    flex-direction: column;

    &.padding-none {
      padding: 0;
    }
    .table-main {
      display: flex;

      flex: 1;
      overflow-y: auto;
    }

    .search {
      display: flex;
      /deep/ .el-form {
        width: calc(100% - 280px);
        .el-input,
        .el-select {
          width: 200px;
        }
      }
      .search-action {
        width: 280px;
      }
    }
  }
}

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
      font-weight: normal;
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
    overflow-y: scroll;
    padding: 16px 24px 0;
    box-sizing: border-box;

    .contianer-main__table {
      margin-top: 20px;
    }

    .container-main__pagination {
      display: flex;
      align-items: right;
      justify-content: right;
      padding-top: 20px;
    }
  }
}
</style>
