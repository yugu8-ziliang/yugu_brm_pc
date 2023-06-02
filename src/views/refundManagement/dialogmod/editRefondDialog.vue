<template>
  <!-- 退货信息-编辑-选择批次 -->
  <div>
    <div>
      <el-dialog
        title="选择批次"
        :visible.sync="isVisiable"
        :close-on-click-modal="false"
        :before-close="close"
        top="100px"
        width="1100px"
      >
        <div>
          <div>
            <div class="editDialog">
              {{
                goodsMsg1.catgoryfirstName +
                "-" +
                goodsMsg1.categorysecondName +
                "-" +
                goodsMsg1.name
              }}
              | {{ tableDataList1.variety }}
            </div>

            <div>
              <el-row>
                <el-col :span="6"
                  ><span class="informatTitle">产地：</span
                  ><span class="informatContent">{{
                    tableDataList1.regionname
                  }}</span></el-col
                >
                <el-col :span="5"
                  ><span class="informatTitle">级别/规格：</span
                  ><span class="informatContent">{{
                    tableDataList1.spec
                  }}</span>
                </el-col>

                <el-col :span="10"
                  ><span class="informatTitle">当前批次：</span>
                  <span class="informatContent"
                    >{{
                      tableDataList1.modelList
                        ? tableDataList1.modelList.length
                        : 0
                    }}个/数量<span
                      style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                      v-html="
                        getStock(
                          tableDataList1.subunit,
                          tableDataList1.subUnit2,
                          tableDataList1.subUnit3,
                          tableDataList1.pieceunit,
                          tableDataList1.subUnit2Weight,
                          tableDataList1.subUnit3Weight,
                          tableDataList1.batchcount,
                          tableDataList1.basketcount,
                          tableDataList1.piececount
                        )
                      "
                    ></span
                  ></span>
                </el-col>
              </el-row>
            </div>
          </div>

          <div class="editInformat">
            <span>批次详情</span>
            <span
              ><el-image style="width: 14px; height: 14px" :src="url"></el-image
            ></span>
          </div>

          <el-table
            ref="plTable"
            class="eltable"
            :border="false"
            :height="$store.getters.screenHeight - 500 + 'px'"
            :header-row-style="{ height: '46px' }"
            :header-cell-style="{
              color: 'rgba(1, 6, 33, 0.65)',
            }"
            :row-style="{ height: '46px' }"
            :cell-style="{
              padding: '0px 0px',
              'font-size': '14px',
              color: 'rgba(1, 6, 33, 0.7)',
              height: '46px',
            }"
            use-virtual
            :row-height="46"
            showBodyOverflow="tooltip"
            showHeaderOverflow="title"
            :data="tableData"
            @selection-change="handleSelectionChange"
            :row-key="getRowKey"
          >
            <el-table-column
              type="selection"
              width="55"
              align="center"
              name="选择"
              :reserve-selection="true"
            >
            </el-table-column>
            <el-table-column
              v-for="(item, index) in columns"
              :key="index"
              :resizable="item.resizable"
              :show-overflow-tooltip="true"
              :prop="item.prop"
              :label="item.label"
              :fixed="item.fixed"
              align="left"
              header-align="left"
            >
              <template slot-scope="scope">
                <span
                  v-if="item.prop == 'timestamp' || item.prop == 'lastlyDate'"
                >
                  {{ scope.row[item.prop] | parseTime() }}
                </span>
                <span v-else-if="item.prop == 'custmorName'">
                  {{ scope.row.custmorName }}
                  <el-tag type="info" v-if="scope.row.custmorType == 0"
                    >非</el-tag
                  >
                  <el-tag v-if="scope.row.custmorType == 3">供</el-tag>
                  <el-tag type="danger" v-if="scope.row.custmorType == 1"
                    >经</el-tag
                  >
                  <el-tag type="warning" v-if="scope.row.custmorType == 2"
                    >采</el-tag
                  >
                  <span v-if="scope.row.custmorPhone != ''">{{
                    "-" + scope.row.custmorPhone
                  }}</span>
                </span>
                <span v-else-if="item.prop == 'inCount'">
                  <span
                    v-html="
                      getStock(
                        tableDataList1.subunit,
                        tableDataList1.subUnit2,
                        tableDataList1.subUnit3,
                        tableDataList1.pieceunit,
                        tableDataList1.subUnit2Weight,
                        tableDataList1.subUnit3Weight,
                        scope.row.inCount,
                        scope.row.inBasketCount,
                        scope.row.inPieceCount
                      )
                    "
                  ></span>
                </span>
                <span v-else-if="item.prop == 'batchnumber'">
                  <span
                    v-html="
                      getStock(
                        tableDataList1.subunit,
                        tableDataList1.subUnit2,
                        tableDataList1.subUnit3,
                        tableDataList1.pieceunit,
                        tableDataList1.subUnit2Weight,
                        tableDataList1.subUnit3Weight,
                        scope.row.batchnumber,
                        scope.row.basketnumber,
                        scope.row.piecenumber
                      )
                    "
                  ></span>
                </span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="creditLineBottom">
          <el-button size="mini" style="margin-right: 10px" @click="close"
            >取消</el-button
          >
          <el-button
            size="mini"
            type="primary"
            style="margin-right: 10px"
            @click="handleAdd"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import { productBatch } from "@/request/api/commodity/index";
