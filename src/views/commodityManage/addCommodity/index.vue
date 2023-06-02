<template>
  <!-- 添加商品 -->
  <PageNoScroll class="addCommodityModel">
    <div>
      <div
        style="color: rgba(1, 6, 33, 0.9); font-size: 16px; font-weight: 700"
      >
        入库原因
      </div>
      <div style="padding: 10px 0px">
        <el-radio-group v-model="form.purStatus">
          <el-radio :label="1">采购</el-radio>
          <el-radio :label="2">自家生产</el-radio>
        </el-radio-group>
      </div>
    </div>

    <div v-if="form.purStatus == 1">
      <div
        style="color: rgba(1, 6, 33, 0.9); font-size: 16px; font-weight: 700"
      >
        客户信息
      </div>
      <div style="padding: 10px 0px">
        <el-form
          :model="form"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
          label-position="top"
          size="small"
        >
          <el-row :gutter="20">
            <el-col :span="6">
              <el-form-item label="客户姓名：" prop="factoryName">
                <el-select
                  ref="factorySelect"
                  style="width: 100%"
                  v-model="form.factoryName"
                  filterable
                  remote
                  :remote-method="factoryNameRemoteMethod"
                  @focus="getunplatformlist"
                  placeholder="请输入或选择"
                >
                  <el-option
                    v-for="(item, index) in factoryOptions"
                    :key="index"
                    :label="item.cusname"
                    :value="item.cusname"
                    class="clickOptionChange"
                  >
                    <div
                      @click="clickChange(item, index)"
                      style="padding: 0px 20px"
                    >
                      <span>{{ item.cusname }} </span>
                      <span style="margin-left: 40px">{{
                        item.phonenumber
                      }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系电话：" prop="factoryPhone">
                <el-select
                  ref="factorySelect"
                  style="width: 100%"
                  v-model="form.factoryPhone"
                  filterable
                  remote
                  :remote-method="factoryNameRemoteMethod1"
                  @focus="getunplatformlist"
                  placeholder="请输入或选择"
                >
                  <el-option
                    v-for="(item, index) in factoryOptionsPhone"
                    :key="index"
                    :label="item.phonenumber"
                    :value="item.phonenumber"
                    class="clickOptionChange"
                  >
                    <div
                      @click="clickChange(item, index)"
                      style="padding: 0px 20px"
                    >
                      <span>{{ item.cusname }} </span>
                      <span style="margin-left: 40px">{{
                        item.phonenumber
                      }}</span>
                    </div>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <div class="lineW"></div>

    <div class="flex_dom flex_item_mid" style="padding: 15px 0px 5px">
      <div
        style="
          color: rgba(1, 6, 33, 0.9);
          font-size: 16px;
          font-weight: 700;
          padding-right: 15px;
        "
      >
        商品信息
      </div>
      <el-button
        type="primary"
        size="mini"
        @click="handleAdd()"
        icon="el-icon-plus"
        >选择商品</el-button
      >
    </div>

    <div ref="currentBasketDetailsTable">
      <el-scrollbar
        ref="scrollDiv"
        :style="{
          height: parseInt($store.getters.screenHeight - SetHeight - 70) + 'px',
        }"
      >
        <div style="padding: 0px 0px 10px">
          <div
            style="
              padding: 10px 10px 15px;
              border-bottom: 1px solid rgba(233, 233, 233, 1);
            "
            v-for="(item, index) in commodityData"
            :key="index"
          >
            <div v-if="item.isCommType == 'add'">
              <div class="flex_dom flex_item_between flex_item_mid">
                <div
                  style="
                    color: rgba(1, 6, 33, 0.9);
                    font-size: 16px;
                    font-weight: 700;
                  "
                >
                  {{ item.pathProductName }}
                </div>
                <div class="flex_dom flex_item_mid">
                  <el-button
                    type="text"
                    size="mini"
                    @click="handleRemove(index)"
                    >移除</el-button
                  >
                  <div class="lineH14"></div>
                  <el-button type="text" size="mini" @click="handleEdit(index)"
                    >编辑</el-button
                  >
                  <div class="lineH14"></div>
                  <el-button
                    type="text"
                    size="mini"
                    @click="handleDetail(index)"
                    >详情</el-button
                  >
                </div>
              </div>
            </div>

            <div v-else>
              <div class="flex_dom flex_item_between flex_item_mid">
                <div
                  style="
                    color: rgba(1, 6, 33, 0.9);
                    font-size: 16px;
                    font-weight: 700;
                  "
                >
                  {{ item.pathProductName }}
                </div>
                <div class="flex_dom flex_item_mid">
                  <el-button
                    type="text"
                    size="mini"
                    @click="handleRemove(index)"
                    >移除</el-button
                  >
                  <div class="lineH14"></div>
                  <el-button type="text" size="mini" @click="handleEdit(index)"
                    >编辑</el-button
                  >
                  <div class="lineH14"></div>
                  <el-button
                    type="text"
                    size="mini"
                    @click="handleDetail(index)"
                    >详情</el-button
                  >
                </div>
              </div>

              <div style="padding: 16px 0px 12px">
                <el-row>
                  <el-col :span="5"
                    ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >品种/品牌：</span
                    ><span
                      style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                      >{{ item.variety }}</span
                    ></el-col
                  >
                  <el-col :span="5"
                    ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >产地：</span
                    ><span
                      style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                      >{{ setpathRegionname(item.pathRegionname) }}</span
                    ></el-col
                  >
                  <el-col :span="5"
                    ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >级别/规格：</span
                    ><span
                      style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                      >{{ item.spec }}</span
                    ></el-col
                  >
                  <el-col :span="5"
                    ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >计算单位：</span
                    ><span
                      style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                      >{{ item.subunit }}</span
                    ></el-col
                  >
                </el-row>
              </div>

              <div style="padding: 0px 0px">
                <el-row>
                  <el-col
                    :span="5"
                    v-if="
                      precisionSun(item.subunit) != 0 &&
                      item.pieceunit == '筐(周转筐)' &&
                      item.isRemovePeel == 1
                    "
                  >
                    <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >商品净重：</span
                    ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                      {{ (item.productweight || 0) + item.subunit }}
                    </span>
                  </el-col>

                  <el-col
                    :span="5"
                    v-if="
                      precisionSun(item.subunit) == 0 ||
                      item.pieceunit != '筐(周转筐)' ||
                      item.isRemovePeel == 0
                    "
                  >
                    <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >商品数量：</span
                    ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                      {{ (item.purchasenums || 0) + item.subunit }}
                      {{ item.subUnit2 != "" ? "(" : "" }}
                      {{
                        item.subUnit3Weight == 0
                          ? ""
                          : item.subUnit3Weight + item.subUnit3
                      }}
                      {{ item.subUnit3 != "" ? "*" : "" }}
                      {{
                        item.subUnit2Weight == 0
                          ? ""
                          : item.subUnit2Weight + item.subUnit2
                      }}
                      {{ item.subUnit2 != "" ? "/" + item.subunit : "" }}
                      {{ item.subUnit2 != "" ? ")" : "" }}
                      {{
                        item.pieceunit != ""
                          ? item.pieceunit != "筐(一次性)"
                            ? item.pieceunit != "筐(周转筐)" &&
                              item.pieceunit != "无"
                              ? "(" + item.piecenumber + item.pieceunit + ")"
                              : ""
                            : "(" + item.piecenumber + "筐)"
                          : ""
                      }}
                      {{
                        item.allbasketnums != 0 &&
                        item.pieceunit == "筐(周转筐)"
                          ? "| " + item.allbasketnums
                          : ""
                      }}<font
                        v-if="
                          item.allbasketnums != 0 &&
                          item.pieceunit == '筐(周转筐)'
                        "
                        style="color: #df971a"
                        >筐</font
                      >
                    </span>
                  </el-col>

                  <el-col :span="5"
                    ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >采购单价：</span
                    ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                      >{{
                        (item.purchaseprice || 0) | intervalFormat(false)
                      }}元/{{ item.subunit }}</span
                    >
                  </el-col>
                  <el-col :span="5"
                    ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >商品金额：</span
                    ><span style="color: rgba(221, 76, 77, 1); font-size: 14px"
                      >{{ item.productamount | intervalFormat(false) }}元</span
                    ></el-col
                  >
                  <el-col :span="5"
                    ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >筐子金额：</span
                    ><span style="color: rgba(221, 76, 77, 1); font-size: 14px"
                      >{{ item.basketamount | intervalFormat(false) }}元</span
                    ></el-col
                  >
                  <el-col :span="4"
                    ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >金额小计：</span
                    ><span style="color: rgba(221, 76, 77, 1); font-size: 14px"
                      >{{ item.sumamount | intervalFormat(false) }}元</span
                    ></el-col
                  >
                </el-row>
              </div>
            </div>
          </div>
        </div>

        <div style="padding: 15px 0px">
          <div
            style="
              color: rgba(1, 6, 33, 0.9);
              font-size: 16px;
              font-weight: 700;
              padding-right: 15px;
            "
          >
            合计
          </div>
          <div style="padding: 10px 0px">
            <span
              style="
                color: rgba(1, 6, 33, 0.55);
                font-size: 14px;
                width: 250px;
                display: inline-block;
              "
              >商品种类：<span
                style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                >{{ commodityData.length || 0 }}种</span
              ></span
            >
            <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
              >商品金额：<span
                style="color: rgba(221, 76, 77, 1); font-size: 14px"
                >{{
                  basketType().productamount | intervalFormat(false)
                }}元</span
              ></span
            >
          </div>
          <div style="padding: 10px 0px">
            <span
              style="
                color: rgba(1, 6, 33, 0.55);
                font-size: 14px;
                width: 250px;
                display: inline-block;
              "
              v-if="basketType().mybasketnum != 0"
              >购入筐子：<span
                style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                >{{ basketType().mybasketnum }}个</span
              ></span
            >
            <span
              style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
              v-if="basketType().basketamount != 0"
              >筐子金额：<span
                style="color: rgba(221, 76, 77, 1); font-size: 14px"
                >{{ basketType().basketamount | intervalFormat(false) }}元</span
              ></span
            >
          </div>
          <div style="padding: 10px 0px">
            <span
              style="
                color: rgba(1, 6, 33, 0.55);
                font-size: 14px;
                width: 250px;
                display: inline-block;
              "
              v-if="basketType().mybasketnum != 0"
              >使用自家筐子：<span
                style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                >{{ basketType().mybasketnum }}个</span
              ></span
            >
          </div>
        </div>

        <div style="padding: 0px 0px">
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
              :model="form"
              :rules="rules"
              ref="ruleForm1"
              label-width="80px"
              class="demo-ruleForm"
              label-position="left"
              size="small"
            >
              <el-form-item label="车牌号：" prop="transinfo1">
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
                        color: form.transinfo1 == item.name ? '#fff' : '',
                        background:
                          form.transinfo1 == item.name
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
                    >{{ form.transinfo1 || "请选择"
                    }}<i
                      class="el-icon-arrow-down el-icon--right"
                      style="float: right"
                    ></i
                  ></el-button>
                </el-popover>

                <el-select
                  :class="['select2', lineValue == 2 ? 'lineValue2' : '']"
                  style="width: 250px"
                  v-model="form.transinfo2"
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

              <el-form-item
                label="车辆照片："
                prop="transimageList"
                :rules="[
                  {
                    required:
                      basketType().productamount + basketType().basketamount >
                      100000
                        ? true
                        : false,
                    trigger: 'blur',
                    validator: valiTransimage,
                  },
                ]"
              >
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
                    :on-change="beforeUpload"
                    :on-remove="removeUpload"
                    :on-preview="handlePictureCardPreview"
                    :file-list="form.transimageList"
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
        </div>

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
              v-model="form.remark"
            />
          </div>
        </div>
      </el-scrollbar>
    </div>
    <div class="btnBottom">
      <div class="flex_row_reverse flex_item_mid">
        <div style="margin-right: 10px">
          <el-button type="primary" size="mini" @click="handleSubmit(2)"
            >确认并返回</el-button
          >
        </div>
        <div style="margin-right: 10px">
          <el-button size="mini" @click="handleSubmit(1)">确认并付款</el-button>
        </div>
        <div style="margin-right: 10px">
          <span style="font-size: 16px; color: rgba(1, 6, 33, 0.9)"
            >金额合计：</span
          ><span style="font-size: 16px; color: rgba(221, 76, 77, 1)"
            >{{
              (basketType().productamount + basketType().basketamount)
                | intervalFormat(false)
            }}元</span
          >
        </div>
      </div>
    </div>
    <productDetailsDialog ref="productDetailsDialog"></productDetailsDialog>
    <referencePhoto ref="referencePhoto"></referencePhoto>
  </PageNoScroll>
