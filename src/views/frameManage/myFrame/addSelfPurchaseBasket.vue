<template>
  <PageNoScroll
    :titleRefresh="false"
    :titleBreak="true"
    @handleBreak="handleBreak"
    class="addSelfPurchaseBasketModel"
  >
    <!-- 添加自购筐子 -->
    <div v-show="isConfirm == 1">
      <div
        style="
          margin-bottom: 16px;
          font-size: 16px;
          color: rgba(1, 6, 33, 0.9);
          font-weight: 700;
        "
      >
        选择进入库存
      </div>
      <div style="font-size: 16px; color: rgba(1, 6, 33, 0.9)">
        <el-radio-group v-model="form.type">
          <el-radio :label="1">添加至当前库存数量</el-radio>
          <el-radio :label="2">添加至历史库存数量</el-radio>
        </el-radio-group>
      </div>
      <div
        style="
          color: #dd4c4d;
          font-size: 14px;
          margin: 16px 0px 0px;
          padding-bottom: 21px;
          border-bottom: 1px solid #e9e9e9;
        "
      >
        <span v-if="form.type == 1"
          >添加至当前库存后，筐子当前库存有该自购单的添加数量，自购单需进入财务管理添加付款</span
        >
        <span v-if="form.type == 2"
          >添加至历史库存后，筐子当前库存无该自购单的库存数只作为历史记录</span
        >
      </div>

      <div style="margin-top: 20px">
        <el-scrollbar
          ref="scrollDiv"
          :style="{
            height: $store.getters.screenHeight - 385 + 'px',
          }"
        >
          <div
            style="
              font-size: 16px;
              color: rgba(1, 6, 33, 0.9);
              font-weight: 700;
              margin-bottom: 20px;
            "
          >
            筐子来源
          </div>

          <el-form
            ref="formModel"
            class="marginform"
            label-width="125px"
            size="small"
            style="max-width: 600px; margin-bottom: 20px"
            :model="form"
            :rules="rules"
          >
            <!--   @change="factoryChange" -->
            <el-form-item label="厂商名称：" prop="factoryName">
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
            <el-form-item label="厂商电话：" prop="factoryPhone">
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
            <el-form-item label="购入时间：" prop="buyTimestamp">
              <div class="search-form-border" style="line-height: 30px">
                <el-date-picker
                  v-model="form.buyTimestamp"
                  value-format="timestamp"
                  type="date"
                  placeholder="请选择时间"
                  style="width: 100%"
                >
                </el-date-picker>
                <div
                  style="
                    background: #f5f7fa;
                    border-left: 1px solid #dcdfe6;
                    padding: 0 10px;
                  "
                >
                  <i class="el-icon-date" style=""></i>
                </div>
              </div>
            </el-form-item>
          </el-form>

          <div
            style="
              font-size: 16px;
              color: rgba(1, 6, 33, 0.9);
              font-weight: 700;
              border-top: 1px solid #e9e9e9;
              padding: 19px 0px 15px;
            "
          >
            筐子信息
          </div>

          <el-form
            ref="formModel1"
            class="marginform"
            label-width="125px"
            size="small"
            style="max-width: 600px; margin-top: 10px"
            :model="form"
            :rules="rules"
          >
            <el-form-item label="筐子种类：" prop="basketId">
              <el-cascader
                :show-all-levels="false"
                style="width: 100%"
                v-model="form.basketId"
                :options="tableOptions"
                :props="cascaderProps"
                placeholder="请选择"
                size="small"
                popper-class="myselect"
                :popper-append-to-body="false"
                @change="handleBasket()"
                ref="myCascader"
              >
                <template slot-scope="{ node, data }">
                  <div v-if="node.level == 1">{{ data.name }}</div>
                  <div v-else-if="node.level == 2">
                    <div>【{{ data.applytoName }}】{{ data.typeName }}</div>
                    <div>&nbsp; 筐子重量： {{ data.weight }}斤左右</div>
                  </div>
                </template>
              </el-cascader>
            </el-form-item>
            <el-form-item label="筐子颜色：" prop="basketColor">
              <el-cascader
                id="basketColorcascader"
                ref="basketColorcascader"
                :show-all-levels="false"
                v-model="form.basketColor"
                :options="basketColorOptions"
                filterable
                @blur="basketColorBlur"
                placeholder="请输入或选择"
                size="small"
                style="width: 100%"
              ></el-cascader>
            </el-form-item>
            <el-form-item
              label="其他颜色："
              prop="otherColor"
              v-if="form.basketColor[1] == '其他'"
            >
              <el-input
                v-model="form.otherColor"
                style="width: 100%"
                placeholder="请输筐子颜色"
              ></el-input>
            </el-form-item>
            <el-form-item
              label="筐子规格(cm)："
              required
              class="elformitemMargin"
            >
              <el-col :span="7">
                <el-form-item prop="basketLength">
                  <el-input
                    v-model="form.basketLength"
                    style="width: 100%"
                    placeholder="请输入长"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="1" style="margin: 0px 0px 0px 9px">×</el-col>
              <el-col :span="7">
                <el-form-item prop="basketWidth">
                  <el-input
                    v-model="form.basketWidth"
                    style="width: 100%"
                    placeholder="请输入宽"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="1" style="margin: 0px 0px 0px 9px">×</el-col>
              <el-col :span="7">
                <el-form-item prop="basketHeight">
                  <el-input
                    v-model="form.basketHeight"
                    style="width: 100%"
                    placeholder="请输入高"
                    oninput="value=value.replace(/[^\d.]/g,'')"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-form-item>

            <el-form-item label="筐子重量：" prop="basketWeight">
              <el-input
                v-model="form.basketWeight"
                placeholder="请输入"
                oninput="value=value.replace(/[^\d.]/g,'')"
              >
                <template slot="append">斤/个</template></el-input
              >
            </el-form-item>
            <el-form-item label="筐子数量：" prop="basketCount">
              <el-input
                v-model="form.basketCount"
                placeholder="请输入"
                oninput="value=value.replace(/[^\d.]/g,'')"
                ><template slot="append"
                  >&nbsp;&nbsp;个&nbsp;&nbsp;&nbsp;
                </template></el-input
              >
            </el-form-item>
            <el-form-item label="筐子单价：" prop="basketPrice">
              <el-input
                v-model="form.basketPrice"
                placeholder="请输入"
                oninput="value=value.replace(/[^\d.]/g,'')"
                ><template slot="append">元/个</template></el-input
              >
            </el-form-item>
            <el-form-item label="备注信息：">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入"
                v-model="form.remark"
              ></el-input>
            </el-form-item>
          </el-form>
        </el-scrollbar>
      </div>

      <div
        style="border-top: 1px solid #e9e9e9; padding: 10px 0px 0px"
        class="flex_dom flex_row_reverse flex_item_mid"
      >
        <el-button type="primary" @click="confirmAdd">提交订单</el-button>
        <span
          style="
            color: rgba(1, 6, 33, 0.9);
            font-size: 14px;
            margin-right: 20px;
          "
          >金额合计：<span style="color: #dd4c4d; font-size: 20px"
            >{{ totalAmount | intervalFormat(false) }}元</span
          ></span
        >
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
        选择进入库存
      </div>
      <div style="font-size: 16px; color: rgba(1, 6, 33, 0.9)">
        进入库存：{{
          this.form.type == 1 ? "添加至当前库存数量" : "添加至历史库存数量"
        }}
      </div>
      <div
        style="
          margin-top: 20px;
          margin-bottom: 8px;
          font-size: 16px;
          color: rgba(1, 6, 33, 0.9);
          font-weight: 700;
        "
      >
        筐子来源
      </div>
      <div style="font-size: 16px; color: rgba(1, 6, 33, 0.9)" class="flex_dom">
        <div>
          厂商名称：{{ form.factoryName }}
          <el-tag type="danger" size="mini">非</el-tag>
        </div>
        <div style="margin-left: 50px">厂商电话：{{ form.factoryPhone }}</div>
        <div style="margin-left: 50px">
          购入时间：{{ parseTime(form.buyTimestamp / 1000, "{y}-{m}-{d}") }}
        </div>
      </div>

      <div style="margin-top: 20px">
        <div
          style="
            font-size: 16px;
            color: rgba(1, 6, 33, 0.9);
            font-weight: 700;
            margin-bottom: 10px;
          "
        >
          筐子信息
        </div>
        <div
          style="
            margin-bottom: 10px;
            font-size: 16px;
            color: rgba(1, 6, 33, 0.9);
          "
        >
          筐子种类：{{ this.form.basketName }}
        </div>
        <el-scrollbar
          ref="scrollDiv"
          :style="{
            height: $store.getters.screenHeight - 465 + 'px',
          }"
        >
          <u-table
            ref="plTable"
            class="utable"
            :max-height="$store.getters.screenHeight - 542 + 'px'"
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
            >
              <template slot-scope="scope">
                <span v-if="item.prop == 'basketLength'">
                  {{ scope.row.basketLength }}cm*{{
                    scope.row.basketWidth
                  }}cm*{{ scope.row.basketHeight }}cm
                </span>
                <span v-else-if="item.prop == 'basketWeight'">
                  {{ scope.row.basketHeight }}斤/个
                </span>
                <span
                  v-else-if="
                    item.prop == 'basketPrice' || item.prop == 'basketAmount'
                  "
                >
                  {{ scope.row[item.prop] | intervalFormat(false) }}
                </span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
            </u-table-column>
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
            <div>{{ this.form.remark }}</div>
          </div>
        </el-scrollbar>

        <div
          style="padding: 10px 0px 0px"
          class="confirmView flex_dom flex_item_mid"
        >
          <span
            style="
              color: rgba(1, 6, 33, 0.9);
              font-size: 14px;
              margin-right: 20px;
            "
            >金额合计：<span style="color: #dd4c4d; font-size: 20px"
              >{{ totalAmount | intervalFormat(false) }}元</span
            ></span
          >
          <el-button
            style="
              color: var(--color-primary);
              border: 1px solid var(--color-primary);
            "
            @click="confirmAndView(1)"
            size="small"
            >{{ form.type == 1 ? "确认并付款" : "确认并查看" }}</el-button
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
import { unplatformlist } from "@/request/api/customerManage/customer";
import {
  userSystemBasket,
  addUserBasketBuyMyself,
} from "@/request/api/frameManage/index";
import { param } from "@/utils/common";
import { validPhone } from "@/utils/validate.js";
import { parseTime } from "@/utils/common";

