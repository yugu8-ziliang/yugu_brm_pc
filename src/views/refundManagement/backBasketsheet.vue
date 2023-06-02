<template>
  <!-- 新建退入筐子单 -->
  <PageNoScroll
    :titleRefresh="false"
    :titleBreak="true"
    class="backBasketsheetModel"
  >
    <div v-if="editPage">
      <el-scrollbar
        :style="{
          height: $store.getters.screenHeight - 240 + 'px',
        }"
      >
        <el-descriptions title="客户信息">
          <el-descriptions-item label="客户姓名">
            <p :class="['userInfo-name', formatClass()]">
              {{ userInfo.toUserName }}
            </p>
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">{{
            userInfo.toPhoneNumber
          }}</el-descriptions-item>
        </el-descriptions>

        <el-descriptions style="margin-top: 20px" title="售出单信息">
          <el-descriptions-item label="订单编号">{{
            tableData.orderBasketId
          }}</el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <font color="#E8541E">
              {{
                tableData.orderStatus == 1
                  ? "待修改"
                  : tableData.orderStatus == 3
                  ? "待对方付款"
                  : tableData.orderStatus == 4
                  ? "待收款"
                  : tableData.orderStatus == 5
                  ? "未结清"
                  : "已结清"
              }}
            </font>
          </el-descriptions-item>
          <el-descriptions-item label="售出时间">{{
            tableData.buyTimestamp | parseTime
          }}</el-descriptions-item>
          <el-descriptions-item label="订单金额"
            >{{ moneyFormatTwo(tableData.totalPrice) }}元</el-descriptions-item
          >
          <el-descriptions-item label="已收金额"
            >{{
              moneyFormatTwo(tableData.actualPayPrice)
            }}元</el-descriptions-item
          >
          <el-descriptions-item label="剩余未收"
            >{{
              moneyFormatTwo(tableData.shouldPayPrice)
            }}元</el-descriptions-item
          >
          <el-descriptions-item label="创建时间">{{
            tableData.timestamp | parseTime
          }}</el-descriptions-item>
          <el-descriptions-item label="成交时间">{{
            tableData.confirmTimestamp | parseTime
          }}</el-descriptions-item>
        </el-descriptions>

        <!-- 筐子信息 -->
        <div class="block-title" style="margin-top: 1.25rem">筐子信息</div>
        <el-form ref="form" inline :model="form" :rules="rules">
          <div v-if="selectBasketDialog" class="basket-list-main">
            <div
              class="item"
              v-for="(item, index) in form.forData2"
              :key="index"
            >
              <div class="item-title">
                {{ form.forData2 }}
                【{{ item.name }}】{{ item.basketName }}
              </div>
              <div
                class="item-child"
                v-for="(item2, index2) in item.basketList"
                :key="'33' + index2"
              >
                <div class="child-color">
                  <span>颜色：{{ item2.basketColor }}</span>
                  <em @click="remove(index, index2)">移除</em>
                </div>
                <div class="child-spec">
                  <span>剩余可退：{{ item2.surplusCount }}个</span>
                  <span>筐子单价：{{ item2.basketPrice }}元/个</span>
                </div>
                <div class="child-form">
                  <div class="child-form-item">
                    <el-form-item
                      label="退筐数量"
                      :prop="
                        'forData2.' +
                        index +
                        '.basketList.' +
                        index2 +
                        '.boxBackNum'
                      "
                      :rules="[
                        { required: true, message: '请输入', trigger: 'blur' },
                      ]"
                    >
                      <el-input v-model="item2.boxBackNum">
                        <span slot="append">个</span>
                      </el-input>
                    </el-form-item>
                  </div>
                  <div class="child-form-item">
                    <el-form-item
                      label="退筐单价"
                      :prop="
                        'forData2.' +
                        index +
                        '.basketList.' +
                        index2 +
                        '.boxBackPrice'
                      "
                      :rules="[
                        { required: true, message: '请输入', trigger: 'blur' },
                      ]"
                    >
                      <el-input v-model="item2.boxBackPrice">
                        <span slot="append">元/个</span>
                      </el-input>
                    </el-form-item>
                  </div>
                  <div class="child-form-item">
                    <span
                      >金额小计：{{
                        moneyFormatTwo(
                          item2.boxBackPrice * item2.boxBackNum
                            ? item2.boxBackPrice * item2.boxBackNum
                            : 0.0
                        )
                      }}元</span
                    >
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-form>
        <div>
          -->
          <el-button
            icon="el-icon-plus"
            type="primary"
            style="margin-top: 0.75rem"
          >
            添加筐子
          </el-button>
          <div class="block-title" style="margin-top: 1.25rem">合计</div>
          <span style="margin-right: 3.75rem"
            >退筐种类：{{ forData.length }}种</span
          >
          <span style="margin-right: 3.75rem"
            >退筐数量：{{ basketNum || 0 }}个</span
          >
          <span
            >筐子金额：{{
              moneyFormatTwo(totalAmount ? totalAmount : 0)
            }}元</span
          >
        </div>
        <!-- 备注信息 -->
        <div>
          <div class="block-title" style="margin-top: 1.25rem">备注</div>
          <el-input
            type="textarea"
            placeholder="请输入"
            v-model="remark"
            maxlength="200"
            show-word-limit
            resize="none"
            rows="5"
            style="width: 60%; margin-bottom: 2.5rem"
          >
          </el-input>
        </div>
        <!-- 添加筐子按钮弹窗开始 -->
        <el-dialog
          title="历史售出单"
          :visible.sync="selectOrderDialog"
          width="51rem"
          @close="selectOrderClose"
        >
          <div class="selectOrder-main">
            <div class="order-left">
              <div class="order-item">
                <h2>
                  {{ tableData.timestamp | parseTime }}
                </h2>
                <p>售出筐子：{{ tableData.basketNum }} 种</p>
              </div>
            </div>
            <div class="basket-list">
              <el-table
                :show-header="false"
                :data="tableDataList"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                ref="myTable"
                v-loading="basketLoading"
              >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column
                  label="筐子名称"
                  width="120"
                  prop="basketName"
                ></el-table-column>
                <el-table-column
                  label="颜色"
                  width="120"
                  prop="basketColor"
                ></el-table-column>
                <el-table-column label="售出数量" width="120">
                  <template slot-scope="scope"
                    >售出数量<br />{{ scope.row.basketCount }}个</template
                  >
                </el-table-column>
                <el-table-column label="剩余可退数量">
                  <template slot-scope="scope"
                    >剩余可退数量<br />{{
                      scope.row.basketList[0].surplusCount
                        ? scope.row.basketList[0].surplusCount
                        : 0
                    }}个</template
                  >
                </el-table-column>
              </el-table>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <span class="dialog-footer-order"
              >已选{{ forData.length || 0 }}种筐子</span
            >
            <el-button @click="selectOrderClose">取 消</el-button>
            <el-button type="primary" @click="selectOrderSubmit"
              >确 定</el-button
            >
          </span>
        </el-dialog>
        <!-- 添加筐子按钮弹窗结束 -->
      </el-scrollbar>
      <div
        style="border-top: 1px solid #e9e9e9; padding: 10px 0px 0px"
        class="flex_dom flex_row_reverse flex_item_mid"
      >
        <el-button type="primary" @click="submitOrders">提交订单</el-button>
        <span
          style="
            color: rgba(1, 6, 33, 0.9);
            font-size: 14px;
            margin-right: 20px;
          "
        >
          金额合计：
          <span style="color: #dd4c4d; font-size: 20px"
            >{{ moneyFormatTwo(totalAmount ? totalAmount : 0) }}元</span
          >
        </span>
      </div>
    </div>

    <!-- 提交订单####################################################### -->
    <div v-if="checkPage">
      <el-scrollbar
        ref="scrollDiv"
        :style="{
          height: $store.getters.screenHeight - 240 + 'px',
        }"
      >
        <div class="block-title">客户信息</div>
        <el-descriptions>
          <el-descriptions-item label="客户姓名">
            <p :class="['userInfo-name', formatClass()]">
              {{ userInfo.toUserName }}
            </p>
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">{{
            userInfo.toPhoneNumber
          }}</el-descriptions-item>
        </el-descriptions>

        <div class="block-title">筐子信息</div>
        <u-table
          class="utable"
          :data="yltableData"
          :border="false"
          show-summary
          :span-method="objectSpanMethod"
          :summary-method="summaryMethod"
        >
          <template slot="empty"> 没有查询到符合条件的记录 </template>
          <u-table-column
            v-for="(item, index) in columns"
            :key="index"
            :prop="item.prop"
            :label="item.label"
            align="left"
            header-align="left"
          >
            <template slot-scope="scope">
              <span v-if="item.prop == 'price' || item.prop == 'sumPrice'">
                {{ scope.row[item.prop] | intervalFormat(false) }}
              </span>
              <span v-else-if="item.prop == 'name'">
                【{{ scope.row.name1 }}】{{ scope.row.name }}
              </span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </u-table-column>
        </u-table>

        <div class="block-title" style="margin-top: 1.25rem">备注</div>
        <div>备注内容: {{ remark }}</div>
      </el-scrollbar>

      <div
        style="border-top: 0.0625rem solid #e9e9e9; padding: 0.625rem 0rem 0rem"
        class="flex_dom flex_row_reverse flex_item_mid"
      >
        <el-button type="primary" @click="summitBack">确认并返回</el-button>
        <el-button
          style="
            color: var(--color-primary);
            border: 0.0625rem solid var(--color-primary);
            margin-right: 1rem;
          "
          >确认并收款</el-button
        >
        <span
          style="
            color: rgba(1, 6, 33, 0.9);
            font-size: 0.875rem;
            margin-right: 1rem;
          "
          >金额合计：<span style="color: #dd4c4d; font-size: 1.25rem"
            >{{ totalAmount | intervalFormat(false) }}元</span
          >
        </span>
      </div>
    </div>
  </PageNoScroll>
