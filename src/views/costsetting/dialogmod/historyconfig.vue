<template>
  <!-- 历史配置 -->
  <div class="creditLineDialog">
    <el-dialog
      class="historyconfigClass"
      :title="title"
      :visible.sync="isVisiable"
      :close-on-click-modal="false"
      :before-close="close"
      top="50px"
      width="960px"
    >
      <div class="marginform">
        <div style="margin-bottom: 10px">
          <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
            >年份：</span
          >
          <el-tag
            v-for="(item, index) in model.year_list"
            :key="index"
            :style="{
              color: yearsData == item ? '#0BA198' : 'rgba(1, 6, 33, 0.75)',
              border:
                yearsData == item
                  ? '1px solid #0BA198'
                  : '1px solid rgba(208, 208, 210, 1)',
              background: '#fff',
              cursor: 'pointer',
              'margin-right': '15px',
            }"
            @click="handleyears(item)"
            >{{ item }}年</el-tag
          >
        </div>
        <el-scrollbar
          ref="scrollDiv"
          :style="{
            height: parseInt($store.getters.screenHeight - 450) + 'px',
          }"
        >
          <div
            v-for="(item, key, index) in formData"
            :key="index"
            style="
              margin-bottom: 15px;
              border: 1px solid rgba(233, 233, 233, 1);
              border-bottom: none;
            "
          >
            <div style="padding: 10px; background: rgba(0, 0, 0, 0.04)">
              <span
                style="
                  color: rgba(1, 6, 33, 0.9);
                  font-size: 14px;
                  font-weight: 700;
                  margin-right: 15px;
                "
                >{{ dislodgeZero(key) }}月</span
              ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                >记录数：{{ item.num }}条</span
              >
            </div>
            <div style="padding: 0px">
              <el-collapse
                v-model="collapseName"
                @change="handleChange"
                :accordion="false"
              >
                <el-collapse-item
                  v-for="(item1, index1) in item.info"
                  :key="index1"
                  :name="key + index1"
                  disabled
                >
                  <template slot="title">
                    <div
                      class="flex_dom flex_item_mid flex_item_between"
                      style="width: 100%"
                    >
                      <div>
                        <div>
                          <span
                            style="
                              color: rgba(1, 6, 33, 0.55);
                              font-size: 14px;
                              margin-right: 50px;
                            "
                            >配置日期：<span
                              style="
                                color: rgba(1, 6, 33, 0.9);
                                font-size: 14px;
                              "
                              >{{ formatDate(item1.makedate) }}</span
                            ></span
                          >
                          <span
                            style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                            >配置月份：<span
                              style="
                                color: rgba(1, 6, 33, 0.9);
                                font-size: 14px;
                              "
                              >{{ item1.years }}年({{
                                setMoth(item1.month)
                              }})</span
                            ></span
                          >
                        </div>
                        <div>
                          <span
                            style="
                              color: rgba(1, 6, 33, 0.55);
                              font-size: 14px;
                              margin-right: 50px;
                            "
                            >期望毛利率：<span
                              style="
                                color: rgba(1, 6, 33, 0.9);
                                font-size: 14px;
                              "
                              >{{ item1.GPM }}%</span
                            ></span
                          >
                          <span
                            style="
                              color: rgba(1, 6, 33, 0.55);
                              font-size: 14px;
                              margin-right: 50px;
                            "
                            >商品损耗率：<span
                              style="
                                color: rgba(1, 6, 33, 0.9);
                                font-size: 14px;
                              "
                              >{{ item1.SR }}%</span
                            ></span
                          >
                          <span
                            style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                            >经营固定成本：<span
                              style="
                                color: rgba(1, 6, 33, 0.9);
                                font-size: 14px;
                              "
                              >{{ item1.cost_all }}元</span
                            ></span
                          >
                        </div>
                      </div>
                      <div>
                        <el-button type="text" @click="handleAdd(item1)"
                          >使用配置</el-button
                        >
                        <el-button
                          type="text"
                          @click.stop="
                            show_collapse(key + index1, index, index1, item1)
                          "
                          >{{
                            collapseName == key + index1 ? "收起" : "展开"
                          }}</el-button
                        >
                      </div>
                    </div>
                  </template>
                  <div style="padding: 10px 10px">
                    <div>
                      <el-row>
                        <el-col
                          :span="6"
                          v-for="(item, index) in formData1"
                          :key="index"
                          style="margin-bottom: 10px"
                        >
                          <span
                            style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                            >{{ item.costName }}：<span
                              style="
                                color: rgba(1, 6, 33, 0.9);
                                font-size: 14px;
                              "
                              >{{ item.costMoney }}元</span
                            >
                          </span></el-col
                        >
                      </el-row>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </div>
        </el-scrollbar>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  gethistorycostlist,
  costhistorydetails,
} from "@/request/api/fixedCost/index";

