<template>
  <div class="advisory-list">
    <div class="table-wrapper">
      <el-table :data="tableData" style="width: 100%" stripe="stripe" border="border">
        <el-table-column type="index" label="编号" width="80" align="center" />
        <el-table-column prop="advisory_tag" label="标签" align="center" />
        <el-table-column prop="advisory_title" label="标题" align="center" />
        <el-table-column prop="advisory_access" label="访问量" align="center" />
        <el-table-column prop="advisory_source" label="来源" align="center" />
        <el-table-column prop="advisory_reward" label="打赏(次)" align="center" />
        <el-table-column prop="create_time" label="创建时间" align="center" />
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.native.prevent="updateAdvisory(scope.$index, tableData)"
            >修改</el-button>
            <el-button
              type="text"
              size="small"
              @click.native.prevent="deleteRow(scope.$index, tableData)"
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
    <el-dialog title="删除热点" :visible.sync="dialogVisible" width="30%">
      <span>是否删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="deleteCallback">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentIndex: 0,
      dialogVisible: false,
      count: 10,
      page: 1,
      stripe: true,
      border: true,
      tableData: []
    }
  },
  created() {
    // this.fetchRequest(this.page, this.count)
  },
  methods: {
    openDialog() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
    },
    deleteRow(index, tableData) {
      this.currentIndex = index
      this.openDialog()
    },
    async deleteCallback() {
      const loading = this.$loading({
        lock: true,
        text: '删除中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      try {
        // const { data } = await deleteAdvisory({
        //   advisory_id: this.tableData[this.currentIndex].advisory_id
        // })
        // console.log(data)
        // if (data.noerr === 1) {
        //   throw new Error()
        // }
        // this.$message.success('删除成功')
        // this.page = 1
        // this.fetchRequest(this.page, this.count)
        this.closeDialog()
        loading.close()
      } catch (err) {
        this.$message.error('删除失败')
        loading.close()
      }
    },
    // 修改
    updateAdvisory(index, tableData) {
      const id = tableData[index].advisory_id
      this.$router.push(`/advisory/edit/${id}`)
    },
    async fetchRequest(page, count) {
      const loading = this.$loading({
        lock: true,
        text: '数据请求中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      try {
        // const { data } = await getAdvisoryList({
        //   page,
        //   count
        // })
        // if (data.noerr === 1) {
        //   throw new Error()
        // }
        // this.tableData = data.data
        loading.close()
      } catch (err) {
        this.$message.error('请求失败')
        loading.close()
      }
    },
    async nextPage() {
      this.page = this.page + 1
      await this.fetchRequest(this.page, this.count)
    },
    async prevPage() {
      this.page = this.page - 1
      await this.fetchRequest(this.page, this.count)
    }
  }
}
</script>
<style>
.table-wrapper {
  padding: 20px;
  min-height: 700px;
}
.bottom-button {
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
}
</style>
