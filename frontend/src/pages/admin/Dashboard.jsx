// src/pages/admin/Dashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { fetchAdminStats } from "../../services/adminStats";
import BtnExportReport from "../../components/BtnExportReport";

const money = (n) => (Number(n || 0)).toLocaleString("vi-VN") + "₫";

/* ---------- UI atoms ---------- */
function Sparkline({ values = [], tone = "indigo" }) {
  const max = Math.max(...values, 1);
  const color = {
    indigo: "bg-indigo-300",
    emerald: "bg-emerald-300",
    amber: "bg-amber-300",
    violet: "bg-violet-300",
  }[tone] || "bg-gray-300";
  return (
    <div className="h-14 flex items-end gap-1.5">
      {values.map((v, i) => (
        <div
          key={i}
          className={`flex-1 rounded ${color}`}
          style={{ height: `${(v / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

function Badge({ status }) {
  const cls = {
    pending: "bg-amber-50 text-amber-700 border-amber-200",
    confirmed: "bg-sky-50 text-sky-700 border-sky-200",
    shipped: "bg-indigo-50 text-indigo-700 border-indigo-200",
    delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled: "bg-rose-50 text-rose-700 border-rose-200",
  }[status] || "bg-gray-50 text-gray-700 border-gray-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded border text-xs ${cls}`}>
      {status}
    </span>
  );
}

function CardShell({ title, action, children, desc }) {
  return (
    <section className="rounded-2xl border bg-white p-4 md:p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <h2 className="text-lg font-semibold">{title}</h2>
          {desc && <p className="text-xs text-gray-500 mt-0.5">{desc}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function KpiCard({ title, value, delta, icon = "📈", tone = "indigo", hint, spark = [] }) {
  const toneMap = {
    indigo: { bg: "from-indigo-50 to-sky-50", icon: "text-indigo-600" },
    emerald: { bg: "from-emerald-50 to-teal-50", icon: "text-emerald-600" },
    amber: { bg: "from-amber-50 to-yellow-50", icon: "text-amber-600" },
    violet: { bg: "from-violet-50 to-fuchsia-50", icon: "text-violet-600" },
  }[tone];

  return (
    <div className="rounded-2xl border overflow-hidden">
      <div className={`p-4 md:p-5 bg-gradient-to-br ${toneMap.bg}`}>
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">{title}</div>
          <div className={`h-9 w-9 rounded-xl bg-white/70 backdrop-blur flex items-center justify-center ${toneMap.icon}`}>
            <span className="text-lg">{icon}</span>
          </div>
        </div>
        <div className="mt-2 text-2xl font-semibold tracking-tight">{value}</div>
        <div className="mt-1 text-xs flex items-center gap-2">
          {!!delta && (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 ${
                delta > 0 ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
              }`}
            >
              {delta > 0 ? "▲" : "▼"} {Math.abs(delta)}%
            </span>
          )}
          {hint && <span className="text-gray-500">{hint}</span>}
        </div>
      </div>
      {spark?.length ? (
        <div className="px-4 pb-4">
          <Sparkline values={spark} tone={tone} />
        </div>
      ) : null}
    </div>
  );
}

function Skeleton({ className = "" }) {
  return <div className={`animate-pulse rounded-lg bg-gray-100 ${className}`} />;
}

/* ---------- Page ---------- */
export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    revenue: 0,
    ordersTotal: 0,
    productsTotal: 0,
    usersTotal: 0,
    recentOrders: [],
  });
  const [range, setRange] = useState("7d");

  useEffect(() => {
    (async () => {
      try {
        const data = await fetchAdminStats(); // thay bằng API thật của bạn
        setStats(data || {});
      } finally {
        setLoading(false);
      }
    })();
  }, [range]);

  const top5 = useMemo(() => stats.recentOrders?.slice(0, 5) ?? [], [stats]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Bảng điều khiển</h1>
          <p className="text-sm text-gray-500">Hiệu suất bán hàng & hoạt động gần đây</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value)}
            className="rounded-lg border px-3 py-2 bg-white text-sm"
            aria-label="Phạm vi thời gian"
          >
            <option value="7d">7 ngày</option>
            <option value="30d">30 ngày</option>
            <option value="90d">90 ngày</option>
          </select>
          <BtnExportReport />
          <a
            href="/admin/coupons"
            className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm hover:bg-indigo-700"
          >
            Tạo khuyến mãi
          </a>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {loading ? (
          <>
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
            <Skeleton className="h-44" />
          </>
        ) : (
          <>
            <KpiCard
              title="Doanh thu (gần nhất)"
              value={money(stats.revenue)}
              delta={12}
              icon="₫"
              tone="violet"
              hint="so với kỳ trước"
              spark={[6, 9, 7, 11, 9, 13, 12]}
            />
            <KpiCard
              title="Đơn hàng"
              value={stats.ordersTotal}
              delta={5}
              icon="🧾"
              tone="indigo"
              hint="đơn đã tạo"
              spark={[4, 5, 3, 8, 6, 9, 7]}
            />
            <KpiCard
              title="Sản phẩm"
              value={stats.productsTotal}
              delta={-3}
              icon="📦"
              tone="amber"
              hint="đang hiển thị"
              spark={[10, 12, 11, 9, 10, 12, 11]}
            />
            <KpiCard
              title="Người dùng"
              value={stats.usersTotal}
              delta={9}
              icon="👤"
              tone="emerald"
              hint="đăng ký mới"
              spark={[2, 3, 2, 4, 3, 5, 4]}
            />
          </>
        )}
      </div>

      {/* 3 cột: Đơn mới / Bán chạy / Việc cần làm */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <CardShell
          title="Đơn hàng mới"
          desc="5 đơn gần nhất"
          action={<a href="/admin/orders" className="text-sm text-indigo-600 hover:underline">Xem tất cả</a>}
        >
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
              <Skeleton className="h-8" />
            </div>
          ) : top5.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2 pr-3">Mã</th>
                    <th className="py-2 pr-3">Khách</th>
                    <th className="py-2 pr-3">Ngày</th>
                    <th className="py-2 pr-3">Tổng</th>
                    <th className="py-2 pr-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {top5.map((o) => (
                    <tr key={o._id} className="border-t">
                      <td className="py-2 pr-3 font-medium">{o.code || o._id.slice(-6)}</td>
                      <td className="py-2 pr-3">{o.customer?.name || o.user?.email || "-"}</td>
                      <td className="py-2 pr-3">{new Date(o.createdAt).toLocaleString()}</td>
                      <td className="py-2 pr-3 font-medium">{money(o.total)}</td>
                      <td className="py-2 pr-3"><Badge status={o.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-gray-500 text-sm">Chưa có đơn hàng.</div>
          )}
        </CardShell>

        <CardShell
          title="Sản phẩm bán chạy"
          desc="Top demo (thay bằng API thật)"
          action={<a href="/admin/products" className="text-sm text-indigo-600 hover:underline">Quản lý</a>}
        >
          <ul className="divide-y">
            {["Áo thun Basic", "Quần jeans Slim", "Áo khoác Hoodie", "Ví da Mini", "Giày Runner"].map((p, i) => (
              <li key={i} className="py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-100" />
                  <div>
                    <div className="font-medium text-sm">{p}</div>
                    <div className="text-xs text-gray-500">Tồn kho: {Math.floor(Math.random() * 80) + 20}</div>
                  </div>
                </div>
                <div className="text-sm font-medium">{money(99000 + i * 20000)}</div>
              </li>
            ))}
          </ul>
        </CardShell>

        <CardShell
          title="Công việc cần làm"
          desc="Tự động gợi ý từ dữ liệu bán hàng"
          action={<button className="text-sm px-3 py-1.5 rounded-lg border bg-white hover:bg-gray-50">Thêm</button>}
        >
          <ul className="space-y-2">
            {[
              "Duyệt 3 đánh giá mới",
              "Nhập thêm hàng Áo thun Basic",
              "Tạo campaign 11.11",
              "Trả lời 2 ticket hỗ trợ",
            ].map((t, i) => (
              <li key={i} className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50">
                <div className="text-sm">{t}</div>
                <button className="text-xs text-indigo-600">Chi tiết</button>
              </li>
            ))}
          </ul>
        </CardShell>
      </div>

      {/* Biểu đồ nhỏ + trạng thái + hành động nhanh */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <CardShell title="Doanh thu theo ngày" desc="Demo CSS; có thể thay Chart.js/Recharts">
          <div className="h-40 flex items-end gap-2">
            {[40, 65, 30, 80, 55, 90, 50, 60, 70, 40, 30, 85].map((h, i) => (
              <div key={i} className="flex-1 bg-indigo-200 rounded-t" style={{ height: `${h}%` }} />
            ))}
          </div>
        </CardShell>

        <CardShell title="Tỉ lệ trạng thái đơn">
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { k: "pending", v: 12 },
              { k: "confirmed", v: 26 },
              { k: "shipped", v: 21 },
              { k: "delivered", v: 34 },
              { k: "cancelled", v: 7 },
            ].map((s) => (
              <div key={s.k} className="flex items-center justify-between p-3 rounded-lg border">
                <Badge status={s.k} />
                <span className="font-medium">{s.v}%</span>
              </div>
            ))}
          </div>
        </CardShell>

        <CardShell title="Hành động nhanh">
          <div className="grid grid-cols-2 gap-3">
            <a href="/admin/products/new" className="rounded-xl border p-4 hover:bg-gray-50 text-sm">➕ Thêm sản phẩm</a>
            <a href="/admin/orders" className="rounded-xl border p-4 hover:bg-gray-50 text-sm">🚚 Xử lý đơn</a>
            <a href="/admin/users" className="rounded-xl border p-4 hover:bg-gray-50 text-sm">👤 Quản lý user</a>
            <a href="/admin/coupons" className="rounded-xl border p-4 hover:bg-gray-50 text-sm">🎟️ Mã giảm giá</a>
          </div>
        </CardShell>
      </div>
    </div>
  );
}
