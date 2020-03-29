<template>
  <div class="stage-container">
    <div class="stage-add">
      <el-button type="primary" @click="openDialog">
        发布
        <el-dialog
          title="发布学习阶段"
          :visible.sync="dialogVisible"
          :before-close="handleClose"
          width="30%"
        >
          <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="rule-form">
            <el-form-item label="阶段数" prop="num">
              <el-input v-model="ruleForm.num" />
            </el-form-item>
            <el-form-item label="标签" prop="tag">
              <el-input v-model="ruleForm.tag" />
            </el-form-item>
            <el-form-item label="标题" prop="title">
              <el-input v-model="ruleForm.title" />
            </el-form-item>
            <el-form-item label="描述" prop="desc">
              <el-input v-model="ruleForm.desc" />
            </el-form-item>
            <el-form-item label="展示图">
              <div class="upload-container">
                <el-upload
                  v-if="!ruleForm.banner"
                  :data="dataObj"
                  :multiple="false"
                  :show-file-list="false"
                  :on-success="uploadBannerCallback"
                  class="image-uploader"
                  drag
                  action="https://httpbin.org/post"
                >
                  <i class="el-icon-upload" />
                  <div class="el-upload__text">
                    内容展示图：将文件拖到此处，或
                    <em>点击上传</em>
                  </div>
                </el-upload>
                <div
                  v-if="ruleForm.banner"
                  class="image-preview"
                  :style="{backgroundImage: 'url(' + ruleForm.banner + ')'}"
                >
                  <div class="image-preview-action" @click="removeBanner">
                    <i class="el-icon-delete" />
                  </div>
                </div>
              </div>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="requestCallback">提交</el-button>
          </span>
        </el-dialog>
      </el-button>
    </div>
    <div class="stage-table">
      <stage-table :table-data="tableData" @delete="refreshCallback" @upload="uploadCallback" />
    </div>
  </div>
</template>

<script>
import StageTable from '@/components/Stage/StageTable'

import { getStageList, releaseStage, updateStage } from '@/api/speak'
export default {
  name: 'Stage',
  components: {
    StageTable
  },
  data() {
    return {
      id: 0,
      btnTxt: '上传',
      ruleForm: {
        num: '',
        title: '',
        tag: '',
        desc: '',
        banner: ''
      },
      dataObj: {
        token: '',
        key: ''
      },
      dialogVisible: false,
      tableData: []
    }
  },
  async created() {
    await this.getStageList()
  },
  methods: {
    uploadBannerCallback(data) {
      const base64 = data.files.file
      this.ruleForm.banner = base64
    },
    removeBanner() {
      this.ruleForm.banner = ''
    },
    openDialog() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
      Object.keys(this.ruleForm).forEach(item => {
        this.ruleForm[item] = ''
      })
    },
    requestCallback() {
      if (this.id === 0) {
        this.releaseStage()
      } else {
        this.updateStage()
      }
    },
    uploadCallback(index) {
      this.ruleForm.num = this.tableData[index].stage_num
      this.ruleForm.title = this.tableData[index].stage_title
      this.ruleForm.tag = this.tableData[index].stage_tag
      this.ruleForm.desc = this.tableData[index].stage_description
      this.ruleForm.banner = this.tableData[index].stage_banner
      this.id = this.tableData[index].stage_id
      this.openDialog()
    },
    async updateStage() {
      const loading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      try {
        const { data } = await updateStage({
          stage_id: this.id,
          stage_num: this.ruleForm.num,
          stage_title: this.ruleForm.title,
          stage_tag: this.ruleForm.tag,
          stage_description: this.ruleForm.desc,
          stage_image: this.ruleForm.banner
        })
        if (data.noerr === 1) {
          throw new Error()
        }
        this.getStageList()
        this.$message.success('更新成功')
      } catch (err) {
        this.$message.error('更新失败')
      } finally {
        this.closeDialog()
        loading.close()
        this.id = 0
      }
    },
    async releaseStage() {
      const loading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      try {
        const { data } = await releaseStage({
          stage_num: this.ruleForm.num,
          stage_tag: this.ruleForm.tag,
          stage_title: this.ruleForm.title,
          stage_description: this.ruleForm.desc,
          stage_image: this.ruleForm.banner
        })
        if (data.noerr === 1) {
          throw new Error(data.message)
        }
        this.$message.success('上传成功')
        this.getStageList()
      } catch (err) {
        this.$message.error(err.message)
      } finally {
        this.closeDialog()
        loading.close()
        this.id = 0
      }
    },
    async getStageList() {
      const loading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      try {
        const { data } = await getStageList()
        if (data.noerr === 1) {
          throw new Error()
        }
        this.tableData = data.data
        loading.close()
      } catch (err) {
        loading.close()
        this.$message.error('网络请求失败')
      }
    },
    refreshCallback() {
      this.getStageList()
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          this.id = 0
          Object.keys(this.ruleForm).forEach(item => {
            this.ruleForm[item] = ''
          })
          done()
        })
        .catch(_ => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.stage {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
  &-table {
    height: 100px;
    margin-top: 10px;
  }
  &-upload {
    position: absolute;
    filter: alpha(opacity=0);
    opacity: 0;
    width: 30px;
  }
}
.rule-form {
  padding-right: 30px;
}
.upload-banner-wrapper {
  display: flex;
}

  .image-uploader {
    width: 100%;
    height: 200px;
  }
  .image-preview {
    width: 100%;
    height: 200px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 12px;
    position: relative;
  }
  .image-preview-action {
    width: 50px;
    height: 50px;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
    border-radius: 50%;
    background-color: rgba(0, 0, 0, 0.16);
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.16);
    cursor: pointer;
  }
  .el-icon-delete {
    color: rgba(255, 255, 255, 1);
    font-size: 22px;
  }
</style>
