import { useState } from 'react';
import { Link } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';

export default function PrivacyPolicy() {
  const [activeTab, setActiveTab] = useState('sharing'); // 'use', 'sharing', 'security', 'spam', 'contact'

  const tabs = [
    { id: 'use', label: 'SỬ DỤNG THÔNG TIN CÁ NHÂN' },
    { id: 'sharing', label: 'CHIA SẺ THÔNG TIN CÁ NHÂN' },
    { id: 'security', label: 'BẢO MẬT THÔNG TIN CÁ NHÂN' },
    { id: 'spam', label: 'QUY ĐỊNH VỀ "SPAM"' },
    { id: 'contact', label: 'THÔNG TIN LIÊN HỆ' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">CHÍNH SÁCH BẢO MẬT</span>
          </nav>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 md:mb-12 text-center uppercase">
          CHÍNH SÁCH BẢO MẬT
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
              {/* SỬ DỤNG THÔNG TIN CÁ NHÂN Content */}
              {activeTab === 'use' && (
                <div className="space-y-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                    SỬ DỤNG THÔNG TIN CÁ NHÂN
                  </h3>

                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                    Chúng tôi thu thập và sử dụng thông tin cá nhân của khách hàng chỉ cho các mục đích hợp lý và đúng quy định trong "Chính sách bảo mật" này.
                  </p>

                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                    Khi cần thiết, thông tin của bạn có thể được sử dụng để liên hệ trực tiếp thông qua các hình thức như:
                  </p>

                  <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-4 space-y-2">
                    <li>Gửi thư ngỏ, xác nhận đơn hàng, thư cảm ơn;</li>
                    <li>Cung cấp thông tin về chương trình khuyến mãi, sản phẩm mới hoặc ưu đãi đặc biệt.</li>
                  </ul>
                </div>
              )}

              {/* CHIA SẺ THÔNG TIN CÁ NHÂN Content */}
              {activeTab === 'sharing' && (
                <div className="space-y-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                    CHIA SẺ THÔNG TIN CÁ NHÂN
                  </h3>

                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                    Chúng tôi cam kết bảo mật tuyệt đối và không chia sẻ thông tin cá nhân của khách hàng cho bên thứ ba, ngoại trừ các trường hợp được quy định cụ thể dưới đây:
                  </p>

                  <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-4 space-y-3">
                    <li>
                      <strong className="text-gray-900">(a)</strong> Khi có yêu cầu bằng văn bản từ cơ quan nhà nước có thẩm quyền theo đúng quy định của pháp luật.
                    </li>
                    <li>
                      <strong className="text-gray-900">(b)</strong> Khi việc chia sẻ thông tin là cần thiết để bảo vệ quyền lợi hợp pháp của công ty trước pháp luật.
                    </li>
                    <li>
                      <strong className="text-gray-900">(c)</strong> Trong những tình huống khẩn cấp, khi việc tiết lộ thông tin là cần thiết để bảo vệ an toàn cá nhân hoặc quyền lợi hợp pháp của người tiêu dùng và cộng đồng.
                    </li>
                  </ul>
                </div>
              )}

              {/* BẢO MẬT THÔNG TIN CÁ NHÂN Content */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                    BẢO MẬT THÔNG TIN CÁ NHÂN
                  </h3>

                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                    <strong className="text-gray-900">Công ty Cổ phần LUXEVIE Beauty Shop</strong> cam kết bảo mật tuyệt đối thông tin cá nhân của khách hàng bằng mọi biện pháp kỹ thuật và quy trình an toàn cần thiết.
                  </p>

                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                    Chúng tôi áp dụng các công nghệ bảo mật tiên tiến, thường xuyên cập nhật và kiểm tra hệ thống để đảm bảo dữ liệu của bạn không bị truy cập trái phép, sử dụng sai mục đích hoặc tiết lộ ngoài ý muốn.
                  </p>

                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
                    Mọi thông tin cá nhân của khách hàng chỉ được lưu trữ và xử lý trong phạm vi cần thiết cho hoạt động kinh doanh và tuân thủ đầy đủ các quy định của pháp luật về bảo vệ dữ liệu cá nhân.
                  </p>
                </div>
              )}

              {/* QUY ĐỊNH VỀ "SPAM" Content */}
              {activeTab === 'spam' && (
                <div className="space-y-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                    QUY ĐỊNH VỀ "SPAM"
                  </h3>

                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                    <strong className="text-gray-900">Công ty Cổ phần LUXEVIE Beauty Shop</strong> luôn quan tâm và nghiêm túc trong việc phòng chống thư rác (Spam) cũng như các email giả mạo danh nghĩa thương hiệu.
                  </p>

                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                    Chúng tôi chỉ gửi email cho khách hàng khi có sự đồng ý, đăng ký hoặc sử dụng dịch vụ từ hệ thống của LUXEVIE Beauty Shop.
                  </p>

                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                    Chúng tôi cam kết không bán, cho thuê hay chia sẻ địa chỉ email của khách hàng cho bất kỳ bên thứ ba nào vì mục đích thương mại.
                  </p>

                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
                    Nếu Quý khách vô tình nhận được email không mong muốn từ hệ thống của chúng tôi, vui lòng nhấn vào liên kết hủy đăng ký đi kèm trong email hoặc liên hệ trực tiếp với bộ phận Chăm sóc Khách hàng để được hỗ trợ xử lý ngay.
                  </p>
                </div>
              )}

              {/* THÔNG TIN LIÊN HỆ Content */}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                    THÔNG TIN LIÊN HỆ
                  </h3>

                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                    Chúng tôi luôn trân trọng mọi ý kiến đóng góp, phản hồi và thắc mắc từ Quý khách về nội dung "Chính sách bảo mật".
                  </p>

                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                    Nếu có bất kỳ câu hỏi hoặc yêu cầu hỗ trợ nào, vui lòng liên hệ với chúng tôi qua email:
                  </p>

                  <div className="bg-gray-50 rounded-lg p-6 mb-4">
                    <p className="text-lg md:text-xl font-semibold text-gray-900">
                      📧 customercare@luxevie.vn
                    </p>
                  </div>

                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
                    Đội ngũ LUXEVIE Beauty Shop luôn sẵn sàng lắng nghe và hỗ trợ Quý khách một cách nhanh chóng và chu đáo nhất.
                  </p>
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

