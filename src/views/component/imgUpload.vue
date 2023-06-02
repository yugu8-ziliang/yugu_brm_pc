<template>
    <Page>
        <div class="upload-demo">
            <div class="header">图片上传</div>
            <Image-Upload :max='5' v-model="images" name="image"></Image-Upload>
        </div>
        <div class="upload-demo">
            <div class="header">图片预览</div>
            <Image-Preview src="https://s1.ax1x.com/2020/07/03/NOeqld.jpg" :width="200" />
        </div>
    </Page>
</template>

<script>
export default {
    name: "imgUpload",
    data() {
        return {
            images: [
                'https://picsum.photos/400',
                'https://picsum.photos/600',
                'https://picsum.photos/500'
            ],
        };
    },
    mounted() {},
};
</script>

<style lang="scss" scoped>
.upload-demo{
    margin-top: 20px;
    .header{
        padding: 20px 0;
        font-size: 22px;
    }
    &:first-child{
        margin-top: 0;
    }
}
</style>
