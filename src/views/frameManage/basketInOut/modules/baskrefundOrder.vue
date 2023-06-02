<template>
  <!-- 退还筐子详情 -->
  <PageNoScroll class="orderDetailsModel">
    <div>
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
                <span class="ordersize">操作人：</span>
                <span class="ordersize">{{ tableData.Operator }}</span>
              </div>
            </template>
            <el-descriptions-item label="订单编号">{{
              tableData.orderBasketReturnId
            }}</el-descriptions-item>
            <el-descriptions-item label="订单状态">
              <font color="#E8541E">{{ tableData.statusName }} </font>
            </el-descriptions-item>
            <el-descriptions-item label="关联购入单编号">{{
              tableData.orderBasketNo
            }}</el-descriptions-item>
            <el-descriptions-item label="订单金额"
              >{{
                moneyFormatTwo(tableData.orderTotalPrice)
              }}元</el-descriptions-item
            >
            <!-- 非平台未结清  平台未结清  平台待收款 -->
            <el-descriptions-item
              v-if="
                (tableData.orderType == 2 && tableData.status == 4) ||
                (tableData.orderType == 1 && tableData.status == 4) ||
                (tableData.orderType == 1 && tableData.status == 3)
              "
              label="已收金额"
              >{{
                moneyFormatTwo(tableData.actualPayPrice)
              }}元</el-descriptions-item
            >
            <!-- 非平台未结清  平台未结清  平台待收款 -->
            <el-descriptions-item
              v-if="
                (tableData.orderType == 2 && tableData.status == 4) ||
                (tableData.orderType == 1 && tableData.status == 4) ||
                (tableData.orderType == 1 && tableData.status == 3)
              "
              label="剩余未收"
              >{{
                moneyFormatTwo(tableData.notreceive)
              }}元</el-descriptions-item
            >
            <!-- 平台待收款 -->
            <el-descriptions-item
              v-if="tableData.orderType == 1 && tableData.status == 3"
              label="本次付款时间"
            >
              {{ tableData.payTimestamp | parseTime }}</el-descriptions-item
            >
            <!-- 平台待收款-->
            <el-descriptions-item
              v-if="tableData.orderType == 1 && tableData.status == 3"
              label="本次待确认金额"
            >
              <font>
                <el-tooltip placement="bottom">
                  <div slot="content" style="padding: 8px 30px 8px 5px">
                    <div>
                      <span style="margin-right: 12px">实际收款</span>
                      <span>{{ moneyFormatTwo(tableData.payPrice) }}元</span>
                    </div>
                    <div>
                      <span style="margin-right: 12px">确认金额</span>
                      <span
                        >{{
                          moneyFormatTwo(tableData.unrecognizedamount)
                        }}元</span
                      >
                    </div>
                    <div>
                      <span style="margin-right: 12px">往来款抵充</span>
                      <span>{{ moneyFormatTwo(tableData.comeInPrice) }}元</span>
                    </div>
                    <div style="margin-top: 16px">
                      <span style="margin-right: 12px">预付款抵扣</span>
                      <span
                        >{{ moneyFormatTwo(tableData.advancePrice) }}元</span
                      >
                    </div>
                    <div style="margin-top: 16px">
                      <span style="margin-right: 12px">借款抵扣</span>
                      <span>{{ moneyFormatTwo(tableData.borrowPrice) }}元</span>
                    </div>
                    <div style="margin-top: 16px">
                      <span style="margin-right: 12px">转账其他抵扣</span>
                      <span
                        >{{
                          moneyFormatTwo(tableData.transferOtherPrice)
                        }}元</span
                      >
                    </div>
                  </div>
                  <el-button
                    style="
                      border: none;
                      background-color: #ffffff;
                      padding: 0px;
                      text-align: left;
                    "
                  >
                    <div>{{ moneyFormatTwo(tableData.allPayPrice) }}元</div>
                  </el-button>
                </el-tooltip>
              </font>
            </el-descriptions-item>
            <el-descriptions-item label="创建时间">{{
              tableData.timestamp | parseTime
            }}</el-descriptions-item>
            <!-- 平台未结清  平台已结清  平台待收款  非平台未结清   非平台已结清-->
            <el-descriptions-item
              v-if="
                (tableData.orderType == 1 && tableData.status == 4) ||
                (tableData.orderType == 1 && tableData.status == 5) ||
                (tableData.orderType == 1 && tableData.status == 3) ||
                (tableData.orderType == 2 && tableData.status == 4) ||
                (tableData.orderType == 2 && tableData.status == 5)
              "
              label="成交时间"
              >{{
                tableData.confirmTimestamp | parseTime
              }}</el-descriptions-item
            >
          </el-descriptions>

          <!-- 按钮 -->
          <!-- 平台待对方付款 -->
          <div
            class="type1-button"
            v-if="tableData.orderType == 1 && tableData.status == 1"
          >
            <el-button
              class="type1-button-right"
              size="small"
              @click="open('withdrawCancellation')"
              >撤回取消</el-button
            >
            <el-button
              size="small"
              type="primary"
              @click="open('withdrawChange')"
              >撤回修改</el-button
            >
          </div>
          <!-- 平台待修改 -->
          <div
            class="type1-button"
            v-if="tableData.orderType == 1 && tableData.status == 2"
          >
            <el-button
              class="type1-button-right"
              size="small"
              @click="open('cancelOrder')"
              >取消订单</el-button
            >
            <el-button size="small" type="primary" @click="open('modifyOrder')"
              >修改订单</el-button
            >
          </div>
          <!-- 非平台未成交 -->
          <div
            class="type1-button"
            v-if="tableData.orderType == 2 && tableData.isConfirm == 0"
          >
            <el-button
              class="type1-button-right"
              size="small"
              @click="open('cancelOrder')"
              >取消订单</el-button
            >
            <el-button
              size="small"
              style="margin-right: 8px"
              type="primary"
              @click="open('modifyOrder')"
              >修改订单
            </el-button>
            <el-button size="small" type="primary">添加收款</el-button>
          </div>
          <!-- 非平台未结清 -->
          <div
            class="type-button"
            v-if="tableData.orderType == 2 && tableData.status == 4"
          >
            <div>
              <span
                class="type-button-left"
                style="cursor: pointer"
                @click="collectionRecord()"
                >收款记录</span
              >
            </div>
            <div>
              <el-button size="small" type="primary">添加收款</el-button>
            </div>
          </div>
          <!-- 非平台已结清   平台已结清 -->
          <div
            class="type-button"
            v-if="
              (tableData.orderType == 2 && tableData.status == 5) ||
              (tableData.orderType == 1 && tableData.status == 5)
            "
          >
            <div>
              <span
                class="type-button-left"
                style="cursor: pointer"
                @click="collectionRecord()"
                >收款记录</span
              >
            </div>
          </div>
          <!-- 平台未结清 -->
          <div
            class="type-button"
            v-if="tableData.orderType == 1 && tableData.status == 4"
          >
            <div>
              <span
                class="type-button-left"
                style="cursor: pointer"
                @click="collectionRecord()"
                >收款记录</span
              >
            </div>
            <div>
              <el-button size="small" type="primary">提醒卖家退款</el-button>
            </div>
          </div>
          <!-- 平台待收款 -->
          <div
            class="type-button"
            v-if="tableData.orderType == 1 && tableData.status == 3"
          >
            <div>
              <span
                class="type-button-left"
                style="cursor: pointer"
                @click="collectionRecord()"
                >收款记录</span
              >
            </div>
            <div>
              <el-button
                size="small"
                class="type-button-right"
                @click="open('returnModify')"
                >退回修改</el-button
              >
              <el-button
                size="small"
                type="primary"
                @click="open('confirmReceipt')"
                >确认收款</el-button
              >
            </div>
          </div>
        </div>

        <div
          style="
            border-top: 1px solid #e9e9e9;
            padding: 10px 0px 0px;
            margin-top: 20px;
          "
        >
          <el-descriptions title="客户信息" style="margin-top: 12px">
            <el-descriptions-item label="客户姓名">
              {{ userInfo.toUserName }}
              <el-image
                v-if="userInfo.orderType == 2"
                :src="urlfei"
                class="img-icon"
              ></el-image>
              <el-image
                v-else-if="userInfo.userType == 3 || userInfo.userType == 4"
                :src="urlcai"
                class="img-icon"
              >
              </el-image>
              <el-image
                v-else-if="userInfo.userType == 10 || userInfo.userType == 11"
                :src="urlgong"
                class="img-icon"
              >
              </el-image>
              <el-image
                v-else-if="userInfo.userType == 6 || userInfo.userType == 7"
                :src="urljing"
                class="img-icon"
              >
              </el-image>
            </el-descriptions-item>
            <el-descriptions-item label="联系电话">{{
              userInfo.toPhoneNumber
            }}</el-descriptions-item>
            <!-- 平台有  非平台个人无 -->
            <el-descriptions-item
              v-if="
                userInfo.userType == 3 ||
                userInfo.userType == 6 ||
                userInfo.userType == 11
              "
              label="企业名称"
              >{{ userInfo.toCompanyName }}</el-descriptions-item
            >
          </el-descriptions>
        </div>

        <div style="margin-top: 18px">
          <div
            style="
              font-size: 16px;
              color: rgba(1, 6, 33, 0.9);
              font-weight: 600;
              margin-bottom: 16px;
            "
          >
            筐子信息
          </div>
          <div class="currentInventory-table">
            <u-table
              ref="plTable"
              class="utable"
              :border="false"
              :header-row-style="{ height: '46px' }"
              :header-cell-style="{
                padding: '0px 0px',
                'font-size': '14px',
                color: 'rgba(1, 6, 33, 0.65)',
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
              :span-method="objectSpanMethod"
              show-summary
              :summary-method="getSummaries"
            >
              <template slot="empty">没有查询到符合条件的记录</template>
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
              >
                <template slot-scope="scope">
                  <span
                    v-if="
                      item.prop == 'userBasketPrice' ||
                      item.prop == 'userBasketTotalPrice'
                    "
                    >{{ moneyFormatTwo(scope.row[item.prop]) }}</span
                  >
                  <span v-else-if="item.prop == 'userBasketName'"
                    >【{{ scope.row.name }}】{{
                      scope.row.userBasketName
                    }}</span
                  >
                  <span v-else>{{ scope.row[item.prop] }}</span>
                </template>
              </u-table-column>
            </u-table>
          </div>
        </div>
        <div style="margin-top: 20px">
          <div
            style="
              font-size: 16px;
              color: rgba(1, 6, 33, 0.9);
              font-weight: 600;
              margin-bottom: 10px;
            "
          >
            备注
          </div>
          <div
            v-for="(remarkitem, remarkindex) in remark"
            :key="'remark' + remarkindex"
          >
            <span class="note-size" style="margin-right: 30px">{{
              remarkitem.createtime | parseTime
            }}</span>
            <span class="note-size">{{ remarkitem.type }}</span>
            <div class="note-size" style="margin-bottom: 30px">
              备注内容：<span
                v-for="(remark2item, remark2index) in remarkitem.remark"
                :key="'remark2index' + remark2index"
                >{{ remark2item }}</span
              >
            </div>
          </div>
        </div>
      </el-scrollbar>
      <!-- 弹框 -->
      <el-dialog :title="modalTitle" :visible.sync="modalShow" width="30%">
        <!-- 取消订单 -->
        <div v-if="btnType === 'cancelOrder'">确认取消订单？</div>
        <!-- 撤回取消 -->
        <div v-else-if="btnType === 'withdrawCancellation'">确认撤回取消？</div>
        <!-- 撤回修改 -->
        <div v-else-if="btnType === 'withdrawChange'">确认撤回修改订单？</div>
        <!-- 修改订单 -->
        <div v-else-if="btnType === 'modifyOrder'">确认修改订单？</div>
        <!-- 确认收款 -->
        <div v-else-if="btnType === 'confirmReceipt'">
          <!-- 合计确认金额 -->
          <div style="margin-bottom: 18px">
            <div class="confirmwindow">
              合计确认金额：{{ moneyFormatTwo(tableData.waitGetPrice) }}元
            </div>
            <div class="confirmwindow1">
              实际收款：{{ moneyFormatTwo(tableData.actualPayment) }}元
            </div>
            <div class="confirmwindow1">
              支付宝：{{ moneyFormatTwo(tableData.payInfo.aliPay) }}元
            </div>
            <div class="confirmwindow1">
              微信：{{ moneyFormatTwo(tableData.payInfo.weChat) }}元
            </div>
            <div>银行卡：{{ moneyFormatTwo(tableData.payInfo.bank) }}元</div>
          </div>
          <div style="margin-bottom: 18px">
            <div class="confirmwindow">
              确认金额：{{ moneyFormatTwo(tableData.confirmAmount) }}元
            </div>
            <div class="confirmwindow1">
              借款抵扣：{{ moneyFormatTwo(tableData.borrowingPrice) }}元
            </div>
            <div>
              往来款抵扣：{{ moneyFormatTwo(tableData.contactsPrice) }}元
            </div>
          </div>
          <div>
            <div class="confirmwindow">请输入收款密码</div>
            <div style="display: flex; justify-content: space-between">
              <div
                style="width: 48px; height: 48px; border: 1px solid #d0d0d2"
              ></div>
              <div
                style="width: 48px; height: 48px; border: 1px solid #d0d0d2"
              ></div>
              <div
                style="width: 48px; height: 48px; border: 1px solid #d0d0d2"
              ></div>
              <div
                style="width: 48px; height: 48px; border: 1px solid #d0d0d2"
              ></div>
              <div
                style="width: 48px; height: 48px; border: 1px solid #d0d0d2"
              ></div>
              <div
                style="
                  width: 48makeSurepx;
                  height: 48px;
                  border: 1px solid #d0d0d2;
                "
              ></div>
            </div>
          </div>
        </div>
        <!-- 退回修改 -->
        <div v-else-if="btnType === 'returnModify'">
          <div style="color: rgba(1, 6, 33, 0.9)">确认退回？</div>
          <div>
            <div style="color: rgba(1, 6, 33, 0.9)">备注信息</div>
            <el-input type="textarea" :rows="3" placeholder="请输入"></el-input>
          </div>
        </div>
        <!-- 待定 -->
        <div v-else>lllllll</div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="modalShow = false">取 消</el-button>
          <el-button type="primary" @click="makeSure('path')">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </PageNoScroll>
