<template>
  <PageNoScroll class="fixedcostSettingsModel">
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
          配置月份：{{ tableData.years }}年{{ tableData.month }}月
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

import { setcostinfo } from "@/request/api/fixedCost/index";

export default {
  name: "fixedcostSettings",
  components: { historyconfig },
  data() {
    return {
      form: {
        GPM: "", // 期望毛利率
        SR: "", // 商品损耗率
      },
      tableData: {},
      info: [],
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
          this.form.GPM = this.tableData.GPM;
          this.form.SR = this.tableData.SR;
          this.info = [];
          for (let i = 0; i < this.tableData.info.length; i++) {
            const el = this.tableData.info[i];
            this.info.push({
              costId: el.costId,
              costName: el.costName,
              costMoney: el.costMoney,
            });
          }
        } catch (error) {}
        return;
      }
    },
    // 提交
    handleSubmit() {
      let data = this.tableData.is_info
        ? "确认保存配置？保存后将覆盖原有数据"
        : "确认保存配置";
      this.$confirm(data, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let param = {
            timeInfo: [
              { years: this.tableData.years, month: [this.tableData.month] },
            ], //设置日期
            GPM: this.form.GPM, // 期望毛利率
            SR: this.form.SR, // 商品损耗率
            info: this.info,
          };
          console.log(param);
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
.fixedcostSettingsModel {
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