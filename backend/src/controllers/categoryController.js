// import Category from '../models/Category.js';

// export const listCategories = async (req, res) => {
//   const categories = await Category.find().lean();
//   res.json({ categories });
// };

// export const getCategoryBySlug = async (req, res) => {
//   const { slug } = req.params;
//   const cat = await Category.findOne({ slug }).lean();
//   if (!cat) return res.status(404).json({ message: 'Category not found' });
//   res.json({ category: cat });
// };

// // (Tuỳ chọn) Admin create/update
// export const createCategory = async (req, res) => {
//   const cat = await Category.create(req.body);
//   res.status(201).json({ category: cat });
// };

// export const updateCategory = async (req, res) => {
//   const { id } = req.params;
//   const cat = await Category.findByIdAndUpdate(id, req.body, { new: true });
//   if (!cat) return res.status(404).json({ message: 'Category not found' });
//   res.json({ category: cat });
// };


// backend/src/controllers/categoryController.js
import { Category } from '../models/Category.js';
import { slugify } from '../utils/slugify.js';

// Public: chỉ lấy active, sắp xếp theo order rồi name
export const listCategories = async (req, res) => {
  const { gender, parent } = req.query;

  const filter = { active: true };
  if (gender) filter.gender = gender;
  if (parent === 'null' || parent === '' || parent === undefined) {
    filter.parent = null;
  } else if (parent) {
    // Accept either slug or ObjectId of the parent doc
    const isId = /^[0-9a-fA-F]{24}$/.test(String(parent));
    if (isId) {
      const p = await Category.findById(parent).lean();
      filter.parent = p ? p.category : parent;
    } else {
      filter.parent = parent;
    }
  }

  const categories = await Category.find(filter)
    .sort({ order: 1, name: 1 })
    .lean();
  res.json({ categories });
};

export const getCategoryBySlug = async (req, res) => {
  const { slug } = req.params;
  const cat = await Category.findOne({ category: slug, active: true }).lean();
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  res.json({ category: cat });
};

// Admin
export const adminListCategories = async (req, res) => {
  const categories = await Category.find({}).sort({ order: 1, name: 1 }).lean();
  res.json({ categories });
};

export const createCategory = async (req, res) => {
  const { name, category, image, description, order, active } = req.body || {};
  const s = slugify(category || name);
  const exists = await Category.findOne({ category: s });
  if (exists) return res.status(409).json({ code: 'CATEGORY_TAKEN', message: 'Category exists' });
  const cat = await Category.create({ name, category: s, image, description, order, active });
  res.status(201).json({ category: cat });
};

export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const patch = { ...req.body };
  if (patch.category) patch.category = slugify(patch.category);
  const cat = await Category.findByIdAndUpdate(id, { $set: patch }, { new: true });
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  res.json({ category: cat });
};

export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  const cat = await Category.findByIdAndDelete(id);
  if (!cat) return res.status(404).json({ message: 'Category not found' });
  res.json({ message: 'Deleted' });
};

// Admin: Lấy danh sách subcategories theo parent và gender
export const adminListSubcategories = async (req, res) => {
  try {
    const { parent, gender } = req.query;
    
    if (!parent) {
      return res.status(400).json({ message: 'Parent category is required' });
    }

    const filter = { parent };
    if (gender) {
      filter.gender = gender;
    }

    const subcategories = await Category.find(filter)
      .sort({ order: 1, name: 1 })
      .lean();
    
    res.json({ subcategories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Tạo subcategory mới
export const createSubcategory = async (req, res) => {
  try {
    const { name, parent, gender = 'nam' } = req.body || {};
    
    if (!name || !name.trim()) {
      return res.status(400).json({ message: 'Subcategory name is required' });
    }
    
    if (!parent) {
      return res.status(400).json({ message: 'Parent category is required' });
    }

    const slug = slugify(name);
    const exists = await Category.findOne({ slug, gender, parent });
    
    if (exists) {
      return res.status(409).json({ 
        code: 'SUBCATEGORY_TAKEN', 
        message: 'Subcategory already exists for this parent and gender' 
      });
    }

    const subcategory = await Category.create({
      name: name.trim(),
      category: slug,
      slug,
      parent,
      gender,
      active: true,
      order: 0
    });

    res.status(201).json({ subcategory });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ 
        code: 'SUBCATEGORY_TAKEN', 
        message: 'Subcategory already exists' 
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// Admin: Cập nhật subcategory
export const updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const patch = { ...req.body };
    
    if (patch.name) {
      patch.name = patch.name.trim();
      const slug = slugify(patch.name);
      patch.category = slug;
      patch.slug = slug;
    }

    const subcategory = await Category.findByIdAndUpdate(
      id,
      { $set: patch },
      { new: true, runValidators: true }
    );

    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    res.json({ subcategory });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({ 
        code: 'SUBCATEGORY_TAKEN', 
        message: 'Subcategory already exists' 
      });
    }
    res.status(500).json({ message: error.message });
  }
};

// Admin: Xóa subcategory
export const deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subcategory = await Category.findByIdAndDelete(id);
    
    if (!subcategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    res.json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
