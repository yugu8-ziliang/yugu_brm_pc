<template>
  <!-- 购入单详情 -->
  <PageNoScroll class="orderDetailsModel">
    <div>
      <el-scrollbar
        ref="scrollDiv"
        :style="{
          height: $store.getters.screenHeight - 220 + 'px',
        }"
      >
        <div>
          <el-descriptions title="订单信息">
            <template slot="extra">
              <div class="ordermsg" style="margin-right: 16px">
                <span class="ordersize">操作人：</span>
                <span class="ordersize">{{ tableData.addByUserName }}</span>
              </div>
              <!-- <div class="ordermsg">
                <el-button size="small">打印</el-button>
              </div> -->
            </template>
            <el-descriptions-item label="订单编号">{{
              tableData.orderBasketId
            }}</el-descriptions-item>
            <el-descriptions-item label="订单状态">
              <font color="#E8541E">
                {{
                  tableData.orderStatus == 3
                    ? "待确认"
                    : tableData.orderStatus == 4
                    ? "待对方收款"
                    : tableData.orderStatus == 5
                    ? "未结清"
                    : "已结清"
                }}
              </font>
            </el-descriptions-item>
            <el-descriptions-item label="购入时间">{{
              tableData.buyTimestamp | parseTime
            }}</el-descriptions-item>
            <el-descriptions-item label="订单金额"
              >{{
                moneyFormatTwo(tableData.totalPrice)
              }}元</el-descriptions-item
            >
            <!-- 非平台未结清  平台未结清  平台待对方收款 -->
            <el-descriptions-item
              v-if="
                (tableData.orderType == 2 && tableData.orderStatus == 5) ||
                (tableData.orderType == 1 && tableData.orderStatus == 5) ||
                (tableData.orderType == 1 && tableData.orderStatus == 4)
              "
              label="已付金额"
              >{{
                moneyFormatTwo(tableData.actualPayPrice)
              }}元</el-descriptions-item
            >
            <!-- 平台待确认-->
            <el-descriptions-item
              v-if="tableData.orderType == 1 && tableData.orderStatus == 3"
              label="待确认金额"
            >
              <font>
                <el-tooltip placement="bottom">
                  <div slot="content" style="padding: 8px 30px 8px 5px">
                    <div>
                      <span style="margin-right: 12px">实际付款</span>
                      <span
                        >{{ moneyFormatTwo(tableData.actualPayment) }}元</span
                      >
                    </div>
                    <div>
                      <span style="margin-right: 12px">确认金额</span>
                      <span
                        >{{ moneyFormatTwo(tableData.confirmAmount) }}元</span
                      >
                    </div>
                    <div>
                      <span style="margin-right: 12px">往来款抵充</span>
                      <span
                        >{{ moneyFormatTwo(tableData.contactsPrice) }}元</span
                      >
                    </div>
                    <div style="margin-top: 16px">
                      <span style="margin-right: 12px">预付款抵扣</span>
                      <span
                        >{{ moneyFormatTwo(tableData.advancePayment) }}元</span
                      >
                    </div>
                    <div style="margin-top: 16px">
                      <span style="margin-right: 12px">借款抵扣</span>
                      <span
                        >{{ moneyFormatTwo(tableData.borrowingPrice) }}元</span
                      >
                    </div>
                    <div style="margin-top: 16px">
                      <span style="margin-right: 12px">转账其他抵扣</span>
                      <span
                        >{{ moneyFormatTwo(tableData.transferPrice) }}元</span
                      >
                    </div>
                  </div>
                  <el-button
                    style="
                      border: none;
                      background-color: #ffffff;
                      padding: 0px;
                      text-align: left;
                    "
                  >
                    <div>{{ moneyFormatTwo(tableData.waitGetPrice) }}元</div>
                  </el-button>
                </el-tooltip>
              </font>
            </el-descriptions-item>
            <!-- 平台待对方收款-->
            <el-descriptions-item
              v-if="tableData.orderType == 1 && tableData.orderStatus == 4"
              label="待对方确认金额"
            >
              <font>
                <el-tooltip placement="bottom">
                  <div slot="content" style="padding: 8px 30px 8px 5px">
                    <div>
                      <span style="margin-right: 12px">实际付款</span>
                      <span
                        >{{ moneyFormatTwo(tableData.actualPayment) }}元</span
                      >
                    </div>
                    <div>
                      <span style="margin-right: 12px">确认金额</span>
                      <span
                        >{{ moneyFormatTwo(tableData.confirmAmount) }}元</span
                      >
                    </div>
                    <div>
                      <span style="margin-right: 12px">往来款抵充</span>
                      <span
                        >{{ moneyFormatTwo(tableData.contactsPrice) }}元</span
                      >
                    </div>
                    <div style="margin-top: 16px">
                      <span style="margin-right: 12px">预付款抵扣</span>
                      <span
                        >{{ moneyFormatTwo(tableData.advancePayment) }}元</span
                      >
                    </div>
                    <div style="margin-top: 16px">
                      <span style="margin-right: 12px">借款抵扣</span>
                      <span
                        >{{ moneyFormatTwo(tableData.borrowingPrice) }}元</span
                      >
                    </div>
                    <div style="margin-top: 16px">
                      <span style="margin-right: 12px">转账其他抵扣</span>
                      <span
                        >{{ moneyFormatTwo(tableData.transferPrice) }}元</span
                      >
                    </div>
                  </div>
                  <el-button
                    style="
                      border: none;
                      background-color: #ffffff;
                      padding: 0px;
                      text-align: left;
                    "
                  >
                    <div>{{ moneyFormatTwo(tableData.waitGetPrice) }}元</div>
                  </el-button>
                </el-tooltip>
              </font>
            </el-descriptions-item>
            <!-- 平台待对方收款 -->
            <el-descriptions-item
              v-if="tableData.orderType == 1 && tableData.orderStatus == 4"
              label="本次付款时间"
            >
              {{ tableData.payMainTime | parseTime }}</el-descriptions-item
            >
            <!-- 非平台未结清  平台未结清  平台待对方收款 -->
            <el-descriptions-item
              v-if="
                (tableData.orderType == 2 && tableData.orderStatus == 5) ||
                (tableData.orderType == 1 && tableData.orderStatus == 5) ||
                (tableData.orderType == 1 && tableData.orderStatus == 4)
              "
              label="剩余未付"
              >{{
                moneyFormatTwo(tableData.shouldPayPrice)
              }}元</el-descriptions-item
            >
            <el-descriptions-item label="订单时间">{{
              tableData.useTimes | parseTime
            }}</el-descriptions-item>
            <!-- 平台未结清  平台已结清  平台待对方收款  非平台未结清   非平台已结清-->
            <!-- <el-descriptions-item
              v-if="(tableData.orderType==1&&tableData.orderStatus==5)||(tableData.orderType==1&&tableData.orderStatus==6)||(tableData.orderType==1&&tableData.orderStatus==4)||(tableData.orderType==2&&tableData.orderStatus==5)||(tableData.orderType==2&&tableData.orderStatus==6)"
              label="订单时间">{{tableData.confirmTimestamp| parseTime}}</el-descriptions-item> -->
          </el-descriptions>

          <!-- 按钮 -->
          <!-- 平台待确认 -->
          <div
            class="type1-button"
            v-if="tableData.orderType == 1 && tableData.orderStatus == 3"
          >
            <el-button size="small" style="color: rgba(1, 6, 33, 0.75)"
              >打印</el-button
            >
            <el-button
              class="type1-button-right"
              size="small"
              @click="open('returnModify')"
              >退回修改</el-button
            >
            <el-button size="small" type="primary">确认付款</el-button>
          </div>
          <!-- 平台未结清 -->
          <div
            class="type-button"
            v-if="tableData.orderType == 1 && tableData.orderStatus == 5"
          >
            <div>
              <span class="type-button-left type-button-left1">退款记录</span>
              <span
                class="type-button-left"
                style="cursor: pointer"
                @click="paymentRecord()"
                >付款记录</span
              >
            </div>
            <div>
              <el-button size="small" style="color: rgba(1, 6, 33, 0.75)"
                >打印</el-button
              >
              <el-button
                size="small"
                class="type-button-right"
                @click="basketbackRefund('basketbackRefund')"
                >退筐退款
              </el-button>
              <el-button size="small" type="primary">继续付款</el-button>
            </div>
          </div>
          <!-- 平台已结清 -->
          <div
            class="type-button"
            v-if="tableData.orderType == 1 && tableData.orderStatus == 6"
          >
            <div>
              <span class="type-button-left type-button-left1">退款记录</span>
              <span class="type-button-left" @click="paymentRecord()"
                >付款记录</span
              >
            </div>
            <div>
              <el-button size="small" style="color: rgba(1, 6, 33, 0.75)"
                >打印</el-button
              >
              <el-button
                size="small"
                class="type-button-right"
                @click="basketbackRefund('basketbackRefund')"
                >退筐退款
              </el-button>
            </div>
          </div>
          <!-- 平台待对方收款 -->
          <div
            class="type-button"
            v-if="tableData.orderType == 1 && tableData.orderStatus == 4"
          >
            <div>
              <span class="type-button-left type-button-left1">退款记录</span>
              <span
                class="type-button-left"
                style="cursor: pointer"
                @click="paymentRecord()"
                >付款记录</span
              >
            </div>
            <div>
              <el-button size="small" style="color: rgba(1, 6, 33, 0.75)"
                >打印</el-button
              >
              <el-button
                size="small"
                class="type-button-right"
                @click="open('withdrawCancellation')"
                >撤回取消</el-button
              >
              <el-button
                size="small"
                class="type-button-right"
                @click="open('withdrawChange')"
                >撤回修改</el-button
              >
              <el-button size="small" type="primary">提醒对方收款</el-button>
            </div>
          </div>
          <!-- 非平台未结清 -->
          <div
            class="type-button"
            v-if="tableData.orderType == 2 && tableData.orderStatus == 5"
          >
            <div>
              <span class="type-button-left type-button-left1">退款记录</span>
              <span class="type-button-left" @click="paymentRecord()"
                >付款记录</span
              >
            </div>
            <div>
              <el-button size="small" style="color: rgba(1, 6, 33, 0.75)"
                >打印</el-button
              >
              <el-button
                size="small"
                class="type-button-right"
                @click="basketbackRefund('basketbackRefund')"
                >退筐退款
              </el-button>
              <el-button size="small" type="primary">添加付款</el-button>
            </div>
          </div>
          <!-- 非平台已结清 -->
          <div
            class="type-button"
            v-if="tableData.orderType == 2 && tableData.orderStatus == 6"
          >
            <div>
              <span class="type-button-left type-button-left1">退款记录</span>
              <span
                class="type-button-left"
                style="cursor: pointer"
                @click="paymentRecord()"
                >付款记录</span
              >
            </div>
            <div>
              <el-button size="small" style="color: rgba(1, 6, 33, 0.75)"
                >打印</el-button
              >
              <el-button
                size="small"
                class="type-button-right"
                @click="basketbackRefund('basketbackRefund')"
                >退筐退款
              </el-button>
            </div>
          </div>
        </div>

        <div
          style="
            border-top: 1px solid #e9e9e9;
            padding: 10px 0px 0px;
            margin-top: 20px;
          "
        >
          <el-descriptions title="客户信息" style="margin-top: 12px">
            <el-descriptions-item label="客户姓名">
              {{ userInfo.toUserName }}
              <el-image
                v-if="userInfo.typeId == 0"
                :src="urlfei"
                class="img-icon"
              ></el-image>
              <el-image
                v-else-if="userInfo.typeId == 3 || userInfo.typeId == 4"
                :src="urlcai"
                class="img-icon"
              >
              </el-image>
              <el-image
                v-else-if="userInfo.typeId == 10 || userInfo.typeId == 11"
                :src="urlgong"
                class="img-icon"
              >
              </el-image>
              <el-image
                v-else-if="userInfo.typeId == 6 || userInfo.typeId == 7"
                :src="urljing"
                class="img-icon"
              >
              </el-image>
            </el-descriptions-item>
            <el-descriptions-item label="联系电话">{{
              userInfo.toPhoneNumber
            }}</el-descriptions-item>
            <!-- 平台有  非平台个人无 -->
            <el-descriptions-item
              v-if="
                userInfo.typeId == 3 ||
                userInfo.typeId == 6 ||
                userInfo.typeId == 11
              "
              label="企业名称"
              >{{ userInfo.toCompanyName }}</el-descriptions-item
            >
          </el-descriptions>
        </div>

        <div style="margin-top: 18px">
          <div
            style="
              font-size: 16px;
              color: rgba(1, 6, 33, 0.9);
              font-weight: 600;
              margin-bottom: 16px;
            "
          >
            筐子信息
          </div>

          <div class="currentInventory-table">
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
              :data="tableDataList"
              :span-method="objectSpanMethod"
              show-summary
              :summary-method="getSummaries"
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
                :align="item.align"
                header-align="left"
              >
                <template slot-scope="scope">
                  <span
                    v-if="
                      item.prop == 'basketPrice' ||
                      item.prop == 'basketTotalPrice'
                    "
                    >{{ moneyFormatTwo(scope.row[item.prop]) }}</span
                  >
                  <span v-else-if="item.prop == 'basketName'"
                    >【{{ scope.row.name }}】{{ scope.row.basketName }}</span
                  >
                  <span v-else>{{ scope.row[item.prop] }}</span>
                </template>
              </u-table-column>
            </u-table>
          </div>
        </div>
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
          <div
            v-for="(remarkitem, remarkindex) in remarks"
            :key="'remark' + remarkindex"
          >
            <span class="note-size" style="margin-right: 30px">{{
              remarkitem.createtime | parseTime
            }}</span>
            <span class="note-size">{{ remarkitem.type }}</span>
            <div class="note-size" style="margin-bottom: 30px">
              备注内容：<span
                v-for="(remark2item, remark2index) in remarkitem.remark"
                :key="'remark2index' + remark2index"
                >{{ remark2item }}</span
              >
            </div>
          </div>
        </div>
      </el-scrollbar>
      <!-- 弹框 -->
      <el-dialog :title="modalTitle" :visible.sync="modalShow" width="30%">
        <!-- 撤回取消 -->
        <div v-if="btnType === 'withdrawCancellation'">确认撤回取消？</div>
        <!-- 撤回修改 -->
        <div v-else-if="btnType === 'withdrawChange'">确认撤回修改？</div>
        <!-- 退回修改 -->
        <div v-else-if="btnType === 'returnModify'">
          <div style="color: rgba(1, 6, 33, 0.9)">确认退回？</div>
          <div>
            <div style="color: rgba(1, 6, 33, 0.9)">备注信息</div>
            <el-input type="textarea" :rows="3" placeholder="请输入"></el-input>
          </div>
        </div>
        <!-- 待定 -->
        <div v-else>lllllll</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modalShow = false">取 消</el-button>
          <el-button type="primary" @click="makeSure">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 退筐退款弹框 -->
      <el-dialog title="提示" :visible.sync="modalShow1" width="66%">
        <div style="color: #e8541e" v-if="tableData.orderBasketRetuenType == 1">
          当前订单无可退数量
        </div>
        <div v-else-if="tableData.orderBasketRetuenType == 0">
          确认退筐退款？
        </div>
        <div style="color: #e8541e" v-else>当前订单无可退金额</div>
        <!-- 当前订单无可退金额 -->
        <div
          v-if="
            tableData.orderBasketRetuenType == 2 ||
            tableData.orderBasketRetuenType == 3
          "
        >
          <el-descriptions
            :colon="false"
            style="margin-bottom: 10px; margin-top: 16px"
            title="购入单信息"
            :column="4"
          >
            <el-descriptions-item label="购入单编号:">{{
              tableData1.orderBasketId
            }}</el-descriptions-item>
            <el-descriptions-item label="购入单金额:"
              >{{
                moneyFormatTwo(tableData1.orderTotalPrice)
              }}元</el-descriptions-item
            >
            <el-descriptions-item label="已退金额:"
              >{{
                moneyFormatTwo(tableData1.actualPayPrice)
              }}元</el-descriptions-item
            >
            <el-descriptions-item label="剩余可退:"
              >{{ moneyFormatTwo(tableData1.remainingOrderBasketPrice) }}元
            </el-descriptions-item>
          </el-descriptions>
          <div>
            <el-descriptions
              :colon="false"
              title="退筐退款记录"
              :column="4"
              v-for="(modelitem, modelindex) in modelList"
              :key="modelindex"
            >
              <el-descriptions-item label="退筐单编号:">{{
                modelitem.orderBasketReturnId
              }}</el-descriptions-item>
              <el-descriptions-item label="退筐时间:">{{
                modelitem.confirmTimestamp | parseTime
              }}</el-descriptions-item>
              <el-descriptions-item label="退筐金额:"
                >{{ moneyFormatTwo(modelitem.userBasketTotalPrice) }}元
              </el-descriptions-item>
              <el-descriptions-item>
                <el-button
                  type="primary"
                  size="small"
                  @click="check('baskrefundOrder', modelitem.orderId)"
                  >查看
                </el-button>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div>
        <!-- 当前订单无可退数量 -->
        <!-- <div v-if="tableData.orderBasketRetuenType==2||tableData.orderBasketRetuenType==3">
          <el-descriptions :colon='false' style="margin-bottom:10px;margin-top:16px" title="购入单信息" :column="4">
            <el-descriptions-item label="购入单编号:">{{tableData1.orderBasketId}}</el-descriptions-item>
            <el-descriptions-item label="购入单金额:">{{moneyFormatTwo(tableData1.orderTotalPrice)}}元</el-descriptions-item>
            <el-descriptions-item label="已退金额:">{{moneyFormatTwo(tableData1.actualPayPrice)}}元</el-descriptions-item>
            <el-descriptions-item label="剩余可退:">{{moneyFormatTwo(tableData1.remainingOrderBasketPrice)}}元</el-descriptions-item>
          </el-descriptions>
          <div>
            <el-descriptions :colon='false' title="退筐明细" :column="4" v-for="(modelitem,modelindex) in modelList" :key=modelindex>
              <el-descriptions-item label="退筐单编号:">{{modelitem.orderBasketReturnId}}</el-descriptions-item>
              <el-descriptions-item label="退筐时间:">{{modelitem.confirmTimestamp | parseTime}}</el-descriptions-item>
              <el-descriptions-item label="退筐金额:">{{moneyFormatTwo(modelitem.userBasketTotalPrice)}}元</el-descriptions-item>
              <el-descriptions-item>
                <el-button type="primary" size="small" @click="check('baskrefundOrder',modelitem.orderId)">查看
                </el-button>
              </el-descriptions-item>
            </el-descriptions>
          </div>
        </div> -->

        <span
          slot="footer"
          class="dialog-footer"
          v-if="tableData.orderBasketRetuenType == 0"
        >
          <el-button @click="modalShow = false">取 消</el-button>
          <el-button
            type="primary"
            @click="
              basketmakeSure('@/views/refundManagement/createrefundBasket')
            "
            >确 定
          </el-button>
        </span>
      </el-dialog>
    </div>
  </PageNoScroll>
