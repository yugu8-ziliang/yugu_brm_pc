<template>
  <!-- 添加商品 -->
  <PageNoScroll class="addCommodityModel">
    <div>
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
                <el-cascader
                  v-model="form.factoryName"
                  ref="cascader"
                  :props="props"
                  :show-all-levels="false"
                  @change="factoryChange"
                  filterable
                  @blur="filterMethod"
                >
                  <template slot-scope="{ node, data }">
                    <span style="display: inline-block; margin-right: 25px">{{
                      data.factoryName
                    }}</span>
                    <span> {{ data.factoryPhone }} </span>
                  </template>
                </el-cascader>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="联系电话：" prop="factoryPhone">
                <el-cascader
                  v-model="form.factoryPhone"
                  ref="cascader1"
                  :props="props1"
                  :show-all-levels="false"
                  @change="factoryChange1"
                  filterable
                  @blur="filterMethod1"
                >
                  <template slot-scope="{ node, data }">
                    <span style="display: inline-block; margin-right: 25px">{{
                      data.factoryName
                    }}</span>
                    <span> {{ data.factoryPhone }} </span>
                  </template>
                </el-cascader>
              </el-form-item>
            </el-col>

            <el-col :span="8">
              <el-form-item label=" " prop="">
                <el-button
                  @click="
                    handleJumpDetail1('demandOrder', {
                      id: form.customerId,
                    })
                  "
                  :disabled="
                    form.factoryName
                      ? commodityData.length == 20
                        ? true
                        : false
                      : true
                  "
                  size="small"
                  icon="el-icon-plus"
                  style="margin-top: 9px"
                  >查看需求单</el-button
                >

                <el-button
                  @click="
                    handleJumpDetail1('drafts', {
                      id: form.customerId,
                    })
                  "
                  :disabled="
                    form.factoryName
                      ? commodityData.length == 20
                        ? true
                        : false
                      : true
                  "
                  size="small"
                  icon="el-icon-plus"
                  style="margin-top: 9px"
                  >查看草稿箱</el-button
                >
                <el-button
                  @click="
                    handleJumpDetail1('historySellOrder', {
                      id: form.customerId,
                    })
                  "
                  :disabled="
                    form.factoryName
                      ? commodityData.length == 20
                        ? true
                        : false
                      : true
                  "
                  size="small"
                  icon="el-icon-plus"
                  style="margin-top: 9px"
                  >历史销售单</el-button
                >
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
        :disabled="
          form.factoryName ? (commodityData.length == 20 ? true : false) : true
        "
        type="primary"
        size="mini"
        @click="handleEdit1()"
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
            <div>
              <div class="flex_dom flex_item_between flex_item_mid">
                <div
                  style="
                    color: rgba(1, 6, 33, 0.9);
                    font-size: 16px;
                    font-weight: 700;
                  "
                >
                  {{ item.categoryName }}
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

            <div>
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
                      >{{ item.regionname }}</span
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

                  <el-row v-if="item.forms">
                    <el-col :span="5"
                      ><span
                        style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                        >销售数量：</span
                      ><span
                        style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                        v-html="
                          getStock(
                            item.subunit,
                            item.subUnit2,
                            item.subUnit3,
                            item.forms.pieceUnit,
                            item.subUnit2Weight,
                            item.subUnit3Weight,
                            item.forms.purchasenums - item.weightBasket,
                            item.forms.piecenumber1,
                            item.forms.piecenumber
                          )
                        "
                      ></span
                    ></el-col>
                    <el-col :span="5"
                      ><span
                        style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                        >商品单价：</span
                      ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                        >{{ item.forms.sellPrice }}元/{{ item.subunit }}</span
                      ></el-col
                    >
                    <el-col :span="5"
                      ><span
                        style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                        >商品金额：</span
                      ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                        >{{ item.totalAmount }}元</span
                      ></el-col
                    >
                  </el-row>
                  <el-row v-if="item.forms">
                    <el-col :span="5" v-if="item.typeBasket"
                      ><span
                        style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                        >筐子种类：</span
                      ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                        >{{ item.typeBasket }}种</span
                      ></el-col
                    >
                    <el-col :span="5" v-if="item.userBasketCounts"
                      ><span
                        style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                        >售出筐子：</span
                      ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                        >{{ item.userBasketCounts }}个</span
                      ></el-col
                    >
                    <el-col :span="5" v-if="item.totalAmountBaskets"
                      ><span
                        style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                        >筐子金额：</span
                      ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                        >{{ item.totalAmountBaskets }}元</span
                      ></el-col
                    >
                  </el-row>
                </el-row>

                <div style="float: right; font-size: 14px">
                  <span>金额小计：</span
                  ><span style="color: #dd4c4d"
                    >{{ item.totalAmount || 0 }}元</span
                  >
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style="padding: 15px 0px" v-if="commodityData.length > 0">
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
                >{{ basketType().amountGoods | intervalFormat(false) }}元</span
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
              v-if="basketType().saleBasket != 0"
              >售出筐子：<span
                style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                >{{ basketType().saleBasket }}个</span
              ></span
            >
            <span
              style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
              v-if="basketType().amountBasket != 0"
              >筐子金额：<span
                style="color: rgba(221, 76, 77, 1); font-size: 14px"
                >{{ basketType().amountBasket | intervalFormat(false) }}元</span
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
              v-if="basketType().useBuyerBasket != 0"
              >使用自家筐子：<span
                style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                >{{ basketType().useBuyerBasket }}个</span
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

              <el-form-item label="车辆照片：" prop="transimageList">
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
          <el-button size="mini" @click="handleSubmit(1)"
            >保存至草稿箱(0/20)</el-button
          >
        </div>
        <div style="margin-right: 10px">
          <span style="font-size: 16px; color: rgba(1, 6, 33, 0.9)"
            >已添加商品({{ commodityData.length }}/20)</span
          >
        </div>
      </div>
    </div>
    <!-- <productDetailsDialog ref="productDetailsDialog"></productDetailsDialog> -->
    <referencePhoto ref="referencePhoto"></referencePhoto>
  </PageNoScroll>
