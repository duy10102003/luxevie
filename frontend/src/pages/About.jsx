import RegistrationForm from '../components/RegistrationForm';

export default function About() {
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

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
          Câu chuyện thương hiệu LUXEVIE BEAUTY SHOP
        </h2>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <div className="space-y-6 text-gray-700 leading-relaxed">
            <p className="text-base md:text-lg">
              Được thành lập với niềm đam mê mãnh liệt dành cho thời trang và cái đẹp, <strong className="text-gray-900">LUXEVIE BEAUTY SHOP</strong> ra đời với sứ mệnh mang đến cho khách hàng những trải nghiệm mua sắm đẳng cấp và đầy cảm hứng. Ngay từ những ngày đầu tiên, LUXEVIE đã không ngừng nỗ lực để trở thành một trong những địa chỉ uy tín hàng đầu trong lĩnh vực thời trang và làm đẹp, nơi khách hàng có thể tìm thấy những sản phẩm chất lượng, hợp xu hướng và thể hiện rõ phong cách riêng của mình.
            </p>

            <p className="text-base md:text-lg">
              Sau những bước đi đầu tiên đầy thử thách, <strong className="text-gray-900">LUXEVIE BEAUTY SHOP</strong> ngày càng khẳng định vị thế vững chắc của mình trên thị trường Việt Nam. Chúng tôi tự hào là "ngôi nhà" của nhiều thương hiệu thời trang, mỹ phẩm và phụ kiện được yêu thích, đáp ứng nhu cầu của những người yêu thích sự tinh tế, sang trọng và hiện đại. Không chỉ đơn thuần là nơi mua sắm, LUXEVIE còn là cộng đồng của những người yêu cái đẹp, nơi chia sẻ cảm hứng, xu hướng và phong cách sống thời thượng.
            </p>

            <p className="text-base md:text-lg">
              Với tầm nhìn <em className="text-gray-900">"Lan tỏa phong cách – Tôn vinh vẻ đẹp Việt"</em>, <strong className="text-gray-900">LUXEVIE BEAUTY SHOP</strong> luôn đặt khách hàng ở vị trí trung tâm của mọi hoạt động. Chúng tôi chú trọng đến từng chi tiết – từ chất lượng sản phẩm, thiết kế không gian mua sắm, cho đến trải nghiệm dịch vụ tận tâm. Mỗi sản phẩm tại LUXEVIE đều được chọn lọc kỹ lưỡng, đảm bảo không chỉ đẹp về hình thức mà còn mang lại giá trị thật sự cho người sử dụng.
            </p>

            <p className="text-base md:text-lg">
              Trải qua hành trình phát triển đầy nỗ lực, <strong className="text-gray-900">LUXEVIE BEAUTY SHOP</strong> đã trở thành biểu tượng của sự trẻ trung, tự tin và đẳng cấp trong giới thời trang và làm đẹp. Chúng tôi không chỉ cung cấp sản phẩm, mà còn truyền cảm hứng để mỗi khách hàng tự tin thể hiện cá tính và phong cách riêng biệt của mình.
            </p>

            <p className="text-base md:text-lg">
              Trong tương lai, <strong className="text-gray-900">LUXEVIE BEAUTY SHOP</strong> tiếp tục hướng tới việc mở rộng hệ thống, mang thương hiệu đến gần hơn với khách hàng trên toàn quốc, đồng thời không ngừng đổi mới để bắt kịp xu hướng toàn cầu. Với tinh thần tiên phong và khát vọng vươn xa, chúng tôi tin rằng LUXEVIE sẽ luôn là biểu tượng của phong cách, chất lượng và niềm tin trong lòng khách hàng.
            </p>

            {/* Closing Statement */}
            <div className="mt-10 pt-8 border-t border-gray-200">
              <p className="text-xl md:text-2xl font-semibold text-gray-900 text-center">
                ✨ <strong>LUXEVIE BEAUTY SHOP</strong> – Nơi tôn vinh vẻ đẹp, khẳng định phong cách.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <RegistrationForm />
    </div>
  );
}

