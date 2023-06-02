<template>
  <!-- 退货信息 -->
  <Page :title="pageTitle" class="page_change">
    <!-- 退货信息 -->
    <div v-if="isShow">
      <!-- 客户信息 -->
      <el-descriptions title="客户信息" :column="4">
        <el-descriptions-item label="客户姓名" class="informatTitle">
          <span class="informatContent">{{ getUserMsg.fromUserName }}</span>
          <el-tag type="info" v-if="getUserMsg.type == 1">非</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="联系电话" class="informatTitle">
          <span class="informatContent">{{ getUserMsg.fromUserPhone }}</span>
        </el-descriptions-item>
      </el-descriptions>
      <!--  订单信息   采购单信息 -->
      <el-descriptions
        v-if="getrefundMsg.radio == '商品采购单'"
        title="采购单信息"
        :column="5"
        class="informatOrder"
      >
        <el-descriptions-item label="采购单编号" class="informatTitle">
          <span
            class="informatColor"
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
        <el-descriptions-item label="采购单状态" class="informatTitle">
          <font color="#DF971A" v-if="getUserMsg.status == 1">待确认</font>
          <font color="#DF971A" v-if="getUserMsg.status == 3">待对方收款</font>
          <font color="#DD4C4D" v-if="getUserMsg.status == 4">未结清</font>
          <font color="#248B39" v-if="getUserMsg.status == 5">已结清</font>
        </el-descriptions-item>
        <el-descriptions-item label="采购商品金额" class="informatTitle">
          <span class="informatContent">{{
            moneyFormatTwo(getUserMsg.productTotalPrice) + "元"
          }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="已退金额" class="informatTitle">
          <span class="informatContent">{{
            moneyFormatTwo(getUserMsg.retiredPrice) + "元"
          }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="剩余可退金额" class="informatTitle">
          <span class="informatContent">{{
            moneyFormatTwo(getUserMsg.remainingRefundable) + "元"
          }}</span>
        </el-descriptions-item>
      </el-descriptions>
      <!--  订单信息   销售单信息 -->
      <el-descriptions
        v-if="getrefundMsg.radio == '商品销售单' && getrefundMsg.ispt == '1'"
        title="销售单信息"
        :column="5"
        class="informatOrder"
      >
        <el-descriptions-item label="销售单编号" class="informatTitle">
          <span
            class="informatColor"
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
        <el-descriptions-item label="销售单状态" class="informatTitle">
          <font color="#DF971A" v-if="getUserMsg.status == 1">待对方确认</font>
          <font color="#DF971A" v-if="getUserMsg.status == 2">待修改</font>
          <font color="#DF971A" v-if="getUserMsg.status == 3">待对方收款</font>
          <font color="#DD4C4D" v-if="getUserMsg.status == 4">未结清</font>
          <font color="#248B39" v-if="getUserMsg.status == 5">已结清</font>
        </el-descriptions-item>
        <el-descriptions-item label="销售商品金额" class="informatTitle">
          <span class="informatContent">{{
            moneyFormatTwo(getUserMsg.productTotalPrice) + "元"
          }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="已退金额" class="informatTitle">
          <span class="informatContent">{{
            moneyFormatTwo(getUserMsg.retiredPrice) + "元"
          }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="剩余可退金额" class="informatTitle">
          <span class="informatContent">{{
            moneyFormatTwo(getUserMsg.remainingRefundable) + "元"
          }}</span>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 退款商品部分 -->
      <div class="informatOrder">
        <span class="informatRefund">退款商品</span>
        <el-button type="primary" size="mini" @click="goodsReturnBtn()">
          + 选择退货商品</el-button
        >
        <div
          class="informatRefund_style"
          v-for="(item, index) in tableData"
          :key="index"
        >
          <div>
            <div class="flex_dom flex_item_between flex_item_mid">
              <div class="informatRefund">
                {{
                  item.catgoryfirstName +
                  "-" +
                  item.categorysecondName +
                  "-" +
                  item.name
                }}
              </div>
              <div class="flex_dom flex_item_mid">
                <el-button type="text" size="mini" @click="handleRemove(index)"
                  >移除</el-button
                >
                <div class="lineH14"></div>
                <el-button type="text" size="mini" @click="handleEdit(index)"
                  >编辑</el-button
                >
                <div class="lineH14"></div>
                <el-button type="text" size="mini" @click="handleDetail()"
                  >详情</el-button
                >
              </div>
            </div>
            <div>
              <div class="contentRefund">
                <el-row>
                  <el-col :span="6"
                    ><span class="informatTitle">品种/品牌：</span
                    ><span class="informatContent">{{
                      item.variety
                    }}</span></el-col
                  >
                  <el-col :span="6"
                    ><span class="informatTitle">产地：</span
                    ><span class="informatContent">{{
                      item.region
                    }}</span></el-col
                  >
                  <el-col :span="6"
                    ><span class="informatTitle">级别/规格：</span
                    ><span class="informatContent">{{
                      item.spec
                    }}</span></el-col
                  >
                  <el-col :span="6"
                    ><span class="informatTitle">计算单位：</span
                    ><span class="informatContent">{{
                      item.subUnit
                    }}</span></el-col
                  >
                </el-row>
                <el-row v-if="item.forms" class="informatOrder">
                  <el-col :span="6"
                    ><span class="informatTitle"
                      >退货数量：<span class="informatContent"
                        >{{ item.forms.purchasenums + item.subUnit }}|{{
                          item.forms.piecenumber1
                        }}<span class="informatColor1">筐</span></span
                      ></span
                    >
                  </el-col>
                  <el-col :span="6"
                    ><span class="informatTitle">退货单价：</span
                    ><span class="informatContent"
                      >{{ item.forms.refondPrice }}元/{{ item.subUnit }}</span
                    ></el-col
                  >
                  <el-col :span="6"
                    ><span class="informatContent">商品金额：</span
                    ><span class="informatColor2"
                      >{{
                        moneyFormatTwo(
                          item.forms.purchasenums * item.forms.refondPrice
                        )
                      }}元</span
                    ></el-col
                  >
                </el-row>
                <el-row
                  v-if="item.forms && item.forms.zhonglei > 0"
                  class="informatOrder"
                >
                  <el-col :span="6"
                    ><span class="informatTitle">筐子种类：</span
                    ><span class="informatContent"
                      >{{ item.forms.zhonglei }}种</span
                    ></el-col
                  >
                  <el-col :span="6"
                    ><span class="informatTitle">退回筐子：</span
                    ><span class="informatContent"
                      >{{ item.forms.tuihui }}个</span
                    ></el-col
                  >
                  <el-col :span="6"
                    ><span class="informatContent">筐子金额：</span
                    ><span class="informatColor2"
                      >{{ moneyFormatTwo(item.forms.jine) }}元</span
                    ></el-col
                  >
                </el-row>

                <div class="subtotal_Sty" v-if="item.forms">
                  <div class="subtotal_Seat">
                    <span>金额小计：</span
                    ><span class="informatColor2"
                      >{{
                        moneyFormatTwo(
                          item.forms.purchasenums * item.forms.refondPrice +
                            item.forms.jine
                        )
                      }}元</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 合计 -->
        <div class="informatAmount" v-if="tableData.length > 0">
          <span class="informatRefund">合计</span>
          <div class="contentRefund1">
            <el-row>
              <el-col :span="4"
                ><span class="informatTitle">商品种类：</span
                ><span class="informatContent"
                  >{{ tableData.length || 0 }}种</span
                ></el-col
              >
              <el-col :span="20"
                ><span class="informatContent1">商品金额：</span
                ><span class="informatColor2"
                  >{{ moneyFormatTwo(basketType().productTotalPrice) }}元</span
                ></el-col
              >
            </el-row>
            <el-row v-if="basketType().refundBasket > 0" class="informatOrder">
              <el-col :span="4"
                ><span class="informatTitle">退回筐子：</span
                ><span class="informatContent"
                  >{{ basketType().refundBasket }}个</span
                ></el-col
              >
              <el-col :span="20"
                ><span class="informatContent1">筐子金额：</span
                ><span class="informatColor2"
                  >{{ moneyFormatTwo(basketType().amountBasket) }}元</span
                ></el-col
              >
            </el-row>
          </div>

          <div class="subtotal_Sty">
            <div class="subtotal_Seat">
              <span class="informatContent1">退款金额合计：</span
              ><span class="informatColor2"
                >{{
                  moneyFormatTwo(
                    basketType().productTotalPrice + basketType().amountBasket
                  )
                }}元</span
              >
            </div>
          </div>
        </div>

        <!-- 运输信息部分 -->
        <div class="informatAmount">
          <span class="informatRefund">运输信息</span>
        </div>
        <div style="padding: 10px 0px">
          <el-form
            :model="ruleForm"
            label-width="80px"
            class="demo-ruleForm"
            label-position="left"
            size="small"
          >
            <el-form-item
              label="车牌号："
              prop="transinfo1"
              class="informatContent"
            >
              <el-popover
                placement="bottom"
                width="400"
                trigger="manual"
                v-model="transinfovisible"
              >
                <div>
                  <span
                    v-for="(item, index) in ChineseList"
                    :key="index"
                    class="chineseshow"
                    :style="{
                      color: ruleForm.transinfo1 == item.name ? '#fff' : '',
                      background:
                        ruleForm.transinfo1 == item.name
                          ? 'var(--color-primary)'
                          : '',
                    }"
                    @click="transinfoClick(item)"
                    >{{ item.name }}</span
                  >
                </div>

                <el-button
                  @click="transinfovisible = !transinfovisible"
                  slot="reference"
                  style="width: 85px; text-align: left"
                  >{{ ruleForm.transinfo1 || "请选择"
                  }}<i
                    class="el-icon-arrow-down el-icon--right"
                    style="float: right"
                  ></i
                ></el-button>
              </el-popover>

              <el-select
                :class="['select2', lineValue == 2 ? 'lineValue2' : '']"
                style="width: 250px"
                v-model="ruleForm.transinfo2"
                placeholder="请选择"
                @focus="lineFocus(2)"
                filterable
                remote
                :remote-method="transinfoRemoteMethod1"
              >
                <el-option
                  v-for="(item, index) in transportNumber"
                  :key="index"
                  :label="item.label1"
                  :value="item.value1"
                >
                  <div
                    @click="lineFocus2(item, index)"
                    style="padding: 0px 20px"
                  >
                    <span>{{ item.label }} </span>
                  </div>
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item
              label="车辆照片："
              prop="transimageList"
              label-width="100"
            >
              <div class="flex_dom informatOrder">
                <i
                  slot="reference"
                  class="el-icon-warning-outline informatPhoto"
                  @click="handleReference('referencePhoto', '参考照片')"
                ></i>

                <el-upload
                  list-type="picture-card"
                  :auto-upload="false"
                  accept="image/*"
                  action=" "
                  :on-change="beforeUpload"
                  :on-remove="removeUpload"
                  :on-preview="handlePictureCardPreview"
                  :file-list="ruleForm.transimageList"
                  class="uploadImage"
                  ref="upload"
                >
                  <i class="el-icon-plus"></i>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible" width="440px">
                  <el-image
                    style="width: 400px; height: auto"
                    :src="dialogImageUrl"
                    :preview-src-list="dialogImageUrlList"
                  >
                  </el-image>
                </el-dialog>
              </div>
            </el-form-item>
          </el-form>
        </div>

        <!-- 备注部分 -->
        <div>
          <span class="informatRefund">备注</span>
          <div class="contentRefund">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              maxlength="200"
              v-model="ruleForm.remark"
              :rows="4"
              style="width: 450px"
            >
            </el-input>
          </div>
        </div>
      </div>
      <div class="page_footer">
        <el-button type="primary" @click="makeSure1">确认退货退款</el-button>
      </div>
    </div>

    <!-- 编辑退货信息 -->
    <div v-if="!isShow">
      <editrefundInformation
        ref="editrefundInformation"
        :goodsMsg="goodsMsg"
        :goodsMsg2="goodsMsg2"
        :isShow="isShow"
        :tableData1="tableData[editindex]"
        :getrefundMsg1="getrefundMsg1"
        @updateEdit="updateEdit"
        @isShow1="isShow1"
      ></editrefundInformation>
    </div>
    <!-- 退货退款-选择退货商品弹窗 -->
    <el-dialog
      :visible.sync="refundsDialog"
      width="80%"
      :before-close="refundsDialogClose"
    >
      <div slot="title">
        退货退款-选择退货商品
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

    <!-- 退货信息-商品详情 -->
    <!-- <returngoodsDetail ref="returngoodsDetail"></returngoodsDetail> -->
    <referencePhoto ref="referencePhoto"></referencePhoto>
    <div style="height: 60px"></div>
  </Page>
</template>

<script>
import {
  OrderReturnSellInfo,
  createOrderReturn,
} from "@/request/api/refundManagement/index.js";
import { rarSelectGoods } from "@/request/api/applicationForDrawback/index.js";
export default {
  name: "goodsReturnInformation",
  components: {
    // returngoodsDetail: () => import("./dialogmod/returngoodsDetail.vue"), //退货信息-商品详情
    editrefundInformation: () => import("./editrefundInformation.vue"), //编辑退货信息
    referencePhoto: () => import("../orderManage/dialog/referencePhoto.vue"), // 参考照片
  },
  data() {
    return {
      batchIdArr: "",
      editindex: 0,
      goodsMsg: {},
      goodsMsg2: {},
      getrefundMsg1: {},
      routewatch: "",
      pageTitle: "退货信息",
      isShow: true,
      dialogImageUrlList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      transportNumber: [],
      lineValue: 1,
      transinfovisible: false,
      ruleForm: {
        transinfo1: "",
        transinfo2: "",
        remark: "",
        transferImageUrls: [],
        transimageList: [],
        selluserid: "",
      },
      getUserMsg: {}, //客户信息和采购单信息
      tableData: [],
      getrefundMsg: {},
      refundsDialog: false, //初始值弹窗关闭
      dialogTableData: [],
      tableSelected: [],
      ChineseList: [
        {
          //这里是地区名
          name: "京",
          id: 1,
        },
        {
          name: "津",
          id: 2,
        },
        {
          name: "冀",
          id: 3,
        },
        {
          name: "晋",
          id: 4,
        },
        {
          name: "蒙",
          id: 5,
        },
        {
          name: "辽",
          id: 6,
        },
        {
          name: "吉",
          id: 7,
        },
        {
          name: "黑",
          id: 8,
        },
        {
          name: "沪",
          id: 9,
        },
        {
          name: "苏",
          id: 10,
        },
        {
          name: "浙",
          id: 11,
        },
        {
          name: "皖",
          id: 12,
        },
        {
          name: "闽",
          id: 13,
        },
        {
          name: "赣",
          id: 14,
        },
        {
          name: "鲁",
          id: 15,
        },
        {
          name: "豫",
          id: 16,
        },
        {
          name: "鄂",
          id: 17,
        },
        {
          name: "湘",
          id: 18,
        },
        {
          name: "粤",
          id: 19,
        },
        {
          name: "桂",
          id: 20,
        },
        {
          name: "琼",
          id: 21,
        },
        {
          name: "渝",
          id: 22,
        },
        {
          name: "川",
          id: 23,
        },
        {
          name: "贵",
          id: 24,
        },
        {
          name: "云",
          id: 25,
        },
        {
          name: "藏",
          id: 26,
        },
        {
          name: "陕",
          id: 27,
        },
        {
          name: "甘",
          id: 28,
        },
        {
          name: "青",
          id: 29,
        },
        {
          name: "宁",
          id: 30,
        },
        {
          name: "新",
          id: 31,
        },
      ],
    };
  },
  // watch: {
  //   $route: {
  //     handler: function (val, oldVal) {
  //       if (this.routewatch && val.query.data) {
  //         if (this.routewatch != val.query.data) {
  //           this.getrefundMsg = JSON.parse(val.query.data);
  //           this.OrderReturnSellInfo();
  //           this.routewatch = val.query.data;
  //         }
  //       }
  //     },
  //   },
  // },
  methods: {
    basketType() {
      let productTotalPrice = 0; //商品金额
      let refundBasket = 0; //退回筐子
      let amountBasket = 0; //筐子金额
      let useBuyerBasket = 0; //使用买家筐子
      let basketVacateCount = 0; //腾空筐子
      for (let i = 0; i < this.tableData.length; i++) {
        const el = this.tableData[i].forms;
        if (el) {
          productTotalPrice += el.purchasenums * el.refondPrice;
          refundBasket += el.tuihui;
          amountBasket += el.jine;
          useBuyerBasket == Number(el.numberBuyersBasket) || 0;
          basketVacateCount == Number(el.basketVacateCount) || 0;
        }
      }
      let datap = {
        productTotalPrice,
        refundBasket,
        amountBasket,
        useBuyerBasket,
        basketVacateCount,
      };
      return datap;
    },
    // 上传文件
    beforeUpload(file, fileList) {
      this.ruleForm.transimageList = fileList;
      this.dialogImageUrlList = [];
      for (let index = 0; index < fileList.length; index++) {
        const el = fileList[index];
        this.dialogImageUrlList.push(el.url);
      }
    },
    removeUpload(file, fileList) {
      this.ruleForm.transimageList = fileList;
      this.dialogImageUrlList = [];
      for (let index = 0; index < fileList.length; index++) {
        const el = fileList[index];
        this.dialogImageUrlList.push(el.url);
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handleReference(form, title) {
      this.$refs[form].title = title;
      this.$refs[form].disableSubmit = false;
      this.$refs[form].isVisiable = true;
    },
    // 车牌选择
    lineFocus2(val) {
      this.ruleForm.transinfo1 = val.value;
    },
    // 车牌输入
    transinfoRemoteMethod1(query) {
      this.ruleForm.transinfo2 = query;
    },
    lineFocus(val) {
      this.lineValue = val;
    },
    transinfoClick(val) {
      this.ruleForm.transinfo1 = val.name;
      this.transinfovisible = false;
    },

    getbasketMsg(id) {
      let res = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].productId == id) {
          if (this.tableData[i].basketResult.basket.length > 0) {
            for (
              let j = 0;
              j < this.tableData[i].basketResult.basket.length;
              j++
            ) {
              res.push({
                userBasketId:
                  this.tableData[i].basketResult.basket[j].basketSystemBasketId,
                type: 1,
                basketColor:
                  this.tableData[i].basketResult.basket[j].basketcolor, // 筐子颜色
                basketName: this.tableData[i].basketResult.basket[j].basketname, // 筐子名称
                userBasketPrice:
                  Number(
                    this.tableData[i].basketResult.basket[j].userBasketPrice
                  ) || 0, // 筐子单价
                userBasketCount:
                  Number(
                    this.tableData[i].basketResult.basket[j].userBasketCount
                  ) || 0, // （退回、退入）筐子数量
                basketCount:
                  Number(
                    this.tableData[i].basketResult.basket[j].basketCount
                  ) || 0, // 退货筐子数量（过磅）
                basketVacateCount:
                  Number(
                    this.tableData[i].basketResult.basket[j].basketVacateCount
                  ) || 0, // 腾空筐子数量
                basketWeight:
                  Number(
                    this.tableData[i].basketResult.basket[j].basketWeight
                  ) || 0, // 筐子重量
                basketCargo:
                  Number(
                    this.tableData[i].basketResult.basket[j].basketcargo
                  ) || 0, // 筐子载货量
                overBatchId: this.tableData[i].overflowMsg.batchid || 0, // 报溢批次id,未报溢传0
                basketOverCount:
                  this.tableData[i].overflowData.basketCount -
                    this.tableData[i].overflowData.userbasketnumber || 0,
              });
            }
          }
          if (this.tableData[i].basketResult.basket1.length > 0) {
            for (
              let j = 0;
              j < this.tableData[i].basketResult.basket1.length;
              j++
            ) {
              res.push({
                userBasketId:
                  this.tableData[i].basketResult.basket1[j].basketId,
                type: 4,
                basketColor:
                  this.tableData[i].basketResult.basket1[j].basketcolor, // 筐子颜色
                basketName:
                  this.tableData[i].basketResult.basket1[j].basketname, // 筐子名称
                userBasketPrice:
                  Number(
                    this.tableData[i].basketResult.basket1[j].userBasketPrice
                  ) || 0, // 筐子单价
                userBasketCount:
                  Number(
                    this.tableData[i].basketResult.basket1[j].userBasketCount
                  ) || 0, // （退回、退入）筐子数量
                basketCount:
                  Number(
                    this.tableData[i].basketResult.basket1[j].basketCount
                  ) || 0, // 退货筐子数量（过磅）
                basketVacateCount:
                  Number(
                    this.tableData[i].basketResult.basket1[j].basketVacateCount
                  ) || 0, // 腾空筐子数量
                basketWeight:
                  Number(
                    this.tableData[i].basketResult.basket1[j].basketWeight
                  ) || 0, // 筐子重量
                basketCargo:
                  Number(
                    this.tableData[i].basketResult.basket1[j].basketcargo
                  ) || 0, // 筐子载货量
                overBatchId: 0, // 报溢批次id,未报溢传0
                basketOverCount: 0,
              });
            }
          }
          if (this.tableData[i].basketResult.basket2.length > 0) {
            for (
              let j = 0;
              j < this.tableData[i].basketResult.basket2.length;
              j++
            ) {
              res.push({
                userBasketId:
                  this.tableData[i].basketResult.basket2[j].basketid,
                type: 5,
                basketColor:
                  this.tableData[i].basketResult.basket2[j].basketColor, // 筐子颜色
                basketName:
                  this.tableData[i].basketResult.basket2[j].basektName, // 筐子名称
                userBasketPrice:
                  Number(
                    this.tableData[i].basketResult.basket2[j].userBasketPrice
                  ) || 0, // 筐子单价
                userBasketCount:
                  Number(
                    this.tableData[i].basketResult.basket2[j].userBasketCount
                  ) || 0, // （退回、退入）筐子数量
                basketCount:
                  Number(
                    this.tableData[i].basketResult.basket2[j].basketCount
                  ) || 0, // 退货筐子数量（过磅）
                basketVacateCount:
                  Number(
                    this.tableData[i].basketResult.basket2[j].basketVacateCount
                  ) || 0, // 腾空筐子数量
                basketWeight:
                  Number(
                    this.tableData[i].basketResult.basket2[j].basketWeight
                  ) || 0, // 筐子重量
                basketCargo:
                  Number(
                    this.tableData[i].basketResult.basket2[j].basketcargo
                  ) || 0, // 筐子载货量
                overBatchId: 0, // 报溢批次id,未报溢传0
                basketOverCount: 0,
              });
            }
          }
          if (this.tableData[i].basketResult.basket3.length > 0) {
            for (
              let j = 0;
              j < this.tableData[i].basketResult.basket3.length;
              j++
            ) {
              res.push({
                userBasketId:
                  this.tableData[i].basketResult.basket3[j].basketId,
                type: 2,
                basketColor:
                  this.tableData[i].basketResult.basket3[j].basketColor, // 筐子颜色
                basketName:
                  this.tableData[i].basketResult.basket3[j].basektName, // 筐子名称
                userBasketPrice:
                  Number(
                    this.tableData[i].basketResult.basket3[j].userBasketPrice
                  ) || 0, // 筐子单价
                userBasketCount:
                  Number(
                    this.tableData[i].basketResult.basket3[j].userBasketCount
                  ) || 0, // （退回、退入）筐子数量
                basketCount:
                  Number(
                    this.tableData[i].basketResult.basket3[j].basketCount
                  ) || 0, // 退货筐子数量（过磅）
                basketVacateCount:
                  Number(
                    this.tableData[i].basketResult.basket3[j].basketVacateCount
                  ) || 0, // 腾空筐子数量
                basketWeight:
                  Number(
                    this.tableData[i].basketResult.basket3[j].basketWeight
                  ) || 0, // 筐子重量
                basketCargo:
                  Number(
                    this.tableData[i].basketResult.basket3[j].basketcargo
                  ) || 0, // 筐子载货量
                overBatchId: 0, // 报溢批次id,未报溢传0
                basketOverCount: 0,
              });
            }
          }
          if (this.tableData[i].basketResult.basket4.length > 0) {
            for (
              let j = 0;
              j < this.tableData[i].basketResult.basket4.length;
              j++
            ) {
              res.push({
                userBasketId:
                  this.tableData[i].basketResult.basket4[j].basketid,
                type: 3,
                basketColor:
                  this.tableData[i].basketResult.basket4[j].basketcolor, // 筐子颜色
                basketName:
                  this.tableData[i].basketResult.basket4[j].basketname, // 筐子名称
                userBasketPrice:
                  Number(
                    this.tableData[i].basketResult.basket4[j].userBasketPrice
                  ) || 0, // 筐子单价
                userBasketCount:
                  Number(
                    this.tableData[i].basketResult.basket4[j].userBasketCount
                  ) || 0, // （退回、退入）筐子数量
                basketCount:
                  Number(
                    this.tableData[i].basketResult.basket4[j].basketCount
                  ) || 0, // 退货筐子数量（过磅）
                basketVacateCount:
                  Number(
                    this.tableData[i].basketResult.basket4[j].basketVacateCount
                  ) || 0, // 腾空筐子数量
                basketWeight:
                  Number(
                    this.tableData[i].basketResult.basket4[j].basketWeight
                  ) || 0, // 筐子重量
                basketCargo:
                  Number(
                    this.tableData[i].basketResult.basket4[j].basketCargo
                  ) || 0, // 筐子载货量
                overBatchId: 0, // 报溢批次id,未报溢传0
                basketOverCount: 0,
              });
            }
          }
          if (this.tableData[i].basketResult.basket5.length > 0) {
            for (
              let j = 0;
              j < this.tableData[i].basketResult.basket5.length;
              j++
            ) {
              res.push({
                userBasketId:
                  this.tableData[i].basketResult.basket5[j].basketId,
                type: 2,
                basketColor:
                  this.tableData[i].basketResult.basket5[j].basketColor, // 筐子颜色
                basketName:
                  this.tableData[i].basketResult.basket5[j].basektName, // 筐子名称
                userBasketPrice:
                  Number(
                    this.tableData[i].basketResult.basket5[j].userBasketPrice
                  ) || 0, // 筐子单价
                userBasketCount:
                  Number(
                    this.tableData[i].basketResult.basket5[j].userBasketCount
                  ) || 0, // （退回、退入）筐子数量
                basketCount:
                  Number(
                    this.tableData[i].basketResult.basket5[j].basketCount
                  ) || 0, // 退货筐子数量（过磅）
                basketVacateCount:
                  Number(
                    this.tableData[i].basketResult.basket5[j].basketVacateCount
                  ) || 0, // 腾空筐子数量
                basketWeight:
                  Number(
                    this.tableData[i].basketResult.basket5[j].basketWeight
                  ) || 0, // 筐子重量
                basketCargo:
                  Number(
                    this.tableData[i].basketResult.basket5[j].basketcargo
                  ) || 0, // 筐子载货量
                overBatchId: 0, // 报溢批次id,未报溢传0
                basketOverCount: 0,
              });
            }
          }
        }
      }
      return res;
    },
    productList() {
      let res = [];
      for (let i = 0; i < this.tableData.length; i++) {
        res.push({
          productId: this.tableData[i].productId,
          productIdBuyUser: this.tableData[i].productIdBuyUser, //买家商品主键id
          region: this.tableData[i].region, //产地名称
          spec: this.tableData[i].spec, //规格
          subUnit: this.tableData[i].subUnit, //一级计算单位
          subUnit2: this.tableData[i].subUnit2, //二级计算单位
          subUnit3: this.tableData[i].subUnit3, //三级计算单位
          subUnit2Weight: this.tableData[i].subUnit2Weight, //二级单位重量
          subUnit3Weight: this.tableData[i].subUnit3Weight, //三级单位重量
          productCount: Number(this.tableData[i].forms.purchasenums) || 0, //单独商品退货数量（毛重或净重）
          productPrice: Number(this.tableData[i].forms.refondPrice) || 0, //单独商品退货单价
          variety: this.tableData[i].variety, //品牌
          isRemovePeel: this.tableData[i].isRemovePeel, //是否去皮 0 不去皮 1 去皮 不用该字段传0
          isLoad: this.tableData[i].forms.isLoad, //是否有装载物，0：否，1：是
          other: "", //其他分类
          pieceUnit: this.tableData[i].pieceUnit, //计件单位
          returnPieceUnit:
            this.getrefundMsg.radio == "商品采购单"
              ? this.tableData[i].forms.ispieceUnit
              : this.tableData[i].forms.ispieceUnit1, //  退回计件单位 不修改为 ""
          basketWeight: Number(this.tableData[i].forms.kzweigth) || 0, //该商品筐子重量
          productReallyWeight:
            Number(
              this.tableData[i].forms.purchasenums -
                this.tableData[i].forms.kzweigth
            ) || 0, //单个商品净重
          returnBasketCount: Number(this.tableData[i].forms.tuihui) || 0, //退回筐子数量
          returnBasketPrice: Number(this.tableData[i].forms.jine) || 0, //筐子金额
          productTotalPrice:
            Number(
              this.tableData[i].forms.purchasenums *
                this.tableData[i].forms.refondPrice
            ) || 0, //商品金额
          detailTotalPrice:
            Number(
              this.tableData[i].forms.purchasenums *
                this.tableData[i].forms.refondPrice +
                this.tableData[i].forms.jine
            ) || 0, //金额小计
          basketTypeCount: Number(this.tableData[i].forms.zhonglei) || 0, //筐子种类数量
          basketVacateCount:
            Number(this.tableData[i].forms.basketVacateCount) || 0, //腾空筐子数量
          productBatchId:
            this.getrefundMsg.radio == "商品采购单"
              ? this.tableData[i].multipleSelection
              : [], //已选批次主键id
          regionId: this.tableData[i].regionId, //产地id
          productPieceCount: Number(this.tableData[i].forms.piecenumber) || 0, //退货计件数量
          emptyUnitCount: Number(this.tableData[i].basketVacateCount) || 0, //腾空计件数量
          isCargoExists: this.tableData[i].batchcount ? 1 : 0, // 已选批次是否有筐，0：否，1：是
          productOverBatchId: 0, //报溢表主键id  新增字段
          productOverCount: 0, //报溢批次id对应数量   新增字段
          productOverPieceCount: 0, //报溢批次id对应计件数量 新增字段
          basketList: this.getbasketMsg(this.tableData[i].productId),
        });
        // 批次主键id
      }
      return res;
    },
    // 确认退货退款
    makeSure1() {
      for (let j = 0; j < this.tableData.length; j++) {
        if (this.tableData[j].forms == undefined) {
          this.$error("请先编辑未编辑的商品");
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
      let paramData = {};
      paramData.returnUserId =
        this.getrefundMsg.radio == "商品销售单" ? userid : "";
      paramData.returnToUserId =
        this.getrefundMsg.radio == "商品采购单" ? userid : "";
      paramData.orderReturnId = 0;
      paramData.type = 0;
      paramData.typeView =
        this.getrefundMsg.radio == "商品销售单"
          ? 3
          : this.getrefundMsg.ispt == "0"
          ? 1
          : 2;
      paramData.productTotalPrice =
        Number(this.basketType().productTotalPrice) || 0;
      paramData.basketTotalCount = Number(this.basketType().refundBasket) || 0;
      paramData.basketTotalPrice = Number(this.basketType().amountBasket) || 0;
      paramData.orderType = this.getrefundMsg.ispt == "0" ? 1 : 2;
      paramData.transferArea = "";
      paramData.transferNumber = 0;
      paramData.transferImageUrls = [];
      paramData.transferImageList = [];
      paramData.orderTotalPrice =
        Number(
          this.basketType().productTotalPrice + this.basketType().amountBasket
        ) || 0;
      paramData.productDescription = "";
      paramData.productTypeCount = Number(this.getUserMsg.details.length) || 0;
      paramData.basketVacateCount =
        Number(this.basketType().basketVacateCount) || 0;
      paramData.orderSellId = this.getUserMsg.id;
      paramData.orderSellNo = this.getUserMsg.ordersellId;
      paramData.productTotalCount = Number(this.getUserMsg.details.length) || 0;
      paramData.isReturnProduct = 1;
      paramData.remark = this.ruleForm.remark;
      paramData.productList = this.productList();
      this.ruleForm.transimageList.forEach((res) => {
        if (res.raw) {
          paramData.transferImageUrls.push(res.raw);
        } else {
          paramData.transferImageList.push(res.url);
        }
      });
      const formData = new FormData();
      Object.keys(paramData).forEach((key) => {
        if (key == "transferImageUrls") {
          for (let i = 0; i < paramData.transferImageUrls.length; i++) {
            formData.append(
              "transferImageUrls",
              paramData.transferImageUrls[i]
            );
          }
        } else if (key == "basketList") {
          formData.append(key, JSON.stringify(paramData[key]));
        } else {
          formData.append(key, paramData[key]);
        }
      });
      createOrderReturn(paramData).then((res) => {
        if (res.status == 200) {
          this.$success("操作成功");
          this.$closePage("/refundManagement/refundsGoods");
        } else if (res.status == 100001) {
          this.$warning("有在途订单");
        }
      });
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
    // 选择退货商品
    goodsReturnBtn() {
      this.refundsDialog = true;
      this.getGoods();
    },
    handleSelectionChange(val) {
      this.tableSelected = val;
    },
    refundsDialogClose() {
      this.refundsDialog = false;
      this.dialogTableData = [];
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
    // 移除
    handleRemove(index) {
      this.$confirm("确认删除该商品信息?", "删除商品", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.tableData.splice(index, 1);
      });
    },
    // 编辑
    handleEdit(index) {
      this.editindex = index;
      this.goodsMsg = this.tableData[index];
      this.goodsMsg2 = this.getUserMsg;
      this.getrefundMsg1 = this.getrefundMsg;
      this.isShow = false;
      this.pageTitle = "编辑退货信息";
    },
    // 商品详情
    handleDetail() {
      console.log(1111);
      // this.$refs["returngoodsDetail"].isVisiable = true;
      // this.goodsMsg = this.tableData[index];
    },
    isShow1(val) {
      this.isShow = val;
    },
    updateEdit(val) {
      this.tableData[this.editindex].forms = val.forms;
      this.tableData[this.editindex].batchcount = val.batchcount;
      this.tableData[this.editindex].multipleSelection1 = val.multipleSelection;
      if (this.getrefundMsg.radio == "商品采购单") {
        this.tableData[this.editindex].multipleSelection =
          val.multipleSelection.map((item) => {
            return item.batchid;
          });
      }
      this.tableData[this.editindex].basketResult = {
        basket: val.tableDataBasket ? val.tableDataBasket : [],
        basket1: val.tableDataBasket1 ? val.tableDataBasket1 : [],
        basket2: val.tableDataBasket2 ? val.tableDataBasket2 : [],
        basket3: val.tableDataBasket3 ? val.tableDataBasket3 : [],
        basket4: val.tableDataBasket4 ? val.tableDataBasket4 : [],
        basket5: val.tableDataBasket5 ? val.tableDataBasket5 : [],
      };
      this.tableData[this.editindex].overflowData = val.overflowData;
      this.tableData[this.editindex].overflowMsg = val.overflowMsg;
    },
    // 跳转页面
    handleJumpDetail: function (form, record) {
      this.$router.push({
        path: form,
        query: record,
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
    OrderReturnSellInfo() {
      let param = {
        orderId: this.getrefundMsg.orderId,
        orderType: this.getrefundMsg.orderType,
        productId: this.getrefundMsg.productId,
        orderReturnId: 1,
      };
      OrderReturnSellInfo(param).then((res) => {
        this.getUserMsg = res.data[0];
        this.tableData = res.data[0].details;
      });
    },
    getMsg() {
      this.routewatch = this.$route.query.data;
      this.getrefundMsg = JSON.parse(this.$route.query.data);
      this.OrderReturnSellInfo();
    },
  },
  created() {
    this.getMsg();
  },
};
</script>

<style lang="scss" scoped>
.page_change {
  overflow-y: auto;
  .informatTitle {
    color: rgba(1, 6, 33, 0.55);
    font-size: 14px;
  }
  .informatContent {
    color: rgba(1, 6, 33, 0.9);
    font-size: 14px;
  }
  .informatOrder {
    margin-top: 12px;
  }
  .informatColor {
    color: #0ba198;
  }
  .informatRefund {
    font-size: 16px;
    color: rgba(1, 6, 33, 0.9);
    font-weight: 600;
    margin-right: 10px;
  }
  .informatRefund_style {
    padding-left: 12px;
    border-bottom: 1px solid #e9e9e9;
    margin-top: 16px;
  }
  .lineH14 {
    width: 1px;
    height: 14px;
    background: rgba(208, 208, 210, 1);
    margin: 0px 10px;
  }
  .contentRefund {
    padding: 16px 0px 24px;
  }
  .informatColor1 {
    color: #df971a;
  }
  .informatColor2 {
    color: #dd4c4d;
    font-size: 14px;
  }
  .subtotal_Sty {
    border-top: 1px dashed #e6e6e6;
    padding: 16px 0px 14px;
    margin-top: 15px;
  }
  .subtotal_Seat {
    float: right;
    font-size: 14px;
  }
  .informatAmount {
    padding-top: 24px;
  }
  .contentRefund1 {
    padding-top: 16px;
  }
  .informatContent1 {
    color: rgba(1, 6, 33, 0.9);
    font-weight: 600;
    font-size: 14px;
  }
  .informatPhoto {
    font-size: 16px;
    color: var(--color-primary);
    margin-right: 5px;
    cursor: pointer;
  }
  .page_footer {
    width: 100%;
    text-align: right;
    background-color: #fff;
    border-top: 1px solid #e4e7ed;
    position: fixed;
    bottom: 0px;
    padding: 12px;
    right: 20px;
  }
}

.chineseshow {
  width: 33px;
  height: 45px;
  display: inline-block;
  text-align: center;
  line-height: 45px;
  cursor: pointer;
}
.chineseshow:hover {
  background: #f7f7f7;
}
.select2 {
  .el-input__inner {
    border-left: none;
    border-top-left-radius: 0px !important;
    border-bottom-left-radius: 0px !important;
  }
}
.lineValue2 {
  .el-input__inner {
    border-left: 1px solid #dcdfe6;
  }
  .el-input__inner:focus {
    border-left: 1px solid #0ba198;
  }
}
</style>
