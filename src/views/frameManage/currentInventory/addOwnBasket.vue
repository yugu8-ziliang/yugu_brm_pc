<template>
  <PageNoScroll
    :titleRefresh="false"
    :titleBreak="true"
    @handleBreak="handleBreak"
    class="addOwnBasketModel"
  >
    <!-- 添加自有筐子 -->
    <div v-show="isConfirm == 1">
      <div
        style="
          margin-bottom: 8px;
          font-size: 16px;
          color: rgba(1, 6, 33, 0.9);
          font-weight: 700;
        "
      >
        入库原因
      </div>
      <div style="font-size: 16px; color: rgba(1, 6, 33, 0.9)">
        添加类型：自家已有
      </div>

      <div style="margin-top: 20px">
        <div
          style="
            font-size: 16px;
            color: rgba(1, 6, 33, 0.9);
            font-weight: 700;
            margin-bottom: 10px;
          "
        >
          筐子信息
        </div>

        <el-scrollbar
          ref="scrollDiv"
          :style="{
            height: $store.getters.screenHeight - 350 + 'px',
          }"
        >
          <el-form
            label-position="top"
            ref="formModel"
            class="marginform"
            size="mini"
            v-for="(item, index) in forms"
            :key="index"
            :model="item"
            :rules="rules"
          >
            <el-row
              :style="{
                'margin-top': index == 0 ? '' : '25px',
                'padding-bottom': '55px',
                'border-bottom': '1px solid #e9e9e9',
              }"
            >
              <el-col :span="6">
                <el-form-item label="种类" prop="basketId">
                  <el-cascader
                    :show-all-levels="false"
                    style="width: 70%"
                    v-model="item.basketId"
                    :options="tableOptions"
                    :props="cascaderProps"
                    placeholder="请选择"
                    size="small"
                    popper-class="myselect"
                    :popper-append-to-body="false"
                    @change="handleBasket(index)"
                    ref="myCascader"
                  >
                    <template slot-scope="{ node, data }">
                      <div v-if="node.level == 1">{{ data.name }}</div>
                      <div v-else-if="node.level == 2">
                        <div>【{{ data.applytoName }}】{{ data.typeName }}</div>
                        <div>&nbsp; 筐子重量： {{ data.weight }}斤左右</div>
                      </div>
                    </template>
                  </el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="颜色" prop="basketColor">
                  <el-select
                    v-model="item.basketColor"
                    size="small"
                    placeholder="请输入"
                    style="width: 70%"
                  >
                    <el-option label="白色" value="白色"></el-option>
                    <el-option label="彩色" value="彩色"></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="数量" prop="basketCount">
                  <div class="search-form-border" style="width: 70%">
                    <el-input
                      v-model="item.basketCount"
                      oninput="value=value.replace(/[^\d.]/g,'')"
                      placeholder="请输入"
                      size="small"
                    ></el-input>
                    <span class="search-form-title">个</span>
                  </div>
                </el-form-item>
              </el-col>
              <el-col :span="6">
                <el-form-item label="价格" prop="basketPrice">
                  <div class="search-form-border" style="width: 70%">
                    <el-input
                      v-model="item.basketPrice"
                      oninput="value=value.replace(/[^\d.]/g,'')"
                      placeholder="请输入"
                      size="small"
                    ></el-input>
                    <span class="search-form-title">元/个</span>
                  </div>
                </el-form-item>
                <div class="deleteBtn">
                  <el-button
                    style="color: #ff4d4f; font-size: 14px"
                    type="text"
                    @click="deleteBtn(index)"
                    >移除</el-button
                  >
                </div>
                <div class="totleMoney">
                  <span style="font-size: 14px; color: rgba(1, 6, 33, 0.9)"
                    >金额小计：{{
                      (item.basketCount * item.basketPrice)
                        | intervalFormat(false)
                    }}元</span
                  >
                </div>
              </el-col>

              <el-button
                v-if="forms.length == index + 1"
                class="addBtn"
                style="
                  color: var(--color-primary);
                  border: 1px solid var(--color-primary);
                "
                size="small"
                @click="addFrame"
                >添加筐子</el-button
              >
            </el-row>
          </el-form>

          <div style="margin: 20px 0px">合计</div>
          <div
            style="
              margin: 20px 15px 20px 0px;
              padding-bottom: 20px;
              border-bottom: 1px solid #e9e9e9;
            "
          >
            <span style="margin-right: 50px"
              >筐子种类：{{ typeLength || 0 }}种</span
            >
            <span>筐子数量：{{ basketNum || 0 }}个</span>
            <!-- <span style="float: right">金额合计：0.00元</span> -->
          </div>

          <div style="margin: 20px 0px">备注信息</div>
          <div style="margin-right: 15px; padding-bottom: 20px">
            <el-input
              type="textarea"
              :rows="5"
              placeholder="请输入内容"
              v-model="textarea"
            >
            </el-input>
          </div>
        </el-scrollbar>
      </div>

      <div
        style="border-top: 1px solid #e9e9e9; padding: 10px 0px 0px"
        class="flex_dom flex_row_reverse flex_item_mid"
      >
        <el-button type="primary" @click="confirmAdd">提交订单</el-button>
        <span
          style="
            color: rgba(1, 6, 33, 0.9);
            font-size: 14px;
            margin-right: 20px;
          "
          >金额合计：<span style="color: #dd4c4d; font-size: 20px"
            >{{ totalAmount | intervalFormat(false) }}元</span
          ></span
        >
      </div>
    </div>
    <!-- 确认页面 -->
    <div v-if="isConfirm == 2" class="confirmPage">
      <div
        style="
          margin-bottom: 8px;
          font-size: 16px;
          color: rgba(1, 6, 33, 0.9);
          font-weight: 700;
        "
      >
        入库原因
      </div>
      <div style="font-size: 16px; color: rgba(1, 6, 33, 0.9)">
        添加类型：自家已有
      </div>
      <div style="margin-top: 20px">
        <div
          style="
            font-size: 16px;
            color: rgba(1, 6, 33, 0.9);
            font-weight: 700;
            margin-bottom: 10px;
          "
        >
          筐子信息
        </div>
        <el-scrollbar
          :style="{
            height: $store.getters.screenHeight - 350 + 'px',
          }"
        >
          <u-table
            ref="plTable"
            class="utable"
            :max-height="$store.getters.screenHeight - 400 + 'px'"
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
            :span-method="objectSpanMethod"
            show-summary
            :summary-method="summaryMethod"
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
                <span
                  v-if="item.prop == 'basketCount' || item.prop == 'amount'"
                >
                  {{ scope.row[item.prop] | intervalFormat(false) }}
                </span>
                <span v-else>{{ scope.row[item.prop] }}</span>
              </template>
            </u-table-column>
          </u-table>
          <div
            style="
              color: rgba(1, 6, 33, 0.9);
              font-size: 14px;
              margin-top: 20px;
            "
            class="flex_dom"
          >
            <div style="white-space: nowrap">备注：</div>
            <div>{{ textarea }}</div>
          </div>
        </el-scrollbar>

        <div
          style="padding: 10px 0px 0px"
          class="confirmView flex_dom flex_item_mid"
        >
          <span
            style="
              color: rgba(1, 6, 33, 0.9);
              font-size: 14px;
              margin-right: 20px;
            "
            >金额合计：<span style="color: #dd4c4d; font-size: 20px"
              >{{ totalAmount | intervalFormat(false) }}元</span
            ></span
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
import {
  userSystemBasket,
  addUserBasketBuyMyself,
} from "@/request/api/frameManage/index";
import { param } from "@/utils/common";

