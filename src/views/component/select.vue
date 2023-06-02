<template>
    <Page>
        <div class="page-main">
            <div class="item">
                <div class="header">默认</div>
                <div class="child">
                    <el-select v-model="value1">
                        <el-option value="选项1" label="选项1"></el-option>
                        <el-option value="选项2" label="选项2"></el-option>
                    </el-select>
                </div>
                <div class="value">值:{{ value1 }}</div>
            </div>
            <div class="item">
                <div class="header">可拖拽排序</div>
                <div class="child">
                    <el-drag-select
                        v-model="value2"
                        multiple
                        placeholder="请选择"
                    >
                        <el-option
                            v-for="item in options2"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-drag-select>
                </div>
                <div class="value">
                    <el-tag
                        v-for="item of value2"
                        :key="item"
                        style="margin-right: 15px"
                    >
                        {{ item }}
                    </el-tag>
                </div>
            </div>
            <div class="item">
                <div class="header">下拉选择树</div>
                <div class="child">
                    <treeselect
                        noResultsText="暂无数据"
                        v-model="value3"
                        :multiple="true"
                        :options="options3"
                        placeholder="请选择"
                    />
                </div>
                <div class="value">
                    {{ value3 }}
                </div>
            </div>
            <div class="item">
                <div class="header">图标选择器</div>
                <div class="child">
                    <IconSelect v-model="icon" />
                </div>
                <div class="value">
                    <svg-icon
                        :icon-class="icon"
                        style="font-size: 30px"
                    ></svg-icon>
                </div>
            </div>
            <div class="item">
                <div class="header">字典选择器</div>
                <div class="child">
                    <DictSelect
                        v-model="dict"
                        placeholder="请选择性别"
                        code="sys_user_sex"
                    ></DictSelect>
                </div>
                <div class="value">
                    值：{{ dict }}
                </div>
            </div>
        </div>
    </Page>
</template>

<script>
import ElDragSelect from "@/components/DragSelect";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";
import IconSelect from "@/components/IconSelect";
export default {
    name: "Select",
    components: { ElDragSelect, Treeselect, IconSelect },
    data() {
        return {
            value1: "",
            value2: ["Apple", "Banana", "Orange"],
            options2: [
                {
                    value: "Apple",
                    label: "Apple",
                },
                {
                    value: "Banana",
                    label: "Banana",
                },
                {
                    value: "Orange",
                    label: "Orange",
                },
            ],
            value3: null,
            // define options
            options3: [
                {
                    id: "a",
                    label: "a",
                    children: [
                        {
                            id: "aa",
                            label: "aa",
                        },
                        {
                            id: "ab",
                            label: "ab",
                        },
                    ],
                },
                {
                    id: "b",
                    label: "b",
                },
                {
                    id: "c",
                    label: "c",
                },
            ],
            icon: "",
            dict: "",
        };
    },
    methods: {},
    mounted() {},
};
</script>

<style lang="scss" scoped>
.page-main {
    display: flex;
    .el-select {
        width: 100%;
    }
    .item {
        width: 300px;
        margin-right: 20px;
        .header {
            font-size: 22px;
            height: 60px;
            display: flex;
            align-items: center;
        }
        .value {
            background: #f5f5f5;
            min-height: 100px;
            margin-top: 30px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
            color: #999;
            flex-wrap: wrap;
        }
    }
}
</style>
