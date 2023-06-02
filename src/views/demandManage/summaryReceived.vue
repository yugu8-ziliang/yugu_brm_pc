<template>
  <Page>
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

    <el-date-picker
      ref="selectedTime"
      @change="changeTime"
      size="mini"
      v-model="queryTime"
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
      style="width: 7%"
      class="change_timeQ"
      @change="changetimeQ"
    >
      <el-option
        v-for="item in timeQoptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-divider></el-divider>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="按商品查看" name="1">
        <h4>商品信息:{{ typeGoodsMsg.orderBeforeCateNum }}种</h4>
        <div style="padding: 15px 20px; background: #f5f5f7; margin-top: 10px">
          <el-row style="margin-bottom: 15px" v-if="isshowtypeitem.all">
            <el-col :span="2">全部结果</el-col>
            <el-col :span="22" class="checked_type_styl">
              <el-tag
                @close="handleClose(index)"
                v-for="(item, index) in checkedType"
                v-if="item.name"
                :key="'tag' + index"
                closable
                type="info"
              >
                {{ item.name }}
              </el-tag>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">分类</el-col>
            <el-col
              :span="22"
              class="type_btn_styl"
              v-if="isshowtypeitem.first"
            >
              <el-button
                type="text"
                v-for="(item, index) in typeItem.first"
                :key="'type' + index"
                @click="handelFirst(item)"
                >{{ item.firstName }}</el-button
              >
            </el-col>
            <el-col
              :span="22"
              class="type_btn_styl"
              v-if="isshowtypeitem.second"
            >
              <el-button
                type="text"
                v-for="(item, index) in typeItem.second"
                :key="'type' + index"
                @click="handelSecound(item)"
                >{{ item.secoundName }}</el-button
              >
            </el-col>
            <el-col
              :span="22"
              class="type_btn_styl"
              v-if="isshowtypeitem.third"
            >
              <el-button
                type="text"
                v-for="(item, index) in typeItem.third"
                :key="'type' + index"
                @click="handelThird(item)"
                >{{ item.productName }}</el-button
              >
            </el-col>
          </el-row>
        </div>
        <el-row style="margin-top: 15px">
          <el-col v-if="timeQuantum != 24" :span="4" class="user_list_styl">
            <el-collapse v-model="collapseName2" accordion>
              <el-collapse-item
                :name="index"
                v-for="(item, index) in typeGoodsMsg.modelList"
                :key="'time' + index"
              >
                <template slot="title">
                  {{ toDate2(item.timestamp) }}
                </template>
                <div
                  v-for="(item2, index2) in item.modelList"
                  :key="'variety' + index2"
                  class="background_styl"
                  @click="handelvariety(item2)"
                  :class="{
                    color_font_styl:
                      checkedvariety ==
                      item2.categoryClassifyId +
                        item2.categorySecondId +
                        item2.categoryId +
                        item2.variety,
                  }"
                  style="
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    width: 100%;
                    padding: 10px 10px;
                  "
                >
                  {{
                    item2.firstName +
                    "-" +
                    item2.secoundName +
                    "-" +
                    item2.productName +
                    "|" +
                    item2.variety
                  }}
                </div>
              </el-collapse-item>
            </el-collapse>
          </el-col>
          <el-col v-if="timeQuantum == 24" :span="4" class="user_list_styl">
            <div
              v-for="(item, index) in typeGoodsMsg.modelList"
              :key="'variety2' + index"
              class="background_styl"
              @click="handelvariety(item)"
              :class="{
                color_font_styl:
                  checkedvariety ==
                  item.categoryClassifyId +
                    item.categorySecondId +
                    item.categoryId +
                    item.variety,
              }"
              style="
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 100%;
                padding: 10px 10px;
              "
            >
              {{
                item.firstName +
                "-" +
                item.secoundName +
                "-" +
                item.productName +
                "|" +
                item.variety
              }}
            </div>
          </el-col>
          <el-col :span="20" style="padding: 10px" v-if="checkedvariety != ''">
            <div>
              {{ checkedvarietyName }}
              <span style="margin-left: 15px; color: rgba(1, 6, 33, 0.55)"
                >需求人数:{{
                  checkedGoodsMsg.orderBeforeNum
                    ? checkedGoodsMsg.orderBeforeNum
                    : 0
                }}人</span
              >
              <el-button type="text" class="checkSend" @click="checkSend"
                >查看已发送</el-button
              >
            </div>
            <el-table
              :data="checkedGoodsMsg.modelList"
              style="border: 1px solid #e9e9e9"
              height="350px"
              ref="table"
              @selection-change="handleSelectionChange"
              @select="checkedRow"
            >
              <el-table-column
                label="选择"
                type="selection"
                width="55"
              ></el-table-column>
              <el-table-column label="产地" prop="regionName"></el-table-column>
              <el-table-column label="需求数量">
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
                        scope.row.productCount,
                        scope.row.pieceCount,
                        scope.row.pieceCount
                      )
                    "
                  ></span>
                </template>
              </el-table-column>
              <el-table-column label="当前库存">
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
                        scope.row.batchNumber,
                        scope.row.pieceCount,
                        scope.row.pieceCount
                      )
                    "
                  ></span>
                </template>
              </el-table-column>
              <el-table-column label="需求客户" prop="personName">
                <template slot-scope="scope">
                  {{ scope.row.personName }}
                  <el-tag type="info" v-if="scope.row.custmorType == 0"
                    >非</el-tag
                  >
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
                  <span v-if="scope.row.phoneNumber != ''">{{
                    "-" + scope.row.phoneNumber
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="级别/规格" prop="spec"></el-table-column>
              <el-table-column label="时间" prop="timestamp">
                <template slot-scope="scope">
                  {{ toDate(scope.row.timestamp) }}
                </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="按客户查看" name="2">
        <h4>
          客户信息:&nbsp;&nbsp;&nbsp;{{ typeUserMsg.customerBeforeNum }}人
        </h4>
        <el-row style="border-top: 1px solid #e9e9e9; margin-top: 15px">
          <el-col :span="5" style="padding: 10px 5px">
            <div style="text-align: center">
              <el-input
                v-model="search"
                placeholder="请输入客户姓名/联系电话"
                size="mini"
                @change="getUserMsg"
              ></el-input>
            </div>
            <div
              style="
                border-top: 1px solid #e9e9e9;
                margin-top: 10px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                width: 100%;
              "
              class="user_list_styl"
            >
              <el-collapse v-model="collapseName" accordion>
                <el-collapse-item
                  :name="index"
                  v-for="(item, index) in typeUserMsg.modelList"
                  :key="'name' + index"
                >
                  <template slot="title">
                    {{ item.personName }}
                    <el-tag type="info" v-if="item.typeId == 0">非</el-tag>
                    <el-tag v-if="item.typeId == 11 || item.typeId == 10"
                      >供</el-tag
                    >
                    <el-tag
                      type="danger"
                      v-if="item.typeId == 6 || item.typeId == 7"
                      >经</el-tag
                    >
                    <el-tag
                      type="warning"
                      v-if="item.typeId == 3 || item.typeId == 4"
                      >采</el-tag
                    >
                    —<span>{{ item.phoneNumber }}</span>
                  </template>
                  <div
                    v-for="(item2, index2) in item.modelList"
                    :key="'order' + index2"
                    style="padding: 10px 5px"
                    @click="handelOrder(item2.orderId)"
                    :class="{ change_bgc: item2.orderId == handelId }"
                  >
                    <p>
                      <el-checkbox
                        v-model="item2.checked"
                        style="margin-right: 10px"
                        @change="checkedOrder(item2.orderId, item2.checked)"
                      ></el-checkbox
                      >需求单号:{{ item2.orderBefore }}
                    </p>
                    <p
                      style="
                        margin-top: 5px;
                        margin-left: 25px;
                        color: rgba(1, 6, 33, 0.55);
                      "
                    >
                      {{ toDate(item2.timestamp) }}
                    </p>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-col>
          <el-col :span="19" v-if="isShowDetail">
            <div style="padding: 10px 10px">
              <span>需求商品:{{ orderDetail.productTypeCount }}种</span>
              <span style="float: right"
                >操作人:{{ orderDetail.addByUserName }}</span
              >
            </div>
            <el-table
              :data="orderDetail.modelList"
              style="border: 1px solid #e9e9e9"
              height="300px"
            >
              <el-table-column label="商品分类">
                <template slot-scope="scope">
                  {{
                    scope.row.firstName +
                    "-" +
                    scope.row.secoundName +
                    "-" +
                    scope.row.productName
                  }}
                </template>
              </el-table-column>
              <el-table-column
                label="品种/品牌"
                prop="variety"
              ></el-table-column>
              <el-table-column label="产地" prop="regionName"></el-table-column>
              <el-table-column label="级别/规格" prop="spec"></el-table-column>
              <el-table-column label="需求数量">
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
                        scope.row.productCount,
                        scope.row.pieceCount,
                        scope.row.pieceCount
                      )
                    "
                  ></span>
                </template>
              </el-table-column>
            </el-table>
            <br />
            <h4 style="margin-bottom: 20px">合计</h4>
            <span style="color: rgba(1, 6, 33, 0.55)"
              >商品种类:<font style="color: #010621">{{
                orderDetail.modelList.length + "种"
              }}</font></span
            >
            <br />
            <h4 style="margin-top: 20px">备注</h4>
            {{ orderDetail.remark }}
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :visible.sync="lookOver"
      width="60%"
      :before-close="lookOverDialogClose"
    >
      <div slot="title" class="header-title">
        查看已选(<font
          :style="
            checkedGoods.length == 0 || checkedGoods.length > 20
              ? 'color:red;'
              : 'color:#0BA198;'
          "
          >{{ checkedGoods.length }}/20</font
        >)
      </div>
      <div>
        <el-table
          :data="checkedGoods"
          style="boder: 1px solid #e9e9e9"
          height="500px"
        >
          <el-table-column label="商品分类">
            <template slot-scope="scope">
              {{
                scope.row.firstName +
                "-" +
                scope.row.secoundName +
                "-" +
                scope.row.productName
              }}
            </template>
          </el-table-column>
          <el-table-column label="品种/品牌" prop="variety"></el-table-column>
          <el-table-column label="产地" prop="regionName"></el-table-column>
          <el-table-column label="级别/规格" prop="spec"></el-table-column>
          <el-table-column label="当前库存">
            <template slot-scope="scope">
              <span
                v-html="
                  getStock2(
                    scope.row.subUnit,
                    scope.row.subUnit2,
                    scope.row.subUnit3,
                    scope.row.pieceUnit,
                    scope.row.subUnit2Weight,
                    scope.row.subUnit3Weight,
                    scope.row.batchNumber,
                    scope.row.basketNumber,
                    scope.row.pieceCount
                  )
                "
              ></span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="delcheckedGoods(scope)"
                >移除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="checkSendDialog"
      width="50%"
      title="查看已发送"
      :before-close="checkSendDialogClose"
    >
      <div>
        {{ toDate(queryTime[0] / 1000) }} ~ {{ toDate(queryTime[1] / 1000) }}
        <p>{{ checkedvarietyName }}</p>
        <el-table
          :data="checksendTableData"
          style="boder: 1px solid #e9e9e9"
          height="300px"
        >
          <el-table-column label="单号" prop="orderBefore"></el-table-column>
          <el-table-column label="客户">
            <template slot-scope="scope">
              {{ scope.row.personName }}
              <el-tag type="info" v-if="scope.row.custmorType == 0">非</el-tag>
              <el-tag
                v-if="scope.row.userType == 11 || scope.row.userType == 10"
                >供</el-tag
              >
              <el-tag
                type="danger"
                v-if="scope.row.userType == 11 || scope.row.userType == 7"
                >经</el-tag
              >
              <el-tag
                type="warning"
                v-if="scope.row.userType == 3 || scope.row.userType == 4"
                >采</el-tag
              >
              <span v-if="scope.row.phoneNumber != ''">{{
                "-" + scope.row.phoneNumber
              }}</span>
            </template>
          </el-table-column>
          <el-table-column label="需求单发送日期">
            <template slot-scope="scope">
              {{ toDate(scope.row.timestamp) }}
            </template>
          </el-table-column>
          <el-table-column label="需求数量">
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
                    scope.row.productCount,
                    scope.row.pieceCount,
                    scope.row.pieceCount
                  )
                "
              ></span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="toPage(scope.row)">查看</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <el-dialog
      :visible.sync="checkUserDialog"
      width="30%"
      title="选择客户"
      :before-close="checkUserDialogClose"
    >
      <div style="text-align: center">
        <span>仅显示可销售已选商品的客户</span>
        <br /><br /><br />
        客户姓名:
        <el-select
          v-model="checkedUser"
          placeholder="请选择"
          size="mini"
          @change="changeCheckedUser"
          filterable
        >
          <el-option
            v-for="item in userOptions"
            :key="item.userId"
            :label="item.personName"
            :value="item.userId"
          >
            <span>{{ item.personName }}</span
            >--
            <span>{{ item.phoneNumber }}</span>
          </el-option>
        </el-select>
        <br /><br /><br />
        客户电话:
        <el-select
          v-model="checkedPhone"
          placeholder="请选择"
          size="mini"
          filterable
        >
          <el-option
            v-for="item in userOptions"
            :key="item.userId"
            :label="item.phoneNumber"
            :value="item.userId"
          >
            <span>{{ item.phoneNumber }}</span>
          </el-option>
        </el-select>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="checkUserDialogClose">取 消</el-button>
        <el-button type="primary" @click="submitUser">确 定</el-button>
      </span>
    </el-dialog>
    <div class="page_footer" v-if="activeName == '2'">
      已选&nbsp;&nbsp;需求单&nbsp;&nbsp;{{ checkedNum }}单, 商品(<font
        :style="
          checkedMsg.length > 0 && checkedMsg.length <= 20
            ? 'color:#0BA198;'
            : 'color:red;'
        "
        >{{ checkedMsg.length + "/20" }}</font
      >种) &nbsp;&nbsp;&nbsp;
      <el-button
        type="primary"
        size="mini"
        :disabled="
          checkedMsg.length > 0 && checkedMsg.length <= 20 ? false : true
        "
        :class="{
          unActivate:
            checkedMsg.length > 0 && checkedMsg.length <= 20 ? false : true,
        }"
        @click="toTopSend"
        >向上发采购需求</el-button
      >
      <el-button
        type="primary"
        size="mini"
        :disabled="
          checkedMsg.length > 0 && checkedMsg.length <= 20 ? false : true
        "
        :class="{
          unActivate:
            checkedMsg.length > 0 && checkedMsg.length <= 20 ? false : true,
        }"
        @click="addSellOrder"
        >开销售单</el-button
      >
    </div>

    <div class="btnBottom">
      <div class="flex_row_reverse flex_item_mid">
        <div style="margin-right: 10px">
          <el-button
            :disabled="
              checkedGoods.length > 20 - tableDataNum.length ? true : false
            "
            type="primary"
            size="mini"
            @click="handleJumpDetail('addNewrequest', '')"
            >添加至需求单
          </el-button>
        </div>
        <div style="margin-right: 10px">
          <span
            style="font-size: 16px; color: #0ba198; cursor: pointer"
            @click="
              handleEditComm(
                'selectedCommodity',
                { checkedGoods, tableDataNum },
                '查看已选'
              )
            "
            >查看已选(<span
              :style="{
                color:
                  checkedGoods.length > 20 - tableDataNum.length
                    ? '#DD4C4D'
                    : '#0BA198',
              }"
              >{{ checkedGoods.length }}/{{ 20 - tableDataNum.length }}</span
            >
            )</span
          >
        </div>
      </div>
      <selectedCommodity
        ref="selectedCommodity"
        @selectedCommodityChange="selectedCommodityChange"
      >
      </selectedCommodity>
    </div>
  </Page>
