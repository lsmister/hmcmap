<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="名称">
          <el-input v-model="listQuery.id" placeholder="输入城市名称"></el-input>
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
      <el-table-column label="城市名" align="center">
        <template slot-scope="{ row }">
          <span>{{ row.name }}</span>
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
        <el-form-item label="城市名" prop="name">
          <el-input v-model="temp.name" placeholder="城市名" />
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
  </div>
</template>

<script>
import * as CityApi from "@/api/city";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "City",
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
        name: "",
      },
      temp: {
        id: undefined,
        name: "",
      },
      dialogFormVisible: false,
      dialogARVisible: false,
      dialogStatus: "",
      textMap: {
        update: "编辑",
        create: "添加",
      },
      rules: {
        name: [{ required: true, message: "城市名必填", trigger: "blur" }]
      },
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      CityApi.getList(this.listQuery).then((response) => {
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
      this.listQuery.name = "";
      this.getList()
    },
    resetTemp() {
      this.temp = {
        name: "",
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    createData() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          CityApi.createData(this.temp).then((response) => {
            this.temp.id = response.data.id;
            this.list.push(this.temp);
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
          CityApi.updateData(tempData).then((response) => {
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
      this.$confirm("此操作将永久删除该城市, 是否确定?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          CityApi.destroy(id).then((response) => {
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
</style>