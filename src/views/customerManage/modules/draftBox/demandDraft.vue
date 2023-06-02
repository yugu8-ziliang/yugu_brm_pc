<template>
  <!-- 草稿箱 需求草稿 -->
  <div
    class="demandDraftModel"
    :style="{ '--screenHeight': $store.getters.screenHeight - 390 + 'px' }"
  >
    <div class="adv-header-title">需求草稿</div>
    <div class="flex_dom">
      <div class="salesDraft-left">
        <el-scrollbar>
          <ul class="salesDraft-left-ul">
            <li
              v-for="(item, index) in tableDataList"
              :key="index"
              class="salesDraft-left-li flex_dom flex_item_mid flex_item_between"
              :style="{ background: tableIndex == index ? '#CEF2ED' : '' }"
            >
              <div>
                <el-checkbox
                  v-model="checkedList[index]"
                  @change="handelChecked(index)"
                ></el-checkbox>
              </div>
              <div
                style="padding: 0px 10px; cursor: pointer"
                @click="handleTable(index)"
              >
                <div
                  style="
                    font-size: 14px;
                    color: rgba(1, 6, 33, 0.9);
                    margin-bottom: 5px;
                  "
                >
                  {{ parseTime(item.timestamp) }}
                </div>
                <div style="font-size: 13px; color: rgba(1, 6, 33, 0.55)">
                  需求商品：{{ item.productDescription }}
                </div>
              </div>
              <div>
                <el-button
                  type="text"
                  style="color: #dd4c4d"
                  @click="handleDelete(item)"
                  >删除</el-button
                >
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </div>

      <div class="salesDraft-right">
        <u-table
          ref="plTable"
          class="utable"
          :height="$store.getters.screenHeight - 430 + 'px'"
          :border="false"
          :header-row-style="{ height: '46px' }"
          :header-cell-style="{
            padding: '0px 0px',
            'font-size': '14px',
            color: 'rgba(1, 6, 33, 0.65)',
            background: 'rgba(0, 0, 0, 0.02)',
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
          :data="tableDataListu"
          @select-all="(val) => handleSelectionChange(val, 'selectall')"
          @select="(val) => handleSelectionChange(val, 'select')"
        >
          <template slot="empty"> 没有查询到符合条件的记录 </template>
          <u-table-column type="selection" width="55" align="center" />
          <u-table-column
            v-for="(item, index) in columns"
            :key="index"
            :resizable="item.resizable"
            :show-overflow-tooltip="true"
            :prop="item.prop"
            :label="item.label"
            :fixed="item.fixed"
            :width="item.width"
            :align="item.align"
            header-align="left"
            :sortable="item.sortable"
          >
            <template slot-scope="scope">
              <span v-if="item.prop == 'productName'">
                {{ scope.row.categoryfirstName }}-{{
                  scope.row.categorysecondName
                }}-{{ scope.row.productName }}
              </span>
              <span v-if="item.prop == 'subUnit'">
                {{ scope.row.subUnit }}
                {{ scope.row.subUnit2 != "" ? "(" : "" }}
                {{
                  scope.row.subUnit3Weight == 0
                    ? ""
                    : scope.row.subUnit3Weight + scope.row.subUnit3
                }}
                {{ scope.row.subUnit3 != "" ? "*" : "" }}
                {{
                  scope.row.subUnit2Weight == 0
                    ? ""
                    : scope.row.subUnit2Weight + scope.row.subUnit2
                }}
                {{ scope.row.subUnit2 != "" ? "/" + scope.row.subUnit : "" }}
                {{ scope.row.subUnit2 != "" ? ")" : "" }}
              </span>

              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </u-table-column>
        </u-table>
        <div class="paging">
          <!-- <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[50, 100, 200, 300]"
            :total="pagination.total"
            :page-size="pagination.limit"
            :current-page.sync="pagination.page"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          >
          </el-pagination> -->
          <div>
            <span
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 14px;
                margin-right: 10px;
              "
              >已选
              <span style="color: rgba(11, 161, 152, 1)">{{ sumCount }}</span>
              种商品</span
            >
            <el-button type="primary" size="small">开需求单</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { parseTime } from "@/utils/common";
import {
  draftList,
  delateDraftBox,
} from "@/request/api/customerManage/customer";