</template>

<script>
import { basketReturnDetail } from "@/request/api/frameManage/basketInOut";
export default {
  name: "baskrefundOrder",
  data() {
    return {
      userInfo: {},
      remark: [],
      urljing: require("@/assets/image/imgs/jing-icon.png"),
      urlcai: require("@/assets/image/imgs/cai-icon.png"),
      urlgong: require("@/assets/image/imgs/gong-icon.png"),
      urlfei: require("@/assets/image/imgs/fei-icon.png"),
      typeView: "", // 判断当前是哪种筐子类型
      orderBasketReturnId: this.$route.query.orderId,
      tip: 1,
      tableDataList: [],
      tableData: {},
      columns: [
        {
          prop: "userBasketName",
          label: "筐子种类",
        },
        {
          prop: "userBasketColor",
          label: "颜色",
        },
        {
          prop: "userBasketPrice",
          label: "单价(元/个)",
        },
        {
          prop: "userBasketCount",
          label: "数量(个)",
        },
        {
          prop: "userBasketTotalPrice",
          label: "金额(元)",
        },
      ],
      // 弹框的属性
      btnType: "", // 具体的按钮类型
      modalTitle: "", //  弹框的主题
      modalShow: false, //  弹框的显示与隐藏
    };
  },
  watch: {
    $route: {
      handler: function (val, oldVal) {
        let { basketInOutTypeView, orderId } = val.query;
        if (basketInOutTypeView && orderId) {
          this.typeView = basketInOutTypeView;
          this.orderBasketReturnId = orderId;
        }
        this.getList();
      },
      // 深度观察监听
      // deep: true,
      immediate: true,
    },
  },
  methods: {
    collectionRecord() {
      this.$router.push({
        path: "baskrefundOrderCollectionRecord",
        query: {
          id: this.tableData.orderId,
          ordertype: this.tableData.orderType,
        },
      });
    },
    getList() {
      basketReturnDetail({
        orderBasketReturnId: this.orderBasketReturnId,
        tip: 1,
      }).then((res) => {
        console.log(res);
        this.tableData = res.data[0];
        this.userInfo = res.data[0].userInfo[0];
        this.remark = res.data[0].remark;
        this.tableDataList = res.data[0].basketDetails;
      });
    },
    flitterData(arr) {
      let spanOneArr = [];
      let concatOne = 0;
      arr.forEach((item, index) => {
        if (index === 0) {
          spanOneArr.push(1);
        } else {
          //注意这里的data是表格绑定的字段，根据自己的需求来改
          if (item.userBasketId === arr[index - 1].userBasketId) {
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
        const _row = this.flitterData(this.tableDataList).one[rowIndex];
        const _col = _row > 0 ? 1 : 0;
        return {
          rowspan: _row,
          colspan: _col,
        };
      }
    },
    getSummaries(param) {
      const { columns, data } = param;
      const sums = [];
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] =
            '<span style="color: rgba(1, 6, 33, 0.9);font-size:18px;font-weight: 600;">' +
            "总计：" +
            this.tableData.productTotalCount +
            "种</span>";
          return;
        }
        if (
          column.property == "userBasketCount" ||
          column.property == "userBasketTotalPrice"
        ) {
          const values = data.map((item) => Number(item[column.property]));
          // 合计
          if (!values.every((value) => isNaN(value))) {
            sums[index] = values.reduce((prev, curr) => {
              const value = Number(curr);
              if (!isNaN(value)) {
                return prev + curr;
              } else {
                return prev;
              }
            }, 0);
            if (column.property == "userBasketTotalPrice") {
              sums[index] =
                '<span style="color: #E8541E ;font-size:18px;font-weight: 700;">' +
                this.moneyFormatTwo(sums[index]) +
                "</span>";
            }
            if (column.property == "userBasketCount") {
              sums[index] =
                '<span style="color:rgba(1, 6, 33, 0.9);font-size:18px;font-weight: 700;">' +
                sums[index] +
                "</span>";
            }
          }
        } else {
          sums[index] = "";
        }
      });
      return [sums];
    },
    moneyFormatTwo(moneyStr) {
      // 先将数值取两位小数
      let money = Number(moneyStr)
        .toFixed(2)
        .toString()
        .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      return money;
    },
    // 弹框
    open(btnType) {
      if (
        btnType === "cancelOrder" ||
        btnType === "withdrawCancellation" ||
        btnType === "withdrawChange" ||
        btnType === "modifyOrder" ||
        btnType === "confirmReceipt"
      ) {
        this.modalTitle = "提示";
      }
      if (btnType === "returnModify") {
        this.modalTitle = "退回修改";
      }
      this.btnType = btnType; // 具体的按钮
      this.modalShow = true;
    },
    makeSure(path) {
      // 按钮接口
      if (this.btnType === "modifyOrder") {
        this.$router.push({
          path: "/refundManagement/changerefundBasket",
          query: {
            orderBasketReturnId: this.orderBasketReturnId,
          },
        });
      }
      this.modalShow = false;
      this.modalTitle = "";
    },
  },
  activated() {
    (this.orderBasketReturnId = this.$route.query.orderId), this.getList();
  },
};
</script>

<style lang="scss" scoped>
.orderDetailsModel {
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
}
</style>

<style lang="scss">
.orderDetailsModel {
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