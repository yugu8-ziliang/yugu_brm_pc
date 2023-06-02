<template>
  <!-- 使用空框过磅 -->
  <div class="addHomeBasketDialog">
    <el-dialog
      :title="title"
      :visible.sync="isVisiable"
      :close-on-click-modal="false"
      :before-close="close"
      top="100px"
      width="450px"
    >
      <div style="position: absolute; top: 23px; left: 129px">
        <el-tooltip class="item" effect="light" placement="bottom">
          <div slot="content" style="width: 150px">
            列表中的筐子为系统中所有筐子,选择后可使用其对商品进行过磅和筐子售出
            若售出的该类型颜色筐子的空置数量≤库内空置数量,则订单成交后直接销售出库
            若售出的该类型该颜色筐子的空置数量＞库内空置数量,则超出的部分订单成交后先以自家已有入库再销售出库
          </div>
          <img
            style="width: 13px; height: 13px; margin-left: -10px"
            src="@/assets/image/imgs/question-circle@2x.png"
            alt=""
          />
        </el-tooltip>
      </div>
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
                >[{{ item.basketType }}] {{ item.basektName }}</el-checkbox
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
                v-for="(item2, index2) in item.basketColor"
                :label="item2.basketColor"
                :key="index2"
                v-model="item2.check"
                @change="handleCheckedCitiesChange(index, index2)"
                >[{{ item2.basketColor }}]</el-checkbox
              >
            </div>
          </div>
        </el-scrollbar>

        <div style="padding: 10px 0px">
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
  </div>
</template>

<script>
import { overFlowBasketList } from "@/request/api/commodity/index";

export default {
  name: "emptyBasket",
  data() {
    return {
      loading: false,
      title: "",
      isVisiable: false,
      disableSubmit: false,
      model: {},
      baskList: [],
    };
  },

  methods: {
    add() {},
    edit(record) {
      this.loading = true;
      this.model = Object.assign({}, this.model, record);
      console.log(this.model);
      this.getAddOwnBasket();
    },
    getAddOwnBasket() {
      let param = {
        categoryId: this.model.tableDataLink.classifyid, // 三级分类id
      };
      overFlowBasketList(param).then((res) => {
        if (res.status == 200) {
          this.baskList = [];

          for (let i = 0; i < res.data.length; i++) {
            const el = res.data[i];
            this.baskList.push(el);
            for (let j = 0; j < el.basketColor.length; j++) {
              const el2 = el.basketColor[j];
              this.baskList[i].basketColor[j] = {
                basketColor: el2,
              };
            }
          }
        }
      });
    },
    handleCheckAllChange(index) {
      this.baskList[index].isIndeterminate = false;

      if (this.baskList[index].check) {
        for (let i = 0; i < this.baskList[index].basketColor.length; i++) {
          const ele = this.baskList[index].basketColor[i];
          this.$set(this.baskList[index].basketColor[i], "check", true);
        }
      } else {
        for (let i = 0; i < this.baskList[index].basketColor.length; i++) {
          const ele = this.baskList[index].basketColor[i];
          this.$set(this.baskList[index].basketColor[i], "check", false);
        }
      }
    },
    handleCheckedCitiesChange(index, index2) {
      this.$set(this.baskList[index], "isIndeterminate", true);
      let check = 0;
      for (let i = 0; i < this.baskList[index].basketColor.length; i++) {
        const ele = this.baskList[index].basketColor[i];
        if (ele.check) {
          check += 1;
        }
      }

      if (check == this.baskList[index].basketColor.length) {
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
        // if (el.check) {
        //   padamList.push({ ...el, ismyseller: 1 });
        // } else {
        let dataP = [];
        for (let i = 0; i < el.basketColor.length; i++) {
          const ele = el.basketColor[i];
          if (ele.check) {
            padamList.push({ ...el, ...ele });
            delete padamList.basketColor;
          }
        }
        // if (dataP.length > 0) {
        //   padamList.push({ ...el, ismyseller: 1, basketColor: dataP });
        // }
        // }
      }
      console.log(padamList);
      if (padamList.length == 0) {
        this.$warning("请选择");
        return;
      }
      this.$emit("emptyBasketChange", padamList);
      this.close();
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
      this.baskList = [];
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