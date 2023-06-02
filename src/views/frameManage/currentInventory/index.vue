<template>
  <!-- 当前库存 -->
  <Container @refresh="hanleRefresh">
    <div class="currentInventory-model">
      <div class="header-page">
        <div class="header-left">
          <div class="header-left-content">
            <div class="header-lf-title">
              <div class="header-lf-word">库存种类(种)</div>
              <div class="header-lf-num">
                {{ tableData.kindCount | intervalFormat(true) }}
              </div>
            </div>
            <div class="lineH"></div>
            <div class="header-lf-title">
              <div class="header-lf-word">库存数量(个)</div>
              <div class="header-lf-num">
                {{ tableData.currentCount | intervalFormat(true) }}
              </div>
            </div>
            <div class="lineH"></div>
            <div class="header-lf-title">
              <div class="header-lf-word">空置数量(个)</div>
              <div class="header-lf-num">
                {{ tableData.vacantBasket | intervalFormat(true) }}
              </div>
            </div>
            <div class="lineH"></div>
            <div class="header-lf-title">
              <div class="header-lf-word">载货数量(个)</div>
              <div class="header-lf-num">
                {{ tableData.cargoBasket | intervalFormat(true) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="currentInventory-search flex_dom flex_item_between">
        <div>
          <div class="search-form-border">
            <span class="search-form-title">类型</span>
            <el-select
              @change="getList(1)"
              v-model="queryData.typeArray"
              size="small"
              :style="{
                'min-width': '150px',
                width: queryData.typeArray.length * 39.5 + 'px',
              }"
              clearable
              multiple
            >
              <el-option
                v-for="(item, index) in typeOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
        </div>

        <div class="header-right">
          <el-button
            size="small"
            style="
              color: var(--color-primary);
              border: 1px solid var(--color-primary);
            "
            @click="handleJumpDetail('addOwnBasket')"
            >添加自有筐子</el-button
          >
          <el-button size="small" type="primary">购入筐子</el-button>
          <el-button size="small" type="warning">售出筐子</el-button>
        </div>
      </div>

      <div class="currentInventory-table">
        <u-table
          ref="plTable"
          class="utable"
          :height="
            queryData.typeArray.length > 2
              ? $store.getters.screenHeight - 415 + 'px'
              : $store.getters.screenHeight - 390 + 'px'
          "
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
          :data="tableDataList"
          :span-method="objectSpanMethod"
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
            :sortable="item.sortable"
          >
            <template slot-scope="scope">
              <span v-if="item.prop == 'basketName'">
                <el-button
                  type="text"
                  @click="handelShow('筐子信息', 'basketInform', scope.row)"
                  >{{ scope.row[item.prop] }}</el-button
                >
              </span>

              <span
                v-else-if="
                  item.prop == 'count' ||
                  item.prop == 'count1' ||
                  item.prop == 'cargoCount' ||
                  item.prop == 'vacantCount'
                "
                >{{ scope.row[item.prop] | intervalFormat(true) }}个</span
              >

              <span v-else-if="item.prop == 'countedit'">
                <el-dropdown
                  trigger="click"
                  @command="(val) => handleJumpDetail2(val, scope.row)"
                >
                  <el-button type="text">
                    调整
                    <i class="el-icon-arrow-down el-icon--right"></i>
                  </el-button>
                  <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="emptyBasket"
                      >腾空</el-dropdown-item
                    >
                    <el-dropdown-item command="scrapBasket"
                      >报废</el-dropdown-item
                    >
                    <el-dropdown-item command="basketLost"
                      >报失</el-dropdown-item
                    >
                    <el-dropdown-item command="basketOverflow"
                      >报溢</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </el-dropdown>
              </span>

              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </u-table-column>
          <u-table-column label="操作" :width="100" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                @click="handleJumpDetail1('currentBasketDetails', scope.row)"
                >查看</el-button
              >
            </template>
          </u-table-column>
        </u-table>
        <div class="paging">
          <el-pagination
            background
            layout="total, sizes, prev, pager, next, jumper"
            :page-sizes="[50, 100, 200, 300]"
            :total="pagination.total"
            :page-size="pagination.limit"
            :current-page.sync="pagination.page"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          ></el-pagination>
        </div>
      </div>
      <basketInform ref="basketInform"></basketInform>
    </div>
  </Container>
</template>

<script>
import { Base64 } from "js-base64";
import basketInform from "../dialogmod/basketInform.vue";
import { currentbasket } from "@/request/api/frameManage/index";
// import { ListMixin } from "@/mixins/ListMixin";

export default {
  name: "currentInventory",
  // mixins: [ListMixin],
  components: { basketInform },
  data() {
    return {
      queryData: {
        typeArray: [],
      },
      pagination: {
        page: 1, // 页码
        limit: 50, // 分页大小
        total: 0,
      },
      typeOptions: [
        {
          value: 1,
          label: "蔬菜",
        },
        {
          value: 2,
          label: "水果",
        },
        {
          value: 3,
          label: "肉类",
        },
        {
          value: 4,
          label: "活禽",
        },
        {
          value: 5,
          label: "水产",
        },
        {
          value: 6,
          label: "冻品",
        },
        {
          value: 7,
          label: "粮油",
        },
        {
          value: 8,
          label: "调味品",
        },
        {
          value: 9,
          label: "休闲食品",
        },
        {
          value: 10,
          label: "酒水饮料",
        },
        {
          value: 11,
          label: "干货",
        },
        {
          value: 12,
          label: "茶叶",
        },
      ],
      columns: [
        {
          width: 250,
          prop: "basketName",
          label: "筐子种类",
          align: "left",
        },
        {
          width: 120,
          prop: "count",
          label: "库存总数",
          // sortable: true,
          align: "left",
        },
        {
          width: 200,
          prop: "countedit",
          label: "库存调整", // edit
          align: "center",
        },
        {
          // width: 200,
          prop: "color",
          label: "颜色",
          align: "left",
        },
        {
          // width: 200,
          prop: "count1",
          label: "库存数量",
          align: "left",
        },
        {
          // width: 200,
          prop: "cargoCount",
          label: "载货数量",
          align: "left",
        },
        {
          // width: 200,
          prop: "vacantCount",
          label: "空置数量",
          align: "left",
        },
      ],
      tableData: {},
      tableDataList: [],
    };
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        if (oldVal.path == "/frameManage/addOwnBasket") {
          this.getList(1);
        }
      },
      // 深度观察监听
      deep: true,
    },
  },
  computed: {
    // tableDataList() {
    //   let data = [];
    //   let random = null;
    //   let num = 0;
    //   for (let i = 0; i < 100; i++) {
    //     if (i == 0) {
    //       random = parseInt(Math.random() * (10 - 1 + 1) + 1, 10);
    //       num = i + random;
    //       // console.log(random);
    //       // console.log(num);
    //       data.push({
    //         isCol: random,
    //         basketName: "123123sadfsd",
    //         count: "库存总数",
    //         countedit: "库存调整",
    //         color: "白色",
    //         count1: "60",
    //         cargoCount: "60",
    //         vacantCount: "60",
    //       });
    //       continue;
    //     }
    //     if (num == i) {
    //       random = parseInt(Math.random() * (5 - 1 + 1) + 1, 10);
    //       num = i + random;
    //       // console.log(random);
    //       // console.log(num);
    //       data.push({
    //         isCol: random,
    //         basketName: "123123sadfsd",
    //         count: "库存总数",
    //         countedit: "库存调整",
    //         color: "白色",
    //         count1: "60",
    //         cargoCount: "60",
    //         vacantCount: "60",
    //       });
    //       continue;
    //     }
    //     data.push({
    //       basketName: "123123sadfsd",
    //       count: "库存总数",
    //       countedit: "库存调整",
    //       color: "白色",
    //       count1: "60",
    //       cargoCount: "60",
    //       vacantCount: "60",
    //     });
    //   }
    //   console.log(data);
    //   // }
    //   return data;
    // },
  },
  methods: {
    getList(arg) {
      if (arg === 1) {
        this.pagination.page = 1;
      }
      let param = {
        type: this.queryData.typeArray.toString() || "0",
        pageindex: this.pagination.page, // 页码
        pagesize: this.pagination.limit, // 分页大小
      };

      currentbasket(param).then((res) => {
        if (res.status == 200) {
          this.tableData = res.data[0];
          this.pagination.total = res.data[0].basketListCount;

          if (res.data[0].basketList.length > 0) {
            let tableData = [];
            let data1 = res.data[0].basketList;
            for (let i = 0; i < data1.length; i++) {
              const el = data1[i];
              if (el.modelList.length > 0) {
                let data2 = el.modelList;
                for (let j = 0; j < data2.length; j++) {
                  const el1 = data2[j];
                  tableData.push({
                    isCol: j == 0 ? el.modelList.length : null,
                    ...el,
                    color: el1.color, // 筐子颜色
                    count1: el1.count, // 库存数量
                    cargoCount: el1.cargoCount, // 载货数量
                    vacantCount: el1.vacantCount, // 空置数量
                    basketStock: el1.basketStock, // 自购进入当前库存数量--新增字段(用于报废筐子---我的筐子进入当前数量)
                  });
                }
              } else {
                tableData.push(el);
              }
            }

            // console.log(tableData);
            this.tableDataList = tableData;
          }
        }
      });
    },
    // 合并列
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex == 0 || row.isCol) {
          return {
            rowspan: row.isCol,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }

      if (columnIndex === 1) {
        if (rowIndex == 0 || row.isCol) {
          return {
            rowspan: row.isCol,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }

      if (columnIndex === 2) {
        if (rowIndex == 0 || row.isCol) {
          return {
            rowspan: row.isCol,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
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
    // 刷新
    hanleRefresh() {
      this.getList(1);
    },
    // 弹框
    handelShow(title, form, record) {
      this.$refs[form].edit(record);
      this.$refs[form].title = title;
      this.$refs[form].disableSubmit = false;
      this.$refs[form].isVisiable = true;
    },
    // 跳转页面
    handleJumpDetail: function (form, record) {
      this.$router.push({
        path: form,
      });
      // Base64.decode(this.pwd);//解密
    },
    // 跳转页面
    handleJumpDetail1: function (form, record) {
      this.$router.push({
        path: form,
        query: {
          data: Base64.encode(
            JSON.stringify({
              basketId: record.basketId,
              basketName: record.basketName,
              color: record.color, // 颜色
              count1: record.count1, // 库存数量
              cargoCount: record.cargoCount, // 载货数量
              vacantCount: record.vacantCount, // 空置数量
            })
          ),
        }, //加密
      });
      // Base64.decode(this.pwd);//解密
    },
    // 跳转页面1
    handleJumpDetail2: function (form, record) {
      this.$router.push({
        path: form,
        query: {
          data: Base64.encode(
            JSON.stringify({
              basketId: record.basketId,
              basketName: record.basketName,
              basketImage: record.basketImage,
              modelList: record.modelList,
            })
          ),
        }, //加密
      });
    },
  },
  created() {
    this.getList(1);
  },
};
</script>

<style lang="scss" scoped>
.currentInventory-model {
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
          // margin-right: 40px;
          .header-lf-word {
            font-size: 16px;
            color: rgba(1, 6, 33, 0.9);
            margin-bottom: 5px;
          }

          .header-lf-num {
            font-size: 24px;
            color: rgba(1, 6, 33, 0.9);
          }
        }
      }
      .lineH {
        width: 1px;
        height: 35px;
        border-right: 1px solid rgba(1, 6, 33, 0.35);
        overflow: hidden;
        box-shadow: none;
        margin: 0px 25px 0px 60px;
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
      margin-right: 15px;

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
}
</style>

<style lang="scss">
</style>
