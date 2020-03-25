<template>
  <div class="user-container">
    <div class="table-wrapper">
      <el-table :data="tableData" style="width: 100%" stripe="stripe" border="border">
        <el-table-column type="index" label="编号" width="80" align="center" />
        <el-table-column prop="user_name" label="发布者" align="center" />
        <el-table-column prop="comment" label="评论数" align="center" width="200" />
        <el-table-column label="点赞数" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row['like'].count }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="create_time" label="发布时间" align="center" />
        <el-table-column prop="talk_status" label="状态" align="center">
          <template slot-scope="scope">
            <span
              :class="statusTxt(scope.row['talk_status'])[0]"
            >{{ statusTxt(scope.row['talk_status'])[1] }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="200" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.native.prevent="showPreviewTalg(scope.$index, tableData)"
            >查看内容</el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="showDisableTalk(scope.$index, tableData)"
            >{{ statusTxt(scope.row['talk_status'])[2] }}</el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="showDeleteTalk(scope.$index, tableData)"
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
    <el-dialog title="心情权限" :visible.sync="disableDialogVisible" width="30%">
      <span>是否{{ dialogTxt }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDisableDialog">取 消</el-button>
        <el-button type="primary" @click="disableTalkCallback">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="心情删除" :visible.sync="deleteDialogVisible" width="30%">
      <span>是否删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDeleteDialog">取 消</el-button>
        <el-button type="primary" @click="deleteTalkCallback">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="心情内容" :visible.sync="previewDialogVisible" width="30%">
      <div class="content-wrapper">
        <p class="txt">{{ talkContent.content }}</p>
        <div class="image-wrapper">
          <img v-for="(url,index) in talkContent.images" :key="index" class="image" :src="url" alt="">
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: 'User',
  data() {
    return {
      page: 1,
      count: 10,
      dialogTxt: '禁用',
      talkId: 0,
      talkContent: {
        content: '',
        images: []
      },
      disableDialogVisible: false,
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
    opneDisableDialog() {
      this.disableDialogVisible = true
    },
    closeDisableDialog() {
      this.disableDialogVisible = false
    },
    showDeleteTalk(index, tableData) {
      const talkId = tableData[index].talk_id
      this.talkId = talkId
      this.openDeleteDialog()
    },
    async deleteTalkCallback() {
      const loading = this.$loading({
        lock: true,
        text: `${this.dialogTxt}中...`,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      try {
        // const { data } = await deleteTalk({
        //   talk_id: this.talkId
        // })
        // if (data.noerr === 1) {
        //   throw new Error()
        // }
        // this.page = 1
        // this.fetchRequest(this.page, this.count)
        this.$message.success('删除成功')
      } catch (err) {
        this.$message.error('删除失败')
      } finally {
        loading.close()
        this.closeDeleteDialog()
      }
    },
    showDisableTalk(index, tableData) {
      const talkId = tableData[index].talk_id
      this.talkId = talkId
      this.dialogTxt = this.statusTxt(tableData[index].talk_status)[2]
      this.opneDisableDialog()
    },
    async disableTalkCallback() {
      const loading = this.$loading({
        lock: true,
        text: `${this.dialogTxt}中...`,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      try {
        // const { data } = await disableTalk({
        //   talk_id: this.talkId
        // })
        // console.log(data)
        // if (data.noerr === 1) {
        //   throw new Error()
        // }
        this.$message.success(`${this.dialogTxt}成功`)
        this.page = 1
        this.fetchRequest(this.page, this.count)
      } catch (err) {
        this.$message.error(`${this.dialogTxt}失败`)
      } finally {
        loading.close()
        this.closeDisableDialog()
      }
    },
    showPreviewTalg(index, tableData) {
      const contentEncode = tableData[index].talk_content
      this.talkContent = JSON.parse(contentEncode)
      this.openPreviewDialog()
    },
    async fetchRequest(page, count) {
      try {
        // const { data } = await getTalkList({
        //   page,
        //   count,
        //   type: 'all'
        // })
        // console.log(data)
        // this.tableData = data.data
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
        return ['status-1', '禁用', '启用']
      }
      return ['status-0', '正常', '禁用']
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
  color: green;
}
.status-1 {
  color: red;
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
