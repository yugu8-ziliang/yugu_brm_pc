<template>
    <!-- 密码设置 -->
    <Page>
        <template>
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="登录密码" name="1" style="padding:24px 0px 0px 102px;">
                    <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px"
                        style="width:40%" class="demo-ruleForm">
                        <el-form-item label="登录密码：" prop="password" style="margin-bottom:36px">
                            <el-input v-model="ruleForm.password" :type="passwordType" autocomplete="on" ref="password"
                                placeholder="请输入6~18位数字、字母组合" tabindex="2" clearable>
                                <svg-icon slot="suffix" :iconClass="passwordType === 'password' ? 'eye' : 'eye-open'"
                                    @click="showPassword" />
                            </el-input>
                            <!-- <div v-if="isSshow" style="font-size: 13px;color: rgba(1,6,33,0.35);">请输入6~18位数字、字母组合</div> -->
                        </el-form-item>
                        <el-form-item label="确认密码：" prop="checkPass" style="margin-bottom:36px">
                            <el-input v-model="ruleForm.checkPass" :type="checkPassType" autocomplete="on"
                                ref="checkPass" placeholder="请输入" tabindex="2" clearable>
                                <svg-icon slot="suffix" :iconClass="checkPassType === 'password' ? 'eye' : 'eye-open'"
                                    @click="checkshowPassword" />
                            </el-input>
                        </el-form-item>
                        <el-form-item label="验证码：" prop="phonecode" style="margin-bottom:40px">
                            <div class="code-boxver">
                                <el-input v-model.number="ruleForm.phonecode" placeholder="请输入" auto-complete="off"
                                    clearable></el-input>
                                <el-button :disabled="codeDis" class="login-codever" @click="getCodever">
                                    {{ codeDis ? codeDisTime + "s" : "获取验证码" }}</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm')">确认提交</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="支付密码" name="2" style="padding:24px 0px 0px 102px;">
                    <el-form :model="payruleForm" status-icon :rules="payrules" ref="payruleForm" label-width="100px"
                        style="width:40%" class="demo-ruleForm">
                        <el-form-item label="支付密码：" prop="paypassword" style="margin-bottom:36px">
                            <el-input v-model="payruleForm.paypassword" :type="paypasswordType" autocomplete="on"
                                ref="paypassword" placeholder="请输入6位数字" tabindex="2" clearable>
                                <svg-icon slot="suffix" :iconClass="paypasswordType === 'password' ? 'eye' : 'eye-open'"
                                    @click="payshowPassword" />
                            </el-input>
                        </el-form-item>
                        <el-form-item label="确认密码：" prop="paycheckPass" style="margin-bottom:36px">
                            <el-input v-model="payruleForm.paycheckPass" :type="paycheckPassType" ref="paycheckPass"
                                autocomplete="on" placeholder="请输入" tabindex="2" clearable>
                                <svg-icon slot="suffix"
                                    :iconClass="paycheckPassType === 'password' ? 'eye' : 'eye-open'"
                                    @click="paycheckshowPassword" />
                            </el-input>
                        </el-form-item>
                        <el-form-item label="验证码：" prop="payphonecode" style="margin-bottom:40px">
                            <div class="code-boxver">
                                <el-input v-model.number="payruleForm.payphonecode" placeholder="请输入"
                                    auto-complete="off" clearable></el-input>
                                <el-button :disabled="codeDis" class="login-codever" @click="getCodever">
                                    {{ codeDis ? codeDisTime + "s" : "获取验证码" }}</el-button>
                            </div>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="paysubmitForm('payruleForm')">确认提交</el-button>
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
            </el-tabs>
        </template>
    </Page>
</template>

