<template>
  <div class="app-container">
    <el-form ref="productForm" :model="form" :rules="rules" label-width="120px">
      <el-form-item label="商品名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入商品名称" />
      </el-form-item>
      <el-form-item label="商品编码" prop="code">
        <el-input v-model="form.code" placeholder="请输入商品编码" />
      </el-form-item>
      <el-form-item label="商品分类" prop="categoryId">
        <el-select v-model="form.categoryId" placeholder="请选择商品分类">
          <el-option
            v-for="item in categoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="商品价格" prop="price">
        <el-input-number v-model="form.price" :precision="2" :step="0.1" :min="0" />
      </el-form-item>
      <el-form-item label="商品库存" prop="stock">
        <el-input-number v-model="form.stock" :min="0" :step="1" />
      </el-form-item>
      <el-form-item label="商品图片" prop="image">
        <el-upload
          class="avatar-uploader"
          action="/api/upload"
          :show-file-list="false"
          :on-success="handleImageSuccess"
          :before-upload="beforeImageUpload"
        >
          <img v-if="form.image" :src="form.image" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item label="是否新品" prop="isNew">
        <el-switch v-model="form.isNew" />
      </el-form-item>
      <el-form-item label="商品状态" prop="status">
        <el-radio-group v-model="form.status">
          <el-radio :label="1">上架</el-radio>
          <el-radio :label="0">下架</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="商品描述" prop="description">
        <el-input
          v-model="form.description"
          type="textarea"
          :rows="4"
          placeholder="请输入商品描述"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getProduct, createProduct, updateProduct, getCategories } from '@/api/product';

export default {
  name: 'ProductForm',
  data() {
    return {
      isEdit: false,
      productId: undefined,
      form: {
        name: '',
        code: '',
        categoryId: undefined,
        price: 0,
        stock: 0,
        image: '',
        isNew: false,
        status: 1,
        description: ''
      },
      rules: {
        name: [{ required: true, message: '请输入商品名称', trigger: 'blur' }],
        code: [{ required: true, message: '请输入商品编码', trigger: 'blur' }],
        categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
        price: [{ required: true, message: '请输入商品价格', trigger: 'blur' }],
        stock: [{ required: true, message: '请输入商品库存', trigger: 'blur' }],
        image: [{ required: true, message: '请上传商品图片', trigger: 'change' }]
      },
      categoryOptions: [],
      loading: false
    };
  },
  created() {
    this.productId = this.$route.params.id;
    this.isEdit = this.$route.path.includes('edit');
    this.getCategoryOptions();
    if (this.isEdit) {
      this.getProductDetail();
    }
  },
  methods: {
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
    getProductDetail() {
      this.loading = true;
      getProduct(this.productId).then(response => {
        this.form = response.data;
        this.loading = false;
      }).catch(() => {
        this.loading = false;
      });
    },
    handleImageSuccess(res) {
      this.form.image = res.data.url;
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
    },
    submitForm() {
      this.$refs.productForm.validate(valid => {
        if (valid) {
          this.loading = true;
          const request = this.isEdit
            ? updateProduct(this.productId, this.form)
            : createProduct(this.form);

          request.then(() => {
            this.$message({
              message: `${this.isEdit ? '更新' : '创建'}商品成功！`,
              type: 'success'
            });
            this.loading = false;
            this.$router.push('/product/list');
          }).catch(() => {
            this.loading = false;
          });
        } else {
          return false;
        }
      });
    },
    cancel() {
      this.$router.push('/product/list');
    }
  }
};
</script>

<style>
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>