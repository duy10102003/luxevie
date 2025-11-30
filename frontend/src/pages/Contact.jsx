import { useState } from 'react';
import { Link } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';

export default function Contact() {
  const [activeTab, setActiveTab] = useState('about'); // 'about', 'brand', 'support'

  const tabs = [
    { id: 'about', label: 'VỀ MAISON' },
    { id: 'brand', label: 'THƯƠNG HIỆU' },
    { id: 'support', label: 'LIÊN HỆ HỖ TRỢ KHÁCH HÀNG' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">LIÊN HỆ</span>
          </nav>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 md:mb-12 text-center">
          LIÊN HỆ
        </h1>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          {/* Left Sidebar - Navigation */}
          <div className="md:col-span-1">
            <nav className="space-y-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`block text-left w-full text-base md:text-lg font-bold transition-colors ${
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
              {/* VỀ MAISON Content */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                    Vào những năm 2020, <strong className="text-gray-900">LUXEVIE BEAUTY SHOP</strong> được thành lập và nhanh chóng khẳng định vị thế là một trong những thương hiệu thời trang và làm đẹp chính hãng hàng đầu tại Việt Nam.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                    LUXEVIE không chỉ mang đến những xu hướng thời trang và làm đẹp mới nhất từ khắp nơi trên thế giới, mà còn xây dựng một nền tảng mua sắm hiện đại, dịch vụ tận tâm và chuyên nghiệp. Với sứ mệnh tôn vinh phong cách và vẻ đẹp của mỗi khách hàng, LUXEVIE hướng tới mục tiêu biến Việt Nam trở thành điểm đến thời trang đẳng cấp cho mọi tín đồ yêu cái đẹp.
                  </p>
                </div>
              )}

              {/* THƯƠNG HIỆU Content */}
              {activeTab === 'brand' && (
                <div className="space-y-6">
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                    LUXEVIE BEAUTY SHOP tự hào là đại lý chính thức của nhiều thương hiệu thời trang và làm đẹp hàng đầu thế giới.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                    Chúng tôi cam kết mang đến cho khách hàng những sản phẩm chính hãng, chất lượng cao với đầy đủ chứng từ và bảo hành từ nhà sản xuất.
                  </p>
                </div>
              )}

              {/* LIÊN HỆ HỖ TRỢ KHÁCH HÀNG Content */}
              {activeTab === 'support' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                      Hotline LUXEVIE BEAUTY SHOP: <span className="font-normal">1900 868 379</span>
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      <em>Thời gian làm việc:</em> 09h00 - 18h00, từ thứ Hai đến thứ Sáu (không áp dụng vào các ngày Lễ)
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                      Email: <span className="font-normal">support@luxevie.vn</span>
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      <em>Thời gian làm việc:</em> 09h00 - 18h00, từ thứ Hai đến thứ Sáu
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                      Live Chat:
                    </h3>
                    <p className="text-gray-600 text-sm md:text-base">
                      <span className="mr-1">⏰</span> <em>Thời gian hỗ trợ:</em> 09h00 - 21h00, từ thứ Hai đến Chủ Nhật
                    </p>
                  </div>

                  <div>
                    <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                      Địa chỉ văn phòng LUXEVIE:
                    </h3>
                    <p className="text-gray-700 text-base md:text-lg">
                      125 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh
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