</template>

<script>
import { unplatformlist } from "@/request/api/customerManage/customer";
import { addProduct } from "@/request/api/commodityManage/commodityList";

import elementResizeDetectorMaker from "element-resize-detector";
import { Base64 } from "js-base64";

export default {
  name: "addCommodity",
  components: {
    productDetailsDialog: () => import("./dialogmod/productDetailsDialog.vue"), // 商品详情
    referencePhoto: () => import("./dialogmod/referencePhoto.vue"), // 参考照片
  },
  data() {
    var valiTransimage = (rule, value, callback) => {
      if (
        this.basketType().productamount + this.basketType().basketamount >
        100000
      ) {
        if (value.length == 0) {
          callback(
            new Error(
              "订单金额已超过10万元,请上传交易单据、车牌信息、货物等照片"
            )
          );
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      factoryOptions: [],
      factoryOptionsPhone: [],
      transinfovisible: false,
      form: {
        purStatus: 1,
        factoryName: "",
        factoryPhone: "",
        remark: "",
        transinfo1: "",
        transinfo2: "",
        transimage: [],
        transimageList: [],
      },
      rules: {
        factoryName: [
          {
            required: true,
            message: "请输入或选择客户姓名",
            trigger: ["blur", "change"],
          },
        ],
        factoryPhone: [
          {
            required: true,
            message: "请输入或选择联系电话",
            trigger: ["blur", "change"],
          },
        ],
      },
      valiTransimage: valiTransimage,
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
      SetHeight: 0,
      commodityData: [],
      transportNumber: [],
      dialogImageUrl: "",
      dialogVisible: false,
      dialogImageUrlList: [],
    };
  },
  watch: {
    "form.purStatus": {
      handler(val, oval) {
        this.handlerSetHeight("currentBasketDetailsTable");
      },
      deep: true,
    },
  },
  methods: {
    // 添加商品
    handleAdd() {
      this.commodityData.push({
        isCommType: "add",
        pathProductName: "商品" + (this.commodityData.length + 1),
      });
    },
    // 移除商品
    handleRemove(index) {
      if (this.commodityData[index].isCommType == "add") {
        this.commodityData.splice(index, 1);
      } else {
        this.$confirm("确认删除编辑过的商品?", "删除商品", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          this.commodityData.splice(index, 1);
        });
      }
    },
    // 编辑商品
    handleEdit(index) {
      this.handleJumpDetail("editCommodity", {
        purStatus: this.form.purStatus,
        fullPath: "/commodityManage/addCommodity?data=e30%3D",
      });
      this.commodityData[index].commodityIndex = index;
      this.$store.dispatch(
        "common/editCommodityData",
        this.commodityData[index]
      );
    },
    // 商品详情
    handleDetail(index) {
      this.commodityData[index].commodityIndex = index;
      this.$refs.productDetailsDialog.edit({
        form: {
          purStatus: this.form.purStatus,
          fullPath: "/commodityManage/addCommodity?data=e30%3D",
        },
        model: this.commodityData[index],
      });
      this.$refs.productDetailsDialog.title = "商品详情";
      this.$refs.productDetailsDialog.disableSubmit = false;
      this.$refs.productDetailsDialog.isVisiable = true;
    },
    handleReference(form, title) {
      this.$refs[form].title = title;
      this.$refs[form].disableSubmit = false;
      this.$refs[form].isVisiable = true;
    },
    // 设置列表参数
    setCommonData() {
      // console.log(JSON.stringify(this.$store.getters.editCommodityData));
      let dataP = JSON.parse(
        JSON.stringify(this.$store.getters.editCommodityData)
      );
      if (dataP.isCommType == "edit") {
        this.$set(this.commodityData, dataP.commodityIndex, dataP);
        this.$store.dispatch("common/editCommodityData", {});
      }
      // console.log(this.commodityData);
    },
    getunplatformlist() {
      //获取厂商名称
      let param1 = {
        cusName: "", // 客户名称
        phoneNumber: "", // 手机号搜索
        modelType: 0, //商品管理
      };
      unplatformlist(param1).then((res) => {
        if (res.status == 200) {
          this.factoryOptions = res.data;
          this.factoryOptionsPhone = res.data;
        }
      });
    },
    // 厂商名称远程搜索
    factoryNameRemoteMethod(query) {
      this.form.factoryName = query;
      //获取厂商名称
      let param1 = {
        cusName: query, // 客户名称
        phoneNumber: "", // 手机号搜索
        modelType: 9,
      };
      unplatformlist(param1).then((res) => {
        if (res.status == 200) {
          this.factoryOptions = res.data;
        }
      });
    },
    // 厂商手机号远程搜索
    factoryNameRemoteMethod1(query) {
      this.form.factoryPhone = query;
      //获取厂商名称
      let param1 = {
        cusName: "", // 客户名称
        phoneNumber: query, // 手机号搜索
        modelType: 9,
      };
      unplatformlist(param1).then((res) => {
        if (res.status == 200) {
          this.factoryOptionsPhone = res.data;
        }
      });
    },
    // 厂商名称
    clickChange(item, index) {
      this.form.factoryName = item.cusname;
      this.form.factoryPhone = item.phonenumber;

      this.transportNumber = [];
      for (let i = 0; i < item.transportNumber.length; i++) {
        const el = item.transportNumber[i];
        let datap = el.split(",");
        this.transportNumber = [
          { label: el, value: datap[0], value1: datap[1] },
        ];
      }
    },

    // handleAvatarSuccess(res, file) {
    //   this.imageUrl = URL.createObjectURL(file.raw);
    // },
    lineFocus(val) {
      this.lineValue = val;
    },
    transinfoClick(val) {
      this.form.transinfo1 = val.name;
      this.transinfovisible = false;
    },
    // 车牌选择
    lineFocus2(val) {
      this.form.transinfo1 = val.value;
    },
    // 车牌输入
    transinfoRemoteMethod1(query) {
      this.form.transinfo2 = query;
    },
    setpathRegionname(val) {
      let vals = val.split("-");
      if (vals[0] == "国内") {
        return vals[1] + "-" + vals[2] + "-" + vals[3];
      } else {
        return vals[1];
      }
    },
    // 小数点判断 斤非斤判断
    precisionSun(val) {
      if (val == "斤" || val == "公斤" || val == "g") {
        return 2;
      } else {
        return 0;
      }
    },
    //购入筐子 自家筐子
    basketType() {
      let buybasketType = 0; //卖家筐子种类
      let buybasketnum = 0; //卖家筐子总数
      let mybasketType = 0; //自家筐子种类
      let mybasketnum = 0; //自家筐子总数
      let mybasketnumOwn = 0; //当前库存空置筐子数量自家筐子总数
      let allbasketnums = 0; // 商品使用总数
      let productamount = 0; // 商品金额 商品净重*商品单价 商品数量*商品单价
      let basketamount = 0; //筐子金额  卖家筐子：筐子标签-筐子名称-颜色的使用数量*价格，所有用的卖家筐子的总价格

      for (let i = 0; i < this.commodityData.length; i++) {
        const el = this.commodityData[i];
        if (el.isCommType != "add") {
          buybasketType += el.buybasketType;
          buybasketnum += el.buybasketnum;
          mybasketType += el.mybasketType;
          mybasketnum += el.mybasketnum;
          mybasketnumOwn += el.mybasketnumOwn;
          allbasketnums += el.allbasketnums;

          productamount += el.productamount;
          basketamount += el.basketamount;
        }
      }

      let datap = {
        buybasketType,
        buybasketnum,
        mybasketType,
        mybasketnum,
        mybasketnumOwn,
        allbasketnums,
        productamount,
        basketamount,
      };
      return datap;
    },
    // 上传文件
    beforeUpload(file, fileList) {
      this.form.transimageList = fileList;
      this.dialogImageUrlList = [];
      for (let index = 0; index < fileList.length; index++) {
        const el = fileList[index];
        this.dialogImageUrlList.push(el.url);
      }
    },
    removeUpload(file, fileList) {
      this.form.transimageList = fileList;
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
    // 提交
    handleSubmit(val) {
      // this.submitData(val);
      // return;
      if (this.form.purStatus == 1) {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            let commodityDataList = [];
            for (let i = 0; i < this.commodityData.length; i++) {
              const el = this.commodityData[i];
              if (el.isCommType == "edit") {
                commodityDataList.push(el);
              }
            }
            if (commodityDataList.length > 0) {
              this.$refs.ruleForm1.validate((valid1) => {
                if (valid1) {
                  this.submitData(val);
                }
              });
            } else {
              if (this.commodityData.length > 0) {
                this.$warning("请先编辑商品");
              } else {
                this.$warning("请先添加商品");
              }
            }
          }
        });
      } else {
        let commodityDataList = [];
        for (let i = 0; i < this.commodityData.length; i++) {
          const el = this.commodityData[i];
          if (el.isCommType == "edit") {
            commodityDataList.push(el);
          }
        }
        if (commodityDataList.length > 0) {
          this.$refs.ruleForm1.validate((valid1) => {
            if (valid1) {
              this.submitData(2);
            }
          });
        } else {
          if (this.commodityData.length > 0) {
            this.$warning("请先编辑商品");
          } else {
            this.$warning("请先添加商品");
          }
        }
      }
    },
    // 提交数据
    submitData(val) {
      // console.log(this.form);
      // console.log(this.commodityData);
      if (this.basketType().mybasketnumOwn < this.basketType().mybasketnum) {
        this.$msgbox({
          title: "筐子数量不足",
          message:
            "您的空置筐子数量不足，需要购入筐子" +
            (this.basketType().mybasketnum - this.basketType().mybasketnumOwn) +
            "个,添加完成后方可确认订单",
          showCancelButton: true,
          confirmButtonText: "购入筐子",
          cancelButtonText: "取消",
        })
          .then((action) => {
            this.handleJumpDetail("/orderManagement/BasketBuyAdd", {});
          })
          .catch(() => {});
        return;
      }

      let paramData = {
        inreason: this.form.purStatus == 1 ? 0 : 1, // 入库原因，0：采购，1：自家生产
        fromUserName: this.form.purStatus == 1 ? this.form.factoryName : "", // 非平台客户姓名(采购时填写)
        fromUserPhone: this.form.purStatus == 1 ? this.form.factoryPhone : "", // 非平台客户手机号(采购时填写)
        productkindnum: this.commodityData.length, // 商品种类
        sumproductamount: this.basketType().productamount, // 商品金额
        buybasketnum: this.basketType().mybasketnum, // 购买筐子
        buybasketamount: this.basketType().basketamount, // 筐子金额
        sumamount:
          this.basketType().productamount + this.basketType().basketamount, // 金额合计
        remark: this.form.remark, // 商品备注
        transinfo: this.form.transinfo1 + "," + this.form.transinfo2, // 运输信息，"沪,A9T4M2"
        transimage: [], // 照片
        addinfo: [], // 商品列表
      };

      this.form.transimageList.forEach((res) => {
        paramData.transimage.push(res.raw);
      });

      this.commodityData.forEach((res) => {
        if (
          this.precisionSun(res.subunit) == 0 ||
          res.pieceunit != "筐(周转筐)"
        ) {
          res.isRemovePeel = 0;
        }

        let paramD = {
          productname: res.productname, // 商品名称
          productid: res.productid, // 商品ID
          other: res.other, // 选择其他分类时填写
          variety: res.variety, // 品牌
          subunit: res.subunit, // 计算单位
          pieceunit: res.pieceunit == "无" ? "" : res.pieceunit, // 计件单位
          piecenumber: res.piecenumber || 0, // 计件数量
          subUnit2: res.subUnit2 || "", // 二级计算单位，2021-11-15需求优化新增
          subUnit2Weight: res.subUnit2Weight || 0, // 二级计算单位重量，2021-11-15需求优化新增
          subUnit3: res.subUnit3 || "", // 三级计算单位，2021-11-15需求优化新增
          subUnit3Weight: res.subUnit3Weight || 0, // 三级计算单位，2021-11-15需求优化新增
          regionid: res.regionid, // 产地id
          regionname: res.regionname, // 产地
          spec: res.spec, // 规格
          purchasenums: res.purchasenums || 0, // 采购数量
          purchaseprice: res.purchaseprice || 0, // 采购单价
          basketkindnum: res.basketkindnum || 0, // 使用筐子种类
          allbasketnums: res.allbasketnums || 0, // 该商品使用筐子的总数量

          basketweight: res.basketweight || 0, // 筐子重量
          productweight: res.productweight || 0, // 商品净重
          isRemovePeel: res.isRemovePeel, // 是否去皮  0否   1是
          productamount: res.productamount || 0, // 商品金额
          buybasketnum: res.buybasketnum || 0, // 购买筐子
          basketamount: res.basketamount || 0, // 筐子金额
          sumamount: res.sumamount, // 金额小计
          allBasketinfo: [{ ownBasketInfo: [], sellerBasketInfo: [] }],
        };

        res.basketInfo.forEach((res1) => {
          let basketinfo2 = [];
          res1.basketinfo.forEach((res2) => {
            if (res1.ismyseller == 1) {
              basketinfo2.push({
                color: res2.basketcolor,
                basketNum: res2.basketNum || 0,
                basketWeight:
                  res.isRemovePeel == 0 ? 0 : res2.basketWeight || 0, // 筐子重量
                basketLoading: res2.basketLoading || 0, // 载货量
              });
            }
            if (res1.ismyseller == 2) {
              basketinfo2.push({
                color: res2.basketcolor, // 筐子颜色
                unit: res2.unit || 0, // 单价
                basketNum: res2.basketNum, // 筐子数量
                basketWeight:
                  res.isRemovePeel == 0 ? 0 : res2.basketWeight || 0, // 筐子重量
                basketLoading: res2.basketLoading || 0, // 载货量
              });
            }
          });

          // 自家筐子
          if (res1.ismyseller == 1) {
            paramD.allBasketinfo[0].ownBasketInfo.push({
              basketName: res1.basketname,
              basketId: res1.basketid,
              basketInfo: basketinfo2,
            });
          }

          // 卖家筐子
          if (res1.ismyseller == 2) {
            paramD.allBasketinfo[0].sellerBasketInfo.push({
              basketName: res1.basketname, // 筐子名称
              basketId: res1.basketid, // 筐子id
              basketInfo: basketinfo2,
            });
          }
        });
        paramData.addinfo.push(paramD);
      });

      // addinfo

      const formData = new FormData();
      Object.keys(paramData).forEach((key) => {
        if (key == "transimage") {
          for (let i = 0; i < paramData.transimage.length; i++) {
            const el = paramData.transimage[i];
            formData.append("transimage", el);
          }
        } else if (key == "addinfo") {
          formData.append(key, JSON.stringify(paramData[key]));
        } else {
          formData.append(key, paramData[key]);
        }
      });

      // for (var [a, b] of formData.entries()) {
      //   console.log(a, b);
      // }

      addProduct(formData).then((res) => {
        if (res.status) {
          this.$success(res.msg);
          if (val == 1) {
          } else {
            // this.handleJumpDetail1("/commodityManage/addcommodityDetails", {
            //   id: res.data[0].orderId,
            // });
            this.$closePage("/commodityManage/addcommodityDetails", {
              id: res.data[0].orderId,
            });
          }
        }
      });
    },
    // 跳转页面
    handleJumpDetail: function (form, record) {
      this.$router.push({
        path: form,
        query: {
          data: Base64.encode(JSON.stringify(record)),
        },
      });
    },
    // 跳转页面
    handleJumpDetail1: function (form, record) {
      this.$router.push({
        path: form,
        query: record,
      });
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
  },
  created() {},
  //进入页面触发
  beforeRouteEnter(to, form, next) {
    next((vm) => {
      vm.getunplatformlist();
      // vm.setCommonData()
      if (form.path == "/commodityManage/editCommodity") {
        vm.setCommonData();
      }
    });
  },
  mounted() {
    this.handlerSetHeight("currentBasketDetailsTable");
  },
};
</script>

<style lang="scss" scoped>
.addCommodityModel {
  .lineW {
    width: 100%;
    height: 1px;
    background: rgba(233, 233, 233, 1);
  }

  .lineH14 {
    width: 1px;
    height: 14px;
    background: rgba(208, 208, 210, 1);
    margin: 0px 10px;
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
}
</style>

<style lang="scss">
.addCommodityModel {
  .el-form-item__label {
    padding: 0px !important;
  }

  .select1 {
    .el-input__inner {
      border-top-right-radius: 0px !important;
      border-bottom-right-radius: 0px !important;
      border-right: none;
    }
  }

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

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 106px;
    height: 106px;
    line-height: 106px;
    text-align: center;
  }

  .avatar {
    width: 106px;
    height: 106px;
    display: block;
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