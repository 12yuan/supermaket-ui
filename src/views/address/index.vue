<template>
  <div class="address-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.keyword"
        placeholder="请输入收货人/地址"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter="handleFilter"
      />
      <el-select v-model="listQuery.province" placeholder="省份" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in provinceOptions" :key="item" :label="item" :value="item" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-plus" @click="handleCreate">添加地址</el-button>
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
        <template #default="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="120" label="收货人">
        <template #default="{ row }">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="150" label="联系电话">
        <template #default="{ row }">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      
      <el-table-column min-width="300" label="详细地址">
        <template #default="{ row }">
          <span>{{ row.province + row.city + row.district + row.address }}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="100" align="center" label="默认地址">
        <template #default="{ row }">
          <el-tag :type="row.isDefault ? 'success' : 'info'">
            {{ row.isDefault ? '是' : '否' }}
          </el-tag>
        </template>
      </el-table-column>
      
      <el-table-column width="180" align="center" label="创建时间">
        <template #default="{ row }">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      
      <el-table-column width="200" align="center" label="操作">
        <template #default="{ row }">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">编辑</el-button>
          <el-button 
            v-if="!row.isDefault" 
            size="mini" 
            type="success" 
            @click="handleSetDefault(row)"
          >设为默认</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(row)">删除</el-button>
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

    <!-- 添加或修改地址对话框 -->
    <el-dialog :title="textMap[dialogStatus]" v-model="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 90%; margin-left: 50px;"
      >
        <el-form-item label="收货人" prop="name">
          <el-input v-model="temp.name" placeholder="请输入收货人姓名" />
        </el-form-item>
        
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="temp.phone" placeholder="请输入联系电话" />
        </el-form-item>
        
        <el-form-item label="所在地区" required>
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item prop="province">
                <el-select v-model="temp.province" placeholder="请选择省份" @change="handleProvinceChange">
                  <el-option v-for="item in provinceOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="city">
                <el-select v-model="temp.city" placeholder="请选择城市" @change="handleCityChange">
                  <el-option v-for="item in cityOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item prop="district">
                <el-select v-model="temp.district" placeholder="请选择区/县">
                  <el-option v-for="item in districtOptions" :key="item" :label="item" :value="item" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="temp.address" type="textarea" :rows="3" placeholder="请输入详细地址，如街道、门牌号等" />
        </el-form-item>
        
        <el-form-item label="邮政编码" prop="zipCode">
          <el-input v-model="temp.zipCode" placeholder="请输入邮政编码" />
        </el-form-item>
        
        <el-form-item label="设为默认">
          <el-switch v-model="temp.isDefault"></el-switch>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogStatus === 'create' ? createData() : updateData()">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import Pagination from '@/components/Pagination';

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
    },
    '江苏省': {
      '南京市': ['玄武区', '秦淮区', '建邺区', '鼓楼区', '浦口区', '栖霞区'],
      '苏州市': ['姑苏区', '虎丘区', '吴中区', '相城区', '吴江区'],
      '无锡市': ['梁溪区', '新吴区', '锡山区', '惠山区', '滨湖区'],
      '常州市': ['天宁区', '钟楼区', '新北区', '武进区', '金坛区'],
      '南通市': ['崇川区', '港闸区', '通州区', '如皋市', '海门市']
    },
    '浙江省': {
      '杭州市': ['上城区', '下城区', '江干区', '拱墅区', '西湖区', '滨江区'],
      '宁波市': ['海曙区', '江北区', '北仑区', '镇海区', '鄞州区', '奉化区'],
      '温州市': ['鹿城区', '龙湾区', '瓯海区', '洞头区', '永嘉县'],
      '嘉兴市': ['南湖区', '秀洲区', '嘉善县', '海盐县', '海宁市'],
      '绍兴市': ['越城区', '柯桥区', '上虞区', '诸暨市', '嵊州市']
    },
    '四川省': {
      '成都市': ['锦江区', '青羊区', '金牛区', '武侯区', '成华区', '龙泉驿区'],
      '绵阳市': ['涪城区', '游仙区', '安州区', '三台县', '盐亭县'],
      '德阳市': ['旌阳区', '罗江区', '中江县', '广汉市', '什邡市'],
      '自贡市': ['自流井区', '贡井区', '大安区', '沿滩区', '荣县'],
      '泸州市': ['江阳区', '纳溪区', '龙马潭区', '泸县', '合江县']
    },
    '湖北省': {
      '武汉市': ['江岸区', '江汉区', '硚口区', '汉阳区', '武昌区', '青山区'],
      '宜昌市': ['西陵区', '伍家岗区', '点军区', '猇亭区', '夷陵区'],
      '襄阳市': ['襄城区', '樊城区', '襄州区', '南漳县', '谷城县'],
      '荆州市': ['沙市区', '荆州区', '公安县', '监利县', '江陵县'],
      '黄石市': ['黄石港区', '西塞山区', '下陆区', '铁山区', '阳新县']
    }
  }
};

