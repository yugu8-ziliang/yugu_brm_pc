<template>
  <!-- 保存的草稿 -->
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

    <h4>保存草稿:&nbsp;&nbsp;&nbsp;{{ draft_count }}单</h4>
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
          style="border-top: 1px solid #e9e9e9; margin-top: 10px"
          class="user_list_styl"
        >
          <el-collapse v-model="collapseName" accordion>
            <el-collapse-item
              :name="index"
              v-for="(item, index) in typeUserMsg"
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
                v-for="(item2, index2) in item.info"
                :key="'order' + index2"
                style="padding: 10px 5px"
                @click="handelOrder(item2)"
                :class="{ change_bgc: item2.id == handelId }"
              >
                <p>
                  <el-checkbox
                    v-model="item2.checked"
                    @change="checkedOrder(item2, item2.checked)"
                    style="margin-right: 10px"
                  ></el-checkbox>
                  {{ item2.timestamp | parseTime }}
                </p>
              </div>
            </el-collapse-item>
          </el-collapse>
        </div>
      </el-col>
      <el-col :span="20">
        <div style="padding: 10px 10px">
          <span
            >需求商品:{{
              tableDate.producttypecount ? tableDate.producttypecount : 0
            }}种</span
          >
          <span style="float: right">操作人:{{ tableDate.name }}</span>
        </div>
        <el-table
          :data="tableDate.details"
          style="border: 1px solid #e9e9e9"
          height="300px"
        >
          <el-table-column label="商品分类">
            <template slot-scope="scope">
              {{
                scope.row.catgoryfirstName +
                "-" +
                scope.row.categorysecondName +
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
                    scope.row.count,
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
            {{
              tableDate.producttypecount ? tableDate.producttypecount : 0
            }}种</font
          ></span
        >
        <br />
        <h4 style="margin-top: 20px">备注</h4>
        {{ tableDate.remark }}
      </el-col>
    </el-row>

    <template #footer>
      <el-button size="mini" @click="delBtn">删除 </el-button>
      <el-button
        type="primary"
        size="mini"
        :disabled="checkedMsg.length > 0 ? false : true"
        :class="{ unActivate: checkedMsg.length > 0 ? false : true }"
        @click="toTopSend"
        >添加至需求单
      </el-button>
    </template>
  </Container>
</template>
<script>
import {
  allDraftList,
  deleteDrafts,
} from "@/request/api/demandManage/index.js";
export default {
  name: "saveDraft",
  data() {
    return {
      draft_count: "",
      tableDate: {},
      typeUserMsg: {},
      search: "",
      DraftIds: [],
      checkedMsg: [],
      handelId: "",
      collapseName: "",
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
    checkedOrder(id, ischeck) {
      if (ischeck) {
        this.checkedMsg.push(id);
      } else {
        for (let i = 0; i < this.checkedMsg.length; i++) {
          if (this.checkedMsg[i].id == id.id) {
            this.checkedMsg.splice(i, 1);
          }
        }
      }
    },
    delBtn() {
      let res = this.checkedMsg.map((item) => {
        return item.id;
      });
      deleteDrafts({
        DraftIds: res,
      }).then((res) => {
        this.checkedMsg = [];
        this.tableDate = [];
        this.getUserMsg();
      });
    },
    handelOrder(id) {
      this.tableDate = id;
      this.handelId = this.tableDate.id;
    },
    toTopSend() {
      console.log("添加至需求单", this.checkedMsg);
    },
    getUserMsg() {
      let time1 = this.queryTime[0] + "";
      let time2 = this.queryTime[1] + "";
      let res = {
        startTime: time1.substring(0, 10),
        endTime: time2.substring(0, 10),
        search: this.search,
      };
      allDraftList(res).then((resp) => {
        let obj = resp.data;
        this.typeUserMsg = obj;
        this.draft_count = resp.draft_count;
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
  },
  created() {
    this.setDefaultTime();
    this.getUserMsg();
  },
};
</script>
<style scoped lang="scss">
.change_timeQ {
  position: relative;
  top: -1px;
  margin-left: 15px;
}

.user_list_styl {
  min-height: 200px;
  max-height: 650px;
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

// .left_layout_style {
//     border: 1px red solid;
// }
</style>