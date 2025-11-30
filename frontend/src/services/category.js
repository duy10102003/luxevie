// // frontend/src/services/category.js
// import api from './api';

// export async function fetchCategories() {
//   const { data } = await api.get('/categories');
//   return data.categories || [];
// }
// src/services/category.js
import api from './api';

export async function fetchCategories() {
  const { data } = await api.get('/categories');
  return data.categories || [];
}

export async function fetchTopCategoriesByGender(gender) {
  const params = new URLSearchParams();
  if (gender) params.set('gender', gender);
  params.set('parent', 'null');
  const { data } = await api.get(`/categories?${params.toString()}`);
  return data.categories || [];
}

export async function fetchSubcategories(parentSlugOrId, gender) {
  const params = new URLSearchParams();
  if (parentSlugOrId) params.set('parent', parentSlugOrId);
  if (gender) params.set('gender', gender);
  const { data } = await api.get(`/categories?${params.toString()}`);
  return data.categories || [];
}
