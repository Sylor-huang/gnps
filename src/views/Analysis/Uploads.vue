<template>
  <el-upload
    drag
    :on-change="beforeFeatureUpload"
    class="w-full upload-file"
    :before-remove="upload_remove"
    :accept="accepts"
    :limit="limit"
    :auto-upload="false"
  >
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">
      {{ $t("molecular.file_upload") }}
      <em>{{ $t("molecular.click_upload") }}</em
      >
    </div>
  </el-upload>
</template>
<script setup>
import { getCurrentInstance, ref } from "vue";
let { proxy } = getCurrentInstance();
defineProps({
  uploadType: {
    type: String,
    default: "feature",
  },
  accepts: {
    type: String,
    default: "text/csv"
  },
  limit: {
    type: Number,
    default: 1
  }
});
let beforeFeatureUpload = (file) => {
  proxy.$emit("uploadFileSuccess", {uploadType: proxy.uploadType, file: file});
  return false
};

let upload_remove = (file, fileList) => {
  proxy.$emit("handleFileDestroy", {uploadType: proxy.uploadType});
};

</script>
<style lang="scss">
.upload-file {
  .el-upload {
    display: block;
    width: 100%;
  }
  .el-upload-dragger {
    width: 100%;
    height: 90px;
    padding: 10px !important;
    line-height: 20px !important;
    .el-icon--upload {
      font-size: 36px;
      margin: 0;
    }
  }
}
</style>