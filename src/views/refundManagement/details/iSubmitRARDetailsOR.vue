<template>
  <Page>
    <!-- 我发出的仅退款 -->
    <div style="margin-bottom:16px;">
      <div class="title_layout" ><font style="color:#010621;font-weight:900;">订单信息</font></div>
      <div class="title_layout" style="text-align:right;font-size: 14px;"><font style="color: rgba(1,6,33,0.55);">操作人:</font>{{ pageData.addByUserName }}</div>
    </div>
    <el-descriptions :column="3">
      <el-descriptions-item v-for="(item,index) in showOrderMsg.msg" :key="'ordermsg'+index" :label='getJinELabel(item)'>
        <font :style="getListFontColor(item)" v-if="item.label != '合计确认金额'">{{ item.value }}</font>
        <font :style="getListFontColor(item)" v-if="item.label == '合计确认金额' && pageData.actualRefund == 0 && pageData.confirmedAmount == 0">{{ item.value }}</font>
        <el-tooltip class="item" effect="dark" placement="bottom"  v-if="item.label == '合计确认金额' && pageData.actualRefund > 0 && pageData.confirmedAmount > 0">
          <el-link :underline="false" :style="'text-decoration:underline;'+getListFontColor(item)">{{ item.value }}</el-link>
          <div slot="content">
            <p style="font-size:14px;">实际收款:{{ currencyFormat(pageData.actualRefund) }}</p>
            <p style="font-size:12px;">线上支付:{{ currencyFormat(pageData.sellerCash) }}</p>
            <p style="font-size:12px;">线下支付（支付宝）:{{ currencyFormat(pageData.payInfo.aliPay) }}</p>
            <p style="font-size:12px;">线下支付（微信）:{{ currencyFormat(pageData.payInfo.weChat) }}</p>
            <p style="font-size:14px;">确认金额:{{ currencyFormat(pageData.confirmedAmount) }}</p>
            <p style="font-size:12px;">经营往来款抵充:{{ currencyFormat(pageData.offset) }}</p>
            <p style="font-size:12px;">预付款抵扣:{{ currencyFormat(pageData.advancePrice) }}</p>
            <p style="font-size:12px;">借款抵扣:{{ currencyFormat(pageData.loan) }}</p>
          </div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" placement="bottom"  v-if="item.label == '合计确认金额' && pageData.actualRefund > 0 && pageData.confirmedAmount == 0">
          <el-link :underline="false" :style="'text-decoration:underline;'+getListFontColor(item)">{{ item.value }}</el-link>
          <div slot="content">
            <p style="font-size:14px;">实际收款:{{ currencyFormat(pageData.actualRefund) }}</p>
            <p style="font-size:12px;">线上支付:{{ currencyFormat(pageData.sellerCash) }}</p>
            <p style="font-size:12px;">线下支付（支付宝）:{{ currencyFormat(pageData.payInfo.aliPay) }}</p>
            <p style="font-size:12px;">线下支付（微信）:{{ currencyFormat(pageData.payInfo.weChat) }}</p>
          </div>
        </el-tooltip>
        <el-tooltip class="item" effect="dark" placement="bottom"  v-if="item.label == '合计确认金额' && pageData.actualRefund == 0 && pageData.confirmedAmount > 0">
          <el-link :underline="false" :style="'text-decoration:underline;'+getListFontColor(item)">{{ item.value }}</el-link>
          <div slot="content">
            <p style="font-size:14px;">确认金额:{{ currencyFormat(pageData.confirmedAmount) }}</p>
            <p style="font-size:12px;">经营往来款抵充:{{ currencyFormat(pageData.offset) }}</p>
            <p style="font-size:12px;">预付款抵扣:{{ currencyFormat(pageData.advancePrice) }}</p>
            <p style="font-size:12px;">借款抵扣:{{ currencyFormat(pageData.loan) }}</p>
          </div>
        </el-tooltip>
      </el-descriptions-item>
    </el-descriptions>
    <div class="aboutOrder">
      <el-row>
        <el-col :span="8">关联采购单:<el-button type="text" style="color:#0BA198;">{{pageData.orderSellNo}}<i class="el-icon-arrow-right"></i></el-button></el-col>
        <el-col :span="8">采购时间:<span>{{ toDate(pageData.orderSellTime) }}</span></el-col>
      </el-row>
    </div>
    <div class="button_layout">
      <!--  v-if="showOrderMsg.isShowCR" -->
      <div style="width:50%;padding-left:20px;"><el-button type="text"  @click="collectionRecord()">收款记录</el-button></div>
      <div style="width:50%;text-align:right;">
        <el-button size="mini">打印</el-button>
        <el-button size="mini" v-for="(item,index) in showOrderMsg.button" :key="'button'+index" :type="item.type" @click="functionBtn(item.label)">{{ item.label }}</el-button>
      </div>
    </div>
    <el-divider></el-divider>
    <div style="margin-bottom:16px;">
      <div class="title_layout" ><font style="color:#010621;font-weight:900;">客户信息</font></div>
    </div>
    <el-descriptions :column="3">
      <el-descriptions-item label="客户姓名">
        {{ pageData.customerName }}
        <el-tag type="info" v-if="pageData.userClass == ''">非</el-tag>
        <el-tag v-if="pageData.userClass == 3 ">供</el-tag>
        <el-tag type="danger" v-if="pageData.userClass == 1">经</el-tag>
        <el-tag type="warning" v-if="pageData.userClass == 2">采</el-tag>
      </el-descriptions-item>
      <el-descriptions-item label="联系电话">{{ pageData.customerPhone }}</el-descriptions-item>
      <el-descriptions-item label="企业名称" v-if="pageData.userClassType == 1">{{ pageData.usercompanyname }}</el-descriptions-item>
    </el-descriptions>
    <el-divider></el-divider>
    <div style="margin-bottom:16px;">
      <div class="title_layout" ><font style="color:#010621;font-weight:900;">商品信息</font></div>
    </div>
    <div v-for="(item,index) in pageData.orderDetails" :key="'goods' + index" style="border-bottom:1px solid #E6E6E6;">
      <div class="goods_styls">
        <div class="xiangqing_layout">
          <div>{{ item.firstCategory +'-'+ item.secondCategory +'-'+ item.productName }}</div>
        </div>
        <el-descriptions :column="5" style="margin-top:15px;">
          <el-descriptions-item label="品种/品牌">{{ item.variety }}</el-descriptions-item>
          <el-descriptions-item label="产地">{{ item.region }}</el-descriptions-item>
          <el-descriptions-item label="级别/规格">{{ item.spec }}</el-descriptions-item>
          <el-descriptions-item label="计算单位">{{ item.subUnit }}</el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="5" style="margin-top:5px;">
          <el-descriptions-item label="商品数量"> 
            <span v-html="getStock(item.subUnit,item.subUnit2,item.subUnit3,item.pieceUnit,item.subUnit2Weight,item.subUnit3Weight,
                                    item.productCount,item.returnBasketCount,item.piecenumber)"></span>
          </el-descriptions-item>
          <el-descriptions-item label="商品金额"><font style="color:red;">{{ currencyFormat(item.productTotalPrice)+'元' }}</font></el-descriptions-item>
        </el-descriptions>
      </div>
      <div style="text-align:right;padding:15px 15px;">
        本次退款金额:<font style="color:red;">{{ currencyFormat(item.detailTotalPrice) +'元'}}</font>
      </div>
    </div>
    <div style="margin-top:16px;">
      <div class="title_layout" ><font style="color:#010621;font-weight:900;">合计</font></div>
    </div>
    <div style="padding:15px;border-bottom:1px dashed #e6e6e6;">
      <el-descriptions :column="5" style="margin-top:5px;">
        <el-descriptions-item label="退款商品种类">{{ Number(pageData.productTotalCount) +'种'}}</el-descriptions-item>
        <el-descriptions-item label="退款金额合计"><font style="color:red;">{{ currencyFormat(pageData.productTotalPrice)+'元' }}</font></el-descriptions-item>
      </el-descriptions>
    </div>
    <div style="margin-top:16px;">
      <div class="title_layout" ><font style="color:#010621;font-weight:900;">备注</font></div>
    </div>
    <div v-for="(item,index) in pageData.remark" :key="'remark'+index" style="font-size:14px;margin-top:10px;">
      <div>{{ toDate(item.createtime) }}</div>
      <!-- <div v-for="(item2,index) in item.remark" :key="'remark2'+index">{{ item2 }}</div> -->
      <div>{{ item.displayName + item.remark[0] }}</div>
    </div>
    <div style="height:100px;"></div>
  </Page>
