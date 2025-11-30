// backend/src/controllers/metaController.js
import { Product } from '../models/Product.js';

export const navFacets = async (_req, res) => {
  // Lấy distinct + đếm số sp theo categories
  const [byCategory] = await Promise.all([
    Product.aggregate([
      { $match: { status: 'active' } },
      { $unwind: '$categories' },
      { $group: { _id: '$categories', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]),
  ]);

  // Chuẩn hóa trả về: mảng {slug, name, count}
  const cats = byCategory
    .filter(x => !!x._id)
    .map(x => ({ slug: x._id, name: x._id.replace(/-/g, ' '), count: x.count }));

  res.json({ categories: cats, collections: [] });
};
