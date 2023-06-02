<template>
    <Page>
        <div class="container">
            <div class="editor-main">
                <Editor v-model="html" :height="500"></Editor>
            </div>
            <div class="view">
                <div class="header">预览</div>
                <div class="ql-container ql-snow main">
                    <div class="ql-editor">
                        <div v-html="html"></div>
                    </div>
                </div>
            </div>
        </div>
    </Page>
</template>

<script>
import Editor from "@/components/Editor";
import "quill/dist/quill.snow.css";
export default {
    name: "editor",
    components: {
        Editor,
    },
    data() {
        return {
            html: "",
        };
    },
    methods: {},
    mounted() {},
};
</script>

<style lang="scss" scoped>
.container {
    display: flex;
    .editor-main {
        width: 50%;
        padding-right: 20px;
    }
    .view {
        width: 50%;
        padding-left: 20px;
        .header {
            font-size: 22px;
        }
        .main {
            margin-top: 20px;
            img {
                width: 100%;
            }
        }
    }
}
</style>
