<template>
  <PageNoScroll
    :titleRefresh="false"
    :titleBreak="true"
    @handleBreak="handleBreak"
    class="basketLostModel"
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
            选择我的筐子-进当前库存数量后，报失的筐子数量将从进当前库存数量的库存中扣除
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
      <div
        class="flex_dom"
        style="padding-bottom: 20px; border-bottom: 1px solid #e9e9e9"
      >
        <div>
          <div
            style="
              font-size: 20px;
              color: rgba(1, 6, 33, 0.9);
              font-weight: 700;
            "
          >
            {{ basketData.basketName || "&nbsp;" }}
          </div>
          <div
            style="color: rgba(1, 6, 33, 0.9); font-size: 16px; margin-top: 8px"
          >
            <span v-if="form.type == 3">库存数量（载货+空置）：</span>
            <span v-if="form.type == 4">剩余数量：</span>{{ basketNum || 0 }}个
          </div>
        </div>
        <div>
          <div
            style="
              margin-left: 50px;
              color: rgba(1, 6, 33, 0.9);
              font-size: 16px;
            "
          >
            <span v-if="form.type == 3">空置数量：</span>
            <span v-if="form.type == 4">自购筐子剩余数量：</span
            >{{ vacantNum || 0 }}个
          </div>

          <div
            style="
              margin-left: 50px;
              color: rgba(1, 6, 33, 0.9);
              font-size: 16px;
            "
          >
            &nbsp;
          </div>
        </div>
      </div>

      <div style="margin-top: 20px">
        <el-scrollbar
          ref="scrollDiv"
          :style="{
            height: $store.getters.screenHeight - 580 + 'px',
          }"
        >
          <div
            v-for="(item, index) in basketData.modelList"
            :key="index"
            class="flex_dom"
            :style="{
              'padding-top': index == 0 ? '0px' : '20px',
              'border-bottom': '1px solid #E9E9E9',
              'padding-bottom': '25px',
            }"
          >
            <div style="width: 240px">
              <div>{{ item.color }}</div>
              <div
                style="
                  margin-top: 32px;
                  color: rgba(1, 6, 33, 0.55);
                  font-size: 14px;
                "
              >
                <span v-if="form.type == 3">库存数量（载货+空置）：</span>
                <span v-if="form.type == 4">剩余数量：</span
                >{{ item.cargoCount + item.vacantCount }}个
              </div>
            </div>
            <div style="margin-left: 52px">
              <div>
                <span v-if="form.type == 3">空置数量：</span>
                <span v-if="form.type == 4">当前库存空置数量：</span
                >{{ item.vacantCount }}个
              </div>
              <div style="margin-top: 25px" class="flex_dom">
                <div style="margin-top: 5px">报失空置：</div>

                <div>
                  <el-form
                    v-if="item.color == '白色'"
                    :inline="true"
                    ref="formModel"
                    class="marginform"
                    size="mini"
                    :model="formcolor1"
                    :rules="rules"
                  >
                    <el-form-item label=" " prop="overflowCount">
                      <div class="search-form-border" style="width: 100%">
                        <el-input
                          @focus="handleIndex('formcolor1', index)"
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
                      :hide-required-asterisk="false"
                    >
                      <el-input
                        v-model="item1.otherColor"
                        placeholder="请填写筐子颜色"
                        size="small"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label=" " prop="overflowCount">
                      <div class="search-form-border" style="width: 100%">
                        <el-input
                          @focus="handleIndex('formcolor2', index)"
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
                        style="
                          margin-top: 3px;
                          margin-left: 10px;
                          color: #dd4c4d;
                        "
                        @click="handleRemove(index1)"
                        size="mini"
                        type="text"
                        >移除</el-button
                      >
                    </el-form-item>
                  </el-form>

                  <el-button
                    v-if="item.color != '白色'"
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
        <span v-if="form.type == 3">客户筐子</span>
        <span v-if="form.type == 4">我的自购筐子（进当前库存）</span>
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
  name: "basketLost",
  data() {
    var valiOverflowCount = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入报失空置"));
      } else {
        let vacantCount =
          this.basketData.modelList[this.formIndex.index].vacantCount || 0;
        let Num = 0;
        if (this.formIndex.name == "formcolor2") {
          this.formcolor2.forEach((res) => {
            Num += Number(res.overflowCount);
          });
        } else {
          Num = Number(value);
        }
        if (Number(Num) > Number(vacantCount)) {
          let String = "最多可报失" + vacantCount + "个";
          callback(new Error(String));
        } else {
          if (this.basketData.modelList.length == 1) {
            if (this.basketData.modelList[0].color != "白色") {
              for (let i = 0; i < this.$refs.formModel.length; i++) {
                this.$refs.formModel[i].clearValidate();
              }
            }
          } else {
            for (let i = 1; i < this.$refs.formModel.length; i++) {
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
        inventory: 1,
        type: 3,
        textarea: "",
      },
      formcolor1: {},
      formcolor2: [],
      formIndex: {
        name: "",
        index: null,
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
          { required: true, message: "请输入筐子颜色", trigger: "blur" },
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
  computed: {
    basketNum() {
      let num = 0;
      this.basketData.modelList.forEach((res) => {
        num += res.cargoCount + res.vacantCount;
      });
      return num;
    },
    vacantNum() {
      let num = 0;
      this.basketData.modelList.forEach((res) => {
        num += res.vacantCount;
      });
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
          let unshiftNum = null;
          let unshiftData = {};
          for (let i = 0; i < this.basketData.modelList.length; i++) {
            const el = param.modelList[i];
            if (el.color == "白色") {
              this.formcolor1 = {
                overflowCount: null,
              };
              unshiftNum = i;
              unshiftData = this.basketData.modelList[i];
            } else {
              this.formcolor2.push({
                overflowCount: null,
                overflowColor: "",
              });
            }
          }
          if (unshiftNum) {
            this.basketData.modelList.splice(unshiftNum, 1); // 如果数据组存在该元素，则把该元素删除
            this.basketData.modelList.unshift(unshiftData); // 再添加到第一个位置
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
            this.$router.push({ path: "/frameManage/currentInventory" });
          });
      }, 0);
    },
    // 添加
    handleAdd() {
      this.formcolor2.push({
        overflowCount: null,
        overflowColor: "",
        otherColor: "",
      });
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
    handleIndex(name, index) {
      this.formIndex = {
        name: name,
        index: index,
      };
    },
    // 确认添加
    async confirmAdd() {
      if (this.isConfirm == 1) {
        let data = await this.handleValidate();
        if (data) {
          this.tableDataList = [];

          if (this.basketData.modelList.length == 1) {
            if (this.basketData.modelList[0].color == "白色") {
              this.tableDataList.push({
                basketColor: this.basketData.modelList[0].color,
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
          } else {
            this.tableDataList.push({
              basketColor: this.basketData.modelList[0].color,
              overflowCount: this.formcolor1.overflowCount,
              otherColor: this.formcolor1.otherColor
                ? this.formcolor1.otherColor
                : "",
            });
            this.formcolor2.forEach((res) => {
              this.tableDataList.push({
                basketColor: res.overflowColor,
                overflowCount: res.overflowCount,
                otherColor: res.otherColor ? res.otherColor : "",
              });
            });
          }
          this.isConfirm = 2;
        }
      }
    },
    // 确认并查看 确认并返回
    confirmAndView(val) {
      this.$confirm("确认报失筐子?", "提示", {
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
            scrapList: [],
          };

          if (this.basketData.modelList.length == 1) {
            if (this.basketData.modelList[0].color == "白色") {
              param.scrapList.push({
                userBasketId: this.basketData.basketId, // 筐子主键id 必传
                orderTotalPrice: 0, //残余价值 不需要传 0
                basketColor: [
                  {
                    basketColor: this.basketData.modelList[0].color,
                    basketCount: this.formcolor1.overflowCount,
                  },
                ],
              });
            } else {
              param.scrapList.push({
                userBasketId: this.basketData.basketId, // 筐子主键id 必传
                orderTotalPrice: 0, //残余价值 不需要传 0
                basketColor: [],
              });
              this.formcolor2.forEach((res) => {
                param.scrapList[0].basketColor.push({
                  basketColor:
                    res.otherColor == ""
                      ? "彩色-" + res.overflowColor
                      : "彩色-" + res.otherColor,
                  basketCount: res.overflowCount,
                });
              });
            }
          } else {
            param.scrapList.push({
              userBasketId: this.basketData.basketId, // 筐子主键id 必传
              orderTotalPrice: 0, //残余价值 不需要传 0
              basketColor: [
                {
                  basketColor: this.basketData.modelList[0].color,
                  basketCount: this.formcolor1.overflowCount,
                },
              ],
            });
            param.scrapList.push({
              userBasketId: this.basketData.basketId, // 筐子主键id 必传
              orderTotalPrice: 0, //残余价值 不需要传 0
              basketColor: [],
            });
            this.formcolor2.forEach((res) => {
              param.scrapList[1].basketColor.push({
                basketColor:
                  res.otherColor == ""
                    ? "彩色-" + res.overflowColor
                    : "彩色-" + res.otherColor,
                basketCount: res.overflowCount,
              });
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
                      this.$router.push({
                        path: "/frameManage/currentInventory",
                      });
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
  },
  created() {
    this.initData();
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-form-item__label {
  padding: 0 0 0 0;
}
.basketLostModel {
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
.basketLostModel {
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