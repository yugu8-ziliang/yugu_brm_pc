<template>
  <Page>
    <h2>{{ orderMsg.statusName }}</h2>
    <el-divider></el-divider>
    <el-row>
      <el-col :span="6">
        {{ orderMsg.fromUserTypeName+'姓名：' }}{{ orderMsg.fromUserName }}
      </el-col>
      <el-col :span="6">
        {{ orderMsg.fromUserTypeName+'电话：' }}{{ orderMsg.fromUserPhone }}
      </el-col>
    </el-row>
    <br>
    <el-row>
      <el-col :span="20">
        {{ '记账金额：' + orderMsg.transferPrice }} 
        <span style="font-size: 14px;font-family: PingFangSC-, PingFang SC;color: rgba(1, 6, 33, 0.9);"
          v-if="orderMsg.transferNoteType == 1 || orderMsg.transferNoteType == 2 || orderMsg.transferNoteType == 6 || orderMsg.transferNoteType == 7"
        >{{ payType == '' ? '': '('+ payType +')'}}</span>  
      </el-col>
    </el-row>
    <br>
    <el-row style="font-size: 14px;font-family: PingFangSC-, PingFang SC;color: rgba(1, 6, 33, 0.9);">
      <el-col :span="6">
        日期：{{ toDate(orderMsg.timestransferNoteTimestamptamp) }}
      </el-col>
      <el-col :span="6">
        记账类型：{{ orderMsg.transferNoteTypeName }}
      </el-col>
    </el-row>
    <br>
    <el-row style="font-size: 14px;font-family: PingFangSC-, PingFang SC;color: rgba(1, 6, 33, 0.9);">
      <el-col :span="22">
        备注：{{ orderMsg.remark }}
      </el-col>
    </el-row>
    <br>
    <el-row style="font-size: 14px;font-family: PingFangSC-, PingFang SC;color: rgba(1, 6, 33, 0.9);">
      <el-col :span="22"  v-if="orderMsg.transferNoteType ==5 || orderMsg.transferNoteType ==10">
        记账原因：{{ orderMsg.transferNoteReason }}
      </el-col>
    </el-row>
    <br>
    <el-row v-if="orderMsg.statusName == '已确认'">
      <el-col :span="3">
        <!-- 1.未收货款 2.未收筐子款 3.已收借款 4.已收预付款 5.已收其他转账 6.未付货款 7.未付框子款 8.已付借款 9.已付预付款 10.已付其他转账 -->
        <el-button type="text" v-if="orderMsg.transferNoteType == 4 || orderMsg.transferNoteType == 3 || orderMsg.transferNoteType == 5 ||
        orderMsg.transferNoteType == 9 ||orderMsg.transferNoteType == 8 ||orderMsg.transferNoteType == 10"
        @click="openDialog('抵扣')"
        >查看抵扣记录</el-button>
      </el-col>
      <el-col :span="3">
        <!-- 1.未收货款 2.未收筐子款 3.已收借款 4.已收预付款 5.已收其他转账 6.未付货款 7.未付框子款 8.已付借款 9.已付预付款 10.已付其他转账 -->
        <el-button type="text" v-if="orderMsg.transferNoteType !=5 && orderMsg.transferNoteType !=10" @click="openDialog('归还')">查看归还记录</el-button>
      </el-col>
      <el-col :span="3">
        <!-- 1.未收货款 2.未收筐子款 3.已收借款 4.已收预付款 5.已收其他转账 6.未付货款 7.未付框子款 8.已付借款 9.已付预付款 10.已付其他转账 -->
        <el-button type="text" v-if="orderMsg.transferNoteType == 1 || orderMsg.transferNoteType == 2 || orderMsg.transferNoteType == 6 ||
        orderMsg.transferNoteType == 7" @click="openDialog('抵充')">查看抵充记录</el-button>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-row style="font-size: 14px;font-family: PingFangSC-, PingFang SC;color: rgba(1, 6, 33, 0.9);">
      <el-col :span="6">
        记账单号：{{ orderMsg.transferNoteId }}
      </el-col>
      <el-col :span="6">
        记账时间：{{ toTime(orderMsg.timestamp * 1000) }}
      </el-col>
    </el-row>
    <br>
    <el-row style="font-size: 14px;font-family: PingFangSC-, PingFang SC;color: rgba(1, 6, 33, 0.9);">
      <el-col :span="6">
        操作人：{{ orderMsg.addByUserName }}
      </el-col>
    </el-row>
    <el-row style="font-size: 14px;font-family: PingFangSC-, PingFang SC;color: rgba(1, 6, 33, 0.9);" v-if="orderMsg.statusName == '已确认'">
      <el-divider></el-divider>
      <el-col :span="6">
        确认时间：{{ toTime(orderMsg.confirmTimestamp * 1000) }}
      </el-col>
    </el-row>
    <el-row style="font-size: 14px;font-family: PingFangSC-, PingFang SC;color: rgba(1, 6, 33, 0.9);" v-if="orderMsg.type == 2 && orderMsg.statusName == '待确认'">
      <el-divider></el-divider>
      <el-col :span="6">
        {{ orderMsg.transferNoteType == 6 ||
        orderMsg.transferNoteType == 7 ||
        orderMsg.transferNoteType == 3 ||
        orderMsg.transferNoteType == 4 ||
        orderMsg.transferNoteType == 10 ? '支付' : '收款'}}密码：
        <el-input v-model="password" show-password size="mini" style="50%"></el-input>
      </el-col>
    </el-row>
    <div style="height:100px;"></div>
    <div class="page_footer" v-if="orderMsg.statusName != '已确认'">
      <el-button v-if="orderMsg.statusName == '待对方确认'" @click="remind">提醒对方确认</el-button>
      <el-button style="background-color:#0BA198;color:#fff;margin-left: 10px;" v-if="orderMsg.statusName == '待确认'" @click="receipt">确认</el-button>
      <el-button style="background-color:#0BA198;color:#fff;margin-left: 10px;" v-if="orderMsg.statusName == '待对方确认'" @click="revocation">撤回</el-button>
    </div>
    <el-dialog
      :title="openType+'记录'"
      :visible.sync="listTable"
      width="40%"
      :before-close="listTableClose"
    >
      <el-table style="border:1px solid #E9E9E9;" height="500px" :data="listTableDate" v-if="openType != '归还'">
        <el-table-column label="订单类型" prop="useTypeName"></el-table-column>
        <el-table-column label="单号" prop="transferId"></el-table-column>
        <el-table-column label="使用时间" prop="timestamp"></el-table-column>
        <el-table-column label="使用金额(元)" prop="usePrice"></el-table-column>
        <el-table-column label="操作人" prop="userName"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="check(scope.row.transferId)">查看</el-button>
          </template>  
        </el-table-column>
      </el-table>
      <el-table style="border:1px solid #E9E9E9;" height="500px" :data="listTableDate" v-if="openType == '归还'">
        <el-table-column label="转账单号" prop="transferId"></el-table-column>
        <el-table-column label="转账时间" prop="timestamp"></el-table-column>
        <el-table-column label="转账金额(元)" prop="usePrice"></el-table-column>
        <el-table-column label="操作人" prop="userName"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="check(scope.row.transferId)">查看</el-button>
          </template>  
        </el-table-column>
      </el-table>
    </el-dialog>
  </Page>
