<template>
  <!-- 编辑商品 -->
  <PageNoScroll @hanleRefresh="hanleRefresh">
    <div class="addCommoditymodel">
      <el-scrollbar
        ref="scrollDiv"
        :style="{
          height: $store.getters.screenHeight - 245 + 'px',
        }"
      >
        <div
          style="
            padding: 5px 0px;
            color: rgba(1, 6, 33, 0.9);
            font-size: 16px;
            font-weight: 700;
            display: flex;
            align-items: center;
          "
        >
          <span style="padding-right: 5px">商品信息</span>
          <el-button
            type="primary"
            size="mini"
            @click="
              handleJumpDetail('addSalesCommodity', {
                isStatus: 'edit',
                tableDataLink: tableDataLink.editCommodityData,
              })
            "
            icon="el-icon-plus"
            >选择商品</el-button
          >
        </div>

        <div>
          <div
            style="
              padding: 5px 0px 5px;
              border-bottom: 1px solid rgba(233, 233, 233, 1);
            "
          >
            <div>
              <div>
                <div
                  style="
                    color: rgba(1, 6, 33, 0.9);
                    font-size: 16px;
                    font-weight: 700;
                  "
                >
                  {{ tableDataLink.editCommodityData.categoryName }}
                </div>
              </div>
            </div>

            <div style="padding: 5px 0px 5px">
              <el-row>
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >品种/品牌：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                    tableDataLink.editCommodityData.variety
                  }}</span></el-col
                >
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >产地：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                    tableDataLink.editCommodityData.regionname
                  }}</span></el-col
                >
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >级别/规格：</span
                  ><span
                    style="
                      color: rgba(1, 6, 33, 0.9);
                      font-size: 14px;
                      padding-right: 10px;
                    "
                    >{{ tableDataLink.editCommodityData.spec }}</span
                  ><el-button
                    type="text"
                    size="mini"
                    @click="
                      handleEdit(
                        'levelDialog',
                        '级别/规格',
                        tableDataLink.editCommodityData
                      )
                    "
                    >编辑</el-button
                  ></el-col
                >
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >计算单位：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                    tableDataLink.editCommodityData.subunit
                  }}</span></el-col
                >
              </el-row>
            </div>
          </div>

          <div
            style="
              padding: 5px 0px 5px;
              border-bottom: 1px solid rgba(233, 233, 233, 1);
            "
          >
            <el-row>
              <el-col :span="5"
                ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >当前库存：</span
                >
                <span
                  style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                  v-html="
                    getStock(
                      tableDataLink.editCommodityData.subunit,
                      tableDataLink.editCommodityData.subUnit2,
                      tableDataLink.editCommodityData.subUnit3,
                      tableDataLink.editCommodityData.pieceunit,
                      tableDataLink.editCommodityData.subUnit2Weight,
                      tableDataLink.editCommodityData.subUnit3Weight,
                      tableData.batchcount,
                      tableData.basketcount,
                      tableData.piececount
                    )
                  "
                ></span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                  >({{
                    tableData.modelList ? tableData.modelList.length : 0
                  }}个批次)</span
                ></el-col
              >
              <el-col :span="8"
                ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >已选批次库存：</span
                ><span
                  style="
                    color: rgba(1, 6, 33, 0.9);
                    font-size: 14px;
                    margin-right: 5px;
                  "
                  ><span
                    v-if="multipleLength() > 0"
                    v-html="multipleCount()"
                  ></span>
                  {{
                    multipleLength() > 0
                      ? "(" + multipleLength() + "个批次)"
                      : "- -"
                  }}</span
                ><el-button
                  type="primary"
                  size="mini"
                  plain
                  @click="
                    handleEdit(
                      'editSalesDialog',
                      '选择批次',
                      tableDataLink.editCommodityData
                    )
                  "
                  >选择批次</el-button
                ></el-col
              >
            </el-row>
          </div>
          <!--  v-if="multipleLength() > 0" -->
          <div v-if="multipleLength() > 0">
            <div style="padding: 10px 0px">
              <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                >平均采购单价：{{ form.avgPrice }}元/{{
                  tableDataLink.editCommodityData.subunit
                }}</span
              >
            </div>

            <el-form
              style="width: 650px"
              label-position="left"
              :model="form"
              :rules="rules"
              ref="ruleForm"
              label-width="120px"
              class="demo-ruleForm"
              size="small"
            >
              <el-form-item label="售价：" prop="sellPrice">
                <el-input
                  v-model="form.sellPrice"
                  placeholder="请填写售价"
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
              </el-form-item>
              <el-form-item label="选择计件单位：" prop="pieceUnit">
                <el-popover
                  placement="bottom-start"
                  title=""
                  width="330"
                  trigger="click"
                >
                  <div>
                    <div><span style="color: brown">*</span>选择计件单位</div>
                    <div style="padding: 5px 0px">
                      <el-tag
                        :style="{
                          margin: '0px 15px 8px 0px',
                          display: 'inline-block',
                          border: '1px solid rgba(208, 208, 210, 1)',
                          color:
                            tag == form.pieceUnit
                              ? '#ffffff'
                              : 'rgba(1, 6, 33, 0.75)',
                          background:
                            tag == form.pieceUnit
                              ? 'rgba(11, 161, 152, 1)'
                              : '#fff',
                          cursor: 'pointer',
                        }"
                        v-for="(tag, index) in pieceOptions"
                        :key="index"
                        @click="pieceChange(tag)"
                        type="info"
                        effect="plain"
                      >
                        {{ tag }}
                      </el-tag>
                    </div>
                    <div>选择装载物</div>
                    <div style="padding: 5px 0px">
                      <el-tag
                        :style="{
                          margin: '0px 15px 8px 0px',
                          display: 'inline-block',
                          border: '1px solid rgba(208, 208, 210, 1)',
                          color:
                            1 == form.isLoad
                              ? '#ffffff'
                              : 'rgba(1, 6, 33, 0.75)',
                          background:
                            1 == form.isLoad ? 'rgba(11, 161, 152, 1)' : '#fff',
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
                    slot="reference"
                    :readonly="true"
                    :value="pieceUnitLoad()"
                    placeholder="请选择"
                  ></el-input>
                </el-popover>
              </el-form-item>
              <el-form-item label="过磅数量：" prop="purchasenums">
                <div class="addCommoditysearch flex_dom flex_item_mid">
                  <span class="search-form-border">
                    <el-input
                      :style="{ width: subWidth()[0] }"
                      v-model="form.purchasenums"
                      placeholder="请输入"
                    >
                      <span
                        slot="suffix"
                        style="
                          color: rgba(1, 6, 33, 0.9);
                          font-size: 13px;
                          margin-top: 5px;
                        "
                        >{{ tableDataLink.editCommodityData.subunit }}</span
                      >
                    </el-input>

                    <el-input
                      v-if="form.pieceUnit != '无'"
                      :style="{ width: subWidth()[1] }"
                      v-model="form.piecenumber"
                      placeholder="请输入"
                      ><span
                        slot="suffix"
                        style="color: rgba(1, 6, 33, 0.9); font-size: 13px"
                        >{{
                          form.pieceUnit == "筐(一次性)" ? "筐" : form.pieceUnit
                        }}</span
                      ></el-input
                    >
                    <el-input
                      v-if="form.isLoad == 1"
                      :style="{ width: subWidth()[2] }"
                      v-model="form.piecenumber1"
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
                      handleEdit('weighingDialog', '批量过磅', {
                        tableDataLink: tableDataLink.editCommodityData,
                        form,
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
                <div v-if="precisionSun() != 0 && form.isLoad == 1">
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
                  v-if="basketStatus()[0]"
                  size="mini"
                  style="
                    margin-left: 5px;
                    border: 1px solid var(--color-primary);
                    color: var(--color-primary);
                  "
                  icon="el-icon-plus"
                  @click="
                    handleEdit('addHomeBasket', '使用载货筐子', {
                      isSataus: 'cargo',
                      tableDataLink: tableDataLink.editCommodityData,
                      form,
                    })
                  "
                  >使用载货筐子</el-button
                >

                <el-button
                  v-if="basketStatus()[1]"
                  size="mini"
                  style="
                    margin-left: 5px;
                    border: 1px solid var(--color-primary);
                    color: var(--color-primary);
                  "
                  icon="el-icon-plus"
                  @click="
                    handleEdit('emptyBasket', '使用空筐过磅', {
                      isSataus: 'empty',
                      tableDataLink: tableDataLink.editCommodityData,
                      form,
                    })
                  "
                  >使用空筐过磅</el-button
                >
                <el-button
                  v-if="basketStatus()[2]"
                  size="mini"
                  style="
                    margin-left: 5px;
                    border: 1px solid var(--color-primary);
                    color: var(--color-primary);
                  "
                  icon="el-icon-plus"
                  @click="
                    handleEdit('vacancyBasket', '使用空置筐子', {
                      isSataus: 'vacancy',
                      tableDataLink: tableDataLink.editCommodityData,
                      form,
                    })
                  "
                  >使用空置筐子</el-button
                >
              </div>
            </div>

            <div style="padding-bottom: 10px">
              <div v-if="basketStatus()[0] && tableDataBasket.length > 0">
                <ux-grid
                  :border="false"
                  show-overflow
                  ref="plxTable"
                  keep-source
                  height="250"
                  :data="tableDataBasket"
                  :highlightCurrentRow="false"
                  :edit-config="{ trigger: 'click', mode: 'cell' }"
                  :header-cell-style="rowClass"
                  :summary-method="summaryMethod"
                  show-summary
                >
                  <ux-table-column
                    field="basketname"
                    title="载货筐子"
                    width="140"
                  >
                    <template v-slot="scope">
                      <span class="my-input-sc">{{
                        "[" + scope.row.basketType + "]" + scope.row.basketname
                      }}</span>
                    </template>
                  </ux-table-column>
                  <ux-table-column field="basketcolor" title="颜色">
                    <template v-slot="scope">
                      <span class="my-input-sc">{{
                        scope.row.basketcolor
                      }}</span>
                    </template>
                  </ux-table-column>
                  <ux-table-column field="userbasketnumber" title="数量">
                    <template v-slot="scope">
                      <span class="my-input-sc">{{
                        scope.row.userbasketnumber
                      }}</span>
                    </template>
                  </ux-table-column>
                  <ux-table-column
                    field="basketWeight"
                    title="重量"
                    v-if="form.isRemovePeel == 1"
                  >
                    <template v-slot="scope">
                      <el-input
                        @input="(val) => baskChange(scope, 'basketWeight', val)"
                        v-model="scope.row.basketWeight"
                        placeholder="请输入内容"
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span
                        style="
                          position: absolute;
                          top: 12px;
                          right: 14px;
                          font-size: 12px;
                          color: rgba(1, 6, 33, 0.75);
                        "
                        >{{ tableDataLink.editCommodityData.subunit }}/个</span
                      >
                    </template>
                  </ux-table-column>
                  <ux-table-column field="basketCargo" title="载货量">
                    <template v-slot="scope">
                      <el-input
                        @input="(val) => baskChange(scope, 'basketCargo', val)"
                        v-model="scope.row.basketCargo"
                        placeholder="请输入内容"
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span
                        style="
                          position: absolute;
                          top: 12px;
                          right: 14px;
                          font-size: 12px;
                          color: rgba(1, 6, 33, 0.75);
                        "
                        >{{ tableDataLink.editCommodityData.subunit }}/<span
                          style="color: rgba(223, 151, 26, 1)"
                          >筐</span
                        ></span
                      >
                    </template>
                  </ux-table-column>
                  <ux-table-column field="userBasketPrice" title="单价">
                    <template v-slot="scope">
                      <el-input
                        @input="
                          (val) => baskChange(scope, 'userBasketPrice', val)
                        "
                        v-model="scope.row.userBasketPrice"
                        placeholder="请输入内容"
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span
                        style="
                          position: absolute;
                          top: 12px;
                          right: 14px;
                          font-size: 12px;
                          color: rgba(1, 6, 33, 0.75);
                        "
                        >元/个
                      </span>
                    </template>
                  </ux-table-column>
                  <ux-table-column
                    field="outsellBasketCount"
                    title="筐子过磅"
                    width="150"
                  >
                    <template v-slot="scope">
                      <el-input
                        @input="
                          (val) => baskChange(scope, 'outsellBasketCount', val)
                        "
                        v-model="scope.row.outsellBasketCount"
                        placeholder="请输入内容"
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span
                        style="
                          position: absolute;
                          top: 12px;
                          right: 14px;
                          font-size: 12px;
                          color: rgba(1, 6, 33, 0.75);
                        "
                        >个
                      </span>
                    </template>
                  </ux-table-column>
                  <ux-table-column
                    field="userBasketCount"
                    title="售出筐子"
                    width="150"
                  >
                    <template v-slot="scope">
                      <el-input
                        @input="
                          (val) => baskChange(scope, 'userBasketCount', val)
                        "
                        v-model="scope.row.userBasketCount"
                        placeholder="请输入内容"
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span
                        style="
                          position: absolute;
                          top: 12px;
                          right: 14px;
                          font-size: 12px;
                          color: rgba(1, 6, 33, 0.75);
                        "
                        >个
                      </span>
                    </template>
                  </ux-table-column>
                  <ux-table-column
                    field="basketVacateCount"
                    title="腾空筐子"
                    width="150"
                  >
                    <template v-slot="scope">
                      <el-input
                        @input="
                          (val) => baskChange(scope, 'basketVacateCount', val)
                        "
                        v-model="scope.row.basketVacateCount"
                        placeholder="请输入内容"
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span
                        style="
                          position: absolute;
                          top: 12px;
                          right: 14px;
                          font-size: 12px;
                          color: rgba(1, 6, 33, 0.75);
                        "
                        >个
                      </span>
                    </template>
                  </ux-table-column>
                  <ux-table-column field=" " title="操作" width="150">
                    <template v-slot="scope">
                      <span
                        style="color: #0ba198; font-size: 14px; cursor: pointer"
                        @click="removeData(scope)"
                        >移除</span
                      >
                    </template>
                  </ux-table-column>
                </ux-grid>
              </div>
              <div
                style="margin-top: 10px"
                v-if="basketStatus()[1] && tableDataBasket1.length > 0"
              >
                <ux-grid
                  :border="false"
                  show-overflow
                  ref="plxTable"
                  keep-source
                  height="250"
                  :data="tableDataBasket1"
                  :highlightCurrentRow="false"
                  :edit-config="{ trigger: 'click', mode: 'cell' }"
                  :header-cell-style="rowClass"
                  :summary-method="summaryMethod1"
                  show-summary
                >
                  <ux-table-column
                    field="basektName"
                    title="过磅筐子"
                    width="140"
                  >
                    <template v-slot="scope">
                      <span class="my-input-sc">{{
                        "[" + scope.row.basketType + "]" + scope.row.basektName
                      }}</span>
                    </template>
                  </ux-table-column>
                  <ux-table-column field="basketColor" title="颜色">
                    <template v-slot="scope">
                      <span class="my-input-sc">{{
                        scope.row.basketColor
                      }}</span>
                    </template>
                  </ux-table-column>
                  <ux-table-column
                    field="basketWeight"
                    title="重量"
                    v-if="form.isRemovePeel == 1"
                  >
                    <template v-slot="scope">
                      <el-input
                        @input="
                          (val) => baskChange1(scope, 'basketWeight', val)
                        "
                        v-model="scope.row.basketWeight"
                        placeholder="请输入内容"
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span
                        style="
                          position: absolute;
                          top: 12px;
                          right: 14px;
                          font-size: 12px;
                          color: rgba(1, 6, 33, 0.75);
                        "
                        >{{ tableDataLink.editCommodityData.subunit }}/个</span
                      >
                    </template>
                  </ux-table-column>
                  <ux-table-column field="basketCargo" title="载货量">
                    <template v-slot="scope">
                      <el-input
                        @input="(val) => baskChange1(scope, 'basketCargo', val)"
                        v-model="scope.row.basketCargo"
                        placeholder="请输入内容"
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span
                        style="
                          position: absolute;
                          top: 12px;
                          right: 14px;
                          font-size: 12px;
                          color: rgba(1, 6, 33, 0.75);
                        "
                        >{{ tableDataLink.editCommodityData.subunit }}/<span
                          style="color: rgba(223, 151, 26, 1)"
                          >筐</span
                        ></span
                      >
                    </template>
                  </ux-table-column>
                  <ux-table-column field="userBasketPrice" title="单价">
                    <template v-slot="scope">
                      <el-input
                        @input="
                          (val) => baskChange1(scope, 'userBasketPrice', val)
                        "
                        v-model="scope.row.userBasketPrice"
                        placeholder="请输入内容"
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span
                        style="
                          position: absolute;
                          top: 12px;
                          right: 14px;
                          font-size: 12px;
                          color: rgba(1, 6, 33, 0.75);
                        "
                        >元/个
                      </span>
                    </template>
                  </ux-table-column>
                  <ux-table-column
                    field="outsellBasketCount"
                    title="筐子过磅"
                    width="150"
                  >
                    <template v-slot="scope">
                      <el-input
                        @input="
                          (val) => baskChange1(scope, 'outsellBasketCount', val)
                        "
                        v-model="scope.row.outsellBasketCount"
                        placeholder="请输入内容"
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span
                        style="
                          position: absolute;
                          top: 12px;
                          right: 14px;
                          font-size: 12px;
                          color: rgba(1, 6, 33, 0.75);
                        "
                        >个
                      </span>
                    </template>
                  </ux-table-column>
                  <ux-table-column
                    field="userBasketCount"
                    title="售出筐子"
                    width="150"
                  >
                    <template v-slot="scope">
                      <el-input
                        @input="
                          (val) => baskChange1(scope, 'userBasketCount', val)
                        "
                        v-model="scope.row.userBasketCount"
                        placeholder="请输入内容"
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span
                        style="
                          position: absolute;
                          top: 12px;
                          right: 14px;
                          font-size: 12px;
                          color: rgba(1, 6, 33, 0.75);
                        "
                        >个
                      </span>
                    </template>
                  </ux-table-column>
                  <ux-table-column
                    field="basketVacateCount"
                    title="留库筐子"
                    width="150"
                  >
                    <template v-slot="scope">
                      <el-input
                        @input="
                          (val) => baskChange1(scope, 'basketVacateCount', val)
                        "
                        v-model="scope.row.basketVacateCount"
                        placeholder="请输入内容"
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span
                        style="
                          position: absolute;
                          top: 12px;
                          right: 14px;
                          font-size: 12px;
                          color: rgba(1, 6, 33, 0.75);
                        "
                        >个
                      </span>
                    </template>
                  </ux-table-column>
                  <ux-table-column field=" " title="操作" width="150">
                    <template v-slot="scope">
                      <span
                        style="color: #0ba198; font-size: 14px; cursor: pointer"
                        @click="removeData1(scope)"
                        >移除</span
                      >
                    </template>
                  </ux-table-column>
                </ux-grid>
              </div>
              <div
                style="margin-top: 10px"
                v-if="basketStatus()[2] && tableDataBasket2.length > 0"
              >
                <ux-grid
                  :border="false"
                  show-overflow
                  ref="plxTable"
                  keep-source
                  height="250"
                  :data="tableDataBasket2"
                  :highlightCurrentRow="false"
                  :edit-config="{ trigger: 'click', mode: 'cell' }"
                  :header-cell-style="rowClass"
                  :summary-method="summaryMethod2"
                  show-summary
                >
                  <ux-table-column
                    field="basketname"
                    title="空置筐子"
                    width="140"
                  >
                    <template v-slot="scope">
                      <span class="my-input-sc">{{
                        "[" + scope.row.basketType + "]" + scope.row.basketname
                      }}</span>
                    </template>
                  </ux-table-column>
                  <ux-table-column field="basketcolor" title="颜色">
                    <template v-slot="scope">
                      <span class="my-input-sc">{{
                        scope.row.basketcolor
                      }}</span>
                    </template>
                  </ux-table-column>
                  <ux-table-column field="basketWeight" title="空置数量">
                    <template v-slot="scope">
                      <span class="my-input-sc">{{ scope.row.nums }}</span>
                    </template>
                  </ux-table-column>
                  <ux-table-column
                    field="basketWeight"
                    title="重量"
                    v-if="form.isRemovePeel == 1"
                  >
                    <template v-slot="scope">
                      <el-input
                        @input="
                          (val) => baskChange2(scope, 'basketWeight', val)
                        "
                        v-model="scope.row.basketWeight"
                        placeholder="请输入内容"
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span
                        style="
                          position: absolute;
                          top: 12px;
                          right: 14px;
                          font-size: 12px;
                          color: rgba(1, 6, 33, 0.75);
                        "
                        >{{ tableDataLink.editCommodityData.subunit }}/个</span
                      >
                    </template>
                  </ux-table-column>
                  <ux-table-column field="basketCargo" title="载货量">
                    <template v-slot="scope">
                      <el-input
                        @input="(val) => baskChange2(scope, 'basketCargo', val)"
                        v-model="scope.row.basketCargo"
                        placeholder="请输入内容"
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span
                        style="
                          position: absolute;
                          top: 12px;
                          right: 14px;
                          font-size: 12px;
                          color: rgba(1, 6, 33, 0.75);
                        "
                        >{{ tableDataLink.editCommodityData.subunit }}/<span
                          style="color: rgba(223, 151, 26, 1)"
                          >筐</span
                        ></span
                      >
                    </template>
                  </ux-table-column>
                  <ux-table-column field="userBasketPrice" title="单价">
                    <template v-slot="scope">
                      <el-input
                        @input="
                          (val) => baskChange2(scope, 'userBasketPrice', val)
                        "
                        v-model="scope.row.userBasketPrice"
                        placeholder="请输入内容"
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span
                        style="
                          position: absolute;
                          top: 12px;
                          right: 14px;
                          font-size: 12px;
                          color: rgba(1, 6, 33, 0.75);
                        "
                        >元/个
                      </span>
                    </template>
                  </ux-table-column>
                  <ux-table-column
                    field="userBasketCount"
                    title="售出筐子"
                    width="150"
                  >
                    <template v-slot="scope">
                      <el-input
                        @input="
                          (val) => baskChange2(scope, 'userBasketCount', val)
                        "
                        v-model="scope.row.userBasketCount"
                        placeholder="请输入内容"
                        style="width: 100%"
                        size="mini"
                      ></el-input>
                      <span
                        style="
                          position: absolute;
                          top: 12px;
                          right: 14px;
                          font-size: 12px;
                          color: rgba(1, 6, 33, 0.75);
                        "
                        >个
                      </span>
                    </template>
                  </ux-table-column>
                  <ux-table-column field=" " title="操作" width="150">
                    <template v-slot="scope">
                      <span
                        style="color: #0ba198; font-size: 14px; cursor: pointer"
                        @click="removeData2(scope)"
                        >移除</span
                      >
                    </template>
                  </ux-table-column>
                </ux-grid>
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
              <el-button
                v-if="basketStatus()[4]"
                size="mini"
                style="
                  margin-left: 5px;
                  border: 1px solid var(--color-primary);
                  color: var(--color-primary);
                "
                icon="el-icon-plus"
                @click="
                  handleEdit('vacancyBasket1', '使用自家筐子', {
                    isSataus: 'empty',
                    tableDataLink: tableDataLink.editCommodityData,
                    form,
                  })
                "
                >使用自家筐子</el-button
              >
              <el-button
                v-if="basketStatus()[3]"
                size="mini"
                style="
                  margin-left: 5px;
                  border: 1px solid var(--color-primary);
                  color: var(--color-primary);
                "
                icon="el-icon-plus"
                @click="
                  handleEdit('emptyBasket1', '使用买家筐子', {
                    isSataus: 'empty',
                    tableDataLink: tableDataLink.editCommodityData,
                    form,
                  })
                "
                >使用买家筐子</el-button
              >
            </div>
            <div
              style="margin-top: 10px"
              v-if="basketStatus()[4] && tableDataBasket4.length > 0"
            >
              <ux-grid
                :border="false"
                show-overflow
                ref="plxTable"
                keep-source
                height="250"
                :data="tableDataBasket4"
                :highlightCurrentRow="false"
                :edit-config="{ trigger: 'click', mode: 'cell' }"
                :header-cell-style="rowClass"
              >
                <ux-table-column
                  field="basektName"
                  title="自家筐子"
                  width="140"
                >
                  <template v-slot="scope">
                    <span class="my-input-sc">{{
                      "[" + scope.row.basketType + "]" + scope.row.basektName
                    }}</span>
                  </template>
                </ux-table-column>
                <ux-table-column field="basketColor" title="颜色">
                  <template v-slot="scope">
                    <span class="my-input-sc">{{ scope.row.basketColor }}</span>
                  </template>
                </ux-table-column>
                <ux-table-column field="basketColor" title="空置数量">
                  <template v-slot="scope">
                    <span class="my-input-sc">{{ scope.row.nums }}个</span>
                  </template>
                </ux-table-column>
                <ux-table-column
                  field="basketWeight"
                  title="重量"
                  v-if="form.isRemovePeel == 1"
                >
                  <template v-slot="scope">
                    <el-input
                      @input="(val) => baskChange4(scope, 'basketWeight', val)"
                      v-model="scope.row.basketWeight"
                      placeholder="请输入内容"
                      style="width: 100%"
                      size="mini"
                    ></el-input>
                    <span
                      style="
                        position: absolute;
                        top: 12px;
                        right: 14px;
                        font-size: 12px;
                        color: rgba(1, 6, 33, 0.75);
                      "
                      >{{ tableDataLink.editCommodityData.subunit }}/个</span
                    >
                  </template>
                </ux-table-column>
                <ux-table-column field="basketCargo" title="载货量">
                  <template v-slot="scope">
                    <el-input
                      @input="(val) => baskChange4(scope, 'basketCargo', val)"
                      v-model="scope.row.basketCargo"
                      placeholder="请输入内容"
                      style="width: 100%"
                      size="mini"
                    ></el-input>
                    <span
                      style="
                        position: absolute;
                        top: 12px;
                        right: 14px;
                        font-size: 12px;
                        color: rgba(1, 6, 33, 0.75);
                      "
                      >{{ tableDataLink.editCommodityData.subunit }}/<span
                        style="color: rgba(223, 151, 26, 1)"
                        >筐</span
                      ></span
                    >
                  </template>
                </ux-table-column>
                <ux-table-column field="userBasketPrice" title="单价">
                  <template v-slot="scope">
                    <el-input
                      @input="
                        (val) => baskChange4(scope, 'userBasketPrice', val)
                      "
                      v-model="scope.row.userBasketPrice"
                      placeholder="请输入内容"
                      style="width: 100%"
                      size="mini"
                    ></el-input>
                    <span
                      style="
                        position: absolute;
                        top: 12px;
                        right: 14px;
                        font-size: 12px;
                        color: rgba(1, 6, 33, 0.75);
                      "
                      >元/个
                    </span>
                  </template>
                </ux-table-column>
                <ux-table-column
                  field="outsellBasketCount"
                  title="筐子过磅"
                  width="150"
                >
                  <template v-slot="scope">
                    <el-input
                      @input="
                        (val) => baskChange4(scope, 'outsellBasketCount', val)
                      "
                      v-model="scope.row.outsellBasketCount"
                      placeholder="请输入内容"
                      style="width: 100%"
                      size="mini"
                    ></el-input>
                    <span
                      style="
                        position: absolute;
                        top: 12px;
                        right: 14px;
                        font-size: 12px;
                        color: rgba(1, 6, 33, 0.75);
                      "
                      >个
                    </span>
                  </template>
                </ux-table-column>
                <ux-table-column
                  field="userBasketCount"
                  title="售出筐子"
                  width="150"
                >
                  <template v-slot="scope">
                    <el-input
                      @input="
                        (val) => baskChange4(scope, 'userBasketCount', val)
                      "
                      v-model="scope.row.userBasketCount"
                      placeholder="请输入内容"
                      style="width: 100%"
                      size="mini"
                    ></el-input>
                    <span
                      style="
                        position: absolute;
                        top: 12px;
                        right: 14px;
                        font-size: 12px;
                        color: rgba(1, 6, 33, 0.75);
                      "
                      >个
                    </span>
                  </template>
                </ux-table-column>
                <ux-table-column
                  field="basketVacateCount"
                  title="留库筐子"
                  width="150"
                >
                  <template v-slot="scope">
                    <el-input
                      @input="
                        (val) => baskChange4(scope, 'basketVacateCount', val)
                      "
                      v-model="scope.row.basketVacateCount"
                      placeholder="请输入内容"
                      style="width: 100%"
                      size="mini"
                    ></el-input>
                    <span
                      style="
                        position: absolute;
                        top: 12px;
                        right: 14px;
                        font-size: 12px;
                        color: rgba(1, 6, 33, 0.75);
                      "
                      >个
                    </span>
                  </template>
                </ux-table-column>
                <ux-table-column field=" " title="操作" width="150">
                  <template v-slot="scope">
                    <span
                      style="color: #0ba198; font-size: 14px; cursor: pointer"
                      @click="removeData4(scope)"
                      >移除</span
                    >
                  </template>
                </ux-table-column>
              </ux-grid>
            </div>
            <div
              style="margin-top: 10px"
              v-if="basketStatus()[3] && tableDataBasket3.length > 0"
            >
              <ux-grid
                :border="false"
                show-overflow
                ref="plxTable"
                keep-source
                height="250"
                :data="tableDataBasket3"
                :highlightCurrentRow="false"
                :edit-config="{ trigger: 'click', mode: 'cell' }"
                :header-cell-style="rowClass"
              >
                <ux-table-column
                  field="basektName"
                  title="过磅筐子"
                  width="140"
                >
                  <template v-slot="scope">
                    <span class="my-input-sc">{{
                      "[" + scope.row.basketType + "]" + scope.row.basektName
                    }}</span>
                  </template>
                </ux-table-column>
                <ux-table-column field="basketColor" title="颜色">
                  <template v-slot="scope">
                    <span class="my-input-sc">{{ scope.row.basketColor }}</span>
                  </template>
                </ux-table-column>
                <ux-table-column field="basketCargo" title="载货量">
                  <template v-slot="scope">
                    <el-input
                      @input="(val) => baskChange3(scope, 'basketCargo', val)"
                      v-model="scope.row.basketCargo"
                      placeholder="请输入内容"
                      style="width: 100%"
                      size="mini"
                    ></el-input>
                    <span
                      style="
                        position: absolute;
                        top: 12px;
                        right: 14px;
                        font-size: 12px;
                        color: rgba(1, 6, 33, 0.75);
                      "
                      >{{ tableDataLink.editCommodityData.subunit }}/<span
                        style="color: rgba(223, 151, 26, 1)"
                        >筐</span
                      ></span
                    >
                  </template>
                </ux-table-column>
                <ux-table-column field="userBasketCount" title="使用">
                  <template v-slot="scope">
                    <el-input
                      @input="
                        (val) => baskChange3(scope, 'userBasketCount', val)
                      "
                      v-model="scope.row.userBasketCount"
                      placeholder="请输入内容"
                      style="width: 100%"
                      size="mini"
                    ></el-input>
                    <span
                      style="
                        position: absolute;
                        top: 12px;
                        right: 14px;
                        font-size: 12px;
                        color: rgba(1, 6, 33, 0.75);
                      "
                      >个
                    </span>
                  </template>
                </ux-table-column>
                <ux-table-column field=" " title="操作" width="150">
                  <template v-slot="scope">
                    <span
                      style="color: #0ba198; font-size: 14px; cursor: pointer"
                      @click="removeData3(scope)"
                      >移除</span
                    >
                  </template>
                </ux-table-column>
              </ux-grid>
            </div>
          </div>
        </div>
      </el-scrollbar>

      <div class="btnBottom">
        <div class="flex_row_reverse flex_item_mid">
          <div style="margin-right: 10px">
            <span
              style="
                margin-right: 10px;
                color: rgba(1, 6, 33, 0.9);
                font-size: 14px;
              "
              >金额合计：<span style="color: rgba(221, 76, 77, 1)"
                >{{ isNumStatus().totalAmount }}元</span
              ></span
            >
            <el-button type="primary" size="mini" @click="handleJumpDetail1()"
              >编辑完成
            </el-button>
          </div>
          <div style="margin-right: 10px"></div>
        </div>
      </div>

      <levelDialog ref="levelDialog" @levelChange="levelChange"></levelDialog>
      <editSalesDialog
        ref="editSalesDialog"
        @editSalesChange="editSalesChange"
      ></editSalesDialog>
      <weighingDialog
        ref="weighingDialog"
        @weighingChange="weighingChange"
      ></weighingDialog>
      <addHomeBasket
        ref="addHomeBasket"
        @addHomeChange="addHomeChange"
      ></addHomeBasket>
      <emptyBasket
        ref="emptyBasket"
        @emptyBasketChange="emptyBasketChange"
      ></emptyBasket>
      <emptyBasket
        ref="emptyBasket1"
        @emptyBasketChange="emptyBasketChange1"
      ></emptyBasket>
      <vacancyBasket
        ref="vacancyBasket"
        @vacancyBasketChange="vacancyBasketChange"
      ></vacancyBasket>
      <vacancyBasket
        ref="vacancyBasket1"
        @vacancyBasketChange="vacancyBasketChange1"
      ></vacancyBasket>
    </div>
  </PageNoScroll>
</template>

<script>
import { productBatch } from "@/request/api/commodity/index";

export default {
  name: "editSalesCommodity",
  components: {
    levelDialog: () => import("./dialog/levelDialog.vue"), // 级别
    editSalesDialog: () => import("./dialog/editSalesDialog.vue"), // 选择批次
    weighingDialog: () => import("./dialog/weighingDialog.vue"), // 批量过磅
    addHomeBasket: () => import("./dialog/addHomeBasket.vue"), // 使用载货筐子
    emptyBasket: () => import("./dialog/emptyBasket.vue"), // 使用空筐过磅
    vacancyBasket: () => import("./dialog/vacancyBasket.vue"), // 使用空置筐子
  },
  data() {
    return {
      tableDataLink: {
        editCommodityData: {
          categoryName: "",
          batchinfo: [],
          multipleSelectionList: [],
        },
      },
      form: {
        avgPrice: 0,
        sellPrice: 0,
        pieceUnit: "无",
        purchasenums: 0,
        piecenumber: 0,
        piecenumber1: 0,
        isLoad: 1,
        isRemovePeel: 1,
      },
      rules: {},
      pieceOptions: ["无", "箱", "袋", "盒", "件", "筐(一次性)"],

      tableDataBasket: [],
      tableDataBasket1: [],
      tableDataBasket2: [],
      tableDataBasket3: [],
      tableDataBasket4: [],

      tableData: [],
    };
  },
  methods: {
    getList1() {
      let param = {
        productId: this.tableDataLink.editCommodityData.productid, // 商品ID
        type: 5, // 报溢商品选择批次时传0，其他如单位转换和报损时传1, 2:腾空筐子，3：装筐，4：分拣 5：销售单 6：退货退款单
        pageindex: 1, // 分页-页码
        pagesize: 10, // 分页-大小
      };
      productBatch(param).then((res) => {
        if (res.status == 200) {
          if (res.data.length > 0) {
            this.tableData = res.data[0];
            // console.log(this.tableData);
          }
        }
      });
    },
    handleRouter() {
      let path = this.tableDataLink.fullPath || "/commodityManage/addCommodity";
      this.$closePage(path);
    },
    levelChange(val) {
      this.tableDataLink.editCommodityData.spec = val.specname;
    },
    editSalesChange(val) {
      this.$set(
        this.tableDataLink.editCommodityData,
        "multipleSelectionList",
        val
      );
      // console.log(this.tableDataLink.editCommodityData.multipleSelectionList);
    },
    weighingChange(val) {
      this.$set(this.form, "purchasenums", val.purchasenums);
      this.$set(this.form, "piecenumber", val.piecenumber);
      this.$set(this.form, "piecenumber1", val.piecenumber1);
    },
    addHomeChange(val) {
      this.form.avgPrice = val.avgPrice;
      if (this.tableDataBasket.length > 0) {
        this.tableDataBasket.push(...val.padamList);
      } else {
        this.tableDataBasket = val.padamList;
      }
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
    removeData(scope) {
      this.tableDataBasket.splice(scope.$rowIndex, 1);
    },
    removeData1(scope) {
      this.tableDataBasket1.splice(scope.$rowIndex, 1);
    },
    removeData2(scope) {
      this.tableDataBasket2.splice(scope.$rowIndex, 1);
    },
    removeData3(scope) {
      this.tableDataBasket3.splice(scope.$rowIndex, 1);
    },
    removeData4(scope) {
      this.tableDataBasket4.splice(scope.$rowIndex, 1);
    },
    multipleLength() {
      if (this.tableDataLink.editCommodityData.multipleSelectionList) {
        return this.tableDataLink.editCommodityData.multipleSelectionList
          .length;
      } else {
        return 0;
      }
    },
    multipleCount() {
      let batchnumber = 0;
      let basketnumber = 0;
      let piecenumber = 0;

      for (
        let i = 0;
        i < this.tableDataLink.editCommodityData.multipleSelectionList.length;
        i++
      ) {
        const element =
          this.tableDataLink.editCommodityData.multipleSelectionList[i];
        batchnumber += element.batchnumber;
        basketnumber += element.basketnumber;
        piecenumber += element.piecenumber;
      }
      let datas = this.getStock(
        this.tableDataLink.editCommodityData.subunit,
        this.tableDataLink.editCommodityData.subUnit2,
        this.tableDataLink.editCommodityData.subUnit3,
        this.tableDataLink.editCommodityData.pieceunit,
        this.tableDataLink.editCommodityData.subUnit2Weight,
        this.tableDataLink.editCommodityData.subUnit3Weight,
        batchnumber,
        basketnumber,
        piecenumber
      );

      return datas;
    },
    // 金额计算
    isNumStatus() {
      // 筐子重量 = 每一个重量 * 售出筐子
      let weightBasket = 0;
      // 售出筐子总数
      let userBasketCounts = 0;
      // 筐子种类
      let typeBasket = 0;
      // 筐子总金额
      let totalAmountBaskets = 0;
      // 买家筐子数量
      let numberBuyersBasket = 0;
      // 腾空筐子数量
      let basketVacateCount = 0;

      let datas = this.basketStatus();
      // 载货筐子
      if (datas[0] == 1) {
        for (let i = 0; i < this.tableDataBasket.length; i++) {
          const el = this.tableDataBasket[i];
          weightBasket +=
            Number(el.basketWeight) * Number(el.userBasketCount) || 0;
          userBasketCounts += Number(el.userBasketCount) || 0;
          totalAmountBaskets +=
            Number(el.userBasketPrice) * Number(el.userBasketCount) || 0;
          basketVacateCount += Number(el.basketVacateCount) || 0;
          typeBasket += 1;
        }
      }

      // 过磅筐子
      if (datas[1] == 1) {
        for (let i = 0; i < this.tableDataBasket1.length; i++) {
          const el = this.tableDataBasket1[i];
          weightBasket +=
            Number(el.basketWeight) * Number(el.userBasketCount) || 0;
          userBasketCounts += Number(el.userBasketCount) || 0;
          totalAmountBaskets +=
            Number(el.userBasketPrice) * Number(el.userBasketCount) || 0;
          typeBasket += 1;
        }
      }
      // 空置筐子
      if (datas[2] == 1) {
        for (let i = 0; i < this.tableDataBasket2.length; i++) {
          const el = this.tableDataBasket2[i];
          weightBasket +=
            Number(el.basketWeight) * Number(el.userBasketCount) || 0;
          userBasketCounts += Number(el.userBasketCount) || 0;
          totalAmountBaskets +=
            Number(el.userBasketPrice) * Number(el.userBasketCount) || 0;
          typeBasket += 1;
        }
      }
      // 自家筐子
      if (datas[4] == 1) {
        for (let i = 0; i < this.tableDataBasket4.length; i++) {
          const el = this.tableDataBasket4[i];
          weightBasket += el.basketWeight * el.userBasketCount || 0;
          userBasketCounts += el.userBasketCount || 0;
          totalAmountBaskets += el.userBasketPrice * el.userBasketCount || 0;
          typeBasket += 1;
        }
      }
      // 买家筐子
      if (datas[3] == 1) {
        for (let i = 0; i < this.tableDataBasket3.length; i++) {
          const el = this.tableDataBasket3[i];
          numberBuyersBasket += el.userBasketCount;
          typeBasket += 1;
        }
      }

      // 商品金额 = 售价*过磅数量
      let totalAmount = this.form.sellPrice * this.form.purchasenums || 0;
      // 是否去皮
      if (this.form.isRemovePeel == 1) {
        totalAmount =
          this.form.sellPrice * (this.form.purchasenums - weightBasket) || 0;
        if (totalAmount < 0) {
          totalAmount = 0;
        }
      }

      return {
        totalAmount: totalAmount,
        weightBasket: weightBasket,
        userBasketCounts: userBasketCounts,
        typeBasket: typeBasket,
        totalAmountBaskets: totalAmountBaskets,
        numberBuyersBasket: numberBuyersBasket,
        basketVacateCount: basketVacateCount,
      };
    },
    // 单位
    purSubunit() {
      if (!this.tableDataLink.editCommodityData.subunit) {
        return "";
      } else {
        return "元/" + this.tableDataLink.editCommodityData.subunit;
      }
    },
    pieceChange(val) {
      this.form.pieceUnit = val;
    },
    isLoadChange() {
      if (this.form.isLoad == 1) {
        this.form.isLoad = 0;
      } else {
        this.form.isLoad = 1;
      }
    },
    pieceUnitLoad() {
      if (this.form.isLoad == 0) {
        return this.form.pieceUnit;
      } else {
        if (this.form.pieceUnit == "无") {
          return "筐(周转筐)";
        }

        return this.form.pieceUnit + " | " + "筐(周转筐)";
      }
    },
    subWidth() {
      if (this.form.isLoad == 0) {
        if (this.form.pieceUnit == "无") {
          return ["100%", "0", "0%"];
        }
        return ["33%", "33%", "0"];
      } else {
        if (this.form.pieceUnit == "无") {
          return ["50%", "0", "50%"];
        }
        return ["33%", "33%", "33%"];
      }
    },
    basketStatus() {
      // 斤单位
      let isType = [0, 0, 0, 0, 0];
      let num = this.precisionSun();
      if (num != 0) {
        //有载货筐子
        if (this.form.isLoad == 1) {
          // 有计件单位
          if (this.form.pieceUnit != "无") {
            isType = [1, 1, 0, 1, 0];
          } else {
            isType = [1, 1, 0, 1, 0];
          }
        } else {
          // 有计件单位
          if (this.form.pieceUnit != "无") {
            isType = [0, 0, 0, 1, 1];
          } else {
            isType = [0, 0, 0, 1, 1];
          }
        }
      } else {
        //非斤
        //有载货筐子
        if (this.form.isLoad == 1) {
          // 有计件单位
          if (this.form.pieceUnit != "无") {
            isType = [1, 1, 0, 1, 0];
          } else {
            isType = [1, 1, 0, 1, 0];
          }
        } else {
          // 有计件单位
          if (this.form.pieceUnit != "无") {
            isType = [0, 0, 0, 1, 1];
          } else {
            isType = [0, 0, 0, 1, 1];
          }
        }
      }

      return isType;
    },
    baskChange(sco, name, val) {
      this.tableDataBasket[(sco.$rowIndex, name, val)];
      this.tableDataBasket.push({});
      this.tableDataBasket.pop({});
    },
    baskChange1(sco, name, val) {
      this.tableDataBasket1[(sco.$rowIndex, name, val)];
      this.tableDataBasket1.push({});
      this.tableDataBasket1.pop({});
    },
    baskChange2(sco, name, val) {
      this.tableDataBasket2[(sco.$rowIndex, name, val)];
      this.tableDataBasket2.push({});
      this.tableDataBasket2.pop({});
    },
    baskChange3(sco, name, val) {
      this.tableDataBasket3[(sco.$rowIndex, name, val)];
      this.tableDataBasket3.push({});
      this.tableDataBasket3.pop({});
    },
    baskChange4(sco, name, val) {
      this.tableDataBasket4[(sco.$rowIndex, name, val)];
      this.tableDataBasket4.push({});
      this.tableDataBasket4.pop({});
    },
    // 合计
    summaryMethod({ columns, data }) {
      const means = []; // 合计
      columns.forEach((column, columnIndex) => {
        if (columnIndex == 0) {
          means.push("小计 ");
        } else {
          const values = data.map((item) => Number(item[column.property]));
          let numS = 0;
          if (!values.every((value) => isNaN(value))) {
            numS = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          }
          if (column.title == "操作") {
            const values1 = data.map(
              (item) =>
                Number(item.userBasketPrice) * Number(item.userBasketCount)
            );
            let numS1 = 0;
            if (!values1.every((value) => isNaN(value))) {
              numS1 = values1.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
            }

            means[columnIndex] = "筐子金额：" + numS1 + "元";
          } else if (column.title == "腾空筐子") {
            means[columnIndex] = "腾空筐子：" + numS + "个";
          } else if (column.title == "售出筐子") {
            means[columnIndex] = "售出筐子：" + numS + "个";
          } else if (column.title == "筐子过磅") {
            means[columnIndex] = "筐子过磅：" + numS + "个";
          } else {
            means[columnIndex] = "";
          }
        }
      });
      // 返回一个二维数组的表尾合计(不要平均值，你就不要在数组中添加)
      return [means];
    },
    // 合计
    summaryMethod1({ columns, data }) {
      const means = []; // 合计
      columns.forEach((column, columnIndex) => {
        if (columnIndex == 0) {
          means.push("小计 ");
        } else {
          const values = data.map((item) => Number(item[column.property]));
          let numS = 0;
          if (!values.every((value) => isNaN(value))) {
            numS = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          }
          if (column.title == "操作") {
            const values1 = data.map(
              (item) =>
                Number(item.userBasketPrice) * Number(item.userBasketCount)
            );
            let numS1 = 0;
            if (!values1.every((value) => isNaN(value))) {
              numS1 = values1.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
            }
            means[columnIndex] = "筐子金额：" + numS1 + "元";
          } else if (column.title == "留库筐子") {
            means[columnIndex] = "留库筐子：" + numS + "个";
          } else if (column.title == "售出筐子") {
            means[columnIndex] = "售出筐子：" + numS + "个";
          } else if (column.title == "筐子过磅") {
            means[columnIndex] = "筐子过磅：" + numS + "个";
          } else {
            means[columnIndex] = "";
          }
        }
      });
      // 返回一个二维数组的表尾合计(不要平均值，你就不要在数组中添加)
      return [means];
    },
    // 合计
    summaryMethod2({ columns, data }) {
      const means = []; // 合计
      columns.forEach((column, columnIndex) => {
        if (columnIndex == 0) {
          means.push("小计 ");
        } else {
          const values = data.map((item) => Number(item[column.property]));
          let numS = 0;
          if (!values.every((value) => isNaN(value))) {
            numS = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
          }
          if (column.title == "操作") {
            const values1 = data.map(
              (item) =>
                Number(item.userBasketPrice) * Number(item.userBasketCount)
            );
            let numS1 = 0;
            if (!values1.every((value) => isNaN(value))) {
              numS1 = values1.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
            }
            means[columnIndex] = "筐子金额：" + numS1 + "元";
          } else if (column.title == "售出筐子") {
            means[columnIndex] = "售出筐子：" + numS + "个";
          } else {
            means[columnIndex] = "";
          }
        }
      });
      // 返回一个二维数组的表尾合计(不要平均值，你就不要在数组中添加)
      return [means];
    },
    // 小数点判断 斤非斤判断
    precisionSun() {
      if (
        this.tableDataLink.editCommodityData.subunit == "斤" ||
        this.tableDataLink.editCommodityData.subunit == "公斤" ||
        this.tableDataLink.editCommodityData.subunit == "g"
      ) {
        return 2;
      } else {
        return 0;
      }
    },
    // 判断
    precisionSun1() {
      if (
        this.tableDataLink.editCommodityData.subunit == "斤" ||
        this.tableDataLink.editCommodityData.subunit == "公斤" ||
        this.tableDataLink.editCommodityData.subunit == "g" ||
        this.tableDataLink.editCommodityData.subunit == ""
      ) {
        return "过磅数量";
      } else {
        return "销售数量";
      }
    },
    // 判断
    precisionSun2() {
      if (
        this.tableDataLink.editCommodityData.subunit == "斤" ||
        this.tableDataLink.editCommodityData.subunit == "公斤" ||
        this.tableDataLink.editCommodityData.subunit == "g" ||
        this.tableDataLink.editCommodityData.subunit == ""
      ) {
        return "批量过磅";
      } else {
        return "批量计件";
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
    handleJumpDetail1: function () {
      this.tableDataLink.editCommodityData.forms = this.form;
      let datas = this.basketStatus();
      datas[0] == 1
        ? (this.tableDataLink.editCommodityData.tableDataBasket =
            this.tableDataBasket)
        : "";
      datas[1] == 1
        ? (this.tableDataLink.editCommodityData.tableDataBasket1 =
            this.tableDataBasket1)
        : "";
      datas[2] == 1
        ? (this.tableDataLink.editCommodityData.tableDataBasket2 =
            this.tableDataBasket2)
        : "";
      datas[3] == 1
        ? (this.tableDataLink.editCommodityData.tableDataBasket4 =
            this.tableDataBasket4)
        : "";
      datas[4] == 1
        ? (this.tableDataLink.editCommodityData.tableDataBasket3 =
            this.tableDataBasket3)
        : "";

      this.tableDataLink.editCommodityData;
      this.tableDataLink.editCommodityData = {
        ...this.tableDataLink.editCommodityData,
        ...this.isNumStatus(),
      };

      console.log(this.tableDataLink.editCommodityData);

      this.$closePage("addSalesTicket", {
        data: JSON.stringify(this.tableDataLink.editCommodityData),
      });
    },
    // 刷新
    hanleRefresh() {
      this.getList(1);
    },
    // 触发子组件编辑按钮
    handleEdit(form, title, record) {
      this.$refs[form].edit(record);
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
      let next4 = pieceunit == "" ? "" : "(" + piececount + pieceunit + ")";
      let last =
        basket == 0
          ? ""
          : "|" + basket + '<font style="color:#DF971A;">筐</font>';
      let kuohao1 = subunit2 == "" ? "" : "(";
      let kuohao2 = subunit2 == "" ? "" : ")";
      return first + kuohao1 + next3 + next2 + kuohao2 + next4 + last;
    },
    rowClass({ $rowIndex, column, columnIndex, $columnIndex }) {
      if ($columnIndex == 0) {
        return "color:#0BA198";
      } else {
        return "color:rgba(1, 6, 33, 0.90)";
      }
    },
  },
  //进入页面触发
  beforeRouteEnter(to, form, next) {
    next((vm) => {
      if (form.path == "/orderManagement/addSalesCommodity") {
        let data = vm.$route.query;
        vm.tableDataLink.editCommodityData = data.tableDataList[0];
      } else {
        let { data: data } = vm.$route.query;
        vm.tableDataLink = JSON.parse(data);

        if (vm.tableDataLink.editCommodityData.forms != undefined) {
          vm.form = vm.tableDataLink.editCommodityData.forms;
        }
        if (vm.tableDataLink.editCommodityData.tableDataBasket != undefined) {
          vm.tableDataBasket =
            vm.tableDataLink.editCommodityData.tableDataBasket;
        }
        if (vm.tableDataLink.editCommodityData.tableDataBasket1 != undefined) {
          vm.tableDataBasket1 =
            vm.tableDataLink.editCommodityData.tableDataBasket1;
        }
        if (vm.tableDataLink.editCommodityData.tableDataBasket2 != undefined) {
          vm.tableDataBasket2 =
            vm.tableDataLink.editCommodityData.tableDataBasket2;
        }
        if (vm.tableDataLink.editCommodityData.tableDataBasket3 != undefined) {
          vm.tableDataBasket3 =
            vm.tableDataLink.editCommodityData.tableDataBasket3;
        }
        if (vm.tableDataLink.editCommodityData.tableDataBasket4 != undefined) {
          vm.tableDataBasket4 =
            vm.tableDataLink.editCommodityData.tableDataBasket4;
        }
      }
      vm.getList1();
    });
  },
};
</script>


<style lang="scss" scoped>
.addCommoditymodel {
  .fication1:hover {
    color: var(--default-color);
  }

  .header-page {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;

    .header-left {
      .header-left-content {
        display: flex;
        align-items: center;

        .header-lf-title {
          margin-right: 60px;

          .header-lf-word {
            display: flex;
            align-items: center;
            font-size: 16px;
            color: rgba(1, 6, 33, 0.9);
            margin-bottom: 5px;

            .header-icon {
              margin-left: 6px;
              border: none;

              &::after {
                content: "";
                display: block;
                width: 16px;
                height: 16px;
                background: url("../../assets/image/imgs/question-circle@2x.png")
                  no-repeat center / 100%;
              }
            }
          }

          .header-lf-num {
            font-size: 24px;
            color: rgba(1, 6, 33, 0.9);
          }
        }
      }
    }
  }

  .addCommoditysearch {
    // padding: 16px 0px 26px 0px;
    // border-bottom: 1px solid #e9e9e9;

    .search-form-border {
      display: inline-block;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      // margin-right: 24px;

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

  .addCommoditytable {
    ::v-deep .el-tabs__header {
      margin: 0px;
    }

    .utable {
      width: 100%;
      border-left: 1px solid #e9e9e9;
      border-right: 1px solid #e9e9e9;
    }

    .paging {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      padding-top: 10px;
      padding-bottom: 5px;
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
}
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
</style>

<style lang="scss">
.addCommoditymodel {
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