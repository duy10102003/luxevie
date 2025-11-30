import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getAdminBrandSection, createAdminBrandSection, updateAdminBrandSection } from '../../services/adminBrandSections';
import { listAdminProducts } from '../../services/adminProducts';
import { extractError } from '../../services/api';
import { fetchBrands } from '../../services/brands';

const empty = {
  sectionName: '',
  brand: '',
  bannerImage: '',
  productIds: [],
  order: 0,
  status: 'active'
};

function Field({ label, children, required, description }) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {description && (
        <p className="text-xs text-gray-500">{description}</p>
      )}
    </div>
  );
}

export default function BrandSectionForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [values, setValues] = useState(empty);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const editing = !!id;
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [brands, setBrands] = useState([]); // Brands từ API

  // Load brands từ API
  useEffect(() => {
    async function loadBrands() {
      try {
        const data = await fetchBrands();
        // Convert to array of brand names
        setBrands(data.map(b => b.name));
      } catch (error) {
        console.error('Error loading brands:', error);
        setBrands([]);
      }
    }
    loadBrands();
  }, []);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showProductPicker, setShowProductPicker] = useState(false);
  const [pickingSlot, setPickingSlot] = useState(null); // 0, 1, or 2

  // Auto suggest section name based on brand
  useEffect(() => {
    if (values.brand) {
      const brandName = values.brand.toUpperCase();
      const suggestions = {
        'NIKE': 'NIKE STREET STYLE',
        'FILA': 'FILA ECHAPPE COLLECTION',
        'MLB': 'MLB STREET STYLE',
        'CONVERSE': 'CONVERSE CLASSIC COLLECTION',
        'BEVERLY HILLS POLO CLUB': 'BEVERLY HILLS POLO CLUB PREMIUM',
        'HAVAIANAS': 'HAVAIANAS SUMMER COLLECTION',
        'GIGI': 'GIGI FASHION',
        'PEDRO': 'PEDRO COLLECTION'
      };
      const suggested = suggestions[brandName] || `${brandName} COLLECTION`;
      if (!values.sectionName || values.sectionName === '') {
        setValues(prev => ({ ...prev, sectionName: suggested }));
      }
    }
  }, [values.brand]);

  // Load existing data when editing
  useEffect(() => {
    if (!editing) return;
    (async () => {
      setLoading(true);
      try {
        const { item } = await getAdminBrandSection(id);
        setValues({
          sectionName: item.sectionName || '',
          brand: item.brand || '',
          bannerImage: item.bannerImage || '',
          productIds: item.productIds?.map(p => p._id || p) || [],
          order: item.order || 0,
          status: item.status || 'active'
        });
      } catch (e) {
        setErr(extractError(e));
      } finally {
        setLoading(false);
      }
    })();
  }, [editing, id]);

  // Load products when brand is selected
  useEffect(() => {
    if (!values.brand) {
      setProducts([]);
      return;
    }
    (async () => {
      setLoadingProducts(true);
      try {
        const { items } = await listAdminProducts({ brand: values.brand, limit: 100 });
        setProducts(items || []);
      } catch (e) {
        console.error('Error loading products:', e);
      } finally {
        setLoadingProducts(false);
      }
    })();
  }, [values.brand]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setValues(v => ({
      ...v,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const toggleProduct = (productId) => {
    setValues(v => {
      const current = v.productIds || [];
      if (current.includes(productId)) {
        return { ...v, productIds: current.filter(id => id !== productId) };
      } else if (current.length < 8) {
        return { ...v, productIds: [...current, productId] };
      } else {
        alert('Tối đa 8 sản phẩm được chọn');
        return v;
      }
    });
  };

  const selectProductForSlot = (productId) => {
    if (pickingSlot === null) return;
    const newProductIds = [...values.productIds];
    newProductIds[pickingSlot] = productId;
    // Remove duplicates and limit to 8
    const unique = Array.from(new Set(newProductIds.filter(Boolean)));
    setValues(v => ({ ...v, productIds: unique.slice(0, 8) }));
    setShowProductPicker(false);
    setPickingSlot(null);
  };

  const removeProductFromSlot = (index) => {
    const newProductIds = values.productIds.filter((_, i) => i !== index);
    setValues(v => ({ ...v, productIds: newProductIds }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setErr(null);
    setSaving(true);
    try {
      const payload = {
        sectionName: values.sectionName.trim(),
        brand: values.brand,
        bannerImage: values.bannerImage.trim(),
        productIds: values.productIds,
        order: Number(values.order) || 0,
        status: values.status
      };

      if (editing) {
        await updateAdminBrandSection(id, payload);
      } else {
        await createAdminBrandSection(payload);
      }
      nav('/admin/brand-sections');
    } catch (e) {
      setErr(extractError(e));
    } finally {
      setSaving(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name?.toLowerCase().includes(productSearch.toLowerCase())
  );

  const selectedProducts = products.filter(p => values.productIds.includes(p._id));

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
          <Link
            to="/admin/brand-sections"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            ← Quay lại
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {editing ? 'Chỉnh sửa thương hiệu nổi bật' : 'Thêm thương hiệu nổi bật'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {editing ? 'Cập nhật thông tin phần thương hiệu' : 'Tạo phần thương hiệu mới hiển thị trên trang chủ'}
            </p>
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

      {/* Form */}
      <form onSubmit={submit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
              <div className="space-y-4">
                <Field label="Tên phần" required>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    name="sectionName"
                    value={values.sectionName}
                    onChange={handleChange}
                    placeholder="DICKIES X THRASHER"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Tiêu đề hiển thị trên frontend (tự động gợi ý theo brand)</p>
                </Field>

                <Field label="Thương hiệu" required>
                  <select
                    name="brand"
                    value={values.brand}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  >
                    <option value="">Chọn thương hiệu</option>
                    {brands.length === 0 ? (
                      <option disabled>Đang tải thương hiệu...</option>
                    ) : (
                      brands.map(brand => (
                      <option key={brand} value={brand}>{brand}</option>
                    ))
                    )}
                  </select>
                </Field>

                <Field label="Ảnh banner chính" required>
                  <input
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    name="bannerImage"
                    value={values.bannerImage}
                    onChange={handleChange}
                    placeholder="https://example.com/banner.jpg"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">URL ảnh banner hiển thị bên trái</p>
                  {values.bannerImage && (
                    <div className="mt-3">
                      <img
                        src={values.bannerImage}
                        alt="Banner preview"
                        className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+URL';
                        }}
                      />
                    </div>
                  )}
                </Field>

                <div className="grid grid-cols-2 gap-4">
                  <Field label="Thứ tự hiển thị">
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      name="order"
                      value={values.order}
                      onChange={handleChange}
                      min="0"
                    />
                    <p className="text-xs text-gray-500 mt-1">Số nhỏ hơn hiển thị trước</p>
                  </Field>

                  <Field label="Trạng thái">
                    <select
                      name="status"
                      value={values.status}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="active">Kích hoạt</option>
                      <option value="inactive">Ẩn</option>
                    </select>
                  </Field>
                </div>
              </div>
            </div>

            {/* Product Selection */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Chọn sản phẩm hiển thị (tối đa 8)
              </h2>
              {!values.brand ? (
                <div className="text-sm text-gray-500 bg-gray-50 p-4 rounded-md">
                  Vui lòng chọn thương hiệu trước để tải danh sách sản phẩm
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-4 gap-3 mb-4">
                    {[0, 1, 2, 3, 4, 5, 6, 7].map((index) => {
                      const productId = values.productIds[index];
                      const product = products.find(p => p._id === productId);
                      return (
                        <div key={index} className="border-2 border-dashed border-gray-300 rounded-lg p-3 min-h-[200px] flex flex-col">
                          {product ? (
                            <>
                              <img
                                src={product.images?.[0]?.url || 'https://via.placeholder.com/200'}
                                alt={product.name}
                                className="w-full h-32 object-cover rounded mb-2"
                              />
                              <div className="text-xs font-medium text-gray-900 line-clamp-2 mb-1">
                                {product.name}
                              </div>
                              <div className="text-xs text-gray-600 mb-2">
                                {Number(product.price || 0).toLocaleString()}₫
                              </div>
                              <button
                                type="button"
                                onClick={() => removeProductFromSlot(index)}
                                className="mt-auto text-xs text-red-600 hover:text-red-700"
                              >
                                Xóa
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                setPickingSlot(index);
                                setShowProductPicker(true);
                              }}
                              className="flex-1 flex flex-col items-center justify-center text-gray-400 hover:text-gray-600 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors"
                            >
                              <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                              <span className="text-xs">+ Thêm sản phẩm</span>
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Selected Products Summary */}
                  {selectedProducts.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-blue-900 mb-2">
                        Đã chọn {selectedProducts.length}/8 sản phẩm:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedProducts.map(product => (
                          <span
                            key={product._id}
                            className="inline-flex items-center px-3 py-1 bg-white rounded-full text-xs font-medium text-gray-700"
                          >
                            {product.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Sidebar Preview */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
              {values.sectionName && values.bannerImage ? (
                <div className="space-y-3">
                  <div className="text-sm font-medium text-gray-700">{values.sectionName}</div>
                  <img
                    src={values.bannerImage}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/400x200?text=Invalid+URL';
                    }}
                  />
                  <div className="text-xs text-gray-500">
                    Brand: {values.brand || '—'}
                  </div>
                  <div className="text-xs text-gray-500">
                    Sản phẩm: {selectedProducts.length}/8
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500 text-center py-8">
                  Nhập thông tin để xem preview
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Product Picker Modal */}
        {showProductPicker && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => {
            setShowProductPicker(false);
            setPickingSlot(null);
          }}>
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden flex flex-col" onClick={(e) => e.stopPropagation()}>
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Chọn sản phẩm</h3>
                <button
                  type="button"
                  onClick={() => {
                    setShowProductPicker(false);
                    setPickingSlot(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4 border-b border-gray-200">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                {loadingProducts ? (
                  <div className="text-center py-8 text-gray-500">Đang tải sản phẩm...</div>
                ) : filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredProducts.map(product => (
                      <button
                        key={product._id}
                        type="button"
                        onClick={() => selectProductForSlot(product._id)}
                        className="border-2 border-gray-200 rounded-lg p-3 hover:border-blue-500 transition-colors text-left"
                      >
                        <img
                          src={product.images?.[0]?.url || 'https://via.placeholder.com/200'}
                          alt={product.name}
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                        <div className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-600">
                          {Number(product.price || 0).toLocaleString()}₫
                        </div>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    {values.brand ? 'Không có sản phẩm nào cho thương hiệu này' : 'Vui lòng chọn thương hiệu trước'}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <Link
            to="/admin/brand-sections"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Hủy
          </Link>
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
              editing ? 'Cập nhật' : 'Lưu'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

