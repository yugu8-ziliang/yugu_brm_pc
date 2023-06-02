<template>
    <!-- 月成本详情 -->
    <Page :title="title">
        <el-row>
            <el-col :span="18" style="color: rgba(1,6,33,0.9); font-size: 20px"> 非固定成本总额：{{moneyFormatTwo(pageData.totalMoney)
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
            <el-table-column label="采购数量" prop="buyCount" align="right">
                <template slot-scope="scope">
                    <span
                        v-if="scope.row.buyCostUnit==1||scope.row.buyCostUnit==2">{{ scope.row.buyCount}}{{scope.row.buyCostUnit==1?'斤':scope.row.buyCostUnit==2?'吨':'--'}}</span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column label="采购金额" prop="buyTotalPrice" align="right">
                <template slot-scope="scope">
                    <span v-if="scope.row.buyCostUnit==3">{{ moneyFormatTwo(scope.row.buyTotalPrice)}}元</span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column label="采购计费标准" prop="buyCostUnitPrice" align="right">
                <template slot-scope="scope">
                    <span v-if="scope.row.buyCostMoney==0">--</span>
                    <span v-else>
                        {{ scope.row.buyCostUnitPrice}}{{scope.row.buyCostUnit==1?'元/斤':scope.row.buyCostUnit==2?'元/吨':scope.row.buyCostUnit==3?'%':'--'}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="采购计费金额" prop="buyCostMoney" align="right">
                <template slot-scope="scope">
                    <span v-if="scope.row.buyCostMoney==0">-- <i class="el-icon-edit" style="color:#0BA198"
                            @click="amountChange('buyBtn')"></i></span>
                    <span v-else>
                        {{ moneyFormatTwo(scope.row.buyCostMoney)}}元 <i class="el-icon-edit" style="color:#0BA198"
                            @click="amountChange('buyBtn')"></i>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="销售数量" prop="sellCount" align="right">
                <template slot-scope="scope">
                    <span
                        v-if="scope.row.sellCostUnit==1||scope.row.sellCostUnit==2">{{ scope.row.sellCount}}{{scope.row.sellCostUnit==1?'斤':scope.row.sellCostUnit==2?'吨':'--'}}</span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column label="销售金额" prop="sellTotalPrice" align="right">
                <template slot-scope="scope">
                    <span v-if="scope.row.sellCostUnit==3">{{ moneyFormatTwo(scope.row.sellTotalPrice)}}元</span>
                    <span v-else>--</span>
                </template>
            </el-table-column>
            <el-table-column label="销售计费标准" prop="sellCostUnitPrice" align="right">
                <template slot-scope="scope">
                    <span v-if="scope.row.sellCostMoney==0">--</span>
                    <span v-else>
                        {{ scope.row.sellCostUnitPrice}}{{scope.row.sellCostUnit==1?'元/斤':scope.row.sellCostUnit==2?'吨/斤':scope.row.sellCostUnit==3?'%':'--'}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="销售计费金额" prop="sellCostMoney" align="right">
                <template slot-scope="scope">
                    <span v-if="scope.row.sellCostMoney==0">-- <i class="el-icon-edit" style="color:#0BA198"
                            @click="amountChange('sellBtn')"></i></span>
                    <span v-else>
                        {{ moneyFormatTwo(scope.row.sellCostMoney)}}元 <i class="el-icon-edit" style="color:#0BA198"
                            @click="amountChange('sellBtn')"></i>
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="运输费配置" prop="transportMoneyUnitPrice" align="right">
                <template slot-scope="scope">
                    {{ scope.row.transportMoneyUnitPrice}}{{scope.row.transportMoneyUnit==1?'元/斤':scope.row.transportMoneyUnit==2?'元/吨':'--'}}
                </template>
            </el-table-column>
            <el-table-column label="运输费" prop="transportMoney" align="right">
                <template slot-scope="scope">
                    <span v-if="scope.row.transportMoney==0">--</span>
                    <span v-else>
                        {{ moneyFormatTwo(scope.row.transportMoney)}}元
                    </span>
                </template>
            </el-table-column>
            <el-table-column label="装卸费配置" prop="loaddingMoneyUnitPrice" align="right">
                <template slot-scope="scope">
                    {{ scope.row.loaddingMoneyUnitPrice}}{{scope.row.loaddingMoneyUnit==1?'元/斤':scope.row.loaddingMoneyUnit==2?'元/吨':'--'}}
                </template>
            </el-table-column>
            <el-table-column label="装卸费" prop="loaddingMoney" align="right">
                <template slot-scope="scope">
                    <span v-if="scope.row.loaddingMoney==0">--</span>
                    <span v-else>
                        {{ moneyFormatTwo(scope.row.loaddingMoney)}}元
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <!-- 修改金额弹窗 -->
        <el-dialog title="修改金额" :visible.sync="isVisiableChange" :close-on-click-modal="false"
            :before-close="closeChange" top="50px" width="30%">
            <el-form :model="ruleForm" ref="ruleForm" label-width="100px">
                <el-form-item v-if="btnType == 'sellBtn'" label="销售计费金额:" prop="password">
                    <el-input placeholder="请输入" v-model.number="ruleForm.sellCostMoney" style="width:60%">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item v-if="btnType == 'buyBtn'" label="采购计费金额:" prop="password">
                    <el-input placeholder="请输入" v-model.number="ruleForm.buyCostMoney" style="width:60%">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeChange">取 消</el-button>
                <el-button type="primary" @click="submitChange">确 定</el-button>
            </div>
        </el-dialog>
    </Page>
</template>

<script>
    import {
        costUnFixdDetail,
        costUnFixdDetailUpdate
    } from "@/request/api/nofixedCost/index.js";
    // import {
    //     number
    // } from 'node_modules/_echarts@5.3.3@echarts';
    export default {
        name: "viewmonthDetails",
        data() {
            return {
                ruleForm: {
                    details_deduction_id: 0,
                    sellCostMoney: 0,
                    sellCostUnit: 0,
                    sellCostUnitPrice: 0,
                    buyCostMoney: 0,
                    buyCostUnit: 0,
                    buyCostUnitPrice: 0,
                },
                title: '',
                record: {},
                checkyear: this.$route.query.year,
                tableData: [],
                pageData: {},
                btnType: "", // 具体的按钮类型
                isVisiableChange: false,
            };
        },
        methods: {
            submitChange() {
                let param = {
                    details_deduction_id: this.tableData[0].details_deduction_id,
                    sellCostMoney: this.ruleForm.sellCostMoney,
                    sellCostUnit: this.tableData[0].sellCostUnit,
                    sellCostUnitPrice: this.tableData[0].sellCostUnitPrice,
                    buyCostMoney: this.ruleForm.buyCostMoney,
                    buyCostUnit: this.tableData[0].buyCostUnit,
                    buyCostUnitPrice: this.tableData[0].buyCostUnitPrice,
                }
                costUnFixdDetailUpdate(param).then((res) => {
                    this.isVisiableChange = false;
                    this.costUnFixdDetail();
                });
                this.isVisiableChange = false;
            },
            closeChange() {
                this.isVisiableChange = false;
            },
            amountChange(btnType) {
                this.btnType = btnType; // 具体的按钮
                this.isVisiableChange = true;
            },
            // 数值取两位小数
            moneyFormatTwo(moneyStr) {
                // 先将数值取两位小数
                let money = Number(moneyStr).toFixed(2).toString().replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,")
                return money
            },
            costUnFixdDetail() {
                this.record = JSON.parse(decodeURIComponent(this.$route.query.data));
                costUnFixdDetail({
                    year: this.checkyear,
                    month: this.record.row.month
                }).then((resp) => {
                    this.pageData = resp.data;
                    this.tableData = resp.data.details;
                });
                this.title = this.$route.query.year + '年' + this.record.row.month + '月成本详情';
            },
        },
        created() {
            this.costUnFixdDetail();
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

    ::v-deep .el-form-item__label {
        padding-right: 10px;
    }

    ::v-deep .el-dialog__body {
        padding: 30px 20px 10px;
    }
</style>