export default {
  name: "addOwnBasket",
  data() {
    return {
      forms: [
        {
          basketId: [],
          basketName: "",
          typeName: "",
          basketSysteambasketId: "",
          basketColor: "",
          basketCount: "",
          basketPrice: "",
        },
      ],
      textarea: "",
      isConfirm: 1,
      columns: [
        {
          // width: 200,
          prop: "basketName",
          label: "筐子种类",
          align: "left",
        },
        {
          // width: 200,
          prop: "basketColor",
          label: "颜色",
          align: "left",
        },
        {
          // width: 200,
          prop: "basketCount",
          label: "单价（元/个）",
          align: "left",
        },
        {
          // width: 200,
          prop: "basketPrice",
          label: "数量（个）",
          align: "left",
        },
        {
          // width: 200,
          prop: "amount",
          label: "金额（元）",
          align: "left",
        },
      ],
      tableOptions: [],
      tableDataList: [],
      arrLength: 0,
      rules: {
        basketId: [
          {
            required: true,
            message: "请选择种类",
            trigger: ["blur", "change"],
          },
        ],
        basketColor: [
          {
            required: true,
            message: "请选择颜色",
            trigger: ["blur", "change"],
          },
        ],
        basketCount: [
          {
            required: true,
            message: "请输入数量",
            trigger: ["blur", "change"],
          },
        ],
        basketPrice: [
          {
            required: true,
            message: "请输入单价",
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  computed: {
    typeLength() {
      let arr1 = []; //存id
      let newArr = []; //存新数组
      for (let i in this.forms) {
        if (
          arr1.indexOf(this.forms[i].basketSysteambasketId) == -1 &&
          this.forms[i].basketSysteambasketId
        ) {
          arr1.push(this.forms[i].basketSysteambasketId);
          newArr.push(this.forms[i]);
        }
      }
      return newArr.length;
    },
    basketNum() {
      let num = 0;
      for (let i in this.forms) {
        num += Number(this.forms[i].basketCount);
      }
      return num;
    },
    totalAmount() {
      let num = 0;
      for (let i in this.forms) {
        num +=
          Number(this.forms[i].basketCount) * Number(this.forms[i].basketPrice);
      }
      return num;
    },
    // 懒加载
    cascaderProps() {
      return {
        label: "name",
        value: "fatherid",
        children: "children",
        lazy: true,
        // checkStrictly: true,
        lazyLoad: this.lazyLoad,
      };
    },
  },
  methods: {
    getList() {
      let param = {
        type: "0", // 筛选 "0" 为全部  多选逗号隔开   该值 拿 scopelist typeid
        pagesize: 0, // 分页大小， pageindex和pagesize都传0，即不分页
        pageindex: 0, // 页码
      };
      userSystemBasket(param).then((res) => {
        if (res.status == 200) {
          let dataList = res.data[0];
          this.tableOptions = dataList.scopeList;
        }
      });
    },
    // 懒加载 获取通讯地址数据
    lazyLoad(node, resolve) {
      const { level, data } = node;

      if (level == 1) {
        let param = {
          type: data.fatherid.toString(), // 筛选 "0" 为全部  多选逗号隔开   该值 拿 scopelist typeid
          pagesize: 0, // 分页大小， pageindex和pagesize都传0，即不分页
          pageindex: 0, // 页码
        };

        let nodes = [];
        userSystemBasket(param).then((res) => {
          if (res.status == 200) {
            let dataList = res.data[0];
            for (let i = 0; i < dataList.basketList.length; i++) {
              const el = dataList.basketList[i];
              nodes.push({
                ...el,
                name: "【" + el.applytoName + "】" + el.typeName,
                fatherid: this.handleUuid(),
                leaf: true,
              });
            }

            resolve(nodes);
          }
        });
      }
    },
    handleBasket(index) {
      this.forms[index].basketSysteambasketId =
        this.$refs.myCascader[index].getCheckedNodes()[0].data.systeambasketId;
      this.forms[index].basketName =
        this.$refs.myCascader[index].getCheckedNodes()[0].data.name;
      this.forms[index].typeName =
        this.$refs.myCascader[index].getCheckedNodes()[0].data.typeName;
    },
    // 添加筐子
    addFrame() {
      this.forms.push({
        basketId: [],
        basketName: "",
        basketSysteambasketId: "",
        basketColor: "",
        basketCount: "",
        basketPrice: "",
      });

      // 异步获取列表之后
      this.$nextTick(() => {
        //解决滚动条初始化消失的问题
        this.$refs.scrollDiv.update();
      });
    },
    // 删除筐子
    deleteBtn(index) {
      if (this.forms.length > 1) {
        this.$confirm("确认移除该筐子信息?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            this.forms.splice(index, 1);
          })
          .catch(() => {});
      }
    },
    // 确认添加
    async confirmAdd() {
      if (this.isConfirm == 1) {
        let data = await this.handleValidate();
        if (data) {
          this.tableDataList = [];
          this.tableDataList = JSON.parse(JSON.stringify(this.forms));

          this.tableDataList.sort((a, b) => {
            return a.basketSysteambasketId - b.basketSysteambasketId;
          }); //升序

          // 过滤id出来
          let arr1 = []; //存id
          for (let i in this.tableDataList) {
            if (
              arr1.indexOf(this.tableDataList[i].basketSysteambasketId) == -1 &&
              this.tableDataList[i].basketSysteambasketId
            ) {
              arr1.push(this.tableDataList[i].basketSysteambasketId);
            }
          }
          this.arrLength = arr1.length;

          let arrData = [];
          for (let i = 0; i < arr1.length; i++) {
            const el = arr1[i];
            arrData[i] = 0;
            for (let j = 0; j < this.tableDataList.length; j++) {
              const el1 = this.tableDataList[j];
              if (el == el1.basketSysteambasketId) {
                arrData[i] += 1;
              }
            }
          }

          let arrNum = 0;
          for (let i = 0; i < arrData.length; i++) {
            const el = arrData[i];
            if (i == 0) {
              this.tableDataList[0].isCol = el;
            } else {
              this.tableDataList[arrNum].isCol = el;
            }
            arrNum += el;
          }

          this.tableDataList.forEach((res) => {
            res.amount = Number(res.basketCount) * Number(res.basketPrice);
          });
          this.isConfirm = 2;
        }
      }
    },
    // 确认并查看 确认并返回
    confirmAndView(val) {
      let param = {
        type: "3", // 1.我的筐子自购添加当前库存 2.我的筐子自购添加至历史库存 3.当前库存添加自家已有 必填
        remark: this.textarea, // 备注
        basketTotalPrice: 0, // 订单总金额 必填
        factoryName: "", // 厂商姓名 必填
        factoryPhone: "", // 手机号 必填
        buyTimestamp: 0, // 购入时间 必填
        basketList: [],
      };
      let Amount = 0;
      for (let i = 0; i < this.forms.length; i++) {
        const el = this.forms[i];
        param.basketList.push({
          systeambasketId: el.basketSysteambasketId,
          basketName: el.typeName,
          basketColor: el.basketColor,
          basketCount: Number(el.basketCount),
          basketPrice: Number(el.basketPrice),
          basketLength: 0, // 长
          basketHeight: 0, //高
          basketWidth: 0, //宽
          basketWeight: 0, //重量
        });
        Amount +=
          Number(this.forms[i].basketCount) * Number(this.forms[i].basketPrice);
      }
      param.basketTotalPrice = Amount;

      addUserBasketBuyMyself(param).then((res) => {
        if (res.status == 200) {
          this.$msgbox({
            type: "success",
            title: "提示",
            message: "添加成功，等待跳转",
            showClose: false,
            showCancelButton: false,
            showConfirmButton: false,
          }).then((action) => {});

          setTimeout(() => {
            if (val == 2) {
              // Object.assign(this.$data, this.$options.data());
              this.$store
                .dispatch("tagsView/delView", {
                  path: this.$route.path,
                })
                .then(({ visitedViews }) => {
                  this.$msgbox.close();
                  this.$router.push({ path: "/frameManage/currentInventory" });
                });
            } else {
              // 1 筐子自购单 4 筐子售出单 5 筐子购入单 6 筐子报废单 7 筐子报失单 8 筐子报溢单 10 筐子腾空单 25 自有筐子单 13 退筐退款单 14 退入退款单
              this.$msgbox.close();
              this.$router.push({
                path: "ownbasketOrder",
                query: {
                  basketInOutTypeView: 25,
                  orderId: res.data[0],
                },
              });
            }
          }, 3000);
        }
      });
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
    },
    // 合计
    summaryMethod({ columns, data }) {
      const means = []; // 合计
      columns.forEach((column, columnIndex) => {
        if (column.property == "basketName") {
          means.push(
            '<span style="color: rgba(1, 6, 33, 0.9);font-size:18px;font-weight: 700;">' +
              "总计：" +
              this.arrLength +
              "种</span>"
          );
        } else {
          if (column.property == "basketPrice" || column.property == "amount") {
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
              if (column.property == "basketPrice") {
                means[columnIndex] =
                  '<span style="color: rgba(1, 6, 33, 0.9);font-size:18px;font-weight: 700;">' +
                  means[columnIndex] +
                  "</span>";
              }

              if (column.property == "amount") {
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
    // 返回
    handleBreak() {
      this.isConfirm = 1;
    },
    handleUuid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
        /[xy]/g,
        function (c) {
          var r = (Math.random() * 16) | 0,
            v = c == "x" ? r : (r & 0x3) | 0x8;
          return v.toString(16);
        }
      );
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.addOwnBasketModel {
  .marginform {
    margin: 0px 15px 0px 0px;

    .search-form-border {
      display: flex;
      align-items: center;
      border: 1px solid #dcdfe6;
      border-radius: 4px;

      .search-form-title {
        border-left: 1px solid #dcdfe6;
        padding: 0px 8px;
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
  }

  .deleteBtn {
    position: absolute;
    top: 0px;
    right: 0px;
  }
  .addBtn {
    position: absolute;
    bottom: 20px;
    // right: 0px;
    left: 0px;
    margin-top: 15px;
  }
  .totleMoney {
    position: absolute;
    bottom: 20px;
    right: 0px;
  }

  .confirmPage {
    // position: relative;
    .utable {
      width: 100%;
      border-top: 1px solid #e9e9e9;
      border-left: 1px solid #e9e9e9;
      border-right: 1px solid #e9e9e9;
    }
    .confirmView {
      position: absolute;
      bottom: 15px;
      right: 15px;
    }
  }
}
</style>

<style lang="scss">
.addOwnBasketModel {
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

.myselect {
  .el-cascader-menu:last-child {
    .el-cascader-node {
      height: 55px !important;
      line-height: 25px !important;
    }
  }

  .el-cascader-menu:first-child {
    .el-cascader-node {
      height: 34px !important;
      line-height: 34px !important;
    }
  }
}
</style>