</template>

<script>
import { sellBasketOrderDetail } from "@/request/api/frameManage/basketInOut";
import {
  getOrderInfo,
  createOrderBasketReturn,
} from "@/request/api/refundManagement/index.js";
export default {
  name: "backBasketsheet",
  data() {
    return {
      yltableData: [],
      //提交前的页面
      editPage: true,
      //确认页面
      checkPage: false,
      rules: {},
      form: {
        forData2: [],
      },
      // 选择订单弹窗
      selectOrderDialog: false,
      selectBasketDialog: false,
      // 筐子表格loading
      basketLoading: false,
      // 临时存储信息
      forData: [],
      forData2: [],
      tableData: {},
      userInfo: {},
      remark: "",
      tableDataList: [],
      columns: [
        {
          prop: "name",
          label: "筐子种类",
        },
        {
          prop: "color",
          label: "颜色",
        },
        {
          prop: "price",
          label: "单价（元/个）",
        },
        {
          prop: "nums",
          label: "数量（个）",
        },
        {
          prop: "sumPrice",
          label: "金额（元）",
        },
      ],
    };
  },
  computed: {
    basketNum() {
      let obj = [];
      for (let i = 0; i < this.forData2.length; i++) {
        for (let j = 0; j < this.forData2[i].basketList.length; j++) {
          obj.push(
            this.forData2[i].basketList[j].boxBackNum
              ? this.forData2[i].basketList[j].boxBackNum
              : 0
          );
        }
      }
      return eval(obj.join("+"));
    },
    totalAmount() {
      let num = [];
      for (let i = 0; i < this.forData2.length; i++) {
        for (let j = 0; j < this.forData2[i].basketList.length; j++) {
          num.push(
            this.forData2[i].basketList[j].boxBackNum *
              this.forData2[i].basketList[j].boxBackPrice
              ? this.forData2[i].basketList[j].boxBackNum *
                  this.forData2[i].basketList[j].boxBackPrice
              : 0.0
          );
        }
      }
      return eval(num.join("+"));
    },
  },
  methods: {
    getList() {
      sellBasketOrderDetail({
        orderId: this.$route.query.orderId,
      }).then((res) => {
        this.tableData = res.data[0];
        this.userInfo = this.tableData.userInfo[0];
        if (res.data[0].basketDetails.length > 0) {
          let tableData = [];
          let data1 = res.data[0].basketDetails;
          for (let i = 0; i < data1.length; i++) {
            const el = data1[i];
            if (el.basketList.length > 0) {
              let data2 = el.basketList;
              for (let j = 0; j < data2.length; j++) {
                const el1 = data2[j];
                tableData.push({
                  isCol: j == 0 ? el.basketList.length : null,
                  ...el,
                  basketEmptyNumber: el1.basketEmptyNumber, // 当前库存空置数量
                  basketCount: el1.basketCount, // 售出数量
                  basketPrice: el1.basketPrice, // 单价
                  basketTotalPrice: el1.basketTotalPrice, // 金额
                  basketColor: el1.basketColor, // 颜色
                });
              }
            } else {
              tableData.push(el);
            }
          }
          this.tableDataList = tableData;
        }
      });
    },
    formatClass() {
      return "icon4";
    },
    //处理表格中单元格合并
    flitterData(arr) {
      let spanOneArr = [];
      let concatOne = 0;
      arr.forEach((item, index) => {
        if (index === 0) {
          spanOneArr.push(1);
        } else {
          //注意这里的data是表格绑定的字段，根据自己的需求来改
          if (item.id === arr[index - 1].id) {
            //第一列需合并相同内容的判断条件
            spanOneArr[concatOne] += 1;
            spanOneArr.push(0);
          } else {
            spanOneArr.push(1);
            concatOne = index;
          }
        }
      });
      return {
        one: spanOneArr,
      };
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      // 判断哪一列 如果需要处理多了 使用 || 进行处理即可
      if (columnIndex === 0) {
        const _row = this.flitterData(this.yltableData).one[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    // 合计
    summaryMethod({ columns, data }) {
      const means = []; // 合计
      columns.forEach((column, columnIndex) => {
        if (column.property == "color") {
          means.push(
            '<span style="color: rgba(1, 6, 33, 0.9);font-size:1.125rem;font-weight: 700;">' +
              "总计 : " +
              this.forData2.length +
              "种"
          );
        } else {
          if (column.property == "nums" || column.property == "sumPrice") {
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
              if (column.property == "nums") {
                means[columnIndex] =
                  '<span style="color: rgba(1, 6, 33, 0.9);font-size:1.125rem;font-weight: 700;">' +
                  means[columnIndex] +
                  "</span>";
              }

              if (column.property == "sumPrice") {
                means[columnIndex] =
                  '<span style="color: rgba(232, 84, 30, 1);font-size:1.125rem;font-weight: 700;">' +
                  this.$options.filters.intervalFormat(
                    means[columnIndex],
                    false
                  ) +
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
    moneyFormatTwo(moneyStr) {
      // 先将数值取两位小数
      let money = Number(moneyStr)
        .toFixed(2)
        .toString()
        .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      return money;
    },
    selectOrderClose() {
      this.selectOrderDialog = false;
    },
    handleSelectionChange(selection) {
      this.forData = selection;
    },
    selectOrderSubmit() {
      if (this.forData.length <= 0) {
        this.$error("请至少选择一个筐子！");
        return false;
      }
      this.selectBasketDialog = true;
      this.selectOrderDialog = false;
      this.forData2 = this.forData;
      this.form.forData2 = this.forData2;
    },
    submitOrders() {
      if (this.tableDataList.length > 0) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let obj = this.form.forData2;
            let res = [];
            for (let i = 0; i < obj.length; i++) {
              for (let j = 0; j < obj[i].basketList.length; j++) {
                if (
                  obj[i].basketList[j].surplusCount >=
                  obj[i].basketList[j].boxBackNum
                ) {
                  if (
                    obj[i].basketList[j].basketPrice >=
                    obj[i].basketList[j].boxBackPrice
                  ) {
                    res.push({
                      id: obj[i].basketId,
                      name: obj[i].basketName,
                      name1: obj[i].name,
                      color: obj[i].basketColor,
                      price: obj[i].basketList[j].boxBackPrice,
                      nums: obj[i].basketList[j].boxBackNum,
                      sumPrice:
                        obj[i].basketList[j].boxBackNum *
                        this.forData2[i].basketList[j].boxBackPrice,
                    });
                    this.yltableData = res;
                    this.editPage = false;
                    this.checkPage = true;
                  } else {
                    this.$error("填写的退筐单价不可超出购入单价");
                  }
                } else {
                  this.$error("填写的退筐数量不可超出剩余可退数量");
                }
              }
            }
          }
        });
        this.editPage = false;
        this.checkPage = true;
      }
    },
    // 合计
    summaryMethod({ columns, data }) {
      const means = []; // 合计
      columns.forEach((column, columnIndex) => {
        if (column.property == "color") {
          means.push(
            '<span style="color: rgba(1, 6, 33, 0.9);font-size:1.125rem;font-weight: 700;">' +
              "总计 : " +
              this.forData2.length +
              "种"
          );
        } else {
          if (column.property == "nums" || column.property == "sumPrice") {
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
              if (column.property == "nums") {
                means[columnIndex] =
                  '<span style="color: rgba(1, 6, 33, 0.9);font-size:1.125rem;font-weight: 700;">' +
                  means[columnIndex] +
                  "</span>";
              }

              if (column.property == "sumPrice") {
                means[columnIndex] =
                  '<span style="color: rgba(232, 84, 30, 1);font-size:1.125rem;font-weight: 700;">' +
                  this.$options.filters.intervalFormat(
                    means[columnIndex],
                    false
                  ) +
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
    getOrders() {
      this.orderLoading = true;
      this.selectOrderDialog = true;
    },
    remove(index, index2) {
      this.$confirm("是否删除该筐子?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.forData2.splice(index, 1);
          if (this.forData2[0].basketList.length == 0) {
            this.forData2[0].splice(index, 1);
          }
          this.$success("删除成功");
        })
        .catch(() => {});
    },
    //确认并返回
    summitBack() {
      let param = {
        returnToUserId:
          this.userInfo.toUserName + "," + this.userInfo.toPhoneNumber, // 对方userid 非平台"姓名,手机号"
        type: 2, // 1 退还  2 退入
        orderType: this.tableData.orderType, // 1.平台交易订单 2.非平台交易订单
        orderId: 0, // 退筐订单主键id  修改用 不修改传0
        remark: this.remark, //备注   没有传""
        basketTotalCount: this.basketNum, // 退筐数量
        orderBasketId: this.$route.query.orderId, // 购入单订单主键
        orderBasketNo: this.tableData.orderBasketId, // 订单编号
        productTotalCount: this.forData.length, // 退筐种类数量
        orderTotalPrice: this.totalAmount, // 退筐总金额
        basketDetails: [],
      };
      for (let i = 0; i < this.yltableData.length; i++) {
        param.basketDetails.push({
          userBasketId: this.yltableData[i].id, //退筐筐子主键
          userBasketColor: this.yltableData[i].color, //退筐筐子颜色
          userBasketName: this.yltableData[i].name, //退筐筐子名称
          userBasketPrice: this.yltableData[i].price, //退筐筐子单价
          userBasketCount: this.yltableData[i].nums, //退筐筐子数量
          userBasketTotalPrice: this.yltableData[i].sumPrice, // 小计
        });
      }
      createOrderBasketReturn(param).then((res) => {
        setTimeout(() => {
          this.$router.push({
            path: "refundsBasket",
            query: {
              name: "createrefundBasket",
            },
          });
          this.$closePage();
          this.$success("新建成功！");
        }, 3000);
      });
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.block-title {
  margin-bottom: 0.75rem;
  font-size: 1rem;
  color: rgba(1, 6, 33, 0.9);
  font-weight: 600;
}

.userInfo-name {
  display: flex;
  align-items: center;

  &::after {
    content: "";
    display: block;
    width: 0.875rem;
    height: 0.875rem;
    margin-left: 0.3125rem;
  }

  &.icon4::after {
    background: url("../../assets/image/imgs/fei-icon@2x.png") no-repeat center /
      100%;
  }
}

.selectOrder-main {
  display: flex;
  height: 29.25rem;

  .order-left {
    width: 13.75rem;
    height: 100%;
    background-color: #f5f5f5;

    .order-item {
      height: 4.25rem;
      background-color: #cef2ed;
      padding-left: 1.5rem;
      display: flex;
      justify-content: center;
      flex-direction: column;
      cursor: pointer;

      h2 {
        font-size: 0.875rem;
        color: rgba(1, 6, 33, 0.9);
      }

      p {
        font-size: 0.875rem;
        color: rgba(1, 6, 33, 0.55);
      }
    }
  }

  .basket-list {
    flex: 1;
  }
}

.dialog-footer-order {
  color: rgba(1, 6, 33, 0.9);
  font-size: 0.875rem;
  margin-right: 1rem;
}

.basket-list-main {
  .item {
    .item-title {
      font-size: 1rem;
      font-weight: 500;
      color: rgba(1, 6, 33, 0.9);
      margin-top: 1rem;
    }

    .item-child {
      border-bottom: solid 0.0625rem #e9e9e9;
      font-size: 0.875rem;
      color: #010621;
      padding-bottom: 1rem;

      .child-color {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 1rem;

        em {
          color: #e8541e;
          font-style: normal;
          cursor: pointer;
        }
      }

      .child-spec {
        margin-top: 1rem;
        display: flex;

        span {
          width: 33.33%;
        }
      }

      .child-form {
        display: flex;
        margin-top: 1rem;

        .child-form-item {
          width: 33.33%;
          display: flex;
          align-items: center;

          .el-input {
            width: 12.6875rem;
            margin-left: 0.625rem;
          }
        }
      }
    }
  }
}

/deep/ .el-dialog__body {
  padding: 0;
}
</style>

<style lang="scss">
.backBasketsheetModel {
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