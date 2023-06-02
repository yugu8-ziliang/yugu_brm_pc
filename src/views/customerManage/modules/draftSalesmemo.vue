<template>
  <!-- 商品销售单草稿 -->
  <el-scrollbar style="height: 100%">
    <div v-for="(o, index) in 100" :key="index">商品销售单草稿</div>
  </el-scrollbar>
</template>

<script>
export default {
  name: "draftSalesmemo",
  data() {
    return {};
  },
  created() {this.getList()},
  computed: {},
  methods: {
    getList(arg){
      console.log("触发");
    }
  },
};
</script>

<style>
</style>