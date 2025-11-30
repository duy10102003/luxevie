import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api, { extractError } from '../../services/api';

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
    <span className={`inline-flex items-center px-3 py-1 rounded-lg border text-sm font-medium ${colorClasses[config.color]}`}>
      <span className="mr-2">{config.icon}</span>
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
    <span className={`inline-flex items-center px-3 py-1 rounded-lg border text-sm font-medium ${colorClasses[config.color]}`}>
      <span className="mr-2">{config.icon}</span>
      {config.label}
    </span>
  );
};

export default function UserEdit() {
  const { id } = useParams();
  const nav = useNavigate();
  const [values, setValues] = useState({ name:'', email:'', role:'user', status:'active' });
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/admin/users/${id}`);
        setValues({ name: data.user.name || '', email: data.user.email || '', role: data.user.role, status: data.user.status });
      } catch (e) { setErr(extractError(e)); }
      finally { setLoading(false); }
    })();
  }, [id]);

  const handleChange = (e) => setValues(v => ({ ...v, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault(); 
    setErr(null);
    setSaving(true);
    try {
      await api.patch(`/admin/users/${id}`, values);
      nav('/admin/users');
    } catch (e) { setErr(extractError(e)); }
    finally { setSaving(false); }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => nav('/admin/users')}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            ← Quay lại
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Chỉnh sửa người dùng</h1>
            <p className="text-sm text-gray-600 mt-1">Cập nhật thông tin và quyền hạn người dùng</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <RoleBadge role={values.role} />
          <StatusBadge status={values.status} />
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

      {/* Form */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <form onSubmit={submit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Thông tin cơ bản</h2>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={values.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập họ và tên"
                  required
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={values.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Nhập địa chỉ email"
                  required
                />
              </div>
            </div>

            {/* Role & Status */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Quyền hạn & Trạng thái</h2>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                  Vai trò
                </label>
                <select
                  id="role"
                  name="role"
                  value={values.role}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="user">👤 Người dùng</option>
                  <option value="admin">👑 Quản trị viên</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Quản trị viên có quyền truy cập vào trang quản trị
                </p>
              </div>

              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Trạng thái tài khoản
                </label>
                <select
                  id="status"
                  name="status"
                  value={values.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">✅ Hoạt động</option>
                  <option value="blocked">🚫 Bị khóa</option>
                </select>
                <p className="mt-1 text-xs text-gray-500">
                  Tài khoản bị khóa sẽ không thể đăng nhập
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => nav('/admin/users')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saving ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Đang lưu...</span>
                </div>
              ) : (
                'Lưu thay đổi'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* User Info Summary */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Thông tin người dùng</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-gray-600">ID:</span>
            <span className="ml-2 font-mono text-gray-900">{id.slice(-8)}</span>
          </div>
          <div>
            <span className="text-gray-600">Email:</span>
            <span className="ml-2 text-gray-900">{values.email}</span>
          </div>
          <div>
            <span className="text-gray-600">Vai trò:</span>
            <span className="ml-2">{ROLE_CONFIG[values.role]?.label || values.role}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
