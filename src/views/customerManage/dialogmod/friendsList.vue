<template>
  <div>
    <!-- 添加客户层级 -->
    <el-dialog title="添加客户" :visible.sync="isVisiable">
      <el-form :model="form" style="margin: 30px 0px">
        <div class="tanchuang" style="width: 80%; margin-right: 5%">
          <el-form-item>
            <el-input
              v-model="form.phoneNum"
              autocomplete="off"
              placeholder="请输入客户电话"
            >
              <i slot="prefix" class="el-input__icon el-icon-search"></i>
            </el-input>
          </el-form-item>
        </div>
        <div class="tanchuang" style="width: 15%; margin-bottom: 40px">
          <el-button type="primary" @click="handleEdit()">搜索</el-button>
        </div>
      </el-form>
    </el-dialog>

    <!-- 客户层级搜索弹窗 -->
    <el-dialog
      title="添加客户"
      :visible.sync="innerVisible"
      :before-close="close"
    >
      <div v-if="isSuccess">
        <el-result
          v-if="tableData.isPlatform == 1 && tableData.isAdd == 0"
          icon="success"
          title="已发送好友申请"
        ></el-result>
        <el-result v-else icon="success" title="添加成功"></el-result>
      </div>
      <div v-else>
        <el-form :model="form" style="margin: 30px 0px">
          <!-- 平台用户 -->
          <div v-if="tableData.isPlatform == 1">
            <div class="search-customer">
              <el-input v-model="form.phoneNum" autocomplete="off"></el-input>
            </div>
            <div class="search-customer">
              <span style="margin-right: 10px">{{ tableData.userName }}</span>
              <el-tag v-if="tableData.isMerchant == 0">个人用户</el-tag>
              <el-tag v-else>企业用户</el-tag>
            </div>
            <div class="search-customer">
              <span>{{ form.phoneNum }}</span>
            </div>
            <div class="search-customer">
              <span>经营范围：</span>
              <el-tag
                v-for="(item, index) in tableData.businessScopel"
                :key="index"
                size="small"
                class="elTagbglist"
                style="margin-right: 12px; margin-bottom: 10px"
                >{{ item }}</el-tag
              >
            </div>
            <el-form-item>
              <el-button type="info" plain disabled v-if="tableData.isAdd == 1"
                >已添加</el-button
              >
              <el-button type="primary" v-else @click="addHandle()"
                >发送好友申请</el-button
              >
            </el-form-item>
          </div>

          <!-- 非平台已添加 -->
          <div v-else-if="tableData.isPlatform == 0 && tableData.isAdd == 1">
            <div class="search-customer">
              <el-input v-model="form.phoneNum" autocomplete="off"></el-input>
            </div>
            <div class="search-customer">
              <span style="margin-right: 10px">{{ tableData.userName }}</span>
              <el-tag>非平台用户</el-tag>
            </div>
            <div class="search-customer">
              <span>{{ form.phoneNum }}</span>
            </div>
            <el-form-item>
              <el-button type="info" plain disabled>已添加</el-button>
            </el-form-item>
          </div>

          <!-- 非平台未添加 -->
          <div v-else style="text-align: center">
            <el-form-item>
              <el-input v-model="form.phoneNum" autocomplete="off"></el-input>
            </el-form-item>
            <div class="search-customer">
              <div style="color: rgba(1, 6, 33, 0.35)">未搜索到相关结果</div>
            </div>
            <el-form-item class="search-customer">
              <div>
                若需要将该号码添加为为非平台用户，请在下方输入该客户姓名完成添加
              </div>
            </el-form-item>
            <el-form-item>
              <el-input
                style="width: 50%"
                v-model="form.userName"
                autocomplete="off"
                placeholder="请输入该非平台用户的姓名"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button @click="close">取消</el-button>
              <el-button type="primary" @click="addHandle()">添加</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  addFriends,
  searchFriends,
} from "@/request/api/customerManage/customer.js";
export default {
  name: "friendsList",
  data() {
    return {
      isSuccess: false,
      loading: false,
      isVisiable: false,
      disableSubmit: false,
      innerVisible: false,
      model: {},
      tableData: {
        isPlatform: "", //是否是平台用户 1-是 0-否
        userName: "", //姓名
        phoneNumber: "",
        isMerchant: "", //是否是企业用户 1-是 0-否
        userType: "", //1-经营户 2-采购户 3-供货商
        businessScopel: "", //经营范围
        isAdd: "", //是否已添加好友 1-是 0-否
      },
      form: {
        phoneNum: "",
        userName: "",
      },
    };
  },
  computed: {},
  methods: {
    add() {},
    addHandle() {
      addFriends({
        phoneNum: this.form.phoneNum,
        userName: this.form.userName,
      }).then((res) => {
        if (res.status == 200) {
          this.isSuccess = true;
        }
      });
    },

    handleEdit() {
      this.disableSubmit = false;
      this.isVisiable = false;
      this.innerVisible = true;

      // const data = {
      //   isPlatform: 1,
      //   userName: "鑫总",
      //   phoneNumber: "13333333333",
      //   isMerchant: 0, //是否是企业用户   1-是  0-否
      //   userType: 1, //1-经营户   2-采购户   3-供货商
      //   businessScopel: "蔬菜,冻品", //经营范围
      //   isAdd: 0 //是否已添加好友   1-是   0-否
      // };
      // this.$nextTick(function() {
      //   this.tableData = data;
      // });

      searchFriends({
        phoneNum: this.form.phoneNum,
      }).then((res) => {
        if (res.status == 200) {
          this.tableData = res.data[0];
          try {
            this.tableData.businessScopel =
              this.tableData.businessScopel.split(",");
          } catch (error) {
            this.tableData.businessScopel = [];
          }
        }
      });
    },
    // 关闭事件
    close(val) {
      if (!val) {
        this.$emit("close");
      }
      this.loading = false;
      this.innerVisible = false;
      this.disableSubmit = false;
      this.isSuccess = false;
      this.$emit("fMethod", 1);
    },
  },
};
</script>

<style  scoped lang="scss">
.tanchuang {
  display: inline-block;
}

.search-customer {
  margin-bottom: 12px;
}
</style>