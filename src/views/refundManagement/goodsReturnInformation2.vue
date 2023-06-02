<template>
  <Page class="editpage">
    <div v-if="isShowEdit == false">
      <div v-for="(item,index) in tableData" :key="'goods'+index">
        <div>
          {{ item.catgoryfirstName }}-{{ item.categorysecondName }}-{{ item.name }}
          <el-button type="text" @click="editGoods(index)">编辑</el-button>
        </div>
        <el-descriptions :column="4">
          <el-descriptions-item label="品种/品牌">{{ item.variety }}</el-descriptions-item>
          <el-descriptions-item label="产地">{{ item.region }}</el-descriptions-item>
          <el-descriptions-item label="级别/规格">{{ item.spec }}</el-descriptions-item>
          <el-descriptions-item label="计算单位">{{ item.subUnit }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
    <div v-if="isShowEdit">
      <div>商品信息</div>
      {{ tableData[editIndex].catgoryfirstName }}-{{ tableData[editIndex].categorysecondName }}-{{ tableData[editIndex].name }}
      <el-descriptions :column="4">
        <el-descriptions-item label="品种/品牌">{{ tableData[editIndex].variety }}</el-descriptions-item>
        <el-descriptions-item label="产地">{{ tableData[editIndex].region }}</el-descriptions-item> 
        <el-descriptions-item label="级别/规格">{{ tableData[editIndex].spec }}</el-descriptions-item>
        <el-descriptions-item label="计算单位">{{ tableData[editIndex].subUnit }}</el-descriptions-item>
      </el-descriptions>
      <el-descriptions :column="4">
        <el-descriptions-item label="当前批次">{{ allBatchText }}</el-descriptions-item>
        <el-descriptions-item label="采购数量">{{  }}</el-descriptions-item>
        <el-descriptions-item label="已选批次">
          {{ selectedBatch() }}
          <el-button @click="checkBatch" size="mini">选择批次</el-button>
        </el-descriptions-item>
      </el-descriptions>
      <div class="edit_footer">
        <el-button @click="finishEdit">完成</el-button>
      </div>
    </div>
    <el-dialog
      title="提示"
      :visible.sync="checkBatchDialog"
      width="60%"
      :before-close="closecheckBatch">
      <div>
        <el-table :data="batchTableData" style="border:1px solid #e9e9e9;" @selection-change="handleSelectionChange" ref="batchTable">
          <el-table-column type="selection" width="55"> </el-table-column>
          <el-table-column prop="timestamp" label="时间" ></el-table-column>
        </el-table>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkBatchDialog = false">取 消</el-button>
        <el-button type="primary" @click="confirmSelectedBatch">确 定</el-button>
      </span>
    </el-dialog>
  </Page>
</template> 
<script>
import {  OrderReturnSellInfo } from "@/request/api/refundManagement/index.js";
import { productBatch } from "@/request/api/commodity/index";
export default {
  name:'goodsReturnInformation',
  data(){
    return{
      linshiselect:[],
      batchTableData:[],
      checkBatchDialog:false,
      allBatchText:'',
      tableData:[],
      isShowEdit:false,
      editIndex:null,
    }
  },
  methods:{
    selectedBatch(){
      if(this.tableData[this.editIndex].checkedBatch){
        if(this.tableData[this.editIndex].checkedBatch.length > 0){
          return '已选择'+this.tableData[this.editIndex].checkedBatch.length+'个批次'
        }else{
          return '--'
        }
      }else{
        return '--'
      }
    },
    finishEdit(){
      this.isShowEdit = false;
    },
    confirmSelectedBatch(){
      console.log(this.tableData)
      this.tableData[this.editIndex].checkedBatch = this.linshiselect
      this.checkBatchDialog = false;
    },
    handleSelectionChange(val){
      this.linshiselect = val
    },
    checkBatch(){
      let res = {
        productId: '6180', // 商品ID
        type: 6, // 报溢商品选择批次传0，其他如单位转换和报损传1, 2:腾空筐子，3：装筐，4：分拣 5：销售单 6：退货退款单
        pageindex: 1,
        pagesize: 10,
      } 
      productBatch(res).then(resp=>{
        console.log(resp.data[0].modelList)
        this.batchTableData = resp.data[0].modelList
        this.checkBatchDialog = true
      })
    },
    closecheckBatch(){
      this.checkBatchDialog = false
    },
    getBatchMsg(){
      let res = {
        productId: '6180', // 商品ID
        type: 6, // 报溢商品选择批次传0，其他如单位转换和报损传1, 2:腾空筐子，3：装筐，4：分拣 5：销售单 6：退货退款单
        pageindex: 1,
        pagesize: 10,
      } 
      productBatch(res).then(resp=>{
        this.tableData[this.editIndex].editMsg = {
          checkedBatch:[]
        }
        if(resp.data[0].basketcount > 0){
          this.allBatchText = resp.data[0].modelList.length+'个/数量'+resp.data[0].batchcount+this.tableData[this.editIndex].subUnit+'|'+resp.data[0].basketcount+'筐'
        }else{
          this.allBatchText = resp.data[0].modelList.length+'个/数量'+resp.data[0].batchcount+this.tableData[this.editIndex].subUnit
        }
        console.log(this.tableData)
      })
    },   
    editGoods(val){
      console.log(val)
      this.isShowEdit = true;
      this.editIndex = val;
      this.getBatchMsg()
    },
    getMsg(){
      let res = {"orderId":10063,"orderType":2,"productId":"7127,7128,7129,7130","orderReturnId":1}
      OrderReturnSellInfo(res).then(resp=>{
        this.tableData = resp.data[0].details
      })
    }
  },
  created(){
    this.getMsg()
  },
}
</script>
<style scoped lang="scss">
.editpage{
  position: relative;
}
.edit_footer{
  border: 1px red solid;
  width: 100%;
  text-align: right;
  position: absolute;
  bottom: 0px;
  right: 0px;
  padding: 15px 20px;
}
</style>