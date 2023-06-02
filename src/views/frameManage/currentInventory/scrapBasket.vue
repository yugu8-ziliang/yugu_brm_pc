<template>
  <PageNoScroll
    :titleRefresh="false"
    :titleBreak="true"
    @handleBreak="handleBreak"
    class="basketLostModel"
  >
    <!-- 报废筐子 -->
    <div v-show="isConfirm == 1">
      <div style="padding-bottom: 20px; border-bottom: 1px solid #e9e9e9">
        <div
          style="
            margin-bottom: 20px;
            font-size: 16px;
            color: rgba(1, 6, 33, 0.9);
            font-weight: 700;
          "
        >
          选择库存
        </div>

        <div class="search-form-border" style="width: 300px">
          <span class="search-form-title">选择库存</span>
          <el-select
            v-model="form.inventory"
            placeholder="请选择"
            size="mini"
            style="width: 100%"
          >
            <el-option label="当前库存" :value="1"></el-option>
            <el-option label="我的筐子" :value="2"> </el-option>
          </el-select>
        </div>

        <div style="margin: 15px 0px">
          <el-radio-group v-model="form.type">
            <el-radio :label="3" v-if="form.inventory == 1">客户筐子</el-radio>
            <el-radio :label="4" v-if="form.inventory == 1"
              >我的自购筐子（进当前库存）</el-radio
            >
            <el-radio :label="1" v-if="form.inventory == 2"
              >进入当前库存数量</el-radio
            >
            <el-radio :label="2" v-if="form.inventory == 2"
              >进入历史库存数量</el-radio
            >
          </el-radio-group>
        </div>

        <div style="color: #e8541e; font-size: 14px">
          <div v-if="form.type == 3">
            当前库存中，非通过添加自购单进入的筐子库存数量
          </div>
          <div v-if="form.type == 4">当前库存中，通过添加自购进入的筐子</div>
          <div v-if="form.type == 1">
            选择我的筐子-进当前库存数量后，报废的筐子数量将从进当前库存数量的库存中扣除
          </div>
          <div v-if="form.type == 2">
            选择我的筐子-进历史库存数量后，报废的筐子数量将从进历史库存数量的库存中扣除
          </div>
        </div>
      </div>

      <div
        style="
          margin-top: 20px;
          margin-bottom: 20px;
          font-size: 16px;
          color: rgba(1, 6, 33, 0.9);
          font-weight: 700;
        "
      >
        筐子信息
      </div>
      <div
        class="flex_dom"
        style="padding-bottom: 20px; border-bottom: 1px solid #e9e9e9"
      >
        <div>
          <div
            style="
              font-size: 20px;
              color: rgba(1, 6, 33, 0.9);
              font-weight: 700;
              width: 240px;
            "
          >
            {{ basketData.basketName || "&nbsp;" }}
          </div>
          <div
            style="color: rgba(1, 6, 33, 0.9); font-size: 16px; margin-top: 8px"
          >
            <span v-if="form.type == 3">库存数量（载货+空置）：</span>
            <span v-if="form.type == 4">自购筐子剩余数量：</span
            >{{ basketNum || 0 }}个
          </div>
        </div>
        <div>
          <div
            style="
              margin-left: 50px;
              color: rgba(1, 6, 33, 0.9);
              font-size: 16px;
            "
          >
            <span>空置数量：</span>{{ vacantNum || 0 }}个
          </div>

          <div
            style="
              margin-left: 50px;
              color: rgba(1, 6, 33, 0.9);
              font-size: 16px;
            "
          >
            &nbsp;
          </div>
        </div>
      </div>

      <div style="margin-top: 20px">
        <el-scrollbar
          ref="scrollDiv"
          :style="{
            height: $store.getters.screenHeight - 580 + 'px',
          }"
        >
          <div
            v-for="(item, index) in basketData.modelList"
            :key="index"
            class="flex_dom"
            :style="{
              'padding-top': index == 0 ? '0px' : '20px',
              'border-bottom': '1px solid #E9E9E9',
              'padding-bottom': '25px',
            }"
          >
            <div style="width: 240px">
              <div>{{ item.color }}</div>
              <div
                style="
                  margin-top: 32px;
                  color: rgba(1, 6, 33, 0.55);
                  font-size: 14px;
                "
              >
                <span v-if="form.type == 3">库存数量（载货+空置）：</span>
                <span v-if="form.type == 4">自购筐子剩余数量：</span
                >{{ item.cargoCount + item.vacantCount }}个
              </div>
            </div>
            <div style="margin-left: 52px">
              <div><span>空置数量：</span>{{ item.vacantCount }}个</div>
              <div style="margin-top: 25px" class="flex_dom">
                <div style="margin-top: 5px">报废空置：</div>
                <div>
                  <el-form
                    v-if="item.color == '白色'"
                    :inline="true"
                    ref="formModel"
                    class="marginform flex_dom"
                    size="mini"
                    :model="formcolor1"
                    :rules="rules"
                  >
                    <el-form-item label=" " prop="overflowCount">
                      <div class="search-form-border" style="width: 100%">
                        <el-input
                          @focus="handleIndex('formcolor1', index)"
                          v-model="formcolor1.overflowCount"
                          oninput="value=value.replace(/[^\d.]/g,'')"
                          placeholder="请输入"
                          size="mini"
                        ></el-input>
                        <span class="search-form-title-right">个</span>
                      </div>
                    </el-form-item>

                    <div class="flex_dom" style="margin-left: 40px">
                      <div style="white-space: nowrap; margin-top: 3px">
                        残余价值：
                      </div>
                      <el-form-item label="" prop="orderTotalPrice">
                        <div class="search-form-border" style="width: 100%">
                          <el-input
                            v-model="formcolor1.orderTotalPrice"
                            oninput="value=value.replace(/[^\d.]/g,'')"
                            placeholder="请输入"
                            size="mini"
                          ></el-input>
                          <span class="search-form-title-right">元</span>
                        </div>
                      </el-form-item>
                    </div>
                  </el-form>

                  <el-form
                    v-else
                    :inline="true"
                    ref="formModel"
                    class="marginform"
                    size="mini"
                    v-for="(item1, index1) in formcolor2"
                    :key="index1"
                    :model="item1"
                    :rules="rules"
                    :style="{ 'margin-top': index1 != 0 ? '15px' : '' }"
                  >
                    <el-form-item label=" " prop="overflowColor">
                      <div class="search-form-border" style="width: 140px">
                        <el-select
                          v-model="item1.overflowColor"
                          placeholder="请选择或输入"
                          filterable
                          remote
                          :remote-method="
                            (val) => factoryNameRemoteMethod(index1, val)
                          "
                          style="width: 100%"
                        >
                          <el-option
                            v-for="itemOptions in colorOptions"
                            :key="itemOptions.value"
                            :label="itemOptions.label"
                            :value="itemOptions.value"
                          >
                          </el-option>
                        </el-select>
                      </div>
                    </el-form-item>
                    <el-form-item
                      label=" "
                      prop="otherColor"
                      v-if="item1.overflowColor == '其他'"
                    >
                      <div class="search-form-border" style="width: 100%">
                        <el-input
                          v-model="item1.otherColor"
                          placeholder="请输入"
                          size="mini"
                        ></el-input>
                      </div>
                    </el-form-item>
                    <el-form-item label=" " prop="overflowCount">
                      <div class="search-form-border" style="width: 100%">
                        <el-input
                          @focus="handleIndex('formcolor2', index)"
                          v-model="item1.overflowCount"
                          oninput="value=value.replace(/[^\d.]/g,'')"
                          placeholder="请输入"
                          size="mini"
                        ></el-input>
                        <span class="search-form-title-right">个</span>
                      </div>
                    </el-form-item>

                    <el-form-item label=" " v-if="index1 != 0">
                      <el-button
                        style="
                          margin-top: 3px;
                          margin-left: 10px;
                          color: #dd4c4d;
                        "
                        @click="handleRemove(index1)"
                        size="mini"
                        type="text"
                        >移除</el-button
                      >
                    </el-form-item>
                  </el-form>

                  <el-button
                    v-if="item.color != '白色'"
                    style="
                      margin-left: 13px;
                      margin-top: 15px;
                      color: var(--color-primary);
                      border: 1px solid var(--color-primary);
                    "
                    @click="handleAdd()"
                    size="mini"
                    >添加</el-button
                  >
                </div>
              </div>
              <div
                class="flex_dom"
                v-if="item.color != '白色'"
                style="margin-top: 15px"
              >
                <div style="white-space: nowrap">残余价值：</div>
                <el-form
                  v-if="item.color != '白色'"
                  :inline="true"
                  ref="formModel3"
                  class="marginform"
                  size="mini"
                  :model="formcolor4"
                  :rules="rules"
                >
                  <el-form-item label=" " prop="orderTotalPrice">
                    <div class="search-form-border" style="width: 100%">
                      <el-input
                        v-model="formcolor4.orderTotalPrice"
                        placeholder="请输入"
                        size="mini"
                      ></el-input>
                      <span class="search-form-title-right">元</span>
                    </div>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </div>

          <div style="padding: 20px 0px; border-bottom: 1px solid #e9e9e9">
            <div
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 16px;
                font-weight: 700;
              "
            >
              收筐人信息
            </div>
            <div style="margin-top: 20px">
              <el-form
                :inline="true"
                ref="formModel4"
                class="marginform flex_dom"
                size="mini"
                :model="formcolor4"
                :rules="rules"
              >
                <div class="flex_dom">
                  <div style="white-space: nowrap; margin-top: 3px">
                    收筐人信息：
                  </div>
                  <el-form-item label="" prop="fromUserName">
                    <div class="search-form-border" style="width: 100%">
                      <el-select
                        ref="factorySelect"
                        style="width: 200px"
                        v-model="formcolor4.fromUserName"
                        filterable
                        remote
                        :remote-method="factoryNameRemoteMethodName"
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
                    </div>
                  </el-form-item>
                </div>

                <div class="flex_dom">
                  <div
                    style="
                      white-space: nowrap;
                      margin-top: 3px;
                      margin-left: 30px;
                    "
                  >
                    收筐人电话：
                  </div>
                  <el-form-item label="" prop="fromUserPhone">
                    <div class="search-form-border" style="width: 100%">
                      <el-select
                        ref="factorySelect"
                        style="width: 200px"
                        v-model="formcolor4.fromUserPhone"
                        filterable
                        remote
                        :remote-method="factoryNameRemoteMethodPhone"
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
                    </div>
                  </el-form-item>
                </div>
              </el-form>
            </div>
          </div>
          <div
            style="
              margin: 20px 0px 10px;
              color: rgba(1, 6, 33, 0.9);
              font-weight: 700;
            "
          >
            备注信息
          </div>
          <div style="margin-right: 15px; padding-bottom: 20px">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="form.textarea"
            >
            </el-input>
          </div>
        </el-scrollbar>
      </div>

      <div
        style="border-top: 1px solid #e9e9e9; padding: 10px 0px 0px"
        class="flex_dom flex_row_reverse flex_item_mid"
      >
        <el-button type="primary" @click="confirmAdd">提交订单</el-button>
      </div>
    </div>
    <!-- 确认页面 -->
    <div v-if="isConfirm == 2" class="confirmPage">
      <div
        style="
          margin-bottom: 8px;
          font-size: 16px;
          color: rgba(1, 6, 33, 0.9);
          font-weight: 700;
        "
      >
        报废库存
      </div>
      <div style="font-size: 16px; color: rgba(1, 6, 33, 0.9)">
        使用库存：
        <span v-if="form.type == 3">客户筐子</span>
        <span v-if="form.type == 4">我的自购筐子（进当前库存）</span>
      </div>

      <div
        style="
          margin-top: 15px;
          margin-bottom: 8px;
          font-size: 16px;
          color: rgba(1, 6, 33, 0.9);
          font-weight: 700;
        "
      >
        收筐人信息
      </div>

      <div style="font-size: 16px; color: rgba(1, 6, 33, 0.9)" class="flex_dom">
        <div>
          <span
            style="
              color: rgba(1, 6, 33, 0.9);
              font-size: 16px;
              margin-right: 5px;
            "
            >收筐人姓名：{{ formcolor4.fromUserName || "&nbsp;" }}</span
          >
          <el-tag class="elTagbg4" size="mini">非</el-tag>
        </div>

        <div style="margin-left: 40px">
          <span style="color: rgba(1, 6, 33, 0.9); font-size: 16px"
            >收筐人电话：{{ formcolor4.fromUserPhone || "&nbsp;" }}</span
          >
        </div>
      </div>
      <div style="margin-top: 20px">
        <el-scrollbar
          :style="{
            height: $store.getters.screenHeight - 350 + 'px',
          }"
        >
          <u-table
            ref="plTable"
            class="utable"
            :max-height="$store.getters.screenHeight - 400 + 'px'"
            :border="false"
            :header-row-style="{ height: '46px' }"
            :header-cell-style="{
              padding: '0px 0px',
              'font-size': '14px',
              color: 'rgba(1, 6, 33, 0.65)',
              background: 'rgba(0, 0, 0, 0.02)',
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
            :summary-method="summaryMethod"
          >
            <template slot="empty"> 没有查询到符合条件的记录 </template>
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
              :sortable="item.sortable"
            />
          </u-table>
          <div
            style="
              color: rgba(1, 6, 33, 0.9);
              font-size: 14px;
              margin-top: 20px;
            "
            class="flex_dom"
          >
            <div style="white-space: nowrap">备注：</div>
            <div>{{ form.textarea }}</div>
          </div>
        </el-scrollbar>

        <div
          style="padding: 10px 0px 0px"
          class="confirmView flex_dom flex_item_mid"
        >
          <el-button
            style="
              color: var(--color-primary);
              border: 1px solid var(--color-primary);
            "
            @click="confirmAndView(1)"
            size="small"
            >确认并收款</el-button
          >
          <el-button type="primary" @click="confirmAndView(2)" size="small"
            >确认并返回</el-button
          >
        </div>
      </div>
    </div>
  </PageNoScroll>
