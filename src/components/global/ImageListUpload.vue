<template>
  <div class="upload">
    <!-- UPLOAD -->
    <el-upload
      ref="upload"
      list-type="picture-card"
      :auto-upload="false"
      accept="image/*"
      action=" "
      :limit="limit"
      :on-change="onChange"
      :on-preview="onPreview"
      :file-list="imageList"
      :class="{ 'is-limited': limit ? imageList.length === limit : false }"
    >
      <div class="holder">
        <i class="el-icon-plus"></i> <span>上传图片</span>
      </div>
    </el-upload>
    <!-- DIALOG -->
    <el-dialog
      :visible.sync="dialogVisible"
      width="440px"
      custom-class="image-list-upload-prew-dialog"
    >
      <!-- :preview-src-list="dialogImageUrlList" -->
      <el-image style="width: 400px; height: auto" :src="preImageUrl">
      </el-image>
    </el-dialog>
  </div>
</template>

<script>
import { transformFileListToImgList } from "@/utils/image-upload";
export default {
  name: "ImageListUpload",
  props: {
    imageList: {
      type: Array,
      default: () => [],
    },
    limit: {
      type: Number | undefined,
      default: undefined,
    },
  },
  emits: ["update"],
  computed: {
    dialogImageUrlList() {
      return transformFileListToImgList(this.imageList);
    },
  },
  data() {
    return {
      dialogVisible: false,
      // 预览的当前图片
      preImageUrl: "",
    };
  },
  methods: {
    onChange(file, fileList) {
      console.log("beforeUpload=>", file, fileList);
      this.$emit("update:imageList", [...fileList]);
    },
    onPreview(file) {
      const { url } = file;
      this.preImageUrl = url;
      this.dialogVisible = true;
    },
  },
};
</script>

<style lang="scss">
.image-list-upload-prew-dialog {
  .el-dialog__body {
    display: flex;
    justify-content: center;
  }
}
</style>
<style lang="scss" scoped>
// 达到限制后 隐藏上传框
/deep/.is-limited > .el-upload {
  display: none;
}
.holder {
  font-size: 14px;
  font-family: PingFang SC-Regular, PingFang SC;
  font-weight: 400;
  color: rgba(1, 6, 33, 0.75);
  line-height: 22px;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  line-height: 1;
  i {
    margin-bottom: 10px;
  }
}
</style>