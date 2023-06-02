<template>
  <!-- 商品列表 -->
  <TableContainer :refresh-visible="true" @refresh="hanleRefresh">
    <div class="header-page">
      <div class="header-left">
        <div class="header-left-content">
          <div class="header-lf-title">
            <div class="header-lf-word">
              交易商品(种)
              <el-tooltip
                class="item"
                effect="dark"
                content="已成功交易的商品种类"
                placement="bottom-start"
              >
                <p class="header-icon"></p>
              </el-tooltip>
            </div>
            <div class="header-lf-num">
              {{ numsSum.transCount }}
            </div>
          </div>
          <div class="header-lf-title">
            <div class="header-lf-word">当前库存(种)</div>
            <div class="header-lf-num">
              {{ numsSum.currentCount }}
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="currentInventory-search flex_dom">
      <div class="search-form-border">
        <span class="search-form-title">商品分类</span>
        <el-cascader
          :options="classificationOptions"
          style="width: 266px"
          v-model="queryData.classificationList"
          :props="{
            value: 'categoryId',
            label: 'categoryName',
            children: 'childList',
          }"
          clearable
          size="small"
        >
          <template slot-scope="{ node, data }">
            <span>{{ data.categoryName }}</span>
            <span v-if="!node.isLeaf"> ({{ data.childList.length }}) </span>
          </template>
        </el-cascader>
      </div>
      <div class="search-form-border">
        <span class="search-form-title">产地</span>
        <el-cascader
          :options="addressOptions"
          clearable
          size="small"
          style="width: 266px"
          v-model="queryData.addressList"
          :props="{ value: 'rid', label: 'name', children: 'childList' }"
        >
          <template slot-scope="{ data }">
            <span>{{ data.name }}</span>
          </template>
        </el-cascader>
      </div>
      <div class="search-form-border">
        <el-input
          v-model="queryData.variety"
          size="small"
          style="width: 216px"
          placeholder="请输入商品品种/品牌"
        >
        </el-input>
      </div>
      <div class="search-form-border">
        <el-input
          v-model="queryData.spec"
          size="small"
          style="width: 216px"
          placeholder="请输入商品级别/规格"
        >
        </el-input>
      </div>
      <div>
        <el-button size="small" @click="handleReset">重 置</el-button>
        <el-button type="primary" size="small" @click="handleSearch"
          >查 询</el-button
        >
      </div>
    </div>

    <div class="currentInventory-table">
      <div style="margin-top: 16px; margin-bottom: 16px">
        <el-button
          type="primary"
          size="small"
          icon="el-icon-plus"
          @click="handleJumpDetail('addCommodity', {})"
        >
          添加商品</el-button
        >
        <el-button size="small" @click="handleJumpDetail1('checkList', {})"
          >盘点商品</el-button
        >
      </div>
      <el-tabs
        v-model="queryData.isStock"
        type="card"
        @tab-click="handleActiveClick"
      >
        <el-tab-pane
          :label="'全部 (' + numsSum.allCount + ')'"
          name="0"
        ></el-tab-pane>
        <el-tab-pane
          :label="'有库存 (' + numsSum.stockCount + ')'"
          name="1"
        ></el-tab-pane>
        <el-tab-pane
          :label="'无库存 (' + numsSum.unStockCount + ')'"
          name="2"
        ></el-tab-pane>
      </el-tabs>
      <u-table
        ref="plTable"
        class="utable"
        :border="false"
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
        :data="tableData"
        :height="$store.getters.screenHeight - 500 + 'px'"
      >
        <template slot="empty">没有查询到符合条件的记录</template>
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
            <span v-if="item.prop == 'productName'" style="color: #1a7fd9">
              {{ scope.row.productName + "|" + scope.row.variety }}
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
            </span>
            <span v-else>{{ scope.row[item.prop] }}</span>
          </template>
        </u-table-column>
        <u-table-column label="操作" :width="200" align="left">
          <template slot-scope="scope">
            <el-button
              type="text"
              style="margin-right: 15px"
              @click="
                handleJumpDetail('addStock', {
                  fullPath: '/commodityManage/commodityList',
                  productid: scope.row.productId,
                  ...scope.row,
                })
              "
            >
              添加入库</el-button
            >
            <el-dropdown
              trigger="click"
              @command="(val) => handleJumpDetail2(val, scope.row, '商品列表')"
            >
              <el-button type="text"> 更多 </el-button>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item command="theOverflow">报溢</el-dropdown-item>
                <el-dropdown-item command="reportLoss">报损</el-dropdown-item>
                <el-dropdown-item command="soar">腾空</el-dropdown-item>
                <el-dropdown-item command="sorting">分拣</el-dropdown-item>
                <el-dropdown-item command="unitConversion"
                  >单位转换</el-dropdown-item
                >
                <el-dropdown-item command="packbasket"
                  >装周转筐</el-dropdown-item
                >
                <el-dropdown-item command="commodityDetail"
                  >查看详情</el-dropdown-item
                >
              </el-dropdown-menu>
            </el-dropdown>
          </template>
        </u-table-column>
      </u-table>
      <div class="paging">
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
  </TableContainer>
</template>

<script>
import { Base64 } from "js-base64";
import {
  productList,
  productCate,
  getRegion,
} from "@/request/api/commodityManage/commodityList";

