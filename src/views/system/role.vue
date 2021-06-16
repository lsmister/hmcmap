<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="编号">
          <el-input v-model="listQuery.id" placeholder="输入ID"></el-input>
        </el-form-item>
        <el-form-item label="标识">
          <el-input v-model="listQuery.slug" placeholder="权限标识"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
          <el-button v-waves class="filter-item" type="default" icon="el-icon-refresh-right" @click="resetFilter">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="filter-container">
      <el-button class="filter-item" type="success" icon="el-icon-plus" @click="handleCreate">
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
      <el-table-column label="标识" align="center">
        <template slot-scope="{row}">
          <span>{{ row.slug }}</span>
        </template>
      </el-table-column>
      <el-table-column label="名称" align="center">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="250" class-name="small-padding fixed-width">
        <template slot-scope="{row, $index}" v-if="isAction(row)">
          <el-link type="warning" icon="el-icon-edit" @click="handleUpdate(row)">编辑</el-link>
          <el-link type="danger" icon="el-icon-delete" @click="handleDelete(row.id, $index)">删除</el-link>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" width="40%" :close-on-click-modal="false"> 
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="padding: 0 30px;">
        <el-form-item label="标识" prop="slug">
          <el-input v-model="temp.slug" placeholder="标识" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" placeholder="名称" />
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

    <el-dialog title="分配权限" :visible.sync="dialogAPVisible" width="40%" :close-on-click-modal="false"> 
      <div class="tree-container" style="height:350px;overflow:auto;">
      <el-row style="margin-bottom: 10px;">
        <el-button type="primary" @click="unFoldAll(true)">全部展开</el-button>
        <el-button type="warning" @click="unFoldAll(false)">全部折叠</el-button>
      </el-row>
        <el-tree
            :data="permissionLists"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            :default-checked-keys="defaultCheckedIds"
            highlight-current
            :props="defaultProps">
        </el-tree>
      </div>
      <div slot="footer" class="dialog-footer">
          <el-button @click="dialogAPVisible = false">
              取消
          </el-button>
          <el-button type="primary" @click="subAllotPermission()">
              提交
          </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as RoleApi from '@/api/system/role'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

export default {
  name: 'SystemRole',
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
        id: undefined,
        slug: ''
      },
      temp: {
        id: undefined,
        name: '',
        slug: ''
      },
      defaultProps: {
          children: 'children',
          label: 'label'
      },
      sourceDataIds: [],
      permissionLists: [],
      defaultCheckedIds: [],
      tempRoleId: undefined,
      allotPermissionId: undefined,
      dialogFormVisible: false,
      dialogAPVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑',
        create: '添加'
      },
      rules: {
        name: [{ required: true, message: '名称必填', trigger: 'blur' }],
        slug: [
            { required: true, message: '标识必填', trigger: 'blur' },
            { pattern: /^[0-9a-zA-Z_]+$/, message: '标识由下划线或小写字母或数字组合而成', trigger: 'blur'}
        ]
      }
    }
  },
  created() {
    this.getList()
  },
  computed: {
    
  },
  methods: {
    isAction: function (params) {
      console.log(params)
      const isarr = [1, 2]
      if (isarr.indexOf(params.id) != -1) {
        return false
      }

      return true;
    },
    getList() {
      this.listLoading = true
      RoleApi.getList(this.listQuery).then(response => {
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
      this.listQuery.slug = ''
      this.listQuery.id = undefined
      this.getList()
    },
    resetTemp() {
      this.temp = {
        name: '',
        slug: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          RoleApi.createData(this.temp).then((response) => {
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
          RoleApi.updateData(tempData).then((response) => {
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
      this.$confirm('此操作将永久删除该角色, 是否确定?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        RoleApi.destroy(id).then((response) => {
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
      
    },
    handleAllotPermission(row) {
      const loading = this.$loading({
          lock: true,
          text: '加载中',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });

        this.tempRoleId = row.id
        RoleApi.allotPermission('get', {role_id: row.id}).then((response) => {
            this.permissionLists = response.data.categoryMenus
            this.sourceDataIds = response.data.categoryIds
            if(response.data.useMenus.length > 0) {
                this.$nextTick(function () {
                    var that = this;
                    response.data.useMenus.forEach((i,n) => {
                        let node = that.$refs.tree.getNode(i);
                        if(node.isLeaf){
                            that.$refs.tree.setChecked(node, true);
                        }
                    }) 
                })
            }
          
          loading.close()
          // this.dialogAPVisible = true
        })
        
    },
    subAllotPermission() {
        const childIds = this.$refs.tree.getCheckedKeys()
        const perentIds = this.$refs.tree.getHalfCheckedKeys()
        const dataIds = childIds.concat(perentIds);
        if(dataIds.length == 0) {
            this.$message.error('请至少分配一个权限');
            return false;
        }
        const tempData = new Object;
        tempData.role_id = this.tempRoleId
        tempData.permission_ids = dataIds
        RoleApi.allotPermission('patch', tempData).then((response) => {
            this.dialogAPVisible = false
            this.$notify({
              title: '成功',
              message: response.message,
              type: 'success',
              duration: 2000
            })
        })
    },
    unFoldAll (flag) {
      let self = this;
      this.sourceDataIds.forEach(function(i) {
        self.$refs.tree.store.nodesMap[i].expanded = flag
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

  .el-dialog__body {
    padding: 10px 20px;
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