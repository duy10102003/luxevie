

// backend/src/controllers/productController.js
import mongoose from 'mongoose';
import { Product } from '../models/Product.js';
import { buildCombinedCategorySlug, normalizeGender } from '../utils/taxonomy.js';
import { Review } from '../models/Review.js';

/** buildFilter: chuyển query FE -> bộ lọc Mongo */
function buildFilter(qs) {
  const {
    q, category, categories, brand, tags, colors, sizes,
    minPrice, maxPrice, inStock, saleOnly, gender, topCategory, status = 'active',
  } = qs;

  const filter = {};

  if (status) filter.status = status; // public = 'active' (set ở handler)
  if (q) {
    // ưu tiên text search, fallback regex
    filter.$or = [
      { $text: { $search: q } },
      { name: { $regex: q, $options: 'i' } },
      { brand: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } },
    ];
  }
  if (gender) {
    // Filter by gender: normalize to 'nam' or 'nu'
    const normalizedGender = gender === 'nam' ? 'nam' : (gender === 'nu' ? 'nu' : gender);
    filter.gender = normalizedGender;
  }
  // Filter by topCategory (parent category like 'ao', 'quan', 'giay-dep', etc.)
  if (topCategory) {
    filter.topCategory = topCategory;
  }
  
  // Filter by category (subcategory within the topCategory)
  if (category) {
    // When topCategory is set, category is treated as subcategory
    if (topCategory) {
      filter.subCategory = category;
    } else {
      // No topCategory, try matching in multiple places
      const categoryFilters = [
        { topCategory: category },
        { subCategory: category },
        { categories: { $in: [category] } }
      ];
      if (!filter.$or) filter.$or = [];
      filter.$or = filter.$or.concat(categoryFilters);
    }
  }
  
  // Filter by multiple categories
  if (categories) {
    const arr = Array.isArray(categories) ? categories : String(categories).split(',').map(s => s.trim()).filter(Boolean);
    // When topCategory is set, treat as subcategories
    if (topCategory) {
      filter.subCategory = { $in: arr };
    } else {
      // Try multiple ways: topCategory, subCategory, or categories array
      const categoryFilters = [
        { topCategory: { $in: arr } },
        { subCategory: { $in: arr } },
        { categories: { $in: arr } }
      ];
      if (!filter.$or) filter.$or = [];
      filter.$or = filter.$or.concat(categoryFilters);
    }
  }
  if (brand) {
    // Support multiple brands (comma-separated)
    const brandArr = Array.isArray(brand) ? brand : String(brand).split(',').map(s => s.trim()).filter(Boolean);
    if (brandArr.length === 1) {
      filter.brand = brandArr[0];
    } else if (brandArr.length > 1) {
      filter.brand = { $in: brandArr };
    }
  }
  if (tags) {
    const arr = Array.isArray(tags) ? tags : String(tags).split(',').map(s => s.trim()).filter(Boolean);
    filter.tags = { $in: arr };
  }
  if (colors) {
    const arr = Array.isArray(colors) ? colors : String(colors).split(',').map(s => s.trim()).filter(Boolean);
    filter.$or = (filter.$or || []).concat([{ 'variants.color': { $in: arr } }]);
  }
  if (sizes) {
    const arr = Array.isArray(sizes) ? sizes : String(sizes).split(',').map(s => s.trim()).filter(Boolean);
    filter.$or = (filter.$or || []).concat([{ 'variants.size': { $in: arr } }]);
  }
  if (minPrice || maxPrice) {
    const price = {};
    if (minPrice) price.$gte = Number(minPrice);
    if (maxPrice) price.$lte = Number(maxPrice);
    // ưu tiên salePrice nếu có, fallback price
    filter.$or = (filter.$or || []).concat([{ salePrice: { ...price } }, { price }]);
  }
  if (inStock === '1' || inStock === 'true') {
    filter.$or = (filter.$or || []).concat([{ stock: { $gt: 0 } }, { 'variants.stock': { $gt: 0 } }]);
  }
  if (saleOnly === '1' || saleOnly === 'true') {
    filter.salePrice = { $gt: 0 };
  }

  return filter;
}

