// src/components/layout/SiteHeader.jsx
import { Link, NavLink, useNavigate } from "react-router-dom";
import Container from "./Container";
import SearchBar from "../SearchBar";
import { useAuth } from "../../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import { listProducts } from "../../services/products";
import { fmt } from "../../utils/money";
import { fetchBrands } from "../../services/brands";
import { fetchSubcategories } from "../../services/category";

// Menu categories data
const MENU_CATEGORIES = {
  ao: {
    label: "ÁO",
    subcategories: [
      { label: "ÁO THUN", category: "ao-thun" },
      { label: "ÁO SƠ MI", category: "ao-so-mi" },
      { label: "ÁO HOODIE", category: "ao-hoodie" },
      { label: "ÁO KHOÁC", category: "ao-khoac" },
      { label: "ÁO LEN", category: "ao-len" }
    ]
  },
  quan: {
    label: "QUẦN",
    subcategories: [
      { label: "QUẦN JEAN", category: "quan-jean" },
      { label: "QUẦN SHORT", category: "quan-short" },
      { label: "QUẦN DÀI", category: "quan-dai" },
      { label: "QUẦN LÓT", category: "quan-lot" }
    ]
  },
  "phu-kien": {
    label: "PHỤ KIỆN",
    subcategories: [
      { label: "NÓN", category: "non" },
      { label: "DÂY NỊT", category: "day-nit" },
      { label: "VÍ", category: "vi" },
      { label: "TÚI ĐEO", category: "tui-deo" },
      { label: "BALO", category: "balo" }
    ]
  }
};

