import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Container from "../components/layout/Container";
import ProductGrid from "../components/commerce/ProductGrid";
import { listProducts } from "../services/products";
import { fmt } from "../utils/money";
import { fetchBrands } from "../services/brands";
import { fetchSubcategories } from "../services/category";

const SORTS = [
  { v: "latest", label: "Mới nhất" },
  { v: "price_asc", label: "Giá tăng dần" },
  { v: "price_desc", label: "Giá giảm dần" },
  { v: "sold_desc", label: "Bán chạy" },
];

// Category configurations
const CATEGORY_CONFIGS = {
  ao: {
    title: "ÁO",
    description: "Khám phá bộ sưu tập áo đa dạng với nhiều phong cách",
    subcategories: [
      { label: "Áo Thun", category: "ao-thun" },
      { label: "Áo Sơ Mi", category: "ao-so-mi" },
      { label: "Áo Polo", category: "ao-polo" },
      { label: "ÁO Hoodie", category: "ao-hoodie" },
      { label: "Áo Khoác", category: "ao-khoac" },
    ]
  },
  quan: {
    title: "QUẦN",
    description: "Tìm kiếm quần phù hợp với phong cách của bạn",
    subcategories: [
      { label: "Quần Jean", category: "quan-jean" },
      { label: "Quần Short", category: "quan-short" },
      { label: "Quần Âu", category: "quan-auau" },
      { label: "Quần Jogger", category: "quan-jogger" },
      { label: "Váy", category: "vay" }
    ]
  },
  "phu-kien": {
    title: "PHỤ KIỆN",
    description: "Hoàn thiện phong cách với các phụ kiện thời trang",
    subcategories: [
      { label: "Cà Vạt", category: "ca-vat" },
      { label: "Thắt Lưng", category: "that-lung" },
      { label: "Nón Len", category: "non-len" },
      { label: "Nón Nửa Đầu", category: "non-nua-dau" },
      { label: "Tất", category: "tat" }
    ]
  },
  "giay-dep": {
    title: "GIÀY DÉP",
    description: "Khám phá bộ sưu tập giày dép đa dạng cho mọi phong cách",
    subcategories: [
      { label: "Giày Thể Thao", category: "giay-the-thao" },
      { label: "Giày Tây", category: "giay-tay" },
      { label: "Dép Quai Chéo", category: "dep-quai-cheo" },
      { label: "Dép Kẹp", category: "dep-kep" }
    ]
  },
  "tui-vi": {
    title: "TÚI VÍ",
    description: "Túi xách và ví da cao cấp cho mọi dịp",
    subcategories: [
      { label: "Túi Xách", category: "tui-xach" },
      { label: "Túi Đeo Chéo", category: "tui-deo-cheo" },
      { label: "Balo", category: "balo" },
      { label: "Ví Cầm Tay", category: "vi-cam-tay" }
    ]
  },
  "mat-kinh": {
    title: "MẮT KÍNH",
    description: "Kính mắt thời trang và kính cận chính hãng",
    subcategories: [
      { label: "Gọng Kính Tròn", category: "gong-kinh-tron" },
      { label: "Gọng Kính Vuông", category: "gong-kinh-vuong" },
      { label: "Kính Mát Gọng Oval", category: "kinh-mat-gong-oval" },
      { label: "Kính Mát Gọng Tròn", category: "kinh-mat-gong-tron" },
      { label: "Kính Mát Gọng Vuông", category: "kinh-mat-gong-vuong" },
      { label: "Kính Mát Gọng Mat Meo", category: "kinh-mat-gong-mat-meo" },
      { label: "Kính Râm", category: "kinh-ram" }
    ]
  },
  "dong-ho": {
    title: "ĐỒNG HỒ",
    description: "Đồng hồ đeo tay nam và nữ cao cấp",
    subcategories: [
      { label: "Đồng Hồ Pin", category: "dong-ho-pin" },
      { label: "Đồng Hồ Automatic", category: "dong-ho-automatic" },
      { label: "Đồng Hồ THÔNG MINH", category: "dong-ho-thong-minh" },
      { label: "Đồng Hồ Điện Tử", category: "dong-ho-dien-tu" }
    ]
  },
  "trang-suc": {
    title: "TRANG SỨC",
    description: "Trang sức và phụ kiện làm đẹp cao cấp",
    subcategories: [
      { label: "Nhẫn", category: "nhan" },
      { label: "Vòng Cổ", category: "vong-co" },
      { label: "Vòng Tay", category: "vong-tay" },
      { label: "Kẹp Cà Vạt", category: "kep-ca-vat" }
    ]
  }
};

