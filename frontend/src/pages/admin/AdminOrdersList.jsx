// frontend/src/pages/admin/AdminOrdersList.jsx
import { useEffect, useState, useCallback } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { adminFetchOrders } from '../../services/adminOrders';

const STATUS = [
  { value: '', label: 'Tất cả', color: 'gray' },
  { value: 'pending', label: 'Chờ xác nhận', color: 'yellow' },
  { value: 'confirmed', label: 'Đã xác nhận', color: 'blue' },
  { value: 'processing', label: 'Đang xử lý', color: 'purple' },
  { value: 'shipped', label: 'Đã gửi', color: 'indigo' },
  { value: 'delivered', label: 'Đã giao', color: 'green' },
  { value: 'cancelled', label: 'Đã hủy', color: 'red' },
  { value: 'refunded', label: 'Hoàn tiền', color: 'orange' },
];

// Component StatusBadge
const StatusBadge = ({ status, paid }) => {
  const statusConfig = STATUS.find(s => s.value === status) || { label: status, color: 'gray' };
  
  const colorClasses = {
    gray: 'bg-gray-100 text-gray-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    blue: 'bg-blue-100 text-blue-800',
    purple: 'bg-purple-100 text-purple-800',
    indigo: 'bg-indigo-100 text-indigo-800',
    green: 'bg-green-100 text-green-800',
    red: 'bg-red-100 text-red-800',
    orange: 'bg-orange-100 text-orange-800',
  };

  return (
    <div className="flex flex-col gap-1">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colorClasses[statusConfig.color]}`}>
        {statusConfig.label}
      </span>
      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${paid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
        {paid ? '✓ Đã thu' : '⏳ Chưa thu'}
      </span>
    </div>
  );
};

// Component OrderCard
const OrderCard = ({ order }) => (
  <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 p-4">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <h3 className="font-semibold text-gray-900">
            {order.code ? `#${order.code}` : `#${order._id.slice(-6)}`}
          </h3>
          <StatusBadge status={order.status} paid={order.paid} />
        </div>
        <div className="text-sm text-gray-600">
          <div className="font-medium">{order.shippingAddress?.fullName || order.userId?.name || '—'}</div>
          <div>{order.shippingAddress?.phone || '—'}</div>
          {order.userId?.email && (
            <div className="text-xs text-gray-400 mt-1">{order.userId.email}</div>
          )}
        </div>
      </div>
      <div className="text-right">
        <div className="text-lg font-semibold text-gray-900">
          {Number(order.total || 0).toLocaleString()}₫
        </div>
        <div className="text-xs text-gray-500">
          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
        </div>
      </div>
    </div>
    
    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
      <div className="text-xs text-gray-500">
        {order.items?.length || 0} sản phẩm
      </div>
      <Link 
        to={`/admin/orders/${order._id}`}
        className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors duration-200"
      >
        Xem chi tiết
      </Link>
    </div>
  </div>
);