export default {
  name: "historyconfig",
  data() {
    return {
      loading: false,
      title: "",
      isVisiable: false,
      disableSubmit: false,
      model: {},
      collapseName: "",
      formData: [],
      formData1: [],
      yearsList: "",
      yearsData: "",
    };
  },
  methods: {
    add() {},
    edit(record) {
      this.loading = true;
      this.model = Object.assign({}, this.model, record);
      // this.getCurrentTime();
      this.yearsData = this.model.year_list[0];
      this.getList();
    },
    getCurrentTime() {
      //获取当前时间并打印
      var _this = this;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf =
        new Date().getMinutes() < 10
          ? "0" + new Date().getMinutes()
          : new Date().getMinutes();
      let ss =
        new Date().getSeconds() < 10
          ? "0" + new Date().getSeconds()
          : new Date().getSeconds();
      _this.yearsList = yy; //+ "/" + mm + "/" + dd + " " + hh + ":" + mf + ":" + ss;
      _this.yearsData = yy; //+ "/" + mm + "/" + dd + " " + hh + ":" + mf + ":" + ss;
      this.getList();
    },
    handleyears(val) {
      this.yearsData = val;
      this.getList();
    },
    getList() {
      gethistorycostlist({ years: this.yearsData }).then((res) => {
        if (res.status == 200) {
          this.formData = res.data;
        }
      });
    },
    getCosthistorydetails(conf, stat, val) {
      costhistorydetails({ configid: conf.configid }).then((res) => {
        if (res.status == 200) {
          this.formData1 = res.data[0].fixCostList;
          if (stat == 1) {
            setTimeout(() => {
              this.collapseName = val;
            }, 60);
          } else {
            this.$confirm(
              "是否确认选择？确认后修改下方数据将会覆盖之前配置过的该月份的信息",
              "提示",
              {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
              }
            )
              .then(() => {
                this.$emit("submitData", this.formData1);
                this.close();
              })
              .catch(() => {});
          }
        }
      });
    },
    handleChange(val) {
      // console.log(val);
      // console.log(this.collapseName);
    },
    show_collapse(val, index, index1, item1) {
      if (this.collapseName == val) {
        this.collapseName = "";
        this.formData1 = [];
      } else {
        this.getCosthistorydetails(item1, 1, val);
      }
    },
    // 去除0 参数 日期 如 2020-07-08 返回为 2020-7-8
    dislodgeZero(str) {
      let strArray = str.split("-");
      strArray = strArray.map(function (val) {
        if (val[0] == "0") {
          return (val = val.slice(1));
        } else {
          return val;
        }
      });
      return strArray.join("-");
    },
    setMoth(val) {
      let data = [];
      val.forEach((el) => {
        data.push(el + "月");
      });

      return data.join(",");
    },
    // 提交数据
    handleAdd(val) {
      this.getCosthistorydetails(val, 2);
    },
    formatDate(val) {
      var date = new Date(val); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
      var Y = date.getFullYear() + "-";
      var M =
        (date.getMonth() + 1 < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1) + "-";
      var D =
        (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + " ";
      var h = date.getHours() + ":";
      var m = date.getMinutes() + ":";
      var s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    },
    // 关闭事件
    close(val) {
      if (!val) {
        this.$emit("close");
      }
      this.loading = false;
      this.isVisiable = false;
      this.disableSubmit = false;
      this.model = {};
      this.collapseName = "";
      this.formData = [];
      this.formData1 = [];
    },
  },
};
</script>

<style scoped lang="scss">
.creditLineDialog {
  .marginform {
    padding: 10px;
  }
}
</style>

<style lang="scss">
.creditLineDialog {
  .el-dialog__body {
    padding: 0px 0px;
  }

  .el-form-item__label {
    line-height: 0px;
  }
}

.historyconfigClass {
  .el-collapse-item__header {
    padding: 10px;
    line-height: 35px;
    height: 90px;
    border-bottom: 1px solid #e6ebf5;
    cursor: auto !important;
  }
  .el-collapse-item__content {
    padding-bottom: 0px;
  }
  .el-collapse-item__wrap {
    // border: none;
  }
  .el-collapse-item__arrow {
    display: none;
  }

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