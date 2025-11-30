import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api, { extractError } from '../../services/api';
import { fetchTopCategoriesByGender, fetchSubcategories } from '../../services/category';
import { fetchBrands } from '../../services/brands';

// Predefined categories list
const PREDEFINED_CATEGORIES = [
  { category: 'quan', name: 'QUẦN' },
  { category: 'quan-jean', name: 'QUẦN JEAN' },
  { category: 'quan-short', name: 'QUẦN SHORT' },
  { category: 'quan-dai', name: 'QUẦN DÀI' },
  { category: 'quan-lot', name: 'QUẦN LÓT' },
  { category: 'ao', name: 'ÁO' },
  { category: 'ao-thun', name: 'ÁO THUN' },
  { category: 'ao-so-mi', name: 'ÁO SƠ MI' },
  { category: 'ao-hoodie', name: 'ÁO HOODIE' },
  { category: 'ao-khoac', name: 'ÁO KHOÁC' },
  { category: 'ao-len', name: 'ÁO LEN' },
  { category: 'phu-kien', name: 'PHỤ KIỆN' },
  { category: 'non', name: 'NÓN' },
  { category: 'day-nit', name: 'DÂY NỊT' },
  { category: 'vi', name: 'VÍ' },
  { category: 'tui-deo', name: 'TÚI ĐEO' },
  { category: 'balo', name: 'BALO' },
];

const empty = {
  name:'', sku:'', price:'', salePrice:'',
  gender:'', topCategory:'', subCategory:'',
  categories:[], description:'',
  imagesText:'',
  sizesText:'', colorsText:'',
  status:'active', stock:'0', brand:'',
  specsText:''
};

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
    <span className={`inline-flex items-center px-3 py-1 rounded-lg border text-sm font-medium ${colorClasses[config.color]}`}>
      <span className="mr-2">{config.icon}</span>
      {config.label}
    </span>
  );
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

