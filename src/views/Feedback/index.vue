<template>
  <div class="user-container">
    <div class="table-wrapper">
      <el-table :data="tableData" style="width: 100%" stripe="stripe" border="border">
        <el-table-column type="index" label="编号" width="80" align="center" />
        <el-table-column prop="user_name" label="发布者" align="center" width="200" />
        <el-table-column prop="feedback_content" label="反馈内容" align="center" />
        <el-table-column prop="create_time" label="发布时间" align="center" width="200" />
        <el-table-column prop="feedback_status" label="状态" align="center" width="200">
          <template slot-scope="scope">
            <span
              :class="statusTxt(scope.row['feedback_status'])[0]"
            >{{ statusTxt(scope.row['feedback_status'])[1] }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.native.prevent="showProcessFeedback(scope.$index, tableData)"
            >{{ statusTxt(scope.row['feedback_status'])[2] }}</el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="showDeleteFeedback(scope.$index, tableData)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="bottom-button">
      <el-button-group>
        <el-button
          type="primary"
          icon="el-icon-arrow-left"
          :disabled="page === 1"
          @click="prevPage"
        >上一页</el-button>
        <el-button type="primary" :disabled="tableData.length < count" @click="nextPage">
          下一页
          <i class="el-icon-arrow-right el-icon--right" />
        </el-button>
      </el-button-group>
    </div>
    <el-dialog title="处理反馈" :visible.sync="processDialogVisible" width="30%">
      <span>是否{{ dialogTxt }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeProcessDialog">取 消</el-button>
        <el-button type="primary" @click="processFeedbackCallback">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="心情删除" :visible.sync="deleteDialogVisible" width="30%">
      <span>是否删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDeleteDialog">取 消</el-button>
        <el-button type="primary" @click="deleteFeedbackCallback">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="心情内容" :visible.sync="previewDialogVisible" width="30%">
      <div class="content-wrapper">
        内容
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getFeedbackList, deleteFeedback, updateStatus } from '@/api/feedback'
export default {
  name: 'User',
  data() {
    return {
      page: 1,
      count: 10,
      dialogTxt: '未处理',
      feedbackId: 0,
      processDialogVisible: false,
      deleteDialogVisible: false,
      previewDialogVisible: false,
      tableData: []
    }
  },
  created() {
    this.fetchRequest(this.page, this.count)
  },
  methods: {
    openPreviewDialog() {
      this.previewDialogVisible = true
    },
    closePreviewDialog() {
      this.previewDialogVisible = false
    },
    openDeleteDialog() {
      this.deleteDialogVisible = true
    },
    closeDeleteDialog() {
      this.deleteDialogVisible = false
    },
    opneProcessDialog() {
      this.processDialogVisible = true
    },
    closeProcessDialog() {
      this.processDialogVisible = false
    },
    showDeleteFeedback(index, tableData) {
      const feedbackId = tableData[index].feedback_id
      this.feedbackId = feedbackId
      this.openDeleteDialog()
    },
    async deleteFeedbackCallback() {
      const loading = this.$loading({
        lock: true,
        text: `${this.dialogTxt}中...`,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      try {
        const { data } = await deleteFeedback({
          feedback_id: this.feedbackId
        })
        if (data.noerr === 1) {
          throw new Error()
        }
        this.page = 1
        this.fetchRequest(this.page, this.count)
        this.$message.success('删除成功')
      } catch (err) {
        this.$message.error('删除失败')
      } finally {
        loading.close()
        this.closeDeleteDialog()
      }
    },
    showProcessFeedback(index, tableData) {
      const txt = this.statusTxt(tableData[index].feedback_status)[2]
      if (txt === '已处理') {
        return
      }
      const feedbackId = tableData[index].feedback_id
      this.feedbackId = feedbackId
      this.dialogTxt = this.statusTxt(tableData[index].feedback_status)[2]
      this.opneProcessDialog()
    },
    async processFeedbackCallback() {
      const loading = this.$loading({
        lock: true,
        text: `${this.dialogTxt}中...`,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      try {
        const { data } = await updateStatus({
          feedback_id: this.feedbackId,
          feedback_status: 1
        })
        if (data.noerr === 1) {
          throw new Error()
        }
        this.$message.success(`${this.dialogTxt}成功`)
        this.page = 1
        this.fetchRequest(this.page, this.count)
      } catch (err) {
        this.$message.error(`${this.dialogTxt}失败`)
      } finally {
        loading.close()
        this.closeProcessDialog()
      }
    },
    showPreviewTalg(index, tableData) {
      this.openPreviewDialog()
    },
    async fetchRequest(page, count) {
      try {
        const { data } = await getFeedbackList({
          page,
          count
        })
        this.tableData = data.data
      } catch (err) {
        this.$message.error('获取列表失败')
      }
    },
    async nextPage() {
      this.page = this.page + 1
      await this.fetchRequest(this.page, this.count)
    },
    async prevPage() {
      this.page = this.page - 1
      await this.fetchRequest(this.page, this.count)
    },
    statusTxt(status) {
      if (+status === 1) {
        return ['status-1', '已处理', '已处理']
      }
      return ['status-0', '未处理', '处理']
    }
  }
}
</script>

<style lang="scss" scoped>
.table-wrapper {
  min-height:700px;
  padding: 20px;
}
.status-0 {
  color: red;
}
.status-1 {
  color: green;
}
.bottom-button {
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
}
.content-wrapper {
  padding: 16px;
  border-radius: 4px;
  border: 1px solid rgba(0,0,0,0.16)
}
.content-wrapper .txt {
  font-size: 16px;
}
.content-wrapper .image-wrapper {
  display: flex;
  flex-wrap: wrap;
}
.image-wrapper .image {
  margin: 8px 0 0 8px;
  width: 30%;
}
</style>
