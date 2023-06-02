<template>
  <!-- 盘点单详情 -->
  <PageNoScroll class="inventoryDetails">
    <el-scrollbar
      ref="scrollDiv"
      :style="{
        height: $store.getters.screenHeight - 220 + 'px',
      }"
    >
      <div
        style="
          border-bottom: 1px solid rgba(233, 233, 233, 1);
          padding-bottom: 20px;
        "
      >
        <el-descriptions title="订单信息">
          <template slot="extra">
            <div style="margin-right: 16px">
              <span>操作人：</span>
              <span>{{ goodsDetail.username }}</span>
            </div>
          </template>
          <el-descriptions-item label="盘点单编号">{{
            goodsDetail.checkorderid
          }}</el-descriptions-item>
          <el-descriptions-item label="盘点时间">{{
            goodsDetail.timestamp | parseTime
          }}</el-descriptions-item>
        </el-descriptions>
        <!-- 按钮 -->
        <div class="flex_dom flex_row_reverse flex_item_mid">
          <el-button size="small">打印</el-button>
        </div>
      </div>

      <div style="margin-top: 18px">
        <div
          style="
            font-size: 18px;
            color: rgba(1, 6, 33, 0.9);
            font-weight: 600;
            margin-bottom: 12px;
          "
        >
          商品信息
        </div>
        <div ref="currentBasketDetailsTable">
          <div class="classification">
            <div class="classification-left" v-if="goodsMsgTop">
              <span style="margin-right: 6%">全部结果</span>
              <el-tag
                v-for="(item, index) in checkedTag"
                :key="'checked' + index"
                closable
                @close="delTags(item)"
                type="info"
                style="margin-right: 6%; margin-bottom: 20px"
              >
                {{ item.name }}</el-tag
              >
            </div>
            <div class="classification-right" v-if="goodsMsgBottom">
              <span style="margin-right: 6%">分类</span>
              <template v-if="isShow.tags1">
                <el-tag
                  v-for="(item, index) in tags1"
                  :key="'tags1' + index"
                  @click="handeltags1(item.childList, item)"
                  type="info"
                  style="margin-right: 6%; border: none"
                >
                  {{ item.name }}</el-tag
                >
              </template>
              <template v-if="isShow.tags2">
                <el-tag
                  v-for="(item, index) in tags2"
                  :key="'tags2' + index"
                  @click="handeltags2(item.childList, item)"
                  type="info"
                  style="margin-right: 6%; border: none"
                >
                  {{ item.name }}</el-tag
                >
              </template>
              <template v-if="isShow.tags3">
                <el-tag
                  v-for="(item, index) in tags3"
                  :key="'tags3' + index"
                  @click="handeltags3(item)"
                  type="info"
                  style="margin-right: 6%; border: none"
                >
                  {{ item.name }}</el-tag
                >
              </template>
            </div>
          </div>
          <div style="height: 100%; margin-top: 22px">
            <el-table
              :data="goodsDetailList"
              style="border-top: 1px solid #e9e9e9"
              ref="table"
            >
              <el-table-column label="分类" prop="classifyName">
              </el-table-column>
              <el-table-column label="品种/品牌" prop="variety">
              </el-table-column>
              <el-table-column label="产地" prop="region"> </el-table-column>
              <el-table-column label="级别/规格" prop="spec"> </el-table-column>
              <el-table-column label="盘点前库存" prop="beforeproductcount">
                <template slot-scope="scope">
                  {{ scope.row.beforeproductcount + scope.row.subunit }}
                  {{ scope.row.subUnit2 != "" ? "(" : "" }}
                  {{
                    scope.row.subUnit3Weight == 0
                      ? ""
                      : scope.row.subUnit3Weight + scope.row.subUnit3
                  }}
                  {{ scope.row.subUnit3 != "" ? "*" : "" }}
                  {{
                    scope.row.subUnit2Weight == 0
                      ? ""
                      : scope.row.subUnit2Weight + scope.row.subUnit2
                  }}
                  {{ scope.row.subUnit2 != "" ? "/" + scope.row.subunit : "" }}
                  {{ scope.row.subUnit2 != "" ? ")" : "" }}
                  <span v-if="scope.row.pieceunit != ''">
                    {{
                      scope.row.pieceunit != "" &&
                      scope.row.pieceunit != "筐(一次性)"
                        ? "(" +
                          scope.row.beforepiececount +
                          scope.row.pieceunit +
                          ")"
                        : "(" + scope.row.beforepiececount + "筐)"
                    }}
                  </span>
                  {{
                    scope.row.beforebasketcount != 0
                      ? "|" + scope.row.beforebasketcount
                      : ""
                  }}
                  <font
                    v-if="scope.row.beforebasketcount != 0"
                    style="color: #df971a"
                    >筐</font
                  >
                </template>
              </el-table-column>
              <el-table-column label="盘点后库存" prop="afterproductcount">
                <template slot-scope="scope">
                  {{ scope.row.afterproductcount + scope.row.subunit }}
                  {{ scope.row.subUnit2 != "" ? "(" : "" }}
                  {{
                    scope.row.subUnit3Weight == 0
                      ? ""
                      : scope.row.subUnit3Weight + scope.row.subUnit3
                  }}
                  {{ scope.row.subUnit3 != "" ? "*" : "" }}
                  {{
                    scope.row.subUnit2Weight == 0
                      ? ""
                      : scope.row.subUnit2Weight + scope.row.subUnit2
                  }}
                  {{ scope.row.subUnit2 != "" ? "/" + scope.row.subunit : "" }}
                  {{ scope.row.subUnit2 != "" ? ")" : "" }}
                  <span v-if="scope.row.pieceunit != ''">
                    {{
                      scope.row.pieceunit != "" &&
                      scope.row.pieceunit != "筐(一次性)"
                        ? "(" +
                          scope.row.afterpiececount +
                          scope.row.pieceunit +
                          ")"
                        : "(" + scope.row.afterpiececount + "筐)"
                    }}
                  </span>
                  {{
                    scope.row.afterbasketcount != 0
                      ? "|" + scope.row.afterbasketcount
                      : ""
                  }}
                  <font
                    v-if="scope.row.afterbasketcount != 0"
                    style="color: #df971a"
                    >筐</font
                  >
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    style="color: #1a7fd9"
                    @click="handleDetail(scope.row)"
                  >
                    {{
                      scope.row.isshow == false ? "展开批次" : "收起批次"
                    }}</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column label="操作" type="expand" width="1">
                <!-- <template slot-scope="scope"> -->
                <el-table label-position="left" inline :data="basketList">
                  <el-table-column label="入库时间" prop="productidbatchname">
                    <template slot-scope="scope">
                      {{ scope.row.productidbatchname | parseTime }}
                    </template>
                  </el-table-column>
                  <el-table-column label="入库类型" prop="productidbatchsource">
                  </el-table-column>
                  <el-table-column label="盘点前库存" prop="beforecount">
                    <template slot-scope="scope">
                      {{ scope.row.beforecount + goodsDetailList1.subunit }}
                      {{ goodsDetailList1.subUnit2 != "" ? "(" : "" }}
                      {{
                        goodsDetailList1.subUnit3Weight == 0
                          ? ""
                          : goodsDetailList1.subUnit3Weight +
                            goodsDetailList1.subUnit3
                      }}
                      {{ goodsDetailList1.subUnit3 != "" ? "*" : "" }}
                      {{
                        goodsDetailList1.subUnit2Weight == 0
                          ? ""
                          : goodsDetailList1.subUnit2Weight +
                            goodsDetailList1.subUnit2
                      }}
                      {{
                        goodsDetailList1.subUnit2 != ""
                          ? "/" + goodsDetailList1.subunit
                          : ""
                      }}
                      {{ goodsDetailList1.subUnit2 != "" ? ")" : "" }}
                      <span v-if="goodsDetailList1.pieceunit != ''">
                        {{
                          goodsDetailList1.pieceunit != "" &&
                          goodsDetailList1.pieceunit != "筐(一次性)"
                            ? "(" +
                              scope.row.beforepiececount +
                              goodsDetailList1.pieceunit +
                              ")"
                            : "(" + scope.row.beforepiececount + "筐)"
                        }}
                      </span>
                      {{
                        scope.row.beforebasketcount != 0
                          ? "|" + scope.row.beforebasketcount
                          : ""
                      }}
                      <font
                        v-if="scope.row.beforebasketcount != 0"
                        style="color: #df971a"
                        >筐
                      </font>
                    </template>
                  </el-table-column>
                  <el-table-column label="盘点后库存" prop="aftercount">
                    <template slot-scope="scope">
                      {{ scope.row.aftercount + goodsDetailList1.subunit }}
                      {{ goodsDetailList1.subUnit2 != "" ? "(" : "" }}
                      {{
                        goodsDetailList1.subUnit3Weight == 0
                          ? ""
                          : goodsDetailList1.subUnit3Weight +
                            goodsDetailList1.subUnit3
                      }}
                      {{ goodsDetailList1.subUnit3 != "" ? "*" : "" }}
                      {{
                        goodsDetailList1.subUnit2Weight == 0
                          ? ""
                          : goodsDetailList1.subUnit2Weight +
                            goodsDetailList1.subUnit2
                      }}
                      {{
                        goodsDetailList1.subUnit2 != ""
                          ? "/" + goodsDetailList1.subunit
                          : ""
                      }}
                      {{ goodsDetailList1.subUnit2 != "" ? ")" : "" }}
                      <span v-if="goodsDetailList1.pieceunit != ''">
                        {{
                          goodsDetailList1.pieceunit != "" &&
                          goodsDetailList1.pieceunit != "筐(一次性)"
                            ? "(" +
                              scope.row.afterpiececount +
                              goodsDetailList1.pieceunit +
                              ")"
                            : "(" + scope.row.afterpiececount + "筐)"
                        }}
                      </span>
                      {{
                        scope.row.afterbasketcount != 0
                          ? "|" + scope.row.afterbasketcount
                          : ""
                      }}
                      <font
                        v-if="scope.row.afterbasketcount != 0"
                        style="color: #df971a"
                        >筐
                      </font>
                    </template>
                  </el-table-column>
                  <el-table-column label="盘点状态" prop="floattype">
                    <template slot-scope="scope">
                      {{
                        scope.row.floattype == 1
                          ? "报溢"
                          : "scope.row.floattype==2"
                          ? "报损"
                          : "无误差"
                      }}
                    </template>
                  </el-table-column>
                  <el-table-column label="操作">
                    <el-button type="text" style="color: #1a7fd9"
                      >详情</el-button
                    >
                  </el-table-column>
                </el-table>
                <!-- </template> -->
              </el-table-column>
            </el-table>
            <div class="table_count_styl">
              <span style="margin-right: 32px">合计</span>
              <span style="margin-right: 32px"
                >盘点商品数量:{{ goodsDetail.checktotalcount }}种</span
              >
            </div>
            <div
              class="flex_dom flex_row_reverse flex_item_mid"
              style="margin-top: 20px"
            >
              <el-pagination
                background
                layout="total, sizes, prev, pager, next, jumper"
                :page-sizes="[10, 20, 50, 100]"
                :total="pagination.total"
                :page-size="pagination.limit"
                :current-page.sync="pagination.page"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              ></el-pagination>
            </div>
          </div>
        </div>
        <div style="border-top: 1px solid #e9e9e9; margin-top: 24px">
          <div
            style="
              color: rgba(1, 6, 33, 0.9);
              font-size: 18px;
              font-weight: 700;
              padding-right: 15px;
              margin: 16px 0px;
            "
          >
            备注
          </div>
          <div style="padding: 10px 0px">
            {{ goodsDetail.remark }}
          </div>
        </div>
      </div>
    </el-scrollbar>
  </PageNoScroll>
