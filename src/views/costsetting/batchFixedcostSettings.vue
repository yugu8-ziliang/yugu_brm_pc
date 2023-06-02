<template>
  <PageNoScroll class="batchFixedcostSettingsModel">
    <div class="flex_dom flex_item_mid flex_item_between">
      <div>
        <div
          style="
            color: rgba(1, 6, 33, 0.9);
            font-size: 16px;
            margin-bottom: 5px;
            font-weight: 700;
          "
        >
          批量配置成本
        </div>
        <div
          style="
            color: rgba(1, 6, 33, 0.55);
            font-size: 12px;
            margin-bottom: 5px;
          "
        >
          如成本设置为0，当月固定成本即为0
        </div>
      </div>
      <div>
        <el-button
          type="primary"
          size="small"
          @click="
            handleDialog('historyconfig', '历史配置', {
              year_list: tableData.year_list,
            })
          "
          >历史配置</el-button
        >
      </div>
    </div>

    <div style="margin-bottom: 10px">
      <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">年份：</span>
      <el-tag
        v-for="(item, index) in pageData.year_list"
        :key="index"
        :style="{
          color: yearsData[0] == item ? '#0BA198' : 'rgba(1, 6, 33, 0.75)',
          border:
            yearsData[0] == item
              ? '1px solid #0BA198'
              : '1px solid rgba(208, 208, 210, 1)',
          background: '#fff',
          cursor: 'pointer',
          'margin-right': '15px',
        }"
        @click="handleyears(item, index)"
        >{{ item }}年</el-tag
      >
    </div>
    <div style="margin-bottom: 10px" class="flex_dom flex_item_mid">
      <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">月份：</span>
      <el-checkbox
        @change="handleChecked"
        v-model="checked[yearsData[1]]"
        style="margin-right: 15px"
        >全选</el-checkbox
      >

      <div
        v-for="(item, index) in pageData.cost_info"
        :key="index"
        @click="handleSetting(item, index)"
        :style="{
          'margin-right': '15px',
          border: item.is_set
            ? item.is_info
              ? '1px solid #00A499'
              : '1px solid rgba(0, 0, 0, 0.1500)'
            : '1px solid rgba(0, 0, 0, 0.1500)',
          width: '58px',
          height: '48px',
          padding: '5px',
          cursor: item.is_set ? 'pointer' : 'not-allowed',
          background: yearsList[yearsData[1]].month[index]
            ? '#00A499'
            : '#FFFFFF',
        }"
        class="flex_column flex_item_between flex_item_mid"
      >
        <div
          :style="{
            color: item.is_set
              ? yearsList[yearsData[1]].month[index]
                ? '#FFFFFF'
                : item.is_info
                ? '#0BA198'
                : 'rgba(1, 6, 33, 0.7500)'
              : 'rgba(1, 6, 33, 0.3500)',
            'font-size': '14px',
          }"
        >
          {{ item.month }}月
        </div>
        <div
          :style="{
            background: item.is_set
              ? yearsList[yearsData[1]].month[index]
                ? '#FFFFFF'
                : item.is_info
                ? '#0BA198'
                : 'rgba(1, 6, 33, 0.7500)'
              : 'rgba(1, 6, 33, 0.3500)',
            width: '100%',
            height: '2px',
          }"
        ></div>
        <div
          :style="{
            color: item.is_set
              ? yearsList[yearsData[1]].month[index]
                ? '#FFFFFF'
                : item.is_info
                ? '#0BA198'
                : 'rgba(1, 6, 33, 0.7500)'
              : 'rgba(1, 6, 33, 0.3500)',
            'font-size': '14px',
          }"
        >
          {{ item.is_info ? "已配置" : "未配置" }}
        </div>
      </div>
    </div>
    <div style="width: 50%; margin-top: 20px">
      <el-form ref="form" :model="form" label-width="80px" size="mini">
        <div class="flex_dom flex_item_mid">
          <div
            style="
              margin-bottom: 18px;
              color: rgba(1, 6, 33, 0.9);
              font-size: 14px;
            "
          >
            期望毛利率：
          </div>
          <el-form-item label="" label-width="0px">
            <el-input v-model="form.GPM" placeholder="请输入">
              <span slot="append">%</span>
            </el-input>
          </el-form-item>
        </div>
        <div class="flex_dom flex_item_mid">
          <div
            style="
              margin-bottom: 18px;
              color: rgba(1, 6, 33, 0.9);
              font-size: 14px;
            "
          >
            商品损耗率：
          </div>
          <el-form-item label="" label-width="0px">
            <el-input v-model="form.SR" placeholder="请输入">
              <span slot="append">%</span>
            </el-input>
          </el-form-item>
        </div>

        <div class="flex_dom flex_item_mid" style="margin: 10px 0px">
          <div
            style="
              width: 3px;
              height: 14px;
              background: #0ba198;
              margin-right: 5px;
            "
          ></div>
          <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
            >经营固定成本：</span
          ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
            >{{ calculateAmount | intervalFormat() }}元</span
          >
        </div>
        <div style="margin: 10px 0px 10px 0px; width: 400px">
          <div
            class="flex_dom flex_item_mid flex_item_justify_end"
            v-for="(item, index) in info"
            :key="index"
          >
            <div
              style="
                margin-bottom: 18px;
                color: rgba(1, 6, 33, 0.9);
                font-size: 14px;
              "
            >
              {{
                item.costName == "店铺租金" ? "档口(店铺)租金" : item.costName
              }}：
            </div>
            <el-form-item label="" label-width="0px">
              <el-input v-model="item.costMoney" placeholder="请输入">
                <span slot="append">元</span>
              </el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
    </div>
    <div class="page_footer">
      <el-button size="mini" @click="handleCancel">取消</el-button>
      <el-button type="primary" size="mini" @click="handleSubmit"
        >提交</el-button
      >
    </div>
    <historyconfig ref="historyconfig" @submitData="submitData"></historyconfig>
  </PageNoScroll>
