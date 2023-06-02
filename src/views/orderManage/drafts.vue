<template>
  <Page>
    <el-select
      v-model="timeQ"
      size="mini"
      class="change_select_styl"
      @change="changeDate"
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
    </el-date-picker>
    <div class="content">
      <el-row>
        <el-col :span="5" style="height: 100%">
          <div
            style="
              border-top: 1px solid rgba(1, 6, 33, 0.06);
              border-bottom: 1px solid rgba(1, 6, 33, 0.06);
              padding: 10px;
            "
            class="font_styl_2"
          >
            {{ draftsMsg.user_name }}
            <el-tag type="info" v-if="draftsMsg.type_id == 0">非</el-tag>
            <el-tag v-if="draftsMsg.type_id == 10 || draftsMsg.type_id == 11"
              >供</el-tag
            >
            <el-tag
              type="warning"
              v-if="draftsMsg.type_id == 3 || draftsMsg.type_id == 4"
              >采</el-tag
            >
            <el-tag
              type="danger"
              v-if="draftsMsg.type_id == 6 || draftsMsg.type_id == 7"
              >经</el-tag
            >
            {{ "-" + draftsMsg.user_phone }}
          </div>
          <el-checkbox-group v-model="checkList" @change="selectList">
            <div
              v-for="(item, index) in listData"
              :key="'list' + index"
              style="
                border-bottom: 1px solid rgba(1, 6, 33, 0.06);
                padding: 10px 30px;
              "
              class="font_styl_2"
              :class="{ change_bgc: item.orderdraftsellid == clickdraftid }"
              @click="clickdrafts(item.orderdraftsellid)"
            >
              <el-checkbox :label="item.orderdraftsellid">{{
                toDate(item.timestamp)
              }}</el-checkbox>
            </div>
          </el-checkbox-group>
        </el-col>
        <el-col
          :span="19"
          style="border-left: 1px solid rgba(1, 6, 33, 0.06)"
          v-if="clickdraftid != ''"
        >
          <div style="padding: 10px" class="font_styl_2">
            <el-row>
              <el-col :span="20">销售商品：{{ typecount }}种</el-col>
              <el-col :span="4" style="text-align: right">
                <el-button type="text" @click="del">删除</el-button>
                <el-button type="text">查看详情</el-button>
              </el-col>
            </el-row>
            <el-table :data="tableData" border>
              <el-table-column label="商品分类" width="160">
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
              <el-table-column
                label="品种/品牌"
                prop="variety"
                width="150"
              ></el-table-column>
              <el-table-column
                label="产地"
                prop="region"
                width="120"
              ></el-table-column>
              <el-table-column label="级别/规格" prop="spec"></el-table-column>
              <el-table-column label="销售数量" prop="productcount">
                <template slot-scope="scope">
                  {{ scope.row.productcount + scope.row.subunit }}
                </template>
              </el-table-column>
              <el-table-column label="商品金额" prop="producttotalprice">
                <template slot-scope="scope">
                  {{ scope.row.producttotalprice }}元
                </template>
              </el-table-column>
              <el-table-column label="售出筐子" prop="buybasketcount">
                <template slot-scope="scope">
                  {{ scope.row.buybasketcount }}个
                </template>
              </el-table-column>
              <el-table-column label="筐子金额" prop="buybasketprice">
                <template slot-scope="scope">
                  {{ scope.row.buybasketprice }}元
                </template>
              </el-table-column>
              <el-table-column label="金额小计" prop="detailtotalprice">
                <template slot-scope="scope">
                  {{ scope.row.detailtotalprice }}元
                </template>
              </el-table-column>
            </el-table>
            <div style="padding: 10px; border: 1px solid rgba(1, 6, 33, 0.06)">
              <el-row>
                <el-col :span="4">合计:</el-col>
                <el-col :span="20" style="text-align: right">
                  商品种类：{{ tableData.length }}种
                </el-col>
              </el-row>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="page_footer font_styl_2">
      <font style="margin-right: 15px">已选</font>
      <font style="margin-right: 15px"
        >草稿单：{{ checkList.length }}单,商品<font style="color: red">{{
          qiuhe + "/10"
        }}</font
        >种</font
      >
      <el-button size="mini" @click="batchDel">删除</el-button>
      <el-button size="mini" type="primary" @click="submit">使用草稿</el-button>
    </div>
  </Page>
