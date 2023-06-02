<template>
  <PageNoScroll
    :titleRefresh="false"
    :titleBreak="true"
    @handleBreak="handleBreak"
    class="myFrameBasketLostModel"
  >
    <!-- 报失筐子 -->
    <div v-show="isConfirm == 1">
      <div style="padding-bottom: 20px; border-bottom: 1px solid #e9e9e9">
        <div
          style="
            margin-bottom: 20px;
            font-size: 16px;
            color: rgba(1, 6, 33, 0.9);
            font-weight: 700;
          "
        >
          选择库存
        </div>

        <div class="search-form-border" style="width: 300px">
          <span class="search-form-title">选择库存</span>
          <el-select
            v-model="form.inventory"
            placeholder="请选择"
            size="mini"
            style="width: 100%"
          >
            <el-option label="当前库存" :value="1"></el-option>
            <el-option label="我的筐子" :value="2"> </el-option>
          </el-select>
        </div>

        <div style="margin: 15px 0px">
          <el-radio-group v-model="form.type">
            <el-radio :label="3" v-if="form.inventory == 1">客户筐子</el-radio>
            <el-radio :label="4" v-if="form.inventory == 1"
              >我的自购筐子（进当前库存）</el-radio
            >
            <el-radio :label="1" v-if="form.inventory == 2"
              >进入当前库存数量</el-radio
            >
            <el-radio :label="2" v-if="form.inventory == 2"
              >进入历史库存数量</el-radio
            >
          </el-radio-group>
        </div>

        <div style="color: #e8541e; font-size: 14px">
          <div v-if="form.type == 3">
            客户筐子：当前库存中，非添加自购的筐子数量
          </div>
          <div v-if="form.type == 4">
            我的自购筐子：当前库存中 通过添加自购操作进入的筐子
          </div>
          <div v-if="form.type == 1">
            选择我的筐子-进当前库存数量后，报失的筐子数量将从进当前库存数量的库存中扣除
          </div>
          <div v-if="form.type == 2">
            选择我的筐子-进历史库存数量后，报失的筐子数量将从进历史库存数量的库存中扣除
          </div>
        </div>
      </div>

      <div
        style="
          margin-top: 20px;
          margin-bottom: 20px;
          font-size: 16px;
          color: rgba(1, 6, 33, 0.9);
          font-weight: 700;
        "
      >
        筐子信息
      </div>
      <div class="flex_dom flex_item_mid flex_item_between">
        <div class="flex_dom">
          <div>
            <div>
              <span
                style="
                  font-size: 20px;
                  color: rgba(1, 6, 33, 0.9);
                  font-weight: 700;
                "
                >{{ basketData.basketName || "&nbsp;" }}</span
              >
              <span
                style="
                  margin-left: 20px;
                  color: rgba(1, 6, 33, 0.9);
                  font-size: 16px;
                "
                >{{ basketData.basketColor || "&nbsp;" }}</span
              >
            </div>
            <div
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 16px;
                margin-top: 8px;
              "
            >
              <span v-if="form.type == 1"
                >当前库存空置筐子：{{
                  basketData.basketEmptyNumber || 0
                }}个</span
              >
              <span v-if="form.type == 2"
                >剩余数量：{{ basketData.remainingCount || 0 }}个</span
              >
            </div>
          </div>
          <div>
            <div
              :style="{
                'margin-top': form.type == 2 ? '0px' : '3px',
                'margin-left': '50px',
                color: 'rgba(1, 6, 33, 0.9)',
                'font-size': '16px',
              }"
            >
              <span v-if="form.type == 1"
                >剩余数量：{{ basketData.remainingCount || 0 }}个</span
              >
              <span v-else>&nbsp;</span>
            </div>

            <div
              style="
                margin-top: 14px;
                margin-left: 50px;
                color: rgba(1, 6, 33, 0.9);
                font-size: 16px;
              "
            >
              <span v-if="form.type == 2"
                >当前空置：{{ basketData.basketEmptyNumber || 0 }}个</span
              >
              <span v-else>&nbsp;</span>
            </div>
          </div>
        </div>

        <div v-if="form.type == 1">
          <el-button
            style="
              color: var(--color-primary);
              border: 1px solid var(--color-primary);
            "
            @click="handleJumpDetail('addOwnBasket')"
            size="small"
            >添加当前库存筐子</el-button
          >
        </div>
      </div>

      <div style="margin-top: 10px">
        <el-scrollbar
          ref="scrollDiv"
          :style="{
            height: $store.getters.screenHeight - 580 + 'px',
          }"
        >
          <div>
            <div class="flex_dom">
              <div style="margin-top: 5px">报失空置：</div>

              <div>
                <el-form
                  v-if="basketData.basketColor == '白色'"
                  :inline="true"
                  ref="formModel"
                  class="marginform"
                  size="mini"
                  :model="formcolor1"
                  :rules="rules"
                >
                  <!-- <el-form-item label=" " prop="basketColor" v-if="">
                    <div class="search-form-border" style="width: 100%">
                      <el-input
                        v-model="formcolor1.basketColor"
                        placeholder="请输入"
                        size="mini"
                      ></el-input>
                    </div>
                  </el-form-item> -->
                  <el-form-item label=" " prop="overflowCount">
                    <div class="search-form-border" style="width: 100%">
                      <el-input
                        @focus="handleIndex('formcolor1')"
                        v-model="formcolor1.overflowCount"
                        oninput="value=value.replace(/[^\d.]/g,'')"
                        placeholder="请输入"
                        size="mini"
                      ></el-input>
                      <span class="search-form-title-right">个</span>
                    </div>
                  </el-form-item>
                </el-form>

                <el-form
                  v-else
                  :inline="true"
                  ref="formModel"
                  class="marginform"
                  size="mini"
                  v-for="(item1, index1) in formcolor2"
                  :key="index1"
                  :model="item1"
                  :rules="rules"
                  :style="{ 'margin-top': index1 != 0 ? '15px' : '' }"
                >
                  <el-form-item label=" " prop="overflowColor">
                    <div class="search-form-border" style="width: 140px">
                      <el-select
                        v-model="item1.overflowColor"
                        placeholder="请选择或输入"
                        filterable
                        remote
                        :remote-method="
                          (val) => factoryNameRemoteMethod(index1, val)
                        "
                        style="width: 100%"
                      >
                        <el-option
                          v-for="itemOptions in colorOptions"
                          :key="itemOptions.value"
                          :label="itemOptions.label"
                          :value="itemOptions.value"
                        >
                        </el-option>
                      </el-select>
                    </div>
                  </el-form-item>
                  <el-form-item
                    label=" "
                    prop="otherColor"
                    v-if="item1.overflowColor == '其他'"
                  >
                    <div class="search-form-border" style="width: 140px">
                      <el-input
                        v-model="item1.otherColor"
                        placeholder="请输入"
                        size="mini"
                      ></el-input>
                    </div>
                  </el-form-item>
                  <el-form-item label=" " prop="overflowCount">
                    <div class="search-form-border" style="width: 100%">
                      <el-input
                        @focus="handleIndex('formcolor2')"
                        v-model="item1.overflowCount"
                        oninput="value=value.replace(/[^\d.]/g,'')"
                        placeholder="请输入"
                        size="mini"
                      ></el-input>
                      <span class="search-form-title-right">个</span>
                    </div>
                  </el-form-item>

                  <el-form-item label=" " v-if="index1 != 0">
                    <el-button
                      style="margin-top: 3px; margin-left: 10px; color: #dd4c4d"
                      @click="handleRemove(index1)"
                      size="mini"
                      type="text"
                      >移除</el-button
                    >
                  </el-form-item>
                </el-form>

                <el-button
                  v-if="basketData.basketColor != '白色'"
                  style="
                    margin-left: 10px;
                    margin-top: 15px;
                    color: var(--color-primary);
                    border: 1px solid var(--color-primary);
                  "
                  @click="handleAdd()"
                  size="mini"
                  >添加</el-button
                >
              </div>
            </div>
          </div>

          <div
            style="
              margin: 20px 0px 10px;
              color: rgba(1, 6, 33, 0.9);
              font-weight: 700;
            "
          >
            备注信息
          </div>
          <div style="margin-right: 15px; padding-bottom: 20px">
            <el-input
              type="textarea"
              :rows="2"
              placeholder="请输入内容"
              v-model="form.textarea"
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
        报失库存
      </div>
      <div style="font-size: 16px; color: rgba(1, 6, 33, 0.9)">
        使用库存：
        <span v-if="form.type == 1">进当前库存数量</span>
        <span v-if="form.type == 2">进历史库存数量</span>
      </div>

      <div
        style="
          margin-top: 15px;
          margin-bottom: 8px;
          font-size: 16px;
          color: rgba(1, 6, 33, 0.9);
          font-weight: 700;
        "
      >
        筐子信息
      </div>

      <div style="font-size: 16px; color: rgba(1, 6, 33, 0.9)">
        筐子种类：

        <span
          style="color: rgba(1, 6, 33, 0.9); font-size: 16px; font-weight: 700"
          >{{ basketData.basketName || "&nbsp;" }}</span
        >
      </div>
      <div style="margin-top: 20px">
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
            />
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
            <div>{{ form.textarea }}</div>
          </div>
        </el-scrollbar>

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
import { Base64 } from "js-base64";
import { basketScrap } from "@/request/api/frameManage/index";

