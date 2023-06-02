<template>
  <!-- 添加入库 -->
  <PageNoScroll class="addStockModel">
    <div>
      <div
        style="color: rgba(1, 6, 33, 0.9); font-size: 16px; font-weight: 700"
      >
        入库原因
      </div>
      <div style="padding: 10px 0px">
        <el-radio-group v-model="form.inreason">
          <el-radio :label="0">采购</el-radio>
          <el-radio :label="1">自家生产</el-radio>
        </el-radio-group>
      </div>

      <div v-if="form.inreason == 0">
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
                <el-form-item label="客户姓名：" prop="fromUserName">
                  <el-select
                    ref="factorySelect"
                    style="width: 100%"
                    v-model="form.fromUserName"
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
                <el-form-item label="联系电话：" prop="fromUserPhone">
                  <el-select
                    ref="factorySelect"
                    style="width: 100%"
                    v-model="form.fromUserPhone"
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

      <div ref="currentBasketDetailsTable">
        <el-scrollbar
          ref="scrollDiv"
          :style="{
            height:
              parseInt($store.getters.screenHeight - SetHeight - 70) + 'px',
          }"
        >
          <div>
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

            <div style="padding: 10px 0px">
              <div
                style="
                  color: rgba(1, 6, 33, 0.9);
                  font-size: 16px;
                  font-weight: 500;
                "
              >
                {{ tableData.categoryName + "-" + tableData.productName }}
              </div>
            </div>

            <div style="padding: 5px 0px 12px">
              <el-row>
                <el-col :span="4"
                  ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >品种/品牌：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                    tableData.variety
                  }}</span></el-col
                >
                <el-col :span="4"
                  ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >产地：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                    tableData.regionName
                  }}</span></el-col
                >
                <el-col :span="4"
                  ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >级别/规格：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                    tableData.spec
                  }}</span></el-col
                >
                <el-col :span="4"
                  ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >计算单位：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                    tableData.subUnit
                  }}</span></el-col
                >
                <el-col :span="4"
                  ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >当前库存：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                    <font
                      :style="tableData.batchCount == 0 ? 'color:red;' : ''"
                    >
                      {{ tableData.batchCount + tableData.subUnit }}</font
                    >
                    {{ tableData.subUnit2 != "" ? "(" : ""
                    }}{{
                      tableData.subUnit3Weight == 0
                        ? ""
                        : tableData.subUnit3Weight + tableData.subUnit3
                    }}{{ tableData.subUnit3 != "" ? "*" : ""
                    }}{{
                      tableData.subUnit2Weight == 0
                        ? ""
                        : tableData.subUnit2Weight + tableData.subUnit2
                    }}{{
                      tableData.subUnit2 != "" ? "/" + tableData.subUnit : ""
                    }}{{ tableData.subUnit2 != "" ? ")" : "" }}
                    <span v-if="tableData.pieceUnit != ''">
                      {{
                        tableData.pieceUnit != "" &&
                        tableData.pieceUnit != "筐(一次性)"
                          ? "(" +
                            tableData.pieceCount +
                            tableData.pieceUnit +
                            ")"
                          : "(" + tableData.pieceCount + "筐)"
                      }}{{
                        tableData.basketCount != 0
                          ? "|" + tableData.basketCount
                          : ""
                      }}
                      <font
                        v-if="tableData.basketCount != 0"
                        style="color: #df971a"
                        >筐</font
                      >
                    </span>
                  </span></el-col
                >
              </el-row>
            </div>

            <div style="padding: 10px 0px 0px">
              <el-form
                :model="form"
                :rules="rules"
                ref="ruleForm1"
                label-width="100px"
                class="demo-ruleForm"
                label-position="top"
                size="small"
              >
                <el-row :gutter="0" style="padding-bottom: 10px">
                  <el-col :span="6">
                    <el-form-item
                      :label="form.inreason == 0 ? '采购单价：' : '生产单价：'"
                      prop="purchaseprice"
                      :rules="[
                        {
                          required: true,
                          message:
                            form.inreason == 0
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
                        >{{ "元/" + tableData.subUnit }}</span
                      >
                    </el-form-item>
                  </el-col>
                </el-row>

                <el-row
                  :gutter="0"
                  style="padding: 10px 0px; border-top: 1px solid #e9e9e9"
                >
                  <el-col :span="6" style="margin-right: 10px">
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
                  <el-col :span="6" style="margin-right: 10px">
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
                          >{{ tableData.subUnit }}</span
                        >

                        <el-button
                          :disabled="precisionSun3()"
                          type="text"
                          size="mini"
                          style="margin-left: 5px"
                          @click="
                            handleEdit('weighingDialog', '批量过磅', {
                              pathProductName:
                                tableData.categoryName +
                                '-' +
                                tableData.productName,
                              pathRegionname: tableData.regionName,
                              subunit: tableData.subUnit,
                              variety: tableData.variety,
                              spec: tableData.spec,
                              pieceunit: form.pieceunit,
                              purchasenums: form.purchasenums,
                              piecenumber: form.piecenumber,
                            })
                          "
                          >{{ precisionSun2() }}</el-button
                        >
                      </div>
                    </el-form-item>
                  </el-col>
                  <el-col
                    :span="6"
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
                <div
                  v-if="precisionSun() != 0 && form.pieceunit == '筐(周转筐)'"
                >
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
                  v-if="form.inreason == 0"
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
                      label-width="70px"
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
                            label-width="65px"
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
                                >{{ tableData.subUnit }}/<span
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
                            label-width="65px"
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
                            label-width="65px"
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
                        >{{ form.purchasenums || 0
                        }}{{ tableData.subUnit }}</span
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
                        >{{
                          basketType().basketweight + tableData.subUnit
                        }}</span
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
                        >{{
                          basketType().productweight + tableData.subUnit
                        }}</span
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
                        {{ (form.purchasenums || 0) + tableData.subUnit }}
                        {{ tableData.subUnit2 != "" ? "(" : "" }}
                        {{
                          tableData.subUnit3Weight == 0
                            ? ""
                            : tableData.subUnit3Weight + tableData.subUnit3
                        }}
                        {{ tableData.subUnit3 != "" ? "*" : "" }}
                        {{
                          tableData.subUnit2Weight == 0
                            ? ""
                            : tableData.subUnit2Weight + tableData.subUnit2
                        }}
                        {{
                          tableData.subUnit2 != ""
                            ? "/" + tableData.subUnit
                            : ""
                        }}
                        {{ tableData.subUnit2 != "" ? ")" : "" }}
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
                      }}{{
                        tableData.subUnit ? "元/" + tableData.subUnit : ""
                      }}</span
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
              <div
                style="padding: 10px 0px"
                v-if="basketType().buybasketType != 0"
              >
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
                    >{{
                      basketType().basketamount | intervalFormat(false)
                    }}元</span
                  ></span
                >
              </div>
              <div
                style="padding: 10px 0px"
                v-if="basketType().mybasketType != 0"
              >
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

            <div style="padding: 10px 0px 0px">
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
                  ref="ruleForm2"
                  label-width="100px"
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
                          basketType().productamount +
                            basketType().basketamount >
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
              >确认并付款</el-button
            >
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
    </div>
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
import { Base64 } from "js-base64";
import elementResizeDetectorMaker from "element-resize-detector";
import { unplatformlist } from "@/request/api/customerManage/customer";
import { addProductStock } from "@/request/api/commodityManage/commodityList";

