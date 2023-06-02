<template>
    <!-- 我要反馈 -->
    <Page>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm"
            label-position="top">
            <el-form-item label="问题分类" prop="feedBackType">
                <el-tag effect="plain" :type="tags == '0' ? '' : 'info'" @click="handeltags('0')">功能异常</el-tag>
                <el-tag effect="plain" :type="tags == '1' ? '' : 'info'" @click="handeltags('1')"
                    style="margin:0px 16px">产品体验</el-tag>
                <el-tag effect="plain" :type="tags == '2' ? '' : 'info'" @click="handeltags('2')">其他</el-tag>
            </el-form-item>
            <el-form-item label="反馈建议" prop="remark">
                <el-input type="textarea" v-model="ruleForm.remark" style="width:40%" placeholder="请输入"></el-input>
            </el-form-item>
        </el-form>
        <div style="margin-bottom:20px">
            图片：
        </div>
        <el-upload list-type="picture-card" :auto-upload="false" accept="image/*" action=" " :on-change="beforeUpload"
            :on-remove="removeUpload" :on-preview="handlePictureCardPreview" :file-list="ruleForm.transimageList"
            class="uploadImage" ref="upload">
            <i class="el-icon-plus"></i>
        </el-upload>
        <div class="btnBottom">
            <div class="flex_row_reverse flex_item_mid" style="margin-right: 16px">
                <el-button type="primary" @click="handleAdd">提 交</el-button>
            </div>
        </div>


        <el-dialog title="提示" :visible.sync="isVisiable" :close-on-click-modal="false" :before-close="closeSure"
            top="50px" width="40%">
            <!-- 确认启用该账户-->
            <div>提交成功<br> 感谢您对农批管家的支持，我们将尽快跟进</div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitSure('/index')">确 定</el-button>
            </div>
        </el-dialog>
    </Page>
</template>

<script>
    import {
        userFeedBack
    } from "@/request/api/login";
    export default {
        name: "wantFeedback",
        data() {
            return {
                isVisiable: false,
                tags: '0',
                ruleForm: {
                    remark: '',
                    feedBackType: 0,
                    transimageList: []
                },
                rules: {
                    remark: [{
                        required: true,
                        message: '请填写反馈建议',
                        trigger: 'blur'
                    }],
                    feedBackType: [{
                        required: true,
                        trigger: 'change'
                    }],
                }
            };
        },
        methods: {
            handeltags(id) {
                this.tags = id
                this.ruleForm.feedBackType = this.tags
            },
            closeSure() {
                this.isVisiable = false;
            },
            submitSure(form) {
                this.isVisiable = false;
                this.$router.push({
                    path: form,
                });
            },
            handleAdd() {
                const formData = new FormData();
                for (let i = 0; i < this.ruleForm.transimageList.length; i++) {
                    formData.append("feedBackImages", this.ruleForm.transimageList[i].raw);
                }
                formData.append("feedBackType", this.ruleForm.feedBackType);
                formData.append("remark", this.ruleForm.remark);
                userFeedBack(formData).then(res => {
                })
                this.isVisiable = true;
            },
            // 上传文件
            beforeUpload(file, fileList) {
                this.ruleForm.transimageList = fileList;
                this.dialogImageUrlList = [];
                for (let index = 0; index < fileList.length; index++) {
                    const el = fileList[index];
                    this.dialogImageUrlList.push(el.url);
                }
            },
            removeUpload(file, fileList) {
                this.ruleForm.transimageList = fileList;
                this.dialogImageUrlList = [];
                for (let index = 0; index < fileList.length; index++) {
                    const el = fileList[index];
                    this.dialogImageUrlList.push(el.url);
                }
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },
        },
        created() {},
    };
</script>

<style lang="scss" scoped>
    .btnBottom {
        border-top: 1px solid rgba(233, 233, 233, 1);
        padding-top: 10px;
        width: 100%;
        position: absolute;
        bottom: 10px;
        left: 0px;
        right: 10px;
    }

    ::v-deep .el-form-item.is-required:not(.is-no-asterisk)>.el-form-item__label:before,
    .el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label-wrap>.el-form-item__label:before {
        color: rgba(1, 6, 33, 0.9);
    }
</style>