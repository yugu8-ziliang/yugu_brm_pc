<template>
  <!-- 记一笔 -->
  <div class="makeNoteelDialog">
    <el-dialog
      :title="title"
      :visible.sync="isVisiable"
      :close-on-click-modal="false"
      :before-close="close"
      top="50px"
      width="640px"
    >
      <div
        class="marginform flex_dom flex_item_between"
        :style="{
          '--screenHeight':
            $store.getters.screenHeight < 700
              ? $store.getters.screenHeight - 250 + 'px'
              : '450px',
        }"
      >
        <div class="noteLeft">
          <div
            class="flex_dom flex_item_between"
            style="padding: 0px 10px 8px 0px"
          >
            <el-input
              v-model="querySearch.content"
              placeholder="请输入记录内容"
              prefix-icon="el-icon-search"
              size="mini"
              style="width: 80%"
              @input="getList"
            ></el-input>
            <el-button
              icon="el-icon-plus"
              size="mini"
              @click="addTableData"
            ></el-button>
          </div>
          <el-scrollbar ref="scrollDiv">
            <div
              @click="handleTableIndex(index)"
              v-for="(item, index) in tableData"
              :key="index"
              class="flex_dom flex_item_between flex_item_mid"
              :style="{
                cursor: 'pointer',
                padding: '15px 10px 8px 5px',
                'border-bottom': '1px solid rgba(1, 6, 33, 0.06)',
                background:
                  tableIndex == index ? 'rgba(206, 242, 237, 0.4)' : '',
              }"
            >
              <div style="padding: 0px 5px 0px 0px">
                <div
                  class="ellipsisCell"
                  style="
                    -webkit-line-clamp: 2;
                    color: rgba(1, 6, 33, 0.9);
                    font-size: 14px;
                    margin-bottom: 6px;
                  "
                >
                  {{ item.noteBookContent }}
                </div>
                <div style="color: rgba(1, 6, 33, 0.55); font-size: 12px">
                  {{ parseTime(item.makeDate) }}
                </div>
              </div>
              <div>
                <el-button type="text" @click.stop="deleteTableData(index)"
                  >删除</el-button
                >
              </div>
            </div>
          </el-scrollbar>
        </div>

        <div class="noteRight">
          <div
            style="
              text-align: center;
              color: rgba(1, 6, 33, 0.55);
              font-size: 12px;
              margin-top: 5px;
            "
          >
            {{
              tableData.length > 0
                ? parseTime(tableData[tableIndex].makeDate)
                : ""
            }}
          </div>
          <!-- <el-scrollbar> -->
          <div>
            <el-input
              class="textareaNote"
              type="textarea"
              resize="none"
              placeholder="请输入内容"
              v-model="noteBookContent"
              @blur="handleBlur"
            >
            </el-input>
          </div>
          <div class="scrollbarBottom">
            <el-button
              type="primary"
              style="margin-right: 10px"
              @click="handleAddEditorNote"
              >保 存</el-button
            >
            <el-button style="margin-right: 10px" @click="close"
              >取消</el-button
            >
          </div>
          <!-- </el-scrollbar> -->
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { parseTime } from "@/utils/common";

import {
  custmorSeeNote,
  custmorEditorNote,
  custmorDelNote,
} from "@/request/api/customerManage/customerDetail";

