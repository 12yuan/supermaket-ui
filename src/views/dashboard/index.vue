<template>
  <div class="dashboard-container">
    <!-- 日期选择器 -->
    <el-card style="margin-bottom: 20px;">
      <div slot="header">
        <span>数据筛选</span>
      </div>
      <el-date-picker
        v-model="dateRange"
        type="daterange"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        :picker-options="pickerOptions"
        @change="handleDateRangeChange"
        style="width: 350px;"
      ></el-date-picker>
      <el-button type="primary" icon="el-icon-refresh" @click="fetchDashboardData" style="margin-left: 15px;">刷新数据</el-button>
    </el-card>
    
    <!-- 数据概览卡片 -->
    <el-row :gutter="20">
      <el-col :xs="24" :sm="12" :md="12" :lg="6" :xl="6" v-for="(item, index) in statCards" :key="index">
        <el-card class="stat-card" :body-style="{ padding: '20px' }" v-loading="loading.statistics">
          <div class="card-content">
            <div class="card-icon" :style="{ backgroundColor: item.color }">
              <i :class="item.icon"></i>
            </div>
            <div class="card-info">
              <div class="card-title">{{ item.title }}</div>
              <div class="card-value">{{ item.value }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 销售趋势图 -->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="16">
        <el-card v-loading="loading.salesTrend">
          <div slot="header">
            <span>销售趋势</span>
            <el-radio-group v-model="trendType" size="mini" style="float: right;" @change="handleTrendTypeChange">
              <el-radio-button label="daily">日</el-radio-button>
              <el-radio-button label="weekly">周</el-radio-button>
              <el-radio-button label="monthly">月</el-radio-button>
            </el-radio-group>
          </div>
          <div class="chart-container">
            <div ref="salesChart" style="width: 100%; height: 350px;"></div>
          </div>
        </el-card>
      </el-col>

      <!-- 库存预警 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="8">
        <el-card v-loading="loading.lowStock">
          <div slot="header">
            <span>库存预警</span>
          </div>
          <el-table :data="lowStockItems" style="width: 100%" max-height="350" v-if="lowStockItems.length > 0">
            <el-table-column prop="name" label="商品名称" width="120"></el-table-column>
            <el-table-column prop="stock" label="库存" width="80"></el-table-column>
            <el-table-column prop="threshold" label="预警值" width="80"></el-table-column>
          </el-table>
          <div v-else class="empty-data">
            <i class="el-icon-box"></i>
            <p>暂无库存预警</p>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row :gutter="20" style="margin-top: 20px;">
      <!-- 最近订单 -->
      <el-col :span="24">
        <el-card v-loading="loading.recentOrders">
          <div slot="header">
            <span>最近订单</span>
          </div>
          <el-table :data="recentOrders" style="width: 100%" v-if="recentOrders.length > 0">
            <el-table-column prop="id" label="订单号" width="180"></el-table-column>
            <el-table-column prop="customer" label="客户名称" width="120"></el-table-column>
            <el-table-column prop="date" label="下单时间" width="180"></el-table-column>
            <el-table-column prop="amount" label="订单金额" width="120"></el-table-column>
            <el-table-column prop="status" label="订单状态">
              <template slot-scope="scope">
                <el-tag :type="orderStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                <el-button type="text" size="small" @click="viewOrderDetail(scope.row.id)">查看详情</el-button>
              </template>
            </el-table-column>
          </el-table>
          <div v-else class="empty-data">
            <i class="el-icon-s-order"></i>
            <p>暂无订单数据</p>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
// 引入 echarts
import * as echarts from 'echarts';
import { mapGetters, mapActions } from 'vuex';
import { getDashboardStatistics, getSalesTrend, getLowStockProducts, getRecentOrders } from '@/api/dashboard';

export default {
  name: 'Dashboard',
  data() {
    return {
      statCards: [
        {
          title: '今日销售额',
          value: '¥0',
          icon: 'el-icon-s-goods',
          color: '#409EFF'
        },
        {
          title: '总商品数',
          value: '0',
          icon: 'el-icon-s-shop',
          color: '#67C23A'
        },
        {
          title: '订单总数',
          value: '0',
          icon: 'el-icon-s-order',
          color: '#E6A23C'
        },
        {
          title: '用户总数',
          value: '0',
          icon: 'el-icon-user',
          color: '#F56C6C'
        }
      ],
      lowStockItems: [],
      recentOrders: [],
      salesChart: null,
      loading: {
        statistics: false,
        salesTrend: false,
        lowStock: false,
        recentOrders: false
      },
      dateRange: [
        new Date(new Date().setDate(new Date().getDate() - 7)), // 一周前
        new Date() // 今天
      ],
      trendType: 'daily',
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      }
    };
  },
  mounted() {
    this.fetchDashboardData();
  },
  methods: {
    // 获取所有仪表盘数据
    fetchDashboardData() {
      this.fetchStatistics();
      this.fetchSalesTrend();
      this.fetchLowStockProducts();
      this.fetchRecentOrders();
    },
    
    // 获取统计数据
    async fetchStatistics() {
      this.loading.statistics = true;
      try {
        const response = await getDashboardStatistics({
          startDate: this.dateRange[0],
          endDate: this.dateRange[1]
        });
        
        if (response && response.data) {
          const data = response.data;
          // 更新统计卡片数据
          this.statCards[0].value = `¥${data.salesAmount || 0}`;
          this.statCards[1].value = data.productCount || 0;
          this.statCards[2].value = data.orderCount || 0;
          this.statCards[3].value = data.userCount || 0;
        }
      } catch (error) {
        console.error('获取统计数据失败:', error);
        this.$message.error('获取统计数据失败');
      } finally {
        this.loading.statistics = false;
      }
    },
    
    // 获取销售趋势数据
    async fetchSalesTrend() {
      this.loading.salesTrend = true;
      try {
        const response = await getSalesTrend({
          startDate: this.dateRange[0],
          endDate: this.dateRange[1],
          type: this.trendType
        });
        
        if (response && response.data) {
          const data = response.data;
          this.updateSalesChart(data.dates, data.sales, data.orders);
        }
      } catch (error) {
        console.error('获取销售趋势数据失败:', error);
        this.$message.error('获取销售趋势数据失败');
      } finally {
        this.loading.salesTrend = false;
      }
    },
    
    // 获取库存预警数据
    async fetchLowStockProducts() {
      this.loading.lowStock = true;
      try {
        const response = await getLowStockProducts();
        if (response && response.data) {
          this.lowStockItems = response.data;
        }
      } catch (error) {
        console.error('获取库存预警数据失败:', error);
        this.$message.error('获取库存预警数据失败');
      } finally {
        this.loading.lowStock = false;
      }
    },
    
    // 获取最近订单数据
    async fetchRecentOrders() {
      this.loading.recentOrders = true;
      try {
        const response = await getRecentOrders({
          startDate: this.dateRange[0],
          endDate: this.dateRange[1]
        });
        if (response && response.data) {
          this.recentOrders = response.data;
        }
      } catch (error) {
        console.error('获取最近订单数据失败:', error);
        this.$message.error('获取最近订单数据失败');
      } finally {
        this.loading.recentOrders = false;
      }
    },
    
    // 更新销售趋势图表
    updateSalesChart(dates, sales, orders) {
      if (!this.salesChart) {
        this.salesChart = echarts.init(this.$refs.salesChart);
      }
      
      const option = {
        tooltip: {
          trigger: 'axis'
        },
        legend: {
          data: ['销售额', '订单数']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: dates || ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: [
          {
            type: 'value',
            name: '销售额',
            position: 'left',
            axisLabel: {
              formatter: '{value} 元'
            }
          },
          {
            type: 'value',
            name: '订单数',
            position: 'right',
            axisLabel: {
              formatter: '{value}'
            }
          }
        ],
        series: [
          {
            name: '销售额',
            type: 'line',
            yAxisIndex: 0,
            data: sales || [5000, 6200, 8100, 7800, 11000, 14000, 12000],
            smooth: true,
            lineStyle: {
              width: 3,
              color: '#409EFF'
            },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(64, 158, 255, 0.7)'
                },
                {
                  offset: 1,
                  color: 'rgba(64, 158, 255, 0.1)'
                }
              ])
            }
          },
          {
            name: '订单数',
            type: 'line',
            yAxisIndex: 1,
            data: orders || [120, 150, 180, 170, 210, 230, 190],
            smooth: true,
            lineStyle: {
              width: 3,
              color: '#67C23A'
            }
          }
        ]
      };
      
      this.salesChart.setOption(option);
      
      // 响应式调整图表大小
      window.addEventListener('resize', () => {
        this.salesChart.resize();
      });
    },
    
    // 处理日期范围变化
    handleDateRangeChange() {
      this.fetchDashboardData();
    },
    
    // 处理趋势类型变化
    handleTrendTypeChange() {
      this.fetchSalesTrend();
    },
    orderStatusType(status) {
      switch (status) {
        case '已完成':
          return 'success';
        case '处理中':
          return 'warning';
        case '已发货':
          return 'primary';
        case '待付款':
          return 'info';
        default:
          return 'info';
      }
    },
    viewOrderDetail(id) {
      this.$message.info(`查看订单详情：${id}`);
      // 实际项目中跳转到订单详情页
      // this.$router.push(`/order/detail/${id}`);
    }
  },
  beforeDestroy() {
    // 销毁图表实例，避免内存泄漏
    if (this.salesChart) {
      this.salesChart.dispose();
    }
    // 移除窗口大小变化监听
    window.removeEventListener('resize', this.salesChart.resize);
  }
};
</script>

<style scoped>
.dashboard-container {
  padding: 20px;
}

.stat-card {
  margin-bottom: 20px;
  border-radius: 4px;
}

.card-content {
  display: flex;
  align-items: center;
}

.card-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
}

.card-icon i {
  font-size: 30px;
  color: #fff;
}

.card-info {
  flex: 1;
}

.card-title {
  font-size: 14px;
  color: #909399;
  margin-bottom: 5px;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.chart-container {
  position: relative;
  width: 100%;
  height: 350px;
}
</style>