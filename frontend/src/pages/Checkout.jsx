import { useEffect, useMemo, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createOrder } from '../services/orders';
import cart from '../services/cart'; // yêu cầu: cart item có field productId
import { useAuth } from '../context/AuthContext';
import { applyCoupon } from '../services/coupons';
import { createMoMoPayment } from '../services/momo';
// Định dạng tiền
const fmt = (n) => (Number(n || 0)).toLocaleString('vi-VN') + '₫';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuth(); // nếu muốn bắt buộc đăng nhập, có thể redirect khi !user
  const [items, setItems] = useState([]);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState('');
  const [coupon, setCoupon] = useState(''); // TODO: hook apply coupon (API /coupons/apply)

  const [couponRes, setCouponRes] = useState(null);

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    province: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod'); // cod, momo

  useEffect(() => { setItems(cart.getItems()); }, []);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + (it.price || 0) * (it.qty || 0), 0),
    [items]
  );

  const discount = couponRes?.discount || 0;          // số tiền giảm từ mã
  const total = Math.max(0, subtotal - discount);     // nếu có shippingFee thì cộng thêm vào đây
  const canSubmit =
    items.length > 0 &&
    address.fullName.trim().length >= 2 &&
    /^[0-9]{8,}$/.test(address.phone || '') &&
    (address.address || '').trim().length >= 4 &&
    paymentMethod;

  async function handleSubmit(e) {
    e.preventDefault();
    setErr('');

    // Kiểm tra dữ liệu giỏ
    const miss = items.find(i => !i.productId);
    if (miss) {
      setErr('Một số sản phẩm thiếu productId. Hãy sửa hàm addToCart để lưu kèm productId.');
      return;
    }

    const payload = {
      items: items.map(it => ({
        productId: it.productId,
        name: it.name, image: it.image,
        price: it.price, qty: it.qty,
        size: it.size || '', color: it.color || '', sku: it.sku || ''
      })),
      shippingAddress: { ...address },
      paymentMethod: paymentMethod, // cod, momo
      note: note || undefined,
      // couponCode: coupon || undefined, // TODO: khi có endpoint apply coupon, tính discount trước
      couponCode: couponRes?.coupon?.code || coupon || undefined,

    };

    try {
      setSubmitting(true);
      const order = await createOrder(payload);
      
      // Nếu thanh toán bằng MoMo, tạo payment URL và redirect
      if (paymentMethod === 'momo') {
        try {
          const paymentResult = await createMoMoPayment(order._id);
          if (paymentResult.payUrl) {
            // Redirect đến MoMo payment page
            window.location.href = paymentResult.payUrl;
            return; // Không clear cart vì chưa thanh toán thành công
          }
        } catch (momoError) {
          console.error('MoMo payment error:', momoError);
          setErr('Không thể tạo thanh toán MoMo. Vui lòng thử lại hoặc chọn phương thức khác.');
          return;
        }
      }
      
      // COD hoặc các phương thức khác
      cart.clear();
      navigate(`/order-success?code=${encodeURIComponent(order.code)}&id=${order._id}`);
    } catch (e) {
      setErr(e?.response?.data?.message || 'Không thể tạo đơn. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 grid lg:grid-cols-3 gap-6">
      {/* Form giao hàng */}
      <form className="lg:col-span-2 space-y-4" onSubmit={handleSubmit} noValidate>
        <h1 className="text-2xl font-semibold">Thanh toán</h1>

        <div className="grid sm:grid-cols-2 gap-3">
          <Field label="Họ và tên" required>
            <input className="input" placeholder="Nguyễn Văn A"
              value={address.fullName}
              onChange={e=>setAddress(a=>({...a, fullName: e.target.value}))}/>
          </Field>
          <Field label="Số điện thoại" required>
            <input className="input" placeholder="09xxxxxxxx" inputMode="numeric"
              value={address.phone}
              onChange={e=>setAddress(a=>({...a, phone: e.target.value}))}/>
          </Field>
        </div>

        <Field label="Địa chỉ" required>
          <input className="input" placeholder="Số nhà, đường..."
            value={address.address}
            onChange={e=>setAddress(a=>({...a, address: e.target.value}))}/>
        </Field>

        <div className="grid sm:grid-cols-3 gap-3">
          <Field label="Phường/Xã">
            <input className="input" value={address.ward}
              onChange={e=>setAddress(a=>({...a, ward: e.target.value}))}/>
          </Field>
          <Field label="Quận/Huyện">
            <input className="input" value={address.district}
              onChange={e=>setAddress(a=>({...a, district: e.target.value}))}/>
          </Field>
          <Field label="Tỉnh/Thành">
            <input className="input" value={address.province}
              onChange={e=>setAddress(a=>({...a, province: e.target.value}))}/>
          </Field>
        </div>

        {/* Coupon – điểm móc route sau sẽ nối API /coupons/apply */}
        <div className="grid sm:grid-cols-[1fr_auto] gap-3">
          <Field label="Mã giảm giá">
                            <input
                  className="input"
                  placeholder="Nhập mã (nếu có)"
                  value={coupon}
                  onChange={(e) => { setCoupon(e.target.value.toUpperCase()); setCouponRes(null); }}/>

          </Field>
          <button
  type="button"
  className="btn-outline h-[42px] mt-auto"
  disabled={!coupon}
  onClick={async () => {
    try {
      const res = await applyCoupon(coupon.trim(), subtotal);
      if (!res.valid) return alert('Mã không hợp lệ');
      setCouponRes(res);
    } catch (e) {
      console.error(e);
      alert('Áp dụng mã thất bại');
    }
  }}
>
  Áp dụng
</button>
        </div>

        <Field label="Ghi chú đơn hàng">
          <textarea className="input min-h-28" placeholder="Ví dụ: giao trong giờ hành chính"
            value={note} onChange={e=>setNote(e.target.value)}/>
        </Field>

        {/* Payment Method Selection */}
        <div className="space-y-3">
          <label className="block">
            <div className="text-sm text-gray-600 mb-3">
              Phương thức thanh toán <span className="text-red-500">*</span>
            </div>
            <div className="space-y-3">
              {/* COD */}
              <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'cod' 
                  ? 'border-gray-900 bg-gray-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-gray-900 focus:ring-gray-900"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Thanh toán khi nhận hàng</div>
                  <div className="text-sm text-gray-600">Thanh toán bằng tiền mặt khi nhận được hàng</div>
                </div>
                <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </label>

              {/* MoMo */}
              <label className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer transition-all ${
                paymentMethod === 'momo' 
                  ? 'border-gray-900 bg-gray-50' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="momo"
                  checked={paymentMethod === 'momo'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="w-5 h-5 text-gray-900 focus:ring-gray-900"
                />
                <div className="flex-1">
                  <div className="font-semibold text-gray-900">Thanh toán bằng MoMo</div>
                  <div className="text-sm text-gray-600">Thanh toán nhanh chóng và an toàn qua ví MoMo</div>
                </div>
                <div className="w-12 h-12 bg-pink-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">MoMo</span>
                </div>
              </label>

            </div>
          </label>
        </div>

        {err && <div className="text-red-600 text-sm">{err}</div>}

        <div className="flex items-center gap-3">
          <Link to="/cart" className="btn-outline">Quay lại giỏ hàng</Link>
          <button disabled={!canSubmit || submitting} className="btn-primary">
            {submitting ? 'Đang đặt hàng…' : 'Đặt hàng'}
          </button>
        </div>
      </form>

      {/* Tóm tắt đơn */}
      <aside className="border rounded-2xl p-4 h-fit sticky top-20 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold text-lg">Đơn hàng</h2>
          <Link to="/cart" className="text-sm text-blue-600 hover:underline">Chỉnh sửa</Link>
        </div>

        <div className="divide-y">
          {items.map(it => (
            <div key={(it.productId) + (it.size || '') + (it.color || '')} className="py-3 flex items-center gap-3">
              <img src={it.image} alt="" className="w-14 h-16 object-cover rounded border" />
              <div className="text-sm flex-1">
                <div className="font-medium line-clamp-1">{it.name}</div>
                <div className="text-gray-500">{[it.size, it.color].filter(Boolean).join(' / ') || '—'}</div>
              </div>
              <div className="text-right text-sm">
                <div>x{it.qty}</div>
                <div className="font-medium">{fmt(it.price)}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="border-t pt-3 space-y-1 text-sm">
  <Row label="Tạm tính" value={fmt(subtotal)} />
  {discount > 0 && <Row label="Giảm giá" value={'- ' + fmt(discount)} />}
  <Row label={<b>Tổng cộng</b>} value={<b>{fmt(total)}</b>} />
</div>

      </aside>
    </div>
  );
}

/** UI helpers */
function Field({ label, required, children }) {
  return (
    <label className="block">
      <div className="text-sm text-gray-600 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </div>
      {children}
    </label>
  );
}
function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span>{label}</span><span>{value}</span>
    </div>
  );
}
