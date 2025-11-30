import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api, { extractError } from '../../services/api';

// Danh sách các nhóm chính (parent categories)
const MAIN_CATEGORIES = [
  { value: 'quan', label: 'QUẦN' },
  { value: 'giay-dep', label: 'GIÀY DÉP' },
  { value: 'tui-vi', label: 'TÚI VÍ' },
  { value: 'mat-kinh', label: 'MẮT KÍNH' },
  { value: 'dong-ho', label: 'ĐỒNG HỒ' },
  { value: 'phu-kien', label: 'PHỤ KIỆN' },
  { value: 'trang-suc', label: 'TRANG SỨC' },
];

// Utility function để tạo slug
function slugify(s = '') {
  return s
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Component Modal cho Subcategory
function SubcategoryModal({ isOpen, onClose, subcategory, parent, gender, onSubmit, loading }) {
  const [form, setForm] = useState({ name: '', slug: '', gender: 'nam' });

  useEffect(() => {
    if (subcategory) {
      setForm({ 
        name: subcategory.name || '', 
        slug: subcategory.slug || subcategory.category || '',
        gender: subcategory.gender || 'nam'
      });
    } else {
      setForm({ name: '', slug: '', gender: gender || 'nam' });
    }
  }, [subcategory, gender, isOpen]);

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = slugify(name);
    setForm({ ...form, name, slug });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Vui lòng nhập tên danh mục chi tiết');
      return;
    }
    await onSubmit({ ...form, parent });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4">
          {subcategory ? 'Sửa danh mục chi tiết' : 'Thêm danh mục chi tiết'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Chọn danh mục chính
            </label>
            <select
              value={parent}
              disabled
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
            >
              {MAIN_CATEGORIES.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Giới tính <span className="text-red-500">*</span>
            </label>
            <select
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            >
              <option value="nam">NAM</option>
              <option value="nu">NỮ</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên danh mục chi tiết <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={handleNameChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ví dụ: Quần Jeans"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug (tự động tạo)
            </label>
            <input
              type="text"
              value={form.slug}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : subcategory ? 'Cập nhật' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Component Modal cho Brand
function BrandModal({ isOpen, onClose, brand, onSubmit, loading }) {
  const [form, setForm] = useState({ name: '', slug: '', logo: '', description: '' });

  useEffect(() => {
    if (brand) {
      setForm({
        name: brand.name || '',
        slug: brand.slug || '',
        logo: brand.logo || '',
        description: brand.description || '',
      });
    } else {
      setForm({ name: '', slug: '', logo: '', description: '' });
    }
  }, [brand, isOpen]);

  const handleNameChange = (e) => {
    const name = e.target.value;
    const slug = slugify(name);
    setForm({ ...form, name, slug });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      alert('Vui lòng nhập tên thương hiệu');
      return;
    }
    await onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4">
          {brand ? 'Sửa thương hiệu' : 'Thêm thương hiệu'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên thương hiệu <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={handleNameChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ví dụ: Nike"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Slug (tự động tạo)
            </label>
            <input
              type="text"
              value={form.slug}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logo URL <span className="text-gray-500 text-xs">(PNG, JPG, SVG)</span>
            </label>
            <input
              type="url"
              value={form.logo}
              onChange={(e) => setForm({ ...form, logo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://example.com/logo.png"
            />
            {form.logo && (
              <div className="mt-2">
                <p className="text-xs text-gray-600 mb-1">Xem trước:</p>
                <div className="border border-gray-300 rounded p-2 bg-gray-50">
                  <img
                    src={form.logo}
                    alt="Logo preview"
                    className="max-w-full h-20 object-contain mx-auto"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      if (parent && !parent.querySelector('.error-message')) {
                        const errorMsg = document.createElement('p');
                        errorMsg.className = 'error-message text-xs text-red-500 text-center';
                        errorMsg.textContent = 'Không thể tải ảnh. Vui lòng kiểm tra URL.';
                        parent.appendChild(errorMsg);
                      }
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Mô tả về thương hiệu..."
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={loading}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Đang lưu...' : brand ? 'Cập nhật' : 'Lưu'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Toast notification component
function Toast({ message, type = 'success', onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${
      type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
    }`}>
      <span>{type === 'success' ? '✅' : '❌'}</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-80">×</button>
    </div>
  );
}

export default function ProductCatalog() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('subcategories');
  const [toast, setToast] = useState(null);
  
  // Subcategories state
  const [selectedParent, setSelectedParent] = useState('quan');
  const [selectedGender, setSelectedGender] = useState('nam');
  const [subcategories, setSubcategories] = useState([]);
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);
  const [subcategoryModalOpen, setSubcategoryModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [subcategorySaving, setSubcategorySaving] = useState(false);

  // Brands state
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [brandModalOpen, setBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [brandSaving, setBrandSaving] = useState(false);

  // Load subcategories
  const loadSubcategories = async () => {
    setSubcategoriesLoading(true);
    try {
      const { data } = await api.get(`/admin/subcategories?parent=${selectedParent}&gender=${selectedGender}`);
      setSubcategories(data.subcategories || []);
    } catch (e) {
      const error = extractError(e);
      // Chỉ hiển thị toast nếu không phải lỗi 401 (401 sẽ được xử lý bởi interceptor)
      if (error.status !== 401) {
        setToast({ message: error.message, type: 'error' });
      }
      setSubcategories([]);
    } finally {
      setSubcategoriesLoading(false);
    }
  };

  // Load brands
  const loadBrands = async () => {
    setBrandsLoading(true);
    try {
      const { data } = await api.get('/admin/brands');
      setBrands(data.brands || []);
    } catch (e) {
      const error = extractError(e);
      // Chỉ hiển thị toast nếu không phải lỗi 401 (401 sẽ được xử lý bởi interceptor)
      if (error.status !== 401) {
        setToast({ message: error.message, type: 'error' });
      }
      setBrands([]);
    } finally {
      setBrandsLoading(false);
    }
  };

  useEffect(() => {
    // Chỉ load data khi đã có user đăng nhập
    if (!user) return;
    
    if (activeTab === 'subcategories') {
      loadSubcategories();
    } else {
      loadBrands();
    }
  }, [activeTab, selectedParent, selectedGender, user]);

  // Subcategory handlers
  const handleAddSubcategory = () => {
    setEditingSubcategory(null);
    setSubcategoryModalOpen(true);
  };

  const handleEditSubcategory = (subcategory) => {
    setEditingSubcategory(subcategory);
    setSubcategoryModalOpen(true);
  };

  const handleSubcategorySubmit = async (formData) => {
    setSubcategorySaving(true);
    try {
      if (editingSubcategory) {
        await api.patch(`/admin/subcategories/${editingSubcategory._id}`, formData);
        setToast({ message: '✅ Cập nhật danh mục chi tiết thành công!', type: 'success' });
      } else {
        await api.post('/admin/subcategories', formData);
        setToast({ message: '✅ Thêm danh mục chi tiết thành công!', type: 'success' });
      }
      setSubcategoryModalOpen(false);
      setEditingSubcategory(null);
      await loadSubcategories();
    } catch (e) {
      setToast({ message: '❌ ' + extractError(e).message, type: 'error' });
    } finally {
      setSubcategorySaving(false);
    }
  };

  const handleDeleteSubcategory = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa danh mục chi tiết này?')) return;
    try {
      await api.delete(`/admin/subcategories/${id}`);
      setToast({ message: '✅ Xóa danh mục chi tiết thành công!', type: 'success' });
      await loadSubcategories();
    } catch (e) {
      setToast({ message: '❌ ' + extractError(e).message, type: 'error' });
    }
  };

  // Brand handlers
  const handleAddBrand = () => {
    setEditingBrand(null);
    setBrandModalOpen(true);
  };

  const handleEditBrand = (brand) => {
    setEditingBrand(brand);
    setBrandModalOpen(true);
  };

  const handleBrandSubmit = async (formData) => {
    setBrandSaving(true);
    try {
      if (editingBrand) {
        await api.patch(`/admin/brands/${editingBrand._id}`, formData);
        setToast({ message: '✅ Cập nhật thương hiệu thành công!', type: 'success' });
      } else {
        await api.post('/admin/brands', formData);
        setToast({ message: '✅ Thêm thương hiệu thành công!', type: 'success' });
      }
      setBrandModalOpen(false);
      setEditingBrand(null);
      await loadBrands();
    } catch (e) {
      setToast({ message: '❌ ' + extractError(e).message, type: 'error' });
    } finally {
      setBrandSaving(false);
    }
  };

  const handleDeleteBrand = async (id) => {
    if (!confirm('Bạn có chắc chắn muốn xóa thương hiệu này?')) return;
    try {
      await api.delete(`/admin/brands/${id}`);
      setToast({ message: '✅ Xóa thương hiệu thành công!', type: 'success' });
      await loadBrands();
    } catch (e) {
      setToast({ message: '❌ ' + extractError(e).message, type: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Product Catalog</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          <button
            onClick={() => setActiveTab('subcategories')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'subcategories'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Danh mục chi tiết (Subcategory)
          </button>
          <button
            onClick={() => setActiveTab('brands')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'brands'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Thương hiệu (Brand)
          </button>
        </nav>
      </div>

      {/* Tab Content: Subcategories */}
      {activeTab === 'subcategories' && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Chọn danh mục chính:
              </label>
              <select
                value={selectedParent}
                onChange={(e) => setSelectedParent(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {MAIN_CATEGORIES.map((cat) => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700">
                Giới tính:
              </label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="nam">NAM</option>
                <option value="nu">NỮ</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold">
                Danh sách danh mục chi tiết của {MAIN_CATEGORIES.find(c => c.value === selectedParent)?.label} - {selectedGender.toUpperCase()}
              </h2>
              <button
                onClick={handleAddSubcategory}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <span>+</span>
                <span>Thêm danh mục chi tiết</span>
              </button>
            </div>

            {subcategoriesLoading ? (
              <div className="p-8 text-center text-gray-500">Đang tải...</div>
            ) : subcategories.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Chưa có danh mục chi tiết nào. Hãy thêm danh mục đầu tiên!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên danh mục chi tiết
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Slug
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {subcategories.map((sub) => (
                      <tr key={sub._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {sub.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {sub.slug || sub.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditSubcategory(sub)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            ✏️ Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteSubcategory(sub._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            🗑️ Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content: Brands */}
      {activeTab === 'brands' && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Danh sách thương hiệu</h2>
              <button
                onClick={handleAddBrand}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
              >
                <span>+</span>
                <span>Thêm thương hiệu</span>
              </button>
            </div>

            {brandsLoading ? (
              <div className="p-8 text-center text-gray-500">Đang tải...</div>
            ) : brands.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Chưa có thương hiệu nào. Hãy thêm thương hiệu đầu tiên!
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Logo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tên thương hiệu
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Slug
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {brands.map((brand) => (
                      <tr key={brand._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {brand.logo ? (
                            <img
                              src={brand.logo}
                              alt={brand.name}
                              className="w-12 h-12 object-contain"
                              onError={(e) => {
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : null}
                          {!brand.logo && (
                            <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center text-gray-400 text-xs">
                              🖼️
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {brand.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {brand.slug}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditBrand(brand)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            ✏️ Sửa
                          </button>
                          <button
                            onClick={() => handleDeleteBrand(brand._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            🗑️ Xóa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <SubcategoryModal
        isOpen={subcategoryModalOpen}
        onClose={() => {
          setSubcategoryModalOpen(false);
          setEditingSubcategory(null);
        }}
        subcategory={editingSubcategory}
        parent={selectedParent}
        gender={selectedGender}
        onSubmit={handleSubcategorySubmit}
        loading={subcategorySaving}
      />

      <BrandModal
        isOpen={brandModalOpen}
        onClose={() => {
          setBrandModalOpen(false);
          setEditingBrand(null);
        }}
        brand={editingBrand}
        onSubmit={handleBrandSubmit}
        loading={brandSaving}
      />
    </div>
  );
}

