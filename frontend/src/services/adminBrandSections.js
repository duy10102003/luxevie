import api, { extractError } from './api';

export async function listAdminBrandSections() {
  try {
    const { data } = await api.get('/admin/brand-sections');
    return data;
  } catch (error) {
    throw extractError(error);
  }
}

export async function getAdminBrandSection(id) {
  try {
    const { data } = await api.get(`/admin/brand-sections/${id}`);
    return data;
  } catch (error) {
    throw extractError(error);
  }
}

export async function createAdminBrandSection(payload) {
  try {
    const { data } = await api.post('/admin/brand-sections', payload);
    return data;
  } catch (error) {
    throw extractError(error);
  }
}

export async function updateAdminBrandSection(id, payload) {
  try {
    const { data } = await api.put(`/admin/brand-sections/${id}`, payload);
    return data;
  } catch (error) {
    throw extractError(error);
  }
}

export async function deleteAdminBrandSection(id) {
  try {
    const { data } = await api.delete(`/admin/brand-sections/${id}`);
    return data;
  } catch (error) {
    throw extractError(error);
  }
}

// Public API
export async function listBrandSections() {
  try {
    const { data } = await api.get('/brand-sections');
    return data;
  } catch (error) {
    throw extractError(error);
  }
}

