<template>
    <div class="upload-container">
        <div v-for="(item, index) in imgList" :key="index" class="images">
            <el-image
                v-if="index < max"
                :src="item"
                :style="`width:${width}px;height:${height}px;`"
                fit="cover"
            />
            <div class="mask">
                <div class="actions">
                    <span title="预览" @click="preview(index)">
                        <i class="el-icon-zoom-in" />
                    </span>
                    <span title="移除" @click="remove(index)">
                        <i class="el-icon-delete" />
                    </span>
                    <span
                        v-show="imgList.length > 1"
                        title="左移"
                        :class="{ disabled: index == 0 }"
                        @click="move(index, 'left')"
                    >
                        <i class="el-icon-back" />
                    </span>
                    <span
                        v-show="imgList.length > 1"
                        title="右移"
                        :class="{ disabled: index == imgList.length - 1 }"
                        @click="move(index, 'right')"
                    >
                        <i class="el-icon-right" />
                    </span>
                </div>
            </div>
        </div>
        <el-upload
            v-show="imgList.length < max"
            :show-file-list="false"
            :headers="headers"
            :action="action"
            :data="data"
            :before-upload="beforeUpload"
            :on-progress="onProgress"
            :on-success="onSuccess"
            drag
            class="images-upload"
        >
            <div
                class="image-slot"
                :style="`width:${width}px;height:${height}px;`"
            >
                <i class="el-icon-plus" />
            </div>
            <div
                v-show="progress.percent"
                class="progress"
                :style="`width:${width}px;height:${height}px;`"
            >
                <el-image
                    :src="progress.preview"
                    :style="`width:${width}px;height:${height}px;`"
                    fit="fill"
                />
                <el-progress
                    type="circle"
                    :width="Math.min(width, height) * 0.8"
                    :percentage="progress.percent"
                />
            </div>
        </el-upload>
        <div v-if="!notip" class="el-upload__tip">
            <div style="display: inline-block">
                <el-alert
                    :title="`上传图片支持 ${ext.join(
                        ' / '
                    )} 格式，单张图片大小不超过 ${size}MB，建议图片尺寸为 ${width}*${height}，且图片数量不超过 ${max} 张`"
                    type="info"
                    show-icon
                    :closable="false"
                />
            </div>
        </div>
        <el-image-viewer
            v-if="imageViewerVisible"
            :initialIndex="initialIndex"
            :on-close="
                () => {
                    imageViewerVisible = false;
                }
            "
            :url-list="imgList"
        />
    </div>
</template>

<script>
import ElImageViewer from "element-ui/packages/image/src/image-viewer";
import { getToken } from "@/utils/auth";

export default {
    name: "ImagesUpload",
    components: {
        ElImageViewer,
    },
    props: {
        action: {
            type: String,
            default: process.env.VUE_APP_BASE_API + "/system/savefile/",
        },
        headers: {
            type: Object,
            default: () => {
                return {
                    Authorization: "Bearer " + getToken(),
                };
            },
        },
        data: {
            type: Object,
            default: () => {},
        },
        value: {
            type: Array,
            default: () => [],
        },
        max: {
            type: Number,
            default: 3,
        },
        size: {
            type: Number,
            default: 2,
        },
        width: {
            type: Number,
            default: 150,
        },
        height: {
            type: Number,
            default: 150,
        },
        placeholder: {
            type: String,
            default: "",
        },
        notip: {
            type: Boolean,
            default: false,
        },
        ext: {
            type: Array,
            default: () => ["jpg", "png", "gif", "bmp"],
        },
    },
    watch: {
        value(newVal) {
            this.imgList = newVal;
        },
        imgList(newVal) {
            this.$emit("input", newVal);
        },
    },
    data() {
        return {
            dialogImageUrl: "",
            imageViewerVisible: false,
            progress: {
                preview: "",
                percent: 0,
            },
            imgList: this.value,
            initialIndex: 0,
        };
    },
    methods: {
        // 预览
        preview(index) {
            this.initialIndex = index;
            this.imageViewerVisible = true;
        },
        // 移除
        remove(index) {
            this.imgList.splice(index, 1);
        },
        // 移动
        move(index, type) {
            if (type == "left" && index != 0) {
                this.imgList[index] = this.imgList.splice(
                    index - 1,
                    1,
                    this.imgList[index]
                )[0];
            }
            if (type == "right" && index != this.imgList.length - 1) {
                this.imgList[index] = this.imgList.splice(
                    index + 1,
                    1,
                    this.imgList[index]
                )[0];
            }
        },
        beforeUpload(file) {
            const fileName = file.name.split(".");
            const fileExt = fileName[fileName.length - 1];
            const isTypeOk = this.ext.indexOf(fileExt) >= 0;
            const isSizeOk = file.size / 1024 / 1024 < this.size;
            if (!isTypeOk) {
                this.$error(`上传图片只支持 ${this.ext.join(" / ")} 格式！`);
            }
            if (!isSizeOk) {
                this.$error(`上传图片大小不能超过 ${this.size}MB！`);
            }
            if (isTypeOk && isSizeOk) {
                this.progress.preview = URL.createObjectURL(file);
            }
            return isTypeOk && isSizeOk;
        },
        onProgress(file) {
            this.progress.percent = ~~file.percent;
            if (this.progress.percent == 100) {
                this.progress.preview = "";
                this.progress.percent = 0;
            }
        },
        onSuccess(response) {
            if (response.code != 200) {
                this.$notify.error({
                    title: response.msg,
                });
            } else {
                this.$success("上传图片成功！");
                this.imgList.push(
                    process.env.VUE_APP_BASE_API + response.data.file_url
                );
            }
        },
    },
};
</script>

<style lang="scss" scoped>
.upload-container {
    line-height: initial;
}
.images {
    position: relative;
    display: inline-block;
    margin-right: 10px;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    overflow: hidden;
    .el-image {
        display: block;
    }
    .mask {
        opacity: 0;
        position: absolute;
        top: 0;
        width: 100%;
        height: 100%;
        font-size: 24px;
        background-color: rgba(0, 0, 0, 0.5);
        transition: all 0.3s;
        .actions {
            width: 100px;
            height: 100px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translateX(-50%) translateY(-50%);
            span {
                width: 50%;
                text-align: center;
                color: #fff;
                cursor: pointer;
                transition: all 0.1s;
                &.disabled {
                    color: #999;
                    cursor: not-allowed;
                }
                &:hover:not(.disabled) {
                    transform: scale(1.5);
                }
            }
        }
    }
    &:hover .mask {
        opacity: 1;
    }
}
.images-upload {
    display: inline-block;
}
::v-deep .el-upload {
    .el-upload-dragger {
        width: auto;
        height: auto;
        &.is-dragover {
            border-width: 1px;
        }
        .image-slot {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 100%;
            height: 100%;
            color: #909399;
            font-size: 30px;
            background-color: transparent;
        }
        .progress {
            position: absolute;
            top: 0;
            &::after {
                content: "";
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0;
                top: 0;
                background-color: rgba(0, 0, 0, 0.2);
            }
            .el-progress {
                z-index: 1;
                position: absolute;
                left: 50%;
                top: 50%;
                transform: translateX(-50%) translateY(-50%);
                .el-progress__text {
                    color: #fff;
                }
            }
        }
    }
}
</style>