// function buildSort(sort) {
//   return ({
//     latest: { createdAt: -1 },
//     price_asc: { salePrice: 1, price: 1 },
//     price_desc: { salePrice: -1, price: -1 },
//     sold_desc: { sold: -1 },
//     rating_desc: { ratingAvg: -1, ratingCount: -1 },
//     featured: { featured: -1, createdAt: -1 },
//   }[sort] || { createdAt: -1 });
// }
function buildSort(sort) {
  switch (sort) {
    case 'latest':        return { createdAt: -1 };
    case 'price_asc':     return { salePrice: 1, price: 1 };
    case 'price_desc':    return { salePrice: -1, price: -1 };
    case 'sold_desc':     return { sold: -1, createdAt: -1 };
    case 'rating_desc':   return { ratingAvg: -1, ratingCount: -1, createdAt: -1 };
    case 'featured':      return { featured: -1, sold: -1, createdAt: -1 };
    case 'a_z':           return { name: 1 };
    case 'z_a':           return { name: -1 };
    default:              return { createdAt: -1 };
  }
}

/** -------- Public APIs -------- */
export const listProducts = async (req, res) => {
  const {
    page = 1, limit = 24, sort = 'latest',
    q, category, categories, brand, tags, colors, sizes,
    minPrice, maxPrice, inStock, saleOnly, gender, topCategory,
  } = req.query;

  const filter = buildFilter({ q, category, categories, brand, tags, colors, sizes, minPrice, maxPrice, inStock, saleOnly, gender, topCategory, status: 'active' });
  const pg = Math.max(1, parseInt(page));
  const lim = Math.min(60, Math.max(1, parseInt(limit)));
  const skip = (pg - 1) * lim;

  const [items, total, facets] = await Promise.all([
    Product.find(filter)
      // .select('name slug images price salePrice brand category collection tags sold ratingAvg ratingCount createdAt')
      .select('_id name images price salePrice brand tags sold ratingAvg ratingCount createdAt')

      .sort(buildSort(sort))
      .skip(skip).limit(lim).lean(),
    Product.countDocuments(filter),
    // Facets đơn giản (đếm theo category/collection/brand)
    Product.aggregate([
      { $match: filter },
      {
        $facet: {
          byCategory: [{ $unwind: '$categories' }, { $group: { _id: '$categories', count: { $sum: 1 } } }],
          byBrand: [{ $group: { _id: '$brand', count: { $sum: 1 } } }],
          priceRange: [
            {
              $group: {
                _id: null,
                min: { $min: { $cond: [{ $gt: ['$salePrice', 0] }, '$salePrice', '$price'] } },
                max: { $max: { $cond: [{ $gt: ['$salePrice', 0] }, '$salePrice', '$price'] } },
              }
            }
          ]
        }
      },
    ]),
  ]);

  res.json({
    items,
    pagination: { page: pg, limit: lim, total },
    facets: (facets?.[0]) || {},
  });
};

export const getProduct = async (req, res) => {
  const { idOrSlug } = req.params;
  const isId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
  const product = await Product.findOne(isId ? { _id: idOrSlug } : { _id: idOrSlug }).lean();
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
};

export const relatedProducts = async (req, res) => {
  const { idOrSlug } = req.params;
  const isId = /^[0-9a-fA-F]{24}$/.test(idOrSlug);
  const base = await Product.findOne(isId ? { _id: idOrSlug } : { _id: idOrSlug }).lean();
  if (!base) return res.status(404).json({ message: 'Product not found' });
  const filter = { status: 'active', _id: { $ne: base._id } };
  
  // Build filter with both brand and category
  const orConditions = [];
  
  // Filter by brand if available
  if (base.brand) {
    orConditions.push({ brand: base.brand });
  }
  
  // Filter by categories if available
  if (base.categories && base.categories.length > 0) {
    orConditions.push({ categories: { $in: base.categories } });
  }
  
  // If we have conditions, use $or, otherwise just filter by status
  if (orConditions.length > 0) {
    filter.$or = orConditions;
  }
  
  const items = await Product.find(filter)
    .select('name images price salePrice brand sold ratingAvg createdAt')
    .sort({ sold: -1, createdAt: -1 })
    .limit(12).lean();
  res.json({ items });
};

