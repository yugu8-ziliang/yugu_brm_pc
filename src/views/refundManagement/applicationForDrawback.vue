<template>
  <Page>
    <div class="page_layout">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="平台" name="0"></el-tab-pane>
        <el-tab-pane label="非平台" name="1"></el-tab-pane>
      </el-tabs>
      <div class="main_layout">
        <el-row>
          <el-col
            :span="4"
            class="font_style_1"
            style="text-align: center; border-right: 1px solid #e9e9e9"
          >
            <el-input
              v-model="input"
              placeholder="请输入客户姓名/联系电话"
              size="mini"
              style="width: 85%; border-radius: 1px; margin: 15px"
              @input="handleClick"
            ></el-input>
            <div class="user_list_style">
              <div
                v-for="(item, index) in userList"
                :key="'user' + index"
                style="
                  text-align: center;
                  padding: 10px;
                  border-bottom: 1px solid rgba(1, 6, 33, 0.06);
                "
                @click="handelUser(item.user_id)"
                :class="{ click_change_style: item.user_id == checkedUser }"
              >
                {{ item.user_name }}
                <el-tag type="info" v-if="item.user_type == 0">非</el-tag>
                <el-tag v-if="item.user_type == 11 || item.user_type == 10"
                  >供</el-tag
                >
                <el-tag
                  type="danger"
                  v-if="item.user_type == 6 || item.user_type == 7"
                  >经</el-tag
                >
                <el-tag
                  type="warning"
                  v-if="item.user_type == 3 || item.user_type == 4"
                  >采</el-tag
                >
                -{{ item.user_phone }}
              </div>
              <p class="font_style_1" v-if="userList.length == 0">暂无数据</p>
            </div>
          </el-col>
          <el-col :span="20" class="font_style_1" style="padding: 15px">
            <el-radio-group v-model="radio" @change="selectPort">
              <el-radio-button
                :label="item"
                v-for="(item, index) in buttonList"
                :key="'button' + index"
              ></el-radio-button>
            </el-radio-group>
            <el-table
              :data="tableData"
              max-height="513"
              v-if="radio == '商品采购单'"
              style="border: 1px solid #e9e9e9; margin-top: 15px"
              @sort-change="changeSort"
            >
              <el-table-column
                label="采购单编号"
                prop="orderSellId"
              ></el-table-column>
              <el-table-column
                label="采购时间"
                prop="timestamp"
                sortable="custom"
              >
                <template slot-scope="scope">
                  {{ toDate(scope.row.timestamp) }}
                </template>
              </el-table-column>
              <el-table-column
                label="采购商品"
                prop="productDescription"
              ></el-table-column>
              <el-table-column label="订单金额" prop="productTotalPrice">
                <template slot-scope="scope">
                  {{ currencyFormat(scope.row.productTotalPrice) + "元" }}
                </template>
              </el-table-column>
              <el-table-column label="操作">-
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    v-if="scope.row.type == 0"
                    @click="refunds(scope.row.uid)"
                    >仅退款</el-button
                  >
                  <el-button
                    type="text"
                    v-if="scope.row.type == 0"
                    @click="returns(scope.row.uid)"
                    >退货退款</el-button
                  >
                  <el-button
                    type="text"
                    v-if="scope.row.type == 1"
                    style="color: #dd4c4d"
                    @click="notHaveNum(scope.row.uid)"
                    >无剩余可退货数量 ></el-button
                  >
                  <el-button
                    type="text"
                    v-if="scope.row.type == 2"
                    style="color: #dd4c4d"
                    @click="notHaveMoney(scope.row.uid)"
                    >无剩余可退款金额 ></el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-table
              :data="tableData2"
              max-height="513"
              v-if="radio == '筐子购入单'"
              style="border: 1px solid #e9e9e9; margin-top: 15px"
              @sort-change="changeSort"
            >
              <el-table-column
                label="购入单编号"
                prop="orderBasketId"
              ></el-table-column>
              <el-table-column
                label="购入时间"
                prop="timestamp"
                sortable="custom"
              >
                <template slot-scope="scope">
                  {{ toDate(scope.row.timestamp) }}
                </template>
              </el-table-column>
              <el-table-column
                label="购入筐子"
                prop="productDescription"
              ></el-table-column>
              <el-table-column label="订单金额" prop="productTotalPrice">
                <template slot-scope="scope">
                  {{ currencyFormat(scope.row.orderTotalPrice) + "元" }}
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    v-if="scope.row.type == 0"
                    @click="returnBasket(scope.row.orderId)"
                    >退筐退款</el-button
                  >
                  <el-button
                    type="text"
                    v-if="scope.row.type == 1"
                    style="color: #dd4c4d"
                    @click="noReturnBasketNum(scope.row.orderId)"
                    >无剩余可退货数量 ></el-button
                  >
                  <el-button
                    type="text"
                    v-if="scope.row.type == 2"
                    style="color: #dd4c4d"
                    @click="noReturnBasketMoney(scope.row.orderId)"
                    >无剩余可退款金额 ></el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-table
              :data="tableData3"
              max-height="513"
              v-if="radio == '商品销售单'"
              style="border: 1px solid #e9e9e9; margin-top: 15px"
              @sort-change="changeSort"
            >
              <el-table-column
                label="销售单编号"
                prop="orderSellId"
              ></el-table-column>
              <el-table-column
                label="销售时间"
                prop="timestamp"
                sortable="custom"
              >
                <template slot-scope="scope">
                  {{ toDate(scope.row.timestamp) }}
                </template>
              </el-table-column>
              <el-table-column
                label="销售商品"
                prop="productDescription"
              ></el-table-column>
              <el-table-column label="订单金额" prop="productTotalPrice">
                <template slot-scope="scope">
                  {{ currencyFormat(scope.row.productTotalPrice) + "元" }}
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    v-if="scope.row.type == 0"
                    @click="refunds(scope.row.uid)"
                    >仅退款</el-button
                  >
                  <el-button
                    type="text"
                    v-if="scope.row.type == 0"
                    @click="returns(scope.row.uid)"
                    >退货退款</el-button
                  >
                  <el-button
                    type="text"
                    v-if="scope.row.type == 1"
                    style="color: #dd4c4d"
                    >无剩余可退货数量 ></el-button
                  >
                  <el-button
                    type="text"
                    v-if="scope.row.type == 2"
                    style="color: #dd4c4d"
                    >无剩余可退款金额 ></el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <el-table
              :data="tableData4"
              max-height="513"
              v-if="radio == '筐子售出单'"
              style="border: 1px solid #e9e9e9; margin-top: 15px"
              @sort-change="changeSort"
            >
              <el-table-column
                label="售出单编号"
                prop="orderBasketId"
              ></el-table-column>
              <el-table-column
                label="售出时间"
                prop="timestamp"
                sortable="custom"
              >
                <template slot-scope="scope">
                  {{ toDate(scope.row.timestamp) }}
                </template>
              </el-table-column>
              <el-table-column
                label="售出筐子"
                prop="productDescription"
              ></el-table-column>
              <el-table-column label="订单金额" prop="productTotalPrice">
                <template slot-scope="scope">
                  {{ currencyFormat(scope.row.orderTotalPrice) + "元" }}
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    v-if="scope.row.type == 0"
                    @click="returnBasket(scope.row.orderId)"
                    >退筐退款</el-button
                  >
                  <el-button
                    type="text"
                    v-if="scope.row.type == 1"
                    style="color: #dd4c4d"
                    @click="noReturnBasketNum(scope.row.orderId)"
                    >无剩余可退货数量 ></el-button
                  >
                  <el-button
                    type="text"
                    v-if="scope.row.type == 2"
                    style="color: #dd4c4d"
                    @click="noReturnBasketMoney(scope.row.orderId)"
                    >无剩余可退款金额 ></el-button
                  >
                </template>
              </el-table-column>
            </el-table>
            <div style="text-align: right">
              <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryData.page_index"
                :page-sizes="[10, 20, 2]"
                :page-size="queryData.page_size"
                layout="total, sizes, prev, pager, next, jumper"
                :total="queryData.total"
              >
              </el-pagination>
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <el-dialog
      :visible.sync="returnsAndRefunds"
      width="80%"
      :before-close="returnsAndRefundsClose"
    >
      <div slot="title">
        {{ returnsAndRefundsTitle }}
        <el-tooltip class="item" effect="dark" placement="bottom">
          <div
            slot="content"
            v-if="returnsAndRefundsTitle != '退筐退款-选择筐子'"
          >
            1.该采购单中某商品已成交的(退货退款单+退款单)商品金额等于该商品采购金额时无法继续退款(不包含筐子金额)<br />
            2.该采购单中某商品已成交的退货退款数量等于采购数量时无法继续退款
          </div>
          <div
            slot="content"
            v-if="returnsAndRefundsTitle == '退筐退款-选择筐子'"
          >
            可退数量=该购入单中某类型筐子的购入数量-关联该购入单的退筐单中该类型筐子的已退数量(已成交与未成交在途订单)
          </div>
          <font class="el-icon-warning-outline" style="color: #0ba198"></font>
        </el-tooltip>
      </div>
      <el-table
        :data="dialogTableData"
        v-if="radio == '商品采购单' || radio == '商品销售单'"
        style="border: 1px solid #e9e9e9; margin-top: 15px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column :selectable="selected" type="selection" width="55">
        </el-table-column>
        <el-table-column width="80">
          <template slot-scope="scope">
            <font
              style="color: red"
              v-if="
                scope.row.goodsCount == 0 &&
                returnsAndRefundsTitle == '退货退款-选择退货商品'
              "
              >已退完</font
            >
            <font
              style="color: red"
              v-if="
                scope.row.goodsPrice == 0 &&
                returnsAndRefundsTitle == '仅退款-选择退款商品'
              "
              >已退完</font
            >
            <font v-else>&nbsp;&nbsp;&nbsp;</font>
          </template>
        </el-table-column>
        <el-table-column label="商品" prop="goodsName"></el-table-column>
        <el-table-column label="品种/品牌" prop="goodsName"></el-table-column>
        <el-table-column label="产地" prop="region"></el-table-column>
        <el-table-column label="级别/规格" prop="spec"></el-table-column>
        <el-table-column :render-header="numRenderHeader">
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
                  scope.row.goodsCount,
                  scope.row.returnBasketCount,
                  scope.row.productPieceCount
                )
              "
            >
            </span>
          </template>
        </el-table-column>
      </el-table>
      <el-table
        :data="dialogTableData"
        v-if="radio == '筐子购入单' || radio == '筐子售出单'"
        style="border: 1px solid #e9e9e9; margin-top: 15px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column :selectable="selected" type="selection" width="55">
        </el-table-column>
        <el-table-column width="80">
          <template slot-scope="scope">
            <font style="color: red" v-if="scope.row.surplusCount == 0"
              >已退完</font
            >
          </template>
        </el-table-column>
        <el-table-column label="筐子种类" prop="basketName"></el-table-column>
        <el-table-column label="颜色" prop="basketColor"></el-table-column>
        <el-table-column label="可退数量">
          <template slot-scope="scope">
            {{ scope.row.surplusCount + "个" }}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="torefundInformation(0)">全退</el-button>
        <el-button type="primary" size="mini" @click="torefundInformation(1)"
          >确认选择({{ tableSelected.length }})</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :visible.sync="noreturnDialog"
      width="90%"
      :title="noreturnTitle"
      :before-close="noreturnDialogClose"
    >
      <div style="height: 600px">
        <el-descriptions
          :column="5"
          style="border-bottom: 1px solid rgba(0, 0, 0, 0.06)"
        >
          <el-descriptions-item
            :label="
              radio == '商品采购单'
                ? '采购单编号'
                : radio == '筐子购入单'
                ? '购入单编号'
                : radio == '商品销售单'
                ? '销售单编号'
                : '售出单编号'
            "
          >
            <span v-if="radio == '商品采购单' || radio == '商品销售单'">{{
              noReturnData.orderSellId
            }}</span>
            <span v-if="radio == '筐子购入单' || radio == '筐子售出单'">{{
              noReturnData.orderBasketId
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item
            :label="
              radio == '商品采购单'
                ? '采购单金额'
                : radio == '筐子购入单'
                ? '购入单金额'
                : radio == '商品销售单'
                ? '销售单金额'
                : '售出单金额'
            "
          >
            {{ currencyFormat(noReturnData.orderTotalPrice) + "元" }}
          </el-descriptions-item>
          <el-descriptions-item label="已确认退款金额">
            <span v-if="radio == '商品采购单' || radio == '商品销售单'">{{
              currencyFormat(noReturnData.returnTotalPrice) + "元"
            }}</span>
            <span v-if="radio == '筐子购入单' || radio == '筐子售出单'">{{
              currencyFormat(noReturnData.actualPayPrice) + "元"
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item label="剩余可退金额">
            <span v-if="radio == '商品采购单' || radio == '商品销售单'">{{
              currencyFormat(noReturnData.canReturnMoney) + "元"
            }}</span>
            <span v-if="radio == '筐子购入单' || radio == '筐子售出单'">{{
              currencyFormat(noReturnData.remainingOrderBasketPrice) + "元"
            }}</span>
          </el-descriptions-item>
          <el-descriptions-item
            label="商品差额"
            v-if="radio == '商品采购单' || radio == '商品销售单'"
            >{{
              currencyFormat(noReturnData.allGapPrice) + "元"
            }}</el-descriptions-item
          >
        </el-descriptions>
        <el-table
          :data="noReturnData.modelList"
          height="550"
          style="border: 1px solid #e9e9e9"
          v-if="radio == '筐子购入单' || radio == '筐子售出单'"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <el-table
                :data="scope.row.modelList"
                style="border: 1px solid #e9e9e9"
              >
                <el-table-column
                  label="退筐单编号"
                  prop="orderBasketReturnId"
                ></el-table-column>
                <el-table-column label="退筐时间" prop="confirmTimestamp">
                  <template slot-scope="scope2">
                    {{ toDate(scope2.row.confirmTimestamp) }}
                  </template>
                </el-table-column>
                <el-table-column label="退筐数量" prop="basketCount">
                  <template slot-scope="scope2">
                    {{ scope2.row.basketCount + "个" }}
                  </template>
                </el-table-column>
                <el-table-column label="退款金额" prop="userBasketTotalPrice">
                  <template slot-scope="scope2">
                    {{ currencyFormat(scope2.row.confirmTimestamp) + "元" }}
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope2">
                    <el-button type="text">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="筐子种类">
            <template slot-scope="scope">
              [{{ scope.row.name }}]{{ scope.row.basketName }}
            </template>
          </el-table-column>
          <el-table-column label="购入数量">
            <template slot-scope="scope">
              {{ scope.row.basketCount + "个" }}
            </template>
          </el-table-column>
          <el-table-column label="购入金额">
            <template slot-scope="scope">
              {{ currencyFormat(scope.row.basketPrice) + "元" }}
            </template>
          </el-table-column>
          <el-table-column label="已退数量">
            <template slot-scope="scope">
              {{ scope.row.returnBasketCount + "个" }}
            </template>
          </el-table-column>
          <el-table-column label="已退金额">
            <template slot-scope="scope">
              {{ currencyFormat(scope.row.returnBasketPrice) + "元" }}
            </template>
          </el-table-column>
        </el-table>
        <el-table
          :data="noReturnData.modelList"
          height="550"
          style="border: 1px solid #e9e9e9"
          v-if="radio == '商品采购单' || radio == '商品销售单'"
        >
          <el-table-column type="expand">
            <template slot-scope="scope">
              <!-- {{ scope.row.modelList }} -->
              <el-table
                :data="scope.row.modelList"
                style="border: 1px solid #e9e9e9"
              >
                <el-table-column label="订单类型" prop="isReturnProduct">
                  <template slot-scope="scope2">
                    {{
                      scope2.row.isReturnProduct == 1 ? "退货退款单" : "退款单"
                    }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="订单编号"
                  prop="orderReturnId"
                ></el-table-column>
                <el-table-column label="订单时间">
                  <template slot-scope="scope2">
                    {{ toDate(scope2.row.confirmTimestamp) }}
                  </template>
                </el-table-column>
                <el-table-column label="退货数量" prop="returnProductCount">
                  <template slot-scope="scope2">
                    <span
                      v-html="
                        getStock(
                          scope2.row.subUnit,
                          scope2.row.subUnit2,
                          scope2.row.subUnit3,
                          scope2.row.pieceUnit,
                          scope2.row.subUnit2Weight,
                          scope2.row.subUnit3Weight,
                          scope2.row.returnProductCount,
                          scope2.row.returnBasketCount,
                          scope2.row.returnProductPieceCount
                        )
                      "
                    >
                    </span>
                  </template>
                </el-table-column>
                <el-table-column label="退款金额">
                  <template slot-scope="scope2">
                    {{ currencyFormat(scope2.row.orderTotalPrice) + "元" }}
                  </template>
                </el-table-column>
                <el-table-column label="商品差额">
                  <template slot-scope="scope2">
                    {{ currencyFormat(scope2.row.gapPrice) + "元" }}
                  </template>
                </el-table-column>
                <el-table-column label="操作">
                  <template slot-scope="scope2">
                    <el-button type="text">查看</el-button>
                  </template>
                </el-table-column>
              </el-table>
            </template>
          </el-table-column>
          <el-table-column label="商品" prop="productName"></el-table-column>
          <el-table-column label="产地" prop="regionName"></el-table-column>
          <el-table-column label="级别/规格" prop="spec"></el-table-column>
          <el-table-column label="采购数量" prop="productCount">
            <template slot-scope="scope">
              <span
                v-html="
                  getStock(
                    scope.row.subUnit,
                    scope.row.subUnit2,
                    scope.row.subUnit3,
                    scope.row.pieceunit,
                    scope.row.subUnit2Weight,
                    scope.row.subUnit3Weight,
                    scope.row.productCount,
                    scope.row.buyBasketCount,
                    scope.row.productPieceCount
                  )
                "
              >
              </span>
            </template>
          </el-table-column>
          <el-table-column label="采购金额">
            <template slot-scope="scope">
              {{ currencyFormat(scope.row.productTotalPrice) + "元" }}
            </template>
          </el-table-column>
          <el-table-column label="已退数量">
            <template slot-scope="scope">
              {{ currencyFormat(scope.row.returnProductCount) + "元" }}
            </template>
          </el-table-column>
          <el-table-column label="已退金额">
            <template slot-scope="scope">
              {{ currencyFormat(scope.row.returnProductTotalPrice) + "元" }}
            </template>
          </el-table-column>
          <el-table-column label="商品差额">
            <template slot-scope="scope">
              {{ currencyFormat(scope.row.gapPrice) + "元" }}
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>
  </Page>
</template>
<script>
import moment from "moment";
import {
  getUserList,
  returnOrderList,
  basketReturnOrderList,
  rarSelectGoods,
  rarSelectBasket,
  noReturn,
  noReturnBasket,
} from "@/request/api/applicationForDrawback/index.js";
export default {
  data() {
    return {
      orderId: "",
      noReturnData: {},
      noreturnDialog: false,
      noreturnTitle: "",
      tableSelected: [],
      dialogTableData: [],
      returnsAndRefundsTitle: "",
      returnsAndRefunds: false,
      tableData: [],
      tableData2: [],
      tableData3: [],
      tableData4: [],
      queryData: {
        custmorId: "",
        typeView: 1,
        is_reverse: 1,
        page_index: 1,
        page_size: 10,
        total: 0,
      },
      buttonList: [],
      radio: "",
      userList: [],
      input: "",
      activeName: "0",
      checkedUser: "",
    };
  },
  methods: {
    torefundInformation(type) {
      let obj = {
        orderId: this.orderId,
        orderType: 0,
        productId: "",
        radio: this.radio,
        ispt: this.activeName,
      };
      if (this.activeName == "1") {
        if (this.radio == "商品销售单") {
          obj.orderType = 2;
        } else {
          obj.orderType = 1;
        }
      } else {
        obj.orderType = 2;
      }
      let res = [];
      if (type == 0) {
        res = this.dialogTableData;
      } else {
        res = this.tableSelected;
      }
      let productArr = [];
      productArr = res.map((item) => {
          return item.productId;
      });
      obj.productId = productArr.join(",");
      if (this.returnsAndRefundsTitle == "退货退款-选择退货商品") {
        this.$router.push({
          path: `${'goodsReturnInformation'}/${obj.orderId}`,
          query: { data: JSON.stringify(obj) },
        });
      } else {
        this.$router.push({
          path: "refundInformation",
          query: { data: JSON.stringify(obj) },
        });
      }
    },
    noreturnDialogClose() {
      this.noreturnDialog = false;
    },
    getNoReturn(res) {
      if (this.radio == "商品采购单" || this.radio == "商品销售单") {
        noReturn(res).then((resp) => {
          console.log(resp);
          this.noReturnData = resp.data;
        });
      } else {
        noReturnBasket(res).then((resp) => {
          console.log(resp);
          this.noReturnData = resp.data[0];
        });
      }
    },
    noReturnBasketMoney(id) {
      this.noreturnTitle = "无可退筐子金额";
      this.noreturnDialog = true;
      let res = {
        type: 1,
        orderId: id,
      };
      this.getNoReturn(res);
    },
    noReturnBasketNum(id) {
      this.noreturnTitle = "无可退筐子数量";
      this.noreturnDialog = true;
      let res = {
        type: 1,
        orderId: id,
      };
      this.getNoReturn(res);
    },
    notHaveNum(id) {
      let res = {
        orderId: id,
        orderType: this.activeName == "0" ? 1 : 0,
      };
      this.noreturnTitle = "无可退货数量";
      this.noreturnDialog = true;
      this.getNoReturn(res);
    },
    notHaveMoney(id) {
      let res = {
        orderId: id,
        orderType: this.activeName == "0" ? 1 : 0,
      };
      this.noreturnTitle = "无可退款金额";
      this.noreturnDialog = true;
      this.getNoReturn(res);
    },
    handleSelectionChange(val) {
      this.tableSelected = val;
    },
    selected(row, index) {
      if (this.returnsAndRefundsTitle == "仅退款-选择退款商品") {
        if (row.goodsPrice == 0) {
          return false;
        } else {
          return true;
        }
      } else if (this.returnsAndRefundsTitle == "退货退款-选择退货商品") {
        if (row.goodsCount == 0) {
          return false;
        } else {
          return true;
        }
      } else {
        if (row.surplusCount == 0) {
          return false;
        } else {
          return true;
        }
      }
    },
    numRenderHeader(h) {
      return (
        <div>
          采购数量
          <el-tooltip class="item" effect="dark" placement="bottom">
            <div slot="content">采购数量=原采购商品数量-已退数量</div>
            <font>采购数量</font>
            <font class="el-icon-warning-outline" style="color:#0BA198;"></font>
          </el-tooltip>
        </div>
      );
    },
    getBasket(res) {
      rarSelectBasket(res).then((resp) => {
        this.dialogTableData = resp.data[0].basketInfo;
      });
    },
    getGoods(res) {
      let obj = res;
      if (this.activeName == "1") {
        if (this.radio == "商品采购单") {
          obj.type = 1;
        }
      }
      rarSelectGoods(obj).then((resp) => {
        this.dialogTableData = resp.data;
      });
    },
    returnsAndRefundsClose() {
      this.returnsAndRefunds = false;
      this.dialogTableData = [];
    },
    //退筐退款-选择筐子
    returnBasket(id) {
      this.returnsAndRefunds = true;
      this.returnsAndRefundsTitle = "退筐退款-选择筐子";
      let res = {
        orderId: id,
        orderType: this.radio == "筐子购入单" ? 2 : 1,
      };
      this.getBasket(res);
    },
    refunds(id) {
      //仅退款
      this.orderId = id;
      this.returnsAndRefunds = true;
      this.returnsAndRefundsTitle = "仅退款-选择退款商品";
      let res = {
        sellOrderId: id,
        custmorId: this.checkedUser,
        type: 0,
      };
      this.getGoods(res);
    },
    returns(id) {
      //退货退款
      this.orderId = id;
      this.returnsAndRefunds = true;
      this.returnsAndRefundsTitle = "退货退款-选择退货商品";
      let res = {
        sellOrderId: id,
        custmorId: this.checkedUser,
        type: 0,
      };
      this.getGoods(res);
    },
    handleSizeChange(val) {
      this.queryData.page_size = val;
      if (this.radio == "商品采购单" || this.radio == "商品销售单") {
        this.getTableData();
      } else {
        this.getTableData2();
      }
    },
    handleCurrentChange(val) {
      this.queryData.page_index = val;
      if (this.radio == "商品采购单" || this.radio == "商品销售单") {
        this.getTableData();
      } else {
        this.getTableData2();
      }
    },
    changeSort(val) {
      if (val.order == "descending") {
        this.queryData.is_reverse = 1;
      } else {
        this.queryData.is_reverse = 0;
      }
      this.selectPort();
    },
    getTableData() {
      returnOrderList(this.queryData).then((resp) => {
        if (this.radio == "商品采购单") {
          this.tableData = resp.data.modelList;
        } else {
          this.tableData3 = resp.data.modelList;
        }
        this.queryData.total = resp.data.allCount;
      });
    },
    getTableData2() {
      basketReturnOrderList(this.queryData).then((resp) => {
        if (this.radio == "筐子购入单") {
          this.tableData2 = resp.data.modelList;
        } else {
          this.tableData4 = resp.data.modelList;
        }
        this.queryData.total = resp.data.allCount;
      });
    },
    selectPort() {
      if (this.checkedUser == "") {
        this.$warning("请先选择客户！");
        this.radio = "";
        return;
      }
      this.queryData.page_index = 1;
      this.queryData.custmorId = this.checkedUser;
      // this.queryData.typeView = this.radio == '商品采购单' && this.radio == '筐子购入单' ? 1 : 2;
      if (this.radio == "商品采购单" || this.radio == "筐子购入单") {
        this.queryData.typeView = 1;
      } else {
        this.queryData.typeView = 2;
      }
      if (this.radio == "商品采购单" || this.radio == "商品销售单") {
        this.getTableData();
      } else {
        this.getTableData2();
      }
    },
    handelUser(id) {
      this.checkedUser = id;
      this.InitializePage();
      this.selectPort();
    },
    getUserList() {
      let res = {
        platform: this.activeName == "0" ? 1 : 0,
        search: this.input,
      };
      getUserList(res).then((resp) => {
        this.userList = resp.data;
      });
    },
    handleClick() {
      this.radio = "";
      this.checkedUser = "";
      this.tableData = [];
      this.getUserList();
      this.InitializePage();
    },
    InitializePage() {
      //初始化页面#判断用户类型#显示不同默认选择
      let param = this.$store.getters.userInfo; //获取当前登录人信息  ## 3，企业采购  4，个体采购  6，企业经营  7，个体经营  10，个体供货   11，企业供货
      let usertype = param.usertype;
      let pj = ["商品采购单", "筐子购入单"]; //平台&经营户 //平台&采购商
      let pg = ["筐子购入单"]; //平台供货商
      let fj = ["商品采购单", "筐子购入单", "商品销售单", "筐子售出单"]; //非平台&经营户 //非平台&供货商
      let fc = ["商品采购单", "筐子购入单", "筐子售出单"]; //非平台&采购
      if (this.activeName == "0") {
        if (usertype == 10 || usertype == 11) {
          this.buttonList = pg;
          this.radio = "筐子购入单";
        } else {
          this.buttonList = pj;
          this.radio = "商品采购单";
        }
      } else {
        if (usertype == 3 || usertype == 4) {
          this.buttonList = fc;
          this.radio = "商品采购单";
        } else {
          this.buttonList = fj;
          this.radio = "商品采购单";
        }
      }
    },
    toDate(val) {
      //时间戳格式化
      return moment(val * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
    currencyFormat(num) {
      //科学记数 保留两位小数
      let a = Number(num)
        .toFixed(2)
        .toString()
        .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      return a;
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
  },
  created() {
    this.getUserList();
    this.InitializePage();
  },
};
</script>
<style>
.click_change_style {
  background-color: #cef2ed;
}
.page_layout {
  overflow: hidden;
  height: 740px;
  min-height: 400px;
}
.main_layout {
  position: relative;
  top: -15px;
  /* border: 1px red solid; */
  height: 700px;
  min-height: 300px;
}
.user_list_style {
  height: 640px;
  min-height: 240px;
  overflow-y: auto;
}
.font_style_1 {
  font-size: 14px;
  font-family: PingFangSC-, PingFang SC;
  color: rgba(1, 6, 33, 0.9);
}
.el-tag {
  padding: 0px 1px !important;
}
.el-tag--medium {
  height: 17px !important;
  line-height: 17px !important;
}
</style>