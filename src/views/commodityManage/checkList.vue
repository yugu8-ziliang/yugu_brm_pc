/* TOFIX */
<template>
  <!-- 商品盘点 -->
  <Container>
    <div class="currentInventory-model">
      <div class="currentInventory-search">
        <div>
          <div class="search-form-border">
            <span class="search-form-title">盘点时间</span>
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
      <div class="currentInventory-table">
        <div style="margin: 20px 0px">
          <el-button type="primary" icon="el-icon-plus" @click="selectedGoods">
            新建盘点单
          </el-button>
        </div>
        <el-table
          :data="tableData"
          style="border-top: 1px solid E9E9E9"
          :height="$store.getters.screenHeight - 400 + 'px'"
        >
          <el-table-column label="盘点单编号" prop="orderId">
            <template slot-scope="scope">
              {{ scope.row.orderId ? scope.row.orderId : "--" }}
            </template>
          </el-table-column>
          <el-table-column label="盘点商品种类" prop="checkTotalCount">
            <template slot-scope="scope">
              {{ scope.row.checkTotalCount }}种
            </template>
          </el-table-column>
          <el-table-column
            label="盘点商品"
            prop="checkProductInfo"
            min-width="180px"
          >
          </el-table-column>
          <el-table-column label="操作人" prop="addByUserName">
          </el-table-column>
          <el-table-column label="盘点时间" prop="timestamp">
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
        <div
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
        </div>
      </div>
    </div>
    <!-- 新建盘点-选择商品弹框-------------------------------------------------->
    <el-dialog
      title="新建盘点-选择商品"
      :visible.sync="selectedGoodsDialog"
      width="1100px"
      :before-close="selectedGoodsDialogClose"
    >
      <el-row>
        <el-col :span="6">
          <el-cascader
            size="mini"
            v-model="queryData1.classificationList"
            :options="classificationOptions"
            placeholder="商品分类"
            clearable
            :props="{
              value: 'categoryId',
              label: 'categoryName',
              children: 'childList',
            }"
          >
            <template slot-scope="{ node, data }">
              <span>{{ data.categoryName }}</span>
              <span v-if="!node.isLeaf"> ({{ data.childList.length }}) </span>
            </template>
          </el-cascader>
        </el-col>
        <el-col :span="6">
          <el-cascader
            placeholder="产地"
            :options="addressOptions"
            clearable
            size="mini"
            v-model="queryData1.addressList"
            :props="{ value: 'rid', label: 'name', children: 'childList' }"
          >
            <template slot-scope="{ data }">
              <span>{{ data.name }}</span>
            </template>
          </el-cascader>
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="queryData1.variety"
            size="mini"
            style="width: 80%"
            placeholder="请输入商品品种/品牌"
          >
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="queryData1.spec"
            size="mini"
            style="width: 80%"
            placeholder="请输入商品级别/规格"
          >
          </el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-col :span="6">
          <el-button size="mini" @click="handleReset1">重置</el-button>
          <el-button size="mini" type="primary" @click="handleSearch1"
            >查询</el-button
          >
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-tabs v-model="queryData1.isStock" type="card" @tab-click="changeTabs">
        <el-tab-pane
          :label="'全部(' + numsSum.allCount + ')'"
          name="0"
        ></el-tab-pane>
        <el-tab-pane
          :label="'有库存(' + numsSum.stockCount + ')'"
          name="1"
        ></el-tab-pane>
        <el-tab-pane
          :label="'无库存(' + numsSum.unStockCount + ')'"
          name="2"
        ></el-tab-pane>
      </el-tabs>
      <el-table
        :data="selectedGoodTableData"
        height="400px"
        ref="selectgoodstable"
        @selection-change="handleSelectionChange"
        :row-key="getRowKeys"
      >
        <el-table-column width="55" type="selection" :reserve-selection="true">
        </el-table-column>
        <el-table-column label="品种/品牌" prop="variety"></el-table-column>
        <el-table-column label="分类" prop="categoryName"></el-table-column>
        <el-table-column label="产地" prop="regionName"></el-table-column>
        <el-table-column label="级别/规格" prop="spec"></el-table-column>
        <el-table-column label="当前库存" width="230">
          <template slot-scope="scope">
            <span
              v-html="
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
              "
            ></span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="getBatch(scope.row)" type="text">
              {{
                scope.row.isshow == false ? "展开批次" : "收起批次"
              }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="" type="expand" width="1">
          <template>
            <div style="width: 90%; float: right">
              <el-table
                label-position="center"
                :data="selectedBatchData"
                ref="selectbatchtable"
                @selection-change="handleSelectionChange2"
                :row-key="getRowKeys2"
              >
                <el-table-column label="选择" width="60" type="selection">
                </el-table-column>
                <el-table-column label="入库时间">
                  <template slot-scope="scope">
                    {{ scope.row.timestamp | parseTime }}
                  </template>
                </el-table-column>
                <el-table-column label="入库类型">
                  <template slot-scope="scope">
                    <span style="color: #1A7FD9l">{{
                      scope.row.batchsourcename
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="商品来源">
                  <template slot-scope="scope">
                    <div class="change_tags">
                      <span v-if="scope.row.custmorName == ''">--</span>
                      <span v-if="scope.row.custmorName != ''">
                        {{ scope.row.custmorName }}
                        <el-tag type="info" v-if="scope.row.custmorType == 0"
                          >非</el-tag
                        >
                        <el-tag
                          v-if="
                            scope.row.custmorType == 11 ||
                            scope.row.custmorType == 10
                          "
                          >供
                        </el-tag>
                        <el-tag
                          type="danger"
                          v-if="
                            scope.row.custmorType == 11 ||
                            scope.row.custmorType == 7
                          "
                          >经
                        </el-tag>
                        <el-tag
                          type="warning"
                          v-if="
                            scope.row.custmorType == 3 ||
                            scope.row.custmorType == 4
                          "
                          >采
                        </el-tag>
                      </span>
                      <span v-if="scope.row.custmorPhone != ''">{{
                        "-" + scope.row.custmorPhone
                      }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="当前库存">
                  <template slot-scope="scope">
                    <span
                      v-html="
                        getStock(
                          batchMsgExtend.subunit,
                          batchMsgExtend.subUnit2,
                          batchMsgExtend.subUnit3,
                          batchMsgExtend.pieceunit,
                          batchMsgExtend.subUnit2Weight,
                          batchMsgExtend.subUnit3Weight,
                          scope.row.batchnumber,
                          scope.row.basketnumber,
                          scope.row.piecenumber
                        )
                      "
                    ></span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right">
        <el-pagination
          v-if="pagination1.total > 0"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination1.total"
          :page-size="pagination1.pagesize"
          :current-page.sync="pagination1.pageindex"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectedGoodsDialogClose" size="mini"
          >取 消</el-button
        >
        <el-button
          type="primary"
          size="mini"
          @click="selectedgoodsSubmit('takeStock', {})"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </Container>
</template>

<script>
import {
  productList,
  productCate,
  getRegion,
} from "@/request/api/commodityManage/commodityList";
import { checkList } from "@/request/api/commodityDetail/index";
import { getBatch } from "@/request/api/theOverflow/index";
export default {
  name: "checkList",
  data() {
    return {
      tableData: [],
      selectedGoodTableData: [],
      queryData: {
        timestampList: [],
        pageindex: 1,
        pagesize: 10,
      },
      pagination: {
        page: 1, // 页码
        limit: 10, // 分页大小
        total: 0,
      },
      pagination1: {
        page: 1, // 页码
        limit: 10, // 分页大小
        total: 0,
      },
      selectedGoodsDialog: false,
      queryData1: {
        isStock: "0", // 0: 全部,1:有库存,2:无库存,默认传0
        regionId: "", // 产地id, 第三级产地id,默认 ""
        classifyId: "", //三级分类id,默认 ""
        calssifyVariety: "", //三级分类下品牌,默认 ""
        variety: "", // 品牌,默认 ""
        spec: "", //规格,默认 ""
        classificationList: [],
        addressList: [],
      },
      addressOptions: [
        {
          name: "国内",
          rid: 1,
          childList: [],
        },
        {
          name: "国外",
          rid: 2,
          childList: [],
        },
      ],
      numsSum: {
        transCount: 0, //交易商品数量
        currentCount: 0, //当前库存数量
        sumCount: 0, //数据总条数
        allCount: 0, //全部数量
        stockCount: 0, //有库存数量
        unStockCount: 0, //无库存数量
      },
      classificationOptions: [],
      selectedBatchData: [],
      checkedBatch: [],
      batchMsgExtend: {},
    };
  },
  created() {
    this.checkList();
    this.getList();
  },
  methods: {
    showBatch(row) {
      this.selectedGoodTableData.map((item) => {
        if (row.productId != item.productId) {
          this.$refs.selectgoodstable.toggleRowExpansion(item, false);
        }
      });
      this.$refs.selectgoodstable.toggleRowExpansion(row);
      for (let i = 0; i < this.selectedGoodTableData.length; i++) {
        if (row.productId == this.selectedGoodTableData[i].productId) {
          this.selectedGoodTableData[i].isshow =
            !this.selectedGoodTableData[i].isshow;
        } else {
          this.selectedGoodTableData[i].isshow = false;
        }
      }
      for (let i = 0; i < this.selectedBatchData.length; i++) {
        for (let j = 0; j < this.checkedBatch.length; j++) {
          if (
            this.selectedBatchData[i].batchid == this.checkedBatch[j].batchid
          ) {
            this.$nextTick(() => {
              if (this.$refs.selectbatchtable) {
                this.$refs.selectbatchtable.toggleRowSelection(
                  this.selectedBatchData[i],
                  true
                );
              }
            });
          }
        }
      }
    },
    getBatch(row) {
      let params = {
        productId: row.productId,
        type: 0,
        pageindex: 0,
        pagesize: 0,
      };
      getBatch(params).then((resp) => {
        this.selectedBatchData = resp.data[0].modelList;
        this.batchMsgExtend = resp.data[0];
        this.showBatch(row);
      });
    },
    getRowKeys(row) {
      return row.productId;
    },
    getRowKeys2(row) {
      return row.batchid;
    },
    handleSelectionChange(val) {
      this.checkedGoods = val;
    },
    handleSelectionChange2(val) {
      for (let i = 0; i < val.length; i++) {
        //选中批次时选中所属商品
        this.checkedBatch.push(val[i]);
        for (let j = 0; j < this.selectedGoodTableData.length; j++) {
          if (val[i].productId == this.selectedGoodTableData[j].productId) {
            this.$nextTick(() => {
              this.$refs.selectgoodstable.toggleRowSelection(
                this.selectedGoodTableData[j],
                true
              );
            });
          }
        }
      }
      let valarr = val.map((item) => {
        return item.batchid;
      });
      let tablearr = this.selectedBatchData.map((item) => {
        return item.batchid;
      });
      for (let i = 0; i < tablearr.length; i++) {
        if (valarr.indexOf(tablearr[i]) == -1) {
          for (let j = 0; j < this.checkedBatch.length; j++) {
            if (tablearr[i] == this.checkedBatch[j].batchid) {
              this.checkedBatch.splice(j, 1);
            }
          }
        }
      }
    },
    changeTabs(val) {
      this.queryData1 = {
        regionId: "", // 产地id, 第三级产地id,默认 ""
        classifyId: "", //三级分类id,默认 ""
        calssifyVariety: "", //三级分类下品牌,默认 ""
        variety: "", // 品牌,默认 ""
        spec: "", //规格,默认 ""
        isStock: val.name, //  0: 全部,1:有库存,2:无库存,默认传0
        classificationList: [],
        addressList: [],
      };
      this.pagination1.page = 1;
      this.getList();
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
      let next4 =
        pieceunit == ""
          ? ""
          : "(" +
            piececount +
            (pieceunit == "筐(一次性)" ? "筐" : pieceunit) +
            ")";
      let last =
        basket == 0
          ? ""
          : "|" + basket + '<font style="color:#DF971A;">筐</font>';
      let kuohao1 = subunit2 == "" ? "" : "(";
      let kuohao2 = subunit2 == "" ? "" : ")";
      return first + kuohao1 + next3 + next2 + kuohao2 + next4 + last;
    },
    // handleActiveClick(val) {
    //     this.queryData1 = {
    //         regionId: "", // 产地id, 第三级产地id,默认 ""
    //         classifyId: "", //三级分类id,默认 ""
    //         calssifyVariety: "", //三级分类下品牌,默认 ""
    //         variety: "", // 品牌,默认 ""
    //         spec: "", //规格,默认 ""
    //         isStock: val.name, //  0: 全部,1:有库存,2:无库存,默认传0
    //         classificationList: [],
    //         addressList: [],
    //     };
    //     this.pagination1.page = 1;
    //     this.getList();
    // },
    selectedgoodsSubmit(form, record) {
      let res = this.checkedBatch;
      let map = new Map();
      for (let item of res) {
        map.set(item.batchid, item);
      }
      res = [...map.values()];
      this.checkedBatch = res;
      this.selectedGoodsDialogClose();
      this.$closePage();
      this.$router.push({
        path: form,
        query: {
          id: record.productId,
        },
      });
    },
    getList(arg) {
      //查询条件
      let param = {
        ...this.queryData1,
        pageindex: this.pagination1.page, // 分页，第几页
        pagesize: this.pagination1.limit, // 分页，每页几条
      };
      if (param.classificationList.length == 4) {
        param.classifyId = param.classificationList[2];
        param.calssifyVariety = param.classificationList[3];
      } else {
        param.classifyId =
          param.classificationList[param.classificationList.length - 1];
        param.calssifyVariety = "";
      }
      if (param.addressList.length > 0) {
        param.regionId = param.addressList[3];
      }
      productList(param).then((resp) => {
        this.selectedGoodTableData = resp.data[0].modelList;
        this.pagination1.total = resp.data[0].sumCount; //分页前数据条数
        let res = this.selectedGoodTableData;
        for (let i = 0; i < res.length; i++) {
          res[i].isshow = false;
        }
        this.selectedGoodTableData = res;
        this.numsSum = {
          transCount: resp.data[0].transCount, // 数据条数
          currentCount: resp.data[0].currentCount, // 全部数量
          sumCount: resp.data[0].sumCount, // 待审核数量
          allCount: resp.data[0].allCount, // 审核修改信息
          stockCount: resp.data[0].stockCount, //  待支付
          unStockCount: resp.data[0].unStockCount, // 账号到期
        };
      });
    },
    selectedGoodsDialogClose() {
      this.selectedGoodsDialog = false;
    },
    selectedGoods() {
      this.selectedGoodsDialog = true;
      productCate({
        modelType: "0",
      }).then((res) => {
        this.classificationOptions = res.data;
      });
      getRegion().then((res) => {
        this.addressOptions[1].childList = res.data[0].foreignRegions; //国外
        this.addressOptions[0].childList = res.data[0].regions; //国内
      });
      this.getList();
    },
    checkList() {
      let param = {
        timestampList: this.queryData.timestampList,
        pageindex: this.pagination.page, // 页码
        pagesize: this.pagination.limit, // 分页大小
      };
      if (param.timestampList.length > 0) {
        param.startTime = param.timestampList[0] / 1000;
        param.endTime = param.timestampList[1] / 1000;
      }
      checkList(param).then((res) => {
        this.tableData = res.data[0].modelList;
        this.pagination.total = res.data[0].sumCount;
      });
    },
    check(row) {
      this.$router.push({
        path: "inventoryDetails",
        query: {
          id: row.orderId,
        },
      });
    },
    // 重置
    handleReset() {
      this.queryData = this.$options.data().queryData;
      this.pagination = this.$options.data().pagination;
      this.checkList(1);
    },
    // 查询
    handleSearch() {
      let res = [];
      if (this.queryData.timestampList) {
        res.startTime = this.queryData.timestampList[0] / 1000;
        res.endTime = this.queryData.timestampList[1] / 1000;
      }
      this.checkList();
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.limit = val;
      this.checkList(1);
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.checkList();
    },
    // 弹框重置
    handleReset1() {
      this.queryData1 = this.$options.data().queryData1;
      this.pagination1 = this.$options.data().pagination1;
      this.getList(1);
    },
    // 弹框查询
    handleSearch1() {
      this.getList(1);
    },
    // 弹框分页
    handleSizeChange1(val) {
      this.pagination1.limit = val;
      this.getList();
    },
    handleCurrentChange1(val) {
      this.pagination1.page = val;
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

::v-deep .el-dialog__body {
  padding: 20px;
}

.search-button {
  padding: 18px 0px;
  margin-bottom: 18px;
  border-bottom: 0.5px solid #e9e9e9;
}

::v-deep .el-tabs__header {
  margin: 0px;
}

.currentInventory-search1 {
  .search-form-border1 {
    display: inline-block;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    margin-right: 24px;

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
}
</style>