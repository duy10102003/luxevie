import { useState } from 'react';
import { Link } from 'react-router-dom';
import RegistrationForm from '../components/RegistrationForm';

export default function DeliveryPolicy() {
  const [activeTab, setActiveTab] = useState('standard'); // 'standard', 'fast4h', 'clickCollect', 'forceMajeure'

  const tabs = [
    { id: 'standard', label: 'GIAO HÀNG TIÊU CHUẨN' },
    { id: 'fast4h', label: 'GIAO HÀNG NHANH 4H – LUXEVIE BEAUTY NOW' },
    { id: 'clickCollect', label: 'NHẬN HÀNG TẠI CỬA HÀNG - CLICK & COLLECT' },
    { id: 'forceMajeure', label: 'BẤT KHẢ KHÁNG' }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="text-sm text-gray-600">
            <Link to="/" className="hover:text-gray-900">Trang chủ</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">CHÍNH SÁCH GIAO HÀNG</span>
          </nav>
        </div>

        {/* Main Title */}
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 md:mb-12 text-center uppercase">
          CHÍNH SÁCH GIAO HÀNG
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
                      ? 'text-blue-600 underline'
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
                CHÍNH SÁCH GIAO HÀNG – LUXEVIE BEAUTY SHOP
              </h2>

              {/* GIAO HÀNG TIÊU CHUẨN Content */}
              {activeTab === 'standard' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                      GIAO HÀNG TIÊU CHUẨN
                    </h3>

                    <h4 className="text-lg font-semibold text-gray-800 mb-3">1. PHẠM VI GIAO HÀNG</h4>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                      LUXEVIE BEAUTY SHOP cung cấp dịch vụ giao hàng toàn quốc, ngoại trừ một số khu vực đặc biệt bao gồm:
                      Xã Hoàng Sa (Huyện Hoàng Sa, Đà Nẵng), Xã Trường Sa – Song Tử Tây – Sinh Tồn (Huyện Trường Sa, Khánh Hòa), Xã An Sơn – Hòn Tre – Lại Sơn – Nam Du (Huyện Kiên Hải, Kiên Giang), Huyện Bảo Lâm (Lâm Đồng), và Huyện Phú Quý (Bình Thuận).
                    </p>

                    <h4 className="text-lg font-semibold text-gray-800 mb-3">2. THỜI GIAN GIAO HÀNG</h4>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-3">
                      LUXEVIE phục vụ giao hàng trong giờ hành chính, từ thứ Hai đến thứ Bảy (trừ Chủ nhật và các ngày Lễ, Tết).
                    </p>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-3">
                      Với các đơn đặt hàng sau 18h, thời gian giao hàng sẽ được cộng thêm 01 ngày so với dự kiến.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                      Đơn hàng sẽ được giao tận nơi theo địa chỉ khách hàng cung cấp, ngoại trừ các khu vực có hạn chế như:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-4 ml-4">
                      <li>Văn phòng, tòa nhà, khu chung cư chỉ cho phép giao tại sảnh hoặc khu vực quy định.</li>
                      <li>Khu vực quân sự, biên giới, hoặc vùng hạn chế ra vào.</li>
                    </ul>
                    <p className="text-gray-600 text-sm md:text-base italic mb-6">
                      💡 Lưu ý: Phí vận chuyển có thể thay đổi tùy theo trọng lượng và kích thước kiện hàng sau khi đóng gói.
                    </p>

                    {/* Delivery Table */}
                    <div className="overflow-x-auto mb-6">
                      <table className="min-w-full border-collapse border border-gray-300">
                        <thead>
                          <tr className="bg-gray-100">
                            <th rowSpan="2" className="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                              Tuyến (route)
                            </th>
                            <th rowSpan="2" className="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                              Thời gian giao hàng (delivery time)
                            </th>
                            <th colSpan="2" className="border border-gray-300 px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                              Giao hàng tiêu chuẩn (standard delivery)
                            </th>
                          </tr>
                          <tr className="bg-gray-100">
                            <th className="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                              0 - 3 kg
                            </th>
                            <th className="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                              Add + 0.5 kg
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">Nội tỉnh (intracity)</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">2-4 ngày</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">19,000</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">3,000</td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">Nội vùng (same region)</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">3-5 ngày</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">22,000</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">3,000</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">Cận vùng (near region)</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">5-7 ngày</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">25,000</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">3,000</td>
                          </tr>
                          <tr className="bg-gray-50">
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">Hà Nội &lt;&gt; Hồ Chí Minh</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">4-6 ngày</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">35,000</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">7,000</td>
                          </tr>
                          <tr>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-900">Liên vùng (far region)</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">5-7 ngày</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">35,000</td>
                            <td className="border border-gray-300 px-4 py-3 text-sm text-gray-700">7,000</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <h4 className="text-lg font-semibold text-gray-800 mb-3">3. CHÍNH SÁCH ĐỒNG KIỂM (KIỂM TRA HÀNG KHI NHẬN)</h4>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-3">
                      Nhằm đảm bảo quyền lợi khách hàng, LUXEVIE BEAUTY SHOP hỗ trợ đồng kiểm khi giao hàng. Quý khách có thể yêu cầu kiểm tra hàng trước khi ký nhận theo hướng dẫn:
                    </p>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-2 font-semibold">
                      Kiểm tra tình trạng gói hàng:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-3 ml-4">
                      <li>Hàng được đóng gói cẩn thận, bọc kín bằng băng keo có logo LUXEVIE BEAUTY SHOP.</li>
                      <li>Không có dấu hiệu móp méo, rách, thủng, hay bị mở niêm phong.</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-2 font-semibold">
                      Kiểm tra sản phẩm bên trong:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-4 ml-4">
                      <li>Sản phẩm còn nguyên tem, mác, đúng với mẫu mã, màu sắc, kích cỡ và số lượng trên đơn đặt hàng.</li>
                      <li>Việc kiểm tra chỉ bao gồm ngoại quan sản phẩm, không bao gồm việc thử sản phẩm.</li>
                    </ul>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
                      👉 Nếu phát hiện sản phẩm không đúng hoặc có dấu hiệu hư hỏng, quý khách có thể từ chối nhận hàng và liên hệ ngay với bộ phận chăm sóc khách hàng của LUXEVIE để được hỗ trợ kịp thời.
                    </p>

                    <h4 className="text-lg font-semibold text-gray-800 mb-3">4. QUY ĐỊNH RIÊNG CHO TỪNG NHÓM SẢN PHẨM</h4>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-2 font-semibold">
                      Đối với trang phục và phụ kiện thời trang:
                    </p>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-3 ml-4">
                      Trong trường hợp khách hàng không thể đồng kiểm trực tiếp, vui lòng quay video quá trình mở kiện hàng để làm bằng chứng nếu có phát sinh khiếu nại. Video cần đảm bảo rõ ràng, thể hiện đầy đủ tình trạng niêm phong, sản phẩm và phụ kiện đi kèm.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-2 font-semibold">
                      Đối với sản phẩm đồng hồ:
                    </p>
                    <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-4">
                      <li>Khách hàng cần kiểm tra kỹ ngoại quan sản phẩm trước khi ký nhận.</li>
                      <li>LUXEVIE sẽ từ chối đổi trả trong mọi trường hợp nếu khách hàng đã xác nhận nhận hàng thành công.</li>
                    </ul>

                    <h4 className="text-lg font-semibold text-gray-800 mb-3">5. LƯU Ý KHI ĐÓNG GÓI</h4>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-3">
                      Tất cả sản phẩm đặt mua online sẽ được đóng gói trong hộp carton niêm phong và không kèm túi giấy.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                      Điều này nhằm đảm bảo sản phẩm được bảo vệ tối đa trong quá trình vận chuyển và giữ nguyên tình trạng khi đến tay khách hàng.
                    </p>
                    <p className="text-gray-700 leading-relaxed text-base md:text-lg font-semibold">
                      📦 LUXEVIE BEAUTY SHOP – Giao hàng tận tâm, an toàn, nhanh chóng đến mọi nơi trên toàn quốc.
                    </p>
                  </div>
                </div>
              )}

              {/* GIAO HÀNG NHANH 4H Content */}
              {activeTab === 'fast4h' && (
                <div className="space-y-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    🚚 GIAO HÀNG NHANH 4H – LUXEVIE BEAUTY NOW
                  </h3>

                  <h4 className="text-lg font-semibold text-gray-800 mb-3">1. Khu vực áp dụng</h4>
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-4">
                    Dịch vụ Giao hàng nhanh 4H – LUXEVIE BEAUTY NOW hiện chỉ áp dụng tại các quận, huyện nội thành TP. Hồ Chí Minh và Hà Nội.
                    Quý khách có thể tra cứu danh sách khu vực hỗ trợ giao nhanh bằng cách truy cập <a href="#" className="text-blue-600 hover:underline">[tại đây]</a>.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-800 mb-3">2. Thời gian giao hàng</h4>
                  <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-4 ml-4">
                    <li>Đơn hàng đặt trước 16h: Giao trong vòng 2 đến 4 giờ kể từ khi được xác nhận thành công.</li>
                    <li>Đơn hàng đặt sau 16h: Giao vào buổi sáng hôm sau.</li>
                    <li>Thời gian giao hàng: Trong giờ hành chính (09h00 – 18h00, từ Thứ Hai đến Thứ Bảy, không áp dụng vào Chủ nhật và các ngày Lễ, Tết).</li>
                  </ul>

                  <h4 className="text-lg font-semibold text-gray-800 mb-3">3. Chính sách đồng kiểm & lưu ý</h4>
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-3">
                    Đơn hàng giao nhanh 4H không áp dụng chính sách đồng kiểm.
                    Tuy nhiên, nếu kiện hàng có dấu hiệu rách, thủng, ướt hoặc móp méo, Quý khách được quyền từ chối nhận hàng và liên hệ ngay với bộ phận Chăm sóc khách hàng của LUXEVIE để được hỗ trợ kịp thời.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-3">
                    👉 Khuyến nghị: Quý khách nên quay video trong quá trình mở gói hàng, giúp việc xác minh khi có vấn đề phát sinh được nhanh chóng và chính xác hơn.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
                    ⏰ Thời gian tiếp nhận khiếu nại: Trong vòng 24 giờ kể từ khi đơn hàng được giao hoàn tất hoặc Quý khách từ chối nhận hàng vì lý do chính đáng (bao bì không còn nguyên vẹn, nghi ngờ tráo đổi sản phẩm, v.v…).
                  </p>

                  <h4 className="text-lg font-semibold text-gray-800 mb-3">4. Phạm vi giao hàng</h4>
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-3">
                    Đơn hàng sẽ được giao trực tiếp đến địa chỉ mà khách hàng đã cung cấp, ngoại trừ các khu vực hạn chế ra vào như:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-6 ml-4">
                    <li>Tòa nhà văn phòng hoặc khu vực kiểm soát an ninh chặt chẽ.</li>
                    <li>Chung cư/cao tầng (chỉ hỗ trợ giao tại sảnh hoặc chân tòa nhà).</li>
                    <li>Khu vực đặc biệt (quân sự, biên giới, khu vực hạn chế di chuyển…).</li>
                  </ul>

                  <h4 className="text-lg font-semibold text-gray-800 mb-3">5. Sản phẩm áp dụng</h4>
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-3">
                    Dịch vụ LUXEVIE BEAUTY NOW áp dụng cho toàn bộ sản phẩm mỹ phẩm, chăm sóc da, trang điểm và phụ kiện làm đẹp có sẵn tại kho.
                  </p>
                  <p className="text-gray-700 leading-relaxed text-base md:text-lg mb-6">
                    ❌ Không áp dụng cho các sản phẩm đặc biệt như hàng đặt trước (Pre-order), combo ưu đãi lớn, hoặc sản phẩm yêu cầu bảo quản đặc biệt.
                  </p>

                  <h4 className="text-lg font-semibold text-gray-800 mb-3">📞 Liên hệ hỗ trợ</h4>
                  <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg mb-4 ml-4">
                    <li>Hotline: 1900 888 979</li>
                    <li>Email: support@luxevie.vn</li>
                    <li>Giờ làm việc: 09h – 18h, từ Thứ Hai đến Thứ Bảy (trừ ngày Lễ, Tết)</li>
                  </ul>
                </div>
              )}

              {/* NHẬN HÀNG TẠI CỬA HÀNG Content */}
              {activeTab === 'clickCollect' && (
                <div className="space-y-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    NHẬN HÀNG TẠI CỬA HÀNG – CLICK & COLLECT
                  </h3>

                  <ul className="list-disc list-inside text-gray-700 leading-relaxed text-base md:text-lg space-y-3 ml-4">
                    <li>Áp dụng cho hầu hết sản phẩm có sẵn trên LUXEVIE.VN.</li>
                    <li>Khi đặt hàng, nếu sản phẩm còn tồn kho tại cửa hàng gần địa chỉ của Quý khách, hệ thống sẽ hiển thị tùy chọn "Nhận hàng tại cửa hàng".</li>
                    <li>Sau khi đặt thành công, nhân viên LUXEVIE sẽ liên hệ xác nhận và thông báo thời gian nhận hàng.</li>
                    <li>Khi đến nhận, Quý khách vui lòng kiểm tra kỹ tình trạng sản phẩm trước khi ký nhận.</li>
                    <li>Chính sách Click & Collect không áp dụng cho sản phẩm đồng hồ hoặc các sản phẩm yêu cầu bảo quản đặc biệt.</li>
                  </ul>
                </div>
              )}

              {/* BẤT KHẢ KHÁNG Content */}
              {activeTab === 'forceMajeure' && (
                <div className="space-y-6">
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    BẤT KHẢ KHÁNG
                  </h3>

                  <p className="text-gray-700 leading-relaxed text-base md:text-lg">
                    Trong trường hợp xảy ra dịch bệnh, thiên tai hoặc các tình huống bất khả kháng theo quy định của cơ quan nhà nước, LUXEVIE BEAUTY SHOP có quyền điều chỉnh hoặc tạm ngừng giao hàng tùy theo tình hình thực tế và quy định vận chuyển hiện hành.
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