export default {
  name: "demandDraft",
  props: {
    toUserId: {
      type: String,
    },
    currentView: {
      type: String,
    },
  },
  data() {
    return {
      parseTime,
      pagination: {
        page: 1, // 页码
        limit: 50, // 分页大小
        total: 0,
      },
      checkedList: [],
      selectionCountList: [],
      tableDataList: [],
      tableDataListu: [],
      tableIndex: 0,
      columns: [
        {
          width: 350,
          prop: "productName",
          label: "商品名称",
          align: "left",
        },
        {
          // width: 170,
          prop: "variety",
          label: "品种/品牌",
          align: "left",
        },
        {
          // width: 160,
          prop: "regionName",
          label: "产地",
          align: "left",
        },
        {
          // width: 160,
          prop: "spec",
          label: "级别/规格",
          align: "left",
        },
        {
          // width: 160,
          prop: "subUnit",
          label: "计算单位",
          align: "left",
        },
        {
          // width: 160,
          prop: "count",
          label: "需求量",
          align: "left",
        },
      ],
    };
  },
  created() {
    this.getList(1);
  },
  computed: {
    sumCount() {
      let data = 0;
      this.selectionCountList.forEach((res) => {
        data += res.length;
      });
      return data;
    },
  },
  methods: {
    getList(arg) {
      if (arg === 1) {
        this.pagination.page = 1;
      }
      let param = {
        touserId: this.toUserId,
        pageindex: 0, //this.pagination.page, // 页码
        pagesize: 0, //this.pagination.limit, // 分页大小
      };
      draftList(param).then((res) => {
        if (res.status == 200) {
          let data = res.data[0].modelList;

          this.tableDataList = data;
          this.tableIndex = 0;

          let param = [];
          if (this.tableDataList.length > 0) {
            this.tableDataListu =
              this.tableDataList[this.tableIndex].productInfo;
            this.tableDataList.forEach(() => {
              param.push(false);
            });
          }
          this.checkedList = param;
        }
      });
    },
    handleTable(val) {
      this.tableIndex = val;
      this.tableDataListu = this.tableDataList[this.tableIndex].productInfo;

      if (this.selectionCountList[this.tableIndex]) {
        this.$nextTick(function () {
          this.selectionCountList[this.tableIndex].forEach((row) => {
            this.$refs.plTable.toggleRowSelection([
              {
                row: row,
                selected: true,
              },
            ]);
          });
        });
      }
    },
    handleSelectionChange(val, status) {
      this.$set(this.selectionCountList, this.tableIndex, val);

      if (this.selectionCountList[this.tableIndex].length > 0) {
        this.$set(this.checkedList, this.tableIndex, true);
      } else {
        this.$set(this.checkedList, this.tableIndex, false);
      }
    },
    handelChecked(index) {
      if (this.tableIndex != index) {
        if (this.checkedList[index]) {
          this.$set(
            this.selectionCountList,
            index,
            this.tableDataList[index].productInfo
          );
        } else {
          this.$set(this.selectionCountList, index, []);
        }
      } else {
        if (this.checkedList[index]) {
          this.$refs.plTable.toggleAllSelection();
        } else {
          this.$set(this.selectionCountList, index, []);
          this.$refs.plTable.clearSelection();
        }
      }
    },
    handleDelete(val) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let param = {
            DraftId: val.orderDraftId, // 草稿箱主键id 必填
            typeView: 1, // 1 需求单草稿箱 2 销售单草稿箱  必填
          };
          delateDraftBox(param).then((res) => {
            if (res.status == 200) {
              this.$message.success(res.msg);
              this.getList();
            }
          });
        })
        .catch(() => {});
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.limit = val;
      this.getList(1);
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.demandDraftModel {
  .adv-header-title {
    font-size: 20px;
    color: rgba(1, 6, 33, 0.9);
    margin-bottom: 10px;
  }

  .salesDraft-left {
    width: 300px;

    .salesDraft-left-ul {
      margin-right: 7px;
      .salesDraft-left-li {
        // padding: 10px 15px 10px 10px;
        padding: 10px;
        background: #fff;
        border-bottom: 1px solid rgba(1, 6, 33, 0.06);
      }
    }
  }

  .salesDraft-right {
    width: calc(100% - 300px);

    .utable {
      width: 100%;
      // border: 1px solid #E9E9E9;
      border-top: 1px solid #e9e9e9;
      border-left: 1px solid #e9e9e9;
      border-right: 1px solid #e9e9e9;
    }

    .paging {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-top: 10px;
      padding-bottom: 5px;
    }
  }
}
</style>

<style lang="scss">
// .crediCreditModel {
//   .el-scrollbar__view {
//     min-width: 1580px !important;
//   }
// }

.salesDraft-left {
  .el-scrollbar {
    .el-scrollbar__wrap {
      background: #f5f5f5 !important;
      margin-bottom: 0px !important;
      overflow-x: hidden;

      .el-scrollbar__view {
        min-width: 0px !important;
        height: var(--screenHeight) !important;
        position: relative;
        padding: 0px !important;
      }
    }
    .el-scrollbar__bar {
      right: 0px;
    }
  }
}
</style>