</template>
<script>
import moment  from 'moment';
import { getInfo } from '@/request/api/refundsGoods/index'
export default{
  data(){
    return{
      pageData:{},
      showOrderMsg:{
        msg:[],
        button:[],
        isShowCR:false
      },
    }
  },
  methods:{
    functionBtn(){
      //#添加收款*2   #取消退款单   #修改退款单   #提醒卖家退款   #处理批量收款单   #退回修改
      //#确认收款   #取消订单   #修改订单  #撤回取消  #撤回修改  #待对方付款
    },  
    getListFontColor(item){
      if(item.label != '订单状态'){
        return 'color:#010621;'
      }else{
        if(item.value == '已结清'){
          return 'color:#0BA198;'
        }else{
          return 'color:#DF971A;'
        }
      }
    },
    getJinELabel(item){
      if(item.label != '合计确认金额'){
        return item.label
      }else{
        if(this.pageData.actualRefund > 0 && this.pageData.confirmedAmount > 0){
          return '合计确认金额'
        }else if(this.pageData.actualRefund > 0 && this.pageData.confirmedAmount == 0){
          return '实际收款'
        }else if(this.pageData.actualRefund == 0 && this.pageData.confirmedAmount > 0){
          return '确认金额'
        }else{
          return '实际收款'
        }
      }
    },
    status7(){
      let res = [{
        label:'退款单编号',
        value:this.pageData.orderReturnNo
      },{
        label:'订单状态',
        value:'未结清'
      },{
        label:'退款时间',
        value:this.toDate(this.pageData.timestamp)
      },{
        label:'退款金额',
        value:this.currencyFormat(this.pageData.orderTotalPrice)+'元'
      },{
        label:'已付金额',
        value:this.currencyFormat(this.pageData.actualPayPrice)+'元'
      },{
        label:'剩余未付',
        value:this.currencyFormat(this.pageData.orderTotalPrice - this.pageData.actualPayPrice)+'元'
      }]
      let button = [{
        label:'添加收款',
        type:'primary'
      }]
      this.showOrderMsg.msg = res;
      this.showOrderMsg.button = button;
      this.showOrderMsg.isShowCR = true;
    },
    status6(){
      let res = [{
        label:'退款单编号',
        value:this.pageData.orderReturnNo
      },{
        label:'订单状态',
        value:'已结清'
      },{
        label:'退款时间',
        value:this.toDate(this.pageData.timestamp)
      },{ 
        label:'退款金额',
        value:this.currencyFormat(this.pageData.orderTotalPrice)+'元'
      },]
      let button = [{
        label:'取消退款单',
        type:''
      },{
        label:'修改退款单',
        type:''
      },{
        label:'添加收款',
        type:'primary'
      }]
      this.showOrderMsg.msg = res;
      this.showOrderMsg.button = button;
      this.showOrderMsg.isShowCR = false; 
    },
    status5(){
      let res = [{
        label:'退款单编号',
        value:this.pageData.orderReturnNo
      },{
        label:'订单状态',
        value:'已结清'
      },{
        label:'退款时间',
        value:this.toDate(this.pageData.timestamp)
      },{
        label:'退款金额',
        value:this.currencyFormat(this.pageData.orderTotalPrice)+'元'
      },]
      let button = []
      this.showOrderMsg.msg = res;
      this.showOrderMsg.button = button;
      this.showOrderMsg.isShowCR = false;
    },
    status4(){
      let res = [{
        label:'退款单编号',
        value:this.pageData.orderReturnNo
      },{
        label:'订单状态',
        value:'未结清'
      },{
        label:'退款时间',
        value:this.toDate(this.pageData.timestamp)
      },{
        label:'退款金额',
        value:this.currencyFormat(this.pageData.orderTotalPrice)+'元'
      },{
        label:'已收金额', 
        value:this.currencyFormat(this.pageData.actualPayPrice)+'元'
      },{
        label:'剩余未收',
        value:this.currencyFormat(this.pageData.orderTotalPrice - this.pageData.actualPayPrice)+'元'
      }]
      let button = [{
        label:'提醒卖家退款',
        type:'primary'
      }]
      this.showOrderMsg.msg = res;
      this.showOrderMsg.button = button;
      this.showOrderMsg.isShowCR = true;
    },
    status3(){
      let res = [{
        label:'退款单编号',
        value:this.pageData.orderReturnNo
      },{
        label:'订单状态',
        value:'待收款'
      },{
        label:'退款时间',
        value:this.toDate(this.pageData.timestamp)
      },{
        label:'退款金额',
        value:this.currencyFormat(this.pageData.orderTotalPrice)+'元'
      },{
        label:'已收金额',
        value:this.currencyFormat(this.pageData.actualPayPrice)+'元'
      },{
        label:'剩余未收',
        value:this.currencyFormat(this.pageData.orderTotalPrice - this.pageData.actualPayPrice)+'元'
      },{
        label:'本次收款时间',
        value:this.toDate(this.pageData.useTimes)
      },{
        label:'合计确认金额',
        value:this.currencyFormat(this.pageData.totalPrice)+'元'
      },];
      //判断是否批量
      let button = []
      if(this.pageData.isBatchPay == 1){
        button = [{
          label:'处理批量收款单',
          type:'primary'
        }]
      }else{
        button = [{
          label:'退回修改',
          type:''
        },{
          label:'确认收款',
          type:'primary'
        }]
      }
      this.showOrderMsg.msg = res;
      this.showOrderMsg.button = button;
      this.showOrderMsg.isShowCR = true;
    },
    status2(){
      let res = [{
        label:'退款单编号',
        value:this.pageData.orderReturnNo
      },{
        label:'订单状态',
        value:'待修改'
      },{
        label:'退款时间',
        value:this.toDate(this.pageData.timestamp)
      },{
        label:'退款金额',
        value:this.currencyFormat(this.pageData.orderTotalPrice)+'元'
      },];
      let button = [{
        label:'取消订单',
        type:''
      },{
        label:'修改订单',
        type:'primary'
      }]
      this.showOrderMsg.msg = res;
      this.showOrderMsg.button = button;
      this.showOrderMsg.isShowCR = false;
    },
    status1(){
      let res = [{
        label:'退款单编号',
        value:this.pageData.orderReturnNo
      },{
        label:'订单状态',
        value:'待对方付款'
      },{
        label:'退款时间',
        value:this.toDate(this.pageData.timestamp)
      },{
        label:'退款金额',
        value:this.currencyFormat(this.pageData.orderTotalPrice)+'元'
      },];
      let button = [{
        label:'撤回取消',
        type:''
      },{
        label:'撤回修改',
        type:''
      },{
        label:'待对方付款',
        type:'primary'
      }]
      this.showOrderMsg.msg = res;
      this.showOrderMsg.button = button;
      this.showOrderMsg.isShowCR = false;
    },
    getOrderMsg(){
      let type = this.pageData.status;
      if(this.pageData.orderType == 1){//平台
        if(type == 1){
          this.status1()
        }else if(type == 2){
          this.status2()
        }else if(type == 3){
          this.status3()
        }else if(type == 4){
          this.status4()
        }else if(type == 5){
          this.status5()
        }
      }else{//非平台
        if(type == 6){
          this.status6()
        }else if(type == 4){
          this.status7()
        }else if(type == 5){
          this.status5()
        }
      }
    },
    getInfo(){
      let orderid = this.$route.query.id
      let res = {
        orderReturnId:orderid,
        is_receive:0
      }
      getInfo(res).then(resp=>{
        this.pageData = resp.data[0]
        // console.log(this.pageData)
        this.getOrderMsg()
      })
    },
    currencyFormat(num){//科学记数 保留两位小数
      let a = Number(num).toFixed(2).toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
      return a 
    },
    getStock(subunit,subunit2,subunit3,pieceunit,subunit2weight,subunit3weight,stock,basket,piececount){
      let first = stock+subunit;
      let next2 = subunit2 == '' ? '' : subunit2weight+subunit2+'/'+subunit
      let next3 = subunit3 == '' ? '' : subunit3weight+subunit3+'*'
      let next4 = pieceunit == '' ? '' : '('+piececount+pieceunit+')'
      let last = basket == 0 ? '' : '|'+basket+'<font style="color:#DF971A;">筐</font>' 
      let kuohao1 = subunit2 == '' ? '' : '('
      let kuohao2 = subunit2 == '' ? '' : ')'
      return first+kuohao1+next3+next2+kuohao2+next4+last
    },
    toDate(val){//时间戳格式化
      return moment(val*1000).format('YYYY-MM-DD HH:mm:ss');
    },
  },
  created(){
    this.getInfo()
  },
}
</script>
<style lang="scss" scoped >
.total_styl_layout{
  display: inline-block;
  margin-right: 30px;
}
.total_style{
  padding: 15px 25px;
  border:1px solid #E9E9E9;
  background: rgba(1,6,33,0.02);
}
.total_style1{
  padding: 15px 25px;
  // border:1px solid #E9E9E9;
  // background: rgba(1,6,33,0.02);
}
.xiangqing_layout div{
  display: inline-block;
  width: 50%;
}
.goods_styls{
  border-bottom: 1px dashed #E6E6E6;
  padding-bottom: 10px;
}
.el-tag{
  padding: 0px 1px !important;
}
.el-tag--medium {
  height: 17px !important;
  line-height: 17px !important;
}
.button_layout{
  margin-top: 16px;
  div {
    display: inline-block;
  }
}
.page_style{
  font-family: PingFangSC-Medium, PingFang SC;
}
.title_layout{
  display: inline-block;
  width: 50%;
}
.aboutOrder{
  background: rgba(1,6,33,0.02);
  font-size: 14px;
  padding: 16px 24px;
}
</style>
