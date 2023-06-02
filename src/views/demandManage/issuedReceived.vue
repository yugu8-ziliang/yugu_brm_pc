<template>
  <!-- 发出的需求 -->
  <Container footer>
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
      >
      </el-option>
    </el-select>
    <el-divider></el-divider>

    <el-button
      type="primary"
      size="small"
      style="margin-bottom: 14px"
      icon="el-icon-plus"
      @click="handleJumpDetail('addNewrequest', {})"
    >
      新建需求单</el-button
    >

    <h4>发送需求:&nbsp;&nbsp;&nbsp;{{ typeUserMsg.orderBeforeNum }}单</h4>
    <el-row style="border-top: 1px solid #e9e9e9; margin-top: 15px">
      <el-col :span="4" style="padding: 10px 5px">
        <div style="text-align: center">
          <el-input
            v-model="search"
            placeholder="请输入客户姓名/联系电话"
            size="mini"
            @change="getUserMsg"
          ></el-input>
        </div>
        <div
          style="border-top: 0.5px solid #e9e9e9; margin-top: 10px"
          class="user_list_styl"
        >
          <el-scrollbar v-model="collapseName" accordion>
            <ul class="salesDraft-left-ul">
              <li
                v-for="(item, index) in typeUserMsgList"
                :key="index"
                :class="{ change_bgc: item.orderId == handelId }"
                class="salesDraft-left-li flex_dom flex_item_mid"
              >
                <div style="margin-right: 30px">
                  <el-checkbox
                    v-model="item.checked"
                    @change="checkedOrder(item.orderId, item.checked)"
                  >
                  </el-checkbox>
                </div>
                <div
                  style="padding: 0px 10px"
                  @click="handelOrder(item.orderId)"
                >
                  <div
                    style="
                      font-size: 14px;
                      color: rgba(1, 6, 33, 0.9);
                      margin-bottom: 5px;
                    "
                  >
                    {{ item.personName }}
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
                      >采
                    </el-tag>
                    -{{ item.phoneNumber }}
                  </div>
                  <div
                    style="
                      font-size: 13px;
                      color: rgba(1, 6, 33, 0.9);
                      margin-bottom: 5px;
                    "
                  >
                    需求单号：{{ item.orderBefore }}
                  </div>
                  <div style="font-size: 13px; color: rgba(1, 6, 33, 0.55)">
                    {{ item.timestamp | parseTime }}
                  </div>
                </div>
              </li>
            </ul>
          </el-scrollbar>
        </div>
      </el-col>
      <el-col :span="20" v-if="isShowDetail">
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
          <el-table-column label="品种/品牌" prop="variety"></el-table-column>
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
          >商品种类:<font style="color: #010621">
            {{ orderDetail.modelList.length + "种" }}</font
          ></span
        >
        <br />
        <h4 style="margin-top: 20px">备注</h4>
        {{ orderDetail.remark }}
      </el-col>
    </el-row>

    <template #footer>
      已选&nbsp;&nbsp;需求单&nbsp;&nbsp;{{ checkedNum }} 单, 商品(<font
        :style="
          checkedMsg.length > 0 && checkedMsg.length <= 20
            ? 'color:#0BA198;'
            : 'color:red;'
        "
      >
        {{ checkedMsg.length + "/20" }}</font
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
        >向上开需求单
      </el-button>
    </template>
  </Container>
</template>
<script>
import { Base64 } from "js-base64";
import {
  alreadySendToOrderBefore,
  getOrderDetail,
} from "@/request/api/demandManage/index.js";
export default {
  name: "issuedReceived",
  data() {
    return {
      orderId: "",
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
      typeUserMsgList: [],
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
    toTopSend() {
      console.log("向上开需求单", this.checkedMsg);
    },
    lookOverDialogClose() {
      this.lookOver = false;
    },
    isShowChecked() {
      this.lookOver = true;
    },
    checkedOrder(id, ischeck) {
      if (ischeck) {
        getOrderDetail({
          orderId: id,
        }).then((resp) => {
          let obj = resp.data[0].modelList;
          for (let i = 0; i < obj.length; i++) {
            this.checkedMsg.push(obj[i]);
          }
        });
        this.checkedNum = this.checkedNum + 1;
      } else {
        for (let i = this.checkedMsg.length; i >= 0; i--) {
          if (this.checkedMsg[i].orderId == id) {
            this.checkedMsg.splice(i, 1);
          }
        }
        this.checkedNum = this.checkedNum - 1;
      }
    },
    handelOrder(id) {
      this.handelId = id;
      getOrderDetail({
        orderId: this.handelId,
      }).then((resp) => {
        this.orderDetail = resp.data[0];
        this.isShowDetail = true;
      });
    },
    getUserMsg() {
      let time1 = this.queryTime[0] + "";
      let time2 = this.queryTime[1] + "";
      let res = {
        startTime: time1.substring(0, 10),
        endTime: time2.substring(0, 10),
        search: this.search,
      };
      alreadySendToOrderBefore(res).then((resp) => {
        this.typeUserMsg = resp.data[0];
        this.typeUserMsgList = resp.data[0].modelList;
      });
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
      this.getUserMsg();
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
      let kuohao1 = subunit2 == "" ? "" : "(";
      let kuohao2 = subunit2 == "" ? "" : ")";
      return first + kuohao1 + next3 + next2 + kuohao2 + next4;
    },
    // 跳转页面
    handleJumpDetail: function (form, record) {
      this.$router.push({
        path: form,
        query: {
          data: Base64.encode(JSON.stringify(record)),
        }, //加密
      });
      // Base64.decode(this.pwd);//解密
    },
  },
  created() {
    this.setDefaultTime();
    this.getUserMsg();
    this.checkedOrder();
  },
};
</script>
<style scoped lang="scss">
/deep/ .container-main {
  padding: 16px 24px 0;
}
.change_timeQ {
  position: relative;
  top: -1px;
  margin-left: 15px;
}

.user_list_styl {
  min-height: 200px;
  max-height: 500px;
  overflow-y: auto;
  overflow-x: hidden;

  .salesDraft-left-ul {
    margin-right: 7px;

    .salesDraft-left-li {
      padding: 10px;
      margin-right: 40px;
      border-bottom: 1px solid rgba(1, 6, 33, 0.06);
    }
  }
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

.left_layout_style {
  border: 1px red solid;
}

::v-deep
  .user_list_styl
  .salesDraft-left-ul
  .salesDraft-left-li[data-v-4eb82c61] {
  margin-right: 0px;
}
</style>