export default function ProductForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [values, setValues] = useState(empty);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const editing = !!id;
  const [topCats, setTopCats] = useState([]);
  const [subCats, setSubCats] = useState([]);
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


  useEffect(() => {
    if (!editing) return;
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/products/${id}`);
        const p = data.product;
        setValues(v => ({
          ...v,
          name: p.name,
          sku: p.sku || '',
          price: p.price ?? '',
          salePrice: p.salePrice ?? '',
          gender: p.gender || '',
          topCategory: p.topCategory || '',
          subCategory: p.subCategory || '',
          categories: p.categories || [],
          description: p.description ?? '',
          imagesText: (p.images || []).map(i => i.url).join('\n'),
          sizesText: (p.sizes || []).join(','),
          colorsText: (p.colors || []).join(','),
          status: p.status || 'active',
          stock: p.stock ?? 0,
          brand: p.brand || '',
          specsText: (p.specs || []).join('\n')
        }));
        // preload dependent dropdowns
        if (p.gender) {
          const tc = await fetchTopCategoriesByGender(p.gender);
          setTopCats(tc);
        }
        if (p.gender && p.topCategory) {
          const sc = await fetchSubcategories(p.topCategory, p.gender);
          setSubCats(sc);
        }
      } catch (e) { setErr(extractError(e)); }
      finally { setLoading(false); }
    })();
  }, [editing, id]);

  const handleChange = (e) => setValues(v => ({ ...v, [e.target.name]: e.target.value }));

  // Load dropdown data when gender/topCategory changes
  useEffect(() => {
    (async () => {
      if (!values.gender) { setTopCats([]); setSubCats([]); return; }
      const tc = await fetchTopCategoriesByGender(values.gender);
      setTopCats(tc);
      // If current selected topCategory no longer valid -> reset
      if (values.topCategory && !tc.some(c => c.category === values.topCategory)) {
        setValues(v => ({ ...v, topCategory: '', subCategory: '' }));
        setSubCats([]);
        return;
      }
      if (values.topCategory) {
        const sc = await fetchSubcategories(values.topCategory, values.gender);
        setSubCats(sc);
        if (values.subCategory && !sc.some(c => c.category === values.subCategory)) {
          setValues(v => ({ ...v, subCategory: '' }));
        }
      } else {
        setSubCats([]);
        setValues(v => ({ ...v, subCategory: '' }));
      }
    })();
  }, [values.gender, values.topCategory]);

  const submit = async (e) => {
    e.preventDefault(); 
    setErr(null);
    setSaving(true);
    try {
      const payload = {
        name: values.name,
        sku: values.sku || undefined,
        price: Number(values.price) || 0,
        salePrice: values.salePrice ? Number(values.salePrice) : undefined,
        gender: values.gender || undefined,
        topCategory: values.topCategory || undefined,
        subCategory: values.subCategory || undefined,
        categories: values.categories || [],
        brand: values.brand || undefined,
        description: values.description || undefined,
        images: values.imagesText
          ? values.imagesText.split(/\n+/).map(u => ({ url: u.trim() })).filter(Boolean)
          : [],
        sizes: values.sizesText ? values.sizesText.split(',').map(s=>s.trim()).filter(Boolean) : [],
        colors: values.colorsText ? values.colorsText.split(',').map(s=>s.trim()).filter(Boolean) : [],
        specs: values.specsText ? values.specsText.split('\n').map(s=>s.trim()).filter(Boolean) : [],
        status: values.status,
        stock: Number(values.stock || 0)
      };
      if (editing) await api.patch(`/admin/products/${id}`, payload);
      else await api.post(`/admin/products`, payload);
      nav('/admin/products');
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
          <Link 
            to="/admin/products"
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            ← Quay lại
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {editing ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {editing ? 'Cập nhật thông tin sản phẩm' : 'Thêm sản phẩm mới vào danh mục'}
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
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
      <form onSubmit={submit} className="space-y-6">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Field label="Tên sản phẩm" required>
                    <input 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      name="name" 
                      value={values.name} 
                      onChange={handleChange} 
                      placeholder="Nhập tên sản phẩm"
                      required 
                    />
                  </Field>
                </div>
                
                <Field label="SKU" description="Mã sản phẩm duy nhất">
                  <input 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    name="sku" 
                    value={values.sku} 
                    onChange={handleChange}
                    placeholder="SKU-001"
                  />
                </Field>
                

                <Field label="Giá gốc" required>
                  <input 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    type="number" 
                    name="price" 
                    value={values.price} 
                    onChange={handleChange}
                    placeholder="100000"
                    required
                  />
                </Field>
                
                <Field label="Giá khuyến mãi" description="Để trống nếu không có khuyến mãi">
                  <input 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    type="number" 
                    name="salePrice" 
                    value={values.salePrice} 
                    onChange={handleChange}
                    placeholder="80000"
                  />
                </Field>

                {/* Taxonomy selection */}
                <div className="sm:col-span-2 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Field label="Giới tính" required>
                    <select
                      name="gender"
                      value={values.gender}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="nam">Nam</option>
                      <option value="nu">Nữ</option>
                      <option value="">Unisex</option>
                    </select>
                  </Field>
                  <Field label="Danh mục">
                    <select
                      name="topCategory"
                      value={values.topCategory}
                      onChange={handleChange}
                      disabled={!values.gender}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    >
                      <option value="">Chọn danh mục</option>
                      {topCats.map(c => (
                        <option key={`${c.category}-${c.gender}`} value={c.category}>{c.name}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Danh mục chi tiết">
                    <select
                      name="subCategory"
                      value={values.subCategory}
                      onChange={handleChange}
                      disabled={!values.gender || !values.topCategory || subCats.length === 0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-50"
                    >
                      <option value="">{subCats.length ? 'Chọn danh mục chi tiết' : 'Không có danh mục chi tiết'}</option>
                      {subCats.map(c => (
                        <option key={`${c.category}-${c.gender}`} value={c.category}>{c.name}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                {/* Brand selection */}
                <div className="sm:col-span-2">
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
                </div>

                {/* Preview */}
                {(values.gender && values.topCategory) && (
                  <div className="sm:col-span-2 bg-gray-50 rounded-md p-3 text-sm text-gray-700">
                    <div>✅ Đã chọn: {values.gender === 'nam' ? 'Nam' : values.gender === 'nu' ? 'Nữ' : 'Unisex'} → {topCats.find(c=>c.category===values.topCategory)?.name || values.topCategory} → {subCats.find(c=>c.category===values.subCategory)?.name || values.subCategory || '—'}</div>
                    <div className="mt-1">Slug: {values.subCategory && values.gender ? `${values.subCategory}-${values.gender}` : '—'}</div>
                  </div>
                )}

                <div className="sm:col-span-2">
                  <Field label="Mô tả sản phẩm">
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                      name="description" 
                      value={values.description} 
                      onChange={handleChange}
                      rows={4}
                      placeholder="Mô tả chi tiết về sản phẩm..."
                    />
                  </Field>
                </div>

                <div className="sm:col-span-2">
                  <Field label="Thông số & chất liệu" description="Mỗi dòng một thông tin. Giữ nguyên cách xuống dòng khi nhập.">
                    <textarea 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm" 
                      name="specsText" 
                      value={values.specsText} 
                      onChange={handleChange}
                      rows={8}
                      placeholder={`Ví dụ:
Chất liệu: 94% Cotton, 6% Spandex
Cổ bẻ, tay ngắn
Hoạ tiết: Trơn một màu
Logo: Chi tiết logo may kèm bên trong áo
Phom áo: Regular fit thoải mái`}
                    />
                  </Field>
                </div>
              </div>
            </div>

            {/* Media */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Hình ảnh sản phẩm</h2>
              <Field 
                label="URL hình ảnh (mỗi dòng một ảnh)" 
                description="Ảnh đầu tiên sẽ là ảnh chính của sản phẩm"
              >
                <textarea 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                  name="imagesText" 
                  placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg" 
                  value={values.imagesText} 
                  onChange={handleChange}
                  rows={4}
                />
              </Field>
            </div>

            {/* Attributes */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Thuộc tính sản phẩm</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Kích thước" description="Phân cách bằng dấu phẩy">
                  <input 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    name="sizesText" 
                    placeholder="S, M, L, XL" 
                    value={values.sizesText} 
                    onChange={handleChange} 
                  />
                </Field>
                
                <Field label="Màu sắc" description="Phân cách bằng dấu phẩy">
                  <input 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    name="colorsText" 
                    placeholder="Đen, Trắng, Xanh" 
                    value={values.colorsText} 
                    onChange={handleChange} 
                  />
                </Field>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Product Status */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Trạng thái sản phẩm</h2>
              <div className="space-y-4">
                <Field label="Trạng thái">
                  <select 
                    name="status" 
                    value={values.status} 
                    onChange={handleChange} 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="active">✅ Hoạt động</option>
                    <option value="draft">📝 Bản nháp</option>
                    <option value="archived">📦 Lưu trữ</option>
                  </select>
                </Field>
                
                <div className="bg-gray-50 rounded-md p-3">
                  <div className="text-sm font-medium text-gray-700 mb-1">Hiển thị</div>
                  <div className="text-sm text-gray-600">Sản phẩm sẽ hiển thị trên website</div>
                </div>
              </div>
            </div>

            {/* Inventory */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Quản lý kho</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                  <span className="text-sm font-medium text-gray-700">Quản lý tồn kho</span>
                  <span className="text-sm text-green-600">✓ Bật</span>
                </div>
                
                <Field label="Số lượng tồn kho">
                  <input 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500" 
                    type="number" 
                    name="stock" 
                    value={values.stock} 
                    onChange={handleChange}
                    placeholder="0"
                    min="0"
                  />
                </Field>
                
                <div className="bg-blue-50 rounded-md p-3">
                  <div className="text-sm font-medium text-blue-800 mb-1">💡 Lưu ý</div>
                  <div className="text-xs text-blue-700">
                    Sản phẩm sẽ hiển thị "Hết hàng" khi số lượng = 0
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-6 border-t border-gray-200">
          <Link
            to="/admin/products"
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
              editing ? 'Cập nhật sản phẩm' : 'Tạo sản phẩm'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}