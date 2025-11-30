import { useState } from 'react';
import AdminSidebar from '../../pages/admin/AdminSidebar';
import AdminTopbar from '../../pages/admin/AdminTopbar';

export default function AdminShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="admin-wrap">
      <aside className={`admin-aside ${collapsed ? 'collapsed' : ''}`}>
        <div className="admin-brand">
          <img 
            src="https://res.cloudinary.com/dqawqvxcr/image/upload/v1761117182/LuxeVie_2_zvsptx.png" 
            alt="LuxeVie Logo" 
            className="logo h-10 w-auto object-contain"
            style={{ maxWidth: '150px' }}
          />
        </div>
        <AdminSidebar onNavigate={() => window.scrollTo({ top: 0 })} />
      </aside>

      <div className="admin-main">
        <AdminTopbar onToggleSide={() => setCollapsed(v => !v)} />
        <div className="admin-content">
          {children}
        </div>
      </div>
    </div>
  );
}