export default {
  name: "addSelfPurchaseBasket",
  data() {
    var valiFactoryPhone = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入或选择厂商电话"));
      } else {
        if (validPhone(value)) {
          callback();
        } else {
          callback(new Error("请输入正确的手机号"));
        }
      }
    };
    return {
      parseTime,
      form: {
        type: 1,
        factoryName: "",
        factoryPhone: "",
        buyTimestamp: "",
        basketId: [],
        basketColor: [],
        basketLength: "",
        basketWidth: "",
        basketHeight: "",
        basketWeight: "",
        basketCount: "",
        basketPrice: "",
        remark: "",
      },
      factoryOptions: [],
      factoryOptionsPhone: [],
      basketColorOptions: [
        {
          value: "白色",
          label: "白色",
        },
        {
          value: "彩色",
          label: "彩色",
          children: [
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
        },
      ],
      isConfirm: 1,
      columns: [
        {
          // width: 200,
          prop: "basketColor",
          label: "颜色",
          align: "left",
        },
        {
          // width: 200,
          prop: "basketLength",
          label: "规格",
          align: "left",
        },
        {
          // width: 200,
          prop: "basketWeight",
          label: "重量",
          align: "left",
        },
        {
          // width: 200,
          prop: "basketCount",
          label: "数量（个）",
          align: "left",
        },
        {
          // width: 200,
          prop: "basketPrice",
          label: "单价（元）",
          align: "left",
        },
        {
          // width: 200,
          prop: "basketAmount",
          label: "金额（元）",
          align: "left",
        },
      ],
      tableOptions: [],
      tableDataList: [],
      rules: {
        otherColor: [
          {
            required: true,
            message: "请输入其他颜色",
            trigger: ["blur", "change"],
          },
        ],
        factoryName: [
          {
            required: true,
            message: "请输入或选择厂商名称",
            trigger: ["blur", "change"],
          },
        ],
        factoryPhone: [
          {
            validator: valiFactoryPhone,
            trigger: ["blur", "change"],
          },
        ],

        buyTimestamp: [
          {
            required: true,
            message: "请选择购入时间",
            trigger: ["blur", "change"],
          },
        ],
        basketId: [
          {
            required: true,
            message: "请选择筐子种类",
            trigger: ["blur", "change"],
          },
        ],
        basketColor: [
          {
            required: true,
            message: "请输入或选择筐子颜色",
            trigger: ["blur", "change"],
          },
        ],
        basketLength: [
          {
            required: true,
            message: "请请输入长",
            trigger: ["blur", "change"],
          },
        ],
        basketWidth: [
          {
            required: true,
            message: "请请输入宽",
            trigger: ["blur", "change"],
          },
        ],
        basketHeight: [
          {
            required: true,
            message: "请请输入高",
            trigger: ["blur", "change"],
          },
        ],
        basketWeight: [
          {
            required: true,
            message: "请输入筐子重量",
            trigger: ["blur", "change"],
          },
        ],
        basketCount: [
          {
            required: true,
            message: "请输入筐子数量",
            trigger: ["blur", "change"],
          },
        ],
        basketPrice: [
          {
            required: true,
            message: "请输入筐子单价",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  computed: {
    totalAmount() {
      let num = 0;
      num = Number(this.form.basketCount) * Number(this.form.basketPrice);
      return num;
    },
    // 懒加载
    cascaderProps() {
      return {
        label: "name",
        value: "fatherid",
        children: "children",
        lazy: true,
        // checkStrictly: true,
        lazyLoad: this.lazyLoad,
      };
    },
  },
  methods: {
    getList() {
      this.getunplatformlist();

      // 获取筐子种类
      let param = {
        type: "0", // 筛选 "0" 为全部  多选逗号隔开   该值 拿 scopelist typeid
        pagesize: 0, // 分页大小， pageindex和pagesize都传0，即不分页
        pageindex: 0, // 页码
      };
      userSystemBasket(param).then((res) => {
        if (res.status == 200) {
          let dataList = res.data[0];
          this.tableOptions = dataList.scopeList;
        }
      });
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
    // 懒加载 获取通讯地址数据
    lazyLoad(node, resolve) {
      const { level, data } = node;

      if (level == 1) {
        let param = {
          type: data.fatherid.toString(), // 筛选 "0" 为全部  多选逗号隔开   该值 拿 scopelist typeid
          pagesize: 0, // 分页大小， pageindex和pagesize都传0，即不分页
          pageindex: 0, // 页码
        };

        let nodes = [];
        userSystemBasket(param).then((res) => {
          if (res.status == 200) {
            let dataList = res.data[0];
            for (let i = 0; i < dataList.basketList.length; i++) {
              const el = dataList.basketList[i];
              nodes.push({
                ...el,
                name: "【" + el.applytoName + "】" + el.typeName,
                fatherid: this.handleUuid(),
                leaf: true,
              });
            }

            resolve(nodes);
          }
        });
      }
    },
    handleBasket() {
      this.form.systeambasketId =
        this.$refs.myCascader.getCheckedNodes()[0].data.systeambasketId;
      this.form.basketName =
        this.$refs.myCascader.getCheckedNodes()[0].data.name;
      this.form.typeName =
        this.$refs.myCascader.getCheckedNodes()[0].data.typeName;
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
    },
    // 筐子种类
    basketColorBlur(e) {
      console.log(this.$refs.basketColorcascader);
      this.$refs.basketColorcascader.inputValue = "";
      let data = e.target.value;
      this.form.basketColor = data;
      setTimeout(() => {
        e.target.value = this.form.basketColor;
      }, 0);
    },
    // 确认添加
    async confirmAdd() {
      if (this.isConfirm == 1) {
        this.$refs.formModel.validate((valid) => {
          if (valid) {
            this.$refs.formModel1.validate((valid) => {
              if (valid) {
                this.tableDataList = [
                  {
                    ...this.form,
                    basketAmount:
                      Number(this.form.basketCount) *
                      Number(this.form.basketPrice),
                  },
                ];

                if (Array.isArray(this.tableDataList[0].basketColor)) {
                  this.tableDataList[0].basketColor =
                    this.tableDataList[0].basketColor[
                      this.tableDataList[0].basketColor.length - 1
                    ];
                }
                this.isConfirm = 2;
              }
            });
          }
        });
      }
    },
    // 确认并查看 确认并返回
    confirmAndView(val) {
      let param = {
        type: this.form.type.toString(), //  1.我的筐子自购添加当前库存 2.我的筐子自购添加至历史库存 3.当前库存添加自家已有 必填
        factoryName: this.form.factoryName, //厂商姓名 必填
        factoryPhone: this.form.factoryPhone, //必填
        remark: this.form.remark, //备注
        buyTimestamp: this.form.buyTimestamp / 1000, // 购入时间 必填
        basketTotalPrice:
          Number(this.form.basketCount) * Number(this.form.basketPrice), // #订单总金额 必填
        basketList: [
          {
            systeambasketId: this.form.systeambasketId, // 系统筐子主键id 必填
            basketName: this.form.typeName, // 筐子名称 必填
            basketColor: "", //筐子颜色 必填
            otherColor: this.form.otherColor,
            basketLength: Number(this.form.basketLength), // 长
            basketHeight: Number(this.form.basketHeight), // 高
            basketWidth: Number(this.form.basketWidth), // 宽
            basketWeight: Number(this.form.basketWeight), // 重量
            basketCount: Number(this.form.basketCount), // 筐子数量 必填
            basketPrice: Number(this.form.basketPrice), // 筐子单价 必填
          },
        ],
      };

      if (Array.isArray(this.form.basketColor)) {
        param.basketList[0].basketColor =
          this.form.basketColor[this.form.basketColor.length - 1];
      }
      addUserBasketBuyMyself(param).then((res) => {
        if (res.status == 200) {
          this.$msgbox({
            type: "success",
            title: "提示",
            message: "添加成功，等待跳转",
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
                  this.$router.push({ path: "/frameManage/myFrame" });
                });
            } else {
              if (this.form.type == "1") {
              } else {
                // 1 筐子自购单 4 筐子售出单 5 筐子购入单 6 筐子报废单 7 筐子报失单 8 筐子报溢单 10 筐子腾空单 25 自有筐子单 13 退筐退款单 14 退入退款单
                this.$msgbox.close();
                this.$router.push({
                  path: "purchasemyOrder",
                  query: {
                    basketInOutTypeView: 1,
                    orderId: res.data[0],
                  },
                });
              }
            }
          }, 3000);
        }
      });
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
            column.property == "basketCount" ||
            column.property == "basketAmount"
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
              if (column.property == "basketCount") {
                means[columnIndex] =
                  '<span style="color: rgba(1, 6, 33, 0.9);font-size:18px;font-weight: 700;">' +
                  means[columnIndex] +
                  "</span>";
              }

              if (column.property == "basketAmount") {
                means[columnIndex] =
                  '<span style="color: rgba(232, 84, 30, 1);font-size:18px;font-weight: 700;">' +
                  this.$options.filters.intervalFormat(
                    means[columnIndex],
                    false
                  ) +
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
    handleUuid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.addSelfPurchaseBasketModel {
  .marginform {
    margin: 0px 15px 0px 0px;
    .el-form-item {
      margin-bottom: 18px !important;
    }

    .elformitemMargin {
      .el-form-item {
        margin-bottom: 0px !important;
      }
    }

    .search-form-border {
      display: flex;
      align-items: center;
      border: 1px solid #dcdfe6;
      border-radius: 4px;

      .search-form-title {
        border-left: 1px solid #dcdfe6;
        padding: 0px 8px;
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
        // padding: 0px 5px;
        height: 30px;
        line-height: 30px;
      }

      ::v-deep .el-range__icon {
        display: none;
      }
    }
  }

  .deleteBtn {
    position: absolute;
    top: 0px;
    right: 0px;
  }
  .addBtn {
    position: absolute;
    bottom: 20px;
    // right: 0px;
    left: 0px;
    margin-top: 15px;
  }
  .totleMoney {
    position: absolute;
    bottom: 20px;
    right: 0px;
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
.addSelfPurchaseBasketModel {
  .el-date-editor .el-input__prefix {
    display: none !important;
  }
  .el-input--prefix .el-input__inner {
    padding-left: 15px;
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

.clickOptionChange {
  &.el-select-dropdown__item {
    padding: 0px 0px !important;
  }
}
</style>