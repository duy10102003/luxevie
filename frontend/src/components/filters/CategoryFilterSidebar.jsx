import { useEffect, useMemo, useState } from 'react';
import { fetchTopCategoriesByGender, fetchSubcategories } from '../../services/category';

export default function CategoryFilterSidebar({
  gender, setGender,
  topCategory, setTopCategory,
  subCategory, setSubCategory,
  priceMin, priceMax, setPriceRange,
  onReset,
}) {
  const [topCats, setTopCats] = useState([]);
  const [subCats, setSubCats] = useState([]);
  const [minInput, setMinInput] = useState(priceMin || '');
  const [maxInput, setMaxInput] = useState(priceMax || '');
  const [openProducts, setOpenProducts] = useState(true);
  const [catQuery, setCatQuery] = useState('');

  useEffect(() => { setMinInput(priceMin || ''); setMaxInput(priceMax || ''); }, [priceMin, priceMax]);

  useEffect(() => {
    (async () => {
      if (!gender) { setTopCats([]); setSubCats([]); return; }
      const tc = await fetchTopCategoriesByGender(gender);
      setTopCats(tc);
      if (topCategory && !tc.some(c => c.category === topCategory)) {
        setTopCategory(''); setSubCategory(''); setSubCats([]); return;
      }
      if (topCategory) {
        const sc = await fetchSubcategories(topCategory, gender);
        setSubCats(sc);
        if (subCategory && !sc.some(c => c.category === subCategory)) {
          setSubCategory('');
        }
      } else {
        setSubCats([]);
      }
    })();
  }, [gender, topCategory]);

  const applyPrice = () => {
    const lo = minInput ? Math.max(0, parseInt(minInput)) : '';
    const hi = maxInput ? Math.max(0, parseInt(maxInput)) : '';
    setPriceRange(lo || '', hi || '');
  };

  const quickPrice = [
    { label: 'Dưới 1,000,000đ', min: '', max: 1000000 },
    { label: '1,000,000đ – 2,000,000đ', min: 1000000, max: 2000000 },
    { label: '2,000,000đ – 3,000,000đ', min: 2000000, max: 3000000 },
    { label: 'Trên 4,000,000đ', min: 4000000, max: '' },
  ];

  return (
    <aside className="space-y-6 lg:sticky lg:top-28">
      {/* Gender */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="font-semibold mb-3">Giới tính</div>
        <div className="grid grid-cols-2 gap-2">
          {['nam','nu'].map((g) => (
            <button
              key={g}
              className={`px-3 py-2 rounded-md border text-sm ${gender===g ? 'bg-black text-white' : 'bg-white'}`}
              onClick={()=> setGender(g)}
            >{g==='nam'?'Nam':'Nữ'}</button>
          ))}
        </div>
        <button className={`mt-2 text-xs ${gender===''?'text-gray-400':'text-blue-600'}`} onClick={()=> setGender('')}>Chọn Unisex</button>
      </div>

      {/* Product categories */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="font-semibold">Sản phẩm</div>
          <button className="text-xs text-blue-600" onClick={()=> setOpenProducts(v=>!v)}>{openProducts? 'Thu gọn' : 'Mở rộng'}</button>
        </div>
        {openProducts && (
        <div className="space-y-3">
          <div>
            <div className="text-sm font-medium mb-2">Danh mục</div>
            <div className="space-y-1">
              {topCats.map(c => (
                <label key={`${c.category}-${c.gender}`} className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    name="topCat"
                    checked={topCategory === c.category}
                    onChange={() => setTopCategory(c.category)}
                  />
                  <span>{c.name}</span>
                </label>
              ))}
              {!!topCategory && (
                <button className="mt-1 text-xs text-blue-600" onClick={()=>{ setTopCategory(''); setSubCategory(''); }}>Bỏ chọn</button>
              )}
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">Danh mục chi tiết</div>
            <input
              className="w-full mb-2 px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Tìm danh mục..."
              value={catQuery}
              onChange={(e)=>setCatQuery(e.target.value)}
            />
            <div className="space-y-1">
              {subCats.length ? subCats
                .filter(c => !catQuery || c.name.toLowerCase().includes(catQuery.toLowerCase()) || c.category.includes(catQuery))
                .map(c => (
                <label key={`${c.category}-${c.gender}`} className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={subCategory === c.category}
                    onChange={(e) => setSubCategory(e.target.checked ? c.category : '')}
                  />
                  <span>{c.name}</span>
                </label>
              )) : (
                <div className="text-xs text-gray-500">Không có danh mục chi tiết</div>
              )}
            </div>
          </div>
        </div>
        )}
      </div>

      {/* Price */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="font-semibold mb-3">Giá</div>
        <div className="flex items-center gap-2 mb-3">
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Từ"
            value={minInput}
            onChange={(e)=>setMinInput(e.target.value)}
            onKeyDown={(e)=> e.key==='Enter' && applyPrice()}
            inputMode="numeric"
          />
          <span className="text-gray-400">—</span>
          <input
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Đến"
            value={maxInput}
            onChange={(e)=>setMaxInput(e.target.value)}
            onKeyDown={(e)=> e.key==='Enter' && applyPrice()}
            inputMode="numeric"
          />
          <button className="px-3 py-2 text-sm bg-blue-600 text-white rounded-md" onClick={applyPrice}>Áp dụng</button>
        </div>
        <div className="space-y-2">
          {quickPrice.map((opt) => (
            <label key={opt.label} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="priceQuick"
                checked={String(priceMin||'')===String(opt.min||'') && String(priceMax||'')===String(opt.max||'')}
                onChange={()=> setPriceRange(opt.min, opt.max)}
              />
              <span>{opt.label}</span>
            </label>
          ))}
          {(priceMin || priceMax) && (
            <button className="mt-1 text-xs text-blue-600" onClick={()=>setPriceRange('', '')}>Xoá lọc giá</button>
          )}
        </div>
      </div>

      <button
        className="w-full px-4 py-2 rounded-md border border-gray-300 text-sm bg-white hover:bg-gray-50"
        onClick={() => {
          setGender('');
          setTopCategory('');
          setSubCategory('');
          setPriceRange('', '');
          onReset && onReset();
        }}
      >Xóa bộ lọc</button>
    </aside>
  );
}


