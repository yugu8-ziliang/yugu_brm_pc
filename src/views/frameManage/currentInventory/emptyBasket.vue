<template>
  <PageNoScroll
    :titleRefresh="false"
    :titleBreak="true"
    @handleBreak="handleBreak"
    class="emptyBasketModel"
  >
    <!-- 腾空筐子 -->
    <div>
      <div class="emTop-steps" v-if="isConfirm != 3">
        <div class="em-steps flex_dom flex_item_between flex_item_mid">
          <div class="flex_dom flex_item_mid">
            <div class="border-steps isstepsActive">1</div>
            <span class="title-steps isstepsActivetitle"
              >选择需要腾空的商品</span
            >
          </div>
          <div style="color: #0ba198">
            --------------------------------------------
          </div>
          <div class="flex_dom flex_item_mid">
            <div
              :class="['border-steps', isConfirm == 2 ? 'isstepsActive' : '']"
            >
              2
            </div>
            <span
              :class="[
                'title-steps',
                isConfirm == 2 ? 'isstepsActivetitle' : '',
              ]"
              >填写腾空数量</span
            >
          </div>
        </div>
      </div>

      <div
        class="header-top flex_dom flex_item_mid"
        style="border-bottom: 1px solid #e9e9e9"
      >
        <div style="width: 128px">
          <img
            :src="basketData.basketImage || url"
            style="width: 128px; height: 128px"
          />
        </div>
        <div
          style="width: calc(100% - 128px); line-height: 45px"
          class="flex_dom flex_item_mid flex_item_around"
        >
          <div>
            <div
              style="
                font-size: 24px;
                color: rgba(1, 6, 33, 0.9);
                font-weight: 700;
              "
            >
              {{ basketData.basketName }}
            </div>
            <div
              style="font-size: 16px; color: rgba(1, 6, 33, 0.85)"
              v-for="(item, index) in basketData.modelList"
              :key="index"
            >
              {{ item.color }}
            </div>
          </div>

          <div>
            <div style="font-size: 20px; color: rgba(1, 6, 33, 0.9)">
              库存数量：{{ countSum }}个
            </div>
            <div
              style="font-size: 16px; color: rgba(1, 6, 33, 0.65)"
              v-for="(item, index) in basketData.modelList"
              :key="index"
            >
              库存数量：{{ item.count }}个
            </div>
          </div>
          <div>
            <div style="font-size: 20px; color: rgba(1, 6, 33, 0.9)">
              空置数量：{{ vacantCountSum }}个
            </div>
            <div
              style="font-size: 16px; color: rgba(1, 6, 33, 0.65)"
              v-for="(item, index) in basketData.modelList"
              :key="index"
            >
              空置数量：{{ item.vacantCount }}个
            </div>
          </div>
          <div>
            <div style="font-size: 20px; color: rgba(1, 6, 33, 0.9)">
              载货数量：{{ cargoCountSum }}个
            </div>
            <div
              style="font-size: 16px; color: rgba(1, 6, 33, 0.65)"
              v-for="(item, index) in basketData.modelList"
              :key="index"
            >
              载货数量：{{ item.cargoCount }}个
            </div>
          </div>
        </div>
      </div>

      <div v-show="isConfirm == 1">
        <div class="table-list">
          <div
            style="
              color: rgba(1, 6, 33, 0.9);
              font-size: 16px;
              font-weight: 700;
              padding-bottom: 15px;
            "
          >
            载货商品
          </div>
          <u-table
            ref="plTable"
            class="utable"
            :height="$store.getters.screenHeight - 510"
            :border="false"
            :header-row-style="{ height: '46px' }"
            :header-cell-style="{
              padding: '0px 0px',
              'font-size': '14px',
              color: 'rgba(1, 6, 33, 0.65)',
              background: 'rgba(0, 0, 0, 0.02)',
            }"
            :row-style="{ height: '46px' }"
            :cell-style="{
              padding: '0px 0px',
              'font-size': '14px',
              color: 'rgba(1, 6, 33, 0.7)',
              height: '46px',
            }"
            use-virtual
            :row-height="46"
            showBodyOverflow="tooltip"
            showHeaderOverflow="title"
            :data="tableDataList"
          >
            <template slot="empty"> 没有查询到符合条件的记录 </template>
            <u-table-column
              v-for="(item, index) in columns"
              :key="index"
              :resizable="item.resizable"
              :show-overflow-tooltip="true"
              :prop="item.prop"
              :label="item.label"
              :fixed="item.fixed"
              :width="item.width"
              :align="item.align"
              header-align="left"
              :sortable="item.sortable"
            >
              <template slot-scope="scope">
                <span v-if="item.prop == 'userBasketNumber'"
                  >{{ scope.row[item.prop] }}个</span
                >
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
            </u-table-column>
            <u-table-column label="操作" :width="100" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="confirmAdd(scope)"
                  >腾空</el-button
                >
              </template>
            </u-table-column>
          </u-table>
        </div>
      </div>

      <div
        v-show="[2, 3].indexOf(isConfirm) !== -1"
        style="padding: 20px 0px 0px"
      >
        <div
          style="
            color: rgba(1, 6, 33, 0.9);
            font-size: 16px;
            font-weight: 700;
            padding-bottom: 15px;
          "
        >
          载货商品
        </div>

        <div>
          <el-row>
            <el-col :span="8"
              ><span class="head-title">载货商品：</span
              ><span class="content-title">{{ tableData.name }}</span></el-col
            >
            <el-col :span="8"
              ><span class="head-title">商品产地：</span
              ><span class="content-title">{{
                tableData.regionName
              }}</span></el-col
            >
            <el-col :span="8"
              ><span class="head-title">商品规格：</span
              ><span class="content-title">{{ tableData.spec }}</span></el-col
            >
          </el-row>
        </div>
      </div>

      <div v-show="isConfirm == 2" class="confirmPage">
        <div
          style="
            color: rgba(1, 6, 33, 0.9);
            font-size: 16px;
            font-weight: 700;
            padding-top: 15px;
            padding-bottom: 15px;
          "
        >
          腾空筐子
        </div>

        <el-scrollbar
          :style="{
            height: $store.getters.screenHeight - 630 + 'px',
          }"
        >
          <div
            :style="{
              'padding-top': index == 0 ? '' : '20px',
              'padding-bottom': '20px',
              'border-bottom': '1px solid #E9E9E9',
            }"
            v-for="(item, index) in tableDataListGoods"
            :key="index"
          >
            <el-row style="margin-bottom: 20px">
              <el-col :span="8"
                ><span class="head-title">供货方：</span
                ><span class="content-title">{{
                  item.custmorName
                }}</span></el-col
              >
              <el-col :span="8"
                ><span class="head-title">批次：</span
                ><span class="content-title">{{
                  parseTime(item.timestamp)
                }}</span></el-col
              >
              <el-col :span="8"
                ><span class="head-title">库存：</span
                ><span class="content-title">
                  {{ item.batchNumber + item.subUnit }}
                  {{ item.subUnit2 != "" ? "(" : "" }}
                  {{
                    item.subUnit3Weight == 0
                      ? ""
                      : item.subUnit3Weight + item.subUnit3
                  }}
                  {{ item.subUnit3 != "" ? "*" : "" }}
                  {{
                    item.subUnit2Weight == 0
                      ? ""
                      : item.subUnit2Weight + item.subUnit2
                  }}
                  {{ item.subUnit2 != "" ? "/" + item.subUnit : "" }}
                  {{ item.subUnit2 != "" ? ")" : "" }}
                  {{
                    item.pieceUnit != "" && item.pieceUnit != "筐(一次性)"
                      ? "(" + item.pieceNumber + item.pieceUnit + ")"
                      : item.pieceNumber != 0
                      ? "(" + item.pieceNumber + "筐)"
                      : ""
                  }}
                  {{ item.basketNumber != 0 ? "| " + item.basketNumber : ""
                  }}<font v-if="item.basketNumber != 0" style="color: #df971a"
                    >筐</font
                  >
                </span></el-col
              >
            </el-row>
            <el-row
              style="margin-top: 15px"
              v-for="(item1, index1) in item.modellist"
              :key="index1"
            >
              <el-col :span="8"
                ><span class="head-title">颜色：</span
                ><span class="content-title">{{
                  item1.basketColor
                }}</span></el-col
              >
              <el-col :span="8"
                ><span class="head-title">载货：</span
                ><span class="content-title"
                  >{{ item1.basketNumber }}个</span
                ></el-col
              >
              <el-col :span="8">
                <div class="flex_dom flex_item_mid">
                  <span class="head-title">腾空数量：</span
                  ><span class="content-title">
                    <el-form
                      :inline="true"
                      ref="formModel"
                      class="marginform"
                      size="mini"
                      :model="formList[index].modellist[index1]"
                      :rules="rules"
                    >
                      <el-form-item label="" prop="emptyNumber">
                        <div class="search-form-border" style="width: 100%">
                          <el-input
                            v-model="
                              formList[index].modellist[index1].emptyNumber
                            "
                            oninput="value=value.replace(/[^\d.]/g,'')"
                            placeholder="请输入"
                            size="mini"
                          ></el-input>
                          <span class="search-form-title-right">个</span>
                        </div>
                      </el-form-item>
                    </el-form>
                  </span>
                </div>
              </el-col>
            </el-row>
          </div>

          <div
            class="flex_dom"
            style="
              padding-bottom: 20px;
              margin-top: 30px;
              border-bottom: 1px solid rgba(233, 233, 233, 1);
            "
          >
            <el-descriptions title="合计" :column="6">
              <el-descriptions-item label="腾空筐子批次数量">{{
                tableDataListGoods.length + "种"
              }}</el-descriptions-item>
              <el-descriptions-item label="腾空筐子">{{
                emptyBaskNum + "个"
              }}</el-descriptions-item>
            </el-descriptions>
            <!-- <span
              style="
                color: rgba(1, 6, 33, 0.65);
                font-size: 16px;
                margin-right: 10px;
              "
              >彩色：{{ colorNum }}个</span
            >

            <span
              style="
                color: rgba(1, 6, 33, 0.65);
                font-size: 16px;
                margin-right: 10px;
              "
              >白色：{{ whiteNum }}个</span
            >

            <span
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 16px;
                margin-right: 10px;
              "
              >共腾空筐子{{ emptyBaskNum }}个</span
            > -->
          </div>

          <div
            style="padding-top: 20px; margin-right: 5px; padding-bottom: 5px"
            class="flex_dom"
          >
            <div style="font-size: 14px; color: rgba(1, 6, 33, 0.9)">
              腾空原因：
            </div>
            <el-input
              style="width: 40%"
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="form.textarea"
            >
            </el-input>
          </div>
        </el-scrollbar>

        <div
          style="padding: 10px 0px 0px"
          class="confirmView flex_dom flex_item_mid"
        >
          <el-button type="primary" @click="confirmAdd1()" size="small"
            >提交订单</el-button
          >
        </div>
      </div>

      <div v-show="isConfirm == 3">
        <div class="table-list">
          <div
            style="
              color: rgba(1, 6, 33, 0.9);
              font-size: 16px;
              font-weight: 700;
              padding-bottom: 15px;
            "
          >
            腾空筐子信息
          </div>

          <el-scrollbar
            :style="{
              height: $store.getters.screenHeight - 565 + 'px',
            }"
          >
            <u-table
              ref="plTable"
              class="utable"
              style="padding-right: 10px"
              :max-height="$store.getters.screenHeight - 530"
              :border="false"
              :header-row-style="{ height: '46px' }"
              :header-cell-style="{
                padding: '0px 0px',
                'font-size': '14px',
                color: 'rgba(1, 6, 33, 0.65)',
                background: 'rgba(0, 0, 0, 0.02)',
              }"
              :row-style="{ height: '46px' }"
              :cell-style="{
                padding: '0px 0px',
                'font-size': '14px',
                color: 'rgba(1, 6, 33, 0.7)',
                height: '46px',
              }"
              use-virtual
              :row-height="46"
              showBodyOverflow="tooltip"
              showHeaderOverflow="title"
              :data="tableDataList1"
              :span-method="objectSpanMethod"
              show-summary
              :summary-method="summaryMethod"
            >
              <template slot="empty"> 没有查询到符合条件的记录 </template>
              <u-table-column
                v-for="(item, index) in columns1"
                :key="index"
                :resizable="item.resizable"
                :show-overflow-tooltip="true"
                :prop="item.prop"
                :label="item.label"
                :fixed="item.fixed"
                :width="item.width"
                :align="item.align"
                header-align="left"
                :sortable="item.sortable"
              >
                <template slot-scope="scope">
                  <span v-if="item.prop == 'timestamp'">{{
                    parseTime(scope.row[item.prop])
                  }}</span>
                  <span v-else>{{ scope.row[item.prop] }}</span>
                </template>
              </u-table-column>
            </u-table>

            <div
              class="flex_dom flex_row_reverse"
              style="
                padding-bottom: 20px;
                margin-top: 30px;
                border-bottom: 1px solid rgba(233, 233, 233, 1);
              "
            >
              <span
                style="
                  color: rgba(1, 6, 33, 0.65);
                  font-size: 16px;
                  margin-right: 10px;
                "
                >彩色：{{ colorNum }}个</span
              >

              <span
                style="
                  color: rgba(1, 6, 33, 0.65);
                  font-size: 16px;
                  margin-right: 10px;
                "
                >白色：{{ whiteNum }}个</span
              >

              <span
                style="
                  color: rgba(1, 6, 33, 0.9);
                  font-size: 16px;
                  margin-right: 10px;
                "
                >共腾空筐子{{ emptyBaskNum }}个</span
              >
            </div>

            <div
              style="padding-top: 20px; margin-right: 5px; padding-bottom: 5px"
              class="flex_dom"
            >
              <div style="font-size: 14px; color: rgba(1, 6, 33, 0.9)">
                腾空原因：
              </div>
              <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                form.textarea
              }}</span>
            </div>
          </el-scrollbar>
        </div>

        <div
          style="padding: 10px 0px 0px"
          class="confirmView flex_dom flex_item_mid"
        >
          <el-button
            style="
              color: var(--color-primary);
              border: 1px solid var(--color-primary);
            "
            @click="confirmAndView(1)"
            size="small"
            >确认并查看</el-button
          >
          <el-button type="primary" @click="confirmAndView(2)" size="small"
            >确认并返回</el-button
          >
        </div>
      </div>
    </div>
  </PageNoScroll>
