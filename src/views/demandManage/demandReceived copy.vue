<template>
  <PageNoScroll>
    <el-date-picker
      ref="selectedTime"
      @change="changeTime"
      size="mini"
      v-model="queryTime"
      type="daterange"
      align="right"
      unlink-panels
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      value-format="timestamp"
      :picker-options="pickerOptions"
    >
    </el-date-picker>
    <el-select
      size="mini"
      v-model="timeQuantum"
      style="width: 7%"
      class="change_timeQ"
      @change="changetimeQ"
    >
      <el-option
        v-for="item in timeQoptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
      ></el-option>
    </el-select>
    <el-divider></el-divider>
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="按商品查看" name="1">
        <h4>商品信息:{{ typeGoodsMsg.orderBeforeCateNum }}种</h4>
        <div
          style="padding: 15px 20px; background: #f5f5f7; margin-top: 10px"
          v-if="typeGoodsMsg.orderBeforeCateNum > 0"
        >
          <el-row style="margin-bottom: 15px">
            <el-col :span="2">全部结果</el-col>
            <el-col :span="22" class="checked_type_styl">
              <el-tag
                @close="handleClose(index)"
                v-for="(item, index) in checkedType"
                :key="'tag' + index"
                closable
                type="info"
              >
                {{ item.name }}
              </el-tag>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">分类</el-col>
            <el-col :span="22" class="type_btn_styl">
              <el-button
                type="text"
                @click="handelFirst(item)"
                v-for="(item, index) in firstType"
                :key="'yiji' + index"
                >{{ item.firstName }}</el-button
              >
            </el-col>
            <el-col :span="22" class="type_btn_styl">
              <el-button
                type="text"
                @click="handelSecound(item)"
                v-for="(item, index) in secoundType"
                :key="'erji' + index"
                >{{ item.secoundName }}</el-button
              >
            </el-col>
            <el-col :span="22" class="type_btn_styl">
              <el-button
                type="text"
                @click="handelThird(item)"
                v-for="(item, index) in thirdType"
                :key="'sanji' + index"
                >{{ item.productName }}</el-button
              >
            </el-col>
          </el-row>
        </div>
      </el-tab-pane>
      <el-tab-pane label="按客户查看" name="2">
        <h4>
          客户信息:&nbsp;&nbsp;&nbsp;{{ typeUserMsg.customerBeforeNum }}人
        </h4>
        <el-row style="border-top: 1px solid #e9e9e9; margin-top: 15px">
          <el-col :span="5" style="padding: 10px 5px">
            <div style="text-align: center">
              <el-input
                v-model="search"
                placeholder="请输入客户姓名/联系电话"
                size="mini"
                @change="getUserMsg"
              ></el-input>
            </div>
            <div
              style="border-top: 1px solid #e9e9e9; margin-top: 10px"
              class="user_list_styl"
            >
              <el-collapse v-model="collapseName" accordion>
                <el-collapse-item
                  :name="index"
                  v-for="(item, index) in typeUserMsg.modelList"
                  :key="'name' + index"
                >
                  <template slot="title">
                    {{ item.personName }}
                    <el-tag type="info" v-if="item.typeId == 0">非</el-tag>
                    <el-tag v-if="item.typeId == 11 || item.typeId == 10"
                      >供</el-tag
                    >
                    <el-tag
                      type="danger"
                      v-if="item.typeId == 6 || item.typeId == 7"
                      >经</el-tag
                    >
                    <el-tag
                      type="warning"
                      v-if="item.typeId == 3 || item.typeId == 4"
                      >采</el-tag
                    >
                    —<span>{{ item.phoneNumber }}</span>
                  </template>
                  <div
                    v-for="(item2, index2) in item.modelList"
                    :key="'order' + index2"
                    style="padding: 10px 5px"
                    @click="handelOrder(item2.orderId)"
                    :class="{ change_bgc: item2.orderId == handelId }"
                  >
                    <p>
                      <el-checkbox
                        v-model="item2.checked"
                        style="margin-right: 10px"
                        @change="checkedOrder(item2.orderId, item2.checked)"
                      ></el-checkbox
                      >需求单号:{{ item2.orderBefore }}
                    </p>
                    <p
                      style="
                        margin-top: 5px;
                        margin-left: 25px;
                        color: rgba(1, 6, 33, 0.55);
                      "
                    >
                      {{ toDate(item2.timestamp) }}
                    </p>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
          </el-col>
          <el-col :span="19" v-if="isShowDetail">
            <div style="padding: 10px 10px">
              <span>需求商品:{{ orderDetail.productTypeCount }}种</span>
              <span style="float: right"
                >操作人:{{ orderDetail.addByUserName }}</span
              >
            </div>
            <el-table
              :data="orderDetail.modelList"
              style="border: 1px solid #e9e9e9"
              height="300px"
            >
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
              <el-table-column
                label="品种/品牌"
                prop="variety"
              ></el-table-column>
              <el-table-column label="产地" prop="regionName"></el-table-column>
              <el-table-column label="级别/规格" prop="spec"></el-table-column>
              <el-table-column label="需求数量">
                <template slot-scope="scope">
                  <span
                    v-html="
                      getStock(
                        scope.row.subUnit,
                        scope.row.subUnit2,
                        scope.row.subUnit3,
                        scope.row.pieceUnit,
                        scope.row.subUnit2Weight,
                        scope.row.subUnit3Weight,
                        scope.row.productCount,
                        scope.row.pieceCount,
                        scope.row.pieceCount
                      )
                    "
                  ></span>
                </template>
              </el-table-column>
            </el-table>
            <br />
            <h4 style="margin-bottom: 20px">合计</h4>
            <span style="color: rgba(1, 6, 33, 0.55)"
              >商品种类:<font style="color: #010621">{{
                orderDetail.modelList.length + "种"
              }}</font></span
            >
            <br />
            <h4 style="margin-top: 20px">备注</h4>
            {{ orderDetail.remark }}
          </el-col>
        </el-row>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :visible.sync="lookOver"
      width="60%"
      :before-close="lookOverDialogClose"
    >
      <div slot="title" class="header-title">
        查看已选(<font
          :style="
            checkedMsg.length == 0 || checkedMsg.length > 20
              ? 'color:red;'
              : 'color:#0BA198;'
          "
          >{{ checkedMsg.length }}/20</font
        >)
      </div>
      <div>
        <el-table
          :data="checkedMsg"
          style="boder: 1px solid #e9e9e9"
          height="500px"
        >
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
          <el-table-column label="当前库存"></el-table-column>
          <el-table-column label="操作"></el-table-column>
        </el-table>
      </div>
    </el-dialog>
    <div class="page_footer" v-if="activeName == '2'">
      已选&nbsp;&nbsp;需求单&nbsp;&nbsp;{{ checkedNum }}单, 商品(<font
        :style="
          checkedMsg.length > 0 && checkedMsg.length <= 20
            ? 'color:#0BA198;'
            : 'color:red;'
        "
        >{{ checkedMsg.length + "/20" }}</font
      >种) &nbsp;&nbsp;&nbsp;
      <el-button
        type="primary"
        size="mini"
        :disabled="
          checkedMsg.length > 0 && checkedMsg.length <= 20 ? false : true
        "
        :class="{
          unActivate:
            checkedMsg.length > 0 && checkedMsg.length <= 20 ? false : true,
        }"
        @click="toTopSend"
        >向上发采购需求</el-button
      >
      <el-button
        type="primary"
        size="mini"
        :disabled="
          checkedMsg.length > 0 && checkedMsg.length <= 20 ? false : true
        "
        :class="{
          unActivate:
            checkedMsg.length > 0 && checkedMsg.length <= 20 ? false : true,
        }"
        @click="addSellOrder"
        >开销售单</el-button
      >
    </div>
    <div class="page_footer" v-if="activeName == '1'">
      <el-button
        type="text"
        @click="isShowChecked"
        :style="
          checkedMsg.length > 0 && checkedMsg.length <= 20
            ? 'color:#0BA198;'
            : 'color:red;'
        "
        v-if="checkedMsg.length > 0"
      >
        查看已选({{ checkedMsg.length + "/20" }})</el-button
      >
      <el-button
        type="primary"
        size="mini"
        :disabled="
          checkedMsg.length > 0 && checkedMsg.length <= 20 ? false : true
        "
        :class="{
          unActivate:
            checkedMsg.length > 0 && checkedMsg.length <= 20 ? false : true,
        }"
        >向上发采购需求</el-button
      >
      <el-button
        type="primary"
        size="mini"
        :disabled="
          checkedMsg.length > 0 && checkedMsg.length <= 20 ? false : true
        "
        :class="{
          unActivate:
            checkedMsg.length > 0 && checkedMsg.length <= 20 ? false : true,
        }"
        >保存至草稿箱</el-button
      >
    </div>
  </PageNoScroll>
