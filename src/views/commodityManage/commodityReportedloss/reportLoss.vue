<template>
    <!-- 商品报损 -->
    <Page>
        <div>
            <h4>商品信息</h4>
            <h4 class="layout_styl_1">{{ goodMsg.name }}</h4>
            <el-row class="layout_styl_1 font_styl_1">
                <el-col :span="6">产地:{{ goodMsg.regionName }}</el-col>
                <el-col :span="6">级别/规格:{{ goodMsg.spec }}</el-col>
                <el-col :span="6">当前库存:
                    <span v-html="getStock(goodMsg.subUnit,goodMsg.subUnit2,goodMsg.subUnit3,goodMsg.pieceUnit,goodMsg.subUnit2Weight,
          goodMsg.subUnit3Weight,goodMsg.batchNumber,goodMsg.basketNumber,goodMsg.pieceNumber)"></span></el-col>
            </el-row>
            <el-divider></el-divider>
            <h4>批次列表&nbsp;&nbsp;&nbsp;&nbsp;<el-button style="color:#FFF;background:#0BA198;" size="mini"
                    @click="openBatchSelect">+ 选择批次</el-button>
            </h4>
            <div v-if="tableData.length > 0" class="layout_styl_1">
                <el-table :data="tableData" height="300px" style="border:1px solid #E9E9E9;">
                    <el-table-column label="编号" type="index"></el-table-column>
                    <el-table-column label="入库时间">
                        <template slot-scope="scope">
                            {{ scope.row.timestamp| parseTime }}
                        </template>
                    </el-table-column>
                    <el-table-column label="入库类型" prop="batchsourcename">
                        <template slot-scope="scope">
                            <el-button @click="toPageType(scope.row.batchsourcename)" type="text">
                                {{scope.row.batchsourcename}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="当前库存" prop="">
                        <template slot-scope="scope">
                            <span v-html="getStock(goodMsg.subUnit,goodMsg.subUnit2,goodMsg.subUnit3,goodMsg.pieceUnit,goodMsg.subUnit2Weight,
                  goodMsg.subUnit3Weight,scope.row.batchnumber,scope.row.basketnumber,scope.row.piecenumber)"></span>
                        </template>
                    </el-table-column>
                    <el-table-column label="入库成本单价" prop="costPrice">
                        <template slot-scope="scope">
                            {{ scope.row.costPrice + '元/' + goodMsg.subUnit }}
                        </template>
                    </el-table-column>
                    <el-table-column label="报损数量" prop="reportLossNumber"></el-table-column>
                    <el-table-column label="腾空筐子" prop="sumSoar">
                        <template slot-scope="scope">
                            <el-button type="text" @click="openBasketMsg(scope.row)">{{scope.row.sumSoar}}
                            </el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="报损金额" prop="reportLossCost"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="tableDataDel(scope.row.batchid)">移除</el-button>
                            <el-button type="text" @click="tableDataEdit(scope.row,scope.$index)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="table_count_styl">
                    <span class="table_count_styl_sum">合计</span>
                    <span class="table_count_styl_sum">批次数量:{{ tableData.length }}个</span>
                    <span class="table_count_styl_sum">报损总量:{{ getZongliang }}{{ goodMsg.subUnit }}</span>
                    <span class="table_count_styl_sum">腾空筐子:{{ getCountSoar }}个</span>
                    <span class="table_count_styl_sum">报损总额:{{ getSum }}元</span>
                </div>
            </div>
            <el-divider></el-divider>
            <h4 style="margin-top:15px;">报损原因</h4>
            <el-input style="width:30%" class="layout_styl_1" type="textarea" placeholder="请输入" v-model="remark"
                maxlength="200" show-word-limit rows='4' resize="none">
            </el-input>
            <div class="page_footer">
                <span style="margin-right:20px;">报损总额：<span style="color: #DD4C4D;">{{ getSum }}元</span></span>
                <el-button @click="submit('1')">确认并查看</el-button>
                <el-button type="primary" @click="submit('2')">确认并返回</el-button>
            </div>
        </div>

        <!-- 编辑批次 -->
        <el-dialog title="编辑批次" :visible.sync="editBatchDialog" width="60%" :before-close="editBatchDialogClose">
            <h4 class="layout_styl_1">{{ goodMsg.name }}</h4>
            <el-row class="layout_styl_1 font_styl_1">
                <el-col :span="6">产地：{{ goodMsg.regionName }}</el-col>
                <el-col :span="6">级别/规格：{{ goodMsg.spec }}</el-col>
            </el-row>
            <el-divider></el-divider>
            <el-row class="layout_styl_1 font_styl_1">
                <el-col :span="6">入库时间：{{ editBatchMsg.timestamp|parseTime }}</el-col>
                <el-col :span="6">入库类型：
                    <el-button @click="toPageType(editBatchMsg.batchsourcename)" type="text" size="mini"
                        style="margin-top:-3px;">{{editBatchMsg.batchsourcename}}</el-button>
                </el-col>
                <el-col :span="5">当前库存：
                    <span
                        v-html="getStock(goodMsg.subUnit,goodMsg.subUnit2,goodMsg.subUnit3,goodMsg.pieceUnit,goodMsg.subUnit2Weight,
                  goodMsg.subUnit3Weight,editBatchMsg.batchnumber,editBatchMsg.basketnumber,editBatchMsg.piecenumber)"></span>
                </el-col>
                <el-col :span="5">入库成本单价：{{ editBatchMsg.costPrice + '元/' + goodMsg.subUnit }}</el-col>
            </el-row>
            <el-divider></el-divider>
            <el-form :model="form" ref="form" :rules="rules" inline label-position="left" style="margin-top:15px;">
                <el-form-item label="报损数量" prop="reportLossNumber">
                    <el-input v-model.number="form.reportLossNumber" size="mini" style="margin-top:5px;">
                        <template slot="append">{{ goodMsg.subUnit }}</template>
                    </el-input>
                </el-form-item>
                <el-button type="text" style="margin:0px 10px;" @click="openBatchWeigh('批次')">
                    {{ goodMsg.subUnit =='斤' || goodMsg.subUnit =='公斤' || goodMsg.subUnit =='g' ?'批量过磅':'批量计件'}}
                </el-button>
                <el-form-item label="报损件数" prop="reportLossPiece"
                    v-if="goodMsg.subUnit !='斤' && goodMsg.subUnit !='公斤' && goodMsg.subUnit !='g'">
                    <el-input v-model.number="form.reportLossPiece" size="mini" style="margin-top:5px;">
                        <template slot="append">{{ goodMsg.pieceUnit == '筐(一次性)' ? '筐' : goodMsg.pieceUnit }}</template>
                    </el-input>
                </el-form-item>
                <span>报损金额
                    <el-tooltip class="item" effect="dark" content="报损金额包含报溢商品批次的报损，报溢商品批次成本为0" placement="top">
                        <i class="el-icon-question" style="color:#0BA198;"></i>
                    </el-tooltip>
                    :{{ getCost }}元</span>
                <div style="border-top:1px solid #E9E9E9;padding:10px 10px;" v-if="form.basketArr.length > 0">
                    <h4 style="margin-bottom:15px;">周转筐信息</h4>
                    <div v-for="(item,index) in form.basketArr" :key="'basket'+ index"
                        style="border-bottom:1px solid #E9E9E9;">
                        <p>【{{item.basketType}}】{{item.basketName}}</p>
                        <el-row v-for="(coloritem,colorindex) in item.info" :key="'color' + colorindex">
                            <el-col :span="2" style="color:#0BA198;">
                                <el-form-item>
                                    [{{coloritem.basketColor}}]
                                </el-form-item>
                            </el-col>
                            <el-col :span="3">
                                <el-form-item>
                                    载货:{{ coloritem.nums }}个
                                </el-form-item>
                            </el-col>
                            <el-col :span="6">
                                <el-form-item :prop="'basketArr.'+index+'.info.'+colorindex+'.soar'" label="腾空："
                                    :rules="[{required: true, message: '请填写报损数量', trigger: 'blur'}]">
                                    <el-input v-model.number="coloritem.soar" style="width:70%;margin-top:3px;"
                                        size="mini">
                                        <template slot="append">个</template>
                                    </el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </div>
                    <p style="text-align:right;margin:10px 10px;">
                        共腾空{{ sumSoar }}个筐子
                    </p>
                </div>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editBatchDialogClose" size="mini">取 消</el-button>
                <el-button type="primary" @click="editBatchSubmit" size="mini">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 选择批次 -->
        <el-dialog title="选择批次" :visible.sync="selectBatchDialog" width="60%" :before-close="selectBatchClose">
            <h4 class="layout_styl_1">{{ goodMsg.name }}</h4>
            <el-row class="layout_styl_1 font_styl_1">
                <el-col :span="6">产地：{{ goodMsg.regionName }}</el-col>
                <el-col :span="6">级别/规格：{{ goodMsg.spec }}</el-col>
                <el-col :span="6">当前库存：<span v-html="getStock(goodMsg.subUnit,goodMsg.subUnit2,goodMsg.subUnit3,goodMsg.pieceUnit,goodMsg.subUnit2Weight,
          goodMsg.subUnit3Weight,goodMsg.batchNumber,goodMsg.basketNumber,goodMsg.pieceNumber)"></span>
                </el-col>
            </el-row>
            <el-divider></el-divider>
            <el-table :data="dialogTableData.modelList" height="300px" style='border:1px solid #E9E9E9;'
                ref="batchTable" @selection-change="handleSelectionChange" :row-key="getRowKeys">
                <el-table-column type="selection" :selectable="selectable" :reserve-selection='true'></el-table-column>
                <el-table-column label="入库时间" prop="timestamp">
                    <template slot-scope="scope">
                        {{ scope.row.timestamp| parseTime}}
                    </template>
                </el-table-column>
                <el-table-column label="入库类型" prop="batchsourcename">
                    <template slot-scope="scope">
                        <el-button @click="toPageType(scope.row.batchsourcename)" type="text">
                            {{scope.row.batchsourcename}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="入库数量" prop="inCount">
                    <template slot-scope="scope">
                        <span
                            v-html="getStock(goodMsg.subUnit,goodMsg.subUnit2,goodMsg.subUnit3,goodMsg.pieceUnit,goodMsg.subUnit2Weight,
                                      goodMsg.subUnit3Weight,scope.row.inCount,scope.row.basketnumber,scope.row.piecenumber)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="入库来源">
                    <template slot-scope="scope">
                        <span v-if="scope.row.custmorName == ''">--</span>
                        <span v-if="scope.row.custmorName != ''">
                            {{scope.row.custmorName}}
                            <el-tag type="info" v-if="scope.row.custmorType == 0">非</el-tag>
                            <el-tag v-if="scope.row.custmorType == 11 || scope.row.custmorType == 10">供</el-tag>
                            <el-tag type="danger" v-if="scope.row.custmorType == 11 || scope.row.custmorType == 7">经
                            </el-tag>
                            <el-tag type="warning" v-if="scope.row.custmorType == 3 || scope.row.custmorType == 4">采
                            </el-tag>
                        </span>
                        <span v-if="scope.row.custmorPhone != ''">{{ '-'+ scope.row.custmorPhone }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="当前库存">
                    <template slot-scope="scope">
                        <span
                            v-html="getStock(goodMsg.subUnit,goodMsg.subUnit2,goodMsg.subUnit3,goodMsg.pieceUnit,goodMsg.subUnit2Weight,
                                      goodMsg.subUnit3Weight,scope.row.batchnumber,scope.row.basketnumber,scope.row.piecenumber)"></span>
                    </template>
                </el-table-column>
                <el-table-column label="最近变动时间">
                    <template slot-scope="scope">
                        {{ scope.row.lastlyDate| parseTime }}
                    </template>
                </el-table-column>
            </el-table>
            <div style="text-align:right;">
                <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
                    :current-page="dialogqueryData.pageindex" :page-sizes="[10]" :page-size="dialogqueryData.pagesize"
                    layout="total, sizes, prev, pager, next, jumper" :total="dialogqueryData.total">
                </el-pagination>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="selectBatchDialogClose" size="mini">取 消</el-button>
                <el-button type="primary" @click="confirmChecked" size="mini">确 定</el-button>
            </span>
        </el-dialog>
    </Page>
