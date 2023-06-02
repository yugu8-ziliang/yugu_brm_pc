<template>
  <!-- 编辑商品 -->
  <PageNoScroll class="editCommodityModel">
    <div>
      <div
        style="color: rgba(1, 6, 33, 0.9); font-size: 16px; font-weight: 700"
      >
        商品信息
      </div>
    </div>

    <div style="padding: 10px 0px 0px">
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
        size="small"
      >
        <el-row :gutter="20" style="padding-bottom: 10px">
          <el-col :span="8">
            <el-form-item label="种类：" prop="productid">
              <el-cascader
                ref="myCascader"
                placeholder="请选择种类"
                style="width: 100%"
                v-model="form.productid"
                :options="proList"
                @change="handleProductChange"
                :props="{
                  value: 'categoryId',
                  label: 'categoryName',
                  children: 'childList',
                  emitPath: false,
                }"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8" v-if="form.productname == '其他'">
            <el-form-item label="其他：" prop="other">
              <el-select
                style="width: 100%"
                v-model="form.other"
                filterable
                remote
                placeholder="请输入"
                :remote-method="otherRemoteMethod"
              >
                <el-option
                  v-for="item in otherOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="品种/品牌：" prop="variety">
              <el-input
                v-model="form.variety"
                placeholder="请选择品种"
                @focus="varietyFocus"
                readonly
              ></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="产地：" prop="regionid">
              <el-cascader
                ref="myCascader1"
                placeholder="请选择种类"
                style="width: 100%"
                v-model="form.regionid"
                :options="regList"
                @focus="regionFocus"
                @change="regionChange"
                :props="{
                  value: 'rid',
                  label: 'name',
                  children: 'childList',
                  emitPath: false,
                }"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="级别/规格：" prop="spec">
              <el-select
                v-model="form.spec"
                filterable
                placeholder="请选择或输入"
                style="width: 100%"
                remote
                :remote-method="specRemoteMethod"
              >
                <el-option
                  v-for="item in specOptions"
                  :key="item.specname"
                  :label="item.specname"
                  :value="item.specname"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="计算单位：" prop="subunit">
              <el-input
                v-model="form.subunitFocus"
                @focus="subunitFocus"
                readonly
                placeholder="请输入"
              >
              </el-input>
              <!-- <span style="
                    position: absolute;
                   left: 16px;
                    font-size: 14px;
                    color: rgba(1, 6, 33, 0.75);
                  ">{{ form.subunit }}
                {{ form.subUnit2 != '' ? '(':'' }}
                {{ form.subUnit3Weight==0 ? '' : form.subUnit3Weight + form.subUnit3}}
                {{ form.subUnit3 !='' ? '*' : '' }}
                {{ form.subUnit2Weight==0 ? '' :  form.subUnit2Weight + form.subUnit2}}
                {{ form.subUnit2 != '' ? '/'+form.subunit : ''}}
                {{ form.subUnit2 != '' ? ')':'' }}</span> -->
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item
              :label="tableData.purStatus == 1 ? '采购单价：' : '生产单价：'"
              prop="purchaseprice"
              :rules="[
                {
                  required: true,
                  message:
                    tableData.purStatus == 1
                      ? '请输入采购单价'
                      : '请输入生产单价',
                  trigger: 'blur',
                },
              ]"
            >
              <el-input-number
                style="width: 100%"
                v-model="form.purchaseprice"
                controls-position="right"
                :min="1"
                :precision="2"
              >
              </el-input-number>

              <span
                style="
                  position: absolute;
                  right: 10px;
                  font-size: 14px;
                  color: rgba(1, 6, 33, 0.75);
                "
                >{{ purSubunit() }}</span
              >
            </el-form-item>
          </el-col>
        </el-row>

        <el-row
          :gutter="20"
          style="padding: 10px 0px; border-top: 1px solid #e9e9e9"
        >
          <el-col :span="8">
            <el-form-item label="选择计件单位：" prop="pieceunit">
              <el-select
                v-model="form.pieceunit"
                placeholder="请选择"
                style="width: 100%"
              >
                <el-option
                  v-for="item in pieceOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="添加数量：" prop="purchasenums">
              <div class="flex_dom flex_item_mid">
                <el-input-number
                  style="width: 100%"
                  v-model="form.purchasenums"
                  controls-position="right"
                  :min="1"
                  :precision="precisionSun()"
                ></el-input-number>
                <span
                  style="
                    position: absolute;
                    right: 63px;
                    font-size: 14px;
                    color: rgba(1, 6, 33, 0.75);
                  "
                  >{{ form.subunit }}</span
                >

                <!--  :disabled="precisionSun3()"  -->
                <el-button
                  :disabled="precisionSun3()"
                  type="text"
                  size="mini"
                  style="margin-left: 5px"
                  @click="handleEdit('weighingDialog', '批量过磅', form)"
                  >{{ precisionSun2() }}</el-button
                >
              </div>
            </el-form-item>
          </el-col>
          <el-col
            :span="8"
            v-if="form.pieceunit != '无' && form.pieceunit != ''"
          >
            <el-form-item label="添加件数：" prop="piecenumber">
              <div class="flex_dom flex_item_mid">
                <el-input-number
                  style="width: 100%"
                  v-model="form.piecenumber"
                  controls-position="right"
                  :min="1"
                  :precision="0"
                ></el-input-number>
                <span
                  style="
                    position: absolute;
                    right: 10px;
                    font-size: 14px;
                    color: rgba(1, 6, 33, 0.75);
                  "
                  v-html="pieceunitHt()"
                ></span>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </div>

    <div
      style="padding: 0px 0px 10px"
      class="flex_dom flex_item_between flex_item_mid"
    >
      <div>
        <div v-if="precisionSun() != 0 && form.pieceunit == '筐(周转筐)'">
          <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
            ><span style="color: #e8541e">*</span> 是否去皮：</span
          >
          <el-radio-group v-model="form.isRemovePeel">
            <el-radio :label="1">去皮</el-radio>
            <el-radio :label="0">不去皮</el-radio>
          </el-radio-group>
        </div>
      </div>
      <div>
        <el-button
          size="mini"
          style="
            margin-left: 5px;
            border: 1px solid var(--color-primary);
            color: var(--color-primary);
          "
          icon="el-icon-plus"
          @click="addHomeBasket"
          >添加自家筐子</el-button
        >

        <el-button
          v-if="tableData.purStatus == 1"
          size="mini"
          style="
            margin-left: 5px;
            border: 1px solid var(--color-primary);
            color: var(--color-primary);
          "
          icon="el-icon-plus"
          @click="addOverFlowBasket"
          >添加卖家筐子</el-button
        >
      </div>
    </div>
    <div ref="currentBasketDetailsTable">
      <el-scrollbar
        ref="scrollDiv"
        :style="{
          height: parseInt($store.getters.screenHeight - SetHeight - 70) + 'px',
        }"
      >
        <el-card class="box-card" v-if="mySellerList.length > 0">
          <div
            v-for="(item, index) in mySellerList"
            :key="index"
            style="padding: 15px 0px 10px; border-bottom: 1px solid #e9e9e9"
          >
            <div class="flex_dom flex_item_mid">
              <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                >[{{ item.basketType }}] {{ item.basketname }}</span
              >
              <div>
                <el-tag
                  type="warning"
                  size="mini"
                  style="margin: 0px 10px"
                  v-if="item.ismyseller == 1"
                  >自家筐子</el-tag
                >
                <el-tag
                  type="success"
                  size="mini"
                  style="margin: 0px 10px"
                  v-if="item.ismyseller == 2"
                  >卖家筐子</el-tag
                >
              </div>

              <span
                style="color: rgba(1, 6, 33, 0.65); font-size: 14px"
                v-if="item.ismyseller == 1"
                >空置总量：<span style="color: rgba(1, 6, 33, 0.9)"
                  >{{ item.nums }}个</span
                ></span
              >
            </div>

            <div v-for="(item2, index2) in item.basketinfo" :key="index2">
              <div>
                <span
                  style="
                    color: var(--color-primary);
                    font-size: 14px;
                    margin-right: 10px;
                  "
                  >[{{ item2.basketcolor }}]</span
                >

                <span
                  style="
                    color: rgba(1, 6, 33, 0.65);
                    font-size: 14px;
                    margin-right: 10px;
                  "
                  v-if="item.ismyseller == 1"
                  >空置数量：<span style="color: rgba(1, 6, 33, 0.9)"
                    >{{ item2.nums }}个</span
                  ></span
                >

                <el-button
                  style="font-size: 14px; color: #dd4c4d"
                  type="text"
                  @click="removeBasket(index, index2)"
                  >移除
                </el-button>
              </div>

              <div>
                <el-form
                  :model="item.basketinfo[index2]"
                  :rules="rules2"
                  ref="tableBody"
                  label-width="60px"
                  class="demo-ruleForm"
                  label-position="left"
                  size="mini"
                >
                  <el-row :gutter="20">
                    <el-col
                      :span="6"
                      v-if="
                        precisionSun() != 0 &&
                        form.pieceunit == '筐(周转筐)' &&
                        form.isRemovePeel == 1
                      "
                    >
                      <el-form-item
                        label="重量："
                        prop="basketWeight"
                        label-width="55px"
                      >
                        <div class="flex_dom flex_item_mid">
                          <el-input-number
                            placeholder="请输入重量"
                            style="width: 100%"
                            v-model="item2.basketWeight"
                            controls-position="right"
                            :min="1"
                            :precision="2"
                          >
                          </el-input-number>

                          <span
                            style="
                              position: absolute;
                              right: 10px;
                              font-size: 14px;
                              color: rgba(1, 6, 33, 0.75);
                            "
                            >斤/个</span
                          >
                        </div>
                      </el-form-item>
                    </el-col>

                    <el-col :span="6">
                      <el-form-item label="载货量：" prop="basketLoading">
                        <div class="flex_dom flex_item_mid">
                          <el-popover
                            placement="top-start"
                            title=""
                            width="200"
                            trigger="hover"
                            content="该数量的填写仅供参考，具体以实际数值为准"
                          >
                            <i
                              slot="reference"
                              class="el-icon-warning-outline"
                              style="
                                font-size: 15px;
                                color: var(--color-primary);
                                margin-right: 5px;
                              "
                            ></i>
                          </el-popover>

                          <el-input-number
                            placeholder="请输入载货量"
                            style="width: 100%"
                            v-model="item2.basketLoading"
                            controls-position="right"
                            :min="1"
                            :precision="2"
                          >
                          </el-input-number>

                          <span
                            style="
                              position: absolute;
                              right: 10px;
                              font-size: 14px;
                              color: rgba(1, 6, 33, 0.75);
                            "
                            >{{ form.subunit }}/<span
                              style="color: rgba(223, 151, 26, 1)"
                              >筐</span
                            ></span
                          >
                        </div>
                      </el-form-item>
                    </el-col>
                    <el-col :span="6" v-if="item.ismyseller == 2">
                      <el-form-item
                        label="价格："
                        prop="unit"
                        label-width="55px"
                      >
                        <el-input-number
                          placeholder="请输入价格"
                          style="width: 100%"
                          v-model="item2.unit"
                          controls-position="right"
                          :min="1"
                          :precision="2"
                        >
                        </el-input-number>

                        <span
                          style="
                            position: absolute;
                            right: 10px;
                            font-size: 14px;
                            color: rgba(1, 6, 33, 0.75);
                          "
                          >元/个</span
                        >
                      </el-form-item>
                    </el-col>
                    <el-col :span="6">
                      <el-form-item
                        label="使用："
                        prop="basketNum"
                        label-width="55px"
                      >
                        <el-input-number
                          placeholder="请输入使用数量"
                          style="width: 100%"
                          v-model="item2.basketNum"
                          controls-position="right"
                          :min="1"
                          :precision="0"
                        >
                        </el-input-number>

                        <span
                          style="
                            position: absolute;
                            right: 10px;
                            font-size: 14px;
                            color: rgba(1, 6, 33, 0.75);
                          "
                          >个</span
                        >
                      </el-form-item>
                    </el-col>
                  </el-row>
                </el-form>
              </div>
            </div>
          </div>

          <div
            class="flex_dom"
            style="padding: 15px 0px 0px; flex-direction: row-reverse"
          >
            <span
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 16px;
                font-weight: 700;
              "
              >{{ basketType().paramString }}</span
            >
          </div>
        </el-card>

        <div style="padding: 15px 0px 0px">
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
          <div class="flex_dom flex_item_end">
            <div>
              <div
                style="padding: 5px 0px"
                v-if="
                  precisionSun() != 0 &&
                  form.pieceunit == '筐(周转筐)' &&
                  form.isRemovePeel == 1
                "
              >
                <span
                  style="
                    color: rgba(1, 6, 33, 0.55);
                    font-size: 14px;
                    width: 250px;
                    display: inline-block;
                  "
                  >商品毛重：<span
                    style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                    >{{ form.purchasenums || 0 }}{{ form.subunit }}</span
                  ></span
                >
              </div>

              <div
                style="padding: 5px 0px"
                v-if="
                  precisionSun() != 0 &&
                  form.pieceunit == '筐(周转筐)' &&
                  form.isRemovePeel == 1
                "
              >
                <span
                  style="
                    color: rgba(1, 6, 33, 0.55);
                    font-size: 14px;
                    width: 250px;
                    display: inline-block;
                  "
                  >筐子重量：<span
                    style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                    >{{ basketType().basketweight + form.subunit }}</span
                  ></span
                >
              </div>

              <div
                style="padding: 5px 0px"
                v-if="
                  precisionSun() != 0 &&
                  form.pieceunit == '筐(周转筐)' &&
                  form.isRemovePeel == 1
                "
              >
                <span
                  style="
                    color: rgba(1, 6, 33, 0.55);
                    font-size: 14px;
                    width: 250px;
                    display: inline-block;
                  "
                  >商品净重：<span
                    style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                    >{{ basketType().productweight + form.subunit }}</span
                  ></span
                >
              </div>

              <div
                style="padding: 5px 0px"
                v-if="
                  precisionSun() == 0 ||
                  form.pieceunit != '筐(周转筐)' ||
                  form.isRemovePeel == 0
                "
              >
                <span
                  style="
                    color: rgba(1, 6, 33, 0.55);
                    font-size: 14px;
                    width: 250px;
                    display: inline-block;
                  "
                  >商品数量：<span
                    style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                  >
                    {{ (form.purchasenums || 0) + form.subunit }}
                    {{ form.subUnit2 != "" ? "(" : "" }}
                    {{
                      form.subUnit3Weight == 0
                        ? ""
                        : form.subUnit3Weight + form.subUnit3
                    }}
                    {{ form.subUnit3 != "" ? "*" : "" }}
                    {{
                      form.subUnit2Weight == 0
                        ? ""
                        : form.subUnit2Weight + form.subUnit2
                    }}
                    {{ form.subUnit2 != "" ? "/" + form.subunit : "" }}
                    {{ form.subUnit2 != "" ? ")" : "" }}
                    {{
                      form.pieceunit != ""
                        ? form.pieceunit != "筐(一次性)"
                          ? form.pieceunit != "筐(周转筐)" &&
                            form.pieceunit != "无"
                            ? "(" + form.piecenumber + form.pieceunit + ")"
                            : ""
                          : "(" + form.piecenumber + "筐)"
                        : ""
                    }}
                    {{
                      this.basketType().allbasketnums != 0 &&
                      form.pieceunit == "筐(周转筐)"
                        ? "| " + this.basketType().allbasketnums
                        : ""
                    }}<font
                      v-if="
                        this.basketType().allbasketnums != 0 &&
                        form.pieceunit == '筐(周转筐)'
                      "
                      style="color: #df971a"
                      >筐</font
                    >
                  </span></span
                >
              </div>
            </div>

            <div style="padding: 5px 0px">
              <span
                style="
                  color: rgba(1, 6, 33, 0.55);
                  font-size: 14px;
                  width: 250px;
                  display: inline-block;
                "
                >商品单价：<span
                  style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                  >{{ (form.purchaseprice || 0) | intervalFormat(false)
                  }}{{ purSubunit() || "" }}</span
                ></span
              >
              <span
                style="
                  color: rgba(1, 6, 33, 0.9);
                  font-size: 14px;
                  font-weight: 700;
                  width: 250px;
                  display: inline-block;
                "
                >商品金额：<span
                  style="color: rgba(221, 76, 77, 1); font-size: 14px"
                  >{{
                    basketType().productamount | intervalFormat(false)
                  }}元</span
                ></span
              >
            </div>
          </div>
          <div style="width: 100%; height: 1px; background: #e6e6e6"></div>
          <div style="padding: 10px 0px" v-if="basketType().buybasketType != 0">
            <span
              style="
                color: rgba(1, 6, 33, 0.55);
                font-size: 14px;
                width: 250px;
                display: inline-block;
              "
              >卖家筐子种类：<span
                style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                >{{ basketType().buybasketType }}种</span
              ></span
            >
            <span
              style="
                color: rgba(1, 6, 33, 0.55);
                font-size: 14px;
                width: 250px;
                display: inline-block;
              "
              >购入筐子：<span
                style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                >{{ basketType().buybasketnum }}个</span
              ></span
            >
            <span
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 14px;
                font-weight: 700;
              "
              >筐子金额：<span
                style="color: rgba(221, 76, 77, 1); font-size: 14px"
                >{{ basketType().basketamount | intervalFormat(false) }}元</span
              ></span
            >
          </div>
          <div style="padding: 10px 0px" v-if="basketType().mybasketType != 0">
            <span
              style="
                color: rgba(1, 6, 33, 0.55);
                font-size: 14px;
                width: 250px;
                display: inline-block;
              "
              >自家筐子种类：<span
                style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                >{{ basketType().mybasketType }}种</span
              ></span
            >
            <span
              style="
                color: rgba(1, 6, 33, 0.55);
                font-size: 14px;
                width: 250px;
                display: inline-block;
              "
              >使用自家筐子：<span
                style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                >{{ basketType().mybasketnum }}个</span
              ></span
            >
          </div>
        </div>
      </el-scrollbar>
    </div>

    <div class="btnBottom">
      <div class="flex_row_reverse flex_item_mid">
        <div style="margin-right: 10px">
          <el-button type="primary" size="mini" @click="handleAdd"
            >提 交</el-button
          >
        </div>
        <div style="margin-right: 10px">
          <span style="font-size: 16px; color: rgba(1, 6, 33, 0.9)"
            >金额合计：</span
          ><span style="font-size: 16px; color: rgba(221, 76, 77, 1)"
            >{{ basketType().sumamount | intervalFormat(false) }}元</span
          >
        </div>
      </div>
    </div>
    <varietyDialog
      ref="varietyDialog"
      @varietyChange="varietyChange"
    ></varietyDialog>
    <subunitDialog
      ref="subunitDialog"
      @subunitChange="subunitChange"
    ></subunitDialog>
    <weighingDialog
      ref="weighingDialog"
      @weighingChange="weighingChange"
    ></weighingDialog>
    <addHomeBasket
      ref="addHomeBasket"
      @addHomeBasket="addHomeBasketList"
    ></addHomeBasket>
    <addOverFlowBasket
      ref="addOverFlowBasket"
      @addOverFlowBasket="addOverFlowBasketList"
    ></addOverFlowBasket>
  </PageNoScroll>
