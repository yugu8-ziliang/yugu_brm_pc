<template>
  <!-- 使用载货筐子 -->
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
            v-for="(item, index) in baskList.modelList"
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
                v-for="(item2, index2) in item.basketinfos"
                :label="item2.userbasketid"
                :key="index2"
                v-model="item2.check"
                @change="handleCheckedCitiesChange(index, index2)"
                >[{{ item2.basketcolor }}] 空置数量：{{
                  item2.userbasketnumber
                }}件</el-checkbox
              >
            </div>
          </div>
        </el-scrollbar>
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
  </div>
</template>

<script>
import { getCarryBasket } from "@/request/api/commodity/index";

export default {
  name: "addHomeBasket",
  data() {
    return {
      title: "",
      isVisiable: false,
      disableSubmit: false,
      model: {},
      baskList: {},
    };
  },

  methods: {
    edit(record) {
      this.model = Object.assign({}, this.model, record);
      this.getAddOwnBasket();
    },
    getAddOwnBasket() {
      let batchId = [];
      let param = {
        data: [
          {
            productId: "", // 商品id
            batchId: "", // 批次id,多个批次逗号隔开
          },
        ],
      };
      for (let i = 0; i < this.model.goodsMsg.details.length; i++) {
        const el = this.model.goodsMsg.details[i];
        param.data[0].productId = el.productIdBuyUser;
        batchId.push(el.productbathId);
      }
      param.data[0].batchId = batchId.toString();
      getCarryBasket(param).then((res) => {
        this.baskList = res.data[0];
      });
    },
    handleCheckAllChange(index) {
      this.baskList.modelList[index].isIndeterminate = false;
      if (this.baskList.modelList[index].check) {
        for (
          let i = 0;
          i < this.baskList.modelList[index].basketinfos.length;
          i++
        ) {
          const ele = this.baskList.modelList[index].basketinfos[i];
          this.$set(
            this.baskList.modelList[index].basketinfos[i],
            "check",
            true
          );
        }
      } else {
        for (
          let i = 0;
          i < this.baskList.modelList[index].basketinfos.length;
          i++
        ) {
          const ele = this.baskList.modelList[index].basketinfos[i];
          this.$set(
            this.baskList.modelList[index].basketinfos[i],
            "check",
            false
          );
        }
      }
    },
    handleCheckedCitiesChange(index, index2) {
      this.$set(this.baskList.modelList[index], "isIndeterminate", true);
      let check = 0;
      for (
        let i = 0;
        i < this.baskList.modelList[index].basketinfos.length;
        i++
      ) {
        const ele = this.baskList.modelList[index].basketinfos[i];
        if (ele.check) {
          check += 1;
        }
      }
      if (check == this.baskList.modelList[index].basketinfos.length) {
        this.$set(this.baskList.modelList[index], "isIndeterminate", false);
        this.$set(this.baskList.modelList[index], "check", true);
      } else if (check == 0) {
        this.$set(this.baskList.modelList[index], "isIndeterminate", false);
        this.$set(this.baskList.modelList[index], "check", false);
      } else {
        this.$set(this.baskList.modelList[index], "isIndeterminate", true);
        this.$set(this.baskList.modelList[index], "check", false);
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
      for (let index = 0; index < this.baskList.modelList.length; index++) {
        const el = this.baskList.modelList[index];
        for (let i = 0; i < el.basketinfos.length; i++) {
          const ele = el.basketinfos[i];
          if (ele.check) {
            padamList.push({ ...el, ...ele });
          }
        }
      }
      if (padamList.length == 0) {
        this.$warning("请选择");
        return;
      }
      this.$emit("addHomeChange", {
        avgPrice: this.baskList.avgPrice,
        padamList,
      });
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
  created() {},
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