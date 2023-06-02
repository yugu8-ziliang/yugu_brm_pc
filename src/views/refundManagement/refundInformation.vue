<template>
    <!-- 退款信息 -->
    <Page>
      <div>
        <el-scrollbar
          ref="scrollDiv"
          :style="{
            height: $store.getters.screenHeight - 220 + 'px',
          }"
        >
          <!-- 客户信息 -->
          <el-descriptions title="客户信息" :column="4">
            <el-descriptions-item
              label="客户姓名"
              style="color: rgba(1, 6, 33, 0.55)"
            >
              <span style="color: rgba(1, 6, 33, 0.9)">{{
                getUserMsg.fromUserName
              }}</span>
              <el-tag type="info" v-if="getUserMsg.type == 1">非</el-tag>
            </el-descriptions-item>
            <el-descriptions-item
              label="联系电话"
              style="color: rgba(1, 6, 33, 0.55)"
            >
              <span style="color: rgba(1, 6, 33, 0.9)">{{
                getUserMsg.fromUserPhone
              }}</span>
            </el-descriptions-item>
          </el-descriptions>
          <!-- 采购单信息 -->
          <el-descriptions
            v-if="getrefundMsg.radio == '商品采购单'"
            title="采购单信息"
            :column="5"
            style="margin-top: 18px"
          >
            <el-descriptions-item label="采购单编号">
              <span
                style="color: #0ba198"
                @click="
                  handleJumpDetail('/orderManagement/purchaseOrdersDetail', {
                    id: getUserMsg.id,
                    is_buy: 1,
                    type: getUserMsg.type == 1 ? 1 : 0,
                  })
                "
              >
                {{ getUserMsg.ordersellId }}
                <i class="el-icon-arrow-right"></i
              ></span>
            </el-descriptions-item>
            <el-descriptions-item label="采购单状态">
              <font color="#DF971A" v-if="getUserMsg.status == 1">待确认</font>
              <font color="#DF971A" v-if="getUserMsg.status == 3"
                >待对方收款</font
              >
              <font color="#DD4C4D" v-if="getUserMsg.status == 4">未结清</font>
              <font color="#248B39" v-if="getUserMsg.status == 5">已结清</font>
            </el-descriptions-item>
            <el-descriptions-item label="采购商品金额">
              <span style="color: rgba(1, 6, 33, 0.9)">{{
                moneyFormatTwo(getUserMsg.productTotalPrice) + "元"
              }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="已退金额">
              <span style="color: rgba(1, 6, 33, 0.9)">{{
                moneyFormatTwo(getUserMsg.retiredPrice) + "元"
              }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="剩余可退金额">
              <span style="color: rgba(1, 6, 33, 0.9)">{{
                moneyFormatTwo(getUserMsg.remainingRefundable) + "元"
              }}</span>
            </el-descriptions-item>
          </el-descriptions>
          <!-- 销售单信息 -->
          <el-descriptions
            v-if="getrefundMsg.radio == '商品销售单' && getrefundMsg.ispt == '1'"
            title="销售单信息"
            :column="5"
            style="margin-top: 18px"
          >
            <el-descriptions-item label="销售单编号">
              <span
                style="color: #0ba198"
                @click="
                  handleJumpDetail('/orderManagement/commoditySalesOrderDetail', {
                    id: getUserMsg.id,
                  })
                "
              >
                {{ getUserMsg.ordersellId }}
                <i class="el-icon-arrow-right"></i
              ></span>
            </el-descriptions-item>
            <el-descriptions-item label="销售单状态">
              <font color="#DF971A" v-if="getUserMsg.status == 1"
                >待对方确认</font
              >
              <font color="#DF971A" v-if="getUserMsg.status == 2">待修改</font>
              <font color="#DF971A" v-if="getUserMsg.status == 3"
                >待对方收款</font
              >
              <font color="#DD4C4D" v-if="getUserMsg.status == 4">未结清</font>
              <font color="#248B39" v-if="getUserMsg.status == 5">已结清</font>
            </el-descriptions-item>
            <el-descriptions-item label="销售商品金额">
              <span style="color: rgba(1, 6, 33, 0.9)">{{
                moneyFormatTwo(getUserMsg.productTotalPrice) + "元"
              }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="已退金额">
              <span style="color: rgba(1, 6, 33, 0.9)">{{
                moneyFormatTwo(getUserMsg.retiredPrice) + "元"
              }}</span>
            </el-descriptions-item>
            <el-descriptions-item label="剩余可退金额">
              <span style="color: rgba(1, 6, 33, 0.9)">{{
                moneyFormatTwo(getUserMsg.remainingRefundable) + "元"
              }}</span>
            </el-descriptions-item>
          </el-descriptions>
          <!-- 表格部分 -->
          <div style="margin-top: 18px; padding-right: 10px">
            <span
              style="
                font-size: 16px;
                color: rgba(1, 6, 33, 0.9);
                font-weight: 600;
                margin-bottom: 16px;
              "
            >
              退款商品
            </span>
            <el-button type="primary" @click="refundsBtn()">
              + 选择退款商品</el-button
            >
            <div style="margin-top: 15px">
              <el-table :data="tableData" style="border: 1px solid #e9e9e9;" header-row-class-name="header_sty">
                <el-table-column prop="name" label="商品" width="140">
                </el-table-column>
                <el-table-column prop="variety" label="品种/品牌" width="130">
                </el-table-column>
                <el-table-column prop="subUnit" label="计算单位" width="130">
                </el-table-column>
                <el-table-column prop="region" label="产地" width="160">
                </el-table-column>
                <el-table-column prop="spec" label="级别/规格" width="130">
                </el-table-column>
                <el-table-column prop="productCount" label="商品数量" width="160">
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
                <el-table-column
                  prop="productTotalPrice"
                  label="商品金额"
                  width="120"
                >
                  <template slot-scope="scope">
                    {{ moneyFormatTwo(scope.row.productTotalPrice) + "元" }}
                  </template>
                </el-table-column>
                <el-table-column
                  prop="buyBasketPrice"
                  label="筐子金额"
                  width="120"
                  ><template slot-scope="scope">
                    {{ moneyFormatTwo(scope.row.buyBasketPrice) + "元" }}
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  prop="detailTotalPrice"
                  label="金额小计"
                  width="120"
                  ><template slot-scope="scope">
                    {{ moneyFormatTwo(scope.row.detailTotalPrice) + "元" }}
                  </template>
                </el-table-column>
                <el-table-column
                  fixed="right"
                  prop="retiredPrice"
                  label="已退金额"
                  width="120"
                  ><template slot-scope="scope">
                    {{ moneyFormatTwo(scope.row.retiredPrice) + "元" }}
                  </template>
                </el-table-column>
                <el-table-column
                  label="本次退款金额"
                  prop="refundPrice"
                  width="245"
                  fixed="right"
                >
                  <template slot-scope="scope">
                    <el-input
                      placeholder="请输入本次退款金额"
                      v-model="scope.row.refundPrice"
                      style="width: 70%"
                      size="mini"
                    >
                      <template slot="suffix"
                        ><font
                          style="font-size: 14px; color: rgba(1, 6, 33, 0.75)"
                          >元</font
                        ></template
                      >
                    </el-input>
                    <el-popover
                      v-if="scope.row.refundPrice > scope.row.remainingRefundable"
                      placement="top-end"
                      trigger="hover"
                      :content="
                        '退款金额不得大于商品剩余可退金额' +
                        moneyFormatTwo(scope.row.remainingRefundable) +
                        '元'
                      "
                    >
                      <i
                        slot="reference"
                        class="el-icon-warning-outline"
                        style="font-size: 15px; color: #dd4c4d; margin-right: 5px"
                      ></i>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="80">
                  <template slot-scope="scope">
                    <el-button @click="removeBtn(scope)" type="text" size="small"
                      >移除</el-button
                    >
                  </template>
                </el-table-column>
              </el-table>
              <div
                style="
                  padding: 10px;
                  border-left: 1px solid rgba(1, 6, 33, 0.06);
                  border-right: 1px solid rgba(1, 6, 33, 0.06);
                  border-bottom: 1px solid rgba(1, 6, 33, 0.06);
                  background: #f5f5f5;
                "
              >
                <el-row style="font-size: 14px; color: rgba(1, 6, 33, 0.9)">
                  <el-col :span="18">合计</el-col>
                  <el-col
                    :span="3"
                    style="text-align: right; color: rgba(1, 6, 33, 0.75)"
                    >退款商品种类：{{ tableData.length }}种</el-col
                  >
                  <el-col :span="3" style="text-align: right"
                    >退款金额合计：<span style="color: #dd4c4d"
                      >{{ totalAmount }}元</span
                    ></el-col
                  >
                </el-row>
              </div>
            </div>
          </div>
          <!-- 备注部分 -->
          <div style="margin-top: 20px">
            <div
              style="
                font-size: 16px;
                color: rgba(1, 6, 33, 0.9);
                font-weight: 600;
                margin-bottom: 10px;
              "
            >
              备注
            </div>
            <el-input
              type="textarea"
              placeholder="请输入"
              maxlength="200"
              resize="none"
              rows="4"
              style="width: 40%"
              v-model="remarks"
            >
            </el-input>
          </div>
        </el-scrollbar>
        <div class="page_footer">
          <el-button type="primary" @click="makeSure">确认退款</el-button>
        </div>
      </div>
      <!-- 仅退款-选择退款商品弹窗 -->
      <el-dialog
        :visible.sync="refundsDialog"
        width="80%"
        :before-close="refundsDialogClose"
      >
        <div slot="title">
          仅退款-选择退款商品
          <el-tooltip class="item" effect="dark" placement="bottom">
            <div slot="content">
              1.该采购单中某商品已成交的(退货退款单+退款单)商品金额等于该商品采购金额时无法继续退款(不包含筐子金额)<br />
              2.该采购单中某商品已成交的退货退款数量等于采购数量时无法继续退款
            </div>
            <font class="el-icon-warning-outline" style="color: #0ba198"></font>
          </el-tooltip>
        </div>
        <el-table
          ref="dialogRef"
          :data="dialogTableData"
          style="border: 1px solid #e9e9e9; margin-top: 15px"
          @selection-change="handleSelectionChange"
        >
          <el-table-column :selectable="selected" type="selection" width="55">
          </el-table-column>
          <el-table-column width="80">
            <template slot-scope="scope">
              <font style="color: red" v-if="scope.row.goodsPrice == 0"
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
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="torefundInformation(0)">全退</el-button>
          <el-button type="primary" size="mini" @click="torefundInformation(1)"
            >确认选择({{ tableSelected.length }})</el-button
          >
        </span>
      </el-dialog>
    </Page>
  </template>
  
  <script>
  import {
    OrderReturnSellInfo,
    createOrderReturn,
  } from "@/request/api/refundManagement/index.js";
  import { rarSelectGoods } from "@/request/api/applicationForDrawback/index.js";
  export default {
    // name: "refundInformation",
    data() {
      return {
        refundsDialog: false, //初始值弹窗关闭
        remarks: "", //备注
        tableData: [], //表格部分
        getrefundMsg: {},
        getUserMsg: {}, //客户信息和采购单信息
        tableSelected: [],
        dialogTableData: [],
        refundPrice: "",
      };
    },
    computed: {
      // 退款金额合计
      totalAmount() {
        let num = 0;
        for (let i = 0; i < this.tableData.length; i++) {
          let el = this.tableData[i];
          num += Number(el.refundPrice) || 0;
        }
        return num;
      },
    },
    methods: {
      // 跳转页面
      handleJumpDetail: function (form, record) {
        console.log(record);
        this.$router.push({
          path: form,
          query: record,
        });
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
      // 全退 确认选择按钮
      torefundInformation(val) {
        let res = [];
        if (val == 0) {
          // 全退
          res = this.dialogTableData;
        } else {
          res = this.tableSelected;
        }
        let old = this.tableData.map((item) => {
          return item.productId;
        });
        let news = res.map((item) => {
          return item.productId;
        });
        let idarr = [];
        for (let i = 0; i < news.length; i++) {
          if (old.indexOf(news[i]) == -1) {
            idarr.push(news[i]);
          }
        }
        this.getrefundMsg.productId = idarr.join(",");
        OrderReturnSellInfo(this.getrefundMsg).then((res) => {
          let tablearr = res.data[0].details;
          for (let i = 0; i < tablearr.length; i++) {
            this.tableData.push(tablearr[i]);
          }
        });
        this.refundsDialog = false;
      },
      handleSelectionChange(val) {
        this.tableSelected = val;
      },
      refundsDialogClose() {
        this.refundsDialog = false;
        this.dialogTableData = [];
      },
      // 选择退款商品
      refundsBtn() {
        this.refundsDialog = true;
        this.getGoods();
      },
      getGoods() {
        let res = {
          sellOrderId: this.getrefundMsg.orderId,
          custmorId: this.getUserMsg.toUserId,
          type:
            this.getrefundMsg.radio == "商品采购单" && this.getUserMsg.type == 1
              ? 1
              : 0,
          orderReturnId: 1,
        };
        rarSelectGoods(res).then((resp) => {
          this.dialogTableData = resp.data;
          if (this.tableData.length > 0) {
            this.$nextTick(() => {
              for (let i = 0; i < this.dialogTableData.length; i++) {
                for (let j = 0; j < this.tableData.length; j++) {
                  if (
                    this.dialogTableData[i].productId ==
                    this.tableData[j].productId
                  ) {
                    this.$refs.dialogRef.toggleRowSelection(
                      this.dialogTableData[i],
                      true
                    );
                  }
                }
              }
            });
          }
        });
      },
      // 确认退款要请求的数据
      refundsType() {
        let productTotalPrice = 0; //商品总金额
        let basketTotalPrice = 0; // 退回筐子总金额
        let orderTotalPrice = 0; // 退款合计金额
        for (let i = 0; i < this.tableData.length; i++) {
          const el = this.tableData[i];
          productTotalPrice += Number(el.productTotalPrice) || 0;
          basketTotalPrice += Number(el.buyBasketPrice) || 0;
          orderTotalPrice += Number(el.refundPrice) || 0;
        }
        let datap = {
          productTotalPrice,
          basketTotalPrice,
          orderTotalPrice,
        };
        return datap;
      },
      // 确认退款
      makeSure() {
        for (let j = 0; j < this.tableData.length; j++) {
          const element = this.tableData[j];
          if (element.refundPrice > element.remainingRefundable) {
            return;
          }
        }
        let userid = "";
        if (this.getUserMsg.toUserId == "") {
          userid =
            this.getUserMsg.fromUserName + "," + this.getUserMsg.fromUserPhone;
        } else {
          userid = this.getUserMsg.toUserId;
        }
        let linshi = this.tableData;
        for (let i = 0; i < linshi.length; i++) {
          linshi[i].detailTotalPrice = Number(linshi[i].refundPrice);
        }
        
        let paramData = {
          returnUserId: this.getrefundMsg.radio == "商品销售单" ? userid : "", // 退货方userid 非平台 "名称,手机号"
          returnToUserId: this.getrefundMsg.radio == "商品采购单" ? userid : "", // 收货方userid 非平台 "姓名,手机号"
          orderReturnId: 0, // 退货退款主键id 修改用  不修改传 0
          type: 0, // 不修改传 0  1 为 退货方修改 2 收货方修改
          typeView: this.getrefundMsg.ispt == "0" ? 1 : 2, //0收货方修改订单 1我向平台发起退货退款 2我向非平台发起退货退款 3非平台向我发起退货退款
          productTotalPrice: Number(this.refundsType().productTotalPrice), // 退款单商品总金额
          basketTotalCount: 0, // 退回筐子总个数
          basketTotalPrice: Number(this.refundsType().basketTotalPrice), // 退回筐子总金额
          orderType: this.getrefundMsg.ispt == "0" ? 1 : 2, // 1 平台 2 非平台
          transferArea: "", // 车牌号地区
          transferNumber: 0, // 车牌号地区
          transferImageUrls: [], // 运输车照片
          transferImageList: [], //  运输车图片url,修改时需保留的图片url,修改时传
          orderTotalPrice: Number(this.refundsType().orderTotalPrice), // 退款合计金额
          productDescription: "", //退回商品名称  茄子|长茄、火龙果|红皮火龙果  、隔开
          productTypeCount: 0, // 商品种类
          basketVacateCount: 0, // 腾空筐子总数
          orderSellId: this.getUserMsg.id, // 订单主键id
          orderSellNo: this.getUserMsg.ordersellId, // 订单编号
          productTotalCount: this.tableData.length, // 退货商品总数
          isReturnProduct: 0, // 0 不退货 1 退货
          remark: this.remarks, //  # 备注
          productList: linshi,
        };
        createOrderReturn(paramData).then((res) => {
          if (res.status == 200) {
            this.$success("操作成功");
            this.$closePage("refundsGoods");
          } else if (res.status == 100001) {
            this.$warning("有在途订单");
            this.getMsg();
          }
        });
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
      // 数值取两位小数
      moneyFormatTwo(moneyStr) {
        // 先将数值取两位小数
        let money = Number(moneyStr)
          .toFixed(2)
          .toString()
          .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
        return money;
      },
      getMsg() {
        this.getrefundMsg = JSON.parse(this.$route.query.data);
        this.OrderReturnSellInfo();
      },
      OrderReturnSellInfo() {
        let param = {
          orderId: this.getrefundMsg.orderId,
          orderType: this.getrefundMsg.orderType,
          productId: this.getrefundMsg.productId,
        };
        OrderReturnSellInfo(param).then((res) => {
          this.getUserMsg = res.data[0];
          this.tableData = res.data[0].details;
        });
      },
      selected(row, index) {
        let obj = this.tableData.map((item) => {
          return item.productId;
        });
        if (obj.indexOf(row.productId) > -1) {
          return false;
        } else {
          return true;
        }
      },
      // 移除
      removeBtn(scope) {
        this.tableData.splice(scope.$index, 1);
      },
    },
    created() {
      this.getMsg();
    },
  };
  </script>
  
  <style lang="scss" scoped>
  .page_footer {
    width: 100%;
    text-align: right;
    background-color: #fff;
    border-top: 1px solid #e4e7ed;
    position: fixed;
    bottom: 0px;
    padding: 15px;
    right: 20px;
  }
  ::v-deep .el-table th.el-table__cell {
    background-color: rgba(1, 6, 33, 0.02) !important;
  }
  ::v-deep .header_sty {
    color: rgba(1, 6, 33, 0.9);
  }
  </style>