</template>

<script>
import basket from "@/assets/image/imgs/basket.png";
import { Base64 } from "js-base64";
import {
  basketBindProductDetail,
  goodsBatchBasket,
  emptyBasketPc,
} from "@/request/api/frameManage/index";
import { parseTime } from "@/utils/common";

export default {
  name: "emptyBasket",
  data() {
    var valiEmptyNumber = (rule, value, callback) => {
      if (!String(value)) {
        callback(new Error("请输入腾空数量"));
      } else {
        callback();
      }
    };
    return {
      parseTime,
      url: basket,
      basketData: {},
      isConfirm: 1,
      columns: [
        {
          // width: 180,
          prop: "name",
          label: "商品名称",
          align: "left",
        },
        {
          // width: 170,
          prop: "productName",
          label: "品种/品牌",
          align: "left",
        },
        {
          // width: 160,
          prop: "spec",
          label: "级别/规格",
          align: "left",
        },
        {
          // width: 160,
          prop: "regionName",
          label: "产地",
          align: "left",
        },
        {
          // width: 160,
          prop: "userBasketNumber",
          label: "载货",
          align: "left",
        },
      ],
      columns1: [
        {
          // width: 180,
          prop: "custmorName",
          label: "供货方",
          align: "left",
        },
        {
          // width: 170,
          prop: "batchSourceName",
          label: "入库方式",
          align: "left",
        },
        {
          // width: 170,
          prop: "timestamp",
          label: "批次",
          align: "left",
        },
        {
          // width: 160,
          prop: "basketColor",
          label: "颜色",
          align: "left",
        },
        {
          // width: 160,
          prop: "emptyNumber",
          label: "腾空数量（个）",
          align: "left",
        },
      ],
      tableDataList: [],
      tableDataList1: [],
      tableDataListGoods: [],
      tableData: {},
      form: { textarea: "" },
      formList: [],
      rules: {
        emptyNumber: [
          {
            validator: valiEmptyNumber,
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  computed: {
    countSum() {
      let num = 0;
      for (let i = 0; i < this.basketData.modelList.length; i++) {
        const el = this.basketData.modelList[i];
        num += el.count;
      }
      return num;
    },
    vacantCountSum() {
      let num = 0;
      for (let i = 0; i < this.basketData.modelList.length; i++) {
        const el = this.basketData.modelList[i];
        num += Number(el.vacantCount);
      }
      return num;
    },
    cargoCountSum() {
      let num = 0;
      for (let i = 0; i < this.basketData.modelList.length; i++) {
        const el = this.basketData.modelList[i];
        num += Number(el.cargoCount);
      }
      return num;
    },
    emptyBaskNum() {
      let num = 0;
      for (let i = 0; i < this.formList.length; i++) {
        const el = this.formList[i];
        for (let j = 0; j < el.modellist.length; j++) {
          const ele = el.modellist[j];
          num += Number(ele.emptyNumber);
        }
      }
      return num;
    },
    colorNum() {
      let num = 0;
      for (let i = 0; i < this.formList.length; i++) {
        const el = this.formList[i];
        for (let j = 0; j < el.modellist.length; j++) {
          const ele = el.modellist[j];
          if (ele.basketColor != "白色") {
            num += Number(ele.emptyNumber);
          }
        }
      }
      return num;
    },
    whiteNum() {
      let num = 0;
      for (let i = 0; i < this.formList.length; i++) {
        const el = this.formList[i];
        for (let j = 0; j < el.modellist.length; j++) {
          const ele = el.modellist[j];
          if (ele.basketColor == "白色") {
            num += Number(ele.emptyNumber);
          }
        }
      }
      return num;
    },
  },
  methods: {
    initData() {
      let { data: data } = this.$route.query;
      // 判断url是否为空
      if (data) {
        // 解析数据
        try {
          let param = JSON.parse(Base64.decode(data));
          if (!param.basketId) {
            this.handleRouter();
            return;
          }
          this.basketData = param;
          this.getBasketBindProductDetail();
        } catch (error) {
          this.handleRouter();
        }
        return;
      }
      this.handleRouter();
    },
    getBasketBindProductDetail() {
      let param = {
        basketId: this.basketData.basketId,
      };
      basketBindProductDetail(param).then((res) => {
        if (res.status == 200) {
          this.tableDataList = res.data;
        }
      });
    },
    getGoodsBatchBasket() {
      let param = {
        basketId: this.basketData.basketId, // 筐子主键id
        productId: this.tableData.productId, // 商品主键id
      };
      goodsBatchBasket(param).then((res) => {
        if (res.status == 200) {
          this.formList = [];
          this.tableDataListGoods = [];
          this.tableDataListGoods = res.data;
          for (let i = 0; i < this.tableDataListGoods.length; i++) {
            const el = this.tableDataListGoods[i];
            this.formList.push({
              id: i,
              custmorName: el.custmorName,
              timestamp: el.timestamp,
              batchSourceName: el.batchSourceName, // 载货筐子数量
              modellist: [],
            });
            for (let j = 0; j < el.modellist.length; j++) {
              const ele = el.modellist[j];
              this.formList[i].modellist.push({
                productBindId: ele.productBindId, // 商品筐子绑定表id
                basketId: ele.basketId, // 筐子id
                productBatchId: ele.productBatchId, // 批次id
                basketColor: ele.basketColor, // 筐子颜色
                basketNumber: ele.basketNumber, // 载货筐子数量
                emptyNumber: 0,
              });
            }
          }
        }
      });
    },
    // 确认添加
    async confirmAdd(scope) {
      this.tableData = scope.row;
      this.getGoodsBatchBasket();
      this.isConfirm = 2;
    },
    async confirmAdd1() {
      let data = await this.handleValidate();
      if (data) {
        this.tableDataList1 = [];
        for (let i = 0; i < this.formList.length; i++) {
          const el = this.formList[i];
          for (let j = 0; j < el.modellist.length; j++) {
            const ele = el.modellist[j];
            this.tableDataList1.push({
              custmorName: el.custmorName,
              batchSourceName: el.batchSourceName,
              timestamp: el.timestamp,
              basketColor: ele.basketColor,
              emptyNumber: ele.emptyNumber,
              isCol: j == 0 ? el.modellist.length : null,
            });
          }
        }

        this.isConfirm = 3;
      }
    },
    // 确认并查看 确认并返回
    confirmAndView(val) {
      this.$confirm("确认腾空筐子", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "",
      })
        .then(() => {
          let param = {
            remark: this.form.textarea, //备注
            emptyData: [],
          };
          for (let i = 0; i < this.formList.length; i++) {
            const el = this.formList[i];
            for (let j = 0; j < el.modellist.length; j++) {
              const ele = el.modellist[j];
              param.emptyData.push({
                productBindId: ele.productBindId, // 商品批次绑定id
                productBindCount: ele.basketNumber, // 商品批次载货数量
                basketId: ele.basketId, // 筐子主键id
                emptyNumber: Number(ele.emptyNumber), // 腾空数量
                productBatchId: ele.productBatchId, // 商品批次id
                basketColor: ele.basketColor, // 筐子颜色
              });
            }
          }
          emptyBasketPc(param).then((res) => {
            if (res.status == 200) {
              this.$msgbox({
                type: "success",
                title: "提示",
                message: "操作成功，等待跳转",
                showClose: false,
                showCancelButton: false,
                showConfirmButton: false,
              }).then((action) => {});
              setTimeout(() => {
                if (val == 2) {
                  this.$store
                    .dispatch("tagsView/delView", {
                      path: this.$route.path,
                    })
                    .then(({ visitedViews }) => {
                      this.$msgbox.close();
                      this.$router.push({
                        path: "/frameManage/currentInventory",
                      });
                    });
                } else {
                  // 1 筐子自购单 4 筐子售出单 5 筐子购入单 6 筐子报废单 7 筐子报失单 8 筐子报溢单 10 筐子腾空单 25 自有筐子单 13 退筐退款单 14 退入退款单
                  this.$msgbox.close();
                  this.$router.push({
                    path: "emptyOrder",
                    query: {
                      basketInOutTypeView: 10,
                      orderId: res.data[0],
                    },
                  });
                }
              }, 3000);
            } else if (res.status == -6) {
              this.$alert(
                "商品库存与筐子库存发生变化，请仔细核对后操作",
                "提示",
                {
                  confirmButtonText: "确定",
                  callback: (action) => {
                    this.$message({
                      type: "info",
                      message: "已取消操作",
                    });
                  },
                }
              );
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作",
          });
        });
    },
    // 跳转
    handleRouter() {
      setTimeout(() => {
        this.$store
          .dispatch("tagsView/delView", {
            path: this.$route.path,
          })
          .then(({ visitedViews }) => {
            this.$router.push({ path: "/frameManage/currentInventory" });
          });
      }, 0);
    },
    // 获取多个form验证结果，具体参考第二种form代码
    handleValidate() {
      const list = [];
      const validas = [];
      this.$refs.formModel.forEach((item, index) => {
        // 把单个验证结果处理为promise函数，然后添加到list中
        list.push(
          new Promise((resolve) => {
            item.validate((valida) => {
              validas.push(valida);
              resolve();
            });
          })
        );
      });

      // 通过Promise.all等待几个验证都完成再处理
      return Promise.all([...list])
        .then(() => {
          const res = !validas.some((item) => item === false);
          return res;
        })
        .catch(() => {
          return false;
        });
    },
    // 合并列
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex == 0 || row.isCol) {
          return {
            rowspan: row.isCol,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }

      if (columnIndex === 1) {
        if (rowIndex == 0 || row.isCol) {
          return {
            rowspan: row.isCol,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
      if (columnIndex === 2) {
        if (rowIndex == 0 || row.isCol) {
          return {
            rowspan: row.isCol,
            colspan: 1,
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0,
          };
        }
      }
    },
    // 合计
    summaryMethod({ columns, data }) {
      const means = []; // 合计
      columns.forEach((column, columnIndex) => {
        if (column.property == "basketColor") {
          means.push(
            '<span style="color: rgba(1, 6, 33, 0.9);font-size:18px;font-weight: 700;">' +
              "总计"
          );
        } else {
          if (column.property == "emptyNumber") {
            const values = data.map((item) => Number(item[column.property]));
            // 合计
            if (!values.every((value) => isNaN(value))) {
              means[columnIndex] = values.reduce((prev, curr) => {
                const value = Number(curr);
                if (!isNaN(value)) {
                  return prev + curr;
                } else {
                  return prev;
                }
              }, 0);
              // means[columnIndex] += ' 元'
              // 改变了ele的合计方式，扩展了合计场景
              // 你以为就只有上面这样玩吗？错啦，你还可以自定义样式哦
              // means[columnIndex] = '<span style="color: red">' + means[columnIndex] + '元</span>'
              if (column.property == "emptyNumber") {
                means[columnIndex] =
                  '<span style="color: rgba(232, 84, 30, 1);font-size:18px;font-weight: 700;">' +
                  means[columnIndex] +
                  "</span>";
              }
            } else {
              means[columnIndex] = "";
            }
          }
        }
      });
      // 返回一个二维数组的表尾合计(不要平均值，你就不要在数组中添加)
      return [means];
    },
    // 返回
    handleBreak() {
      if (this.isConfirm == 1) {
        this.isConfirm = 1;
        return;
      }
      this.isConfirm -= 1;
    },
  },
  created() {
    this.initData();
  },
};
</script>

<style lang="scss" scoped>
.emptyBasketModel {
  .emTop-steps {
    padding: 15px 0px 20px;
    border-bottom: 1px solid #e9e9e9;

    .em-steps {
      margin: 0px auto;

      width: 600px;
      .border-steps {
        width: 30px;
        height: 30px;
        border-radius: 50%;

        text-align: center;
        line-height: 26px;
        color: #fff;
        font-size: 20px;
        background: #ebebeb;
        box-shadow: 0px 0px 5px #ebebeb;
        border: 1px solid rgba(235, 235, 235, 0.18);
      }

      .title-steps {
        margin-left: 10px;
      }

      .isstepsActive {
        background: #00a499;
        box-shadow: 0px 0px 5px #00a499;
        border: 1px solid rgba(11, 161, 152, 0.18);
      }
      .isstepsActivetitle {
        color: #00a499;
      }
    }
  }

  .header-top {
    padding: 28px 0px;
  }

  .table-list {
    padding: 20px 0px 10px;
  }
  .confirmPage {
    // padding: 10px 0px;
    .head-title {
      color: rgba(1, 6, 33, 0.65);
      font-size: 16px;
    }
    .content-title {
      color: rgba(1, 6, 33, 0.9);
      font-size: 16px;
    }
  }

  .utable {
    width: 100%;
    border-top: 1px solid #e9e9e9;
    border-left: 1px solid #e9e9e9;
    border-right: 1px solid #e9e9e9;
  }

  .search-form-border {
    display: flex;
    align-items: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;

    .search-form-title {
      padding: 2px 8px;
      margin: -1px 0px -1px;
      white-space: nowrap;
      font-size: 14px;
      color: rgba(1, 6, 33, 0.35);
    }
    .search-form-title-right {
      border-left: 1px solid #dcdfe6;
      padding: 2px 8px;
      margin: -1px 0px -1px;
      white-space: nowrap;
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
  }

  .el-form-item {
    margin-bottom: 0px !important;
  }

  .confirmView {
    position: absolute;
    bottom: 8px;
    right: 15px;
  }
}
</style>

<style lang="scss">
.emptyBasketModel {
  .el-scrollbar {
    .el-scrollbar__wrap {
      margin-bottom: 0px !important;
      overflow-x: hidden;

      .el-scrollbar__view {
        // height: var(--screenHeight) !important;
        position: relative;
        padding: 0px !important;
      }
    }
  }
}
</style>