<template>
  <Page>
    <el-row>
      <el-col :span="20">
        配置月份:
        <span v-for="(item,index) in queryData.yearsInfo" :key="'1'+index">{{item.years+'年'}}(<span
            v-for="(item2,index2) in item.month" :key="'2'+index2">{{item2 +'月'}}<span
              v-if="(index2+1) != item.month.length">,</span></span>)<span
            v-if="(index+1) != queryData.yearsInfo.length">、</span></span>
      </el-col>
      <el-col :span="4" style="text-align:right;">
        <el-button size="mini" type="primary" @click="handleJumpDetail(queryData.jump,queryData)">使用配置</el-button>
      </el-col>
      <el-col :span="20" style="margin-top:20px;">
        运输费配置:{{ queryData.transportmoney}}{{queryData.transportmoneyunit == 1 ? '元/斤' : '%' }}
      </el-col>
      <el-col :span="20" style="margin-top:20px;">
        装卸费配置:{{ queryData.loaddingmoney}}{{queryData.loaddingmoneyunit == 1 ? '元/斤' : '%' }}
      </el-col>
    </el-row>
    <h4 style="margin-top:20px;">交易费：</h4>
    <el-radio-group v-model="type" size="mini" style="margin-top:10px;" @change="buyOrSell">
      <el-radio-button label="销售计费"></el-radio-button>
      <el-radio-button label="采购计费"></el-radio-button>
    </el-radio-group>
    <div style="margin-top:20px;font-size:14px;border:1px solid #E9E9E9;" v-for="(item,index) in pageData"
      :key="'title'+index">
      <div style="background: rgba(0,0,0,0.04);padding:5px 10px;">
        交易费用:{{type == '销售计费' ? item.buyTransMoney : item.sellTransMoney}}
        <font style="margin-left:10px;;color:rgba(1,6,33,0.55);">{{item.number+'种'}}</font>
      </div>
      <div v-for="(item2,index2) in item.info" :key="'type1-2'+index2">
        <div v-for="(item3,index3) in item2.second" :key="'type2-2'+index3" style="padding:10px 15px;">
          <font style="color: rgba(1,6,33,0.55);">{{item2.name+'-'+item3.name+":"}}</font>
          <span v-for="(item4,index4) in item3.third" :key="'type3-2'+index4">{{item4.name}}<span
              v-if="(index4 + 1) != item3.third.length">、</span></span>
        </div>
      </div>
    </div>
  </Page>
</template>
<script>
  import {
    Base64
  } from "js-base64";
  import {
    getFloatingHistoryDetail
  } from '@/request/api/fixedCost/index.js'
  export default {
    data() {
      return {
        queryData: {},
        pageData: {},
        month: '',
        type: '销售计费'
      }
    },
    methods: {
      buyOrSell() {
        this.getInfo();
      },
      initData(val) {
        let {
          data: data
        } = this.$route.query;
        // 判断url是否为空
        if (data) {
          // 解析数据
          try {
            let param = JSON.parse(Base64.decode(data));
            // console.log(param);
            
            this.queryData = param;
            this.getInfo();
          } catch (error) {}
          return;
        }
      },
      getInfo() {
        getFloatingHistoryDetail({
          uid: this.queryData.uid
        }).then(resp => {
          this.pageData = this.type == '销售计费' ? resp.data[0].sell2 : resp.data[0].buy2
        })
      },
      // 跳转页面
      handleJumpDetail: function (form, record) {
        this.$closePage(form, {
          data: Base64.encode(JSON.stringify(record)),
        });
      },
    },
    created() {
      this.initData()
    }
  }
</script>