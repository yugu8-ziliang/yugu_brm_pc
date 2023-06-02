<template>
  <!-- 查看需求单 -->
  <el-container style="background: #ffffff; height: 100%; padding: 20px">
    <el-header style="height: 120px; padding: 0px">
      <el-select
        v-model="timeQ"
        size="mini"
        class="change_select_styl"
        @change="changeDate"
      >
        <template slot="prefix">
          <div class="label-title">选择日期</div>
        </template>
        <el-option label="24小时内" :value="0"></el-option>
        <el-option label="7天内" :value="1"></el-option>
        <el-option label="30天内" :value="2"></el-option>
      </el-select>
      <el-divider direction="vertical" class="divider_layout"></el-divider>
      <el-date-picker
        @change="getList"
        class="change_date_styl"
        size="mini"
        v-model="timequantum"
        type="datetimerange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        align="right"
      >
      </el-date-picker>
      <el-divider></el-divider>
      <h4>收到需求:&nbsp;&nbsp;&nbsp;{{ draftsMsg.length }}单</h4></el-header
    >
    <el-container style="border-top: 1px solid rgba(1, 6, 33, 0.06)">
      <el-aside width="16%;">
        <div
          style="
            border-bottom: 1px solid rgba(1, 6, 33, 0.06);
            padding: 12px 45px;
          "
          class="font_styl_2"
        >
          <span style="font-size: 14px">{{ listData.personName }}</span>
          <el-tag type="info" v-if="listData.typeId == 0">非</el-tag>
          <el-tag v-if="listData.typeId == 10 || listData.typeId == 11"
            >供</el-tag
          >
          <el-tag
            type="warning"
            v-if="listData.typeId == 3 || listData.typeId == 4"
            >采</el-tag
          >
          <el-tag
            type="danger"
            v-if="listData.typeId == 6 || listData.typeId == 7"
            >经</el-tag
          >
          <span style="font-size: 14px">{{ "-" + listData.phoneNumber }}</span>
        </div>

        <el-checkbox-group v-model="checkList" @change="selectList">
          <div
            v-for="(item, index) in draftsMsg"
            :key="'list' + index"
            style="
              border-bottom: 1px solid rgba(1, 6, 33, 0.06);
              padding: 10px 20px;
            "
            class="font_styl_2"
            :class="{ change_bgc: item.orderId == clickdraftid }"
            @click="clickdrafts(item.orderId)"
          >
            <el-checkbox :label="item.orderId"
              >需求单号：{{ item.orderBefore }}<br />{{
                item.timestamp | parseTime
              }}</el-checkbox
            >
          </div>
        </el-checkbox-group>
      </el-aside>
      <el-main style="width=84%; border-left: 1px solid rgba(1, 6, 33, 0.06);">
        <div class="font_styl_2">
          <el-row>
            <el-col :span="4"
              >需求商品：{{
                typecount.productTypeCount ? typecount.productTypeCount : 0
              }}种</el-col
            >
            <el-col :span="20">操作人:{{ typecount.addByUserName }}</el-col>
          </el-row>
          <el-table :data="tableData" style="border: 1px solid #e9e9e9">
            <el-table-column label="商品分类">
              <template slot-scope="scope">
                {{
                  scope.row.firstName +
                  "-" +
                  scope.row.secoundName +
                  "-" +
                  scope.row.productName
                }}
              </template>
            </el-table-column>
            <el-table-column label="品种/品牌" prop="variety"></el-table-column>
            <el-table-column label="产地" prop="regionName"></el-table-column>
            <el-table-column label="级别/规格" prop="spec"></el-table-column>
            <el-table-column label="需求数量" prop="productCount"
              ><template slot-scope="scope">
                {{ scope.row.productCount + scope.row.subUnit }}
              </template></el-table-column
            >
          </el-table>
          <br />
          <h4 style="margin-bottom: 20px">合计</h4>
          <span style="color: rgba(1, 6, 33, 0.55)"
            >商品种类:<font style="color: #010621">
              {{
                typecount.productTypeCount ? typecount.productTypeCount : 0
              }}种</font
            ></span
          >
          <br />
          <h4 style="margin-top: 20px">备注</h4>
          {{ typecount.remark }}
        </div>
      </el-main>
    </el-container>
    <div class="page_footer font_styl_2">
      已选&nbsp;&nbsp;需求单：&nbsp;&nbsp;{{ checkList.length }} 单, 商品:(<font
        style="color: red"
      >
        {{ qiuhe + "/20" }}</font
      >)种 &nbsp;&nbsp;&nbsp;
      <el-button
        type="primary"
        size="mini"
        :class="{
          unActivate: qiuhe > 0 && qiuhe <= 20 ? false : true,
        }"
        @click="submit"
        >添加至销售单
      </el-button>
    </div>
  </el-container>
