<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline" ref="queryForm">
        <el-form-item label="编号">
          <el-input v-model="listQuery.id" placeholder="输入ID"></el-input>
        </el-form-item>
        <el-form-item label="账号">
          <el-input
            v-model="listQuery.username"
            placeholder="登录账号"
          ></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="listQuery.name" placeholder="昵称"></el-input>
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
      <el-table-column label="昵称" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账号" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.role_label }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="250"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }" v-if="row.id != 1">
          <el-link type="primary" @click="handleAllotRole(row)">分配角色</el-link>
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
      width="40%"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="70px"
        style="padding: 0 30px"
      >
        <el-form-item label="昵称" prop="name">
          <el-input v-model="temp.name" placeholder="昵称" />
        </el-form-item>
        <el-form-item label="账号" prop="username">
          <el-input v-model="temp.username" placeholder="登录账号" />
        </el-form-item>
        <el-form-item
          label="密码"
          :prop="dialogStatus == 'create' ? 'password' : ''"
        >
          <el-input
            v-model="temp.password"
            placeholder="登录密码"
            show-password
          />
        </el-form-item>
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

    <!-- 分配角色弹框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="dialogARVisible"
      width="40%"
      :close-on-click-modal="false"
    >
      <el-radio-group v-model="allotRoleId">
        <el-radio v-for="item in roleLists" :key="item.id" :label="item.id" border>{{ item.name }}</el-radio>
      </el-radio-group>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogARVisible = false"> 取消 </el-button>
        <el-button type="primary" @click="subAllotRole()"> 提交 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import * as UserApi from "@/api/system/user";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "SystemUser",
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
        username: "",
        name: "",
      },
      roleLists: [],
      temp: {
        id: undefined,
        name: "",
        username: "",
        password: "",
      },
      tempUserId: undefined,
      allotRoleId: 0,
      dialogFormVisible: false,
      dialogARVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加",
      },
      rules: {
        name: [{ required: true, message: "昵称必填", trigger: "blur" }],
        username: [{ required: true, message: "账号必填", trigger: "blur" }],
        password: [{ required: true, message: "密码必填", trigger: "blur" }],
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      UserApi.getList(this.listQuery).then((response) => {
        this.list = response.data.data;
        this.total = response.data.total;

        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    resetFilter() {
      this.$refs['queryForm'].resetFields()
      this.getList()
    },
    handleCreate() {
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          UserApi.createData(this.temp).then((response) => {
            const newrow = {
              id: response.data.id,
              name: response.data.name,
              username: response.data.username,
              role_label: response.data.role_label
            }
            
            this.list.push(newrow);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: response.message,
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          UserApi.updateData(tempData).then((response) => {
            const index = this.list.findIndex((v) => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "成功",
              message: response.message,
              type: "success",
              duration: 2000,
            });
          });
        }
      });
    },
    handleDelete(id, index) {
      this.$confirm("此操作将永久删除该用户, 是否确定?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          UserApi.destroy(id).then((response) => {
            this.$notify({
              title: "成功",
              message: response.message,
              type: "success",
              duration: 2000,
            });
            this.list.splice(index, 1);
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleAllotRole(row) {
      const loading = this.$loading({
        lock: true,
        text: '加载中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });

      this.tempUserId = row.id;
      const tempData = new Object();
      tempData.user_id = row.id;
      UserApi.allotRole("get", tempData).then((response) => {
        this.roleLists = response.data.all_roles;
        loading.close()
        this.dialogARVisible = true;
        this.allotRoleId = response.data.user_role_id;
      });
    },
    subAllotRole() {
      const tempData = new Object();
      tempData.user_id = this.tempUserId;
      tempData.role_id = this.allotRoleId;
      UserApi.allotRole("post", tempData).then((response) => {
        const index = this.list.findIndex((v) => v.id === response.data.id);
        this.list.splice(index, 1, response.data);
        this.dialogARVisible = false;
        this.$notify({
          title: "成功",
          message: response.message,
          type: "success",
          duration: 2000,
        });
      });
    },
  },
};
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

.el-tag {
  margin: 0 2px;
}

</style>