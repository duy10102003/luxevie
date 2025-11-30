import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Container from "../components/layout/Container";
import ProductGrid from "../components/commerce/ProductGrid";
import { listProducts } from "../services/products";
import CategoryFilterSidebar from "../components/filters/CategoryFilterSidebar";

const SORTS = [
  { v: "latest", label: "Mới nhất" },
  { v: "price_asc", label: "Giá tăng dần" },
  { v: "price_desc", label: "Giá giảm dần" },
  { v: "sold_desc", label: "Bán chạy" },
];

// Category configurations
const CATEGORY_CONFIG = {
  ao: {
    name: "ÁO",
    description: "Khám phá bộ sưu tập áo đa dạng",
    collections: ['ao', 'ao-thun', 'ao-so-mi', 'ao-hoodie', 'ao-khoac', 'ao-len']
  },
  quan: {
    name: "QUẦN", 
    description: "Tìm kiếm quần phù hợp với phong cách",
    collections: ['quan', 'quan-jean', 'quan-short', 'quan-dai', 'quan-lot']
  },
  'phu-kien': {
    name: "PHỤ KIỆN",
    description: "Phụ kiện thời trang hoàn thiện phong cách",
    collections: ['phu-kien', 'non', 'day-nit', 'vi', 'tui-deo', 'balo']
  }
};

