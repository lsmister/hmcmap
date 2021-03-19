<template>
  <div class="app-container">
    <!-- <div class="filter-container">
      <el-input v-model="listQuery.id" placeholder="ID" style="width: 100px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.parent_id" placeholder="顶级菜单" clearable class="filter-item" style="width: 150px">
        <el-option v-for="item in topLevelOptions" :key="item.id" :label="item.title" :value="item.id" />
      </el-select>
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <div style="display: inline-block; float: right;">
        <el-button class="filter-item" type="success" icon="el-icon-plus" @click="handleCreate">
          添加
        </el-button>
      </div>
    </div> -->
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline" size="mini">
        <el-form-item label="编号">
          <el-input v-model="listQuery.id" placeholder="输入ID"></el-input>
        </el-form-item>
        <el-form-item label="菜单名称">
          <el-input v-model="listQuery.title" placeholder="菜单名称"></el-input>
        </el-form-item>
        <el-form-item label="权限类型">
          <el-select placeholder="选择" v-model="listQuery.permission_type">
            <el-option label="页面权限" value="page"></el-option>
            <el-option label="指令权限" value="instruct"></el-option>
          </el-select>
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
        @click="handleCreate"
      >
        添加
      </el-button>
    </div>
    <el-divider></el-divider>
    <el-table
      :data="list"
      style="width: 100%;"
      :key="tableKey"
      v-loading="listLoading"
      stripe
      fit>
      <el-table-column
        type="selection"
        width="55"
        align="center">
      </el-table-column>
      <el-table-column label="ID" align="center">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="上级" align="center">
        <template slot-scope="{row}">
          <span>{{ row.parent_label }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="图标" align="center">
        <template slot-scope="{row}">
          <svg-icon v-if="row.icon" :icon-class="row.icon" />
        </template>
      </el-table-column>
      <el-table-column label="路由" align="center" width="170" show-overflow-tooltip>
        <template slot-scope="{row}">
          <span>{{ row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="组件" align="center">
        <template slot-scope="{row}">
          <span>{{ row.component }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center">
        <template slot-scope="{row}">
          <span>{{ row.order }}</span>
        </template>
      </el-table-column>
      <el-table-column label="权限类型" align="center">
        <template slot-scope="{row}">
          <el-tag
          :type="row.permission_type === 'page' ? 'primary' : 'success'"
          disable-transitions>{{row.permission_type == 'page' ? '页面权限':'指令权限'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" fixed="right">
        <template slot-scope="{ row, $index }">
          <el-link type="warning" icon="el-icon-edit" @click="handleUpdate(row)">编辑</el-link>
          <el-link type="danger" icon="el-icon-delete" @click="handleDelete(row.id, $index)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="padding: 0 30px;">
        <!-- <el-form-item label="上级菜单" prop="parent_id">
          <el-select v-model="temp.parent_id" class="filter-item" clearable placeholder="请选择">
            <el-option v-for="item in selectOptions" :key="item.id" :label="item.title" :value="item.id" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="上级菜单" prop="parent_id" >
          <treeselect
            v-model="temp.parent_id"
            :options="selectOptions"
            :show-count="true"
            placeholder="选择上级菜单"
            />
        </el-form-item>

        <el-form-item label="菜单名称" prop="title">
          <el-input v-model="temp.title" placeholder="输入 菜单名称" />
        </el-form-item>
        <!-- <el-form-item label="图标" prop="icon">
          <el-popover
            placement="right"
            width="250"
            trigger="click">
              <el-row :gutter="20" v-for="items in iconLists">
                <el-col :span="6" v-for="item in items">
                  <div class="icondiv" @click="submitIcon(item)">
                    <svg-icon :icon-class="item" style="width: 100%;" />
                  </div>
                </el-col>
              </el-row>
            <el-input v-model="temp.icon" slot="reference" placeholder="选择图标" />
          </el-popover>
        </el-form-item> -->
        <el-form-item label="菜单图标">
          <el-popover
            placement="bottom-start"
            width="460"
            trigger="click"
            @show="$refs['iconSelect'].reset()"
          >
            <IconSelect ref="iconSelect" @selected="selecteIcon" />
            <el-input slot="reference" v-model="temp.icon" placeholder="点击选择图标" readonly>
              <svg-icon
                v-if="temp.icon"
                slot="prefix"
                :icon-class="temp.icon"
                class="el-input__icon"
                style="height: 32px;width: 16px;"
              />
              <i v-else slot="prefix" class="el-icon-search el-input__icon" />
            </el-input>
          </el-popover>
        </el-form-item>

        <el-form-item label="权限类型">
          <el-radio-group v-model="temp.permission_type">
            <el-radio label="page" @change="componentShow(true)">页面权限</el-radio>
            <el-radio label="instruct" @change="componentShow(false)">指令权限</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="路由地址" prop="url">
          <el-input v-model="temp.url" placeholder="输入 路由地址 如:system/ceshi" />
        </el-form-item>

        <el-form-item label="组件地址" prop="component" v-if="isComponent">
          <el-input v-model="temp.component" placeholder="view目录下组件地址 如:system/menu" />
        </el-form-item>
        
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="temp.order" :min="0" :max="100" label="排序"></el-input-number>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as MenuApi from '@/api/system/menu'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import IconSelect from '@/components/IconSelect'

export default {
  name: 'SystemMenu',
  components: { Treeselect, IconSelect, Pagination },
  directives: { waves },
  data() {
    return {
      isComponent: true,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        id: undefined,
        title: undefined,
        permission_type: undefined
      },
      iconLists: [],
      selectOptions: [],
      topLevelOptions: [],
      temp: {
        id: undefined,
        parent_id: null,
        title: '',
        icon: '',
        url: '',
        component: '',
        permission_type: '',
        order: 0
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rules: {
        parent_id: [{ required: true, message: '请选择上级菜单', trigger: 'blur' }],
        title: [{ required: true, message: '菜单名称必填', trigger: 'blur' }],
        order: [{ required: true, message: '排序必填', trigger: 'blur' }],
      }
    }
  },
  created() {
    this.getList()
    // this.getTopLevel()
  },
  methods: {
    getList() {
      this.listLoading = true
      MenuApi.getList(this.listQuery).then(response => {
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
      this.listQuery.id = undefined
      this.listQuery.title = undefined
      this.listQuery.permission_type = undefined
      this.getList()
    },
    getSelectOption() {
      MenuApi.getSelectOptions().then(response => {
        this.selectOptions = response.data
      })
    },
    getTopLevel() {
      MenuApi.getTopLevel().then(response => {
        this.topLevelOptions = response.data
      })
    },
    selecteIcon(name) {
      this.temp.icon = name
    },
    componentShow(f) {
      this.isComponent = f
    },
    resetTemp() {
      this.temp = {
        parent_id: null,
        title: '',
        icon: '',
        url: '',
        component: '',
        permission_type: 'page',
        order: 0
      }
    },
    handleCreate() {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      Promise.all([
        this.getSelectOption(),
        this.resetTemp()
      ]).then(res => {
          loading.close()
          this.dialogStatus = 'create'
          this.isComponent = true
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
          })
      })
      
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (this.temp.permission_type != 'page') {
            this.temp.component = null
          }
          MenuApi.createData(this.temp).then((response) => {
            this.temp.id = response.data.id
            this.temp.parent_label = response.data.parent_label
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
      this.getSelectOption()
      this.temp = Object.assign({}, row)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      if (this.temp.permission_type == 'page') {
        this.isComponent = true
      }
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          MenuApi.updateData(tempData).then((response) => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
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
      this.$confirm('此操作将永久删除该菜单, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        MenuApi.destroy(id).then((response) => {
          this.$notify({
            title: '成功',
            message: response.message,
            type: 'success',
            duration: 2000
          })
          this.list.splice(index, 1)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
      
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

/* .filter-container {
  margin-bottom: 10px;
} */

.el-divider {
  margin: 10px 0 5px 0;
}

.filter-item {
  margin-right: 10px;
}

.icondiv {
  /* border: 1px solid red; */
  text-align: center;
  padding: 7px 0;
}

.icondiv:hover {
  background-color: #ccc;
}

.el-link {
  font-size: 12px;
  margin: 0 5px;
}

</style>