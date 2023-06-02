<template>
  <!-- 修改退还筐子单 -->
  <PageNoScroll>
    <div v-if="editPage">
      <el-scrollbar
        ref="scrollDiv"
        :style="{
          height: $store.getters.screenHeight - 240 + 'px',
        }"
      >
        <!-- 客户信息及弹窗 -->
        <div class="block-title">客户信息</div>
        <el-descriptions>
          <el-descriptions-item label="客户姓名">
            <p :class="['userInfo-name', formatClass()]">
              {{ tableData.fromUserName }}
            </p>
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">{{
            tableData.fromUserPhone
          }}</el-descriptions-item>
          <el-descriptions-item label="企业名称">{{
            tableData.companyName
          }}</el-descriptions-item>
        </el-descriptions>

        <!-- 购入单信息 -->
        <div class="block-title" style="margin-top: 1.25rem">购入单信息</div>
        <el-descriptions style="margin: 0.9375rem 0rem">
          <el-descriptions-item label="订单编号">
            {{ tableData.orderBasketReturnId }}
          </el-descriptions-item>
          <el-descriptions-item label="订单状态">
            <font color="#E8541E">{{ tableData.statusName }} </font>
          </el-descriptions-item>
          <el-descriptions-item label="购入时间">
            {{ tableData.payTimestamp | parseTime }}
          </el-descriptions-item>
          <el-descriptions-item label="订单金额">
            {{
              moneyFormatTwo(tableData.orderTotalPrice)
            }}元</el-descriptions-item
          >
          <el-descriptions-item label="已付金额">
            {{ moneyFormatTwo(tableData.actualPayPrice) }}元
          </el-descriptions-item>
          <el-descriptions-item label="剩余未付">
            {{ moneyFormatTwo(tableData.notreceive) }}元</el-descriptions-item
          >
          <el-descriptions-item label="创建时间">
            {{ tableData.timestamp | parseTime }}
          </el-descriptions-item>
          <el-descriptions-item label="成交时间">
            {{ tableData.confirmTimestamp | parseTime }}</el-descriptions-item
          >
        </el-descriptions>

        <!-- 筐子信息 -->
        <div class="block-title" style="margin-top: 1.25rem">筐子信息</div>
        <el-form :model="realOrderInfo" :rules="rules" ref="form" inline>
          <div class="basket-list-main">
            <div
              class="item"
              v-for="(item, index) in tableDataList"
              :key="index"
            >
              <div class="item-title">
                【{{ item.name }}】{{ item.userBasketName }}
              </div>
              <div class="item-child">
                <div class="child-color">
                  <span>颜色：{{ item.userBasketColor }}</span>
                  <em @click="remove(index)">移除</em>
                </div>
                <div class="child-spec">
                  <span>剩余可退：{{ item.surplusCount }}个</span>
                  <span>筐子单价：{{ item.basketPrice }}元/个</span>
                </div>
                <div class="child-form">
                  <div class="child-form-item">
                    <el-form-item
                      label="退筐数量"
                      :rules="[
                        { required: true, message: '请输入', trigger: 'blur' },
                      ]"
                    >
                      <el-input v-model="item.userBasketCount">
                        <span slot="append">个</span>
                      </el-input>
                    </el-form-item>
                  </div>
                  <div class="child-form-item">
                    <el-form-item
                      label="退筐单价"
                      :rules="[
                        { required: true, message: '请输入', trigger: 'blur' },
                      ]"
                    >
                      <el-input v-model="item.userBasketPrice">
                        <span slot="append">元/个</span>
                      </el-input>
                    </el-form-item>
                  </div>
                  <div class="child-form-item">
                    <span
                      >金额小计：{{
                        moneyFormatTwo(
                          item.userBasketPrice * item.userBasketCount
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
          <el-button
            icon="el-icon-plus"
            type="primary"
            style="margin-top: 0.75rem"
          >
            添加筐子
          </el-button>
          <div class="block-title" style="margin-top: 1.25rem">合计</div>
          <span style="margin-right: 3.75rem"
            >退筐种类：{{ tableDataList.length || 0 }}种</span
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
            v-model="form.NaNpxark"
            maxlength="200"
            show-word-limit
            resize="none"
            rows="5"
            style="width: 60%; margin-bottom: 2.5rem"
          >
          </el-input>
        </div>
      </el-scrollbar>

      <div class="flex_dom flex_row_reverse flex_item_mid page-footer">
        <el-button type="primary" @click="submitOrders">提交订单</el-button>
        <span class="dialog-footer-order"
          >金额合计：<span style="color: #dd4c4d; font-size: 1.25rem"
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
              {{ tableData.fromUserName }}
            </p>
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">{{
            tableData.fromUserPhone
          }}</el-descriptions-item>
          <el-descriptions-item label="企业名称">{{
            tableData.companyName
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
                【{{ scope.row.name }}】{{ scope.row.name1 }}
              </span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </u-table-column>
        </u-table>

        <div class="block-title" style="margin-top: 1.25rem">备注</div>
        <div>备注内容: {{ form.NaNpxark }}</div>
      </el-scrollbar>

      <div
        style="border-top: 0.0625rem solid #e9e9e9; padding: 0.625rem 0rem 0rem"
        class="flex_dom flex_row_reverse flex_item_mid"
      >
        <el-button type="primary" @click="summitBack">确认</el-button>
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
import { basketReturnDetail } from "@/request/api/frameManage/basketInOut";
import { createOrderBasketReturn } from "@/request/api/refundManagement/index.js";
export default {
  name: "changerefundBasket",
  data() {
    return {
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
      //确认页面
      checkPage: false,
      //提交前的页面
      editPage: true,
      rules: {},
      realOrderInfo: {},
      tableData: {},
      userInfo: {},
      remark: [],
      tableDataList: [],
      form: {
        returnToUserId: this.$route.query.returnUserId, //对方userid非平台"姓名,手机号"
        type: 1, // 1 退还  2 退入
        orderType: this.$route.query.orderType, // 1.平台交易订单 2.非平台交易订单
        orderId: this.$route.query.orderId, // 退筐订单主键id  修改用 不修改传0
        remark: this.$route.queryNaNpxark, //备注   没有传""
        basketTotalCount: this.$route.query.basketTotalCount, // 退筐数量
        orderBasketId: this.$route.query.orderBasketId, // 购入单订单主键
        orderBasketNo: this.$route.query.orderBasketNo, // 订单编号
        productTotalCount: this.$route.query.productTotalCount, // 退筐种类数量
        orderTotalPrice: this.$route.query.orderTotalPrice, // 退筐总金额
        basketDetails: this.$route.query.basketDetails,
      },
    };
  },
  computed: {
    basketNum() {
      let obj = [];
      for (let i = 0; i < this.tableDataList.length; i++) {
        obj.push(this.tableDataList[i].userBasketCount);
      }
      return eval(obj.join("+"));
    },
    totalAmount() {
      let num = [];
      for (let i = 0; i < this.tableDataList.length; i++) {
        num.push(
          this.tableDataList[i].userBasketCount *
            this.tableDataList[i].userBasketPrice
            ? this.tableDataList[i].userBasketCount *
                this.tableDataList[i].userBasketPrice
            : 0.0
        );
      }
      return eval(num.join("+"));
    },
  },
  methods: {
    getList() {
      basketReturnDetail({
        orderBasketReturnId: this.$route.query.orderBasketReturnId,
        tip: 1,
      }).then((res) => {
        this.tableData = res.data[0];
        this.userInfo = res.data[0].userInfo[0];
        this.NaNpxark = res.data[0].NaNpxark;
        this.tableDataList = res.data[0].basketDetails;
      });
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
    moneyFormatTwo(moneyStr) {
      // 先将数值取两位小数
      let money = Number(moneyStr)
        .toFixed(2)
        .toString()
        .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      return money;
    },
    // 合计
    summaryMethod({ columns, data }) {
      const means = []; // 合计
      columns.forEach((column, columnIndex) => {
        if (column.property == "color") {
          means.push(
            '<span style="color: rgba(1, 6, 33, 0.9);font-size:18px;font-weight: 700;">' +
              "总计 : " +
              this.tableDataList.length +
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
                  '<span style="color: rgba(1, 6, 33, 0.9);font-size:18px;font-weight: 700;">' +
                  means[columnIndex] +
                  "</span>";
              }

              if (column.property == "sumPrice") {
                means[columnIndex] =
                  '<span style="color: rgba(232, 84, 30, 1);font-size:18px;font-weight: 700;">' +
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
    remove(val) {
      this.$confirm("是否删除该筐子?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.tableDataList.splice(val, 1);
          this.$success("删除成功");
        })
        .catch(() => {});
    },
    submitOrders() {
      if (this.tableDataList.length > 0) {
        this.$refs.form.validate((valid) => {
          if (valid) {
            let obj = this.tableDataList;
            let res = [];
            for (let i = 0; i < obj.length; i++) {
              if (obj[i].surplusCount >= obj[i].userBasketCount) {
                if (obj[i].userBasketPrice <= obj[i].basketPrice) {
                  res.push({
                    id: obj[i].userBasketId,
                    name1: obj[i].userBasketName,
                    name: obj[i].name,
                    color: obj[i].userBasketColor,
                    price: obj[i].userBasketPrice,
                    nums: obj[i].userBasketCount,
                    sumPrice: obj[i].userBasketCount * obj[i].userBasketPrice,
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
        });
      }
    },
    //确认
    summitBack() {
      let param = {
        returnToUserId: this.tableData.returnUserId,
        type: 1,
        orderType: this.tableData.orderType,
        orderId: this.tableData.orderId,
        remark: this.form.NaNpxark,
        basketTotalCount: this.tableData.userBasketCount,
        orderBasketId: this.tableData.orderBasketId,
        orderBasketNo: this.tableData.orderBasketNo,
        productTotalCount: this.tableData.productTotalCount,
        orderTotalPrice: this.tableData.orderTotalPrice,
        basketDetails: [],
      };
      if (this.userInfo.orderType == 1) {
        param.returnToUserId = this.tableData.returnUserId;
      } else {
        param.returnToUserId =
          this.tableData.fromUserName + "," + this.tableData.fromUserPhone;
      }
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
        this.$router.push({
          path: "refundsBasket",
          query: {
            name: "changerefundBasket",
          },
        });
        this.statusName = "待对方付款";
        this.$closePage();
        this.$success("修改成功！");
      });
    },
    formatClass() {
      if (this.userInfo.orderType == 2) {
        return "icon4";
      } else {
        switch (this.userInfo.orderType) {
          case 1:
            return "icon1";
          case 2:
            return "icon2";
          case 3:
            return "icon3";
        }
      }
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.utable {
  width: 100%;
  border-top: 0.0625rem solid #e9e9e9;
  border-left: 0.0625rem solid #e9e9e9;
  border-right: 0.0625rem solid #e9e9e9;
}

.confirmView {
  position: absolute;
  bottom: 0.9375rem;
  right: 0.9375rem;
}

.page-footer {
  border-top: 0.0625rem solid #e9e9e9;
  padding: 0.625rem 0rem 0rem;
}

.dialog-footer-order {
  color: rgba(1, 6, 33, 0.9);
  font-size: 0.875rem;
  margin-right: 1rem;
}

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

  &.icon1::after {
    background: url("../../assets/image/imgs/jing-icon@2x.png") no-repeat center /
      100%;
  }

  &.icon2::after {
    background: url("../../assets/image/imgs/cai-icon@2x.png") no-repeat center /
      100%;
  }

  &.icon3::after {
    background: url("../../assets/image/imgs/gong-icon@2x.png") no-repeat center /
      100%;
  }

  &.icon4::after {
    background: url("../../assets/image/imgs/fei-icon@2x.png") no-repeat center /
      100%;
  }
}

/deep/ .el-dialog__body {
  padding: 0;
}

.select-user-main {
  display: flex;
  height: 19.75rem;

  .left-box {
    width: 13.75rem;
    height: 100%;
    background-color: #f5f5f5;
    overflow: hidden;
    overflow-y: auto;

    .left-item {
      height: 2.75rem;
      display: flex;
      align-items: center;
      padding-left: 1.5rem;
      font-size: 0.875rem;
      font-weight: 400;
      color: rgba(1, 6, 33, 0.9);
      background-color: #fff;
      cursor: pointer;

      &:hover,
      &.active {
        background-color: #cef2ed;
      }
    }
  }

  .user-list {
    flex: 1;
    background: #fff;
    overflow-y: auto;
  }
}

/deep/ .el-dialog__footer {
  border-top: solid 0.0625rem #ddd;
  padding: 1.25rem;
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
      background-color: #fff;
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

      &:hover,
      &.active {
        background-color: #cef2ed;
      }
    }
  }

  .basket-list {
    flex: 1;
  }
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
</style>
<style lang="scss">
.el-date-editor .el-input__prefix {
  display: none !important;
}

.el-input--prefix .el-input__inner {
  padding-left: 0.9375rem;
}

.el-scrollbar {
  .el-scrollbar__wrap {
    margin-bottom: 0rem !important;
    overflow-x: hidden;

    .el-scrollbar__view {
      // height: var(--screenHeight) !important;
      position: relative;
      padding: 0rem !important;
    }
  }
}
</style>