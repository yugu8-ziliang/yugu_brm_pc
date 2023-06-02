<template>
  <Page>
    <el-row>
      <el-col :span="18">
        <h3>订单信息</h3>
      </el-col>
      <el-col :span="3">
        操作人:{{orderMsg.addByUserName}}
      </el-col>
      <el-col :span="3" style="text-align:right;">
        <el-button>打印</el-button>
      </el-col>
    </el-row>
    <el-descriptions title="" :column="3">
      <el-descriptions-item label="订单编号">{{ orderMsg.orderBasketId }}</el-descriptions-item>
      <el-descriptions-item label="订单状态">
        <font color="red">
          {{ orderMsg.orderStatus == 3 ? '待确认' :
            orderMsg.orderStatus == 4 ? '待对方收款' :
            orderMsg.orderStatus == 5 ? '未结清' : '已结清'
          }}
        </font>
      </el-descriptions-item>
      <el-descriptions-item label="售出时间">{{ toDate(orderMsg.buyTimestamp) }}</el-descriptions-item>
      <el-descriptions-item label="订单金额">{{ currencyFormat(orderMsg.totalPrice) }}</el-descriptions-item>
      <el-descriptions-item label="已收金额" v-if="type == 0">
        {{ currencyFormat(orderMsg.actualPayPrice) }}
      </el-descriptions-item>
      <el-descriptions-item label="剩余未收" v-if="type == 0">
        {{ currencyFormat(orderMsg.shouldPayPrice) }}
      </el-descriptions-item>
      <el-descriptions-item label="待对方确认金额" v-if="type != 0">
        <el-link style="color:#0BA198;">{{ currencyFormat(orderMsg.waitGetPrice) }}</el-link>
      </el-descriptions-item>
      <el-descriptions-item label="创建时间">{{ toDate(orderMsg.timestamp) }}</el-descriptions-item>
      <el-descriptions-item label="成交时间" v-if="type == 0">
        {{ orderMsg.confirmTimestamp ? toDate(orderMsg.confirmTimestamp) : '暂无' }}
      </el-descriptions-item>
    </el-descriptions>
    <div style="text-align:left;">
      <el-button type="text" style=";color:#0BA198;">退款记录</el-button>
      <el-button type="text" style=";color:#0BA198;">收款记录</el-button>
      <el-button style="border:1px solid #0BA198;background-color: #0BA198;color:#fff;float:right;">添加付款</el-button>
      <el-button style="border:1px solid #0BA198;color:#0BA198;float:right;">退筐退款</el-button>
    </div>
    <el-divider></el-divider>
    <h3 style="margin-bottom:15px;">客户信息</h3>
    <el-descriptions :column="3">
      <el-descriptions-item label="客户姓名">
        {{ orderMsg.userName }}
      </el-descriptions-item>
      <el-descriptions-item label="联系电话">
        {{ orderMsg.phoneNumber }}
      </el-descriptions-item>
      <el-descriptions-item label="企业名称" v-if="type != 0">
        {{ orderMsg.companyName }}
      </el-descriptions-item>
    </el-descriptions>
    <h3>筐子信息</h3>
    <el-table :data="orderMsg.basketDetails" border>
      <el-table-column label="筐子种类" prop="basketName"></el-table-column>
      <el-table-column label="颜色" prop=""></el-table-column>
      <el-table-column label="单价(元/个)" prop=""></el-table-column>
      <el-table-column label="数量(个)" prop=""></el-table-column>
      <el-table-column label="金额(元)" prop=""></el-table-column>
    </el-table>
    <div style="border:1px solid #E4E7ED;padding: 10px;margin-bottom: 15px;">
      <el-row>
        <el-col :span="14">
          <span>总计:{{  }}种</span>
        </el-col>
        <el-col :span="5" style="text-align:right;">
          <span>{{  }}</span>
        </el-col>
        <el-col :span="5" style="text-align:right;color:red;">
          <span>{{  }}</span>
        </el-col>
      </el-row>
    </div>
    <h3>备注</h3>
    <div v-for="(remarkitem,remarkindex) in orderMsg.remarks" :key="'remark' + remarkindex">
      <span>{{ toDate(remarkitem.createtime) }}</span>
      <span style="margin-left:50px;">{{ remarkitem.type }}</span>
      <p>{{ remarkitem.remark }}</p>
    </div>
  </Page>
</template>
<script>
import moment  from 'moment';
import {getInfo} from '@/request/api/basketSold/index.js'
export default{
  data(){
    return{
      type:this.$route.query.type,
      id:this.$route.query.id,
      orderMsg:{},
    }
  },
  methods:{
    toDate(val){
      return moment(val*1000).format('YYYY-MM-DD HH:mm:ss');
    },
    currencyFormat(num){
      let a = Number(num).toFixed(2).toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
      return a
    },
    getInfo(){
      let res = {orderId:this.id} 
      getInfo(res).then(resp=>{
        // console.log(resp)
        this.orderMsg = resp.data[0]
        console.log(this.orderMsg)
        console.log(this.type)
      })
    },
  },
  created(){
    this.getInfo();
  },
}
</script>