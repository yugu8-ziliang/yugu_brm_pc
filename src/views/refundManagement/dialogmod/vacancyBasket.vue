<template>
  <!-- 使用空置筐子  使用自家筐子 -->
  <div class="addHomeBasketDialog">
    <el-dialog
      :title="title"
      :visible.sync="isVisiable"
      :close-on-click-modal="false"
      :before-close="close"
      top="100px"
      width="450px"
    >
      <div class="marginform">
        <el-scrollbar
          ref="scrollDiv"
          :style="{
            height: parseInt($store.getters.screenHeight - 450) + 'px',
          }"
        >
          <div
            v-for="(item, index) in baskList"
            :key="index"
            style="
              border-bottom: 1px solid rgba(0, 0, 0, 0.06);
              padding: 15px 0px;
            "
          >
            <div
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 14px;
                font-weight: 700;
              "
            >
              <el-checkbox
                v-model="item.check"
                @change="handleCheckAllChange(index)"
                :indeterminate="item.isIndeterminate"
                >[{{ item.basketType }}] {{ item.basketname }}</el-checkbox
              >
            </div>
            <div
              style="
                color: rgba(1, 6, 33, 0.75);
                font-size: 14px;
                margin-top: 5px;
              "
            >
              <el-checkbox
                v-if="item2.nums != 0"
                v-for="(item2, index2) in item.basketinfo"
                :label="item2.userbasketid"
                :key="index2"
                v-model="item2.check"
                @change="handleCheckedCitiesChange(index, index2)"
                >[{{ item2.basketcolor }}] 空置数量：{{
                  item2.nums
                }}个</el-checkbox
              >
            </div>
          </div>
        </el-scrollbar>

        <!-- <div style="padding: 10px 0px">
          <el-button
            size="mini"
            icon="el-icon-plus"
            @click="handleJumpDetail('/orderManagement/BasketBuyAdd')"
            >购入筐子</el-button
          >
          <el-button
            size="mini"
            icon="el-icon-plus"
            @click="handleJumpDetail('/frameManage/addOwnBasket')"
            >添加筐子</el-button
          >
        </div> -->
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
          >确定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { addOwnBasket } from "@/request/api/commodity/index";

export default {
  name: "addHomeBasket",
  data() {
    return {
      title: "",
      isVisiable: false,
      disableSubmit: false,
      model: {},
      baskList: [],
    };
  },

  methods: {
    edit(record) {
      this.model = Object.assign({}, this.model, record);
      this.getAddOwnBasket();
    },
    getAddOwnBasket() {
      let param = {
        categoryname: "", // 三级分类id
        baskets: "", // 置顶筐子id,可不传，传入该值，返回的数据中，根据传入的筐子id,置顶显示此筐子
      };
      for (let i = 0; i < this.model.getUserMsg.details.length; i++) {
        const el = this.model.getUserMsg.details[i];
        param.categoryname = el.categoryId;
      }
      addOwnBasket(param).then((res) => {
        this.baskList = res.data;
      });
    },
    handleCheckAllChange(index) {
      this.baskList[index].isIndeterminate = false;

      if (this.baskList[index].check) {
        for (let i = 0; i < this.baskList[index].basketinfo.length; i++) {
          const ele = this.baskList[index].basketinfo[i];
          this.$set(this.baskList[index].basketinfo[i], "check", true);
        }
      } else {
        for (let i = 0; i < this.baskList[index].basketinfo.length; i++) {
          const ele = this.baskList[index].basketinfo[i];
          this.$set(this.baskList[index].basketinfo[i], "check", false);
        }
      }
    },
    handleCheckedCitiesChange(index, index2) {
      this.$set(this.baskList[index], "isIndeterminate", true);
      let check = 0;
      for (let i = 0; i < this.baskList[index].basketinfo.length; i++) {
        const ele = this.baskList[index].basketinfo[i];
        if (ele.check) {
          check += 1;
        }
      }

      if (check == this.baskList[index].basketinfo.length) {
        this.$set(this.baskList[index], "isIndeterminate", false);
        this.$set(this.baskList[index], "check", true);
      } else if (check == 0) {
        this.$set(this.baskList[index], "isIndeterminate", false);
        this.$set(this.baskList[index], "check", false);
      } else {
        this.$set(this.baskList[index], "isIndeterminate", true);
        this.$set(this.baskList[index], "check", false);
      }
    },
    // 跳转页面
    handleJumpDetail: function (form, record) {
      this.close();
      this.$router.push({
        path: form,
      });
    },
    handleAdd() {
      let padamList = [];
      for (let index = 0; index < this.baskList.length; index++) {
        const el = this.baskList[index];
        let dataP = [];
        for (let i = 0; i < el.basketinfo.length; i++) {
          const ele = el.basketinfo[i];
          if (ele.check) {
            padamList.push({ ...el, ...ele });
          }
        }
      }

      if (padamList.length == 0) {
        this.$warning("请选择");
        return;
      }
      this.$emit("vacancyBasketChange", padamList);
      this.close();
    },
    // 关闭事件
    close(val) {
      if (!val) {
        this.$emit("close");
      }
      this.isVisiable = false;
      this.disableSubmit = false;
      this.model = {};
      this.baskList = {};
    },
  },
};
</script>

<style scoped lang="scss">
.addHomeBasketDialog {
  .marginform {
    margin-bottom: 5px;
    overflow: hidden;
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
.addHomeBasketDialog {
  .el-scrollbar {
    .el-scrollbar__wrap {
      margin-bottom: 0px !important;
      overflow-x: hidden;

      .el-scrollbar__view {
        // height: var(--screenHeight) !important;
        position: relative;
        padding: 0px !important;
      }
    }
  }

  .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>