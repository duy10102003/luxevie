import { Link } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';

export default function LoyaltyPolicy() {
  return (
    <div className="bg-white min-h-screen">
      {/* Header với Logo */}
      <div className="bg-gray-50 py-12 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-4">
            <img 
              src="https://res.cloudinary.com/dqawqvxcr/image/upload/v1761117182/LuxeVie_2_zvsptx.png" 
              alt="LUXEVIE Logo" 
              className="h-16 md:h-20 w-auto object-contain"
            />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-wide">
            LUXEVIE BEAUTY SHOP
          </h1>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <nav className="text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-gray-900">Trang chủ</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-900 font-medium">Chính sách khách hàng thân thiết</span>
        </nav>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        {/* Main Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          LUXEVIE REWARDS – CHƯƠNG TRÌNH KHÁCH HÀNG THÂN THIẾT
        </h2>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="space-y-8 text-gray-700 leading-relaxed">
            {/* Section 1 */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                1. LÀM THẾ NÀO ĐỂ TRỞ THÀNH KHÁCH HÀNG THÂN THIẾT CỦA LUXEVIE?
              </h3>
              <p className="text-base md:text-lg mb-4">
                Tất cả khách hàng khi mua sắm tại LUXEVIE BEAUTY SHOP và đăng ký thông tin (họ tên, số điện thoại) sẽ tự động trở thành Thành viên LUXEVIE REWARDS.
              </p>
              <p className="text-base md:text-lg mb-6">
                Trong suốt thời gian tham gia chương trình, khách hàng sẽ được xét hạng thành viên dựa trên tổng chi tiêu tích lũy trong 12 tháng gần nhất để nhận các quyền lợi độc quyền theo từng cấp độ.
              </p>

              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
                  CÁC CẤP ĐỘ THÀNH VIÊN
                </h4>
                <ul className="space-y-3 text-base md:text-lg">
                  <li className="flex items-start">
                    <span className="font-semibold text-gray-900 mr-2">Hạng Silver:</span>
                    <span>Miễn phí đăng ký khi mua hàng lần đầu.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold text-gray-900 mr-2">Hạng Gold:</span>
                    <span>Tổng chi tiêu trong 12 tháng đạt 10.000.000 VNĐ.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold text-gray-900 mr-2">Hạng Platinum:</span>
                    <span>Tổng chi tiêu trong 12 tháng đạt 30.000.000 VNĐ.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-semibold text-gray-900 mr-2">Hạng Diamond:</span>
                    <span>Tổng chi tiêu trong 12 tháng đạt 60.000.000 VNĐ.</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-2 text-sm md:text-base text-gray-600">
                <p>(•) Hạng thành viên được duy trì trong 12 tháng kể từ ngày thay đổi hạng gần nhất.</p>
                <p>(•) Để gia hạn hạng thành viên, khách hàng cần đạt tổng chi tiêu tương ứng trong 12 tháng kế tiếp.</p>
              </div>
            </div>

            {/* Section 2 */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                2. ƯU ĐÃI DÀNH CHO KHÁCH HÀNG THÂN THIẾT
              </h3>
              <div className="mb-4">
                <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                  Ưu đãi sinh nhật đặc biệt:
                </h4>
                <ul className="space-y-2 text-base md:text-lg">
                  <li><span className="font-semibold text-gray-900">Silver:</span> E-voucher 10%, giảm tối đa 2.000.000 VNĐ.</li>
                  <li><span className="font-semibold text-gray-900">Gold:</span> E-voucher 15%, giảm tối đa 4.000.000 VNĐ.</li>
                  <li><span className="font-semibold text-gray-900">Platinum:</span> E-voucher 20%, giảm tối đa 6.000.000 VNĐ.</li>
                  <li><span className="font-semibold text-gray-900">Diamond:</span> E-voucher 25%, giảm tối đa 8.000.000 VNĐ.</li>
                </ul>
              </div>

              <div className="mb-4">
                <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                  Voucher có thể sử dụng tại:
                </h4>
                <ul className="space-y-2 text-base md:text-lg list-disc list-inside">
                  <li>Hệ thống cửa hàng LUXEVIE BEAUTY SHOP trên toàn quốc.</li>
                  <li>Website: www.luxevie.vn.</li>
                  <li>Ứng dụng LUXEVIE App.</li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                  Điều kiện áp dụng:
                </h4>
                <ul className="space-y-2 text-base md:text-lg list-disc list-inside">
                  <li>Áp dụng cho sản phẩm nguyên giá.</li>
                  <li>Không áp dụng đồng thời với các chương trình khuyến mãi khác.</li>
                  <li>Không áp dụng đổi trả voucher sinh nhật.</li>
                  <li>Khách hàng cần cập nhật ngày sinh nhật trên ứng dụng LUXEVIE ít nhất 1 ngày trước khi kết thúc tháng sinh nhật.</li>
                  <li>E-voucher sẽ được cập nhật tự động vào mục "Ưu đãi của tôi" trong vòng 24h sau khi đủ điều kiện.</li>
                  <li>Mỗi khách hàng chỉ nhận 01 voucher sinh nhật mỗi năm.</li>
                </ul>
              </div>
            </div>

            {/* Section 3 */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                3. QUY ĐỊNH TÍCH VÀ SỬ DỤNG ĐIỂM
              </h3>
              <ul className="space-y-3 text-base md:text-lg list-disc list-inside mb-4">
                <li>Điểm sẽ được tích lũy từ đơn hàng đầu tiên trong năm dương lịch.</li>
                <li>Khách hàng cần đăng nhập ứng dụng LUXEVIE trong vòng 30 ngày kể từ ngày mua để được ghi nhận điểm.</li>
                <li>Điểm tích lũy hết hạn vào cuối năm (31/12) và được quy đổi theo chính sách hiện hành.</li>
                <li>Điểm không có giá trị quy đổi thành tiền mặt.</li>
                <li>Điểm sẽ bị trừ ngay sau khi sử dụng.</li>
              </ul>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="text-lg md:text-xl font-semibold text-gray-900 mb-3">
                  Tỷ lệ quy đổi:
                </h4>
                <ul className="space-y-2 text-base md:text-lg list-disc list-inside">
                  <li>1 điểm = 1.000 VNĐ.</li>
                  <li>Điểm có thể được sử dụng trực tiếp khi thanh toán trên ứng dụng LUXEVIE hoặc website chính thức.</li>
                  <li>Mỗi đơn hàng chỉ có thể sử dụng điểm tối đa 50% giá trị đơn hàng.</li>
                </ul>
              </div>
            </div>

            {/* Section 4 */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                4. CÁC QUY ĐỊNH KHÁC
              </h3>
              <ul className="space-y-3 text-base md:text-lg list-disc list-inside">
                <li>Khách hàng tham gia chương trình phải từ 15 tuổi trở lên.</li>
                <li>LUXEVIE không chịu trách nhiệm nếu thông tin đăng ký không chính xác hoặc khách hàng không tuân thủ thời hạn quy định.</li>
                <li>Chính sách và quyền lợi chương trình có thể được điều chỉnh tùy từng thời điểm.</li>
                <li>Chương trình không áp dụng cho khách mua sỉ hoặc mua với mục đích thương mại.</li>
                <li>Điểm tích/tiêu chỉ áp dụng tại website www.luxevie.vn, ứng dụng LUXEVIE, và các cửa hàng thuộc hệ thống LUXEVIE BEAUTY SHOP.</li>
                <li>Các đơn hàng từ sàn thương mại điện tử hoặc đối tác không thuộc LUXEVIE sẽ không được tích/tiêu điểm.</li>
              </ul>
            </div>

            {/* Section 5 */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                5. HỖ TRỢ KHÁCH HÀNG
              </h3>
              <div className="space-y-4 text-base md:text-lg">
                <div>
                  <p className="font-semibold text-gray-900">Hotline: <span className="font-normal">1900 868 379</span></p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Email: <span className="font-normal">support@luxevie.vn</span></p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Thời gian làm việc: <span className="font-normal">09h00 – 18h00, từ thứ Hai đến thứ Sáu</span></p>
                </div>
                <div>
                  <p className="font-semibold text-gray-900">Địa chỉ: <span className="font-normal">125 Nguyễn Trãi, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh</span></p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <RegistrationForm />
    </div>
  );
}

