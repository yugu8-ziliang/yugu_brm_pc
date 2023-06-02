<template>
  <!-- 收款记录 我提交的退货退款单详情-->
  <PageNoScroll
    :background="'#f5f5f5'"
    :paddingNone="true"
    class="collectionRecordModel"
  >
    <div style="background: #fff; padding: 20px">
      <div class="flex_dom flex_item_between flex_item_mid">
        <div
          style="color: rgba(1, 6, 33, 0.9); font-size: 16px; font-weight: 700"
        >
          订单信息
        </div>
      </div>

      <div style="padding: 8px 0px 10px">
        <el-row>
          <el-col :span="22">
            <el-row :span="24">
              <el-col :span="6">
                <div>
                  <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >退货退款单编号：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                    {{ dataS.orderId }}
                  </span>
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >订单状态：</span
                  ><span style="color: #df971a; font-size: 14px">
                    {{ statusF(dataS) }}
                  </span>
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >退货时间：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                    dataS.timestamp | parseTime
                  }}</span>
                </div>
              </el-col>
            </el-row>
            <el-row :span="24" style="margin-top: 10px">
              <el-col :span="6">
                <div>
                  <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >退款金额：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                    >{{ dataS.orderPrice }}元</span
                  >
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >已收金额：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                    >{{ dataS.actualPayPrice }}元</span
                  >
                </div>
              </el-col>
              <el-col :span="6" v-if="dataS.totalUnpaid">
                <div>
                  <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >剩余未收金额：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                    >{{ dataS.totalUnpaid }}元</span
                  >
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
        <div
          style="display: flex; flex-direction: row-reverse"
          v-if="formDatas.ordertype == '2'"
        >
          <el-button style="margin-left: 15px" type="primary" size="mini">
            添加收款</el-button
          >
        </div>
      </div>
      <div
        ref="currentBasketDetailsTable"
        style="padding-top: 10px; border-top: 1px solid #e9e9e9"
      >
        <el-scrollbar
          ref="scrollDiv"
          :style="{
            height:
              parseInt($store.getters.screenHeight - SetHeight - 50) + 'px',
            background: '#fff',
          }"
        >
          <div class="flex_dom flex_item_between flex_item_mid">
            <div
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 16px;
                font-weight: 700;
              "
            >
              收款明细
            </div>
          </div>
          <div v-for="(item, index) in dataS.payList" :key="index">
            <el-row
              style="margin-top: 15px; border-top: rgba(233, 233, 233, 1)"
            >
              <el-col :span="6">
                <div>
                  <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >收款时间：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                    item.confirmTimestamp | parseTime
                  }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >操作人：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                    item.addByUserName
                  }}</span>
                </div>
              </el-col>
            </el-row>
            <el-row style="margin-top: 5px">
              <el-col :span="6">
                <div>
                  <span
                    style="
                      color: rgba(1, 6, 33, 0.75);
                      font-size: 14px;
                      font-weight: 700;
                    "
                    >本次确认金额：</span
                  ><span style="color: rgba(221, 76, 77, 1); font-size: 14px"
                    >{{ item.totalAmount }}元</span
                  >
                </div>
              </el-col>
            </el-row>
            <div
              style="
                background-color: rgba(1, 6, 33, 0.02);
                padding: 10px;
                margin-top: 5px;
              "
            >
              <el-row style="margin-left: 10px" v-if="item.payPrice">
                <el-col :span="3">
                  <div>
                    <span
                      style="
                        color: rgba(1, 6, 33, 0.75);
                        font-size: 14px;
                        font-weight: 700;
                      "
                      >实际收款：</span
                    ><span style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
                      >{{ item.payPrice }}元</span
                    >
                  </div>
                </el-col>
                <el-col :span="4" v-if="item.payInfo.lakalaCollection">
                  <div>
                    <span style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
                      >线上收款：</span
                    ><span style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
                      >{{ item.payInfo.lakalaCollection || 0 }}元</span
                    >
                  </div>
                </el-col>
              </el-row>
              <el-row
                style="margin-left: 10px"
                v-if="payInfoLoc(item.payInfo)[0] != 0"
              >
                <el-col :span="3">
                  <div>
                    <span style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
                      >&nbsp; </span
                    ><span style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
                      >&nbsp;
                    </span>
                  </div>
                </el-col>
                <el-col :span="21">
                  <div>
                    <span style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
                      >线下收款：</span
                    ><span style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
                      >{{ payInfoLoc(item.payInfo)[0] }}元
                      {{ payInfoLoc(item.payInfo)[1] }}</span
                    >
                  </div>
                </el-col>
              </el-row>
              <!-- --------------------------------- -->
              <div v-if="item.confirmedAmount != 0">
                <el-row style="margin-left: 10px; margin-top: 10px">
                  <el-col :span="3">
                    <div>
                      <span
                        style="
                          color: rgba(1, 6, 33, 0.75);
                          font-size: 14px;
                          font-weight: 700;
                        "
                        >确认金额：</span
                      ><span
                        style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
                        >{{ item.confirmedAmount }}元</span
                      >
                    </div>
                  </el-col>
                  <el-col :span="6" v-if="item.comeInPrice">
                    <div>
                      <span style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
                        >经营往来款抵充：</span
                      ><span
                        style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
                        >{{ item.comeInPrice }}元 </span
                      ><span
                        style="
                          color: rgba(11, 161, 152, 1);
                          font-size: 14px;
                          margin-left: 5px;
                          cursor: pointer;
                        "
                        @click="
                          handleView('creditFundsDialog', '经营往来款抵充', {
                            ...item,
                            basketInOutTypeView: formDatas.ordertype,
                          })
                        "
                        >查看明细</span
                      >
                    </div>
                  </el-col>
                </el-row>
                <el-row style="margin-left: 10px" v-if="item.advancePrice">
                  <el-col :span="3">
                    <div>
                      <span style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
                        >&nbsp;</span
                      ><span
                        style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
                        >&nbsp;</span
                      >
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div>
                      <span style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
                        >预付款抵扣：</span
                      ><span
                        style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
                        >{{ item.advancePrice }}元</span
                      >
                    </div>
                  </el-col>
                </el-row>
                <el-row style="margin-left: 10px" v-if="item.borrowPrice">
                  <el-col :span="3">
                    <div>
                      <span style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
                        >&nbsp;</span
                      ><span
                        style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
                        >&nbsp;</span
                      >
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div>
                      <span style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
                        >借款抵扣：</span
                      ><span
                        style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
                        >{{ item.borrowPrice }}元</span
                      >
                    </div>
                  </el-col>
                </el-row>
                <el-row
                  style="margin-left: 10px"
                  v-if="item.transferOtherPrice"
                >
                  <el-col :span="3">
                    <div>
                      <span style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
                        >&nbsp;</span
                      ><span
                        style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
                        >&nbsp;</span
                      >
                    </div>
                  </el-col>
                  <el-col :span="4">
                    <div>
                      <span style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
                        >转账其他抵扣：</span
                      ><span
                        style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
                        >{{ item.transferOtherPrice }}元</span
                      >
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>

            <el-row
              style="margin-top: 5px"
              v-if="item.credentialsImageUrls.length > 0"
            >
              <el-col :span="24">
                <div class="flex_dom flex_item_start">
                  <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >支付凭证：</span
                  >
                  <div>
                    <el-image
                      v-for="(item1, index1) in item.credentialsImageUrls"
                      :key="index1"
                      style="width: 164px; height: 106px; margin-right: 15px"
                      :src="item1"
                      :preview-src-list="item.credentialsImageUrls"
                      fit="fill"
                    ></el-image>
                  </div>
                </div>
              </el-col>
            </el-row>
            <div
              v-if="
                item.remark && item.remark.length > 0 && item.remark[0].remark
              "
            >
              <el-row style="margin-top: 5px" v-if="item.remark.length > 0">
                <el-col :span="1">
                  <div>
                    <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >备注：</span
                    >
                  </div>
                </el-col>
                <el-col :span="6">
                  <div>
                    <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >发起时间：{{
                        item.remark[0].createtime | parseTime
                      }}</span
                    >
                  </div>
                </el-col>
              </el-row>
              <el-row v-if="item.remark.length > 0">
                <el-col :span="1">
                  <div>
                    <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >&nbsp;</span
                    ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                      >&nbsp;</span
                    >
                  </div>
                </el-col>
                <el-col :span="6">
                  <div>
                    <span
                      style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >{{ item.remark[0].displayName }}</span
                    ><span
                      style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                      >{{ item.remark[0].remark }}</span
                    >
                  </div>
                </el-col>
              </el-row>
            </div>
            <div style="margin-top: 10px">
              <span
                v-if="item.editById != '0'"
                style="
                  color: rgba(11, 161, 152, 1);
                  font-size: 14px;
                  cursor: pointer;
                "
                @click="
                  handleView(
                    'collectionModificationDialog',
                    '修改前收款记录',
                    item
                  )
                "
                >修改前收款记录</span
              >
              <el-button
                style="margin-left: 15px"
                size="mini"
                type="primary"
                v-if="
                  dataS.payList.length == index + 1 &&
                  formDatas.ordertype == '2'
                "
              >
                更 改</el-button
              >
            </div>
          </div>
        </el-scrollbar>
      </div>
    </div>
    <creditFundsDialog ref="creditFundsDialog"></creditFundsDialog>
    <collectionModificationDialog
      ref="collectionModificationDialog"
    ></collectionModificationDialog>
  </PageNoScroll>
