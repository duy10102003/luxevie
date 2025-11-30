import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Component để xử lý scroll behavior khi chuyển route
 * Tự động scroll về đầu trang khi load trang mới
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll về đầu trang khi route thay đổi
    // Sử dụng requestAnimationFrame để đảm bảo scroll sau khi DOM đã render
    const scrollToTop = () => {
      // Scroll window
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto' // 'auto' để scroll ngay lập tức (tương thích tốt hơn 'instant')
      });
      
      // Scroll documentElement (để đảm bảo hoạt động trên mọi trình duyệt)
      if (document.documentElement) {
        document.documentElement.scrollTop = 0;
      }
      
      // Scroll body (fallback cho một số trình duyệt cũ)
      if (document.body) {
        document.body.scrollTop = 0;
      }
    };

    // Sử dụng requestAnimationFrame để đảm bảo scroll sau khi DOM render
    const frameId = requestAnimationFrame(() => {
      scrollToTop();
    });

    return () => cancelAnimationFrame(frameId);
  }, [pathname]);

  return null;
}

