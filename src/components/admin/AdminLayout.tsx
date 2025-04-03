import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="pl-[16rem] min-h-screen">
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
} 