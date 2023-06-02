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
              <el-row>
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >商品毛重：</span
                  ><span
                    style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                    v-html="
                      getStock(
                        tableDataLink.editCommodityData.subunit,
                        tableDataLink.editCommodityData.subUnit2,
                        tableDataLink.editCommodityData.subUnit3,
                        form.pieceUnit,
                        tableDataLink.editCommodityData.subUnit2Weight,
                        tableDataLink.editCommodityData.subUnit3Weight,
                        form.purchasenums,
                        form.piecenumber1,
                        form.piecenumber
                      )
                    "
                  ></span
                ></el-col>
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >筐子重量：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                    >{{ tableDataLink.editCommodityData.weightBasket
                    }}{{ tableDataLink.editCommodityData.subunit }}</span
                  ></el-col
                >
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >商品净重：</span
                  ><span
                    style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                    v-html="
                      getStock(
                        tableDataLink.editCommodityData.subunit,
                        tableDataLink.editCommodityData.subUnit2,
                        tableDataLink.editCommodityData.subUnit3,
                        form.pieceUnit,
                        tableDataLink.editCommodityData.subUnit2Weight,
                        tableDataLink.editCommodityData.subUnit3Weight,
                        form.purchasenums -
                          tableDataLink.editCommodityData.weightBasket,
                        form.piecenumber1,
                        form.piecenumber
                      )
                    "
                  ></span>
                </el-col>
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >商品单价：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                    >{{ form.sellPrice }}元/{{
                      tableDataLink.editCommodityData.subunit
                    }}</span
                  ></el-col
                >
                <el-col :span="4"
                  ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >商品金额：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                    >{{ tableDataLink.editCommodityData.totalAmount }}元</span
                  ></el-col
                >
              </el-row>
            </div>
          </div>

          <div>
            <div style="padding-bottom: 10px">
              <div v-if="tableDataBasket.length > 0">
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
                      <span class="my-input-sc">{{
                        scope.row.basketWeight
                      }}</span>
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
                      <span class="my-input-sc">{{
                        scope.row.basketCargo
                      }}</span>

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
                      <span class="my-input-sc">{{
                        scope.row.userBasketPrice
                      }}</span>
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
                      <span class="my-input-sc">{{
                        scope.row.outsellBasketCount
                      }}</span>
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
                      <span class="my-input-sc">{{
                        scope.row.userBasketCount
                      }}</span>
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
                      <span class="my-input-sc">{{
                        scope.row.basketVacateCount
                      }}</span>
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
                </ux-grid>
              </div>
              <div style="margin-top: 10px" v-if="tableDataBasket1.length > 0">
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
                      <span class="my-input-sc">{{
                        scope.row.basketWeight
                      }}</span>

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
                      <span class="my-input-sc">{{
                        scope.row.basketCargo
                      }}</span>
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
                      <span class="my-input-sc">{{
                        scope.row.userBasketPrice
                      }}</span>
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
                      <span class="my-input-sc">{{
                        scope.row.outsellBasketCount
                      }}</span>
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
                      <span class="my-input-sc">{{
                        scope.row.userBasketCount
                      }}</span>
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
                      <span class="my-input-sc">{{
                        scope.row.basketVacateCount
                      }}</span>
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
                </ux-grid>
              </div>
              <div style="margin-top: 10px" v-if="tableDataBasket2.length > 0">
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
            <div style="margin-top: 10px" v-if="tableDataBasket4.length > 0">
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
                    <span class="my-input-sc">{{
                      scope.row.basketWeight
                    }}</span>
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
                    <span class="my-input-sc">{{ scope.row.basketCargo }}</span>
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
                    <span class="my-input-sc">{{
                      scope.row.userBasketPrice
                    }}</span>
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
                    <span class="my-input-sc">{{
                      scope.row.outsellBasketCount
                    }}</span>
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
                    <span class="my-input-sc">{{
                      scope.row.userBasketCount
                    }}</span>
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
                    <span class="my-input-sc">{{
                      scope.row.basketVacateCount
                    }}</span>
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
              </ux-grid>
            </div>
            <div style="margin-top: 10px" v-if="tableDataBasket3.length > 0">
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
                    <span class="my-input-sc">{{ scope.row.basketCargo }}</span>
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
                    <span class="my-input-sc">{{
                      scope.row.userBasketCount
                    }}</span>
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
              </ux-grid>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </PageNoScroll>
</template>

<script>
export default {
  name: "editSalesCommodityDetail",
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
      pieceOptions: ["无", "箱", "袋", "盒", "件", "筐(一次性)"],

      tableDataBasket: [],
      tableDataBasket1: [],
      tableDataBasket2: [],
      tableDataBasket3: [],
      tableDataBasket4: [],
    };
  },
  methods: {
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

    // 刷新
    hanleRefresh() {
      this.getList(1);
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