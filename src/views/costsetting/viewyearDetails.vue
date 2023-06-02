<template>
    <!-- 年度成本详情 -->
    <Page :title="title">
        <el-row>
            <el-col :span="18" style="color: rgba(1,6,33,0.9); font-size: 20px">非固定成本总额：{{moneyFormatTwo(pageData.totalMoney)
        }}元</el-col>
            <el-col :span="6">
                <el-button type="primary" size="small">历史配置</el-button>
            </el-col>
        </el-row>
        <el-row style="margin-top: 25px">
            <el-col :span="4">
                <p style="color: #010621; font-size: 14px">采购计费金额(元)</p>
                <span style="color: #010621; font-size: 24px">{{moneyFormatTwo(pageData.buyCostMoney)}}</span>
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
                <span style="color: #010621; font-size: 24px">{{
          moneyFormatTwo(pageData.loaddingMoney)
        }}</span>
            </el-col>
        </el-row>
        <el-divider></el-divider>
        <div style="color: rgba(1,6,33,0.9);margin-bottom:12px">成本明细</div>
        <el-table :data="tableData" style="border: 1px solid #e9e9e9">
            <el-table-column label="序号" type="index" width="100">
            </el-table-column>
            <el-table-column label="商品名称" prop="productName">
            </el-table-column>
            <el-table-column label="采购数量" prop="buyCount">
                <template slot-scope="scope">
                    <span v-if="scope.row.buyCount==0">--</span>
                    <span v-else>{{ scope.row.buyCount}}{{ scope.row.buyCostUnit==1?'元':scope.row.buyCostUnit==2?'吨':'--'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="采购金额" prop="buyTotalPrice">
                <template slot-scope="scope">
                    <span v-if="scope.row.buyTotalPrice==0">--</span>
                    <span v-else>{{ moneyFormatTwo(scope.row.buyTotalPrice)}}元</span>
                </template>
            </el-table-column>
            <el-table-column label="采购计费金额" prop="buyCostMoney">
                <template slot-scope="scope">
                    <span v-if="scope.row.buyCostMoney==0">--</span>
                    <span v-else>
                        {{ moneyFormatTwo(scope.row.buyCostMoney)}}元</i>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="销售数量" prop="sellCount">
                <template slot-scope="scope">
                    <span v-if="scope.row.sellCount==0">--</span>
                    <span v-else>{{ scope.row.sellCount}}{{ scope.row.sellCostUnit==1?'元':scope.row.sellCostUnit==2?'吨':'--'}}</span>
                </template>
            </el-table-column>
            <el-table-column label="销售金额" prop="sellTotalPrice">
                <template slot-scope="scope">
                    <span v-if="scope.row.sellTotalPrice==0">--</span>
                    <span v-else>{{ moneyFormatTwo(scope.row.sellTotalPrice)}}元</span>
                </template>
            </el-table-column>
            <el-table-column label="销售计费金额" prop="sellCostMoney">
                <template slot-scope="scope">
                    <span v-if="scope.row.sellCostMoney==0">--</span>
                    <span v-else>
                        {{ moneyFormatTwo(scope.row.sellCostMoney)}}元</i>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="运输费" prop="transportMoney">
                <template slot-scope="scope">
                    <span v-if="scope.row.transportMoney==0">--</span>
                    <span v-else>
                        {{ moneyFormatTwo(scope.row.transportMoney)}}元
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="装卸费" prop="loaddingMoney">
                <template slot-scope="scope">
                    <span v-if="scope.row.loaddingMoney==0">--</span>
                    <span v-else>
                        {{ moneyFormatTwo(scope.row.loaddingMoney)}}元
                    </span>
                </template>
            </el-table-column>
        </el-table>
    </Page>
</template>

<script>
    import {
        costUnFixdYearDetail
    } from "@/request/api/nofixedCost/index.js";
    export default {
        name: "viewyearDetails",
        data() {
            return {
                title: '',
                record: {},
                checkyear: this.$route.query.year,
                tableData: [],
                pageData: {},
            };
        },
        methods: {
            // 数值取两位小数
            moneyFormatTwo(moneyStr) {
                // 先将数值取两位小数
                let money = Number(moneyStr).toFixed(2).toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                return money
            },
            costUnFixdYearDetail() {
                this.record = JSON.parse(decodeURIComponent(this.$route.query.data));
                costUnFixdYearDetail({
                    year: this.checkyear,
                }).then((resp) => {
                    this.pageData = resp.data;
                    this.tableData = resp.data.details;

                });
                this.title = this.$route.query.year + '年度成本详情';
            },
        },
        created() {
            this.costUnFixdYearDetail();
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