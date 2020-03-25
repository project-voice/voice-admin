<template>
  <div>
    <el-table :data="tableData" style="width: 100%" stripe="stripe" border="border">
      <el-table-column type="index" label="编号" width="120" align="center" />
      <el-table-column prop="resource_type" label="科目" align="center" />
      <el-table-column prop="resource_title" label="标题" align="center" />
      <el-table-column prop="resource_url" label="链接" align="center" width="500" />
      <el-table-column prop="resource_ident" label="密钥" align="center" />

      <el-table-column fixed="right" label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click.native.prevent="uploadRow(scope.$index, tableData)"
          >编辑</el-button>
          <el-button
            type="text"
            size="small"
            @click.native.prevent="deleteRow(scope.$index, tableData)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="删除资源" :visible.sync="dialogVisible" width="30%">
      <span>是否删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="deleteCallback">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const DELETE_EVENT = 'delete'
const UPLOAD_EVENT = 'upload'
// import { deleteResource } from '@/api/resource'
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentIdx: '',
      dialogVisible: false,
      stripe: true,
      border: true
    }
  },
  methods: {
    openDialog() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
    },
    async deleteCallback() {
      await this.deleteRequest()
      this.closeDialog()
    },
    deleteRow(index, tableData) {
      this.currentIdx = index
      this.openDialog()
    },
    async deleteRequest() {
      const loading = this.$loading({
        lock: true,
        text: '删除中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })

      try {
        // const { data } = await deleteResource({
        //   resource_id: this.tableData[this.currentIdx].resource_id
        // })
        // console.log(data)
        // if (data.noerr === 1) {
        //   throw new Error()
        // }
        loading.close()
        this.$message.success('删除成功')
        this.$emit(DELETE_EVENT)
      } catch (err) {
        loading.close()
        this.$message.error('删除失败')
      }
    },
    uploadRow(index) {
      this.$emit(UPLOAD_EVENT, index)
    }
  }
}
</script>

