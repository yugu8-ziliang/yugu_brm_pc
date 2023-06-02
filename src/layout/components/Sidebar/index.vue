<template>
  <div>
    <!-- <logo :collapse="isCollapse" /> -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <el-menu
        class="new-el-menu--sidebar"
        :default-active="activeMenu"
        :collapse="isCollapse"
        unique-opened
        :collapse-transition="false"
        mode="vertical"
      >
        <sidebar-item
          v-for="route in sidebarRouters"
          :key="route.path"
          :item="route"
          :base-path="route.path"
        />
      </el-menu>
    </el-scrollbar>
    <div class="hamburger" @click="toggleSideBar">
      <i
        :class="isCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left'"
        style="color: rgba(1, 6, 33, 0.75); font-size: 22px; line-height: 66px"
      ></i>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Logo from "./Logo";
import SidebarItem from "./SidebarItem";
export default {
  components: { SidebarItem, Logo },
  computed: {
    ...mapGetters(["sidebarRouters", "sidebar"]),
    activeMenu() {
      const route = this.$route;
      const { meta, path } = route;
      if (meta.activeMenu) {
        return meta.activeMenu;
      }
      return path;
    },
    isCollapse() {
      return !this.sidebar.opened;
    },
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
  },
};
</script>

.<style scoped lang="scss">
.hamburger {
  width: 22px;
  height: 66px;
  background: #ffffff;
  position: absolute;
  right: 0px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
}
</style>
