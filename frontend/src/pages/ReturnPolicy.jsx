import { useState } from 'react';
import { Link } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';

export default function ReturnPolicy() {
  const [activeTab, setActiveTab] = useState('general'); // 'general', 'content', 'process'

  const tabs = [
    { id: 'general', label: 'QUY ĐỊNH CHUNG' },
    { id: 'content', label: 'NỘI DUNG CHÍNH SÁCH ĐỔI/TRẢ' },
    { id: 'process', label: 'QUY TRÌNH TIẾP NHẬN VÀ XỬ LÝ' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">CHÍNH SÁCH ĐỔI TRẢ</span>
          </nav>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 md:mb-12 text-center uppercase">
          CHÍNH SÁCH ĐỔI TRẢ
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
              {/* QUY ĐỊNH CHUNG Content */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                    QUY ĐỊNH CHUNG – LUXEVIE BEAUTY SHOP
                  </h3>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2 text-gray-500">▶</span> 1. Phạm vi áp dụng
                    </h4>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-4 space-y-2">
                      <li>Áp dụng cho tất cả khách hàng mua sắm tại website LUXEVIE BEAUTY SHOP.</li>
                      <li>Áp dụng cho mọi hình thức thanh toán được hỗ trợ trên website.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2 text-gray-500">▶</span> 2. Thời hạn đổi – trả hàng
                    </h4>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-4 space-y-2">
                      <li>Đổi hàng / Hoàn coupon: Trong vòng 30 ngày kể từ ngày nhận sản phẩm.</li>
                      <li>Trả hàng / Hoàn tiền: Trong vòng 03 ngày kể từ ngày nhận sản phẩm.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2 text-gray-500">▶</span> 3. Chính sách theo giá trị sản phẩm
                    </h4>
                    
                    <div className="mb-4">
                      <p className="text-base md:text-lg font-semibold text-gray-900 mb-2">a. Hàng nguyên giá</p>
                      <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-3 ml-4 space-y-1">
                        <li>Trong 03 ngày đầu: Hoàn tiền theo phương thức thanh toán ban đầu.</li>
                        <li>Sau 03 ngày (tối đa 30 ngày): Hoàn bằng coupon có giá trị tương đương.</li>
                      </ul>
                    </div>

                    <div className="mb-4">
                      <p className="text-base md:text-lg font-semibold text-gray-900 mb-2">b. Hàng giảm giá sâu / Xả hàng cuối mùa (Clearance / Markdown)</p>
                      <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-3 ml-4 space-y-1">
                        <li>Không áp dụng đổi – trả.</li>
                        <li>Ngoại lệ: Nếu sản phẩm bị lỗi kỹ thuật hoặc lỗi từ phía LUXEVIE, sẽ được hỗ trợ đổi hoặc trả theo chính sách sản phẩm lỗi.</li>
                      </ul>
                    </div>

                    <div className="mb-6">
                      <p className="text-base md:text-lg font-semibold text-gray-900 mb-2">c. Hàng khuyến mãi (Voucher / Promotion code / Extra scheme)</p>
                      <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-3 ml-4 space-y-1">
                        <li>Áp dụng tương tự hàng nguyên giá.</li>
                        <li>Trong 03 ngày đầu: Hoàn tiền theo phương thức thanh toán ban đầu.</li>
                        <li>Sau 03 ngày (tối đa 30 ngày): Hoàn bằng coupon.</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2 text-gray-500">▶</span> 4. Các sản phẩm không áp dụng đổi – trả
                    </h4>
                    
                    <div className="mb-4">
                      <p className="text-base md:text-lg font-semibold text-gray-900 mb-2">a. Đồ lót & đồ bơi</p>
                      <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-3 ml-4 space-y-1">
                        <li>Không áp dụng đổi – trả vì lý do vệ sinh.</li>
                        <li>Adidas Underwear: Sản phẩm được đóng hộp và niêm phong. Khách hàng chỉ đồng kiểm ngoại quan cùng shipper (không tháo seal).</li>
                        <li>Khiếu nại cần cung cấp video quay lại quá trình đồng kiểm để LUXEVIE có cơ sở hỗ trợ.</li>
                      </ul>
                    </div>

                    <div className="mb-4">
                      <p className="text-base md:text-lg font-semibold text-gray-900 mb-2">b. Phụ kiện</p>
                      <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-3 ml-4">
                        Không áp dụng đổi – trả đối với các sản phẩm: nón, vớ, khăn, trang sức, móc khóa, ốp lưng, thắt lưng, khẩu trang, sản phẩm chăm sóc giày (shoecare).
                      </p>
                    </div>

                    <div className="mb-4">
                      <p className="text-base md:text-lg font-semibold text-gray-900 mb-2">c. Mỹ phẩm & nước hoa</p>
                      <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-3 ml-4">
                        Không áp dụng đổi – trả theo quy định về sản phẩm làm đẹp.
                      </p>
                    </div>

                    <div className="mb-4">
                      <p className="text-base md:text-lg font-semibold text-gray-900 mb-2">d. Đồng hồ</p>
                      <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-3 ml-4">
                        Chỉ áp dụng đổi hoặc bảo hành nếu sản phẩm bị lỗi kỹ thuật từ nhà sản xuất.
                      </p>
                    </div>

                    <div className="mb-6">
                      <p className="text-base md:text-lg font-semibold text-gray-900 mb-2">e. Một số thương hiệu đặc thù</p>
                      <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-3 ml-4 space-y-1">
                        <li>Chỉ đổi size (không đổi mẫu / không trả hàng): New Balance, On Running, Vera, Owen, K-Swiss, Jockey, v.v.</li>
                        <li>Chỉ đổi hàng (không trả hàng): Dyson, La Gourmet, Joseph Joseph, Hush Puppies, Travelines, IT Luggage, v.v.</li>
                      </ul>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2 text-gray-500">▶</span> 5. Chính sách hoàn coupon
                    </h4>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-4 ml-4 space-y-2">
                      <li>Coupon có giá trị tương đương số tiền thanh toán cho sản phẩm (không bao gồm phí vận chuyển hoặc giảm giá).</li>
                      <li>Thời hạn sử dụng: 45 ngày kể từ ngày phát hành.</li>
                      <li>Coupon chỉ được sử dụng để mua hàng trên LUXEVIE BEAUTY SHOP, không quy đổi thành tiền mặt.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* NỘI DUNG CHÍNH SÁCH ĐỔI/TRẢ Content */}
              {activeTab === 'content' && (
                <div className="space-y-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                    CHÍNH SÁCH ĐỔI / TRẢ HÀNG – LUXEVIE BEAUTY SHOP
                  </h3>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2 text-gray-500">▶</span> 1. Quy định chung
                    </h4>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-4 space-y-2">
                      <li>Mỗi sản phẩm chỉ được hỗ trợ đổi hoặc trả 01 lần duy nhất.</li>
                      <li>Trong trường hợp khách hàng đã đổi hàng nhưng sản phẩm mới vẫn phát sinh lỗi từ phía LUXEVIE (như lỗi kỹ thuật, lỗi sản xuất, giao sai mẫu, sai hình ảnh…), và khách hàng không còn nhu cầu đổi, LUXEVIE sẽ tiến hành hoàn tiền theo đúng quy trình xử lý hoàn tiền của hệ thống.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2 text-gray-500">▶</span> 2. Giá trị sản phẩm đổi / trả
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-4">
                      Giá trị sản phẩm được tính theo giá trị thanh toán thực tế của đơn hàng gốc (không bao gồm chi phí vận chuyển).
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2 text-gray-500">▶</span> 3. Quy định tiếp nhận hàng gửi trả
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-3 ml-4">
                      Sau khi LUXEVIE thẩm định sản phẩm được gửi trả, nếu sản phẩm không đáp ứng điều kiện đổi/trả, LUXEVIE có quyền từ chối giao dịch.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-3 ml-4">
                      Bộ phận chăm sóc khách hàng (CSKH) sẽ liên hệ để:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-8 space-y-2">
                      <li>Gửi lại sản phẩm về cho khách hàng (chi phí vận chuyển do khách hàng chi trả), hoặc</li>
                      <li>Trong trường hợp khách hàng từ chối nhận lại hoặc không thanh toán phí vận chuyển, sản phẩm sẽ được hoàn về LUXEVIE và LUXEVIE toàn quyền xử lý sản phẩm này.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2 text-gray-500">▶</span> 4. Trách nhiệm chi phí vận chuyển
                    </h4>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-4 space-y-2">
                      <li>Nếu lỗi phát sinh từ phía LUXEVIE, chúng tôi sẽ chịu toàn bộ chi phí vận chuyển hai chiều.</li>
                      <li>Nếu phát sinh từ nhu cầu cá nhân của khách hàng (không phải lỗi sản phẩm), khách hàng sẽ chịu chi phí vận chuyển khi gửi hàng đổi/trả về cho LUXEVIE.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2 text-gray-500">▶</span> 5. Cung cấp thông tin xác minh sản phẩm lỗi
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-3 ml-4">
                      LUXEVIE rất tiếc vì những bất tiện mà Quý khách gặp phải. Để đảm bảo xử lý nhanh chóng và chính xác, vui lòng cung cấp video hoặc hình ảnh mở hộp (unboxing) thể hiện rõ tình trạng sản phẩm khi nhận hàng.
                    </p>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-4 space-y-2">
                      <li>Video/hình ảnh có thể gửi qua email hoặc kênh liên lạc chính thức của LUXEVIE.</li>
                      <li>Việc cung cấp video/hình ảnh giúp chúng tôi xác minh lỗi, đánh giá đúng tình trạng sản phẩm và hỗ trợ đổi/trả nhanh chóng, công bằng, minh bạch.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2 text-gray-500">▶</span> 6. Thời hạn tiếp nhận phản ánh
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4 ml-4">
                      LUXEVIE tiếp nhận và xử lý phản ánh trong vòng 07 ngày kể từ ngày đơn hàng được giao hoàn tất.
                    </p>
                  </div>
                </div>
              )}

              {/* QUY TRÌNH TIẾP NHẬN VÀ XỬ LÝ Content */}
              {activeTab === 'process' && (
                <div className="space-y-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">
                    QUY TRÌNH TIẾP NHẬN VÀ XỬ LÝ ĐỔI / TRẢ HÀNG
                  </h3>

                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
                    Tất cả quy trình thực hiện và xử lý đổi/trả, LUXEVIE BEAUTY SHOP tương tác chính qua email hoặc hotline gửi đến Quý khách.
                  </p>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2 text-gray-500">▶</span> 1. Hình thức liên hệ và xử lý
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-3 ml-4">
                      Toàn bộ quá trình tiếp nhận và xử lý đổi/trả hàng của LUXEVIE BEAUTY SHOP được thực hiện trực tiếp qua email hoặc hotline.
                    </p>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-4 space-y-2">
                      <li>Email: support@luxevie.vn</li>
                      <li>Hotline: 1900 6789 (giờ hành chính từ thứ 2 đến thứ 7)</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2 text-gray-500">▶</span> 2. Điều kiện sản phẩm đủ tiêu chuẩn đổi/trả
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-3 ml-4">
                      Để đảm bảo quyền lợi của khách hàng, sản phẩm gửi đổi/trả cần đáp ứng đầy đủ các điều kiện sau:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-4 space-y-2">
                      <li>Sản phẩm chưa qua sử dụng, chưa giặt/là, không có mùi lạ.</li>
                      <li>Còn nguyên nhãn mác, bao bì, hộp và quà tặng kèm (nếu có).</li>
                      <li>Không bị hư hỏng, trầy xước, móp méo trong quá trình lưu giữ hoặc vận chuyển từ phía khách hàng.</li>
                      <li>Khách hàng cần có hóa đơn / chứng từ mua hàng hợp lệ tại LUXEVIE BEAUTY SHOP.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2 text-gray-500">▶</span> 3. Địa điểm tiếp nhận hàng đổi/trả
                    </h4>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-3 ml-4">
                      Sau khi bộ phận Chăm sóc khách hàng (CSKH) tiếp nhận yêu cầu, LUXEVIE sẽ gửi email hướng dẫn chi tiết địa chỉ nhận hàng để Quý khách gửi sản phẩm đổi/trả.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-4">
                      Mọi thắc mắc, vui lòng liên hệ hotline 1900 6789 để được hỗ trợ nhanh nhất.
                    </p>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2 text-gray-500">▶</span> 4. Lưu ý khi gửi hàng qua dịch vụ chuyển phát
                    </h4>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-4 space-y-2">
                      <li>LUXEVIE không chịu trách nhiệm đối với tình trạng thiếu, mất hoặc hư hỏng sản phẩm trong quá trình vận chuyển nếu khách hàng gửi qua đơn vị giao hàng.</li>
                      <li>Quý khách vui lòng đóng gói kỹ lưỡng, tránh va đập hoặc rách hộp sản phẩm.</li>
                      <li>Khuyến nghị: Chụp ảnh hoặc quay video sản phẩm trước khi gửi để làm căn cứ đối chiếu khi có sự cố phát sinh.</li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2 text-gray-500">▶</span> 5. Quy trình thực hiện đổi/trả
                    </h4>
                    <ol className="list-decimal list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-4 space-y-3">
                      <li>
                        <strong>Bước 1:</strong> Liên hệ Hotline 1900 6789 hoặc email support@luxevie.vn để thông báo nhu cầu đổi/trả.
                      </li>
                      <li>
                        <strong>Bước 2:</strong> Bộ phận CSKH tiếp nhận, hướng dẫn quy trình và gửi email xác nhận.
                      </li>
                      <li>
                        <strong>Bước 3:</strong> Gửi sản phẩm cần đổi/trả đến địa chỉ được cung cấp.
                      </li>
                      <li>
                        <strong>Bước 4:</strong> LUXEVIE kiểm tra và đánh giá tình trạng sản phẩm dựa trên điều kiện đổi/trả hàng.
                      </li>
                      <li>
                        <strong>Bước 5:</strong> Xác nhận kết quả xử lý:
                        <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                          <li>✅ Đổi hàng: Khách hàng nhận coupon có giá trị tương ứng với đơn hàng cũ, dùng để đặt sản phẩm mới trên luxevie.vn hoặc liên hệ CSKH để được hỗ trợ.</li>
                          <li>💰 Trả hàng: Hoàn tiền hoặc cấp coupon tương ứng với giá trị thanh toán ban đầu (không bao gồm phí vận chuyển).</li>
                          <li>❌ Không chấp thuận: CSKH sẽ thông báo rõ lý do và gửi trả lại sản phẩm về cho khách hàng.</li>
                        </ul>
                      </li>
                    </ol>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <span className="mr-2 text-gray-500">▶</span> 6. Phương thức hoàn tiền / hoàn coupon
                    </h4>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-4 space-y-3">
                      <li>
                        <strong>Phương thức 1 – Coupon điện tử:</strong>
                        <br />Gửi tự động qua email, có giá trị 45 ngày kể từ ngày phát hành.
                      </li>
                      <li>
                        <strong>Phương thức 2 – Thanh toán qua ZaloPay / VNPay / Thẻ Visa / Mastercard / JCB / ATM nội địa:</strong>
                        <br />Hoàn tiền trong 7–10 ngày làm việc kể từ khi yêu cầu được xác nhận hoàn tất.
                      </li>
                      <li>
                        <strong>Phương thức 3 – Thanh toán COD:</strong>
                        <br />Hoàn tiền trực tiếp vào tài khoản ngân hàng của khách hàng trong 7–10 ngày làm việc sau khi xác nhận.
                      </li>
                      <li>
                        <strong>Phương thức 4 – Thanh toán qua ví MoMo / ShopeePay:</strong>
                        <br />Hoàn tiền trực tiếp vào ví điện tử trong 3–4 ngày làm việc sau khi xác nhận hoàn tất yêu cầu.
                      </li>
                    </ul>
                  </div>

                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4 font-semibold">
                      LUXEVIE BEAUTY SHOP – Nơi mang đến phong cách, chất lượng và dịch vụ tận tâm dành cho bạn.
                    </p>
                    <div className="space-y-2 text-gray-700 text-base md:text-lg">
                      <p>📞 Hotline: 1900 6789</p>
                      <p>📧 Email: support@luxevie.vn</p>
                      <p>🌐 Website: www.luxevie.vn</p>
                      <p>📍 Văn phòng: 123 Nguyễn Văn Cừ, Quận 5, TP.HCM</p>
                    </div>
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