export const suggestions = async (req, res) => {
  // Gợi ý nhanh cho ô search: trả về tên/slug theo q
  const { q } = req.query;
  console.log('Search query received:', q, 'Type:', typeof q, 'Length:', q?.length);
  if (!q) return res.json({ items: [] });
  
  const items = await Product.find({ name: { $regex: q, $options: 'i' }, status: 'active' })
    .select('name images price salePrice').limit(8).lean();
  
  console.log('Search results count:', items.length);
  res.json({ items });
};

/** -------- Admin APIs -------- */
export const adminList = async (req, res) => {
  const { 
    page = 1, 
    limit = 20, 
    sort = 'latest',
    q, // search query
    status, // filter by status
    brand, // filter by brand
  } = req.query;
  
  const pg = Math.max(1, parseInt(page));
  const lim = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (pg - 1) * lim;

  // Build filter for admin search
  const filter = {};
  
  // Search functionality
  if (q) {
    filter.$or = [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { brand: { $regex: q, $options: 'i' } },
      { tags: { $regex: q, $options: 'i' } },
      { 'variants.sku': { $regex: q, $options: 'i' } },
    ];
  }
  
  // Filter by status
  if (status) {
    filter.status = status;
  }

  // Filter by brand
  if (brand) {
    filter.brand = brand;
  }

  const [items, total] = await Promise.all([
    Product.find(filter)
      .sort(buildSort(sort))
      .skip(skip).limit(lim).lean(),
    Product.countDocuments(filter),
  ]);

  res.json({ 
    items, 
    total,
    page: pg, 
    pages: Math.ceil(total / lim)
  });
};

export const createProduct = async (req, res) => {
  const data = { ...req.body };
  // Normalize taxonomy and compute categories array
  if (data.gender) data.gender = normalizeGender(data.gender);
  const combined = buildCombinedCategorySlug(data.subCategory || data.category, data.gender);
  // Ensure categories contains useful facets: gender, topCategory, subCategory base, combined
  const facetSet = new Set(
    [
      ...(Array.isArray(data.categories) ? data.categories : []),
      data.gender,
      data.topCategory,
      data.subCategory || data.category,
      combined,
    ].filter(Boolean)
  );
  data.categories = Array.from(facetSet);
  const product = await Product.create(data);
  res.status(201).json({ product });
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const patch = { ...req.body };
  if (patch.gender) patch.gender = normalizeGender(patch.gender);
  // Recompute categories if taxonomy fields provided
  const shouldRebuild = patch.gender || patch.topCategory || patch.subCategory || patch.category || patch.categories;
  if (shouldRebuild) {
    const combined = buildCombinedCategorySlug(patch.subCategory || patch.category, patch.gender);
    const facetSet = new Set(
      [
        ...(Array.isArray(patch.categories) ? patch.categories : []),
        patch.gender,
        patch.topCategory,
        patch.subCategory || patch.category,
        combined,
      ].filter(Boolean)
    );
    patch.categories = Array.from(facetSet);
  }
  const product = await Product.findByIdAndUpdate(id, { $set: patch }, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product });
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findByIdAndDelete(id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  // xoá review kèm (nếu muốn)
  await Review.deleteMany({ productId: id });
  res.json({ message: 'Deleted' });
};

export const toggleFeatured = async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  product.featured = !product.featured;
  await product.save();
  res.json({ product });
};

export const bulkUpsert = async (req, res) => {
  // nhập hàng loạt từ CSV/JSON
  const { items = [] } = req.body;
  let upserted = 0;
  for (const raw of items) {
    const data = { ...raw };
    await Product.updateOne({ name: data.name }, { $set: data }, { upsert: true });
    upserted++;
  }
  res.json({ upserted });
};
