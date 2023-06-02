<template>
  <Page>
    <h2 v-if="orderMsg.type == 1">{{ orderMsg.status == 2 ?'待对方收款' : orderMsg.status == 3 ? '已付款' : '未知类型' }}</h2>
    <h2 v-if="orderMsg.type == 2">{{ orderMsg.status == 2 ?'代收款' : orderMsg.status == 3 ? '已收款' : '未知类型' }}</h2>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="6">
        {{ orderMsg.type == 1 ? '收款人姓名:' : '付款人姓名:' }}{{ orderMsg.type == 1 ? orderMsg.collectionUser : orderMsg.payUser }}
      </el-col>
      <el-col :span="6">
        {{ orderMsg.type == 1 ? '收款人电话:' : '付款人电话:' }}{{ orderMsg.type == 1 ? orderMsg.collectionUserPhone : orderMsg.payUserPhone }}
      </el-col>
    </el-row>
    <el-row style="margin-top:30px;">
      <el-col :span="24">
        转账金额:{{ orderMsg.transferPrice }}元(<span v-for="(item,index) in orderMsg.transferNotePayDetailsPc" :key="'paytype' + index">
          {{ item.name == 'cash' ? '现金' : item.name == 'weChat' ? '微信' : item.name == 'alipay' ? '支付宝' : '银行卡' }}
          {{item.value}}元{{ orderMsg.transferNotePayDetailsPc.length-1 == index ? '' : ',' }}
        </span>)
      </el-col>
    </el-row>
    <el-row style="margin-top:30px;">
      <el-col :span="6">
        转账类型:{{ orderMsg.statusTypeName }}
      </el-col>
      <el-col :span="6">
        <el-button type="text" v-if="orderMsg.transferType == 1" @click="gljiekuan = true">查看关联预付款单</el-button>
        <el-button type="text" v-if="orderMsg.transferType == 2" @click="gljiekuan = true">查看关联借款单</el-button>
        <el-button type="text" v-if="orderMsg.transferType == 6" @click="gljiekuan = true">查看关联记账单</el-button>
        <el-button type="text" v-if="orderMsg.transferType == 7" @click="gljiekuan = true">查看关联记账单</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top:30px;">
      <el-col :span="6">
        备注:{{ orderMsg.remark }}
      </el-col>
    </el-row>
    <el-row style="margin-top:30px;" v-if="orderMsg.status == 3">
      <el-col :span="6">
        <el-button type="text" @click="getDikou">查看抵扣记录</el-button>
        <el-button type="text" v-if="orderMsg.transferType != 4" @click="getGuihuan">查看归还记录</el-button>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <div  v-if="orderMsg.type == 1 && orderMsg.status == 2">
      <el-row style="margin-top:30px;">
        <el-col :span="6">
          转账单号:{{ orderMsg.transferId }}
        </el-col>
        <el-col :span="6">
          转账时间:{{ toDate(orderMsg.transferTimestamp) }}
        </el-col>
      </el-row>
      <el-row style="margin-top:30px;">
        <el-col :span="6">
          操作人:{{ orderMsg.confirmByUserName }}
        </el-col>
      </el-row>
    </div>
    <div  v-if="orderMsg.type == 1 && orderMsg.status == 3">
      <el-row style="margin-top:30px;">
        <el-col :span="6">
          转账单号:{{ orderMsg.transferId }}
        </el-col>
        <el-col :span="6">
          转账时间:{{ toDate(orderMsg.transferTimestamp) }}
        </el-col>
      </el-row>
      <el-row style="margin-top:30px;">
        <el-col :span="6">
          操作人:{{ orderMsg.confirmByUserName }}
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <el-col :span="6">
          收款时间:{{ toDate(orderMsg.confirmTimestamp) }}
        </el-col>
      </el-row>
    </div>
    <div  v-if="orderMsg.type == 2 && orderMsg.status == 2">
      <el-row style="margin-top:30px;">
        <el-col :span="6">
          转账单号:{{ orderMsg.transferId }}
        </el-col>
        <el-col :span="6">
          转账时间:{{ toDate(orderMsg.transferTimestamp) }}
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <el-col :span="6">
          收款密码:<el-input show-password v-model="password" size="mini" style="width:50%;"></el-input> 
        </el-col>
      </el-row>
    </div>
    <div  v-if="orderMsg.type == 2 && orderMsg.status == 3">
      <el-row style="margin-top:30px;">
        <el-col :span="6">
          操作人:{{ orderMsg.confirmByUserName }}
        </el-col>
        <el-col :span="6">
          收款时间:{{ toDate(orderMsg.confirmTimestamp) }}
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-row>
        <el-col :span="6">
          转账单号:{{ orderMsg.transferId }}
        </el-col>
        <el-col :span="6">
          转账时间:{{ toDate(orderMsg.transferTimestamp) }}
        </el-col>
      </el-row>
    </div>
    <div style="height:100px;"></div>
    <div class="page_footer" v-if="orderMsg.type == 1 && orderMsg.status == 2">
      <el-button @click="remind">提醒对方收款</el-button>
      <el-button style="background-color:#0BA198;color:#fff;margin-left: 10px;" @click="revocation">撤回</el-button>
    </div>
    <div class="page_footer" v-if="orderMsg.type == 2 && orderMsg.status == 2">
      <el-button style="background-color:#0BA198;color:#fff;margin-left: 10px;" @click="receipt">确认收款</el-button>
    </div>
    <el-dialog
      title="抵扣记录"
      :visible.sync="dikou"
      width="40%"
      :before-close="dikouClose">
      <el-table :data="dikoutableData" height="500px" style="border:1px solid #E9E9E9;">
        <el-table-column label="订单类型" prop="useTypeName"></el-table-column>
        <el-table-column label="单号" prop="transferId"></el-table-column>
        <el-table-column label="使用时间">
          <template slot-scope="scope">
            {{ toDate(scope.row.timestamp) }}
          </template>
        </el-table-column>
        <el-table-column label="使用金额" prop="usePrice"></el-table-column>
        <el-table-column label="操作人" prop="userName"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="check(scope.row.transferId)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title="归还记录"
      :visible.sync="guihuan"
      width="40%"
      :before-close="guihuanClose">
      <el-table :data="guihuantableData" height="500px" style="border:1px solid #E9E9E9;">
        <el-table-column label="转账单号" prop="transferId"></el-table-column>
        <el-table-column label="转账时间">
          <template slot-scope="scope">
            {{ toDate(scope.row.timestamp) }}
          </template>
        </el-table-column>
        <el-table-column label="转账金额" prop="usePrice"></el-table-column>
        <el-table-column label="操作人" prop="userName"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="check(scope.row.transferId)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      :title="orderMsg.transferType == 1 ? '关联预付款单' : orderMsg.transferType == 2 ? '关联借款单' : '关联记账单' "
      :visible.sync="gljiekuan"
      width="50%"
      :before-close="gljiekuanClose"
    >
      <el-table :data="orderMsg.info" height="500px" style="border:1px solid #E9E9E9;">
        <el-table-column label="类型" prop="transferClass" width="60">
          <template slot-scope="scope">
            {{ scope.row.transferClass == 1 ? '转账' : '记账' }}
          </template>
        </el-table-column>
        <el-table-column label="单号" prop="transferId" width="120"></el-table-column>
        <el-table-column label="金额(元)" prop="transferPrice" width="100"></el-table-column>
        <el-table-column label="时间" width="200">
          <template slot-scope="scope">
            {{ toDate(scope.row.timestamp) }}
          </template>
        </el-table-column>
        <el-table-column label="本次归还金额" prop="usePrice"></el-table-column>
        <el-table-column label="剩余需还金额(元)" prop="unpaid"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="glCheck(scope.row.transferId)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </Page>
