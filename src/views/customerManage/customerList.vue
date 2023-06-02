<template>
  <Container @refresh="hanleRefresh">
    <div class="currentInventory-model">
      <div class="currentInventory-search flex_dom flex_item_between">
        <div>
          <div class="search-form-border">
            <span class="search-form-title">客户类型</span>
            <el-select v-model="queryData.customerType" size="small">
              <el-option label="全部" value="0"></el-option>
              <el-option label="平台" value="1"></el-option>
              <el-option label="非平台" value="2"></el-option>
            </el-select>
          </div>
          <div class="search-form-border">
            <span class="search-form-title">客户状态</span>
            <el-select v-model="queryData.status" size="small">
              <el-option label="全部" value="0"></el-option>
              <el-option label="普通" value="1"></el-option>
              <el-option label="常用" value="2"></el-option>
              <el-option label="已拉黑" value="3"></el-option>
              <el-option label="已冻结" value="4"></el-option>
              <el-option label="已逾期" value="5"></el-option>
            </el-select>
          </div>
          <div class="search-form-border">
            <span class="search-form-title">客户角色</span>
            <el-select v-model="queryData.role" size="small">
              <el-option label="全部" value="0"></el-option>
              <el-option label="经营户" value="1"></el-option>
              <el-option label="采购商" value="2"></el-option>
              <el-option label="供货商" value="3"></el-option>
            </el-select>
          </div>
          <div class="search-form-border">
            <span class="search-form-title">经营范围</span>
            <el-select v-model="queryData.bussinessScope" size="small" multiple>
              <el-option
                v-for="item in bussinessScopeOptions"
                :key="item.categoryId"
                :label="item.name"
                :value="item.categoryId"
              ></el-option>
            </el-select>
          </div>
          <div class="search-form-border">
            <span class="search-form-title">经营内容</span>

            <el-select v-model="queryData.bussinessContent" size="small">
              <el-option label="全部" value="0"></el-option>
              <el-option label="食堂饭店" value="1"></el-option>
              <el-option label="生鲜超市" value="2"></el-option>
              <el-option label="农贸市场" value="3"></el-option>
            </el-select>
          </div>
          <div class="search-form-border-input">
            <el-input
              v-model="queryData.search"
              size="small"
              placeholder="搜索客户姓名/电话/企业名称"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="handleSearch"
              ></el-button>
            </el-input>
          </div>
          <div style="margin-bottom: 18px">
            <el-button size="small" @click="handleReset">重 置</el-button>
            <el-button type="primary" size="small" @click="handleSearch"
              >查 询</el-button
            >
          </div>
        </div>
      </div>
      <div class="currentInventory-table">
        <div style="margin-top: 12px">
          <el-button icon="el-icon-plus" size="small">批量添加</el-button>
          <el-button
            icon="el-icon-plus"
            size="small"
            type="primary"
            @click="handleAdd('friendsList', '添加客户')"
            >添加客户</el-button
          >
        </div>
        <u-table
          ref="plTable"
          class="utable"
          :height="$store.getters.screenHeight - 460 + 'px'"
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
          :data="tableData"
          @sort-change="sortChange"
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
            :width="item.width"
            :min-width="item.minWidth"
            :align="item.align"
            :header-align="item.align"
            :sortable="item.sortable ? 'custom' : false"
          >
            <template slot-scope="scope">
              <span v-if="scope.row[item.prop] == ''">--</span>
              <span v-else-if="item.prop == 'customerType'">
                {{ scope.row[item.prop] | isLeixing(scope.row[item.prop]) }}
              </span>
              <span v-else-if="item.prop == 'balance'">{{
                moneyFormatTwo(scope.row[item.prop])
              }}</span>
              <span v-else-if="item.prop == 'lastlyDate'">{{
                scope.row[item.prop] | parseTime
              }}</span>
              <span v-else-if="item.prop == 'status'">
                <div
                  class="tag"
                  :style="{ background: tagColor(scope.row.status) }"
                ></div>
                {{ scope.row[item.prop] | isZhuangtai(scope.row[item.prop]) }}
              </span>
              <span v-else-if="item.prop == 'role'">
                {{ scope.row[item.prop] | isJuese(scope.row[item.prop]) }}
              </span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </u-table-column>
          <u-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="
                  handleJumpDetail('customerDetail', {
                    customerId: scope.row.customerId,
                  })
                "
                >查看</el-button
              >
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
    </div>
    <friendsList ref="friendsList" @fMethod="getList"></friendsList>
  </Container>
