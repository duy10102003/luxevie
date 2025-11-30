import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listAdminProducts, deleteAdminProduct } from '../../services/adminProducts';

const STATUS_CONFIG = {
  active: { label: 'Hoạt động', color: 'green', icon: '✅' },
  draft: { label: 'Bản nháp', color: 'yellow', icon: '📝' },
  archived: { label: 'Lưu trữ', color: 'gray', icon: '📦' },
};

// Component StatusBadge
const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || { label: status, color: 'gray', icon: '❓' };
  
  const colorClasses = {
    green: 'bg-green-100 text-green-800 border-green-200',
    yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${colorClasses[config.color]}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};

// Component ProductCard
const ProductCard = ({ product, onRemove }) => {
  const hasDiscount = product.salePrice && product.salePrice < product.price;
  const discountPercent = hasDiscount ? Math.round(((product.price - product.salePrice) / product.price) * 100) : 0;

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 overflow-hidden">
      <div className="relative">
        <img 
          src={product.images?.[0]?.url || `https://picsum.photos/seed/${product._id}/600/750`} 
          alt={product.name}
          className="w-full h-48 object-cover"
        />
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            -{discountPercent}%
          </div>
        )}
        <div className="absolute top-2 right-2">
          <StatusBadge status={product.status} />
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-sm font-medium text-gray-900 line-clamp-2 mb-2">{product.name}</h3>
        
        <div className="flex items-center justify-between mb-2">
          <div className="text-sm">
            <span className="font-semibold text-gray-900">
              {hasDiscount ? Number(product.salePrice).toLocaleString() : Number(product.price).toLocaleString()}₫
            </span>
            {hasDiscount && (
              <span className="text-gray-400 line-through ml-1 text-xs">
                {Number(product.price).toLocaleString()}₫
              </span>
            )}
          </div>
          <div className="text-xs text-gray-500">
            Kho: {product.stock || 0}
          </div>
        </div>
        
        {product.sku && (
          <div className="text-xs text-gray-500 mb-2">SKU: {product.sku}</div>
        )}
        
        
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            ID: {product._id.slice(-6)}
          </div>
          <div className="flex space-x-2">
            <Link 
              to={`/admin/products/${product._id}`}
              className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
            >
              Sửa
            </Link>
            <button 
              onClick={() => onRemove(product._id)}
              className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
            >
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function ProductsList() {
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [stats, setStats] = useState({ total: 0, active: 0, lowStock: 0, draft: 0 });
  const [q, setQ] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchHistory, setSearchHistory] = useState([]);

  const fetchStats = async () => {
    try {
      const res = await listAdminProducts({ limit: 1000 });
      const allProducts = res.items;
      
      const statsData = {
        total: allProducts.length,
        active: allProducts.filter(p => p.status === 'active').length,
        lowStock: allProducts.filter(p => (p.stock || 0) < 10).length,
        draft: allProducts.filter(p => p.status === 'draft').length,
      };
      
      setStats(statsData);
    } catch (e) {
      console.error('Error fetching stats:', e);
    }
  };

  const fetchData = async (page = 1, searchQuery = q) => {
    setLoading(true);
    try {
      const res = await listAdminProducts({ q: searchQuery, page, limit: 1000 });
      setData(res);
    } catch (e) { 
      setErr(e); 
    }
    finally { setLoading(false); }
  };

  useEffect(() => { 
    fetchStats();
    fetchData(1); 
  }, []);

  // Auto search with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (q !== '') {
        setSearchLoading(true);
        fetchData(1, q).finally(() => setSearchLoading(false));
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [q]);

  const remove = async (id) => {
    if (!confirm('Xoá sản phẩm này?')) return;
    try { 
      await deleteAdminProduct(id); 
      fetchStats(); // Cập nhật lại stats
      fetchData(1); 
    }
    catch (e) { 
      alert(e.message); 
    }
  };

  const handleSearch = () => {
    if (q.trim()) {
      // Add to search history
      const newHistory = [q.trim(), ...searchHistory.filter(item => item !== q.trim())].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('productSearchHistory', JSON.stringify(newHistory));
    }
    setSearchLoading(true);
    fetchData(1, q).finally(() => setSearchLoading(false));
  };

  const clearSearch = () => {
    setQ('');
    setSearchLoading(true);
    fetchData(1, '').finally(() => setSearchLoading(false));
  };

  // Load search history on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('productSearchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Stats are now managed in separate state

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý sản phẩm</h1>
          <p className="text-sm text-gray-600 mt-1">Quản lý danh mục sản phẩm và kho hàng</p>
        </div>
        
        <div className="flex items-center gap-3">
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

          {/* Add Product Button */}
          <Link 
            to="/admin/products/new" 
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
          >
            + Thêm sản phẩm
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-sm font-semibold">📦</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Tổng sản phẩm</p>
              <p className="text-lg font-semibold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-green-600 text-sm font-semibold">✅</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Đang bán</p>
              <p className="text-lg font-semibold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                <span className="text-yellow-600 text-sm font-semibold">📝</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Bản nháp</p>
              <p className="text-lg font-semibold text-gray-900">{stats.draft}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-sm font-semibold">⚠️</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Sắp hết hàng</p>
              <p className="text-lg font-semibold text-gray-900">{stats.lowStock}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <input 
              className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              placeholder="Tìm theo tên, SKU, mô tả... (Enter để tìm, Esc để xóa)" 
              value={q} 
              onChange={e=>setQ(e.target.value)}
              onKeyDown={(e) => { 
                if (e.key === 'Enter') handleSearch(); 
                if (e.key === 'Escape') clearSearch();
              }}
            />
            {searchLoading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              </div>
            )}
            {!searchLoading && q && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <span className="text-gray-400">🔍</span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {q && (
              <button 
                onClick={clearSearch}
                disabled={searchLoading}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Xóa tìm kiếm (Esc)"
              >
                Xóa
              </button>
            )}
            <button 
              onClick={handleSearch}
              disabled={searchLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              title="Tìm kiếm (Enter)"
            >
              {searchLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Đang tìm...
                </>
              ) : (
                'Tìm kiếm'
              )}
            </button>
          </div>
        </div>
        
        {/* Search History */}
        {searchHistory.length > 0 && !q && (
          <div className="mt-3">
            <div className="text-xs text-gray-500 mb-2">Tìm kiếm gần đây:</div>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((term, index) => (
                <button
                  key={index}
                  onClick={() => setQ(term)}
                  className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}
        
        {q && (
          <div className="mt-2 text-sm text-gray-600">
            {searchLoading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                Đang tìm kiếm...
              </span>
            ) : (
              <>
                Tìm kiếm: "<span className="font-medium">{q}</span>" • {data.total} kết quả tìm thấy
                {data.total === 0 && (
                  <span className="ml-2 text-red-500">• Không tìm thấy sản phẩm nào</span>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Error Message */}
      {err && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-red-400">⚠️</span>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Lỗi</h3>
              <div className="mt-2 text-sm text-red-700">{err.message}</div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            <span className="text-gray-600">Đang tải...</span>
          </div>
        </div>
      ) : data.items.length ? (
        <>
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {data.items.map(product => (
                <ProductCard key={product._id} product={product} onRemove={remove} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sản phẩm</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thương hiệu</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Giá</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Kho</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.items.map(product => (
                      <tr key={product._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-12 h-12">
                              <img 
                                className="w-12 h-12 rounded-lg object-cover" 
                                src={product.images?.[0]?.url || `https://picsum.photos/seed/${product._id}/100/100`} 
                                alt={product.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900">{product.sku || '—'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="text-sm text-gray-900">{product.brand || '—'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {product.salePrice ? Number(product.salePrice).toLocaleString() : Number(product.price).toLocaleString()}₫
                            </div>
                            {product.salePrice && (
                              <div className="text-xs text-gray-400 line-through">
                                {Number(product.price).toLocaleString()}₫
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className={`text-sm font-medium ${
                            (product.stock || 0) < 10 ? 'text-red-600' : 'text-gray-900'
                          }`}>
                            {product.stock || 0}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <StatusBadge status={product.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex space-x-2">
                            <Link 
                              to={`/admin/products/${product._id}`}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                            >
                              Sửa
                            </Link>
                            <button 
                              onClick={() => remove(product._id)}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
                            >
                              Xóa
                            </button>
                          </div>
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
          <div className="text-gray-400 text-6xl mb-4">📦</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có sản phẩm</h3>
          <p className="text-gray-500">Tạo sản phẩm đầu tiên để bắt đầu.</p>
        </div>
      )}

      {/* Product Count Info */}
      {data.total > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị tất cả <span className="font-medium">{data.total}</span> sản phẩm
              </p>
              {q && (
                <p className="text-xs text-gray-500 mt-1">
                  Kết quả tìm kiếm cho: "<span className="font-medium">{q}</span>"
                </p>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {data.items.length} sản phẩm đang hiển thị
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
// export default function ProductsList() {
//   return <div className="card">Danh sách sản phẩm (admin)</div>;
// }
