<template>
  <div class="navbar">
    <div class="sidebar">
      <router-link key="collapse" class="sidebar-logo-link" to="/">
        <svg-icon icon-class="logo" class="sidebar-logo" />
        <h1 class="sidebar-title">{{ title }}</h1>
      </router-link>
    </div>

    <!-- <hamburger
            id="hamburger-container"
            :is-active="sidebar.opened"
            class="hamburger-container"
            @toggleClick="toggleSideBar"
        /> -->

    <!-- <breadcrumb
            id="breadcrumb-container"
            class="breadcrumb-container"
        /> -->

    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <!-- <screenfull
                    id="screenfull"
                    class="right-menu-item hover-effect"
                />
                <div
                    class="right-menu-item hover-effect"
                    @click="refresh"
                >
                    <i class="el-icon-refresh-right"></i>
                </div> -->

        <div class="right-menu-item">
          <span style="font-size: 12px; cursor: pointer; margin-right: 36px"
            >上海市浦东区 晴 20~35°C</span
          >
          <span style="font-size: 12px; cursor: pointer; margin-right: 26px"
            >待办</span
          >
          <span style="font-size: 13px; cursor: pointer"
            ><i class="el-icon-bell"></i
          ></span>
        </div>
      </template>

      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
        :tabindex="99"
        szie="mini"
      >
        <div class="avatar-wrapper">
          <img :src="userInfo.personheadphoto || imgurl" class="user-avatar" />
          <span>{{ userInfo.personname }}</span>
          <i class="el-icon-caret-bottom" />
        </div>
        <el-dropdown-menu slot="dropdown">
          <!-- <a
                        target="_blank"
                        href="http://kjd786166251.gitee.io/admin-template-doc/"
                    >
                        <el-dropdown-item>文档</el-dropdown-item>
                    </a> -->
          <el-dropdown-item @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "./Tool/Breadcrumb";
import Hamburger from "./Tool/Hamburger";
import Screenfull from "./Tool/Screenfull";

export default {
  data() {
    return {
      imgurl: require("@/assets/image/imgs/portrait.png"),
      title: process.env.VUE_APP_TITLE,
    };
  },
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull,
  },
  computed: {
    ...mapGetters(["sidebar", "userInfo", "device"]),
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      this.$store.dispatch("user/logout").then(() => {
        // console.log(this.$route.path);
        this.$router.replace(`/login?redirect=${this.$route.path}`);
      });
    },
    refresh() {
      this.$refreshPage();
    },
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  display: flex;
  align-content: center;
  justify-content: space-between;
  height: 60px;
  // overflow: hidden;
  // position: relative;
  background: var(--color-primary);
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  width: 100%;

  .sidebar {
    margin-left: 20px;
    cursor: pointer;
    .sidebar-logo {
      width: 32px;
      height: 32px;
      vertical-align: middle;
      margin-right: 12px !important;
      // color: var(--default-color);
      color: #fff;
    }

    .sidebar-title {
      display: inline-block;
      margin: 0;
      // color: #333;
      color: #fff;
      font-weight: 600;
      line-height: 60px;
      font-size: 16px;
      font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
      vertical-align: middle;
    }
  }
  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 60px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 14px;
      color: #fff;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          // background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-left: 15px;
      margin-right: 15px;

      .avatar-wrapper {
        display: flex;
        align-items: center;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 24px;
          height: 24px;
          border-radius: 50%;
        }
        span {
          margin: 0px 10px;
        }
        .el-icon-caret-bottom {
          cursor: pointer;
          // position: absolute;
          // right: -20px;
          // top: 25px;
          font-size: 12px;
          transform: translateY(4px);
        }
      }
    }
  }
}
</style>
