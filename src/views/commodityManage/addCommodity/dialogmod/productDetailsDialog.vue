<template>
  <!-- 商品详情弹框 -->
  <div class="productDetailsDialog">
    <el-dialog
      :title="title"
      :visible.sync="isVisiable"
      :close-on-click-modal="false"
      :before-close="close"
      top="100px"
      width="75%"
    >
      <div class="marginform">
        <div v-if="model.isCommType == 'add'">
          <div class="flex_dom flex_item_between flex_item_mid">
            <div
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 16px;
                font-weight: 700;
              "
            >
              {{ model.pathProductName }}
            </div>
            <div class="flex_dom flex_item_mid">
              <el-button type="text" size="mini" @click="handleEdit()"
                >编辑商品</el-button
              >
            </div>
          </div>
        </div>
        <div v-if="model.isCommType == 'edit'">
          <div class="flex_dom flex_item_between flex_item_mid">
            <div
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 16px;
                font-weight: 700;
              "
            >
              {{ model.pathProductName }}
            </div>
            <div class="flex_dom flex_item_mid">
              <el-button type="text" size="mini" @click="handleEdit()"
                >编辑商品</el-button
              >
            </div>
          </div>

          <div style="padding: 16px 0px 12px">
            <el-row>
              <el-col :span="5"
                ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >品种/品牌：</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                  model.variety
                }}</span></el-col
              >
              <el-col :span="5"
                ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >产地：</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                  setpathRegionname(model.pathRegionname)
                }}</span></el-col
              >
              <el-col :span="5"
                ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >级别/规格：</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                  model.spec
                }}</span></el-col
              >
              <el-col :span="5"
                ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >计算单位：</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                  model.subunit
                }}</span></el-col
              >
            </el-row>
          </div>

          <div style="padding: 0px 0px 20px; border-bottom: 1px solid #e9e9e9">
            <el-row>
              <el-col
                :span="5"
                v-if="
                  precisionSun(model.subunit) != 0 &&
                  model.pieceunit == '筐(周转筐)' &&
                  model.isRemovePeel == 1
                "
              >
                <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >商品毛重：</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                  {{ (model.purchasenums || 0) + model.subunit }}
                </span>
              </el-col>

              <el-col
                :span="5"
                v-if="
                  precisionSun(model.subunit) != 0 &&
                  model.pieceunit == '筐(周转筐)' &&
                  model.isRemovePeel == 1
                "
              >
                <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >筐子重量：</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                  {{ model.basketweight }}斤
                </span>
              </el-col>

              <el-col
                :span="5"
                v-if="
                  precisionSun(model.subunit) != 0 &&
                  model.pieceunit == '筐(周转筐)' &&
                  model.isRemovePeel == 1
                "
              >
                <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >商品净重：</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                  {{ (model.productweight || 0) + model.subunit }}
                </span>
              </el-col>

              <el-col
                :span="5"
                v-if="
                  precisionSun(model.subunit) == 0 ||
                  model.pieceunit != '筐(周转筐)' ||
                  model.isRemovePeel == 2
                "
              >
                <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >商品数量：</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                  {{ (model.purchasenums || 0) + model.subunit }}
                  {{ model.subUnit2 != "" ? "(" : "" }}
                  {{
                    model.subUnit3Weight == 0
                      ? ""
                      : model.subUnit3Weight + model.subUnit3
                  }}
                  {{ model.subUnit3 != "" ? "*" : "" }}
                  {{
                    model.subUnit2Weight == 0
                      ? ""
                      : model.subUnit2Weight + model.subUnit2
                  }}
                  {{ model.subUnit2 != "" ? "/" + model.subunit : "" }}
                  {{ model.subUnit2 != "" ? ")" : "" }}
                  {{
                    model.pieceunit != ""
                      ? model.pieceunit != "筐(一次性)"
                        ? model.pieceunit != "筐(周转筐)" &&
                          model.pieceunit != "无"
                          ? "(" + model.piecenumber + model.pieceunit + ")"
                          : ""
                        : "(" + model.piecenumber + "筐)"
                      : ""
                  }}
                  {{
                    model.allbasketnums != 0 && model.pieceunit == "筐(周转筐)"
                      ? "| " + model.allbasketnums
                      : ""
                  }}<font
                    v-if="
                      model.allbasketnums != 0 &&
                      model.pieceunit == '筐(周转筐)'
                    "
                    style="color: #df971a"
                    >筐</font
                  >
                </span>
              </el-col>

              <el-col :span="5"
                ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >采购单价：</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                  >{{ (model.purchaseprice || 0) | intervalFormat(false) }}元/{{
                    model.subunit
                  }}</span
                >
              </el-col>
              <el-col :span="4"
                ><span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >商品金额：</span
                ><span style="color: rgba(221, 76, 77, 1); font-size: 14px"
                  >{{ model.productamount | intervalFormat(false) }}元</span
                ></el-col
              >
            </el-row>
          </div>

          <div style="padding: 15px 0px">
            <div class="flex_dom flex_item_mid">
              <span
                style="
                  color: rgba(1, 6, 33, 0.55);
                  font-size: 16px;
                  margin-right: 20px;
                "
                >周转筐信息</span
              >
              <el-tag
                style="border-radius: 20px"
                size="small"
                v-if="
                  precisionSun(model.subunit) != 0 &&
                  model.pieceunit == '筐(周转筐)' &&
                  model.isRemovePeel == 1
                "
                >去皮</el-tag
              >
              <el-tag
                style="border-radius: 20px"
                size="small"
                type="info"
                v-if="
                  precisionSun(model.subunit) == 0 ||
                  model.pieceunit != '筐(周转筐)' ||
                  model.isRemovePeel == 0
                "
                >不去皮</el-tag
              >
            </div>

            <el-scrollbar
              ref="scrollDiv"
              :style="{
                height: parseInt($store.getters.screenHeight - 500) + 'px',
              }"
            >
              <div
                v-for="(item, index) in model.basketInfo"
                :key="index"
                style="padding: 15px 0px 10px"
              >
                <div class="flex_dom flex_item_mid">
                  <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                    >[{{ item.basketType }}] {{ item.basketname }}</span
                  >
                  <div>
                    <el-tag
                      type="warning"
                      size="mini"
                      style="margin: 0px 10px"
                      v-if="item.ismyseller == 1"
                      >自家筐子
                    </el-tag>
                    <el-tag
                      type="success"
                      size="mini"
                      style="margin: 0px 10px"
                      v-if="item.ismyseller == 2"
                      >卖家筐子
                    </el-tag>
                  </div>
                </div>

                <div
                  style="
                    border-bottom: 1px solid rgba(230, 230, 230, 1);
                    padding: 15px 0px;
                  "
                  v-for="(item1, index1) in item.basketinfo"
                  :key="index1"
                >
                  <el-row>
                    <el-col :span="1">
                      <span style="font-size: 14px; color: var(--color-primary)"
                        >[{{ item1.basketcolor }}]</span
                      >
                    </el-col>

                    <el-col
                      :span="3"
                      v-if="
                        precisionSun(model.subunit) != 0 &&
                        model.pieceunit == '筐(周转筐)' &&
                        model.isRemovePeel == 1
                      "
                    >
                      <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                        >重量：</span
                      >
                      <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                        {{ item1.basketWeight || 0
                        }}<span
                          style="font-size: 14px; color: rgba(1, 6, 33, 0.75)"
                          >斤/个</span
                        >
                      </span>
                    </el-col>

                    <el-col :span="4">
                      <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                        >载货量：</span
                      >
                      <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                        {{ item1.basketLoading || 0
                        }}<span
                          style="font-size: 14px; color: rgba(1, 6, 33, 0.75)"
                          >{{ model.subunit }}/<span
                            style="color: rgba(223, 151, 26, 1)"
                            >筐</span
                          ></span
                        >
                      </span>
                    </el-col>

                    <el-col :span="3" v-if="item.ismyseller == 2">
                      <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                        >价格：</span
                      >
                      <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                        {{ (item1.unit || 0) | intervalFormat(false)
                        }}<span
                          style="font-size: 14px; color: rgba(1, 6, 33, 0.75)"
                          >元/个</span
                        >
                      </span>
                    </el-col>
                    <el-col :span="3" v-else-if="model.buybasketType != 0">
                      <span>&nbsp;</span>
                    </el-col>

                    <el-col :span="3">
                      <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                        >使用：</span
                      >
                      <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                        {{ item1.basketNum || 0
                        }}<span
                          style="font-size: 14px; color: rgba(1, 6, 33, 0.75)"
                          >个</span
                        >
                      </span>
                    </el-col>
                    <el-col
                      :span="4"
                      v-if="
                        precisionSun(model.subunit) != 0 &&
                        model.pieceunit == '筐(周转筐)' &&
                        model.isRemovePeel == 1
                      "
                    >
                      <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                        >重量小计：</span
                      >
                      {{ (item1.basketWeight || 0) * (item1.basketNum || 0)
                      }}<span
                        style="font-size: 14px; color: rgba(1, 6, 33, 0.75)"
                        >斤</span
                      >
                    </el-col>

                    <el-col :span="6" v-if="item.ismyseller == 2">
                      <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                        >金额小计：</span
                      >
                      <span
                        style="font-size: 14px; color: rgba(221, 76, 77, 1)"
                      >
                        {{
                          ((item1.unit || 0) * (item1.basketNum || 0))
                            | intervalFormat(false)
                        }}元</span
                      >
                    </el-col>
                  </el-row>
                </div>
              </div>

              <el-row
                style="
                  padding: 10px 0px 15px;
                  border-bottom: 1px solid rgba(230, 230, 230, 1);
                "
              >
                <el-col :span="14">
                  <span
                    style="
                      color: rgba(1, 6, 33, 0.9);
                      font-size: 14px;
                      font-weight: 700;
                    "
                  >
                    {{ model.paramString }}</span
                  >
                </el-col>
                <el-col :span="4">
                  <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >筐子总重：</span
                  >
                  <span style="font-size: 14px; color: rgba(221, 76, 77, 1)">
                    {{ model.basketweight || 0 }}斤</span
                  >
                </el-col>
                <el-col :span="6">
                  <span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                    >筐子金额：</span
                  >
                  <span style="font-size: 14px; color: rgba(221, 76, 77, 1)">
                    {{
                      (model.basketamount || 0) | intervalFormat(false)
                    }}元</span
                  >
                </el-col>
              </el-row>

              <el-row style="padding: 10px 0px">
                <el-col :span="18"> &nbsp; </el-col>
                <el-col :span="6">
                  <span style="color: rgba(1, 6, 33, 0.9); font-size: 16px"
                    >金额小计：</span
                  >
                  <span style="font-size: 16px; color: rgba(221, 76, 77, 1)">
                    {{ (model.sumamount || 0) | intervalFormat(false) }}元</span
                  >
                </el-col>
              </el-row>
            </el-scrollbar>
          </div>
        </div>
      </div>

      <div class="creditLineBottom" v-if="model.isCommType != 'add'">
        <span
          style="
            color: rgba(1, 6, 33, 0.9);
            font-size: 14px;
            font-weight: 700;
            margin-right: 15px;
          "
        >
        </span>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { Base64 } from "js-base64";