export default {
  name: 'AddressList',
  components: { Pagination },
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
      list: [],
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        keyword: '',
        province: undefined
      },
      provinceOptions: addressData.provinces,
      cityOptions: [],
      districtOptions: [],
      temp: {
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
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: '编辑地址',
        create: '添加地址'
      },
      rules: {
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
  created() {
    this.getList();
  },
  methods: {
    // 实际项目中应该从Vuex中获取地址相关的actions
    // 这里模拟实现
    async getList() {
      this.listLoading = true;
      try {
        // 模拟API调用
        setTimeout(() => {
          this.list = [
            {
              id: 1,
              name: '张三',
              phone: '13800138000',
              province: '广东省',
              city: '深圳市',
              district: '南山区',
              address: '科技园路123号',
              zipCode: '518000',
              isDefault: true,
              createTime: '2023-06-01 10:30:45'
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
              isDefault: false,
              createTime: '2023-06-02 15:20:30'
            },
            {
              id: 3,
              name: '王五',
              phone: '13700137000',
              province: '上海市',
              city: '上海市',
              district: '浦东新区',
              address: '张江高科技园区789号',
              zipCode: '201203',
              isDefault: false,
              createTime: '2023-06-03 09:15:20'
            }
          ];
          this.total = 3;
          this.listLoading = false;
        }, 500);
      } catch (error) {
        this.$message.error('获取地址列表失败');
        this.listLoading = false;
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
      
      // 设置城市和区县选项
      this.handleProvinceChange(this.temp.province);
      this.handleCityChange(this.temp.city);
      
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate();
      });
    },
    handleProvinceChange(province) {
      this.temp.city = '';
      this.temp.district = '';
      this.districtOptions = [];
      if (province) {
        this.cityOptions = addressData.cities[province] || [];
      } else {
        this.cityOptions = [];
      }
    },
    handleCityChange(city) {
      this.temp.district = '';
      if (this.temp.province && city) {
        this.districtOptions = addressData.districts[this.temp.province][city] || [];
      } else {
        this.districtOptions = [];
      }
    },
    createData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // 模拟API调用
          this.temp.id = this.list.length + 1;
          this.temp.createTime = new Date().toLocaleString();
          
          // 如果设置为默认地址，需要将其他地址设为非默认
          if (this.temp.isDefault) {
            this.list.forEach(item => {
              item.isDefault = false;
            });
          }
          
          this.list.push(this.temp);
          this.total += 1;
          
          this.dialogFormVisible = false;
          this.$message.success('创建成功');
        }
      });
    },
    updateData() {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          // 模拟API调用
          const index = this.list.findIndex(item => item.id === this.temp.id);
          
          // 如果设置为默认地址，需要将其他地址设为非默认
          if (this.temp.isDefault) {
            this.list.forEach(item => {
              item.isDefault = false;
            });
          }
          
          this.list.splice(index, 1, this.temp);
          
          this.dialogFormVisible = false;
          this.$message.success('更新成功');
        }
      });
    },
    handleDelete(row) {
      this.$confirm('确认删除该地址吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 模拟API调用
        const index = this.list.findIndex(item => item.id === row.id);
        this.list.splice(index, 1);
        this.total -= 1;
        
        this.$message.success('删除成功');
      }).catch(() => {
        this.$message.info('已取消删除');
      });
    },
    handleSetDefault(row) {
      // 模拟API调用
      this.list.forEach(item => {
        item.isDefault = item.id === row.id;
      });
      
      this.$message.success('已设为默认地址');
    }
  }
};
</script>

<style scoped>
.address-container {
  padding: 20px;
}

.filter-container {
  padding-bottom: 10px;
}

.filter-item {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
