import { useState } from 'react';
import { Link } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';

export default function PurchasePolicy() {
  const [activeTab, setActiveTab] = useState('policy'); // 'policy', 'terms', 'steps'

  const tabs = [
    { id: 'policy', label: 'CHÍNH SÁCH MUA HÀNG' },
    { id: 'terms', label: 'ĐIỀU KHOẢN MUA HÀNG ÁP DỤNG' },
    { id: 'steps', label: 'CÁC BƯỚC ĐẶT HÀNG' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">CHÍNH SÁCH MUA HÀNG</span>
          </nav>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 md:mb-12 text-center uppercase">
          CHÍNH SÁCH MUA HÀNG
        </h1>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Left Sidebar - Navigation */}
          <div className="md:col-span-1">
            <nav className="space-y-4">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 underline">CHÍNH SÁCH MUA HÀNG</h2>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`block text-left w-full text-sm md:text-base font-bold transition-colors ${
                    activeTab === tab.id
                      ? 'text-gray-900 underline'
                      : 'text-gray-700 hover:text-gray-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Right Content Area */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-lg p-6 md:p-8 shadow-sm">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
                CHÍNH SÁCH MUA HÀNG – LUXEVIE BEAUTY SHOP
              </h2>

              {/* CHÍNH SÁCH MUA HÀNG Content */}
              {activeTab === 'policy' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center">
                      <span className="mr-2">▼</span> CHÍNH SÁCH MUA HÀNG
                    </h3>

                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                      Chính sách mua hàng áp dụng cho Quý khách khi mua sắm.
                    </p>

                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                      <strong className="text-gray-900">LUXEVIE BEAUTY SHOP</strong> cung cấp các sản phẩm chính hãng dành cho khách hàng có nhu cầu mua sắm tiêu dùng với địa chỉ giao hàng trên toàn lãnh thổ Việt Nam.
                    </p>

                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                      Tất cả các đơn hàng vi phạm điều khoản mua hàng (quy định tại Mục 2) sẽ được LUXEVIE liên hệ và tiến hành hủy theo quy định.
                    </p>

                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                      Hiện tại, <strong className="text-gray-900">LUXEVIE BEAUTY SHOP</strong> chưa áp dụng chính sách bán sỉ.
                      Vì vậy, đối với các đơn hàng có dấu hiệu mua sỉ hoặc vượt quá giới hạn số lượng cho phép, LUXEVIE sẽ chủ động liên hệ và chuyển thông tin đơn hàng sang bộ phận kinh doanh sỉ để được hỗ trợ và xử lý phù hợp.
                    </p>
                  </div>

                  {/* Other sections as clickable headings */}
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <button
                      onClick={() => setActiveTab('terms')}
                      className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center hover:text-blue-600 transition-colors"
                    >
                      <span className="mr-2">▶</span> ĐIỀU KHOẢN MUA HÀNG ÁP DỤNG
                    </button>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={() => setActiveTab('steps')}
                      className="text-xl md:text-2xl font-bold text-gray-900 mb-4 flex items-center hover:text-blue-600 transition-colors"
                    >
                      <span className="mr-2">▶</span> CÁC BƯỚC ĐẶT HÀNG
                    </button>
                  </div>
                </div>
              )}

              {/* ĐIỀU KHOẢN MUA HÀNG ÁP DỤNG Content */}
              {activeTab === 'terms' && (
                <div className="space-y-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                    ĐIỀU KHOẢN MUA HÀNG ÁP DỤNG – LUXEVIE BEAUTY SHOP
                  </h3>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">1. Số lượng sản phẩm</h4>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-4 ml-4 space-y-2">
                      <li>Mỗi đơn hàng được phép mua tối đa 10 sản phẩm.</li>
                      <li>Số lượng cho một mã sản phẩm cụ thể không vượt quá 05 sản phẩm.</li>
                      <li>Những đơn hàng vượt quá số lượng quy định hoặc có dấu hiệu mua sỉ sẽ được LUXEVIE BEAUTY SHOP liên hệ để xác nhận và xử lý theo quy định riêng.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">2. Giá trị đơn hàng và phương thức thanh toán</h4>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-4 ml-4 space-y-2">
                      <li>
                        <strong className="text-gray-900">Với đơn hàng có giá trị dưới 5.000.000 VNĐ:</strong> Quý khách có thể lựa chọn tất cả các hình thức thanh toán do hệ thống hỗ trợ (bao gồm thanh toán khi nhận hàng – COD, chuyển khoản, ví điện tử, v.v.).
                      </li>
                      <li>
                        <strong className="text-gray-900">Với đơn hàng có giá trị từ 5.000.000 VNĐ trở lên:</strong> Không áp dụng hình thức thanh toán thu hộ (COD). Quý khách vui lòng lựa chọn phương thức thanh toán chuyển khoản hoặc thanh toán trực tuyến để hoàn tất đơn hàng.
                      </li>
                    </ul>
                  </div>
                </div>
              )}

              {/* CÁC BƯỚC ĐẶT HÀNG Content */}
              {activeTab === 'steps' && (
                <div className="space-y-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                    CÁC BƯỚC ĐẶT HÀNG – LUXEVIE BEAUTY SHOP
                  </h3>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Bước 1: Chọn sản phẩm</h4>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                      Quý khách chọn sản phẩm mong muốn tại website LUXEVIE BEAUTY SHOP, sau đó:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-4 ml-4 space-y-2">
                      <li>Nhấn "Thêm vào giỏ hàng" để tiếp tục mua sắm, hoặc</li>
                      <li>Nhấn "Mua ngay" để tiến hành thanh toán nhanh.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Bước 2: Kiểm tra giỏ hàng</h4>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                      Khi chọn "Mua ngay", hệ thống sẽ tự động chuyển Quý khách đến trang Giỏ hàng để xem lại danh sách sản phẩm đã chọn.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Bước 3: Tiếp tục mua sắm hoặc thanh toán</h4>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-3">
                      Tại trang Giỏ hàng, Quý khách có thể:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-4 ml-4 space-y-2">
                      <li>Chọn "Tiếp tục mua sắm" để quay lại trang sản phẩm, hoặc</li>
                      <li>Chọn "Thanh toán" để đi đến trang Check-out đơn hàng.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Bước 4: Nhập thông tin đặt hàng</h4>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                      Quý khách điền đầy đủ thông tin giao hàng (họ tên, số điện thoại, địa chỉ, ghi chú nếu có).
                      Nếu đã có tài khoản, hệ thống sẽ tự động điền thông tin mặc định.
                      Ngoài ra, Quý khách có thể nhập mã khuyến mãi nếu có để được áp dụng ưu đãi.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Bước 5: Chọn hình thức vận chuyển</h4>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-3">
                      LUXEVIE BEAUTY SHOP cung cấp 2 hình thức giao hàng linh hoạt:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-4 ml-4 space-y-2">
                      <li>Giao hàng tiêu chuẩn (Standard Delivery)</li>
                      <li>Giao hàng nhanh 2H – 4H (Áp dụng cho khu vực nội thành và sản phẩm đủ điều kiện)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Bước 6: Chọn phương thức thanh toán</h4>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                      LUXEVIE hỗ trợ nhiều hình thức thanh toán tiện lợi.
                    </p>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-4 ml-4 space-y-2">
                      <li>Thanh toán khi nhận hàng (COD)</li>
                      <li>Chuyển khoản ngân hàng</li>
                      <li>Thanh toán trực tuyến (Ví điện tử, thẻ tín dụng/ghi nợ)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3">Bước 7: Xác nhận đơn hàng</h4>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                      Sau khi hoàn tất, nhấn "Hoàn tất đơn hàng".
                      Hệ thống của LUXEVIE BEAUTY SHOP sẽ tự động gửi xác nhận đơn hàng qua SMS và email đến Quý khách.
                    </p>
                  </div>
                </div>
              )}
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