export default function AdminOrdersList() {
  const [params, setParams] = useSearchParams();
  const [rows, setRows] = useState([]);
  const [pageInfo, setPageInfo] = useState({ page: 1, limit: 20, total: 0 });
  const [stats, setStats] = useState({ totalRevenue: 0, totalOrders: 0, pendingOrders: 0 });
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  const page = Number(params.get('page') || 1);
  const q = params.get('q') || '';
  const status = params.get('status') || '';
  const sort = params.get('sort') || 'latest';
  
  const [searchInput, setSearchInput] = useState(q);

  // Cập nhật searchInput khi q thay đổi từ URL
  useEffect(() => {
    setSearchInput(q);
  }, [q]);

  // Debounce cho tìm kiếm
  const debouncedSearch = useCallback(
    (() => {
      let timeoutId;
      return (searchTerm) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => {
          setParam('q', searchTerm);
        }, 500); // 500ms delay
      };
    })(),
    []
  );

  // Xử lý thay đổi input tìm kiếm
  const handleSearchChange = (value) => {
    setSearchInput(value);
    debouncedSearch(value);
  };

  const setParam = (k, v) => {
    if (v) params.set(k, v); else params.delete(k);
    params.set('page', '1');
    setParams(params);
  };
  const gotoPage = (p) => { params.set('page', String(p)); setParams(params); };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { items, pagination, stats } = await adminFetchOrders({ page, q, status, sort, limit: 1000 });
        setRows(items || []);
        setPageInfo(pagination || { page: 1, limit: 1000, total: 0 });
        setStats(stats || { totalRevenue: 0, totalOrders: 0, pendingOrders: 0 });
      } finally {
        setLoading(false);
      }
    })();
  }, [page, q, status, sort]);

  const totalPages = Math.max(1, Math.ceil((pageInfo.total || 0) / (pageInfo.limit || 1000)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý đơn hàng</h1>
          <p className="text-sm text-gray-600 mt-1">Theo dõi và quản lý tất cả đơn hàng</p>
        </div>
        
        {/* View Mode Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Hiển thị:</span>
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode('card')}
              className={`px-3 py-1.5 text-sm font-medium rounded-l-md transition-colors ${
                viewMode === 'card' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Card
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-sm font-medium rounded-r-md transition-colors ${
                viewMode === 'table' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Bảng
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-sm font-semibold">📦</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Tổng đơn hàng</p>
              <p className="text-lg font-semibold text-gray-900">{stats.totalOrders || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-sm font-semibold">💰</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Doanh thu</p>
              <p className="text-lg font-semibold text-gray-900">{Number(stats.totalRevenue || 0).toLocaleString()}₫</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-sm font-semibold">⏳</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Chờ xử lý</p>
              <p className="text-lg font-semibold text-gray-900">{stats.pendingOrders || 0}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
            <div className="relative">
              <input
                placeholder="Mã đơn, tên, SĐT, email, ID..."
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
                onKeyDown={(e) => { 
                  if (e.key === 'Enter') {
                    setParam('q', e.currentTarget.value);
                  }
                }}
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {searchInput && (
                <button
                  onClick={() => {
                    setSearchInput('');
                    setParam('q', '');
                  }}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <div className="mt-1 text-xs text-gray-500">
              Tìm theo: mã đơn (ODR20250101-123), tên khách hàng, SĐT, email, hoặc 6 ký tự cuối ID
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              value={status} 
              onChange={(e) => setParam('status', e.target.value)}
            >
              {STATUS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              value={sort} 
              onChange={(e) => setParam('sort', e.target.value)}
            >
              <option value="latest">Mới nhất</option>
              <option value="amount_desc">Tổng tiền ↓</option>
              <option value="amount_asc">Tổng tiền ↑</option>
              <option value="status">Trạng thái</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => {
                setSearchInput('');
                setParam('q', '');
                setParam('status', '');
                setParam('sort', 'latest');
              }}
              className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Xóa bộ lọc
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Đang tải...</span>
          </div>
        </div>
      ) : rows.length ? (
        <>
          {/* Search Results Header */}
          {(q || status) && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <span className="text-sm font-medium text-blue-800">
                    Kết quả tìm kiếm: {pageInfo.total} đơn hàng
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSearchInput('');
                    setParam('q', '');
                    setParam('status', '');
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Xem tất cả
                </button>
              </div>
            </div>
          )}
          
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rows.map(order => (
                <OrderCard key={order._id} order={order} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thanh toán</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày đặt</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rows.map(order => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {order.code ? `#${order.code}` : `#${order._id.slice(-6)}`}
                          </div>
                          {!order.code && (
                            <div className="text-xs text-gray-400">ID: {order._id.slice(-6)}</div>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{order.shippingAddress?.fullName || order.userId?.name || '—'}</div>
                          <div className="text-sm text-gray-500">{order.shippingAddress?.phone || '—'}</div>
                          {order.userId?.email && (
                            <div className="text-xs text-gray-400">{order.userId.email}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm font-medium text-gray-900">{Number(order.total || 0).toLocaleString()}₫</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <StatusBadge status={order.status} paid={order.paid} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            order.paid ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'
                          }`}>
                            {order.paid ? '✓ Đã thu' : '⏳ Chưa thu'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <Link 
                            to={`/admin/orders/${order._id}`}
                            className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                          >
                            Xem chi tiết
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">
            {q || status ? '🔍' : '📦'}
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {q || status ? 'Không tìm thấy đơn hàng' : 'Không có đơn hàng'}
          </h3>
          <p className="text-gray-500 mb-4">
            {q || status 
              ? 'Không tìm thấy đơn hàng phù hợp với bộ lọc hiện tại.' 
              : 'Chưa có đơn hàng nào trong hệ thống.'
            }
          </p>
          {(q || status) && (
            <button
              onClick={() => {
                setSearchInput('');
                setParam('q', '');
                setParam('status', '');
              }}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors"
            >
              <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}

      {/* Order Count Info */}
      {pageInfo.total > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                {q || status ? (
                  <>
                    Tìm thấy <span className="font-medium text-blue-600">{pageInfo.total}</span> đơn hàng phù hợp
                    {q && (
                      <span className="text-gray-500"> với từ khóa "<span className="font-medium">{q}</span>"</span>
                    )}
                    {status && (
                      <span className="text-gray-500"> với trạng thái "<span className="font-medium">{STATUS.find(s => s.value === status)?.label}</span>"</span>
                    )}
                  </>
                ) : (
                  <>
                    Hiển thị tất cả <span className="font-medium">{pageInfo.total}</span> đơn hàng
                  </>
                )}
              </p>
              <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                <span>Tổng: {stats.totalOrders} đơn</span>
                <span>Doanh thu: {Number(stats.totalRevenue || 0).toLocaleString()}₫</span>
                <span>Chờ xử lý: {stats.pendingOrders} đơn</span>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {rows.length} đơn hàng đang hiển thị
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
