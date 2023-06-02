<template>
  <Page v-loading="loading">
    <h4>商品信息</h4>
    <h4 class="layout_styl_1">{{ goodMsg.name }}</h4>
    <el-row class="layout_styl_1 font_styl_1">
      <el-col :span="6">产地：{{ goodMsg.regionName }}</el-col>
      <el-col :span="6">级别/规格:{{ goodMsg.spec }}</el-col>
      <el-col :span="6"
        >当前库存：
        {{ goodMsg.batchNumber + goodMsg.subUnit }}
        {{ goodMsg.subUnit2 != "" ? "(" : "" }}
        {{
          goodMsg.subUnit3Weight == 0
            ? ""
            : goodMsg.subUnit3Weight + goodMsg.subUnit3
        }}
        {{ goodMsg.subUnit3 != "" ? "*" : "" }}
        {{
          goodMsg.subUnit2Weight == 0
            ? ""
            : goodMsg.subUnit2Weight + goodMsg.subUnit2
        }}
        {{ goodMsg.subUnit2 != "" ? "/" + goodMsg.subUnit : "" }}
        {{ goodMsg.subUnit2 != "" ? ")" : "" }}
        {{
          goodMsg.pieceUnit != "" && goodMsg.pieceUnit != "筐(一次性)"
            ? "(" + goodMsg.pieceNumber + goodMsg.pieceUnit + ")"
            : "(" + goodMsg.pieceNumber + "筐)"
        }}
        {{ goodMsg.basketNumber != 0 ? "  |  " + goodMsg.basketNumber : ""
        }}<font v-if="goodMsg.basketNumber != 0" style="color: #df971a"
          >筐</font
        >
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <h4>
      批次列表&nbsp;&nbsp;&nbsp;&nbsp;<el-button
        style="color: #fff; background: #0ba198"
        size="mini"
        @click="openBatchSelect"
        >+ 选择批次</el-button
      >
    </h4>
    <el-row v-if="tableData.length > 0" class="layout_styl_1">
      <el-col :span="23">
        <el-table
          :data="tableData"
          height="300px"
          style="border: 1px solid #e9e9e9"
        >
          <el-table-column
            label="编号"
            type="index"
            width="50"
          ></el-table-column>
          <el-table-column label="入库时间">
            <template slot-scope="scope">
              {{ toDate(scope.row.timestamp) }}
            </template>
          </el-table-column>
          <el-table-column label="入库类型" prop="">
            <template slot-scope="scope">
              <el-button
                @click="toPageType(scope.row.batchsourcename)"
                type="text"
                >{{ scope.row.batchsourcename }}</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="装框前库存" prop="">
            <template slot-scope="scope">
              <span
                v-html="
                  getStock(
                    goodMsg.subUnit,
                    goodMsg.subUnit2,
                    goodMsg.subUnit3,
                    goodMsg.pieceUnit,
                    goodMsg.subUnit2Weight,
                    goodMsg.subUnit3Weight,
                    scope.row.batchnumber,
                    scope.row.basketnumber,
                    scope.row.piecenumber
                  )
                "
              ></span>
            </template>
          </el-table-column>
          <el-table-column label="装框后库存" prop="soarAfter">
            <template slot-scope="scope">
              <span v-html="scope.row.soarAfter"></span>
            </template>
          </el-table-column>
          <el-table-column label="装筐数量" prop="sumSoar">
            <template slot-scope="scope">
              <el-button type="text" @click="openBasketMsg(scope.row)">{{
                scope.row.sumSoar
              }}</el-button>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="tableDataDel(scope.row.batchid)"
                >移除</el-button
              >
              <el-button
                type="text"
                @click="tableDataEdit(scope.row, scope.row.batchid)"
                >编辑</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <div class="table_count_styl">
          <span style="float: left">合计</span>
          <span style="margin-right: 20px"
            >批次数量:{{ tableData.length }}个</span
          >
          <span style="margin-right: 20px">装筐数量:{{ countSoar }}个</span>
        </div>
      </el-col>
    </el-row>
    <el-divider></el-divider>
    <h4 style="margin-top: 15px">装筐原因</h4>
    <el-input
      style="width: 30%"
      class="layout_styl_1"
      type="textarea"
      placeholder="请输入"
      v-model="remark"
      maxlength="200"
      show-word-limit
      rows="4"
      resize="none"
    >
    </el-input>
    <div style="height: 100px"></div>
    <div class="page_footer">
      <el-button size="mini" @click="submit('1')">确认并查看</el-button>
      <el-button type="primary" size="mini" @click="submit('2')"
        >确认并返回</el-button
      >
    </div>
    <!-- ************************************************************************************************************************************************* -->
    <!-- ************************************************************************************************************************************************* -->
    <!-- ************************************************************************************************************************************************* -->
    <el-dialog
      title="选择批次"
      :visible.sync="selectBatchDialog"
      width="60%"
      :before-close="selectBatchClose"
    >
      <h4 class="layout_styl_1">{{ goodMsg.name }}</h4>
      <el-row class="layout_styl_1 font_styl_1">
        <el-col :span="6">产地：{{ goodMsg.regionName }}</el-col>
        <el-col :span="6">级别/规格：级别/规格:{{ goodMsg.spec }}</el-col>
        <el-col :span="6"
          >当前库存：
          {{ goodMsg.batchNumber + goodMsg.subUnit }}
          {{ goodMsg.subUnit2 != "" ? "(" : "" }}
          {{
            goodMsg.subUnit3Weight == 0
              ? ""
              : goodMsg.subUnit3Weight + goodMsg.subUnit3
          }}
          {{ goodMsg.subUnit3 != "" ? "*" : "" }}
          {{
            goodMsg.subUnit2Weight == 0
              ? ""
              : goodMsg.subUnit2Weight + goodMsg.subUnit2
          }}
          {{ goodMsg.subUnit2 != "" ? "/" + goodMsg.subUnit : "" }}
          {{ goodMsg.subUnit2 != "" ? ")" : "" }}
          {{
            goodMsg.pieceUnit != "" && goodMsg.pieceUnit != "筐(一次性)"
              ? "(" + goodMsg.pieceNumber + goodMsg.pieceUnit + ")"
              : "(" + goodMsg.pieceNumber + "筐)"
          }}
          {{ goodMsg.basketNumber != 0 ? " | " + goodMsg.basketNumber : ""
          }}<font v-if="goodMsg.basketNumber != 0" style="color: #df971a"
            >筐</font
          >
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-table
        :data="dialogTableData.modelList"
        height="300px"
        style="border: 1px solid #e9e9e9"
        ref="batchTable"
        @selection-change="handleSelectionChange"
        :row-key="getRowKeys"
      >
        <el-table-column
          type="selection"
          :selectable="selectable"
          :reserve-selection="true"
        ></el-table-column>
        <el-table-column label="入库时间" prop="timestamp">
          <template slot-scope="scope">
            {{ toDate(scope.row.timestamp) }}
          </template>
        </el-table-column>
        <el-table-column label="入库类型" prop="batchsourcename">
          <template slot-scope="scope">
            <el-button
              @click="toPageType(scope.row.batchsourcename)"
              type="text"
              >{{ scope.row.batchsourcename }}</el-button
            >
          </template>
        </el-table-column>
        <el-table-column label="入库数量" prop="inCount">
          <template slot-scope="scope">
            {{ scope.row.inCount + dialogTableData.subunit }}
            {{ dialogTableData.subUnit2 != "" ? "(" : "" }}
            {{
              dialogTableData.subUnit3Weight == 0
                ? ""
                : dialogTableData.subUnit3Weight + dialogTableData.subUnit3
            }}
            {{ dialogTableData.subUnit3 != "" ? "*" : "" }}
            {{
              dialogTableData.subUnit2Weight == 0
                ? ""
                : dialogTableData.subUnit2Weight + dialogTableData.subUnit2
            }}
            {{
              dialogTableData.subUnit2 != ""
                ? "/" + dialogTableData.subunit
                : ""
            }}
            {{ dialogTableData.subUnit2 != "" ? ")" : "" }}
            {{
              dialogTableData.pieceunit != "" &&
              dialogTableData.pieceunit != "筐(一次性)"
                ? "(" + scope.row.inPieceCount + dialogTableData.pieceunit + ")"
                : "(" + scope.row.inPieceCount + "筐)"
            }}
            {{
              scope.row.inBasketCount != 0
                ? " | " + scope.row.inBasketCount
                : ""
            }}<font v-if="scope.row.inBasketCount != 0" style="color: #df971a"
              >筐</font
            >
          </template>
        </el-table-column>
        <el-table-column label="入库来源">
          <template slot-scope="scope">
            <span v-if="scope.row.custmorName == ''">--</span>
            <span v-if="scope.row.custmorName != ''">
              {{ scope.row.custmorName }}
              <el-tag type="info" v-if="scope.row.custmorType == 0">非</el-tag>
              <el-tag
                v-if="
                  scope.row.custmorType == 11 || scope.row.custmorType == 10
                "
                >供</el-tag
              >
              <el-tag
                type="danger"
                v-if="scope.row.custmorType == 11 || scope.row.custmorType == 7"
                >经</el-tag
              >
              <el-tag
                type="warning"
                v-if="scope.row.custmorType == 3 || scope.row.custmorType == 4"
                >采</el-tag
              >
            </span>
            <span v-if="scope.row.custmorPhone != ''">{{
              "-" + scope.row.custmorPhone
            }}</span>
          </template>
        </el-table-column>
        <el-table-column label="当前库存">
          <template slot-scope="scope">
            {{ scope.row.batchnumber + dialogTableData.subunit }}
            {{ dialogTableData.subUnit2 != "" ? "(" : "" }}
            {{
              dialogTableData.subUnit3Weight == 0
                ? ""
                : dialogTableData.subUnit3Weight + dialogTableData.subUnit3
            }}
            {{ dialogTableData.subUnit3 != "" ? "*" : "" }}
            {{
              dialogTableData.subUnit2Weight == 0
                ? ""
                : dialogTableData.subUnit2Weight + dialogTableData.subUnit2
            }}
            {{
              dialogTableData.subUnit2 != ""
                ? "/" + dialogTableData.subunit
                : ""
            }}
            {{ dialogTableData.subUnit2 != "" ? ")" : "" }}
            {{
              dialogTableData.pieceunit != "" &&
              dialogTableData.pieceunit != "筐(一次性)"
                ? "(" + scope.row.piecenumber + dialogTableData.pieceunit + ")"
                : "(" + scope.row.piecenumber + "筐)"
            }}
            {{
              scope.row.basketnumber != 0 ? " | " + scope.row.basketnumber : ""
            }}<font v-if="scope.row.basketnumber != 0" style="color: #df971a"
              >筐</font
            >
          </template>
        </el-table-column>
        <el-table-column label="最近变动时间">
          <template slot-scope="scope">
            {{ toDate(scope.row.lastlyDate) }}
          </template>
        </el-table-column>
      </el-table>
      <div style="text-align: right">
        <el-pagination
          background
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="dialogqueryData.pageindex"
          :page-sizes="[10]"
          :page-size="dialogqueryData.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="dialogqueryData.total"
        >
        </el-pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectBatchDialogClose" size="mini">取 消</el-button>
        <el-button type="primary" @click="confirmChecked" size="mini"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <el-dialog
      title="编辑批次"
      :visible.sync="editBatchDialog"
      width="60%"
      :before-close="editBatchDialogClose"
      top="50px"
    >
      <h4 class="layout_styl_1">{{ goodMsg.name }}</h4>
      <el-row class="layout_styl_1 font_styl_1">
        <el-col :span="8">产地：{{ goodMsg.regionName }}</el-col>
        <el-col :span="8">级别/规格：{{ goodMsg.spec }}</el-col>
      </el-row>
      <el-row class="layout_styl_1 font_styl_1">
        <el-col :span="8">入库时间:{{ toDate(editBatchMsg.timestamp) }}</el-col>
        <el-col :span="8"
          >入库类型:
          <el-button
            @click="toPageType(editBatchMsg.batchsourcename)"
            type="text"
            size="mini"
            style="margin-top: -3px"
            >{{ editBatchMsg.batchsourcename }}</el-button
          >
        </el-col>
        <el-col :span="8"
          >当前库存:
          {{ editBatchMsg.batchnumber + goodMsg.subUnit }}
          {{ goodMsg.subUnit2 != "" ? "(" : "" }}
          {{
            goodMsg.subUnit3Weight == 0
              ? ""
              : goodMsg.subUnit3Weight + goodMsg.subUnit3
          }}
          {{ goodMsg.subUnit3 != "" ? "*" : "" }}
          {{
            goodMsg.subUnit2Weight == 0
              ? ""
              : goodMsg.subUnit2Weight + goodMsg.subUnit2
          }}
          {{ goodMsg.subUnit2 != "" ? "/" + goodMsg.subUnit : "" }}
          {{ goodMsg.subUnit2 != "" ? ")" : "" }}
          {{
            goodMsg.pieceUnit != "" && goodMsg.pieceUnit != "筐(一次性)"
              ? "(" + editBatchMsg.piecenumber + goodMsg.pieceUnit + ")"
              : "(" + editBatchMsg.piecenumber + "筐)"
          }}
          {{
            editBatchMsg.basketnumber != 0
              ? " | " + editBatchMsg.basketnumber
              : ""
          }}<font v-if="editBatchMsg.basketnumber != 0" style="color: #df971a"
            >筐</font
          >
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-form :model="form" :rules="rules" ref="form" label-position="left">
        <h4 style="margin-top: 20px">周转筐信息</h4>
        <div
          v-for="(item, index) in form.basketArr"
          :key="'name' + index"
          style="margin-top: 15px"
        >
          <div>
            <span
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 14px;
                font-weight: 700;
                margin-bottom: 15px;
                margin-right: 20px;
              "
              >[{{ item.basketType }}]{{ item.basketName }}</span
            >
            <span>空置总量：{{ item.basketNums }}</span>
          </div>
          <el-row
            style="margin-top: 10px"
            v-for="(coloritem, colorindex) in item.info"
            :key="'color' + colorindex"
          >
            <div style="margin-top: 9px">
              <span style="color: #0ba198; margin-right: 10px"
                >[{{ coloritem.basketColor }}]</span
              >
              <span>空置总量：{{ coloritem.nums }}个</span>

              <el-button
                style="font-size: 14px; color: #dd4c4d; margin-left: 15px"
                type="text"
                @click="removeBasket(index, colorindex)"
                >移除
              </el-button>
            </div>
            <el-form-item
              label="使用："
              required
              label-width="65px"
              :prop="'basketArr.' + index + '.info.' + colorindex"
              :rules="rules.soar"
            >
              <el-input
                v-model.number="coloritem.soar"
                style="width: 150px; margin-top: 5px"
                size="mini"
              >
                <template slot="append">个</template>
              </el-input>
            </el-form-item>
          </el-row>
        </div>
        <el-divider></el-divider>
        <p
          style="
            text-align: right;
            height: 22px;
            font-size: 16px;
            font-weight: 500;
            color: rgba(1, 6, 33, 0.9);
          "
        >
          共使用{{ sumSoar }}个筐子
        </p>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editBatchDialogClose" size="mini">取 消</el-button>
        <el-button type="primary" @click="editSubmit" size="mini"
          >确 定</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      title="装筐数量详情"
      :visible.sync="editBatchDialogDetail"
      :before-close="editBatchDialogDetailClose"
      width="60%"
      top="50px"
    >
      <h4 class="layout_styl_1">{{ goodMsg.name }}</h4>
      <el-row class="layout_styl_1 font_styl_1">
        <el-col :span="8">产地：{{ goodMsg.regionName }}</el-col>
        <el-col :span="8">级别/规格：{{ goodMsg.spec }}</el-col>
      </el-row>
      <el-row class="layout_styl_1 font_styl_1">
        <el-col :span="8">入库时间:{{ toDate(editBatchDetail.timestamp) }}</el-col>
        <el-col :span="8"
          >入库类型:
          <el-button
            @click="toPageType(editBatchDetail.batchsourcename)"
            type="text"
            size="mini"
            style="margin-top: -3px"
            >{{ editBatchDetail.batchsourcename }}</el-button
          >
        </el-col>
        <el-col :span="8"
          >当前库存:
          {{ editBatchDetail.batchnumber + goodMsg.subUnit }}
          {{ goodMsg.subUnit2 != "" ? "(" : "" }}
          {{
            goodMsg.subUnit3Weight == 0
              ? ""
              : goodMsg.subUnit3Weight + goodMsg.subUnit3
          }}
          {{ goodMsg.subUnit3 != "" ? "*" : "" }}
          {{
            goodMsg.subUnit2Weight == 0
              ? ""
              : goodMsg.subUnit2Weight + goodMsg.subUnit2
          }}
          {{ goodMsg.subUnit2 != "" ? "/" + goodMsg.subUnit : "" }}
          {{ goodMsg.subUnit2 != "" ? ")" : "" }}
          {{
            goodMsg.pieceUnit != "" && goodMsg.pieceUnit != "筐(一次性)"
              ? "(" + editBatchDetail.piecenumber + goodMsg.pieceUnit + ")"
              : "(" + editBatchDetail.piecenumber + "筐)"
          }}
          {{
            editBatchDetail.basketnumber != 0
              ? " | " + editBatchDetail.basketnumber
              : ""
          }}<font v-if="editBatchDetail.basketnumber != 0" style="color: #df971a"
            >筐</font
          >
        </el-col>
      </el-row>
      <el-divider></el-divider>
      <el-form :model="form" :rules="rules" ref="form" label-position="left">
        <h4 style="margin-top: 20px">周转筐信息</h4>
        <div
          v-for="(item, index) in editBatchDetail.basketArr"
          :key="'name' + index"
          style="margin-top: 15px"
        >
          <div>
            <span
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 14px;
                font-weight: 700;
                margin-bottom: 15px;
                margin-right: 20px;
              "
              >[{{ item.basketType }}]{{ item.basketName }}</span
            >
          </div>
          <div class="flex_dom">
            <div
              style="margin-top: 10px;margin-right:40px;"
              v-for="(coloritem, colorindex) in item.info"
              :key="'color' + colorindex"
            >
              <span style="margin-top: 9px">
                <span style="color: #0ba198; margin-right: 10px"
                  >[{{ coloritem.basketColor }}]</span
                >
                <span
                  >数量：{{ coloritem.soar }}个</span
                >
              </span>
            </div>
          </div>
        </div>
        <el-divider></el-divider>
        <p
          style="
            text-align: right;
            height: 22px;
            font-size: 16px;
            font-weight: 500;
            color: rgba(1, 6, 33, 0.9);
          "
        >
          共使用{{ sumSoar }}个筐子
        </p>
      </el-form>
    </el-dialog>
  </Page>
