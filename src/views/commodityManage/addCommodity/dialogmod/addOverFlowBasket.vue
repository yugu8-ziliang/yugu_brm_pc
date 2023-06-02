<template>
  <!-- 添加卖家筐子 -->
  <div class="addOverFlowBasketDialog">
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
                v-for="(item2, index2) in item.basketinfo"
                :key="index2"
                v-model="item2.check"
                @change="handleCheckedCitiesChange(index, index2)"
                >[{{ item2.basketcolor }}]</el-checkbox
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
import { overFlowBasketList } from "@/request/api/commodityManage/commodityList";

export default {
  name: "addOverFlowBasket",
  data() {
    return {
      loading: false,
      title: "添加卖家筐子",
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
      this.getAddOwnBasket();
    },
    getAddOwnBasket() {
      let param = {
        categoryId: this.model.productid, // 分类id
      };
      overFlowBasketList(param).then((res) => {
        if (res.status == 200) {
          this.baskList = [];
          for (let i = 0; i < res.data.length; i++) {
            const el = res.data[i];
            let dataP = [];
            for (let j = 0; j < el.basketColor.length; j++) {
              const ele = el.basketColor[j];
              dataP.push({
                check: false,
                basketcolor: ele,
              });
            }
            this.baskList.push({
              basketid: el.basketId,
              basketType: el.basketType,
              basketname: el.basektName,
              basketinfo: dataP,
            });
          }
        }
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

    handleAdd() {
      let padamList = [];
      for (let index = 0; index < this.baskList.length; index++) {
        const el = this.baskList[index];
        if (el.check) {
          padamList.push({...el,ismyseller:2});
        } else {
          let dataP = [];
          for (let i = 0; i < el.basketinfo.length; i++) {
            const ele = el.basketinfo[i];
            if (ele.check) {
              dataP.push(ele);
            }
          }
          if (dataP.length > 0) {
            padamList.push({ ...el,ismyseller:2, basketinfo: dataP });
          }
        }
      }if(padamList.length==0){
        this.$warning("请选择")
        return
      }
      this.$emit("addOverFlowBasket", padamList);
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
.addOverFlowBasketDialog {
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
.addOverFlowBasketDialog {
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