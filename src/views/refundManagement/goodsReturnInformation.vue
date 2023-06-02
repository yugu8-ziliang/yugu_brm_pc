<template>
  <!-- 退货信息 -->
  <Page :title="pageTitle" class="page_change">
    <!-- 退货信息 -->
    <div v-if="isShow">
      <!-- 客户信息 -->
      <el-descriptions title="客户信息" :column="4">
        <el-descriptions-item label="客户姓名" class="informatTitle">
          <span class="informatContent">{{ getUserMsg.fromUserName }}</span>
          <el-tag type="info" v-if="getUserMsg.type == 1">非</el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="联系电话" class="informatTitle">
          <span class="informatContent">{{ getUserMsg.fromUserPhone }}</span>
        </el-descriptions-item>
      </el-descriptions>
      <!--  订单信息   采购单信息 -->
      <el-descriptions
        v-if="getrefundMsg.radio == '商品采购单'"
        title="采购单信息"
        :column="5"
        class="informatOrder"
      >
        <el-descriptions-item label="采购单编号" class="informatTitle">
          <span
            class="informatColor"
            @click="
              handleJumpDetail('/orderManagement/purchaseOrdersDetail', {
                id: getUserMsg.id,
                is_buy: 1,
                type: getUserMsg.type == 1 ? 1 : 0,
              })
            "
          >
            {{ getUserMsg.ordersellId }}
            <i class="el-icon-arrow-right"></i
          ></span>
        </el-descriptions-item>
        <el-descriptions-item label="采购单状态" class="informatTitle">
          <font color="#DF971A" v-if="getUserMsg.status == 1">待确认</font>
          <font color="#DF971A" v-if="getUserMsg.status == 3">待对方收款</font>
          <font color="#DD4C4D" v-if="getUserMsg.status == 4">未结清</font>
          <font color="#248B39" v-if="getUserMsg.status == 5">已结清</font>
        </el-descriptions-item>
        <el-descriptions-item label="采购商品金额" class="informatTitle">
          <span class="informatContent">{{
            moneyFormatTwo(getUserMsg.productTotalPrice) + "元"
          }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="已退金额" class="informatTitle">
          <span class="informatContent">{{
            moneyFormatTwo(getUserMsg.retiredPrice) + "元"
          }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="剩余可退金额" class="informatTitle">
          <span class="informatContent">{{
            moneyFormatTwo(getUserMsg.remainingRefundable) + "元"
          }}</span>
        </el-descriptions-item>
      </el-descriptions>
      <!--  订单信息   销售单信息 -->
      <el-descriptions
        v-if="getrefundMsg.radio == '商品销售单' && getrefundMsg.ispt == '1'"
        title="销售单信息"
        :column="5"
        class="informatOrder"
      >
        <el-descriptions-item label="销售单编号" class="informatTitle">
          <span
            class="informatColor"
            @click="
              handleJumpDetail('/orderManagement/commoditySalesOrderDetail', {
                id: getUserMsg.id,
              })
            "
          >
            {{ getUserMsg.ordersellId }}
            <i class="el-icon-arrow-right"></i
          ></span>
        </el-descriptions-item>
        <el-descriptions-item label="销售单状态" class="informatTitle">
          <font color="#DF971A" v-if="getUserMsg.status == 1">待对方确认</font>
          <font color="#DF971A" v-if="getUserMsg.status == 2">待修改</font>
          <font color="#DF971A" v-if="getUserMsg.status == 3">待对方收款</font>
          <font color="#DD4C4D" v-if="getUserMsg.status == 4">未结清</font>
          <font color="#248B39" v-if="getUserMsg.status == 5">已结清</font>
        </el-descriptions-item>
        <el-descriptions-item label="销售商品金额" class="informatTitle">
          <span class="informatContent">{{
            moneyFormatTwo(getUserMsg.productTotalPrice) + "元"
          }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="已退金额" class="informatTitle">
          <span class="informatContent">{{
            moneyFormatTwo(getUserMsg.retiredPrice) + "元"
          }}</span>
        </el-descriptions-item>
        <el-descriptions-item label="剩余可退金额" class="informatTitle">
          <span class="informatContent">{{
            moneyFormatTwo(getUserMsg.remainingRefundable) + "元"
          }}</span>
        </el-descriptions-item>
      </el-descriptions>

      <!-- 退款商品部分 -->
      <div class="informatOrder">
        <span class="informatRefund">退款商品</span>
        <el-button
          type="primary"
          size="mini"
          icon="el-icon-plus"
          @click="goodsReturnBtn()"
        >
          选择退货商品</el-button
        >
        <div
          class="informatRefund_style"
          v-for="(item, index) in tableData"
          :key="index"
        >
          <div>
            <div class="flex_dom flex_item_between flex_item_mid">
              <div class="informatRefund">
                {{
                  item.catgoryfirstName +
                  "-" +
                  item.categorysecondName +
                  "-" +
                  item.name
                }}
              </div>
              <div class="flex_dom flex_item_mid">
                <el-button type="text" size="mini" @click="handleRemove(index)"
                  >移除</el-button
                >
                <div class="lineH14"></div>
                <el-button type="text" size="mini" @click="handleEdit(index)"
                  >编辑</el-button
                >
                <div class="lineH14"></div>
                <el-button type="text" size="mini" @click="handleDetail()"
                  >详情</el-button
                >
              </div>
            </div>
            <div>
              <div class="contentRefund">
                <el-row>
                  <el-col :span="6"
                    ><span class="informatTitle">品种/品牌：</span
                    ><span class="informatContent">{{
                      item.variety
                    }}</span></el-col
                  >
                  <el-col :span="6"
                    ><span class="informatTitle">产地：</span
                    ><span class="informatContent">{{
                      item.region
                    }}</span></el-col
                  >
                  <el-col :span="6"
                    ><span class="informatTitle">级别/规格：</span
                    ><span class="informatContent">{{
                      item.spec
                    }}</span></el-col
                  >
                  <el-col :span="6"
                    ><span class="informatTitle">计算单位：</span
                    ><span class="informatContent">{{
                      item.subUnit
                    }}</span></el-col
                  >
                </el-row>
                <el-row v-if="item.editMsg" class="informatOrder">
                  <el-col :span="6"
                    ><span class="informatTitle"
                      >退货数量：<span class="informatContent"
                        >{{ item.editMsg.purchasenums + item.subUnit }}|{{
                          item.editMsg.piecenumber1
                        }}<span class="informatColor1">筐</span></span
                      ></span
                    >
                  </el-col>
                  <el-col :span="6"
                    ><span class="informatTitle">退货单价：</span
                    ><span class="informatContent"
                      >{{ item.editMsg.refondPrice }}元/{{ item.subUnit }}</span
                    ></el-col
                  >
                  <el-col :span="6"
                    ><span class="informatContent">商品金额：</span
                    ><span class="informatColor2"
                      >{{
                        moneyFormatTwo(
                          item.editMsg.purchasenums * item.editMsg.refondPrice
                        )
                      }}元</span
                    ></el-col
                  >
                </el-row>
                <el-row
                  class="informatOrder"
                  v-if="item.editMsg && item.editMsg.zhonglei > 0"
                >
                  <el-col :span="6"
                    ><span class="informatTitle">筐子种类：</span
                    ><span class="informatContent"
                      >{{ item.editMsg.zhonglei }}种</span
                    ></el-col
                  >
                  <el-col :span="6"
                    ><span class="informatTitle">退回筐子：</span
                    ><span class="informatContent"
                      >{{ item.editMsg.tuihui }}个</span
                    ></el-col
                  >
                  <el-col :span="6"
                    ><span class="informatContent">筐子金额：</span
                    ><span class="informatColor2"
                      >{{ moneyFormatTwo(item.editMsg.jine) }}元</span
                    ></el-col
                  >
                </el-row>

                <div class="subtotal_Sty" v-if="item.editMsg">
                  <div class="subtotal_Seat">
                    <span>金额小计：</span
                    ><span class="informatColor2"
                      >{{
                        moneyFormatTwo(
                          item.editMsg.purchasenums * item.editMsg.refondPrice +
                            item.editMsg.jine
                        )
                      }}元</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 合计 -->
        <div class="informatAmount" v-if="tableData.length > 0">
          <span class="informatRefund">合计</span>
          <div class="contentRefund1">
            <el-row>
              <el-col :span="4"
                ><span class="informatTitle">商品种类：</span
                ><span class="informatContent"
                  >{{ tableData.length || 0 }}种</span
                ></el-col
              >
              <el-col :span="20"
                ><span class="informatContent">商品金额：</span
                ><span class="informatColor2"
                  >{{ moneyFormatTwo(basketType().productTotalPrice) }}元</span
                ></el-col
              >
            </el-row>
            <el-row v-if="basketType().refundBasket > 0" class="informatOrder">
              <el-col :span="4"
                ><span class="informatTitle">退回筐子：</span
                ><span class="informatContent"
                  >{{ basketType().refundBasket }}个</span
                ></el-col
              >
              <el-col :span="20"
                ><span class="informatContent">筐子金额：</span
                ><span class="informatColor2"
                  >{{ moneyFormatTwo(basketType().amountBasket) }}元</span
                ></el-col
              >
            </el-row>
          </div>

          <div class="subtotal_Sty">
            <div class="subtotal_Seat">
              <span class="informatContent1">退款金额合计：</span
              ><span class="informatColor2"
                >{{
                  moneyFormatTwo(
                    basketType().productTotalPrice + basketType().amountBasket
                  )
                }}元</span
              >
            </div>
          </div>
        </div>

        <!-- 运输信息部分 -->
        <div class="informatAmount">
          <span class="informatRefund">运输信息</span>
        </div>
        <div style="padding: 10px 0px">
          <el-form
            :model="ruleForm"
            label-width="80px"
            class="demo-ruleForm"
            label-position="left"
            size="small"
          >
            <el-form-item
              label="车牌号："
              prop="transinfo1"
              class="informatContent"
            >
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
                      color: transinfo1 == item.name ? '#fff' : '',
                      background:
                        transinfo1 == item.name ? 'var(--color-primary)' : '',
                    }"
                    @click="transinfoClick(item)"
                    >{{ item.name }}</span
                  >
                </div>

                <el-button
                  @click="transinfovisible = !transinfovisible"
                  slot="reference"
                  style="width: 85px; text-align: left"
                  >{{ transinfo1 || "请选择"
                  }}<i
                    class="el-icon-arrow-down el-icon--right"
                    style="float: right"
                  ></i
                ></el-button>
              </el-popover>

              <el-select
                :class="['select2', lineValue == 2 ? 'lineValue2' : '']"
                style="width: 250px"
                v-model="transinfo2"
                placeholder="请选择"
                @focus="lineFocus(2)"
                filterable
                remote
                :remote-method="transinfoRemoteMethod1"
              >
                <el-option
                  v-for="(item, index) in transportNumber"
                  :key="index"
                  :label="item.label1"
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
              label-width="100"
            >
              <div class="flex_dom informatOrder">
                <i
                  slot="reference"
                  class="el-icon-warning-outline informatPhoto"
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
                  :file-list="transimageList"
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

        <!-- 备注部分 -->
        <div>
          <span class="informatRefund">备注</span>
          <div class="contentRefund">
            <el-input
              type="textarea"
              placeholder="请输入内容"
              maxlength="200"
              v-model="remark"
              :rows="4"
              style="width: 450px"
            >
            </el-input>
          </div>
        </div>
      </div>
      <div class="page_footer">
        <el-button type="primary" @click="makeSure1">确认退货退款</el-button>
      </div>
    </div>

    <!-- 编辑退货信息 -->
    <div v-if="!isShow">
      <!--  商品信息 -->
      <div>
        <div class="informatRefund">商品信息</div>
        <div class="informatRefund contentRefund1">
          {{
            tableData[this.editindex].catgoryfirstName +
            "-" +
            tableData[this.editindex].categorysecondName +
            "-" +
            tableData[this.editindex].name
          }}
        </div>
        <div class="editgoodRefund">
          <el-row>
            <el-col :span="6"
              ><span class="informatTitle">品种/品牌：</span
              ><span class="informatContent">{{
                tableData[this.editindex].variety
              }}</span></el-col
            >
            <el-col :span="6"
              ><span class="informatTitle">产地：</span
              ><span class="informatContent">{{
                tableData[this.editindex].region
              }}</span></el-col
            >
            <el-col :span="6"
              ><span class="informatTitle">级别/规格：</span
              ><span class="informatContent">{{
                tableData[this.editindex].spec
              }}</span></el-col
            >
            <el-col :span="6"
              ><span class="informatTitle">计算单位：</span
              ><span class="informatContent">{{
                tableData[this.editindex].subUnit
              }}</span></el-col
            >
          </el-row>
        </div>
      </div>
      <div class="editRefund" v-if="getrefundMsg.radio == '商品采购单'">
        <el-row>
          <el-col :span="7"
            ><span class="informatTitle">当前批次：</span>
            <span style="margin: auto">
              <el-image class="elimage" :src="url"></el-image>
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
            <el-image class="elimage" :src="url"></el-image>
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
                  tableData[this.editindex].goodsCount,
                  tableData[this.editindex].returnBasketCount,
                  tableData[this.editindex].productPieceCount
                )
              "
            ></span
          ></el-col>
          <el-col :span="8"
            ><span class="informatTitle">已选批次：</span>
            <span class="informatContent" v-html="showBatchCount()"></span>
            <el-button
              type="primary"
              size="mini"
              plain
              class="btn_Seat"
              icon="el-icon-plus"
              @click="batchBtn()"
              >选择批次</el-button
            ></el-col
          >
        </el-row>
      </div>
      <div
        v-if="linshiSelection.length > 0 || getrefundMsg.radio == '商品销售单'"
      >
        <div class="editRefund" v-if="getrefundMsg.radio == '商品销售单'">
          <el-row>
            <el-col :span="5"
              ><span class="informatTitle">可退货数量：</span>
              <el-tooltip class="item" effect="dark" placement="bottom">
                <div slot="content">
                  可退货数量=销售单(当前商品数量)-(已成交+未
                  <br />
                  成交在途)退货退款单(当前商品数量)
                </div>
                <el-image class="elimage" :src="url"></el-image>
              </el-tooltip>
              <span
                class="informatContent"
                v-html="
                  getStock(
                    tableData[this.editindex].subUnit,
                    tableData[this.editindex].subUnit2,
                    tableData[this.editindex].subUnit3,
                    tableData[this.editindex].pieceUnit,
                    tableData[this.editindex].subUnit2Weight,
                    tableData[this.editindex].subUnit3Weight,
                    tableData[this.editindex].goodsCount,
                    tableData[this.editindex].returnBasketCount,
                    tableData[this.editindex].productPieceCount
                  )
                "
              ></span
            ></el-col>
          </el-row>
        </div>
        <div>
          <div class="editgoodRefund">
            <span
              class="informatTitle"
              v-if="getrefundMsg.radio == '商品采购单'"
              >采购单价：</span
            >
            <span
              class="informatTitle"
              v-if="getrefundMsg.radio == '商品销售单'"
              >销售单价：</span
            >
            <span class="informatContent">
              {{ moneyFormatTwo(tableData[this.editindex].productPrice)
              }}{{ purSubunit() }}</span
            >
          </div>
          <!-- 编辑页表单模块 -->
          <!-- 商品采购单 -->
          <el-form
            v-if="getrefundMsg.radio == '商品采购单'"
            style="width: 600px"
            label-position="left"
            :model="ruleForm"
            ref="ruleForm"
            label-width="120px"
            size="small"
          >
            <el-form-item label="退货单价：" required>
              <el-input
                type="text"
                oninput="value=value.replace(/[^0-9.]/g,'')"
                v-model="ruleForm.refondPrice"
                placeholder="请填写退货单价"
              ></el-input>
              <span class="refond_Price">{{ purSubunit() }}</span>
              <span
                v-if="
                  ruleForm.refondPrice > tableData[this.editindex].productPrice
                "
                class="refond_Rules"
              >
                退货单价不得大于采购单价
              </span>
            </el-form-item>
            <el-form-item label="选择计件单位：" required>
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
                        tableDataList.pieceunit ? tableDataList.pieceunit : "无"
                      }}
                    </el-tag>
                  </div>
                  <div>选择装载物</div>
                  <div style="padding: 5px 0px">
                    <el-tag
                      :class="{ change_tag: isshowtag }"
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
              <div class="flex_dom flex_item_mid">
                <span class="search-form-border">
                  <el-input
                    oninput="value=value.replace(/[^0-9]/g,'')"
                    :style="{ width: subWidth()[0] }"
                    v-model="ruleForm.purchasenums"
                    placeholder="请输入"
                  >
                    <span slot="suffix" class="informatContent">{{
                      tableDataList.subunit
                    }}</span>
                  </el-input>
                  <el-input
                    v-if="tableDataList.pieceunit != ''"
                    :style="{ width: subWidth()[1] }"
                    v-model="ruleForm.piecenumber"
                    placeholder="请输入"
                    ><span slot="suffix" class="informatContent">{{
                      tableDataList.pieceunit
                    }}</span></el-input
                  >
                  <el-input
                    v-if="isshowtag"
                    :style="{ width: subWidth()[2] }"
                    v-model="ruleForm.piecenumber1"
                    placeholder="请输入"
                    ><span slot="suffix" class="informatColor1"
                      >筐</span
                    ></el-input
                  >
                </span>
                <el-button
                  type="text"
                  size="mini"
                  class="btn_Seat"
                  @click="
                    handleTankuang('weighingDialog', '批量过磅', {
                      tableDataList: tableDataList,
                      goodsMsg: tableData[this.editindex],
                      ruleForm,
                    })
                  "
                  >{{ precisionSun2() }}</el-button
                >
              </div>
            </el-form-item>
          </el-form>
          <!-- 商品销售单 -->
          <el-form
            v-if="getrefundMsg.radio == '商品销售单'"
            style="width: 600px"
            label-position="left"
            :model="ruleForm"
            ref="ruleForm"
            label-width="120px"
            size="small"
          >
            <el-form-item label="退货单价：" required>
              <el-input
                type="text"
                oninput="value=value.replace(/[^0-9.]/g,'')"
                v-model="ruleForm.refondPrice"
                placeholder="请填写退货单价"
              ></el-input>
              <span class="refond_Price">{{ purSubunit() }}</span>
              <span
                v-if="
                  ruleForm.refondPrice > tableData[this.editindex].productPrice
                "
                class="refond_Rules"
              >
                退货单价不得大于销售单价
              </span>
            </el-form-item>
            <el-form-item label="选择计件单位：" required>
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
                        tableData[this.editindex].pieceUnit
                          ? tableData[this.editindex].pieceUnit
                          : "无"
                      }}
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
              <div class="flex_dom flex_item_mid">
                <span class="search-form-border">
                  <el-input
                    oninput="value=value.replace(/[^0-9]/g,'')"
                    :style="{ width: subWidth1()[0] }"
                    v-model="ruleForm.purchasenums"
                    placeholder="请输入"
                  >
                    <span slot="suffix" class="informatContent">{{
                      tableData[this.editindex].subUnit
                    }}</span>
                  </el-input>
                  <el-input
                    v-if="tableData[this.editindex].pieceUnit != ''"
                    :style="{ width: subWidth1()[1] }"
                    v-model="ruleForm.piecenumber"
                    placeholder="请输入"
                    ><span slot="suffix" class="informatContent">{{
                      tableData[this.editindex].pieceUnit
                    }}</span></el-input
                  >
                  <el-input
                    v-if="isshowtag1"
                    :style="{ width: subWidth1()[2] }"
                    v-model="ruleForm.piecenumber1"
                    placeholder="请输入"
                    ><span slot="suffix" class="informatColor1"
                      >筐</span
                    ></el-input
                  >
                </span>
                <el-button
                  type="text"
                  size="mini"
                  class="btn_Seat"
                  @click="
                    handleTankuang('weighingDialog', '批量过磅', {
                      tableDataList: tableDataList,
                      goodsMsg: tableData[this.editindex],
                      ruleForm,
                    })
                  "
                  >{{ precisionSun2() }}</el-button
                >
              </div>
            </el-form-item>
          </el-form>
          <div class="flex_dom flex_item_between flex_item_mid subtotal_Sty1">
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
            <div>
              <!-- 采购单，有筐-使用载货筐子 -->
              <el-button
                v-if="
                  tableDataList.basketcount > 0 &&
                  getrefundMsg.radio == '商品采购单'
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
                  getrefundMsg.radio == '商品采购单'
                "
                size="mini"
                class="but_sty"
                icon="el-icon-plus"
                @click="
                  handleTankuang('emptyBasket', '使用空筐过磅', {
                    isSataus: 'empty',
                    getUserMsg: getUserMsg,
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
                  getrefundMsg.radio == '商品采购单'
                "
                size="mini"
                class="but_sty"
                icon="el-icon-plus"
                @click="
                  handleTankuang('vacancyBasket', '使用空置筐子', {
                    isSataus: 'vacancy',
                    getUserMsg: getUserMsg,
                    ruleForm,
                  })
                "
                >使用空置筐子</el-button
              >
            </div>
          </div>
          <div>
            <div
              v-if="
                tableDataList.basketcount > 0 &&
                getrefundMsg.radio == '商品采购单'
              "
            >
              <el-table
                v-if="tableDataBasket.length > 0"
                header-row-class-name="header_sty"
                ref="plxTable"
                :data="tableDataBasket"
                class="eltable"
              >
                <el-table-column
                  :render-header="carry_basket"
                  prop="basketname"
                  label="载货筐子"
                  width="180"
                >
                  <template slot-scope="scope">
                    <span>{{
                      "[" + scope.row.basketType + "]" + scope.row.basketname
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="basketcolor" label="颜色">
                  <template slot-scope="scope">
                    <span>{{ scope.row.basketcolor }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="userbasketnumber" label="数量">
                  <template slot-scope="scope">
                    <span>{{ scope.row.userbasketnumber }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :render-header="numRenderHeader1"
                  prop="basketWeight"
                  label="重量"
                >
                  <template slot-scope="scope">
                    <el-input
                      @input="(val) => baskChange(scope, 'basketWeight', val)"
                      v-model="scope.row.basketWeight"
                      :disabled="isAciont()"
                      placeholder=""
                      class="input_wid"
                      size="mini"
                    ></el-input>
                    <span class="input_sty"
                      >{{ tableDataList.subunit }}/个</span
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  :render-header="numRenderHeader2"
                  prop="basketCargo"
                  label="载货量"
                >
                  <template slot-scope="scope">
                    <el-input
                      @input="(val) => baskChange(scope, 'basketCargo', val)"
                      v-model="scope.row.basketCargo"
                      placeholder=""
                      class="input_wid"
                      size="mini"
                    ></el-input>
                    <span class="input_sty"
                      >{{ tableDataList.subunit }}/筐</span
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  :render-header="numRenderHeader1"
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
                      class="input_wid"
                      size="mini"
                    ></el-input>
                    <span class="input_sty">元/个 </span>
                  </template>
                </el-table-column>
                <el-table-column
                  :render-header="numRenderHeader1"
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
                        ><font class="input_sty1">个</font></template
                      >
                    </el-input>
                    <el-popover
                      v-if="scope.row.basketCount > scope.row.userbasketnumber"
                      placement="top-end"
                      trigger="hover"
                    >
                      <p>
                        筐子过磅超出库存载货{{
                          scope.row.userbasketnumber
                        }}个,<el-button
                          class="informatColor"
                          type="text"
                          @click="overflowBtn(scope.row)"
                          >请选择报溢批次＞</el-button
                        >
                      </p>
                      <i
                        slot="reference"
                        class="el-icon-warning-outline informatColor2"
                      ></i>
                    </el-popover>
                  </template>
                </el-table-column>
                <el-table-column
                  :render-header="numRenderHeader1"
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
                      class="input_wid"
                      size="mini"
                    ></el-input>
                    <span class="input_sty">个 </span>
                  </template>
                </el-table-column>
                <el-table-column
                  :render-header="numRenderHeader1"
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
                      class="input_wid"
                      size="mini"
                    ></el-input>
                    <span class="input_sty">个 </span>
                  </template>
                </el-table-column>
                <el-table-column prop=" " label="操作" width="150">
                  <template slot-scope="scope">
                    <span class="yc_btn_sty" @click="removeData(scope)"
                      >移除</span
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="informatOrder" v-if="tableDataBasket1.length > 0">
              <el-table
                header-row-class-name="header_sty"
                ref="plxTable"
                :data="tableDataBasket1"
                class="eltable"
              >
                <el-table-column
                  :render-header="carry_basket"
                  prop="basektName"
                  label="过磅筐子"
                  width="180"
                >
                  <template slot-scope="scope">
                    <span>{{
                      "[" + scope.row.basketType + "]" + scope.row.basektName
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="basketColor" label="颜色">
                  <template slot-scope="scope">
                    <span>{{ scope.row.basketColor }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :render-header="numRenderHeader1"
                  prop="basketWeight"
                  label="重量"
                >
                  <template slot-scope="scope">
                    <el-input
                      @input="(val) => baskChange1(scope, 'basketWeight', val)"
                      v-model="scope.row.basketWeight"
                      placeholder=""
                      :disabled="isAciont()"
                      class="input_wid"
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
                  :render-header="numRenderHeader2"
                >
                  <template slot-scope="scope">
                    <el-input
                      @input="(val) => baskChange1(scope, 'basketCargo', val)"
                      v-model="scope.row.basketCargo"
                      placeholder=""
                      class="input_wid"
                      size="mini"
                    ></el-input>
                    <span class="input_sty"
                      >{{ tableDataList.subunit }}/筐</span
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  prop="userBasketPrice"
                  label="单价"
                  :render-header="numRenderHeader1"
                >
                  <template slot-scope="scope">
                    <el-input
                      @input="
                        (val) => baskChange1(scope, 'userBasketPrice', val)
                      "
                      v-model="scope.row.userBasketPrice"
                      placeholder=""
                      class="input_wid"
                      size="mini"
                    ></el-input>
                    <span class="input_sty">元/个 </span>
                  </template>
                </el-table-column>
                <el-table-column
                  :render-header="numRenderHeader1"
                  prop="basketCount"
                  label="筐子过磅"
                  width="150"
                >
                  <template slot-scope="scope">
                    <el-input
                      @input="(val) => baskChange1(scope, 'basketCount', val)"
                      v-model="scope.row.basketCount"
                      placeholder=""
                      class="input_wid"
                      size="mini"
                    ></el-input>
                    <span class="input_sty">个 </span>
                  </template>
                </el-table-column>
                <el-table-column
                  :render-header="numRenderHeader1"
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
                      class="input_wid"
                      size="mini"
                    ></el-input>
                    <span class="input_sty">个 </span>
                  </template>
                </el-table-column>
                <el-table-column
                  :render-header="numRenderHeader1"
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
                      class="input_wid"
                      size="mini"
                    ></el-input>
                    <span class="input_sty">个 </span>
                  </template>
                </el-table-column>
                <el-table-column prop=" " label="操作" width="150">
                  <template slot-scope="scope">
                    <span class="yc_btn_sty" @click="removeData1(scope)"
                      >移除</span
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <div class="informatOrder" v-if="tableDataBasket2.length > 0">
              <el-table
                header-row-class-name="header_sty"
                ref="plxTable"
                :data="tableDataBasket2"
                class="eltable"
              >
                <el-table-column
                  :render-header="carry_basket"
                  prop="basketname"
                  label="空置筐子"
                  width="180"
                >
                  <template slot-scope="scope">
                    <span>{{
                      "[" + scope.row.basketType + "]" + scope.row.basketname
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="basketcolor" label="颜色">
                  <template slot-scope="scope">
                    <span>{{ scope.row.basketcolor }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="nums" label="空置数量">
                  <template slot-scope="scope">
                    <span>{{ scope.row.nums }}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  :render-header="numRenderHeader1"
                  prop="basketWeight"
                  label="重量"
                >
                  <template slot-scope="scope">
                    <el-input
                      @input="(val) => baskChange2(scope, 'basketWeight', val)"
                      v-model="scope.row.basketWeight"
                      placeholder=""
                      :disabled="isAciont()"
                      class="input_wid"
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
                  :render-header="numRenderHeader2"
                >
                  <template slot-scope="scope">
                    <el-input
                      @input="(val) => baskChange2(scope, 'basketCargo', val)"
                      v-model="scope.row.basketCargo"
                      placeholder=""
                      class="input_wid"
                      size="mini"
                    ></el-input>
                    <span class="input_sty"
                      >{{ tableDataList.subunit }}/筐</span
                    >
                  </template>
                </el-table-column>
                <el-table-column
                  prop="userBasketPrice"
                  label="单价"
                  :render-header="numRenderHeader1"
                >
                  <template slot-scope="scope">
                    <el-input
                      @input="
                        (val) => baskChange2(scope, 'userBasketPrice', val)
                      "
                      v-model="scope.row.userBasketPrice"
                      placeholder=""
                      class="input_wid"
                      size="mini"
                    ></el-input>
                    <span class="input_sty">元/个 </span>
                  </template>
                </el-table-column>
                <el-table-column
                  :render-header="numRenderHeader1"
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
                      class="input_wid"
                      size="mini"
                    ></el-input>
                    <span class="input_sty">个 </span>
                  </template>
                </el-table-column>
                <el-table-column prop=" " label="操作" width="150">
                  <template slot-scope="scope">
                    <span class="yc_btn_sty" @click="removeData2(scope)"
                      >移除</span
                    >
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>

          <div class="kz_seat">
            <!-- 采购单无筐,非平台销 -->
            <el-button
              v-if="
                (getrefundMsg.radio == '商品采购单' &&
                  tableDataList.basketcount <= 0) ||
                getrefundMsg.radio == '商品销售单'
              "
              class="but_sty"
              size="mini"
              icon="el-icon-plus"
              @click="
                handleTankuang('vacancyBasket1', '使用自家筐子', {
                  isSataus: 'empty',
                  getUserMsg: getUserMsg,
                  ruleForm,
                })
              "
              >使用自家筐子</el-button
            >
            <!-- 非销 -->
            <el-button
              v-if="getrefundMsg.radio == '商品销售单'"
              size="mini"
              class="but_sty"
              icon="el-icon-plus"
              @click="
                handleTankuang('emptyBasket1', '添加买家筐子', {
                  isSataus: 'empty',
                  getUserMsg: getUserMsg,
                  ruleForm,
                })
              "
              >添加买家筐子</el-button
            >
          </div>
          <!-- 无筐,平台采非平台采 -->
          <div
            class="subtotal_Sty2 kz_seat"
            v-if="getrefundMsg.radio == '商品采购单'"
          >
            <el-button
              size="mini"
              class="but_sty"
              icon="el-icon-plus"
              @click="
                handleTankuang('emptyBasket2', '添加卖家筐子', {
                  isSataus: 'empty',
                  getUserMsg: getUserMsg,
                  ruleForm,
                })
              "
              >添加卖家筐子</el-button
            >
          </div>
          <div class="informatOrder" v-if="tableDataBasket4.length > 0">
            <el-table
              header-row-class-name="header_sty"
              ref="plxTable"
              :data="tableDataBasket4"
              class="eltable"
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
                :render-header="numRenderHeader1"
                prop="basketWeight"
                label="重量"
              >
                <template slot-scope="scope">
                  <el-input
                    @input="(val) => baskChange4(scope, 'basketWeight', val)"
                    v-model="scope.row.basketWeight"
                    placeholder=""
                    :disabled="isAciont()"
                    class="input_wid"
                    size="mini"
                  ></el-input>
                  <span class="input_sty">{{ tableDataList.subunit }}/个</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="basketCargo"
                label="载货量"
                :render-header="numRenderHeader2"
              >
                <template slot-scope="scope">
                  <el-input
                    @input="(val) => baskChange4(scope, 'basketCargo', val)"
                    v-model="scope.row.basketCargo"
                    placeholder=""
                    class="input_wid"
                    size="mini"
                  ></el-input>
                  <span class="input_sty">{{ tableDataList.subunit }}/筐</span>
                </template>
              </el-table-column>
              <el-table-column
                :render-header="numRenderHeader1"
                prop="userBasketCount"
                label="使用"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input
                    @input="(val) => baskChange4(scope, 'userBasketCount', val)"
                    v-model="scope.row.userBasketCount"
                    placeholder=""
                    class="input_wid"
                    size="mini"
                  ></el-input>
                  <span class="input_sty">个 </span>
                </template>
              </el-table-column>
              <el-table-column prop=" " label="操作" width="150">
                <template slot-scope="scope">
                  <span class="yc_btn_sty" @click="removeData4(scope)"
                    >移除</span
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="informatOrder" v-if="tableDataBasket3.length > 0">
            <el-table
              header-row-class-name="header_sty"
              ref="plxTable"
              :data="tableDataBasket3"
              class="eltable"
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
                :render-header="numRenderHeader1"
                prop="basketWeight"
                label="重量"
              >
                <template slot-scope="scope">
                  <el-input
                    @input="(val) => baskChange3(scope, 'basketWeight', val)"
                    v-model="scope.row.basketWeight"
                    placeholder=""
                    :disabled="isAciont()"
                    class="input_wid"
                    size="mini"
                  ></el-input>
                  <span class="input_sty">{{ tableDataList.subunit }}/个</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="basketCargo"
                label="载货量"
                :render-header="numRenderHeader2"
              >
                <template slot-scope="scope">
                  <el-input
                    @input="(val) => baskChange3(scope, 'basketCargo', val)"
                    v-model="scope.row.basketCargo"
                    placeholder=""
                    class="input_wid"
                    size="mini"
                  ></el-input>
                  <span class="input_sty">{{ tableDataList.subunit }}/筐</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="userBasketPrice"
                label="单价"
                :render-header="numRenderHeader1"
              >
                <template slot-scope="scope">
                  <el-input
                    @input="(val) => baskChange2(scope, 'userBasketPrice', val)"
                    v-model="scope.row.userBasketPrice"
                    placeholder=""
                    class="input_wid"
                    size="mini"
                  ></el-input>
                  <span class="input_sty">元/个 </span>
                </template>
              </el-table-column>
              <el-table-column
                :render-header="numRenderHeader1"
                prop="basketCount"
                label="筐子过磅"
                width="150"
              >
                <template slot-scope="scope">
                  <el-input
                    @input="(val) => baskChange3(scope, 'basketCount', val)"
                    v-model="scope.row.basketCount"
                    placeholder=""
                    class="input_wid"
                    size="mini"
                  ></el-input>
                  <span class="input_sty">个 </span>
                </template>
              </el-table-column>
              <el-table-column
                :render-header="numRenderHeader1"
                prop="userBasketCount"
                label="退回筐子"
              >
                <template slot-scope="scope">
                  <el-input
                    @input="(val) => baskChange3(scope, 'userBasketCount', val)"
                    v-model="scope.row.userBasketCount"
                    placeholder=""
                    class="input_wid"
                    size="mini"
                  ></el-input>
                  <span class="input_sty">个 </span>
                </template>
              </el-table-column>
              <el-table-column prop=" " label="操作" width="150">
                <template slot-scope="scope">
                  <span class="yc_btn_sty" @click="removeData3(scope)"
                    >移除</span
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
          <div class="informatOrder" v-if="tableDataBasket5.length > 0">
            <el-table
              header-row-class-name="header_sty"
              ref="plxTable"
              :data="tableDataBasket5"
              class="eltable"
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
                :render-header="numRenderHeader2"
              >
                <template slot-scope="scope">
                  <el-input
                    @input="(val) => baskChange5(scope, 'basketCargo', val)"
                    v-model="scope.row.basketCargo"
                    placeholder=""
                    class="input_wid"
                    size="mini"
                  ></el-input>
                  <span class="input_sty">{{ tableDataList.subunit }}/筐</span>
                </template>
              </el-table-column>
              <el-table-column
                :render-header="numRenderHeader1"
                prop="userBasketCount"
                label="使用"
              >
                <template slot-scope="scope">
                  <el-input
                    @input="(val) => baskChange5(scope, 'userBasketCount', val)"
                    v-model="scope.row.userBasketCount"
                    placeholder=""
                    class="input_wid"
                    size="mini"
                  ></el-input>
                  <span class="input_sty">个 </span>
                </template>
              </el-table-column>
              <el-table-column prop=" " label="操作" width="150">
                <template slot-scope="scope">
                  <span class="yc_btn_sty" @click="removeData5(scope)"
                    >移除</span
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
        <div class="informatAmount">
          <div class="editInformat">合计</div>
          <!-- 斤单位,已选批次有筐,去皮 -->
          <div
            v-if="
              tableDataList.subunit == '斤' &&
              ruleForm.isRemovePeel2 == 1 &&
              tableDataList.basketcount > 0
            "
          >
            <div class="contentRefund1">
              <span class="informatTitle1"
                >退货毛重：<span class="informatContent"
                  >{{ ruleForm.purchasenums + tableDataList.subunit }}|{{
                    ruleForm.piecenumber1
                  }}<span class="informatColor1">筐</span></span
                ></span
              >
            </div>
            <div class="editgoodRefund">
              <span class="informatTitle1"
                >筐子重量：<span class="informatContent"
                  >{{ isNumStatus().weightBasket
                  }}{{ tableDataList.subunit }}</span
                ></span
              >
            </div>
            <div class="hj_sty">
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
                >商品金额：<span class="informatColor2"
                  >{{
                    moneyFormatTwo(
                      ruleForm.refondPrice *
                        (ruleForm.purchasenums - isNumStatus().weightBasket)
                    )
                  }}元</span
                ></span
              >
            </div>

            <div class="hj_sty1">
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
                >筐子金额：<span class="informatColor2"
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
            <div class="hj_sty">
              <span class="informatTitle1"
                >退货数量：<span class="informatContent"
                  >{{ ruleForm.purchasenums + tableDataList.subunit }}|{{
                    ruleForm.piecenumber1
                  }}<span class="informatColor1">筐</span></span
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
                >商品金额：<span class="informatColor2"
                  >{{
                    moneyFormatTwo(
                      ruleForm.refondPrice *
                        (ruleForm.purchasenums - isNumStatus().weightBasket)
                    )
                  }}元</span
                ></span
              >
            </div>
            <div class="hj_sty1">
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
                >筐子金额：<span class="informatColor2"
                  >{{
                    moneyFormatTwo(isNumStatus().totalAmountBaskets)
                  }}元</span
                ></span
              >
            </div>
          </div>
          <!-- 已选批次无筐 -->
          <div v-if="tableDataList.basketcount <= 0">
            <div class="hj_sty">
              <span class="informatTitle1"
                >退货数量：<span class="informatContent"
                  >{{ ruleForm.purchasenums + tableDataList.subunit }}|{{
                    ruleForm.piecenumber1
                  }}<span class="informatColor1">筐</span></span
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
                >商品金额：<span class="informatColor2"
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
      <div class="page_footer">
        <el-button type="primary" @click="editSucced()">编辑完成</el-button>
      </div>
    </div>
    <!-- 退货退款-选择退货商品弹窗 -->
    <el-dialog
      :visible.sync="refundsDialog"
      width="80%"
      :before-close="refundsDialogClose"
    >
      <div slot="title">
        退货退款-选择退货商品
        <el-tooltip class="item" effect="dark" placement="bottom">
          <div slot="content">
            1.该采购单中某商品已成交的(退货退款单+退款单)商品金额等于该商品采购金额时无法继续退款(不包含筐子金额)<br />
            2.该采购单中某商品已成交的退货退款数量等于采购数量时无法继续退款
          </div>
          <font class="el-icon-warning-outline informatColor"></font>
        </el-tooltip>
      </div>
      <el-table
        ref="dialogRef"
        :data="dialogTableData"
        class="eltable"
        @selection-change="handleSelectionChange"
      >
        <el-table-column :selectable="selected" type="selection" width="55">
        </el-table-column>
        <el-table-column label="商品" prop="goodsName"></el-table-column>
        <el-table-column label="品种/品牌" prop="goodsName"></el-table-column>
        <el-table-column label="产地" prop="region"></el-table-column>
        <el-table-column label="级别/规格" prop="spec"></el-table-column>
        <el-table-column :render-header="numRenderHeader">
          <template slot-scope="scope">
            <span
              v-html="
                getStock(
                  scope.row.subUnit,
                  scope.row.subUnit2,
                  scope.row.subUnit3,
                  scope.row.pieceUnit,
                  scope.row.subUnit2Weight,
                  scope.row.subUnit3Weight,
                  scope.row.goodsCount,
                  scope.row.returnBasketCount,
                  scope.row.productPieceCount
                )
              "
            >
            </span>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="torefundInformation(0)">全退</el-button>
        <el-button type="primary" size="mini" @click="torefundInformation(1)"
          >确认选择({{ tableSelected.length }})</el-button
        >
      </span>
    </el-dialog>

    <!-- 选择批次弹框 -->
    <el-dialog
      title="选择批次"
      :visible.sync="batchVisiable"
      :before-close="batchclose"
      width="80%"
    >
      <div>
        <div class="editDialog">
          {{
            tableDataList.firstCategory +
            "-" +
            tableDataList.secondCategory +
            "-" +
            tableDataList.productname
          }}
          | {{ tableDataList.variety }}
        </div>
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
              ></span
            ></span>
          </el-col>
        </el-row>
      </div>
      <div class="editInformat">
        <span>批次详情</span>
        <span><el-image class="elimage" :src="url"></el-image></span>
      </div>
      <el-table
        ref="batchTable"
        class="eltable"
        :data="tableDataList.modelList"
        :row-key="getRowKey"
        @selection-change="batchSelectionChange"
      >
        <el-table-column type="selection" width="55" :reserve-selection="true">
        </el-table-column>
        <el-table-column label="入库时间" prop="timestamp">
          <template slot-scope="scope">
            {{ scope.row.timestamp | parseTime() }}
          </template>
        </el-table-column>
        <el-table-column
          label="入库类型"
          prop="batchsourcename"
        ></el-table-column>
        <el-table-column label="入库数量" prop="inCount">
          <template slot-scope="scope">
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
          </template>
        </el-table-column>
        <el-table-column label="入库来源" prop="custmorName">
          <template slot-scope="scope">
            {{ scope.row.custmorName }}
            <el-tag type="info" v-if="scope.row.custmorType == 0">非</el-tag>
            <el-tag v-if="scope.row.custmorType == 3">供</el-tag>
            <el-tag type="danger" v-if="scope.row.custmorType == 1">经</el-tag>
            <el-tag type="warning" v-if="scope.row.custmorType == 2">采</el-tag>
            <span v-if="scope.row.custmorPhone != ''">{{
              "-" + scope.row.custmorPhone
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前库存" prop="batchnumber">
          <template slot-scope="scope">
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
          </template>
        </el-table-column>
        <el-table-column label="最近变动时间" prop="lastlyDate">
          <template slot-scope="scope">
            {{ scope.row.lastlyDate | parseTime() }}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="batchclose()">取消</el-button>
        <el-button type="primary" @click="batchhandleAdd()">确定</el-button>
      </span>
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
        <div v-for="(item, index) in baskList" :key="index" class="zh_dialog">
          <el-checkbox
            :indeterminate="item.isIndeterminate"
            v-model="item.check"
            @change="handleCheckAllChange(item.check, index)"
          >
            [{{ item.basketType }}]{{ item.basketname }}
          </el-checkbox>
          <div class="zh_dialog_sty"></div>
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
      </div>
      <div class="creditLineBottom">
        <el-button size="mini" style="zh_dialog_close" @click="weighingclose"
          >取消</el-button
        >
        <el-button size="mini" type="primary" @click="weighinghandleAdd()"
          >确定</el-button
        >
      </div>
    </el-dialog>

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
          :data="linshiSelection"
          :row-key="getRowKey"
        >
          <el-table-column label="入库时间" prop="timestamp">
            <template slot-scope="scope">
              {{ scope.row.timestamp | parseTime() }}
            </template>
          </el-table-column>
          <el-table-column
            label="入库类型"
            prop="batchsourcename"
          ></el-table-column>
          <el-table-column label="商品来源" prop="custmorName">
            <template slot-scope="scope">
              {{ scope.row.custmorName }}
              <el-tag type="info" v-if="scope.row.custmorType == 0">非</el-tag>
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
            </template>
          </el-table-column>
          <el-table-column label="当前库存" prop="batchnumber">
            <template slot-scope="scope">
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
        <div style="height: 60px"></div>
      </div>
    </el-dialog>

    <!-- 退货信息-商品详情 -->
    <!-- <returngoodsDetail ref="returngoodsDetail"></returngoodsDetail> -->
    <referencePhoto ref="referencePhoto"></referencePhoto>

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
    <div style="height: 50px"></div>
  </Page>
</template>

<script>
import {
  OrderReturnSellInfo,
  createOrderReturn,
} from "@/request/api/refundManagement/index.js";
import { productBatch, getCarryBasket } from "@/request/api/commodity/index";
import { rarSelectGoods } from "@/request/api/applicationForDrawback/index.js";
export default {
  name: "goodsReturnInformation",
  components: {
    weighingDialog: () => import("./dialogmod/weighingDialog.vue"), // 批量过磅
    emptyBasket: () => import("./dialogmod/emptyBasket.vue"), // 使用空筐过磅
    vacancyBasket: () => import("./dialogmod/vacancyBasket.vue"), // 使用空置筐子
    // returngoodsDetail: () => import("./dialogmod/returngoodsDetail.vue"), //退货信息-商品详情
    // editrefundInformation: () => import("./editrefundInformation.vue"), //编辑退货信息
    referencePhoto: () => import("../orderManage/dialog/referencePhoto.vue"), // 参考照片
  },
  data() {
    return {
      isshowtag: false, // 选择载货物
      isshowtag1: false, // 选择载货物
      isRemovePeel: 1,
      ruleForm: {
        //表单模块
        refondPrice: 0,
        pieceUnit: "无",
        purchasenums: 0,
        piecenumber: 0,
        piecenumber1: 0,
        isLoad: 0,
        // isRemovePeel: 1, //是否去皮
        ispieceUnit: "", //计件单位 采购单
        ispieceUnit1: "", //计件单位  销售单
        isRemovePeel2: 3,
      },
      baskList: {}, //载货筐子弹框数据
      weighingVisiable: false, //载货筐子弹框
      datasMsg: {}, //已选批次数
      editindex: 0,
      batchVisiable: false, //选择批次
      batchSelection: [], //已选批次信息
      tableDataList: {}, //批次信息
      pageTitle: "退货信息",
      isShow: true,
      dialogImageUrlList: [],
      dialogImageUrl: "",
      dialogVisible: false,
      transportNumber: [],
      lineValue: 1,
      transinfovisible: false,
      transinfo1: "",
      transinfo2: "",
      remark: "",
      transferImageUrls: [],
      transimageList: [],
      selluserid: "",
      getUserMsg: {}, //客户信息和采购单信息
      tableData: [],
      getrefundMsg: {}, //申请退款传值
      refundsDialog: false, //初始值弹窗关闭
      dialogTableData: [],
      tableSelected: [],
      tableDataBasket: [], //载货
      tableDataBasket1: [], //过磅
      tableDataBasket2: [], //空置
      tableDataBasket3: [], //买家
      tableDataBasket4: [], //自家
      tableDataBasket5: [], //卖家
      linshiSelection: [], //用于临时判断的已选批次中间变量
      overflowVisiable: false, //报溢批次弹框
      overflowData: {}, //报溢批次弹框数据
      overflowMsg: {}, //报溢载货筐子数据
      url: require("@/assets/image/imgs/icon-question.png"),
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
    };
  },
  methods: {
    //报溢载货筐子
    overflowBtn(msg) {
      this.overflowData = msg;
      console.log(this.overflowData);
      this.overflowVisiable = true;
    },
    overflowSure(msg1) {
      this.overflowMsg = msg1.row;
      console.log(this.overflowMsg);
      this.overflowVisiable = false;
    },
    overflowclose() {
      this.overflowVisiable = false;
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
    // 使用空筐过磅
    emptyBasketChange(val) {
      if (this.tableDataBasket1.length > 0) {
        this.tableDataBasket1.push(...val);
      } else {
        this.tableDataBasket1 = val;
      }
    },
    // 使用买家
    emptyBasketChange1(val) {
      if (this.tableDataBasket3.length > 0) {
        this.tableDataBasket3.push(...val);
      } else {
        this.tableDataBasket3 = val;
      }
    },
    // 使用卖家
    emptyBasketChange2(val) {
      if (this.tableDataBasket5.length > 0) {
        this.tableDataBasket5.push(...val);
      } else {
        this.tableDataBasket5 = val;
      }
    },
    // 使用空置筐子
    vacancyBasketChange(val) {
      if (this.tableDataBasket2.length > 0) {
        this.tableDataBasket2.push(...val);
      } else {
        this.tableDataBasket2 = val;
      }
    },
    // 使用自家筐子
    vacancyBasketChange1(val) {
      if (this.tableDataBasket4.length > 0) {
        this.tableDataBasket4.push(...val);
      } else {
        this.tableDataBasket4 = val;
      }
    },
    // 各筐子表格类型移除按钮
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
    numRenderHeader1(h, val) {
      let res = val.column.label;
      return (
        <div>
          <font style="color: #dd4c4d">*</font>
          {res}
        </div>
      );
    },
    numRenderHeader2() {
      return (
        <div>
          <font style="color: #dd4c4d;">*</font>
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
    // 初始化载货筐子表格数据
    tableZHInitial() {
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
      for (let i = 0; i < this.getUserMsg.details.length; i++) {
        const el = this.getUserMsg.details[i];
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
    zaihuoTankuang() {
      this.weighingVisiable = true;
      this.getAddOwnBasket();
    },
    // 载货筐子弹框关闭事件
    weighingclose() {
      this.weighingVisiable = false;
    },
    // 载货筐子接口
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
      for (let i = 0; i < this.getUserMsg.details.length; i++) {
        const el = this.getUserMsg.details[i];
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
    // 批量过磅
    weighingChange(val) {
      this.$set(this.ruleForm, "purchasenums", val.purchasenums);
      this.$set(this.ruleForm, "piecenumber", val.piecenumber);
      this.$set(this.ruleForm, "piecenumber1", val.piecenumber1);
    },
    // 触发子组件弹框按钮
    handleTankuang(form, title, record) {
      this.$refs[form].edit(record);
      this.$refs[form].title = title;
      this.$refs[form].disableSubmit = false;
      this.$refs[form].isVisiable = true;
    },
    // 初始化选择计件单位表单数据
    pieceunitInitial() {
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
    },
    //初始化非平台销售单进入页面获取计件单位
    updatepieceUnit() {
      if (this.tableData[this.editindex].pieceUnit == "") {
        if (this.tableData[this.editindex].returnBasketCount > 0) {
          this.ruleForm.ispieceUnit1 = "筐(周转筐)";
          this.isshowtag1 = true;
        } else {
          this.ruleForm.ispieceUnit1 = "无";
        }
      } else {
        if (this.tableData[this.editindex].returnBasketCount > 0) {
          console.log(1111);
          this.ruleForm.ispieceUnit1 =
            this.tableData[this.editindex].pieceUnit + "|筐(周转筐)";
          this.isshowtag1 = true;
        } else {
          this.ruleForm.ispieceUnit1 = this.tableData[this.editindex].pieceUnit;
        }
      }
    },
    // 判断批量过磅 批量计件
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
    // 斤非斤判断
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
    // 过磅数量
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
      if (this.tableData[this.editindex].pieceUnit) {
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
    // 选择计件单位
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
        if (this.tableData[this.editindex].pieceUnit == "") {
          this.ruleForm.ispieceUnit1 = "筐(周转筐)";
        } else {
          this.ruleForm.ispieceUnit1 =
            this.tableData[this.editindex].pieceUnit + "|筐(周转筐)";
        }
      } else {
        if (this.tableData[this.editindex].pieceUnit) {
          this.ruleForm.ispieceUnit1 = this.tableData[this.editindex].pieceUnit;
        } else {
          this.ruleForm.ispieceUnit1 = "无";
        }
      }
    },
    // 单位
    purSubunit() {
      if (this.tableDataList.subunit) {
        return "元/" + this.tableDataList.subunit;
      } else {
        return "";
      }
    },
    // 编辑完成按钮
    editSucced() {
      this.tableData[this.editindex].editMsg.zhonglei =
        this.tableDataBasket.length +
        this.tableDataBasket1.length +
        this.tableDataBasket2.length +
        this.tableDataBasket3.length +
        this.tableDataBasket4.length +
        this.tableDataBasket5.length;
      this.tableData[this.editindex].editMsg.tuihui =
        this.isNumStatus().userBasketCount;
      this.tableData[this.editindex].editMsg.jine =
        this.isNumStatus().totalAmountBaskets;
      this.tableData[this.editindex].editMsg.kzweigth =
        this.isNumStatus().weightBasket;
      this.tableData[this.editindex].editMsg.refondPrice =
        this.ruleForm.refondPrice;
      this.tableData[this.editindex].editMsg.pieceUnit =
        this.ruleForm.pieceUnit;
      this.tableData[this.editindex].editMsg.purchasenums =
        this.ruleForm.purchasenums;
      this.tableData[this.editindex].editMsg.piecenumber =
        this.ruleForm.piecenumber;
      this.tableData[this.editindex].editMsg.piecenumber1 =
        this.ruleForm.piecenumber1;
      this.tableData[this.editindex].editMsg.isLoad = this.ruleForm.isLoad;
      this.tableData[this.editindex].editMsg.ispieceUnit =
        this.ruleForm.ispieceUnit;
      this.tableData[this.editindex].editMsg.ispieceUnit1 =
        this.ruleForm.ispieceUnit1;
      this.tableData[this.editindex].editMsg.isRemovePeel2 =
        this.ruleForm.isRemovePeel2;
      this.tableData[this.editindex].editMsg.tableDataBasket =
        this.tableDataBasket;
      this.tableData[this.editindex].editMsg.tableDataBasket1 =
        this.tableDataBasket1;
      this.tableData[this.editindex].editMsg.tableDataBasket2 =
        this.tableDataBasket2;
      this.tableData[this.editindex].editMsg.tableDataBasket3 =
        this.tableDataBasket3;
      this.tableData[this.editindex].editMsg.tableDataBasket4 =
        this.tableDataBasket4;
      this.tableData[this.editindex].editMsg.tableDataBasket5 =
        this.tableDataBasket5;
      console.log(this.tableData);
      this.isShow = true;
      this.$refs.batchTable.clearSelection();
    },
    // 选择批次开始
    //跟踪选择批次勾选项
    getRowKey(row) {
      return row.batchid;
    },
    // 已选批次
    showBatchCount() {
      if (this.linshiSelection.length > 0) {
        let batchnumber = 0;
        let basketnumber = 0;
        let piecenumber = 0;
        for (let i = 0; i < this.linshiSelection.length; i++) {
          const element = this.linshiSelection[i];
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
        return this.linshiSelection.length + "个/数量" + datas;
      } else {
        return "- -";
      }
    },
    // 选择批次弹框关闭
    batchclose() {
      this.batchVisiable = false;
      this.pieceunitInitial();
      this.tableZHInitial();
    },
    // 选择批次弹框确定按钮
    batchhandleAdd() {
      this.tableData[this.editindex].editMsg.checkedBatch = this.batchSelection;
      this.linshiSelection =
        this.tableData[this.editindex].editMsg.checkedBatch;
      this.$refs.batchTable.clearSelection();
      this.batchclose();
    },
    batchSelectionChange(val) {
      this.batchSelection = val;
    },
    // 选择批次按钮
    batchBtn() {
      this.batchVisiable = true;
    },
    // 批次信息的接口
    productBatch() {
      let param = {
        productId: this.tableData[this.editindex].productIdBuyUser, // 商品ID
        type: 6, // 报溢商品选择批次传0， 6：退货退款单
        pageindex: 1,
        pagesize: 10,
      };
      productBatch(param).then((resp) => {
        this.tableDataList = resp.data[0];
        if (!this.tableData[this.editindex].editMsg) {
          this.tableData[this.editindex].editMsg = {
            zhonglei: 0,
            tuihui: 0,
            jine: 0,
            //表单模块
            refondPrice: 0,
            pieceUnit: "无",
            purchasenums: 0,
            piecenumber: 0,
            piecenumber1: 0,
            isLoad: 0,
            // isRemovePeel: 1, //是否去皮
            ispieceUnit: "", //计件单位 采购单
            ispieceUnit1: "", //计件单位  销售单
            isRemovePeel2: 3,
            checkedBatch: [],
            tableDataBasket: [], //载货
            tableDataBasket1: [], //过磅
            tableDataBasket2: [], //空置
            tableDataBasket3: [], //买家
            tableDataBasket4: [], //自家
            tableDataBasket5: [], //卖家
          };
        }
        this.linshiSelection =
          this.tableData[this.editindex].editMsg.checkedBatch;
        this.ruleForm.refondPrice =
          this.tableData[this.editindex].editMsg.refondPrice;
        this.ruleForm.pieceUnit =
          this.tableData[this.editindex].editMsg.pieceUnit;
        this.ruleForm.purchasenums =
          this.tableData[this.editindex].editMsg.purchasenums;
        this.ruleForm.piecenumber =
          this.tableData[this.editindex].editMsg.piecenumber;
        this.ruleForm.piecenumber1 =
          this.tableData[this.editindex].editMsg.piecenumber1;
        this.ruleForm.isLoad = this.tableData[this.editindex].editMsg.isLoad;
        this.ruleForm.ispieceUnit =
          this.tableData[this.editindex].editMsg.ispieceUnit;
        this.ruleForm.ispieceUnit1 =
          this.tableData[this.editindex].editMsg.ispieceUnit1;
        this.ruleForm.isRemovePeel2 =
          this.tableData[this.editindex].editMsg.isRemovePeel2;
        this.tableDataBasket =
          this.tableData[this.editindex].editMsg.tableDataBasket;
        this.tableDataBasket1 =
          this.tableData[this.editindex].editMsg.tableDataBasket1;
        this.tableDataBasket2 =
          this.tableData[this.editindex].editMsg.tableDataBasket2;
        this.tableDataBasket3 =
          this.tableData[this.editindex].editMsg.tableDataBasket3;
        this.tableDataBasket4 =
          this.tableData[this.editindex].editMsg.tableDataBasket4;
        this.tableDataBasket5 =
          this.tableData[this.editindex].editMsg.tableDataBasket5;
        this.$nextTick(() => {
          this.tableDataList.modelList.forEach((row) => {
            for (
              let i = 0;
              i < this.tableData[this.editindex].editMsg.checkedBatch.length;
              i++
            ) {
              if (
                this.tableData[this.editindex].editMsg.checkedBatch[i]
                  .batchid == row.batchid
              ) {
                this.$refs.batchTable.toggleRowSelection(row, true);
              }
            }
          });
        });
        if (this.getrefundMsg.radio == "商品销售单") {
          this.updatepieceUnit();
        }
      });
    },
    // 选择批次结束
    basketType() {
      let productTotalPrice = 0; //商品金额
      let refundBasket = 0; //退回筐子
      let amountBasket = 0; //筐子金额
      let useBuyerBasket = 0; //使用买家筐子
      let basketVacateCount = 0; //腾空筐子
      const el = this.tableData[this.editindex].editMsg;
      if (el) {
        productTotalPrice += el.purchasenums * el.refondPrice;
        refundBasket += el.tuihui;
        amountBasket += el.jine;
        useBuyerBasket == Number(el.numberBuyersBasket) || 0;
        basketVacateCount == Number(el.basketVacateCount) || 0;
      }
      let datap = {
        productTotalPrice,
        refundBasket,
        amountBasket,
        useBuyerBasket,
        basketVacateCount,
      };
      return datap;
    },
    // 上传文件
    beforeUpload(file, fileList) {
      this.transimageList = fileList;
      this.dialogImageUrlList = [];
      for (let index = 0; index < fileList.length; index++) {
        const el = fileList[index];
        this.dialogImageUrlList.push(el.url);
      }
    },
    // 车辆照片
    removeUpload(file, fileList) {
      this.transimageList = fileList;
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
    handleReference(form, title) {
      this.$refs[form].title = title;
      this.$refs[form].disableSubmit = false;
      this.$refs[form].isVisiable = true;
    },
    // 车牌选择
    lineFocus2(val) {
      this.transinfo1 = val.value;
    },
    lineFocus(val) {
      this.lineValue = val;
    },
    // 车牌输入
    transinfoRemoteMethod1(query) {
      this.transinfo2 = query;
    },
    transinfoClick(val) {
      this.transinfo1 = val.name;
      this.transinfovisible = false;
    },
    // 请求筐子接口传参
    getbasketMsg(id) {
      let res = [];
      if (this.tableData[this.editindex].productId == id) {
        // 载货筐子
        if (this.tableData[this.editindex].editMsg.tableDataBasket.length > 0) {
          for (
            let j = 0;
            j < this.tableData[this.editindex].editMsg.tableDataBasket.length;
            j++
          ) {
            const linshiConst1 =
              this.tableData[this.editindex].editMsg.tableDataBasket[j];
            res.push({
              userBasketId: linshiConst1.basketSystemBasketId,
              type: 1,
              basketColor: linshiConst1.basketcolor, // 筐子颜色
              basketName: linshiConst1.basketname, // 筐子名称
              userBasketPrice: Number(linshiConst1.userBasketPrice) || 0, // 筐子单价
              userBasketCount: Number(linshiConst1.userBasketCount) || 0, // （退回、退入）筐子数量
              basketCount: Number(linshiConst1.basketCount) || 0, // 退货筐子数量（过磅）
              basketVacateCount: Number(linshiConst1.basketVacateCount) || 0, // 腾空筐子数量
              basketWeight: Number(linshiConst1.basketWeight) || 0, // 筐子重量
              basketCargo: Number(linshiConst1.basketcargo) || 0, // 筐子载货量
              overBatchId: this.overflowMsg.batchid || 0, // 报溢批次id,未报溢传0
              basketOverCount:
                this.overflowData.basketCount -
                  this.overflowData.userbasketnumber || 0,
            });
          }
        }
        if (
          this.tableData[this.editindex].editMsg.tableDataBasket1.length > 0
        ) {
          for (
            let j = 0;
            j < this.tableData[this.editindex].editMsg.tableDataBasket1.length;
            j++
          ) {
            const linshiConst1 =
              this.tableData[this.editindex].editMsg.tableDataBasket1[j];
            res.push({
              userBasketId: linshiConst1.basketId,
              type: 4,
              basketColor: linshiConst1.basketcolor, // 筐子颜色
              basketName: linshiConst1.basketname, // 筐子名称
              userBasketPrice: Number(linshiConst1.userBasketPrice) || 0, // 筐子单价
              userBasketCount: Number(linshiConst1.userBasketCount) || 0, // （退回、退入）筐子数量
              basketCount: Number(linshiConst1.basketCount) || 0, // 退货筐子数量（过磅）
              basketVacateCount: Number(linshiConst1.basketVacateCount) || 0, // 腾空筐子数量
              basketWeight: Number(linshiConst1.basketWeight) || 0, // 筐子重量
              basketCargo: Number(linshiConst1.basketcargo) || 0, // 筐子载货量
              overBatchId: 0, // 报溢批次id,未报溢传0
              basketOverCount: 0,
            });
          }
        }
        if (
          this.tableData[this.editindex].editMsg.tableDataBasket2.length > 0
        ) {
          for (
            let j = 0;
            j < this.tableData[this.editindex].editMsg.tableDataBasket2.length;
            j++
          ) {
            const linshiConst1 =
              this.tableData[this.editindex].editMsg.tableDataBasket2[j];
            res.push({
              userBasketId: linshiConst1.basketid,
              type: 5,
              basketColor: linshiConst1.basketColor, // 筐子颜色
              basketName: linshiConst1.basektName, // 筐子名称
              userBasketPrice: Number(linshiConst1.userBasketPrice) || 0, // 筐子单价
              userBasketCount: Number(linshiConst1.userBasketCount) || 0, // （退回、退入）筐子数量
              basketCount: Number(linshiConst1.basketCount) || 0, // 退货筐子数量（过磅）
              basketVacateCount: Number(linshiConst1.basketVacateCount) || 0, // 腾空筐子数量
              basketWeight: Number(linshiConst1.basketWeight) || 0, // 筐子重量
              basketCargo: Number(linshiConst1.basketcargo) || 0, // 筐子载货量
              overBatchId: 0, // 报溢批次id,未报溢传0
              basketOverCount: 0,
            });
          }
        }
        if (
          this.tableData[this.editindex].editMsg.tableDataBasket3.length > 0
        ) {
          for (
            let j = 0;
            j < this.tableData[this.editindex].editMsg.tableDataBasket3.length;
            j++
          ) {
            const linshiConst1 =
              this.tableData[this.editindex].editMsg.tableDataBasket3[j];
            res.push({
              userBasketId: linshiConst1.basketId,
              type: 2,
              basketColor: linshiConst1.basketColor, // 筐子颜色
              basketName: linshiConst1.basketName, // 筐子名称
              userBasketPrice: Number(linshiConst1.userBasketPrice) || 0, // 筐子单价
              userBasketCount: Number(linshiConst1.userBasketCount) || 0, // （退回、退入）筐子数量
              basketCount: Number(linshiConst1.basketCount) || 0, // 退货筐子数量（过磅）
              basketVacateCount: Number(linshiConst1.basketVacateCount) || 0, // 腾空筐子数量
              basketWeight: Number(linshiConst1.basketWeight) || 0, // 筐子重量
              basketCargo: Number(linshiConst1.basketcargo) || 0, // 筐子载货量
              overBatchId: 0, // 报溢批次id,未报溢传0
              basketOverCount: 0,
            });
          }
        }
        if (
          this.tableData[this.editindex].editMsg.tableDataBasket4.length > 0
        ) {
          for (
            let j = 0;
            j < this.tableData[this.editindex].editMsg.tableDataBasket4.length;
            j++
          ) {
            const linshiConst1 =
              this.tableData[this.editindex].editMsg.tableDataBasket4[j];
            res.push({
              userBasketId: linshiConst1.basketid,
              type: 3,
              basketColor: linshiConst1.basketcolor, // 筐子颜色
              basketName: linshiConst1.basketname, // 筐子名称
              userBasketPrice: Number(linshiConst1.userBasketPrice) || 0, // 筐子单价
              userBasketCount: Number(linshiConst1.userBasketCount) || 0, // （退回、退入）筐子数量
              basketCount: Number(linshiConst1.basketCount) || 0, // 退货筐子数量（过磅）
              basketVacateCount: Number(linshiConst1.basketVacateCount) || 0, // 腾空筐子数量
              basketWeight: Number(linshiConst1.basketWeight) || 0, // 筐子重量
              basketCargo: Number(linshiConst1.basketCargo) || 0, // 筐子载货量
              overBatchId: 0, // 报溢批次id,未报溢传0
              basketOverCount: 0,
            });
          }
        }
        if (
          this.tableData[this.editindex].editMsg.tableDataBasket5.length > 0
        ) {
          for (
            let j = 0;
            j < this.tableData[this.editindex].editMsg.tableDataBasket5.length;
            j++
          ) {
            const linshiConst1 =
              this.tableData[this.editindex].editMsg.tableDataBasket5[j];
            res.push({
              userBasketId: linshiConst1.basketId,
              type: 2,
              basketColor: linshiConst1.basketColor, // 筐子颜色
              basketName: linshiConst1.basketName, // 筐子名称
              userBasketPrice: Number(linshiConst1.userBasketPrice) || 0, // 筐子单价
              userBasketCount: Number(linshiConst1.userBasketCount) || 0, // （退回、退入）筐子数量
              basketCount: Number(linshiConst1.basketCount) || 0, // 退货筐子数量（过磅）
              basketVacateCount: Number(linshiConst1.basketVacateCount) || 0, // 腾空筐子数量
              basketWeight: Number(linshiConst1.basketWeight) || 0, // 筐子重量
              basketCargo: Number(linshiConst1.basketcargo) || 0, // 筐子载货量
              overBatchId: 0, // 报溢批次id,未报溢传0
              basketOverCount: 0,
            });
          }
        }
      }
      return res;
    },
    productList() {
      let res = [];
      const linshiConst = this.tableData[this.editindex];
      res.push({
        productId: linshiConst.productId,
        productIdBuyUser: linshiConst.productIdBuyUser, //买家商品主键id
        region: linshiConst.region, //产地名称
        spec: linshiConst.spec, //规格
        subUnit: linshiConst.subUnit, //一级计算单位
        subUnit2: linshiConst.subUnit2, //二级计算单位
        subUnit3: linshiConst.subUnit3, //三级计算单位
        subUnit2Weight: linshiConst.subUnit2Weight, //二级单位重量
        subUnit3Weight: linshiConst.subUnit3Weight, //三级单位重量
        productCount: Number(linshiConst.editMsg.purchasenums) || 0, //单独商品退货数量（毛重或净重）
        productPrice: Number(linshiConst.editMsg.refondPrice) || 0, //单独商品退货单价
        variety: linshiConst.variety, //品牌
        isRemovePeel: linshiConst.isRemovePeel, //是否去皮 0 不去皮 1 去皮 不用该字段传0
        isLoad: linshiConst.editMsg.isLoad, //是否有装载物，0：否，1：是
        other: "", //其他分类
        pieceUnit: linshiConst.pieceUnit, //计件单位
        returnPieceUnit:
          this.getrefundMsg.radio == "商品采购单"
            ? linshiConst.editMsg.ispieceUnit
            : linshiConst.editMsg.ispieceUnit1, //  退回计件单位 不修改为 ""
        basketWeight: Number(linshiConst.editMsg.kzweigth) || 0, //该商品筐子重量
        productReallyWeight:
          Number(
            linshiConst.editMsg.purchasenums - linshiConst.editMsg.kzweigth
          ) || 0, //单个商品净重
        returnBasketCount: Number(linshiConst.editMsg.tuihui) || 0, //退回筐子数量
        returnBasketPrice: Number(linshiConst.editMsg.jine) || 0, //筐子金额
        productTotalPrice:
          Number(
            linshiConst.editMsg.purchasenums * linshiConst.editMsg.refondPrice
          ) || 0, //商品金额
        detailTotalPrice:
          Number(
            linshiConst.editMsg.purchasenums * linshiConst.editMsg.refondPrice +
              linshiConst.editMsg.jine
          ) || 0, //金额小计
        basketTypeCount: Number(linshiConst.editMsg.zhonglei) || 0, //筐子种类数量
        basketVacateCount: Number(linshiConst.editMsg.basketVacateCount) || 0, //腾空筐子数量
        productBatchId:
          this.getrefundMsg.radio == "商品采购单"
            ? linshiConst.editMsg.checkedBatch
            : [], //已选批次主键id
        regionId: linshiConst.regionId, //产地id
        productPieceCount: Number(linshiConst.editMsg.piecenumber) || 0, //退货计件数量
        emptyUnitCount: Number(linshiConst.basketVacateCount) || 0, //腾空计件数量
        isCargoExists: linshiConst.batchcount ? 1 : 0, // 已选批次是否有筐，0：否，1：是
        productOverBatchId: 0, //报溢表主键id  新增字段
        productOverCount: 0, //报溢批次id对应数量   新增字段
        productOverPieceCount: 0, //报溢批次id对应计件数量 新增字段
        basketList: this.getbasketMsg(linshiConst.productId),
      });
      return res;
    },
    // 确认退货退款
    makeSure1() {
      if (this.tableData[this.editindex].editMsg == undefined) {
        this.$error("请先编辑未编辑的商品");
        return;
      }
      let userid = "";
      if (this.getUserMsg.toUserId == "") {
        userid =
          this.getUserMsg.fromUserName + "," + this.getUserMsg.fromUserPhone;
      } else {
        userid = this.getUserMsg.toUserId;
      }
      let paramData = {};
      paramData.returnUserId =
        this.getrefundMsg.radio == "商品销售单" ? userid : "";
      paramData.returnToUserId =
        this.getrefundMsg.radio == "商品采购单" ? userid : "";
      paramData.orderReturnId = 0;
      paramData.type = 0;
      paramData.typeView =
        this.getrefundMsg.radio == "商品销售单"
          ? 3
          : this.getrefundMsg.ispt == "0"
          ? 1
          : 2;
      paramData.productTotalPrice =
        Number(this.basketType().productTotalPrice) || 0;
      paramData.basketTotalCount = Number(this.basketType().refundBasket) || 0;
      paramData.basketTotalPrice = Number(this.basketType().amountBasket) || 0;
      paramData.orderType = this.getrefundMsg.ispt == "0" ? 1 : 2;
      paramData.transferArea = "";
      paramData.transferNumber = 0;
      paramData.transferImageUrls = [];
      paramData.transferImageList = [];
      paramData.orderTotalPrice =
        Number(
          this.basketType().productTotalPrice + this.basketType().amountBasket
        ) || 0;
      paramData.productDescription = "";
      paramData.productTypeCount = Number(this.getUserMsg.details.length) || 0;
      paramData.basketVacateCount =
        Number(this.basketType().basketVacateCount) || 0;
      paramData.orderSellId = this.getUserMsg.id;
      paramData.orderSellNo = this.getUserMsg.ordersellId;
      paramData.productTotalCount = Number(this.getUserMsg.details.length) || 0;
      paramData.isReturnProduct = 1;
      paramData.remark = this.remark;
      paramData.productList = this.productList();
      this.transimageList.forEach((res) => {
        if (res.raw) {
          paramData.transferImageUrls.push(res.raw);
        } else {
          paramData.transferImageList.push(res.url);
        }
      });
      const formData = new FormData();
      Object.keys(paramData).forEach((key) => {
        if (key == "transferImageUrls") {
          for (let i = 0; i < paramData.transferImageUrls.length; i++) {
            formData.append(
              "transferImageUrls",
              paramData.transferImageUrls[i]
            );
          }
        } else if (key == "basketList") {
          formData.append(key, JSON.stringify(paramData[key]));
        } else {
          formData.append(key, paramData[key]);
        }
      });
      createOrderReturn(paramData).then((res) => {
        if (res.status == 200) {
          this.$success("操作成功");
          this.$closePage("/refundManagement/refundsGoods");
        } else if (res.status == 100001) {
          this.$warning("有在途订单");
        }
      });
    },
    // 全退 确认选择按钮
    torefundInformation(val) {
      let res = [];
      if (val == 0) {
        // 全退
        res = this.dialogTableData;
      } else {
        res = this.tableSelected;
      }
      let old = this.tableData.map((item) => {
        return item.productId;
      });
      let news = res.map((item) => {
        return item.productId;
      });
      let idarr = [];
      for (let i = 0; i < news.length; i++) {
        if (old.indexOf(news[i]) == -1) {
          idarr.push(news[i]);
        }
      }
      this.getrefundMsg.productId = idarr.join(",");
      OrderReturnSellInfo(this.getrefundMsg).then((res) => {
        let tablearr = res.data[0].details;
        for (let i = 0; i < tablearr.length; i++) {
          this.tableData.push(tablearr[i]);
        }
      });
      this.refundsDialog = false;
    },
    selected(row, index) {
      let obj = this.tableData.map((item) => {
        return item.productId;
      });
      if (obj.indexOf(row.productId) > -1) {
        return false;
      } else {
        return true;
      }
    },
    numRenderHeader(h) {
      return (
        <div>
          采购数量
          <el-tooltip class="item" effect="dark" placement="bottom">
            <div slot="content">采购数量=原采购商品数量-已退数量</div>
            <font>采购数量</font>
            <font class="el-icon-warning-outline" style="color:#0BA198;"></font>
          </el-tooltip>
        </div>
      );
    },
    // 选择退货商品开始
    goodsReturnBtn() {
      this.refundsDialog = true;
      this.getGoods();
    },
    handleSelectionChange(val) {
      this.tableSelected = val;
    },
    refundsDialogClose() {
      this.refundsDialog = false;
      this.dialogTableData = [];
    },
    getGoods() {
      let res = {
        sellOrderId: this.getrefundMsg.orderId,
        custmorId: this.getUserMsg.toUserId,
        type:
          this.getrefundMsg.radio == "商品采购单" && this.getUserMsg.type == 1
            ? 1
            : 0,
        orderReturnId: 1,
      };
      rarSelectGoods(res).then((resp) => {
        this.dialogTableData = resp.data;
        if (this.tableData.length > 0) {
          this.$nextTick(() => {
            for (let i = 0; i < this.dialogTableData.length; i++) {
              if (
                this.dialogTableData[i].productId ==
                this.tableData[this.editindex].productId
              ) {
                this.$refs.dialogRef.toggleRowSelection(
                  this.dialogTableData[i],
                  true
                );
              }
            }
          });
        }
      });
    },
    // 选择退货商品结束
    // 移除按钮
    handleRemove(index) {
      this.$confirm("确认删除该商品信息?", "删除商品", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.tableData.splice(index, 1);
      });
    },
    // 编辑
    handleEdit(index) {
      this.editindex = index;
      this.isShow = false;
      this.pageTitle = "编辑退货信息";
      this.productBatch();
    },
    // 商品详情
    handleDetail() {
      console.log(1111);
      // this.$refs["returngoodsDetail"].isVisiable = true;
    },
    // 跳转页面
    handleJumpDetail: function (form, record) {
      this.$router.push({
        path: form,
        query: record,
      });
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
    // 数值取两位小数
    moneyFormatTwo(moneyStr) {
      // 先将数值取两位小数
      let money = Number(moneyStr)
        .toFixed(2)
        .toString()
        .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      return money;
    },
    // 获取退货退款单关联的采购单信息
    OrderReturnSellInfo() {
      let param = {
        orderId: this.getrefundMsg.orderId,
        orderType: this.getrefundMsg.orderType,
        productId: this.getrefundMsg.productId,
        orderReturnId: 1,
      };
      OrderReturnSellInfo(param).then((res) => {
        this.getUserMsg = res.data[0];
        this.tableData = res.data[0].details;
      });
    },
    // 从申请退款页获取的数据
    getMsg() {
      this.getrefundMsg = JSON.parse(this.$route.query.data);
      this.OrderReturnSellInfo();
    },
  },
  created() {
    this.getMsg();
  },
};
</script>

<style lang="scss" scoped>
.page_change {
  overflow-y: auto;
  .informatTitle {
    color: rgba(1, 6, 33, 0.55);
    font-size: 14px;
  }
  .informatContent {
    color: rgba(1, 6, 33, 0.9);
    font-size: 14px;
  }
  .informatOrder {
    margin-top: 12px;
  }
  .informatColor {
    color: #0ba198;
  }
  .informatRefund {
    font-size: 16px;
    color: rgba(1, 6, 33, 0.9);
    font-weight: 600;
    margin-right: 10px;
  }
  .informatRefund_style {
    padding-left: 12px;
    border-bottom: 1px solid #e9e9e9;
    margin-top: 16px;
  }
  .lineH14 {
    width: 1px;
    height: 14px;
    background: rgba(208, 208, 210, 1);
    margin: 0px 10px;
  }
  .contentRefund {
    padding: 16px 0px 24px;
  }
  .informatColor1 {
    color: #df971a;
  }
  .informatColor2 {
    color: #dd4c4d;
    font-size: 14px;
  }
  .subtotal_Sty {
    border-top: 1px dashed #e6e6e6;
    padding: 16px 0px 14px;
    margin-top: 15px;
  }
  .subtotal_Sty1 {
    border-top: 1px solid #e9e9e9;
    padding-top: 16px;
    margin-top: 24px;
  }
  .subtotal_Sty2 {
    border-top: 1px dashed #e6e6e6;
    padding-top: 16px;
    margin-top: 16px;
    width: 100%;
  }
  .subtotal_Seat {
    float: right;
    font-size: 14px;
  }
  .informatAmount {
    padding-top: 24px;
  }
  .contentRefund1 {
    padding-top: 16px;
  }
  .informatContent1 {
    color: rgba(1, 6, 33, 0.9);
    font-weight: 600;
    font-size: 14px;
  }
  .informatPhoto {
    font-size: 16px;
    color: var(--color-primary);
    margin-right: 5px;
    cursor: pointer;
  }
  .editgoodRefund {
    padding: 16px 0px;
  }
  .editRefund {
    padding: 16px 0px;
    border-top: 1px dashed #e6e6e6;
    border-bottom: 1px solid #e9e9e9;
  }
  .page_footer {
    width: 100%;
    text-align: right;
    background-color: #fff;
    border-top: 1px solid #e4e7ed;
    position: fixed;
    bottom: 0px;
    padding: 12px;
    right: 20px;
  }
  .editDialog {
    font-size: 14px;
    color: rgba(0, 0, 0, 0.85);
    font-weight: 600;
    margin-bottom: 12px;
  }
  .editInformat {
    font-size: 16px;
    color: rgba(1, 6, 33, 0.9);
    font-weight: 600;
    margin-top: 24px;
  }
  .eltable {
    border: 1px solid #e9e9e9;
    margin-top: 16px;
  }
  .elimage {
    width: 14px;
    height: 14px;
  }
  .refond_Price {
    position: absolute;
    right: 12px;
    font-size: 14px;
    color: rgba(1, 6, 33, 0.75);
    border-left: 1px solid rgba(0, 0, 0, 0.15);
    padding-left: 12px;
  }
  .refond_Rules {
    position: absolute;
    right: -180px;
    font-size: 14px;
    color: #dd4c4d;
  }
  .search-form-border {
    display: inline-block;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
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
  .input_sty {
    position: absolute;
    top: 12px;
    right: 14px;
    font-size: 14px;
    color: rgba(1, 6, 33, 0.75);
  }
  .input_sty1 {
    font-size: 14px;
    color: rgba(1, 6, 33, 0.75);
  }
  .btn_Seat {
    margin-left: 8px;
  }
  .but_sty {
    margin-left: 5px;
    border: 1px solid var(--color-primary);
    color: var(--color-primary);
  }
  .input_wid {
    width: 100%;
  }
  .yc_btn_sty {
    color: #0ba198;
    font-size: 14px;
    cursor: pointer;
  }
  .kz_seat {
    display: flex;
    justify-content: flex-end;
  }
}
.change_tag {
  color: #fff !important;
  background-color: #0ba198;
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
.select2 {
  .el-input__inner {
    border-left: none;
    border-top-left-radius: 0px !important;
    border-bottom-left-radius: 0px !important;
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
.marginform {
  height: 450px;
  overflow: hidden;
}
.creditLineBottom {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid rgba(1, 6, 33, 0.06);
  padding: 5px;
}
::v-deep .el-dialog__body {
  padding: 16px 20px;
}
::v-deep .header_sty {
  color: rgba(1, 6, 33, 0.9);
}
.zh_dialog {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  padding: 12px 0px;
}
.zh_dialog_sty {
  margin: 12px 0;
}
.zh_dialog_close {
  margin-right: 10px;
}
.hj_sty {
  padding-bottom: 15px;
}
.hj_sty1 {
  border-top: 1px dashed #e6e6e6;
  padding: 16px 0px;
}
.informatTitle1 {
  color: rgba(1, 6, 33, 0.55);
  font-size: 14px;
  display: inline-block;
  width: 240px;
}
</style>
