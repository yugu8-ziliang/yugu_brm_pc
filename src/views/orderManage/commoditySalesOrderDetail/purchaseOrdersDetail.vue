<template>
  <Page :title="pageTitle">
    <!-- 自家生产 -->
    <el-descriptions title="订单信息" :column="3" v-if="orderType == 2">
      <template slot="extra">
        <font class="font_style_1">操作人:</font>{{ detailMsg.operator }}
      </template>
      <el-descriptions-item label="自家生产单编号">{{
        detailMsg.orderaddreportid
      }}</el-descriptions-item>
      <el-descriptions-item label="订单时间">{{
        toDate(detailMsg.timestamp)
      }}</el-descriptions-item>
      <el-descriptions-item label="订单金额">{{
        currencyFormat(detailMsg.ordertotalprice) + "元"
      }}</el-descriptions-item>
    </el-descriptions>
    <div style="text-align: right" v-if="orderType == 2">
      <el-button size="mini">打印</el-button>
    </div>
    <!-- 采购单 -->
    <el-descriptions title="订单信息" :column="3" v-if="orderType != 2">
      <template slot="extra">
        <font class="font_style_1">操作人:</font>{{ detailMsg.operator }}
      </template>
      <el-descriptions-item label="采购单编号">{{
        orderType == 0 ? detailMsg.ordersellid : detailMsg.orderaddreportid
      }}</el-descriptions-item>
      <el-descriptions-item label="订单状态">
        <font :style="statusColor">{{ detailMsg.statusname }}</font>
      </el-descriptions-item>
      <el-descriptions-item label="订单时间">{{
        toDate(detailMsg.timestamp)
      }}</el-descriptions-item>
      <el-descriptions-item label="订单金额">{{
        currencyFormat(detailMsg.ordertotalprice) + "元"
      }}</el-descriptions-item>
      <el-descriptions-item
        label="已付金额"
        v-if="
          detailMsg.statusname == '待对方收款' ||
          detailMsg.statusname == '未结清'
        "
        >{{
          currencyFormat(detailMsg.actualpayprice) + "元"
        }}</el-descriptions-item
      >
      <el-descriptions-item
        label="剩余未付金额"
        v-if="
          detailMsg.statusname == '待对方收款' ||
          detailMsg.statusname == '未结清'
        "
        >{{ currencyFormat(detailMsg.unpaid) + "元" }}</el-descriptions-item
      >
      <el-descriptions-item
        label="本次付款时间"
        v-if="detailMsg.statusname == '待对方收款'"
        >{{ toDate(detailMsg.payTimestamp) }}</el-descriptions-item
      >
      <el-descriptions-item
        :label="
          detailMsg.unrecognizedamount > 0 && detailMsg.payPrice > 0
            ? '合计确认金额'
            : detailMsg.unrecognizedamount > 0 && detailMsg.payPrice == 0
            ? '确认金额'
            : '实际付款'
        "
        v-if="
          detailMsg.statusname == '待确认' ||
          detailMsg.statusname == '待对方收款'
        "
      >
        <el-tooltip class="item" effect="dark" placement="bottom">
          <div
            slot="content"
            v-if="detailMsg.unrecognizedamount > 0 && detailMsg.payPrice > 0"
          >
            <p style="font-size: 15px">
              实际付款:{{ currencyFormat(detailMsg.payPrice) + "元" }}
            </p>
            <p class="p_layout">
              线上支付:{{
                currencyFormat(detailMsg.payInfo.lakalaCollection) + "元"
              }}
            </p>
            <p class="p_layout">
              线下支付（支付宝）:{{
                currencyFormat(detailMsg.payInfo.aliPay) + "元"
              }}
            </p>
            <p class="p_layout">
              线下支付（微信）:{{
                currencyFormat(detailMsg.payInfo.weChat) + "元"
              }}
            </p>
            <p style="font-size: 15px">
              确认金额:{{ currencyFormat(detailMsg.payInfo) + "元" }}
            </p>
            <p class="p_layout">
              经营往来款抵充:{{ currencyFormat(detailMsg.comeInPrice) + "元" }}
            </p>
            <p class="p_layout">
              预付款抵扣:{{ currencyFormat(detailMsg.advancePrice) + "元" }}
            </p>
            <p class="p_layout">
              借款抵扣:{{ currencyFormat(detailMsg.borrowPrice) + "元" }}
            </p>
          </div>
          <div
            slot="content"
            v-if="detailMsg.unrecognizedamount > 0 && detailMsg.payPrice == 0"
          >
            <p style="font-size: 15px">
              确认金额:{{ currencyFormat(detailMsg.unrecognizedamount) + "元" }}
            </p>
            <p class="p_layout">
              经营往来款抵充:{{ currencyFormat(detailMsg.comeInPrice) + "元" }}
            </p>
            <p class="p_layout">
              预付款抵扣:{{ currencyFormat(detailMsg.advancePrice) + "元" }}
            </p>
            <p class="p_layout">
              借款抵扣:{{ currencyFormat(detailMsg.borrowPrice) + "元" }}
            </p>
          </div>
          <div
            slot="content"
            v-if="detailMsg.unrecognizedamount == 0 && detailMsg.payPrice > 0"
          >
            <p style="font-size: 15px">
              实际付款:{{ currencyFormat(detailMsg.payPrice) + "元" }}
            </p>
            <p class="p_layout">
              线上支付:{{
                currencyFormat(detailMsg.payInfo.lakalaCollection) + "元"
              }}
            </p>
            <p class="p_layout">
              线下支付（支付宝）:{{
                currencyFormat(detailMsg.payInfo.aliPay) + "元"
              }}
            </p>
            <p class="p_layout">
              线下支付（微信）:{{
                currencyFormat(detailMsg.payInfo.weChat) + "元"
              }}
            </p>
          </div>
          <u style="color: #0ba198"
            >{{
              currencyFormat(
                Number(detailMsg.unrecognizedamount) +
                  Number(detailMsg.payPrice)
              ) + "元"
            }}{{
              detailMsg.unrecognizedamount == 0 && detailMsg.payPrice == 0
                ? "赊账"
                : ""
            }}</u
          >
        </el-tooltip>
      </el-descriptions-item>
    </el-descriptions>
    <div class="button_layout_left" v-if="orderType != 2">
      <el-button
        type="text"
        v-if="
          detailMsg.statusname == '未结清' || detailMsg.statusname == '已结清'
        "
      >
        <u>退款记录</u>
      </el-button>
      <el-button
        type="text"
        style="margin-left: 80px"
        v-if="
          detailMsg.statusname == '未结清' || detailMsg.statusname == '已结清'
        "
        @click="paymentRecord()"
      >
        <u>付款记录</u>
      </el-button>
    </div>
    <div class="button_layout_right" v-if="orderType != 2">
      <el-button size="mini">打印</el-button>
      <!--1 平台  待确认 ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！-->
      <el-button
        size="mini"
        v-if="detailMsg.statusname == '待确认'"
        @click="ThChange"
      >
        退回修改</el-button
      >
      <el-button
        type="primary"
        size="mini"
        v-if="detailMsg.statusname == '待确认'"
      >
        确认付款</el-button
      >
      <!--2 平台  未结清 ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！-->
      <el-button size="mini" v-if="detailMsg.statusname == '未结清'">
        发起退款</el-button
      >
      <el-button size="mini" v-if="detailMsg.statusname == '未结清'">
        退货退款</el-button
      >
      <el-button
        type="primary"
        size="mini"
        v-if="detailMsg.statusname == '未结清' && orderType == 0"
      >
        继续付款</el-button
      >
      <el-button
        type="primary"
        size="mini"
        v-if="detailMsg.statusname == '未结清' && orderType == 1"
        @click="addPayment()"
      >
        添加付款</el-button
      >
      <!--3 平台  已结清 ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！-->
      <el-button size="mini" v-if="detailMsg.statusname == '已结清'">
        发起退款</el-button
      >
      <el-button
        type="primary"
        size="mini"
        v-if="detailMsg.statusname == '已结清'"
      >
        退货退款</el-button
      >
      <!--4 平台  待对方付款 ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！-->
      <el-button
        size="mini"
        v-if="detailMsg.statusname == '待对方收款' && detailMsg.isBatchPay == 0"
        @click="ChCancel"
      >
        撤回取消</el-button
      >
      <el-button
        size="mini"
        v-if="detailMsg.statusname == '待对方收款' && detailMsg.isBatchPay == 0"
        @click="ChChane"
      >
        撤回修改</el-button
      >
      <el-button
        size="mini"
        type="primary"
        v-if="detailMsg.statusname == '待对方收款' && detailMsg.isBatchPay == 0"
        @click="remind"
      >
        提醒对方付款</el-button
      >
      <el-button
        size="mini"
        type="primary"
        v-if="detailMsg.statusname == '待对方收款' && detailMsg.isBatchPay == 1"
      >
        处理批量付款单</el-button
      >
    </div>
    <el-divider></el-divider>
    <el-descriptions title="客户信息" :column="3" v-if="orderType != 2">
      <el-descriptions-item label="客户姓名">
        {{
          detailMsg.ordertype == 1 ? detailMsg.userName : detailMsg.fromusername
        }}
        <el-tag type="info" v-if="detailMsg.ordertype == 2">非</el-tag>
        <el-tag v-if="detailMsg.ordertype == 1 && detailMsg.custmorType == 3"
          >供</el-tag
        >
        <el-tag
          type="warning"
          v-if="detailMsg.ordertype == 1 && detailMsg.custmorType == 2"
          >采</el-tag
        >
        <el-tag
          type="danger"
          v-if="detailMsg.ordertype == 1 && detailMsg.custmorType == 1"
          >经</el-tag
        >
      </el-descriptions-item>
      <el-descriptions-item label="联系电话">{{
        detailMsg.ordertype == 1
          ? detailMsg.phoneNumber
          : detailMsg.fromuserphone
      }}</el-descriptions-item>
      <el-descriptions-item
        label="企业名称"
        v-if="detailMsg.ordertype == 1 && detailMsg.companyType == 1"
        >{{ detailMsg.companyName }}</el-descriptions-item
      >
    </el-descriptions>
    <el-divider v-if="orderType != 2"></el-divider>
    <el-descriptions title="商品信息" :column="3"></el-descriptions>
    <div
      class="goodsmsg_styl"
      v-for="(item, index) in goodsMsg"
      :key="index"
      style="margin-bottom: 15px"
    >
      <el-row>
        <el-col :span="20">{{
          item.firstClassifyName + "-" + item.classifyName + "-" + item.name
        }}</el-col>
        <el-col :span="4" style="text-align: right">
          <el-button
            type="text"
            @click="goodsDetails(item)"
            v-if="item.product_baskets.have_basket == 1"
            >详情</el-button
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="6"
          ><font class="font_styl_2">品种/品牌：</font
          ><font class="font_styl_3">{{ item.variety }}</font></el-col
        >
        <el-col :span="6"
          ><font class="font_styl_2">产地：</font
          ><font class="font_styl_3">{{ item.region }}</font></el-col
        >
        <el-col :span="6"
          ><font class="font_styl_2">级别/规格：</font
          ><font class="font_styl_3">{{ item.spec }}</font></el-col
        >
        <el-col :span="6"
          ><font class="font_styl_2">计算单位：</font
          ><font class="font_styl_3">{{ item.subunit }}</font></el-col
        >
      </el-row>
      <el-row>
        <el-col :span="6"
          ><font class="font_styl_2">销售数量：</font>
          <font class="font_styl_3">
            <span
              v-html="
                getStock(
                  item.subunit,
                  item.subUnit2,
                  item.subUnit3,
                  item.sellPieceUnit,
                  item.subUnit2Weight,
                  item.subUnit3Weight,
                  item.productcount,
                  item.buybasketcount,
                  item.productPieceCount
                )
              "
            >
            </span>
          </font>
        </el-col>
        <el-col :span="6"
          ><font class="font_styl_2"
            >{{ orderType == 2 ? "生产单价" : "商品单价" }}：</font
          ><font class="font_styl_3"
            >{{ item.productprice + "元/" }}{{ item.subunit }}</font
          ></el-col
        >
        <el-col :span="6"
          ><font class="font_styl_2">商品金额：</font
          ><font class="font_styl_3" style="color: red">{{
            currencyFormat(item.producttotalprice) + "元"
          }}</font></el-col
        >
      </el-row>
      <el-row v-if="item.buybasketcount > 0">
        <el-col :span="6"
          ><font class="font_styl_2">筐子种类：</font
          ><font class="font_styl_3">{{
            item.baskettypecount + "种"
          }}</font></el-col
        >
        <el-col :span="6"
          ><font class="font_styl_2">售出筐子：</font
          ><font class="font_styl_3">{{
            item.buybasketcount + "个"
          }}</font></el-col
        >
        <el-col :span="6"
          ><font class="font_styl_2">筐子金额：</font
          ><font class="font_styl_3">{{
            item.buybasketprice + "元"
          }}</font></el-col
        >
      </el-row>
      <div style="border-bottom: 1px dashed #e6e6e6; margin-top: 15px"></div>
      <div style="padding-top: 15px; text-align: right" class="font_styl_3">
        金额小计：<font style="color: red">{{
          currencyFormat(item.detailtotalprice) + "元"
        }}</font>
      </div>
    </div>
    <el-descriptions
      title="合计"
      :column="3"
      style="margin-top: 20px"
    ></el-descriptions>
    <el-row>
      <el-col :span="6"
        ><font class="font_styl_2">商品种类：</font
        ><font class="font_styl_3">{{ goodsMsg.length + "种" }}</font></el-col
      >
      <el-col :span="6"
        ><font>商品金额：</font
        ><font class="font_styl_3" style="color: red">{{
          currencyFormat(detailMsg.producttotalprice) + "元"
        }}</font></el-col
      >
    </el-row>
    <el-row v-if="orderType != 2">
      <el-col :span="6"
        ><font class="font_styl_2">购入筐子：</font
        ><font class="font_styl_3">{{
          detailMsg.baskettotalcount + "个"
        }}</font></el-col
      >
      <el-col :span="6"
        ><font>筐子金额：</font
        ><font class="font_styl_3" style="color: red">{{
          currencyFormat(detailMsg.baskettotalprice) + "元"
        }}</font></el-col
      >
    </el-row>
    <el-row v-if="detailMsg.useBuyBasket > 0">
      <el-col :span="6"
        ><font class="font_styl_2">使用自家筐子：</font
        ><font class="font_styl_3">{{
          detailMsg.useBuyBasket + "个"
        }}</font></el-col
      >
    </el-row>
    <el-divider></el-divider>
    <div
      style="
        text-align: right;
        border-bottom: 1px solid #e9e9e9;
        padding-bottom: 15px;
        margin-bottom: 20px;
      "
    >
      金额合计：<font style="color: red">{{
        currencyFormat(detailMsg.ordertotalprice) + "元"
      }}</font>
    </div>
    <el-descriptions
      title="运输信息"
      :column="3"
      style="margin-top: 20px"
      v-if="orderType != 2"
    ></el-descriptions>
    <el-row v-if="orderType != 2">
      <el-col :span="6"
        ><font class="font_styl_3">车牌号：</font
        ><font class="font_styl_3">{{
          detailMsg.transferarea + detailMsg.transfernumber
        }}</font></el-col
      >
    </el-row>
    <el-row style="margin-top: 20px" v-if="orderType != 2">
      <el-col :span="1.5">
        <font class="font_styl_3">车辆照片：</font>
      </el-col>
      <el-col :span="20">
        <el-image
          :preview-src-list="detailMsg.transferimageurls"
          v-for="(item, index) in detailMsg.transferimageurls"
          :key="index"
          style="width: 100px; height: 100px; margin-top: 7px"
          :src="item"
          fit="fill"
        ></el-image>
      </el-col>
    </el-row>
    <el-divider v-if="orderType != 2"></el-divider>
    <el-descriptions title="备注"></el-descriptions>
    <div
      v-for="(item, index) in detailMsg.remarkJson"
      :key="'remarkJSON' + index"
      style="margin-bottom: 15px"
    >
      <p>{{ toDate(item.createtime) }}</p>
      <p v-for="(item2, index2) in item.remark" :key="'remark' + index2">
        {{ item2 }}
      </p>
    </div>
    <el-dialog
      title="商品详情"
      :visible.sync="dialogVisible"
      width="80%"
      :before-close="handleClose"
    >
      <el-descriptions
        :title="
          checkedDetails.firstClassifyName +
          '-' +
          checkedDetails.classifyName +
          '-' +
          checkedDetails.name
        "
        :column="5"
        :colon="false"
      >
        <el-descriptions-item label="品种/品牌:">{{
          checkedDetails.variety
        }}</el-descriptions-item>
        <el-descriptions-item label="产地:">{{
          checkedDetails.region
        }}</el-descriptions-item>
        <el-descriptions-item label="级别/规格:">{{
          checkedDetails.spec
        }}</el-descriptions-item>
        <el-descriptions-item label="计算单位:">{{
          checkedDetails.subunit
        }}</el-descriptions-item>
        <el-descriptions-item label=" ">{{ "" }}</el-descriptions-item>
        <el-descriptions-item label="商品毛重:">{{
          Number(checkedDetails.basketweight) +
          Number(checkedDetails.productreallyweight) +
          "斤"
        }}</el-descriptions-item>
        <el-descriptions-item
          label="筐子重量:"
          v-if="checkedDetails.isremovepeel == 0"
          >{{ checkedDetails.basketweight + "斤" }}</el-descriptions-item
        >
        <el-descriptions-item
          label="商品净重:"
          v-if="checkedDetails.isremovepeel == 0"
          >{{ checkedDetails.productreallyweight }}</el-descriptions-item
        >
        <el-descriptions-item
          :label="orderType == 2 ? '生产单价:' : '商品单价:'"
          >{{ checkedDetails.productprice + "元/斤" }}</el-descriptions-item
        >
        <el-descriptions-item label="商品金额:"
          ><font style="color: red"
            >{{ currencyFormat(checkedDetails.detailtotalprice) }}元</font
          ></el-descriptions-item
        >
      </el-descriptions>
      <el-divider></el-divider>
      <!-- 卖家筐子 -->
      <el-table
        :data="sell_basket"
        v-if="sell_basket.length > 0"
        style="margin-bottom: 10px; border: 1px solid #e9e9e9"
      >
        <el-table-column
          :render-header="renderHeader2"
          v-if="checkedDetails.isremovepeel == 0"
          width="200"
        >
          <template slot-scope="scope">
            [{{ scope.row.basketType }}]{{ scope.row.userbasketname }}
          </template>
        </el-table-column>
        <el-table-column
          :render-header="renderHeader1"
          v-if="checkedDetails.isremovepeel == 1"
          width="200"
        >
          <template slot-scope="scope">
            [{{ scope.row.basketType }}]{{ scope.row.userbasketname }}
          </template>
        </el-table-column>
        <el-table-column
          :render-header="renderHeader3"
          v-if="checkedDetails.isremovepeel == 2"
          width="200"
        >
          <template slot-scope="scope">
            [{{ scope.row.basketType }}]{{ scope.row.userbasketname }}
          </template>
        </el-table-column>
        <el-table-column label="颜色" prop="userbasketcolor"></el-table-column>
        <el-table-column
          label="载货量"
          prop="userbasketcolor"
          v-if="self_basket.length > 0 && sell_basket.length > 0 ? false : true"
        >
          <template slot-scope="scope">
            <font v-if="checkedDetails.subunit == '斤'">{{
              scope.row.basketcargo + "斤/筐"
            }}</font>
            <font v-if="checkedDetails.subunit != '斤'">{{
              scope.row.basketcargo + checkedDetails.subunit + "/筐"
            }}</font>
          </template>
        </el-table-column>
        <el-table-column
          label="筐子重量"
          prop="basketweight"
          v-if="checkedDetails.isremovepeel == 1 && sell_basket.length == 0"
        >
          <template slot-scope="scope">
            {{ scope.row.basketweight + "斤/个" }}
          </template>
        </el-table-column>
        <el-table-column label="购入筐子" prop="userbasketcount">
          <template slot-scope="scope">
            {{ scope.row.userbasketcount + "个" }}
          </template>
        </el-table-column>
        <el-table-column
          label="筐子总重"
          prop="all_basket_weigh"
          v-if="checkedDetails.isremovepeel == 0"
        >
          <template slot-scope="scope">
            {{ scope.row.all_basket_weigh + "斤" }}
          </template>
        </el-table-column>
        <el-table-column label="筐子单价" prop="userbasketprice">
          <template slot-scope="scope">
            {{ scope.row.userbasketprice + "元/个" }}
          </template>
        </el-table-column>
        <el-table-column label="筐子金额" prop="userbaskettotalprice">
          <template slot-scope="scope">
            {{ scope.row.userbaskettotalprice + "元" }}
          </template>
        </el-table-column>
      </el-table>
      <div
        style="margin-top: 5px; border: 1px solid #e9e9e9; padding: 15px"
        v-if="sell_basket.length > 0"
      >
        <el-row>
          <el-col :span="4"> 小计: </el-col>
          <el-col :span="20" style="text-align: right">
            <font style="margin-right: 30px"
              >购入筐子：{{ checkedDetails.buybasketcount + "个" }}</font
            >
            <font style="color: #010621">筐子金额：</font
            ><font style="color: red"
              >{{ checkedDetails.buybasketprice }}元</font
            >
            <font style="color: #010621" v-if="checkedDetails.isremovepeel == 1"
              >筐子总重：{{ checkedDetails.sell_basket_weigh }}个</font
            >
            <font
              style="color: red; margin-right: 30px"
              v-if="checkedDetails.isremovepeel == 1"
              >{{ checkedDetails.basketweight }}斤</font
            >
          </el-col>
        </el-row>
      </div>
      <div
        style="border-bottom: 1px dashed #e9e9e9; margin: 15px 0px; width: 100"
      ></div>
      <!-- 自家筐子 -->
      <el-table
        :data="self_basket"
        v-if="self_basket.length > 0"
        style="border: 1px solid #e9e9e9"
      >
        <el-table-column :render-header="buy_basket1" width="200">
          <template slot-scope="scope">
            [{{ scope.row.basketType }}]{{ scope.row.userbasketname }}
          </template>
        </el-table-column>
        <el-table-column label="颜色" prop="userbasketcolor"></el-table-column>
        <el-table-column
          label="载货量"
          prop="userbasketcolor"
          v-if="self_basket.length > 0 && sell_basket.length > 0 ? false : true"
        >
          <template slot-scope="scope">
            <font v-if="checkedDetails.subunit == '斤'">{{
              scope.row.basketcargo + "斤/筐"
            }}</font>
            <font v-if="checkedDetails.subunit != '斤'">{{
              scope.row.basketcargo + checkedDetails.subunit + "/筐"
            }}</font>
          </template>
        </el-table-column>
        <el-table-column
          label="筐子重量"
          prop="basketweight"
          v-if="checkedDetails.isremovepeel == 0"
        >
          <template slot-scope="scope">
            {{ scope.row.basketweight + "斤/个" }}
          </template>
        </el-table-column>
        <el-table-column label="使用数量" prop="userbasketcount">
          <template slot-scope="scope">
            {{ scope.row.userbasketcount + "个" }}
          </template>
        </el-table-column>
        <el-table-column
          label="筐子总重"
          prop="all_basket_weigh"
          v-if="checkedDetails.isremovepeel == 0"
        >
          <template slot-scope="scope">
            {{ scope.row.all_basket_weigh + "斤" }}
          </template>
        </el-table-column>
      </el-table>
      <div
        style="margin-top: -1px; border: 1px solid #e9e9e9; padding: 15px"
        v-if="self_basket.length > 0"
      >
        <el-row>
          <el-col :span="4"> 小计: </el-col>
          <el-col :span="16" style="text-align: right">
            使用自家筐子:{{ checkedDetails.buy_basket_count }}个
          </el-col>
          <el-col :span="4" style="text-align: right">
            筐子总重:{{ checkedDetails.self_basket_weigh }}个
          </el-col>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <div
          style="
            border-bottom: 1px dashed #e9e9e9;
            padding-bottom: 10px;
            text-align: right;
          "
          class="font_styl_2"
          v-if="orderType != 2"
        >
          <font
            style="margin-right: 15px"
            v-if="checkedDetails.isremovepeel == 1"
            >共筐子过磅:{{
              checkedDetails.buybasketcount + checkedDetails.buybasketcount
            }}个</font
          >&nbsp;&nbsp;
          <font style="margin-right: 15px"
            >购入筐子:{{ checkedDetails.buybasketcount }}个,</font
          >
          <font style="margin-right: 15px"
            >使用自家筐子:{{ checkedDetails.buy_basket_count }}个</font
          >
        </div>
        <div style="text-align: right; margin-top: 15px">
          <p style="font-size: 16px; color: #010621">
            金额总计:<font style="color: red"
              >{{ checkedDetails.detailtotalprice }}元</font
            >
          </p>
          <p class="font_styl_2" v-if="orderType != 2">
            包含商品金额：{{ checkedDetails.producttotalprice }}元
          </p>
        </div>
      </span>
    </el-dialog>
    <el-dialog
      title="退回修改"
      :visible.sync="thdialog"
      width="30%"
      :before-close="ThhandleClose"
    >
      <p>确认退回？</p>
      备注信息：
      <el-input
        type="textarea"
        placeholder="请输入内容"
        v-model="remark"
        maxlength="200"
        show-word-limit
        rows="4"
        resize="none"
      >
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ThhandleClose">取 消</el-button>
        <el-button type="primary" @click="ThYes">确 定</el-button>
      </span>
    </el-dialog>
  </Page>
