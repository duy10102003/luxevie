import api, { extractError } from './api';

export async function listAdminProducts(params = {}) {
  try {
    const { data } = await api.get('/admin/products', { params });
    return data;
  } catch (error) {
    throw extractError(error);
  }
}

export async function getAdminProduct(id) {
  try {
    const { data } = await api.get(`/admin/products/${id}`);
    return data;
  } catch (error) {
    throw extractError(error);
  }
}

export async function createAdminProduct(productData) {
  try {
    const { data } = await api.post('/admin/products', productData);
    return data;
  } catch (error) {
    throw extractError(error);
  }
}

export async function updateAdminProduct(id, productData) {
  try {
    const { data } = await api.patch(`/admin/products/${id}`, productData);
    return data;
  } catch (error) {
    throw extractError(error);
  }
}

export async function deleteAdminProduct(id) {
  try {
    const { data } = await api.delete(`/admin/products/${id}`);
    return data;
  } catch (error) {
    throw extractError(error);
  }
}