export default {
  name: "addStock",
  components: {
    weighingDialog: () =>
      import("../addCommodity/dialogmod/weighingDialog.vue"), // 批量过磅
    addHomeBasket: () => import("../addCommodity/dialogmod/addHomeBasket.vue"), // 添加自家筐子
    addOverFlowBasket: () =>
      import("../addCommodity/dialogmod/addOverFlowBasket.vue"), // 添加卖家筐子
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
      tableData: {},
      transinfovisible: false,
      form: {
        inreason: 0, // 入库原因，0：采购，1：自家生产
        fromUserName: "", // 非平台客户姓名(采购时填写)
        fromUserPhone: "", // 非平台客户手机号(采购时填写)
        remark: "", //商品备注
        transinfo1: "",
        transinfo2: "",
        transimage: [],
        transimageList: [],

        purchaseprice: undefined, // 采购单价
        purchasenums: undefined, // 添加数量 采购数量
        pieceunit: "", // 计件单位
        piecenumber: undefined, // 计件数量

        isRemovePeel: 1, // 是否去皮  0否   1是
      },
      rules: {
        fromUserName: [
          {
            required: true,
            message: "请输入或选择客户姓名",
            trigger: ["blur", "change"],
          },
        ],
        fromUserPhone: [
          {
            required: true,
            message: "请输入或选择联系电话",
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
      factoryOptions: [],
      factoryOptionsPhone: [],
      transportNumber: [],
      mySellerList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      dialogImageUrlList: [],
    };
  },
  watch: {
    "form.inreason": {
      handler(val, oval) {
        this.handlerSetHeight("currentBasketDetailsTable");
      },
      deep: true,
    },
  },
  computed: {
    pieceOptions() {
      if (
        (this.precisionSun() != 0 && this.tableData.pieceUnit == "") ||
        (this.precisionSun() == 0 && this.tableData.pieceUnit == "")
      ) {
        return ["无", "筐(周转筐)"];
      }
      if (
        (this.precisionSun() != 0 && this.tableData.pieceUnit != "") ||
        (this.precisionSun() == 0 && this.tableData.pieceUnit != "")
      ) {
        return ["箱", "袋", "盒", "件", "筐(一次性)", "筐(周转筐)"];
      }
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
          this.tableData = JSON.parse(JSON.stringify(param));
          if (!param.productId) {
            this.handleRouter();
            return;
          }
          this.form.pieceunit =
            this.tableData.pieceUnit == "" ? "无" : this.tableData.pieceUnit;
          this.getunplatformlist();
        } catch (error) {
          this.handleRouter();
        }
        return;
      }
      this.handleRouter();
    },
    // 跳转
    handleRouter() {
      let path = this.tableData.fullPath || "/commodityManage/commodityList";
      this.$closePage(path);
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
      this.form.fromUserName = query;
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
      this.form.fromUserPhone = query;
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
      this.form.fromUserName = item.cusname;
      this.form.fromUserPhone = item.phonenumber;

      this.transportNumber = [];
      for (let i = 0; i < item.transportNumber.length; i++) {
        const el = item.transportNumber[i];
        let datap = el.split(",");
        this.transportNumber = [
          { label: el, value: datap[0], value1: datap[1] },
        ];
      }
    },
    transinfoClick(val) {
      this.form.transinfo1 = val.name;
      this.transinfovisible = false;
    },
    lineFocus(val) {
      this.lineValue = val;
    },
    // 车牌选择
    lineFocus2(val) {
      this.form.transinfo1 = val.value;
    },
    // 车牌输入
    transinfoRemoteMethod1(query) {
      this.form.transinfo2 = query;
    },
    handleReference(form, title) {
      this.$refs[form].title = title;
      this.$refs[form].disableSubmit = false;
      this.$refs[form].isVisiable = true;
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
    // 添加自有筐子
    addHomeBasket() {
      if (!this.tableData.productId) {
        this.$warning("请先选择种类");
        return;
      }
      this.handleEdit("addHomeBasket", "添加自有筐子", {
        productid: this.tableData.classifyId,
      });
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
      if (!this.tableData.productId) {
        this.$warning("请先选择种类");
        return;
      }
      this.handleEdit("addOverFlowBasket", "添加卖家筐子", {
        productid: this.tableData.classifyId,
      });
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
    // 小数点判断 斤非斤判断
    precisionSun() {
      if (
        this.tableData.subUnit == "斤" ||
        this.tableData.subUnit == "公斤" ||
        this.tableData.subUnit == "g"
      ) {
        return 2;
      } else {
        return 0;
      }
    },
    // 判断
    precisionSun2() {
      if (
        this.tableData.subUnit == "斤" ||
        this.tableData.subUnit == "公斤" ||
        this.tableData.subUnit == "g" ||
        this.tableData.subUnit == ""
      ) {
        return "批量过磅";
      } else {
        return "批量计件";
      }
    },
    // 判断
    precisionSun3() {
      if (
        this.tableData.productId &&
        this.tableData.variety &&
        this.tableData.regionId &&
        this.tableData.spec &&
        this.tableData.subUnit &&
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
    // 触发子组件编辑按钮
    handleEdit(form, title, record) {
      this.$refs[form].edit(record);
      this.$refs[form].title = title;
      this.$refs[form].disableSubmit = false;
      this.$refs[form].isVisiable = true;
    },
    weighingChange(val) {
      this.form.purchasenums = val.purchasenums;
      this.form.piecenumber = val.piecenumber;
      this.$refs.ruleForm.clearValidate(["purchasenums", "piecenumber"]);
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
      if (this.tableData.subUnit == "公斤") {
        productweight = (this.form.purchasenums || 0) * 2 - basketweight;
      }
      if (this.tableData.subUnit == "斤") {
        productweight = (this.form.purchasenums || 0) - basketweight;
      }
      if (this.tableData.subUnit == "g") {
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
    // 提交
    handleSubmit(val) {
      if (this.form.inreason == 0) {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.$refs.ruleForm1.validate(async (valid1) => {
              if (valid1) {
                if (this.mySellerList.length > 0) {
                  let isval = await this.handleValidate();
                  if (isval) {
                    this.$refs.ruleForm2.validate((valid2) => {
                      if (valid2) {
                        this.submitData(val);
                      }
                    });
                  }
                } else {
                  this.submitData(val);
                }
                // else {
                //   if (this.mySellerList.length > 0) {
                //     this.$warning("请先编辑商品");
                //   } else {
                //     this.$warning("请先添加商品");
                //   }
                // }
              }
            });
          }
        });
      } else {
        this.$refs.ruleForm1.validate(async (valid1) => {
          if (valid1) {
            if (this.mySellerList.length > 0) {
              let isval = await this.handleValidate();
              if (isval) {
                this.$refs.ruleForm2.validate((valid2) => {
                  if (valid2) {
                    this.submitData(val);
                  }
                });
              }
            } else {
              if (this.mySellerList.length > 0) {
                this.$warning("请先编辑商品");
              } else {
                this.$warning("请先添加商品");
              }
            }
          }
        });
      }
    },
    // 提交数据
    submitData(val) {
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
        inreason: this.form.inreason, // 入库原因，0：采购，1：自家生产
        fromUserName: this.form.inreason == 0 ? this.form.fromUserName : "", // 非平台客户姓名(采购时填写)
        fromUserPhone: this.form.inreason == 0 ? this.form.fromUserPhone : "", // 非平台客户手机号(采购时填写)
        remark: this.form.remark, // 商品备注
        transinfo: this.form.transinfo1 + "," + this.form.transinfo2, // 运输信息，"沪,A9T4M2"
        transimage: [], // 照片
        addinfo: [], // 商品列表
      };

      this.form.transimageList.forEach((res) => {
        paramData.transimage.push(res.raw);
      });

      if (
        this.precisionSun(this.tableData.subUnit) == 0 ||
        this.form.pieceunit != "筐(周转筐)"
      ) {
        this.form.isRemovePeel = 0;
      }

      let paramD = {
        productname: this.tableData.productName, // 商品名称
        productid: this.tableData.productId, // 商品ID
        other: this.tableData.other, // 选择其他分类时填写
        variety: this.tableData.variety, // 品牌
        subunit: this.tableData.subUnit, // 计算单位
        subUnit2: this.tableData.subUnit2, // 2级计算单位
        subUnit2Weight: this.tableData.subUnit2Weight, // 2级计算单位重量
        subUnit3: this.tableData.subUnit3, // 3级计算单位
        subUnit3Weight: this.tableData.subUnit3Weight, // 3级计算单位
        pieceunit: this.form.pieceunit == "无" ? "" : this.form.pieceunit, // 计件单位
        piecenumber: this.form.piecenumber || 0, // 计件数量
        regionid: this.tableData.regionId, // 产地id
        regionname: this.tableData.regionName, // 产地
        spec: this.tableData.spec, // 规格
        purchasenums: this.form.purchasenums || 0, // 采购数量
        purchaseprice: this.form.purchaseprice || 0, // 采购单价
        allbasketnums: this.basketType().allbasketnums || 0, // 所有筐子数量
        basketkindnum: this.basketType().basketkindnum || 0, // 使用筐子种类
        sumproductamount: this.basketType().productamount || 0, //  商品金额
        isRemovePeel: this.form.isRemovePeel || 0, // 是否去皮  0否   1是
        buybasketnum: this.basketType().buybasketnum || 0, // 购买筐子
        basketweight: this.basketType().basketweight || 0, // 筐子重量
        productweight: this.basketType().productweight || 0, // 商品净重
        buybasketamount: this.basketType().buybasketamount || 0, // 筐子金额
        sumamount: this.basketType().sumamount || 0, // 金额合计
        allBasketinfo: [{ ownBasketInfo: [], sellerBasketInfo: [] }],
      };

      this.mySellerList.forEach((res1) => {
        let basketinfo2 = [];
        res1.basketinfo.forEach((res2) => {
          if (res1.ismyseller == 1) {
            basketinfo2.push({
              color: res2.basketcolor,
              basketNum: res2.basketNum || 0,
              basketWeight:
                this.form.isRemovePeel == 0 ? 0 : res2.basketWeight || 0, // 筐子重量
              basketLoading: res2.basketLoading || 0, // 载货量
            });
          }
          if (res1.ismyseller == 2) {
            basketinfo2.push({
              color: res2.basketcolor, // 筐子颜色
              unit: res2.unit || 0, // 单价
              basketNum: res2.basketNum, // 筐子数量
              basketWeight:
                this.form.isRemovePeel == 0 ? 0 : res2.basketWeight || 0, // 筐子重量
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

      addProductStock(formData).then((res) => {
        if (res.status) {
          this.$success(res.msg);
          if (val == 1) {
          } else {
            // this.handleJumpDetail1("/commodityManage/addcommodityDetails", {
            //   id: res.data[0].orderId,
            // });
            this.$closePage("/commodityManage/addcommodityDetails", {
              id: res.data[0],
            });
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
  //进入页面触发
  beforeRouteEnter(to, form, next) {
    next((vm) => {
      vm.initData();
    });
  },
  mounted() {
    this.handlerSetHeight("currentBasketDetailsTable");
  },
};
</script>
    
<style lang="scss" scoped>
.addStockModel {
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
.addStockModel {
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