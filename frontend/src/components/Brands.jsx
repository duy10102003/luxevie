import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBrands } from '../services/brands';

export default function Brands() {
  const scrollContainerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load brands từ API
  useEffect(() => {
    async function loadBrands() {
      try {
        const data = await fetchBrands();
        setBrands(data);
      } catch (error) {
        console.error('Error loading brands:', error);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    }
    loadBrands();
  }, []);

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
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      setTimeout(checkScrollButtons, 100);
      return () => {
        container.removeEventListener('scroll', checkScrollButtons);
      };
    }
  }, []);

  // Chia brands thành 2 hàng
  const row1 = brands.slice(0, Math.ceil(brands.length / 2));
  const row2 = brands.slice(Math.ceil(brands.length / 2));

  if (loading) {
    return (
      <section className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-black uppercase mb-6">
            THƯƠNG HIỆU
          </h2>
          <div className="text-center py-8 text-gray-500">Đang tải...</div>
        </div>
      </section>
    );
  }

  if (brands.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <h2 className="text-2xl md:text-3xl font-bold text-black uppercase mb-6">
          THƯƠNG HIỆU
        </h2>

        {/* Brands Grid - 2 Rows */}
        <div className="relative">
          <div 
            ref={scrollContainerRef}
            className="flex flex-col gap-4 overflow-x-auto pb-4 scrollbar-hide"
            onScroll={checkScrollButtons}
          >
            {/* Row 1 */}
            <div className="flex gap-4 min-w-max">
              {row1.map((brand) => (
                <Link
                  key={brand._id || brand.slug}
                  to={`/brand/${encodeURIComponent(brand.name)}`}
                  className="flex-shrink-0 group"
                  style={{ width: '180px', minWidth: '180px' }}
                >
                  <div className="bg-white border border-gray-200 rounded-lg p-4 h-32 flex items-center justify-center hover:border-gray-400 hover:shadow-md transition-all">
                    <img
                      src={brand.logo || 'https://via.placeholder.com/150x80?text=' + encodeURIComponent(brand.name)}
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x80?text=' + encodeURIComponent(brand.name);
                      }}
                    />
                  </div>
                </Link>
              ))}
            </div>

            {/* Row 2 */}
            <div className="flex gap-4 min-w-max">
              {row2.map((brand) => (
                <Link
                  key={brand._id || brand.slug}
                  to={`/brand/${encodeURIComponent(brand.name)}`}
                  className="flex-shrink-0 group"
                  style={{ width: '180px', minWidth: '180px' }}
                >
                  <div className="bg-white border border-gray-200 rounded-lg p-4 h-32 flex items-center justify-center hover:border-gray-400 hover:shadow-md transition-all">
                    <img
                      src={brand.logo || 'https://via.placeholder.com/150x80?text=' + encodeURIComponent(brand.name)}
                      alt={brand.name}
                      className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/150x80?text=' + encodeURIComponent(brand.name);
                      }}
                    />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button 
            onClick={scrollLeft}
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-300 shadow-lg flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-all z-10 ${
              !canScrollLeft ? 'opacity-0 pointer-events-none' : ''
            }`}
            aria-label="Scroll left"
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          
          <button 
            onClick={scrollRight}
            className={`absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white border border-gray-300 shadow-lg flex items-center justify-center hover:bg-gray-50 hover:shadow-xl transition-all z-10 ${
              !canScrollRight ? 'opacity-0 pointer-events-none' : ''
            }`}
            aria-label="Scroll right"
          >
            <svg className="w-6 h-6 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

