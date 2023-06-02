<template>
  <!-- 新建退筐退款单（发出的） -->
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
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="showUserDialog"
          v-if="Object.keys(userInfo).length <= 0"
          >选择用户</el-button
        >
        <el-descriptions v-else>
          <el-descriptions-item label="客户姓名">
            <p :class="['userInfo-name', formatClass()]">
              {{
                userInfo.customUserType == 1
                  ? userInfo.personName
                  : userInfo.cusname
              }}
            </p>
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">{{
            userInfo.customUserType == 1
              ? userInfo.phoneNumber
              : userInfo.phonenumber
          }}</el-descriptions-item>
        </el-descriptions>
        <!-- 选择用户弹窗 -->
        <el-dialog
          title="选择客户"
          :visible.sync="selectUserDialog"
          width="33.625rem"
          @close="selectUserDialogClose"
        >
          <div class="select-user-main" v-loading="userDialogLoading">
            <div class="left-box">
              <div
                :class="['left-item', { active: userType == 1 }]"
                @click="changeUserType(1)"
              >
                平台用户
              </div>
              <div
                :class="['left-item', { active: userType == 2 }]"
                @click="changeUserType(2)"
              >
                非平台用户
              </div>
            </div>
            <div class="user-list">
              <el-table
                :show-header="false"
                :data="userList"
                style="width: 100%"
                @select="handlerSelectUser"
                ref="userListTable"
              >
                <el-table-column type="selection" width="55"> </el-table-column>
                <template v-if="userType == 1">
                  <el-table-column
                    label="用户姓名"
                    width="131"
                    prop="personName"
                  ></el-table-column>
                  <el-table-column
                    label="手机号"
                    prop="phoneNumber"
                  ></el-table-column>
                </template>
                <template v-else>
                  <el-table-column
                    label="用户姓名"
                    width="131"
                    prop="cusname"
                  ></el-table-column>
                  <el-table-column
                    label="手机号"
                    prop="phonenumber"
                  ></el-table-column>
                </template>
              </el-table>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button @click="selectUserDialogClose">取 消</el-button>
            <el-button type="primary" @click="selectUserSubmit"
              >确 定</el-button
            >
          </span>
        </el-dialog>
        <!-- 订单相关 -->
        <div class="block-title" style="margin-top: 1.25rem">购入单信息</div>
        <el-descriptions
          style="margin: 0.9375rem 0rem"
          v-if="Object.keys(realOrderInfo.orderInfo).length > 0"
        >
          <el-descriptions-item label="订单编号">
            {{ realOrderInfo.orderInfo.orderBasketId }}
          </el-descriptions-item>
          <el-descriptions-item label="订单状态">
            {{ realOrderInfo.orderInfo.statusName }}</el-descriptions-item
          >
          <el-descriptions-item label="购入时间">
            {{ realOrderInfo.orderInfo.buyTimestamp | parseTime }}
          </el-descriptions-item>
          <el-descriptions-item label="订单金额">
            {{
              moneyFormatTwo(realOrderInfo.orderInfo.orderTotalPrice)
            }}元</el-descriptions-item
          >
          <el-descriptions-item label="已付金额">
            {{ moneyFormatTwo(realOrderInfo.orderInfo.actualPayPrice) }}元
          </el-descriptions-item>
          <el-descriptions-item label="剩余未付">
            {{
              moneyFormatTwo(realOrderInfo.orderInfoNaNpxainingActualPayPrice)
            }}元</el-descriptions-item
          >
          <el-descriptions-item label="创建时间">
            {{ realOrderInfo.orderInfo.timestamp | parseTime }}
          </el-descriptions-item>
          <el-descriptions-item label="成交时间">
            {{
              realOrderInfo.orderInfo.confirmTimestamp | parseTime
            }}</el-descriptions-item
          >
        </el-descriptions>
        <el-button
          icon="el-icon-plus"
          type="primary"
          :disabled="Object.keys(userInfo).length <= 0"
          @click="getOrders(1)"
          >{{
            Object.keys(realOrderInfo.orderInfo).length > 0 ? "更换" : "选择"
          }}订单</el-button
        >
        <!-- 购入单信息弹窗 -->
        <template>
          <div class="block-title" style="margin-top: 1.25rem">筐子信息</div>
          <div class="font-size: .875rem;color: rgba(1, 6, 33, 0.55)">
            {{
              Object.keys(realOrderInfo.orderInfo).length > 0
                ? ""
                : "请先选择需要退筐的购入单"
            }}
          </div>
          <el-form :model="realOrderInfo" :rules="rules" ref="form" inline>
            <div
              v-if="Object.keys(realOrderInfo.orderInfo).length > 0"
              class="basket-list-main"
            >
              <div
                class="item"
                v-for="(basket, index) in realOrderInfo.basket"
                :key="index"
              >
                <div class="item-title">
                  【{{ basket.basketType }}】{{ basket.basketName }}
                </div>
                <div
                  class="item-child"
                  v-for="(basketItem, indexs) in basket.child"
                  :key="indexs"
                >
                  <div class="child-color">
                    <span>颜色：{{ basketItem.basketColor }}</span>
                    <em
                      @click="
                        remove(basket.basketSystemBasketId, basketItem.uuid)
                      "
                      >移除</em
                    >
                  </div>
                  <div class="child-spec">
                    <span>剩余可退：{{ basketItem.surplusCount }}个</span>
                    <span>筐子单价：{{ basketItem.basketPrice }}元/个</span>
                  </div>
                  <div class="child-form">
                    <div class="child-form-item">
                      <el-form-item
                        label="退筐数量"
                        :prop="
                          'basket.' + index + '.child.' + indexs + '.boxBackNum'
                        "
                        :rules="[
                          {
                            required: true,
                            message: '请输入',
                            trigger: 'blur',
                          },
                        ]"
                      >
                        <el-input v-model="basketItem.boxBackNum">
                          <span slot="append">个</span>
                        </el-input>
                      </el-form-item>
                    </div>
                    <div class="child-form-item">
                      <el-form-item
                        label="退筐单价"
                        :prop="
                          'basket.' +
                          index +
                          '.child.' +
                          indexs +
                          '.boxBackPrice'
                        "
                        :rules="[
                          {
                            required: true,
                            message: '请输入',
                            trigger: 'blur',
                          },
                        ]"
                      >
                        <el-input v-model="basketItem.boxBackPrice">
                          <span slot="append">元/个</span>
                        </el-input>
                      </el-form-item>
                    </div>
                    <div class="child-form-item">
                      <span
                        >金额小计：{{
                          moneyFormatTwo(
                            basketItem.boxBackPrice * basketItem.boxBackNum
                          )
                        }}元</span
                      >
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-form>
          <div v-if="Object.keys(realOrderInfo.orderInfo).length > 0">
            <el-button
              icon="el-icon-plus"
              type="primary"
              @click="getOrders(2)"
              style="margin-top: 1.25rem"
            >
              添加筐子
            </el-button>
            <div class="block-title" style="margin-top: 1.25rem">合计</div>
            <span style="margin-right: 3.75rem"
              >退筐种类：{{ typeLength || 0 }}种</span
            >
            <span style="margin-right: 3.75rem"
              >退筐数量：{{ basketNum || 0 }}个</span
            >
            <span>筐子金额：{{ moneyFormatTwo(totalAmount) }}元</span>
          </div>
        </template>
        <!-- 备注信息 -->
        <div>
          <div class="block-title" style="margin-top: 1.25rem">备注信息</div>
          <el-input
            type="textarea"
            placeholder="请输入"
            v-model="realOrderInfo.orderInfoNaNpxark"
            maxlength="200"
            show-word-limit
            resize="none"
            rows="5"
            style="width: 60%; margin-bottom: 2.5rem"
          >
          </el-input>
        </div>

        <el-dialog
          title="历史购入单"
          :visible.sync="selectOrderDialog"
          width="51rem"
          @close="selectOrderClose"
        >
          <div class="selectOrder-main" v-loading="orderLoading">
            <div class="order-left">
              <!-- 循环卖家订单（弹出框左侧） -->
              <div
                :class="[
                  'order-item',
                  {
                    active: tpOrderInfo.orderInfo.orderId == item.orderId,
                  },
                ]"
                v-for="item in orderList"
                :key="item.orderId"
                @click="changeOrder(item)"
              >
                <h2>
                  {{ item.timestamp | parseTime }}
                </h2>
                <p>购入筐子：{{ item.basketTypeCount }} 种</p>
              </div>
            </div>
            <div class="basket-list">
              <el-table
                :show-header="false"
                :data="basketList"
                style="width: 100%"
                @selection-change="handleSelectionChange"
                ref="myTable"
                v-loading="basketLoading"
              >
                <el-table-column
                  type="selection"
                  width="55"
                  :selectable="selectable"
                >
                </el-table-column>
                <el-table-column
                  label="框子名称"
                  width="120"
                  prop="basketName"
                ></el-table-column>
                <el-table-column
                  label="颜色"
                  width="120"
                  prop="basketColor"
                ></el-table-column>
                <el-table-column label="购入量" width="120">
                  <template slot-scope="scope"
                    >购入量<br />{{ scope.row.vacancyCount }}个</template
                  >
                </el-table-column>
                <el-table-column label="剩余可退数量">
                  <template slot-scope="scope"
                    >剩余可退数量<br />{{ scope.row.surplusCount }}个</template
                  >
                </el-table-column>
              </el-table>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <span class="dialog-footer-order"
              >已选{{ tpOrderInfo.basket.length }}种筐子</span
            >
            <el-button @click="selectOrderClose">取 消</el-button>
            <el-button type="primary" @click="selectOrderSubmit"
              >确 定</el-button
            >
          </span>
        </el-dialog>
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
              {{
                userInfo.customUserType == 1
                  ? userInfo.personName
                  : userInfo.cusname
              }}
            </p>
          </el-descriptions-item>
          <el-descriptions-item label="联系电话">{{
            userInfo.customUserType == 1
              ? userInfo.phoneNumber
              : userInfo.phonenumber
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
                【{{ scope.row.type }}】{{ scope.row.name }}
              </span>
              <span v-else>{{ scope.row[item.prop] }}</span>
            </template>
          </u-table-column>
        </u-table>

        <div class="block-title" style="margin-top: 1.25rem">备注</div>
        <div>备注内容: {{ realOrderInfo.orderInfoNaNpxark }}</div>
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
import md5 from "js-md5";
import {
  getUser,
  getFUser,
  basketReturnOrderList,
  getOrderInfo,
  createOrderBasketReturn,
} from "@/request/api/refundManagement/index.js";

const compareObj = (obj1, obj2) => {
  // 1、两个对象的属性数量如果不一样，那么就肯定不相等
  if (Object.keys(obj1).length != Object.keys(obj2).length) {
    return false;
  }
  // 2、两个对象的属性数量一样
  for (let key in obj1) {
    if (typeof obj1[key] == "object") {
      if (typeof obj2[key] == "object") {
        // 两个属性都是对象。
        if (!key.startsWith("d_") && !compareObj(obj1[key], obj2[key])) {
          return false;
        }
      } else {
        // obj1是对象，obj2不是对象
        return false;
      }
    } else {
      if (typeof obj2[key] == "object") {
        // obj1不是对象，obj2是对象
        return false;
      } else {
        if (!key.startsWith("d_") && obj1[key] != obj2[key]) {
          return false;
        }
      }
    }
  }
  return true;
};
export default {
  name: "createrefundBasket",
  data() {
    return {
      rules: {},
      yltableData: [],
      // 选择用户弹窗
      selectUserDialog: false,
      // 用户列表数据
      userList: [],
      // 用户类型
      userType: 1,
      // 选择用户弹窗loading
      userDialogLoading: false,
      // 选中的用户信息
      tpUserInfo: {},
      // 展示的用户信息
      userInfo: {},
      // 选择订单弹窗
      selectOrderDialog: false,
      // 弹窗类型 1、选择订单，2、添加筐子
      selectOrderDialogType: 1,
      // 订单列表
      orderList: [],
      // 筐子列表
      basketList: [],
      // 订单部分loading
      orderLoading: false,
      // 筐子表格loading
      basketLoading: false,
      // 临时存储信息
      tpOrderInfo: {
        orderInfo: {},
        basket: [],
      },
      // 订单信息
      realOrderInfo: {
        orderInfo: {},
        basket: [],
      },
      //提交前的页面
      editPage: true,
      //确认页面
      checkPage: false,
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
    typeLength() {
      let arr1 = []; //存id
      let newArr = []; //存新数组
      for (let i in this.realOrderInfo.basket) {
        if (
          arr1.indexOf(this.realOrderInfo.basket[i].basketSystemBasketId) ==
            -1 &&
          this.realOrderInfo.basket[i].basketSystemBasketId
        ) {
          arr1.push(this.realOrderInfo.basket[i].basketSystemBasketId);
          newArr.push(this.realOrderInfo.basket[i]);
        }
      }
      return newArr.length;
    },
    basketNum() {
      let obj = [];
      for (let i = 0; i < this.realOrderInfo.basket.length; i++) {
        for (let j = 0; j < this.realOrderInfo.basket[i].child.length; j++) {
          obj.push(
            this.realOrderInfo.basket[i].child[j].boxBackNum
              ? this.realOrderInfo.basket[i].child[j].boxBackNum
              : 0
          );
        }
      }
      return eval(obj.join("+"));
    },
    totalAmount() {
      let num = [];
      for (let i = 0; i < this.realOrderInfo.basket.length; i++) {
        for (let j = 0; j < this.realOrderInfo.basket[i].child.length; j++) {
          num.push(
            this.realOrderInfo.basket[i].child[j].boxBackNum *
              this.realOrderInfo.basket[i].child[j].boxBackPrice
              ? this.realOrderInfo.basket[i].child[j].boxBackNum *
                  this.realOrderInfo.basket[i].child[j].boxBackPrice
              : 0.0
          );
        }
      }
      return eval(num.join("+"));
    },
  },
  methods: {
    //禁选
    selectable(row, index) {
      if (row.surplusCount > 0) {
        return true;
      } else {
        return false;
      }
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
    //处理保留小数点后两位
    moneyFormatTwo(moneyStr) {
      // 先将数值取两位小数
      let money = Number(moneyStr)
        .toFixed(2)
        .toString()
        .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      return money;
    },
    remove(basketSystemBasketId, uuid) {
      this.$confirm("是否删除该筐子?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let index = this.realOrderInfo.basket.findIndex(
            (item) => item.basketSystemBasketId == basketSystemBasketId
          );
          let childItem = this.realOrderInfo.basket[index].child;
          let childIndex = childItem.findIndex((child) => child.uuid == uuid);
          if (childItem.length <= 1) {
            this.realOrderInfo.basket.splice(index, 1);
          } else {
            childItem.splice(childIndex, 1);
          }
          this.$success("删除成功");
        })
        .catch(() => {});
    },
    formatBasketData(data, reset) {
      let arr = [];
      data.map((item) => {
        if (reset) {
          item.boxBackNum = "";
          item.boxBackPrice = "";
        }
        let obj = {
          basketSystemBasketId: item.basketSystemBasketId,
          basketName: item.basketName,
          basketType: item.basketType,
        };
        if (arr.length <= 0) {
          obj.child = [item];
          arr.push(obj);
        } else {
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].basketSystemBasketId == item.basketSystemBasketId) {
              arr[i].child.push(item);
              break;
            } else {
              obj.child = [item];
              arr.push(obj);
              break;
            }
          }
        }
      });
      return arr;
    },
    selectOrderClose() {
      this.selectOrderDialog = false;
      this.basketList = [];
    },
    arrContrast() {
      let arr1 = [],
        arr2 = [];
      this.tpOrderInfo.basket.map((item) => {
        arr1 = arr1.concat(item.child);
      });
      this.realOrderInfo.basket.map((item2) => {
        arr2 = arr2.concat(item2.child);
      });
      arr1.map((item3, index) => {
        let hasItem = arr2.find((child) => child.uuid == item3.uuid);
        if (hasItem) {
          arr1[index] = hasItem;
        }
      });
      this.tpOrderInfo.basket = this.formatBasketData(arr1, false);
    },
    selectOrderSubmit() {
      if (this.tpOrderInfo.basket.length <= 0) {
        this.$error("请至少选择一个筐子！");
        return false;
      }
      if (this.selectOrderDialogType == 2) {
        this.arrContrast();
      }
      this.realOrderInfo = JSON.parse(JSON.stringify(this.tpOrderInfo));
      this.selectOrderDialog = false;
    },
    handleSelectionChange(selection) {
      this.tpOrderInfo.basket = this.formatBasketData(selection, true);
    },
    formatBasketArr(arr) {
      arr.map((item) => {
        let { basketSystemBasketId, basketColor } = item;
        let uuid = basketSystemBasketId.toString() + basketColor;
        item.uuid = md5(uuid);
      });
      return arr;
    },
    changeOrder(item) {
      this.tpOrderInfo.orderInfo = item;
      this.tpOrderInfo.basket = [];
      this.getBasketList();
    },
    getBasketList() {
      const self = this;
      this.basketLoading = true;
      let { orderId } = this.tpOrderInfo.orderInfo;
      getOrderInfo({
        orderId,
      })
        .then((res) => {
          if (res.status === 200) {
            this.tpOrderInfo.orderInfo["statusName"] = res.data[0].statusName;
            this.basketList = this.formatBasketArr(res.data[0].basketInfo);
            self.tpOrderInfo.basket.map((e) => {
              e.child.map((j) => {
                self.basketList.map((n) => {
                  if (j.uuid == n.uuid) {
                    self.$nextTick(() => {
                      self.$refs.myTable.toggleRowSelection(n, true);
                    });
                  }
                });
              });
            });
          }
        })
        .finally(() => {
          this.basketLoading = false;
        });
    },
    getOrders(type) {
      this.orderLoading = true;
      this.selectOrderDialog = true;
      this.selectOrderDialogType = type;
      basketReturnOrderList({
        custmorId: this.userInfo.userId,
      })
        .then((res) => {
          if (res.status == 200) {
            let selectOrder = res.data.filter(
              (order) => order.orderId == this.realOrderInfo.orderInfo.orderId
            );
            this.orderList = type == 1 ? res.data : selectOrder;
            this.tpOrderInfo = {
              orderInfo: selectOrder.length > 0 ? selectOrder[0] : res.data[0],
              basket: JSON.parse(JSON.stringify(this.realOrderInfo.basket)),
            };
            this.getBasketList();
          }
        })
        .finally(() => {
          this.orderLoading = false;
        });
    },
    getUserList(callBack) {
      this.userDialogLoading = true;
      if (this.userType == 1) {
        let res = {
          search: "",
          modelType: 1,
          pageindex: 0,
          pagesize: 0,
        };
        getUser(res)
          .then((resp) => {
            this.userList = resp.data;
            callBack && callBack();
          })
          .finally(() => {
            this.userDialogLoading = false;
          });
      } else {
        let res = {
          cusName: "",
          phoneNumber: "",
          modelType: 1,
        };
        getFUser(res)
          .then((resp) => {
            this.userList = resp.data;
            callBack && callBack();
          })
          .finally(() => {
            this.userDialogLoading = false;
          });
      }
    },
    changeUserType(type) {
      this.userType = type;
      this.getUserList(() => {
        this.setUserTableSelect();
      });
    },
    setUserTableSelect() {
      const self = this;
      self.$nextTick(() => {
        self.userList.map((item, index) => {
          if (self.userType == 1 && self.tpUserInfo.userId == item.userId) {
            self.$refs.userListTable.toggleRowSelection(item, true);
          }
          if (
            self.userType == 2 &&
            self.tpUserInfo.cusname == item.cusname &&
            self.tpUserInfo.phonenumber == item.phonenumber
          ) {
            self.$refs.userListTable.toggleRowSelection(item, true);
          }
        });
      });
    },
    showUserDialog() {
      this.selectUserDialog = true;
      this.getUserList();
    },
    // 用户表格选择事件
    handlerSelectUser(selection, row) {
      this.tpUserInfo = {
        customUserType: this.userType,
        ...row,
      };
      this.$refs.userListTable.clearSelection();
      this.setUserTableSelect();
    },
    selectUserDialogClose() {
      this.selectUserDialog = false;
      this.userType = 1;
      this.tpUserInfo = {};
    },
    selectUserSubmit() {
      if (Object.keys(this.tpUserInfo).length <= 0) {
        this.$error("请选择用户！");
        return false;
      }
      this.selectUserDialog = false;
      this.userInfo = this.deepClone(this.tpUserInfo);
    },
    formatClass() {
      if (this.userInfo.customUserType == 2) {
        return "icon4";
      } else {
        switch (this.userInfo.merchantTypeId) {
          case 1:
            return "icon1";
          case 2:
            return "icon2";
          case 3:
            return "icon3";
        }
      }
    },
    //提交订单
    submitOrders() {
      if (this.userInfo.customUserType) {
        if (this.realOrderInfo.basket.length > 0) {
          this.$refs.form.validate((valid) => {
            if (valid) {
              let obj = this.realOrderInfo.basket;
              let res = [];
              for (let i = 0; i < obj.length; i++) {
                for (let j = 0; j < obj[i].child.length; j++) {
                  if (
                    obj[i].child[j].surplusCount >= obj[i].child[j].boxBackNum
                  ) {
                    if (
                      obj[i].child[j].basketPrice >=
                      obj[i].child[j].boxBackPrice
                    ) {
                      res.push({
                        id: obj[i].child[j].basketSystemBasketId,
                        name: obj[i].child[j].basketName,
                        color: obj[i].child[j].basketColor,
                        price: obj[i].child[j].boxBackPrice,
                        nums: obj[i].child[j].boxBackNum,
                        type: obj[i].child[j].basketType,
                        sumPrice:
                          obj[i].child[j].boxBackNum *
                          obj[i].child[j].boxBackPrice,
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
        } else {
          this.$error("请选择订单");
        }
      } else {
        this.$error("请选择用户");
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
              this.typeLength +
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
    //确认并返回
    summitBack() {
      let param = {
        returnToUserId: this.userInfo.merchantTypeId, // 对方userid 非平台"姓名,手机号"
        type: 1, // 1 退还  2 退入
        orderType: 1, // 1.平台交易订单 2.非平台交易订单
        orderId: 0, // 退筐订单主键id  修改用 不修改传0
        remark: this.realOrderInfo.orderInfoNaNpxark, //备注   没有传""
        basketTotalCount: this.yltableData.boxBackNum, // 退筐数量
        orderBasketId: this.realOrderInfo.orderInfo.orderId, // 购入单订单主键
        orderBasketNo: this.realOrderInfo.orderInfo.orderBasketId, // 订单编号
        productTotalCount: this.typeLength, // 退筐种类数量
        orderTotalPrice: this.totalAmount, // 退筐总金额
        basketDetails: [],
      };
      if (this.userType == 1) {
        param.returnToUserId = this.userInfo.userId;
      } else {
        param.returnToUserId =
          this.userInfo.personName + "," + this.userInfo.phoneNumber;
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
  created() {},
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