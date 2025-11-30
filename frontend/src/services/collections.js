import api from './api';

// Predefined collections list
const PREDEFINED_COLLECTIONS = [
  { slug: 'quan', name: 'QUẦN' },
  { slug: 'quan-jean', name: 'QUẦN JEAN' },
  { slug: 'quan-short', name: 'QUẦN SHORT' },
  { slug: 'quan-dai', name: 'QUẦN DÀI' },
  { slug: 'quan-lot', name: 'QUẦN LÓT' },
  { slug: 'ao', name: 'ÁO' },
  { slug: 'ao-thun', name: 'ÁO THUN' },
  { slug: 'ao-so-mi', name: 'ÁO SƠ MI' },
  { slug: 'ao-hoodie', name: 'ÁO HOODIE' },
  { slug: 'ao-khoac', name: 'ÁO KHOÁC' },
  { slug: 'ao-len', name: 'ÁO LEN' },
  { slug: 'phu-kien', name: 'PHỤ KIỆN' },
  { slug: 'non', name: 'NÓN' },
  { slug: 'day-nit', name: 'DÂY NỊT' },
  { slug: 'vi', name: 'VÍ' },
  { slug: 'tui-deo', name: 'TÚI ĐEO' },
  { slug: 'balo', name: 'BALO' },
];

export const getCollections = async () => {
  // Return predefined collections immediately
  return PREDEFINED_COLLECTIONS;
};

export const getCategories = async () => {
  try {
    const response = await api.get('/meta/nav-facets');
    return response.data.categories || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};