</template>

<script>
import { Base64 } from "js-base64";
import { basketScrap } from "@/request/api/frameManage/index";
import { unplatformlist } from "@/request/api/customerManage/customer";
import { validPhone } from "@/utils/validate.js";

export default {
  name: "basketLost",
  data() {
    var valiOverflowCount = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入报废空置"));
      } else {
        let vacantCount =
          this.basketData.modelList[this.formIndex.index].vacantCount || 0;
        let Num = 0;
        if (this.formIndex.name == "formcolor2") {
          this.formcolor2.forEach((res) => {
            Num += Number(res.overflowCount);
          });
        } else {
          Num = Number(value);
        }
        if (Number(Num) > Number(vacantCount)) {
          let String = "最多可报废" + vacantCount + "个";
          callback(new Error(String));
        } else {
          if (this.basketData.modelList.length == 1) {
            if (this.basketData.modelList[0].color != "白色") {
              for (let i = 0; i < this.$refs.formModel.length; i++) {
                this.$refs.formModel[i].clearValidate();
              }
            }
          } else {
            for (let i = 1; i < this.$refs.formModel.length; i++) {
              this.$refs.formModel[i].clearValidate();
            }
          }
          callback();
        }
      }
    };
    var valiOverflowColor = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入或选择颜色"));
      } else {
        callback();
      }
    };
    var valiOrderTotalPrice = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入残余价值"));
      } else {
        callback();
      }
    };
    var valiFromUserName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入或选择收筐人信息"));
      } else {
        callback();
      }
    };
    var valiFromUserPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入或选择收筐人电话"));
      } else {
        if (validPhone(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      form: {
        inventory: 1,
        type: 3,
        textarea: "",
      },
      formcolor1: { overflowCount: null, orderTotalPrice: "" },
      formcolor2: [],
      formcolor4: {
        orderTotalPrice: "",
        fromUserName: "", //收筐人姓名 不需要传""
        fromUserPhone: "", // 收筐人手机号 不需要传 ""
      },
      formIndex: {
        name: "",
        index: null,
      },
      basketData: {},
      isConfirm: 1,
      colorOptions: [
        {
          value: "红色",
          label: "红色",
        },
        {
          value: "黄色",
          label: "黄色",
        },
        {
          value: "蓝色",
          label: "蓝色",
        },
        {
          value: "绿色",
          label: "绿色",
        },
        {
          value: "黑色",
          label: "黑色",
        },
        {
          value: "灰色",
          label: "灰色",
        },
        {
          value: "其他",
          label: "其他",
        },
      ],
      columns: [
        {
          // width: 200,
          prop: "basketColor",
          label: "报废颜色",
          align: "left",
        },
        {
          // width: 200,
          prop: "overflowCount",
          label: "报废数量（个）",
          align: "left",
        },
        {
          // width: 200,
          prop: "orderTotalPrice",
          label: "残余价值（元）",
          align: "left",
        },
      ],
      tableDataList: [],
      rules: {
        otherColor: [
          { required: true, message: "请输入筐子颜色", trigger: "blur" },
        ],
        overflowCount: [
          {
            validator: valiOverflowCount,
            trigger: ["blur", "change"],
          },
        ],
        overflowColor: [
          {
            validator: valiOverflowColor,
            trigger: ["blur", "change"],
          },
        ],
        orderTotalPrice: [
          {
            validator: valiOrderTotalPrice,
            trigger: ["blur", "change"],
          },
        ],
        fromUserName: [
          {
            validator: valiFromUserName,
            trigger: ["blur", "change"],
          },
        ],
        fromUserPhone: [
          {
            validator: valiFromUserPhone,
            trigger: ["blur", "change"],
          },
        ],
      },
      factoryOptions: [],
      factoryOptionsPhone: [],
    };
  },
  computed: {
    basketNum() {
      let num = 0;
      this.basketData.modelList.forEach((res) => {
        num += res.cargoCount + res.vacantCount;
      });
      return num;
    },
    vacantNum() {
      let num = 0;
      this.basketData.modelList.forEach((res) => {
        num += res.vacantCount;
      });
      return num;
    },
  },
  methods: {
    initData() {
      let { data: data } = this.$route.query;
      // 判断url是否为空
      if (data) {
        // 解析数据
        try {
          let param = JSON.parse(Base64.decode(data));
          if (!param.basketId) {
            this.handleRouter();
            return;
          }
          this.getunplatformlist();

          this.basketData = param;
          let unshiftNum = null;
          let unshiftData = {};
          for (let i = 0; i < this.basketData.modelList.length; i++) {
            const el = param.modelList[i];
            if (el.color == "白色") {
              this.formcolor1 = {
                overflowCount: null,
                orderTotalPrice: "",
              };
              unshiftNum = i;
              unshiftData = this.basketData.modelList[i];
            } else {
              this.formcolor2.push({
                overflowCount: null,
                overflowColor: "",
              });
            }
          }
          if (unshiftNum) {
            this.basketData.modelList.splice(unshiftNum, 1); // 如果数据组存在该元素，则把该元素删除
            this.basketData.modelList.unshift(unshiftData); // 再添加到第一个位置
          }
        } catch (error) {
          this.handleRouter();
        }
        return;
      }
      this.handleRouter();
    },
    // 跳转
    handleRouter() {
      setTimeout(() => {
        this.$store
          .dispatch("tagsView/delView", {
            path: this.$route.path,
          })
          .then(({ visitedViews }) => {
            this.$router.push({ path: "/frameManage/currentInventory" });
          });
      }, 0);
    },
    getunplatformlist() {
      //获取厂商名称
      let param1 = {
        cusName: "", // 客户名称
        phoneNumber: "", // 手机号搜索
        modelType: 9,
      };
      unplatformlist(param1).then((res) => {
        if (res.status == 200) {
          this.factoryOptions = res.data;
          this.factoryOptionsPhone = res.data;
        }
      });
    },
    // 厂商名称远程搜索
    factoryNameRemoteMethodName(query) {
      this.formcolor4.fromUserName = query;
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
    factoryNameRemoteMethodPhone(query) {
      this.formcolor4.fromUserPhone = query;

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
      this.formcolor4.fromUserName = item.cusname;
      this.formcolor4.fromUserPhone = item.phonenumber;
    },
    // 添加
    handleAdd() {
      this.formcolor2.push({
        overflowCount: null,
        overflowColor: "",
        otherColor: "",
      });
    },
    // 移除
    handleRemove(val) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.formcolor2.splice(val, 1);
        })
        .catch(() => {});
    },
    factoryNameRemoteMethod(index, val) {
      this.formcolor2[index].overflowColor = val;
    },
    handleIndex(name, index) {
      this.formIndex = {
        name: name,
        index: index,
      };
    },
    // 确认添加
    async confirmAdd() {
      if (this.isConfirm == 1) {
        let data = await this.handleValidate();
        if (data) {
          this.tableDataList = [];

          if (this.basketData.modelList.length == 1) {
            if (this.basketData.modelList[0].color == "白色") {
              this.tableDataList.push({
                basketColor: this.basketData.modelList[0].color,
                overflowCount: this.formcolor1.overflowCount,
                orderTotalPrice: this.formcolor1.orderTotalPrice,
                isCol: 1,
              });
            } else {
              this.formcolor2.forEach((res, i) => {
                this.tableDataList.push({
                  basketColor: "彩色-" + res.overflowColor,
                  overflowCount: res.overflowCount,

                  orderTotalPrice: i == 0 ? this.formcolor4.orderTotalPrice : 0,
                  isCol: i == 0 ? this.formcolor2.length : null,
                });
              });
            }
          } else {
            this.tableDataList.push({
              basketColor: this.basketData.modelList[0].color,
              overflowCount: this.formcolor1.overflowCount,
              orderTotalPrice: this.formcolor1.orderTotalPrice,
              isCol: 1,
            });
            this.formcolor2.forEach((res, i) => {
              this.tableDataList.push({
                basketColor: "彩色-" + res.overflowColor,
                overflowCount: res.overflowCount,
                orderTotalPrice: i == 0 ? this.formcolor4.orderTotalPrice : 0,
                isCol: i == 0 ? this.formcolor2.length : null,
              });
            });
          }

          this.isConfirm = 2;
        }
      }
    },
    // 确认并查看 确认并返回
    confirmAndView(val) {
      this.$confirm("确认报废筐子?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let param = {
            typeView: 1, // 1 报废 2 报失 3 报溢  必传
            type: this.form.type, //见下方
            remark: this.form.textarea, // 备注
            fromUserName: this.formcolor4.fromUserName, //收筐人姓名 不需要传""
            fromUserPhone: this.formcolor4.fromUserPhone, //收筐人手机号 不需要传 ""
            scrapList: [],
          };

          if (this.basketData.modelList.length == 1) {
            if (this.basketData.modelList[0].color == "白色") {
              param.scrapList.push({
                userBasketId: this.basketData.basketId, // 筐子主键id 必传
                orderTotalPrice: this.formcolor1.orderTotalPrice, //残余价值 不需要传 0
                basketColor: [
                  {
                    basketColor: this.basketData.modelList[0].color,
                    basketCount: this.formcolor1.overflowCount,
                  },
                ],
              });
            } else {
              param.scrapList.push({
                userBasketId: this.basketData.basketId, // 筐子主键id 必传
                orderTotalPrice: this.formcolor4.orderTotalPrice, //残余价值 不需要传 0
                basketColor: [],
              });
              this.formcolor2.forEach((res) => {
                param.scrapList[0].basketColor.push({
                  basketColor:
                    res.otherColor == ""
                      ? "彩色-" + res.overflowColor
                      : "彩色-" + res.otherColor,
                  basketCount: res.overflowCount,
                });
              });
            }
          } else {
            param.scrapList.push({
              userBasketId: this.basketData.basketId, // 筐子主键id 必传
              orderTotalPrice: this.formcolor1.orderTotalPrice, //残余价值 不需要传 0
              basketColor: [
                {
                  basketColor: this.basketData.modelList[0].color,
                  basketCount: this.formcolor1.overflowCount,
                },
              ],
            });
            param.scrapList.push({
              userBasketId: this.basketData.basketId, // 筐子主键id 必传
              orderTotalPrice: this.formcolor4.orderTotalPrice, //残余价值 不需要传 0
              basketColor: [],
            });
            this.formcolor2.forEach((res) => {
              param.scrapList[1].basketColor.push({
                basketColor:
                  res.otherColor == ""
                    ? "彩色-" + res.overflowColor
                    : "彩色-" + res.otherColor,
                basketCount: res.overflowCount,
              });
            });
          }

          basketScrap(param).then((res) => {
            if (res.status == 200) {
              this.$msgbox({
                type: "success",
                title: "提示",
                message: "操作成功，等待跳转",
                showClose: false,
                showCancelButton: false,
                showConfirmButton: false,
              }).then((action) => {});
              setTimeout(() => {
                if (val == 2) {
                  this.$store
                    .dispatch("tagsView/delView", {
                      path: this.$route.path,
                    })
                    .then(({ visitedViews }) => {
                      this.$msgbox.close();
                      this.$router.push({
                        path: "/frameManage/currentInventory",
                      });
                    });
                }
              }, 3000);
            } else if (res.status == -6) {
              this.$error("库存不足！");
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    // 获取多个form验证结果，具体参考第二种form代码
    handleValidate() {
      const list = [];
      const validas = [];
      this.$refs.formModel.forEach((item, index) => {
        // 把单个验证结果处理为promise函数，然后添加到list中
        list.push(
          new Promise((resolve) => {
            item.validate((valida) => {
              validas.push(valida);
              resolve();
            });
          })
        );
      });

      if (this.basketData.modelList[0].color != "白色") {
        let item3 = this.$refs.formModel3[0];
        list.push(
          new Promise((resolve) => {
            item3.validate((valida) => {
              validas.push(valida);
              resolve();
            });
          })
        );
      }

      let item4 = this.$refs.formModel4;
      list.push(
        new Promise((resolve) => {
          item4.validate((valida) => {
            validas.push(valida);
            resolve();
          });
        })
      );

      // 通过Promise.all等待几个验证都完成再处理
      return Promise.all([...list])
        .then(() => {
          const res = !validas.some((item) => item === false);
          return res;
        })
        .catch(() => {
          return false;
        });
    },
    // 合并列
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
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
    // 合计
    summaryMethod({ columns, data }) {
      const means = []; // 合计
      columns.forEach((column, columnIndex) => {
        if (column.property == "basketColor") {
          means.push(
            '<span style="color: rgba(1, 6, 33, 0.9);font-size:18px;font-weight: 700;">' +
              "总计"
          );
        } else {
          if (
            column.property == "overflowCount" ||
            column.property == "orderTotalPrice"
          ) {
            const values = data.map((item) => Number(item[column.property]));
            // 合计
            if (!values.every((value) => isNaN(value))) {
              means[columnIndex] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              // means[columnIndex] += ' 元'
              // 改变了ele的合计方式，扩展了合计场景
              // 你以为就只有上面这样玩吗？错啦，你还可以自定义样式哦
              // means[columnIndex] = '<span style="color: red">' + means[columnIndex] + '元</span>'
              if (column.property == "overflowCount") {
                means[columnIndex] =
                  '<span style="color: rgba(1, 6, 33, 0.9);font-size:18px;font-weight: 700;">' +
                  means[columnIndex] +
                  "</span>";
              }
              if (column.property == "orderTotalPrice") {
                means[columnIndex] =
                  '<span style="color: rgba(232, 84, 30, 1);font-size:18px;font-weight: 700;">' +
                  means[columnIndex] +
                  "</span>";
              }
            } else {
              means[columnIndex] = "";
            }
          }
        }
      });
      // 返回一个二维数组的表尾合计(不要平均值，你就不要在数组中添加)
      return [means];
    },
    // 返回
    handleBreak() {
      this.isConfirm = 1;
    },
  },
  created() {
    this.initData();
  },
};
</script>

<style lang="scss" scoped>
.basketLostModel {
  .el-form-item {
    margin-bottom: 0px !important;
  }

  .search-form-border {
    display: flex;
    align-items: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;

    .search-form-title {
      padding: 2px 8px;
      margin: -1px 0px -1px;
      white-space: nowrap;
      font-size: 14px;
      color: rgba(1, 6, 33, 0.35);
    }
    .search-form-title-right {
      border-left: 1px solid #dcdfe6;
      padding: 2px 8px;
      margin: -1px 0px -1px;
      white-space: nowrap;
      font-size: 14px;
      color: rgba(1, 6, 33, 0.35);
    }

    i {
      color: #c0c4cc;
      margin: 0px 6px;
    }

    ::v-deep .el-input {
      line-height: 25px;
    }

    ::v-deep .el-input__inner {
      border: none;
      padding: 0px 5px;
      height: 30px;
      line-height: 30px;
    }

    ::v-deep .el-range__icon {
      display: none;
    }
  }

  .confirmPage {
    // position: relative;
    .utable {
      width: 100%;
      border-top: 1px solid #e9e9e9;
      border-left: 1px solid #e9e9e9;
      border-right: 1px solid #e9e9e9;
    }
    .confirmView {
      position: absolute;
      bottom: 15px;
      right: 15px;
    }
  }
}
</style>

<style lang="scss">
.basketLostModel {
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

.myselect {
  .el-cascader-menu:last-child {
    .el-cascader-node {
      height: 55px !important;
      line-height: 25px !important;
    }
  }

  .el-cascader-menu:first-child {
    .el-cascader-node {
      height: 34px !important;
      line-height: 34px !important;
    }
  }
}
</style>