<script>
    import {
        getCodever,
        changePassword,
        changePayPassword
    } from "@/request/api/login";
    export default {
        name: "passwordSettings",
        data() {
            var phonecodeCheck = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('验证码失效或不存在'));
                }
            };
            var validatePass = (rule, value, callback) => {
                var password1 = /^[0-9a-zA-Z]{6,18}$/
                if (value === '' || !password1.test(value)) {
                    // callback(new Error('请输入6~18位数字、字母组合'));
                    // this.isSshow = true;
                    callback(new Error('请输入6~18位数字、字母组合'));
                } else {
                    // this.isSshow = false;
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.ruleForm.password) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            var payphonecodeCheck = (rule, value, callback) => {
                if (!value) {
                    return callback(new Error('验证码失效或不存在'));
                }
            };
            var payvalidatePass = (rule, value, callback) => {
                var paypassword1 = /^\d{6}$/
                if (value === '' || !paypassword1.test(value)) {
                    callback(new Error('请输入6位数字'));
                } else {
                    callback();
                }
            };
            var payvalidatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.payruleForm.paypassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                passwordType: "password",
                checkPassType: "password",
                paypasswordType: "password",
                paycheckPassType: "password",
                codeDis: false,
                codeDisTime: 60,
                activeName: $route.query.active || '1',
                ruleForm: {
                    password: '',
                    checkPass: '',
                    phonecode: ''
                },
                payruleForm: {
                    paypassword: '',
                    paycheckPass: '',
                    payphonecode: ''
                },
                rules: {
                    password: [{
                        validator: validatePass,
                        trigger: 'blur'
                    }],
                    checkPass: [{
                        validator: validatePass2,
                        trigger: 'blur'
                    }],
                    phonecode: [{
                        validator: phonecodeCheck,
                        trigger: 'blur'
                    }]
                },
                payrules: {
                    paypassword: [{
                        validator: payvalidatePass,
                        trigger: 'blur'
                    }],
                    paycheckPass: [{
                        validator: payvalidatePass2,
                        trigger: 'blur'
                    }],
                    payphonecode: [{
                        validator: payphonecodeCheck,
                        trigger: 'blur'
                    }]
                }
            };
        },
        methods: {
            showPassword() {
                this.passwordType = this.passwordType === "password" ? "" : "password";
                this.$nextTick(() => {
                    this.$refs.password.focus();
                });
            },
            checkshowPassword() {
                this.checkPassType = this.checkPassType === "password" ? "" : "password";
                this.$nextTick(() => {
                    this.$refs.checkPass.focus();
                });
            },
            payshowPassword() {
                this.paypasswordType = this.paypasswordType === "password" ? "" : "password";
                this.$nextTick(() => {
                    this.$refs.paypassword.focus();
                });
            },
            paycheckshowPassword() {
                this.paycheckPassType = this.paycheckPassType === "password" ? "" : "password";
                this.$nextTick(() => {
                    this.$refs.paycheckPass.focus();
                });
            },
            // 获取验证码
            getCodever() {
                getCodever().then((res) => {
                    if (res.status == 200) {
                        this.$message.success(res.msg);
                        this.codeDis = true;
                        var authTimer = setInterval(() => {
                            this.codeDisTime--;
                            if (this.codeDisTime <= 0) {
                                this.codeDisTime = this.$options.data().codeDisTime;
                                this.codeDis = false;
                                clearInterval(authTimer);
                            }
                        }, 1000);
                    }
                });
            },
            handleClick(tab, event) {},
            submitForm(formName) {
                changePassword({
                    phoneCode: this.ruleForm.phonecode,
                    passWord: this.ruleForm.password
                }).then((res) => {
                    if (res.status == 200) {
                        this.$message.success(res.msg);
                    }
                })
            },
            paysubmitForm(payformName) {
                changePayPassword({
                    phoneCode: this.payruleForm.payphonecode,
                    passWord: this.payruleForm.paypassword
                }).then((res) => {
                    if (res.status == 200) {
                        this.$message.success(res.msg);
                    }
                })
            },
            created() {},
        }
    }
</script>

<style lang="scss" scoped>
    .code-boxver {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .login-codever {
        width: auto;
        margin-left: 10px;
        height: 36px;
    }

    ::v-deep .el-tabs--top .el-tabs__item.is-top:nth-child(2),
    .el-tabs--top .el-tabs__item.is-bottom:nth-child(2),
    .el-tabs--bottom .el-tabs__item.is-top:nth-child(2),
    .el-tabs--bottom .el-tabs__item.is-bottom:nth-child(2) {
        padding-left: 25px;
    }

    ::v-deep .el-form-item__content {
        line-height: 26px;
    }
</style>