</template>
<script>
import { getPaymentRecord } from "@/request/api/collectionRecord/index";
import elementResizeDetectorMaker from "element-resize-detector";
export default {
  name: "commodityCollectionRecord",
  components: {
    creditFundsDialog: () => import("./creditFunds.vue"),
    collectionModificationDialog: () => import("./collectionModification.vue"),
  },
  data() {
    return {
      formDatas: { ordertype: "1" },
      dataS: {},
      SetHeight: 0,
    };
  },
  methods: {
    // 触发子组件编辑按钮
    handleView(form, title, record) {
      this.$refs[form].edit(record);
      this.$refs[form].title = title;
      this.$refs[form].disableSubmit = false;
      this.$refs[form].isVisiable = true;
    },
    statusF(dataS) {
      if (dataS.status == 1) {
        return "待对方确认";
      } else if (dataS.status == 2) {
        return ".待修改";
      } else if (dataS.status == 3) {
        return "待收款";
      } else if (dataS.status == 4) {
        return "未结清";
      } else if (dataS.status == 5) {
        return "已结清";
      } else if (dataS.status == 6) {
        return "已取消";
      }
    },
    payInfoLoc(item) {
      let param = [];
      let num = 0;
      if (item.cash) {
        param.push("现金：" + item.cash);
        num += parseFloat(item.cash);
      } else if (item.bank) {
        param.push("银行卡：" + item.bank);
        num += parseFloat(item.bank);
      } else if (item.aliPay) {
        param.push("支付宝：" + item.aliPay);
        num += parseFloat(item.aliPay);
      } else if (item.weChat) {
        param.push("微信：" + item.weChat);
        num += parseFloat(item.weChat);
      }
      return [num, "(" + param.toString() + "元)"];
    },
    handlerSetHeight(val) {
      const erdm = elementResizeDetectorMaker();
      erdm.listenTo(this.$refs[val], (element) => {
        setTimeout(() => {
          this.SetHeight = element.getBoundingClientRect().top;
          // this.nextTick(() => {
          //解决滚动条初始化消失的问题
          this.$refs.scrollDiv.update();
          // });
        }, 20);
      });
    },
    getInfo() {
      this.formDatas = this.$route.query;
      let rid = this.$route.query.id;
      let param = {
        orderType: 3, // 订单类型 int 1：筐子订单 2：商品订单 3：退货退款单 4：添加商品，添加入库 5:厂商自购筐子 6:退筐退款 7:筐子报废 9:配送退货 10:配送 11:配送退筐
        orderBindId: rid, //单据id，int
        tip: 2, // 1.付款记录、2.收款记录
      };
      getPaymentRecord(param).then((res) => {
        console.log(res);
        this.dataS = res.data[0];
      });
    },
  },
  created() {
    this.getInfo();
  },
  mounted() {
    this.handlerSetHeight("currentBasketDetailsTable");
  },
};
</script>

<style lang="scss" scoped>
.collectionRecordModel {
  .utable {
    width: 100%;
    // border: 1px solid #E9E9E9;
    border-top: 1px solid #e9e9e9;
    border-left: 1px solid #e9e9e9;
    border-right: 1px solid #e9e9e9;
  }
}
</style>

<style lang="scss">
.collectionRecordModel {
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