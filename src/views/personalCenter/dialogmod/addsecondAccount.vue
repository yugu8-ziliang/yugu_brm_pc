<template>
    <!-- 添加副账户 -->
    <div>
        <el-dialog title="添加副账户" :visible.sync="isVisiable" :close-on-click-modal="false" :before-close="close"
            top="50px" width="40%">
            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" label-position="right"
                style="padding:0px 65px 12px">
                <el-form-item label="姓名:" prop="userName">
                    <el-input v-model="ruleForm.userName" placeholder="请输入" maxlength="10"></el-input>
                </el-form-item>
                <el-form-item label="身份证号码:" prop="personCard">
                    <el-input v-model="ruleForm.personCard" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="登录手机号:" prop="account">
                    <el-input v-model="ruleForm.account" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="登录密码:" prop="password">
                    <el-input v-model="ruleForm.password" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="备注:" prop="remark">
                    <el-input type="textarea" v-model="ruleForm.remark" rows="4" placeholder="请输入备注" maxlength="20">
                    </el-input>
                </el-form-item>
            </el-form>
            <div style="color: #DD4C4D;line-height: 26px;">
                注：副账户不能操作以下权限，其余权限和主帐户一致 <br> 1、修改经营信息和经营范围 <br> 2、套餐续费、更换套餐、购买副账户名额 <br> 3、新建副账户、修改副账户信息 <br> 4、修改支付密码
                <br> 5、修改主账户头像
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="close">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </div>
        </el-dialog>


        <el-dialog title="提示" :visible.sync="isVisiableTishi" :close-on-click-modal="false" :before-close="closeTishi"
            top="50px" width="40%">
            <div>确认添加该账户？</div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeTishi">取 消</el-button>
                <el-button type="primary" @click="submitForm1">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {
        newUserSub
    } from "@/request/api/personalCenter";
    export default {
        name: "addsecondAccount",
        data() {
            var validatePass1 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('姓名格式不正确'));
                } else {
                    callback();
                }
            };
            var validatePass2 = (rule, value, callback) => {
                var password1 =
                    /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
                if (value === '' || !password1.test(value)) {
                    callback(new Error('身份证号码格式不正确'));
                } else {
                    callback();
                }
            };
            var validatePass3 = (rule, value, callback) => {
                var password1 = /^1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}$/
                if (value === '' || !password1.test(value)) {
                    callback(new Error('手机号格式不正确'));
                } else {
                    callback();
                }
            };
            var validatePass4 = (rule, value, callback) => {
                var password1 = /^[0-9a-zA-Z]{6,15}$/
                if (value === '' || !password1.test(value)) {
                    callback(new Error('请输入6~15位数字、字母组合'));
                } else {
                    callback();
                }
            };
            return {
                isVisiable: false,
                isVisiableTishi: false,
                ruleForm: {
                    userName: '',
                    personCard: '',
                    account: '',
                    password: '',
                    remark: '',
                },
                rules: {
                    userName: [{
                        validator: validatePass1,
                        required: true,
                        trigger: 'blur'
                    }, ],
                    personCard: [{
                        validator: validatePass2,
                        required: true,
                        trigger: 'blur'
                    }],
                    account: [{
                        validator: validatePass3,
                        required: true,
                        trigger: 'blur'
                    }],
                    password: [{
                        validator: validatePass4,
                        required: true,
                        trigger: 'blur'
                    }]
                }
            };
        },
        methods: {
            submitForm() {
                this.$refs.ruleForm.validate(valid => {
                    if (valid) {
                        this.isVisiableTishi = true;
                    }
                })
            },
            submitForm1() {
                newUserSub(this.ruleForm).then(res => {
                    console.log(res);
                    this.$message.success(res.msg);
                    this.$emit('handleaddsecond');
                    this.isVisiable = false;
                    this.isVisiableTishi = false;
                })


            },
            // 关闭事件
            close(val) {
                if (!val) {
                    this.$emit("close");
                }
                this.isVisiable = false;
            },
            closeTishi(val) {
                this.isVisiableTishi = false;
            },
        },
    };
</script>

<style scoped lang="scss">
</style>