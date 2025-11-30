// frontend/src/components/BtnExportReport.jsx
import { useState } from 'react';
import { exportExcelReport } from '../services/report.js';

export default function BtnExportReport({ className = '' }) {
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Lấy tháng và năm hiện tại
  const now = new Date();
  const [month, setMonth] = useState((now.getMonth() + 1).toString());
  const [year, setYear] = useState(now.getFullYear().toString());

  const handleExport = async () => {
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (!monthNum || !yearNum || monthNum < 1 || monthNum > 12) {
      alert('Vui lòng chọn tháng và năm hợp lệ!');
      return;
    }

    setLoading(true);
    try {
      // Gọi API để lấy file Excel dưới dạng Blob
      const blob = await exportExcelReport(monthNum, yearNum);

      // Tạo URL từ Blob
      const url = window.URL.createObjectURL(blob);
      
      // Tạo thẻ <a> để tải file
      const a = document.createElement('a');
      a.href = url;
      a.download = `baocao-thang-${monthNum.toString().padStart(2, '0')}-${yearNum}.xlsx`;
      document.body.appendChild(a);
      a.click();
      
      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // Đóng modal
      setShowModal(false);
      
      // Có thể hiển thị thông báo thành công
      console.log('✅ Xuất báo cáo thành công!');
    } catch (error) {
      console.error('❌ Lỗi khi xuất báo cáo:', error);
      alert('Có lỗi xảy ra khi xuất báo cáo. Vui lòng thử lại!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className={`px-3 py-2 rounded-lg border bg-white text-sm hover:bg-gray-50 ${className}`}
        disabled={loading}
      >
        {loading ? 'Đang xuất...' : 'Xuất báo cáo'}
      </button>

      {/* Modal chọn tháng/năm */}
      {showModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => !loading && setShowModal(false)}
        >
          <div 
            className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-xl font-semibold mb-4">Xuất báo cáo Excel</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tháng
                </label>
                <select
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full rounded-lg border px-3 py-2 bg-white text-sm"
                  disabled={loading}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
                    <option key={m} value={m}>
                      Tháng {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Năm
                </label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  min="2000"
                  max={now.getFullYear() + 1}
                  className="w-full rounded-lg border px-3 py-2 bg-white text-sm"
                  disabled={loading}
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg border bg-white text-sm hover:bg-gray-50 disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                onClick={handleExport}
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Đang xuất...' : 'Xuất báo cáo'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