</template>

<script>
import { checkDetail } from "@/request/api/commodityDetail/index";
export default {
  name: "inventoryDetails",
  data() {
    return {
      id: this.$route.query.id,
      goodsDetail: {},
      goodsDetailList: [],
      goodsDetailList1: {},
      basketList: [],
      usebasketDialog: false,
      goodsMsgTop: false,
      goodsMsgBottom: true,
      tags1: [],
      tags2: [],
      tags3: [],
      isShow: {
        tags1: true,
        tags2: true,
        tags3: true,
      },
      checkedTag: [],
      pagination: {
        page: 1, // 页码
        limit: 10, // 分页大小
        total: 0,
      },
    };
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        this.checkDetail();
      },
      deep: true,
    },
  },
  methods: {
    // 分页
    handleSizeChange(val) {
      this.pagination.limit = val;
      this.checkDetail(1);
    },
    handleCurrentChange(val) {
      this.pagination.page = val;
      this.checkDetail();
    },
    handleDetail(row) {
      this.goodsDetailList.map((item) => {
        if (row.productid != item.productid) {
          this.$refs.table.toggleRowExpansion(item, false);
        }
      });
      this.$refs.table.toggleRowExpansion(row);
      for (let i = 0; i < this.goodsDetailList.length; i++) {
        if (row.productid == this.goodsDetailList[i].productid) {
          this.goodsDetailList[i].isshow = !this.goodsDetailList[i].isshow;
        } else {
          this.goodsDetailList[i].isshow = false;
        }
      }
    },
    checkDetail() {
      let param = {
        orderId: this.$route.query.id,
        classify: "",
        pageindex: this.pagination.page, // 页码
        pagesize: this.pagination.limit, // 分页大小
      };
      let obj = [];
      for (let i = 0; i < this.checkedTag.length; i++) {
        obj.push(this.checkedTag[i].categoryId);
      }
      param.classify = obj.join("-");
      checkDetail(param).then((res) => {
        this.goodsDetail = res.data[0];
        this.pagination.total = res.data[0].sumCount;
        this.goodsDetailList = res.data[0].productinfo;
        this.tags1 = res.data[0].classifyList;
        this.goodsDetailList1 = res.data[0].productinfo[0];
        this.basketList = res.data[0].productinfo[0].batchinfo;
        let resp = this.goodsDetailList;
        for (let i = 0; i < resp.length; i++) {
          resp[i].isshow = false;
        }
        this.goodsDetailList = resp;
      });
    },
    //处理保留小数点后两位
    moneyFormatTwo(moneyStr) {
      // 先将数值取两位小数
      let money = Number(moneyStr)
        .toFixed(2)
        .toString()
        .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      return money;
    },
    handleClose() {
      this.usebasketDialog = false;
    },
    delTags(item) {
      if (item.treeStructure == 1) {
        this.checkedTag = [];
        this.tags2 = [];
        this.tags3 = [];
        this.isShow = {
          tags1: true,
          tags2: true,
          tags3: true,
        };
        this.goodsMsgTop = false;
        this.goodsMsgBottom = true;
      } else if (item.treeStructure == 2) {
        this.checkedTag.splice(1, 2);
        this.tags3 = [];
        this.isShow.tags2 = true;
        this.goodsMsgTop = true;
        this.goodsMsgBottom = true;
      } else {
        this.checkedTag.splice(2, 1);
        this.isShow.tags3 = true;
        this.goodsMsgTop = true;
        this.goodsMsgBottom = true;
      }
      this.checkDetail();
    },
    handeltags3(row) {
      this.checkedTag.push({
        name: row.name,
        categoryId: row.categoryId,
        treeStructure: 3,
      });
      this.isShow.tags3 = false;
      this.goodsMsgTop = true;
      this.goodsMsgBottom = false;
      this.checkDetail();
    },
    handeltags2(obj, row) {
      this.tags3 = obj;
      this.checkedTag.push({
        name: row.name,
        categoryId: row.categoryId,
        treeStructure: 2,
      });
      this.isShow.tags2 = false;
      this.isShow.tags3 = true;
      this.goodsMsgTop = true;
      this.checkDetail();
    },
    handeltags1(obj, row) {
      this.tags2 = obj;
      this.checkedTag.push({
        name: row.name,
        categoryId: row.categoryId,
        treeStructure: 1,
      });
      this.isShow.tags1 = false;
      this.isShow.tags2 = true;
      this.goodsMsgTop = true;
      this.checkDetail();
    },
  },
  created() {
    this.checkDetail();
  },
};
</script>

<style lang="scss">
.inventoryDetails {
  .classification {
    margin-top: 18px;
    padding: 16px 0px 24px 24px;
    background: #f5f5f7;
    width: 100%;

    // .classification-left {}

    // .classification-right {}
  }

  .table_count_styl {
    padding: 12px;
    color: rgba(1, 6, 33, 0.75);
    background-color: rgba(1, 6, 33, 0.02);
    border: 1px solid #e9e9e9;
    border-top: 0px;

    .table_count_styl span {
      margin-right: 32px;
    }
  }

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