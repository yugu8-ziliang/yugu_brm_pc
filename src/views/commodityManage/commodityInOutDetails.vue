<template>
  <!-- 商品出入库明细 -->
  <TableContainer
    :total="pagination.total"
    :page-size="pagination.limit"
    :page-num="pagination.page"
    @pagination="handlePagination"
  >
    <div class="currentInventory-model">
      <div class="currentInventory-search">
        <div>
          <div class="search-form-border">
            <span class="search-form-title">出入库类型</span>
            <el-cascader
              v-model="queryData.shareScope"
              :style="{
                'min-width': '220px',
                width: queryData.shareScope.length * 120 + 'px',
              }"
              :show-all-levels="false"
              :options="options"
              :props="props"
              size="mini"
              placeholder="请选择出入库类型"
              clearable
            >
            </el-cascader>
          </div>

          <div class="search-form-border">
            <span class="search-form-title">出入库时间</span>
            <el-date-picker
              v-model="queryData.timestampList"
              size="small"
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="timestamp"
              prefix-icon
              style="width: 220px"
            >
            </el-date-picker>
            <i class="el-icon-date"></i>
          </div>

          <div class="search-form-border-input">
            <el-button size="small" @click="handleReset">重 置</el-button>
            <el-button type="primary" size="small" @click="handleSearch"
              >查 询</el-button
            >
          </div>
        </div>
      </div>
      <div class="currentInventory-table" style="margin-top: 20px">
        <el-table
          :data="tableData"
          style="border-top: 1px solid E9E9E9"
          :height="$store.getters.screenHeight - 330 + 'px'"
        >
          <el-table-column label="出入库单号" prop="orderNo">
            <template slot-scope="scope">
              {{ scope.row.orderNo ? scope.row.orderNo : "--" }}
            </template>
          </el-table-column>
          <el-table-column label="出入库类型" prop="batchSource">
            <template slot-scope="scope">
              <span
                style="color: red"
                :class="{ font_color: scope.row.floatType == 1 }"
              >
                {{ scope.row.batchSource }}
              </span>
            </template>
          </el-table-column>
          <el-table-column
            label="商品名称"
            prop="productName"
            min-width="180px"
          >
          </el-table-column>
          <el-table-column label="商品种类" prop="productNum">
            <template slot-scope="scope">
              {{ scope.row.productNum }}种
            </template>
          </el-table-column>
          <el-table-column label="客户姓名" prop="fromUserName">
            <template slot-scope="scope">
              <span v-if="scope.row.fromUserName == ''">--</span>
              <span v-if="scope.row.fromUserName != ''">
                {{ scope.row.fromUserName }}
                <el-tag type="info" v-if="scope.row.custmorType == 0"
                  >非</el-tag
                >
                <el-tag
                  v-if="
                    scope.row.custmorType == 11 || scope.row.custmorType == 10
                  "
                  >供</el-tag
                >
                <el-tag
                  type="danger"
                  v-if="
                    scope.row.custmorType == 6 || scope.row.custmorType == 7
                  "
                  >经
                </el-tag>
                <el-tag
                  type="warning"
                  v-if="
                    scope.row.custmorType == 3 || scope.row.custmorType == 4
                  "
                  >采
                </el-tag>
              </span>
            </template>
          </el-table-column>
          <el-table-column label="联系电话" prop="fromUserPhone">
            <template slot-scope="scope">
              {{ scope.row.fromUserPhone ? scope.row.fromUserPhone : "--" }}
            </template>
          </el-table-column>
          <el-table-column label="出入库时间" prop="timestamp">
            <template slot-scope="scope">
              {{ scope.row.timestamp | parseTime }}
            </template>
          </el-table-column>
          <el-table-column label="操作" :width="90" align="left">
            <template slot-scope="scope">
              <el-button type="text" @click="check(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- <div
          class="flex_dom flex_row_reverse flex_item_mid"
          style="margin-top: 20px"
        >
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[10, 20, 50, 100]"
            :total="pagination.total"
            :page-size="pagination.limit"
            :current-page.sync="pagination.page"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div> -->
      </div>
    </div>
  </TableContainer>
</template>

