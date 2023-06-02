<template>
  <!-- <Page>
    <el-button @click="historyconfigBtn(2022)">历史配置</el-button> -->
  <el-dialog title="历史配置" :visible.sync="historyDialog" width="1100px" :before-close="historyDialogClose" top="50px">
    <div>
      <el-row>
        <el-col :span="2">年份:</el-col>
        <el-col :span="19">
          <div class="yearbtn" :class="{ checkedyearbtn: checkyear == 2022 }" @click="changeYear(2022)">2022</div>
          <div class="yearbtn" :class="{ checkedyearbtn: checkyear == 2023 }" @click="changeYear(2023)">2023</div>
          <div class="yearbtn" :class="{ checkedyearbtn: checkyear == 2024 }" @click="changeYear(2024)">2024</div>
          <div class="yearbtn" :class="{ checkedyearbtn: checkyear == 2025 }" @click="changeYear(2025)">2025</div>
          <div class="yearbtn" :class="{ checkedyearbtn: checkyear == 2026 }" @click="changeYear(2026)">2026</div>
        </el-col>
      </el-row>
      <el-row v-for="(item,index) in historyMsg" :key="'title'+index"
        style="margin-top:15px;border: 1px solid #E9E9E9;">
        <el-col :span="20" style="background:#E9E9E9;padding:8px 10px;margin-bottom:5px;">
          {{toDate2(item.timestamp)+'月'}}</el-col>
        <el-col :span="4" style="background:#E9E9E9;text-align:right;padding:8px 10px;margin-bottom:5px;">
          {{'记录数：'+item.num+"条"}}</el-col>
        <el-row v-for="(item2,index2) in item.data" :key="'num'+index2" style="border: 1px solid #E9E9E9;padding:5px;">
          <el-col :span="8">配置日期：{{ toDate(item2.timestamp) }}</el-col>
          <el-col :span="12" style="overflow: hidden; text-overflow:ellipsis; white-space: nowrap;">配置月份：
            <span v-for="(item3,index3) in item2.yearsInfo" :key="'3' + index3">{{item3.years+'年'}}(<span
                v-for="(item4,index4) in item3.month" :key="'4'+index4">{{item4 +'月'}}<span
                  v-if="(index4+1) != item3.month.length">,</span></span>)<span
                v-if="(index3+1) != item2.yearsInfo.length">、</span></span>
          </el-col>
          <el-col :span="4" style="text-align:right;">
            <el-button type="text" style="position: relative;top:10px;" @click="usesConfig(item2)">使用配置</el-button>
            <el-button type="text" style="position: relative;top:10px;" @click="goToDetail(item,item2)">配置详情</el-button>
          </el-col>
          <br>
          <el-col :span="4">运输费配置：{{ item2.transportmoney}}{{item2.transportmoneyunit == 1 ? '元/斤' : '%' }}</el-col>
          <el-col :span="4">装卸费配置：{{ item2.loaddingmoney}}{{item2.loaddingmoneyunit == 1 ? '元/斤' : '%'  }}</el-col>
          <el-col :span="4">交易商品：{{ item2.productnumber+'种' }}</el-col>
        </el-row>
      </el-row>
    </div>
  </el-dialog>
  <!-- </Page> -->
</template>
<script>
   import {
        Base64
    } from "js-base64";
  import {
    getFloatingHistory
  } from '@/request/api/fixedCost/index.js'
  import moment from 'moment';
  export default {
    data() {
      return {
        historyMsg: [],
        checkyear: 2022,
        queryData: {},
        historyDialog: false,
      }
    },
    methods: {
      goToDetail(item, item2) {
        this.historyDialogClose()

        let record = {
          month: this.queryData.month,
          years: this.queryData.years,
          jump:this.queryData.jump,
          ...item2
        }

        this.$router.push({
          path: "historyDateil",
          query: {
            data: Base64.encode(JSON.stringify(record)),
          },
        });
      },
      usesConfig(item) {
        this.$emit('submitData', item)
        this.historyDialogClose()
      },
      toDate(val) {
        return moment(val * 1000).format('YYYY-MM-DD HH:mm:ss');
      },
      toDate2(val) {
        return moment(val * 1000).format('M');
      },
      changeYear(val) {
        this.checkyear = val;
        getFloatingHistory({
          years: val
        }).then(resp => {
          this.historyMsg = resp.data
        })
      },
      historyDialogClose() {
        this.historyDialog = false;
      },
      historyconfigBtn(val) {
        this.historyDialog = true;
        this.queryData = val

        getFloatingHistory({
          years: val.years
        }).then(resp => {
          this.historyMsg = resp.data
        })
      },
    }
  }
</script>
<style scoped lang="scss">
  .yearbtn {
    border: 1px solid #d0d0d2;
    color: #d0d0d2;
    text-align: center;
    display: inline-block;
    padding: 1px 12px;
    border-radius: 3px;
    font-size: 12px;
    margin-right: 15px;
  }

  .checkedyearbtn {
    border: 1px solid #0ba198;
    color: #0ba198;
  }
</style>