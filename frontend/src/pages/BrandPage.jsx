import { useEffect, useMemo, useState, useRef } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import Container from "../components/layout/Container";
import ProductGrid from "../components/commerce/ProductGrid";
import { listProducts } from "../services/products";
import { fetchBrands } from "../services/brands";

// Default descriptions for brands (fallback nếu không có trong database)
const BRAND_DESCRIPTIONS = {
  'Beverly Hills Polo Club': 'Beverly Hills Polo Club là một thương hiệu thời trang sáng tạo đến từ Mỹ được thành lập vào năm 1982, các thiết kế được lấy cảm hứng từ niềm kiêu hãnh của bộ môn thể thao di sản polo (mã cầu), nổi bật bởi sự pha trộn hài hòa vừa năng động, phóng khoáng lại vừa thanh lịch, đẳng cấp. Thương hiệu đã phát triển mạnh mẽ trên toàn thế giới và trở thành biểu tượng của phong cách sống cao cấp.',
  'FILA': 'FILA là thương hiệu thể thao hàng đầu đến từ Ý, được thành lập năm 1911. Với hơn 110 năm lịch sử, FILA đã trở thành biểu tượng của sự năng động, tự tin và phong cách thể thao đẳng cấp quốc tế.',
  'Converse': 'Converse là thương hiệu giày thể thao huyền thoại của Mỹ, được thành lập năm 1908. Converse nổi tiếng với những đôi giày cổ điển, mang tính biểu tượng và phong cách đường phố thời thượng.',
  'Havaianas': 'Havaianas là thương hiệu dép xỏ ngón nổi tiếng đến từ Brazil, được thành lập năm 1962. Havaianas nổi tiếng với chất lượng cao, thiết kế đầy màu sắc và phong cách sống biển.',
  'Gigi': 'Gigi là thương hiệu thời trang cao cấp với những thiết kế tinh tế, hiện đại và thanh lịch.',
  'MLB': 'MLB là thương hiệu streetwear chính thức của Major League Baseball, kết hợp phong cách thể thao và đường phố hiện đại.',
  'Nike': 'Nike là thương hiệu thể thao hàng đầu thế giới, với sứ mệnh mang đến cảm hứng và đổi mới cho mọi vận động viên trên toàn thế giới.',
  'Pedro': 'Pedro là thương hiệu giày và phụ kiện thời trang đến từ Singapore, nổi tiếng với thiết kế hiện đại và chất lượng cao.',
};

const SORTS = [
  { v: "latest", label: "Mới nhất" },
  { v: "priceAsc", label: "Giá tăng dần" },
  { v: "priceDesc", label: "Giá giảm dần" },
  { v: "best", label: "Bán chạy" },
];

// Top categories to exclude - only show subcategories (detailed categories)
const TOP_CATEGORIES = [
  'ao', 'quan', 'giay-dep', 'giay dep', 'tui-vi', 'tui vi',
  'mat-kinh', 'mat kinh', 'dong-ho', 'dong ho', 
  'phu-kien', 'phu kien', 'trang-suc', 'trang suc',
  'ÁO', 'QUẦN', 'GIÀY DÉP', 'TÚI VÍ',
  'MẮT KÍNH', 'ĐỒNG HỒ', 'PHỤ KIỆN', 'TRANG SỨC',
  'Ao', 'Quan', 'Giay Dep', 'Tui Vi',
  'Mat Kinh', 'Dong Ho', 'Phu Kien', 'Trang Suc',
  'nam', 'nu', 'NAM', 'NU', 'Nam', 'Nu'
];