</template>
<script>
import moment  from 'moment';
import { remind,password } from '@/request/api/transferManage/index.js'
import { getInfo,getTableData,revocation,receipt } from '@/request/api/accountingManage/index.js'
export default {
  data() {
    return{
      openType:'',
      listTable:false,
      listTableDate:[],
      password:'',
      orderMsg:{},
      payType:'',
      id:this.$route.query.id
    }
  },
  methods:{
    receipt(){
      receipt().then(resp=>{
        let res = { transferId:this.id }
        let obj = { passWord:this.password,useType:2 }
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
      })
    },
    revocation(){
      this.$confirm('记账单取消后，双方不可见!', '确认撤回?取消?', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
        let res = {transferNoteId:this.id}
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
    remind(){
      let res = { orderType:7,orderID:this.id }
      remind(res).then(resp=>{
        this.$success('已成功提醒对方收款！')
      })
    },
    check(id){},
    openDialog(type){
      this.openType = type;
      // console.log(this.orderMsg.transferNoteId)
      let res = { transferId:this.orderMsg.transferNoteId,recordType:1,transferClass:2}
      if(type == '归还'){
        res.recordType = 1
      }else{
        res.recordType = 2
      }
      getTableData(res).then(resp=>{
        console.log(resp)
        this.listTable = true
        this.listTableDate = resp.data
      })
    },
    listTableClose(){
      this.listTable = false;
    },
    toDate(val){
      return moment(val).format('YYYY-MM-DD');
    },
    toTime(val){
      return moment(val).format('YYYY-MM-DD HH:mm:ss');
    },
    getPayTypeNums(val){
      let obj = val
      let res = []
      if(obj.bank){
        console.log(obj.bank)
      }
    },
    getInfo(){
      let res = {transferNoteId:this.id}
      getInfo(res).then(resp=>{
        console.log(resp)
        this.orderMsg = resp.data[0]
        let res = resp.data[0].transferNotePayDetails
        console.log(res)
        if(res.weChat){
          res.weChat = res.weChat+'元'
        }
        if(res.alipay){
          res.alipay = res.alipay+'元'
        }
        if(res.cash){
          res.cash = res.cash+'元'
        }
        if(res.bank){
          res.bank = res.bank+'元'
        }
        res = JSON.stringify(res);
        res = res.replace('{','');
        res = res.replace('}','');
        res = res.replace(/"/g,'');
        res = res.replace('weChat','微信');
        res = res.replace('alipay','支付宝');
        res = res.replace('cash','现金');
        res = res.replace('bank','银行卡');
        this.payType = res
      })
    },
  },
  created(){
    this.getInfo();
  }
}
</script>
<style lang="scss" scoped>
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