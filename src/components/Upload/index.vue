<template>
  <div class="upload-container">
    <el-upload
      class="avatar-uploader"
      action="https://httpbin.org/post"
      :show-file-list="false"
      :on-success="handleBannerSuccess"
    >
      <img v-if="imageUrl" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
const CLICK_EVENT = 'upload'
export default {
  name: 'Upload',

  data() {
    return {
      imageUrl: '',
      file: '',
      dataObj: {
        token: '',
        key: ''
      }
    }
  },
  methods: {
    clean() {
      this.imageUrl = ''
      this.file = ''
    },
    handleBannerSuccess(res, file) {
      this.imageUrl = URL.createObjectURL(file.raw)
      this.file = res.files.file
      this.$emit(CLICK_EVENT, this.file)
    },
    handlerBannerError() {
      this.$message.error('上传失败')
    },
    removeBanner() {
      this.baseUrl = ''
    }
  }
}
</script>

<style>
.upload-container {
  width: 100%;
  height: 100%;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
