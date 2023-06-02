<template>
  <!-- 选择商品 -->
  <PageNoScroll @hanleRefresh="hanleRefresh">
    <div
      class="historicalSendingmodel"
      :style="{ '--screenHeight': $store.getters.screenHeight - 305 + 'px' }"
    >
      <div
        style="
          padding: 5px 0px;
          color: rgba(1, 6, 33, 0.9);
          font-size: 16px;
          font-weight: 700;
        "
      >
        已添加商品{{ tableDataNum.length }}个，可选商品剩余{{
          20 - tableDataNum.length
        }}个
      </div>

      <div style="padding: 10px 0px; border-bottom: 1px solid #e9e9e9">
        <el-date-picker
          ref="selectedTime"
          @change="changeTime"
          size="mini"
          v-model="form.queryTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="timestamp"
          :picker-options="pickerOptions"
        >
        </el-date-picker>

        <el-select
          size="mini"
          v-model="timeQuantum"
          style="width: 100px; margin-left: 10px"
          class="change_timeQ"
          @change="changetimeQ"
        >
          <el-option
            v-for="item in timeQoptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>

      <div class="flex_dom">
        <div class="salesDraft-left">
          <div
            style="
              padding: 10px 10px;
              border-bottom: 1px solid rgba(1, 6, 33, 0.06);
            "
          >
            <div style="font-size: 16px; color: rgba(1, 6, 33, 0.9)">
              发送需求：{{ tableData.orderBeforeNum }}单
            </div>
          </div>
          <el-scrollbar>
            <ul class="salesDraft-left-ul">
              <li
                v-for="(item, index) in tableData.modelList"
                :key="index"
                class="salesDraft-left-li flex_dom flex_item_mid"
                :style="{ background: tableIndex == index ? '#CEF2ED' : '' }"
                @click="handleTable(index)"
              >
                <div>
                  <el-checkbox
                    v-model="checkedList[index]"
                    @change="handelChecked(index)"
                  >
                  </el-checkbox>
                </div>
                <div style="padding: 0px 10px; cursor: pointer">
                  <div style="font-size: 14px; color: rgba(1, 6, 33, 0.9)">
                    {{ item.personName }}
                    <el-tag type="info" size="mini" v-if="item.typeId == 0"
                      >非
                    </el-tag>
                    <el-tag
                      size="mini"
                      v-if="item.typeId == 11 || item.typeId == 10"
                      >供</el-tag
                    >
                    <el-tag
                      type="danger"
                      size="mini"
                      v-if="item.typeId == 6 || item.typeId == 7"
                      >经
                    </el-tag>
                    <el-tag
                      type="warning"
                      size="mini"
                      v-if="item.typeId == 3 || item.typeId == 4"
                      >采
                    </el-tag>
                    - {{ item.phoneNumber }}
                  </div>
                  <div
                    style="
                      color: rgba(1, 6, 33, 0.9);
                      font-size: 14px;
                      padding: 5px 0px;
                    "
                  >
                    需求单号: {{ item.orderBefore }}
                  </div>
                  <div style="color: rgba(1, 6, 33, 0.55); font-size: 14px">
                    {{ item.timestamp | parseTime() }}
                  </div>
                </div>
              </li>
            </ul>
          </el-scrollbar>
        </div>
        <div class="historicalSendingtable" style="padding: 10px">
          <div
            class="flex_dom flex_item_between"
            style="
              color: rgba(1, 6, 33, 0.9);
              font-size: 14px;
              padding-bottom: 10px;
            "
          >
            <div>需求商品：20种</div>
            <div>
              操作人：{{
                tableData.modelList
                  ? tableData.modelList[tableIndex].addByUserName
                  : ""
              }}
            </div>
          </div>
          <u-table
            ref="plTable"
            class="utable"
            :border="false"
            :height="$store.getters.screenHeight - 520 + 'px'"
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
            :data="tableDataList[tableIndex]"
            @selection-change="handleSelectionChange"
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
                <span v-if="item.prop == 'categoryName'" style="color: #1a7fd9">
                  {{ scope.row.categoryfirstName }}-{{
                    scope.row.categorysecondName
                  }}-{{ scope.row.productName }}
                </span>
                <span
                  v-else-if="item.prop == 'productName'"
                  style="color: #1a7fd9"
                >
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
                        scope.row.productCount,
                        0,
                        scope.row.pieceCount
                      )
                    "
                  ></span>
                </span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
            </u-table-column>
          </u-table>
          <div style="padding: 15px 0px">
            <div
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 16px;
                font-weight: 700;
                padding-right: 15px;
              "
            >
              合计
            </div>

            <div style="padding: 0px 0px">
              <span
                style="
                  color: rgba(1, 6, 33, 0.55);
                  font-size: 14px;
                  width: 250px;
                  display: inline-block;
                "
                >商品种类：<span
                  style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                  >{{
                    tableData.modelList
                      ? tableData.modelList[tableIndex].orderBefore
                      : ""
                  }}种</span
                ></span
              >
            </div>
          </div>

          <div style="padding: 0px 0px">
            <div
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 16px;
                font-weight: 700;
                padding-right: 15px;
              "
            >
              备注
            </div>
            <div style="padding: 0px 0px; font-size: 14px">
              {{
                tableData.modelList
                  ? tableData.modelList[tableIndex].remark
                  : ""
              }}
            </div>
          </div>
        </div>
      </div>

      <div class="btnBottom">
        <div class="flex_row_reverse flex_item_mid">
          <div style="margin-right: 10px">
            <el-button
              :disabled="
                multipleSelection.length > 20 - tableDataNum.length
                  ? true
                  : false
              "
              type="primary"
              size="mini"
              @click="handleJumpDetail('addNewrequest', '')"
              >添加至需求单
            </el-button>
          </div>
          <div style="margin-right: 10px">
            <span
              style="
                font-size: 16px;
                color: rgba(1, 6, 33, 0.9);
                cursor: pointer;
              "
              >已选 需求单：{{ checkedListNum }}单，商品：(<span
                :style="{
                  color:
                    checkedListNum > 20 - tableDataNum.length
                      ? '#DD4C4D'
                      : '#0BA198',
                }"
                >{{ checkedListNum }}/{{ 20 - tableDataNum.length }}</span
              >
              种)</span
            >
          </div>
        </div>
      </div>
    </div>
  </PageNoScroll>
