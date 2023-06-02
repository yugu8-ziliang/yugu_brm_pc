<template>
    <Page>
        <div class="grid">
            <div
                v-for="item of svgIcons"
                :key="item"
                @click="handleClipboard(generateIconCode(item), $event)"
            >
                <el-tooltip placement="top">
                    <div slot="content">
                        {{ generateIconCode(item) }}
                    </div>
                    <div class="icon-item">
                        <svg-icon :icon-class="item" class-name="disabled" />
                        <span>{{ item }}</span>
                    </div>
                </el-tooltip>
            </div>
        </div>
    </Page>
</template>

<script>
import clipboard from "@/utils/clipboard";
import svgIcons from "./svg-icons";
export default {
    name: "Icon",
    data() {
        return {
            svgIcons,
        };
    },
    methods: {
        generateIconCode(symbol) {
            return `<svg-icon icon-class="${symbol}" />`;
        },
        handleClipboard(text, event) {
            clipboard(text, event);
        },
    },
    mounted() {},
};
</script>

<style lang="scss" scoped>
.grid {
    display: flex;
    flex-wrap: wrap;
    .icon-item {
        margin: 20px;
        height: 85px;
        width: 100px;
        font-size: 30px;
        color: #24292e;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        span {
            font-size: 16px;
            margin-top: 10px;
        }

        .disabled {
            pointer-events: none;
        }
    }
}
</style>
