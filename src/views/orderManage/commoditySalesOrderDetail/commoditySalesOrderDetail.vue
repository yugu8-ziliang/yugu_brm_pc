<template>
  <Container>
    <el-descriptions title="订单信息" :column="3">
      <template slot="extra">
        <font class="font_style_1">操作人:</font>{{ detailMsg.operator }}
      </template>
      <el-descriptions-item label="销售单编号">{{
        detailMsg.ordersellid
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
      <el-descriptions-item label="已收金额" v-if="actualpaypriceIsShow()">{{
        currencyFormat(detailMsg.actualpayprice) + "元"
      }}</el-descriptions-item>
      <el-descriptions-item
        label="剩余未收金额"
        v-if="actualpaypriceIsShow()"
        >{{ currencyFormat(detailMsg.unpaid) + "元" }}</el-descriptions-item
      >
      <el-descriptions-item label="本次付款时间" v-if="detailMsg.status == 3">{{
        toDate(detailMsg.payTimestamp)
      }}</el-descriptions-item>
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
    <div class="button_layout_left">
      <el-button
        type="text"
        v-if="
          detailMsg.statusname != '未成交' &&
          detailMsg.statusname != '待修改' &&
          detailMsg.statusname != '待对方付款'
        "
      >
        <u>退款记录</u>
      </el-button>
      <el-button
        type="text"
        style="margin-left: 80px"
        v-if="
          detailMsg.statusname != '未成交' &&
          detailMsg.statusname != '待修改' &&
          detailMsg.statusname != '待对方付款'
        "
        @click="collectionRecord()"
      >
        <u>收款记录</u>
      </el-button>
    </div>
    <div class="button_layout_right">
      <el-button size="mini">打印</el-button>
      <!--1 平台  待修改 ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！-->
      <el-button
        size="mini"
        v-if="detailMsg.statusname == '待修改'"
        @click="cancellationOfOrder"
      >
        取消订单</el-button
      >
      <el-button
        size="mini"
        type="primary"
        v-if="detailMsg.statusname == '待修改'"
        @click="changeOrder"
      >
        修改订单</el-button
      >
      <!--2 平台  未结清 ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！-->
      <el-button
        size="mini"
        v-if="detailMsg.statusname == '未结清' && detailMsg.ordertype == 1"
        @click="tryAgain"
      >
        再来一单</el-button
      >
      <el-button
        size="mini"
        type="primary"
        v-if="detailMsg.statusname == '未结清' && detailMsg.ordertype == 1"
        @click="addpay"
      >
        添加现金收款</el-button
      >
      <!--3 平台  已结清 ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！-->
      <el-button
        size="mini"
        v-if="detailMsg.statusname == '已结清' && detailMsg.ordertype == 1"
        @click="tryAgain"
      >
        再来一单</el-button
      >
      <!--4 平台  待收款 ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！-->
      <el-button
        size="mini"
        v-if="detailMsg.statusname == '待收款' && detailMsg.isBatchPay == 0"
        @click="gobackchange"
      >
        退回修改</el-button
      >
      <el-button
        size="mini"
        type="primary"
        v-if="detailMsg.statusname == '待收款' && detailMsg.isBatchPay == 0"
      >
        确认收款</el-button
      >
      <el-button
        size="mini"
        type="primary"
        v-if="detailMsg.statusname == '待收款' && detailMsg.isBatchPay != 0"
      >
        处理批量收款单</el-button
      >
      <!--5 平台  待对方付款 ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！-->
      <el-button
        size="mini"
        v-if="detailMsg.statusname == '待对方付款'"
        @click="gobackcancel"
      >
        撤回取消</el-button
      >
      <el-button
        size="mini"
        v-if="detailMsg.statusname == '待对方付款'"
        @click="gobackchange"
      >
        撤回修改</el-button
      >
      <el-button
        size="mini"
        type="primary"
        v-if="detailMsg.statusname == '待对方付款'"
        @click="remind"
      >
        提醒对方付款</el-button
      >
      <!--6/8 非平台  未结清 ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！-->
      <el-button
        size="mini"
        v-if="
          (detailMsg.statusname == '未结清' ||
            detailMsg.statusname == '已结清') &&
          detailMsg.ordertype == 2
        "
      >
        添加退款</el-button
      >
      <el-button
        size="mini"
        v-if="
          (detailMsg.statusname == '未结清' ||
            detailMsg.statusname == '已结清') &&
          detailMsg.ordertype == 2
        "
      >
        退货退款</el-button
      >
      <el-button
        size="mini"
        type="primary"
        v-if="
          (detailMsg.statusname == '未结清' ||
            detailMsg.statusname == '已结清') &&
          detailMsg.ordertype == 2
        "
        @click="addCollection"
      >
        添加收款</el-button
      >
      <!--7 非平台  未成交 ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！-->
      <el-button
        size="mini"
        v-if="detailMsg.statusname == '未成交'"
        @click="cancellationOfOrder"
      >
        取消订单</el-button
      >
      <el-button
        size="mini"
        v-if="detailMsg.statusname == '未成交'"
        @click="changeOrder"
      >
        修改订单</el-button
      >
      <el-button
        size="mini"
        type="primary"
        v-if="detailMsg.statusname == '未成交'"
        @click="addCollection"
      >
        添加收款</el-button
      >
      <!--8 非平台  已结清 同6！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！-->
    </div>
    <el-divider></el-divider>
    <el-descriptions title="客户信息" :column="3">
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
    <el-divider></el-divider>
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
          <el-button type="text" @click="goodsDetails(item)">详情</el-button>
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
                  item.productpiececount
                )
              "
            >
            </span>
          </font>
        </el-col>
        <el-col :span="6"
          ><font class="font_styl_2">商品单价：</font
          ><font class="font_styl_3">{{
            item.productprice + "元/斤"
          }}</font></el-col
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
        ><font class="font_styl_3">{{
          detailMsg.producttypecount + "种"
        }}</font></el-col
      >
      <el-col :span="6"
        ><font>商品金额：</font
        ><font class="font_styl_3" style="color: red">{{
          currencyFormat(detailMsg.producttotalprice) + "元"
        }}</font></el-col
      >
    </el-row>
    <el-row>
      <el-col :span="6"
        ><font class="font_styl_2">售出筐子：</font
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
    <el-row>
      <el-col :span="6"
        ><font class="font_styl_2">使用买家筐子：</font
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
    ></el-descriptions>
    <el-row>
      <el-col :span="6"
        ><font class="font_styl_3">车牌号：</font
        ><font class="font_styl_3">{{
          detailMsg.transferarea + detailMsg.transfernumber
        }}</font></el-col
      >
    </el-row>
    <el-row style="margin-top: 20px">
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
    <el-divider></el-divider>
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
      width="70%"
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
        <el-descriptions-item label="筐子重量:">{{
          checkedDetails.basketweight + "斤"
        }}</el-descriptions-item>
        <el-descriptions-item label="商品净重:">{{
          checkedDetails.productreallyweight
        }}</el-descriptions-item>
        <el-descriptions-item label="商品单价:">{{
          checkedDetails.productprice + "元/斤"
        }}</el-descriptions-item>
        <el-descriptions-item label="商品金额:"
          ><font style="color: red"
            >{{ currencyFormat(checkedDetails.detailtotalprice) }}元</font
          ></el-descriptions-item
        >
      </el-descriptions>
      <el-divider></el-divider>
      <!-- 自家筐子 -->
      <el-table
        :data="self_basket"
        v-if="self_basket.length > 0"
        style="margin-bottom: 10px; border: 1px solid #e9e9e9"
      >
        <el-table-column
          :render-header="renderHeader1"
          v-if="checkedDetails.isremovepeel == 0"
          width="150"
        >
          <template slot-scope="scope">
            [{{ scope.row.basketType }}]{{ scope.row.userbasketname }}
          </template>
        </el-table-column>
        <el-table-column
          :render-header="renderHeader2"
          v-if="checkedDetails.isremovepeel == 1"
          width="150"
        >
          <template slot-scope="scope">
            [{{ scope.row.basketType }}]{{ scope.row.userbasketname }}
          </template>
        </el-table-column>
        <el-table-column
          :render-header="renderHeader3"
          v-if="checkedDetails.isremovepeel == 2"
          width="150"
        >
          <template slot-scope="scope">
            [{{ scope.row.basketType }}]{{ scope.row.userbasketname }}
          </template>
        </el-table-column>
        <el-table-column label="颜色" prop="userbasketcolor"></el-table-column>
        <el-table-column label="空置数量" prop="basketEmptyNumber">
          <template slot-scope="scope">
            {{ scope.row.basketEmptyNumber + "个" }}
          </template>
        </el-table-column>
        <el-table-column
          label="筐子重量"
          v-if="checkedDetails.isremovepeel == 0"
          prop="basketweight"
        >
          <template slot-scope="scope">
            {{ scope.row.basketweight + "斤/个" }}
          </template>
        </el-table-column>
        <el-table-column label="载货量" prop="basketcargo">
          <template slot-scope="scope">
            <font v-if="checkedDetails.subunit == '斤'">{{
              scope.row.basketcargo + "斤/筐"
            }}</font>
            <font v-if="checkedDetails.subunit != '斤'">{{
              scope.row.basketcargo + checkedDetails.subunit + "/筐"
            }}</font>
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="userbasketprice">
          <template slot-scope="scope">
            {{ scope.row.userbasketprice + "元/个" }}
          </template>
        </el-table-column>
        <el-table-column label="筐子过磅" prop="outsellBasketCount">
          <template slot-scope="scope">
            {{ scope.row.outsellBasketCount + "个" }}
          </template>
        </el-table-column>
        <el-table-column label="留库筐子" prop="basketvacatecount">
          <template slot-scope="scope">
            {{ scope.row.basketvacatecount + "个" }}
          </template>
        </el-table-column>
        <el-table-column label="售出筐子" prop="userbasketcount">
          <template slot-scope="scope">
            {{ scope.row.userbasketcount + "个" }}
          </template>
        </el-table-column>
        <el-table-column label="筐子金额" prop="userbaskettotalprice">
          <template slot-scope="scope">
            <font>{{ scope.row.userbaskettotalprice + "元" }}</font>
          </template>
        </el-table-column>
        <el-table-column
          label="筐子总重"
          v-if="checkedDetails.isremovepeel == 0"
        >
          <template slot-scope="scope">
            {{ scope.row.all_basket_weigh + "斤" }}
          </template>
        </el-table-column>
      </el-table>
      <!-- 载货筐子 -->
      <el-table
        :data="carry_basket"
        v-if="carry_basket.length > 0"
        style="margin-bottom: 10px; border: 1px solid #e9e9e9"
      >
        <el-table-column
          :render-header="carry_basket1"
          v-if="checkedDetails.isremovepeel == 0"
          width="150"
        >
          <template slot-scope="scope">
            [{{ scope.row.basketType }}]{{ scope.row.userbasketname }}
          </template>
        </el-table-column>
        <el-table-column
          :render-header="carry_basket2"
          v-if="checkedDetails.isremovepeel == 1"
          width="150"
        >
          <template slot-scope="scope">
            [{{ scope.row.basketType }}]{{ scope.row.userbasketname }}
          </template>
        </el-table-column>
        <el-table-column
          :render-header="carry_basket3"
          v-if="checkedDetails.isremovepeel == 2"
          width="150"
        >
          <template slot-scope="scope">
            [{{ scope.row.basketType }}]{{ scope.row.userbasketname }}
          </template>
        </el-table-column>
        <el-table-column label="颜色" prop="userbasketcolor"></el-table-column>
        <el-table-column label="数量" prop=""> </el-table-column>
        <el-table-column
          label="筐子重量"
          v-if="checkedDetails.isremovepeel == 0 && checkedDetails.isLoad == 1"
          prop="basketweight"
        >
          <template slot-scope="scope">
            {{ scope.row.basketweight + "斤/个" }}
          </template>
        </el-table-column>
        <el-table-column label="载货量" prop="basketcargo">
          <template slot-scope="scope">
            <font v-if="checkedDetails.subunit == '斤'">{{
              scope.row.basketcargo + "斤/筐"
            }}</font>
            <font v-if="checkedDetails.subunit != '斤'">{{
              scope.row.basketcargo + checkedDetails.subunit + "/筐"
            }}</font>
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="userbasketprice">
          <template slot-scope="scope">
            {{ scope.row.userbasketprice + "元/个" }}
          </template>
        </el-table-column>
        <el-table-column label="筐子过磅" prop="outsellBasketCount">
          <template slot-scope="scope">
            {{ scope.row.outsellBasketCount + "个" }}
          </template>
        </el-table-column>
        <el-table-column
          label="腾空筐子"
          prop="basketvacatecount"
          v-if="
            checkedDetails.isremovepeel == 0 || checkedDetails.subunit == '斤'
              ? false
              : true
          "
        >
          <template slot-scope="scope">
            {{ scope.row.basketvacatecount + "个" }}
          </template>
        </el-table-column>
        <el-table-column label="售出筐子" prop="userbasketcount">
          <template slot-scope="scope">
            {{ scope.row.userbasketcount + "个" }}
          </template>
        </el-table-column>
        <el-table-column label="筐子金额" prop="userbaskettotalprice">
          <template slot-scope="scope">
            <font>{{ scope.row.userbaskettotalprice + "元" }}</font>
          </template>
        </el-table-column>
        <el-table-column
          label="筐子总重"
          v-if="checkedDetails.isremovepeel == 0"
          prop="all_basket_weigh"
        >
          <template slot-scope="scope">
            {{ scope.row.all_basket_weigh + "斤" }}
          </template>
        </el-table-column>
      </el-table>
      <!-- 过磅筐子 -->
      <el-table
        :data="weigh_basket"
        v-if="weigh_basket.length > 0"
        style="margin-bottom: 10px; border: 1px solid #e9e9e9"
      >
        <el-table-column
          :render-header="weigh_basket1"
          v-if="checkedDetails.isremovepeel == 0"
          width="150"
        >
          <template slot-scope="scope">
            [{{ scope.row.basketType }}]{{ scope.row.userbasketname }}
          </template>
        </el-table-column>
        <el-table-column
          :render-header="weigh_basket2"
          v-if="checkedDetails.isremovepeel == 1"
          width="150"
        >
          <template slot-scope="scope">
            [{{ scope.row.basketType }}]{{ scope.row.userbasketname }}
          </template>
        </el-table-column>
        <el-table-column
          :render-header="weigh_basket3"
          v-if="checkedDetails.isremovepeel == 2"
          width="150"
        >
          <template slot-scope="scope">
            [{{ scope.row.basketType }}]{{ scope.row.userbasketname }}
          </template>
        </el-table-column>
        <el-table-column label="颜色" prop="userbasketcolor"></el-table-column>
        <el-table-column
          label="筐子重量"
          v-if="checkedDetails.isremovepeel == 0"
          prop="basketweight"
        >
          <template slot-scope="scope">
            {{ scope.row.basketweight + "斤/个" }}
          </template>
        </el-table-column>
        <el-table-column label="载货量" prop="basketcargo">
          <template slot-scope="scope">
            {{ scope.row.basketcargo + "斤/筐" }}
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="userbasketprice">
          <template slot-scope="scope">
            {{ scope.row.userbasketprice + "元/个" }}
          </template>
        </el-table-column>
        <el-table-column
          label="筐子过磅"
          prop="outsellBasketCount"
          v-if="checkedDetails.isremovepeel == 0"
        >
          <template slot-scope="scope">
            {{ scope.row.outsellBasketCount + "个" }}
          </template>
        </el-table-column>
        <el-table-column
          label="留库筐子"
          prop="basketvacatecount"
          v-if="checkedDetails.isremovepeel == 0"
        >
          <template slot-scope="scope">
            {{ scope.row.basketvacatecount + "个" }}
          </template>
        </el-table-column>
        <el-table-column
          label="筐子出货"
          prop="outsellBasketCount"
          v-if="checkedDetails.isremovepeel == 1"
        >
          <template slot-scope="scope">
            {{ scope.row.outsellBasketCount + "个" }}
          </template>
        </el-table-column>
        <el-table-column label="售出筐子" prop="userbasketcount">
          <template slot-scope="scope">
            {{ scope.row.userbasketcount + "个" }}
          </template>
        </el-table-column>
        <el-table-column label="筐子金额" prop="userbaskettotalprice">
          <template slot-scope="scope">
            <font>{{ scope.row.userbaskettotalprice + "元" }}</font>
          </template>
        </el-table-column>
        <el-table-column
          label="筐子总重"
          v-if="checkedDetails.isremovepeel == 0"
          prop="all_basket_weigh"
        >
          <template slot-scope="scope">
            {{ scope.row.all_basket_weigh + "斤" }}
          </template>
        </el-table-column>
      </el-table>
      <!-- 计件筐子 -->
      <el-table
        :data="piece_basket"
        v-if="piece_basket.length > 0"
        style="border: 1px solid #e9e9e9"
      >
        <el-table-column :render-header="piece_basket1" width="150">
          <template slot-scope="scope">
            [{{ scope.row.basketType }}]{{ scope.row.userbasketname }}
          </template>
        </el-table-column>
        <el-table-column label="颜色" prop="userbasketcolor"></el-table-column>
        <el-table-column label="载货量" prop="basketcargo">
          <template slot-scope="scope">
            <font>{{ scope.row.basketcargo + "斤/筐" }}</font>
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="userbasketprice">
          <template slot-scope="scope">
            {{ scope.row.userbasketprice + "元/个" }}
          </template>
        </el-table-column>
        <el-table-column
          label="筐子计件"
          prop="outsellBasketCount"
          v-if="checkedDetails.isremovepeel == 0"
        >
          <template slot-scope="scope">
            {{ scope.row.outsellBasketCount + "个" }}
          </template>
        </el-table-column>
        <el-table-column
          label="留库筐子"
          prop="basketvacatecount"
          v-if="checkedDetails.isremovepeel == 0"
        >
          <template slot-scope="scope">
            {{ scope.row.basketvacatecount + "个" }}
          </template>
        </el-table-column>
        <el-table-column label="售出筐子" prop="userbasketcount">
          <template slot-scope="scope">
            {{ scope.row.userbasketcount + "个" }}
          </template>
        </el-table-column>
        <el-table-column label="筐子金额" prop="userbaskettotalprice">
          <template slot-scope="scope">
            <font>{{ scope.row.userbaskettotalprice + "元" }}</font>
          </template>
        </el-table-column>
      </el-table>
      <!-- 空置筐子 -->
      <el-table
        :data="empty_basket"
        v-if="empty_basket.length > 0"
        style="border: 1px solid #e9e9e9"
      >
        <el-table-column :render-header="empty_basket1" width="150">
          <template slot-scope="scope">
            [{{ scope.row.basketType }}]{{ scope.row.userbasketname }}
          </template>
        </el-table-column>
        <el-table-column label="颜色" prop="userbasketcolor"></el-table-column>
        <el-table-column label="空置数量" prop="basketEmptyNumber">
          <template slot-scope="scope">
            {{ scope.row.basketEmptyNumber + "个" }}
          </template>
        </el-table-column>
        <el-table-column label="载货量" prop="basketcargo">
          <template slot-scope="scope">
            <font v-if="checkedDetails.subunit == '斤'">{{
              scope.row.basketcargo + "斤/筐"
            }}</font>
            <font v-if="checkedDetails.subunit != '斤'">{{
              scope.row.basketcargo + checkedDetails.subunit + "/筐"
            }}</font>
          </template>
        </el-table-column>
        <el-table-column label="单价" prop="userbasketprice">
          <template slot-scope="scope">
            {{ scope.row.userbasketprice + "元/个" }}
          </template>
        </el-table-column>
        <el-table-column label="售出筐子" prop="userbasketcount">
          <template slot-scope="scope">
            {{ scope.row.userbasketcount + "个" }}
          </template>
        </el-table-column>
        <el-table-column label="筐子金额" prop="userbaskettotalprice">
          <template slot-scope="scope">
            <font>{{ scope.row.userbaskettotalprice + "元" }}</font>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 5px; border: 1px solid #e9e9e9; padding: 15px">
        <el-row>
          <el-col :span="4"> 小计: </el-col>
          <el-col :span="20" style="text-align: right">
            <font style="margin-right: 30px"
              >筐子过磅：{{ checkedDetails.outsellBasketCount + "个" }}</font
            >
            <font style="color: #010621">筐子总重：</font
            ><font style="color: red; margin-right: 30px"
              >{{ checkedDetails.basketweight }}斤</font
            >
            <font style="margin-right: 30px"
              >售出筐子：{{ checkedDetails.buybasketcount + "个" }}</font
            >
            <font style="margin-right: 30px"
              >腾空筐子：{{ checkedDetails.basketvacatecount + "个" }}</font
            >
            <font style="margin-right: 30px"
              >留库筐子：{{ checkedDetails.leave_basket + "个" }}</font
            >
            <font style="color: #010621">筐子金额：</font
            ><font style="color: red"
              >{{ checkedDetails.buybasketprice }}元</font
            >
          </el-col>
        </el-row>
      </div>
      <div
        style="border-bottom: 1px dashed #e9e9e9; margin: 15px 0px; width: 100"
      ></div>
      <!-- 买家筐子 -->
      <el-table
        :data="buy_basket"
        v-if="buy_basket.length > 0"
        style="border: 1px solid #e9e9e9"
      >
        <el-table-column
          :render-header="buy_basket1"
          v-if="checkedDetails.isremovepeel == 0"
          width="200"
        >
          <template slot-scope="scope">
            [{{ scope.row.basketType }}]{{ scope.row.userbasketname }}
          </template>
        </el-table-column>
        <el-table-column
          :render-header="buy_basket2"
          v-if="checkedDetails.isremovepeel == 1"
          width="200"
        >
          <template slot-scope="scope">
            [{{ scope.row.basketType }}]{{ scope.row.userbasketname }}
          </template>
        </el-table-column>
        <el-table-column
          :render-header="buy_basket3"
          v-if="checkedDetails.isremovepeel == 2"
          width="200"
        >
          <template slot-scope="scope">
            [{{ scope.row.basketType }}]{{ scope.row.userbasketname }}
          </template>
        </el-table-column>
        <el-table-column label="颜色" prop="userbasketcolor"></el-table-column>
        <el-table-column
          label="筐子重量"
          prop="basketweight"
          v-if="checkedDetails.isremovepeel == 1"
        >
          <template slot-scope="scope">
            {{ scope.row.basketweight + "斤/个" }}
          </template>
        </el-table-column>
        <el-table-column label="载货量" prop="userbasketcolor">
          <template slot-scope="scope">
            <font v-if="checkedDetails.subunit == '斤'">{{
              scope.row.basketcargo + "斤/筐"
            }}</font>
            <font v-if="checkedDetails.subunit != '斤'">{{
              scope.row.basketcargo + checkedDetails.subunit + "/筐"
            }}</font>
          </template>
        </el-table-column>
        <el-table-column label="使用数量" prop="userbasketcount">
          <template slot-scope="scope">
            {{ scope.row.userbasketcount + "个" }}
          </template>
        </el-table-column>
      </el-table>
      <div
        style="margin-top: -1px; border: 1px solid #e9e9e9; padding: 15px"
        v-if="buy_basket.length > 0"
      >
        <el-row>
          <el-col :span="4"> 小计: </el-col>
          <el-col :span="20" style="text-align: right">
            使用买家筐子:{{ checkedDetails.buy_basket_count }}个
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
        >
          <font style="margin-right: 15px"
            >售出筐子：{{ checkedDetails.buybasketcount }}个</font
          >
          <font style="margin-right: 15px"
            >使用买家筐子：{{ checkedDetails.buybasketcount }}个</font
          >
          <font style="margin-right: 15px"
            >筐子重量：{{ checkedDetails.buybasketcount }}个</font
          >
          <font style="color: #010621">筐子金额：</font
          ><font style="color: red; margin-right: 15px"
            >{{ checkedDetails.buybasketcount }}元</font
          >
        </div>
        <div style="text-align: right; margin-top: 15px">
          <p style="font-size: 16px; color: #010621">
            金额总计:<font style="color: red"
              >{{ checkedDetails.detailtotalprice }}元</font
            >
          </p>
          <p class="font_styl_2">
            包含商品金额：{{ checkedDetails.producttotalprice }}元
          </p>
        </div>
      </span>
    </el-dialog>
    <el-dialog
      title="退回修改"
      :visible.sync="dialogVisible2"
      width="20%"
      :before-close="handleClose2"
    >
      <el-form
        :model="form"
        :rules="rules"
        ref="ruleForm"
        class="demo-ruleForm"
      >
        <el-form-item label="活动名称" prop="cause">
          <el-select v-model="form.cause" placeholder="请选择">
            <el-option label="未收到款项" value="未收到款项"></el-option>
            <el-option label="全额填写有误" value="全额填写有误"></el-option>
            <el-option
              label="支付凭证上传错误"
              value="支付凭证上传错误"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注信息" prop="remark">
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="form.remark"
            maxlength="200"
            show-word-limit
            rows="4"
            resize="none"
          >
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleClose2">取消</el-button>
        <el-button type="primary" @click="submitcause">确定</el-button>
      </span>
    </el-dialog>
  </Container>
</template>
<script>
import moment from "moment";
import {
  getInfo,
  repealOrder,
  refusedOrder1,
  remind,
} from "@/request/api/commoditySalesOrderDetail/index";
export default {
  // name: "commoditySalesOrderDetail",
  data() {
    return {
      form: {
        cause: "",
        remark: "",
      },
      rules: {
        cause: [{ required: true, message: "请选择原因", trigger: "chagne" }],
      },
      dialogVisible2: false,
      self_basket: [], //自家
      carry_basket: [], //载货
      weigh_basket: [], //过磅
      piece_basket: [], //计件
      empty_basket: [], //空置
      buy_basket: [], //买家
      checkedDetails: {},
      dialogVisible: false,
      statusColor: "",
      detailMsg: {},
      goodsMsg: [],
    };
  },
  methods: {
    //添加收款
    addCollection() {
      const { isP } = this.$route.query;
      const { ordertype } = this.detailMsg; //传参type不为1时 1.平台订单 2.非平台订单 type为1时 1：非平台采购单 2.自家生产
      // console.log(this.detailMsg);
      let fromuser =
        this.detailMsg.fromusername == ""
          ? ""
          : this.detailMsg.fromusername + "," + this.detailMsg.fromuserphone;
      this.$router.push({
        path: "addCollection",
        query: {
          id: this.detailMsg.id,
          isF: Number(!this.detailMsg.confirmTimestamp), //是否首次
          isP: Number(!isP) !== 1 ? (ordertype === 1 ? 1 : 0) : 0,
          fromuser: fromuser,
          ordertype: this.detailMsg.ordertype,
        },
      });
    },
    collectionRecord() {
      this.$router.push({
        path: "commodityCollectionRecord",
        query: {
          id: this.detailMsg.id,
          ordertype: this.detailMsg.ordertype.toString(),
        },
      });
    },
    remind() {
      let obj = {
        returnUserId: this.detailMsg.confirmByUserId,
        orderID: this.detailMsg.ordersellid,
        orderType: 1,
      };
      remind(obj).then((resp) => {
        this.$alert("提醒成功", "提示", {
          confirmButtonText: "确定",
          callback: (action) => {
            this.$message({
              type: "success",
            });
          },
        });
      });
    },
    submitcause() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let obj = {
            orderPayId: this.detailMsg.orderPayId,
            type: 3,
            remark: {
              typeName: this.form.cause,
              remark: this.form.remark,
            },
          };
          refusedOrder1(obj).then((resp) => {
            this.$success("操作成功！");
            this.getInfo();
          });
          this.handleClose2();
        }
      });
    },
    gobackchange() {
      this.dialogVisible2 = true;
    },
    addpay() {
      this.$error("暂无!");
    },
    gobackcancel() {
      let obj = {
        orderPayId: this.detailMsg.orderPayId,
        type: 4,
        remark: {},
      };
      this.$confirm("确认修改订单?", "提示", {
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
    cancellationOfOrder() {
      this.$confirm("确认取消订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          repealOrder({ uid: this.$route.query.id }).then((resp) => {
            this.$success("取消成功!");
            this.$router.push({ path: "commoditySalesOrder" });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "暂不取消!",
          });
        });
    },
    changeOrder() {
      this.$confirm("确认修改订单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let transferimageurls = [];
          this.detailMsg.transferimageurls.forEach((el) => {
            transferimageurls.push({
              url: el,
            });
          });

          let param = {
            form: {
              factoryName:
                this.detailMsg.ordertype == 1
                  ? this.detailMsg.userName
                  : this.detailMsg.fromusername,
              factoryPhone:
                this.detailMsg.ordertype == 1
                  ? this.detailMsg.phoneNumber
                  : this.detailMsg.fromuserphone,
              customerId:
                this.detailMsg.ordertype == 1 ? this.detailMsg.selluserid : "",
              remark:
                this.detailMsg.remark.length > 0
                  ? this.detailMsg.remark[0].remark
                  : "",
              transinfo1: this.detailMsg.transferarea,
              transinfo2: this.detailMsg.transfernumber,
              transimageList: transferimageurls,
              sellOrderId: this.detailMsg.id,
              amountGoods: this.detailMsg.producttotalprice,
              saleBasket: this.detailMsg.baskettotalcount,
              amountBasket: this.detailMsg.baskettotalprice,
              useBuyerBasket: this.detailMsg.useBuyBasket,
              basketVacateCount: this.detailMsg.ordertotalprice,
            },
            tableDataList: [],
          };
          let arrs = [];
          for (let i = 0; i < this.detailMsg.details.length; i++) {
            const el = this.detailMsg.details[i];

            let tableDataBasket = [];
            let tableDataBasket1 = [];
            let tableDataBasket2 = [];
            let tableDataBasket3 = [];
            let tableDataBasket4 = [];
            for (let j = 0; j < el.basket_details.length; j++) {
              const el2 = el.basket_details[j];
              if (el2.type == 1) {
                tableDataBasket4.push({
                  basketid: el2.id,
                  basketname: el2.userbasketname,
                  basketType: el2.basketType,
                  nums: el2.basketEmptyNumber,
                  userbasketid: el2.id,
                  basketcolor: el2.userbasketcolor,
                  basketWeight: el2.basketweight,
                  basketCargo: el2.basketcargo,
                  userBasketPrice: el2.userbasketprice,
                  outsellBasketCount: el2.outsellBasketCount,
                  userBasketCount: el2.userbasketcount,
                  basketVacateCount: el2.basketvacatecount,
                });
              }
              if (el2.type == 2) {
                tableDataBasket3.push({
                  basketId: el2.id,
                  basektName: el2.userbasketname,
                  basketType: el2.basketType,
                  nums: el2.basketEmptyNumber,
                  userbasketid: el2.id,
                  basketColor: el2.userbasketcolor,
                  basketWeight: el2.basketweight,
                  basketCargo: el2.basketcargo,
                  userBasketPrice: el2.userbasketprice,
                  outsellBasketCount: el2.outsellBasketCount,
                  userBasketCount: el2.userbasketcount,
                  basketVacateCount: el2.basketvacatecount,
                });
              }

              if (el2.type == 3) {
                tableDataBasket.push({
                  basketid: el2.id,
                  basketname: el2.userbasketname,
                  basketType: el2.basketType,
                  nums: el2.basketEmptyNumber,
                  userbasketid: el2.id,
                  basketcolor: el2.userbasketcolor,
                  basketWeight: el2.basketweight,
                  basketCargo: el2.basketcargo,
                  userBasketPrice: el2.userbasketprice,
                  outsellBasketCount: el2.outsellBasketCount,
                  userBasketCount: el2.userbasketcount,
                  basketVacateCount: el2.basketvacatecount,
                });
              }
              if (el2.type == 4) {
                tableDataBasket1.push({
                  basketId: el2.id,
                  basektName: el2.userbasketname,
                  basketType: el2.basketType,
                  nums: el2.basketEmptyNumber,
                  userbasketid: el2.id,
                  basketColor: el2.userbasketcolor,
                  basketWeight: el2.basketweight,
                  basketCargo: el2.basketcargo,
                  userBasketPrice: el2.userbasketprice,
                  outsellBasketCount: el2.outsellBasketCount,
                  userBasketCount: el2.userbasketcount,
                  basketVacateCount: el2.basketvacatecount,
                });
              }
              if (el2.type == 5) {
                tableDataBasket2.push({
                  basketid: el2.id,
                  basketname: el2.userbasketname,
                  basketType: el2.basketType,
                  nums: el2.basketEmptyNumber,
                  userbasketid: el2.id,
                  basketcolor: el2.userbasketcolor,
                  basketWeight: el2.basketweight,
                  basketCargo: el2.basketcargo,
                  userBasketPrice: el2.userbasketprice,
                  outsellBasketCount: el2.outsellBasketCount,
                  userBasketCount: el2.userbasketcount,
                  basketVacateCount: el2.basketvacatecount,
                });
              }
            }

            let multipleSelectionList = [];
            for (let p = 0; p < el.productBatchInfo.length; p++) {
              const eleP = el.productBatchInfo[p];
              multipleSelectionList.push({
                productId: eleP.productId,
                batchsource: eleP.batchsource,
                timestamp: eleP.timestamp,
                batchnumber: eleP.specNumber,
                piecenumber: eleP.pieceNumber,
                basketnumber: eleP.basketNumber,
                batchid: eleP.batchId,
                batchsourcetype: eleP.batchSourceType,
                batchsourcename: eleP.batchSourceTypeName,
              });
            }

            arrs.push({
              classifyid: el.classifyId, // 分类Id
              productid: el.productid, // 商品id
              productname: el.name, // 商品名称
              categoryName:
                el.firstClassifyName + "-" + el.classifyName + "-" + el.name,
              variety: el.variety, // 品牌
              spec: el.spec, // 规格
              regionid: el.regionid, //
              regionname: el.region, // 产地
              subunit: el.subunit || "", // 计算单位
              subUnit2: el.subunit2 || "", //二级计算单位  没有为 ""       新增字段
              subUnit2Weight: Number(el.subunit2weight) || "", //二级单位重量 没有为 0.0  新增字段
              subUnit3: el.subunit3 || "", //三级计算单位  没有为""          新增字段
              subUnit3Weight: Number(el.subunit3weight) || "", //三级单位重量 没有为 0.0  新增字段
              pieceunit: el.pieceunit || "", // 计件单位
              subunitweight: Number(el.subunitweight) || "", // 单位数量
              batchcount: Number(el.buybasketcount) || "", // 库存数量
              basketcount: Number(el.basketvacatecount) || "", // 筐子数量
              piececount: Number(el.productpiececount) || "", // 计件数量

              forms: {
                // avgPrice: Number(el.productprice)||"",
                sellPrice: Number(el.productprice) || "",
                pieceUnit: el.sellPieceUnit || "",
                purchasenums: Number(el.productcount) || "",
                piecenumber: Number(el.productpiececount) || "",
                piecenumber1: Number(el.buybasketcount) || "",
                isLoad: el.isLoad,
                isRemovePeel: 1,
              },
              tableDataBasket,
              tableDataBasket1,
              tableDataBasket2,
              tableDataBasket3,
              tableDataBasket4,
              multipleSelectionList: multipleSelectionList,

              totalAmount: Number(el.producttotalprice) || "",
              weightBasket: Number(el.basketweight) || "",
              userBasketCounts: Number(el.fullNum) || "",
              typeBasket: Number(el.baskettypecount) || "",
              totalAmountBaskets: Number(el.buybasketprice) || "",
              numberBuyersBasket: Number(el.buybasketcount) || "",
              basketVacateCount: Number(el.basketvacatecount) || "",
            });
          }
          param.tableDataList = arrs;
          // console.log(param);

          this.$store.dispatch("common/addNewrequestData", {
            isStatus: "editSales",
            param,
          });
          this.$closePage("addSalesTicket", {});
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    tryAgain() {
      this.$confirm("确认再来一单?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // this.$closePage('addSalesTicket',{id:this.$route.query.id});
          this.$router.push({
            path: "addSalesTicket",
            query: { id: this.$route.query.id },
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    buy_basket3() {
      return <div style="color:#0BA198;">买家筐子</div>;
    },
    buy_basket2() {
      return (
        <div style="color:#0BA198;">
          买家筐子
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
    buy_basket1() {
      return (
        <div style="color:#0BA198;">
          买家筐子
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
    empty_basket1() {
      return <div style="color:#0BA198;">空置筐子</div>;
    },
    piece_basket1() {
      return <div style="color:#0BA198;">计件筐子</div>;
    },
    carry_basket3() {
      return <div style="color:#0BA198;">载货筐子</div>;
    },
    carry_basket2() {
      return (
        <div style="color:#0BA198;">
          载货筐子
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
    carry_basket1() {
      return (
        <div style="color:#0BA198;">
          载货筐子
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
    weigh_basket3() {
      return <div style="color:#0BA198;">过磅筐子</div>;
    },
    weigh_basket2() {
      return (
        <div style="color:#0BA198;">
          过磅筐子
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
    weigh_basket1() {
      return (
        <div style="color:#0BA198;">
          过磅筐子
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
    renderHeader3() {
      return <div style="color:#0BA198;">自家筐子</div>;
    },
    renderHeader2() {
      return (
        <div style="color:#0BA198;">
          自家筐子
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
          自家筐子
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
    handleClose2() {
      this.dialogVisible2 = false;
      this.form = {
        cause: "",
        remark: "",
      };
    },
    handleClose() {
      this.checkedDetails = {};
      this.self_basket = []; //自家
      this.carry_basket = []; //载货
      this.weigh_basket = []; //过磅
      this.piece_basket = []; //计件
      this.empty_basket = []; //空置
      this.buy_basket = []; //买家
      this.dialogVisible = false;
    },
    goodsDetails(msg) {
      // console.log(msg)

      this.checkedDetails = msg;
      // this.checkedDetails.isremovepeel = 0//测试修改数据
      this.self_basket = this.checkedDetails.product_baskets.self_basket;
      this.carry_basket = this.checkedDetails.product_baskets.carry_basket;
      this.weigh_basket = this.checkedDetails.product_baskets.weigh_basket;
      this.piece_basket = this.checkedDetails.product_baskets.piece_basket;
      this.empty_basket = this.checkedDetails.product_baskets.empty_basket;
      this.buy_basket = this.checkedDetails.product_baskets.buy_basket;
      // console.log(this.self_basket,this.carry_basket,this.weigh_basket,this.piece_basket,this.empty_basket,this.buy_basket)
      this.dialogVisible = true;
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
    actualpaypriceIsShow() {
      //已收金额 是否显示  //剩余未收金额 是否显示
      if (this.detailMsg.status == 4 || this.detailMsg.status == 3) {
        return true;
      } else {
        return false;
      }
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
    getInfo() {
      // let rid = this.$route.query.id;
      const { id, isP } = this.$route.query;
      //  type 0.平台采购 1.非平台采购，自家生产填
      getInfo({ orderId: id, type: Number(!isP) }).then((resp) => {
        //订单信息接口调用
        this.detailMsg = resp.data[0];
        // this.detailMsg.status = 1;
        // this.detailMsg.isBatchPay = 1 //是否批量
        // this.detailMsg.ordertype = 2 //平台1  非平台2
        // this.detailMsg.custmorType = 3
        // this.detailMsg.companyType = 1  //企业1  个人2
        // this.detailMsg.statusname = '已结清'// 状态测试
        // console.log(this.detailMsg)
        this.goodsMsg = this.detailMsg.details;
        // console.log(this.goodsMsg[0]);
        this.statusColor =
          this.detailMsg.status == 5
            ? "color:#0BA198;"
            : this.detailMsg.status == 1
            ? "color:#DF971A;"
            : "color:#DD4C4D;"; // 更改订单状态颜色
      });
    },
  },
  created() {
    this.getInfo();
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
.font_style_1 {
  width: 56px;
  height: 22px;
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(1, 6, 33, 0.55);
  line-height: 22px;
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
.el-tag {
  padding: 0px 2px !important;
}
.el-tag--medium {
  height: 17px !important;
  line-height: 17px !important;
}
</style>