</template>
  
  <script>
// import { getUser } from "@/request/api/basketBuy/index";
import { getUser, getFUser } from "@/request/api/basketSold/index";

import { addSellInfo, addSellDraft } from "@/request/api/commodity/index";

import elementResizeDetectorMaker from "element-resize-detector";

export default {
  name: "addSalesTicket",
  components: {
    //   productDetailsDialog: () => import("./dialogmod/productDetailsDialog.vue"), // 商品详情
    referencePhoto: () => import("./dialog/referencePhoto.vue"), // 参考照片
  },
  data() {
    return {
      transinfovisible: false,
      form: {
        factoryName: "",
        factoryPhone: "",
        customerId: "",
        remark: "",
        transinfo1: "",
        transinfo2: "",
        transimage: [],
        transimageList: [],
        selluserid: "",
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
      draftaddNum: 0,
      props: {
        label: "factoryName",
        value: "factoryName",
        lazy: true,
        lazyLoad: this.lazyLoad,
      },
      props1: {
        label: "factoryPhone",
        value: "factoryPhone",
        lazy: true,
        lazyLoad: this.lazyLoad,
      },
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
    lazyLoad(node, resolve) {
      const { level } = node;
      if (level == 0) {
        let nodes = [
          {
            value: 1,
            factoryName: "平台",
            leaf: false,
          },
          {
            value: 2,
            factoryName: "非平台",
            leaf: false,
          },
        ];
        resolve(nodes);
      } else if (level == 1) {
        if (node.data.value == 1) {
          let param = {
            search: "",
            modelType: 2,
            bussinessScope: [],
            pageindex: 0,
            pagesize: 0,
          };
          getUser(param).then((res) => {
            if (res.status == 200) {
              let nodes = [];
              for (let i = 0; i < res.data.length; i++) {
                const el = res.data[i];
                nodes.push({
                  factoryName: el.personName,
                  factoryPhone: el.phoneNumber,
                  customerId: el.userId,
                  leaf: true,
                });
              }

              resolve(nodes);
            }
          });
        } else {
          let param = {
            cusName: "",
            phoneNumber: "",
            modelType: 2,
          };
          getFUser(param).then((res) => {
            let nodes = [];
            for (let i = 0; i < res.data.length; i++) {
              const el = res.data[i];
              nodes.push({
                factoryName: el.cusname,
                factoryPhone: el.phonenumber,
                customerId: "",
                leaf: true,
              });
            }

            resolve(nodes);
          });
        }
      }
    },
    factoryChange(val) {
      let nodesObj = this.$refs["cascader"].getCheckedNodes();
      this.form.factoryName = nodesObj[0].data.factoryName;
      this.form.factoryPhone = nodesObj[0].data.factoryPhone;
      this.form.customerId = nodesObj[0].data.customerId;
      setTimeout(() => {
        this.$refs.cascader1.inputValue = nodesObj[0].data.factoryPhone;
      }, 0);
    },
    filterMethod(val) {
      this.$refs.cascader.inputValue = "";
      let data = val.target.value;
      this.form.factoryName = data;
      this.form.customerId = "";
      setTimeout(() => {
        val.target.value = this.form.factoryName;
      }, 0);
    },
    factoryChange1(val) {
      let nodesObj = this.$refs["cascader1"].getCheckedNodes();
      this.form.factoryName = nodesObj[0].data.factoryName;
      this.form.factoryPhone = nodesObj[0].data.factoryPhone;
      this.form.customerId = nodesObj[0].data.customerId;
      setTimeout(() => {
        this.$refs.cascader.inputValue = nodesObj[0].data.factoryName;
      }, 0);
    },
    filterMethod1(val) {
      this.$refs.cascader1.inputValue = "";
      let data = val.target.value;
      this.form.factoryPhone = data;
      this.form.customerId = "";
      setTimeout(() => {
        val.target.value = this.form.factoryPhone;
      }, 0);
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
      this.commodityData[index].commodityIndex = index;
      this.handleJumpDetail("editSalesCommodity", {
        editCommodityData: this.commodityData[index],
      });
    },
    handleEdit1(index) {
      this.handleJumpDetail("addSalesCommodity", {
        isStatus: "add",
        form: {
          factoryName: this.form.factoryName,
          factoryPhone: this.form.factoryPhone,
          customerId: this.form.customerId,
        },
        commodityData: this.commodityData,
      });
    },
    // 商品详情
    handleDetail(index) {
      this.commodityData[index].commodityIndex = index;
      this.handleJumpDetail("editSalesCommodityDetail", {
        editCommodityData: this.commodityData[index],
      });
    },
    handleReference(form, title) {
      this.$refs[form].title = title;
      this.$refs[form].disableSubmit = false;
      this.$refs[form].isVisiable = true;
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
      let next4 = pieceunit == "无" ? "" : "(" + piececount + pieceunit + ")";
      let last =
        basket == 0
          ? ""
          : "|" + basket + '<font style="color:#DF971A;">筐</font>';
      let kuohao1 = subunit2 == "" ? "" : "(";
      let kuohao2 = subunit2 == "" ? "" : ")";
      return first + kuohao1 + next3 + next2 + kuohao2 + next4 + last;
    },
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
      let amountGoods = 0; //商品金额
      let saleBasket = 0; //售出筐子
      let amountBasket = 0; //筐子金额
      let useBuyerBasket = 0; //使用买家筐子
      let basketVacateCount = 0; //腾空筐子

      for (let i = 0; i < this.commodityData.length; i++) {
        const el = this.commodityData[i];
        amountGoods += Number(el.totalAmount) || 0;
        saleBasket += Number(el.userBasketCounts) || 0;
        amountBasket += Number(el.totalAmountBaskets) || 0;
        useBuyerBasket == Number(el.numberBuyersBasket) || 0;
        basketVacateCount == Number(el.basketVacateCount) || 0;
      }

      let datap = {
        amountGoods,
        saleBasket,
        amountBasket,
        useBuyerBasket,
        basketVacateCount,
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
      if (val == 1) {
        this.$refs.ruleForm.validate((valid1) => {
          if (valid1) {
            this.submitData(val);
          }
        });
      } else {
        this.$refs.ruleForm.validate((valid1) => {
          if (valid1) {
            this.submitData(val);
          }
        });
      }
    },
    // 提交数据
    submitData(val) {
      // console.log(this.form);
      // console.log(this.commodityData);

      let paramData = {
        sellUserId: "", // 销售方Id
        buyUserId: this.form.customerId, // 购买方Id
        fromUserName: this.form.customerId ? "" : this.form.factoryName, // 非平台用户，用户名称
        fromUserPhone: this.form.customerId ? "" : this.form.factoryPhone, // 非平台用户手机号
        productKindNums: Number(this.commodityData.length) || 0, // 商品种类
        sellBasketNums: Number(this.basketType().saleBasket) || 0, // 售出筐子数量
        vacateBasketNums: Number(this.basketType().basketVacateCount) || 0, // 腾空筐子数量
        productTotalAmount: Number(this.basketType().amountGoods) || 0, // 商品金额
        basketSellAmount: Number(this.basketType().amountBasket) || 0, // 筐子售出金额
        transinfo: this.form.transinfo2
          ? this.form.transinfo1 + "," + this.form.transinfo2
          : "", // 运输信息
        remark: this.form.remark, // 备注
        orderTotalAmount: Number(this.basketType().amountGoods) || 0, // 合计金额
        productTotalCount: Number(this.commodityData.length) || 0, // 商品数量
        transimage: [], // 运输车图片
        transImageUrl: [], // 运输车图片url,修改时需保留的图片url  新增字段
        sellOrderId: this.form.sellOrderId || "", // 销售单主键id,修改时传
        addInfo: [],
      };

      for (let i = 0; i < this.commodityData.length; i++) {
        const el = this.commodityData[i];

        let param1 = {
          productId: el.productid, // 商品id
          productName: el.productname, // 商品名称
          classifyId: el.classifyid, // 商品二级分类
          regionName: el.regionname, // 产地
          regionId: el.regionid, // 产地id
          variety: el.variety, // 品牌
          subUnit: el.subunit, // 计算单位
          spec: el.spec, // 规格
          other: "", // 其他分类
          subWeight: el.subunitweight || 0, // 单位种类
          sellCount: Number(el.forms.purchasenums) || 0, // 商品数量
          sellPrice: Number(el.forms.sellPrice) || 0, // 售出单价
          basketWeight: Number(el.weightBasket) || 0, // 筐子重量
          productWeight: Number(el.forms.purchasenums - el.weightBasket) || 0, // 商品净重
          productAmount: Number(el.totalAmount) || 0, // 商品金额
          basketKindnums: Number(el.typeBasket) || 0, // 筐子种类
          sellBasketnums: Number(el.userBasketCounts) || 0, // 筐子售出数量
          basketAmount: Number(el.totalAmountBaskets) || 0, // 筐子金额
          sumAmount: Number(el.totalAmount) || 0, // 合计金额
          batchIdList: "", // 批次列表，多个批次id用逗号拼接
          isRemovePeel: el.forms.isRemovePeel, // 是否去皮，0：否，1：是
          basketVacatenums: Number(el.forms.piecenumber) || 0, // 腾空筐子数量
          sellSpec: el.spec, // 售出规格
          sellPieceCount: Number(el.userBasketCounts) || 0, // 售出计件数量
          pieceUnit: el.pieceunit, // 原计件单位--修改字段
          sellPieceUnit: el.forms.pieceUnit, // 售出记件单位--新增字段
          emptyUnitCount: Number(el.basketVacateCount) || 0, // 腾空记件数量--新增字段
          overBatchId: 0, // 报溢批次id,未报溢传0---新增字段
          productOverCount: 0, // 商品报溢数量，未报溢传0
          overProductPieceCount: 0, // 商品报溢计件数量，未报溢传0--新增字段
          isLoad: el.forms.isLoad, // 是否有装载物，0：否，1：是--新增字段,
          isCargoExists: 0, // 已选批次是否有载货筐，1：是，0：否--7.7新增字段
          allBasketInfo: [], // 筐子信息
        };
        let batchids = [];
        el.multipleSelectionList.forEach((element) => {
          batchids.push(element.batchid);
        });
        param1.batchIdList = batchids.toString();

        if (el.tableDataBasket != undefined && el.tableDataBasket.length > 0) {
          for (let j = 0; j < el.tableDataBasket.length; j++) {
            const elj = el.tableDataBasket[j];
            let param2 = {
              userBasketId: elj.userbasketid, // 筐子id
              userBasketColor: elj.basketcolor, // 筐子颜色
              userBasketName: elj.basketname, // 筐子名称
              userBasketPrice: Number(elj.userBasketPrice), // 筐子价格
              type: "3", // 筐子类型，1.自家筐子 2.买家筐子,3.载货筐子, 4.过磅筐子--新增类型, 5.空置筐子--新增类型
              userBasketCount: Number(elj.userBasketCount), // 售出筐子数量/使用买家筐子数量
              totalPrice: Number(elj.userBasketPrice * elj.userBasketCount), // 合计金额
              basketVacateCount: Number(elj.basketVacateCount), // 腾空筐子数量
              basketWeight: Number(elj.basketWeight), // 筐子重量
              basketCargo: Number(elj.basketCargo), // 筐子载货量
              outsellBasketCount: Number(elj.outsellBasketCount), // 筐子出货(过磅)数量--新增字段
              overBatchId: 0, // 报溢批次id,未报溢传0--新增字段
              basketOverCount: 0, // 报溢筐子数量，未报溢传0--新增字段
            };
            param1.allBasketInfo.push(param2);
          }
        }
        if (
          el.tableDataBasket1 != undefined &&
          el.tableDataBasket1.length > 0
        ) {
          for (let j = 0; j < el.tableDataBasket1.length; j++) {
            const elj = el.tableDataBasket1[j];
            let param2 = {
              userBasketId: elj.basketId, // 筐子id
              userBasketColor: elj.basketColor, // 筐子颜色
              userBasketName: elj.basektName, // 筐子名称
              userBasketPrice: Number(elj.userBasketPrice), // 筐子价格
              type: "4", // 筐子类型，1.自家筐子 2.买家筐子,3.载货筐子, 4.过磅筐子--新增类型, 5.空置筐子--新增类型
              userBasketCount: Number(elj.userBasketCount), // 售出筐子数量/使用买家筐子数量
              totalPrice: Number(elj.userBasketPrice * elj.userBasketCount), // 合计金额
              basketVacateCount: Number(elj.basketVacateCount), // 腾空筐子数量
              basketWeight: Number(elj.basketWeight), // 筐子重量
              basketCargo: Number(elj.basketCargo), // 筐子载货量
              outsellBasketCount: Number(elj.outsellBasketCount), // 筐子出货(过磅)数量--新增字段
              overBatchId: 0, // 报溢批次id,未报溢传0--新增字段
              basketOverCount: 0, // 报溢筐子数量，未报溢传0--新增字段
            };
            param1.allBasketInfo.push(param2);
          }
        }
        if (
          el.tableDataBasket2 != undefined &&
          el.tableDataBasket2.length > 0
        ) {
          for (let j = 0; j < el.tableDataBasket2.length; j++) {
            const elj = el.tableDataBasket2[j];
            let param2 = {
              userBasketId: elj.basketid, // 筐子id
              userBasketColor: elj.basketcolor, // 筐子颜色
              userBasketName: elj.basketname, // 筐子名称
              userBasketPrice: Number(elj.userBasketPrice), // 筐子价格
              type: "5", // 筐子类型，1.自家筐子 2.买家筐子,3.载货筐子, 4.过磅筐子--新增类型, 5.空置筐子--新增类型
              userBasketCount: Number(elj.userBasketCount), // 售出筐子数量/使用买家筐子数量
              totalPrice: Number(elj.userBasketPrice * elj.userBasketCount), // 合计金额
              basketVacateCount: 0, // 腾空筐子数量
              basketWeight: Number(elj.basketWeight), // 筐子重量
              basketCargo: Number(elj.basketCargo), // 筐子载货量
              outsellBasketCount: 0, // 筐子出货(过磅)数量--新增字段
              overBatchId: 0, // 报溢批次id,未报溢传0--新增字段
              basketOverCount: 0, // 报溢筐子数量，未报溢传0--新增字段
            };
            param1.allBasketInfo.push(param2);
          }
        }
        if (
          el.tableDataBasket3 != undefined &&
          el.tableDataBasket3.length > 0
        ) {
          for (let j = 0; j < el.tableDataBasket3.length; j++) {
            const elj = el.tableDataBasket3[j];
            let param2 = {
              userBasketId: elj.basketId, // 筐子id
              userBasketColor: elj.basketColor, // 筐子颜色
              userBasketName: elj.basektName, // 筐子名称
              userBasketPrice: 0, // 筐子价格
              type: "2", // 筐子类型，1.自家筐子 2.买家筐子,3.载货筐子, 4.过磅筐子--新增类型, 5.空置筐子--新增类型
              userBasketCount: Number(elj.userBasketCount), // 售出筐子数量/使用买家筐子数量
              totalPrice: 0, // 合计金额
              basketVacateCount: 0, // 腾空筐子数量
              basketWeight: 0, // 筐子重量
              basketCargo: Number(elj.basketCargo), // 筐子载货量
              outsellBasketCount: 0, // 筐子出货(过磅)数量--新增字段
              overBatchId: 0, // 报溢批次id,未报溢传0--新增字段
              basketOverCount: 0, // 报溢筐子数量，未报溢传0--新增字段
            };
            param1.allBasketInfo.push(param2);
          }
        }
        if (
          el.tableDataBasket4 != undefined &&
          el.tableDataBasket4.length > 0
        ) {
          for (let j = 0; j < el.tableDataBasket4.length; j++) {
            const elj = el.tableDataBasket4[j];
            let param2 = {
              userBasketId: elj.basketid, // 筐子id
              userBasketColor: elj.basketcolor, // 筐子颜色
              userBasketName: elj.basketname, // 筐子名称
              userBasketPrice: Number(elj.userBasketPrice), // 筐子价格
              type: "1", // 筐子类型，1.自家筐子 2.买家筐子,3.载货筐子, 4.过磅筐子--新增类型, 5.空置筐子--新增类型
              userBasketCount: Number(elj.userBasketCount), // 售出筐子数量/使用买家筐子数量
              totalPrice: Number(elj.userBasketPrice * elj.userBasketCount), // 合计金额
              basketVacateCount: 0, // 腾空筐子数量
              basketWeight: Number(elj.basketWeight), // 筐子重量
              basketCargo: Number(elj.basketCargo), // 筐子载货量
              outsellBasketCount: Number(elj.outsellBasketCount), // 筐子出货(过磅)数量--新增字段
              overBatchId: 0, // 报溢批次id,未报溢传0--新增字段
              basketOverCount: 0, // 报溢筐子数量，未报溢传0--新增字段
            };
            param1.allBasketInfo.push(param2);
          }
        }

        paramData.addInfo.push(param1);
      }

      this.form.transimageList.forEach((res) => {
        if (res.raw) {
          paramData.transimage.push(res.raw);
        } else {
          paramData.transImageUrl.push(res.url);
        }
      });

      const formData = new FormData();
      Object.keys(paramData).forEach((key) => {
        if (key == "transimage") {
          for (let i = 0; i < paramData.transimage.length; i++) {
            const el = paramData.transimage[i];
            formData.append("transimage", el);
          }
        } else if (key == "addInfo") {
          formData.append(key, JSON.stringify(paramData[key]));
        } else {
          formData.append(key, paramData[key]);
        }
      });
      // console.log(paramData);

      if (val == 1) {
        addSellDraft(formData).then((res) => {
          if (res.status == 200) {
            this.$success("保存成功");
            this.draftaddNum += this.commodityData.length;
          }
        });
      } else {
        addSellInfo(formData).then((res) => {
          if (res.status == 200) {
            this.$success("保存成功");
            this.$closePage("/orderManagement/commoditySalesOrder", {});
          }
        });
      }
    },
    // 跳转页面
    handleJumpDetail: function (form, record) {
      this.$router.push({
        path: form,
        query: {
          data: JSON.stringify(record),
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
  //进入页面触发
  beforeRouteEnter(to, form, next) {
    next((vm) => {
      if (
        form.path == "/orderManagement/addSalesCommodity" ||
        form.path == "/orderManagement/demandOrder" ||
        form.path == "/orderManagement/drafts" ||
        form.path == "/orderManagement/historySellOrder"
      ) {
        // console.log(vm.$store.getters.addNewrequestData);
        let dataP = vm.$store.getters.addNewrequestData;

        if (JSON.stringify(dataP) != "{}") {
          let dataS = dataP.tableDataList;
          for (let i = 0; i < dataS.length; i++) {
            dataS[i].isStatus = "add";
          }
          vm.commodityData = dataS;
        }

        vm.$store.dispatch("common/addNewrequestData", {});
        // console.log(vm.commodityData);
      } else if (form.path == "/orderManagement/commoditySalesOrderDetail") {
        let dataP = vm.$store.getters.addNewrequestData;
        // console.log(dataP);
        vm.form = dataP.param.form;
        vm.commodityData = dataP.param.tableDataList;
        setTimeout(() => {
          vm.$refs.cascader.inputValue = vm.form.factoryName;
          vm.$refs.cascader1.inputValue = vm.form.factoryPhone;
        }, 0);
      } else if (form.path == "/orderManagement/editSalesCommodity") {
        let data = vm.$route.query;
        if (JSON.stringify(data) != "{}") {
          // console.log(data.data);
          let dataS = JSON.parse(data.data);
          vm.$set(vm.commodityData, dataS.commodityIndex, dataS);
        }
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