export default {
  name: "productDetails",
  data() {
    return {
      loading: false,
      title: "",
      isVisiable: false,
      disableSubmit: false,
      form: {},
      model: {},
    };
  },
  methods: {
    add() {},
    edit(record) {
      this.loading = true;
      this.form = Object.assign({}, this.form, record.form);
      this.model = Object.assign({}, this.model, record.model);
    },
    // 编辑商品
    handleEdit() {
      this.handleJumpDetail("editCommodity", this.form);
      this.$store.dispatch("common/editCommodityData", this.model);
      this.close();
    },
    // 跳转页面
    handleJumpDetail: function (form, record) {
      this.$router.push({
        path: form,
        query: {
          data: Base64.encode(JSON.stringify(record)),
        },
      });
    },
    setpathRegionname(val) {
      let vals = val.split("-");
      if (vals[0] == "国内") {
        return vals[1] + "-" + vals[2] + "-" + vals[3];
      } else {
        return vals[1];
      }
    },
    // 小数点判断 斤非斤判断
    precisionSun(val) {
      if (val == "斤" || val == "公斤" || val == "g") {
        return 2;
      } else {
        return 0;
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
    },
  },
};
</script>

<style scoped lang="scss">
.productDetailsDialog {
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
    align-items: center;
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
.productDetailsDialog {
  .el-dialog__body {
    padding: 10px 20px;
  }
}
</style>