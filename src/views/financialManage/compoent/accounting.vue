<template>
  <Page>
    <el-form :model="form" :rules="rules" ref="form" label-position="left" >
      <el-row>
        <el-col :span="4">
          <el-form-item label="日期:" prop="transferNoteTimestamp">
            <br/>
            <el-date-picker
              value-format="timestamp"
              size="mini"
              v-model="form.transferNoteTimestamp"
              type="date"
              placeholder="选择日期"> 
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row> 
      <el-row>
        <el-col :span="4">
          <el-form-item label="用户姓名:" prop="userId" >
            <br/>
            <el-cascader
              ref="userid"
              @blur="inputcascader"
              @change="checkedUser"
              v-model="form.userId"
              :show-all-levels="false"
              size="mini"
              placeholder="请输入或选择"
              :options="options"
              filterable>
                <template slot-scope="{ data }">
                  <span>{{ data.label }}</span><span style="float:right;">{{ data.phone }}</span>
                </template>
            </el-cascader>
          </el-form-item>
        </el-col>
        <el-col :span="3">
          <br><br>/
          <el-radio-group v-model="form.usertype" @change="changeorder">
            <el-radio label="1">收款人</el-radio>
            <el-radio label="2">付款人</el-radio>
          </el-radio-group> 
        </el-col>
        <el-col :span="4">
          <el-form-item label="联系电话" prop="userPhone">
            <br/>
            <el-cascader-
              ref="userphone"
              @blur="inputcascader2"
              @change="checkedUser"
              v-model="form.userId"
              :show-all-levels="false"
              size="mini"
              placeholder="请输入或选择"
              :options="options"
              :props="optionProps"
              filterable>
                <template slot-scope="{ data }">
                  <span>{{ data.label }}</span><span style="float:right;">{{ data.phone }}</span>
                </template>-
            </el-cascader->
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="4">
          <el-form-item label="记账类型" prop="transferNoteType">
            <br>
            <el-select v-model="form.transferNoteType" placeholder="请选择" size="mini">
              <el-option
                v-for="item in orderoptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="4" v-if="form.transferNoteType == 5 || form.transferNoteType == 10">
          <el-form-item label="记账原因" prop="transferNoteReason">
            <br>
            <el-input v-model="form.transferNoteReason" size="mini"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6">
          <el-form-item label="记账金额" prop="transferPrice">
            <br>
            <el-input
              class="price_input_styl"
              oninput="value=value.replace(/^(0+)|[^\d]+/g,'')"
              size="mini"
              style="width:70%;"
              placeholder="请输入金额"
              v-model="form.transferPrice">
              <i slot="prefix" style="font-size: 12px;font-family: PingFangSC-Regular, PingFang SC;color: rgba(1, 6, 33, 0.35);margin-top:5px;">总金额:</i>
              <template slot="append">元</template>
            </el-input>
          </el-form-item>
        </el-col>
        <el-col :span="10" class="paytype_styl">
          <el-form-item label="支付方式:" prop="payType">
            <br>
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
        <br>
        <el-input
          type="textarea"
          placeholder="请输入备注"
          v-model="form.remark"
          maxlength="200"
          show-word-limit
          resize="none"
          rows="5"
          style="width:30%;"
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
      <el-button style="background-color:#0BA198;color:#fff;margin-left: 10px;" @click="submit">确认记账</el-button>
    </div>
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
import { remind } from '@/request/api/transferManage/index.js'
import { password } from '@/request/api/transferManage/index.js';
import { getUser,getFUser } from '@/request/api/basketSold/index.js'
import { getpayVerify } from '@/request/api/payVerify/index.js';
import { Add } from '@/request/api/accountingManage/index.js'
export default {
  name:"accounting",
  data() {
    return{
      isSubmit:true,
      setPassword:false,
      ptusermsg:[],
      fptusermsg:[],
      VerifyData:[],
      VerifyWindow:false,
      isFPT:'',
      PTuserType:'',
      orderoptions:[],
      optionProps:{
        value:'value',
        label:'phone',
        children:'children'
      },
      options:[
        {value:'1',label:'平台',children:[]},
        {value:'2',label:'非平台',children:[]}
      ],
      form:{
        transferNoteTimestamp:null,
        userId:'',
        userPhone:'',
        usertype:'1',
        transferNoteType:'',
        transferNoteReason:'',
        transferPrice:'',
        payType:[],
        weChat:0,
        alipay:0,
        bank:0,
        cash:0,
        payPassword:''
      },
      rules:{
        transferNoteTimestamp:[{ required: true, message: '请选择日期', trigger: 'change' }],
        userId:[{ required: true, message: '请选择用户', trigger: 'change' }],
        userPhone:[{ required: true, message: '请选择联系电话', trigger: 'change' }],
        transferNoteType:[{ required: true, message: '请选择记账类型', trigger: 'change' }],
        transferNoteReason:[{ required: true, message: '请填写记账原因', trigger: 'blur' }],
        transferPrice:[{ required: true, message: '请填写记账金额', trigger: 'blur' }],
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
    submit(){
      let price = Number(this.form.transferPrice)
      let count = Number(this.form.weChat)+Number(this.form.alipay)+Number(this.form.cash)+Number(this.form.bank)
      if(price != count){
        this.$alert('现金、微信、支付宝、银行卡等转账方式所填金额总和必须等于转账金额所填金额！请选择并修改支付方式金额！', '提示', {
          confirmButtonText: '确定',
          type: 'error'
        })
      }else{
        let obj = { passWord:this.form.payPassword,useType:2 }
        password(obj).then(resp=>{
          if(resp.data[0].isSuccess == 1){
            this.form.securityCode = resp.data[0].securityCode
            const self = this
            this.$refs.form.validate((valid)=>{
              if(valid){
                // console.log(this.form)
                if(this.isFPT == 1){
                  this.submitVerify(this.form.userId)
                  if(this.isSubmit){
                    this.form.toUserId = this.form.userId[1]
                    Add(this.form).then(resp=>{
                      this.$confirm('记账成功?', '提示', {
                        confirmButtonText: '查看详情',
                        cancelButtonText: '返回记账列表',
                        type: 'success'
                      }).then(() => {
                        let id = resp.data[0].transferNoteId;
                        // this.$closePage('accountingDetail',{id:id});
                        this.$store
                          .dispatch("tagsView/delView", {
                            path: this.$route.path,
                          })
                          .then(({ visitedViews }) => {
                            this.$router.push({
                              path: "accountingDetail",query:{id:id}
                            });
                          });
                          this.initialize();
                      }).catch(() => {
                        this.$store
                          .dispatch("tagsView/delView", {
                            path: this.$route.path,
                          })
                          .then(({ visitedViews }) => {
                            this.$router.push({
                              path: "accountingManage"
                            });
                          });
                          this.initialize();
                      });
                    })
                  }
                }else{
                  this.form.toUserId = ''
                  Add(this.form).then(resp=>{
                    this.$confirm('记账成功?', '提示', {
                        confirmButtonText: '查看详情',
                        cancelButtonText: '返回记账列表',
                        type: 'success'
                      }).then(() => {
                        let id = resp.data[0].transferNoteId;
                        this.$store
                          .dispatch("tagsView/delView", {
                            path: this.$route.path,
                          })
                          .then(({ visitedViews }) => {
                            this.$router.push({
                              path: "accountingDetail",query:{id:id}
                            });
                          });
                          this.initialize();
                      }).catch(() => {
                        this.$store
                          .dispatch("tagsView/delView", {
                            path: this.$route.path,
                          })
                          .then(({ visitedViews }) => {
                            this.$router.push({
                              path: "accountingManage",
                            });
                          });
                          this.initialize();
                      });
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
    verifyPw(){
      let obj = { passWord:this.form.payPassword }
      password(obj).then(resp=>{
        if(resp.data[0].isSuccess != 1){
          this.$error('密码不正确！请填写正确的6位支付密码！')
        }
      })
    },
    setPasswordClose(){
      this.setPassword = false
    },
    ishavePw(){
      let res = this.$store.getters.userInfo;
      if(res.isSetPayWord == 0){
        this.setPassword = true
      }
    },
    selectedPayType(val){
      this.isShowPay.cash = val.indexOf('现金') == -1 ? false : true;
      this.isShowPay.weChat = val.indexOf('微信') == -1 ? false : true;
      this.isShowPay.alipay = val.indexOf('支付宝') == -1 ? false : true;
      this.isShowPay.bank = val.indexOf('银行卡') == -1 ? false : true;
    },
    VerifyWindowClose(){
      this.form.userId = '';
      this.form.transferNoteType = '';
      this.VerifyWindow = false
    },
    changeorder(val){
      this.form.transferNoteType = ''
      this.orderoptions = []
      // console.log(this.isFPT,val)
      this.getType();
    },
    inputcascader2(val){
      this.isFPT = 2;
      this.$refs.userphone.inputValue = "";
      let data = val.target.value;
      this.form.userPhone = data
      setTimeout(() => {
        val.target.value = this.form.userPhone;
      }, 0);
    },
    inputcascader(val){
      this.isFPT = 2;
      this.$refs.userid.inputValue = "";
      // console.log(this.$refs.userid )
      let data = val.target.value;
      this.form.userId = data
      setTimeout(() => {
        val.target.value = this.form.userId;
      }, 0);
    },
    getType(){
      // console.log('所选用户是否非平台：'+this.isFPT,'当前登录人用户类型：'+this.$store.getters.userInfo.usertype,this.form.userId)
      //   this.isFPT: 1--平台 2--非平台   
      //   this.$store.getters.userInfo.usertype  3或4--采购户  6或7--经营  10或11--供货
      //   所选用户类型  1：经营户，2：采购户， 3：供货商
      //    mytype 1--采购户 2--经营 3--供货
      //  # 1.未收货款 2.未收筐子款 3.已收借款 4.已收预付款 5.已收其他转账 6.未付货款 7.未付框子款 8.已付借款 9.已付预付款 10.已付其他转账
      //  收款人或付款人 1--收款 2--付款
      let mytype = this.$store.getters.userInfo.usertype == 3 ? 1 
      : this.$store.getters.userInfo.usertype == 4 ? 1 
      : this.$store.getters.userInfo.usertype == 6 ? 2 
      : this.$store.getters.userInfo.usertype == 7 ? 2 : 3
      let checkedusertype = ''
      if(this.isFPT == 1){
        //所选位平台
        let checkedId = this.form.userId[1]
        for(let i=0;i<this.ptusermsg.length;i++){
          if(this.ptusermsg[i].userId == checkedId){
            //获取所选用户类型
            checkedusertype = this.ptusermsg[i].merchantTypeId
          }
        }
        if(this.form.usertype == 2){//付款人
          if(mytype == 1){//我是采购
            this.orderoptions = [
              {label:'未收筐子款',value:2},
              {label:'已收借款',value:3},
              {label:'已收其他',value:5}
            ]
          }else if(mytype == 2){//我是经营
            if(checkedusertype == 3){//所选为3：供货商
              this.orderoptions = [
                {label:'未收筐子款',value:2},
                {label:'已收借款',value:3},
                {label:'已收其他',value:5}
              ]
            }else{
              this.orderoptions = [
                {label:'未收筐子款',value:2},
                {label:'已收借款',value:3},
                {label:'已收其他',value:5},
                {label:'未收货款',value:1},
                {label:'已收预付款',value:4},
              ]
            }
          }else{//我是供货
            if(checkedusertype == 3){//所选为3：供货商
              this.orderoptions = [
                {label:'未收筐子款',value:2},
                {label:'已收借款',value:3},
                {label:'已收其他',value:5}
              ]
            }else{
              this.orderoptions = [
                {label:'未收筐子款',value:2},
                {label:'已收借款',value:3},
                {label:'已收其他',value:5},
                {label:'未收货款',value:1},
                {label:'已收预付款',value:4},
              ]
            }
          }
        }else{//收款人
          if(mytype == 1){//我是采购
            if(checkedusertype == 2){//所选为采购
              this.orderoptions = [
                {label:'未付筐子款',value:7},
                {label:'已付借款',value:8},
                {label:'已付其他',value:10}
              ]
            }else{//所选为供货商，经营户
              this.orderoptions = [
                {label:'未付筐子款',value:7},
                {label:'已付借款',value:8},
                {label:'已付其他',value:10},
                {label:'未付货款',value:6},
                {label:'已付预付款',value:9},
              ]
            }
          }else if(mytype == 2){//我是经营
            if(checkedusertype ==  2){//所选为采购
              this.orderoptions = [
                {label:'未付筐子款',value:7},
                {label:'已付借款',value:8},
                {label:'已付其他',value:10}
              ]
            }else{//所选为供货商，经营户
              this.orderoptions = [
                {label:'未付筐子款',value:7},
                {label:'已付借款',value:8},
                {label:'已付其他',value:10},
                {label:'未付货款',value:6},
                {label:'已付预付款',value:9},
              ]
            }
          }else{//我是供货
            this.orderoptions = [
              {label:'未付筐子款',value:7},
              {label:'已付借款',value:8},
              {label:'已付其他',value:10}
            ]
          }
        }
      }else{//所选非平台
        if(this.form.usertype == 2){//付款人
          if(mytype == 1){
            this.orderoptions = [
              {label:'未收筐子款',value:2},
              {label:'已收借款',value:3},
              {label:'已收其他',value:5}
            ]
          }else{
            this.orderoptions = [
              {label:'未收筐子款',value:2},
              {label:'已收借款',value:3},
              {label:'已收其他',value:5},
              {label:'未收货款',value:1},
              {label:'已收预付款',value:4},
            ]
          }
        }else{ //收款人
          if(mytype == 3){
            this.orderoptions = [
              {label:'未付货款',value:6},
              {label:'未付筐子款',value:7},
              {label:'已付借款',value:8},
              {label:'已付其他',value:10},
            ]
          }else if(mytype == 1 || mytype == 2){
            this.orderoptions = [
              {label:'未付货款',value:6},
              {label:'未付筐子款',value:7},
              {label:'已付预付款',value:9},
              {label:'已付借款',value:8},
              {label:'已付其他',value:10},
            ]
          }else{
            this.orderoptions = []
          }
        }
      }
    },
    checkedUser(val){
      this.form.transferNoteType = '';
      this.orderoptions = [];
      this.isFPT = val[0] == 1 ? 1 : 2;
      if(this.isFPT == 1){
        // console.log(this.form.userId[1])
        let res = { toUserId:this.form.userId[1] }
        getpayVerify(res).then(resp=>{
          if(resp.status != 200){
            this.form.userId = '';
            this.orderoptions = [];
            this.form.transferNoteType = '';
            this.VerifyWindow = true;
            this.VerifyData = resp.data[0];
          }else{
            let optionobj = this.options[0].children
            for(let i=0;i<optionobj.length;i++){
              if(res.toUserId == optionobj[i].value){
                this.form.userPhone = optionobj[i].phone
              }
            }
          }
        })
      }else{
        let obj = this.form.userId[1].split(',')
        this.form.phone = obj[1]
        this.form.fromUserName = obj[0]
        this.form.fromUserPhone = obj[1]
        this.form.userPhone = obj[1]
      }
      this.getType();
    },
    remind(){
      let res = { orderType:7,orderID:this.VerifyData.orderId,returnUserId:this.form.userId[1] }
      remind(res).then(resp=>{
        this.$success('已成功提醒对方！')
      })
    },
    toPage(){
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
    getUser(){
      let res = {modelType:4,pageindex:0,pagesize:0}
      getUser(res).then(resp=>{
        this.ptusermsg = resp.data
        for(var i in resp.data) {
          var tempArr = {}
          tempArr['value'] = resp.data[i]['userId']
          tempArr['label'] = resp.data[i]['personName']
          tempArr['phone'] = resp.data[i]['phoneNumber']
          this.options[0].children.push(tempArr)
        }
      })
    },
    getFUser(){
      getFUser().then(resp=>{
        this.fptusermsg = resp.data
        for(var i in resp.data) {
          var tempArr = {}
          tempArr['value'] = resp.data[i]['cusname'] + ',' + resp.data[i]['phonenumber'] 
          tempArr['label'] = resp.data[i]['cusname']
          tempArr['phone'] = resp.data[i]['phonenumber']
          this.options[1].children.push(tempArr)
        }
      })
    },
    initialize(){
      this.form = {
        transferNoteTimestamp:null,
        userId:'',
        userPhone:'',
        usertype:'1',
        transferNoteType:'',
        transferNoteReason:'',
        transferPrice:'',
        payType:[],
        weChat:0,
        alipay:0,
        bank:0,
        cash:0,
        payPassword:''
      }
      this.$nextTick(()=>{
        this.$refs.form.resetFields();
      })
    },
  },
  created(){
    this.initialize();
    this.getUser();
    this.getFUser();
    this.changeorder();
  }
}
</script>
<style scoped lang="scss">
::v-deep .el-form-item__content{
  width: 100% !important;
}
::v-deep .el-input--prefix .el-input__inner{
  padding-left:60px;
}
.price_input_styl ::v-deep .el-input__prefix{
  top:5px;
}
.paytype_styl /deep/ .el-form-item__label{
    display: none !important;
  }
.paytype_input_styl{
  width: 100%;
  background: #F9F9F9;
  border-radius: 8px;
  padding: 15px 10px;
  /deep/.el-input__prefix {
    top:5px
  }
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