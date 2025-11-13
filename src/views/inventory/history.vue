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
        v-model="listQuery.type"
        placeholder="变更类型"
        clearable
        style="width: 130px"
        class="filter-item"
      >
        <el-option
          v-for="item in typeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        class="filter-item"
        style="width: 300px;"
      />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜索
      </el-button>
      <el-button class="filter-item" type="success" icon="el-icon-download" @click="handleExport">
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
    >
      <el-table-column label="ID" align="center" width="80">
        <template #default="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="商品信息" min-width="200px">
        <template #default="{ row }">
          <div class="product-info">
            <el-image
              v-if="row.product.image"
              :src="row.product.image"
              fit="contain"
              style="width: 50px; height: 50px"
            />
            <div class="product-detail">
              <div>{{ row.product.name }}</div>
              <div class="product-code">编码: {{ row.product.code }}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column label="变更类型" width="120" align="center">
        <template #default="{ row }">
          <el-tag :type="getTypeTag(row.type)">
            {{ getTypeName(row.type) }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="变更前数量" width="120" align="center">
        <template #default="{ row }">
          <span>{{ row.beforeQuantity }}</span>
        </template>
      </el-table-column>

      <el-table-column label="变更后数量" width="120" align="center">
        <template #default="{ row }">
          <span>{{ row.afterQuantity }}</span>
        </template>
      </el-table-column>

      <el-table-column label="变更数量" width="120" align="center">
        <template #default="{ row }">
          <span :class="row.changeQuantity > 0 ? 'text-success' : 'text-danger'">
            {{ row.changeQuantity > 0 ? '+' : '' }}{{ row.changeQuantity }}
          </span>
        </template>
      </el-table-column>

      <el-table-column label="操作人" width="120" align="center">
        <template #default="{ row }">
          <span>{{ row.operator }}</span>
        </template>
      </el-table-column>

      <el-table-column label="备注" min-width="150">
        <template #default="{ row }">
          <span>{{ row.remark || '-' }}</span>
        </template>
      </el-table-column>

      <el-table-column label="操作时间" width="180" align="center">
        <template #default="{ row }">
          <span>{{ parseTime(row.createdAt) }}</span>
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
import { getInventoryHistory, exportInventoryHistory } from '@/api/inventory';
import Pagination from '@/components/Pagination';

export default {
  name: 'InventoryHistory',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: undefined,
        type: undefined,
        startDate: undefined,
        endDate: undefined
      },
      dateRange: [],
      typeOptions: [
        { label: '入库', value: 'in' },
        { label: '出库', value: 'out' },
        { label: '盘点', value: 'check' },
        { label: '退货', value: 'return' },
        { label: '调整', value: 'adjust' }
      ]
    };
  },
  watch: {
    dateRange(val) {
      if (val) {
        this.listQuery.startDate = val[0];
        this.listQuery.endDate = val[1];
      } else {
        this.listQuery.startDate = undefined;
        this.listQuery.endDate = undefined;
      }
    }
  },
  created() {
    this.getList();
  },
  methods: {
    parseTime(time) {
      return time ? new Date(time).toLocaleString() : '';
    },
    getList() {
      this.listLoading = true;
      getInventoryHistory(this.listQuery).then(response => {
        this.list = response.data.items;
        this.total = response.data.total;
        this.listLoading = false;
      }).catch(() => {
        this.listLoading = false;
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    getTypeName(type) {
      const typeMap = {
        in: '入库',
        out: '出库',
        check: '盘点',
        return: '退货',
        adjust: '调整'
      };
      return typeMap[type] || type;
    },
    getTypeTag(type) {
      const typeMap = {
        in: 'success',
        out: 'danger',
        check: 'info',
        return: 'warning',
        adjust: ''
      };
      return typeMap[type] || '';
    },
    handleExport() {
      this.$confirm('确认导出库存变更记录?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.downloadLoading = true;
        exportInventoryHistory(this.listQuery).then(response => {
          const blob = new Blob([response.data], { type: 'application/vnd.ms-excel' });
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(blob);
          link.download = '库存变更记录.xlsx';
          link.click();
          this.downloadLoading = false;
        }).catch(() => {
          this.downloadLoading = false;
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
.filter-container {
  padding-bottom: 10px;
  .filter-item {
    margin-right: 10px;
    margin-bottom: 10px;
  }
}

.product-info {
  display: flex;
  align-items: center;
  
  .product-detail {
    margin-left: 10px;
    
    .product-code {
      font-size: 12px;
      color: #909399;
    }
  }
}

.text-success {
  color: #67C23A;
}

.text-danger {
  color: #F56C6C;
}
</style>
