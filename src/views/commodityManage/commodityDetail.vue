<template>
  <TableContainer
    title="商品详情"
    :page-size="queryData.pagesize"
    :total="queryData.total"
    :page-num="queryData.pageindex"
    @pagination="handlePagination"
    v-loading="loading"
  >
    <el-container class="main_styl">
      <el-header :style="activeName == 1 ? 'height:300px;' : 'height:350px;'">
        <el-row>
          <el-col :span="16">
            <font style="font-size: 20px">{{ goodMsg.name }}</font>
          </el-col>
          <el-col :span="8" style="text-align: right">
            <el-button-group>
              <el-button @click="topButtonGroup('1')">开销售单</el-button>
              <el-button @click="topButtonGroup('2')">开需求单</el-button>
              <el-button @click="topButtonGroup('3')">添加入库</el-button>
              <el-dropdown
                style="border-left: 1px solid #d0d0d2"
                @command="
                  (val) => topButtonGroup(val, this.$route.query.id, '商品详情')
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
          <el-col :span="4">产地：{{ goodMsg.regionName }}</el-col>
          <el-col :span="4">级别/规格：{{ goodMsg.spec }}</el-col>
          <el-col :span="4"
            >计算单位：
            {{ goodMsg.subUnit }}
            {{ goodMsg.subUnit2 != "" ? "(" : "" }}
            {{
              goodMsg.subUnit3Weight == 0
                ? ""
                : goodMsg.subUnit3Weight + goodMsg.subUnit3
            }}
            {{ goodMsg.subUnit3 != "" ? "*" : "" }}
            {{
              goodMsg.subUnit2Weight == 0
                ? ""
                : goodMsg.subUnit2Weight + goodMsg.subUnit2
            }}
            {{ goodMsg.subUnit2 != "" ? "/" + goodMsg.subUnit : "" }}
            {{ goodMsg.subUnit2 != "" ? ")" : "" }}
          </el-col>
          <el-col :span="4"
            >当前库存：
            {{ goodMsg.batchNumber + goodMsg.subUnit }}
            {{ goodMsg.subUnit2 != "" ? "(" : "" }}
            {{
              goodMsg.subUnit3Weight == 0
                ? ""
                : goodMsg.subUnit3Weight + goodMsg.subUnit3
            }}
            {{ goodMsg.subUnit3 != "" ? "*" : "" }}
            {{
              goodMsg.subUnit2Weight == 0
                ? ""
                : goodMsg.subUnit2Weight + goodMsg.subUnit2
            }}
            {{ goodMsg.subUnit2 != "" ? "/" + goodMsg.subUnit : "" }}
            {{ goodMsg.subUnit2 != "" ? ")" : "" }}
            {{
              goodMsg.pieceUnit != "" && goodMsg.pieceUnit != "筐(一次性)"
                ? "(" + goodMsg.pieceNumber + goodMsg.pieceUnit + ")"
                : "(" + goodMsg.pieceNumber + "筐)"
            }}
            {{ goodMsg.basketNumber != 0 ? "|" + goodMsg.basketNumber : ""
            }}<font v-if="goodMsg.basketNumber != 0" style="color: #df971a"
              >筐</font
            >
          </el-col>
          <el-col :span="4">
            <el-button type="text" @click="openDialog"
              >近7天交易客户></el-button
            >
          </el-col>
        </el-row>
        <el-row style="margin-top: 10px; color: rgba(1, 6, 33, 0.55)">
          <el-col :span="4"
            >月销售量：{{ goodMsg.sales + goodMsg.subUnit }}</el-col
          >
          <el-col :span="4"
            >月采购量：{{ goodMsg.procurement + goodMsg.subUnit }}</el-col
          >
          <el-col :span="4"
            >月生产量：{{ goodMsg.reportCount + goodMsg.subUnit }}</el-col
          >
        </el-row>
        <el-row style="margin-top: 20px; color: rgba(1, 6, 33, 0.55)">
          <el-col :span="4"
            >近30天平均销售价：{{
              goodMsg.salePrice + "元/" + goodMsg.subUnit
            }}</el-col
          >
          <el-col :span="4"
            >近30天平均采购价：{{
              goodMsg.buyingCost + "元/" + goodMsg.subUnit
            }}</el-col
          >
        </el-row>
        <el-divider></el-divider>
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="按出入库记录" name="1"></el-tab-pane>
          <el-tab-pane label="按入库批次" name="2"></el-tab-pane>
        </el-tabs>
        <div class="change_styl" v-if="activeName == 1">
          <p style="font-size: 13px">
            {{ activeName == 1 ? "进出库类型" : "批次入库类型" }}
          </p>
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
        <div class="change_styl" v-if="activeName == 2">
          <el-select v-model="orderType" size="mini" multiple>
            <template slot="prefix">
              <div class="label-title">订单状态</div>
            </template>
            <!--  0 全部 1 采购入库，2：自家生产,3 转换入库 4 分拣入库 -->
            <el-option label="全部" value="0"></el-option>
            <el-option label="采购入库" value="1"></el-option>
            <el-option label="自家生产" value="2"></el-option>
            <el-option label="转换入库" value="3"></el-option>
            <el-option label="分拣入库" value="4"></el-option>
          </el-select>
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
          <span class="date_header_text" style="font-size: 13px">{{
            activeName == 1 ? "出入库时间" : "批次入库时间"
          }}</span>
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
        <el-tabs
          v-model="activeName2"
          type="card"
          @tab-click="handleClick2"
          v-if="activeName == 2"
        >
          <el-tab-pane label="全部" name="0"></el-tab-pane>
          <el-tab-pane label="有库存" name="1"></el-tab-pane>
          <el-tab-pane label="无库存" name="2"></el-tab-pane>
        </el-tabs>
      </el-header>
      <el-main>
        <div v-if="activeName == 1" style="height: 100%">
          <el-table
            :data="goodMsg.modellist"
            style="border-top: 1px solid E9E9E9"
            height="100%"
          >
            <el-table-column
              label="出入库单号"
              prop="orderNo"
            ></el-table-column>
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
                  scope.row.pieceUnit != "" &&
                  scope.row.pieceUnit != "筐(一次性)"
                    ? "(" + scope.row.pieceNumber + scope.row.pieceUnit + ")"
                    : "(" + scope.row.pieceNumber + "筐)"
                }}
                {{
                  scope.row.basketNumber != 0
                    ? "|" + scope.row.basketNumber
                    : ""
                }}<font
                  v-if="scope.row.basketNumber != 0"
                  style="color: #df971a"
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
                  <el-tag
                    v-if="scope.row.typeId == 11 || scope.row.typeId == 10"
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
                <el-button type="text" @click="check(1, scope.row)"
                  >查看</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <div v-if="activeName == 2" style="height: 100%">
          <el-table
            :data="goodMsg.modellist"
            style="border-top: 1px solid E9E9E9"
            height="100%"
          >
            <el-table-column label="单号" prop="orderNo"></el-table-column>
            <el-table-column label="批次入库类型" prop="batchType">
              <template slot-scope="scope">
                {{
                  scope.row.batchType == 0
                    ? "采购入库"
                    : scope.row.batchType == 1
                    ? "自家生产"
                    : scope.row.batchType == 2
                    ? "转换入库"
                    : "分拣入库"
                }}
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
                      scope.row.custmorType == 11 || scope.row.custmorType == 7
                    "
                    >经</el-tag
                  >
                  <el-tag
                    type="warning"
                    v-if="
                      scope.row.custmorType == 3 || scope.row.custmorType == 4
                    "
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
            <el-table-column label="入库数量" prop="newBatchNumber">
              <template slot-scope="scope">
                {{ scope.row.newBatchNumber + scope.row.subUnit }}
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
                <span v-if="scope.row.pieceUnit != ''">
                  {{
                    scope.row.pieceUnit != "" &&
                    scope.row.pieceUnit != "筐(一次性)"
                      ? "(" + scope.row.pieceNumber + scope.row.pieceUnit + ")"
                      : "(" + scope.row.pieceNumber + "筐)"
                  }}
                </span>
                {{
                  scope.row.basketNumber != 0
                    ? "|" + scope.row.basketNumber
                    : ""
                }}
                <font v-if="scope.row.basketNumber != 0" style="color: #df971a"
                  >筐</font
                >
              </template>
            </el-table-column>
            <el-table-column label="剩余库存" prop="batchNumber">
              <template slot-scope="scope">
                <font :style="scope.row.batchNumber == 0 ? 'color:red;' : ''">
                  {{ scope.row.batchNumber + scope.row.subUnit }}</font
                >
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
                  scope.row.pieceUnit != "" &&
                  scope.row.pieceUnit != "筐(一次性)"
                    ? "(" + scope.row.pieceNumber + scope.row.pieceUnit + ")"
                    : "(" + scope.row.pieceNumber + "筐)"
                }}
                {{
                  scope.row.basketNumber != 0
                    ? "|" + scope.row.basketNumber
                    : ""
                }}<font
                  v-if="scope.row.basketNumber != 0"
                  style="color: #df971a"
                  >筐</font
                >
              </template>
            </el-table-column>
            <el-table-column label="批次入库时间" prop="timestamp">
              <template slot-scope="scope">
                {{ scope.row.timeStamp ? toDate(scope.row.timeStamp) : "--" }}
              </template>
            </el-table-column>
            <el-table-column label="最近变动时间" prop="changeTimestamp">
              <template slot-scope="scope">
                {{
                  scope.row.changeTimestamp
                    ? toDate(scope.row.changeTimestamp)
                    : "--"
                }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="check(2, scope.row)"
                  >查看</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-dialog
          title="近7天交易的客户"
          :visible.sync="Transactionuser"
          width="800px"
          :before-close="TransactionuserhandleClose"
        >
          <div style="height: 500px">
            <div v-if="TransactionuserMsg.length > 0">
              <div
                v-for="(item, index) in TransactionuserMsg"
                :key="index"
                style="
                  min-height: 100px;
                  border-bottom: 1px solid rgba(1, 6, 33, 0.06);
                  padding-top: 10px;
                  padding-bottom: 10px;
                "
              >
                <el-row>
                  <el-col :span="3">
                    <el-avatar
                      :size="80"
                      :src="item.personHeadPhoto"
                      @error="errorHandler"
                    >
                      <img
                        src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
                      />
                    </el-avatar>
                  </el-col>
                  <el-col :span="18">
                    <font style="color: #010621; font-size: 14px">{{
                      item.personName
                    }}</font>
                    <el-button
                      type="danger"
                      plain
                      size="mini"
                      style="padding: 5px 5px; margin-left: 20px"
                      v-if="item.personName != '散户' && item.orderType == 2"
                      >非平台</el-button
                    >
                    <el-button
                      type="primary"
                      plain
                      size="mini"
                      style="padding: 5px 5px; margin-left: 20px"
                      v-if="item.personName != '散户' && item.orderType == 1"
                    >
                      {{
                        item.typeid == 3 || item.typeid == 4
                          ? "采购户"
                          : item.typeid == 6 || item.typeid == 7
                          ? "经营户"
                          : "供货商"
                      }}
                    </el-button>
                    <el-divider
                      direction="vertical"
                      v-if="item.personName != '散户'"
                    ></el-divider>
                    <template v-if="item.businessScopelId != ''">
                      <span
                        v-for="(
                          businessScopelIditem, businessScopelIdindex
                        ) in item.addobj"
                        :key="'businessScopelId' + businessScopelIdindex"
                      >
                        <el-button
                          type="success"
                          round
                          style="
                            padding: 5px 5px;
                            margin-right: 15px;
                            margin-top: 8px;
                            color: #248b39;
                            border: 1px #248b39 solid;
                            background: #f6ffed;
                          "
                        >
                          {{ businessScopelIditem }}
                        </el-button>
                        <!-- <div class="tags_styl">{{businessScopelIditem}}</div> -->
                      </span>
                    </template>
                    <br />
                    <div
                      v-if="item.PhoneNumber != ''"
                      style="
                        margin-right: 30px;
                        display: inline-block;
                        margin-top: 15px;
                      "
                    >
                      联系电话：{{ item.PhoneNumber }}
                    </div>
                    <div
                      v-if="item.companyName != ''"
                      style="display: inline-block; margin-top: 15px"
                    >
                      企业名称：{{ item.companyName }}
                    </div>
                    <p style="margin-top: 15px">
                      最近交易时间：{{ toDate(item.timestamp) }}
                    </p>
                  </el-col>
                  <el-col :span="2">
                    <el-button type="text" style="padding: 0px"
                      >客户详情></el-button
                    >
                  </el-col>
                </el-row>
              </div>
            </div>
            <div
              v-if="TransactionuserMsg.length == 0"
              style="text-align: center"
            >
              最近7天无交易记录
            </div>
          </div>
        </el-dialog>
      </el-main>
    </el-container>
  </TableContainer>
