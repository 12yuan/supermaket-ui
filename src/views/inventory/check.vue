<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-plus"
        @click="handleCreateCheck"
      >
        新建盘点
      </el-button>
    </div>

    <el-tabs v-model="activeTab" @tab-click="handleTabClick">
      <el-tab-pane label="盘点记录" name="records">
        <div class="filter-container">
          <el-input
            v-model="recordsQuery.keyword"
            placeholder="盘点单号/操作人"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleRecordsFilter"
          />
          <el-select
            v-model="recordsQuery.status"
            placeholder="盘点状态"
            clearable
            style="width: 130px"
            class="filter-item"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-date-picker
            v-model="recordsDateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            class="filter-item"
            style="width: 300px;"
          />
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleRecordsFilter">
            搜索
          </el-button>
        </div>

        <el-table
          v-loading="recordsLoading"
          :data="records"
          element-loading-text="加载中..."
          border
          fit
          highlight-current-row
        >
          <el-table-column label="盘点单号" align="center" width="180">
            <template slot-scope="{row}">
              <span>{{ row.checkNo }}</span>
            </template>
          </el-table-column>

          <el-table-column label="盘点状态" width="120" align="center">
            <template slot-scope="{row}">
              <el-tag :type="getStatusType(row.status)">
                {{ getStatusName(row.status) }}
              </el-tag>
            </template>
          </el-table-column>

          <el-table-column label="商品数量" width="100" align="center">
            <template slot-scope="{row}">
              <span>{{ row.productCount }}</span>
            </template>
          </el-table-column>

          <el-table-column label="差异数量" width="100" align="center">
            <template slot-scope="{row}">
              <span :class="row.diffCount > 0 ? 'text-warning' : ''">{{ row.diffCount }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作人" width="120" align="center">
            <template slot-scope="{row}">
              <span>{{ row.operator }}</span>
            </template>
          </el-table-column>

          <el-table-column label="备注" min-width="150">
            <template slot-scope="{row}">
              <span>{{ row.remark || '-' }}</span>
            </template>
          </el-table-column>

          <el-table-column label="创建时间" width="180" align="center">
            <template slot-scope="{row}">
              <span>{{ row.createdAt | parseTime }}</span>
            </template>
          </el-table-column>

          <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
            <template slot-scope="{row}">
              <el-button type="primary" size="mini" @click="handleViewDetail(row)">
                查看详情
              </el-button>
              <el-button 
                v-if="row.status === 'draft'"
                type="success" 
                size="mini" 
                @click="handleSubmitCheck(row)"
              >
                提交盘点
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="recordsTotal > 0"
          :total="recordsTotal"
          :page.sync="recordsQuery.page"
          :limit.sync="recordsQuery.limit"
          @pagination="getRecords"
        />
      </el-tab-pane>

      <el-tab-pane label="盘点详情" name="detail" :disabled="!currentCheck">
        <div v-if="currentCheck" class="check-detail-header">
          <div class="check-info">
            <h3>盘点单号: {{ currentCheck.checkNo }}</h3>
            <div class="check-meta">
              <span>状态: 
                <el-tag :type="getStatusType(currentCheck.status)">
                  {{ getStatusName(currentCheck.status) }}
                </el-tag>
              </span>
              <span>操作人: {{ currentCheck.operator }}</span>
              <span>创建时间: {{ currentCheck.createdAt | parseTime }}</span>
            </div>
            <div v-if="currentCheck.remark" class="check-remark">
              备注: {{ currentCheck.remark }}
            </div>
          </div>
          <div class="check-actions" v-if="currentCheck.status === 'draft'">
            <el-button type="primary" @click="handleSubmitCheck(currentCheck)">提交盘点</el-button>
          </div>
        </div>

        <div class="filter-container">
          <el-input
            v-model="detailQuery.keyword"
            placeholder="商品名称/编码"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleDetailFilter"
          />
          <el-select
            v-model="detailQuery.diffType"
            placeholder="差异类型"
            clearable
            style="width: 130px"
            class="filter-item"
          >
            <el-option label="有差异" value="diff" />
            <el-option label="无差异" value="nodiff" />
          </el-select>
          <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleDetailFilter">
            搜索
          </el-button>
        </div>

        <el-table
          v-loading="detailLoading"
          :data="details"
          element-loading-text="加载中..."
          border
          fit
          highlight-current-row
        >
          <el-table-column label="商品信息" min-width="200px">
            <template slot-scope="{row}">
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

          <el-table-column label="系统库存" width="100" align="center">
            <template slot-scope="{row}">
              <span>{{ row.systemQuantity }}</span>
            </template>
          </el-table-column>

          <el-table-column label="实际库存" width="150" align="center">
            <template slot-scope="{row}">
              <el-input-number
                v-if="currentCheck && currentCheck.status === 'draft'"
                v-model="row.actualQuantity"
                :min="0"
                :max="9999"
                size="mini"
                @change="handleQuantityChange(row)"
              />
              <span v-else>{{ row.actualQuantity }}</span>
            </template>
          </el-table-column>

          <el-table-column label="差异" width="100" align="center">
            <template slot-scope="{row}">
              <span :class="getDiffClass(row)">
                {{ row.actualQuantity - row.systemQuantity }}
              </span>
            </template>
          </el-table-column>

          <el-table-column label="备注" min-width="150">
            <template slot-scope="{row}">
              <el-input
                v-if="currentCheck && currentCheck.status === 'draft'"
                v-model="row.remark"
                type="textarea"
                :rows="1"
                placeholder="备注"
                @change="handleRemarkChange(row)"
              />
              <span v-else>{{ row.remark || '-' }}</span>
            </template>
          </el-table-column>
        </el-table>

        <pagination
          v-show="detailTotal > 0"
          :total="detailTotal"
          :page.sync="detailQuery.page"
          :limit.sync="detailQuery.limit"
          @pagination="getDetails"
        />
      </el-tab-pane>
    </el-tabs>

    <el-dialog title="新建盘点" :visible.sync="createDialogVisible">
      <el-form
        ref="createForm"
        :model="createForm"
        :rules="createRules"
        label-width="100px"
      >
        <el-form-item label="盘点范围" prop="scope">
          <el-radio-group v-model="createForm.scope">
            <el-radio label="all">全部商品</el-radio>
            <el-radio label="category">按分类</el-radio>
            <el-radio label="keyword">按关键词</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="createForm.scope === 'category'" label="商品分类" prop="categoryId">
          <el-select v-model="createForm.categoryId" placeholder="请选择商品分类">
            <el-option
              v-for="item in categories"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>

        <el-form-item v-if="createForm.scope === 'keyword'" label="关键词" prop="keyword">
          <el-input v-model="createForm.keyword" placeholder="商品名称/编码" />
        </el-form-item>

        <el-form-item label="备注">
          <el-input v-model="createForm.remark" type="textarea" :rows="3" placeholder="备注信息" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="createDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitCreateCheck">确认</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提交盘点确认" :visible.sync="submitDialogVisible">
      <div class="submit-confirm">
        <p>确认提交此次盘点结果吗？提交后将根据盘点结果自动调整库存。</p>
        <p class="warning">注意：提交后将无法修改盘点数据！</p>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="submitDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmSubmitCheck">确认提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { 
  getInventoryCheckRecords, 
  getInventoryCheckDetails, 
  createInventoryCheck, 
  updateInventoryCheckDetail,
  submitInventoryCheck
} from '@/api/inventory';
import { getCategories } from '@/api/product';
import Pagination from '@/components/Pagination';

export default {
  name: 'InventoryCheck',
  components: { Pagination },
  filters: {
    parseTime(time) {
      return time ? new Date(time).toLocaleString() : '';
    }
  },
  data() {
    return {
      activeTab: 'records',
      // 盘点记录相关
      records: [],
      recordsTotal: 0,
      recordsLoading: true,
      recordsQuery: {
        page: 1,
        limit: 10,
        keyword: undefined,
        status: undefined,
        startDate: undefined,
        endDate: undefined
      },
      recordsDateRange: [],
      statusOptions: [
        { label: '草稿', value: 'draft' },
        { label: '已完成', value: 'completed' }
      ],
      // 盘点详情相关
      currentCheck: null,
      details: [],
      detailTotal: 0,
      detailLoading: false,
      detailQuery: {
        page: 1,
        limit: 10,
        keyword: undefined,
        diffType: undefined,
        checkId: undefined
      },
      // 新建盘点相关
      createDialogVisible: false,
      createForm: {
        scope: 'all',
        categoryId: undefined,
        keyword: undefined,
        remark: ''
      },
      createRules: {
        scope: [{ required: true, message: '请选择盘点范围', trigger: 'change' }],
        categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
        keyword: [{ required: true, message: '请输入关键词', trigger: 'blur' }]
      },
      categories: [],
      // 提交盘点相关
      submitDialogVisible: false,
      checkToSubmit: null
    };
  },
  watch: {
    recordsDateRange(val) {
      if (val) {
        this.recordsQuery.startDate = val[0];
        this.recordsQuery.endDate = val[1];
      } else {
        this.recordsQuery.startDate = undefined;
        this.recordsQuery.endDate = undefined;
      }
    },
    'createForm.scope'(val) {
      if (val === 'category' && this.categories.length === 0) {
        this.fetchCategories();
      }
    }
  },
  created() {
    this.getRecords();
  },
  methods: {
    // 盘点记录相关方法
    getRecords() {
      this.recordsLoading = true;
      getInventoryCheckRecords(this.recordsQuery).then(response => {
        this.records = response.data.items;
        this.recordsTotal = response.data.total;
        this.recordsLoading = false;
      }).catch(() => {
        this.recordsLoading = false;
      });
    },
    handleRecordsFilter() {
      this.recordsQuery.page = 1;
      this.getRecords();
    },
    getStatusName(status) {
      const statusMap = {
        draft: '草稿',
        completed: '已完成'
      };
      return statusMap[status] || status;
    },
    getStatusType(status) {
      const statusMap = {
        draft: 'warning',
        completed: 'success'
      };
      return statusMap[status] || '';
    },
    handleTabClick(tab) {
      if (tab.name === 'detail' && this.currentCheck) {
        this.getDetails();
      }
    },
    
    // 盘点详情相关方法
    handleViewDetail(row) {
      this.currentCheck = row;
      this.detailQuery.checkId = row.id;
      this.activeTab = 'detail';
      this.getDetails();
    },
    getDetails() {
      if (!this.currentCheck) return;
      
      this.detailLoading = true;
      getInventoryCheckDetails({
        ...this.detailQuery,
        checkId: this.currentCheck.id
      }).then(response => {
        this.details = response.data.items;
        this.detailTotal = response.data.total;
        this.detailLoading = false;
      }).catch(() => {
        this.detailLoading = false;
      });
    },
    handleDetailFilter() {
      this.detailQuery.page = 1;
      this.getDetails();
    },
    getDiffClass(row) {
      const diff = row.actualQuantity - row.systemQuantity;
      if (diff > 0) return 'text-success';
      if (diff < 0) return 'text-danger';
      return '';
    },
    handleQuantityChange(row) {
      if (this.currentCheck && this.currentCheck.status === 'draft') {
        updateInventoryCheckDetail({
          id: row.id,
          checkId: this.currentCheck.id,
          actualQuantity: row.actualQuantity,
          remark: row.remark
        }).then(() => {
          this.$message.success('更新成功');
        }).catch(() => {
          this.$message.error('更新失败');
        });
      }
    },
    handleRemarkChange(row) {
      if (this.currentCheck && this.currentCheck.status === 'draft') {
        updateInventoryCheckDetail({
          id: row.id,
          checkId: this.currentCheck.id,
          actualQuantity: row.actualQuantity,
          remark: row.remark
        }).then(() => {
          this.$message.success('更新成功');
        }).catch(() => {
          this.$message.error('更新失败');
        });
      }
    },
    
    // 新建盘点相关方法
    handleCreateCheck() {
      this.createDialogVisible = true;
      this.createForm = {
        scope: 'all',
        categoryId: undefined,
        keyword: undefined,
        remark: ''
      };
      this.$nextTick(() => {
        this.$refs.createForm && this.$refs.createForm.clearValidate();
      });
    },
    fetchCategories() {
      getCategories({ limit: 100 }).then(response => {
        this.categories = response.data.items;
      });
    },
    submitCreateCheck() {
      this.$refs.createForm.validate(valid => {
        if (valid) {
          createInventoryCheck(this.createForm).then(response => {
            this.createDialogVisible = false;
            this.$message.success('创建盘点成功');
            this.getRecords();
            
            // 自动跳转到详情页
            this.currentCheck = response.data;
            this.detailQuery.checkId = response.data.id;
            this.activeTab = 'detail';
            this.getDetails();
          }).catch(() => {
            this.$message.error('创建盘点失败');
          });
        }
      });
    },
    
    // 提交盘点相关方法
    handleSubmitCheck(row) {
      this.checkToSubmit = row;
      this.submitDialogVisible = true;
    },
    confirmSubmitCheck() {
      if (!this.checkToSubmit) return;
      
      submitInventoryCheck(this.checkToSubmit.id).then(() => {
        this.submitDialogVisible = false;
        this.$message.success('盘点提交成功');
        
        // 刷新数据
        this.getRecords();
        if (this.currentCheck && this.currentCheck.id === this.checkToSubmit.id) {
          // 更新当前查看的盘点状态
          this.currentCheck.status = 'completed';
          this.getDetails();
        }
      }).catch(() => {
        this.$message.error('盘点提交失败');
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

.check-detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid #ebeef5;
  
  .check-info {
    h3 {
      margin-top: 0;
      margin-bottom: 10px;
    }
    
    .check-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 10px;
      color: #606266;
    }
    
    .check-remark {
      color: #909399;
      font-size: 14px;
    }
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

.text-warning {
  color: #E6A23C;
}

.submit-confirm {
  padding: 20px 0;
  
  .warning {
    color: #F56C6C;
    font-weight: bold;
  }
}
</style>