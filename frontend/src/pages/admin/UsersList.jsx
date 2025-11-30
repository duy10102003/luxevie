import { useEffect, useState } from 'react';
import api, { extractError } from '../../services/api';
import { Link } from 'react-router-dom';

const ROLE_CONFIG = {
  user: { label: 'Người dùng', color: 'blue', icon: '👤' },
  admin: { label: 'Quản trị viên', color: 'purple', icon: '👑' },
};

const STATUS_CONFIG = {
  active: { label: 'Hoạt động', color: 'green', icon: '✅' },
  blocked: { label: 'Bị khóa', color: 'red', icon: '🚫' },
};

// Component RoleBadge
const RoleBadge = ({ role }) => {
  const config = ROLE_CONFIG[role] || { label: role, color: 'gray', icon: '❓' };
  
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 border-blue-200',
    purple: 'bg-purple-100 text-purple-800 border-purple-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${colorClasses[config.color]}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};

// Component StatusBadge
const StatusBadge = ({ status }) => {
  const config = STATUS_CONFIG[status] || { label: status, color: 'gray', icon: '❓' };
  
  const colorClasses = {
    green: 'bg-green-100 text-green-800 border-green-200',
    red: 'bg-red-100 text-red-800 border-red-200',
    gray: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${colorClasses[config.color]}`}>
      <span className="mr-1">{config.icon}</span>
      {config.label}
    </span>
  );
};

// Component UserCard
const UserCard = ({ user, onRemove }) => (
  <div className="bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 p-4">
    <div className="flex items-start justify-between mb-3">
      <div className="flex items-center space-x-3">
        <div className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          <span className="text-gray-600 text-lg">👤</span>
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">{user.name}</h3>
          <p className="text-sm text-gray-500 truncate">{user.email}</p>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <RoleBadge role={user.role} />
        <StatusBadge status={user.status} />
      </div>
    </div>
    
    <div className="text-xs text-gray-500 mb-3">
      Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}
    </div>
    
    <div className="flex items-center justify-between pt-3 border-t border-gray-100">
      <div className="text-xs text-gray-500">
        ID: {user._id.slice(-6)}
      </div>
      <div className="flex space-x-2">
        <Link 
          to={`/admin/users/${user._id}`}
          className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
        >
          Sửa
        </Link>
        <button 
          onClick={() => onRemove(user._id)}
          className="inline-flex items-center px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 rounded-md hover:bg-red-100 transition-colors"
        >
          Xóa
        </button>
      </div>
    </div>
  </div>
);

export default function UsersList() {
  const [data, setData] = useState({ items: [], total: 0, page: 1, pages: 1 });
  const [q, setQ] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('card'); // 'card' or 'table'

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      const { data } = await api.get('/admin/users', { params: { q, role, status, page, limit: 12 } });
      setData(data);
    } catch (e) { setErr(extractError(e)); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(1); /* eslint-disable-next-line */ }, []);

  const remove = async (id) => {
    if (!confirm('Xoá người dùng này?')) return;
    try { await api.delete(`/admin/users/${id}`); fetchData(data.page); }
    catch (e) { alert(extractError(e).message); }
  };

  const handleSearch = () => {
    fetchData(1);
  };

  const clearFilters = () => {
    setQ('');
    setRole('');
    setStatus('');
    fetchData(1);
  };

  // Calculate stats
  const stats = {
    total: data.total || 0,
    active: data.items.filter(u => u.status === 'active').length,
    blocked: data.items.filter(u => u.status === 'blocked').length,
    admins: data.items.filter(u => u.role === 'admin').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quản lý người dùng</h1>
          <p className="text-sm text-gray-600 mt-1">Quản lý tài khoản và quyền hạn người dùng</p>
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-blue-600 text-sm font-semibold">👥</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Tổng người dùng</p>
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
              <p className="text-sm font-medium text-gray-600">Đang hoạt động</p>
              <p className="text-lg font-semibold text-gray-900">{stats.active}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                <span className="text-red-600 text-sm font-semibold">🚫</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Bị khóa</p>
              <p className="text-lg font-semibold text-gray-900">{stats.blocked}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-purple-600 text-sm font-semibold">👑</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Quản trị viên</p>
              <p className="text-lg font-semibold text-gray-900">{stats.admins}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tìm kiếm</label>
            <input
              placeholder="Tên, email..."
              value={q}
              onChange={e => setQ(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              value={role} 
              onChange={e => setRole(e.target.value)}
            >
              <option value="">Tất cả vai trò</option>
              <option value="user">Người dùng</option>
              <option value="admin">Quản trị viên</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
            <select 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
              value={status} 
              onChange={e => setStatus(e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="active">Hoạt động</option>
              <option value="blocked">Bị khóa</option>
            </select>
          </div>
          
          <div className="flex items-end gap-2">
            <button
              onClick={handleSearch}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 transition-colors"
            >
              Tìm kiếm
            </button>
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 transition-colors"
            >
              Xóa
            </button>
          </div>
        </div>
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.items.map(user => (
                <UserCard key={user._id} user={user} onRemove={remove} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày tạo</th>
                      <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Thao tác</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {data.items.map(user => (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                              <span className="text-gray-600 text-sm">👤</span>
                            </div>
                            <div className="ml-3">
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <RoleBadge role={user.role} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <StatusBadge status={user.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          <div className="flex space-x-2">
                            <Link 
                              to={`/admin/users/${user._id}`}
                              className="inline-flex items-center px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors"
                            >
                              Sửa
                            </Link>
                            <button 
                              onClick={() => remove(user._id)}
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
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Không có người dùng</h3>
          <p className="text-gray-500">Không tìm thấy người dùng phù hợp với bộ lọc hiện tại.</p>
        </div>
      )}

      {/* Pagination */}
      {data.pages > 1 && (
        <div className="flex items-center justify-between bg-white px-4 py-3 border border-gray-200 rounded-lg">
          <div className="flex-1 flex justify-between sm:hidden">
            <button
              onClick={() => fetchData(data.page - 1)}
              disabled={data.page <= 1}
              className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>
            <button
              onClick={() => fetchData(data.page + 1)}
              disabled={data.page >= data.pages}
              className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Hiển thị <span className="font-medium">{((data.page - 1) * 12) + 1}</span> đến{' '}
                <span className="font-medium">{Math.min(data.page * 12, data.total)}</span> trong{' '}
                <span className="font-medium">{data.total}</span> kết quả
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => fetchData(data.page - 1)}
                  disabled={data.page <= 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Trước</span>
                  ←
                </button>
                
                {Array.from({ length: Math.min(5, data.pages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(data.pages - 4, data.page - 2)) + i;
                  if (pageNum > data.pages) return null;
                  
                  return (
                    <button
                      key={pageNum}
                      onClick={() => fetchData(pageNum)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        pageNum === data.page
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => fetchData(data.page + 1)}
                  disabled={data.page >= data.pages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Sau</span>
                  →
                </button>
              </nav>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
