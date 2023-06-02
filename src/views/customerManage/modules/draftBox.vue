<template>
  <!-- 需求草稿箱 -->
  <el-scrollbar style="height: 100%">
    <div v-for="(o, index) in 100" :key="index">需求草稿箱</div>
  </el-scrollbar>
</template>

<script>
export default {
  name: "draftBox",
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