</template>
  <script>
import moment from "moment";
import {
    Base64
  } from "js-base64";

import {
  getUserOrderMsg,
  getOrderDetail,
  getGoodsOrderMsg,
  getGoodsOrderDetails,
  getCheckSend,
  getUser,
  Draftadd,
} from "@/request/api/demandManage/index.js";
export default {
  name: "demandReceived",
  components: {
    selectedCommodity: () => import("./dialog/selectedCommodity.vue"), // 编辑商品
  },
  data() {
    return {
      tableDataNum: [],
      checkedUser: "",
      checkedPhone: "",
      userOptions: [],
      checkUserDialog: false,
      checksendTableData: [],
      checksendQueryData: {
        name: "",
        variety: "",
      },
      checkSendDialog: false,
      checkedGoods: [],
      checkedGoodsMsg: {},
      checkedvariety: "",
      checkedvarietyName: "",
      checkedType: [
        { id: "", name: "" },
        { id: "", name: "" },
        { id: "", name: "" },
      ],
      isshowtypeitem: {
        first: true,
        second: false,
        third: false,
        all: false,
      },
      typeItem: {
        first: [],
        second: [],
        third: [],
      },
      typeGoodsMsg: {},
      checkedNum: 0,
      lookOver: false,
      checkedMsg: [],
      isActivate: true,
      isShowDetail: false,
      orderDetail: {},
      handelId: "",
      collapseName: "",
      collapseName2: "",
      search: "",
      typeUserMsg: {},
      activeName: "1",
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
      queryTime: "",
      timeQuantum: 24,
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
  methods: {
    initData() {
      let { data: data } = this.$route.query;
      // 判断url是否为空
      if (data) {
        // 解析数据
        let param = JSON.parse(Base64.decode(data));
        this.tableDataNum = JSON.parse(JSON.stringify(param));
      }
    },
    submitUser() {
      // console.log(this.checkedGoods)
      if (this.checkedUser == "") {
        this.$error("请选择客户！");
        return;
      }
      let res = {
        touserId: this.checkedUser,
        productKindNum: this.checkedGoods.length,
        remark: "",
        addInfo: [],
      };
      for (let i = 0; i < this.checkedGoods.length; i++) {
        res.addInfo.push({
          categoryFirst: this.checkedGoods[i].categoryClassifyId,
          categorySecond: this.checkedGoods[i].categorySecond,
          categorySecondName: this.checkedGoods[i].secoundName,
          productId: this.checkedGoods[i].productId,
          productName: this.checkedGoods[i].productName,
          other: this.checkedGoods[i].other,
          variety: this.checkedGoods[i].variety,
          subUnit: this.checkedGoods[i].subUnit,
          subUnit2: this.checkedGoods[i].subUnit2,
          subUnit2Weight: this.checkedGoods[i].subUnit2Weight,
          subUnit3: this.checkedGoods[i].subUnit3,
          subUnit3Weight: this.checkedGoods[i].subUnit3Weight,
          regionId: this.checkedGoods[i].regionId,
          regionName: this.checkedGoods[i].regionName,
          spec: this.checkedGoods[i].spec,
          demandCount: this.checkedGoods[i].productCount,
          demandpieceCount: this.checkedGoods[i].pieceCount,
          pieceUnit: this.checkedGoods[i].pieceUnit,
          currentCount: this.checkedGoods[i].batchNumber,
          currentpieceCount: this.checkedGoods[i].pieceCount,
        });
      }
      Draftadd(res).then((resp) => {
        // console.log(resp)
        if (resp.status == 200) {
          this.$success("保存成功！");
        }
        this.checkUserDialogClose();
      });
    },
    changeCheckedUser(id) {
      // console.log(id)
      for (let i = 0; i < this.userOptions.length; i++) {
        if (this.userOptions[i].userId == id) {
          this.checkedPhone = this.userOptions[i].phoneNumber;
        }
      }
    },
    checkUserDialogClose() {
      this.checkUserDialog = false;
      this.checkedUser = "";
      this.checkedPhone = "";
    },
    saveD() {
      this.checkUserDialog = true;
      let params = {
        search: "",
        modelType: 7,
        pageindex: 0,
        pagesize: 0,
        bussinessScope: [],
      };
      let arr = this.checkedGoods.map((item) => {
        return item.categoryClassifyId;
      });
      let res = arr;
      let map = new Map();
      for (let item of res) {
        map.set(item.indexName, item);
      }
      res = [...map.values()];
      arr = res;
      params.bussinessScope = arr;
      getUser(params).then((resp) => {
        // console.log(resp)
        this.userOptions = resp.data;
      });
    },
    toPage(row) {
      this.$error("暂无");
    },
    checkSendDialogClose() {
      this.checkSendDialog = false;
    },
    checkSend() {
      let time1 = this.queryTime[0] + "";
      let time2 = this.queryTime[1] + "";
      let res = {
        productName: this.checksendQueryData.name,
        variety: this.checksendQueryData.variety,
        startTime: time1.substring(0, 10),
        endTime: time2.substring(0, 10),
        pageindex: 0,
        pagesize: 0,
      };
      getCheckSend(res).then((resp) => {
        // console.log(resp)
        if (resp.data.length < 1) {
          this.$error("暂无");
        } else {
          this.checkSendDialog = true;
          this.checksendTableData = resp.data;
        }
      });
    },
    delcheckedGoods(row) {
      this.checkedGoods.splice(row.$index, 1);
      this.$nextTick(() => {
        this.$refs.table.toggleRowSelection(row.row, false);
      });
    },
    checkedRow(selection, row) {
      for (let i = 0; i < selection.length; i++) {
        this.checkedGoods.push(selection[i]);
      }
      let res = this.checkedGoods;
      let map = new Map();
      for (let item of res) {
        map.set(item.indexName, item);
      }
      res = [...map.values()];
      this.checkedGoods = res;
      let obj = selection.map((item) => {
        return item.indexName;
      });
      if (obj.indexOf(row.indexName) > -1) {
      } else {
        for (let i = 0; i < this.checkedGoods.length; i++) {
          if (this.checkedGoods[i].indexName == row.indexName) {
            this.checkedGoods.splice(i, 1);
          }
        }
      }
    },
    handleSelectionChange(val) {
      // console.log(val)
    },
    handelvariety(item2) {
      this.checkedvariety =
        item2.categoryClassifyId +
        item2.categorySecondId +
        item2.categoryId +
        item2.variety;
      this.checkedvarietyName =
        item2.firstName +
        "-" +
        item2.secoundName +
        "-" +
        item2.productName +
        "|" +
        item2.variety;
      this.checksendQueryData.name = item2.productName;
      this.checksendQueryData.variety = item2.variety;
      let time1 = this.queryTime[0] + "";
      let time2 = this.queryTime[1] + "";
      let res = {
        firstName: item2.firstName,
        secoundName: item2.secoundName,
        productName: item2.productName,
        variety: item2.variety,
        startTime: time1.substring(0, 10),
        endTime: time2.substring(0, 10),
        pageindex: 0,
        pagesize: 0,
      };
      getGoodsOrderDetails(res).then((resp) => {
        this.checkedGoodsMsg = resp.data[0];
        // console.log(this.checkedGoodsMsg,this.checkedGoods)
        let obj = this.checkedGoodsMsg.modelList;
        for (let i = 0; i < obj.length; i++) {
          for (let j = 0; j < this.checkedGoods.length; j++) {
            if (obj[i].indexName == this.checkedGoods[j].indexName) {
              this.$nextTick(() => {
                this.$refs.table.toggleRowSelection(obj[i], true);
              });
            }
          }
        }
      });
    },
    handleClose(index) {
      if (index == 0) {
        this.checkedType = [
          { id: "", name: "" },
          { id: "", name: "" },
          { id: "", name: "" },
        ];
        this.isshowtypeitem.first = true;
        this.isshowtypeitem.second = false;
        this.isshowtypeitem.third = false;
        this.isshowtypeitem.all = false;
      } else if (index == 1) {
        this.checkedType[1] = { id: "", name: "" };
        this.checkedType[2] = { id: "", name: "" };
        this.isshowtypeitem.first = false;
        this.isshowtypeitem.second = true;
        this.isshowtypeitem.third = false;
      } else {
        this.checkedType[2] = { id: "", name: "" };
        this.isshowtypeitem.first = false;
        this.isshowtypeitem.second = false;
        this.isshowtypeitem.third = true;
      }
      this.getGoodsMsg();
    },
    handelFirst(item) {
      this.isshowtypeitem.all = true;
      this.isshowtypeitem.first = false;
      this.isshowtypeitem.second = true;
      this.isshowtypeitem.third = false;
      this.typeItem.second = item.modelList;
      this.checkedType[0].id = item.categoryClassifyId;
      this.checkedType[0].name = item.firstName;
      this.getGoodsMsg();
    },
    handelSecound(item) {
      this.isshowtypeitem.first = false;
      this.isshowtypeitem.second = false;
      this.isshowtypeitem.third = true;
      this.typeItem.third = item.modelList;
      this.checkedType[1].id = item.categorySecondId;
      this.checkedType[1].name = item.secoundName;
      this.getGoodsMsg();
    },
    handelThird(item) {
      this.isshowtypeitem.first = false;
      this.isshowtypeitem.second = false;
      this.isshowtypeitem.third = false;
      this.checkedType[2].id = item.categoryId;
      this.checkedType[2].name = item.productName;
      this.getGoodsMsg();
    },
    toTopSend() {
      console.log("向上发采购需求", this.checkedMsg);
    },
    addSellOrder() {
      console.log("开销售单", this.checkedMsg);
    },
    lookOverDialogClose() {
      this.lookOver = false;
    },
    isShowChecked() {
      this.lookOver = true;
    },
    checkedOrder(id, ischeck) {
      // console.log(id,ischeck)
      if (ischeck) {
        getOrderDetail({ orderId: id }).then((resp) => {
          let obj = resp.data[0].modelList;
          for (let i = 0; i < obj.length; i++) {
            this.checkedMsg.push(obj[i]);
          }
        });
        this.checkedNum = this.checkedNum + 1;
      } else {
        for (let i = this.checkedMsg.length - 1; i >= 0; i--) {
          if (this.checkedMsg[i].orderId == id) {
            this.checkedMsg.splice(i, 1);
          }
        }
        this.checkedNum = this.checkedNum - 1;
      }
    },
    handelOrder(id) {
      this.handelId = id;
      getOrderDetail({ orderId: this.handelId }).then((resp) => {
        // console.log(resp)
        this.orderDetail = resp.data[0];
        this.isShowDetail = true;
      });
    },
    toDate(val) {
      return moment(val * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
    toDate2(val) {
      return moment(val * 1000).format("YYYY-MM-DD");
    },
    getGoodsMsg() {
      let time1 = this.queryTime[0] + "";
      let time2 = this.queryTime[1] + "";
      let res = {
        categoryClassifyId: this.checkedType[0].id,
        categorySecondId: this.checkedType[1].id,
        categoryId: this.checkedType[2].id,
        isTime: this.timeQuantum == 24 ? 1 : 0,
        startTime: time1.substring(0, 10),
        endTime: time2.substring(0, 10),
        search: this.search,
        pageindex: 0,
        pagesize: 0,
      };
      getGoodsOrderMsg(res).then((resp) => {
        this.typeGoodsMsg = resp.dara[0];
        this.typeItem.first = resp.dara[0].cateList.available;
      });
    },
    getUserMsg() {
      let time1 = this.queryTime[0] + "";
      let time2 = this.queryTime[1] + "";
      let res = {
        startTime: time1.substring(0, 10),
        endTime: time2.substring(0, 10),
        search: this.search,
        pageindex: 0,
        pagesize: 0,
      };
      getUserOrderMsg(res).then((resp) => {
        // console.log(resp)
        // this.typeUserMsg = resp.data[0]
        let obj = resp.data[0];
        for (let i = 0; i < obj.modelList.length; i++) {
          for (let j = 0; j < obj.modelList[i].modelList.length; j++) {
            obj.modelList[i].modelList[j].checked = false;
          }
        }
        this.typeUserMsg = obj;
      });
    },
    handleClick(val) {
      if (this.activeName == "2") {
        this.getUserMsg();
      } else {
        this.getGoodsMsg();
      }
    },
    changetimeQ(val) {
      if (val == 7) {
        const now = Date.parse(new Date());
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        const startTime = Date.parse(start);
        this.queryTime = [startTime, now];
      } else if (val == 30) {
        const now = Date.parse(new Date());
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        const startTime = Date.parse(start);
        this.queryTime = [startTime, now];
      } else if (val == 24) {
        const now = Date.parse(new Date());
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24);
        const startTime = Date.parse(start);
        this.queryTime = [startTime, now];
      }
      if (this.activeName == "1") {
        this.getGoodsMsg();
      } else {
        this.getUserMsg();
      }
    },
    setDefaultTime() {
      let now = Date.parse(new Date());
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24);
      const startTime = Date.parse(start);
      this.queryTime = [startTime, now];
    },
    changeTime(val) {
      this.timeQuantum = 0;
      this.getUserMsg();
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
      // console.log(subunit,subunit2,subunit3,pieceunit,subunit2weight,subunit3weight,stock,basket,piececount)
      let first = stock + subunit;
      let next2 =
        subunit2 == "" ? "" : subunit2weight + subunit2 + "/" + subunit;
      let next3 = subunit3 == "" ? "" : subunit3weight + subunit3 + "*";
      let next4 =
        pieceunit == ""
          ? ""
          : pieceunit == "筐(周转筐)"
          ? "|" + basket + '<font style="color:#DF971A;">筐</font>'
          : "(" +
            piececount +
            (pieceunit == "筐(一次性)" ? "筐" : pieceunit) +
            ")";
      // let last = basket == 0 ? '' : '|'+basket+'<font style="color:#DF971A;">筐</font>'
      let kuohao1 = subunit2 == "" ? "" : "(";
      let kuohao2 = subunit2 == "" ? "" : ")";
      return first + kuohao1 + next3 + next2 + kuohao2 + next4;
    },
    getStock2(
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
    handleEditComm(form, record, title) {
      this.$refs[form].edit(record);
      this.$refs[form].title = title;
      this.$refs[form].disableSubmit = false;
      this.$refs[form].isVisiable = true;
    },
    selectedCommodityChange(val) {
      this.tableDataNum = JSON.parse(JSON.stringify(val));
    },
    // 跳转页面
    handleJumpDetail: function (form, record) {
                let tableDataList = []
                for (let i = 0; i < this.checkedGoods.length; i++) {
                    const el = this.checkedGoods[i];
                    tableDataList.push(el)
                }

                for (let i = 0; i < this.tableDataNum.length; i++) {
                    const el = this.tableDataNum[i];
                    tableDataList.push(el)
                }

                if (tableDataList.length == 0) {
                    return this.$warning("请先选择数据")
                }
                let path = form;
                this.$store.dispatch("common/addNewrequestData", {
                    isStatus: 'add',
                    tableDataList
                });
                this.$closePage(path, {});
            },
  },

  beforeRouteEnter(to, form, next) {
    next((vm) => {
      vm.initData();
      vm.setDefaultTime();
      vm.getGoodsMsg();
    });
  },
};
</script>
  <style scoped lang="scss">
.change_timeQ {
  position: relative;
  top: -1px;
}
.user_list_styl {
  min-height: 200px;
  max-height: 450px;
  overflow-y: auto;
  overflow-x: hidden;
}
.change_bgc {
  background-color: #cef2ed;
}
.el-tag {
  padding: 0px 1px !important;
}
.el-tag--medium {
  height: 17px !important;
  line-height: 17px !important;
}
.page_footer {
  width: 100%;
  text-align: right;
  background-color: #fff;
  border-top: 1px solid #e4e7ed;
  // height: 20px;
  position: fixed;
  bottom: 0px;
  padding: 15px;
  right: 20px;
}
.unActivate {
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid #d0d0d2;
  color: rgba(1, 6, 33, 0.35);
}
.type_btn_styl {
  .el-button--medium {
    padding: 0px 20px;
    font-size: 15px;
    border-radius: 4px;
    color: rgba(1, 6, 33, 0.9);
  }
}
.checked_type_styl {
  .el-tag {
    padding: 6px 12px !important;
  }
  .el-tag--medium {
    height: 28px !important;
    line-height: 0px !important;
    margin-right: 15px;
  }
}
.background_styl:hover {
  background-color: #cef2ed;
}
.background_styl:active {
  color: #0ba198;
}
.color_font_styl {
  color: #0ba198;
}
.checkSend {
  float: right;
  position: relative;
  top: -7px;
}
/deep/.el-table__header-wrapper .el-checkbox {
  display: none;
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
</style>