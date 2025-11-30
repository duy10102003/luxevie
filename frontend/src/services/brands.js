// frontend/src/services/brands.js
import api from './api';

export async function fetchBrands() {
  const { data } = await api.get('/brands');
  return data.brands || [];
}

