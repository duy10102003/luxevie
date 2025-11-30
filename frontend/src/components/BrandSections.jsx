import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { listBrandSections } from '../services/adminBrandSections';
import { imgOf } from '../utils/img';

// Custom Product Card for Brand Sections
function BrandProductCard({ product }) {
  const originalPrice = product?.price || 0;
  const salePrice = product?.salePrice > 0 ? product.salePrice : null;
  const displayPrice = salePrice || originalPrice;
  const hasDiscount = salePrice && salePrice < originalPrice;
  const discountPercent = hasDiscount ? Math.round(((originalPrice - salePrice) / originalPrice) * 100) : 0;

  return (
    <Link to={`/product/${product._id}`} className="block group">
      <div className="bg-white rounded-lg overflow-hidden">
        {/* Image Container with Shopping Cart Icon */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img 
            src={imgOf(product?.images?.[0])} 
            alt={product?.name || ""} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
          {/* Shopping Cart Icon */}
          <button
            onClick={(e) => {
              e.preventDefault();
              // Handle add to cart
            }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md transition-all opacity-0 group-hover:opacity-100 z-10"
            aria-label="Add to cart"
          >
            <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </button>
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="absolute top-2 left-2 w-10 h-10 rounded-full bg-[#FF6B35] flex items-center justify-center shadow-lg z-10">
              <span className="text-white text-xs font-bold">-{discountPercent}%</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-3">
          {/* Brand Name */}
          <div className="text-xs font-normal text-[#333333] mb-1">{product?.brand || 'DICKIES'}</div>
          
          {/* Product Name */}
          <div className="text-sm font-medium text-[#333333] mb-2 line-clamp-2 min-h-[2.5rem]">
            {product?.name || ""}
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-2">
            {hasDiscount ? (
              <>
                <span className="text-sm font-bold text-[#333333]">{Number(salePrice).toLocaleString('vi-VN')}₫</span>
                <span className="text-xs text-gray-500 line-through">{Number(originalPrice).toLocaleString('vi-VN')}₫</span>
              </>
            ) : (
              <span className="text-sm font-bold text-[#333333]">{Number(displayPrice).toLocaleString('vi-VN')}₫</span>
            )}
          </div>

          {/* Color Swatch */}
          {product?.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              <div 
                className="w-4 h-4 rounded-full border border-gray-300"
                style={{ backgroundColor: product.colors[0] || '#000' }}
                title={product.colors[0]}
              />
              {product.colors.length > 1 && (
                <span className="text-xs text-gray-600">+{product.colors.length - 1}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function BrandSections() {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const { items } = await listBrandSections();
        setSections(items || []);
        if (items && items.length > 0) {
          setActiveTab(0);
        }
      } catch (error) {
        console.error('Error loading brand sections:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Reset scroll position when tab changes
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
      setTimeout(checkScrollButtons, 100);
    }
  }, [activeTab]);

  // Check scroll buttons when scrolling or when tab changes
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      // Check after a short delay to ensure DOM is ready
      setTimeout(checkScrollButtons, 100);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
      };
    }
  }, [activeTab]);

  if (loading) {
    return (
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">Đang tải thương hiệu nổi bật...</div>
        </div>
      </section>
    );
  }

  if (!sections.length) {
    return null;
  }

  const activeSection = sections[activeTab];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
      // Check after scroll
      setTimeout(checkScrollButtons, 100);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
      // Check after scroll
      setTimeout(checkScrollButtons, 100);
    }
  };

  return (
    <section className="bg-white pt-4 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header với title và tabs */}
        <div className="mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            {/* Title bên trái */}
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-wide">
              BỘ SƯU TẬP
            </h2>
            
            {/* Tabs Navigation bên phải */}
            <div className="flex items-center gap-0">
              {sections.map((section, index) => (
                <div key={section._id} className="flex items-center">
                  <button
                    onClick={() => setActiveTab(index)}
                    className={`px-4 py-2 text-sm font-semibold uppercase transition-colors whitespace-nowrap ${
                      activeTab === index
                        ? 'text-gray-900 font-bold border-b-2 border-gray-900'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    {section.sectionName}
                  </button>
                  {index < sections.length - 1 && (
                    <span className="mx-1 text-gray-300">|</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Active Section Content */}
        {activeSection && (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
            {/* Banner Image - Left Side (2/5) */}
            <div className="lg:col-span-2">
              <Link to={`/collection?brand=${encodeURIComponent(activeSection.brand)}`}>
                <div className="relative group overflow-hidden bg-gray-100 h-full min-h-[500px] lg:min-h-[600px]">
                  <img
                    src={activeSection.bannerImage}
                    alt={activeSection.sectionName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/800x600?text=Banner';
                    }}
                  />
                </div>
              </Link>
            </div>

            {/* Products - Right Side (3/5) */}
            <div className="lg:col-span-3 bg-[#F8F5F2] px-6 py-8 lg:py-10">
              {/* Brand Header */}
              <div className="mb-6">
                <div className="text-sm font-normal text-[#333333] mb-1">{activeSection.brand}</div>
                <div className="text-2xl font-bold text-[#333333] uppercase tracking-wide">{activeSection.sectionName}</div>
              </div>

              {/* Product Horizontal Scroll */}
              {activeSection.productIds && activeSection.productIds.length > 0 ? (
                <div className="relative">
                  <div 
                    ref={scrollContainerRef}
                    className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
                    onScroll={checkScrollButtons}
                  >
                    {activeSection.productIds.map((product) => (
                      <div key={product._id} className="flex-shrink-0" style={{ width: '220px', minWidth: '220px' }}>
                        <BrandProductCard product={product} />
                      </div>
                    ))}
                  </div>
                  
                  {/* Navigation Arrow Buttons */}
                  {activeSection.productIds.length > 3 && (
                    <>
                      {/* Left Arrow Button */}
                      {canScrollLeft && (
                        <button 
                          onClick={scrollLeft}
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-300 shadow-lg flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-all z-10"
                          aria-label="Scroll left"
                        >
                          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                          </svg>
                        </button>
                      )}
                      
                      {/* Right Arrow Button */}
                      {canScrollRight && (
                        <button 
                          onClick={scrollRight}
                          className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-300 shadow-lg flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-all z-10"
                          aria-label="Scroll right"
                        >
                          <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </button>
                      )}
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-full min-h-[400px] rounded-lg">
                  <p className="text-gray-500">Chưa có sản phẩm nào</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