</template>

<script>
import elementResizeDetectorMaker from "element-resize-detector";
import { Base64 } from "js-base64";
import {
  productCate,
  varietyList,
  getRegion,
  specList,
} from "@/request/api/commodityManage/commodityList";

export default {
  name: "editCommodity",
  components: {
    varietyDialog: () => import("./dialogmod/varietyDialog.vue"), // 品种/品牌
    subunitDialog: () => import("./dialogmod/subunitDialog.vue"), // 计算单位
    weighingDialog: () => import("./dialogmod/weighingDialog.vue"), // 批量过磅
    addHomeBasket: () => import("./dialogmod/addHomeBasket.vue"), // 添加自家筐子
    addOverFlowBasket: () => import("./dialogmod/addOverFlowBasket.vue"), // 添加卖家筐子
  },
  data() {
    var validatePiecenumber = (rule, value, callback) => {
      if (value == "" || value == undefined || value == null) {
        callback(new Error("请输入件数"));
      } else {
        if (
          (this.precisionSun() != 0 && this.form.pieceunit == "筐(周转筐)") ||
          (this.precisionSun() == 0 &&
            ["箱", "袋", "盒", "件", "筐(一次性)", "筐(周转筐)"].indexOf(
              this.form.pieceunit
            ) != -1)
        ) {
          if (this.form.purchasenums < this.form.piecenumber) {
            callback(new Error("计件件数必须小于等于添加数量"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      }
    };
    var validateBasketWeight = (rule, value, callback) => {
      if (value == "" || value == undefined || value == null) {
        callback(new Error("请输入使用数量"));
      } else {
        let Nums = 0;
        let isNum = 0;
        for (let i = 0; i < this.mySellerList.length; i++) {
          const el = this.mySellerList[i];
          for (let j = 0; j < el.basketinfo.length; j++) {
            const ele = el.basketinfo[j];
            if (
              ele.basketNum != "" &&
              ele.basketNum != undefined &&
              ele.basketNum != null
            ) {
              Nums += parseFloat(ele.basketNum);
            } else {
              isNum += 1;
            }
          }
        }

        for (let i = 0; i < this.$refs.tableBody.length; i++) {
          this.$refs.tableBody[i].clearValidate("basketNum");
        }

        if (this.form.pieceunit == "无") {
          if (Nums > this.form.purchasenums) {
            callback(new Error("总使用数量应小于等于添加数量"));
          } else {
            callback();
          }
        } else if (this.form.pieceunit == "筐(周转筐)") {
          if (isNum == 0) {
            if (Nums != this.form.piecenumber) {
              callback(new Error("总使用数量必须等于添加件数"));
            } else {
              callback();
            }
          } else {
            callback();
          }
        } else if (
          this.form.pieceunit != "无" ||
          this.form.pieceunit != "筐(周转筐)"
        ) {
          if (Nums > this.form.piecenumber) {
            callback(new Error("总使用数量应小于等于添加件数"));
          } else {
            callback();
          }
        } else {
          callback();
        }
      }
    };
    return {
      tableData: {},
      SetHeight: 0,
      form: {
        pathProductName: "", // 商品全部名称
        productname: "", // 商品名称
        productid: "", // 商品ID
        other: "", //选择其他分类时填写
        variety: "", // 品牌
        regionid: "", //产地id
        regionname: "", //产地
        pathRegionname: "", // 产地全部名称
        spec: "", // 规格
        subunitFocus: "", //计算单位拼接
        subunit: "", // 计算单位
        subUnit2: "", // 二级计算单位，2021-11-15需求优化新增
        subUnit2Weight: 0, // 二级计算单位重量，2021-11-15需求优化新增
        subUnit3: "", // 三级计算单位，2021-11-15需求优化新增
        subUnit3Weight: 0, // 三级计算单位，2021-11-15需求优化新增
        purchaseprice: undefined, //采购单价
        pieceunit: "", // 计件单位
        purchasenums: undefined, // 添加数量
        piecenumber: undefined, // 添加件数

        isRemovePeel: 1,

        basketweight: 0, // 筐子重量 总重 重量*使用数量
        productweight: 0, // 商品净重 商品毛重=添加数量 -筐子重量
        productamount: 0, // 商品金额 商品净重*商品单价 商品数量*商品单价
        basketamount: 0, //筐子金额  卖家筐子：筐子标签-筐子名称-颜色的使用数量*价格，所有用的卖家筐子的总价格
        sumamount: 0, // 金额小计 商品金额+筐子金额
        buybasketType: 0, //卖家筐子种类
        buybasketnum: 0, // 购入筐子数量 卖家筐子总使用数量
        mybasketType: 0, //自家筐子种类
        mybasketnum: 0, //使用自家筐子使用数量
        mybasketnumOwn: 0, //当前库存空置筐子数量自家筐子总数
        basketkindnum: 0, // 使用筐子种类  总和
        allbasketnums: 0, // 该商品使用筐子的总数量 总和
      },
      rules: {
        productid: [
          {
            required: true,
            message: "请选择种类",
            trigger: ["blur", "change"],
          },
        ],
        other: [
          {
            required: true,
            message: "请输入其他",
            trigger: ["blur", "change"],
          },
        ],
        variety: [
          {
            required: true,
            message: "请选择品种/品牌",
            trigger: ["blur", "change"],
          },
        ],
        regionid: [
          {
            required: true,
            message: "请选择产地",
            trigger: ["blur", "change"],
          },
        ],
        spec: [
          {
            required: true,
            message: "请选择或输入级别/规格",
            trigger: ["blur", "change"],
          },
        ],
        subunit: [
          {
            required: true,
            message: "请选择计算单位",
            trigger: ["blur", "change"],
          },
        ],
        pieceunit: [
          {
            required: true,
            message: "请选择计件单位",
            trigger: ["blur", "change"],
          },
        ],
        purchasenums: [
          {
            required: true,
            message: "请输入数量",
            trigger: "blur",
          },
        ],
        piecenumber: [
          {
            required: true,
            validator: validatePiecenumber,
            trigger: "blur",
          },
        ],
      },
      rules2: {
        basketWeight: [
          {
            required: true,
            message: "请输入重量",
            trigger: "blur",
          },
        ],
        unit: [
          {
            required: true,
            message: "请输入价格",
            trigger: "blur",
          },
        ],
        basketNum: [
          {
            required: true,
            validator: validateBasketWeight,
            trigger: "blur",
          },
        ],
      },
      proList: [],
      otherOptions: [],
      // varList: [],
      regList: [],
      specOptions: [],
      pieceOptions: ["无", "箱", "袋", "盒", "件", "筐(一次性)", "筐(周转筐)"],
      mySellerList: [],
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
          this.tableData = JSON.parse(JSON.stringify(param));
          let dataP = JSON.parse(
            JSON.stringify(this.$store.getters.editCommodityData)
          );
          this.$store.dispatch("common/editCommodityData", {});
          if (!dataP.isCommType) {
            this.handleRouter();
            return;
          }
          this.form.commodityIndex = dataP.commodityIndex;
          if (dataP.isCommType != "add") {
            this.form = JSON.parse(JSON.stringify(dataP));
            this.mySellerList = dataP.basketInfo;
            delete this.form.basketInfo;

            this.getListData();
            this.getRegionList();
            this.getSpecList();
          } else {
            this.form.commodityIndex = dataP.commodityIndex;
            this.getListData();
          }
        } catch (error) {
          this.handleRouter();
        }
        return;
      }
      this.handleRouter();
    },
    // 获取种类
    getListData() {
      productCate({
        modelType: 1,
      }).then((res) => {
        if (res.status == 200) {
          this.proList = this.filterChildren(res.data);
        }
      });
    },
    // 获取品牌
    // getVarietyList() {
    //   varietyList({
    //     categoryId: this.form.productid
    //   }).then((res) => {
    //     if (res.status == 200) {
    //       this.varList = res.data;
    //     }
    //   });
    // },
    // 产地
    getRegionList() {
      getRegion({
        classifyId: this.form.productid,
        variety: this.form.variety,
      }).then((res) => {
        if (res.status == 200) {
          let resData = res.data[0];
          // 常用产地 actlRegion
          // 国内 regions
          // 国外 foreignRegions
          let redData = [];
          if (resData.actlRegion.length > 0) {
            redData.push({
              rid: 1,
              name: "常用产地",
              childList: resData.actlRegion,
            });
          }
          if (resData.regions.length > 0) {
            redData.push({
              rid: 2,
              name: "国内",
              childList: resData.regions,
            });
          }
          if (resData.foreignRegions.length > 0) {
            redData.push({
              rid: 3,
              name: "国外",
              childList: resData.foreignRegions,
            });
          }
          this.regList = redData;
        }
      });
    },
    // 级别/规格
    getSpecList() {
      specList({
        categoryId: this.form.productid,
      }).then((res) => {
        if (res.status == 200) {
          this.specOptions = res.data;
        }
      });
    },
    // 其他远程搜索
    otherRemoteMethod(val) {
      this.form.other = val;
    },
    specRemoteMethod(query) {
      if (query !== "") {
        setTimeout(() => {
          this.specOptions = this.specOptions.filter((item) => {
            return item.specname.indexOf(query) > -1;
          });
          if (this.specOptions.length == 0) {
            this.getSpecList();
          }
        }, 200);
      } else {
        this.getSpecList();
      }
      this.$set(this.form, "spec", query);
    },
    // 种类
    handleProductChange(val) {
      this.form.pathProductName = this.$refs.myCascader
        .getCheckedNodes()[0]
        .pathLabels.join("-");
      this.form.productname = this.$refs.myCascader.getCheckedNodes()[0].label;
      this.form.variety = ""; // 品牌;
      this.form.regionid = ""; //产地id
      this.form.regionname = ""; //产地
      this.form.pathRegionname = ""; // 产地全部名称
      // this.varList = [];
      this.regList = [];
      // this.getVarietyList();
      this.getSpecList();
    },
    //品牌
    varietyFocus() {
      if (!this.form.productid) {
        this.$warning("请先选择种类");
      } else {
        this.handleEdit("varietyDialog", "品种/品牌", this.form);
      }
    },
    // 计算单位
    subunitFocus() {
      if (!this.form.productid) {
        this.$warning("请先选择种类");
      } else {
        this.handleEdit("subunitDialog", "计算单位", this.form);
      }
    },
    varietyChange(val) {
      this.form.variety = val.variety;
      this.form.regionid = ""; //产地id
      this.form.regionname = ""; //产地
      this.form.pathRegionname = ""; // 产地全部名称
      this.getRegionList();
    },
    subunitChange(val) {
      this.form.subunit = val.subunit; // 计算单位
      this.form.subUnit2 = val.subUnit2; // 二级计算单位，2021-11-15需求优化新增
      this.form.subUnit2Weight = val.subUnit2Weight || 0; // 二级计算单位重量，2021-11-15需求优化新增
      this.form.subUnit3 = val.subUnit3; // 三级计算单位，2021-11-15需求优化新增
      this.form.subUnit3Weight = val.subUnit3Weight || 0; // 三级计算单位，2021-11-15需求优化新增

      let paramS = this.form.subunit;
      paramS += this.form.subUnit2 != "" ? "(" : "";
      paramS +=
        this.form.subUnit3Weight == 0
          ? ""
          : this.form.subUnit3Weight + this.form.subUnit3;
      paramS += this.form.subUnit3 != "" ? "*" : "";
      paramS +=
        this.form.subUnit2Weight == 0
          ? ""
          : this.form.subUnit2Weight + this.form.subUnit2;
      paramS += this.form.subUnit2 != "" ? "/" + this.form.subunit : "";
      paramS += this.form.subUnit2 != "" ? ")" : "";
      this.form.subunitFocus = paramS;
    },
    weighingChange(val) {
      this.form.purchasenums = val.purchasenums;
      this.form.piecenumber = val.piecenumber;
      this.$refs.ruleForm.clearValidate(["purchasenums", "piecenumber"]);
    },
    // 产地
    regionFocus() {
      if (!this.form.productid) {
        this.$warning("请先选择种类");
        return;
      }
      if (!this.form.variety) {
        this.$warning("请先选择品牌");
        return;
      }
    },
    regionChange() {
      // this.form.regionname = this.$refs.myCascader1.getCheckedNodes()[0].label;
      this.form.regionname = this.setpathRegionname(
        this.$refs.myCascader1.getCheckedNodes()[0].pathLabels
      );
      this.form.pathRegionname = this.$refs.myCascader1
        .getCheckedNodes()[0]
        .pathLabels.join("-"); // 产地全部名称
    },
    setpathRegionname(val) {
      if (val[0] == "国内") {
        return val[2] + "-" + val[3];
      } else {
        return val[1];
      }
    },
    // 采购单价单位
    purSubunit() {
      if (!this.form.subunit) {
        return "";
      } else {
        return "元/" + this.form.subunit;
      }
    },
    // 小数点判断 斤非斤判断
    precisionSun() {
      if (
        this.form.subunit == "斤" ||
        this.form.subunit == "公斤" ||
        this.form.subunit == "g"
      ) {
        return 2;
      } else {
        return 0;
      }
    },
    // 判断
    precisionSun2() {
      if (
        this.form.subunit == "斤" ||
        this.form.subunit == "公斤" ||
        this.form.subunit == "g" ||
        this.form.subunit == ""
      ) {
        return "批量过磅";
      } else {
        return "批量计件";
      }
    },
    // 判断
    precisionSun3() {
      if (
        this.form.productid &&
        this.form.variety &&
        this.form.regionid &&
        this.form.spec &&
        this.form.subunit &&
        this.form.pieceunit
      ) {
        return false;
      } else {
        return true;
      }
    },
    pieceunitHt() {
      if (this.form.pieceunit == "筐(一次性)") {
        return "筐";
      } else if (this.form.pieceunit == "筐(周转筐)") {
        return "<span style='color:#DF971A'>筐</span>";
      } else {
        return this.form.pieceunit;
      }
    },
    // 添加自有筐子
    addHomeBasket() {
      if (!this.form.productid) {
        this.$warning("请先选择种类");
        return;
      }
      this.handleEdit("addHomeBasket", "添加自有筐子", this.form);
    },
    addHomeBasketList(val) {
      for (let i = 0; i < val.length; i++) {
        const el = val[i];
        let dataP = false;

        for (let j = 0; j < el.basketinfo.length; j++) {
          const ele = el.basketinfo[j];
          this.$set(el.basketinfo, j, {
            ...ele,
            unit: undefined,
            basketNum: undefined,
            basketWeight: undefined,
            basketLoading: undefined,
          });
        }

        for (let j = 0; j < this.mySellerList.length; j++) {
          const ele = this.mySellerList[j];
          if (el.basketid == ele.basketid) {
            this.$set(this.mySellerList, j, el);
            dataP = true;
          }
        }
        if (!dataP) {
          this.mySellerList.push(el);
        }
      }
    },
    // 添加卖家筐子
    addOverFlowBasket() {
      if (!this.form.productid) {
        this.$warning("请先选择种类");
        return;
      }
      this.handleEdit("addOverFlowBasket", "添加卖家筐子", this.form);
    },
    addOverFlowBasketList(val) {
      for (let i = 0; i < val.length; i++) {
        const el = val[i];
        let dataP = false;

        for (let j = 0; j < el.basketinfo.length; j++) {
          const ele = el.basketinfo[j];
          this.$set(el.basketinfo, j, {
            ...ele,
            unit: undefined,
            basketNum: undefined,
            basketWeight: undefined,
            basketLoading: undefined,
          });
        }

        for (let j = 0; j < this.mySellerList.length; j++) {
          const ele = this.mySellerList[j];
          if (el.basketid == ele.basketid) {
            this.$set(this.mySellerList, j, el);
            dataP = true;
          }
        }
        if (!dataP) {
          this.mySellerList.push(el);
        }
      }
    },
    // 移除筐子
    removeBasket(index, index2) {
      if (this.mySellerList[index].basketinfo.length > 1) {
        this.mySellerList[index].basketinfo.splice(index2, 1);
      } else {
        this.mySellerList.splice(index, 1);
      }
    },
    // 计算
    basketType() {
      let basketweight = 0; // 筐子重量 总重 重量*使用数量
      let productweight = 0; // 商品净重 商品毛重=添加数量 - 筐子重量
      let productamount = 0; // 商品金额 商品净重*商品单价 商品数量=添加数量 * 商品单价
      let basketamount = 0; //筐子金额  卖家筐子：筐子标签-筐子名称-颜色的使用数量*价格，所有用的卖家筐子的总价格
      let sumamount = 0; // 金额小计 商品金额+筐子金额
      let buybasketType = 0; //卖家筐子种类
      let buybasketnum = 0; // 购入筐子数量 总使用数量
      let mybasketType = 0; //自家筐子种类
      let mybasketnum = 0; //使用自家筐子 总使用数量
      let mybasketnumOwn = 0; //当前库存空置筐子数量自家筐子总数
      let basketkindnum = 0; // 使用筐子种类  总和
      let allbasketnums = 0; // 该商品使用筐子的总数量 总和
      let paramString = "";

      for (let i = 0; i < this.mySellerList.length; i++) {
        const el = this.mySellerList[i];
        for (let j = 0; j < el.basketinfo.length; j++) {
          const ele = el.basketinfo[j];

          // 筐子重量 总重 重量*使用数量
          if (ele.basketWeight && ele.basketNum) {
            basketweight +=
              parseFloat(ele.basketWeight) * parseFloat(ele.basketNum);
          }
          // 自家筐子
          if (el.ismyseller == 1) {
            if (ele.basketNum) {
              // 使用自家筐子 总使用数量
              mybasketnum += parseFloat(ele.basketNum);
            }
          }
          //卖家筐子
          if (el.ismyseller == 2) {
            // 筐子金额 卖家筐子 数量*价格，所有用的卖家筐子的总价格
            if (ele.basketNum && ele.unit) {
              basketamount += parseFloat(ele.basketNum) * parseFloat(ele.unit);
            }
            if (ele.basketNum) {
              //购入筐子数量 总使用数量
              buybasketnum += parseFloat(ele.basketNum);
            }
          }

          if (ele.basketNum) {
            // 该商品使用筐子的总数量 总和
            allbasketnums += parseFloat(ele.basketNum);
          }
        }

        // 自家筐子
        if (el.ismyseller == 1) {
          // 自家筐子种类
          mybasketType += 1;
          // 当前库存空置筐子数量自家筐子总数
          mybasketnumOwn += el.nums;
        }
        //卖家筐子
        if (el.ismyseller == 2) {
          // 卖家筐子种类
          buybasketType += 1;
        }
        basketkindnum += 1;
      }

      // 商品净重 商品毛重=添加数量 - 筐子重量
      if (this.form.subunit == "公斤") {
        productweight = (this.form.purchasenums || 0) * 2 - basketweight;
      }
      if (this.form.subunit == "斤") {
        productweight = (this.form.purchasenums || 0) - basketweight;
      }
      if (this.form.subunit == "g") {
        productweight = (this.form.purchasenums || 0) / 500 - basketweight;
      }

      // 商品金额 商品净重*商品单价 商品数量=添加数量 * 商品单价
      if (
        this.precisionSun() != 0 &&
        this.form.pieceunit == "筐(周转筐)" &&
        this.form.isRemovePeel == 1
      ) {
        productamount = productweight * (this.form.purchaseprice || 0);
      }

      if (
        this.precisionSun() == 0 ||
        this.form.pieceunit != "筐(周转筐)" ||
        this.form.isRemovePeel == 0
      ) {
        productamount =
          (this.form.purchasenums || 0) * (this.form.purchaseprice || 0);
      }

      // 金额小计 商品金额+筐子金额
      sumamount = productamount + basketamount;

      // 合计
      let paramList = [];
      if (buybasketnum != 0) {
        paramList.push("共购入筐子" + buybasketnum + "个");
      }

      if (mybasketnum != 0) {
        paramList.push("使用自家筐子" + mybasketnum + "个");
      }

      if (
        this.precisionSun() != 0 &&
        this.form.pieceunit == "筐(周转筐)" &&
        this.form.isRemovePeel == 1
      ) {
        if (basketweight != 0) {
          paramList.push("总重" + basketweight + "斤");
        }
      }
      paramString = paramList.toString();

      let datap = {
        basketweight, // 筐子重量 总重 重量*使用数量
        productweight, // 商品净重 商品毛重=添加数量 -筐子重量
        productamount, // 商品金额 商品净重*商品单价 商品数量*商品单价
        basketamount, //筐子金额  卖家筐子：筐子标签-筐子名称-颜色的使用数量*价格，所有用的卖家筐子的总价格
        sumamount, // 金额小计 商品金额+筐子金额
        buybasketType, //卖家筐子种类
        buybasketnum, // 购入筐子数量 卖家筐子总使用数量
        mybasketType, //自家筐子种类
        mybasketnum, //使用自家筐子
        mybasketnumOwn,
        basketkindnum, // 使用筐子种类  总和
        allbasketnums, // 该商品使用筐子的总数量 总和
        paramString,
      };
      return datap;
    },
    // 触发子组件编辑按钮
    handleEdit(form, title, record) {
      this.$refs[form].edit(record);
      this.$refs[form].title = title;
      this.$refs[form].disableSubmit = false;
      this.$refs[form].isVisiable = true;
    },
    filterChildren(childrenMap) {
      var children = [];
      childrenMap.forEach((el, index) => {
        if (el.childList && el.childList.length) {
          this.filterChildren(el.childList);
        } else {
          delete el.childList;
        }
        children.push(el);
      });
      return children;
    },
    // 跳转
    handleRouter() {
      let path = this.tableData.fullPath || "/commodityManage/addCommodity";
      this.$closePage(path);
    },
    // 提交
    async handleAdd() {
      this.$refs.ruleForm.validate(async (valida) => {
        if (valida) {
          if (this.mySellerList.length > 0) {
            let isval = await this.handleValidate();
            if (isval) {
              this.form.basketweight = this.basketType().basketweight; // 筐子重量 总重 重量*使用数量
              this.form.productweight = this.basketType().productweight; // 商品净重 商品毛重=添加数量 -筐子重量
              this.form.productamount = this.basketType().productamount; // 商品金额 商品净重*商品单价 商品数量*商品单价
              this.form.basketamount = this.basketType().basketamount; //筐子金额  卖家筐子：筐子标签-筐子名称-颜色的使用数量*价格，所有用的卖家筐子的总价格
              this.form.sumamount = this.basketType().sumamount; // 金额小计 商品金额+筐子金额
              this.form.buybasketType = this.basketType().buybasketType; //卖家筐子种类
              this.form.buybasketnum = this.basketType().buybasketnum; // 购入筐子数量 卖家筐子总使用数量
              this.form.mybasketType = this.basketType().mybasketType; //自家筐子种类
              this.form.mybasketnum = this.basketType().mybasketnum; //使用自家筐子
              this.form.mybasketnumOwn = this.basketType().mybasketnumOwn; //
              this.form.basketkindnum = this.basketType().basketkindnum; // 使用筐子种类  总和
              this.form.allbasketnums = this.basketType().allbasketnums; // 该商品使用筐子的总数量 总和
              this.form.paramString = this.basketType().paramString;

              this.$store.dispatch("common/editCommodityData", {});
              this.$store.dispatch("common/editCommodityData", {
                isCommType: "edit",
                ...this.form,
                basketInfo: this.mySellerList,
              });
              this.handleRouter();
            }
          }
        }
      });
    },
    // 获取多个form验证结果，具体参考第二种form代码
    handleValidate() {
      const list = [];
      const validas = [];

      this.$refs.tableBody.forEach((item, index) => {
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
      vm.initData();
    });
  },
  // 离开页面
  // beforeRouteLeave(to, form, next) {
  //   next()
  //   if (form.path == "/commodityManage/editCommodity") {
  //     this.handleRouter();
  //   }
  // },
  mounted() {
    this.handlerSetHeight("currentBasketDetailsTable");
  },
};
</script>

<style lang="scss" scoped>
.editCommodityModel {
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
.editCommodityModel {
  .el-form-item__label {
    padding: 0px !important;
  }

  .el-form-item {
    margin-bottom: 12px !important;
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

  .el-input-number__decrease {
    display: none !important;
  }

  .el-input-number__increase {
    display: none !important;
  }

  .el-input-number.is-controls-right .el-input__inner {
    padding-right: 15px !important;
    text-align: left !important;
  }
}
</style>