export default {
  name: "makeNote",
  data() {
    return {
      parseTime,
      loading: false,
      title: "记一笔",
      isVisiable: false,
      disableSubmit: false,
      querySearch: {
        linkuserId: "", // 客户ID 如果是非平台  "用户名, 手机号"  必填
        content: "", // 模糊查询  选填
        pageindex: 0, // 页码
        pagesize: 0, // 一页的数据
      },
      model: {},
      tableData: [],
      tableIndex: 0,
      noteBookContent: "",
    };
  },

  methods: {
    add() {},
    edit(record) {
      this.loading = true;
      this.model = Object.assign({}, this.model, record);
      // 获取数据
      this.getList();
    },
    getList() {
      this.querySearch.linkuserId = this.model.customerId;

      custmorSeeNote(this.querySearch).then((res) => {
        if (res.status == 200) {
          this.tableData = res.data;

          if (this.tableData.length > 0) {
            this.noteBookContent =
              this.tableData[this.tableIndex].noteBookContent;
          } else {
            this.addTableData();
          }

          // 异步获取列表之后
          this.$nextTick(() => {
            //解决滚动条初始化消失的问题
            this.$refs.scrollDiv.update();
          });
        }
      });
    },
    // 添加数据
    addTableData() {
      this.tableData.unshift({
        noteBookContent: "记一笔",
        makeDate: new Date().getTime(),
        // isType: "add",
      });
      this.noteBookContent = "";
      this.tableIndex = 0;
      this.$refs.scrollDiv.wrap.scrollTop = 0;

      this.$nextTick(() => {
        this.$refs.scrollDiv.update();
      });
    },
    // 删除数据
    deleteTableData(val) {
      this.$confirm("确认删除吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          if (this.tableData[val].noteBookId) {
            let param = {
              noteId: this.tableData[val].noteBookId,
              linkuserId: this.model.customerId,
            };
            custmorDelNote(param).then((res) => {});
          }
          this.tableData.splice(val, 1);
          if (this.tableIndex == val) {
            this.tableIndex = 0;
            this.noteBookContent = "";
          }
          if (this.tableData.length == 0) {
            this.tableIndex = null;
            this.noteBookContent = "";
          }
        })
        .catch(() => {});
    },
    handleTableIndex(val) {
      this.tableIndex = val;
      if (this.tableData[this.tableIndex].noteBookContent == "记一笔") {
        this.noteBookContent = "";
      } else {
        this.noteBookContent = this.tableData[this.tableIndex].noteBookContent;
      }
    },
    handleBlur(val) {
      if (this.tableData.length > 0) {
        if (this.noteBookContent != "") {
          this.tableData[this.tableIndex].noteBookContent =
            this.noteBookContent;
        }
      }
    },
    // 保存数据
    handleAddEditorNote() {
      if (this.tableIndex == null) {
        this.$message.warning("请添加一条");
        return;
      }

      if (this.tableData[this.tableIndex].noteBookContent == "记一笔") {
        this.$message.warning("请输入内容");
        return;
      }

      let param = {
        linkuserId: this.model.customerId, // 客户ID  如果是非平台  "用户名,手机号"   必填
        noteBookContent: this.tableData[this.tableIndex].noteBookContent, // 记一笔内容 选填
      };
      if (this.tableData[this.tableIndex].noteBookId) {
        param.noteid = this.tableData[this.tableIndex].noteBookId; // 记一笔主键id  修改用   选填
      } else {
        param.noteid = "";
      }
      custmorEditorNote(param).then((res) => {
        if (res.status == 200) {
          if (param.noteid) {
            this.$message.success("修改成功");
          } else {
            this.$message.success("添加成功");
          }

          this.getList();
        }
      });
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
      this.tableData = [];
      this.tableIndex = 0;
      this.noteBookContent = "";
    },
  },
};
</script>

<style scoped lang="scss">
.makeNoteelDialog {
  .marginform {
    overflow: hidden;

    .noteLeft {
      border-right: 1px solid rgba(1, 6, 33, 0.06);
      padding: 10px 5px 15px 0px;
      width: 40%;
    }

    .noteRight {
      padding: 10px 0px 0px;
      width: 60%;

      .scrollbarBottom {
        display: flex;
        flex-direction: row-reverse;
        padding-top: 10px;
        border-top: 1px solid rgba(1, 6, 33, 0.06);
      }
    }

    ::v-deep .el-scrollbar {
      .el-scrollbar__wrap {
        margin-bottom: 0px !important;
        overflow-x: hidden;

        .el-scrollbar__view {
          height: var(--screenHeight);
          position: relative;
          padding: 5px;
        }
      }
    }
  }
}

.drawer-bootom-button {
  position: absolute;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #e8e8e8;
  padding: 10px 16px;
  text-align: right;
  left: 0;
  background: #fff;
  border-radius: 0 0 2px 2px;
}
</style>

<style lang="scss">
.makeNoteelDialog {
  .el-dialog__body {
    padding: 0px 0px 0px 10px;
  }

  .textareaNote {
    .el-textarea__inner {
      border: none;
      height: calc(var(--screenHeight) - 30px) !important;
    }
  }
}
</style>