</template>
<script>
import moment from "moment";
import {
  getInfo,
  getTransactionuser,
} from "@/request/api/commodityDetail/index";
export default {
  data() {
    return {
      id: this.$route.query.id,
      loading: true,
      TransactionuserMsg: [],
      Transactionuser: false,
      orderType: [],
      shareScopeEnd: [],
      shareScope: [],
      props: { multiple: true, checkStrictly: true },
      typeoptions: [],
      activeName: "1",
      activeName2: "0",
      goodMsg: {},
      queryData: {
        productId: this.$route.query.id,
        type: 1,
        pageindex: 1,
        pagesize: 10,
        total: 0,
      },
    };
  },
  methods: {
    topButtonGroup(val, id, type) {
      this.$router.push({ path: val, query: { id: id, type: type } });
    },
    check(type, row) {
      if (type == 2) {
        console.log(row);
        this.$router.push({
          path: "batchDetail",
          query: {
            row: encodeURIComponent(JSON.stringify(row)),
            goodsId: this.id,
          },
        });
      } else {
        if (row.realationModel == "51" || row.realationModel == "56") {
          this.$router.push({
            path: "addcommodityDetails",
            query: {
              id: row.realationModelId,
            },
          });
        } else if (row.realationModel == "55") {
          this.$router.push({
            path: "unitConversionDetail",
            query: { id: row.realationModelId },
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
        } else if (row.realationModel == "58") {
          this.$router.push({
            path: "emptyDetails",
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
      }
    },
    errorHandler() {
      return true;
    },
    openDialog() {
      this.Transactionuser = true;
      getTransactionuser({
        productId: this.id,
      }).then((resp) => {
        this.TransactionuserMsg = resp.data;
        for (let i = 0; i < this.TransactionuserMsg.length; i++) {
          this.TransactionuserMsg[i].addobj =
            this.TransactionuserMsg[i].businessScopelId.split(",");
        }
        console.log(this.TransactionuserMsg);
      });
    },
    TransactionuserhandleClose() {
      this.Transactionuser = false;
    },
    toDate(val) {
      return moment(val * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
    Query() {
      let res = {};
      res.type = this.activeName;
      if (this.activeName == 1) {
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
              res.typeNumber = "9";
            } else {
              res.typeNumber = "10";
            }
          } else {
            if (this.shareScope[0][0] == 1) {
              res.typeView = 1;
            } else {
              res.typeView = 2;
            }
            res.typeNumbe = this.shareScope[0][1];
          }
        } else {
          if (this.shareScope.length > 0) {
            let obj = this.shareScope.map((item) => {
              return item[1];
            });
            res.typeNumbe = obj.join(",");
            res.typeView = this.shareScope[0][0];
          }
        }
      } else {
        res.typeView = this.activeName2;
        if (this.orderType) {
          res.typeNumber = this.orderType.join(",");
        }
      }
      res.productId = this.queryData.productId;
      res.pageindex = 1;
      res.pagesize = this.queryData.pagesize;
      res.total = this.queryData.total;
      this.queryData = res;
      console.log(this.queryData);
      this.getInfo();
    },
    Reset() {
      this.shareScope = [];
      this.orderType = [];
      this.queryData = {
        productId: this.id,
        type: this.activeName,
        pageindex: 1,
        pagesize: 10,
        total: 0,
      };
      this.getInfo();
    },
    handleClick(tab, event) {
      this.Reset();
    },
    handleClick2(tab, event) {
      this.queryData.pageindex = 1;
      this.Query();
    },
    handlePagination(e) {
      this.queryData.pageindex = e.pageNum;
      this.queryData.pagesize = e.pageSize;
      this.getInfo();
      // this.Query();
    },
    getInfo() {
      getInfo(this.queryData).then((resp) => {
        this.goodMsg = resp.data[0];
        this.queryData.total = this.goodMsg.modelListCount;
        this.loading = false;
      });
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
    getOptions() {
      let param = this.$store.getters.userInfo;
      this.typeoptions = [
        {
          value: 1,
          label: "出库类型",
          disabled: true,
          children: [],
        },
        {
          value: 2,
          label: "入库类型",
          disabled: true,
          children: [],
        },
        {
          value: 3,
          label: "装筐",
        },
        {
          value: 4,
          label: "腾空",
        },
      ];
      //usertype  3--企业采购  4--个体采购  6--企业经营  7--个体经营  10--个体供货  11--企业供货
      //purchaseType  1--食堂饭店  2--生鲜超市  3--农贸市场
      if (param.usertype != 3 && param.usertype != 4) {
        this.typeoptions[0].children = [
          {
            value: 6,
            label: "销售出库",
          },
          {
            value: 7,
            label: "转换出库",
          },
          {
            value: 8,
            label: "退货出库",
          },
          {
            value: 5,
            label: "报损出库",
          },
          {
            value: 12,
            label: "分拣出库",
          },
        ];
        this.typeoptions[1].children = [
          {
            value: 2,
            label: "采购入库",
          },
          {
            value: 13,
            label: "自家生产",
          },
          {
            value: 1,
            label: "报溢入库",
          },
          {
            value: 3,
            label: "转换入库",
          },
          {
            value: 4,
            label: "退货入库",
          },
          {
            value: 11,
            label: "分拣入库",
          },
        ];
      } else {
        this.typeoptions[0].children = [
          {
            value: 7,
            label: "转换出库",
          },
          {
            value: 8,
            label: "退货出库",
          },
          {
            value: 16,
            label: "配送出库",
          },
          {
            value: 5,
            label: "报损出库",
          },
          {
            value: 14,
            label: "菜品销售出库",
          },
          {
            value: 15,
            label: "销售记账出库",
          },
          {
            value: 7,
            label: "分拣出库",
          },
        ];
        this.typeoptions[1].children = [
          {
            value: 2,
            label: "采购入库",
          },
          {
            value: 13,
            label: "自家生产",
          },
          {
            value: 1,
            label: "报溢入库",
          },
          {
            value: 3,
            label: "转换入库",
          },
          {
            value: 17,
            label: "配送退货入库",
          },
          {
            value: 11,
            label: "分拣入库",
          },
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
  },
  mounted() {
    document.getElementsByClassName("el-range__close-icon")[0].className +=
      " el-icon-date"; //在原来的后面加这个
  },
  created() {
    this.getInfo();
    this.getOptions();
  },
};
</script>
<style scoped lang="scss">
.main_styl {
  min-width: 1400px;
  font-family: PingFangSC-, PingFang SC;
  font-weight: normal;
}

.label-title {
  padding: 0 6px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(1, 6, 33, 0.35);
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

.date_header_text {
  position: absolute;
  left: 37px;
  top: 4px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(1, 6, 33, 0.35);
}

.date_header_styl {
  position: relative;
  display: inline-block;
}

::v-deep .el-range-editor--mini .el-range-input {
  font-size: 12px;
  padding-left: 30px;
}

.el-checkbox__inner {
  display: none !important;
}

::v-deep .el-input--prefix .el-input__inner {
  padding-left: 70px !important;
}

.font_color {
  color: #248b39 !important;
}

.el-tag {
  padding: 0px 1px !important;
}

.el-tag--medium {
  height: 17px !important;
  line-height: 17px !important;
}

.tags_styl {
  display: inline-block;
  color: #248b39;
  border: 1px #248b39 solid;
  padding: 2px 2px;
  margin-right: 5px;
  margin-bottom: 5px;
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
}
</style>