<template>
  <!-- 个人中心 -->
  <Container class="personalCenterModel">
    <div style="background: #fff;">
      <div class="flex_dom flex_item_between flex_item_mid">
        <div
          style="color: rgba(1, 6, 33, 0.9); font-size: 16px; font-weight: 700"
        >
          当前登录账户
        </div>
        <div>
          <el-popover
            v-if="isType"
            placement="bottom"
            title="标题"
            width="400"
            trigger="click"
            popper-class="popperClass"
          >
            <el-scrollbar
              ref="scrollDiv"
              :style="{
                height: parseInt($store.getters.screenHeight - 550) + 'px',
              }"
            >
              <!--    v-if="item.isType == 0" -->
              <div
                class="flex_dom flex_item_mid personHeader"
                style="padding: 10px; cursor: pointer"
                v-for="(item, index) in formData3"
                :key="index"
                v-if="item.isType == 0"
                @click="openLogin(item)"
              >
                <el-image
                  style="
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    margin-right: 10px;
                  "
                  :src="item.personHeadPhoto"
                  fit="fill"
                ></el-image>
                <div style="width: 80%">
                  <div class="flex_dom flex_item_between">
                    <div
                      style="
                        color: rgba(1, 6, 33, 0.9);
                        font-size: 14px;
                        font-weight: 500;
                      "
                    >
                      {{ item.personName }}-{{ item.phoneNumber }}
                    </div>
                    <div
                      style="
                        color: rgba(221, 76, 77, 1);
                        font-size: 14px;
                        font-weight: 500;
                      "
                    >
                      {{ setMemberLastDate(item.memberLastDate) }}
                    </div>
                  </div>

                  <div style="margin-top: 5px">
                    <div style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                      {{ item.companyName }}
                    </div>
                  </div>
                  <div
                    style="margin-top: 5px"
                    v-if="setMemberLastDate(item.memberLastDate) == '已过期'"
                  >
                    <div style="color: rgba(1, 6, 33, 0.55); font-size: 14px">
                      到期账户仅可查看及操作未完成订单信息
                    </div>
                  </div>
                </div>
              </div>
            </el-scrollbar>
            <!-- <el-button
              size="small"
              slot="reference"
              style="margin-right: 10px"
              v-if="isType"
              >切换账户</el-button
            > -->
            <el-button slot="reference" size="small" style="margin-right: 10px"
              >切换账户</el-button
            >
          </el-popover>

          <el-button size="small" @click="setPassword('passwordSettings')"
            >密码设置</el-button
          >
        </div>
      </div>
      <div style="padding: 8px 0px 0px">
        <el-row>
          <el-col :span="1.5" style="margin-right: 10px">
            <el-image
              style="width: 60px; height: 60px; border-radius: 50%"
              :src="formData2.personHeadPhoto || imgurl"
              fit="fill"
            >
            </el-image>
          </el-col>
          <el-col :span="22">
            <el-row :span="24">
              <el-col :span="6">
                <div
                  style="
                    color: rgba(1, 6, 33, 0.9);
                    font-size: 16px;
                    font-weight: 500;
                  "
                >
                  {{ formData.agentName }}【{{ formData.companyName }}】
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >联系电话：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                    formData2.PhoneNumber
                  }}</span>
                </div>
              </el-col>
              <el-col :span="6">
                <div>
                  <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >账户类型：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                    formData2.account == 1 ? "主账户" : "副账户"
                  }}</span>
                </div>
              </el-col>
            </el-row>
            <el-row :span="24" style="margin-top: 10px">
              <el-col :span="6">
                <div>
                  <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >套餐信息：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                    handleMtype(formData1.modelList)
                  }}</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div>
                  <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                    >账户到期时间：</span
                  ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                    >{{ formData1.memberLastDate | parseTime() }} (剩余{{
                      formData2.lastDay
                    }}天)</span
                  >
                </div>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </div>
    </div>
    <div ref="currentBasketDetailsTable" style="margin-top: 20px">
      <el-scrollbar
        ref="scrollDiv"
        :style="{
          height: parseInt($store.getters.screenHeight - SetHeight - 10) + 'px',
          background: activeName != '1' ? '#fff' : '',
        }"
      >
        <div style="background: #fff; padding: 10px 20px">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="基础信息" name="1">
              <el-tag
                type="warning"
                style="width: 100%; margin: 0px 0px 15px"
                v-if="formData.passStatus == 0"
                >经营信息修改 审核中</el-tag
              >
              <el-tag
                type="danger"
                style="width: 100%; margin: 0px 0px 15px"
                v-if="formData.passStatus == 2"
              >
                <div class="flex_dom flex_item_between">
                  <span>经营信息修改 审核未通过</span>
                  <span style="cursor: pointer">前去处理</span>
                </div>
              </el-tag>

              <div class="flex_dom flex_item_between flex_item_mid">
                <div
                  style="
                    color: rgba(1, 6, 33, 0.9);
                    font-size: 16px;
                    font-weight: 700;
                  "
                >
                  经营信息
                </div>

                <el-button
                  type="primary"
                  size="small"
                  v-if="formData.passStatus == 1 && formData2.account == 1"
                  >更改
                </el-button>
              </div>

              <el-row style="margin-top: 15px">
                <el-col :span="7">
                  <div>
                    <span
                      style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >{{ istypes[0] == 1 ? "市场名称：" : "实体名称：" }}</span
                    ><span
                      style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                      >{{ formData.marketname }}</span
                    >
                  </div>
                </el-col>
                <el-col :span="7">
                  <div>
                    <span
                      style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >{{ istypes[2] == 1 ? "市场地址：" : "经营地址：" }}</span
                    ><span
                      style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                      >{{ formData.marketaddress }}</span
                    >
                  </div>
                </el-col>
              </el-row>
              <el-row style="margin-top: 10px" v-if="istypes[4] == 1">
                <el-col :span="7">
                  <div>
                    <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >档口名称：</span
                    ><span
                      style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                      >{{ formData.stallsName }}</span
                    >
                  </div>
                </el-col>
                <el-col :span="7">
                  <div>
                    <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >档口位置：</span
                    ><span
                      style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                      >{{ formData.stllPlace }}</span
                    >
                  </div>
                </el-col>
              </el-row>
              <el-row style="margin-top: 10px">
                <el-col :span="24">
                  <div>
                    <span
                      style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >{{ istypes[7] == 1 ? "经营范围：" : "经营内容：" }}</span
                    ><span
                      style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                      >{{ formData.categories }}</span
                    >
                    <el-button type="text" style="margin-left: 10px"
                      >编辑</el-button
                    >
                  </div>
                </el-col>
              </el-row>
              <el-row style="margin-top: 10px">
                <el-col :span="24">
                  <div class="flex_dom flex_item_start">
                    <span
                      style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >{{
                        istypes[9] == 1
                          ? "档口图片："
                          : istypes[10] == 1
                          ? "门店照片："
                          : "产地图片"
                      }}</span
                    >
                    <div>
                      <el-image
                        v-for="(item, index) in formData.stall_url"
                        :key="index"
                        style="width: 164px; height: 106px; margin-right: 15px"
                        :src="item"
                        :preview-src-list="formData.stall_url"
                        fit="fill"
                      ></el-image>
                    </div>
                  </div>
                </el-col>
              </el-row>
              <el-row style="margin-top: 10px">
                <el-col :span="24">
                  <div class="flex_dom flex_item_start">
                    <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >租赁合同：</span
                    >
                    <div>
                      <el-image
                        v-for="(item, index) in formData.contract_url"
                        :key="index"
                        style="width: 106px; height: 164px; margin-right: 15px"
                        :src="item"
                        :preview-src-list="formData.contract_url"
                        fit="fill"
                      ></el-image>
                    </div>
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane label="套餐信息" name="2">
              <div>
                <div
                  style="
                    color: rgba(1, 6, 33, 0.9);
                    font-size: 16px;
                    font-weight: 700;
                  "
                >
                  套餐信息
                </div>
              </div>

              <div
                style="
                  color: rgba(1, 6, 33, 0.55);
                  font-size: 12px;
                  margin-top: 8px;
                "
              >
                如需续费/更换套餐请使用移动端登录主账户，在【我的】—【我的信息】中操作
              </div>

              <el-row style="margin-top: 15px">
                <el-col :span="7">
                  <div>
                    <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >当前套餐：</span
                    ><span
                      style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                      >{{ handleMtype(formData1.modelList) }}</span
                    >
                  </div>
                </el-col>
                <el-col :span="7">
                  <div>
                    <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >账户到期时间：</span
                    ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                      >{{ formData1.memberLastDate | parseTime() }} (剩余{{
                        formData2.lastDay
                      }}天)</span
                    >
                  </div>
                </el-col>
              </el-row>

              <el-row style="margin-top: 15px">
                <el-col :span="24">
                  <div>
                    <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                      >经营范围：</span
                    ><span
                      style="color: rgba(1, 6, 33, 0.9); font-size: 14px"
                      >{{ formData.categories }}</span
                    >
                  </div>
                </el-col>
              </el-row>
            </el-tab-pane>
            <el-tab-pane
              label="副账户信息"
              name="3"
              v-if="formData2.account == 1"
            >
              <div>
                <div
                  style="
                    color: rgba(1, 6, 33, 0.9);
                    font-size: 16px;
                    font-weight: 700;
                  "
                >
                  副账户({{ formData2.userCount }}/{{
                    formData2.subAccountCount
                  }})
                </div>
                <div style="float: right">
                  <el-button type="primary" size="small" @click="handleAdd"
                    >添加</el-button
                  >
                </div>
              </div>

              <div
                style="
                  color: rgba(1, 6, 33, 0.55);
                  font-size: 12px;
                  margin-top: 8px;
                  margin-bottom: 10px;
                "
              >
                如需购买副账户请使用移动端登录主账户，在【我的】—【我的信息】中操作
              </div>

              <u-table
                ref="plTable"
                class="utable"
                :height="$store.getters.screenHeight - 465 + 'px'"
                :border="false"
                :header-row-style="{ height: '46px' }"
                :header-cell-style="{
                  padding: '0px 0px',
                  'font-size': '14px',
                  color: 'rgba(1, 6, 33, 0.65)',
                  background: 'rgba(0, 0, 0, 0.02)',
                }"
                :row-style="{ height: '46px' }"
                :cell-style="{
                  padding: '0px 0px',
                  'font-size': '14px',
                  color: 'rgba(1, 6, 33, 0.7)',
                  height: '46px',
                }"
                use-virtual
                :row-height="46"
                showBodyOverflow="tooltip"
                showHeaderOverflow="title"
                :data="formData2.userInfoSubs"
              >
                <template slot="empty"> 没有查询到符合条件的记录 </template>
                <u-table-column
                  v-for="(item, index) in columns"
                  :key="index"
                  :resizable="item.resizable"
                  :show-overflow-tooltip="true"
                  :prop="item.prop"
                  :label="item.label"
                  :fixed="item.fixed"
                  :width="item.width"
                  :align="item.align"
                  header-align="left"
                  :sortable="item.sortable"
                >
                  <template slot-scope="scope">
                    <span v-if="item.prop == 'isStop'">
                      <span
                        v-if="scope.row[item.prop] == 0"
                        style="color: #0ba198"
                        >已启用</span
                      >
                      <span v-else style="color: rgba(1, 6, 33, 0.35)"
                        >未启用</span
                      >
                    </span>
                    <span v-else>{{ scope.row[item.prop] }}</span>
                  </template>
                </u-table-column>

                <u-table-column label="操作" align="left" width="200">
                  <template slot-scope="scope">
                    <el-button
                      type="text"
                      @click="handleBtn('editBtn', scope.row)"
                      >编辑</el-button
                    >
                    <el-button type="text" @click="handleChange(scope.row)"
                      >重置密码</el-button
                    >
                    <el-button
                      type="text"
                      @click="handleBtn('isStopBtn', scope.row)"
                      :style="{
                        color: scope.row.isStop == 1 ? '#0ba198' : '#DD4C4D',
                      }"
                      >{{ scope.row.isStop == 1 ? "启用" : "停用" }}</el-button
                    >
                    <el-button
                      type="text"
                      @click="handleBtn('delBtn', scope.row)"
                      >删除</el-button
                    >
                  </template>
                </u-table-column>
              </u-table>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div
          v-if="activeName == '1'"
          style="background: #fff; padding: 20px; margin-top: 20px"
        >
          <el-tag
            type="warning"
            style="width: 100%; margin: 0px 0px 15px"
            v-if="formData.passStatus == 0"
          >
            {{ formData.isMerchant == 1 ? "企业" : "用户" }}信息修改
            审核中</el-tag
          >
          <el-tag
            type="danger"
            style="width: 100%; margin: 0px 0px 15px"
            v-if="formData.passStatus == 2"
          >
            <div class="flex_dom flex_item_between">
              <span
                >{{ formData.isMerchant == 1 ? "企业" : "用户" }}信息修改
                审核未通过</span
              >
              <span style="cursor: pointer">前去处理</span>
            </div>
          </el-tag>

          <div class="flex_dom flex_item_between flex_item_mid">
            <div
              style="
                color: rgba(1, 6, 33, 0.9);
                font-size: 16px;
                font-weight: 700;
              "
            >
              {{ formData.isMerchant == 1 ? "企业" : "个人" }}信息
            </div>

            <el-button
              type="primary"
              size="small"
              v-if="formData.passStatus == 1 && formData2.account == 1"
              >更改
            </el-button>
          </div>

          <el-row style="margin-top: 15px">
            <el-col :span="7">
              <div>
                <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px">{{
                  formData.isMerchant == 1 ? "企业名称：" : "姓名"
                }}</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                  {{
                    formData.isMerchant == 1
                      ? formData2.companyName
                      : formData2.personName
                  }}</span
                >
              </div>
            </el-col>
            <el-col :span="7">
              <div>
                <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px">{{
                  formData.isMerchant == 1 ? "统一社会信用代码：" : "身份证号"
                }}</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">
                  {{
                    formData.isMerchant == 1
                      ? formData.creditCode
                      : formData.agentCard
                  }}
                </span>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px" v-if="formData.isMerchant == 1">
            <el-col :span="24">
              <div class="flex_dom flex_item_start">
                <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >营业执照：</span
                >
                <div>
                  <el-image
                    v-for="(item, index) in formData.business_url"
                    :key="index"
                    style="width: 164px; height: 106px; margin-right: 15px"
                    :src="item || ''"
                    :preview-src-list="formData.business_url"
                    fit="fill"
                  ></el-image>
                </div>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px" v-if="formData.isMerchant == 1">
            <el-col :span="7">
              <div>
                <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >法人姓名：</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                  formData.blamePersonName
                }}</span>
              </div>
            </el-col>
            <el-col :span="7">
              <div>
                <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >法人身份证号码：</span
                ><span style="color: rgba(1, 6, 33, 0.9); font-size: 14px">{{
                  formData.blamePersonId
                }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <el-col :span="24">
              <div class="flex_dom flex_item_start">
                <span style="color: rgba(1, 6, 33, 0.55); font-size: 14px"
                  >身份证照片：</span
                >
                <span>
                  <el-image
                    v-for="(item, index) in formData.idcardA_url"
                    :key="index"
                    style="width: 164px; height: 106px; margin-right: 15px"
                    :src="item"
                    :preview-src-list="formData.idcardA_url"
                    fit="fill"
                  ></el-image>
                </span>
                <span>
                  <el-image
                    v-for="(item, index) in formData.idcardB_url"
                    :key="index"
                    style="width: 164px; height: 106px; margin-right: 15px"
                    :src="item"
                    :preview-src-list="formData.idcardB_url"
                    fit="fill"
                  ></el-image>
                </span>
              </div>
            </el-col>
          </el-row>
        </div>
      </el-scrollbar>

      <el-dialog
        title="提示"
        :visible.sync="isVisiableTwo"
        :close-on-click-modal="false"
        :before-close="closeDel"
        top="50px"
        width="40%"
      >
        <!-- 确认修改副账户信息-->
        <div v-if="btnType == 'editBtn'">确认修改副账户信息？</div>
        <!-- 确认停用该账户-->
        <div v-if="btnType == 'isStopBtn' && myObj.isStop == 0">
          确认停用该账户？<br />停用账户后，该账户将无法登录。可通过启用恢复账户。
        </div>
        <!-- 确认启用该账户-->
        <div v-if="btnType == 'isStopBtn' && myObj.isStop == 1">
          确认启用该账户？<br />启用账户后，该账户将恢复原有权限。
        </div>
        <div v-if="btnType == 'delBtn'">
          确认删除该账户？ <br />
          删除账户后，将撤销该用户权限并无法登录和恢复。
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeDel">取 消</el-button>
          <el-button type="primary" @click="submitDel">确 定</el-button>
        </div>
      </el-dialog>
      <!-- 修改副账户 -->
      <el-dialog
        title="修改副账户"
        :visible.sync="isVisiableEdit"
        :close-on-click-modal="false"
        :before-close="closeEdit"
        top="50px"
        width="40%"
      >
        <el-form
          :model="ruleForm"
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          label-position="right"
          style="padding: 0px 65px 12px"
        >
          <el-form-item label="姓名:" prop="userName">
            <el-input
              v-model="ruleForm.userName"
              placeholder="请输入"
              maxlength="10"
            ></el-input>
          </el-form-item>
          <el-form-item label="身份证号码:" prop="personCard">
            <el-input
              v-model="ruleForm.personCard"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="登录手机号:" prop="account">
            <el-input
              v-model="ruleForm.account"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注:" prop="remark">
            <el-input
              type="textarea"
              v-model="ruleForm.remark"
              rows="4"
              placeholder="请输入备注"
              maxlength="20"
            >
            </el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeEdit">取 消</el-button>
          <el-button type="primary" @click="submitEdit">确 定</el-button>
        </div>
      </el-dialog>

      <!-- 重置密码 -->
      <el-dialog
        title="重置密码"
        :visible.sync="isVisiableChange"
        :close-on-click-modal="false"
        :before-close="closeChange"
        top="50px"
        width="40%"
      >
        <el-form
          :model="ruleForm1"
          :rules="rules1"
          ref="ruleForm1"
          label-width="100px"
          label-position="right"
          style="padding: 0px 65px 12px"
        >
          <el-form-item label="姓名:"
            >{{ ruleForm1.userName }}
            <!-- <span v-model="ruleForm1.userName"></span> -->
          </el-form-item>
          <el-form-item label="登录手机号:"
            >{{ ruleForm1.account }}
            <!-- <span v-model="ruleForm1.account"></span> -->
          </el-form-item>
          <el-form-item label="重置密码:" prop="password">
            <el-input
              v-model="ruleForm1.password"
              placeholder="请输入"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="closeChange">取 消</el-button>
          <el-button type="primary" @click="submitChange">确 定</el-button>
        </div>
      </el-dialog>
    </div>

    <addsecondAccount
      ref="addsecondAccount"
      @handleaddsecond="getInformation"
    ></addsecondAccount>
  </Container>
</template>

<script>
import elementResizeDetectorMaker from "element-resize-detector";
import {
  personal,
  updateManagementLoad,
  information,
  accountManagement,
  stopUseUserSub, // 副账户停用
  startUseUserSub, //副账户启用
  deleteUserSub, // 副账户删除
  updateUserSub, // 副账户编辑
  resetUserSubPassword, // 副账户重置密码
} from "@/request/api/personalCenter";
export default {
  name: "personalCenter",
  components: {
    addsecondAccount: () => import("./dialogmod/addsecondAccount.vue"), // 添加副账户
  },
  data() {
    var validatePass1 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("姓名格式不正确"));
      } else {
        callback();
      }
    };
    var validatePass2 = (rule, value, callback) => {
      var password1 =
        /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
      if (value === "" || !password1.test(value)) {
        callback(new Error("身份证号码格式不正确"));
      } else {
        callback();
      }
    };
    var validatePass3 = (rule, value, callback) => {
      var password1 =
        /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/;
      if (value === "" || !password1.test(value)) {
        callback(new Error("手机号格式不正确"));
      } else {
        callback();
      }
    };
    var validatePass4 = (rule, value, callback) => {
      var password1 = /^[0-9a-zA-Z]{6,15}$/;
      if (value === "" || !password1.test(value)) {
        callback(new Error("请输入6~15位数字、字母组合"));
      } else {
        callback();
      }
    };
    return {
      rules1: {
        password: [
          {
            validator: validatePass4,
            required: true,
            trigger: "blur",
          },
        ],
      },
      isVisiableChange: false,
      myObj: {},
      myObj1: {},
      ruleForm: {
        userName: "",
        personCard: "",
        account: "",
        remark: "",
        subId: "",
      },
      ruleForm1: {
        userName: "",
        account: "",
        password: "",
        subId: "",
      },
      rules: {
        userName: [
          {
            validator: validatePass1,
            required: true,
            trigger: "blur",
          },
        ],
        personCard: [
          {
            validator: validatePass2,
            required: true,
            trigger: "blur",
          },
        ],
        account: [
          {
            validator: validatePass3,
            required: true,
            trigger: "blur",
          },
        ],
      },
      btnType: "", // 具体的按钮类型
      btnType1: "", // 按钮类型弹框内的
      isVisiableTwo: false,
      isVisiableEdit: false,
      SetHeight: 0,
      activeName: "1",
      imgurl: require("@/assets/image/imgs/portrait.png"),
      isagain: 0,
      formData: {},
      formData1: {},
      formData2: {},
      formData3: [],
      isType: false,
      columns: [
        {
          width: 80,
          prop: "userName",
          label: "姓名",
          align: "left",
        },
        {
          // width: 170,
          prop: "personCard",
          label: "身份证号码",
          align: "left",
        },
        {
          // width: 170,
          prop: "userAccount",
          label: "登录手机号",
          align: "left",
        },
        {
          // width: 170,
          prop: "isStop",
          label: "状态",
          align: "left",
        },
        {
          // width: 170,
          prop: "remark",
          label: "备注",
          align: "left",
        },
      ],
    };
  },
  computed: {
    istypes() {
      // 市场名称 实体名称 市场地址 经营地址 档口名称 档口位置 套餐信息 经营范围 经营内容 档口图片 门店照片 产地图片 租赁合同 企业信息(全部) 用户信息(全部)
      //经营户,供货商-市场销售,供货商-产地销售,采购商-农贸市场,采购商-生鲜超市,采购商-食堂饭店

      //"merchanttypecode": 2,  # 用户身份标识，1:经营户，2：采购户，3：供货商
      //"purchasetype": 1,   # 采购户类型(用户为采购户时才有值)，1：食堂/饭店，2：生鲜超市，3：农贸市场
      //"supplytype": null, # 供应商类型(用户为供应商时有值)，0：市场销售，1：产地销售
      let dataP = [];
      if (this.formData.merchanttypecode == 1) {
        dataP = [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1];
      } else if (
        this.formData.merchanttypecode == 3 &&
        this.formData.supplytype == 0
      ) {
        dataP = [1, 0, 1, 0, 1, 1, 1, 1, 0, 1, 0, 0, 1, 1, 1];
      } else if (
        this.formData.merchanttypecode == 3 &&
        this.formData.supplytype == 1
      ) {
        dataP = [0, 1, 0, 1, 0, 0, 1, 1, 0, 0, 0, 1, 1, 1, 1];
      } else if (
        this.formData.merchanttypecode == 2 &&
        this.formData.purchasetype == 3
      ) {
        dataP = [1, 0, 1, 0, 1, 1, 1, 0, 1, 1, 0, 0, 1, 1, 1];
      } else if (
        this.formData.merchanttypecode == 2 &&
        this.formData.purchasetype == 2
      ) {
        dataP = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1];
      } else if (
        this.formData.merchanttypecode == 2 &&
        this.formData.purchasetype == 1
      ) {
        dataP = [0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 1, 1];
      }
      return dataP;
    },
  },
  methods: {
    submitChange() {
      resetUserSubPassword(this.ruleForm1).then((res) => {
        this.$message.success(res.msg);
        this.isVisiableChange = false;
        this.getInformation();
        this.ruleForm1.password = "";
      });
    },
    handleChange(val) {
      this.myObj1 = val;
      this.ruleForm1.subId = val.UserinfosubsId;
      this.ruleForm1.userName = val.userName;
      this.ruleForm1.account = val.userAccount;
      this.isVisiableChange = true;
    },
    closeChange() {
      this.isVisiableChange = false;
    },
    submitEdit() {
      updateUserSub(this.ruleForm).then((res) => {
        this.isVisiableEdit = false;
        this.getInformation();
      });
    },
    closeEdit() {
      this.isVisiableEdit = false;
    },
    closeDel() {
      this.isVisiableTwo = false;
    },
    submitDel() {
      if (this.btnType == "delBtn") {
        deleteUserSub({
          subId: this.myObj.UserinfosubsId,
        }).then((res) => {
          this.$message.success(res.msg);
          this.isVisiableTwo = false;
          this.getInformation();
        });
      } else if (this.btnType == "editBtn") {
        this.isVisiableTwo = false;
        this.isVisiableEdit = true;
      } else if (this.btnType == "isStopBtn") {
        if (this.myObj.isStop == 1) {
          startUseUserSub({
            subId: this.myObj.UserinfosubsId,
          }).then((res) => {
            this.$message.success(res.msg);
            this.isVisiableTwo = false;
            this.getInformation();
          });
        } else if (this.myObj.isStop == 0) {
          stopUseUserSub({
            subId: this.myObj.UserinfosubsId,
          }).then((res) => {
            this.$message.success(res.msg);
            this.isVisiableTwo = false;
            this.getInformation();
          });
        }
      }
    },
    handleBtn(btnType, row) {
      this.myObj = row;
      this.ruleForm.userName = row.userName;
      this.ruleForm.personCard = row.personCard;
      this.ruleForm.remark = row.remark;
      this.ruleForm.account = row.userAccount;
      this.ruleForm.subId = row.UserinfosubsId;
      this.btnType = btnType; // 具体的按钮
      this.isVisiableTwo = true;
    },
    handleAdd() {
      if (!(this.formData2.userCount < this.formData2.subAccountCount)) {
        this.$alert(
          "您的副账户名额已用完,请在APP上使用主账户购买副账户名额。",
          "提示",
          {
            confirmButtonText: "确定",
            type: "warning",
            callback: (action) => {},
          }
        );
      } else {
        this.$refs["addsecondAccount"].isVisiable = true;
      }
    },
    setPassword(form) {
      this.$router.push({
        path: form,
      });
    },
    getPersonal() {
      let param = {
        isagain: this.isagain,
      };
      personal(param).then((res) => {
        if (res.status == 200) {
          this.formData = res.data[0];
        }
      });
    },
    getUpdateManagementLoad() {
      updateManagementLoad().then((res) => {
        if (res.status == 200) {
          this.formData1 = res.data[0];
        }
      });
    },
    getInformation() {
      information().then((res) => {
        if (res.status == 200) {
          this.formData2 = res.data[0];
        }
      });
    },
    getAccountManagement() {
      accountManagement().then((res) => {
        if (res.status == 200) {
          this.formData3 = res.data;
          this.isType = false;
          for (let i = 0; i < this.formData3.length; i++) {
            const el = this.formData3[i];
            if (el.isType == 0) {
              this.isType = true;
            }
          }
        }
      });
    },
    // 切换账户登录
    openLogin(val) {
      this.$confirm("确认切换账户?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$store
            .dispatch("user/accountSwitchLogin", val)
            .then(() => {
              this.$store
                .dispatch("tagsView/delAllViews", null)
                .then(({ visitedViews }) => {
                  this.$router.push({
                    path: "/",
                  });
                });
            })
            .catch((err) => {});
        })
        .catch(() => {});
    },
    handleMtype(val) {
      if (val) {
        let param = "";
        for (let i = 0; i < val.length; i++) {
          const el = val[i];
          if (el.choMerchantType == 1) {
            param += el.merchantTypeName + "-套餐";
            let paramL = [];
            for (let j = 0; j < el.taocanInfo.length; j++) {
              const ele = el.taocanInfo[j];
              if (ele.choMerchantType == 1) {
                paramL.push(ele.typeId);
              }
            }
            param += paramL.join("+");
          }
        }

        return param;
      } else {
        return "";
      }
    },
    handleClick(tab, event) {
      // console.log(tab, event);
    },
    setMemberLastDate(val) {
      const date = new Date(val);
      if (date.getTime() < Date.now() / 1000) {
        return "已过期";
      } else {
        return "";
      }
    },
    handlerSetHeight(val) {
      const erdm = elementResizeDetectorMaker();
      erdm.listenTo(this.$refs[val], (element) => {
        setTimeout(() => {
          this.SetHeight = element.getBoundingClientRect().top;
          // this.nextTick(() => {
          //解决滚动条初始化消失的问题
          this.$refs.scrollDiv.update();
          // });
        }, 20);
      });
    },
  },
  created() {
    this.getPersonal();
    this.getUpdateManagementLoad();
    this.getInformation();
    this.getAccountManagement();
  },
  mounted() {
    this.handlerSetHeight("currentBasketDetailsTable");
  },
};
</script>

<style lang="scss" scoped>
.personalCenterModel {
  .utable {
    width: 100%;
    // border: 1px solid #E9E9E9;
    border-top: 1px solid #e9e9e9;
    border-left: 1px solid #e9e9e9;
    border-right: 1px solid #e9e9e9;
  }
}
</style>
<style lang="scss">
.personalCenterModel {
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
}

.popperClass {
  .personHeader:hover {
    background: #f5f5f5;
  }

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
}
</style>