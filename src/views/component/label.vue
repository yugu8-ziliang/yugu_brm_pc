<template>
    <Page>
        <div class="label-buttons">
            <el-button @click="refresh">刷新当前页</el-button>
            <el-button @click="open">新开页面跳转</el-button>
            <el-button @click="close">关闭当前页</el-button>
            <el-input v-model="title" placeholder="请输入标签名称">
                <el-button slot="append" @click="editLabelName"
                    >修改标签页名称</el-button
                >
            </el-input>
        </div>
    </Page>
</template>

<script>
export default {
    name: "label-action",
    data() {
        return {
            title: "",
        };
    },
    methods: {
        close() {
            this.$closePage();
        },
        refresh() {
            this.$refreshPage();
        },
        open() {
            this.$router.push("/component/imgUpload");
        },
        editLabelName() {
            if(this.title == ''){
                this.$error(`请输入标题`);
            }
            else{
                this.$editPageName(this.title);
                this.$success(`修改成功`);
            }
        },
    },
    mounted() {},
};
</script>

<style lang="scss" scoped>
.label-buttons{
    display: flex;
    .el-input{
        margin-left: 10px;
        max-width: 350px;
    }
}
</style>
