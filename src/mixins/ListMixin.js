import { Base64 } from 'js-base64'

export const ListMixin = {
    data() {
        return {
            /** 初始化请求配置 */
            disableMixinCreated: false,
            /* 列表加载进度*/
            loading: false,
            /* 请求地址 */
            url: {},
            /* 数据源 列表 */
            tableData: [],
            /* table勾选*/
            selectionList: [],
            /** 查询条件*/
            queryData: {},
            /* 分页参数 */
            pagination: {
                total: 0,
                page: 1,
                limit: 10,
                pageSizes: [50, 100, 300, 500]
            }
        };
    },
    created() {
        // 注意在别的页面给 disableMixinCreated 赋值，需要定义在别的页面data里定义
        if (this.disableMixinCreated == false) {
            // 初始化字典配置 在自己页面定义
            this.getList(1);
        }
    },
    methods: {
        // 查询按钮
        handleQuery() {
            this.getDataList(1);
        },
        // 重置按钮
        handleReset() {
            this.queryData = this.$options.data().queryData;
            // this.setclearSelection();
            this.getDataList(1);
        },
        // 触发子组件添加按钮
        handleAdd(form, title) {
            this.$refs[form].add();
            this.$refs[form].title = title; // 标题
            this.$refs[form].disableSubmit = false; // 是否可以提交
            this.$refs[form].isVisiable = true; // 是否显示
        },
        // 触发子组件编辑按钮
        handleEdit(form, title, record) {
            this.$refs[form].edit(record);
            this.$refs[form].title = title;
            this.$refs[form].disableSubmit = false;
            this.$refs[form].isVisiable = true;
        },
        // 触发子组件详情按钮
        handleDetail(form, title, record) {
            this.$refs[form].edit(record);
            this.$refs[form].title = title;
            this.$refs[form].disableSubmit = true;
            this.$refs[form].isVisiable = true;
        },
        // 跳转页面
        handleJumpDetail: function (form, record) {
            this.$router.push({
                path: form,
                query: { data: Base64.encode(JSON.stringify(record)) }//加密 
            });
            // Base64.decode(this.pwd);//解密
        },
        // 表格勾选赋值
        handleSelectionChange(selection) {
            this.selectionList = selection;
        },
        // 分页 改变时会触发
        handleCurrentChange(val) {
            this.pagination.page = val.page;
            this.pagination.limit = val.limit;
            this.getDataList()
        },
        // 清除勾选
        // setclearSelection() {
        //     this.$refs.multipleTable.clearSelection();
        //     this.selectionList = [];
        // }
    }
};
