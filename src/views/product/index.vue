<template>
  <div class="product-container">
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
      <el-select v-model="listQuery.status" placeholder="商品状态" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">添加商品</el-button>
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
      
      <el-table-column width="120" align="center" label="价格">
        <template slot-scope="scope">
          <span>¥{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="100" align="center" label="库存">
        <template slot-scope="scope">
          <span>{{ scope.row.stock }}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="100" align="center" label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status === 1 ? 'success' : 'info'">
            {{ scope.row.status === 1 ? '上架' : '下架' }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column width="180" align="center" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createTime }}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="200" align="center" label="操作">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">编辑</el-button>
          <el-button 
            v-if="scope.row.status === 0" 
            size="mini" 
            type="success" 
            @click="handleModifyStatus(scope.row, 1)"
          >上架</el-button>
          <el-button 
            v-else 
            size="mini" 
            type="info" 
            @click="handleModifyStatus(scope.row, 0)"
          >下架</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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

    <!-- 添加或修改商品对话框 -->
    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 90%; margin-left: 50px;"
      >
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="temp.name" placeholder="请输入商品名称" />
        </el-form-item>
        
        <el-form-item label="商品分类" prop="categoryId">
          <el-select v-model="temp.categoryId" placeholder="请选择商品分类">
            <el-option v-for="item in categoryOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="商品价格" prop="price">
          <el-input-number v-model="temp.price" :precision="2" :step="0.1" :min="0" />
        </el-form-item>
        
        <el-form-item label="商品库存" prop="stock">
          <el-input-number v-model="temp.stock" :min="0" />
        </el-form-item>
        
        <el-form-item label="商品图片" prop="image">
          <el-upload
            class="avatar-uploader"
            action="/api/upload"
            :show-file-list="false"
            :on-success="handleImageSuccess"
            :before-upload="beforeImageUpload"
          >
            <img v-if="temp.image" :src="temp.image" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="商品描述" prop="description">
          <el-input v-model="temp.description" type="textarea" :rows="4" placeholder="请输入商品描述" />
        </el-form-item>
        
        <el-form-item label="商品状态" prop="status">
          <el-radio-group v-model="temp.status">
            <el-radio :label="1">上架</el-radio>
            <el-radio :label="0">下架</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Pagination from '@/components/Pagination';

export default {
  name: 'ProductList',
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
        status: undefined
      },
      categoryOptions: [],
      statusOptions: [
        { label: '上架', value: 1 },
        { label: '下架', value: 0 }
      ],
      temp: {
        id: undefined,
        name: '',
        categoryId: '',
        price: 0,
        stock: 0,
        image: '',
        description: '',
        status: 1
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑商品',
        create: '添加商品'
      },
      rules: {
        name: [{ required: true, message: '商品名称不能为空', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
        price: [{ required: true, message: '商品价格不能为空', trigger: 'blur' }],
        stock: [{ required: true, message: '商品库存不能为空', trigger: 'blur' }],
        image: [{ required: true, message: '请上传商品图片', trigger: 'change' }]
      }
    };
  },
  created() {
    this.getList();
    this.getCategories();
  },
  methods: {
    ...mapActions('product', [
      'fetchProducts',
      'fetchCategories',
      'createProduct',
      'updateProduct',
      'deleteProduct',
      'updateProductStatus'
    ]),
    async getList() {
      this.listLoading = true;
      try {
        const { data, total } = await this.fetchProducts(this.listQuery);
        this.list = data;
        this.total = total;
      } catch (error) {
        this.$message.error('获取商品列表失败');
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
    resetTemp() {
      this.temp = {
        id: undefined,
        name: '',
        categoryId: '',
        price: 0,
        stock: 0,
        image: '',
        description: '',
        status: 1
      };
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = 'create';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row);
      this.dialogStatus = 'update';
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    async createData() {
      this.$refs['dataForm'].validate(async valid => {
        if (valid) {
          try {
            await this.createProduct(this.temp);
            this.dialogFormVisible = false;
            this.$message.success('创建成功');
            this.getList();
          } catch (error) {
            this.$message.error('创建失败');
          }
        }
      });
    },
    async updateData() {
      this.$refs['dataForm'].validate(async valid => {
        if (valid) {
          try {
            await this.updateProduct(this.temp);
            this.dialogFormVisible = false;
            this.$message.success('更新成功');
            this.getList();
          } catch (error) {
            this.$message.error('更新失败');
          }
        }
      });
    },
    async handleDelete(row) {
      this.$confirm('确认删除该商品吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        try {
          await this.deleteProduct(row.id);
          this.$message.success('删除成功');
          this.getList();
        } catch (error) {
          this.$message.error('删除失败');
        }
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    async handleModifyStatus(row, status) {
      try {
        await this.updateProductStatus({
          id: row.id,
          status
        });
        this.$message.success(`商品已${status === 1 ? '上架' : '下架'}`);
        this.getList();
      } catch (error) {
        this.$message.error(`${status === 1 ? '上架' : '下架'}失败`);
      }
    },
    handleImageSuccess(res, file) {
      if (res.code === 200) {
        this.temp.image = res.data;
      } else {
        this.$message.error('上传失败');
      }
    },
    beforeImageUpload(file) {
      const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    }
  }
};
</script>

<style scoped>
.product-container {
  padding: 20px;
}

.filter-container {
  padding-bottom: 10px;
}

.filter-item {
  margin-right: 10px;
  margin-bottom: 10px;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}

.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>