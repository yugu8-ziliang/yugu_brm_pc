<template>
    <div class="selectedCommodityDialog">
        <el-dialog :title="title" :visible.sync="isVisiable" :close-on-click-modal="false" :before-close="close"
            top="100px" width="800px">
            <div class="marginform">

                <u-table ref="plTable" class="utable" :border="false" :height="$store.getters.screenHeight - 600 + 'px'"
                    :header-row-style="{ height: '46px' }" :header-cell-style="{
          padding: '0px 0px',
          'font-size': '14px',
          color: 'rgba(1, 6, 33, 0.65)',
        }" :row-style="{ height: '46px' }" :cell-style="{
          padding: '0px 0px',
          'font-size': '14px',
          color: 'rgba(1, 6, 33, 0.7)',
          height: '46px',
        }" use-virtual :row-height="46" showBodyOverflow="tooltip" showHeaderOverflow="title" :data="tableDataList">
                    <template slot="empty">没有查询到符合条件的记录</template>
                    <u-table-column v-for="(item, index) in columns" :key="index" :resizable="item.resizable"
                        :show-overflow-tooltip="true" :prop="item.prop" :label="item.label" :fixed="item.fixed"
                        align="left" header-align="left">
                        <template slot-scope="scope">
                            <span v-if="item.prop == 'productName'" style="color: #1a7fd9">
                                {{
                scope.row.productName == "其他"
                  ? scope.row.other
                  : scope.row.productName + "|" + scope.row.variety
              }}
                            </span>
                            <span v-else-if="item.prop == 'subUnit'">
                                {{ scope.row.subUnit }}{{ scope.row.subUnit2 != "" ? "(" : ""
              }}{{
                scope.row.subUnit3Weight == 0
                  ? ""
                  : scope.row.subUnit3Weight + scope.row.subUnit3
              }}{{ scope.row.subUnit3 != "" ? "*" : ""
              }}{{
                scope.row.subUnit2Weight == 0
                  ? ""
                  : scope.row.subUnit2Weight + scope.row.subUnit2
              }}{{ scope.row.subUnit2 != "" ? "/" + scope.row.subUnit : ""
              }}{{ scope.row.subUnit2 != "" ? ")" : "" }}
                            </span>
                            <span v-else-if="item.prop == 'batchCount'">
                                <span v-html="
                  getStock(
                    scope.row.subUnit,
                    scope.row.subUnit2,
                    scope.row.subUnit3,
                    scope.row.pieceUnit,
                    scope.row.subUnit2Weight,
                    scope.row.subUnit3Weight,
                    scope.row.batchCount,
                    scope.row.basketCount,
                    scope.row.pieceCount
                  )
                "></span>
                            </span>

                            <span v-else>{{ scope.row[item.prop] }}</span>
                        </template>
                    </u-table-column>
                    <u-table-column label="操作" :width="80" align="left">
                        <template slot-scope="scope">
                            <el-button size="mini" type="text" style="margin-right: 15px" @click="handleRemove(scope)">
                                移除</el-button>
                        </template>
                    </u-table-column>
                </u-table>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "selectedCommodity",
        data() {
            return {
                loading: false,
                title: "",
                isVisiable: false,
                disableSubmit: false,
                model: {},
                tableDataList: [],
                columns: [{
                        prop: "categoryName",
                        label: "商品分类",
                    }, {
                        prop: "productName",
                        label: "品种|品牌",
                    },

                    {
                        prop: "regionName",
                        label: "产地",
                    },
                    {
                        prop: "spec",
                        label: "级别/规格",
                    },
                    {
                        prop: "batchCount",
                        label: "当前库存",
                    }
                ],
            };
        },
        methods: {
            add() {},
            edit(record) {
                this.loading = true;
                this.model = Object.assign({}, this.model, record);
                this.tableDataList = []
                // for (let i = 0; i < this.model.multipleSelection.length; i++) {
                //     const el = this.model.multipleSelection[i];
                //     this.tableDataList.push({
                //         ...el,
                //         ststE: 'multipleSelection'
                //     })
                // }

                for (let i = 0; i < this.model.tableDataNum.length; i++) {
                    const el = this.model.tableDataNum[i];
                    this.tableDataList.push({
                        ...el,
                        ststE: 'tableDataNum'
                    })
                }
            },
            getStock(subunit, subunit2, subunit3, pieceunit, subunit2weight, subunit3weight, stock, basket,
                piececount) {
                let first = stock + subunit;
                let next2 = subunit2 == '' ? '' : subunit2weight + subunit2 + '/' + subunit
                let next3 = subunit3 == '' ? '' : subunit3weight + subunit3 + '*'
                let next4 = pieceunit == '' ? '' : '(' + piececount + pieceunit + ')'
                let last = basket == 0 ? '' : '|' + basket + '<font style="color:#DF971A;">筐</font>'
                let kuohao1 = subunit2 == '' ? '' : '('
                let kuohao2 = subunit2 == '' ? '' : ')'
                return first + kuohao1 + next3 + next2 + kuohao2 + next4 + last
            },
            handleRemove(row) {
                this.$confirm("确认移除此商品?", "提示", {
                        confirmButtonText: "确定",
                        cancelButtonText: "取消",
                        type: "warning",
                    })
                    .then(() => {
                        this.tableDataList.splice(row.$index, 1);
                    })
                    .catch(() => {});
            },
            // 清空数据
            clearTree() {},
            // 提交数据
            confirmEdit() {},
            // 关闭事件
            close(val) {
                if (!val) {
                    this.$emit("close");
                }
                this.loading = false;
                this.isVisiable = false;
                this.disableSubmit = false;
                this.model = {};
                this.$emit('selectedCommodityChange',JSON.parse(JSON.stringify(this.tableDataList)))
                this.tableDataList=[]
            },
        },
    };
</script>

<style lang="scss" scoped>
</style>
<style lang="scss">
    .selectedCommodityDialog {
        .creditLineBottom {
            display: flex;
            justify-content: flex-end;
            border-top: 1px solid rgba(1, 6, 33, 0.06);
            padding: 5px;
        }

    }
</style>