export default function CategoryPage({ categoryKey }) {
  const [sp, setSp] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 24, total: 0 });
  const [showSidebar, setShowSidebar] = useState(true);
  const [showCategories, setShowCategories] = useState(false); // Hiển thị/ẩn danh mục
  const [showBrands, setShowBrands] = useState(false); // Hiển thị/ẩn thương hiệu
  const [brands, setBrands] = useState([]); // Brands từ API (array of brand objects)
  const [subcategories, setSubcategories] = useState([]); // Subcategories từ API
  const [subcategoriesLoading, setSubcategoriesLoading] = useState(false);

  // Load brands từ API
  useEffect(() => {
    async function loadBrands() {
      try {
        const data = await fetchBrands();
        // Lưu cả brand objects để có thể hiển thị logo và name
        setBrands(data || []);
      } catch (error) {
        console.error('Error loading brands:', error);
        setBrands([]);
      }
    }
    loadBrands();
  }, []);

  const [priceMinInput, setPriceMinInput] = useState("");
  const [priceMaxInput, setPriceMaxInput] = useState("");

  const config = CATEGORY_CONFIGS[categoryKey];
  if (!config) {
    return <div>Category not found</div>;
  }

  const state = useMemo(() => {
    return {
      q: sp.get("q") || "",
      gender: sp.get("gender") || "",
      subcategory: sp.get("subcategory") || "",
      subcategories: sp.get("subcategories")?.split(",").filter(Boolean) || [],
      brands: sp.get("brands")?.split(",").filter(Boolean) || [],
      priceMin: sp.get("min") || "",
      priceMax: sp.get("max") || "",
      priceQuick: sp.get("priceQuick") || "",
      sort: sp.get("sort") || "latest",
      page: Number(sp.get("page") || 1),
      limit: Number(sp.get("limit") || 24),
    };
  }, [sp]);

  // Load subcategories từ API dựa trên category và gender
  useEffect(() => {
    async function loadSubcategories() {
      if (!categoryKey || !config) return;
      
      setSubcategoriesLoading(true);
      try {
        const parentCategory = categoryKey; // categoryKey là parent (ao, quan, etc.)
        const gender = state.gender || undefined; // 'nam' hoặc 'nu' hoặc undefined
        
        // Fetch subcategories từ API
        const data = await fetchSubcategories(parentCategory, gender);
        
        // Deduplicate by slug (vì cùng một slug có thể có cả nam và nu)
        const subcategoriesMap = new Map();
        data.forEach(subcat => {
          if (!subcategoriesMap.has(subcat.slug)) {
            subcategoriesMap.set(subcat.slug, {
              label: subcat.name,
              category: subcat.slug
            });
          }
        });
        
        // Convert to array
        const formattedSubcategories = Array.from(subcategoriesMap.values());
        
        setSubcategories(formattedSubcategories);
      } catch (error) {
        console.error('Error loading subcategories:', error);
        // Fallback to config subcategories
        setSubcategories(config.subcategories || []);
      } finally {
        setSubcategoriesLoading(false);
      }
    }
    loadSubcategories();
  }, [categoryKey, state.gender, config]);

  // Sync price inputs with URL params
  useEffect(() => {
    if (!state.priceQuick) {
      setPriceMinInput(state.priceMin ? Number(state.priceMin).toLocaleString('vi-VN') : "");
      setPriceMaxInput(state.priceMax ? Number(state.priceMax).toLocaleString('vi-VN') : "");
    } else {
      // When quick selection is active, update inputs to show the range
      setPriceMinInput(state.priceMin ? Number(state.priceMin).toLocaleString('vi-VN') : "");
      setPriceMaxInput(state.priceMax ? Number(state.priceMax).toLocaleString('vi-VN') : "");
    }
  }, [state.priceMin, state.priceMax, state.priceQuick]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        let queryParams = {
          q: state.q || undefined,
          priceMin: state.priceMin || undefined,
          priceMax: state.priceMax || undefined,
          sort: state.sort || undefined,
          page: state.page,
          limit: state.limit,
        };

        // Filter by gender if selected
        if (state.gender) {
          queryParams.gender = state.gender;
        }

        // Filter by parent category (topCategory)
        queryParams.topCategory = categoryKey;

        // Filter by subcategories if selected
        if (state.subcategories.length > 0 && !state.subcategory) {
          // Multiple subcategories selected - use categories param
          queryParams.categories = state.subcategories.join(',');
        } else if (state.subcategory) {
          // Single subcategory selected
          queryParams.category = state.subcategory;
        }

        // Filter by brands if selected
        if (state.brands.length > 0) {
          queryParams.brand = state.brands.join(',');
        }

        const { items, pagination } = await listProducts(queryParams);
        if (!alive) return;
        setItems(items || []);
        setPagination(pagination || { page: 1, limit: state.limit, total: items?.length || 0 });
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [state.q, state.gender, state.subcategory, state.subcategories, state.brands, state.priceMin, state.priceMax, state.sort, state.page, state.limit, categoryKey]);

  function patch(params) {
    const next = new URLSearchParams(sp);
    Object.entries(params).forEach(([k, v]) => {
      if (v === null || v === undefined || v === "") next.delete(k);
      else next.set(k, String(v));
    });
    // reset page khi đổi filter/sort
    if (params.subcategory !== undefined || params.subcategories !== undefined || params.gender !== undefined || params.brands !== undefined || params.min !== undefined || params.max !== undefined || params.sort !== undefined) {
      next.set("page", "1");
    }
    setSp(next, { replace: true });
  }

  function toggleSubcategory(category) {
    const current = state.subcategories;
    const newSubcategories = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    
    patch({ subcategories: newSubcategories.length > 0 ? newSubcategories.join(',') : null });
  }

  function toggleBrand(brandName) {
    const current = state.brands;
    const newBrands = current.includes(brandName)
      ? current.filter(b => b !== brandName)
      : [...current, brandName];
    
    patch({ brands: newBrands.length > 0 ? newBrands.join(',') : null });
  }

  function clearFilters() {
    const next = new URLSearchParams(sp);
    ['gender', 'subcategory', 'subcategories', 'brands', 'min', 'max', 'priceQuick', 'page'].forEach(k => next.delete(k));
    setPriceMinInput("");
    setPriceMaxInput("");
    setSp(next, { replace: true });
  }

  // Use subcategories from API, fallback to config if not loaded
  // Deduplicate once more by slug to be safe (in case of any edge cases)
  const subcategoriesMap = new Map();
  const availableSubcategories = subcategories.length > 0 ? subcategories : (config?.subcategories || []);
  availableSubcategories.forEach(sub => {
    if (!subcategoriesMap.has(sub.category)) {
      subcategoriesMap.set(sub.category, sub);
    }
  });
  const uniqueSubcategories = Array.from(subcategoriesMap.values());
  
  const filteredSubcategories = uniqueSubcategories;
  const filteredBrands = brands;

  const hasActiveFilters = state.gender || state.subcategory || state.subcategories.length > 0 || state.brands.length > 0 || state.priceMin || state.priceMax || state.priceQuick;

  const categoryDisplayName = state.gender 
    ? `${config.title} ${state.gender === 'nam' ? 'NAM' : 'NỮ'}` 
    : config.title;

  const totalPages = Math.max(1, Math.ceil((pagination.total || 0) / state.limit));

  return (
    <Container className="py-6">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:text-gray-700">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{categoryDisplayName}</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Sidebar - Bộ lọc */}
        {showSidebar && (
          <aside className="lg:col-span-3">
            <div className="sticky top-6 rounded-xl border border-gray-200 bg-white shadow-lg p-5 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-gray-200 pb-3">
                <h2 className="font-bold text-xl text-gray-900 flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                  </svg>
                  Bộ lọc
                </h2>
                {hasActiveFilters && (
                  <button
                    onClick={clearFilters}
                    className="text-xs text-blue-600 hover:text-blue-700 font-medium transition-colors"
                  >
                    Xóa tất cả
                  </button>
                )}
              </div>
              
              {/* Gender Filter */}
              <div className="pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">Giới tính</h3>
                </div>
                <div className="flex gap-3">
            <button
                    onClick={() => patch({ gender: state.gender === 'nam' ? null : 'nam' })}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      state.gender === 'nam'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-200 scale-105'
                        : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    Nam
            </button>
              <button
                    onClick={() => patch({ gender: state.gender === 'nu' ? null : 'nu' })}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      state.gender === 'nu'
                        ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md shadow-pink-200 scale-105'
                        : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                    }`}
                  >
                    Nữ
                  </button>
                </div>
              </div>

              {/* Brand Filter */}
              <div className="pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                    <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">Thương hiệu</h3>
                  </div>
                  <button
                    onClick={() => setShowBrands(!showBrands)}
                    className="text-gray-600 hover:text-gray-900 font-bold text-lg w-6 h-6 flex items-center justify-center"
                  >
                    {showBrands ? '−' : '+'}
                  </button>
                </div>
                {showBrands && (
                  <div className="space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                  {filteredBrands.map((brand) => {
                    const brandName = brand.name || brand;
                    const isChecked = state.brands.includes(brandName);
                    return (
                      <label
                        key={brand._id || brand.slug || brandName}
                        className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all duration-150 ${
                          isChecked 
                            ? 'bg-blue-50 border-2 border-blue-200' 
                            : 'bg-white border-2 border-transparent hover:bg-gray-50 hover:border-gray-200'
                        }`}
                      >
                        {brand.logo && (
                          <img 
                            src={brand.logo} 
                            alt={brandName}
                            className="w-6 h-6 object-contain"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        )}
                        <div className="relative flex items-center">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => toggleBrand(brandName)}
                            className="w-5 h-5 text-blue-600 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                          />
                        </div>
                        <span className={`text-sm font-semibold flex-1 uppercase ${
                          isChecked ? 'text-blue-900' : 'text-gray-900'
                        }`} style={{ fontSize: '14px', lineHeight: '1.4' }}>
                          {brandName}
                        </span>
                        {isChecked && (
                          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        )}
                      </label>
                    );
                  })}
                  </div>
                )}
              </div>

              {/* Category Filter */}
              <div className="pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">Danh mục</h3>
                  </div>
                  <button
                    onClick={() => setShowCategories(!showCategories)}
                    className="text-gray-600 hover:text-gray-900 font-bold text-lg w-6 h-6 flex items-center justify-center"
                  >
                    {showCategories ? '−' : '+'}
                  </button>
                </div>
                {showCategories && (
                  <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                  {subcategoriesLoading ? (
                    <div className="text-center py-4 text-gray-500 text-sm">Đang tải danh mục...</div>
                  ) : filteredSubcategories.length === 0 ? (
                    <div className="text-center py-4 text-gray-500 text-sm">Chưa có danh mục nào</div>
                  ) : (
                    filteredSubcategories.map((sub) => {
                      const isChecked = state.subcategories.includes(sub.category) || state.subcategory === sub.category;
                      return (
                        <label
                          key={sub.category}
                          className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all duration-150 ${
                            isChecked 
                              ? 'bg-blue-50 border-2 border-blue-200' 
                              : 'bg-white border-2 border-transparent hover:bg-gray-50 hover:border-gray-200'
                          }`}
                        >
                          <div className="relative flex items-center">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => {
                                if (state.subcategory) {
                                  patch({ subcategory: null, subcategories: [sub.category] });
                                } else {
                                  toggleSubcategory(sub.category);
                                }
                              }}
                              className="w-5 h-5 text-blue-600 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                            />
                          </div>
                          <span className={`text-sm font-medium flex-1 ${
                            isChecked ? 'text-blue-900' : 'text-gray-700'
                          }`}>
                            {sub.label}
                          </span>
                          {isChecked && (
                            <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </label>
                      );
                    })
                  )}
                  </div>
                )}
              </div>

              {/* Price Filter */}
              <div className="pb-2">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">Giá</h3>
                </div>
                
                {/* Custom Price Range Input */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="relative">
            <input
                      type="text"
              placeholder="Từ"
                      value={priceMinInput}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, '');
                        setPriceMinInput(value ? Number(value).toLocaleString('vi-VN') : '');
                        if (state.priceQuick) {
                          patch({ priceQuick: null });
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const numValue = priceMinInput.replace(/[^\d]/g, '');
                          patch({ min: numValue || null, priceQuick: null });
                        }
                      }}
                      onBlur={() => {
                        const numValue = priceMinInput.replace(/[^\d]/g, '');
                        if (numValue || priceMaxInput.replace(/[^\d]/g, '')) {
                          patch({ min: numValue || null, priceQuick: null });
                        }
                      }}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors"
                    />
                  </div>
                  <div className="relative">
            <input
                      type="text"
              placeholder="Đến"
                      value={priceMaxInput}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^\d]/g, '');
                        setPriceMaxInput(value ? Number(value).toLocaleString('vi-VN') : '');
                        if (state.priceQuick) {
                          patch({ priceQuick: null });
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          const numValue = priceMaxInput.replace(/[^\d]/g, '');
                          patch({ max: numValue || null, priceQuick: null });
                        }
                      }}
                      onBlur={() => {
                        const numValue = priceMaxInput.replace(/[^\d]/g, '');
                        if (numValue || priceMinInput.replace(/[^\d]/g, '')) {
                          patch({ max: numValue || null, priceQuick: null });
                        }
                      }}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 hover:bg-white transition-colors"
                    />
                  </div>
                </div>

                {/* Quick Price Selection Radio Buttons */}
                <div className="space-y-1.5">
                  {[
                    { value: "under-1m", label: "Dưới 1,000,000₫", min: null, max: "1000000" },
                    { value: "1m-2m", label: "1,000,000₫ – 2,000,000₫", min: "1000000", max: "2000000" },
                    { value: "2m-3m", label: "2,000,000₫ – 3,000,000₫", min: "2000000", max: "3000000" },
                    { value: "over-4m", label: "Trên 4,000,000₫", min: "4000000", max: null }
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-2 cursor-pointer p-2 rounded-lg transition-all duration-150 ${
                        state.priceQuick === option.value
                          ? 'bg-blue-50 border-2 border-blue-200'
                          : 'bg-white border-2 border-transparent hover:bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <div className="relative flex items-center">
                        <input
                          type="radio"
                          name="priceQuick"
                          checked={state.priceQuick === option.value}
                          onChange={() => {
                            patch({ priceQuick: option.value, min: option.min, max: option.max });
                          }}
                          className="w-5 h-5 text-blue-600 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                        />
                      </div>
                      <span className={`text-sm font-medium flex-1 ${
                        state.priceQuick === option.value ? 'text-blue-900' : 'text-gray-700'
                      }`}>
                        {option.label}
                      </span>
                      {state.priceQuick === option.value && (
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        )}
                      </label>
                    ))}
                  </div>
              </div>
        </div>
      </aside>
        )}

        {/* Main Content */}
        <section className={`${showSidebar ? 'lg:col-span-9' : 'lg:col-span-12'} space-y-4`}>
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 uppercase">{categoryDisplayName}</h1>
            <div className="text-sm text-gray-600 mb-4">
            {pagination.total || 0} sản phẩm
            </div>

            {/* Active Filter Tags */}
            {(state.gender || state.subcategory || state.subcategories.length > 0 || state.brands.length > 0 || state.priceMin || state.priceMax) && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {state.gender && (
                  <button
                    onClick={() => patch({ gender: null })}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-all duration-200"
                  >
                    <span>Giới tính: {state.gender === 'nam' ? 'NAM' : 'NỮ'}</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {state.subcategory && (
                  <button
                    onClick={() => patch({ subcategory: null })}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-all duration-200"
                  >
                    <span>Danh mục: {config.subcategories.find(s => s.category === state.subcategory)?.label}</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                {state.subcategories.map((subcat) => {
                  const subLabel = config.subcategories.find(s => s.category === subcat)?.label;
                  return (
                    <button
                      key={subcat}
                      onClick={() => toggleSubcategory(subcat)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 transition-all duration-200"
                    >
                      <span>Danh mục: {subLabel}</span>
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  );
                })}
                {state.brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => toggleBrand(brand)}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100 transition-all duration-200"
                  >
                    <span>Thương hiệu: {brand.toUpperCase()}</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                ))}
                {(state.priceMin || state.priceMax) && (
                  <button
                    onClick={() => {
                      patch({ min: null, max: null, priceQuick: null });
                      setPriceMinInput("");
                      setPriceMaxInput("");
                    }}
                    className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition-all duration-200"
                  >
                    <span>Giá: {state.priceMin ? fmt(state.priceMin) : '0₫'} – {state.priceMax ? fmt(state.priceMax) : '∞'}</span>
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            )}

            {/* Toolbar */}
            <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg px-4 py-3 shadow-sm">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="font-medium">{pagination.total || 0} sản phẩm</span>
          </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowSidebar(!showSidebar)}
                  className={`p-2 rounded-lg transition-all duration-200 ${
                    showSidebar 
                      ? 'bg-blue-50 text-blue-600 border-2 border-blue-200' 
                      : 'bg-gray-50 text-gray-600 border-2 border-gray-200 hover:bg-gray-100'
                  }`}
                  title={showSidebar ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                  </svg>
            <select
              value={state.sort}
              onChange={(e) => patch({ sort: e.target.value })}
                    className="pl-9 pr-4 py-2 border-2 border-gray-200 rounded-lg text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white hover:border-gray-300 transition-colors cursor-pointer"
            >
                    {SORTS.map(s => (
                      <option key={s.v} value={s.v}>{s.label}</option>
                    ))}
            </select>
                </div>
              </div>
          </div>
        </div>

          {/* Product Grid or Empty State */}
        {loading ? (
            <div className="text-center py-12">
              <div className="text-gray-500">Đang tải…</div>
            </div>
          ) : items.length > 0 ? (
            <>
          <ProductGrid items={items} />
        {/* Pagination */}
        {totalPages > 1 && (
                <div className="pt-6 flex items-center justify-center gap-2">
            <button
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={state.page <= 1}
              onClick={() => patch({ page: state.page - 1 })}
                  >
                    Trước
                  </button>
                  <div className="text-sm text-gray-600 px-4">
                    Trang {state.page}/{totalPages}
                  </div>
            <button
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              disabled={state.page >= totalPages}
              onClick={() => patch({ page: state.page + 1 })}
                  >
                    Sau
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-16">
              <div className="flex justify-center mb-4">
                <svg className="w-24 h-24 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">Không có sản phẩm nào</h3>
              <p className="text-sm text-gray-500">Thử thay đổi bộ lọc để xem thêm sản phẩm.</p>
          </div>
        )}
      </section>
      </div>
    </Container>
  );
}