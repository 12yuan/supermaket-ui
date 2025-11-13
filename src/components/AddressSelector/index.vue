<template>
  <div class="address-selector">
    <el-popover
      placement="bottom"
      width="500"
      trigger="click"
      v-model:visible="popoverVisible"
    >
      <div class="address-list-container">
        <div class="address-list-header">
          <span class="title">选择收货地址</span>
          <el-button type="text" icon="el-icon-plus" @click="handleAddAddress">新增地址</el-button>
        </div>
        
        <div class="address-list">
          <div 
            v-for="(address, index) in addressList" 
            :key="address.id"
            class="address-item"
            :class="{'address-item-active': selectedAddressId === address.id}"
            @click="selectAddress(address)"
          >
            <div class="address-item-header">
              <span class="name">{{ address.name }}</span>
              <span class="phone">{{ address.phone }}</span>
              <el-tag v-if="address.isDefault" size="mini" type="success">默认</el-tag>
            </div>
            <div class="address-item-content">
              {{ address.province + address.city + address.district + address.address }}
            </div>
            <div class="address-item-footer">
              <el-button type="text" size="mini" @click.stop="handleEditAddress(address)">编辑</el-button>
              <el-button type="text" size="mini" @click.stop="handleDeleteAddress(address)">删除</el-button>
            </div>
          </div>
          
          <div v-if="addressList.length === 0" class="empty-tip">
            <i class="el-icon-location-information"></i>
            <p>暂无收货地址，请添加</p>
          </div>
        </div>
      </div>
      
      <div slot="reference" class="address-selector-reference">
        <div v-if="selectedAddress" class="selected-address">
          <div class="selected-address-content">
            <div class="selected-address-name">
              <span>{{ selectedAddress.name }}</span>
              <span class="selected-address-phone">{{ selectedAddress.phone }}</span>
            </div>
            <div class="selected-address-detail">
              {{ selectedAddress.province + selectedAddress.city + selectedAddress.district + selectedAddress.address }}
            </div>
          </div>
          <i class="el-icon-arrow-down"></i>
        </div>
        <div v-else class="no-address">
          <i class="el-icon-location-outline"></i>
          <span>请选择收货地址</span>
          <i class="el-icon-arrow-down"></i>
        </div>
      </div>
    </el-popover>
    
    <!-- 添加/编辑地址对话框 -->
    <el-dialog :title="dialogTitle" v-model="dialogVisible" width="50%">
      <el-form
        ref="addressForm"
        :model="addressForm"
        :rules="addressRules"
        label-width="100px"
      >
        <el-form-item label="收货人" prop="name">
          <el-input v-model="addressForm.name" placeholder="请输入收货人姓名" />
        </el-form-item>
        
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="addressForm.phone" placeholder="请输入联系电话" />
        </el-form-item>
        
        <el-form-item label="所在地区" required>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item prop="province">
                <el-select v-model="addressForm.province" placeholder="请选择省份" @change="handleProvinceChange">
                  <el-option v-for="item in provinceOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="city">
                <el-select v-model="addressForm.city" placeholder="请选择城市" @change="handleCityChange">
                  <el-option v-for="item in cityOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="district">
                <el-select v-model="addressForm.district" placeholder="请选择区/县">
                  <el-option v-for="item in districtOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="addressForm.address" type="textarea" :rows="3" placeholder="请输入详细地址，如街道、门牌号等" />
        </el-form-item>
        
        <el-form-item label="邮政编码" prop="zipCode">
          <el-input v-model="addressForm.zipCode" placeholder="请输入邮政编码" />
        </el-form-item>
        
        <el-form-item label="设为默认">
          <el-switch v-model="addressForm.isDefault"></el-switch>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitAddressForm">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
// 模拟省市区数据，实际项目中应该从后端获取或使用专门的地址库
const addressData = {
  provinces: ['北京市', '上海市', '广东省', '江苏省', '浙江省', '四川省', '湖北省'],
  cities: {
    '北京市': ['北京市'],
    '上海市': ['上海市'],
    '广东省': ['广州市', '深圳市', '佛山市', '东莞市', '珠海市'],
    '江苏省': ['南京市', '苏州市', '无锡市', '常州市', '南通市'],
    '浙江省': ['杭州市', '宁波市', '温州市', '嘉兴市', '绍兴市'],
    '四川省': ['成都市', '绵阳市', '德阳市', '自贡市', '泸州市'],
    '湖北省': ['武汉市', '宜昌市', '襄阳市', '荆州市', '黄石市']
  },
  districts: {
    '北京市': {
      '北京市': ['东城区', '西城区', '朝阳区', '海淀区', '丰台区', '石景山区']
    },
    '上海市': {
      '上海市': ['黄浦区', '徐汇区', '长宁区', '静安区', '普陀区', '虹口区']
    },
    '广东省': {
      '广州市': ['越秀区', '荔湾区', '海珠区', '天河区', '白云区', '黄埔区'],
      '深圳市': ['福田区', '罗湖区', '南山区', '宝安区', '龙岗区', '龙华区'],
      '佛山市': ['禅城区', '南海区', '顺德区', '高明区', '三水区'],
      '东莞市': ['莞城街道', '东城街道', '南城街道', '万江街道', '石碣镇'],
      '珠海市': ['香洲区', '斗门区', '金湾区']
    }
  }
};

