<template>
  <Container footer>
    <h4>
      商品信息<el-button
        type="primary"
        size="mini"
        @click="selectedGoods"
        icon="el-icon-plus"
        style="margin-left: 15px"
        >选择商品</el-button
      >
    </h4>
    <div
      style="
        margin-top: 15px;
        background: #f5f5f7;
        padding: 15px;
        color: rgba(1, 6, 33, 0.55);
      "
    >
      <el-row v-if="isshowClass.result">
        <el-col :span="2">全部结果</el-col>
        <el-col :span="17">
          <el-tag
            style="margin-right: 20px"
            v-for="tag in checkedResult"
            :key="tag.name"
            closable
            @close="handleCloseTag(tag)"
            type="info"
          >
            {{ tag.name }}
          </el-tag>
        </el-col>
      </el-row>
      <el-row v-if="isshowClass.type" style="margin-top: 15px">
        <el-col :span="1">分类</el-col>
        <el-col :span="18" v-if="isshowClass.class1">
          <el-button
            type="text"
            v-for="(item, index) in classifyName1"
            :key="'fenlei' + index"
            style="color: #010621; margin: 0px 30px; padding: 0px"
            @click="checkclass1(item)"
            >{{ item.name }}</el-button
          >
        </el-col>
        <el-col :span="18" v-if="isshowClass.class2">
          <el-button
            type="text"
            v-for="(item, index) in classifyName2"
            :key="'fenlei' + index"
            style="color: #010621; margin: 0px 30px; padding: 0px"
            @click="checkclass2(item)"
            >{{ item.name }}</el-button
          >
        </el-col>
        <el-col :span="18" v-if="isshowClass.class3">
          <el-button
            type="text"
            v-for="(item, index) in classifyName3"
            :key="'fenlei' + index"
            style="color: #010621; margin: 0px 30px; padding: 0px"
            @click="checkclass3(item)"
            >{{ item.name }}</el-button
          >
        </el-col>
      </el-row>
    </div>
    <el-table
      :data="tableData"
      height="400px"
      style="border: 1px solid #e9e9e9; margin-top: 15px"
      ref="tableData"
    >
      <el-table-column label="分类" prop="categoryName"></el-table-column>
      <el-table-column label="品种/品牌" prop="variety"></el-table-column>
      <el-table-column label="产地" prop="regionName"></el-table-column>
      <el-table-column label="级别/规格" prop="spec"></el-table-column>
      <el-table-column label="当前库存">
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
                scope.row.batchCount,
                scope.row.basketCount,
                scope.row.pieceCount
              )
            "
          ></span>
        </template>
      </el-table-column>
      <el-table-column label="盘点后库存">
        <template slot-scope="scope">
          <div v-if="getgoodafternums(scope.row.productId) == 0 ? false : true">
            <span
              v-html="
                getStock(
                  scope.row.subUnit,
                  scope.row.subUnit2,
                  scope.row.subUnit3,
                  scope.row.pieceUnit,
                  scope.row.subUnit2Weight,
                  scope.row.subUnit3Weight,
                  getgoodafternums(scope.row.productId),
                  getgoodafterbasket(scope.row.productId),
                  getgoodafterpieceUnit(scope.row.productId)
                )
              "
            ></span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="selectBatch(scope.row.productId)" type="text"
            >选择批次</el-button
          >
          <el-button
            @click="showBatchBtn(scope.row), getBatch2(scope.row)"
            type="text"
            >展开批次</el-button
          >
        </template>
      </el-table-column>
      <el-table-column label="" type="expand" width="1">
        <template slot-scope="scope">
          <div style="width: 90%; float: right">
            <el-table :data="filterBatch(scope.row.productId)">
              <el-table-column label="入库时间">
                <template slot-scope="scope2">
                  {{ toDate(scope2.row.timestamp) }}
                </template>
              </el-table-column>
              <el-table-column label="入库类型">
                <template slot-scope="scope2">
                  <span style="color: #1a7fd9">{{
                    scope2.row.batchsourcename
                  }}</span>
                </template>
              </el-table-column>
              <el-table-column label="当前库存">
                <template slot-scope="scope2">
                  <span
                    v-html="
                      getStock(
                        batchMsgExtend.subunit,
                        batchMsgExtend.subUnit2,
                        batchMsgExtend.subUnit3,
                        batchMsgExtend.pieceunit,
                        batchMsgExtend.subUnit2Weight,
                        batchMsgExtend.subUnit3Weight,
                        scope2.row.batchnumber,
                        scope2.row.basketnumber,
                        scope2.row.piecenumber
                      )
                    "
                  ></span>
                </template>
              </el-table-column>
              <el-table-column label="盘点后库存">
                <template slot-scope="scope2">
                  <span
                    v-if="scope2.row.floatType"
                    v-html="
                      getStock(
                        batchMsgExtend.subunit,
                        batchMsgExtend.subUnit2,
                        batchMsgExtend.subUnit3,
                        batchMsgExtend.pieceunit,
                        batchMsgExtend.subUnit2Weight,
                        batchMsgExtend.subUnit3Weight,
                        scope2.row.afternumber,
                        scope2.row.afterbasket,
                        scope2.row.afterpieceunitnums
                      )
                    "
                  ></span>
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope2">
                  <el-button type="text" @click="delBatch(scope2.row.batchid)"
                    >移除</el-button
                  >
                  <el-button type="text" @click="overFlow(scope2.row)"
                    >报溢</el-button
                  >
                  <el-button type="text" @click="breakage(scope2.row)"
                    >报损</el-button
                  >
                  <el-button type="text" @click="noerror(scope2.row)"
                    >无误差</el-button
                  >
                  <el-button type="text" @click="details(scope.row, scope2.row)"
                    >详情</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <div
      style="padding: 10px; background: rgba(1, 6, 33, 0.02)"
      v-if="tableData.length > 0"
    >
      合计：
      <div style="text-align: right; display: inline-block; width: 94%">
        盘点商品数量{{ tableData.length }}种
      </div>
    </div>
    <h4 style="margin-top: 20px">备注</h4>
    <el-input
      type="textarea"
      placeholder="请输入内容"
      v-model="remark"
      maxlength="200"
      style="width: 50%"
      rows="5"
      resize="none"
      show-word-limit
    >
    </el-input>
    <div style="height: 100px"></div>
    <!--  -->
    <template #footer>
      <el-button size="mini" @click="submit('1')">确认并查看</el-button>
      <el-button type="primary" size="mini" @click="submit('2')"
        >确认并返回</el-button
      >
    </template>

    <!-- <div class="page_footer">
      
    </div> -->
    <!-- ***************************************************************************************************************************************************** -->
    <!-- ***************************************************************************************************************************************************** -->
    <!-- ***************************************************************************************************************************************************** -->
    <!-- ***************************************************************************************************************************************************** -->
    <!-- ***************************************************************************************************************************************************** -->
    <!-- ***************************************************************************************************************************************************** -->
    <!-- ***************************************************************************************************************************************************** -->
    <!-- ***************************************************************************************************************************************************** -->
    <el-dialog
      title="批次详情"
      :visible.sync="detailsDialog"
      width="1100px"
      :before-close="detailsDialogClose"
    >
      <div>
        <el-row>
          <el-col style="margin-bottom: 15px"
            >{{ goodsDetail.categoryName ? goodsDetail.categoryName : "" }}
            {{
              goodsDetail.productName != "" ? "-" + goodsDetail.productName : ""
            }}
            {{ goodsDetail.variety ? "|" + goodsDetail.variety : "" }}</el-col
          >
        </el-row>
        <el-row>
          <el-col :span="4">产地：{{ goodsDetail.regionName }}</el-col>
          <el-col :span="4">级别/规格：{{ goodsDetail.spec }}</el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <h4 style="margin-bottom: 15px">批次信息</h4>
          <el-col :span="6"
            >入库时间:{{ toDate(batchDetail.timestamp) }}</el-col
          >
          <el-col :span="6">入库类型:{{ batchDetail.batchsourcename }}</el-col>
          <el-col :span="6"
            >当前库存:<span
              v-html="
                getStock(
                  goodsDetail.subUnit,
                  goodsDetail.subUnit2,
                  goodsDetail.subUnit3,
                  goodsDetail.pieceUnit,
                  goodsDetail.subUnit2Weight,
                  goodsDetail.subUnit3Weight,
                  batchDetail.batchnumber,
                  batchDetail.basketnumber,
                  batchDetail.piecenumber
                )
              "
            >
            </span
          ></el-col>
        </el-row>
        <el-row style="margin-top: 15px" v-if="batchDetail.floatType == 1">
          <el-col :span="6"
            >报溢数量:<span
              v-html="
                getStock(
                  goodsDetail.subUnit,
                  goodsDetail.subUnit2,
                  goodsDetail.subUnit3,
                  goodsDetail.pieceUnit,
                  goodsDetail.subUnit2Weight,
                  goodsDetail.subUnit3Weight,
                  batchDetail.afternumber - batchDetail.batchnumber,
                  batchDetail.afterbasket - batchDetail.basketnumber,
                  batchDetail.afterpieceunitnums - batchDetail.piecenumber
                )
              "
            >
            </span
          ></el-col>
          <el-col :span="6">报溢筐子:{{ batchDetail.overflowCount }}个</el-col>
          <el-col :span="6">使用自家筐子:{{ batchDetail.ownCount }}个</el-col>
        </el-row>
        <el-row style="margin-top: 15px" v-if="batchDetail.floatType == 2">
          <el-col :span="6"
            >入库成本单价:{{
              batchDetail.costPrice + "元/" + goodsDetail.subUnit
            }}</el-col
          >
          <el-col :span="6"
            >报损数量:<span
              v-html="
                getStock(
                  goodsDetail.subUnit,
                  goodsDetail.subUnit2,
                  goodsDetail.subUnit3,
                  goodsDetail.pieceUnit,
                  goodsDetail.subUnit2Weight,
                  goodsDetail.subUnit3Weight,
                  batchDetail.batchnumber - batchDetail.afternumber,
                  batchDetail.basketnumber - batchDetail.afterbasket,
                  batchDetail.piecenumber - batchDetail.afterpieceunitnums
                )
              "
            >
            </span
          ></el-col>
          <el-col :span="6"
            >报损金额:{{
              batchDetail.costPrice *
              (batchDetail.batchnumber - batchDetail.afternumber)
            }}元</el-col
          >
        </el-row>
        <el-row style="margin-top: 15px" v-if="batchDetail.floatType == 3">
          <el-col :span="6">盘点无误差</el-col>
        </el-row>
      </div>
    </el-dialog>
    <el-dialog
      title="报损"
      :visible.sync="breakageDialog"
      width="1100px"
      :before-close="breakageDialogClose"
    >
      <div>
        <el-row>
          <h4>商品信息</h4>
          <el-col>{{ breakageGoodsMsg.name }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">产地：{{ breakageGoodsMsg.regionName }}</el-col>
          <el-col :span="4">级别/规格：{{ breakageGoodsMsg.spec }}</el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <h4>批次信息</h4>
          <el-col :span="6"
            >入库时间：{{ toDate(breakagebatchmsg.timestamp) }}</el-col
          >
          <el-col :span="4"
            >入库类型：{{ breakagebatchmsg.batchsourcename }}</el-col
          >
          <el-col :span="4"
            >当前库存：<span
              v-html="
                getStock(
                  breakageGoodsMsg.subUnit,
                  breakageGoodsMsg.subUnit2,
                  breakageGoodsMsg.subUnit3,
                  breakageGoodsMsg.pieceUnit,
                  breakageGoodsMsg.subUnit2Weight,
                  breakageGoodsMsg.subUnit3Weight,
                  breakagebatchmsg.batchnumber,
                  breakagebatchmsg.basketnumber,
                  breakagebatchmsg.piecenumber
                )
              "
            ></span
          ></el-col>
          <el-col :span="4"
            >入库成本单价：{{
              breakagebatchmsg.costPrice + "元/" + breakageGoodsMsg.subUnit
            }}</el-col
          >
        </el-row>
        <el-divider></el-divider>
        <el-form
          :model="form2"
          :rules="rules"
          label-position="left"
          ref="form2"
        >
          <el-row>
            <el-col :span="10" style="position: relative">
              <el-form-item label="报损数量" prop="Nums">
                <el-input
                  v-model.number="form2.Nums"
                  size="mini"
                  style="width: 50%"
                >
                  <i
                    slot="suffix"
                    style="
                      color: #010621;
                      font-size: 14px;
                      font-family: PingFangSC-Regular, PingFang SC;
                    "
                    >{{ breakageGoodsMsg.subUnit }}</i
                  >
                </el-input>
                <el-button
                  @click="batchWeight2"
                  type="text"
                  style="position: absolute"
                  v-if="
                    breakageGoodsMsg.subUnit == '斤' ||
                    breakageGoodsMsg.subUnit == '公斤' ||
                    breakageGoodsMsg.subUnit == 'g'
                  "
                >
                  批量过磅
                </el-button>
              </el-form-item>
            </el-col>
            <el-col :span="10" v-if="form2.pieceUnit != ''">
              <el-form-item label="报损件数" prop="PieceNums">
                <el-input
                  v-model.number="form2.PieceNums"
                  size="mini"
                  style="width: 50%"
                >
                  <i
                    slot="suffix"
                    :class="{
                      font_styl2: breakageGoodsMsg.pieceUnit == '筐(周转筐)',
                    }"
                  >
                    {{
                      breakageGoodsMsg.pieceUnit == "筐(周转筐)" || "筐(一次性)"
                        ? "筐"
                        : breakageGoodsMsg.pieceUnit
                    }}</i
                  >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <h4>周转筐信息</h4>
          <div
            v-for="(item, index) in form2.basketArr"
            :key="'name' + index"
            style="margin-top: 15px"
          >
            <h5 style="margin-bottom: 15px">
              【{{ item.basketType }}】{{ item.basketName }}
            </h5>
            <el-row
              v-for="(coloritem, colorindex) in item.info"
              :key="'color' + colorindex"
            >
              <el-col :span="2" style="color: #0ba198">
                <el-form-item> [{{ coloritem.basketColor }}] </el-form-item>
              </el-col>
              <el-col :span="3">
                <el-form-item> 载货:{{ coloritem.nums }}个 </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item
                  label="腾空:"
                  required
                  label-width="30%"
                  :prop="'basketArr.' + index + '.info.' + colorindex"
                  :rules="rules.soar"
                >
                  <el-input
                    v-model.number="coloritem.soar"
                    style="width: 70%; margin-top: 3px"
                    size="mini"
                  >
                    <template slot="append">个</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </div>
          <el-divider></el-divider>
          <p
            style="
              text-align: right;
              height: 22px;
              font-size: 16px;
              font-weight: 500;
              color: rgba(1, 6, 33, 0.9);
            "
          >
            共腾空{{ sumSoar }}个筐子
          </p>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="breakageDialogClose" size="mini">取 消</el-button>
        <el-button
          type="primary"
          @click="breakageDialogSubmit(breakagebatchmsg)"
          size="mini"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="报溢"
      :visible.sync="theOverflowDialog"
      width="1100px"
      :before-close="theOverflowDialogClose"
    >
      <div>
        <el-row>
          <h4>商品信息</h4>
          <el-col :span="20">{{ goodsmsg.name }}</el-col>
        </el-row>
        <el-row>
          <el-col :span="4">产地：{{ goodsmsg.regionName }}</el-col>
          <el-col :span="4">级别/规格：{{ goodsmsg.spec }}</el-col>
        </el-row>
        <el-divider></el-divider>
        <el-row>
          <h4>批次信息</h4>
          <el-col :span="6">入库时间：{{ toDate(batchmsg.timestamp) }}</el-col>
          <el-col :span="4">入库类型：{{ batchmsg.batchsourcename }}</el-col>
          <el-col :span="4"
            >当前库存：<span
              v-html="
                getStock(
                  goodsmsg.subUnit,
                  goodsmsg.subUnit2,
                  goodsmsg.subUnit3,
                  goodsmsg.pieceUnit,
                  goodsmsg.subUnit2Weight,
                  goodsmsg.subUnit3Weight,
                  batchmsg.batchnumber,
                  batchmsg.basketnumber,
                  batchmsg.piecenumber
                )
              "
            ></span
          ></el-col>
        </el-row>
        <el-divider></el-divider>
        <h4 v-if="batchGetBasket.length > 0">载货筐子</h4>
        <el-row
          v-if="batchGetBasket.length > 0"
          class="layout_styl_1 font_styl_1"
        >
          <el-col
            :span="5"
            v-for="(item, index) in batchGetBasket"
            :key="'batchGetBasket' + index"
          >
            <span>【{{ item.basketType }}】</span
            ><span>{{ item.basketName }}</span
            ><span style="margin-right: 10px">[{{ item.basketColor }}]</span>
            <span>{{ item.nums }}个</span>
          </el-col>
        </el-row>
        <el-divider v-if="batchGetBasket.length > 0"></el-divider>
        <el-form
          :model="form"
          :rules="rules"
          inline
          label-width="100%"
          label-position="left"
          ref="form"
        >
          <el-row>
            <el-col :span="6">
              <el-form-item label="选择计件单位：" prop="pieceUnit">
                <el-select
                  v-model="form.pieceUnit"
                  placeholder="请选择"
                  size="mini"
                >
                  <el-option
                    v-for="item in pieceUnitoptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" style="position: relative">
              <el-form-item label="报溢数量" prop="theOverflowNums">
                <el-input v-model.number="form.theOverflowNums" size="mini">
                  <i
                    slot="suffix"
                    style="
                      color: #010621;
                      font-size: 14px;
                      font-family: PingFangSC-Regular, PingFang SC;
                    "
                    >{{ goodsmsg.subUnit }}</i
                  >
                </el-input>
                <el-button
                  @click="batchWeight"
                  type="text"
                  style="position: absolute"
                  v-if="
                    goodsmsg.subUnit == '斤' ||
                    goodsmsg.subUnit == '公斤' ||
                    goodsmsg.subUnit == 'g'
                  "
                >
                  批量过磅
                </el-button>
              </el-form-item>
            </el-col>
            <el-col :span="6" v-if="form.pieceUnit != '无'">
              <el-form-item label="报溢件数" prop="theOverflowPieceNums">
                <el-input
                  v-model.number="form.theOverflowPieceNums"
                  size="mini"
                >
                  <i
                    slot="suffix"
                    :class="{ font_styl2: form.pieceUnit == '筐(周转筐)' }"
                  >
                    {{
                      form.pieceUnit == "筐(周转筐)" || "筐(一次性)"
                        ? "筐"
                        : form.pieceUnit
                    }}</i
                  >
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24" style="position: relative">
              <el-form-item
                label="是否去皮"
                prop="isQp"
                v-if="
                  goodsmsg.subUnit == '斤' ||
                  goodsmsg.subUnit == '公斤' ||
                  goodsmsg.subUnit == 'g'
                "
              >
                <el-radio-group
                  v-model="form.isQp"
                  size="mini"
                  @change="cutIsQp"
                >
                  <el-radio-button label="去皮"></el-radio-button>
                  <el-radio-button label="不去皮"></el-radio-button>
                </el-radio-group>
              </el-form-item>
              <div class="btn_opsition">
                <el-button
                  size="mini"
                  class="btn_style"
                  @click="getOverFlowBasket"
                  >+ 报溢筐子</el-button
                >
                <el-button size="mini" class="btn_style" @click="getOwnBasket"
                  >+ 添加自家筐子</el-button
                >
              </div>
            </el-col>
          </el-row>
          <div
            style="
              box-shadow: 0px 6px 16px 0px rgba(0, 0, 0, 0.08),
                0px 3px 6px -4px rgba(0, 0, 0, 0.12);
              border-radius: 8px;
              padding: 15px 15px;
            "
            v-if="
              form.modellist.overflowbasker.length > 0 ||
              form.modellist.ownbasket.length > 0
            "
          >
            <div v-if="form.modellist.overflowbasker.length > 0">
              <div
                v-for="(overflowitem, overflowindex) in form.modellist
                  .overflowbasker"
                :key="'overflow' + overflowindex"
                style="border-bottom: 1px solid #e6e6e6; padding-bottom: 15px"
              >
                <p>
                  【{{ overflowitem.basketType }}】{{ overflowitem.basektName
                  }}<el-button plain type="danger" size="mini" class="btn_styl2"
                    >报溢筐子</el-button
                  >
                </p>
                <div
                  v-for="(
                    overflowcoloritem, overflowcolorindex
                  ) in overflowitem.modellist"
                  :key="'overflowcolor' + overflowcolorindex"
                  style="margin-top: 15px"
                >
                  <span style="color: #00a499"
                    >[{{ overflowcoloritem.color }}]</span
                  >
                  <el-button
                    type="text"
                    style="color: red"
                    @click="basketDel(1, overflowindex, overflowcolorindex)"
                    >移除</el-button
                  >
                  <br />
                  <el-form-item
                    label="报溢:"
                    :prop="
                      'modellist.overflowbasker.' +
                      overflowindex +
                      '.modellist.' +
                      overflowcolorindex +
                      '.nums'
                    "
                    :rules="rules.nums"
                  >
                    <el-input
                      v-model.number="overflowcoloritem.nums"
                      size="mini"
                    >
                      <i
                        slot="suffix"
                        style="
                          color: #010621;
                          font-size: 14px;
                          font-family: PingFangSC-Regular, PingFang SC;
                        "
                        >个</i
                      >
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    label="重量:"
                    :prop="
                      'modellist.overflowbasker.' +
                      overflowindex +
                      '.modellist.' +
                      overflowcolorindex +
                      '.weight'
                    "
                    v-if="form.isQp == '去皮'"
                    :rules="rules.weight"
                  >
                    <el-input
                      v-model.number="overflowcoloritem.weight"
                      size="mini"
                    >
                      <i
                        slot="suffix"
                        style="
                          color: #010621;
                          font-size: 14px;
                          font-family: PingFangSC-Regular, PingFang SC;
                        "
                        >个/斤</i
                      >
                    </el-input>
                  </el-form-item>
                </div>
              </div>
            </div>
            <div v-if="form.modellist.ownbasket.length > 0">
              <div
                v-for="(ownitem, ownindex) in form.modellist.ownbasket"
                :key="'own' + ownindex"
                style="border-bottom: 1px solid #e6e6e6; padding: 15px 0"
              >
                <p>
                  【{{ ownitem.basketType }}】{{ ownitem.basektName
                  }}<el-button type="warning" plain size="mini"
                    >自家筐子</el-button
                  >
                  空置数量：{{ ownitem.nums }}个
                </p>
                <div
                  v-for="(owncoloritem, owncolorindex) in ownitem.modellist"
                  :key="'owncolor' + owncolorindex"
                  style="margin-top: 15px"
                >
                  <span style="color: #00a499">[{{ owncoloritem.color }}]</span>
                  空置数量：{{ owncoloritem.nullvalue }}个
                  <el-button
                    type="text"
                    style="color: red"
                    @click="basketDel(2, ownindex, owncolorindex)"
                    >移除</el-button
                  >
                  <br />
                  <el-form-item
                    label="使用:"
                    :prop="
                      'modellist.ownbasket.' +
                      ownindex +
                      '.modellist.' +
                      owncolorindex +
                      '.nums'
                    "
                    :rules="rules.nums"
                  >
                    <el-input v-model.number="owncoloritem.nums" size="mini">
                      <i
                        slot="suffix"
                        style="
                          color: #010621;
                          font-size: 14px;
                          font-family: PingFangSC-Regular, PingFang SC;
                        "
                        >个</i
                      >
                    </el-input>
                  </el-form-item>
                  <el-form-item
                    label="重量:"
                    :prop="
                      'modellist.ownbasket.' +
                      ownindex +
                      '.modellist.' +
                      owncolorindex +
                      '.weight'
                    "
                    v-if="form.isQp == '去皮'"
                    :rules="rules.weight"
                  >
                    <el-input v-model.number="owncoloritem.weight" size="mini">
                      <i
                        slot="suffix"
                        style="
                          color: #010621;
                          font-size: 14px;
                          font-family: PingFangSC-Regular, PingFang SC;
                        "
                        >个/斤</i
                      >
                    </el-input>
                  </el-form-item>
                </div>
              </div>
            </div>
            <div
              style="text-align: right; padding: 10px, 10px; margin-top: 15px"
            >
              <span
                v-if="form.modellist.overflowbasker.length > 0"
                style="margin-right: 20px"
                >报溢筐子{{ getsumoverflow }}个</span
              >
              <span
                v-if="form.modellist.ownbasket.length > 0"
                style="margin-right: 20px"
                >使用自家筐子{{ getsumown }}个</span
              >
              <span v-if="form.isQp == '去皮'" style="margin-right: 20px"
                >总重{{ getsumweight }}斤</span
              >
            </div>
          </div>
        </el-form>
        <div style="height: 100px"></div>
        <div
          slot="footer"
          class="dialog-footer"
          style="margin-bottom: 15px; text-align: right"
        >
          <el-button @click="theOverflowDialogClose" size="mini"
            >取 消</el-button
          >
          <el-button
            type="primary"
            size="mini"
            @click="theOverflowSubmit(batchmsg)"
            >确 定</el-button
          >
        </div>
      </div>
    </el-dialog>
    <el-dialog
      title="新建盘点-选择商品"
      :visible.sync="selectedGoodsDialog"
      width="1100px"
      :before-close="selectedGoodsDialogClose"
    >
      <el-row>
        <el-col :span="6">
          <el-cascader
            size="mini"
            v-model="selectedgoodsQueryData.type"
            :options="options1"
            placeholder="商品分类"
            clearable
            :props="{
              value: 'categoryId',
              label: 'categoryName',
              children: 'childList',
            }"
          ></el-cascader>
        </el-col>
        <el-col :span="6">
          <el-cascader
            placeholder="产地"
            :options="options2"
            clearable
            size="mini"
            v-model="selectedgoodsQueryData.place"
            :props="{ value: 'rid', label: 'name', children: 'childList' }"
          >
            <template slot-scope="{ data }">
              <span>{{ data.name }}</span>
            </template>
          </el-cascader>
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="selectedgoodsQueryData.variety"
            size="mini"
            style="width: 80%"
            placeholder="请输入商品品种/品牌"
          ></el-input>
        </el-col>
        <el-col :span="6">
          <el-input
            v-model="selectedgoodsQueryData.spec"
            size="mini"
            style="width: 80%"
            placeholder="请输入商品级别/规格"
          ></el-input>
        </el-col>
      </el-row>
      <el-row style="margin-top: 20px">
        <el-col :span="6">
          <el-button size="mini" @click="reset">重置</el-button>
          <el-button size="mini" type="primary" @click="getGoodsList"
            >查询</el-button
          >
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-tabs
        v-model="selectedgoodsQueryData.isStock"
        type="card"
        @tab-click="changeTabs"
      >
        <el-tab-pane
          :label="'全部(' + stocknums.num1 + ')'"
          name="0"
        ></el-tab-pane>
        <el-tab-pane
          :label="'有库存(' + stocknums.num2 + ')'"
          name="1"
        ></el-tab-pane>
        <el-tab-pane
          :label="'无库存(' + stocknums.num3 + ')'"
          name="2"
        ></el-tab-pane>
      </el-tabs>
      <el-table
        :data="selectedGoodTableData"
        height="400px"
        style="border: 1px solid #e9e9e9; margin-top: -16px"
        ref="selectgoodstable"
        @selection-change="handleSelectionChange"
        :row-key="getRowKeys"
      >
        <el-table-column
          width="55"
          type="selection"
          :selectable="selectable"
          :reserve-selection="true"
        ></el-table-column>
        <el-table-column label="品种/品牌" prop="variety"></el-table-column>
        <el-table-column label="分类" prop="categoryName"></el-table-column>
        <el-table-column label="产地" prop="regionName"></el-table-column>
        <el-table-column label="级别/规格" prop="spec"></el-table-column>
        <el-table-column label="当前库存" width="230">
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
                  scope.row.batchCount,
                  scope.row.basketCount,
                  scope.row.pieceCount
                )
              "
            ></span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="getBatch(scope.row)" type="text">{{
              scope.row.isshow == false ? "展开批次" : "收起批次"
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column label="" type="expand" width="1">
          <template>
            <div style="width: 90%; float: right">
              <el-table
                label-position="center"
                :data="selectedBatchData"
                ref="selectbatchtable"
                @selection-change="handleSelectionChange2"
                :row-key="getRowKeys2"
              >
                <el-table-column
                  label="选择"
                  width="60"
                  type="selection"
                  :selectable="selectable2"
                ></el-table-column>
                <el-table-column label="入库时间">
                  <template slot-scope="scope">
                    {{ toDate(scope.row.timestamp) }}
                  </template>
                </el-table-column>
                <el-table-column label="入库类型">
                  <template slot-scope="scope">
                    <span style="color: #1a7fd9">{{
                      scope.row.batchsourcename
                    }}</span>
                  </template>
                </el-table-column>
                <el-table-column label="商品来源">
                  <template slot-scope="scope">
                    <div class="change_tags">
                      <span v-if="scope.row.custmorName == ''">--</span>
                      <span v-if="scope.row.custmorName != ''">
                        {{ scope.row.custmorName }}
                        <el-tag type="info" v-if="scope.row.custmorType == 0"
                          >非</el-tag
                        >
                        <el-tag
                          v-if="
                            scope.row.custmorType == 11 ||
                            scope.row.custmorType == 10
                          "
                          >供</el-tag
                        >
                        <el-tag
                          type="danger"
                          v-if="
                            scope.row.custmorType == 11 ||
                            scope.row.custmorType == 7
                          "
                          >经</el-tag
                        >
                        <el-tag
                          type="warning"
                          v-if="
                            scope.row.custmorType == 3 ||
                            scope.row.custmorType == 4
                          "
                          >采</el-tag
                        >
                      </span>
                      <span v-if="scope.row.custmorPhone != ''">{{
                        "-" + scope.row.custmorPhone
                      }}</span>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="当前库存">
                  <template slot-scope="scope">
                    <span
                      v-html="
                        getStock(
                          batchMsgExtend.subunit,
                          batchMsgExtend.subUnit2,
                          batchMsgExtend.subUnit3,
                          batchMsgExtend.pieceunit,
                          batchMsgExtend.subUnit2Weight,
                          batchMsgExtend.subUnit3Weight,
                          scope.row.batchnumber,
                          scope.row.basketnumber,
                          scope.row.piecenumber
                        )
                      "
                    ></span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right">
        <el-pagination
          v-if="selectedgoodsQueryData.total > 0"
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
          :total="selectedgoodsQueryData.total"
          :page-size="selectedgoodsQueryData.pagesize"
          :current-page.sync="selectedgoodsQueryData.pageindex"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        >
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectedGoodsDialogClose" size="mini"
          >取 消</el-button
        >
        <el-button type="primary" size="mini" @click="selectedgoodsSubmit"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      :title="
        form.subUnit != '斤' && form.subUnit != '公斤' && form.subUnit != 'g'
          ? '批量计件'
          : '批量过磅'
      "
      :visible.sync="batchWeightDialog"
      width="50%"
      :before-close="batchWeightDialogClose"
    >
      <div style="height: 400px; overflow-y: scroll">
        <h3>{{ goodsmsg.name }}</h3>
        <el-row class="layout_styl_1 font_styl_1">
          <el-col :span="6">产地：{{ goodsmsg.regionName }}</el-col>
          <el-col :span="6">级别/规格：{{ goodsmsg.spec }}</el-col>
          <el-col :span="6">计算单位：{{ goodsmsg.subUnit }}</el-col>
        </el-row>
        <el-row
          style="margin: 10px 0px"
          v-for="(item, index) in batchWeightArr"
          :key="'weight' + index"
          :gutter="30"
        >
          <el-col :span="3" style="padding-top: 5px"
            >计数{{ index + 1 }}:</el-col
          >
          <el-col :span="6">
            <el-input v-model.number="item.num1" size="mini">
              <template slot="append">{{ goodsmsg.subUnit }}</template>
            </el-input>
          </el-col>
          <el-col :span="6" v-if="form.pieceUnit != '无'">
            <el-input v-model.number="item.num2" size="mini">
              <template
                slot="append"
                :class="{ font_styl2: form.pieceUnit == '筐(周转筐)' }"
              >
                {{
                  form.pieceUnit == "筐(周转筐)" || "筐(一次性)"
                    ? "筐"
                    : form.pieceUnit
                }}
              </template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button
              type="text"
              style="color: red"
              @click="delbatchWeight(index)"
              >移除</el-button
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-button @click="addCount" size="mini">添加计数</el-button>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <span>
          {{
            form.subUnit != "斤" &&
            form.subUnit != "公斤" &&
            form.subUnit != "g"
              ? "计件总数:"
              : "过磅总数:"
          }}
          {{ getBatchWeightCount }}
          {{ goodsmsg.subUnit }}
        </span>
        <span v-if="form.pieceUnit != '无'" style="margin-right: 15px"
          >({{ getBatchWeightCount2
          }}{{
            form.pieceUnit == "筐(周转筐)" || "筐(一次性)"
              ? "筐"
              : form.pieceUnit
          }})</span
        >
        <el-button @click="batchWeightDialogClose" size="mini">取 消</el-button>
        <el-button type="primary" @click="batchWeightSubmit" size="mini"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="选择报溢筐子"
      :visible.sync="overFlowBasketDialog"
      width="30%"
      :before-close="overFlowBasketClose"
    >
      <div style="height: 400px; overflow-y: scroll">
        <div
          v-for="(item, index) in overFlowBasket"
          :key="'overflow' + index"
          style="margin-bottom: 15px"
        >
          <el-checkbox
            :indeterminate="item.isIndeterminate"
            v-model="item.checkAll"
            @change="overFlowBasketCheckAllChange(item.checkAll, index)"
            >【{{ item.basketType }}】{{ item.basektName }}</el-checkbox
          >
          <div style="margin: 10px 0"></div>
          <el-checkbox-group
            v-model="item.checkedBasket"
            @change="handleCheckedOverflowChange(item.checkedBasket, index)"
          >
            <el-checkbox
              v-for="(coloritem, index) in item.basketColor"
              :label="coloritem.color"
              :key="'color' + index"
              >{{ coloritem.color }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="overFlowBasketClose" size="mini">取 消</el-button>
        <el-button type="primary" @click="overFlowBasketSubmit" size="mini"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="选择自家筐子"
      :visible.sync="ownBasketDialog"
      width="30%"
      :before-close="ownBasketClose"
    >
      <div style="height: 400px; overflow-y: scroll">
        <div
          v-for="(item, index) in ownBasket"
          :key="'overflow' + index"
          style="margin-bottom: 15px"
        >
          <el-checkbox
            :indeterminate="item.isIndeterminate"
            v-model="item.checkAll"
            @change="ownBasketCheckAllChange(item.checkAll, index)"
            >【{{ item.basketType }}】{{ item.basektName }}</el-checkbox
          >
          <div style="margin: 10px 0"></div>
          <el-checkbox-group
            v-model="item.checkedBasket"
            @change="handleCheckedOwnChange(item.checkedBasket, index)"
          >
            <el-checkbox
              v-for="(coloritem, index) in item.basketColor"
              :label="coloritem.basketcolor"
              :key="'color' + index"
              >[{{ coloritem.basketcolor }}] &nbsp;&nbsp;&nbsp;&nbsp;
              {{ "空置数量" + coloritem.nums + "个" }}</el-checkbox
            >
          </el-checkbox-group>
        </div>
        <div style="margin-top: 15px">
          <el-button size="mini" @click="toAddBasket(1)">+ 购入筐子</el-button>
          <el-button size="mini" @click="toAddBasket(2)">+ 添加筐子</el-button>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ownBasketClose" size="mini">取 消</el-button>
        <el-button type="primary" @click="ownBasketSubmit" size="mini"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="批量过磅"
      :visible.sync="batchWeightDialog2"
      width="50%"
      :before-close="batchWeightDialogClose2"
    >
      <div style="height: 400px; overflow-y: scroll">
        <h3>{{ breakageGoodsMsg.name }}</h3>
        <el-row class="layout_styl_1 font_styl_1">
          <el-col :span="6">产地：{{ breakageGoodsMsg.regionName }}</el-col>
          <el-col :span="6">级别/规格：{{ breakageGoodsMsg.spec }}</el-col>
          <el-col :span="6">计算单位：{{ breakageGoodsMsg.subUnit }}</el-col>
        </el-row>
        <el-row
          style="margin: 10px 0px"
          v-for="(item, index) in batchWeightArr2"
          :key="'weight' + index"
          :gutter="30"
        >
          <el-col :span="3" style="padding-top: 5px"
            >计数{{ index + 1 }}:</el-col
          >
          <el-col :span="6">
            <el-input v-model.number="item.num1" size="mini">
              <template slot="append">{{ breakageGoodsMsg.subUnit }}</template>
            </el-input>
          </el-col>
          <el-col :span="6" v-if="breakageGoodsMsg.pieceUnit != '无'">
            <el-input v-model.number="item.num2" size="mini">
              <template
                slot="append"
                :class="{
                  font_styl2: breakageGoodsMsg.pieceUnit == '筐(周转筐)',
                }"
              >
                {{
                  breakageGoodsMsg.pieceUnit == "筐(周转筐)" || "筐(一次性)"
                    ? "筐"
                    : breakageGoodsMsg.pieceUnit
                }}
              </template>
            </el-input>
          </el-col>
          <el-col :span="3">
            <el-button
              type="text"
              style="color: red"
              @click="delbatchWeight2(index)"
              >移除</el-button
            >
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="20">
            <el-button @click="addCount2" size="mini">添加计数</el-button>
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <span>
          {{
            breakageGoodsMsg.subUnit != "斤" &&
            breakageGoodsMsg.subUnit != "公斤" &&
            breakageGoodsMsg.subUnit != "g"
              ? "计件总数:"
              : "过磅总数:"
          }}
          {{ getBatchWeightCount3 }}
          {{ breakageGoodsMsg.subUnit }}
        </span>
        <span v-if="form.pieceUnit != '无'" style="margin-right: 15px"
          >({{ getBatchWeightCount4
          }}{{
            form.pieceUnit == "筐(周转筐)" || "筐(一次性)"
              ? "筐"
              : form.pieceUnit
          }})</span
        >
        <el-button @click="batchWeightDialogClose2" size="mini"
          >取 消</el-button
        >
        <el-button type="primary" @click="batchWeightSubmit2" size="mini"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="选择批次"
      :visible.sync="selectBatchDialog"
      width="80%"
      :before-close="selectBatchDialogClose"
    >
      <el-table
        :data="selectBatchTableData"
        height="300px"
        style="border: 1px solid #e9e9e9"
        @selection-change="handleSelectionChange3"
        :row-key="getRowKeys3"
        ref="table3"
      >
        <el-table-column
          type="selection"
          :selectable="selectable3"
          :reserve-selection="true"
        ></el-table-column>
        <el-table-column label="入库时间">
          <template slot-scope="scope">
            {{ toDate(scope.row.timestamp) }}
          </template>
        </el-table-column>
        <el-table-column label="入库类型">
          <template slot-scope="scope">
            {{ scope.row.batchsourcename }}
          </template>
        </el-table-column>
        <el-table-column label="入库数量">
          <template slot-scope="scope">
            <span
              v-html="
                getStock(
                  batchMsg.subunit,
                  batchMsg.subUnit2,
                  batchMsg.subUnit3,
                  batchMsg.pieceunit,
                  batchMsg.subUnit2Weight,
                  batchMsg.subUnit3Weight,
                  scope.row.inCount,
                  scope.row.basketnumber,
                  scope.row.piecenumber
                )
              "
            ></span>
          </template>
        </el-table-column>
        <el-table-column label="入库来源">
          <template slot-scope="scope">
            <span v-if="scope.row.custmorName == ''">--</span>
            <span v-if="scope.row.custmorName != ''">
              {{ scope.row.custmorName }}
              <el-tag type="info" v-if="scope.row.custmorType == 0">非</el-tag>
              <el-tag
                v-if="
                  scope.row.custmorType == 11 || scope.row.custmorType == 10
                "
                >供</el-tag
              >
              <el-tag
                type="danger"
                v-if="scope.row.custmorType == 11 || scope.row.custmorType == 7"
                >经</el-tag
              >
              <el-tag
                type="warning"
                v-if="scope.row.custmorType == 3 || scope.row.custmorType == 4"
                >采</el-tag
              >
            </span>
            <span v-if="scope.row.custmorPhone != ''">{{
              "-" + scope.row.custmorPhone
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前库存">
          <template slot-scope="scope">
            <span
              v-html="
                getStock(
                  batchMsg.subunit,
                  batchMsg.subUnit2,
                  batchMsg.subUnit3,
                  batchMsg.pieceunit,
                  batchMsg.subUnit2Weight,
                  batchMsg.subUnit3Weight,
                  scope.row.batchnumber,
                  scope.row.basketnumber,
                  scope.row.piecenumber
                )
              "
            ></span>
          </template>
        </el-table-column>
        <el-table-column label="最近变动时间">
          <template slot-scope="scope">
            {{ toDate(scope.row.lastlyDate) }}
          </template>
        </el-table-column>
      </el-table>
      <template #footer>
        <el-button @click="selectBatchDialogClose" size="mini">取 消</el-button>
        <el-button type="primary" @click="submitBatch" size="mini"
          >确 定</el-button
        >
      </template>
    </el-dialog>
  </Container>
</template>
<script>
import moment from "moment";
import { getInfo } from "@/request/api/commodityDetail/index";
import {
  getRegion,
  productList,
} from "@/request/api/commodityManage/commodityList";
import { getGoodsType } from "@/request/api/takeStock/index.js";
import {
  getBatch,
  getCarryBasket,
  getOverFlowBasket,
  getOwnBasket,
  takeStock,
} from "@/request/api/theOverflow/index";
export default {
  name: "takeStock",
  data() {
    return {
      checkedBatch2: [],
      batchMsg: {},
      selectBatchTableData: [],
      selectBatchDialog: false,
      detailsDialog: false,
      goodsDetail: {},
      batchDetail: {},
      remark: "",
      batchWeightArr2: [],
      batchWeightDialog2: false,
      form2: {
        Nums: 0,
        PieceNums: 0,
        basketArr: [],
      },
      breakageBatchGetBasket: [],
      breakagebatchmsg: {},
      breakageGoodsMsg: {},
      breakageDialog: false,
      ownBasketDialog: false,
      overFlowBasket: [],
      ownBasket: [],
      overFlowBasketDialog: false,
      batchWeightDialog: false,
      batchWeightArr: [],
      form: {
        id: "",
        pieceUnit: "",
        theOverflowNums: 0,
        theOverflowPieceNums: 0,
        isQp: "去皮",
        modellist: {
          overflowbasker: [],
          ownbasket: [],
        },
      },
      rules: {},
      pieceUnitoptions: [],
      batchGetBasket: [],
      batchmsg: {},
      goodsmsg: {},
      theOverflowDialog: false,
      checkedResult: [],
      isshowClass: {
        class1: false,
        class2: false,
        class3: false,
        result: false,
        type: true,
      },
      checkedClass1: {},
      checkedClass2: {},
      checkedClass3: {},
      classifyName1: [],
      classifyName2: [],
      classifyName3: [],
      tableData2: [],
      tableData: [],
      checkedGoods: [],
      checkedBatch: [],
      batchMsgExtend: {},
      loading: false,
      selectedBatchData: [],
      stocknums: {
        num1: 0,
        num2: 0,
        num3: 0,
      },
      selectedGoodTableData: [],
      options2: [],
      options1: [],
      selectedGoodsDialog: false,
      selectedgoodsQueryData: {
        type: [],
        place: [],
        variety: "",
        spec: "",
        isStock: "0",
        pageindex: 1,
        pagesize: 10,
        total: 0,
      },
    };
  },
  watch: {
    checkedResult: {
      handler(newVal, oldVal) {
        let res = [];
        let obj = JSON.parse(JSON.stringify(this.tableData));
        if (newVal.length == 1) {
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].classifyId1 == newVal[0].value) {
              res.push(this.tableData[i]);
            }
          }
          this.tableData = res;
        } else if (newVal.length == 0) {
          res = this.tableData;
        } else if (newVal.length == 2) {
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].classifyId2 == newVal[1].value) {
              res.push(this.tableData[i]);
            }
          }
          this.tableData = res;
        } else {
          for (let i = 0; i < this.tableData.length; i++) {
            if (this.tableData[i].classifyId == newVal[2].value) {
              res.push(this.tableData[i]);
            }
          }
          this.tableData = res;
        }
      },
      deep: true,
    },
  },
  methods: {
    submitBatch() {
      let obj = this.tableData2.map((item) => {
        return item.batchid;
      });
      for (let i = 0; i < this.checkedBatch2.length; i++) {
        if (obj.indexOf(this.checkedBatch2[i].batchid) == -1) {
          this.tableData2.push(this.checkedBatch2[i]);
        }
      }
      this.selectBatchDialogClose();
    },
    selectable3(row, index) {
      let obj = this.tableData2.map((item) => {
        return item.batchid;
      });
      if (obj.indexOf(row.batchid) > -1) {
        return false;
      } else {
        return true;
      }
    },
    getRowKeys3(row) {
      return row.batchid;
    },
    handleSelectionChange3(val) {
      this.checkedBatch2 = val;
    },
    selectBatchDialogClose() {
      this.selectBatchDialog = false;
      this.selectBatchTableData = [];
      this.checkedBatch2 = [];
      this.$refs.table3.clearSelection();
    },
    selectBatch(id) {
      console.log(id);
      let params = {
        productId: id,
        type: 0,
        pageindex: 0,
        pagesize: 0,
      };
      getBatch(params).then((resp) => {
        this.selectBatchDialog = true;
        console.log(resp);
        this.selectBatchTableData = resp.data[0].modelList;
        this.batchMsg = resp.data[0];
        if (this.tableData2.length > 0) {
          this.$nextTick(() => {
            this.selectBatchTableData.forEach((row) => {
              for (let i = 0; i < this.tableData2.length; i++) {
                // console.log(this.tableData2[i].batchid, row.batchid)
                if (this.tableData2[i].batchid == row.batchid) {
                  this.$refs.table3.toggleRowSelection(row, true);
                }
              }
            });
          });
        }
      });
    },
    detailsDialogClose() {
      this.detailsDialog = false;
    },
    details(row, row2) {
      console.log(row, row2);
      this.goodsDetail = row;
      this.batchDetail = row2;
      if (!row2.floatType) {
        this.$error("该批次未操作，请操作后查看");
        return;
      }
      this.detailsDialog = true;
    },
    submit(type) {
      if (this.tableData.length < 1) {
        this.$error("您未选择商品！");
        return;
      }
      if (this.tableData2.length < 1) {
        this.$error("您未选择批次！");
        return;
      }
      for (let i = 0; i < this.tableData2.length; i++) {
        if (!this.tableData2[i].floatType) {
          this.$error("存在未处理批次！请进行报损，报溢，无误差或移除操作！");
          return;
        }
      }
      console.log(this.tableData, this.tableData2);
      let res = {
        productCount: this.tableData.length,
        remark: this.remark,
        data: [],
      };
      for (let i = 0; i < this.tableData.length; i++) {
        res.data.push({
          productId: this.tableData[i].productId,
          productName: this.tableData[i].productName,
          region: this.tableData[i].regionName,
          variety: this.tableData[i].variety,
          spec: this.tableData[i].spec,
          subUnit: this.tableData[i].subUnit,
          pieceUnit: this.tableData[i].pieceUnit,
          beforeProductCount: this.tableData[i].batchCount,
          beforeBasketCount: this.tableData[i].basketCount,
          beforePieceCount: this.tableData[i].pieceCount,
          otherinfo: "",
          batchInfo: [],
        });
      }
      for (let i = 0; i < this.tableData2.length; i++) {
        for (let j = 0; j < res.data.length; j++) {
          if (this.tableData2[i].productId == res.data[j].productId) {
            res.data[j].batchInfo.push({
              batchId: this.tableData2[i].batchid,
              batchName: this.tableData2[i].timestamp,
              beforeCount: this.tableData2[i].batchnumber,
              floatType: this.tableData2[i].floatType,
              floatCount:
                this.tableData2[i].floatType == 1
                  ? this.tableData2[i].afternumber -
                    this.tableData2[i].batchnumber
                  : this.tableData2[i].floatType == 2
                  ? this.tableData2[i].batchnumber -
                    this.tableData2[i].afternumber
                  : this.tableData2[i].batchnumber,
              floatPieceCount:
                this.tableData2[i].floatType == 1
                  ? this.tableData2[i].afterpieceunitnums -
                    this.tableData2[i].piecenumber
                  : this.tableData2[i].floatType == 2
                  ? this.tableData2[i].piecenumber -
                    this.tableData2[i].afterpieceunitnums
                  : this.tableData2[i].piecenumber,
              batchsourcename: this.tableData2[i].batchsourcename,
              productBatchSource: this.tableData2[i].batchsource,
              beforeBasketCount: this.tableData2[i].basketnumber,
              beforePieceCount: this.tableData2[i].piecenumber,
              costPrice: this.tableData2[i].costPrice,
              isPell: this.tableData2[i].isPell,
              pieceUnit: this.tableData2[i].afterpieceunit
                ? this.tableData2[i].afterpieceunit
                : "",
              newBasketInfo: [],
              allBasketInfo: [],
            });
          }
        }
      }
      for (let i = 0; i < this.tableData2.length; i++) {
        if (this.tableData2[i].floatType == 1) {
          for (let j = 0; j < res.data.length; j++) {
            if (this.tableData2[i].productId == res.data[j].productId) {
              for (let k = 0; k < res.data[j].batchInfo.length; k++) {
                if (
                  this.tableData2[i].batchid == res.data[j].batchInfo[k].batchId
                ) {
                  for (
                    let l = 0;
                    l < this.tableData2[i].newbasketmsg.overflow.length;
                    l++
                  ) {
                    for (
                      let o = 0;
                      o <
                      this.tableData2[i].newbasketmsg.overflow[l].modellist
                        .length;
                      o++
                    ) {
                      res.data[j].batchInfo[k].newBasketInfo.push({
                        basketName:
                          this.tableData2[i].newbasketmsg.overflow[l]
                            .basektName,
                        basketId:
                          this.tableData2[i].newbasketmsg.overflow[l].basketId,
                        basketColor:
                          this.tableData2[i].newbasketmsg.overflow[l].modellist[
                            o
                          ].color,
                        basketCount:
                          this.tableData2[i].newbasketmsg.overflow[l].modellist[
                            o
                          ].nums,
                        basketWeight:
                          this.tableData2[i].newbasketmsg.overflow[l].modellist[
                            o
                          ].weight,
                        basketType: 2,
                      });
                    }
                  }
                  for (
                    let l = 0;
                    l < this.tableData2[i].newbasketmsg.own.length;
                    l++
                  ) {
                    for (
                      let o = 0;
                      o <
                      this.tableData2[i].newbasketmsg.own[l].modellist.length;
                      o++
                    ) {
                      res.data[j].batchInfo[k].newBasketInfo.push({
                        basketName:
                          this.tableData2[i].newbasketmsg.own[l].basektName,
                        basketId:
                          this.tableData2[i].newbasketmsg.own[l].basketId,
                        basketColor:
                          this.tableData2[i].newbasketmsg.own[l].modellist[o]
                            .color,
                        basketCount:
                          this.tableData2[i].newbasketmsg.own[l].modellist[o]
                            .nums,
                        basketWeight:
                          this.tableData2[i].newbasketmsg.overflow[l].modellist[
                            o
                          ].weight,
                        basketType: 2,
                      });
                    }
                  }
                }
              }
            }
          }
        } else if (this.tableData2[i].floatType == 2) {
          for (let j = 0; j < res.data.length; j++) {
            if (this.tableData2[i].productId == res.data[j].productId) {
              for (let k = 0; k < res.data[j].batchInfo.length; k++) {
                if (
                  this.tableData2[i].batchid == res.data[j].batchInfo[k].batchId
                ) {
                  res.data[j].batchInfo[k].allBasketInfo =
                    this.tableData2[i].newbasketmsg;
                }
              }
            }
          }
        }
      }
      takeStock(res).then((resp) => {
        if (type == 1) {
          this.$success("盘点成功！");
          this.$router.push({
            path: "inventoryDetails",
            query: { orderId: resp.data[0] },
          });
          this.$closePage();
        } else {
          this.$success("盘点成功！");
          this.$closePage();
        }
      });
    },

    basketDel(type, index1, index2) {
      console.log(type, index1, index2);
      if (type == 1) {
        console.log(
          this.form.modellist.overflowbasker[index1].modellist.length
        );
        if (this.form.modellist.overflowbasker[index1].modellist.length == 1) {
          this.form.modellist.overflowbasker.splice(index1, 1);
        } else {
          this.form.modellist.overflowbasker[index1].modellist.splice(
            index2,
            1
          );
        }
      } else {
        if (this.form.modellist.ownbasket[index1].modellist.length == 1) {
          this.form.modellist.ownbasket.splice(index1, 1);
        } else {
          this.form.modellist.ownbasket[index1].modellist.splice(index2, 1);
        }
      }
    },
    delbatchWeight2(index) {
      this.batchWeightArr2.splice(index, 1);
    },
    delbatchWeight(index) {
      this.batchWeightArr.splice(index, 1);
    },
    breakage(row) {
      this.breakageDialog = true;
      let res = {
        productId: row.productId,
        type: 1,
        pageindex: 1,
        pagesize: 10,
      };
      getInfo(res).then((resp) => {
        this.breakageGoodsMsg = resp.data[0];
      });
      this.breakagebatchmsg = row;
      let batchGetBasket = { productId: row.productId, batchId: [row.batchid] };
      getCarryBasket(batchGetBasket).then((resp) => {
        // this.breakageBatchGetBasket = resp.data
        // console.log(this.breakageBatchGetBasket)
        console.log(resp.data);
        // this.form2.batchGetBasket = res
        let res = resp.data;
        let obj = [];
        let arr = [];
        for (let i = 0; i < res.length; i++) {
          if (obj.indexOf(res[i].basketId) === -1) {
            arr.push({
              basketId: res[i].basketId,
              basketName: res[i].basketName,
              basketType: res[i].basketType,
              info: [
                { basketColor: res[i].basketColor, nums: res[i].nums, soar: 0 },
              ],
            });
            obj.push(res[i].basketId);
          } else {
            for (let j = 0; j < arr.length; j++) {
              if (arr[j].basketId == res[i].basketId) {
                arr[j].info.push({
                  basketColor: res[i].basketColor,
                  nums: res[i].nums,
                  soar: 0,
                });
                break;
              }
            }
          }
        }
        this.form2.basketArr = arr;
      });
    },
    breakageDialogClose() {
      this.breakageDialog = false;
      this.form2 = {
        Nums: 0,
        PieceNums: 0,
        basketArr: [],
      };
    },
    getgoodafternums(id) {
      let res = 0;
      for (let i = 0; i < this.tableData2.length; i++) {
        if (this.tableData2[i].productId == id) {
          if (this.tableData2[i].afternumber) {
            res += this.tableData2[i].afternumber;
          }
        }
      }
      return res;
    },
    getgoodafterpieceUnit(id) {
      let res = 0;
      for (let i = 0; i < this.tableData2.length; i++) {
        if (this.tableData2[i].productId == id) {
          if (this.tableData2[i].afterpieceunitnums) {
            res += this.tableData2[i].afterpieceunitnums;
          }
        }
      }
      return res;
    },
    getgoodafterbasket(id) {
      let res = 0;
      for (let i = 0; i < this.tableData2.length; i++) {
        if (this.tableData2[i].productId == id) {
          if (this.tableData2[i].afterbasket) {
            res += this.tableData2[i].afterbasket;
          }
        }
      }
      return res;
    },
    breakageDialogSubmit(msg) {
      for (let i = 0; i < this.tableData2.length; i++) {
        if (this.tableData2[i].batchid == msg.batchid) {
          this.$set(this.tableData2[i], "floatType", 2);
          this.$set(
            this.tableData2[i],
            "afternumber",
            this.tableData2[i].batchnumber - this.form2.Nums
          );
          this.$set(
            this.tableData2[i],
            "afterbasket",
            this.tableData2[i].basketnumber - this.sumSoar
          );
          this.$set(
            this.tableData2[i],
            "afterpieceunit",
            this.breakageGoodsMsg.pieceUnit
          );
          this.$set(
            this.tableData2[i],
            "afterpieceunitnums",
            this.tableData2[i].piecenumber - this.form2.PieceNums
          );
          this.$set(this.tableData2[i], "isPell", 0);
          this.$set(this.tableData2[i], "overflowCount", 0);
          this.$set(this.tableData2[i], "ownCount", 0);
          this.tableData2[i].newbasketmsg = this.form2.basketArr;
        }
      }
      console.log(this.tableData2);
      this.breakageDialogClose();
    },
    noerror(row) {
      for (let i = 0; i < this.tableData2.length; i++) {
        if (this.tableData2[i].batchid == row.batchid) {
          this.$set(this.tableData2[i], "floatType", 3);
          this.$set(
            this.tableData2[i],
            "afternumber",
            this.tableData2[i].batchnumber
          );
          this.$set(
            this.tableData2[i],
            "afterbasket",
            this.tableData2[i].basketnumber
          );
          this.$set(
            this.tableData2[i],
            "afterpieceunit",
            this.tableData2[i].pieceUnit
          );
          this.$set(
            this.tableData2[i],
            "afterpieceunitnums",
            this.tableData2[i].piecenumber
          );
          this.$set(this.tableData2[i], "isPell", 0);
          this.$set(this.tableData2[i], "overflowCount", 0);
          this.$set(this.tableData2[i], "ownCount", 0);
          this.tableData2[i].newbasketmsg = {
            own: [],
            overflow: [],
          };
        }
      }
    },
    theOverflowSubmit(msg) {
      for (let i = 0; i < this.tableData2.length; i++) {
        if (this.tableData2[i].batchid == msg.batchid) {
          this.$set(this.tableData2[i], "floatType", 1);
          this.$set(
            this.tableData2[i],
            "afternumber",
            this.tableData2[i].batchnumber + this.form.theOverflowNums
          );
          this.$set(
            this.tableData2[i],
            "afterbasket",
            this.tableData2[i].basketnumber +
              this.getsumoverflow +
              this.getsumown
          );
          this.$set(this.tableData2[i], "afterpieceunit", this.form.pieceUnit);
          this.$set(
            this.tableData2[i],
            "afterpieceunitnums",
            this.form.theOverflowPieceNums + this.tableData2[i].piecenumber
          );
          this.$set(
            this.tableData2[i],
            "isPell",
            this.form.isQp == "去皮" ? 1 : 0
          );
          this.$set(this.tableData2[i], "overflowCount", this.getsumoverflow);
          this.$set(this.tableData2[i], "ownCount", this.getsumown);
          this.tableData2[i].newbasketmsg = {
            own: this.form.modellist.ownbasket,
            overflow: this.form.modellist.overflowbasker,
          };
        }
      }
      this.theOverflowDialogClose();
    },
    ownBasketCheckAllChange(val, index) {
      this.ownBasket[index].checkedBasket = val
        ? this.ownBasket[index].basketColor.map((item) => {
            return item.basketcolor;
          })
        : [];
      this.ownBasket[index].isIndeterminate = false;
    },
    handleCheckedOwnChange(val, index) {
      let checkedCount = val.length;
      this.ownBasket[index].checkAll =
        checkedCount === this.ownBasket[index].basketColor.length;
      this.ownBasket[index].isIndeterminate =
        checkedCount > 0 &&
        checkedCount < this.ownBasket[index].basketColor.length;
    },
    overFlowBasketCheckAllChange(val, index) {
      this.overFlowBasket[index].checkedBasket = val
        ? this.overFlowBasket[index].basketColor.map((item) => {
            return item.color;
          })
        : [];
      this.overFlowBasket[index].isIndeterminate = false;
    },
    handleCheckedOverflowChange(val, index) {
      let checkedCount = val.length;
      this.overFlowBasket[index].checkAll =
        checkedCount === this.overFlowBasket[index].basketColor.length;
      this.overFlowBasket[index].isIndeterminate =
        checkedCount > 0 &&
        checkedCount < this.overFlowBasket[index].basketColor.length;
    },
    ownBasketSubmit() {
      let res = [];
      for (let i = 0; i < this.ownBasket.length; i++) {
        if (this.ownBasket[i].checkedBasket.length > 0) {
          res.push({
            basektName: this.ownBasket[i].basektName,
            basketColor: this.ownBasket[i].basketColor,
            basketId: this.ownBasket[i].basketId,
            basketType: this.ownBasket[i].basketType,
            checkAll: this.ownBasket[i].checkAll,
            checkedBasket: this.ownBasket[i].checkedBasket,
            isIndeterminate: this.ownBasket[i].isIndeterminate,
            nums: this.ownBasket[i].nums,
            modellist: [],
          });
        }
      }
      for (let i = 0; i < res.length; i++) {
        for (let j = 0; j < res[i].checkedBasket.length; j++) {
          for (let k = 0; k < res[i].basketColor.length; k++) {
            if (res[i].checkedBasket[j] == res[i].basketColor[j].basketcolor) {
              // console.log(res[i].basketColor[j].nums,)
              res[i].modellist.push({
                color: res[i].basketColor[j].basketcolor,
                nullvalue: res[i].basketColor[j].nums,
                nums: 0,
                weight: 0,
              });
              let map = new Map();
              for (let item of res[i].modellist) {
                map.set(item.color, item);
              }
              res[i].modellist = [...map.values()];
            }
          }
        }
      }
      this.form.modellist.ownbasket = res;
      this.ownBasketClose();
    },
    overFlowBasketSubmit() {
      let res = [];
      for (let i = 0; i < this.overFlowBasket.length; i++) {
        if (this.overFlowBasket[i].checkedBasket.length > 0) {
          res.push({
            basektName: this.overFlowBasket[i].basektName,
            basketColor: this.overFlowBasket[i].basketColor,
            basketId: this.overFlowBasket[i].basketId,
            basketType: this.overFlowBasket[i].basketType,
            checkAll: this.overFlowBasket[i].checkAll,
            checkedBasket: this.overFlowBasket[i].checkedBasket,
            isIndeterminate: this.overFlowBasket[i].isIndeterminate,
            modellist: [],
          });
        }
      }
      for (let i = 0; i < res.length; i++) {
        for (let j = 0; j < res[i].checkedBasket.length; j++) {
          res[i].modellist.push({
            color: res[i].checkedBasket[j],
            nums: 0,
            weight: 0,
          });
        }
      }
      console.log(res);
      this.form.modellist.overflowbasker = res;
      this.overFlowBasketClose();
    },
    ownBasketClose() {
      this.ownBasketDialog = false;
    },
    overFlowBasketClose() {
      this.overFlowBasketDialog = false;
    },
    getOverFlowBasket() {
      this.overFlowBasketDialog = true;
      let res = { categoryId: this.goodsmsg.categoryThird };
      getOverFlowBasket(res).then((resp) => {
        // this.overFlowBasket = resp.data
        let obj = resp.data;
        if (obj.length != this.overFlowBasket.length) {
          this.overFlowBasket = [];
          for (let i = 0; i < obj.length; i++) {
            this.overFlowBasket.push({
              basketId: obj[i].basketId,
              basketType: obj[i].basketType,
              basektName: obj[i].basektName,
              basketColor: [],
              checkAll: false,
              isIndeterminate: true,
              checkedBasket: [],
            });
            for (let j = 0; j < obj[i].basketColor.length; j++) {
              this.overFlowBasket[i].basketColor.push({
                color: obj[i].basketColor[j],
                id: obj[i].basketId + obj[i].basketColor[j],
              });
            }
          }
        }
      });
    },
    getOwnBasket() {
      this.ownBasketDialog = true;
      let res = { categoryname: this.goodsmsg.categoryThird };
      getOwnBasket(res).then((resp) => {
        // this.ownBasket = resp.data
        let obj = resp.data;
        if (obj.length != this.ownBasket.length) {
          this.ownBasket = [];
          for (let i = 0; i < obj.length; i++) {
            this.ownBasket.push({
              basketId: obj[i].basketid,
              basketType: obj[i].basketType,
              basektName: obj[i].basketname,
              basketColor: obj[i].basketinfo,
              checkAll: false,
              isIndeterminate: true,
              checkedBasket: [],
              nums: obj[i].nums,
            });
          }
        }
        console.log(this.ownBasket);
      });
    },
    cutIsQp() {
      // console.log(this.form)
      for (let i = 0; i < this.form.modellist.overflowbasker.length; i++) {
        for (
          let j = 0;
          j < this.form.modellist.overflowbasker[i].modellist.length;
          j++
        ) {
          this.form.modellist.overflowbasker[i].modellist[j].weight = 0;
        }
      }
      for (let i = 0; i < this.form.modellist.ownbasket.length; i++) {
        for (
          let j = 0;
          j < this.form.modellist.ownbasket[i].modellist.length;
          j++
        ) {
          this.form.modellist.ownbasket[i].modellist[j].weight = 0;
        }
      }
    },
    batchWeightSubmit2() {
      this.form2.Nums = this.getBatchWeightCount3;
      this.form2.PieceNums = this.getBatchWeightCount4;
      this.batchWeightDialogClose2();
    },
    batchWeightSubmit() {
      this.form.theOverflowNums = this.getBatchWeightCount;
      this.form.theOverflowPieceNums = this.getBatchWeightCount2;
      this.batchWeightDialogClose();
    },
    addCount() {
      this.batchWeightArr.push({
        num1: 0,
        num2: 0,
      });
    },
    addCount2() {
      this.batchWeightArr2.push({
        num1: 0,
        num2: 0,
      });
    },
    batchWeightDialogClose() {
      this.batchWeightDialog = false;
      this.batchWeightArr = [];
    },
    batchWeightDialogClose2() {
      this.batchWeightDialog2 = false;
      this.batchWeightArr2 = [];
    },
    batchWeight() {
      this.batchWeightDialog = true;
      this.batchWeightArr.push({
        num1: this.form.theOverflowNums,
        num2: this.form.theOverflowPieceNums,
      });
    },
    batchWeight2() {
      this.batchWeightDialog2 = true;
      this.batchWeightArr2.push({
        num1: this.form2.Nums,
        num2: this.form2.PieceNums,
      });
    },
    overFlow(row) {
      this.theOverflowDialog = true;
      let res = {
        productId: row.productId,
        type: 1,
        pageindex: 1,
        pagesize: 10,
      };
      getInfo(res).then((resp) => {
        this.goodsmsg = resp.data[0];
        this.pieceUnitoptions = [];
        this.pieceUnitoptions = [{ value: "筐(周转筐)", label: "筐(周转筐)" }];
        if (this.goodsmsg.pieceUnit == "") {
          this.pieceUnitoptions.push({ value: "无", label: "无" });
        } else {
          this.pieceUnitoptions.push({
            value: this.goodsmsg.pieceUnit,
            label: this.goodsmsg.pieceUnit,
          });
        }
        this.form.pieceUnit =
          this.goodsmsg.pieceUnit == "" ? "无" : this.goodsmsg.pieceUnit;
      });
      this.batchmsg = row;
      let batchGetBasket = { productId: row.productId, batchId: [row.batchid] };
      getCarryBasket(batchGetBasket).then((resp) => {
        this.batchGetBasket = resp.data;
      });
    },
    theOverflowDialogClose() {
      this.overFlowBasket = [];
      this.ownBasket = [];
      this.theOverflowDialog = false;
      this.form = {
        id: "",
        pieceUnit: "",
        theOverflowNums: 0,
        theOverflowPieceNums: 0,
        isQp: "去皮",
        modellist: {
          overflowbasker: [],
          ownbasket: [],
        },
      };
    },
    queryTableData() {
      let res = this.tableData;
      // for(let i=0;i<res.length;i++){
      //   if(this.checkedResult[0].id){

      //   }
      // }
      console.log(this.checkedResult);
      return res;
    },
    handleCloseTag(msg) {
      if (msg.type == 1) {
        this.isshowClass.type = true;
        this.isshowClass.class1 = true;
        this.isshowClass.class2 = false;
        this.isshowClass.class3 = false;
        this.isshowClass.result = false;
        this.checkedResult = [];
        this.classifyName2 = [];
        this.classifyName3 = [];
        this.tableData = JSON.parse(JSON.stringify(this.checkedGoods));
      } else if (msg.type == 2) {
        this.isshowClass.type = true;
        this.isshowClass.class1 = false;
        this.isshowClass.class2 = true;
        this.isshowClass.class3 = false;
        this.checkedResult.splice(2, 1);
        this.checkedResult.splice(1, 1);
        this.classifyName3 = [];
        this.tableData = JSON.parse(JSON.stringify(this.checkedGoods));
      } else {
        this.isshowClass.type = true;
        this.isshowClass.class1 = false;
        this.isshowClass.class2 = false;
        this.isshowClass.class3 = true;
        this.checkedResult.splice(2, 1);
        this.tableData = JSON.parse(JSON.stringify(this.checkedGoods));
      }
    },
    checkclass3(msg) {
      // this.checkedResult[2] = msg
      this.$set(this.checkedResult, 2, msg);
      this.isshowClass.class3 = false;
      this.isshowClass.type = false;
    },
    checkclass2(msg) {
      // console.log(msg)
      // this.checkedResult[1] = msg
      this.$set(this.checkedResult, 1, msg);
      this.isshowClass.class2 = false;
      let res = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].classifyId2 == msg.value) {
          res.push({
            name: this.tableData[i].productName,
            value: this.tableData[i].classifyId,
            type: 3,
          });
        }
      }
      let map = new Map();
      for (let item of res) {
        map.set(item.value, item);
      }
      res = [...map.values()];
      this.classifyName3 = res;
      this.isshowClass.class3 = true;
      console.log(this.classifyName3);
    },
    checkclass1(msg) {
      // this.checkedResult[0] = msg
      this.$set(this.checkedResult, 0, msg);
      this.isshowClass.result = true;
      this.isshowClass.class1 = false;
      let res = [];
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].classifyId1 == msg.value) {
          res.push({
            name: this.tableData[i].classifyName2,
            value: this.tableData[i].classifyId2,
            type: 2,
          });
        }
      }
      let map = new Map();
      for (let item of res) {
        map.set(item.value, item);
      }
      res = [...map.values()];
      this.classifyName2 = res;
      this.isshowClass.class2 = true;
      console.log(this.classifyName2);
    },
    getClassifyName() {
      let res = this.tableData.map((item) => {
        return { name: item.classifyName1, value: item.classifyId1, type: 1 };
      });
      let map = new Map();
      for (let item of res) {
        map.set(item.value, item);
      }
      res = [...map.values()];
      this.classifyName1 = res;
      this.isshowClass.class1 = true;
    },
    delBatch(id) {
      for (let i = 0; i < this.tableData2.length; i++) {
        if (this.tableData2[i].batchid == id) {
          this.tableData2.splice(i, 1);
        }
      }
      let goodid = this.tableData.map((item) => {
        return item.productId;
      });
      let batchid = this.tableData2.map((item) => {
        return item.productId;
      });
      for (let i = 0; i < goodid.length; i++) {
        if (batchid.indexOf(goodid[i]) == -1) {
          for (let j = 0; j < this.tableData.length; j++) {
            if (this.tableData[j].productId == goodid[i]) {
              this.tableData.splice(j, 1);
            }
          }
        }
      }
    },
    getBatch2(row) {
      let params = {
        productId: row.productId,
        type: 0,
        pageindex: 0,
        pagesize: 0,
      };
      getBatch(params).then((resp) => {
        this.batchMsgExtend = resp.data[0];
      });
    },
    filterBatch(id) {
      let res = [];
      for (let i = 0; i < this.tableData2.length; i++) {
        if (this.tableData2[i].productId == id) {
          res.push(this.tableData2[i]);
        }
      }
      return res;
    },
    showBatchBtn(row) {
      this.tableData.map((item) => {
        if (row.productId != item.productId) {
          this.$refs.tableData.toggleRowExpansion(item, false);
        }
      });
      this.$refs.tableData.toggleRowExpansion(row);
    },
    selectedgoodsSubmit() {
      let res = this.checkedBatch;
      let map = new Map();
      for (let item of res) {
        map.set(item.batchid, item);
      }
      res = [...map.values()];
      this.checkedBatch = res;
      // console.log(this.checkedGoods,this.checkedBatch)
      this.tableData = JSON.parse(JSON.stringify(this.checkedGoods));
      this.tableData2 = JSON.parse(JSON.stringify(this.checkedBatch));
      this.selectedGoodsDialogClose();
      this.getClassifyName();
    },
    selectable2(row, index) {
      let obj = this.tableData2.map((item) => {
        return item.batchid;
      });
      if (obj.indexOf(row.batchid) > -1) {
        return false;
      } else {
        return true;
      }
    },
    selectable(row, index) {
      let obj = this.tableData.map((item) => {
        return item.productId;
      });
      if (obj.indexOf(row.productId) > -1) {
        return false;
      } else {
        return true;
      }
    },
    getRowKeys(row) {
      return row.productId;
    },
    getRowKeys2(row) {
      return row.batchid;
    },
    handleSelectionChange(val) {
      this.checkedGoods = val;
      if (val.length > 0) {
        let params = {
          productId: val[val.length - 1].productId,
          type: 0,
          pageindex: 0,
          pagesize: 0,
        };
        this.$nextTick(() => {
          getBatch(params).then((resp) => {
            // this.checkedBatch.push(resp.data[0].modelList)
            let obj = resp.data[0].modelList;
            for (let i = 0; i < obj.length; i++) {
              this.checkedBatch.push(obj[i]);
            }
          });
          let res = this.checkedBatch;
          let map = new Map();
          for (let item of res) {
            map.set(item.batchid, item);
          }
          res = [...map.values()];
          this.checkedBatch = res;
          console.log(this.checkedBatch);
        });
      }
    },
    handleSelectionChange2(val) {
      for (let i = 0; i < val.length; i++) {
        //选中批次时选中所属商品
        this.checkedBatch.push(val[i]);
        for (let j = 0; j < this.selectedGoodTableData.length; j++) {
          if (val[i].productId == this.selectedGoodTableData[j].productId) {
            this.$nextTick(() => {
              this.$refs.selectgoodstable.toggleRowSelection(
                this.selectedGoodTableData[j],
                true
              );
            });
          }
        }
      }
      let valarr = val.map((item) => {
        return item.batchid;
      });
      let tablearr = this.selectedBatchData.map((item) => {
        return item.batchid;
      });
      for (let i = 0; i < tablearr.length; i++) {
        if (valarr.indexOf(tablearr[i]) == -1) {
          for (let j = 0; j < this.checkedBatch.length; j++) {
            if (tablearr[i] == this.checkedBatch[j].batchid) {
              this.checkedBatch.splice(j, 1);
            }
          }
        }
      }
    },
    toDate(val) {
      return moment(val * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
    getBatch(row) {
      let params = {
        productId: row.productId,
        type: 0,
        pageindex: 0,
        pagesize: 0,
      };
      getBatch(params).then((resp) => {
        this.selectedBatchData = resp.data[0].modelList;
        this.batchMsgExtend = resp.data[0];
        console.log(this.checkedBatch);
        this.showBatch(row);
      });
    },
    showBatch(row) {
      this.selectedGoodTableData.map((item) => {
        if (row.productId != item.productId) {
          this.$refs.selectgoodstable.toggleRowExpansion(item, false);
        }
      });
      this.$refs.selectgoodstable.toggleRowExpansion(row);
      for (let i = 0; i < this.selectedGoodTableData.length; i++) {
        if (row.productId == this.selectedGoodTableData[i].productId) {
          this.selectedGoodTableData[i].isshow =
            !this.selectedGoodTableData[i].isshow;
        } else {
          this.selectedGoodTableData[i].isshow = false;
        }
      }
      for (let i = 0; i < this.selectedBatchData.length; i++) {
        for (let j = 0; j < this.checkedBatch.length; j++) {
          if (
            this.selectedBatchData[i].batchid == this.checkedBatch[j].batchid
          ) {
            console.log(this.selectedBatchData[i].batchid);
            this.$nextTick(() => {
              if (this.$refs.selectbatchtable) {
                this.$refs.selectbatchtable.toggleRowSelection(
                  this.selectedBatchData[i],
                  true
                );
              }
            });
          }
        }
      }
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
      let next4 =
        pieceunit == ""
          ? ""
          : "(" +
            piececount +
            (pieceunit == "筐(一次性)" ? "筐" : pieceunit) +
            ")";
      let last =
        basket == 0
          ? ""
          : "|" + basket + '<font style="color:#DF971A;">筐</font>';
      let kuohao1 = subunit2 == "" ? "" : "(";
      let kuohao2 = subunit2 == "" ? "" : ")";
      return first + kuohao1 + next3 + next2 + kuohao2 + next4 + last;
    },
    reset() {
      this.selectedgoodsQueryData = {
        type: [],
        place: [],
        variety: "",
        spec: "",
        isStock: "0",
        pageindex: 1,
        pagesize: 10,
        total: 0,
      };
      this.getGoodsList();
    },
    handleSizeChange(val) {
      this.selectedgoodsQueryData.pagesize = val;
      this.getGoodsList();
    },
    handleCurrentChange(val) {
      this.selectedgoodsQueryData.pageindex = val;
      this.getGoodsList();
    },
    getGoodsList() {
      console.log(this.checkedGoods);
      let params = {
        isStock: this.selectedgoodsQueryData.isStock,
        pageindex: this.selectedgoodsQueryData.pageindex,
        pagesize: this.selectedgoodsQueryData.pagesize,
        spec: this.selectedgoodsQueryData.spec,
        variety: this.selectedgoodsQueryData.variety,
      };
      if (this.selectedgoodsQueryData.type.length == 4) {
        params.classifyId = this.selectedgoodsQueryData.type[2];
        params.calssifyVariety = this.selectedgoodsQueryData.type[3];
      } else {
        params.classifyId = this.selectedgoodsQueryData.type[
          this.selectedgoodsQueryData.type.length - 1
        ]
          ? this.selectedgoodsQueryData.type[
              this.selectedgoodsQueryData.type.length - 1
            ]
          : "";
        params.calssifyVariety = "";
      }
      if (this.selectedgoodsQueryData.place.length > 0) {
        params.regionId = this.selectedgoodsQueryData.place[3];
      }
      // console.log(params)
      productList(params).then((resp) => {
        this.stocknums.num1 = resp.data[0].allCount;
        this.stocknums.num2 = resp.data[0].stockCount;
        this.stocknums.num3 = resp.data[0].unStockCount;
        this.selectedgoodsQueryData.total = resp.data[0].sumCount;
        this.selectedGoodTableData = resp.data[0].modelList;
        // let res = this.selectedGoodTableData
        // for(let i=0;i<res.length;i++){
        //   res[i].isshow = false;
        // }
        // this.selectedGoodTableData = res;
        // console.log(this.selectedGoodTableData)
      });
    },
    changeTabs(val) {
      this.selectedgoodsQueryData.isStock = val.name;
      this.getGoodsList();
    },
    selectedGoodsDialogClose() {
      this.selectedGoodsDialog = false;
      this.selectedgoodsQueryData = {
        type: [],
        place: [],
      };
    },
    selectedGoods() {
      // this.checkedGoods = this.tableData;
      // this.checkedBatch = this.tableData2;
      if (this.tableData.length > 0) {
        this.checkedGoods = JSON.parse(JSON.stringify(this.tableData));
        this.checkedBatch = JSON.parse(JSON.stringify(this.tableData2));
      } else {
        this.checkedGoods = [];
        this.checkedBatch = [];
      }
      this.selectedGoodsDialog = true;
      console.log();
      let res = { modelType: "0" };
      getGoodsType(res).then((resp) => {
        this.options1 = resp.data;
      });
      this.options2 = [
        {
          name: "国内",
          rid: 1,
          childList: [],
        },
        {
          name: "国外",
          rid: 2,
          childList: [],
        },
      ];
      getRegion().then((res) => {
        this.options2[1].childList = res.data[0].foreignRegions; //国外
        this.options2[0].childList = res.data[0].regions; //国内
      });
      this.getGoodsList();
    },
  },
  computed: {
    sumSoar() {
      let res = 0;
      for (let i = 0; i < this.form2.basketArr.length; i++) {
        for (let j = 0; j < this.form2.basketArr[i].info.length; j++) {
          res += this.form2.basketArr[i].info[j].soar;
        }
      }
      return Number(res) ? Number(res) : 0;
    },
    getsumweight() {
      let overflow = 0;
      let own = 0;
      let res = 0;
      for (let i = 0; i < this.form.modellist.overflowbasker.length; i++) {
        for (
          let j = 0;
          j < this.form.modellist.overflowbasker[i].modellist.length;
          j++
        ) {
          overflow +=
            this.form.modellist.overflowbasker[i].modellist[j].weight *
            this.form.modellist.overflowbasker[i].modellist[j].nums;
        }
      }
      for (let i = 0; i < this.form.modellist.ownbasket.length; i++) {
        for (
          let j = 0;
          j < this.form.modellist.ownbasket[i].modellist.length;
          j++
        ) {
          own +=
            this.form.modellist.ownbasket[i].modellist[j].weight *
            this.form.modellist.ownbasket[i].modellist[j].nums;
        }
      }
      res = overflow + own;
      return res;
    },
    getsumown() {
      let res = 0;
      for (let i = 0; i < this.form.modellist.ownbasket.length; i++) {
        for (
          let j = 0;
          j < this.form.modellist.ownbasket[i].modellist.length;
          j++
        ) {
          res += this.form.modellist.ownbasket[i].modellist[j].nums;
        }
      }
      return res;
    },
    getsumoverflow() {
      let res = 0;
      for (let i = 0; i < this.form.modellist.overflowbasker.length; i++) {
        for (
          let j = 0;
          j < this.form.modellist.overflowbasker[i].modellist.length;
          j++
        ) {
          res += this.form.modellist.overflowbasker[i].modellist[j].nums;
        }
      }
      return res;
    },
    getBatchWeightCount4() {
      let res = 0;
      for (let i = 0; i < this.batchWeightArr2.length; i++) {
        res += this.batchWeightArr2[i].num2;
      }
      return res;
    },
    getBatchWeightCount3() {
      let res = 0;
      for (let i = 0; i < this.batchWeightArr2.length; i++) {
        res += this.batchWeightArr2[i].num1;
      }
      return res;
    },
    getBatchWeightCount2() {
      let res = 0;
      for (let i = 0; i < this.batchWeightArr.length; i++) {
        res += this.batchWeightArr[i].num2;
      }
      return res;
    },
    getBatchWeightCount() {
      let res = 0;
      for (let i = 0; i < this.batchWeightArr.length; i++) {
        res += this.batchWeightArr[i].num1;
      }
      return res;
    },
  },
  created() {},
};
</script>
<style lang="scss" scoped>
.change_tags {
  .el-tag {
    padding: 0px 1px !important;
  }
  .el-tag--medium {
    height: 17px !important;
    line-height: 17px !important;
  }
}
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
</style>