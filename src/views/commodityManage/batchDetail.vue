<template>
  <TableContainer
    :page-size="queryData.pagesize"
    :total="queryData.total"
    :page-num="queryData.pageindex"
    @pagination="handlePagination"
    v-loading="loading"
  >
    <el-container class="main_styl">
      <el-header style="height: 200px">
        <el-row>
          <el-col :span="16">
            <font style="font-size: 20px">{{ goodsMsg.name }}</font>
          </el-col>
          <el-col :span="8" style="text-align: right">
            <el-button-group>
              <el-button @click="topButtonGroup(1)">开销售单</el-button>
              <el-button @click="topButtonGroup(2)">开需求单</el-button>
              <el-button @click="topButtonGroup(3)">添加入库</el-button>
              <el-dropdown
                style="border-left: 1px solid #d0d0d2"
                @command="
                  (val) =>
                    topButtonGroup(
                      val,
                      goodsId,
                      row.productIdBatchId,
                      '批次详情'
                    )
                "
              >
                <el-button>
                  <i class="el-icon-more"></i>
                </el-button>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="theOverflow"
                    >报溢</el-dropdown-item
                  >
                  <el-dropdown-item command="reportLoss">报损</el-dropdown-item>
                  <el-dropdown-item command="soar">腾空</el-dropdown-item>
                  <el-dropdown-item command="sorting">分拣</el-dropdown-item>
                  <el-dropdown-item command="unitConversion"
                    >单位转换</el-dropdown-item
                  >
                  <el-dropdown-item command="9">装周转筐</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-button-group>
          </el-col>
        </el-row>
        <el-row style="margin-top: 2px">
          <el-col :span="4">产地：{{ goodsMsg.regionName }}</el-col>
          <el-col :span="4">级别/规格：{{ goodsMsg.spec }}</el-col>
          <el-col :span="4"
            >计算单位：
            {{ goodsMsg.subUnit }}
            {{ goodsMsg.subUnit2 != "" ? "(" : "" }}
            {{
              goodsMsg.subUnit3Weight == 0
                ? ""
                : goodsMsg.subUnit3Weight + goodsMsg.subUnit3
            }}
            {{ goodsMsg.subUnit3 != "" ? "*" : "" }}
            {{
              goodsMsg.subUnit2Weight == 0
                ? ""
                : goodsMsg.subUnit2Weight + goodsMsg.subUnit2
            }}
            {{ goodsMsg.subUnit2 != "" ? "/" + goodsMsg.subUnit : "" }}
            {{ goodsMsg.subUnit2 != "" ? ")" : "" }}
          </el-col>
          <el-col :span="6"
            >当前库存：
            {{ goodsMsg.batchNumber + goodsMsg.subUnit }}
            {{ goodsMsg.subUnit2 != "" ? "(" : "" }}
            {{
              goodsMsg.subUnit3Weight == 0
                ? ""
                : goodsMsg.subUnit3Weight + goodsMsg.subUnit3
            }}
            {{ goodsMsg.subUnit3 != "" ? "*" : "" }}
            {{
              goodsMsg.subUnit2Weight == 0
                ? ""
                : goodsMsg.subUnit2Weight + goodsMsg.subUnit2
            }}
            {{ goodsMsg.subUnit2 != "" ? "/" + goodsMsg.subUnit : "" }}
            {{ goodsMsg.subUnit2 != "" ? ")" : "" }}
            {{
              goodsMsg.pieceUnit != "" && goodsMsg.pieceUnit != "筐(一次性)"
                ? "(" + goodsMsg.pieceNumber + goodsMsg.pieceUnit + ")"
                : "(" + goodsMsg.pieceNumber + "筐)"
            }}
            {{ goodsMsg.basketNumber != 0 ? "|" + goodsMsg.basketNumber : ""
            }}<font v-if="goodsMsg.basketNumber != 0" style="color: #df971a"
              >筐</font
            >
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px">
          <el-col :span="4"
            ><font class="font_styl1">入库原因：</font
            >{{
              this.row.batchType == 0
                ? "采购入库"
                : this.row.batchType == 1
                ? "自家生产"
                : this.row.batchType == 2
                ? "转换入库"
                : "分拣入库"
            }}</el-col
          >
          <el-col :span="6"
            ><font class="font_styl1">入库来源：</font
            >{{
              this.row.fromUserName != ""
                ? this.row.fromUserName + "【" + this.row.fromUserPhone + "】"
                : "--"
            }}</el-col
          >
          <el-col :span="8"
            ><font class="font_styl1">批次入库时间：</font
            >{{
              this.row.timestamp != "" ? toDate(this.row.timeStamp) : "--"
            }}</el-col
          >
        </el-row>
        <el-divider></el-divider>
        <div class="change_styl">
          <p style="font-size: 13px">出入库类型</p>
          <el-cascader
            :style="{
              width: shareScope.length * 120 + 'px',
              'min-width': '270px',
            }"
            v-model="shareScope"
            :options="typeoptions"
            :props="props"
            size="mini"
            placeholder="请选择出入库类型"
            :show-all-levels="false"
            @change="changeLabel"
            clearable
          >
          </el-cascader>
        </div>
        <div class="date_header_styl">
          <el-date-picker
            style="margin-left: 30px"
            value-format="timestamp"
            size="mini"
            prefix-icon="0"
            v-model="queryData.created_time"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
          <span class="date_header_text" style="font-size: 13px"
            >出入库时间</span
          >
        </div>
        <div style="display: inline-block; margin-left: 30px">
          <el-input
            size="mini"
            placeholder="请输入客户姓名/联系电话"
            suffix-icon="el-icon-search"
            v-model="queryData.search"
          >
          </el-input>
        </div>
        <div
          style="display: inline-block; margin-left: 30px; margin-bottom: 30px"
        >
          <el-button size="small" @click="Reset">重置</el-button>
          <el-button type="primary" size="small" @click="Query">查询</el-button>
        </div>
      </el-header>
      <el-main>
        <el-table
          :data="tableData"
          style="border-top: 1px solid E9E9E9"
          height="100%"
        >
          <el-table-column label="出入库单号" prop="orderNo"></el-table-column>
          <el-table-column label="出入库类型">
            <template slot-scope="scope">
              <!-- 1.报溢入库 2.采购入库 3.转换入库 4.退货入库 5.报损出库 6.销售出库  7.转换出库 8.退货出库 9 装筐 10.腾空 11.分拣入库 12.分拣出库 -->
              <span
                style="color: red"
                :class="{
                  font_color:
                    scope.row.actionType == 1 ||
                    scope.row.actionType == 2 ||
                    scope.row.actionType == 3 ||
                    scope.row.actionType == 4 ||
                    scope.row.actionType == 11 ||
                    scope.row.actionType == 9,
                }"
              >
                {{
                  scope.row.actionType == 1
                    ? "报溢入库"
                    : scope.row.actionType == 2
                    ? "采购入库"
                    : scope.row.actionType == 3
                    ? "转换入库"
                    : scope.row.actionType == 4
                    ? "退货入库"
                    : scope.row.actionType == 5
                    ? "报损出库"
                    : scope.row.actionType == 6
                    ? "销售出库"
                    : scope.row.actionType == 7
                    ? "转换出库"
                    : scope.row.actionType == 8
                    ? "退货出库"
                    : scope.row.actionType == 9
                    ? "装筐"
                    : scope.row.actionType == 10
                    ? "腾空"
                    : scope.row.actionType == 11
                    ? "分拣入库"
                    : "分拣出库"
                }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="单价">
            <template slot-scope="scope">
              <span v-if="scope.row.buyingCost != 0">{{
                scope.row.buyingCost + "/" + scope.row.subUnit
              }}</span>
              <span v-if="scope.row.buyingCost == 0">--</span>
            </template>
          </el-table-column>
          <el-table-column label="数量">
            <template slot-scope="scope">
              {{ scope.row.floatNumber + scope.row.subUnit }}
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
              {{
                scope.row.pieceUnit != "" && scope.row.pieceUnit != "筐(一次性)"
                  ? "(" + scope.row.pieceNumber + scope.row.pieceUnit + ")"
                  : "(" + scope.row.pieceNumber + "筐)"
              }}
              {{
                scope.row.basketNumber != 0 ? "|" + scope.row.basketNumber : ""
              }}<font v-if="scope.row.basketNumber != 0" style="color: #df971a"
                >筐</font
              >
            </template>
          </el-table-column>
          <el-table-column label="客户姓名" prop="fromUserName">
            <template slot-scope="scope">
              <span v-if="scope.row.fromUserName == ''">--</span>
              <span v-if="scope.row.fromUserName != ''">
                {{ scope.row.fromUserName }}
                <el-tag type="info" v-if="scope.row.typeId == 0">非</el-tag>
                <el-tag v-if="scope.row.typeId == 11 || scope.row.typeId == 10"
                  >供</el-tag
                >
                <el-tag
                  type="danger"
                  v-if="scope.row.typeId == 11 || scope.row.typeId == 7"
                  >经</el-tag
                >
                <el-tag
                  type="warning"
                  v-if="scope.row.typeId == 3 || scope.row.typeId == 4"
                  >采</el-tag
                >
              </span>
            </template>
          </el-table-column>
          <el-table-column label="联系电话" prop="fromUserPhone">
            <template slot-scope="scope">
              {{ scope.row.fromUserPhone ? scope.row.fromUserPhone : "--" }}
            </template>
          </el-table-column>
          <el-table-column label="出入库时间">
            <template slot-scope="scope">
              {{ toDate(scope.row.timeStamp) }}
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="check(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
    </el-container>
  </TableContainer>
</template>
<script>
import moment from "moment";
import { BatchDetail, getInfo } from "@/request/api/commodityDetail/index";
export default {
  name: "batchDetail",
  data() {
    return {
      loading: true,
      shareScopeEnd: [],
      tableData: [],
      shareScope: [],
      props: { multiple: true, checkStrictly: true },
      typeoptions: [],
      loading: true,
      row: this.$route.query.row,
      goodsId: this.$route.query.goodsId,
      goodsMsg: {},
      queryData: {
        type: "0",
        pageindex: 1,
        pagesize: 10,
        total: 0,
      },
    };
  },
  methods: {
    topButtonGroup(val, id1, id2, type) {
      this.$router.push({
        path: val,
        query: { id: this.goodsId, id2: id2, type: type },
      });
    },
    check(row) {
      console.log(row);
      if (
        row.realationModel == "51" ||
        row.realationModel == "52" ||
        row.realationModel == "56"
      ) {
        this.$router.push({
          path: "addcommodityDetails",
          query: { id: row.realationModelId },
        });
      } else if (row.realationModel == "53") {
        // this.$router.query({path:'overstatementDetails',query:{id:row.realationModelId}})
        this.$router.push({
          path: "overstatementDetails",
          query: { id: row.realationModelId },
        });
      } else {
        this.$error("暂无！");
      }
    },
    Reset() {
      this.shareScope = [];
      this.queryData = {
        type: "0",
        pageindex: 1,
        pagesize: 10,
        total: 0,
      };
      this.getBatchDetail();
    },
    Query() {
      let res = this.queryData;
      if (this.queryData.created_time) {
        res.startTime = this.queryData.created_time[0];
        res.endTime = this.queryData.created_time[1];
      }
      if (this.queryData.search) {
        res.search = this.queryData.search;
      }
      // console.log(this.shareScope)
      if (this.shareScope.length == 1) {
        if (this.shareScope[0].length == 1) {
          res.typeView = 0;
          if (this.shareScope[0][0] == 3) {
            res.type = "9";
          } else {
            res.type = "10";
          }
        } else {
          if (this.shareScope[0][0] == 1) {
            res.typeView = 1;
          } else {
            res.typeView = 2;
          }
          res.type = this.shareScope[0][1];
        }
      } else {
        if (this.shareScope.length > 0) {
          let obj = this.shareScope.map((item) => {
            return item[1];
          });
          res.type = obj.join(",");
          res.typeView = this.shareScope[0][0];
        }
      }
      res.pageindex = 1;
      res.pagesize = this.queryData.pagesize;
      res.total = this.queryData.total;
      console.log(res);
      this.queryData = res;
      this.getBatchDetail();
    },
    toDate(val) {
      return moment(val * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
    getBatchDetail() {
      this.row = JSON.parse(decodeURIComponent(this.$route.query.row));
      console.log(this.row);
      let res = this.queryData;
      res.productbatchId = this.row.productIdBatchId;
      // res.productbatchId = 5331 //测试分页用 5331
      let obj = {
        productId: this.goodsId,
        type: 1,
        pageindex: 1,
        pagesize: 10,
        total: 0,
      };
      getInfo(obj).then((resp) => {
        this.goodsMsg = resp.data[0];
      });
      BatchDetail(res).then((resp) => {
        this.queryData.total = resp.data[0].modelListCount;
        this.tableData = resp.data[0].modellist;
        setTimeout(() => {
          this.loading = false;
        }, 500);
      });
    },
    handlePagination(e) {
      this.queryData.pageindex = e.pageNum;
      this.queryData.pagesize = e.pageSize;
      this.getBatchDetail();
    },
    getOptions() {
      let param = this.$store.getters.userInfo;
      this.typeoptions = [
        { value: 1, label: "出库类型", disabled: true, children: [] },
        { value: 2, label: "入库类型", disabled: true, children: [] },
        { value: 3, label: "装筐" },
        { value: 4, label: "腾空" },
      ];
      //usertype  3--企业采购  4--个体采购  6--企业经营  7--个体经营  10--个体供货  11--企业供货
      //purchaseType  1--食堂饭店  2--生鲜超市  3--农贸市场
      if (param.usertype != 3 && param.usertype != 4) {
        this.typeoptions[0].children = [
          { value: 6, label: "销售出库" },
          { value: 7, label: "转换出库" },
          { value: 8, label: "退货出库" },
          { value: 5, label: "报损出库" },
          { value: 12, label: "分拣出库" },
        ];
        this.typeoptions[1].children = [
          { value: 2, label: "采购入库" },
          { value: 13, label: "自家生产" },
          { value: 1, label: "报溢入库" },
          { value: 3, label: "转换入库" },
          { value: 4, label: "退货入库" },
          { value: 11, label: "分拣入库" },
        ];
      } else {
        this.typeoptions[0].children = [
          { value: 7, label: "转换出库" },
          { value: 8, label: "退货出库" },
          { value: 16, label: "配送出库" },
          { value: 5, label: "报损出库" },
          { value: 14, label: "菜品销售出库" },
          { value: 15, label: "销售记账出库" },
          { value: 7, label: "分拣出库" },
        ];
        this.typeoptions[1].children = [
          { value: 2, label: "采购入库" },
          { value: 13, label: "自家生产" },
          { value: 1, label: "报溢入库" },
          { value: 3, label: "转换入库" },
          { value: 17, label: "配送退货入库" },
          { value: 11, label: "分拣入库" },
        ];
        if (param.purchaseType == 2) {
          this.typeoptions[0].children.splice(4, 1);
        } else if (param.purchaseType == 1) {
          this.typeoptions[0].children.splice(2, 1);
          this.typeoptions[1].children.splice(4, 1);
        } else {
          this.typeoptions[0].children.splice(2, 1);
          this.typeoptions[0].children.splice(4, 1);
          this.typeoptions[0].children.splice(5, 1);
          this.typeoptions[1].children.splice(4, 1);
        }
      }
    },
    changeLabel(val) {
      // 是否与上次的类型相同
      let changeFlag = false;
      let changeItem = null;
      if (this.shareScopeEnd.length === 0) {
        this.shareScope = val;
      } else {
        //与原数组比对
        this.shareScope.forEach((item) => {
          //与原数组的类型相同
          if (item[0] !== this.shareScopeEnd[0][0]) {
            changeFlag = true;
            changeItem = item;
          }
        });
      }
      if (changeFlag) {
        //上次是system,那么这次是domain
        if (this.shareScopeEnd[0][0] === "system") {
          this.shareScope = this.shareScope.filter((item) => {
            return item[0] !== "system";
          });
        } else {
          this.shareScope = [];
          this.shareScope.push(changeItem);
        }
      }
      this.shareScopeEnd = this.shareScope;
    },
  },
  mounted() {
    document.getElementsByClassName("el-range__close-icon")[0].className +=
      " el-icon-date"; //在原来的后面加这个
  },
  created() {
    this.getBatchDetail();
    this.getOptions();
  },
};
</script>
<style scoped lang='scss'>
.main_styl {
  min-width: 1400px;
  font-family: PingFangSC-, PingFang SC;
  font-weight: normal;
}
.font_styl1 {
  color: rgba(1, 6, 33, 0.55);
}
.change_styl {
  display: inline-block;
  position: relative;
  p {
    z-index: 1;
    position: absolute;
    top: 4px;
    left: 5px;
    color: rgba(1, 6, 33, 0.35);
  }
}
::v-deep .el-cascader__tags {
  padding-left: 90px;
}
::v-deep .el-cascader .el-input .el-input__inner {
  padding-left: 90px;
}
.date_header_styl {
  position: relative;
  display: inline-block;
}
.date_header_text {
  position: absolute;
  left: 34px;
  top: 4px;
  font-size: 13px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(1, 6, 33, 0.35);
}
::v-deep .el-range-editor--mini .el-range-input {
  font-size: 12px;
  padding-left: 30px;
}
.el-tag {
  padding: 0px 1px !important;
}
.el-tag--medium {
  height: 17px !important;
  line-height: 17px !important;
}
</style>