</template>
<script>
import moment from "moment";
import {
  getInfo,
  repealOrder,
  refusedOrder1,
  remind2,
} from "@/request/api/commoditySalesOrderDetail/index";
export default {
  data() {
    return {
      remark: "",
      thdialog: false,
      sell_basket: [],
      self_basket: [], //自家
      checkedDetails: {},
      dialogVisible: false,
      statusColor: "",
      goodsMsg: [],
      detailMsg: [],
      pageTitle: "",
      orderType: Number(this.$route.query.type), //平台 0  非平台 1  自家生产 2
      id: Number(this.$route.query.id),
    };
  },
  methods: {
    // 添加付款
    addPayment() {
      // console.log(this.detailMsg);
      let fromuser =
        this.detailMsg.fromusername == ""
          ? ""
          : this.detailMsg.fromusername + "," + this.detailMsg.fromuserphone;
      let ordertype1 =
        this.detailMsg.fromusername == ""
          ? 1
          : 5;

      this.$router.push({
        path: "payforPurchase",
        query: {
          id: this.detailMsg.id,
          isConfirm: 0,//this.detailMsg.isConfirm,
          fromuser: fromuser,
          ordertype: this.detailMsg.ordertype == 2 ? 1 : 2,
          ordertype1: ordertype1
        },
      });
    },
    paymentRecord() {
      let type = this.orderType == 0 ? 0 : 1;
      let type1 = 0;

      if (type == 1) {
        if (this.detailMsg.ordertype == 1) {
          type1 = "2";
        } else {
          type1 = "1";
        }
      } else {
        if (this.detailMsg.ordertype == 1) {
          type1 = "1";
        } else {
          type1 = "2";
        }
      }

      this.$router.push({
        path: "paymentRecord",
        query: { id: this.detailMsg.id, ordertype: type1 },
      });
    },
    remind() {
      let obj = {
        returnUserId: this.detailMsg.confirmByUserId,
        orderID: this.detailMsg.id,
        orderType: 1,
      };
      remind2(obj).then((resp) => {
        this.$alert("提醒成功！", "提示", {
          confirmButtonText: "确定",
          callback: (action) => {
            this.$message({
              type: "success",
              message: "操作成功！",
            });
          },
        });
      });
    },
    ChChane() {
      let obj = {
        orderPayId: this.id,
        type: 3,
        remark: {},
      };
      this.$confirm(
        "<p>确认撤回该次付款?</p><p>确认后系统将自动撤回该次付款</p>",
        "提示",
        {
          dangerouslyUseHTMLString: true,
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          refusedOrder1(obj).then((resp) => {
            this.$success("操作成功！");
            this.getInfo();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    ChCancel() {
      let obj = {
        orderPayId: this.id,
        type: 4,
        remark: {},
      };
      this.$confirm("确认撤回该次付款?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          refusedOrder1(obj).then((resp) => {
            this.$success("操作成功！");
            this.getInfo();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    ThYes() {
      let res = {
        orderPayId: this.id,
        type: 0,
        remark: {
          typeName: "",
          remark: this.remark,
        },
      };
      refusedOrder1(res).then((resp) => {
        this.$success("成功退回！");
        this.ThhandleClose();
      });
    },
    ThhandleClose() {
      this.thdialog = false;
      this.remark = "";
    },
    ThChange() {
      this.thdialog = true;
    },
    buy_basket1() {
      return <div style="color:#0BA198;">自家筐子</div>;
    },
    renderHeader3() {
      return <div style="color:#0BA198;">卖家筐子</div>;
    },
    renderHeader2() {
      return (
        <div style="color:#0BA198;">
          卖家筐子
          <el-button
            round
            size="mini"
            style="color:#0BA198;border:#0BA198 1px solid;padding: 3px 8px;margin-left:10px;"
          >
            不去皮
          </el-button>
        </div>
      );
    },
    renderHeader1() {
      return (
        <div style="color:#0BA198;">
          卖家筐子
          <el-button
            round
            size="mini"
            style="color:#0BA198;border:#0BA198 1px solid;padding: 3px 8px;margin-left:10px;"
          >
            去皮
          </el-button>
        </div>
      );
    },
    handleClose() {
      this.checkedDetails = {};
      this.sell_basket = [];
      (this.self_basket = []), //自家
        (this.dialogVisible = false);
    },
    goodsDetails(msg) {
      this.checkedDetails = msg;
      console.log(this.checkedDetails.product_baskets);
      this.checkedDetails.isremovepeel = 0; //测试修改数据
      this.sell_basket = this.checkedDetails.product_baskets.sell_basket;
      this.self_basket = this.checkedDetails.product_baskets.self_basket;
      // console.log(this.self_basket,this.carry_basket,this.weigh_basket,this.piece_basket,this.empty_basket,this.buy_basket)
      this.dialogVisible = true;
    },
    getInfo() {
      console.log(this.$route.query.type, this.id);
      this.pageTitle = this.orderType == 2 ? "自家生产详情" : "采购单详情";
      let res = {
        orderId: this.id,
        is_buy: 1,
        type: this.orderType == 0 ? 0 : 1,
      };
      getInfo(res).then((resp) => {
        this.detailMsg = resp.data[0];
        this.goodsMsg = this.detailMsg.details;
        this.statusColor =
          this.detailMsg.status == 5 ? "color:#0BA198;" : "color:red";
        // this.detailMsg.statusname = '待确认'
      });
    },
    toDate(val) {
      //时间戳格式化
      return moment(val * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
    currencyFormat(num) {
      //科学记数 保留两位小数
      let a = Number(num)
        .toFixed(2)
        .toString()
        .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      return a;
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
    changeTagTitle() {
      // 根据入口改变标签页文本内容
      let obj = this.$store.state.tagsView.visitedViews;
      let type = Number(this.$route.query.type);
      for (let i = 0; i < obj.length; i++) {
        if (obj[i].name == "purchaseOrdersDetail") {
          if (type == 2) {
            this.$store.state.tagsView.visitedViews[i].title = "自家生产详情";
            this.$store.state.tagsView.visitedViews[i].meta.title =
              "自家生产详情";
          }
        }
      }
    },
  },
  created() {
    this.getInfo();
    this.changeTagTitle();
  },
};
</script>
<style lang="scss" scoped>
.button_styl_1 {
  .el-button--mini.is-round {
    padding: 3px 8px;
  }
}
.font_styl_3 {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(1, 6, 33, 0.9);
}
.font_styl_2 {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(1, 6, 33, 0.55);
}
.goodsmsg_styl {
  width: 100%;
  border-bottom: 1px #e9e9e9 solid;
  padding-bottom: 15px;
}
.el-tag {
  padding: 0px 2px !important;
}
.el-tag--medium {
  height: 17px !important;
  line-height: 17px !important;
}
.button_layout_left {
  text-align: left;
  width: 30%;
  display: inline-block;
}
.button_layout_right {
  text-align: right;
  width: 70%;
  display: inline-block;
}
.font_style_1 {
  font-size: 14px;
  font-weight: 400;
  color: rgba(1, 6, 33, 0.55);
}
.p_layout {
  padding-left: 10px;
}
</style>