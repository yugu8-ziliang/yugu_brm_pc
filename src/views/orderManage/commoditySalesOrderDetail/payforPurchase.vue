<template>
  <!-- 支付采购款 -->
  <div class="pay-for-purchase-container">

      <div
        style="
          padding: 5px 0px 15px;
          border-bottom: 1px solid rgba(1, 6, 33, 0.15);
        "
      >
        <div>
          <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
            >收款人：</span
          ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
            tableData.userName
          }}</span
          ><span style="padding: 0px 5px">
            <el-tag
              type="info"
              v-if="tableData.userType == 0"
              size="mini"
              style="font-size: 12px"
              >非</el-tag
            >
            <el-tag
              v-if="tableData.userType == 11 || tableData.userType == 10"
              size="mini"
              style="font-size: 12px"
              >供
            </el-tag>
            <el-tag
              type="danger"
              v-if="tableData.userType == 11 || tableData.userType == 7"
              size="mini"
              style="font-size: 12px"
              >经
            </el-tag>
            <el-tag
              type="warning"
              v-if="tableData.userType == 3 || tableData.userType == 4"
              size="mini"
              style="font-size: 12px"
              >采
            </el-tag> </span
          ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
            tableData.userPhone
          }}</span>
        </div>
        <div>
          <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
            >订单金额：</span
          ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
            >{{ tableData.orderPrice }}元</span
          >
        </div>
      </div>

      <div
        style="
          padding: 5px 0px 15px;
          border-bottom: 1px solid rgba(1, 6, 33, 0.15);
        "
      >
        <div style="color: rgba(1, 6, 33, 0.55); font-size: 14px">
          经营往来款抵充
        </div>
        <div style="padding: 10px; background-color: rgba(1, 6, 33, 0.02)">
          <el-radio v-model="formData.isComeInChecked" label="1"
            >经营往来款抵充：<el-tooltip
              class="item"
              effect="dark"
              :content="tableData.disableReason"
              placement="top"
            >
              <i class="el-icon-question" style="color: #0ba198"></i>
            </el-tooltip>
            <span>{{ tableData.comeInPrice }}元</span></el-radio
          >
          <span
            style="color: rgba(221, 76, 77, 1); font-size: 14px"
            v-if="formData.isComeInChecked"
            >平账金额：</span
          >
          <span
            style="color: rgba(221, 76, 77, 1); font-size: 14px"
            v-if="formData.isComeInChecked"
            >{{ tableData.returnPrice }}元</span
          >
        </div>
      </div>

      <div
        style="
          padding: 5px 0px 15px;
          border-bottom: 1px solid rgba(1, 6, 33, 0.15);
        "
      >
        <div>
          <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
            剩余未付金额：</span
          ><span>{{ tableData.allShouldPayPrice }}元</span>
        </div>
        <div
          style="
            color: rgba(1, 6, 33, 0.55);
            font-size: 14px;
            padding: 10px 0px;
          "
        >
          <span> 其他往来款抵扣</span>
        </div>
        <div style="padding: 10px; background-color: rgba(1, 6, 33, 0.02)">
          <el-checkbox v-model="formData.checked1"
            >预付款：<el-tooltip
              class="item"
              effect="dark"
              :content="tableData.advanceInTransit"
              placement="top"
            >
              <i class="el-icon-question" style="color: #0ba198"></i>
            </el-tooltip>
            <span>{{ tableData.advancePayment }}元</span></el-checkbox
          >
          <el-checkbox v-model="formData.checked2"
            >借款：
            <el-tooltip
              class="item"
              effect="dark"
              :content="tableData.borrowInTransit"
              placement="top"
            >
              <i class="el-icon-question" style="color: #0ba198"></i>
            </el-tooltip>
            <span>{{ tableData.borrowingPrice }}元</span></el-checkbox
          >
          <el-checkbox v-model="formData.checked3"
            >转账其他：<el-tooltip
              class="item"
              effect="dark"
              :content="tableData.transferInTransit"
              placement="top"
            >
              <i class="el-icon-question" style="color: #0ba198"></i>
            </el-tooltip>
            <span>{{ tableData.transferPrice }}元</span></el-checkbox
          >
        </div>
      </div>

      <div
        style="
          padding: 5px 0px 15px;
          border-bottom: 1px solid rgba(1, 6, 33, 0.15);
        "
      >
        <div>
          <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
            >剩余需付金额：</span
          ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
            >{{ tableData.creditTotalAmount }}元</span
          >
        </div>
        <!-- <div
            style="
              color: rgba(1, 6, 33, 0.55);
              font-size: 14px;
              padding: 10px 0px;
            "
          >
            <span>
              赊账授信 超出赊账额度部分计入往来款，往来款没有赊账期限</span
            >
          </div>
          <div style="padding: 10px; background-color: rgba(1, 6, 33, 0.02)">
            <el-radio v-model="formData.creditPriceIs" label="1"
              >全部赊账

              <span
                >对方可用赊账额度：{{ tableData.creditRemainAmount }}元</span
              ></el-radio
            >
            <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
              >额度内到期金额：</span
            >
            <span style="color: rgba(221, 76, 77, 1); font-size: 14px"
              >{{ tableData.expireMoney }}元</span
            >
          </div> -->

        <div
          style="color: rgba(1, 6, 33, 0.55); font-size: 14px; margin-top: 15px"
        >
          实际付款
        </div>

        <div style="padding: 10px; background-color: rgba(1, 6, 33, 0.02)">
          <el-form ref="form" :model="formData" label-width="120px" size="mini">
            <el-form-item label="本次付款金额：">
              <el-input
                v-model="formData.isHaveOnlinePayNum"
                style="width: 150px"
              ></el-input>
              <el-checkbox
                v-model="formData.isHaveOnlinePay"
                style="margin-left: 15px"
                >线上付款
              </el-checkbox>
              <el-checkbox v-model="formData.isOfflineCollection"
                >线下付款</el-checkbox
              >
            </el-form-item>
            <el-form-item label="线上付款：" v-if="formData.isHaveOnlinePay">
              <el-input
                v-model="formData.payWay1"
                style="width: 150px"
              ></el-input>

              <el-radio-group
                v-model="formData.payType1"
                style="margin-left: 15px"
              >
                <el-radio :label="5">拉卡拉</el-radio>
                <el-radio :label="3">支付宝</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="线下付款："
              v-if="formData.isOfflineCollection"
            >
              <el-input
                v-model="formData.payWay2"
                style="width: 150px"
              ></el-input>

              <el-checkbox v-model="formData.payType2" style="margin-left: 15px"
                >现金
              </el-checkbox>
              <el-checkbox v-model="formData.payType3">微信</el-checkbox>
              <el-checkbox v-model="formData.payType4">支付宝</el-checkbox>
              <el-checkbox v-model="formData.payType5">银行卡</el-checkbox>
            </el-form-item>

            <el-form-item label="现金：" v-if="formData.payType2">
              <el-input
                v-model="formData.payWay3"
                style="width: 150px"
              ></el-input>
            </el-form-item>

            <el-form-item label="微信：" v-if="formData.payType3">
              <el-input
                v-model="formData.payWay4"
                style="width: 150px"
              ></el-input>
            </el-form-item>
            <el-form-item label="支付宝：" v-if="formData.payType4">
              <el-input
                v-model="formData.payWay5"
                style="width: 150px"
              ></el-input>
            </el-form-item>
            <el-form-item label="银行卡：" v-if="formData.payType5">
              <el-input
                v-model="formData.payWay6"
                style="width: 150px"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>

        <div style="display: flex">
          <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
            >付款凭证：</span
          >
          <div class="flex_dom">
            <i
              slot="reference"
              class="el-icon-warning-outline"
              style="
                font-size: 16px;
                color: var(--color-primary);
                margin-right: 5px;
                cursor: pointer;
              "
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
              :file-list="form.credentialsImageUrls"
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
        </div>

        <!-- <div style="padding: 0px 0px">
            <div
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 16px;
                font-weight: 700;
                padding-right: 15px;
              "
            >
              运输信息
            </div>

            <div style="padding: 10px 0px">
              <el-form
                :model="formData"
                ref="ruleForm1"
                label-width="85px"
                class="demo-ruleForm"
                label-position="left"
                size="small"
              >
                <el-form-item label="车牌号：" prop="transferArea">
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
                          color:
                            formData.transferArea == item.name ? '#fff' : '',
                          background:
                            formData.transferArea == item.name
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
                      >{{ formData.transferArea || "请选择"
                      }}<i
                        class="el-icon-arrow-down el-icon--right"
                        style="float: right"
                      ></i
                    ></el-button>
                  </el-popover>

                  <el-select
                    :class="['select2', lineValue == 2 ? 'lineValue2' : '']"
                    style="width: 250px"
                    v-model="formData.transferNumber"
                    placeholder="请选择"
                    @focus="lineFocus(2)"
                    filterable
                    remote
                    :remote-method="transinfoRemoteMethod1"
                  >
                    <el-option
                      v-for="(item, index) in transportNumber"
                      :key="index"
                      :label="item.value1"
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

                <el-form-item label="车辆照片：" prop="transferImageUrls">
                  <div class="flex_dom" style="margin-top: 10px">
                    <i
                      slot="reference"
                      class="el-icon-warning-outline"
                      style="
                        font-size: 16px;
                        color: var(--color-primary);
                        margin-right: 5px;
                        cursor: pointer;
                      "
                      @click="handleReference('referencePhoto', '参考照片')"
                    ></i>

                    <el-upload
                      list-type="picture-card"
                      :auto-upload="false"
                      accept="image/*"
                      action=" "
                      :on-change="beforeUpload1"
                      :on-remove="removeUpload1"
                      :on-preview="handlePictureCardPreview1"
                      :file-list="formData.transferImageUrls"
                      class="uploadImage"
                      ref="upload"
                    >
                      <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="dialogVisible1" width="440px">
                      <el-image
                        style="width: 400px; height: auto"
                        :src="dialogImageUrl1"
                        :preview-src-list="dialogImageUrlList1"
                      >
                      </el-image>
                    </el-dialog>
                  </div>
                </el-form-item>
              </el-form>
            </div>
          </div> -->

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
          <div style="padding: 10px 0px">
            <el-input
              style="width: 450px"
              type="textarea"
              :rows="3"
              placeholder="请输入内容"
              v-model="formData.remark"
            />
          </div>
        </div>
      </div>
    </el-scrollbar>

    <div class="btnBottom">
      <div class="flex_row_reverse flex_item_mid">
        <div style="margin-right: 10px">
          <el-button type="primary" size="mini" @click="handleSubmit(2)"
            >确认付款</el-button
          >
        </div>
        <!-- <div style="margin-right: 10px">
            <el-button size="mini" @click="handleSubmit(1)">扫码收款</el-button>
          </div> -->
        <div style="margin-right: 10px">
          <span style="font-size: 16px; color: rgba(1, 6, 33, 0.9)"
            >本次付款合计：{{ NumSum }}元 (未收金额{{
              NumSum1
            }}元，使用额度外授信{{ NumSum2 }}元)</span
          >
        </div>
      </div>
      <el-dialog
        title="警告!"
        :visible.sync="setPassword"
        width="30%"
        :before-close="setPasswordClose"
      >
        <span>当前用户未设置支付密码！请设置后再返回操作！</span>
        <p><el-button type="text">前往设置></el-button></p>
      </el-dialog>

      <el-dialog
        title="请输入密码"
        :visible.sync="isVisiable"
        :close-on-click-modal="false"
        :before-close="close"
        top="30vh"
        width="450px"
      >
        <div class="marginform">
          <div id="payPwd">
            <input
              ref="pwd"
              maxlength="6"
              v-model="msg"
              style="position: absolute; z-index: -1; left: -100%; opacity: 0"
            />
            <ul class="pwd-wrap" @click="handleFocus()">
              <li
                v-for="item in 6"
                :key="item"
                :class="[tableIndex == item ? 'isActive' : '']"
              >
                <i v-if="msgLength > item - 1"></i>
              </li>
            </ul>
          </div>
        </div>
        <div class="confirmedPaidBottom">
          <el-button style="margin-right: 10px" @click="close">取 消</el-button>
          <el-button
            type="primary"
            style="margin-right: 10px"
            @click="handleAdd"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </div>
  </div>