</template>

<script>
    import {
        getBatch,
        getCarryBasket
    } from '@/request/api/theOverflow/index'
    import {
        getInfo,
        newDamagedProduct
    } from '@/request/api/commodityDetail/index'
    export default {
        name: "reportLoss",
        data() {
            var isExceed = (rule, value, callback) => {
                if (value > this.editBatchMsg.batchnumber) {
                    return callback(new Error('报损数量不能大于当前批次库存！'));
                } else if (value == 0) {
                    return callback(new Error('请填写要报损的数量！'));
                } else {
                    callback();
                }
            };
            return {
                rules: {
                    reportLossNumber: [{
                        required: true,
                        message: '请填写报损数量',
                        trigger: 'blur'
                    }, {
                        validator: isExceed,
                        trigger: 'blur'
                    }],
                    reportLossPiece: [{
                        required: true,
                        message: '请填写报损件数',
                        trigger: 'blur'
                    }]
                },
                form: {
                    id: '',
                    reportLossNumber: 0,
                    reportLossPiece: 0,
                    basketArr: [],
                },
                editBatchMsg: {},
                editBatchDialog: false,
                tableData: [],
                dialogTableData: {},
                dialogqueryData: {
                    productId: this.$route.query.id,
                    type: 1,
                    pageindex: 1,
                    pagesize: 10,
                    total: 0
                },
                id: this.$route.query.id,
                selectBatchDialog: false,
                checkedBatch: [],
                goodMsg: {},
                remark: '',
            }
        },
        computed: {
            getCountSoar() {
                let res = 0
                for (let i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].sumSoar) {
                        res += this.tableData[i].sumSoar
                    }
                }
                return res;
            },
            getSum() {
                let res = 0
                for (let i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].reportLossCost) {
                        res += this.tableData[i].reportLossCost
                    }
                }
                return res;
            },
            getZongliang() {
                let res = 0
                for (let i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].reportLossNumber) {
                        res += this.tableData[i].reportLossNumber
                    }
                }
                return res;
            },
            sumSoar() {
                let res = 0;
                for (let i = 0; i < this.form.basketArr.length; i++) {
                    for (let j = 0; j < this.form.basketArr[i].info.length; j++) {
                        res += this.form.basketArr[i].info[j].soar
                    }
                }
                return res;
            },
            getCost() {
                console.log(this.editBatchMsg, this.form.reportLossNumber);
                if (this.editBatchMsg.remainCount >= this.form.reportLossNumber) {
                    return this.form.reportLossNumber * this.editBatchMsg.costPrice
                } else {
                    return this.editBatchMsg.remainCount * this.editBatchMsg.costPrice
                }
            },
        },
        methods: {
            submit(type) {
                let issubmit = true;
                for (let i = 0; i < this.tableData.length; i++) {
                    if (!this.tableData[i].reportLossNumber) {
                        this.$error('编号' + (i + 1) + '的批次没有被编辑，请移除或编辑后再做提交！');
                        issubmit = false;
                    }
                }
                if (issubmit) {
                    let res = {
                        remark: this.remark,
                        DamagedLsit: []
                    }
                    console.log(this.tableData)
                    for (let i = 0; i < this.tableData.length; i++) {
                        res.DamagedLsit.push({
                            damagedcount: this.tableData[i].reportLossNumber,
                            productbatchid: this.tableData[i].batchid,
                            buyingCost: this.tableData[i].costPrice,
                            pieceNumber: this.tableData[i].reportLossPiece,
                            totalPrice: this.getCost,
                            modellist: [],
                        })
                        for (let j = 0; j < this.tableData[i].basketArr.length; j++) {
                            for (let y = 0; y < this.tableData[i].basketArr[j].info.length; y++) {
                                res.DamagedLsit[i].modellist.push({
                                    bindId: 0,
                                    emptynumber: this.tableData[i].basketArr[j].info[y].soar,
                                    userbasketid: this.tableData[i].basketArr[j].basketId,
                                    userBasketName: this.tableData[i].basketArr[j].basketName,
                                    userBasketColor: this.tableData[i].basketArr[j].info[y].basketColor,
                                })
                            }
                        }
                    }
                    newDamagedProduct(res).then(resp => {
                        if (resp.status == 200) {
                            this.$success('操作成功！')
                            if (type == 2) {
                                this.$router.push({
                                    path: 'commodityList'
                                })
                            } else {
                                this.$router.push({
                                    path: 'reportlossDetails',
                                    query: {
                                        id: resp.data[0]
                                    }
                                })
                            }
                            // this.$closePage();
                        }
                    })
                }
            },
            editBatchSubmit() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        for (let i = 0; i < this.tableData.length; i++) {
                            if (this.tableData[i].batchid == this.editBatchMsg.batchid) {
                                this.$set(this.tableData[i], 'sumSoar', this.sumSoar)
                                this.tableData[i].basketArr = JSON.parse(JSON.stringify(this.form
                                    .basketArr))
                                this.$set(this.tableData[i], 'reportLossNumber', this.form
                                    .reportLossNumber);
                                this.$set(this.tableData[i], 'reportLossPiece', this.form.reportLossPiece);
                                this.$set(this.tableData[i], 'reportLossCost', this.getCost);
                            }
                        }
                        this.editBatchDialogClose();
                    }
                })
            },
            confirmChecked() {
                let obj = this.tableData.map(item => {
                    return item.batchid
                })
                for (let i = 0; i < this.checkedBatch.length; i++) {
                    if (obj.indexOf(this.checkedBatch[i].batchid) == -1) {
                        this.tableData.push(this.checkedBatch[i])
                    }
                }
                this.selectBatchDialogClose()
            },
            editBatchDialogClose() {
                this.editBatchDialog = false;
            },
            toPageType(type) {
                this.$error('暂无该功能！')
            },
            tableDataEdit(row, index) {
                this.form.id = index;
                this.editBatchDialog = true;
                this.editBatchMsg = row;
                if (this.editBatchMsg.basketArr) {
                    this.form.reportLossNumber = row.reportLossNumber
                    this.form.reportLossPiece = row.reportLossPiece
                    this.form.basketArr = JSON.parse(JSON.stringify(this.editBatchMsg.basketArr))
                } else {
                    let basketArr = {
                        productId: this.$route.query.id,
                        batchId: [this.editBatchMsg.batchid]
                    }
                    getCarryBasket(basketArr).then(resp => {
                        let res = resp.data
                        let obj = []
                        let arr = []
                        for (let i = 0; i < res.length; i++) {
                            if (obj.indexOf(res[i].basketId) === -1) {
                                arr.push({
                                    basketId: res[i].basketId,
                                    basketName: res[i].basketName,
                                    basketType: res[i].basketType,
                                    info: [{
                                        basketColor: res[i].basketColor,
                                        nums: res[i].nums,
                                        soar: 0
                                    }]
                                })
                                obj.push(res[i].basketId)
                            } else {
                                for (let j = 0; j < arr.length; j++) {
                                    if (arr[j].basketId == res[i].basketId) {
                                        arr[j].info.push({
                                            basketColor: res[i].basketColor,
                                            nums: res[i].nums,
                                            soar: 0
                                        })
                                        break;
                                    }
                                }
                            }
                        }
                        this.form.basketArr = arr
                    })
                }
            },
            tableDataDel(id) {
                for (let i = 0; i < this.tableData.length; i++) {
                    if (this.tableData[i].batchid == id) {
                        this.tableData.splice(i, 1);
                    }
                }
            },
            selectBatchDialogClose() {
                this.selectBatchDialog = false;
                this.checkedBatch = [];
                setTimeout(() => {
                    this.dialogTableData = [];
                }, 1000)
                this.$refs.batchTable.clearSelection()
            },
            handleCurrentChange(val) {
                this.dialogqueryData.pageindex = val;
                this.getBatchMsg();
            },
            handleSizeChange() {},
            selectable(row, index) {
                let obj = this.tableData.map(item => {
                    return item.batchid
                })
                if (obj.indexOf(row.batchid) > -1) {
                    return false;
                } else {
                    return true;
                }
            },
            handleSelectionChange(val) {
                this.checkedBatch = val
            },
            getRowKeys(row) {
                return row.batchid;
            },
            selectBatchClose() {
                this.selectBatchDialog = false;
            },
            getBatchMsg() {
                getBatch(this.dialogqueryData).then(resp => {
                    this.dialogTableData = resp.data[0];
                    this.dialogqueryData.total = resp.data[0].sumCount;
                    this.checkedBatch = this.tableData;
                    if (this.tableData.length > 0) {
                        this.$nextTick(() => {
                            this.dialogTableData.modelList.forEach(row => {
                                for (let i = 0; i < this.tableData.length; i++) {
                                    if (this.tableData[i].batchid == row.batchid) {
                                        this.$refs.batchTable.toggleRowSelection(row, true)
                                    }
                                }
                            })
                        })
                    }
                })
            },
            openBatchSelect() {
                this.checkedBatch = this.tableData;
                this.selectBatchDialog = true;
                this.getBatchMsg();
            },
            getStock(subunit, subunit2, subunit3, pieceunit, subunit2weight, subunit3weight, stock, basket,
                piececount) {
                let first = stock + subunit;
                let next2 = subunit2 == '' ? '' : subunit2weight + subunit2 + '/' + subunit
                let next3 = subunit3 == '' ? '' : subunit3weight + subunit3 + '*'
                let next4 = pieceunit == '' ? '' : '(' + piececount + (pieceunit == '筐(一次性)' ? '筐' : pieceunit) + ')'
                let last = basket == 0 ? '' : '|' + basket + '<font style="color:#DF971A;">筐</font>'
                let kuohao1 = subunit2 == '' ? '' : '('
                let kuohao2 = subunit2 == '' ? '' : ')'
                return first + kuohao1 + next3 + next2 + kuohao2 + next4 + last
            },
            getgoods() {
                if (this.$route.query.type == '批次详情') {
                    getBatch(this.dialogqueryData).then(resp => {
                        let res = resp.data[0].modelList
                        for (let i = 0; i < res.length; i++) {
                            if (res[i].batchid == this.$route.query.id2) {
                                this.tableData.push(res[i])
                            }
                        }
                    })
                }
                let res = {
                    productId: this.$route.query.id,
                    type: 1,
                    pageindex: 1,
                    pagesize: 10,
                }
                getInfo(res).then(resp => {
                    this.goodMsg = resp.data[0];
                })
            },
        },
        created() {
            this.getgoods();
        }
    };
</script>

<style lang="scss" scoped>
    .btn_style {
        border: 1px solid #0BA198;
        color: #0BA198;
    }

    .layout_styl_1 {
        margin-top: 15px;
    }

    .font_styl_1 {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(1, 6, 33, 0.5500);
    }

    .font_styl_2 {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: normal;
        color: rgba(1, 6, 33, 0.9000);
    }

    .el-tag {
        padding: 0px 1px !important;
    }

    .el-tag--medium {
        height: 17px !important;
        line-height: 17px !important;
    }

    .page_footer {
        width: 100%;
        text-align: right;
        background-color: #fff;
        border-top: 1px solid #E4E7ED;
        position: fixed;
        bottom: 0px;
        padding: 15px;
        right: 20px;
    }

    .table_count_styl {
        padding: 12px;
        color: rgba(1, 6, 33, 0.75);
        background-color: rgba(1, 6, 33, 0.02);
        border: 1px solid #E9E9E9;
        border-top: 0px;

        .table_count_styl_sum {
            margin-right: 32px;
        }
    }
</style>