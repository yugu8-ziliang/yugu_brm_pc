<template>
  <!-- 查看历史销售单 -->
  <el-container style="background: #ffffff; height: 100%; padding: 20px">
    <el-header style="height: 50px;padding: 0px"
      ><el-select
        v-model="timeQ"
        size="mini"
        class="change_select_styl"
        @change="changetimeQ"
      >
        <template slot="prefix">
          <div class="label-title">选择日期</div>
        </template>
        <el-option label="24小时内" :value="0"></el-option>
        <el-option label="7天内" :value="1"></el-option>
        <el-option label="30天内" :value="2"></el-option>
      </el-select>
      <el-divider direction="vertical" class="divider_layout"></el-divider>
      <el-date-picker
        @change="getList"
        class="change_date_styl"
        size="mini"
        v-model="timequantum"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      >
      </el-date-picker
    ></el-header>
    <el-container style="border-top: 1px solid rgba(1, 6, 33, 0.06)">
      <el-aside width="16%;">
        <div
          style="
            border-bottom: 1px solid rgba(1, 6, 33, 0.06);
            padding: 12px 45px;
          "
          class="font_styl_2"
        >
          <span style="font-size:14px">{{ typeUserMsg.user_name }}</span>
          <el-tag v-if="typeUserMsg.type_id == 11 || typeUserMsg.type_id == 10"
            >供</el-tag
          >
          <el-tag
            type="danger"
            v-if="typeUserMsg.type_id == 6 || typeUserMsg.type_id == 7"
            >经</el-tag
          >
          <el-tag
            type="warning"
            v-if="typeUserMsg.type_id == 3 || typeUserMsg.type_id == 4"
            >采
          </el-tag>
          <el-tag type="info" v-if="typeUserMsg.type_id == 0">非 </el-tag>
          <span style="font-size:14px">{{ "-" + typeUserMsg.user_phone }}</span>
        </div>

        <el-checkbox-group v-model="checkList" @change="selectList">
          <div
            v-for="(item, index) in typeUserMsgList"
            :key="'typeUser' + index"
            style="
              border-bottom: 1px solid rgba(1, 6, 33, 0.06);
              padding: 10px 20px;
            "
            class="font_styl_2"
            :class="{ change_bgc: item.uid == handelId }"
            @click="clickdrafts(item.uid)"
          >
            <el-checkbox :label="item.uid"
              >销售单号：{{ item.orderSellId }}<br />{{
                item.timestamp | parseTime
              }}</el-checkbox
            >
          </div>
        </el-checkbox-group>
      </el-aside>
      <el-main style="width=84%; border-left: 1px solid rgba(1, 6, 33, 0.06);">
        <div class="font_styl_2">
          <el-row>
            <el-col :span="4">销售商品：{{ tableDate.length }}种</el-col>
            <el-col :span="16">操作人:{{ orderDetail.operator }}</el-col>
            <el-col :span="4" style="text-align: right">
              <el-button type="text">查看详情</el-button>
            </el-col>
          </el-row>
          <el-table
            :data="tableDate"
            style="border: 1px solid #e9e9e9"
          >
            <el-table-column label="商品分类">
              <template slot-scope="scope">
                {{
                  scope.row.firstClassifyName +
                  "-" +
                  scope.row.classifyName +
                  "-" +
                  scope.row.name
                }}
              </template>
            </el-table-column>
            <el-table-column label="品种/品牌" prop="variety"></el-table-column>
            <el-table-column label="产地" prop="region"></el-table-column>
            <el-table-column label="级别/规格" prop="spec"></el-table-column>
            <el-table-column label="销售数量" prop="productcount"
              ><template slot-scope="scope">
                {{ scope.row.productcount + scope.row.subunit }}
              </template></el-table-column
            >
            <el-table-column label="商品金额" prop="producttotalprice"
              ><template slot-scope="scope">
                {{ scope.row.producttotalprice }}元
              </template></el-table-column
            >
            <el-table-column label="售出筐子" prop="buybasketcount"
              ><template slot-scope="scope">
                {{ scope.row.buybasketcount }}个
              </template></el-table-column
            >
            <el-table-column label="筐子金额" prop="buybasketprice"
              ><template slot-scope="scope">
                {{ scope.row.buybasketprice }}元
              </template></el-table-column
            >
            <el-table-column label="金额小计" prop="detailtotalprice"
              ><template slot-scope="scope">
                {{ scope.row.detailtotalprice }}元
              </template></el-table-column
            >
          </el-table>
          <div
            style="
              padding: 10px;
              border-left: 1px solid rgba(1, 6, 33, 0.06);
              border-right: 1px solid rgba(1, 6, 33, 0.06);
              border-bottom: 1px solid rgba(1, 6, 33, 0.06);
              background: #f5f5f5;
            "
          >
            <el-row>
              <el-col :span="4">合计</el-col>
              <el-col :span="10" style="text-align: right"
                >商品金额:{{ orderDetail.producttotalprice }}元</el-col
              >
              <el-col :span="5" style="text-align: right"
                >筐子金额:{{ orderDetail.baskettotalprice }}元</el-col
              >
              <el-col :span="5" style="text-align: right"
                >金额合计:{{ orderDetail.ordertotalprice }}元</el-col
              >
            </el-row>
          </div>
        </div>
      </el-main>
    </el-container>
    <div class="page_footer font_styl_2">
      已选&nbsp;&nbsp;销售单:&nbsp;&nbsp;{{ checkList.length }} 单, 商品:(<font
        style="color: red"
      >
        {{ checkedMsgNum + "/10" }}</font
      >)种 &nbsp;&nbsp;&nbsp;
      <el-button
        type="primary"
        size="mini"
        :class="{
          unActivate: checkedMsgNum > 0 && checkedMsgNum <= 10 ? false : true,
        }"
        @click="toTopSend"
        >添加至销售单
      </el-button>
    </div>
  </el-container>