</template>
<script>
import { Base64 } from "js-base64";
import {
  merchantList,
  getBussinessScope,
} from "@/request/api/customerManage/customer.js";
import friendsList from "./dialogmod/friendsList.vue";

export default {
  name: "merchantList",
  components: {
    friendsList,
  },
  data() {
    return {
      queryData: {
        customerType: "0", // 客户类型, 0：全部,1：平台,2：非平台
        status: "0", //客户状态, 0:全部, 1:普通, 2：常用, 3:已拉黑, 4：已冻结, 5:已逾期
        role: "0", // 客户角色, 0:全部, 1:经营户, 2:采购户, 3:供货商, 4:非平台
        bussinessScope: [], // 经营范围
        bussinessContent: "0", // 经营内容, 0：全部, 1：食堂饭店, 2：生鲜超市, 3：农贸市场
        search: "",
      },
      pagination: {
        page: 1, // 页码
        limit: 10, // 分页大小
        total: 0,
      },
      tableData: [],
      columns: [
        {
          minWidth: 65,
          prop: "customerType",
          label: "类型",
          align: "left",
        },
        {
          minWidth: 70,
          prop: "status",
          label: "状态",
          align: "left",
        },
        {
          minWidth: 90,
          prop: "customerName",
          label: "姓名",
          align: "left",
        },
        {
          minWidth: 110,
          prop: "customerPhone",
          label: "电话",
          align: "left",
        },
        {
          minWidth: 65,
          prop: "role",
          label: "角色",
          align: "left",
        },
        {
          prop: "bussinessScope",
          label: "经营范围/内容",
          align: "left",
          minWidth: 220,
        },
        {
          minWidth: 140,
          prop: "balance",
          label: "经营往来款余额",
          sortable: true,
          align: "left",
        },
        {
          minWidth: 160,
          prop: "lastlyDate",
          label: "最近交易时间",
          sortable: true,
          align: "left",
        },
        {
          prop: "companyName",
          label: "企业名称",
          align: "left",
          minWidth: 160,
        },
      ],
      bussinessScopeOptions: [],
    };
  },
  created() {
    this.getList(1);
  },
  methods: {
    getList(arg) {
      if (arg === 1) {
        this.pagination.page = 1;
      }
      let param = {
        ...this.queryData,
        pageindex: this.pagination.page, // 分页，第几页
        pagesize: this.pagination.limit, // 分页，每页几条
      };
      this.tableData = [];
      merchantList(param).then((res) => {
        if (res.status == 200) {
          this.tableData = res.data[0].customerlist;
          this.pagination.total = res.data[0].sumCount;
        }
      });
      getBussinessScope().then((res) => {
        this.bussinessScopeOptions = res.data.map((value) => {
          return value; //map返回的是数组
          // return value.name;
        });
      });
    },
    sortChange(column) {
      // ascending 由小到大 descending 由大到小
      let resData = JSON.parse(JSON.stringify(this.tableData));
      if (resData.length > 0) {
        if (column.order == "ascending") {
          resData.sort((a, b) => {
            return a[column.prop] - b[column.prop];
          }); //升序
        }
        if (column.order == "descending") {
          resData.sort((a, b) => {
            return b[column.prop] - a[column.prop];
          }); //降序
        }
        this.tableData = resData;
      }
    },
    tagColor(val) {
      if (val == 1) {
        return "#1A7FD9";
      } else if (val == 2) {
        return "#DF971A";
      } else if (val == 4) {
        return "#DD4C4D";
      } else {
        return "#D0D0D2";
      }
    },
    moneyFormatTwo(moneyStr) {
      // 先将数值取两位小数
      let money = Number(moneyStr)
        .toFixed(2)
        .toString()
        .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      return money;
    },
    // 跳转页面
    handleJumpDetail: function (form, record) {
      this.$router.push({
        path: form,
        query: {
          data: Base64.encode(JSON.stringify(record)),
        }, //加密
      });
    },
    // 分页方法
    handleSizeChange(val) {
      this.pagination.limit = val;
      this.getList(1);
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.getList();
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
    handleAdd(form, title) {
      this.$refs[form].add();
      this.$refs[form].title = title; // 标题
      this.$refs[form].disableSubmit = false; // 是否可以提交
      this.$refs[form].isVisiable = true; // 是否显示
    },
    // 刷新
    hanleRefresh() {
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
    }
  }

  .currentInventory-table {
    .utable {
      // width: 100%;
      margin-top: 15px;
      border-left: 1px solid #e9e9e9;
      border-right: 1px solid #e9e9e9;

      .tag {
        display: inline-block;
        width: 8px;
        height: 8px;
        border-radius: 4px;
      }
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