</template>
<script>
import moment  from 'moment';
import {getDetail,revocation,remind,receipt,password,getDikou } from '@/request/api/transferManage/index.js'
export default{
  data(){
    return{
      id:this.$route.query.id,
      orderMsg:{},
      password:'',
      dikou:false,
      guihuan:false,
      gljiekuan:false,
      dikoutableData:[],
      guihuantableData:[]
    }
  },
  methods:{
    glCheck(id){},
    getDikou(){
      let res = {transferId:this.orderMsg.transferId,transferTimestamp:this.orderMsg.transferTimestamp,recordType:2,transferClass:1}
      getDikou(res).then(resp=>{
        this.dikoutableData = resp.data
        this.dikou = true;
      })
    },
    getGuihuan(){
      this.guihuan = true;
      let res = {transferId:this.orderMsg.transferId,transferTimestamp:this.orderMsg.transferTimestamp,recordType:1,transferClass:1}
      getDikou(res).then(resp=>{
        this.guihuantableData = resp.data
        this.guihuan = true
      })
    },
    gljiekuanClose(){
      this.gljiekuan = false;
    },
    guihuanClose(){
      this.guihuan = false;
    },
    dikouClose(){
      this.dikou = false;
    },
    receipt(){
      let res = { transferId:this.id }
      let obj = { passWord:this.password,useType:1 }
      password(obj).then(resp=>{
        if(resp.data[0].isSuccess == 1){
          res.securityCode = resp.data[0].securityCode
          receipt(res).then(msg=>{
            if(msg.status == 200){
              this.$alert('收款成功', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$success('收款成功！')
                  this.getDetail();
                }
              });
            }else{
              this.$alert('操作失败请刷新页面', '提示', {
                confirmButtonText: '确定',
                callback: action => {
                  this.$success('操作失败！')
                  this.getDetail();
                }
              });
            }
          })
        }else{
          this.$error('密码错误!')
        }
      })
      
    },
    remind(){
      let res = { orderType:6,orderID:this.id,returnUserId:this.orderMsg.toUserId }
      remind(res).then(resp=>{
        this.$success('已成功提醒对方收款！')
      })
    },
    revocation(){
      this.$confirm('转账单取消后，双方不可见!', '确认撤回?取消?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        let res = {transferId:this.id}
          revocation(res).then(resp=>{
            this.$closePage();
            this.$success('撤回成功！')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      
    },
    getDetail(){
      let id = {transferId:this.id}
      getDetail(id).then(resp=>{
        this.orderMsg = resp.data[0]
        console.log(this.orderMsg)
      })
    },
    toDate(val){
      return moment(val*1000).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  created(){
    this.getDetail();
  }
}
</script>
<style scoped lang="scss">
.font_styl{
  font-size: 14px;
  font-family: PingFangSC-, PingFang SC;
  font-weight: normal;
  color: rgba(1, 6, 33, 0.9);
  line-height: 22px;
}
.page_footer{
  width: 100%;
  text-align: right;
  background-color: #fff;
  border-top: 1px solid #E4E7ED;
  // height: 20px;
  position:fixed;
  bottom: 0px;
  padding:15px;
  right:20px;
}
</style>