export default {
  name: "commodityList",
  data() {
    return {
      columns: [
        {
          prop: "productName",
          label: "品种|品牌",
        },
        {
          prop: "categoryName",
          label: "分类",
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
          prop: "subUnit",
          label: "计算单位",
        },
        {
          prop: "batchCount",
          label: "当前库存",
        },
      ],
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
      queryData: {
        isStock: "0", // 0: 全部,1:有库存,2:无库存,默认传0
        regionId: "", // 产地id, 第三级产地id,默认 ""
        classifyId: "", //三级分类id,默认 ""
        calssifyVariety: "", //三级分类下品牌,默认 ""
        variety: "", // 品牌,默认 ""
        spec: "", //规格,默认 ""
        classificationList: [],
        addressList: [],
      },
      numsSum: {
        transCount: 0, //交易商品数量
        currentCount: 0, //当前库存数量
        sumCount: 0, //数据总条数
        allCount: 0, //全部数量
        stockCount: 0, //有库存数量
        unStockCount: 0, //无库存数量
      },
      pagination: {
        page: 1, // 页码
        limit: 10, // 分页大小
        total: 0,
      },
      tableData: [],
      classificationOptions: [],
    };
  },
  methods: {
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
    getList(arg) {
      //查询条件
      let param = {
        ...this.queryData,
        pageindex: this.pagination.page, // 分页，第几页
        pagesize: this.pagination.limit, // 分页，每页几条
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
        console.log(param.addressList);
        param.regionId = param.addressList[3];
      }
      productList(param).then((res) => {
        this.tableData = res.data[0].modelList;
        this.pagination.total = res.data[0].sumCount; //分页前数据条数
        this.numsSum = {
          transCount: res.data[0].transCount, // 数据条数
          currentCount: res.data[0].currentCount, // 全部数量
          sumCount: res.data[0].sumCount, // 待审核数量
          allCount: res.data[0].allCount, // 审核修改信息
          stockCount: res.data[0].stockCount, //  待支付
          unStockCount: res.data[0].unStockCount, // 账号到期
        };
      });
    },
    handleActiveClick(val) {
      this.queryData = {
        regionId: "", // 产地id, 第三级产地id,默认 ""
        classifyId: "", //三级分类id,默认 ""
        calssifyVariety: "", //三级分类下品牌,默认 ""
        variety: "", // 品牌,默认 ""
        spec: "", //规格,默认 ""
        isStock: val.name, //  0: 全部,1:有库存,2:无库存,默认传0
        classificationList: [],
        addressList: [],
      };
      this.pagination.page = 1;
      this.getList();
    },
    productCate() {
      productCate({
        modelType: "0",
      }).then((res) => {
        this.classificationOptions = res.data;
      });
    },
    getRegion() {
      getRegion().then((res) => {
        this.addressOptions[1].childList = res.data[0].foreignRegions; //国外
        this.addressOptions[0].childList = res.data[0].regions; //国内
      });
    },
    // 跳转页面
    handleJumpDetail: function (form, record) {
      this.$router.push({
        path: form,
        query: {
          data: Base64.encode(JSON.stringify(record)),
        }, //加密
      });
      // Base64.decode(this.pwd);//解密
    },
    handleJumpDetail1(form, record) {
      this.$router.push({
        path: form,
        query: {
          id: record.productId,
        },
      });
    },
    handleJumpDetail2(form, record, type) {
      this.$router.push({
        path: form,
        query: {
          id: record.productId,
          type: type,
        },
      });
    },
    //查询
    handleSearch() {
      this.getList(1);
    },
    //重置
    handleReset() {
      this.queryData = this.$options.data().queryData;
      this.pagination = this.$options.data().pagination;
      this.getList(1);
    },
    // 分页
    handleSizeChange(val) {
      this.pagination.limit = val;
      this.getList();
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.getList();
    },
    // 刷新
    hanleRefresh() {
      this.getList(1);
    },
  },
  created() {
    this.getList();
    this.productCate();
    this.getRegion();
  },
};
</script>


<style lang="scss" scoped>
.header-page {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;

  .header-left {
    .header-left-content {
      display: flex;
      align-items: center;

      .header-lf-title {
        margin-right: 60px;

        .header-lf-word {
          display: flex;
          align-items: center;
          font-size: 16px;
          color: rgba(1, 6, 33, 0.9);
          margin-bottom: 5px;

          .header-icon {
            margin-left: 6px;
            border: none;

            &::after {
              content: "";
              display: block;
              width: 16px;
              height: 16px;
              background: url("../../assets/image/imgs/question-circle@2x.png")
                no-repeat center / 100%;
            }
          }
        }

        .header-lf-num {
          font-size: 24px;
          color: rgba(1, 6, 33, 0.9);
        }
      }
    }
  }
}

.currentInventory-search {
  padding: 16px 0px 26px 0px;
  border-top: 1px solid #e9e9e9;
  border-bottom: 1px solid #e9e9e9;

  .search-form-border {
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

.currentInventory-table {
  ::v-deep .el-tabs__header {
    margin: 0px;
  }

  .utable {
    width: 100%;
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
</style>

<style lang="scss">
</style>