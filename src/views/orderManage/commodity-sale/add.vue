
<template>
  <!-- 填写收款信息 -->
  <Container footer class="container">
    <div class="is-"></div>
    <!-- 付款人,订单金额 -->
    <div class="container-payer">
      <div class="container-payer__row">
        <span class="label">付款人：</span>
        <span>{{ data.userName }}</span>
        <user-type :type="data.UserType"></user-type>
        <span>{{ data.userPhone }}</span>
      </div>
      <div class="container-payer__row">
        <!-- 剩余未收等于订单金额 -> 首次收款 -->
        <template v-if="data.allShouldPayPrice === data.orderPrice">
          <span>订单金额: </span>
          <span>{{ data.orderPrice }}元</span>
        </template>
        <template v-else>
          <span>未收金额: </span>
          <span>{{ data.allShouldPayPrice }}元</span>
        </template>
      </div>
    </div>
    <!-- DIVIDER -->
    <el-divider direction="horizontal"></el-divider>
    <!-- 经营往来款抵充 -->
    <!-- FIXME:散户添加收付款时，不显示经营往来款抵充 ?  -->
    <!-- 经营往来款抵充为0，且平账金额为0时不显示该选项 -->
    <!-- v-if="data.comeInPrice !== 0 || data.balancePrice !== 0" -->
    <template>
      <div class="container-current">
        <div class="label container-current__label">
          <span>经营往来款抵充</span
          ><i
            class="el-icon-question"
            style="color: #0ba198"
            @click="handleOpenTips"
          ></i>
        </div>

        <div class="container-current__check">
          <!-- isCanChecked   往来款是否可选，0：不可选，1：可选 -->
          <el-checkbox
            v-model="formData.isComeInChecked"
            :disabled="!data.isCanChecked"
          >
            <span>经营往来款抵充：</span>

            <span>{{ data.comeInPrice }}元</span></el-checkbox
          >
          <!-- 平账金额 -->
          <div class="sum-balance" v-if="formData.isComeInChecked">
            <span>平账金额：</span>
            <span>{{ data.balancePrice }}元</span>
          </div>
        </div>
      </div>
      <!-- DIVIDER -->
      <el-divider direction="horizontal"></el-divider>
    </template>
    <!-- 抵扣 都为0则不显示该模块(剩余未收+抵扣勾选组) -->
    <!-- 剩余未收金额为0 也直接隐藏 -->
    <template v-if="remaiNoReceive === 0 || !hiddenDeduction">
      <!-- 剩余未收金额 -->
      <div class="container-remain-noreceived">
        <span>剩余未收金额： </span><span>{{ remaiNoReceive }}元</span>
      </div>
      <!-- 抵扣 -->
      <div class="container-deduction">
        <div class="container-deduction__label label">其他往来款抵扣</div>
        <div class="container-deduction__checks">
          <el-checkbox-group v-model="formData.deductInfo">
            <el-checkbox label="advancePrice">
              <span>预付款：</span>
              <el-tooltip
                class="item"
                effect="dark"
                :content="data.advanceInTransit"
                placement="top"
              >
                <i class="el-icon-question" style="color: #0ba198"></i>
              </el-tooltip>
              <span>{{ data.advancePrice }}元</span></el-checkbox
            >
            <el-checkbox label="borrowPrice">
              <span>借款：</span>
              <el-tooltip
                class="item"
                effect="dark"
                :content="data.borrowInTransit"
                placement="top"
              >
                <i class="el-icon-question" style="color: #0ba198"></i>
              </el-tooltip>
              <span>{{ data.borrowPrice }}元</span>
            </el-checkbox>
            <el-checkbox label="transferOtherPrice">
              <span>转账其他：</span>
              <el-tooltip
                class="item"
                effect="dark"
                :content="data.transferInTransit"
                placement="top"
              >
                <i class="el-icon-question" style="color: #0ba198"></i>
              </el-tooltip>
              <span>{{ data.transferOtherPrice }}元</span></el-checkbox
            >
          </el-checkbox-group>
        </div>
      </div>
      <!-- DIVIDER -->
      <el-divider direction="horizontal"></el-divider>
    </template>
    <!-- 剩余需收金额为0 直接隐藏 -->
    <template v-if="remainNeedReceive > 0">
      <!-- 剩余需收金额 -->
      <div class="container-remain-needreceive">
        <div class="remain-needreceive__label">
          <span>剩余需收金额：</span>
          <span>{{ remainNeedReceive }}元</span>
        </div>
      </div>
      <!-- 赊账授信 授信额度 creditTotalAmount 存在即可展示此模块  -->
      <div class="container-credit" v-if="data.creditTotalAmount > 0">
        <div class="container-credit__label">
          赊账授信 超出赊账额度部分计入往来款，往来款没有赊账期限
        </div>
        <div class="container-credit__check">
          <!-- 是否赊账 -->
          <el-checkbox v-model="isLimitRewardOn">全部赊账 </el-checkbox>
          <!-- 剩余额度 -->
          <span class="limit-valid"
            >对方可用赊账额度：{{ data.creditRemainAmount }}元</span
          >
          <!-- 到期金额 不为0则显示 -->
          <template v-if="data.expireMoney">
            <span class="limit-expire">额度内到期金额：</span>
            <span>{{ data.expireMoney }}元</span>
          </template>
        </div>
      </div>
      <!-- 实际收款 -->
      <div class="container-actual" v-if="!isLimitRewardOn">
        <div class="container-actual__label">实际收款</div>
        <div class="container-actual__groups">
          <el-form
            ref="payFormRef"
            :model="formData"
            label-width="120px"
            label-suffix=":"
            inline-message
            :rules="payFormRules"
            size="mini"
          >
            <el-form-item label="本次收款金额">
              <!--    prefix-icon="el-icon-date" -->
              <el-input
                v-model="receiveTotal"
                @input="onReceiveTotalInput"
                @change="validatePay"
              ></el-input>
              <!-- # 允许的支付方式 allowPayType ，0：不允许支付，1：只允许线下，2：只允许线上，3：允许线上和线下 -->
              <template
                v-if="data.allowPayType === 2 || data.allowPayType === 3"
              >
                <el-checkbox
                  v-model="formData.isHaveOnlinePay"
                  @change="onOnlineCheckedChange"
                  >线上收款
                </el-checkbox>
              </template>
              <template
                v-if="data.allowPayType === 1 || data.allowPayType === 3"
              >
                <el-checkbox
                  v-model="formData.isHaveOfflinePay"
                  @change="onOfflineCheckedChange"
                  >线下收款</el-checkbox
                >
              </template>
            </el-form-item>
            <el-form-item label="线上收款" v-if="formData.isHaveOnlinePay">
              <!-- 线上方式键值 onlineReceiptValue -->
              <el-input
                v-model="onlineReceiptValue"
                @input="onOnlineReceiptInput"
                @change="validatePay"
              ></el-input>
              <!-- 线上方式键名 onlineReceiptKey -->
              <!-- 销售单 平台 非首次 -> 线下收款方式: 只有 `现金` -->
              <el-radio-group v-model="onlineReceiptKey">
                <el-radio
                  v-for="key in onlineReceiptWaysMap.keys()"
                  :key="key"
                  :label="onlineReceiptWaysMap.get(key).en"
                  >{{ onlineReceiptWaysMap.get(key).zh }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
            <el-form-item label="线下收款" v-if="formData.isHaveOfflinePay">
              <template v-for="key in offlineReceiptWaysMap.keys()">
                <el-checkbox
                  :key="key"
                  v-if="filterOfflineReciptWay(key)"
                  v-model="payWayCheckedMap[offlineReceiptWaysMap.get(key).en]"
                  @change="
                    (value) =>
                      onOfflineReceiptCheckedChange(
                        value,
                        offlineReceiptWaysMap.get(key).en
                      )
                  "
                  >{{ offlineReceiptWaysMap.get(key).zh }}
                </el-checkbox>
              </template>
            </el-form-item>
            <template v-for="key in offlineReceiptWaysMap.keys()">
              <el-form-item
                :key="key"
                :label="offlineReceiptWaysMap.get(key).zh"
                v-if="payWayCheckedMap[offlineReceiptWaysMap.get(key).en]"
              >
                <el-input
                  v-model="formData.payWay[offlineReceiptWaysMap.get(key).en]"
                  @input="
                    (value) =>
                      onOfflineReceiptInput(
                        value,
                        offlineReceiptWaysMap.get(key).en
                      )
                  "
                  @change="
                    (value) =>
                      onOfflineReceiptChange(
                        value,
                        offlineReceiptWaysMap.get(key).en
                      )
                  "
                ></el-input>
              </el-form-item>
            </template>
            <el-form-item label="" size="normal" prop="pay"> </el-form-item>
          </el-form>
        </div>
      </div>
      <!-- 收款凭证 勾选线下收款 展示 -->
      <div class="container-voucher" v-if="formData.isHaveOfflinePay">
        <div class="container-voucher__label">收款凭证:</div>
        <div class="container-voucher__upload">
          <ImageListUpload :image-list="formData.credentialsImageUrls" />
        </div>
      </div>
      <!-- 运输信息 -->
      <!-- 1.线上付款 2.订单金额大于10w 3.运输图片少于3张 -->
      <!-- 接口字段返回 isHaveTransfer 是否需要展示运输信息 结合 是否勾选线上付款 展示此模块 -->
      <div class="container-transport" v-if="showTransport">
        <div class="container-transport__label">运输信息</div>
        <div class="container-transport__form">
          <el-form
            ref="transferFormRef"
            :model="formData"
            label-width="140px"
            label-position="left"
            label-suffix=":"
            :rules="transferRules"
            size="small"
          >
            <el-form-item class="number" label="车牌号" prop="transferNumber">
              <!-- 输入车牌号 -->
              <el-input
                v-model="formData.transferNumber"
                placeholder="请输入"
                size="mini"
                clearable
              >
                <template slot="prepend">
                  <select-area :area.sync="formData.transferArea"></select-area>
                </template>
              </el-input>
              <!-- 选择车牌号 -->
              <div class="choose-list">
                <div
                  class="choose-list__item"
                  :class="{
                    active:
                      formData.transferArea + formData.transferNumber ===
                      '沪A12345',
                  }"
                  @click="handleChoosePlate('沪A12345')"
                >
                  沪A123456
                </div>
              </div>
            </el-form-item>

            <el-form-item class="photo" prop="transferImageUrls">
              <template #label>
                <span>车辆照片({{ formData.transferImageUrls.length }}/3)</span>
                <!-- DOUBT: -->
                <!-- <i slot="reference" class="el-icon-warning-outline"> </i> -->
                <span>:</span>
              </template>
              <div class="tips">
                订单金额≥10万元,线上收款需上传车牌/车辆/货物照片车牌号需与照片信息一致
              </div>
              <ImageListUpload
                :image-list.sync="formData.transferImageUrls"
                :limit="3"
              />
              <!-- 选择线上收款，线上收款金额≥10万元，销售单车辆照片小于3张时显示 -->
            </el-form-item>
          </el-form>
        </div>
      </div>
    </template>
    <!-- 备注 -->
    <div class="container-remark">
      <div class="container-remark__label">备注</div>
      <div class="container-remark__input">
        <el-input
          v-model="formData.remark"
          type="textarea"
          :autosize="{ minRows: 5, maxRows: 10 }"
          maxlength="200"
          show-word-limit
          placeholder="请输入内容"
        />
      </div>
    </div>

    <template #footer>
      <div class="footer-text">
        <span>本次收款合计：{{ actualPay }}元 </span
        ><span class="footer-text__credit">{{ limitCreditText }}</span>
      </div>
      <div class="footer-action">
        <!-- 选择了线上支付 -->
        <el-button
          v-if="formData.isHaveOnlinePay"
          size="mini"
          @click="handleSubmit"
          >扫码收款</el-button
        >
      </div>
      <!-- 选择了线上支付 -->
      <!-- FIXME: v-if="formData.isHaveOfflinePay" -->
      <div class="footer-action">
        <el-button type="primary" size="mini" @click="handleSubmit"
          >确认发送</el-button
        >
      </div>
    </template>
    <!-- 密码输入弹框 -->
    <Pwd ref="pwdRef" @success="handlePay" />
    <!-- 收款码弹框 -->
    <Code ref="codeRef" @success="handlePay" />
    <!-- 经营往来款 TIPSINFO  -->
    <Tips ref="tipsRef" />
  </Container>