<script>
import { isTypeoptions } from "@/utils/cascader.js";
import { goodsStorage } from "@/request/api/commodityDetail/index";
export default {
  name: "commodityInOutDetails",
  data() {
    return {
      options: [],
      tableData: [],
      props: {
        multiple: true,
      },
      queryData: {
        typeView: "0",
        shareScope: [],
        timestampList: [],
        pageNum: 1,
        pageSize: 10,
      },
      pagination: {
        page: 1, // 页码
        limit: 10, // 分页大小
        total: 0,
      },
    };
  },
  created() {
    let userType = JSON.parse(localStorage.getItem("userInfo"))?.usertype || "";
    let purchaseType =
      JSON.parse(localStorage.getItem("userInfo"))?.purchaseType || "";
    this.options = isTypeoptions(userType, purchaseType) || [];
    this.goodsStorage();
  },
  methods: {
    goodsStorage() {
      let param = {
        typeView: this.queryData.typeView,
        timestampList: this.queryData.timestampList,
        pageNum: this.pagination.page, // 页码
        pageSize: this.pagination.limit, // 分页大小
      };
      if (param.timestampList.length > 0) {
        param.startTime = param.timestampList[0] / 1000;
        param.endTime = param.timestampList[1] / 1000;
      }
      goodsStorage(param).then((res) => {
        this.tableData = res.data[0].modelList;
        // TOFIX 字段返回0 列表有值
        this.pagination.total = res.data[0].modelListCount;
      });
    },
    check(row) {
      if (row.realationModel == "51" || row.realationModel == "56") {
        this.$router.push({
          path: "addcommodityDetails",
          query: {
            id: row.realationModelId,
          },
        });
      } else if (row.realationModel == "52") {
        this.$router.push({
          path: "addrepositoryDetails",
          query: {
            id: row.realationModelId,
          },
        });
      } else if (row.realationModel == "53") {
        this.$router.push({
          path: "overstatementDetails",
          query: {
            id: row.realationModelId,
          },
        });
      } else if (row.realationModel == "55") {
        this.$router.push({
          path: "unitConversionDetail",
          query: {
            id: row.realationModelId,
          },
        });
      } else if (row.realationModel == "57") {
        this.$router.push({
          path: "packbasketDetails",
          query: {
            id: row.realationModelId,
          },
        });
      } else if (row.realationModel == "58") {
        this.$router.push({
          path: "emptyDetails",
          query: {
            id: row.realationModelId,
          },
        });
      } else if (row.realationModel == "59") {
        this.$router.push({
          path: "sortingDetails",
          query: {
            id: row.realationModelId,
          },
        });
      } else if (row.realationModel == "64") {
        this.$router.push({
          path: "inventoryDetails",
          query: {
            id: row.realationModelId,
          },
        });
      } else if (row.realationModel == "101") {
        this.$router.push({
          path: "reportlossDetails",
          query: {
            id: row.realationModelId,
          },
        });
      } else {
        this.$error("暂无！");
      }
    },
    // 重置
    handleReset() {
      this.queryData = this.$options.data().queryData;
      this.pagination = this.$options.data().pagination;
      this.goodsStorage(1);
    },
    // 查询
    handleSearch() {
      let res = [];
      if (this.queryData.timestampList) {
        console.log();
        res.startTime = this.queryData.timestampList[0] / 1000;
        res.endTime = this.queryData.timestampList[1] / 1000;
      }
      if (this.queryData.shareScope.length > 0) {
        for (let i = 0; i < this.queryData.shareScope.length; i++) {
          res.push(this.queryData.shareScope[i][1]);
        }
        res = res.join(",");
        this.queryData.typeView = res;
      }
      this.goodsStorage();
    },
    // 分页
    // handleSizeChange(val) {
    //   this.pagination.limit = val;
    //   this.goodsStorage(1);
    // },
    // handleCurrentChange(val) {
    //   this.pagination.page = val;
    //   this.goodsStorage();
    // },
    handlePagination(value) {
      this.pagination.page = value.pageSize;
      this.pagination.limit = value.pageNum;
      this.getList();
    },
  },
};
</script>

<style lang="scss" scoped>
.currentInventory-model {
  .currentInventory-search {
    border-bottom: 0.5px solid #e9e9e9;

    .search-form-border {
      display: inline-block;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      margin-right: 15px;
      margin-bottom: 18px;
      background-color: #ffffff;

      .search-form-title {
        padding: 0px 8px;
        font-size: 14px;
        color: rgba(1, 6, 33, 0.35);
      }

      i {
        color: #c0c4cc;
        margin: 0px 6px;
      }

      ::v-deep .el-input {
        line-height: 25px;
      }

      ::v-deep .el-input__inner {
        border: none;
        padding: 0px 5px;
        height: 30px;
        line-height: 30px;
      }

      ::v-deep .el-range__icon {
        display: none;
      }
    }

    .search-form-border-input {
      display: inline-block;
      margin-right: 15px;
      margin-bottom: 15px;

      .label-title {
        padding: 0 6px;
        font-size: 14px;
        height: 95%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: rgba(1, 6, 33, 0.35);
      }

      ::v-deep .el-input--prefix .el-input__inner {
        padding-left: 72px;
      }
    }
  }

  .font_color {
    color: #248b39 !important;
  }
}
</style>