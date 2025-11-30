import { Link } from "react-router-dom";
import { fmt, discountPct } from "../../utils/money";
import { imgOf } from "../../utils/img";

export default function ProductCard({ product }) {
  const originalPrice = product?.price || 0;
  const salePrice = product?.salePrice > 0 ? product.salePrice : null;
  const displayPrice = salePrice || originalPrice;
  const discountPercent = discountPct(originalPrice, salePrice);
  const hasDiscount = salePrice && salePrice < originalPrice;

  return (
    <Link to={`/product/${product._id}`} className="group relative border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-lg transition-shadow">
      {/* Image Container with Discount Badge */}
      <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden">
        <img 
          src={imgOf(product?.images?.[0])} 
          alt={product?.name || ""} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
        />
        {/* Discount Badge */}
        {discountPercent && (
          <div className="absolute top-2 left-2 w-11 h-11 rounded-full bg-[#FF6B35] flex items-center justify-center shadow-lg z-10">
            <span className="text-white text-xs font-bold">-{discountPercent}%</span>
          </div>
        )}
        {/* Free Shipping Badge */}
        {(hasDiscount || displayPrice > 500000) && (
          <div className="absolute bottom-2 left-2 bg-white/95 border border-gray-200 rounded-full px-3 py-1.5 shadow-sm z-10">
            <span className="text-xs text-gray-800 font-medium">Miễn Phí Ship</span>
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        {/* Brand Name */}
        {product?.brand && (
          <div className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wide">
            {product.brand}
          </div>
        )}
        
        {/* Product Name */}
        <div className="line-clamp-2 text-sm text-gray-900 mb-2 min-h-[2.5rem]">
          {product?.name || ""}
        </div>

        {/* Pricing */}
        <div className="flex flex-col gap-0.5 mt-2">
          {hasDiscount ? (
            <>
              {/* Original Price (strikethrough) */}
              <div className="text-xs text-gray-500 line-through">
                {originalPrice.toLocaleString('vi-VN')} VND
              </div>
              {/* Sale Price (prominent) */}
              <div className="text-base font-bold text-gray-900">
                {salePrice.toLocaleString('vi-VN')} VND
              </div>
            </>
          ) : (
            <div className="text-base font-bold text-gray-900">
              {displayPrice.toLocaleString('vi-VN')} VND
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
