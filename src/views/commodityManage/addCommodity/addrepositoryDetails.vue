<template>
  <!-- 添加入库详情 -->
  <PageNoScroll class="addcommodityDetails">
    <el-scrollbar
      ref="scrollDiv"
      :style="{
        height: $store.getters.screenHeight - 220 + 'px',
      }"
    >
      <div>
        <el-descriptions title="订单信息">
          <template slot="extra">
            <div class="ordermsg" style="margin-right: 16px">
              <span class="ordersize"
                >操作人：{{ goodsDetail.addByUserName }}</span
              >
            </div>
          </template>
          <el-descriptions-item label="订单编号">{{
            goodsDetail.orderNo
          }}</el-descriptions-item>
          <el-descriptions-item
            label="订单状态"
            v-if="goodsDetail.orderType == 1"
          >
            <span v-if="goodsDetail.status == 0" style="color: #dd4c4d"
              >未结清</span
            >
            <span v-if="goodsDetail.status == 1">已结清</span>
          </el-descriptions-item>
          <el-descriptions-item label="入库原因"
            >{{ goodsDetail.orderType == 1 ? "采购" : "自家生产" }}
          </el-descriptions-item>
          <el-descriptions-item label="订单金额"
            >{{ moneyFormatTwo(goodsDetail.orderTotalPrice) }}元
          </el-descriptions-item>
          <el-descriptions-item
            v-if="goodsDetail.status == 0 && goodsDetail.orderType == 1"
            label="已付金额"
          >
            {{ moneyFormatTwo(goodsDetail.actualPayPrice) }}元
          </el-descriptions-item>
          <el-descriptions-item
            v-if="goodsDetail.status == 0 && goodsDetail.orderType == 1"
            label="剩余未付"
          >
            {{ moneyFormatTwo(goodsDetail.unPayPrice) }}元
          </el-descriptions-item>
          <el-descriptions-item label="创建时间">{{
            goodsDetail.timestamp | parseTime
          }}</el-descriptions-item>
        </el-descriptions>
        <!-- 按钮 -->
        <!-- 采购未结清 -->
        <div
          class="type-button"
          v-if="goodsDetail.orderType == 1 && goodsDetail.status == 0"
        >
          <div>
            <span class="type-button-left">付款记录</span>
          </div>
          <div>
            <el-button size="small">打印</el-button>
            <el-button size="small" type="primary">添加付款</el-button>
          </div>
        </div>
        <!-- 采购已结清 -->
        <div
          class="type-button"
          v-if="goodsDetail.orderType == 1 && goodsDetail.status == 1"
        >
          <div>
            <span class="type-button-left">付款记录</span>
          </div>
          <div>
            <el-button size="small">打印</el-button>
          </div>
        </div>
        <!-- 自家生产 -->
        <div
          style="width: 99%; text-align: right"
          v-if="goodsDetail.orderType == 2"
        >
          <el-button size="small">打印</el-button>
        </div>
      </div>
      <!-- 客户信息 -->
      <div
        v-if="goodsDetail.orderType == 1"
        style="
          border-top: 1px solid #e9e9e9;
          padding: 10px 0px 0px;
          margin-top: 20px;
        "
      >
        <el-descriptions title="客户信息" style="margin-top: 12px">
          <el-descriptions-item label="客户姓名">
            <p :class="['userInfo-name', formatClass()]">
              {{ goodsDetail.customerName }}
            </p>
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">{{
            goodsDetail.customerPhone
          }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <!-- 商品信息 -->
      <div style="margin-top: 16px">
        <div
          style="
            color: rgba(1, 6, 33, 0.9);
            font-weight: 600;
            margin-bottom: 12px;
          "
        >
          商品信息
        </div>
        <div>
          <div
            style="
              padding: 10px 10px 15px;
              border-bottom: 1px solid rgba(233, 233, 233, 1);
            "
          >
            <div style="color: rgba(1, 6, 33, 0.9); font-size: 16px">
              {{ goodsDetailList.classifyName }}
            </div>
            <div style="padding: 16px 0px 12px">
              <el-row>
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >品种/品牌：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                    {{ goodsDetailList.variety }}</span
                  >
                </el-col>
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >产地：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                    {{ goodsDetailList.regionName }}</span
                  >
                </el-col>
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >级别/规格：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                    {{ goodsDetailList.spec }}</span
                  >
                </el-col>
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >计算单位：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                    {{ goodsDetailList.subUnit }}</span
                  >
                </el-col>
              </el-row>
            </div>
            <div style="padding: 0px 0px">
              <el-row>
                <el-col :span="5" v-if="goodsDetailList.isRemovePeel == 1">
                  <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >商品毛重：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                    >{{ goodsDetailList.productCount
                    }}{{ goodsDetailList.subUnit }}|{{
                      goodsDetailList.productWeight
                    }}<span style="color: rgba(223, 151, 26, 1)">筐</span></span
                  ></el-col
                >
                <el-col :span="5" v-if="goodsDetailList.isRemovePeel == 1"
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                    >筐子重量：</span
                  ><span style="color: rgba(221, 76, 77, 1); font-size: 14px">
                    {{
                      moneyFormatTwo(goodsDetailList.basketTotalPrice)
                    }}元</span
                  >
                </el-col>
                <el-col :span="5">
                  <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >商品净重：</span
                  >
                  <span style="color: rgba(221, 76, 77, 1); font-size: 14px">
                    <img
                      style="width: 16px; height: 16px"
                      src="../../../assets/image/imgs/question-circle@2x.png"
                      alt=""
                    />
                    {{
                      moneyFormatTwo(goodsDetailList.basketTotalPrice)
                    }}元</span
                  >
                </el-col>
                <el-col :span="5" v-if="goodsDetailList.isRemovePeel == 0">
                  <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >商品数量：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                    >{{ goodsDetailList.productCount
                    }}{{ goodsDetailList.subUnit
                    }}{{ goodsDetailList.subUnit2 != "" ? "(" : ""
                    }}{{
                      goodsDetailList.subUnit3Weight == 0
                        ? ""
                        : goodsDetailList.subUnit3Weight +
                          goodsDetailList.subUnit3
                    }}{{ goodsDetailList.subUnit3 != "" ? "*" : ""
                    }}{{
                      goodsDetailList.subUnit2Weight == 0
                        ? ""
                        : goodsDetailList.subUnit2Weight +
                          goodsDetailList.subUnit2
                    }}{{
                      goodsDetailList.subUnit2 != ""
                        ? "/" + goodsDetailList.subUnit
                        : ""
                    }}{{ goodsDetailList.subUnit2 != "" ? ")" : "" }}
                    {{
                      goodsDetailList.pieceUnit == ""
                        ? ""
                        : "(" +
                          goodsDetailList.productPieceCount +
                          goodsDetailList.pieceUnit +
                          ")"
                    }}{{
                      goodsDetailList.productWeight != 0
                        ? "|" + goodsDetailList.productWeight
                        : ""
                    }}
                    <font
                      v-if="goodsDetailList.productWeight != 0"
                      style="color: rgba(223, 151, 26, 1)"
                    >
                      筐
                    </font>
                  </span></el-col
                >
                <el-col :span="5"
                  ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >商品单价：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                    {{
                      moneyFormatTwo(goodsDetailList.detailTotalPrice)
                    }}元</span
                  >
                </el-col>
                <el-col :span="4"
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                    >商品金额：</span
                  ><span style="color: rgba(221, 76, 77, 1); font-size: 14px">
                    {{
                      moneyFormatTwo(goodsDetailList.productTotalPrice)
                    }}元</span
                  >
                </el-col>
              </el-row>
            </div>
          </div>
          <div style="border-bottom: 1px solid #e9e9e9; padding: 16px">
            <div style="color: rgba(1, 6, 33, 0.55); font-size: 16px">
              周转筐信息
              <template
                v-if="
                  goodsDetailList.subUnit == '斤' ||
                  goodsDetailList.subUnit == '公斤' ||
                  goodsDetailList.subUnit == 'g'
                "
              >
                <el-tag
                  v-if="goodsDetailList.isRemovePeel == 1"
                  size="mini"
                  style="margin: 0px 10px; border-radius: 10px"
                  >去皮</el-tag
                >
                <el-tag
                  v-if="goodsDetailList.isRemovePeel == 0"
                  size="mini"
                  style="margin: 0px 10px; border-radius: 10px; color: #1a7fd9"
                  >不去皮</el-tag
                >
              </template>
            </div>
            <div
              style="border-bottom: 1px solid #e9e9e9"
              v-for="(basketitem, index) in basketInfo"
              :key="index"
            >
              <div style="margin: 16px 0px">
                <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                  >【{{ basketitem.basketType }}】{{
                    basketitem.basketName
                  }}</span
                >
                <el-tag
                  v-if="basketitem.type == 1"
                  type="warning"
                  size="mini"
                  style="margin: 0px 10px"
                >
                  自家筐子
                </el-tag>
                <el-tag
                  v-if="basketitem.type == 2"
                  size="mini"
                  style="margin: 0px 10px"
                  >卖家筐子</el-tag
                >
              </div>
              <el-row
                style="margin-bottom: 20px"
                v-for="(basketitem1, index1) in basketitem.modelList"
                :key="index1"
              >
                <el-col :span="1">
                  <span style="color: var(--color-primary); font-size: 14px"
                    >[{{ basketitem1.basketColor }}]</span
                  >
                </el-col>
                <el-col
                  :span="3"
                  v-if="
                    (goodsDetailList.isRemovePeel == 1 &&
                      basketitem.type == 1) ||
                    (goodsDetailList.isRemovePeel == 1 && basketitem.type == 2)
                  "
                >
                  <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >重量：<span
                      style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                      >{{ moneyFormatTwo(basketitem1.basketWeight) }}斤/个</span
                    ></span
                  >
                </el-col>
                <el-col :span="4">
                  <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >载货量：<span
                      style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                    >
                      {{ moneyFormatTwo(basketitem1.basketCargo) }}斤/<font
                        style="color: rgba(223, 151, 26, 1)"
                        >筐</font
                      ></span
                    ></span
                  >
                </el-col>
                <el-col
                  :span="4"
                  v-if="
                    (goodsDetailList.isRemovePeel == 0 &&
                      basketitem.type == 2) ||
                    (goodsDetailList.isRemovePeel == 1 && basketitem.type == 2)
                  "
                >
                  <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >价格：<span
                      style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                      >{{ moneyFormatTwo(basketitem1.basketPrice) }}元/个</span
                    ></span
                  >
                </el-col>
                <el-col :span="4">
                  <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >使用：<span
                      style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                      >{{ moneyFormatTwo(basketitem1.basketCount) }}个</span
                    ></span
                  >
                </el-col>
                <el-col
                  :span="4"
                  v-if="
                    (goodsDetailList.isRemovePeel == 1 &&
                      basketitem.type == 1) ||
                    (goodsDetailList.isRemovePeel == 1 && basketitem.type == 2)
                  "
                >
                  <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >重量小计：<span
                      style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                      >{{ moneyFormatTwo(basketitem1.sumBasketWeight) }}个</span
                    ></span
                  >
                </el-col>
                <el-col
                  :span="4"
                  v-if="
                    (goodsDetailList.isRemovePeel == 0 &&
                      basketitem.type == 2) ||
                    (goodsDetailList.isRemovePeel == 1 && basketitem.type == 2)
                  "
                >
                  <span style="color: rgba(1, 6, 33, 0.9)"
                    >金额小计：<span style="color: #dd4c4d"
                      >{{ moneyFormatTwo(basketitem1.sumBasketPrice) }}元</span
                    ></span
                  >
                </el-col>
              </el-row>
            </div>
            <div style="margin: 16px 0px 10px">
              <span
                v-if="
                  goodsDetailList.buyBasketCount > 0 &&
                  goodsDetailList.selfBasketCount > 0
                "
                style="
                  color: rgba(1, 6, 33, 0.9);
                  font-size: 14px;
                  margin-top: 16px;
                  margin-bottom: 20px;
                "
                >共购入筐子{{ goodsDetailList.buyBasketCount }}个,使用自家筐子{{
                  goodsDetailList.selfBasketCount
                }}个</span
              >
              <span
                v-if="
                  goodsDetailList.buyBasketCount > 0 &&
                  goodsDetailList.selfBasketCount == 0
                "
                style="
                  color: rgba(1, 6, 33, 0.9);
                  font-size: 14px;
                  margin-top: 16px;
                  margin-bottom: 20px;
                "
                >共购入筐子{{ goodsDetailList.buyBasketCount }}个</span
              >
              <span
                v-if="
                  goodsDetailList.buyBasketCount == 0 &&
                  goodsDetailList.selfBasketCount > 0
                "
                style="
                  color: rgba(1, 6, 33, 0.9);
                  font-size: 14px;
                  margin-top: 16px;
                  margin-bottom: 20px;
                "
                >共使用自家筐子{{ goodsDetailList.selfBasketCount }}个</span
              >
            </div>
          </div>
        </div>
        <div style="padding: 15px 0px">
          <div
            style="
              color: rgba(1, 6, 33, 0.9);
              font-weight: 700;
              padding-right: 15px;
            "
          >
            合计
          </div>
          <div style="padding: 10px 10px" v-if="goodsDetail.orderType == 1">
            <el-row style="margin-bottom: 16px">
              <el-col :span="4"
                ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >商品毛重：</span
                >
                <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                  {{ goodsDetailList.productCount
                  }}{{ goodsDetailList.subUnit }}
                  <span v-if="goodsDetailList.pieceUnit != ''"
                    >({{ goodsDetailList.productPieceCount
                    }}{{ goodsDetailList.pieceUnit }})</span
                  >
                </span>
              </el-col>
            </el-row>
            <el-row style="margin-bottom: 16px">
              <el-col :span="4"
                ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >筐子重量：</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                  {{ goodsDetailList.basketWeight }}斤</span
                >
              </el-col>
            </el-row>
            <el-row
              style="
                border-bottom: 1px dashed #e9e9e9;
                padding-bottom: 16px;
                margin-bottom: 16px;
              "
            >
              <el-col :span="4"
                ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >商品净重：</span
                >
                <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                  {{ goodsDetailList.productWeight
                  }}{{ goodsDetailList.subUnit }}
                  <span v-if="goodsDetailList.pieceUnit != ''"
                    >({{ goodsDetailList.productPieceCount
                    }}{{ goodsDetailList.pieceUnit }})</span
                  >
                </span>
              </el-col>
              <el-col :span="4"
                ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >商品单价：</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                  {{ goodsDetailList.productPrice }}元/斤</span
                >
              </el-col>
              <el-col :span="4"
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                  >商品金额：</span
                ><span style="color: #dd4c4d">
                  {{ goodsDetailList.productTotalPrice }}元</span
                >
              </el-col>
            </el-row>
            <el-row style="margin-bottom: 16px">
              <el-col :span="4"
                ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >卖家筐子种类：</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                  {{ goodsDetail.buyBasketKinds }}种</span
                >
              </el-col>
              <el-col :span="4"
                ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >购入筐子：</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                  {{ goodsDetailList.buyBasketCount }}个</span
                >
              </el-col>
              <el-col :span="4"
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                  >筐子金额：</span
                ><span style="color: #dd4c4d">
                  {{ goodsDetailList.basketTotalPrice }}元</span
                >
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4"
                ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >自家筐子种类：</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                  {{ goodsDetail.selfBasketKinds }}种</span
                >
              </el-col>
              <el-col :span="4"
                ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >使用自家筐子：</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                  {{ goodsDetailList.selfBasketCount }}个</span
                >
              </el-col>
            </el-row>
          </div>
          <div style="padding: 10px 10px" v-if="goodsDetail.orderType == 2">
            <el-row
              style="
                border-bottom: 1px dashed #e9e9e9;
                padding-bottom: 16px;
                margin-bottom: 16px;
              "
            >
              <el-col :span="4"
                ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >商品数量：</span
                >
                <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                  {{ goodsDetailList.productCount }}斤
                </span>
              </el-col>
              <el-col :span="4"
                ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >商品单价：</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                  {{ goodsDetailList.productPrice }}元/斤</span
                >
              </el-col>
              <el-col :span="4"
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                  >商品金额：</span
                ><span style="color: #dd4c4d">
                  {{ goodsDetailList.productTotalPrice }}元</span
                >
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="4"
                ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >使用自家筐子：</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                  {{ goodsDetailList.selfBasketCount }}个</span
                >
              </el-col>
            </el-row>
          </div>
        </div>
        <div v-if="goodsDetail.orderType == 1" style="padding: 0px 0px">
          <div
            style="
              color: rgba(1, 6, 33, 0.9);

              font-weight: 700;
              padding-right: 15px;
            "
          >
            运输信息
          </div>
          <div>
            <div style="padding: 10px 0px" class="flex_dom flex_item_mid">
              <div style="padding-left: 16px; color: rgba(1, 6, 33, 0.9)">
                车牌号：
              </div>
              <div>
                {{ goodsDetail.transArea }}{{ goodsDetail.transferNumber }}
              </div>
            </div>
            <div class="flex_dom">
              <div style="color: rgba(1, 6, 33, 0.9)">车辆照片：</div>
              <div>
                <img src="" alt="" class="avatar" />{{
                  goodsDetail.transferImageUrls[0]
                }}
              </div>
            </div>
          </div>
        </div>
        <div style="padding: 0px 0px">
          <div
            style="
              color: rgba(1, 6, 33, 0.9);

              font-weight: 700;
              padding-right: 15px;
            "
          >
            备注
          </div>
          <div
            style="padding: 10px 0px"
            v-for="(remarkitem, index1) in goodsDetail.remark"
            :key="index1"
          >
            {{ remarkitem.createtime }}<br />{{ remarkitem.type }}<br />{{
              remarkitem.remark[0]
            }}
          </div>
        </div>
      </div>
    </el-scrollbar>
  </PageNoScroll>