// Helper function to normalize category name
// Removes gender suffix and capitalizes first letter of each word
function normalizeCategory(category) {
  if (!category) return '';
  let normalized = category.trim();
  
  // Remove gender suffixes: -nam, -nu, -nam-nu, nam, nu
  normalized = normalized
    .replace(/-nam-nu$/i, '')
    .replace(/-nam$/i, '')
    .replace(/-nu$/i, '')
    .replace(/\s+nam$/i, '')
    .replace(/\s+nu$/i, '')
    .replace(/^nam-/i, '')
    .replace(/^nu-/i, '')
    .trim();
  
  // Capitalize first letter of each word
  return normalized
    .split(/[\s-–—]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Helper function to check if a category should be excluded
// Returns true if it should be excluded (top category or just gender)
function shouldExcludeCategory(category) {
  if (!category) return true;
  const catLower = category.toLowerCase().trim();
  
  // Exclude if it's just "NAM" or "NU"
  if (catLower === 'nam' || catLower === 'nu') {
    return true;
  }
  
  // Check for exact match with top categories
  const isExactMatch = TOP_CATEGORIES.some(topCat => {
    const topCatLower = topCat.toLowerCase().trim();
    return topCatLower === catLower;
  });
  
  if (isExactMatch) return true;
  
  // Check if it's a single word that matches a top category
  const words = catLower.split(/[\s-–—]+/).filter(w => w.length > 0 && w !== 'nam' && w !== 'nu');
  
  if (words.length === 1) {
    return TOP_CATEGORIES.some(topCat => {
      const topWords = topCat.toLowerCase().trim().split(/[\s-–—]+/);
      return topWords.includes(words[0]);
    });
  }
  
  return false;
}

export default function BrandPage() {
  const { brandName } = useParams();
  const [sp, setSp] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 24, total: 0 });
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showFilterSidebar, setShowFilterSidebar] = useState(true);
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [showBrands, setShowBrands] = useState(false); // Hiển thị/ẩn thương hiệu
  const [showSubcategories, setShowSubcategories] = useState(false); // Hiển thị/ẩn danh mục
  const [priceMinInput, setPriceMinInput] = useState("");
  const [priceMaxInput, setPriceMaxInput] = useState("");
  const [allBrands, setAllBrands] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [categoryMapping, setCategoryMapping] = useState({}); // Map normalized -> original categories
  const filterRef = useRef(null);
  const sortRef = useRef(null);

  // Load brands từ API
  useEffect(() => {
    async function loadBrands() {
      try {
        const data = await fetchBrands();
        setAllBrands(data);
      } catch (error) {
        console.error('Error loading brands:', error);
        setAllBrands([]);
      }
    }
    loadBrands();
  }, []);

  // Find brand from URL
  const brand = useMemo(() => {
    const decodedName = decodeURIComponent(brandName || '');
    return allBrands.find(b => 
      b.name === decodedName || 
      b.slug === decodedName ||
      b._id === decodedName
    ) || (allBrands.length > 0 ? allBrands[0] : null);
  }, [brandName, allBrands]);

  const state = useMemo(() => {
    return {
      gender: sp.get("gender") || "",
      subCategory: sp.get("sub") || "",
      q: sp.get("q") || "",
      brandSearch: sp.get("brandSearch") || "",
      productSearch: sp.get("productSearch") || "",
      sort: sp.get("sort") || "latest",
      page: Number(sp.get("page") || 1),
      limit: Number(sp.get("limit") || 24),
      priceMin: sp.get("min") || "",
      priceMax: sp.get("max") || "",
      priceQuick: sp.get("priceQuick") || "",
    };
  }, [sp]);

  // Fetch facets (subcategories) for this brand - only once when brand changes
  useEffect(() => {
    if (!brand) return;
    let alive = true;
    (async () => {
      try {
        // Fetch facets without filters to get all available subcategories for this brand
        const facetParams = {
          brand: brand.name,
          limit: 1, // Just need facets, not products
        };

        const { facets } = await listProducts(facetParams);
        
        if (!alive) return;

        // Extract subcategories from facets and create mapping
        if (facets?.byCategory) {
          const mapping = {}; // normalized -> original category
          const processedCats = [];
          
          facets.byCategory
            .map(c => c._id)
            .filter(Boolean)
            .filter(cat => !shouldExcludeCategory(cat)) // Filter out top categories and gender-only
            .forEach(originalCat => {
              const normalized = normalizeCategory(originalCat);
              if (normalized.length > 0) {
                // Store mapping: normalized -> original (prefer one without gender suffix)
                if (!mapping[normalized]) {
                  mapping[normalized] = originalCat;
                  processedCats.push(normalized);
                } else {
                  // If multiple originals map to same normalized, prefer one without gender suffix
                  if (!originalCat.toLowerCase().includes('-nam') && 
                      !originalCat.toLowerCase().includes('-nu')) {
                    mapping[normalized] = originalCat;
                  }
                }
              }
            });
          
          // Remove duplicates and sort
          const uniqueCats = [...new Set(processedCats)].sort();
          setSubcategories(uniqueCats);
          setCategoryMapping(mapping);
        }

        // Không ghi đè allBrands từ facets vì facets chỉ có _id (tên brand)
        // Giữ nguyên allBrands từ API để có logo và description đầy đủ
        // Nếu cần, có thể filter allBrands dựa trên facets.byBrand sau
      } catch (error) {
        console.error('Error fetching facets:', error);
      }
    })();
    return () => { alive = false; };
  }, [brand?.name]); // Only fetch when brand changes

  // Fetch products with current filters
  useEffect(() => {
    if (!brand) return;
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        // Convert normalized category back to original for API
        const originalCategory = state.subCategory && categoryMapping[state.subCategory] 
          ? categoryMapping[state.subCategory] 
          : state.subCategory;
        
        // Convert gender display name to API format
        const apiGender = state.gender === 'Nam' ? 'nam' : 
                         state.gender === 'Nữ' ? 'nu' : 
                         state.gender || undefined;

        const queryParams = {
          brand: brand.name,
          q: state.q || undefined,
          gender: apiGender,
          categories: originalCategory || undefined,
          sort: state.sort || undefined,
          page: state.page,
          limit: state.limit,
          min: state.priceMin || undefined,
          max: state.priceMax || undefined,
        };

        const { items: products, pagination: pg } = await listProducts(queryParams);
        
        if (!alive) return;
        setItems(products || []);
        setPagination(pg || { page: 1, limit: state.limit, total: 0 });
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [brand?.name, state.gender, state.subCategory, state.q, state.sort, state.page, state.limit, state.priceMin, state.priceMax, categoryMapping]);

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSortDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  function patch(params) {
    const next = new URLSearchParams(sp);
    Object.entries(params).forEach(([k, v]) => {
      if (v === null || v === undefined || v === "") next.delete(k);
      else next.set(k, String(v));
    });
    if (params.gender !== undefined || params.sub !== undefined || params.sort !== undefined || params.min !== undefined || params.max !== undefined || params.priceQuick !== undefined) {
      next.set("page", "1");
    }
    setSp(next, { replace: true });
  }

  // Sync price inputs with state
  useEffect(() => {
    setPriceMinInput(state.priceMin ? Number(state.priceMin).toLocaleString('vi-VN') : '');
    setPriceMaxInput(state.priceMax ? Number(state.priceMax).toLocaleString('vi-VN') : '');
  }, [state.priceMin, state.priceMax]);

  const selectedSort = SORTS.find(s => s.v === state.sort) || SORTS[0];

  if (!brand) {
    return (
      <div className="bg-white min-h-screen">
        <Container className="py-12">
          <div className="text-center">
            <div className="text-gray-500 mb-4">Đang tải thông tin thương hiệu...</div>
            {allBrands.length > 0 && (
              <div className="text-sm text-gray-400">
                Hoặc chọn một thương hiệu khác: {allBrands.slice(0, 3).map(b => (
                  <Link key={b._id} to={`/brand/${encodeURIComponent(b.name)}`} className="text-blue-600 hover:underline ml-2">
                    {b.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Container>
      </div>
    );
  }

  const brandDescription = brand.description || BRAND_DESCRIPTIONS[brand.name] || 'Không có mô tả.';

  return (
    <div className="bg-white min-h-screen">
      <Container className="py-6">
        {/* Breadcrumb */}
        <div className="mb-6 flex justify-end">
          <nav className="text-sm text-gray-500">
            <Link to="/" className="hover:text-gray-900">Trang chủ</Link>
            <span className="mx-2">/</span>
            <Link to="/collection" className="hover:text-gray-900">Thương hiệu</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">{brand.name}</span>
          </nav>
        </div>

        {/* Brand Header Section */}
        <div className="mb-12 text-center">
          {brand.logo && (
            <div className="mb-6 flex justify-center">
              <img 
                src={brand.logo} 
                alt={brand.name} 
                className="h-24 md:h-32 w-auto object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 uppercase">
            {brand.name}
          </h1>
          <div className="max-w-3xl mx-auto">
            <p className={`text-gray-700 leading-relaxed ${!showFullDescription && 'line-clamp-3'}`}>
              {brandDescription}
            </p>
            {brandDescription && brandDescription.length > 150 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="mt-3 text-gray-600 hover:text-gray-900 underline text-sm"
              >
                {showFullDescription ? 'Thu gọn' : 'Xem thêm'}
              </button>
            )}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Filter Sidebar */}
          <aside 
            ref={filterRef}
            className={`lg:col-span-1 ${showFilterSidebar ? 'block' : 'hidden lg:block'}`}
          >
            <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
              {/* Giới tính */}
              <div className="pb-4 border-b border-gray-100">
                <div className="flex items-center gap-2 mb-3">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">Giới tính</h3>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => patch({ gender: state.gender === 'Nam' ? '' : 'Nam' })}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      state.gender === 'Nam'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-md shadow-blue-200 scale-105'
                        : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                  >
                    Nam
                  </button>
                  <button
                    onClick={() => patch({ gender: state.gender === 'Nữ' ? '' : 'Nữ' })}
                    className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      state.gender === 'Nữ'
                        ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-md shadow-pink-200 scale-105'
                        : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-pink-300 hover:bg-pink-50'
                    }`}
                  >
                    Nữ
                  </button>
                </div>
              </div>

              {/* Thương hiệu */}
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
                    {allBrands.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 text-sm">Đang tải thương hiệu...</div>
                    ) : (
                      allBrands.map((b) => {
                        const brandName = b.name || b;
                        const isActive = brand && brandName === brand.name;
                        return (
                          <Link
                            key={b._id || b.slug || brandName}
                            to={`/brand/${encodeURIComponent(brandName)}`}
                            className={`flex items-center gap-2 p-2 rounded-lg transition-all duration-150 ${
                              isActive
                                ? 'bg-blue-50 border-2 border-blue-200'
                                : 'bg-white border-2 border-transparent hover:bg-gray-50 hover:border-gray-200'
                            }`}
                          >
                            {b.logo && (
                              <img 
                                src={b.logo} 
                                alt={brandName}
                                className="w-6 h-6 object-contain"
                                onError={(e) => { e.target.style.display = 'none'; }}
                              />
                            )}
                            <span className={`text-sm font-semibold flex-1 uppercase ${
                              isActive ? 'text-blue-900' : 'text-gray-900'
                            }`} style={{ fontSize: '14px', lineHeight: '1.4' }}>
                              {brandName}
                            </span>
                            {isActive && (
                              <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            )}
                          </Link>
                        );
                      })
                    )}
                  </div>
                )}
              </div>

              {/* Sản phẩm */}
              <div className="pb-4 border-b border-gray-100">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    <h3 className="font-semibold text-sm text-gray-900 uppercase tracking-wide">Danh mục</h3>
                  </div>
                  <button
                    onClick={() => setShowSubcategories(!showSubcategories)}
                    className="text-gray-600 hover:text-gray-900 font-bold text-lg w-6 h-6 flex items-center justify-center"
                  >
                    {showSubcategories ? '−' : '+'}
                  </button>
                </div>
                {showSubcategories && (
                  <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                    {subcategories.length === 0 ? (
                      <div className="text-center py-4 text-gray-500 text-sm">Chưa có danh mục nào</div>
                    ) : (
                      subcategories.map((sub) => {
                        const isChecked = state.subCategory === sub;
                        return (
                          <label
                            key={sub}
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
                                onChange={() => patch({ sub: isChecked ? '' : sub })}
                                className="w-5 h-5 text-blue-600 border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 cursor-pointer"
                              />
                            </div>
                            <span className={`text-sm font-medium flex-1 ${
                              isChecked ? 'text-blue-900' : 'text-gray-700'
                            }`}>
                              {sub}
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

          {/* Main Product Area */}
          <div className="lg:col-span-4">
            {/* Product Line Tabs & Controls */}
            <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide flex-1">
                <button
                  onClick={() => patch({ sub: '' })}
                  className={`px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                    !state.subCategory
                      ? 'bg-gray-900 text-white border-b-2 border-gray-900'
                      : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  TẤT CẢ
                </button>
                {subcategories.slice(0, 5).map((sub) => (
                  <button
                    key={sub}
                    onClick={() => patch({ sub })}
                    className={`px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap transition-colors ${
                      state.subCategory === sub
                        ? 'bg-gray-900 text-white border-b-2 border-gray-900'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    {sub.toUpperCase()}
                  </button>
                ))}
              </div>

              {/* Display Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowFilterSidebar(!showFilterSidebar)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  {showFilterSidebar ? 'Ẩn' : 'Hiện'}
                </button>
                
                <div ref={sortRef} className="relative">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-semibold flex items-center gap-2 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                    </svg>
                    Sắp xếp
                  </button>
                  
                  {showSortDropdown && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                      {SORTS.map((sort) => (
                        <button
                          key={sort.v}
                          onClick={() => {
                            patch({ sort: sort.v });
                            setShowSortDropdown(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                            state.sort === sort.v ? 'bg-gray-100 font-semibold' : ''
                          }`}
                        >
                          {sort.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Count */}
            <p className="text-sm font-bold text-gray-900 mb-6">
              {pagination.total || 0} sản phẩm
            </p>

            {/* Product Grid */}
            {loading ? (
              <div className="text-center py-12 text-gray-500">Đang tải...</div>
            ) : (
              <>
                <ProductGrid items={items} />
                
                {/* Pagination */}
                {pagination.total > state.limit && (
                  <div className="mt-8 flex justify-center gap-2">
                    {Array.from({ length: Math.ceil(pagination.total / state.limit) }, (_, i) => i + 1)
                      .filter(p => 
                        p === 1 || 
                        p === Math.ceil(pagination.total / state.limit) ||
                        Math.abs(p - state.page) <= 2
                      )
                      .map((page, idx, arr) => (
                        <div key={page} className="flex items-center gap-2">
                          {idx > 0 && arr[idx - 1] !== page - 1 && <span className="px-2">...</span>}
                          <button
                            onClick={() => patch({ page })}
                            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                              state.page === page
                                ? 'bg-gray-900 text-white'
                                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        </div>
                      ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