</template>

<script>
import {
  buyBasketOrderDetail,
  OrderReturnBasketList,
} from "@/request/api/frameManage/basketInOut";
export default {
  name: "purchaseOrder",
  data() {
    return {
      modelList: {},
      userInfo: {},
      remarks: [],
      urljing: require("@/assets/image/imgs/jing-icon.png"),
      urlcai: require("@/assets/image/imgs/cai-icon.png"),
      urlgong: require("@/assets/image/imgs/gong-icon.png"),
      urlfei: require("@/assets/image/imgs/fei-icon.png"),
      typeView: "", // 判断当前是哪种筐子类型
      orderId: "",
      tableDataList: [],
      tableData: {},
      tableDataList2: [],
      tableData2: {},
      tableData1: {},
      columns: [
        {
          width: 250,
          prop: "basketName",
          label: "筐子种类",
        },
        {
          // width: 200,
          prop: "basketColor",
          label: "颜色",
        },
        {
          // width: 200,
          prop: "basketPrice",
          label: "单价(元/个)",
        },
        {
          // width: 200,
          prop: "basketCount",
          label: "数量(个)",
        },
        {
          // width: 200,
          prop: "basketTotalPrice",
          label: "金额(元)",
        },
      ],
      typeName: "",
      rules: {
        typeName: [
          {
            required: true,
            message: "请选择",
            trigger: "change",
          },
        ],
      },
      dialogVisible: false,
      // 弹框的属性
      btnType: "", // 具体的按钮类型
      modalTitle: "", //  弹框的主题
      modalShow: false, //  弹框的显示与隐藏
      // 退筐退款弹框
      btnType1: "", // 具体的按钮类型
      modalShow1: false, //  弹框的显示与隐藏
    };
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        let { basketInOutTypeView, orderId } = val.query;
        if (basketInOutTypeView && orderId) {
          this.typeView = basketInOutTypeView;
          this.orderId = orderId;
        }
        this.getList();
      },
      // 深度观察监听
      // deep: true,
      immediate: true,
    },
  },
  methods: {
    paymentRecord() {
      this.$router.push({
        path: "purchaseOrderpaymentRecord",
        query: {
          id: this.tableData.orderId,
          ordertype: this.tableData.orderType.toString(),
        },
      });
    },
    getList() {
      buyBasketOrderDetail({
        orderId: this.orderId,
      }).then((res) => {
        if (res.status == 200) {
          this.tableData = res.data[0];
          this.userInfo = this.tableData.userInfo[0];
          this.remarks = this.tableData.remarks;
          if (res.data[0].basketDetails.length > 0) {
            let tableData = [];
            let data1 = res.data[0].basketDetails;
            for (let i = 0; i < data1.length; i++) {
              const el = data1[i];
              if (el.basketList.length > 0) {
                let data2 = el.basketList;
                for (let j = 0; j < data2.length; j++) {
                  const el1 = data2[j];
                  tableData.push({
                    isCol: j == 0 ? el.basketList.length : null,
                    ...el,
                    basketEmptyNumber: el1.basketEmptyNumber, // 当前库存空置数量
                    basketCount: el1.basketCount, // 售出数量
                    basketPrice: el1.basketPrice, // 单价
                    basketTotalPrice: el1.basketTotalPrice, // 金额
                    basketColor: el1.basketColor, // 颜色
                  });
                }
              } else {
                tableData.push(el);
              }
            }
            this.tableDataList = tableData;
          }
        }
      });
    },
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
    moneyFormatTwo(moneyStr) {
      // 先将数值取两位小数
      let money = Number(moneyStr)
        .toFixed(2)
        .toString()
        .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      return money;
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] =
            '<span style="color: rgba(1, 6, 33, 0.9);font-size:18px;font-weight: 600;">' +
            "总计：" +
            this.tableData.basketNum +
            "种</span>";
          return;
        }
        if (
          column.property == "basketCount" ||
          column.property == "basketTotalPrice"
        ) {
          const values = data.map((item) => Number(item[column.property]));
          // 合计
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            if (column.property == "basketTotalPrice") {
              sums[index] =
                '<span style="color: #E8541E;font-size:18px;font-weight: 700;">' +
                this.moneyFormatTwo(sums[index]) +
                "</span>";
            }
            if (column.property == "basketCount") {
              sums[index] =
                '<span style="color:rgba(1, 6, 33, 0.9);font-size:18px;font-weight: 700;">' +
                sums[index] +
                "</span>";
            }
          }
        } else {
          sums[index] = "";
        }
      });
      return [sums];
    },
    // 弹框
    open(btnType) {
      if (btnType === "withdrawCancellation" || btnType === "withdrawChange") {
        this.modalTitle = "提示";
      }
      if (btnType === "returnModify") {
        this.modalTitle = "退回修改";
      }
      this.btnType = btnType; // 具体的按钮
      this.modalShow = true;
    },
    basketbackRefund() {
      // 按钮接口
      let param = {};
      if (this.tableData.orderBasketRetuenType == 1) {
        // this.modalWidth1=60%;
        param = {
          orderId: this.orderId,
          type: 1,
        };
      } else {
        param = {
          orderId: this.orderId,
          type: 2,
        };
        this.modalShow1 = true;
      }
      OrderReturnBasketList(param).then((res) => {
        this.tableData1 = res.data[0];
        if (param.type == 2) {
          this.modelList = this.tableData1.modelList;
        } else if (param.type == 1) {
          this.modelList = this.tableData1.modelList;
        }
      });
    },
    makeSure() {
      // 按钮接口
      if (this.btnType === "anotherList") {
      }
      this.modalShow = false;
      this.modalTitle = "";
    },
    check(form, record) {
      this.$router.push({
        path: form,
        query: {
          orderId: record,
        },
      });
      this.modalShow1 = false;
    },
    basketmakeSure(form, record) {
      this.$router.push({
        path: form,
      });
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.orderDetailsModel {
  .ordermsg {
    display: inline-block;

    .ordersize {
      font-size: 13px;
      color: rgba(1, 6, 33, 0.75);
    }
  }

  .img-icon {
    height: 14px;
  }

  .note-size {
    font-size: 14px;
    color: rgba(1, 6, 33, 0.75);
    margin-top: 12px;
  }

  .type-button {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 16px;

    .type-button-left {
      color: var(--color-primary);
      font-size: 14px;
    }

    .type-button-left1 {
      margin-right: 16px;
    }

    .type-button-right {
      color: var(--color-primary);
      border: 1px solid var(--color-primary);
      margin-right: 8px;
    }
  }

  .type1-button {
    display: flex;
    flex-direction: row;
    justify-content: right;

    .type1-button-right {
      color: var(--color-primary);
      border: 1px solid var(--color-primary);
      margin-right: 8px;
    }
  }
}
</style>

<style lang="scss">
.orderDetailsModel {
  .el-scrollbar {
    .el-scrollbar__wrap {
      margin-bottom: 0px !important;
      overflow-x: hidden;

      .el-scrollbar__view {
        // height: var(--screenHeight) !important;
        position: relative;
        padding: 0px !important;
      }
    }
  }
}
</style>