export default {
  props: ["goodsMsg1", "tableDataList1"],
  data() {
    return {
      tableData: [],
      url: require("@/assets/image/imgs/icon-question.png"),
      isVisiable: false,
      columns: [
        {
          prop: "timestamp",
          label: "入库时间",
        },
        {
          prop: "batchsourcename",
          label: "入库类型",
        },

        {
          prop: "inCount",
          label: "入库数量",
        },
        {
          prop: "custmorName",
          label: "入库来源",
        },
        {
          prop: "batchnumber",
          label: "当前库存",
        },
        {
          prop: "lastlyDate",
          label: "最近变动时间",
        },
      ],
      multipleSelection: [],
    };
  },
  methods: {
    edit(record) {
      this.model = Object.assign({}, this.model, record);
      this.getList();
    },
    getList() {
      // let param = {
      //   productId: this.tableDataList1.productId, // 商品ID
      //   type: 6, // 报溢商品选择批次时传0，其他如单位转换和报损时传1, 2:腾空筐子，3：装筐，4：分拣 5：销售单 6：退货退款单
      //   pageindex: 1, // 分页-页码
      //   pagesize: 10, // 分页-大小
      // };
      // productBatch(param).then((res) => {
      //     if (res.data.length > 0) {
      //       this.tableData = res.data[0];
      //       this.tableDataList1.multipleSelection.forEach((element) => {
      //         this.$refs.plTable.toggleRowSelection([
      //           {
      //             row: element,
      //             selected: true,
      //           },
      //         ]);
      //       });
      //   }
      // });

      this.$nextTick(() => {
        this.tableData = this.tableDataList1.modelList;
        this.multipleSelection = this.tableDataList1.multipleSelection;
        this.tableData.forEach((element) => {
          // this.$refs.plTable.toggleRowSelection(element,true)
          if (this.multipleSelection) {
            for (let i = 0; i < this.multipleSelection.length; i++) {
              if (this.multipleSelection[i].batchid == element.batchid) {
                this.$refs.plTable.toggleRowSelection(element, true);
              }
            }
          }
        });
      });
    },
    handleAdd() {
      this.$emit("editRefondChange", this.multipleSelection);
      this.close();
    },
    getStock(
      subunit,
      subunit2,
      subunit3,
      pieceunit,
      subunit2weight,
      subunit3weight,
      stock,
      basket,
      piececount
    ) {
      let first = stock + subunit;
      let next2 =
        subunit2 == "" ? "" : subunit2weight + subunit2 + "/" + subunit;
      let next3 = subunit3 == "" ? "" : subunit3weight + subunit3 + "*";
      let next4 = pieceunit == "" ? "" : "(" + piececount + pieceunit + ")";
      let last =
        basket == 0
          ? ""
          : "|" + basket + '<font style="color:#DF971A;">筐</font>';
      let kuohao1 = subunit2 == "" ? "" : "(";
      let kuohao2 = subunit2 == "" ? "" : ")";
      return first + kuohao1 + next3 + next2 + kuohao2 + next4 + last;
    },
    getRowKey(row) {
      return row.batchid;
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    // 关闭事件
    close(val) {
      if (!val) {
        this.$emit("close");
      }
      this.isVisiable = false;
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.eltable {
  width: 100%;
  border-left: 1px solid #e9e9e9;
  border-right: 1px solid #e9e9e9;
  border-top: 1px solid #e9e9e9;
}
.creditLineBottom {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid rgba(1, 6, 33, 0.06);
  padding: 5px;
}

.el-dialog__body {
  padding: 10px 20px;
}

::v-deep .el-dialog__body {
  padding: 16px 24px;
}

.editDialog {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  margin-bottom: 12px;
}
.editInformat {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  line-height: 14px;
  padding: 24px 0px 16px;
}
.informatTitle {
  color: rgba(1, 6, 33, 0.55);
  font-size: 14px;
}
.informatContent {
  color: rgba(1, 6, 33, 0.9);
  font-size: 14px;
}
</style>
