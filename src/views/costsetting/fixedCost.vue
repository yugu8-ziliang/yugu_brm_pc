<template>
  <Container class="fixedCostModel">
    <el-row>
      <el-col :span="1">年份:</el-col>
      <el-col :span="19">
        <div
          class="yearbtn"
          :class="{ checkedyearbtn: checkyear == item }"
          @click="changeYear(item)"
          v-for="(item, index) in pageData.year_list"
          :key="index"
        >
          {{ item }}
        </div>
      </el-col>
    
      <el-col :span="4">
        <el-button type="primary" size="small" @click="handleJumpDetail('batchFixedcostSettings',{years:checkyear})">批量配置</el-button>
      </el-col>
    </el-row>
    <el-row style="margin-top: 25px">
      <el-col :span="4">
        <p style="color: #010621; font-size: 14px">固定成本合计(元)</p>
        <span style="color: #010621; font-size: 24px">{{
          moneyFormat(pageData.fixed_cost)
        }}</span>
      </el-col>
      <el-col :span="4">
        <p style="color: #010621; font-size: 14px">已计费金额(元)</p>
        <span style="color: #010621; font-size: 24px">{{
          moneyFormat(pageData.deduct_cost)
        }}</span>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <el-table :data="tableData" style="border: 1px solid #e9e9e9">
      <el-table-column
        v-for="(item, index) in tableData2"
        :key="index"
        :prop="item.prop"
        :width="item.width"
        :label="item.label"
      >
        <template slot-scope="scope">
          <span v-if="scope.row[item.prop] == 0">--</span>
          <!-- <span v-else-if="scope.row[item.prop] == undefined">--</span> -->
          <span v-else-if="item.prop == 'month'">{{scope.row.month+'月'}}</span>
          <span v-else-if="item.prop == 'GPM'">{{scope.row.GPM+'%'}}</span>
          <span v-else-if="item.prop == 'SR'">{{scope.row.SR+'%'}}</span>
          <span v-else>{{moneyFormat(scope.row[item.prop])+'元'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleJumpDetail('fixedcostSettings',{year_list:pageData.year_list,years:checkyear,...pageData.cost_info[scope.$index]})" v-if="pageData.cost_info[scope.$index].is_set">配置</el-button>
        </template>
      </el-table-column>
    </el-table>
  </Container>
</template>

<script>
import { Base64 } from "js-base64";
import { getList } from "@/request/api/fixedCost/index.js";
export default {
  name: "fixedCost",
  data() {
    return {
      checkyear: 2022,
      pageData: {},
      tableData: [],
      tableData2: [],
    };
  },
  methods: {
    // 数值取两位小数
    moneyFormat(moneyStr) {
      if (moneyStr > 10000) {
        let a = Number(moneyStr / 10000).toFixed(2).toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g,"$1,") 
        return a 
      } else {
        let a = Number(moneyStr).toFixed(2).toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
        return a 
      }
    },
    changeYear(val) {
      this.checkyear = val;
      this.getList();
    },
    // 跳转页面
    handleJumpDetail: function (form, record) {
      this.$router.push({
        path: form,
        query: {
          data: Base64.encode(JSON.stringify(record)),
        },
      });
    },
    getList() {
      this.tableData=[];
      this.tableData2=[];
      getList({ years: this.checkyear }).then((resp) => {
        this.pageData = resp.data[0];
        let obj = this.pageData.cost_info;
        for (let i = 0; i < obj[0].info.length; i++) {
          this.tableData2.push({
            label: obj[0].info[i].costName,
            prop: "col" + (i + 6),
            width: "",
          });
        }
        for (let i = 0; i < obj.length; i++) {
          let paramD = {};
          for (let j = 0; j < obj[i].info.length; j++) {
            let ele = obj[i].info;
            paramD[this.tableData2[j].prop] = ele[j].costMoney;
          }
          this.tableData.push({
            month: obj[i].month,
            month_deduct_cost: obj[i].month_deduct_cost,
            GPM: obj[i].GPM,
            SR: obj[i].SR,
            month_sum: obj[i].month_sum,
            ...paramD,
          });
        }
        this.tableData2.unshift(
          { label: "月份", prop: "month", width: "" },
          { label: "已计费金额", prop: "month_deduct_cost", width: "" },
          { label: "期望毛利率", prop: "GPM", width: "" },
          { label: "商品损耗率", prop: "SR", width: "" },
          { label: "固定成本", prop: "month_sum", width: "" },
        );
      });
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
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