</template>
<script>
import {
  historySellOrder,
  sellInfoDetail,
} from "@/request/api/salesOrder/salesOrder.js";
export default {
  name: "historySellOrder",
  data() {
    return {
      tableDate: [],
      checkList: [],
      timequantum: {},
      timeQ: null,
      queryData: {
        custmorId: this.$route.query.id,
        type: 1,
      },
      uid: "",
      orderId: "",
      handelId: "",
      checkedMsgNum: 0,
      orderDetail: {},
      collapseName: "",
      typeUserMsg: {},
      typeUserMsgList: [],
      pickerOptions: {
        shortcuts: [
          {
            text: "24小时内",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "7天内",
            o销售nClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "30天内",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
    };
  },
  methods: {
    toTopSend() {
      if (this.checkedMsgNum > 10) {
        this.$error("所选商品种类不能大于10！");
        return false;
      }
      let arr = [];
      for (let i = 0; i < this.checkList.length; i++) {
        sellInfoDetail({ orderId: this.checkList[i] }).then((resp) => {
          
          for (let j = 0; j < resp.data[0].details.length; j++) {
            let el = resp.data[0].details[j];

            let tableDataBasket = [];
            let tableDataBasket1 = [];
            let tableDataBasket2 = [];
            let tableDataBasket3 = [];
            let tableDataBasket4 = [];

            for (let i = 0; i < el.product_baskets.self_basket.length; i++) {
              const el2 = el.product_baskets.self_basket[i];
              tableDataBasket4.push({
                  basketid: el2.userbasketid,
                  basketname: el2.userbasketname,
                  basketType: el2.basketType,
                  nums: el2.basketEmptyNumber,
                  userbasketid: el2.userbasketid,
                  basketcolor: el2.userbasketcolor,
                  basketWeight: el2.basketweight,
                  basketCargo: el2.basketcargo,
                  userBasketPrice: el2.userbasketprice,
                  outsellBasketCount: el2.outsellBasketCount,
                  userBasketCount: el2.userbasketcount,
                  basketVacateCount: el2.basketvacatecount,
                });
            }
            for (let i = 0; i < el.product_baskets.buy_basket.length; i++) {
              const el2 = el.product_baskets.buy_basket[i];
              tableDataBasket3.push({
                  basketid: el2.userbasketid,
                  basketname: el2.userbasketname,
                  basketType: el2.basketType,
                  nums: el2.basketEmptyNumber,
                  userbasketid: el2.userbasketid,
                  basketcolor: el2.userbasketcolor,
                  basketWeight: el2.basketweight,
                  basketCargo: el2.basketcargo,
                  userBasketPrice: el2.userbasketprice,
                  outsellBasketCount: el2.outsellBasketCount,
                  userBasketCount: el2.userbasketcount,
                  basketVacateCount: el2.basketvacatecount,
                });
            }
            for (let i = 0; i < el.product_baskets.carry_basket.length; i++) {
              const el2 = el.product_baskets.carry_basket[i];
              tableDataBasket.push({
                  basketid: el2.userbasketid,
                  basketname: el2.userbasketname,
                  basketType: el2.basketType,
                  nums: el2.basketEmptyNumber,
                  userbasketid: el2.userbasketid,
                  basketcolor: el2.userbasketcolor,
                  basketWeight: el2.basketweight,
                  basketCargo: el2.basketcargo,
                  userBasketPrice: el2.userbasketprice,
                  outsellBasketCount: el2.outsellBasketCount,
                  userBasketCount: el2.userbasketcount,
                  basketVacateCount: el2.basketvacatecount,
                });
            }
            for (let i = 0; i < el.product_baskets.weigh_basket.length; i++) {
              const el2 = el.product_baskets.weigh_basket[i];
              tableDataBasket1.push({
                  basketid: el2.userbasketid,
                  basketname: el2.userbasketname,
                  basketType: el2.basketType,
                  nums: el2.basketEmptyNumber,
                  userbasketid: el2.userbasketid,
                  basketcolor: el2.userbasketcolor,
                  basketWeight: el2.basketweight,
                  basketCargo: el2.basketcargo,
                  userBasketPrice: el2.userbasketprice,
                  outsellBasketCount: el2.outsellBasketCount,
                  userBasketCount: el2.userbasketcount,
                  basketVacateCount: el2.basketvacatecount,
                });
            }
            for (let i = 0; i < el.product_baskets.empty_basket.length; i++) {
              const el2 = el.product_baskets.empty_basket[i];
              tableDataBasket2.push({
                  basketid: el2.userbasketid,
                  basketname: el2.userbasketname,
                  basketType: el2.basketType,
                  nums: el2.basketEmptyNumber,
                  userbasketid: el2.userbasketid,
                  basketcolor: el2.userbasketcolor,
                  basketWeight: el2.basketweight,
                  basketCargo: el2.basketcargo,
                  userBasketPrice: el2.userbasketprice,
                  outsellBasketCount: el2.outsellBasketCount,
                  userBasketCount: el2.userbasketcount,
                  basketVacateCount: el2.basketvacatecount,
                });
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


            arr.push({
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
                isRemovePeel: el.isCargoExists,
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
        });
      }



      this.$store.dispatch("common/addNewrequestData", {
        isStatus: "add",
        tableDataList:arr,
      });
      this.$closePage("addSalesTicket", {});
    },
    selectList(res) {
      var s = 0;
      var a = [];
      for (let i = 0; i < this.typeUserMsgList.length; i++) {
        for (let j = 0; j < res.length; j++) {
          if (this.typeUserMsgList[i].uid == res[j]) {
            a.push(this.typeUserMsgList[i].productTypeCount);
          }
        }
      }
      for (let i = 0; i < a.length; i++) {
        s += a[i];
      }
      this.checkedMsgNum = s;
    },
    getList() {
      if (this.timequantum.length > 1) {
        var time1 = Date.parse(this.timequantum[0]);
        var time2 = Date.parse(this.timequantum[1]);
        this.queryData.startTime = time1 / 1000;
        this.queryData.endTime = time2 / 1000;
      }
      historySellOrder(this.queryData).then((resp) => {
        this.typeUserMsg = resp;
        this.typeUserMsgList = resp.data[0].modelList;
      });
      this.handelId = "";
    },
    getDetail(id) {
      sellInfoDetail({ orderId: id }).then((resp) => {
        this.orderDetail = resp.data[0];
        this.tableDate = resp.data[0].details;
      });
    },
    clickdrafts(val) {
      this.handelId = val;
      this.getDetail(val);
    },
    changetimeQ(val) {
      const end = new Date();
      const start = new Date();
      if (val == 0) {
        start.setTime(start.getTime() - 3600 * 1000 * 24);
        this.timequantum = [start, end];
      } else if (val == 1) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        this.timequantum = [start, end];
      } else {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        this.timequantum = [start, end];
      }
      this.checkList = [];
      this.checkedMsgNum = 0;
      this.orderDetail={};
      this.tableDate=[];
      this.getList();
    },
  },
  created() {
    this.getList();
  },
};
</script>
<style scoped lang="scss">
::v-deep .el-date-editor .el-range__icon {
  display: none;
}
::v-deep .el-range-editor--mini.el-input__inner {
  border-radius: 1px !important;
  border-left: 0px !important;
  position: relative;
  left: -20px;
}
.divider_layout {
  position: relative;
  left: -12px;
}
.change_select_styl {
  width: 150px;
}
.change_select_styl /deep/ .el-input__inner {
  border-radius: 1px;
  border-right: 0px;
}
.label-title {
  padding: 0 6px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(1, 6, 33, 0.35);
}
.change_select_styl /deep/ .el-input--prefix .el-input__inner {
  padding-left: 70px;
}
::v-deep .el-select .el-input .el-select__caret {
  display: none;
}
.user_list_styl {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;

  .salesDraft-left-ul {
    margin-right: 7px;

    .salesDraft-left-li {
      padding: 10px;
      margin-right: 40px;
      border-bottom: 1px solid rgba(1, 6, 33, 0.06);
    }
  }
}
.change_bgc {
  background-color: #cef2ed;
}

.el-tag {
  padding: 0px 1px !important;
}

.el-tag--medium {
  height: 17px !important;
  line-height: 17px !important;
}

.page_footer {
  width: 100%;
  text-align: right;
  background-color: #fff;
  border-top: 1px solid #e4e7ed;
  position: fixed;
  bottom: 0px;
  padding: 15px;
  right: 20px;
}

.unActivate {
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid #d0d0d2;
  color: rgba(1, 6, 33, 0.35);
}

.left_layout_style {
  border: 1px red solid;
}

::v-deep
  .user_list_styl
  .salesDraft-left-ul
  .salesDraft-left-li[data-v-4eb82c61] {
  margin-right: 0px;
}
</style>