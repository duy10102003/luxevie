import BannerSlider from "../components/BannerSlider";
import BrandSections from "../components/BrandSections";
import NewArrivals from "../components/NewArrivals";
import Promotions from "../components/Promotions";
import NewProducts from "../components/NewProducts";
import Brands from "../components/Brands";
import RegistrationForm from "../components/RegistrationForm";

export default function Home(){

  return (
    <div className="bg-gray-50">
      {/* Banner Slider */}
      <BannerSlider />

      {/* Brand Sections */}
      <BrandSections />

      {/* New Arrivals */}
      <NewArrivals />

      {/* Promotions */}
      <Promotions />

      {/* New Products */}
      <NewProducts />

      {/* Brands */}
      <Brands />

      {/* Registration Form */}
      <RegistrationForm />
    </div>
  );
}
