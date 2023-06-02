<template>
  <div class="editSalesDialog">
    <el-dialog
      :title="title"
      :visible.sync="isVisiable"
      :close-on-click-modal="false"
      :before-close="close"
      top="100px"
      width="1100px"
    >
      <div class="marginform">
        <div
          style="
            padding: 5px 0px 5px;
            border-bottom: 1px solid rgba(233, 233, 233, 1);
          "
        >
          <div>
            <div>
              <div
                style="
                  color: rgba(1, 6, 33, 0.9);
                  font-size: 16px;
                  font-weight: 700;
                "
              >
                {{ model.categoryName }} | {{ model.variety }}
              </div>
            </div>
          </div>

          <div style="padding: 5px 0px 5px">
            <el-row>
              <el-col :span="5"
                ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >产地：</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                  model.regionname
                }}</span></el-col
              >
              <el-col :span="5"
                ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >级别/规格：</span
                ><span
                  style="
                    color: rgba(1, 6, 33, 0.9);
                    font-size: 14px;
                    padding-right: 10px;
                  "
                  >{{ model.spec }}</span
                >
              </el-col>
              <el-col :span="5"
                ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >当前库存：</span
                >
                <span
                  style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                  v-html="
                    getStock(
                      model.subunit,
                      model.subUnit2,
                      model.subUnit3,
                      model.pieceunit,
                      model.subUnit2Weight,
                      model.subUnit3Weight,
                      model.batchcount,
                      model.basketcount,
                      model.piececount
                    )
                  "
                ></span
              ></el-col>
            </el-row>
          </div>
        </div>

        <u-table
          ref="plTable"
          class="utable"
          :border="false"
          :height="$store.getters.screenHeight - 500 + 'px'"
          :header-row-style="{ height: '46px' }"
          :header-cell-style="{
            padding: '0px 0px',
            'font-size': '14px',
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
          :data="tableData.modelList"
          @selection-change="handleSelectionChange"
          :row-key="getRowKey"
        >
          <template slot="empty">没有查询到符合条件的记录</template>
          <u-table-column
            type="selection"
            width="55"
            align="center"
            name="选择"
            :reserve-selection="true"
          >
          </u-table-column>
          <u-table-column
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
              <span v-else-if="item.prop == 'inCount'">
                <span
                  v-html="
                    getStock(
                      tableData.subunit,
                      tableData.subUnit2,
                      tableData.subUnit3,
                      tableData.pieceunit,
                      tableData.subUnit2Weight,
                      tableData.subUnit3Weight,
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
                      tableData.subunit,
                      tableData.subUnit2,
                      tableData.subUnit3,
                      tableData.pieceunit,
                      tableData.subUnit2Weight,
                      tableData.subUnit3Weight,
                      scope.row.batchnumber,
                      scope.row.basketnumber,
                      scope.row.piecenumber
                    )
                  "
                ></span>
              </span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </u-table-column>
        </u-table>
        <div class="paging">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100]"
            :total="tableData.sumCount"
            :page-size="pagination.limit"
            :current-page.sync="pagination.page"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
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
</template>

<script>
import { productBatch } from "@/request/api/commodity/index";
export default {
  name: "selectedCommodity",
  data() {
    return {
      loading: false,
      title: "",
      isVisiable: false,
      disableSubmit: false,
      model: {},
      tableData: {
        modelList: [],
      },
      tableDataList: [],
      pagination: {
        page: 1, // 页码
        limit: 10, // 分页大小
        total: 0,
      },
      multipleSelectionList: [],
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
          prop: "batchsource",
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
    };
  },
  methods: {
    add() {},
    edit(record) {
      this.loading = true;
      this.model = Object.assign({}, this.model, record);
      this.getList();
    },
    getList() {
      let param = {
        productId: this.model.productid, // 商品ID
        type: 5, // 报溢商品选择批次时传0，其他如单位转换和报损时传1, 2:腾空筐子，3：装筐，4：分拣 5：销售单 6：退货退款单
        pageindex: this.pagination.page, // 分页-页码
        pagesize: this.pagination.limit, // 分页-大小
      };
      productBatch(param).then((res) => {
        if (res.status == 200) {
          if (res.data.length > 0) {
            this.tableData = res.data[0];
            this.model.multipleSelectionList.forEach((element) => {
              this.$refs.plTable.toggleRowSelection([
                {
                  row: element,
                  selected: true,
                },
              ]);
            });
          }
        }
      });
    },
    handleAdd() {
      this.$emit("editSalesChange", this.multipleSelectionList);
      this.close();
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.page = 1;
      this.pagination.limit = val;
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
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
    handleSelectionChange(val) {
      this.multipleSelectionList = val;
    },
    getRowKey(row) {
      return row.batchid;
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
      this.$emit(
        "selectedCommodityChange",
        JSON.parse(JSON.stringify(this.tableDataList))
      );
      this.tableDataList = [];
      this.$refs.plTable.clearSelection();
    },
  },
};
</script>

<style lang="scss" scoped>
.editSalesDialog {
  .utable {
    width: 100%;
    border-left: 1px solid #e9e9e9;
    border-right: 1px solid #e9e9e9;
    border-top: 1px solid #e9e9e9;
  }
  .paging {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-top: 10px;
    padding-bottom: 5px;
  }
}
</style>
<style lang="scss">
.editSalesDialog {
  .creditLineBottom {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid rgba(1, 6, 33, 0.06);
    padding: 5px;
  }

  .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>