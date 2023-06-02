<template>
  <!-- 编辑退货信息 -->
  <div class="editRefundmodel">
    <div>
      <div style="border-bottom: 1px solid rgba(233, 233, 233, 1)">
        <span class="editInformat">商品信息</span>
        <div class="editInformat informatname">
          {{
            goodsMsg.catgoryfirstName +
            "-" +
            goodsMsg.categorysecondName +
            "-" +
            goodsMsg.name
          }}
        </div>

        <div class="informatExplain">
          <el-row>
            <el-col :span="5"
              ><span class="informatTitle">品种/品牌：</span
              ><span class="informatContent">{{
                goodsMsg.variety
              }}</span></el-col
            >
            <el-col :span="5"
              ><span class="informatTitle">产地：</span
              ><span class="informatContent">{{
                goodsMsg.region
              }}</span></el-col
            >
            <el-col :span="5"
              ><span class="informatTitle">级别/规格：</span
              ><span class="informatContent">{{ goodsMsg.spec }}</span></el-col
            >
            <el-col :span="5"
              ><span class="informatTitle">计算单位：</span
              ><span class="informatContent">{{
                goodsMsg.subUnit
              }}</span></el-col
            >
          </el-row>
        </div>

        <div
          style="padding: 16px 0px"
          v-if="getrefundMsg1.radio == '商品采购单'"
        >
          <el-row>
            <el-col :span="7"
              ><span class="informatTitle">当前批次：</span>
              <span style="margin: auto">
                <el-image
                  style="width: 14px; height: 14px"
                  :src="url"
                ></el-image>
              </span>

              <span class="informatContent"
                >{{
                  tableDataList.modelList ? tableDataList.modelList.length : 0
                }}个/数量<span
                  class="informatContent"
                  v-html="
                    getStock(
                      tableDataList.subunit,
                      tableDataList.subUnit2,
                      tableDataList.subUnit3,
                      tableDataList.pieceunit,
                      tableDataList.subUnit2Weight,
                      tableDataList.subUnit3Weight,
                      tableDataList.batchcount,
                      tableDataList.basketcount,
                      tableDataList.piececount
                    )
                  "
                ></span></span
            ></el-col>
            <el-col :span="5"
              ><span class="informatTitle">采购数量：</span>
              <el-image
                style="width: 14px; height: 14px; margin-right: 2px"
                :src="url"
              ></el-image>
              <span
                class="informatContent"
                v-html="
                  getStock(
                    tableDataList.subunit,
                    tableDataList.subUnit2,
                    tableDataList.subUnit3,
                    tableDataList.pieceunit,
                    tableDataList.subUnit2Weight,
                    tableDataList.subUnit3Weight,
                    goodsMsg.goodsCount,
                    goodsMsg.returnBasketCount,
                    goodsMsg.productPieceCount
                  )
                "
              ></span
            ></el-col>
            <el-col :span="8"
              ><span class="informatTitle">已选批次：</span
              ><span class="informatContent" style="margin-right: 6px"
                >{{ multipleLength() > 0 ? multipleLength() + "个/数量" : "- -"
                }}<span
                  v-if="multipleLength() > 0"
                  v-html="multipleCount()"
                ></span></span
              ><el-button type="primary" size="mini" plain @click="batchBtn()"
                >+ 选择批次</el-button
              ></el-col
            >
          </el-row>
        </div>
        <div v-if="multipleLength() > 0 || getrefundMsg1.radio == '商品销售单'">
          <div
            style="padding: 16px 0px"
            v-if="getrefundMsg1.radio == '商品销售单'"
          >
            <el-row>
              <el-col :span="5"
                ><span class="informatTitle">可退货数量：</span>
                <el-tooltip class="item" effect="dark" placement="bottom">
                  <div slot="content">
                    可退货数量=销售单(当前商品数量)-(已成交+未
                    <br />
                    成交在途)退货退款单(当前商品数量)
                  </div>
                  <el-image
                    style="width: 14px; height: 14px; margin-right: 2px"
                    :src="url"
                  ></el-image>
                </el-tooltip>
                <span
                  class="informatContent"
                  v-html="
                    getStock(
                      goodsMsg.subUnit,
                      goodsMsg.subUnit2,
                      goodsMsg.subUnit3,
                      goodsMsg.pieceUnit,
                      goodsMsg.subUnit2Weight,
                      goodsMsg.subUnit3Weight,
                      goodsMsg.goodsCount,
                      goodsMsg.returnBasketCount,
                      goodsMsg.productPieceCount
                    )
                  "
                ></span
              ></el-col>
            </el-row>
          </div>

          <div>
            <div style="padding: 10px 0px">
              <span
                class="informatTitle"
                v-if="getrefundMsg1.radio == '商品采购单'"
                >采购单价：</span
              >
              <span
                class="informatTitle"
                v-if="getrefundMsg1.radio == '商品销售单'"
                >销售单价：</span
              >
              <span class="informatContent">
                {{ moneyFormatTwo(goodsMsg.productPrice)
                }}{{ purSubunit() }}</span
              >
            </div>
            <el-form
              v-if="getrefundMsg1.radio == '商品采购单'"
              style="width: 600px"
              label-position="left"
              :model="ruleForm"
              ref="ruleForm"
              label-width="120px"
              class="demo-ruleForm"
              size="small"
            >
              <el-form-item label="退货单价：" required>
                <el-input
                  type="text"
                  oninput="value=value.replace(/[^0-9.]/g,'')"
                  v-model="ruleForm.refondPrice"
                  placeholder="请填写退货单价"
                ></el-input>
                <span
                  style="
                    position: absolute;
                    right: 10px;
                    font-size: 14px;
                    color: rgba(1, 6, 33, 0.75);
                  "
                  >{{ purSubunit() }}</span
                >
                <span
                  v-if="ruleForm.refondPrice > goodsMsg.productPrice"
                  style="
                    position: absolute;
                    right: -180px;
                    font-size: 14px;
                    color: #dd4c4d;
                  "
                >
                  退货单价不得大于采购单价
                </span>
              </el-form-item>
              <el-form-item label="选择计件单位：" prop="pieceUnit" required>
                <el-popover
                  placement="bottom-start"
                  title=""
                  width="330"
                  trigger="click"
                >
                  <div>
                    <div style="padding: 5px 0px">
                      <el-tag
                        :style="{
                          margin: '0px 15px 8px 0px',
                          display: 'inline-block',
                          border: '1px solid rgba(208, 208, 210, 1)',
                          color: '#ffffff',
                          background: 'rgba(11, 161, 152, 1)',
                          cursor: 'pointer',
                        }"
                        type="info"
                        effect="plain"
                      >
                        {{
                          tableDataList.pieceunit
                            ? tableDataList.pieceunit
                            : "无"
                        }}
                      </el-tag>
                    </div>
                    <div>选择装载物</div>
                    <div style="padding: 5px 0px">
                      <el-tag
                        :class="{ change_tag: isshowtag }"
                        style="{
                          margin: '0px 15px 8px 0px',
                          display: 'inline-block',
                          border: '1px solid rgba(208, 208, 210, 1)',
                          cursor: 'pointer',
                        }"
                        @click="isLoadChange()"
                        type="info"
                        effect="plain"
                      >
                        筐(周转筐)
                      </el-tag>
                    </div>
                  </div>
                  <el-input
                    v-model="ruleForm.ispieceUnit"
                    slot="reference"
                  ></el-input>
                </el-popover>
              </el-form-item>
              <el-form-item label="过磅数量：" required>
                <div class="addCommoditysearch flex_dom flex_item_mid">
                  <span class="search-form-border">
                    <el-input
                      oninput="value=value.replace(/[^0-9]/g,'')"
                      :style="{ width: subWidth()[0] }"
                      v-model="ruleForm.purchasenums"
                      placeholder="请输入"
                    >
                      <span
                        slot="suffix"
                        style="
                          color: rgba(1, 6, 33, 0.9);
                          font-size: 13px;
                          margin-top: 5px;
                        "
                        >{{ tableDataList.subunit }}</span
                      >
                    </el-input>

                    <el-input
                      v-if="tableDataList.pieceunit != ''"
                      :style="{ width: subWidth()[1] }"
                      v-model="ruleForm.piecenumber"
                      placeholder="请输入"
                      ><span
                        slot="suffix"
                        style="color: rgba(1, 6, 33, 0.9); font-size: 13px"
                        >{{ tableDataList.pieceunit }}</span
                      ></el-input
                    >
                    <el-input
                      v-if="isshowtag"
                      :style="{ width: subWidth()[2] }"
                      v-model="ruleForm.piecenumber1"
                      placeholder="请输入"
                      ><span
                        slot="suffix"
                        style="color: rgba(223, 151, 26, 1); font-size: 13px"
                        >筐</span
                      ></el-input
                    >
                  </span>
                  <el-button
                    type="text"
                    size="mini"
                    style="margin-left: 5px"
                    @click="
                      handleTankuang('weighingDialog', '批量过磅', {
                        tableDataList: tableDataList,
                        goodsMsg: goodsMsg,
                        ruleForm,
                      })
                    "
                    >{{ precisionSun2() }}</el-button
                  >
                </div>
              </el-form-item>
            </el-form>
            <el-form
              v-if="getrefundMsg1.radio == '商品销售单'"
              style="width: 600px"
              label-position="left"
              :model="ruleForm"
              ref="ruleForm"
              label-width="120px"
              class="demo-ruleForm"
              size="small"
            >
              <el-form-item label="退货单价：" required>
                <el-input
                  type="text"
                  oninput="value=value.replace(/[^0-9.]/g,'')"
                  v-model="ruleForm.refondPrice"
                  placeholder="请填写退货单价"
                ></el-input>
                <span
                  style="
                    position: absolute;
                    right: 10px;
                    font-size: 14px;
                    color: rgba(1, 6, 33, 0.75);
                  "
                  >{{ purSubunit() }}</span
                >
                <span
                  v-if="ruleForm.refondPrice > goodsMsg.productPrice"
                  style="
                    position: absolute;
                    right: -180px;
                    font-size: 14px;
                    color: #dd4c4d;
                  "
                >
                  退货单价不得大于销售单价
                </span>
              </el-form-item>
              <el-form-item label="选择计件单位：" prop="pieceUnit" required>
                <el-popover
                  placement="bottom-start"
                  title=""
                  width="330"
                  trigger="click"
                >
                  <div>
                    <div style="padding: 5px 0px">
                      <el-tag
                        :style="{
                          margin: '0px 15px 8px 0px',
                          display: 'inline-block',
                          border: '1px solid rgba(208, 208, 210, 1)',
                          color: '#ffffff',
                          background: 'rgba(11, 161, 152, 1)',
                          cursor: 'pointer',
                        }"
                        type="info"
                        effect="plain"
                      >
                        {{ goodsMsg.pieceUnit ? goodsMsg.pieceUnit : "无" }}
                      </el-tag>
                    </div>
                    <div>选择装载物</div>
                    <div style="padding: 5px 0px">
                      <el-tag
                        :class="{ change_tag: isshowtag1 }"
                        style="{
                          margin: '0px 15px 8px 0px',
                          display: 'inline-block',
                          border: '1px solid rgba(208, 208, 210, 1)',
                          cursor: 'pointer',
                        }"
                        @click="isLoadChange1()"
                        type="info"
                        effect="plain"
                      >
                        筐(周转筐)
                      </el-tag>
                    </div>
                  </div>
                  <el-input
                    v-model="ruleForm.ispieceUnit1"
                    slot="reference"
                  ></el-input>
                </el-popover>
              </el-form-item>
              <el-form-item label="过磅数量：" required>
                <div class="addCommoditysearch flex_dom flex_item_mid">
                  <span class="search-form-border">
                    <el-input
                      oninput="value=value.replace(/[^0-9]/g,'')"
                      :style="{ width: subWidth1()[0] }"
                      v-model="ruleForm.purchasenums"
                      placeholder="请输入"
                    >
                      <span
                        slot="suffix"
                        style="
                          color: rgba(1, 6, 33, 0.9);
                          font-size: 13px;
                          margin-top: 5px;
                        "
                        >{{ goodsMsg.subUnit }}</span
                      >
                    </el-input>

                    <el-input
                      v-if="goodsMsg.pieceUnit != ''"
                      :style="{ width: subWidth1()[1] }"
                      v-model="ruleForm.piecenumber"
                      placeholder="请输入"
                      ><span
                        slot="suffix"
                        style="color: rgba(1, 6, 33, 0.9); font-size: 13px"
                        >{{ goodsMsg.pieceUnit }}</span
                      ></el-input
                    >
                    <el-input
                      v-if="isshowtag1"
                      :style="{ width: subWidth1()[2] }"
                      v-model="ruleForm.piecenumber1"
                      placeholder="请输入"
                      ><span
                        slot="suffix"
                        style="color: rgba(223, 151, 26, 1); font-size: 13px"
                        >筐</span
                      ></el-input
                    >
                  </span>
                  <el-button
                    type="text"
                    size="mini"
                    style="margin-left: 5px"
                    @click="
                      handleTankuang('weighingDialog', '批量过磅', {
                        tableDataList: tableDataList,
                        goodsMsg: goodsMsg,
                        ruleForm,
                      })
                    "
                    >{{ precisionSun2() }}</el-button
                  >
                </div>
              </el-form-item>
            </el-form>

            <div
              style="padding: 0px 0px 10px"
              class="flex_dom flex_item_between flex_item_mid"
            >
              <div>
                <div
                  v-if="
                    (isshowtag1 && precisionSun() != 0) ||
                    (isshowtag && precisionSun() != 0)
                  "
                >
                  <span class="informatContent"
                    ><span style="color: #e8541e">*</span> 是否去皮：</span
                  >
                  <el-radio-group v-model="ruleForm.isRemovePeel2">
                    <el-radio :label="1">去皮</el-radio>
                    <el-radio :label="0" :disabled="isRemovePeel == 1"
                      >不去皮</el-radio
                    >
                  </el-radio-group>
                </div>
              </div>
              <div>
                <!-- 采购单，有筐-使用载货筐子 -->
                <el-button
                  v-if="
                    tableDataList.basketcount > 0 &&
                    getrefundMsg1.radio == '商品采购单'
                  "
                  size="mini"
                  class="but_sty"
                  icon="el-icon-plus"
                  @click="zaihuoTankuang()"
                  >使用载货筐子</el-button
                >
                <!-- 采购单，有计件单位，有筐-使用空筐过磅 -->
                <el-button
                  v-if="
                    tableDataList.pieceunit != '' &&
                    tableDataList.basketcount > 0 &&
                    getrefundMsg1.radio == '商品采购单'
                  "
                  size="mini"
                  class="but_sty"
                  icon="el-icon-plus"
                  @click="
                    handleTankuang('emptyBasket', '使用空筐过磅', {
                      isSataus: 'empty',
                      goodsMsg2: goodsMsg2,
                      ruleForm,
                    })
                  "
                  >使用空筐过磅</el-button
                >
                <!-- 采购单，有筐,计件单位无-使用空置筐子 -->
                <el-button
                  v-if="
                    tableDataList.pieceunit == '' &&
                    tableDataList.basketcount > 0 &&
                    getrefundMsg1.radio == '商品采购单'
                  "
                  size="mini"
                  class="but_sty"
                  icon="el-icon-plus"
                  @click="
                    handleTankuang('vacancyBasket', '使用空置筐子', {
                      isSataus: 'vacancy',
                      goodsMsg2: goodsMsg2,
                      ruleForm,
                    })
                  "
                  >使用空置筐子</el-button
                >
              </div>
            </div>

            <div style="padding-bottom: 10px">
              <div
                v-if="
                  tableDataList.basketcount > 0 &&
                  getrefundMsg1.radio == '商品采购单'
                "
              >
                <el-table
                  v-if="tableDataBasket.length > 0"
                  header-row-class-name="header_sty"
                  ref="plxTable"
                  :data="tableDataBasket"
                  style="border: 1px solid #e9e9e9; margin-top: 15px"
                >
                  <el-table-column
                    :render-header="carry_basket"
                    prop="basketname"
                    label="载货筐子"
                    width="180"
                  >
                    <template slot-scope="scope">
                      <span class="my-input-sc">{{
                        "[" + scope.row.basketType + "]" + scope.row.basketname
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="basketcolor" label="颜色">
                    <template slot-scope="scope">
                      <span class="my-input-sc">{{
                        scope.row.basketcolor
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="userbasketnumber" label="数量">
                    <template slot-scope="scope">
                      <span class="my-input-sc">{{
                        scope.row.userbasketnumber
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :render-header="numRenderHeader"
                    prop="basketWeight"
                    label="重量"
                  >
                    <template slot-scope="scope">
                      <el-input
                        @input="(val) => baskChange(scope, 'basketWeight', val)"
                        v-model="scope.row.basketWeight"
                        :disabled="isAciont()"
                        placeholder=""
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span class="input_sty"
                        >{{ tableDataList.subunit }}/个</span
                      >
                    </template>
                  </el-table-column>
                  <el-table-column
                    :render-header="numRenderHeader1"
                    prop="basketCargo"
                    label="载货量"
                  >
                    <template slot-scope="scope">
                      <el-input
                        @input="(val) => baskChange(scope, 'basketCargo', val)"
                        v-model="scope.row.basketCargo"
                        placeholder=""
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span class="input_sty"
                        >{{ tableDataList.subunit }}/<span
                          style="color: rgba(223, 151, 26, 1)"
                          >筐</span
                        ></span
                      >
                    </template>
                  </el-table-column>
                  <el-table-column
                    :render-header="numRenderHeader"
                    prop="userBasketPrice"
                    label="单价"
                  >
                    <template slot-scope="scope">
                      <el-input
                        @input="
                          (val) => baskChange(scope, 'userBasketPrice', val)
                        "
                        v-model="scope.row.userBasketPrice"
                        placeholder=""
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span class="input_sty">元/个 </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :render-header="numRenderHeader"
                    prop="basketCount"
                    label="筐子过磅"
                    width="150"
                  >
                    <template slot-scope="scope">
                      <el-input
                        @input="(val) => baskChange(scope, 'basketCount', val)"
                        v-model="scope.row.basketCount"
                        placeholder=""
                        style="width: 80%"
                        size="mini"
                      >
                        <template slot="suffix"
                          ><font
                            style="font-size: 12px; color: rgba(1, 6, 33, 0.75)"
                            >个</font
                          ></template
                        >
                      </el-input>
                      <el-popover
                        v-if="
                          scope.row.basketCount > scope.row.userbasketnumber
                        "
                        placement="top-end"
                        trigger="hover"
                      >
                        <p>
                          筐子过磅超出库存载货{{
                            scope.row.userbasketnumber
                          }}个,<el-button
                            style="color: #0ba198"
                            type="text"
                            @click="overflowBtn(scope.row)"
                            >请选择报溢批次＞</el-button
                          >
                        </p>
                        <i
                          slot="reference"
                          class="el-icon-warning-outline"
                          style="
                            font-size: 15px;
                            color: #dd4c4d;
                            margin-right: 5px;
                          "
                        ></i>
                      </el-popover>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :render-header="numRenderHeader"
                    prop="userBasketCount"
                    label="退回筐子"
                    width="150"
                  >
                    <template slot-scope="scope">
                      <el-input
                        @input="
                          (val) => baskChange(scope, 'userBasketCount', val)
                        "
                        v-model="scope.row.userBasketCount"
                        placeholder=""
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span class="input_sty">个 </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :render-header="numRenderHeader"
                    prop="basketVacateCount"
                    label="腾空筐子"
                    width="150"
                  >
                    <template slot-scope="scope">
                      <el-input
                        @input="
                          (val) => baskChange(scope, 'basketVacateCount', val)
                        "
                        v-model="scope.row.basketVacateCount"
                        placeholder=""
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span class="input_sty">个 </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop=" " label="操作" width="150">
                    <template slot-scope="scope">
                      <span
                        style="color: #0ba198; font-size: 14px; cursor: pointer"
                        @click="removeData(scope)"
                        >移除</span
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div style="margin-top: 10px" v-if="tableDataBasket1.length > 0">
                <el-table
                  header-row-class-name="header_sty"
                  ref="plxTable"
                  :data="tableDataBasket1"
                  style="border: 1px solid #e9e9e9; margin-top: 15px"
                >
                  <el-table-column
                    :render-header="carry_basket"
                    prop="basektName"
                    label="过磅筐子"
                    width="180"
                  >
                    <template slot-scope="scope">
                      <span class="my-input-sc">{{
                        "[" + scope.row.basketType + "]" + scope.row.basektName
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="basketColor" label="颜色">
                    <template slot-scope="scope">
                      <span class="my-input-sc">{{
                        scope.row.basketColor
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :render-header="numRenderHeader"
                    prop="basketWeight"
                    label="重量"
                  >
                    <template slot-scope="scope">
                      <el-input
                        @input="
                          (val) => baskChange1(scope, 'basketWeight', val)
                        "
                        v-model="scope.row.basketWeight"
                        placeholder=""
                        :disabled="isAciont()"
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span class="input_sty"
                        >{{ tableDataList.subunit }}/个</span
                      >
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="basketCargo"
                    label="载货量"
                    :render-header="numRenderHeader1"
                  >
                    <template slot-scope="scope">
                      <el-input
                        @input="(val) => baskChange1(scope, 'basketCargo', val)"
                        v-model="scope.row.basketCargo"
                        placeholder=""
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span class="input_sty"
                        >{{ tableDataList.subunit }}/<span
                          style="color: rgba(223, 151, 26, 1)"
                          >筐</span
                        ></span
                      >
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="userBasketPrice"
                    label="单价"
                    :render-header="numRenderHeader"
                  >
                    <template slot-scope="scope">
                      <el-input
                        @input="
                          (val) => baskChange1(scope, 'userBasketPrice', val)
                        "
                        v-model="scope.row.userBasketPrice"
                        placeholder=""
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span class="input_sty">元/个 </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :render-header="numRenderHeader"
                    prop="basketCount"
                    label="筐子过磅"
                    width="150"
                  >
                    <template slot-scope="scope">
                      <el-input
                        @input="(val) => baskChange1(scope, 'basketCount', val)"
                        v-model="scope.row.basketCount"
                        placeholder=""
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span class="input_sty">个 </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :render-header="numRenderHeader"
                    prop="userBasketCount"
                    label="退回筐子"
                    width="150"
                  >
                    <template slot-scope="scope">
                      <el-input
                        @input="
                          (val) => baskChange1(scope, 'userBasketCount', val)
                        "
                        v-model="scope.row.userBasketCount"
                        placeholder=""
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span class="input_sty">个 </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :render-header="numRenderHeader"
                    prop="basketVacateCount"
                    label="留库筐子"
                    width="150"
                  >
                    <template slot-scope="scope">
                      <el-input
                        @input="
                          (val) => baskChange1(scope, 'basketVacateCount', val)
                        "
                        v-model="scope.row.basketVacateCount"
                        placeholder=""
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span class="input_sty">个 </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop=" " label="操作" width="150">
                    <template slot-scope="scope">
                      <span
                        style="color: #0ba198; font-size: 14px; cursor: pointer"
                        @click="removeData1(scope)"
                        >移除</span
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div style="margin-top: 10px" v-if="tableDataBasket2.length > 0">
                <el-table
                  header-row-class-name="header_sty"
                  ref="plxTable"
                  :data="tableDataBasket2"
                  style="border: 1px solid #e9e9e9; margin-top: 15px"
                >
                  <el-table-column
                    :render-header="carry_basket"
                    prop="basketname"
                    label="空置筐子"
                    width="180"
                  >
                    <template slot-scope="scope">
                      <span class="my-input-sc">{{
                        "[" + scope.row.basketType + "]" + scope.row.basketname
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="basketcolor" label="颜色">
                    <template slot-scope="scope">
                      <span class="my-input-sc">{{
                        scope.row.basketcolor
                      }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column prop="nums" label="空置数量">
                    <template slot-scope="scope">
                      <span class="my-input-sc">{{ scope.row.nums }}</span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :render-header="numRenderHeader"
                    prop="basketWeight"
                    label="重量"
                  >
                    <template slot-scope="scope">
                      <el-input
                        @input="
                          (val) => baskChange2(scope, 'basketWeight', val)
                        "
                        v-model="scope.row.basketWeight"
                        placeholder=""
                        :disabled="isAciont()"
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span class="input_sty"
                        >{{ tableDataList.subunit }}/个</span
                      >
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="basketCargo"
                    label="载货量"
                    :render-header="numRenderHeader1"
                  >
                    <template slot-scope="scope">
                      <el-input
                        @input="(val) => baskChange2(scope, 'basketCargo', val)"
                        v-model="scope.row.basketCargo"
                        placeholder=""
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span class="input_sty"
                        >{{ tableDataList.subunit }}/<span
                          style="color: rgba(223, 151, 26, 1)"
                          >筐</span
                        ></span
                      >
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="userBasketPrice"
                    label="单价"
                    :render-header="numRenderHeader"
                  >
                    <template slot-scope="scope">
                      <el-input
                        @input="
                          (val) => baskChange2(scope, 'userBasketPrice', val)
                        "
                        v-model="scope.row.userBasketPrice"
                        placeholder=""
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span class="input_sty">元/个 </span>
                    </template>
                  </el-table-column>
                  <el-table-column
                    :render-header="numRenderHeader"
                    prop="userBasketCount"
                    label="退回筐子"
                    width="150"
                  >
                    <template slot-scope="scope">
                      <el-input
                        @input="
                          (val) => baskChange2(scope, 'userBasketCount', val)
                        "
                        v-model="scope.row.userBasketCount"
                        placeholder=""
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span class="input_sty">个 </span>
                    </template>
                  </el-table-column>
                  <el-table-column prop=" " label="操作" width="150">
                    <template slot-scope="scope">
                      <span
                        style="color: #0ba198; font-size: 14px; cursor: pointer"
                        @click="removeData2(scope)"
                        >移除</span
                      >
                    </template>
                  </el-table-column>
                </el-table>
              </div>
            </div>

            <div
              style="
                padding-top: 10px;
                border-top: 1px solid rgba(230, 230, 230, 1);
                display: flex;
                justify-content: flex-end;
              "
            >
              <!-- 采购单无筐,非平台销 -->
              <el-button
                v-if="
                  (getrefundMsg1.radio == '商品采购单' &&
                    tableDataList.basketcount <= 0) ||
                  getrefundMsg1.radio == '商品销售单'
                "
                class="but_sty"
                size="mini"
                icon="el-icon-plus"
                @click="
                  handleTankuang('vacancyBasket1', '使用自家筐子', {
                    isSataus: 'empty',
                    goodsMsg2: goodsMsg2,
                    ruleForm,
                  })
                "
                >使用自家筐子</el-button
              >
              <!-- 无筐,平台采非平台采 -->
              <el-button
                v-if="getrefundMsg1.radio == '商品采购单'"
                size="mini"
                class="but_sty"
                icon="el-icon-plus"
                @click="
                  handleTankuang('emptyBasket2', '添加卖家筐子', {
                    isSataus: 'empty',
                    goodsMsg2: goodsMsg2,
                    ruleForm,
                  })
                "
                >添加卖家筐子</el-button
              >
              <!-- 非销 -->
              <el-button
                v-if="getrefundMsg1.radio == '商品销售单'"
                size="mini"
                class="but_sty"
                icon="el-icon-plus"
                @click="
                  handleTankuang('emptyBasket1', '添加买家筐子', {
                    isSataus: 'empty',
                    goodsMsg2: goodsMsg2,
                    ruleForm,
                  })
                "
                >添加买家筐子</el-button
              >
            </div>
            <div style="margin-top: 10px" v-if="tableDataBasket4.length > 0">
              <el-table
                header-row-class-name="header_sty"
                ref="plxTable"
                :data="tableDataBasket4"
                style="border: 1px solid #e9e9e9; margin-top: 15px"
              >
                <el-table-column
                  :render-header="carry_basket"
                  prop="basektName"
                  label="自家筐子"
                  width="180"
                >
                  <template slot-scope="scope">
                    <span class="my-input-sc">{{
                      "[" + scope.row.basketType + "]" + scope.row.basketname
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="basketColor" label="颜色">
                  <template slot-scope="scope">
                    <span class="my-input-sc">{{ scope.row.basketcolor }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="nums" label="空置数量">
                  <template slot-scope="scope">
                    <span class="my-input-sc">{{ scope.row.nums }}个</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :render-header="numRenderHeader"
                  prop="basketWeight"
                  label="重量"
                >
                  <template slot-scope="scope">
                    <el-input
                      @input="(val) => baskChange4(scope, 'basketWeight', val)"
                      v-model="scope.row.basketWeight"
                      placeholder=""
                      :disabled="isAciont()"
                      style="width: 100%"
                      size="mini"
                    ></el-input>
                    <span class="input_sty"
                      >{{ tableDataList.subunit }}/个</span
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  prop="basketCargo"
                  label="载货量"
                  :render-header="numRenderHeader1"
                >
                  <template slot-scope="scope">
                    <el-input
                      @input="(val) => baskChange4(scope, 'basketCargo', val)"
                      v-model="scope.row.basketCargo"
                      placeholder=""
                      style="width: 100%"
                      size="mini"
                    ></el-input>
                    <span class="input_sty"
                      >{{ tableDataList.subunit }}/<span
                        style="color: rgba(223, 151, 26, 1)"
                        >筐</span
                      ></span
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  prop="userBasketPrice"
                  label="单价"
                  :render-header="numRenderHeader"
                >
                  <template slot-scope="scope">
                    <el-input
                      @input="
                        (val) => baskChange4(scope, 'userBasketPrice', val)
                      "
                      v-model="scope.row.userBasketPrice"
                      placeholder=""
                      style="width: 100%"
                      size="mini"
                    ></el-input>
                    <span class="input_sty">元/个 </span>
                  </template>
                </el-table-column>
                <el-table-column
                  :render-header="numRenderHeader"
                  prop="userBasketCount"
                  label="退回筐子"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-input
                      @input="
                        (val) => baskChange4(scope, 'userBasketCount', val)
                      "
                      v-model="scope.row.userBasketCount"
                      placeholder=""
                      style="width: 100%"
                      size="mini"
                    ></el-input>
                    <span class="input_sty">个 </span>
                  </template>
                </el-table-column>
                <el-table-column prop=" " label="操作" width="150">
                  <template slot-scope="scope">
                    <span
                      style="color: #0ba198; font-size: 14px; cursor: pointer"
                      @click="removeData4(scope)"
                      >移除</span
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div style="margin-top: 10px" v-if="tableDataBasket3.length > 0">
              <el-table
                header-row-class-name="header_sty"
                ref="plxTable"
                :data="tableDataBasket3"
                style="border: 1px solid #e9e9e9; margin-top: 15px"
              >
                <el-table-column
                  :render-header="carry_basket"
                  prop="basektName"
                  label="买家筐子"
                  width="180"
                >
                  <template slot-scope="scope">
                    <span class="my-input-sc">{{
                      "[" + scope.row.basketType + "]" + scope.row.basektName
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="basketColor" label="颜色">
                  <template slot-scope="scope">
                    <span class="my-input-sc">{{ scope.row.basketColor }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :render-header="numRenderHeader"
                  prop="basketWeight"
                  label="重量"
                >
                  <template slot-scope="scope">
                    <el-input
                      @input="(val) => baskChange3(scope, 'basketWeight', val)"
                      v-model="scope.row.basketWeight"
                      placeholder=""
                      :disabled="isAciont()"
                      style="width: 100%"
                      size="mini"
                    ></el-input>
                    <span class="input_sty"
                      >{{ tableDataList.subunit }}/个</span
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  prop="basketCargo"
                  label="载货量"
                  :render-header="numRenderHeader1"
                >
                  <template slot-scope="scope">
                    <el-input
                      @input="(val) => baskChange3(scope, 'basketCargo', val)"
                      v-model="scope.row.basketCargo"
                      placeholder=""
                      style="width: 100%"
                      size="mini"
                    ></el-input>
                    <span class="input_sty"
                      >{{ tableDataList.subunit }}/<span
                        style="color: rgba(223, 151, 26, 1)"
                        >筐</span
                      ></span
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  prop="userBasketPrice"
                  label="单价"
                  :render-header="numRenderHeader"
                >
                  <template slot-scope="scope">
                    <el-input
                      @input="
                        (val) => baskChange2(scope, 'userBasketPrice', val)
                      "
                      v-model="scope.row.userBasketPrice"
                      placeholder=""
                      style="width: 100%"
                      size="mini"
                    ></el-input>
                    <span class="input_sty">元/个 </span>
                  </template>
                </el-table-column>
                <el-table-column
                  :render-header="numRenderHeader"
                  prop="userBasketCount"
                  label="退回筐子"
                >
                  <template slot-scope="scope">
                    <el-input
                      @input="
                        (val) => baskChange3(scope, 'userBasketCount', val)
                      "
                      v-model="scope.row.userBasketCount"
                      placeholder=""
                      style="width: 100%"
                      size="mini"
                    ></el-input>
                    <span class="input_sty">个 </span>
                  </template>
                </el-table-column>
                <el-table-column prop=" " label="操作" width="150">
                  <template slot-scope="scope">
                    <span
                      style="color: #0ba198; font-size: 14px; cursor: pointer"
                      @click="removeData3(scope)"
                      >移除</span
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div style="margin-top: 10px" v-if="tableDataBasket5.length > 0">
              <el-table
                header-row-class-name="header_sty"
                ref="plxTable"
                :data="tableDataBasket5"
                style="border: 1px solid #e9e9e9; margin-top: 15px"
              >
                <el-table-column
                  :render-header="carry_basket"
                  prop="basektName"
                  label="卖家筐子"
                  width="180"
                >
                  <template slot-scope="scope">
                    <span class="my-input-sc">{{
                      "[" + scope.row.basketType + "]" + scope.row.basektName
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="basketColor" label="颜色">
                  <template slot-scope="scope">
                    <span class="my-input-sc">{{ scope.row.basketColor }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="basketCargo"
                  label="载货量"
                  :render-header="numRenderHeader1"
                >
                  <template slot-scope="scope">
                    <el-input
                      @input="(val) => baskChange5(scope, 'basketCargo', val)"
                      v-model="scope.row.basketCargo"
                      placeholder=""
                      style="width: 100%"
                      size="mini"
                    ></el-input>
                    <span class="input_sty"
                      >{{ tableDataList.subunit }}/<span
                        style="color: rgba(223, 151, 26, 1)"
                        >筐</span
                      ></span
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  :render-header="numRenderHeader"
                  prop="userBasketCount"
                  label="使用"
                >
                  <template slot-scope="scope">
                    <el-input
                      @input="
                        (val) => baskChange5(scope, 'userBasketCount', val)
                      "
                      v-model="scope.row.userBasketCount"
                      placeholder=""
                      style="width: 100%"
                      size="mini"
                    ></el-input>
                    <span class="input_sty">个 </span>
                  </template>
                </el-table-column>
                <el-table-column prop=" " label="操作" width="150">
                  <template slot-scope="scope">
                    <span
                      style="color: #0ba198; font-size: 14px; cursor: pointer"
                      @click="removeData5(scope)"
                      >移除</span
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <div style="padding: 24px 0px 24px">
            <div class="editInformat">合计</div>
            <!-- 斤单位,已选批次有筐,去皮 -->
            <div
              v-if="
                tableDataList.subunit == '斤' &&
                ruleForm.isRemovePeel2 == 1 &&
                tableDataList.basketcount > 0
              "
            >
              <div style="padding-top: 16px">
                <span class="informatTitle1"
                  >退货毛重：<span class="informatContent"
                    >{{ ruleForm.purchasenums + tableDataList.subunit }}|{{
                      ruleForm.piecenumber1
                    }}<span style="color: #df971a">筐</span></span
                  ></span
                >
              </div>
              <div style="padding: 16px 0px">
                <span class="informatTitle1"
                  >筐子重量：<span class="informatContent"
                    >{{ isNumStatus().weightBasket
                    }}{{ tableDataList.subunit }}</span
                  ></span
                >
              </div>
              <div style="padding-bottom: 15px">
                <span class="informatTitle1"
                  >商品净重：<span class="informatContent"
                    >{{ ruleForm.purchasenums - isNumStatus().weightBasket
                    }}{{ tableDataList.subunit }}</span
                  ></span
                >
                <span class="informatTitle1"
                  >退货单价：<span class="informatContent"
                    >{{
                      ruleForm.refondPrice
                        ? moneyFormatTwo(ruleForm.refondPrice)
                        : 0
                    }}{{ purSubunit() }}</span
                  ></span
                >
                <span class="informatContent"
                  >商品金额：<span style="color: #dd4c4d; font-size: 14px">{{
                    moneyFormatTwo(
                      ruleForm.refondPrice *
                        (ruleForm.purchasenums - isNumStatus().weightBasket)
                    )
                  }}</span></span
                >
              </div>

              <div
                style="border-top: 1px dashed #e6e6e6; padding: 16px 0px 16px"
              >
                <span class="informatTitle1"
                  >筐子种类：<span class="informatContent"
                    >{{
                      tableDataBasket.length +
                      tableDataBasket1.length +
                      tableDataBasket2.length +
                      tableDataBasket3.length +
                      tableDataBasket4.length +
                      tableDataBasket5.length
                    }}种</span
                  ></span
                >
                <span class="informatTitle1"
                  >退回筐子：<span class="informatContent"
                    >{{ isNumStatus().userBasketCount }}个</span
                  ></span
                >
                <span class="informatContent"
                  >筐子金额：<span style="color: #dd4c4d; font-size: 14px"
                    >{{
                      moneyFormatTwo(isNumStatus().totalAmountBaskets)
                    }}元</span
                  ></span
                >
              </div>
            </div>
            <!-- 非斤单位,已选批次有筐 或者 斤单位,已选批次有筐,不去皮 -->
            <div
              v-if="
                (tableDataList.subunit != '斤' &&
                  tableDataList.basketcount > 0) ||
                (tableDataList.subunit == '斤' &&
                  ruleForm.isRemovePeel2 == 0 &&
                  tableDataList.basketcount > 0)
              "
            >
              <div style="padding-bottom: 15px">
                <span class="informatTitle1"
                  >退货数量：<span class="informatContent"
                    >{{ ruleForm.purchasenums + tableDataList.subunit }}|{{
                      ruleForm.piecenumber1
                    }}<span style="color: #df971a">筐</span></span
                  ></span
                >
                <span class="informatTitle1"
                  >退货单价：<span class="informatContent"
                    >{{
                      ruleForm.refondPrice
                        ? moneyFormatTwo(ruleForm.refondPrice)
                        : 0
                    }}{{ purSubunit() }}</span
                  ></span
                >
                <span class="informatContent"
                  >商品金额：<span style="color: #dd4c4d; font-size: 14px"
                    >{{
                      moneyFormatTwo(
                        ruleForm.refondPrice *
                          (ruleForm.purchasenums - isNumStatus().weightBasket)
                      )
                    }}元</span
                  ></span
                >
              </div>

              <div
                style="border-top: 1px dashed #e6e6e6; padding: 16px 0px 16px"
              >
                <span class="informatTitle1"
                  >筐子种类：<span class="informatContent"
                    >{{
                      tableDataBasket.length +
                      tableDataBasket1.length +
                      tableDataBasket2.length +
                      tableDataBasket3.length +
                      tableDataBasket4.length +
                      tableDataBasket5.length
                    }}种</span
                  ></span
                >
                <span class="informatTitle1"
                  >退回筐子：<span class="informatContent"
                    >{{ isNumStatus().userBasketCount }}个</span
                  ></span
                >
                <span class="informatContent"
                  >筐子金额：<span style="color: #dd4c4d; font-size: 14px"
                    >{{
                      moneyFormatTwo(isNumStatus().totalAmountBaskets)
                    }}元</span
                  ></span
                >
              </div>
            </div>
            <!-- 已选批次无筐 -->
            <div v-if="tableDataList.basketcount <= 0">
              <div style="padding-bottom: 15px">
                <span class="informatTitle1"
                  >退货数量：<span class="informatContent"
                    >{{ ruleForm.purchasenums + tableDataList.subunit }}|{{
                      ruleForm.piecenumber1
                    }}<span style="color: #df971a">筐</span></span
                  ></span
                >
                <span class="informatTitle1"
                  >退货单价：<span class="informatContent"
                    >{{
                      ruleForm.refondPrice
                        ? moneyFormatTwo(ruleForm.refondPrice)
                        : 0
                    }}{{ purSubunit() }}</span
                  ></span
                >
                <span class="informatContent"
                  >商品金额：<span style="color: #dd4c4d; font-size: 14px"
                    >{{
                      moneyFormatTwo(
                        ruleForm.refondPrice *
                          (ruleForm.purchasenums - isNumStatus().weightBasket)
                      )
                    }}元</span
                  ></span
                >
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="page_footer">
      <div
        style="color: #dd4c4d; font-size: 14px; float: left; margin-left: 250px"
      >
        <div
          v-if="
            ruleForm.purchasenums > datasMsg &&
            ruleForm.purchasenums <= goodsMsg.goodsCount
          "
          @click="stockBtn()"
        >
          库存不足<i class="el-icon-arrow-right"></i>
        </div>
        <div v-if="ruleForm.purchasenums > goodsMsg.goodsCount">
          退货数量不可大于剩余可退数量
          <el-tooltip
            class="item"
            effect="dark"
            content="剩余可退数量=采购单(当前商品数量)-已成交退货退款单(当前商品数量)"
            placement="top-end"
          >
            <i class="el-icon-warning-outline"></i>
          </el-tooltip>
        </div>
      </div>
      <div style="font-size: 14px; color: rgba(1, 6, 33, 0.9); float: right">
        金额合计：<span style="color: #dd4c4d; margin-right: 16px"
          >{{
            moneyFormatTwo(
              ruleForm.refondPrice *
                (ruleForm.purchasenums - isNumStatus().weightBasket) +
                isNumStatus().totalAmountBaskets
            )
          }}元</span
        >
        <el-button type="primary" @click="editSucced">编辑完成</el-button>
      </div>
    </div>
    <!-- 选择批次弹框 -->
    <el-dialog
      title="选择批次"
      :visible.sync="batchVisiable"
      :close-on-click-modal="false"
      :before-close="close"
      top="100px"
      width="1100px"
    >
      <div>
        <div>
          <div class="editDialog">
            {{
              goodsMsg.catgoryfirstName +
              "-" +
              goodsMsg.categorysecondName +
              "-" +
              goodsMsg.name
            }}
            | {{ tableDataList.variety }}
          </div>

          <div>
            <el-row>
              <el-col :span="7"
                ><span class="informatTitle">产地：</span
                ><span class="informatContent">{{
                  tableDataList.regionname
                }}</span></el-col
              >
              <el-col :span="5"
                ><span class="informatTitle">级别/规格：</span
                ><span class="informatContent">{{ tableDataList.spec }}</span>
              </el-col>

              <el-col :span="9"
                ><span class="informatTitle">当前批次：</span>
                <span class="informatContent"
                  >{{
                    tableDataList.modelList
                      ? tableDataList.modelList.length
                      : 0
                  }}个/数量<span
                    style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                    v-html="
                      getStock(
                        tableDataList.subunit,
                        tableDataList.subUnit2,
                        tableDataList.subUnit3,
                        tableDataList.pieceunit,
                        tableDataList.subUnit2Weight,
                        tableDataList.subUnit3Weight,
                        tableDataList.batchcount,
                        tableDataList.basketcount,
                        tableDataList.piececount
                      )
                    "
                  ></span
                ></span>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="editInformat">
          <span>批次详情</span>
          <span
            ><el-image style="width: 14px; height: 14px" :src="url"></el-image
          ></span>
        </div>
        <el-table
          ref="batchTable"
          class="eltable"
          :border="false"
          :height="$store.getters.screenHeight - 500 + 'px'"
          :header-row-style="{ height: '46px' }"
          :header-cell-style="{
            color: 'rgba(1, 6, 33, 0.65)',
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
          :data="tableDataList.modelList"
          @selection-change="handleSelectionChange"
          :row-key="getRowKey"
        >
          <el-table-column
            type="selection"
            width="55"
            align="center"
            name="选择"
            :reserve-selection="true"
          >
          </el-table-column>
          <el-table-column
            v-for="(item, index) in batchcolumns"
            :key="index"
            :resizable="item.resizable"
            :show-overflow-tooltip="true"
            :prop="item.prop"
            :label="item.label"
            :fixed="item.fixed"
            align="left"
            header-align="left"
          >
            <template slot-scope="scope">
              <span
                v-if="item.prop == 'timestamp' || item.prop == 'lastlyDate'"
              >
                {{ scope.row[item.prop] | parseTime() }}
              </span>
              <span v-else-if="item.prop == 'custmorName'">
                {{ scope.row.custmorName }}
                <el-tag type="info" v-if="scope.row.custmorType == 0"
                  >非</el-tag
                >
                <el-tag v-if="scope.row.custmorType == 3">供</el-tag>
                <el-tag type="danger" v-if="scope.row.custmorType == 1"
                  >经</el-tag
                >
                <el-tag type="warning" v-if="scope.row.custmorType == 2"
                  >采</el-tag
                >
                <span v-if="scope.row.custmorPhone != ''">{{
                  "-" + scope.row.custmorPhone
                }}</span>
              </span>
              <span v-else-if="item.prop == 'inCount'">
                <span
                  v-html="
                    getStock(
                      tableDataList.subunit,
                      tableDataList.subUnit2,
                      tableDataList.subUnit3,
                      tableDataList.pieceunit,
                      tableDataList.subUnit2Weight,
                      tableDataList.subUnit3Weight,
                      scope.row.inCount,
                      scope.row.inBasketCount,
                      scope.row.inPieceCount
                    )
                  "
                ></span>
              </span>
              <span v-else-if="item.prop == 'batchnumber'">
                <span
                  v-html="
                    getStock(
                      tableDataList.subunit,
                      tableDataList.subUnit2,
                      tableDataList.subUnit3,
                      tableDataList.pieceunit,
                      tableDataList.subUnit2Weight,
                      tableDataList.subUnit3Weight,
                      scope.row.batchnumber,
                      scope.row.basketnumber,
                      scope.row.piecenumber
                    )
                  "
                ></span>
              </span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="creditLineBottom">
        <el-button size="mini" style="margin-right: 10px" @click="close"
          >取消</el-button
        >
        <el-button
          size="mini"
          type="primary"
          style="margin-right: 10px"
          @click="handleAdd"
          >确定</el-button
        >
      </div>
    </el-dialog>

    <!-- 使用载货筐子弹框开始 -->
    <el-dialog
      title="使用载货筐子"
      :visible.sync="weighingVisiable"
      :close-on-click-modal="false"
      :before-close="weighingclose"
      top="100px"
      width="450px"
    >
      <div class="marginform">
        <el-scrollbar
          ref="scrollDiv"
          :style="{
            height: parseInt($store.getters.screenHeight - 450) + 'px',
          }"
        >
          <div
            v-for="(item, index) in baskList"
            :key="index"
            style="
              border-bottom: 1px solid rgba(0, 0, 0, 0.06);
              padding: 12px 0px;
            "
          >
            <el-checkbox
              :indeterminate="item.isIndeterminate"
              v-model="item.check"
              @change="handleCheckAllChange(item.check, index)"
            >
              [{{ item.basketType }}]{{ item.basketname }}
            </el-checkbox>
            <div style="margin: 12px 0"></div>
            <el-checkbox
              v-for="(item2, index2) in item.basketinfos"
              :key="index2"
              v-model="item2.check"
              :disabled="item2.isActivate"
              @change="handleCheckedCitiesChange(index, index2)"
              >[{{ item2.basketcolor }}] 载货数量：{{
                item2.userbasketnumber
              }}个</el-checkbox
            >
          </div>
        </el-scrollbar>
      </div>

      <div class="creditLineBottom">
        <el-button size="mini" style="margin-right: 10px" @click="weighingclose"
          >取消</el-button
        >
        <el-button
          size="mini"
          type="primary"
          style="margin-right: 10px"
          @click="weighinghandleAdd"
          >确 定</el-button
        >
      </div>
    </el-dialog>
    <!-- 使用载货筐子弹框结束 -->

    <!-- 报溢载货筐子弹框 -->
    <el-dialog
      title="报溢载货筐子"
      :visible.sync="overflowVisiable"
      :close-on-click-modal="false"
      :before-close="overflowclose"
      top="100px"
      width="1100px"
    >
      <div>
        <div>
          <div class="editDialog">
            [{{ overflowData.basketType }}]
            {{ overflowData.basketname }}
            <span style="color: #0ba198">[{{ overflowData.basketcolor }}]</span>
          </div>

          <div>
            <el-row>
              <el-col :span="6"
                ><span class="informatTitle">载货数量：</span
                ><span class="informatContent"
                  >{{ overflowData.userbasketnumber }}个</span
                ></el-col
              >
              <el-col :span="6"
                ><span class="informatTitle">筐子过磅：</span
                ><span class="informatContent"
                  >{{ overflowData.basketCount }}个</span
                >
              </el-col>
              <el-col :span="6"
                ><span class="informatTitle">需报溢数量：</span>
                <span class="informatContent"
                  >{{
                    overflowData.basketCount - overflowData.userbasketnumber
                  }}个</span
                >
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="editInformat">
          <span>选择报溢批次</span>
          <span
            ><el-image style="width: 14px; height: 14px" :src="url"></el-image
          ></span>
        </div>
        <el-table
          ref="batchTable"
          class="eltable"
          :border="false"
          :height="$store.getters.screenHeight - 500 + 'px'"
          :header-row-style="{ height: '46px' }"
          :header-cell-style="{
            color: 'rgba(1, 6, 33, 0.65)',
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
          :data="tableDataList.multipleSelection"
          :row-key="getRowKey"
        >
          <el-table-column
            v-for="(item, index) in batchcolumns1"
            :key="index"
            :resizable="item.resizable"
            :show-overflow-tooltip="true"
            :prop="item.prop"
            :label="item.label"
            :fixed="item.fixed"
            align="left"
            header-align="left"
          >
            <template slot-scope="scope">
              <span
                v-if="item.prop == 'timestamp' || item.prop == 'lastlyDate'"
              >
                {{ scope.row[item.prop] | parseTime() }}
              </span>
              <span v-else-if="item.prop == 'custmorName'">
                {{ scope.row.custmorName }}
                <el-tag type="info" v-if="scope.row.custmorType == 0"
                  >非</el-tag
                >
                <el-tag v-if="scope.row.custmorType == 3">供</el-tag>
                <el-tag type="danger" v-if="scope.row.custmorType == 1"
                  >经</el-tag
                >
                <el-tag type="warning" v-if="scope.row.custmorType == 2"
                  >采</el-tag
                >
                <span v-if="scope.row.custmorPhone != ''">{{
                  "-" + scope.row.custmorPhone
                }}</span>
              </span>
              <span v-else-if="item.prop == 'inCount'">
                <span
                  v-html="
                    getStock(
                      tableDataList.subunit,
                      tableDataList.subUnit2,
                      tableDataList.subUnit3,
                      tableDataList.pieceunit,
                      tableDataList.subUnit2Weight,
                      tableDataList.subUnit3Weight,
                      scope.row.inCount,
                      scope.row.inBasketCount,
                      scope.row.inPieceCount
                    )
                  "
                ></span>
              </span>
              <span v-else-if="item.prop == 'batchnumber'">
                <span
                  v-html="
                    getStock(
                      tableDataList.subunit,
                      tableDataList.subUnit2,
                      tableDataList.subUnit3,
                      tableDataList.pieceunit,
                      tableDataList.subUnit2Weight,
                      tableDataList.subUnit3Weight,
                      scope.row.batchnumber,
                      scope.row.basketnumber,
                      scope.row.piecenumber
                    )
                  "
                ></span>
              </span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150">
            <template slot-scope="scope">
              <el-button @click="overflowSure(scope)" type="text"
                >报溢载货筐子</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-dialog>

    <!-- 库存不足弹框 -->
    <el-dialog
      title="商品库存不足"
      :visible.sync="stockVisiable"
      :close-on-click-modal="false"
      :before-close="stockclose"
      top="100px"
      width="640px"
    >
      <div style="height: 532px">
        <div>
          <div>
            <span class="informatTitle">当前退货数量：</span
            ><span class="informatContent">230斤</span>
          </div>
          <div style="margin: 12px 0px">
            <span class="informatTitle">已选批次：</span
            ><span class="informatContent">2个/数量230斤</span>
          </div>
          <div style="margin-bottom: 24px">
            <span class="informatTitle">剩余可使用数量：</span>
            <span
              ><el-image style="width: 14px; height: 14px" :src="url"></el-image
            ></span>
            <span class="informatContent">0斤</span>
          </div>
        </div>
        <div style="border-top: 1px solid #e9e9e9; padding-top: 15px">
          <span style="color: rgba(0, 0, 0, 0.85)">在途订单：0单</span>
          <div>
            <span style="color: #0ba198; font-size: 14px"
              >销售单：897862827878787 ></span
            >
          </div>
          <div>
            <span style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
              >客户信息：付晓晓</span
            >
          </div>
          <div>
            <span style="color: rgba(1, 6, 33, 0.75); font-size: 14px"
              >已选批次使用商品：90斤(9盒)</span
            >
          </div>
        </div>
      </div>
      <div class="creditLineBottom">
        <div style="margin-right: 387px">
          <span style="margin-top: 15px">需报溢商品30斤</span>
          <span
            ><el-image style="width: 14px; height: 14px" :src="url"></el-image
          ></span>
        </div>
        <el-button size="mini" type="primary" style="margin-top: 10px"
          >报溢退货</el-button
        >
      </div>
    </el-dialog>

    <!-- 批量过磅 -->
    <weighingDialog
      :isshowtag="isshowtag"
      :isshowtag1="isshowtag1"
      ref="weighingDialog"
      @weighingChange="weighingChange"
    ></weighingDialog>

    <!-- 使用空筐过磅 -->
    <emptyBasket
      ref="emptyBasket"
      @emptyBasketChange="emptyBasketChange"
    ></emptyBasket>
    <!-- 使用买家 -->
    <emptyBasket
      ref="emptyBasket1"
      @emptyBasketChange="emptyBasketChange1"
    ></emptyBasket>
    <!-- 使用卖家 -->
    <emptyBasket
      ref="emptyBasket2"
      @emptyBasketChange="emptyBasketChange2"
    ></emptyBasket>

    <!-- 使用空置筐子 -->
    <vacancyBasket
      ref="vacancyBasket"
      @vacancyBasketChange="vacancyBasketChange"
    ></vacancyBasket>
    <!-- 使用自家筐子 -->
    <vacancyBasket
      ref="vacancyBasket1"
      @vacancyBasketChange="vacancyBasketChange1"
    ></vacancyBasket>
  </div>
</template>

<script>
import { productBatch, getCarryBasket } from "@/request/api/commodity/index";
export default {
  props: ["goodsMsg", "goodsMsg2", "getrefundMsg1", "isShow", "tableData1"],
  name: "editrefundInformation",
  components: {
    weighingDialog: () => import("./dialogmod/weighingDialog.vue"), // 批量过磅
    emptyBasket: () => import("./dialogmod/emptyBasket.vue"), // 使用空筐过磅
    vacancyBasket: () => import("./dialogmod/vacancyBasket.vue"), // 使用空置筐子
  },
  data() {
    return {
      stockVisiable: false, //库存不足弹框
      datasMsg: {},
      overflowVisiable: false, //报溢批次弹框
      overflowData: {}, //报溢批次弹框数据
      overflowMsg: {}, //报溢载货筐子数据
      baskList: {}, //载货筐子弹框数据
      weighingVisiable: false, //载货筐子弹框
      isRemovePeel: 1,
      isshowtag: false,
      isshowtag1: false,
      url: require("@/assets/image/imgs/icon-question.png"),
      tableData: [],
      tableDatalist2: [],
      tableDataList: {
        multipleSelection: [],
      },
      batchVisiable: false,
      pieceOptions: ["无", "箱", "袋", "盒", "件", "筐(一次性)"],
      tableDataBasket: [], //载货
      tableDataBasket1: [], //过磅
      tableDataBasket2: [], //空置
      tableDataBasket3: [], //买家
      tableDataBasket4: [], //自家
      tableDataBasket5: [], //卖家
      ruleForm: {
        refondPrice: 0,
        pieceUnit: "无",
        purchasenums: 0,
        piecenumber: 0,
        piecenumber1: 0,
        isLoad: 0,
        isRemovePeel: 1, //是否去皮
        ispieceUnit: "", //计件单位 采购单
        ispieceUnit1: "", //计件单位  销售单
        isRemovePeel2: 3,
      },
      batchcolumns: [
        {
          prop: "timestamp",
          label: "入库时间",
        },
        {
          prop: "batchsourcename",
          label: "入库类型",
        },
        {
          prop: "inCount",
          label: "入库数量",
        },
        {
          prop: "custmorName",
          label: "入库来源",
        },
        {
          prop: "batchnumber",
          label: "当前库存",
        },
        {
          prop: "lastlyDate",
          label: "最近变动时间",
        },
      ],
      batchcolumns1: [
        {
          prop: "timestamp",
          label: "入库时间",
        },
        {
          prop: "batchsourcename",
          label: "入库类型",
        },
        {
          prop: "custmorName",
          label: "商品来源",
        },
        {
          prop: "batchnumber",
          label: "当前库存",
        },
      ],
    };
  },
  methods: {
    //库存不足
    stockBtn() {
      this.stockVisiable = true;
    },
    stockclose() {
      this.stockVisiable = false;
    },
    //报溢载货筐子
    overflowBtn(msg) {
      this.overflowData = msg;
      this.overflowVisiable = true;
    },
    overflowSure(msg1) {
      this.overflowMsg = msg1.row;
      this.overflowVisiable = false;
    },
    overflowclose() {
      this.overflowVisiable = false;
    },
    //重量是否禁用
    isAciont() {
      let val = this.ruleForm.isRemovePeel2;
      if (this.ruleForm.ispieceUnit == "无") {
        return true;
      } else {
        if (val == 1) {
          return false;
        } else {
          return true;
        }
      }
    },
    // 各筐子行头设置*
    numRenderHeader(h, val) {
      let res = val.column.label;
      return (
        <div>
          <font style="color:red">*</font>
          {res}
        </div>
      );
    },
    numRenderHeader1() {
      return (
        <div>
          <font style="color:red">*</font>
          载货量
          <font class="el-icon-warning-outline" style="color:#0BA198;"></font>
        </div>
      );
    },
    //各类型筐子表头字体颜色
    carry_basket(h, val) {
      let res = val.column.label;
      return <div style="color:#0BA198;">{res}</div>;
    },
    // 载货筐子开始
    zaihuoTankuang() {
      this.weighingVisiable = true;
      this.getAddOwnBasket();
    },
    //载货筐子弹框回显功能
    getChecked() {
      for (let g = 0; g < this.tableDataBasket.length; g++) {
        let tableDataBasketId =
          this.tableDataBasket[g].userbasketid +
          this.tableDataBasket[g].basketcolor;
        for (let i = 0; i < this.baskList.length; i++) {
          for (let j = 0; j < this.baskList[i].basketinfos.length; j++) {
            if (tableDataBasketId == this.baskList[i].basketinfos[j].onlyId) {
              this.baskList[i].basketinfos[j].check = true;
              this.baskList[i].basketinfos[j].isActivate = true;
            }
          }
        }
      }
    },
    weighingclose() {
      this.weighingVisiable = false;
    },
    getAddOwnBasket() {
      let batchId = [];
      let param = {
        data: [
          {
            productId: "", // 商品id
            batchId: "", // 批次id,多个批次逗号隔开
          },
        ],
      };
      for (let i = 0; i < this.goodsMsg2.details.length; i++) {
        const el = this.goodsMsg2.details[i];
        param.data[0].productId = el.productIdBuyUser;
        batchId.push(el.productbathId);
      }
      param.data[0].batchId = batchId.toString();
      getCarryBasket(param).then((res) => {
        this.baskList = res.data[0].modelList;
        for (let i = 0; i < this.baskList.length; i++) {
          this.baskList[i].isIndeterminate = false;
          this.baskList[i].check = false;
          for (let j = 0; j < this.baskList[i].basketinfos.length; j++) {
            this.baskList[i].basketinfos[j].isActivate = false;
            this.baskList[i].basketinfos[j].check = false;
            this.baskList[i].basketinfos[j].onlyId =
              this.baskList[i].basketinfos[j].userbasketid +
              this.baskList[i].basketinfos[j].basketcolor;
          }
        }
        this.getChecked();
      });
    },
    handleCheckAllChange(val, index) {
      this.$forceUpdate();
      if (val) {
        this.baskList[index].isIndeterminate = false;
        for (let i = 0; i < this.baskList[index].basketinfos.length; i++) {
          this.baskList[index].basketinfos[i].check = true;
        }
      } else {
        for (let i = 0; i < this.baskList[index].basketinfos.length; i++) {
          this.baskList[index].basketinfos[i].check = false;
        }
      }
    },
    handleCheckedCitiesChange(index, index2) {
      this.$forceUpdate();
      let ischeck = 0;
      let sumischeck = 0;
      for (let i = 0; i < this.baskList[index].basketinfos.length; i++) {
        sumischeck++;
        if (this.baskList[index].basketinfos[i].check) {
          ischeck++;
        }
      }
      if (ischeck == sumischeck) {
        this.baskList[index].check = true;
        this.baskList[index].isIndeterminate = false;
      } else {
        this.baskList[index].check = false;
        if (ischeck > 0) {
          this.baskList[index].isIndeterminate = true;
        } else {
          this.baskList[index].isIndeterminate = false;
        }
      }
    },
    weighinghandleAdd() {
      for (let i = 0; i < this.baskList.length; i++) {
        const el = this.baskList[i];
        for (let j = 0; j < el.basketinfos.length; j++) {
          const ele = el.basketinfos[j];
          if (this.tableDataBasket.length > 0) {
            for (let g = 0; g < this.tableDataBasket.length; g++) {
              let tableDataBasketId =
                this.tableDataBasket[g].userbasketid +
                this.tableDataBasket[g].basketcolor;
              if (
                ele.check &&
                ele.isActivate == false &&
                tableDataBasketId != ele.onlyId
              ) {
                this.tableDataBasket.push({ ...el, ...ele });
              }
            }
          } else {
            if (ele.check) {
              this.tableDataBasket.push({ ...el, ...ele });
            }
          }
        }
      }
      this.weighingclose();
    },
    // 载货筐子结束
    handleAdd() {
      this.close();
    },
    // 选择批次关闭事件
    close() {
      this.batchVisiable = false;
      if (this.tableDataList.pieceunit == "") {
        if (this.tableDataList.basketcount > 0) {
          this.ruleForm.ispieceUnit = "筐(周转筐)";
          this.isshowtag = true;
        } else {
          this.ruleForm.ispieceUnit = "无";
        }
      } else {
        if (this.tableDataList.basketcount > 0) {
          this.ruleForm.ispieceUnit =
            this.tableDataList.pieceunit + "|筐(周转筐)";
          this.isshowtag = true;
        } else {
          this.ruleForm.ispieceUnit = this.tableDataList.pieceunit;
        }
      }
      // 初始载货筐子表格
      let batchId = [];
      let param = {
        data: [
          {
            productId: "", // 商品id
            batchId: "", // 批次id,多个批次逗号隔开
          },
        ],
      };
      var basketmsg = [];
      for (let i = 0; i < this.goodsMsg2.details.length; i++) {
        const el = this.goodsMsg2.details[i];
        param.data[0].productId = el.productIdBuyUser;
        batchId.push(el.productbathId);
      }
      param.data[0].batchId = batchId.toString();
      this.tableDataBasket = [];
      getCarryBasket(param).then((res) => {
        basketmsg = res.data[0].modelList;
        for (let i = 0; i < basketmsg.length; i++) {
          const el = basketmsg[i];
          for (let j = 0; j < el.basketinfos.length; j++) {
            const ele = el.basketinfos[j];
            this.tableDataBasket.push({ ...el, ...ele });
          }
        }
      });
    },
    handleSelectionChange(val) {
      this.tableDataList.multipleSelection = val;
    },
    getRowKey(row) {
      return row.batchid;
    },
    editSucced() {
      if (this.ruleForm.refondPrice > this.goodsMsg.productPrice) {
        return;
      }
      if (this.ruleForm.refondPrice == "") {
        this.$error("请输入退货单价");
        return;
      } else if (this.ruleForm.refondPrice == 0) {
        this.$error("退货单价不得为0");
        return;
      }
      if (this.ruleForm.purchasenums == "") {
        this.$error("请输入计算单位");
        return;
      }
      if (this.ruleForm.purchasenums == "") {
        this.$error("请输入计算单位");
        return;
      }
      // if (this.ruleForm.piecenumber1) {
      //   if (
      //     this.overflowData.basketCount !=
      //     this.overflowData.basketVacateCount +
      //       this.overflowData.userBasketCount
      //   ) {
      //     this.$error("筐子过磅=退回筐子+腾空筐子");
      //     return;
      //   }
      // }
      if (
        this.ruleForm.refondPrice *
          (this.ruleForm.purchasenums - this.isNumStatus().weightBasket) +
          this.isNumStatus().totalAmountBaskets >
        this.goodsMsg.remainingRefundable
      ) {
        this.$error("商品退款金额不可大于剩余可退金额");
        return;
      }

      this.tableDataList.forms = this.ruleForm;
      this.tableDataList.tableDataBasket = this.tableDataBasket;
      this.tableDataList.tableDataBasket1 = this.tableDataBasket1;
      this.tableDataList.tableDataBasket2 = this.tableDataBasket2;
      this.tableDataList.tableDataBasket4 = this.tableDataBasket4;
      this.tableDataList.tableDataBasket3 = this.tableDataBasket3;
      this.tableDataList.tableDataBasket5 = this.tableDataBasket5;
      this.tableDataList.forms.zhonglei =
        this.tableDataBasket.length +
        this.tableDataBasket1.length +
        this.tableDataBasket2.length +
        this.tableDataBasket3.length +
        this.tableDataBasket4.length +
        this.tableDataBasket5.length;
      this.tableDataList.forms.tuihui = this.isNumStatus().userBasketCount;
      this.tableDataList.forms.jine = this.isNumStatus().totalAmountBaskets;
      this.tableDataList.forms.kzweigth = this.isNumStatus().weightBasket;
      this.tableDataList.overflowData = this.overflowData;
      this.tableDataList.overflowMsg = this.overflowMsg;
      this.tableDataList;
      this.tableDataList = {
        ...this.tableDataList,
        ...this.isNumStatus(),
      };
      this.isShow = true;
      this.$emit("isShow1", this.isShow);
      console.log(this.tableDataList);
      this.$emit("updateEdit", this.tableDataList);
    },
    // 金额计算
    isNumStatus() {
      // 筐子重量 = 每一个重量 * 筐子过磅
      let weightBasket = 0;
      // 退回筐子总数
      let userBasketCount = 0;
      // 筐子种类
      let typeBasket = 0;
      // 筐子总金额
      let totalAmountBaskets = 0;
      // 买家筐子数量
      let numberBuyersBasket = 0;
      // 腾空筐子数量
      let basketVacateCount = 0;
      // 载货筐子
      for (let i = 0; i < this.tableDataBasket.length; i++) {
        const el = this.tableDataBasket[i];
        weightBasket += Number(el.basketWeight) * Number(el.basketCount) || 0;
        userBasketCount += Number(el.userBasketCount) || 0;
        totalAmountBaskets +=
          Number(el.userBasketPrice) * Number(el.userBasketCount) || 0;
        basketVacateCount += Number(el.basketVacateCount) || 0;
        typeBasket += 1;
      }
      // 过磅筐子
      for (let i = 0; i < this.tableDataBasket1.length; i++) {
        const el = this.tableDataBasket1[i];
        weightBasket += Number(el.basketWeight) * Number(el.basketCount) || 0;
        userBasketCount += Number(el.userBasketCount) || 0;
        totalAmountBaskets +=
          Number(el.userBasketPrice) * Number(el.userBasketCount) || 0;
        typeBasket += 1;
      }
      // 空置筐子
      for (let i = 0; i < this.tableDataBasket2.length; i++) {
        const el = this.tableDataBasket2[i];
        weightBasket += Number(el.basketWeight) * Number(el.basketCount) || 0;
        userBasketCount += Number(el.userBasketCount) || 0;
        totalAmountBaskets +=
          Number(el.userBasketPrice) * Number(el.userBasketCount) || 0;
        typeBasket += 1;
      }
      // 自家筐子
      for (let i = 0; i < this.tableDataBasket4.length; i++) {
        const el = this.tableDataBasket4[i];
        weightBasket += Number(el.basketWeight) * Number(el.basketCount) || 0;
        userBasketCount += Number(el.userBasketCount) || 0;
        totalAmountBaskets +=
          Number(el.userBasketPrice) * Number(el.userBasketCount) || 0;
        typeBasket += 1;
      }
      // 买家筐子
      for (let i = 0; i < this.tableDataBasket3.length; i++) {
        const el = this.tableDataBasket3[i];
        weightBasket += Number(el.basketWeight) * Number(el.basketCount) || 0;
        userBasketCount += Number(el.userBasketCount) || 0;
        totalAmountBaskets +=
          Number(el.userBasketPrice) * Number(el.userBasketCount) || 0;
        // numberBuyersBasket += Number(el.userBasketCount) || 0;
        typeBasket += 1;
      }
      // 卖家筐子
      for (let i = 0; i < this.tableDataBasket5.length; i++) {
        const el = this.tableDataBasket5[i];
        weightBasket += Number(el.basketWeight) * Number(el.basketCount) || 0;
        userBasketCount += Number(el.userBasketCount) || 0;
        totalAmountBaskets +=
          Number(el.userBasketPrice) * Number(el.userBasketCount) || 0;
        // numberBuyersBasket += Number(el.userBasketCount) || 0;
        typeBasket += 1;
      }
      // 商品金额 = 售价*过磅数量
      let totalAmount =
        this.ruleForm.refondPrice * this.ruleForm.purchasenums || 0;
      // 是否去皮
      if (this.ruleForm.isRemovePeel == 1) {
        totalAmount =
          this.ruleForm.refondPrice *
            (this.ruleForm.purchasenums - weightBasket) || 0;
        if (totalAmount < 0) {
          totalAmount = 0;
        }
      }
      return {
        totalAmount: totalAmount,
        weightBasket: weightBasket,
        userBasketCount: userBasketCount,
        typeBasket: typeBasket,
        totalAmountBaskets: totalAmountBaskets,
        numberBuyersBasket: numberBuyersBasket,
        basketVacateCount: basketVacateCount,
      };
    },
    baskChange(sco, name, val) {
      this.tableDataBasket[(sco.$index, name, val)];
      this.tableDataBasket.push({});
      this.tableDataBasket.pop({});
    },
    baskChange1(sco, name, val) {
      this.tableDataBasket1[(sco.$index, name, val)];
      this.tableDataBasket1.push({});
      this.tableDataBasket1.pop({});
    },
    baskChange2(sco, name, val) {
      this.tableDataBasket2[(sco.$index, name, val)];
      this.tableDataBasket2.push({});
      this.tableDataBasket2.pop({});
    },
    baskChange3(sco, name, val) {
      this.tableDataBasket3[(sco.$index, name, val)];
      this.tableDataBasket3.push({});
      this.tableDataBasket3.pop({});
    },
    baskChange4(sco, name, val) {
      this.tableDataBasket4[(sco.$index, name, val)];
      this.tableDataBasket4.push({});
      this.tableDataBasket4.pop({});
    },
    baskChange5(sco, name, val) {
      this.tableDataBasket5[(sco.$index, name, val)];
      this.tableDataBasket5.push({});
      this.tableDataBasket5.pop({});
    },
    removeData(scope) {
      this.tableDataBasket.splice(scope.$index, 1);
    },
    removeData1(scope) {
      this.tableDataBasket1.splice(scope.$index, 1);
    },
    removeData2(scope) {
      this.tableDataBasket2.splice(scope.$index, 1);
    },
    removeData3(scope) {
      this.tableDataBasket3.splice(scope.$index, 1);
    },
    removeData4(scope) {
      this.tableDataBasket4.splice(scope.$index, 1);
    },
    removeData5(scope) {
      this.tableDataBasket5.splice(scope.$index, 1);
    },
    emptyBasketChange(val) {
      if (this.tableDataBasket1.length > 0) {
        this.tableDataBasket1.push(...val);
      } else {
        this.tableDataBasket1 = val;
      }
    },
    emptyBasketChange1(val) {
      if (this.tableDataBasket3.length > 0) {
        this.tableDataBasket3.push(...val);
      } else {
        this.tableDataBasket3 = val;
      }
    },
    emptyBasketChange2(val) {
      if (this.tableDataBasket5.length > 0) {
        this.tableDataBasket5.push(...val);
      } else {
        this.tableDataBasket5 = val;
      }
    },
    vacancyBasketChange(val) {
      if (this.tableDataBasket2.length > 0) {
        this.tableDataBasket2.push(...val);
      } else {
        this.tableDataBasket2 = val;
      }
    },
    vacancyBasketChange1(val) {
      if (this.tableDataBasket4.length > 0) {
        this.tableDataBasket4.push(...val);
      } else {
        this.tableDataBasket4 = val;
      }
    },
    // 触发子组件编辑按钮
    handleTankuang(form, title, record) {
      this.$refs[form].edit(record);
      this.$refs[form].title = title;
      this.$refs[form].disableSubmit = false;
      this.$refs[form].isVisiable = true;
    },
    weighingChange(val) {
      this.$set(this.ruleForm, "purchasenums", val.purchasenums);
      this.$set(this.ruleForm, "piecenumber", val.piecenumber);
      this.$set(this.ruleForm, "piecenumber1", val.piecenumber1);
    },
    // 小数点判断 斤非斤判断
    precisionSun() {
      if (
        this.tableDataList.subunit == "斤" ||
        this.tableDataList.subunit == "公斤" ||
        this.tableDataList.subunit == "g"
      ) {
        return 2;
      } else {
        return 0;
      }
    },
    // 判断
    precisionSun2() {
      if (
        this.tableDataList.subunit == "斤" ||
        this.tableDataList.subunit == "公斤" ||
        this.tableDataList.subunit == "g" ||
        this.tableDataList.subunit == ""
      ) {
        return "批量过磅";
      } else {
        return "批量计件";
      }
    },
    subWidth() {
      if (this.tableDataList.pieceunit) {
        if (this.isshowtag) {
          return ["33%", "33%", "33%"];
        } else {
          return ["50%", "50%", "0%"];
        }
      } else {
        if (this.isshowtag) {
          return ["50%", "0%", "50%"];
        } else {
          return ["100%", "0%", "0%"];
        }
      }
    },
    subWidth1() {
      if (this.goodsMsg.pieceUnit) {
        if (this.isshowtag1) {
          return ["33%", "33%", "33%"];
        } else {
          return ["50%", "50%", "0%"];
        }
      } else {
        if (this.isshowtag1) {
          return ["50%", "0%", "50%"];
        } else {
          return ["100%", "0%", "0%"];
        }
      }
    },
    isLoadChange() {
      this.isshowtag = !this.isshowtag;
      if (this.isshowtag) {
        if (this.tableDataList.pieceunit == "") {
          this.ruleForm.ispieceUnit = "筐(周转筐)";
        } else {
          this.ruleForm.ispieceUnit =
            this.tableDataList.pieceunit + "|筐(周转筐)";
        }
      } else {
        if (this.tableDataList.pieceunit) {
          this.ruleForm.ispieceUnit = this.tableDataList.pieceunit;
        } else {
          this.ruleForm.ispieceUnit = "无";
        }
      }
    },
    isLoadChange1() {
      this.isshowtag1 = !this.isshowtag1;
      if (this.isshowtag1) {
        if (this.goodsMsg.pieceUnit == "") {
          this.ruleForm.ispieceUnit1 = "筐(周转筐)";
        } else {
          this.ruleForm.ispieceUnit1 = this.goodsMsg.pieceUnit + "|筐(周转筐)";
        }
      } else {
        if (this.goodsMsg.pieceUnit) {
          this.ruleForm.ispieceUnit1 = this.goodsMsg.pieceUnit;
        } else {
          this.ruleForm.ispieceUnit1 = "无";
        }
      }
    },
    // 单位
    purSubunit() {
      if (!this.tableDataList.subunit) {
        return "";
      } else {
        return "元/" + this.tableDataList.subunit;
      }
    },
    multipleLength() {
      if (this.tableDataList.multipleSelection) {
        return this.tableDataList.multipleSelection.length;
      } else {
        return 0;
      }
    },
    multipleCount() {
      let batchnumber = 0;
      let basketnumber = 0;
      let piecenumber = 0;
      for (let i = 0; i < this.tableDataList.multipleSelection.length; i++) {
        const element = this.tableDataList.multipleSelection[i];
        batchnumber += element.batchnumber;
        basketnumber += element.basketnumber;
        piecenumber += element.piecenumber;
      }
      let datas = this.getStock(
        this.tableDataList.subunit,
        this.tableDataList.subUnit2,
        this.tableDataList.subUnit3,
        this.tableDataList.pieceunit,
        this.tableDataList.subUnit2Weight,
        this.tableDataList.subUnit3Weight,
        batchnumber,
        basketnumber,
        piecenumber
      );
      this.datasMsg = batchnumber;
      return datas;
    },
    // 选择批次
    batchBtn() {
      this.batchVisiable = true;
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
      let next4 = pieceunit == "" ? "" : "(" + piececount + pieceunit + ")";
      let last =
        basket == 0
          ? ""
          : "|" + basket + '<font style="color:#DF971A;">筐</font>';
      let kuohao1 = subunit2 == "" ? "" : "(";
      let kuohao2 = subunit2 == "" ? "" : ")";
      return first + kuohao1 + next3 + next2 + kuohao2 + next4 + last;
    },
    // rowClass({ $index, column, columnIndex, $columnIndex }) {
    //   if ($columnIndex == 0) {
    //     return "color:#0BA198";
    //   } else {
    //     return "color:rgba(1, 6, 33, 0.90)";
    //   }
    // },
    productBatch() {
      let param = {
        productId: this.goodsMsg.productIdBuyUser, // 商品ID
        type: 6, // 报溢商品选择批次时传0，其他如单位转换和报损时传1, 2:腾空筐子，3：装筐，4：分拣 5：销售单 6：退货退款单
        pageindex: 1,
        pagesize: 10,
      };
      this.tableDatalist2 = this.tableDataList.multipleSelection;
      console.log(this.tableDataList);
      productBatch(param).then((res) => {
        this.tableDataList = res.data[0];
        // this.$nextTick(() => {
        //   this.tableDataList.modelList.forEach((row) => {
        //     for (let i = 0; i < this.tableDatalist2.length; i++) {
        //       if (this.tableDatalist2[i].batchid == row.batchid) {
        //         this.$refs.batchTable.toggleRowSelection(row, true);
        //       }
        //     }
        //   });
        // });
      });
    },
    // 数值取两位小数
    moneyFormatTwo(moneyStr) {
      // 先将数值取两位小数
      let money = Number(moneyStr)
        .toFixed(2)
        .toString()
        .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      return money;
    },
    updateTableDate() {
      this.isRemovePeel =
        this.tableData1.isRemovePeel == 1
          ? 1
          : this.tableData1.isRemovePeel == 0
          ? 0
          : 1;
      this.ruleForm.isRemovePeel2 =
        this.tableData1.isRemovePeel == 1
          ? 1
          : this.tableData1.isRemovePeel == 0
          ? 0
          : 1;
      if (this.tableData1.forms) {
        this.ruleForm.refondPrice = this.tableData1.forms.refondPrice;
        this.ruleForm.pieceUnit = this.tableData1.forms.pieceUnit;
        this.ruleForm.purchasenums = this.tableData1.forms.purchasenums;
        this.ruleForm.piecenumber = this.tableData1.forms.piecenumber;
        this.ruleForm.piecenumber1 = this.tableData1.forms.piecenumber1;
        this.ruleForm.isLoad = this.tableData1.forms.isLoad;
        this.ruleForm.isRemovePeel = this.tableData1.forms.isRemovePeel;
      } else {
        return;
      }
      console.log(this.tableData1.multipleSelection1);
      if (this.tableData1.multipleSelection1) {
        this.tableDataList.multipleSelection =
          this.tableData1.multipleSelection1;
      }
      this.multipleLength();
      if (this.tableData1.basketResult) {
        this.tableDataBasket = this.tableData1.basketResult.basket;
        this.tableDataBasket1 = this.tableData1.basketResult.basket1;
        this.tableDataBasket2 = this.tableData1.basketResult.basket2;
        this.tableDataBasket3 = this.tableData1.basketResult.basket3;
        this.tableDataBasket4 = this.tableData1.basketResult.basket4;
        this.tableDataBasket5 = this.tableData1.basketResult.basket5;
      }
    },
    updatepieceUnit() {
      //初始化非平台销售单进入页面获取计件单位
      if (this.goodsMsg.pieceUnit == "") {
        if (this.goodsMsg.returnBasketCount > 0) {
          this.ruleForm.ispieceUnit1 = "筐(周转筐)";
          this.isshowtag1 = true;
        } else {
          this.ruleForm.ispieceUnit1 = "无";
        }
      } else {
        if (this.goodsMsg.returnBasketCount > 0) {
          this.ruleForm.ispieceUnit1 = this.goodsMsg.pieceUnit + "|筐(周转筐)";
          this.isshowtag1 = true;
        } else {
          this.ruleForm.ispieceUnit1 = this.goodsMsg.pieceUnit;
        }
      }
    },
  },
  created() {
    this.updateTableDate();
    this.productBatch();
    this.updatepieceUnit();
  },
};
</script>

<style lang="scss" scoped>
.editRefundmodel {
  padding: 1px 9px;
  .editInformat {
    font-size: 16px;
    color: rgba(1, 6, 33, 0.9);
    font-weight: 600;
  }
  .informatname {
    margin: 12px 0px;
  }
  .informatExplain {
    font-size: 14px;
    border-bottom: 1px dashed #e6e6e6;
    padding-bottom: 16px;
  }
  .informatTitle {
    color: rgba(1, 6, 33, 0.55);
    font-size: 14px;
  }
  .informatTitle1 {
    color: rgba(1, 6, 33, 0.55);
    font-size: 14px;
    display: inline-block;
    width: 250px;
  }
  .informatContent {
    color: rgba(1, 6, 33, 0.9);
    font-size: 14px;
  }
  .but_sty {
    margin-left: 5px;
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
  }
  .input_sty {
    position: absolute;
    top: 12px;
    right: 14px;
    font-size: 12px;
    color: rgba(1, 6, 33, 0.75);
  }
}
.addCommoditysearch {
  .search-form-border {
    display: inline-block;
    border: 1px solid #dcdfe6;
    border-radius: 4px;

    .search-form-title {
      padding: 0px 8px;
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
    ::v-deep .el-input__suffix {
      top: 2px;
    }
  }
}
.page_footer {
  width: 100%;
  // z-index: 99999;
  // text-align: right;
  background-color: #fff;
  border-top: 1px solid #e4e7ed;
  position: fixed;
  bottom: 0px;
  padding: 12px;
  right: 20px;
}
.eltable {
  width: 100%;
  border-left: 1px solid #e9e9e9;
  border-right: 1px solid #e9e9e9;
  border-top: 1px solid #e9e9e9;
}
.creditLineBottom {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid rgba(1, 6, 33, 0.06);
  padding: 5px;
}
.editDialog {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  margin-bottom: 12px;
}
.editInformat {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.85);
  font-weight: 600;
  line-height: 14px;
  padding: 24px 0px 16px;
}
.change_tag {
  color: #fff;
  background-color: #0ba198;
}
.marginform {
  margin-bottom: 5px;
  overflow: hidden;
}
.creditLineBottom {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid rgba(1, 6, 33, 0.06);
  padding: 5px;
}
.drawer-bootom-button {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
::v-deep .el-scrollbar {
  .el-scrollbar__wrap {
    margin-bottom: 0px !important;
    overflow-x: hidden;

    .el-scrollbar__view {
      position: relative;
      padding: 0px !important;
    }
  }
}
::v-deep .header_sty {
  color: rgba(1, 6, 33, 0.9);
}
::v-deep .el-dialog__body {
  padding: 16px 20px;
}
</style>