</template>
<script>
import moment from "moment";
import { getInfo } from "@/request/api/commodityDetail/index";
import {
  getBatch,
  getCarryBasket,
  getSoar,
  addProductLoad,
} from "@/request/api/theOverflow/index";
export default {
  computed: {
    countSoar() {
      let res = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].sumSoar) {
          res += this.tableData[i].sumSoar;
        }
      }
      return res;
    },
    countCarrySoar() {
      let res = 0;
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].carrySoar) {
          res += this.tableData[i].carrySoar;
        }
      }
      return res;
    },
    sumSoar() {
      let res = 0;
      for (let i = 0; i < this.form.basketArr.length; i++) {
        for (let j = 0; j < this.form.basketArr[i].info.length; j++) {
          res += this.form.basketArr[i].info[j].soar;
        }
      }
      return Number(res) ? Number(res) : 0;
    },
  },
  data() {
    var isExceed1 = (rule, value, callback) => {
      if (value > this.editBatchMsg.piecenumber) {
        return callback(new Error("使用数量不能大于空置数量！"));
      } else {
        callback();
      }
    };
    var isExceed2 = (rule, { nums, soar }, callback) => {
      if (nums < soar) {
        return callback(new Error("使用数量不能大于空置数量！"));
      } else {
        callback();
      }
    };
    return {
      form: {
        id: "",
        carrySoar: 0,
        basketArr: [],
      },
      rules: {
        carrySoar: [
          { required: true, message: "请填写使用数量", trigger: "blur" },
          { validator: isExceed1, trigger: "blur" },
        ],
        soar: [{ validator: isExceed2, trigger: "blur" }],
      },
      editBatchMsg: {},
      editBatchDetail: {},
      remark: "",
      editBatchDialog: false,
      editBatchDialogDetail: false,
      dialogqueryData: {
        productId: this.$route.query.id,
        type: 2,
        pageindex: 1,
        pagesize: 10,
        total: 0,
      },
      loading: true,
      id: this.$route.query.id,
      goodMsg: {},
      checkedBatch: [],
      selectBatchDialog: false,
      tableData: [],
      dialogTableData: {},
      editmsg: [],
    };
  },
  methods: {
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
      let next4 = pieceunit == "" ? "" : "(" + piececount + pieceunit + ")";
      let last =
        basket == 0
          ? ""
          : " | " + basket + '<font style="color:#DF971A;">筐</font>';
      let kuohao1 = subunit2 == "" ? "" : "(";
      let kuohao2 = subunit2 == "" ? "" : ")";
      return first + kuohao1 + next3 + next2 + kuohao2 + next4 + last;
    },
    editSubmit() {
      if (this.sumSoar == 0) {
        this.$error("使用筐子总数不能为0！");
      } else {
        this.$refs.form.validate((valid) => {
          if (valid) {
            for (let i = 0; i < this.tableData.length; i++) {
              if (this.tableData[i].batchid == this.editBatchMsg.batchid) {
                this.$set(this.tableData[i], "sumSoar", this.sumSoar);
                this.tableData[i].basketArr = JSON.parse(
                  JSON.stringify(this.form.basketArr)
                );
                this.tableData[i].carrySoar = this.form.carrySoar;
                this.tableData[i].soarAfter = this.getStock(
                  this.goodMsg.subUnit,
                  this.goodMsg.subUnit2,
                  this.goodMsg.subUnit3,
                  this.goodMsg.pieceUnit,
                  this.goodMsg.subUnit2Weight,
                  this.goodMsg.subUnit3Weight,
                  this.editBatchMsg.batchnumber,
                  this.editBatchMsg.basketnumber - this.sumSoar,
                  this.editBatchMsg.piecenumber - this.form.carrySoar
                );
              }
            }
            this.editBatchDialogClose();
          }
        });
      }
    },
    tableDataEdit(row, index) {
      this.form.id = index;
      this.editBatchDialog = true;
      this.editBatchMsg = row;

      this.form.basketArr = [];
      let basketArr = [];
      if (this.editBatchMsg.basketArr) {
        this.form.carrySoar = this.editBatchMsg.carrySoar;
        basketArr = JSON.parse(JSON.stringify(this.editBatchMsg.basketArr));
      }

      let batchGetBasket = {
        productId: this.$route.query.id,
        batchId: [this.editBatchMsg.batchid],
      };
      getCarryBasket(batchGetBasket).then((resp) => {
        let res = resp.data;
        let obj = [];
        let arr = [];
        for (let i = 0; i < res.length; i++) {
          if (obj.indexOf(res[i].basketId) === -1) {
            arr.push({
              basketId: res[i].basketId,
              basketName: res[i].basketName,
              basketType: res[i].basketType,
              info: [
                {
                  basketColor: res[i].basketColor,
                  nums: res[i].nums,
                  soar: 0,
                },
              ],
            });
            obj.push(res[i].basketId);
          } else {
            for (let j = 0; j < arr.length; j++) {
              if (arr[j].basketId == res[i].basketId) {
                arr[j].info.push({
                  basketColor: res[i].basketColor,
                  nums: res[i].nums,
                  soar: 0,
                });
                break;
              }
            }
          }
        }

        this.form.basketArr = arr;
        if (this.form.basketArr.length > 0) {
          for (let i = 0; i < this.form.basketArr.length; i++) {
            const el = this.form.basketArr[i];
            let nums = null;
            for (let j = 0; j < basketArr.length; j++) {
              const ele = basketArr[j];
              if (el.basketId == ele.basketId) {
                nums = j;
              }
            }
            if (nums != null) {
              for (let l = 0; l < this.form.basketArr[i].info.length; l++) {
                const elem = this.form.basketArr[i].info[l];
                for (let p = 0; p < basketArr[nums].info.length; p++) {
                  const element = basketArr[nums].info[p];
                  if (elem.basketColor == element.basketColor) {
                    this.form.basketArr[i].info[l].soar =
                      basketArr[nums].info[p].soar;
                  }
                }
              }
            }
          }
        }

        for (let i = 0; i < this.form.basketArr.length; i++) {
          const el = this.form.basketArr[i];
          let basketNums = 0;
          for (let j = 0; j < el.info.length; j++) {
            const ele = el.info[j];
            basketNums += ele.nums;
          }
          this.form.basketArr[i].basketNums = basketNums;
        }
      });
    },
    // 移除筐子
    removeBasket(index, index2) {
      if (this.form.basketArr[index].info.length > 1) {
        this.form.basketArr[index].info.splice(index2, 1);
      } else {
        this.form.basketArr.splice(index, 1);
      }
    },
    editBatchDialogClose() {
      this.editBatchDialog = false;
      this.$refs.form.resetFields();
    },
    submit(type) {
      let issubmit = true;
      for (let i = 0; i < this.tableData.length; i++) {
        if (!this.tableData[i].soarAfter) {
          this.$error(
            "编号" + (i + 1) + "的批次没有被编辑，请编辑后再做提交！"
          );
          issubmit = false;
        }
      }
      if (issubmit) {
        let res = {
          remark: this.remark,
          productId: this.id,
          loadBatchInfo: [],
        };
        //统计筐子种类
        let basketIdArr = [];
        for (let i = 0; i < this.tableData.length; i++) {
          for (let j = 0; j < this.tableData[i].basketArr.length; j++) {
            basketIdArr.push(this.tableData[i].basketArr[j].basketId);
          }
        }

        //批次筐子信息
        let obj = [];
        for (let i = 0; i < this.tableData.length; i++) {
          obj.push({
            batchId: this.tableData[i].batchid,
            loadBasketInfo: [],
          });
        }

        for (let i = 0; i < obj.length; i++) {
          for (let j = 0; j < this.tableData.length; j++) {
            if (obj[i].productBatchId == this.tableData[j].batchid) {
              for (let k = 0; k < this.tableData[j].basketArr.length; k++) {
                for (
                  let o = 0;
                  o < this.tableData[j].basketArr[k].info.length;
                  o++
                ) {
                  obj[i].loadBasketInfo.push({
                    userBasketId: this.tableData[j].basketArr[k].basketId,
                    loadCount: this.tableData[j].basketArr[k].info[o].soar,
                    userBasketColor:
                      this.tableData[j].basketArr[k].info[o].basketColor,
                  });
                }
              }
            }
          }
        }
        res.loadBatchInfo = obj;
        addProductLoad(res).then((resp) => {
          // console.log(resp)
          if (resp.status == 200) {
            this.$success("操作成功！");
            if (type == 2) {
              this.$closePage("/commodityManage/commodityList", {});
            } else {
              this.$closePage("/commodityManage/packbasketDetails", {
                id: res.data[0],
              });
            }
          }
        });
      }
    },
    toPageType(type) {
      this.$error("暂无该功能！");
    },
    tableDataDel(id) {
      for (let i = 0; i < this.tableData.length; i++) {
        if (this.tableData[i].batchid == id) {
          this.tableData.splice(i, 1);
        }
      }
    },
    toDate(val) {
      return moment(val * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
    confirmChecked() {
      this.tableData = this.checkedBatch;
      this.selectBatchDialogClose();
    },
    selectBatchDialogClose() {
      this.selectBatchDialog = false;
      this.checkedBatch = [];
      setTimeout(() => {
        this.dialogTableData = [];
      }, 1000);
      this.$refs.batchTable.clearSelection();
    },
    handleCurrentChange(val) {
      this.dialogqueryData.pageindex = val;
      this.getBatchMsg();
    },
    handleSizeChange() {},
    selectable(row, index) {
      let obj = this.tableData.map((item) => {
        return item.batchid;
      });
      if (obj.indexOf(row.batchid) > -1) {
        return false;
      } else {
        return true;
      }
    },
    getRowKeys(row) {
      return row.batchid;
    },
    handleSelectionChange(val) {
      this.checkedBatch = val;
    },
    selectBatchClose() {
      this.selectBatchDialog = false;
    },
    getBatchMsg() {
      getBatch(this.dialogqueryData).then((resp) => {
        this.dialogTableData = resp.data[0];
        this.dialogqueryData.total = resp.data[0].sumCount;
        this.checkedBatch = this.tableData;
        if (this.tableData.length > 0) {
          this.$nextTick(() => {
            this.dialogTableData.modelList.forEach((row) => {
              for (let i = 0; i < this.tableData.length; i++) {
                if (this.tableData[i].batchid == row.batchid) {
                  this.$refs.batchTable.toggleRowSelection(row, true);
                }
              }
            });
          });
        }
      });
    },
    openBatchSelect() {
      this.checkedBatch = this.tableData;
      this.selectBatchDialog = true;
      this.getBatchMsg();
    },
    openBasketMsg(row) {
      this.editBatchDetail = row
      this.editBatchDialogDetail = true;
    },
    editBatchDialogDetailClose() {
      this.editBatchDetail = []
      this.editBatchDialogDetail = false;
    },
    getgoods() {
      // console.log(this.$route.query.id,this.$route.query.type);
      if (this.$route.query.type == "批次详情") {
        getBatch(this.dialogqueryData).then((resp) => {
          let res = resp.data[0].modelList;
          for (let i = 0; i < res.length; i++) {
            if (res[i].batchid == this.$route.query.id2) {
              this.tableData[0] = res[i];
            }
          }
        });
      }
      let res = {
        productId: this.id,
        type: 1,
        pageindex: 1,
        pagesize: 10,
      };
      getInfo(res).then((resp) => {
        this.goodMsg = resp.data[0];
        this.loading = false;
      });
    },
  },
  created() {
    this.getgoods();
  },
};
</script>
<style scoped lang="scss">
.layout_styl_1 {
  margin-top: 15px;
}
.font_styl_1 {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(1, 6, 33, 0.55);
}
.font_styl_2 {
  font-size: 14px;
  font-family: PingFangSC-Regular, PingFang SC;
  font-weight: normal;
  color: rgba(1, 6, 33, 0.9);
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
.el-tag {
  padding: 0px 1px !important;
}
.el-tag--medium {
  height: 17px !important;
  line-height: 17px !important;
}
.table_count_styl {
  padding: 12px;
  font-size: 16px;
  text-align: right;
  background-color: rgba(1, 6, 33, 0.02);
  border: 1px solid #e9e9e9;
  border-top: 0px;
}
</style>