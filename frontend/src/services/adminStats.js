import api from "./api";

export async function fetchAdminStats() {
  // Có thể thay bằng 1 endpoint /admin/meta nếu bạn đã làm.
  const [ordersRes, usersRes, productsRes] = await Promise.all([
    api.get("/admin/orders", { params: { limit: 5 } }), // danh sách mới
    api.get("/admin/users", { params: { limit: 1 } }),
    api.get("/products", { params: { limit: 1 } }),
  ]);

  // Tổng số (nếu API trả theo paging: total). Nếu không có, fallback = length
  const ordersTotal = ordersRes.data?.total ?? ordersRes.data?.items?.length ?? 0;
  const usersTotal = usersRes.data?.total ?? usersRes.data?.items?.length ?? 0;
  const productsTotal = productsRes.data?.total ?? productsRes.data?.items?.length ?? 0;

  // recent orders
  const recentOrders = ordersRes.data?.items ?? [];

  // dummy revenue (cộng total của recent orders) – thay bằng endpoint doanh thu nếu có
  const revenue = recentOrders.reduce((s, o) => s + (Number(o.total) || 0), 0);

  return { ordersTotal, usersTotal, productsTotal, revenue, recentOrders };
}
