<template>
  <Page>
    <el-form :model="form" :rules="rules" ref="form" :inline="true" label-width="100%" label-position="left">
      <el-row :gutter="50">
        <el-col :span="4">
          <el-form-item label="收款人姓名:" prop="toUserId">
            <el-select v-model="form.toUserId" filterable placeholder="请选择" size="mini" clearable @change="ispayVerify">
              <el-option
                v-for="item in userOptions"
                :key="item.userId"
                :label="item.personName"
                :value="item.userId">
                <span style="float: left">{{ item.personName }}</span> 
                <span style="float: right; color: #8492a6; font-size: 13px">{{ item.phoneNumber }}</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-col> 
        <el-col :span="4">
          <el-form-item label="收款人电话:" prop="toUserId"> 
            <el-select v-model="form.toUserId" filterable placeholder="请选择" size="mini" clearable @change="ispayVerify">
              <el-option
                v-for="item in userOptions"
                :key="item.userId"
                :label="item.phoneNumber"
                :value="item.userId">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-form-item label="转账类型:" prop="transferType">
            <el-select v-model="form.transferType" filterable placeholder="请选择" size="mini" clearable @change="clearorderTableData">
              <el-option
                v-for="item in typeOptions"
                :key="item.transferType" 
                :label="item.name"
                :value="item.transferType">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" v-if="form.transferType == 4">
          <el-form-item label="转账原因:" prop="transferReason">
            <el-input v-model="form.transferReason" size="mini"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="4" v-if="form.transferType != 4">
          <div class="selectorder_styl">
            <el-button type="text" v-if="form.transferType == 6" @click="getOrder('3')">选择未付货款单></el-button>
            <el-button type="text" v-if="form.transferType == 7" @click="getOrder('4')">选择未付筐子单></el-button>
            <el-button type="text" v-if="form.transferType == 2" @click="getOrder('2')">选择借款单></el-button>
            <el-button type="text" v-if="form.transferType == 1" @click="getOrder('1')">选择预付款单></el-button>
          </div>
        </el-col>
      </el-row>
      <el-row v-if="orderTable">
        <el-col :span="16">
          <el-form-item label="已选预付款单:" prop="orderTableData">
            <el-table :data="form.orderTableData" max-height="500px" style="border-left:1px solid #E9E9E9;border-right:1px solid #E9E9E9;border-top:1px solid #E9E9E9;">
              <el-table-column label="类型" prop="type"></el-table-column>
              <el-table-column label="单号" prop="transferId"></el-table-column>
              <el-table-column :label="orderType == 2 ? '金额(元)' :  orderType == 3 ? '记账金额(元)' : orderType == 4 ? '记账金额(元)' : '金额(元)'" prop="transferPrice"></el-table-column>
              <el-table-column :label="orderType == 2 ? '时间' :  orderType == 3 ? '记账时间' : orderType == 4 ? '记账时间' : '时间'" width="160px">
                <template slot-scope="scope">
                  {{ toDate(scope.row.timestamp) }}
                </template>
              </el-table-column>
              <el-table-column :label="orderType == 2 ? '剩余需还金额(元)' :  orderType == 3 ? '剩余需付金额(元)' : orderType == 4 ? '剩余需付金额(元)' : '剩余需还金额(元)'" prop="remainingAmount">
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button type="text" @click="OrderCheck(scope.row.transferId)">查看</el-button>
                </template>  
              </el-table-column>
            </el-table>
            <div
              style="border:1px solid #EBEEF5;background-color:background: rgba(0, 0, 0, 0.02);padding:5px 10px"
            >{{ orderType == 2 ? '总计需归还金额' :  orderType == 3 ? '总计需归还金额' : '总计需付金额' }}：{{ currencyFormat(moneyCount) }}</div>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="转账金额:" prop="transferPrice">
            <el-input
              oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
              size="mini"
              style="width:70%;"
              placeholder="请输入金额"
              v-model="form.transferPrice">
              <i slot="prefix" style="font-size: 12px;font-family: PingFangSC-Regular, PingFang SC;color: rgba(1, 6, 33, 0.35);">总金额:</i>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" class="paytype_styl">
          <el-form-item label="支付方式:" prop="payType">
            <el-checkbox-group v-model="form.payType" @change="selectedPayType">
              <el-checkbox label="现金"></el-checkbox>
              <el-checkbox label="微信"></el-checkbox>
              <el-checkbox label="支付宝"></el-checkbox>
              <el-checkbox label="银行卡"></el-checkbox>
            </el-checkbox-group>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="paytype_input_styl" v-if="form.payType.length > 0">
        <p v-if="isShowPay.cash">
        <el-input v-model="form.cash" size="mini" style="width:15%;margin-bottom:10px;" oninput="value=value.replace(/^(0+)|[^\d]+/g,'')">
          <i slot="prefix" style="font-size: 12px;font-family: PingFangSC-Regular, PingFang SC;color: rgba(1, 6, 33, 0.35);">现金:</i>
          <template slot="append">元</template>
        </el-input></p>
        <p v-if="isShowPay.weChat">
        <el-input v-model="form.weChat" size="mini" style="width:15%;margin-bottom:10px;" oninput="value=value.replace(/^(0+)|[^\d]+/g,'')">
          <i slot="prefix" style="font-size: 12px;font-family: PingFangSC-Regular, PingFang SC;color: rgba(1, 6, 33, 0.35);">微信:</i>
          <template slot="append">元</template>
        </el-input></p>
        <p v-if="isShowPay.alipay">
        <el-input v-model="form.alipay" size="mini" style="width:15%;margin-bottom:10px;" oninput="value=value.replace(/^(0+)|[^\d]+/g,'')">
          <i slot="prefix" style="font-size: 12px;font-family: PingFangSC-Regular, PingFang SC;color: rgba(1, 6, 33, 0.35);">支付宝:</i>
          <template slot="append">元</template>
        </el-input></p>
        <p v-if="isShowPay.bank">
        <el-input v-model="form.bank" size="mini" style="width:15%;margin-bottom:10px;" oninput="value=value.replace(/^(0+)|[^\d]+/g,'')">
          <i slot="prefix" style="font-size: 12px;font-family: PingFangSC-Regular, PingFang SC;color: rgba(1, 6, 33, 0.35);">银行卡:</i>
          <template slot="append">元</template>
        </el-input></p>
      </div>
      <el-form-item label="备注:">
        <el-input
          type="textarea"
          placeholder="请输入备注"
          v-model="form.remark"
          maxlength="200"
          show-word-limit
          resize="none"
          rows="5"
          style="width:150%;"
        >
        </el-input>
      </el-form-item>
      <el-row>
        <el-col :span="4">
          <el-form-item label="支付密码" prop="payPassword">
            <el-input v-model="form.payPassword" maxlength="6" size="mini" show-password @focus="ishavePw" @blur="verifyPw"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div style="height:100px;"></div>
    <div class="page_footer">
      <el-button style="background-color:#0BA198;color:#fff;margin-left: 10px;" @click="submit">确认转账</el-button>
    </div>
    <!-- ########################################################################################################################## -->
    <el-dialog
      title=" "
      :visible.sync="VerifyWindow"
      width="40%"
      :before-close="VerifyWindowClose">
      <div>
        <span style="color:#248B39 ;"><i class="el-icon-success" style="margin-right:5px;font-size:20px;"></i></span>提示
        <p style="padding-left:20px;">{{ VerifyData.promptType == 0  ? '您已给该客户开了一笔订单,对方付款后,方可继续转账' 
          : VerifyData.promptType == 1 ? '收到该客户一笔订单款项,请先' 
          : VerifyData.promptType == 2 ? '您已支付给该客户一笔款项,对方收款后,方可继续转账' 
          : VerifyData.promptType == 3 ? '收到该客户一笔订单,请先前往确认' 
          : VerifyData.promptType == 4 ? '您已给该客户发送一笔转账账单,对方收款后,方可继续转账'
          : '您已给该客户发送一笔记账账单,对方确认后,方可继续转账'
          }}
          <el-button @click="toPage" type="text" v-if="VerifyData.promptType == 2">查看详情></el-button>
          <el-button @click="toPage" type="text" v-if="VerifyData.promptType == 0">查看详情></el-button>
          <el-button @click="toPage" type="text" v-if="VerifyData.promptType == 4">查看详情></el-button>
          <el-button @click="remind" type="text" v-if="VerifyData.promptType == 4">提醒对方收款</el-button>
          <el-button @click="remind" type="text" v-if="VerifyData.promptType == 2">提醒对方收款</el-button>
          <el-button @click="remind" type="text" v-if="VerifyData.promptType == 5">提醒对方确认</el-button>
          <el-button @click="toPage" type="text" v-if="VerifyData.promptType == 1">前往收款></el-button>
          <el-button @click="toPage" type="text" v-if="VerifyData.promptType == 3">前往确认></el-button>
          <el-button @click="toPage" type="text" v-if="VerifyData.promptType == 5">查看订单></el-button>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="VerifyWindowClose">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="orderType == 1 ? '选择预付款单' : orderType == 2 ? '选择借款单' : orderType == 3 ? '选择未付货款单' : '选择未付筐子单'"
      :visible.sync='selectOderWindow'
      width="50%"
      :before-close="selectOderWindowClose"
    >
      <el-table :data="tableData" height="500px" style="border-left:1px solid #E9E9E9;border-right:1px solid #E9E9E9;border-top:1px solid #E9E9E9;" 
      ref="multipleTable" @selection-change="handleSelectionChange">
        <el-table-column type="selection"></el-table-column>
        <el-table-column label="类型" prop="type"></el-table-column>
        <el-table-column label="单号" prop="transferId"></el-table-column>
        <el-table-column :label="orderType == 2 ? '金额(元)' :  orderType == 3 ? '记账金额(元)' : orderType == 4 ? '记账金额(元)' : '金额(元)'" prop="transferPrice"></el-table-column>
        <el-table-column :label="orderType == 2 ? '时间' :  orderType == 3 ? '记账时间' : orderType == 4 ? '记账时间' : '时间'" width="160px">
          <template slot-scope="scope">
            {{ toDate(scope.row.timestamp) }}
          </template>
        </el-table-column>
        <el-table-column :label="orderType == 2 ? '剩余需还金额(元)' :  orderType == 3 ? '剩余需付金额(元)' : orderType == 4 ? '剩余需付金额(元)' : '剩余需还金额(元)'" prop="remainingAmount">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="OrderCheck(scope.row.transferId)">查看</el-button>
          </template>  
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <span style="margin-right:15px;">{{ orderType == 3 ? '总计需支付金额' : orderType == 4 ? '总计需支付金额' : '总计需归还金额'}}{{ currencyFormat(dialogMoneyCount) }}元</span>
        <el-button @click="selectOderWindowClose">取 消</el-button>
        <el-button type="primary" @click="selectOderWindowSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      title="警告!"
      :visible.sync="setPassword"
      width="30%"
      :before-close="setPasswordClose"
    >
      <span>当前用户未设置支付密码！请设置后再返回操作！</span>
      <p><el-button type="text">前往设置></el-button></p>
    </el-dialog>
  </Page>