</template>
<script>
import moment from "moment";
import {
  getDrafts,
  getDraftsDetails,
  delone,
} from "@/request/api/commoditySalesOrderDetail/index";
export default {
  data() {
    return {
      qiuhe: 0,
      typecount: 0,
      tableData: [],
      checkList: [],
      clickdraftid: "",
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
            onClick(picker) {
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
      draftsMsg: [],
      listData: [],
      timeQ: null,
      timequantum: {},
      queryData: {
        buyUserId: this.$route.query.id,
        // start_time:null,
        // end_time:null
      },
    };
  },
  methods: {
    batchDel() {
      var arr = [];
      for (let i = 0; i < this.listData.length; i++) {
        for (let j = 0; j < this.checkList.length; j++) {
          if (this.listData[i].orderdraftsellid == this.checkList[j]) {
            arr.push(this.listData[i].uid);
          }
        }
      }
      delone({ uid: arr }).then((resp) => {
        this.$success("删除成功！");
        this.getList();
        this.clickdraftid = "";
      });
    },
    submit() {
      //getDraftsDetails
      if (this.qiuhe > 10) {
        this.$error("所选商品种类不能大于10！");
        return false;
      }
      let arr = [];
      for (let i = 0; i < this.checkList.length; i++) {
        getDraftsDetails({ orderDraftId: this.checkList[i] }).then((resp) => {
          for (let j = 0; j < resp.data[0].details.length; j++) {
            let el = resp.data[0].details[j];

            let tableDataBasket = [];
            let tableDataBasket1 = [];
            let tableDataBasket2 = [];
            let tableDataBasket3 = [];
            let tableDataBasket4 = [];
            for (let j = 0; j < el.basket_details.length; j++) {
              const el2 = el.basket_details[j];
              if (el2.type == 1) {
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
              if (el2.type == 2) {
                tableDataBasket3.push({
                  basketId: el2.userbasketid,
                  basektName: el2.userbasketname,
                  basketType: el2.basketType,
                  nums: el2.basketEmptyNumber,
                  userbasketid: el2.userbasketid,
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
              if (el2.type == 4) {
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
              if (el2.type == 5) {
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
            }

            let multipleSelectionList = [];
            for (let p = 0; p < el.productbatchidlistInfo.length; p++) {
              const eleP = el.productbatchidlistInfo[p];
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
                isRemovePeel: el.isRemovePeel,
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
      // console.log(arr);

      this.$store.dispatch("common/addNewrequestData", {
        isStatus: "add",
        tableDataList: arr,
      });
      this.$closePage("addSalesTicket", {});
    },
    del() {
      var uid = "";
      for (let i = 0; i < this.listData.length; i++) {
        if (this.clickdraftid == this.listData[i].orderdraftsellid) {
          uid = this.listData[i].uid;
        }
      }
      delone({ uid: uid }).then((resp) => {
        this.$success("删除成功！");
        this.getList();
        this.clickdraftid = "";
      });
    },
    getDetail(id) {
      getDraftsDetails({ orderDraftId: id }).then((resp) => {
        this.typecount = resp.data[0].producttypecount;
        this.tableData = resp.data[0].details;
      });
    },
    selectList(res) {
      var s = 0;
      var a = [];
      for (let i = 0; i < this.listData.length; i++) {
        for (let j = 0; j < res.length; j++) {
          // console.log(this.listData[i].orderdraftsellid,res[j])
          if (this.listData[i].orderdraftsellid == res[j]) {
            a.push(this.listData[i].producttypecount);
          }
        }
      }
      for (let i = 0; i < a.length; i++) {
        s += a[i];
      }
      console.log(s);
      this.qiuhe = s;
    },
    clickdrafts(val) {
      this.clickdraftid = val;
      this.getDetail(val);
    },
    toDate(val) {
      //时间戳格式化
      return moment(val * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
    getList() {
      if (this.timequantum.length > 1) {
        var time1 = Date.parse(this.timequantum[0]);
        var time2 = Date.parse(this.timequantum[1]);
        this.queryData.start_time = time1 / 1000;
        this.queryData.end_time = time2 / 1000;
      }
      getDrafts(this.queryData).then((resp) => {
        this.draftsMsg = resp;
        this.listData = resp.data[0].modelList;
      });
    },
    changeDate(val) {
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
      // console.log(this.timequantum)

      this.getList();
    },
  },
  created() {
    this.getList();
  },
};
</script>
<style scoped lang="scss">
.page_footer {
  width: 100%;
  text-align: right;
  background-color: #fff;
  border-top: 1px solid #e4e7ed;
  // height: 20px;
  position: fixed;
  bottom: 13px;
  padding: 15px;
  right: 20px;
}
.change_bgc {
  background-color: #cef2ed;
}
.el-tag {
  padding: 0px 2px !important;
}
.el-tag--medium {
  height: 17px !important;
  line-height: 17px !important;
}
.content {
  border-top: 1px solid rgba(1, 6, 33, 0.06);
  margin-top: 20px;
  height: calc(70vh);
}
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
.font_styl_2 {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
}
</style>