</template>
<script>
import moment from "moment";
import {
  getUserOrderMsg,
  getOrderDetail,
  getGoodsOrderMsg,
} from "@/request/api/demandManage/index.js";
export default {
  name: "demandReceived",
  data() {
    return {
      checkedType: [],
      firstType: [],
      thirdType: [],
      secoundType: [],
      typeGoodsMsg: {},
      checkedNum: 0,
      lookOver: false,
      checkedMsg: [],
      isActivate: true,
      isShowDetail: false,
      orderDetail: {},
      handelId: "",
      collapseName: "",
      search: "",
      typeUserMsg: {},
      activeName: "1",
      timeQoptions: [
        {
          label: "24小时内",
          value: 24,
        },
        {
          label: "7天内",
          value: 7,
        },
        {
          label: "30天内",
          value: 30,
        },
        {
          label: "自定义",
          value: 0,
        },
      ],
      queryTime: "",
      timeQuantum: 24,
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
    };
  },
  methods: {
    handleClose(index) {
      if (index == 0) {
        this.checkedType = [];
        this.secoundType = [];
        this.thirdType = [];
        this.firstType = this.typeGoodsMsg.cateList.available;
      } else if (index == 1) {
        this.checkedType.splice(index, 1);
      }
    },
    handelThird(msg) {
      this.thirdType = [];
      this.checkedType.push({
        name: msg.productName,
        id: msg.categoryId,
      });
      console.log(this.checkedType);
    },
    handelSecound(msg) {
      this.thirdType = msg.modelList;
      this.secoundType = [];
      this.checkedType.push({
        name: msg.secoundName,
        id: msg.categorySecondId,
      });
    },
    handelFirst(msg) {
      this.secoundType = msg.modelList;
      this.checkedType.push({
        name: msg.firstName,
        id: msg.categoryClassifyId,
      });
      this.getGoodsMsg();
      this.firstType = [];
    },
    toTopSend() {
      console.log("向上发采购需求", this.checkedMsg);
    },
    addSellOrder() {
      console.log("开销售单", this.checkedMsg);
    },
    lookOverDialogClose() {
      this.lookOver = false;
    },
    isShowChecked() {
      this.lookOver = true;
    },
    checkedOrder(id, ischeck) {
      // console.log(id,ischeck)
      if (ischeck) {
        getOrderDetail({ orderId: id }).then((resp) => {
          let obj = resp.data[0].modelList;
          for (let i = 0; i < obj.length; i++) {
            this.checkedMsg.push(obj[i]);
          }
        });
        this.checkedNum = this.checkedNum + 1;
      } else {
        for (let i = this.checkedMsg.length - 1; i >= 0; i--) {
          if (this.checkedMsg[i].orderId == id) {
            this.checkedMsg.splice(i, 1);
          }
        }
        this.checkedNum = this.checkedNum - 1;
      }
    },
    handelOrder(id) {
      this.handelId = id;
      getOrderDetail({ orderId: this.handelId }).then((resp) => {
        // console.log(resp)
        this.orderDetail = resp.data[0];
        this.isShowDetail = true;
      });
    },
    toDate(val) {
      return moment(val * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
    getGoodsMsg() {
      let time1 = this.queryTime[0] + "";
      let time2 = this.queryTime[1] + "";
      let res = {
        categoryClassifyId:
          this.checkedType.length > 0 ? this.checkedType[0].id : "",
        categorySecondId: this.checkedType > 1 ? this.checkedType[1].id : "",
        categoryId: this.checkedType > 2 ? this.checkedType[2].id : "",
        isTime: this.timeQuantum == 24 ? 1 : 0,
        startTime: time1.substring(0, 10),
        endTime: time2.substring(0, 10),
        search: this.search,
        pageindex: 0,
        pagesize: 0,
      };
      getGoodsOrderMsg(res).then((resp) => {
        this.typeGoodsMsg = resp.dara[0];
        console.log(this.typeGoodsMsg);
        this.firstType = this.typeGoodsMsg.cateList.available;
      });
    },
    getUserMsg() {
      let time1 = this.queryTime[0] + "";
      let time2 = this.queryTime[1] + "";
      let res = {
        startTime: time1.substring(0, 10),
        endTime: time2.substring(0, 10),
        search: this.search,
        pageindex: 0,
        pagesize: 0,
      };
      getUserOrderMsg(res).then((resp) => {
        let obj = resp.data[0];
        for (let i = 0; i < obj.modelList.length; i++) {
          for (let j = 0; j < obj.modelList[i].modelList.length; j++) {
            obj.modelList[i].modelList[j].checked = false;
          }
        }
        this.typeUserMsg = obj;
      });
    },
    handleClick(val) {
      // if(this.activeName == '2'){
      //   this.getUserMsg();
      // }else{
      //   this.getGoodsMsg();
      // }
    },
    changetimeQ(val) {
      if (val == 7) {
        const now = Date.parse(new Date());
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
        const startTime = Date.parse(start);
        this.queryTime = [startTime, now];
      } else if (val == 30) {
        const now = Date.parse(new Date());
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
        const startTime = Date.parse(start);
        this.queryTime = [startTime, now];
      } else if (val == 24) {
        const now = Date.parse(new Date());
        const start = new Date();
        start.setTime(start.getTime() - 3600 * 1000 * 24);
        const startTime = Date.parse(start);
        this.queryTime = [startTime, now];
      }
      if (this.activeName == "1") {
        this.getGoodsMsg();
      } else {
        this.getUserMsg();
      }
    },
    setDefaultTime() {
      let now = Date.parse(new Date());
      let start = new Date();
      start.setTime(start.getTime() - 3600 * 1000 * 24);
      const startTime = Date.parse(start);
      this.queryTime = [startTime, now];
    },
    changeTime(val) {
      this.timeQuantum = 0;
      this.getUserMsg();
    },
    getStock(
      subunit,
      subunit2,
      subunit3,
      pieceunit,
      subunit2weight,
      subunit3weight,
      stock,
      basket,
      piececount
    ) {
      // console.log(subunit,subunit2,subunit3,pieceunit,subunit2weight,subunit3weight,stock,basket,piececount)
      let first = stock + subunit;
      let next2 =
        subunit2 == "" ? "" : subunit2weight + subunit2 + "/" + subunit;
      let next3 = subunit3 == "" ? "" : subunit3weight + subunit3 + "*";
      let next4 =
        pieceunit == ""
          ? ""
          : pieceunit == "筐(周转筐)"
          ? "|" + basket + '<font style="color:#DF971A;">筐</font>'
          : "(" +
            piececount +
            (pieceunit == "筐(一次性)" ? "筐" : pieceunit) +
            ")";
      // let last = basket == 0 ? '' : '|'+basket+'<font style="color:#DF971A;">筐</font>'
      let kuohao1 = subunit2 == "" ? "" : "(";
      let kuohao2 = subunit2 == "" ? "" : ")";
      return first + kuohao1 + next3 + next2 + kuohao2 + next4;
    },
  },
  created() {
    this.setDefaultTime();
    this.getGoodsMsg();
    this.getUserMsg();
  },
};
</script>
<style scoped lang="scss">
.change_timeQ {
  position: relative;
  top: -1px;
}
.user_list_styl {
  min-height: 200px;
  max-height: 450px;
  overflow-y: auto;
  overflow-x: hidden;
}
.change_bgc {
  background-color: #cef2ed;
}
.el-tag {
  padding: 0px 1px !important;
}
.el-tag--medium {
  height: 17px !important;
  line-height: 17px !important;
}
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
.unActivate {
  background: rgba(0, 0, 0, 0.04);
  border: 1px solid #d0d0d2;
  color: rgba(1, 6, 33, 0.35);
}
.type_btn_styl {
  .el-button--medium {
    padding: 0px 20px;
    font-size: 15px;
    border-radius: 4px;
    color: rgba(1, 6, 33, 0.9);
  }
}
.checked_type_styl {
  .el-tag {
    padding: 6px 12px !important;
  }
  .el-tag--medium {
    height: 28px !important;
    line-height: 0px !important;
    margin-right: 15px;
  }
}
</style>