<template>
  <!-- 级别 -->
  <el-dialog
    :title="title"
    :visible.sync="isVisiable"
    :close-on-click-modal="false"
    :before-close="close"
    append-to-body
    top="100px"
    width="600px"
    class="levelDialog"
  >
    <div class="marginform">
      <div
        style="font-size: 14px; color: rgba(1, 6, 33, 0.55); font-weight: 700"
      >
        原级别/规格：{{ model.spec }}
      </div>

      <div style="padding-bottom: 8px">
        <div style="padding: 10px 0px">
          <el-tag
            :style="{
              margin: '0px 15px 8px 0px',
              display: 'inline-block',
              border: '1px solid rgba(208, 208, 210, 1)',
              color:
                tag.specname == form.specname
                  ? '#ffffff'
                  : 'rgba(1, 6, 33, 0.75)',
              background:
                tag.specname == form.specname ? 'rgba(11, 161, 152, 1)' : '#fff',
              cursor: 'pointer',
            }"
            v-for="(tag, index) in varList"
            :key="index"
            @click="varietyChange(tag)"
            type="info"
            effect="plain"
          >
            {{ tag.specname }}
          </el-tag>
        </div>
      </div>

      <div style="padding-bottom: 8px">
        <div
          style="color: rgba(0, 0, 0, 0.85); font-size: 14px; font-weight: 700"
        >
          经常使用
        </div>
        <div style="padding: 10px 0px">
          <el-tag
            :style="{
              margin: '0px 15px 8px 0px',
              display: 'inline-block',
              border: '1px solid rgba(208, 208, 210, 1)',
              color:
                tag.specname == form.specname
                  ? '#ffffff'
                  : 'rgba(1, 6, 33, 0.75)',
              background:
                tag.specname == form.specname ? 'rgba(11, 161, 152, 1)' : '#fff',
              cursor: 'pointer',
            }"
            v-for="(tag, index) in levelCommon"
            :key="index"
            @click="varietyChange(tag)"
            closable
            @close="varietyClose(index)"
            type="info"
            effect="plain"
          >
            {{ tag.specname }}
          </el-tag>
        </div>
      </div>
    </div>

    <div class="creditLineBottom">
      <el-button size="mini" style="margin-right: 10px" @click="close"
        >取消</el-button
      >
      <el-button
        size="mini"
        type="primary"
        style="margin-right: 10px"
        @click="handleAdd"
        >确 定</el-button
      >
    </div>
  </el-dialog>
</template>

<script>
import { specList } from "@/request/api/commodityManage/commodityList";

export default {
  name: "level",
  data() {
    return {
      loading: false,
      title: "",
      isVisiable: false,
      disableSubmit: false,
      model: {},
      form: { },
      varList: [],
      levelCommon: [],
    };
  },

  methods: {
    add() {},
    edit(record) {
      this.loading = true;
      this.model = Object.assign({}, this.model, record);

      console.log(this.model);
      // 获取常用
      this.levelCommon = JSON.parse(localStorage.getItem("levelCommon"));
      this.getSpecList();
    },
    // 获取品牌
    getSpecList() {
      specList({ categoryId: this.model.classifyid }).then((res) => {
        if (res.status == 200) {
          this.varList = res.data;
        }
      });
    },
    varietyChange(val) {
      this.form = val;
      console.log(this.form);
    },
    // 删除常用
    varietyClose(index) {
      this.levelCommon.splice(index, 1);
      localStorage.setItem("levelCommon", JSON.stringify(this.levelCommon));
    },
    handleAdd() {
      if (!this.form.specname) {
        this.$warning("请选择级别/规格");
      } else {
        let varloc = JSON.parse(localStorage.getItem("levelCommon"));
        if (
          varloc == null ||
          varloc == undefined ||
          varloc.length == 0 ||
          varloc == ""
        ) {
          localStorage.setItem(
            "levelCommon",
            JSON.stringify([this.form])
          );
        } else {
          if (JSON.stringify(varloc).indexOf(JSON.stringify(this.form))===-1) {
            varloc.push(this.form);
            localStorage.setItem("levelCommon", JSON.stringify(varloc));
          }
        }
        this.$emit("levelChange", this.form);
        this.close();
      }
    },
    // 清空数据
    clearTree() {},
    // 提交数据
    confirmEdit() {},
    // 关闭事件
    close(val) {
      if (!val) {
        this.$emit("close");
      }
      this.loading = false;
      this.isVisiable = false;
      this.disableSubmit = false;
      this.model = {};
      this.form = {  };
      this.varList = [];
      this.levelCommon = [];
    },
  },
};
</script>

<style scoped lang="scss">
.levelDialog {
  .marginform {
    margin-bottom: 5px;
    overflow: hidden;

    ::v-deep .el-scrollbar {
      .el-scrollbar__wrap {
        margin-bottom: 0px !important;
        overflow-x: hidden;
        .el-scrollbar__view {
          max-height: var(--screenHeight);
          position: relative;
          padding: 5px;
        }
      }
    }
  }
  .creditLineBottom {
    display: flex;
    justify-content: flex-end;
    border-top: 1px solid rgba(1, 6, 33, 0.06);
    padding: 5px;
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
.levelDialog {
  .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>