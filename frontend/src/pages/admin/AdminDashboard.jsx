import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  getDashboardStats, 
  getRevenueChart, 
  getRecentOrders, 
  getTopProducts 
} from "../../services/adminDashboard";

// Component StatCard
const StatCard = ({ title, value, change, changeType, icon, color = "blue" }) => {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600", 
    yellow: "bg-yellow-50 text-yellow-600",
    red: "bg-red-50 text-red-600",
    purple: "bg-purple-50 text-purple-600"
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {change !== undefined && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${
                changeType === 'increase' ? 'text-green-600' : 
                changeType === 'decrease' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {change > 0 ? '+' : ''}{change}%
              </span>
              <span className="text-sm text-gray-500 ml-1">so với tháng trước</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

// Component RevenueChart (Simple bar chart)
const RevenueChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu 7 ngày gần đây</h3>
        <div className="flex items-center justify-center h-64 text-gray-500">
          Không có dữ liệu
        </div>
      </div>
    );
  }

  const maxRevenue = Math.max(...data.map(d => d.revenue));
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Doanh thu 7 ngày gần đây</h3>
      <div className="space-y-4">
        {data.map((item, index) => (
          <div key={index} className="flex items-center space-x-4">
            <div className="w-20 text-sm text-gray-600">
              {new Date(item.date).toLocaleDateString('vi-VN', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </div>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0}%` 
                    }}
                  ></div>
                </div>
                <div className="text-sm font-medium text-gray-900 w-20 text-right">
                  {item.revenue.toLocaleString()}₫
                </div>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {item.orders} đơn hàng
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component RecentOrders
const RecentOrders = ({ orders }) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Đơn hàng gần đây</h3>
        <div className="text-center text-gray-500 py-8">
          Không có đơn hàng
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      refunded: 'bg-orange-100 text-orange-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusLabel = (status) => {
    const labels = {
      pending: 'Chờ xác nhận',
      confirmed: 'Đã xác nhận',
      processing: 'Đang xử lý',
      shipped: 'Đã gửi',
      delivered: 'Đã giao',
      cancelled: 'Đã hủy',
      refunded: 'Hoàn tiền'
    };
    return labels[status] || status;
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Đơn hàng gần đây</h3>
        <Link 
          to="/admin/orders" 
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Xem tất cả
        </Link>
      </div>
      <div className="space-y-3">
        {orders.map(order => (
          <div key={order._id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <span className="font-medium text-gray-900">
                  #{order.code || order._id.slice(-6)}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {order.shippingAddress?.fullName || order.userId?.name || 'Khách hàng'}
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900">
                {Number(order.total || 0).toLocaleString()}₫
              </div>
              <div className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString('vi-VN')}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component TopProducts
const TopProducts = ({ products }) => {
  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Sản phẩm bán chạy</h3>
        <div className="text-center text-gray-500 py-8">
          Không có dữ liệu
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Sản phẩm bán chạy</h3>
        <Link 
          to="/admin/products" 
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Xem tất cả
        </Link>
      </div>
      <div className="space-y-3">
        {products.map((item, index) => (
          <div key={item._id} className="flex items-center space-x-3 py-2">
            <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
              {index + 1}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-gray-900 truncate">
                {item.name}
              </div>
              <div className="text-sm text-gray-500">
                Đã bán: {item.totalSold} sản phẩm
              </div>
            </div>
            <div className="text-right">
              <div className="font-medium text-gray-900">
                {Number(item.totalRevenue || 0).toLocaleString()}₫
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [revenueData, setRevenueData] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Đang tải dữ liệu dashboard...');
        
        // Test từng API một cách riêng biệt
        try {
          const statsRes = await getDashboardStats();
          console.log('✅ Stats API:', statsRes);
          setStats(statsRes);
        } catch (err) {
          console.error('❌ Stats API error:', err);
        }

        try {
          const revenueRes = await getRevenueChart();
          console.log('✅ Revenue API:', revenueRes);
          setRevenueData(revenueRes.chartData || []);
        } catch (err) {
          console.error('❌ Revenue API error:', err);
        }

        try {
          const ordersRes = await getRecentOrders();
          console.log('✅ Orders API:', ordersRes);
          setRecentOrders(ordersRes.orders || []);
        } catch (err) {
          console.error('❌ Orders API error:', err);
        }

        try {
          const productsRes = await getTopProducts();
          console.log('✅ Products API:', productsRes);
          setTopProducts(productsRes.products || []);
        } catch (err) {
          console.error('❌ Products API error:', err);
        }

        // Nếu tất cả API đều lỗi, hiển thị dữ liệu mẫu
        if (!stats) {
          console.log('📊 Sử dụng dữ liệu mẫu...');
          setStats({
            overview: { totalOrders: 0, totalProducts: 0, totalUsers: 0 },
            monthly: { orders: 0, revenue: 0, orderGrowthRate: 0, revenueGrowthRate: 0 },
            orderStatus: { pending: 0, confirmed: 0, delivered: 0, cancelled: 0 }
          });
        }

      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.message || 'Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Đang tải dữ liệu...</span>
        </div>
      </div>
    );
  }

  // Sử dụng dữ liệu mẫu nếu không có dữ liệu thực
  const displayStats = stats || {
    overview: { totalOrders: 0, totalProducts: 0, totalUsers: 0 },
    monthly: { orders: 0, revenue: 0, orderGrowthRate: 0, revenueGrowthRate: 0 },
    orderStatus: { pending: 0, confirmed: 0, delivered: 0, cancelled: 0 }
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="text-red-800">{error}</div>
        </div>
        {/* Hiển thị dashboard với dữ liệu mẫu khi có lỗi */}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan</h1>
        <p className="text-gray-600 mt-1">Thống kê và phân tích hiệu suất kinh doanh</p>
        {!stats && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm text-yellow-800">
              ⚠️ Đang sử dụng dữ liệu mẫu. Vui lòng kiểm tra kết nối API.
            </p>
          </div>
        )}
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng đơn hàng"
          value={displayStats.overview.totalOrders}
          change={displayStats.monthly.orderGrowthRate}
          changeType={displayStats.monthly.orderGrowthRate > 0 ? 'increase' : 'decrease'}
          icon={<span className="text-xl">📦</span>}
          color="blue"
        />
        <StatCard
          title="Doanh thu tháng này"
          value={`${Number(displayStats.monthly.revenue).toLocaleString()}₫`}
          change={displayStats.monthly.revenueGrowthRate}
          changeType={displayStats.monthly.revenueGrowthRate > 0 ? 'increase' : 'decrease'}
          icon={<span className="text-xl">💰</span>}
          color="green"
        />
        <StatCard
          title="Sản phẩm"
          value={displayStats.overview.totalProducts}
          icon={<span className="text-xl">🛍️</span>}
          color="purple"
        />
        <StatCard
          title="Khách hàng"
          value={displayStats.overview.totalUsers}
          icon={<span className="text-xl">👥</span>}
          color="yellow"
        />
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RevenueChart data={revenueData} />
        <RecentOrders orders={recentOrders} />
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProducts products={topProducts} />
        
        {/* Order Status Overview */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái đơn hàng</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Chờ xác nhận</span>
              </div>
              <span className="font-medium text-gray-900">{displayStats.orderStatus.pending}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Đã xác nhận</span>
              </div>
              <span className="font-medium text-gray-900">{displayStats.orderStatus.confirmed}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Đã giao</span>
              </div>
              <span className="font-medium text-gray-900">{displayStats.orderStatus.delivered}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Đã hủy</span>
              </div>
              <span className="font-medium text-gray-900">{displayStats.orderStatus.cancelled}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tác vụ nhanh</h3>
        <div className="flex flex-wrap gap-3">
          <Link 
            to="/admin/products/new" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <span className="mr-2">➕</span>
            Thêm sản phẩm
          </Link>
          <Link 
            to="/admin/orders" 
            className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <span className="mr-2">📦</span>
            Quản lý đơn hàng
          </Link>
          <Link 
            to="/admin/coupons" 
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <span className="mr-2">🎫</span>
            Quản lý coupon
          </Link>
          <Link 
            to="/admin/categories" 
            className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            <span className="mr-2">📂</span>
            Quản lý danh mục
          </Link>
        </div>
      </div>
    </div>
  );
}