export default function Category() {
  const [sp, setSp] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, limit: 24, total: 0 });
  const [showFilters, setShowFilters] = useState(true);

  // Get category from URL path
  const categorySlug = window.location.pathname.split('/').pop();
  const categoryConfig = CATEGORY_CONFIG[categorySlug];

  const state = useMemo(() => {
    return {
      q: sp.get("q") || "",
      gender: sp.get("gender") || "",
      topCategory: sp.get("top") || "",
      subCategory: sp.get("sub") || "",
      collection: sp.get("collection") || "",
      priceMin: sp.get("min") || "",
      priceMax: sp.get("max") || "",
      sort: sp.get("sort") || "latest",
      page: Number(sp.get("page") || 1),
      limit: Number(sp.get("limit") || 24),
    };
  }, [sp]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      try {
        // If specific collection is selected, filter by that collection
        // Otherwise, show all collections for this category
        const collections = state.collection 
          ? [state.collection]
          : categoryConfig?.collections || [];

        // Build query parameters for API
        const queryParams = {
          q: state.q || undefined,
          priceMin: state.priceMin || undefined,
          priceMax: state.priceMax || undefined,
          sort: state.sort || undefined,
          page: state.page,
          limit: state.limit,
        };

        // Category facet from sidebar: sub+gender -> combined, else top
        if (state.subCategory && state.gender) {
          queryParams.category = `${state.subCategory}-${state.gender}`;
        } else if (state.topCategory) {
          queryParams.category = state.topCategory;
        }

        // Add collections filter
        if (collections.length > 0) {
          // Convert array to comma-separated string for API
          queryParams.collections = collections.join(',');
        }

        const { items, pagination } = await listProducts(queryParams);

        // If no items found with collections, try fallback to individual collection queries
        if ((!items || items.length === 0) && collections.length > 0) {
          const fallbackResults = [];
          
          for (const collection of collections) {
            try {
              const { items: fallbackItems } = await listProducts({
                ...queryParams,
                collection: collection,
                collections: undefined // Remove collections param
              });
              if (fallbackItems && fallbackItems.length > 0) {
                fallbackResults.push(...fallbackItems);
              }
            } catch (e) {
              console.error(`Error fetching collection ${collection}:`, e);
            }
          }
          
          if (fallbackResults.length > 0) {
            if (alive) {
              setItems(fallbackResults);
              setPagination({ page: 1, limit: 24, total: fallbackResults.length });
            }
            return;
          }
        }

        if (alive) {
          setItems(items || []);
          setPagination(pagination || { page: 1, limit: 24, total: 0 });
        }
      } catch (e) {
        console.error("Load products error:", e);
        if (alive) {
          setItems([]);
          setPagination({ page: 1, limit: 24, total: 0 });
        }
      }
      finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [state, categoryConfig]);

  if (!categoryConfig) {
    return (
      <Container className="py-12">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Danh mục không tồn tại</h1>
          <Link to="/" className="text-blue-600 hover:text-blue-500">
            ← Quay về trang chủ
          </Link>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      {/* Breadcrumb */}
      <div className="text-sm text-gray-500 mb-3">
        <Link to="/">Trang chủ</Link>
        <span className="mx-2">/</span>
        <span>{categoryConfig.name}{state.gender ? ` ${state.gender === 'nam' ? 'Nam' : 'Nữ'}` : ''}</span>
      </div>
      {/* Header + controls */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">{categoryConfig.name}</h1>
          <p className="text-gray-600">{categoryConfig.description}</p>
          <div className="text-sm text-gray-500 mt-1">{pagination?.total || items.length} sản phẩm</div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-2 text-sm border rounded-md" onClick={()=>setShowFilters(v=>!v)}>{showFilters? 'Ẩn' : 'Hiện'} bộ lọc</button>
          <select
            value={state.sort}
            onChange={(e) => {
              const newSp = new URLSearchParams(sp);
              newSp.set("sort", e.target.value);
              newSp.delete("page");
              setSp(newSp);
            }}
            className="px-3 py-2 border rounded-md text-sm"
          >
            {SORTS.map((sort) => (
              <option key={sort.v} value={sort.v}>
                {sort.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {showFilters && (
          <div className="lg:col-span-3">
            <CategoryFilterSidebar
              gender={state.gender}
              setGender={(v)=>{ const ns = new URLSearchParams(sp); if(v) ns.set('gender', v); else ns.delete('gender'); ns.delete('page'); setSp(ns); }}
              topCategory={state.topCategory}
              setTopCategory={(v)=>{ const ns = new URLSearchParams(sp); if(v) ns.set('top', v); else ns.delete('top'); ns.delete('page'); setSp(ns); }}
              subCategory={state.subCategory}
              setSubCategory={(v)=>{ const ns = new URLSearchParams(sp); if(v) ns.set('sub', v); else ns.delete('sub'); ns.delete('page'); setSp(ns); }}
              priceMin={state.priceMin}
              priceMax={state.priceMax}
              setPriceRange={(lo,hi)=>{ const ns = new URLSearchParams(sp); if(lo!=='') ns.set('min', lo); else ns.delete('min'); if(hi!=='') ns.set('max', hi); else ns.delete('max'); ns.delete('page'); setSp(ns); }}
              onReset={() => { const ns = new URLSearchParams(sp); ['gender','top','sub','min','max','page'].forEach(k=>ns.delete(k)); setSp(ns); }}
            />
          </div>
        )}
        <div className={showFilters ? "lg:col-span-9" : "lg:col-span-12"}>
          {/* Applied chips */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {state.gender && (
              <button className="px-2 py-1 text-xs rounded-full bg-gray-100" onClick={()=>{ const ns=new URLSearchParams(sp); ns.delete('gender'); setSp(ns); }}>Giới tính: {state.gender==='nam'?'Nam':'Nữ'} ×</button>
            )}
            {state.topCategory && (
              <button className="px-2 py-1 text-xs rounded-full bg-gray-100" onClick={()=>{ const ns=new URLSearchParams(sp); ns.delete('top'); setSp(ns); }}>Danh mục: {state.topCategory} ×</button>
            )}
            {state.subCategory && (
              <button className="px-2 py-1 text-xs rounded-full bg-gray-100" onClick={()=>{ const ns=new URLSearchParams(sp); ns.delete('sub'); setSp(ns); }}>Chi tiết: {state.subCategory} ×</button>
            )}
            {(state.priceMin || state.priceMax) && (
              <button className="px-2 py-1 text-xs rounded-full bg-gray-100" onClick={()=>{ const ns=new URLSearchParams(sp); ns.delete('min'); ns.delete('max'); setSp(ns); }}>Giá: {state.priceMin || 0} – {state.priceMax || '∞'} ×</button>
            )}
          </div>

          <ProductGrid 
            items={items} 
            loading={loading}
            pagination={pagination}
            onPageChange={(page) => {
              const newSp = new URLSearchParams(sp);
              newSp.set("page", page.toString());
              setSp(newSp);
            }}
          />
        </div>
      </div>
    </Container>
  );
}
