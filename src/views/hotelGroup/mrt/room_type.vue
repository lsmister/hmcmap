<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form ref="queryForm" :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="酒店CODE" prop="hotel_code">
          <el-input v-model="listQuery.hotel_code" placeholder="输入酒店CODE"></el-input>
        </el-form-item>
        <el-form-item label="房型CODE" prop="room_type_code">
          <el-input v-model="listQuery.room_type_code" placeholder="输入房型CODE"></el-input>
        </el-form-item>
        <el-form-item label="携程房型CODE" prop="ctrip_room_code">
          <el-input v-model="listQuery.ctrip_room_code" placeholder="输入携程房型CODE"></el-input>
        </el-form-item>
        <el-form-item label="匹配状态:" prop="match_status">
          <el-select v-model="listQuery.match_status" placeholder="请选择" style="width: 120px;" clearable>
            <el-option key="0" label="待匹配" value="0"></el-option>
            <el-option key="1" label="已匹配" value="1"></el-option>
          </el-select>
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
    <!-- <div class="filter-container">
      <el-button
        class="filter-item"
        type="success"
        icon="el-icon-plus"
        @click="handleCreate">
        添加
      </el-button>
    </div> -->

    <el-divider></el-divider>
    <el-table
      :data="list"
      style="width: 100%"
      :key="tableKey"
      v-loading="listLoading"
      stripe
      fit>
      <el-table-column type="selection" width="55" align="left">
      </el-table-column>
      <el-table-column label="ID" align="left" width="100" fixed="left">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="酒店名称">
        <template slot-scope="{ row }">
          <span>{{ row.hotel_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="酒店携程CODE" width="120">
        <template slot-scope="{ row }">
          <span>{{ row.ctrip_hotel_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="酒店CODE" width="100">
        <template slot-scope="{ row }">
          <span>{{ row.hotel_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="房型CODE"  width="80">
        <template slot-scope="{ row }">
          <span>{{ row.room_type_code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="房型名">
        <template slot-scope="{ row }">
          <span>{{ row.room_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="中文名">
        <template slot-scope="{ row }">
          <span>{{ row.cn_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="英文名">
        <template slot-scope="{ row }">
          <span>{{ row.en_name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="匹配状态" align="left">
        <template slot-scope="{ row }">
          <el-tag v-if="row.match_status == 1" type="success">已匹配</el-tag>
          <el-tag v-else type="warning">待匹配</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
        fixed="right"
        class-name="small-padding fixed-width">
        <template slot-scope="{ row, $index }">
          <el-link type="warning" @click="handleUpdate(row)">编辑</el-link>
          <el-link type="danger" @click="handleDelete(row.id, $index)">删除</el-link>
          <el-link type="primary" @click="lookSubRooms(row.id)">子房型</el-link>
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
        :model="temp"
        label-position="center"
        label-width="100px"
        style="padding: 0 30px"
      >
        <el-row :gutter="60">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <el-form-item label="酒店CODE :">
                <el-input v-model="temp.hotel_code" :disabled="true" />
              </el-form-item>
              <el-form-item label="房型CODE :">
                <el-input v-model="temp.room_type_code" :disabled="true" />
              </el-form-item>
              <el-form-item label="携程房型CODE :" label-width="120px">
                <el-input v-model="temp.ctrip_room_code" :disabled="true" />
              </el-form-item>
              <el-form-item label="房型名 :" prop="room_name">
                <el-input v-model="temp.room_name" />
              </el-form-item>
              <el-form-item label="中文名 :" prop="cn_name">
                <el-input v-model="temp.cn_name" />
              </el-form-item>
              <el-form-item label="英文名 :" prop="en_name">
                <el-input v-model="temp.en_name" />
              </el-form-item>
              <el-form-item label="最大入住总人数 :" prop="max_occupancy" label-width="120px">
                <el-input-number v-model="temp.max_occupancy" :min="0" :max="10" label="人数"></el-input-number>
              </el-form-item>
              <el-form-item label="最大入住成人数 :" prop="max_adult_occupancy" label-width="120px">
                <el-input-number v-model="temp.max_adult_occupancy" :min="0" :max="10" label="人数"></el-input-number>
              </el-form-item>
              <el-form-item label="孩童入住 :" prop="is_allow_children">
                <el-radio-group v-model="temp.is_allow_children">
                  <el-radio :label="0">不允许</el-radio>
                  <el-radio :label="1">允许</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple-light">
              <el-form-item label="中文描述 :" prop="cn_describe">
                <el-input v-model="temp.cn_describe" />
              </el-form-item>
              <el-form-item label="英文描述 :" prop="en_describe">
                <el-input v-model="temp.en_describe" />
              </el-form-item>
              <el-form-item label="币种 :" prop="cur">
                <el-input v-model="temp.cur" />
              </el-form-item>
              <el-form-item label="面积 :" prop="size">
                <el-input-number v-model="temp.size" :min="0" :max="100" label="面积"></el-input-number>
              </el-form-item>
              <el-form-item label="烟 :" prop="has_smoke">
                <el-select v-model="temp.has_smoke" placeholder="请选择">
                  <el-option
                    v-for="item in smokeOptions"
                    :key="item.value"
                    :label="item.title"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="窗 :" prop="has_window">
                <el-select v-model="temp.has_window" placeholder="请选择">
                  <el-option
                    v-for="item in windowOptions"
                    :key="item.value"
                    :label="item.title"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="WiFi :" prop="has_wifi">
                <el-select v-model="temp.has_wifi" placeholder="请选择">
                  <el-option
                    v-for="item in wifiOptions"
                    :key="item.value"
                    :label="item.title"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="有线宽带 :" prop="has_cableinter">
                <el-select v-model="temp.has_cableinter" placeholder="请选择">
                  <el-option
                    v-for="item in cableinterOptions"
                    :key="item.value"
                    :label="item.title"
                    :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="共享床铺的孩童数量 :" prop="sbc_occupancy" label-width="150px">
                <el-input-number v-model="temp.sbc_occupancy" :min="0" :max="10" label="数量"></el-input-number>
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


    <el-dialog title="子房型" :visible.sync="dialogTableVisible" width="50%" :close-on-click-modal="false">
      <el-table :data="subRoomLists" v-loading="sublistLoading" stripe fit max-height="400">
        <el-table-column label="ID" property="id" width="100"></el-table-column>
        <el-table-column property="hotel_code" label="酒店CODE" width="100"></el-table-column>
        <el-table-column property="room_type_code" label="房型CODE" width="80"></el-table-column>
        <el-table-column property="rate_plan_code" label="子房型CODE" width="100"></el-table-column>
        <el-table-column label="最大入住人数" width="100">
          <template slot-scope="{ row }">
            <el-input v-model="row.max_occupancy" placeholder="人数"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="早餐" width="100">
          <template slot-scope="{ row }">
            <el-input v-model="row.has_breakfast" placeholder="数量"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="午餐" width="100">
          <template slot-scope="{ row }">
            <el-input v-model="row.has_lunch" placeholder="数量"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="晚餐" width="100">
          <template slot-scope="{ row }">
            <el-input v-model="row.has_dinner" placeholder="数量"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="匹配状态" align="left">
          <template slot-scope="{ row }">
            <el-tag v-if="row.match_status == 1" type="success">已匹配</el-tag>
            <el-tag v-else type="warning">待匹配</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="80"
          fixed="right"
          class-name="small-padding fixed-width">
          <template slot-scope="{ row, $index }">
            <el-button type="danger" @click="editSubRoom(row, $index)">更新</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>

  </div>
</template>

<script>
import * as RoomTypeApi from "@/api/mrt/roomType";
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
      sublistLoading: false,
      listQuery: {
        page: 1,
        limit: 10,
        hotel_code: '',
        room_type_code: '',
        ctrip_room_code: '',
        match_status: null
      },
      subRoomLists: [],
      smokeOptions: [
        {title: '未知', value: 0},
        {title: '可吸烟', value: 1},
        {title: '不可吸烟', value: 2},
        {title: '部分客房可吸', value: 3}
      ],
      windowOptions: [
        {title: '未知', value: -100},
        {title: '无窗', value: 0},
        {title: '部分有窗', value: 1},
        {title: '有窗', value: 2}
      ],
      wifiOptions: [
        {title: '不提供', value: 0},
        {title: '全部提供', value: 1},
        {title: '部分提供', value: 2}
      ],
      cableinterOptions: [
        {title: '不提供', value: 0},
        {title: '全部提供', value: 1},
        {title: '部分提供', value: 2}
      ],
      temp: {},
      tempUserId: undefined,
      dialogFormVisible: false,
      dialogTableVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      }
    }
  },
  created() {
    this.getList()
  },
  methods: {
    getList() {
      this.listLoading = true
      RoomTypeApi.getList(this.listQuery).then((response) => {
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
          RoomTypeApi.createData(this.temp).then((response) => {
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
          RoomTypeApi.updateData(tempData).then((response) => {
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
          RoomTypeApi.destroy(id).then((response) => {
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
    lookSubRooms(id) {
      this.dialogTableVisible = true
      this.sublistLoading = true
      RoomTypeApi.lookSubRooms(id).then((response) => {
        this.sublistLoading = false
        this.subRoomLists = response.data
      })
    },
    editSubRoom(row, index) {
      RoomTypeApi.editSubRoom(row).then((response) => {
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

.el-dialog__body {
  padding-top: 0;
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
