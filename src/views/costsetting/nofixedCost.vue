<template>
    <Page class="nofixedCostModel">
        <el-row>
            <el-col :span="1">年份:</el-col>
            <el-col :span="18">
                <div class="yearbtn" :class="{ checkedyearbtn: checkyear == item }" @click="changeYear(item)"
                    v-for="(item, index) in pageData.year_list" :key="index">
                    {{ item }}
                </div>
            </el-col>
            <el-col :span="4">
                <el-button type="primary" size="small" plain
                    @click="handleJumpDetail1('viewyearDetails',{year:checkyear})">查看当年明细</el-button>
                <el-button type="primary" size="small"
                    @click="handleJumpDetail('batchnofixedCostSetting',{years:checkyear})">批量配置</el-button>
            </el-col>
        </el-row>
        <el-row style="margin-top: 25px">
            <el-col :span="4">
                <p style="color: #010621; font-size: 14px">非固定成本总额(元)</p>
                <span style="color: #010621; font-size: 24px">{{
          moneyFormatTwo(pageData.buyCostMoney+pageData.sellCostMoney+pageData.transportMoney+pageData.loaddingMoney)
        }}</span>
            </el-col>
            <el-col :span="4">
                <p style="color: #010621; font-size: 14px">采购计费金额(元)</p>
                <span style="color: #010621; font-size: 24px">{{
          moneyFormatTwo(pageData.buyCostMoney)
        }}</span>
            </el-col>
            <el-col :span="4">
                <p style="color: #010621; font-size: 14px">销售计费金额(元)</p>
                <span style="color: #010621; font-size: 24px">{{
          moneyFormatTwo(pageData.sellCostMoney)
        }}</span>
            </el-col>
            <el-col :span="4">
                <p style="color: #010621; font-size: 14px">运输费(元)</p>
                <span style="color: #010621; font-size: 24px">{{
          moneyFormatTwo(pageData.transportMoney)
        }}</span>
            </el-col>
            <el-col :span="4">
                <p style="color: #010621; font-size: 14px">装卸费(元)</p>
                <span style="color: #010621; font-size: 24px">{{ moneyFormatTwo(pageData.loaddingMoney) }}</span>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <el-table :data="tableData" style="border: 1px solid #e9e9e9">
            <el-table-column label="月份" prop="month">
                <template slot-scope="scope">
                    {{ scope.row.month }}月
                </template>
            </el-table-column>
            <el-table-column label="状态" prop="state">
                <template slot-scope="scope">
                    <span style="color: #DD4C4D;" v-if="scope.row.state==0">未设置</span>
                    <span style="color: #0BA198;" v-if="scope.row.state==1">已计费</span>
                    <span style="color: #1A7FD9;" v-if="scope.row.state==2">未计费</span>
                </template>
            </el-table-column>
            <el-table-column label="非固定成本总额" prop="buyCostMoney">
                <template slot-scope="scope">
                    <span
                        v-if="(scope.row.buyCostMoney +scope.row.sellCostMoney+scope.row.transport_money+scope.row.loadding_money)==0">--</span>
                    <span v-else>
                        {{ moneyFormatTwo(scope.row.buyCostMoney +scope.row.sellCostMoney+scope.row.transport_money+scope.row.loadding_money)}}元
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="采购计费金额" prop="buyCostMoney">
                <template slot-scope="scope">
                    <span v-if="scope.row.buyCostMoney==0">--</span>
                    <span v-else>
                        {{ moneyFormatTwo(scope.row.buyCostMoney)}}元
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="销售计费金额" prop="sellCostMoney">
                <template slot-scope="scope">
                    <span v-if="scope.row.sellCostMoney==0">--</span>
                    <span v-else>
                        {{ moneyFormatTwo(scope.row.sellCostMoney)}}元
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="运输费" prop="transport_money">
                <template slot-scope="scope">
                    <span v-if="scope.row.transport_money==0">--</span>
                    <span v-else>
                        {{ moneyFormatTwo(scope.row.transport_money)}}元
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="装卸费" prop="loadding_money">
                <template slot-scope="scope">
                    <span v-if="scope.row.loadding_money==0">--</span>
                    <span v-else>
                        {{ moneyFormatTwo(scope.row.loadding_money)}}元
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" v-if="scope.row.state==1"
                        @click="handleJumpDetail1('viewmonthDetails',{row:scope.row,year:checkyear})">
                        详情</el-button>
                    <el-button type="text" size="small" v-if="scope.row.is_set"
                        @click="handleJumpDetail('nofixedCostSetting',{years:checkyear,...scope.row})">配置</el-button>
                </template>
            </el-table-column>
        </el-table>
    </Page>
</template>

<script>
    import {
        Base64
    } from "js-base64";
    import {
        costunfixdList
    } from "@/request/api/nofixedCost/index.js";
    export default {
        name: "nofixedCost",
        data() {
            return {
                checkyear: 2022,
                pageData: {},
                tableData: [],
            };
        },
        methods: {
            // 数值取两位小数
            moneyFormatTwo(moneyStr) {
                // 先将数值取两位小数
                let money = Number(moneyStr).toFixed(2).toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                return money
            },
            changeYear(val) {
                this.checkyear = val;
                this.costunfixdList();
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
            // 跳转页面
            handleJumpDetail2: function (form, record) {
                this.$router.push({
                    path: form,
                    query: {
                        data: encodeURIComponent(JSON.stringify(record)),
                    },
                });
            },
            // 跳转页面
            handleJumpDetail1: function (form, record) {
                this.$router.push({
                    path: form,
                    query: {
                        year: this.checkyear,
                        data: encodeURIComponent(JSON.stringify(record)),
                    },
                });
            },
            costunfixdList() {
                costunfixdList({
                    years: this.checkyear
                }).then((resp) => {
                    this.pageData = resp.data;
                    this.tableData = resp.data.month_data;
                });
            },
        },
        created() {
            this.costunfixdList();
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