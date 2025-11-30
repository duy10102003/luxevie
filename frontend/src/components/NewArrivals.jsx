import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { imgOf } from '../utils/img';

const CATEGORIES = [
  { id: 'all', label: 'TẤT CẢ', category: null },
  { id: 'ao', label: 'ÁO', category: 'ao' },
  { id: 'quan', label: 'QUẦN', category: 'quan' },
  { id: 'giay-dep', label: 'GIÀY DÉP', category: 'giay-dep' },
  { id: 'tui-vi', label: 'TÚI VÍ', category: 'tui-vi' },
  { id: 'dong-ho', label: 'ĐỒNG HỒ', category: 'dong-ho' },
  { id: 'phu-kien', label: 'PHỤ KIỆN', category: 'phu-kien' },
];

// Product Card Component
function NewArrivalCard({ product }) {
  const originalPrice = product?.price || 0;
  const salePrice = product?.salePrice > 0 ? product.salePrice : null;
  const displayPrice = salePrice || originalPrice;
  const isNew = product?.isNew || (() => {
    if (!product?.createdAt) return false;
    const createdDate = new Date(product.createdAt);
    const now = new Date();
    const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
    return diffDays <= 7;
  })();

  return (
    <Link to={`/product/${product._id}`} className="block group">
      <div className="bg-white">
        {/* Image Container */}
        <div className="relative aspect-square bg-gray-100 overflow-hidden">
          <img 
            src={imgOf(product?.images?.[0])} 
            alt={product?.name || ""} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
          />
          
          {/* "Hàng Mới" Ribbon */}
          {isNew && (
            <div className="absolute top-2 left-2 bg-[#FFD700] text-black px-2 py-1 text-xs font-bold uppercase z-10 transform -rotate-12 shadow-md" style={{ clipPath: 'polygon(0 0, 95% 0, 100% 50%, 95% 100%, 0 100%)' }}>
              Hàng Mới
            </div>
          )}

          {/* Shopping Cart Icon (hover) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
            <div className="w-10 h-10 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Product Info */}
        <div className="p-3">
          {/* Brand Name */}
          <div className="text-xs font-bold text-black uppercase mb-1">
            {product?.brand || ''}
          </div>
          
          {/* Product Name */}
          <div className="text-sm text-black mb-2 line-clamp-2 min-h-[2.5rem]">
            {product?.name || ""}
          </div>

          {/* Price */}
          <div className="text-sm font-bold text-black mb-2">
            {Number(displayPrice).toLocaleString('vi-VN')}₫
          </div>

          {/* Color Swatches */}
          {product?.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 5).map((color, idx) => (
                <div
                  key={idx}
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: color || '#000' }}
                  title={color}
                />
              ))}
              {product.colors.length > 5 && (
                <span className="text-xs text-gray-500">+{product.colors.length - 5}</span>
              )}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('all');
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

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -300,
        behavior: 'smooth'
      });
      setTimeout(checkScrollButtons, 100);
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 300,
        behavior: 'smooth'
      });
      setTimeout(checkScrollButtons, 100);
    }
  };

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const params = {
          sort: 'latest',
          limit: 30,
        };
        
        if (activeCategory !== 'all') {
          const categoryData = CATEGORIES.find(c => c.id === activeCategory);
          if (categoryData?.category) {
            params.category = categoryData.category;
          }
        }

        const { data } = await api.get('/products', { params });
        // Filter products that are new (within 7 days or isNew flag)
        const newProducts = (data.items || []).filter(product => {
          if (product.isNew === true) return true;
          if (product.createdAt) {
            const createdDate = new Date(product.createdAt);
            const now = new Date();
            const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);
            return diffDays <= 7;
          }
          return false;
        });
        setProducts(newProducts);
      } catch (error) {
        console.error('Error loading new arrivals:', error);
      } finally {
        setLoading(false);
      }
    })();
  }, [activeCategory]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      setTimeout(checkScrollButtons, 100);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
      };
    }
  }, [products]);

  if (loading && products.length === 0) {
    return (
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-gray-500">Đang tải hàng mới về...</div>
        </div>
      </section>
    );
  }

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="bg-white pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - Title and Tabs cùng một hàng */}
        <div className="mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            {/* Title bên trái */}
            <h2 className="text-2xl md:text-3xl font-bold text-black uppercase">
              HÀNG MỚI VỀ
            </h2>

            {/* Filter Tabs bên phải */}
            <div className="flex items-center gap-0 border-b border-gray-200">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-2 text-sm font-medium uppercase transition-colors whitespace-nowrap relative ${
                    activeCategory === cat.id
                      ? 'text-black font-bold'
                      : 'text-gray-600 hover:text-black'
                  }`}
                >
                  {cat.label}
                  {activeCategory === cat.id && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-black"></span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Product Carousel */}
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide"
            onScroll={checkScrollButtons}
          >
            {products.map((product) => (
              <div key={product._id} className="flex-shrink-0" style={{ width: '220px', minWidth: '220px' }}>
                <NewArrivalCard product={product} />
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {products.length > 5 && (
            <>
              {/* Left Arrow */}
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
              
              {/* Right Arrow */}
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
      </div>
    </section>
  );
}

