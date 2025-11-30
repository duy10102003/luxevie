import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";

export default function AdminTopbar(){
  const { user, logout } = useAuth();
  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
      <div className="h-14 px-4 md:px-6 flex items-center justify-between">
        <div className="font-medium">Admin Dashboard</div>
        <div className="flex items-center gap-2">
          <Link to="/" className="text-sm px-3 py-1.5 rounded-lg hover:bg-gray-100">View site</Link>
          <div className="h-6 w-px bg-gray-200" />
          <div className="text-sm text-gray-600">{user?.name || user?.email}</div>
          <button onClick={logout} className="text-sm px-3 py-1.5 rounded-lg hover:bg-gray-100 text-red-600">
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