</template>
<script>
import { Base64 } from "js-base64";
import moment  from 'moment';
import { remind } from '@/request/api/transferManage/index.js'
import { getUser,getOrder,submit,password,orderVerify } from '@/request/api/transferManage/index.js';
import { getpayVerify } from '@/request/api/payVerify/index.js';
export default {
  name:"Atransfer",
  data() {
    var inputPrice = (rule, value, callback) =>{
      if(!value){
        return callback(new Error('请填写金额!'))
      }else{
        if(this.form.transferType == 1 || this.form.transferType == 2 || this.form.transferType == 6 || this.form.transferType == 7){
          if(value > this.checkedOrderCount){
            return callback(new Error('所填金额不能大于所选订单金额总和！'))
          }else{
            callback() 
          }
        }else{
          callback()
        }
      }
    }
    return{
      setPassword:false,
      isSubmit:true,
      checkedOrderCount:0,
      orderTable:false,
      checkedOrder:[],
      dialogMoneyCount:0,
      tableData:[],
      orderType:'',
      selectOderWindow:false,
      checkedUserType:null,
      VerifyWindow:false,
      VerifyData:{},
      userOptions:[],
      typeOptions:[],
      form:{
        toUserId:'',
        transferType:'',
        transferReason:'',
        orderTableData:[],
        repaymentList:'',
        transferPrice:null,
        payType:[],
        weChat:0,
        alipay:0,
        bank:0,
        cash:0,
        payPassword:''
      },
      rules:{
        toUserId:[{ required: true, message: '请选择用户', trigger: 'change' }],
        transferType:[{ required: true, message: '请选择转账类型', trigger: 'change' }],
        transferReason:[{ required: true, message: '请选填写转账原因', trigger: 'blur' }],
        orderTableData:[{ required: true, message: '请选择', trigger: 'blur' }],
        transferPrice:[{ validator: inputPrice, trigger: 'blur' },{ required: true, message: ' ', trigger: 'blur' }],
        payType:[{ required: true, message: '请选择支付方式', trigger: 'change' }],
        payPassword:[{ required: true, message: '请填写正确的6位支付密码', trigger: 'blur' }]
      },
      isShowPay:{
        weChat:false,
        alipay:false,
        bank:false,
        cash:false
      },
    }
  },
  methods:{
    setPasswordClose(){
      this.setPassword = false
    },
    ishavePw(){
      let res = this.$store.getters.userInfo;
      if(res.isSetPayWord == 0){
        this.setPassword = true
      }
    },
    verifyPw(){
      let obj = { passWord:this.form.payPassword }
      password(obj).then(resp=>{
        if(resp.data[0].isSuccess != 1){
          this.$error('密码不正确！请填写正确的6位支付密码！')
        }
      })
    },
    remind(){
      let res = { orderType:6,orderID:this.VerifyData.orderId,returnUserId:this.form.toUserId }
      remind(res).then(resp=>{
        this.$success('已成功提醒对方！')
      })
    },
    toPage(){
      // var routerArr = {
      //   1:"{path:'transferDetail',query:{id:this.VerifyData.orderId}}",
      //   11:"{path:'transferDetail',query:{id:this.VerifyData.orderId}}",
      //   12:"{path:'transferDetail',query:{id:this.VerifyData.orderId}}",
      //   7:"{path:'/frameManage/purchaseOrder',query:{orderId:this.VerifyData.orderId,basketInOutTypeView:1}}",
      //   3:"{path:'/frameManage/saleOrder',query:{orderId:this.VerifyData.orderId,basketInOutTypeView:1}}",
      //   4:"{path:'/refundManagement/createrefundBasket',query:{orderId:this.VerifyData.orderId,basketInOutTypeView:13}}",
      //   8:"{path:'/refundManagement/backBasketsheet',query:{orderId:this.VerifyData.orderId,basketInOutTypeView:14}}",
      //   9:"{path:'/financialManage/fundPaymentDetail',query:{ data: Base64.encode(JSON.stringify({payId:this.VerifyData.orderPayId}))}}",
      //   10:"{path:'/financialManage/paymentDetail',query:{data: Base64.encode(JSON.stringify({typeIs: 0,orderTypeIs:3,orderNo:this.VerifyData.orderPayId}))}}"
      // }
      // alert(this.VerifyData.orderType)
      // var jsonResult = JSON.parse(routerArr[this.VerifyData.orderType])
      // this.$router.push(jsonResult)
      if(this.VerifyData.orderType == 11 || this.VerifyData.orderType == 12){//转账
        this.$router.push({path:'transferDetail',query:{id:this.VerifyData.orderId}})
      }else if(this.VerifyData.orderType == 7){//我收到的购入单
        this.$router.push({path:'/frameManage/purchaseOrder',query:{orderId:this.VerifyData.orderId,basketInOutTypeView:1}})
      }else if(this.VerifyData.orderType == 3){//我发出的售出单
        this.$router.push({path:'/frameManage/saleOrder',query:{orderId:this.VerifyData.orderId,basketInOutTypeView:1}})
      }else if(this.VerifyData.orderType == 1){//我发出的销售单
        alert('暂无销售单')
      }else if(this.VerifyData.orderType == 2){//我提交的退货退款
        alert('暂无的退货退款')
      }else if(this.VerifyData.orderType == 4){//我提交的退筐退款
        this.$router.push({path:'/refundManagement/createrefundBasket',query:{orderId:this.VerifyData.orderId,basketInOutTypeView:13}})
      }else if(this.VerifyData.orderType == 5){//我收到的采购单
        alert('暂无采购单')
      }else if(this.VerifyData.orderType == 6){//我收到的退货退款
        alert('暂无退货退款')
      }else if(this.VerifyData.orderType == 8){//我收到的退筐退款
        this.$router.push({path:'/refundManagement/backBasketsheet',query:{orderId:this.VerifyData.orderId,basketInOutTypeView:14}})
      }else if(this.VerifyData.orderType == 9){//我发出的批量支付
        // console.log(9)
        this.$router.push({path:'/financialManage/fundPaymentDetail',query:{ data: Base64.encode(JSON.stringify({payId:this.VerifyData.orderPayId}))}})
      }else if(this.VerifyData.orderType == 10){//我收到的批量支付
        // console.log(10)
        this.$router.push({path:'/financialManage/paymentDetail',query:{
          data: Base64.encode(JSON.stringify({typeIs: 0,orderTypeIs:3,orderNo:this.VerifyData.orderPayId})),
        }})
      }else if(this.VerifyData.orderType == 13 || this.VerifyData.orderType == 14){//记账
        this.$router.push({path:'accountingDetail',query:{id:this.VerifyData.orderId}})
      }
    },
    submit(){
      let price = Number(this.form.transferPrice)
      let count = Number(this.form.weChat)+Number(this.form.alipay)+Number(this.form.cash)+Number(this.form.bank)
      if(price != count){
        this.$alert('现金、微信、支付宝、银行卡等转账方式所填金额总和必须等于转账金额所填金额！请选择并修改支付方式金额！', '提示', {
          confirmButtonText: '确定',
          type: 'error'
        })
      }else{
        let obj = { passWord:this.form.payPassword,useType:1}
        password(obj).then(resp=>{
          if(resp.data[0].isSuccess == 1){
            this.form.securityCode = resp.data[0].securityCode
            if(this.form.transferType == 1 || this.form.transferType == 2 || this.form.transferType == 6 || this.form.transferType == 7){
              // console.log(this.form) //transferId
              let orderres = this.form.orderTableData.map(item=>{
                return item.returnInfo
              })
              this.form.repaymentList = orderres.join(',')
            }
            const self = this
            this.$refs.form.validate((valid)=>{
              if(valid){
                self.submitVerify(this.form.toUserId);
                if(self.isSubmit){
                  submit(self.form).then(resp=>{
                    this.$success('创建成功！')
                    this.$closePage();
                  })
                }
              }
            })
          }else{
            this.$error('密码不正确！请填写正确的6位支付密码！')
          }
        })
        
        
      }
    },
    clearorderTableData(){
      this.orderTableData = [];
      this.orderTable = false;
      this.form.transferPrice = null;
    },
    selectedPayType(val){
      this.isShowPay.cash = val.indexOf('现金') == -1 ? false : true;
      this.isShowPay.weChat = val.indexOf('微信') == -1 ? false : true;
      this.isShowPay.alipay = val.indexOf('支付宝') == -1 ? false : true;
      this.isShowPay.bank = val.indexOf('银行卡') == -1 ? false : true;
    },
    selectOderWindowSubmit(){
      let res = { 
        toUserId:this.form.toUserId,
        transferType:this.form.transferType == 6 ? '3' : this.form.transferType == 7 ? '4' : this.form.transferType == 2 ? '2' : '1',
        dataList:this.checkedOrder
      }
      orderVerify(res).then(resp=>{
        if(resp.data[0] == 1){
          this.selectOderWindowClose();
          this.form.orderTableData = this.checkedOrder;
          this.orderTable = true;
        }else{
          this.$alert('所选单据金额发生变化！请重新选择！', '提示', {
            confirmButtonText: '确定',
            type: 'error'
          })
        }
      })
      
    },
    OrderCheck(id){
      console.log(id)
    },
    currencyFormat(num){
      let a = Number(num).toFixed(2).toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
      return a
    },
    toDate(val){
      return moment(val*1000).format('YYYY-MM-DD HH:mm:ss');
    },
    handleSelectionChange(val){
      this.checkedOrder = val;
    },
    selectOderWindowClose(){
      this.selectOderWindow = false;
    },
    getOrder(val){
      this.orderType = val;
      let obj = {toUserId:this.form.toUserId,transferType:val}
      getOrder(obj).then(resp=>{
        // console.log(resp.data)allRemainingAmount
        this.tableData = resp.data[0].dataList
        this.selectOderWindow = true;
        this.dialogMoneyCount = resp.data[0].allRemainingAmount
      })
    },
    VerifyWindowClose(){
      this.form.transferType = '';
      this.form.toUserId = '';
      this.VerifyWindow = false
    },
    submitVerify(val){
      let res = {toUserId:val}
      getpayVerify(res).then(resp=>{
        if(resp.status != 200){
          this.VerifyWindow = true;
          this.isSubmit = false;
        }else{
          this.isSubmit = true;
        }
      })
    },
    ispayVerify(val){
      let res = {toUserId:val}
      getpayVerify(res).then(resp=>{
        if(resp.status != 200){
          this.VerifyWindow = true;
          this.VerifyData = resp.data[0];
          console.log(resp)
        }else{
          this.getType();
        }
      })
    },
    getUser(){
      let res = {search:'',modelType:1,pageindex:0,pagesize:0};
      getUser(res).then(resp=>{
        this.userOptions = resp.data
      })
    },
    getType(){
      this.form.transferType = '';
      let res = this.$store.getters.userInfo.usertype;
      let mytype = res == 3 ? '采购' : res == 4 ? '采购' : res == 6 ? '经营' : res == 7 ? '经营' : '供货'
      let checkedUser = this.form.toUserId
      let totype = ''
      for(let i=0;i<this.userOptions.length;i++){
        if(this.userOptions[i].userId == checkedUser){
          totype = this.userOptions[i].merchantTypeId
        }
      }
      // console.log('我'+res,mytype,'他'+totype)
      // 1.归还预付款 2.归还借款 3.借款 4.其他 5.预付款 6.支付货款 7.支付筐子款
      // mytype # 采购 # 经营 # 供货
      // totype # 1：经营户，2：采购户， 3：供货商
      if(mytype == '经营'){
        if(totype == 1){
          this.typeOptions=[
            {transferType:3,name:'借款'},
            {transferType:5,name:'预付款'},
            {transferType:2,name:'归还借款'},
            {transferType:1,name:'归还预付款'},
            {transferType:4,name:'其他'},
            {transferType:6,name:'归还记账货款'},
            {transferType:7,name:'归还记账筐子款'}
          ]
        }else if(totype == 2){
          this.typeOptions=[
            {transferType:3,name:'借款'},
            {transferType:2,name:'归还借款'},
            {transferType:1,name:'归还预付款'},
            {transferType:4,name:'其他'},
            {transferType:6,name:'归还记账货款'},
            {transferType:7,name:'归还记账筐子款'}
          ]
        }else{
          this.typeOptions=[
            {transferType:3,name:'借款'},
            {transferType:5,name:'预付款'},
            {transferType:2,name:'归还借款'},
            {transferType:4,name:'其他'},
            {transferType:6,name:'归还记账货款'},
            {transferType:7,name:'归还记账筐子款'}
          ]
        }
      }else if(mytype == '采购'){
        if(totype == 1){
          this.typeOptions=[
            {transferType:3,name:'借款'},
            {transferType:5,name:'预付款'},
            {transferType:2,name:'归还借款'},
            {transferType:4,name:'其他'},
            {transferType:6,name:'归还记账货款'},
            {transferType:7,name:'归还记账筐子款'}
          ]
        }else if(totype == 2){
          this.typeOptions=[
            {transferType:3,name:'借款'},
            {transferType:5,name:'预付款'},
            {transferType:2,name:'归还借款'},
            {transferType:4,name:'其他'},
            {transferType:6,name:'归还记账货款'},
            {transferType:7,name:'归还记账筐子款'}
          ]
        }else{
          this.typeOptions=[
            {transferType:3,name:'借款'},
            {transferType:2,name:'归还借款'},
            {transferType:4,name:'其他'},
            {transferType:7,name:'归还记账筐子款'}
          ]
        }
      }else{
        if(totype == 1){
          this.typeOptions=[
            {transferType:3,name:'借款'},
            {transferType:2,name:'归还借款'},
            {transferType:1,name:'归还预付款'},
            {transferType:4,name:'其他'},
            {transferType:7,name:'归还记账筐子款'}
          ]
        }else if(totype == 2){
          this.typeOptions=[
            {transferType:3,name:'借款'},
            {transferType:2,name:'归还借款'},
            {transferType:4,name:'其他'},
            {transferType:7,name:'归还记账筐子款'}
          ]
        }else{
          this.typeOptions=[
            {transferType:3,name:'借款'},
            {transferType:2,name:'归还借款'},
            {transferType:1,name:'归还预付款'},
            {transferType:4,name:'其他'},
            {transferType:7,name:'归还记账筐子款'}
          ]
        }
      }
    },
  },
  computed:{
    moneyCount(){
      let res = this.form.orderTableData;
      let count = 0;
      for(let i=0;i<res.length;i++){
        count += res[i].remainingAmount
      }
      this.checkedOrderCount = count;
      return count;
    }
  },
  created(){
    this.getUser();
  }
}
</script>
<style scoped lang="scss">
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
::v-deep .el-dialog__header{
  border-bottom:0px !important;
}
::v-deep .el-form-item__content{
  width: 100% !important;
}
.selectorder_styl{
  position: relative;
  top:40px
}
::v-deep .el-input--prefix .el-input__inner{
  padding-left:60px;
}
::v-deep .el-input--mini .el-input__inner{
  border-radius: 2px;
}
::v-deep .el-input__prefix{
  top:5px;
}
.paytype_styl /deep/ .el-form-item__label{
    display: none !important;
  }
.paytype_styl /deep/ .el-checkbox-group{
  position: relative;
  top: 40px;
}
.paytype_styl /deep/ .el-form-item__error{
  position: relative;
  top: 30px;
}
.paytype_input_styl{
  width: 100%;
  background: #F9F9F9;
  border-radius: 8px;
  padding: 15px 10px;
}
::v-deep .el-scrollbar__view{
  width: 99%;
}
</style>