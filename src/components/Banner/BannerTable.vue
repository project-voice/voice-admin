<template>
  <div>
    <el-table :data="tableData" style="width: 100%" stripe="stripe" border="border">
      <el-table-column type="index" label="编号" width="120" align="center" />
      <el-table-column prop="banner_url" label="图片地址" align="center" />
      <el-table-column fixed="right" label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click.native.prevent="preview(scope.$index, tableData)"
          >预览</el-button>
          <el-button
            type="text"
            size="small"
            @click.native.prevent="deleteRow(scope.$index, tableData)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="删除图片" :visible.sync="dialogVisible" width="30%">
      <span>是否删除</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="deleteCallback">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="预览" :visible.sync="dialogPreview" width="30%">
      <img class="preview-image" :src="currentUrl" alt="">
      <span slot="footer" class="dialog-footer">
        <el-button @click="closePreviewDialog">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
const DELETE_EVENT = 'delete'
// import { deleteBanner } from '@/api/banner'
export default {
  props: {
    tableData: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      currentUrl: '',
      currentIdx: '',
      dialogPreview: false,
      dialogVisible: false,
      stripe: true,
      border: true
    }
  },
  methods: {
    openPreviewDialog() {
      this.dialogPreview = true
    },
    closePreviewDialog() {
      this.dialogPreview = false
    },
    preview(index, tableDtata) {
      const url = tableDtata[index].banner_url
      this.currentUrl = url
      this.openPreviewDialog()
    },
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
        // const { data } = await deleteBanner({
        //   banner_id: this.tableData[this.currentIdx].banner_id
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
    }
  }
}
</script>

<style>
.preview-image {
  width: 100%;
}
</style>

