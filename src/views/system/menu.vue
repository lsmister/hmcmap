<template>
  <div class="app-container">
    <el-row :gutter="20">
        <el-col :span="7">
            <el-button-group style="margin-bottom: 20px;">
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="unFoldAll(true)">展开</el-button>
                <el-button type="warning" icon="el-icon-remove-outline" @click="unFoldAll(false)">收起</el-button>
            </el-button-group>
            <el-tree
            :data="list"
            node-key="id"
            ref="tree"
            default-expand-all
            :expand-on-click-node="false"
            style="border: 1px solid #ddd;padding:10px;"
            v-loading="menuload">
            <span class="custom-tree-node" slot-scope="{ node, data }">
                <span class="title"><svg-icon v-if="data.icon" :icon-class="data.icon" /> {{ node.label }}</span>
                <span class="action">
                    <el-link type="success" @click="handleCreate(data)">添加</el-link>
                    <el-link type="warning" @click="handleUpdate(data)" v-if="data.id != 0">编辑</el-link>
                    <el-link type="danger" @click="handleDelete(data)" v-if="data.id != 0">删除</el-link>
                </span>
            </span>
            </el-tree>
        </el-col>
    </el-row>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :close-on-click-modal="false">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="120px" style="padding: 0 30px;">

        <el-form-item label="父级菜单">
          <el-input v-model="temp.parent_name" readonly/>
        </el-form-item>

        <el-form-item label="路径" prop="path">
          <el-input v-model="temp.path" placeholder="输入 菜单路径" />
        </el-form-item>

        <el-form-item label="菜单名称(中文)" prop="title">
          <el-input v-model="temp.title" placeholder="输入 菜单名称" />
        </el-form-item>

        <el-form-item label="菜单名称(英文)" prop="name">
          <el-input v-model="temp.name" placeholder="输入 菜单名称" />
        </el-form-item>

        <el-form-item label="菜单图标" prop="icon">
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

        <el-form-item label="组件地址" prop="component">
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
import waves from '@/directive/waves'
import Pagination from '@/components/Pagination'
import IconSelect from '@/components/IconSelect'

export default {
    name: 'Menu',
    components: { IconSelect, Pagination },
    directives: { waves },
    data() {
        return {
            form: {
                parent_id: null,
                parent_name: ""
            },
            menuload: true,
            isSubmitDis: true,
            list: [],
            sourceDataIds: [],
            dialogFormVisible: false,
            dialogStatus: '',
            textMap: {
                update: '编辑',
                create: '添加'
            },
            temp: {
                id: undefined,
                parent_id: null,
                parent_name: '',
                title: '',
                icon: '',
                component: '',
                order: 0,
                path: '',
                name: ''
            },
            rules: {
                title: [{ required: true, message: '菜单名称必填', trigger: 'blur' }],
                order: [{ required: true, message: '排序必填', trigger: 'blur' }],
                path: [{ required: true, message: '菜单路径必填', trigger: 'blur' }],
                name: [{ required: true, message: '菜单路径必填', trigger: 'blur' }],
            }
        }
    },
    created() {
        this.getList()
    },
    methods: {
        getList() {
            MenuApi.getLevelOptions().then(response => {
                this.list = response.data.categoryMenus
                this.sourceDataIds = response.data.categoryIds
                this.menuload = false
            })
        },
      handleNodeClick(data) {
        this.form.parent_id = data.id
        let da = this.findParent(this.list, data.id)
        this.form.parent_name = da.reverse().join(' -> ')
      },
      findParent(list, id) {
          for (let i in list) {
            if(list[i].id==id){
                return [list[i].label]
            }
            if(list[i].children){
                let node=this.findParent(list[i].children,id);
                if(node!==undefined){
                    return node.concat(list[i].label)
                }
            }
          }
      },
      onSubmit() {

      },
      unFoldAll (flag) {
        let self = this;
        this.sourceDataIds.forEach(function(i) {
            self.$refs.tree.store.nodesMap[i].expanded = flag
        });
      },
      selecteIcon(name) {
        this.temp.icon = name
      },
      handleCreate(data) {
        this.dialogStatus = 'create'
        this.dialogFormVisible = true

        this.temp.parent_id = data.id

        let da = this.findParent(this.list, data.id)
        this.temp.parent_name = da.reverse().join(' -> ')
        
        this.$nextTick(() => {
            // this.temp.icon = ''
            this.$refs['dataForm'].resetFields()
        })
      },
      createData() {
        this.$refs['dataForm'].validate((valid) => {
            if (valid) {
                MenuApi.createData(this.temp).then((response) => {
                    this.list = response.data.categoryMenus
                    this.sourceDataIds = response.data.categoryIds
                    this.dialogFormVisible = false
                    this.$notify({
                        title: '成功',
                        message: '添加成功',
                        type: 'success',
                        duration: 2000
                    })
                })
            }
        })
      },
      handleUpdate(data) {
        MenuApi.getMenuInfo(data.id).then(response => {
          
          this.dialogStatus = 'update'
          this.dialogFormVisible = true
          this.$nextTick(() => {
            this.$refs['dataForm'].clearValidate()
            this.temp = Object.assign({}, response.data)
          })
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
            if (valid) {
                MenuApi.updateData(this.temp).then((response) => {
                    this.list = response.data.categoryMenus
                    this.sourceDataIds = response.data.categoryIds
                    this.dialogFormVisible = false
                    this.$notify({
                        title: '成功',
                        message: '更新成功',
                        type: 'success',
                        duration: 2000
                    })
                })
            }
        })
      },
      handleDelete(data) {
        this.$confirm('此操作将永久删除该菜单, 是否确定?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            MenuApi.destroy(data.id).then((response) => {
                this.$notify({
                    title: '成功',
                    message: response.message,
                    type: 'success',
                    duration: 2000
                })

                this.$refs['tree'].remove(data)
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


<style scoped>

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

    .custom-tree-node:hover {
       /* background-color: #eee; */
       color: #337AB7;
    }

    .custom-tree-node .el-link {
        font-size: 12px;
        margin-left: 10px;
    }
</style>