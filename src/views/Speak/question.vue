<template>
  <div class="question-container">
    <div class="question-add">
      <el-button type="primary" @click="openDialog">
        发布
        <el-dialog
          title="发布学习题目"
          :visible.sync="dialogVisible"
          :before-close="handleClose"
          width="30%"
        >
          <el-form ref="ruleForm" :model="ruleForm" label-width="100px" class="rule-form">
            <el-form-item label="阶段数" prop="num">
              <el-input v-model="ruleForm.num" />
            </el-form-item>
            <el-form-item label="标题" prop="tag">
              <el-input v-model="ruleForm.title" />
            </el-form-item>
            <el-form-item label="选项" prop="title">
              <el-input
                v-model="ruleForm.option"
                type="textarea"
                :rows="6"
                placeholder="每条选项占一行，序号与选项之间用空格隔开"
              />
            </el-form-item>
            <el-form-item label="正确答案" prop="desc">
              <el-input v-model="ruleForm.correct" />
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
    <div class="question-table">
      <question-table :table-data="tableData" @delete="refreshCallback" @upload="uploadCallback" />
    </div>
  </div>
</template>

<script>
import QuestionTable from '@/components/Stage/QuestionTable'

import { getQuestionList, releaseQuestion, updateQuestion } from '@/api/speak'
export default {
  name: 'Question',
  components: {
    QuestionTable
  },
  data() {
    return {
      id: 0,
      btnTxt: '上传',
      ruleForm: {
        num: '',
        title: '',
        option: '',
        correct: '',
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
    await this.getQuestionList()
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
        this.releaseQuestion()
      } else {
        this.updateQuestion()
      }
    },
    uploadCallback(index) {
      this.ruleForm.num = this.tableData[index].stage_num
      this.ruleForm.title = this.tableData[index].question_title
      this.ruleForm.option = this.reverseFormat(this.tableData[index].question_option)
      this.ruleForm.correct = this.tableData[index].question_correct
      this.ruleForm.banner = this.tableData[index].question_image
      this.id = this.tableData[index].question_id
      this.openDialog()
    },
    async updateQuestion() {
      const loading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      try {
        const { data } = await updateQuestion({
          question_id: this.id,
          stage_num: this.ruleForm.num,
          question_title: this.ruleForm.title,
          question_option: this.format(this.ruleForm.option),
          question_correct: this.ruleForm.correct,
          question_image: this.ruleForm.banner
        })
        if (data.noerr === 1) {
          throw new Error()
        }
        this.getQuestionList()
        this.$message.success('更新成功')
      } catch (err) {
        this.$message.error('更新失败')
      } finally {
        this.closeDialog()
        loading.close()
        this.id = 0
      }
    },
    async releaseQuestion() {
      const loading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      try {
        const { data } = await releaseQuestion({
          stage_num: this.ruleForm.num,
          question_title: this.ruleForm.title,
          question_option: this.format(this.ruleForm.option),
          question_correct: this.ruleForm.correct,
          question_image: this.ruleForm.banner
        })
        if (data.noerr === 1) {
          throw new Error(data.message)
        }
        this.$message.success('上传成功')
        this.getQuestionList()
      } catch (err) {
        this.$message.error(err.message)
      } finally {
        this.closeDialog()
        loading.close()
        this.id = 0
      }
    },
    async getQuestionList() {
      const loading = this.$loading({
        lock: true,
        text: '加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      try {
        const { data } = await getQuestionList()
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
      this.getQuestionList()
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
    },
    format(info) {
      const processInfo = info.split('\n').reduce((result, item) => {
        const option = item.split(' ')
        result[option[0]] = option[1]
        return result
      }, {})
      return JSON.stringify(processInfo)
    },
    reverseFormat(info) {
      const formatInfo = JSON.parse(info)
      return Object.keys(formatInfo).map(item => {
        return `${item} ${formatInfo[item]}`
      }).join('\n')
    }
  }

}
</script>

<style lang="scss" scoped>
.question {
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
