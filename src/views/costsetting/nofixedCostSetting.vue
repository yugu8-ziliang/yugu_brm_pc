<template>
  <PageNoScroll class="nofixedCostSettingModel">
    <div v-if="isSetting == 1">
      <div class="flex_dom flex_item_mid flex_item_between">
        <div>
          <div
            style="
              color: rgba(1, 6, 33, 0.9);
              font-size: 16px;
              margin-bottom: 5px;
              font-weight: 700;
            "
          >
            配置月份：{{ tableData.years }}年{{ tableData.month }}月
          </div>
        </div>
        <div>
          <el-button
            type="primary"
            size="small"
            @click="
              handleDialog('historyconfig', '历史配置', {
                jump: '/costsetting/nofixedCostSetting',
                ...tableData,
              })
            "
            >历史配置</el-button
          >
        </div>
      </div>

      <div style="margin-top: 20px">
        <el-form
          ref="formRef"
          :model="form"
          :rules="formRules"
          label-width="80px"
          size="mini"
        >
          <div class="flex_dom flex_item_mid">
            <div
              style="
                margin-bottom: 18px;
                color: rgba(1, 6, 33, 0.9);
                font-size: 14px;
              "
            >
              运输费配置：
            </div>
            <el-form-item label="" label-width="0px" prop="transportMoney">
              <el-input v-model="form.transportMoney" placeholder="请输入">
                <el-select
                  v-model="form.name1"
                  slot="append"
                  style="width: 75px"
                >
                  <el-option
                    v-for="(item, index) in optionsList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </div>
          <div class="flex_dom flex_item_mid">
            <div
              style="
                margin-bottom: 18px;
                color: rgba(1, 6, 33, 0.9);
                font-size: 14px;
              "
            >
              装卸费配置：
            </div>
            <el-form-item label="" label-width="0px" prop="loaddingMoney">
              <el-input v-model="form.loaddingMoney" placeholder="请输入">
                <el-select
                  v-model="form.name2"
                  style="width: 75px"
                  slot="append"
                >
                  <el-option
                    v-for="(item, index) in optionsList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-input>
            </el-form-item>
          </div>

          <div style="margin: 10px 0px">
            <span
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 16px;
                font-weight: 700;
              "
              >交易费</span
            >
          </div>

          <div style="margin: 10px 0px 10px 0px;x">
            <el-button-group v-if="infoData.length > 0">
              <el-button
                :type="isTypeSales == '1' ? 'primary' : ''"
                @click="isTypeSales = '1'"
                size="small"
                >销售计费</el-button
              >
              <el-button
                :type="isTypeSales == '2' ? 'primary' : ''"
                @click="isTypeSales = '2'"
                size="small"
                >采购计费</el-button
              >
            </el-button-group>

            <div style="margin: 10px 0px">
              <el-scrollbar
                ref="scrollDiv"
                :style="{
                  height: parseInt($store.getters.screenHeight - 550) + 'px',
                }"
              >
                <el-card
                  v-if="item.isSellbuy == isTypeSales"
                  class="box-card"
                  style="margin-bottom: 15px"
                  v-for="(item, index) in infoData"
                  :key="index"
                >
                  <div slot="header" class="clearfix">
                    <span
                      style="
                        color: rgba(1, 6, 33, 0.9);
                        font-size: 14px;
                        font-weight: 700;
                      "
                      >交易费用：{{ item.sellCostMoney
                      }}<span
                        slot="append"
                        v-for="(opitem, opindex) in optionsList"
                        :key="opindex"
                        v-if="opitem.value == item.sellCost"
                        >{{ opitem.label }}</span
                      >
                      <span
                        style="
                          color: rgba(1, 6, 33, 0.55);
                          font-size: 14px;
                          padding-left: 5px;
                        "
                        >{{ item.isNumtype }}种</span
                      ></span
                    >
                    <el-button
                      style="float: right; padding: 3px 0"
                      type="text"
                      @click="edittransactionfee(item, index)"
                    >
                      编辑
                    </el-button>
                  </div>
                  <div>
                    <div
                      style="margin-bottom: 5px"
                      v-for="(item1, index1) in item.dataList"
                      :key="index1"
                    >
                      <div
                        v-for="(item2, index2) in item1.childList"
                        :key="index2"
                        class="flex_dom"
                        style="margin-bottom: 8px"
                      >
                        <div
                          style="
                            color: rgba(1, 6, 33, 0.55);
                            font-size: 14px;
                            white-space: nowrap;
                          "
                        >
                          {{ item1.categoryName }}-{{ item2.categoryName }}：
                        </div>
                        <div
                          style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                        >
                          <span
                            v-for="(item3, index3) in item2.childList"
                            :key="index3"
                            v-if="item3.isNotshow ? false : true"
                            >{{ item3.categoryName
                            }}{{
                              item2.childList.length == index3 + 1 ? "" : "、"
                            }}</span
                          >
                        </div>
                      </div>
                    </div>
                  </div>
                </el-card>

                <el-button
                  type="primary"
                  size="small"
                  @click="addtransactionfee(2)"
                  >添加交易费</el-button
                >
              </el-scrollbar>
            </div>
          </div>
        </el-form>
      </div>
      <div class="page_footer">
        <el-button size="mini" @click="handleCancel">取消</el-button>
        <el-button type="primary" size="mini" @click="handleSubmit"
          >提交</el-button
        >
      </div>
    </div>

    <div v-if="isSetting == 2" v-loading="vloading">
      <div style="margin: 10px 0px">
        <span
          style="color: rgba(1, 6, 33, 0.9); font-size: 16px; font-weight: 700"
          >交易费设置</span
        >
      </div>

      <el-form
        ref="infoFormDataRef"
        :model="infoFormData"
        :rules="infoFormRules"
        label-width="80px"
        size="mini"
      >
        <div class="flex_dom flex_item_mid">
          <div
            style="
              margin-bottom: 18px;
              color: rgba(1, 6, 33, 0.9);
              font-size: 14px;
            "
          >
            计费方式：
          </div>
          <el-form-item label="" label-width="0px">
            <el-radio-group v-model="infoFormData.isSellbuy">
              <el-radio label="1">销售计费</el-radio>
              <el-radio label="2">采购计费</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="flex_dom flex_item_mid">
          <div
            style="
              margin-bottom: 18px;
              color: rgba(1, 6, 33, 0.9);
              font-size: 14px;
            "
          >
            交易费类型：
          </div>
          <el-form-item label="" label-width="0px">
            <el-radio-group v-model="infoFormData.sellCost">
              <el-radio label="1">元/吨</el-radio>
              <el-radio label="2">元/斤</el-radio>
              <el-radio label="3">按交易金额百分百</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
        <div class="flex_dom flex_item_mid">
          <div
            style="
              margin-bottom: 18px;
              color: rgba(1, 6, 33, 0.9);
              font-size: 14px;
            "
          >
            交易费用：
          </div>
          <el-form-item label="" label-width="0px" prop="sellCostMoney">
            <el-input
              v-model.number="infoFormData.sellCostMoney"
              placeholder="请输入"
            >
              <span
                slot="append"
                v-for="(item, index) in optionsList"
                :key="index"
                v-if="item.value == infoFormData.sellCost"
                >{{ item.label }}</span
              >
            </el-input>
          </el-form-item>
        </div>
      </el-form>

      <div style="margin: 10px 0px">
        <span
          style="color: rgba(1, 6, 33, 0.9); font-size: 16px; font-weight: 700"
          >选择商品</span
        >
      </div>

      <el-scrollbar
        ref="scrollDiv"
        :style="{
          height: parseInt($store.getters.screenHeight - 450) + 'px',
        }"
      >
        <div style="position: relative">
          <el-tabs v-model="editableTabsValue">
            <el-tab-pane
              :key="index"
              v-for="(item, index) in editableTabs"
              :label="item.categoryName"
              :name="(index + 1).toString()"
            >
              <el-checkbox
                style="padding: 0px 0px 0px 8px"
                :indeterminate="item.isIndeterminate"
                @change="handleChecked1(item, index)"
                v-model="item.checked"
              >
                <div style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                  全选
                </div>
              </el-checkbox>

              <div
                v-for="(item1, index1) in item.childList"
                :key="index1"
                style="padding: 10px 8px 8px 8px"
              >
                <div class="flex_dom flex_item_mid flex_item_between">
                  <el-checkbox
                    :indeterminate="item1.isIndeterminate"
                    @change="handleChecked2(item1, index, index1)"
                    v-model="item1.checked"
                  >
                    <div style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                      {{ item1.categoryName }}：
                    </div>
                  </el-checkbox>

                  <div
                    style="color: #0ba198; font-size: 14px; cursor: pointer"
                    @click="handlePutaway(item1)"
                  >
                    {{ item1.putaway ? "展开" : "收起" }}
                    <i
                      :class="[
                        item1.putaway
                          ? 'el-icon-arrow-down'
                          : 'el-icon-arrow-up',
                      ]"
                    ></i>
                  </div>
                </div>

                <el-collapse-transition>
                  <div v-show="item1.putaway ? false : true">
                    <div
                      v-if="
                        item1.dataList &&
                        item1.dataList.length > 0 &&
                        noSettingNum(item1) > 0
                      "
                      style="
                        color: rgba(1, 6, 33, 0.75);
                        font-size: 14px;
                        margin-top: 5px;
                        padding-left: 20px;
                      "
                    >
                      <el-checkbox
                        :indeterminate="item1.daisIndeterminate"
                        v-model="item1.dachecked"
                        @change="handleChecked4(item1, index, index1)"
                      >
                        <div
                          style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                        >
                          暂未设置的分类({{ noSettingNum(item1) }}种)
                        </div>
                      </el-checkbox>
                    </div>

                    <div
                      class="flex_dom flex_wrap"
                      style="
                        margin: 5px 0px 0px 20px;
                        padding: 0px 0px 10px 0px;
                        border-bottom: 1px solid rgba(233, 233, 233, 1);
                      "
                    >
                      <el-checkbox
                        v-for="(item2, index2) in item1.childList"
                        :key="index2"
                        v-if="item2.isSelected ? false : true"
                        @change="handleChecked3(item2, index, index1, index2)"
                        v-model="item2.checked"
                      >
                        <div
                          style="
                            padding: 0px 0px 2px;
                            color: rgba(1, 6, 33, 0.75);
                            font-size: 14px;
                          "
                        >
                          {{ item2.categoryName }}
                        </div>
                      </el-checkbox>
                    </div>

                    <div v-if="item1.dataList && item1.dataList.length > 0">
                      <div
                        v-for="(daitem, daindex) in item1.dataList"
                        :key="daindex"
                        v-if="daitem.isSellbuy == infoFormData.isSellbuy"
                        style="
                          margin: 10px 0px 0px 20px;
                          padding: 0px 0px 10px 0px;
                          border-bottom: 1px solid rgba(233, 233, 233, 1);
                        "
                      >
                        <el-checkbox
                          :indeterminate="daitem.daisIndeterminate"
                          v-model="daitem.dachecked"
                          @change="
                            handledaChecked(daitem, index, index1, daindex)
                          "
                          :disabled="daitem.isPositionNums == isEditData.index"
                        >
                          <span
                            style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                            >交易费用：<span
                              style="
                                color: rgba(1, 6, 33, 0.75);
                                font-size: 14px;
                              "
                            >
                              {{ daitem.sellCostMoney
                              }}<span
                                v-for="(opitem, opindex) in optionsList"
                                :key="opindex"
                                v-if="opitem.value == daitem.sellCost"
                                >{{ opitem.label }}</span
                              >
                              <span>({{ daitem.isNumtype }}种)</span>
                            </span>
                          </span>
                        </el-checkbox>

                        <div
                          class="flex_dom flex_wrap"
                          style="margin-top: 5px; padding-left: 20px"
                        >
                          <el-checkbox
                            v-for="(daitem1, daindex1) in daitem.thrid"
                            :key="daindex1"
                            v-model="daitem1.dachecked"
                            @change="
                              handledaChecked1(
                                daitem1,
                                index,
                                index1,
                                daindex,
                                daindex1
                              )
                            "
                            v-if="daitem1.daisSelected ? false : true"
                            :disabled="
                              daitem1.isPosition[0] == isEditData.index
                            "
                          >
                            <div
                              style="
                                padding: 0px 0px 2px;
                                color: rgba(1, 6, 33, 0.75);
                                font-size: 14px;
                              "
                            >
                              {{ daitem1.categoryName }}
                            </div>
                          </el-checkbox>
                        </div>
                      </div>
                    </div>
                  </div>
                </el-collapse-transition>
              </div>
            </el-tab-pane>
          </el-tabs>
          <div
            style="
              color: rgba(11, 161, 152, 1);
              font-size: 14px;
              position: absolute;
              top: 10px;
              right: 0px;
              cursor: pointer;
            "
            @click="handleDialog1"
          >
            查看已选商品
          </div>
        </div>
      </el-scrollbar>

      <div class="page_footer">
        <el-button size="mini" @click="addtransactionfee(1)">取消</el-button>
        <el-button type="primary" size="mini" @click="addtransSubmit"
          >确认</el-button
        >
      </div>
    </div>
    <el-dialog title="已选商品" :visible.sync="dialogTableVisible">
      <el-scrollbar
        ref="scrollDiv"
        :style="{
          height: parseInt($store.getters.screenHeight - 450) + 'px',
        }"
      >
        <el-card
          class="box-card"
          style="margin-bottom: 15px"
          v-for="(item, index) in editableTabs"
          :key="index"
          v-if="checkedLength(item) > 0"
        >
          <div slot="header" class="clearfix">
            <span
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 14px;
                font-weight: 700;
              "
              >{{ item.categoryName }}
            </span>
            <span
              style="float: right; color: rgba(1, 6, 33, 0.55); font-size: 14px"
            >
              已选：{{ checkedLength(item) }}种
            </span>
          </div>

          <div>
            <div
              v-for="(item1, index1) in item.childList"
              :key="index1"
              v-if="checkedLength1(item1) > 0"
            >
              <div
                style="
                  color: rgba(1, 6, 33, 0.9);
                  font-size: 14px;
                  font-weight: 700;
                "
              >
                {{ item1.categoryName }}({{ checkedLength1(item1) }}种):
              </div>

              <div style="padding: 10px 0px">
                <el-tag
                  v-for="(item2, index2) in item1.childList"
                  :key="index2"
                  closable
                  :disable-transitions="false"
                  @close="handlecheckedClose(item2, index, index1, index2)"
                  v-if="item2.checked && !item2.isSelectedNo"
                  style="
                    margin: 0px 8px 10px 0px;
                    border: 1px solid rgba(208, 208, 210, 1);
                    background: #fff;
                    color: rgba(1, 6, 33, 0.75);
                    font-size: 14px;
                  "
                  size="small"
                >
                  {{ item2.categoryName }}</el-tag
                >

                <span
                  v-for="(daitem2, daindex2) in item1.dataList"
                  :key="daindex2"
                  v-if="daitem2.isSellbuy == infoFormData.isSellbuy"
                >
                  <el-tag
                    v-for="(daitem3, daindex3) in daitem2.thrid"
                    :key="daindex3"
                    closable
                    :disable-transitions="false"
                    @close="handlecheckedClose1(item2, index, index1, index2)"
                    v-if="daitem3.dachecked && !daitem3.daisSelectedNo"
                    style="
                      margin: 0px 8px 10px 0px;
                      border: 1px solid rgba(208, 208, 210, 1);
                      background: #fff;
                      color: rgba(1, 6, 33, 0.75);
                      font-size: 14px;
                    "
                    size="small"
                  >
                    {{ daitem3.categoryName }}</el-tag
                  >
                </span>
              </div>
            </div>
          </div>
        </el-card>
      </el-scrollbar>
    </el-dialog>

    <historyconfig ref="historyconfig" @submitData="submitData"></historyconfig>
  </PageNoScroll>
