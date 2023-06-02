<template>
  <PageNoScroll
    :titleRefresh="false"
    :titleBreak="true"
    @handleBreak="handleBreak"
    class="basketOverflowModel"
  >
    <!-- 报溢筐子 -->
    <div v-show="isConfirm == 1">
      <div
        style="
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
            库存数量（载货+空置）：{{ basketNum || 0 }}个
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
            空置数量：{{ vacantNum || 0 }}个
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
            height: $store.getters.screenHeight - 387 + 'px',
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
                库存数量（载货+空置）：{{
                  item.cargoCount + item.vacantCount
                }}个
              </div>
            </div>
            <div style="margin-left: 52px">
              <div>空置数量：{{ item.vacantCount }}个</div>
              <div style="margin-top: 25px" class="flex_dom flex_item_mid">
                报溢空置：
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
                        v-model="formcolor1.overflowCount"
                        oninput="value=value.replace(/[^\d.]/g,'')"
                        placeholder="请输入"
                        size="small"
                      ></el-input>
                      <span class="search-form-title">个</span>
                    </div>
                  </el-form-item>
                </el-form>
                <el-form
                  v-else
                  :inline="true"
                  ref="formModel"
                  class="marginform"
                  size="mini"
                  :model="formcolor2"
                  :rules="rules"
                >
                  <el-form-item label=" " prop="overflowCount">
                    <div class="search-form-border" style="width: 100%">
                      <el-input
                        v-model="formcolor2.overflowCount"
                        oninput="value=value.replace(/[^\d.]/g,'')"
                        placeholder="请输入"
                        size="small"
                      ></el-input>
                      <span class="search-form-title">个</span>
                    </div>
                  </el-form-item>
                </el-form>
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
        筐子信息
      </div>
      <div style="font-size: 16px; color: rgba(1, 6, 33, 0.9)">
        筐子种类：<span
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
            <div>{{ textarea }}</div>
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
  name: "basketOverflow",
  data() {
    var valiOverflowCount = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入报溢空置"));
      } else {
        callback();
      }
    };
    return {
      textarea: "",
      basketData: {},
      formcolor1: { overflowCount: null },
      formcolor2: { overflowCount: null },
      isConfirm: 1,
      columns: [
        {
          // width: 200,
          prop: "basketColor",
          label: "报溢颜色",
          align: "left",
        },
        {
          // width: 200,
          prop: "overflowCount",
          label: "报溢数量（个）",
          align: "left",
        },
      ],
      tableDataList: [],
      rules: {
        overflowCount: [
          {
            validator: valiOverflowCount,
            message: "请输入报溢空置",
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
              unshiftNum = i;
              unshiftData = el;
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
              this.tableDataList.push({
                basketColor: this.basketData.modelList[0].color,
                overflowCount: this.formcolor2.overflowCount,
              });
            }
          } else {
            this.tableDataList.push({
              basketColor: this.basketData.modelList[0].color,
              overflowCount: this.formcolor1.overflowCount,
            });
            this.tableDataList.push({
              basketColor: this.basketData.modelList[1].color,
              overflowCount: this.formcolor2.overflowCount,
            });
          }
          this.isConfirm = 2;
        }
      }
    },
    // 确认并查看 确认并返回
    confirmAndView(val) {
      let param = {
        typeView: 3, // 1 报废 2 报失 3 报溢  必传
        type: 1, //见下方
        remark: this.textarea, // 备注
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
            basketColor: [
              {
                basketColor: this.basketData.modelList[0].color,
                basketCount: this.formcolor2.overflowCount,
              },
            ],
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
          basketColor: [
            {
              basketColor: this.basketData.modelList[1].color,
              basketCount: this.formcolor2.overflowCount,
            },
          ],
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
                  this.$router.push({ path: "/frameManage/currentInventory" });
                });
            } else {
              // 1 筐子自购单 4 筐子售出单 5 筐子购入单 6 筐子报废单 7 筐子报失单 8 筐子报溢单 10 筐子腾空单 25 自有筐子单 13 退筐退款单 14 退入退款单
              this.$msgbox.close();
              this.$router.push({
                path: "overflowOrder",
                query: {
                  basketInOutTypeView: 8,
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
.basketOverflowModel {
  .el-form-item {
    margin-bottom: 0px !important;
  }

  .search-form-border {
    display: flex;
    align-items: center;
    border: 1px solid #dcdfe6;
    border-radius: 4px;

    .search-form-title {
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
.basketOverflowModel {
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