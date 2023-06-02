<template>
  <!-- 赊账授信 -->
  <Table-Page
    title="赊账授信"
    :page-size="queryData.pagesize"
    :total="queryData.total"
    :page-num="queryData.pageindex"
    @pagination="handlePagination"
  >
    <el-header style="height: 160px">
      <el-descriptions
        class="margin-top font_sty_1"
        :column="6"
        direction="vertical"
        :colon="false"
      >
        <el-descriptions-item label="赊账总授信(元)"
          ><font class="font_sty_2">{{
            currencyFormat(tableData.allAmountCredit)
          }}</font></el-descriptions-item
        >
        <el-descriptions-item label="已用授信(元)"
          ><font class="font_sty_2">{{
            currencyFormat(tableData.allAmountCreditUsed)
          }}</font></el-descriptions-item
        >
        <el-descriptions-item label="3天内到期金额(元)"
          ><font class="font_sty_2">{{
            currencyFormat(tableData.allExpireMoney)
          }}</font></el-descriptions-item
        >
        <el-descriptions-item label="逾期金额(元)"
          ><font class="font_sty_2" style="color: red">{{
            currencyFormat(tableData.allOverdueMoney)
          }}</font></el-descriptions-item
        >
      </el-descriptions>
      <el-divider></el-divider>
      <el-input
        style="width: 20%; margin-right: 20px"
        placeholder="请输入客户姓名/联系电话/企业名称"
        prefix-icon="el-icon-search"
        v-model="queryData.search"
      >
      </el-input>
      <el-button @click="Reset">重置</el-button>
      <el-button style="background-color: #0ba198; color: #fff" @click="Query"
        >搜索</el-button
      >
      <el-divider></el-divider>
    </el-header>
    <el-main>
      <el-table
        :data="tableData.modelList"
        :loading="loading"
        :height="$store.getters.screenHeight - 430 + 'px'"
        style="
          border-left: 1px solid #e9e9e9;
          border-right: 1px solid #e9e9e9;
          border-top: 1px solid #e9e9e9;
        "
      >
        <el-table-column label="客户姓名">
          <template slot-scope="scope">
            {{ scope.row.personName }}
            <el-tag type="success" v-if="scope.row.merchantType == 3"
              >供</el-tag
            >
            <el-tag v-if="scope.row.merchantType == 1">经</el-tag>
            <el-tag type="warning" v-if="scope.row.merchantType == 2"
              >采</el-tag
            > </template
          >-
        </el-table-column>
        <el-table-column label="联系电话" prop="phoneNumber"></el-table-column>
        <el-table-column label="企业名称" prop="companyName"></el-table-column>
        <el-table-column label="赊账总授信(元)" align="right">
          <template slot-scope="scope">
            {{ currencyFormat(scope.row.amountCredit) }}
          </template>
        </el-table-column>
        <el-table-column label="已用授信(元)" align="right" sortable>
          <template slot-scope="scope">
            {{ currencyFormat(scope.row.amountCreditUsed) }}
          </template>
        </el-table-column>
        <el-table-column label="剩余授信(元)" align="right">
          <template slot-scope="scope">
            {{ currencyFormat(scope.row.amountCreditSurplus) }}
          </template>
        </el-table-column>
        <el-table-column label="单笔授信(元)" align="right">
          <template slot-scope="scope">
            {{ currencyFormat(scope.row.onceCredit) }}
          </template>
        </el-table-column>
        <el-table-column
          label="单笔账期(天)"
          prop="dateCreditSurplus"
          align="right"
        ></el-table-column>
        <el-table-column
          label="3天内到期金额(元)"
          align="right"
          sortable
          width="160"
        >
          <template slot-scope="scope">
            <font style="color: red">{{
              currencyFormat(scope.row.expireMoney)
            }}</font>
          </template>
        </el-table-column>
        <el-table-column label="逾期金额(元)" align="right" sortable>
          <template slot-scope="scope">
            <font style="color: red">{{
              currencyFormat(scope.row.overdueMoney)
            }}</font>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              style="margin-right: 15px"
              @click="adjust(scope.row.customerId)"
              >调整</el-button
            >
            <el-button
              type="text"
              @click="
                handleJumpDetail('/customerManage/customerDetail', {
                  customerId: scope.row.customerId,
                  currentView: 'crediCredit',
                })
              "
              >查看</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <el-dialog
        title="添加筐子"
        :visible.sync="adjustdialog"
        width="20%"
        :before-close="handleClose"
      >
        <div>
          <el-form
            :model="form"
            :rules="rules"
            ref="form"
            label-position="left"
          >
            <el-form-item label="赊账授信(元)" prop="creditTotalAmount">
              <el-input
                v-model="form.creditTotalAmount"
                oninput="value=value.replace(/[^0-9.]/g,'')"
                style="wdith: 100%"
              ></el-input>
            </el-form-item>
            <el-form-item label="单笔授信(元)" prop="creditOneAmount">
              <el-input
                v-model="form.creditOneAmount"
                oninput="value=value.replace(/[^0-9.]/g,'')"
                style="wdith: 100%"
              ></el-input>
            </el-form-item>
            <el-form-item label="单笔授信账期(天)" prop="creditOneLimit">
              <el-input
                v-model="form.creditOneLimit"
                oninput="value=value.replace(/[^0-9.]/g,'')"
                style="wdith: 100%"
              ></el-input>
              <el-button size="mini" @click="form.creditOneLimit = 15"
                >15天</el-button
              >
              <el-button size="mini" @click="form.creditOneLimit = 30"
                >30天</el-button
              >
              <el-button size="mini" @click="form.creditOneLimit = 90"
                >90天</el-button
              >
            </el-form-item>
          </el-form>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取消授信</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
    </el-main>
  </Table-Page>