export default {
  name: "myFrameBasketLost",
  data() {
    var valiOverflowCount = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入报失空置"));
      } else {
        let basketEmptyNumber =
          this.basketData.basketEmptyNumber ||
          this.basketData.remainingCount ||
          0;
        let Num = 0;
        if (this.formIndex.name == "formcolor2") {
          this.formcolor2.forEach((res) => {
            Num += Number(res.overflowCount);
          });
        } else {
          Num = Number(value);
        }
        if (Number(Num) > Number(basketEmptyNumber)) {
          let String = "最多可报失" + basketEmptyNumber + "个";
          callback(new Error(String));
        } else {
          if (this.basketData.basketColor != "白色") {
            for (let i = 0; i < this.$refs.formModel.length; i++) {
              this.$refs.formModel[i].clearValidate();
            }
          }
          callback();
        }
      }
    };
    var valiOverflowColor = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入或选择颜色"));
      } else {
        callback();
      }
    };
    return {
      form: {
        inventory: 2,
        type: 1,
        textarea: "",
      },
      formcolor1: {},
      formcolor2: [],
      formIndex: {
        name: "",
      },
      basketData: {},
      isConfirm: 1,
      colorOptions: [
        {
          value: "红色",
          label: "红色",
        },
        {
          value: "黄色",
          label: "黄色",
        },
        {
          value: "蓝色",
          label: "蓝色",
        },
        {
          value: "绿色",
          label: "绿色",
        },
        {
          value: "黑色",
          label: "黑色",
        },
        {
          value: "灰色",
          label: "灰色",
        },
        {
          value: "其他",
          label: "其他",
        },
      ],
      columns: [
        {
          // width: 200,
          prop: "basketColor",
          label: "报失颜色",
          align: "left",
        },
        {
          // width: 200,
          prop: "overflowCount",
          label: "报失数量（个）",
          align: "left",
        },
      ],
      tableDataList: [],
      rules: {
        otherColor: [
          {
            required: true,
            message: "请输入其他颜色",
            trigger: ["blur", "change"],
          },
        ],
        overflowCount: [
          {
            validator: valiOverflowCount,
            trigger: ["blur", "change"],
          },
        ],
        overflowColor: [
          {
            validator: valiOverflowColor,
            trigger: ["blur", "change"],
          },
        ],
      },
    };
  },
  computed: {},
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
          if (this.basketData.basketColor == "白色") {
            this.formcolor1 = {
              overflowCount: null,
            };
          } else {
            this.formcolor2 = [];
            this.formcolor2.push({
              overflowCount: null,
              overflowColor: "",
            });
          }
        } catch (error) {
          this.handleRouter();
        }
        return;
      }
      this.handleRouter();
    },
    // 跳转
    handleRouter() {
      setTimeout(() => {
        this.$store
          .dispatch("tagsView/delView", {
            path: this.$route.path,
          })
          .then(({ visitedViews }) => {
            this.$router.push({ path: "/frameManage/myFrame" });
          });
      }, 0);
    },
    // 添加
    handleAdd() {
      this.formcolor2.push({ overflowCount: null, overflowColor: "" });
    },
    // 移除
    handleRemove(val) {
      this.$confirm("是否删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.formcolor2.splice(val, 1);
        })
        .catch(() => {});
    },
    factoryNameRemoteMethod(index, val) {
      this.formcolor2[index].overflowColor = val;
    },
    handleIndex(name) {
      this.formIndex = {
        name: name,
      };
    },
    // 确认添加
    async confirmAdd() {
      if (this.isConfirm == 1) {
        let data = await this.handleValidate();
        if (data) {
          this.tableDataList = [];

          if (this.basketData.basketColor == "白色") {
            this.tableDataList.push({
              basketColor: this.basketData.basketColor,
              overflowCount: this.formcolor1.overflowCount,
            });
          } else {
            this.formcolor2.forEach((res) => {
              this.tableDataList.push({
                basketColor: res.overflowColor,
                overflowCount: res.overflowCount,
              });
            });
          }
          this.isConfirm = 2;
        }
      }
    },
    // 确认并查看 确认并返回
    confirmAndView(val) {
      this.$confirm("是否确认报失？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let param = {
            typeView: 2, // 1 报废 2 报失 3 报溢  必传
            type: this.form.type, //见下方
            remark: this.form.textarea, // 备注
            fromUserName: "", //收筐人姓名 不需要传""
            fromUserPhone: "", //收筐人手机号 不需要传 ""
            scrapList: [
              {
                userBasketId: this.basketData.basketId, // 筐子主键id 必传
                orderTotalPrice: 0, //残余价值 不需要传 0
                basketColor: [],
              },
            ],
          };
          for (let i = 0; i < this.tableDataList.length; i++) {
            const el = this.tableDataList[i];
            param.scrapList[0].basketColor.push({
              basketColor: el.basketColor, // 筐子颜色 报溢报失 传 彩色      必传
              otherColor: el.otherColor ? el.otherColor : "",
              basketCount: el.overflowCount,
            });
          }
          basketScrap(param).then((res) => {
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
                      this.$router.push({ path: "/frameManage/myFrame" });
                    });
                } else {
                  // 1 筐子自购单 4 筐子售出单 5 筐子购入单 6 筐子报废单 7 筐子报失单 8 筐子报溢单 10 筐子腾空单 25 自有筐子单 13 退筐退款单 14 退入退款单
                  this.$msgbox.close();
                  this.$router.push({
                    path: "reportlossOrder",
                    query: {
                      basketInOutTypeView: 7,
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
    // 获取多个form验证结果，具体参考第二种form代码
    handleValidate() {
      const list = [];
      const validas = [];
      if (this.basketData.basketColor != "白色") {
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
      } else {
        let item = this.$refs.formModel;
        list.push(
          new Promise((resolve) => {
            item.validate((valida) => {
              validas.push(valida);
              resolve();
            });
          })
        );
      }

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
          if (column.property == "overflowCount") {
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
              if (column.property == "overflowCount") {
                means[columnIndex] =
                  '<span style="color: rgba(1, 6, 33, 0.9);font-size:18px;font-weight: 700;">' +
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
      this.isConfirm = 1;
    },
    // 跳转页面
    handleJumpDetail: function (form, record) {
      this.$router.push({
        path: form,
      });
    },
  },
  created() {
    this.initData();
  },
};
</script>

<style lang="scss" scoped>
.myFrameBasketLostModel {
  .el-form-item {
    margin-bottom: 0px !important;
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
.myFrameBasketLostModel {
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