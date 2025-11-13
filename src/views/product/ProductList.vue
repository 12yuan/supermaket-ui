<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="商品名称/编码"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter="handleFilter"
      />
      <el-select
        v-model="listQuery.categoryId"
        placeholder="商品分类"
        clearable
        class="filter-item"
        style="width: 160px"
      >
        <el-option
          v-for="item in categoryOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-select
        v-model="listQuery.status"
        placeholder="状态"
        clearable
        class="filter-item"
        style="width: 130px"
      >
        <el-option
          v-for="item in statusOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜索
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreate"
        v-permission="['admin']"
      >
        添加商品
      </el-button>
      <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
        v-permission="['admin']"
      >
        导出
      </el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      border
      fit
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column label="ID" align="center" width="80">
        <template #default="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="商品图片" width="110" align="center">
        <template #default="{ row }">
          <el-image
            :src="row.image"
            :preview-src-list="[row.image]"
            style="width: 60px; height: 60px"
          />
        </template>
      </el-table-column>
      <el-table-column label="商品名称" min-width="150px">
        <template #default="{ row }">
          <span class="link-type" @click="handleUpdate(row)">{{ row.name }}</span>
          <el-tag v-if="row.isNew" size="small">新品</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="商品编码" align="center" width="120">
        <template #default="{ row }">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <el-table-column label="分类" width="120" align="center">
        <template #default="{ row }">
          <span>{{ row.categoryName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="价格" width="120" align="center">
        <template #default="{ row }">
          <span>¥{{ row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" width="100" align="center">
        <template #default="{ row }">
          <span>{{ row.stock }}</span>
        </template>
      </el-table-column>
      <el-table-column label="状态" class-name="status-col" width="100">
        <template #default="{ row }">
          <el-tag :type="statusTag(row.status)">
            {{ row.status === 1 ? '上架' : '下架' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
        <template #default="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button
            v-if="row.status === 0"
            size="mini"
            type="success"
            @click="handleModifyStatus(row, 1)"
            v-permission="['admin']"
          >
            上架
          </el-button>
          <el-button
            v-else
            size="mini"
            type="warning"
            @click="handleModifyStatus(row, 0)"
            v-permission="['admin']"
          >
            下架
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleDelete(row)"
            v-permission="['admin']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      v-model:page="listQuery.page"
      v-model:limit="listQuery.limit"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getProducts, deleteProduct, updateProductStatus, getCategories } from '@/api/product';
import waves from '@/directive/waves';
import Pagination from '@/components/Pagination';
import permission from '@/directive/permission';

export default {
  name: 'ProductList',
  components: { Pagination },
  directives: { waves, permission },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: undefined,
        categoryId: undefined,
        status: undefined
      },
      statusOptions: [
        { label: '上架', value: 1 },
        { label: '下架', value: 0 }
      ],
      categoryOptions: [],
      downloadLoading: false
    };
  },
  created() {
    this.getList();
    this.getCategoryOptions();
  },
  methods: {
    statusTag(status) {
      const statusMap = { 1: 'success', 0: 'info' };
      return statusMap[status];
    },
    getList() {
      this.listLoading = true;
      getProducts(this.listQuery).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    getCategoryOptions() {
      getCategories().then(response => {
        this.categoryOptions = response.data.map(item => {
          return { label: item.name, value: item.id };
        });
      }).catch(() => {
        // 如果API调用失败，使用默认分类
        this.categoryOptions = [
          { label: '食品', value: 1 },
          { label: '饮料', value: 2 },
          { label: '日用品', value: 3 },
          { label: '家居', value: 4 }
        ];
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$confirm(`确认要${status === 1 ? '上架' : '下架'}该商品吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        updateProductStatus(row.id, { status }).then(() => {
          this.$message({
            type: 'success',
            message: `${status === 1 ? '上架' : '下架'}成功!`
          });
          row.status = status;
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        });
      });
    },
    handleDelete(row) {
      this.$confirm('确认要删除该商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteProduct(row.id).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!'
          });
          const index = this.list.indexOf(row);
          this.list.splice(index, 1);
          this.total -= 1;
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    handleCreate() {
      this.$router.push('/product/add');
    },
    handleUpdate(row) {
      this.$router.push(`/product/edit/${row.id}`);
    },
    handleDownload() {
      this.downloadLoading = true;
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['ID', '商品名称', '商品编码', '分类', '价格', '库存', '状态'];
        const filterVal = ['id', 'name', 'code', 'categoryName', 'price', 'stock', 'status'];
        const data = this.formatJson(filterVal, this.list);
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '商品列表'
        });
        this.downloadLoading = false;
      });
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        if (j === 'status') {
          return v[j] === 1 ? '上架' : '下架';
        }
        return v[j];
      }));
    }
  }
};
</script>

<style scoped>
.filter-container {
  padding-bottom: 10px;
}

.filter-item {
  display: inline-block;
  vertical-align: middle;
  margin-bottom: 10px;
  margin-right: 10px;
}

.link-type,
.link-type:focus {
  color: #337ab7;
  cursor: pointer;
}

.link-type:hover {
  color: #2a6496;
}
</style>