</template>

<script>
import historyconfig from "./dialogmod/historyconfig.vue";
import { Base64 } from "js-base64";

import { setcostinfo, getList } from "@/request/api/fixedCost/index";

export default {
  name: "batchFixedcostSettings",
  components: { historyconfig },
  data() {
    return {
      pageData: {},
      form: {
        GPM: "", // 期望毛利率
        SR: "", // 商品损耗率
      },
      tableData: {},
      info: [],
      yearsData: ["", 0],
      yearsList: [], //[{"years": 2021,"month":[11,12]}],
      checked: [],
    };
  },
  computed: {
    calculateAmount() {
      let nums = 0.0;
      for (let i = 0; i < this.info.length; i++) {
        const el = this.info[i];
        if (parseFloat(el.costMoney)) {
          nums += parseFloat(el.costMoney);
        }
      }
      return nums;
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
          this.tableData = param;
          this.yearsData = [this.tableData.years, 0];

          if (this.yearsList[this.yearsData[1]] == undefined) {
            this.yearsList[this.yearsData[1]] = {
              years: this.yearsData[0],
              month: [],
            };
            for (let i = 0; i < 12; i++) {
              this.yearsList[this.yearsData[1]].month.push(false);
            }
          }

          this.getList();
        } catch (error) {}
        return;
      }
    },
    getList() {
      getList({ years: this.yearsData[0] }).then((resp) => {
        this.pageData = resp.data[0];
        this.info = [];
        for (let i = 0; i < this.pageData.cost_info[0].info.length; i++) {
          const el = this.pageData.cost_info[0].info[i];
          this.info.push({
            costId: el.costId,
            costName: el.costName,
            costMoney: el.costMoney,
          });
        }

        if (this.pageData.year_list.length != this.checked.length) {
          this.checked = [];
          for (let i = 0; i < this.pageData.year_list.length; i++) {
            this.checked.push(false);
          }
        }
      });
    },
    handleyears(val, index) {
      this.yearsData = [val, index];

      if (this.yearsList[this.yearsData[1]] == undefined) {
        this.yearsList[this.yearsData[1]] = {
          years: this.yearsData[0],
          month: [],
        };
        for (let i = 0; i < 12; i++) {
          this.yearsList[this.yearsData[1]].month.push(false);
        }
      }

      this.getList();
    },
    handleSetting(val, index) {
      if (val.is_set) {
        if (
          val.is_info &&
          this.yearsList[this.yearsData[1]].month[index] == false
        ) {
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
              if (this.yearsList[this.yearsData[1]] == undefined) {
                this.yearsList[this.yearsData[1]] = {
                  years: this.yearsData[0],
                  month: [],
                };
                for (let i = 0; i < 12; i++) {
                  this.yearsList[this.yearsData[1]].month.push(false);
                }
              }
              if (
                this.yearsList[this.yearsData[1]].month[index] == undefined ||
                this.yearsList[this.yearsData[1]].month[index] == false
              ) {
                this.$set(this.yearsList[this.yearsData[1]].month, index, true);
              } else {
                this.$set(
                  this.yearsList[this.yearsData[1]].month,
                  index,
                  false
                );
              }
              this.$forceUpdate();
            })
            .catch(() => {});
        } else {
          if (this.yearsList[this.yearsData[1]] == undefined) {
            this.yearsList[this.yearsData[1]] = {
              years: this.yearsData[0],
              month: [],
            };
            for (let i = 0; i < 12; i++) {
              this.yearsList[this.yearsData[1]].month.push(false);
            }
          }
          if (
            this.yearsList[this.yearsData[1]].month[index] == undefined ||
            this.yearsList[this.yearsData[1]].month[index] == false
          ) {
            this.$set(this.yearsList[this.yearsData[1]].month, index, true);
          } else {
            this.$set(this.yearsList[this.yearsData[1]].month, index, false);
          }
          this.$forceUpdate();
        }
      }
    },
    handleChecked(val) {
      for (let i = 0; i < this.pageData.cost_info.length; i++) {
        const el = this.pageData.cost_info[i];
        if (el.is_set) {
          this.$set(this.yearsList[this.yearsData[1]].month, i, val);
        }
      }
      this.$forceUpdate();
    },
    // 提交
    handleSubmit() {
      let data = "确认保存配置";
      this.$confirm(data, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(this.yearsList);
          let padamL = [];
          for (let index = 0; index < this.yearsList.length; index++) {
            const el = this.yearsList[index];
            let ps = [];
            el.month.forEach((item, index) => {
              if (item == true) {
                ps.push(index + 1);
              }
            });
            padamL.push({ years: el.years, month: ps });
          }
          let param = {
            timeInfo: padamL, //设置日期
            GPM: this.form.GPM, // 期望毛利率
            SR: this.form.SR, // 商品损耗率
            info: this.info,
          };
          setcostinfo(param).then((res) => {
            if (res.status == 200) {
              this.$success("配置成功");
              this.handleCancel();
            }
          });
        })
        .catch(() => {});
    },
    // 取消
    handleCancel() {
      let path = "/costsetting/fixedCost";
      this.$closePage(path);
    },
    submitData(val) {
      this.info = val;
    },
    handleDialog(form, title, record) {
      this.$refs[form].edit(record);
      this.$refs[form].title = title;
      this.$refs[form].disableSubmit = false;
      this.$refs[form].isVisiable = true;
    },
  },
  created() {},
  //进入页面触发
  beforeRouteEnter(to, form, next) {
    next((vm) => {
      vm.initData();
    });
  },
};
</script>

<style lang="scss" scoped>
.batchFixedcostSettingsModel {
  .page_footer {
    width: 100%;
    text-align: right;
    background-color: #fff;
    border-top: 1px solid #e4e7ed;
    // height: 20px;
    position: fixed;
    bottom: 0px;
    padding: 15px;
    right: 20px;
  }
}
</style>