</template>

<script>
/* 平台销售单:首次 */
/* 平台销售单:非首次 1.仅选择线下时 输入的是 收款码 */
import {
  newPayLoad,
  agreePayment,
  getBalancePay,
} from "@/request/api/addCollection/index";
import { getToken } from "@/utils/auth";

import Pwd from "../components/Pwd";
import Code from "../components/Code";
import SelectArea from "../components/SelectArea";
import Tips from "../components/Tips";

import {
  offlineReceiptWaysMap,
  onlineReceiptWaysMap,
  receiptWayTypeMap,
} from "@/utils/map";
import {
  transformImgListToFileList,
  transformFileListToRawList,
  splitOnlineImgAndLocalImg,
  transformFileListToImgList,
} from "@/utils/image-upload";

import _ from "lodash";

export default {
  nameL: "AddCommoditySale",
  components: { Pwd, Code, SelectArea, Tips },
  inject: ["$baseMessage"],
  data() {
    return {
      alreadyInit: false, //是否已初始化
      onlineReceiptValue: "", // 100
      onlineReceiptKey: Array.from(onlineReceiptWaysMap.values())[0].en, //线上收款 默认勾选第一项
      // 收款总和:"",
      receiveTotal: "",
      // 是否勾选 控制相应输入框显示/隐藏
      payWayCheckedMap: {
        cash: false,
        weChat: false,
        aliPay: false,
        bankCard: false,
      },
      onlineReceiptWaysMap,
      offlineReceiptWaysMap,
      isLimitRewardOn: false, //是否赊账
      transferRules: {
        transferNumber: [
          {
            required: true,
            message: "请填写完整车牌号",
            trigger: ["blur", "change"],
          },
          {
            pattern: /^[A-Z0-9]{6}$/,
            message: "请填写合法车牌号",
            trigger: ["blur", "change"],
          },
          {
            // 校验车牌 省
            validator: this.transferNumberValidator,
          },
        ],
        transferImageUrls: [
          {
            required: true,
            message: "上传的车牌货物照片不得少于3张",
            trigger: ["blur", "change"],
          },
          {
            validator: this.transferImageUrlsValidator,
          },
        ],
      },
      payFormRules: {
        pay: [
          {
            validator: this.payValidator,
          },
        ],
      },

      formData: {
        pay: "", //占用form-item 校验
        payWay: {
          cash: "",
          weChat: "",
          aliPay: "",
          bankCard: "",
          lakalaCollection: "",
        },
        remark: "",
        credentialsImageUrls: [],
        transferImageUrls: [],
        deductInfo: [],
        isHaveOnlinePay: false,
        isHaveOfflinePay: false,
        // ---
        isComeInChecked: false,
        creditPriceIs: false,
        isHaveOnlinePayNum: "",
        transferArea: "", //湘A
        transferNumber: "",
      },

      data: { creditTotalAmount: 0, creditRemainAmount: 0 },
    };
  },
  computed: {
    isP() {
      return Number(this.$route.query.isP);
    },
    isF() {
      return Number(this.$route.query.isF);
    },
    /**
     * @description: 未收款总数 需要收款的总数(订单总额/剩余未支付款)
     */
    totalNeedReceive() {
      const { orderPrice, allShouldPayPrice } = this.data;
      return orderPrice === allShouldPayPrice ? orderPrice : allShouldPayPrice;
    },
    /**
     * @description: 剩余未收
     */
    remaiNoReceive() {
      const { comeInPrice } = this.data;
      const { isComeInChecked } = this.formData;
      const res = this.totalNeedReceive - (isComeInChecked ? comeInPrice : 0);
      console.log("=res>", res);

      return res > 0 ? res : 0;
    },

    /**
     * @description: 剩余需收:剩余未收(总金额-经营往来款抵充)-其他往来款抵扣不为0时，显示剩余需收金额
     */
    remainNeedReceive() {
      const res =
        this.remaiNoReceive !== 0
          ? this.remaiNoReceive -
            (this.hiddenDeduction ? 0 : this.checkedDeduction)
          : 0; //抵扣全为0 直接代入0
      return res > 0 ? res : 0;
    },
    /**
     * @description: 下方 未收金额(预付款,借款,转账其他) 勾选的总和
     */
    checkedDeduction() {
      const { deductInfo } = this.formData;
      return deductInfo.reduce((pre, cur) => {
        return pre + this.data[cur];
      }, 0);
    },
    /**
     * @description: 是否隐藏其他来往抵扣 均为0则隐藏
     */
    hiddenDeduction() {
      const deductKeys = ["advancePrice", "borrowPrice", "transferOtherPrice"];
      return deductKeys.map((_) => this.data[_]).every((x) => x === 0);
    },
    /**
     * @description: pay input 总和 (线上收款+现金+...)
     */
    payInputTotal() {
      const { isHaveOfflinePay, isHaveOnlinePay } = this.formData;

      let payTotal = 0;
      if (isHaveOnlinePay) {
        payTotal += Number(this.onlineReceiptValue);
      }
      if (isHaveOfflinePay) {
        payTotal += Object.values(this.formData.payWay).reduce(
          (pre, cur) => pre + Number(cur),
          0
        );
      }
      return payTotal;
    },
    /**
     * @description:  实付款
     */
    actualPay() {
      // 判断剩余需收金额
      let sum = 0;

      // 判断 剩余未收 剩余需收
      if (this.remaiNoReceive === 0 || this.remainNeedReceive === 0) {
        return sum;
      }

      // 赊账
      if (this.remainNeedReceive > 0 && this.isLimitRewardOn) {
        return sum;
      }

      // const { isHaveOnlinePay, isHaveOfflinePay } = this.formData;

      // // 线上付款
      // if (isHaveOnlinePay) {
      //   sum += Number(this.onlineReceiptValue);
      // }

      // // 线下付款
      // if (isHaveOfflinePay) {
      //   sum += Object.values(this.formData.payWay).reduce(
      //     (pre, cur) => pre + Number(cur),
      //     0
      //   );
      // }

      sum += Number(this.receiveTotal);

      return sum;
    },
    /**
     * @description: 已选择的支付方式 例:[1,2,4,5]
     */
    actualPayTypes() {
      const { isHaveOnlinePay, isHaveOfflinePay } = this.formData;
      // receiptWayNumberMap
      const res = [];
      // 已勾选线上付款
      if (isHaveOnlinePay) {
        // 手动添加 拉卡拉 lakalaCollection 5
        res.push(5);
      }
      // 已勾选
      if (isHaveOfflinePay) {
        for (const way in this.payWayCheckedMap) {
          const isChecked = this.payWayCheckedMap[way];
          if (isChecked) {
            // 获取对应type字典值
            const checkedWayType = receiptWayTypeMap.get(way);
            res.push(checkedWayType);
          }
        }
      }

      return res;
    },
    /**
     * @description: 选择线上收款，线上收款金额≥10万元，销售单车辆照片小于3张时显示 `运输信息`
     */
    showTransport() {
      const { isHaveOnlinePay } = this.formData;
      const { isHaveTransfer } = this.data;

      // return (
      //   isHaveOnlinePay &&
      //   this.onlineReceiptValue > 100000 &&
      //   transferImageUrls.length < 3
      // );

      return isHaveTransfer && isHaveOnlinePay;
    },

    /**
     * @description: 下方 额度外授信 FIXME:分五种情况组织
     */
    limitCreditText() {
      // remainNeedReceive 剩余需收
      const { creditRemainAmount, creditTotalAmount } = this.data;

      // 开启赊账
      if (this.isLimitRewardOn) {
        // 使用部分授信额度
        if (
          this.remainNeedReceive > creditRemainAmount &&
          creditRemainAmount !== 0
        ) {
          // 需收款 > 剩余额度
          return `(未收金额${
            this.totalNeedReceive
          }元,使用额度内授信${creditRemainAmount}元,额度外授信${
            this.remainNeedReceive - creditRemainAmount
          }元)`;
        } else if (creditRemainAmount === 0) {
          // 剩余额度已用完
          return `未收金额${this.totalNeedReceive}元，使用额度外授信${this.remainNeedReceive}元`;
        } else if (
          this.remainNeedReceive < creditRemainAmount &&
          creditRemainAmount !== 0
        ) {
          // 全部使用授信额度
          return `未收金额${this.totalNeedReceive}元，使用额度内授信${this.remainNeedReceive}元`;
        }
      } else {
        // 未设置赊账授信
        if (creditTotalAmount === 0) {
          return `(未收金额${this.totalNeedReceive}元)`;
        }
        // 超收
        if (receiveTotal > this.remainNeedReceive) {
          return `(超收${
            receiveTotal - this.remainNeedReceive
          }元计入经营往来款)`;
        }
      }
      return 0;
    },
  },
  methods: {
    /**
     * @description: 根据场景不同 显示对应的线下收款方式(平台非首次 当只选择线下付款时 只展示 `现金`)
     * @param key
     * @return 是否显示当前key
     */
    filterOfflineReciptWay(key) {
      const en = this.offlineReceiptWaysMap.get(key).en;

      if (this.isP && !this.isF) {
        // 平台非首次 -> 只有现金
        return en === "cash";
      }

      return true;
    },
    /**
     * @description: 初始化请求 页面数据
     */
    async init() {
      const { fromuser, id, isF, isP } = this.$route.query;
      console.log("isF=>", isF, typeof isF);

      const body = {
        payUserId: fromuser, //# 付款人UserId（当前用户传"",非平台传"姓名,手机号"）
        toUserId: "", //# 收款人UserId（当前用户传"",非平台传"姓名,手机号"）
        orderInfo: [
          { orderId: id, orderType: 1 },
        ] /*  orderType 1--销售单采购单 2--筐子采购单销售单 3--退货退款单 4--退筐退款单 5--进货单  7--筐子自购  8--筐子报废单  */,
        loadType: !Number(isP) ? 0 : Number(isF), //# 0--不是 买家首次确认付款  1--是买家首次确认付款(只有平台首次为1)
        //   isReturn: 0, //# 0 不退货 1 退货 目前仅应用于 orderType 等于 5 进货单
      };
      const { status, data } = await newPayLoad(body);
      if (status == 200) {
        console.log("init=>", data);

        // 1.更改key 方便后续操作
        const {
          advancePayment: advancePrice,
          borrowingPrice: borrowPrice,
          transferPrice: transferOtherPrice,
          transferImageUrls,
          ...rest
        } = data;

        this.data = {
          advancePrice,
          borrowPrice,
          transferOtherPrice,
          ...rest,
          // TEST
          // borrowPrice: 1400,
        };
        // 侧视图 https://img0.baidu.com/it/u=1562650058,2452872534&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1685466000&t=8f4c29f587b0e0f020e99bf96587bde6
        // 2.格式化相应图片字段
        // this.formData.transferImageUrls =
        //   transformImgListToFileList(transferImageUrls);
        this.formData.transferImageUrls = transformImgListToFileList([
          "https://img0.baidu.com/it/u=1562650058,2452872534&fm=253&app=138&size=w931&n=0&f=JPEG&fmt=auto?sec=1685466000&t=8f4c29f587b0e0f020e99bf96587bde6",
        ]);

        // 3.设置本次收款金额默认值
        const { allShouldPayPrice } = this.data;
        this.receiveTotal = allShouldPayPrice;

        // 4.获取平账金额
        const {
          data: [{ balancePrice }],
        } = await getBalancePay(body);

        console.log("此订单 平账金额 =>", balancePrice);

        this.data.balancePrice = balancePrice;
      }

      //
      this.alreadyInit = true;
    },
    /**
     * @description: 选择 历史车牌
     * @param plate 车牌 例:湘A8765E
     */
    handleChoosePlate(plate) {
      const area = plate.substr(0, 1);
      const num = plate.substr(1);
      this.formData.transferArea = area;
      this.formData.transferNumber = num;
      //
      // this.transferFormRef.validateField("transferNumber");
    },
    /**
     * @description:  打开 Tips
     */
    handleOpenTips() {
      this.$refs.tipsRef.show();
    },

    validatePay() {
      console.log("=>", "validate pay input  ~");

      this.$refs.payFormRef.validateField("pay");
    },
    /**
     * @description:  收款总额 input 事件
     * @param value 当前值
     */
    onReceiveTotalInput(value) {
      console.log("=>", value, this.remaiNoReceive);

      // 大于所需金额
      if (Number(value) > this.remaiNoReceive) {
        console.log("不需要这么多=>");

        this.receiveTotal = this.remainNeedReceive;
      }
    },
    /**
     * @description: 线下付款方式勾选 控制input显示/隐藏 change 事件
     * @param value 当前值
     * @param key 付款方式
     */
    onOfflineReceiptCheckedChange(value, key) {
      console.log("onOfflineReceiptCheckedChange=>", value, key);

      //  取消勾选时重置下面所有input

      if (!value) {
        this.resetOfflineReceiptWayInput();
      } else {
        // 没有值的 进行填充
        const noValueOfflineReceiptWays = this.getNoValueOfflineReceiptWays();

        noValueOfflineReceiptWays.forEach((way) => {
          console.log("没有值的 =>", way);
          const diff = this.getTargetOfflineDiff(way);
          // console.log("=>", "所需diff", diff);
          this.formData.payWay[way] = diff;
        });
      }

      // validate form
      this.validatePay();
    },
    /**
     * @description: 线上收款 值input 事件
     * @param value 当前值
     * @param key 付款方式
     */
    onOnlineReceiptInput(value) {
      // 是否勾选线下付款
      const { isHaveOfflinePay } = this.formData;
      let payTotal = 0;
      if (isHaveOfflinePay) {
        payTotal += Object.values(this.formData.payWay).reduce(
          (pre, cur) => pre + Number(cur),
          0
        );
      }
      const diff = Number(this.receiveTotal) - payTotal;

      if (value > diff) {
        console.log("=>", "太大啦");

        this.onlineReceiptValue = diff;
      }
    },
    /**
     * @description: 线下付款方式input 事件
     * @param value 当前值
     * @param key 付款方式
     */
    onOfflineReceiptInput(value, key) {
      console.log("onOfflineReceiptInput=>", value, key);
      // 计算前面的总额 如果输入大于需要的收款 直接变成需要的数字

      // 本次收款金额 receiveTotal

      const diff = this.getTargetOfflineDiff(key);

      console.log("=>", "所需diff", diff);

      if (value > diff) {
        console.log("=>", "太大啦");

        this.formData.payWay[key] = diff;
      }
    },
    /**
     * @description: 线下付款方式 change 事件
     * @param value 当前值
     * @param key 付款方式
     */
    onOfflineReceiptChange(value, key) {
      console.log("onOfflineReceiptChange=>", value, key);
      // 判断最后一个没有值的输入框  直接补全 (包括自己)

      const receiptWayWithoutValue = this.getNoValueOfflineReceiptWays();

      console.log("receiptWayWithoutValue =>", receiptWayWithoutValue);

      if (receiptWayWithoutValue.length === 1) {
        const [theReceiptWay] = receiptWayWithoutValue;
        // 自动补全

        this.formData.payWay[theReceiptWay] =
          this.getTargetOfflineDiff(theReceiptWay);
        console.log("=>", "需要补全", this.getTargetOfflineDiff(key));
      }

      //
      // validate form
      this.validatePay();
    },
    /**
     * @description: 获取线下 没有填入值的支付方式
     */
    getNoValueOfflineReceiptWays() {
      const payWayCheckedMap = this.getPayWayCheckedMapWithOriginOrder();
      const checkedKeys = Object.keys(payWayCheckedMap).filter((_) =>
        Number(payWayCheckedMap[_])
      );

      return checkedKeys.filter((key) => !this.formData.payWay[key]);
    },

    /**
     * @description: 获取线下目标key 的 diff num
     * @param  key 付款方式
     */
    getTargetOfflineDiff(key) {
      // 是否勾选线上付款
      const { isHaveOnlinePay } = this.formData;

      let payTotal = 0;

      if (isHaveOnlinePay) {
        //
        payTotal += Number(this.onlineReceiptValue);
        console.log("online=>", this.onlineReceiptValue);
      }
      //
      const otherOffline = this.getOfflineTotalExcludesTargetWay(key);

      console.log("otherOffline=>", otherOffline);

      payTotal += otherOffline;

      const diffNumber = Number(this.receiveTotal) - payTotal;

      return diffNumber;
    },
    /**
     * @description: 获取除了目标key之外的线下付款总和
     * @param {*} key 付款方式
     * @return { number }
     */
    getOfflineTotalExcludesTargetWay(key) {
      return Object.keys(this.formData.payWay).reduce(
        (pre, cur) =>
          cur === key ? pre : pre + Number(this.formData.payWay[cur]),
        0
      );
    },
    /**
     * @description: 重置所有 线下付款input
     */
    resetOfflineReceiptWayInput() {
      Array.from(offlineReceiptWaysMap.values())
        .map(({ en }) => en)
        .forEach((way) => {
          this.formData.payWay[way] = "";
        });
    },
    /**
     * @description: 获取原始顺序的payWayCheckedMap
     */
    getPayWayCheckedMapWithOriginOrder() {
      const originOrder = Object.keys(this.$options.data().payWayCheckedMap);
      return originOrder.reduce(
        (pre, cur) => ((pre[cur] = this.payWayCheckedMap[cur]), pre),
        {}
      );
    },
    /**
     * @description: 进行表单校验
     */
    async handleValidate() {
      // 如果 经营款抵充/抵扣款抵充
      if (this.remainNeedReceive <= 0) {
        return true;
      }
      // 未赊账 需要实付款
      if (!this.isLimitRewardOn) {
        // 校验实际收款
        try {
          await this.$refs.payFormRef.validate();

          if (this.showTransport) {
            // 校验运输
            await this.$refs.transferFormRef.validate();
          }

          return true;
        } catch (error) {
          return false;
        }
      }

      return true;
    },
    /**
     * @description:  下方按钮 提交事件
     */
    async handleSubmit() {
      // this.$baseMessage("哈哈哈~~", "success", "admin-hey-message-success");
      // validate

      const isValid = await this.handleValidate();

      // 校验不通过
      if (!isValid) {
        console.log("=>", "valid", "校验不通过");
        return;
      }

      console.log("=>", "valid", "校验通过");

      // 平台首次 非平台非首次/首次 开始一轮校验
      if ((this.isP && this.isF) || (!this.isP && (!this.isF || this.isF))) {
        // 1.是否设置支付密码
        const { isSetPayWord } = this.$store.getters.userInfo;
        console.log("isSetPayWord=>", isSetPayWord);

        try {
          if (!isSetPayWord) {
            // 1.未设置支付密码
            await this.$confirm(
              "您还未设置付款/收款密码，无法付款/收款",
              "提示",
              {
                confirmButtonText: "设置密码",
                cancelButtonText: "关闭",
                type: "info",
              }
            );
            this.$route.push("/personalCenter/passwordSettings?active=2");
          }
          // 2.库存量 暂时略过 已和后端xs沟通

          /* 开启授信 */
          if (this.isLimitRewardOn) {
            // 3.授信额度(累计授信超额) 累计授信:此次授信+之前的授信
            if (
              this.remainNeedReceive +
                (this.data.creditTotalAmount -
                  this.data.creditcreditRemainAmount) >
              this.data.creditTotalAmount
            ) {
              await this.$confirm(
                `本次授信金额${this.remainNeedReceive}元累计授信${
                  this.remainNeedReceive +
                  (this.data.creditTotalAmount -
                    this.data.creditcreditRemainAmount)
                }元，超出了您对该客户设置的授信金额${
                  this.data.creditTotalAmount
                }元，是否确认发送？，无法付款/收款`,
                "提示",
                {
                  confirmButtonText: "确认",
                  cancelButtonText: "取消",
                  type: "info",
                }
              );
            }
            // 4.授信额度(单笔授信超额) 此次授信金额 > 单笔额度
            if (this.remainNeedReceive > this.data.creditOneAmount) {
              await this.$confirm(
                `本次授信金额${this.remainNeedReceive}元,超出了您对客户设置的最大单笔授信金额${this.data.creditOneAmount}元，是否确认发送？`,
                "提示",
                {
                  confirmButtonText: "确认",
                  cancelButtonText: "取消",
                  type: "info",
                }
              );
            }
          }
          // 校验通过
          this.$refs.pwdRef.show();
        } catch (error) {
          console.log("cancel =>", error);
        }
      } else if (this.isP && !this.isF) {
        // 平台非首次
        // 1.校验是否只有线下付款 打开的弹框 -> 密码/付款码
        const { isHaveOnlinePay, isHaveOfflinePay } = this.formData;
        if (!isHaveOnlinePay && isHaveOfflinePay) {
          // 打开付款码弹窗
          this.$refs.codeRef.show();
        }
      }

      // FIXME:
      // const {isHaveOfflinePay}
      // if (this.isP && !this.isF && ()) {
      //   // 平台 非首次 仅选择线下付款
      //   this.$refs.codeRef.show();
      // } else {

      // }
    },
    /**
     * @description: 支付请求
     * @param
     */
    async handlePay(payload = {}) {
      const { code } = payload;

      const { fromuser, id } = this.$route.query;

      const {
        isComeInChecked,
        isHaveOnlinePay,
        deductInfo,
        credentialsImageUrls,
        transferArea,
        transferNumber,
        transferImageUrls,
        remark,
        payWay,
      } = this.formData;

      const { comeInPrice, advancePrice, borrowPrice, transferOtherPrice } =
        this.data;

      if (isHaveOnlinePay) {
        payWay["lakalaCollection"] = this.onlineReceiptValue;
      }

      const body = {
        payUserId: fromuser, // 付款方 payUserId（当前用户传"",非平台传"姓名,手机号"）
        toUserId: "", // 收款方 toUserId（当前用户传"",非平台传"姓名,手机号"）
        payPrice: this.actualPay, // 支付金额   没有传0
        isComeInChecked: Number(isComeInChecked), // 往来款是否勾选 0 未勾选 1 已勾选
        credentialsImageUrls: transformFileListToRawList(credentialsImageUrls),
        creditPrice: this.isLimitRewardOn ? this.remainNeedReceive : 0, // 赊账金额 (订单-经营往来款-其他抵扣)  没有传0
        payType: this.actualPayTypes.toString(), //# 付款类型   1.现金 2，微信 3.支付宝 4.银行卡 5.拉卡拉线上付款 6.卖家现金收款 7.二维码收款 必传
        comeInPrice: this.isComeInChecked ? comeInPrice : 0, // 往来款抵扣金额   没有传0
        advancePrice: deductInfo.includes("advancePrice") ? advancePrice : 0, // 预付款 传全部 现无需计算
        borrowPrice: deductInfo.includes("borrowPrice") ? borrowPrice : 0, // 借出款金额  传全部 现无需计算
        transferOtherPrice: deductInfo.includes("transferOtherPrice")
          ? transferOtherPrice
          : 0, // 转账其他    传全部 现无需计算
        deductInfo: deductInfo, // 对应上面 借出、转账其他、预付款字段 勾选顺序 全不勾选 传[]
        type: this.isP ? (this.isF ? 1 : 2) : 5, // 1 首次添加收款信息（平台） 2  非首次填写收款信息（平台） 3 非首次添加付款信息（包含批量支付)、退货、退筐 退款卖家支付退款 （平台） 4 添加付款（非平台） 5 添加收款（非平台） 6 平台二维码收款 必传
        isHaveOnlinePay: Number(isHaveOnlinePay),
        credentialsImageUrls: transformFileListToRawList(credentialsImageUrls), // 支付凭证图片  选填
        transferArea, // 车牌号地区   新增字段
        transferNumber, // 车牌号       新增字段
        transferImageUrls: transformFileListToRawList(
          splitOnlineImgAndLocalImg(transferImageUrls)[1]
        ), // 运输车图片 新增字段
        transferImageUrlsList: transformFileListToImgList(
          splitOnlineImgAndLocalImg(transferImageUrls)[0]
        ), // 运输车图片 链接 新增字段
        code: this.isP && !this.isF ? code : "", // 四位收款码  type 为 2 必填  否则传 ""
        token: getToken(), // 必传
        remark, // 付款备注
        isReturnProduct: 0, // 退货退款单 修改为 仅退款 情况该字段传 1  其他情况 可传 0 或者 不传
        orderInfo: [
          {
            orderId: id, // 订单主键id #必传
            orderType: 1, // 1--采购单  2--筐子采购单  3--退货退款单  4--退筐退货单 5--进货单 7--筐子自购单 10--筐子报废单 #必传
          },
        ],
        payWay: _.pickBy(payWay) /* payWay字段:空的不传 */,
      };

      console.log("提交支付=>", body);

      const { status, msg } = await agreePayment(this.$useFormData(body));

      if (status === 200) {
        // 弹窗提示
        await this.$confirm("销售单发送成功", "提示", {
          confirmButtonText: "确定",
          showCancelButton: false,
          type: "success",
        });
        // 前往详情页
        this.$closePage();
      } else {
        // 弹窗提示
        this.$confirm(msg, "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "",
          type: "info",
        });
      }
    },

    /**
     * @description: 是否勾线上付款
     * @param value 当前值
     * @remark 非平台 无论首次或再次，只能线上线下二选一
     */
    onOnlineCheckedChange(value) {
      // 取消勾选线下付款时 重置下面所有方式的input显示
      if (!value) {
        this.onlineReceiptValue = 0;
      } else {
        if (!this.isP && this.formData.isHaveOfflinePay) {
          // 清空线下收款
          this.formData.isHaveOfflinePay = false;
          //
          this.resetOfflineReceiptWayInput();
        }
        // 勾选
        // 1. 线下付款未勾选的时候
        if (!this.formData.isHaveOfflinePay) {
          // 赋值剩余需收款
          this.onlineReceiptValue = this.remainNeedReceive;
        }
      }

      // validate form
      this.validatePay();
    },
    /**
     * @description: 是否勾选线下付款
     * @param value 当前值
     * @remark 非平台 无论首次或再次，只能线上线下二选一
     */
    onOfflineCheckedChange(value) {
      if (!value) {
        this.payWayCheckedMap = this.$options.data().payWayCheckedMap;
      }

      if (value && !this.isP && this.formData.isHaveOnlinePay) {
        this.formData.isHaveOnlinePay = false;
      }
      // validate form
      this.validatePay();
    },
    transferNumberValidator(rule, value, callback) {
      const { transferArea } = this.formData;
      if (!transferArea) {
        callback(new Error("请填写完整车牌号"));
      } else {
        callback();
      }
    },
    transferImageUrlsValidator(rule, value, callback) {
      if (value.length < 3) {
        callback(new Error("上传的车牌货物照片不得少于3张"));
      } else {
        callback();
      }
    },
    payValidator(rule, value, callback) {
      //  校验收款表单逻辑
      if (Number(this.onlineReceiptValue) > this.remainNeedReceive) {
        // 校验 线上收款 不得高于 剩余需收
        callback(new Error("线上收款金额不可大于剩余需收金额"));
      } else if (this.payInputTotal > Number(this.receiveTotal)) {
        callback(new Error("收款类型金额之和不可大于本次收款金额"));
      } else if (this.payInputTotal < Number(this.receiveTotal)) {
        callback(new Error("收款类型金额之和不等于本次收款金额"));
      } else {
        callback();
      }
    },
  },
  watch: {
    // transferArea change
    "formData.transferArea": function () {
      console.log("=>", "formData.transferArea changed");

      if (this.alreadyInit) {
        this.$refs.transferFormRef.validateField("transferNumber");
      }
    },
    "formData.transferImageUrls": function () {
      console.log("=>", "formData.transferImageUrls changed");
      // 避免初始化获取报错
      if (this.alreadyInit) {
        this.$refs.transferFormRef.validateField("transferImageUrls");
      }
    },
    //是否赊账
    // "data.isLimitRewardOn": function (newValue) {
    //   // 设置 本次收款金额  默认值
    //   const { allShouldPayPrice, comeInPrice } = this.data;
    //   if (newValue) {
    //     // 重置
    //     this.receiveTotal = "";
    //   } else {
    //     this.receiveTotal = allShouldPayPrice - comeInPrice;
    //   }
    // },
  },
  created() {
    this.init();
  },
};
</script>

