import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Suspense, lazy } from "react";
import { AuthProvider } from "./context/AuthContext";

import SiteHeader from "./components/layout/SiteHeader";
import SiteFooter from "./components/layout/SiteFooter";
import ErrorBoundary from "./components/ErrorBoundary";
import ScrollToTop from "./components/ScrollToTop";

import Home from "./pages/Home";
import Collection from "./pages/Collection";
import Category from "./pages/Category";
import About from "./pages/About";
import Contact from "./pages/Contact";
import LoyaltyPolicy from "./pages/LoyaltyPolicy";
import DeliveryPolicy from "./pages/DeliveryPolicy";
import PurchasePolicy from "./pages/PurchasePolicy";
import ReturnPolicy from "./pages/ReturnPolicy";
import WarrantyPolicy from "./pages/WarrantyPolicy";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import BrandPage from "./pages/BrandPage";
import Ao from "./pages/Ao";
import Quan from "./pages/Quan";
import PhuKien from "./pages/PhuKien";
import GiayDep from "./pages/GiayDep";
import TuiVi from "./pages/TuiVi";
import MatKinh from "./pages/MatKinh";
import DongHo from "./pages/DongHo";
import TrangSuc from "./pages/TrangSuc";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
const Checkout = lazy(() => import("./pages/Checkout.jsx"));
const Orders = lazy(() => import("./pages/Orders.jsx"));
const OrderSuccess = lazy(() => import("./pages/OrderSuccess.jsx"));

import Login from "./pages/Login";
import Register from "./pages/Register";
import Forgot from "./pages/Forgot";
import Reset from "./pages/Reset";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import AdminLayout from "./pages/admin/AdminLayout";
import ProductsList from "./pages/admin/ProductsList";
import ProductForm from "./pages/admin/ProductForm";
import AdminOrdersList from "./pages/admin/AdminOrdersList";
import AdminOrderDetail from "./pages/admin/AdminOrderDetail";
import UsersList from "./pages/admin/UsersList";
import UserEdit from "./pages/admin/UserEdit";
import Dashboard from "./pages/admin/Dashboard";



// import AdminLayout from './pages/admin/AdminLayout'
// import Dashboard from './pages/admin/Dashboard'
// import ProductsList from './pages/admin/ProductsList'
// import ProductForm from './pages/admin/ProductForm'
// import AdminOrdersList from './pages/admin/AdminOrdersList'
// import AdminOrderDetail from './pages/admin/AdminOrderDetail'
// import UsersList from './pages/admin/UsersList'
// import UserEdit from './pages/admin/UserEdit'


import Profile from "./pages/Profile";
import AdminCouponsList from "./pages/admin/AdminCouponsList";
import Banner from "./pages/admin/Images";
import BrandSectionsList from "./pages/admin/BrandSectionsList";
import BrandSectionForm from "./pages/admin/BrandSectionForm";
import ProductCatalog from "./pages/admin/ProductCatalog";
import AdminReviews from "./pages/admin/AdminReviews";
// import CouponBanner from './components/CouponBanner';
import AiChatWidget from './components/AiChatWidget';


function PublicChrome() {
  return (
    <>
      <SiteHeader />
      <Outlet />
      <SiteFooter />
      <AiChatWidget />
    </>
  );
}

function NotFound() {
  return <div className="max-w-7xl mx-auto px-4 py-12">Trang không tồn tại.</div>;
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTop />
        <ErrorBoundary>
          <Suspense fallback={<div className="px-4 py-8">Đang tải…</div>}>
            <Routes>
              {/* Public routes (có Header/Footer) */}
              <Route element={<PublicChrome />}>
                <Route index element={<Home />} />
                <Route path="collection" element={<Collection />} />
                <Route path="about" element={<About />} />
                <Route path="contact" element={<Contact />} />
                <Route path="chinh-sach-khach-hang-than-thiet" element={<LoyaltyPolicy />} />
                <Route path="chinh-sach-giao-hang" element={<DeliveryPolicy />} />
                <Route path="chinh-sach-mua-hang" element={<PurchasePolicy />} />
                <Route path="chinh-sach-doi-tra" element={<ReturnPolicy />} />
                <Route path="chinh-sach-bao-hanh" element={<WarrantyPolicy />} />
                <Route path="chinh-sach-bao-mat" element={<PrivacyPolicy />} />
                <Route path="brand/:brandName" element={<BrandPage />} />
                {/* Category pages */}
                <Route path="ao" element={<Ao />} />
                <Route path="quan" element={<Quan />} />
                <Route path="giay-dep" element={<GiayDep />} />
                <Route path="tui-vi" element={<TuiVi />} />
                <Route path="mat-kinh" element={<MatKinh />} />
                <Route path="dong-ho" element={<DongHo />} />
                <Route path="phu-kien" element={<PhuKien />} />
                <Route path="trang-suc" element={<TrangSuc />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="order-success" element={<OrderSuccess />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="forgot" element={<Forgot />} />
                <Route path="reset" element={<Reset />} />
                <Route path="profile" element={<Profile />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="orders" element={<Orders />} />
                </Route>
              </Route>

              {/* Admin routes (không chèn public header/footer) */}




              <Route element={<AdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<Dashboard />} />{/* 👈 đây */}
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="products" element={<ProductsList />} />
                  <Route path="products/new" element={<ProductForm />} />
                  <Route path="products/:id" element={<ProductForm />} />
                  <Route path="orders" element={<AdminOrdersList />} />
                  <Route path="orders/:id" element={<AdminOrderDetail />} />
                  <Route path="users" element={<UsersList />} />
                  <Route path="users/:id" element={<UserEdit />} />
                  <Route path="coupons" element={<AdminCouponsList />} />
                  <Route path="banners" element={<Banner />} />
                  <Route path="brand-sections" element={<BrandSectionsList />} />
                  <Route path="brand-sections/new" element={<BrandSectionForm />} />
                  <Route path="brand-sections/:id" element={<BrandSectionForm />} />
                  <Route path="product-catalog" element={<ProductCatalog />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  {/* <Route path="chat" element={<AdminChat />} /> */}
                </Route>
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </BrowserRouter>
    </AuthProvider>
  );
}