export default {
  name: 'AddressSelector',
  props: {
    value: {
      type: Object,
      default: null
    }
  },
  data() {
    const validatePhone = (rule, value, callback) => {
      const reg = /^1[3-9]\d{9}$/;
      if (!reg.test(value)) {
        callback(new Error('请输入正确的手机号码'));
      } else {
        callback();
      }
    };
    
    return {
      popoverVisible: false,
      addressList: [],
      selectedAddressId: null,
      selectedAddress: null,
      
      dialogVisible: false,
      dialogTitle: '新增收货地址',
      isEdit: false,
      
      addressForm: {
        id: undefined,
        name: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        address: '',
        zipCode: '',
        isDefault: false
      },
      
      provinceOptions: addressData.provinces,
      cityOptions: [],
      districtOptions: [],
      
      addressRules: {
        name: [{ required: true, message: '收货人不能为空', trigger: 'blur' }],
        phone: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        province: [{ required: true, message: '请选择省份', trigger: 'change' }],
        city: [{ required: true, message: '请选择城市', trigger: 'change' }],
        district: [{ required: true, message: '请选择区/县', trigger: 'change' }],
        address: [{ required: true, message: '详细地址不能为空', trigger: 'blur' }],
        zipCode: [{ pattern: /^\d{6}$/, message: '邮政编码格式不正确', trigger: 'blur' }]
      }
    };
  },
  watch: {
    value: {
      immediate: true,
      handler(val) {
        if (val) {
          this.selectedAddress = val;
          this.selectedAddressId = val.id;
        }
      }
    }
  },
  created() {
    this.fetchAddressList();
  },
  methods: {
    // 获取地址列表
    fetchAddressList() {
      // 模拟API调用，实际项目中应该从Vuex或API获取
      setTimeout(() => {
        this.addressList = [
          {
            id: 1,
            name: '张三',
            phone: '13800138000',
            province: '广东省',
            city: '深圳市',
            district: '南山区',
            address: '科技园路123号',
            zipCode: '518000',
            isDefault: true
          },
          {
            id: 2,
            name: '李四',
            phone: '13900139000',
            province: '北京市',
            city: '北京市',
            district: '海淀区',
            address: '中关村大街456号',
            zipCode: '100080',
            isDefault: false
          }
        ];
        
        // 如果没有选中地址，默认选中默认地址
        if (!this.selectedAddressId) {
          const defaultAddress = this.addressList.find(item => item.isDefault);
          if (defaultAddress) {
            this.selectAddress(defaultAddress);
          }
        }
      }, 300);
    },
    
    // 选择地址
    selectAddress(address) {
      this.selectedAddress = address;
      this.selectedAddressId = address.id;
      this.$emit('input', address);
      this.$emit('change', address);
      this.popoverVisible = false;
    },
    
    // 添加地址
    handleAddAddress() {
      this.isEdit = false;
      this.dialogTitle = '新增收货地址';
      this.resetAddressForm();
      this.dialogVisible = true;
    },
    
    // 编辑地址
    handleEditAddress(address) {
      this.isEdit = true;
      this.dialogTitle = '编辑收货地址';
      this.addressForm = JSON.parse(JSON.stringify(address));
      
      // 设置城市和区县选项
      this.handleProvinceChange(this.addressForm.province);
      this.handleCityChange(this.addressForm.city);
      
      this.dialogVisible = true;
    },
    
    // 删除地址
    handleDeleteAddress(address) {
      this.$confirm('确认删除该地址吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 模拟API调用
        const index = this.addressList.findIndex(item => item.id === address.id);
        this.addressList.splice(index, 1);
        
        // 如果删除的是当前选中的地址，则清空选中
        if (this.selectedAddressId === address.id) {
          this.selectedAddress = null;
          this.selectedAddressId = null;
          this.$emit('input', null);
          this.$emit('change', null);
        }
        
        this.$message.success('删除成功');
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    
    // 重置表单
    resetAddressForm() {
      this.addressForm = {
        id: undefined,
        name: '',
        phone: '',
        province: '',
        city: '',
        district: '',
        address: '',
        zipCode: '',
        isDefault: false
      };
      this.cityOptions = [];
      this.districtOptions = [];
      
      if (this.$refs.addressForm) {
        this.$refs.addressForm.clearValidate();
      }
    },
    
    // 省份变化
    handleProvinceChange(province) {
      this.addressForm.city = '';
      this.addressForm.district = '';
      this.districtOptions = [];
      if (province) {
        this.cityOptions = addressData.cities[province] || [];
      } else {
        this.cityOptions = [];
      }
    },
    
    // 城市变化
    handleCityChange(city) {
      this.addressForm.district = '';
      if (this.addressForm.province && city) {
        this.districtOptions = addressData.districts[this.addressForm.province][city] || [];
      } else {
        this.districtOptions = [];
      }
    },
    
    // 提交表单
    submitAddressForm() {
      this.$refs.addressForm.validate(valid => {
        if (valid) {
          if (this.isEdit) {
            // 编辑地址
            const index = this.addressList.findIndex(item => item.id === this.addressForm.id);
            
            // 如果设置为默认地址，需要将其他地址设为非默认
            if (this.addressForm.isDefault) {
              this.addressList.forEach(item => {
                if (item.id !== this.addressForm.id) {
                  item.isDefault = false;
                }
              });
            }
            
            this.addressList.splice(index, 1, JSON.parse(JSON.stringify(this.addressForm)));
            
            // 如果编辑的是当前选中的地址，更新选中的地址
            if (this.selectedAddressId === this.addressForm.id) {
              this.selectedAddress = JSON.parse(JSON.stringify(this.addressForm));
              this.$emit('input', this.selectedAddress);
              this.$emit('change', this.selectedAddress);
            }
            
            this.$message.success('更新成功');
          } else {
            // 新增地址
            const newAddress = JSON.parse(JSON.stringify(this.addressForm));
            newAddress.id = Date.now(); // 模拟ID生成
            
            // 如果设置为默认地址，需要将其他地址设为非默认
            if (newAddress.isDefault) {
              this.addressList.forEach(item => {
                item.isDefault = false;
              });
            }
            
            this.addressList.push(newAddress);
            
            // 如果是第一个地址或设置为默认地址，则自动选中
            if (this.addressList.length === 1 || newAddress.isDefault) {
              this.selectAddress(newAddress);
            }
            
            this.$message.success('添加成功');
          }
          
          this.dialogVisible = false;
        }
      });
    }
  }
};
</script>

<style scoped>
.address-selector {
  display: inline-block;
  width: 100%;
}

.address-selector-reference {
  cursor: pointer;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 8px 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 40px;
}

.selected-address {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.selected-address-content {
  flex: 1;
  overflow: hidden;
}

.selected-address-name {
  font-weight: bold;
  margin-bottom: 4px;
}

.selected-address-phone {
  margin-left: 10px;
  color: #606266;
}

.selected-address-detail {
  color: #606266;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.no-address {
  color: #909399;
  display: flex;
  align-items: center;
  width: 100%;
}

.no-address i:first-child {
  margin-right: 5px;
}

.no-address i:last-child {
  margin-left: auto;
}

.address-list-container {
  padding: 10px 0;
}

.address-list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 15px 10px;
  border-bottom: 1px solid #ebeef5;
}

.address-list-header .title {
  font-size: 16px;
  font-weight: bold;
}

.address-list {
  max-height: 300px;
  overflow-y: auto;
  padding: 10px 0;
}

.address-item {
  padding: 10px 15px;
  border-bottom: 1px solid #ebeef5;
  cursor: pointer;
  transition: background-color 0.3s;
}

.address-item:hover {
  background-color: #f5f7fa;
}

.address-item-active {
  background-color: #ecf5ff;
}

.address-item-header {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.address-item-header .name {
  font-weight: bold;
  margin-right: 10px;
}

.address-item-header .phone {
  color: #606266;
  margin-right: 10px;
}

.address-item-content {
  color: #606266;
  margin-bottom: 5px;
  line-height: 1.4;
}

.address-item-footer {
  display: flex;
  justify-content: flex-end;
}

.empty-tip {
  text-align: center;
  padding: 30px 0;
  color: #909399;
}

.empty-tip i {
  font-size: 40px;
  margin-bottom: 10px;
}
</style>
