<template>
  <div class="user-container">
    <div class="table-wrapper">
      <el-table :data="tableData" style="width: 100%" stripe="stripe" border="border">
        <el-table-column type="index" label="编号" width="80" align="center" />
        <el-table-column label="头像" align="center">
          <template slot-scope="scope">
            <img class="image" :src="scope.row['user_image']">
          </template>
        </el-table-column>
        <el-table-column prop="user_name" label="用户名" align="center" />
        <el-table-column prop="user_email" label="邮箱" align="center" width="200" />
        <el-table-column prop="user_sex" label="性别" align="center" />
        <el-table-column prop="user_birthday" label="出生日期" align="center" />
        <el-table-column prop="user_status" label="状态" align="center">
          <template slot-scope="scope">
            <span
              :class="statusTxt(scope.row['user_status'])[0]"
            >{{ statusTxt(scope.row['user_status'])[1] }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="120" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click.native.prevent="disableUser(scope.$index, tableData)"
            >{{ statusTxt(scope.row['user_status'])[2] }}</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="用户权限" :visible.sync="dialogVisible" width="30%">
      <span>是否{{ dialogTxt }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="disableCallback">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList, disableUser } from '@/api/user'
export default {
  name: 'User',
  data() {
    return {
      currentUserId: 0,
      dialogTxt: '禁用',
      dialogVisible: false,
      tableData: []
    }
  },
  created() {
    this.fetchRequest()
  },
  methods: {
    opneDialog() {
      this.dialogVisible = true
    },
    closeDialog() {
      this.dialogVisible = false
    },
    disableUser(index, tableData) {
      this.dialogTxt = this.statusTxt(tableData[index].user_status)[2]
      this.currentUserId = tableData[index].user_id
      this.opneDialog()
    },
    async disableCallback() {
      const loading = this.$loading({
        lock: true,
        text: `${this.dialogTxt}中...`,
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.2)'
      })
      try {
        const { data } = await disableUser({
          user_id: this.currentUserId
        })
        if (data.noerr === 1) {
          throw new Error()
        }
        loading.close()
        this.fetchRequest()
        this.closeDialog()
        this.$message.success(`${this.dialogTxt}成功`)
      } catch (err) {
        loading.close()
        this.$message.error(`${this.dialogTxt}失败`)
      }
    },
    async fetchRequest() {
      try {
        const { data } = await getUserList()
        console.log(data)
        this.tableData = data.data
      } catch (err) {
        this.$message.error('获取列表失败')
      }
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
  padding: 20px;
}
.image {
  width: 50px;
  height: 50px;
}
.status-0 {
  color: green;
}
.status-1 {
  color: red;
}
</style>
