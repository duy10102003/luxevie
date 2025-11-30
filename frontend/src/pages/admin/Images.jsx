import { useEffect, useState } from 'react';
import api, { extractError } from '../../services/api';

const blank = {
  imageUrl: '',
  linkUrl: '',
  order: 0,
  active: true,
};

export default function Banner() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [form, setForm] = useState(blank);
  const [editingId, setEditingId] = useState(null);

  const load = async () => {
    setLoading(true);
    setErr(null);
    try {
      const { data } = await api.get('/admin/banners');
      setRows(data.items || []);
    } catch (e) {
      setErr(extractError(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((v) => ({
      ...v,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const startEdit = (row) => {
    setEditingId(row._id);
    setForm({
      imageUrl: row.imageUrl || '',
      linkUrl: row.linkUrl || '',
      order: row.order || 0,
      active: row.active !== false,
    });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm(blank);
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        imageUrl: form.imageUrl.trim(),
        linkUrl: form.linkUrl.trim() || '',
        order: Number(form.order) || 0,
        active: form.active,
      };

      if (editingId) {
        await api.put(`/admin/banners/${editingId}`, payload);
      } else {
        await api.post('/admin/banners', payload);
      }
      resetForm();
      await load();
    } catch (e2) {
      alert(extractError(e2).message);
    }
  };

  const remove = async (id) => {
    if (!confirm('Xóa banner này?')) return;
    try {
      await api.delete(`/admin/banners/${id}`);
      await load();
    } catch (e) {
      alert(extractError(e).message);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Quản lý Banner</h1>

      <form onSubmit={submit} className="bg-white rounded-lg border border-gray-200 p-6 space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL Ảnh *
            </label>
            <input
              className="input"
              name="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={form.imageUrl}
              onChange={onChange}
              required
            />
            <p className="mt-1 text-xs text-gray-500">
              Nhập URL ảnh hoặc upload từ máy (nếu có chức năng upload)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link đích (URL)
            </label>
            <input
              className="input"
              name="linkUrl"
              placeholder="/collection hoặc /product/123"
              value={form.linkUrl}
              onChange={onChange}
            />
            <p className="mt-1 text-xs text-gray-500">
              Khi click banner sẽ điều hướng đến link này (để trống nếu không cần)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Thứ tự hiển thị
            </label>
            <input
              className="input"
              type="number"
              name="order"
              placeholder="0"
              value={form.order}
              onChange={onChange}
            />
            <p className="mt-1 text-xs text-gray-500">
              Số nhỏ hơn sẽ hiển thị trước
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="active"
              id="active"
              checked={form.active}
              onChange={onChange}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <label htmlFor="active" className="ml-2 text-sm font-medium text-gray-700">
              Kích hoạt (hiển thị trên trang chủ)
            </label>
          </div>
        </div>

        <div className="flex gap-2">
          <button className="btn-primary" type="submit">
            {editingId ? 'Cập nhật' : 'Thêm ảnh'}
          </button>
          {editingId && (
            <button type="button" className="btn-ghost" onClick={resetForm}>
              Hủy
            </button>
          )}
        </div>
      </form>

      {err && <div className="text-red-600 bg-red-50 p-3 rounded">{err.message}</div>}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr className="text-left">
                <th className="p-3 text-sm font-medium text-gray-900">Preview</th>
                <th className="p-3 text-sm font-medium text-gray-900">URL Ảnh</th>
                <th className="p-3 text-sm font-medium text-gray-900">Link đích</th>
                <th className="p-3 text-sm font-medium text-gray-900">Thứ tự</th>
                <th className="p-3 text-sm font-medium text-gray-900">Trạng thái</th>
                <th className="p-3 text-sm font-medium text-gray-900 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={6}>
                    Đang tải…
                  </td>
                </tr>
              ) : rows.length ? (
                rows.map((r) => (
                  <tr key={r._id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-3">
                      <img
                        src={r.imageUrl}
                        alt="Banner preview"
                        className="w-24 h-16 object-cover rounded border border-gray-200"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/150?text=Error';
                        }}
                      />
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {r.imageUrl}
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {r.linkUrl || '—'}
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-gray-700">{r.order || 0}</span>
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          r.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {r.active ? 'Đang hiển thị' : 'Ẩn'}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          className="btn-ghost text-sm"
                          onClick={() => startEdit(r)}
                        >
                          Sửa
                        </button>
                        <button
                          className="btn-ghost text-sm text-red-600 hover:text-red-700"
                          onClick={() => remove(r._id)}
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="p-4 text-center text-gray-500" colSpan={6}>
                    Chưa có banner nào. Thêm banner mới ở form phía trên.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

