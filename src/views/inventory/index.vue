<template>
  <div class="inventory-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="请输入商品名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      <el-select v-model="listQuery.categoryId" placeholder="商品分类" clearable class="filter-item" style="width: 160px">
        <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-select v-model="listQuery.stockStatus" placeholder="库存状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in stockStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="success" icon="el-icon-plus" @click="handleBatchAdd">批量入库</el-button>
      <el-button class="filter-item" type="warning" icon="el-icon-download" @click="handleExport">导出库存</el-button>
    </div>

    <el-table
      v-loading="listLoading"
      :data="list"
      element-loading-text="加载中..."
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column align="center" label="ID" width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="120" align="center" label="商品图片">
        <template slot-scope="scope">
          <el-image 
            style="width: 60px; height: 60px" 
            :src="scope.row.image" 
            fit="cover"
            :preview-src-list="[scope.row.image]"
          ></el-image>
        </template>
      </el-table-column>
      
      <el-table-column min-width="200" label="商品名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="120" align="center" label="分类">
        <template slot-scope="scope">
          <span>{{ scope.row.categoryName }}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="100" align="center" label="库存">
        <template slot-scope="scope">
          <span :class="{ 'stock-warning': scope.row.stock <= scope.row.stockThreshold }">
            {{ scope.row.stock }}
          </span>
        </template>
      </el-table-column>
      
      <el-table-column width="100" align="center" label="预警值">
        <template slot-scope="scope">
          <span>{{ scope.row.stockThreshold }}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="100" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag :type="getStockStatusType(scope.row.stock, scope.row.stockThreshold)">
            {{ getStockStatusText(scope.row.stock, scope.row.stockThreshold) }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column width="180" align="center" label="最后更新时间">
        <template slot-scope="scope">
          <span>{{ scope.row.updateTime }}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="220" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">修改库存</el-button>
          <el-button type="info" size="mini" @click="handleHistory(scope.row)">库存记录</el-button>
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

    <!-- 修改库存对话框 -->
    <el-dialog title="修改库存" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 90%; margin-left: 50px;"
      >
        <el-form-item label="商品名称">
          <span>{{ temp.name }}</span>
        </el-form-item>
        
        <el-form-item label="当前库存">
          <span>{{ temp.stock }}</span>
        </el-form-item>
        
        <el-form-item label="操作类型" prop="operationType">
          <el-radio-group v-model="temp.operationType">
            <el-radio :label="'in'">入库</el-radio>
            <el-radio :label="'out'">出库</el-radio>
          </el-radio-group>
        </el-form-item>
        
        <el-form-item label="变更数量" prop="changeQuantity">
          <el-input-number v-model="temp.changeQuantity" :min="1" />
        </el-form-item>
        
        <el-form-item label="备注" prop="remark">
          <el-input v-model="temp.remark" type="textarea" :rows="3" placeholder="请输入备注信息" />
        </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="updateStock">确认</el-button>
      </div>
    </el-dialog>

    <!-- 批量入库对话框 -->
    <el-dialog title="批量入库" :visible.sync="batchDialogVisible">
      <el-form
        ref="batchForm"
        :rules="batchRules"
        :model="batchTemp"
        label-position="left"
        label-width="100px"
        style="width: 90%; margin-left: 50px;"
      >
        <el-form-item label="上传文件" prop="file">
          <el-upload
            class="upload-demo"
            action="/api/inventory/import"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :limit="1"
            :file-list="fileList"
          >
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传xlsx/xls文件，且不超过10MB</div>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="备注" prop="batchRemark">
          <el-input v-model="batchTemp.batchRemark" type="textarea" :rows="3" placeholder="请输入批量入库备注信息" />
        </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="batchDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmBatchImport">确认导入</el-button>
      </div>
    </el-dialog>

    <!-- 库存记录对话框 -->
    <el-dialog title="库存变更记录" :visible.sync="historyDialogVisible" width="70%">
      <el-table
        v-loading="historyLoading"
        :data="historyList"
        element-loading-text="加载中..."
        border
        fit
        style="width: 100%;"
      >
        <el-table-column align="center" label="ID" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        
        <el-table-column width="120" align="center" label="商品名称">
          <template slot-scope="scope">
            <span>{{ scope.row.productName }}</span>
          </template>
        </el-table-column>
        
        <el-table-column width="100" align="center" label="操作类型">
          <template slot-scope="scope">
            <el-tag :type="scope.row.operationType === 'in' ? 'success' : 'danger'">
              {{ scope.row.operationType === 'in' ? '入库' : '出库' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column width="100" align="center" label="变更数量">
          <template slot-scope="scope">
            <span>{{ scope.row.quantity }}</span>
          </template>
        </el-table-column>
        
        <el-table-column width="100" align="center" label="变更前库存">
          <template slot-scope="scope">
            <span>{{ scope.row.beforeStock }}</span>
          </template>
        </el-table-column>
        
        <el-table-column width="100" align="center" label="变更后库存">
          <template slot-scope="scope">
            <span>{{ scope.row.afterStock }}</span>
          </template>
        </el-table-column>
        
        <el-table-column min-width="150" label="备注">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        
        <el-table-column width="120" align="center" label="操作人">
          <template slot-scope="scope">
            <span>{{ scope.row.operatorName }}</span>
          </template>
        </el-table-column>
        
        <el-table-column width="180" align="center" label="操作时间">
          <template slot-scope="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
      </el-table>
      
      <pagination
        v-show="historyTotal > 0"
        :total="historyTotal"
        :page.sync="historyQuery.page"
        :limit.sync="historyQuery.limit"
        @pagination="getHistoryList"
      />
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Pagination from '@/components/Pagination';

export default {
  name: 'InventoryList',
  components: { Pagination },
  data() {
    return {
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: '',
        categoryId: undefined,
        stockStatus: undefined
      },
      categoryOptions: [],
      stockStatusOptions: [
        { label: '库存充足', value: 'normal' },
        { label: '库存预警', value: 'warning' },
        { label: '库存不足', value: 'danger' }
      ],
      temp: {
        id: undefined,
        name: '',
        stock: 0,
        operationType: 'in',
        changeQuantity: 1,
        remark: ''
      },
      dialogFormVisible: false,
      rules: {
        operationType: [{ required: true, message: '请选择操作类型', trigger: 'change' }],
        changeQuantity: [{ required: true, message: '请输入变更数量', trigger: 'blur' }]
      },
      batchDialogVisible: false,
      batchTemp: {
        file: null,
        batchRemark: ''
      },
      fileList: [],
      batchRules: {
        file: [{ required: true, message: '请上传文件', trigger: 'change' }]
      },
      historyDialogVisible: false,
      historyLoading: false,
      historyList: [],
      historyTotal: 0,
      historyQuery: {
        page: 1,
        limit: 10,
        productId: undefined
      },
      currentProductId: null
    };
  },
  created() {
    this.getList();
    this.getCategories();
  },
  methods: {
    ...mapActions('inventory', [
      'fetchInventoryList',
      'updateInventoryQuantity',
      'fetchInventoryHistory',
      'importInventory',
      'exportInventory'
    ]),
    ...mapActions('product', ['fetchCategories']),
    async getList() {
      this.listLoading = true;
      try {
        const { data, total } = await this.fetchInventoryList(this.listQuery);
        this.list = data;
        this.total = total;
      } catch (error) {
        this.$message.error('获取库存列表失败');
      } finally {
        this.listLoading = false;
      }
    },
    async getCategories() {
      try {
        const categories = await this.fetchCategories();
        this.categoryOptions = categories.map(item => ({
          label: item.name,
          value: item.id
        }));
      } catch (error) {
        this.$message.error('获取商品分类失败');
      }
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    getStockStatusType(stock, threshold) {
      if (stock <= 0) {
        return 'danger';
      } else if (stock <= threshold) {
        return 'warning';
      } else {
        return 'success';
      }
    },
    getStockStatusText(stock, threshold) {
      if (stock <= 0) {
        return '库存不足';
      } else if (stock <= threshold) {
        return '库存预警';
      } else {
        return '库存充足';
      }
    },
    handleUpdate(row) {
      this.temp = {
        id: row.id,
        name: row.name,
        stock: row.stock,
        operationType: 'in',
        changeQuantity: 1,
        remark: ''
      };
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    async updateStock() {
      this.$refs['dataForm'].validate(async valid => {
        if (valid) {
          const params = {
            productId: this.temp.id,
            quantity: this.temp.changeQuantity,
            operationType: this.temp.operationType,
            remark: this.temp.remark
          };
          
          try {
            await this.updateInventoryQuantity(params);
            this.dialogFormVisible = false;
            this.$message.success('库存更新成功');
            this.getList();
          } catch (error) {
            this.$message.error('库存更新失败');
          }
        }
      });
    },
    async handleHistory(row) {
      this.historyDialogVisible = true;
      this.currentProductId = row.id;
      this.historyQuery.productId = row.id;
      this.historyQuery.page = 1;
      await this.getHistoryList();
    },
    async getHistoryList() {
      this.historyLoading = true;
      try {
        const { data, total } = await this.fetchInventoryHistory(this.historyQuery);
        this.historyList = data;
        this.historyTotal = total;
      } catch (error) {
        this.$message.error('获取库存记录失败');
      } finally {
        this.historyLoading = false;
      }
    },
    handleBatchAdd() {
      this.batchDialogVisible = true;
      this.batchTemp = {
        file: null,
        batchRemark: ''
      };
      this.fileList = [];
      this.$nextTick(() => {
        if (this.$refs['batchForm']) {
          this.$refs['batchForm'].clearValidate();
        }
      });
    },
    handleRemove(file, fileList) {
      this.fileList = fileList;
    },
    handlePreview(file) {
      console.log(file);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    handleUploadSuccess(response, file, fileList) {
      if (response.code === 200) {
        this.batchTemp.file = response.data;
        this.$message.success('文件上传成功');
      } else {
        this.$message.error(response.message || '文件上传失败');
      }
    },
    handleUploadError() {
      this.$message.error('文件上传失败');
    },
    async confirmBatchImport() {
      this.$refs['batchForm'].validate(async valid => {
        if (valid) {
          try {
            await this.importInventory({
              fileUrl: this.batchTemp.file,
              remark: this.batchTemp.batchRemark
            });
            this.batchDialogVisible = false;
            this.$message.success('批量入库成功');
            this.getList();
          } catch (error) {
            this.$message.error('批量入库失败');
          }
        }
      });
    },
    async handleExport() {
      try {
        await this.exportInventory(this.listQuery);
        this.$message.success('导出成功，请在下载中心查看');
      } catch (error) {
        this.$message.error('导出失败');
      }
    }
  }
};
</script>

<style scoped>
.inventory-container {
  padding: 20px;
}

.filter-container {
  padding-bottom: 10px;
}

.filter-item {
  margin-right: 10px;
  margin-bottom: 10px;
}

.stock-warning {
  color: #E6A23C;
  font-weight: bold;
}
</style>