</template>

<script>
import { Base64 } from "js-base64";

import {
  alreadySendToOrderBefore,
  getOrderDetail,
} from "@/request/api/demandManage/index.js";
import { mapGetters } from "vuex";

export default {
  name: "addCommodity",
  data() {
    return {
      columns: [
        {
          prop: "categoryName",
          label: "商品分类",
        },
        {
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
        // {
        //     prop: "subUnit",
        //     label: "计算单位",
        // },
        {
          prop: "batchCount",
          label: "需求数量",
        },
      ],
      form: {
        queryTime: [],
      },
      tableData: [],
      tableDataList: [],
      tableDataNum: [],
      checkedList: [],
      multipleSelection: [],
      tableIndex: 0,
      timeQuantum: 24,
      timeQoptions: [
        {
          label: "24小时内",
          value: 24,
        },
        {
          label: "7天内",
          value: 7,
        },
        {
          label: "30天内",
          value: 30,
        },
        {
          label: "自定义",
          value: 0,
        },
      ],
      pickerOptions: {
        shortcuts: [
          {
            text: "24小时内",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "7天内",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "30天内",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  computed: {
    ...mapGetters(["sidebar", "userInfo", "device"]),
    checkedListNum() {
      let Nums = 0;
      for (let i = 0; i < this.checkedList.length; i++) {
        const el = this.checkedList[i];
        if (el) {
          Nums += this.tableDataList[i].length;
        }
      }

      return Nums;
    },
  },
  methods: {
    initData() {
      let { data: data } = this.$route.query;
      // 判断url是否为空
      if (data) {
        let param = JSON.parse(Base64.decode(data));
        this.form = JSON.parse(JSON.stringify(param.form));
        this.tableDataNum = JSON.parse(JSON.stringify(param.tableData));
        this.changetimeQ(24);
        // this.getList()
      }
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
    getList(arg) {
      //查询条件
      let param = {
        // "startTime": this.form.queryTime[0], // 开始时间 必传
        // "endTime": this.form.queryTime[1], // 结束时间 必传
        toUserId: this.form.touserId, // 客户userid 选填 历史发送需求
        search: "", // 模糊搜索
        pageindex: 0, // 页码
        pagesize: 0, // 分页大小， pageindex和pagesize都传0，即不分页
      };
      if (this.form.queryTime && this.form.queryTime.length > 0) {
        param.startTime = this.form.queryTime[0] / 1000;
        param.endTime = this.form.queryTime[1] / 1000;
      }

      alreadySendToOrderBefore(param).then((res) => {
        this.tableData = res.data[0].modelList;
        let param = [];
        if (this.tableData.modelList) {
          this.getList1();
          this.tableData.modelList.forEach(() => {
            param.push(false);
            this.tableDataList.push([]);
          });
        }
        this.checkedList = param;
      });
    },

    getList1() {
      let param = {
        orderId: this.tableData.modelList[this.tableIndex].orderId, // 需求单主键id
        toUserId: "", // 客户userid 选填 收到需求汇总-按客户查看传
      };
      getOrderDetail(param).then((res) => {
        this.$set(this.tableDataList, this.tableIndex, res.data[0].modelList);
      });
    },
    // 跳转页面
    handleJumpDetail: function (form, record) {
      let tableDataLists = [];
      for (let i = 0; i < this.tableDataNum.length; i++) {
        const el = this.tableDataNum[i];
        tableDataLists.push(el);
      }
      for (let i = 0; i < this.checkedList.length; i++) {
        const el = this.checkedList[i];
        if (el) {
          for (let j = 0; j < this.tableDataList[i].length; j++) {
            const ele = this.tableDataList[i][j];
            ele.categoryName =
              ele.firstName + " - " + ele.secoundName + " - " + ele.productName;
            ele.batchCount = ele.productCount;
            ele.pieceCount = ele.pieceCount;
            ele.basketCount = 0;
          }
          tableDataLists.push(...this.tableDataList[i]);
        }
      }

      if (tableDataLists.length == 0) {
        return this.$warning("请先选择数据");
      }

      let path = form;
      this.$store.dispatch("common/addNewrequestData", {
        isStatus: "add",
        tableDataList: tableDataLists,
      });
      this.$closePage(path, {});
    },
    // 刷新
    hanleRefresh() {
      this.getList(1);
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    handleTable(val) {
      this.tableIndex = val;
      this.getList1();
    },
    handelChecked(index) {},
    changeTime(val) {
      this.tableIndex = 0;
      this.tableData = [];
      this.tableDataList = [];
      this.getList();
    },
    changetimeQ(val) {
      if (val == 7) {
        const now = Date.parse(new Date());
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        const startTime = Date.parse(start);
        this.form.queryTime = [startTime, now];
      } else if (val == 30) {
        const now = Date.parse(new Date());
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        const startTime = Date.parse(start);
        this.form.queryTime = [startTime, now];
      } else if (val == 24) {
        const now = Date.parse(new Date());
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24);
        const startTime = Date.parse(start);
        this.form.queryTime = [startTime, now];
      }
      this.getList();
    },
  },

  //进入页面触发
  beforeRouteEnter(to, form, next) {
    next((vm) => {
      vm.initData();
    });
  },
};
</script>


<style lang="scss" scoped>
.historicalSendingmodel {
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

  .historicalSendingtable {
    width: calc(100% - 300px);

    .utable {
      width: 100%;
      border-top: 1px solid #e9e9e9;
      border-left: 1px solid #e9e9e9;
      border-right: 1px solid #e9e9e9;
    }
  }

  .btnBottom {
    border-top: 1px solid rgba(233, 233, 233, 1);
    padding-top: 10px;
    width: 100%;
    position: absolute;
    bottom: 10px;
    left: 0px;
    right: 10px;
  }
}
</style>

<style lang="scss">
.historicalSendingmodel {
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
}
</style>