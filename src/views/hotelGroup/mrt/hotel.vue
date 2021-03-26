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
            >搜索</el-button>
          <el-button
            v-waves
            class="filter-item"
            type="default"
            icon="el-icon-refresh-right"
            @click="resetFilter"
            >重置</el-button>
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
      <el-table-column type="selection" width="55" align="left">
      </el-table-column>
      <el-table-column label="ID" align="left" width="100" fixed="left">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="酒店CODE" align="left" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="中文名称" align="left">
        <template slot-scope="{ row }">
          <span>{{ row.cn_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="英文名称" align="left">
        <template slot-scope="{ row }">
          <span>{{ row.en_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="经/纬度" align="left">
        <template slot-scope="{ row }">
          <span>{{ row.longitude }} | {{ row.latitude }}</span>
        </template>
      </el-table-column>
      <el-table-column label="国家" align="left">
        <template slot-scope="{ row }">
          <span>{{ row.country }}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" align="left">
        <template slot-scope="{ row }">
          <span>{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" align="left">
        <template slot-scope="{ row }">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="left">
        <template slot-scope="{ row }">
          <el-switch
            v-model="row.status"
            active-color="#13ce66"
            inactive-color="#ff4949"
            :active-value="1"
            :inactive-value="0"
            @change="changeStatus($event, row.id)">
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
        fixed="right"
        class-name="small-padding fixed-width">
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
        <el-row :gutter="80">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="酒店代码 :" prop="code">
                <el-input v-model="temp.code" placeholder="酒店代码" :disabled="dialogStatus === 'create' ? false : true" />
              </el-form-item>
              <el-form-item label="中文名 :" prop="cn_name">
                <el-input v-model="temp.cn_name" placeholder="中文名" />
              </el-form-item>
              <el-form-item label="英文名 :" prop="en_name">
                <el-input v-model="temp.en_name" placeholder="英文名" />
              </el-form-item>
              <el-form-item label="经度 :" prop="longitude">
                <el-input v-model="temp.longitude" placeholder="经度" />
              </el-form-item>
              <el-form-item label="纬度:" prop="latitude">
                <el-input v-model="temp.latitude" placeholder="纬度" />
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-form-item label="国家 :" prop="code">
                <el-input v-model="temp.country" placeholder="国家" />
              </el-form-item>
              <el-form-item label="地址 :" prop="address">
                <el-input v-model="temp.address" placeholder="详细地址" />
              </el-form-item>
              <el-form-item label="电话 :" prop="phone">
                <el-input v-model="temp.phone" placeholder="联系电话" />
              </el-form-item>
              <el-form-item label="币种 :" prop="cur">
                <el-input v-model="temp.cur" placeholder="币种" />
              </el-form-item>
              <el-form-item label="预订前是否展示 :" prop="address_visible" label-width="120px">
                <el-radio-group v-model="temp.address_visible">
                  <el-radio label="true">展示</el-radio>
                  <el-radio label="false">不展示</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
        </el-row>
      </el-form>
      
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
import * as HotelApi from "@/api/mrt/hotel";
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
      temp: {
        id: undefined,
        code: '',
        cn_name: '',
        en_name: '',
        longitude: '',
        latitude: '',
        country: '',
        address: '',
        phone: '',
        cur: '',
        address_visible: 'false'
      },
      tempUserId: undefined,
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rules: {
        code: [{ required: true, message: '酒店代码必填', trigger: 'blur' }],
        cn_name: [{ required: true, message: '中文名必填', trigger: 'blur' }],
        en_name: [{ required: true, message: '英文名必填', trigger: 'blur' }],
        longitude: [{ required: true, message: '经度必填', trigger: 'blur' }],
        latitude: [{ required: true, message: '纬度必填', trigger: 'blur' }],
        country: [{ required: true, message: '国家必填', trigger: 'blur' }],
        address: [{ required: true, message: '地址必填', trigger: 'blur' }],
        phone: [{ required: true, message: '电话', trigger: 'blur' }],
        cur: [{ required: true, message: '币种', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      HotelApi.getList(this.listQuery).then((response) => {
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
          HotelApi.createData(this.temp).then((response) => {
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
          HotelApi.updateData(tempData).then((response) => {
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
      this.$confirm('此操作将永久删除该酒店, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          HotelApi.destroy(id).then((response) => {
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
    },
    changeStatus(val, id) {
      HotelApi.changeStatus(id, val).then((response) => {
        this.$notify({
          title: '成功',
          message: response.message,
          type: 'success',
          duration: 2000
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
