<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="queryForm" :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="酒店名称" prop="name">
          <el-input v-model="listQuery.name" placeholder="输入酒店名称"></el-input>
        </el-form-item>
        <el-form-item label="酒店CODE" prop="code">
          <el-input v-model="listQuery.code" placeholder="输入酒店CODE"></el-input>
        </el-form-item>
        <el-form-item label="携程子酒ID" prop="ctrip_hotel_code">
          <el-input v-model="listQuery.ctrip_hotel_code" placeholder="输入携程子酒ID"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
            >搜索</el-button
          >
          <el-button
            v-waves
            class="filter-item"
            type="default"
            icon="el-icon-refresh-right"
            @click="resetFilter"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
    </div>
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="success"
        icon="el-icon-plus"
        @click="handleCreate">
        添加
      </el-button>
    </div>

    <el-divider></el-divider>
    <el-table
      :data="list"
      style="width: 100%"
      :key="tableKey"
      v-loading="listLoading"
      stripe
      fit
    >
      <el-table-column type="selection" width="55" align="center">
      </el-table-column>
      <el-table-column label="ID" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="酒店CODE" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="中文名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.cn_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="英文名称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.en_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经/纬度" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.longitude }} / {{ row.latitude }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="展示" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.visible }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="250"
        class-name="small-padding fixed-width"
        >
        <template slot-scope="{ row, $index }">
          <el-link type="warning" icon="el-icon-edit" @click="handleUpdate(row)">编辑</el-link>
          <el-link
            type="danger"
            icon="el-icon-delete"
            @click="handleDelete(row.id, $index)"
            >删除</el-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
      width="50%"
      :close-on-click-modal="false">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="padding: 0 30px"
      >
        <el-form-item label="酒店代码" prop="code">
          <el-input v-model="temp.code" placeholder="酒店代码" />
        </el-form-item>
        <el-form-item label="中文名" prop="cn_name">
          <el-input v-model="temp.cn_name" placeholder="中文名" />
        </el-form-item>
        <el-form-item label="英文名" prop="en_name">
          <el-input v-model="temp.en_name" placeholder="英文名" />
        </el-form-item>
      </el-form>
      <el-row>
        <el-col :span="12"><div class="grid-content bg-purple">1111</div></el-col>
        <el-col :span="12"><div class="grid-content bg-purple-light">22222</div></el-col>
      </el-row>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          提交
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import * as MrtApi from "@/api/hotelGroup/mrt";
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'SystemUser',
  components: { Pagination },
  directives: { waves },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        code: ''
      },
      roleLists: [],
      temp: {
        id: undefined,
        code: '',
        cn_name: '',
        en_name: ''
      },
      tempUserId: undefined,
      allotRoleIds: [],
      dialogFormVisible: false,
      dialogARVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rules: {
        code: [{ required: true, message: '酒店代码必填', trigger: 'blur' }],
        cn_name: [{ required: true, message: '中文名必填', trigger: 'blur' }],
        en_name: [{ required: true, message: '英文名必填', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      MrtApi.getList(this.listQuery).then((response) => {
        this.list = response.data.data
        this.total = response.data.total

        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    resetFilter() {
      this.$refs['queryForm'].resetFields()
      this.getList()
    },
    handleCreate() {
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          MrtApi.createData(this.temp).then((response) => {
            this.temp.id = response.data.id
            this.list.push(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: response.message,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          MrtApi.updateData(tempData).then((response) => {
            const index = this.list.findIndex((v) => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: response.message,
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(id, index) {
      this.$confirm('此操作将永久删除该集团, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          MrtApi.destroy(id).then((response) => {
            this.$notify({
              title: '成功',
              message: response.message,
              type: 'success',
              duration: 2000
            })
            this.list.splice(index, 1)
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    }
  }
}
</script>

<style>
.el-popover {
  height: 250px;
  overflow: auto;
}
</style>

<style scoped>

.el-divider {
  margin: 10px 0 5px 0;
}

.filter-item {
  margin-right: 10px;
}

.icondiv {
  /* border: 1px solid red */
  text-align: center;
  padding: 7px 0;
}

.icondiv:hover {
  background-color: #ccc
}

.el-link {
  font-size: 12px;
  margin: 0 5px;
}

.el-tag {
  margin: 0 2px;
}

</style>
