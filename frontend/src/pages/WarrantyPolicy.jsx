import { Link } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';

export default function WarrantyPolicy() {
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">CHÍNH SÁCH BẢO HÀNH</span>
          </nav>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 md:mb-12 text-center uppercase">
          CHÍNH SÁCH BẢO HÀNH
        </h1>

        {/* Content Area */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-8">
              CHÍNH SÁCH BẢO HÀNH ĐỒNG HỒ COACH
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2 text-gray-500">▶</span> 1. Quy định chung
                </h3>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-4 space-y-2">
                  <li>Áp dụng cho sản phẩm đồng hồ Coach mua tại MaisonOnline.vn.</li>
                  <li>Chính sách bảo hành được thực hiện bởi đại diện Trí Linh - Tân Tân Watch.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2 text-gray-500">▶</span> 2. Thời gian bảo hành
                </h3>
                <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-4">
                  01 năm kể từ ngày giao hàng thành công.
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2 text-gray-500">▶</span> 3. Điều kiện bảo hành
                </h3>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-4 space-y-2">
                  <li>Có phiếu bảo hành chính hãng có mộc Tân Tân Watch hoặc biên nhận đầy đủ thông tin.</li>
                  <li>Phiếu còn nguyên vẹn, không rách hoặc mờ.</li>
                  <li>Đồng hồ còn trong thời hạn bảo hành.</li>
                  <li>Chỉ bảo hành, thay mới linh kiện hỏng, không đổi đồng hồ khác.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2 text-gray-500">▶</span> 4. Trường hợp từ chối bảo hành
                </h3>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-4 space-y-2">
                  <li>Hư hỏng do bảo quản sai, va chạm, nước (nếu không chống nước).</li>
                  <li>Phiếu bảo hành rách, chấp vá, hoen ố.</li>
                  <li>Tự ý sửa chữa tại nơi không được ủy quyền.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2 text-gray-500">▶</span> 5. Lưu ý
                </h3>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-4 space-y-2">
                  <li>Bảo hành chỉ áp dụng cho bộ máy bên trong.</li>
                  <li>Nếu cần thay thế đồng hồ khác, sẽ được đổi mẫu tương đương giá trị.</li>
                  <li>Đồng hồ thay thế được bảo hành 2 năm kể từ ngày nhận.</li>
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <span className="mr-2 text-gray-500">▶</span> 6. Liên hệ bảo hành
                </h3>
                <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-4 space-y-2">
                  <li>Khách hàng gửi đồng hồ kèm hóa đơn/phiếu bảo hành và mô tả lỗi đến trung tâm Tân Tân Watch hoặc đại lý bảo hành gần nhất.</li>
                  <li>Với trường hợp ngoài phạm vi bảo hành, phí dịch vụ tùy loại đồng hồ và yêu cầu sửa chữa.</li>
                  <li>Không gửi bao bì gốc, đảm bảo đóng gói cẩn thận khi vận chuyển.</li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <span className="mr-2 text-gray-500">▶</span> 7. Trung tâm bảo hành
                </h3>
                <div className="bg-gray-50 rounded-lg p-6 ml-4">
                  <p className="text-xl font-bold text-gray-900 mb-4">Tân Tân Watch</p>
                  <div className="space-y-2 text-gray-700 text-base md:text-lg">
                    <p>📍 285 Lý Tự Trọng, Bến Thành, Quận 1, TP.HCM</p>
                    <p>📞 028 3821 8297</p>
                    <p>📱 Hotline: 1800 9027 – 098 3831 547</p>
                    <p>🕘 Giờ làm việc: 9h – 18h hàng ngày</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <RegistrationForm />

      {/* Floating Chat Icon */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 transition-colors"
          aria-label="Live Chat"
          onClick={() => {
            // TODO: Implement chat functionality
            alert('Live Chat sẽ được triển khai trong tương lai');
          }}
        >
          <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}

