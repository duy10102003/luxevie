// backend/src/controllers/reportController.js
import ExcelJS from 'exceljs';
import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';

/**
 * Tạo file Excel báo cáo theo tháng
 * GET /api/report/export-excel?month=MM&year=YYYY
 */
export const exportExcel = async (req, res) => {
  try {
    const { month, year } = req.query;

    // Validate input
    const monthNum = parseInt(month, 10);
    const yearNum = parseInt(year, 10);

    if (!month || !year || monthNum < 1 || monthNum > 12 || yearNum < 2000) {
      return res.status(400).json({ 
        message: 'Tham số không hợp lệ. Yêu cầu: month (1-12) và year (>=2000)' 
      });
    }

    // Tính toán khoảng thời gian
    const startDate = new Date(yearNum, monthNum - 1, 1, 0, 0, 0, 0);
    const endDate = new Date(yearNum, monthNum, 0, 23, 59, 59, 999);

    // Tạo workbook mới
    const workbook = new ExcelJS.Workbook();
    
    // ========== SHEET 1: Đơn đặt hàng theo ngày (danh sách chi tiết) ==========
    const sheet1 = workbook.addWorksheet('Don_dat_hang_theo_ngay');
    
    // Tiêu đề sheet
    sheet1.columns = [
      { header: 'Ngày đặt hàng', key: 'orderDate', width: 15 },
      { header: 'ID đơn hàng', key: 'orderId', width: 18 },
      { header: 'Tên khách hàng', key: 'customerName', width: 25 },
      { header: 'SĐT khách hàng', key: 'customerPhone', width: 18 },
      { header: 'Địa chỉ giao hàng', key: 'shippingAddress', width: 50 },
      { header: 'Trạng thái đơn', key: 'status', width: 18 },
      { header: 'Tổng giá trị đơn (VNĐ)', key: 'total', width: 22 },
      { header: 'Phương thức thanh toán', key: 'paymentMethod', width: 22 },
      { header: 'Ghi chú / yêu cầu đặc biệt', key: 'note', width: 35 }
    ];

    // Style cho header
    sheet1.getRow(1).font = { bold: true, size: 12 };
    sheet1.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    sheet1.getRow(1).alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };

    // Lấy tất cả đơn hàng trong tháng/năm (danh sách chi tiết)
    const orders = await Order.find({
      createdAt: { $gte: startDate, $lte: endDate }
    })
      .populate('userId', 'name email')
      .sort({ createdAt: 1 }) // Sắp xếp theo ngày đặt hàng
      .lean();

    // Hàm format địa chỉ đầy đủ
    const formatAddress = (address) => {
      if (!address) return '';
      const parts = [
        address.line1,
        address.line2,
        address.ward,
        address.district,
        address.city
      ].filter(Boolean);
      return parts.join(', ');
    };

    // Hàm format tên phương thức thanh toán
    const formatPaymentMethod = (method) => {
      const map = {
        cod: 'Tiền mặt khi nhận hàng',
        bank: 'Chuyển khoản ngân hàng',
        momo: 'Ví MoMo',
        vnpay: 'VNPay',
        qr: 'QR Code',
        paypal: 'PayPal'
      };
      return map[method] || method || '';
    };

    // Hàm format trạng thái
    const formatStatus = (status) => {
      const map = {
        pending: 'Chờ xác nhận',
        confirmed: 'Đã xác nhận',
        processing: 'Đang xử lý',
        shipped: 'Đã gửi hàng',
        delivered: 'Đã giao hàng',
        cancelled: 'Đã hủy',
        refunded: 'Đã hoàn tiền'
      };
      return map[status] || status || '';
    };

    // Điền dữ liệu từng đơn hàng vào sheet
    for (const order of orders) {
      const orderDate = new Date(order.createdAt);
      const address = order.shippingAddress || {};
      const customerName = address.fullName || order.userId?.name || 'N/A';
      const customerPhone = address.phone || 'N/A';

      sheet1.addRow({
        orderDate: orderDate.toLocaleDateString('vi-VN', { 
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        }),
        orderId: order.code || order._id.toString().slice(-8),
        customerName: customerName,
        customerPhone: customerPhone,
        shippingAddress: formatAddress(address),
        status: formatStatus(order.status),
        total: order.total || 0,
        paymentMethod: formatPaymentMethod(order.paymentMethod),
        note: order.note || ''
      });
    }

    // Format các cột
    sheet1.getColumn('total').numFmt = '#,##0';
    sheet1.getColumn('orderDate').alignment = { horizontal: 'center' };
    sheet1.getColumn('status').alignment = { horizontal: 'center' };
    sheet1.getColumn('shippingAddress').alignment = { wrapText: true };
    sheet1.getColumn('note').alignment = { wrapText: true };

    // ========== SHEET 2: Doanh thu theo ngày ==========
    const sheet2 = workbook.addWorksheet('Doanh_thu_theo_ngay');

    sheet2.columns = [
      { header: 'Ngày', key: 'date', width: 15 },
      { header: 'Doanh thu trong ngày', key: 'revenue', width: 22 }
    ];

    sheet2.getRow(1).font = { bold: true, size: 12 };
    sheet2.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    sheet2.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Lấy dữ liệu doanh thu theo ngày (tất cả đơn hàng)
    const revenueByDay = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' },
            day: { $dayOfMonth: '$createdAt' }
          },
          revenue: { $sum: '$total' }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1, '_id.day': 1 }
      }
    ]);

    const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
    let totalRevenue = 0;
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(yearNum, monthNum - 1, day);
      const dayData = revenueByDay.find(d => 
        d._id.day === day && 
        d._id.month === monthNum && 
        d._id.year === yearNum
      );

      const revenue = dayData?.revenue || 0;
      totalRevenue += revenue;

      sheet2.addRow({
        date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
        revenue: revenue
      });
    }

    // Thêm dòng tổng doanh thu
    sheet2.addRow({
      date: 'TỔNG DOANH THU THÁNG',
      revenue: totalRevenue
    });

    const totalRow = sheet2.getRow(sheet2.rowCount);
    totalRow.font = { bold: true, size: 12 };
    totalRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFD700' }
    };
    totalRow.alignment = { horizontal: 'right' };

    sheet2.getColumn('revenue').numFmt = '#,##0';
    sheet2.getColumn('revenue').alignment = { horizontal: 'right' };

    // ========== SHEET 3: Số lượng sản phẩm theo tháng ==========
    const sheet3 = workbook.addWorksheet('San_pham_theo_thang');

    sheet3.columns = [
      { header: 'Tên sản phẩm', key: 'productName', width: 40 },
      { header: 'Mã sản phẩm (SKU)', key: 'sku', width: 20 },
      { header: 'Số lượng bán trong tháng', key: 'quantity', width: 25 }
    ];

    sheet3.getRow(1).font = { bold: true, size: 12 };
    sheet3.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' }
    };
    sheet3.getRow(1).alignment = { vertical: 'middle', horizontal: 'center' };

    // Lấy dữ liệu sản phẩm đã bán trong tháng
    const productsSold = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate, $lte: endDate }
        }
      },
      { $unwind: '$items' },
      {
        $group: {
          _id: {
            productId: '$items.productId',
            sku: '$items.sku',
            name: '$items.name'
          },
          totalQuantity: { $sum: '$items.qty' }
        }
      },
      {
        $sort: { totalQuantity: -1 }
      }
    ]);

    let totalQuantityAll = 0;
    for (const product of productsSold) {
      totalQuantityAll += product.totalQuantity;
      sheet3.addRow({
        productName: product._id.name || 'N/A',
        sku: product._id.sku || 'N/A',
        quantity: product.totalQuantity
      });
    }

    // Thêm dòng tổng số lượng
    sheet3.addRow({
      productName: 'TỔNG SỐ LƯỢNG TẤT CẢ SẢN PHẨM',
      sku: '',
      quantity: totalQuantityAll
    });

    const totalQtyRow = sheet3.getRow(sheet3.rowCount);
    totalQtyRow.font = { bold: true, size: 12 };
    totalQtyRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFFFD700' }
    };
    totalQtyRow.alignment = { horizontal: 'right' };

    sheet3.getColumn('quantity').alignment = { horizontal: 'right' };

    // Thiết lập header response và stream file
    const fileName = `baocao-thang-${monthNum.toString().padStart(2, '0')}-${yearNum}.xlsx`;
    
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    );
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${fileName}"`
    );

    // Gửi file về client
    await workbook.xlsx.write(res);
    res.end();

  } catch (error) {
    console.error('Error exporting Excel:', error);
    res.status(500).json({ message: 'Lỗi khi xuất báo cáo Excel', error: error.message });
  }
};

