<template>
  <Page>
    <el-cascader
    :options="options" v-model="checked"  :show-all-levels="false"
    :props="{ checkStrictly: true,value:'categoryId',label:'categoryName',children:'childList' }"
    clearable></el-cascader>
    <el-button @click="aaa">111111</el-button>
  </Page>
</template>
<script>
  import {productCate,getRegion} from "@/request/api/commodityManage/commodityList";
export default {
  data() {
    return{
      checked:[],
      options:[],
    }
  },
  methods:{
    aaa(){
      // console.log(this.checked)
      if(this.checked.length == 4){
        console.log(this.checked[2],this.checked[3])
      }else{
        console.log(this.checked[this.checked.length-1])
      }
    },
    getOptions(){
      productCate({modelType: "0"}).then(resp=>{
        console.log(resp.data)
        this.options = resp.data
      })
    }
  },
  created(){
    this.getOptions();
  },
}
</script>