</div>
  <!-- </PageNoScroll> -->
</template>

<script>
import { newPayLoad, agreePayment } from "@/request/api/addCollection/index";
import { getToken } from "@/utils/auth";
import { checkoutPayPassword } from "@/request/api/login";

export default {
  nameL: "addCollection",
  data() {
    return {
      form: {},
      dialogImageUrl: "",
      dialogImageUrl1: "",
      dialogImageUrlList: [],
      dialogImageUrlList1: [],
      dialogVisible: false,
      dialogVisible1: false,
      transinfovisible: false,

      formData: {
        isComeInChecked: false,
        checked1: false,
        checked2: false,
        checked3: false,
        creditPriceIs: false,
        isHaveOnlinePayNum: "",
        isHaveOnlinePay: false,
        isOfflineCollection: false,
        payType1: false,
        payType2: false,
        payType3: false,
        payType4: false,
        payType5: false,
        payWay1: "",
        payWay2: "",
        payWay3: "",
        payWay4: "",
        payWay5: "",
        payWay6: "",

        transferArea: "",
        transferNumber: "",

        credentialsImageUrls: [],
        transferImageUrls: [],

        remark: "",
      },

      tableData: {},
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
      lineValue: 1,
      transportNumber: [],
      isVisiable: false,
      setPassword: false,
      msg: "",
      tableIndex: 1,
      msgLength: 0,
    };
  },
  watch: {
    msg(curVal) {
      this.msgLength = curVal.length;
      if (curVal.length == 0) {
        this.tableIndex = 1;
      } else {
        this.tableIndex = curVal.length;
      }

      // }
    },
  },
  computed: {
    NumSum() {
      let Num = 0;

      // Num = parseFloat(this.formData.isHaveOnlinePayNum);

      if (this.formData.isHaveOnlinePay) {
        Num += parseFloat(this.formData.payWay1) || 0;
      }
      if (this.formData.isOfflineCollection) {
        // Num += parseFloat(this.formData.payWay2);

        if (this.formData.payType2) {
          Num += parseFloat(this.formData.payWay3) || 0;
        }
        if (this.formData.payType3) {
          Num += parseFloat(this.formData.payWay4) || 0;
        }
        if (this.formData.payType4) {
          Num += parseFloat(this.formData.payWay5) || 0;
        }
        if (this.formData.payType5) {
          Num += parseFloat(this.formData.payWay6) || 0;
        }
      }

      return Num;
    },
    NumSum1() {
      let Num = 0;
      if (this.formData.checked1) {
        Num = parseFloat(this.tableData.advancePayment) || 0;
      }
      if (this.formData.checked2) {
        Num = parseFloat(this.tableData.borrowingPrice) || 0;
      }
      if (this.formData.checked3) {
        Num = parseFloat(this.tableData.transferPrice) || 0;
      }

      return Num;
    },
    NumSum2() {
      let Num = 0;
      if (this.formData.creditPriceIs) {
        Num = this.tableData.creditRemainAmount;
      }
      return Num;
    },
  },
  methods: {
    payPriceSum() {
      let Num = 0;

      // Num = parseFloat(this.formData.isHaveOnlinePayNum);

      if (this.formData.isHaveOnlinePay) {
        Num += parseFloat(this.formData.payWay1) || 0;
      }
      if (this.formData.isOfflineCollection) {
        // Num += parseFloat(this.formData.payWay2);

        if (this.formData.payType2) {
          Num += parseFloat(this.formData.payWay3) || 0;
        }
        if (this.formData.payType3) {
          Num += parseFloat(this.formData.payWay4) || 0;
        }
        if (this.formData.payType4) {
          Num += parseFloat(this.formData.payWay5) || 0;
        }
        if (this.formData.payType5) {
          Num += parseFloat(this.formData.payWay6) || 0;
        }
      }

      return Num;
    },
    handlePayLoad() {
      let query = this.$route.query;
      this.form = query;
      let param = {
        payUserId: "", //# 付款人UserId（当前用户传"",非平台传"姓名,手机号"）
        toUserId: query.fromuser, //# 收款人UserId（当前用户传"",非平台传"姓名,手机号"）
        orderInfo: [{ orderId: query.id, orderType: query.ordertype1 }],
        loadType: query.isConfirm, //# 0--不是 买家首次确认付款  1--是买家首次确认付款
        isReturn: 0, //# 0 不退货 1 退货 目前仅应用于 orderType 等于 5 进货单
      };

      newPayLoad(param).then((res) => {
        if (res.status == 200) {
          this.tableData = res.data;
        }
      });
    },
    beforeUpload(file, fileList) {
      this.formData.credentialsImageUrls = fileList;
      this.dialogImageUrlList = [];
      for (let index = 0; index < fileList.length; index++) {
        const el = fileList[index];
        this.dialogImageUrlList.push(el.url);
      }
    },
    beforeUpload1(file, fileList) {
      this.formData.transferImageUrls = fileList;
      this.dialogImageUrlList1 = [];
      for (let index = 0; index < fileList.length; index++) {
        const el = fileList[index];
        this.dialogImageUrlList1.push(el.url);
      }
    },
    removeUpload(file, fileList) {
      this.formData.credentialsImageUrls = fileList;
      this.dialogImageUrlList = [];
      for (let index = 0; index < fileList.length; index++) {
        const el = fileList[index];
        this.dialogImageUrlList.push(el.url);
      }
    },
    removeUpload1(file, fileList) {
      this.formData.transferImageUrls = fileList;
      this.dialogImageUrlList1 = [];
      for (let index = 0; index < fileList.length; index++) {
        const el = fileList[index];
        this.dialogImageUrlList1.push(el.url);
      }
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    handlePictureCardPreview1(file) {
      this.dialogImageUrl1 = file.url;
      this.dialogVisible1 = true;
    },
    transinfoClick(val) {
      this.formData.transferArea = val.name;
      this.transinfovisible = false;
    },
    lineFocus(val) {
      this.lineValue = val;
    },
    // 车牌选择
    lineFocus2(val) {
      this.formData.transferArea = val.value;
    },
    // 车牌输入
    transinfoRemoteMethod1(query) {
      this.formData.transferNumber = query;
    },
    handleSubmit() {
      if (this.ishavePw()) {
        return;
      }
      this.isVisiable = true;
    },
    handleAdd() {
      if (this.msg.length == 6) {
        // 验证密码
        let param = {
          passWord: this.msg,
          useType: 3,
        };
        checkoutPayPassword(param).then((res) => {
          if (res.status == 200) {
            if (res.data[0].isSuccess == 1) {
              let query = this.$route.query;
              let payTypeIs = []; // 付款类型
              let payWay = {};
              // 1.现金:cash 2，微信:weChat 3.支付宝:aliPay 4.银行卡:bank 5.拉卡拉线上付款:lakalaCollection 6.卖家现金收款:sellerCash  7.二维码收款:qrCode #必传

              // 线上收款
              if (this.formData.isHaveOnlinePay) {
                payTypeIs.push(this.formData.payType1);
                if (this.formData.payType1 == 3) {
                  payWay.aliPay = parseFloat(this.formData.payWay1);
                } else {
                  payWay.lakalaCollection = parseFloat(this.formData.payWay1);
                }
              }
              if (this.formData.isOfflineCollection) {
                // 现金
                if (this.formData.payType2) {
                  payTypeIs.push(1);
                  payWay.cash = parseFloat(this.formData.payWay3);
                }
                // 微信
                if (this.formData.payType3) {
                  payTypeIs.push(2);
                  payWay.weChat = parseFloat(this.formData.payWay4);
                }
                // 支付宝
                if (this.formData.payType4) {
                  if (payTypeIs.indexOf(3) == -1) {
                    payTypeIs.push(3);
                    payWay.aliPay = parseFloat(this.formData.payWay5);
                  }
                }
                // 银行卡
                if (this.formData.payType5) {
                  payTypeIs.push(4);
                  payWay.bank = parseFloat(this.formData.payWay6);
                }
              }
              let deductInfo = [];
              if (this.formData.checked2) {
                deductInfo.push("borrowPrice");
              }
              if (this.formData.checked3) {
                deductInfo.push("transferOtherPrice");
              }
              if (this.formData.checked1) {
                deductInfo.push("advancePrice");
              }

              let param = {
                payUserId: query.fromuser, // 付款方 payUserId（当前用户传"",非平台传"姓名,手机号"）
                toUserId: "", // 收款方 toUserId（当前用户传"",非平台传"姓名,手机号"）
                payPrice: this.payPriceSum(), // 支付金额   没有传0
                isComeInChecked: this.formData.isComeInChecked0 ? 1 : 0, // 往来款是否勾选 0 未勾选 1 已勾选
                creditPrice: this.formData.creditPriceIs
                  ? this.tableData.creditRemainAmount
                  : 0, // 赊账金额  没有传0
                payType: payTypeIs.toString(), // 付款类型   1.现金 2，微信 3.支付宝 4.银行卡 5.拉卡拉线上付款 6.卖家现金收款 7.二维码收款 必传
                comeInPrice: this.formData.isComeInChecked
                  ? this.tableData.comeInPrice
                  : 0, // 往来款抵扣金额   没有传0
                borrowPrice: this.formData.checked2
                  ? this.tableData.borrowingPrice
                  : 0, // 借出款金额  传全部 现无需计算
                transferOtherPrice: this.formData.checked3
                  ? this.tableData.transferPrice
                  : 0, // 转账其他    传全部 现无需计算
                advancePrice: this.formData.checked1
                  ? this.tableData.advancePayment
                  : 0, // 预付款 传全部 现无需计算
                deductInfo: deductInfo, // 对应上面 借出、转账其他、预付款字段 勾选顺序 全不勾选 传[]
                type: query.ordertype == 1 ? 5 : 1, // 1 首次添加收款信息（平台） 2  非首次填写收款信息（平台） 3 非首次添加付款信息（包含批量支付)、退货、退筐 退款卖家支付退款 （平台） 4 添加付款（非平台） 5 添加收款（非平台） 6 平台二维码收款 必传
                isHaveOnlinePay: this.formData.isHaveOnlinePay ? 1 : 0, // 是否存在线上支付 0 不存在  1 存在 必传
                credentialsImageUrls: this.formData.credentialsImageUrls, // 支付凭证图片  选填
                code: res.data[0].securityCode, // 四位收款码  type 为 2 必填  否则传 ""
                token: getToken(), // 必传
                remark: this.formData.remark, // 付款备注
                transferArea: this.formData.transferArea, // 车牌号地区   新增字段
                transferNumber: this.formData.transferNumber, // 车牌号       新增字段
                transferImageUrls: this.formData.transferImageUrls, // 运输车图片 新增字段
                transferImageUrlsList: [], // 运输车图片 链接 新增字段
                isReturnProduct: 0, // 退货退款单 修改为 仅退款 情况该字段传 1  其他情况 可传 0 或者 不传
                orderInfo: [
                  {
                    orderId: query.id, // 订单主键id #必传
                    orderType: 1, // 1--采购单  2--筐子采购单  3--退货退款单  4--退筐退货单 5--进货单 7--筐子自购单 10--筐子报废单 #必传
                  },
                ],
                payWay: {
                  // 1.现金:cash 2，微信:weChat 3.支付宝:aliPay 4.银行卡:bank 5.拉卡拉线上付款:lakalaCollection 6.卖家现金收款:sellerCash  7.二维码收款:qrCode #必传
                  ...payWay,
                },
              };
              console.log(JSON.stringify(param));

              const formData = new FormData();
              Object.keys(param).forEach((key) => {
                if (
                  key == "credentialsImageUrls" ||
                  key == "transferImageUrls"
                ) {
                  for (let i = 0; i < param[key].length; i++) {
                    const el = param[key][i];
                    formData.append(key, el.raw);
                  }
                } else if (key == "deductInfo") {
                  formData.append(key, JSON.stringify(param[key]));
                } else if (key == "orderInfo" || key == "payWay") {
                  formData.append(key, JSON.stringify(param[key]));
                } else {
                  formData.append(key, param[key]);
                }
              });

              agreePayment(formData).then((res) => {
                if ((res.status = 200)) {
                  this.isVisiable = false;
                  this.$success("收款成功");
                  this.handlePayLoad();
                  this.msg = "";
                }
              });
            } else {
              this.$warning("密码错误");
              this.msg = "";
              this.tableIndex = 1;
              this.$refs.pwd.focus();
            }
          }
        });
      } else {
        this.$warning("请输入密码");
        this.msg = "";
      }
    },
    close() {
      this.isVisiable = false;
      this.msg = "";
    },
    setPasswordClose() {
      this.setPassword = false;
    },
    ishavePw() {
      let res = this.$store.getters.userInfo;
      if (res.isSetPayWord == 0) {
        this.setPassword = true;
        return true;
      } else {
        return false;
      }
    },
    handleFocus() {
      this.$refs.pwd.focus();
    },
  },
  created() {
    this.handlePayLoad();
  },
};
</script>

<style lang="scss" scoped>
.payforPurchaseModel {
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

  .btnBottom {
    border-top: 1px solid rgba(233, 233, 233, 1);
    padding-top: 10px;
    width: 100%;
    position: absolute;
    bottom: 10px;
    left: 0px;
    right: 10px;
  }
  .marginform {
    padding: 10px;
    #payPwd .pwd-wrap {
      width: 90%;
      height: 44px;
      padding-bottom: 1px;
      margin: 0 auto;
      background: #fff;
      display: flex;
      display: -webkit-box;
      display: -webkit-flex;
      cursor: pointer;
    }
    .pwd-wrap li {
      list-style-type: none;
      text-align: center;
      line-height: 44px;
      -webkit-box-flex: 1;
      flex: 1;
      -webkit-flex: 1;
      margin: 0px 10px;
      border: 1px solid rgba(217, 217, 217, 1);
      border-radius: 4px;

      &.isActive {
        border: 1px solid var(--color-primary);
      }
    }

    .pwd-wrap li i {
      height: 10px;
      width: 10px;
      border-radius: 50%;
      background: #000;
      display: inline-block;
    }
  }

  .confirmedPaidBottom {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid rgba(1, 6, 33, 0.06);
    padding: 10px;
  }
}
</style>

<style lang="scss">
.payforPurchaseModel {
  .select2 {
    .el-input__inner {
      border-left: none;
      border-top-left-radius: 0px !important;
      border-bottom-left-radius: 0px !important;
    }
  }

  .lineValue1 {
    .el-input__inner {
      border-right: 1px solid #dcdfe6;
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
</style>
