// frontend/src/services/report.js
import api from './api.js';

/**
 * Xuất báo cáo Excel theo tháng
 * @param {number} month - Tháng (1-12)
 * @param {number} year - Năm (>= 2000)
 * @returns {Promise<Blob>} - File Excel dưới dạng Blob
 */
export async function exportExcelReport(month, year) {
  const response = await api.get('/report/export-excel', {
    params: { month, year },
    responseType: 'blob' // Quan trọng: phải set responseType là 'blob'
  });

  return response.data; // Trả về Blob
}