<style lang="scss" scoped>
// @include DEBUG();
.container {
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(1, 6, 33, 0.898);
  line-height: 22px;
  //分割线
  /deep/ .el-divider--horizontal {
    margin: 16px 0;
  }
  // tooltip
  /deep/.el-tooltip {
    margin: 0 3px;
  }
  // 标题
  .label {
    color: rgba(1, 6, 33, 0.55);
  }

  //付款人信息
  .container-payer {
    .container-payer__row:not(:last-of-type) {
      margin-bottom: 16px;
    }
  }
  // 经营往来款
  .container-current {
    .container-current__label {
      margin-bottom: 8px;
    }
    .container-current__check {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      background: rgba(1, 6, 33, 0.0196);
      border-radius: 2px 2px 2px 2px;
      padding: 18px 16px;
      .sum-balance {
        margin-left: 30px;
        color: #dd4c4d;
      }
    }
  }
  // 剩余未收
  .container-remain-noreceived {
    margin-bottom: 15px;
  }
  // 抵扣
  .container-deduction {
    &__checks {
      background: rgba(1, 6, 33, 0.0196);
      border-radius: 2px 2px 2px 2px;
      padding: 18px 16px;
    }
  }
  // 全部赊账
  .container-credit {
    &__label {
      color: #0106218c;

      margin-bottom: 8px;
    }
    &__check {
      /deep/ .el-checkbox {
        color: rgba(1, 6, 33, 0.898);
      }
      background: rgba(1, 6, 33, 0.0196);
      border-radius: 2px 2px 2px 2px;
      padding: 18px 16px;

      .limit-valid {
        color: rgba(1, 6, 33, 0.55);
        margin-left: 48px;
        margin-right: 32px;
      }
      // .limit-expire {
      // }
    }
  }
  // 剩余需收
  .container-remain-needreceive {
    .remain-needreceive__label {
      margin-bottom: 15px;
    }
  }
  // 实付款
  .container-actual {
    &__label {
      margin-bottom: 8px;
    }
    &__groups {
      background: rgba(1, 6, 33, 0.0196);
      border-radius: 2px 2px 2px 2px;
      padding: 18px 16px;
      margin-bottom: 16px;
      /deep/ .el-form {
        .el-form-item:nth-last-of-type(2) {
          margin-bottom: 0;
        }
        .el-input {
          width: 150px;
          margin-right: 15px;

          input {
            font-weight: bold;
            letter-spacing: 1px;
          }
        }
        & > .el-form-item:last-of-type {
          margin-bottom: 0;
        }
      }
    }
  }
  // 收款凭证
  .container-voucher {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 24px;
    &__label {
      margin-right: 10px;
    }
  }
  // 运输信息
  .container-transport {
    &__label {
      font-size: 16px;
      font-weight: 500;
      font-family: PingFang SC-Medium, PingFang SC;
      color: rgba(1, 6, 33, 0.9);
      margin-bottom: 16px;
    }
    &__form /deep/ {
      .el-form-item {
        .el-form-item__label {
          font-size: 14px;
          font-family: PingFang SC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(1, 6, 33, 0.898);
          line-height: 22px;
        }
      }
      .el-form-item.number {
        .el-input {
          width: 300px;
          margin-bottom: 12px;
          > .el-input-group__prepend {
            padding: 0 10px;
            padding: 0 20px;
            .el-button {
              width: 66px;
              padding: 10px;

              > span {
                display: flex;
                span {
                  flex: 2;
                  text-align: center;
                }
                i {
                  flex: 1;
                }
              }
            }
          }
        }

        .choose-list {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .choose-list__item:not(:last-of-type) {
            margin-right: 8px;
          }
          .choose-list__item {
            height: 22px;
            background: #ffffff;
            border-radius: 2px 2px 2px 2px;
            opacity: 1;
            border: 1px solid rgba(1, 6, 33, 0.149);
            font-size: 12px;
            font-family: PingFang SC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(1, 6, 33, 0.75);
            line-height: 22px;
            padding: 0 8px;
            cursor: pointer;
          }
          .choose-list__item:hover {
            border: 1px solid var(--color-primary);
          }
          .choose-list__item.active {
            border: 1px solid var(--color-primary);
          }
        }
      }

      .el-form-item.photo {
        .el-form-item__label i {
          font-size: 16px;
          color: var(--color-primary);
          margin-right: 2px;
          cursor: pointer;
        }
        .el-form-item__content .tips {
          color: #dd4c4d;
          line-height: 20px;
          margin-bottom: 10px;
        }
      }
    }
  }

  // 备注
  .container-remark {
    margin-bottom: 60px;
    &__label {
      font-size: 16px;
      font-family: PingFang SC-Medium, PingFang SC;
      font-weight: 500;
      color: rgba(1, 6, 33, 0.898);
      line-height: 24px;
      margin-bottom: 16px;
    }
    &__input .el-textarea {
      width: 440px;
    }
  }

  // 底部
  .footer-action {
    margin-left: 16px;
  }
  .footer-text {
    font-size: 14px;
    font-family: PingFang SC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(1, 6, 33, 0.898);
    line-height: 22px;
    margin-right: 24px;

    .footer-text__credit {
      color: rgba(1, 6, 33, 0.55);
      margin-left: 16px;
    }
  }
}
</style>


