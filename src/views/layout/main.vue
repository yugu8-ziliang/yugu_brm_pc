<template>
    <Page>
        <div v-for="(o, index) in 100" :key="index">我是内容</div>
    </Page>
</template>

<script>
export default {
    name: "Main-box",
    data() {
        return {};
    },
    methods: {},
    created() {
    },
};
</script>

<style lang="scss" scoped>
</style>