</template>

<script>
import historyconfig from "./zhaoxiyaotest.vue";

import { Base64 } from "js-base64";

import { productCate } from "@/request/api/commodityManage/commodityList";

import {
  historyConfigDetail,
  batchUnfixd,
} from "@/request/api/fixedCost/index";

export default {
  name: "nofixedCostSetting",
  components: {
    historyconfig,
  },
  data() {
    return {
      dialogTableVisible: false,
      optionsList: [
        {
          value: "1",
          label: "元/吨",
        },
        {
          value: "2",
          label: "元/斤",
        },
        {
          value: "3",
          label: "%",
        },
      ],

      form: {
        transportMoney: "", // 运输费
        loaddingMoney: "", // 装卸费
        name1: "1",
        name2: "1",
      },
      tableData: {},
      infoData: [],

      vloading: false,
      infoFormData: {
        isSellbuy: "1", // 计费方式
        sellCost: "1", // 交易费类型
        sellCostMoney: "", // 交易费用
      },
      editableTabsValue: "1",
      editableTabs: [],

      isSetting: 1,
      isSettingStatus: "",
      isEditData: {},
      isTypeSales: "1",

      infoFormRules: {
        sellCostMoney: [
          {
            required: true,
            message: "请输入交易费用",
            trigger: "blur",
          },
        ],
      },
      formRules: {
        transportMoney: [
          {
            required: true,
            message: "请输入运输费",
            trigger: "blur",
          },
        ],
        loaddingMoney: [
          {
            required: true,
            message: "请输入装卸费",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    initData() {
      let { data: data } = this.$route.query;
      // 判断url是否为空
      if (data) {
        // 解析数据
        try {
          let param = JSON.parse(Base64.decode(data));
          this.tableData = param;

          this.form = {
            transportMoney: "", // 运输费
            loaddingMoney: "", // 装卸费
            name1: "1",
            name2: "1",
          };
          this.infoData = [];

          this.vloading = false;
          this.infoFormData = {
            isSellbuy: "1", // 计费方式
            sellCost: "1", // 交易费类型
            sellCostMoney: "", // // 交易费用
          };
          this.editableTabsValue = "1";
          this.editableTabs = [];

          this.isSetting = 1;
          this.isSettingStatus = "";
          this.isEditData = {};
          this.isTypeSales = "1";

          productCate({
            modelType: "0",
          }).then((res) => {
            if (res.status == 200) {
              this.editableTabs = res.data;
              setTimeout(() => {
                if (this.tableData.uid) {
                  this.getList(this.tableData.uid);
                } else {
                  this.getList();
                }
              }, 0);
            }
          });
        } catch (error) {}
        return;
      }
    },
    getList(val) {
      let param = {};
      if (val != undefined) {
        param = {
          uid: val,
        };
      } else {
        param = {
          year: this.tableData.years, // 获取当月配置要传的参数
          month: this.tableData.month, // 获取当月配置要传的参数
        };
      }

      historyConfigDetail(param).then((res) => {
        let dataP = res.data[0];
        this.form = {
          transportMoney: dataP.transportmoney, // 运输费
          loaddingMoney: dataP.loaddingmoney, // 装卸费
          name1: dataP.transportmoneyunit.toString(),
          name2: dataP.loaddingmoneyunit.toString(),
        };

        // 销售计费
        res.data[0].sell2.forEach((item, index) => {
          let dataList = [];
          item.info.forEach((item1, index1) => {
            let childList1 = [];
            item1.second.forEach((item2, index2) => {
              let childList2 = [];

              item2.third.forEach((item3, index3) => {
                childList2.push({
                  id: item3.id, // 一级分类主键id
                  regionType: 2,
                  categoryName: item3.name, // 一级分类名称
                  fatherId: item3.fatherid,
                  categoryId: item3.categoryid, // 一级分类id
                  nums: 0, // 该分类下商品数
                  // childList: childList2
                });
              });

              childList1.push({
                id: item2.id, // 一级分类主键id
                regionType: 1,
                categoryName: item2.name, // 一级分类名称
                fatherId: item2.fatherid,
                categoryId: item2.categoryid, // 一级分类id
                nums: 0, // 该分类下商品数
                childList: childList2,
              });
            });

            dataList.push({
              id: item1.id, // 一级分类主键id
              regionType: 0,
              categoryName: item1.name, // 一级分类名称
              fatherId: item1.fatherid,
              categoryId: item1.categoryid, // 一级分类id
              nums: 0, // 该分类下商品数
              childList: childList1,
            });
          });

          this.infoData.push({
            isNumtype: item.number,
            isSellbuy: "1",
            sellCost: item.sellCostUnit,
            sellCostMoney: item.sellCostMoney,
            dataList,
          });
        });
        // 采购计费
        res.data[0].buy2.forEach((item, index) => {
          let dataList = [];
          item.info.forEach((item1, index1) => {
            let childList1 = [];
            item1.second.forEach((item2, index2) => {
              let childList2 = [];

              item2.third.forEach((item3, index3) => {
                childList2.push({
                  id: item3.id, // 一级分类主键id
                  regionType: 2,
                  categoryName: item3.name, // 一级分类名称
                  fatherId: item3.fatherid,
                  categoryId: item3.categoryid, // 一级分类id
                  nums: 0, // 该分类下商品数
                  // childList: childList2
                });
              });

              childList1.push({
                id: item2.id, // 一级分类主键id
                regionType: 1,
                categoryName: item2.name, // 一级分类名称
                fatherId: item2.fatherid,
                categoryId: item2.categoryid, // 一级分类id
                nums: 0, // 该分类下商品数
                childList: childList2,
              });
            });

            dataList.push({
              id: item1.id, // 一级分类主键id
              regionType: 0,
              categoryName: item1.name, // 一级分类名称
              fatherId: item1.fatherid,
              categoryId: item1.categoryid, // 一级分类id
              nums: 0, // 该分类下商品数
              childList: childList1,
            });
          });

          this.infoData.push({
            isNumtype: item.number,
            isSellbuy: "2",
            sellCost: item.sellCostUnit,
            sellCostMoney: item.sellCostMoney,
            dataList,
          });
        });

        this.infoData.forEach((item, index) => {
          item.dataList.forEach((item1, index1) => {
            this.editableTabs.forEach((eitem, eindex) => {
              if (item1.id == eitem.id) {
                item1.childList.forEach((item2, index2) => {
                  eitem.childList.forEach((eitem1, eindex1) => {
                    if (item2.id == eitem1.id) {
                      let childList2 = [];

                      if (eitem1.dataList == undefined) {
                        eitem1.dataList = [];
                      }

                      item2.childList.forEach((item3, index3) => {
                        eitem1.childList.forEach((eitem2, eindex2) => {
                          if (item3.id == eitem2.id) {
                            eitem2.checked = true;
                            eitem2.isSelected = true;
                            eitem2.isSelectedNo = true;
                            childList2.push({
                              categoryId: eitem2.categoryId,
                              categoryName: eitem2.categoryName,
                              childList: eitem2.childList,
                              fatherId: eitem2.fatherId,
                              id: eitem2.id,
                              dachecked: false,
                              daisSelected: false, // 不显示选中
                              daisSelectedNo: false, // 不让选中
                              nums: eitem2.nums,
                              regionType: eitem2.regionType,
                              isPositionNums: eitem1.dataList.length,
                              isPosition: [index, index1, index2, index3], // 记录infoData位置
                            });
                          }
                        });
                      });

                      eitem1.dataList.push({
                        dachecked: false,
                        daisIndeterminate: false,
                        isNumtype: item.isNumtype,
                        isSellbuy: item.isSellbuy,
                        sellCost: item.sellCost,
                        sellCostMoney: item.sellCostMoney,
                        isPositionNums: index,
                        thrid: childList2,
                      });
                    }
                  });
                });
              }
            });
          });
        });

        // console.log(this.editableTabs);
      });
    },

    // 添加交易费
    addtransactionfee(val) {
      let that = this;
      if (val == 2) {
        this.isSetting = val;
        this.isSettingStatus = "add";
        this.infoFormData.isSellbuy = this.isTypeSales; // 计费方式
      } else if (val == 1) {
        this.isSetting = val;
        this.infoFormData.sellCost = "1"; // 交易费类型
        this.infoFormData.sellCostMoney = ""; // 交易费用

        this.editableTabsValue = "1";
        this.isSettingStatus = "";

        this.editableTabs.forEach((item, index) => {
          item.checked = false;
          item.isIndeterminate = false;
          item.childList.forEach((item1, index1) => {
            item1.checked = false;
            item1.isIndeterminate = false;
            item1.dachecked = false;
            item1.daisIndeterminate = false;

            item1.childList.forEach((item2, index2) => {
              if (item2.checked && !item2.isSelectedNo) {
                item2.checked = false;
              }
            });
            if (item1.dataList && item1.dataList.length > 0) {
              item1.dataList.forEach((daitem2, daindex2) => {
                daitem2.dachecked = false;
                daitem2.daisIndeterminate = false;
                daitem2.thrid.forEach((daitem3, daindex3) => {
                  daitem3.dachecked = false;
                });
              });
            }
          });
        });
      }
    },
    // 编辑
    edittransactionfee(item, index) {
      this.isSetting = 2;
      this.isSettingStatus = "edit";
      this.isEditData = {
        index,
        item,
      };
      this.infoFormData = {
        isSellbuy: item.isSellbuy, // 计费方式
        sellCost: item.sellCost, // 交易费类型
        sellCostMoney: item.sellCostMoney, // 交易费用
      };
    },
    // 展开 收气
    handlePutaway(item, index, index1) {
      if (item.putaway) {
        item.putaway = false;
      } else {
        item.putaway = true;
      }
      this.$forceUpdate();
    },
    // 全选
    handleChecked1(item, index) {
      let dataP = this.editableTabs[index].childList;

      for (let i = 0; i < dataP.length; i++) {
        this.$set(
          this.editableTabs[index].childList[i],
          "checked",
          item.checked
        );
        this.$set(
          this.editableTabs[index].childList[i],
          "isIndeterminate",
          false
        );

        this.$set(
          this.editableTabs[index].childList[i],
          "dachecked",
          item.checked
        );
        this.$set(
          this.editableTabs[index].childList[i],
          "daisIndeterminate",
          false
        );

        let dataP1 = this.editableTabs[index].childList[i].childList;
        for (let j = 0; j < dataP1.length; j++) {
          this.$set(
            this.editableTabs[index].childList[i].childList[j],
            "checked",
            item.checked
          );
          this.$set(
            this.editableTabs[index].childList[i].childList[j],
            "isIndeterminate",
            false
          );
        }
      }
      this.$forceUpdate();
    },
    // 全选过滤
    handleCheckedFilter(index) {
      let nums = 0;
      let nums1 = 0;
      let dataP = this.editableTabs[index].childList;
      for (let i = 0; i < dataP.length; i++) {
        const el = dataP[i];
        if (el.checked) {
          nums += 1;
        }
        if (el.isIndeterminate) {
          nums1 += 1;
        }
      }

      if (nums == dataP.length) {
        this.$set(this.editableTabs[index], "checked", true);
        this.$set(this.editableTabs[index], "isIndeterminate", false);
      } else {
        if (nums1 == 0 && nums == 0) {
          this.$set(this.editableTabs[index], "checked", false);
          this.$set(this.editableTabs[index], "isIndeterminate", false);
        } else {
          this.$set(this.editableTabs[index], "checked", false);
          this.$set(this.editableTabs[index], "isIndeterminate", true);
        }
      }
      this.$forceUpdate();
    },
    handleChecked2(item1, index, index1) {
      this.$set(
        this.editableTabs[index].childList[index1],
        "isIndeterminate",
        false
      );

      this.$set(
        this.editableTabs[index].childList[index1],
        "dachecked",
        item1.checked
      );
      this.$set(
        this.editableTabs[index].childList[index1],
        "daisIndeterminate",
        false
      );

      let dataP = this.editableTabs[index].childList[index1].childList;
      for (let i = 0; i < dataP.length; i++) {
        dataP[i].checked = item1.checked;
      }

      this.handleCheckedFilter(index);
    },
    handleChecked3(item2, index, index1, index2) {
      let isnums = 0;
      let nums = 0;
      let dataP = this.editableTabs[index].childList[index1].childList;
      for (let index = 0; index < dataP.length; index++) {
        const el = dataP[index];
        if (el.checked == true && !el.isSelectedNo) {
          nums += 1;
        }
        if (!el.isSelectedNo) {
          isnums += 1;
        }
      }

      if (nums == isnums) {
        this.$set(this.editableTabs[index].childList[index1], "checked", true);
        this.$set(
          this.editableTabs[index].childList[index1],
          "isIndeterminate",
          false
        );
        this.$set(
          this.editableTabs[index].childList[index1],
          "dachecked",
          true
        );
        this.$set(
          this.editableTabs[index].childList[index1],
          "daisIndeterminate",
          false
        );
      } else {
        if (nums != 0) {
          this.$set(
            this.editableTabs[index].childList[index1],
            "checked",
            false
          );
          this.$set(
            this.editableTabs[index].childList[index1],
            "isIndeterminate",
            true
          );
          this.$set(
            this.editableTabs[index].childList[index1],
            "dachecked",
            false
          );
          this.$set(
            this.editableTabs[index].childList[index1],
            "daisIndeterminate",
            true
          );
        } else {
          this.$set(
            this.editableTabs[index].childList[index1],
            "checked",
            false
          );
          this.$set(
            this.editableTabs[index].childList[index1],
            "isIndeterminate",
            false
          );
          this.$set(
            this.editableTabs[index].childList[index1],
            "dachecked",
            false
          );
          this.$set(
            this.editableTabs[index].childList[index1],
            "daisIndeterminate",
            false
          );
        }
      }

      this.handleCheckedFilter(index);
    },
    // 暂未设置的分类
    handleChecked4(item1, index, index1) {
      let dataP = this.editableTabs[index].childList[index1].childList;
      for (let i = 0; i < dataP.length; i++) {
        dataP[i].checked = item1.dachecked;
      }

      let isnums = 0;
      let nums = 0;
      for (let index = 0; index < dataP.length; index++) {
        const el = dataP[index];
        if (el.checked == true && !el.isSelectedNo) {
          nums += 1;
        }
        if (!el.isSelectedNo) {
          isnums += 1;
        }
      }

      if (nums == isnums) {
        this.$set(this.editableTabs[index].childList[index1], "checked", true);
        this.$set(
          this.editableTabs[index].childList[index1],
          "isIndeterminate",
          false
        );
        this.$set(
          this.editableTabs[index].childList[index1],
          "dachecked",
          true
        );
        this.$set(
          this.editableTabs[index].childList[index1],
          "daisIndeterminate",
          false
        );
      } else {
        if (nums != 0) {
          this.$set(
            this.editableTabs[index].childList[index1],
            "checked",
            false
          );
          this.$set(
            this.editableTabs[index].childList[index1],
            "isIndeterminate",
            true
          );
          this.$set(
            this.editableTabs[index].childList[index1],
            "dachecked",
            false
          );
          this.$set(
            this.editableTabs[index].childList[index1],
            "daisIndeterminate",
            true
          );
        } else {
          this.$set(
            this.editableTabs[index].childList[index1],
            "checked",
            false
          );
          this.$set(
            this.editableTabs[index].childList[index1],
            "isIndeterminate",
            false
          );
          this.$set(
            this.editableTabs[index].childList[index1],
            "dachecked",
            false
          );
          this.$set(
            this.editableTabs[index].childList[index1],
            "daisIndeterminate",
            false
          );
        }
      }

      this.handleCheckedFilter(index);
    },
    handledaChecked(daitem, index, index1, daindex) {
      this.$set(
        this.editableTabs[index].childList[index1].dataList[daindex],
        "daisIndeterminate",
        false
      );
      let dataP =
        this.editableTabs[index].childList[index1].dataList[daindex].thrid;
      dataP.forEach((res, i) => {
        this.$set(
          this.editableTabs[index].childList[index1].dataList[daindex].thrid[i],
          "dachecked",
          daitem.dachecked
        );
      });

      this.handleCheckedFilter(index);
    },
    handledaChecked1(daitem1, index, index1, daindex, daindex1) {
      let isnums = 0;
      let nums = 0;
      let dataP =
        this.editableTabs[index].childList[index1].dataList[daindex].thrid;
      dataP.forEach((res, i) => {
        if (res.dachecked == true && !res.daisSelectedNo) {
          nums += 1;
        }
        if (!res.daisSelectedNo) {
          isnums += 1;
        }
      });

      if (nums == isnums) {
        this.$set(
          this.editableTabs[index].childList[index1].dataList[daindex],
          "dachecked",
          true
        );
        this.$set(
          this.editableTabs[index].childList[index1].dataList[daindex],
          "daisIndeterminate",
          false
        );
      } else {
        if (nums != 0) {
          this.$set(
            this.editableTabs[index].childList[index1].dataList[daindex],
            "dachecked",
            false
          );
          this.$set(
            this.editableTabs[index].childList[index1].dataList[daindex],
            "daisIndeterminate",
            true
          );
        } else {
          this.$set(
            this.editableTabs[index].childList[index1].dataList[daindex],
            "dachecked",
            false
          );
          this.$set(
            this.editableTabs[index].childList[index1].dataList[daindex],
            "daisIndeterminate",
            false
          );
        }
      }

      this.handleCheckedFilter(index);
    },
    // 确认
    addtransSubmit() {
      this.$refs.infoFormDataRef.validate((valid) => {
        if (valid) {
          let isNumtype = 0;
          let dataList = [];

          for (let i = 0; i < this.editableTabs.length; i++) {
            const el1 = this.editableTabs[i];

            //
            let childList1 = [];
            for (let j = 0; j < el1.childList.length; j++) {
              const el2 = el1.childList[j];
              let childList2 = [];

              if (el2.isIndeterminate || el2.checked) {
                for (let k = 0; k < el2.childList.length; k++) {
                  const el3 = el2.childList[k];
                  if (el3.checked && !el3.isSelectedNo) {
                    childList2.push(el3);
                  }
                }
              }
              if (el2.dataList && el2.dataList.length > 0) {
                for (let l = 0; l < el2.dataList.length; l++) {
                  const el4 = el2.dataList[l];
                  // if (el4.daisIndeterminate || el4.dachecked) {
                  for (let p = 0; p < el4.thrid.length; p++) {
                    const el5 = el4.thrid[p];

                    if (this.isSettingStatus == "edit") {
                      if (el5.isPosition[0] == this.isEditData.index) {
                        childList2.push(el5);
                      } else {
                        if (el5.dachecked && !el5.daisSelectedNo) {
                          this.infoData[el5.isPosition[0]].dataList[
                            el5.isPosition[1]
                          ].childList[el5.isPosition[2]].childList[
                            el5.isPosition[3]
                          ].isNotshow = true;
                          this.infoData[el5.isPosition[0]].isNumtype -= 1;

                          childList2.push(el5);
                        }
                      }
                    } else {
                      if (el5.dachecked && !el5.daisSelectedNo) {
                        this.infoData[el5.isPosition[0]].dataList[
                          el5.isPosition[1]
                        ].childList[el5.isPosition[2]].childList[
                          el5.isPosition[3]
                        ].isNotshow = true;
                        this.infoData[el5.isPosition[0]].isNumtype -= 1;

                        childList2.push(el5);
                      }
                    }
                  }
                  // }
                }
              }

              isNumtype += childList2.length;
              if (childList2.length > 0) {
                childList1.push({
                  ...el2,
                  childList: childList2,
                });
              }
            }
            //

            if (childList1.length > 0) {
              dataList.push({
                ...el1,
                childList: childList1,
              });
            }
          }

          if (dataList.length == 0) {
            this.$warning("请选择商品");
            return;
          }

          let dataList1 = [];
          for (let i = 0; i < this.editableTabs.length; i++) {
            const el1 = this.editableTabs[i];

            //
            let childList1 = [];
            for (let j = 0; j < el1.childList.length; j++) {
              const el2 = el1.childList[j];
              let childList2 = [];

              if (el2.isIndeterminate || el2.checked) {
                for (let k = 0; k < el2.childList.length; k++) {
                  const el3 = el2.childList[k];
                  if (el3.checked && !el3.isSelectedNo) {
                    let isPositionNums = 0;
                    if (
                      this.editableTabs[i].childList[j].dataList &&
                      this.editableTabs[i].childList[j].dataList.length
                    ) {
                      if (this.isSettingStatus == "edit") {
                        for (
                          let f = 0;
                          f < this.editableTabs[i].childList[j].dataList.length;
                          f++
                        ) {
                          const elf =
                            this.editableTabs[i].childList[j].dataList[f];
                          if (elf.isPositionNums == this.isEditData.index) {
                            isPositionNums = f;
                          }
                        }
                      } else {
                        isPositionNums =
                          this.editableTabs[i].childList[j].dataList.length;
                      }
                    }

                    if (this.isSettingStatus == "edit") {
                      childList2.push({
                        ...el3,
                        isPosition: [
                          this.isEditData.index,
                          dataList1.length,
                          childList1.length,
                          childList2.length,
                        ],
                        isPositionNums: isPositionNums,
                      });
                    } else {
                      childList2.push({
                        ...el3,
                        isPosition: [
                          this.infoData.length,
                          dataList1.length,
                          childList1.length,
                          childList2.length,
                        ],
                        isPositionNums: isPositionNums,
                      });
                    }
                    this.editableTabs[i].childList[j].childList[
                      k
                    ].isSelected = true; // 不显示选中
                    this.editableTabs[i].childList[j].childList[
                      k
                    ].isSelectedNo = true; // 不让选中
                  }
                }
              }
              if (el2.dataList && el2.dataList.length > 0) {
                for (let l = 0; l < el2.dataList.length; l++) {
                  const el4 = el2.dataList[l];
                  // if (el4.daisIndeterminate || el4.dachecked) {
                  for (let p = 0; p < el4.thrid.length; p++) {
                    const el5 = el4.thrid[p];

                    if (this.isSettingStatus == "edit") {
                      if (el5.isPosition[0] == this.isEditData.index) {
                        childList2.push({
                          ...el5,
                          isPosition: [
                            this.isEditData.index,
                            dataList1.length,
                            childList1.length,
                            childList2.length,
                          ],
                        });
                      } else {
                        if (el5.dachecked && !el5.daisSelectedNo) {
                          this.editableTabs[i].childList[j].dataList[
                            el5.isPositionNums
                          ].isNumtype =
                            this.infoData[el5.isPosition[0]].isNumtype;

                          let isPositionNums = 0;
                          if (
                            this.editableTabs[i].childList[j].dataList &&
                            this.editableTabs[i].childList[j].dataList.length
                          ) {
                            for (
                              let f = 0;
                              f <
                              this.editableTabs[i].childList[j].dataList.length;
                              f++
                            ) {
                              const elf =
                                this.editableTabs[i].childList[j].dataList[f];
                              if (elf.isPositionNums == this.isEditData.index) {
                                isPositionNums = f;
                              }
                            }
                          }

                          childList2.push({
                            categoryId: el5.categoryId,
                            categoryName: el5.categoryName,
                            childList: el5.childList,
                            fatherId: el5.fatherId,
                            id: el5.id,
                            dachecked: false,
                            daisSelected: false, // 不显示选中
                            daisSelectedNo: false, // 不让选中
                            nums: el5.nums,
                            regionType: el5.regionType,
                            isPositionNums: isPositionNums,
                            isPosition: [
                              this.isEditData.index,
                              dataList1.length,
                              childList1.length,
                              childList2.length,
                            ], // 记录infoData位置
                          });
                          this.editableTabs[i].childList[j].dataList[l].thrid[
                            p
                          ].daisSelected = true; // 不显示选中
                          this.editableTabs[i].childList[j].dataList[l].thrid[
                            p
                          ].daisSelectedNo = true; // 不让选中
                        }
                      }
                    } else {
                      if (el5.dachecked && !el5.daisSelectedNo) {
                        this.editableTabs[i].childList[j].dataList[
                          el5.isPositionNums
                        ].isNumtype =
                          this.infoData[el5.isPosition[0]].isNumtype;

                        let isPositionNums = 0;
                        if (
                          this.editableTabs[i].childList[j].dataList &&
                          this.editableTabs[i].childList[j].dataList.length
                        ) {
                          isPositionNums =
                            this.editableTabs[i].childList[j].dataList.length;
                        }

                        childList2.push({
                          categoryId: el5.categoryId,
                          categoryName: el5.categoryName,
                          childList: el5.childList,
                          fatherId: el5.fatherId,
                          id: el5.id,
                          dachecked: false,
                          daisSelected: false, // 不显示选中
                          daisSelectedNo: false, // 不让选中
                          nums: el5.nums,
                          regionType: el5.regionType,
                          isPositionNums: isPositionNums,
                          isPosition: [
                            this.infoData.length,
                            dataList1.length,
                            childList1.length,
                            childList2.length,
                          ], // 记录infoData位置
                        });
                        this.editableTabs[i].childList[j].dataList[l].thrid[
                          p
                        ].daisSelected = true; // 不显示选中
                        this.editableTabs[i].childList[j].dataList[l].thrid[
                          p
                        ].daisSelectedNo = true; // 不让选中
                      }
                    }
                  }
                  // }

                  this.$set(
                    this.editableTabs[i].childList[j].dataList[l],
                    "dachecked",
                    false
                  );
                  this.$set(
                    this.editableTabs[i].childList[j].dataList[l],
                    "daisIndeterminate",
                    false
                  );
                }
              }

              if (childList2.length > 0) {
                if (this.isSettingStatus != "edit") {
                  if (this.editableTabs[i].childList[j].dataList == undefined) {
                    this.editableTabs[i].childList[j].dataList = [];
                  }
                  this.editableTabs[i].childList[j].dataList.push({
                    ...this.infoFormData,
                    isNumtype: isNumtype,
                    isPositionNums: this.infoData.length,
                    thrid: childList2,
                  });
                } else {
                  if (this.editableTabs[i].childList[j].dataList == undefined) {
                    this.editableTabs[i].childList[j].dataList = [];
                    this.editableTabs[i].childList[j].dataList.push({
                      ...this.infoFormData,
                      isNumtype: isNumtype,
                      isPositionNums: this.isEditData.index,
                      thrid: childList2,
                    });
                  } else {
                    let isExist = true;
                    for (
                      let f = 0;
                      f < this.editableTabs[i].childList[j].dataList.length;
                      f++
                    ) {
                      const elf = this.editableTabs[i].childList[j].dataList[f];
                      if (elf.isPositionNums == this.isEditData.index) {
                        this.editableTabs[i].childList[j].dataList[f] = {
                          ...this.infoFormData,
                          isNumtype: isNumtype,
                          isPositionNums: this.isEditData.index,
                          thrid: childList2,
                        };
                        isExist = false;
                      }
                    }

                    if (isExist) {
                      this.editableTabs[i].childList[j].dataList.push({
                        ...this.infoFormData,
                        isNumtype: isNumtype,
                        isPositionNums: this.isEditData.index,
                        thrid: childList2,
                      });
                    }
                  }
                }

                childList1.push({
                  ...el2,
                  childList: childList2,
                });
              }

              this.$set(this.editableTabs[i].childList[j], "checked", false);
              this.$set(
                this.editableTabs[i].childList[j],
                "isIndeterminate",
                false
              );
              this.$set(this.editableTabs[i].childList[j], "dachecked", false);
              this.$set(
                this.editableTabs[i].childList[j],
                "daisIndeterminate",
                false
              );
            }
            //
            if (childList1.length > 0) {
              dataList1.push({
                ...el1,
                childList: childList1,
              });
            }
            // 取消全选
            this.$set(this.editableTabs[i], "checked", false);
            this.$set(this.editableTabs[i], "isIndeterminate", false);
          }

          if (this.isSettingStatus == "edit") {
            this.infoData[this.isEditData.index] = {
              ...this.infoFormData,
              isNumtype: isNumtype,
              dataList: dataList,
            };
          } else {
            this.infoData.push({
              ...this.infoFormData,
              isNumtype: isNumtype,
              dataList: dataList,
            });
          }

          this.addtransactionfee(1);
          // console.log(this.editableTabs);
          // console.log(this.infoData);
        }
      });
    },
    noSettingNum(item1) {
      let nums = 0;
      if (item1.dataList && item1.dataList.length > 0) {
        for (let i = 0; i < item1.dataList.length; i++) {
          const el = item1.dataList[i];
          nums += el.thrid.length;
        }
      }
      return item1.childList.length - nums;
    },
    // 提交
    handleSubmit() {
      this.$refs.formRef.validate((valid) => {
        if (valid) {
          let param = {
            yearsInfo: [
              {
                years: this.tableData.years.toString(),
                month: [this.tableData.month.toString()],
              },
            ], // 年月信息
            loaddingMoney: parseFloat(this.form.loaddingMoney), //装卸费
            loaddingMoneyUnit: parseFloat(this.form.name2), // 装卸费单位:1.元/斤 2.元/吨
            transportMoney: parseFloat(this.form.transportMoney), // 运输费
            transportMoneyUnit: parseFloat(this.form.name1), // 运输费单位:1.元/斤 2.元/吨
            sell: [
              // 销售计费
            ],
            buy: [
              // 采购计费
            ],
          };

          this.infoData.forEach((item, index) => {
            let ids = [];
            item.dataList.forEach((item1, index1) => {
              item1.childList.forEach((item2, index2) => {
                item2.childList.forEach((item3, index3) => {
                  ids.push(item3.id);
                });
              });
            });
            if (item.isSellbuy == "1") {
              param.sell.push({
                sellCostMoney: parseFloat(item.sellCostMoney), // 销售计费金额，未设置传0
                sellCostUnit: parseFloat(item.sellCost), // 销售计费单位，1.元/斤 2.元/吨 3.%(百分比)，未设置传0
                productId: ids,
              });
            } else if (item.isSellbuy == "2") {
              param.buy.push({
                buyCostMoney: parseFloat(item.sellCostMoney), // 销售计费金额，未设置传0
                buyCostUnit: parseFloat(item.sellCost), // 销售计费单位，1.元/斤 2.元/吨 3.%(百分比)，未设置传0
                productId: ids,
              });
            }
          });

          if (param.sell.length == 0 && param.buy.length == 0) {
            this.$warning("请输入交易费");
            return;
          }
          let data = "确认保存配置";
          this.$confirm(data, "提示", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              batchUnfixd(param).then((res) => {
                if (res.status == 200) {
                  this.$success("配置成功");
                  this.handleCancel();
                }
              });
            })
            .catch(() => {});
        }
      });
    },
    // 取消
    handleCancel() {
      let path = "/costsetting/nofixedCost";
      this.$closePage(path);
    },
    submitData(val) {
      this.form = {
        transportMoney: "", // 运输费
        loaddingMoney: "", // 装卸费
        name1: "1",
        name2: "1",
      };
      this.infoData = [];

      this.vloading = false;
      this.infoFormData = {
        isSellbuy: "1", // 计费方式
        sellCost: "1", // 交易费类型
        sellCostMoney: 0, // 交易费用
      };
      this.editableTabsValue = "1";
      this.editableTabs = [];

      this.isSetting = 1;
      this.isSettingStatus = "";
      this.isEditData = {};
      this.isTypeSales = "1";

      productCate({
        modelType: "0",
      }).then((res) => {
        if (res.status == 200) {
          this.editableTabs = res.data;
          setTimeout(() => {
            this.getList(val.uid);
          }, 0);
        }
      });
    },
    handleDialog(form, title, record) {
      this.$refs[form].historyconfigBtn(record);
    },
    handleDialog1() {
      this.dialogTableVisible = true;
    },
    // 获取是否大于0
    checkedLength(item) {
      let nums = 0;
      item.childList.forEach((res, i) => {
        res.childList.forEach((res1, l) => {
          if (res1.checked && !res1.isSelectedNo) {
            nums += 1;
          }
        });
        if (res.dataList && res.dataList.length > 0) {
          res.dataList.forEach((daitem, daindex) => {
            if (daitem.isSellbuy == this.infoFormData.isSellbuy) {
              daitem.thrid.forEach((daitem1, daindex1) => {
                if (daitem1.dachecked && !daitem1.daisSelectedNo) {
                  nums += 1;
                }
              });
            }
          });
        }
      });
      return nums;
    },
    checkedLength1(item1) {
      let nums = 0;
      item1.childList.forEach((res1, l) => {
        if (res1.checked && !res1.isSelectedNo) {
          nums += 1;
        }
      });

      if (item1.dataList && item1.dataList.length > 0) {
        item1.dataList.forEach((daitem, daindex) => {
          if (daitem.isSellbuy == this.infoFormData.isSellbuy) {
            daitem.thrid.forEach((daitem1, daindex1) => {
              if (daitem1.dachecked && !daitem1.daisSelectedNo) {
                nums += 1;
              }
            });
          }
        });
      }

      return nums;
    },
    handlecheckedClose(item2, index, index1, index2) {
      this.$set(
        this.editableTabs[index].childList[index1].childList[index2],
        "checked",
        false
      );
      this.handleChecked3(item2, index, index1, index2);
    },
    handlecheckedClose1(item2, index, index1, index2) {
      this.$set(
        this.editableTabs[index].childList[index1].childList[index2],
        "checked",
        false
      );
    },
  },
  created() {},
  //进入页面触发
  beforeRouteEnter(to, form, next) {
    next((vm) => {
      vm.initData();
    });
  },
};
</script>

<style lang="scss" scoped>
.nofixedCostSettingModel {
  .page_footer {
    width: 100%;
    text-align: right;
    background-color: #fff;
    border-top: 1px solid #e4e7ed;
    // height: 20px;
    position: fixed;
    bottom: 0px;
    padding: 15px;
    right: 20px;
  }
}
</style>

<style lang="scss">
.nofixedCostSettingModel {
  .el-card__header {
    background: rgba(0, 0, 0, 0.04);
    padding: 4px 15px;
  }

  .el-card__body {
    padding: 10px;
  }

  .el-tabs__nav-scroll {
    margin-right: 120px;
  }

  .el-tabs__nav-next {
    right: 100px;
  }

  .el-tag .el-tag__close {
    color: rgba(0, 0, 0, 0.45);
  }

  .el-tag .el-tag__close:hover {
    background: none;
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
</style>