<template>
  <Container :title="pageTitle">

    <!-- 自家生产 -->
    <!-- <el-descriptions title="订单信息" :column="3" v-if="orderType == 2">
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
    </div> -->
    <!-- 订单信息 -->
    <el-card class="card" v-if="orderType != 2" shadow="always">
      <!-- header -->
      <div slot="header" class="card-header">
        <div class="card-header__title">
          <span class="label">订单信息</span>
          <span class="operator">操作人: {{ detailMsg.operator || '暂无信息' }}</span>
        </div>
        <div class="card-header__action">
          <el-button size="mini">打印</el-button>
          <!--1 平台  待确认 ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！-->
          <el-button size="mini" v-if="detailMsg.statusname == '待确认'" @click="ThChange">
            退回修改</el-button>
          <el-button type="primary" size="mini" v-if="detailMsg.statusname == '待确认'">
            确认付款</el-button>
          <!--2 平台  未结清 ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！-->
          <el-button size="mini" v-if="detailMsg.statusname == '未结清'">
            发起退款</el-button>
          <el-button size="mini" v-if="detailMsg.statusname == '未结清'">
            退货退款</el-button>
          <el-button type="primary" size="mini" v-if="detailMsg.statusname == '未结清' && orderType == 0">
            继续付款</el-button>
          <el-button type="primary" size="mini" v-if="detailMsg.statusname == '未结清' && orderType == 1"
            @click="addPayment()">
            添加付款</el-button>
          <!--3 平台  已结清 ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！-->
          <el-button size="mini" v-if="detailMsg.statusname == '已结清'">
            发起退款</el-button>
          <el-button type="primary" size="mini" v-if="detailMsg.statusname == '已结清'">
            退货退款</el-button>
          <!--4 平台  待对方付款 ！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！-->
          <el-button size="mini" v-if="detailMsg.statusname == '待对方收款' && detailMsg.isBatchPay == 0" @click="ChCancel">
            撤回取消</el-button>
          <el-button size="mini" v-if="detailMsg.statusname == '待对方收款' && detailMsg.isBatchPay == 0" @click="ChChane">
            撤回修改</el-button>
          <el-button size="mini" type="primary" v-if="detailMsg.statusname == '待对方收款' && detailMsg.isBatchPay == 0"
            @click="remind">
            提醒对方付款</el-button>
          <el-button size="mini" type="primary" v-if="detailMsg.statusname == '待对方收款' && detailMsg.isBatchPay == 1">
            处理批量付款单</el-button>
        </div>

      </div>
      <div class="card-body">
        <!-- body -->
        <el-row :gutter="10" justify="start" align="middle">
          <!-- 1:采购单编号 -->
          <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4">
            <div class="grid-content">
              <span class="label text--info">采购单编号:</span>
              <span class="value text--primary">{{
                orderType == 0 ? detailMsg.ordersellid : detailMsg.orderaddreportid
              }}
              </span>
            </div>
          </el-col>
          <!-- 2:订单状态 -->
          <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4">
            <div class="grid-content">
              <span class="label text--info">订单状态:</span>
              <span class="value text--primary" :style="statusColor">
                {{ detailMsg.statusname }}
              </span>
            </div>
          </el-col>
          <!-- 3:订单时间 -->
          <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4">
            <div class="grid-content">
              <span class="label text--info">订单时间:</span>
              <span class="value text--primary">
                {{ toDate(detailMsg.timestamp) }}
              </span>
            </div>
          </el-col>
          <!-- 4:订单金额 -->
          <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4">
            <div class="grid-content">
              <span class="label text--info">订单金额:</span>
              <span class="value text--primary">
                {{ currencyFormat(detailMsg.ordertotalprice) + "元" }}
              </span>
            </div>
          </el-col>
          <!-- 5:合计确认金额 -->
          <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4">
            <div class="grid-content">
              <span class="label text--info" v-if="detailMsg.statusname == '待确认' ||
                detailMsg.statusname == '待对方收款' || detailMsg.statusname == '未结清'">
                {{
                  detailMsg.unrecognizedamount > 0 && detailMsg.payPrice > 0
                  ? '合计确认金额'
                  : detailMsg.unrecognizedamount > 0 && detailMsg.payPrice == 0
                    ? '确认金额'
                    : '实际付款'
                }}:
              </span>
              <!-- <span class=" value text--primary">
                {{ currencyFormat(detailMsg.ordertotalprice) + "元" }}
                </span> -->
              <el-tooltip class="item" effect="dark" placement="bottom">
                <div slot="content" v-if="detailMsg.unrecognizedamount > 0 && detailMsg.payPrice > 0">
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
                <div slot="content" v-if="detailMsg.unrecognizedamount > 0 && detailMsg.payPrice == 0">
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
                <div slot="content" v-if="detailMsg.unrecognizedamount == 0 && detailMsg.payPrice > 0">
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
                <span style="color: #0ba198">
                  {{
                    currencyFormat(
                      Number(detailMsg.unrecognizedamount || 0) +
                      Number(detailMsg.payPrice || 0)
                    )
                  }}元
                </span>
                <span v-show="!detailMsg.unrecognizedamount && !detailMsg.payPrice">(赊账)</span>
              </el-tooltip>
            </div>
          </el-col>
        </el-row>
      </div>
      <div class="card-footer">
        <el-link type="primary" v-if="detailMsg.statusname == '未结清' || detailMsg.statusname == '已结清'
          ">
          退款记录
        </el-link>
        <el-link type="primary" style="margin-left: 24px" v-if="detailMsg.statusname == '未结清' || detailMsg.statusname == '已结清'
          " @click="paymentRecord">
          付款记录
        </el-link>
      </div>
    </el-card>
    <!-- 客户信息 -->
    <el-card class="card" v-if="orderType != 2" shadow="always">
      <!-- header -->
      <div slot="header" class="card-header">
        <div class="card-header__title">
          <span class="label">客户信息</span>
        </div>
      </div>
      <div class="card-body">
        <el-row :gutter="40" justify="start" align="middle">
          <!-- 1:客户姓名 -->
          <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4">
            <div class="grid-content">
              <span class="label text--primary">客户姓名:</span>
              <span class="value text--primary">
                {{ detailMsg.ordertype == 1 ? detailMsg.userName : detailMsg.fromusername }}
                <user-type :type="detailMsg.ordertype"></user-type>
              </span>
            </div>
          </el-col>
          <!-- 2:联系电话 -->
          <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="4">
            <div class="grid-content">
              <span class="label text--primary">联系电话:</span>
              <span class="value text--primary">
                {{ detailMsg.ordertype == 1 ? detailMsg.phoneNumber : detailMsg.fromuserphone }}
              </span>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 商品信息 -->
    <el-card class="card" shadow="always">
      <!-- header -->
      <div slot="header" class="card-header">
        <div class="card-header__title">
          <span class="label">商品信息</span>
        </div>
      </div>
      <div class="card-body">
        <template v-for="( item ) in  goodsMsg ">
          <div class="card-body__goods">
            <div class="goods-header">
              <div class="goods-header__name">
                {{ item.firstClassifyName + "-" + item.classifyName + "-" + item.name }}
              </div>
              <div class="goods-header__detail--btn">
                <el-button type="text" @click="goodsDetails(item)"
                  v-if="item.product_baskets.have_basket == 1">详情</el-button>
              </div>
            </div>
            <div class="goods-main">
              <el-row :gutter="40" justify="start" align="middle">
                <!-- 1 -->
                <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="6">
                  <div class="grid-content">
                    <span class="label text--info">品种品牌:</span>
                    <span class="value text--primary">
                      {{ item.variety }}
                    </span>
                  </div>
                </el-col>
                <!-- 2-->
                <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="6">
                  <div class="grid-content">
                    <span class="label text--info">产地：:</span>
                    <span class="value text--primary">
                      {{ item.region }}
                    </span>
                  </div>
                </el-col>
                <!-- 3 -->
                <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="6">
                  <div class="grid-content">
                    <span class="label text--info">级别/规格:</span>
                    <span class="value text--primary">
                      {{ item.spec }}
                    </span>
                  </div>
                </el-col>
                <!-- 4 -->
                <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="6">
                  <div class="grid-content">
                    <span class="label text--info">计算单位：:</span>
                    <span class="value text--primary">
                      {{ item.subunit }}
                    </span>
                  </div>
                </el-col>
                <!-- 5 -->
                <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="6">
                  <div class="grid-content">
                    <span class="label text--info">销售数量:</span>
                    <span class="value text--primary" v-html="getStock(
                      item.subunit,
                      item.subUnit2,
                      item.subUnit3,
                      item.sellPieceUnit,
                      item.subUnit2Weight,
                      item.subUnit3Weight,
                      item.productcount,
                      item.buybasketcount,
                      item.productPieceCount
                    )">
                    </span>
                  </div>
                </el-col>
                <!-- 6 -->
                <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="6">
                  <div class="grid-content">
                    <span class="label text--info">{{ orderType == 2 ? "生产单价" : "商品单价" }}:</span>
                    <span class="value text--primary">
                      {{ item.productprice }}元/{{ item.subunit }}
                    </span>
                  </div>
                </el-col>
                <!-- 7 -->
                <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="6">
                  <div class="grid-content">
                    <span class="label text--primary">商品金额：:</span>
                    <span class="value text--danger">
                      {{ currencyFormat(item.producttotalprice) }}元
                    </span>
                  </div>
                </el-col>
                <!-- 8-->
                <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="6">
                  <div class="grid-content">
                    <span class="label text--primary">筐子种类：:</span>
                    <span class="value text--primary">
                      {{ item.baskettypecount }}种
                    </span>
                  </div>
                </el-col>
                <!-- 9 -->
                <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="6">
                  <div class="grid-content">
                    <span class="label text--primary">售出筐子:</span>
                    <span class="value text--primary">
                      {{ item.buybasketcount }}个
                    </span>
                  </div>
                </el-col>
                <!-- 10 -->
                <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="6">
                  <div class="grid-content">
                    <span class="label text--primary">筐子金额:</span>
                    <span class="value text--danger">
                      {{ item.buybasketprice }}元
                    </span>
                  </div>
                </el-col>
              </el-row>
            </div>
            <el-divider></el-divider>
            <div class="goods-footer">
              <span class="text--primary">金额小计:</span>
              <span class="text--danger">{{ currencyFormat(item.detailtotalprice) }}元</span>
            </div>
          </div>
        </template>
      </div>

    </el-card>
    <!-- 合计 -->
    <el-card class="card" v-if="orderType != 2" shadow="always">
      <!-- header -->
      <div slot="header" class="card-header">
        <div class="card-header__title">
          <span class="label">合计</span>
        </div>
      </div>
      <div class="card-body">
        <el-row :gutter="10" justify="start" align="middle">
          <!-- 1:商品种类 -->
          <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="6">
            <div class="grid-content">
              <span class="label text--info">商品种类:</span>
              <span class="value text--primary">
                {{ goodsMsg.length }} 种
              </span>
            </div>
          </el-col>
          <!-- 2:商品金额 -->
          <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="6">
            <div class="grid-content">
              <span class="label text--primary">商品金额:</span>
              <span class="value text--danger">
                {{ currencyFormat(detailMsg.producttotalprice) }}元
              </span>
            </div>
          </el-col>

        </el-row>
        <el-row :gutter="10" justify="start" align="middle">
          <!-- 3:购入筐子 -->
          <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="6">
            <div class="grid-content">
              <span class="label text--info">购入筐子:</span>
              <span class="value text--primary">
                {{ detailMsg.baskettotalcount }} 个
              </span>
            </div>
          </el-col>
          <!-- 4:筐子金额 -->
          <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="6">
            <div class="grid-content">
              <span class="label text--primary">筐子金额:</span>
              <span class="value text--danger">
                {{ currencyFormat(detailMsg.baskettotalprice) }}元
              </span>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="detailMsg.useBuyBasket > 0" :gutter="10" justify="start" align="middle">
          <!-- 5:使用自家筐子 -->
          <el-col :xs="12" :sm="12" :md="8" :lg="6" :xl="6">
            <div class="grid-content">
              <span class="label text--primary">使用自家筐子:</span>
              <span class="value text--danger">
                {{ detailMsg.useBuyBasket }}个
              </span>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 运输信息 -->
    <el-card class="card" v-if="orderType != 2" shadow="always">
      <!-- header -->
      <div slot="header" class="card-header">
        <div class="card-header__title">
          <span class="label">运输信息</span>
        </div>
      </div>
      <!-- body -->
      <div class="card-body">
        <el-row :gutter="10" justify="start" align="middle">
          <!-- 1:车牌号 -->
          <el-col>
            <div class="grid-content">
              <span class="label text--primary">车牌号:</span>
              <span class="value text--primary">
                {{ (detailMsg.transferarea && detailMsg.transfernumber)
                  ?
                  `${detailMsg.transferarea}${detailMsg.transfernumber}` : '--' }}
              </span>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="10" justify="start" align="middle">
          <!-- 1:车辆照片： -->
          <el-col>
            <div class="grid-content">
              <span class="label text--primary">车辆照片:</span>
              <template v-if="detailMsg.transferimageurls && detailMsg.transferimageurls.length > 0">
                <el-image :preview-src-list="detailMsg.transferimageurls"
                  v-for="( item, index ) in  detailMsg.transferimageurls " :key="index"
                  style="width: 100px; height: 100px; margin-top: 7px" :src="item" fit="fill"></el-image>
              </template>
              <span v-else>--</span>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
    <!-- 备注 -->
    <el-card class="card" v-if="orderType != 2" shadow="always">
      <!-- header -->
      <div slot="header" class="card-header">
        <div class="card-header__title">
          <span class="label">备注</span>
        </div>
      </div>
      <!-- body -->
      <div class="card-body">
        <template v-if="detailMsg.remarkJson">
          <div v-for="( item, index ) in  detailMsg.remarkJson " :key="'remarkJSON' + index" style="margin-bottom: 15px">
            <p>{{ toDate(item.createtime) }}</p>
            <p v-for="( item2, index2 ) in  item.remark " :key="'remark' + index2">
              {{ item2 }}
            </p>
          </div>
        </template>
        <div v-else class="text--info">暂无信息</div>
      </div>
    </el-card>
    <el-dialog title="商品详情" :visible.sync="dialogVisible" width="80%" :before-close="handleClose">
      <el-descriptions :title="checkedDetails.firstClassifyName +
        '-' +
        checkedDetails.classifyName +
        '-' +
        checkedDetails.name
        " :column="5" :colon="false">
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
        <el-descriptions-item label="筐子重量:" v-if="checkedDetails.isremovepeel == 0">{{ checkedDetails.basketweight + "斤"
        }}</el-descriptions-item>
        <el-descriptions-item label="商品净重:" v-if="checkedDetails.isremovepeel == 0">{{
          checkedDetails.productreallyweight
        }}</el-descriptions-item>
        <el-descriptions-item :label="orderType == 2 ? '生产单价:' : '商品单价:'">{{ checkedDetails.productprice + "元/斤"
        }}</el-descriptions-item>
        <el-descriptions-item label="商品金额:">
          <font style="color: red">{{ currencyFormat(checkedDetails.detailtotalprice) }}元</font>
        </el-descriptions-item>
      </el-descriptions>
      <el-divider></el-divider>
      <!-- 卖家筐子 -->
      <el-table :data="sell_basket" v-if="sell_basket.length > 0" style="margin-bottom: 10px; border: 1px solid #e9e9e9">
        <el-table-column :render-header="renderHeader2" v-if="checkedDetails.isremovepeel == 0" width="200">
          <template slot-scope="scope">
            [{{ scope.row.basketType }}]{{ scope.row.userbasketname }}
          </template>
        </el-table-column>
        <el-table-column :render-header="renderHeader1" v-if="checkedDetails.isremovepeel == 1" width="200">
          <template slot-scope="scope">
            [{{ scope.row.basketType }}]{{ scope.row.userbasketname }}
          </template>
        </el-table-column>
        <el-table-column :render-header="renderHeader3" v-if="checkedDetails.isremovepeel == 2" width="200">
          <template slot-scope="scope">
            [{{ scope.row.basketType }}]{{ scope.row.userbasketname }}
          </template>
        </el-table-column>
        <el-table-column label="颜色" prop="userbasketcolor"></el-table-column>
        <el-table-column label="载货量" prop="userbasketcolor"
          v-if="self_basket.length > 0 && sell_basket.length > 0 ? false : true">
          <template slot-scope="scope">
            <font v-if="checkedDetails.subunit == '斤'">{{
              scope.row.basketcargo + "斤/筐"
            }}</font>
            <font v-if="checkedDetails.subunit != '斤'">{{
              scope.row.basketcargo + checkedDetails.subunit + "/筐"
            }}</font>
          </template>
        </el-table-column>
        <el-table-column label="筐子重量" prop="basketweight"
          v-if="checkedDetails.isremovepeel == 1 && sell_basket.length == 0">
          <template slot-scope="scope">
            {{ scope.row.basketweight + "斤/个" }}
          </template>
        </el-table-column>
        <el-table-column label="购入筐子" prop="userbasketcount">
          <template slot-scope="scope">
            {{ scope.row.userbasketcount + "个" }}
          </template>
        </el-table-column>
        <el-table-column label="筐子总重" prop="all_basket_weigh" v-if="checkedDetails.isremovepeel == 0">
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
      <div style="margin-top: 5px; border: 1px solid #e9e9e9; padding: 15px" v-if="sell_basket.length > 0">
        <el-row>
          <el-col :span="4"> 小计: </el-col>
          <el-col :span="20" style="text-align: right">
            <font style="margin-right: 30px">购入筐子：{{ checkedDetails.buybasketcount + "个" }}</font>
            <font style="color: #010621">筐子金额：</font>
            <font style="color: red">{{ checkedDetails.buybasketprice }}元</font>
            <font style="color: #010621" v-if="checkedDetails.isremovepeel == 1">筐子总重：{{
              checkedDetails.sell_basket_weigh
            }}个</font>
            <font style="color: red; margin-right: 30px" v-if="checkedDetails.isremovepeel == 1">{{
              checkedDetails.basketweight }}斤</font>
          </el-col>
        </el-row>
      </div>
      <div style="border-bottom: 1px dashed #e9e9e9; margin: 15px 0px; width: 100"></div>
      <!-- 自家筐子 -->
      <el-table :data="self_basket" v-if="self_basket.length > 0" style="border: 1px solid #e9e9e9">
        <el-table-column :render-header="buy_basket1" width="200">
          <template slot-scope="scope">
            [{{ scope.row.basketType }}]{{ scope.row.userbasketname }}
          </template>
        </el-table-column>
        <el-table-column label="颜色" prop="userbasketcolor"></el-table-column>
        <el-table-column label="载货量" prop="userbasketcolor"
          v-if="self_basket.length > 0 && sell_basket.length > 0 ? false : true">
          <template slot-scope="scope">
            <font v-if="checkedDetails.subunit == '斤'">{{
              scope.row.basketcargo + "斤/筐"
            }}</font>
            <font v-if="checkedDetails.subunit != '斤'">{{
              scope.row.basketcargo + checkedDetails.subunit + "/筐"
            }}</font>
          </template>
        </el-table-column>
        <el-table-column label="筐子重量" prop="basketweight" v-if="checkedDetails.isremovepeel == 0">
          <template slot-scope="scope">
            {{ scope.row.basketweight + "斤/个" }}
          </template>
        </el-table-column>
        <el-table-column label="使用数量" prop="userbasketcount">
          <template slot-scope="scope">
            {{ scope.row.userbasketcount + "个" }}
          </template>
        </el-table-column>
        <el-table-column label="筐子总重" prop="all_basket_weigh" v-if="checkedDetails.isremovepeel == 0">
          <template slot-scope="scope">
            {{ scope.row.all_basket_weigh + "斤" }}
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: -1px; border: 1px solid #e9e9e9; padding: 15px" v-if="self_basket.length > 0">
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
        <div style="
            border-bottom: 1px dashed #e9e9e9;
            padding-bottom: 10px;
            text-align: right;
          " class="font_styl_2" v-if="orderType != 2">
          <font style="margin-right: 15px" v-if="checkedDetails.isremovepeel == 1">共筐子过磅:{{
            checkedDetails.buybasketcount + checkedDetails.buybasketcount
          }}个</font>&nbsp;&nbsp;
          <font style="margin-right: 15px">购入筐子:{{ checkedDetails.buybasketcount }}个,</font>
          <font style="margin-right: 15px">使用自家筐子:{{ checkedDetails.buy_basket_count }}个</font>
        </div>
        <div style="text-align: right; margin-top: 15px">
          <p style="font-size: 16px; color: #010621">
            金额总计:<font style="color: red">{{ checkedDetails.detailtotalprice }}元</font>
          </p>
          <p class="font_styl_2" v-if="orderType != 2">
            包含商品金额：{{ checkedDetails.producttotalprice }}元
          </p>
        </div>
      </span>
    </el-dialog>
    <el-dialog title="退回修改" :visible.sync="thdialog" width="30%" :before-close="ThhandleClose">
      <p>确认退回？</p>
      备注信息：
      <el-input type="textarea" placeholder="请输入内容" v-model="remark" maxlength="200" show-word-limit rows="4"
        resize="none">
      </el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ThhandleClose">取 消</el-button>
        <el-button type="primary" @click="ThYes">确 定</el-button>
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
  remind2,
} from "@/request/api/commoditySalesOrderDetail/index";
export default {
  name: "CommondityPurchaseDetail",
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
    // 添加采购单
    addPayment() {
      const { ordertype } = this.detailMsg;
      const { isP } = this.$route.query;
      // console.log(this.detailMsg);
      let fromuser =
        this.detailMsg.fromusername == ""
          ? ""
          : this.detailMsg.fromusername + "," + this.detailMsg.fromuserphone;

      this.$router.push({
        path: "add-purchase",
        query: {
          id: this.detailMsg.id,
          fromuser: fromuser,
          type: this.detailMsg.fromusername == "" ? 1 : 5,
          isF: Number(!this.detailMsg.confirmTimestamp), //是否首次
          isP: Number(!isP) !== 1 ? (ordertype === 1 ? 1 : 0) : 0,
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


// 23.6.7
.card {
  margin-bottom: 16px;

  .card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .card-header__title {
      .label {
        font-size: 18px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(1, 6, 33, 0.9);
        line-height: 24px;
        margin-right: 20px;
      }

      .operator {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(1, 6, 33, 0.55);
        line-height: 22px;
      }
    }

    .card-header__actions {
      display: flex;
      justify-content: flex-start;

      .el-button {
        margin-left: 16px;
      }
    }

  }

  .card-body {

    .text--info {
      color: rgba(1, 6, 33, 0.55);

    }

    .text--primary {

      color: rgba(1, 6, 33, 0.9);

    }

    .text--danger {
      color: #DD4C4D;
    }

    .el-col {
      margin-bottom: 10px;
    }

    .grid-content {
      .label {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        line-height: 22px;
        margin-right: 10px;
      }


    }
  }

  .card-body__goods {
    margin-bottom: 16px;



    .goods-header {
      display: flex;
      justify-content: space-between;
      margin-bottom: 16px;

      .goods-header__name {
        font-size: 16px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(1, 6, 33, 0.9);
        line-height: 24px;
      }
    }

    .goods-main {}

    .goods-footer {
      text-align: right;

      >span:first-of-type {
        margin-right: 10px;
      }
    }
  }
}

// 23.6.8
/deep/ .container-main {
  background: none !important;
  padding: 0 !important;
}

/deep/ .container-header .container-header__title {
  background-color: #fff;
  padding: 4px 10px;
  border-radius: 4px;
  box-shadow: 0 1px 6px 0 rgba(0, 0, 0, 0.1);
}
</style>