</template>

<script>
import { productOrderDetail } from "@/request/api/commodityDetail/index";
export default {
  name: "addrepositoryDetails",
  data() {
    return {
      orderId: this.$route.query.id,
      goodsDetail: {},
      goodsDetailList: {},
      imageUrl: "",
      basketInfo: {},
    };
  },
  methods: {
    productOrderDetail() {
      productOrderDetail({
        orderId: this.$route.query.id,
      }).then((res) => {
        this.goodsDetail = res.data[0];
        this.goodsDetailList = res.data[0].modelList[0];
        this.basketInfo = res.data[0].modelList[0].basketInfo;
      });
    },
    formatClass() {
      return "icon4";
    },
    handleAvatarSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw);
    },
    //处理保留小数点后两位
    moneyFormatTwo(moneyStr) {
      let money = Number(moneyStr)
        .toFixed(2)
        .toString()
        .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      return money;
    },
  },
  created() {
    this.productOrderDetail();
  },
};
</script>

<style lang="scss" scoped>
.addcommodityDetails {
  .userInfo-name {
    display: flex;

    &::after {
      content: "";
      display: block;
      width: 0.875rem;
      height: 0.875rem;
      margin-left: 0.3125rem;
    }

    &.icon4::after {
      background: url("../../../assets/image/imgs/fei-icon@2x.png") no-repeat
        center / 100%;
    }
  }

  .ordermsg {
    display: inline-block;

    .ordersize {
      font-size: 13px;
      color: rgba(1, 6, 33, 0.75);
    }
  }

  .img-icon {
    height: 14px;
  }

  .note-size {
    font-size: 14px;
    color: rgba(1, 6, 33, 0.75);
    margin-top: 12px;
  }

  .type-button {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 16px;

    .type-button-left {
      color: var(--color-primary);
      font-size: 14px;
    }

    .type-button-left1 {
      margin-right: 16px;
    }

    .type-button-right {
      color: var(--color-primary);
      border: 1px solid var(--color-primary);
      margin-right: 8px;
    }
  }

  .type1-button {
    display: flex;
    flex-direction: row;
    justify-content: right;

    .type1-button-right {
      color: var(--color-primary);
      border: 1px solid var(--color-primary);
      margin-right: 8px;
    }
  }

  .confirmwindow {
    font-weight: 600;
    color: rgba(1, 6, 33, 0.9);
    margin-bottom: 10px;
  }

  .confirmwindow1 {
    font-size: 14px;
    font-weight: 400;
    color: rgba(1, 6, 33, 0.75);
    margin-bottom: 8px;
  }

  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }

  .avatar {
    width: 106px;
    height: 106px;
    display: block;
  }
}
</style>

<style lang="scss">
.addcommodityDetails {
  .el-scrollbar {
    .el-scrollbar__wrap {
      margin-bottom: 0px !important;
      overflow-x: hidden;

      .el-scrollbar__view {
        position: relative;
        padding: 0px !important;
      }
    }
  }
}
</style>