</template>
<script>
import moment from "moment";
import {
  customerOrderBefore,
  orderBeforeDetails,
} from "@/request/api/salesOrder/salesOrder.js";
export default {
  data() {
    return {
      qiuhe: 0,
      typecount: {},
      tableData: [],
      checkList: [],
      clickdraftid: "",
      pickerOptions: {
        shortcuts: [
          {
            text: "24小时内",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "7天内",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "30天内",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      draftsMsg: [],
      listData: {},
      timeQ: null,
      timequantum: {},
      queryData: {
        toUserId: this.$route.query.id,
      },
    };
  },
  methods: {
    submit() {
      if (this.qiuhe > 20) {
        this.$error("所选商品种类不能大于20！");
        return false;
      }
      let arr = [];
      for (let i = 0; i < this.checkList.length; i++) {
        orderBeforeDetails({ orderId: this.checkList[i] }).then((resp) => {
          for (let j = 0; j < resp.data[0].modelList.length; j++) {
            let el = resp.data[0].modelList[j];
            arr.push({
              classifyid: el.categoryId, // 分类Id
              productid: el.orderId, // 商品id
              productname: el.productName, // 商品名称
              variety: el.variety, // 品牌
              spec: el.spec, // 规格
              // regionid: "430110", //
              regionname: el.regionName, // 产地
              subunit: el.subUnit||"", // 计算单位
              subUnit2: el.subUnit2||"", //二级计算单位  没有为 ""       新增字段
              subUnit2Weight: Number(el.subUnit2Weight)||"", //二级单位重量 没有为 0.0  新增字段
              subUnit3: el.subUnit3||"", //三级计算单位  没有为""          新增字段
              subUnit3Weight: Number(el.subUnit3Weight)||"", //三级单位重量 没有为 0.0  新增字段
              pieceunit: el.pieceUnit||"", // 计件单位
              subunitweight: "", // 单位数量
              batchcount: "", // 库存数量
              basketcount: "", // 筐子数量
              productCount: el.productCount,
              piececount: Number(el.pieceCount)||"", // 计件数量
            });
          }
        });
      }
      // console.log(arr);

      this.$store.dispatch("common/addNewrequestData", {
        isStatus: "add",
        tableDataList: arr,
      });
      this.$closePage("addSalesTicket", {});
    },
    getDetail(id) {
      orderBeforeDetails({ orderId: id }).then((resp) => {
        this.typecount = resp.data[0];
        this.tableData = resp.data[0].modelList;
      });
    },
    selectList(res) {
      var s = 0;
      var a = [];
      for (let i = 0; i < this.draftsMsg.length; i++) {
        for (let j = 0; j < res.length; j++) {
          if (this.draftsMsg[i].orderId == res[j]) {
            a.push(this.draftsMsg[i].theCount);
          }
        }
      }
      for (let i = 0; i < a.length; i++) {
        s += a[i];
      }
      this.qiuhe = s;
    },
    clickdrafts(val) {
      this.clickdraftid = val;
      this.getDetail(val);
    },
    toDate(val) {
      return moment(val * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
    getList() {
      if (this.timequantum.length > 1) {
        var time1 = Date.parse(this.timequantum[0]);
        var time2 = Date.parse(this.timequantum[1]);
        this.queryData.startTime = time1 / 1000;
        this.queryData.endTime = time2 / 1000;
      }
      customerOrderBefore(this.queryData).then((resp) => {
        this.listData = resp.data[0].modelList[0];
        this.draftsMsg = resp.data[0].modelList[0].modelList;
      });
      this.clickdraftid = "";
    },
    changeDate(val) {
      const end = new Date();
      const start = new Date();
      if (val == 0) {
        start.setTime(start.getTime() - 3600 * 1000 * 24);
        this.timequantum = [start, end];
      } else if (val == 1) {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        this.timequantum = [start, end];
      } else {
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        this.timequantum = [start, end];
      }
      this.checkList = [];
      this.tableData = [];
      this.qiuhe = 0;
      this.typecount = {};
      this.getList();
    },
  },
  created() {
    this.getList();
  },
};
</script>
<style scoped lang="scss">
.page_footer {
  width: 100%;
  text-align: right;
  background-color: #fff;
  border-top: 1px solid #e4e7ed;
  position: fixed;
  bottom: 13px;
  padding: 15px;
  right: 20px;
}
.change_bgc {
  background-color: #cef2ed;
}
.el-tag {
  padding: 0px 2px !important;
}
.el-tag--medium {
  height: 17px !important;
  line-height: 17px !important;
}
.content {
  border-top: 1px solid rgba(1, 6, 33, 0.06);
  margin-top: 20px;
  height: calc(70vh);
}
::v-deep .el-date-editor .el-range__icon {
  display: none;
}
::v-deep .el-range-editor--mini.el-input__inner {
  border-radius: 1px !important;
  border-left: 0px !important;
  position: relative;
  left: -20px;
}
.divider_layout {
  position: relative;
  left: -12px;
}
.change_select_styl {
  width: 150px;
}
.change_select_styl /deep/ .el-input__inner {
  border-radius: 1px;
  border-right: 0px;
}
.label-title {
  padding: 0 6px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(1, 6, 33, 0.35);
}
.change_select_styl /deep/ .el-input--prefix .el-input__inner {
  padding-left: 70px;
}
::v-deep .el-select .el-input .el-select__caret {
  display: none;
}
.font_styl_2 {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
}
.unActivate {
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid #d0d0d2;
  color: rgba(1, 6, 33, 0.35);
}
</style>