export default function SiteHeader() {
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [showBrandsDropdown, setShowBrandsDropdown] = useState(false);
  const [hoveredCategory, setHoveredCategory] = useState(null);
  const [categoryData, setCategoryData] = useState({}); // { categoryKey: { subcategories: [], products: [] } }
  const [brands, setBrands] = useState([]); // Brands từ API
  const dropdownRef = useRef(null);
  const brandsDropdownRef = useRef(null);
  const megaMenuRef = useRef(null);

  // Load brands từ API
  useEffect(() => {
    async function loadBrands() {
      try {
        const data = await fetchBrands();
        setBrands(data);
      } catch (error) {
        console.error('Error loading brands:', error);
        setBrands([]);
      }
    }
    loadBrands();
  }, []);

  const isAdmin = user?.role === "admin" || user?.isAdmin === true;
  const linkBase = "relative px-3 py-2 text-sm uppercase tracking-wide text-gray-700 hover:text-gray-900 transition-colors after:absolute after:left-3 after:-bottom-[6px] after:h-[2px] after:w-0 after:bg-gray-900 after:transition-all hover:after:w-[calc(100%-24px)]";
  const linkActive = "text-gray-900 font-semibold after:w-[calc(100%-24px)]";

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
      if (brandsDropdownRef.current && !brandsDropdownRef.current.contains(event.target)) {
        setShowBrandsDropdown(false);
      }
    }

    if (open || showBrandsDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open, showBrandsDropdown]);

  function handleLogout() {
    logout();
    setOpen(false);
    nav("/", { replace: true });
  }

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
  const normalizeCategoryName = (category) => {
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
      .filter(w => w.length > 0)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Helper function to check if a category should be excluded
  const shouldExcludeCategory = (category) => {
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
  };

  // Predefined subcategories for each main category
  const CATEGORY_SUBCATEGORIES = {
    'ao': [
      { display: 'Áo Thun', slug: 'ao-thun' },
      { display: 'Áo Sơ Mi', slug: 'ao-so-mi' },
      { display: 'Áo Polo', slug: 'ao-polo' },
      { display: 'Áo Hoodie', slug: 'ao-hoodie' },
      { display: 'Áo Khoác', slug: 'ao-khoac' },
    ],
    'quan': [
      { display: 'Quần Jean', slug: 'quan-jean' },
      { display: 'Quần Short', slug: 'quan-short' },
      { display: 'Quần Âu', slug: 'quan-au' },
      { display: 'Quần Jogger', slug: 'quan-jogger' },
      { display: 'Váy', slug: 'vay' },
    ],
    'giay-dep': [
      { display: 'Giày Thể Thao', slug: 'giay-the-thao' },
      { display: 'Giày Tây', slug: 'giay-tay' },
      { display: 'Dép Quai Chéo', slug: 'dep-quai-cheo' },
      { display: 'Dép Kẹp', slug: 'dep-kep' },
    ],
    'tui-vi': [
      { display: 'Túi Xách', slug: 'tui-xach' },
      { display: 'Túi Đeo Chéo', slug: 'tui-deo-cheo' },
      { display: 'Balo', slug: 'balo' },
      { display: 'Ví Cầm Tay', slug: 'vi-cam-tay' },
    ],
    'mat-kinh': [
      { display: 'Gọng Kính Tròn', slug: 'gong-kinh-tron' },
      { display: 'Gọng Kính Vuông', slug: 'gong-kinh-vuong' },
      { display: 'Kính Mát Gọng Oval', slug: 'kinh-mat-gong-oval' },
      { display: 'Kính Mát Gọng Tròn', slug: 'kinh-mat-gong-tron' },
      { display: 'Kính Mát Gọng Vuông', slug: 'kinh-mat-gong-vuong' },
      { display: 'Kính Mát Gọng Mắt Mèo', slug: 'kinh-mat-gong-mat-meo' },
      { display: 'Kính Râm', slug: 'kinh-ram' },
    ],
    'dong-ho': [
      { display: 'Đồng Hồ Pin', slug: 'dong-ho-pin' },
      { display: 'Đồng Hồ Automatic', slug: 'dong-ho-automatic' },
      { display: 'Đồng Hồ Thông Minh', slug: 'dong-ho-thong-minh' },
      { display: 'Đồng Hồ Điện Tử', slug: 'dong-ho-dien-tu' },
    ],
    'phu-kien': [
      { display: 'Cà Vạt', slug: 'ca-vat' },
      { display: 'Thắt Lưng', slug: 'that-lung' },
      { display: 'Nón Len', slug: 'non-len' },
      { display: 'Nón Nửa Đầu', slug: 'non-nua-dau' },
      { display: 'Tất', slug: 'tat' },
    ],
    'trang-suc': [
      { display: 'Nhẫn', slug: 'nhan' },
      { display: 'Vòng Cổ', slug: 'vong-co' },
      { display: 'Vòng Tay', slug: 'vong-tay' },
      { display: 'Kẹp Cà Vạt', slug: 'kep-ca-vat' },
    ],
  };

  // Fetch subcategories and bestseller products when hovering over category
  useEffect(() => {
    if (!hoveredCategory) return;
    
    // Check if data already loaded
    if (categoryData[hoveredCategory]) return;
    
    let alive = true;
    (async () => {
      try {
        // Get parent category from map
        const parentCategory = CATEGORY_PARENT_MAP[hoveredCategory];
        
        // Fetch subcategories from API (fetch both nam and nu)
        const [subcategoriesNam, subcategoriesNu] = await Promise.all([
          fetchSubcategories(parentCategory, 'nam'),
          fetchSubcategories(parentCategory, 'nu'),
        ]);
        
        // Combine and deduplicate by slug, prefer display name
        const subcategoriesMap = new Map();
        [...subcategoriesNam, ...subcategoriesNu].forEach(subcat => {
          if (!subcategoriesMap.has(subcat.slug)) {
            subcategoriesMap.set(subcat.slug, {
              normalized: subcat.name,
              original: subcat.slug
            });
          }
        });
        
        const subcategories = Array.from(subcategoriesMap.values());
        
        // Fetch 3 bestseller products
        const { items } = await listProducts({
          topCategory: hoveredCategory,
          sort: 'sold_desc',
          limit: 3,
        });
        
        if (!alive) return;
        
        setCategoryData(prev => ({
          ...prev,
          [hoveredCategory]: {
            subcategories: subcategories || [],
            products: items || []
          }
        }));
      } catch (error) {
        console.error('Error fetching category data:', error);
        // Fallback to predefined if API fails
        const fallbackSubcategories = (CATEGORY_SUBCATEGORIES[hoveredCategory] || []).map(subcat => ({
          normalized: subcat.display,
          original: subcat.slug
        }));
        setCategoryData(prev => ({
          ...prev,
          [hoveredCategory]: {
            subcategories: fallbackSubcategories,
            products: []
          }
        }));
      }
    })();
    
    return () => { alive = false; };
  }, [hoveredCategory, categoryData]);

  // Category configuration - mapping từ key sang parent category trong DB
  const CATEGORY_PARENT_MAP = {
    'ao': 'ao',
    'quan': 'quan',
    'giay-dep': 'giay-dep',
    'tui-vi': 'tui-vi',
    'mat-kinh': 'mat-kinh',
    'dong-ho': 'dong-ho',
    'phu-kien': 'phu-kien',
    'trang-suc': 'trang-suc',
  };

  const CATEGORIES = [
    { key: 'ao', path: '/ao', label: 'ÁO' },
    { key: 'quan', path: '/quan', label: 'QUẦN' },
    { key: 'giay-dep', path: '/giay-dep', label: 'GIÀY DÉP' },
    { key: 'tui-vi', path: '/tui-vi', label: 'TÚI VÍ' },
    { key: 'mat-kinh', path: '/mat-kinh', label: 'MẮT KÍNH' },
    { key: 'dong-ho', path: '/dong-ho', label: 'ĐỒNG HỒ' },
    { key: 'phu-kien', path: '/phu-kien', label: 'PHỤ KIỆN' },
    { key: 'trang-suc', path: '/trang-suc', label: 'TRANG SỨC' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b">
      <Container className="h-16 flex items-center justify-between">
        {/* Left: Logo + nav */}
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center">
            <img 
              src="https://res.cloudinary.com/dqawqvxcr/image/upload/v1761117182/LuxeVie_2_zvsptx.png" 
              alt="LuxeVie Logo" 
              className="h-10 w-auto object-contain"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-4">
            <NavLink to="/" end className={({isActive})=>`${linkBase} ${isActive?linkActive:''}`}>TRANG CHỦ</NavLink>
            
            {/* THƯƠNG HIỆU Dropdown */}
            <div 
              ref={brandsDropdownRef}
              className="relative"
              onMouseEnter={() => setShowBrandsDropdown(true)}
              onMouseLeave={() => setShowBrandsDropdown(false)}
            >
              <button className={`${linkBase} ${showBrandsDropdown ? linkActive : ''}`}>
                THƯƠNG HIỆU
              </button>
              
              {showBrandsDropdown && (
                <div className="absolute top-full left-0 mt-2 w-[600px] bg-white border border-gray-200 rounded-lg shadow-xl p-6 z-50">
                  <h3 className="text-sm font-bold text-gray-900 uppercase mb-4">Thương hiệu</h3>
                  <div className="grid grid-cols-4 gap-4">
                    {brands.length === 0 ? (
                      <div className="col-span-4 text-center py-4 text-gray-500">Đang tải thương hiệu...</div>
                    ) : (
                      brands.map((brand) => (
                        <Link
                          key={brand._id || brand.slug}
                          to={`/brand/${encodeURIComponent(brand.name)}`}
                          className="group flex flex-col items-center justify-center p-3 border border-gray-200 rounded-lg hover:border-gray-400 hover:shadow-md transition-all"
                          onClick={() => setShowBrandsDropdown(false)}
                        >
                          <div className="w-full h-20 mb-2 flex items-center justify-center">
                            <img
                              src={brand.logo || 'https://via.placeholder.com/150x80?text=' + encodeURIComponent(brand.name)}
                              alt={brand.name}
                              className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                              onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/120x60?text=' + encodeURIComponent(brand.name);
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-600 text-center group-hover:text-gray-900 transition-colors">
                          {brand.name}
                        </p>
                      </Link>
                    ))
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {/* ĐÃ XOÁ: SẢN PHẨM, ÁO, QUẦN, PHỤ KIỆN khỏi menu chính */}
            <NavLink to="/collection?collection=khuyen-mai" className={({isActive})=>`${linkBase} ${isActive?linkActive:''}`}>KHUYẾN MÃI</NavLink>
          </nav>
        </div>

        {/* Center: SearchBar with suggestions */}
        <div className="hidden md:block min-w-[320px]">
          <SearchBar />
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <Link to="/cart" className="px-3 py-2 rounded-full border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-sm">🛒 Giỏ hàng</Link>

          {!user ? (
            <>
              <Link className="btn-ghost text-sm" to="/login">Đăng nhập</Link>
              <Link className="btn-primary text-sm" to="/register">Đăng ký</Link>
            </>
          ) : (
            <div ref={dropdownRef} className="relative select-none z-50">
              <button
                onClick={() => setOpen(!open)}
                className="list-none cursor-pointer px-3 py-2 rounded-full border border-gray-200 hover:bg-gray-50 text-sm flex items-center gap-2"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-black text-white">
                  {String(user.name || user.email || "U").slice(0,1).toUpperCase()}
                </span>
                <span className="hidden sm:block">{user.name || user.email}</span>
                <span className="ml-1 text-gray-500">▾</span>
              </button>
              {open && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border bg-white shadow-2xl p-1 z-50">
                  <Link to="/orders" className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-50" onClick={()=>setOpen(false)}>Đơn hàng của tôi</Link>
                  <Link to="/profile" className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-50" onClick={()=>setOpen(false)}>Hồ sơ</Link>
                  {isAdmin && (
                    <Link to="/admin" className="block px-3 py-2 rounded-lg text-sm hover:bg-gray-50" onClick={()=>setOpen(false)}>Trang quản trị</Link>
                  )}
                  <button onClick={handleLogout} className="w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-gray-50 text-red-600">Đăng xuất</button>
                </div>
              )}
            </div>
          )}
        </div>
      </Container>

      {/* Secondary Menu */}
      <div 
        ref={megaMenuRef}
        className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 border-t border-gray-700/50 shadow-lg relative z-30"
        onMouseLeave={() => setHoveredCategory(null)}
      >
        <Container>
          <nav className="hidden md:flex items-center justify-center gap-8 lg:gap-12 uppercase text-white text-xs font-semibold tracking-wider">
            {CATEGORIES.map((cat) => (
              <div
                key={cat.key}
                className="relative"
                onMouseEnter={() => setHoveredCategory(cat.key)}
              >
                <NavLink 
                  to={cat.path} 
                  className={({ isActive }) => 
                    `relative px-4 py-3.5 transition-all duration-300 block ${
                      isActive 
                        ? 'text-yellow-400 font-bold' 
                        : 'text-gray-200 hover:text-yellow-400'
                    } hover:scale-105`
                  }
                >
                  <span className="relative z-10">{cat.label}</span>
                  <span className="absolute inset-0 bg-gradient-to-b from-yellow-400/10 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                </NavLink>
              </div>
            ))}
          </nav>
        </Container>

        {/* Mega Menu Dropdown */}
        {hoveredCategory && (
          <div className="absolute top-full left-0 w-full bg-white shadow-2xl z-50 border-t-2 border-yellow-400">
            <Container>
              <div className="grid grid-cols-5 gap-0 py-8">
                {/* Left Column: Subcategories */}
                <div className="col-span-2 bg-white px-6 py-4 border-r border-gray-200">
                  <ul className="space-y-0">
                    {(categoryData[hoveredCategory]?.subcategories || []).map((subcat, idx) => {
                      const subcatObj = typeof subcat === 'object' ? subcat : { normalized: subcat, original: subcat };
                      const displayName = subcatObj.normalized;
                      const originalCat = subcatObj.original;
                      
                      return (
                        <li key={idx} className="border-b border-gray-200 last:border-b-0">
                          <Link
                            to={`${CATEGORIES.find(c => c.key === hoveredCategory)?.path}?subcategory=${encodeURIComponent(originalCat)}`}
                            className="flex items-center justify-between px-0 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 group"
                            onClick={() => setHoveredCategory(null)}
                          >
                            <span className="group-hover:underline">{displayName}</span>
                            <span className="text-gray-400 group-hover:text-gray-900 transition-colors ml-4">›</span>
                          </Link>
                        </li>
                      );
                    })}
                    {(!categoryData[hoveredCategory] || categoryData[hoveredCategory]?.subcategories?.length === 0) && (
                      <li className="px-0 py-3 text-sm text-gray-500">Đang tải danh mục...</li>
                    )}
                  </ul>
                </div>
                
                {/* Right Column: Featured Products (3 products) */}
                <div className="col-span-3 px-6 py-4">
                  <div className="grid grid-cols-3 gap-6">
                    {(categoryData[hoveredCategory]?.products || []).map((product) => {
                      const salePrice = product.salePrice > 0 ? product.salePrice : null;
                      const displayPrice = salePrice || product.price || 0;
                      
                      return (
                        <Link
                          key={product._id}
                          to={`/product/${product._id}`}
                          className="group"
                          onClick={() => setHoveredCategory(null)}
                        >
                          <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-3">
                            {product.images?.[0]?.url ? (
                              <>
                                <img
                                  src={product.images[0].url}
                                  alt={product.name}
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                />
                                {/* Hover overlay with button */}
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                                  <span className="px-4 py-2 bg-white text-gray-900 text-xs font-semibold rounded-full">
                                    Xem ngay
                                  </span>
                                </div>
                              </>
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">No Image</div>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 line-clamp-2 group-hover:text-gray-900 transition-colors mb-1 min-h-[2.5rem]">
                            {product.name}
                          </p>
                          {displayPrice > 0 && (
                            <p className="text-sm font-semibold text-gray-900">
                              {fmt(displayPrice)}
                            </p>
                          )}
                        </Link>
                      );
                    })}
                    {(!categoryData[hoveredCategory] || categoryData[hoveredCategory]?.products?.length === 0) && (
                      <div className="col-span-3 text-center text-sm text-gray-500 py-8">
                        Đang tải sản phẩm...
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Container>
          </div>
        )}
      </div>
    </header>
  );
}