</template>

<script>
import { ListMixin } from "@/mixins/ListMixin";
import { getList, userCreditSet } from "@/request/api/creditLine/index.js";
export default {
  name: "creditLine",
  mixins: [ListMixin],
  data() {
    return {
      form: {
        customerId: "",
        creditTotalAmount: null,
        creditOneAmount: null,
        creditOneLimit: null,
      },
      rules: {
        creditTotalAmount: [
          { required: true, message: "请输入赊账授信总额", trigger: "blur" },
        ],
        creditOneAmount: [
          { required: true, message: "请输入单笔授信金额", trigger: "blur" },
        ],
        creditOneLimit: [
          { required: true, message: "请输入单笔授信账期", trigger: "blur" },
        ],
      },
      adjustdialog: false,
      loading: false,
      tableData: [],
      queryData: {
        pageindex: 1,
        pagesize: 10,
        total: 0,
      },
    };
  },
  methods: {
    submit() {
      const self = this.form;
      this.$refs.form.validate((valid) => {
        if (valid) {
          self.creditTotalAmount = Number(self.creditTotalAmount);
          self.creditOneAmount = Number(self.creditOneAmount);
          self.creditOneLimit = Number(self.creditOneLimit);
          userCreditSet(self).then((resp) => {
            this.$success("设置成功！");
            this.handleClose();
            this.getList();
          });
        }
      });
    },
    handleClose() {
      this.$refs.form.resetFields();
      this.adjustdialog = false;
    },
    adjust(id) {
      this.form.customerId = id;
      this.adjustdialog = true;
    },
    currencyFormat(num) {
      let a = Number(num)
        .toFixed(2)
        .toString()
        .replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g, "$1,");
      return a;
    },
    Query() {
      this.getList();
    },
    Reset() {
      (this.queryData = {
        pageindex: 1,
        pagesize: 10,
      }),
        this.getList();
    },
    getList() {
      getList(this.queryData).then((resp) => {
        // console.log(resp)
        this.tableData = resp.data[0];
        this.queryData.total = resp.data[0].sumCount;
      });
    },
    handlePagination(e) {
      this.queryData.pageindex = e.pageNum;
      this.queryData.pagesize = e.pageSize;
      this.getList();
    },
  },
  created() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.main_styl {
  overflow-x: hidden !important;
}
.font_sty_1 {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(1, 6, 33, 0.75);
  line-height: 22px;
}
.font_sty_2 {
  font-size: 24px;
  font-family: PingFangSC-, PingFang SC;
  font-weight: normal;
  color: rgba(1, 6, 33, 0.9);
  line-height: 32px;
}
.el-divider--horizontal {
  margin: 12px 0;
}
.el-tag {
  padding: 0px 1px !important;
}
.el-tag--medium {
  height: 17px !important;
  line-height: 17px !important;
}
::v-deep .el-dialog__body {
  padding: 30px 100px;
}
.el-button + .el-button {
  margin-left: 5px;
}
</style>
